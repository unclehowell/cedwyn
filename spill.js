/* spill.js · webapp 44 of 59 · v1.1.0 · graphs (inline SVG) + WebMCP tools. - Cedwyn editors */
/* Header: "44 of 59" in the header's own numbering slot (.ghf-v2-name small) until the area registry gives the slot; the
   header's third row stays hidden except for the shared Garden banner (same rule as Tithe H3 v0.1.1). */
(function(){
var d=document,SLOT="44",OF="59",WORD={en:"of",cy:"o",es:"de"};
function lg(){var l=(d.documentElement.getAttribute("lang")||"en").slice(0,2).toLowerCase();return WORD[l]?l:"en";}
function num(){var n=d.querySelector(".ghf-v2-chain .ghf-v2-name");if(!n)return false;
 var s=n.querySelector("small");
 if(s&&!s.hasAttribute("data-spill-slot"))return true;
 var t=SLOT+" "+WORD[lg()]+" "+OF;
 if(!s){s=d.createElement("small");s.setAttribute("data-spill-slot","");n.appendChild(s);}
 if(s.textContent!==t){s.textContent="";var a=d.createElement("a");a.className="cw-parcel-link";a.href="/parcels/";a.setAttribute("data-parcel-slot",SLOT);a.setAttribute("data-parcel-of",OF);a.style.color="inherit";a.style.textDecoration="none";a.textContent=t;s.appendChild(a);}
 return true;}
function strip(){var up=d.querySelector(".ghf-v2-up");if(!up)return false;
 var want=up.classList.contains("cw-gdn-on")?"":"none";
 if((up.style.getPropertyValue("display")||"")!==want){
  if(want){up.style.setProperty("display","none","important");up.setAttribute("aria-hidden","true");}
  else{up.style.removeProperty("display");up.removeAttribute("aria-hidden");}
  try{window.dispatchEvent(new Event("resize"));}catch(e){}}
 return true;}
function both(){var a=num(),b=strip();return a&&b;}
var n=0,iv=setInterval(function(){if(both()||++n>150){clearInterval(iv);var h=d.querySelector(".ghf-v2");
 if(h)new MutationObserver(both).observe(h,{childList:true,subtree:true,attributes:true,attributeFilter:["class","style"]});}},100);
d.addEventListener("ghf-lang-change",function(){setTimeout(both,0);});
})();

