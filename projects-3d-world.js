/**
 * ═════════════════════════════════════════════════════════════════════════
 * RETRO CRT COMPUTER MONITOR & WINDOWS VISTA/7 DESKTOP SHOWCASE
 * Smooth scroll-driven zoom, authentic retro CRT chassis, and interactive desktop
 * ═════════════════════════════════════════════════════════════════════════
 */

export const projectsData = [
  {
    id: 1,
    number: '01',
    title: 'PoseAI // CAMERA AI',
    fileName: 'PoseAI.png',
    category: 'COMPUTER VISION & POSE INFERENCE',
    tagline: 'Context-aware mobile vision assistant optimizing subject composition & pose guidance',
    description:
      'Architected an intelligent mobile-camera application that scans scene context, lighting, and environment dynamics to recommend real-time photo poses tailored to specific subjects and framing.',
    metrics: [
      { label: 'VISION ENGINE', value: 'MediaPipe Pose + Custom CNN' },
      { label: 'FRAMEWORK', value: 'Flutter / Dart + Python Core' },
      { label: 'INFERENCE', value: 'Real-Time Edge Computer Vision' },
    ],
    technologies: ['Computer Vision', 'Flutter', 'Dart', 'Python', 'AI Inference', 'MediaPipe'],
    image: './images/ai_rural.png',
    liveUrl: 'https://github.com/arikrishna-03/PoseAI',
    githubUrl: 'https://github.com/arikrishna-03/PoseAI',
  },
  {
    id: 2,
    number: '02',
    title: 'Dual Portfolio // TELEMETRY',
    fileName: 'Portfolio.png',
    category: 'FULL-STACK WEBGL ARCHITECTURE',
    tagline: 'GPU-accelerated WebGL 3D world with live algorithmic telemetry sync',
    description:
      'Dual-perspective digital experience combining an AI engineering laboratory with a high-impact creative portfolio. Features GPU-accelerated WebGL 3D scroll world, 0-dependency state transitions, and live competitive coding telemetry.',
    metrics: [
      { label: 'GRAPHICS ENGINE', value: 'Three.js WebGL + Custom Shaders' },
      { label: 'SOLVED STATS', value: '500+ CodeChef // 70+ LeetCode' },
      { label: 'BUILD SPEED', value: 'Vite 8 + Automated CI/CD Sync' },
    ],
    technologies: ['Three.js', 'WebGL', 'JavaScript', 'Vite', 'REST API', 'GitHub Actions'],
    image: './images/hero_poster.png',
    liveUrl: 'https://github.com/arikrishna-03/portfolio',
    githubUrl: 'https://github.com/arikrishna-03/portfolio',
  },
  {
    id: 3,
    number: '03',
    title: 'EduTrack // ACADEMIC HUD',
    fileName: 'EduTrack.png',
    category: 'FULL-STACK DATA PLATFORM',
    tagline: 'Automated academic tracking & real-time competitive coding dashboard',
    description:
      'Full-stack telemetry platform featuring mentor and student dashboards. Replaced manual spreadsheets by automating live problem-solving data streams directly from CodeChef and LeetCode APIs into actionable analytics.',
    metrics: [
      { label: 'FRONTEND STACK', value: 'React.js + Tailwind CSS' },
      { label: 'BACKEND CORE', value: 'Node.js + Express + REST API' },
      { label: 'DATABASE', value: 'MongoDB Document Collections' },
    ],
    technologies: ['React.js', 'Node.js', 'MongoDB', 'REST API', 'Tailwind CSS', 'Vercel'],
    image: './images/before_after.png',
    liveUrl: 'https://edutr-ilnd-llvx5epyw-arikrishna-03s-projects.vercel.app',
    githubUrl: 'https://github.com/arikrishna-03/EDUTR',
  },
];

