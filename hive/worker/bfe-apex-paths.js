// bfe-apex-paths — apex bucklerfamily.estate/<app>* -> cedwyn.bucklerfamily.estate/<app>... (301, every path, query kept).
// The apex home Worker 301s only directory paths, so files such as /hive/jobs.json or /hive/llms.txt would get the apex
// home page. Routes: bucklerfamily.estate/hive*, bucklerfamily.estate/online* (2 Nov 2026). — Sion's Tab agent
export default {
  async fetch(req) {
    const u = new URL(req.url);
    const to = "https://cedwyn.bucklerfamily.estate" + u.pathname + u.search;
    return new Response(null, { status: 301, headers: { location: to, "cache-control": "public, max-age=300", "x-bfe-apex": "1.0.0" } });
  }
};
