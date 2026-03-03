const revealItems = document.querySelectorAll('.reveal');
const navToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const serviceGroups = document.querySelectorAll('.service-group');
const year = document.getElementById('year');

if (year) {
  year.textContent = new Date().getFullYear();
}

const updateHeaderState = () => {
  const header = document.querySelector('.site-header');
  if (!header) {
    return;
  }
  header.classList.toggle('scrolled', window.scrollY > 10);
};
window.addEventListener('scroll', updateHeaderState, { passive: true });
updateHeaderState();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${index * 80}ms`;
  observer.observe(item);
});

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

if (serviceGroups.length > 0) {
  const mobileQuery = window.matchMedia('(max-width: 980px)');

  const syncServiceAccordion = () => {
    if (mobileQuery.matches) {
      serviceGroups.forEach((group, index) => {
        group.open = index === 0;
      });
    } else {
      serviceGroups.forEach((group) => {
        group.open = true;
      });
    }
  };

  syncServiceAccordion();
  mobileQuery.addEventListener('change', syncServiceAccordion);

  serviceGroups.forEach((group) => {
    group.addEventListener('toggle', () => {
      if (!mobileQuery.matches || !group.open) {
        return;
      }

      serviceGroups.forEach((otherGroup) => {
        if (otherGroup !== group) {
          otherGroup.open = false;
        }
      });
    });
  });
}
