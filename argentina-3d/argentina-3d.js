// Great House II · Patagonia — 3D world (separate from the Wales world). v0.5.0 (landscape: real terrain, sea and buildings round the replica site)
// Tŷ Mawr reconstructed from the 1974 measured survey and the family-album photographs shown on the Patagonia pages.
// Every dimension marked GUESS in SOURCES (see sources.json) is a best guess, not evidence. — Cedwyn editors
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Sky } from "./vendor/Sky.js?v=0.160.0";
import { GLTFLoader } from "./vendor/GLTFLoader.js?v=0.160.0";
import { ThreeBackend } from "./world-backend.js?v=0.2.0";

const $ = id => document.getElementById(id);
const Q = new URLSearchParams(location.search);
const coarse = matchMedia("(pointer:coarse)").matches || Math.min(screen.width, screen.height) < 600;
const LOW = coarse || Q.has("low");
// v0.5.0: the origin is the replica house site the Chubut H3 2D map gives (data/landscape.json): Tŷ Mawr's offset from the Wales estate
// centroid applied to the Chubut centroid, so the estate keeps its distance to the sea. x = metres east, z = metres south.
const LAT = -42.825342, LON = -64.946342, TZ = -3;
const canvas = $("c"), stage = $("stage");

// ---------- renderer ----------
let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas, antialias: !LOW, powerPreference: "high-performance", preserveDrawingBuffer: Q.has("shot"), logarithmicDepthBuffer: true }); }
catch (e) { $("st").textContent = "The 3D view needs WebGL, which this browser has turned off."; throw e; }
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, LOW ? 1.5 : 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 0.62;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 1, 0.3, 120000);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; controls.dampingFactor = 0.08; controls.maxPolarAngle = Math.PI * 0.485;
controls.minDistance = 4; controls.maxDistance = 16000;
function resize() { const w = stage.clientWidth, h = stage.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.fov = w < h ? 62 : 48; camera.updateProjectionMatrix(); }
addEventListener("resize", resize); new ResizeObserver(resize).observe(stage);

// ---------- sun from the real date and place ----------
function sunPos(date) { // NOAA-style low-precision solar position; azimuth from north, clockwise
  const rad = Math.PI / 180, d = date.getTime() / 864e5 - 10957.5;
  const g = (357.529 + 0.98560028 * d) * rad, q = 280.459 + 0.98564736 * d;
  const L = (q + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * rad, e = (23.439 - 3.6e-7 * d) * rad;
  const ra = Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L)), dec = Math.asin(Math.sin(e) * Math.sin(L));
  const gmst = (18.697374558 + 24.06570982441908 * d) % 24, H = (gmst * 15 + LON) * rad - ra, la = LAT * rad;
  const el = Math.asin(Math.sin(la) * Math.sin(dec) + Math.cos(la) * Math.cos(dec) * Math.cos(H));
  const az = Math.atan2(-Math.sin(H), Math.tan(dec) * Math.cos(la) - Math.sin(la) * Math.cos(H));
  return { el, az };
}
const sky = new Sky(); sky.scale.setScalar(100000); scene.add(sky);
const su = sky.material.uniforms; su.turbidity.value = 3.2; su.rayleigh.value = 1.1; su.mieCoefficient.value = 0.004; su.mieDirectionalG.value = 0.82;
const sunL = new THREE.DirectionalLight(0xfff3e0, 3.2); sunL.castShadow = true;
sunL.shadow.mapSize.set(LOW ? 1024 : 2048, LOW ? 1024 : 2048); sunL.shadow.bias = -0.0004; sunL.shadow.normalBias = 0.03;
Object.assign(sunL.shadow.camera, { left: -80, right: 80, top: 80, bottom: -80, near: 1, far: 420 });
scene.add(sunL, sunL.target);
const hemi = new THREE.HemisphereLight(0xbcd3ec, 0x8a7656, 0.55); scene.add(hemi);
scene.fog = new THREE.FogExp2(0xc9d6e2, 0.00004); // v0.5.0: light haze only, so the coast and the town stay in view
const pmrem = new THREE.PMREMGenerator(renderer); let envRT = null;
const sunDir = new THREE.Vector3();
const state = { hour: null, fog: 1, now: true };
function localDateAt(hour) { const n = new Date(); const utc = Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate()) + (hour - TZ) * 36e5; return new Date(utc); }
function madrynHourNow() { const n = new Date(); return ((n.getUTCHours() + n.getUTCMinutes() / 60 + TZ) + 24) % 24; }
function applySun() {
  let h = state.hour == null ? madrynHourNow() : state.hour, p = sunPos(localDateAt(h));
  if (state.hour == null && p.el < 0.06) { h = 16; state.hour = 16; p = sunPos(localDateAt(16)); $("night").hidden = false; }
  const el = Math.max(p.el, -0.05);
  sunDir.set(Math.cos(el) * Math.sin(p.az), Math.sin(el), -Math.cos(el) * Math.cos(p.az)).normalize();
  su.sunPosition.value.copy(sunDir);
  sunL.position.copy(sunDir).multiplyScalar(150); sunL.target.position.set(0, 0, 0);
  const day = THREE.MathUtils.smoothstep(el, -0.02, 0.35);
  sunL.intensity = 3.4 * day; sunL.color.setHSL(0.09, 0.9 - 0.75 * day, 0.62 + 0.3 * day);
  hemi.intensity = 0.15 + 0.5 * THREE.MathUtils.smoothstep(el, -0.1, 0.4);
  renderer.toneMappingExposure = 0.42 + 0.22 * day;
  const fogc = new THREE.Color().setHSL(0.58, 0.28, 0.42 + 0.38 * day); if (day < 0.5) fogc.lerp(new THREE.Color(0xd9a37a), (0.5 - day) * 0.8);
  scene.fog.color.copy(fogc); scene.fog.density = 0.000032 * state.fog;
  // image-based light from the same sky
  clearTimeout(applySun.t); applySun.t = setTimeout(() => { const tmp = new THREE.Scene(); const s2 = new Sky(); s2.scale.setScalar(1000); Object.keys(su).forEach(k => s2.material.uniforms[k].value = su[k].value); tmp.add(s2);
    const rt = pmrem.fromScene(tmp, 0, 1, 2000); scene.environment = rt.texture; if (envRT) envRT.dispose(); envRT = rt; s2.geometry.dispose(); s2.material.dispose(); }, envRT ? 150 : 0);
  $("hr").value = Math.round(h * 4) / 4; $("hrv").textContent = String(Math.floor(h)).padStart(2, "0") + ":" + String(Math.round((h % 1) * 60)).padStart(2, "0");
}

// ---------- procedural + photo-derived textures ----------
const tl = new THREE.TextureLoader(); const maxAniso = renderer.capabilities.getMaxAnisotropy();
function tex(url, srgb = true, rep = 1) { const t = tl.load(url); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = Math.min(8, maxAniso); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.repeat.set(rep, rep); return t; }
function canvasTex(size, draw, srgb = true) { const c = document.createElement("canvas"); c.width = c.height = size; const g = c.getContext("2d"); draw(g, size); const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = Math.min(8, maxAniso); if (srgb) t.colorSpace = THREE.SRGBColorSpace; return t; }
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
// slate: course pattern drawn in the colour sampled from album photo 098 (print cast removed)
const slateTex = canvasTex(512, (g, s) => { g.fillStyle = "#33373b"; g.fillRect(0, 0, s, s); const rows = 16, rh = s / rows;
  for (let r = 0; r < rows; r++) { let x = (r % 2) * -16; while (x < s) { const w = 26 + rnd() * 14, l = 52 + rnd() * 22; g.fillStyle = `hsl(${200 + rnd() * 30},${3 + rnd() * 5}%,${l * 0.42}%)`; g.fillRect(x + 1, r * rh + 1, w - 2, rh - 1.5); g.fillStyle = "rgba(0,0,0,.45)"; g.fillRect(x + 1, r * rh + rh - 3, w - 2, 3); x += w; } } });