const specialContentData = {
  testimonials: {
    title: 'Client & Peer Recommendations',
    fileName: 'Testimonials',
    category: 'ENDORSEMENTS & COLLABORATIONS',
    tagline: 'Proven impact in machine learning, high-performance UI & system design',
    description:
      'Consistently delivered production-grade solutions bridging AI research and modern frontend engineering. Known for rapid algorithmic problem-solving and telemetry platforms.',
    items: [
      {
        author: 'Mentor & Engineering Lead',
        quote: '“Arikrishna demonstrated exceptional mastery in real-time edge computer vision and high-throughput telemetry pipelines.”',
        role: 'AI / Data Science Faculty',
      },
      {
        author: 'Collaborative Partner',
        quote: '“Transformed our manual academic spreadsheets into an automated real-time analytics hub with zero downtime.”',
        role: 'Full-Stack Team',
      },
    ],
  },
  faq: {
    title: 'About Arikrishna A // FAQ',
    fileName: 'FAQ.md',
    category: 'DEVELOPER PROFILE & SPECIFICATIONS',
    tagline: 'AI & Data Science Student · Multidisciplinary Creative Engineer',
    description:
      'Engineering intuitive, intelligent applications that bridge theoretical machine learning and state-of-the-art interactive web experiences.',
    details: [
      { label: 'FOCUS', value: 'Edge AI, Computer Vision, WebGL, Full-Stack' },
      { label: 'COMPETITIVE STATS', value: '500+ CodeChef Solved // 70+ LeetCode' },
      { label: 'LOCATION', value: 'Tamil Nadu, India' },
      { label: 'STATUS', value: 'Available for high-impact roles & collaborations' },
    ],
  },
  pricing: {
    title: 'Services & Verified Credentials',
    fileName: 'Pricing.html',
    category: 'CREDENTIALS & CAPABILITIES',
    tagline: 'Specialized services in modern full-stack development & AI prototyping',
    description:
      'Available for contract engineering, design-to-code implementations, and custom computer vision applications.',
    tiers: [
      { title: 'Interactive Web & 3D', detail: 'WebGL, Three.js, GPU animations, performance optimization' },
      { title: 'AI & Computer Vision', detail: 'Edge inference, pose estimation, data telemetry pipelines' },
      { title: 'Full-Stack Architecture', detail: 'React, Node.js, MongoDB, automated cloud CI/CD' },
    ],
  },
};

/**
 * Initializes the Retro CRT Computer Monitor Showcase
 */
