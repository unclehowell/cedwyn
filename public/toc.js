/* That Old Chestnut — generative UI, built in the browser on page load from _ui/index.a2ui.json + _db/view.json.
   No model, no paid service, no network beyond these two same-site files. v0.1.0 */
(function(){
"use strict";
var app=document.getElementById("toc-app"); if(!app) return;
var SVGNS="http://www.w3.org/2000/svg", DB=null, UI=null, LANG="en", F={inst:"",cls:"",trig:"",q:""}, radarStop=null;
function $(t,a,kids){var e=document.createElement(t);if(a)for(var k in a){if(a[k]==null)continue;if(k==="text")e.textContent=a[k];else if(k==="cls")e.className=a[k];else e.setAttribute(k,a[k]);}(kids||[]).forEach(function(c){if(c!=null)e.appendChild(typeof c==="string"?document.createTextNode(c):c);});return e;}
function sv(t,a){var e=document.createElementNS(SVGNS,t);for(var k in a)e.setAttribute(k,a[k]);return e;}
function get(o,p){return p.split(".").reduce(function(x,k){return x==null?x:x[k];},o);}
function lang(){var l=(document.documentElement.getAttribute("lang")||"en").slice(0,2).toLowerCase();return (DB&&DB.copy.i18n[l])?l:"en";}
function T(k){var d=DB.copy.i18n;return (d[LANG]&&d[LANG][k])||d.en[k]||k;}
function rows(){return (DB&&DB.chestnuts)||[];}
function norm(s){return (s||"").toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");}
function classOf(r){return get(r,"finding.class")||"language";}
function filtered(){var q=norm(F.q).trim().split(/\s+/).filter(Boolean);return rows().filter(function(r){var f=r.finding||{};
 if(F.inst&&f.institution!==F.inst)return false; if(F.cls&&classOf(r)!==F.cls)return false; if(F.trig&&(f.trigger||"")!==F.trig)return false;
 if(q.length){var hay=norm([r.title,f.institution,f.negative_quote,f.positive_quote,f.positive_nature,f.conduct,(f.terms||[]).map(function(t){return t.term+" "+t.statute;}).join(" ")].join(" "));if(!q.every(function(w){return hay.indexOf(w)>=0;}))return false;}
 return true;});}
function elapsed(f){var m=f.months_elapsed,v=f.email_volume||"";if(m==null&&!v)return f.positive_date?"":"—";return (m!=null?m+" months":"")+(m!=null&&v?" / ":"")+v;}
function clsLabel(c){return T(c==="clear"?"clear":c==="borderline"?"borderline":"language");}

/* ---------- components ---------- */
var C={};
C.Header=function(){var h=app.querySelector(".toc-head")||$("header",{cls:"toc-head"});var p=DB.copy.parcel||{};
 var a=h.querySelector(".cw-parcel-link"); if(a){a.textContent=p.label||a.textContent;a.setAttribute("data-parcel-slot",p.slot||"");a.setAttribute("data-parcel-of",p.of||59);a.setAttribute("aria-haspopup","dialog");}
 h.querySelector("h1").textContent=T("h1"); h.querySelector(".toc-kicker").textContent=T("kicker"); return h;};
C.Text=function(n){return $("p",{cls:"toc-lede",text:T(n.props.text.replace("i18n:",""))});};
C.Status=function(){var R=rows(),done=get(DB,"copy.audit.complete");
 if(!R.length)return $("section",{cls:"toc-empty",role:"status"},[$("span",{cls:"toc-pulse","aria-hidden":"true"}),$("p",{text:T("empty")})]);
 if(!done)return $("p",{cls:"toc-banner",role:"status",text:T("in_progress")});return null;};
C.Counts=function(n){var R=rows(),c={clear:0,borderline:0,language:0};R.forEach(function(r){c[classOf(r)]=(c[classOf(r)]||0)+1;});
 var s=$("section",{cls:"toc-counts","aria-labelledby":"toc-counts-h"},[$("h2",{id:"toc-counts-h",text:T("counts")})]);var g=$("div",{cls:"toc-tiles"});
 n.props.groups.forEach(function(k){var b=$("button",{type:"button",cls:"toc-tile t-"+k+(F.cls===k?" on":""),"aria-pressed":F.cls===k?"true":"false"},[$("b",{text:String(c[k]||0)}),$("span",{text:T(k)}),$("small",{text:T(k+"_d")})]);
  b.addEventListener("click",function(){F.cls=F.cls===k?"":k;render(true);});g.appendChild(b);});s.appendChild(g);return s;};
C.Filter=function(n){var R=rows();if(!R.length)return null;var s=$("form",{cls:"toc-filter",role:"search",onsubmit:"return false"},[$("h2",{text:T("filters")})]);
 function sel(id,label,key,vals,lab){var o=$("select",{id:id});o.appendChild($("option",{value:"",text:T("all")}));vals.forEach(function(v){var op=$("option",{value:v,text:lab?lab(v):v});if(F[key]===v)op.selected=true;o.appendChild(op);});
  o.addEventListener("change",function(){F[key]=o.value;render(true);});return $("label",null,[T(label)+" ",o]);}
 function uniq(p){var u={};R.forEach(function(r){var v=get(r,p);if(v)u[v]=1;});return Object.keys(u).sort();}
 s.appendChild(sel("toc-fi","institution","inst",uniq("finding.institution")));
 s.appendChild(sel("toc-fc","class","cls",["clear","borderline","language"],clsLabel));
 var tr=uniq("finding.trigger"); if(tr.length)s.appendChild(sel("toc-ft","trigger","trig",tr));
 var q=$("input",{type:"search",id:"toc-q",value:F.q,placeholder:"…"});q.addEventListener("input",function(){F.q=q.value;render(true,"toc-q");});
 s.appendChild($("label",null,[T("search")+" ",q]));s.appendChild($("p",{cls:"toc-n","aria-live":"polite",text:filtered().length+" / "+R.length}));return s;};
C.CardList=function(){var R=filtered();if(!rows().length)return null;var s=$("section",{cls:"toc-cards"},[$("h2",{text:T("cards")})]);
 R.forEach(function(r){var f=r.finding||{},k=classOf(r);var art=$("article",{cls:"toc-card c-"+k,id:r.id.toLowerCase()},[
  $("p",{cls:"toc-badge",text:clsLabel(k)+(f.open?" · "+T("open"):"")}),$("h3",{text:f.institution||r.title}),
  $("p",{cls:"toc-date",text:T("neg")+": "+(f.negative_date||"—")+(f.positive_date?" · "+T("pos")+": "+f.positive_date:"")})]);
  if(f.negative_quote)art.appendChild($("blockquote",{cls:"q-neg"},[$("p",{text:"“"+f.negative_quote+"”"})]));
  if(f.positive_quote)art.appendChild($("blockquote",{cls:"q-pos"},[$("p",{text:"“"+f.positive_quote+"”"})]));
  if((f.terms||[]).length){var ul=$("ul",{cls:"toc-tl"});f.terms.forEach(function(t){ul.appendChild($("li",null,[$("b",{text:t.term}),$("span",{text:" → "+t.statute})]));});art.appendChild($("p",{cls:"toc-sub",text:T("terms_used")}));art.appendChild(ul);}
  if(f.conduct)art.appendChild($("p",{cls:"toc-conduct",text:f.conduct}));
  s.appendChild(art);});
 if(!R.length)s.appendChild($("p",{cls:"toc-muted",text:T("none")}));return s;};
C.Table=function(n){if(!rows().length)return null;var cols=DB.copy.columns||[],R=filtered();
 var tb=$("table",{cls:"toc-table"});var tr=$("tr");cols.forEach(function(c){tr.appendChild($("th",{scope:"col",text:c}));});tb.appendChild($("thead",null,[tr]));var bd=$("tbody");
 R.forEach(function(r){var f=r.finding||{};var cells=[f.institution||"",f.negative_date||"",elapsed(f),f.positive_nature||(f.open?T("open"):"—"),f.conduct||((f.terms||[]).map(function(t){return t.term;}).join(", "))];
  var row=$("tr");cells.forEach(function(v,i){row.appendChild($("td",{"data-label":cols[i]||"",text:v}));});bd.appendChild(row);});tb.appendChild(bd);
 return $("section",{cls:"toc-tablew"},[$("h2",{text:T("table")}),$("div",{cls:"toc-scroll",tabindex:"0"},[tb])]);};
C.TermList=function(){if(!rows().length)return null;var m={};filtered().forEach(function(r){(get(r,"finding.terms")||[]).forEach(function(t){var k=t.term.toLowerCase();m[k]=m[k]||{term:t.term,statute:t.statute,n:0};m[k].n++;});});
 var ks=Object.keys(m).sort(function(a,b){return m[b].n-m[a].n||a.localeCompare(b);});var dl=$("dl",{cls:"toc-terms"});
 ks.forEach(function(k){dl.appendChild($("dt",null,[$("span",{cls:"toc-nut","aria-hidden":"true"}),m[k].term+" ",$("small",{text:"×"+m[k].n})]));dl.appendChild($("dd",{text:T("statute")+": "+m[k].statute}));});
 if(!ks.length)dl.appendChild($("dd",{text:T("none")}));return $("section",null,[$("h2",{text:T("terms")}),dl]);};
C.Glossary=function(){var st=DB.copy.statutes||[];var d=$("details",{cls:"toc-gloss"},[$("summary",{text:T("glossary")})]);
 st.forEach(function(s){d.appendChild($("div",{cls:"toc-g"},[$("h3",{text:s.law}),$("p",{text:s.what}),$("p",{cls:"toc-muted",text:(s.terms||[]).join(" · ")})]));});return d;};
C.Footer=function(){var m=DB.meta||{};return $("p",{cls:"toc-muted toc-foot",text:"That Old Chestnut "+(m.view_version||"")+" · "+(m.generated||"").slice(0,10)+" · built from the Cedwyn catalogue"});};

/* ---------- radar: back-and-forth sweep; email blips flip to chestnuts as the arm crosses them ---------- */
function hash(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0)/4294967295;}
C.Radar=function(n){var R=rows(),P=n.props,W=320,H=176,cx=160,cy=168,rad=150;
 var wrap=$("figure",{cls:"toc-radar"});var s=sv("svg",{viewBox:"0 0 "+W+" "+H,role:"img","aria-label":T("radar")});
 var defs=sv("defs",{});defs.innerHTML='<linearGradient id="tocBeam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3dffa8" stop-opacity="0"/><stop offset="1" stop-color="#3dffa8" stop-opacity=".45"/></linearGradient>'+
  '<symbol id="tocMail" viewBox="-8 -6 16 12"><rect x="-7" y="-5" width="14" height="10" rx="1.5" fill="#0d2a22" stroke="#7fe0bf" stroke-width="1.2"/><path d="M-7 -4 0 1 7 -4" fill="none" stroke="#7fe0bf" stroke-width="1.2"/></symbol>'+
  '<symbol id="tocNut" viewBox="-8 -8 16 16"><path d="M0 -6C5 -6 7 -1 6 2 5 6 2 7 0 7-2 7-5 6-6 2-7-1-5-6 0-6Z" fill="#8a4b22" stroke="#e8b27a" stroke-width=".8"/><path d="M-5.6 1.2C-3 3.4 3 3.4 5.6 1.2 5.2 5.4 2.4 6.8 0 6.8-2.4 6.8-5.2 5.4-5.6 1.2Z" fill="#d9b38a"/><circle cx="-2" cy="-3" r="1" fill="#f2c79a" opacity=".7"/></symbol>';
 s.appendChild(defs);
 [1,2,3].forEach(function(i){var r=rad*i/3;s.appendChild(sv("path",{d:"M"+(cx-r)+" "+cy+"A"+r+" "+r+" 0 0 1 "+(cx+r)+" "+cy,fill:"none",stroke:"#1f5a46","stroke-width":"1"}));});
 [30,60,90,120,150].forEach(function(a){var t=a*Math.PI/180;s.appendChild(sv("line",{x1:cx,y1:cy,x2:cx-rad*Math.cos(t),y2:cy-rad*Math.sin(t),stroke:"#163f32","stroke-width":"1"}));});
 s.appendChild(sv("line",{x1:cx-rad,y1:cy,x2:cx+rad,y2:cy,stroke:"#1f5a46","stroke-width":"1"}));
 var blips=[],nRec=R.length,nUn=P.unread_blips||7;
 function addBlip(key,isNut,i,total){var a=12+156*hash(key+"a"),r=rad*(.28+.64*hash(key+"r")),t=a*Math.PI/180;var x=cx-r*Math.cos(t),y=cy-r*Math.sin(t);
  var g=sv("g",{"class":"blip","transform":"translate("+x.toFixed(1)+" "+y.toFixed(1)+")"});var u=sv("use",{href:"#tocMail",x:"-8",y:"-6",width:"16",height:"12"});g.appendChild(u);
  var ti=sv("title",{});ti.textContent=isNut?key:T("not_read");g.appendChild(ti);s.appendChild(g);blips.push({a:a,g:g,u:u,nut:isNut,flipped:false});}
 R.forEach(function(r,i){addBlip(r.id,true,i,nRec);});for(var i=0;i<nUn;i++)addBlip("unread-"+i,false,i,nUn);
 var beam=sv("path",{fill:"url(#tocBeam)",opacity:".8"}),arm=sv("line",{x1:cx,y1:cy,x2:cx-rad,y2:cy,stroke:"#3dffa8","stroke-width":"2","stroke-linecap":"round"});
 s.appendChild(beam);s.appendChild(arm);s.appendChild(sv("circle",{cx:cx,cy:cy,r:"3.5",fill:"#3dffa8"}));
 function flip(b,on){if(b.flipped===on)return;b.flipped=on;if(on){b.u.setAttribute("href","#tocNut");b.u.setAttribute("x","-8");b.u.setAttribute("y","-8");b.u.setAttribute("height","16");b.g.setAttribute("class","blip nut pop");}else{b.u.setAttribute("href","#tocMail");b.u.setAttribute("x","-8");b.u.setAttribute("y","-6");b.u.setAttribute("height","12");b.g.setAttribute("class","blip");}}
 function pose(a,dir){var t=a*Math.PI/180;arm.setAttribute("x2",(cx-rad*Math.cos(t)).toFixed(1));arm.setAttribute("y2",(cy-rad*Math.sin(t)).toFixed(1));
  var tb=(a-dir*22)*Math.PI/180;beam.setAttribute("d","M"+cx+" "+cy+"L"+(cx-rad*Math.cos(tb)).toFixed(1)+" "+(cy-rad*Math.sin(tb)).toFixed(1)+"A"+rad+" "+rad+" 0 0 "+(dir>0?1:0)+" "+(cx-rad*Math.cos(t)).toFixed(1)+" "+(cy-rad*Math.sin(t)).toFixed(1)+"Z");}
 var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 wrap.appendChild(s);wrap.appendChild($("figcaption",{text:T("radar")+" ("+nRec+")"}));
 if(reduce){pose(150,1);blips.forEach(function(b){if(b.nut)flip(b,true);});return wrap;}
 var per=(P.period_s||7)*1000,t0=null,prev=0,raf=0;
 function frame(ts){if(t0==null)t0=ts;var ph=((ts-t0)%(2*per))/per;var a=ph<1?180*ease(ph):180*ease(2-ph);var dir=ph<1?1:-1;
  /* sweeping out (0→180) flips record blips to chestnuts; sweeping back (180→0) resets them, so the flip repeats each pass */
  blips.forEach(function(b){if(!b.nut)return;var lo=Math.min(prev,a),hi=Math.max(prev,a);if(b.a>=lo&&b.a<=hi)flip(b,dir>0);});prev=a;pose(a,dir);raf=requestAnimationFrame(frame);}
 function ease(x){return .5-.5*Math.cos(Math.PI*x);}
 raf=requestAnimationFrame(frame);radarStop=function(){cancelAnimationFrame(raf);};
 document.addEventListener("visibilitychange",function(){if(document.hidden){cancelAnimationFrame(raf);}else{t0=null;raf=requestAnimationFrame(frame);}});
 return wrap;};

/* ---------- parcel modal: shared /_cedwyn/parcel-modal.js when present, small built-in fallback otherwise ---------- */
function openParcel(ev){var p=DB.copy.parcel;if(!p)return;ev.preventDefault();
 if(window.CedwynParcel&&window.CedwynParcel.open){window.CedwynParcel.open(p,{lang:LANG,opener:ev.currentTarget});return;}
 var d=$("dialog",{cls:"cw-parcel-dlg","aria-labelledby":"cwp-h"});var body=$("div",{cls:"cwp-body"},[$("h2",{id:"cwp-h",text:p.label}),$("p",{text:p.status_text||""})]);
 if(p.grid_refs&&p.grid_refs.length){var ul=$("ul");p.grid_refs.forEach(function(g){ul.appendChild($("li",null,[$("b",{text:g.ref}),$("span",{text:" · "+g.source})]));});body.appendChild(ul);}
 if(p.names)body.appendChild($("p",{cls:"toc-muted",text:p.names.join(" · ")}));
 var links=$("p");(p.links||[]).concat(p.parcel_record?[{text:"c.1841 tithe apportionment (EV-0215)",href:p.parcel_record}]:[]).forEach(function(l,i){if(i)links.appendChild(document.createTextNode(" · "));links.appendChild($("a",{href:l.href,text:l.text}));});body.appendChild(links);
 var x=$("button",{type:"button",cls:"cwp-x","aria-label":"Close",text:"×"});x.addEventListener("click",function(){d.close();});d.appendChild(x);d.appendChild(body);
 d.addEventListener("close",function(){d.remove();});document.body.appendChild(d);if(d.showModal)d.showModal();else d.setAttribute("open","");}

/* ---------- render ---------- */
function render(keep,focusId){if(radarStop&&!keep){radarStop();radarStop=null;}LANG=lang();document.body.classList.add("toc-ready");
 var keepRadar=keep&&app.querySelector(".toc-radar");var ld=app.querySelector(".toc-loading");if(ld)ld.remove();
 [].slice.call(app.children).forEach(function(ch){if(ch.classList.contains("toc-head")||ch.tagName==="NOSCRIPT")return;if(keepRadar&&ch===keepRadar)return;ch.remove();});
 UI.root.forEach(function(n){if(n.component==="Header"){C.Header(n);return;}if(n.component==="Radar"&&keepRadar){app.appendChild(keepRadar);return;}var f=C[n.component];if(!f)return;var el=f(n);if(el){el.setAttribute("data-a2",n.id);app.appendChild(el);}});
 if(focusId){var fe=document.getElementById(focusId);if(fe){fe.focus();try{fe.setSelectionRange(fe.value.length,fe.value.length);}catch(e){}}}
 try{var u=new URLSearchParams();if(F.inst)u.set("institution",F.inst);if(F.cls)u.set("type",F.cls);if(F.trig)u.set("trigger",F.trig);if(F.q)u.set("q",F.q);history.replaceState(null,"",u.toString()?"?"+u:location.pathname);}catch(e){}}
function boot(){try{var p=new URLSearchParams(location.search);F.inst=p.get("institution")||"";F.cls=p.get("type")||"";F.trig=p.get("trigger")||"";F.q=p.get("q")||"";}catch(e){}
 var link=app.querySelector(".cw-parcel-link");if(link)link.addEventListener("click",openParcel);
 render(false);
 new MutationObserver(function(){if(lang()!==LANG)render(false);}).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});}
function j(u){return fetch(u,{credentials:"same-origin"}).then(function(r){if(!r.ok)throw new Error(u+" "+r.status);return r.json();});}
Promise.all([j(app.getAttribute("data-ui")),j(app.getAttribute("data-db"))]).then(function(v){UI=v[0];DB=v[1];boot();}).catch(function(){var ld=app.querySelector(".toc-loading");if(ld)ld.textContent="Audit in progress. The data for this page could not be loaded just now; please try again shortly.";});
})();
