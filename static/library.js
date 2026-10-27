(function(){var b=document.body,m=document.querySelector('.menu'),s=b.getAttribute('data-page');
document.querySelectorAll('.nav a').forEach(function(a){if(a.getAttribute('data-s')===s)a.setAttribute('aria-current','page')});
if(m)m.addEventListener('click',function(){var o=b.classList.toggle('open');m.setAttribute('aria-expanded',o)});
var q=document.getElementById('q'),R=document.getElementById('results'),D=document.getElementById('doc');
function e(t){return t.replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function run(){var v=(q.value||'').trim().toLowerCase();if(v.length<2||!window.LIB_INDEX){R.hidden=true;D.hidden=false;return}
var w=v.split(/\s+/),out=[];LIB_INDEX.forEach(function(p){var hay=(p.t+' '+p.s+' '+p.x).toLowerCase(),sc=0;
for(var i=0;i<w.length;i++){var k=hay.indexOf(w[i]);if(k<0){sc=-1;break}sc+=(p.t.toLowerCase().indexOf(w[i])>=0?5:1)}
if(sc>0){var k=p.x.toLowerCase().indexOf(w[0]),sn=p.x.substring(Math.max(0,k-70),k+150);
var re=new RegExp('('+w.map(function(x){return x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}).join('|')+')','gi');
var hd=p.h.filter(function(h){return h[1].toLowerCase().indexOf(w[0])>=0})[0];out.push({sc:sc,p:p,sn:e(sn).replace(re,'<mark>$1</mark>'),hd:hd})}});
out.sort(function(a,b){return b.sc-a.sc});
R.innerHTML='<h2>'+out.length+' result'+(out.length==1?'':'s')+'</h2>'+out.map(function(o){return '<div class="hit"><a href="'+o.p.u+(o.hd?'#'+o.hd[0]:'')+'">'+e(o.p.t)+(o.hd?' › '+e(o.hd[1]):'')+'</a><p>…'+o.sn+'…</p></div>'}).join('');
R.hidden=false;D.hidden=true}
if(q){q.addEventListener('input',run);var u=new URLSearchParams(location.search).get('q');if(u){q.value=u;addEventListener('load',run)}}
var f=document.getElementById('secq');if(f)f.addEventListener('input',function(){var v=f.value.toLowerCase();
document.querySelectorAll('#sectable tbody tr').forEach(function(r){r.hidden=v&&r.getAttribute('data-k').indexOf(v)<0})})})();
