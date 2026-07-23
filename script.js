/* ============================================================
   PAPER-CUTOUT PORTFOLIO — JAVASCRIPT
   ============================================================ */

/* ── Role Rotator ──────────────────────────────────────────── */
const roles = [
  'AI Engineer 🤖',
  'ML Engineer ⚙️',
  'Data Scientist 🔬',
  'Data Analyst 📊',
  'Python Backend Engineer 🚀',
];
let currentRole = 0;
const roleText = document.getElementById('role-text');

function rotateRole() {
  // Slide out
  roleText.style.opacity = '0';
  roleText.style.transform = 'translateY(-20px)';

  setTimeout(() => {
    currentRole = (currentRole + 1) % roles.length;
    roleText.textContent = roles[currentRole];
    roleText.style.transition = 'none';
    roleText.style.opacity = '0';
    roleText.style.transform = 'translateY(20px)';

    requestAnimationFrame(() => {
      roleText.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      roleText.style.opacity = '1';
      roleText.style.transform = 'translateY(0)';
    });
  }, 350);
}

roleText.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
setInterval(rotateRole, 2600);

/* ── Role Switcher ─────────────────────────────────────────── */
const roleMap = {
  ai: { tab: 'tab-ai', panel: 'panel-ai' },
  ds: { tab: 'tab-ds', panel: 'panel-ds' },
  ml: { tab: 'tab-ml', panel: 'panel-ml' },
  da: { tab: 'tab-da', panel: 'panel-da' },
  be: { tab: 'tab-be', panel: 'panel-be' },
};

function switchRole(roleKey) {
  // Remove active from all tabs & panels
  Object.values(roleMap).forEach(({ tab, panel }) => {
    const t = document.getElementById(tab);
    const p = document.getElementById(panel);
    if (t) t.classList.remove('active');
    if (p) p.classList.remove('active');
  });

  // Activate chosen
  const chosen = roleMap[roleKey];
  if (!chosen) return;
  const tab = document.getElementById(chosen.tab);
  const panel = document.getElementById(chosen.panel);
  if (tab) tab.classList.add('active');
  if (panel) {
    panel.classList.add('active');
    // Reset prop animations by removing + re-adding class
    const props = panel.querySelectorAll('.prop-anim-left, .prop-anim-right, .prop-anim-bottom');
    props.forEach(p => {
      const classes = [...p.classList].filter(c => c.startsWith('prop-anim'));
      classes.forEach(c => {
        p.classList.remove(c);
        void p.offsetWidth; // force reflow
        p.classList.add(c);
      });
    });
  }
}

/* Make switchRole globally accessible (onclick in HTML) */
window.switchRole = switchRole;

/* ── Parallax Diorama ──────────────────────────────────────── */
const dioramaLayers = document.querySelectorAll('[data-speed]');
const heroContent = document.getElementById('hero-content');
let ticking = false;

function updateParallax() {
  const scrollY = window.scrollY;
  const heroHeight = document.getElementById('hero').offsetHeight;
  const progress = Math.min(scrollY / heroHeight, 1);

  dioramaLayers.forEach(layer => {
    const speed = parseFloat(layer.dataset.speed) || 0;
    const offset = scrollY * speed;
    layer.style.transform = `translateY(${offset}px)`;
  });

  // Hero content moves up slightly faster (parallax pop-out)
  if (heroContent) {
    heroContent.style.transform = `translateY(${scrollY * -0.15}px)`;
  }

  // Fade scroll hint
  const scrollHint = document.getElementById('scroll-hint');
  if (scrollHint) {
    scrollHint.style.opacity = Math.max(0, 1 - progress * 4);
  }

  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateParallax);
    ticking = true;
  }
}, { passive: true });

/* ── Mouse Parallax on Hero ────────────────────────────────── */
const hero = document.getElementById('hero');
hero.addEventListener('mousemove', (e) => {
  const rect = hero.getBoundingClientRect();
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  const dx = (e.clientX - rect.left - cx) / cx;
  const dy = (e.clientY - rect.top - cy) / cy;

  dioramaLayers.forEach((layer) => {
    const speed = parseFloat(layer.dataset.speed) || 0;
    const mx = dx * speed * 18;
    const my = dy * speed * 10;
    const currentY = window.scrollY * speed;
    layer.style.transform = `translateY(${currentY}px) translate(${mx}px, ${my}px)`;
  });
});

/* ── Scroll Reveal (Intersection Observer) ─────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal, .slide-left, .slide-right').forEach(el => {
  revealObserver.observe(el);
});

/* ── Sticker hover random rotation ────────────────────────── */
document.querySelectorAll('.sticker').forEach(sticker => {
  sticker.addEventListener('mouseenter', () => {
    sticker.style.transform = `rotate(0deg) scale(1.08) translateY(-3px)`;
  });
  sticker.addEventListener('mouseleave', () => {
    const rot = sticker.style.getPropertyValue('--rot') || '0deg';
    sticker.style.transform = `rotate(${rot})`;
  });
});

