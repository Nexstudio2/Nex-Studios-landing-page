const navbar = document.getElementById('navbar');
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

const setNavState = () => {
  navbar.classList.toggle('scrolled', window.scrollY > 12);
};

window.addEventListener('scroll', () => {
  setNavState();
  document.documentElement.style.setProperty('--scroll', window.scrollY * 0.03 + 'px');
});
setNavState();

menuBtn.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
});

const scrollToAnchor = (hash) => {
  const target = document.querySelector(hash);
  if (!target) return;
  const offset = navbar.offsetHeight + 18;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
};

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;
    event.preventDefault();
    history.pushState(null, '', hash);
    scrollToAnchor(hash);
  });
});

window.addEventListener('load', () => {
  if (window.location.hash) requestAnimationFrame(() => scrollToAnchor(window.location.hash));
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal, .timeline').forEach((el) => revealObserver.observe(el));

document.querySelectorAll('.faq-item button').forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.parentElement;
    document.querySelectorAll('.faq-item').forEach((faq) => {
      if (faq !== item) faq.classList.remove('active');
    });
    item.classList.toggle('active');
  });
});

const statNodes = document.querySelectorAll('.stat-number');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const node = entry.target;
    if (node.dataset.done) return;
    node.dataset.done = 'true';
    const target = Number(node.dataset.target || 0);
    const prefix = node.dataset.prefix || '';
    const suffix = node.dataset.suffix || '';
    const start = performance.now();
    const duration = 950;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = `${prefix}${Math.round(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    statObserver.unobserve(node);
  });
}, { threshold: 0.45 });

statNodes.forEach((node) => statObserver.observe(node));
