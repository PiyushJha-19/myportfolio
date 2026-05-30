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
}, { passive: true });


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
}, { passive: true });


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

// ── DARK MODE TOGGLE (pill slider) ──
const themeToggle = document.getElementById('theme-toggle');

// Restore saved preference on load — no icon swap needed,
// CSS handles everything via body.dark class
const saved = localStorage.getItem('vr-theme');
if (saved === 'dark') {
  document.body.classList.add('dark');
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('vr-theme', isDark ? 'dark' : 'light');
}

themeToggle.addEventListener('click', toggleTheme);

// Also allow keyboard Enter/Space since it's a div not a button
themeToggle.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggleTheme();
  }
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



// ════════════════════════════════════════
// ✦ MUSIC BUTTON
// ════════════════════════════════════════
(function () {
  const musicBtn = document.getElementById('music-btn');
  const audio    = document.getElementById('bg-music');
  if (!musicBtn || !audio) return;

  // Volume fade helper
  function fadeVol(target, ms, cb) {
    const start = audio.volume;
    const steps = 40;
    const dt    = (target - start) / steps;
    let   n     = 0;
    const id = setInterval(() => {
      n++;
      audio.volume = Math.min(1, Math.max(0, start + dt * n));
      if (n >= steps) { clearInterval(id); if (cb) cb(); }
    }, ms / steps);
  }

  // Start muted — user must tap to play (browser rule)
  let playing = false;
  musicBtn.classList.add('muted');

  musicBtn.addEventListener('click', () => {
    if (!playing) {
      audio.volume = 0;
      audio.play().then(() => fadeVol(0.35, 1200)).catch(() => {});
      musicBtn.classList.remove('muted');
    } else {
      fadeVol(0, 600, () => audio.pause());
      musicBtn.classList.add('muted');
    }
    playing = !playing;
  });

  // Politely drop volume when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (!playing) return;
    fadeVol(document.hidden ? 0.08 : 0.35, 500);
  });
})();


// ════════════════════════════════════════
// ✦ PAGE LOAD BAR
// ════════════════════════════════════════
(function () {
  const bar = document.getElementById('load-bar');
  if (!bar) return;
  let w = 0;
  // Fake progress — ramps to 90% quickly then waits for load
  const iv = setInterval(() => {
    w += Math.random() * 18;
    if (w > 90) { w = 90; clearInterval(iv); }
    bar.style.width = w + '%';
  }, 120);

  window.addEventListener('load', () => {
    clearInterval(iv);
    bar.style.width = '100%';
    setTimeout(() => { bar.style.opacity = '0'; }, 400);
    setTimeout(() => { bar.remove(); }, 900);
  });
})();


// ════════════════════════════════════════
// ✦ BACK TO TOP
// ════════════════════════════════════════
(function () {
  const btn = document.getElementById('back-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


// ════════════════════════════════════════
// ✦ TYPED TEXT IN HERO
// Cycles: devotional → peaceful → minimal → sacred
// ════════════════════════════════════════
(function () {
  const el    = document.getElementById('typed-word');
  if (!el) return;
  const words = ['devotional,', 'peaceful,', 'minimal,', 'sacred,', 'purposeful,'];
  let   wi    = 0;
  let   ci    = words[0].length; // start fully typed
  let   deleting = false;
  let   pausing  = false;

  function tick() {
    const word = words[wi];
    if (pausing) { pausing = false; setTimeout(tick, 1400); return; }

    if (!deleting) {
      el.textContent = word.slice(0, ci);
      ci++;
      if (ci > word.length) { deleting = true; pausing = true; }
      setTimeout(tick, deleting ? 60 : 95);
    } else {
      el.textContent = word.slice(0, ci);
      ci--;
      if (ci < 0) {
        deleting = false;
        wi = (wi + 1) % words.length;
        ci = 0;
        pausing = true;
      }
      setTimeout(tick, 55);
    }
  }
  // Start cycling after 3s so user reads it first
  setTimeout(tick, 3000);
})();


// ════════════════════════════════════════
// ✦ SKILL % LABELS — show after bars animate
// ════════════════════════════════════════
(function () {
  const skillSection = document.getElementById('skills');
  if (!skillSection) return;
  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      // existing skill bar animation runs at 300ms
      setTimeout(() => {
        document.querySelectorAll('.skill-pct').forEach(el => el.classList.add('show'));
      }, 900);
      obs.unobserve(skillSection);
    }
  }, { threshold: 0.3 });
  obs.observe(skillSection);
})();


// ════════════════════════════════════════
// ✦ FORM VALIDATION
// ════════════════════════════════════════
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  function showError(input, msg) {
    input.classList.add('error');
    let err = input.parentElement.querySelector('.field-error');
    if (!err) {
      err = document.createElement('p');
      err.className = 'field-error';
      input.parentElement.appendChild(err);
    }
    err.textContent = msg;
    requestAnimationFrame(() => err.classList.add('show'));
  }

  function clearError(input) {
    input.classList.remove('error');
    const err = input.parentElement.querySelector('.field-error');
    if (err) { err.classList.remove('show'); setTimeout(() => err.remove(), 300); }
  }

  // Clear error on input
  form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => clearError(el));
  });

  // Override existing submit handler — add validation first
  const existingSubmit = form.onsubmit;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    const name  = form.querySelector('input[type="text"]');
    const email = form.querySelector('input[type="email"]');
    const msg   = form.querySelector('textarea');

    if (!name.value.trim()) {
      showError(name, 'Please enter your name'); valid = false;
    }
    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      showError(email, 'Please enter a valid email'); valid = false;
    }
    if (!msg.value.trim() || msg.value.trim().length < 10) {
      showError(msg, 'Message must be at least 10 characters'); valid = false;
    }
    if (!valid) return;

    // All good — run existing submit animation
    const btn = form.querySelector('.form-submit');
    const orig = btn.innerHTML;
    btn.innerHTML = 'Sending ✦';
    btn.style.background = 'var(--saffron)';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = 'Sent with love ✦';
      form.reset();
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1200);
  });
})();


// ════════════════════════════════════════
// ✦ NAV ACTIVE LINK — fix on page load too
// ════════════════════════════════════════
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav ul a');

  function setActive() {
    let current = 'hero';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 220) current = sec.id;
    });
    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === '#' + current;
      link.style.color  = isActive ? 'var(--saffron)' : '';
      link.style.fontWeight = isActive ? '500' : '';
    });
  }

  // Run on load + scroll
  setActive();
  window.addEventListener('scroll', setActive, { passive: true });
})();
