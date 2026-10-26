#!/usr/bin/env python3
"""halves.py - Cedwyn in two halves (Sion, 23:39 GMT 25 Oct 2026, m:2a7c8c27). - Sion's Tab agent
- /            two tiles that fit the first screen (390x844 and desktop): "Cedwyn Estate, Wales" (the AR-headset tour image) and
               "Cedwyn Estate II, Patagonia" (the house regenerated as new). Opens in English unless the visitor picked a language on
               this page this visit; the Wales tile opens Welsh (?lang=cy), the Patagonia tile Spanish (?lang=es). One language
               selector: the header's, top right.
- /wales/      the augmented-reality guided tour of Cedwyn Estate, Wales: eight stops (map, AR view, narration, records with EV links,
               prev/next, read-aloud). Tŷ Mawr is the former manorial house (never "farm" on this half). No museum stop. Tickets are
               not on sale: gift-voucher pre-order (/wales/tour/#vouchers, the existing Stripe voucher flow). Menu: every theme, grouped
               Past / Present (data/halves.json "groups"; a new theme falls into "default"); the museum themes are left out on Wales.
- /argentina/  Cedwyn Estate II / Great House II, Patagonia: the retreat (house, rooms, stables, barn, cottage, weddings, museum with
               wax Marconi and "Peerless" Jim), a BookMyTravel-style package builder (stay + flights + hire car -> summary ->
               pre-order request through the site's existing Mailchimp notify path; indicative prices; nothing charged), the family's
               case (tools/family_case.py, when present) and every theme grouped Past / Present.
Copy: data/halves.json (en/cy/es; Welsh and Spanish are first drafts). Images: web/_cedwyn/halves/img/ (AI renders marked
"artist's impression"). Runs at the end of site.py, after sections.run(); it replaces the three pages sections.py wrote and nothing else."""
import json, html, re, pathlib, math
ROOT = pathlib.Path(__file__).resolve().parent.parent
E = html.escape
VERSION = '1.0.1'

def tx(T, k, l):
    v = T.get(k) or {}
    return v.get(l) or v.get('en') or ''

def sp(T, k, l, tag='span', cls='', extra=''):
    c = f' class="{cls}"' if cls else ''
    return f'<{tag} data-i18n="{E(k)}"{c}{extra}>{E(tx(T, k, l))}</{tag}>'

def lt(T, d, l, key, tag='span', cls=''):
    """an inline {en,cy,es} object registered under key"""
    T[key] = d
    return sp(T, key, l, tag, cls)

