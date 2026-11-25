/**
 * Footer (Animated) - Viewport & Visibility Performance Controller
 * Uses IntersectionObserver to pause animations when the footer is off-screen,
 * and page visibility listener to pause animations when the browser tab is hidden.
 */

class FooterAnimated {
  constructor(element) {
    this.element = element;
    this.isIntersecting = false;
    this.observer = null;
    this.handleVisibility = this.handleVisibility.bind(this);

    this.init();
  }

  init() {
    if (!this.element) return;

    // Check prefers-reduced-motion early
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      this.element.setAttribute('data-in-view', 'false');
      return;
    }

    // Set initial state
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            this.isIntersecting = entry.isIntersecting;
            this.updateState();
          });
        },
        {
          rootMargin: '100px 0px 100px 0px',
          threshold: [0, 0.05],
        }
      );
      this.observer.observe(this.element);
    } else {
      // Fallback: assume in view if IntersectionObserver not supported
      this.isIntersecting = true;
      this.updateState();
    }

    document.addEventListener('visibilitychange', this.handleVisibility);
  }

  handleVisibility() {
    this.updateState();
  }

  updateState() {
    const isVisibleTab = document.visibilityState === 'visible';
    const shouldAnimate = this.isIntersecting && isVisibleTab;
    this.element.setAttribute('data-in-view', shouldAnimate ? 'true' : 'false');
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    document.removeEventListener('visibilitychange', this.handleVisibility);
  }
}

// Auto-initialize on DOM ready or dynamically when section renders
const initFooters = () => {
  const footers = document.querySelectorAll('[data-footer-animated]');
  footers.forEach((footer) => {
    if (!footer._footerAnimatedInstance) {
      footer._footerAnimatedInstance = new FooterAnimated(footer);
    }
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFooters);
} else {
  initFooters();
}

// Shopify theme editor support
document.addEventListener('shopify:section:load', (e) => {
  const footer = e.target.querySelector('[data-footer-animated]') || (e.target.matches('[data-footer-animated]') ? e.target : null);
  if (footer && !footer._footerAnimatedInstance) {
    footer._footerAnimatedInstance = new FooterAnimated(footer);
  }
});

document.addEventListener('shopify:section:unload', (e) => {
  const footer = e.target.querySelector('[data-footer-animated]') || (e.target.matches('[data-footer-animated]') ? e.target : null);
  if (footer && footer._footerAnimatedInstance) {
    footer._footerAnimatedInstance.destroy();
    delete footer._footerAnimatedInstance;
  }
});

export default FooterAnimated;
