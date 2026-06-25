/**
 * tech-bucket.js
 * Section "À propos" — des logos technos qui sortent d'un seau puis flottent en place.
 *
 * Concept (comme les éléments flottants du hero) :
 *  - chaque logo a une position d'ancrage fixe et bouge très peu (léger bobbing sinusoïdal) ;
 *  - à l'apparition de la section, ils sortent du seau (GSAP) pour rejoindre leur ancrage ;
 *  - ils réagissent au passage de la souris (répulsion douce) puis reviennent à leur place ;
 *  - clic sur un logo → modal inline (à la place de l'avatar).
 *
 * Dépendance : GSAP (CDN dans index.html). Pas de moteur physique.
 */

/* ===========================
   DONNÉES TECHNOS
   label = catégorie courte · desc = ce que c'est + comment je l'utilise (simple)
=========================== */
const TECHS = [
  {
    key: 'javascript', file: 'javascript.svg', label: 'Langage', title: 'JavaScript',
    desc: "Le langage du web côté navigateur. Je l'utilise pour rendre mes interfaces vivantes et interactives."
  },
  {
    key: 'typescript', file: 'typescript.svg', label: 'Langage', title: 'TypeScript',
    desc: "Du JavaScript typé. Je l'utilise pour écrire un code plus fiable sur mes projets les plus ambitieux."
  },
  {
    key: 'react', file: 'react.svg', label: 'Bibliothèque', title: 'React',
    desc: "Une bibliothèque d'interfaces à base de composants. Je l'utilise pour construire des UI dynamiques et réutilisables."
  },
  {
    key: 'php', file: 'php.svg', label: 'Langage', title: 'PHP',
    desc: "Un langage côté serveur. Je l'utilise pour la logique back-end de mes applications web."
  },
  {
    key: 'mysql', file: 'mysql.svg', label: 'Base de données', title: 'MySQL',
    desc: "Une base de données relationnelle. Je l'utilise pour stocker et organiser les données de mes applications."
  },
  {
    key: 'tailwind', file: 'tailwind.svg', label: 'CSS', title: 'Tailwind CSS',
    desc: "Un framework CSS utilitaire. Je l'utilise pour styliser mes interfaces vite et de façon cohérente."
  },
  {
    key: 'twig', file: 'twig.svg', label: 'Templates', title: 'Twig',
    desc: "Un moteur de templates PHP. Je l'utilise pour générer proprement mes pages côté serveur."
  },
  {
    key: 'git', file: 'git.svg', label: 'Outil', title: 'Git',
    desc: "Un gestionnaire de versions. Je l'utilise pour suivre mon code et collaborer en équipe."
  },
];

/* Ancrages (fractions de la zone) — répartition aérée, façon hero.
   Les premiers N sont utilisés ; il y en a assez pour ajouter des logos. */
const ANCHORS = [
  [0.20, 0.24], [0.50, 0.15], [0.80, 0.24],
  [0.15, 0.50], [0.85, 0.48], [0.50, 0.42],
  [0.32, 0.70], [0.68, 0.70],
  [0.50, 0.66], [0.24, 0.84], [0.76, 0.84], [0.38, 0.32],
];

const lerp = (a, b, t) => a + (b - a) * t;

