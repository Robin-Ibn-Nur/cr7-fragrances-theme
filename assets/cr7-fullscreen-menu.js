/**
 * CR7 Luxury Full-Screen Hamburger Menu Controller
 * Vanilla JS, accessible focus management, ESC close, body scroll lock,
 * staggered submenus, and subtle campaign image preview/parallax.
 */
(function () {
  function initFullscreenMenu() {
    const overlay = document.getElementById('cr7-fullscreen-menu');
    const triggers = Array.from(document.querySelectorAll('[data-cr7-menu-trigger]'));
    if (!overlay || !triggers.length || overlay.__cr7MenuInit) return;
    overlay.__cr7MenuInit = true;

    const closeBtn = overlay.querySelector('[data-cr7-menu-close]');
    const panel = overlay.querySelector('[data-cr7-menu-panel]');
    const campaignImg = overlay.querySelector('[data-cr7-campaign-img]');
    const defaultImgSrc = campaignImg ? campaignImg.getAttribute('data-default-src') : '';
    const defaultImgAlt = campaignImg ? campaignImg.getAttribute('data-default-alt') : '';
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let lastTrigger = null;
    let prevBodyOverflow = '';
    let prevHtmlOverflow = '';

    function isOpen() {
      return overlay.classList.contains('is-open');
    }

    function openMenu(triggerEl) {
      if (isOpen()) return;
      lastTrigger = triggerEl || triggers[0];

      prevBodyOverflow = document.body.style.overflow;
      prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      overlay.removeAttribute('inert');
      triggers.forEach((btn) => btn.setAttribute('aria-expanded', 'true'));

      if (closeBtn) {
        requestAnimationFrame(() => closeBtn.focus());
      }
    }

    function closeMenu() {
      if (!isOpen()) return;

      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      overlay.setAttribute('inert', '');
      triggers.forEach((btn) => btn.setAttribute('aria-expanded', 'false'));

      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;

      if (lastTrigger && typeof lastTrigger.focus === 'function') {
        lastTrigger.focus();
      }
    }

    triggers.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (isOpen()) closeMenu();
        else openMenu(btn);
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeMenu();
      });
    }

    // ESC key closes overlay
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) {
        e.preventDefault();
        closeMenu();
      }
    });

    // Submenu accordion / hover-reveal
    const subItems = Array.from(overlay.querySelectorAll('[data-cr7-sub-item]'));
    subItems.forEach((item) => {
      const toggle = item.querySelector('[data-cr7-sub-toggle]');
      if (!toggle) return;

      toggle.addEventListener('click', () => {
        const willOpen = !item.classList.contains('is-sub-open');
        subItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove('is-sub-open');
            other.querySelector('[data-cr7-sub-toggle]')?.setAttribute('aria-expanded', 'false');
          }
        });
        item.classList.toggle('is-sub-open', willOpen);
        toggle.setAttribute('aria-expanded', String(willOpen));
      });
    });

    // Close menu when any navigation link is clicked
    overlay.querySelectorAll('a[href]').forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Dynamic preview image on fragrance hover
    if (campaignImg && defaultImgSrc) {
      overlay.querySelectorAll('[data-cr7-preview-src]').forEach((link) => {
        const previewSrc = link.getAttribute('data-cr7-preview-src');
        const previewAlt = link.getAttribute('data-cr7-preview-alt') || defaultImgAlt;
        if (!previewSrc) return;

        link.addEventListener('mouseenter', () => {
          campaignImg.style.opacity = '0.6';
          setTimeout(() => {
            campaignImg.src = previewSrc;
            campaignImg.alt = previewAlt;
            campaignImg.style.opacity = '1';
          }, 90);
        });

        link.addEventListener('mouseleave', () => {
          campaignImg.style.opacity = '0.6';
          setTimeout(() => {
            campaignImg.src = defaultImgSrc;
            campaignImg.alt = defaultImgAlt;
            campaignImg.style.opacity = '1';
          }, 90);
        });
      });
    }

    // Subtle image parallax on desktop
    if (panel && campaignImg && !reducedMotion && window.matchMedia('(hover: hover)').matches) {
      panel.addEventListener('mousemove', (e) => {
        const rect = panel.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        campaignImg.style.transform = `translate3d(${x * 10}px, ${y * 10}px, 0) scale(1.02)`;
      });

      panel.addEventListener('mouseleave', () => {
        campaignImg.style.transform = '';
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFullscreenMenu);
  } else {
    initFullscreenMenu();
  }

  document.addEventListener('shopify:section:load', initFullscreenMenu);
})();