const slateN = canvasTex(512, (g, s) => { g.fillStyle = "rgb(128,128,255)"; g.fillRect(0, 0, s, s); const rh = s / 16; for (let r = 0; r < 16; r++) { g.fillStyle = "rgb(128,70,230)"; g.fillRect(0, r * rh + rh - 3, s, 3); g.fillStyle = "rgb(128,175,240)"; g.fillRect(0, r * rh, s, 2); } }, false);
const soilTex = canvasTex(512, (g, s) => { g.fillStyle = "#9c8a62"; g.fillRect(0, 0, s, s);
  for (let i = 0; i < 9000; i++) { const x = rnd() * s, y = rnd() * s, r = rnd() * 1.8 + 0.3; g.fillStyle = `hsla(${30 + rnd() * 18},${12 + rnd() * 22}%,${38 + rnd() * 34}%,${0.35 + rnd() * 0.5})`; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
  for (let i = 0; i < 1400; i++) { const x = rnd() * s, y = rnd() * s, a = rnd() * 6.3, l = 3 + rnd() * 9; g.strokeStyle = `hsla(${40 + rnd() * 12},${30 + rnd() * 25}%,${52 + rnd() * 22}%,.55)`; g.lineWidth = 0.7; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); } });
const macroTex = canvasTex(256, (g, s) => { g.fillStyle = "#808080"; g.fillRect(0, 0, s, s);
  for (let i = 0; i < 260; i++) { const x = rnd() * s, y = rnd() * s, r = 6 + rnd() * 30, v = 80 + rnd() * 100; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${v},${v * (0.95 + rnd() * 0.1)},${v * 0.8},.5)`); gr.addColorStop(1, "rgba(128,128,128,0)"); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); } }, false);
const gravelTex = canvasTex(256, (g, s) => { g.fillStyle = "#857a68"; g.fillRect(0, 0, s, s); for (let i = 0; i < 6000; i++) { g.fillStyle = `hsl(${28 + rnd() * 16},${8 + rnd() * 12}%,${30 + rnd() * 36}%)`; g.fillRect(rnd() * s, rnd() * s, 1 + rnd() * 2.2, 1 + rnd() * 2); } });
const lawnTex = canvasTex(256, (g, s) => { g.fillStyle = "#58703a"; g.fillRect(0, 0, s, s); for (let i = 0; i < 7000; i++) { g.fillStyle = `hsl(${78 + rnd() * 22},${30 + rnd() * 20}%,${22 + rnd() * 20}%)`; g.fillRect(rnd() * s, rnd() * s, 1, 2 + rnd() * 3); } });
const timberTex = canvasTex(256, (g, s) => { g.fillStyle = "#4a3a30"; g.fillRect(0, 0, s, s); for (let i = 0; i < 140; i++) { g.strokeStyle = `rgba(${20 + rnd() * 30},${14 + rnd() * 20},${10 + rnd() * 14},.5)`; g.lineWidth = 1 + rnd() * 2; g.beginPath(); const x = rnd() * s; g.moveTo(x, 0); g.bezierCurveTo(x + rnd() * 6, s * .3, x - rnd() * 6, s * .6, x + rnd() * 4, s); g.stroke(); } });

const M = {
  lime: new THREE.MeshStandardMaterial({ map: tex("tex/limewash.jpg?v=1"), normalMap: tex("tex/limewash_n.jpg?v=1", false), normalScale: new THREE.Vector2(0.5, 0.5), roughness: 0.93 }),
  stone: new THREE.MeshStandardMaterial({ map: tex("tex/stone.jpg?v=1"), normalMap: tex("tex/stone_n.jpg?v=1", false), normalScale: new THREE.Vector2(1.2, 1.2), roughness: 0.95, color: 0xffffff }),
  stoneLime: new THREE.MeshStandardMaterial({ map: tex("tex/stone.jpg?v=1"), normalMap: tex("tex/stone_n.jpg?v=1", false), color: 0xf2ece2, roughness: 0.95 }),
  slate: new THREE.MeshStandardMaterial({ map: slateTex, normalMap: slateN, roughness: 0.62, metalness: 0.02, envMapIntensity: 0.9 }),
  ridge: new THREE.MeshStandardMaterial({ color: 0x3a3d40, roughness: 0.7 }),
  pantile: new THREE.MeshStandardMaterial({ color: 0x9a4b32, roughness: 0.8 }),
  frame: new THREE.MeshStandardMaterial({ color: 0x4a3a33, roughness: 0.6 }),
  glass: new THREE.MeshStandardMaterial({ color: 0x12181c, roughness: 0.04, metalness: 0.1, envMapIntensity: 1.6 }),
  door: new THREE.MeshStandardMaterial({ color: 0x2e4a33, roughness: 0.55 }),
  timber: new THREE.MeshStandardMaterial({ map: timberTex, roughness: 0.8 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x14110f, roughness: 1 }),
  pot: new THREE.MeshStandardMaterial({ color: 0x9b5a3c, roughness: 0.85 }),
  sill: new THREE.MeshStandardMaterial({ color: 0xb8b0a2, roughness: 0.9 }),
  gate: new THREE.MeshStandardMaterial({ color: 0x8c8c86, roughness: 0.7 }),
};
const UV_SCALE = { lime: 3.4, stone: 2.6, stoneLime: 2.6, slate: 3.2, timber: 1.2 };

// ---------- geometry buckets (merged per material = few draw calls) ----------
const buckets = {};
function boxUV(geo, scale) { const p = geo.attributes.position, n = geo.attributes.normal, uv = geo.attributes.uv; for (let i = 0; i < p.count; i++) { const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i)); let u, v; if (ay >= ax && ay >= az) { u = p.getX(i); v = p.getZ(i); } else if (ax >= az) { u = p.getZ(i); v = p.getY(i); } else { u = p.getX(i); v = p.getY(i); } uv.setXY(i, u / scale, v / scale); } uv.needsUpdate = true; return geo; }
function put(geo, mat, m4) { geo = geo.index ? geo.toNonIndexed() : geo; if (m4) geo.applyMatrix4(m4); geo.deleteAttribute && ["color"].forEach(a => geo.attributes[a] && geo.deleteAttribute(a)); if (UV_SCALE[mat]) boxUV(geo, UV_SCALE[mat]); (buckets[mat] ||= []).push(geo); }
const mtx = (x, y, z, ry = 0, rx = 0, rz = 0) => new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz, "YXZ")), new THREE.Vector3(1, 1, 1));
const box = (w, h, d, mat, x, y, z, ry = 0, rx = 0, rz = 0) => put(new THREE.BoxGeometry(w, h, d), mat, mtx(x, y, z, ry, rx, rz));
function merge(geos) { let n = 0; geos.forEach(g => n += g.attributes.position.count); const P = new Float32Array(n * 3), N = new Float32Array(n * 3), U = new Float32Array(n * 2); let o = 0; geos.forEach(g => { P.set(g.attributes.position.array, o * 3); N.set(g.attributes.normal.array, o * 3); U.set(g.attributes.uv.array, o * 2); o += g.attributes.position.count; }); const out = new THREE.BufferGeometry(); out.setAttribute("position", new THREE.BufferAttribute(P, 3)); out.setAttribute("normal", new THREE.BufferAttribute(N, 3)); out.setAttribute("uv", new THREE.BufferAttribute(U, 2)); return out; }

// A gabled range: walls+gables as one extruded section, two roof slabs, ridge. Local axes: length along x, front faces +z.
function range(o) {
  const { x, z, ry = 0, len, dep, eave, pitch, wall = "lime", roof = "slate", over = 0.35, verge = 0.15 } = o;
  const rise = dep / 2 * Math.tan(pitch * Math.PI / 180), ridgeY = eave + rise;
  const sh = new THREE.Shape(); sh.moveTo(-dep / 2, 0); sh.lineTo(dep / 2, 0); sh.lineTo(dep / 2, eave); sh.lineTo(0, ridgeY); sh.lineTo(-dep / 2, eave); sh.closePath();
  const g = new THREE.ExtrudeGeometry(sh, { depth: len, bevelEnabled: false }); g.translate(0, 0, -len / 2); g.rotateY(Math.PI / 2); // section in yz, length along x
  const base = mtx(x, 0, z, ry); put(g, wall, base);
  const Ls = Math.hypot(dep / 2, rise), slope = Ls + over, a = Math.atan2(rise, dep / 2), c = slope / 2;
  for (const s of [1, -1]) { const cz = s * c * Math.cos(a), cy = ridgeY - c * Math.sin(a) + 0.07 / Math.cos(a);
    put(new THREE.BoxGeometry(len + verge * 2, 0.11, slope), roof, base.clone().multiply(mtx(0, cy, cz, 0, -s * a))); }
  put(new THREE.CylinderGeometry(0.13, 0.13, len + verge * 2, 8, 1), roof === "pantile" ? "pantile" : "ridge", base.clone().multiply(mtx(0, ridgeY + 0.08, 0, 0, 0, Math.PI / 2)));
  skirt(base, len, dep);
  return { ridgeY, base };
}
function skirt(base, len, dep) { const g = new THREE.PlaneGeometry(len + 2.4, dep + 2.4); g.rotateX(-Math.PI / 2); g.applyMatrix4(base.clone().multiply(mtx(0, 0.045, 0))); skirts.push(g); }
// casement window (dark frames, mullion + transom, as album photo 098), placed on a wall face; local frame m
function windowAt(m, w, h, lights = 2) {
  const t = 0.07, d = 0.08; put(new THREE.PlaneGeometry(w, h), "glass", m.clone().multiply(mtx(0, 0, 0.005)));
  for (const [bw, bh, bx, by] of [[w + t, t, 0, h / 2], [w + t, t, 0, -h / 2], [t, h, -w / 2, 0], [t, h, w / 2, 0], [w, t * 0.7, 0, h * 0.22]]) put(new THREE.BoxGeometry(bw, bh, d), "frame", m.clone().multiply(mtx(bx, by, d / 2)));
  for (let i = 1; i < lights; i++) put(new THREE.BoxGeometry(t * 0.7, h, d), "frame", m.clone().multiply(mtx(-w / 2 + w * i / lights, 0, d / 2)));
  put(new THREE.BoxGeometry(w + 0.18, 0.07, 0.16), "sill", m.clone().multiply(mtx(0, -h / 2 - 0.05, 0.07)));
}
function doorAt(m, w, h, mat = "door") { put(new THREE.BoxGeometry(w, h, 0.06), mat, m.clone().multiply(mtx(0, h / 2, 0.03))); for (const [bw, bh, bx, by] of [[w + 0.14, 0.1, 0, h + 0.05], [0.08, h, -w / 2 - 0.03, h / 2], [0.08, h, w / 2 + 0.03, h / 2]]) put(new THREE.BoxGeometry(bw, bh, 0.1), "frame", m.clone().multiply(mtx(bx, by, 0.05))); }
function chimney(m, x, y0, top, w = 1.1, d = 0.75) { put(new THREE.BoxGeometry(w, top - y0, d), "stone", m.clone().multiply(mtx(x, (top + y0) / 2, 0))); put(new THREE.BoxGeometry(w + 0.16, 0.14, d + 0.16), "sill", m.clone().multiply(mtx(x, top + 0.02, 0))); for (const px of [-0.22, 0.22]) put(new THREE.CylinderGeometry(0.12, 0.14, 0.5, 10), "pot", m.clone().multiply(mtx(x + px, top + 0.33, 0))); }
const picks = [], skirts = [];
const aoTex = canvasTex(128, (g, s) => { const id = g.createImageData(s, s); for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) { const dx = Math.max(0, Math.abs(x - s / 2 + 0.5) / (s / 2) - 0.0), dy = Math.abs(y - s / 2 + 0.5) / (s / 2); const e = Math.max(dx, dy); const a = Math.max(0, 1 - Math.max(0, e - 0.72) / 0.28); const i = (y * s + x) * 4; id.data[i] = id.data[i + 1] = id.data[i + 2] = 0; id.data[i + 3] = Math.pow(a, 1.6) * 150; } g.putImageData(id, 0, 0); });
function pick(name, basis, x, y, z, w, h, d, ry = 0) { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshBasicMaterial({ visible: false })); b.position.set(x, y, z); b.rotation.y = ry; b.userData = { name, basis }; picks.push(b); }

// ================= THE FARM =================
// House footprint from the 1974 measured survey (ground plan, scale bar 5 m): main range 15.2 x 6.0 m, long axis east-west,
// north wing 8.6 x 6.5 m behind the west/centre, later additions on the east gable. Local +z = the survey's south front.
// ---------- Tŷ Mawr group, rebuilt v0.2.0 from three reference photographs (aerial from the south-east, the house front, the stables seen from the yard) ----------
// layout in metres, x east, z south, front of the house to the south as in the photographs; geometry also in tymawr-geometry.json
const pantTex = canvasTex(256, (g, s) => { const cols = 8, rows = 7, cw = s / cols, rh = s / rows; g.fillStyle = "#8e4630"; g.fillRect(0, 0, s, s);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const x = c * cw, y = r * rh, h = 14 + rnd() * 10, l = 30 + rnd() * 9;
    const gr = g.createLinearGradient(x, 0, x + cw, 0); gr.addColorStop(0, `hsl(${h},55%,${l - 13}%)`); gr.addColorStop(0.35, `hsl(${h},52%,${l + 6}%)`); gr.addColorStop(0.62, `hsl(${h},55%,${l - 3}%)`); gr.addColorStop(0.8, `hsl(${h},58%,${l - 16}%)`); gr.addColorStop(1, `hsl(${h},55%,${l - 8}%)`);
    g.fillStyle = gr; g.fillRect(x, y, cw, rh); g.fillStyle = "rgba(20,8,4,.45)"; g.fillRect(x, y + rh - 3, cw, 3);
    for (let i = 0; i < 26; i++) { g.fillStyle = `rgba(${60 + rnd() * 60},${70 + rnd() * 50},${40 + rnd() * 30},${0.08 + rnd() * 0.18})`; g.fillRect(x + rnd() * cw, y + rnd() * rh, 1 + rnd() * 3, 1 + rnd() * 2); } } });
const pantN = canvasTex(256, (g, s) => { const cols = 8, rows = 7, cw = s / cols, rh = s / rows; for (let c = 0; c < cols; c++) { const gr = g.createLinearGradient(c * cw, 0, c * cw + cw, 0); gr.addColorStop(0, "rgb(70,128,255)"); gr.addColorStop(0.35, "rgb(128,128,255)"); gr.addColorStop(0.7, "rgb(190,128,255)"); gr.addColorStop(1, "rgb(100,128,255)"); g.fillStyle = gr; g.fillRect(c * cw, 0, cw, s); }
  for (let r = 0; r < rows; r++) { g.fillStyle = "rgb(128,60,240)"; g.fillRect(0, r * rh + rh - 3, s, 3); } }, false);
const brickTex = canvasTex(256, (g, s) => { g.fillStyle = "#c9bfae"; g.fillRect(0, 0, s, s); const rows = 16, rh = s / rows, bw = s / 4;
  for (let r = 0; r < rows; r++) for (let c = -1; c < 5; c++) { const x = c * bw + (r % 2) * bw / 2; g.fillStyle = `hsl(${8 + rnd() * 10},${48 + rnd() * 16}%,${30 + rnd() * 12}%)`; g.fillRect(x + 2, r * rh + 2, bw - 4, rh - 4); } });
M.pantile = new THREE.MeshStandardMaterial({ map: pantTex, normalMap: pantN, normalScale: new THREE.Vector2(1.4, 1.4), roughness: 0.78 }); UV_SCALE.pantile = 2.4;
M.brick = new THREE.MeshStandardMaterial({ map: brickTex, roughness: 0.9 }); UV_SCALE.brick = 1.0;
M.green = new THREE.MeshStandardMaterial({ color: 0x35603a, roughness: 0.5 });
M.dressed = new THREE.MeshStandardMaterial({ map: tex("tex/stone.jpg?v=1"), normalMap: tex("tex/stone_n.jpg?v=1", false), normalScale: new THREE.Vector2(0.8, 0.8), color: 0xd9cdb8, roughness: 0.9 }); UV_SCALE.dressed = 1.6;
M.leaf = new THREE.MeshStandardMaterial({ color: 0x4f6a2e, roughness: 0.95 }); M.bark = new THREE.MeshStandardMaterial({ color: 0x5a4c3e, roughness: 1 });
function chim(m, x, y0, top, w, d, mat = "stone") { put(new THREE.BoxGeometry(w, top - y0, d), mat, m.clone().multiply(mtx(x, (top + y0) / 2, 0))); put(new THREE.BoxGeometry(w + 0.14, 0.12, d + 0.14), mat === "brick" ? "brick" : "sill", m.clone().multiply(mtx(x, top + 0.03, 0))); for (const px of (w > 0.9 ? [-0.2, 0.2] : [0])) put(new THREE.CylinderGeometry(0.11, 0.13, 0.42, 10), "pot", m.clone().multiply(mtx(x + px, top + 0.3, 0))); }
function gabledPorch(m, w, d, eave, pitch, wall, doorW, doorH, doorMat) { // projecting gabled porch on a wall face; local z out of the wall
  const rise = w / 2 * Math.tan(pitch * Math.PI / 180), ry = eave + rise; const sh = new THREE.Shape(); sh.moveTo(-w / 2, 0); sh.lineTo(w / 2, 0); sh.lineTo(w / 2, eave); sh.lineTo(0, ry); sh.lineTo(-w / 2, eave); sh.closePath();
  put(new THREE.ExtrudeGeometry(sh, { depth: d, bevelEnabled: false }), wall, m.clone());
  const L = Math.hypot(w / 2, rise) + 0.25, a = Math.atan2(rise, w / 2);
  for (const s of [1, -1]) put(new THREE.BoxGeometry(L, 0.1, d + 0.3), "slate", m.clone().multiply(mtx(s * (L / 2) * Math.cos(a), ry - (L / 2) * Math.sin(a) + 0.07, d / 2 + 0.1, 0, 0, s * -a)));
  put(new THREE.CylinderGeometry(0.1, 0.1, d + 0.3, 8), "ridge", m.clone().multiply(mtx(0, ry + 0.07, d / 2 + 0.1, 0, Math.PI / 2)));
  doorAt(m.clone().multiply(mtx(0, 0, d + 0.01)), doorW, doorH, doorMat);
}
function dsWall(x1, z1, x2, z2, h = 1.25, t = 0.62, gaps = []) { // dry-stone wall: rubble body, battered, with an upright-stone coping
  const L = Math.hypot(x2 - x1, z2 - z1), ry = -Math.atan2(z2 - z1, x2 - x1), base = mtx((x1 + x2) / 2, 0, (z1 + z2) / 2, ry);
  let segs = [[-L / 2, L / 2]]; for (const [a, b] of gaps) segs = segs.flatMap(([s, e]) => (b <= s || a >= e) ? [[s, e]] : [[s, a], [b, e]].filter(([p, q]) => q - p > 0.3));
  for (const [s, e] of segs) { const l = e - s, cx = (s + e) / 2; const g = new THREE.BoxGeometry(l, h, t, 1, 1, 1); const p = g.attributes.position; for (let i = 0; i < p.count; i++) if (p.getY(i) > 0) p.setZ(i, p.getZ(i) * 0.72); put(g, "stone", base.clone().multiply(mtx(cx, h / 2, 0)));
    for (let u = s + 0.12; u < e - 0.1; u += 0.2 + rnd() * 0.06) put(new THREE.BoxGeometry(0.1 + rnd() * 0.06, 0.26 + rnd() * 0.1, t * 0.62), "stone", base.clone().multiply(mtx(cx - l / 2 + (u - s), h + 0.1, 0, 0, 0, (rnd() - 0.5) * 0.25))); }
}
function gravel(x1, x2, z1, z2) { const g = new THREE.PlaneGeometry(x2 - x1, z2 - z1); g.rotateX(-Math.PI / 2); put(g, "gravel", mtx((x1 + x2) / 2, 0.035, (z1 + z2) / 2)); }
function fieldGate(x, z, w = 3.4, ry = 0) { const m = mtx(x, 0, z, ry); for (const y of [0.35, 0.65, 0.95, 1.2]) put(new THREE.BoxGeometry(w, 0.08, 0.06), "sill", m.clone().multiply(mtx(0, y, 0))); for (const px of [-w / 2, w / 2]) put(new THREE.BoxGeometry(0.14, 1.35, 0.12), "sill", m.clone().multiply(mtx(px, 0.67, 0))); put(new THREE.BoxGeometry(0.06, 1.0, 0.05), "sill", m.clone().multiply(mtx(0, 0.75, 0, 0, 0, 0.62))); }
function farm() {
  // the house: whitewashed two-storey range, ridge east-west, slate about 40 degrees (photograph 2)
  const H = range({ x: 0, z: 0, len: 11.0, dep: 6.2, eave: 5.0, pitch: 40, over: 0.3, verge: 0.12 });
  const F = mtx(0, 0, 3.1);
  for (const x of [-3.3, 0.6, 3.9]) windowAt(F.clone().multiply(mtx(x, 3.95, 0)), 0.95, 1.05, 2);
  windowAt(F.clone().multiply(mtx(-2.9, 1.55, 0)), 1.3, 1.25, 3); windowAt(F.clone().multiply(mtx(4.0, 1.55, 0)), 1.2, 1.2, 2);
  gabledPorch(F.clone().multiply(mtx(1.0, 0, 0)), 2.1, 1.8, 2.4, 50, "lime", 0.95, 2.05, "green");
  const B = mtx(0, 0, -3.1, Math.PI); for (const x of [-2.5, 2.8]) { windowAt(B.clone().multiply(mtx(x, 1.6, 0)), 0.9, 1.0, 2); windowAt(B.clone().multiply(mtx(x, 3.95, 0)), 0.8, 0.9, 2); }
  chim(H.base, 0.2, 6.0, H.ridgeY + 1.0, 1.0, 0.7, "stone");            // middle stack (stone)
  chim(H.base, 5.15, 6.0, H.ridgeY + 1.1, 0.75, 0.65, "brick");         // east gable stack, red brick
  // stone gable-end bay at the west end: a cross-wing with its gable to the front, rubble stone (photographs 1 and 2)
  const S = range({ x: -7.4, z: 0.6, ry: Math.PI / 2, len: 8.2, dep: 5.4, eave: 5.0, pitch: 44, wall: "stone", over: 0.3, verge: 0.15 });
  const SF = mtx(-7.4, 0, 4.7); windowAt(SF.clone().multiply(mtx(0, 1.5, 0)), 1.1, 1.2, 2); windowAt(SF.clone().multiply(mtx(0, 4.0, 0)), 0.75, 0.9, 2);
  put(new THREE.BoxGeometry(1.4, 0.16, 0.25), "sill", SF.clone().multiply(mtx(0, 0.84, 0.1)));
  chim(S.base, -3.2, 6.5, S.ridgeY + 1.0, 1.0, 0.75, "stone");          // stack on the front gable of the stone bay
  pick("Tŷ Mawr, the house", "Photographs 1 and 2: two storeys, lime-washed front, stone gable-end bay to the west, slate roof, three chimneys (one red brick), small gabled porch. Sizes are scaled from the photographs; the back is a best guess.", -1.5, 4, 0.5, 17, 9, 9);
  // attached single-storey range to the east, red pantiles (photograph 2)
  const R = range({ x: 13.5, z: -0.2, len: 16.0, dep: 5.6, eave: 2.8, pitch: 33, roof: "pantile", over: 0.3, verge: 0.12 });
  const RF = mtx(13.5, 0, 2.6); for (const x of [-5.5, 0.5, 5.5]) windowAt(RF.clone().multiply(mtx(x, 1.4, 0)), 0.9, 0.85, 2); for (const x of [-2.6, 3.2]) doorAt(RF.clone().multiply(mtx(x, 0, 0)), 0.95, 1.95, "green");
  pick("Attached range", "Photograph 2: long single-storey range on the east end of the house, red pantile roof. Length scaled from the photograph.", 13.5, 2, 0, 16.5, 4.5, 6);
  // stable range west of the house: lime-washed, slate, a row of green stable doors (photograph 3)
  const SR = range({ x: -20.5, z: 16.5, len: 14.0, dep: 5.6, eave: 2.9, pitch: 36, over: 0.3 });
  const SRF = mtx(-20.5, 0, 19.3); for (let i = 0; i < 5; i++) { const x = -5.6 + i * 2.8; doorAt(SRF.clone().multiply(mtx(x, 0, 0)), 1.05, 2.05, "green"); put(new THREE.BoxGeometry(1.05, 0.05, 0.08), "frame", SRF.clone().multiply(mtx(x, 1.12, 0.08))); if (i < 4) windowAt(SRF.clone().multiply(mtx(x + 1.4, 1.75, 0)), 0.55, 0.5, 1); }
  pick("Stable range", "Photograph 3: lower lime-washed range with a slate roof and a row of green stable doors, between the barn and the house. Sizes scaled from the photograph.", -20.5, 2, 16.5, 14.5, 4.5, 6);
  // dressed-stone barn with a big green cart door under a gabled porch (photograph 3)
  const BN = range({ x: -36.5, z: 18.5, len: 16.0, dep: 7.4, eave: 4.9, pitch: 40, wall: "dressed", over: 0.3 });
  gabledPorch(mtx(-34.5, 0, 22.2), 4.6, 2.2, 4.0, 42, "dressed", 3.3, 3.5, "green");
  const BF = mtx(-36.5, 0, 22.2); for (const x of [-6.0, -3.4, 3.4, 6.2]) put(new THREE.BoxGeometry(0.16, 0.9, 0.05), "dark", BF.clone().multiply(mtx(x, 2.9, 0.01)));
  doorAt(BF.clone().multiply(mtx(5.0, 0, 0)), 1.0, 2.0, "green");
  pick("Stone barn", "Photograph 3: dressed-stone barn with a large green cart door under a gabled porch, west of the stables. Sizes scaled from the photograph.", -36.5, 3, 19.5, 16.5, 7.5, 10);
  // church to the north-east, as the aerial photograph shows it (form simplified)
  const CH = range({ x: 56, z: -34, len: 18, dep: 7.6, eave: 5.2, pitch: 45, wall: "stone", over: 0.35 });
  const T = mtx(44.2, 0, -34); put(new THREE.BoxGeometry(5.6, 15, 5.6), "stone", T.clone().multiply(mtx(0, 7.5, 0)));
  for (let i = 0; i < 4; i++) for (const s of [-1, 1]) { put(new THREE.BoxGeometry(0.9, 0.8, 0.55), "stone", T.clone().multiply(mtx(-2.1 + i * 1.4, 15.4, s * 2.5))); put(new THREE.BoxGeometry(0.55, 0.8, 0.9), "stone", T.clone().multiply(mtx(s * 2.5, 15.4, -2.1 + i * 1.4))); }
  for (const x of [-4, 0, 4]) archAt(mtx(56 + x, 0, -30.2), 0.9, 2.6);
  pick("Church", "Photograph 1 (aerial): the church stands north-east of the house. Its position comes from the aerial view; its form is simplified.", 52, 6, -34, 26, 15, 9);
  // dry-stone walls and gravel yards (photographs 2 and 3)
  dsWall(-11, 13.5, 26, 13.5, 1.2, 0.62, [[1.0, 4.6]]); dsWall(-11, 4.8, -11, 13.5); dsWall(26, 3.2, 26, 13.5);
  dsWall(-46, 33, -6, 33, 1.25, 0.65, [[-2.3, 1.3]]); dsWall(-46, 22.6, -46, 33); dsWall(-6, 20, -6, 33, 1.2, 0.62, [[1.6, 5.0]]);
  gravel(-10.6, 25.6, 3.4, 13.1); gravel(-45.6, -6.4, 20.0, 32.6); gravel(8.6, 12.0, 13.5, 60); gravel(-6.4, 8.6, 14.5, 18.0);
  fieldGate(-26.5, 33, 3.4); fieldGate(10.25, 13.5, 3.3);
  // a windbreak of poplars to the north, as estancias in the Chubut valley plant them (setting, best guess)
  for (let i = 0; i < 16; i++) { const x = -56 + i * 6.2 + rnd() * 1.5, z = -22 - rnd() * 3, h = 13 + rnd() * 5; put(new THREE.CylinderGeometry(0.16, 0.26, 3, 6), "bark", mtx(x, 1.5, z)); const c = new THREE.ConeGeometry(1.7 + rnd() * 0.5, h, 7, 1); put(c, "leaf", mtx(x, 2 + h / 2, z)); }
}
function porch(m) {
  const w = 2.2, d = 1.9, eave = 2.35, pitch = 50, rise = w / 2 * Math.tan(pitch * Math.PI / 180);
  put(new THREE.BoxGeometry(w + 0.3, 0.12, d + 0.2), "sill", m.clone().multiply(mtx(0, 0.06, d / 2)));
  for (const px of [-w / 2 + 0.07, w / 2 - 0.07]) for (const pz of [0.15, d - 0.07]) put(new THREE.BoxGeometry(0.13, eave, 0.13), "timber", m.clone().multiply(mtx(px, eave / 2, pz)));
  for (const px of [-w / 2 + 0.07, w / 2 - 0.07]) { put(new THREE.BoxGeometry(0.06, 0.9, d - 0.2), "timber", m.clone().multiply(mtx(px, 0.55, d / 2))); put(new THREE.BoxGeometry(0.12, 0.12, d), "timber", m.clone().multiply(mtx(px, eave, d / 2))); }
  put(new THREE.BoxGeometry(w, 0.14, 0.14), "timber", m.clone().multiply(mtx(0, eave, d - 0.07)));
  const tri = new THREE.Shape(); tri.moveTo(-w / 2, 0); tri.lineTo(w / 2, 0); tri.lineTo(0, rise); tri.closePath();
  put(new THREE.ExtrudeGeometry(tri, { depth: 0.05, bevelEnabled: false }), "timber", m.clone().multiply(mtx(0, eave + 0.07, d - 0.06)));
  const sl = Math.hypot(w / 2, rise) + 0.18, a = Math.atan2(rise, w / 2);
  for (const s of [1, -1]) { put(new THREE.BoxGeometry(sl, 0.09, d + 0.35), "slate", m.clone().multiply(mtx(s * (w / 4 + 0.05), eave + rise / 2 + 0.06, d / 2 + 0.1, 0, 0, -s * a)));
    put(new THREE.BoxGeometry(sl, 0.22, 0.04), "timber", m.clone().multiply(mtx(s * (w / 4 + 0.05), eave + rise / 2 - 0.02, d + 0.27, 0, 0, -s * a))); }
}
function archAt(m, w, h) { // dark round-arched opening with a lime reveal
  const sh = new THREE.Shape(); const r = w / 2, hs = h - r; sh.moveTo(-r, 0); sh.lineTo(-r, hs); sh.absarc(0, hs, r, Math.PI, 0, true); sh.lineTo(r, 0); sh.closePath();
  put(new THREE.ShapeGeometry(sh, 16), "dark", m.clone().multiply(mtx(0, 0, 0.01)));
  const ring = new THREE.Shape(); ring.absarc(0, hs, r + 0.18, Math.PI, 0, true); ring.lineTo(r, hs); ring.absarc(0, hs, r, 0, Math.PI, false); ring.closePath();
  put(new THREE.ExtrudeGeometry(ring, { depth: 0.06, bevelEnabled: false, curveSegments: 16 }), "stoneLime", m.clone().multiply(mtx(0, 0, 0)));
}

M.lawn = new THREE.MeshStandardMaterial({ map: lawnTex, roughness: 1 }); lawnTex.repeat.set(1, 1); UV_SCALE.lawn = 1.5;
M.gravel = new THREE.MeshStandardMaterial({ map: gravelTex, roughness: 1 }); UV_SCALE.gravel = 2.0;
const farmGroup = new THREE.Group(); scene.add(farmGroup);
farm();
// v0.2.0: laid out as the photographs show it, front to the south, outbuildings to the west, church to the north-east
for (const [k, list] of Object.entries(buckets)) { const mesh = new THREE.Mesh(merge(list), M[k]); mesh.castShadow = !["lawn", "gravel", "glass"].includes(k); mesh.receiveShadow = true; farmGroup.add(mesh); }
picks.forEach(p => farmGroup.add(p));
{ const sk = new THREE.Mesh(merge(skirts.map(g => g.index ? g.toNonIndexed() : g)), new THREE.MeshBasicMaterial({ map: aoTex, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 })); sk.renderOrder = 1; farmGroup.add(sk); }
// v0.3.0 (8 Nov 2026, cedwyn#528): Tŷ Mawr (Great House) from the latest model (section/revival-ar models/tymawr.glb v0.2.3,
// cut to the house group: no church, lane, hedges, meadow or garden), alone on the steppe. The drawn farm above stays as the fallback.
{ const drawn = farmGroup.children.filter(o => o.isMesh && !picks.includes(o));
  new GLTFLoader().load(new URL('models/tymawr.glb?v=0.2.3', import.meta.url).href, gl => {
    gl.scene.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; o.receiveShadow = true; } });
    drawn.forEach(o => { o.visible = false; }); farmGroup.add(gl.scene); window.__a3dmodel = 'glb';
  }, undefined, () => { window.__a3dmodel = 'drawn'; }); }

// ---------- v0.5.0 landscape: the real ground, sea and buildings round the replica site ----------
// Terrain: Terrain Tiles (AWS Open Data; SRTM and other public sources). Coastline and roads: © OpenStreetMap contributors (ODbL).
// Buildings: Microsoft Global ML Building Footprints (ODbL, 2026 release) plus OpenStreetMap buildings that set lacks.
// data/landscape.json describes every file. Near box 20 km (31 m terrain cells, 9.8 m cover), far ring 160 km (800 m cells).
// If the files cannot be read, the world falls back to the flat steppe of v0.4.0.
const LS = { h: null, n: 640, x0: -13500, x1: 6500, n0: -6500, n1: 13500, cell: 31.25, h0: 95.13 };
function hAt(x, z) { const H = LS.h; if (!H) return 0; const n = LS.n;
  const fx = Math.min(n - 1.001, Math.max(0, (x - LS.x0) / LS.cell - 0.5)), fz = Math.min(n - 1.001, Math.max(0, (LS.n1 + z) / LS.cell - 0.5));
  const i = fx | 0, j = fz | 0, a = fx - i, b = fz - j;
  return (H[j * n + i] * (1 - a) + H[j * n + i + 1] * a) * (1 - b) + (H[(j + 1) * n + i] * (1 - a) + H[(j + 1) * n + i + 1] * a) * b; }
async function pixels(url) { const r = await fetch(url); if (!r.ok) throw new Error(url + " " + r.status); const blob = await r.blob();
  let src; try { src = await createImageBitmap(blob, { colorSpaceConversion: "none", premultiplyAlpha: "none" }); }
  catch (e) { src = await new Promise((ok, no) => { const im = new Image(); im.onload = () => ok(im); im.onerror = no; im.src = URL.createObjectURL(blob); }); }
  const c = document.createElement("canvas"); c.width = src.width; c.height = src.height; const g = c.getContext("2d", { willReadFrequently: true }); g.drawImage(src, 0, 0);
  return g.getImageData(0, 0, c.width, c.height); }
function decodeH(img, h0) { const d = img.data, n = img.width * img.height, out = new Float32Array(n), sea = new Uint8Array(n);
  for (let k = 0; k < n; k++) { out[k] = (d[k * 4] * 256 + d[k * 4 + 1]) / 10 - 20 - h0; sea[k] = d[k * 4 + 2] > 127 ? 1 : 0; } return { out, sea }; }
const land = { buildings: 0, ok: false };
try {
  const meta = await (await fetch(new URL("data/landscape.json?v=0.5.0", import.meta.url).href)).json();
  Object.assign(LS, { n: meta.near.size, x0: meta.near.x0, x1: meta.near.x1, n0: meta.near.n0, n1: meta.near.n1, cell: meta.near.cell_m, h0: meta.h0 });
  const [nearImg, farImg, bld] = await Promise.all([
    pixels(new URL("data/heights.png?v=0.5.0", import.meta.url).href),
    pixels(new URL("data/far.png?v=0.5.0", import.meta.url).href),
    fetch(new URL("data/buildings.bin?v=0.5.0", import.meta.url).href).then(r => r.ok ? r.arrayBuffer() : null).catch(() => null)]);
  LS.h = decodeH(nearImg, LS.h0).out;
  const SEA = -LS.h0; // sea level in world y (the farm stands at y = 0)
  // near terrain, coloured by the cover map (OpenStreetMap roads, beaches, town; steppe tones), with close-up soil detail round the farm
  const W = LS.x1 - LS.x0, Dn = LS.n1 - LS.n0, seg = LOW ? 319 : 639;
  const tg = new THREE.PlaneGeometry(W, Dn, seg, seg); tg.rotateX(-Math.PI / 2); tg.translate((LS.x0 + LS.x1) / 2, 0, -(LS.n0 + LS.n1) / 2);
  { const P = tg.attributes.position; for (let i = 0; i < P.count; i++) P.setY(i, hAt(P.getX(i), P.getZ(i))); tg.computeVertexNormals(); }
  const coverTex = tl.load(new URL("data/cover.jpg?v=0.5.0", import.meta.url).href); coverTex.colorSpace = THREE.SRGBColorSpace; coverTex.anisotropy = Math.min(8, maxAniso);
  const tmat = new THREE.MeshStandardMaterial({ map: coverTex, roughness: 1 });
  tmat.onBeforeCompile = sh => { sh.uniforms.macro = { value: macroTex }; sh.uniforms.soil = { value: soilTex };
    sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec2 vW;").replace("#include <worldpos_vertex>", "#include <worldpos_vertex>\nvW = (modelMatrix * vec4(transformed,1.0)).xz;");
    sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nuniform sampler2D macro; uniform sampler2D soil; varying vec2 vW;").replace("#include <map_fragment>",
      "#include <map_fragment>\nfloat m1 = texture2D(macro, vW/310.0).r, m2 = texture2D(macro, vW/47.0 + 0.3).r;\nvec3 nearC = diffuseColor.rgb * (texture2D(soil, vW/7.0).rgb / vec3(0.33, 0.25, 0.12)) * (0.35 + 1.3*m1) * (0.7 + 0.6*m2);\nnearC = mix(nearC, nearC*vec3(0.95,1.0,0.86), smoothstep(0.45,0.6,m1));\nvec3 farC = diffuseColor.rgb * (0.8 + 0.4*m1);\ndiffuseColor.rgb = mix(nearC, farC, smoothstep(160.0, 520.0, length(vW)));"); };
  const terrain = new THREE.Mesh(tg, tmat); terrain.receiveShadow = true; scene.add(terrain);
  // far ring (160 km): the gulf shores and the steppe to the horizon
  { const f = decodeH(farImg, LS.h0), n = farImg.width, half = meta.far.half_extent_m;
    const fg = new THREE.PlaneGeometry(half * 2, half * 2, n - 1, n - 1); fg.rotateX(-Math.PI / 2);
    const P = fg.attributes.position, C = new Float32Array(P.count * 3);
    for (let i = 0; i < P.count; i++) { const y = f.out[i]; P.setY(i, y); const t = Math.min(1, Math.max(0, (y - SEA) / 140)), v = 0.9 + 0.2 * Math.sin(i * 12.9898);
      C[i * 3] = (0.30 + 0.06 * t) * v; C[i * 3 + 1] = (0.25 + 0.04 * t) * v; C[i * 3 + 2] = (0.155 + 0.02 * t) * v; }
    fg.setAttribute("color", new THREE.BufferAttribute(C, 3)); fg.computeVertexNormals();
    scene.add(new THREE.Mesh(fg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }))); }
  // the sea (Golfo Nuevo), at sea level
  { const wg = new THREE.PlaneGeometry(400000, 400000); wg.rotateX(-Math.PI / 2);
    const water = new THREE.Mesh(wg, new THREE.MeshStandardMaterial({ color: 0x174a68, roughness: 0.32, metalness: 0.0, envMapIntensity: 0.55 })); water.position.y = SEA; scene.add(water); }
  // today's buildings: one oriented block per footprint, standing on the terrain
  if (bld) { const dv = new DataView(bld), cnt = dv.getUint32(4, true), bg = new THREE.BoxGeometry(1, 1, 1); bg.translate(0, 0.5, 0);
    { const nC = bg.attributes.position.count, C = new Float32Array(nC * 3); for (let i = 0; i < nC; i++) { const top = i >= 8 && i < 12, v = top ? 0.6 : 1; C[i * 3] = v; C[i * 3 + 1] = v; C[i * 3 + 2] = top ? 0.64 : 1; } bg.setAttribute("color", new THREE.BufferAttribute(C, 3)); }
    const tones = [[0.86, 0.82, 0.74], [0.92, 0.91, 0.88], [0.80, 0.62, 0.48], [0.72, 0.72, 0.70], [0.88, 0.80, 0.62]];
    const bm = new THREE.InstancedMesh(bg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85 }), cnt);
    const m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion(), s4 = new THREE.Vector3(), p4 = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0), c4 = new THREE.Color();
    for (let k = 0, o = 8; k < cnt; k++, o += 10) { const x = dv.getInt16(o, true) / 2, z = dv.getInt16(o + 2, true) / 2, w = dv.getUint16(o + 4, true) / 10, l = dv.getUint16(o + 6, true) / 10, a = dv.getUint8(o + 8) / 255 * Math.PI, h = dv.getUint8(o + 9) / 4;
      p4.set(x, hAt(x, z) - 1, z); q4.setFromAxisAngle(up, a); s4.set(w, h + 1, l); m4.compose(p4, q4, s4); bm.setMatrixAt(k, m4);
      const t = tones[(k * 2654435761 >>> 0) % tones.length]; c4.setRGB(t[0], t[1], t[2]); bm.setColorAt(k, c4); }
    bm.computeBoundingSphere(); scene.add(bm); land.buildings = cnt; }
  // place names
  const label = (txt, x, z, dy) => { const c = document.createElement("canvas"); c.width = 512; c.height = 96; const g = c.getContext("2d");
    g.font = "600 44px system-ui, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.lineWidth = 8; g.strokeStyle = "rgba(20,28,36,.75)"; g.strokeText(txt, 256, 48); g.fillStyle = "#fff"; g.fillText(txt, 256, 48);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, sizeAttenuation: false, transparent: true }));
    s.scale.set(0.2, 0.0375, 1); s.position.set(x, Math.max(hAt(x, z), SEA) + dy, z); s.renderOrder = 10; scene.add(s); return s; };
  label("Golfo Nuevo", 3200, -6200, 40); label("Puerto Madryn", -7300, -5600, 70);
  land.ok = true;
} catch (e) { console.warn("landscape", e); LS.h = null; }
window.__a3dland = land;
if (!land.ok) { // v0.4.0 fallback: flat steppe
  const g = new THREE.PlaneGeometry(6000, 6000, 1, 1); g.rotateX(-Math.PI / 2);
  const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 6000 / 7, uv.getY(i) * 6000 / 7);
  const mat = new THREE.MeshStandardMaterial({ map: soilTex, roughness: 1 });
  mat.onBeforeCompile = sh => { sh.uniforms.macro = { value: macroTex };
    sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec2 vW;").replace("#include <worldpos_vertex>", "#include <worldpos_vertex>\nvW = (modelMatrix * vec4(transformed,1.0)).xz;");
    sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nuniform sampler2D macro; varying vec2 vW;").replace("#include <map_fragment>", "#include <map_fragment>\nfloat m1 = texture2D(macro, vW/310.0).r, m2 = texture2D(macro, vW/47.0 + 0.3).r;\ndiffuseColor.rgb *= (0.35 + 1.3*m1) * (0.7 + 0.6*m2);\ndiffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb*vec3(0.95,1.0,0.86), smoothstep(0.45,0.6,m1));"); };
  const ground = new THREE.Mesh(g, mat); ground.receiveShadow = true; scene.add(ground);
}
const windU = { value: 0 };
function tussockGeo() { const P = [], C = [], blades = 22;
  for (let b = 0; b < blades; b++) { const a = rnd() * 6.283, lean = 0.12 + rnd() * 0.4, h = 0.38 + rnd() * 0.42, w = 0.02 + rnd() * 0.014, bx = Math.cos(a) * 0.06 * rnd(), bz = Math.sin(a) * 0.06 * rnd();
    const tx = bx + Math.cos(a) * lean * h, tz = bz + Math.sin(a) * lean * h, px = -Math.sin(a) * w, pz = Math.cos(a) * w;
    P.push(bx - px, 0, bz - pz, bx + px, 0, bz + pz, tx, h, tz); const l = 0.55 + rnd() * 0.25; C.push(0.30 * l, 0.28 * l, 0.15 * l, 0.30 * l, 0.28 * l, 0.15 * l, 0.70 * l + 0.06, 0.60 * l + 0.05, 0.34 * l); }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(P, 3)); g.setAttribute("color", new THREE.Float32BufferAttribute(C, 3)); g.computeVertexNormals();
  const n = g.attributes.normal; for (let i = 0; i < n.count; i++) { const x = n.getX(i) * 0.3, z = n.getZ(i) * 0.3, l = Math.hypot(x, 1, z); n.setXYZ(i, x / l, 1 / l, z / l); } return g; }
function windMat(base) { base.onBeforeCompile = sh => { sh.uniforms.uT = windU; sh.vertexShader = "uniform float uT;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n#ifdef USE_INSTANCING\nvec4 ip = instanceMatrix[3];\n#else\nvec4 ip = vec4(0.);\n#endif\nfloat ph = uT*1.6 + ip.x*0.21 + ip.z*0.17; transformed.x += (sin(ph)*0.06 + sin(ph*2.3)*0.02) * position.y * 2.0; transformed.z += cos(ph*0.8)*0.035*position.y*2.0;"); }; return base; }
{
  const n = LOW ? 7000 : 18000, R = LOW ? 140 : 220;
  const CLEAR = [[-12, 27, -5, 14.5], [-47, -5, 12, 34], [8, 13, 13, 62], [-7, 9, 14, 18.5], [40, 67, -40, -28], [-60, 45, -27, -19]];
  const tm = new THREE.InstancedMesh(tussockGeo(), windMat(new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.95 })), n);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(); let k = 0;
  while (k < n) { const r = Math.pow(rnd(), 0.62) * R, a = rnd() * 6.283, x = Math.cos(a) * r, z = Math.sin(a) * r;
    if (CLEAR.some(([a1, a2, b1, b2]) => x > a1 && x < a2 && z > b1 && z < b2)) continue; // buildings, garden, yard, track stay clear
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rnd() * 6.3); const sc = 0.7 + rnd() * 0.9; s.set(sc, sc * (0.8 + rnd() * 0.5), sc); p.set(x, hAt(x, z), z); m.compose(p, q, s); tm.setMatrixAt(k++, m); }
  tm.receiveShadow = true; scene.add(tm);
  // low cushion shrubs (jarilla / quilembai type) — sparse
  const sg = new THREE.IcosahedronGeometry(0.55, 2); { const P = sg.attributes.position; for (let i = 0; i < P.count; i++) { const y = P.getY(i); const f = 1 + (rnd() - 0.5) * 0.35; P.setXYZ(i, P.getX(i) * f, Math.max(y, -0.15) * 0.62 * f, P.getZ(i) * f); } sg.computeVertexNormals(); }
  const ns = LOW ? 220 : 520; const sm = new THREE.InstancedMesh(sg, new THREE.MeshStandardMaterial({ color: 0x5f6a4c, roughness: 1, flatShading: true }), ns); k = 0;
  while (k < ns) { const r = 30 + Math.sqrt(rnd()) * (R + 200), a = rnd() * 6.283, x = Math.cos(a) * r, z = Math.sin(a) * r; if (x > -40 && x < 40 && z > -48 && z < 46) continue;
    const sc = 0.6 + rnd() * 1.4; s.set(sc * (1 + rnd() * 0.6), sc, sc); p.set(x, hAt(x, z), z); q.identity(); m.compose(p, q, s); sm.setMatrixAt(k, m); sm.setColorAt(k++, new THREE.Color().setHSL(0.2 + rnd() * 0.06, 0.18 + rnd() * 0.12, 0.27 + rnd() * 0.1)); }
  sm.castShadow = !LOW; sm.receiveShadow = true; scene.add(sm);
}

// ---------- views ----------
const VIEWS = { heli: [[52, 44, 74], [-10, 1, 6]], ground: [[-9, 1.7, 80], [-27, 4, 16]], front: [[3, 2.2, 32], [-1, 3.6, 0]], above: [[8, 150, 60], [-8, 0, 4]],
  // v0.5.0: over the house towards the sea (2.67 km to the north-north-east) and towards the houses of Puerto Madryn (north-west), and the whole area
  sea: [[-26, 15, 64], [341, -14, -535]], town: [[260, 180, 300], [-5600, -60, -4400]], area: [[2600, 2100, 4200], [-2400, -60, -3000]] }; VIEWS.quarter = VIEWS.heli; VIEWS.yard = VIEWS.ground;
function go(v) { const [p, t] = VIEWS[v]; camera.position.set(...p); controls.target.set(...t); controls.update(); }
go(Q.get("view") || "heli");

// ---------- UI ----------
const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(); let downAt = null;
canvas.addEventListener("pointerdown", e => downAt = [e.clientX, e.clientY]);
canvas.addEventListener("pointerup", e => { if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 6) return; const r = canvas.getBoundingClientRect(); ptr.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1); ray.setFromCamera(ptr, camera); const hit = ray.intersectObjects(picks)[0]; if (hit) { $("cardt").textContent = hit.object.userData.name; $("cardd").textContent = hit.object.userData.basis; $("card").hidden = false; } else $("card").hidden = true; });
$("cardx").onclick = () => $("card").hidden = true;
document.querySelectorAll("[data-view]").forEach(b => b.onclick = () => go(b.dataset.view));
$("hr").oninput = e => { state.hour = +e.target.value; $("night").hidden = true; applySun(); };
$("nowb").onclick = () => { state.hour = null; $("night").hidden = true; applySun(); };
document.querySelectorAll("[data-open]").forEach(b => b.onclick = () => $(b.dataset.open).showModal());
document.querySelectorAll("[data-close]").forEach(b => b.onclick = () => b.closest("dialog").close());

// ---------- loop + perf ----------
const clock = new THREE.Clock(); let frames = 0, acc = 0, fps = 0; const perf = { fps: 0, calls: 0, tris: 0 };
function frame() { const dt = Math.min(clock.getDelta(), 0.1); windU.value += dt; controls.update(); renderer.render(scene, camera);
  frames++; acc += dt; if (acc > 1) { fps = frames / acc; frames = 0; acc = 0; perf.fps = Math.round(fps); perf.calls = renderer.info.render.calls; perf.tris = renderer.info.render.triangles; if (Q.has("debug")) $("st").textContent = `${perf.fps} fps · ${perf.calls} draws · ${(perf.tris / 1000).toFixed(0)}k tris`; } }
resize(); applySun(); $("st").textContent = "";
renderer.setAnimationLoop(frame);
window.__arg3d = { perf, renderer, scene, camera };
// the shared world interface (same shape as the Wales world will use)
window.cedwynWorld = new ThreeBackend({ renderer, scene, camera, state, applySun, go, frame });
