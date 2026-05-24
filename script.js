// ── SEAMLESS MARQUEE ──
(function () {
  const track = document.getElementById('marquee-track');
  if (!track) return;
  track.innerHTML += track.innerHTML;
  let x = 0;
  const speed = 0.4;
  function tick() {
    x -= speed;
    if (Math.abs(x) >= track.scrollWidth / 2) x = 0;
    track.style.transform = `translateX(${x}px)`;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();


// ── DEVICE DETECTION ──
// matchMedia checks if the device has a real hover (mouse) or is touch-only
const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;


// ── CUSTOM CURSOR (desktop only) ──
if (!isTouch) {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');

  let mx = 0, my = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function animateFollower() {
    follower.style.left = mx + 'px';
    follower.style.top  = my + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.querySelectorAll('a, button, .skill-card, .project-card, .nav-ham').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform  = 'translate(-50%,-50%) scale(2.5)';
      cursor.style.background = 'var(--rose)';
      follower.style.opacity  = '0.15';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform  = 'translate(-50%,-50%) scale(1)';
      cursor.style.background = 'var(--saffron)';
      follower.style.opacity  = '0.5';
    });
  });
}


// ── YAMUNA TOUCH RIPPLE (mobile/touch only) ──
// Three concentric rings expand from every tap — like a stone on still water
if (isTouch) {
  // Ring configs: class, size, duration, start-opacity, delay
  const rings = [
    { cls: 'r1', size: 80,  dur: 700,  opacity: 0.7, delay: 0   },
    { cls: 'r2', size: 130, dur: 900,  opacity: 0.45, delay: 80  },
    { cls: 'r3', size: 180, dur: 1100, opacity: 0.25, delay: 160 },
  ];

  function spawnRipple(x, y) {
    rings.forEach(({ cls, size, dur, opacity, delay }) => {
      setTimeout(() => {
        const el = document.createElement('div');
        el.className = `yamuna-ripple ${cls}`;
        el.style.cssText = `
          left: ${x}px;
          top:  ${y}px;
          width:  ${size}px;
          height: ${size}px;
          --duration: ${dur}ms;
          --start-opacity: ${opacity};
        `;
        document.body.appendChild(el);
        // remove after animation ends
        setTimeout(() => el.remove(), dur + 50);
      }, delay);
    });
  }

  document.addEventListener('touchstart', (e) => {
    // handle multi-touch — ripple on each finger
    Array.from(e.touches).forEach(touch => {
      spawnRipple(touch.clientX, touch.clientY);
    });
  }, { passive: true });
}


// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});


// ── MOBILE HAMBURGER ──
// Uses CSS class .menu-open instead of inline styles
// so dark mode and transitions work correctly
const ham       = document.getElementById('ham');
const navUl     = document.querySelector('nav ul');
const menuClose = document.getElementById('menu-close');
let menuOpen    = false;

function openMenu() {
  menuOpen = true;
  navUl.classList.add('menu-open');
  menuClose.classList.add('visible');
  document.body.style.overflow = 'hidden'; // prevent background scroll
  ham.children[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
  ham.children[1].style.opacity   = '0';
  ham.children[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
}

function closeMenu() {
  menuOpen = false;
  navUl.classList.remove('menu-open');
  menuClose.classList.remove('visible');
  document.body.style.overflow = '';
  ham.children[0].style.transform = '';
  ham.children[1].style.opacity   = '';
  ham.children[2].style.transform = '';
}

ham.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
menuClose.addEventListener('click', closeMenu);

// Close on any nav link click
navUl.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', closeMenu);
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menuOpen) closeMenu();
});


// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));


// ── SKILL BARS ──
// Animate widths when skills section enters view
const skillSection = document.getElementById('skills');

const skillObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    document.querySelectorAll('.skill-fill').forEach(bar => {
      const w = bar.getAttribute('data-w');
      setTimeout(() => { bar.style.width = w + '%'; }, 300);
    });
    skillObserver.unobserve(skillSection);
  }
}, { threshold: 0.3 });

skillObserver.observe(skillSection);


// ── CONTACT FORM ──
const form = document.getElementById('contact-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const btn = form.querySelector('.form-submit');
  const original = btn.innerHTML;

  btn.innerHTML = 'Sending ✦';
  btn.style.background = 'var(--saffron)';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = 'Sent with love ✦';
    form.reset();
    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  }, 1200);
});


// ── SMOOTH PARALLAX on hero mandala ──
const mandala = document.querySelector('.hero-mandala');

