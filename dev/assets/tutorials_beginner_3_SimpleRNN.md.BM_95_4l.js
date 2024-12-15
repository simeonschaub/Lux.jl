import{_ as a,c as n,a2 as i,o as p}from"./chunks/framework.BS99Di-t.js";const E=JSON.parse('{"title":"Training a Simple LSTM","description":"","frontmatter":{},"headers":[],"relativePath":"tutorials/beginner/3_SimpleRNN.md","filePath":"tutorials/beginner/3_SimpleRNN.md","lastUpdated":null}'),l={name:"tutorials/beginner/3_SimpleRNN.md"};function e(h,s,t,c,k,o){return p(),n("div",null,s[0]||(s[0]=[i(`<h1 id="Training-a-Simple-LSTM" tabindex="-1">Training a Simple LSTM <a class="header-anchor" href="#Training-a-Simple-LSTM" aria-label="Permalink to &quot;Training a Simple LSTM {#Training-a-Simple-LSTM}&quot;">​</a></h1><p>In this tutorial we will go over using a recurrent neural network to classify clockwise and anticlockwise spirals. By the end of this tutorial you will be able to:</p><ol><li><p>Create custom Lux models.</p></li><li><p>Become familiar with the Lux recurrent neural network API.</p></li><li><p>Training using Optimisers.jl and Zygote.jl.</p></li></ol><h2 id="Package-Imports" tabindex="-1">Package Imports <a class="header-anchor" href="#Package-Imports" aria-label="Permalink to &quot;Package Imports {#Package-Imports}&quot;">​</a></h2><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">using</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ADTypes, Lux, LuxCUDA, JLD2, MLUtils, Optimisers, Zygote, Printf, Random, Statistics</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Precompiling Lux...</span></span>
<span class="line"><span>    391.3 ms  ✓ ConcreteStructs</span></span>
<span class="line"><span>    360.7 ms  ✓ ArgCheck</span></span>
<span class="line"><span>   2643.5 ms  ✓ WeightInitializers</span></span>
<span class="line"><span>    927.9 ms  ✓ WeightInitializers → WeightInitializersChainRulesCoreExt</span></span>
<span class="line"><span>   9073.1 ms  ✓ Lux</span></span>
<span class="line"><span>  5 dependencies successfully precompiled in 13 seconds. 115 already precompiled.</span></span>
<span class="line"><span>Precompiling LuxCUDA...</span></span>
<span class="line"><span>   5454.5 ms  ✓ LuxCUDA</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 6 seconds. 99 already precompiled.</span></span>
<span class="line"><span>Precompiling WeightInitializersGPUArraysExt...</span></span>
<span class="line"><span>   1398.4 ms  ✓ WeightInitializers → WeightInitializersGPUArraysExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 2 seconds. 46 already precompiled.</span></span>
<span class="line"><span>Precompiling WeightInitializersCUDAExt...</span></span>
<span class="line"><span>   4925.4 ms  ✓ WeightInitializers → WeightInitializersCUDAExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 5 seconds. 109 already precompiled.</span></span>
<span class="line"><span>Precompiling JLD2...</span></span>
<span class="line"><span>    500.7 ms  ✓ TranscodingStreams</span></span>
<span class="line"><span>  32573.6 ms  ✓ JLD2</span></span>
<span class="line"><span>  2 dependencies successfully precompiled in 33 seconds. 30 already precompiled.</span></span>
<span class="line"><span>Precompiling MLUtils...</span></span>
<span class="line"><span>    363.1 ms  ✓ StatsAPI</span></span>
<span class="line"><span>    407.7 ms  ✓ InverseFunctions</span></span>
<span class="line"><span>    347.3 ms  ✓ PrettyPrint</span></span>
<span class="line"><span>    782.0 ms  ✓ InitialValues</span></span>
<span class="line"><span>    427.3 ms  ✓ ShowCases</span></span>
<span class="line"><span>    335.9 ms  ✓ CompositionsBase</span></span>
<span class="line"><span>    343.0 ms  ✓ DefineSingletons</span></span>
<span class="line"><span>    438.3 ms  ✓ DelimitedFiles</span></span>
<span class="line"><span>   1026.0 ms  ✓ Baselet</span></span>
<span class="line"><span>   1160.6 ms  ✓ SplittablesBase</span></span>
<span class="line"><span>    584.1 ms  ✓ InverseFunctions → InverseFunctionsTestExt</span></span>
<span class="line"><span>    389.7 ms  ✓ InverseFunctions → InverseFunctionsDatesExt</span></span>
<span class="line"><span>    437.9 ms  ✓ LogExpFunctions → LogExpFunctionsInverseFunctionsExt</span></span>
<span class="line"><span>    383.4 ms  ✓ NameResolution</span></span>
<span class="line"><span>    361.8 ms  ✓ CompositionsBase → CompositionsBaseInverseFunctionsExt</span></span>
<span class="line"><span>   2452.0 ms  ✓ StatsBase</span></span>
<span class="line"><span>   2782.3 ms  ✓ Accessors</span></span>
<span class="line"><span>    680.1 ms  ✓ Accessors → AccessorsTestExt</span></span>
<span class="line"><span>    779.6 ms  ✓ Accessors → AccessorsDatesExt</span></span>
<span class="line"><span>    774.4 ms  ✓ BangBang</span></span>
<span class="line"><span>    717.3 ms  ✓ Accessors → AccessorsStaticArraysExt</span></span>
<span class="line"><span>    526.9 ms  ✓ BangBang → BangBangChainRulesCoreExt</span></span>
<span class="line"><span>    716.8 ms  ✓ BangBang → BangBangStaticArraysExt</span></span>
<span class="line"><span>    498.2 ms  ✓ BangBang → BangBangTablesExt</span></span>
<span class="line"><span>    854.9 ms  ✓ MicroCollections</span></span>
<span class="line"><span>   2635.1 ms  ✓ Transducers</span></span>
<span class="line"><span>    649.0 ms  ✓ Transducers → TransducersAdaptExt</span></span>
<span class="line"><span>  17483.0 ms  ✓ MLStyle</span></span>
<span class="line"><span>   4103.7 ms  ✓ JuliaVariables</span></span>
<span class="line"><span>   5213.3 ms  ✓ FLoops</span></span>
<span class="line"><span>   6188.9 ms  ✓ MLUtils</span></span>
<span class="line"><span>  31 dependencies successfully precompiled in 34 seconds. 67 already precompiled.</span></span>
<span class="line"><span>Precompiling BangBangDataFramesExt...</span></span>
<span class="line"><span>   1631.6 ms  ✓ BangBang → BangBangDataFramesExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 2 seconds. 46 already precompiled.</span></span>
<span class="line"><span>Precompiling TransducersDataFramesExt...</span></span>
<span class="line"><span>   1378.4 ms  ✓ Transducers → TransducersDataFramesExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 2 seconds. 61 already precompiled.</span></span>
<span class="line"><span>Precompiling MLDataDevicesMLUtilsExt...</span></span>
<span class="line"><span>   1809.6 ms  ✓ MLDataDevices → MLDataDevicesMLUtilsExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 2 seconds. 102 already precompiled.</span></span>
<span class="line"><span>Precompiling LuxMLUtilsExt...</span></span>
<span class="line"><span>   2195.6 ms  ✓ Lux → LuxMLUtilsExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 3 seconds. 177 already precompiled.</span></span>
<span class="line"><span>Precompiling AccessorsStructArraysExt...</span></span>
<span class="line"><span>    477.0 ms  ✓ Accessors → AccessorsStructArraysExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 1 seconds. 16 already precompiled.</span></span>
<span class="line"><span>Precompiling BangBangStructArraysExt...</span></span>
<span class="line"><span>    496.7 ms  ✓ BangBang → BangBangStructArraysExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 1 seconds. 22 already precompiled.</span></span>
<span class="line"><span>Precompiling LuxZygoteExt...</span></span>
<span class="line"><span>   2860.3 ms  ✓ Lux → LuxZygoteExt</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 3 seconds. 163 already precompiled.</span></span></code></pre></div><h2 id="dataset" tabindex="-1">Dataset <a class="header-anchor" href="#dataset" aria-label="Permalink to &quot;Dataset&quot;">​</a></h2><p>We will use MLUtils to generate 500 (noisy) clockwise and 500 (noisy) anticlockwise spirals. Using this data we will create a <code>MLUtils.DataLoader</code>. Our dataloader will give us sequences of size 2 × seq_len × batch_size and we need to predict a binary value whether the sequence is clockwise or anticlockwise.</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> get_dataloaders</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(; dataset_size</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1000</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, sequence_length</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">50</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # Create the spirals</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    data </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [MLUtils</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Datasets</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">make_spiral</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(sequence_length) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> _ </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">in</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">dataset_size]</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # Get the labels</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    labels </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> vcat</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">repeat</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">([</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0.0f0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">], dataset_size </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">÷</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">repeat</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">([</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1.0f0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">], dataset_size </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">÷</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">))</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    clockwise_spirals </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">reshape</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(d[</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">][:, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">sequence_length], :, sequence_length, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">                         for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> d </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">in</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> data[</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(dataset_size </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">÷</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)]]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    anticlockwise_spirals </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">reshape</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                                 d[</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">][:, (sequence_length </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">end</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">], :, sequence_length, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">                             for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> d </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">in</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> data[((dataset_size </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">÷</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">end</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    x_data </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> Float32</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">cat</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(clockwise_spirals</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">...</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, anticlockwise_spirals</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">...</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">; dims</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">))</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # Split the dataset</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    (x_train, y_train), (x_val, y_val) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> splitobs</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">((x_data, labels); at</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0.8</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, shuffle</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # Create DataLoaders</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        # Use DataLoader to automatically minibatch and shuffle the data</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        DataLoader</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">collect</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.((x_train, y_train)); batchsize</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">128</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, shuffle</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">),</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        # Don&#39;t shuffle the validation data</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        DataLoader</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">collect</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.((x_val, y_val)); batchsize</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">128</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, shuffle</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">false</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">))</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">end</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>get_dataloaders (generic function with 1 method)</span></span></code></pre></div><h2 id="Creating-a-Classifier" tabindex="-1">Creating a Classifier <a class="header-anchor" href="#Creating-a-Classifier" aria-label="Permalink to &quot;Creating a Classifier {#Creating-a-Classifier}&quot;">​</a></h2><p>We will be extending the <code>Lux.AbstractLuxContainerLayer</code> type for our custom model since it will contain a lstm block and a classifier head.</p><p>We pass the fieldnames <code>lstm_cell</code> and <code>classifier</code> to the type to ensure that the parameters and states are automatically populated and we don&#39;t have to define <code>Lux.initialparameters</code> and <code>Lux.initialstates</code>.</p><p>To understand more about container layers, please look at <a href="/dev/manual/interface#Container-Layer">Container Layer</a>.</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">struct</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> SpiralClassifier{L, C} </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> Lux.AbstractLuxContainerLayer{(:lstm_cell, :classifier)}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    lstm_cell</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">L</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    classifier</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">C</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">end</span></span></code></pre></div><p>We won&#39;t define the model from scratch but rather use the <a href="/dev/api/Lux/layers#Lux.LSTMCell"><code>Lux.LSTMCell</code></a> and <a href="/dev/api/Lux/layers#Lux.Dense"><code>Lux.Dense</code></a>.</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> SpiralClassifier</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(in_dims, hidden_dims, out_dims)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> SpiralClassifier</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        LSTMCell</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(in_dims </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> hidden_dims), </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Dense</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(hidden_dims </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> out_dims, sigmoid))</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">end</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Main.var&quot;##230&quot;.SpiralClassifier</span></span></code></pre></div><p>We can use default Lux blocks – <code>Recurrence(LSTMCell(in_dims =&gt; hidden_dims)</code> – instead of defining the following. But let&#39;s still do it for the sake of it.</p><p>Now we need to define the behavior of the Classifier when it is invoked.</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (s</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">SpiralClassifier</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        x</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">AbstractArray{T, 3}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, ps</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">NamedTuple</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, st</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">NamedTuple</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">where</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {T}</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # First we will have to run the sequence through the LSTM Cell</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # The first call to LSTM Cell will create the initial hidden state</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # See that the parameters and states are automatically populated into a field called</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # \`lstm_cell\` We use \`eachslice\` to get the elements in the sequence without copying,</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # and \`Iterators.peel\` to split out the first element for LSTM initialization.</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    x_init, x_rest </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Iterators</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">peel</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(LuxOps</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">eachslice</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(x, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Val</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)))</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    (y, carry), st_lstm </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> s</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">lstm_cell</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(x_init, ps</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">lstm_cell, st</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">lstm_cell)</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # Now that we have the hidden state and memory in \`carry\` we will pass the input and</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # \`carry\` jointly</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> x </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">in</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> x_rest</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        (y, carry), st_lstm </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> s</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">lstm_cell</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">((x, carry), ps</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">lstm_cell, st_lstm)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    end</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # After running through the sequence we will pass the output through the classifier</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    y, st_classifier </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> s</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">classifier</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(y, ps</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">classifier, st</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">classifier)</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # Finally remember to create the updated state</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    st </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> merge</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(st, (classifier</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">st_classifier, lstm_cell</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">st_lstm))</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> vec</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(y), st</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">end</span></span></code></pre></div><h2 id="Using-the-@compact-API" tabindex="-1">Using the <code>@compact</code> API <a class="header-anchor" href="#Using-the-@compact-API" aria-label="Permalink to &quot;Using the \`@compact\` API {#Using-the-@compact-API}&quot;">​</a></h2><p>We can also define the model using the <a href="/dev/api/Lux/utilities#Lux.@compact"><code>Lux.@compact</code></a> API, which is a more concise way of defining models. This macro automatically handles the boilerplate code for you and as such we recommend this way of defining custom layers</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> SpiralClassifierCompact</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(in_dims, hidden_dims, out_dims)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    lstm_cell </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> LSTMCell</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(in_dims </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> hidden_dims)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    classifier </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> Dense</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(hidden_dims </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> out_dims, sigmoid)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> @compact</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(; lstm_cell, classifier) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">do</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> x</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">AbstractArray{T, 3}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> where</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {T}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        x_init, x_rest </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Iterators</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">peel</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(LuxOps</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">eachslice</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(x, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Val</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)))</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        y, carry </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> lstm_cell</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(x_init)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> x </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">in</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> x_rest</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            y, carry </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> lstm_cell</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">((x, carry))</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        end</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        @return</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> vec</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">classifier</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(y))</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    end</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">end</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SpiralClassifierCompact (generic function with 1 method)</span></span></code></pre></div><h2 id="Defining-Accuracy,-Loss-and-Optimiser" tabindex="-1">Defining Accuracy, Loss and Optimiser <a class="header-anchor" href="#Defining-Accuracy,-Loss-and-Optimiser" aria-label="Permalink to &quot;Defining Accuracy, Loss and Optimiser {#Defining-Accuracy,-Loss-and-Optimiser}&quot;">​</a></h2><p>Now let&#39;s define the binarycrossentropy loss. Typically it is recommended to use <code>logitbinarycrossentropy</code> since it is more numerically stable, but for the sake of simplicity we will use <code>binarycrossentropy</code>.</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> lossfn </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> BinaryCrossEntropyLoss</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> compute_loss</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(model, ps, st, (x, y))</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    ŷ, st_ </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> model</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(x, ps, st)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    loss </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> lossfn</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(ŷ, y)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> loss, st_, (; y_pred</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">ŷ)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">matches</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(y_pred, y_true) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> sum</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">((y_pred </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.&gt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0.5f0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.==</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> y_true)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">accuracy</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(y_pred, y_true) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> matches</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(y_pred, y_true) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> length</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(y_pred)</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>accuracy (generic function with 1 method)</span></span></code></pre></div><h2 id="Training-the-Model" tabindex="-1">Training the Model <a class="header-anchor" href="#Training-the-Model" aria-label="Permalink to &quot;Training the Model {#Training-the-Model}&quot;">​</a></h2><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> main</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(model_type)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    dev </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> gpu_device</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # Get the dataloaders</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    train_loader, val_loader </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> get_dataloaders</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.|&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> dev</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # Create the model</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    model </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> model_type</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    rng </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> Xoshiro</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    ps, st </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Lux</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">setup</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(rng, model) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">|&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> dev</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    train_state </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Training</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">TrainState</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(model, ps, st, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Adam</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0.01f0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">))</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> epoch </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">in</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">25</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        # Train the model</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (x, y) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">in</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> train_loader</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            (_, loss, _, train_state) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Training</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">single_train_step!</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">                AutoZygote</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(), lossfn, (x, y), train_state)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">            @printf</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;Epoch [%3d]: Loss %4.5f</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\n</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> epoch loss</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        # Validate the model</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        st_ </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Lux</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">testmode</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(train_state</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">states)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (x, y) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">in</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> val_loader</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            ŷ, st_ </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> model</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(x, train_state</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">parameters, st_)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            loss </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> lossfn</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(ŷ, y)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            acc </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> accuracy</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(ŷ, y)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">            @printf</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;Validation: Loss %4.5f Accuracy %4.5f</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\n</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> loss acc</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        end</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (train_state</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">parameters, train_state</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">states) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">|&gt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> cpu_device</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">ps_trained, st_trained </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> main</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(SpiralClassifier)</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Epoch [  1]: Loss 0.61916</span></span>
<span class="line"><span>Epoch [  1]: Loss 0.60189</span></span>
<span class="line"><span>Epoch [  1]: Loss 0.56146</span></span>
<span class="line"><span>Epoch [  1]: Loss 0.54111</span></span>
<span class="line"><span>Epoch [  1]: Loss 0.50975</span></span>
<span class="line"><span>Epoch [  1]: Loss 0.50071</span></span>
<span class="line"><span>Epoch [  1]: Loss 0.49563</span></span>
<span class="line"><span>Validation: Loss 0.47065 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.47042 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [  2]: Loss 0.46662</span></span>
<span class="line"><span>Epoch [  2]: Loss 0.45903</span></span>
<span class="line"><span>Epoch [  2]: Loss 0.44528</span></span>
<span class="line"><span>Epoch [  2]: Loss 0.42299</span></span>
<span class="line"><span>Epoch [  2]: Loss 0.40712</span></span>
<span class="line"><span>Epoch [  2]: Loss 0.39187</span></span>
<span class="line"><span>Epoch [  2]: Loss 0.38877</span></span>
<span class="line"><span>Validation: Loss 0.37402 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.37359 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [  3]: Loss 0.36565</span></span>
<span class="line"><span>Epoch [  3]: Loss 0.34962</span></span>
<span class="line"><span>Epoch [  3]: Loss 0.35652</span></span>
<span class="line"><span>Epoch [  3]: Loss 0.33559</span></span>
<span class="line"><span>Epoch [  3]: Loss 0.32685</span></span>
<span class="line"><span>Epoch [  3]: Loss 0.30081</span></span>
<span class="line"><span>Epoch [  3]: Loss 0.29701</span></span>
<span class="line"><span>Validation: Loss 0.28935 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.28877 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [  4]: Loss 0.29820</span></span>
<span class="line"><span>Epoch [  4]: Loss 0.27527</span></span>
<span class="line"><span>Epoch [  4]: Loss 0.26953</span></span>
<span class="line"><span>Epoch [  4]: Loss 0.26286</span></span>
<span class="line"><span>Epoch [  4]: Loss 0.23051</span></span>
<span class="line"><span>Epoch [  4]: Loss 0.21861</span></span>
<span class="line"><span>Epoch [  4]: Loss 0.23075</span></span>
<span class="line"><span>Validation: Loss 0.21944 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.21881 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [  5]: Loss 0.20713</span></span>
<span class="line"><span>Epoch [  5]: Loss 0.20077</span></span>
<span class="line"><span>Epoch [  5]: Loss 0.20581</span></span>
<span class="line"><span>Epoch [  5]: Loss 0.19768</span></span>
<span class="line"><span>Epoch [  5]: Loss 0.18165</span></span>
<span class="line"><span>Epoch [  5]: Loss 0.17400</span></span>
<span class="line"><span>Epoch [  5]: Loss 0.17263</span></span>
<span class="line"><span>Validation: Loss 0.16367 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.16310 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [  6]: Loss 0.16731</span></span>
<span class="line"><span>Epoch [  6]: Loss 0.15678</span></span>
<span class="line"><span>Epoch [  6]: Loss 0.14258</span></span>
<span class="line"><span>Epoch [  6]: Loss 0.13385</span></span>
<span class="line"><span>Epoch [  6]: Loss 0.12824</span></span>
<span class="line"><span>Epoch [  6]: Loss 0.13466</span></span>
<span class="line"><span>Epoch [  6]: Loss 0.12740</span></span>
<span class="line"><span>Validation: Loss 0.12027 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.11980 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [  7]: Loss 0.12226</span></span>
<span class="line"><span>Epoch [  7]: Loss 0.11178</span></span>
<span class="line"><span>Epoch [  7]: Loss 0.09963</span></span>
<span class="line"><span>Epoch [  7]: Loss 0.10256</span></span>
<span class="line"><span>Epoch [  7]: Loss 0.09610</span></span>
<span class="line"><span>Epoch [  7]: Loss 0.09578</span></span>
<span class="line"><span>Epoch [  7]: Loss 0.09210</span></span>
<span class="line"><span>Validation: Loss 0.08607 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.08572 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [  8]: Loss 0.08049</span></span>
<span class="line"><span>Epoch [  8]: Loss 0.07380</span></span>
<span class="line"><span>Epoch [  8]: Loss 0.08697</span></span>
<span class="line"><span>Epoch [  8]: Loss 0.07744</span></span>
<span class="line"><span>Epoch [  8]: Loss 0.06928</span></span>
<span class="line"><span>Epoch [  8]: Loss 0.05890</span></span>
<span class="line"><span>Epoch [  8]: Loss 0.05532</span></span>
<span class="line"><span>Validation: Loss 0.05978 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.05959 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [  9]: Loss 0.05509</span></span>
<span class="line"><span>Epoch [  9]: Loss 0.05501</span></span>
<span class="line"><span>Epoch [  9]: Loss 0.05558</span></span>
<span class="line"><span>Epoch [  9]: Loss 0.05500</span></span>
<span class="line"><span>Epoch [  9]: Loss 0.04766</span></span>
<span class="line"><span>Epoch [  9]: Loss 0.04345</span></span>
<span class="line"><span>Epoch [  9]: Loss 0.05087</span></span>
<span class="line"><span>Validation: Loss 0.04436 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.04424 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 10]: Loss 0.03863</span></span>
<span class="line"><span>Epoch [ 10]: Loss 0.04249</span></span>
<span class="line"><span>Epoch [ 10]: Loss 0.03942</span></span>
<span class="line"><span>Epoch [ 10]: Loss 0.04370</span></span>
<span class="line"><span>Epoch [ 10]: Loss 0.03895</span></span>
<span class="line"><span>Epoch [ 10]: Loss 0.03598</span></span>
<span class="line"><span>Epoch [ 10]: Loss 0.03989</span></span>
<span class="line"><span>Validation: Loss 0.03586 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.03577 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 11]: Loss 0.03409</span></span>
<span class="line"><span>Epoch [ 11]: Loss 0.03723</span></span>
<span class="line"><span>Epoch [ 11]: Loss 0.03184</span></span>
<span class="line"><span>Epoch [ 11]: Loss 0.03326</span></span>
<span class="line"><span>Epoch [ 11]: Loss 0.03085</span></span>
<span class="line"><span>Epoch [ 11]: Loss 0.03228</span></span>
<span class="line"><span>Epoch [ 11]: Loss 0.02537</span></span>
<span class="line"><span>Validation: Loss 0.03042 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.03034 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 12]: Loss 0.02991</span></span>
<span class="line"><span>Epoch [ 12]: Loss 0.02803</span></span>
<span class="line"><span>Epoch [ 12]: Loss 0.02963</span></span>
<span class="line"><span>Epoch [ 12]: Loss 0.02859</span></span>
<span class="line"><span>Epoch [ 12]: Loss 0.02685</span></span>
<span class="line"><span>Epoch [ 12]: Loss 0.02771</span></span>
<span class="line"><span>Epoch [ 12]: Loss 0.02288</span></span>
<span class="line"><span>Validation: Loss 0.02649 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.02642 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 13]: Loss 0.02649</span></span>
<span class="line"><span>Epoch [ 13]: Loss 0.02508</span></span>
<span class="line"><span>Epoch [ 13]: Loss 0.02400</span></span>
<span class="line"><span>Epoch [ 13]: Loss 0.02486</span></span>
<span class="line"><span>Epoch [ 13]: Loss 0.02466</span></span>
<span class="line"><span>Epoch [ 13]: Loss 0.02362</span></span>
<span class="line"><span>Epoch [ 13]: Loss 0.02344</span></span>
<span class="line"><span>Validation: Loss 0.02346 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.02340 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 14]: Loss 0.02141</span></span>
<span class="line"><span>Epoch [ 14]: Loss 0.02267</span></span>
<span class="line"><span>Epoch [ 14]: Loss 0.02169</span></span>
<span class="line"><span>Epoch [ 14]: Loss 0.02137</span></span>
<span class="line"><span>Epoch [ 14]: Loss 0.02180</span></span>
<span class="line"><span>Epoch [ 14]: Loss 0.02377</span></span>
<span class="line"><span>Epoch [ 14]: Loss 0.01867</span></span>
<span class="line"><span>Validation: Loss 0.02102 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.02097 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 15]: Loss 0.02047</span></span>
<span class="line"><span>Epoch [ 15]: Loss 0.01958</span></span>
<span class="line"><span>Epoch [ 15]: Loss 0.02003</span></span>
<span class="line"><span>Epoch [ 15]: Loss 0.01992</span></span>
<span class="line"><span>Epoch [ 15]: Loss 0.02069</span></span>
<span class="line"><span>Epoch [ 15]: Loss 0.01848</span></span>
<span class="line"><span>Epoch [ 15]: Loss 0.01750</span></span>
<span class="line"><span>Validation: Loss 0.01899 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.01894 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 16]: Loss 0.01950</span></span>
<span class="line"><span>Epoch [ 16]: Loss 0.01873</span></span>
<span class="line"><span>Epoch [ 16]: Loss 0.01846</span></span>
<span class="line"><span>Epoch [ 16]: Loss 0.01687</span></span>
<span class="line"><span>Epoch [ 16]: Loss 0.01680</span></span>
<span class="line"><span>Epoch [ 16]: Loss 0.01789</span></span>
<span class="line"><span>Epoch [ 16]: Loss 0.01458</span></span>
<span class="line"><span>Validation: Loss 0.01727 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.01723 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 17]: Loss 0.01790</span></span>
<span class="line"><span>Epoch [ 17]: Loss 0.01767</span></span>
<span class="line"><span>Epoch [ 17]: Loss 0.01650</span></span>
<span class="line"><span>Epoch [ 17]: Loss 0.01444</span></span>
<span class="line"><span>Epoch [ 17]: Loss 0.01655</span></span>
<span class="line"><span>Epoch [ 17]: Loss 0.01527</span></span>
<span class="line"><span>Epoch [ 17]: Loss 0.01449</span></span>
<span class="line"><span>Validation: Loss 0.01580 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.01576 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 18]: Loss 0.01491</span></span>
<span class="line"><span>Epoch [ 18]: Loss 0.01413</span></span>
<span class="line"><span>Epoch [ 18]: Loss 0.01454</span></span>
<span class="line"><span>Epoch [ 18]: Loss 0.01566</span></span>
<span class="line"><span>Epoch [ 18]: Loss 0.01420</span></span>
<span class="line"><span>Epoch [ 18]: Loss 0.01573</span></span>
<span class="line"><span>Epoch [ 18]: Loss 0.01669</span></span>
<span class="line"><span>Validation: Loss 0.01454 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.01450 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 19]: Loss 0.01495</span></span>
<span class="line"><span>Epoch [ 19]: Loss 0.01353</span></span>
<span class="line"><span>Epoch [ 19]: Loss 0.01269</span></span>
<span class="line"><span>Epoch [ 19]: Loss 0.01295</span></span>
<span class="line"><span>Epoch [ 19]: Loss 0.01401</span></span>
<span class="line"><span>Epoch [ 19]: Loss 0.01384</span></span>
<span class="line"><span>Epoch [ 19]: Loss 0.01593</span></span>
<span class="line"><span>Validation: Loss 0.01341 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.01337 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 20]: Loss 0.01301</span></span>
<span class="line"><span>Epoch [ 20]: Loss 0.01324</span></span>
<span class="line"><span>Epoch [ 20]: Loss 0.01360</span></span>
<span class="line"><span>Epoch [ 20]: Loss 0.01218</span></span>
<span class="line"><span>Epoch [ 20]: Loss 0.01218</span></span>
<span class="line"><span>Epoch [ 20]: Loss 0.01216</span></span>
<span class="line"><span>Epoch [ 20]: Loss 0.01178</span></span>
<span class="line"><span>Validation: Loss 0.01236 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.01232 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 21]: Loss 0.01175</span></span>
<span class="line"><span>Epoch [ 21]: Loss 0.01255</span></span>
<span class="line"><span>Epoch [ 21]: Loss 0.01066</span></span>
<span class="line"><span>Epoch [ 21]: Loss 0.01122</span></span>
<span class="line"><span>Epoch [ 21]: Loss 0.01165</span></span>
<span class="line"><span>Epoch [ 21]: Loss 0.01205</span></span>
<span class="line"><span>Epoch [ 21]: Loss 0.01214</span></span>
<span class="line"><span>Validation: Loss 0.01131 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.01127 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 22]: Loss 0.01173</span></span>
<span class="line"><span>Epoch [ 22]: Loss 0.01178</span></span>
<span class="line"><span>Epoch [ 22]: Loss 0.01024</span></span>
<span class="line"><span>Epoch [ 22]: Loss 0.01062</span></span>
<span class="line"><span>Epoch [ 22]: Loss 0.00994</span></span>
<span class="line"><span>Epoch [ 22]: Loss 0.00959</span></span>
<span class="line"><span>Epoch [ 22]: Loss 0.01010</span></span>
<span class="line"><span>Validation: Loss 0.01014 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.01010 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 23]: Loss 0.00974</span></span>
<span class="line"><span>Epoch [ 23]: Loss 0.01033</span></span>
<span class="line"><span>Epoch [ 23]: Loss 0.00914</span></span>
<span class="line"><span>Epoch [ 23]: Loss 0.00950</span></span>
<span class="line"><span>Epoch [ 23]: Loss 0.00919</span></span>
<span class="line"><span>Epoch [ 23]: Loss 0.00929</span></span>
<span class="line"><span>Epoch [ 23]: Loss 0.00763</span></span>
<span class="line"><span>Validation: Loss 0.00896 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.00893 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 24]: Loss 0.00864</span></span>
<span class="line"><span>Epoch [ 24]: Loss 0.00935</span></span>
<span class="line"><span>Epoch [ 24]: Loss 0.00775</span></span>
<span class="line"><span>Epoch [ 24]: Loss 0.00854</span></span>
<span class="line"><span>Epoch [ 24]: Loss 0.00766</span></span>
<span class="line"><span>Epoch [ 24]: Loss 0.00834</span></span>
<span class="line"><span>Epoch [ 24]: Loss 0.00885</span></span>
<span class="line"><span>Validation: Loss 0.00806 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.00803 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 25]: Loss 0.00777</span></span>
<span class="line"><span>Epoch [ 25]: Loss 0.00815</span></span>
<span class="line"><span>Epoch [ 25]: Loss 0.00729</span></span>
<span class="line"><span>Epoch [ 25]: Loss 0.00781</span></span>
<span class="line"><span>Epoch [ 25]: Loss 0.00719</span></span>
<span class="line"><span>Epoch [ 25]: Loss 0.00790</span></span>
<span class="line"><span>Epoch [ 25]: Loss 0.00607</span></span>
<span class="line"><span>Validation: Loss 0.00741 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.00739 Accuracy 1.00000</span></span></code></pre></div><p>We can also train the compact model with the exact same code!</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">ps_trained2, st_trained2 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> main</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(SpiralClassifierCompact)</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Epoch [  1]: Loss 0.62231</span></span>
<span class="line"><span>Epoch [  1]: Loss 0.59823</span></span>
<span class="line"><span>Epoch [  1]: Loss 0.56499</span></span>
<span class="line"><span>Epoch [  1]: Loss 0.54720</span></span>
<span class="line"><span>Epoch [  1]: Loss 0.52440</span></span>
<span class="line"><span>Epoch [  1]: Loss 0.49154</span></span>
<span class="line"><span>Epoch [  1]: Loss 0.47175</span></span>
<span class="line"><span>Validation: Loss 0.46033 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.47511 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [  2]: Loss 0.47363</span></span>
<span class="line"><span>Epoch [  2]: Loss 0.44451</span></span>
<span class="line"><span>Epoch [  2]: Loss 0.44976</span></span>
<span class="line"><span>Epoch [  2]: Loss 0.42418</span></span>
<span class="line"><span>Epoch [  2]: Loss 0.40830</span></span>
<span class="line"><span>Epoch [  2]: Loss 0.40150</span></span>
<span class="line"><span>Epoch [  2]: Loss 0.37807</span></span>
<span class="line"><span>Validation: Loss 0.36150 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.37960 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [  3]: Loss 0.37438</span></span>
<span class="line"><span>Epoch [  3]: Loss 0.35844</span></span>
<span class="line"><span>Epoch [  3]: Loss 0.35044</span></span>
<span class="line"><span>Epoch [  3]: Loss 0.33080</span></span>
<span class="line"><span>Epoch [  3]: Loss 0.31631</span></span>
<span class="line"><span>Epoch [  3]: Loss 0.31555</span></span>
<span class="line"><span>Epoch [  3]: Loss 0.28129</span></span>
<span class="line"><span>Validation: Loss 0.27557 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.29552 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [  4]: Loss 0.29199</span></span>
<span class="line"><span>Epoch [  4]: Loss 0.26695</span></span>
<span class="line"><span>Epoch [  4]: Loss 0.27784</span></span>
<span class="line"><span>Epoch [  4]: Loss 0.25290</span></span>
<span class="line"><span>Epoch [  4]: Loss 0.23464</span></span>
<span class="line"><span>Epoch [  4]: Loss 0.23376</span></span>
<span class="line"><span>Epoch [  4]: Loss 0.25421</span></span>
<span class="line"><span>Validation: Loss 0.20581 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.22593 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [  5]: Loss 0.21791</span></span>
<span class="line"><span>Epoch [  5]: Loss 0.20201</span></span>
<span class="line"><span>Epoch [  5]: Loss 0.20362</span></span>
<span class="line"><span>Epoch [  5]: Loss 0.18824</span></span>
<span class="line"><span>Epoch [  5]: Loss 0.18974</span></span>
<span class="line"><span>Epoch [  5]: Loss 0.17285</span></span>
<span class="line"><span>Epoch [  5]: Loss 0.18423</span></span>
<span class="line"><span>Validation: Loss 0.15122 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.16960 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [  6]: Loss 0.15527</span></span>
<span class="line"><span>Epoch [  6]: Loss 0.14673</span></span>
<span class="line"><span>Epoch [  6]: Loss 0.14852</span></span>
<span class="line"><span>Epoch [  6]: Loss 0.15074</span></span>
<span class="line"><span>Epoch [  6]: Loss 0.13272</span></span>
<span class="line"><span>Epoch [  6]: Loss 0.13625</span></span>
<span class="line"><span>Epoch [  6]: Loss 0.13172</span></span>
<span class="line"><span>Validation: Loss 0.10994 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.12509 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [  7]: Loss 0.11392</span></span>
<span class="line"><span>Epoch [  7]: Loss 0.11962</span></span>
<span class="line"><span>Epoch [  7]: Loss 0.11060</span></span>
<span class="line"><span>Epoch [  7]: Loss 0.10372</span></span>
<span class="line"><span>Epoch [  7]: Loss 0.10147</span></span>
<span class="line"><span>Epoch [  7]: Loss 0.08598</span></span>
<span class="line"><span>Epoch [  7]: Loss 0.09506</span></span>
<span class="line"><span>Validation: Loss 0.07859 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.08977 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [  8]: Loss 0.08252</span></span>
<span class="line"><span>Epoch [  8]: Loss 0.07982</span></span>
<span class="line"><span>Epoch [  8]: Loss 0.08326</span></span>
<span class="line"><span>Epoch [  8]: Loss 0.07138</span></span>
<span class="line"><span>Epoch [  8]: Loss 0.06840</span></span>
<span class="line"><span>Epoch [  8]: Loss 0.06374</span></span>
<span class="line"><span>Epoch [  8]: Loss 0.07095</span></span>
<span class="line"><span>Validation: Loss 0.05500 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.06245 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [  9]: Loss 0.05754</span></span>
<span class="line"><span>Epoch [  9]: Loss 0.05910</span></span>
<span class="line"><span>Epoch [  9]: Loss 0.05532</span></span>
<span class="line"><span>Epoch [  9]: Loss 0.04942</span></span>
<span class="line"><span>Epoch [  9]: Loss 0.04840</span></span>
<span class="line"><span>Epoch [  9]: Loss 0.04854</span></span>
<span class="line"><span>Epoch [  9]: Loss 0.04240</span></span>
<span class="line"><span>Validation: Loss 0.04080 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.04601 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 10]: Loss 0.04220</span></span>
<span class="line"><span>Epoch [ 10]: Loss 0.04113</span></span>
<span class="line"><span>Epoch [ 10]: Loss 0.04175</span></span>
<span class="line"><span>Epoch [ 10]: Loss 0.03982</span></span>
<span class="line"><span>Epoch [ 10]: Loss 0.04108</span></span>
<span class="line"><span>Epoch [ 10]: Loss 0.03658</span></span>
<span class="line"><span>Epoch [ 10]: Loss 0.03619</span></span>
<span class="line"><span>Validation: Loss 0.03295 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.03722 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 11]: Loss 0.03557</span></span>
<span class="line"><span>Epoch [ 11]: Loss 0.03232</span></span>
<span class="line"><span>Epoch [ 11]: Loss 0.03540</span></span>
<span class="line"><span>Epoch [ 11]: Loss 0.03459</span></span>
<span class="line"><span>Epoch [ 11]: Loss 0.03191</span></span>
<span class="line"><span>Epoch [ 11]: Loss 0.03071</span></span>
<span class="line"><span>Epoch [ 11]: Loss 0.02848</span></span>
<span class="line"><span>Validation: Loss 0.02789 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.03162 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 12]: Loss 0.02890</span></span>
<span class="line"><span>Epoch [ 12]: Loss 0.02951</span></span>
<span class="line"><span>Epoch [ 12]: Loss 0.02869</span></span>
<span class="line"><span>Epoch [ 12]: Loss 0.02950</span></span>
<span class="line"><span>Epoch [ 12]: Loss 0.02590</span></span>
<span class="line"><span>Epoch [ 12]: Loss 0.02746</span></span>
<span class="line"><span>Epoch [ 12]: Loss 0.03192</span></span>
<span class="line"><span>Validation: Loss 0.02424 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.02757 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 13]: Loss 0.02776</span></span>
<span class="line"><span>Epoch [ 13]: Loss 0.02532</span></span>
<span class="line"><span>Epoch [ 13]: Loss 0.02594</span></span>
<span class="line"><span>Epoch [ 13]: Loss 0.02400</span></span>
<span class="line"><span>Epoch [ 13]: Loss 0.02378</span></span>
<span class="line"><span>Epoch [ 13]: Loss 0.02297</span></span>
<span class="line"><span>Epoch [ 13]: Loss 0.02499</span></span>
<span class="line"><span>Validation: Loss 0.02140 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.02439 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 14]: Loss 0.02400</span></span>
<span class="line"><span>Epoch [ 14]: Loss 0.02163</span></span>
<span class="line"><span>Epoch [ 14]: Loss 0.02244</span></span>
<span class="line"><span>Epoch [ 14]: Loss 0.02133</span></span>
<span class="line"><span>Epoch [ 14]: Loss 0.02231</span></span>
<span class="line"><span>Epoch [ 14]: Loss 0.02141</span></span>
<span class="line"><span>Epoch [ 14]: Loss 0.02164</span></span>
<span class="line"><span>Validation: Loss 0.01913 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.02186 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 15]: Loss 0.02276</span></span>
<span class="line"><span>Epoch [ 15]: Loss 0.02025</span></span>
<span class="line"><span>Epoch [ 15]: Loss 0.01821</span></span>
<span class="line"><span>Epoch [ 15]: Loss 0.02074</span></span>
<span class="line"><span>Epoch [ 15]: Loss 0.01922</span></span>
<span class="line"><span>Epoch [ 15]: Loss 0.01930</span></span>
<span class="line"><span>Epoch [ 15]: Loss 0.01613</span></span>
<span class="line"><span>Validation: Loss 0.01725 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.01977 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 16]: Loss 0.01908</span></span>
<span class="line"><span>Epoch [ 16]: Loss 0.01932</span></span>
<span class="line"><span>Epoch [ 16]: Loss 0.01627</span></span>
<span class="line"><span>Epoch [ 16]: Loss 0.01750</span></span>
<span class="line"><span>Epoch [ 16]: Loss 0.01745</span></span>
<span class="line"><span>Epoch [ 16]: Loss 0.01897</span></span>
<span class="line"><span>Epoch [ 16]: Loss 0.01649</span></span>
<span class="line"><span>Validation: Loss 0.01566 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.01801 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 17]: Loss 0.01691</span></span>
<span class="line"><span>Epoch [ 17]: Loss 0.01825</span></span>
<span class="line"><span>Epoch [ 17]: Loss 0.01617</span></span>
<span class="line"><span>Epoch [ 17]: Loss 0.01581</span></span>
<span class="line"><span>Epoch [ 17]: Loss 0.01665</span></span>
<span class="line"><span>Epoch [ 17]: Loss 0.01526</span></span>
<span class="line"><span>Epoch [ 17]: Loss 0.01507</span></span>
<span class="line"><span>Validation: Loss 0.01430 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.01650 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 18]: Loss 0.01504</span></span>
<span class="line"><span>Epoch [ 18]: Loss 0.01427</span></span>
<span class="line"><span>Epoch [ 18]: Loss 0.01466</span></span>
<span class="line"><span>Epoch [ 18]: Loss 0.01577</span></span>
<span class="line"><span>Epoch [ 18]: Loss 0.01517</span></span>
<span class="line"><span>Epoch [ 18]: Loss 0.01596</span></span>
<span class="line"><span>Epoch [ 18]: Loss 0.01329</span></span>
<span class="line"><span>Validation: Loss 0.01313 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.01519 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 19]: Loss 0.01491</span></span>
<span class="line"><span>Epoch [ 19]: Loss 0.01353</span></span>
<span class="line"><span>Epoch [ 19]: Loss 0.01351</span></span>
<span class="line"><span>Epoch [ 19]: Loss 0.01454</span></span>
<span class="line"><span>Epoch [ 19]: Loss 0.01346</span></span>
<span class="line"><span>Epoch [ 19]: Loss 0.01371</span></span>
<span class="line"><span>Epoch [ 19]: Loss 0.01277</span></span>
<span class="line"><span>Validation: Loss 0.01212 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.01405 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 20]: Loss 0.01417</span></span>
<span class="line"><span>Epoch [ 20]: Loss 0.01313</span></span>
<span class="line"><span>Epoch [ 20]: Loss 0.01210</span></span>
<span class="line"><span>Epoch [ 20]: Loss 0.01273</span></span>
<span class="line"><span>Epoch [ 20]: Loss 0.01356</span></span>
<span class="line"><span>Epoch [ 20]: Loss 0.01196</span></span>
<span class="line"><span>Epoch [ 20]: Loss 0.01086</span></span>
<span class="line"><span>Validation: Loss 0.01122 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.01302 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 21]: Loss 0.01277</span></span>
<span class="line"><span>Epoch [ 21]: Loss 0.01263</span></span>
<span class="line"><span>Epoch [ 21]: Loss 0.01121</span></span>
<span class="line"><span>Epoch [ 21]: Loss 0.01191</span></span>
<span class="line"><span>Epoch [ 21]: Loss 0.01132</span></span>
<span class="line"><span>Epoch [ 21]: Loss 0.01165</span></span>
<span class="line"><span>Epoch [ 21]: Loss 0.01186</span></span>
<span class="line"><span>Validation: Loss 0.01038 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.01205 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 22]: Loss 0.01171</span></span>
<span class="line"><span>Epoch [ 22]: Loss 0.01102</span></span>
<span class="line"><span>Epoch [ 22]: Loss 0.01081</span></span>
<span class="line"><span>Epoch [ 22]: Loss 0.01024</span></span>
<span class="line"><span>Epoch [ 22]: Loss 0.01128</span></span>
<span class="line"><span>Epoch [ 22]: Loss 0.01061</span></span>
<span class="line"><span>Epoch [ 22]: Loss 0.01210</span></span>
<span class="line"><span>Validation: Loss 0.00952 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.01104 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 23]: Loss 0.01002</span></span>
<span class="line"><span>Epoch [ 23]: Loss 0.00979</span></span>
<span class="line"><span>Epoch [ 23]: Loss 0.01052</span></span>
<span class="line"><span>Epoch [ 23]: Loss 0.00904</span></span>
<span class="line"><span>Epoch [ 23]: Loss 0.01049</span></span>
<span class="line"><span>Epoch [ 23]: Loss 0.01013</span></span>
<span class="line"><span>Epoch [ 23]: Loss 0.00982</span></span>
<span class="line"><span>Validation: Loss 0.00856 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.00988 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 24]: Loss 0.00990</span></span>
<span class="line"><span>Epoch [ 24]: Loss 0.00878</span></span>
<span class="line"><span>Epoch [ 24]: Loss 0.00918</span></span>
<span class="line"><span>Epoch [ 24]: Loss 0.00880</span></span>
<span class="line"><span>Epoch [ 24]: Loss 0.00847</span></span>
<span class="line"><span>Epoch [ 24]: Loss 0.00850</span></span>
<span class="line"><span>Epoch [ 24]: Loss 0.00834</span></span>
<span class="line"><span>Validation: Loss 0.00762 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.00874 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 25]: Loss 0.00801</span></span>
<span class="line"><span>Epoch [ 25]: Loss 0.00788</span></span>
<span class="line"><span>Epoch [ 25]: Loss 0.00868</span></span>
<span class="line"><span>Epoch [ 25]: Loss 0.00848</span></span>
<span class="line"><span>Epoch [ 25]: Loss 0.00761</span></span>
<span class="line"><span>Epoch [ 25]: Loss 0.00715</span></span>
<span class="line"><span>Epoch [ 25]: Loss 0.00751</span></span>
<span class="line"><span>Validation: Loss 0.00691 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.00789 Accuracy 1.00000</span></span></code></pre></div><h2 id="Saving-the-Model" tabindex="-1">Saving the Model <a class="header-anchor" href="#Saving-the-Model" aria-label="Permalink to &quot;Saving the Model {#Saving-the-Model}&quot;">​</a></h2><p>We can save the model using JLD2 (and any other serialization library of your choice) Note that we transfer the model to CPU before saving. Additionally, we recommend that you don&#39;t save the model struct and only save the parameters and states.</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">@save</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;trained_model.jld2&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ps_trained st_trained</span></span></code></pre></div><p>Let&#39;s try loading the model</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">@load</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;trained_model.jld2&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ps_trained st_trained</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>2-element Vector{Symbol}:</span></span>
<span class="line"><span> :ps_trained</span></span>
<span class="line"><span> :st_trained</span></span></code></pre></div><h2 id="appendix" tabindex="-1">Appendix <a class="header-anchor" href="#appendix" aria-label="Permalink to &quot;Appendix&quot;">​</a></h2><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">using</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> InteractiveUtils</span></span>
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
<span class="line"><span>  0: NVIDIA A100-PCIE-40GB MIG 1g.5gb (sm_80, 4.109 GiB / 4.750 GiB available)</span></span></code></pre></div><hr><p><em>This page was generated using <a href="https://github.com/fredrikekre/Literate.jl" target="_blank" rel="noreferrer">Literate.jl</a>.</em></p>`,46)]))}const d=a(l,[["render",e]]);export{E as __pageData,d as default};
