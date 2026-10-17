import * as THREE from 'three';

export const graphicDesignProjects = [
  {
    id: 'rolex',
    title: 'ROLEX OYSTER',
    subtitle: 'Luxury Horology & Precision Campaign',
    category: 'BRAND IDENTITY // ADVERTISING',
    year: '2026',
    client: 'Rolex Luxury Swiss Concept',
    image: './images/graphic design/web/ROLEX.jpg',
    fullImage: './images/graphic design/ROLEX.jpg',
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
    image: './images/graphic design/web/NIKE  2.jpg',
    fullImage: './images/graphic design/NIKE  2.jpg',
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
    image: './images/graphic design/web/cr7.jpg',
    fullImage: './images/graphic design/cr7.jpg',
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
    image: './images/graphic design/web/LEWIS HAMILTON.jpg',
    fullImage: './images/graphic design/LEWIS HAMILTON.jpg',
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
    image: './images/graphic design/web/virat.jpg',
    fullImage: './images/graphic design/virat.png',
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
    image: './images/graphic design/web/redesign.jpg',
    fullImage: './images/graphic design/redesign.png',
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
    image: './images/graphic design/web/page 1.jpg',
    fullImage: './images/graphic design/page 1.png',
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
    image: './images/graphic design/web/PAGE 2.jpg',
    fullImage: './images/graphic design/PAGE 2.png',
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
    image: './images/graphic design/web/page 3.jpg',
    fullImage: './images/graphic design/page 3.png',
    description:
      'Systematic visual identity manual with precise typographic scales, proportion matrices, and multi-column architectural rhythm.',
    tags: ['Brand Guidelines', 'Modernism', 'Typography', 'Print Systems'],
  },
];

/**
 * Creates a rounded rectangle alpha mask texture to give 3D curved cards anti-aliased rounded corners.
 * Uses a lightweight 256x328 canvas to minimize GPU texture memory on low-end hardware.
 */
function createRoundedCornerAlphaMap(width = 256, height = 328, radius = 18) {
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
  texture.generateMipmaps = false;
  return texture;
}

// Queue for staggering texture uploads across frames to ensure the main thread and cursor never freeze
const textureLoadQueue = [];
let isProcessingQueue = false;

function processNextTextureInQueue() {
  if (textureLoadQueue.length === 0) {
    isProcessingQueue = false;
    return;
  }
  isProcessingQueue = true;

  requestAnimationFrame(() => {
    const task = textureLoadQueue.shift();
    if (task) {
      task();
    }
    // Yield 25ms to browser main thread so mouse movement and cursor stay 100% fluid
    setTimeout(processNextTextureInQueue, 25);
  });
}

/**
 * Creates high-fidelity canvas texture combining loaded design artwork, typographic hierarchy, and button.
 * Scaled to 600x768 to save over 45% GPU memory and draw time on low-end devices.
 * Uses background img.decode() and a staggered queue to prevent main-thread stutter on page load.
 */
