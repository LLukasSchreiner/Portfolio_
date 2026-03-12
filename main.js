/**
 * main.js
 * UI interactions : curseur, scroll reveal, nav sticky, compteurs animés
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ===========================
     CUSTOM CURSOR — mix-blend-mode: difference
     La couleur s'inverse automatiquement en CSS.
     Le JS gère uniquement la position et l'agrandissement au hover.
  =========================== */
  const cursor = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');

  let cx = window.innerWidth / 2;
  let cy = window.innerHeight / 2;
  let rx = cx, ry = cy;

  document.addEventListener('mousemove', e => {
    cx = e.clientX;
    cy = e.clientY;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
  });

  // Ring suit avec lerp (légèrement en retard = effet fluide)
  function animateRing() {
    rx += (cx - rx) * 0.13;
    ry += (cy - ry) * 0.13;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover : le curseur plein grossit, le ring disparaît
  const hoverTargets = document.querySelectorAll(
    'a, button, .project-card, .service-item, .skill-tag'
  );
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      cursorRing.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      cursorRing.classList.remove('hover');
    });
  });

  /* ===========================
     NAV — STICKY ON SCROLL
  =========================== */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  /* ===========================
     SCROLL REVEAL
  =========================== */
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay basé sur l'index dans le parent
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 90);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  /* ===========================
     COUNTER ANIMATION (STATS)
  =========================== */
  const statNums = document.querySelectorAll('.stat-num[data-target]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      if (isNaN(target)) return;

      let current = 0;
      const duration = 1200; // ms
      const stepTime = 30;
      const steps = duration / stepTime;
      const increment = target / steps;

      const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          el.textContent = target + suffix;
          clearInterval(interval);
        } else {
          el.textContent = Math.floor(current) + suffix;
        }
      }, stepTime);

      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObserver.observe(el));

  /* ===========================
     PROJECT CARDS — TILT EFFECT
  =========================== */
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
      card.style.transition = 'transform 0.5s ease';
    });
  });

  /* ===========================
     SMOOTH ANCHOR SCROLL
  =========================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

});