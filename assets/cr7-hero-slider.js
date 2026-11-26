/**
 * CR7 Editorial Hero Slider Controller
 * Smooth crossfade + numbered pagination (01, 02, 03), keyboard, swipe & auto-play.
 */
(function () {
  function initHeroSlider(sectionEl) {
    if (!sectionEl || sectionEl.__cr7SliderInit) return;
    sectionEl.__cr7SliderInit = true;

    const slides = Array.from(sectionEl.querySelectorAll('[data-cr7-slide]'));
    const dots = Array.from(sectionEl.querySelectorAll('[data-cr7-dot]'));
    if (slides.length <= 1) return;

    const autoplayMs = Number(sectionEl.getAttribute('data-autoplay-ms')) || 5500;
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ac = new AbortController();
    const { signal } = ac;

    let current = 0;
    let timer = null;
    let touchStartX = 0;

    function goTo(index) {
      const nextIdx = (index + slides.length) % slides.length;
      if (nextIdx === current) return;

      slides[current].classList.remove('is-active');
      slides[current].setAttribute('aria-hidden', 'true');
      dots[current]?.setAttribute('aria-selected', 'false');

      current = nextIdx;

      slides[current].classList.add('is-active');
      slides[current].setAttribute('aria-hidden', 'false');
      dots[current]?.setAttribute('aria-selected', 'true');
    }

    function startAutoplay() {
      if (reducedMotion || autoplayMs <= 0) return;
      stopAutoplay();
      timer = setInterval(() => goTo(current + 1), autoplayMs);
    }

    function stopAutoplay() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener(
        'click',
        () => {
          goTo(idx);
          startAutoplay();
        },
        { signal }
      );
    });

    sectionEl.addEventListener('mouseenter', stopAutoplay, { signal });
    sectionEl.addEventListener('mouseleave', startAutoplay, { signal });
    sectionEl.addEventListener('focusin', stopAutoplay, { signal });
    sectionEl.addEventListener('focusout', startAutoplay, { signal });

    sectionEl.addEventListener(
      'keydown',
      (e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          goTo(current + 1);
          startAutoplay();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          goTo(current - 1);
          startAutoplay();
        }
      },
      { signal }
    );

    sectionEl.addEventListener(
      'touchstart',
      (e) => {
        touchStartX = e.changedTouches[0]?.clientX || 0;
      },
      { passive: true, signal }
    );

    sectionEl.addEventListener(
      'touchend',
      (e) => {
        const dx = (e.changedTouches[0]?.clientX || 0) - touchStartX;
        if (Math.abs(dx) > 40) {
          goTo(dx < 0 ? current + 1 : current - 1);
          startAutoplay();
        }
      },
      { passive: true, signal }
    );

    startAutoplay();

    sectionEl.__cr7SliderCleanup = () => {
      stopAutoplay();
      ac.abort();
      sectionEl.__cr7SliderInit = false;
    };
  }

  function initAll() {
    document.querySelectorAll('[data-cr7-hero-slider]').forEach(initHeroSlider);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  document.addEventListener('shopify:section:load', initAll);

  document.addEventListener('shopify:section:load', (e) => {
    const target = e.target.matches('[data-cr7-hero-slider]')
      ? e.target
      : e.target.querySelector('[data-cr7-hero-slider]');
    if (target) initHeroSlider(target);
  });

  document.addEventListener('shopify:section:unload', (e) => {
    const target = e.target.matches('[data-cr7-hero-slider]')
      ? e.target
      : e.target.querySelector('[data-cr7-hero-slider]');
    if (target && typeof target.__cr7SliderCleanup === 'function') {
      target.__cr7SliderCleanup();
    }
  });
})();

