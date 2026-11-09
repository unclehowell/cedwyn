// Wales 3D world v0.3.0 — Llandough / Leckwith / the Cedwyn estate on real LiDAR terrain. 
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Sky } from './vendor/Sky.js?v=0.160.0';
import { mergeGeometries } from './vendor/BufferGeometryUtils.js?v=0.160.0';
import { createBackend } from './world-backend.js?v=0.2.0';

const Q = new URLSearchParams(location.search);
const PHONE = matchMedia('(max-width: 700px)').matches || /Mobi|Android|iPhone/.test(navigator.userAgent);
const D = (document.querySelector('meta[name=w3d-data]') || {}).content || new URL('data/', import.meta.url).href;
if (!document.querySelector('link[href*="wales-3d.css"]')) { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = new URL('wales-3d.css?v=0.3.0', import.meta.url).href; document.head.appendChild(l); }
const LAT = 51.4527, LON = -3.1987;
const $ = s => document.querySelector(s);
const info = t => { $('#w3dinfo').textContent = t || ''; };
// This webapp's own data store: data/central.json, the catalogue fields for the records in data/sources.json, synced
// read-only from the central catalogue by tools/sync_central.py (every 6 h). Optional: the world works without it.
let central = null;
fetch(D + 'central.json?h=' + Math.floor(Date.now() / 3.6e6)).then(r => r.ok ? r.json() : null).then(j => { central = j; }).catch(() => {});
const perf = window.__w3dperf = { phone: PHONE, frames: 0, fps: 0, dpr: 0, tris: 0, calls: 0, loadMs: 0 };
const t0 = performance.now();

// ---------- renderer / scene ----------
const canvas = $('#w3dc');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: !PHONE, powerPreference: 'high-performance', preserveDrawingBuffer: Q.has('shot') });
let dpr = Math.min(devicePixelRatio || 1, PHONE ? 1.5 : 2); renderer.setPixelRatio(dpr);
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 0.55;
renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
scene.fog = null; // v0.2.0: always clear — no fog, no haze, no distance fade
const camera = new THREE.PerspectiveCamera(50, 1, 2, 40000);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; controls.dampingFactor = 0.08; controls.maxPolarAngle = Math.PI * 0.495;
controls.minDistance = 25; controls.maxDistance = 9000; controls.screenSpacePanning = false;

const sun = new THREE.DirectionalLight(0xffffff, 2.6); scene.add(sun); scene.add(sun.target);
const hemi = new THREE.HemisphereLight(0xbcd2ee, 0x5a5030, 0.9); scene.add(hemi);
const sky = new Sky(); sky.scale.setScalar(30000); scene.add(sky);
const su = sky.material.uniforms; su.turbidity.value = 2; su.rayleigh.value = 1.0; su.mieCoefficient.value = 0.002; su.mieDirectionalG.value = 0.8;

// ---------- state ----------
const state = { era: 'today', hour: null, weather: 'clear', contours: true, trees: true, labels: true, vex: 1, sound: false, h3: true, h3res: 14, bld: true, parcels: true, hidden: new Set(), sel: null };

