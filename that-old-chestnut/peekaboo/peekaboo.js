/* Peekaboo v0.1.0 (3 Nov 2026) - Cedwyn editors.
   The page is server-rendered from data/peekaboo.json by tools/peekaboo_sync.py; this script adds the filters, the changelog
   modal, the header's "47 of 59" until the area registry carries slot 47, and WebMCP tools for agents. */
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