CSS = r"""
.hv{--hv-a:#00843D;--hv-b:#C8102E}
.hv-tag{position:absolute;right:8px;bottom:8px;z-index:3;padding:3px 8px;border-radius:999px;background:rgba(0,0,0,.62);color:#fff;font:600 10.5px/1.3 Barlow,system-ui,sans-serif;letter-spacing:.06em}
.hv img{max-width:100%;height:auto;display:block}
/* landing */
body[data-cedwyn-page=landing] .wrap{padding-top:6px;padding-bottom:6px}
.hv-land{display:flex;flex-direction:column;gap:8px;height:calc(100svh - var(--hv-top,96px));min-height:420px}
.hv-land .eyebrow{margin:0}
.hv-tiles{flex:1 1 auto;display:grid;grid-template-rows:1fr 1fr;gap:8px;min-height:0}
@media (min-width:783px){.hv-tiles{grid-template-rows:none;grid-template-columns:1fr 1fr;gap:16px}.hv-land{gap:12px}}
.hv-tile{position:relative;display:flex;flex-direction:column;justify-content:flex-end;min-height:0;border-radius:14px;overflow:hidden;text-decoration:none;color:#fff;isolation:isolate;box-shadow:0 8px 24px rgba(0,0,0,.35);background:#111}
.hv-tile img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}
.hv-tile .tb{position:relative;z-index:2;padding:12px 14px 14px;background:linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.7) 38%,rgba(0,0,0,.86))}
.hv-tile .tn{display:block;font:400 clamp(22px,6.4vw,40px)/1.08 Barlow,system-ui,sans-serif;letter-spacing:.04em}
.hv-tile .ts{display:block;font:500 14px/1.35 Barlow,system-ui,sans-serif;opacity:.92;margin-top:4px}
.hv-tile .tc{display:inline-flex;align-items:center;margin-top:8px;padding:8px 14px;border:1px solid rgba(255,255,255,.85);border-radius:999px;font:600 12px/1 Barlow,system-ui,sans-serif;letter-spacing:.1em;text-transform:uppercase}
.hv-tile:hover .tc,.hv-tile:focus-visible .tc{background:#fff;color:#000}
.hv-tile .stripe{position:absolute;left:0;right:0;top:0;height:8px;z-index:2}
.hv-w .stripe{background:linear-gradient(90deg,#fff 0 50%,#00843D 50%)}.hv-a .stripe{background:linear-gradient(180deg,#74ACDF 0 33%,#fff 33% 66%,#74ACDF 66%)}
.hv-tile .hv-tag{top:14px;bottom:auto}
.hv-foot{display:flex;justify-content:center;gap:14px;font-size:12px;color:var(--mut)}.hv-foot a{color:var(--mut)}
/* hub common */
.hv-hero{position:relative;border-radius:14px;overflow:hidden;margin:4px 0 14px;color:#fff;background:#111}
.hv-hero img{width:100%;aspect-ratio:16/9;object-fit:cover}
.hv-hero .hb{position:absolute;left:0;right:0;bottom:0;padding:14px;background:linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.8) 45%)}
.hv-hero h1{font-size:clamp(28px,7.5vw,54px)}
.hv-hero .hv-tag{top:8px;bottom:auto}
.hv-btns{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 4px}
.hv-btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 16px;border-radius:999px;border:1px solid var(--line);color:var(--fg);background:var(--card);text-decoration:none;font:600 13px/1.1 Barlow,system-ui,sans-serif;letter-spacing:.06em;cursor:pointer}
.hv-btn.pri{background:var(--hv-a);border-color:var(--hv-a);color:#fff}
.hv-btn[disabled]{opacity:.45;cursor:default}
.hv sec,.hv section{margin:22px 0}
.hv h2{margin-top:6px}
/* menu (Past / Present) */
.hv-menu{border:1px solid var(--line);border-radius:12px;background:var(--card);padding:6px 12px}
.hv-menu>summary{cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;min-height:44px;font:600 15px/1.2 Barlow,system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase}
.hv-menu>summary::-webkit-details-marker{display:none}.hv-menu>summary:after{content:"\25BE";opacity:.7}
.hv-cols{display:grid;gap:12px;padding:6px 0 10px}@media (min-width:783px){.hv-cols{grid-template-columns:1fr 1fr}}
.hv-cols h3{margin:6px 0 2px;color:var(--hv-b);letter-spacing:.12em;text-transform:uppercase;font-size:14px}
.hv-cols p{margin:0 0 6px;font-size:13px}
.hv-cols ul{list-style:none;margin:0;padding:0;columns:1}.hv-cols li a{display:block;padding:8px 2px;border-bottom:1px solid var(--line);text-decoration:none}
.hv-cols li a:hover{color:var(--hv-b)}
/* tour */
.hv-map{width:100%;height:auto;display:block;border-radius:12px;background:var(--card);border:1px solid var(--line)}
.hv-map .rt{fill:none;stroke:var(--hv-b);stroke-width:2.4;stroke-dasharray:5 5}
.hv-map .sea{fill:rgba(78,140,200,.18)}
.hv-map .dot{cursor:pointer}.hv-map .dot circle{fill:var(--hv-a);stroke:#fff;stroke-width:2}.hv-map .dot.on circle{fill:var(--hv-b)}
.hv-map .dot text{fill:#fff;font:700 11px/1 Barlow,system-ui,sans-serif;text-anchor:middle;dominant-baseline:central;pointer-events:none}
.hv-map .lb{fill:var(--fg);font:500 10.5px Barlow,system-ui,sans-serif}
.hv-map .sl{fill:var(--mut);font:italic 11px Barlow,system-ui,sans-serif}
.hv-stop{display:none}.hv-stop.on{display:block}
.hv-ar{position:relative;border-radius:12px;overflow:hidden;background:#000}
.hv-ar img{width:100%;aspect-ratio:3/2;object-fit:cover}
.hv-ar:before,.hv-ar:after{content:"";position:absolute;z-index:2;width:28px;height:28px;border:2px solid rgba(120,230,255,.9)}
.hv-ar:before{left:10px;top:10px;border-right:0;border-bottom:0}.hv-ar:after{right:10px;top:10px;border-left:0;border-bottom:0}
.hv-ar .scan{position:absolute;left:0;right:0;height:2px;top:0;z-index:2;background:linear-gradient(90deg,transparent,rgba(120,230,255,.8),transparent);animation:hvscan 4.5s linear infinite}
@keyframes hvscan{0%{top:0}100%{top:100%}}@media (prefers-reduced-motion:reduce){.hv-ar .scan{display:none}}
.hv-ar .chip{position:absolute;left:10px;bottom:10px;z-index:3;padding:4px 9px;border-radius:6px;background:rgba(0,30,40,.72);color:#bff3ff;font:600 11px/1.3 Barlow,system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase}
.hv-sn{display:flex;align-items:baseline;gap:8px;margin:12px 0 2px;color:var(--mut);font:600 12px/1.2 Barlow,system-ui,sans-serif;letter-spacing:.16em;text-transform:uppercase}
.hv-stop h3{font-size:22px;margin:0}
.hv-stop .pl{color:var(--mut);margin:0 0 8px}
.hv-stop .chap{font-size:17px;border-left:3px solid var(--hv-a);padding-left:10px}
.hv-stop h4{margin:12px 0 4px;font:600 13px/1.3 Barlow,system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--hv-b)}
.hv-stop ul.rec{margin:0;padding-left:18px}.hv-stop ul.rec li{margin:6px 0}
.hv-ev a{display:inline-block;margin:2px 4px 0 0;padding:0 6px;border:1px solid var(--line);border-radius:4px;font:600 11.5px/1.6 Barlow,system-ui,sans-serif;text-decoration:none}
.hv-nav{position:sticky;bottom:0;z-index:5;display:flex;gap:8px;justify-content:space-between;align-items:center;padding:8px 0;background:var(--bg)}
.hv-tl{list-style:none;margin:6px 0;padding:0}.hv-tl li{display:grid;grid-template-columns:62px 1fr;gap:8px;padding:7px 0;border-bottom:1px solid var(--line)}
.hv-tl b{color:var(--hv-b)}
.hv-note{border:1px dashed var(--line);border-radius:12px;padding:12px;background:var(--card)}
/* patagonia */
.hv-gal{display:grid;grid-template-columns:1fr 1fr;gap:8px}@media (min-width:783px){.hv-gal{grid-template-columns:repeat(4,1fr)}}
.hv-gal figure{position:relative;margin:0;border-radius:10px;overflow:hidden;background:#111}
.hv-gal img{width:100%;aspect-ratio:3/2;object-fit:cover}
.hv-gal figcaption{padding:6px 8px 26px;font-size:12.5px;line-height:1.3}
.hv-gal .wide{grid-column:1/-1}.hv-gal .wide img{aspect-ratio:16/9}
.hv-feat{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0;padding:0;list-style:none}.hv-feat li{padding:5px 10px;border:1px solid var(--line);border-radius:999px;font-size:13px}
.hv-bk{border:2px solid var(--hv-a);border-radius:14px;padding:12px;background:var(--card)}
.hv-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin:0 0 10px;padding:0;list-style:none;counter-reset:s}
.hv-steps li{counter-increment:s;text-align:center;font:600 11.5px/1.2 Barlow,system-ui,sans-serif;padding:6px 2px;border-bottom:3px solid var(--line);color:var(--mut)}
.hv-steps li:before{content:counter(s) ". "}.hv-steps li.on{border-color:var(--hv-a);color:var(--fg)}
.hv-pane{display:none}.hv-pane.on{display:block}
.hv-opts{display:grid;gap:8px}@media (min-width:783px){.hv-opts{grid-template-columns:1fr 1fr}}
.hv-opt{display:grid;grid-template-columns:88px 1fr;gap:10px;align-items:center;padding:8px;border:1px solid var(--line);border-radius:10px;cursor:pointer}
.hv-opt input{position:absolute;opacity:0;pointer-events:none}
.hv-opt img{width:88px;height:62px;object-fit:cover;border-radius:6px}
.hv-opt b{display:block}.hv-opt small{display:block;color:var(--mut);line-height:1.3}.hv-opt .pr{font-weight:700;color:var(--hv-a)}
.hv-opt:has(input:checked){border-color:var(--hv-a);box-shadow:0 0 0 2px var(--hv-a) inset}
.hv-opt.ro{grid-template-columns:1fr}
.hv-f{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}
.hv-f label,.hv-1 label{display:flex;flex-direction:column;gap:3px;font-size:13px;color:var(--mut)}
.hv-f input,.hv-f select,.hv-1 input,.hv-1 select,.hv-1 textarea{font:16px Barlow,system-ui,sans-serif;min-height:44px;padding:6px 10px;border-radius:8px;border:1px solid var(--line);background:var(--bg);color:var(--fg);width:100%}
.hv-1{display:grid;gap:8px;margin:10px 0}
.hv-ck{display:flex!important;flex-direction:row!important;gap:8px;align-items:flex-start}.hv-ck input{width:22px!important;min-height:22px!important;margin-top:2px}
.hv-sum{list-style:none;margin:0;padding:0}.hv-sum li{display:flex;justify-content:space-between;gap:10px;padding:7px 0;border-bottom:1px solid var(--line)}
.hv-sum li.tot{font-weight:700;font-size:18px;border-bottom:0}
.hv-ind{font-size:12.5px;color:var(--mut)}
.hv-err{color:#ff8a8a;font-weight:600}
.hv-done{padding:12px;border-radius:10px;border:2px solid var(--hv-a);background:var(--bg)}
.hv-done b{font-size:20px;letter-spacing:.06em}
"""

# ---------- shared bits
def ev_links(H, ids):
    if not ids: return ''
    return '<span class="hv-ev">' + ''.join(f'<a href="{E(H["ev_href"].get(i, "/research/evidence/"))}">{E(i)}</a>' for i in ids) + '</span>'

