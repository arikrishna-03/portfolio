import * as THREE from 'three';

export function initArcadeGallery() {
  const container = document.getElementById('projects-ai');
  const canvas = document.getElementById('arcade-3d-canvas');
  if (!container || !canvas) return;

  const cards = document.querySelectorAll('.arcade-card');
  const progressFill = document.getElementById('arcade-progress-bar');
  const currentBadge = document.getElementById('arcade-active-badge');

  // --- RENDERER & SCENE SETUP ---
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x060a14);
  scene.fog = new THREE.FogExp2(0x060a14, 0.018);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = false;

  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 150);
  camera.position.set(0, 2.2, 5);

  // --- TEXTURE LOADER ---
  const textureLoader = new THREE.TextureLoader();

  // Helper: Create glowing text canvas texture for marquees
  function createMarqueeTexture(text, colorHex, subtext = 'ARCADE SYSTEM') {
    const cvs = document.createElement('canvas');
    cvs.width = 512;
    cvs.height = 128;
    const ctx = cvs.getContext('2d');

    // Dark cyber gradient background
    const grad = ctx.createLinearGradient(0, 0, 512, 128);
    grad.addColorStop(0, '#040711');
    grad.addColorStop(0.5, '#0a152e');
    grad.addColorStop(1, '#040711');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 128);

    // Outer neon glow border
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 6;
    ctx.strokeRect(6, 6, 500, 116);

    // Glowing main text
    ctx.shadowColor = colorHex;
    ctx.shadowBlur = 18;
    ctx.font = 'bold 44px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 54);

    // Subtext
    ctx.shadowBlur = 8;
    ctx.font = '600 16px "Roboto Mono", monospace';
    ctx.fillStyle = colorHex;
    ctx.letterSpacing = '4px';
    ctx.fillText(subtext, 256, 94);

    const tex = new THREE.CanvasTexture(cvs);
    tex.needsUpdate = true;
    return tex;
  }

  // Helper: Create custom animated code canvas for Cabinet 3
  function createCodeMatrixCanvas() {
    const cvs = document.createElement('canvas');
    cvs.width = 512;
    cvs.height = 512;
    const ctx = cvs.getContext('2d');

    ctx.fillStyle = '#050914';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = '#ffca28';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, 492, 492);

    ctx.font = 'bold 28px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#ffca28';
    ctx.fillText('PORTFOLIO V2 // DUAL ENGINE', 30, 60);

    ctx.font = '16px "Roboto Mono", monospace';
    ctx.fillStyle = '#a0aec0';
    const lines = [
      '>> RUNTIME: Three.js WebGL + 0-Dep',
      '>> CODING CONSISTENCY: 1087 Solved',
      '>> ACTIVE CONTEST RATING: 1440',
      '>> GLOBAL LEADERBOARD: Verified #15,751',
      '>> ARCHITECTURE: Dual-Perspective Core',
      '>> GPU SHADER PASSES: 60 FPS Stable',
      '>> CODECHEF: 810+ Problems Validated',
      '>> GITHUB PIPELINE: CI/CD Active',
      '>> STATUS: System Fully Operational ●'
    ];
    lines.forEach((line, i) => {
      ctx.fillStyle = i === 0 ? '#67c7eb' : i === lines.length - 1 ? '#00ffaa' : '#cbd5e1';
      ctx.fillText(line, 30, 120 + i * 40);
    });

    const tex = new THREE.CanvasTexture(cvs);
    tex.needsUpdate = true;
    return tex;
  }

  // --- ENVIRONMENT & LIGHTING ---
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0x67c7eb, 1.4);
  dirLight.position.set(5, 12, 10);
  scene.add(dirLight);

  // 1. Neon Grid Floor
  const gridHelper = new THREE.GridHelper(140, 100, 0x67c7eb, 0x182a4d);
  gridHelper.position.y = -0.01;
  scene.add(gridHelper);

  // Reflective Floor
  const floorGeo = new THREE.PlaneGeometry(160, 160);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x040813,
    roughness: 0.35,
    metalness: 0.8,
  });
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.y = -0.02;
  scene.add(floorMesh);

  // 2. Distant Cyberpunk Skyscrapers
  const cityGroup = new THREE.Group();
  const buildingBoxGeo = new THREE.BoxGeometry(1, 1, 1);
  const bldgMat = new THREE.MeshStandardMaterial({
    color: 0x080f22,
    roughness: 0.6,
    metalness: 0.5,
  });

  const bldgColors = [0x67c7eb, 0x9333ea, 0x00ffaa, 0xffca28];
  for (let i = 0; i < 55; i++) {
    const bldg = new THREE.Mesh(buildingBoxGeo, bldgMat);
    const height = 12 + Math.random() * 32;
    const width = 3 + Math.random() * 5;
    const depth = 3 + Math.random() * 5;
    bldg.scale.set(width, height, depth);

    const side = Math.random() > 0.5 ? 1 : -1;
    const x = side * (12 + Math.random() * 35);
    const z = -65 + Math.random() * 85;
    bldg.position.set(x, height / 2, z);
    cityGroup.add(bldg);

    if (Math.random() > 0.3) {
      const colHex = bldgColors[Math.floor(Math.random() * bldgColors.length)];
      const stripGeo = new THREE.PlaneGeometry(width * 0.7, height * 0.7);
      const stripMat = new THREE.MeshBasicMaterial({
        color: colHex,
        transparent: true,
        opacity: 0.18 + Math.random() * 0.25,
      });
      const strip = new THREE.Mesh(stripGeo, stripMat);
      strip.position.set(x - (side * (width * 0.51)), height / 2, z);
      strip.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2;
      cityGroup.add(strip);
    }
  }
  scene.add(cityGroup);

  // 3. Glowing Laser Pillars / Neon Beams
  for (let i = 0; i < 18; i++) {
    const beamGeo = new THREE.CylinderGeometry(0.06, 0.06, 40, 8);
    const beamColor = i % 2 === 0 ? 0x67c7eb : 0x00ffaa;
    const beamMat = new THREE.MeshBasicMaterial({
      color: beamColor,
      transparent: true,
      opacity: 0.65,
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    const side = i % 2 === 0 ? 1 : -1;
    beam.position.set(side * (7.5 + (i % 3) * 2), 20, -i * 3.8);
    scene.add(beam);
  }

  // 4. Floating Cyber Particles
  const particleCount = 200;
  const particleGeo = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePos[i] = (Math.random() - 0.5) * 35;
    particlePos[i + 1] = Math.random() * 14;
    particlePos[i + 2] = -Math.random() * 65;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x67c7eb,
    size: 0.12,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
  });
  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // --- PROCEDURAL 3D ARCADE CABINET GENERATOR ---
  function buildArcadeCabinet({ name, screenTex, marqueeText, subtext, colorHex }) {
    const cabinetGroup = new THREE.Group();

    // 1. Cabinet Body Material
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x090e1c,
      roughness: 0.35,
      metalness: 0.85,
    });

    // 2. Base Pedestal
    const baseGeo = new THREE.BoxGeometry(2.0, 1.2, 2.0);
    const baseMesh = new THREE.Mesh(baseGeo, bodyMat);
    baseMesh.position.y = 0.6;
    cabinetGroup.add(baseMesh);

    // 3. Middle Housing (Kiosk upper body)
    const midGeo = new THREE.BoxGeometry(1.9, 2.2, 1.7);
    const midMesh = new THREE.Mesh(midGeo, bodyMat);
    midMesh.position.set(0, 2.3, -0.1);
    cabinetGroup.add(midMesh);

    // 4. Slanted Control Deck
    const deckGeo = new THREE.BoxGeometry(2.1, 0.22, 1.1);
    const deckMesh = new THREE.Mesh(deckGeo, bodyMat);
    deckMesh.position.set(0, 1.45, 0.7);
    deckMesh.rotation.x = 0.2;
    cabinetGroup.add(deckMesh);

    // Glowing Buttons on Deck
    const buttonMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: 0.85,
      roughness: 0.2,
    });
    const btnGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.06, 12);
    const btnOffsets = [-0.45, -0.25, -0.05, 0.15, 0.35];
    btnOffsets.forEach((bx) => {
      const b1 = new THREE.Mesh(btnGeo, buttonMat);
      b1.position.set(bx, 1.58, 0.62);
      b1.rotation.x = 0.2;
      cabinetGroup.add(b1);

      const b2 = new THREE.Mesh(btnGeo, buttonMat);
      b2.position.set(bx + 0.05, 1.54, 0.8);
      b2.rotation.x = 0.2;
      cabinetGroup.add(b2);
    });

    // Glowing Joystick
    const stickShaftGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8);
    const stickShaft = new THREE.Mesh(stickShaftGeo, new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9 }));
    stickShaft.position.set(-0.65, 1.66, 0.65);
    cabinetGroup.add(stickShaft);

    const stickBallGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const stickBall = new THREE.Mesh(stickBallGeo, new THREE.MeshBasicMaterial({ color: colorHex }));
    stickBall.position.set(-0.65, 1.82, 0.65);
    cabinetGroup.add(stickBall);

    // 5. CRT / Display Screen
    const screenFrameGeo = new THREE.BoxGeometry(1.68, 1.45, 0.1);
    const screenFrameMat = new THREE.MeshStandardMaterial({ color: 0x050811, roughness: 0.8 });
    const screenFrame = new THREE.Mesh(screenFrameGeo, screenFrameMat);
    screenFrame.position.set(0, 2.5, 0.62);
    screenFrame.rotation.x = -0.18;
    cabinetGroup.add(screenFrame);

    // Screen Texture Plane (Emissive monitor image)
    const screenPlaneGeo = new THREE.PlaneGeometry(1.56, 1.34);
    const screenPlaneMat = new THREE.MeshStandardMaterial({
      map: screenTex,
      emissive: 0xffffff,
      emissiveMap: screenTex,
      emissiveIntensity: 0.95,
      roughness: 0.15,
      metalness: 0.1,
    });
    const screenPlane = new THREE.Mesh(screenPlaneGeo, screenPlaneMat);
    screenPlane.position.set(0, 2.5, 0.68);
    screenPlane.rotation.x = -0.18;
    cabinetGroup.add(screenPlane);

    // Screen Bezel Glass Glare
    const glareGeo = new THREE.PlaneGeometry(1.56, 1.34);
    const glareMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
    });
    const glarePlane = new THREE.Mesh(glareGeo, glareMat);
    glarePlane.position.set(0, 2.5, 0.685);
    glarePlane.rotation.x = -0.18;
    cabinetGroup.add(glarePlane);

    // 6. Top Marquee Header (Glowing marquee sign)
    const marqueeTex = createMarqueeTexture(marqueeText, '#' + colorHex.toString(16).padStart(6, '0'), subtext);
    const marqueeGeo = new THREE.BoxGeometry(1.85, 0.65, 0.7);
    const marqueeMesh = new THREE.Mesh(marqueeGeo, bodyMat);
    marqueeMesh.position.set(0, 3.65, 0.42);
    marqueeMesh.rotation.x = 0.1;
    cabinetGroup.add(marqueeMesh);

    // Front illuminated marquee face
    const marqueeFaceGeo = new THREE.PlaneGeometry(1.75, 0.55);
    const marqueeFaceMat = new THREE.MeshBasicMaterial({
      map: marqueeTex,
    });
    const marqueeFace = new THREE.Mesh(marqueeFaceGeo, marqueeFaceMat);
    marqueeFace.position.set(0, 3.65, 0.78);
    marqueeFace.rotation.x = 0.1;
    cabinetGroup.add(marqueeFace);

    // 7. Glowing Neon Trim Strips (Side Pillars & Header Borders)
    const trimMat = new THREE.MeshBasicMaterial({
      color: colorHex,
    });

    const tubeGeo = new THREE.CylinderGeometry(0.03, 0.03, 3.5, 8);
    const leftTube = new THREE.Mesh(tubeGeo, trimMat);
    leftTube.position.set(-0.95, 2.1, 0.75);
    cabinetGroup.add(leftTube);

    const rightTube = new THREE.Mesh(tubeGeo, trimMat);
    rightTube.position.set(0.95, 2.1, 0.75);
    cabinetGroup.add(rightTube);

    const barTopGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.9, 8);
    const barTop = new THREE.Mesh(barTopGeo, trimMat);
    barTop.rotation.z = Math.PI / 2;
    barTop.position.set(0, 3.96, 0.8);
    cabinetGroup.add(barTop);

    // Under-glow floor ring
    const underGlowGeo = new THREE.RingGeometry(0.8, 1.8, 32);
    const underGlowMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    const underGlow = new THREE.Mesh(underGlowGeo, underGlowMat);
    underGlow.rotation.x = -Math.PI / 2;
    underGlow.position.y = 0.02;
    cabinetGroup.add(underGlow);

    // Machine Dedicated Point Light
    const machineLight = new THREE.PointLight(colorHex, 1.8, 8);
    machineLight.position.set(0, 2.6, 1.6);
    cabinetGroup.add(machineLight);

    return cabinetGroup;
  }

  // --- BUILD 3 PROJECT CABINETS ---
  const texAttendance = textureLoader.load('./images/ai_attendance.png');
  const texRural = textureLoader.load('./images/ai_rural.png');
  const texPortfolio = createCodeMatrixCanvas();

  // Cabinet 1: Smart Attendance (Right side, facing slightly left)
  const cab1 = buildArcadeCabinet({
    name: 'Smart Attendance',
    screenTex: texAttendance,
    marqueeText: 'SMART ATTENDANCE',
    subtext: 'VISION & EMOTION AI // 2026',
    colorHex: 0x67c7eb,
  });
  cab1.position.set(2.8, 0, -8);
  cab1.rotation.y = -0.38;
  scene.add(cab1);

  // Cabinet 2: Gramin Sahay (Left side, facing slightly right)
  const cab2 = buildArcadeCabinet({
    name: 'Gramin Sahay',
    screenTex: texRural,
    marqueeText: 'GRAMIN SAHAY',
    subtext: 'MULTILINGUAL VOICE AI',
    colorHex: 0x00ffaa,
  });
  cab2.position.set(-2.8, 0, -25);
  cab2.rotation.y = 0.38;
  scene.add(cab2);

  // Cabinet 3: Dual Portfolio (Right side, facing slightly left)
  const cab3 = buildArcadeCabinet({
    name: 'Dual Portfolio',
    screenTex: texPortfolio,
    marqueeText: 'DUAL PORTFOLIO',
    subtext: 'FULL-STACK DUAL CORE',
    colorHex: 0xffca28,
  });
  cab3.position.set(2.8, 0, -42);
  cab3.rotation.y = -0.38;
  scene.add(cab3);

  // --- CAMERA SPLINE PATH & TARGET STATIONS ---
  const pathPoints = [
    new THREE.Vector3(0, 2.4, 2),        // 0.0: Entrance corridor
    new THREE.Vector3(-0.9, 2.5, -5.2),   // 0.28: Station 1 (Focus Cab 1)
    new THREE.Vector3(0.9, 2.5, -22.0),   // 0.60: Station 2 (Focus Cab 2)
    new THREE.Vector3(-0.9, 2.5, -39.0),  // 0.88: Station 3 (Focus Cab 3)
    new THREE.Vector3(0, 4.2, -54.0),     // 1.0: Pull-back overview transition
  ];

  const lookAtPoints = [
    new THREE.Vector3(0, 2.4, -12),
    new THREE.Vector3(2.8, 2.5, -8),      // Look at Cab 1 screen
    new THREE.Vector3(-2.8, 2.5, -25),    // Look at Cab 2 screen
    new THREE.Vector3(2.8, 2.5, -42),     // Look at Cab 3 screen
    new THREE.Vector3(0, 1.5, -60),       // Look down vista
  ];

  const cameraPath = new THREE.CatmullRomCurve3(pathPoints);
  const lookAtPath = new THREE.CatmullRomCurve3(lookAtPoints);

  // --- MOUSE PARALLAX ---
  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // --- SCROLL INTERPOLATION & CONTROLLER ---
  let currentProgress = 0;
  let targetProgress = 0;
  let activeCabinetIdx = -1;

  function updateScrollProgress() {
    const rect = container.getBoundingClientRect();
    const totalDist = container.offsetHeight - window.innerHeight;
    if (totalDist <= 0) return;

    const rawProgress = -rect.top / totalDist;
    targetProgress = Math.max(0, Math.min(rawProgress, 1));
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  function updateActiveCard(progress) {
    let newIdx = -1;
    if (progress >= 0.12 && progress < 0.44) {
      newIdx = 0; // Smart Attendance
    } else if (progress >= 0.44 && progress < 0.74) {
      newIdx = 1; // Gramin Sahay
    } else if (progress >= 0.74 && progress < 0.96) {
      newIdx = 2; // Dual Portfolio
    } else {
      newIdx = -1; // Transitions
    }

    if (newIdx !== activeCabinetIdx) {
      activeCabinetIdx = newIdx;
      cards.forEach((card, idx) => {
        if (idx === activeCabinetIdx) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });

      if (currentBadge) {
        if (activeCabinetIdx === 0) currentBadge.textContent = 'STATION 01 // COMPUTER VISION';
        else if (activeCabinetIdx === 1) currentBadge.textContent = 'STATION 02 // MULTILINGUAL AI';
        else if (activeCabinetIdx === 2) currentBadge.textContent = 'STATION 03 // FULL-STACK SYSTEM';
        else currentBadge.textContent = '3D ARCADE LAB // SCROLL TO EXPLORE';
      }
    }

    if (progressFill) {
      progressFill.style.width = `${(progress * 100).toFixed(1)}%`;
    }
  }

  // --- RESIZE HANDLER ---
  function onWindowResize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  window.addEventListener('resize', onWindowResize);

  // --- INTERSECTION OBSERVER FOR 0% CPU OFF-SCREEN ---
  let isVisible = true;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
    });
  }, { threshold: 0.05 });
  observer.observe(container);

  // --- ANIMATION LOOP ---
  const currentCamPos = new THREE.Vector3().copy(pathPoints[0]);
  const currentLookAt = new THREE.Vector3().copy(lookAtPoints[0]);
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;

    const time = clock.getElapsedTime();

    currentProgress += (targetProgress - currentProgress) * 0.07;
    updateActiveCard(currentProgress);

    const t = Math.max(0, Math.min(currentProgress, 0.999));
    const targetCamPos = cameraPath.getPointAt(t);
    const targetLookAt = lookAtPath.getPointAt(t);

    targetCamPos.x += mouseX * 0.25;
    targetCamPos.y += -mouseY * 0.15;

    currentCamPos.lerp(targetCamPos, 0.08);
    currentLookAt.lerp(targetLookAt, 0.08);

    camera.position.copy(currentCamPos);
    camera.lookAt(currentLookAt);

    // Floating particles drift
    const positions = particleGeo.attributes.position.array;
    for (let i = 1; i < particleCount * 3; i += 3) {
      positions[i] -= 0.015;
      if (positions[i] < 0) positions[i] = 14;
    }
    particleGeo.attributes.position.needsUpdate = true;

    // Subtle gentle arcade idle breathe
    cab1.position.y = Math.sin(time * 1.5) * 0.02;
    cab2.position.y = Math.sin(time * 1.5 + 1) * 0.02;
    cab3.position.y = Math.sin(time * 1.5 + 2) * 0.02;

    renderer.render(scene, camera);
  }

  animate();
}
