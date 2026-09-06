import * as THREE from 'three';

/**
 * ═════════════════════════════════════════════════════════════════════════
 * CENTRALIZED PROJECT DATABASE (DATA-DRIVEN ARCHITECTURE)
 * Add or remove projects here; the 3D world, camera path, and UI
 * will automatically adapt dynamically.
 * ═════════════════════════════════════════════════════════════════════════
 */
export const projectsData = [
  {
    id: 1,
    number: '01',
    title: 'GRAMIN SAHAY / VOICE AI',
    category: 'MULTILINGUAL CONVERSATIONAL AI',
    tagline: 'Voice-first multilingual assistant for rural agriculture & telemetry',
    description:
      'Voice-enabled intelligent assistant engineered specifically for farmers and rural communities across India. Features native speech-to-text across 4 regional languages with zero internet dependency fallbacks, delivering real-time mandi prices, weather forecasts, and government schemes.',
    metrics: [
      { label: 'SPEECH ENGINE', value: 'Whisper + IndicNLP + Coqui' },
      { label: 'DIALECTS', value: 'Hindi, Kannada, Telugu, English' },
      { label: 'BACKEND', value: 'FastAPI + Async Python + Redis' },
    ],
    technologies: ['Whisper AI', 'FastAPI', 'IndicNLP', 'Python', 'WebSockets', 'Tailwind'],
    image: './images/ai_rural.png',
    liveUrl: 'https://github.com/arikrishna-03',
    githubUrl: 'https://github.com/arikrishna-03',
    accentColor: '#00ffaa',
    accentHex: 0x00ffaa,
    worldPos: { x: -2.8, y: 0, z: -14 },
    rotationY: 0.28,
  },
  {
    id: 2,
    number: '02',
    title: 'DUAL PORTFOLIO & TELEMETRY CORE',
    category: 'FULL-STACK WEBGL ARCHITECTURE',
    tagline: 'High-performance WebGL graphics with live competitive coding API telemetry',
    description:
      'Dual-perspective digital experience combining an AI engineering lab with a high-impact brand visual portfolio. Features GPU-accelerated WebGL rendering, 0-dependency state transitions, and live competitive coding telemetry synchronizing over 1,080+ algorithmic solutions.',
    metrics: [
      { label: 'GRAPHICS ENGINE', value: 'Three.js WebGL + Custom Shaders' },
      { label: 'SOLVED STATS', value: '1,080+ Problems (Rank #15,751)' },
      { label: 'BUILD SPEED', value: 'Vite 8 + Automated CI/CD Sync' },
    ],
    technologies: ['Three.js', 'WebGL', 'JavaScript', 'Vite', 'CSS Spring', 'GitHub Actions'],
    image: './images/hero_poster.png',
    liveUrl: 'https://github.com/arikrishna-03/portfolio',
    githubUrl: 'https://github.com/arikrishna-03/portfolio',
    accentColor: '#f7d059',
    accentHex: 0xf7d059,
    worldPos: { x: 2.8, y: 0, z: -36 },
    rotationY: -0.28,
  },
  {
    id: 3,
    number: '03',
    title: 'NEURAL DEFECT & VISION ANALYZER',
    category: 'DEEP LEARNING / INDUSTRIAL INSPECTION',
    tagline: 'Automated surface defect detection with sub-millimeter precision',
    description:
      'Computer vision inspection platform built with custom CNN architectures and transfer learning. Analyzes high-resolution industrial sensor feeds to detect micro-cracks, surface anomalies, and quality deviations at 60 FPS on edge hardware.',
    metrics: [
      { label: 'ARCHITECTURE', value: 'YOLOv8 + ResNet-50 Backbone' },
      { label: 'INSPECTION mAP', value: '94.8% mAP@0.5' },
      { label: 'EDGE DEPLOYMENT', value: 'ONNX Runtime + TensorRT' },
    ],
    technologies: ['PyTorch', 'YOLOv8', 'TensorRT', 'ONNX', 'OpenCV', 'CUDA'],
    image: './images/before_after.png',
    liveUrl: 'https://github.com/arikrishna-03',
    githubUrl: 'https://github.com/arikrishna-03',
    accentColor: '#c084fc',
    accentHex: 0xc084fc,
    worldPos: { x: -2.8, y: 0, z: -58 },
    rotationY: 0.28,
  },
];

/**
 * Initializes the entire 3D Scroll-Driven Projects Showcase.
 */
