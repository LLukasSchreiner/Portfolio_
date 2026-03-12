/**
 * three-scene.js
 * Three.js 3D interactive scenes for the portfolio
 * Scene 1 — Hero : logos tech monochrome flottants sur plans 3D
 * Scene 2 — About : personnage low-poly style memoji monochrome
 * Scene 3 — Contact : grille ondulante
 */

/* ===========================
   HELPERS — Dessin SVG → Texture Canvas
=========================== */
function makeLogoTexture(drawFn, size = 256) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, size, size);
  drawFn(ctx, size);
  return new THREE.CanvasTexture(c);
}

/* ===========================
   LOGOS dessinés en Canvas 2D
=========================== */
const LOGOS = {

  js: (ctx, s) => {
    const p = s * 0.12;
    ctx.fillStyle = '#0a0a0a';
    roundRect(ctx, p, p, s - p * 2, s - p * 2, s * 0.1);
    ctx.fill();
    ctx.fillStyle = '#f5f2ed';
    ctx.font = `bold ${s * 0.44}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('JS', s / 2, s / 2 + s * 0.02);
  },

  ts: (ctx, s) => {
    const p = s * 0.12;
    ctx.fillStyle = '#0a0a0a';
    roundRect(ctx, p, p, s - p * 2, s - p * 2, s * 0.1);
    ctx.fill();
    ctx.fillStyle = '#f5f2ed';
    ctx.font = `bold ${s * 0.4}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TS', s / 2, s / 2 + s * 0.02);
  },

  react: (ctx, s) => {
    const cx = s / 2, cy = s / 2;
    ctx.strokeStyle = '#0a0a0a';
    ctx.lineWidth = s * 0.048;
    // Noyau
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.08, 0, Math.PI * 2);
    ctx.fillStyle = '#0a0a0a';
    ctx.fill();
    // 3 orbites
    [0, Math.PI / 3 * 2, Math.PI / 3 * 4].forEach(a => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(a);
      ctx.beginPath();
      ctx.ellipse(0, 0, s * 0.40, s * 0.16, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });
  },

  tailwind: (ctx, s) => {
    ctx.strokeStyle = '#0a0a0a';
    ctx.lineWidth = s * 0.068;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const sc = s / 100;
    ctx.beginPath();
    ctx.moveTo(10 * sc, 48 * sc);
    ctx.bezierCurveTo(10 * sc, 28 * sc, 22 * sc, 18 * sc, 36 * sc, 28 * sc);
    ctx.bezierCurveTo(43 * sc, 33 * sc, 46 * sc, 44 * sc, 50 * sc, 44 * sc);
    ctx.bezierCurveTo(54 * sc, 44 * sc, 57 * sc, 28 * sc, 64 * sc, 22 * sc);
    ctx.bezierCurveTo(78 * sc, 14 * sc, 90 * sc, 24 * sc, 90 * sc, 48 * sc);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(10 * sc, 68 * sc);
    ctx.bezierCurveTo(10 * sc, 48 * sc, 22 * sc, 38 * sc, 36 * sc, 48 * sc);
    ctx.bezierCurveTo(43 * sc, 53 * sc, 46 * sc, 64 * sc, 50 * sc, 64 * sc);
    ctx.bezierCurveTo(54 * sc, 64 * sc, 57 * sc, 48 * sc, 64 * sc, 42 * sc);
    ctx.bezierCurveTo(78 * sc, 34 * sc, 90 * sc, 44 * sc, 90 * sc, 68 * sc);
    ctx.stroke();
  },

  laravel: (ctx, s) => {
    ctx.strokeStyle = '#0a0a0a';
    ctx.lineWidth = s * 0.055;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const sc = s / 100;
    ctx.beginPath();
    ctx.moveTo(50 * sc, 10 * sc);
    ctx.lineTo(85 * sc, 30 * sc);
    ctx.lineTo(85 * sc, 70 * sc);
    ctx.lineTo(50 * sc, 90 * sc);
    ctx.lineTo(15 * sc, 70 * sc);
    ctx.lineTo(15 * sc, 30 * sc);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(50 * sc, 10 * sc);
    ctx.lineTo(50 * sc, 90 * sc);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(15 * sc, 30 * sc);
    ctx.lineTo(85 * sc, 70 * sc);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(85 * sc, 30 * sc);
    ctx.lineTo(15 * sc, 70 * sc);
    ctx.stroke();
  },

  git: (ctx, s) => {
    ctx.fillStyle = '#0a0a0a';
    ctx.strokeStyle = '#0a0a0a';
    ctx.lineWidth = s * 0.058;
    ctx.lineCap = 'round';
    const sc = s / 100;
    const dot = (x, y, r = 6) => {
      ctx.beginPath(); ctx.arc(x * sc, y * sc, r * sc, 0, Math.PI * 2); ctx.fill();
    };
    dot(30, 22); dot(30, 78); dot(70, 48);
    ctx.beginPath(); ctx.moveTo(30 * sc, 28 * sc); ctx.lineTo(30 * sc, 72 * sc); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(36 * sc, 22 * sc);
    ctx.bezierCurveTo(62 * sc, 22 * sc, 70 * sc, 32 * sc, 70 * sc, 48 * sc);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(36 * sc, 78 * sc);
    ctx.bezierCurveTo(62 * sc, 78 * sc, 70 * sc, 68 * sc, 70 * sc, 48 * sc);
    ctx.stroke();
  },

  vite: (ctx, s) => {
    ctx.strokeStyle = '#0a0a0a';
    ctx.lineWidth = s * 0.055;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const sc = s / 100;
    ctx.beginPath();
    ctx.moveTo(62 * sc, 8 * sc);
    ctx.lineTo(34 * sc, 54 * sc);
    ctx.lineTo(52 * sc, 54 * sc);
    ctx.lineTo(38 * sc, 92 * sc);
    ctx.lineTo(68 * sc, 46 * sc);
    ctx.lineTo(50 * sc, 46 * sc);
    ctx.closePath();
    ctx.stroke();
  },

  php: (ctx, s) => {
    ctx.strokeStyle = '#0a0a0a';
    ctx.lineWidth = s * 0.055;
    const sc = s / 100;
    ctx.beginPath();
    ctx.ellipse(50 * sc, 50 * sc, 42 * sc, 22 * sc, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.font = `bold ${s * 0.28}px monospace`;
    ctx.fillStyle = '#0a0a0a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PHP', s / 2, s / 2);
  },

  mysql: (ctx, s) => {
    ctx.strokeStyle = '#0a0a0a';
    ctx.lineWidth = s * 0.055;
    ctx.lineCap = 'round';
    const sc = s / 100;
    // Cylindre base de données
    ctx.beginPath();
    ctx.ellipse(50 * sc, 22 * sc, 32 * sc, 10 * sc, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(18 * sc, 22 * sc); ctx.lineTo(18 * sc, 78 * sc);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(82 * sc, 22 * sc); ctx.lineTo(82 * sc, 78 * sc);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(50 * sc, 78 * sc, 32 * sc, 10 * sc, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(50 * sc, 50 * sc, 32 * sc, 10 * sc, 0, 0, Math.PI * 2);
    ctx.stroke();
  },
};

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/* ===========================
   SCENE 1 — HERO : LOGOS TECH FLOTTANTS
=========================== */
function initHeroScene() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const W = canvas.offsetWidth || window.innerWidth;
  const H = canvas.offsetHeight || window.innerHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
  camera.position.z = 6;

  // Particules légères
  const COUNT = 140;
  const ptPos = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    ptPos[i * 3]     = (Math.random() - 0.5) * 16;
    ptPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
    ptPos[i * 3 + 2] = (Math.random() - 0.5) * 4 - 2;
  }
  const ptGeo = new THREE.BufferGeometry();
  ptGeo.setAttribute('position', new THREE.BufferAttribute(ptPos, 3));
  scene.add(new THREE.Points(ptGeo, new THREE.PointsMaterial({ color: 0x0a0a0a, size: 0.03, transparent: true, opacity: 0.3 })));

  // Logos
  const logoKeys = Object.keys(LOGOS);
  const logoMeshes = [];

  const positions = [
    [ 3.4,  1.6,  0.0],
    [ 4.6, -0.5, -0.4],
    [ 2.8, -2.2,  0.2],
    [-3.6,  1.8, -0.2],
    [-4.8, -0.6, -0.5],
    [ 5.0,  3.0, -0.8],
    [-2.6, -2.0,  0.1],
    [-1.2,  3.0, -0.3],
    [ 1.0,  2.6,  0.3],
  ];

  logoKeys.forEach((key, i) => {
    const tex = makeLogoTexture(LOGOS[key], 256);
    const size = 0.60 + Math.random() * 0.20;
    const geo = new THREE.PlaneGeometry(size, size);
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    const pos = positions[i % positions.length];
    mesh.position.set(pos[0], pos[1], pos[2]);
    mesh.rotation.z = (Math.random() - 0.5) * 0.28;
    mesh.userData = {
      baseY: pos[1],
      baseX: pos[0],
      floatSpeed: 0.32 + Math.random() * 0.38,
      floatOffset: Math.random() * Math.PI * 2,
      rotBase: mesh.rotation.z,
      targetOpacity: 0.70 + Math.random() * 0.22,
      fadeDelay: i * 0.20,
    };
    scene.add(mesh);
    logoMeshes.push(mesh);
  });

  // -- Petites formes wireframe flottantes --
  const shapeMeshes = [];
  const shapeGeos = [
    new THREE.OctahedronGeometry(0.18, 0),
    new THREE.TetrahedronGeometry(0.16, 0),
    new THREE.IcosahedronGeometry(0.14, 0),
    new THREE.OctahedronGeometry(0.13, 0),
    new THREE.TetrahedronGeometry(0.20, 0),
  ];
  const shapePositions = [
    [ 1.6,  0.6, -0.5],
    [-1.8,  0.2, -0.8],
    [ 0.4, -1.4, -0.6],
    [-0.6,  1.8, -0.7],
    [ 2.2, -1.0, -0.4],
    [-2.4,  2.2, -0.9],
    [ 3.8,  0.2, -1.0],
    [-3.2, -1.4, -0.8],
    [ 0.8,  3.2, -0.6],
    [-1.4, -2.6, -0.5],
    [ 5.8,  1.2, -1.2],
    [-5.2,  0.8, -1.0],
  ];

  shapePositions.forEach((pos, i) => {
    const geo = shapeGeos[i % shapeGeos.length];
    const mat = new THREE.MeshBasicMaterial({
      color: 0x0a0a0a,
      wireframe: true,
      transparent: true,
      opacity: 0.16 + Math.random() * 0.10,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(pos[0], pos[1], pos[2]);
    mesh.userData = {
      baseY: pos[1],
      baseX: pos[0],
      rotSpeed: { x: (Math.random() - 0.5) * 0.014, y: (Math.random() - 0.5) * 0.014 },
      floatSpeed:  0.28 + Math.random() * 0.45,
      floatOffset: Math.random() * Math.PI * 2,
      parallax: 0.04 + Math.random() * 0.06,
    };
    scene.add(mesh);
    shapeMeshes.push(mesh);
  });

  const mouse = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  window.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  new ResizeObserver(() => {
    const w = document.getElementById('hero').offsetWidth;
    const h = document.getElementById('hero').offsetHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }).observe(document.getElementById('hero'));

  const clock = new THREE.Clock();
  (function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    target.x += (mouse.x - target.x) * 0.05;
    target.y += (mouse.y - target.y) * 0.05;

    logoMeshes.forEach((mesh, i) => {
      const d = mesh.userData;
      mesh.position.y = d.baseY + Math.sin(t * d.floatSpeed + d.floatOffset) * 0.22;
      mesh.position.x = d.baseX + target.x * (0.06 + i * 0.010);
      mesh.rotation.z = d.rotBase + Math.sin(t * 0.35 + d.floatOffset) * 0.055;
      mesh.rotation.y = target.x * 0.10;
      if (t > d.fadeDelay) mesh.material.opacity = Math.min(mesh.material.opacity + 0.016, d.targetOpacity);
    });

    shapeMeshes.forEach(mesh => {
      const d = mesh.userData;
      mesh.rotation.x += d.rotSpeed.x;
      mesh.rotation.y += d.rotSpeed.y;
      mesh.position.y = d.baseY + Math.sin(t * d.floatSpeed + d.floatOffset) * 0.20;
      mesh.position.x = d.baseX + target.x * d.parallax;
    });

    renderer.render(scene, camera);
  })();
}

