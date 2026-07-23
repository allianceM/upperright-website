/* ============================================================
   UPPERRIGHT 东区一角 — main interactions (v2, Lusion-grade)
   Loader · Lenis · hero takeover · reel unfold · reveals
   velocity skew · cursor · marquee · bilingual toggle
   ============================================================ */
(function () {
  gsap.registerPlugin(ScrollTrigger);

  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const isTouch = window.matchMedia('(hover: none)').matches;
  const isMobile = window.matchMedia('(max-width: 900px)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ================= LENIS SMOOTH SCROLL ================= */
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1 && $(id)) {
        e.preventDefault();
        closeMenu();
        lenis.scrollTo(id, { offset: 0, duration: 1.4 });
      }
    });
  });

  /* ================= LOADER — pac-man logo ================= */
  const loader = $('#loader');
  const mouth = $('#loader-mouth');
  const pctEl = $('#loader-pct');
  const ldots = $$('.ldot');

  const D_OPEN = 'M0 0 L0 100 L100 100 L100 49.64 L47.71 52.29 L50.36 0 Z';
  const D_CLOSED = 'M0 0 L0 100 L100 100 L100 10.9 L85 11.8 L85 0 Z';

  let chomp, feed;
  function startChomp() {
    chomp = gsap.to(mouth, { attr: { d: D_CLOSED }, duration: 0.28, ease: 'power2.inOut', yoyo: true, repeat: -1 });
    const logoR = $('.loader-logo').getBoundingClientRect();
    const mouthX = logoR.left + logoR.width * 0.72;
    feed = gsap.fromTo(ldots,
      { x: 0, opacity: 1, scale: 1 },
      { x: (i, el) => mouthX - el.getBoundingClientRect().left, opacity: 0, scale: 0.2, duration: 1.15, ease: 'power1.in', stagger: { each: 0.34, repeat: -1 } });
  }

  const progress = { v: 0 };
  let pageLoaded = document.readyState === 'complete';
  window.addEventListener('load', () => { pageLoaded = true; });

  const isHome = !!$('.hero');

  function runLoader() {
    if (reduceMotion) { finishLoader(true); return; }
    startChomp();
    gsap.to(progress, {
      v: 100, duration: isHome ? 2.4 : 1.3, ease: 'power2.inOut',
      onUpdate: () => { pctEl.textContent = Math.round(progress.v); },
      onComplete: () => {
        const wait = setInterval(() => { if (pageLoaded) { clearInterval(wait); finishLoader(false); } }, 60);
      }
    });
  }

  function finishLoader(instant) {
    chomp && chomp.kill();
    feed && feed.kill();
    if (instant) { loader.style.display = 'none'; heroIn(true); return; }
    const tl = gsap.timeline();
    tl.to(mouth, { attr: { d: D_CLOSED }, duration: 0.2, ease: 'power2.in' })
      .to(ldots, { opacity: 0, duration: 0.2 }, '<')
      .to('.loader-logo', { scale: 1.12, duration: 0.18, ease: 'power2.out' })
      .to('.loader-logo', { scale: 1, duration: 0.25, ease: 'back.out(3)' })
      .to('.loader-meta', { opacity: 0, y: 10, duration: 0.35 }, '-=0.2')
      .to(loader, {
        clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'power4.inOut',
        onStart: heroIn,
        onComplete: () => { loader.style.display = 'none'; }
      }, '-=0.05');
  }

  /* ================= HERO ENTRANCE ================= */
  let heroPlayed = false;
  function heroIn(instant) {
    if (heroPlayed) return;
    heroPlayed = true;
    if (instant || reduceMotion) return;
    const tl = gsap.timeline({ delay: 0.2 });
    tl.from('.nav', { yPercent: -120, duration: 0.9, ease: 'power3.out', clearProps: 'transform' });
    if (isHome) {
      tl.from('.hero-statement', { opacity: 0, y: 24, duration: 0.9, ease: 'power3.out' }, '-=0.55')
        .from('.hero-card', { scale: 0.92, opacity: 0, duration: 1.1, ease: 'power3.out', clearProps: 'all' }, '-=0.6')
        .from('.ht-word', { yPercent: 115, duration: 1.05, ease: 'power4.out', stagger: 0.09 }, '-=0.7')
        .from('.cross-row span', { opacity: 0, duration: 0.6, stagger: 0.05 }, '-=0.5');
    } else if ($('.ahero')) {
      tl.from('.al-line em', { yPercent: 115, duration: 1.0, ease: 'power4.out', stagger: 0.08 }, '-=0.5')
        .from('.ahero-mark', { opacity: 0, y: 50, duration: 1.2, ease: 'power3.out' }, '-=0.7')
        .from('.ahero .cross-row span', { opacity: 0, duration: 0.6, stagger: 0.05 }, '-=0.6');
    } else if ($('.phead')) {
      tl.from('.phead-title span', { yPercent: 115, duration: 1.0, ease: 'power4.out' }, '-=0.5')
        .from('.phead-note', { opacity: 0, y: 22, duration: 0.8 }, '-=0.6')
        .from('.pill-filter', { opacity: 0, y: 18, duration: 0.6, stagger: 0.06 }, '-=0.55');
    }
  }

  runLoader();

  /* ================= HERO TAKEOVER (card expands + camera push) ================= */
  if (!reduceMotion && !isMobile && isHome) {
    const cam = { z: 15 };
    ScrollTrigger.create({
      trigger: '.hero',
      start: 'top top',
      end: '+=120%',
      pin: true,
      scrub: 0.6,
      onUpdate(self) {
        const t = self.progress;
        const pad = gsap.utils.interpolate(0, 1, t);
        $('.hero-card-wrap').style.setProperty('--exp', t);
        if (window.__heroCamera) {
          window.__heroCamera.position.z = gsap.utils.interpolate(15, 9.2, t);
        }
        gsap.set('.hero-head', { opacity: 1 - t * 1.6, y: t * -60 });
        gsap.set('.hero-title', { yPercent: t * -16, opacity: 1 - t * 0.25 });
        gsap.set('.cross-row', { opacity: 1 - t * 2 });
      }
    });
  }

  /* ================= HERO SLIDER (infinite loop, direction-consistent) ================= */
  const hslides = $('#hslides');
  if (hslides) {
    const slides = Array.from(hslides.children);
    const N = slides.length;
    const dots = $$('#hdots span');
    let cur = 0;
    let sliding = false;
    slides.forEach((s, i) => s.classList.toggle('hs-active', i === 0));

    function goSlide(dir) {
      if (sliding) return;
      sliding = true;
      const nxt = (cur + dir + N) % N;
      const out = slides[cur], inn = slides[nxt];
      inn.classList.add('hs-moving');
      gsap.set(inn, { xPercent: 100 * dir, zIndex: 3 });
      gsap.set(out, { zIndex: 2 });
      gsap.to(out, { xPercent: -100 * dir, duration: 0.95, ease: 'power3.inOut' });
      gsap.to(inn, {
        xPercent: 0, duration: 0.95, ease: 'power3.inOut',
        onComplete: () => {
          out.classList.remove('hs-active');
          inn.classList.add('hs-active');
          inn.classList.remove('hs-moving');
          gsap.set(out, { xPercent: 100, zIndex: 1 });
          cur = nxt;
          sliding = false;
        }
      });
      dots.forEach((d, k) => d.classList.toggle('active', k === nxt));
    }
    $('#hnav-prev').addEventListener('click', () => goSlide(-1));
    $('#hnav-next').addEventListener('click', () => goSlide(1));
    window.addEventListener('keydown', (e) => {
      if (window.scrollY > window.innerHeight * 0.6) return;
      if (e.key === 'ArrowLeft') goSlide(-1);
      if (e.key === 'ArrowRight') goSlide(1);
    });
  }

  /* ================= ABOUT HERO (camera dolly + mark parallax) ================= */
  if (!reduceMotion && $('.ahero')) {
    ScrollTrigger.create({
      trigger: '.ahero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6,
      onUpdate(self) {
        const t = self.progress;
        if (window.__aboutCamera) window.__aboutCamera.position.z = gsap.utils.interpolate(18, 13.5, t);
        gsap.set('.ahero-mark', { yPercent: t * 30, opacity: 1 - t * 0.8 });
        gsap.set('.ahero-lines', { y: t * -60 });
      }
    });
  }

  /* ================= EXPERTISE POKER CARDS (stack → fan → flip) ================= */
  if (!reduceMotion && !isMobile && $('#exp-stage')) {
    const stage = $('#exp-stage');
    const pcards = $$('.pcard');
    const inners = $$('.pcard-inner');
    const rowX = (i) => {
      const W = stage.clientWidth;
      const cw = pcards[0].offsetWidth;
      const gap = Math.min((W - 4 * cw) / 3, 56);
      return (i - 1.5) * (cw + gap);
    };
    // initial: a neat stack, slightly offset like a held deck
    gsap.set(pcards, {
      x: (i) => (i - 1.5) * 7,
      y: (i) => i * -5,
      rotation: (i) => (i - 1.5) * 3
    });
    const settleTilt = [-1.4, 1.0, -0.7, 1.2];
    const expTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#exp-pin',
        start: 'top top',
        end: '+=230%',
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });
    expTl
      // fan out like a hand of cards
      .to(pcards, {
        x: (i) => (i - 1.5) * pcards[0].offsetWidth * 0.46,
        y: (i) => Math.abs(i - 1.5) * 30 - 14,
        rotation: (i) => (i - 1.5) * 13,
        duration: 0.3, ease: 'power2.inOut'
      })
      // straighten into a row
      .to(pcards, {
        x: (i) => rowX(i), y: 0, rotation: 0,
        duration: 0.28, ease: 'power2.inOut'
      }, 0.34)
      // flip over, one by one
      .to(inners, {
        rotationY: 180,
        duration: 0.2, stagger: 0.08, ease: 'power2.inOut'
      }, 0.62)
      // settle wobble — like real cards landing
      .to(pcards, {
        rotation: (i) => settleTilt[i],
        duration: 0.1, stagger: 0.08, ease: 'power1.out'
      }, 0.68)
      .to(pcards, {
        rotation: 0,
        duration: 0.14, stagger: 0.06, ease: 'power1.inOut'
      }, 0.84);
  }

  /* ================= PROJECTS FILTER ================= */
  const filterWrap = $('#filters');
  if (filterWrap) {
    const btns = $$('.pill-filter');
    const cards = $$('#pgrid .wcard');
    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        btns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat;
        cards.forEach((card) => {
          const show = cat === 'all' || (card.dataset.cat || '').split(' ').includes(cat);
          card.classList.toggle('is-hidden', !show);
        });
        gsap.fromTo('#pgrid .wcard:not(.is-hidden)',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.05, overwrite: true });
        ScrollTrigger.refresh();
      });
    });
  }

  /* ================= REEL UNFOLD ================= */
  if (!reduceMotion && $('#reel')) {
    const reelTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#reel',
        start: 'top top',
        end: isMobile ? '+=120%' : '+=180%',
        pin: '#reel-pin',
        scrub: 0.5,
        anticipatePin: 1
      }
    });
    reelTl
      .fromTo('#reel-card',
        { scale: 0.34, xPercent: -26, yPercent: 14, rotate: -7, borderRadius: 18 },
        { scale: 0.7, xPercent: -8, yPercent: 5, rotate: 3.5, borderRadius: 14, ease: 'power1.inOut', duration: 0.45 })
      .to('#reel-card', { scale: 1, xPercent: 0, yPercent: 0, rotate: 0, borderRadius: 0, ease: 'power2.inOut', duration: 0.55 })
      .to('#reel-copy', { opacity: 0, y: -40, ease: 'power2.in', duration: 0.25 }, 0.22)
      .fromTo('.reel-tint', { opacity: 0.75 }, { opacity: 0, duration: 0.5 }, 0.35)
      .fromTo('.rw-l', { xPercent: 40, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.4 }, 0.45)
      .fromTo('.rw-r', { xPercent: -40, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.4 }, 0.45)
      .fromTo('.rw-btn', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, ease: 'back.out(2)', duration: 0.35 }, 0.55)
      .fromTo('.cross-corners span', { opacity: 0 }, { opacity: 0.7, stagger: 0.04, duration: 0.3 }, 0.6)
      .to('#reel-card img', { scale: 1.06, duration: 1, ease: 'none' }, 0);
  }

  /* ================= CUSTOM CURSOR ================= */
  if (!isTouch) {
    const cursor = $('#cursor');
    const cx = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' });
    const cy = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' });
    window.addEventListener('pointermove', (e) => { cx(e.clientX); cy(e.clientY); }, { passive: true });
    $$('[data-cursor]').forEach((el) => {
      el.addEventListener('pointerenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('pointerleave', () => cursor.classList.remove('is-hover'));
    });
    $$('[data-cursor-view]').forEach((el) => {
      el.addEventListener('pointerenter', () => cursor.classList.add('is-view'));
      el.addEventListener('pointerleave', () => cursor.classList.remove('is-view'));
    });
  }

  /* ================= NAV hide / show ================= */
  const nav = $('#nav');
  let lastY = 0;
  let navHidden = false;
  function setNavHidden(hidden) {
    if (hidden === navHidden) return;
    navHidden = hidden;
    gsap.to(nav, { yPercent: hidden ? -130 : 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
  }
  lenis.on('scroll', ({ scroll }) => {
    if (scroll <= 140) setNavHidden(false);
    else if (scroll > lastY + 4) setNavHidden(true);
    else if (scroll < lastY - 4) setNavHidden(false);
    lastY = scroll;
  });

  /* ================= MOBILE MENU ================= */
  const menuBtn = $('#menu-btn');
  const mmenu = $('#mmenu');
  function closeMenu() {
    mmenu.classList.remove('open');
    menuBtn.classList.remove('open');
    lenis.start();
  }
  menuBtn.addEventListener('click', () => {
    const open = mmenu.classList.toggle('open');
    menuBtn.classList.toggle('open', open);
    open ? lenis.stop() : lenis.start();
  });

  /* ================= INTRO word-by-word reveal ================= */
  let introST;
  function buildIntro() {
    const el = $('#intro-text');
    if (!el) return;
    if (introST) { introST.kill(); introST = null; }
    const text = el.textContent.trim();
    const isZh = document.body.classList.contains('lang-zh');
    const parts = isZh ? Array.from(text) : text.split(/\s+/);
    el.innerHTML = parts.map((w) => `<span class="w">${w}</span>`).join(isZh ? '' : ' ');
    const tween = gsap.to(el.querySelectorAll('.w'), {
      opacity: 1, stagger: 0.04, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 45%', scrub: 0.4 }
    });
    introST = tween.scrollTrigger;
  }
  buildIntro();

  /* ================= SCROLL REVEALS & PARALLAX ================= */
  if (!reduceMotion) {
    // statement drifts sideways slightly as you scroll (Lusion line shift)
    gsap.fromTo('#intro-text', { x: 0 }, {
      x: () => Math.min(window.innerWidth * 0.04, 60), ease: 'none',
      scrollTrigger: { trigger: '#intro-text', start: 'top bottom', end: 'bottom top', scrub: true }
    });

    $$('.sec-title span').forEach((el) => {
      gsap.from(el, {
        yPercent: 110, duration: 1, ease: 'power4.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });
    $$('.intro-eyebrow').forEach((el) => {
      gsap.from(el, { opacity: 0, duration: 1, scrollTrigger: { trigger: el, start: 'top 88%' } });
    });

    // work cards
    ScrollTrigger.batch('.wcard', {
      start: 'top 88%', once: true,
      onEnter: (els) => gsap.fromTo(els, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', stagger: 0.12 })
    });
    $$('.wcard-media img').forEach((img) => {
      gsap.fromTo(img, { yPercent: -7 }, {
        yPercent: 7, ease: 'none',
        scrollTrigger: { trigger: img.closest('.wcard'), start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    // velocity skew on media (Lusion-style inertia)
    const skewTargets = $$('.wcard-media');
    const skewSetters = skewTargets.map((el) => gsap.quickTo(el, 'skewY', { duration: 0.4, ease: 'power2.out' }));
    lenis.on('scroll', (e) => {
      const skew = gsap.utils.clamp(-4, 4, (e.velocity || 0) * 0.12);
      skewSetters.forEach((set) => set(skew));
    });

    $$('.svc-row').forEach((row, i) => {
      gsap.from(row, {
        y: 50, opacity: 0, duration: 0.9, ease: 'power3.out', delay: i * 0.05,
        scrollTrigger: { trigger: row, start: 'top 90%', once: true }
      });
    });

    // directional hover highlight (slides in/out from the side you enter/leave)
    $$('.svc-row').forEach((row) => {
      const dir = (e) => {
        const r = row.getBoundingClientRect();
        return e.clientY - r.top < r.height / 2 ? 'top' : 'bottom';
      };
      row.addEventListener('pointerenter', (e) => {
        row.style.setProperty('--so', dir(e));
        row.classList.add('hovered');
      });
      row.addEventListener('pointerleave', (e) => {
        row.style.setProperty('--so', dir(e));
        row.classList.remove('hovered');
      });
    });

    gsap.from('.ai-title', {
      y: 60, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.ai-title', start: 'top 85%', once: true }
    });
    ScrollTrigger.batch('.ai-step', {
      start: 'top 90%', once: true,
      onEnter: (els) => gsap.fromTo(els, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.09 })
    });

    ScrollTrigger.batch('.st-cell', {
      start: 'top 92%', once: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0 }, { opacity: 1, duration: 0.9, ease: 'power2.out', stagger: 0.08 })
    });

    gsap.from('.contact-kicker', {
      opacity: 0, y: 20, duration: 0.8,
      scrollTrigger: { trigger: '.contact', start: 'top 75%', once: true }
    });

    // about / projects page extras
    if ($('.team-intro')) {
      gsap.from('.team-intro', {
        opacity: 0, y: 30, duration: 0.9,
        scrollTrigger: { trigger: '.team-intro', start: 'top 85%', once: true }
      });
    }
    if ($('.brand-wall')) {
      ScrollTrigger.batch('.brand-wall span', {
        start: 'top 92%', once: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0 }, { opacity: 1, duration: 0.7, stagger: 0.04 })
      });
    }
    if ($('.exp-grid')) {
      ScrollTrigger.batch('.exp-card', {
        start: 'top 88%', once: true,
        onEnter: (els) => gsap.fromTo(els, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.1 })
      });
    }
    if ($('.next-page')) {
      gsap.from('.np-title', {
        yPercent: 60, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.next-page', start: 'top 88%', once: true }
      });
    }
    $$('.cb-line').forEach((line, i) => {
      gsap.from(line, {
        yPercent: 110, duration: 1.1, ease: 'power4.out', delay: i * 0.08,
        scrollTrigger: { trigger: '.contact-big', start: 'top 82%', once: true }
      });
    });
  }

  /* ================= MARQUEES (scroll-velocity reactive) ================= */
  const tracks = [
    { el: $('.m1 .marquee-track'), dir: -1, x: 0 },
    { el: $('.m2 .marquee-track'), dir: 1, x: 0 }
  ].filter((t) => t.el);

  let scrollVel = 0;
  lenis.on('scroll', (e) => { scrollVel = e.velocity || 0; });

  gsap.ticker.add(() => {
    const boost = Math.min(Math.abs(scrollVel) * 0.06, 4);
    tracks.forEach((t) => {
      const half = t.el.scrollWidth / 2;
      if (!half) return;
      t.x += t.dir * (0.6 + boost);
      if (t.x <= -half) t.x += half;
      if (t.x > 0) t.x -= half;
      t.el.style.transform = `translate3d(${t.x}px,0,0)`;
    });
  });

  /* ================= LANGUAGE TOGGLE ================= */
  const langBtn = $('#lang-toggle');
  let lang = 'en';

  function applyLang(l) {
    lang = l;
    document.documentElement.lang = l === 'zh' ? 'zh-CN' : 'en';
    document.body.classList.toggle('lang-zh', l === 'zh');
    document.body.classList.toggle('lang-en', l === 'en');
    const dict = window.I18N[l];
    $$('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] != null) el.innerHTML = dict[key];
    });
    buildIntro();
    ScrollTrigger.refresh();
  }

  langBtn.addEventListener('click', () => applyLang(lang === 'en' ? 'zh' : 'en'));

  // apply the dictionary on load — js/i18n.js is the single source of truth for all copy,
  // so text edits there show up without touching any HTML
  applyLang('en');

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
