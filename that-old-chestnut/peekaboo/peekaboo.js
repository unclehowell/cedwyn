/* Peekaboo v0.3.0 (11 Nov 2026) - Cedwyn editors.
   The page is server-rendered from data/peekaboo.json by tools/peekaboo_sync.py. This script adds the header's "47 of 59"
   until the area registry carries slot 47, the changelog modal and WebMCP tools for agents, and (v0.3.0) builds the
   "At a glance" strip (folded under the introduction) from data/peekaboo.json and data/notices.json with the shared kit in
   dashboard.js: KPI tiles, a gauge, a donut, bars, a timeline and record/notice lists, each with an (i) that opens the detail.
   The text of the page stays primary and fully visible; the strip is a secondary summary. Without JS the strip stays hidden. */
(function(){
var d=document,NAME="Peekaboo",SLOT="47",OF="59",WORD={en:"of",cy:"o",es:"de"};
function lg(){var l=(d.documentElement.getAttribute("lang")||"en").slice(0,2).toLowerCase();return WORD[l]?l:"en";}
function num(){var n=d.querySelector(".ghf-v2-chain .ghf-v2-name");if(!n)return false;
 var b=n.querySelector("b"),s=n.querySelector("small");
 if(s&&!s.hasAttribute("data-pk-slot")&&b&&b.textContent.trim()===NAME)return true;
 if(b&&b.textContent!==NAME)b.textContent=NAME;
 var t=SLOT+" "+WORD[lg()]+" "+OF;
 if(!s){s=d.createElement("small");n.appendChild(s);}
 s.setAttribute("data-pk-slot","");
 if(s.textContent!==t||!s.querySelector("a")){s.textContent="";var a=d.createElement("a");a.className="cw-parcel-link";a.href="/parcels/";a.setAttribute("data-parcel-slot",SLOT);a.setAttribute("data-parcel-of",OF);a.style.color="inherit";a.style.textDecoration="none";a.textContent=t;s.appendChild(a);}
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
var d=document,nav=d.querySelector(".pk-filter"),cards=[].slice.call(d.querySelectorAll(".pk-card"));
if(nav&&cards.length){nav.hidden=false;
 nav.addEventListener("click",function(ev){var b=ev.target.closest("button[data-f]");if(!b)return;var f=b.getAttribute("data-f");
  [].forEach.call(nav.querySelectorAll("button"),function(x){x.setAttribute("aria-pressed",x===b?"true":"false");});
  cards.forEach(function(c){var by=c.getAttribute("data-by"),cat=(c.getAttribute("data-cat")||"").toLowerCase(),show=true;
   if(f==="us")show=by==="us";else if(f==="holder")show=by==="holder";else if(f==="cat")show=cat.indexOf("catalogue")>=0;else if(f==="nh")show=cat.indexOf("not held")>=0||cat.indexOf("outside scope")>=0;
   c.hidden=!show;});});}
var dlg=d.getElementById("pk-changelog");
d.addEventListener("click",function(ev){var o=ev.target.closest("[data-pk-info]");if(o&&dlg&&dlg.showModal){ev.preventDefault();dlg.showModal();}
 if(ev.target.closest("[data-pk-close]")&&dlg)dlg.close();if(ev.target===dlg)dlg.close();});
var db=null;function load(){if(db)return Promise.resolve(db);return fetch("data/peekaboo.json",{cache:"no-cache"}).then(function(r){return r.json();}).then(function(j){db=j;return j;});}
var nts=null;function loadN(){if(nts)return Promise.resolve(nts);return fetch("data/notices.json",{cache:"no-cache"}).then(function(r){return r.json();}).then(function(j){nts=j;return j;});}
var mc=(navigator&&navigator.modelContext)||d.modelContext;
if(mc&&typeof mc.registerTool==="function"){try{
 mc.registerTool({name:"peekaboo_list",description:"List the records Peekaboo shows: records found despite an incorrect label, catalogue description or a 'not held' reply. Optional filter found_by: 'us' or 'holder'.",
  inputSchema:{type:"object",properties:{found_by:{type:"string",enum:["us","holder"]}}},
  execute:function(a){return load().then(function(j){var e=j.entries.filter(function(x){return !a||!a.found_by||x.found_by===a.found_by;});return {content:[{type:"text",text:JSON.stringify(e)}]};});}});
 mc.registerTool({name:"peekaboo_notice",description:"Return one draft correction notice by id (N1, N2, ...), or all when no id is given. Drafts only; nothing is sent.",
  inputSchema:{type:"object",properties:{id:{type:"string"}}},
  execute:function(a){return loadN().then(function(j){var n=j.notices.filter(function(x){return !a||!a.id||x.id===a.id;});return {content:[{type:"text",text:JSON.stringify(n)}]};});}});
}catch(e){}}
})();

(function(){
var d=document,D=window.CwDash,root=d.getElementById("pk-dash"),box=d.getElementById("pk-glance");
function off(){if(box)box.hidden=true;}
if(!D||!root||!window.fetch||!window.Promise){off();return;}
function j(u){return fetch(u,{cache:"no-cache"}).then(function(r){if(!r.ok)throw new Error(u+" "+r.status);return r.json();});}
var el=D.el,CAT={"Not held, then found":"Not held","Outside scope, then found":"Outside scope","Catalogue description does not match the item":"Wrong description","Catalogue corrected by the holder":"Corrected"};
function short(hd){hd=String(hd||"").split(" (")[0];if(hd.indexOf(" \u2013 ")>0)hd=hd.split(" \u2013 ").pop();if(hd.indexOf(" / ")>0)hd=hd.split(" / ").pop();return hd;}
function cat(c){return CAT[c]||c;}
function by(e){return e.found_by==="us"?0:1;}
function replyDate(e){var m=/reply of (\d{4}-\d{2}-\d{2})/.exec(e.title||"");return m?m[1]:null;}
function clone(sel){var x=typeof sel==="string"?d.querySelector(sel):sel;if(!x)return null;x=x.cloneNode(true);x.removeAttribute("hidden");if(x.id)x.id="m-"+x.id;[].forEach.call(x.querySelectorAll("[id]"),function(y){y.id="m-"+y.id;});return x;}
function frag(list){var f=d.createDocumentFragment();list.forEach(function(n){if(n)f.appendChild(typeof n==="string"?el("p",{text:n}):n);});return f;}
function idsLine(list){return el("p",{"class":"cwd-ids",text:list.join(" \u00b7 ")});}
function recList(E){var ul=el("ul",null);E.forEach(function(e){ul.appendChild(el("li",null,[D.fdate(e.found_on,1)+" \u00b7 "+e.holder+" \u00b7 ",el("span",{"class":"cwd-ids",text:e.id}),(e.evidence&&e.evidence.length?el("span",{"class":"cwd-ids",text:" ("+e.evidence.join(", ")+")"}):null)]));});return ul;}
function recNode(e){var card=d.getElementById("pk-"+String(e.id).toLowerCase()),meta=D.dl([["Catalogue ID",e.id],["Found",D.fdate(e.found_on)+(e.found_by==="us"?", by us":", by the holder")],["Holder",e.holder],["Reference",e.reference],["Evidence",(e.evidence||[]).join(", ")],["Notices",(e.notices||[]).join(", ")],["Record version",e.record_version!=null?String(e.record_version):""]]);
 if(card)return frag([clone(card),meta]);
 return frag([D.dl([["Label said",e.said],["What was there",e.found],["Why it matters",e.why],["Category",e.category]]),meta]);}
function noteNode(x){var dt=d.getElementById("notice-"+x.id);if(dt)return frag([clone(dt)]);
 return frag([D.dl([["To",x.to],["Item",x.item],["What is wrong",x.wrong],["Correction asked",x.ask],["Record",x.record],["Status",x.status]]),el("pre",{"class":"pk-draft",text:x.draft||""})]);}
function build(db,nt){
 var E=(db.entries||[]).slice().sort(function(a,b){return (b.found_on||"").localeCompare(a.found_on||"");}),N=(nt.notices||[]),C=db.counts||{};
 var tot=E.length,us=E.filter(function(e){return e.found_by==="us";}),hol=E.filter(function(e){return e.found_by!=="us";});
 root.textContent="";
 var about=function(){return frag([clone(".pk-lede"),clone(".pk-scope"),clone(".pk-legend"),clone(".pk-how p")]);};
 root.appendChild(el("div",{"class":"cwd-bar"},[el("span",{"class":"cwd-chip",text:"Synced "+D.fdate(db.synced_at,1)}),el("span",{"class":"cwd-chip"},["About this page ",D.info("pk-about","About Peekaboo",about)])]));
 var k=el("div",{"class":"cwd-kpis"});
 k.appendChild(D.tile({value:tot,label:"Records found",tone:4,info:"pk-k-all",detail:function(){return frag([clone(".pk-stats"),"Records that turned up where a catalogue, a label or a reply said they were not.",recList(E)]);}}));
 k.appendChild(D.tile({value:us.length,label:"Found by us",tone:0,info:"pk-k-us",detail:function(){return frag(["Records we found ourselves, by reading the item against its catalogue entry.",recList(us)]);}}));
 k.appendChild(D.tile({value:hol.length,label:"Found by holder",tone:1,info:"pk-k-hol",detail:function(){return frag(["Records the holder found itself after a first reply, label or catalogue entry had missed them.",recList(hol)]);}}));
 k.appendChild(D.tile({value:N.length,label:"Notices held",sub:"0 sent",tone:2,info:"pk-k-n",detail:function(){return frag([clone(".pk-notices .pk-note"),D.dl(N.map(function(x){return [x.id,x.to+" \u00b7 "+x.status];}))]);}}));
 root.appendChild(k);
 var g=el("div",{"class":"cwd-grid"});
 g.appendChild(D.card({title:"Found by the holder",info:"pk-c-gauge",body:D.gauge({value:hol.length,max:tot||1,tone:1,sub:hol.length+" of "+tot+" records"}),
  detail:function(){return frag(["The share of records where the holder itself turned up what its label, catalogue or first reply had missed, once asked again. The rest were found by us.",D.dl([["By the holder",hol.length+" of "+tot],["By us",us.length+" of "+tot]]),recList(hol)]);}}));
 var cats={},order=[];E.forEach(function(e){var c=cat(e.category);if(!(c in cats)){cats[c]=[];order.push(c);}cats[c].push(e);});
 order.sort(function(a,b){return cats[b].length-cats[a].length;});
 g.appendChild(D.card({title:"What the label said",info:"pk-c-donut",body:D.donut({parts:order.map(function(c){return {label:c,value:cats[c].length};}),center:tot,sub:"records"}),
  detail:function(){return frag(order.map(function(c){return frag([el("p",null,[el("b",{text:c+" ("+cats[c].length+")"}),el("br"),el("small",{text:cats[c][0].category})]),recList(cats[c])]);}));}}));
 var R=E.filter(replyDate).map(function(e){return {e:e,r:replyDate(e),n:D.days(replyDate(e),e.found_on)};}).sort(function(a,b){return a.n-b.n;});
 if(R.length)g.appendChild(D.card({title:"Days from \u201cnot held\u201d to found",info:"pk-c-bars",body:D.bars({unit:"days",rows:R.map(function(x){return {label:D.fdate(x.r,1)+" \u00b7 "+short(x.e.holder),value:x.n,tone:1};})}),
  detail:function(){return frag(["For each reply that said the records were not held or out of scope: the date of that reply, the date the records were found, and the days between.",D.dl(R.map(function(x){return [D.fdate(x.r,1),el("span",null,[x.e.holder+": found "+D.fdate(x.e.found_on,1)+", "+x.n+" days later. ",el("span",{"class":"cwd-ids",text:[x.e.id].concat(x.e.evidence||[]).join(", ")})])];}))]);}}));
 var tl=el("div",null,[D.timeline({points:E.map(function(e){return {date:e.found_on,tone:by(e),label:short(e.holder)};})}),el("div",{"class":"cwd-leg",style:"display:flex;gap:.8rem;margin-top:.2rem"},[el("span",null,[el("i",{style:"display:inline-block;width:.6rem;height:.6rem;border-radius:9px;margin-right:.3rem;background:"+D.tone(0)}),"Us"]),el("span",null,[el("i",{style:"display:inline-block;width:.6rem;height:.6rem;border-radius:9px;margin-right:.3rem;background:"+D.tone(1)}),"Holder"])])]);
 g.appendChild(D.card({title:"When each was found",info:"pk-c-time",body:tl,detail:function(){return frag(["Each dot is one record, on the date it was found, coloured by who found it.",recList(E.slice().reverse())]);}}));
 g.appendChild(D.card({title:"The records",wide:true,info:"pk-c-rows",detail:function(){return frag(["Tap the (i) on a row for the full card: what the label said, what was there, why it matters, cross-links and catalogue IDs.",clone(".pk-legend")]);},
  body:D.rows({rows:E.map(function(e){return {text:D.fdate(e.found_on,1)+" \u00b7 "+short(e.holder),tag:cat(e.category),tone:by(e),info:"pk-r-"+String(e.id).toLowerCase(),title:e.title,detail:function(){return recNode(e);}};})})}));
 g.appendChild(D.card({title:"Correction notices",wide:true,info:"pk-c-notes",detail:function(){return frag([clone(".pk-notices .pk-note")]);},
  body:D.rows({rows:N.map(function(x){return {text:x.id+" \u00b7 "+short(x.to),tag:"Held",tone:2,info:"pk-n-"+x.id.toLowerCase(),title:x.id+" \u00b7 "+x.to,detail:function(){return noteNode(x);}};})})}));
 root.appendChild(g);if(box)box.hidden=false;
}
d.addEventListener("click",function(ev){if(ev.target.closest&&ev.target.closest('.cwd-modal a[href^="#"]'))D.close();});
Promise.all([j("data/peekaboo.json"),j("data/notices.json")]).then(function(a){build(a[0],a[1]);}).catch(function(){off();});
})();
