/* cloudflare.js · webapp 43 of 59 · v1.0.0 · graphs only (inline SVG, no libraries) + WebMCP tools. - Cedwyn editors */
/* Header: "43 of 59" in the header's own numbering slot (.ghf-v2-name small) until the area registry gives the slot; the
   header's third row stays hidden except for the shared Garden banner (same rule as Tithe H3 v0.1.1). */
(function(){
var d=document,SLOT="43",OF="59",WORD={en:"of",cy:"o",es:"de"};
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
var BASE=location.origin+"/cloudflare/api",W=360,NS="http://www.w3.org/2000/svg";
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

function draw(s,hist){
 var L=s.allowances,t=s.d1.totals,kv=(s.kv&&s.kv.today)||{},wt=s.workers.totals;
 $("cf-upd").textContent=s.generated_at.slice(0,16).replace("T"," ")+" UTC";
 meters("g-allow",[{l:"D1 written today",v:t.today.rowsWritten,max:L.d1_rows_written_day},{l:"D1 written yesterday",v:t.yesterday.rowsWritten,max:L.d1_rows_written_day},
  {l:"D1 read today",v:t.today.rowsRead,max:L.d1_rows_read_day},{l:"D1 read yesterday",v:t.yesterday.rowsRead,max:L.d1_rows_read_day},
  {l:"Workers today",v:wt.today,max:L.workers_requests_day},{l:"Workers yesterday",v:wt.yesterday,max:L.workers_requests_day},
  {l:"KV writes today",v:kv.write||0,max:L.kv_writes_day},{l:"KV reads today",v:kv.read||0,max:L.kv_reads_day},{l:"D1 storage",v:s.d1.storage_total_bytes,max:L.d1_storage_total}]);
 var hrs=s.hours.map(function(h){return h.slice(11,13)+"h";});
 vbars("g-d1hour",s.d1.written_by_hour,s.hours,{short:function(x){return x.slice(11,13)+"h";}});
 var pts=((hist&&hist.points)||[]).filter(function(p){return p.at.slice(0,10)===s.today;}).map(function(p){return{t:p.at,v:p.d1w};});
 if(pts.length<3){var c=0;pts=[];s.hours.forEach(function(h,i){if(h.slice(0,10)!==s.today)return;c+=s.d1.written_by_hour[i]||0;pts.push({t:h,v:c});});pts.push({t:s.generated_at,v:t.today.rowsWritten});}
 line("g-trend",pts,L.d1_rows_written_day);
 vbars("g-d1day",s.d1.written_by_day,s.days,{lim:L.d1_rows_written_day,showLim:true,short:function(x){return x.slice(8,10);}});
 var dbs=s.d1.databases.filter(function(x){return x.today.rowsWritten||x.yesterday.rowsWritten;});
 hbars("g-d1db",dbs.map(function(x){return{l:x.name,a:x.today.rowsWritten,b:x.yesterday.rowsWritten};}),{max:L.d1_rows_written_day,ka:"today",kb:"yesterday",key:key("today","yesterday")});
 var rd=s.d1.databases.filter(function(x){return x.today.rowsRead||x.yesterday.rowsRead;}).sort(function(a,b){return(b.today.rowsRead+b.yesterday.rowsRead)-(a.today.rowsRead+a.yesterday.rowsRead);});
 hbars("g-d1read",rd.map(function(x){return{l:x.name,a:x.today.rowsRead,b:x.yesterday.rowsRead};}),{max:L.d1_rows_read_day,ka:"today",kb:"yesterday",key:key("today","yesterday")});
 var sz=s.d1.databases.slice().sort(function(a,b){return b.size_bytes-a.size_bytes;}).map(function(x){return{l:x.name,a:x.size_bytes/1e6};});
 hbars("g-d1size",sz,{max:L.d1_db_size/1e6});
 vbars("g-wday",s.workers.requests_by_day,s.days,{lim:L.workers_requests_day,short:function(x){return x.slice(8,10);}});
 var ws=s.workers.scripts.filter(function(x){return x.today.requests||x.yesterday.requests;}).slice(0,14);
 hbars("g-wreq",ws.map(function(x){return{l:x.name,a:x.today.requests,b:x.yesterday.requests};}),{ka:"today",kb:"yesterday",key:key("today","yesterday")});
 var we=s.workers.scripts.filter(function(x){return x.today.errors||x.yesterday.errors;}).sort(function(a,b){return(b.today.errors+b.yesterday.errors)-(a.today.errors+a.yesterday.errors);}).slice(0,12);
 if(!we.length)we=ws.slice(0,5);hbars("g-werr",we.map(function(x){return{l:x.name,a:x.today.errors,b:x.yesterday.errors};}),{ka:"today",kb:"yesterday",key:key("today","yesterday")});
 var wc=s.workers.scripts.filter(function(x){return x.today.cpu_p99_ms||x.yesterday.cpu_p99_ms;}).sort(function(a,b){return b.today.cpu_p99_ms-a.today.cpu_p99_ms;}).slice(0,12);
 hbars("g-wcpu",wc.map(function(x){return{l:x.name,a:x.today.cpu_p99_ms,b:x.yesterday.cpu_p99_ms};}),{ka:"today",kb:"yesterday",key:key("today","yesterday")});
 var ky=(s.kv&&s.kv.yesterday)||{},kvr=[["read","kv_reads_day"],["write","kv_writes_day"],["delete","kv_deletes_day"],["list","kv_lists_day"]].map(function(p){return{l:p[0]+" (of "+k(L[p[1]])+")",a:(kv[p[0]]||0),b:(ky[p[0]]||0)};});
 hbars("g-kv",kvr,{ka:"today",kb:"yesterday",key:key("today","yesterday")});
 var zd=s.zone.days;
 vbars("g-zreq",zd.map(function(x){return x.requests;}),zd.map(function(x){return x.date;}),{short:function(x){return x.slice(8,10);}});
 vbars("g-zuniq",zd.map(function(x){return x.uniques;}),zd.map(function(x){return x.date;}),{short:function(x){return x.slice(8,10);}});
 vbars("g-zbytes",zd.map(function(x){return x.bytes/1e6;}),zd.map(function(x){return x.date;}),{short:function(x){return x.slice(8,10);}});
 hbars("g-hosts",(s.zone.last24h_hosts||[]).slice(0,12).map(function(x){return{l:x.host.replace(/\.bucklerfamily\.estate$/,"").replace(/^bucklerfamily\.estate$/,"(apex)"),a:x.requests};}),{lw:130});
 hbars("g-pages",(s.zone.last24h_top_pages||[]).slice(0,12).map(function(x){return{l:x.host.replace(/\.bucklerfamily\.estate$/,"")+x.path,a:x.views};}),{lw:190,lc:32});
 hbars("g-status",(s.zone.yesterday_status||[]).map(function(x){return{l:String(x[0]),a:x[1]};}),{lw:60});
 hbars("g-ctry",(s.zone.yesterday_countries||[]).map(function(x){return{l:x[0],a:x[1]};}),{lw:60});
}
function gb(r){var tb=$("gb-rows");if(!tb||!r||!r.rows)return;tb.innerHTML=r.rows.slice(0,20).map(function(x){return"<tr><td>"+esc(x.version)+"</td><td>"+esc((x.at||"").slice(0,10))+"</td><td>"+esc(x.change)+"</td><td>"+esc(x.who)+"</td></tr>";}).join("");}
function get(p){return fetch(BASE+p,{cache:"no-store"}).then(function(r){return r.json();});}
function load(){Promise.all([get("/snapshot"),get("/history?hours=24").catch(function(){return null;})]).then(function(a){if(a[0]&&a[0].d1)draw(a[0],a[1]);}).catch(function(e){$("cf-upd").textContent="unavailable";});
 get("/guestbook").then(gb).catch(function(){});}
load();setInterval(load,5*60*1000);

/* WebMCP: the same tools as POST /cloudflare/api/mcp, registered on document.modelContext (current) or navigator.modelContext (legacy) */
var TOOLS=null;
function call(name,args){return fetch(BASE+"/mcp",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({jsonrpc:"2.0",id:Date.now(),method:"tools/call",params:{name:name,arguments:args||{}}})}).then(function(r){return r.json();}).then(function(j){if(j.error)throw new Error(j.error.message);var res=j.result||{};if(res.isError)throw new Error((res.content&&res.content[0]&&res.content[0].text)||"tool error");return res.structuredContent||res;});}
function mc(){if(document.modelContext&&typeof document.modelContext.registerTool==="function")return document.modelContext;if(navigator.modelContext&&typeof navigator.modelContext.registerTool==="function")return navigator.modelContext;return null;}
fetch(BASE+"/mcp",{cache:"no-store"}).then(function(r){return r.json();}).then(function(j){TOOLS=j.tools||[];
 var ctx=mc(),done=[];window.__cedwynCloudflareMCP={available:!!ctx,tools:TOOLS.map(function(t){return t.name;}),run:call,endpoint:BASE+"/mcp",registered:done};
 if(!ctx)return;TOOLS.forEach(function(t){try{var p=ctx.registerTool({name:t.name,description:t.description,inputSchema:t.inputSchema,annotations:{readOnlyHint:t.name!=="cloudflare_guestbook_sign",destructiveHint:false},
  execute:function(input){return call(t.name,input||{}).then(function(r){return{content:[{type:"text",text:JSON.stringify(r)}]};},function(e){return{content:[{type:"text",text:String(e.message||e)}],isError:true};});}});
  if(p&&p.then)p.then(function(){done.push(t.name);},function(){});else done.push(t.name);}catch(e){}});
}).catch(function(){});
})();
