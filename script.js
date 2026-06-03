(() => {
  const grid       = document.getElementById('galleryGrid');
  const emptyState = document.getElementById('emptyState');
  const lightbox   = document.getElementById('lightbox');
  const lbImg      = document.getElementById('lightboxImg');
  const lbCaption  = document.getElementById('lightboxCaption');
  const lbCounter  = document.getElementById('lightboxCounter');
  const lbClose    = document.getElementById('lightboxClose');
  const lbPrev     = document.getElementById('lightboxPrev');
  const lbNext     = document.getElementById('lightboxNext');

  let current = 0;

  // ── Build gallery ──────────────────────────────────────────────
  if (!PHOTOS || PHOTOS.length === 0) {
    emptyState.classList.add('visible');
  } else {
    PHOTOS.forEach((photo, i) => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.dataset.index = i;

      const img = document.createElement('img');
      img.src = photo.src;
      img.alt = photo.caption || `Wedding photo ${i + 1}`;
      img.loading = 'lazy';

      const overlay = document.createElement('div');
      overlay.className = 'gallery-item-overlay';

      if (photo.caption) {
        const cap = document.createElement('span');
        cap.className = 'gallery-item-caption';
        cap.textContent = photo.caption;
        overlay.appendChild(cap);
      }

      item.appendChild(img);
      item.appendChild(overlay);
      item.addEventListener('click', () => openLightbox(i));
      grid.appendChild(item);
    });

    // Entrance animation via IntersectionObserver
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.gallery-item').forEach(el => observer.observe(el));
  }

  // ── Lightbox ───────────────────────────────────────────────────
  function openLightbox(index) {
    current = index;
    updateLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  function updateLightbox() {
    const photo = PHOTOS[current];
    lbImg.src = photo.src;
    lbImg.alt = photo.caption || '';
    lbCaption.textContent = photo.caption || '';
    lbCounter.textContent = `${current + 1} / ${PHOTOS.length}`;
  }

  function navigate(dir) {
    current = (current + dir + PHOTOS.length) % PHOTOS.length;
    lbImg.style.opacity = '0';
    setTimeout(() => {
      updateLightbox();
      lbImg.style.opacity = '1';
    }, 150);
  }

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => navigate(-1));
  lbNext.addEventListener('click', () => navigate(1));

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   navigate(-1);
    if (e.key === 'ArrowRight')  navigate(1);
  });

  // Touch/swipe support
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) navigate(dx < 0 ? 1 : -1);
  }, { passive: true });
})();