def img(H, name):
    return f'{H["img"]}{name}.webp?v={H.get("img_v","1")}'

def grouping(H, cfg, sec):
    G = H['groups']; past = set(G['past']); pres = set(G['present']); excl = set(G.get('wales_exclude', [])) if sec == 'wales' else set()
    out = {'past': [], 'present': []}
    for t in cfg['themes']:
        if t['id'] in excl: continue
        g = 'past' if t['id'] in past else 'present' if t['id'] in pres else G.get('default', 'present')
        out[g].append(t)
    return out

def menu(H, T, cfg, l, sec, open_=False):
    gr = grouping(H, cfg, sec); n = sum(len(v) for v in gr.values())
    wmap = H.get('wales_title_map', {}) if sec == 'wales' else {}
    if wmap:
        for t in cfg['themes']:
            k = 'th_' + t['id']
            if k in T: T[k] = {x: wmap.get(v, v) for x, v in T[k].items()}
    cols = []
    for g in ('past', 'present'):
        li = ''.join(f'<li><a href="/{sec}/{E(t["id"])}/" data-i18n="th_{E(t["id"])}">{E(tx(T, "th_" + t["id"], l))}</a></li>' for t in gr[g])
        cols.append(f'<div><h3 data-i18n="g_{g}">{E(tx(T, "g_" + g, l))}</h3><p class="mut" data-i18n="g_{g}_p">{E(tx(T, "g_" + g + "_p", l))}</p><ul>{li}</ul></div>')
    T['menu_p_n'] = {k: v.replace('{n}', str(n)) for k, v in T['menu_p'].items()}
    return (f'<details class="hv-menu" id="menu"{" open" if open_ else ""}><summary><span data-i18n="w_menu">{E(tx(T, "w_menu", l))}</span></summary>'
            f'<h2 data-i18n="menu_h">{E(tx(T, "menu_h", l))}</h2><p class="mut" data-i18n="menu_p_n">{E(tx(T, "menu_p_n", l))}</p>'
            f'<div class="hv-cols">{"".join(cols)}</div></details>'), gr