/* ===========================
   SCENE 2 — PERSONNAGE GLB/GLTF
   Charge un modèle 3D externe (ReadyPlayerMe, Blender, etc.)
   Fichier attendu : /models/avatar.glb
=========================== */
function initAboutScene() {
  const canvas = document.getElementById('about-canvas');
  if (!canvas) return;

  const parent = canvas.parentElement;
  const W = parent.offsetWidth || 400;
  const H = parent.offsetHeight || 420;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = false;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
  camera.position.set(0, 1.4, 3.8);
  camera.lookAt(0, 1.0, 0);

  // ── Éclairage ──
  // Ambiant doux pour la base
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  // Lumière principale frontale
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
  keyLight.position.set(1.5, 3, 2.5);
  scene.add(keyLight);
  // Fill light côté gauche
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.35);
  fillLight.position.set(-2, 1, 1);
  scene.add(fillLight);
  // Rim light derrière pour le contour
  const rimLight = new THREE.DirectionalLight(0xffffff, 0.25);
  rimLight.position.set(0, 2, -3);
  scene.add(rimLight);

  // ── Loader GLTF ──
  // GLTFLoader est dans les exemples Three.js r128
  // On le charge via CDN dans index.html (voir instructions)
  const loader = new THREE.GLTFLoader();

  let model = null;
  let mixer = null; // pour les animations si le modèle en a

  // Placeholder low-poly pendant le chargement
  const placeholder = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.4, 1),
    new THREE.MeshBasicMaterial({ color: 0x0a0a0a, wireframe: true, transparent: true, opacity: 0.25 })
  );
  placeholder.position.set(0, 1.2, 0);
  scene.add(placeholder);

  loader.load(
    './models/avatar.glb',  // ← chemin vers ton fichier GLB

    // onLoad
    (gltf) => {
      model = gltf.scene;

      // ── Style monochrome : forcer toutes les matériaux en gris ──
      model.traverse(node => {
        if (node.isMesh) {
          // Garder la géométrie, remplacer le matériau par un MeshStandardMaterial monochrome
          const oldMat = node.material;
          const isTransparent = oldMat.transparent && oldMat.opacity < 0.99;


          // Zones spéciales : cheveux → noir, yeux → noir
          const name = node.name.toLowerCase();
          if (name.includes('hair') || name.includes('hair') || name.includes('eyebrow')) {
            node.material.color.set(0x0a0a0a);
          }
          if (name.includes('eye') && !name.includes('brow')) {
            node.material.color.set(0x0a0a0a);
          }
          if (name.includes('teeth') || name.includes('tooth')) {
            node.material.color.set(0xf0ece6);
          }
          if (name.includes('outfit') || name.includes('shirt') || name.includes('top') || name.includes('cloth')) {
            node.material.color.set(0x0a0a0a);
            node.material.roughness = 0.9;
          }
        }
      });

      // ── Centrer et scaler le modèle ──
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2.2 / maxDim;   // normalise à ~2.2 unités de haut
      model.scale.setScalar(scale);

      // Recentrer sur l'origine
      box.setFromObject(model);
      const center = new THREE.Vector3();
      box.getCenter(center);
      model.position.sub(center);
      model.position.y += size.y * scale * 0.5; // remonter légèrement

      // ── Animations (si présentes dans le GLB) ──
      if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(model);
        // Joue la première animation en boucle (souvent l'idle)
        const idleClip = THREE.AnimationClip.findByName(gltf.animations, 'idle')
          || gltf.animations[0];
        const action = mixer.clipAction(idleClip);
        action.play();
      }

      // Supprimer le placeholder et ajouter le vrai modèle
      scene.remove(placeholder);
      scene.add(model);
    },

    // onProgress
    (xhr) => {
      const pct = Math.round((xhr.loaded / xhr.total) * 100);
      // Spinner de chargement via opacité du placeholder
      placeholder.material.opacity = 0.1 + (pct / 100) * 0.2;
    },

    // onError
    (err) => {
      console.warn('[Avatar] Modèle GLB non trouvé — placeholder actif.', err);
      // On garde le placeholder icosaèdre en cas d'erreur
      placeholder.material.wireframe = true;
      placeholder.material.opacity = 0.3;
    }
  );

  // ── Souris ──
  const mouse = { x: 0, y: 0 };
  const tgt   = { x: 0, y: 0 };
  document.getElementById('about').addEventListener('mousemove', e => {
    const r = e.currentTarget.getBoundingClientRect();
    mouse.x =  ((e.clientX - r.left) / r.width  - 0.5) * 2;
    mouse.y = -((e.clientY - r.top)  / r.height - 0.5) * 2;
  });

  new ResizeObserver(() => {
    const w = parent.offsetWidth, h = parent.offsetHeight;
    renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
  }).observe(parent);

  const clock = new THREE.Clock();
  (function animate() {
    requestAnimationFrame(animate);
    const dt = clock.getDelta();
    const t  = clock.elapsedTime;

    tgt.x += (mouse.x - tgt.x) * 0.07;
    tgt.y += (mouse.y - tgt.y) * 0.07;

    // Rotation douce du modèle / placeholder
    const target = model || placeholder;
    target.rotation.y = Math.sin(t * 0.25) * 0.12 + tgt.x * 0.35;
    target.rotation.x = tgt.y * 0.08;
    if (!model) {
      placeholder.position.y = 1.2 + Math.sin(t * 0.8) * 0.06;
      placeholder.rotation.x += 0.005;
    } else {
      model.position.y += Math.sin(t * 0.7) * 0.0004; // respiration
    }

    // Avancer les animations
    if (mixer) mixer.update(dt);

    renderer.render(scene, camera);
  })();
}

