(function(){var q=document.getElementById("kf-q"),s=document.getElementById("kf-s"),o=document.getElementById("kf-o"),n=document.getElementById("kf-n"),rows=[].slice.call(document.querySelectorAll("#kf-b > [data-st]"));
function norm(t){return (t||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");}
rows.forEach(function(r){r._t=norm(r.textContent);});
function run(){var qv=norm(q.value).trim().split(/\s+/).filter(Boolean),sv=s.value,ov=o.value,k=0;rows.forEach(function(r){var ok=(!sv||r.getAttribute("data-st")===sv)&&(!ov||r.getAttribute("data-or")===ov)&&qv.every(function(w){return r._t.indexOf(w)>=0;});r.hidden=!ok;if(ok)k++;});n.textContent=k+" of "+rows.length+" shown";
try{var u=new URLSearchParams();if(q.value)u.set("q",q.value);if(sv)u.set("status",sv);if(ov)u.set("from",ov);history.replaceState(null,"",u.toString()?"?"+u:location.pathname);}catch(e){}}
try{var p=new URLSearchParams(location.search);if(p.get("q"))q.value=p.get("q");if(p.get("status"))s.value=p.get("status");if(p.get("from"))o.value=p.get("from");}catch(e){}
q.addEventListener("input",run);s.addEventListener("change",run);o.addEventListener("change",run);run();})();