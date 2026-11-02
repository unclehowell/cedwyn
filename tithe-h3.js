/* v0.1.1 (2 Nov 2026): the header carries "42 of 59" in its own numbering slot (.ghf-v2-name small), and the header's
   third row (the e-book "Read free" strip, or any other cross-promo put there) stays hidden on this webapp. The shared
   Garden banner (.ghf-v2-up.cw-gdn-on) is the one thing allowed in that row. When the area registry gives this webapp its
   own slot, the header's own number is used and nothing is added here. — Sion's Tab agent */
(function(){
var d=document,SLOT="42",OF="59",WORD={en:"of",cy:"o",es:"de"};
function lg(){var l=(d.documentElement.getAttribute("lang")||"en").slice(0,2).toLowerCase();return WORD[l]?l:"en";}
function num(){var n=d.querySelector(".ghf-v2-chain .ghf-v2-name");if(!n)return false;
 var s=n.querySelector("small");
 if(s&&!s.hasAttribute("data-th3-slot"))return true;
 var t=SLOT+" "+WORD[lg()]+" "+OF;
 if(!s){s=d.createElement("small");s.setAttribute("data-th3-slot","");n.appendChild(s);}
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
var COLORS={"Williams John":"#1b7a3a","Evans Revd James":"#7b3fa0","Evans the Revd James (Glebe)":"#7b3fa0","Rees Thomas":"#d9741c","Evans Evans":"#2f6db5","Sprackett John":"#b5306b","Williams James":"#3aa6a0","Jenkins William":"#8a6d1f","Jenkins Lewis":"#5d7f8c"};
function first(s){return (s||"").split(";")[0].trim();}
function col(p){if(p.read==="not read")return "#888";return COLORS[first(p.occ)]||"#555";}
var map=L.map("map",{zoomControl:true,attributionControl:true}).setView([51.4545,-3.2015],15);
var osm=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{subdomains:"abc",maxZoom:19,attribution:"© OpenStreetMap contributors"}).addTo(map);
var os6=L.tileLayer("https://mapseries-tilesets.s3.amazonaws.com/os/6inchsecond/{z}/{x}/{y}.png",{maxZoom:18,attribution:"OS six-inch c.1900, National Library of Scotland"});
var D,tithe,stew,outl=L.layerGroup().addTo(map),hexL=L.layerGroup().addTo(map),res=12,sel=null;
fetch("data/parcels.json?v=0.1.0").then(function(r){return r.json();}).then(function(d){D=d;init();});
function hexPoly(c,r){var ce=D.c[c],t=D.tmpl[String(r)];return t.map(function(o){return [ce[0]+o[0],ce[1]+o[1]];});}
function init(){
 var op=document.getElementById("l-op").value/100;
 tithe=L.imageOverlay("img/tithe-1841-overlay.webp",D.bounds,{opacity:op,attribution:"Tithe map 1841, National Library of Wales"}).addTo(map);
 stew=L.imageOverlay("img/stewart-plan-overlay.webp",D.bounds,{opacity:op});
 var all=[];
 D.parcels.forEach(function(p,i){
  var pg=L.polygon(p.poly,{color:"#111",weight:1.4,fill:true,fillOpacity:0.04,fillColor:col(p),dashArray:p.read==="not read"?"4 3":null});
  pg.on("click",function(){show(i);});pg.addTo(outl);all.push(pg);
  L.tooltip({permanent:true,direction:"center",className:"th3-lbl"}).setLatLng([p.lat,p.lon]).setContent(p.read==="not read"?"?":p.no).addTo(outl);
 });
 map.fitBounds(L.featureGroup(all).getBounds(),{padding:[10,10]});
 drawHex();legend();table();
}
function drawHex(){hexL.clearLayers();if(!res)return;var seen={};
 D.parcels.forEach(function(p,i){var cells=res===12?p.h12:res===11?p.h11:[p.h8];
  cells.forEach(function(c){if(res===8&&seen[c])return;seen[c]=1;
   var h=L.polygon(hexPoly(c,res),{color:res===8?"#1e4d45":col(p),weight:res===8?2:0.6,fillColor:col(p),fillOpacity:res===8?0.06:0.55});
   h.on("click",function(){show(i,c);});h.addTo(hexL);});});}
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(m){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[m];});}
function show(i,cell){var p=D.parcels[i];
 var h="<h3>Plan parcel "+esc(p.no)+"</h3><dl>"+
 "<dt>Number on the plan</dt><dd>"+esc(p.reading)+(p.read!=="yes"?" ("+esc(p.read)+")":"")+"</dd>"+
 "<dt>1841 tithe plot</dt><dd>"+esc(p.tithe||"none matched")+"</dd>"+
 "<dt>Field name</dt><dd>"+esc(p.fname||"—")+"</dd><dt>Land use</dt><dd>"+esc(p.use||"—")+"</dd><dt>Area as entered</dt><dd>"+esc(p.area||"—")+"</dd>"+
 "<dt>Landowner as entered</dt><dd>"+esc(p.owner||"—")+"</dd><dt>Occupier as entered</dt><dd>"+esc(p.occ||"—")+"</dd>"+
 "<dt>Outline from</dt><dd>"+esc(p.src)+"</dd><dt>Traced area</dt><dd>"+esc(p.traced)+" acres (rough)</dd>"+
 "<dt>Centre</dt><dd>"+p.lat.toFixed(5)+", "+p.lon.toFixed(5)+"</dd><dt>OS grid ref</dt><dd>"+esc(p.gr)+"</dd>"+
 "<dt>H3 res 8</dt><dd><code>"+esc(p.h8)+"</code></dd><dt>H3 res 11</dt><dd>"+p.n11+" cells</dd><dt>H3 res 12</dt><dd>"+p.n12+" cells</dd>"+
 (cell?"<dt>This hexagon</dt><dd><code>"+esc(cell)+"</code></dd>":"")+"</dl><p class=\"hint\">The plan-to-tithe match is our reading.</p>";
 document.getElementById("panel").innerHTML=h;
 if(sel)outl.removeLayer(sel);sel=L.polygon(p.poly,{color:"#e00",weight:3,fill:false}).addTo(outl);}
