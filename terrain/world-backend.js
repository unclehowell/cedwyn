// WorldBackend: one interface, two engines. ThreeBackend drives the real-terrain scene today;
// Genie4Backend is a stub behind a feature flag until world-model access exists. 
export const FLAGS = { genie4: false, genieProxy: '/api/genie4', cutscenes: 'data/cutscenes.json' };

/** @interface WorldBackend  init(), step(input), steer(text), getFrame(), getAudio() */
export class ThreeBackend {
  constructor(ctx) { this.ctx = ctx; this.name = 'three'; }
  async init() { return true; }
  step(input = {}) { if (input.patch) this.ctx.applyPatch(input.patch); return this.ctx.state; }
  async steer(text) { const p = this.ctx.parseSteer(text); this.ctx.applyPatch(p); return p; }
  getFrame() { this.ctx.renderer.render(this.ctx.scene, this.ctx.camera); return this.ctx.renderer.domElement.toDataURL('image/jpeg', 0.85); }
  getAudio() { return null; }
}

export class Genie4Backend {
  // Calls a Cloudflare Worker proxy that holds the key server-side, rate-limits per IP and caches.
  // Seeded with a still rendered from the real-terrain scene so the generated world stays on the real place.
  constructor(ctx, fallback) { this.ctx = ctx; this.fallback = fallback; this.name = 'genie4'; this.session = null; }
  async init() {
    if (!FLAGS.genie4) return false;
    try {
      const seed = this.fallback.getFrame();
      const r = await fetch(FLAGS.genieProxy + '/session', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ seed, place: 'Llandough, Vale of Glamorgan', state: this.ctx.state }) });
      if (!r.ok) throw new Error('proxy ' + r.status); this.session = await r.json(); return true;
    } catch (e) { console.warn('Genie4 unavailable, using pre-rendered cutscenes or the 3D scene', e); return false; }
  }
  step(input) { return this.fallback.step(input); }
  async steer(text) { return this.fallback.steer(text); }
  getFrame() { return this.fallback.getFrame(); }
  getAudio() { return null; }
}

export function createBackend(ctx) {
  const three = new ThreeBackend(ctx);
  if (!FLAGS.genie4) return three;
  const g = new Genie4Backend(ctx, three);
  return { name: 'auto', init: async () => (await g.init()) || three.init(), step: i => g.step(i), steer: t => g.steer(t), getFrame: () => g.getFrame(), getAudio: () => g.getAudio() };
}
