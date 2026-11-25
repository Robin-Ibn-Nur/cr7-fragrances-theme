/**
 * CR7 FAQ Page Controller
 * Smooth single-open accordion + live search + category filter tabs.
 */
(function () {
  function initFaqPage() {
    const root = document.querySelector('[data-cr7-faq]');
    if (!root || root.__cr7FaqPageInit) return;
    root.__cr7FaqPageInit = true;

    const items = Array.from(root.querySelectorAll('[data-cr7-faq-item]'));
    const tabs = Array.from(root.querySelectorAll('[data-cr7-faq-tab]'));
    const searchInput = root.querySelector('[data-cr7-faq-search]');
    const emptyEl = root.querySelector('[data-cr7-faq-empty]');

    let activeCat = 'all';
    let query = '';

    // Single-open smooth accordion
    items.forEach((item) => {
      const btn = item.querySelector('[data-cr7-faq-btn]');
      const panel = item.querySelector('[data-cr7-faq-panel]');
      if (!btn || !panel) return;

      btn.addEventListener('click', () => {
        const willOpen = !item.classList.contains('is-open');

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

    function applyFilter() {
      let visible = 0;
      items.forEach((item) => {
        const cat = (item.getAttribute('data-category') || '').toLowerCase();
        const text = item.textContent.toLowerCase();
        const matchCat = activeCat === 'all' || cat === activeCat;
        const matchSearch = !query || text.includes(query);
        const show = matchCat && matchSearch;
        item.hidden = !show;
        if (show) visible++;
      });
      if (emptyEl) emptyEl.hidden = visible > 0;
    }

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        activeCat = (tab.getAttribute('data-cr7-faq-tab') || 'all').toLowerCase();
        tabs.forEach((t) => t.setAttribute('aria-pressed', String(t === tab)));
        applyFilter();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        query = searchInput.value.trim().toLowerCase();
        applyFilter();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFaqPage);
  } else {
    initFaqPage();
  }

  document.addEventListener('shopify:section:load', initFaqPage);
})();

