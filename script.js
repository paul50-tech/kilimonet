const revealItems = document.querySelectorAll('.reveal');
const navToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const header = document.querySelector('.site-header');

document.documentElement.classList.add('js');

if (header) {
  const updateHeaderState = () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', updateHeaderState, { passive: true });
  updateHeaderState();
}

if ('IntersectionObserver' in window && revealItems.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 80}ms`;
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => {
    item.classList.add('visible');
  });
}

if (navToggle && nav) {
  const closeNav = () => {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.textContent = '☰';
  };

  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    const expanded = nav.classList.contains('open');
    navToggle.setAttribute('aria-expanded', expanded.toString());
    navToggle.textContent = expanded ? '✕' : '☰';
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      closeNav();
    });
  });

  document.addEventListener('click', (event) => {
    if (!nav.classList.contains('open')) {
      return;
    }

    const target = event.target;
    if (target instanceof Node && !nav.contains(target) && !navToggle.contains(target)) {
      closeNav();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      closeNav();
      navToggle.focus();
    }
  });
}
