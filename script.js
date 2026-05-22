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
const statusMessage = document.getElementById('formStatus');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  // Update UI to show loading state
  submitBtn.disabled = true;
  submitBtn.textContent = 'Transmitting...';
  statusMessage.textContent = '';

  const formData = new FormData(form);
  const object = Object.fromEntries(formData);
  const json = JSON.stringify(object);

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: json
    });
    
    const result = await response.json();
    
    if (result.success) {
      statusMessage.style.color = '#39FF14'; // Neon green success or match your design
      statusMessage.textContent = 'Message sent successfully! I’ll get back to you soon.';
      form.reset();
    } else {
      statusMessage.style.color = '#ff4a4a';
      statusMessage.textContent = result.message || 'Something went wrong.';
    }
  } catch (error) {
    statusMessage.style.color = '#ff4a4a';
    statusMessage.textContent = 'Network error. Please try again later.';
  } finally {
    // Reset button state
    submitBtn.disabled = false;
    submitBtn.textContent = 'Transmit';
  }
  form.reset();

});
