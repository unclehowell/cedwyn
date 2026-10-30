/* watchtower.bucklerfamily.estate v3 — institution page changes about Great House Farm, from the Internet Archive — Cedwyn editors */
/* 29 Oct 2026 (v3.1.1): restores the brackets a 27 Oct text sweep removed (the graph had stopped drawing), and merges the institution
   watch (data/watch-events.json: releases, first-archived records, absence checks, detected changes) into the same scatter;
   the absence watch table reads data/watch-status.json. Both files are machine-readable for agents (see /llms.txt). */
(function(){
var D=null,sel=document.getElementById('inst'),chart=document.getElementById('chart'),dlg=document.getElementById('dlg'),body=document.getElementById('dbody');
var COL={appeared:'#f2c94c',added:'#30a46c',removed:'#e5484d',altered:'#3e7bfa',gone:'#e5484d',released:'#c084fc',absent:'#9aa0a6',present:'#9aa0a6',archived:'#f2c94c'};
var LAB={appeared:'Page appeared',added:'Text added',removed:'Text removed',altered:'Text changed',gone:'Page gone',released:'Record released',absent:'Checked: not in index',present:'Checked: in index',archived:'First archived'};
var NS='http://www.w3.org/2000/svg';
function el(n,a,p){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function dt(s){return new Date(s.slice(0,10)+'T12:00:00Z')}
var MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function fmt(s){if(!s)return'';var d=dt(s);return d.getUTCDate()+' '+MON[d.getUTCMonth()]+' '+d.getUTCFullYear()}
/* year-weighted time scale: years with changes get more width, empty years stay visible */
function scale(from,to,counts,x0,x1){
  var y0=+from.slice(0,4),y1=+to.slice(0,4),segs=[],tot=0;
  for(var y=y0;y<=y1;y++){var n=counts[y]||0,w=n?2+Math.log(1+n)/Math.LN2:0.6;segs.push({y:y,w:w});tot+=w}
  var acc=x0;segs.forEach(function(s){s.a=acc;s.b=acc+s.w/tot*(x1-x0);acc=s.b});
  function X(s){var d=dt(s),y=d.getUTCFullYear(),g=null;for(var i=0;i<segs.length;i++)if(segs[i].y===y){g=segs[i];break}
    if(!g)return y<y0?x0:x1;var st=Date.UTC(y,0,1),en=Date.UTC(y+1,0,1);return g.a+Math.min(1,(d-st)/(en-st))*(g.b-g.a)}
  X.segs=segs;return X}
function draw(){
  var f=sel.value,pts=D.changes.filter(function(c){return !f||c.inst===f});
  var cnt={};pts.forEach(function(c){cnt[c.inst]=(cnt[c.inst]||0)+1});
  var rows=D.institutions.filter(function(i){return cnt[i.id]}).map(function(i){return{id:i.id,label:i.short,title:i.name}});
  var W=Math.max(320,chart.clientWidth||360),narrow=W<560,LW=narrow?92:170,R=narrow?26:28,top=6,bot=26;
  var H=top+bot+Math.max(1,rows.length)*R;chart.innerHTML='';
  var svg=el('svg',{viewBox:'0 0 '+W+' '+H,width:W,height:H,role:'img','aria-label':'Scatter graph of page changes by date and institution'},chart);
  var yc={};D.changes.forEach(function(c){var y=c.date.slice(0,4);yc[y]=(yc[y]||0)+1});
  var X=scale(D.window.from,D.window.to,yc,LW+8,W-10);
  X.segs.forEach(function(s){el('line',{x1:s.a,x2:s.a,y1:top,y2:H-bot,'class':'grid'},svg);var wd=s.b-s.a;var t=el('text',{x:(s.a+s.b)/2,y:H-bot+15,'text-anchor':'middle','class':'tick'},svg);t.textContent=wd>30?String(s.y):(wd>15?"'"+String(s.y).slice(2):'')});
  rows.forEach(function(r,i){var y=top+i*R+R/2;
    el('line',{x1:LW,x2:W-6,y1:y,y2:y,'class':'row'},svg);
    var t=el('text',{x:LW-6,y:y+4,'text-anchor':'end','class':'lbl'},svg);var mx=narrow?14:24;t.textContent=r.label.length>mx?r.label.slice(0,mx-1)+'…':r.label;el('title',{},t).textContent=r.title;
    var mine=pts.filter(function(c){return c.inst===r.id}).sort(function(a,b){return a.date<b.date?-1:1}),lastx=-99,lane=0;
    mine.forEach(function(c){var cx=X(c.date);if(cx-lastx<7)lane++;else lane=0;lastx=cx;var cy=y+[0,-6,6,-9,9][lane%5];
      var g=el('g',{tabindex:0,role:'button','aria-label':LAB[c.type]+', '+fmt(c.date)},svg);
      if(c.type==='gone'||c.type==='absent')el('circle',{cx:cx,cy:cy,r:4.5,fill:'none',stroke:COL[c.type],'stroke-width':2,'class':'dot'},g);
      else if(c.type==='present')el('circle',{cx:cx,cy:cy,r:3.5,fill:COL.present,'class':'dot'},g);
      else if(c.type==='released'){el('circle',{cx:cx,cy:cy,r:7,fill:'none',stroke:COL.released,'stroke-width':2.5,'class':'dot'},g);el('circle',{cx:cx,cy:cy,r:3,fill:COL.released},g);}
      else el('circle',{cx:cx,cy:cy,r:5.5,fill:COL[c.type],'class':'dot'},g);
      el('circle',{cx:cx,cy:cy,r:12,'class':'hit'},g);
      g.addEventListener('click',function(){open(c)});g.addEventListener('keydown',function(ev){if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();open(c)}});
    });
  });
  [].forEach.call(document.querySelectorAll('ol.list li'),function(li){li.hidden=!!f&&li.getAttribute('data-inst')!==f});
}
function open(c){
  var p=D.pmap[c.page]||{},i=D.imap[c.inst]||{};
  var h='<h3>'+esc(p.title||p.url)+'</h3><p class="url">'+esc(i.name)+' · <a href="'+esc(p.url)+'" rel="noopener" target="_blank">'+esc(p.url)+'</a></p>';
  h+='<p><span class="tag '+c.type+'">'+LAB[c.type]+'</span> '+(c.d1?fmt(c.d1)+' → ':'')+fmt(c.date)+'</p><p class="what">'+esc(c.summary)+'</p>';
  (c.rem||[]).forEach(function(t){h+='<span class="q rem">− '+esc(t)+'</span>'});
  (c.add||[]).forEach(function(t){h+='<span class="q add">+ '+esc(t)+'</span>'});
  h+='<p class="url">Archive captures of this page: '+(p.captures||0)+' ('+fmt(p.first)+' to '+fmt(p.last)+')</p>';
  if(c.hits&&c.hits.length){h+='<p class="url">Matching entries:</p>';c.hits.forEach(function(t){h+='<span class="q add">'+esc(t)+'</span>'});}
  if(c.source)h+='<p class="url">Read from: '+esc(c.source)+'</p>';
  if(c.after_url||c.before_url)h+='<div class="ba">'+(c.before_url?'<a href="'+esc(c.before_url)+'" rel="noopener" target="_blank">Before · '+fmt(c.d1)+'</a>':'')+(c.after_url?'<a href="'+esc(c.after_url)+'" rel="noopener" target="_blank">'+(c.type==='gone'?'Gone · ':'After · ')+fmt(c.date)+'</a>':'')+'</div>';
  body.innerHTML=h;history.replaceState(null,'','#c='+c.id);
  if(dlg.showModal)dlg.showModal();else dlg.setAttribute('open','');
}
dlg.addEventListener('close',function(){history.replaceState(null,'',location.pathname)});
dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close()});
function merge(d,w){if(!w||!w.events)return d;var have={};d.institutions.forEach(function(i){have[i.id]=i});
  (w.institutions||[]).forEach(function(i){if(!have[i.id]){have[i.id]={id:i.id,name:i.name,short:i.short,n_pages:0,n_changes:0};d.institutions.push(have[i.id])}});
  w.events.forEach(function(e){if(!have[e.inst])return;var pid='w'+e.id;d.pages.push({id:pid,url:e.page_url||'',inst:e.inst,title:e.title,captures:0,first:e.date,last:e.date});
   d.changes.push({id:e.id,date:e.date,d1:e.d1||null,type:e.type,inst:e.inst,page:pid,summary:e.summary,add:e.add||[],rem:e.rem||[],hits:e.hits||[],source:e.source||'',before_url:e.before_url||null,after_url:e.after_url||e.page_url||null});
   have[e.inst].n_changes++;if(e.date<d.window.from)d.window.from=e.date;if(e.date>d.window.to)d.window.to=e.date});
  d.institutions.sort(function(a,b){return b.n_changes-a.n_changes||a.name.localeCompare(b.name)});
  var p=document.querySelector('p.lh');if(p){p.setAttribute('data-cw-noclamp','');p.classList.add('cw-noclamp');}if(p)p.textContent=d.changes.length+' points · '+d.institutions.filter(function(i){return i.n_changes}).length+' institutions · since '+fmt(d.window.from)+'';
  var k=document.querySelector('ul.key'),seen={};d.changes.forEach(function(c){seen[c.type]=1});
  if(k)[['released','d released'],['archived','d archived'],['absent','d absent'],['present','d present']].forEach(function(x){if(seen[x[0]]){var li=document.createElement('li');li.innerHTML='<i class="'+x[1]+'"></i>'+LAB[x[0]];k.appendChild(li)}});
  return d}
