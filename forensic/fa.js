/* Forensic Assessments v1.0.0: filter + translation-pending note */
(function(){var q=document.getElementById('fa-q');if(q){q.addEventListener('input',function(){var v=q.value.toLowerCase();document.querySelectorAll('.fa-cards li').forEach(function(li){li.hidden=v&&li.textContent.toLowerCase().indexOf(v)<0;});});}
function note(l){var n=document.querySelector('.fa-tp');if(n)n.hidden=!(l==='cy'||l==='es');}
document.addEventListener('ghf-lang-change',function(e){note(e.detail&&e.detail.lang);});note(document.documentElement.getAttribute('lang'));})();
