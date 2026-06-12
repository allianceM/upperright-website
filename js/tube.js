/* ============================================================
   UPPERRIGHT — spine (vertical progress axis)
   A clean vertical green thread running down the left margin
   of the whole page. It grows as you scroll; each section is
   a node that lights up when the head passes it. Crisp, flat,
   always smooth.
   ============================================================ */
(function () {
  const canvas = document.getElementById('tube-canvas');
  if (!canvas) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 900px)').matches;
  if (isMobile) { canvas.style.display = 'none'; return; }

  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);

  const GREEN = '#C3DC93';
  const MINT = '#E4F3C8';

  let spineX = 38;
  let yStart = 0, yEnd = 0;
  let nodes = []; // { y, el }

  function measure() {
    // generic: every section after the first (the hero) becomes a node
    // note: 'main section' (descendant) also catches a hero wrapped in a ScrollTrigger pin-spacer
    const sections = Array.from(document.querySelectorAll('main section'));
    nodes = [];
    if (sections.length < 2) return;
    const list = sections.slice(1); // skip the hero section of any page
    for (const el of list) {
      const r = el.getBoundingClientRect();
      nodes.push({ y: r.top + window.scrollY + 8 });
    }
    const firstR = list[0].getBoundingClientRect();
    yStart = firstR.top + window.scrollY - 40;
    const last = document.querySelector('#contact') || list[list.length - 1];
    const lastR = last.getBoundingClientRect();
    yEnd = lastR.top + window.scrollY + lastR.height * 0.45;
    spineX = Math.max(26, Math.min(window.innerWidth * 0.026, 40));
  }

  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    measure();
  }
  resize();
  let rT;
  window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(resize, 250); });
  window.addEventListener('load', () => setTimeout(resize, 200));

  /* head follows the "reading line" of the viewport, smoothed */
  let head = 0, headTarget = 0;
  function onScroll() {
    headTarget = Math.max(yStart, Math.min(window.scrollY + H * 0.62, yEnd));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  head = headTarget;

  let pulse = 0;
  let running = !reduceMotion;

  function frame() {
    if (!running) return;
    requestAnimationFrame(frame);
    head += (headTarget - head) * 0.085;
    pulse += 0.05;

    ctx.clearRect(0, 0, W, H);
    const sy = window.scrollY;
    const x = spineX;

    // visible segment of the spine track
    const trackTop = Math.max(yStart - sy, -10);
    const trackBot = Math.min(yEnd - sy, H + 10);
    if (trackBot < -10 || trackTop > H + 10) return;

    // faint track
    ctx.strokeStyle = 'rgba(244,246,242,0.10)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, trackTop);
    ctx.lineTo(x, trackBot);
    ctx.stroke();

    // grown (filled) part
    const headScreen = head - sy;
    const fillBot = Math.min(headScreen, H + 10);
    if (fillBot > trackTop) {
      const grad = ctx.createLinearGradient(0, trackTop, 0, fillBot);
      grad.addColorStop(0, 'rgba(195,220,147,0.45)');
      grad.addColorStop(1, GREEN);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(x, trackTop);
      ctx.lineTo(x, fillBot);
      ctx.stroke();
    }

    // section nodes
    for (const n of nodes) {
      const ny = n.y - sy;
      if (ny < -20 || ny > H + 20) continue;
      const passed = head >= n.y;
      ctx.beginPath();
      ctx.arc(x, ny, passed ? 4.5 : 3.5, 0, Math.PI * 2);
      if (passed) {
        ctx.fillStyle = GREEN;
        ctx.fill();
      } else {
        ctx.strokeStyle = 'rgba(244,246,242,0.25)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    // glowing head
    if (headScreen > -30 && headScreen < H + 30 && head < yEnd - 2) {
      const breathe = 1 + Math.sin(pulse) * 0.15;
      ctx.beginPath();
      ctx.arc(x, headScreen, 10 * breathe, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(195,220,147,0.15)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, headScreen, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = MINT;
      ctx.fill();
    }
  }
  if (running) requestAnimationFrame(frame);
  document.addEventListener('visibilitychange', () => {
    const was = running;
    running = !document.hidden && !reduceMotion;
    if (running && !was) requestAnimationFrame(frame);
  });
})();
