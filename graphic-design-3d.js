import * as THREE from 'three';

export const graphicDesignProjects = [
  {
    id: 'rolex',
    title: 'ROLEX OYSTER',
    subtitle: 'Luxury Horology & Precision Campaign',
    category: 'BRAND IDENTITY // ADVERTISING',
    year: '2026',
    client: 'Rolex Luxury Swiss Concept',
    image: './images/graphic design/ROLEX.jpg',
    description:
      'End-to-end luxury brand campaign featuring precision timepiece art direction, architectural layout hierarchy, and high-contrast macro rendering for Swiss horology.',
    tags: ['Branding', 'Art Direction', 'Typography', 'Swiss Design'],
  },
  {
    id: 'nike',
    title: 'NIKE AIR SYSTEM',
    subtitle: 'Kinetic Motion & Footwear Architecture',
    category: 'EDITORIAL // CAMPAIGN',
    year: '2026',
    client: 'Nike Sportswear Concept',
    image: './images/graphic design/NIKE  2.jpg',
    description:
      'High-energy typographical poster and dynamic composite lighting exploring kinetic athletic movement and futuristic footwear engineering.',
    tags: ['Editorial', 'Poster Art', 'Kinetic Typography', 'Brand Campaign'],
  },
  {
    id: 'cr7',
    title: 'CR7 ATHLETIC',
    subtitle: 'Personal Brand & Dynamic Identity',
    category: 'SPORTS VISUALS // KEY ART',
    year: '2025',
    client: 'Cristiano Ronaldo Athletic Concept',
    image: './images/graphic design/cr7.jpg',
    description:
      'Athletic personal branding combining high-contrast studio rim lighting, bold numbering, and championship aesthetic for a global sports icon.',
    tags: ['Sports Branding', 'Key Art', 'Visual Identity', 'Composite Lighting'],
  },
  {
    id: 'hamilton',
    title: 'LEWIS HAMILTON',
    subtitle: 'Formula 1 High-Octane Key Art',
    category: 'TYPOGRAPHY // MOTORSPORT',
    year: '2025',
    client: 'F1 Championship Tribute',
    image: './images/graphic design/LEWIS HAMILTON.jpg',
    description:
      'Experimental typographic poster fusing brutalist Swiss layout principles with Formula 1 motorsport velocity and bold polychromatic color grading.',
    tags: ['Motorsport', 'Swiss Style', 'Editorial', 'Poster Art'],
  },
  {
    id: 'virat',
    title: 'VIRAT KOHLI',
    subtitle: 'Iconic Athletic Persona & Brand System',
    category: 'KEY ART // SPORTS BRANDING',
    year: '2025',
    client: 'VK18 Cricket Brand Concept',
    image: './images/graphic design/virat.png',
    description:
      'Striking portrait composite celebrating intensity, mastery, and visual dominance with sharp geometric framing and national athletic pride.',
    tags: ['Portraiture', 'Sports Identity', 'Key Art', 'Brand Strategy'],
  },
  {
    id: 'redesign',
    title: 'EDITORIAL REDESIGN',
    subtitle: 'Modern Layout & Digital Typography System',
    category: 'BRAND SYSTEM // PUBLICATION',
    year: '2026',
    client: 'Editorial Redesign System',
    image: './images/graphic design/redesign.png',
    description:
      'Comprehensive grid system overhaul with asymmetric whitespace, macro headlines, and modular content blocks designed for modern editorial media.',
    tags: ['Typography', 'Grid System', 'Editorial', 'Magazine Design'],
  },
  {
    id: 'page1',
    title: 'VISUAL JOURNAL 01',
    subtitle: 'Minimalist Grid Systems & Hierarchy',
    category: 'EDITORIAL // ART DIRECTION',
    year: '2025',
    client: 'Visual Systems Monograph',
    image: './images/graphic design/page 1.png',
    description:
      'Clean typographic rhythm and architectural grid pacing designed for contemporary publications and visual identity manuals.',
    tags: ['Minimalism', 'Grid System', 'Art Direction', 'Editorial'],
  },
  {
    id: 'page2',
    title: 'VISUAL JOURNAL 02',
    subtitle: 'Monochrome Spreads & Editorial Rhythms',
    category: 'EDITORIAL // ART DIRECTION',
    year: '2025',
    client: 'Visual Systems Monograph',
    image: './images/graphic design/PAGE 2.png',
    description:
      'Exploration of high contrast, negative space, and modern editorial storytelling in print and digital mediums.',
    tags: ['Monochrome', 'Typography', 'Spread Layout', 'Brand Guidelines'],
  },
  {
    id: 'page3',
    title: 'VISUAL JOURNAL 03',
    subtitle: 'Modernist Print Layout & Brand Guidelines',
    category: 'EDITORIAL // ART DIRECTION',
    year: '2026',
    client: 'Visual Systems Monograph',
    image: './images/graphic design/page 3.png',
    description:
      'Systematic visual identity manual with precise typographic scales, proportion matrices, and multi-column architectural rhythm.',
    tags: ['Brand Guidelines', 'Modernism', 'Typography', 'Print Systems'],
  },
];

