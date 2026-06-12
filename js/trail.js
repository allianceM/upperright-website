/* ============================================================
   UPPERRIGHT — iridescent pointer wisp
   A small pearl-white streak with soap-bubble chromatic
   fringes (subtle rainbow edges), like liquid glass. Chain-
   follow points updated every frame — silky, quick to fade,
   never loud enough to disturb reading.
   ============================================================ */
(function () {
  const canvas = document.getElementById('trail-canvas');
  if (!canvas) return;
  if (window.matchMedia('(hover: none)').matches) { canvas.style.display = 'none'; return; }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { canvas.style.display = 'none'; return; }

  const ctx = canvas.getContext('2d');
  let W, H, DPR = Math.min(window.devicePixelRatio || 1, 1.5);

  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  const mouse = { x: W / 2, y: H / 2, seen: false };
  window.addEventListener('pointermove', (e) => {
    mouse.x = e.clientX; mouse.y = e.clientY;
    if (!mouse.seen) {
      mouse.seen = true;
      for (const p of pts) { p.x = mouse.x; p.y = mouse.y; }
    }
  }, { passive: true });

  const COUNT = 16;
  const pts = Array.from({ length: COUNT }, () => ({ x: W / 2, y: H / 2 }));
  let energy = 0;
  let hue = 0;

  function frame() {
    requestAnimationFrame(frame);
    ctx.clearRect(0, 0, W, H);
    if (!mouse.seen) return;

    const head = pts[0];
    const dx = mouse.x - head.x, dy = mouse.y - head.y;
    head.x += dx * 0.42;
    head.y += dy * 0.42;
    for (let i = 1; i < COUNT; i++) {
      pts[i].x += (pts[i - 1].x - pts[i].x) * 0.5;
      pts[i].y += (pts[i - 1].y - pts[i].y) * 0.5;
    }

    const speed = Math.hypot(dx, dy);
    energy += (Math.min(speed / 30, 1) - energy) * 0.12;
    hue = (hue + 1.2 + energy * 3) % 360;
    if (energy < 0.02) return;

    let len = 0;
    for (let i = 1; i < COUNT; i++) len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    if (len < 5) return;

    // per-point normals (for the chromatic fringes)
    const nx = [], ny = [];
    for (let i = 0; i < COUNT; i++) {
      const a = pts[Math.max(i - 1, 0)], b = pts[Math.min(i + 1, COUNT - 1)];
      let vx = b.x - a.x, vy = b.y - a.y;
      const l = Math.hypot(vx, vy) || 1;
      nx.push(-vy / l); ny.push(vx / l);
    }

    ctx.globalCompositeOperation = 'lighter';

    const w = 5 + energy * 9; // small & precious
    // chromatic fringes — soap-bubble edges (offset to either side)
    ribbon(2.6, `hsla(${hue}, 85%, 72%, ${0.05 + energy * 0.09})`, w * 0.5, nx, ny);
    ribbon(-2.6, `hsla(${(hue + 140) % 360}, 85%, 72%, ${0.05 + energy * 0.09})`, w * 0.5, nx, ny);
    // pearl core
    ribbon(0, `rgba(255,255,255,${0.07 + energy * 0.13})`, w, nx, ny, 10);

    ctx.globalCompositeOperation = 'source-over';
  }

  function ribbon(offset, color, width, nx, ny, blur) {
    ctx.save();
    if (blur) {
      ctx.shadowColor = 'rgba(255,255,255,0.6)';
      ctx.shadowBlur = blur;
    }
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // taper from head to tail in 3 steps
    const seg = [[0, 0.4, width], [0.4, 0.75, width * 0.6], [0.75, 1, width * 0.28]];
    for (const [a, b, lw] of seg) {
      const i0 = Math.floor(a * (COUNT - 1)), i1 = Math.floor(b * (COUNT - 1));
      if (i1 - i0 < 1) continue;
      ctx.lineWidth = Math.max(lw, 0.4);
      ctx.beginPath();
      ctx.moveTo(pts[i0].x + nx[i0] * offset, pts[i0].y + ny[i0] * offset);
      for (let i = i0 + 1; i < i1; i++) {
        const mxx = (pts[i].x + pts[i + 1].x) / 2 + nx[i] * offset;
        const myy = (pts[i].y + pts[i + 1].y) / 2 + ny[i] * offset;
        ctx.quadraticCurveTo(pts[i].x + nx[i] * offset, pts[i].y + ny[i] * offset, mxx, myy);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  requestAnimationFrame(frame);
})();
