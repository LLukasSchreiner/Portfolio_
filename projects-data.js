/**
 * projects-data.js
 * ─────────────────────────────────────────────────────────────
 * SEUL FICHIER À ÉDITER POUR AJOUTER / MODIFIER UN PROJET.
 *
 * Pour ajouter un projet : copie un bloc { ... } et adapte-le.
 * - id        : identifiant unique (lettres/chiffres, sans espace)
 * - category  : petit label en haut de la carte
 * - title     : titre du projet
 * - desc      : description courte (affichée sur la carte)
 * - tags      : liste des technos (badges)
 * - link        : URL du projet (mettre '#' si pas de lien)
 * - github      : (optionnel) URL du dépôt → bouton "Voir le code"
 * - featured    : true = grande carte (occupe 2 colonnes), false = carte normale
 * - images      : liste d'URL d'images pour la galerie du modal (peut rester [])
 * - competences : (optionnel) compétences BUT MMI démontrées, parmi
 *                 'Développer' et 'Entreprendre' (niveau 3).
 *                 Révélées via l'interrupteur "Compétences".
 * - longtext    : paragraphes affichés dans le modal (1 entrée = 1 paragraphe)
 * - vision      : (optionnel) encart "vision du projet" → { label, text }
 *
 * Le numéro (01 / 05…) et le compteur "05 PROJETS" sont calculés
 * automatiquement à partir de l'ordre de cette liste : pas besoin
 * de renuméroter quoi que ce soit à la main.
 * ─────────────────────────────────────────────────────────────
 */
