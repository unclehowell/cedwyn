// cedwyn-coming-soon 1.0.0 — "coming soon" webapps of the N-of-59 loop: the words once, a 2 s reverse-countdown bar,
// then the next webapp in the loop opens by itself (59 -> 1). Owner request, 10 Nov 2026 21:35 GMT. — Sion's Tab agent
// Source of truth for the order: /areas.json "nav" (the same registry the header and the stamped bar use).
// A page is changed only if it still IS a placeholder (main.cs-w / data-coming-soon, or an <h1> that reads "coming soon");
// a real webapp that replaces the slot passes through untouched. Rollback: remove this Worker's routes (UNDO.md).
const VER = "1.0.0", TOTAL = 59, ORIGIN = "https://cedwyn.bucklerfamily.estate";
const CS_RE = /^\s*coming soon\s*$/i;
let REG = null, REG_AT = 0;
async function registry() {
  if (REG && Date.now() - REG_AT < 300000) return REG;
  try {
    const r = await fetch(ORIGIN + "/areas.json", { cf: { cacheTtl: 120, cacheEverything: true } });
    const d = await r.json();
    const nav = (d.nav || []).filter(x => x.slot).sort((a, b) => a.slot - b.slot);
    if (nav.length) { REG = nav; REG_AT = Date.now(); }
  } catch (e) {}
  return REG;
}
const norm = p => { p = (p || "").split("?")[0].split("#")[0]; if (!p.startsWith("/")) p = "/" + p; if (!p.endsWith("/") && !/\.[a-z0-9]+$/i.test(p)) p += "/"; return p; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const isCS = x => /^coming-soon-\d+$/.test(x.id || "") || CS_RE.test(x.title || "");
const label = x => (isCS(x) ? "Webapp " + x.slot + " of " + TOTAL : x.title) || ("Webapp " + x.slot + " of " + TOTAL);
async function upstream(req, env) {
  const u = new URL(req.url);
  const target = ORIGIN + u.pathname + u.search;
  if (u.pathname.startsWith("/online/") && env.ONLINE) return env.ONLINE.fetch(new Request(target, req));
  return fetch(new Request(target, req), { redirect: "manual" });
}
export default {
  async fetch(req, env) {
    const res = await upstream(req, env);
    const ct = res.headers.get("content-type") || "";
    if (req.method !== "GET" || res.status !== 200 || !ct.includes("text/html")) return res;
    let html = await res.text();
    // the apex copy of an /online/ page names the apex host, as the apex router does for it
    if (new URL(req.url).hostname === "bucklerfamily.estate" && new URL(req.url).pathname.startsWith("/online/")) html = html.split("cedwyn.bucklerfamily.estate").join("bucklerfamily.estate");
    const m = html.match(/<main\b[^>]*>[\s\S]*?<\/main>/i);
    const placeholder = m && (/class="cs-w"|data-coming-soon=/.test(m[0]) || /<h1\b[^>]*>\s*coming soon\s*<\/h1>/i.test(m[0]));
    const nav = placeholder ? await registry() : null;
    const path = norm(new URL(req.url).pathname);
    const here = nav && nav.find(x => [x.href, x.path, x.apex, x.src].concat(x.aliases || []).some(p => p && norm(p) === path));
    const h = new Headers(res.headers); h.set("x-cedwyn-coming-soon", VER + (here ? "" : " pass"));
    if (!placeholder || !here) return new Response(html, { status: 200, headers: h });
    const i = nav.indexOf(here), nx = nav[(i + 1) % nav.length], pv = nav[(i - 1 + nav.length) % nav.length];
    const allCS = nav.every(isCS);
    const nh = nx.href || nx.path, ph = pv.href || pv.path;
    // 1) the words once: the header names the page "Coming soon"; the page body no longer repeats it
    let main = m[0];
    const headerCS = isCS(here) || /textContent\s*=\s*"Coming soon"/.test(html);
    if (headerCS) main = main.replace(/<h1\b([^>]*)>\s*coming soon\s*<\/h1>\s*(<p\b[^>]*>([^<]*)<\/p>)?/i, (all, a, p, ptxt) => {
      const t = ptxt && !CS_RE.test(ptxt) ? ptxt : "Webapp " + here.slot + " of " + TOTAL;
      return "<h1" + a.replace(/\sclass="[^"]*ghf-v2-dup[^"]*"/, "") + ">" + esc(t) + "</h1>";
    });
    main = main.replace(/<p\b[^>]*>\s*coming soon\s*<\/p>/gi, ""); // a repeat under a kept heading
    const nameN = esc(label(nx));
    const box = allCS ? "" :
      '<div class="cwcs" data-cwcs="' + VER + '" data-slot="' + here.slot + '" data-next="' + esc(nh) + '" data-prev="' + esc(ph) + '"' +
      ' data-next-slot="' + nx.slot + '" data-prev-slot="' + pv.slot + '" data-prev-cs="' + (isCS(pv) ? 1 : 0) + '">' +
      '<div class="cwcs-bar" role="progressbar" aria-label="Opening the next webapp" aria-valuemin="0" aria-valuemax="2" aria-valuenow="2"><i></i></div>' +
      '<p class="cwcs-t">Next: <a href="' + esc(nh) + '" data-cwcs-go="next">' + nameN + '</a> in 2 seconds</p>' +
      '<noscript><p class="cwcs-t"><a href="' + esc(nh) + '">Next webapp: ' + nameN + ' &#8250;</a></p></noscript></div>';
    main = main.replace(/<\/main>$/i, box + "</main>");
    html = html.replace(m[0], main);
    if (allCS) return new Response(html, { status: 200, headers: h });
    const css = "<style id=\"cwcs-css\">.cwcs{margin:22px 0 0}.cwcs-bar{position:relative;width:100vw;margin-left:calc(50% - 50vw);height:8px;background:rgba(30,77,69,.15);overflow:hidden}" +
      ".cwcs-bar i{position:absolute;inset:0;background:#1e4d45;transform-origin:left center;animation:cwcs 2s linear forwards}" +
      "@keyframes cwcs{from{transform:scaleX(1)}to{transform:scaleX(0)}}.cwcs-t{margin:12px 0 0;font-size:14px;letter-spacing:.04em;text-transform:none;color:#5a5a5a}.cwcs-t a{color:#1e4d45}" +
      "@media (prefers-reduced-motion:reduce){.cwcs-bar i{animation:none;transform:scaleX(.5)}}</style>" +
      "<noscript><meta http-equiv=\"refresh\" content=\"2;url=" + esc(nh) + "\"></noscript>";
    html = html.replace(/<\/head>/i, css + "</head>");
    const js = "<script>(" + client.toString() + ")();</script>";
    html = html.replace(/<\/body>/i, js + "</body>");
    return new Response(html, { status: 200, headers: h });
  }
};
// runs in the visitor's browser
function client() {
  var box = document.querySelector(".cwcs"); if (!box) return;
  var S = +box.dataset.slot, K = "cw-cs-sent", sent = null, now = Date.now(), dir = "next";
  try { sent = JSON.parse(sessionStorage.getItem(K) || "null"); } catch (e) {}
  // direction: mid-chain keep going the same way; back where a countdown sent you from -> the visitor reversed, follow them
  if (sent && sent.to === S && now - sent.at < 60000) dir = sent.dir;
  else if (sent && sent.from === S && now - sent.at < 1800000) dir = sent.dir === "next" ? "prev" : "next";
  var hops = sent && now - sent.at < 60000 ? (sent.hops || 0) : 0;
  if (hops >= 59) return; // never loop forever
  var go = dir === "prev" ? box.dataset.prev : box.dataset.next, to = +(dir === "prev" ? box.dataset.prevSlot : box.dataset.nextSlot);
  if (dir === "prev") { var a = box.querySelector("[data-cwcs-go]"); if (a) { a.href = go; a.textContent = "the previous webapp"; a.previousSibling.textContent = "Back to "; } }
  function mark(d, t) { try { sessionStorage.setItem(K, JSON.stringify({ from: S, to: t, dir: d, at: Date.now(), hops: hops + 1 })); } catch (e) {} }
  document.addEventListener("click", function (e) {
    var l = e.target && e.target.closest && e.target.closest("a[href]"); if (!l) return;
    var lab = (l.getAttribute("aria-label") || "") + " " + (l.getAttribute("rel") || "");
    if (/previous|prev/i.test(lab)) { clearTimeout(tm); mark("prev", +box.dataset.prevSlot); }
    else if (/next/i.test(lab) || l.hasAttribute("data-cwcs-go")) { clearTimeout(tm); mark(dir, to); }
  }, true);
  // "Coming soon" once: if anything other than the header still repeats it, drop the repeat
  function once() {
    var seen = 0, w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), n, extra = [];
    while ((n = w.nextNode())) if (/^\s*coming soon\s*$/i.test(n.textContent) && n.parentElement && n.parentElement.getClientRects().length) { if (seen++) extra.push(n); }
    extra.forEach(function (x) { if (x.parentElement.closest("main")) x.textContent = ""; });
  }
  setTimeout(once, 300); setTimeout(once, 1200);
  // 2 s from the moment the page started loading, not from when this script ran; the bar is synced to the same clock
  var left = Math.max(400, Math.min(2000, 2000 - (window.performance && performance.now ? performance.now() : 0)));
  var bar = box.querySelector(".cwcs-bar i"); if (bar) bar.style.animationDuration = left + "ms";
  var tm = setTimeout(function () { mark(dir, to); location.replace(go); }, left);
  addEventListener("pageshow", function (e) { if (e.persisted) { clearTimeout(tm); tm = setTimeout(function () { mark(dir, to); location.replace(go); }, 2000); } });
}
