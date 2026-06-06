/* ===== Prestige Meble Toruń — Shared Scripts ===== */

document.addEventListener('DOMContentLoaded', function () {
  initMobileMenu();
  setActiveNavLink();
  initFadeIn();
  initCookieConsent();
  initFAQ();
});

/* ----- Mobile hamburger menu ----- */
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu   = document.getElementById('mobile-menu');
  const iconOpen  = document.getElementById('icon-hamburger');
  const iconClose = document.getElementById('icon-close');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', function () {
    const open = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden');
    if (iconOpen)  iconOpen.classList.toggle('hidden',  !open);
    if (iconClose) iconClose.classList.toggle('hidden', open);
  });

  // Close on any link click inside mobile menu
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.add('hidden');
      if (iconOpen)  iconOpen.classList.remove('hidden');
      if (iconClose) iconClose.classList.add('hidden');
    });
  });
}

/* ----- Active nav link (compare filename) ----- */
function setActiveNavLink() {
  var page = window.location.pathname.split('/').pop() || 'index.html';
  if (page === '') page = 'index.html';

  document.querySelectorAll('.nav-link[data-page]').forEach(function (link) {
    if (link.dataset.page === page) {
      link.classList.add('active');
    }
  });
}

/* ----- FadeIn via IntersectionObserver ----- */
function initFadeIn() {
  var elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(function (el) { observer.observe(el); });
}

/* ----- Cookie consent banner ----- */
function initCookieConsent() {
  var banner  = document.getElementById('cookie-banner');
  var acceptBtn = document.getElementById('accept-cookies');
  if (!banner) return;

  if (localStorage.getItem('prestige-cookie') === '1') {
    banner.style.display = 'none';
    return;
  }

  banner.classList.add('visible');

  if (acceptBtn) {
    acceptBtn.addEventListener('click', function () {
      localStorage.setItem('prestige-cookie', '1');
      banner.classList.remove('visible');
    });
  }
}

/* ----- FAQ accordion ----- */
function initFAQ() {
  document.querySelectorAll('.faq-toggle').forEach(function (btn, idx) {
    btn.addEventListener('click', function () {
      var answer = document.getElementById('faq-a-' + idx);
      var icon   = btn.querySelector('.faq-icon');
      var isOpen = answer && !answer.classList.contains('hidden') && answer.style.display !== 'none';

      // close all
      document.querySelectorAll('.faq-answer').forEach(function (a) { a.style.display = 'none'; });
      document.querySelectorAll('.faq-icon').forEach(function (i) { i.classList.remove('open'); });

      if (!isOpen && answer) {
        answer.style.display = 'block';
        if (icon) icon.classList.add('open');
      }
    });
  });
}

/* ----- Lightbox (used on kolekcje.html) ----- */
function openLightbox(src) {
  var lb  = document.getElementById('lightbox');
  var img = document.getElementById('lightbox-img');
  if (!lb || !img) return;
  img.src = src;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  var lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.classList.remove('active');
  document.body.style.overflow = '';
}

// Attach lightbox close listeners once DOM ready
document.addEventListener('DOMContentLoaded', function () {
  var lb    = document.getElementById('lightbox');
  var close = document.getElementById('lightbox-close');
  if (lb) {
    lb.addEventListener('click', function (e) {
      if (e.target === lb) closeLightbox();
    });
  }
  if (close) {
    close.addEventListener('click', closeLightbox);
  }
  // ESC key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });
});