JS = r"""
(function(){
  var de=document.documentElement,T=window.CEDWYN_T||{};
  function L(){try{if(window.CedwynSection)return CedwynSection.lang()}catch(e){}var l=(de.getAttribute('lang')||'en').slice(0,2);return /^(en|cy|es)$/.test(l)?l:'en'}
  function tr(k){var v=T[k];if(!v)return '';return v[L()]||v.en||''}
  window.__hvTr=tr;
  var page=document.body.getAttribute('data-cedwyn-page');
  if(page==='landing'){
    var hd=null,fix=function(){hd=document.querySelector('.ghf-v2');var top=document.querySelector('.hv-land');if(!top)return;var r=top.getBoundingClientRect();de.style.setProperty('--hv-top',Math.max(0,Math.round(r.top+window.scrollY))+'px')};
    fix();window.addEventListener('load',fix);window.addEventListener('resize',fix);setTimeout(fix,600);setTimeout(fix,1600);
    var t0=Date.now(),leaving=false;
    document.addEventListener('ghf-lang-change',function(e){if(leaving||Date.now()-t0<1500)return;try{sessionStorage.setItem('cedwyn-land-lang',e.detail&&e.detail.lang||L())}catch(x){}});
    [].forEach.call(document.querySelectorAll('.hv-tile'),function(a){a.addEventListener('click',function(){leaving=true})});
    var strip=function(){try{if(/[?&]lang=/.test(location.search)&&history.replaceState)history.replaceState(null,'',location.pathname+location.hash)}catch(e){}};
    document.addEventListener('ghf-lang-change',function(){setTimeout(strip,300)});setTimeout(strip,6000);
  }
  if(page==='wales'){
    var stops=[].slice.call(document.querySelectorAll('.hv-stop')),dots=[].slice.call(document.querySelectorAll('.hv-map .dot')),cur=0;
    var prev=document.getElementById('hv-prev'),next=document.getElementById('hv-next'),cnt=document.getElementById('hv-cnt');
    function show(i,scroll){cur=Math.max(0,Math.min(stops.length-1,i));stops.forEach(function(s,j){s.classList.toggle('on',j===cur)});dots.forEach(function(d,j){d.classList.toggle('on',j===cur)});
      if(cnt)cnt.textContent=(cur+1)+' / '+stops.length;prev.disabled=cur===0;next.disabled=cur===stops.length-1;
      try{history.replaceState(null,'','#stop-'+(cur+1))}catch(e){}
      if(scroll){var el=document.getElementById('tour');if(el)el.scrollIntoView({behavior:'smooth',block:'start'})}stopSpeak()}
    prev.addEventListener('click',function(){show(cur-1,true)});next.addEventListener('click',function(){show(cur+1,true)});
    dots.forEach(function(d,j){d.addEventListener('click',function(){show(j,true)});d.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();show(j,true)}})});
    [].forEach.call(document.querySelectorAll('[data-hv-go]'),function(a){a.addEventListener('click',function(e){var j=+a.getAttribute('data-hv-go');if(stops[j]){e.preventDefault();show(j,true)}})});
    var m=/#stop-(\d+)/.exec(location.hash);show(m?+m[1]-1:0,false);
    var sy=window.speechSynthesis,btn=document.getElementById('hv-say'),speaking=false;
    function stopSpeak(){if(sy&&speaking){sy.cancel()}speaking=false;if(btn)btn.textContent=tr('w_listen')}
    if(!sy&&btn)btn.hidden=true;
    if(btn)btn.addEventListener('click',function(){if(speaking){stopSpeak();return}var s=stops[cur];var txt=[].map.call(s.querySelectorAll('h3,.pl,.chap,.ov,ul.rec li .rt,.nw,.op'),function(x){return x.textContent}).join('. ');
      var u=new SpeechSynthesisUtterance(txt);var l=L();u.lang=l==='cy'?'cy-GB':l==='es'?'es-AR':'en-GB';u.rate=.98;u.onend=function(){speaking=false;btn.textContent=tr('w_listen')};
      sy.cancel();sy.speak(u);speaking=true;btn.textContent=tr('w_stoplisten')});
    document.addEventListener('ghf-lang-change',function(){setTimeout(function(){if(btn&&!speaking)btn.textContent=tr('w_listen')},50)});
  }
  if(page==='argentina'){
    var B=window.HV_BOOK||{},f=document.getElementById('hv-book');if(!f)return;
    var panes=[].slice.call(f.querySelectorAll('.hv-pane')),steps=[].slice.call(f.querySelectorAll('.hv-steps li')),st=0;
    function money(n){return '\u00a3'+Math.round(n).toLocaleString('en-GB')}
    function d(id){return f.querySelector('#'+id)}
    function val(n){var x=f.querySelector('[name="'+n+'"]:checked')||f.querySelector('[name="'+n+'"]');return x?x.value:''}
    function nights(){var a=new Date(d('bk-in').value),b=new Date(d('bk-out').value);if(isNaN(a)||isNaN(b))return 0;return Math.round((b-a)/864e5)}
    function venue(){var v=val('venue');for(var i=0;i<B.venues.length;i++)if(B.venues[i].id===v)return B.venues[i];return null}
    function calc(){var v=venue(),nn=nights(),g=+d('bk-g').value||1,rm=+d('bk-r').value||1,lines=[],tot=0,q=false;
      if(v){var n=v.id==='wed'?1:Math.max(nn,0),u=v.id==='room'?rm:1,a=v.price*u*(v.id==='wed'?1:n);
        lines.push([tr('v_'+v.id)+(v.id==='room'?' \u00d7 '+rm:'')+(v.id==='wed'?'':' \u00b7 '+n+' '+tr('b_nights')),a]);tot+=a}
      var ap=val('fly'),fl=+d('bk-fp').value||0;if(ap&&ap!=='NONE'){var A=null;for(var i=0;i<B.airports.length;i++)if(B.airports[i][0]===ap)A=B.airports[i];
        if(A){if(A[2]==null){lines.push([tr('b_s2')+' \u00b7 '+A[1]+' \u00d7 '+fl,null]);q=true}else{lines.push([tr('b_s2')+' \u00b7 '+A[1]+' \u2192 REL \u00d7 '+fl,A[2]*fl]);tot+=A[2]*fl}}}
      var c=val('car');if(c&&c!=='none'){var C=null;for(var j=0;j<B.cars.length;j++)if(B.cars[j][0]===c)C=B.cars[j];var days=Math.max(nn,1);
        if(C){lines.push([tr('b_car')+' \u00b7 '+tr('c_'+C[0])+' \u00b7 '+days+' \u00d7 '+money(C[1]),C[1]*days]);tot+=C[1]*days}}
      return {lines:lines,tot:tot,quote:q,nights:nn,g:g,rm:rm,v:v,ap:ap,fl:fl,car:c,pick:d('bk-pick').value}}
    function render(){var c=calc(),ul=d('bk-sum'),h='';c.lines.forEach(function(x){h+='<li><span></span><b></b></li>'});ul.innerHTML=h+'<li class="tot"><span></span><b></b></li>';
      var li=ul.querySelectorAll('li');c.lines.forEach(function(x,i){li[i].firstChild.textContent=x[0];li[i].lastChild.textContent=x[1]==null?tr('b_quote'):money(x[1])});
      li[li.length-1].firstChild.textContent=tr('b_total');li[li.length-1].lastChild.textContent=money(c.tot)+(c.quote?' +':'');return c}
    function ok(i){var e=d('bk-err');e.hidden=true;if(i===0){var v=venue(),n=nights();if(!v||(v.id!=='wed'&&n<1)||!d('bk-in').value){e.textContent=tr('b_err');e.hidden=false;return false}}return true}
    function go(i){if(i>st&&!ok(st))return;st=Math.max(0,Math.min(panes.length-1,i));panes.forEach(function(p,j){p.classList.toggle('on',j===st)});steps.forEach(function(s,j){s.classList.toggle('on',j<=st)});
      d('bk-back').hidden=st===0;d('bk-next').hidden=st===panes.length-1;if(st===panes.length-1)render();var top=f.getBoundingClientRect().top+window.scrollY-70;if(window.scrollY>top)window.scrollTo({top:top,behavior:'smooth'})}
    d('bk-next').addEventListener('click',function(){go(st+1)});d('bk-back').addEventListener('click',function(){go(st-1)});
    f.addEventListener('change',function(e){var v=venue();d('bk-rw').hidden=!(v&&v.id==='room');d('bk-outw').hidden=!!(v&&v.id==='wed');
      if(e.target&&e.target.id==='bk-g'){d('bk-fp').value=d('bk-g').value}if(st===panes.length-1)render()});
    var today=new Date();today.setDate(today.getDate()+1);var mn=today.toISOString().slice(0,10);d('bk-in').min=mn;d('bk-out').min=mn;
    document.addEventListener('ghf-lang-change',function(){setTimeout(function(){if(st===panes.length-1)render()},60)});
    f.addEventListener('submit',function(ev){ev.preventDefault();var e=d('bk-err2');e.hidden=true;var em=(d('bk-em').value||'').trim(),nm=(d('bk-nm').value||'').trim();
      if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)||!d('bk-ok').checked||!nm){e.textContent=tr('b_err');e.hidden=false;return}
      var c=render(),ref='GH2-'+Date.now().toString(36).toUpperCase().slice(-6);
      var sum=(/\btest\b/i.test(nm)?'TEST ':'')+'PREORDER '+ref+' | '+nm.slice(0,40)+' | '+(c.v?c.v.id:'-')+' '+d('bk-in').value+(c.v&&c.v.id!=='wed'?'..'+d('bk-out').value:'')+' g'+c.g+(c.v&&c.v.id==='room'?' r'+c.rm:'')+' | fly '+(c.ap||'-')+(c.ap&&c.ap!=='NONE'?' x'+c.fl:'')+' | car '+(c.car||'-')+'@'+c.pick+' | est GBP'+Math.round(c.tot)+(c.quote?'+':'')+' | '+L()+' | '+(d('bk-note').value||'').slice(0,60);
      sum=sum.slice(0,250);
      var btn=d('bk-send'),lab=btn.textContent;btn.disabled=true;btn.textContent=tr('b_sending');
      var M=B.mc,cb='cedwynGh2'+Date.now(),done=false,s=document.createElement('script');
      var p={u:M.u,id:M.id,c:cb,EMAIL:em,UTMSRC:'cedwyn/argentina-preorder',UTMCMP:'preorder-'+ref,CONSENT:sum};p['b_'+M.u+'_'+M.id]='';
      var qs=[];for(var k in p)qs.push(encodeURIComponent(k)+'='+encodeURIComponent(p[k]));
      function fin(okk,msg){if(done)return;done=true;try{delete window[cb]}catch(x){window[cb]=undefined}if(s.parentNode)s.parentNode.removeChild(s);btn.disabled=false;btn.textContent=lab;
        if(okk){try{var a=JSON.parse(localStorage.getItem('cedwyn-gh2-preorders')||'[]');a.push({ref:ref,at:new Date().toISOString(),sum:sum});localStorage.setItem('cedwyn-gh2-preorders',JSON.stringify(a.slice(-10)))}catch(x){}
          d('bk-form').hidden=true;var dn=d('bk-done');dn.hidden=false;d('bk-ref').textContent=ref;dn.setAttribute('data-ref',ref);dn.scrollIntoView({block:'center',behavior:'smooth'})}
        else{e.textContent=tr('b_err_send')+(msg?' ('+String(msg).replace(/<[^>]+>/g,'').slice(0,120)+')':'');e.hidden=false}}
      window[cb]=function(r){fin(r&&(r.result==='success'||/already subscribed/i.test(r.msg||'')),r&&r.msg)};s.onerror=function(){fin(false)};setTimeout(function(){fin(false)},15000);
      s.src='https://'+M.host+'/subscribe/post?'+qs.join('&');(document.head||de).appendChild(s)});
    go(0);
  }
})();
"""

