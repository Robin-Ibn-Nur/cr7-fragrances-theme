(function () {
  const isDesignMode = Boolean(window.Shopify && window.Shopify.designMode);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const REVEAL_CLASSES = ['scroll-reveal', 'scroll-reveal--left', 'scroll-reveal--right', 'scroll-reveal--text'];

  let observer = null;

  function hasRevealClass(el) {
    return REVEAL_CLASSES.some((cls) => el.classList.contains(cls));
  }

  function isExcluded(el) {
    if (!el || !(el instanceof HTMLElement)) return true;
    if (el.closest('#header-group, .cr7-fs-menu, [role="dialog"], dialog')) return true;
    const hiddenSlide = el.closest('[data-cr7-slide]:not(.is-active)');
    if (hiddenSlide) return true;
    return false;
  }

  function getObserver() {
    if (observer) return observer;
    observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight * 0.92) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -32px 0px',
      threshold: 0.04
    });
    return observer;
  }

  function registerTarget(el, cls, delaySeconds) {
    if (isExcluded(el)) return;
    if (!hasRevealClass(el)) {
      el.classList.add(cls);
      if (delaySeconds > 0) {
        el.style.setProperty('--reveal-stagger', `${delaySeconds.toFixed(2)}s`);
      }
    }

    if (isDesignMode || prefersReducedMotion) {
      el.classList.add('is-revealed');
      return;
    }

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => el.classList.add('is-revealed'));
      });
    } else if (rect.bottom <= 0) {
      el.classList.add('is-revealed');
    } else {
      getObserver().observe(el);
    }
  }

  function initScrollReveals() {
    // 1. Side-in columns (left -> right, right -> left)
    const leftCols = document.querySelectorAll(
      '.cr7-showcase__left, .cr7-contact__info, .cr7-about-story__media, ' +
      '.cr7-hero-slider__slide.is-active .cr7-hero-slider__content, ' +
      '[data-reveal="left"]'
    );
    leftCols.forEach((el) => registerTarget(el, 'scroll-reveal--left', 0));

    const rightCols = document.querySelectorAll(
      '.cr7-showcase__right, .cr7-contact__form-wrap, .cr7-about-story__content, ' +
      '.cr7-hero-slider__slide.is-active .cr7-hero-slider__media, ' +
      '[data-reveal="right"]'
    );
    rightCols.forEach((el) => registerTarget(el, 'scroll-reveal--right', 0.08));

    // 2. Editorial text & headings (staggered per section/container)
    const textTargets = document.querySelectorAll(
      '#MainContent h1, #MainContent h2, #MainContent h3, ' +
      '#MainContent [class*="__eyebrow"], #MainContent [class*="__subtitle"], ' +
      '#MainContent [class*="__desc"], #MainContent .cr7-contact__lead, ' +
      '#MainContent [class*="__cta"]:not(.cr7-hero-slider__cta)'
    );
    const containerCounters = new WeakMap();
    textTargets.forEach((el) => {
      if (el.closest('product-card, ._collection-card, .cr7-faq__item')) return;
      const scope = el.closest('.shopify-section') || el.parentElement || document.body;
      const count = containerCounters.get(scope) || 0;
      containerCounters.set(scope, count + 1);
      registerTarget(el, 'scroll-reveal--text', Math.min(count, 5) * 0.07);
    });

    // 3. Fade-up sections, cards, FAQ items, and footer blocks
    const upTargets = document.querySelectorAll(
      '#MainContent > .shopify-section:not(:first-child):not(.hero-wrapper):not(.section-cr7-hero-slider), ' +
      '#MainContent .section-content-wrapper > .group-block, ' +
      '#MainContent product-card, ' +
      '#MainContent ._collection-card, ' +
      '#MainContent .cr7-faq__item, ' +
      '#MainContent .cr7-collection__card, ' +
      '#MainContent .cr7-values__card, ' +
      '#MainContent .cr7-pillars__card, ' +
      '#MainContent .cr7-milestone, ' +
      'footer .cr7-footer__newsletter, ' +
      'footer .cr7-footer__brand, ' +
      'footer .cr7-footer__col, ' +
      'footer .cr7-footer__legal, ' +
      '.scroll-reveal, ' +
      '[data-scroll-reveal]'
    );

    upTargets.forEach((el) => {
      let delay = 0;
      const parent = el.parentElement;
      if (parent && parent.children.length > 1) {
        const index = Array.from(parent.children).indexOf(el);
        if (index > 0) delay = Math.min(index, 5) * 0.08;
      }
      registerTarget(el, 'scroll-reveal', delay);
    });
  }

  function initHeaderScroll() {
    const header = document.querySelector('#header-component');
    if (!header) return;

    function update() {
      const top = window.scrollY || document.documentElement.scrollTop || 0;
      header.classList.toggle('header--scrolled', top > 15);
    }

    if (!window.__cr7HeaderScrollBound) {
      window.__cr7HeaderScrollBound = true;
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update, { passive: true });
    }
    update();
  }

  function initAll() {
    initScrollReveals();
    initHeaderScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  document.addEventListener('shopify:section:load', initAll);
})();
