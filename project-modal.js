/**
 * project-modal.js
 * Génération des cartes projet (boucle) + logique du modal projet.
 *
 * ⚠️ Pour ajouter/modifier un projet, éditer UNIQUEMENT projects-data.js.
 */

import { PROJECTS } from './projects-data.js';

/* ===========================
   PRÉ-CALCUL : numéro auto + index par id
   "01 / 05", "02 / 05"… déduits de l'ordre dans projects-data.js
=========================== */
const TOTAL = PROJECTS.length;
const pad = (n) => String(n).padStart(2, '0');

const PROJECTS_BY_ID = {};
PROJECTS.forEach((project, i) => {
  project.num = `${pad(i + 1)} / ${pad(TOTAL)}`;
  PROJECTS_BY_ID[project.id] = project;
});

/* Échappe le HTML pour insérer du texte sans risque de casse. */
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* ===========================
   GÉNÉRATION DES CARTES (boucle)
   Remplit .projects-grid à partir de PROJECTS et met à jour le compteur.
=========================== */
/* Badges de compétences BUT (masqués tant que l'interrupteur est OFF). */
function competencesHTML(competences) {
  if (!competences || !competences.length) return '';
  const badges = competences
    .map((c) => `<span class="project-competence">${esc(c)}</span>`)
    .join('');
  return `
      <div class="project-competences">
        <span class="project-competences-label">Compétences — niveau 3</span>
        <div class="project-competences-list">${badges}</div>
      </div>`;
}

export function renderProjectCards() {
  const grid = document.querySelector('.projects-grid');
  if (!grid) return;

  grid.innerHTML = PROJECTS.map((p) => `
    <div class="project-card${p.featured ? ' featured' : ''} reveal" data-project="${esc(p.id)}">
      <div class="project-num">${esc(p.num)}</div>
      <div class="project-category">${esc(p.category)}</div>
      <h3 class="project-name">${esc(p.title)}</h3>
      <p class="project-desc">${esc(p.desc)}</p>
      <div class="project-tags">
        ${p.tags.map((t) => `<span class="project-tag">${esc(t)}</span>`).join('')}
      </div>${competencesHTML(p.competences)}
      <a href="#" class="project-link" data-no-anchor>Voir le projet</a>
    </div>`).join('');

  const count = document.querySelector('.projects-count');
  if (count) count.textContent = `${pad(TOTAL)} PROJETS`;
}

/* ===========================
   MODAL — ÉTAT & RÉFÉRENCES DOM
=========================== */
let modalEls = null;
let lastFocusedEl = null;

function getModalEls() {
  if (modalEls) return modalEls;
  modalEls = {
    overlay: document.getElementById('projectModal'),
    box: document.querySelector('#projectModal .modal-box'),
    closeBtn: document.getElementById('modalClose'),
    gallery: document.getElementById('modalGallery'),
    num: document.getElementById('modalNum'),
    category: document.getElementById('modalCategory'),
    title: document.getElementById('modalTitle'),
    desc: document.getElementById('modalDesc'),
    tags: document.getElementById('modalTags'),
    longtext: document.getElementById('modalLongtext'),
    iut: document.getElementById('modalIut'),
    iutLabel: document.getElementById('modalIutLabel'),
    iutText: document.getElementById('modalIutText'),
    link: document.getElementById('modalLink'),
    github: document.getElementById('modalGithub'),
  };
  return modalEls;
}

/* ===========================
   LIGHTBOX — agrandissement d'une capture
=========================== */
let lightboxEls = null;

function getLightboxEls() {
  if (lightboxEls) return lightboxEls;

  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.setAttribute('aria-hidden', 'true');

  const closeBtn = document.createElement('button');
  closeBtn.className = 'lightbox-close';
  closeBtn.setAttribute('aria-label', 'Fermer l\'aperçu');
  closeBtn.innerHTML = '&times;';

  const img = document.createElement('img');
  img.alt = '';

  overlay.appendChild(closeBtn);
  overlay.appendChild(img);
  document.body.appendChild(overlay);

  // Fermeture : clic hors image, croix
  overlay.addEventListener('click', (e) => {
    if (e.target !== img) closeLightbox();
  });
  closeBtn.addEventListener('click', closeLightbox);

  lightboxEls = { overlay, img, closeBtn };
  return lightboxEls;
}

function isLightboxOpen() {
  return !!(lightboxEls && lightboxEls.overlay.classList.contains('open'));
}

function openLightbox(src, alt) {
  const els = getLightboxEls();
  els.img.src = src;
  els.img.alt = alt || '';
  els.overlay.classList.add('open');
  els.overlay.setAttribute('aria-hidden', 'false');
  els.closeBtn.focus();
}