def projection(stops):
    la = [s['lat'] for s in stops]; lo = [s['lon'] for s in stops]
    a0, a1, o0, o1 = min(la), max(la), min(lo), max(lo)
    kx = math.cos(math.radians((a0 + a1) / 2))
    W, Hh, pad = 360, 300, 34
    sx = (W - 2 * pad) / ((o1 - o0) * kx or 1); sy = (Hh - 2 * pad) / ((a1 - a0) or 1); k = min(sx, sy)
    def p(lat, lon):
        return pad + (lon - o0) * kx * k, Hh - pad - (lat - a0) * k
    return p, W, Hh

def tour_map(H, T, l):
    st = H['stops']; p, W, Hh = projection(st)
    pts = [p(s['lat'], s['lon']) for s in st]
    route = ' '.join(f'{x:.1f},{y:.1f}' for x, y in pts)
    sea = f'<path class="sea" d="M0,{Hh} L0,{Hh-28} C90,{Hh-40} 150,{Hh-22} 220,{Hh-56} S{W},{Hh-120} {W},{Hh-130} L{W},{Hh} Z"/>'
    dots = []
    seen = {}
    for i, ((x, y), s) in enumerate(zip(pts, st)):
        key = (round(x / 14), round(y / 14)); off = seen.get(key, 0); seen[key] = off + 1
        dx = off * 15
        nm = tx(T, f'stop_{s["id"]}_name', l)
        anchor = 'end' if x > W * 0.62 else 'start'
        lx = x + dx + (-14 if anchor == 'end' else 14)
        dots.append(f'<g class="dot" data-i="{i}" role="button" tabindex="0" aria-label="{E(str(i+1))}"><circle cx="{x+dx:.1f}" cy="{y:.1f}" r="10"/>'
                    f'<text x="{x+dx:.1f}" y="{y:.1f}">{i+1}</text></g>')
        if off == 0 and i < len(st) - 1:
            dots.append(f'<text class="lb" x="{lx:.1f}" y="{y+4:.1f}" text-anchor="{anchor}" data-i18n="stop_{s["id"]}_short">{E(tx(T, f"stop_{s[chr(105)+chr(100)]}_short", l))}</text>')
    return (f'<svg class="hv-map" viewBox="0 0 {W} {Hh}" role="img" aria-labelledby="hv-map-t"><title id="hv-map-t">{E(tx(T,"w_map_h",l))}</title>{sea}'
            f'<text class="sl" x="{W-12}" y="{Hh-10}" text-anchor="end">Môr Hafren · Bristol Channel</text>'
            f'<polyline class="rt" points="{route}"/>' + ''.join(dots) + '</svg>')

def stop_html(H, T, l, i, s, n):
    sid = s['id']
    for k in ('name', 'place', 'overlay', 'now', 'open', 'story'):
        T[f'stop_{sid}_{k}'] = s[k]
    T[f'stop_{sid}_short'] = s['place'] if sid in ('driscoll', 'bay', 'lavernock', 'brynwell') else s['name']
    T[f'stop_{sid}_short'] = {k: re.split(r'[,:·]', v)[0] for k, v in T[f'stop_{sid}_short'].items()}
    recs = []
    for j, (txt, ids) in enumerate(s['recs']):
        T[f'stop_{sid}_r{j}'] = txt
        recs.append(f'<li><span class="rt" data-i18n="stop_{sid}_r{j}">{E(tx(T, f"stop_{sid}_r{j}", l))}</span> {ev_links(H, ids)}</li>')
    alt = tx(T, f'stop_{sid}_overlay', l)
    extra = ''
    if sid == 'retrace':
        tl = []
        for j, (yr, txt, ids) in enumerate(H['timeline']):
            T[f'tl_{j}'] = txt
            tl.append(f'<li><b>{E(yr)}</b><span><span data-i18n="tl_{j}">{E(tx(T, f"tl_{j}", l))}</span> {ev_links(H, ids)}</span></li>')
        extra = f'<ol class="hv-tl">{"".join(tl)}</ol>'
    return (f'<article class="hv-stop{" on" if i == 0 else ""}" id="stop-{i+1}" aria-label="{E(str(i+1))}">'
            f'<div class="hv-ar"><img src="{img(H, s["img"])}" width="1280" height="853" alt="{E(alt)}" data-i18n-al="stop_{sid}_overlay" loading="{"eager" if i == 0 else "lazy"}" decoding="async"><span class="scan"></span>'
            f'<span class="chip" data-i18n="ar_tag">{E(tx(T, "ar_tag", l))}</span></div>'
            f'<p class="hv-sn"><span data-i18n="w_stop">{E(tx(T, "w_stop", l))}</span> {i+1} / {n}</p>'
            f'{sp(T, f"stop_{sid}_name", l, "h3")}{sp(T, f"stop_{sid}_place", l, "p", "pl")}'
            f'<p class="chap"><span data-i18n="stop_{sid}_story">{E(tx(T, f"stop_{sid}_story", l))}</span> {ev_links(H, s.get("story_ev", []))}</p>'
            f'{sp(T, "w_overlay", l, "h4")}{sp(T, f"stop_{sid}_overlay", l, "p", "ov")}'
            + (f'{sp(T, "w_records", l, "h4")}<ul class="rec">{"".join(recs)}</ul>' if recs else '') + extra +
            f'{sp(T, "w_now", l, "h4")}{sp(T, f"stop_{sid}_now", l, "p", "nw")}'
            f'{sp(T, "w_open", l, "h4")}{sp(T, f"stop_{sid}_open", l, "p", "op")}</article>')

def base_T(sections, S, cfg, sec, H):
    T = sections.page_t(S, cfg, sec)
    T.update(H['t'])
    return T

def page(sections, title, desc, lang, bpath, sec, T, n, body):
    h = sections.head(title, desc, lang, bpath, sec, T, n)
    h = h.replace('</style>', CSS + '</style>', 1)
    return h + body

def landing(sections, S, cfg, H):
    l = 'en'; n = len(cfg['themes']); T = base_T(sections, S, cfg, None, H)
    pre = ("<script>(function(){try{var p=sessionStorage.getItem('cedwyn-land-lang');var l=/^(en|cy|es)$/.test(p||'')?p:'en';window.__cedwynLang=l;"
           "try{localStorage.setItem('ghf_lang',l)}catch(e){}var s=location.protocol==='https:'?'; Secure':'';var c='ghf_lang='+l+'; path=/; max-age=31536000; SameSite=Lax'+s;document.cookie=c;"
           "if(/(^|\\.)bucklerfamily\\.estate$/.test(location.hostname))document.cookie=c+'; domain=.bucklerfamily.estate';"
           "if(!/[?&]lang=/.test(location.search)&&history.replaceState)history.replaceState(null,'',location.pathname+'?lang='+l+location.hash)}catch(e){}})();</script>")
    body = f"""
<body data-cedwyn-page="landing">
<main class="wrap hv" data-no-translate>
<div class="hv-land">
<p class="eyebrow">{sp(T,'land_pick',l)}</p>
<div class="hv-tiles">
<a class="hv-tile hv-w" href="/wales/?lang=cy" hreflang="cy"><img src="{img(H,'tile-wales')}" width="960" height="544" alt="" fetchpriority="high"><span class="stripe"></span>
<span class="hv-tag" data-i18n="ai_tag">{E(tx(T,'ai_tag',l))}</span>
<span class="tb"><span class="tn" data-i18n="tw_name">{E(tx(T,'tw_name',l))}</span><span class="ts" data-i18n="tw_sub">{E(tx(T,'tw_sub',l))}</span><span class="tc" data-i18n="tw_cta">{E(tx(T,'tw_cta',l))}</span></span></a>
<a class="hv-tile hv-a" href="/argentina/?lang=es" hreflang="es"><img src="{img(H,'tile-patagonia')}" width="960" height="640" alt="" fetchpriority="high"><span class="stripe"></span>
<span class="hv-tag" data-i18n="ai_tag">{E(tx(T,'ai_tag',l))}</span>
<span class="tb"><span class="tn" data-i18n="ta_name">{E(tx(T,'ta_name',l))}</span><span class="ts" data-i18n="ta_sub">{E(tx(T,'ta_sub',l))}</span><span class="tc" data-i18n="ta_cta">{E(tx(T,'ta_cta',l))}</span></span></a>
</div>
<p class="hv-foot"><a href="/explore/" data-i18n="land_more">{E(tx(T,'land_more',l))}</a><a href="/ebooks/" data-i18n="w_ebooks">{E(tx(T,'w_ebooks',l))}</a></p>
</div>
</main>
<script>{JS}</script>
</body>
</html>
"""
    out = page(sections, 'Cedwyn Estate · Wales and Patagonia', 'Cedwyn Estate: two ways in. Wales, an augmented-reality guided tour of Llandough; Patagonia, the Great House II retreat at Puerto Madryn.', l, '/cedwyn/home/', None, T, n, body)
    return out.replace('<head>\n', '<head>\n' + pre + '\n', 1)

