// ── CUSTOM CURSOR ──
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');

let mx = 0, my = 0;

document.addEventListener('mousemove', (e) => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

// Follower lags slightly behind
function animateFollower() {
  follower.style.left = mx + 'px';
  follower.style.top  = my + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Grow cursor on hoverable elements
document.querySelectorAll('a, button, .skill-card, .project-card, .nav-ham').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
    cursor.style.background = 'var(--rose)';
    follower.style.opacity = '0.15';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    cursor.style.background = 'var(--saffron)';
    follower.style.opacity = '0.5';
  });
});


// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});


// ── MOBILE HAMBURGER ──
const ham = document.getElementById('ham');
const navUl = document.querySelector('nav ul');
let menuOpen = false;

ham.addEventListener('click', () => {
  menuOpen = !menuOpen;

  if (menuOpen) {
    navUl.style.cssText = `
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(42,26,14,0.97);
      align-items: center;
      justify-content: center;
      gap: 40px;
      z-index: 999;
    `;
    navUl.querySelectorAll('a').forEach(a => {
      a.style.cssText = 'font-size:1.8rem; letter-spacing:4px; color:#fdf6ee;';
    });
    ham.children[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
    ham.children[1].style.opacity = '0';
    ham.children[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
  } else {
    navUl.removeAttribute('style');
    navUl.querySelectorAll('a').forEach(a => a.removeAttribute('style'));
    ham.children[0].style.transform = '';
    ham.children[1].style.opacity = '';
    ham.children[2].style.transform = '';
  }
});

// Close menu on nav link click
navUl.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    if (menuOpen) ham.click();
  });
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