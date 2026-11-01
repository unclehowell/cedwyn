/* estate-3d.js v1.0.0 - the Cedwyn estate in 3D, in true metres from /_cedwyn/parcels.json (H3 cells, georeferenced plan).
   Ground = the estate outline; River Ely on the north and north-west; the 59 parcels stand as "rides" on their H3 cells.
   Overview: drag to turn, pinch/scroll to zoom (zoom right out to see the whole outline). Walk: first-person on foot
   (drag to look, WASD/arrows, on-screen stick on touch), the walk code adapted from the Terrain webapp (/terrain/app.js 1.5.2).
   three.js 0.160 from the site's own mirror. - Sion's Tab agent */
import * as THREE from '/_ext/cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';
const GROUP = { interactive: 0xc0392b, artifacts: 0x2e6da4, research: 0x7d3c98, story: 0xd68910 };
export function mount(view, d, o) {
  const t = o.t, arg = o.scope === 'argentina', coarse = matchMedia('(pointer:coarse)').matches;
  view.innerHTML = '';
  const canvas = document.createElement('canvas'); view.appendChild(canvas);
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: !coarse, powerPreference: 'high-performance' }); }
  catch (e) { view.innerHTML = '<div class="em-load">' + t('nogl') + '</div>'; return () => {}; }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, coarse ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const sky = arg ? 0xcfe0ee : 0xa9c6de; scene.background = new THREE.Color(sky); scene.fog = new THREE.Fog(sky, 1400, 4200);
  const camera = new THREE.PerspectiveCamera(55, 1, 0.5, 9000);
  scene.add(new THREE.HemisphereLight(0xf4f1e6, arg ? 0x8a7040 : 0x3a4a2a, 1.0));
  const sun = new THREE.DirectionalLight(0xffffff, 1.1); sun.position.set(-400, 900, 500); scene.add(sun);
  // world: x = east, z = south (z = -north), metres from the church
  const W = q => new THREE.Vector3(q[0], 0, -q[1]);
  const box = d.box, cx = (box[0] + box[2]) / 2, cy = (box[1] + box[3]) / 2, span = Math.max(box[2] - box[0], box[3] - box[1]);
  const disposables = [];
  function add(mesh) { scene.add(mesh); disposables.push(mesh); return mesh; }
  // surroundings
  const around = new THREE.Mesh(new THREE.PlaneGeometry(9000, 9000), new THREE.MeshLambertMaterial({ color: arg ? 0xc9b07a : 0x6f8f55 }));
  around.rotation.x = -Math.PI / 2; around.position.set(cx, -0.6, -cy); add(around);
  // the estate silhouette: raised ground
  const sh = new THREE.Shape(d.outlineM.map(q => new THREE.Vector2(q[0], q[1])));
  const eg = new THREE.ExtrudeGeometry(sh, { depth: 2.5, bevelEnabled: false }); eg.rotateX(-Math.PI / 2);
  const estate = add(new THREE.Mesh(eg, new THREE.MeshLambertMaterial({ color: arg ? 0xe2cf98 : 0x9cc46f })));
  estate.position.y = -0.6;
  const edge = add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(d.outlineM.map(q => new THREE.Vector3(q[0], 2.2, -q[1]))), new THREE.LineBasicMaterial({ color: arg ? 0x7a5a1e : 0xfbf8f1 })));
  // river ribbon
  { const pts = d.riverM.map(W), pos = [], idx = [], wdt = 24;
    for (let i = 0; i < pts.length; i++) { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dir = new THREE.Vector3().subVectors(b, a).normalize(), n = new THREE.Vector3(-dir.z, 0, dir.x).multiplyScalar(wdt / 2);
      pos.push(pts[i].x + n.x, 0.15, pts[i].z + n.z, pts[i].x - n.x, 0.15, pts[i].z - n.z); if (i) { const k = i * 2; idx.push(k - 2, k - 1, k, k - 1, k + 1, k); } }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    add(new THREE.Mesh(g, new THREE.MeshLambertMaterial({ color: 0x3f7fb3, side: THREE.DoubleSide }))); }
  // a few trees on the north wood (traced outline from the 1900 sheet) and along the river bank
  { const geo = new THREE.ConeGeometry(4, 12, 7), mat = new THREE.MeshLambertMaterial({ color: arg ? 0x6d7f3a : 0x2f5d2a }), spots = [];
    const wood = (d.traced || []).find(f => /wood/i.test(f.name));
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    if (wood) { const P = wood.coords.map(d.P), xs = P.map(q => q[0]), ys = P.map(q => q[1]);
      for (let i = 0; i < 400 && spots.length < 60; i++) { const q = [Math.min(...xs) + rnd() * (Math.max(...xs) - Math.min(...xs)), Math.min(...ys) + rnd() * (Math.max(...ys) - Math.min(...ys))]; if (inside(q, P)) spots.push(q); } }
    d.riverM.forEach((q, i) => { if (i % 3 === 0 && inside(q, d.outlineM.map(z => [z[0], z[1]]))) spots.push([q[0] + 16, q[1] - 16]); });
    const inst = new THREE.InstancedMesh(geo, mat, spots.length); const m = new THREE.Matrix4();
    spots.forEach((q, i) => { const s = 0.7 + rnd() * 0.8; m.makeScale(s, s, s); m.setPosition(q[0], 6 * s, -q[1]); inst.setMatrixAt(i, m); }); add(inst); }
  // the house (and the church on the Wales side)
  { const g = new THREE.Group(), body = new THREE.Mesh(new THREE.BoxGeometry(18, 8, 9), new THREE.MeshLambertMaterial({ color: arg ? 0xf0e2c0 : 0xe8dcc4 }));
    body.position.y = 4; g.add(body);
    const roof = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 7.5, 5, 4, 1), new THREE.MeshLambertMaterial({ color: 0x5a3a2a })); roof.rotation.y = Math.PI / 4; roof.scale.set(1.75, 1, 0.9); roof.position.y = 10.5; g.add(roof);
    g.position.copy(W(d.houseM)); add(g); add(label(arg ? t('house2') : t('house'), '#2a2016', '#fbf8f1', W(d.houseM).add(new THREE.Vector3(0, 22, 0)), 1)); }
  if (!arg) { const tower = new THREE.Mesh(new THREE.BoxGeometry(5, 14, 5), new THREE.MeshLambertMaterial({ color: 0x9a9384 })); tower.position.copy(W(d.churchM)).add(new THREE.Vector3(0, 7, 0)); add(tower); }
  // the 59 rides: an H3 hex tile, a post and a sign
  const rides = [], pickables = [];
  d.parcels.forEach(p => {
    const live = p.status === 'live' && o.href(p);
    const col = live ? (GROUP[p.group] || 0x2e6da4) : 0x9b8f7d;
    const hs = new THREE.Shape(p.hexM.map(q => new THREE.Vector2(q[0], q[1]))), hg = new THREE.ShapeGeometry(hs); hg.rotateX(-Math.PI / 2);
    const tile = add(new THREE.Mesh(hg, new THREE.MeshLambertMaterial({ color: col, transparent: true, opacity: 0.45 }))); tile.position.y = 2.3;
    const post = add(new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.8, 9, 10), new THREE.MeshLambertMaterial({ color: col })));
    const c = W(p.m); post.position.set(c.x, 6.5, c.z);
    const sign = add(label(String(p.no), '#fbf8f1', '#' + col.toString(16).padStart(6, '0'), new THREE.Vector3(c.x, 16, c.z), 0));
    const near = add(label(p.label.replace('of', t('of')) + ' · ' + (live ? o.name(p) : t('coming')) + (arg ? ' · ' + t('planned') : ''), '#2a2016', '#fbf8f1', new THREE.Vector3(c.x, 26, c.z), 1));
    near.visible = false;
    post.userData.p = p; tile.userData.p = p; pickables.push(post, tile);
    rides.push({ p, c, sign, near });
  });
  function label(text, fg, bg, pos, small) {
    const cv = document.createElement('canvas'), x = cv.getContext('2d'), fs = small ? 34 : 64; x.font = '700 ' + fs + 'px system-ui,sans-serif';
    const w = Math.ceil(x.measureText(text).width) + fs; cv.width = Math.max(w, small ? 64 : 112); cv.height = Math.round(fs * 1.7);
    x.font = '700 ' + fs + 'px system-ui,sans-serif'; x.fillStyle = bg; const r = cv.height / 2;
    x.beginPath(); x.moveTo(r, 0); x.lineTo(cv.width - r, 0); x.arc(cv.width - r, r, r, -Math.PI / 2, Math.PI / 2); x.lineTo(r, cv.height); x.arc(r, r, r, Math.PI / 2, Math.PI * 1.5); x.fill();
    x.fillStyle = fg; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, cv.width / 2, cv.height / 2 + 2);
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true })); s.renderOrder = 10;
    s.userData.aspect = cv.width / cv.height; s.position.copy(pos); return s;
  }
  function inside(q, P) { let a = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const xi = P[i][0], yi = P[i][1], xj = P[j][0], yj = P[j][1]; if ((yi > q[1]) !== (yj > q[1]) && q[0] < (xj - xi) * (q[1] - yi) / (yj - yi) + xi) a = !a; } return a; }
  // ---- UI
  const ctl = document.createElement('div'); ctl.className = 'em-ctl'; view.appendChild(ctl);
  const bWalk = mk(t('walk'), true), bWhole = mk('⤢', false); bWhole.setAttribute('aria-label', t('whole'));
  function mk(txt, wide) { const b = document.createElement('button'); b.type = 'button'; b.textContent = txt; if (wide) b.className = 'em-wide'; ctl.appendChild(b); return b; }
  const note = document.createElement('div'); note.className = 'em-note'; note.textContent = t('approx') + ' · H3 r' + d.h3.res + ' · ' + t('hint3'); view.appendChild(note);
  if (arg) { const bn = document.createElement('div'); bn.className = 'em-banner'; bn.textContent = t('plannedBanner'); view.appendChild(bn); }
  const joyEl = document.createElement('div'); joyEl.className = 'em-joy'; joyEl.innerHTML = '<i></i>'; joyEl.hidden = true; view.appendChild(joyEl); const knob = joyEl.firstChild;
  // ---- overview orbit
  const target = new THREE.Vector3(cx, 0, -cy); let az = 0.35, el_ = 0.95, dist = span * 1.25, walking = false, yaw = 0, pitch = 0;
  function place() { camera.position.set(target.x + dist * Math.cos(el_) * Math.sin(az), dist * Math.sin(el_), target.z + dist * Math.cos(el_) * Math.cos(az)); camera.lookAt(target); }
  function whole() { setWalk(false); target.set(cx, 0, -cy); az = 0.35; el_ = 0.95; dist = span * 1.25; place(); }
  bWhole.onclick = whole;
  function setWalk(on) {
    walking = on; bWalk.textContent = on ? t('fly') : t('walk'); bWalk.setAttribute('aria-pressed', String(on)); joyEl.hidden = !(on && coarse);
    if (on) { const h = W(d.houseM); camera.position.set(h.x + 10, 1.7, h.z + 40); yaw = 0; pitch = 0; }
    else { place(); }
  }
  bWalk.onclick = () => setWalk(!walking);
  const keys = {}; const kd = e => { keys[e.key.toLowerCase()] = true; }, ku = e => { keys[e.key.toLowerCase()] = false; };
  addEventListener('keydown', kd); addEventListener('keyup', ku);
  const ptrs = new Map(); let pinch = 0, moved = 0;
  canvas.style.touchAction = 'none';
  canvas.addEventListener('pointerdown', e => { ptrs.set(e.pointerId, [e.clientX, e.clientY]); moved = 0; if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = Math.hypot(a[0] - b[0], a[1] - b[1]); } });
  canvas.addEventListener('pointermove', e => {
    const prev = ptrs.get(e.pointerId); if (!prev) return; const dx = e.clientX - prev[0], dy = e.clientY - prev[1]; ptrs.set(e.pointerId, [e.clientX, e.clientY]); moved += Math.abs(dx) + Math.abs(dy);
    if (ptrs.size === 2) { const [a, b] = [...ptrs.values()], dd = Math.hypot(a[0] - b[0], a[1] - b[1]); if (pinch) zoom(pinch / dd); pinch = dd; return; }
    if (walking) { yaw -= dx * 0.005; pitch = Math.max(-1.2, Math.min(1.2, pitch - dy * 0.004)); }
    else { az -= dx * 0.006; el_ = Math.max(0.12, Math.min(1.45, el_ + dy * 0.005)); place(); }
  });
  const pup = e => { const was = ptrs.get(e.pointerId); ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch = 0; if (was && moved < 8 && e.type === 'pointerup') tap(e); };
  canvas.addEventListener('pointerup', pup); canvas.addEventListener('pointercancel', pup);
  canvas.addEventListener('wheel', e => { e.preventDefault(); zoom(e.deltaY > 0 ? 1.15 : 1 / 1.15); }, { passive: false });
  function zoom(f) { if (walking) return; dist = Math.max(40, Math.min(span * 3.2, dist * f)); place(); }
  const ray = new THREE.Raycaster(), v2 = new THREE.Vector2();
  function tap(e) { const r = canvas.getBoundingClientRect(); v2.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(v2, camera);
    const hit = ray.intersectObjects(pickables, false)[0]; if (hit) { const p = hit.object.userData.p; o.card(p); if (!walking) { target.copy(W(p.m)); dist = Math.min(dist, 260); place(); } } }
  const joy = { x: 0, y: 0, id: null };
  joyEl.addEventListener('pointerdown', e => { e.stopPropagation(); joy.id = e.pointerId; joyEl.setPointerCapture(e.pointerId); mj(e); });
  joyEl.addEventListener('pointermove', e => { if (e.pointerId === joy.id) mj(e); });
  joyEl.addEventListener('pointerup', () => { joy.id = null; joy.x = joy.y = 0; knob.style.transform = ''; });
  function mj(e) { const r = joyEl.getBoundingClientRect(); let x = (e.clientX - r.left - 60) / 50, y = (e.clientY - r.top - 60) / 50; const l = Math.hypot(x, y); if (l > 1) { x /= l; y /= l; } joy.x = x; joy.y = y; knob.style.transform = `translate(${x * 40}px,${y * 40}px)`; }
  function resize() { const w = view.clientWidth, h = view.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
  const ro = new ResizeObserver(resize); ro.observe(view); resize(); whole();
  let lastNear = null; const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    const dt = Math.min(0.05, clock.getDelta());
    if (walking) {
      const f = (keys.w || keys.arrowup ? 1 : 0) - (keys.s || keys.arrowdown ? 1 : 0) - joy.y, st = (keys.d ? 1 : 0) - (keys.a ? 1 : 0) + joy.x;
      yaw += ((keys.arrowleft ? 1 : 0) - (keys.arrowright ? 1 : 0)) * dt * 1.8; const sp = (keys.shift ? 30 : 9) * dt;
      camera.position.x += (-Math.sin(yaw) * f + Math.cos(yaw) * st) * sp; camera.position.z += (-Math.cos(yaw) * f - Math.sin(yaw) * st) * sp; camera.position.y = 1.7; camera.rotation.set(pitch, yaw, 0, 'YXZ');
      let best = null, bd = 14; rides.forEach(r => { const dd = Math.hypot(r.c.x - camera.position.x, r.c.z - camera.position.z); if (dd < bd) { bd = dd; best = r; } });
      if (best && best !== lastNear) o.card(best.p); lastNear = best;
    }
    const cam = camera.position;
    rides.forEach(r => { const dd = cam.distanceTo(r.sign.position), s = Math.max(6, Math.min(70, dd * 0.05)); r.sign.scale.set(s * r.sign.userData.aspect * 0.55, s * 0.55, 1);
      r.near.visible = dd < 320; if (r.near.visible) { const s2 = Math.max(3, Math.min(30, dd * 0.03)); r.near.scale.set(s2 * r.near.userData.aspect * 0.5, s2 * 0.5, 1); } });
    renderer.render(scene, camera);
  });
  return function dispose() {
    renderer.setAnimationLoop(null); ro.disconnect(); removeEventListener('keydown', kd); removeEventListener('keyup', ku);
    scene.traverse(x => { if (x.geometry) x.geometry.dispose(); if (x.material) { if (x.material.map) x.material.map.dispose(); x.material.dispose(); } });
    renderer.dispose(); view.innerHTML = '';
  };
}
