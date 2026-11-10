// Hook Point Solutions — small progressive enhancements (site works without JS)
(function () {
  document.documentElement.classList.remove('no-js');

  // Projects slideshow: arrows, progress line and counter (swipe/scroll works without JS)
  Array.prototype.forEach.call(document.querySelectorAll('[data-carousel]'), function (root) {
    var track = root.querySelector('.carousel-track');
    var slides = track.querySelectorAll('.carousel-slide');
    var prev = root.querySelector('[data-dir="-1"]');
    var next = root.querySelector('[data-dir="1"]');
    var bar = root.querySelector('.carousel-progress span');
    var count = root.querySelector('.carousel-count b');
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
      var last = Math.min(slides.length, first + perView);
      var atEnd = x >= max - 2;
      if (bar) {
        bar.style.width = (perView / slides.length * 100) + '%';
        bar.style.left = ((atEnd ? slides.length - perView : first) / slides.length * 100) + '%';
      }
      if (count) count.textContent = String(atEnd ? slides.length : last).padStart(2, '0');
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
