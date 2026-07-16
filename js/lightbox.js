/* Video lightbox.
   - data-vimeo="ID"            → Vimeo player
   - data-youtube="ID"          → YouTube player
   - data-playlist='[{"t":"Title","v":"vimeoId"},{"t":"Title","y":"youtubeId"}]'
                                → multi-video case with switcher tabs
   Cards without these attributes keep their original behavior. */
(function () {
  var overlay = document.createElement('div');
  overlay.className = 'vlb';
  overlay.innerHTML =
    '<div class="vlb-inner">' +
    '<button class="vlb-close" aria-label="Close">&times;</button>' +
    '<div class="vlb-frame"></div>' +
    '<div class="vlb-tabs"></div>' +
    '</div>';
  document.body.appendChild(overlay);

  var frame = overlay.querySelector('.vlb-frame');
  var tabs = overlay.querySelector('.vlb-tabs');

  function srcFor(item) {
    if (item.v) return 'https://player.vimeo.com/video/' + item.v + '?autoplay=1&title=0&byline=0&portrait=0';
    if (item.y) return 'https://www.youtube.com/embed/' + item.y + '?autoplay=1&rel=0&modestbranding=1';
    return '';
  }

  function play(item) {
    frame.innerHTML =
      '<iframe src="' + srcFor(item) + '" ' +
      'allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
  }

  function open(list) {
    tabs.innerHTML = '';
    if (list.length > 1) {
      list.forEach(function (item, i) {
        var b = document.createElement('button');
        b.className = 'vlb-tab' + (i === 0 ? ' is-active' : '');
        b.textContent = item.t || ('Video ' + (i + 1));
        b.addEventListener('click', function () {
          tabs.querySelectorAll('.vlb-tab').forEach(function (x) { x.classList.remove('is-active'); });
          b.classList.add('is-active');
          play(item);
        });
        tabs.appendChild(b);
      });
    }
    play(list[0]);
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('is-open');
    frame.innerHTML = '';
    document.body.style.overflow = '';
  }

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay || e.target.closest('.vlb-close')) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-vimeo],[data-youtube],[data-playlist]');
    if (!el) return;
    var list = [];
    var pl = el.getAttribute('data-playlist');
    if (pl) {
      try { list = JSON.parse(pl); } catch (err) { list = []; }
    } else if (el.getAttribute('data-vimeo')) {
      list = [{ v: el.getAttribute('data-vimeo') }];
    } else if (el.getAttribute('data-youtube')) {
      list = [{ y: el.getAttribute('data-youtube') }];
    }
    if (!list.length) return;
    e.preventDefault();
    open(list);
  });
})();
