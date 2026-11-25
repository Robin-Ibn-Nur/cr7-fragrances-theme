/**
 * Product Card Hover Component
 * Handles AJAX add-to-cart, button state transitions, cart drawer opening,
 * and live region announcements.
 */

(function initProductCardHover() {
  if (window.__pchCardInitialized) return;
  window.__pchCardInitialized = true;

  // Track button active state for "Adding !" press feedback
  document.addEventListener('mousedown', (e) => {
    const btn = e.target.closest('.pch-card__quick-add[type="submit"], .pch-card__btn[type="submit"]');
    if (!btn || btn.disabled) return;
    const textEl = btn.querySelector('[data-pch-text]');
    if (textEl && !btn.hasAttribute('data-submitting')) {
      btn.dataset.prevText = textEl.textContent;
      textEl.textContent = 'ADDING !';
    }
  });

  document.addEventListener('mouseup', (e) => {
    const btn = e.target.closest('.pch-card__quick-add[type="submit"], .pch-card__btn[type="submit"]');
    if (!btn || btn.hasAttribute('data-submitting')) return;
    const textEl = btn.querySelector('[data-pch-text]');
    if (textEl && btn.dataset.prevText) {
      textEl.textContent = btn.dataset.prevText;
      delete btn.dataset.prevText;
    }
  });

  // Intercept form submissions via event delegation
  document.addEventListener('submit', async (e) => {
    const form = e.target.closest('.pch-card__form');
    if (!form) return;

    e.preventDefault();
    e.stopPropagation();

    const card = form.closest('.pch-card');
    const button = form.querySelector('[data-pch-add-button]');
    const textEl = form.querySelector('[data-pch-text]');
    const statusEl = card ? card.querySelector('[data-pch-status]') : null;

    if (!button || button.disabled) return;

    const variantId = form.querySelector('input[name="id"]')?.value;
    const quantity = form.querySelector('input[name="quantity"]')?.value || '1';

    if (!variantId) {
      console.error('[product-card-hover] Variant ID missing');
      return;
    }

    // Set Loading State
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    button.setAttribute('data-submitting', 'true');
    if (textEl) textEl.textContent = 'ADDING…';
    if (statusEl) statusEl.textContent = 'Adding to cart…';

    try {
      const rootUrl = window.Shopify?.routes?.root || '/';
      const response = await fetch(`${rootUrl}cart/add.js`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          id: variantId,
          quantity: parseInt(quantity, 10),
          sections: 'cart-drawer-section'
        })
      });

      const data = await response.json();

      if (!response.ok || data.status) {
        throw new Error(data.description || data.message || 'Could not add to cart');
      }

      // Success State
      button.classList.add('is-success');
      if (textEl) textEl.textContent = 'ADDED ✓';
      if (statusEl) statusEl.textContent = 'Item added to cart';

      // 1. Update Cart Drawer Section Markup
      if (data.sections && data.sections['cart-drawer-section']) {
        const drawerSection = document.getElementById('shopify-section-cart-drawer-section');
        if (drawerSection) {
          drawerSection.innerHTML = data.sections['cart-drawer-section'];
        }
      }

      // 2. Fetch updated cart count & refresh icon / drawer
      try {
        const cartRes = await fetch(`${rootUrl}cart.js`);
        if (cartRes.ok) {
          const cart = await cartRes.json();
          // Update <cart-icon> component if present
          const cartIcon = document.querySelector('cart-icon');
          if (cartIcon && typeof cartIcon.renderCartBubble === 'function') {
            cartIcon.renderCartBubble(cart.item_count);
          } else {
            // Fallback manual count update
            const bubbles = document.querySelectorAll('.cart-bubble__count, [data-cart-count]');
            bubbles.forEach((b) => (b.textContent = cart.item_count));
          }

          // Dispatch standard event for any theme listeners
          const event = new CustomEvent('shopify:cart:lines-update', {
            bubbles: true,
            cancelable: true,
            detail: {
              cart,
              action: 'add',
              itemCount: cart.item_count
            }
          });
          event.action = 'add';
          document.dispatchEvent(event);
        }
      } catch (err) {
        console.warn('[product-card-hover] Cart refresh note:', err);
      }

      // 3. Open Cart Drawer
      const themeDrawer = document.getElementById('cart-drawer');
      if (themeDrawer && typeof themeDrawer.open === 'function') {
        themeDrawer.open();
      }

      // Reset button after 1.5s
      setTimeout(() => {
        button.classList.remove('is-success');
        button.disabled = false;
        button.removeAttribute('aria-busy');
        button.removeAttribute('data-submitting');
        if (textEl) textEl.textContent = 'QUICK ADD';
        delete button.dataset.prevText;
      }, 1500);

    } catch (error) {
      console.error('[product-card-hover] Add to cart error:', error);
      button.classList.add('is-error');
      if (textEl) textEl.textContent = 'ERROR';
      if (statusEl) statusEl.textContent = error.message || 'Error adding to cart';

      setTimeout(() => {
        button.classList.remove('is-error');
        button.disabled = false;
        button.removeAttribute('aria-busy');
        button.removeAttribute('data-submitting');
        if (textEl) textEl.textContent = 'QUICK ADD';
        delete button.dataset.prevText;
      }, 2000);
    }
  });
})();