def wales(sections, S, cfg, H):
    l = 'cy'; n = len(cfg['themes']); T = base_T(sections, S, cfg, 'wales', H)
    st = H['stops']; ns = len(st)
    stops = ''.join(stop_html(H, T, l, i, s, ns) for i, s in enumerate(st))
    mp = tour_map(H, T, l)
    mn, gr = menu(H, T, cfg, l, 'wales')
    body = f"""
<body data-cedwyn-page="wales">
<main class="wrap hv" data-no-translate>
<header class="hv-hero"><img src="{img(H,'wales-ar-green')}" width="1280" height="725" alt="" fetchpriority="high"><span class="hv-tag" data-i18n="ai_tag">{E(tx(T,'ai_tag',l))}</span>
<div class="hb"><p class="eyebrow" style="color:#ddd" data-i18n="w_kick">{E(tx(T,'w_kick',l))}</p><h1 data-i18n="w_h1">{E(tx(T,'w_h1',l))}</h1></div></header>
<h2 data-i18n="w_h2">{E(tx(T,'w_h2',l))}</h2>
<p class="lede" data-i18n="w_lede">{E(tx(T,'w_lede',l))}</p>
<div class="hv-btns"><a class="hv-btn pri" href="#tour" data-hv-go="0" data-i18n="w_start">{E(tx(T,'w_start',l))}</a><a class="hv-btn" href="#shop" data-i18n="w_tickets">{E(tx(T,'w_tickets',l))}</a><a class="hv-btn" href="#menu" data-i18n="w_menu">{E(tx(T,'w_menu',l))}</a></div>
{mn}
<section id="route"><h2 data-i18n="w_map_h">{E(tx(T,'w_map_h',l))}</h2><p class="mut" data-i18n="w_map_p">{E(tx(T,'w_map_p',l))}</p>{mp}</section>
<section id="tour">{stops}
<div class="hv-nav"><button type="button" class="hv-btn" id="hv-prev" data-i18n="w_prev">{E(tx(T,'w_prev',l))}</button><span id="hv-cnt" class="mut">1 / {ns}</span>
<button type="button" class="hv-btn" id="hv-say" data-i18n="w_listen">{E(tx(T,'w_listen',l))}</button><button type="button" class="hv-btn pri" id="hv-next" data-i18n="w_next">{E(tx(T,'w_next',l))}</button></div></section>
<section class="hv-note" id="no-museum"><h3 data-i18n="w_nomuseum_h">{E(tx(T,'w_nomuseum_h',l))}</h3><p><span data-i18n="w_nomuseum_p">{E(tx(T,'w_nomuseum_p',l))}</span> {ev_links(H,['EV-0296'])}</p></section>
<section id="shop"><h2 data-i18n="w_shop_h">{E(tx(T,'w_shop_h',l))}</h2><p data-i18n="w_shop_p">{E(tx(T,'w_shop_p',l))}</p>
<div class="hv-btns"><a class="hv-btn pri" href="/wales/tour/#vouchers" data-i18n="w_shop_cta">{E(tx(T,'w_shop_cta',l))}</a><a class="hv-btn" href="/ebooks/" data-i18n="w_ebooks">{E(tx(T,'w_ebooks',l))}</a></div></section>
<section><a class="hv-btn" style="width:100%;justify-content:flex-start;min-height:64px;border-radius:12px" href="/argentina/?lang=es" hreflang="es"><span><b data-i18n="w_cross_h">{E(tx(T,'w_cross_h',l))}</b><br><span class="mut" data-i18n="w_cross_p">{E(tx(T,'w_cross_p',l))}</span></span></a></section>
<p class="endnote"><a href="/" data-i18n="home">{E(tx(T,'home',l) or 'Home')}</a> · <a href="/explore/" data-i18n="land_more">{E(tx(T,'land_more',l))}</a></p>
</main>
<script>{JS}</script>
</body>
</html>
"""
    return page(sections, 'Cedwyn Estate, Wales · augmented-reality guided tour', 'Cedwyn Estate, Wales: an augmented-reality guided tour from Tŷ Mawr, the former manorial house at Llandough, to Lavernock Point. Every fact linked to its record.', l, '/wales/', 'wales', T, n, body)