/**
 * Creates a rounded rectangle alpha mask texture to give 3D curved cards anti-aliased rounded corners
 */
function createRoundedCornerAlphaMap(width = 512, height = 640, radius = 40) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(0, 0, width, height, radius);
  } else {
    // Fallback manual rounded rectangle
    ctx.moveTo(radius, 0);
    ctx.lineTo(width - radius, 0);
    ctx.quadraticCurveTo(width, 0, width, radius);
    ctx.lineTo(width, height - radius);
    ctx.quadraticCurveTo(width, height, width - radius, height);
    ctx.lineTo(radius, height);
    ctx.quadraticCurveTo(0, height, 0, height - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
  }
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Creates high-fidelity canvas texture combining loaded design artwork, typographic hierarchy, and button
 */
function createCardTexture(item, onUpdate) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');

  // Initial dark placeholder while image loads
  ctx.fillStyle = '#110b0e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.fillRect(30, 30, canvas.width - 60, canvas.height - 60);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = item.image;

  img.onload = () => {
    // 1. Draw base artwork centered with cover scaling
    const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    const drawW = img.naturalWidth * scale;
    const drawH = img.naturalHeight * scale;
    const drawX = (canvas.width - drawW) / 2;
    const drawY = (canvas.height - drawH) / 2;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    // 2. Subtle luxury dark gradient overlay at bottom for maximum typographic contrast
    const grad = ctx.createLinearGradient(0, 850, 0, canvas.height);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(0.35, 'rgba(8, 4, 6, 0.45)');
    grad.addColorStop(0.7, 'rgba(6, 3, 5, 0.85)');
    grad.addColorStop(1, 'rgba(5, 2, 4, 0.94)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 850, canvas.width, canvas.height - 850);

    // 3. Subtle top ambient vignette
    const topGrad = ctx.createLinearGradient(0, 0, 0, 180);
    topGrad.addColorStop(0, 'rgba(0, 0, 0, 0.35)');
    topGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, canvas.width, 180);

    // 4. Category Tag
    ctx.font = '700 20px "DM Sans", -apple-system, sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillStyle = 'rgba(247, 240, 151, 0.9)'; // Brand warm accent
    ctx.fillText(item.category, 64, 1180);

    // 5. Main Title (bold & prominent matching Jesper Landberg reference)
    ctx.font = 'bold 52px "Syne", "Space Grotesk", sans-serif';
    ctx.letterSpacing = '-0.5px';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(item.title, 64, 1240);

    // 6. Subtitle
    ctx.font = '500 22px "DM Sans", sans-serif';
    ctx.letterSpacing = '0.5px';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
    ctx.fillText(item.subtitle, 64, 1282);

    // 7. Circular Action Button on Bottom Right
    const btnX = canvas.width - 64 - 36;
    const btnY = 1240;
    const btnR = 34;

    ctx.save();
    ctx.beginPath();
    ctx.arc(btnX, btnY, btnR, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(8, 5, 7, 0.9)';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.stroke();

    // Arrow icon
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(btnX - 10, btnY);
    ctx.lineTo(btnX + 10, btnY);
    ctx.moveTo(btnX + 3, btnY - 7);
    ctx.lineTo(btnX + 10, btnY);
    ctx.lineTo(btnX + 3, btnY + 7);
    ctx.stroke();
    ctx.restore();

    texture.needsUpdate = true;
    if (onUpdate) onUpdate();
  };

  return texture;
}

/**
 * Initializes the 3D Curved Cylindrical Carousel for Graphic Design "Featured Brands"
 */
export function initGraphicDesign3D() {
  const container = document.getElementById('ds-3d-gallery-stage');
  const canvas = document.getElementById('ds-3d-canvas');
  if (!container || !canvas) return null;

  // Cleanup existing instance if any
  if (container.__destroyDS3D) {
    container.__destroyDS3D();
  }

  const hudCount = document.getElementById('ds-hud-count');
  const hudTitle = document.getElementById('ds-hud-title');
  const hudCategory = document.getElementById('ds-hud-category');
  const btnPrev = document.getElementById('ds-carousel-prev');
  const btnNext = document.getElementById('ds-carousel-next');
  const btnViewModal = document.getElementById('ds-hud-view-btn');

  // --- THREE.JS SCENE SETUP ---
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x060305);
  scene.fog = new THREE.FogExp2(0x060305, 0.022);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const isMobile = container.clientWidth < 768;
  const camera = new THREE.PerspectiveCamera(
    42,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0.1, isMobile ? 8.2 : 6.35);
  camera.lookAt(0, -0.05, 0);

  // --- LIGHTING ---
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xfff6ea, 2.0);
  mainLight.position.set(5, 7, 7);
  scene.add(mainLight);

  const rimLight = new THREE.DirectionalLight(0x7090ff, 0.7);
  rimLight.position.set(-6, -2, 4);
  scene.add(rimLight);

  // --- 3D PERSPECTIVE WIREFRAME GRID FLOOR (Matching Jesper Landberg Reference) ---
  const gridHelper = new THREE.GridHelper(80, 80, 0x5a1820, 0x16080d);
  gridHelper.position.set(0, -2.42, 0);
  scene.add(gridHelper);

  // --- CYLINDRICAL CURVED CAROUSEL GEOMETRY ---
  const N = graphicDesignProjects.length;
  const radius = 6.4;
  const deltaTheta = (Math.PI * 2) / N;

  const cardWidth = 3.35;
  const cardHeight = 4.25;

  // Create curved plane geometry: width=3.35, height=4.25, 36 horizontal segments to bend smoothly
  const basePlane = new THREE.PlaneGeometry(cardWidth, cardHeight, 36, 18);
  const posAttr = basePlane.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    // Bend in Z along cylinder radius
    const z = radius * (Math.cos(x / radius) - 1);
    posAttr.setZ(i, z);
  }
  basePlane.computeVertexNormals();

  const alphaMap = createRoundedCornerAlphaMap(512, 640, 42);

  const carouselGroup = new THREE.Group();
  carouselGroup.position.set(0, 0, -radius);
  scene.add(carouselGroup);

  const cardMeshes = [];

  graphicDesignProjects.forEach((item, index) => {
    const texture = createCardTexture(item, () => {
      renderer.render(scene, camera);
    });

    const material = new THREE.MeshStandardMaterial({
      map: texture,
      alphaMap: alphaMap,
      transparent: true,
      alphaTest: 0.01,
      roughness: 0.28,
      metalness: 0.08,
      side: THREE.FrontSide,
    });

    const mesh = new THREE.Mesh(basePlane, material);

    const phi = index * deltaTheta;
    mesh.position.set(Math.sin(phi) * radius, 0, Math.cos(phi) * radius);
    mesh.rotation.y = phi;
    mesh.userData = { index, item };

    carouselGroup.add(mesh);
    cardMeshes.push(mesh);
  });

  // --- INTERACTION & PHYSICS STATE ---
  let currentRotation = 0;
  let targetRotation = 0;
  let velocity = 0;
  let isDragging = false;
  let hasDragged = false;
  let startX = 0;
  let startY = 0;
  let lastX = 0;
  let lastTime = performance.now();
  let isHovered = false;
  let autoDrift = true;
  let activeIndex = 0;
  let animId = null;

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function updateHUD(index) {
    if (hudCount) hudCount.textContent = `${String(index + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')}`;
    const project = graphicDesignProjects[index];
    if (hudTitle && project) hudTitle.textContent = project.title;
    if (hudCategory && project) hudCategory.textContent = project.subtitle;
  }
  updateHUD(0);

  // --- MOUSE & TOUCH EVENT HANDLERS ---
  function onPointerDown(e) {
    isDragging = true;
    hasDragged = false;
    autoDrift = false;
    startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    startY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    lastX = startX;
    velocity = 0;
    lastTime = performance.now();
    container.style.cursor = 'grabbing';
  }

  function onPointerMove(e) {
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

    // Raycast hover effect when not dragging
    if (!isDragging) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(cardMeshes);
      if (intersects.length > 0) {
        container.style.cursor = 'pointer';
      } else {
        container.style.cursor = 'grab';
      }
      return;
    }

    const deltaX = clientX - lastX;
    const deltaY = clientY - startY;

    if (Math.abs(clientX - startX) > 6 || Math.abs(deltaY) > 6) {
      hasDragged = true;
    }

    const now = performance.now();
    const dt = Math.max(now - lastTime, 1);
    velocity = (deltaX / dt) * 0.0035;
    lastTime = now;
    lastX = clientX;

    const rotSensitivity = (Math.PI * 2) / (window.innerWidth * 1.35);
    targetRotation += deltaX * rotSensitivity;
  }

  function onPointerUp(e) {
    if (!isDragging) return;
    isDragging = false;
    container.style.cursor = 'grab';

    // Apply flick inertia
    targetRotation += velocity * 45;

    // Click on card if didn't drag
    if (!hasDragged) {
      const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX) || 0;
      const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY) || 0;
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(cardMeshes);
      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        const clickedIndex = clickedMesh.userData.index;

        // Check if clicked card is already active/centered
        const currentActive = ((Math.round(-targetRotation / deltaTheta) % N) + N) % N;
        if (clickedIndex === currentActive) {
          openArtworkLightbox(clickedIndex);
        } else {
          rotateToIndex(clickedIndex);
        }
      }
    }
  }

  function rotateToIndex(index) {
    autoDrift = false;
    const targetAngle = -index * deltaTheta;
    // Find closest rotation angle to current targetRotation
    const diff = (targetAngle - targetRotation) % (Math.PI * 2);
    let normalizedDiff = diff;
    if (normalizedDiff > Math.PI) normalizedDiff -= Math.PI * 2;
    if (normalizedDiff < -Math.PI) normalizedDiff += Math.PI * 2;
    targetRotation += normalizedDiff;
  }

  function onWheel(e) {
    // If wheeling inside stage, rotate carousel smoothly
    const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
    targetRotation -= delta * 0.0009;
    autoDrift = false;
  }

  // Prev / Next button actions
  function stepCarousel(direction) {
    autoDrift = false;
    targetRotation += direction * deltaTheta;
  }

  btnPrev?.addEventListener('click', () => stepCarousel(1));
  btnNext?.addEventListener('click', () => stepCarousel(-1));

  btnViewModal?.addEventListener('click', () => {
    const currentActive = ((Math.round(-targetRotation / deltaTheta) % N) + N) % N;
    openArtworkLightbox(currentActive);
  });

  // Attach stage events
  container.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  container.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp, { passive: true });

  container.addEventListener('wheel', onWheel, { passive: true });

  container.addEventListener('mouseenter', () => {
    isHovered = true;
  });
  container.addEventListener('mouseleave', () => {
    isHovered = false;
  });

  // --- RESIZE HANDLER ---
  function handleResize() {
    if (!container || !canvas) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.position.z = w < 768 ? 8.2 : 6.35;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', handleResize);

  // --- ANIMATION LOOP ---
  function animate() {
    animId = requestAnimationFrame(animate);

    // Idle gentle auto-drift when not interacting
    if (autoDrift && !isDragging && !isHovered) {
      targetRotation -= 0.0011;
    }

    // Smooth damping / interpolation towards targetRotation
    currentRotation += (targetRotation - currentRotation) * 0.085;
    carouselGroup.rotation.y = currentRotation;

    // Detect currently front-facing card
    const normalizedIndex = ((Math.round(-currentRotation / deltaTheta) % N) + N) % N;
    if (normalizedIndex !== activeIndex) {
      activeIndex = normalizedIndex;
      updateHUD(activeIndex);
    }

    renderer.render(scene, camera);
  }
  animate();

  // Cleanup handler
  container.__destroyDS3D = () => {
    if (animId) cancelAnimationFrame(animId);
    window.removeEventListener('resize', handleResize);
    container.removeEventListener('mousedown', onPointerDown);
    window.removeEventListener('mousemove', onPointerMove);
    window.removeEventListener('mouseup', onPointerUp);
    container.removeEventListener('touchstart', onPointerDown);
    window.removeEventListener('touchmove', onPointerMove);
    window.removeEventListener('touchend', onPointerUp);
    container.removeEventListener('wheel', onWheel);
    renderer.dispose();
  };

  return container.__destroyDS3D;
}

