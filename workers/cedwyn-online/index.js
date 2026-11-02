// cedwyn-online v1.1.0 — the /online/ section of cedwyn.bucklerfamily.estate (2 Nov 2026, producer's request 03:41 GMT). — Sion's Tab agent
// Apps that are neither about Wales nor about Patagonia live at /online/<app>/. Their old section addresses
// (/wales/<app>/..., /argentina/<app>/...) answer 301 to the new one; /online/<app>/... serves the app's own files
// (same files as /<app>/, nothing copied) with the theme path handed to the shared header so "NN of 59" stays right.
// /online/ is the landing page with the Online card open. Any other /online/<x>/ answers 301 to /<x>/ (its online address).
const MOVED = ["hubspot", "cloudflare", "cyberspace"];   // neither Wales nor Patagonia: leave both halves
// 1.1.0 (2 Nov 2026, producer 05:04 GMT "common sense"): the public-body / FOI correspondence apps are not about Patagonia:
// /argentina/<id>/ answers 301 to /online/<id>/; /wales/<id>/ keeps serving them (the Wales case).
const ARG_MOVED = ["dartboard", "wdtk", "qa", "whattheydontsay", "authorities", "forensic", "fcg", "watchtower", "review", "email", "emails", "projects"];
const SERVED = MOVED.concat(ARG_MOVED);
const VER = "1.1.0";
const H = { "x-cedwyn-online": VER };
function redirect(to, status = 301) { return new Response(null, { status, headers: { ...H, location: to, "cache-control": "public, max-age=300" } }); }
async function origin(url, req) {
  return fetch(new Request(url, { method: req.method === "HEAD" ? "HEAD" : "GET", headers: req.headers, redirect: "manual" }));
}
function htmlHeaders(r) { const h = new Headers(r.headers); h.delete("content-length"); h.delete("etag"); h.set("x-cedwyn-online", VER); h.set("cache-control", "public, max-age=60"); return h; }
export default {
  async fetch(req) {
    const u = new URL(req.url); const p = u.pathname;
    let m = /^\/(wales|argentina)\/([^\/]+)(\/.*)?$/.exec(p);
    if (m) { const id = m[2].toLowerCase(); if (MOVED.includes(id) || (m[1] === "argentina" && ARG_MOVED.includes(id))) return redirect("/online/" + m[2].toLowerCase() + (m[3] || "/") + u.search); return fetch(req); }
    if (p === "/online" || p === "/online/" || p === "/online/index.html") {
      if (p !== "/online/") return redirect("/online/" + u.search);
      const r = await origin(new URL("/" + u.search, u.origin), req);
      if (!(r.headers.get("content-type") || "").includes("text/html")) return r;
      let t = await r.text();
      // the Online card's apps open at their /online/ addresses here; the card opens on arrival
      t = t.replace(/(<dialog[^>]*id="modal-online"[\s\S]*?<\/dialog>)/, (d) => d.replace(/href="\/([a-z0-9-]+)\/"/g, (x, id) => SERVED.includes(id) ? `href="/online/${id}/"` : x));
      t = t.replace(/<title>[^<]*<\/title>/, "<title>Online · Cedwyn Estate</title>");
      t = t.replace("</body>", '<script>(function(){function o(){var d=document.getElementById("modal-online");if(!d)return;try{if(typeof d.showModal==="function"){if(!d.open)d.showModal()}else d.setAttribute("open","")}catch(e){}}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",o);else o();})();</script></body>');
      return new Response(t, { status: r.status, headers: htmlHeaders(r) });
    }
    m = /^\/online\/([^\/]+)(\/.*)?$/.exec(p);
    if (!m) return fetch(req);
    const app = m[1].toLowerCase(), rest = m[2] || "";
    if (!SERVED.includes(app)) {   // not ours: whatever the site serves at this address (another app's own /online/ page), else its unprefixed address
      const o = await fetch(req);
      if (o.status !== 404) return o;
      return redirect("/" + m[1] + rest + u.search);
    }
    if (!rest) return redirect("/online/" + app + "/" + u.search);
    const lp = "/" + app + rest;
    const r = await origin(new URL(lp + u.search, u.origin), req);
    if (r.status >= 300 && r.status < 400) { const loc = r.headers.get("location") || ""; const mm = /^(?:https:\/\/cedwyn\.bucklerfamily\.estate)?\/([a-z0-9-]+)(\/.*|$)/.exec(loc); const l2 = mm && mm[1] === app ? "/online/" + app + (mm[2] || "/") : loc; return redirect(l2, r.status); }
    if (!(r.headers.get("content-type") || "").includes("text/html")) { const h = new Headers(r.headers); h.set("x-cedwyn-online", VER); return new Response(r.body, { status: r.status, headers: h }); }
    let t = await r.text();
    const lpJs = '<script>window.__cedwynLP=' + JSON.stringify(lp) + ';window.__cedwynSec="";</script>';
    const rt = /<script\b[^>]*src="\/_cedwyn\/runtime\.js[^"]*"[^>]*><\/script>/.exec(t);
    if (rt) { const tag = rt[0].includes("data-theme=") ? rt[0] : rt[0].replace("<script", '<script data-theme="' + app + '"'); t = t.replace(rt[0], tag + lpJs); }
    else t = t.replace(/<head([^>]*)>/i, (x) => x + lpJs);
    t = t.replace(/<html\b([^>]*)>/i, (x, a) => /data-cedwyn-scope=/.test(a) ? x : "<html" + a + ' data-cedwyn-scope="online">');
    return new Response(t, { status: r.status, headers: htmlHeaders(r) });
  }
};