function legend(){var seen={},h="";D.parcels.forEach(function(p){var k=p.read==="not read"?"Plan number not read":first(p.occ)||"No 1841 match";if(!seen[k]){seen[k]=1;h+="<span><i style=\"background:"+(p.read==="not read"?"#888":(COLORS[first(p.occ)]||"#555"))+"\"></i>"+esc(k)+"</span>";}});
 document.getElementById("legend").innerHTML="<span><b>1841 occupier as entered:</b></span>"+h;}
function table(){var tb=document.querySelector("#tbl tbody"),h="";D.parcels.forEach(function(p,i){h+="<tr data-i=\""+i+"\"><td>"+esc(p.no)+"</td><td>"+esc(p.tithe)+"</td><td>"+esc(p.occ)+"</td><td>"+esc(p.gr)+"</td><td><code>"+esc(p.h8)+"</code></td></tr>";});tb.innerHTML=h;
 tb.addEventListener("click",function(e){var tr=e.target.closest("tr");if(!tr)return;var i=+tr.getAttribute("data-i"),p=D.parcels[i];show(i);map.setView([p.lat,p.lon],17);document.getElementById("map").scrollIntoView({behavior:"smooth"});});}
document.getElementById("l-tithe").addEventListener("change",function(e){e.target.checked?tithe.addTo(map):map.removeLayer(tithe);});
document.getElementById("l-stew").addEventListener("change",function(e){e.target.checked?stew.addTo(map):map.removeLayer(stew);});
document.getElementById("l-os").addEventListener("change",function(e){e.target.checked?os6.addTo(map):map.removeLayer(os6);});
document.getElementById("l-op").addEventListener("input",function(e){var v=e.target.value/100;tithe&&tithe.setOpacity(v);stew&&stew.setOpacity(v);});
Array.prototype.forEach.call(document.querySelectorAll("[data-r]"),function(b){b.addEventListener("click",function(){res=+b.getAttribute("data-r");Array.prototype.forEach.call(document.querySelectorAll("[data-r]"),function(x){x.setAttribute("aria-pressed",x===b?"true":"false");});drawHex();});});
})();