def argentina(sections, S, cfg, H):
    l = 'es'; n = len(cfg['themes']); T = base_T(sections, S, cfg, 'argentina', H)
    fc_card = ''
    try:
        import family_case
        T.update(family_case.strings()[0])
        if T.get('fc_link_h'):
            fc_card = (f'<a class="hv-btn" style="width:100%;justify-content:flex-start;min-height:72px;border-radius:12px;border:2px solid var(--hv-b)" href="/argentina/caso/">'
                       f'<span><b data-i18n="fc_link_h">{E(tx(T,"fc_link_h",l))}</b><br><span class="mut" data-i18n="fc_link_p">{E(tx(T,"fc_link_p",l))}</span></span></a>')
    except Exception as e:
        print('halves: family_case not available:', e)
    if not fc_card:
        fc_card = f'<a class="hv-btn" href="/argentina/caso/" data-i18n="a_caso">{E(tx(T,"a_caso",l))}</a>'
    gal = [('ghf2-exterior', 'cap_ext', True), ('ghf2-bedroom', 'cap_bed', False), ('ghf2-drawing-room', 'cap_draw', False), ('ghf2-stables', 'cap_stab', False),
           ('ghf2-barn', 'cap_barn', False), ('ghf2-cottage', 'cap_cot', False), ('ghf2-wedding', 'cap_wed', False), ('ghf2-villa', 'cap_villa', False)]
    g = ''.join(f'<figure{" class=wide" if w else ""}><img src="{img(H,a)}" width="1280" height="853" alt="{E(tx(T,c,l))}" data-i18n-al="{c}" loading="lazy" decoding="async">'
                f'<figcaption data-i18n="{c}">{E(tx(T,c,l))}</figcaption><span class="hv-tag" data-i18n="ai_tag">{E(tx(T,"ai_tag",l))}</span></figure>' for a, c, w in gal if not w)
    feats = ''.join(f'<li data-i18n="a_feat{i}">{E(tx(T,"a_feat"+str(i),l))}</li>' for i in range(1, 7))
    vimg = {'room': 'ghf2-bedroom', 'cottage': 'ghf2-cottage', 'villa': 'ghf2-villa', 'wed': 'ghf2-wedding'}
    unit = {'room_night': '/', 'night': '/', 'day': '/'}
    vo = ''.join(f'<label class="hv-opt"><input type="radio" name="venue" value="{v["id"]}"{" checked" if v["id"] == "room" else ""}><img src="{img(H,vimg[v["id"]])}" width="88" height="62" alt="" loading="lazy">'
                 f'<span><b data-i18n="v_{v["id"]}">{E(tx(T,"v_"+v["id"],l))}</b><small data-i18n="v_{v["id"]}_d">{E(tx(T,"v_"+v["id"]+"_d",l))}</small><span class="pr">£{v["price"]:,}</span></span></label>' for v in H['venues'])
    ap = '<option value="NONE" data-i18n="b_nofly">' + E(tx(T, 'b_nofly', l)) + '</option>' + ''.join(
        f'<option value="{a}"{" selected" if a == "LHR" else ""}>{E(nm)} ({a})' + (f' · £{p:,}' if p else '') + '</option>' if a != 'OTHER' else f'<option value="OTHER">…</option>' for a, nm, p in H['airports'])
    cars = ('<label class="hv-opt ro"><input type="radio" name="car" value="none"><span><b data-i18n="b_nocar">' + E(tx(T, 'b_nocar', l)) + '</b></span></label>' +
            ''.join(f'<label class="hv-opt ro"><input type="radio" name="car" value="{c}"{" checked" if c == "4x4" else ""}><span><b data-i18n="c_{c}">{E(tx(T,"c_"+c,l))}</b><span class="pr">£{p} </span><small data-i18n="b_perday">{E(tx(T,"b_perday",l))}</small></span></label>' for c, p in H['cars']))
    book = {'venues': H['venues'], 'airports': H['airports'], 'cars': H['cars'], 'mc': {'u': '284f08fe7e1b8d39250808104', 'id': '6139ff4a0d', 'host': 'estate.us3.list-manage.com'}}
    mn, gr = menu(H, T, cfg, l, 'argentina')
    body = f"""
<body data-cedwyn-page="argentina">
<main class="wrap hv" data-no-translate style="--hv-a:#2f78b8;--hv-b:#F6B40E">
<header class="hv-hero"><img src="{img(H,'ghf2-exterior')}" width="1280" height="853" alt="{E(tx(T,'cap_ext',l))}" data-i18n-al="cap_ext" fetchpriority="high"><span class="hv-tag" data-i18n="ai_tag">{E(tx(T,'ai_tag',l))}</span>
<div class="hb"><p class="eyebrow" style="color:#ddd" data-i18n="a_kick">{E(tx(T,'a_kick',l))}</p><h1 data-i18n="a_h1">{E(tx(T,'a_h1',l))}</h1><p style="margin:0" data-i18n="a_h2">{E(tx(T,'a_h2',l))}</p></div></header>
<span class="soon" data-i18n="a_soon">{E(tx(T,'a_soon',l))}</span>
<p class="lede" data-i18n="a_lede">{E(tx(T,'a_lede',l))}</p>
<div class="hv-btns"><a class="hv-btn pri" href="#book" data-i18n="a_build">{E(tx(T,'a_build',l))}</a><a class="hv-btn" href="#museum" data-i18n="mu_h">{E(tx(T,'mu_h',l))}</a><a class="hv-btn" href="/argentina/caso/" data-i18n="a_caso">{E(tx(T,'a_caso',l))}</a><a class="hv-btn" href="#menu" data-i18n="a_menu">{E(tx(T,'a_menu',l))}</a></div>
{mn}
<section id="house"><h2 data-i18n="a_house_h">{E(tx(T,'a_house_h',l))}</h2><p data-i18n="a_house_p">{E(tx(T,'a_house_p',l))}</p><ul class="hv-feat">{feats}</ul>
<div class="hv-gal">{g}</div></section>
<section id="museum"><h2 data-i18n="mu_h">{E(tx(T,'mu_h',l))}</h2>
<figure class="hv-gal" style="display:block;margin:0 0 10px"><span style="display:block;position:relative;border-radius:10px;overflow:hidden"><img src="{img(H,'ghf2-museum')}" width="1280" height="853" alt="{E(tx(T,'cap_mus',l))}" data-i18n-al="cap_mus" loading="lazy" decoding="async" style="width:100%;aspect-ratio:3/2;object-fit:cover"><span class="hv-tag" data-i18n="ai_tag">{E(tx(T,'ai_tag',l))}</span></span><figcaption class="mut" data-i18n="cap_mus">{E(tx(T,'cap_mus',l))}</figcaption></figure>
<p data-i18n="mu_p">{E(tx(T,'mu_p',l))}</p></section>
<section id="book"><h2 data-i18n="b_h">{E(tx(T,'b_h',l))}</h2><p data-i18n="b_p">{E(tx(T,'b_p',l))}</p>
<form class="hv-bk" id="hv-book" novalidate>
<ol class="hv-steps"><li class="on" data-i18n="b_s1">{E(tx(T,'b_s1',l))}</li><li data-i18n="b_s2">{E(tx(T,'b_s2',l))}</li><li data-i18n="b_s3">{E(tx(T,'b_s3',l))}</li><li data-i18n="b_s4">{E(tx(T,'b_s4',l))}</li></ol>
<div class="hv-pane on" data-step="1"><h3 data-i18n="b_venue">{E(tx(T,'b_venue',l))}</h3><div class="hv-opts">{vo}</div>
<div class="hv-f"><label><span data-i18n="b_in">{E(tx(T,'b_in',l))}</span><input type="date" id="bk-in" name="in" required></label><label id="bk-outw"><span data-i18n="b_out">{E(tx(T,'b_out',l))}</span><input type="date" id="bk-out" name="out"></label>
<label><span data-i18n="b_guests">{E(tx(T,'b_guests',l))}</span><input type="number" id="bk-g" name="guests" min="1" max="120" value="2" inputmode="numeric"></label><label id="bk-rw"><span data-i18n="b_rooms">{E(tx(T,'b_rooms',l))}</span><input type="number" id="bk-r" name="rooms" min="1" max="10" value="1" inputmode="numeric"></label></div></div>
<div class="hv-pane" data-step="2"><h3 data-i18n="b_from">{E(tx(T,'b_from',l))}</h3><p class="mut" data-i18n="b_fly_d">{E(tx(T,'b_fly_d',l))}</p>
<div class="hv-1"><label><span data-i18n="b_from">{E(tx(T,'b_from',l))}</span><select name="fly" id="bk-fly">{ap}</select></label><label><span data-i18n="b_flyers">{E(tx(T,'b_flyers',l))}</span><input type="number" id="bk-fp" name="flyers" min="0" max="120" value="2" inputmode="numeric"></label></div></div>
<div class="hv-pane" data-step="3"><h3 data-i18n="b_car">{E(tx(T,'b_car',l))}</h3><div class="hv-opts">{cars}</div>
<div class="hv-1"><label><span data-i18n="b_pick">{E(tx(T,'b_pick',l))}</span><select id="bk-pick" name="pick"><option value="REL" data-i18n="p_rel">{E(tx(T,'p_rel',l))}</option><option value="PMY" data-i18n="p_pmy">{E(tx(T,'p_pmy',l))}</option></select></label></div></div>
<div class="hv-pane" data-step="4"><h3 data-i18n="b_s4">{E(tx(T,'b_s4',l))}</h3><ul class="hv-sum" id="bk-sum"></ul><p class="hv-ind" data-i18n="b_ind">{E(tx(T,'b_ind',l))}</p>
<div id="bk-form"><div class="hv-1"><label><span data-i18n="b_name">{E(tx(T,'b_name',l))}</span><input id="bk-nm" name="name" autocomplete="name" maxlength="80" required></label>
<label><span data-i18n="b_email">{E(tx(T,'b_email',l))}</span><input id="bk-em" type="email" name="email" autocomplete="email" maxlength="160" required></label>
<label><span data-i18n="b_note">{E(tx(T,'b_note',l))}</span><textarea id="bk-note" name="note" rows="2" maxlength="300"></textarea></label>
<label class="hv-ck"><input type="checkbox" id="bk-ok"><span><span data-i18n="b_ok">{E(tx(T,'b_ok',l))}</span> <a href="/dartboard/legal/" data-i18n="privacy">{E(tx(T,'privacy',l))}</a></span></label></div>
<p class="hv-err" id="bk-err2" role="alert" hidden></p><button type="submit" class="hv-btn pri" id="bk-send" data-i18n="b_send">{E(tx(T,'b_send',l))}</button></div>
<div class="hv-done" id="bk-done" role="status" hidden><p data-i18n="b_done">{E(tx(T,'b_done',l))}</p><b id="bk-ref"></b><p class="mut" data-i18n="b_done2">{E(tx(T,'b_done2',l))}</p></div></div>
<p class="hv-err" id="bk-err" role="alert" hidden></p>
<div class="hv-btns" style="justify-content:space-between"><button type="button" class="hv-btn" id="bk-back" hidden data-i18n="b_back">{E(tx(T,'b_back',l))}</button><button type="button" class="hv-btn pri" id="bk-next" data-i18n="b_cont">{E(tx(T,'b_cont',l))}</button></div>
</form></section>
<section id="retelling"><h2 data-i18n="a_retell_h">{E(tx(T,'a_retell_h',l))}</h2><p class="mut" data-i18n="a_retell_p">{E(tx(T,'a_retell_p',l))}</p>
{fc_card}
<div class="hv-btns"><a class="hv-btn" href="/argentina/thousand-cuts/" data-i18n="th_thousand-cuts">{E(tx(T,'th_thousand-cuts',l))}</a><a class="hv-btn" href="/argentina/story/" data-i18n="th_story">{E(tx(T,'th_story',l))}</a><a class="hv-btn" href="/argentina/research/timeline/" data-i18n="tl_link">{E(tx(T,'tl_link',l))}</a></div>
</section>
<section><a class="hv-btn" style="width:100%;justify-content:flex-start;min-height:64px;border-radius:12px" href="/wales/?lang=cy" hreflang="cy"><span><b data-i18n="a_cross_h">{E(tx(T,'a_cross_h',l))}</b><br><span class="mut" data-i18n="a_cross_p">{E(tx(T,'a_cross_p',l))}</span></span></a></section>
<p class="endnote"><a href="/" data-i18n="home">{E(tx(T,'home',l) or 'Home')}</a> · <a href="/explore/" data-i18n="land_more">{E(tx(T,'land_more',l))}</a></p>
</main>
<script>window.HV_BOOK={json.dumps(book, ensure_ascii=False)};</script>
<script>{JS}</script>
</body>
</html>
"""
    out = page(sections, 'Cedwyn Estate II, Patagonia · Great House II retreat', 'Cedwyn Estate II: Great House II at Puerto Madryn, Patagonia. A replica of the Great House: rooms, cottage, whole-house hire, weddings, stables, barn and museum. Build a trip and send a pre-order request.', l, '/patagonia/', 'argentina', T, n, body)
    return out.replace('--a:#00843D;--b:#C8102E', '--a:#4E8CC8;--b:#F6B40E', 1)

