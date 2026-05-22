/* Theme toggle */
const themeBtn = document.getElementById('themeToggle');
const saved = localStorage.getItem('theme');
if (saved === 'light') document.body.classList.add('light');
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light');
  themeBtn.textContent = document.body.classList.contains('light') ? '☀️' : '🌙';
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
});
themeBtn.textContent = document.body.classList.contains('light') ? '☀️' : '🌙';

/* Mobile menu */
document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});
document.querySelectorAll('#navLinks a').forEach(a =>
  a.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open'))
);

/* Smooth scroll already via CSS; scroll-to-top */
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  toTop.classList.toggle('show', window.scrollY > 400);
});
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* Typing effect */
(function () {
  const t = document.getElementById('typed');
  if (!t) return;
  const phrases = ['Computer Engineer', 'Full Stack Developer', 'Mobile & AR Builder', 'Problem Solver'];
  let pi = 0, ci = 0, del = false;
  (function tick() {
    const p = phrases[pi];
    t.textContent = p.slice(0, ci);
    if (!del && ci < p.length) { ci++; setTimeout(tick, 70); }
    else if (del && ci > 0) { ci--; setTimeout(tick, 35); }
    else { del = !del; if (!del) pi = (pi + 1) % phrases.length; setTimeout(tick, del ? 1400 : 300); }
  })();
})();

/* Reveal on scroll + counters + skill bars */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    // counters
    e.target.querySelectorAll('[data-count]').forEach(el => {
      const target = +el.dataset.count;
      let n = 0;
      const step = Math.max(1, Math.ceil(target / 30));
      const id = setInterval(() => {
        n += step;
        if (n >= target) { n = target; clearInterval(id); }
        el.textContent = n + (el.dataset.suffix || '');
      }, 30);
    });
    // bars
    e.target.querySelectorAll('.bar i').forEach(b => b.style.width = getComputedStyle(b).getPropertyValue('--w'));
    io.unobserve(e.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* Contact form (frontend-only) */
const form = document.getElementById('contactForm');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const status = document.getElementById('formStatus');
  const data = Object.fromEntries(new FormData(form));
  if (!data.name || !data.email || !data.message) {
    status.textContent = 'Please fill all fields.'; status.style.color = 'salmon'; return;
  }
  status.textContent = '✓ Message ready — opening your email client…';
  status.style.color = '#4ade80';
  window.location.href = `mailto:chaitash.work@gmail.com?subject=Portfolio inquiry from ${encodeURIComponent(data.name)}&body=${encodeURIComponent(data.message + '\n\n— ' + data.name + ' (' + data.email + ')')}`;
  form.reset();

});