/* ── Nav active link highlight on scroll ───────────────────── */
const sections = document.querySelectorAll('[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.color = '';
          link.style.setProperty('--active', '0');
        });
        const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (activeLink) {
          activeLink.style.color = 'var(--terra)';
        }
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(section => {
  navObserver.observe(section);
});

/* ── Contact Form ──────────────────────────────────────────── */
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('form-submit-btn');
  btn.textContent = 'Sending… ✨';
  btn.style.background = 'var(--sage)';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = 'Message Sent! 🎉';
    btn.style.background = 'var(--dusty-blue)';
    document.getElementById('contact-form').reset();

    setTimeout(() => {
      btn.textContent = 'Send Message ✉️';
      btn.style.background = 'var(--terra)';
      btn.disabled = false;
    }, 3000);
  }, 1200);
}

window.handleFormSubmit = handleFormSubmit;

/* ── Paper Flutter on project cards ───────────────────────── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translate(-4px,-4px)';
    card.style.boxShadow = '9px 9px 0 var(--brown-deep)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.boxShadow = '';
  });
});

/* ── Character eye blink ───────────────────────────────────── */
function addEyes() {
  const head = document.querySelector('.char-head');
  if (!head) return;

  const eyeL = document.createElement('div');
  const eyeR = document.createElement('div');

  const eyeStyle = `
    position:absolute;
    bottom:22px;
    width:10px;height:10px;
    background:var(--brown-deep);
    border-radius:50%;
    transition:transform 0.1s;
  `;

  eyeL.setAttribute('style', eyeStyle + 'left:14px;');
  eyeR.setAttribute('style', eyeStyle + 'right:14px;');

  eyeL.id = 'eye-l';
  eyeR.id = 'eye-r';

  head.appendChild(eyeL);
  head.appendChild(eyeR);

  function blink() {
    eyeL.style.transform = 'scaleY(0.1)';
    eyeR.style.transform = 'scaleY(0.1)';
    setTimeout(() => {
      eyeL.style.transform = 'scaleY(1)';
      eyeR.style.transform = 'scaleY(1)';
    }, 120);
  }

  // Blink randomly every 3-6 seconds
  function scheduleBlink() {
    const delay = 3000 + Math.random() * 3000;
    setTimeout(() => {
      blink();
      scheduleBlink();
    }, delay);
  }
  scheduleBlink();
}
addEyes();

/* ── Floating particles in hero ────────────────────────────── */
function createParticles() {
  const hero = document.getElementById('hero');
  const colors = ['var(--terra)', 'var(--mustard)', 'var(--sage)', 'var(--dusty-blue)', 'var(--lavender)'];

  for (let i = 0; i < 14; i++) {
    const p = document.createElement('div');
    const size = 6 + Math.random() * 12;
    const x = 5 + Math.random() * 90;
    const delay = Math.random() * 6;
    const duration = 6 + Math.random() * 8;
    const color = colors[Math.floor(Math.random() * colors.length)];

    p.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: ${Math.random() > 0.5 ? '50%' : '3px'};
      left: ${x}%;
      bottom: 10%;
      opacity: 0;
      z-index: 6;
      pointer-events: none;
      animation: particle-float ${duration}s ease-in-out ${delay}s infinite;
      transform: rotate(${Math.random() * 45}deg);
      box-shadow: 1px 2px 4px rgba(0,0,0,0.15);
    `;

    hero.appendChild(p);
  }

  // Add keyframe dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes particle-float {
      0% { opacity: 0; transform: translateY(0) rotate(0deg); }
      10% { opacity: 0.7; }
      90% { opacity: 0.5; }
      100% { opacity: 0; transform: translateY(-120px) rotate(180deg); }
    }
  `;
  document.head.appendChild(style);
}

createParticles();

/* ── Smooth scroll for anchor links ────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── Typewriter effect on nav logo ────────────────────────── */
// Already done via CSS animation — no extra JS needed.

console.log('%c🎨 Paper Cutout Portfolio — Built with ♥ and CSS shapes!', 
  'color: #C4714A; font-size: 14px; font-weight: bold; font-family: monospace;');

/* ── Project Filtering ─────────────────────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all
    filterBtns.forEach(b => b.classList.remove('active'));
    // Add active to clicked
    btn.classList.add('active');
    
    const filterValue = btn.getAttribute('data-filter');
    
    projectCards.forEach(card => {
      const roles = card.getAttribute('data-roles') || '';
      if (filterValue === 'all' || roles.includes(filterValue)) {
        card.style.display = 'block';
        // Reset animation so they animate back in
        card.classList.remove('visible');
        setTimeout(() => {
          card.classList.add('visible');
        }, 10);
      } else {
        card.style.display = 'none';
      }
    });
  });
});
