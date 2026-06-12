/* ============================================================
   UPPERRIGHT — contact ball pit
   A pit of green "ocean balls" piled at the bottom of the
   contact section. They drop in when the section appears and
   scatter playfully when the pointer pushes through them.
   ============================================================ */
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

(function () {
  const canvas = document.getElementById('contact3d');
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
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(0, 0.6, 15);
  camera.lookAt(0, -1, 0);

  scene.add(new THREE.AmbientLight(0xbfc8d4, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 1.9);
  key.position.set(5, 9, 7);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -12; key.shadow.camera.right = 12;
  key.shadow.camera.top = 8; key.shadow.camera.bottom = -8;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xc3dc93, 0.9);
  rim.position.set(-6, 3, -5);
  scene.add(rim);

  /* ---------- physics ---------- */
  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.8, 0) });
  world.broadphase = new CANNON.SAPBroadphase(world);

  const ballMat = new CANNON.Material('ball');
  world.addContactMaterial(new CANNON.ContactMaterial(ballMat, ballMat, { restitution: 0.45, friction: 0.25 }));

  const FLOOR_Y = -3.6;
  const BOUND_X = 9.5, BOUND_Z = 2.6;

  function staticPlane(nx, ny, nz, dist) {
    const b = new CANNON.Body({ type: CANNON.Body.STATIC, shape: new CANNON.Plane(), material: ballMat });
    b.quaternion.setFromVectors(new CANNON.Vec3(0, 0, 1), new CANNON.Vec3(nx, ny, nz));
    b.position.set(-nx * dist, -ny * dist, -nz * dist);
    world.addBody(b);
  }
  staticPlane(0, 1, 0, -FLOOR_Y);   // floor
  staticPlane(1, 0, 0, BOUND_X);    // left
  staticPlane(-1, 0, 0, BOUND_X);   // right
  staticPlane(0, 0, 1, BOUND_Z);    // back
  staticPlane(0, 0, -1, BOUND_Z);   // front

  /* ---------- shadow-catcher floor ---------- */
  const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 12),
    new THREE.ShadowMaterial({ opacity: 0.3 })
  );
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.y = FLOOR_Y;
  floorMesh.receiveShadow = true;
  scene.add(floorMesh);

  /* ---------- balls ---------- */
  const palette = [0xC3DC93, 0xA8C97A, 0xD7E9B4, 0x8FB55F, 0xE4F3C8];
  const N = isMobile ? 16 : 44;
  const balls = [];
  const geoCache = new THREE.SphereGeometry(1, 26, 18);
  const matCache = palette.map((c) => new THREE.MeshStandardMaterial({
    color: c, roughness: 0.32, metalness: 0.02
  }));

  function addBall(i) {
    const r = 0.3 + Math.random() * 0.34;
    const mesh = new THREE.Mesh(geoCache, matCache[i % matCache.length]);
    mesh.scale.setScalar(r);
    mesh.castShadow = mesh.receiveShadow = true;
    scene.add(mesh);
    const body = new CANNON.Body({
      mass: 0.5, shape: new CANNON.Sphere(r), material: ballMat,
      angularDamping: 0.2, linearDamping: 0.05
    });
    body.position.set(
      (Math.random() - 0.5) * BOUND_X * 1.7,
      3.5 + Math.random() * 6 + i * 0.12,
      (Math.random() - 0.5) * BOUND_Z * 1.6
    );
    world.addBody(body);
    balls.push({ mesh, body });
  }

  let spawned = false;
  function spawnAll() {
    if (spawned) return;
    spawned = true;
    for (let i = 0; i < N; i++) setTimeout(() => addBall(i), i * 60);
  }

  /* ---------- pointer push ---------- */
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const pNDC = new THREE.Vector2(99, 99);
  const pWorld = new THREE.Vector3();
  let prevX = null, prevY = null, pvx = 0, pvy = 0;

  window.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    if (e.clientY < r.top || e.clientY > r.bottom) { pNDC.x = 99; return; }
    pNDC.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pNDC.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    if (prevX != null) { pvx = e.clientX - prevX; pvy = e.clientY - prevY; }
    prevX = e.clientX; prevY = e.clientY;
  }, { passive: true });

  function push() {
    if (pNDC.x === 99) return;
    raycaster.setFromCamera(pNDC, camera);
    if (!raycaster.ray.intersectPlane(plane, pWorld)) return;
    const speed = Math.min(Math.hypot(pvx, pvy) * 0.06, 3);
    const p = new CANNON.Vec3(pWorld.x, pWorld.y, 0);
    for (const { body } of balls) {
      const dir = body.position.vsub(p);
      const dist = Math.max(dir.length(), 0.25);
      if (dist < 3.0) {
        dir.normalize();
        // push outward + a little upward, harder when the pointer moves fast
        const f = (26 + speed * 30) / (1 + dist * dist);
        body.applyForce(new CANNON.Vec3(dir.x * f, Math.abs(dir.y) * f * 0.6 + f * 0.35, dir.z * f * 0.4));
      }
    }
    pvx *= 0.8; pvy *= 0.8;
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
  let rzT;
  window.addEventListener('resize', () => { clearTimeout(rzT); rzT = setTimeout(resize, 220); });

  /* ---------- loop ---------- */
  let running = false;
  let last = performance.now();
  function frame(now) {
    if (!running) return;
    requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    if (!reduceMotion) {
      push();
      world.step(1 / 60, dt, 3);
      for (const { mesh, body } of balls) {
        mesh.position.copy(body.position);
        mesh.quaternion.copy(body.quaternion);
      }
    }
    renderer.render(scene, camera);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => {
      const was = running;
      running = e.isIntersecting && !document.hidden;
      if (running) spawnAll();
      if (running && !was) { last = performance.now(); requestAnimationFrame(frame); }
    }, { rootMargin: '60px' }).observe(canvas);
  } else {
    running = true; spawnAll(); requestAnimationFrame(frame);
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) running = false;
  });
})();
