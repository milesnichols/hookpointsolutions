// Hook Point Solutions — small enhancements. Every page works without JS.
(function () {
  document.documentElement.classList.remove('no-js');

  // Mobile menu
  var menuBtn = document.querySelector('.menu-btn');
  var nav = document.getElementById('site-nav');
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); }
    });
  }

  // Projects slider (About page): arrows, dots, keyboard. Swiping works without JS.
  var track = document.getElementById('project-track');
  if (track && track.children.length) {
    var cards = track.children;
    var prev = document.querySelector('.slider-btn[data-dir="-1"]');
    var next = document.querySelector('.slider-btn[data-dir="1"]');
    var dotsBox = document.querySelector('.slider-dots');
    var dots = [];

    var step = function () {
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return cards[0].getBoundingClientRect().width + gap;
    };
    var pages = function () { return Math.max(1, cards.length - Math.max(1, Math.round(track.clientWidth / step())) + 1); };
    var buildDots = function () {
      if (!dotsBox) return;
      dotsBox.innerHTML = '';
      dots = [];
      for (var i = 0; i < pages(); i++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.tabIndex = -1;
        b.addEventListener('click', (function (n) { return function () { track.scrollTo({ left: n * step() }); }; })(i));
        dotsBox.appendChild(b);
        dots.push(b);
      }
    };
    var update = function () {
      var max = track.scrollWidth - track.clientWidth;
      var x = track.scrollLeft;
      var index = x >= max - 2 ? dots.length - 1 : Math.round(x / step());
      dots.forEach(function (d, i) { d.setAttribute('aria-current', i === index ? 'true' : 'false'); });
      if (prev) prev.disabled = x <= 2;
      if (next) next.disabled = x >= max - 2;
    };
    var go = function (dir) { track.scrollBy({ left: dir * step() }); };

    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
    track.addEventListener('keydown', function (e) {
      if (e.target !== track) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });
    var ticking = false;
    track.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { update(); ticking = false; });
    }, { passive: true });
    var lastPages = 0;
    var refresh = function () { if (pages() !== lastPages) { lastPages = pages(); buildDots(); } update(); };
    window.addEventListener('resize', refresh);
    refresh();
  }

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
