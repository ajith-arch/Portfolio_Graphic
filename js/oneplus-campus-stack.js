/**
 * OnePlus Campus Store — sectioned adaptive orientation galleries (manifest-driven).
 */
(function (global) {
  'use strict';

  var DEFAULT_SECTIONS = [
    { id: 'product-branding', title: 'Product Branding', items: [] },
    { id: 'packaging-design', title: 'Packaging Design', items: [] },
    { id: 'campus-merchandising', title: 'Campus Store Merchandising', items: [] },
    { id: 'pdp-visual-design', title: 'PDP Visual Design', items: [] },
    { id: 'promotional-graphics', title: 'Promotional Graphics', items: [] },
    { id: 'wearables-storytelling', title: 'Wearables Storytelling', items: [] },
  ];

  function normalizeSections(manifest, base) {
    var sections = Array.isArray(manifest.sections) ? manifest.sections : DEFAULT_SECTIONS;
    return sections.map(function (sec) {
      var items = Array.isArray(sec.items) ? sec.items : [];
      if (!items.length && Array.isArray(sec.files)) {
        items = sec.files.map(function (f) {
          return typeof f === 'string' ? { file: f } : f;
        });
      }
      return {
        id: sec.id || sec.title.toLowerCase().replace(/\s+/g, '-'),
        title: sec.title || 'Showcase',
        items: items,
      };
    });
  }

  function createSectionBlock(section) {
    var block = document.createElement('section');
    block.className = 'oneplus-section oneplus-reveal';
    block.id = section.id;
    block.setAttribute('aria-labelledby', section.id + '-heading');

    var head = document.createElement('header');
    head.className = 'oneplus-section__head';

    var h2 = document.createElement('h2');
    h2.className = 'oneplus-section__title';
    h2.id = section.id + '-heading';
    h2.textContent = section.title;

    head.appendChild(h2);
    block.appendChild(head);

    var gallery = document.createElement('div');
    gallery.className = 'oneplus-section__gallery';
    block.appendChild(gallery);

    return { block: block, gallery: gallery };
  }

  function createEmptyPlaceholder() {
    var empty = document.createElement('div');
    empty.className = 'oneplus-section__empty';
    empty.setAttribute('role', 'status');
    var p = document.createElement('p');
    p.textContent = 'Visual showcase — add images to this section via the manifest.';
    empty.appendChild(p);
    return empty;
  }

  function initOneplusCampusGalleryStack(options) {
    var root = document.getElementById('oneplusShowcase');
    var manifestUrl = options && options.manifestUrl;
    var baseOverride = options && options.base;

    if (!root) {
      return Promise.reject(new Error('OnePlus gallery: missing #oneplusShowcase'));
    }
    if (!global.adaptiveGalleryCore) {
      return Promise.reject(new Error('OnePlus gallery: adaptiveGalleryCore not loaded'));
    }

    var core = global.adaptiveGalleryCore;
    root.classList.add('oneplus-showcase--loading');
    root.innerHTML = '';

    return core
      .fetchManifest(manifestUrl)
      .then(function (raw) {
        var normalized = core.normalizeItems(raw);
        var base = baseOverride != null ? baseOverride : normalized.base;
        var sections = normalizeSections(raw, base);

        var tasks = sections.map(function (section) {
          var parts = createSectionBlock(section);
          root.appendChild(parts.block);

          if (!section.items.length) {
            parts.gallery.appendChild(createEmptyPlaceholder());
            return Promise.resolve();
          }

          return core.renderGalleryInto(parts.gallery, base, section.items);
        });

        return Promise.all(tasks);
      })
      .then(function () {
        root.classList.remove('oneplus-showcase--loading');
        if (typeof global.initOneplusCampusReveal === 'function') {
          global.initOneplusCampusReveal();
        }
      })
      .catch(function (err) {
        root.classList.remove('oneplus-showcase--loading');
        root.classList.add('oneplus-showcase--error');
        root.textContent = 'Could not load showcase.';
        console.error(err);
      });
  }

  global.initOneplusCampusGalleryStack = initOneplusCampusGalleryStack;
})(typeof window !== 'undefined' ? window : globalThis);
