## This function allows us the rewrite the function call to get the gradients for `p`
@inline function Lux.__batched_jacobian(f::F, backend::AutoForwardDiff, x, p) where {F}
    return Lux.__batched_jacobian_impl(Base.Fix2(f, p), backend, x)
end

function CRC.rrule(
        cfg::CRC.RuleConfig{>:CRC.HasReverseMode}, ::typeof(Lux.__batched_jacobian),
        f::F, backend::AutoForwardDiff, x, y) where {F}
    grad_fn = (f_internal, x, args...) -> begin
        res, ∂f = CRC.rrule_via_ad(cfg, f_internal, x, args...)
        return ∂f(one(res))[2:end]
    end

    jac_fn = @closure (f_internal, x_in) -> Lux.__batched_jacobian_impl(
        f_internal, backend, x_in)

    res, pb_f = CRC.rrule_via_ad(
        cfg, Lux.__internal_ad_jacobian_call, jac_fn, grad_fn, f, x, y)
    ∇internal_nested_ad_capture = @closure Δ -> begin
        ∂s = pb_f(tuple(Δ))
        ∂x = ∂s[lastindex(∂s) - 1]
        ∂y = ∂s[lastindex(∂s)]
        return (CRC.NoTangent(), CRC.NoTangent(), CRC.NoTangent(), ∂x, ∂y)
    end

    return res, ∇internal_nested_ad_capture
end

@inline function Lux.__batched_jacobian(f::F, backend::AutoForwardDiff, x) where {F}
    return Lux.__batched_jacobian_impl(f, backend, x)
end

## Nested AD rewriting
for fType in Lux.AD_CONVERTIBLE_FUNCTIONS
    @eval @inline function Lux.__batched_jacobian(f::$(fType), backend::AutoForwardDiff, x)
        f_internal, y = Lux.__rewrite_ad_call(f)
        return Lux.__batched_jacobian(f_internal, backend, x, y)
    end
end

function Lux.__batched_jacobian_impl(f::F, backend::AutoForwardDiff{CK}, x) where {F, CK}
    x_size = size(x)
    __f = @closure x -> f(reshape(x, x_size))
    tag = backend.tag === nothing ? ForwardDiff.Tag(__f, eltype(x)) : backend.tag
    chunksize = (CK === nothing || CK ≤ 0) ?
                ForwardDiff.Chunk{min(prod(size(x)[1:(end - 1)]), 8)}() :
                ForwardDiff.Chunk{CK}()
    return __batched_forwarddiff_jacobian(
        __f, reshape(x, :, size(x, ndims(x))), typeof(tag), chunksize)
end

# TODO: This can be made more efficient by caching
@views function __batched_forwarddiff_jacobian(f::F, x::AbstractMatrix{T}, ::Type{Tag},
        ck::ForwardDiff.Chunk{CK}) where {F, T, Tag, CK}
    N, B = size(x)
    @assert CK≤N "chunksize must be less than or equal to the number of elements"

    nchunks, remainder = divrem(N, CK)

    dual_type = ForwardDiff.Dual{Tag, eltype(x), CK}
    partials_type = ForwardDiff.Partials{CK, eltype(x)}

    J_partial = __batched_forwarddiff_jacobian_chunk!!(
        nothing, f, x, Tag, ck, dual_type, partials_type, 1)

    nchunks == 1 && remainder == 0 && return J_partial

    J = similar(J_partial, size(J_partial, 1), N, B)
    J[:, 1:CK, :] .= J_partial

    for i in 2:nchunks
        __batched_forwarddiff_jacobian_chunk!!(
            J[:, ((i - 1) * CK + 1):(i * CK), :], f, x, Tag,
            ck, dual_type, partials_type, (i - 1) * CK + 1)
    end

    # for the remainder term we could construct a new Dual and Partial but that causes
    # problems on GPU. So we just do some extra work here.
    if remainder > 0
        __batched_forwarddiff_jacobian_chunk!!(J[:, (end - CK + 1):end, :], f, x, Tag,
            ck, dual_type, partials_type, N - CK + 1)
    end

    return J
end

@views function __batched_forwarddiff_jacobian_chunk!!(
        J_partial::Union{Nothing, AbstractArray{<:Real, 3}}, f::F,
        x::AbstractMatrix{T}, ::Type{Tag}, ::ForwardDiff.Chunk{CK}, ::Type{Dual},
        ::Type{Partials}, idx::Int) where {F, T, Tag, CK, Dual, Partials}
    N, B = size(x)

    idxs = idx:min(idx + CK - 1, N)
    idxs_prev = 1:(idx - 1)
    idxs_next = (idx + CK):N

    dev = get_device(x)

    partials = map(𝒾 -> Partials(ntuple(𝒿 -> ifelse(𝒾 == 𝒿, oneunit(T), zero(T)), CK)),
        dev(collect(1:length(idxs))))
    x_part_duals = Dual.(x[idxs, :], partials)

    if length(idxs_prev) == 0
        x_part_prev = similar(x_part_duals, 0, B)
    else
        x_part_prev = Dual.(x[idxs_prev, :],
            map(𝒾 -> Partials(ntuple(_ -> zero(T), CK)), dev(collect(1:length(idxs_prev)))))
    end

    if length(idxs_next) == 0
        x_part_next = similar(x_part_duals, 0, B)
    else
        x_part_next = Dual.(x[idxs_next, :],
            map(𝒾 -> Partials(ntuple(_ -> zero(T), CK)), dev(collect(1:length(idxs_next)))))
    end

    x_duals = vcat(x_part_prev, x_part_duals, x_part_next)
    y_duals_ = f(x_duals)
    @assert ndims(y_duals_) > 1 && size(y_duals_, ndims(y_duals_)) == B
    y_duals = reshape(y_duals_, :, B)

    partials_wrap(y, i) = ForwardDiff.partials(Tag, y, i)
    J_partial === nothing && return stack(i -> partials_wrap.(y_duals, i), 1:CK; dims=2)

    for i in 1:CK
        J_partial[:, i, :] .= partials_wrap.(y_duals, i)
    end
    return J_partial
end
