/**
 * CR7 Contact Page - Smooth Single-Open FAQ Accordion
 */
(function () {
  function initContactFaq() {
    const list = document.querySelector('[data-cr7-faq-list]');
    if (!list || list.__cr7FaqInit) return;
    list.__cr7FaqInit = true;

    const items = Array.from(list.querySelectorAll('[data-cr7-faq-item]'));

    items.forEach((item) => {
      const btn = item.querySelector('[data-cr7-faq-btn]');
      const panel = item.querySelector('[data-cr7-faq-panel]');
      if (!btn || !panel) return;

      btn.addEventListener('click', () => {
        const willOpen = !item.classList.contains('is-open');

        // Auto-close any other open FAQ item
        items.forEach((other) => {
          if (other !== item && other.classList.contains('is-open')) {
            other.classList.remove('is-open');
            other.querySelector('[data-cr7-faq-btn]')?.setAttribute('aria-expanded', 'false');
            other.querySelector('[data-cr7-faq-panel]')?.setAttribute('aria-hidden', 'true');
          }
        });

        item.classList.toggle('is-open', willOpen);
        btn.setAttribute('aria-expanded', String(willOpen));
        panel.setAttribute('aria-hidden', String(!willOpen));
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactFaq);
  } else {
    initContactFaq();
  }

  document.addEventListener('shopify:section:load', initContactFaq);
})();

