// ── THEME ────────────────────────────────────────────────────────────────
const html     = document.documentElement;
const themeBtn = document.getElementById('themeBtn');

function toggleTheme() {
  const isDark = html.getAttribute('data-theme') !== 'light';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeBtn.textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
}
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

// ── PARTÍCULAS FLUTUANTES ─────────────────────────────────────────────────
function criarParticulas() {
  const hero = document.getElementById('hero');
  const total = 18;
  for (let i = 0; i < total; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 12 + 4;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      bottom: -20px;
      animation-duration: ${Math.random() * 8 + 6}s;
      animation-delay: ${Math.random() * 8}s;
    `;
    hero.appendChild(p);
  }
}
criarParticulas();

// ── CONTADOR ANIMADO ──────────────────────────────────────────────────────
function animarContador(el, destino, duracao = 1200) {
  const inicio = performance.now();
  const num = parseInt(destino.replace('+',''));
  const temPlus = destino.includes('+');
  function update(agora) {
    const prog = Math.min((agora - inicio) / duracao, 1);
    const ease = 1 - Math.pow(1 - prog, 3);
    el.textContent = Math.floor(ease * num) + (temPlus && prog === 1 ? '+' : '');
    if (prog < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ── INTERSECTION OBSERVER ─────────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visible');

    // Anima contadores nos facts
    if (e.target.classList.contains('fact')) {
      const numEl = e.target.querySelector('.fact-num');
      if (numEl) animarContador(numEl, numEl.textContent);
    }

    observer.unobserve(e.target);
  });
}, { threshold: 0.15 });

// Section titles — underline animado
document.querySelectorAll('.section-title').forEach(el => observer.observe(el));

// Cards com fade-in escalonado
document.querySelectorAll(
  '.skill-card, .project-card, .tl-item, .contact-card, .fact'
).forEach((el, i) => {
  el.classList.add('fade-in');
  el.style.transitionDelay = `${i * 70}ms`;
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
}, { passive: true });

// ── EFEITO DE DIGITAÇÃO no hero ────────────────────────────────────────────
function typewriter(el, textos, velocidade = 80) {
  let ti = 0, ci = 0, apagando = false;
  function tick() {
    const texto = textos[ti];
    if (!apagando) {
      el.textContent = texto.slice(0, ++ci);
      if (ci === texto.length) { apagando = true; setTimeout(tick, 1800); return; }
    } else {
      el.textContent = texto.slice(0, --ci);
      if (ci === 0) { apagando = false; ti = (ti + 1) % textos.length; }
    }
    setTimeout(tick, apagando ? velocidade / 2 : velocidade);
  }
  tick();
}

// Aguarda carregamento e inicia typewriter no subtítulo
window.addEventListener('load', () => {
  const sub = document.querySelector('.hero-sub');
  if (!sub) return;
  const textosPT = [
    'Desenvolvedor Junior · Salvador, BA',
    'Python · Flask · Docker · MySQL',
    'Construindo soluções reais em obra 🏗️',
  ];
  const textosEN = [
    'Junior Developer · Salvador, BA',
    'Python · Flask · Docker · MySQL',
    'Building real-world solutions 🏗️',
  ];
  typewriter(sub, currentLang === 'pt' ? textosPT : textosEN);
});
