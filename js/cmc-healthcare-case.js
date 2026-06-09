/**
 * CMC Healthcare case study — floating dock nav, scroll spy, reveal.
 */
(function (global) {
  'use strict';

  var LIVE_URL = 'https://ajith-arch.github.io/christianmedicalcollege/';

  function initCmcReveal() {
    var els = document.querySelectorAll('.cmc-reveal');
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
      { threshold: 0.06, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach(function (el) {
      io.observe(el);
    });
  }

  function initCmcDock() {
    var dock = document.getElementById('cmcDock');
    if (!dock) return;

    var tabs = dock.querySelectorAll('.cmc-dock__tab[data-section]');
    var sections = [];
    tabs.forEach(function (tab) {
      var id = tab.getAttribute('data-section');
      var el = document.getElementById(id);
      if (el) sections.push({ id: id, el: el, tab: tab });
    });

    function setActive(id) {
      tabs.forEach(function (tab) {
        var match = tab.getAttribute('data-section') === id;
        tab.classList.toggle('is-active', match);
        if (match) tab.setAttribute('aria-current', 'true');
        else tab.removeAttribute('aria-current');
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function (e) {
        var id = tab.getAttribute('data-section');
        var target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: top, behavior: 'smooth' });
        setActive(id);
      });
    });

    if (!('IntersectionObserver' in window) || !sections.length) return;

    var ratios = {};
    sections.forEach(function (s) {
      ratios[s.id] = 0;
    });

    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          ratios[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
        });
        var best = null;
        var bestRatio = 0;
        sections.forEach(function (s) {
          if (ratios[s.id] > bestRatio) {
            bestRatio = ratios[s.id];
            best = s.id;
          }
        });
        if (best) setActive(best);
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach(function (s) {
      spy.observe(s.el);
    });

    var hero = document.getElementById('hero');
    if (hero) {
      var heroSpy = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              tabs.forEach(function (tab) {
                tab.classList.remove('is-active');
                tab.removeAttribute('aria-current');
              });
            }
          });
        },
        { threshold: 0.5 }
      );
      heroSpy.observe(hero);
    }
  }

  function initCmcWalkthrough() {
    var wrap = document.querySelector('.cmc-walkthrough__video-wrap');
    var video = wrap && wrap.querySelector('.cmc-walkthrough__video');
    if (!wrap || !video) return;

    var source = video.querySelector('source');
    if (!source || !source.getAttribute('src')) return;

    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.setAttribute('loop', '');
    video.setAttribute('playsinline', '');

    video.addEventListener('loadeddata', function () {
      wrap.classList.add('is-playing');
      var p = video.play();
      if (p && typeof p.catch === 'function') p.catch(function () {});
    });
  }

  function initCmcHealthcareCase() {
    initCmcReveal();
    initCmcDock();
    initCmcWalkthrough();
  }

  global.initCmcHealthcareCase = initCmcHealthcareCase;
  global.CMC_HEALTHCARE_LIVE_URL = LIVE_URL;
})(typeof window !== 'undefined' ? window : globalThis);
