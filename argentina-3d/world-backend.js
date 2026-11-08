// WorldBackend: the shared world interface (init, step, steer, getFrame, getAudio) — Patagonia world v0.2.0.
// The Wales world can implement the same class shape so both plug into one viewer later. — Cedwyn editors
export class WorldBackend {
  async init() {} step(_input) {} steer(_text) { return null; } getFrame() { return null; } getAudio() { return null; }
}
const WORDS = { dawn: 6.2, sunrise: 6.2, morning: 9, noon: 13, midday: 13, afternoon: 16, evening: 19, dusk: 20.3, sunset: 20.3, night: 22 };
export class ThreeBackend extends WorldBackend {
  constructor(ctx) { super(); this.ctx = ctx; }
  async init() { return { world: "patagonia", version: "0.2.0" }; }
  step(input = {}) { if (input.view) this.ctx.go(input.view); this.ctx.frame(); return true; }
  // steer("make it dusk, light fog") -> a validated JSON patch applied live (no reload). Unknown words are ignored, never invented.
  steer(text = "") {
    const t = String(text).toLowerCase(), patch = {};
    for (const [w, h] of Object.entries(WORDS)) if (t.includes(w)) patch.hour = h;
    const m = t.match(/\b([01]?\d|2[0-3])[:h.]?([0-5]\d)?\b/); if (m && /\d/.test(t) && !patch.hour) patch.hour = +m[1] + (m[2] ? +m[2] / 60 : 0);
    if (/\bnow\b/.test(t)) patch.hour = null;
    if (/heavy fog|thick fog/.test(t)) patch.fog = 4; else if (/fog|mist|haze/.test(t)) patch.fog = 2.2; else if (/clear/.test(t)) patch.fog = 1;
    for (const v of ["front", "quarter", "yard", "above", "heli", "ground"]) if (t.includes(v)) patch.view = v; if (/helicopter/.test(t)) patch.view = "heli";
    if ("hour" in patch) this.ctx.state.hour = patch.hour; if ("fog" in patch) this.ctx.state.fog = patch.fog;
    if ("hour" in patch || "fog" in patch) this.ctx.applySun(); if (patch.view) this.ctx.go(patch.view);
    return patch;
  }
  getFrame(type = "image/jpeg", q = 0.85) { const { renderer, scene, camera } = this.ctx; renderer.render(scene, camera); return renderer.domElement.toDataURL(type, q); }
  getAudio() { return null; } // no audio layer yet (roadmap)
}
