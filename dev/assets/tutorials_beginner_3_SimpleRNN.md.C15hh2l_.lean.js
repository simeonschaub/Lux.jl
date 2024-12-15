import{_ as a,c as n,a2 as i,o as p}from"./chunks/framework.BS99Di-t.js";const d=JSON.parse('{"title":"Training a Simple LSTM","description":"","frontmatter":{},"headers":[],"relativePath":"tutorials/beginner/3_SimpleRNN.md","filePath":"tutorials/beginner/3_SimpleRNN.md","lastUpdated":null}'),l={name:"tutorials/beginner/3_SimpleRNN.md"};function e(h,s,t,c,k,o){return p(),n("div",null,s[0]||(s[0]=[i(`<h1 id="Training-a-Simple-LSTM" tabindex="-1">Training a Simple LSTM <a class="header-anchor" href="#Training-a-Simple-LSTM" aria-label="Permalink to &quot;Training a Simple LSTM {#Training-a-Simple-LSTM}&quot;">​</a></h1><p>In this tutorial we will go over using a recurrent neural network to classify clockwise and anticlockwise spirals. By the end of this tutorial you will be able to:</p><ol><li><p>Create custom Lux models.</p></li><li><p>Become familiar with the Lux recurrent neural network API.</p></li><li><p>Training using Optimisers.jl and Zygote.jl.</p></li></ol><h2 id="Package-Imports" tabindex="-1">Package Imports <a class="header-anchor" href="#Package-Imports" aria-label="Permalink to &quot;Package Imports {#Package-Imports}&quot;">​</a></h2><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">using</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ADTypes, Lux, LuxCUDA, JLD2, MLUtils, Optimisers, Zygote, Printf, Random, Statistics</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Precompiling LuxCUDA...</span></span>
<span class="line"><span>   5773.4 ms  ✓ LuxCUDA</span></span>
<span class="line"><span>  1 dependency successfully precompiled in 6 seconds. 99 already precompiled.</span></span>
<span class="line"><span>Precompiling JLD2...</span></span>
<span class="line"><span>   4158.7 ms  ✓ FileIO</span></span>
<span class="line"><span>  33050.9 ms  ✓ JLD2</span></span>
<span class="line"><span>  2 dependencies successfully precompiled in 37 seconds. 30 already precompiled.</span></span></code></pre></div><h2 id="dataset" tabindex="-1">Dataset <a class="header-anchor" href="#dataset" aria-label="Permalink to &quot;Dataset&quot;">​</a></h2><p>We will use MLUtils to generate 500 (noisy) clockwise and 500 (noisy) anticlockwise spirals. Using this data we will create a <code>MLUtils.DataLoader</code>. Our dataloader will give us sequences of size 2 × seq_len × batch_size and we need to predict a binary value whether the sequence is clockwise or anticlockwise.</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> get_dataloaders</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(; dataset_size</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1000</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, sequence_length</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">50</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
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
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">ps_trained, st_trained </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> main</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(SpiralClassifier)</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Epoch [  1]: Loss 0.62400</span></span>
<span class="line"><span>Epoch [  1]: Loss 0.59264</span></span>
<span class="line"><span>Epoch [  1]: Loss 0.56060</span></span>
<span class="line"><span>Epoch [  1]: Loss 0.53932</span></span>
<span class="line"><span>Epoch [  1]: Loss 0.52967</span></span>
<span class="line"><span>Epoch [  1]: Loss 0.49943</span></span>
<span class="line"><span>Epoch [  1]: Loss 0.48679</span></span>
<span class="line"><span>Validation: Loss 0.46515 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.46122 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [  2]: Loss 0.46638</span></span>
<span class="line"><span>Epoch [  2]: Loss 0.44888</span></span>
<span class="line"><span>Epoch [  2]: Loss 0.43535</span></span>
<span class="line"><span>Epoch [  2]: Loss 0.43268</span></span>
<span class="line"><span>Epoch [  2]: Loss 0.41279</span></span>
<span class="line"><span>Epoch [  2]: Loss 0.40804</span></span>
<span class="line"><span>Epoch [  2]: Loss 0.38822</span></span>
<span class="line"><span>Validation: Loss 0.36702 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.36246 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [  3]: Loss 0.38228</span></span>
<span class="line"><span>Epoch [  3]: Loss 0.35011</span></span>
<span class="line"><span>Epoch [  3]: Loss 0.34629</span></span>
<span class="line"><span>Epoch [  3]: Loss 0.32498</span></span>
<span class="line"><span>Epoch [  3]: Loss 0.32396</span></span>
<span class="line"><span>Epoch [  3]: Loss 0.31393</span></span>
<span class="line"><span>Epoch [  3]: Loss 0.30701</span></span>
<span class="line"><span>Validation: Loss 0.28143 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.27651 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [  4]: Loss 0.29031</span></span>
<span class="line"><span>Epoch [  4]: Loss 0.26602</span></span>
<span class="line"><span>Epoch [  4]: Loss 0.26054</span></span>
<span class="line"><span>Epoch [  4]: Loss 0.25139</span></span>
<span class="line"><span>Epoch [  4]: Loss 0.25445</span></span>
<span class="line"><span>Epoch [  4]: Loss 0.24139</span></span>
<span class="line"><span>Epoch [  4]: Loss 0.23022</span></span>
<span class="line"><span>Validation: Loss 0.21132 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.20637 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [  5]: Loss 0.21630</span></span>
<span class="line"><span>Epoch [  5]: Loss 0.20295</span></span>
<span class="line"><span>Epoch [  5]: Loss 0.20320</span></span>
<span class="line"><span>Epoch [  5]: Loss 0.18884</span></span>
<span class="line"><span>Epoch [  5]: Loss 0.17487</span></span>
<span class="line"><span>Epoch [  5]: Loss 0.18439</span></span>
<span class="line"><span>Epoch [  5]: Loss 0.18701</span></span>
<span class="line"><span>Validation: Loss 0.15605 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.15144 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [  6]: Loss 0.16352</span></span>
<span class="line"><span>Epoch [  6]: Loss 0.16224</span></span>
<span class="line"><span>Epoch [  6]: Loss 0.14672</span></span>
<span class="line"><span>Epoch [  6]: Loss 0.14452</span></span>
<span class="line"><span>Epoch [  6]: Loss 0.12869</span></span>
<span class="line"><span>Epoch [  6]: Loss 0.12378</span></span>
<span class="line"><span>Epoch [  6]: Loss 0.12623</span></span>
<span class="line"><span>Validation: Loss 0.11387 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.11007 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [  7]: Loss 0.11393</span></span>
<span class="line"><span>Epoch [  7]: Loss 0.10668</span></span>
<span class="line"><span>Epoch [  7]: Loss 0.10570</span></span>
<span class="line"><span>Epoch [  7]: Loss 0.10180</span></span>
<span class="line"><span>Epoch [  7]: Loss 0.10121</span></span>
<span class="line"><span>Epoch [  7]: Loss 0.10423</span></span>
<span class="line"><span>Epoch [  7]: Loss 0.07903</span></span>
<span class="line"><span>Validation: Loss 0.08154 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.07871 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [  8]: Loss 0.07934</span></span>
<span class="line"><span>Epoch [  8]: Loss 0.08107</span></span>
<span class="line"><span>Epoch [  8]: Loss 0.07589</span></span>
<span class="line"><span>Epoch [  8]: Loss 0.07517</span></span>
<span class="line"><span>Epoch [  8]: Loss 0.06819</span></span>
<span class="line"><span>Epoch [  8]: Loss 0.06694</span></span>
<span class="line"><span>Epoch [  8]: Loss 0.06603</span></span>
<span class="line"><span>Validation: Loss 0.05693 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.05503 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [  9]: Loss 0.05944</span></span>
<span class="line"><span>Epoch [  9]: Loss 0.05613</span></span>
<span class="line"><span>Epoch [  9]: Loss 0.05343</span></span>
<span class="line"><span>Epoch [  9]: Loss 0.05023</span></span>
<span class="line"><span>Epoch [  9]: Loss 0.04969</span></span>
<span class="line"><span>Epoch [  9]: Loss 0.04670</span></span>
<span class="line"><span>Epoch [  9]: Loss 0.04629</span></span>
<span class="line"><span>Validation: Loss 0.04225 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.04089 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 10]: Loss 0.04361</span></span>
<span class="line"><span>Epoch [ 10]: Loss 0.03851</span></span>
<span class="line"><span>Epoch [ 10]: Loss 0.04110</span></span>
<span class="line"><span>Epoch [ 10]: Loss 0.04145</span></span>
<span class="line"><span>Epoch [ 10]: Loss 0.03847</span></span>
<span class="line"><span>Epoch [ 10]: Loss 0.04029</span></span>
<span class="line"><span>Epoch [ 10]: Loss 0.03018</span></span>
<span class="line"><span>Validation: Loss 0.03418 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.03305 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 11]: Loss 0.03529</span></span>
<span class="line"><span>Epoch [ 11]: Loss 0.03224</span></span>
<span class="line"><span>Epoch [ 11]: Loss 0.03170</span></span>
<span class="line"><span>Epoch [ 11]: Loss 0.03359</span></span>
<span class="line"><span>Epoch [ 11]: Loss 0.03497</span></span>
<span class="line"><span>Epoch [ 11]: Loss 0.03163</span></span>
<span class="line"><span>Epoch [ 11]: Loss 0.03148</span></span>
<span class="line"><span>Validation: Loss 0.02901 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.02802 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 12]: Loss 0.03026</span></span>
<span class="line"><span>Epoch [ 12]: Loss 0.03039</span></span>
<span class="line"><span>Epoch [ 12]: Loss 0.02545</span></span>
<span class="line"><span>Epoch [ 12]: Loss 0.02867</span></span>
<span class="line"><span>Epoch [ 12]: Loss 0.02907</span></span>
<span class="line"><span>Epoch [ 12]: Loss 0.02780</span></span>
<span class="line"><span>Epoch [ 12]: Loss 0.02555</span></span>
<span class="line"><span>Validation: Loss 0.02524 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.02435 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 13]: Loss 0.02545</span></span>
<span class="line"><span>Epoch [ 13]: Loss 0.02634</span></span>
<span class="line"><span>Epoch [ 13]: Loss 0.02585</span></span>
<span class="line"><span>Epoch [ 13]: Loss 0.02284</span></span>
<span class="line"><span>Epoch [ 13]: Loss 0.02432</span></span>
<span class="line"><span>Epoch [ 13]: Loss 0.02475</span></span>
<span class="line"><span>Epoch [ 13]: Loss 0.02574</span></span>
<span class="line"><span>Validation: Loss 0.02232 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.02151 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 14]: Loss 0.02133</span></span>
<span class="line"><span>Epoch [ 14]: Loss 0.02215</span></span>
<span class="line"><span>Epoch [ 14]: Loss 0.02336</span></span>
<span class="line"><span>Epoch [ 14]: Loss 0.02164</span></span>
<span class="line"><span>Epoch [ 14]: Loss 0.02188</span></span>
<span class="line"><span>Epoch [ 14]: Loss 0.02247</span></span>
<span class="line"><span>Epoch [ 14]: Loss 0.02303</span></span>
<span class="line"><span>Validation: Loss 0.01997 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.01923 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 15]: Loss 0.01959</span></span>
<span class="line"><span>Epoch [ 15]: Loss 0.02130</span></span>
<span class="line"><span>Epoch [ 15]: Loss 0.02083</span></span>
<span class="line"><span>Epoch [ 15]: Loss 0.01890</span></span>
<span class="line"><span>Epoch [ 15]: Loss 0.01967</span></span>
<span class="line"><span>Epoch [ 15]: Loss 0.01974</span></span>
<span class="line"><span>Epoch [ 15]: Loss 0.01810</span></span>
<span class="line"><span>Validation: Loss 0.01801 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.01733 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 16]: Loss 0.02037</span></span>
<span class="line"><span>Epoch [ 16]: Loss 0.01842</span></span>
<span class="line"><span>Epoch [ 16]: Loss 0.01684</span></span>
<span class="line"><span>Epoch [ 16]: Loss 0.01808</span></span>
<span class="line"><span>Epoch [ 16]: Loss 0.01929</span></span>
<span class="line"><span>Epoch [ 16]: Loss 0.01601</span></span>
<span class="line"><span>Epoch [ 16]: Loss 0.01514</span></span>
<span class="line"><span>Validation: Loss 0.01635 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.01572 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 17]: Loss 0.01619</span></span>
<span class="line"><span>Epoch [ 17]: Loss 0.01739</span></span>
<span class="line"><span>Epoch [ 17]: Loss 0.01502</span></span>
<span class="line"><span>Epoch [ 17]: Loss 0.01649</span></span>
<span class="line"><span>Epoch [ 17]: Loss 0.01673</span></span>
<span class="line"><span>Epoch [ 17]: Loss 0.01725</span></span>
<span class="line"><span>Epoch [ 17]: Loss 0.01442</span></span>
<span class="line"><span>Validation: Loss 0.01495 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.01436 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 18]: Loss 0.01641</span></span>
<span class="line"><span>Epoch [ 18]: Loss 0.01635</span></span>
<span class="line"><span>Epoch [ 18]: Loss 0.01459</span></span>
<span class="line"><span>Epoch [ 18]: Loss 0.01469</span></span>
<span class="line"><span>Epoch [ 18]: Loss 0.01354</span></span>
<span class="line"><span>Epoch [ 18]: Loss 0.01477</span></span>
<span class="line"><span>Epoch [ 18]: Loss 0.01542</span></span>
<span class="line"><span>Validation: Loss 0.01374 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.01319 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 19]: Loss 0.01415</span></span>
<span class="line"><span>Epoch [ 19]: Loss 0.01439</span></span>
<span class="line"><span>Epoch [ 19]: Loss 0.01382</span></span>
<span class="line"><span>Epoch [ 19]: Loss 0.01420</span></span>
<span class="line"><span>Epoch [ 19]: Loss 0.01311</span></span>
<span class="line"><span>Epoch [ 19]: Loss 0.01375</span></span>
<span class="line"><span>Epoch [ 19]: Loss 0.01321</span></span>
<span class="line"><span>Validation: Loss 0.01268 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.01217 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 20]: Loss 0.01331</span></span>
<span class="line"><span>Epoch [ 20]: Loss 0.01317</span></span>
<span class="line"><span>Epoch [ 20]: Loss 0.01290</span></span>
<span class="line"><span>Epoch [ 20]: Loss 0.01214</span></span>
<span class="line"><span>Epoch [ 20]: Loss 0.01249</span></span>
<span class="line"><span>Epoch [ 20]: Loss 0.01284</span></span>
<span class="line"><span>Epoch [ 20]: Loss 0.01320</span></span>
<span class="line"><span>Validation: Loss 0.01173 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.01125 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 21]: Loss 0.01302</span></span>
<span class="line"><span>Epoch [ 21]: Loss 0.01182</span></span>
<span class="line"><span>Epoch [ 21]: Loss 0.01238</span></span>
<span class="line"><span>Epoch [ 21]: Loss 0.01089</span></span>
<span class="line"><span>Epoch [ 21]: Loss 0.01164</span></span>
<span class="line"><span>Epoch [ 21]: Loss 0.01152</span></span>
<span class="line"><span>Epoch [ 21]: Loss 0.01126</span></span>
<span class="line"><span>Validation: Loss 0.01081 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.01037 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 22]: Loss 0.01101</span></span>
<span class="line"><span>Epoch [ 22]: Loss 0.01162</span></span>
<span class="line"><span>Epoch [ 22]: Loss 0.01179</span></span>
<span class="line"><span>Epoch [ 22]: Loss 0.01006</span></span>
<span class="line"><span>Epoch [ 22]: Loss 0.01086</span></span>
<span class="line"><span>Epoch [ 22]: Loss 0.01010</span></span>
<span class="line"><span>Epoch [ 22]: Loss 0.00988</span></span>
<span class="line"><span>Validation: Loss 0.00981 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.00942 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 23]: Loss 0.01105</span></span>
<span class="line"><span>Epoch [ 23]: Loss 0.00975</span></span>
<span class="line"><span>Epoch [ 23]: Loss 0.01067</span></span>
<span class="line"><span>Epoch [ 23]: Loss 0.00889</span></span>
<span class="line"><span>Epoch [ 23]: Loss 0.00980</span></span>
<span class="line"><span>Epoch [ 23]: Loss 0.00876</span></span>
<span class="line"><span>Epoch [ 23]: Loss 0.00878</span></span>
<span class="line"><span>Validation: Loss 0.00872 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.00839 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 24]: Loss 0.00945</span></span>
<span class="line"><span>Epoch [ 24]: Loss 0.00840</span></span>
<span class="line"><span>Epoch [ 24]: Loss 0.00842</span></span>
<span class="line"><span>Epoch [ 24]: Loss 0.00906</span></span>
<span class="line"><span>Epoch [ 24]: Loss 0.00882</span></span>
<span class="line"><span>Epoch [ 24]: Loss 0.00833</span></span>
<span class="line"><span>Epoch [ 24]: Loss 0.00664</span></span>
<span class="line"><span>Validation: Loss 0.00778 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.00750 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 25]: Loss 0.00763</span></span>
<span class="line"><span>Epoch [ 25]: Loss 0.00797</span></span>
<span class="line"><span>Epoch [ 25]: Loss 0.00805</span></span>
<span class="line"><span>Epoch [ 25]: Loss 0.00807</span></span>
<span class="line"><span>Epoch [ 25]: Loss 0.00697</span></span>
<span class="line"><span>Epoch [ 25]: Loss 0.00814</span></span>
<span class="line"><span>Epoch [ 25]: Loss 0.00739</span></span>
<span class="line"><span>Validation: Loss 0.00711 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.00686 Accuracy 1.00000</span></span></code></pre></div><p>We can also train the compact model with the exact same code!</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">ps_trained2, st_trained2 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> main</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(SpiralClassifierCompact)</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Epoch [  1]: Loss 0.61629</span></span>
<span class="line"><span>Epoch [  1]: Loss 0.60266</span></span>
<span class="line"><span>Epoch [  1]: Loss 0.56536</span></span>
<span class="line"><span>Epoch [  1]: Loss 0.54572</span></span>
<span class="line"><span>Epoch [  1]: Loss 0.51360</span></span>
<span class="line"><span>Epoch [  1]: Loss 0.49581</span></span>
<span class="line"><span>Epoch [  1]: Loss 0.49991</span></span>
<span class="line"><span>Validation: Loss 0.46755 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.46467 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [  2]: Loss 0.46646</span></span>
<span class="line"><span>Epoch [  2]: Loss 0.45279</span></span>
<span class="line"><span>Epoch [  2]: Loss 0.43873</span></span>
<span class="line"><span>Epoch [  2]: Loss 0.42352</span></span>
<span class="line"><span>Epoch [  2]: Loss 0.41450</span></span>
<span class="line"><span>Epoch [  2]: Loss 0.40166</span></span>
<span class="line"><span>Epoch [  2]: Loss 0.40351</span></span>
<span class="line"><span>Validation: Loss 0.37014 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.36675 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [  3]: Loss 0.36941</span></span>
<span class="line"><span>Epoch [  3]: Loss 0.35174</span></span>
<span class="line"><span>Epoch [  3]: Loss 0.34494</span></span>
<span class="line"><span>Epoch [  3]: Loss 0.32508</span></span>
<span class="line"><span>Epoch [  3]: Loss 0.33913</span></span>
<span class="line"><span>Epoch [  3]: Loss 0.32045</span></span>
<span class="line"><span>Epoch [  3]: Loss 0.27174</span></span>
<span class="line"><span>Validation: Loss 0.28521 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.28159 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [  4]: Loss 0.28987</span></span>
<span class="line"><span>Epoch [  4]: Loss 0.28263</span></span>
<span class="line"><span>Epoch [  4]: Loss 0.27345</span></span>
<span class="line"><span>Epoch [  4]: Loss 0.24983</span></span>
<span class="line"><span>Epoch [  4]: Loss 0.24620</span></span>
<span class="line"><span>Epoch [  4]: Loss 0.22893</span></span>
<span class="line"><span>Epoch [  4]: Loss 0.21584</span></span>
<span class="line"><span>Validation: Loss 0.21584 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.21228 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [  5]: Loss 0.21861</span></span>
<span class="line"><span>Epoch [  5]: Loss 0.20851</span></span>
<span class="line"><span>Epoch [  5]: Loss 0.20707</span></span>
<span class="line"><span>Epoch [  5]: Loss 0.19813</span></span>
<span class="line"><span>Epoch [  5]: Loss 0.18580</span></span>
<span class="line"><span>Epoch [  5]: Loss 0.17343</span></span>
<span class="line"><span>Epoch [  5]: Loss 0.13880</span></span>
<span class="line"><span>Validation: Loss 0.16085 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.15767 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [  6]: Loss 0.15197</span></span>
<span class="line"><span>Epoch [  6]: Loss 0.15037</span></span>
<span class="line"><span>Epoch [  6]: Loss 0.15041</span></span>
<span class="line"><span>Epoch [  6]: Loss 0.15055</span></span>
<span class="line"><span>Epoch [  6]: Loss 0.14135</span></span>
<span class="line"><span>Epoch [  6]: Loss 0.13321</span></span>
<span class="line"><span>Epoch [  6]: Loss 0.13451</span></span>
<span class="line"><span>Validation: Loss 0.11869 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.11612 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [  7]: Loss 0.11656</span></span>
<span class="line"><span>Epoch [  7]: Loss 0.11269</span></span>
<span class="line"><span>Epoch [  7]: Loss 0.10756</span></span>
<span class="line"><span>Epoch [  7]: Loss 0.10730</span></span>
<span class="line"><span>Epoch [  7]: Loss 0.10795</span></span>
<span class="line"><span>Epoch [  7]: Loss 0.09348</span></span>
<span class="line"><span>Epoch [  7]: Loss 0.09047</span></span>
<span class="line"><span>Validation: Loss 0.08534 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.08349 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [  8]: Loss 0.09415</span></span>
<span class="line"><span>Epoch [  8]: Loss 0.08502</span></span>
<span class="line"><span>Epoch [  8]: Loss 0.06937</span></span>
<span class="line"><span>Epoch [  8]: Loss 0.07783</span></span>
<span class="line"><span>Epoch [  8]: Loss 0.06974</span></span>
<span class="line"><span>Epoch [  8]: Loss 0.06300</span></span>
<span class="line"><span>Epoch [  8]: Loss 0.06767</span></span>
<span class="line"><span>Validation: Loss 0.05941 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.05819 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [  9]: Loss 0.06164</span></span>
<span class="line"><span>Epoch [  9]: Loss 0.05604</span></span>
<span class="line"><span>Epoch [  9]: Loss 0.05111</span></span>
<span class="line"><span>Epoch [  9]: Loss 0.05187</span></span>
<span class="line"><span>Epoch [  9]: Loss 0.05051</span></span>
<span class="line"><span>Epoch [  9]: Loss 0.05005</span></span>
<span class="line"><span>Epoch [  9]: Loss 0.04726</span></span>
<span class="line"><span>Validation: Loss 0.04375 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.04287 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 10]: Loss 0.04273</span></span>
<span class="line"><span>Epoch [ 10]: Loss 0.04155</span></span>
<span class="line"><span>Epoch [ 10]: Loss 0.04255</span></span>
<span class="line"><span>Epoch [ 10]: Loss 0.04222</span></span>
<span class="line"><span>Epoch [ 10]: Loss 0.03869</span></span>
<span class="line"><span>Epoch [ 10]: Loss 0.03697</span></span>
<span class="line"><span>Epoch [ 10]: Loss 0.03783</span></span>
<span class="line"><span>Validation: Loss 0.03523 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.03450 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 11]: Loss 0.03676</span></span>
<span class="line"><span>Epoch [ 11]: Loss 0.03549</span></span>
<span class="line"><span>Epoch [ 11]: Loss 0.03404</span></span>
<span class="line"><span>Epoch [ 11]: Loss 0.03405</span></span>
<span class="line"><span>Epoch [ 11]: Loss 0.03108</span></span>
<span class="line"><span>Epoch [ 11]: Loss 0.02958</span></span>
<span class="line"><span>Epoch [ 11]: Loss 0.03284</span></span>
<span class="line"><span>Validation: Loss 0.02981 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.02917 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 12]: Loss 0.02828</span></span>
<span class="line"><span>Epoch [ 12]: Loss 0.03121</span></span>
<span class="line"><span>Epoch [ 12]: Loss 0.03056</span></span>
<span class="line"><span>Epoch [ 12]: Loss 0.02800</span></span>
<span class="line"><span>Epoch [ 12]: Loss 0.02890</span></span>
<span class="line"><span>Epoch [ 12]: Loss 0.02600</span></span>
<span class="line"><span>Epoch [ 12]: Loss 0.02392</span></span>
<span class="line"><span>Validation: Loss 0.02590 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.02533 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 13]: Loss 0.02751</span></span>
<span class="line"><span>Epoch [ 13]: Loss 0.02231</span></span>
<span class="line"><span>Epoch [ 13]: Loss 0.02608</span></span>
<span class="line"><span>Epoch [ 13]: Loss 0.02432</span></span>
<span class="line"><span>Epoch [ 13]: Loss 0.02389</span></span>
<span class="line"><span>Epoch [ 13]: Loss 0.02603</span></span>
<span class="line"><span>Epoch [ 13]: Loss 0.02518</span></span>
<span class="line"><span>Validation: Loss 0.02291 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.02239 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 14]: Loss 0.02352</span></span>
<span class="line"><span>Epoch [ 14]: Loss 0.02155</span></span>
<span class="line"><span>Epoch [ 14]: Loss 0.02197</span></span>
<span class="line"><span>Epoch [ 14]: Loss 0.02200</span></span>
<span class="line"><span>Epoch [ 14]: Loss 0.02167</span></span>
<span class="line"><span>Epoch [ 14]: Loss 0.02268</span></span>
<span class="line"><span>Epoch [ 14]: Loss 0.02253</span></span>
<span class="line"><span>Validation: Loss 0.02049 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.02002 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 15]: Loss 0.01977</span></span>
<span class="line"><span>Epoch [ 15]: Loss 0.02148</span></span>
<span class="line"><span>Epoch [ 15]: Loss 0.02171</span></span>
<span class="line"><span>Epoch [ 15]: Loss 0.01886</span></span>
<span class="line"><span>Epoch [ 15]: Loss 0.01984</span></span>
<span class="line"><span>Epoch [ 15]: Loss 0.01958</span></span>
<span class="line"><span>Epoch [ 15]: Loss 0.01478</span></span>
<span class="line"><span>Validation: Loss 0.01849 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.01806 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 16]: Loss 0.01660</span></span>
<span class="line"><span>Epoch [ 16]: Loss 0.01943</span></span>
<span class="line"><span>Epoch [ 16]: Loss 0.01817</span></span>
<span class="line"><span>Epoch [ 16]: Loss 0.01958</span></span>
<span class="line"><span>Epoch [ 16]: Loss 0.01733</span></span>
<span class="line"><span>Epoch [ 16]: Loss 0.01745</span></span>
<span class="line"><span>Epoch [ 16]: Loss 0.01784</span></span>
<span class="line"><span>Validation: Loss 0.01681 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.01641 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 17]: Loss 0.01793</span></span>
<span class="line"><span>Epoch [ 17]: Loss 0.01659</span></span>
<span class="line"><span>Epoch [ 17]: Loss 0.01623</span></span>
<span class="line"><span>Epoch [ 17]: Loss 0.01634</span></span>
<span class="line"><span>Epoch [ 17]: Loss 0.01597</span></span>
<span class="line"><span>Epoch [ 17]: Loss 0.01606</span></span>
<span class="line"><span>Epoch [ 17]: Loss 0.01572</span></span>
<span class="line"><span>Validation: Loss 0.01537 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.01499 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 18]: Loss 0.01522</span></span>
<span class="line"><span>Epoch [ 18]: Loss 0.01578</span></span>
<span class="line"><span>Epoch [ 18]: Loss 0.01442</span></span>
<span class="line"><span>Epoch [ 18]: Loss 0.01482</span></span>
<span class="line"><span>Epoch [ 18]: Loss 0.01522</span></span>
<span class="line"><span>Epoch [ 18]: Loss 0.01432</span></span>
<span class="line"><span>Epoch [ 18]: Loss 0.01835</span></span>
<span class="line"><span>Validation: Loss 0.01412 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.01377 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 19]: Loss 0.01344</span></span>
<span class="line"><span>Epoch [ 19]: Loss 0.01313</span></span>
<span class="line"><span>Epoch [ 19]: Loss 0.01556</span></span>
<span class="line"><span>Epoch [ 19]: Loss 0.01392</span></span>
<span class="line"><span>Epoch [ 19]: Loss 0.01334</span></span>
<span class="line"><span>Epoch [ 19]: Loss 0.01426</span></span>
<span class="line"><span>Epoch [ 19]: Loss 0.01280</span></span>
<span class="line"><span>Validation: Loss 0.01302 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.01270 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 20]: Loss 0.01432</span></span>
<span class="line"><span>Epoch [ 20]: Loss 0.01276</span></span>
<span class="line"><span>Epoch [ 20]: Loss 0.01222</span></span>
<span class="line"><span>Epoch [ 20]: Loss 0.01297</span></span>
<span class="line"><span>Epoch [ 20]: Loss 0.01245</span></span>
<span class="line"><span>Epoch [ 20]: Loss 0.01230</span></span>
<span class="line"><span>Epoch [ 20]: Loss 0.01277</span></span>
<span class="line"><span>Validation: Loss 0.01203 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.01173 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 21]: Loss 0.01215</span></span>
<span class="line"><span>Epoch [ 21]: Loss 0.01298</span></span>
<span class="line"><span>Epoch [ 21]: Loss 0.01224</span></span>
<span class="line"><span>Epoch [ 21]: Loss 0.01151</span></span>
<span class="line"><span>Epoch [ 21]: Loss 0.01138</span></span>
<span class="line"><span>Epoch [ 21]: Loss 0.01056</span></span>
<span class="line"><span>Epoch [ 21]: Loss 0.01313</span></span>
<span class="line"><span>Validation: Loss 0.01107 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.01081 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 22]: Loss 0.01152</span></span>
<span class="line"><span>Epoch [ 22]: Loss 0.01159</span></span>
<span class="line"><span>Epoch [ 22]: Loss 0.01027</span></span>
<span class="line"><span>Epoch [ 22]: Loss 0.01087</span></span>
<span class="line"><span>Epoch [ 22]: Loss 0.01114</span></span>
<span class="line"><span>Epoch [ 22]: Loss 0.01016</span></span>
<span class="line"><span>Epoch [ 22]: Loss 0.00954</span></span>
<span class="line"><span>Validation: Loss 0.01005 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.00982 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 23]: Loss 0.01026</span></span>
<span class="line"><span>Epoch [ 23]: Loss 0.01010</span></span>
<span class="line"><span>Epoch [ 23]: Loss 0.00881</span></span>
<span class="line"><span>Epoch [ 23]: Loss 0.01061</span></span>
<span class="line"><span>Epoch [ 23]: Loss 0.00958</span></span>
<span class="line"><span>Epoch [ 23]: Loss 0.00941</span></span>
<span class="line"><span>Epoch [ 23]: Loss 0.00919</span></span>
<span class="line"><span>Validation: Loss 0.00893 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.00874 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 24]: Loss 0.00900</span></span>
<span class="line"><span>Epoch [ 24]: Loss 0.00905</span></span>
<span class="line"><span>Epoch [ 24]: Loss 0.00872</span></span>
<span class="line"><span>Epoch [ 24]: Loss 0.00864</span></span>
<span class="line"><span>Epoch [ 24]: Loss 0.00850</span></span>
<span class="line"><span>Epoch [ 24]: Loss 0.00821</span></span>
<span class="line"><span>Epoch [ 24]: Loss 0.00818</span></span>
<span class="line"><span>Validation: Loss 0.00796 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.00779 Accuracy 1.00000</span></span>
<span class="line"><span>Epoch [ 25]: Loss 0.00826</span></span>
<span class="line"><span>Epoch [ 25]: Loss 0.00763</span></span>
<span class="line"><span>Epoch [ 25]: Loss 0.00787</span></span>
<span class="line"><span>Epoch [ 25]: Loss 0.00819</span></span>
<span class="line"><span>Epoch [ 25]: Loss 0.00693</span></span>
<span class="line"><span>Epoch [ 25]: Loss 0.00757</span></span>
<span class="line"><span>Epoch [ 25]: Loss 0.00873</span></span>
<span class="line"><span>Validation: Loss 0.00726 Accuracy 1.00000</span></span>
<span class="line"><span>Validation: Loss 0.00710 Accuracy 1.00000</span></span></code></pre></div><h2 id="Saving-the-Model" tabindex="-1">Saving the Model <a class="header-anchor" href="#Saving-the-Model" aria-label="Permalink to &quot;Saving the Model {#Saving-the-Model}&quot;">​</a></h2><p>We can save the model using JLD2 (and any other serialization library of your choice) Note that we transfer the model to CPU before saving. Additionally, we recommend that you don&#39;t save the model struct and only save the parameters and states.</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">@save</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;trained_model.jld2&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ps_trained st_trained</span></span></code></pre></div><p>Let&#39;s try loading the model</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">@load</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;trained_model.jld2&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ps_trained st_trained</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>2-element Vector{Symbol}:</span></span>
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
<span class="line"><span>  0: NVIDIA A100-PCIE-40GB MIG 1g.5gb (sm_80, 4.109 GiB / 4.750 GiB available)</span></span></code></pre></div><hr><p><em>This page was generated using <a href="https://github.com/fredrikekre/Literate.jl" target="_blank" rel="noreferrer">Literate.jl</a>.</em></p>`,46)]))}const r=a(l,[["render",e]]);export{d as __pageData,r as default};