/* ===========================
   SCENE 3 — CONTACT GRID
=========================== */
function initContactScene() {
  const canvas = document.getElementById('contact-canvas');
  if (!canvas) return;

  const parent = canvas.parentElement;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(parent.offsetWidth, parent.offsetHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, parent.offsetWidth / parent.offsetHeight, 0.1, 100);
  camera.position.set(0, 3, 6);
  camera.lookAt(0, 0, 0);

  const ROWS = 22, COLS = 32, spacing = 0.5;
  const pts = new Float32Array(ROWS * COLS * 3);
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const i = (r * COLS + c) * 3;
    pts[i] = (c - COLS / 2) * spacing;
    pts[i+1] = 0;
    pts[i+2] = (r - ROWS / 2) * spacing;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pts, 3));
  const grid = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.04, transparent: true, opacity: 0.55 }));
  scene.add(grid);

  const mouse = { x: 0, y: 0 };
  document.getElementById('contact').addEventListener('mousemove', e => {
    const r = e.currentTarget.getBoundingClientRect();
    mouse.x = (e.clientX - r.left) / r.width;
    mouse.y = (e.clientY - r.top)  / r.height;
  });

  new ResizeObserver(() => {
    renderer.setSize(parent.offsetWidth, parent.offsetHeight);
    camera.aspect = parent.offsetWidth / parent.offsetHeight;
    camera.updateProjectionMatrix();
  }).observe(parent);

  const clock = new THREE.Clock();
  (function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    const pos = geo.attributes.position;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c;
      pos.setY(i, Math.sin(pos.getX(i) * 0.8 + t * 1.2) * Math.cos(pos.getZ(i) * 0.8 + t * 0.9) * 0.35 + mouse.x * 0.3 - mouse.y * 0.2);
    }
    pos.needsUpdate = true;
    grid.rotation.y = t * 0.04;
    renderer.render(scene, camera);
  })();
}

/* ===========================
   INIT
=========================== */
document.addEventListener('DOMContentLoaded', () => {
  initHeroScene();
  initAboutScene();
  initContactScene();
});