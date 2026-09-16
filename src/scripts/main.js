// ═══ InTake Beverages — Interactions ═══

// Splash screen
const splash = document.getElementById('splash');
const splashDrops = document.getElementById('splash-drops');
if (splash) {
  // Bar fills over 2.2s, then trigger splash drops
  setTimeout(() => {
    if (splashDrops) splashDrops.classList.add('is-splashing');
  }, 2200);
  // Fade out the whole splash after drops animate
  setTimeout(() => {
    splash.classList.add('is-closing');
    setTimeout(() => {
      splash.classList.add('is-hidden');
    }, 800);
  }, 3000);
}

// Scroll animations (IntersectionObserver)
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.fade-in, .fade-in-up').forEach((el) => {
  observer.observe(el);
});

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('is-open');
  });
}

// Sticky header with background on scroll
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('is-scrolled', window.scrollY > 50);
  });
}

// Scroll-to-top button
const scrollBtn = document.getElementById('scroll-top');
if (scrollBtn) {
  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('is-visible', window.scrollY > 400);
  });
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Shop carousel — infinite loop
const shopTrack = document.getElementById('shop-track');
const shopPrev = document.getElementById('shop-prev');
const shopNext = document.getElementById('shop-next');
const shopCarousel = document.getElementById('shop-carousel');
const shopCaptionTrack = document.getElementById('shop-caption-track');
if (shopTrack && shopPrev && shopNext && shopCarousel) {
  const origSlides = Array.from(shopTrack.querySelectorAll('.shop__slide'));
  const total = origSlides.length;

  // Clone all slides and append/prepend for infinite loop
  origSlides.forEach(s => shopTrack.appendChild(s.cloneNode(true)));
  origSlides.forEach((s, i) => shopTrack.insertBefore(origSlides[total - 1 - i].cloneNode(true), shopTrack.firstChild));

  // Caption names for syncing
  const captionNames = shopCaptionTrack
    ? Array.from(shopCaptionTrack.querySelectorAll('.shop-caption__slide')).map(s => s.textContent)
    : [];

  // Current index in the extended track (offset by `total` clones prepended)
  let current = total;
  const slideWidth = () => shopCarousel.offsetWidth;

  function setPosition(animate) {
    shopTrack.style.transition = animate ? 'transform 0.5s ease' : 'none';
    shopTrack.style.transform = `translateX(-${current * slideWidth()}px)`;
    if (shopCaptionTrack) {
      const realIndex = ((current - total) % total + total) % total;
      shopCaptionTrack.style.transition = animate ? 'transform 0.5s ease' : 'none';
      shopCaptionTrack.style.transform = `translateX(-${realIndex * 100}%)`;
    }
  }

  // Jump without animation when hitting clones
  function checkBounds() {
    if (current >= total * 2) {
      current = total;
      setPosition(false);
    } else if (current < total) {
      current = total * 2 - (total - current);
      setPosition(false);
    }
  }

  shopTrack.addEventListener('transitionend', checkBounds);

  // Initialize position
  setPosition(false);

  function goNext() { current++; setPosition(true); }
  function goPrev() { current--; setPosition(true); }

  shopPrev.addEventListener('click', goPrev);
  shopNext.addEventListener('click', goNext);

  // Autoplay every 5s, pause on hover/interaction
  let autoplay = setInterval(goNext, 5000);
  function pauseAutoplay() { clearInterval(autoplay); }
  function resumeAutoplay() {
    clearInterval(autoplay);
    autoplay = setInterval(goNext, 5000);
  }
  shopCarousel.addEventListener('mouseenter', pauseAutoplay);
  shopCarousel.addEventListener('mouseleave', resumeAutoplay);

  // Drag / swipe support
  let isDragging = false;
  let startX = 0;
  let dragDelta = 0;

  function onDragStart(x) {
    isDragging = true;
    startX = x;
    dragDelta = 0;
    shopTrack.style.transition = 'none';
    pauseAutoplay();
  }
  function onDragMove(x) {
    if (!isDragging) return;
    dragDelta = x - startX;
    const base = -current * slideWidth();
    shopTrack.style.transform = `translateX(${base + dragDelta}px)`;
  }
  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    if (dragDelta < -50) goNext();
    else if (dragDelta > 50) goPrev();
    else setPosition(true);
    resumeAutoplay();
  }

  // Mouse events
  shopCarousel.addEventListener('mousedown', (e) => { e.preventDefault(); onDragStart(e.clientX); });
  window.addEventListener('mousemove', (e) => onDragMove(e.clientX));
  window.addEventListener('mouseup', onDragEnd);

  // Touch events
  shopCarousel.addEventListener('touchstart', (e) => onDragStart(e.touches[0].clientX), { passive: true });
  shopCarousel.addEventListener('touchmove', (e) => onDragMove(e.touches[0].clientX), { passive: true });
  shopCarousel.addEventListener('touchend', onDragEnd);
}

// Dynamic footer year
const yearEl = document.getElementById('footer-year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
