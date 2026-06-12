// ============================================================
// ThreatCube hero — interactive 3D threat cube
// Asset (X) × Interface (Y) × STRIDE (Z), colored by risk level.
// Auto-rotates; drag to orbit. Glow via UnrealBloom.
// ============================================================
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

const RISK = {
  na:   { c: 0x9ca3af, e: 0.18, s: 0.60, w: 30 },
  low:  { c: 0x22c55e, e: 0.55, s: 0.66, w: 24 },
  med:  { c: 0xf59e0b, e: 0.70, s: 0.78, w: 20 },
  high: { c: 0xef4444, e: 0.95, s: 0.90, w: 16 },
  crit: { c: 0xd946ef, e: 1.20, s: 1.02, w: 10 },
};

const stage = document.getElementById("cube-stage");
const canvas = document.getElementById("cube-canvas");

function showFallback() {
  const fb = document.querySelector(".cube-fallback");
  if (fb) fb.style.display = "flex";
}

function init() {
  if (!stage || !canvas) return;
  // WebGL support probe
  try {
    const test = document.createElement("canvas");
    if (!(test.getContext("webgl") || test.getContext("experimental-webgl"))) {
      showFallback();
      return;
    }
  } catch (e) { showFallback(); return; }

  const W = () => stage.clientWidth || 480;
  const H = () => stage.clientHeight || 480;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W(), H(), false);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(38, W() / H(), 0.1, 100);
  camera.position.set(7.4, 5.2, 8.6);

  // ---- lights ----
  scene.add(new THREE.AmbientLight(0x5b6276, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(6, 9, 7);
  scene.add(key);
  const rim = new THREE.PointLight(0x8b5cf6, 22, 40);
  rim.position.set(-7, -3, 5);
  scene.add(rim);
  const rim2 = new THREE.PointLight(0xa98bff, 14, 40);
  rim2.position.set(4, 6, -6);
  scene.add(rim2);

  const group = new THREE.Group();
  scene.add(group);

  // ---- dimensions ----
  const NX = 5, NY = 5, NZ = 6, GAP = 1.3;
  const off = (n) => -((n - 1) * GAP) / 2;
  const ox = off(NX), oy = off(NY), oz = off(NZ);

  // deterministic PRNG so the cube always looks balanced
  let seed = 1337;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  const pickRisk = () => {
    const total = Object.values(RISK).reduce((a, r) => a + r.w, 0);
    let t = rnd() * total;
    for (const k in RISK) { t -= RISK[k].w; if (t <= 0) return RISK[k]; }
    return RISK.na;
  };

  const geo = new THREE.BoxGeometry(1, 1, 1);
  const cells = [];

  for (let x = 0; x < NX; x++) {
    for (let y = 0; y < NY; y++) {
      for (let z = 0; z < NZ; z++) {
        // ~44% of slots are populated -> sparse "data cube" look
        if (rnd() > 0.44) continue;
        const r = pickRisk();
        const mat = new THREE.MeshStandardMaterial({
          color: r.c,
          emissive: r.c,
          emissiveIntensity: r.e,
          roughness: 0.34,
          metalness: 0.12,
          transparent: true,
          opacity: 0.96,
        });
        const m = new THREE.Mesh(geo, mat);
        const sc = r.s * 0.72;
        m.scale.setScalar(sc);
        m.position.set(ox + x * GAP, oy + y * GAP, oz + z * GAP);
        m.userData = { base: sc, phase: rnd() * Math.PI * 2, crit: r.e };
        group.add(m);
        cells.push(m);
      }
    }
  }

  // ---- wireframe cage around the whole volume ----
  const cageGeo = new THREE.BoxGeometry((NX - 1) * GAP + 1.4, (NY - 1) * GAP + 1.4, (NZ - 1) * GAP + 1.4);
  const cage = new THREE.LineSegments(
    new THREE.EdgesGeometry(cageGeo),
    new THREE.LineBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.22 })
  );
  group.add(cage);

  // faint inner lattice dots at unused-ish corners for depth
  const dotGeo = new THREE.SphereGeometry(0.04, 8, 8);
  const dotMat = new THREE.MeshBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.5 });
  for (let i = 0; i < 26; i++) {
    const d = new THREE.Mesh(dotGeo, dotMat);
    d.position.set(
      ox + Math.floor(rnd() * NX) * GAP,
      oy + Math.floor(rnd() * NY) * GAP,
      oz + Math.floor(rnd() * NZ) * GAP
    );
    group.add(d);
  }

  // ---- controls ----
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.9;
  controls.minPolarAngle = Math.PI * 0.24;
  controls.maxPolarAngle = Math.PI * 0.76;
  controls.target.set(0, 0, 0);

  let interacting = false;
  controls.addEventListener("start", () => { interacting = true; controls.autoRotate = false; });
  controls.addEventListener("end", () => {
    interacting = false;
    setTimeout(() => { if (!interacting) controls.autoRotate = true; }, 2200);
  });

  // ---- bloom ----
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(W(), H()), 0.85, 0.55, 0.08);
  composer.addPass(bloom);
  composer.setSize(W(), H());

  // ---- resize ----
  const onResize = () => {
    const w = W(), h = H();
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    bloom.resolution.set(w, h);
  };
  if (window.ResizeObserver) new ResizeObserver(onResize).observe(stage);
  window.addEventListener("resize", onResize);

  // ---- animate ----
  const clock = new THREE.Clock();
  let raf;
  function loop() {
    raf = requestAnimationFrame(loop);
    const t = clock.getElapsedTime();
    // critical/high cells gently pulse
    for (const m of cells) {
      if (m.userData.crit > 0.85) {
        const p = 1 + Math.sin(t * 2.1 + m.userData.phase) * 0.06;
        m.scale.setScalar(m.userData.base * p);
        m.material.emissiveIntensity = m.userData.crit * (0.85 + Math.sin(t * 2.1 + m.userData.phase) * 0.15);
      }
    }
    controls.update();
    composer.render();
  }
  loop();

  // pause rendering when off-screen (perf)
  if (window.IntersectionObserver) {
    new IntersectionObserver((ents) => {
      ents.forEach((en) => {
        if (en.isIntersecting) { if (!raf) loop(); }
        else { cancelAnimationFrame(raf); raf = null; }
      });
    }, { threshold: 0.05 }).observe(stage);
  }

  stage.classList.add("ready");
}

try { init(); } catch (e) { console.error("[hero-cube]", e); showFallback(); }
