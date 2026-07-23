/* ============================================================
   UPPERRIGHT — About hero 3D
   A calm zero-gravity drift of "L" blocks and green beans —
   slower, sparser, more cinematic than the home pile.
   Pointer gently parts the field; scroll dollies the camera.
   ============================================================ */
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

(function () {
  const canvas = document.getElementById('about3d');
  if (!canvas) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 900px)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  window.addEventListener('pagehide', () => { try { renderer.forceContextLoss(); renderer.dispose(); } catch (e) {} });
  canvas.addEventListener('webglcontextlost', (e) => e.preventDefault());
  canvas.addEventListener('webglcontextrestored', () => resize());

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x05080c, 20, 40);

  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(0, 0.2, 18);
  window.__aboutCamera = camera;

  scene.add(new THREE.AmbientLight(0xbfc8d4, 0.5));
  const key = new THREE.DirectionalLight(0xffffff, 2.0);
  key.position.set(6, 9, 7);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xc3dc93, 1.1);
  rim.position.set(-7, -3, -6);
  scene.add(rim);
  const fill = new THREE.PointLight(0xc3dc93, 14, 34);
  fill.position.set(-4, 5, 7);
  scene.add(fill);

  /* ---------- physics: pure zero-g, soft bounds ---------- */
  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, 0, 0) });
  world.broadphase = new CANNON.SAPBroadphase(world);

  const R = { x: 11, y: 6, z: 4 };
  function wall(nx, ny, nz, dist) {
    const b = new CANNON.Body({ type: CANNON.Body.STATIC, shape: new CANNON.Plane() });
    b.quaternion.setFromVectors(new CANNON.Vec3(0, 0, 1), new CANNON.Vec3(nx, ny, nz));
    b.position.set(-nx * dist, -ny * dist, -nz * dist);
    world.addBody(b);
  }
  wall(1, 0, 0, R.x); wall(-1, 0, 0, R.x);
  wall(0, 1, 0, R.y); wall(0, -1, 0, R.y);
  wall(0, 0, 1, R.z); wall(0, 0, -1, R.z);

  const S = 0.027;
  const shape = new THREE.Shape();
  shape.moveTo(0, 0); shape.lineTo(100 * S, 0); shape.lineTo(100 * S, 48 * S);
  shape.lineTo(48 * S, 48 * S); shape.lineTo(48 * S, 100 * S); shape.lineTo(0, 100 * S);
  shape.closePath();
  const lGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.95, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.09, bevelSegments: 4 });
  lGeo.center();

  const matPaper = new THREE.MeshStandardMaterial({ color: 0xf4f6f2, roughness: 0.32, metalness: 0.05 });
  const matInk = new THREE.MeshStandardMaterial({ color: 0x1d2733, roughness: 0.4, metalness: 0.18 });
  const matGreen = new THREE.MeshStandardMaterial({ color: 0xc3dc93, roughness: 0.28, metalness: 0.05 });
  const matBean = new THREE.MeshStandardMaterial({ color: 0xc3dc93, roughness: 0.18, emissive: 0x32401a, emissiveIntensity: 0.5 });

  const bodies = [];

  function addL(mat, pos) {
    const mesh = new THREE.Mesh(lGeo, mat);
    mesh.castShadow = mesh.receiveShadow = true;
    scene.add(mesh);
    const body = new CANNON.Body({ mass: 1.2, angularDamping: 0.3, linearDamping: 0.3 });
    const w = 100 * S, h = 100 * S, cw = 48 * S, sh = 48 * S, d = 1.05;
    body.addShape(new CANNON.Box(new CANNON.Vec3(cw / 2, h / 2, d / 2)), new CANNON.Vec3(-(w / 2 - cw / 2), 0, 0));
    body.addShape(new CANNON.Box(new CANNON.Vec3((w - cw) / 2, sh / 2, d / 2)), new CANNON.Vec3(cw / 2, -(h / 2 - sh / 2), 0));
    body.position.set(pos.x, pos.y, pos.z);
    body.quaternion.setFromEuler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    body.angularVelocity.set((Math.random() - 0.5) * 0.35, (Math.random() - 0.5) * 0.35, (Math.random() - 0.5) * 0.35);
    body.velocity.set((Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.3);
    world.addBody(body);
    bodies.push({ mesh, body });
  }
  function addBean(pos, r) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 18), matBean);
    mesh.castShadow = mesh.receiveShadow = true;
    scene.add(mesh);
    const body = new CANNON.Body({ mass: 0.4, shape: new CANNON.Sphere(r), angularDamping: 0.2, linearDamping: 0.25 });
    body.position.set(pos.x, pos.y, pos.z);
    body.velocity.set((Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5, 0);
    world.addBody(body);
    bodies.push({ mesh, body });
  }

  const N_L = isMobile ? 5 : 8;
  const N_B = isMobile ? 3 : 6;
  const mats = [matPaper, matInk, matPaper, matGreen, matPaper, matInk, matPaper, matInk];
  for (let i = 0; i < N_L; i++) {
    addL(mats[i % mats.length], { x: (Math.random() - 0.5) * 18, y: (Math.random() - 0.5) * 9, z: (Math.random() - 0.5) * 5 });
  }
  for (let i = 0; i < N_B; i++) {
    addBean({ x: (Math.random() - 0.5) * 18, y: (Math.random() - 0.5) * 9, z: (Math.random() - 0.5) * 5 }, 0.3 + Math.random() * 0.2);
  }

  /* very soft center pull keeps the field loosely on screen */
  const center = new CANNON.Vec3(0, 0, 0);
  function drift() {
    for (const { body } of bodies) {
      const dir = center.vsub(body.position);
      const dist = Math.max(dir.length(), 0.001);
      if (dist < 5) continue;
      dir.normalize();
      body.applyForce(dir.scale(0.18 * body.mass * Math.min(dist - 5, 4)));
    }
  }

  /* pointer parts the field gently */
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const pNDC = new THREE.Vector2(99, 99);
  const pWorld = new THREE.Vector3();
  let pointerActive = false;
  window.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    if (e.clientY < r.top || e.clientY > r.bottom) { pointerActive = false; return; }
    pNDC.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pNDC.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    pointerActive = true;
  }, { passive: true });

  function repel() {
    if (!pointerActive) return;
    raycaster.setFromCamera(pNDC, camera);
    if (!raycaster.ray.intersectPlane(plane, pWorld)) return;
    const p = new CANNON.Vec3(pWorld.x, pWorld.y, 0);
    for (const { body } of bodies) {
      const dir = body.position.vsub(p);
      const dist = Math.max(dir.length(), 0.3);
      if (dist < 5) {
        dir.normalize();
        body.applyForce(dir.scale(45 / (1 + dist * dist) * body.mass));
      }
    }
  }

  function resize() {
    const r = canvas.parentElement.getBoundingClientRect();
    if (r.width === 0) return;
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
  }
  resize();
  let rzT;
  window.addEventListener('resize', () => { clearTimeout(rzT); rzT = setTimeout(resize, 220); });

  let running = true;
  let last = performance.now();
  function frame(now) {
    if (!running) return;
    requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    if (!reduceMotion) {
      drift();
      repel();
      world.step(1 / 60, dt, 2);
      for (const { mesh, body } of bodies) {
        mesh.position.copy(body.position);
        mesh.quaternion.copy(body.quaternion);
      }
    }
    camera.position.x += ((pNDC.x === 99 ? 0 : pNDC.x * 0.5) - camera.position.x) * 0.03;
    camera.position.y += ((pNDC.y === 99 ? 0.2 : 0.2 + pNDC.y * 0.3) - camera.position.y) * 0.03;
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