// ---------- sun from real date/time (NOAA approximation) ----------
function sunPos(date) {
  const rad = Math.PI / 180, jd = date.getTime() / 86400000 + 2440587.5, n = jd - 2451545.0;
  const L = (280.46 + 0.9856474 * n) % 360, g = (357.528 + 0.9856003 * n) % 360 * rad;
  const lam = (L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * rad, eps = (23.439 - 0.0000004 * n) * rad;
  const ra = Math.atan2(Math.cos(eps) * Math.sin(lam), Math.cos(lam)), dec = Math.asin(Math.sin(eps) * Math.sin(lam));
  const gmst = (18.697374558 + 24.06570982441908 * n) % 24, lst = (gmst * 15 + LON) * rad, ha = lst - ra;
  const la = LAT * rad;
  const alt = Math.asin(Math.sin(la) * Math.sin(dec) + Math.cos(la) * Math.cos(dec) * Math.cos(ha));
  const az = Math.atan2(-Math.sin(ha), Math.tan(dec) * Math.cos(la) - Math.sin(la) * Math.cos(ha)); // from north, clockwise
  return { alt, az };
}
function simDate() {
  const d = new Date();
  if (state.hour == null) return d;
  const x = new Date(d); x.setUTCHours(0, 0, 0, 0);
  // hour slider is UK local clock; Europe/London offset (0 in winter, 1 in summer)
  const off = new Date(d.toLocaleString('en-US', { timeZone: 'Europe/London' })) - new Date(d.toLocaleString('en-US', { timeZone: 'UTC' }));
  return new Date(x.getTime() + state.hour * 3600000 - off);
}

// ---------- terrain ----------
let HM = null, HN = 1000, CELL = 4, EXT = 4000;
function hAt(x, z) { // bilinear on the 4 m DTM grid, texel centres
  const fx = Math.min(HN - 1.001, Math.max(0, (x + 2000) / CELL - 0.5)), fz = Math.min(HN - 1.001, Math.max(0, (z + 2000) / CELL - 0.5));
  const i = fx | 0, j = fz | 0, u = fx - i, v = fz - j, k = j * HN + i;
  return ((HM[k] * (1 - u) + HM[k + 1] * u) * (1 - v) + (HM[k + HN] * (1 - u) + HM[k + HN + 1] * u) * v) * state.vex;
}
function warp(u) { const a = 0.33; return 2000 * (a * u + (1 - a) * u * u * u); }
function terrainGeometry(seg) {
  const n = seg + 1, pos = new Float32Array(n * n * 3), idx = [];
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const k = (j * n + i) * 3; pos[k] = warp(i / seg * 2 - 1); pos[k + 1] = 0; pos[k + 2] = warp(j / seg * 2 - 1);
  }
  for (let j = 0; j < seg; j++) for (let i = 0; i < seg; i++) {
    const a = j * n + i, b = a + 1, c = a + n, d = c + 1; idx.push(a, c, b, b, c, d);
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setIndex(idx);
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 50, 0), 3000); return g;
}
const TV = `
uniform sampler2D hTex; uniform float vex;
varying vec3 vW; varying vec2 vUv;
#include <fog_pars_vertex>
void main(){
  vec2 uv = (position.xz + 2000.0) / 4000.0; vUv = uv;
  float h = texture2D(hTex, uv).r * vex;
  vec3 p = vec3(position.x, h, position.z); vW = p;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;
const TF = `
uniform sampler2D hTex; uniform sampler2D cTex; uniform sampler2D eTex;
uniform vec3 sunDir; uniform vec3 sunCol; uniform vec3 skyCol; uniform vec3 gndCol;
uniform float vex; uniform float ctr; uniform float era; uniform float wet; uniform float time; uniform vec4 eBox;
uniform sampler2D oTex; uniform float oOn; uniform vec4 oBox;
varying vec3 vW; varying vec2 vUv;
#define OVL 1.6
#include <fog_pars_fragment>
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float s=0.0,a=0.5; for(int i=0;i<4;i++){ s+=a*noise(p); p*=2.03; a*=0.5; } return s; }
void main(){
  float e = 1.0/1000.0;
  float hL = texture2D(hTex, vUv-vec2(e,0)).r, hR = texture2D(hTex, vUv+vec2(e,0)).r;
  float hD = texture2D(hTex, vUv-vec2(0,e)).r, hU = texture2D(hTex, vUv+vec2(0,e)).r;
  float h = texture2D(hTex, vUv).r;
  vec3 n = normalize(vec3(-(hR-hL)*vex/8.0, 1.0, -(hU-hD)*vex/8.0));
  float slope = 1.0 - n.y;
  vec3 cov = texture2D(cTex, vUv).rgb;
  // grass and fields: two greens broken up by field-scale and metre-scale noise
  float f1 = fbm(vW.xz * 0.012), f2 = fbm(vW.xz * 0.35);
  vec3 grass = mix(vec3(0.075,0.135,0.028), vec3(0.150,0.190,0.050), f1);
  grass = mix(grass, vec3(0.140,0.135,0.060), smoothstep(0.55,0.8,fbm(vW.xz*0.004+7.0))*0.6);
  grass *= 0.85 + 0.3*f2;
  vec3 soil = vec3(0.13,0.095,0.06) * (0.8+0.4*f2);
  vec3 col = mix(grass, soil, smoothstep(0.25, 0.6, slope));
  vec3 wood = vec3(0.030,0.045,0.016) * (0.7+0.6*f2);
  col = mix(col, wood, cov.r);
  vec3 tarmac = vec3(0.05,0.05,0.055) * (0.9+0.2*f2);
  float paved = cov.g * (1.0 - 0.75*era);
  col = mix(col, tarmac, paved);
  col *= 1.0 - 0.35*wet;
  // 1841 tithe parcels
  vec2 eu = (vW.xz - eBox.xy) / eBox.zw;
  if (era > 0.0 && eu.x > 0.0 && eu.x < 1.0 && eu.y > 0.0 && eu.y < 1.0) { vec4 ec = texture2D(eTex, eu); col = mix(col, ec.rgb, ec.a * era); }
  // light
  float ndl = max(dot(n, sunDir), 0.0);
  vec3 amb = mix(gndCol, skyCol, n.y*0.5+0.5);
  vec3 lit = col * (sunCol * ndl + amb);
  // water: dark, glossy, rippled
  float wtr = cov.b;
  if (wtr > 0.02) {
    vec3 V = normalize(cameraPosition - vW);
    vec3 wn = normalize(vec3((noise(vW.xz*0.6+time*0.4)-0.5)*0.15, 1.0, (noise(vW.zx*0.6-time*0.3)-0.5)*0.15));
    float fr = 0.04 + 0.96*pow(1.0 - max(dot(V, wn), 0.0), 5.0);
    float sp = pow(max(dot(reflect(-sunDir, wn), V), 0.0), 120.0);
    vec3 wc = mix(vec3(0.012,0.022,0.020), skyCol*0.9, fr) + sunCol*sp*2.0;
    lit = mix(lit, wc, smoothstep(0.02, 0.6, wtr));
  }
  // contours every 2 m, bold every 10 m
  if (ctr > 0.0) {
    float hm = h; float w2 = fwidth(hm);
    float l2 = 1.0 - smoothstep(0.0, w2*1.2, abs(fract(hm/2.0+0.5)-0.5)*2.0);
    float l10 = 1.0 - smoothstep(0.0, w2*2.2, abs(fract(hm/10.0+0.5)-0.5)*10.0);
    float fade = 1.0 - smoothstep(0.35, 1.6, w2);
    vec3 cc = vec3(0.32,0.18,0.06);
    lit = mix(lit, cc*(0.3+ndl), max(l2*0.45, l10*0.9) * fade * ctr);
  }
  // v0.2.0 overlay: H3 cells + the Cedwyn plan parcels, draped on the ground
  if (oOn > 0.0) { vec2 ou = (vW.xz - oBox.xy) / oBox.zw;
    if (ou.x > 0.0 && ou.x < 1.0 && ou.y > 0.0 && ou.y < 1.0) { vec4 oc = texture2D(oTex, ou); lit = mix(lit, oc.rgb * OVL * (0.6 + 0.5*ndl), oc.a); } }
  gl_FragColor = vec4(lit, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  #include <fog_fragment>
}`;
let terrainMat, terrain;

// ---------- load ----------
async function img(url) { const i = new Image(); i.crossOrigin = 'anonymous'; i.src = url; await i.decode(); return i; }
async function loadHeights(meta) {
  const T = meta.heightmap.tiles, n = T.grid, ts = T.size; HN = n * ts;
  const c = document.createElement('canvas'); c.width = c.height = HN;
  const x = c.getContext('2d', { willReadFrequently: true });
  const ims = await Promise.all([...Array(n * n)].map((_, k) => img(D + T.pattern.replace('{x}', k % n).replace('{y}', (k / n) | 0) + '?v=0.2.0')));
  ims.forEach((im, k) => x.drawImage(im, (k % n) * ts, ((k / n) | 0) * ts));
  const px = x.getImageData(0, 0, HN, HN).data;
  HM = new Float32Array(HN * HN); const hf = new Uint16Array(HN * HN);
  for (let k = 0; k < HN * HN; k++) { const v = (px[k * 4] * 256 + px[k * 4 + 1]) / 100 - 10; HM[k] = v; hf[k] = THREE.DataUtils.toHalfFloat(v); }
  const t = new THREE.DataTexture(hf, HN, HN, THREE.RedFormat, THREE.HalfFloatType);
  t.magFilter = t.minFilter = THREE.LinearFilter; t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; t.needsUpdate = true; return t;
}
const getJ = u => fetch(D + u + '?v=0.2.1').then(r => { if (!r.ok) throw new Error(u + ' ' + r.status); return r.json(); });

const world = { buildings: null, labels: [], trees: null, shrubs: null, ghost: null, rain: null, anchors: {} };

function buildTerrain(hTex, cTex) {
  const eTex = new THREE.Texture(); // filled by the 1841 layer
  terrainMat = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {
      hTex: { value: null }, cTex: { value: null }, eTex: { value: null }, sunDir: { value: new THREE.Vector3(0, 1, 0) },
      sunCol: { value: new THREE.Color(1, 1, 1) }, skyCol: { value: new THREE.Color(0.3, 0.35, 0.45) }, gndCol: { value: new THREE.Color(0.1, 0.09, 0.05) },
      vex: { value: 1 }, ctr: { value: 1 }, era: { value: 0 }, wet: { value: 0 }, time: { value: 0 }, eBox: { value: new THREE.Vector4(0, 0, 1, 1) },
      oTex: { value: null }, oOn: { value: 0 }, oBox: { value: new THREE.Vector4(0, 0, 1, 1) } }]),
    vertexShader: TV, fragmentShader: TF, fog: false });
  terrainMat.uniforms.hTex.value = hTex; terrainMat.uniforms.cTex.value = cTex; terrainMat.uniforms.eTex.value = eTex;
  terrain = new THREE.Mesh(terrainGeometry(PHONE ? 256 : 384), terrainMat); terrain.frustumCulled = false; scene.add(terrain);
}

function hash(n) { n = Math.sin(n * 12.9898) * 43758.5453; return n - Math.floor(n); }
function buildBuildings(list) {
  const parts = [], ghostParts = [];
  const wallTones = [[0.82, 0.80, 0.74], [0.72, 0.70, 0.66], [0.62, 0.50, 0.42], [0.55, 0.36, 0.28], [0.86, 0.84, 0.80], [0.66, 0.64, 0.56]];
  const roofTones = [[0.20, 0.21, 0.24], [0.28, 0.27, 0.28], [0.36, 0.20, 0.15], [0.24, 0.24, 0.22]];
  const keep1841 = []; // buildings shown solid in the 1841 view: the farmhouse and the church (both stood in 1841)
  list.forEach((b, bi) => {
    const pts = b.p; if (pts.length < 3) return;
    const base = b.b * state.vex - 1.2, top = b.b * state.vex + b.h;
    const wt = wallTones[(hash(bi) * wallTones.length) | 0], rt = roofTones[(hash(bi + 7) * roofTones.length) | 0];
    const shade = 0.85 + 0.25 * hash(bi + 3);
    const P = [], C = [];
    const push = (x, y, z, c, s = 1) => { P.push(x, y, z); C.push(c[0] * shade * s, c[1] * shade * s, c[2] * shade * s); };
    // pitched roof for small four-sided buildings
    let roofH = 0, ridge = null;
    if (pts.length === 4) {
      const d = (a, c) => Math.hypot(pts[a][0] - pts[c][0], pts[a][1] - pts[c][1]);
      const e01 = d(0, 1), e12 = d(1, 2), area = e01 * e12;
      if (area < 420 && b.h < 14) {
        const short = Math.min(e01, e12); roofH = Math.min(4.2, Math.max(1.6, short * 0.38));
        ridge = e01 < e12 ? [[0, 1], [2, 3]] : [[1, 2], [3, 0]];
      }
    }
    const eave = top - roofH;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], c = pts[(i + 1) % pts.length];
      push(a[0], base, a[1], wt, 0.6); push(c[0], base, c[1], wt, 0.6); push(c[0], eave, c[1], wt);
      push(a[0], base, a[1], wt, 0.6); push(c[0], eave, c[1], wt); push(a[0], eave, a[1], wt);
    }
    if (ridge) {
      const m = e => [(pts[e[0]][0] + pts[e[1]][0]) / 2, (pts[e[0]][1] + pts[e[1]][1]) / 2];
      const r1 = m(ridge[0]), r2 = m(ridge[1]);
      const [a0, a1] = ridge[0], [b0, b1] = ridge[1];
      const V = k => [pts[k][0], eave, pts[k][1]];
      const tri = (p, q, r, c) => { push(...p, c); push(...q, c); push(...r, c); };
      const R1 = [r1[0], top, r1[1]], R2 = [r2[0], top, r2[1]];
      tri(V(a0), V(a1), R1, wt); tri(V(b0), V(b1), R2, wt); // gables
      tri(V(a1), V(b0), R2, rt); tri(V(a1), R2, R1, rt);     // slope 1
      tri(V(b1), V(a0), R1, rt); tri(V(b1), R1, R2, rt);     // slope 2
    } else {
      const sh = new THREE.Shape(pts.map(p => new THREE.Vector2(p[0], p[1])));
      const tris = THREE.ShapeUtils.triangulateShape(sh.getPoints(), []);
      for (const t of tris) for (const k of t) push(pts[k][0], top, pts[k][1], rt);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(C, 3));
    b.keep1841 ? keep1841.push(g) : parts.push(g);
  });
  const merged = mergeGeometries(parts, false); merged.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.88, metalness: 0, side: THREE.DoubleSide, transparent: true, opacity: 1 });
  const mesh = new THREE.Mesh(merged, mat); scene.add(mesh);
  let keepMesh = null;
  if (keep1841.length) { const k = mergeGeometries(keep1841, false); k.computeVertexNormals(); keepMesh = new THREE.Mesh(k, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, side: THREE.DoubleSide })); scene.add(keepMesh); }
  return { mesh, keepMesh };
}

function loadInst(buf, max, geo, matFn, scaleFn, colFn) {
  const a = new Int16Array(buf); let n = a.length / 3;
  const order = []; for (let i = 0; i < n; i++) order.push(i);
  // phones: keep the trees nearest the estate first
  if (n > max) { order.sort((p, q) => (a[p * 3] ** 2 + a[p * 3 + 1] ** 2) - (a[q * 3] ** 2 + a[q * 3 + 1] ** 2)); n = max; }
  const mesh = new THREE.InstancedMesh(geo, matFn(), n); const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), c = new THREE.Color();
  const raw = [];
  for (let k = 0; k < n; k++) {
    const i = order[k], x = a[i * 3] / 2, z = a[i * 3 + 1] / 2, h = a[i * 3 + 2] / 10;
    raw.push([x, z, h]);
    const [sx, sy, cy] = scaleFn(h, i);
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), hash(i) * 6.28);
    p.set(x, hAt(x, z) + cy, z); s.set(sx, sy, sx * (0.85 + 0.3 * hash(i + 2)));
    m.compose(p, q, s); mesh.setMatrixAt(k, m); colFn(c, i, h); mesh.setColorAt(k, c);
  }
  mesh.userData.raw = raw; mesh.userData.scaleFn = scaleFn;
  scene.add(mesh); return mesh;
}
function reseat(mesh) { // after a relief change
  if (!mesh) return; const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
  mesh.userData.raw.forEach(([x, z, h], k) => { mesh.getMatrixAt(k, m); m.decompose(p, q, s); p.y = hAt(x, z) + mesh.userData.scaleFn(h, k)[2]; m.compose(p, q, s); mesh.setMatrixAt(k, m); });
  mesh.instanceMatrix.needsUpdate = true;
}

function label(text, x, z, dy = 40, size = 1) {
  const c = document.createElement('canvas'), ctx = c.getContext('2d'), fs = 44;
  ctx.font = `600 ${fs}px system-ui,sans-serif`; const w = Math.ceil(ctx.measureText(text).width) + 28;
  c.width = w; c.height = fs + 22; ctx.font = `600 ${fs}px system-ui,sans-serif`;
  ctx.fillStyle = 'rgba(12,16,24,.72)'; ctx.beginPath(); ctx.roundRect(0, 0, w, c.height, 14); ctx.fill();
  ctx.fillStyle = '#f4efe2'; ctx.textBaseline = 'middle'; ctx.fillText(text, 14, c.height / 2 + 1);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, sizeAttenuation: false, transparent: true }));
  const k = (PHONE ? 0.00034 : 0.00042) * size; s.scale.set(w * k, c.height * k, 1); s.center.set(0.5, 0);
  s.userData = { x, z, dy }; s.position.set(x, hAt(x, z) + dy, z); s.renderOrder = 10; scene.add(s); world.labels.push(s); return s;
}

// ---------- 1841 layer (Tithe H3 parcels) ----------
function build1841(parcels) {
  let x0 = 1e9, z0 = 1e9, x1 = -1e9, z1 = -1e9;
  parcels.forEach(p => p.p.forEach(([x, z]) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z); }));
  x0 -= 40; z0 -= 40; x1 += 40; z1 += 40;
  const S = 1024, c = document.createElement('canvas'); c.width = c.height = S; const g = c.getContext('2d');
  const sx = S / (x1 - x0), sz = S / (z1 - z0);
  const fill = u => { u = (u || '').toLowerCase();
    if (/arable/.test(u)) return 'rgba(150,112,58,0.62)'; if (/pasture|meadow|grass/.test(u)) return 'rgba(92,128,48,0.50)';
    if (/wood|coppice|plantation/.test(u)) return 'rgba(36,62,24,0.65)'; if (/house|homestead|garden|orchard|yard/.test(u)) return 'rgba(160,140,96,0.55)';
    return 'rgba(130,120,80,0.40)'; };
  parcels.forEach(p => { g.beginPath(); p.p.forEach(([x, z], i) => { const X = (x - x0) * sx, Y = (z - z0) * sz; i ? g.lineTo(X, Y) : g.moveTo(X, Y); }); g.closePath();
    g.fillStyle = fill(p.use); g.fill(); g.lineWidth = 3; g.strokeStyle = 'rgba(52,32,14,0.95)'; g.stroke(); });
  // plan numbers
  g.fillStyle = 'rgba(30,18,8,.95)'; g.font = '600 11px system-ui,sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  parcels.forEach(p => { if (p.no == null) return; let cx = 0, cz = 0; p.p.forEach(([x, z]) => { cx += x; cz += z; }); cx /= p.p.length; cz /= p.p.length; g.fillText(String(p.no), (cx - x0) * sx, (cz - z0) * sz); });
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.NoColorSpace; t.flipY = false; t.anisotropy = 4;
  terrainMat.uniforms.eTex.value = t; terrainMat.uniforms.eBox.value.set(x0, z0, x1 - x0, z1 - z0);
}


// ---------- v0.4.0 Uber H3 cells (res 14 and up), computed in the browser with h3-js ----------
// The lat/lon <-> local frame map is a quadratic least-squares fit on the 8,514 corners of the v0.2.1 res-11 cells
// (max residual 0.07 m over the estate). Cells are drawn round the view centre only: res 14 cells are about 2.7 m
// across and res 15 about 1 m, far too many to draw for the whole area at once.
const H3G = { lat0: 51.45433697498172, lon0: -3.201914690950035, x0: -416.0149753347427, z0: 497.2238195912614, cx: [-416.01475416475955, 69480.72725595173, 1825.221286677779, 4.884737742723383, -1511.5747277332794, -13.75766861736163], cz: [497.25126030588467, 1140.3981202128734, -111210.3229573177, -478.98222038823127, -0.4172564021823311, -24.4866011039174], cla: [51.45433722162972, 0.0001475468905387393, -0.00898954928899309, -8.911350286010372e-07, -5.704671631665943e-08, -1.833327734832167e-08], clo: [-3.201914700614473, 0.014388604356141517, 0.00023615061296185688, 5.504497783160922e-08, -2.8127321177566013e-06, -2.9696507156859073e-08] };
const H3R = { 14: 200, 15: 75 }; // radius (m) drawn round the view centre: about 20k cells at either resolution
function llToXZ(lat, lng) { const u = lng - H3G.lon0, v = lat - H3G.lat0, f = [1, u, v, u * u, u * v, v * v]; let x = 0, z = 0;
  for (let i = 0; i < 6; i++) { x += H3G.cx[i] * f[i]; z += H3G.cz[i] * f[i]; } return [x, z]; }
function xzToLL(x, z) { const u = (x - H3G.x0) / 1000, v = (z - H3G.z0) / 1000, f = [1, u, v, u * u, u * v, v * v]; let la = 0, lo = 0;
  for (let i = 0; i < 6; i++) { la += H3G.cla[i] * f[i]; lo += H3G.clo[i] * f[i]; } return [la, lo]; }
let h3lib = null;
function loadH3() {
  if (h3lib) return Promise.resolve(h3lib); if (window.h3 && window.h3.polygonToCells) return Promise.resolve(h3lib = window.h3);
  return new Promise((ok, no) => { const s = document.createElement('script'); s.src = new URL('vendor/h3-js.umd.js?v=4.1.0', import.meta.url).href;
    s.onload = () => (window.h3 && window.h3.polygonToCells) ? ok(h3lib = window.h3) : no(new Error('h3-js did not load'));
    s.onerror = () => no(new Error('h3-js did not load')); document.head.appendChild(s); });
}
const h3v = { mesh: null, cx: 1e9, cz: 1e9, r: 0, res: 0, vex: 0, n: 0, tick: 0 };
function updateH3(force) {
  if (!h3lib) return;
  if (!state.h3) { if (h3v.mesh) h3v.mesh.visible = false; return; }
  const t = controls.target, d = camera.position.distanceTo(t);
  const r = Math.round(Math.min(H3R[state.h3res] || 75, Math.max(30, d * 0.7)) / 5) * 5;
  if (h3v.mesh) h3v.mesh.material.opacity = Math.max(0.22, Math.min(0.7, 0.8 - d / 1600));
  if (!force && h3v.mesh && h3v.res === state.h3res && h3v.vex === state.vex && Math.abs(r - h3v.r) <= h3v.r * 0.2
    && Math.hypot(t.x - h3v.cx, t.z - h3v.cz) < h3v.r * 0.3) { h3v.mesh.visible = true; return; }
  const ring = []; for (let k = 0; k < 32; k++) { const a = k / 32 * Math.PI * 2; ring.push(xzToLL(t.x + Math.cos(a) * r, t.z + Math.sin(a) * r)); }
  const cells = h3lib.polygonToCells(ring, state.h3res);
  const pos = new Float32Array(cells.length * 36); let n = 0;
  for (const c of cells) { const b = h3lib.cellToBoundary(c), m = b.length, P = [];
    for (let k = 0; k < m; k++) { const [x, z] = llToXZ(b[k][0], b[k][1]); P.push(x, hAt(x, z) + 0.45, z); }
    for (let k = 0; k < m; k++) { const q = ((k + 1) % m) * 3, p = k * 3;
      if (n + 6 > pos.length) break;
      pos[n++] = P[p]; pos[n++] = P[p + 1]; pos[n++] = P[p + 2]; pos[n++] = P[q]; pos[n++] = P[q + 1]; pos[n++] = P[q + 2]; } }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos.subarray(0, n), 3));
  if (!h3v.mesh) { h3v.mesh = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6, depthWrite: false }));
    h3v.mesh.frustumCulled = false; h3v.mesh.renderOrder = 2; scene.add(h3v.mesh); }
  else { h3v.mesh.geometry.dispose(); h3v.mesh.geometry = geo; }
  Object.assign(h3v, { cx: t.x, cz: t.z, r, res: state.h3res, vex: state.vex, n: cells.length }); h3v.mesh.visible = true;
  h3v.mesh.material.opacity = Math.max(0.22, Math.min(0.7, 0.8 - d / 1600)); perf.h3cells = cells.length; perf.h3res = state.h3res;
}
const h3cnt = new Map();
function h3Count(p, res) { // exact count of res-N cells whose centres fall inside a parcel, cached
  if (!h3lib || !p.rings) return 0; const k = p.id + '/' + res; if (h3cnt.has(k)) return h3cnt.get(k);
  let n = 0; try { p.rings.forEach(rg => { n += h3lib.polygonToCells(rg.map(([x, z]) => xzToLL(x, z)), res).length; }); } catch (e) { n = 0; }
  h3cnt.set(k, n); return n;
}
function applyBld() {
  if (world.buildings) { world.buildings.mesh.visible = state.bld; if (world.buildings.keepMesh) world.buildings.keepMesh.visible = state.bld; }
}
function syncToggles() {
  const a = $('#tgh3'), b = $('#tgbld'); if (a) a.setAttribute('aria-pressed', String(state.h3)); if (b) b.setAttribute('aria-pressed', String(state.bld));
}

// ---------- v0.2.0 parcels + H3 layer (Tithe H3 data) ----------
const ovl = { data: null, h3: null, canvas: null, tex: null, box: null };
const PHUE = i => (i * 137.508) % 360;
function parcelColour(i, a) { return `hsla(${PHUE(i).toFixed(0)},85%,58%,${a})`; }
function drawOverlay() {
  if (!ovl.data || !terrainMat) return;
  const [bx, bz, bw, bh] = ovl.box, S = ovl.canvas.width, g = ovl.canvas.getContext('2d');
  const sx = S / bw, sz = S / bh, X = x => (x - bx) * sx, Y = z => (z - bz) * sz;
  g.clearRect(0, 0, S, S);
  const path = r => { g.beginPath(); r.forEach(([x, z], i) => i ? g.lineTo(X(x), Y(z)) : g.moveTo(X(x), Y(z))); g.closePath(); };
  if (state.parcels) ovl.data.parcels.forEach((p, i) => { if (!p.rings || state.hidden.has(p.id)) return;
    p.rings.forEach(r => { path(r); g.fillStyle = parcelColour(i, state.sel === p.id ? 0.62 : 0.42); g.fill(); }); });
  // v0.4.0: H3 cells are drawn as their own draped line layer (updateH3), not on this texture
  if (state.parcels) ovl.data.parcels.forEach((p, i) => { if (!p.rings || state.hidden.has(p.id)) return; const on = state.sel === p.id;
    p.rings.forEach(r => { path(r); g.lineWidth = on ? 7 : 3.5; g.strokeStyle = on ? '#ffe14a' : `hsla(${PHUE(i).toFixed(0)},90%,30%,0.95)`; g.stroke(); }); });
  if (state.parcels && state.labels) { g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '700 22px system-ui,sans-serif';
    ovl.data.parcels.forEach(p => { if (!p.rings || state.hidden.has(p.id)) return; const c = p.c;
      g.lineWidth = 4; g.strokeStyle = 'rgba(0,0,0,0.75)'; g.strokeText(p.id, X(c[0]), Y(c[1])); g.fillStyle = '#fff'; g.fillText(p.id, X(c[0]), Y(c[1])); }); }
  ovl.tex.needsUpdate = true;
  terrainMat.uniforms.oOn.value = state.parcels ? 1 : 0;
}
function buildOverlay(pd, hd) {
  ovl.data = pd; ovl.h3 = hd; ovl.box = pd.meta.box;
  pd.parcels.forEach(p => { if (!p.rings) return; let A = 0, cx = 0, cz = 0;
    p.rings.forEach(r => { for (let i = 0, j = r.length - 1; i < r.length; j = i++) { const f = r[j][0] * r[i][1] - r[i][0] * r[j][1]; A += f; cx += (r[j][0] + r[i][0]) * f; cz += (r[j][1] + r[i][1]) * f; } });
    p.c = Math.abs(A) > 1e-6 ? [cx / (3 * A), cz / (3 * A)] : p.rings[0][0]; });
  const S = PHONE ? 2048 : 4096; ovl.canvas = document.createElement('canvas'); ovl.canvas.width = ovl.canvas.height = Math.min(S, renderer.capabilities.maxTextureSize);
  ovl.tex = new THREE.CanvasTexture(ovl.canvas); ovl.tex.colorSpace = THREE.NoColorSpace; ovl.tex.flipY = false; ovl.tex.anisotropy = 8;
  ovl.tex.generateMipmaps = true; ovl.tex.minFilter = THREE.LinearMipmapLinearFilter;
  terrainMat.uniforms.oTex.value = ovl.tex; terrainMat.uniforms.oBox.value.set(...ovl.box);
  buildParcelList(); drawOverlay();
}
function inPoly(x, z, r) { let c = false; for (let i = 0, j = r.length - 1; i < r.length; j = i++) { const a = r[i], b = r[j]; if ((a[1] > z) !== (b[1] > z) && x < (b[0] - a[0]) * (z - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; }
function parcelAt(x, z) { return ovl.data && ovl.data.parcels.find(p => p.rings && !state.hidden.has(p.id) && p.rings.some(r => inPoly(x, z, r))); }
function showParcel(p) {
  state.sel = p ? p.id : null; drawOverlay();
  const box = $('#w3dpar'); if (!p) { box.hidden = true; return; }
  const bits = [p.label === p.id ? 'Plan parcel ' + p.id : p.label.replace(/^./, s => s.toUpperCase())];
  if (p.plot) bits.push('1841 tithe plot ' + p.plot); if (p.name) bits.push('field name: ' + p.name); if (p.use) bits.push(p.use);
  if (p.tarea) bits.push('1841 area as entered: ' + p.tarea); if (p.area) bits.push('traced: ' + p.area + ' ac');
  if (p.occ) bits.push('1841 occupier as entered: ' + p.occ); if (p.owner) bits.push('1841 landowner as entered: ' + p.owner);
  { const n14 = h3Count(p, 14); if (n14) bits.push('Uber H3: ' + n14.toLocaleString('en-GB') + ' res-14 cells'); } if (p.grid) bits.push(p.grid);
  if (p.src) bits.push('outline from: ' + p.src);
  box.innerHTML = ''; const b = document.createElement('b'); b.textContent = bits.shift(); box.appendChild(b);
  const s = document.createElement('span'); s.textContent = bits.join(' · '); box.appendChild(s);
  const recs = central && central.items ? Object.values(central.items) : [];
  if (recs.length) { const r = document.createElement('small'); r.className = 'w3drec'; r.append('Records: ');
    recs.forEach((it, k) => { if (k) r.append(' · '); const l = document.createElement('a'); l.target = '_top';
      l.href = it.page ? 'https://cedwyn.bucklerfamily.estate' + it.page : 'https://bucklerfamily.estate/catalogue/?id=' + encodeURIComponent(it.id);
      l.textContent = it.id + (it.date_display ? ' (' + it.date_display + ')' : ''); l.title = it.title || it.id; r.appendChild(l); });
    box.appendChild(r); }
  const x = document.createElement('button'); x.type = 'button'; x.textContent = '×'; x.setAttribute('aria-label', 'Close'); x.onclick = () => showParcel(null); box.appendChild(x);
  box.hidden = false;
}
function buildParcelList() {
  const ul = $('#plist'); if (!ul) return; ul.innerHTML = '';
  ovl.data.parcels.forEach((p, i) => { const li = document.createElement('li');
    if (p.rings) { const lb = document.createElement('label'), cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = !state.hidden.has(p.id); cb.dataset.pid = p.id;
      cb.onchange = () => { cb.checked ? state.hidden.delete(p.id) : state.hidden.add(p.id); if (!cb.checked && state.sel === p.id) showParcel(null); else drawOverlay(); };
      const sw = document.createElement('i'); sw.style.background = parcelColour(i, 1);
      const t = document.createElement('span'); t.textContent = (p.label === p.id ? p.id : p.label) + (p.use ? ' · ' + p.use : '');
      lb.append(cb, sw, t); li.appendChild(lb);
      const go = document.createElement('button'); go.type = 'button'; go.textContent = '◎'; go.title = 'Show'; go.setAttribute('aria-label', 'Go to parcel ' + p.id);
      go.onclick = () => { state.hidden.delete(p.id); cb.checked = true; views['p' + p.id] = [p.c[0], p.c[1], 340, 55, 10]; flyTo('p' + p.id); showParcel(p); }; li.appendChild(go);
    } else { li.className = 'np'; li.textContent = p.id + ' · not placed'; li.title = p.status || ''; }
    ul.appendChild(li); });
}
function setAllParcels(on) { state.hidden = on ? new Set() : new Set(ovl.data.parcels.filter(p => p.rings).map(p => p.id));
  document.querySelectorAll('#plist input[data-pid]').forEach(c => c.checked = on); if (!on) showParcel(null); else drawOverlay(); }
// tap/click on the ground: march the view ray down to the LiDAR surface, then find the parcel
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
function groundHit(cx, cy) {
  const r = canvas.getBoundingClientRect(); ndc.set((cx - r.left) / r.width * 2 - 1, -(cy - r.top) / r.height * 2 + 1); ray.setFromCamera(ndc, camera);
  const o = ray.ray.origin, d = ray.ray.direction; let t = 0, step = 2 + camera.position.distanceTo(controls.target) / 200;
  for (let k = 0; k < 4000 && t < 20000; k++) { const x = o.x + d.x * t, z = o.z + d.z * t; if (Math.abs(x) > 2000 || Math.abs(z) > 2000) { if (d.y >= 0) return null; }
    else if (o.y + d.y * t <= hAt(x, z)) { return [x, z]; } t += step; }
  return null;
}

// ---------- sky and sun (always clear) ----------
const tmp = new THREE.Vector3();
function applySky() {
  const { alt, az } = sunPos(simDate());
  // three: x east, z south. az from north clockwise.
  const dir = tmp.set(Math.sin(az) * Math.cos(alt), Math.sin(alt), -Math.cos(az) * Math.cos(alt)).normalize();
  su.sunPosition.value.copy(dir);
  const day = THREE.MathUtils.smoothstep(Math.sin(alt), -0.12, 0.12), low = 1 - THREE.MathUtils.smoothstep(Math.sin(alt), 0.0, 0.45);
  // v0.2.0: always clear — no weather, no fog, no haze
  su.turbidity.value = 2; su.rayleigh.value = 2.2;
  sun.position.copy(dir).multiplyScalar(3000); sun.target.position.set(0, 0, 0);
  const sc = new THREE.Color().setRGB(1, 0.94 - 0.3 * low, 0.86 - 0.5 * low);
  const sunI = day * 2.6;
  sun.color.copy(sc); sun.intensity = Math.max(0, sunI);
  const skyC = new THREE.Color().setRGB(0.36, 0.44, 0.58).multiplyScalar(0.12 + 0.9 * day);
  hemi.color.copy(skyC); hemi.groundColor.setRGB(0.12, 0.1, 0.06).multiplyScalar(0.15 + 0.85 * day); hemi.intensity = 1.6;
  renderer.setClearColor(new THREE.Color().setRGB(0.42, 0.6, 0.85).multiplyScalar(0.08 + 0.92 * day));
  sky.visible = true;
  if (terrainMat) {
    const U = terrainMat.uniforms; U.sunDir.value.copy(dir); U.sunCol.value.copy(sc).multiplyScalar(Math.max(0, sunI) * 0.6);
    U.skyCol.value.copy(skyC).multiplyScalar(0.8); U.gndCol.value.copy(hemi.groundColor).multiplyScalar(0.4); U.wet.value = 0;
  }
  renderer.toneMappingExposure = 0.68 + (1 - day) * 0.4;
  const d = simDate(); $('#hourv').textContent = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' }) + (state.hour == null ? ' now' : '');
  return { alt, az };
}
function applyEra() {
  const on = state.era === '1841';
  terrainMat.uniforms.era.value = on ? 1 : 0;
  if (world.buildings) { const m = world.buildings.mesh.material; m.opacity = on ? 0.13 : 1; m.depthWrite = !on; m.needsUpdate = true; }
  info(on ? '1841: tithe parcels on today’s ground. Modern buildings shown faded; the farmhouse and church stand solid.' : '');
  document.querySelectorAll('input[name=era]').forEach(r => r.checked = r.value === state.era);
}
function applyLayers() {
  terrainMat.uniforms.ctr.value = state.contours ? 1 : 0; $('#ctr').checked = state.contours;
  [world.trees, world.shrubs, world.trunks].forEach(m => m && (m.visible = state.trees)); $('#trees').checked = state.trees;
  world.labels.forEach(s => s.visible = state.labels); $('#lbl').checked = state.labels; applyBld(); drawOverlay();
}
function applyVex() {
  terrainMat.uniforms.vex.value = state.vex; $('#vexv').textContent = '×' + state.vex;
  reseat(world.trees); reseat(world.shrubs); reseat(world.trunks);
  world.labels.forEach(s => s.position.y = hAt(s.userData.x, s.userData.z) + s.userData.dy);
  if (world.buildings) { scene.remove(world.buildings.mesh); world.buildings.keepMesh && scene.remove(world.buildings.keepMesh); world.buildings = buildBuildings(world.blist); applyEra(); }
}

// ---------- camera presets ----------
const views = {};
function flyTo(name) {
  const v = views[name]; if (!v) return; const [tx, tz, dist, el, azd] = v;
  const ty = hAt(tx, tz); const az = azd * Math.PI / 180, e = el * Math.PI / 180;
  const to = new THREE.Vector3(tx, ty, tz), from = new THREE.Vector3(tx + Math.sin(az) * Math.cos(e) * dist, ty + Math.sin(e) * dist, tz + Math.cos(az) * Math.cos(e) * dist);
  const sT = controls.target.clone(), sP = camera.position.clone(), st = performance.now();
  (function step() { const k = Math.min(1, (performance.now() - st) / 1400), s = k * k * (3 - 2 * k);
    controls.target.lerpVectors(sT, to, s); camera.position.lerpVectors(sP, from, s); if (k < 1) requestAnimationFrame(step); })();
}

// ---------- steering (local parser; an LLM parser can replace parseSteer behind the same JSON patch) ----------
export function parseSteer(text) {
  const t = text.toLowerCase(), p = {};
  const hm = t.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/);
  if (/dawn|sunrise/.test(t)) p.hour = 7.25; else if (/morning/.test(t)) p.hour = 9; else if (/noon|midday/.test(t)) p.hour = 12.5;
  else if (/afternoon/.test(t)) p.hour = 15; else if (/dusk|sunset|evening/.test(t)) p.hour = 16.75; else if (/night|midnight/.test(t)) p.hour = 22.5;
  else if (/\bnow\b/.test(t)) p.hour = null;
  else if (hm && !/18[0-9]{2}|19[0-9]{2}|20[0-9]{2}/.test(hm[0]) && (hm[2] || hm[3])) { let h = +hm[1] % 12 + (hm[3] === 'pm' ? 12 : 0); if (!hm[3]) h = +hm[1]; p.hour = Math.min(24, h + (hm[2] ? +hm[2] / 60 : 0)); }
  if (/18[34]\d|tithe|1841|1840|past|back in time/.test(t)) p.era = '1841'; else if (/today|present|modern|now day/.test(t)) p.era = 'today';
  if (/contour/.test(t)) p.contours = !/no |off|hide/.test(t);
  if (/church|dochdwy/.test(t)) p.camera = 'church'; else if (/ty mawr|tŷ mawr|great house|farm|house/.test(t)) p.camera = 'tymawr';
  else if (/river|ely/.test(t)) p.camera = 'ely'; else if (/whole|everything|overview|wide/.test(t)) p.camera = 'wide';
  if (/sheep|cattle|cow|flock|horse/.test(t)) p.spawn = 'not yet available';
  return p;
}
export function applyPatch(p) {
  if ('hour' in p) state.hour = p.hour; if (p.era) state.era = p.era;
  if ('contours' in p) state.contours = p.contours;
  applySky(); applyEra(); applyLayers(); syncUi(); if (p.camera) flyTo(p.camera); audio.update();
}
function syncUi() { $('#hour').value = state.hour == null ? (simDate().getHours() + simDate().getMinutes() / 60) : state.hour; }

// ---------- audio (procedural; no recordings needed) ----------
const audio = { ctx: null, nodes: {}, update() {} };
function startAudio() {
  const ctx = audio.ctx = new (window.AudioContext || window.webkitAudioContext)();
  const len = ctx.sampleRate * 2, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
  let b = 0; for (let i = 0; i < len; i++) { b = 0.97 * b + 0.03 * (Math.random() * 2 - 1); d[i] = b * 3; }
  const mk = (f, q) => { const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true; const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f; bp.Q.value = q; const g = ctx.createGain(); g.gain.value = 0; s.connect(bp).connect(g).connect(ctx.destination); s.start(); return g; };
  audio.nodes.wind = mk(420, 0.6); audio.nodes.rain = mk(2600, 0.4);
  // the River Ely: positional water noise
  const ws = ctx.createBufferSource(); ws.buffer = buf; ws.loop = true; const wf = ctx.createBiquadFilter(); wf.type = 'highpass'; wf.frequency.value = 900;
  const pan = ctx.createPanner(); pan.panningModel = 'HRTF'; pan.distanceModel = 'exponential'; pan.refDistance = 60; pan.rolloffFactor = 1.4;
  const wg = ctx.createGain(); wg.gain.value = 0.5; ws.connect(wf).connect(wg).connect(pan).connect(ctx.destination); ws.start(); audio.nodes.ely = pan;
  if (world.anchors.ely) { pan.positionX.value = world.anchors.ely[0]; pan.positionY.value = hAt(...world.anchors.ely); pan.positionZ.value = world.anchors.ely[1]; }
  audio.update = () => { if (!audio.ctx) return; const on = state.sound ? 1 : 0, alt = Math.max(0, camera.position.y - hAt(camera.position.x, camera.position.z));
    audio.nodes.wind.gain.setTargetAtTime(on * (0.05 + Math.min(0.25, alt / 2000)) * 1, ctx.currentTime, 0.4);
    audio.nodes.rain.gain.setTargetAtTime(0, ctx.currentTime, 0.4); wg.gain.value = on * 0.5; };
  // a bell at the church on the hour (synthesised)
  let lastHour = -1;
  setInterval(() => { if (!state.sound || !world.anchors.church) return; const d = simDate(); if (d.getMinutes() === 0 && d.getHours() !== lastHour) { lastHour = d.getHours(); bell((d.getHours() % 12) || 12); } }, 5000);
  function bell(n) { const p = ctx.createPanner(); p.refDistance = 120; p.positionX.value = world.anchors.church[0]; p.positionZ.value = world.anchors.church[1]; p.connect(ctx.destination);
    for (let i = 0; i < n; i++) { const t = ctx.currentTime + i * 2.2; [1, 2.0, 2.76, 5.4].forEach((m, j) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = 392 * m; g.gain.setValueAtTime(0.25 / (j + 1), t); g.gain.exponentialRampToValueAtTime(0.0001, t + 3.5); o.connect(g).connect(p); o.start(t); o.stop(t + 3.6); }); } }
}

// ---------- UI ----------
function wireUi() {
  document.querySelectorAll('input[name=era]').forEach(r => r.onchange = () => applyPatch({ era: r.value }));
  $('#ctr').onchange = e => applyPatch({ contours: e.target.checked });
  $('#trees').onchange = e => { state.trees = e.target.checked; applyLayers(); };
  $('#lbl').onchange = e => { state.labels = e.target.checked; applyLayers(); };
  $('#hour').oninput = e => { state.hour = +e.target.value; applySky(); };
  $('#now').onclick = () => applyPatch({ hour: null });
  $('#tgh3').onclick = () => { state.h3 = !state.h3; syncToggles(); updateH3(false); };
  $('#tgbld').onclick = () => { state.bld = !state.bld; syncToggles(); applyBld(); };
  $('#h3res').onchange = e => { state.h3res = Math.max(14, +e.target.value || 14); updateH3(true); };
  $('#paron').onchange = e => { state.parcels = e.target.checked; if (!state.parcels) showParcel(null); else drawOverlay(); };
  $('#pall').onclick = () => setAllParcels(true); $('#pnone').onclick = () => setAllParcels(false);
  let down = null;
  canvas.addEventListener('pointerdown', e => { down = [e.clientX, e.clientY, performance.now()]; });
  canvas.addEventListener('pointerup', e => { if (!down) return; const moved = Math.hypot(e.clientX - down[0], e.clientY - down[1]), dt = performance.now() - down[2]; down = null;
    if (moved > 8 || dt > 600 || !state.parcels) return; const h = groundHit(e.clientX, e.clientY); showParcel(h ? parcelAt(h[0], h[1]) || null : null); });
  $('#vex').onchange = e => { state.vex = +e.target.value; applyVex(); };
  $('#snd').onclick = e => { state.sound = !state.sound; if (state.sound && !audio.ctx) startAudio(); if (audio.ctx && audio.ctx.state === 'suspended') audio.ctx.resume();
    e.target.textContent = state.sound ? 'Sound on' : 'Sound off'; e.target.setAttribute('aria-pressed', state.sound); audio.update(); };
  document.querySelectorAll('[data-go]').forEach(b => b.onclick = () => flyTo(b.dataset.go));
  $('#steer').onsubmit = async e => { e.preventDefault(); const txt = $('#steert').value.trim(); if (!txt) return;
    const patch = await backend.steer(txt); $('#steero').textContent = Object.keys(patch).length ? 'Applied: ' + JSON.stringify(patch) : 'Not understood yet. Try “dusk” or “go back to 1840”.'; };
}

// ---------- resize / loop ----------
function resize() { const w = canvas.clientWidth, h = canvas.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
addEventListener('resize', resize);
let last = performance.now(), acc = 0, fr = 0, lowFor = 0, skyTick = 0;
function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000); last = now; acc += dt; fr++;
  if (acc >= 1) { perf.fps = Math.round(fr / acc); acc = 0; fr = 0;
    if (perf.fps < 28 && dpr > 0.75) { if (++lowFor >= 2) { dpr = Math.max(0.75, dpr - 0.25); renderer.setPixelRatio(dpr); resize(); lowFor = 0; } } else lowFor = 0;
    perf.dpr = dpr; perf.tris = renderer.info.render.triangles; perf.calls = renderer.info.render.calls; }
  controls.update();
  const gy = hAt(camera.position.x, camera.position.z) + 6; if (camera.position.y < gy) camera.position.y = gy;
  const nr = Math.min(40, Math.max(1, (camera.position.y - gy) * 0.04)); if (Math.abs(nr - camera.near) > 0.5) { camera.near = nr; camera.updateProjectionMatrix(); }
  if (terrainMat) terrainMat.uniforms.time.value = now / 1000;
  if ((h3v.tick += dt) > 0.4) { h3v.tick = 0; updateH3(false); applyBld(); }
  if ((skyTick += dt) > 30 && state.hour == null) { skyTick = 0; applySky(); }
  if (audio.ctx && audio.ctx.listener.positionX) { const L = audio.ctx.listener; L.positionX.value = camera.position.x; L.positionY.value = camera.position.y; L.positionZ.value = camera.position.z; }
  renderer.render(scene, camera); perf.frames++;
  requestAnimationFrame(frame);
}

// ---------- boot ----------
let backend;
(async function boot() {
  try {
    resize();
    const man = await getJ('world.json');
    const [hTex, cTex, bl, rl, tb, sb, pj, p59, h3j] = await Promise.all([
      loadHeights(man.meta),
      new THREE.TextureLoader().setCrossOrigin('anonymous').loadAsync(D + 'cover2m.png?v=0.2.0'),
      Promise.all(man.buildings.map(getJ)).then(a => a.flat()),
      Promise.all(man.rivers.map(getJ)).then(a => a.flat()),
      fetch(D + 'trees.bin?v=0.2.0').then(r => r.arrayBuffer()),
      fetch(D + 'shrubs.bin?v=0.2.0').then(r => r.arrayBuffer()),
      getJ('parcels1841.json'), getJ('parcels59.json'), Promise.resolve(null)]);
    const wj = { meta: man.meta, buildings: bl, rivers: rl };
    cTex.flipY = false; cTex.colorSpace = THREE.NoColorSpace; cTex.anisotropy = 4; cTex.needsUpdate = true;
    buildTerrain(hTex, cTex);
    const meta = wj.meta;
    const anchor = [meta.anchor.os[0] - 317000, 174000 - meta.anchor.os[1]];
    // farmhouse = the building whose footprint holds the anchor point; church = OSM place of worship nearest the farmhouse
    const inside = (pt, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const a = poly[i], b = poly[j]; if ((a[1] > pt[1]) !== (b[1] > pt[1]) && pt[0] < (b[0] - a[0]) * (pt[1] - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; };
    const ch = (meta.churches || []).slice().sort((p, q) => Math.hypot(p[0] - anchor[0], p[1] - anchor[1]) - Math.hypot(q[0] - anchor[0], q[1] - anchor[1]))[0];
    wj.buildings.forEach(b => { if (inside(anchor, b.p) || (ch && inside([ch[0], ch[1]], b.p))) b.keep1841 = true; });
    world.blist = wj.buildings; world.buildings = buildBuildings(wj.buildings);
    world.anchors.tymawr = anchor; if (ch) world.anchors.church = [ch[0], ch[1]];
    const ely = wj.rivers.filter(r => /ely/i.test(r.n || '') && r.c === 'river').flatMap(r => r.p);
    if (ely.length) { const near = ely.slice().sort((p, q) => Math.hypot(p[0] - anchor[0], p[1] - anchor[1]) - Math.hypot(q[0] - anchor[0], q[1] - anchor[1]))[0]; world.anchors.ely = near; }
    // vegetation from LiDAR canopy heights
    const leaf = PHONE ? new THREE.IcosahedronGeometry(1, 0) : new THREE.IcosahedronGeometry(1, 1);
    const tcol = (c, i, h) => c.setRGB(0.07 + 0.05 * hash(i), 0.12 + 0.07 * hash(i + 1), 0.035 + 0.03 * hash(i + 4));
    world.trees = loadInst(tb, PHONE ? 7000 : 30000, leaf, () => new THREE.MeshStandardMaterial({ roughness: 0.95, flatShading: true }),
      (h, i) => { const r = Math.min(7.5, Math.max(1.8, h * 0.3)) * (0.85 + 0.3 * hash(i + 9)), sy = Math.max(1.2, h * 0.42); return [r, sy, h - sy]; }, tcol);
    if (!PHONE) world.trunks = loadInst(tb, 30000, new THREE.CylinderGeometry(0.18, 0.28, 1, 5, 1, true), () => new THREE.MeshStandardMaterial({ color: 0x3a2c1e, roughness: 1 }),
      (h) => { const t = Math.max(1, h * 0.3); return [1.2, t, t / 2]; }, c => c.setRGB(1, 1, 1));
    world.shrubs = loadInst(sb, PHONE ? 3500 : 20000, new THREE.IcosahedronGeometry(1, 0), () => new THREE.MeshStandardMaterial({ roughness: 1, flatShading: true }),
      (h, i) => [1.3 + 0.5 * hash(i), h * 0.55, h * 0.45], (c, i) => c.setRGB(0.09 + 0.05 * hash(i), 0.14 + 0.06 * hash(i + 1), 0.04));
    build1841(pj); buildOverlay(p59, h3j);
    // labels
    label('Tŷ Mawr (Great House)', anchor[0], anchor[1], 22, 1.1);
    if (ch) label(ch[2] || 'Church', ch[0], ch[1], 30, 0.9);
    if (world.anchors.ely) label('River Ely', world.anchors.ely[0], world.anchors.ely[1], 24, 0.9);
    label('Cardiff ↗', 1400, -1700, 60, 0.85); label('Penarth ↘', 1500, 1500, 60, 0.85); label('Leckwith', -1150, -900, 50, 0.85);
    views.tymawr = [anchor[0], anchor[1], 260, 24, 150]; views.church = ch ? [ch[0], ch[1], 180, 22, 200] : views.tymawr;
    views.ely = world.anchors.ely ? [world.anchors.ely[0], world.anchors.ely[1], 520, 26, 200] : views.tymawr; views.wide = [0, 0, 4600, 52, 15];
    { const [bx, bz, bw, bh] = p59.meta.box; views.estate = [bx + bw / 2, bz + bh / 2, 1900, 58, 10]; } // from the south, north at the top like a map
    // opening view: over the estate from the south-east, looking north-west across the Ely valley
    const tx = anchor[0], tz = anchor[1], ty = hAt(tx, tz);
    controls.target.set(tx, ty, tz); camera.position.set(tx + 650, ty + 330, tz + 820);
    if (Q.get('view') && views[Q.get('view')]) { const [x, z, d, e, a] = views[Q.get('view')]; const az = a * Math.PI / 180, el = e * Math.PI / 180;
      controls.target.set(x, hAt(x, z), z); camera.position.set(x + Math.sin(az) * Math.cos(el) * d, hAt(x, z) + Math.sin(el) * d, z + Math.cos(az) * Math.cos(el) * d); }
    if (Q.get('cam')) { const [x, z, d, e, a] = Q.get('cam').split(',').map(Number); if ([x, z, d, e, a].every(Number.isFinite)) { const az = a * Math.PI / 180, el = e * Math.PI / 180; // v0.2.1: fixed review cameras, ?cam=x,z,dist,elev,az
      controls.target.set(x, hAt(x, z), z); camera.position.set(x + Math.sin(az) * Math.cos(el) * d, hAt(x, z) + Math.sin(el) * d, z + Math.cos(az) * Math.cos(el) * d); } }
    if (Q.get('era') === '1841') state.era = '1841';
    if (Q.get('h3') === '0') state.h3 = false; if (Q.get('bld') === '0') state.bld = false;
    if (Q.get('h3res') && +Q.get('h3res') >= 14 && +Q.get('h3res') <= 15) { state.h3res = +Q.get('h3res'); $('#h3res').value = String(state.h3res); }
    if (Q.get('hour')) state.hour = +Q.get('hour'); else if (sunPos(new Date()).alt < 12 * Math.PI / 180) state.hour = 12; // clear daylight by default
    backend = createBackend({ THREE, scene, camera, renderer, state, applyPatch, parseSteer, flyTo, simDate });
    await backend.init();
    applySky(); applyEra(); applyLayers(); syncUi(); wireUi(); syncToggles();
    loadH3().then(() => updateH3(true)).catch(e => { console.warn(e); info('The H3 cells could not load on this device.'); });
    $('#w3dload').classList.add('done'); perf.loadMs = Math.round(performance.now() - t0);
    perf.buildings = wj.buildings.length; perf.trees = world.trees.count; perf.shrubs = world.shrubs.count;
    requestAnimationFrame(frame);
  } catch (err) { console.error(err); $('#w3dload').textContent = 'The 3D view could not start on this device: ' + (err.message || err); window.__w3derr = String(err && err.stack || err); }
})();
