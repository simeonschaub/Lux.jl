import{_ as a,c as n,a2 as i,o as p}from"./chunks/framework.BS99Di-t.js";const E=JSON.parse('{"title":"Training a HyperNetwork on MNIST and FashionMNIST","description":"","frontmatter":{},"headers":[],"relativePath":"tutorials/intermediate/3_HyperNet.md","filePath":"tutorials/intermediate/3_HyperNet.md","lastUpdated":null}'),l={name:"tutorials/intermediate/3_HyperNet.md"};function e(t,s,h,c,k,r){return p(),n("div",null,s[0]||(s[0]=[i(`<h1 id="Training-a-HyperNetwork-on-MNIST-and-FashionMNIST" tabindex="-1">Training a HyperNetwork on MNIST and FashionMNIST <a class="header-anchor" href="#Training-a-HyperNetwork-on-MNIST-and-FashionMNIST" aria-label="Permalink to &quot;Training a HyperNetwork on MNIST and FashionMNIST {#Training-a-HyperNetwork-on-MNIST-and-FashionMNIST}&quot;">​</a></h1><h2 id="Package-Imports" tabindex="-1">Package Imports <a class="header-anchor" href="#Package-Imports" aria-label="Permalink to &quot;Package Imports {#Package-Imports}&quot;">​</a></h2><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">using</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Lux, ADTypes, ComponentArrays, LuxCUDA, MLDatasets, MLUtils, OneHotArrays, Optimisers,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      Printf, Random, Setfield, Statistics, Zygote</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">CUDA</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">allowscalar</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">false</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Precompiling Lux...</span></span>
<span class="line"><span>    509.5 ms  ✓ EnzymeCore</span></span>
<span class="line"><span>    507.6 ms  ✓ ArrayInterface</span></span>
<span class="line"><span>    571.6 ms  ✓ CpuId</span></span>
<span class="line"><span>    590.5 ms  ✓ DocStringExtensions</span></span>
<span class="line"><span>   1773.7 ms  ✓ UnsafeAtomics</span></span>
<span class="line"><span>    434.3 ms  ✓ JLLWrappers</span></span>
<span class="line"><span>   2332.4 ms  ✓ MacroTools</span></span>
<span class="line"><span>   1182.8 ms  ✓ ChainRulesCore</span></span>
<span class="line"><span>    356.2 ms  ✓ EnzymeCore → AdaptExt</span></span>
<span class="line"><span>    356.4 ms  ✓ ADTypes → ADTypesEnzymeCoreExt</span></span>
<span class="line"><span>    773.2 ms  ✓ Static</span></span>
<span class="line"><span>    331.0 ms  ✓ ArrayInterface → ArrayInterfaceGPUArraysCoreExt</span></span>
<span class="line"><span>    350.8 ms  ✓ ArrayInterface → ArrayInterfaceStaticArraysCoreExt</span></span>
<span class="line"><span>    468.3 ms  ✓ Atomix</span></span>
<span class="line"><span>    562.2 ms  ✓ LogExpFunctions</span></span>
<span class="line"><span>    556.9 ms  ✓ Hwloc_jll</span></span>
<span class="line"><span>    599.2 ms  ✓ OpenSpecFun_jll</span></span>
<span class="line"><span>    642.7 ms  ✓ CommonSubexpressions</span></span>
<span class="line"><span>   1640.4 ms  ✓ DispatchDoctor</span></span>
<span class="line"><span>   1465.8 ms  ✓ Setfield</span></span>
<span class="line"><span>    395.3 ms  ✓ ADTypes → ADTypesChainRulesCoreExt</span></span>
<span class="line"><span>    594.8 ms  ✓ MLDataDevices → MLDataDevicesChainRulesCoreExt</span></span>
<span class="line"><span>    369.9 ms  ✓ ArrayInterface → ArrayInterfaceChainRulesCoreExt</span></span>
<span class="line"><span>   1191.3 ms  ✓ Optimisers</span></span>
<span class="line"><span>    378.6 ms  ✓ BitTwiddlingConvenienceFunctions</span></span>
<span class="line"><span>    966.4 ms  ✓ CPUSummary</span></span>
<span class="line"><span>   1491.3 ms  ✓ StaticArrayInterface</span></span>
<span class="line"><span>   7859.3 ms  ✓ StaticArrays</span></span>
<span class="line"><span>   1305.5 ms  ✓ LogExpFunctions → LogExpFunctionsChainRulesCoreExt</span></span>
<span class="line"><span>    436.2 ms  ✓ DispatchDoctor → DispatchDoctorEnzymeCoreExt</span></span>
<span class="line"><span>    625.7 ms  ✓ DispatchDoctor → DispatchDoctorChainRulesCoreExt</span></span>
<span class="line"><span>   2178.3 ms  ✓ Hwloc</span></span>
<span class="line"><span>    409.6 ms  ✓ Optimisers → OptimisersEnzymeCoreExt</span></span>
<span class="line"><span>   2519.9 ms  ✓ SpecialFunctions</span></span>
<span class="line"><span>    418.7 ms  ✓ Optimisers → OptimisersAdaptExt</span></span>
<span class="line"><span>   1161.1 ms  ✓ LuxCore</span></span>
<span class="line"><span>    619.5 ms  ✓ PolyesterWeave</span></span>
<span class="line"><span>    491.7 ms  ✓ CloseOpenIntervals</span></span>
<span class="line"><span>    623.4 ms  ✓ LayoutPointers</span></span>
<span class="line"><span>    608.8 ms  ✓ StaticArrays → StaticArraysChainRulesCoreExt</span></span>
<span class="line"><span>    571.6 ms  ✓ StaticArrays → StaticArraysStatisticsExt</span></span>
<span class="line"><span>    625.9 ms  ✓ ConstructionBase → ConstructionBaseStaticArraysExt</span></span>
<span class="line"><span>    567.3 ms  ✓ Adapt → AdaptStaticArraysExt</span></span>
<span class="line"><span>    629.6 ms  ✓ StaticArrayInterface → StaticArrayInterfaceStaticArraysExt</span></span>
<span class="line"><span>   1674.5 ms  ✓ SpecialFunctions → SpecialFunctionsChainRulesCoreExt</span></span>
<span class="line"><span>    584.9 ms  ✓ LuxCore → LuxCoreChainRulesCoreExt</span></span>
<span class="line"><span>    446.9 ms  ✓ LuxCore → LuxCoreFunctorsExt</span></span>
<span class="line"><span>   2708.9 ms  ✓ WeightInitializers</span></span>
<span class="line"><span>    438.4 ms  ✓ LuxCore → LuxCoreEnzymeCoreExt</span></span>
<span class="line"><span>    455.7 ms  ✓ LuxCore → LuxCoreSetfieldExt</span></span>
<span class="line"><span>    451.9 ms  ✓ LuxCore → LuxCoreMLDataDevicesExt</span></span>
<span class="line"><span>   3545.5 ms  ✓ ForwardDiff</span></span>
<span class="line"><span>    911.6 ms  ✓ StrideArraysCore</span></span>
<span class="line"><span>    909.8 ms  ✓ WeightInitializers → WeightInitializersChainRulesCoreExt</span></span>
<span class="line"><span>    878.5 ms  ✓ ForwardDiff → ForwardDiffStaticArraysExt</span></span>
<span class="line"><span>    739.3 ms  ✓ Polyester</span></span>
<span class="line"><span>   4240.7 ms  ✓ KernelAbstractions</span></span>
<span class="line"><span>    681.6 ms  ✓ KernelAbstractions → LinearAlgebraExt</span></span>
<span class="line"><span>    742.6 ms  ✓ KernelAbstractions → EnzymeExt</span></span>
<span class="line"><span>   5072.2 ms  ✓ NNlib</span></span>
<span class="line"><span>    840.3 ms  ✓ NNlib → NNlibEnzymeCoreExt</span></span>
<span class="line"><span>    929.2 ms  ✓ NNlib → NNlibForwardDiffExt</span></span>
<span class="line"><span>   5596.5 ms  ✓ LuxLib</span></span>
<span class="line"><span>   8862.9 ms  ✓ Lux</span></span>
<span class="line"><span>  64 dependencies successfully precompiled in 44 seconds. 56 already precompiled.</span></span>
<span class="line"><span>Precompiling ComponentArrays...</span></span>
<span class="line"><span>    864.0 ms  ✓ ComponentArrays</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 1 seconds. 57 already precompiled.</span></span>
<span class="line"><span>Precompiling MLDataDevicesComponentArraysExt...</span></span>
<span class="line"><span>    504.1 ms  ✓ MLDataDevices → MLDataDevicesComponentArraysExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 1 seconds. 60 already precompiled.</span></span>
<span class="line"><span>Precompiling LuxComponentArraysExt...</span></span>
<span class="line"><span>    510.2 ms  ✓ ComponentArrays → ComponentArraysOptimisersExt</span></span>
<span class="line"><span>   1559.7 ms  ✓ Lux → LuxComponentArraysExt</span></span>
<span class="line"><span>   1949.4 ms  ✓ ComponentArrays → ComponentArraysKernelAbstractionsExt</span></span>
<span class="line"><span>  3 dependencies successfully precompiled in 2 seconds. 122 already precompiled.</span></span>
<span class="line"><span>Precompiling LuxCUDA...</span></span>
<span class="line"><span>    283.8 ms  ✓ LLVMLoopInfo</span></span>
<span class="line"><span>    331.3 ms  ✓ LaTeXStrings</span></span>
<span class="line"><span>    589.0 ms  ✓ InlineStrings</span></span>
<span class="line"><span>    337.6 ms  ✓ InvertedIndices</span></span>
<span class="line"><span>   1467.9 ms  ✓ CUDA_Runtime_Discovery</span></span>
<span class="line"><span>   1093.4 ms  ✓ Crayons</span></span>
<span class="line"><span>    385.5 ms  ✓ Scratch</span></span>
<span class="line"><span>   1255.6 ms  ✓ SentinelArrays</span></span>
<span class="line"><span>   2646.7 ms  ✓ TimerOutputs</span></span>
<span class="line"><span>    536.0 ms  ✓ NVTX_jll</span></span>
<span class="line"><span>    901.1 ms  ✓ CUDA_Driver_jll</span></span>
<span class="line"><span>    540.7 ms  ✓ demumble_jll</span></span>
<span class="line"><span>    554.5 ms  ✓ JuliaNVTXCallbacks_jll</span></span>
<span class="line"><span>   3640.4 ms  ✓ Test</span></span>
<span class="line"><span>   1638.0 ms  ✓ DataStructures</span></span>
<span class="line"><span>   1934.1 ms  ✓ StringManipulation</span></span>
<span class="line"><span>    991.6 ms  ✓ LazyArtifacts</span></span>
<span class="line"><span>   1060.6 ms  ✓ KernelAbstractions → SparseArraysExt</span></span>
<span class="line"><span>   1291.8 ms  ✓ NVTX</span></span>
<span class="line"><span>    508.5 ms  ✓ BFloat16s</span></span>
<span class="line"><span>    505.1 ms  ✓ SortingAlgorithms</span></span>
<span class="line"><span>   1307.1 ms  ✓ AbstractFFTs → AbstractFFTsTestExt</span></span>
<span class="line"><span>   1350.9 ms  ✓ LLVMExtra_jll</span></span>
<span class="line"><span>   2537.2 ms  ✓ CUDA_Runtime_jll</span></span>
<span class="line"><span>   1936.7 ms  ✓ CUDNN_jll</span></span>
<span class="line"><span>   6363.2 ms  ✓ LLVM</span></span>
<span class="line"><span>   1281.9 ms  ✓ LLVM → BFloat16sExt</span></span>
<span class="line"><span>   1807.2 ms  ✓ UnsafeAtomics → UnsafeAtomicsLLVM</span></span>
<span class="line"><span>   2125.4 ms  ✓ GPUArrays</span></span>
<span class="line"><span>  19472.9 ms  ✓ PrettyTables</span></span>
<span class="line"><span>  26393.5 ms  ✓ GPUCompiler</span></span>
<span class="line"><span>  45927.9 ms  ✓ DataFrames</span></span>
<span class="line"><span>  51112.9 ms  ✓ CUDA</span></span>
<span class="line"><span>   4915.9 ms  ✓ Atomix → AtomixCUDAExt</span></span>
<span class="line"><span>   7939.3 ms  ✓ cuDNN</span></span>
<span class="line"><span>   5161.8 ms  ✓ LuxCUDA</span></span>
<span class="line"><span>  36 dependencies successfully precompiled in 143 seconds. 64 already precompiled.</span></span>
<span class="line"><span>Precompiling MLDataDevicesGPUArraysExt...</span></span>
<span class="line"><span>   1310.1 ms  ✓ MLDataDevices → MLDataDevicesGPUArraysExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 1 seconds. 42 already precompiled.</span></span>
<span class="line"><span>Precompiling WeightInitializersGPUArraysExt...</span></span>
<span class="line"><span>   1381.7 ms  ✓ WeightInitializers → WeightInitializersGPUArraysExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 2 seconds. 46 already precompiled.</span></span>
<span class="line"><span>Precompiling ComponentArraysGPUArraysExt...</span></span>
<span class="line"><span>   1552.2 ms  ✓ ComponentArrays → ComponentArraysGPUArraysExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 2 seconds. 68 already precompiled.</span></span>
<span class="line"><span>Precompiling ParsersExt...</span></span>
<span class="line"><span>    457.7 ms  ✓ InlineStrings → ParsersExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 1 seconds. 9 already precompiled.</span></span>
<span class="line"><span>Precompiling ArrayInterfaceSparseArraysExt...</span></span>
<span class="line"><span>    574.9 ms  ✓ ArrayInterface → ArrayInterfaceSparseArraysExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 1 seconds. 7 already precompiled.</span></span>
<span class="line"><span>Precompiling ChainRulesCoreSparseArraysExt...</span></span>
<span class="line"><span>    613.9 ms  ✓ ChainRulesCore → ChainRulesCoreSparseArraysExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 1 seconds. 11 already precompiled.</span></span>
<span class="line"><span>Precompiling MLDataDevicesSparseArraysExt...</span></span>
<span class="line"><span>    636.5 ms  ✓ MLDataDevices → MLDataDevicesSparseArraysExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 1 seconds. 17 already precompiled.</span></span>
<span class="line"><span>Precompiling AbstractFFTsChainRulesCoreExt...</span></span>
<span class="line"><span>    454.9 ms  ✓ AbstractFFTs → AbstractFFTsChainRulesCoreExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 1 seconds. 9 already precompiled.</span></span>
<span class="line"><span>Precompiling ArrayInterfaceCUDAExt...</span></span>
<span class="line"><span>   4808.7 ms  ✓ ArrayInterface → ArrayInterfaceCUDAExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 5 seconds. 101 already precompiled.</span></span>
<span class="line"><span>Precompiling NNlibCUDAExt...</span></span>
<span class="line"><span>   4948.3 ms  ✓ CUDA → ChainRulesCoreExt</span></span>
<span class="line"><span>   5418.3 ms  ✓ NNlib → NNlibCUDAExt</span></span>
<span class="line"><span>  2 dependencies successfully precompiled in 6 seconds. 102 already precompiled.</span></span>
<span class="line"><span>Precompiling MLDataDevicesCUDAExt...</span></span>
<span class="line"><span>   4861.3 ms  ✓ MLDataDevices → MLDataDevicesCUDAExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 5 seconds. 104 already precompiled.</span></span>
<span class="line"><span>Precompiling LuxLibCUDAExt...</span></span>
<span class="line"><span>   5001.7 ms  ✓ CUDA → SpecialFunctionsExt</span></span>
<span class="line"><span>   5094.7 ms  ✓ CUDA → EnzymeCoreExt</span></span>
<span class="line"><span>   5660.7 ms  ✓ LuxLib → LuxLibCUDAExt</span></span>
<span class="line"><span>  3 dependencies successfully precompiled in 6 seconds. 167 already precompiled.</span></span>
<span class="line"><span>Precompiling WeightInitializersCUDAExt...</span></span>
<span class="line"><span>   5001.4 ms  ✓ WeightInitializers → WeightInitializersCUDAExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 5 seconds. 109 already precompiled.</span></span>
<span class="line"><span>Precompiling NNlibCUDACUDNNExt...</span></span>
<span class="line"><span>   5372.6 ms  ✓ NNlib → NNlibCUDACUDNNExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 6 seconds. 106 already precompiled.</span></span>
<span class="line"><span>Precompiling MLDataDevicescuDNNExt...</span></span>
<span class="line"><span>   4941.1 ms  ✓ MLDataDevices → MLDataDevicescuDNNExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 5 seconds. 107 already precompiled.</span></span>
<span class="line"><span>Precompiling LuxLibcuDNNExt...</span></span>
<span class="line"><span>   5639.7 ms  ✓ LuxLib → LuxLibcuDNNExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 6 seconds. 174 already precompiled.</span></span>
<span class="line"><span>Precompiling MLDatasets...</span></span>
<span class="line"><span>    345.4 ms  ✓ Glob</span></span>
<span class="line"><span>    372.2 ms  ✓ TensorCore</span></span>
<span class="line"><span>    391.2 ms  ✓ WorkerUtilities</span></span>
<span class="line"><span>    339.8 ms  ✓ StatsAPI</span></span>
<span class="line"><span>    397.5 ms  ✓ InverseFunctions</span></span>
<span class="line"><span>    749.1 ms  ✓ InitialValues</span></span>
<span class="line"><span>    908.5 ms  ✓ OffsetArrays</span></span>
<span class="line"><span>    419.3 ms  ✓ BufferedStreams</span></span>
<span class="line"><span>    336.8 ms  ✓ PrettyPrint</span></span>
<span class="line"><span>    390.3 ms  ✓ ShowCases</span></span>
<span class="line"><span>    307.4 ms  ✓ SimpleBufferStream</span></span>
<span class="line"><span>    563.4 ms  ✓ URIs</span></span>
<span class="line"><span>    330.1 ms  ✓ CompositionsBase</span></span>
<span class="line"><span>    319.7 ms  ✓ PtrArrays</span></span>
<span class="line"><span>    327.2 ms  ✓ DefineSingletons</span></span>
<span class="line"><span>    360.5 ms  ✓ LazyModules</span></span>
<span class="line"><span>    500.0 ms  ✓ TranscodingStreams</span></span>
<span class="line"><span>    415.0 ms  ✓ DelimitedFiles</span></span>
<span class="line"><span>    277.9 ms  ✓ PackageExtensionCompat</span></span>
<span class="line"><span>    331.1 ms  ✓ BitFlags</span></span>
<span class="line"><span>    363.6 ms  ✓ MappedArrays</span></span>
<span class="line"><span>    571.7 ms  ✓ ZipFile</span></span>
<span class="line"><span>    964.8 ms  ✓ Baselet</span></span>
<span class="line"><span>    761.8 ms  ✓ StructTypes</span></span>
<span class="line"><span>    991.1 ms  ✓ MbedTLS</span></span>
<span class="line"><span>    495.1 ms  ✓ LoggingExtras</span></span>
<span class="line"><span>    986.6 ms  ✓ SimpleTraits</span></span>
<span class="line"><span>    527.3 ms  ✓ MPIPreferences</span></span>
<span class="line"><span>    398.1 ms  ✓ ContextVariablesX</span></span>
<span class="line"><span>   1095.6 ms  ✓ SplittablesBase</span></span>
<span class="line"><span>    307.0 ms  ✓ InternedStrings</span></span>
<span class="line"><span>    460.8 ms  ✓ ExceptionUnwrapping</span></span>
<span class="line"><span>    559.4 ms  ✓ OpenSSL_jll</span></span>
<span class="line"><span>    552.1 ms  ✓ Chemfiles_jll</span></span>
<span class="line"><span>    578.6 ms  ✓ libaec_jll</span></span>
<span class="line"><span>    440.2 ms  ✓ MicrosoftMPI_jll</span></span>
<span class="line"><span>    532.0 ms  ✓ Libiconv_jll</span></span>
<span class="line"><span>   1058.1 ms  ✓ FilePathsBase</span></span>
<span class="line"><span>   4548.2 ms  ✓ FileIO</span></span>
<span class="line"><span>    718.4 ms  ✓ WeakRefStrings</span></span>
<span class="line"><span>  16790.1 ms  ✓ MLStyle</span></span>
<span class="line"><span>    585.5 ms  ✓ InverseFunctions → InverseFunctionsTestExt</span></span>
<span class="line"><span>    375.4 ms  ✓ InverseFunctions → InverseFunctionsDatesExt</span></span>
<span class="line"><span>   2096.8 ms  ✓ ColorVectorSpace</span></span>
<span class="line"><span>    432.1 ms  ✓ LogExpFunctions → LogExpFunctionsInverseFunctionsExt</span></span>
<span class="line"><span>    359.0 ms  ✓ OffsetArrays → OffsetArraysAdaptExt</span></span>
<span class="line"><span>    375.8 ms  ✓ StackViews</span></span>
<span class="line"><span>    410.5 ms  ✓ PaddedViews</span></span>
<span class="line"><span>    384.4 ms  ✓ NameResolution</span></span>
<span class="line"><span>    368.7 ms  ✓ CompositionsBase → CompositionsBaseInverseFunctionsExt</span></span>
<span class="line"><span>    443.4 ms  ✓ AliasTables</span></span>
<span class="line"><span>    425.5 ms  ✓ CodecZlib</span></span>
<span class="line"><span>    444.3 ms  ✓ StridedViews</span></span>
<span class="line"><span>   1562.0 ms  ✓ MPICH_jll</span></span>
<span class="line"><span>  20315.6 ms  ✓ Unitful</span></span>
<span class="line"><span>   1152.3 ms  ✓ MPItrampoline_jll</span></span>
<span class="line"><span>    554.5 ms  ✓ FLoopsBase</span></span>
<span class="line"><span>   1143.4 ms  ✓ OpenMPI_jll</span></span>
<span class="line"><span>    507.5 ms  ✓ StringEncodings</span></span>
<span class="line"><span>    519.1 ms  ✓ FilePathsBase → FilePathsBaseMmapExt</span></span>
<span class="line"><span>   1835.8 ms  ✓ OpenSSL</span></span>
<span class="line"><span>   1131.6 ms  ✓ FilePathsBase → FilePathsBaseTestExt</span></span>
<span class="line"><span>   1542.9 ms  ✓ NPZ</span></span>
<span class="line"><span>   3423.8 ms  ✓ ColorSchemes</span></span>
<span class="line"><span>  10761.7 ms  ✓ JSON3</span></span>
<span class="line"><span>    430.9 ms  ✓ MosaicViews</span></span>
<span class="line"><span>   2892.5 ms  ✓ Accessors</span></span>
<span class="line"><span>   4306.3 ms  ✓ JuliaVariables</span></span>
<span class="line"><span>    533.2 ms  ✓ Unitful → ConstructionBaseUnitfulExt</span></span>
<span class="line"><span>   2227.6 ms  ✓ StatsBase</span></span>
<span class="line"><span>    537.3 ms  ✓ Unitful → InverseFunctionsUnitfulExt</span></span>
<span class="line"><span>   2288.0 ms  ✓ PeriodicTable</span></span>
<span class="line"><span>   2687.2 ms  ✓ UnitfulAtomic</span></span>
<span class="line"><span>   1741.8 ms  ✓ HDF5_jll</span></span>
<span class="line"><span>   2339.8 ms  ✓ Pickle</span></span>
<span class="line"><span>  18864.2 ms  ✓ CSV</span></span>
<span class="line"><span>  18690.3 ms  ✓ HTTP</span></span>
<span class="line"><span>  33682.3 ms  ✓ JLD2</span></span>
<span class="line"><span>    576.3 ms  ✓ Accessors → AccessorsTestExt</span></span>
<span class="line"><span>    773.0 ms  ✓ Accessors → AccessorsDatesExt</span></span>
<span class="line"><span>    615.9 ms  ✓ Accessors → AccessorsUnitfulExt</span></span>
<span class="line"><span>    744.8 ms  ✓ BangBang</span></span>
<span class="line"><span>    702.0 ms  ✓ Accessors → AccessorsStaticArraysExt</span></span>
<span class="line"><span>   2161.7 ms  ✓ AtomsBase</span></span>
<span class="line"><span>   3009.0 ms  ✓ DataDeps</span></span>
<span class="line"><span>   1815.8 ms  ✓ FileIO → HTTPExt</span></span>
<span class="line"><span>   7431.9 ms  ✓ HDF5</span></span>
<span class="line"><span>    690.9 ms  ✓ BangBang → BangBangStaticArraysExt</span></span>
<span class="line"><span>    484.5 ms  ✓ BangBang → BangBangChainRulesCoreExt</span></span>
<span class="line"><span>    471.0 ms  ✓ BangBang → BangBangTablesExt</span></span>
<span class="line"><span>   1667.5 ms  ✓ BangBang → BangBangDataFramesExt</span></span>
<span class="line"><span>    843.7 ms  ✓ MicroCollections</span></span>
<span class="line"><span>   2238.1 ms  ✓ Chemfiles</span></span>
<span class="line"><span>   2335.9 ms  ✓ MAT</span></span>
<span class="line"><span>   2539.0 ms  ✓ Transducers</span></span>
<span class="line"><span>    644.4 ms  ✓ Transducers → TransducersAdaptExt</span></span>
<span class="line"><span>   1410.4 ms  ✓ Transducers → TransducersDataFramesExt</span></span>
<span class="line"><span>  17956.0 ms  ✓ ImageCore</span></span>
<span class="line"><span>   2004.8 ms  ✓ ImageBase</span></span>
<span class="line"><span>   1806.1 ms  ✓ ImageShow</span></span>
<span class="line"><span>   5168.1 ms  ✓ FLoops</span></span>
<span class="line"><span>   6006.6 ms  ✓ MLUtils</span></span>
<span class="line"><span>   8796.6 ms  ✓ MLDatasets</span></span>
<span class="line"><span>  103 dependencies successfully precompiled in 98 seconds. 95 already precompiled.</span></span>
<span class="line"><span>Precompiling MLDataDevicesMLUtilsExt...</span></span>
<span class="line"><span>   1568.1 ms  ✓ MLDataDevices → MLDataDevicesMLUtilsExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 2 seconds. 102 already precompiled.</span></span>
<span class="line"><span>Precompiling LuxMLUtilsExt...</span></span>
<span class="line"><span>   2166.2 ms  ✓ Lux → LuxMLUtilsExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 3 seconds. 177 already precompiled.</span></span>
<span class="line"><span>Precompiling OneHotArrays...</span></span>
<span class="line"><span>    926.3 ms  ✓ OneHotArrays</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 1 seconds. 28 already precompiled.</span></span>
<span class="line"><span>Precompiling MLDataDevicesOneHotArraysExt...</span></span>
<span class="line"><span>    711.7 ms  ✓ MLDataDevices → MLDataDevicesOneHotArraysExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 1 seconds. 35 already precompiled.</span></span>
<span class="line"><span>Precompiling Zygote...</span></span>
<span class="line"><span>   1037.6 ms  ✓ ZygoteRules</span></span>
<span class="line"><span>   1837.3 ms  ✓ IRTools</span></span>
<span class="line"><span>   5207.1 ms  ✓ ChainRules</span></span>
<span class="line"><span>  32792.5 ms  ✓ Zygote</span></span>
<span class="line"><span>  4 dependencies successfully precompiled in 38 seconds. 82 already precompiled.</span></span>
<span class="line"><span>Precompiling AccessorsStructArraysExt...</span></span>
<span class="line"><span>    481.8 ms  ✓ Accessors → AccessorsStructArraysExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 1 seconds. 16 already precompiled.</span></span>
<span class="line"><span>Precompiling BangBangStructArraysExt...</span></span>
<span class="line"><span>    486.3 ms  ✓ BangBang → BangBangStructArraysExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 1 seconds. 22 already precompiled.</span></span>
<span class="line"><span>Precompiling StructArraysStaticArraysExt...</span></span>
<span class="line"><span>    762.4 ms  ✓ StructArrays → StructArraysStaticArraysExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 1 seconds. 18 already precompiled.</span></span>
<span class="line"><span>Precompiling ArrayInterfaceChainRulesExt...</span></span>
<span class="line"><span>    766.2 ms  ✓ ArrayInterface → ArrayInterfaceChainRulesExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 1 seconds. 39 already precompiled.</span></span>
<span class="line"><span>Precompiling MLDataDevicesChainRulesExt...</span></span>
<span class="line"><span>    824.9 ms  ✓ MLDataDevices → MLDataDevicesChainRulesExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 1 seconds. 40 already precompiled.</span></span>
<span class="line"><span>Precompiling MLDataDevicesFillArraysExt...</span></span>
<span class="line"><span>    430.3 ms  ✓ MLDataDevices → MLDataDevicesFillArraysExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 0 seconds. 15 already precompiled.</span></span>
<span class="line"><span>Precompiling MLDataDevicesZygoteExt...</span></span>
<span class="line"><span>   1628.8 ms  ✓ MLDataDevices → MLDataDevicesZygoteExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 2 seconds. 93 already precompiled.</span></span>
<span class="line"><span>Precompiling LuxZygoteExt...</span></span>
<span class="line"><span>   2866.2 ms  ✓ Lux → LuxZygoteExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 3 seconds. 163 already precompiled.</span></span>
<span class="line"><span>Precompiling ComponentArraysZygoteExt...</span></span>
<span class="line"><span>   1616.8 ms  ✓ ComponentArrays → ComponentArraysZygoteExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 2 seconds. 99 already precompiled.</span></span>
<span class="line"><span>Precompiling ZygoteColorsExt...</span></span>
<span class="line"><span>   1816.7 ms  ✓ Zygote → ZygoteColorsExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 2 seconds. 89 already precompiled.</span></span></code></pre></div><h2 id="Loading-Datasets" tabindex="-1">Loading Datasets <a class="header-anchor" href="#Loading-Datasets" aria-label="Permalink to &quot;Loading Datasets {#Loading-Datasets}&quot;">​</a></h2><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> load_dataset</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Type{dset}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, n_train</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Union{Nothing, Int}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        n_eval</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Union{Nothing, Int}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, batchsize</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Int</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">where</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {dset}</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> n_train </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">===</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> nothing</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        imgs, labels </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> dset</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">:train</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    else</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        imgs, labels </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> dset</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">:train</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)[</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">n_train]</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    end</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    x_train, y_train </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> reshape</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(imgs, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">28</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">28</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, n_train), </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">onehotbatch</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(labels, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">9</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> n_eval </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">===</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> nothing</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        imgs, labels </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> dset</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">:test</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    else</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        imgs, labels </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> dset</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">:test</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)[</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">n_eval]</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    end</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    x_test, y_test </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> reshape</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(imgs, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">28</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">28</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, n_eval), </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">onehotbatch</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(labels, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">9</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        DataLoader</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">((x_train, y_train); batchsize</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">min</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(batchsize, n_train), shuffle</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">),</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        DataLoader</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">((x_test, y_test); batchsize</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">min</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(batchsize, n_eval), shuffle</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">false</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    )</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> load_datasets</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(batchsize</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">256</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    n_train </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> parse</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(Bool, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">get</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">ENV</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;CI&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;false&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1024</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> :</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> nothing</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    n_eval </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> parse</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(Bool, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">get</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">ENV</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;CI&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;false&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 32</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> :</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> nothing</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> load_dataset</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.((MNIST, FashionMNIST), n_train, n_eval, batchsize)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">end</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>load_datasets (generic function with 2 methods)</span></span></code></pre></div><h2 id="Implement-a-HyperNet-Layer" tabindex="-1">Implement a HyperNet Layer <a class="header-anchor" href="#Implement-a-HyperNet-Layer" aria-label="Permalink to &quot;Implement a HyperNet Layer {#Implement-a-HyperNet-Layer}&quot;">​</a></h2><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> HyperNet</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        weight_generator</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Lux.AbstractLuxLayer</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, core_network</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Lux.AbstractLuxLayer</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    ca_axes </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Lux</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">initialparameters</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(Random</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">default_rng</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(), core_network) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">|&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">              ComponentArray </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">|&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">              getaxes</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> @compact</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(; ca_axes, weight_generator, core_network, dispatch</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">:HyperNet</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">do</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (x, y)</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        # Generate the weights</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        ps_new </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> ComponentArray</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">vec</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">weight_generator</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(x)), ca_axes)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        @return</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> core_network</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(y, ps_new)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    end</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">end</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>HyperNet (generic function with 1 method)</span></span></code></pre></div><p>Defining functions on the CompactLuxLayer requires some understanding of how the layer is structured, as such we don&#39;t recommend doing it unless you are familiar with the internals. In this case, we simply write it to ignore the initialization of the <code>core_network</code> parameters.</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Lux</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">initialparameters</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(rng</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">AbstractRNG</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, hn</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">CompactLuxLayer{:HyperNet}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (; weight_generator</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Lux</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">initialparameters</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(rng, hn</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">layers</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">weight_generator),)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">end</span></span></code></pre></div><h2 id="Create-and-Initialize-the-HyperNet" tabindex="-1">Create and Initialize the HyperNet <a class="header-anchor" href="#Create-and-Initialize-the-HyperNet" aria-label="Permalink to &quot;Create and Initialize the HyperNet {#Create-and-Initialize-the-HyperNet}&quot;">​</a></h2><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> create_model</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # Doesn&#39;t need to be a MLP can have any Lux Layer</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    core_network </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> Chain</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">FlattenLayer</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(), </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Dense</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">784</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">256</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, relu), </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Dense</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">256</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">))</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    weight_generator </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> Chain</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        Embedding</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =&gt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 32</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">),</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        Dense</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">32</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">64</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, relu),</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        Dense</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">64</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, Lux</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">parameterlength</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(core_network))</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    )</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    model </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> HyperNet</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(weight_generator, core_network)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> model</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">end</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>create_model (generic function with 1 method)</span></span></code></pre></div><h2 id="Define-Utility-Functions" tabindex="-1">Define Utility Functions <a class="header-anchor" href="#Define-Utility-Functions" aria-label="Permalink to &quot;Define Utility Functions {#Define-Utility-Functions}&quot;">​</a></h2><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> loss </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> CrossEntropyLoss</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(; logits</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Val</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">))</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> accuracy</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(model, ps, st, dataloader, data_idx)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    total_correct, total </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    st </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Lux</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">testmode</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(st)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (x, y) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">in</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> dataloader</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        target_class </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> onecold</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(y)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        predicted_class </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> onecold</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">first</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">model</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">((data_idx, x), ps, st)))</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        total_correct </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> sum</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(target_class </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.==</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> predicted_class)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        total </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> length</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(target_class)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    end</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> total_correct </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> total</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">end</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>accuracy (generic function with 1 method)</span></span></code></pre></div><h2 id="training" tabindex="-1">Training <a class="header-anchor" href="#training" aria-label="Permalink to &quot;Training&quot;">​</a></h2><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> train</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    model </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> create_model</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    dataloaders </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> load_datasets</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    dev </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> gpu_device</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    rng </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> Xoshiro</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    ps, st </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Lux</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">setup</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(rng, model) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">|&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> dev</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    train_state </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Training</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">TrainState</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(model, ps, st, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Adam</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0.001f0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">))</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    ### Lets train the model</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    nepochs </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 50</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> epoch </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">in</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">nepochs, data_idx </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">in</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        train_dataloader, test_dataloader </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> dataloaders[data_idx] </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.|&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> dev</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        stime </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> time</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (x, y) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">in</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> train_dataloader</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            (_, _, _, train_state) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Training</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">single_train_step!</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">                AutoZygote</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(), loss, ((data_idx, x), y), train_state)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        end</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        ttime </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> time</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> stime</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        train_acc </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> round</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">            accuracy</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(model, train_state</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">parameters,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                train_state</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">states, train_dataloader, data_idx) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 100</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            digits</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        test_acc </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> round</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">            accuracy</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(model, train_state</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">parameters,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                train_state</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">states, test_dataloader, data_idx) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 100</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            digits</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        data_name </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> data_idx </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">==</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> ?</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;MNIST&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> :</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;FashionMNIST&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        @printf</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;[%3d/%3d]</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\t</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">%12s</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\t</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">Time %3.5fs</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\t</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">Training Accuracy: %3.2f%%</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\t</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">Test \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">                 Accuracy: %3.2f%%</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\n</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> epoch nepochs data_name ttime train_acc test_acc</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    println</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    test_acc_list </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0.0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0.0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> data_idx </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">in</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        train_dataloader, test_dataloader </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> dataloaders[data_idx] </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.|&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> dev</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        train_acc </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> round</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">            accuracy</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(model, train_state</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">parameters,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                train_state</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">states, train_dataloader, data_idx) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 100</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            digits</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        test_acc </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> round</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">            accuracy</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(model, train_state</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">parameters,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                train_state</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">states, test_dataloader, data_idx) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 100</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            digits</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        data_name </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> data_idx </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">==</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> ?</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;MNIST&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> :</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;FashionMNIST&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        @printf</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;[FINAL]</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\t</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">%12s</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\t</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">Training Accuracy: %3.2f%%</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\t</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">Test Accuracy: \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">                 %3.2f%%</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\n</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> data_name train_acc test_acc</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        test_acc_list[data_idx] </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> test_acc</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    end</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> test_acc_list</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">test_acc_list </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> train</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[  1/ 50]	       MNIST	Time 85.49806s	Training Accuracy: 59.38%	Test Accuracy: 50.00%</span></span>
<span class="line"><span>[  1/ 50]	FashionMNIST	Time 0.02872s	Training Accuracy: 52.34%	Test Accuracy: 37.50%</span></span>
<span class="line"><span>[  2/ 50]	       MNIST	Time 0.02860s	Training Accuracy: 73.34%	Test Accuracy: 62.50%</span></span>
<span class="line"><span>[  2/ 50]	FashionMNIST	Time 0.02951s	Training Accuracy: 61.72%	Test Accuracy: 59.38%</span></span>
<span class="line"><span>[  3/ 50]	       MNIST	Time 0.02721s	Training Accuracy: 77.73%	Test Accuracy: 62.50%</span></span>
<span class="line"><span>[  3/ 50]	FashionMNIST	Time 0.02333s	Training Accuracy: 66.80%	Test Accuracy: 68.75%</span></span>
<span class="line"><span>[  4/ 50]	       MNIST	Time 0.02212s	Training Accuracy: 79.00%	Test Accuracy: 59.38%</span></span>
<span class="line"><span>[  4/ 50]	FashionMNIST	Time 0.02240s	Training Accuracy: 61.43%	Test Accuracy: 56.25%</span></span>
<span class="line"><span>[  5/ 50]	       MNIST	Time 0.02325s	Training Accuracy: 80.76%	Test Accuracy: 53.12%</span></span>
<span class="line"><span>[  5/ 50]	FashionMNIST	Time 0.02365s	Training Accuracy: 68.46%	Test Accuracy: 62.50%</span></span>
<span class="line"><span>[  6/ 50]	       MNIST	Time 0.02050s	Training Accuracy: 88.57%	Test Accuracy: 71.88%</span></span>
<span class="line"><span>[  6/ 50]	FashionMNIST	Time 0.02090s	Training Accuracy: 76.95%	Test Accuracy: 75.00%</span></span>
<span class="line"><span>[  7/ 50]	       MNIST	Time 0.02137s	Training Accuracy: 90.92%	Test Accuracy: 75.00%</span></span>
<span class="line"><span>[  7/ 50]	FashionMNIST	Time 0.02167s	Training Accuracy: 80.27%	Test Accuracy: 65.62%</span></span>
<span class="line"><span>[  8/ 50]	       MNIST	Time 0.02135s	Training Accuracy: 93.46%	Test Accuracy: 71.88%</span></span>
<span class="line"><span>[  8/ 50]	FashionMNIST	Time 0.02121s	Training Accuracy: 77.73%	Test Accuracy: 71.88%</span></span>
<span class="line"><span>[  9/ 50]	       MNIST	Time 0.02042s	Training Accuracy: 94.34%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[  9/ 50]	FashionMNIST	Time 0.02085s	Training Accuracy: 81.15%	Test Accuracy: 71.88%</span></span>
<span class="line"><span>[ 10/ 50]	       MNIST	Time 0.02297s	Training Accuracy: 95.31%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 10/ 50]	FashionMNIST	Time 0.02044s	Training Accuracy: 82.81%	Test Accuracy: 75.00%</span></span>
<span class="line"><span>[ 11/ 50]	       MNIST	Time 0.02066s	Training Accuracy: 96.09%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 11/ 50]	FashionMNIST	Time 0.02064s	Training Accuracy: 78.52%	Test Accuracy: 71.88%</span></span>
<span class="line"><span>[ 12/ 50]	       MNIST	Time 0.02271s	Training Accuracy: 98.14%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 12/ 50]	FashionMNIST	Time 0.02211s	Training Accuracy: 83.69%	Test Accuracy: 75.00%</span></span>
<span class="line"><span>[ 13/ 50]	       MNIST	Time 0.02141s	Training Accuracy: 98.93%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 13/ 50]	FashionMNIST	Time 0.02111s	Training Accuracy: 85.45%	Test Accuracy: 71.88%</span></span>
<span class="line"><span>[ 14/ 50]	       MNIST	Time 0.02333s	Training Accuracy: 99.32%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 14/ 50]	FashionMNIST	Time 0.02625s	Training Accuracy: 85.94%	Test Accuracy: 75.00%</span></span>
<span class="line"><span>[ 15/ 50]	       MNIST	Time 0.02123s	Training Accuracy: 99.41%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 15/ 50]	FashionMNIST	Time 0.02585s	Training Accuracy: 88.09%	Test Accuracy: 75.00%</span></span>
<span class="line"><span>[ 16/ 50]	       MNIST	Time 0.02199s	Training Accuracy: 99.51%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 16/ 50]	FashionMNIST	Time 0.02106s	Training Accuracy: 86.43%	Test Accuracy: 75.00%</span></span>
<span class="line"><span>[ 17/ 50]	       MNIST	Time 0.02088s	Training Accuracy: 99.90%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 17/ 50]	FashionMNIST	Time 0.02172s	Training Accuracy: 87.21%	Test Accuracy: 75.00%</span></span>
<span class="line"><span>[ 18/ 50]	       MNIST	Time 0.02174s	Training Accuracy: 99.90%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 18/ 50]	FashionMNIST	Time 0.02087s	Training Accuracy: 88.67%	Test Accuracy: 75.00%</span></span>
<span class="line"><span>[ 19/ 50]	       MNIST	Time 0.02183s	Training Accuracy: 100.00%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 19/ 50]	FashionMNIST	Time 0.02444s	Training Accuracy: 88.18%	Test Accuracy: 75.00%</span></span>
<span class="line"><span>[ 20/ 50]	       MNIST	Time 0.02056s	Training Accuracy: 100.00%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 20/ 50]	FashionMNIST	Time 0.02346s	Training Accuracy: 90.04%	Test Accuracy: 75.00%</span></span>
<span class="line"><span>[ 21/ 50]	       MNIST	Time 0.02323s	Training Accuracy: 100.00%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 21/ 50]	FashionMNIST	Time 0.02242s	Training Accuracy: 90.72%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 22/ 50]	       MNIST	Time 0.02596s	Training Accuracy: 100.00%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 22/ 50]	FashionMNIST	Time 0.02046s	Training Accuracy: 90.43%	Test Accuracy: 75.00%</span></span>
<span class="line"><span>[ 23/ 50]	       MNIST	Time 0.02303s	Training Accuracy: 100.00%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 23/ 50]	FashionMNIST	Time 0.02198s	Training Accuracy: 91.21%	Test Accuracy: 75.00%</span></span>
<span class="line"><span>[ 24/ 50]	       MNIST	Time 0.02175s	Training Accuracy: 100.00%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 24/ 50]	FashionMNIST	Time 0.02011s	Training Accuracy: 90.43%	Test Accuracy: 68.75%</span></span>
<span class="line"><span>[ 25/ 50]	       MNIST	Time 0.02072s	Training Accuracy: 100.00%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 25/ 50]	FashionMNIST	Time 0.01960s	Training Accuracy: 91.50%	Test Accuracy: 71.88%</span></span>
<span class="line"><span>[ 26/ 50]	       MNIST	Time 0.02066s	Training Accuracy: 100.00%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 26/ 50]	FashionMNIST	Time 0.02137s	Training Accuracy: 92.68%	Test Accuracy: 75.00%</span></span>
<span class="line"><span>[ 27/ 50]	       MNIST	Time 0.02030s	Training Accuracy: 100.00%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 27/ 50]	FashionMNIST	Time 0.01976s	Training Accuracy: 91.70%	Test Accuracy: 75.00%</span></span>
<span class="line"><span>[ 28/ 50]	       MNIST	Time 0.02041s	Training Accuracy: 100.00%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 28/ 50]	FashionMNIST	Time 0.02017s	Training Accuracy: 93.75%	Test Accuracy: 75.00%</span></span>
<span class="line"><span>[ 29/ 50]	       MNIST	Time 0.02014s	Training Accuracy: 100.00%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 29/ 50]	FashionMNIST	Time 0.02695s	Training Accuracy: 93.36%	Test Accuracy: 71.88%</span></span>
<span class="line"><span>[ 30/ 50]	       MNIST	Time 0.02646s	Training Accuracy: 100.00%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 30/ 50]	FashionMNIST	Time 0.02190s	Training Accuracy: 94.34%	Test Accuracy: 71.88%</span></span>
<span class="line"><span>[ 31/ 50]	       MNIST	Time 0.02066s	Training Accuracy: 100.00%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 31/ 50]	FashionMNIST	Time 0.02064s	Training Accuracy: 95.31%	Test Accuracy: 75.00%</span></span>
<span class="line"><span>[ 32/ 50]	       MNIST	Time 0.02266s	Training Accuracy: 100.00%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 32/ 50]	FashionMNIST	Time 0.05037s	Training Accuracy: 96.00%	Test Accuracy: 71.88%</span></span>
<span class="line"><span>[ 33/ 50]	       MNIST	Time 0.03313s	Training Accuracy: 100.00%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 33/ 50]	FashionMNIST	Time 0.02076s	Training Accuracy: 95.80%	Test Accuracy: 75.00%</span></span>
<span class="line"><span>[ 34/ 50]	       MNIST	Time 0.02069s	Training Accuracy: 100.00%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 34/ 50]	FashionMNIST	Time 0.02207s	Training Accuracy: 96.19%	Test Accuracy: 71.88%</span></span>
<span class="line"><span>[ 35/ 50]	       MNIST	Time 0.02020s	Training Accuracy: 100.00%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 35/ 50]	FashionMNIST	Time 0.02216s	Training Accuracy: 95.51%	Test Accuracy: 71.88%</span></span>
<span class="line"><span>[ 36/ 50]	       MNIST	Time 0.02545s	Training Accuracy: 100.00%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 36/ 50]	FashionMNIST	Time 0.02125s	Training Accuracy: 96.29%	Test Accuracy: 71.88%</span></span>
<span class="line"><span>[ 37/ 50]	       MNIST	Time 0.02071s	Training Accuracy: 100.00%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 37/ 50]	FashionMNIST	Time 0.02301s	Training Accuracy: 95.51%	Test Accuracy: 71.88%</span></span>
<span class="line"><span>[ 38/ 50]	       MNIST	Time 0.02077s	Training Accuracy: 100.00%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 38/ 50]	FashionMNIST	Time 0.03168s	Training Accuracy: 96.00%	Test Accuracy: 71.88%</span></span>
<span class="line"><span>[ 39/ 50]	       MNIST	Time 0.04014s	Training Accuracy: 100.00%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 39/ 50]	FashionMNIST	Time 0.01995s	Training Accuracy: 96.29%	Test Accuracy: 71.88%</span></span>
<span class="line"><span>[ 40/ 50]	       MNIST	Time 0.01948s	Training Accuracy: 100.00%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 40/ 50]	FashionMNIST	Time 0.05399s	Training Accuracy: 96.58%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 41/ 50]	       MNIST	Time 0.02031s	Training Accuracy: 100.00%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 41/ 50]	FashionMNIST	Time 0.02227s	Training Accuracy: 97.66%	Test Accuracy: 71.88%</span></span>
<span class="line"><span>[ 42/ 50]	       MNIST	Time 0.05760s	Training Accuracy: 100.00%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 42/ 50]	FashionMNIST	Time 0.02523s	Training Accuracy: 97.95%	Test Accuracy: 75.00%</span></span>
<span class="line"><span>[ 43/ 50]	       MNIST	Time 0.02235s	Training Accuracy: 100.00%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 43/ 50]	FashionMNIST	Time 0.02218s	Training Accuracy: 98.34%	Test Accuracy: 75.00%</span></span>
<span class="line"><span>[ 44/ 50]	       MNIST	Time 0.02477s	Training Accuracy: 100.00%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 44/ 50]	FashionMNIST	Time 0.02141s	Training Accuracy: 98.34%	Test Accuracy: 75.00%</span></span>
<span class="line"><span>[ 45/ 50]	       MNIST	Time 0.02366s	Training Accuracy: 100.00%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 45/ 50]	FashionMNIST	Time 0.02179s	Training Accuracy: 98.54%	Test Accuracy: 71.88%</span></span>
<span class="line"><span>[ 46/ 50]	       MNIST	Time 0.02565s	Training Accuracy: 100.00%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 46/ 50]	FashionMNIST	Time 0.02231s	Training Accuracy: 98.44%	Test Accuracy: 75.00%</span></span>
<span class="line"><span>[ 47/ 50]	       MNIST	Time 0.02396s	Training Accuracy: 100.00%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 47/ 50]	FashionMNIST	Time 0.01967s	Training Accuracy: 98.73%	Test Accuracy: 75.00%</span></span>
<span class="line"><span>[ 48/ 50]	       MNIST	Time 0.02168s	Training Accuracy: 100.00%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 48/ 50]	FashionMNIST	Time 0.02142s	Training Accuracy: 98.63%	Test Accuracy: 75.00%</span></span>
<span class="line"><span>[ 49/ 50]	       MNIST	Time 0.02278s	Training Accuracy: 100.00%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 49/ 50]	FashionMNIST	Time 0.02141s	Training Accuracy: 98.83%	Test Accuracy: 75.00%</span></span>
<span class="line"><span>[ 50/ 50]	       MNIST	Time 0.02128s	Training Accuracy: 100.00%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[ 50/ 50]	FashionMNIST	Time 0.02082s	Training Accuracy: 98.93%	Test Accuracy: 75.00%</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[FINAL]	       MNIST	Training Accuracy: 100.00%	Test Accuracy: 78.12%</span></span>
<span class="line"><span>[FINAL]	FashionMNIST	Training Accuracy: 98.93%	Test Accuracy: 75.00%</span></span></code></pre></div><h2 id="appendix" tabindex="-1">Appendix <a class="header-anchor" href="#appendix" aria-label="Permalink to &quot;Appendix&quot;">​</a></h2><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">using</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> InteractiveUtils</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">InteractiveUtils</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">versioninfo</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">if</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> @isdefined</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(MLDataDevices)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    if</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> @isdefined</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(CUDA) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&amp;&amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> MLDataDevices</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">functional</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(CUDADevice)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        println</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        CUDA</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">versioninfo</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    if</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> @isdefined</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(AMDGPU) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&amp;&amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> MLDataDevices</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">functional</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(AMDGPUDevice)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        println</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        AMDGPU</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">versioninfo</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    end</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">end</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Julia Version 1.11.2</span></span>
<span class="line"><span>Commit 5e9a32e7af2 (2024-12-01 20:02 UTC)</span></span>
<span class="line"><span>Build Info:</span></span>
<span class="line"><span>  Official https://julialang.org/ release</span></span>
<span class="line"><span>Platform Info:</span></span>
<span class="line"><span>  OS: Linux (x86_64-linux-gnu)</span></span>
<span class="line"><span>  CPU: 48 × AMD EPYC 7402 24-Core Processor</span></span>
<span class="line"><span>  WORD_SIZE: 64</span></span>
<span class="line"><span>  LLVM: libLLVM-16.0.6 (ORCJIT, znver2)</span></span>
<span class="line"><span>Threads: 48 default, 0 interactive, 24 GC (on 2 virtual cores)</span></span>
<span class="line"><span>Environment:</span></span>
<span class="line"><span>  JULIA_CPU_THREADS = 2</span></span>
<span class="line"><span>  JULIA_DEPOT_PATH = /root/.cache/julia-buildkite-plugin/depots/01872db4-8c79-43af-ab7d-12abac4f24f6</span></span>
<span class="line"><span>  LD_LIBRARY_PATH = /usr/local/nvidia/lib:/usr/local/nvidia/lib64</span></span>
<span class="line"><span>  JULIA_PKG_SERVER = </span></span>
<span class="line"><span>  JULIA_NUM_THREADS = 48</span></span>
<span class="line"><span>  JULIA_CUDA_HARD_MEMORY_LIMIT = 100%</span></span>
<span class="line"><span>  JULIA_PKG_PRECOMPILE_AUTO = 0</span></span>
<span class="line"><span>  JULIA_DEBUG = Literate</span></span>
<span class="line"><span></span></span>
<span class="line"><span>CUDA runtime 12.6, artifact installation</span></span>
<span class="line"><span>CUDA driver 12.6</span></span>
<span class="line"><span>NVIDIA driver 560.35.3</span></span>
<span class="line"><span></span></span>
<span class="line"><span>CUDA libraries: </span></span>
<span class="line"><span>- CUBLAS: 12.6.4</span></span>
<span class="line"><span>- CURAND: 10.3.7</span></span>
<span class="line"><span>- CUFFT: 11.3.0</span></span>
<span class="line"><span>- CUSOLVER: 11.7.1</span></span>
<span class="line"><span>- CUSPARSE: 12.5.4</span></span>
<span class="line"><span>- CUPTI: 2024.3.2 (API 24.0.0)</span></span>
<span class="line"><span>- NVML: 12.0.0+560.35.3</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Julia packages: </span></span>
<span class="line"><span>- CUDA: 5.5.2</span></span>
<span class="line"><span>- CUDA_Driver_jll: 0.10.4+0</span></span>
<span class="line"><span>- CUDA_Runtime_jll: 0.15.5+0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Toolchain:</span></span>
<span class="line"><span>- Julia: 1.11.2</span></span>
<span class="line"><span>- LLVM: 16.0.6</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Environment:</span></span>
<span class="line"><span>- JULIA_CUDA_HARD_MEMORY_LIMIT: 100%</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1 device:</span></span>
<span class="line"><span>  0: NVIDIA A100-PCIE-40GB MIG 1g.5gb (sm_80, 3.170 GiB / 4.750 GiB available)</span></span></code></pre></div><hr><p><em>This page was generated using <a href="https://github.com/fredrikekre/Literate.jl" target="_blank" rel="noreferrer">Literate.jl</a>.</em></p>`,26)]))}const y=a(l,[["render",e]]);export{E as __pageData,y as default};