window.addEventListener('scroll', () => {
  if (!mandala) return;
  const scrollY = window.scrollY;
  mandala.style.transform = `translateY(calc(-50% + ${scrollY * 0.12}px))`;
});


// ── ACTIVE NAV LINK highlight on scroll ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav ul a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 200) {
      current = sec.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}`
      ? 'var(--saffron)'
      : '';
  });
});

// ── DARK MODE TOGGLE ──
const themeToggle = document.getElementById('theme-toggle');
const themeIcon   = themeToggle.querySelector('.theme-icon');

// Read saved preference on load
const saved = localStorage.getItem('vr-theme');
if (saved === 'dark') {
  document.body.classList.add('dark');
  themeIcon.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');

  // Swap icon — diya for light, moon/stars for dark
  themeIcon.textContent = isDark ? '☀️' : '🪔';

  // Save preference
  localStorage.setItem('vr-theme', isDark ? 'dark' : 'light');
});


// ════════════════════════════════════════
// ✦ FEATURE 1 — DIYA CURSOR TRAIL
// Mix of embers 🔥, sparks ✦, petals 🌸
// ════════════════════════════════════════
(function () {
  const canvas = document.getElementById('trail-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const particles = [];
  const SYMBOLS = ['✦', '✿', '·', '°', '⋆', '❀'];
  const COLORS  = ['#e8853a', '#f5a623', '#c4566a', '#f0c080', '#d4836a', '#fff0d0'];

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // spawn 2–3 particles per move
    for (let i = 0; i < 2; i++) spawnParticle(mouseX, mouseY);
  });

  function spawnParticle(x, y) {
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 2,
      vy: -Math.random() * 2.5 - 0.5,
      alpha: 1,
      size: Math.random() * 11 + 7,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      decay: Math.random() * 0.025 + 0.018,
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.12,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04; // gentle gravity
      p.alpha -= p.decay;
      p.rotation += p.spin;
      if (p.alpha <= 0) { particles.splice(i, 1); continue; }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.font = `${p.size}px serif`;
      ctx.fillStyle = p.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.symbol, 0, 0);
      ctx.restore();
    }
    requestAnimationFrame(draw);
  }
  draw();
})();


// ════════════════════════════════════════
// ✦ FEATURE 2 — PETAL SCATTER ON CLICK
// ════════════════════════════════════════
(function () {
  const PETALS  = ['🌸', '🌼', '✿', '✦', '❀', '🌺'];
  const COUNTS  = 10; // petals per click

  // Only trigger on buttons and CTAs, not every click
  document.querySelectorAll('.btn-primary, .btn-ghost, .btn-outline, button').forEach(btn => {
    btn.addEventListener('click', e => {
      const rect = btn.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      burstPetals(cx, cy);
    });
  });

  // Also trigger on general clicks anywhere
  document.addEventListener('click', e => {
    // don't double-fire on buttons
    if (e.target.closest('button, a')) return;
    burstPetals(e.clientX, e.clientY);
  });

  function burstPetals(cx, cy) {
    for (let i = 0; i < COUNTS; i++) {
      const el    = document.createElement('span');
      const angle = (Math.random() * 360);
      const dist  = Math.random() * 120 + 40;
      const tx    = Math.cos(angle * Math.PI / 180) * dist;
      const ty    = Math.sin(angle * Math.PI / 180) * dist - 60;
      const rot   = (Math.random() - 0.5) * 540 + 'deg';
      const delay = Math.random() * 0.15;

      el.className = 'click-petal';
      el.textContent = PETALS[Math.floor(Math.random() * PETALS.length)];
      el.style.cssText = `
        left: ${cx}px;
        top:  ${cy}px;
        --tx: ${tx}px;
        --ty: ${ty}px;
        --rot: ${rot};
        font-size: ${Math.random() * 0.8 + 0.7}rem;
        animation-delay: ${delay}s;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1200 + delay * 1000);
    }
  }
})();


// ════════════════════════════════════════
// ✦ FEATURE 3 — DARSHAN PROJECT REVEAL
// Blurred veil lifts as project scrolls in
// ════════════════════════════════════════
(function () {
  const darshans = document.querySelectorAll('.darshan');
  if (!darshans.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // slight delay for dramatic effect
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, 250);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  darshans.forEach(el => obs.observe(el));
})();


// ════════════════════════════════════════
// ✦ FEATURE 4 — SANSKRIT SHLOKA REVEAL
// Fades in as you scroll to each divider
// ════════════════════════════════════════
(function () {
  const shlokas = document.querySelectorAll('.shloka-divider');
  if (!shlokas.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  shlokas.forEach(el => obs.observe(el));
})();
