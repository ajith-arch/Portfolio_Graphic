/**
 * OnePlus case study — subtle fade-up on scroll.
 */
(function (global) {
  'use strict';

  function initOneplusCampusReveal() {
    var els = document.querySelectorAll('.oneplus-reveal');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -48px 0px' }
    );

    els.forEach(function (el) {
      io.observe(el);
    });
  }

  global.initOneplusCampusReveal = initOneplusCampusReveal;
})(typeof window !== 'undefined' ? window : globalThis);
