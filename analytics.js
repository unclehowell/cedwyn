/* analytics.js · webapp 45 of 59 · v1.1.0 (each traffic class has one fixed colour on every graph) · graphs only (inline SVG, no libraries) + WebMCP tools. - Cedwyn editors */
/* Header: "45 of 59" in the header's own numbering slot (.ghf-v2-name small) until the area registry gives the slot; the
   header's third row stays hidden except for the shared Garden banner (same rule as Tithe H3 v0.1.1). */
(function(){
var d=document,SLOT="45",OF="59",WORD={en:"of",cy:"o",es:"de"};
function lg(){var l=(d.documentElement.getAttribute("lang")||"en").slice(0,2).toLowerCase();return WORD[l]?l:"en";}
function num(){var n=d.querySelector(".ghf-v2-chain .ghf-v2-name");if(!n)return false;
 var s=n.querySelector("small");
 if(s&&!s.hasAttribute("data-cfw-slot"))return true;
 var t=SLOT+" "+WORD[lg()]+" "+OF;
 if(!s){s=d.createElement("small");s.setAttribute("data-cfw-slot","");n.appendChild(s);}
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

(function(){
"use strict";
var BASE=location.origin+"/analytics/api",W=360,NS="http://www.w3.org/2000/svg";
function $(id){return document.getElementById(id);}
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
function k(n){n=+n||0;var a=Math.abs(n);return a>=1e9?(n/1e9).toFixed(1)+"B":a>=1e6?(n/1e6).toFixed(a>=1e7?0:1)+"M":a>=1e4?Math.round(n/1e3)+"k":a>=1e3?(n/1e3).toFixed(1)+"k":String(Math.round(n*10)/10);}
function cls(p){return p>=95?"bad":p>=80?"warn":"ok";}
function svg(h,inner){return '<svg xmlns="'+NS+'" viewBox="0 0 '+W+' '+h+'" role="img" preserveAspectRatio="xMinYMin meet">'+inner+"</svg>";}
function cut(s,n){s=String(s);return s.length>n?s.slice(0,n-1)+"…":s;}
function none(id){$(id).innerHTML=svg(24,'<text class="empty" x="0" y="16">no data</text>');}
/* meters: rows [{l, v, max}] -> % of allowance, coloured */
function meters(id,rows){var rh=24,h=rows.length*rh+4,o="";
 rows.forEach(function(r,i){var p=r.max?r.v/r.max*100:0,y=i*rh+2,x0=112,bw=W-x0-46,w=Math.max(1,Math.min(1,p/100)*bw);
  o+='<text class="lab" x="0" y="'+(y+14)+'">'+esc(cut(r.l,19))+'</text><rect class="trk" x="'+x0+'" y="'+(y+3)+'" width="'+bw+'" height="14" rx="3"/>'+
   '<rect class="'+cls(p)+'" x="'+x0+'" y="'+(y+3)+'" width="'+w+'" height="14" rx="3"><title>'+esc(r.l)+": "+Math.round(r.v).toLocaleString("en-GB")+" / "+Math.round(r.max).toLocaleString("en-GB")+'</title></rect>'+
   '<text class="val" x="'+(W-2)+'" y="'+(y+14)+'" text-anchor="end">'+(p<1&&p>0?p.toFixed(1):Math.round(p))+'%</text>';});
 $(id).innerHTML=svg(h,o);}
/* horizontal bars, 1 or 2 series; max optional (allowance line) */
function hbars(id,rows,opt){opt=opt||{};if(!rows.length)return none(id);var two=rows.some(function(r){return r.b!=null;}),rh=two?26:20,h=rows.length*rh+(opt.key?0:4),o="",x0=opt.lw||118,bw=W-x0-44;
 var dm=Math.max.apply(null,rows.map(function(r){return Math.max(r.a||0,r.b||0);}).concat([1])),mx=opt.max&&opt.max<=dm*1.25?Math.max(dm,opt.max):dm;
 rows.forEach(function(r,i){var y=i*rh+2;o+='<text class="lab" x="0" y="'+(y+(two?15:13))+'">'+esc(cut(r.l,opt.lc||20))+'</text>';
  var aw=Math.max(r.a>0?1:0,(r.a||0)/mx*bw),ca=opt.max?cls((r.a||0)/opt.max*100):(opt.c1||"b1");
  if(two){var bwid=Math.max(r.b>0?1:0,(r.b||0)/mx*bw),cb=opt.max?cls((r.b||0)/opt.max*100):"b2";
   o+='<rect class="'+cb+'" opacity="'+(opt.max?0.45:1)+'" x="'+x0+'" y="'+(y+2)+'" width="'+bwid+'" height="9" rx="2"><title>'+esc(opt.kb||"")+": "+esc(r.b)+'</title></rect>';
   o+='<rect class="'+ca+'" x="'+x0+'" y="'+(y+12)+'" width="'+aw+'" height="10" rx="2"><title>'+esc(opt.ka||"")+": "+esc(r.a)+'</title></rect>';
   o+='<text class="val" x="'+(W-2)+'" y="'+(y+21)+'" text-anchor="end">'+k(r.a)+'</text><text class="lab" x="'+(W-2)+'" y="'+(y+10)+'" text-anchor="end">'+k(r.b)+'</text>';}
  else{o+='<rect class="'+ca+'" x="'+x0+'" y="'+(y+3)+'" width="'+aw+'" height="12" rx="2"/><text class="val" x="'+(W-2)+'" y="'+(y+13)+'" text-anchor="end">'+k(r.a)+'</text>';}});
 if(opt.max&&opt.max<=mx){var lx=x0+opt.max/mx*bw;o+='<line class="lim" x1="'+lx+'" x2="'+lx+'" y1="0" y2="'+h+'"/>';}
 $(id).innerHTML=(opt.key||"")+svg(h,o);}
/* vertical bars with x labels; lim = allowance line */
function vbars(id,vals,labs,opt){opt=opt||{};if(!vals.length)return none(id);var h=150,top=14,bot=20,x0=34,cw=(W-x0)/vals.length,o="";
 var mx=Math.max.apply(null,vals.concat([opt.lim&&opt.showLim?opt.lim:0,1]));
 [0,0.5,1].forEach(function(f){var y=top+(1-f)*(h-top-bot);o+='<line class="ax" x1="'+x0+'" x2="'+W+'" y1="'+y+'" y2="'+y+'"/><text class="lab" x="'+(x0-3)+'" y="'+(y+4)+'" text-anchor="end">'+k(mx*f)+'</text>';});
 vals.forEach(function(v,i){var bh=v/mx*(h-top-bot),x=x0+i*cw+cw*0.12,c=opt.lim?cls(v/opt.lim*100):"b1";
  o+='<rect class="'+c+'" x="'+x+'" y="'+(h-bot-bh)+'" width="'+Math.max(1,cw*0.76)+'" height="'+Math.max(v>0?1:0,bh)+'"><title>'+esc(labs[i])+": "+Math.round(v).toLocaleString("en-GB")+'</title></rect>';
  var every=Math.ceil(vals.length/8);if(i%every===0||i===vals.length-1)o+='<text class="lab" x="'+(x+cw*0.38)+'" y="'+(h-6)+'" text-anchor="middle">'+esc(opt.short?opt.short(labs[i]):labs[i])+'</text>';});
 if(opt.lim&&opt.showLim){var ly=top+(1-opt.lim/mx)*(h-top-bot);o+='<line class="lim" x1="'+x0+'" x2="'+W+'" y1="'+ly+'" y2="'+ly+'"/><text class="lab" x="'+W+'" y="'+(ly-3)+'" text-anchor="end">'+k(opt.lim)+'</text>';}
 $(id).innerHTML=svg(h,o);}
/* line from the webapp database history */
function line(id,pts,lim){if(pts.length<2)return none(id);var h=150,top=14,bot=20,x0=34,o="";
 var t0=Date.parse(pts[0].t),t1=Date.parse(pts[pts.length-1].t),mx=Math.max.apply(null,pts.map(function(p){return p.v;}).concat([1]));
 function X(t){return x0+(t1>t0?(Date.parse(t)-t0)/(t1-t0):0)*(W-x0-4);}function Y(v){return top+(1-v/mx)*(h-top-bot);}
 [0,0.5,1].forEach(function(f){var y=top+(1-f)*(h-top-bot);o+='<line class="ax" x1="'+x0+'" x2="'+W+'" y1="'+y+'" y2="'+y+'"/><text class="lab" x="'+(x0-3)+'" y="'+(y+4)+'" text-anchor="end">'+k(mx*f)+'</text>';});
 var dpath="";pts.forEach(function(p,i){var prev=pts[i-1];dpath+=(i===0||(prev&&p.v<prev.v)?"M":"L")+X(p.t).toFixed(1)+","+Y(p.v).toFixed(1)+" ";});
 o+='<path class="ln" d="'+dpath+'"/>';var last=pts[pts.length-1];o+='<circle class="dot" cx="'+X(last.t)+'" cy="'+Y(last.v)+'" r="3"/><text class="val" x="'+(W-2)+'" y="'+(Y(last.v)-6)+'" text-anchor="end">'+k(last.v)+'</text>';
 var c=cls(last.v/lim*100);if(c!=="ok")o=o.replace('class="ln"','class="ln" style="stroke:'+(c==="bad"?"#c62828":"#d98a00")+'"');
 [pts[0],pts[Math.floor(pts.length/2)],last].forEach(function(p,i){o+='<text class="lab" x="'+X(p.t)+'" y="'+(h-6)+'" text-anchor="'+(i===0?"start":i===2?"end":"middle")+'">'+p.t.slice(5,10).replace("-","/")+" "+p.t.slice(11,16)+'</text>';});
 $(id).innerHTML=svg(h,o);}
function key(a,b){return '<div class="cfw-key"><i class="k" style="background:#9fb8d4"></i>'+esc(b)+'<i class="k" style="background:#4a78a8"></i>'+esc(a)+'</div>';}

/* v1.1.0: the four traffic classes, one fixed colour each (colour-blind-safe), on every graph; grey = not classified */
var CN=["humans","bots","automation","own_tools"],CL={humans:"humans",bots:"bots, crawlers",automation:"automation",own_tools:"own tools"};
function tot(m){return m?CN.reduce(function(s,c){return s+(+m[c]||0);},0):0;}
function segs(m,x){var a=[];if(m)CN.forEach(function(c){if(m[c]>0)a.push([c,+m[c]]);});if(x>0)a.push(["nc",+x]);return a;}
function sname(c){return c==="nc"?"not classified":CL[c];}
function note(t){return '<div class="cfw-key">'+t+'</div>';}
var NCK='<div class="cfw-key"><i class="k c-nc"></i>not classified</div>';
/* horizontal stacked bars: rows [{l, m:{class:n}, x:not classified, m2: second (upper, thin) series}] */
function hstack(id,rows,opt){opt=opt||{};if(!rows.length)return none(id);var two=rows.some(function(r){return r.m2;}),rh=two?26:20,h=rows.length*rh+4,o="",x0=opt.lw||118,bw=W-x0-44;
 var mx=Math.max.apply(null,rows.map(function(r){return Math.max(tot(r.m)+(r.x||0),r.m2?tot(r.m2):0);}).concat([1]));
 function bar(sg,y,hh){var x=x0,s="";sg.forEach(function(p){var ww=p[1]/mx*bw;s+='<rect class="c-'+p[0]+'" x="'+x.toFixed(1)+'" y="'+y+'" width="'+Math.max(0.8,ww).toFixed(1)+'" height="'+hh+'"><title>'+esc(sname(p[0]))+": "+Math.round(p[1]).toLocaleString("en-GB")+'</title></rect>';x+=ww;});return s;}
 rows.forEach(function(r,i){var y=i*rh+2,t=tot(r.m)+(r.x||0);o+='<text class="lab" x="0" y="'+(y+(two?15:13))+'">'+esc(cut(r.l,opt.lc||20))+'</text>';
  if(two){o+='<g opacity="0.6">'+bar(segs(r.m2),y+2,8)+'</g>'+bar(segs(r.m,r.x),y+12,10)+'<text class="val" x="'+(W-2)+'" y="'+(y+21)+'" text-anchor="end">'+k(t)+'</text><text class="lab" x="'+(W-2)+'" y="'+(y+10)+'" text-anchor="end">'+k(tot(r.m2))+'</text>';}
  else o+=bar(segs(r.m,r.x),y+3,12)+'<text class="val" x="'+(W-2)+'" y="'+(y+13)+'" text-anchor="end">'+k(t)+'</text>';});
 $(id).innerHTML=(opt.key||"")+svg(h,o);}
/* vertical stacked bars: rows [{lab, m, x}] */
function vstack(id,rows,opt){opt=opt||{};if(!rows.length)return none(id);var h=150,top=14,bot=20,x0=34,cw=(W-x0)/rows.length,o="";
 var mx=Math.max.apply(null,rows.map(function(r){return tot(r.m)+(r.x||0);}).concat([1]));
 [0,0.5,1].forEach(function(f){var y=top+(1-f)*(h-top-bot);o+='<line class="ax" x1="'+x0+'" x2="'+W+'" y1="'+y+'" y2="'+y+'"/><text class="lab" x="'+(x0-3)+'" y="'+(y+4)+'" text-anchor="end">'+k(mx*f)+'</text>';});
 rows.forEach(function(r,i){var x=x0+i*cw+cw*0.12,yb=h-bot;segs(r.m,r.x).forEach(function(p){var bh=p[1]/mx*(h-top-bot);yb-=bh;
   o+='<rect class="c-'+(opt.one||p[0])+'" x="'+x.toFixed(1)+'" y="'+yb.toFixed(1)+'" width="'+Math.max(1,cw*0.76).toFixed(1)+'" height="'+Math.max(0.8,bh).toFixed(1)+'"><title>'+esc(r.lab)+" · "+esc(opt.one?(opt.oneName||""):sname(p[0]))+": "+Math.round(p[1]).toLocaleString("en-GB")+'</title></rect>';});
  var every=Math.ceil(rows.length/8);if(i%every===0||i===rows.length-1)o+='<text class="lab" x="'+(x+cw*0.38)+'" y="'+(h-6)+'" text-anchor="middle">'+esc(opt.short?opt.short(r.lab):r.lab)+'</text>';});
 $(id).innerHTML=(opt.key||"")+svg(h,o);}
/* the summary: one bar per class in its own colour, share of page requests */
function split(id,c){var t=tot(c)||1,rh=24,o="";CN.forEach(function(cl,i){var p=(c[cl]||0)/t*100,y=i*rh+2,x0=112,bw=W-x0-46,w2=Math.max(p>0?1:0,p/100*bw);
  o+='<rect class="c-'+cl+'" x="0" y="'+(y+4)+'" width="10" height="12" rx="2"/><text class="lab" x="15" y="'+(y+14)+'">'+esc(CL[cl])+'</text><rect class="trk" x="'+x0+'" y="'+(y+3)+'" width="'+bw+'" height="14" rx="3"/>'+
  '<rect class="c-'+cl+'" x="'+x0+'" y="'+(y+3)+'" width="'+w2.toFixed(1)+'" height="14" rx="3"><title>'+esc(CL[cl])+": "+Math.round(c[cl]||0).toLocaleString("en-GB")+'</title></rect><text class="val" x="'+(W-2)+'" y="'+(y+14)+'" text-anchor="end">'+(p<1&&p>0?p.toFixed(1):Math.round(p))+'%</text>';});
 $(id).innerHTML=svg(CN.length*rh+4,o);}

var D=function(x){return x.slice(8,10);};
function lab(h){return h==="(apex)"?"(apex)":h;}
function draw(s){
 $("cf-upd").textContent=s.generated_at.slice(0,16).replace("T"," ")+" UTC";
 var w=s.web,e=s.edge,wk='<div class="cfw-key">upper bar visits · lower bar page views</div>';
 split("g-split",e.humans_vs_bots_24h);
 function byDay(arr,mk,vk){return arr.map(function(x){return{lab:x.date,m:x[mk]||null,x:x[mk]?0:(x[vk]||0)};});}
 if(w){vstack("g-wvis",byDay(w.days,"visits_by_class","visits"),{short:D});
  vstack("g-wpv",byDay(w.days,"page_views_by_class","page_views"),{short:D});
  hstack("g-pages",w.top_pages_7d.slice(0,15).map(function(x){return{l:(x.host==="(apex)"?"":x.host)+x.path,m:x.by_class,x:x.by_class?0:x.page_views};}),{lw:190,lc:32});
  hstack("g-ref",w.referrers_7d.slice(0,12).map(function(x){return{l:x.referrer.replace(/\.bucklerfamily\.estate$/,""),m:x.by_class,x:x.by_class?0:x.visits};}),{lw:170,lc:28});
  hstack("g-whosts",w.hosts_7d.slice(0,20).map(function(x){return{l:lab(x.host),m:x.by_class,x:x.by_class?0:x.page_views,m2:x.visits_by_class||null};}),{lw:150,lc:24,key:wk});
  [["g-ctry","countries_7d","country",60],["g-dev","devices_7d","device",90],["g-br","browsers_7d","browser",130],["g-os","os_7d","os",110]].forEach(function(g){
   hstack(g[0],w[g[1]].map(function(x){return{l:x[g[2]],m:x.by_class,x:x.by_class?0:x.visits};}),{lw:g[3]});});}
 else ["g-wvis","g-wpv","g-pages","g-ref","g-whosts","g-ctry","g-dev","g-br","g-os"].forEach(none);
 var nod=e.days.some(function(x){return !x.page_requests_by_class;});
 vstack("g-euniq",e.days.map(function(x){return{lab:x.date,x:x.uniques};}),{short:D,one:"uv",oneName:"unique visitors",key:note('<i class="k c-uv"></i>all visitors · not split: Cloudflare counts unique visitors per day only, with no browser string')});
 vstack("g-epv",byDay(e.days,"page_requests_by_class","page_views"),{short:D,key:nod?NCK:""});
 vstack("g-ereq",byDay(e.days,"requests_by_class","requests"),{short:D,key:nod?NCK:""});
 vstack("g-hour",e.hours.map(function(x){return{lab:x.hour,m:x.page_requests_by_class||null,x:x.page_requests_by_class?0:x.page_views};}),{short:function(x){return x.slice(11,13)+"h";}});
 hstack("g-ehosts",e.hosts_24h.slice(0,20).map(function(x){return{l:lab(x.host),m:x.by_class,x:x.by_class?0:x.page_requests};}),{lw:150,lc:24});
 hstack("g-edev",e.devices_24h.map(function(x){return{l:x.device,m:x.by_class,x:x.by_class?0:x.page_requests};}),{lw:90});
 hstack("g-ectry",e.countries_7d.map(function(x){return{l:x.country,m:x.by_class,x:x.by_class?(x.not_classified||0):x.requests};}),{lw:60,key:NCK});
 var g=e.status_groups_7d_by_class,g0=e.status_groups_7d;hstack("g-sgrp",["2xx","3xx","4xx","5xx"].map(function(k2){return g?{l:k2,m:g[k2].by_class,x:g[k2].not_classified}:{l:k2,x:g0[k2]||0};}),{lw:60,key:NCK});
 hstack("g-status",e.status_24h.slice(0,10).map(function(x){return{l:String(x.status),m:x.by_class,x:x.by_class?0:x.requests};}),{lw:60});
}
function gb(r){var tb=$("gb-rows");if(!tb||!r||!r.rows)return;var gn=$("gb-n");if(gn)gn.textContent="("+r.rows.length+")";tb.innerHTML=r.rows.slice(0,20).map(function(x){return"<tr><td>"+esc(x.version)+"</td><td>"+esc((x.at||"").slice(0,10))+"</td><td>"+esc(x.change)+"</td><td>"+esc(x.who)+"</td></tr>";}).join("");}
function get(p){return fetch(BASE+p,{cache:"no-store"}).then(function(r){return r.json();});}
function load(){get("/snapshot").then(function(s){if(s&&s.edge)draw(s);else $("cf-upd").textContent="unavailable";}).catch(function(){$("cf-upd").textContent="unavailable";});
 get("/guestbook").then(gb).catch(function(){});}
load();setInterval(load,5*60*1000);

/* WebMCP: the same tools as POST /analytics/api/mcp, registered on document.modelContext (current) or navigator.modelContext (legacy) */
var TOOLS=null;
function call(name,args){return fetch(BASE+"/mcp",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({jsonrpc:"2.0",id:Date.now(),method:"tools/call",params:{name:name,arguments:args||{}}})}).then(function(r){return r.json();}).then(function(j){if(j.error)throw new Error(j.error.message);var res=j.result||{};if(res.isError)throw new Error((res.content&&res.content[0]&&res.content[0].text)||"tool error");return res.structuredContent||res;});}
function mc(){if(document.modelContext&&typeof document.modelContext.registerTool==="function")return document.modelContext;if(navigator.modelContext&&typeof navigator.modelContext.registerTool==="function")return navigator.modelContext;return null;}
fetch(BASE+"/mcp",{cache:"no-store"}).then(function(r){return r.json();}).then(function(j){TOOLS=j.tools||[];
 var ctx=mc(),done=[];window.__cedwynAnalyticsMCP={available:!!ctx,tools:TOOLS.map(function(t){return t.name;}),run:call,endpoint:BASE+"/mcp",registered:done};
 if(!ctx)return;TOOLS.forEach(function(t){try{var p=ctx.registerTool({name:t.name,description:t.description,inputSchema:t.inputSchema,annotations:{readOnlyHint:t.name!=="analytics_guestbook_sign",destructiveHint:false},
  execute:function(input){return call(t.name,input||{}).then(function(r){return{content:[{type:"text",text:JSON.stringify(r)}]};},function(e){return{content:[{type:"text",text:String(e.message||e)}],isError:true};});}});
  if(p&&p.then)p.then(function(){done.push(t.name);},function(){});else done.push(t.name);}catch(e){}});
}).catch(function(){});
})();
