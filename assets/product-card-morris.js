/**
 * Luxury Product Card - Add to Cart & Quick View Modal Handlers
 */

(function () {
  if (window.__morrisCardInit) return;
  window.__morrisCardInit = true;

  // ---------------------------------------------------------------------------
  // 1. Quick Add to Cart Handler
  // ---------------------------------------------------------------------------
  document.addEventListener('click', async function (e) {
    const quickAddBtn = e.target.closest('.js-quick-add');
    if (!quickAddBtn) return;

    e.preventDefault();
    e.stopPropagation();

    // Prevent double clicks while loading or showing added
    if (quickAddBtn.classList.contains('is-loading') || quickAddBtn.classList.contains('is-added') || quickAddBtn.disabled) {
      return;
    }

    const variantId = quickAddBtn.getAttribute('data-variant-id');
    if (!variantId) return;

    quickAddBtn.classList.add('is-loading');

    let deferredEvent = null;
    try {
      const { CartLinesUpdateEvent } = await import('@shopify/events');
      if (CartLinesUpdateEvent) {
        deferredEvent = CartLinesUpdateEvent.createPromise ? CartLinesUpdateEvent.createPromise() : null;
        document.dispatchEvent(
          new CartLinesUpdateEvent({
            action: 'add',
            context: 'product',
            lines: [{ merchandiseId: String(variantId), quantity: 1 }],
            promise: deferredEvent?.promise,
          })
        );
      }
    } catch (importErr) {
      document.dispatchEvent(
        new CustomEvent('cart:add:start', {
          bubbles: true,
          detail: { variantId, quantity: 1 },
        })
      );
    }

    try {
      const formData = new FormData();
      formData.append('id', variantId);
      formData.append('quantity', '1');
      formData.append('sections', 'cart-drawer-section');

      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.description || data.message || 'Could not add to cart');
      }

      // Success Feedback on Button
      quickAddBtn.classList.remove('is-loading');
      quickAddBtn.classList.add('is-added');

      // Update Cart Drawer via Theme Section Renderer or Inner HTML
      if (data.sections && data.sections['cart-drawer-section']) {
        try {
          const { morphSection } = await import('@theme/section-renderer');
          if (morphSection) {
            await morphSection('cart-drawer-section', data.sections['cart-drawer-section'], { mode: 'hydration' });
          }
        } catch (morphErr) {
          const drawerInner = document.querySelector('.cart-drawer__inner');
          if (drawerInner) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data.sections['cart-drawer-section'], 'text/html');
            const newInner = doc.querySelector('.cart-drawer__inner');
            if (newInner) {
              drawerInner.innerHTML = newInner.innerHTML;
            }
          }
        }
      }

      // Update Cart Counts & Resolve Event
      try {
        const cartRes = await fetch('/cart.js');
        const cartData = await cartRes.json();

        document.querySelectorAll('[data-cart-count], .cart-count, cart-icon [ref="cartBubbleCount"]').forEach((el) => {
          el.textContent = cartData.item_count;
        });

        if (deferredEvent) {
          const { CartLinesUpdateEvent } = await import('@shopify/events');
          deferredEvent.resolve({
            cart: CartLinesUpdateEvent?.createCart ? CartLinesUpdateEvent.createCart(cartData) : cartData,
            detail: {
              didError: false,
              items: cartData.items,
              itemCount: 1,
              sections: data.sections,
            },
          });
        }
      } catch (countErr) {
        if (deferredEvent) deferredEvent.resolve({ detail: {} });
      }

      // Open Theme Drawer
      const drawer = document.getElementById('cart-drawer');
      if (drawer && typeof drawer.open === 'function') {
        drawer.open();
      } else if (drawer) {
        const dialog = drawer.querySelector('dialog');
        if (dialog && !dialog.open && typeof dialog.showModal === 'function') {
          dialog.showModal();
        }
      }

      // If added inside Quickview modal, close modal smoothly
      const modal = quickAddBtn.closest('.js-quickview-modal');
      if (modal) {
        setTimeout(function () {
          modal.classList.remove('is-open');
          modal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }, 1000);
      }

      setTimeout(function () {
        quickAddBtn.classList.remove('is-added');
      }, 1800);
    } catch (err) {
      console.error('[product-card-morris] Error adding to cart:', err);
      if (deferredEvent) {
        deferredEvent.reject(err);
      }
      quickAddBtn.classList.remove('is-loading');
    }
  });

  // ---------------------------------------------------------------------------
  // 2. Quick View Modal Handler (Portaled to document.body for true full-viewport popup)
  // ---------------------------------------------------------------------------
  function openQuickViewModal(modal) {
    if (!modal) return;
    if (modal.parentElement !== document.body) {
      document.body.appendChild(modal);
    }
    // Force reflow before adding .is-open so CSS transition always plays smoothly
    void modal.offsetWidth;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeQuickViewModal(modal) {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', function (e) {
    const qvOpen = e.target.closest('.js-quickview-open');
    if (qvOpen) {
      e.preventDefault();
      e.stopPropagation();
      const card = qvOpen.closest('.lilac-product-card');
      const modal =
        (card && (card.__qvModal || card.querySelector('.js-quickview-modal'))) ||
        document.getElementById(qvOpen.getAttribute('aria-controls') || '');
      if (card && modal) {
        card.__qvModal = modal;
      }
      openQuickViewModal(modal);
      return;
    }

    const qvClose = e.target.closest('.js-quickview-close');
    if (qvClose) {
      e.preventDefault();
      const modal = qvClose.closest('.js-quickview-modal');
      closeQuickViewModal(modal);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      const openModal = document.querySelector('.lilac-quickview-modal.is-open');
      closeQuickViewModal(openModal);
    }
  });
})();
