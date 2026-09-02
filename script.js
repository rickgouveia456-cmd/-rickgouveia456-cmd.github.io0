// ── THEME ────────────────────────────────────────────────────────────────
const html     = document.documentElement;
const themeBtn = document.getElementById('themeBtn');

function toggleTheme() {
  const isDark = html.getAttribute('data-theme') !== 'light';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeBtn.textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

// Restaura tema salvo
const saved = localStorage.getItem('theme');
if (saved === 'light') {
  html.setAttribute('data-theme', 'light');
  themeBtn.textContent = '🌙';
}

// ── LANGUAGE ──────────────────────────────────────────────────────────────
let currentLang = 'pt';
const langBtn   = document.getElementById('langBtn');

function toggleLang() {
  currentLang = currentLang === 'pt' ? 'en' : 'pt';
  langBtn.textContent = currentLang === 'pt' ? 'EN' : 'PT';
  html.setAttribute('lang', currentLang === 'pt' ? 'pt-BR' : 'en');
  applyLang();
}

function applyLang() {
  document.querySelectorAll(`[data-${currentLang}]`).forEach(el => {
    const text = el.getAttribute(`data-${currentLang}`);
    if (text) el.textContent = text;
  });
}

// ── NAVBAR scroll ─────────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 20
    ? '0 2px 20px rgba(0,0,0,.3)' : 'none';
});

// ── FADE IN observer ──────────────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

// Adiciona fade-in em cards e seções
document.querySelectorAll(
  '.skill-card, .project-card, .tl-item, .contact-card, .about-facts .fact'
).forEach((el, i) => {
  el.classList.add('fade-in');
  el.style.transitionDelay = `${i * 60}ms`;
  observer.observe(el);
});

// ── ACTIVE NAV link ───────────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 80) current = sec.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}`
      ? 'var(--accent)' : '';
  });
});
