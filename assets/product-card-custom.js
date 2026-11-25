/**
 * Product Card Custom - Ajax Add to Cart & Drawer Integration
 */

(function () {
  if (window.__pccInitialized) return;
  window.__pccInitialized = true;

  document.addEventListener('submit', async function (event) {
    const form = event.target.closest('.pcc-form');
    if (!form) return;

    event.preventDefault();

    const btn = form.querySelector('[data-pcc-btn]');
    const btnText = form.querySelector('[data-pcc-btn-text]');
    const card = form.closest('.pcc-card');
    const statusLive = card?.querySelector('[data-pcc-status]');

    if (!btn || btn.disabled) return;

    const originalText = btnText ? btnText.textContent : 'Add to cart';

    // Set Loading State
    btn.disabled = true;
    btn.setAttribute('aria-busy', 'true');
    btn.setAttribute('data-pcc-state', 'loading');
    if (btnText) btnText.textContent = 'Adding…';
    if (statusLive) statusLive.textContent = 'Adding product to cart…';

    const formData = new FormData(form);
    formData.append('sections', 'cart-drawer-section');

    const variantId = formData.get('id');
    const quantity = Number(formData.get('quantity')) || 1;

    let deferredEvent = null;

    try {
      // Dispatch StandardEvents.cartLinesUpdate if module is available
      try {
        const { CartLinesUpdateEvent } = await import('@shopify/events');
        if (CartLinesUpdateEvent) {
          deferredEvent = CartLinesUpdateEvent.createPromise ? CartLinesUpdateEvent.createPromise() : null;
          document.dispatchEvent(
            new CartLinesUpdateEvent({
              action: 'add',
              context: 'product',
              lines: [
                {
                  merchandiseId: String(variantId),
                  quantity: quantity,
                },
              ],
              promise: deferredEvent?.promise,
            })
          );
        }
      } catch (importErr) {
        // Fallback: standard custom event
        document.dispatchEvent(
          new CustomEvent('cart:add:start', {
            bubbles: true,
            detail: { variantId, quantity },
          })
        );
      }

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

      // Update Section Markup for Cart Drawer
      if (data.sections && data.sections['cart-drawer-section']) {
        const currentDrawerSection = document.getElementById('shopify-section-cart-drawer-section');
        if (currentDrawerSection) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(data.sections['cart-drawer-section'], 'text/html');
          const newDrawerSection = doc.getElementById('shopify-section-cart-drawer-section') || doc.body.firstElementChild;
          if (newDrawerSection) {
            currentDrawerSection.replaceWith(newDrawerSection);
          }
        }
      }

      // Resolve CartLinesUpdateEvent promise if created
      if (deferredEvent) {
        try {
          const cartRes = await fetch('/cart.js');
          const cartData = await cartRes.json();
          const { CartLinesUpdateEvent } = await import('@shopify/events');
          deferredEvent.resolve({
            detail: {
              cart: CartLinesUpdateEvent?.createCart ? CartLinesUpdateEvent.createCart(cartData) : cartData,
              lines: [{ merchandiseId: String(variantId), quantity: quantity }],
            },
          });
        } catch (resolveErr) {
          deferredEvent.resolve({ detail: {} });
        }
      }

      // Dispatch general cart updated event
      document.dispatchEvent(
        new CustomEvent('cart:updated', {
          bubbles: true,
          detail: { data },
        })
      );

      // Auto-open Theme Drawer
      const drawer = document.getElementById('cart-drawer');
      if (drawer && typeof drawer.open === 'function') {
        drawer.open();
      }

      // Show Success State
      btn.removeAttribute('aria-busy');
      btn.setAttribute('data-pcc-state', 'added');
      if (btnText) btnText.textContent = 'Added ✓';
      if (statusLive) statusLive.textContent = 'Product added to cart.';

      setTimeout(() => {
        if (btnText) btnText.textContent = originalText;
        btn.disabled = false;
        btn.removeAttribute('data-pcc-state');
      }, 1500);

    } catch (err) {
      console.error('[product-card-custom] Add to cart error:', err);
      if (deferredEvent) {
        deferredEvent.reject(err);
      }

      if (btnText) btnText.textContent = err.message || 'Error';
      if (statusLive) statusLive.textContent = err.message || 'Error adding product to cart.';

      setTimeout(() => {
        if (btnText) btnText.textContent = originalText;
        btn.disabled = false;
        btn.removeAttribute('aria-busy');
        btn.removeAttribute('data-pcc-state');
      }, 2000);
    }
  });
})();