/* Page: graphs of the spill queue (by status, by target, per day, by decade), guest book, WebMCP tools. */
(function(){
"use strict";
var BASE="/spill/api",d=document;
function $(i){return d.getElementById(i);}
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
function hbars(id,rows,o){var el=$(id);if(!el)return;o=o||{};rows=rows.filter(function(r){return r.a>0;});
 if(!rows.length){el.innerHTML='<svg viewBox="0 0 340 28" role="img" aria-label="none yet"><text class="empty" x="0" y="18">none yet</text></svg>';return;}
 var lw=o.lw||110,W=340,bh=18,g=6,H=rows.length*(bh+g),mx=Math.max.apply(null,rows.map(function(r){return r.a;}))||1,s='';
 rows.forEach(function(r,i){var y=i*(bh+g),w=Math.max(2,(W-lw-40)*r.a/mx);
  s+='<text class="lab" x="0" y="'+(y+13)+'">'+esc(String(r.l).slice(0,o.lc||18))+'</text><rect class="trk" x="'+lw+'" y="'+y+'" width="'+(W-lw-40)+'" height="'+bh+'" rx="3"/><rect class="'+(r.c||"b1")+'" x="'+lw+'" y="'+y+'" width="'+w+'" height="'+bh+'" rx="3"/><text class="val" x="'+(lw+w+4)+'" y="'+(y+13)+'">'+r.a+'</text>';});
 el.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(id)+'">'+s+'</svg>';}
function cols(id,rows){var el=$(id);if(!el)return;
 if(!rows.length){el.innerHTML='<svg viewBox="0 0 340 28" role="img" aria-label="none yet"><text class="empty" x="0" y="18">none yet</text></svg>';return;}
 var W=340,H=120,b=18,n=rows.length,cw=(W-10)/n,mx=Math.max.apply(null,rows.map(function(r){return r.a;}))||1,s='<line class="ax" x1="0" y1="'+(H-b)+'" x2="'+W+'" y2="'+(H-b)+'"/>';
 rows.forEach(function(r,i){var h=Math.max(1,(H-b-14)*r.a/mx),x=5+i*cw;s+='<rect class="b1" x="'+(x+1)+'" y="'+(H-b-h)+'" width="'+Math.max(1,cw-2)+'" height="'+h+'" rx="2"/>';
  if(r.a&&n<=31)s+='<text class="val" text-anchor="middle" x="'+(x+cw/2)+'" y="'+(H-b-h-3)+'">'+r.a+'</text>';
  if(i===0||i===n-1||n<=8||i%Math.ceil(n/6)===0)s+='<text class="lab" text-anchor="middle" x="'+(x+cw/2)+'" y="'+(H-4)+'">'+esc(r.l)+'</text>';});
 el.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(id)+'">'+s+'</svg>';}
var SC={"new":"b1",queued:"b2",accepted:"ok",released:"ok",declined:"bad",duplicate:"warn"};
function draw(s){
 $("sp-total").textContent=s.total;$("sp-today").textContent=s.today_stored+" / "+s.day_cap;
 hbars("g-status",["new","queued","accepted","released","declined","duplicate"].map(function(k){return{l:k,a:(s.by_status||{})[k]||0,c:SC[k]};}).concat([]),{lw:80});
 hbars("g-target",Object.keys(s.by_target||{}).sort(function(a,b){return s.by_target[b]-s.by_target[a];}).map(function(k){return{l:k,a:s.by_target[k]};}),{lw:110});
 hbars("g-conf",["high","medium","low"].map(function(k){return{l:k,a:(s.by_confidence||{})[k]||0,c:k==="high"?"ok":k==="medium"?"b1":"warn"};}),{lw:70});
 var days=[],m={};(s.per_day_30||[]).forEach(function(x){m[x.day]=x.n;});for(var i=29;i>=0;i--){var t=new Date(Date.now()-i*864e5).toISOString().slice(0,10);days.push({l:t.slice(8,10)+"/"+t.slice(5,7),a:m[t]||0});}
 cols("g-day",days);
 cols("g-decade",(s.by_decade||[]).map(function(x){return{l:x.decade,a:x.n};}));}
function gb(r){var tb=$("gb-rows");if(!tb||!r||!r.rows)return;var gn=$("gb-n");if(gn)gn.textContent="("+r.rows.length+")";tb.innerHTML=r.rows.slice(0,20).map(function(x){return"<tr><td>"+esc(x.version)+"</td><td>"+esc((x.at||"").slice(0,10))+"</td><td>"+esc(x.change)+"</td><td>"+esc(x.who)+"</td></tr>";}).join("");}
function get(p){return fetch(BASE+p,{cache:"no-store"}).then(function(r){return r.json();});}
function load(){get("/stats").then(draw).catch(function(){$("sp-total").textContent="unavailable";});get("/guestbook").then(gb).catch(function(){});}
load();setInterval(load,5*60*1000);
var cp=$("sp-copy");if(cp)cp.addEventListener("click",function(){var t=$("sp-cmd").textContent;try{navigator.clipboard.writeText(t).then(function(){cp.textContent="Copied";setTimeout(function(){cp.textContent="Copy";},1500);});}catch(e){}});

/* WebMCP: the same tools as POST /spill/api/mcp, registered on document.modelContext (current) or navigator.modelContext (legacy) */
var TOOLS=null;
function call(name,args){return fetch(BASE+"/mcp",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({jsonrpc:"2.0",id:Date.now(),method:"tools/call",params:{name:name,arguments:args||{}}})}).then(function(r){return r.json();}).then(function(j){if(j.error)throw new Error(j.error.message);var res=j.result||{};if(res.isError)throw new Error((res.content&&res.content[0]&&res.content[0].text)||"tool error");return res.structuredContent||res;});}
function mc(){if(d.modelContext&&typeof d.modelContext.registerTool==="function")return d.modelContext;if(navigator.modelContext&&typeof navigator.modelContext.registerTool==="function")return navigator.modelContext;return null;}
fetch(BASE+"/mcp",{cache:"no-store"}).then(function(r){return r.json();}).then(function(j){TOOLS=j.tools||[];
 var ctx=mc(),done=[];window.__cedwynSpillMCP={available:!!ctx,tools:TOOLS.map(function(t){return t.name;}),run:call,endpoint:BASE+"/mcp",protocol:"/spill/protocol.json",registered:done};
 if(!ctx)return;TOOLS.forEach(function(t){try{var ro=!/submit|sign/.test(t.name);var p=ctx.registerTool({name:t.name,description:t.description,inputSchema:t.inputSchema,annotations:{readOnlyHint:ro,destructiveHint:false},
  execute:function(input){return call(t.name,input||{}).then(function(r){return{content:[{type:"text",text:JSON.stringify(r)}]};},function(e){return{content:[{type:"text",text:String(e.message||e)}],isError:true};});}});
  if(p&&p.then)p.then(function(){done.push(t.name);},function(){});else done.push(t.name);}catch(e){}});
}).catch(function(){});
})();