function absence(s){if(!s||!s.targets)return;var box=document.createElement('section');box.id='absence';box.className='abs cw-noclamp';box.setAttribute('data-cw-noclamp','');
  var h='<h2>Absence watch</h2><p class="what">Indexes and catalogues where a record would appear if it were made public. Each check is dated, so a later appearance is timestamped. Last run '+esc(fmt(s.generated))+'.</p><ul class="abs-l">';
  s.targets.forEach(function(t){h+='<li><span class="tag '+(t.status==='present'?'appeared':(t.status==='absent'?'gone':''))+'">'+esc(t.status==='present'?'In index':(t.status==='absent'?'Not in index':'Not checked'))+'</span> <a href="'+esc(t.page_url)+'" rel="noopener">'+esc(t.label)+'</a> <span class="url">'+esc((D.imap[t.inst]||{}).short||t.inst)+(t.first_checked?' · watched since '+esc(fmt(t.first_checked)):'')+(t.checked?' · checked '+esc(fmt(t.checked)):'')+'</span></li>'});
  box.innerHTML=h+'</ul>';var k=document.querySelector('ul.key');(k&&k.parentNode?k.parentNode:document.getElementById('app')).insertBefore(box,document.querySelector('ol.list'))}
Promise.all([fetch('data/changes.json?n='+Date.now()).then(function(r){return r.json()}),
  fetch('data/watch-events.json?n='+Date.now()).then(function(r){return r.ok?r.json():null}).catch(function(){return null}),
  fetch('data/watch-status.json?n='+Date.now()).then(function(r){return r.ok?r.json():null}).catch(function(){return null})]).then(function(rs){var d=merge(rs[0],rs[1]);
  D=d;D.pmap={};D.pages.forEach(function(p){D.pmap[p.id]=p});D.imap={};D.institutions.forEach(function(i){D.imap[i.id]=i});
  D.institutions.forEach(function(i){var o=document.createElement('option');o.value=i.id;o.textContent=i.name+' ('+i.n_changes+')';sel.appendChild(o)});
  sel.addEventListener('change',draw);var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(draw,150)});
  draw();absence(rs[2]);var m=/^#c=(\w+)/.exec(location.hash);if(m){var c=D.changes.filter(function(x){return x.id===m[1]})[0];if(c)open(c)}
}).catch(function(){chart.textContent=''});
})();