/* ===========================
   INIT
=========================== */
function initTechBucket() {
  const wrap      = document.getElementById('techBucket');
  const stage     = document.getElementById('bucketStage');
  const bucketGfx = document.getElementById('bucketGfx');
  const techModal = document.getElementById('techModal');
  if (!wrap || !stage) return;

  let W = wrap.clientWidth  || 400;
  let H = wrap.clientHeight || 420;
  const SIZE = Math.round(Math.max(42, Math.min(62, W * 0.135)));

  /* --- Seau : corps + ombre --- */
  const bucketShadow = document.createElement('div'); bucketShadow.className = 'bucket-shadow'; wrap.appendChild(bucketShadow);

  const place = (el, left, top, w, h) => {
    el.style.left = left + 'px'; el.style.top = top + 'px';
    el.style.width = w + 'px';   el.style.height = h + 'px';
  };

  let bucket = { bx: W / 2, by: H - 60 };
  function layoutBucket() {
    const BW = Math.max(120, Math.min(210, W * 0.46));
    const BH = Math.min(96, H * 0.34);
    const bx = W / 2;
    const floorY = H - 12;
    const by = floorY - BH / 2;
    const top = by - BH / 2;

    place(bucketGfx, bx - BW / 2, top, BW, BH);                       // corps

    const shW = BW * 1.35, shH = 26;
    place(bucketShadow, bx - shW / 2, floorY - shH * 0.4, shW, shH);  // ombre au sol

    bucket = { bx, by };
  }
  layoutBucket();

  /* --- Création des logos --- */
  const items = TECHS.map((t, i) => {
    const el = document.createElement('button');
    el.className = 'tech-chip';
    el.type = 'button';
    el.setAttribute('aria-label', t.title);
    el.style.width = el.style.height = SIZE + 'px';
    el.innerHTML = `<img src="./models/${t.file}" alt="" draggable="false">`;
    stage.appendChild(el);

    el.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      openTech(t.key);
    });

    const it = {
      el, key: t.key, idx: i,
      placed: 0,                                   // 0 = dans le seau, 1 = à l'ancrage (animé par GSAP)
      // flottement très léger (façon hero)
      floatSpeed: 0.35 + Math.random() * 0.4,
      floatOffset: Math.random() * Math.PI * 2,
      ampX: 3 + Math.random() * 3,
      ampY: 4 + Math.random() * 4,
      rotAmp: 0.04 + Math.random() * 0.04,
      startRot: (Math.random() - 0.5) * 0.7,       // petite culbute en sortant du seau
      depth: 0.4 + Math.random() * 0.6,            // parallaxe souris
      pushX: 0, pushY: 0,                          // décalage répulsion (ressort)
      startX: 0, startY: 0, anchorX: 0, anchorY: 0,
    };
    return it;
  });

  /* --- Positions (ancrage + départ dans le seau), recalculées au resize --- */
  function layoutAnchors() {
    const m = SIZE * 0.6; // marge pour rester dans la zone
    items.forEach((it, i) => {
      const a = ANCHORS[i % ANCHORS.length];
      it.anchorX = Math.min(W - m, Math.max(m, a[0] * W));
      it.anchorY = Math.min(H - m, Math.max(m, a[1] * H));
      it.startX = bucket.bx + (i - items.length / 2) * (SIZE * 0.12);
      it.startY = bucket.by;
    });
  }
  layoutAnchors();

  /* --- Souris --- */
  const mouse = { x: 0, y: 0, active: false };
  let parX = 0, parY = 0;
  wrap.addEventListener('pointermove', (e) => {
    const r = wrap.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
    mouse.active = true;
  });
  wrap.addEventListener('pointerleave', () => { mouse.active = false; });

  const REP_DEAD = SIZE * 0.75; // zone morte : le logo visé ne fuit pas → cliquable
  const REP_R = 92;             // rayon de répulsion
  const REP_MAX = 14;           // déplacement max (doux)

  /* --- Boucle de rendu --- */
  function frame() {
    requestAnimationFrame(frame);
    const t = performance.now() * 0.001;

    // parallaxe globale très douce
    const ptx = mouse.active ? (mouse.x / W - 0.5) * 6 : 0;
    const pty = mouse.active ? (mouse.y / H - 0.5) * 6 : 0;
    parX += (ptx - parX) * 0.05;
    parY += (pty - parY) * 0.05;

    for (const it of items) {
      const baseX = lerp(it.startX, it.anchorX, it.placed);
      const baseY = lerp(it.startY, it.anchorY, it.placed);

      // flottement
      const fx = Math.sin(t * it.floatSpeed + it.floatOffset) * it.ampX;
      const fy = Math.cos(t * it.floatSpeed * 0.9 + it.floatOffset) * it.ampY;

      // répulsion souris (cible) puis retour élastique
      let tx = 0, ty = 0;
      if (mouse.active && it.placed > 0.6) {
        const dx = baseX - mouse.x;
        const dy = baseY - mouse.y;
        const d = Math.hypot(dx, dy) || 0.001;
        // pas de poussée dans la zone morte (logo visé) ; poussée douce des voisins
        if (d > REP_DEAD && d < REP_R) {
          const f = (1 - (d - REP_DEAD) / (REP_R - REP_DEAD)) * REP_MAX;
          tx = (dx / d) * f;
          ty = (dy / d) * f;
        }
      }
      it.pushX += (tx - it.pushX) * 0.12;
      it.pushY += (ty - it.pushY) * 0.12;

      const x = baseX + fx + it.pushX + parX * it.depth;
      const y = baseY + fy + it.pushY + parY * it.depth;
      const rot = lerp(it.startRot, 0, it.placed)
                + Math.sin(t * it.floatSpeed + it.floatOffset) * it.rotAmp;

      it.el.style.transform =
        `translate3d(${x - SIZE / 2}px, ${y - SIZE / 2}px, 0) rotate(${rot}rad)`;
    }
  }
  requestAnimationFrame(frame);

  /* --- Sortie du seau (déclenchée à l'apparition de la section) --- */
  let poured = false;
  function pour() {
    if (poured) return;
    poured = true;
    items.forEach((it, i) => {
      if (window.gsap) {
        gsap.to(it, { placed: 1, duration: 1.1, delay: i * 0.12, ease: 'power3.out' });
      } else {
        it.placed = 1;
      }
    });
    setTimeout(() => wrap.classList.add('poured'), items.length * 120 + 900);
  }

  new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { pour(); obs.disconnect(); }
    });
  }, { threshold: 0.35 }).observe(wrap);

  /* --- Modal inline d'une techno --- */
  function openTech(key) {
    const t = TECHS.find((x) => x.key === key);
    if (!t || techModal.classList.contains('open')) return;

    techModal.innerHTML = `
      <button class="tech-modal-close" type="button" aria-label="Fermer"></button>
      <div class="tech-modal-logo"><img src="./models/${t.file}" alt=""></div>
      <span class="tech-modal-label">${t.label}</span>
      <h3 class="tech-modal-title">${t.title}</h3>
      <p class="tech-modal-desc">${t.desc}</p>`;

    techModal.classList.add('open');
    techModal.setAttribute('aria-hidden', 'false');

    techModal.querySelector('.tech-modal-close')
      .addEventListener('pointerdown', (e) => { e.stopPropagation(); closeTech(); });

    if (window.gsap) {
      const logo  = techModal.querySelector('.tech-modal-logo');
      const close = techModal.querySelector('.tech-modal-close');
      const lines = techModal.querySelectorAll('.tech-modal-label, .tech-modal-title, .tech-modal-desc');

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      // 1. le panneau s'ouvre
      tl.fromTo(techModal,
        { opacity: 0, scale: 0.94, y: 16 },
        { opacity: 1, scale: 1, y: 0, duration: 0.45 });
      // 2. le logo « pop »
      tl.fromTo(logo,
        { opacity: 0, scale: 0.4, rotate: -18 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.2');
      // 3. le texte se révèle en cascade
      tl.fromTo(lines,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.09 }, '-=0.35');
      // 4. le bouton de fermeture
      tl.fromTo(close,
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: 0.3 }, '-=0.4');
    }
  }

  function closeTech() {
    const done = () => {
      techModal.classList.remove('open');
      techModal.setAttribute('aria-hidden', 'true');
      techModal.innerHTML = '';
    };
    if (window.gsap) {
      gsap.to(techModal, { opacity: 0, scale: 0.97, y: 8, duration: 0.28, ease: 'power2.in', onComplete: done });
    } else {
      done();
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && techModal.classList.contains('open')) closeTech();
  });

  /* --- Resize --- */
  new ResizeObserver(() => {
    W = wrap.clientWidth  || W;
    H = wrap.clientHeight || H;
    layoutBucket();
    layoutAnchors();
  }).observe(wrap);
}

document.addEventListener('DOMContentLoaded', initTechBucket);