export function initProjects3DWorld() {
  const container = document.getElementById('projects-ai');
  if (!container) return null;

  // Cleanup any previous instance
  if (container.__destroyRetroPC) {
    container.__destroyRetroPC();
  }

  // Mobile mode: Screen width <= 820px uses the clean 2D Selected Work list
  if (window.innerWidth <= 820) {
    return null;
  }

  const assembly = document.getElementById('retro-monitor-assembly');
  const introTitle = document.getElementById('retro-intro-title');
  const desktop = document.getElementById('retro-desktop');
  const windowEl = document.getElementById('retro-window');
  const windowTitle = document.getElementById('retro-window-title');
  const windowBody = document.getElementById('retro-window-body');
  const btnClose = document.getElementById('retro-btn-close');
  const btnMin = document.getElementById('retro-btn-min');
  const btnMax = document.getElementById('retro-btn-max');
  const clockEl = document.getElementById('retro-clock');
  const powerBtn = document.getElementById('retro-power-btn');
  const crtScreen = document.getElementById('retro-crt-screen');
  const topVents = container.querySelector('.retro-top-vents');
  const chin = container.querySelector('.retro-monitor-chin');
  const stand = container.querySelector('.retro-monitor-stand');
  const iconItems = container.querySelectorAll('.retro-icon-item');

  let activeItemType = null; // 'project' or 'special'
  let activeItemId = null;
  let isWindowMaximized = false;
  let isScreenPowered = true;

  // ═══════════════════════════════════════════════════════════════════════
  // 1. LIVE SYSTEM CLOCK (WINDOWS XP/VISTA/7 SYSTEM TRAY)
  // ═══════════════════════════════════════════════════════════════════════
  function updateClock() {
    if (!clockEl) return;
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const dateNum = now.getDate();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    clockEl.textContent = `${dayName}, ${monthName} ${dateNum}  ${hours}:${minutes} ${ampm}`;
  }
  updateClock();
  const clockInterval = setInterval(updateClock, 1000);

  // ═══════════════════════════════════════════════════════════════════════
  // 2. WINDOW CONTENT INJECTION & POP-UP LOGIC
  // ═══════════════════════════════════════════════════════════════════════
  function openProject(projectId) {
    const project = projectsData.find((p) => p.id === Number(projectId));
    if (!project || !windowEl || !windowBody || !windowTitle) return;

    activeItemType = 'project';
    activeItemId = projectId;

    windowTitle.textContent = `${project.fileName} - ${project.title}`;

    windowBody.innerHTML = `
      <div class="retro-win-img-wrap">
        <img src="${project.image}" alt="${project.title}" class="retro-win-img" />
      </div>
      <div class="retro-win-category">${project.category}</div>
      <h3 class="retro-win-title">${project.title}</h3>
      <p class="retro-win-tagline">${project.tagline}</p>
      <p class="retro-win-desc">${project.description}</p>
      
      <div class="retro-win-metrics">
        ${project.metrics
          .map(
            (m) => `
          <div class="retro-metric-box">
            <div class="retro-metric-label">${m.label}</div>
            <div class="retro-metric-value">${m.value}</div>
          </div>
        `
          )
          .join('')}
      </div>

      <div class="retro-win-techs">
        ${project.technologies.map((t) => `<span class="retro-tech-pill">${t}</span>`).join('')}
      </div>

      <div class="retro-win-actions">
        <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="retro-btn-action retro-btn-primary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
          <span>Live Demo</span>
        </a>
        <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="retro-btn-action retro-btn-secondary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
          <span>GitHub Source</span>
        </a>
      </div>
    `;

    renderTaskbarTab(project.fileName, '🖼️');
    showWindow();
  }

  function openSpecial(specialId) {
    const special = specialContentData[specialId];
    if (!special || !windowEl || !windowBody || !windowTitle) return;

    activeItemType = 'special';
    activeItemId = specialId;

    windowTitle.textContent = `${special.fileName} - ${special.title}`;

    if (specialId === 'testimonials') {
      windowBody.innerHTML = `
        <div class="retro-win-category">${special.category}</div>
        <h3 class="retro-win-title">${special.title}</h3>
        <p class="retro-win-tagline">${special.tagline}</p>
        <p class="retro-win-desc">${special.description}</p>
        <div style="display:flex; flex-direction:column; gap:0.65rem; margin-top:0.8rem;">
          ${special.items
            .map(
              (item) => `
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:0.75rem 0.9rem;">
              <p style="font-size:0.8rem; font-style:italic; color:#1e293b; margin-bottom:0.4rem;">${item.quote}</p>
              <div style="font-size:0.72rem; font-weight:700; color:#0284c7;">${item.author} <span style="color:#64748b; font-weight:500;">· ${item.role}</span></div>
            </div>
          `
            )
            .join('')}
        </div>
      `;
      renderTaskbarTab(special.fileName, '📁');
    } else if (specialId === 'faq') {
      windowBody.innerHTML = `
        <div class="retro-win-category">${special.category}</div>
        <h3 class="retro-win-title">${special.title}</h3>
        <p class="retro-win-tagline">${special.tagline}</p>
        <p class="retro-win-desc">${special.description}</p>
        <div class="retro-win-metrics" style="grid-template-columns:1fr; margin-top:0.8rem;">
          ${special.details
            .map(
              (d) => `
            <div class="retro-metric-box">
              <div class="retro-metric-label">${d.label}</div>
              <div class="retro-metric-value">${d.value}</div>
            </div>
          `
            )
            .join('')}
        </div>
        <div style="margin-top:0.8rem;">
          <a href="mailto:arikrishna309@gmail.com" class="retro-btn-action retro-btn-primary">
            <span>Contact Arikrishna</span>
          </a>
        </div>
      `;
      renderTaskbarTab(special.fileName, '📄');
    } else if (specialId === 'pricing') {
      windowBody.innerHTML = `
        <div class="retro-win-category">${special.category}</div>
        <h3 class="retro-win-title">${special.title}</h3>
        <p class="retro-win-tagline">${special.tagline}</p>
        <p class="retro-win-desc">${special.description}</p>
        <div style="display:flex; flex-direction:column; gap:0.6rem; margin-top:0.8rem;">
          ${special.tiers
            .map(
              (tier) => `
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:0.65rem 0.85rem;">
              <div style="font-size:0.82rem; font-weight:700; color:#0f172a; margin-bottom:0.15rem;">${tier.title}</div>
              <div style="font-size:0.75rem; color:#475569;">${tier.detail}</div>
            </div>
          `
            )
            .join('')}
        </div>
      `;
      renderTaskbarTab(special.fileName, '🌐');
    }

    showWindow();
  }

  function renderTaskbarTab(label, icon) {
    if (!taskbarApps) return;
    taskbarApps.innerHTML = `
      <div class="retro-taskbar-tab" id="retro-tab-active" title="Click to minimize or restore window">
        <span>${icon}</span>
        <span>${label}</span>
      </div>
    `;
    const tabEl = document.getElementById('retro-tab-active');
    if (tabEl) {
      tabEl.onclick = toggleMinimize;
    }
  }

  function showWindow() {
    if (!windowEl) return;
    windowEl.classList.remove('window-minimized');
    windowEl.classList.add('window-open');
    windowEl.setAttribute('aria-hidden', 'false');
  }

  function closeWindow() {
    if (!windowEl) return;
    windowEl.classList.remove('window-open', 'window-minimized');
    windowEl.setAttribute('aria-hidden', 'true');
    if (taskbarApps) taskbarApps.innerHTML = '';
    // Clear icon selections
    iconItems.forEach((item) => item.classList.remove('active-selected'));
  }

  function toggleMinimize() {
    if (!windowEl) return;
    if (windowEl.classList.contains('window-minimized')) {
      windowEl.classList.remove('window-minimized');
      windowEl.classList.add('window-open');
    } else {
      windowEl.classList.add('window-minimized');
    }
  }

  function toggleMaximize() {
    if (!windowEl) return;
    isWindowMaximized = !isWindowMaximized;
    if (isWindowMaximized) {
      windowEl.style.width = '96%';
      windowEl.style.maxHeight = '92%';
      windowEl.style.borderRadius = '4px';
    } else {
      windowEl.style.removeProperty('width');
      windowEl.style.removeProperty('max-height');
      windowEl.style.removeProperty('border-radius');
    }
  }

  // Bind window controls
  if (btnClose) btnClose.onclick = closeWindow;
  if (btnMin) btnMin.onclick = toggleMinimize;
  if (btnMax) btnMax.onclick = toggleMaximize;

  // Bind desktop icon clicks
  iconItems.forEach((icon) => {
    function handleIconTrigger() {
      iconItems.forEach((i) => i.classList.remove('active-selected'));
      icon.classList.add('active-selected');

      const projectId = icon.getAttribute('data-project-id');
      const specialId = icon.getAttribute('data-special-id');

      if (projectId) {
        openProject(projectId);
      } else if (specialId) {
        openSpecial(specialId);
      }
    }

    icon.addEventListener('click', handleIconTrigger);
    icon.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleIconTrigger();
      }
    });
  });

  // Start Orb click shows quick help or opens first project
  const startOrb = document.getElementById('retro-start-orb');
  if (startOrb) {
    startOrb.onclick = () => {
      openProject(1);
    };
  }

  // Monitor power button Easter Egg: subtle screen on/off flicker & red LED state
  if (powerBtn && crtScreen) {
    powerBtn.onclick = () => {
      isScreenPowered = !isScreenPowered;
      const powerLed = container.querySelector('.retro-power-led');
      if (!isScreenPowered) {
        crtScreen.style.transition = 'filter 0.3s ease, opacity 0.3s ease';
        crtScreen.style.filter = 'brightness(0)';
        crtScreen.style.opacity = '0.08';
        if (powerLed) {
          powerLed.style.background = '#440f0f';
          powerLed.style.boxShadow = 'none';
        }
      } else {
        crtScreen.style.filter = 'brightness(2.2)';
        crtScreen.style.opacity = '1';
        if (powerLed) {
          powerLed.style.background = '#ff2525';
          powerLed.style.boxShadow = '0 0 10px #ff2525, 0 0 3px #ffffff';
        }
        setTimeout(() => {
          crtScreen.style.filter = 'none';
        }, 250);
      }
    };
  }

  // Keyboard shortcut: ESC closes open window
  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      closeWindow();
    }
  }
  window.addEventListener('keydown', handleKeyDown);

  // ═══════════════════════════════════════════════════════════════════════
  // 3. SMOOTH SCROLL-DRIVEN ZOOM & MOTION PHYSICS
  // ═══════════════════════════════════════════════════════════════════════
  let isTicking = false;
  let smoothProgress = 0;
  let targetProgress = 0;
  let animFrameId = null;

  function calculateTargetProgress() {
    const rect = container.getBoundingClientRect();
    const maxScroll = container.offsetHeight - window.innerHeight;
    if (maxScroll <= 0) return 0;
    const current = -rect.top;
    return Math.max(0, Math.min(1, current / maxScroll));
  }

  function updateScrollMotion() {
    targetProgress = calculateTargetProgress();
    // Smooth lerp for liquid, stutter-free cinematic zoom
    smoothProgress += (targetProgress - smoothProgress) * 0.12;

    if (Math.abs(targetProgress - smoothProgress) < 0.0005) {
      smoothProgress = targetProgress;
    }

    // Phase 1: Entrance "Project Showcase" title (progress 0.00 -> 0.22)
    // Matches Image 1 when arriving at section
    if (introTitle) {
      if (smoothProgress <= 0.03) {
        introTitle.style.opacity = '1';
        introTitle.style.filter = 'blur(0px)';
        introTitle.style.transform = 'translateY(-50%)';
        introTitle.style.visibility = 'visible';
      } else if (smoothProgress < 0.22) {
        const titleFade = 1 - (smoothProgress - 0.03) / 0.17;
        const blurAmount = ((smoothProgress - 0.03) / 0.17) * 12;
        const offsetPx = ((smoothProgress - 0.03) / 0.17) * 35;
        introTitle.style.opacity = Math.max(0, titleFade).toFixed(3);
        introTitle.style.filter = `blur(${blurAmount.toFixed(1)}px)`;
        introTitle.style.transform = `translateY(calc(-50% - ${offsetPx.toFixed(1)}px)) translateX(-${(offsetPx * 0.6).toFixed(1)}px)`;
        introTitle.style.visibility = 'visible';
      } else {
        introTitle.style.opacity = '0';
        introTitle.style.filter = 'blur(14px)';
        introTitle.style.visibility = 'hidden';
      }
    }

    // Phase 2: Monitor Assembly Zoom & Transition (Matches Image 1 at start, Image 2 at scroll)
    if (assembly) {
      if (smoothProgress <= 0.03) {
        // Image 1: Entrance state - full 4:3 vintage monitor on right, Project Showcase on left
        assembly.classList.remove('zoomed-in-mode');
        assembly.style.transform = 'scale3d(0.68, 0.68, 1) translate3d(20%, 0, 0)';
        assembly.style.opacity = '1';
        if (topVents) topVents.style.opacity = '1';
        if (chin) chin.style.opacity = '1';
        if (stand) stand.style.opacity = '1';
      } else if (smoothProgress < 0.12) {
        // Zooming in: smoothly scale, center, and fade out top vents, chin, stand so ONLY wallpaper and side edges remain
        assembly.classList.remove('zoomed-in-mode');
        const t = (smoothProgress - 0.03) / 0.09;
        const ease = t * t * (3 - 2 * t);
        const currentScale = 0.68 + ease * (1.35 - 0.68);
        const currentTranslateX = 20 * (1 - ease);
        const currentTranslateY = ease * -8;
        assembly.style.transform = `scale3d(${currentScale.toFixed(3)}, ${currentScale.toFixed(3)}, 1) translate3d(${currentTranslateX.toFixed(2)}%, ${currentTranslateY.toFixed(2)}%, 0)`;
        assembly.style.opacity = '1';
        const edgeFade = Math.max(0, 1 - ease * 1.5);
        if (topVents) topVents.style.opacity = edgeFade.toFixed(2);
        if (chin) chin.style.opacity = edgeFade.toFixed(2);
        if (stand) stand.style.opacity = edgeFade.toFixed(2);
      } else if (smoothProgress <= 0.88) {
        // Image 2: Full Screen Edge-to-Edge - ONLY wallpaper and side edges visible! NO top edge, NO bottom chin/vents/badge/stand!
        assembly.classList.add('zoomed-in-mode');
        assembly.style.transform = 'none';
        assembly.style.opacity = '1';
      } else {
        // Smooth exit zoom into "Coding Consistency"
        assembly.classList.add('zoomed-in-mode');
        const exitT = (smoothProgress - 0.88) / 0.12;
        const exitEase = exitT * exitT;
        assembly.style.transform = `scale3d(${(1 - exitEase * 0.1).toFixed(3)}, ${(1 - exitEase * 0.1).toFixed(3)}, 1)`;
        assembly.style.opacity = Math.max(0, 1 - exitT * 1.4).toFixed(3);
      }
    }

    // Phase 3: Desktop interactivity zone
    if (desktop) {
      if (smoothProgress >= 0.28 && smoothProgress <= 0.92) {
        desktop.classList.add('active-zone');
      } else {
        desktop.classList.remove('active-zone');
      }
    }

    // Request next frame if still interpolating or scrolling
    animFrameId = requestAnimationFrame(updateScrollMotion);
  }

  // Start smooth animation loop
  animFrameId = requestAnimationFrame(updateScrollMotion);

  function handleResize() {
    if (window.innerWidth <= 820) {
      container.__destroyRetroPC?.();
    }
  }
  window.addEventListener('resize', handleResize);

  // Initial open: Auto-select first project for immediate visual wow
  setTimeout(() => {
    const firstIcon = container.querySelector('.retro-icon-item[data-project-id="1"]');
    if (firstIcon && !windowEl?.classList.contains('window-open')) {
      openProject(1);
    }
  }, 400);

  // Cleanup handler
  container.__destroyRetroPC = () => {
    if (animFrameId) cancelAnimationFrame(animFrameId);
    clearInterval(clockInterval);
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('resize', handleResize);
  };

  return container.__destroyRetroPC;
}
