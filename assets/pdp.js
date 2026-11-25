/**
 * PDP (Premium Minimal Product Page) - Vanilla JS Controller
 * Scoped per section instance, zero external library dependencies.
 */

import { CartLinesUpdateEvent } from '@shopify/events';
import { formatMoney } from '@theme/money-formatting';

(function () {
  const ZERO_DECIMAL_CURRENCIES = new Set(['JPY', 'KRW', 'VND', 'CLP', 'ISK', 'TWD', 'HUF']);

  function formatMoneySafe(cents, moneyFormat, currencyCode) {
    const amount = Number(cents) || 0;
    const currency = currencyCode || 'USD';
    if (moneyFormat && typeof formatMoney === 'function') {
      try {
        return formatMoney(amount, moneyFormat, currency);
      } catch (e) {
        // Fall through to Intl.NumberFormat
      }
    }
    const isZeroDecimal = ZERO_DECIMAL_CURRENCIES.has(currency.toUpperCase());
    const value = isZeroDecimal ? Math.round(amount / 100) : amount / 100;
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency,
        minimumFractionDigits: isZeroDecimal ? 0 : 2,
        maximumFractionDigits: isZeroDecimal ? 0 : 2,
      }).format(value);
    } catch (e) {
      return `${currency} ${value}`;
    }
  }

  function getCartSectionIds() {
    const ids = new Set(['cart-drawer-section']);
    document.querySelectorAll('cart-items-component[data-section-id]').forEach((el) => {
      if (el.dataset.sectionId) ids.add(el.dataset.sectionId);
    });
    return Array.from(ids);
  }

  async function notifyCartUpdated(addResponse) {
    const deferred = CartLinesUpdateEvent.createPromise();
    document.dispatchEvent(
      new CartLinesUpdateEvent({
        action: 'add',
        promise: deferred.promise,
      })
    );

    try {
      const cartRes = await fetch('/cart.js', { headers: { Accept: 'application/json' } });
      const ajaxCart = await cartRes.json();
      deferred.resolve({
        cart: CartLinesUpdateEvent.createCartFromAjaxResponse(ajaxCart),
        detail: {
          items: ajaxCart.items,
          source: 'pdp-main',
          itemCount: ajaxCart.item_count,
          sections: addResponse?.sections || {},
          didError: false,
        },
      });
    } catch (err) {
      deferred.reject(err);
    }
  }

  // --- 1. MAIN PDP SECTION CONTROLLER ---
  function initPdpMain(sectionEl) {
    if (!sectionEl || sectionEl.__pdpInitialized) return;
    sectionEl.__pdpInitialized = true;

    const ac = new AbortController();
    const { signal } = ac;
    sectionEl.__pdpCleanup = () => ac.abort();

    const sectionId = sectionEl.getAttribute('data-section-id');
    const moneyFormat = sectionEl.getAttribute('data-money-format') || '';
    const currencyCode = sectionEl.getAttribute('data-currency-code') || 'USD';

    const form = sectionEl.querySelector('.pdp-form');
    const addBtn = sectionEl.querySelector('[data-pdp-add-btn]');
    const buyNowBtn = sectionEl.querySelector('[data-pdp-buy-now-btn]');
    const statusMsg = sectionEl.querySelector('[data-pdp-status]');
    const qtyInput = sectionEl.querySelector('[data-pdp-qty-input]');
    const qtyMinus = sectionEl.querySelector('[data-pdp-qty-minus]');
    const qtyPlus = sectionEl.querySelector('[data-pdp-qty-plus]');
    const stageImg = sectionEl.querySelector('[data-pdp-stage-img]');
    const thumbs = Array.from(sectionEl.querySelectorAll('[data-pdp-thumb]'));
    const prevArrow = sectionEl.querySelector('[data-pdp-nav-prev]');
    const nextArrow = sectionEl.querySelector('[data-pdp-nav-next]');
    const galleryPanel = sectionEl.querySelector('[data-pdp-gallery-panel]');
    const colorLabelVal = sectionEl.querySelector('[data-pdp-color-val]');
    const ratingLink = sectionEl.querySelector('[data-pdp-rating-link]');
    const wishlistBtn = sectionEl.querySelector('[data-pdp-wishlist-btn]');
    const optionInputs = sectionEl.querySelectorAll('.pdp-swatch-input, .pdp-pill-input');

    // Upsell & Sticky bar elements
    const upsellEl = sectionEl.querySelector('[data-pdp-upsell]');
    const upsellItemsWrap = sectionEl.querySelector('[data-pdp-upsell-items]');
    const upsellFooterInner = sectionEl.querySelector('[data-pdp-upsell-footer-inner]');
    const upsellTotalEl = sectionEl.querySelector('[data-pdp-upsell-total]');
    const upsellCountEl = sectionEl.querySelector('[data-pdp-upsell-count]');
    const upsellLiveEl = sectionEl.querySelector('[data-pdp-upsell-live]');

    const stickyEl = sectionEl.querySelector('[data-pdp-sticky]');
    const stickyAddBtn = sectionEl.querySelector('[data-pdp-sticky-add]');
    const stickyPriceEl = sectionEl.querySelector('[data-pdp-sticky-price]');
    const stickyVariantEl = sectionEl.querySelector('[data-pdp-sticky-variant]');
    const stickyImgEl = sectionEl.querySelector('[data-pdp-sticky-img]');

    let currentMediaIndex = 0;
    let variantAbort = null;
    let recsAbort = null;
    let isSubmitting = false;

    const variantsScript = sectionEl.querySelector('[data-pdp-variants-json]');
    let allVariants = [];
    try {
      allVariants = variantsScript ? JSON.parse(variantsScript.textContent) : [];
    } catch (e) {
      allVariants = [];
    }

    function getCurrentVariant() {
      const idInput = sectionEl.querySelector('input[name="id"]');
      const currentId = idInput ? Number(idInput.value) : null;
      return allVariants.find((v) => v.id === currentId) || allVariants[0] || null;
    }

    function getMainQty() {
      const val = parseInt(qtyInput?.value || '1', 10);
      return Number.isFinite(val) && val > 0 ? val : 1;
    }

    function getCheckedAddons() {
      if (!upsellEl) return [];
      const rows = Array.from(upsellEl.querySelectorAll('[data-pdp-upsell-row]'));
      const selected = [];
      for (const row of rows) {
        const cb = row.querySelector('[data-pdp-upsell-check]');
        if (!cb || !cb.checked || cb.disabled) continue;
        const select = row.querySelector('[data-pdp-upsell-select]');
        const jsonEl = row.querySelector('[data-pdp-upsell-variant-json]');
        let variantId = Number(select ? select.value : cb.value);
        let price = 0;
        if (jsonEl) {
          try {
            const parsed = JSON.parse(jsonEl.textContent);
            const found = parsed.variants?.find((v) => v.id === variantId);
            if (found) price = Number(found.price) || 0;
          } catch (e) {}
        }
        selected.push({
          row,
          checkbox: cb,
          variantId,
          price,
          title: row.getAttribute('data-product-title') || '',
        });
      }
      return selected;
    }

    function updateTotalsAndButtons() {
      const mainVariant = getCurrentVariant();
      const mainAvailable = mainVariant ? Boolean(mainVariant.available) : true;
      const mainPrice = mainVariant
        ? Number(mainVariant.price) || 0
        : Number(sectionEl.querySelector('[data-pdp-price-row]')?.getAttribute('data-variant-price')) || 0;
      const mainQty = getMainQty();
      const addons = getCheckedAddons();

      const addonsSum = addons.reduce((acc, item) => acc + item.price, 0);
      const totalCents = mainPrice * mainQty + addonsSum;
      const totalItemsCount = mainQty + addons.length;
      const formattedTotal = formatMoneySafe(totalCents, moneyFormat, currencyCode);

      // Upsell footer
      if (upsellFooterInner && upsellTotalEl && upsellCountEl) {
        if (addons.length > 0) {
          upsellFooterInner.hidden = false;
          upsellTotalEl.textContent = formattedTotal;
          upsellCountEl.textContent = `(${totalItemsCount} ${totalItemsCount === 1 ? 'item' : 'items'})`;
          if (upsellLiveEl) {
            upsellLiveEl.textContent = `Total ${formattedTotal} for ${totalItemsCount} items`;
          }
        } else {
          upsellFooterInner.hidden = true;
          upsellTotalEl.textContent = '';
          upsellCountEl.textContent = '';
        }
      }

      // CTA text & state
      if (!isSubmitting) {
        let ctaLabel = 'Add to cart';
        if (!mainAvailable) {
          ctaLabel = 'Sold out';
        } else if (addons.length > 0) {
          ctaLabel = `Add ${totalItemsCount} items · ${formattedTotal}`;
        }

        if (addBtn) {
          addBtn.disabled = !mainAvailable;
          addBtn.textContent = ctaLabel;
        }
        if (stickyAddBtn) {
          stickyAddBtn.disabled = !mainAvailable;
          stickyAddBtn.textContent = ctaLabel;
        }
      }

      if (stickyPriceEl) {
        stickyPriceEl.textContent = formattedTotal;
      }
      if (stickyVariantEl && mainVariant) {
        stickyVariantEl.textContent = mainVariant.title;
      }
    }

    // --- Gallery Logic ---
    function updateGalleryArrows() {
      if (!thumbs.length) return;
      if (prevArrow) prevArrow.disabled = currentMediaIndex === 0;
      if (nextArrow) nextArrow.disabled = currentMediaIndex === thumbs.length - 1;
    }

    function selectMedia(index) {
      if (!thumbs.length || index < 0 || index >= thumbs.length) return;
      currentMediaIndex = index;
      const targetThumb = thumbs[index];

      thumbs.forEach((t) => t.removeAttribute('aria-current'));
      targetThumb.setAttribute('aria-current', 'true');

      const fullSrc = targetThumb.getAttribute('data-full-src');
      const srcset = targetThumb.getAttribute('data-srcset');
      const alt = targetThumb.getAttribute('data-alt');

      if (stageImg && fullSrc) {
        stageImg.style.opacity = '0';
        setTimeout(() => {
          stageImg.src = fullSrc;
          if (srcset) stageImg.srcset = srcset;
          if (alt) stageImg.alt = alt;
          stageImg.style.opacity = '1';
        }, 150);
      }

      if (stickyImgEl && fullSrc) {
        stickyImgEl.src = fullSrc;
      }

      updateGalleryArrows();
      targetThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }

    if (thumbs.length > 0) {
      thumbs.forEach((thumb, idx) => {
        thumb.addEventListener('click', () => selectMedia(idx), { signal });
      });

      if (prevArrow) {
        prevArrow.addEventListener(
          'click',
          () => {
            if (currentMediaIndex > 0) selectMedia(currentMediaIndex - 1);
          },
          { signal }
        );
      }

      if (nextArrow) {
        nextArrow.addEventListener(
          'click',
          () => {
            if (currentMediaIndex < thumbs.length - 1) selectMedia(currentMediaIndex + 1);
          },
          { signal }
        );
      }

      updateGalleryArrows();

      const keyTarget = galleryPanel || sectionEl;
      keyTarget.addEventListener(
        'keydown',
        (e) => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            if (currentMediaIndex > 0) selectMedia(currentMediaIndex - 1);
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            if (currentMediaIndex < thumbs.length - 1) selectMedia(currentMediaIndex + 1);
          }
        },
        { signal }
      );
    }

    // --- Quantity Controls ---
    if (qtyMinus && qtyPlus && qtyInput) {
      qtyMinus.addEventListener(
        'click',
        () => {
          const val = parseInt(qtyInput.value, 10) || 1;
          const min = parseInt(qtyInput.getAttribute('min'), 10) || 1;
          if (val > min) {
            qtyInput.value = String(val - 1);
            qtyInput.dispatchEvent(new Event('change', { bubbles: true }));
          }
        },
        { signal }
      );

      qtyPlus.addEventListener(
        'click',
        () => {
          const val = parseInt(qtyInput.value, 10) || 1;
          const max = parseInt(qtyInput.getAttribute('max'), 10) || 9999;
          if (val < max) {
            qtyInput.value = String(val + 1);
            qtyInput.dispatchEvent(new Event('change', { bubbles: true }));
          }
        },
        { signal }
      );

      qtyInput.addEventListener('change', updateTotalsAndButtons, { signal });
    }

    // --- Variant Selection ---
    if (optionInputs.length > 0) {
      optionInputs.forEach((input) => {
        input.addEventListener(
          'change',
          async () => {
            if (input.classList.contains('pdp-swatch-input') && colorLabelVal) {
              colorLabelVal.textContent = input.value;
            }

            const selectedOptions = [];
            sectionEl.querySelectorAll('[data-pdp-option-group]').forEach((group) => {
              const checked = group.querySelector('input:checked');
              if (checked) selectedOptions.push(checked.value);
            });

            const matchedVariant = allVariants.find((v) =>
              v.options.every((opt, idx) => opt === selectedOptions[idx])
            );

            if (!matchedVariant) {
              if (addBtn) {
                addBtn.disabled = true;
                addBtn.textContent = 'Unavailable';
              }
              if (stickyAddBtn) {
                stickyAddBtn.disabled = true;
                stickyAddBtn.textContent = 'Unavailable';
              }
              if (buyNowBtn) buyNowBtn.style.display = 'none';
              return;
            }

            const idInput = sectionEl.querySelector('input[name="id"]');
            if (idInput) idInput.value = String(matchedVariant.id);

            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set('variant', String(matchedVariant.id));
            window.history.replaceState({}, '', newUrl.toString());

            if (matchedVariant.featured_media && matchedVariant.featured_media.id) {
              const targetThumbIdx = thumbs.findIndex(
                (t) => t.getAttribute('data-media-id') === String(matchedVariant.featured_media.id)
              );
              if (targetThumbIdx !== -1) selectMedia(targetThumbIdx);
            }

            updateTotalsAndButtons();

            if (variantAbort) variantAbort.abort();
            variantAbort = new AbortController();
            const combinedSignal = AbortSignal.any
              ? AbortSignal.any([signal, variantAbort.signal])
              : variantAbort.signal;

            try {
              const renderUrl = `${window.location.pathname}?variant=${matchedVariant.id}&section_id=${sectionId}`;
              const res = await fetch(renderUrl, { signal: combinedSignal });
              if (!res.ok) return;

              const htmlText = await res.text();
              const doc = new DOMParser().parseFromString(htmlText, 'text/html');

              const newPrice = doc.querySelector('[data-pdp-price-row]');
              const curPrice = sectionEl.querySelector('[data-pdp-price-row]');
              if (newPrice && curPrice) curPrice.replaceWith(newPrice);

              const newStock = doc.querySelector('[data-pdp-stock]');
              const curStock = sectionEl.querySelector('[data-pdp-stock]');
              if (newStock && curStock) curStock.replaceWith(newStock);

              const newSkuRow = doc.querySelector('[data-pdp-sku-row]');
              const curSkuRow = sectionEl.querySelector('[data-pdp-sku-row]');
              if (newSkuRow && curSkuRow) curSkuRow.replaceWith(newSkuRow);

              const newQtyInput = doc.querySelector('[data-pdp-qty-input]');
              if (newQtyInput && qtyInput) {
                const max = newQtyInput.getAttribute('max');
                if (max) qtyInput.setAttribute('max', max);
              }

              if (buyNowBtn) {
                buyNowBtn.style.display = matchedVariant.available ? 'inline-flex' : 'none';
              }

              updateTotalsAndButtons();
            } catch (err) {
              if (err.name !== 'AbortError') console.error('PDP variant render error:', err);
            }
          },
          { signal }
        );
      });
    }

    // --- Upsell Events & Complementary Recommendations ---
    function bindUpsellRows() {
      if (!upsellEl) return;
      upsellEl.querySelectorAll('[data-pdp-upsell-check]').forEach((cb) => {
        if (cb.__bound) return;
        cb.__bound = true;
        cb.addEventListener('change', updateTotalsAndButtons, { signal });
      });

      upsellEl.querySelectorAll('[data-pdp-upsell-select]').forEach((select) => {
        if (select.__bound) return;
        select.__bound = true;
        select.addEventListener(
          'change',
          () => {
            const row = select.closest('[data-pdp-upsell-row]');
            if (!row) return;
            const cb = row.querySelector('[data-pdp-upsell-check]');
            if (cb) cb.value = select.value;

            const selectedOpt = select.options[select.selectedIndex];
            const price = Number(selectedOpt?.getAttribute('data-price')) || 0;
            const compareAt = Number(selectedOpt?.getAttribute('data-compare-at')) || 0;

            const priceEl = row.querySelector('[data-pdp-upsell-price-current]');
            const compareEl = row.querySelector('[data-pdp-upsell-price-compare]');
            if (priceEl) priceEl.textContent = formatMoneySafe(price, moneyFormat, currencyCode);
            if (compareEl) {
              if (compareAt > price) {
                compareEl.textContent = formatMoneySafe(compareAt, moneyFormat, currencyCode);
                compareEl.hidden = false;
              } else {
                compareEl.hidden = true;
              }
            }

            updateTotalsAndButtons();
          },
          { signal }
        );
      });
    }

    async function loadUpsellRecommendations() {
      if (!upsellEl || !upsellItemsWrap) return;
      const recsUrl = upsellEl.getAttribute('data-recommendations-url');
      if (!recsUrl) {
        bindUpsellRows();
        updateTotalsAndButtons();
        return;
      }

      if (recsAbort) recsAbort.abort();
      recsAbort = new AbortController();
      const combinedSignal = AbortSignal.any
        ? AbortSignal.any([signal, recsAbort.signal])
        : recsAbort.signal;

      try {
        const res = await fetch(recsUrl, { signal: combinedSignal });
        if (!res.ok) {
          upsellEl.remove();
          return;
        }
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const newItems = doc.querySelector('[data-pdp-upsell-items]');
        const hasRows = newItems && newItems.querySelectorAll('[data-pdp-upsell-row]').length > 0;
        if (!hasRows) {
          upsellEl.remove();
          updateTotalsAndButtons();
          return;
        }
        upsellItemsWrap.innerHTML = newItems.innerHTML;
        upsellEl.setAttribute('data-source-mode', 'recommendations');
        bindUpsellRows();
        updateTotalsAndButtons();
      } catch (err) {
        if (err.name !== 'AbortError') {
          upsellEl.remove();
          updateTotalsAndButtons();
        }
      }
    }

    loadUpsellRecommendations();

    // --- Atomic Add to Cart & Buy Now ---
    async function addToCartAction(isBuyNow = false) {
      if (!form || !addBtn || addBtn.disabled || isSubmitting) return;
      isSubmitting = true;

      const mainId = Number(sectionEl.querySelector('input[name="id"]')?.value);
      const mainQty = getMainQty();
      const addons = getCheckedAddons();
      const items = [{ id: mainId, quantity: mainQty }];
      for (const addon of addons) {
        items.push({ id: addon.variantId, quantity: 1 });
      }

      addBtn.disabled = true;
      addBtn.setAttribute('aria-busy', 'true');
      addBtn.textContent = 'Adding…';
      if (stickyAddBtn) {
        stickyAddBtn.disabled = true;
        stickyAddBtn.textContent = 'Adding…';
      }
      if (statusMsg) {
        statusMsg.textContent = '';
        statusMsg.className = 'pdp-form-status';
      }

      try {
        const payload = {
          items,
          sections: getCartSectionIds().join(','),
          sections_url: window.location.pathname,
        };

        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
          signal,
        });

        const data = await response.json();

        if (!response.ok) {
          const errMessage = data.description || data.message || 'Could not add to cart.';
          // If an add-on became unavailable, uncheck and disable that row
          const lowerErr = errMessage.toLowerCase();
          for (const addon of addons) {
            if (addon.title && lowerErr.includes(addon.title.toLowerCase())) {
              addon.checkbox.checked = false;
              addon.checkbox.disabled = true;
              addon.row.classList.add('pdp-upsell__row--disabled');
            }
          }
          throw new Error(errMessage);
        }

        if (isBuyNow) {
          window.location.href = '/checkout';
          return;
        }

        await notifyCartUpdated(data);

        addBtn.textContent = 'Added ✓';
        if (stickyAddBtn) stickyAddBtn.textContent = 'Added ✓';
        if (statusMsg) {
          statusMsg.textContent = 'Added to your cart.';
          statusMsg.className = 'pdp-form-status pdp-form-status--success';
        }

        setTimeout(() => {
          isSubmitting = false;
          addBtn.removeAttribute('aria-busy');
          updateTotalsAndButtons();
          if (statusMsg) statusMsg.textContent = '';
        }, 1400);
      } catch (err) {
        if (err.name === 'AbortError') return;
        isSubmitting = false;
        addBtn.removeAttribute('aria-busy');
        updateTotalsAndButtons();
        if (statusMsg) {
          statusMsg.textContent = err.message || 'Error adding to cart. Please try again.';
          statusMsg.className = 'pdp-form-status pdp-form-status--error';
        }
      }
    }

    if (form) {
      form.addEventListener(
        'submit',
        (e) => {
          e.preventDefault();
          addToCartAction(false);
        },
        { signal }
      );
    }

    if (buyNowBtn) {
      buyNowBtn.addEventListener(
        'click',
        (e) => {
          e.preventDefault();
          addToCartAction(true);
        },
        { signal }
      );
    }

    if (stickyAddBtn) {
      stickyAddBtn.addEventListener(
        'click',
        (e) => {
          e.preventDefault();
          addToCartAction(false);
        },
        { signal }
      );
    }

    // --- Sticky Bar IntersectionObserver (hides when main CTA or footer is visible) ---
    if (stickyEl && addBtn && 'IntersectionObserver' in window) {
      let ctaVisible = true;
      let footerVisible = false;

      function syncStickyVisibility() {
        const shouldShow = !ctaVisible && !footerVisible;
        stickyEl.classList.toggle('is-visible', shouldShow);
        stickyEl.setAttribute('aria-hidden', String(!shouldShow));
        if (shouldShow) {
          stickyEl.removeAttribute('inert');
        } else {
          stickyEl.setAttribute('inert', '');
        }
      }

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.target === addBtn) {
              ctaVisible = entry.isIntersecting;
            } else {
              footerVisible = entry.isIntersecting;
            }
          }
          syncStickyVisibility();
        },
        { threshold: 0.05 }
      );

      observer.observe(addBtn);
      const footerEl =
        document.querySelector('footer') ||
        document.querySelector('[id*="footer"]') ||
        document.querySelector('.footer');
      if (footerEl) observer.observe(footerEl);

      signal.addEventListener('abort', () => observer.disconnect(), { once: true });
    }

    // --- Rating Click Scrolls to Reviews Tab ---
    if (ratingLink) {
      ratingLink.addEventListener(
        'click',
        (e) => {
          e.preventDefault();
          const reviewsTabBtn = document.querySelector('[data-pdp-tab-trigger="reviews"]');
          if (reviewsTabBtn) reviewsTabBtn.click();
          const tabsSection = document.querySelector('.pdp-tabs');
          if (tabsSection) tabsSection.scrollIntoView({ behavior: 'smooth' });
        },
        { signal }
      );
    }

    // --- Wishlist Toggle ---
    if (wishlistBtn) {
      const handle = wishlistBtn.getAttribute('data-product-handle');
      try {
        const stored = JSON.parse(localStorage.getItem('pdp_wishlist') || '[]');
        if (stored.includes(handle)) wishlistBtn.setAttribute('aria-pressed', 'true');
      } catch (e) {}

      wishlistBtn.addEventListener(
        'click',
        () => {
          const isPressed = wishlistBtn.getAttribute('aria-pressed') === 'true';
          const nextState = !isPressed;
          wishlistBtn.setAttribute('aria-pressed', String(nextState));

          try {
            let stored = JSON.parse(localStorage.getItem('pdp_wishlist') || '[]');
            if (nextState && !stored.includes(handle)) {
              stored.push(handle);
            } else if (!nextState) {
              stored = stored.filter((h) => h !== handle);
            }
            localStorage.setItem('pdp_wishlist', JSON.stringify(stored));
          } catch (e) {}

          document.dispatchEvent(
            new CustomEvent('wishlist:toggle', {
              bubbles: true,
              detail: { handle, active: nextState },
            })
          );
        },
        { signal }
      );
    }

    updateTotalsAndButtons();
  }

  // --- 2. TABS SECTION CONTROLLER ---
  function initPdpTabs(sectionEl) {
    if (!sectionEl || sectionEl.__pdpTabsInitialized) return;
    sectionEl.__pdpTabsInitialized = true;

    const ac = new AbortController();
    const { signal } = ac;
    sectionEl.__pdpCleanup = () => ac.abort();

    const tabBtns = Array.from(sectionEl.querySelectorAll('[data-pdp-tab-trigger]'));
    const panels = Array.from(sectionEl.querySelectorAll('[data-pdp-tab-panel]'));

    function activateTab(targetId) {
      tabBtns.forEach((btn) => {
        const isActive = btn.getAttribute('data-pdp-tab-trigger') === targetId;
        btn.setAttribute('aria-selected', String(isActive));
        btn.setAttribute('tabindex', isActive ? '0' : '-1');
      });

      panels.forEach((p) => {
        const isActive = p.getAttribute('data-pdp-tab-panel') === targetId;
        p.setAttribute('data-active', String(isActive));
        p.hidden = !isActive;
      });
    }

    tabBtns.forEach((btn, index) => {
      btn.addEventListener(
        'click',
        () => {
          const targetId = btn.getAttribute('data-pdp-tab-trigger');
          activateTab(targetId);
        },
        { signal }
      );

      btn.addEventListener(
        'keydown',
        (e) => {
          let newIdx = -1;
          if (e.key === 'ArrowRight') {
            newIdx = (index + 1) % tabBtns.length;
          } else if (e.key === 'ArrowLeft') {
            newIdx = (index - 1 + tabBtns.length) % tabBtns.length;
          } else if (e.key === 'Home') {
            newIdx = 0;
          } else if (e.key === 'End') {
            newIdx = tabBtns.length - 1;
          }

          if (newIdx !== -1) {
            e.preventDefault();
            tabBtns[newIdx].focus();
            tabBtns[newIdx].click();
          }
        },
        { signal }
      );
    });

    if (window.location.hash) {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash.includes('review')) activateTab('reviews');
      else if (hash.includes('additional') || hash.includes('info')) activateTab('additional');
      else if (hash.includes('desc')) activateTab('description');
    }
  }

  // --- 3. RELATED PRODUCTS CAROUSEL CONTROLLER ---
  function initPdpRelated(sectionEl) {
    if (!sectionEl || sectionEl.__pdpRelatedInitialized) return;
    sectionEl.__pdpRelatedInitialized = true;

    const ac = new AbortController();
    const { signal } = ac;
    sectionEl.__pdpCleanup = () => ac.abort();

    const trackWrap = sectionEl.querySelector('[data-pdp-related-track-wrap]');
    const prevBtn = sectionEl.querySelector('[data-pdp-related-prev]');
    const nextBtn = sectionEl.querySelector('[data-pdp-related-next]');

    if (trackWrap && prevBtn && nextBtn) {
      function updateArrowStates() {
        const atStart = trackWrap.scrollLeft <= 5;
        const atEnd = trackWrap.scrollLeft + trackWrap.clientWidth >= trackWrap.scrollWidth - 5;
        prevBtn.disabled = atStart;
        nextBtn.disabled = atEnd;
      }

      prevBtn.addEventListener(
        'click',
        () => {
          const cardWidth = trackWrap.querySelector('.pdp-related__item')?.offsetWidth || 260;
          trackWrap.scrollBy({ left: -(cardWidth + 16), behavior: 'smooth' });
        },
        { signal }
      );

      nextBtn.addEventListener(
        'click',
        () => {
          const cardWidth = trackWrap.querySelector('.pdp-related__item')?.offsetWidth || 260;
          trackWrap.scrollBy({ left: cardWidth + 16, behavior: 'smooth' });
        },
        { signal }
      );

      trackWrap.addEventListener('scroll', updateArrowStates, { passive: true, signal });
      updateArrowStates();
    }

    sectionEl.querySelectorAll('[data-pdp-quick-add]').forEach((btn) => {
      btn.addEventListener(
        'click',
        async (e) => {
          e.preventDefault();
          e.stopPropagation();

          const variantId = Number(btn.getAttribute('data-variant-id'));
          if (!variantId) return;

          btn.disabled = true;

          try {
            const res = await fetch('/cart/add.js', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                Accept: 'application/json',
              },
              body: JSON.stringify({
                items: [{ id: variantId, quantity: 1 }],
                sections: getCartSectionIds().join(','),
                sections_url: window.location.pathname,
              }),
              signal,
            });

            const data = await res.json();
            if (res.ok) {
              await notifyCartUpdated(data);
            }
          } catch (err) {
            if (err.name !== 'AbortError') console.error('Quick add error:', err);
          } finally {
            btn.disabled = false;
          }
        },
        { signal }
      );
    });
  }

  function initSection(sec) {
    if (!sec) return;
    const target = sec.matches('[data-section-type]') ? sec : sec.querySelector('[data-section-type]');
    if (!target) return;
    const type = target.getAttribute('data-section-type');
    if (type === 'pdp-main') initPdpMain(target);
    if (type === 'pdp-tabs') initPdpTabs(target);
    if (type === 'pdp-related') initPdpRelated(target);
  }

  function cleanupSection(sec) {
    if (!sec) return;
    const target = sec.matches('[data-section-type]') ? sec : sec.querySelector('[data-section-type]');
    if (target && typeof target.__pdpCleanup === 'function') {
      target.__pdpCleanup();
      target.__pdpInitialized = false;
      target.__pdpTabsInitialized = false;
      target.__pdpRelatedInitialized = false;
    }
  }

  function initAll() {
    document.querySelectorAll('[data-section-type="pdp-main"]').forEach(initPdpMain);
    document.querySelectorAll('[data-section-type="pdp-tabs"]').forEach(initPdpTabs);
    document.querySelectorAll('[data-section-type="pdp-related"]').forEach(initPdpRelated);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  document.addEventListener('shopify:section:load', (e) => initSection(e.target));
  document.addEventListener('shopify:section:unload', (e) => cleanupSection(e.target));
})();
