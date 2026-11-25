/**
 * Collection Photo Accordion Custom Element
 * <collection-photo-accordion>
 */

if (!customElements.get('collection-photo-accordion')) {
  class CollectionPhotoAccordion extends HTMLElement {
    constructor() {
      super();
      this.abortController = null;
      this.panels = [];
      this.links = [];
      this.activeIndex = 0;
    }

    connectedCallback() {
      this.abortController = new AbortController();
      const signal = this.abortController.signal;

      this.openOn = this.getAttribute('data-open-on') || 'hover';
      this.panels = Array.from(this.querySelectorAll('.photo-accordion-panel'));
      this.links = this.panels.map((p) => p.querySelector('.photo-accordion-panel__link'));

      if (this.panels.length === 0) return;

      // Determine initial active index
      const defaultActiveAttr = parseInt(this.getAttribute('data-default-active'), 10);
      const initialIndex = !isNaN(defaultActiveAttr) && defaultActiveAttr >= 1 && defaultActiveAttr <= this.panels.length
        ? defaultActiveAttr - 1
        : 0;

      // Ensure initial active state
      this.activatePanel(initialIndex, false);

      // Bind events
      this.panels.forEach((panel, index) => {
        const link = this.links[index];

        // Hover support for mouse/fine pointers
        panel.addEventListener(
          'pointerenter',
          (e) => {
            if (this.openOn === 'hover' && e.pointerType === 'mouse') {
              this.activatePanel(index);
            }
          },
          { signal }
        );

        // Click / Touch navigation
        if (link) {
          link.addEventListener(
            'click',
            (e) => {
              if (this.activeIndex !== index) {
                // First tap / click on collapsed panel expands it
                e.preventDefault();
                this.activatePanel(index);
              } else {
                // Already active: navigate if valid URL, else prevent jump
                const href = link.getAttribute('href');
                if (!href || href === '#' || href === 'javascript:void(0)') {
                  e.preventDefault();
                }
              }
            },
            { signal }
          );

          // Focus expansion
          link.addEventListener(
            'focus',
            () => {
              this.activatePanel(index);
            },
            { signal }
          );

          // Keyboard arrow navigation
          link.addEventListener(
            'keydown',
            (e) => {
              this.handleKeyDown(e, index);
            },
            { signal }
          );
        }
      });

      // Theme editor integration: shopify:block:select
      document.addEventListener(
        'shopify:block:select',
        (e) => {
          if (!e.detail || !e.detail.blockId) return;
          const targetIndex = this.panels.findIndex(
            (p) => p.getAttribute('data-block-id') === e.detail.blockId
          );
          if (targetIndex !== -1) {
            this.activatePanel(targetIndex);
            if (this.links[targetIndex]) {
              this.links[targetIndex].focus({ preventScroll: true });
            }
          }
        },
        { signal }
      );
    }

    disconnectedCallback() {
      if (this.abortController) {
        this.abortController.abort();
        this.abortController = null;
      }
    }

    /**
     * Activates a panel by index
     * @param {number} index
     * @param {boolean} [shouldFocus=false]
     */
    activatePanel(index, shouldFocus = false) {
      if (index < 0 || index >= this.panels.length) return;
      this.activeIndex = index;

      this.panels.forEach((panel, i) => {
        const isActive = i === index;
        panel.setAttribute('data-active', isActive ? 'true' : 'false');

        const link = this.links[i];
        if (link) {
          link.setAttribute('aria-current', isActive ? 'true' : 'false');
        }
      });

      if (shouldFocus && this.links[index]) {
        this.links[index].focus();
      }
    }

    /**
     * Handles keyboard navigation (Arrow keys, Home, End)
     * @param {KeyboardEvent} e
     * @param {number} currentIndex
     */
    handleKeyDown(e, currentIndex) {
      let nextIndex = null;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          nextIndex = (currentIndex + 1) % this.panels.length;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          nextIndex = (currentIndex - 1 + this.panels.length) % this.panels.length;
          break;
        case 'Home':
          e.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          nextIndex = this.panels.length - 1;
          break;
        default:
          return;
      }

      if (nextIndex !== null) {
        this.activatePanel(nextIndex, true);
      }
    }
  }

  customElements.define('collection-photo-accordion', CollectionPhotoAccordion);
}
