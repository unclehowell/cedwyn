/* Watchtower 3.1.0: outside pages that cite the name variants, each saved to the Internet Archive (Wayback Machine).
   data/targets.json = the list (first save from the box, 2 Nov 2026); /watchtower/api/wayback.json = the weekly re-save status
   written by the Cloudflare Worker bfe-watchtower-archive. The newer of the two captures is shown. */
(function(){
var box=document.getElementById('wayback-body'); if(!box) return;
function e(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function ts2iso(t){return t?t.slice(0,4)+'-'+t.slice(4,6)+'-'+t.slice(6,8)+'T'+t.slice(8,10)+':'+t.slice(10,12)+':'+t.slice(12,14)+'Z':null;}
function d(s){if(!s)return '—';try{return new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',day:'numeric',month:'short',year:'numeric'}).format(new Date(s));}catch(x){return e(String(s).slice(0,10));}}
var css=document.createElement('style');css.textContent='#wayback-body .wbr{margin:6px 0;padding:6px 0 6px 8px;border-left:2px solid rgba(128,128,128,.25);overflow-wrap:anywhere}#wayback-body small{opacity:.75}#wayback-body .ok{color:#4fc27a}#wayback-body .no{color:#e0a030}#wayback-body .tg{display:inline-block;margin:2px 4px 0 0;padding:0 6px;border-radius:9px;font-size:12px;background:rgba(128,128,128,.16)}#wayback-body .amb{background:rgba(224,160,48,.18)}';document.head.appendChild(css);
function wkey(){var n=new Date(),t=new Date(Date.UTC(n.getUTCFullYear(),n.getUTCMonth(),n.getUTCDate())),dy=t.getUTCDay()||7;t.setUTCDate(t.getUTCDate()+4-dy);var y0=new Date(Date.UTC(t.getUTCFullYear(),0,1));return t.getUTCFullYear()+'-W'+String(Math.ceil(((t-y0)/864e5+1)/7)).padStart(2,'0');}
function row(p,L){
 var w=p.wb||{},k=(L.pages||{})[p.u]||{},best=null;
 if(w.ts)best={ts:w.ts};if(k.ts&&(!best||k.ts>best.ts))best={ts:k.ts};
 var cap=best?'<a href="https://web.archive.org/web/'+e(best.ts)+'/'+e(p.u)+'" rel="noopener">Wayback capture, '+d(ts2iso(best.ts))+'</a>':'<span class="no">not yet in the Wayback Machine</span>';
 var wk=k.week?(k.ts&&k.week===wkey()?'<span class="ok">saved this week</span>':k.week===wkey()?'<span class="no">tried this week ('+e(k.code)+')</span>':'last weekly save '+d(k.ok_at||k.last_try)):'weekly save from Sunday';
 return '<div class="wbr"><a href="'+e(p.u)+'" rel="noopener">'+e(p.title||p.u)+'</a><br><small>'+e(p.host||'')+' · first seen '+d(p.first_seen)+'</small><br>'+
  (p.terms||[]).map(function(t){return '<span class="tg">'+e(t)+'</span>';}).join('')+(p.ambiguous?'<span class="tg amb">possibly the other Llandough</span>':'')+
  '<br><small>'+cap+' · '+wk+'</small></div>';
}
Promise.all([fetch('data/targets.json?v='+Date.now()).then(function(r){return r.json();}),
 fetch('/watchtower/api/wayback.json?v='+Date.now()).then(function(r){return r.ok?r.json():{};}).catch(function(){return {};})]).then(function(a){
 var T=a[0],L=a[1]||{},ps=T.targets||[],H={};
 var saved=ps.filter(function(p){var k=(L.pages||{})[p.u]||{};return (p.wb&&p.wb.ts)||k.ts;}).length;
 var wp=L.week_progress,h='<p><small>'+e(T.about)+' Weekly re-save: '+e(T.weekly.schedule)+'.'+(wp?' This week: '+wp.done+' of '+wp.of+(wp.finished?' done.':' so far.'):'')+(L.updated?' Status updated '+d(L.updated)+'.':'')+'</small></p>';
 h+='<p>'+ps.length+' pages · '+saved+' in the Wayback Machine · '+(T.counts&&T.counts.new_2026_11_02||0)+' added on 2 Nov 2026</p>';
 ps.forEach(function(p){(H[p.host]=H[p.host]||[]).push(p);});
 h+=Object.keys(H).sort(function(x,y){return H[y].length-H[x].length||x.localeCompare(y);}).map(function(host){
  return '<details><summary>'+e(host)+' ('+H[host].length+')</summary>'+H[host].map(function(p){return row(p,L);}).join('')+'</details>';}).join('');
 var own=T.own||[];
 h+='<details><summary>This page itself in the Wayback Machine ('+own.length+' files)</summary>'+own.map(function(p){var k=(L.pages||{})[p.u]||{},ts=(p.wb&&p.wb.ts)||'';if(k.ts&&k.ts>ts)ts=k.ts;
  return '<div class="wbr"><small>'+e(p.u.replace(/^https:\/\//,''))+' · '+(ts?'<a href="https://web.archive.org/web/'+e(ts)+'/'+e(p.u)+'" rel="noopener">capture '+d(ts2iso(ts))+'</a>':'<span class="no">not yet saved</span>')+'</small></div>';}).join('')+'</details>';
 box.innerHTML=h;
 var s=document.getElementById('wayback-n');if(s)s.textContent=' ('+ps.length+')';
}).catch(function(){box.innerHTML='<p><small>The list could not be loaded just now.</small></p>';});
})();
