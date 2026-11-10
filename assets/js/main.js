// Hook Point Solutions — small progressive enhancements (site works without JS)
(function () {
  document.documentElement.classList.remove('no-js');

  // Header: transparent over the hero, solid once you scroll
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 40); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Projects slideshow: arrows + progress line (swipe/scroll works without JS)
  Array.prototype.forEach.call(document.querySelectorAll('[data-carousel]'), function (root) {
    var name = root.getAttribute('data-carousel');
    var controls = document.querySelector('[data-carousel-controls="' + name + '"]') || root;
    var track = root.querySelector('.carousel-track');
    var slides = track.querySelectorAll('.carousel-slide');
    var prev = controls.querySelector('[data-dir="-1"]');
    var next = controls.querySelector('[data-dir="1"]');
    var bar = root.querySelector('.carousel-progress span');
    if (!slides.length) return;

    function step() {
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return slides[0].getBoundingClientRect().width + gap;
    }
    function update() {
      var max = track.scrollWidth - track.clientWidth;
      var x = track.scrollLeft;
      var perView = Math.max(1, Math.round(track.clientWidth / step()));
      var first = Math.min(slides.length - 1, Math.round(x / step()));
      var atEnd = x >= max - 2;
      if (bar) {
        bar.style.width = (perView / slides.length * 100) + '%';
        bar.style.left = ((atEnd ? slides.length - perView : first) / slides.length * 100) + '%';
      }
      if (prev) prev.disabled = x <= 2;
      if (next) next.disabled = atEnd;
    }
    function go(dir) { track.scrollBy({ left: dir * step(), behavior: 'smooth' }); }

    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });
    var ticking = false;
    track.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { update(); ticking = false; });
    }, { passive: true });
    track.addEventListener('scrollend', update);
    window.addEventListener('resize', update);
    update();
  });

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