export function initProjects3DWorld() {
  const container = document.getElementById('projects-ai');
  const canvas = document.getElementById('arcade-3d-canvas');
  if (!container || !canvas) return null;

  // Cleanup any previous instance on the canvas if re-initialized
  if (canvas.__destroyProjects3D) {
    canvas.__destroyProjects3D();
  }

  const cardsOverlay = container.querySelector('.arcade-cards-overlay');
  const hudBar = container.querySelector('.arcade-hud-bar');
  const hudCurrentBadge = document.getElementById('arcade-active-badge');
  const hudCounter = document.getElementById('arcade-counter-badge');
  const progressFill = document.getElementById('arcade-progress-bar');
  const scrollPrompt = document.getElementById('arcade-scroll-hint');

  // Render DOM UI Cards dynamically from projectsData
  renderUICards(cardsOverlay, projectsData);
  const introTitle = container.querySelector('.arcade-intro-title');
  const systemCards = container.querySelectorAll('.arcade-card');

  // ═══════════════════════════════════════════════════════════════════════
  // 1. THREE.JS SCENE, CAMERA & RENDERER SETUP
  // ═══════════════════════════════════════════════════════════════════════
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x080d1a);
  scene.fog = new THREE.FogExp2(0x080d1a, 0.015);

  // Clear any existing inline width/height that would constrain the canvas
  canvas.style.removeProperty('width');
  canvas.style.removeProperty('height');

  const getViewportWidth = () => canvas.clientWidth || window.innerWidth || 1920;
  const getViewportHeight = () => canvas.clientHeight || (window.innerWidth >= 1024 ? Math.round(window.innerHeight * 1.25) : window.innerHeight);

  const initW = getViewportWidth();
  const initH = getViewportHeight();

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
    stencil: false,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(initW, initH, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  const camera = new THREE.PerspectiveCamera(
    44,
    initW / initH,
    0.1,
    220
  );

  // ═══════════════════════════════════════════════════════════════════════
  // 2. PROCEDURAL HIGH-TECH ENVIRONMENT (DEPTH, GRID, BUILDINGS, PARTICLES)
  // ═══════════════════════════════════════════════════════════════════════
  const textureLoader = new THREE.TextureLoader();

  // Ambient & Directional Lighting
  const ambientLight = new THREE.AmbientLight(0xd5e3ff, 0.7);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0x67c7eb, 1.2);
  mainLight.position.set(10, 24, 15);
  scene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0x9333ea, 0.6);
  fillLight.position.set(-15, 18, -20);
  scene.add(fillLight);

  // High-Depth Extended Ground Floor Grid
  const gridHelper = new THREE.GridHelper(380, 200, 0x67c7eb, 0x111f3d);
  gridHelper.position.set(0, -0.01, -60);
  scene.add(gridHelper);

  // Dark Reflective Floor Plane spanning entire runway
  const floorGeo = new THREE.PlaneGeometry(380, 380);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x03060f,
    roughness: 0.28,
    metalness: 0.85,
  });
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(0, -0.02, -60);
  scene.add(floorMesh);

  // Futuristic Background Architecture (Skyscrapers & Towers along extended runway)
  const cityGroup = new THREE.Group();
  const boxGeo = new THREE.BoxGeometry(1, 1, 1);
  const bldgMat = new THREE.MeshStandardMaterial({
    color: 0x070c1a,
    roughness: 0.7,
    metalness: 0.4,
  });

  const cityPalette = [0x67c7eb, 0x00ffaa, 0xc084fc, 0xf7d059];
  for (let i = 0; i < 95; i++) {
    const bldg = new THREE.Mesh(boxGeo, bldgMat);
    const height = 15 + Math.random() * 48;
    const width = 3 + Math.random() * 6;
    const depth = 3 + Math.random() * 6;
    bldg.scale.set(width, height, depth);

    const side = Math.random() > 0.5 ? 1 : -1;
    const x = side * (12 + Math.random() * 45);
    const z = -175 + Math.random() * 195;
    bldg.position.set(x, height / 2, z);
    cityGroup.add(bldg);

    // Glowing vertical window stripes
    if (Math.random() > 0.35) {
      const accent = cityPalette[Math.floor(Math.random() * cityPalette.length)];
      const stripeGeo = new THREE.PlaneGeometry(width * 0.7, height * 0.75);
      const stripeMat = new THREE.MeshBasicMaterial({
        color: accent,
        transparent: true,
        opacity: 0.14 + Math.random() * 0.2,
      });
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.position.set(x - side * (width * 0.51), height / 2, z);
      stripe.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2;
      cityGroup.add(stripe);
    }
  }
  scene.add(cityGroup);

  // Vertical Laser Pillars / Data Columns extending down the deep corridor
  for (let i = 0; i < 38; i++) {
    const beamGeo = new THREE.CylinderGeometry(0.045, 0.045, 60, 8);
    const beamColor = i % 2 === 0 ? 0x67c7eb : 0x00ffaa;
    const beamMat = new THREE.MeshBasicMaterial({
      color: beamColor,
      transparent: true,
      opacity: 0.55,
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    const side = i % 2 === 0 ? 1 : -1;
    beam.position.set(side * (8.5 + (i % 4) * 2.5), 30, -i * 4.2);
    scene.add(beam);
  }

  // Floating Cyber Dust / Particles throughout full extended corridor
  const particleCount = 380;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 55;
    particlePositions[i + 1] = Math.random() * 20;
    particlePositions[i + 2] = 12 - Math.random() * 180;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x67c7eb,
    size: 0.14,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
  });
  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // ═══════════════════════════════════════════════════════════════════════
  // 3. 3D PROJECT MONOLITHS / DISPLAY PEDESTALS
  // ═══════════════════════════════════════════════════════════════════════
  const projectMeshes = [];

  // Helper to create glowing marquee canvas texture
  function createMarqueeTexture(title, sub, colorHex) {
    const cvs = document.createElement('canvas');
    cvs.width = 512;
    cvs.height = 128;
    const ctx = cvs.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 512, 128);
    grad.addColorStop(0, '#030713');
    grad.addColorStop(0.5, '#0a1633');
    grad.addColorStop(1, '#030713');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 128);

    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 5;
    ctx.strokeRect(6, 6, 500, 116);

    ctx.shadowColor = colorHex;
    ctx.shadowBlur = 16;
    ctx.font = 'bold 36px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, 256, 52);

    ctx.shadowBlur = 6;
    ctx.font = '600 14px "Roboto Mono", monospace';
    ctx.fillStyle = colorHex;
    ctx.fillText(sub, 256, 92);

    const tex = new THREE.CanvasTexture(cvs);
    tex.needsUpdate = true;
    return tex;
  }

  // Build each physical project in 3D
  projectsData.forEach((proj, idx) => {
    const group = new THREE.Group();
    const colorHex = proj.accentHex;
    const colorStr = proj.accentColor;

    // Body Material
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x080d1e,
      roughness: 0.35,
      metalness: 0.85,
    });

    // 1. Base Pedestal
    const baseGeo = new THREE.BoxGeometry(2.4, 1.1, 2.2);
    const baseMesh = new THREE.Mesh(baseGeo, bodyMat);
    baseMesh.position.y = 0.55;
    group.add(baseMesh);

    // 2. Kiosk Upper Frame Housing
    const frameGeo = new THREE.BoxGeometry(2.3, 2.4, 1.8);
    const frameMesh = new THREE.Mesh(frameGeo, bodyMat);
    frameMesh.position.set(0, 2.25, -0.15);
    group.add(frameMesh);

    // 3. Slanted Cyber Deck
    const deckGeo = new THREE.BoxGeometry(2.4, 0.22, 1.2);
    const deckMesh = new THREE.Mesh(deckGeo, bodyMat);
    deckMesh.position.set(0, 1.35, 0.7);
    deckMesh.rotation.x = 0.22;
    group.add(deckMesh);

    // Glowing Interactive Buttons on Deck
    const btnMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: 0.9,
      roughness: 0.2,
    });
    const btnGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.06, 12);
    const btnOffsets = [-0.5, -0.25, 0, 0.25, 0.5];
    btnOffsets.forEach((bx) => {
      const b1 = new THREE.Mesh(btnGeo, btnMat);
      b1.position.set(bx, 1.48, 0.64);
      b1.rotation.x = 0.22;
      group.add(b1);
    });

    // 4. Main Holographic Display Screen
    const screenTex = textureLoader.load(proj.image, (tex) => {
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
    });

    const screenFrameGeo = new THREE.BoxGeometry(2.1, 1.6, 0.12);
    const screenFrameMat = new THREE.MeshStandardMaterial({ color: 0x030611, roughness: 0.8 });
    const screenFrame = new THREE.Mesh(screenFrameGeo, screenFrameMat);
    screenFrame.position.set(0, 2.55, 0.65);
    screenFrame.rotation.x = -0.16;
    group.add(screenFrame);

    const screenPlaneGeo = new THREE.PlaneGeometry(1.95, 1.45);
    const screenPlaneMat = new THREE.MeshStandardMaterial({
      map: screenTex,
      emissive: 0xffffff,
      emissiveMap: screenTex,
      emissiveIntensity: 0.95,
      roughness: 0.15,
      metalness: 0.1,
    });
    const screenPlane = new THREE.Mesh(screenPlaneGeo, screenPlaneMat);
    screenPlane.position.set(0, 2.55, 0.72);
    screenPlane.rotation.x = -0.16;
    group.add(screenPlane);

    // Subtle Screen Bezel Glare
    const glareGeo = new THREE.PlaneGeometry(1.95, 1.45);
    const glareMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.09,
      blending: THREE.AdditiveBlending,
    });
    const glarePlane = new THREE.Mesh(glareGeo, glareMat);
    glarePlane.position.set(0, 2.55, 0.725);
    glarePlane.rotation.x = -0.16;
    group.add(glarePlane);

    // 5. Glowing Marquee Header Sign
    const marqueeTex = createMarqueeTexture(proj.number, proj.category, colorStr);
    const marqueeGeo = new THREE.BoxGeometry(2.2, 0.6, 0.7);
    const marqueeMesh = new THREE.Mesh(marqueeGeo, bodyMat);
    marqueeMesh.position.set(0, 3.7, 0.45);
    marqueeMesh.rotation.x = 0.1;
    group.add(marqueeMesh);

    const marqueeFaceGeo = new THREE.PlaneGeometry(2.05, 0.5);
    const marqueeFaceMat = new THREE.MeshBasicMaterial({ map: marqueeTex });
    const marqueeFace = new THREE.Mesh(marqueeFaceGeo, marqueeFaceMat);
    marqueeFace.position.set(0, 3.7, 0.81);
    marqueeFace.rotation.x = 0.1;
    group.add(marqueeFace);

    // 6. Glowing Neon Trim Strips (Pillars & Borders)
    const trimMat = new THREE.MeshBasicMaterial({ color: colorHex });
    const tubeGeo = new THREE.CylinderGeometry(0.03, 0.03, 3.7, 8);
    const leftTube = new THREE.Mesh(tubeGeo, trimMat);
    leftTube.position.set(-1.18, 2.15, 0.76);
    group.add(leftTube);

    const rightTube = new THREE.Mesh(tubeGeo, trimMat);
    rightTube.position.set(1.18, 2.15, 0.76);
    group.add(rightTube);

    const topBarGeo = new THREE.CylinderGeometry(0.03, 0.03, 2.36, 8);
    const topBar = new THREE.Mesh(topBarGeo, trimMat);
    topBar.rotation.z = Math.PI / 2;
    topBar.position.set(0, 4.02, 0.82);
    group.add(topBar);

    // 7. Under-Glow Floor Ring
    const underGlowGeo = new THREE.RingGeometry(1.0, 2.4, 32);
    const underGlowMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    const underGlow = new THREE.Mesh(underGlowGeo, underGlowMat);
    underGlow.rotation.x = -Math.PI / 2;
    underGlow.position.y = 0.02;
    group.add(underGlow);

    // 8. Dedicated Colored Point Light
    const pointLight = new THREE.PointLight(colorHex, 2.2, 10);
    pointLight.position.set(0, 2.6, 1.8);
    group.add(pointLight);

    // Position and orient in 3D scene
    group.position.set(proj.worldPos.x, proj.worldPos.y, proj.worldPos.z);
    group.rotation.y = proj.rotationY;

    scene.add(group);
    projectMeshes.push({ group, pointLight, underGlow, screenPlaneMat, originalY: proj.worldPos.y });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // 4. CURVED SPLINE CAMERA PATH & ALTERNATING TRAJECTORIES
  // ═══════════════════════════════════════════════════════════════════════
  // Generate camera waypoints dynamically based on projectsData
  const pathPoints = [];
  const lookAtPoints = [];

  // Entrance corridor waypoint
  pathPoints.push(new THREE.Vector3(0, 2.4, 5.0));
  lookAtPoints.push(new THREE.Vector3(0, 2.2, -10.0));

  projectsData.forEach((proj) => {
    // Stand is framed on designated side while leaving opposite side open for the about card
    // For left stand (x < 0), camera approaches at x = 0.6; for right stand (x > 0), camera at x = -0.6
    const camX = proj.worldPos.x > 0 ? -0.6 : 0.6;
    const camY = 2.3;
    const camZ = proj.worldPos.z + 7.5;

    pathPoints.push(new THREE.Vector3(camX, camY, camZ));

    // Look target centers the stand comfortably on its designated side
    const lookX = proj.worldPos.x > 0 ? -0.4 : 0.4;
    lookAtPoints.push(new THREE.Vector3(lookX, 2.1, proj.worldPos.z));
  });

  // Extended Post-Station-3 Runway Waypoints ("go some more distance, little more"):
  // Waypoint 4: Center corridor cruise past station 3
  pathPoints.push(new THREE.Vector3(0, 2.35, -76.0));
  lookAtPoints.push(new THREE.Vector3(0, 2.1, -112.0));

  // Waypoint 5: Deep forward travel through glowing runway & monoliths
  pathPoints.push(new THREE.Vector3(0, 2.5, -106.0));
  lookAtPoints.push(new THREE.Vector3(0, 2.1, -148.0));

  // Waypoint 6: Ascend softly into horizon for smooth regular transition into Coding Consistency
  pathPoints.push(new THREE.Vector3(0, 3.6, -136.0));
  lookAtPoints.push(new THREE.Vector3(0, 2.0, -180.0));

  const cameraPath = new THREE.CatmullRomCurve3(pathPoints);
  const lookAtPath = new THREE.CatmullRomCurve3(lookAtPoints);

  // ═══════════════════════════════════════════════════════════════════════
  // 5. SCROLL ENGINE & SYNCHRONIZED MASTER CONTROLLER
  // ═══════════════════════════════════════════════════════════════════════
  let currentProgress = 0;
  let targetProgress = 0;
  let activeIndex = -1;

  // Mouse Parallax
  let mouseX = 0;
  let mouseY = 0;
  const onMouseMove = (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener('mousemove', onMouseMove);

  // Scroll Progress Calculation (Based on container height)
  function calculateScrollProgress() {
    const rect = container.getBoundingClientRect();
    const totalDist = container.offsetHeight - window.innerHeight;
    if (totalDist <= 0) return;

    // Viewport is above #projects-ai (user is browsing Tech Stack)
    if (rect.top > 0) {
      targetProgress = 0;
      canvas.style.opacity = '0';
      if (hudBar) hudBar.style.opacity = '0';
      if (introTitle && rect.top > window.innerHeight * 0.25) {
        introTitle.classList.remove('active');
      }
      return;
    }

    const raw = -rect.top / totalDist;
    targetProgress = Math.max(0, Math.min(raw, 1));

    // When scrolling past station 3 into extended flight, hide cards cleanly
    // so no card bleeds into the flight or adjacent "Coding Consistency" section
    if (raw >= 0.81 || rect.bottom <= window.innerHeight + 80) {
      systemCards.forEach((c) => {
        c.classList.remove('active');
        c.setAttribute('aria-hidden', 'true');
      });
      if (introTitle) introTitle.classList.remove('active');
    }
  }

  window.addEventListener('scroll', calculateScrollProgress, { passive: true });
  calculateScrollProgress();

  // Configured reading zones for each project:
  // Outside these zones (transit corridors / extended flight), cards are strictly hidden.
  const projectZones = [
    { id: 0, start: 0.14, end: 0.30 }, // System 01 (Gramin Sahay / Voice AI)
    { id: 1, start: 0.40, end: 0.58 }, // System 02 (Dual Portfolio & Telemetry Core)
    { id: 2, start: 0.68, end: 0.80 }, // System 03 (Neural Defect & Vision Analyzer - ample time to read!)
  ];

  // Piecewise camera spline mapping: smoothly glides to each stand, holds comfortably
  // during the reading zone, accelerates through transit corridors, flies extended distance past station 3,
  // and finishes with a regular smooth transition.
  function mapSplineProgress(p) {
    if (p <= 0.04) return 0.0;
    if (p < 0.14) {
      // Approach Station 1
      const factor = (p - 0.04) / 0.10;
      return factor * 0.082;
    }
    if (p <= 0.30) {
      // Station 1 Reading Zone: hold right at Station 1 with gentle drift
      const factor = (p - 0.14) / 0.16;
      return 0.082 + factor * 0.006;
    }
    if (p < 0.40) {
      // Corridor travel from Station 1 to Station 2
      const factor = (p - 0.30) / 0.10;
      return 0.088 + factor * (0.239 - 0.088);
    }
    if (p <= 0.58) {
      // Station 2 Reading Zone: hold right at Station 2 with gentle drift
      const factor = (p - 0.40) / 0.18;
      return 0.239 + factor * 0.006;
    }
    if (p < 0.68) {
      // Corridor travel from Station 2 to Station 3
      const factor = (p - 0.58) / 0.10;
      return 0.245 + factor * (0.396 - 0.245);
    }
    if (p <= 0.80) {
      // Station 3 Reading Zone: hold right at Station 3 with gentle drift
      const factor = (p - 0.68) / 0.12;
      return 0.396 + factor * 0.006;
    }
    if (p <= 0.93) {
      // Post-Station-3 Extended Travel ("go some more distance, little more"):
      // Camera accelerates forward down the cyber runway past Station 3
      const factor = (p - 0.80) / 0.13;
      return 0.402 + factor * (0.82 - 0.402);
    }
    // Regular transition: soft glide into horizon exit
    const factor = Math.min(1.0, (p - 0.93) / 0.07);
    return 0.82 + factor * (1.0 - 0.82);
  }

  // Dynamic camera lookAt target: precisely aims at each active project stand
  // so the stand is comfortably framed on its designated side, then looks straight down the runway
  function getDynamicLookAt(p) {
    if (p < 0.10) {
      const factor = Math.max(0, p / 0.10);
      const startLook = new THREE.Vector3(0, 2.2, -10.0);
      const s1Look = new THREE.Vector3(0.4, 2.1, -14.0);
      return new THREE.Vector3().lerpVectors(startLook, s1Look, factor);
    }
    if (p <= 0.30) {
      return new THREE.Vector3(0.4, 2.1, -14.0);
    }
    if (p < 0.40) {
      const factor = (p - 0.30) / 0.10;
      const look1 = new THREE.Vector3(0.4, 2.1, -14.0);
      const look2 = new THREE.Vector3(-0.4, 2.1, -36.0);
      return new THREE.Vector3().lerpVectors(look1, look2, factor);
    }
    if (p <= 0.58) {
      return new THREE.Vector3(-0.4, 2.1, -36.0);
    }
    if (p < 0.68) {
      const factor = (p - 0.58) / 0.10;
      const look2 = new THREE.Vector3(-0.4, 2.1, -36.0);
      const look3 = new THREE.Vector3(0.4, 2.1, -58.0);
      return new THREE.Vector3().lerpVectors(look2, look3, factor);
    }
    if (p <= 0.80) {
      return new THREE.Vector3(0.4, 2.1, -58.0);
    }
    if (p <= 0.88) {
      // Lerp from Station 3 stand to straight down the cyber corridor runway
      const factor = (p - 0.80) / 0.08;
      const look3 = new THREE.Vector3(0.4, 2.1, -58.0);
      const runwayLook = new THREE.Vector3(0, 2.1, -120.0);
      return new THREE.Vector3().lerpVectors(look3, runwayLook, factor);
    }
    const factor = Math.min(1.0, (p - 0.88) / 0.12);
    const runwayLook = new THREE.Vector3(0, 2.1, -120.0);
    const exitLook = new THREE.Vector3(0, 2.0, -180.0);
    return new THREE.Vector3().lerpVectors(runwayLook, exitLook, factor);
  }

  // Update UI Card States based on scroll progress
  function updateUI(progress) {
    const total = projectsData.length;
    const rect = container.getBoundingClientRect();

    // ─────────────────────────────────────────────────────────────────
    // 1. DYNAMIC 3D ARCADE REVEAL & HUD OPACITY CONTROL
    // ─────────────────────────────────────────────────────────────────
    // - On Tech Stack (rect.top > 0): Arcade is 0% visible (completely hidden).
    // - On Project Showcase entrance (progress < 0.04): ONLY title is seen, NO back view (opacity = 0).
    // - Scrolling from 0.04 to 0.14: Slowly and smoothly reveals the 3D world as camera arrives at System 01.
    // - Between 0.14 and 0.93: 100% full 3D radiance, active cards, and extended flight corridor.
    // - Past 0.93 to 0.995: Regular smooth fade out to darkness into Coding Consistency.
    let arcadeReveal = 0;
    let hudOpacity = 0;

    if (rect.top > 0) {
      arcadeReveal = 0;
      hudOpacity = 0;
    } else if (progress < 0.04) {
      arcadeReveal = 0;
      hudOpacity = 0;
    } else if (progress >= 0.04 && progress < 0.14) {
      arcadeReveal = (progress - 0.04) / 0.10;
      hudOpacity = Math.max(0, (progress - 0.06) / 0.07);
    } else if (progress >= 0.14 && progress <= 0.93) {
      arcadeReveal = 1;
      hudOpacity = 1;
    } else if (progress > 0.93 && progress < 0.995) {
      arcadeReveal = 1 - (progress - 0.93) / 0.065;
      hudOpacity = arcadeReveal;
    } else {
      arcadeReveal = 0;
      hudOpacity = 0;
    }

    arcadeReveal = Math.max(0, Math.min(arcadeReveal, 1));
    hudOpacity = Math.max(0, Math.min(hudOpacity, 1));

    canvas.style.opacity = arcadeReveal.toFixed(3);
    if (hudBar) {
      hudBar.style.opacity = hudOpacity.toFixed(3);
      hudBar.style.pointerEvents = hudOpacity > 0.4 ? 'auto' : 'none';
    }

    // Atmospheric fog density modulation during reveal: clears as arcade reveals
    if (scene.fog) {
      scene.fog.density = 0.015 + (1.0 - arcadeReveal) * 0.035;
    }

    // ─────────────────────────────────────────────────────────────────
    // 2. ACTIVE STAGE SELECTION (INTRO, READING ZONES, CROSSING, FLIGHT, EXIT)
    // ─────────────────────────────────────────────────────────────────
    let newActive = 'crossing';
    let targetMeshIdx = -1;

    if (rect.top > window.innerHeight * 0.25) {
      newActive = 'hidden';
      targetMeshIdx = -1;
    } else if (progress < 0.08) {
      newActive = 'intro';
      targetMeshIdx = -1;
    } else if (progress > 0.80 && progress <= 0.93) {
      newActive = 'flight'; // Prolonged post-station-3 corridor flight
      targetMeshIdx = -1;
    } else if (progress > 0.93) {
      newActive = 'exit';
      targetMeshIdx = -1;
    } else {
      for (const z of projectZones) {
        if (progress >= z.start && progress <= z.end) {
          newActive = z.id;
          targetMeshIdx = z.id;
          break;
        }
      }
    }

    if (newActive !== activeIndex) {
      activeIndex = newActive;

      if (activeIndex === 'hidden') {
        if (introTitle) {
          introTitle.classList.remove('active');
        }
        systemCards.forEach((card) => {
          card.classList.remove('active');
          card.setAttribute('aria-hidden', 'true');
        });
        if (scrollPrompt) {
          scrollPrompt.style.opacity = '0';
        }
      } else if (activeIndex === 'intro') {
        if (introTitle) {
          introTitle.classList.add('active');
        }
        systemCards.forEach((card) => {
          card.classList.remove('active');
          card.setAttribute('aria-hidden', 'true');
        });

        // Top HUD
        if (hudCurrentBadge) {
          hudCurrentBadge.textContent = 'PROJECT SHOWCASE // SCROLL TO NAVIGATE';
          hudCurrentBadge.style.color = '#67c7eb';
        }
        if (hudCounter) {
          hudCounter.textContent = 'SHOWCASE';
        }
        if (scrollPrompt) {
          scrollPrompt.style.opacity = '1';
        }
      } else if (typeof activeIndex === 'number') {
        if (introTitle) {
          introTitle.classList.remove('active');
        }
        systemCards.forEach((card, idx) => {
          if (idx === activeIndex) {
            card.classList.add('active');
            card.setAttribute('aria-hidden', 'false');
          } else {
            card.classList.remove('active');
            card.setAttribute('aria-hidden', 'true');
          }
        });

        // Top HUD
        const p = projectsData[activeIndex];
        if (hudCurrentBadge) {
          hudCurrentBadge.textContent = `SYSTEM ${p.number} // ${p.category}`;
          hudCurrentBadge.style.color = p.accentColor;
        }
        if (hudCounter) {
          hudCounter.textContent = `${p.number} / ${total.toString().padStart(2, '0')}`;
        }
        if (scrollPrompt) {
          scrollPrompt.style.opacity = '0';
        }
      } else if (activeIndex === 'flight') {
        // Extended Corridor Flight after the last station:
        // No cards, full clean cinematic forward flight through the cyber runway
        if (introTitle) {
          introTitle.classList.remove('active');
        }
        systemCards.forEach((card) => {
          card.classList.remove('active');
          card.setAttribute('aria-hidden', 'true');
        });

        if (hudCurrentBadge) {
          hudCurrentBadge.textContent = '3D CYBER CORRIDOR // EXTENDED RUNWAY';
          hudCurrentBadge.style.color = '#67c7eb';
        }
        if (hudCounter) {
          hudCounter.textContent = '03 / 03';
        }
        if (scrollPrompt) {
          scrollPrompt.style.opacity = '0';
        }
      } else if (activeIndex === 'crossing') {
        // While crossing between stations: NO card showing
        if (introTitle) {
          introTitle.classList.remove('active');
        }
        systemCards.forEach((card) => {
          card.classList.remove('active');
          card.setAttribute('aria-hidden', 'true');
        });

        if (hudCurrentBadge) {
          if (progress < 0.14) {
            hudCurrentBadge.textContent = '3D CORRIDOR // ENTERING SYSTEM 01';
          } else if (progress < 0.40) {
            hudCurrentBadge.textContent = '3D CORRIDOR // TRAVELING TO SYSTEM 02';
          } else {
            hudCurrentBadge.textContent = '3D CORRIDOR // TRAVELING TO SYSTEM 03';
          }
          hudCurrentBadge.style.color = '#94a3b8';
        }
        if (hudCounter) {
          hudCounter.textContent = '-- / 03';
        }
        if (scrollPrompt) {
          scrollPrompt.style.opacity = '0';
        }
      } else {
        // Exit
        if (introTitle) {
          introTitle.classList.remove('active');
        }
        systemCards.forEach((card) => {
          card.classList.remove('active');
          card.setAttribute('aria-hidden', 'true');
        });

        if (hudCurrentBadge) {
          hudCurrentBadge.textContent = 'SYSTEM ARCHIVE COMPLETE // CODING CONSISTENCY';
          hudCurrentBadge.style.color = '#cbd5e1';
        }
        if (hudCounter) {
          hudCounter.textContent = 'RESUME';
        }
        if (scrollPrompt) {
          scrollPrompt.style.opacity = '0';
        }
      }
    }

    // Update bottom progress bar width
    if (progressFill) {
      progressFill.style.width = `${(progress * 100).toFixed(1)}%`;
    }

    // Dynamic 3D Monolith Lighting & Glow modulation
    projectMeshes.forEach((meshObj, i) => {
      const isTarget = i === targetMeshIdx;
      const targetIntensity = isTarget ? 3.0 : 0.8;
      meshObj.pointLight.intensity += (targetIntensity - meshObj.pointLight.intensity) * 0.1;
      meshObj.underGlow.material.opacity += ((isTarget ? 0.6 : 0.2) - meshObj.underGlow.material.opacity) * 0.1;
      meshObj.screenPlaneMat.emissiveIntensity += ((isTarget ? 1.05 : 0.6) - meshObj.screenPlaneMat.emissiveIntensity) * 0.1;
    });
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 6. RESIZE HANDLER & INTERSECTION OBSERVER
  // ═══════════════════════════════════════════════════════════════════════
  function onResize() {
    canvas.style.removeProperty('width');
    canvas.style.removeProperty('height');
    const w = getViewportWidth();
    const h = getViewportHeight();
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    calculateScrollProgress();
  }
  window.addEventListener('resize', onResize);

  let isVisible = true;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
      });
    },
    { threshold: 0.02 }
  );
  observer.observe(container);

  // ═══════════════════════════════════════════════════════════════════════
  // 7. SMOOTH ANIMATION LOOP
  // ═══════════════════════════════════════════════════════════════════════
  let rafId = null;
  const currentCamPos = new THREE.Vector3().copy(pathPoints[0]);
  const currentLookAt = new THREE.Vector3().copy(lookAtPoints[0]);
  const clock = new THREE.Clock();

  function animate() {
    rafId = requestAnimationFrame(animate);
    if (!isVisible) return;

    // Automatically synchronize canvas dimensions if viewport or orientation changes
    const curW = getViewportWidth();
    const curH = getViewportHeight();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (
      canvas.width !== Math.floor(curW * dpr) ||
      canvas.height !== Math.floor(curH * dpr)
    ) {
      onResize();
    }

    const time = clock.getElapsedTime();

    // Lerp scroll progress for cinematic acceleration & deceleration
    currentProgress += (targetProgress - currentProgress) * 0.075;
    updateUI(currentProgress);

    const t = Math.max(0, Math.min(mapSplineProgress(currentProgress), 0.999));
    const targetCamPos = cameraPath.getPointAt(t);
    const targetLookAt = getDynamicLookAt(currentProgress);

    // Subtle interactive mouse parallax
    targetCamPos.x += mouseX * 0.3;
    targetCamPos.y += -mouseY * 0.15;

    // Smoothly interpolate camera position & lookAt
    currentCamPos.lerp(targetCamPos, 0.085);
    currentLookAt.lerp(targetLookAt, 0.085);

    camera.position.copy(currentCamPos);
    camera.lookAt(currentLookAt);

    // Drift particles downward
    const pos = particleGeo.attributes.position.array;
    for (let i = 1; i < particleCount * 3; i += 3) {
      pos[i] -= 0.015;
      if (pos[i] < 0) pos[i] = 18;
    }
    particleGeo.attributes.position.needsUpdate = true;

    // Gentle organic breathing of project monoliths
    projectMeshes.forEach((meshObj, i) => {
      meshObj.group.position.y = meshObj.originalY + Math.sin(time * 1.5 + i * 1.2) * 0.03;
    });

    renderer.render(scene, camera);
  }

  animate();

  // Store destroy function to cleanly unmount
  canvas.__destroyProjects3D = function () {
    cancelAnimationFrame(rafId);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('scroll', calculateScrollProgress);
    window.removeEventListener('resize', onResize);
    observer.disconnect();

    renderer.dispose();
    scene.clear();
  };

  return canvas.__destroyProjects3D;
}

