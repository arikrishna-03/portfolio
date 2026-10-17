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
function createRoundedCornerAlphaMap(width = 540, height = 690, radius = 32) {
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
  canvas.height = 1380; // Natural 4:5 vertical poster length
  const ctx = canvas.getContext('2d');

  // Initial dark placeholder while image loads
  ctx.fillStyle = '#0d0809';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = item.image;

  img.onload = () => {
    // 1. Draw subtle ambient bleed in background
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(8, 4, 6, 0.78)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw base artwork in its PROPER FULL LENGTH without cropping height:
    const scale = Math.min(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    const drawW = img.naturalWidth * scale;
    const drawH = img.naturalHeight * scale;
    const drawX = (canvas.width - drawW) / 2;
    const drawY = (canvas.height - drawH) / 2;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    // 3. Subtle bottom edge gradient for sleek typography contrast
    const grad = ctx.createLinearGradient(0, 1160, 0, canvas.height);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(0.5, 'rgba(6, 3, 5, 0.45)');
    grad.addColorStop(1, 'rgba(5, 2, 4, 0.88)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 1160, canvas.width, canvas.height - 1160);

    // 4. Category Tag
    ctx.font = '700 16px "DM Sans", -apple-system, sans-serif';
    ctx.letterSpacing = '2.5px';
    ctx.fillStyle = 'rgba(247, 240, 151, 0.9)'; // Brand warm accent
    ctx.fillText(item.category, 48, 1260);

    // 5. Main Title
    ctx.font = 'bold 40px "Syne", "Space Grotesk", sans-serif';
    ctx.letterSpacing = '-0.5px';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(item.title, 48, 1308);

    // 6. Subtitle
    ctx.font = '500 17px "DM Sans", sans-serif';
    ctx.letterSpacing = '0.5px';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
    ctx.fillText(item.subtitle, 48, 1342);

    // 7. Circular Action Button on Bottom Right
    const btnX = canvas.width - 48 - 28;
    const btnY = 1308;
    const btnR = 28;

    ctx.save();
    ctx.beginPath();
    ctx.arc(btnX, btnY, btnR, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(8, 5, 7, 0.88)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.stroke();

    // Arrow icon
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(btnX - 8, btnY);
    ctx.lineTo(btnX + 8, btnY);
    ctx.moveTo(btnX + 2, btnY - 6);
    ctx.lineTo(btnX + 8, btnY);
    ctx.lineTo(btnX + 2, btnY + 6);
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
  const section = document.getElementById('featured-works');

  // --- THREE.JS SCENE SETUP ---
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0d0809);
  scene.fog = new THREE.FogExp2(0x0d0809, 0.024);

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
  camera.position.set(0, 0, isMobile ? 7.6 : 5.85);
  camera.lookAt(0, 0, 0);

  // --- LIGHTING ---
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.05);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xfff6ea, 2.0);
  mainLight.position.set(4, 7, 7);
  scene.add(mainLight);

  const rimLight = new THREE.DirectionalLight(0x7090ff, 0.65);
  rimLight.position.set(-5, -3, 4);
  scene.add(rimLight);

  // --- VERTICAL 3D CYLINDRICAL CAROUSEL GEOMETRY ---
  const N = graphicDesignProjects.length;
  const radius = 6.4;
  const deltaTheta = (Math.PI * 2) / N;

  const cardWidth = 2.62;
  const cardHeight = 3.35;

  // Create vertically curved plane geometry: width=2.62, height=3.35, curved along vertical Y axis
  const basePlane = new THREE.PlaneGeometry(cardWidth, cardHeight, 18, 36);
  const posAttr = basePlane.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const y = posAttr.getY(i);
    // Bend in Z along vertical cylinder radius
    const z = radius * (Math.cos(y / radius) - 1);
    posAttr.setZ(i, z);
  }
  basePlane.computeVertexNormals();

  const alphaMap = createRoundedCornerAlphaMap(540, 690, 32);

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
    // Position on vertical cylinder along Y-Z axis
    mesh.position.set(0, Math.sin(phi) * radius, Math.cos(phi) * radius);
    mesh.rotation.x = -phi;
    mesh.userData = { index, item };

    carouselGroup.add(mesh);
    cardMeshes.push(mesh);
  });

  // --- INTERACTION & SCROLL STATE ---
  let currentRotation = 0;
  let targetRotation = 0;
  let isDragging = false;
  let hasDragged = false;
  let startY = 0;
  let lastY = 0;
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

  // Calculate scroll progress through the pinned 420vh runway
  function getScrollProgress() {
    if (!section) return 0;
    const rect = section.getBoundingClientRect();
    const maxScroll = section.offsetHeight - window.innerHeight;
    if (maxScroll <= 0) return 0;
    const current = -rect.top;
    return Math.max(0, Math.min(1, current / maxScroll));
  }

  function syncScrollToTarget() {
    const progress = getScrollProgress();
    // Scroll progress from 0 to 1 smoothly rotates through all N cards
    targetRotation = -progress * (N - 1) * deltaTheta;
  }

  window.addEventListener('scroll', syncScrollToTarget, { passive: true });
  syncScrollToTarget();

  // --- MOUSE & TOUCH VERTICAL DRAG HANDLERS ---
  function onPointerDown(e) {
    isDragging = true;
    hasDragged = false;
    startY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    lastY = startY;
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

    const deltaY = clientY - lastY;
    if (Math.abs(clientY - startY) > 6) {
      hasDragged = true;
    }

    // Dragging vertically smoothly adjusts page scroll in the runway
    if (section) {
      window.scrollBy({
        top: -deltaY * 2.2,
        behavior: 'instant'
      });
      syncScrollToTarget();
    }
    lastY = clientY;
  }

  function onPointerUp(e) {
    if (!isDragging) return;
    isDragging = false;
    container.style.cursor = 'grab';

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

        if (clickedIndex === activeIndex) {
          openArtworkLightbox(clickedIndex);
        } else {
          scrollToCardIndex(clickedIndex);
        }
      }
    }
  }

  function scrollToCardIndex(index) {
    if (!section) return;
    const maxScroll = section.offsetHeight - window.innerHeight;
    const targetScrollTop = section.offsetTop + (index / (N - 1)) * maxScroll;
    window.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth'
    });
  }

  // Prev / Next button actions (step vertically)
  function stepCard(direction) {
    if (!section) return;
    const maxScroll = section.offsetHeight - window.innerHeight;
    const currentStep = Math.round(getScrollProgress() * (N - 1));
    const nextStep = Math.max(0, Math.min(N - 1, currentStep + direction));
    const targetScrollTop = section.offsetTop + (nextStep / (N - 1)) * maxScroll;
    window.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth'
    });
  }

  btnPrev?.addEventListener('click', () => stepCard(-1));
  btnNext?.addEventListener('click', () => stepCard(1));

  btnViewModal?.addEventListener('click', () => {
    openArtworkLightbox(activeIndex);
  });

  // Attach stage events
  container.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  container.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp, { passive: true });

  // --- RESIZE HANDLER ---
  function handleResize() {
    if (!container || !canvas) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.position.z = w < 768 ? 7.6 : 5.85;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    syncScrollToTarget();
  }
  window.addEventListener('resize', handleResize);

  // --- ANIMATION LOOP ---
  function animate() {
    animId = requestAnimationFrame(animate);

    // Smooth damping / interpolation towards targetRotation
    currentRotation += (targetRotation - currentRotation) * 0.088;
    carouselGroup.rotation.x = currentRotation;

    // Detect currently front-facing card (closest to center Y = 0)
    const normalizedIndex = Math.max(
      0,
      Math.min(N - 1, Math.round(-currentRotation / deltaTheta))
    );
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
    window.removeEventListener('scroll', syncScrollToTarget);
    window.removeEventListener('resize', handleResize);
    container.removeEventListener('mousedown', onPointerDown);
    window.removeEventListener('mousemove', onPointerMove);
    window.removeEventListener('mouseup', onPointerUp);
    container.removeEventListener('touchstart', onPointerDown);
    window.removeEventListener('touchmove', onPointerMove);
    window.removeEventListener('touchend', onPointerUp);
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
