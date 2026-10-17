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
    liveUrl: 'https://github.com/arikrishna-03',
    githubUrl: 'https://github.com/arikrishna-03',
  },
];

const specialContentData = {
  faq: {
    title: 'FAQ.md - Arikrishna A // FAQ',
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
    title: 'Pricing.html - Services & Credentials',
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
  const windowsContainer = document.getElementById('retro-windows-container');
  const clockEl = document.getElementById('retro-clock');
  const taskbarApps = document.getElementById('retro-taskbar-apps');
  const powerBtn = document.getElementById('retro-power-btn');
  const crtScreen = document.getElementById('retro-crt-screen');
  const topVents = container.querySelector('.retro-top-vents');
  const chin = container.querySelector('.retro-monitor-chin');
  const stand = container.querySelector('.retro-monitor-stand');
  const iconItems = container.querySelectorAll('.retro-icon-item');

  const openWindows = new Map();
  let highestZ = 30;
  let activeWindowKey = null;
  let isScreenPowered = false;

  // Initialize monitor in powered-off state (before entering main desktop)
  if (crtScreen) crtScreen.classList.add('screen-powered-off');
  const initialPowerLed = container.querySelector('.retro-power-led');
  if (initialPowerLed) initialPowerLed.classList.add('led-off');

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
  // 2. MULTI-WINDOW MANAGER (STACKED OVERLAPPING WINDOWS MATCHING IMAGE 2)
  // ═══════════════════════════════════════════════════════════════════════

  function renderTaskbar() {
    if (!taskbarApps) return;
    const entries = Array.from(openWindows.entries());
    if (entries.length === 0) {
      taskbarApps.innerHTML = '';
      return;
    }

    taskbarApps.innerHTML = entries
      .map(([key, winObj]) => {
        const isActive = key === activeWindowKey && !winObj.el.classList.contains('window-minimized');
        return `
          <div class="retro-taskbar-tab ${isActive ? 'taskbar-tab-active' : ''}" data-win-key="${key}" title="${winObj.config.fileName}">
            <span>${winObj.config.icon}</span>
            <span>${winObj.config.fileName}</span>
          </div>
        `;
      })
      .join('');

    taskbarApps.querySelectorAll('.retro-taskbar-tab').forEach((el) => {
      el.onclick = (e) => {
        e.stopPropagation();
        const key = el.getAttribute('data-win-key');
        const winObj = openWindows.get(key);
        if (!winObj) return;

        if (key === activeWindowKey && !winObj.el.classList.contains('window-minimized')) {
          // Toggle minimize
          winObj.el.classList.add('window-minimized');
          activeWindowKey = null;
          renderTaskbar();
          updateIconSelection();
        } else {
          // Restore & Focus
          winObj.el.classList.remove('window-minimized');
          bringToFront(key);
        }
      };
    });
  }

  function updateIconSelection() {
    iconItems.forEach((icon) => {
      const pId = icon.getAttribute('data-project-id');
      const sId = icon.getAttribute('data-special-id');
      if (
        (pId && activeWindowKey === `project-${pId}`) ||
        (sId && activeWindowKey === `special-${sId}`)
      ) {
        icon.classList.add('active-selected');
      } else {
        icon.classList.remove('active-selected');
      }
    });
  }

  function bringToFront(key) {
    const winObj = openWindows.get(key);
    if (!winObj) return;
    highestZ++;
    winObj.el.style.zIndex = highestZ;
    activeWindowKey = key;
    renderTaskbar();
    updateIconSelection();
  }

  function closeWindow(key) {
    const winObj = openWindows.get(key);
    if (!winObj) return;
    winObj.el.remove();
    openWindows.delete(key);

    if (activeWindowKey === key) {
      let nextKey = null;
      let maxZ = -1;
      for (const [k, obj] of openWindows.entries()) {
        if (!obj.el.classList.contains('window-minimized')) {
          const z = parseInt(obj.el.style.zIndex || '0', 10);
          if (z > maxZ) {
            maxZ = z;
            nextKey = k;
          }
        }
      }
      activeWindowKey = nextKey;
    }
    renderTaskbar();
    updateIconSelection();
  }

  function toggleMinimize(key) {
    const winObj = openWindows.get(key);
    if (!winObj) return;
    if (winObj.el.classList.contains('window-minimized')) {
      winObj.el.classList.remove('window-minimized');
      bringToFront(key);
    } else {
      winObj.el.classList.add('window-minimized');
      if (activeWindowKey === key) activeWindowKey = null;
      renderTaskbar();
      updateIconSelection();
    }
  }

  function toggleMaximize(key) {
    const winObj = openWindows.get(key);
    if (!winObj) return;
    winObj.el.classList.toggle('window-maximized');
  }

  function makeDraggable(winEl, titlebarEl) {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    function onPointerDown(e) {
      if (e.target.closest('.retro-window-controls') || e.target.closest('button')) {
        return;
      }
      isDragging = true;
      const key = winEl.getAttribute('data-win-key');
      if (key) bringToFront(key);

      const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
      const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);
      startX = clientX;
      startY = clientY;
      initialLeft = winEl.offsetLeft;
      initialTop = winEl.offsetTop;

      document.addEventListener('mousemove', onPointerMove);
      document.addEventListener('mouseup', onPointerUp);
      document.addEventListener('touchmove', onPointerMove, { passive: false });
      document.addEventListener('touchend', onPointerUp);
    }

    function onPointerMove(e) {
      if (!isDragging || !desktop) return;
      if (e.cancelable) e.preventDefault();
      const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
      const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);
      const dx = clientX - startX;
      const dy = clientY - startY;

      const maxLeft = Math.max(0, desktop.clientWidth - 100);
      const maxTop = Math.max(0, desktop.clientHeight - 40);

      const newLeft = Math.max(0, Math.min(maxLeft, initialLeft + dx));
      const newTop = Math.max(0, Math.min(maxTop, initialTop + dy));

      winEl.style.left = `${newLeft}px`;
      winEl.style.top = `${newTop}px`;
    }

    function onPointerUp() {
      isDragging = false;
      document.removeEventListener('mousemove', onPointerMove);
      document.removeEventListener('mouseup', onPointerUp);
      document.removeEventListener('touchmove', onPointerMove);
      document.removeEventListener('touchend', onPointerUp);
    }

    titlebarEl.addEventListener('mousedown', onPointerDown);
    titlebarEl.addEventListener('touchstart', onPointerDown, { passive: true });
  }

  function getProjectHtml(project) {
    return `
      <div class="retro-window-body">
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            <span>GitHub Source</span>
          </a>
        </div>
      </div>
    `;
  }

  function getFaqHtml() {
    const special = specialContentData.faq;
    return `
      <div class="retro-window-body">
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
      </div>
    `;
  }

  function getPricingHtml() {
    const special = specialContentData.pricing;
    return `
      <div class="retro-window-body">
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
      </div>
    `;
  }

  function openWindow(key, config) {
    if (!windowsContainer) return;

    if (openWindows.has(key)) {
      const winObj = openWindows.get(key);
      winObj.el.classList.remove('window-minimized');
      winObj.el.classList.add('window-open');
      bringToFront(key);
      return;
    }

    const winEl = document.createElement('div');
    winEl.className = 'retro-window window-open';
    winEl.id = `win-${key}`;
    winEl.setAttribute('data-win-key', key);

    // Initial staggered layout matching the user's second shared image
    if (config.initialStyle) {
      Object.assign(winEl.style, config.initialStyle);
    } else {
      const offset = openWindows.size * 28;
      winEl.style.left = `clamp(8%, ${14 + offset}px, 38%)`;
      winEl.style.top = `clamp(8%, ${12 + offset}px, 32%)`;
      winEl.style.width = '450px';
      winEl.style.maxHeight = '80%';
    }

    // Titlebar HTML matching Image 2
    winEl.innerHTML = `
      <div class="retro-window-titlebar">
        <div class="retro-window-controls">
          <button class="retro-ctrl-btn retro-ctrl-close" title="Close" aria-label="Close window"></button>
          <button class="retro-ctrl-diamond retro-ctrl-min" title="Minimize" aria-label="Minimize window"></button>
          <button class="retro-ctrl-diamond retro-ctrl-max" title="Maximize" aria-label="Maximize window"></button>
        </div>
        <div class="retro-window-title-text">${config.windowTitle}</div>
        <div style="width: 32px; flex-shrink: 0;"></div>
      </div>
      <div class="retro-window-content-slot"></div>
    `;

    const contentSlot = winEl.querySelector('.retro-window-content-slot');
    if (config.type === 'project') {
      const project = projectsData.find((p) => p.id === Number(config.id));
      if (project) {
        contentSlot.innerHTML = getProjectHtml(project);
      }
    } else if (config.type === 'faq') {
      contentSlot.innerHTML = getFaqHtml();
    } else if (config.type === 'pricing') {
      contentSlot.innerHTML = getPricingHtml();
    }

    // Bind controls
    const btnClose = winEl.querySelector('.retro-ctrl-close');
    const btnMin = winEl.querySelector('.retro-ctrl-min');
    const btnMax = winEl.querySelector('.retro-ctrl-max');
    const titlebar = winEl.querySelector('.retro-window-titlebar');

    if (btnClose) {
      btnClose.onclick = (e) => {
        e.stopPropagation();
        closeWindow(key);
      };
    }
    if (btnMin) {
      btnMin.onclick = (e) => {
        e.stopPropagation();
        toggleMinimize(key);
      };
    }
    if (btnMax) {
      btnMax.onclick = (e) => {
        e.stopPropagation();
        toggleMaximize(key);
      };
    }

    // Dragging
    makeDraggable(winEl, titlebar);

    // Focus on click
    winEl.addEventListener('mousedown', () => bringToFront(key));
    winEl.addEventListener('touchstart', () => bringToFront(key), { passive: true });

    windowsContainer.appendChild(winEl);
    openWindows.set(key, { el: winEl, config });

    bringToFront(key);
  }

  function openProject(projectId) {
    const project = projectsData.find((p) => p.id === Number(projectId));
    if (!project) return;

    let initialStyle = null;
    if (projectId === 1 || projectId === '1') {
      // PoseAI.png - Left side (matches user's Image 2)
      initialStyle = { left: '3%', top: '4.5%', width: 'min(440px, 46%)', maxHeight: '85%' };
    } else if (projectId === 2 || projectId === '2') {
      // Portfolio.png - Dual Portfolio // TELEMETRY (Left window in Image 1)
      initialStyle = { left: '3.5%', top: '4%', width: 'min(455px, 46%)', maxHeight: '85%' };
    } else if (projectId === 3 || projectId === '3') {
      // EduTrack.png - EduTrack // ACADEMIC HUD (Right window in Image 1)
      initialStyle = { left: '50.5%', top: '4%', width: 'min(455px, 46%)', maxHeight: '85%' };
    }

    openWindow(`project-${project.id}`, {
      type: 'project',
      id: project.id,
      windowTitle: `${project.fileName} - ${project.title}`,
      fileName: project.fileName,
      icon: '🖼️',
      initialStyle,
    });
  }

  function openSpecial(specialId) {
    const special = specialContentData[specialId];
    if (!special) return;

    const meta = {
      faq: {
        icon: '📄',
        windowTitle: special.title,
        initialStyle: { left: '18%', top: '12%', width: '440px', maxHeight: '78%' },
      },
      pricing: {
        icon: '🌐',
        windowTitle: special.title,
        initialStyle: { left: '15%', top: '15%', width: '450px', maxHeight: '78%' },
      },
    };

    const m = meta[specialId] || { icon: '📄', windowTitle: special.title };

    openWindow(`special-${specialId}`, {
      type: specialId,
      id: specialId,
      windowTitle: m.windowTitle,
      fileName: special.fileName,
      icon: m.icon,
      initialStyle: m.initialStyle,
    });
  }

  // Bind desktop icon clicks
  iconItems.forEach((icon) => {
    function handleIconTrigger(e) {
      if (e && e.stopPropagation) {
        e.stopPropagation();
      }
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
    icon.addEventListener('dblclick', handleIconTrigger);
    icon.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleIconTrigger(e);
      }
    });
  });

  // Clicking on desktop wallpaper background deselects icons
  if (desktop) {
    desktop.addEventListener('click', (e) => {
      if (
        !e.target.closest('.retro-icon-item') &&
        !e.target.closest('.retro-window') &&
        !e.target.closest('.retro-taskbar')
      ) {
        iconItems.forEach((i) => i.classList.remove('active-selected'));
      }
    });
  }

  // Start Orb click opens first project
  const startOrb = document.getElementById('retro-start-orb');
  if (startOrb) {
    startOrb.onclick = () => {
      openProject(1);
    };
  }

  // Monitor power button Easter Egg: screen on/off toggle & red LED state
  if (powerBtn && crtScreen) {
    powerBtn.onclick = () => {
      isScreenPowered = !isScreenPowered;
      const powerLed = container.querySelector('.retro-power-led');
      if (!isScreenPowered) {
        crtScreen.classList.add('screen-powered-off');
        if (powerLed) powerLed.classList.add('led-off');
      } else {
        crtScreen.classList.remove('screen-powered-off');
        if (powerLed) powerLed.classList.remove('led-off');
      }
    };
  }

  // Keyboard shortcut: ESC closes the active front window
  function handleKeyDown(e) {
    if (e.key === 'Escape' && activeWindowKey) {
      closeWindow(activeWindowKey);
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
    // Smooth lerp for liquid, stutter-free cinematic motion
    smoothProgress += (targetProgress - smoothProgress) * 0.12;

    if (Math.abs(targetProgress - smoothProgress) < 0.0005) {
      smoothProgress = targetProgress;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 4-STAGE ORCHESTRATION MATCHING USER'S 4 REFERENCE IMAGES:
    // Image 1: Entrance from Tech Stack (Title on left, Monitor on right)
    // Image 2: Zoom in to Full Screen interactive desktop
    // Image 3: Zoom out to center upright monitor
    // Image 4: Glide up, power screen off & transition to Coding Consistency
    // ═══════════════════════════════════════════════════════════════════════
    if (assembly) {
      if (smoothProgress <= 0.18) {
        // ─────────────────────────────────────────────────────────────────
        // STAGE 1 (Image 1): ENTRANCE FROM TECH STACK
        // Left: "Project Showcase" title + "SCROLL TO EXPLORE ↓"
        // Right: Standalone CRT monitor at ~0.72 scale, shifted right
        // ─────────────────────────────────────────────────────────────────
        assembly.classList.remove('zoomed-in-mode');
        assembly.style.transform = 'scale3d(0.72, 0.72, 1) translate3d(25vw, 0, 0)';
        assembly.style.opacity = '1';
        assembly.style.visibility = 'visible';

        if (introTitle) {
          introTitle.style.opacity = '1';
          introTitle.style.visibility = 'visible';
          introTitle.style.transform = 'translateY(-50%)';
        }
      } else if (smoothProgress <= 0.35) {
        // ─────────────────────────────────────────────────────────────────
        // TRANSITION STAGE 1 -> STAGE 2:
        // Smoothly zoom in & center into the screen from the right
        // ─────────────────────────────────────────────────────────────────
        assembly.classList.remove('zoomed-in-mode');
        const t = (smoothProgress - 0.18) / 0.17;
        const ease = t * t * (3 - 2 * t);
        const scale = 0.72 + ease * (1.35 - 0.72);
        const transX = (1 - ease) * 25;
        assembly.style.transform = `scale3d(${scale.toFixed(3)}, ${scale.toFixed(3)}, 1) translate3d(${transX.toFixed(2)}vw, 0, 0)`;
        assembly.style.opacity = '1';
        assembly.style.visibility = 'visible';

        if (introTitle) {
          const titleOpacity = Math.max(0, 1 - ease * 1.35);
          introTitle.style.opacity = titleOpacity.toFixed(2);
          introTitle.style.transform = `translateY(calc(-50% - ${(ease * 25).toFixed(1)}px))`;
          if (titleOpacity <= 0) {
            introTitle.style.visibility = 'hidden';
          } else {
            introTitle.style.visibility = 'visible';
          }
        }
      } else if (smoothProgress <= 0.58) {
        // ─────────────────────────────────────────────────────────────────
        // STAGE 2 (MAIN): FULL SCREEN INTERACTIVE DESKTOP
        // Edge-to-edge bliss desktop, project cards side-by-side, interactive
        // ─────────────────────────────────────────────────────────────────
        assembly.classList.add('zoomed-in-mode');
        assembly.style.transform = 'none';
        assembly.style.opacity = '1';
        assembly.style.visibility = 'visible';

        if (introTitle) {
          introTitle.style.opacity = '0';
          introTitle.style.visibility = 'hidden';
        }
      } else if (smoothProgress <= 0.72) {
        // ─────────────────────────────────────────────────────────────────
        // STAGE 3: ZOOM OUT FROM MAIN TO CENTER UPRIGHT (SCREEN POWERS OFF)
        // ─────────────────────────────────────────────────────────────────
        assembly.classList.remove('zoomed-in-mode');
        const t = (smoothProgress - 0.58) / 0.14;
        const ease = t * t * (3 - 2 * t);
        const scale = 1.35 - ease * (1.35 - 0.76);
        assembly.style.transform = `scale3d(${scale.toFixed(3)}, ${scale.toFixed(3)}, 1) translate3d(0, 0, 0)`;
        assembly.style.opacity = '1';
        assembly.style.visibility = 'visible';

        if (introTitle) {
          introTitle.style.opacity = '0';
          introTitle.style.visibility = 'hidden';
        }
      } else if (smoothProgress <= 0.85) {
        // ─────────────────────────────────────────────────────────────────
        // STAGE 4: MONITOR TILTS A LITTLE BIT IN 3D PERSPECTIVE
        // ─────────────────────────────────────────────────────────────────
        assembly.classList.remove('zoomed-in-mode');
        const tTilt = (smoothProgress - 0.72) / 0.13;
        const easeTilt = tTilt * tTilt * (3 - 2 * tTilt);
        const scale = 0.76 - easeTilt * 0.02;
        const rotY = easeTilt * 7.5;
        const rotX = easeTilt * 4.2;
        assembly.style.transform = `scale3d(${scale.toFixed(3)}, ${scale.toFixed(3)}, 1) perspective(1200px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) translate3d(0, 0, 0)`;
        assembly.style.opacity = '1';
        assembly.style.visibility = 'visible';

        if (introTitle) {
          introTitle.style.opacity = '0';
          introTitle.style.visibility = 'hidden';
        }
      } else {
        // ─────────────────────────────────────────────────────────────────
        // STAGE 5: AND THEN SCROLL DOWN (GLIDES UP AS CODING CONSISTENCY ENTERS)
        // ─────────────────────────────────────────────────────────────────
        assembly.classList.remove('zoomed-in-mode');
        const tScroll = (smoothProgress - 0.85) / 0.15;
        const easeScroll = tScroll * tScroll * (3 - 2 * tScroll);
        const scale = 0.74 - easeScroll * 0.04;
        const transY = -easeScroll * 28;
        const rotY = 7.5 - easeScroll * 2.0;
        const rotX = 4.2 - easeScroll * 1.5;
        assembly.style.transform = `scale3d(${scale.toFixed(3)}, ${scale.toFixed(3)}, 1) perspective(1200px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) translate3d(0, ${transY.toFixed(2)}%, 0)`;
        assembly.style.opacity = '1';
        assembly.style.visibility = 'visible';

        if (introTitle) {
          introTitle.style.opacity = '0';
          introTitle.style.visibility = 'hidden';
        }
      }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // SCREEN POWER ORCHESTRATION:
    // Screen is ONLY ON when inside MAIN full-screen desktop (smoothProgress ~0.30 to ~0.58)
    // BEFORE main (< 0.30) and AFTER main (> 0.58), the screen is completely OFF!
    // ═══════════════════════════════════════════════════════════════════════
    const powerLed = container.querySelector('.retro-power-led');
    const isInsideMain = smoothProgress >= 0.30 && smoothProgress <= 0.58;

    if (isInsideMain) {
      if (!isScreenPowered) {
        isScreenPowered = true;
        if (crtScreen) crtScreen.classList.remove('screen-powered-off');
        if (powerLed) powerLed.classList.remove('led-off');
      }
    } else {
      if (isScreenPowered) {
        isScreenPowered = false;
        if (crtScreen) crtScreen.classList.add('screen-powered-off');
        if (powerLed) powerLed.classList.add('led-off');
      }
    }

    // Maintain interactive desktop zone
    if (desktop) {
      desktop.classList.add('active-zone');
    }

    // Request next frame
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

  // Initial open: Display Dual Portfolio and EduTrack side-by-side matching user's Image 1!
  setTimeout(() => {
    openProject(1); // PoseAI.png (opened first, in taskbar and underlying)
    openProject(2); // Portfolio.png (Dual Portfolio // TELEMETRY on left)
    openProject(3); // EduTrack.png (EduTrack // ACADEMIC HUD on right)
  }, 300);

  // Cleanup handler
  container.__destroyRetroPC = () => {
    if (animFrameId) cancelAnimationFrame(animFrameId);
    clearInterval(clockInterval);
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('resize', handleResize);
  };

  return container.__destroyRetroPC;
}
