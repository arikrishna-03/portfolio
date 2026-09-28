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

  // Mobile mode: No arcade machine, no 3D world (2D Selected Work is active instead)
  if (window.innerWidth <= 820) {
    return null;
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

  const initAspect = initW / initH;
  const initialFov = initAspect < 0.65 ? 58 : (initAspect < 0.85 ? 52 : (initAspect < 1.15 ? 48 : 44));
  const camera = new THREE.PerspectiveCamera(
    initialFov,
    initAspect,
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
  // ═══════════════════════════════════════════════════════════════════════
  // 3. 3D HOLOGRAPHIC PROJECTION STATIONS & FLOATING CORES
  // ═══════════════════════════════════════════════════════════════════════
  const projectMeshes = [];

  // Helper to create holographic HUD header badge texture
  function createHoloBadgeTexture(number, category, colorHex) {
    const cvs = document.createElement('canvas');
    cvs.width = 512;
    cvs.height = 120;
    const ctx = cvs.getContext('2d');

    // Translucent dark glass backdrop
    ctx.fillStyle = 'rgba(5, 11, 26, 0.88)';
    ctx.fillRect(6, 6, 500, 108);

    // Glowing cyber neon border
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 3;
    ctx.strokeRect(6, 6, 500, 108);

    // Tech corner ticks
    ctx.fillStyle = colorHex;
    ctx.fillRect(0, 0, 16, 4);
    ctx.fillRect(0, 0, 4, 16);
    ctx.fillRect(496, 0, 16, 4);
    ctx.fillRect(508, 0, 4, 16);
    ctx.fillRect(0, 116, 16, 4);
    ctx.fillRect(0, 100, 4, 16);
    ctx.fillRect(496, 116, 16, 4);
    ctx.fillRect(508, 100, 4, 16);

    ctx.shadowColor = colorHex;
    ctx.shadowBlur = 18;
    ctx.font = 'bold 34px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`SYSTEM ${number}`, 256, 44);

    ctx.shadowBlur = 6;
    ctx.font = '600 13px "Roboto Mono", monospace';
    ctx.fillStyle = colorHex;
    ctx.fillText(`[ ${category} ]`, 256, 86);

    const tex = new THREE.CanvasTexture(cvs);
    tex.needsUpdate = true;
    return tex;
  }

  // Helper to create holographic HUD scanline and target crosshair overlay
  function createHoloScanlineTexture(colorHex) {
    const cvs = document.createElement('canvas');
    cvs.width = 512;
    cvs.height = 384;
    const ctx = cvs.getContext('2d');

    // Subtle horizontal scanlines
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (let y = 0; y < 384; y += 4) {
      ctx.fillRect(0, y, 512, 1.5);
    }

    // Corner HUD Brackets
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 3.5;
    const len = 34;

    // Top-left
    ctx.beginPath();
    ctx.moveTo(12, 12 + len); ctx.lineTo(12, 12); ctx.lineTo(12 + len, 12);
    ctx.stroke();

    // Top-right
    ctx.beginPath();
    ctx.moveTo(500 - len, 12); ctx.lineTo(500, 12); ctx.lineTo(500, 12 + len);
    ctx.stroke();

    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(12, 372 - len); ctx.lineTo(12, 372); ctx.lineTo(12 + len, 372);
    ctx.stroke();

    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(500 - len, 372); ctx.lineTo(500, 372); ctx.lineTo(500, 372 - len);
    ctx.stroke();

    // Central crosshair & telemetry badge
    ctx.fillStyle = colorHex;
    ctx.font = '600 11px "Roboto Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ 3D HOLOGRAPHIC EMISSION // 60 FPS', 256, 26);

    const tex = new THREE.CanvasTexture(cvs);
    tex.needsUpdate = true;
    return tex;
  }

  // Helper to create volumetric beam vertical gradient texture
  function createHoloBeamTexture(colorHex) {
    const cvs = document.createElement('canvas');
    cvs.width = 128;
    cvs.height = 512;
    const ctx = cvs.getContext('2d');

    const grad = ctx.createLinearGradient(0, 512, 0, 0);
    grad.addColorStop(0, colorHex);
    grad.addColorStop(0.3, colorHex);
    grad.addColorStop(0.7, 'rgba(103, 199, 235, 0.25)');
    grad.addColorStop(1.0, 'rgba(103, 199, 235, 0.0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 512);

    // Vertical beam ray stripes
    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.fillRect(18, 0, 6, 512);
    ctx.fillRect(56, 0, 14, 512);
    ctx.fillRect(98, 0, 8, 512);

    const tex = new THREE.CanvasTexture(cvs);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.repeat.set(4, 1);
    tex.needsUpdate = true;
    return tex;
  }

  // Build each physical 3D Holographic Station
  projectsData.forEach((proj, idx) => {
    const group = new THREE.Group();
    const colorHex = proj.accentHex;
    const colorStr = proj.accentColor;

    // Cyber metal materials for low-profile ground projector
    const padMetalMat = new THREE.MeshStandardMaterial({
      color: 0x070e20,
      roughness: 0.25,
      metalness: 0.92,
    });
    const neonMat = new THREE.MeshBasicMaterial({
      color: colorHex,
    });

    // ─────────────────────────────────────────────────────────────
    // 1. SLEEK LOW-PROFILE GROUND EMITTER PLATFORM (BASE)
    // ─────────────────────────────────────────────────────────────
    // Beveled ground base disk
    const baseDiskGeo = new THREE.CylinderGeometry(1.6, 1.85, 0.14, 36);
    const baseDisk = new THREE.Mesh(baseDiskGeo, padMetalMat);
    baseDisk.position.y = 0.07;
    group.add(baseDisk);

    // Step-up inner disk
    const stepDiskGeo = new THREE.CylinderGeometry(1.15, 1.25, 0.06, 32);
    const stepDisk = new THREE.Mesh(stepDiskGeo, padMetalMat);
    stepDisk.position.y = 0.15;
    group.add(stepDisk);

    // Glowing Neon Ring 1 (Outer perimeter)
    const ring1Geo = new THREE.TorusGeometry(1.5, 0.022, 16, 48);
    const ring1Mesh = new THREE.Mesh(ring1Geo, neonMat);
    ring1Mesh.rotation.x = Math.PI / 2;
    ring1Mesh.position.y = 0.145;
    group.add(ring1Mesh);

    // Glowing Neon Ring 2 (Inner aperture)
    const ring2Geo = new THREE.TorusGeometry(0.85, 0.018, 16, 36);
    const ring2Mesh = new THREE.Mesh(ring2Geo, neonMat);
    ring2Mesh.rotation.x = Math.PI / 2;
    ring2Mesh.position.y = 0.185;
    group.add(ring2Mesh);

    // Optical Hologram Projector Lens / Aperture
    const lensGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.08, 32);
    const lensMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: colorHex,
      emissiveIntensity: 2.4,
      roughness: 0.1,
      metalness: 0.1,
    });
    const lensMesh = new THREE.Mesh(lensGeo, lensMat);
    lensMesh.position.y = 0.20;
    group.add(lensMesh);

    // 4 Angled Projector Focus Nodes around aperture
    for (let f = 0; f < 4; f++) {
      const angle = (f * Math.PI) / 2;
      const finGeo = new THREE.BoxGeometry(0.08, 0.14, 0.24);
      const fin = new THREE.Mesh(finGeo, padMetalMat);
      fin.position.set(Math.cos(angle) * 0.96, 0.20, Math.sin(angle) * 0.96);
      fin.rotation.y = -angle;
      group.add(fin);
    }

    // Ground Floor Under-Glow Halo
    const underGlowGeo = new THREE.RingGeometry(0.5, 2.9, 36);
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

    // ─────────────────────────────────────────────────────────────
    // 2. VOLUMETRIC HOLOGRAPHIC PROJECTION LIGHT CONE
    // ─────────────────────────────────────────────────────────────
    const beamTex = createHoloBeamTexture(colorStr);
    const beamGeo = new THREE.CylinderGeometry(1.5, 0.45, 2.25, 32, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      map: beamTex,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    beamMesh.position.y = 1.32;
    group.add(beamMesh);

    // Vertical Hologram Laser Filaments
    for (let b = 0; b < 4; b++) {
      const bAngle = (b * Math.PI) / 2 + Math.PI / 4;
      const rayGeo = new THREE.CylinderGeometry(0.009, 0.009, 2.25, 8);
      const rayMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
      });
      const ray = new THREE.Mesh(rayGeo, rayMat);
      ray.position.set(Math.cos(bAngle) * 0.36, 1.32, Math.sin(bAngle) * 0.36);
      group.add(ray);
    }

    // ─────────────────────────────────────────────────────────────
    // 3. FLOATING HOLOGRAPHIC ASSEMBLY (EYE LEVEL)
    // ─────────────────────────────────────────────────────────────
    const holoFloatGroup = new THREE.Group();
    holoFloatGroup.position.set(0, 2.45, 0.15);

    // A. Translucent Holographic Glass HUD Backing Panel
    const glassBackGeo = new THREE.BoxGeometry(2.35, 1.65, 0.03);
    const glassBackMat = new THREE.MeshStandardMaterial({
      color: 0x040816,
      roughness: 0.15,
      metalness: 0.9,
      transparent: true,
      opacity: 0.65,
    });
    const glassBack = new THREE.Mesh(glassBackGeo, glassBackMat);
    glassBack.rotation.x = -0.10;
    holoFloatGroup.add(glassBack);

    // B. Holographic Project Image Plane
    const screenTex = textureLoader.load(proj.image, (tex) => {
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
    });
    const screenPlaneGeo = new THREE.PlaneGeometry(2.22, 1.52);
    const screenPlaneMat = new THREE.MeshStandardMaterial({
      map: screenTex,
      emissive: 0xffffff,
      emissiveMap: screenTex,
      emissiveIntensity: 1.05,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.94,
    });
    const screenPlane = new THREE.Mesh(screenPlaneGeo, screenPlaneMat);
    screenPlane.position.set(0, 0, 0.025);
    screenPlane.rotation.x = -0.10;
    holoFloatGroup.add(screenPlane);

    // C. Holographic Scanline & HUD Crosshair Overlay
    const scanlineTex = createHoloScanlineTexture(colorStr);
    const scanlineGeo = new THREE.PlaneGeometry(2.22, 1.52);
    const scanlineMat = new THREE.MeshBasicMaterial({
      map: scanlineTex,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const scanlinePlane = new THREE.Mesh(scanlineGeo, scanlineMat);
    scanlinePlane.position.set(0, 0, 0.035);
    scanlinePlane.rotation.x = -0.10;
    holoFloatGroup.add(scanlinePlane);

    // D. Glowing Holographic Laser Perimeter Frame
    const frameGroup = new THREE.Group();
    frameGroup.rotation.x = -0.10;

    const tubeMat = new THREE.MeshBasicMaterial({ color: colorHex });
    const horizTubeGeo = new THREE.CylinderGeometry(0.016, 0.016, 2.26, 8);
    const vertTubeGeo = new THREE.CylinderGeometry(0.016, 0.016, 1.56, 8);

    const topTube = new THREE.Mesh(horizTubeGeo, tubeMat);
    topTube.rotation.z = Math.PI / 2;
    topTube.position.set(0, 0.78, 0.03);
    frameGroup.add(topTube);

    const btmTube = new THREE.Mesh(horizTubeGeo, tubeMat);
    btmTube.rotation.z = Math.PI / 2;
    btmTube.position.set(0, -0.78, 0.03);
    frameGroup.add(btmTube);

    const leftTube = new THREE.Mesh(vertTubeGeo, tubeMat);
    leftTube.position.set(-1.13, 0, 0.03);
    frameGroup.add(leftTube);

    const rightTube = new THREE.Mesh(vertTubeGeo, tubeMat);
    rightTube.position.set(1.13, 0, 0.03);
    frameGroup.add(rightTube);

    // Glowing Corner Nodes
    const cornerGeo = new THREE.SphereGeometry(0.038, 12, 12);
    [[-1.13, 0.78], [1.13, 0.78], [-1.13, -0.78], [1.13, -0.78]].forEach(([cx, cy]) => {
      const cNode = new THREE.Mesh(cornerGeo, tubeMat);
      cNode.position.set(cx, cy, 0.03);
      frameGroup.add(cNode);
    });
    holoFloatGroup.add(frameGroup);

    // E. Floating Holographic Marquee Header Badge
    const marqueeTex = createHoloBadgeTexture(proj.number, proj.category, colorStr);
    const marqueeGeo = new THREE.PlaneGeometry(2.1, 0.48);
    const marqueeMat = new THREE.MeshBasicMaterial({
      map: marqueeTex,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
    });
    const marqueeFace = new THREE.Mesh(marqueeGeo, marqueeMat);
    marqueeFace.position.set(0, 1.15, 0.06);
    marqueeFace.rotation.x = -0.05;
    holoFloatGroup.add(marqueeFace);

    // F. Nested Orbiting Holographic Gimbal Rings
    const orbitRing1Geo = new THREE.TorusGeometry(1.82, 0.012, 16, 54);
    const orbitRing1Mat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const orbitRing1 = new THREE.Mesh(orbitRing1Geo, orbitRing1Mat);
    orbitRing1.rotation.x = 0.28;
    orbitRing1.rotation.y = 0.20;
    holoFloatGroup.add(orbitRing1);

    const orbitRing2Geo = new THREE.TorusGeometry(1.68, 0.010, 16, 48);
    const orbitRing2Mat = new THREE.MeshBasicMaterial({
      color: 0x67c7eb,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const orbitRing2 = new THREE.Mesh(orbitRing2Geo, orbitRing2Mat);
    orbitRing2.rotation.x = -0.32;
    orbitRing2.rotation.z = 0.25;
    holoFloatGroup.add(orbitRing2);

    group.add(holoFloatGroup);

    // Dedicated Colored Point Light
    const pointLight = new THREE.PointLight(colorHex, 2.4, 12);
    pointLight.position.set(0, 2.5, 1.8);
    group.add(pointLight);

    // Position and orient in 3D scene
    group.position.set(proj.worldPos.x, proj.worldPos.y, proj.worldPos.z);
    group.rotation.y = proj.rotationY;

    scene.add(group);
    projectMeshes.push({
      group,
      holoFloatGroup,
      pointLight,
      underGlow,
      screenPlaneMat,
      beamMesh,
      orbitRing1,
      orbitRing2,
      originalY: proj.worldPos.y,
      originalHoloY: 2.45,
    });
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
  // so the stand is comfortably framed for all device viewports (mobile, tablet, desktop)
  function getDynamicLookAt(p) {
    const isMobile = (camera.aspect < 0.85) || window.innerWidth <= 820;
    const isTablet = !isMobile && ((camera.aspect < 1.18) || window.innerWidth <= 1024);

    // On mobile: aim directly at the centered hologram stand (x = -2.6 for left, 2.6 for right)
    // and lower (y = 1.55) so the floating hologram (y = 2.45) appears in the top 45% of the screen!
    const s1LookX = isMobile ? -2.4 : (isTablet ? -0.8 : 0.4);
    const s1LookY = isMobile ? 1.55 : 2.1;

    const s2LookX = isMobile ? 2.4 : (isTablet ? 0.8 : -0.4);
    const s2LookY = isMobile ? 1.55 : 2.1;

    const s3LookX = isMobile ? -2.4 : (isTablet ? -0.8 : 0.4);
    const s3LookY = isMobile ? 1.55 : 2.1;

    if (p < 0.10) {
      const factor = Math.max(0, p / 0.10);
      const startLook = new THREE.Vector3(0, 2.2, -10.0);
      const s1Look = new THREE.Vector3(s1LookX, s1LookY, -14.0);
      return new THREE.Vector3().lerpVectors(startLook, s1Look, factor);
    }
    if (p <= 0.30) {
      return new THREE.Vector3(s1LookX, s1LookY, -14.0);
    }
    if (p < 0.40) {
      const factor = (p - 0.30) / 0.10;
      const look1 = new THREE.Vector3(s1LookX, s1LookY, -14.0);
      const look2 = new THREE.Vector3(s2LookX, s2LookY, -36.0);
      return new THREE.Vector3().lerpVectors(look1, look2, factor);
    }
    if (p <= 0.58) {
      return new THREE.Vector3(s2LookX, s2LookY, -36.0);
    }
    if (p < 0.68) {
      const factor = (p - 0.58) / 0.10;
      const look2 = new THREE.Vector3(s2LookX, s2LookY, -36.0);
      const look3 = new THREE.Vector3(s3LookX, s3LookY, -58.0);
      return new THREE.Vector3().lerpVectors(look2, look3, factor);
    }
    if (p <= 0.80) {
      return new THREE.Vector3(s3LookX, s3LookY, -58.0);
    }
    if (p <= 0.88) {
      // Lerp from Station 3 stand to straight down the cyber corridor runway
      const factor = (p - 0.80) / 0.08;
      const look3 = new THREE.Vector3(s3LookX, s3LookY, -58.0);
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
          hudCurrentBadge.textContent = '3D HOLOGRAM MATRIX // EXTENDED RUNWAY';
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
            hudCurrentBadge.textContent = '3D HOLOGRAM // ENTERING SYSTEM 01';
          } else if (progress < 0.40) {
            hudCurrentBadge.textContent = '3D HOLOGRAM // TRAVELING TO SYSTEM 02';
          } else {
            hudCurrentBadge.textContent = '3D HOLOGRAM // TRAVELING TO SYSTEM 03';
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
          hudCurrentBadge.textContent = 'HOLOGRAM ARCHIVE COMPLETE // CODING CONSISTENCY';
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

    // Dynamic 3D Hologram Lighting, Beam & Glow modulation
    projectMeshes.forEach((meshObj, i) => {
      const isTarget = i === targetMeshIdx;
      const targetIntensity = isTarget ? 3.2 : 0.9;
      meshObj.pointLight.intensity += (targetIntensity - meshObj.pointLight.intensity) * 0.1;
      meshObj.underGlow.material.opacity += ((isTarget ? 0.65 : 0.22) - meshObj.underGlow.material.opacity) * 0.1;
      meshObj.screenPlaneMat.emissiveIntensity += ((isTarget ? 1.15 : 0.65) - meshObj.screenPlaneMat.emissiveIntensity) * 0.1;
      if (meshObj.beamMesh) {
        const targetBeam = isTarget ? 0.32 : 0.12;
        meshObj.beamMesh.material.opacity += (targetBeam - meshObj.beamMesh.material.opacity) * 0.1;
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 6. RESIZE HANDLER & INTERSECTION OBSERVER
  // ═══════════════════════════════════════════════════════════════════════
  function onResize() {
    if (window.innerWidth <= 820) {
      if (canvas.__destroyProjects3D) {
        canvas.__destroyProjects3D();
      }
      return;
    }
    canvas.style.removeProperty('width');
    canvas.style.removeProperty('height');
    const w = getViewportWidth();
    const h = getViewportHeight();
    const aspect = w / h;
    camera.aspect = aspect;

    // Dynamically adjust vertical FOV across device viewports
    // Narrow portrait mobile screens require wider vertical FOV so the horizontal view spans the full hologram
    if (aspect < 0.65) {
      camera.fov = 58;
    } else if (aspect < 0.85) {
      camera.fov = 52;
    } else if (aspect < 1.15) {
      camera.fov = 48;
    } else {
      camera.fov = 44;
    }

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

    const isMobile = (camera.aspect < 0.85) || window.innerWidth <= 820;
    const isTablet = !isMobile && ((camera.aspect < 1.18) || window.innerWidth <= 1024);

    // Responsive camera position adjustment for active stations
    if (isMobile) {
      if (currentProgress >= 0.10 && currentProgress <= 0.35) {
        // Station 1: center the left station (x = -2.8) in mobile view
        targetCamPos.x = -1.8;
        targetCamPos.y = 2.45;
        targetCamPos.z = -14.0 + 8.4;
      } else if (currentProgress >= 0.38 && currentProgress <= 0.62) {
        // Station 2: center the right station (x = 2.8) in mobile view
        targetCamPos.x = 1.8;
        targetCamPos.y = 2.45;
        targetCamPos.z = -36.0 + 8.4;
      } else if (currentProgress >= 0.65 && currentProgress <= 0.83) {
        // Station 3: center the left station (x = -2.8) in mobile view
        targetCamPos.x = -1.8;
        targetCamPos.y = 2.45;
        targetCamPos.z = -58.0 + 8.4;
      }
    } else if (isTablet) {
      if (currentProgress >= 0.10 && currentProgress <= 0.35) {
        targetCamPos.x = -0.3;
      } else if (currentProgress >= 0.38 && currentProgress <= 0.62) {
        targetCamPos.x = 0.3;
      } else if (currentProgress >= 0.65 && currentProgress <= 0.83) {
        targetCamPos.x = -0.3;
      }
    }

    // Subtle interactive mouse parallax (damped on touch/mobile)
    targetCamPos.x += mouseX * (isMobile ? 0.1 : 0.3);
    targetCamPos.y += -mouseY * (isMobile ? 0.05 : 0.15);

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

    // Dynamic 3D Hologram floating levitation & gimbal rings
    projectMeshes.forEach((meshObj, i) => {
      // 1. Floating organic levitation hover for hologram assembly
      if (meshObj.holoFloatGroup) {
        meshObj.holoFloatGroup.position.y = meshObj.originalHoloY + Math.sin(time * 1.8 + i * 1.4) * 0.08;
      }

      // 2. Orbiting Holographic Gimbal Rings
      if (meshObj.orbitRing1) {
        meshObj.orbitRing1.rotation.z += 0.012;
        meshObj.orbitRing1.rotation.y += 0.008;
      }
      if (meshObj.orbitRing2) {
        meshObj.orbitRing2.rotation.x += 0.010;
        meshObj.orbitRing2.rotation.z -= 0.014;
      }
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
