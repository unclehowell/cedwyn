/* That Old Chestnut — generative UI, built in the browser on page load from _ui/index.a2ui.json + _db/view.json.
   No model, no paid service, no network beyond these two same-site files. v0.3.1 */
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
/* v0.2.0 disclosure highlight: an entry is a disclosure when its record says so (finding.disclosure true/false), else when its
   disclosure_type is set and not 'pending', else an interim disclosure, else a later positive reply not marked pending. Data-driven. */
function isDisc(f){f=f||{};if(f.disclosure!=null)return !!f.disclosure;var t=f.disclosure_type||"";if(t)return !/^\s*pending|not yet disclosed/i.test(t);if(f.interim_disclosure)return true;return !!f.positive_quote&&!/^\s*pending|not yet disclosed/i.test(f.positive_nature||"");}
var DISC={en:"Disclosure",cy:"Datgeliad",es:"Divulgación"};
function wow(){return $("span",{cls:"toc-wow",role:"img","aria-label":DISC[LANG]||DISC.en,text:"\uD83D\uDE2E"});}
function clsLabel(c){return T(c==="clear"?"clear":c==="borderline"?"borderline":"language");}


/* ---------- components ---------- */
var C={};
/* ---------- v0.3.0 old chestnuts: passages that raise why a record was not disclosed sooner ----------
   Detection is automatic and data-driven: every clause of a record's conduct note and of its reply quotes is scored against
   the rule list below (or the same list in _ui/chestnuts.rules.json when present). Clauses scoring >= min_clause get the
   crescendo highlight (level 1-3 by score); a record whose best clause scores >= min_record is an "old chestnut" and joins the
   🌰 list, with that clause as its headline. Manual overrides: chestnuts.rules.json "overrides" by record id
   ({"exclude":true} | {"headline":"…"} | {"include":true}) or the record's own finding.chestnut (false | true | "headline"). */
var CN={min_clause:2,min_record:3,overrides:{},rules:[
 {k:"scope",w:3,p:"\\b(?:withheld|left out|excluded|set aside|treated)\\b[^.;]{0,40}\\b(?:out of|outside(?: of)?)(?: the| our)? scope\\b"},
 {k:"scope",w:3,p:"\\bnot considered to fall within the scope\\b"},
 {k:"scope",w:1,p:"\\b(?:out of|outside(?: of)?)(?: the| our)? scope\\b"},
 {k:"later",w:3,p:"\\b(?:\\w+ )?(?:days|weeks|months|years) later\\b"},
 {k:"later",w:3,p:"\\bonly (?:then )?(?:disclosed|released|produced|provided|identified|found|confirmed)\\b"},
 {k:"later",w:2,p:"\\bonly after\\b"},
 {k:"later",w:2,p:"\\b(?:disclosed|released|produced|provided)\\b[^.;]{0,40}\\bonce\\b|\\bfound once\\b"},
 {k:"later",w:2,p:"\\bwas followed\\b[^.;]{0,40}\\bby\\b"},
 {k:"later",w:2,p:"\\bwithin \\w+ (?:days|weeks) of (?:challenge|the challenge|follow-up)\\b"},
 {k:"challenge",w:2,p:"\\b(?:on|after) a (?:new|fresh|further) request\\b|\\bonce the request named\\b"},
 {k:"challenge",w:2,p:"\\b(?:on|after|of) (?:challenge|follow-up|internal review)\\b|\\bre-?asked\\b"},
 {k:"found",w:3,p:"\\bsearch(?:es)?\\b[^.;]{0,30}\\b(?:had )?(?:identified|found)\\b|\\bidentified during searches\\b"},
 {k:"found",w:3,p:"\\bfurther\\b[^.;]{0,40}\\b(?:documentation|records|information)\\b[^.;]{0,20}\\b(?:has|have) been found\\b"},
 {k:"found",w:2,p:"\\b(?:has|have|had) been found\\b|\\b(?:was|were) found\\b"},
 {k:"found",w:3,p:"\\bthe same\\b[^.;]{0,30}\\breply\\b[^.;]{0,80}\\b(?:recorded|admitted|named|held|confirmed)\\b"},
 {k:"found",w:2,p:"\\bbecame\\b[^.;]{0,40}\\b(?:specific|records|references)\\b"},
 {k:"nobasis",w:2,p:"\\bno recorded basis\\b|\\bdoes not hold a separate (?:search log|record)\\b|\\bno separate record\\b"},
 {k:"public",w:2,p:"\\bafter the request and before the reply\\b|\\brelied on its new public availability\\b|\\bpublished\\b[^.;]{0,40}\\bafter\\b"},
 {k:"pending",w:1,p:"\\bnot yet (?:requested or )?disclosed\\b|\\bno substantive disclosure\\b|\\bstill sifting\\b"},
 {k:"withheld",w:1,p:"\\bwithheld\\b"}]};
