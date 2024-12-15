import{_ as n,c as d,a2 as e,j as s,a as t,G as l,B as r,o as p}from"./chunks/framework.BS99Di-t.js";const I=JSON.parse('{"title":"Distributed Utils","description":"","frontmatter":{},"headers":[],"relativePath":"api/Lux/distributed_utils.md","filePath":"api/Lux/distributed_utils.md","lastUpdated":null}'),o={name:"api/Lux/distributed_utils.md"},c={class:"jldocstring custom-block"},k={class:"jldocstring custom-block"},h={class:"jldocstring custom-block"},u={class:"jldocstring custom-block"},b={class:"jldocstring custom-block"},g={class:"jldocstring custom-block"},y={class:"jldocstring custom-block"},f={class:"jldocstring custom-block"},m={class:"jldocstring custom-block"},E={class:"jldocstring custom-block"},C={class:"jldocstring custom-block"},L={class:"jldocstring custom-block"},j={class:"jldocstring custom-block"};function F(v,i,x,D,B,U){const a=r("Badge");return p(),d("div",null,[i[39]||(i[39]=e('<h1 id="Distributed-Utils" tabindex="-1">Distributed Utils <a class="header-anchor" href="#Distributed-Utils" aria-label="Permalink to &quot;Distributed Utils {#Distributed-Utils}&quot;">​</a></h1><div class="tip custom-block"><p class="custom-block-title">Note</p><p>These functionalities are available via the <code>Lux.DistributedUtils</code> module.</p></div><h2 id="communication-backends" tabindex="-1">Backends <a class="header-anchor" href="#communication-backends" aria-label="Permalink to &quot;Backends {#communication-backends}&quot;">​</a></h2>',3)),s("details",c,[s("summary",null,[i[0]||(i[0]=s("a",{id:"Lux.MPIBackend",href:"#Lux.MPIBackend"},[s("span",{class:"jlbinding"},"Lux.MPIBackend")],-1)),i[1]||(i[1]=t()),l(a,{type:"info",class:"jlObjectType jlType",text:"Type"})]),i[2]||(i[2]=e('<div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">MPIBackend</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(comm </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> nothing</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p>Create an MPI backend for distributed training. Users should not use this function directly. Instead use <a href="/dev/api/Lux/distributed_utils#Lux.DistributedUtils.get_distributed_backend"><code>DistributedUtils.get_distributed_backend(MPIBackend)</code></a>.</p><p><a href="https://github.com/LuxDL/Lux.jl/blob/d5e96cda7bec3bfa2d0accc81b15274f107f2c83/src/distributed/backend.jl#L3-L8" target="_blank" rel="noreferrer">source</a></p>',3))]),s("details",k,[s("summary",null,[i[3]||(i[3]=s("a",{id:"Lux.NCCLBackend",href:"#Lux.NCCLBackend"},[s("span",{class:"jlbinding"},"Lux.NCCLBackend")],-1)),i[4]||(i[4]=t()),l(a,{type:"info",class:"jlObjectType jlType",text:"Type"})]),i[5]||(i[5]=e('<div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">NCCLBackend</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(comm </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> nothing</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, mpi_backend </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> nothing</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p>Create an NCCL backend for distributed training. Users should not use this function directly. Instead use <a href="/dev/api/Lux/distributed_utils#Lux.DistributedUtils.get_distributed_backend"><code>DistributedUtils.get_distributed_backend(NCCLBackend)</code></a>.</p><p><a href="https://github.com/LuxDL/Lux.jl/blob/d5e96cda7bec3bfa2d0accc81b15274f107f2c83/src/distributed/backend.jl#L20-L25" target="_blank" rel="noreferrer">source</a></p>',3))]),i[40]||(i[40]=s("h2",{id:"initialization",tabindex:"-1"},[t("Initialization "),s("a",{class:"header-anchor",href:"#initialization","aria-label":'Permalink to "Initialization"'},"​")],-1)),s("details",h,[s("summary",null,[i[6]||(i[6]=s("a",{id:"Lux.DistributedUtils.initialize",href:"#Lux.DistributedUtils.initialize"},[s("span",{class:"jlbinding"},"Lux.DistributedUtils.initialize")],-1)),i[7]||(i[7]=t()),l(a,{type:"info",class:"jlObjectType jlFunction",text:"Function"})]),i[8]||(i[8]=e('<div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">initialize</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(backend</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Type{&lt;:AbstractLuxDistributedBackend}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">; kwargs</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">...</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p>Initialize the given backend. Users can supply <code>cuda_devices</code> and <code>amdgpu_devices</code> to initialize the backend with the given devices. These can be set to <code>missing</code> to prevent initialization of the given device type. If set to <code>nothing</code>, and the backend is functional we assign GPUs in a round-robin fashion. Finally, a list of integers can be supplied to initialize the backend with the given devices.</p><p>Possible values for <code>backend</code> are:</p><ul><li><p><code>MPIBackend</code>: MPI backend for distributed training. Requires <code>MPI.jl</code> to be installed.</p></li><li><p><code>NCCLBackend</code>: NCCL backend for CUDA distributed training. Requires <code>CUDA.jl</code>, <code>MPI.jl</code>, and <code>NCCL.jl</code> to be installed. This also wraps <code>MPI</code> backend for non-CUDA communications.</p></li></ul><p><a href="https://github.com/LuxDL/Lux.jl/blob/d5e96cda7bec3bfa2d0accc81b15274f107f2c83/src/distributed/public_api.jl#L24-L39" target="_blank" rel="noreferrer">source</a></p>',5))]),s("details",u,[s("summary",null,[i[9]||(i[9]=s("a",{id:"Lux.DistributedUtils.initialized",href:"#Lux.DistributedUtils.initialized"},[s("span",{class:"jlbinding"},"Lux.DistributedUtils.initialized")],-1)),i[10]||(i[10]=t()),l(a,{type:"info",class:"jlObjectType jlFunction",text:"Function"})]),i[11]||(i[11]=e('<div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">initialized</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(backend</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Type{&lt;:AbstractLuxDistributedBackend}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p>Check if the given backend is initialized.</p><p><a href="https://github.com/LuxDL/Lux.jl/blob/d5e96cda7bec3bfa2d0accc81b15274f107f2c83/src/distributed/public_api.jl#L16-L20" target="_blank" rel="noreferrer">source</a></p>',3))]),s("details",b,[s("summary",null,[i[12]||(i[12]=s("a",{id:"Lux.DistributedUtils.get_distributed_backend",href:"#Lux.DistributedUtils.get_distributed_backend"},[s("span",{class:"jlbinding"},"Lux.DistributedUtils.get_distributed_backend")],-1)),i[13]||(i[13]=t()),l(a,{type:"info",class:"jlObjectType jlFunction",text:"Function"})]),i[14]||(i[14]=e('<div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">get_distributed_backend</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(backend</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Type{&lt;:AbstractLuxDistributedBackend}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p>Get the distributed backend for the given backend type. Possible values are:</p><ul><li><p><code>MPIBackend</code>: MPI backend for distributed training. Requires <code>MPI.jl</code> to be installed.</p></li><li><p><code>NCCLBackend</code>: NCCL backend for CUDA distributed training. Requires <code>CUDA.jl</code>, <code>MPI.jl</code>, and <code>NCCL.jl</code> to be installed. This also wraps <code>MPI</code> backend for non-CUDA communications.</p></li></ul><div class="danger custom-block"><p class="custom-block-title">Danger</p><p><code>initialize(backend; kwargs...)</code> must be called before calling this function.</p></div><p><a href="https://github.com/LuxDL/Lux.jl/blob/d5e96cda7bec3bfa2d0accc81b15274f107f2c83/src/distributed/public_api.jl#L48-L61" target="_blank" rel="noreferrer">source</a></p>',5))]),i[41]||(i[41]=s("h2",{id:"Helper-Functions",tabindex:"-1"},[t("Helper Functions "),s("a",{class:"header-anchor",href:"#Helper-Functions","aria-label":'Permalink to "Helper Functions {#Helper-Functions}"'},"​")],-1)),s("details",g,[s("summary",null,[i[15]||(i[15]=s("a",{id:"Lux.DistributedUtils.local_rank",href:"#Lux.DistributedUtils.local_rank"},[s("span",{class:"jlbinding"},"Lux.DistributedUtils.local_rank")],-1)),i[16]||(i[16]=t()),l(a,{type:"info",class:"jlObjectType jlFunction",text:"Function"})]),i[17]||(i[17]=e('<div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">local_rank</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(backend</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">AbstractLuxDistributedBackend</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p>Get the local rank for the given backend.</p><p><a href="https://github.com/LuxDL/Lux.jl/blob/d5e96cda7bec3bfa2d0accc81b15274f107f2c83/src/distributed/public_api.jl#L72-L76" target="_blank" rel="noreferrer">source</a></p>',3))]),s("details",y,[s("summary",null,[i[18]||(i[18]=s("a",{id:"Lux.DistributedUtils.total_workers",href:"#Lux.DistributedUtils.total_workers"},[s("span",{class:"jlbinding"},"Lux.DistributedUtils.total_workers")],-1)),i[19]||(i[19]=t()),l(a,{type:"info",class:"jlObjectType jlFunction",text:"Function"})]),i[20]||(i[20]=e('<div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">total_workers</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(backend</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">AbstractLuxDistributedBackend</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p>Get the total number of workers for the given backend.</p><p><a href="https://github.com/LuxDL/Lux.jl/blob/d5e96cda7bec3bfa2d0accc81b15274f107f2c83/src/distributed/public_api.jl#L81-L85" target="_blank" rel="noreferrer">source</a></p>',3))]),i[42]||(i[42]=s("h2",{id:"Communication-Primitives",tabindex:"-1"},[t("Communication Primitives "),s("a",{class:"header-anchor",href:"#Communication-Primitives","aria-label":'Permalink to "Communication Primitives {#Communication-Primitives}"'},"​")],-1)),s("details",f,[s("summary",null,[i[21]||(i[21]=s("a",{id:"Lux.DistributedUtils.allreduce!",href:"#Lux.DistributedUtils.allreduce!"},[s("span",{class:"jlbinding"},"Lux.DistributedUtils.allreduce!")],-1)),i[22]||(i[22]=t()),l(a,{type:"info",class:"jlObjectType jlFunction",text:"Function"})]),i[23]||(i[23]=e(`<div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">allreduce!</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(backend</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">AbstractLuxDistributedBackend</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, sendrecvbuf, op)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">allreduce!</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(backend</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">AbstractLuxDistributedBackend</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, sendbuf, recvbuf, op)</span></span></code></pre></div><p>Backend Agnostic API to perform an allreduce operation on the given buffer <code>sendrecvbuf</code> or <code>sendbuf</code> and store the result in <code>recvbuf</code>.</p><p><code>op</code> allows a special <code>DistributedUtils.avg</code> operation that averages the result across all workers.</p><p><a href="https://github.com/LuxDL/Lux.jl/blob/d5e96cda7bec3bfa2d0accc81b15274f107f2c83/src/distributed/public_api.jl#L121-L130" target="_blank" rel="noreferrer">source</a></p>`,4))]),s("details",m,[s("summary",null,[i[24]||(i[24]=s("a",{id:"Lux.DistributedUtils.bcast!",href:"#Lux.DistributedUtils.bcast!"},[s("span",{class:"jlbinding"},"Lux.DistributedUtils.bcast!")],-1)),i[25]||(i[25]=t()),l(a,{type:"info",class:"jlObjectType jlFunction",text:"Function"})]),i[26]||(i[26]=e(`<div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">bcast!</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(backend</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">AbstractLuxDistributedBackend</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, sendrecvbuf; root</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Int</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">bcast!</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(backend</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">AbstractLuxDistributedBackend</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, sendbuf, recvbuf; root</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Int</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p>Backend Agnostic API to broadcast the given buffer <code>sendrecvbuf</code> or <code>sendbuf</code> to all workers into <code>recvbuf</code>. The value at <code>root</code> will be broadcasted to all other workers.</p><p><a href="https://github.com/LuxDL/Lux.jl/blob/d5e96cda7bec3bfa2d0accc81b15274f107f2c83/src/distributed/public_api.jl#L90-L96" target="_blank" rel="noreferrer">source</a></p>`,3))]),s("details",E,[s("summary",null,[i[27]||(i[27]=s("a",{id:"Lux.DistributedUtils.reduce!",href:"#Lux.DistributedUtils.reduce!"},[s("span",{class:"jlbinding"},"Lux.DistributedUtils.reduce!")],-1)),i[28]||(i[28]=t()),l(a,{type:"info",class:"jlObjectType jlFunction",text:"Function"})]),i[29]||(i[29]=e(`<div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">reduce!</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(backend</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">AbstractLuxDistributedBackend</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, sendrecvbuf, op; root</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Int</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">reduce!</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(backend</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">AbstractLuxDistributedBackend</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, sendbuf, recvbuf, op; root</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Int</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p>Backend Agnostic API to perform a reduce operation on the given buffer <code>sendrecvbuf</code> or <code>sendbuf</code> and store the result in <code>recvbuf</code>.</p><p><code>op</code> allows a special <code>DistributedUtils.avg</code> operation that averages the result across all workers.</p><p><a href="https://github.com/LuxDL/Lux.jl/blob/d5e96cda7bec3bfa2d0accc81b15274f107f2c83/src/distributed/public_api.jl#L153-L162" target="_blank" rel="noreferrer">source</a></p>`,4))]),s("details",C,[s("summary",null,[i[30]||(i[30]=s("a",{id:"Lux.DistributedUtils.synchronize!!",href:"#Lux.DistributedUtils.synchronize!!"},[s("span",{class:"jlbinding"},"Lux.DistributedUtils.synchronize!!")],-1)),i[31]||(i[31]=t()),l(a,{type:"info",class:"jlObjectType jlFunction",text:"Function"})]),i[32]||(i[32]=e('<div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">synchronize!!</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(backend</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">AbstractLuxDistributedBackend</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, ps; root</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Int</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p>Synchronize the given structure <code>ps</code> using the given backend. The value at <code>root</code> will be broadcasted to all other workers.</p><p><a href="https://github.com/LuxDL/Lux.jl/blob/d5e96cda7bec3bfa2d0accc81b15274f107f2c83/src/distributed/public_api.jl#L187-L192" target="_blank" rel="noreferrer">source</a></p>',3))]),i[43]||(i[43]=s("h2",{id:"Optimizers.jl-Integration",tabindex:"-1"},[t("Optimizers.jl Integration "),s("a",{class:"header-anchor",href:"#Optimizers.jl-Integration","aria-label":'Permalink to "Optimizers.jl Integration {#Optimizers.jl-Integration}"'},"​")],-1)),s("details",L,[s("summary",null,[i[33]||(i[33]=s("a",{id:"Lux.DistributedUtils.DistributedOptimizer",href:"#Lux.DistributedUtils.DistributedOptimizer"},[s("span",{class:"jlbinding"},"Lux.DistributedUtils.DistributedOptimizer")],-1)),i[34]||(i[34]=t()),l(a,{type:"info",class:"jlObjectType jlType",text:"Type"})]),i[35]||(i[35]=e('<div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">DistributedOptimizer</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(backend</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">AbstractLuxDistributedBacked</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, optimizer)</span></span></code></pre></div><p>Wrap the <code>optimizer</code> in a <code>DistributedOptimizer</code>. Before updating the parameters, this averages the gradients across the processes using Allreduce.</p><p><strong>Arguments</strong></p><ul><li><code>optimizer</code>: An Optimizer compatible with the Optimisers.jl package</li></ul><p><a href="https://github.com/LuxDL/Lux.jl/blob/d5e96cda7bec3bfa2d0accc81b15274f107f2c83/src/distributed/public_api.jl#L254-L263" target="_blank" rel="noreferrer">source</a></p>',5))]),i[44]||(i[44]=s("h2",{id:"MLUtils.jl-Integration",tabindex:"-1"},[t("MLUtils.jl Integration "),s("a",{class:"header-anchor",href:"#MLUtils.jl-Integration","aria-label":'Permalink to "MLUtils.jl Integration {#MLUtils.jl-Integration}"'},"​")],-1)),s("details",j,[s("summary",null,[i[36]||(i[36]=s("a",{id:"Lux.DistributedUtils.DistributedDataContainer",href:"#Lux.DistributedUtils.DistributedDataContainer"},[s("span",{class:"jlbinding"},"Lux.DistributedUtils.DistributedDataContainer")],-1)),i[37]||(i[37]=t()),l(a,{type:"info",class:"jlObjectType jlType",text:"Type"})]),i[38]||(i[38]=e('<div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">DistributedDataContainer</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(backend</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">AbstractLuxDistributedBackend</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, data)</span></span></code></pre></div><p><code>data</code> must be compatible with <code>MLUtils</code> interface. The returned container is compatible with <code>MLUtils</code> interface and is used to partition the dataset across the available processes.</p><div class="danger custom-block"><p class="custom-block-title">Load <code>MLUtils.jl</code></p><p><code>MLUtils.jl</code> must be installed and loaded before using this.</p></div><p><a href="https://github.com/LuxDL/Lux.jl/blob/d5e96cda7bec3bfa2d0accc81b15274f107f2c83/src/distributed/public_api.jl#L223-L233" target="_blank" rel="noreferrer">source</a></p>',4))])])}const z=n(o,[["render",F]]);export{I as __pageData,z as default};