function createCardTexture(item, onUpdate, priority = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');

  // Initial dark placeholder while image loads
  ctx.fillStyle = '#0e090b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = item.image;

  const renderArtwork = () => {
    const task = () => {
      // 1. Draw subtle ambient bleed in background
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(8, 4, 6, 0.82)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw base artwork in its proper full length without cropping height:
      const scale = Math.min(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
      const drawW = img.naturalWidth * scale;
      const drawH = img.naturalHeight * scale;
      const drawX = (canvas.width - drawW) / 2;
      const drawY = (canvas.height - drawH) / 2;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      // 3. Subtle bottom edge gradient for sleek typography contrast
      const grad = ctx.createLinearGradient(0, 610, 0, canvas.height);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      grad.addColorStop(0.5, 'rgba(6, 3, 5, 0.65)');
      grad.addColorStop(1, 'rgba(5, 2, 4, 0.94)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 610, canvas.width, canvas.height - 610);

      // 4. Category Tag
      ctx.font = '700 11px "DM Sans", -apple-system, sans-serif';
      ctx.letterSpacing = '1.8px';
      ctx.fillStyle = 'rgba(247, 240, 151, 0.95)';
      ctx.fillText(item.category, 26, 686);

      // 5. Main Title
      ctx.font = 'bold 22px "Syne", "Space Grotesk", sans-serif';
      ctx.letterSpacing = '-0.4px';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(item.title, 26, 715);

      // 6. Subtitle
      ctx.font = '500 11px "DM Sans", sans-serif';
      ctx.letterSpacing = '0.4px';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
      ctx.fillText(item.subtitle, 26, 736);

      // 7. Circular Action Button on Bottom Right
      const btnX = canvas.width - 26 - 18;
      const btnY = 715;
      const btnR = 18;

      ctx.save();
      ctx.beginPath();
      ctx.arc(btnX, btnY, btnR, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(8, 5, 7, 0.88)';
      ctx.fill();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.stroke();

      // Arrow icon
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(btnX - 5, btnY);
      ctx.lineTo(btnX + 5, btnY);
      ctx.moveTo(btnX + 1, btnY - 4);
      ctx.lineTo(btnX + 5, btnY);
      ctx.lineTo(btnX + 1, btnY + 4);
      ctx.stroke();
      ctx.restore();

      texture.needsUpdate = true;
      if (onUpdate) onUpdate();
    };

    if (priority) {
      textureLoadQueue.unshift(task);
    } else {
      textureLoadQueue.push(task);
    }

    if (!isProcessingQueue) {
      processNextTextureInQueue();
    }
  };

  // Decode asynchronously off the main thread to ensure cursor never stutters
  if (typeof img.decode === 'function') {
    img.decode().then(renderArtwork).catch(() => {
      img.onload = renderArtwork;
    });
  } else {
    img.onload = renderArtwork;
  }

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
  // Low-end PC / hardware concurrency detection
  const isLowEnd =
    typeof navigator !== 'undefined' &&
    ((navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
      (navigator.deviceMemory && navigator.deviceMemory <= 4));

  // --- THREE.JS SCENE SETUP ---
  const scene = new THREE.Scene();
  scene.background = null;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isLowEnd,
    alpha: true,
    powerPreference: 'high-performance',
    stencil: false,
    depth: true,
    precision: isLowEnd ? 'mediump' : 'highp',
  });
  const targetDPR = isLowEnd ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.25);
  renderer.setPixelRatio(targetDPR);
  renderer.setSize(container.clientWidth, container.clientHeight);

  const isMobile = container.clientWidth < 768;
  const camera = new THREE.PerspectiveCamera(
    42,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, isMobile ? 7.6 : 5.85);
  camera.lookAt(0, 0, 0);

  // --- HORIZONTAL 3D CYLINDRICAL CAROUSEL GEOMETRY ---
  const N = graphicDesignProjects.length;
  const radius = 6.4;
  const deltaTheta = (Math.PI * 2) / N;

  const cardWidth = 2.65;
  const cardHeight = 3.40;

  // Optimized curved plane geometry: 16 horizontal segments bend smoothly along cylinder X axis. 1 vertical segment.
  const basePlane = new THREE.PlaneGeometry(cardWidth, cardHeight, 16, 1);
  const posAttr = basePlane.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    // Bend in Z along horizontal cylinder radius
    const z = radius * (Math.cos(x / radius) - 1);
    posAttr.setZ(i, z);
  }
  basePlane.computeVertexNormals();

  const alphaMap = createRoundedCornerAlphaMap(256, 328, 18);

  const carouselGroup = new THREE.Group();
  carouselGroup.position.set(0, 0, -radius);
  scene.add(carouselGroup);

  const cardMeshes = [];

  // Interaction & render state
  let currentRotation = 0;
  let targetRotation = 0;
  let velocity = 0;
  let isDragging = false;
  let hasDragged = false;
  let startX = 0;
  let lastX = 0;
  let lastTime = performance.now();
  let activeIndex = 0;
  let isSectionVisible = true;
  let animId = null;
  let hoverRaf = null;
  let wheelSnapTimer = null;
  let needsRender = true;

  function requestRender() {
    needsRender = true;
    if (!animId && isSectionVisible) {
      animate();
    }
  }

  graphicDesignProjects.forEach((item, index) => {
    const texture = createCardTexture(
      item,
      () => {
        requestRender();
      },
      index === 0 // Priority for front-facing initial card
    );

    // MeshBasicMaterial eliminates dynamic lighting calculations, saving massive GPU fill-rate on low-end systems
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      alphaMap: alphaMap,
      transparent: true,
      depthWrite: true,
      side: THREE.FrontSide,
    });

    const mesh = new THREE.Mesh(basePlane, material);

    const phi = index * deltaTheta;
    // Position on horizontal cylinder along X-Z axis
    mesh.position.set(Math.sin(phi) * radius, 0, Math.cos(phi) * radius);
    mesh.rotation.y = phi;
    mesh.userData = { index, item };

    carouselGroup.add(mesh);
    cardMeshes.push(mesh);
  });

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // Cached canvas bounding rect to eliminate DOM reflow on mousemove
  let cachedRect = null;
  function updateCachedRect() {
    if (canvas) cachedRect = canvas.getBoundingClientRect();
  }
  updateCachedRect();
  window.addEventListener('resize', updateCachedRect);
  window.addEventListener('scroll', updateCachedRect, { passive: true });

  function updateHUD(index) {
    if (hudCount) hudCount.textContent = `${String(index + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')}`;
    const project = graphicDesignProjects[index];
    if (hudTitle && project) hudTitle.textContent = project.title;
    if (hudCategory && project) hudCategory.textContent = project.subtitle;
  }
  updateHUD(0);

  // --- MOUSE & TOUCH HORIZONTAL DRAG HANDLERS ---
  function onPointerDown(e) {
    isDragging = true;
    hasDragged = false;
    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    startX = clientX;
    lastX = clientX;
    velocity = 0;
    lastTime = performance.now();
    container.style.cursor = 'grabbing';
    requestRender();
  }

  function onPointerMove(e) {
    if (!isDragging) return;

    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    const deltaX = clientX - lastX;
    if (Math.abs(clientX - startX) > 4) {
      hasDragged = true;
    }

    const now = performance.now();
    const dt = Math.max(now - lastTime, 8);
    const instantVel = (deltaX / dt) * 16;
    velocity = velocity * 0.4 + instantVel * 0.6;
    lastTime = now;
    lastX = clientX;

    // Direct, highly-responsive rotation during drag
    const rotSensitivity = Math.max(0.0034, (Math.PI * 2) / (window.innerWidth * 1.05));
    targetRotation += deltaX * rotSensitivity;
    currentRotation += (targetRotation - currentRotation) * 0.38;
    requestRender();
  }

  function onPointerUp(e) {
    if (!isDragging) return;
    isDragging = false;
    container.style.cursor = 'grab';

    if (hasDragged) {
      // Natural flick velocity momentum
      const rotSensitivity = Math.max(0.0034, (Math.PI * 2) / (window.innerWidth * 1.05));
      const fling = velocity * rotSensitivity * 7.5;
      targetRotation += fling;

      // Soft magnetic snap to closest card
      targetRotation = Math.round(targetRotation / deltaTheta) * deltaTheta;
    } else {
      // User clicked without dragging - raycast to select clicked card
      const clientX = e.clientX ?? (e.changedTouches && e.changedTouches[0]?.clientX) ?? 0;
      const clientY = e.clientY ?? (e.changedTouches && e.changedTouches[0]?.clientY) ?? 0;
      if (!cachedRect) updateCachedRect();
      mouse.x = ((clientX - cachedRect.left) / cachedRect.width) * 2 - 1;
      mouse.y = -((clientY - cachedRect.top) / cachedRect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(cardMeshes, false);
      if (intersects.length > 0) {
        const clickedIndex = intersects[0].object.userData.index;
        if (clickedIndex === activeIndex) {
          openArtworkLightbox(clickedIndex);
        } else {
          rotateToIndex(clickedIndex);
        }
      }
    }
    requestRender();
  }

  // Throttled container hover for cursor styling (zero lag, no window reflow)
  function onContainerHover(e) {
    if (isDragging) return;
    if (hoverRaf) return;

    hoverRaf = requestAnimationFrame(() => {
      hoverRaf = null;
      if (!cachedRect) updateCachedRect();
      mouse.x = ((e.clientX - cachedRect.left) / cachedRect.width) * 2 - 1;
      mouse.y = -((e.clientY - cachedRect.top) / cachedRect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(cardMeshes, false);
      container.style.cursor = intersects.length > 0 ? 'pointer' : 'grab';
    });
  }

  // Smoothly rotate shortest angular distance to target card index
  function rotateToIndex(index) {
    const desiredAngle = -index * deltaTheta;
    const diff = (desiredAngle - targetRotation) % (Math.PI * 2);
    let normalizedDiff = diff;
    if (normalizedDiff > Math.PI) normalizedDiff -= Math.PI * 2;
    if (normalizedDiff < -Math.PI) normalizedDiff += Math.PI * 2;
    targetRotation += normalizedDiff;
    requestRender();
  }

  // Prev / Next button actions (step horizontally)
  btnPrev?.addEventListener('click', () => {
    targetRotation += deltaTheta;
    requestRender();
  });
  btnNext?.addEventListener('click', () => {
    targetRotation -= deltaTheta;
    requestRender();
  });

  btnViewModal?.addEventListener('click', () => {
    openArtworkLightbox(activeIndex);
  });

  // Smooth horizontal wheel handler with debounced snap
  function onWheel(e) {
    const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey;
    if (isHorizontal) {
      const delta = e.shiftKey ? e.deltaY : e.deltaX;
      targetRotation -= delta * 0.0022;
      e.preventDefault();

      clearTimeout(wheelSnapTimer);
      wheelSnapTimer = setTimeout(() => {
        targetRotation = Math.round(targetRotation / deltaTheta) * deltaTheta;
        requestRender();
      }, 140);
      requestRender();
    }
  }

  // Attach stage events
  container.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);
  container.addEventListener('mousemove', onContainerHover, { passive: true });

  container.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp, { passive: true });

  container.addEventListener('wheel', onWheel, { passive: false });

  // --- RESIZE HANDLER ---
  function handleResize() {
    if (!container || !canvas) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.position.z = w < 768 ? 7.6 : 5.85;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    updateCachedRect();
    requestRender();
  }
  window.addEventListener('resize', handleResize);

  // Tab visibility change handler to prevent rendering when browser tab is inactive
  function handleVisibilityChange() {
    if (document.hidden) {
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    } else if (isSectionVisible) {
      requestRender();
    }
  }
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // --- INTERSECTION OBSERVER: PAUSE RENDERING WHEN OFFSCREEN ---
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isSectionVisible = entry.isIntersecting;
        if (isSectionVisible) {
          requestRender();
        } else if (animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      });
    },
    { rootMargin: '100px 0px 100px 0px' }
  );
  if (section) observer.observe(section);

  // --- ANIMATION LOOP (ON-DEMAND IDLE SLEEPING) ---
  function animate() {
    if (!isSectionVisible || document.hidden) {
      animId = null;
      return;
    }

    const rotDiff = Math.abs(targetRotation - currentRotation);

    if (isDragging || rotDiff > 0.0001) {
      // Dynamic damping: snappy tracking while dragging, buttery smooth glide when released
      const damping = isDragging ? 0.38 : 0.078;
      currentRotation += (targetRotation - currentRotation) * damping;
      carouselGroup.rotation.y = currentRotation;
      needsRender = true;
    } else if (currentRotation !== targetRotation) {
      currentRotation = targetRotation;
      carouselGroup.rotation.y = currentRotation;
      needsRender = true;
    }

    // Detect currently front-facing card
    const normalizedIndex = ((Math.round(-currentRotation / deltaTheta) % N) + N) % N;
    if (normalizedIndex !== activeIndex) {
      activeIndex = normalizedIndex;
      updateHUD(activeIndex);
    }

    if (needsRender) {
      renderer.render(scene, camera);
      needsRender = false;
    }

    // When carousel comes to a stop and user is not dragging, pause RAF to use 0% CPU & 0% GPU
    if (!isDragging && rotDiff <= 0.0001) {
      animId = null;
      return;
    }

    animId = requestAnimationFrame(animate);
  }
  requestRender();

  // Cleanup handler
  container.__destroyDS3D = () => {
    if (animId) cancelAnimationFrame(animId);
    if (hoverRaf) cancelAnimationFrame(hoverRaf);
    clearTimeout(wheelSnapTimer);
    if (observer && section) observer.unobserve(section);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('scroll', updateCachedRect);
    container.removeEventListener('mousedown', onPointerDown);
    window.removeEventListener('mousemove', onPointerMove);
    window.removeEventListener('mouseup', onPointerUp);
    container.removeEventListener('mousemove', onContainerHover);
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
    imgEl.src = project.fullImage || project.image;
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