/**
 * Generates the Showcase Intro Title and alternating Glassmorphic UI Panels.
 */
function renderUICards(container, projects) {
  if (!container) return;
  container.innerHTML = '';

  // 1. Two-line "Project Showcase" title text at entrance (only that word)
  const introTitle = document.createElement('div');
  introTitle.className = 'arcade-intro-title active';
  introTitle.id = 'arcade-intro-title';
  introTitle.innerHTML = `
    <span class="ait-line">Project</span>
    <span class="ait-line">Showcase</span>
  `;
  container.appendChild(introTitle);

  // 2. SYSTEM SPEC CARDS (01, 02, 03, 04)
  projects.forEach((proj, index) => {
    // Alternating side:
    // If 3D project is on the right (x > 0), UI card is on the left
    // If 3D project is on the left (x < 0), UI card is on the right
    const sideClass = proj.worldPos.x > 0 ? 'arcade-card--left' : 'arcade-card--right';

    const card = document.createElement('div');
    card.className = `arcade-card ${sideClass}`;
    card.dataset.index = index;
    card.setAttribute('aria-hidden', 'true');
    card.style.setProperty('--card-accent', proj.accentColor);

    let metricsHTML = '';
    proj.metrics.forEach((m) => {
      metricsHTML += `
        <div class="ac-spec-row">
          <span class="ac-spec-label">${m.label}</span>
          <span class="ac-spec-val" style="color: ${proj.accentColor}">${m.value}</span>
        </div>
      `;
    });

    let techHTML = '';
    proj.technologies.forEach((t) => {
      techHTML += `<span class="ac-tag">${t}</span>`;
    });

    card.innerHTML = `
      <div class="ac-glow" style="background: radial-gradient(circle at 50% 0%, ${proj.accentColor}33, transparent 70%);"></div>
      <div class="ac-header">
        <span class="ac-pill" style="border-color: ${proj.accentColor}; color: ${proj.accentColor};">SYSTEM ${proj.number}</span>
        <span class="ac-category">${proj.category}</span>
      </div>
      <h3 class="ac-title">${proj.title}</h3>
      <div class="ac-tagline" style="color: ${proj.accentColor}">${proj.tagline}</div>
      <p class="ac-desc">${proj.description}</p>
      
      <div class="ac-specs">
        ${metricsHTML}
      </div>

      <div class="ac-tags-wrap">
        ${techHTML}
      </div>

      <div class="ac-actions">
        <a href="${proj.liveUrl}" target="_blank" rel="noopener noreferrer" class="ac-btn" style="--btn-accent: ${proj.accentColor}">
          <span>Explore System</span>
          <span class="ac-arrow">→</span>
        </a>
        <a href="${proj.githubUrl}" target="_blank" rel="noopener noreferrer" class="ac-btn-sec" style="--btn-accent: ${proj.accentColor}">
          <span>GitHub Code</span>
          <span class="ac-arrow">↗</span>
        </a>
      </div>
    `;

    container.appendChild(card);
  });
}
