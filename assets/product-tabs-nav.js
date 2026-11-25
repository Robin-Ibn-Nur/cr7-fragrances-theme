/**
 * Product Tabs Navigation - Sticky ScrollSpy Controller
 */

(function () {
  function initTabs(sectionEl) {
    if (!sectionEl || sectionEl.__ptnInitialized) return;
    sectionEl.__ptnInitialized = true;

    const links = sectionEl.querySelectorAll('.ptn-nav__link');
    if (!links.length) return;

    // 1. Hide tabs whose target elements don't exist in DOM
    const validTargets = [];
    links.forEach(link => {
      const targetId = link.getAttribute('href')?.replace('#', '');
      const targetEl = targetId ? document.getElementById(targetId) : null;
      if (!targetEl) {
        const item = link.closest('.ptn-nav__item');
        if (item) item.style.display = 'none';
      } else {
        validTargets.push({ link, targetEl });
      }
    });

    if (!validTargets.length) return;

    // Set first tab active initially if none active
    if (!sectionEl.querySelector('.ptn-nav__link[aria-current="true"]')) {
      validTargets[0].link.setAttribute('aria-current', 'true');
    }

    // 2. Smooth scrolling click handler
    links.forEach(link => {
      link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href')?.replace('#', '');
        const targetEl = targetId ? document.getElementById(targetId) : null;
        if (targetEl) {
          e.preventDefault();
          const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          targetEl.scrollIntoView({
            behavior: prefersReduced ? 'auto' : 'smooth',
            block: 'start'
          });

          // Focus target element for screen readers
          targetEl.setAttribute('tabindex', '-1');
          targetEl.focus({ preventScroll: true });

          // Set active immediately
          links.forEach(l => l.removeAttribute('aria-current'));
          this.setAttribute('aria-current', 'true');

          // Keep active tab scrolled into view on mobile
          this.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
        }
      });
    });

    // 3. ScrollSpy via IntersectionObserver
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const activeMatch = validTargets.find(vt => vt.targetEl.id === id);
            if (activeMatch) {
              links.forEach(l => l.removeAttribute('aria-current'));
              activeMatch.link.setAttribute('aria-current', 'true');
              activeMatch.link.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
            }
          }
        });
      }, {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
      });

      validTargets.forEach(vt => observer.observe(vt.targetEl));
    }
  }

  document.querySelectorAll('[data-section-type="product-tabs-nav"]').forEach(initTabs);

  document.addEventListener('shopify:section:load', function (e) {
    if (e.target.matches('[data-section-type="product-tabs-nav"]')) {
      initTabs(e.target);
    }
  });
})();
