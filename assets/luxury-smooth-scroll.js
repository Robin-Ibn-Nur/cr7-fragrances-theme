/**
 * CR7 Luxury Smooth Scroll (Powered by Lenis)
 * Implements inertial momentum physics matching modern SaaS templates (e.g. rbp-saas-template).
 */
(function () {
  'use strict';

  if (typeof window === 'undefined') return;

  // Respect accessibility preferences
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  function initLenis() {
    if (!window.Lenis) {
      console.warn('[SmoothScroll] Lenis library not loaded');
      return;
    }

    // Modern luxury tuning (exponential ease-out, smooth wheel & touch)
    const lenis = new window.Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.5,
      infinite: false
    });

    window.__lenis = lenis;

    // Connect to RAF loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Watch for scroll-lock attributes on html/body to pause/resume Lenis
    const observer = new MutationObserver(() => {
      const isLocked =
        document.documentElement.hasAttribute('scroll-lock') ||
        document.body.classList.contains('scroll-locked') ||
        Boolean(document.querySelector('details.menu-drawer-container[open]')) ||
        Boolean(document.querySelector('dialog[open]'));

      if (isLocked) {
        lenis.stop();
      } else {
        lenis.start();
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['scroll-lock', 'class']
    });

    // Handle internal anchor links (smooth anchor jump)
    document.addEventListener('click', (event) => {
      const anchor = event.target.closest('a[href*="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href === '#' || href.startsWith('#!')) return;

      try {
        const url = new URL(anchor.href, window.location.href);
        if (url.pathname === window.location.pathname && url.hash) {
          const target = document.querySelector(url.hash);
          if (target) {
            event.preventDefault();
            lenis.scrollTo(target, {
              offset: -70,
              duration: 1.3,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
          }
        }
      } catch (_) {}
    });

    // Make sure resize recalculates dimensions
    window.addEventListener('resize', () => {
      lenis.resize();
    });

    // Re-check after images/content finish loading
    window.addEventListener('load', () => {
      lenis.resize();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLenis);
  } else {
    initLenis();
  }
})();
