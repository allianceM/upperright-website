/* Vimeo lightbox — cards with data-vimeo="VIDEOID" open an in-page player.
   Cards without data-vimeo keep their original behavior. */
(function () {
  var overlay = document.createElement('div');
  overlay.className = 'vlb';
  overlay.innerHTML =
    '<div class="vlb-inner">' +
    '<button class="vlb-close" aria-label="Close">&times;</button>' +
    '<div class="vlb-frame"></div>' +
    '</div>';
  document.body.appendChild(overlay);

  var frame = overlay.querySelector('.vlb-frame');

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
    var el = e.target.closest('[data-vimeo],[data-youtube]');
    if (!el) return;
    var src = '';
    var vid = el.getAttribute('data-vimeo');
    var yid = el.getAttribute('data-youtube');
    if (vid) {
      src = 'https://player.vimeo.com/video/' + vid + '?autoplay=1&title=0&byline=0&portrait=0';
    } else if (yid) {
      src = 'https://www.youtube.com/embed/' + yid + '?autoplay=1&rel=0&modestbranding=1';
    }
    if (!src) return;
    e.preventDefault();
    frame.innerHTML =
      '<iframe src="' + src + '" ' +
      'allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  });
})();