function closeLightbox() {
  if (!lightboxEls) return;
  lightboxEls.overlay.classList.remove('open');
  lightboxEls.overlay.setAttribute('aria-hidden', 'true');
}

function renderGallery(images, title) {
  const els = getModalEls();
  els.gallery.innerHTML = '';
  els.gallery.classList.toggle('has-images', !!(images && images.length));

  if (images && images.length > 0) {
    images.forEach((src, i) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = `${title} — aperçu ${i + 1}`;
      img.loading = 'lazy';
      img.tabIndex = 0;
      img.setAttribute('role', 'button');
      img.title = 'Agrandir';
      img.addEventListener('click', () => openLightbox(src, img.alt));
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(src, img.alt);
        }
      });
      els.gallery.appendChild(img);
    });
    return;
  }

  const placeholder = document.createElement('div');
  placeholder.className = 'modal-gallery-placeholder';
  placeholder.textContent = 'Capture à venir';
  els.gallery.appendChild(placeholder);
}

function renderTags(tags) {
  const els = getModalEls();
  els.tags.innerHTML = '';
  tags.forEach(tag => {
    const span = document.createElement('span');
    span.className = 'project-tag';
    span.textContent = tag;
    els.tags.appendChild(span);
  });
}

function renderLongtext(paragraphs) {
  const els = getModalEls();
  els.longtext.innerHTML = '';
  paragraphs.forEach(text => {
    const p = document.createElement('p');
    p.textContent = text;
    els.longtext.appendChild(p);
  });
}

function renderVision(vision) {
  const els = getModalEls();
  if (!els.iut) return;

  if (vision && vision.text) {
    if (els.iutLabel && vision.label) els.iutLabel.textContent = vision.label;
    els.iutText.textContent = vision.text;
    els.iut.hidden = false;
  } else {
    els.iutText.textContent = '';
    els.iut.hidden = true;
  }
}

function fillModal(data) {
  const els = getModalEls();
  els.num.textContent = data.num;
  els.category.textContent = data.category;
  els.title.textContent = data.title;
  els.desc.textContent = data.desc;
  renderTags(data.tags);
  renderLongtext(data.longtext);
  renderGallery(data.images, data.title);
  renderVision(data.vision);

  // Bouton "Voir le site" : visible seulement si un lien valide existe
  if (data.link && data.link !== '#') {
    els.link.href = data.link;
    els.link.hidden = false;
  } else {
    els.link.href = '#';
    els.link.hidden = true;
  }

  // Bouton "Voir le code" : visible seulement si un lien GitHub est défini
  if (els.github) {
    if (data.github) {
      els.github.href = data.github;
      els.github.hidden = false;
    } else {
      els.github.href = '#';
      els.github.hidden = true;
    }
  }
}

export function openProjectModal(projectId) {
  const data = PROJECTS_BY_ID[projectId];
  if (!data) return;

  const els = getModalEls();
  fillModal(data);

  lastFocusedEl = document.activeElement;
  els.overlay.classList.add('open');
  els.overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  els.closeBtn.focus();
}

export function closeProjectModal() {
  const els = getModalEls();
  els.overlay.classList.remove('open');
  els.overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
    lastFocusedEl.focus();
  }
}

/* ===========================
   INIT — bind des écouteurs
=========================== */
export function initProjectModal() {
  // Génère les cartes depuis projects-data.js AVANT de brancher les écouteurs
  renderProjectCards();

  const els = getModalEls();
  if (!els.overlay) return;

  // Interrupteur "Compétences" : révèle/masque les badges de compétences
  const competencesToggle = document.getElementById('competencesToggle');
  const projectsSection = document.getElementById('projets');
  if (competencesToggle && projectsSection) {
    competencesToggle.addEventListener('click', () => {
      const on = projectsSection.classList.toggle('show-competences');
      competencesToggle.classList.toggle('is-on', on);
      competencesToggle.setAttribute('aria-pressed', String(on));
    });
  }

  // Ouverture au clic sur une card (ou son lien "Voir le projet")
  document.querySelectorAll('.project-card[data-project]').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      openProjectModal(card.dataset.project);
    });
  });

  // Fermeture : croix
  els.closeBtn.addEventListener('click', closeProjectModal);

  // Fermeture : clic sur l'overlay (hors boîte)
  els.overlay.addEventListener('click', (e) => {
    if (e.target === els.overlay) closeProjectModal();
  });

  // Fermeture : touche Échap (lightbox d'abord, puis le modal)
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (isLightboxOpen()) {
      closeLightbox();
    } else if (els.overlay.classList.contains('open')) {
      closeProjectModal();
    }
  });
}