// The Q&A Hall is now generated from this repository's static/qa/kb.json and
// static/qa/api/qa.json by the daily GitHub Actions release. The former graph
// import from the Datro repository has been retired; the public API uses the
// released JSON snapshot and no longer imports Q&A data from another project.
const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff"
  }
});

export async function onRequestPost() {
  return json({
    ok: false,
    retired: true,
    message: "The Q&A graph is released from this repository's kb.json snapshot; no external graph sync is used."
  }, 410);
}

export async function onRequestGet() {
  return json({
    retired: true,
    source: "/api/qa.json",
    message: "The Q&A API reads the dataset released by this repository."
  }, 410);
}
