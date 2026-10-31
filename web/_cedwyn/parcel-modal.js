/* Cedwyn parcel modal v0.1.0 — shared by every webapp. Each webapp is one of the estate's 59 parcels and shows
   "NN of 59" in its header; that label opens this modal. Markup on any page:
     <a class="cw-parcel-link" href="/parcels/" data-parcel-slot="37" data-parcel-of="59" [data-parcel-src="_db/view.json"]>37 of 59</a>
   data-parcel-src (optional): a same-site JSON file whose copy.parcel holds the webapp's parcel block (what it has gathered
   about its parcel). Without it the modal reads /areas.json (built from data/site-areas.json) by slot.
   Without JavaScript the link simply opens /parcels/. No outbound requests. Machine notes: /library/ and AGENTS docs. */
(function(){
"use strict";
if(window.CedwynParcel)return;
var L={en:{close:"Close",grid:"Grid references",names:"Names and spellings",read:"Read more",slot:"Parcel",of:"of",
  pending:"The historic plot number for this parcel is not yet fixed: the c.1841 tithe schedule (EV-0215) is still to be checked row by row. Until then the number is an index of the estate's 59 parcels, not a plot reference."},
 cy:{close:"Cau",grid:"Cyfeirnodau grid",names:"Enwau a sillafiadau",read:"Darllen mwy",slot:"Llain",of:"o",
  pending:"Nid yw rhif hanesyddol y llain hon wedi'i bennu eto: mae angen gwirio rhestr y degwm c.1841 (EV-0215) fesul rhes. Tan hynny, mynegai o 59 llain yr ystâd yw'r rhif, nid cyfeirnod llain."},
 es:{close:"Cerrar",grid:"Referencias de cuadrícula",names:"Nombres y grafías",read:"Leer más",slot:"Parcela",of:"de",
  pending:"El número histórico de esta parcela aún no está fijado: falta cotejar fila por fila el registro del diezmo de c.1841 (EV-0215). Hasta entonces, el número es un índice de las 59 parcelas de la finca, no una referencia de parcela."}};
function lang(o){var l=((o&&o.lang)||document.documentElement.getAttribute("lang")||"en").slice(0,2).toLowerCase();return L[l]?l:"en";}
function el(t,a,kids){var e=document.createElement(t);if(a)for(var k in a){if(a[k]==null)continue;if(k==="text")e.textContent=a[k];else if(k==="cls")e.className=a[k];else e.setAttribute(k,a[k]);}(kids||[]).forEach(function(c){if(c!=null)e.appendChild(typeof c==="string"?document.createTextNode(c):c);});return e;}
function internal(h){return typeof h==="string"&&/^\/(?!\/)/.test(h);}
var styled=false;
function style(){if(styled)return;styled=true;var s=el("style",{"data-cw-parcel":"1"});s.textContent=
 ".cw-parcel-dlg{max-width:min(560px,calc(100vw - 24px));width:100%;padding:0;border:1px solid #3dffa8;border-radius:14px;background:#0b1712;color:#e6efe9;font:15px/1.55 system-ui,sans-serif}"+
 ".cw-parcel-dlg::backdrop{background:rgba(0,0,0,.7)}.cw-parcel-dlg a{color:#3dffa8}.cwp-body{padding:16px 18px 18px;overflow-wrap:anywhere}"+
 ".cwp-body h2{margin:0 0 .4em;font-size:1.2rem}.cwp-body h3{margin:1em 0 .3em;font-size:.95rem}.cwp-muted{color:#9db3a8;font-size:.85rem}"+
 ".cwp-x{float:right;margin:8px 10px 0 0;width:36px;height:36px;border:0;border-radius:50%;background:#14271f;color:#e6efe9;font-size:1.3rem;cursor:pointer}";
 document.head.appendChild(s);}
function open(p,o){p=p||{};var t=L[lang(o)];style();
 var d=el("dialog",{cls:"cw-parcel-dlg","aria-labelledby":"cwp-h"});
 var b=el("div",{cls:"cwp-body"},[el("p",{cls:"cwp-muted",text:t.slot+(p.title?" · "+p.title:"")}),el("h2",{id:"cwp-h",text:p.label||((p.slot||"?")+" "+t.of+" "+(p.of||59))}),
  el("p",{text:(lang(o)==="en"&&p.status_text)?p.status_text:t.pending})]);
 if(p.grid_refs&&p.grid_refs.length){b.appendChild(el("h3",{text:t.grid}));var ul=el("ul");p.grid_refs.forEach(function(g){ul.appendChild(el("li",null,[el("b",{text:g.ref||String(g)}),g.source?el("span",{cls:"cwp-muted",text:" · "+g.source}):null]));});b.appendChild(ul);}
 if(p.names&&p.names.length){b.appendChild(el("h3",{text:t.names}));b.appendChild(el("p",{cls:"cwp-muted",text:p.names.join(" · ")}));}
 if(p.replica&&p.replica.text){var rp=el("p",{cls:"cwp-muted"},[p.replica.text+" "]);if(internal(p.replica.page))rp.appendChild(el("a",{href:p.replica.page,text:t.read}));b.appendChild(rp);}
 var links=(p.links||[]).slice();if(p.parcel_record)links.push({text:"EV-0215 · c.1841 tithe apportionment",href:p.parcel_record});
 links=links.filter(function(l){return l&&internal(l.href);});
 if(links.length){var lp=el("p");links.forEach(function(l,i){if(i)lp.appendChild(document.createTextNode(" · "));lp.appendChild(el("a",{href:l.href,text:l.text}));});b.appendChild(lp);}
 var x=el("button",{type:"button",cls:"cwp-x","aria-label":t.close,text:"×"});x.addEventListener("click",function(){d.close();});
 d.appendChild(x);d.appendChild(b);var opener=o&&o.opener;
 d.addEventListener("close",function(){d.remove();if(opener&&opener.focus)opener.focus();});
 d.addEventListener("click",function(e){if(e.target===d)d.close();});
 document.body.appendChild(d);if(d.showModal)d.showModal();else d.setAttribute("open","");x.focus();return d;}
function getJSON(u){return fetch(u,{credentials:"same-origin"}).then(function(r){if(!r.ok)throw 0;return r.json();});}
function fromAreas(slot,of){return getJSON("/areas.json").then(function(a){var hit=(a.areas||[]).filter(function(x){return String(x.slot)===String(slot);})[0]||{};
 return {slot:slot,of:of,label:slot+" of "+of,title:hit.title,links:[{text:"Every page area and its parcel slot",href:"/parcels/site-areas/"},{text:"The tithe parcels of c.1841",href:"/parcels/"}],parcel_record:"/research/evidence/ev-0215-tithe-apportionment-john-williams-c1841/"};});}
function load(a){var slot=a.getAttribute("data-parcel-slot"),of=a.getAttribute("data-parcel-of")||"59",src=a.getAttribute("data-parcel-src");
 var p=src&&internal(new URL(src,location.href).pathname)?getJSON(src).then(function(j){return (j.copy&&j.copy.parcel)||j.parcel||Promise.reject();}):Promise.reject();
 return p.catch(function(){return fromAreas(slot,of);});}
document.addEventListener("click",function(e){var a=e.target&&e.target.closest&&e.target.closest("a.cw-parcel-link,[data-parcel-slot]");
 if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.button)return;e.preventDefault();
 load(a).then(function(p){open(p,{opener:a});}).catch(function(){location.href=a.getAttribute("href")||"/parcels/";});});
window.CedwynParcel={open:open,load:load,version:"0.1.0"};
})();
