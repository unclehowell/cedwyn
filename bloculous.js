/* Bloculous v0.1.0: honeycomb demo, resolution table, address builder, lightbox. No network calls. */
(function(){
var NS='http://www.w3.org/2000/svg',svg=document.getElementById('blo-grid');
if(svg){var R=20,W=Math.sqrt(3)*R,cols=9,rows=7,cells=[],layer=document.createElementNS(NS,'g');
 function pts(cx,cy){var p=[];for(var i=0;i<6;i++){var a=Math.PI/180*(60*i-30);p.push((cx+R*Math.cos(a)).toFixed(1)+','+(cy+R*Math.sin(a)).toFixed(1))}return p.join(' ')}
 for(var r=0;r<rows;r++)for(var c=0;c<cols;c++){var cx=W*c+(r%2?W/2:0)+W/2+8,cy=1.5*R*r+R+6,h=document.createElementNS(NS,'polygon');
  h.setAttribute('points',pts(cx,cy));h.setAttribute('class','hx');h.setAttribute('tabindex','0');h.setAttribute('role','button');h.setAttribute('aria-label','Hexagon '+(r*cols+c+1));
  var o={r:r,c:c,x:cx,y:cy,el:h};cells.push(o);svg.appendChild(h);
  (function(o){function go(){place(o)}o.el.addEventListener('click',go);o.el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}})})(o)}
 svg.appendChild(layer);
 function nbrs(o){var d=o.r%2?[[0,-1],[0,1],[-1,0],[-1,1],[1,0],[1,1]]:[[0,-1],[0,1],[-1,-1],[-1,0],[1,-1],[1,0]];
  return d.map(function(v){return cells.filter(function(x){return x.r===o.r+v[0]&&x.c===o.c+v[1]})[0]}).filter(Boolean)}
 var msg=document.getElementById('blo-grid-msg');
 function place(o){cells.forEach(function(x){x.el.classList.remove('on','nb')});while(layer.firstChild)layer.removeChild(layer.firstChild);
  o.el.classList.add('on');var n=nbrs(o);n.forEach(function(x){x.el.classList.add('nb');var l=document.createElementNS(NS,'line');l.setAttribute('x1',o.x);l.setAttribute('y1',o.y);l.setAttribute('x2',x.x);l.setAttribute('y2',x.y);layer.appendChild(l)});
  if(msg)msg.textContent='Dome placed. It found '+n.length+' neighbouring hexagons and linked to them. (Illustration.)'}
 place(cells[Math.floor(rows/2)*cols+Math.floor(cols/2)]);}
var RES={5:['252.903','8.544','2,016,842'],6:['36.129','3.229','14,117,882'],7:['5.161','1.221','98,825,162'],8:['0.737','0.461','691,776,122']};
[].forEach.call(document.querySelectorAll('.blo-tabs button'),function(b){b.addEventListener('click',function(){var v=RES[b.getAttribute('data-r')];
 [].forEach.call(document.querySelectorAll('.blo-tabs button'),function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});
 document.getElementById('r-area').textContent=v[0];document.getElementById('r-edge').textContent=v[1];document.getElementById('r-n').textContent=v[2]})});
function clean(s,d){s=(s||'').toLowerCase().replace(/[^a-z0-9-]/g,'').slice(0,24);return s||d}
var as=document.getElementById('a-s'),ac=document.getElementById('a-c');
function upd(){document.getElementById('o-s').textContent=clean(as.value,'service');document.getElementById('o-c').textContent=clean(ac.value,'category')}
if(as&&ac){as.addEventListener('input',upd);ac.addEventListener('input',upd)}
var lb=document.getElementById('blo-lb'),li=document.getElementById('blo-lb-img'),lc=document.getElementById('blo-lb-cap');
[].forEach.call(document.querySelectorAll('.blo-gal button'),function(b){b.addEventListener('click',function(){li.src=b.getAttribute('data-full');li.alt=b.getAttribute('data-cap');lc.textContent=b.getAttribute('data-cap');
 if(lb.showModal)lb.showModal();else lb.setAttribute('open','')})});
document.getElementById('blo-lb-x').addEventListener('click',function(){if(lb.close)lb.close();else lb.removeAttribute('open')});
lb.addEventListener('click',function(e){if(e.target===lb&&lb.close)lb.close()});
})();
