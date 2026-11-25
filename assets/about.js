/**
 * About Page - Subtle Scroll Reveal Controller
 * Scoped per section instance, cleans up on shopify:section:unload.
 */
(function () {
  document.documentElement.classList.add('about-js');

  function initAboutSection(sectionEl) {
    if (!sectionEl || sectionEl.__aboutInitialized) return;
    sectionEl.__aboutInitialized = true;

    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sigEl = sectionEl.querySelector('[data-about-signature]');
    if (sigEl) {
      sigEl.querySelectorAll('.about-sig__path').forEach((path) => {
        if (typeof path.getTotalLength === 'function') {
          const len = Math.ceil(path.getTotalLength()) + 4;
          path.style.setProperty('--sig-len', String(len));
        }
      });

      sigEl.addEventListener('click', () => {
        if (reducedMotion) return;
        sigEl.classList.remove('is-drawn');
        void sigEl.offsetWidth;
        sigEl.classList.add('is-drawn');
      });
    }

    const reveals = Array.from(sectionEl.querySelectorAll('.about-reveal'));
    if (!reveals.length) {
      if (sigEl) sigEl.classList.add('is-drawn');
      return;
    }

    if (reducedMotion || !('IntersectionObserver' in window)) {
      reveals.forEach((el) => el.classList.add('is-visible'));
      if (sigEl) sigEl.classList.add('is-drawn');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            if (sigEl && entry.target.contains(sigEl)) {
              sigEl.classList.add('is-drawn');
            }
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -24px 0px' }
    );

    reveals.forEach((el) => observer.observe(el));
    sectionEl.__aboutCleanup = () => observer.disconnect();
  }

  function cleanupAboutSection(sectionEl) {
    if (!sectionEl) return;
    if (typeof sectionEl.__aboutCleanup === 'function') {
      sectionEl.__aboutCleanup();
    }
    sectionEl.__aboutInitialized = false;
  }

  function initAll() {
    document.querySelectorAll('[data-about-section]').forEach(initAboutSection);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  document.addEventListener('shopify:section:load', (e) => {
    const target = e.target.matches('[data-about-section]')
      ? e.target
      : e.target.querySelector('[data-about-section]');
    if (target) initAboutSection(target);
  });

  document.addEventListener('shopify:section:unload', (e) => {
    const target = e.target.matches('[data-about-section]')
      ? e.target
      : e.target.querySelector('[data-about-section]');
    if (target) cleanupAboutSection(target);
  });
})();