WALES_NO_FARM = re.compile(r'\b(?:farm|fferm|granja)\b', re.I)

def check_wales_house(text):
    """Wales half (Sion 23:39): Tŷ Mawr is a former manorial house, never a farm. Allowed: the quoted RCAHMW words about
    Brynwell ("a medieval farmhouse") and the Cadw building name; every other 'farm' in the visible tour copy fails the build."""
    m = re.search(r'<main\b.*?</main>', text, flags=re.S)
    body = re.sub(r'<script\b.*?</script>', ' ', m.group(0) if m else text, flags=re.S)
    body = re.sub(r'<[^>]+>', ' ', body)
    hits = [x for x in WALES_NO_FARM.findall(body)]
    assert not hits, 'wales page calls the house a farm: %s' % hits[:5]

def run(dist, cfg):
    dist = pathlib.Path(dist)
    import sections, agent_footer
    H = json.load(open(ROOT / 'data' / 'halves.json', encoding='utf-8'))
    S = json.load(open(ROOT / 'sections.json', encoding='utf-8'))
    pages = {dist / 'index.html': landing(sections, S, cfg, H),
             dist / 'wales' / 'index.html': wales(sections, S, cfg, H),
             dist / 'argentina' / 'index.html': argentina(sections, S, cfg, H)}
    for pth, txt in pages.items():
        pth.parent.mkdir(parents=True, exist_ok=True); pth.write_text(txt, encoding='utf-8'); agent_footer.inject(pth, False)
    w = (dist / 'wales' / 'index.html').read_text(encoding='utf-8')
    sections.check_wales(w); sections.check_wales((dist / 'index.html').read_text(encoding='utf-8')); check_wales_house(w)
    for pth in pages:
        t = pth.read_text(encoding='utf-8'); m = re.search(r'<main\b.*?</main>', t, flags=re.S)
        out = [h for h in re.findall(r'href="([^"]+)"', m.group(0)) if re.match(r'^(https?:)?//', h)]
        assert not out, 'halves: outbound link on %s: %s' % (pth, out[:3])
    print('halves ok:', len(H['stops']), 'tour stops;', 'menu', {k: len(v) for k, v in grouping(H, cfg, 'wales').items()}, 'wales /', {k: len(v) for k, v in grouping(H, cfg, 'argentina').items()}, 'argentina')

if __name__ == '__main__':
    import sys
    sys.path.insert(0, str(ROOT / 'tools'))
    run(sys.argv[1] if len(sys.argv) > 1 else 'dist', json.load(open(ROOT / 'themes.json')))