var CN_FIELDS=["conduct","positive_quote","negative_quote","interim_disclosure"], CN_RX=null, CN_CACHE={};
function cnRules(o){if(!o||typeof o!=="object")return;if(Array.isArray(o.rules)&&o.rules.length)CN.rules=o.rules;if(o.min_clause!=null)CN.min_clause=+o.min_clause;if(o.min_record!=null)CN.min_record=+o.min_record;if(o.overrides)CN.overrides=o.overrides;CN_RX=null;CN_CACHE={};}
function cnRx(){if(CN_RX)return CN_RX;CN_RX=[];CN.rules.forEach(function(r){try{CN_RX.push({k:r.k||r.kind,w:+(r.w||r.weight||1),x:new RegExp(r.p||r.pattern,"i")});}catch(e){}});return CN_RX;}
function clauses(t){var out=[],re=/[.;!?]+["\u201d\u2019)\]]?\s+/g,m,pos=0;while((m=re.exec(t))){var end=m.index+(/[.!?]/.test(t.charAt(m.index))?1:0);if(end>pos)out.push([pos,end]);pos=m.index+m[0].length;}if(t.length>pos)out.push([pos,t.length]);return out;}
function cnScan(r){var id=r.id;if(CN_CACHE[id])return CN_CACHE[id];var f=r.finding||{},hits=[],rx=cnRx();
 CN_FIELDS.forEach(function(fld){var t=f[fld]||"";if(!t||/^\[/.test(t))return;var cl=clauses(t),cut=!/[.!?"\u201d)\]]\s*$/.test(t);clauses(t).forEach(function(c,ci){if(cut&&ci===cl.length-1&&c[1]-c[0]<60)return;var s=t.slice(c[0],c[1]),sc=0,ks=[];
  rx.forEach(function(r){if(r.x.test(s)){sc+=r.w;if(ks.indexOf(r.k)<0)ks.push(r.k);}});
  if(sc>=CN.min_clause){var e=c[1];while(e>c[0]&&/[.;:,\s]/.test(t.charAt(e-1)))e--;var lv=sc>=6?3:sc>=3?2:1,h0={fld:fld,a:c[0],b:e,text:t.slice(c[0],e),score:sc,kinds:ks,lvl:lv};
   /* a long clause: light only the matched wording inside it, so the crescendo stays on the telling words */
   if(e-c[0]>170){var sp=[];rx.forEach(function(r){var m=r.x.exec(s);if(m&&m[0].length)sp.push([c[0]+m.index,c[0]+m.index+m[0].length]);});sp.sort(function(x,y){return x[0]-y[0];});
    var mg=[];sp.forEach(function(x){var l=mg[mg.length-1];if(l&&x[0]<=l[1]+1)l[1]=Math.max(l[1],x[1]);else mg.push(x.slice());});h0.parts=mg;}
   hits.push(h0);}});});
 var ov=(CN.overrides||{})[id]||{},own=f.chestnut,best=null;
 hits.forEach(function(h){if(!best||h.score>best.score)best=h;});
 var on=!!best&&best.score>=CN.min_record;if(own===false||ov.exclude)on=false;if(own===true||typeof own==="string"||ov.include||ov.headline)on=true;
 var head=(typeof own==="string"&&own)||ov.headline||(best?best.text:"")||"";if(best&&!ov.headline&&typeof own!=="string"&&best.fld==="conduct")head=head.charAt(0).toUpperCase()+head.slice(1);
 if(!head){var nq=f.negative_quote||f.positive_quote||r.title||"";var c0=clauses(nq)[0];head=c0?nq.slice(c0[0],c0[1]).replace(/[.;:,\s]+$/,""):nq;}
 var o={on:on,hits:hits,best:best,head:head,kinds:best?hits.reduce(function(a,h){h.kinds.forEach(function(k){if(a.indexOf(k)<0)a.push(k);});return a;},[]):[]};CN_CACHE[id]=o;return o;}
/* crescendo: wrap each detected clause of one field in <mark class="toc-cn lv-N">; the rest stays plain text */
function cnText(r,fld,text,wrapQuotes){var t=text==null?((r.finding||{})[fld]||""):text,hs=cnScan(r).hits.filter(function(h){return h.fld===fld;}).sort(function(a,b){return a.a-b.a;}),out=[],pos=0;
 if(wrapQuotes)out.push("\u201c");hs.forEach(function(h){if(h.a<pos)return;(h.parts||[[h.a,h.b]]).forEach(function(q,qi){if(q[0]<pos)return;if(q[0]>pos)out.push(t.slice(pos,q[0]));
  out.push($("mark",{cls:"toc-cn lv-"+h.lvl,title:CNL("chestnut")},[qi?null:$("span",{cls:"toc-cn-nut","aria-hidden":"true",text:"\uD83C\uDF30"}),t.slice(q[0],q[1])]));pos=q[1];});if(h.b>pos){out.push(t.slice(pos,h.b));pos=h.b;}});
 if(pos<t.length)out.push(t.slice(pos));if(wrapQuotes)out.push("\u201d");return out;}
var CNT={en:{list_h:"Old chestnuts",list_d:"Passages that raise the question of why a record was not disclosed sooner.",details:"details",close:"Close",chestnut:"Old chestnut",
  src:"Source",body:"Body",date:"Date",ref:"Reference",tl:"Timeline",t_first:"First reply (not held, refused or narrowed)",t_trig:"What reopened it",t_later:"Later disclosed or admitted",t_gap:"Gap",
  why:"Why it matters",extract:"The extract",ours:"Our reading of the record",verb:"Reply wording (verbatim)",none:"No old chestnut found in the current filter.",days:"days",weeks:"weeks",nodate:"date not in the record",
  sect:"Old chestnut details",card:"See the full card"},
 cy:{list_h:"Hen gnau castan",list_d:"Darnau sy\u2019n codi\u2019r cwestiwn pam na ddatgelwyd cofnod yn gynt.",details:"manylion",close:"Cau",chestnut:"Hen gneuen gastan",src:"Ffynhonnell",body:"Corff",date:"Dyddiad",ref:"Cyfeirnod",tl:"Llinell amser",
  t_first:"Ateb cyntaf (heb ei ddal, gwrthod neu gulhau)",t_trig:"Beth a\u2019i hailagorodd",t_later:"Datgelwyd neu cyfaddefwyd yn ddiweddarach",t_gap:"Bwlch",why:"Pam mae\u2019n bwysig",extract:"Y darn",ours:"Ein darlleniad o\u2019r cofnod",verb:"Geiriad yr ateb (air am air)",
  none:"Dim hen gneuen gastan yn yr hidl presennol.",days:"diwrnod",weeks:"wythnos",nodate:"dim dyddiad yn y cofnod",sect:"Manylion yr hen gnau castan",card:"Gweld y cerdyn llawn"},
 es:{list_h:"Las de siempre",list_d:"Pasajes que plantean por qu\u00e9 un registro no se divulg\u00f3 antes.",details:"detalles",close:"Cerrar",chestnut:"La de siempre",src:"Fuente",body:"Organismo",date:"Fecha",ref:"Referencia",tl:"Cronolog\u00eda",
  t_first:"Primera respuesta (no consta, denegada o acotada)",t_trig:"Qu\u00e9 la reabri\u00f3",t_later:"Divulgado o admitido despu\u00e9s",t_gap:"Intervalo",why:"Por qu\u00e9 importa",extract:"El extracto",ours:"Nuestra lectura del registro",verb:"Texto de la respuesta (literal)",
  none:"Ninguna en el filtro actual.",days:"d\u00edas",weeks:"semanas",nodate:"fecha no consta",sect:"Detalles",card:"Ver la ficha completa"}};
function CNL(k){return (CNT[LANG]&&CNT[LANG][k])||CNT.en[k]||k;}
var WHY={scope:"Records came up in the body\u2019s own searches but were set aside as outside the request. A request is read objectively and a body is expected to advise and assist (FOIA s.16; s.45 Code of Practice), so the open question is why they were not offered at the first reply.",
 later:"The material was in the body\u2019s hands at the first reply and reached the requester only later; the gap above is the time between the two replies.",
 challenge:"It came out after a fresh request, a follow-up or a challenge, not at the first reply.",
 found:"A \u201cnot held\u201d or \u201cnone\u201d answer was followed by records found, which points back to how far the first search went (FOIA s.1(1); EIR reg 5).",
 nobasis:"No written record was kept of why the records were left out of the first reply.",
 public:"The material was made public during the request, and the reply then pointed to it as already available.",
 pending:"Further material is known to exist but has not yet been released."};
function dParse(s){var m=/(\d{4})-(\d{2})-(\d{2})/.exec(s||"");return m?Date.UTC(+m[1],+m[2]-1,+m[3]):null;}
function cnGap(f){var a=dParse(f.negative_date),b=dParse(f.positive_date);if(a==null||b==null||b<a)return "";var d=Math.round((b-a)/864e5),w=d/7;return d+" "+CNL("days")+(d>=7?" ("+(Math.round(w*10)/10).toString().replace(/\.0$/,"")+" "+CNL("weeks")+")":"");}
function cnBody(r,headId){var f=r.finding||{},o=cnScan(r),pv=r.provenance||{},box=$("div",{cls:"toc-cn-body"});
 box.appendChild($("h3",{cls:"toc-cn-sub",text:CNL("extract")}));
 [["conduct","ours",false],["negative_quote","verb",true],["positive_quote","verb",true],["interim_disclosure","verb",true]].forEach(function(x){var t=f[x[0]];if(!t||/^\[/.test(t))return;
  var lab=x[0]==="conduct"?CNL("ours"):(x[0]==="negative_quote"?T("neg"):x[0]==="positive_quote"?T("pos"):CNL("verb"))+(x[2]?" \u00b7 "+CNL("verb"):"");
  box.appendChild($("p",{cls:"toc-cn-lab",text:lab}));
  box.appendChild(x[2]?$("blockquote",{cls:"toc-cn-q"+(x[0]==="positive_quote"&&isDisc(f)?" q-disc":"")},[$("p",null,cnText(r,x[0],null,true))]):$("p",{cls:"toc-cn-note"},cnText(r,x[0])));});
 box.appendChild($("h3",{cls:"toc-cn-sub",text:CNL("src")}));
 var dl=$("dl",{cls:"toc-cn-src"});function row(k,v){if(!v)return;dl.appendChild($("dt",{text:k}));dl.appendChild($("dd",{text:v}));}
 row(CNL("body"),f.institution||pv.holder);row(CNL("date"),f.positive_date||f.negative_date||get(r,"date.display"));row(CNL("ref"),[pv.reference||r.source_text,(r.evidence||[]).join(", ")].filter(Boolean).join(" \u00b7 "));box.appendChild(dl);
 box.appendChild($("h3",{cls:"toc-cn-sub",text:CNL("tl")}));var ol=$("ol",{cls:"toc-cn-tl"});
 function step(k,d,txt){ol.appendChild($("li",null,[$("b",{text:k}),$("span",{cls:"toc-cn-d",text:" "+(d||CNL("nodate"))}),txt?$("span",{cls:"toc-muted",text:" \u00b7 "+txt}):null]));}
 step(CNL("t_first"),f.negative_date,"");if(f.trigger)step(CNL("t_trig"),"",f.trigger);step(CNL("t_later"),f.positive_date,f.positive_nature||f.disclosure_type||"");
 var g=cnGap(f);if(g)ol.appendChild($("li",{cls:"toc-cn-gap"},[$("b",{text:CNL("t_gap")}),$("span",{text:" "+g})]));box.appendChild(ol);
 var why=o.kinds.map(function(k){return WHY[k];}).filter(Boolean);if(why.length){box.appendChild($("h3",{cls:"toc-cn-sub",text:CNL("why")}));why.slice(0,3).forEach(function(w){box.appendChild($("p",{cls:"toc-cn-why",text:w}));});}
 var ca=$("a",{href:here(r.id.toLowerCase()),text:CNL("card")+" \u203a"});ca.addEventListener("click",function(ev){goCard(ev,r.id.toLowerCase(),ca.closest("dialog"));});box.appendChild($("p",{cls:"toc-cn-card"},[ca]));return box;}
function here(id){return "#"+id;}   /* relative: the theme runtime prefixes root paths ("/online/…") with the theme path */
function goCard(ev,id,d){ev.preventDefault();if(d)try{d.close();}catch(e){}var el=document.getElementById(id);if(el){el.scrollIntoView({block:"start"});try{history.replaceState(null,"",here(id));}catch(e){}}}
var cnLast=null;
function openCn(r,opener){var o=cnScan(r),hid="cn-dlg-h";var old=document.querySelector("dialog.toc-cn-dlg");if(old){try{old.close();}catch(e){}old.remove();}
 if(!window.HTMLDialogElement||!document.createElement("dialog").showModal){location.hash="cn-"+r.id.toLowerCase();var dd=document.getElementById("cn-"+r.id.toLowerCase());if(dd)dd.open=true;return;}
 cnLast=opener||document.activeElement;var d=$("dialog",{cls:"toc-cn-dlg","aria-labelledby":hid,"aria-modal":"true"});
 var x=$("button",{type:"button",cls:"toc-cn-x","aria-label":CNL("close"),text:"\u00d7"});x.addEventListener("click",function(){d.close();});
 var inner=$("div",{cls:"toc-cn-in"},[x,$("p",{cls:"toc-cn-kick"},[$("span",{cls:"toc-cn-nut","aria-hidden":"true",text:"\uD83C\uDF30 "}),CNL("chestnut")+" \u00b7 "+(get(r,"finding.institution")||"")]),$("h2",{id:hid,cls:"toc-cn-title"},[$("mark",{cls:"toc-cn lv-"+(o.best?o.best.lvl:1),text:"\u201c"+o.head+"\u201d"})]),cnBody(r)]);
 d.appendChild(inner);d.addEventListener("click",function(ev){if(ev.target===d)d.close();});
 d.addEventListener("close",function(){d.remove();document.documentElement.classList.remove("toc-cn-lock");if(cnLast&&cnLast.focus)try{cnLast.focus();}catch(e){}});
 document.body.appendChild(d);document.documentElement.classList.add("toc-cn-lock");d.showModal();try{x.focus();}catch(e){}}
function cnRows(){return filtered().filter(function(r){return cnScan(r).on;}).sort(function(a,b){return (cnScan(b).best?cnScan(b).best.score:0)-(cnScan(a).best?cnScan(a).best.score:0);});}
C.ChestnutList=function(){if(!rows().length)return null;var R=cnRows();var s=$("section",{cls:"toc-cnl","aria-labelledby":"toc-cnl-h"},[$("h2",{id:"toc-cnl-h"},[$("span",{cls:"toc-cn-nut","aria-hidden":"true",text:"\uD83C\uDF30 "}),CNL("list_h")+" ",$("small",{cls:"toc-muted",text:"("+R.length+")"})]),$("p",{cls:"toc-muted",text:CNL("list_d")})]);
 var ul=$("ul",{cls:"toc-cnl-ul"});R.forEach(function(r){var o=cnScan(r),f=r.finding||{};var a=$("a",{cls:"toc-cn-more",href:here("cn-"+r.id.toLowerCase()),"aria-haspopup":"dialog",text:CNL("details")});
  a.addEventListener("click",function(ev){ev.preventDefault();openCn(r,a);});
  ul.appendChild($("li",{cls:"toc-cnl-li lv-"+(o.best?o.best.lvl:1),"data-id":r.id},[$("span",{cls:"toc-cnl-ico","aria-hidden":"true",text:"\uD83C\uDF30"}),$("div",{cls:"toc-cnl-t"},[$("q",{cls:"toc-cnl-q",text:o.head}),
   $("span",{cls:"toc-cnl-src",text:(f.institution||"")+" \u00b7 "+(f.positive_date||f.negative_date||"")+" "}),a])]));});
 if(!R.length)ul.appendChild($("li",{cls:"toc-muted",text:CNL("none")}));s.appendChild(ul);return s;};
/* no-JS-dialog fallback and anchor target: every chestnut's details also sit on the page, each in a closed <details id="cn-…"> */
C.ChestnutDetails=function(){var R=rows().filter(function(r){return cnScan(r).on;});if(!R.length)return null;var s=$("section",{cls:"toc-cnd","aria-labelledby":"toc-cnd-h"},[$("h2",{id:"toc-cnd-h",text:CNL("sect")})]);
 R.forEach(function(r){var o=cnScan(r);var d=$("details",{cls:"toc-cnd-i",id:"cn-"+r.id.toLowerCase()},[$("summary",null,[$("span",{cls:"toc-cn-nut","aria-hidden":"true",text:"\uD83C\uDF30 "}),"\u201c"+o.head+"\u201d"]),cnBody(r)]);s.appendChild(d);});return s;};
function cnHash(){var h=(location.hash||"").slice(1);if(!/^cn-/.test(h))return;var id=h.slice(3).toUpperCase();var r=rows().filter(function(x){return x.id===id;})[0];if(r)openCn(r,null);}


C.Header=function(){var h=app.querySelector(".toc-head")||$("header",{cls:"toc-head"});var p=DB.copy.parcel||{};
 var a=h.querySelector(".cw-parcel-link"); if(a){a.textContent=p.label||a.textContent;a.setAttribute("data-parcel-slot",p.slot||"");a.setAttribute("data-parcel-of",p.of||59);a.setAttribute("aria-haspopup","dialog");}
 h.querySelector("h1").textContent=T("h1"); h.querySelector(".toc-kicker").textContent=T("kicker"); return h;};
C.Text=function(n){return $("p",{cls:"toc-lede",text:T(n.props.text.replace("i18n:",""))});};
C.Status=function(){var R=rows(),A=get(DB,"copy.audit")||{},done=A.complete;
 if(!R.length)return $("section",{cls:"toc-empty",role:"status"},[$("span",{cls:"toc-pulse","aria-hidden":"true"}),$("p",{text:T("empty")})]);
 if(!done)return $("p",{cls:"toc-banner",role:"status",text:T("in_progress")});
 var cv=A.coverage||{},kids=[];
 if(cv.conversations_reviewed)kids.push($("span",{text:T("coverage").replace("{c}",fmt(cv.conversations_reviewed)).replace("{m}",fmt(cv.messages_reviewed||0)).replace("{r}",fmt(cv.received_messages_scanned||0))}));
 if(A.still_to_read)kids.push($("span",{text:" "+T("unread").replace("{n}",fmt(A.still_to_read))}));
 return kids.length?$("p",{cls:"toc-note",role:"status"},kids):null;};
function fmt(n){try{return Number(n).toLocaleString(LANG==="cy"?"cy-GB":LANG==="es"?"es-ES":"en-GB");}catch(e){return String(n);}}
C.Highlight=function(){var h=get(DB,"copy.audit.highlight");if(!h||!h.term)return null;
 var s=$("section",{cls:"toc-word","aria-labelledby":"toc-word-h"},[$("h2",{id:"toc-word-h",text:T("word_h")}),
  $("p",{cls:"toc-word-term"},[$("span",{cls:"toc-nut","aria-hidden":"true"}),$("b",{text:"“"+h.term+"”"}),$("span",{cls:"toc-muted",text:" · "+h.institution+" · "+h.date})]),
  h.quote?$("blockquote",{cls:"q-neg"},[$("p",{text:"“"+h.quote+"”"})]):null,
  $("p",{},[$("b",{text:T("statute")+": "}),document.createTextNode(h.statute)]),
  $("p",{cls:"toc-muted",text:T("not_cited")}),
  $("p",{},[$("a",{href:here(h.id.toLowerCase()),text:h.id})])]);return s;};
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
 R.forEach(function(r){var f=r.finding||{},k=classOf(r);var art=$("article",{cls:"toc-card c-"+k+(isDisc(f)?" is-disc":""),id:r.id.toLowerCase()},[
  $("p",{cls:"toc-badge",text:clsLabel(k)+(f.open?" · "+T("open"):"")}),$("h3",{text:f.institution||r.title}),
  $("p",{cls:"toc-date",text:T("neg")+": "+(f.negative_date||"—")+(f.positive_date?" · "+T("pos")+": "+f.positive_date:"")})]);
  if(f.negative_quote)art.appendChild($("blockquote",{cls:"q-neg"},[$("p",null,/^\[/.test(f.negative_quote)?[f.negative_quote]:cnText(r,"negative_quote",null,true))]));
  if(f.positive_quote){var dq=isDisc(f);art.appendChild($("blockquote",{cls:"q-pos"+(dq?" q-disc":"")},dq?[wow(),$("p",null,[$("mark",{cls:"toc-hl"},cnText(r,"positive_quote",null,true))])]:[$("p",null,cnText(r,"positive_quote",null,true))]));}
  if((f.terms||[]).length){var ul=$("ul",{cls:"toc-tl"});f.terms.forEach(function(t){ul.appendChild($("li",null,[$("b",{text:t.term}),$("span",{text:" → "+t.statute})]));});art.appendChild($("p",{cls:"toc-sub",text:T("terms_used")}));art.appendChild(ul);}
  if(f.conduct)art.appendChild($("p",{cls:"toc-conduct"},cnText(r,"conduct")));
  if(cnScan(r).on){var cm=$("a",{cls:"toc-cn-more",href:here("cn-"+r.id.toLowerCase()),"aria-haspopup":"dialog"},[$("span",{cls:"toc-cn-nut","aria-hidden":"true",text:"\uD83C\uDF30 "}),CNL("details")]);cm.addEventListener("click",function(ev){ev.preventDefault();openCn(r,cm);});art.appendChild($("p",{cls:"toc-cn-cardlink"},[cm]));art.classList.add("is-cn");}
  s.appendChild(art);});
 if(!R.length)s.appendChild($("p",{cls:"toc-muted",text:T("none")}));return s;};
C.Table=function(n){if(!rows().length)return null;var cols=DB.copy.columns||[],R=filtered();
 var tb=$("table",{cls:"toc-table"});var tr=$("tr");cols.forEach(function(c){tr.appendChild($("th",{scope:"col",text:c}));});tb.appendChild($("thead",null,[tr]));var bd=$("tbody");
 R.forEach(function(r){var f=r.finding||{};var cells=[f.institution||"",f.negative_date||"",elapsed(f),f.positive_nature||(f.open?T("open"):"—"),f.conduct||((f.terms||[]).map(function(t){return t.term;}).join(", "))];
  var row=$("tr");var dr=isDisc(f);cells.forEach(function(v,i){var td=$("td",{"data-label":cols[i]||""});if(i===3&&dr){td.className="td-disc";td.appendChild(wow());td.appendChild($("mark",{cls:"toc-hl",text:v}));}else if(i===4&&f.conduct){cnText(r,"conduct").forEach(function(n){td.appendChild(typeof n==="string"?document.createTextNode(n):n);});}else td.textContent=v;row.appendChild(td);});if(dr)row.className="is-disc";bd.appendChild(row);});tb.appendChild(bd);
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
 function addBlip(key,isNut,i,total){var g0=(i*0.6180339887+(isNut?0:0.31))%1,a=12+156*((i+0.5+(isNut?0:0.5*hash(key)))/Math.max(total,1))%168,r=rad*(.26+.66*g0),t=a*Math.PI/180;var x=cx-r*Math.cos(t),y=cy-r*Math.sin(t);
  var g=sv("g",{"class":"blip","transform":"translate("+x.toFixed(1)+" "+y.toFixed(1)+")"});var u=sv("use",{href:"#tocMail",x:"-8",y:"-6",width:"16",height:"12"});g.appendChild(u);
  var rec=isNut?R[i]:null,cx0=rec?cnScan(rec):null,xc=rec?(cx0.on?" rec cnb":" rec"):"";
  if(rec){g.insertBefore(sv("circle",{r:"12",fill:"transparent","class":"hit"}),u);g.setAttribute("class","blip"+xc);g.setAttribute("tabindex","0");g.setAttribute("role","button");g.setAttribute("aria-haspopup","dialog");g.setAttribute("data-id",rec.id);
   g.setAttribute("aria-label",CNL("details")+": \u201c"+cx0.head+"\u201d");
   g.addEventListener("click",function(){openCn(rec,g);});g.addEventListener("keydown",function(ev){if(ev.key==="Enter"||ev.key===" "){ev.preventDefault();openCn(rec,g);}});}
  var ti=sv("title",{});ti.textContent=rec?"\u201c"+cx0.head+"\u201d":(isNut?key:T("not_read"));g.appendChild(ti);s.appendChild(g);blips.push({a:a,g:g,u:u,nut:isNut,flipped:false,xc:xc});}
 R.forEach(function(r,i){addBlip(r.id,true,i,nRec);});for(var i=0;i<nUn;i++)addBlip("unread-"+i,false,i,nUn);
 var beam=sv("path",{fill:"url(#tocBeam)",opacity:".8","pointer-events":"none"}),arm=sv("line",{x1:cx,y1:cy,x2:cx-rad,y2:cy,stroke:"#3dffa8","stroke-width":"2","stroke-linecap":"round","pointer-events":"none"});
 s.appendChild(beam);s.appendChild(arm);s.appendChild(sv("circle",{cx:cx,cy:cy,r:"3.5",fill:"#3dffa8"}));
 function flip(b,on){if(b.flipped===on)return;b.flipped=on;if(on){b.u.setAttribute("href","#tocNut");b.u.setAttribute("x","-8");b.u.setAttribute("y","-8");b.u.setAttribute("height","16");b.g.setAttribute("class","blip nut pop"+(b.xc||""));}else{b.u.setAttribute("href","#tocMail");b.u.setAttribute("x","-8");b.u.setAttribute("y","-6");b.u.setAttribute("height","12");b.g.setAttribute("class","blip"+(b.xc||""));}}
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

function cnRoot(){var r=UI.root.slice(),has=function(c){return r.some(function(n){return n.component===c;});};
 if(!has("ChestnutList")){var i=-1;r.forEach(function(n,j){if(n.component==="Radar")i=j;});r.splice(i+1,0,{component:"ChestnutList",id:"toc-chestnuts",props:{}});}
 if(!has("ChestnutDetails")){var k=r.length;r.forEach(function(n,j){if(n.component==="Glossary"||n.component==="Footer")k=Math.min(k,j);});r.splice(k,0,{component:"ChestnutDetails",id:"toc-chestnut-details",props:{}});}return r;}
/* ---------- render ---------- */
function render(keep,focusId){if(radarStop&&!keep){radarStop();radarStop=null;}LANG=lang();document.body.classList.add("toc-ready");
 var keepRadar=keep&&app.querySelector(".toc-radar");var ld=app.querySelector(".toc-loading");if(ld)ld.remove();
 [].slice.call(app.children).forEach(function(ch){if(ch.classList.contains("toc-head")||ch.tagName==="NOSCRIPT")return;if(keepRadar&&ch===keepRadar)return;ch.remove();});
 cnRoot().forEach(function(n){if(n.component==="Header"){C.Header(n);return;}if(n.component==="Radar"&&keepRadar){app.appendChild(keepRadar);return;}var f=C[n.component];if(!f)return;var el=f(n);if(el){el.setAttribute("data-a2",n.id);app.appendChild(el);}});
 if(focusId){var fe=document.getElementById(focusId);if(fe){fe.focus();try{fe.setSelectionRange(fe.value.length,fe.value.length);}catch(e){}}}
 try{var u=new URLSearchParams();if(F.inst)u.set("institution",F.inst);if(F.cls)u.set("type",F.cls);if(F.trig)u.set("trigger",F.trig);if(F.q)u.set("q",F.q);var q=u.toString();if(q||location.search)history.replaceState(null,"",(q?"?"+q:"./")+location.hash);}catch(e){}}   /* v0.3.1: relative URL; a root path ("/online/…") was prefixed by the theme runtime into a 404 address */
function boot(){try{var p=new URLSearchParams(location.search);F.inst=p.get("institution")||"";F.cls=p.get("type")||"";F.trig=p.get("trigger")||"";F.q=p.get("q")||"";}catch(e){}
 var link=app.querySelector(".cw-parcel-link");if(link)link.addEventListener("click",openParcel);
 render(false);cnHash();window.addEventListener("hashchange",cnHash);
 new MutationObserver(function(){if(lang()!==LANG)render(false);}).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});}
function j(u){return fetch(u,{credentials:"same-origin"}).then(function(r){if(!r.ok)throw new Error(u+" "+r.status);return r.json();});}
Promise.all([j(app.getAttribute("data-ui")),j(app.getAttribute("data-db")),j(app.getAttribute("data-rules")||"_ui/chestnuts.rules.json").catch(function(){return null;})]).then(function(v){UI=v[0];DB=v[1];cnRules(v[2]);boot();}).catch(function(){var ld=app.querySelector(".toc-loading");if(ld)ld.textContent="Audit in progress. The data for this page could not be loaded just now; please try again shortly.";});
})();
