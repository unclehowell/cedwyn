/*! Cedwyn WikiLinks v1.0.1 — lexicon-backed first-occurrence links for independent Cedwyn themes. */
(function () {
  "use strict";
  if (window.CedwynWikiLinks || !document.body) return;
  window.CedwynWikiLinks = "1.0.0";
  var me = document.currentScript || document.querySelector("script[data-cedwyn-wikilinks]");
  var base = me && me.src ? me.src.replace(/[^\\/?#]*([?#].*)?$/, "") : "https://nomenclature.bucklerfamily.estate/";
  var lexUrl = (me && me.getAttribute("data-lexicon")) || (base + "lexicon.json");
  var scope = (me && me.getAttribute("data-scope")) || "main";
  var root = document.querySelector(scope) || document.querySelector("article") || document.body;
  if (root.matches && root.matches("main.p2.arc")) return;
  var skip = /^(A|ABBR|BUTTON|CODE|DIALOG|H1|H2|H3|H4|H5|H6|INPUT|LABEL|NAV|OPTION|PRE|SCRIPT|SELECT|STYLE|SUMMARY|SVG|TEXTAREA)$/;
  function ignored(node) {
    for (var p = node.parentElement; p && p !== root.parentElement; p = p.parentElement) {
      if (skip.test(p.tagName) || p.hasAttribute("data-term-skip") || p.hasAttribute("data-no-wikilink") ||
          p.hasAttribute("data-nm") || (p.closest && p.closest("a,button,[role='button'],[aria-hidden='true']"))) return true;
    }
    return false;
  }
  function esc(s) { return String(s).split("").map(function(c){return ".+*?^$()[]{}|\\\\".indexOf(c)>=0?"\\"+c:c;}).join(""); }
  function init(lex) {
    var entries = [], used = Object.create(null);
    (lex.concepts || []).forEach(function (c) {
      (c.link_terms || []).forEach(function (term) {
        if (typeof term === "string" && term.trim().length > 2) entries.push({term:term.trim(), id:c.id, url:c.page, summary:c.summary || c.name});
      });
    });
    entries.sort(function (a,b) { return b.term.length-a.term.length; });
    if (!entries.length) return;
    var rx = new RegExp("(^|[^\\p{L}\\p{N}_])(" + entries.map(function(x){return esc(x.term);}).join("|") + ")(?=$|[^\\p{L}\\p{N}_])", "giu");
    var testRx = new RegExp(rx.source, "iu"), byTerm = Object.create(null);
    entries.forEach(function (x) { var k=x.term.toLocaleLowerCase(); if (!byTerm[k]) byTerm[k]=x; });
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {acceptNode:function(n) {
      if (!n.nodeValue || !n.nodeValue.trim() || ignored(n)) return NodeFilter.FILTER_REJECT;
      return testRx.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }});
    var nodes=[], n; while ((n=walker.nextNode())) nodes.push(n);
    nodes.forEach(function(node) {
      var s=node.nodeValue, frag=document.createDocumentFragment(), last=0, any=false, m, g=new RegExp(rx.source,"giu");
      while ((m=g.exec(s))) {
        var hit=byTerm[m[2].toLocaleLowerCase()];
        if (!hit || used[hit.id] || !hit.url) continue;
        var here=location.href.split("#")[0].replace(/index\.html$/,"").replace(/\/$/,"/");
        var dest=hit.url.replace(/\/$/,"/");
        if (here===dest) { used[hit.id]=true; continue; }
        var start=m.index+m[1].length;
        if (start>last) frag.appendChild(document.createTextNode(s.slice(last,start)));
        var a=document.createElement("a"); a.className="cedwyn-wikilink"; a.href=hit.url; a.textContent=m[2]; a.title=hit.summary; a.setAttribute("data-nomlecture",hit.id);
        frag.appendChild(a); last=start+m[2].length; used[hit.id]=true; any=true;
      }
      if (!any) return;
      if (last<s.length) frag.appendChild(document.createTextNode(s.slice(last)));
      node.parentNode.replaceChild(frag,node);
    });
  }
  var st=document.createElement("style"); st.setAttribute("data-cedwyn-wikilinks-css","");
  st.textContent="a.cedwyn-wikilink{color:inherit;text-decoration:underline dotted 1.5px #7ef0e0;text-underline-offset:3px}a.cedwyn-wikilink:hover{text-decoration-style:solid}a.cedwyn-wikilink:focus-visible{outline:2px solid currentColor;outline-offset:3px}";
  (document.head||document.documentElement).appendChild(st);
  fetch(lexUrl,{mode:"cors"}).then(function(r){if(!r.ok)throw new Error("lexicon HTTP "+r.status);return r.json();}).then(init).catch(function(e){if(window.console&&console.info)console.info("Cedwyn WikiLinks unavailable",e);});
})();