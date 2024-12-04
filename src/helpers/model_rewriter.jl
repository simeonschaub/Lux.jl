function (dev::MLDataDevices.AbstractDevice)(model::AbstractLuxLayer, ps, st)
    return model, dev(ps), dev(st)
end

# TODO: Special Dispatch for AMDGPU to rewrite part of the model

function (dev::ReactantDevice)(model::AbstractLuxLayer, ps, st)
    rmodel = ReactantLayer(model, dev, [], [], [], [])
    return rmodel, dev(ps), dev(st)
end

# XXX: Should we have some type-asserts to make the output type-stable?

@concrete mutable struct ReactantLayer <: AbstractLuxWrapperLayer{:model}
    model <: AbstractLuxLayer
    dev <: ReactantDevice
    fwd_compiled_list::Vector{Any}
    fwd_input_structures::Vector{Any}
    vjp_compiled_list::Vector{Any}
    vjp_input_structure::Vector{Any}
end

# Explicitly disable the fallbacks for Reactant Layer
for (dev) in (:CPU, :CUDA, :AMDGPU, :Metal, :oneAPI)
    ldev = Symbol(dev, :Device)
    @eval function Adapt.adapt_storage(::$(ldev), x::ReactantLayer)
        error("`ReactantLayer` cannot be adapted to `$($ldev)`.")
    end
end

function Adapt.adapt_storage(dev::ReactantDevice, x::ReactantLayer)
    dev == x.dev || error("`ReactantLayer` cannot be adapted to `$(dev)`.")
    return x
end

for op in (:initialparameters, :initialstates)
    @eval LuxCore.$(op)(rng::AbstractRNG, l::ReactantLayer) = l.dev($(op)(rng, l.model))
end

function (l::ReactantLayer)(x, ps, st)
    # x_ra = l.dev(x)
end
