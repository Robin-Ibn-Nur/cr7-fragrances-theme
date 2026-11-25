/**
 * Main Product Premium - Vanilla JS Controller
 * Scoped per section instance, zero global pollution
 */

(function () {
  function initSection(sectionEl) {
    if (!sectionEl || sectionEl.__mppInitialized) return;
    sectionEl.__mppInitialized = true;

    const sectionId = sectionEl.getAttribute('data-section-id');
    const form = sectionEl.querySelector('.mpp-form');
    const addBtn = sectionEl.querySelector('[data-mpp-add-btn]');
    const addBtnText = sectionEl.querySelector('[data-mpp-btn-text]');
    const statusMsg = sectionEl.querySelector('[data-mpp-status]');
    const qtyInput = sectionEl.querySelector('[data-mpp-qty-input]');
    const qtyMinus = sectionEl.querySelector('[data-mpp-qty-minus]');
    const qtyPlus = sectionEl.querySelector('[data-mpp-qty-plus]');
    const stageBox = sectionEl.querySelector('[data-mpp-stage-box]');
    const stageImg = sectionEl.querySelector('[data-mpp-stage-img]');
    const thumbs = Array.from(sectionEl.querySelectorAll('[data-mpp-thumb]'));
    const counterCurrent = sectionEl.querySelector('[data-mpp-counter-current]');
    const wishlistBtn = sectionEl.querySelector('[data-mpp-wishlist-btn]');
    const variantInputs = sectionEl.querySelectorAll('.mpp-variant-pill__input');
    const mobileBar = sectionEl.querySelector('[data-mpp-mobile-bar]');
    const mobileBarBtn = sectionEl.querySelector('[data-mpp-mobile-bar-btn]');
    const mobileBarPrice = sectionEl.querySelector('[data-mpp-mobile-bar-price]');
    const lightbox = sectionEl.querySelector('#mpp-lightbox');

    let currentMediaIndex = 0;

    // 1. Quantity Selector
    if (qtyMinus && qtyPlus && qtyInput) {
      qtyMinus.addEventListener('click', function () {
        const val = parseInt(qtyInput.value, 10) || 1;
        const min = parseInt(qtyInput.getAttribute('min'), 10) || 1;
        if (val > min) {
          qtyInput.value = val - 1;
          qtyInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });

      qtyPlus.addEventListener('click', function () {
        const val = parseInt(qtyInput.value, 10) || 1;
        const max = parseInt(qtyInput.getAttribute('max'), 10) || 9999;
        if (val < max) {
          qtyInput.value = val + 1;
          qtyInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    }

    // 2. Thumbnails & Stage Image Switching
    function selectMediaByIndex(index) {
      if (!thumbs.length || index < 0 || index >= thumbs.length) return;
      currentMediaIndex = index;
      const targetThumb = thumbs[index];

      thumbs.forEach(t => t.removeAttribute('aria-current'));
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

      if (counterCurrent) {
        counterCurrent.textContent = String(index + 1);
      }

      // Keep active thumbnail visible in scroll container
      targetThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }

    if (thumbs.length > 0) {
      thumbs.forEach((thumb, index) => {
        thumb.addEventListener('click', function () {
          selectMediaByIndex(index);
        });

        thumb.addEventListener('keydown', function (e) {
          if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            const nextIdx = (index + 1) % thumbs.length;
            thumbs[nextIdx].focus();
            selectMediaByIndex(nextIdx);
          } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const prevIdx = (index - 1 + thumbs.length) % thumbs.length;
            thumbs[prevIdx].focus();
            selectMediaByIndex(prevIdx);
          }
        });
      });
    }

    // 3. Accessible Native <dialog> Lightbox
    if (lightbox && stageBox) {
      const lbImg = lightbox.querySelector('[data-mpp-lightbox-img]');
      const lbCounter = lightbox.querySelector('[data-mpp-lightbox-counter]');
      const lbClose = lightbox.querySelector('[data-mpp-lightbox-close]');
      const lbPrev = lightbox.querySelector('[data-mpp-lightbox-prev]');
      const lbNext = lightbox.querySelector('[data-mpp-lightbox-next]');

      function updateLightbox() {
        if (!thumbs.length) {
          if (stageImg && lbImg) {
            lbImg.src = stageImg.src;
            lbImg.alt = stageImg.alt;
          }
          return;
        }
        const activeThumb = thumbs[currentMediaIndex];
        if (activeThumb && lbImg) {
          lbImg.src = activeThumb.getAttribute('data-full-src') || stageImg.src;
          lbImg.alt = activeThumb.getAttribute('data-alt') || stageImg.alt;
        }
        if (lbCounter) {
          lbCounter.textContent = `${currentMediaIndex + 1} / ${thumbs.length}`;
        }
      }

      function openLightbox() {
        updateLightbox();
        if (typeof lightbox.showModal === 'function') {
          lightbox.showModal();
        } else {
          lightbox.setAttribute('open', '');
        }
        if (lbClose) lbClose.focus();
      }

      function closeLightbox() {
        if (typeof lightbox.close === 'function') {
          lightbox.close();
        } else {
          lightbox.removeAttribute('open');
        }
        stageBox.focus();
      }

      stageBox.addEventListener('click', openLightbox);
      stageBox.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox();
        }
      });

      if (lbClose) lbClose.addEventListener('click', closeLightbox);

      if (lbPrev) {
        lbPrev.addEventListener('click', function (e) {
          e.stopPropagation();
          const prevIdx = (currentMediaIndex - 1 + thumbs.length) % thumbs.length;
          selectMediaByIndex(prevIdx);
          updateLightbox();
        });
      }

      if (lbNext) {
        lbNext.addEventListener('click', function (e) {
          e.stopPropagation();
          const nextIdx = (currentMediaIndex + 1) % thumbs.length;
          selectMediaByIndex(nextIdx);
          updateLightbox();
        });
      }

      lightbox.addEventListener('click', function (e) {
        // Close on click outside modal stage
        if (e.target === lightbox) {
          closeLightbox();
        }
      });

      lightbox.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          closeLightbox();
        } else if (e.key === 'ArrowLeft' && lbPrev) {
          lbPrev.click();
        } else if (e.key === 'ArrowRight' && lbNext) {
          lbNext.click();
        }
      });
    }

    // 4. Variant Selection (Pills)
    if (variantInputs.length > 0) {
      variantInputs.forEach(input => {
        input.addEventListener('change', async function () {
          const selectedOptions = [];
          const groups = sectionEl.querySelectorAll('.mpp-variant-picker__group');
          groups.forEach(group => {
            const checked = group.querySelector('.mpp-variant-pill__input:checked');
            if (checked) selectedOptions.push(checked.value);
          });

          const variantsScript = sectionEl.querySelector('[data-mpp-variants-json]');
          if (!variantsScript) return;

          let variants = [];
          try {
            variants = JSON.parse(variantsScript.textContent);
          } catch (e) {
            return;
          }

          const matchedVariant = variants.find(v => {
            return v.options.every((opt, idx) => opt === selectedOptions[idx]);
          });

          if (!matchedVariant) {
            if (addBtn) {
              addBtn.disabled = true;
              if (addBtnText) addBtnText.textContent = 'Unavailable';
            }
            if (mobileBarBtn) {
              mobileBarBtn.disabled = true;
              mobileBarBtn.textContent = 'Unavailable';
            }
            return;
          }

          // Update URL
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.set('variant', matchedVariant.id);
          window.history.replaceState({}, '', newUrl.toString());

          // Update hidden form id
          const idInput = sectionEl.querySelector('input[name="id"]');
          if (idInput) idInput.value = matchedVariant.id;

          // Update button states
          if (addBtn && addBtnText) {
            if (!matchedVariant.available) {
              addBtn.disabled = true;
              addBtnText.textContent = 'Sold out';
            } else {
              addBtn.disabled = false;
              addBtnText.textContent = 'Add to cart';
            }
          }
          if (mobileBarBtn) {
            if (!matchedVariant.available) {
              mobileBarBtn.disabled = true;
              mobileBarBtn.textContent = 'Sold out';
            } else {
              mobileBarBtn.disabled = false;
              mobileBarBtn.textContent = 'Add to Cart';
            }
          }

          // Update featured media thumbnail
          if (matchedVariant.featured_media && matchedVariant.featured_media.id) {
            const targetThumbIdx = thumbs.findIndex(t => t.getAttribute('data-media-id') === String(matchedVariant.featured_media.id));
            if (targetThumbIdx !== -1) {
              selectMediaByIndex(targetThumbIdx);
            }
          }

          // Fetch Section Rendering API for exact formatted price
          try {
            const renderUrl = `${window.location.pathname}?variant=${matchedVariant.id}&section_id=${sectionId}`;
            const res = await fetch(renderUrl);
            if (res.ok) {
              const htmlText = await res.text();
              const parser = new DOMParser();
              const doc = parser.parseFromString(htmlText, 'text/html');

              const newPrice = doc.querySelector('[data-mpp-price-row]');
              const curPrice = sectionEl.querySelector('[data-mpp-price-row]');
              if (newPrice && curPrice) curPrice.replaceWith(newPrice);

              const newStickyPrice = doc.querySelector('.mpp-buybox__price-current');
              if (newStickyPrice && mobileBarPrice) {
                mobileBarPrice.textContent = newStickyPrice.textContent.trim();
              }
            }
          } catch (err) {
            console.error('Section Rendering API update error:', err);
          }
        });
      });
    }

    // 5. AJAX Add to Cart (Shared by Main & Mobile Bar Buttons)
    async function executeAddToCart() {
      if (!form || !addBtn || addBtn.disabled) return;

      const originalText = addBtnText ? addBtnText.textContent : 'Add to cart';
      addBtn.disabled = true;
      addBtn.setAttribute('aria-busy', 'true');
      addBtn.setAttribute('data-state', 'loading');
      if (addBtnText) addBtnText.textContent = 'Adding…';
      if (mobileBarBtn) {
        mobileBarBtn.disabled = true;
        mobileBarBtn.textContent = 'Adding…';
      }
      if (statusMsg) {
        statusMsg.textContent = 'Adding to cart…';
        statusMsg.className = 'mpp-form__status';
      }

      const formData = new FormData(form);
      formData.append('sections', 'cart-drawer-section');

      const variantId = formData.get('id');
      const quantity = Number(formData.get('quantity')) || 1;

      try {
        // StandardEvents cartLinesUpdate event if loaded
        try {
          const { CartLinesUpdateEvent } = await import('@shopify/events');
          if (CartLinesUpdateEvent) {
            document.dispatchEvent(
              new CartLinesUpdateEvent({
                action: 'add',
                context: 'product',
                lines: [{ merchandiseId: String(variantId), quantity: quantity }],
              })
            );
          }
        } catch (evErr) {}

        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            Accept: 'application/javascript',
          },
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.description || data.message || 'Could not add to cart');
        }

        // Morph or update cart drawer section
        if (data.sections && data.sections['cart-drawer-section']) {
          const currentDrawer = document.getElementById('shopify-section-cart-drawer-section');
          if (currentDrawer) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data.sections['cart-drawer-section'], 'text/html');
            const newDrawer = doc.getElementById('shopify-section-cart-drawer-section') || doc.body.firstElementChild;
            if (newDrawer) currentDrawer.replaceWith(newDrawer);
          }
        }

        // Open cart drawer
        const cartDrawer = document.querySelector('cart-drawer') || document.querySelector('#cart-drawer');
        if (cartDrawer && typeof cartDrawer.open === 'function') {
          cartDrawer.open();
        } else if (cartDrawer && cartDrawer.showModal) {
          cartDrawer.showModal();
        } else {
          const openBtn = document.querySelector('[data-testid="cart-button"]') || document.querySelector('.cart-icon-wrapper');
          if (openBtn) openBtn.click();
        }

        // Success state
        addBtn.setAttribute('data-state', 'added');
        if (addBtnText) addBtnText.textContent = 'Added ✓';
        if (mobileBarBtn) mobileBarBtn.textContent = 'Added ✓';
        if (statusMsg) {
          statusMsg.textContent = 'Added to your cart successfully!';
          statusMsg.className = 'mpp-form__status mpp-form__status--success';
        }

        setTimeout(() => {
          addBtn.disabled = false;
          addBtn.removeAttribute('aria-busy');
          addBtn.removeAttribute('data-state');
          if (addBtnText) addBtnText.textContent = originalText;
          if (mobileBarBtn) {
            mobileBarBtn.disabled = false;
            mobileBarBtn.textContent = 'Add to Cart';
          }
          if (statusMsg) statusMsg.textContent = '';
        }, 1600);

      } catch (err) {
        addBtn.disabled = false;
        addBtn.removeAttribute('aria-busy');
        addBtn.removeAttribute('data-state');
        if (addBtnText) addBtnText.textContent = originalText;
        if (mobileBarBtn) {
          mobileBarBtn.disabled = false;
          mobileBarBtn.textContent = 'Add to Cart';
        }
        if (statusMsg) {
          statusMsg.textContent = err.message || 'Error adding to cart. Please try again.';
          statusMsg.className = 'mpp-form__status mpp-form__status--error';
        }
      }
    }

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        executeAddToCart();
      });
    }

    if (mobileBarBtn) {
      mobileBarBtn.addEventListener('click', function () {
        executeAddToCart();
      });
    }

    // 6. Sticky Mobile Add-to-Cart Bar (< 750px) with IntersectionObserver
    if (mobileBar && addBtn && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting && window.innerWidth < 750) {
            mobileBar.setAttribute('data-visible', 'true');
            mobileBar.setAttribute('aria-hidden', 'false');
          } else {
            mobileBar.setAttribute('data-visible', 'false');
            mobileBar.setAttribute('aria-hidden', 'true');
          }
        });
      }, { threshold: 0.1 });

      observer.observe(addBtn);

      window.addEventListener('resize', () => {
        if (window.innerWidth >= 750) {
          mobileBar.setAttribute('data-visible', 'false');
          mobileBar.setAttribute('aria-hidden', 'true');
        }
      }, { passive: true });
    }

    // 7. Wishlist Button Toggle
    if (wishlistBtn) {
      const handle = wishlistBtn.getAttribute('data-product-handle');
      const storageKey = 'mpp_wishlist_' + handle;

      try {
        if (localStorage.getItem(storageKey) === 'true') {
          wishlistBtn.setAttribute('aria-pressed', 'true');
        }
      } catch (e) {}

      wishlistBtn.addEventListener('click', function () {
        const isPressed = wishlistBtn.getAttribute('aria-pressed') === 'true';
        const nextState = !isPressed;
        wishlistBtn.setAttribute('aria-pressed', String(nextState));

        try {
          if (nextState) {
            localStorage.setItem(storageKey, 'true');
          } else {
            localStorage.removeItem(storageKey);
          }
        } catch (e) {}

        document.dispatchEvent(
          new CustomEvent('wishlist:toggle', {
            bubbles: true,
            detail: { handle: handle, active: nextState },
          })
        );
      });
    }
  }

  // Auto-init on page load & theme editor section events
  document.querySelectorAll('[data-section-type="main-product-premium"]').forEach(initSection);

  document.addEventListener('shopify:section:load', function (e) {
    if (e.target.matches('[data-section-type="main-product-premium"]')) {
      initSection(e.target);
    }
  });
})();
