/* ============================================================
   UPPERRIGHT — Hero 3D: physics pile of "L" blocks + green beans
   three.js render · cannon-es physics · pointer repulsion
   Scroll: camera pushes in while the card expands (see main.js)
   ============================================================ */
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

(function () {
  const canvas = document.getElementById('hero3d');
  if (!canvas) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 900px)').matches;

  /* ---------- renderer / scene / camera ---------- */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // free the GPU context when leaving the page (avoids hitting the browser's WebGL context limit),
  // and survive a forced context loss while staying on the page
  window.addEventListener('pagehide', () => { try { renderer.forceContextLoss(); renderer.dispose(); } catch (e) {} });
  canvas.addEventListener('webglcontextlost', (e) => e.preventDefault());
  canvas.addEventListener('webglcontextrestored', () => resize());

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x05080c, 18, 34);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0.4, 15);
  window.__heroCamera = camera; // main.js scrubs camera.position.z

  /* ---------- lights ---------- */
  scene.add(new THREE.AmbientLight(0xbfc8d4, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(6, 9, 7);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -12; key.shadow.camera.right = 12;
  key.shadow.camera.top = 12; key.shadow.camera.bottom = -12;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xc3dc93, 1.0);
  rim.position.set(-7, -3, -6);
  scene.add(rim);
  const fill = new THREE.PointLight(0xc3dc93, 18, 30);
  fill.position.set(-4, 4, 6);
  scene.add(fill);

  /* ---------- physics world ---------- */
  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, 0, 0) });
  world.broadphase = new CANNON.SAPBroadphase(world);
  world.allowSleep = false;

  // invisible containment box (keeps pieces in frame)
  const R = { x: 9.2, y: 5.2, z: 3.4 };
  function wall(nx, ny, nz, dist) {
    const b = new CANNON.Body({ type: CANNON.Body.STATIC, shape: new CANNON.Plane() });
    b.quaternion.setFromVectors(new CANNON.Vec3(0, 0, 1), new CANNON.Vec3(nx, ny, nz));
    b.position.set(-nx * dist, -ny * dist, -nz * dist); // plane faces inward, offset opposite to its normal
    world.addBody(b);
  }
  wall(1, 0, 0, R.x); wall(-1, 0, 0, R.x);
  wall(0, 1, 0, R.y); wall(0, -1, 0, R.y);
  wall(0, 0, 1, R.z); wall(0, 0, -1, R.z);

  /* ---------- L-shape geometry (logo silhouette) ---------- */
  // logo: 60x55 square with 35x28 bite at top-right → unit-scaled
  const S = 0.045;
  const shape = new THREE.Shape();
  shape.moveTo(0, 0); shape.lineTo(60 * S, 0); shape.lineTo(60 * S, 27 * S);
  shape.lineTo(25 * S, 27 * S); shape.lineTo(25 * S, 55 * S); shape.lineTo(0, 55 * S);
  shape.closePath();
  const lGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.95, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.09, bevelSegments: 4, curveSegments: 6 });
  lGeo.center();

  const matPaper = new THREE.MeshStandardMaterial({ color: 0xf4f6f2, roughness: 0.32, metalness: 0.05 });
  const matInk = new THREE.MeshStandardMaterial({ color: 0x1d2733, roughness: 0.4, metalness: 0.18 });
  const matGreen = new THREE.MeshStandardMaterial({ color: 0xc3dc93, roughness: 0.28, metalness: 0.05 });
  const matBean = new THREE.MeshStandardMaterial({ color: 0xc3dc93, roughness: 0.18, metalness: 0.0, emissive: 0x32401a, emissiveIntensity: 0.5 });

  const bodies = [];

  function addL(mat, pos) {
    const mesh = new THREE.Mesh(lGeo, mat);
    mesh.castShadow = mesh.receiveShadow = true;
    scene.add(mesh);
    const body = new CANNON.Body({ mass: 1.2, angularDamping: 0.15, linearDamping: 0.12 });
    // compound: left column + bottom slab (relative to centered geo)
    const w = 60 * S, h = 55 * S, cw = 25 * S, sh = 27 * S, d = 1.05;
    body.addShape(new CANNON.Box(new CANNON.Vec3(cw / 2, h / 2, d / 2)), new CANNON.Vec3(-(w / 2 - cw / 2), 0, 0));
    body.addShape(new CANNON.Box(new CANNON.Vec3((w - cw) / 2, sh / 2, d / 2)), new CANNON.Vec3(cw / 2, -(h / 2 - sh / 2), 0));
    body.position.set(pos.x, pos.y, pos.z);
    body.quaternion.setFromEuler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    body.velocity.set((Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1);
    body.angularVelocity.set((Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 1.2);
    world.addBody(body);
    bodies.push({ mesh, body });
  }

  function addBean(pos, r) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 28, 20), matBean);
    mesh.castShadow = mesh.receiveShadow = true;
    scene.add(mesh);
    const body = new CANNON.Body({ mass: 0.4, shape: new CANNON.Sphere(r), angularDamping: 0.1, linearDamping: 0.1 });
    body.position.set(pos.x, pos.y, pos.z);
    body.velocity.set((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 1);
    world.addBody(body);
    bodies.push({ mesh, body });
  }

  const N_L = isMobile ? 6 : 9;
  const N_B = isMobile ? 4 : 7;
  const mats = [matPaper, matPaper, matInk, matPaper, matGreen, matInk, matPaper, matInk, matPaper];
  for (let i = 0; i < N_L; i++) {
    addL(mats[i % mats.length], {
      x: (Math.random() - 0.5) * 15,
      y: (Math.random() - 0.5) * 8,
      z: (Math.random() - 0.5) * 4
    });
  }
  for (let i = 0; i < N_B; i++) {
    addBean({ x: (Math.random() - 0.5) * 16, y: (Math.random() - 0.5) * 8, z: (Math.random() - 0.5) * 4 }, 0.32 + Math.random() * 0.22);
  }

  /* ---------- gentle center attraction (loose zero-g cluster) ---------- */
  const center = new CANNON.Vec3(0, 0, 0);
  function attract() {
    for (const { body } of bodies) {
      const dir = center.vsub(body.position);
      const dist = Math.max(dir.length(), 0.001);
      if (dist < 3.2) continue; // dead zone: let pieces float apart near the middle
      dir.normalize();
      const f = 0.4 * body.mass * Math.min(dist - 3.2, 4);
      body.applyForce(dir.scale(f));
    }
  }

  /* ---------- pointer repulsion ---------- */
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const pNDC = new THREE.Vector2(99, 99);
  const pWorld = new THREE.Vector3();
  let pointerActive = false;

  canvas.parentElement.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    pNDC.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pNDC.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    pointerActive = true;
  }, { passive: true });
  canvas.parentElement.addEventListener('pointerleave', () => { pointerActive = false; });

  function repel() {
    if (!pointerActive) return;
    raycaster.setFromCamera(pNDC, camera);
    raycaster.ray.intersectPlane(plane, pWorld);
    if (!pWorld) return;
    const p = new CANNON.Vec3(pWorld.x, pWorld.y, 0);
    for (const { body } of bodies) {
      const dir = body.position.vsub(p);
      const dist = Math.max(dir.length(), 0.3);
      if (dist < 5.0) {
        dir.normalize();
        body.applyForce(dir.scale(90 / (1 + dist * dist) * body.mass));
      }
    }
  }

  /* ---------- resize ---------- */
  function resize() {
    const r = canvas.parentElement.getBoundingClientRect();
    if (r.width === 0) return;
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
  }
  resize();
  // debounced resize — avoids buffer-clear flicker while the card expands on scroll
  let rzT;
  const resizeSoon = () => { clearTimeout(rzT); rzT = setTimeout(resize, 220); };
  window.addEventListener('resize', resizeSoon);
  if (window.ResizeObserver) new ResizeObserver(resizeSoon).observe(canvas.parentElement);

  /* ---------- loop ---------- */
  let running = true;
  let last = performance.now();
  function frame(now) {
    if (!running) return;
    requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    if (!reduceMotion) {
      attract();
      repel();
      world.step(1 / 60, dt, 3);
      for (const { mesh, body } of bodies) {
        mesh.position.copy(body.position);
        mesh.quaternion.copy(body.quaternion);
      }
    }
    // subtle camera sway with pointer
    camera.position.x += ((pNDC.x === 99 ? 0 : pNDC.x * 0.6) - camera.position.x) * 0.04;
    camera.position.y += ((pNDC.y === 99 ? 0.4 : 0.4 + pNDC.y * 0.35) - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => {
      const was = running;
      running = e.isIntersecting && !document.hidden;
      if (running && !was) { last = performance.now(); requestAnimationFrame(frame); }
    }, { rootMargin: '100px' }).observe(canvas);
  }
  document.addEventListener('visibilitychange', () => {
    const was = running;
    running = !document.hidden;
    if (running && !was) { last = performance.now(); requestAnimationFrame(frame); }
  });
})();
