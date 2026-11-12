/* Cedwyn dashboard kit v1.0.0 (11 Nov 2026) - vanilla JS, inline SVG, no external requests.
   window.CwDash: tile, gauge, donut, bars, timeline, rows, card, info, open. Every chart carries an (i) button that opens one
   shared <dialog> with the detail text, sources and catalogue IDs. Copy with dashboard.css; see STANDARD.md. - Cedwyn editors */
(function(w,d){"use strict";
var NS="http://www.w3.org/2000/svg",REG={},dlg=null,lastFocus=null,uid=0;
function el(t,a,k){var e=d.createElement(t);if(a)for(var n in a){if(a[n]==null)continue;if(n==="text")e.textContent=a[n];else if(n==="html")e.innerHTML=a[n];else if(n==="style")e.style.cssText=a[n];else e.setAttribute(n,a[n]);}
 (k||[]).forEach(function(c){if(c!=null)e.appendChild(typeof c==="string"?d.createTextNode(c):c);});return e;}
function sv(t,a){var e=d.createElementNS(NS,t);for(var n in a)e.setAttribute(n,a[n]);return e;}
function tone(n){return "var(--cwd-s"+(((n||0)%6)+1)+")";}
/* info(id,title,body): register modal content; body = Node, HTML string, or function returning either. Returns the (i) button. */
function info(id,title,body){if(!id)id="cwd-i"+(++uid);if(title||body)REG[id]={title:title,body:body};
 return el("button",{type:"button","class":"cwd-i","data-cw-info":id,"aria-haspopup":"dialog","aria-label":"Details: "+(title||"more"),title:"Details"},["i"]);}
function ensure(){if(dlg)return dlg;dlg=el("dialog",{"class":"cwd-modal","aria-labelledby":"cwd-mt"});
 var hd=el("div",{"class":"cwd-mh"},[el("b",{id:"cwd-mt"}),el("button",{type:"button","class":"cwd-x","data-cw-close":"","aria-label":"Close"},["\u00d7"])]);
 dlg.appendChild(hd);dlg.appendChild(el("div",{"class":"cwd-mb"}));d.body.appendChild(dlg);
 dlg.addEventListener("close",function(){d.documentElement.classList.remove("cwd-lock");if(lastFocus&&lastFocus.focus)lastFocus.focus();});
 dlg.addEventListener("click",function(ev){if(ev.target===dlg||ev.target.closest("[data-cw-close]"))close();});
 return dlg;}
function close(){if(!dlg)return;if(dlg.close&&dlg.open)dlg.close();else{dlg.removeAttribute("open");d.documentElement.classList.remove("cwd-lock");}}
/* open(id): registry entry first, else an element with that id in the page (cloned, ids prefixed so anchors stay unique). */
function open(id,opener){var r=REG[id],m=ensure(),body=m.querySelector(".cwd-mb"),title="",node=null;
 if(r){title=r.title||"";node=typeof r.body==="function"?r.body():r.body;}
 else{var src=d.getElementById(id);if(!src)return false;node=src.cloneNode(true);title=src.getAttribute("data-cw-title")||"";node.removeAttribute("hidden");
  [].forEach.call(node.querySelectorAll?node.querySelectorAll("[id]"):[],function(x){x.id="m-"+x.id;});if(node.id)node.id="m-"+node.id;
  if(node.tagName==="DETAILS")node.setAttribute("open","");}
 m.querySelector("#cwd-mt").textContent=title;body.textContent="";
 if(typeof node==="string")body.innerHTML=node;else if(node)body.appendChild(node);
 lastFocus=opener||d.activeElement;d.documentElement.classList.add("cwd-lock");
 if(m.showModal){if(!m.open)m.showModal();}else m.setAttribute("open","");body.scrollTop=0;m.querySelector(".cwd-x").focus();return true;}
d.addEventListener("click",function(ev){var b=ev.target.closest&&ev.target.closest("[data-cw-info]");if(!b)return;ev.preventDefault();open(b.getAttribute("data-cw-info"),b);});
d.addEventListener("keydown",function(ev){if(ev.key==="Escape"&&dlg&&dlg.hasAttribute("open")&&!dlg.showModal)close();});
function head(title,id,ib){return el("div",{"class":"cwd-h"},[el("b",{text:title}),info(id,title,ib)]);}
/* card(title, infoId, infoBody, content, wide) */
function card(o){var c=el("section",{"class":"cwd-card"+(o.wide?" cwd-wide":""),"aria-label":o.title});c.appendChild(head(o.title,o.info,o.detail));if(o.body)c.appendChild(o.body);return c;}
/* tile({value,label,sub,info,detail,tone}) */
function tile(o){var t=el("div",{"class":"cwd-tile",style:o.tone!=null?"--cwd-tone:"+tone(o.tone):null},[el("div",{"class":"cwd-val",text:String(o.value)}),el("div",{"class":"cwd-lab",text:o.label}),o.sub?el("div",{"class":"cwd-sub",text:o.sub}):null]);
 t.appendChild(info(o.info,o.label,o.detail));return t;}
/* gauge({value,max,label,sub,tone}) -> SVG semicircle with the percentage in the middle */
function gauge(o){var max=o.max||1,f=Math.max(0,Math.min(1,o.value/max)),r=80,cx=100,cy=96,len=Math.PI*r;
 var s=sv("svg",{viewBox:"0 0 200 124","class":"cwd-svg cwd-g",role:"img","aria-label":(o.label||"")+": "+o.value+" of "+max});
 var p="M"+(cx-r)+" "+cy+" A"+r+" "+r+" 0 0 1 "+(cx+r)+" "+cy;
 s.appendChild(sv("path",{d:p,"class":"cwd-track","stroke-width":"16","stroke-linecap":"round"}));
 var a=sv("path",{d:p,fill:"none",stroke:o.tone!=null?tone(o.tone):"var(--cwd-acc)","stroke-width":"16","stroke-linecap":"round","stroke-dasharray":len,"stroke-dashoffset":len,"class":"cwd-arc"});s.appendChild(a);
 for(var k=0;k<=4;k++){var an=Math.PI*(1-k/4),x1=cx+Math.cos(an)*(r+11),y1=cy-Math.sin(an)*(r+11),x2=cx+Math.cos(an)*(r+16),y2=cy-Math.sin(an)*(r+16);s.appendChild(sv("line",{x1:x1,y1:y1,x2:x2,y2:y2,stroke:"var(--cwd-line)","stroke-width":"2"}));}
 var t=sv("text",{x:cx,y:cy-14,"text-anchor":"middle","class":"cwd-t-big"});t.textContent=Math.round(f*100)+"%";s.appendChild(t);
 var t2=sv("text",{x:cx,y:cy+8,"text-anchor":"middle","class":"cwd-t-mut"});t2.textContent=o.sub||(o.value+" of "+max);s.appendChild(t2);
 var l0=sv("text",{x:cx-r,y:cy+22,"text-anchor":"middle","class":"cwd-t-mut"});l0.textContent="0";s.appendChild(l0);
 var l1=sv("text",{x:cx+r,y:cy+22,"text-anchor":"middle","class":"cwd-t-mut"});l1.textContent=String(max);s.appendChild(l1);
 requestAnimationFrame(function(){requestAnimationFrame(function(){a.setAttribute("stroke-dashoffset",len*(1-f));});});return s;}
/* donut({parts:[{label,value}],center,sub}) -> SVG ring + legend */
function donut(o){var tot=o.parts.reduce(function(s,p){return s+p.value;},0)||1,r=42,C=2*Math.PI*r,off=0;
 var s=sv("svg",{viewBox:"0 0 120 120","class":"cwd-svg",role:"img","aria-label":o.parts.map(function(p){return p.label+" "+p.value;}).join(", ")});
 s.appendChild(sv("circle",{cx:60,cy:60,r:r,"class":"cwd-track","stroke-width":"18"}));
 o.parts.forEach(function(p,i){var l=C*p.value/tot,g=o.parts.length>1?1.5:0;s.appendChild(sv("circle",{cx:60,cy:60,r:r,fill:"none",stroke:p.color||tone(i),"stroke-width":"18","stroke-dasharray":Math.max(0,l-g)+" "+(C-Math.max(0,l-g)),"stroke-dashoffset":-off,transform:"rotate(-90 60 60)"}));off+=l;});
 var t=sv("text",{x:60,y:62,"text-anchor":"middle","class":"cwd-t-big"});t.textContent=o.center!=null?o.center:tot;s.appendChild(t);
 var t2=sv("text",{x:60,y:78,"text-anchor":"middle","class":"cwd-t-mut"});t2.textContent=o.sub||"";s.appendChild(t2);
 var leg=el("ul",{"class":"cwd-leg"});o.parts.forEach(function(p,i){leg.appendChild(el("li",null,[el("i",{style:"background:"+(p.color||tone(i))}),el("span",{text:p.label}),el("b",{text:String(p.value)})]));});
 return el("div",{"class":"cwd-donut"},[s,leg]);}
/* bars({rows:[{label,value,note,tone}],max,unit}) -> horizontal bars */
function bars(o){var mx=o.max||Math.max.apply(null,o.rows.map(function(r){return r.value;}).concat([1])),ul=el("ul",{"class":"cwd-bars"});
 o.rows.forEach(function(r,i){var sp=el("span",{style:"width:0%"});ul.appendChild(el("li",{style:"--cwd-tone:"+(r.tone!=null?tone(r.tone):"var(--cwd-acc)")},[el("div",{"class":"cwd-bl"},[el("span",{text:r.label}),el("b",{text:r.value+(o.unit?" "+o.unit:"")})]),el("div",{"class":"cwd-bt"},[sp])]));
  requestAnimationFrame(function(){requestAnimationFrame(function(){sp.style.width=(100*r.value/mx)+"%";});});});return ul;}
/* timeline({points:[{date:'YYYY-MM-DD',tone,label}],from,to}) -> SVG dots on a month axis */
function timeline(o){var ts=o.points.map(function(p){return Date.parse(p.date+"T12:00:00Z");}),a=Date.parse((o.from||"")+"T00:00:00Z"),b=Date.parse((o.to||"")+"T00:00:00Z");
 if(isNaN(a))a=Math.min.apply(null,ts)-864e5*10;if(isNaN(b))b=Math.max.apply(null,ts)+864e5*10;
 var W=320,H=64,L=12,R=W-12,y=30,X=function(t){return L+(R-L)*(t-a)/(b-a);};
 var s=sv("svg",{viewBox:"0 0 "+W+" "+H,"class":"cwd-svg",role:"img","aria-label":o.points.map(function(p){return p.date+" "+(p.label||"");}).join("; ")});
 s.appendChild(sv("line",{x1:L,y1:y,x2:R,y2:y,stroke:"var(--cwd-line)","stroke-width":"2"}));
 var M=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],m=new Date(a);m.setUTCDate(1);m.setUTCMonth(m.getUTCMonth()+1);
 while(m.getTime()<b){var x=X(m.getTime());s.appendChild(sv("line",{x1:x,y1:y-4,x2:x,y2:y+4,stroke:"var(--cwd-line)","stroke-width":"1.5"}));
  var tx=sv("text",{x:x,y:y+20,"text-anchor":"middle","class":"cwd-t-mut"});tx.textContent=M[m.getUTCMonth()];s.appendChild(tx);m.setUTCMonth(m.getUTCMonth()+1);}
 var put=[];o.points.forEach(function(p,i){var x=X(ts[i]),lift=0;while(put.some(function(q){return q[1]===lift&&Math.abs(q[0]-x)<13;}))lift++;put.push([x,lift]);
  var c=sv("circle",{cx:x,cy:y-lift*13,r:6,fill:p.tone!=null?tone(p.tone):"var(--cwd-acc)",stroke:"var(--cwd-card)","stroke-width":"2"});var tt=sv("title",{});tt.textContent=p.date+" "+(p.label||"");c.appendChild(tt);s.appendChild(c);});
 return s;}
/* rows({rows:[{text,small,tag,tone,info,title}]}) -> compact list, each row with its own (i) */
function rows(o){var ul=el("ul",{"class":"cwd-rows"});o.rows.forEach(function(r){ul.appendChild(el("li",{style:r.tone!=null?"--cwd-tone:"+tone(r.tone):null},[el("span",{"class":"cwd-dot"}),el("span",{"class":"cwd-rt"},[r.text,r.small?el("small",{text:" "+r.small}):null]),r.tag?el("span",{"class":"cwd-tag",text:r.tag}):null,info(r.info,r.title||r.text,r.detail)]));});return ul;}
function dl(pairs){return el("dl",null,[].concat.apply([],pairs.filter(function(p){return p&&p[1]!=null&&p[1]!=="";}).map(function(p){return [el("dt",{text:p[0]}),typeof p[1]==="string"?el("dd",{text:p[1]}):el("dd",null,[p[1]])];})));}
var fmtM=["January","February","March","April","May","June","July","August","September","October","November","December"];
function fdate(iso,short){var m=/^(\d{4})-(\d{2})-(\d{2})/.exec(iso||"");if(!m)return iso||"";var mo=fmtM[+m[2]-1];return (+m[3])+" "+(short?mo.slice(0,3):mo)+" "+m[1];}
function days(a,b){return Math.round((Date.parse(b+"T12:00:00Z")-Date.parse(a+"T12:00:00Z"))/864e5);}
w.CwDash={version:"1.0.0",el:el,info:info,open:open,close:close,card:card,tile:tile,gauge:gauge,donut:donut,bars:bars,timeline:timeline,rows:rows,dl:dl,fdate:fdate,days:days,tone:tone};
})(window,document);
