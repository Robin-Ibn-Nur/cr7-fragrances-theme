/**
 * CR7 Collection Page - Live In-Collection Search & Quick Filter Chips
 * Works seamlessly alongside Shopify's native Facets & Sort without altering product-card-morris.
 */
(function () {
  function initCollectionTools() {
    const toolbar = document.querySelector('[data-cr7-col-toolbar]');
    const grid = document.querySelector('.cr7-col-main .product-grid, .product-grid');
    if (!toolbar || !grid || toolbar.__cr7ColInit) return;
    toolbar.__cr7ColInit = true;

    const searchInput = toolbar.querySelector('[data-cr7-col-search]');
    const clearBtn = toolbar.querySelector('[data-cr7-col-clear]');
    const chips = Array.from(toolbar.querySelectorAll('[data-cr7-chip]'));
    const statusEl = toolbar.querySelector('[data-cr7-col-status]');
    const emptyEl = document.querySelector('[data-cr7-col-empty]');
    const resetBtn = document.querySelector('[data-cr7-col-reset]');

    let activeFilter = 'all';
    let query = '';

    function getCards() {
      return Array.from(grid.querySelectorAll('.product-grid__item'));
    }

    function applyFilters() {
      const cards = getCards();
      let visibleCount = 0;

      for (const card of cards) {
        const title = (card.getAttribute('data-title') || card.textContent || '').toLowerCase();
        const available = card.getAttribute('data-available') === 'true';
        const onSale = card.getAttribute('data-on-sale') === 'true';
        const priceCents = Number(card.getAttribute('data-price')) || 0;

        let matchesChip = true;
        if (activeFilter === 'in-stock') matchesChip = available;
        else if (activeFilter === 'on-sale') matchesChip = onSale;
        else if (activeFilter === 'under-160') matchesChip = priceCents > 0 && priceCents < 16000;
        else if (activeFilter === '160-plus') matchesChip = priceCents >= 16000;

        const matchesSearch = !query || title.includes(query);
        const show = matchesChip && matchesSearch;
        card.hidden = !show;
        if (show) visibleCount++;
      }

      if (statusEl) {
        statusEl.textContent = `Showing ${visibleCount} of ${cards.length}`;
      }
      if (emptyEl) {
        emptyEl.hidden = visibleCount > 0 || cards.length === 0;
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        query = searchInput.value.trim().toLowerCase();
        if (clearBtn) clearBtn.hidden = !query;
        applyFilters();
      });

      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && query) {
          // Allow optional store-wide search on Enter if 0 local matches
          const visible = getCards().filter((c) => !c.hidden).length;
          if (visible === 0) {
            window.location.href = `/search?q=${encodeURIComponent(searchInput.value.trim())}`;
          }
        }
      });
    }

    if (clearBtn && searchInput) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        query = '';
        clearBtn.hidden = true;
        applyFilters();
        searchInput.focus();
      });
    }

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        activeFilter = chip.getAttribute('data-cr7-chip') || 'all';
        chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
        applyFilters();
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        activeFilter = 'all';
        query = '';
        if (searchInput) searchInput.value = '';
        if (clearBtn) clearBtn.hidden = true;
        chips.forEach((c) => c.setAttribute('aria-pressed', String(c.getAttribute('data-cr7-chip') === 'all')));
        applyFilters();
      });
    }

    applyFilters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCollectionTools);
  } else {
    initCollectionTools();
  }

  document.addEventListener('shopify:section:load', initCollectionTools);
})();