export const PROJECTS = [

  {
    id: 'wiro',
    category: 'Projet Personnel',
    title: 'Wiro — Vie étudiante',
    desc: 'Application pensée pour les étudiants afin de gérer leurs cours et leur vie scolaire au quotidien.',
    tags: ['React', 'OAuth'],
    link: 'https://wiroo.vercel.app/',
    featured: true,
    competences: ['Développer', 'Entreprendre'],
    images: [
      'image/wiro/accueil.png',
      'image/wiro/connexion.png'
    ],
    longtext: [
      'Wiro est un projet personnel conçu pour aider les étudiants à centraliser et organiser leur vie scolaire : notes de cours, suivi des matières, emploi du temps, tableau Kanban pour gérer les tâches, et d\'autres modules pensés autour du quotidien étudiant.',
      'L\'authentification s\'appuie sur OAuth pour une connexion simple et sécurisée. À ce stade, le lien en ligne ne présente que la page d\'accueil : le corps de l\'application est encore en cours de développement.',
      'Initialement développé en React, le projet est en cours de réécriture complète pour passer sur une stack PHP.'
    ],
    vision: {
      label: 'Vision du projet — évolution',
      text: 'Changer de stack n\'est pas qu\'une décision technique : c\'est le signe que ma vision du projet a changé. Wiro est passé d\'un projet destiné à rester dans un dépôt privé à une application qui peut réellement être utilisée par d\'autres. Ce repositionnement a motivé le passage de React à PHP, mieux adapté à cette nouvelle ambition.'
    }
  },

  {
    id: 'ora',
    category: 'Stage — Application métier',
    title: 'Portail ORA — Document Unique',
    desc: 'Application de création et de suivi des DUERP et PAPRIPACT pour les collectivités, développée au Centre de Gestion des Vosges (CDG88).',
    tags: ['PHP — Slim 4', 'Twig', 'TypeScript', 'Tailwind / SASS', 'PostgreSQL', 'WebSocket', 'Docker'],
    link: '#',
    featured: true,
    competences: ['Développer', 'Entreprendre'],
    images: [
      'image/ora/documents.png',
      'image/ora/editeur.png'
    ],
    longtext: [
      'Développée durant mon stage au Centre de Gestion de la Fonction Publique Territoriale des Vosges (CDG88), cette application web permet aux collectivités de créer, gérer et faire évoluer leur Document Unique d\'Évaluation des Risques Professionnels (DUERP) ainsi que leur PAPRIPACT (programme annuel de prévention).',
      'Le document est piloté par année avec un cycle de vie complet (brouillon, actif, archivé) et une édition structurée en cascade : lieux → unités et tâches → risques. Chaque risque est coté selon la gravité, la fréquence et la maîtrise, avec calcul automatique de la criticité brute et résiduelle, des observations et mesures de maîtrise, puis export PDF du document.',
      'Stack technique : back-end PHP avec le micro-framework Slim 4 et des templates Twig ; front-end en TypeScript compilé via Webpack (Symfony Encore) ; CSS en Tailwind + SASS + Bootstrap 5 avec Flowbite, Alpine.js, jQuery, SweetAlert2 et DataTables ; persistance PostgreSQL (et SQL Server via ext-sqlsrv) ; temps réel par WebSocket (Ratchet / Socket.io) ; génération PDF (mPDF, FPDF/FPDI, jsPDF) ; e-mails via Symfony Mailer + Mailjet ; le tout conteneurisé avec Docker (Apache + PHP) et déployé sur des serveurs internes.',
      'L\'application étant réservée aux utilisateurs connectés des collectivités, elle ne peut pas être ouverte publiquement : les captures ci-dessus présentent la gestion des documents et l\'éditeur de risques.'
    ],
    vision: {
      label: 'Contexte professionnel — Entreprendre',
      text: 'Réalisée en environnement professionnel pour un employeur public, je ne peux pas partager le lien ou code de ce projet. Ce cadre m\'a amené à travailler avec une stack imposée et exigeante, à comprendre un besoin métier précis (prévention des risques) et à livrer un outil réellement utilisé — au-delà du simple exercice technique.'
    }
  },

  {
    id: 'sae501',
    category: 'Application Web',
    title: 'SAE501 — Gestion de Projets',
    desc: 'Application collaborative de gestion de projets académiques. Fonctionnalités Scrum/Kanban, prise de notes, et tableaux de bord en temps réel.',
    tags: ['Laravel', 'Livewire', 'MySQL', 'Tailwind'],
    link: '',
    github: 'https://github.com/LLukasSchreiner/501T',
    featured: true,
    competences: ['Développer', 'Entreprendre'],
    images: ['image/501/photo.png'],
    longtext: [
      'Développée en équipe dans le cadre d\'une SAE, cette application permet à des groupes étudiants de piloter leurs projets académiques de bout en bout : création de tableaux Kanban, suivi des tâches façon Scrum, prise de notes partagée et tableaux de bord avec indicateurs d\'avancement en temps réel.',
      'Le back-end repose sur Laravel avec Livewire pour la réactivité côté serveur sans surcouche JavaScript lourde, et MySQL pour la persistance des données. L\'interface est construite avec Tailwind CSS pour un design cohérent et rapide à itérer.',
      'Mon rôle a couvert la conception du schéma de base de données, la mise en place de l\'authentification et des permissions par rôle, ainsi que le développement des composants Livewire pour le tableau Kanban et les tableaux de bord.'
    ]
  },

  {
    id: 'grafana',
    category: 'Application Web',
    title: 'Application de gestion électrique',
    desc: 'Modernisation et centralisation des données énergétiques de l\'Institut Universitaire de Technologie d\'Haguenau.',
    tags: ['Laravel', 'Grafana', 'InfluxDB', 'Tailwind', 'Flux'],
    link: 'https://nfwmpjaf.gensparkspace.com/',
    github: 'https://gitlab.unistra.fr/lbrimacombe/sae501-grafana',
    featured: true,
    competences: ['Développer'],
    images: [
      'image/grafana/dashboard.png',
      'image/grafana/vue%20globale.png',
      'image/grafana/carte.png',
      'image/grafana/production%20solaire.png',
      'image/grafana/couts.png'
    ],
    longtext: [
      'Développée en équipe dans le cadre d\'une SAE, cette application permet à des professionnels d\'analyser les informations dégagées par des capteurs présents dans l\'IUT.',
      'Les données des capteurs sont stockées dans une base de séries temporelles InfluxDB et interrogées via le langage Flux, puis restituées sous forme de tableaux de bord visuels grâce à Grafana. Le back-end Laravel gère l\'application autour de ces données (utilisateurs, accès, vues métier), avec une interface construite sous Tailwind CSS.',
      'Le lien ci-dessous n\'est pas l\'application elle-même — son accès ne peut pas être ouvert librement — mais une présentation du projet permettant d\'en comprendre les objectifs et le fonctionnement.'
    ]
  },

  {
    id: 'peugeot406',
    category: 'Accessibilité',
    title: 'Peugeot 406 V6',
    desc: 'Site web optimisé RGAA 4.1 avec accessibilité totale pour lecteurs d\'écran et navigation clavier.',
    tags: ['HTML/CSS', 'RGAA 4.1', 'JS'],
    link: 'https://access.schreiner.etu.mmi-unistra.fr/',
    featured: false,
    competences: ['Développer'],
    images: [],
    longtext: [
      'Site vitrine entièrement pensé autour des exigences du RGAA 4.1, conçu pour être intégralement navigable au clavier et restituable de façon cohérente par les lecteurs d\'écran (structure sémantique, attributs ARIA, contrastes conformes, gestion du focus).',
      'Le projet a nécessité un audit systématique de chaque composant interactif — navigation, formulaires, médias — pour garantir une expérience équivalente quel que soit le mode de consultation utilisé.',
      'Au-delà de la conformité technique, l\'objectif était de démontrer qu\'accessibilité et identité visuelle forte ne sont pas incompatibles.'
    ]
  },

];
