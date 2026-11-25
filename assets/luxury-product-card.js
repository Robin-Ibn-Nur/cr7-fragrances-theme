/**
 * Luxury Product Card Component Interactions
 * Handles Wishlist persistence and synchronization.
 */

(function () {
  'use strict';

  const WISHLIST_STORAGE_KEY = 'cr7_luxury_wishlist';

  /**
   * Reads wishlist handles from localStorage
   * @returns {string[]}
   */
  function getWishlist() {
    try {
      const data = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Saves wishlist handles to localStorage
   * @param {string[]} list
   */
  function saveWishlist(list) {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('[Wishlist] Storage error:', e);
    }
  }

  /**
   * Updates visual state of all wishlist buttons and header wishlist counter badges
   */
  function syncWishlistState() {
    const list = getWishlist();
    const count = list.length;

    const buttons = document.querySelectorAll('[data-wishlist-toggle]');
    buttons.forEach((btn) => {
      const handle = btn.getAttribute('data-product-handle');
      const isSaved = handle && list.includes(handle);
      btn.classList.toggle('is-active', Boolean(isSaved));
      btn.setAttribute('aria-pressed', isSaved ? 'true' : 'false');
    });

    const headerBadges = document.querySelectorAll('[data-wishlist-header-count]');
    headerBadges.forEach((badge) => {
      badge.textContent = count;
      if (count > 0) {
        badge.removeAttribute('hidden');
        badge.style.display = 'inline-flex';
      } else {
        badge.setAttribute('hidden', '');
        badge.style.display = 'none';
      }
    });
  }

  /**
   * Handles clicking a wishlist button
   * @param {MouseEvent} event
   */
  function handleWishlistClick(event) {
    const btn = event.target.closest('[data-wishlist-toggle]');
    if (!btn) return;

    event.preventDefault();
    event.stopPropagation();

    const handle = btn.getAttribute('data-product-handle');
    if (!handle) return;

    let list = getWishlist();
    if (list.includes(handle)) {
      list = list.filter((item) => item !== handle);
    } else {
      list.push(handle);
    }

    saveWishlist(list);
    syncWishlistState();
  }

  // Bind delegated events to document
  document.addEventListener('click', handleWishlistClick, true);

  // Initial sync on page load and bfcache restore
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncWishlistState);
  } else {
    syncWishlistState();
  }
  window.addEventListener('pageshow', syncWishlistState);
})();