/**
 * High-Resolution Lightbox Modal to inspect the design piece with rich metadata
 */
export function openArtworkLightbox(index) {
  let modal = document.getElementById('ds-artwork-lightbox');
  if (!modal) {
    createArtworkLightboxDOM();
    modal = document.getElementById('ds-artwork-lightbox');
  }

  const project = graphicDesignProjects[index];
  if (!project || !modal) return;

  const imgEl = modal.querySelector('.ds-modal-img');
  const countEl = modal.querySelector('.ds-modal-count');
  const titleEl = modal.querySelector('.ds-modal-title');
  const subtitleEl = modal.querySelector('.ds-modal-subtitle');
  const descEl = modal.querySelector('.ds-modal-desc');
  const tagsEl = modal.querySelector('.ds-modal-tags');
  const clientEl = modal.querySelector('.ds-modal-client');
  const yearEl = modal.querySelector('.ds-modal-year');

  if (imgEl) {
    imgEl.src = project.image;
    imgEl.alt = project.title;
  }
  if (countEl) countEl.textContent = `${String(index + 1).padStart(2, '0')} / ${String(graphicDesignProjects.length).padStart(2, '0')}`;
  if (titleEl) titleEl.textContent = project.title;
  if (subtitleEl) subtitleEl.textContent = project.subtitle;
  if (descEl) descEl.textContent = project.description;
  if (clientEl) clientEl.textContent = project.client;
  if (yearEl) yearEl.textContent = project.year;

  if (tagsEl) {
    tagsEl.innerHTML = project.tags.map((t) => `<span class="ds-tag-pill">${t}</span>`).join('');
  }

  modal.setAttribute('data-current-index', index);
  modal.classList.add('lightbox-active');
  document.body.classList.add('lightbox-locked');
}

export function closeArtworkLightbox() {
  const modal = document.getElementById('ds-artwork-lightbox');
  if (modal) {
    modal.classList.remove('lightbox-active');
    document.body.classList.remove('lightbox-locked');
  }
}

function createArtworkLightboxDOM() {
  const div = document.createElement('div');
  div.id = 'ds-artwork-lightbox';
  div.className = 'ds-artwork-lightbox';
  div.innerHTML = `
    <div class="ds-lightbox-backdrop" id="ds-lightbox-backdrop"></div>
    <div class="ds-lightbox-container">
      <button class="ds-lightbox-close" id="ds-lightbox-close" aria-label="Close modal">✕</button>

      <div class="ds-lightbox-content">
        <!-- High-Res Artwork Viewport -->
        <div class="ds-lightbox-img-wrap">
          <img class="ds-modal-img" src="" alt="" />
        </div>

        <!-- Project Specifications & Metadata -->
        <div class="ds-lightbox-meta">
          <div class="ds-modal-count-row">
            <span class="ds-modal-count">01 / 09</span>
            <span class="ds-modal-year">2026</span>
          </div>

          <h2 class="ds-modal-title">TITLE</h2>
          <div class="ds-modal-subtitle">SUBTITLE</div>

          <div class="ds-modal-divider"></div>

          <div class="ds-modal-desc-heading">PROJECT OVERVIEW</div>
          <p class="ds-modal-desc"></p>

          <div class="ds-modal-specs">
            <div class="ds-spec-item">
              <span class="ds-spec-label">CLIENT / CONCEPT</span>
              <span class="ds-spec-val ds-modal-client"></span>
            </div>
            <div class="ds-spec-item">
              <span class="ds-spec-label">MEDIUM</span>
              <span class="ds-spec-val">Large-Format Digital Print &amp; Key Art</span>
            </div>
          </div>

          <div class="ds-modal-tags"></div>

          <!-- Lightbox Step Controls -->
          <div class="ds-modal-controls">
            <button class="ds-modal-nav-btn" id="ds-modal-prev">‹ Previous</button>
            <button class="ds-modal-nav-btn" id="ds-modal-next">Next ›</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(div);

  document.getElementById('ds-lightbox-close')?.addEventListener('click', closeArtworkLightbox);
  document.getElementById('ds-lightbox-backdrop')?.addEventListener('click', closeArtworkLightbox);

  document.getElementById('ds-modal-prev')?.addEventListener('click', () => {
    const curIdx = parseInt(div.getAttribute('data-current-index') || '0', 10);
    const N = graphicDesignProjects.length;
    openArtworkLightbox((curIdx - 1 + N) % N);
  });

  document.getElementById('ds-modal-next')?.addEventListener('click', () => {
    const curIdx = parseInt(div.getAttribute('data-current-index') || '0', 10);
    const N = graphicDesignProjects.length;
    openArtworkLightbox((curIdx + 1) % N);
  });

  window.addEventListener('keydown', (e) => {
    if (!div.classList.contains('lightbox-active')) return;
    if (e.key === 'Escape') closeArtworkLightbox();
    if (e.key === 'ArrowLeft') {
      const curIdx = parseInt(div.getAttribute('data-current-index') || '0', 10);
      const N = graphicDesignProjects.length;
      openArtworkLightbox((curIdx - 1 + N) % N);
    }
    if (e.key === 'ArrowRight') {
      const curIdx = parseInt(div.getAttribute('data-current-index') || '0', 10);
      const N = graphicDesignProjects.length;
      openArtworkLightbox((curIdx + 1) % N);
    }
  });
}
