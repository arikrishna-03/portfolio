import { initProjects3DWorld } from './projects-3d-world.js';

// Google Drive Real-Time Sync Config
// Paste your deployed Google Apps Script URL here to fetch certifications from Google Drive in real-time.
// Shared Folder: https://drive.google.com/drive/folders/1i75o8xVlfhhNMtZ89yGxoq4OXhfBqVrP
// Folder ID: 1i75o8xVlfhhNMtZ89yGxoq4OXhfBqVrP
// If left empty, the portfolio falls back to the static ./certifications.json database.
const GOOGLE_DRIVE_SCRIPT_URL = '';

const isTouch = !window.matchMedia('(any-pointer: fine)').matches || 
                ('ontouchstart' in window) || 
                navigator.maxTouchPoints > 0;
const isMobileViewport = window.innerWidth <= 767;
let landingActive = true;

/* ═══════════════ CURSOR & TAIL (Mouse — Desktop) ═══════════════ */
const cur = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
const tailCanvas = document.getElementById('cursor-tail');
let tailCtx = null;

if (tailCanvas) {
  tailCtx = tailCanvas.getContext('2d');
  tailCanvas.width = window.innerWidth;
  tailCanvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    if (tailCanvas) {
      tailCanvas.width = window.innerWidth;
      tailCanvas.height = window.innerHeight;
    }
  });
}

let mx=-100, my=-100, rx=-100, ry=-100;
let firstMove = true;
const tailPoints = Array(14).fill().map(() => ({x: -100, y: -100}));
let lastPointerType = 'mouse';

function showCursor() {
  if (lastPointerType === 'touch') {
    hideCursor();
    return;
  }
  if (cur) cur.style.opacity = '1';
  if (ring) ring.style.opacity = '1';
  if (tailCanvas) tailCanvas.style.opacity = '1';
}

function hideCursor() {
  if (cur) cur.style.opacity = '0';
  if (ring) ring.style.opacity = '0';
  if (tailCanvas) tailCanvas.style.opacity = '0';
}

function updateCursorPos(clientX, clientY) {
  mx = clientX;
  my = clientY;
  
  if (firstMove) {
    rx = mx; ry = my;
    tailPoints.forEach(p => { p.x = mx; p.y = my; });
    firstMove = false;
  }
  if (cur) {
    cur.style.setProperty('--mx', mx + 'px');
    cur.style.setProperty('--my', my + 'px');
  }
}

// Mouse events
document.addEventListener('mousemove', e => {
  lastPointerType = 'mouse';
  updateCursorPos(e.clientX, e.clientY);
  showCursor();
});

document.addEventListener('mouseleave', () => {
  hideCursor();
});

document.addEventListener('mouseenter', () => {
  showCursor();
});

// Touch events: hide the custom cursor completely on touch interaction to avoid sticking
document.addEventListener('touchstart', () => {
  lastPointerType = 'touch';
  hideCursor();
}, { passive: true });

document.addEventListener('touchmove', () => {
  lastPointerType = 'touch';
  hideCursor();
}, { passive: true });

document.addEventListener('touchend', () => {
  hideCursor();
}, { passive: true });

document.addEventListener('touchcancel', () => {
  hideCursor();
}, { passive: true });

(function tick() {
  // If touch is active, skip all rendering logic to save resources on mobile
  if (lastPointerType === 'touch') {
    requestAnimationFrame(tick);
    return;
  }

  const lerpFactor = 0.15;
  rx += (mx - rx) * lerpFactor;
  ry += (my - ry) * lerpFactor;
  if (ring) {
    ring.style.setProperty('--rx', rx + 'px');
    ring.style.setProperty('--ry', ry + 'px');
  }
  
  if (tailCtx && !firstMove) {
    tailCtx.clearRect(0, 0, tailCanvas.width, tailCanvas.height);
    
    // Smoothly follow the pointer with the head of the tail
    const headLerp = 0.6;
    tailPoints[0].x += (mx - tailPoints[0].x) * headLerp;
    tailPoints[0].y += (my - tailPoints[0].y) * headLerp;
    
    // Each subsequent point follows the one before it
    const pointLerp = 0.5;
    for (let i = 1; i < tailPoints.length; i++) {
      tailPoints[i].x += (tailPoints[i-1].x - tailPoints[i].x) * pointLerp;
      tailPoints[i].y += (tailPoints[i-1].y - tailPoints[i].y) * pointLerp;
    }
    
    tailCtx.lineCap = 'round';
    tailCtx.lineJoin = 'round';
    
    // Draw fading bezier curves (thinner on mobile to match the small cursor size)
    const baseTailWidth = window.innerWidth <= 767 ? 3.5 : 7;
    for (let i = 1; i < tailPoints.length - 1; i++) {
      tailCtx.beginPath();
      tailCtx.moveTo(tailPoints[i-1].x, tailPoints[i-1].y);
      const xc = (tailPoints[i].x + tailPoints[i+1].x) / 2;
      const yc = (tailPoints[i].y + tailPoints[i+1].y) / 2;
      tailCtx.quadraticCurveTo(tailPoints[i].x, tailPoints[i].y, xc, yc);
      
      const progress = 1 - (i / tailPoints.length);
      tailCtx.lineWidth = progress * baseTailWidth; // Tapers to 0
      tailCtx.strokeStyle = `rgba(247, 208, 89, ${progress * 0.8})`;
      tailCtx.stroke();
    }
  }
  
  requestAnimationFrame(tick);
})();



/* ═══════════════ MOBILE NAV HAMBURGER ═══════════════ */
window.toggleMobileMenu = function() {
  const links = document.getElementById('n-links-ul');
  const burger = document.getElementById('n-hamburger');
  if (!links || !burger) return;
  const isOpen = links.classList.contains('mobile-open');
  if (isOpen) {
    links.classList.remove('mobile-open');
    burger.classList.remove('open');
    burger.setAttribute('aria-label', 'Open navigation');
  } else {
    links.classList.add('mobile-open');
    burger.classList.add('open');
    burger.setAttribute('aria-label', 'Close navigation');
  }
};

window.closeMobileMenu = function() {
  const links = document.getElementById('n-links-ul');
  const burger = document.getElementById('n-hamburger');
  if (!links || !burger) return;
  links.classList.remove('mobile-open');
  burger.classList.remove('open');
  burger.setAttribute('aria-label', 'Open navigation');
};

/* ═══════════════ MOBILE LANDING PAGE TAP BEHAVIOR ═══════════════ */
// Global landing split-screen tap interceptor
window.handleSideClick = function(m, event) {
  const landingEl2 = document.getElementById('landing');
  const isMobile = window.innerWidth <= 767;
  
  if (isMobile && landingEl2) {
    const targetClass = m === 'ai' ? 'mobile-ai' : 'mobile-ds';
    if (!landingEl2.classList.contains(targetClass)) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      landingEl2.classList.remove('mobile-ai', 'mobile-ds');
      landingEl2.classList.add(targetClass);
      return;
    }
  }
  window.enterMode(m);
};

function setupMobileLanding() {
  const landingEl2 = document.getElementById('landing');
  if (!landingEl2) return;

  const isMobile = () => window.innerWidth <= 767;

  // Tap background to collapse columns on mobile
  landingEl2.addEventListener('click', e => {
    if (!isMobile()) return;
    if (!e.target.closest('.l-side') && !e.target.closest('.l-center')) {
      landingEl2.classList.remove('mobile-ai', 'mobile-ds');
    }
  });

  // Reset on resize to desktop
  window.addEventListener('resize', () => {
    if (!isMobile()) {
      landingEl2.classList.remove('mobile-ai', 'mobile-ds');
    }
  });
}

setupMobileLanding();

function setupHoverEffects() {
  if (isMobileViewport) return;
  document.querySelectorAll('a,button,.l-side,.l-center,.l-photo-wrap,.ai-pc,.ds-pc,.ai-stat,.sk-cat,.lab-c,.tool-chip,.ds-case-card,.t-card,.sw-icon,.hc-card,.pt-step').forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('hover-state'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('hover-state'));
  });
}


/* ═══════════════ PROFILE WEBGL LIQUID (liquid and wavy hover background) ═══════════════ */
const poc = document.getElementById('profile-orb-canvas');
const pwrap = document.querySelector('.l-photo-wrap');

let gl = null;
let program = null;
let animationFrameId = null;
let hoverProgress = 0;
let isHovered = false;
let startTime = 0;
let mousePos = { x: 0, y: 0 };
let currentMouse = { x: 0, y: 0 };

const vertexShaderSource = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;
  varying vec2 v_uv;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_hover_progress;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
               mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 4; ++i) {
      v += a * noise(p);
      p = rot * p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
    
    // Mouse interaction warping
    vec2 m = (u_mouse - 0.5 * u_resolution.xy) / u_resolution.y;
    float distToMouse = length(p - m);
    if (length(u_mouse) > 0.0) {
      p -= normalize(p - m) * (smoothstep(0.35, 0.0, distToMouse) * 0.08 * u_hover_progress);
    }
    
    // Swirl coordinates around the black hole event horizon
    float r_len = length(p);
    float theta = atan(p.y, p.x);
    
    // Tighter swirling close to the center core
    float swirlStrength = 1.0 / (r_len + 0.05);
    float angle = theta + swirlStrength - u_time * 1.5;
    vec2 sw_p = vec2(cos(angle), sin(angle)) * r_len;
    
    // Broad coordinate distortion for smooth liquidity
    vec2 q = vec2(
      fbm(sw_p * 1.6 + vec2(u_time * 0.08)),
      fbm(sw_p * 1.6 + vec2(5.2, 1.3) - vec2(u_time * 0.06))
    );
    
    vec2 r = vec2(
      fbm(sw_p * 1.6 + 3.0 * q + vec2(1.7, 9.2) + vec2(u_time * 0.04)),
      fbm(sw_p * 1.6 + 3.0 * q + vec2(8.3, 2.8) - vec2(u_time * 0.05))
    );
    
    float f = fbm(sw_p * 1.6 + 3.0 * r);
    
    // strictly dark crimson & navy blue color palette (mild/non-irritating)
    vec3 colCrimson = vec3(0.60, 0.05, 0.08);     // Crimson Red
    vec3 colNavy = vec3(0.04, 0.18, 0.48);        // Navy Blue
    vec3 colDarkBg = vec3(0.002, 0.003, 0.008);   // Dark Core void
    
    // Flowing blending between crimson and navy
    float blendVal = clamp(f * f * 3.2, 0.0, 1.0);
    float mixVal = 0.5 + 0.5 * sin(theta + u_time * 0.8 + length(q) * 2.0);
    vec3 diskColor = mix(colNavy, colCrimson, mixVal);
    
    vec3 col = mix(colDarkBg, diskColor, blendVal);
    col = mix(col, colNavy * 1.2, clamp(length(q) * r.x * 0.8, 0.0, 1.0));
    col += diskColor * f * 0.30 * u_hover_progress;
    
    // Bright soft white-blue core lensing outline
    float horizonGlow = smoothstep(0.213, 0.22, r_len) * smoothstep(0.26, 0.22, r_len);
    vec3 rimColor = vec3(0.82, 0.90, 0.98);
    col = mix(col, rimColor, horizonGlow * 0.98);
    
    // Smooth feathered inner mask to merge with the profile image
    float innerMask = smoothstep(0.18, 0.23, r_len);
    
    // Smooth feathered outer mask to merge with the background void
    float outerMask = smoothstep(0.46, 0.22, r_len);
    
    gl_FragColor = vec4(col, innerMask * outerMask * u_hover_progress);
  }
`;

const spaceFragmentShaderSource = `
  precision highp float;
  varying vec2 v_uv;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform vec2 u_profile_center;
  uniform float u_hover_progress;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
               mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 4; ++i) {
      v += a * noise(p);
      p = rot * p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
    
    // Compute distance vector from profile center in aspect-correct resolution space
    vec2 p_profile = (gl_FragCoord.xy - u_profile_center) / u_resolution.y;
    float distFromProfile = length(p_profile);
    
    // Mouse coords in resolution-independent space
    vec2 m = (u_mouse - 0.5 * u_resolution.xy) / u_resolution.y;
    
    // Smooth water ripple/wave displacement reacting to mouse
    float distFromMouse = length(p - m);
    // Wave parameters: frequency = 45.0, speed = 9.0, amplitude = 0.018
    // Fades out smoothly from mouse position up to 0.65 radius
    float wave = sin(distFromMouse * 45.0 - u_time * 9.0) * 0.018 * smoothstep(0.65, 0.0, distFromMouse);
    if (distFromMouse > 0.001) {
      p += (p - m) / distFromMouse * wave;
    }
    
    // Apply mouse parallax on top of the ripples
    p -= m * 0.08 * u_hover_progress;
    
    float slowTime = u_time * 0.025;
    
    // Smooth purple & indigo FBM dust clouds (sampled using displaced coordinate p)
    float n1 = fbm(p * 1.5 + vec2(slowTime, slowTime * 0.8));
    float n2 = fbm(p * 2.2 - vec2(slowTime * 0.6, slowTime * 1.1));
    float n3 = fbm(p * 0.85 + vec2(-slowTime * 0.4, slowTime * 0.5));
    
    vec3 colRedViolet = vec3(0.18, 0.02, 0.12); // Deep Red-Violet
    vec3 colIndigo = vec3(0.04, 0.08, 0.22);    // Dark Indigo
    
    vec3 col = vec3(0.005, 0.005, 0.012);       // Dark space void
    
    col = mix(col, colIndigo, n1 * 0.60);
    col = mix(col, colRedViolet, n2 * 0.50);
    col = mix(col, colRedViolet * 0.6 + colIndigo * 0.4, n3 * 0.40);
    
    col += colIndigo * (n1 * n1 * 0.15);
    
    // TWINKLING STAR FIELD (Elegant white and soft light blue, warps with liquid)
    vec3 starColor1 = vec3(0.95, 0.98, 1.0);    // Bright White-Blue
    vec3 starColor2 = vec3(0.80, 0.88, 1.0);    // Soft Blue-White
    
    // Translate coordinate p back to [0, 1] UV space so stars wobble with the ripples
    vec2 shiftedUv = p * (u_resolution.y / u_resolution.x) + 0.5;
    
    // Tiny sharp stars (twinkling)
    float starNoise = noise(shiftedUv * 180.0);
    float stars = smoothstep(0.992, 1.0, starNoise);
    float twinkle = 0.4 + 0.6 * sin(u_time * 2.2 + starNoise * 100.0);
    col += starColor1 * stars * twinkle * 0.35;
    
    // Soft medium star cluster points (from reference image)
    float starNoise2 = noise(shiftedUv * 80.0 + vec2(u_time * 0.005, u_time * 0.002));
    float stars2 = smoothstep(0.996, 1.0, starNoise2);
    float twinkle2 = 0.3 + 0.7 * sin(u_time * 1.0 + starNoise2 * 80.0);
    col += starColor2 * stars2 * twinkle2 * 0.25;

    // Smooth circular shockwave/portal centered on profile circle
    float maxRadius = 1.8;
    float currentRadius = maxRadius * u_hover_progress;
    float circleMask = smoothstep(currentRadius, currentRadius - 0.45, distFromProfile);
    
    col *= circleMask;

    gl_FragColor = vec4(col, circleMask * u_hover_progress);
  }
`;

function compileShaderSource(webglContext, source, type) {
  const shader = webglContext.createShader(type);
  webglContext.shaderSource(shader, source);
  webglContext.compileShader(shader);
  if (!webglContext.getShaderParameter(shader, webglContext.COMPILE_STATUS)) {
    console.error('Shader compilation error:', webglContext.getShaderInfoLog(shader));
    webglContext.deleteShader(shader);
    return null;
  }
  return shader;
}

function initWebGL() {
  if (!poc) return false;
  gl = poc.getContext('webgl') || poc.getContext('experimental-webgl');
  if (!gl) {
    console.warn('WebGL not supported');
    return false;
  }

  const vs = compileShaderSource(gl, vertexShaderSource, gl.VERTEX_SHADER);
  const fs = compileShaderSource(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
  if (!vs || !fs) return false;

  program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program linking error:', gl.getProgramInfoLog(program));
    return false;
  }

  gl.useProgram(program);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const vertices = new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
    -1,  1,
     1, -1,
     1,  1
  ]);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const aPosition = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(aPosition);
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

  return true;
}

const sCanvas = document.getElementById('landing-space-canvas');
let sGl = null;
let sProgram = null;

function initSpaceWebGL() {
  if (!sCanvas) return false;
  sGl = sCanvas.getContext('webgl') || sCanvas.getContext('experimental-webgl');
  if (!sGl) return false;

  const vs = compileShaderSource(sGl, vertexShaderSource, sGl.VERTEX_SHADER);
  const fs = compileShaderSource(sGl, spaceFragmentShaderSource, sGl.FRAGMENT_SHADER);
  if (!vs || !fs) return false;

  sProgram = sGl.createProgram();
  sGl.attachShader(sProgram, vs);
  sGl.attachShader(sProgram, fs);
  sGl.linkProgram(sProgram);

  if (!sGl.getProgramParameter(sProgram, sGl.LINK_STATUS)) return false;

  sGl.useProgram(sProgram);

  sGl.enable(sGl.BLEND);
  sGl.blendFunc(sGl.SRC_ALPHA, sGl.ONE_MINUS_SRC_ALPHA);

  const vertices = new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
    -1,  1,
     1, -1,
     1,  1
  ]);

  const buffer = sGl.createBuffer();
  sGl.bindBuffer(sGl.ARRAY_BUFFER, buffer);
  sGl.bufferData(sGl.ARRAY_BUFFER, vertices, sGl.STATIC_DRAW);

  const aPosition = sGl.getAttribLocation(sProgram, 'a_position');
  sGl.enableVertexAttribArray(aPosition);
  sGl.vertexAttribPointer(aPosition, 2, sGl.FLOAT, false, 0, 0);

  return true;
}

function resizeWebGL() {
  if (isMobileViewport) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  if (poc && gl) {
    poc.width = 580 * dpr;
    poc.height = 580 * dpr;
    gl.viewport(0, 0, poc.width, poc.height);
  }
  if (sCanvas && sGl) {
    sCanvas.width = sCanvas.clientWidth * dpr;
    sCanvas.height = sCanvas.clientHeight * dpr;
    sGl.viewport(0, 0, sCanvas.width, sCanvas.height);
  }
}

function renderWebGL(timestamp) {
  if (isHovered) {
    hoverProgress += (1 - hoverProgress) * 0.08;
  } else {
    hoverProgress += (0 - hoverProgress) * 0.08;
    if (hoverProgress < 0.001) {
      hoverProgress = 0;
      animationFrameId = null;
      if (gl) {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
      if (sGl) {
        sGl.clearColor(0, 0, 0, 0);
        sGl.clear(sGl.COLOR_BUFFER_BIT);
      }
      return;
    }
  }

  const time = (timestamp - startTime) * 0.001;

  currentMouse.x += (mousePos.x - currentMouse.x) * 0.08;
  currentMouse.y += (mousePos.y - currentMouse.y) * 0.08;

  if (gl) {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniform1f(gl.getUniformLocation(program, 'u_time'), time);
    gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), poc.width, poc.height);
    gl.uniform2f(gl.getUniformLocation(program, 'u_mouse'), currentMouse.x, currentMouse.y);
    gl.uniform1f(gl.getUniformLocation(program, 'u_hover_progress'), hoverProgress);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  if (sGl) {
    sGl.clearColor(0, 0, 0, 0);
    sGl.clear(sGl.COLOR_BUFFER_BIT);
    sGl.useProgram(sProgram);
    sGl.uniform1f(sGl.getUniformLocation(sProgram, 'u_time'), time);
    sGl.uniform2f(sGl.getUniformLocation(sProgram, 'u_resolution'), sCanvas.width, sCanvas.height);
    
    // Find absolute viewport position of the center photo circle
    const pwrap = document.querySelector('.l-photo-wrap');
    let pCenterX = sCanvas.width * 0.5;
    let pCenterY = sCanvas.height * 0.5;
    if (pwrap) {
      const rect = pwrap.getBoundingClientRect();
      const midX = rect.left + rect.width * 0.5;
      const midY = rect.top + rect.height * 0.5;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      pCenterX = midX * dpr;
      pCenterY = (window.innerHeight - midY) * dpr; // Y-up WebGL space
    }
    sGl.uniform2f(sGl.getUniformLocation(sProgram, 'u_profile_center'), pCenterX, pCenterY);

    const screenMouseX = (currentMouse.x / (poc.width || 1)) * sCanvas.width;
    const screenMouseY = (currentMouse.y / (poc.height || 1)) * sCanvas.height;
    sGl.uniform2f(sGl.getUniformLocation(sProgram, 'u_mouse'), screenMouseX, screenMouseY);
    sGl.uniform1f(sGl.getUniformLocation(sProgram, 'u_hover_progress'), hoverProgress);
    sGl.drawArrays(sGl.TRIANGLES, 0, 6);
  }

  animationFrameId = requestAnimationFrame(renderWebGL);
}

function startLiquidEffect(e) {
  isHovered = true;
  const land = document.getElementById('landing');
  if (land && e && e.currentTarget && e.currentTarget.classList.contains('l-photo-wrap')) {
    land.classList.add('about-hover');
  }
  
  if (isMobileViewport) return;
  
  if (!gl) {
    initWebGL();
  }
  if (!sGl) {
    initSpaceWebGL();
  }
  
  resizeWebGL();
  if (!animationFrameId) {
    startTime = performance.now() - (hoverProgress * 1000);
    animationFrameId = requestAnimationFrame(renderWebGL);
  }
}

function stopLiquidEffect() {
  isHovered = false;
  const land = document.getElementById('landing');
  if (land) land.classList.remove('about-hover');
}

const landingEl = document.getElementById('landing');
const lLeftSide = document.getElementById('l-left');
const lRightSide = document.getElementById('l-right');

if (pwrap && poc) {
  pwrap.addEventListener('mouseenter', startLiquidEffect);
  pwrap.addEventListener('mouseleave', stopLiquidEffect);
  // Touch support for profile orb
  pwrap.addEventListener('touchstart', startLiquidEffect, { passive: true });
  pwrap.addEventListener('touchend', stopLiquidEffect, { passive: true });
}

if (lLeftSide) {
  lLeftSide.addEventListener('mouseenter', startLiquidEffect);
  lLeftSide.addEventListener('mouseleave', stopLiquidEffect);
  lLeftSide.addEventListener('touchstart', startLiquidEffect, { passive: true });
  lLeftSide.addEventListener('touchend', stopLiquidEffect, { passive: true });
}

if (lRightSide) {
  lRightSide.addEventListener('mouseenter', startLiquidEffect);
  lRightSide.addEventListener('mouseleave', stopLiquidEffect);
  lRightSide.addEventListener('touchstart', startLiquidEffect, { passive: true });
  lRightSide.addEventListener('touchend', stopLiquidEffect, { passive: true });
}

if (!isTouch && landingEl && poc) {
  landingEl.addEventListener('mousemove', (e) => {
    const rect = poc.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * poc.width;
    const y = (1.0 - (e.clientY - rect.top) / rect.height) * poc.height;
    mousePos.x = x;
    mousePos.y = y;
  });
}


window.addEventListener('resize', () => {
  resizeWebGL();
});

function wrapLandingTitleChars(el) {
  if (!el || el.dataset.charsDone) return;
  el.dataset.charsDone = '1';
  let ti = 0;
  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const t = node.textContent;
      const frag = document.createDocumentFragment();
      for (let i = 0; i < t.length; i++) {
        const ch = t[i];
        if (ch.trim()) {
          const s = document.createElement('span');
          s.className = 'title-char';
          s.style.setProperty('--ti', String(ti));
          s.textContent = ch;
          frag.appendChild(s);
          ti += 1;
        } else {
          frag.appendChild(document.createTextNode(ch));
        }
      }
      node.parentNode.replaceChild(frag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
      Array.from(node.childNodes).forEach(processNode);
    }
  }
  Array.from(el.childNodes).forEach(processNode);
}

/* ═══════════════ LANDING AI CANVAS (neural + electric FX) ═══════════════ */
const nc = document.getElementById('n-canvas');
let nctx;
const CODE_FRAGS = ['01', 'λ', '0.92', 'η', '∇', 'torch', 'def', 'loss', 'GPU', 'df', 'σ', 'relu', 'cuda'];
let nodes = [];
let codeParts = [];
let streams = [];
let circuits = [];
const N = 60;

let lmx = -999;
let lmy = -999;

function resizeNC() {
  const l = document.getElementById('l-left');
  if (l && nc) {
    nc.width = l.offsetWidth;
    nc.height = l.offsetHeight;
  }
}

function makeCircuits() {
  circuits = [];
  if (!nc || !nc.width) return;
  for (let i = 0; i < 14; i++) {
    const x = Math.random() * nc.width;
    const y = Math.random() * nc.height;
    const segs = 3 + Math.floor(Math.random() * 4);
    const path = [{ x, y }];
    let px = x;
    let py = y;
    for (let s = 0; s < segs; s++) {
      if (Math.random() > 0.5) px += (Math.random() - 0.3) * 90;
      else py += (Math.random() - 0.3) * 70;
      path.push({ x: px, y: py });
    }
    circuits.push({ path, a: 0.04 + Math.random() * 0.07, ph: Math.random() * Math.PI * 2 });
  }
}

function initNodes() {
  if (isMobileViewport || !nc) return;
  resizeNC();
  nodes = [];
  for (let i = 0; i < N; i++) {
    nodes.push({
      x: Math.random() * nc.width,
      y: Math.random() * nc.height,
      vx: (Math.random() - 0.5) * 0.85,
      vy: (Math.random() - 0.5) * 0.85,
      r: Math.random() * 1.6 + 0.7,
      p: Math.random() * Math.PI * 2
    });
  }
  codeParts = [];
  for (let i = 0; i < 28; i++) {
    codeParts.push({
      x: Math.random() * nc.width,
      y: Math.random() * nc.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -0.25 - Math.random() * 0.55,
      frag: CODE_FRAGS[i % CODE_FRAGS.length],
      a: 0.12 + Math.random() * 0.2
    });
  }
  streams = [];
  for (let i = 0; i < 10; i++) {
    streams.push({
      x: (i / 10) * (nc.width + 40) - 20 + Math.random() * 40,
      y: Math.random() * nc.height,
      sp: 1.4 + Math.random() * 2.2,
      len: 50 + Math.random() * 100,
      o: 0.06 + Math.random() * 0.08
    });
  }
  makeCircuits();
}

const lLeft = document.getElementById('l-left');
if (lLeft) {
  lLeft.addEventListener('mousemove', e => {
    const r = e.currentTarget.getBoundingClientRect();
    lmx = (e.clientX - r.left) / 0.8;
    lmy = (e.clientY - r.top) / 0.8;
  });
  lLeft.addEventListener('mouseleave', () => {
    lmx = -999;
    lmy = -999;
  });
}

function drawBrainOutline(ctx, w, h, t) {
  const cx = w * 0.5;
  const cy = h * 0.4;
  const pulse = 0.04 + Math.sin(t * 0.0022) * 0.015;
  ctx.save();
  ctx.globalAlpha = 0.07 + pulse;
  ctx.strokeStyle = 'rgba(68, 123, 190, 0.55)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - 42, cy + 18);
  ctx.bezierCurveTo(cx - 72, cy - 40, cx - 38, cy - 62, cx, cy - 58);
  ctx.bezierCurveTo(cx + 38, cy - 62, cx + 72, cy - 40, cx + 42, cy + 18);
  ctx.bezierCurveTo(cx + 48, cy + 52, cx + 22, cy + 68, cx, cy + 62);
  ctx.bezierCurveTo(cx - 22, cy + 68, cx - 48, cy + 52, cx - 42, cy + 18);
  ctx.closePath();
  ctx.stroke();
  ctx.setLineDash([4, 10]);
  ctx.beginPath();
  ctx.moveTo(cx, cy - 58);
  ctx.lineTo(cx, cy + 62);
  ctx.stroke();
  ctx.restore();
}

function drawNC() {
  if (isMobileViewport || !nctx || !nc || !landingActive) return;
  nctx.clearRect(0, 0, nc.width, nc.height);
  const t = performance.now();

  // Holographic vignette wash
  const vg = nctx.createRadialGradient(nc.width * 0.5, nc.height * 0.42, 0, nc.width * 0.5, nc.height * 0.42, nc.width * 0.55);
  vg.addColorStop(0, 'rgba(68, 123, 190, 0.03)');
  vg.addColorStop(0.45, 'rgba(43, 55, 132, 0.02)');
  vg.addColorStop(1, 'rgba(0, 0, 0, 0)');
  nctx.fillStyle = vg;
  nctx.fillRect(0, 0, nc.width, nc.height);

  // Data streams (vertical flowing dashes)
  nctx.lineWidth = 1;
  streams.forEach(s => {
    s.y += s.sp;
    if (s.y > nc.height + s.len) s.y = -s.len;
    const g = nctx.createLinearGradient(s.x, s.y, s.x, s.y + s.len);
    g.addColorStop(0, `rgba(100, 175, 240, 0)`);
    g.addColorStop(0.35, `rgba(100, 175, 240, ${s.o})`);
    g.addColorStop(0.65, `rgba(165, 190, 235, ${s.o * 0.8})`);
    g.addColorStop(1, `rgba(100, 175, 240, 0)`);
    nctx.strokeStyle = g;
    nctx.beginPath();
    nctx.setLineDash([6, 14]);
    nctx.lineDashOffset = -(t * 0.04) % 20;
    nctx.moveTo(s.x, s.y);
    nctx.lineTo(s.x, s.y + s.len);
    nctx.stroke();
    nctx.setLineDash([]);
  });

  // Glowing circuits
  circuits.forEach(c => {
    const tw = 0.5 + Math.sin(t * 0.0018 + c.ph) * 0.35;
    nctx.strokeStyle = `rgba(120, 182, 236, ${c.a * tw})`;
    nctx.lineWidth = 0.6;
    nctx.beginPath();
    c.path.forEach((pt, j) => {
      if (j === 0) nctx.moveTo(pt.x, pt.y);
      else nctx.lineTo(pt.x, pt.y);
    });
    nctx.stroke();
  });

  drawBrainOutline(nctx, nc.width, nc.height, t);

  // Neural nodes + links
  nodes.forEach(n => {
    n.p += 0.017;
    n.x += n.vx;
    n.y += n.vy;
    if (n.x < 0 || n.x > nc.width) n.vx *= -1;
    if (n.y < 0 || n.y > nc.height) n.vy *= -1;
    const dx = lmx - n.x;
    const dy = lmy - n.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < 130) {
      n.vx += dx * 0.00016;
      n.vy += dy * 0.00016;
    }
    const sp = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
    if (sp > 1.8) {
      n.vx = (n.vx / sp) * 1.8;
      n.vy = (n.vy / sp) * 1.8;
    }
  });

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 105) {
        const op = (1 - d / 105) * 0.32;
        const g = nctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
        g.addColorStop(0, `rgba(100, 175, 240, ${op})`);
        g.addColorStop(1, `rgba(43, 55, 132, ${op * 0.9})`);
        nctx.beginPath();
        nctx.strokeStyle = g;
        nctx.lineWidth = 0.45;
        nctx.moveTo(nodes[i].x, nodes[i].y);
        nctx.lineTo(nodes[j].x, nodes[j].y);
        nctx.stroke();
      }
    }
  }

  nodes.forEach(n => {
    const g = Math.sin(n.p) * 0.5 + 0.5;
    const gr = nctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5);
    gr.addColorStop(0, `rgba(100, 175, 240, ${0.22 * g})`);
    gr.addColorStop(1, 'rgba(100, 175, 240, 0)');
    nctx.beginPath();
    nctx.fillStyle = gr;
    nctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2);
    nctx.fill();
    nctx.beginPath();
    nctx.fillStyle = `rgba(224, 250, 255, ${0.45 + g * 0.45})`;
    nctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    nctx.fill();
  });

  // Floating code particles
  nctx.font = '9px Syne Mono, monospace';
  nctx.textAlign = 'center';
  codeParts.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.y < -20) {
      p.y = nc.height + 10;
      p.x = Math.random() * nc.width;
    }
    if (p.x < 0 || p.x > nc.width) p.vx *= -1;
    nctx.fillStyle = `rgba(186, 230, 253, ${p.a})`;
    nctx.fillText(p.frag, p.x, p.y);
  });

  // Soft energy pulse rings (canvas layer under CSS rings — extra depth)
  const rings = 3;
  for (let r = 0; r < rings; r++) {
    const phase = (t * 0.0009 + r * 1.1) % 1;
    const rad = 80 + phase * Math.min(nc.width, nc.height) * 0.42;
    nctx.beginPath();
    nctx.arc(nc.width * 0.5, nc.height * 0.45, rad, 0, Math.PI * 2);
    nctx.strokeStyle = `rgba(100, 175, 240, ${(1 - phase) * 0.06})`;
    nctx.lineWidth = 1;
    nctx.stroke();
  }

  requestAnimationFrame(drawNC);
}

if (nc) nctx = nc.getContext('2d');

/* ═══════════════ LANDING DESIGN CANVAS ═══════════════ */
const dc = document.getElementById('d-canvas');
let dctx;
let dParts = [];
let dStreaks = [];
let dFrames = [];
const TYPE_CHARS = 'AaGgRrKkMmNnBb';

function resizeDC() {
  const r = document.getElementById('l-right');
  if (r && dc) {
    dc.width = r.offsetWidth;
    dc.height = r.offsetHeight;
  }
}

function initDesignParticles() {
  if (isMobileViewport || !dc) return;
  resizeDC();
  dParts = [];
  dStreaks = [];
  dFrames = [];
  for (let i = 0; i < 36; i++) {
    dParts.push({
      x: Math.random() * dc.width,
      y: Math.random() * dc.height,
      vx: (Math.random() - 0.5) * 1.1,
      vy: (Math.random() - 0.5) * 1.1,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.02,
      kind: i % 5,
      s: 0.4 + Math.random() * 0.9,
      c: TYPE_CHARS[Math.floor(Math.random() * TYPE_CHARS.length)]
    });
  }
  for (let i = 0; i < 16; i++) {
    dStreaks.push({
      x: Math.random() * dc.width,
      y: Math.random() * dc.height,
      len: 60 + Math.random() * 140,
      ang: Math.random() * Math.PI * 2,
      sp: 3 + Math.random() * 5,
      a: 0.08 + Math.random() * 0.12
    });
  }
  for (let i = 0; i < 10; i++) {
    dFrames.push({
      x: Math.random() * dc.width,
      y: Math.random() * dc.height,
      w: 40 + Math.random() * 70,
      h: 28 + Math.random() * 50,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.008
    });
  }
}

function drawDC() {
  if (isMobileViewport || !dctx || !dc || !landingActive) return;
  const t = performance.now();
  dctx.clearRect(0, 0, dc.width, dc.height);

  // Poster fragments (soft gradients)
  dctx.globalAlpha = 0.14;
  for (let i = 0; i < 4; i++) {
    const px = (dc.width * (0.15 + i * 0.22) + Math.sin(t * 0.0004 + i) * 20) % dc.width;
    const py = (dc.height * (0.2 + (i % 2) * 0.35)) % dc.height;
    const g = dctx.createLinearGradient(px, py, px + 120, py + 100);
    g.addColorStop(0, 'rgba(223, 31, 45, 0.38)');
    g.addColorStop(1, 'rgba(68, 123, 190, 0.12)');
    dctx.fillStyle = g;
    dctx.fillRect(px, py, 100 + i * 15, 80);
  }
  dctx.globalAlpha = 1;

  // Neon streaks
  dStreaks.forEach(st => {
    st.x += Math.cos(st.ang) * st.sp * 0.35;
    st.y += Math.sin(st.ang) * st.sp * 0.35;
    if (st.x < -st.len || st.x > dc.width + st.len || st.y < -st.len || st.y > dc.height + st.len) {
      st.x = Math.random() * dc.width;
      st.y = Math.random() * dc.height;
      st.ang = Math.random() * Math.PI * 2;
    }
    const g = dctx.createLinearGradient(st.x, st.y, st.x + Math.cos(st.ang) * st.len, st.y + Math.sin(st.ang) * st.len);
    g.addColorStop(0, 'rgba(223, 31, 45, 0)');
    g.addColorStop(0.45, `rgba(223, 31, 45, ${st.a})`);
    g.addColorStop(0.55, `rgba(68, 123, 190, ${st.a * 0.85})`);
    g.addColorStop(1, 'rgba(177, 19, 19, 0)');
    dctx.strokeStyle = g;
    dctx.lineWidth = 1.2;
    dctx.beginPath();
    dctx.moveTo(st.x, st.y);
    dctx.lineTo(st.x + Math.cos(st.ang) * st.len, st.y + Math.sin(st.ang) * st.len);
    dctx.stroke();
  });

  // UI wireframes + abstract shapes
  dFrames.forEach(fr => {
    fr.x += fr.vx;
    fr.y += fr.vy;
    fr.rot += fr.vr;
    if (fr.x < -80) fr.x = dc.width;
    if (fr.x > dc.width + 80) fr.x = 0;
    if (fr.y < -80) fr.y = dc.height;
    if (fr.y > dc.height + 80) fr.y = 0;
    dctx.save();
    dctx.translate(fr.x, fr.y);
    dctx.rotate(fr.rot);
    dctx.strokeStyle = 'rgba(223, 31, 45, 0.24)';
    dctx.lineWidth = 1;
    dctx.strokeRect(-fr.w / 2, -fr.h / 2, fr.w, fr.h);
    dctx.strokeStyle = 'rgba(68, 123, 190, 0.18)';
    dctx.setLineDash([4, 6]);
    dctx.strokeRect(-fr.w / 2 + 6, -fr.h / 2 + 6, fr.w * 0.55, fr.h * 0.35);
    dctx.setLineDash([]);
    dctx.restore();
  });

  // Motion particles: letters + shapes
  dParts.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    if (p.x < -30) p.x = dc.width + 20;
    if (p.x > dc.width + 30) p.x = -20;
    if (p.y < -30) p.y = dc.height + 20;
    if (p.y > dc.height + 30) p.y = -20;
    dctx.save();
    dctx.translate(p.x, p.y);
    dctx.rotate(p.rot);
    dctx.scale(p.s, p.s);
    if (p.kind === 0 || p.kind === 3) {
      dctx.fillStyle = 'rgba(223, 31, 45, 0.36)';
      dctx.beginPath();
      dctx.moveTo(0, -14);
      dctx.lineTo(12, 10);
      dctx.lineTo(-12, 10);
      dctx.closePath();
      dctx.fill();
    } else if (p.kind === 1) {
      dctx.fillStyle = 'rgba(68, 123, 190, 0.28)';
      dctx.beginPath();
      dctx.arc(0, 0, 12, 0, Math.PI * 2);
      dctx.fill();
    } else {
      dctx.font = '11px Sora, sans-serif';
      dctx.fillStyle = 'rgba(230, 210, 200, 0.42)';
      dctx.textAlign = 'center';
      dctx.textBaseline = 'middle';
      dctx.fillText(p.c, 0, 0);
    }
    dctx.restore();
  });

  // Brush-like energy strokes (curved)
  dctx.globalCompositeOperation = 'screen';
  for (let b = 0; b < 3; b++) {
    const ox = dc.width * 0.5 + Math.sin(t * 0.0008 + b) * 100;
    const oy = dc.height * 0.45 + Math.cos(t * 0.0006 + b) * 60;
    dctx.strokeStyle = `rgba(223, 31, 45, ${0.05 + b * 0.025})`;
    dctx.lineWidth = 8 + b * 4;
    dctx.lineCap = 'round';
    dctx.beginPath();
    dctx.moveTo(ox - 120, oy + 40);
    dctx.quadraticCurveTo(ox + 80, oy - 100, ox + 160, oy + 20);
    dctx.stroke();
  }
  dctx.globalCompositeOperation = 'source-over';

  requestAnimationFrame(drawDC);
}

if (dc) dctx = dc.getContext('2d');

/* ═══════════════ AI HERO CANVAS ═══════════════ */
let ac,actx,aN=[],aRaf;
let amx=innerWidth/2,amy=innerHeight/2;
document.addEventListener('mousemove',e=>{amx=e.clientX;amy=e.clientY});
// Touch parallax for AI hero canvas
document.addEventListener('touchmove',e=>{if(e.touches[0]){amx=e.touches[0].clientX;amy=e.touches[0].clientY;}},{passive:true});


function initAI(){
  ac=document.getElementById('ai-canvas');
  if(!ac) return;
  actx=ac.getContext('2d');
  ac.width=innerWidth;ac.height=innerHeight;
  aN=[];
  const nodeCount = window.innerWidth < 768 ? 25 : 90;
  for(let i=0;i<nodeCount;i++) aN.push({
    x:Math.random()*ac.width,y:Math.random()*ac.height,
    vx:(Math.random()-.5)*.45,vy:(Math.random()-.5)*.45,
    r:Math.random()*1.4+.4,p:Math.random()*Math.PI*2
  });
  cancelAnimationFrame(aRaf);
  drawAI();
}

function drawAI(){
  if(!actx) return;
  actx.clearRect(0,0,ac.width,ac.height);
  const zoom = 0.8;
  const ox = ((amx / zoom) - ac.width / 2) * 0.015;
  const oy = ((amy / zoom) - ac.height / 2) * 0.015;
  aN.forEach(n=>{
    n.p+=.012;
    n.x+=n.vx+ox*.008;n.y+=n.vy+oy*.008;
    if(n.x<0)n.x=ac.width;if(n.x>ac.width)n.x=0;
    if(n.y<0)n.y=ac.height;if(n.y>ac.height)n.y=0;
  });
  for(let i=0;i<aN.length;i++) for(let j=i+1;j<aN.length;j++){
    const dx=aN[i].x-aN[j].x,dy=aN[i].y-aN[j].y;
    const d=Math.sqrt(dx*dx+dy*dy);
    if(d<95){
      const op=(1-d/95)*.2;
      actx.beginPath();actx.strokeStyle=`rgba(68,123,190,${op})`;
      actx.lineWidth=.4;actx.moveTo(aN[i].x,aN[i].y);actx.lineTo(aN[j].x,aN[j].y);actx.stroke();
    }
  }
  aN.forEach(n=>{
    const g=Math.sin(n.p)*.5+.5;
    const gr=actx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.r*6);
    gr.addColorStop(0,`rgba(68,123,190,${.15*g})`);gr.addColorStop(1,'rgba(68,123,190,0)');
    actx.beginPath();actx.fillStyle=gr;actx.arc(n.x,n.y,n.r*6,0,Math.PI*2);actx.fill();
    actx.beginPath();actx.fillStyle=`rgba(43,55,132,${.45+g*.55})`;actx.arc(n.x,n.y,n.r,0,Math.PI*2);actx.fill();
  });
  aRaf=requestAnimationFrame(drawAI);
}

/* ═══════════════ DESIGN HERO CANVAS ═══════════════ */
let dsc, dsctx, dsRaf;
let dsParts = [];
let dsStreaks = [];
let dsFrames = [];
const DS_TYPE_CHARS = 'AaGgRrKkMmNnBb';

function initDS() {
  dsc = document.getElementById('ds-canvas');
  if (!dsc) return;
  dsctx = dsc.getContext('2d');
  dsc.width = innerWidth;
  dsc.height = innerHeight;
  
  dsParts = [];
  dsStreaks = [];
  dsFrames = [];
  
  const isMobile = window.innerWidth < 768;
  const partsCount = isMobile ? 10 : 30;
  const streaksCount = isMobile ? 4 : 12;
  const framesCount = isMobile ? 3 : 8;
  
  // Initialize design particles (characters)
  for (let i = 0; i < partsCount; i++) {
    dsParts.push({
      x: Math.random() * dsc.width,
      y: Math.random() * dsc.height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.015,
      kind: i % 5,
      s: 0.3 + Math.random() * 0.6,
      c: DS_TYPE_CHARS[Math.floor(Math.random() * DS_TYPE_CHARS.length)],
      a: 0.04 + Math.random() * 0.06
    });
  }
  
  // Initialize neon streaks (lines)
  for (let i = 0; i < streaksCount; i++) {
    dsStreaks.push({
      x: Math.random() * dsc.width,
      y: Math.random() * dsc.height,
      len: 50 + Math.random() * 100,
      ang: Math.random() * Math.PI * 2,
      sp: 2 + Math.random() * 3,
      a: 0.04 + Math.random() * 0.05
    });
  }
  
  // Initialize wireframes (shapes)
  for (let i = 0; i < framesCount; i++) {
    dsFrames.push({
      x: Math.random() * dsc.width,
      y: Math.random() * dsc.height,
      w: 30 + Math.random() * 50,
      h: 20 + Math.random() * 40,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.005,
      a: 0.04 + Math.random() * 0.06
    });
  }
  
  cancelAnimationFrame(dsRaf);
  drawDS();
}

function drawDS() {
  if (!dsctx || !dsc) return;
  const t = performance.now();
  dsctx.clearRect(0, 0, dsc.width, dsc.height);
  
  const zoom = 0.8;
  const ox = ((amx / zoom) - dsc.width / 2) * 0.015;
  const oy = ((amy / zoom) - dsc.height / 2) * 0.015;
  
  // 1. Poster fragments (soft crimson gradient cards)
  dsctx.globalAlpha = 0.05;
  for (let i = 0; i < 3; i++) {
    const px = (dsc.width * (0.2 + i * 0.25) + Math.sin(t * 0.0003 + i) * 15) % dsc.width;
    const py = (dsc.height * (0.3 + (i % 2) * 0.25)) % dsc.height;
    
    // Apply non-cumulative mouse offset during draw
    const drawX = px + ox * 0.2;
    const drawY = py + oy * 0.2;
    
    const g = dsctx.createLinearGradient(drawX, drawY, drawX + 90, drawY + 70);
    g.addColorStop(0, 'rgba(229, 9, 20, 0.2)');
    g.addColorStop(1, 'rgba(20, 12, 14, 0.05)');
    dsctx.fillStyle = g;
    dsctx.fillRect(drawX, drawY, 80 + i * 10, 60);
  }
  dsctx.globalAlpha = 1;
  
  // 2. Neon streaks (lines)
  dsStreaks.forEach(st => {
    st.x += Math.cos(st.ang) * st.sp * 0.35;
    st.y += Math.sin(st.ang) * st.sp * 0.35;
    if (st.x < -st.len || st.x > dsc.width + st.len || st.y < -st.len || st.y > dsc.height + st.len) {
      st.x = Math.random() * dsc.width;
      st.y = Math.random() * dsc.height;
      st.ang = Math.random() * Math.PI * 2;
    }
    
    // Apply non-cumulative mouse offset during draw
    const drawX1 = st.x + ox * 0.1;
    const drawY1 = st.y + oy * 0.1;
    const drawX2 = st.x + Math.cos(st.ang) * st.len + ox * 0.1;
    const drawY2 = st.y + Math.sin(st.ang) * st.len + oy * 0.1;
    
    const g = dsctx.createLinearGradient(drawX1, drawY1, drawX2, drawY2);
    g.addColorStop(0, 'rgba(229, 9, 20, 0)');
    g.addColorStop(0.5, `rgba(229, 9, 20, ${st.a})`);
    g.addColorStop(1, 'rgba(20, 12, 14, 0)');
    dsctx.strokeStyle = g;
    dsctx.lineWidth = 1;
    dsctx.beginPath();
    dsctx.moveTo(drawX1, drawY1);
    dsctx.lineTo(drawX2, drawY2);
    dsctx.stroke();
  });
  
  // 3. UI wireframes (shapes)
  dsFrames.forEach(fr => {
    fr.x += fr.vx;
    fr.y += fr.vy;
    fr.rot += fr.vr;
    if (fr.x < -80) fr.x = dsc.width;
    if (fr.x > dsc.width + 80) fr.x = 0;
    if (fr.y < -80) fr.y = dsc.height;
    if (fr.y > dsc.height + 80) fr.y = 0;
    
    dsctx.save();
    // Apply non-cumulative mouse offset during translate
    dsctx.translate(fr.x + ox * 0.15, fr.y + oy * 0.15);
    dsctx.rotate(fr.rot);
    dsctx.strokeStyle = `rgba(229, 9, 20, ${fr.a})`;
    dsctx.lineWidth = 1;
    dsctx.strokeRect(-fr.w / 2, -fr.h / 2, fr.w, fr.h);
    dsctx.restore();
  });
  
  // 4. Typographic elements
  dsParts.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    if (p.x < -40) p.x = dsc.width;
    if (p.x > dsc.width + 40) p.x = 0;
    if (p.y < -40) p.y = dsc.height;
    if (p.y > dsc.height + 40) p.y = 0;
    
    dsctx.save();
    // Apply non-cumulative mouse offset during translate
    dsctx.translate(p.x + ox * 0.15, p.y + oy * 0.15);
    dsctx.rotate(p.rot);
    dsctx.fillStyle = `rgba(255, 255, 255, ${p.a})`;
    dsctx.font = `600 ${p.s * 1.5}rem DM Sans, sans-serif`;
    dsctx.fillText(p.c, 0, 0);
    dsctx.restore();
  });
  
  dsRaf = requestAnimationFrame(drawDS);
}

/* ═══════════════ MODE ═══════════════ */
let mode=null;

window.enterMode = function(m, push = true){
  mode=m;
  landingActive = false;
  if (push) {
    history.pushState({ mode: m }, '', '#' + m);
  }
  const ov=document.getElementById('overlay');
  const land=document.getElementById('landing');
  ov.style.background=m==='ai'?'#080d1a':'#140c0e';
  ov.classList.add('on');
  land.classList.add('exit');
  setTimeout(()=>{
    land.style.display='none';
    setMode(m);
    const app=document.getElementById('app');
    app.style.display='block';
    setTimeout(()=>{
      app.classList.add('show');
      ov.classList.remove('on');
      initReveal();
    },60);
  },250);
}

function setMode(m){
  mode=m;
  document.body.classList.remove('ai-mode','ds-mode');
  document.body.classList.add(m==='ai'?'ai-mode':'ds-mode');
  document.getElementById('ai-c').style.display=m==='ai'?'block':'none';
  document.getElementById('ds-c').style.display=m==='design'?'block':'none';
  const mTxt = document.getElementById('m-txt');
  if (mTxt) mTxt.textContent = m === 'ai' ? 'Design Mode' : 'AI Mode';
  const nSkills = document.getElementById('n-skills');
  const nLab = document.getElementById('n-lab');
  const nSoftware = document.getElementById('n-software');
  
  if (nSkills) nSkills.style.display = m === 'ai' ? '' : 'none';
  if (nLab) nLab.style.display = m === 'ai' ? '' : 'none';
  if (nSoftware) nSoftware.style.display = m === 'design' ? '' : 'none';

  const cLbl = document.getElementById('c-lbl');
  if (cLbl) cLbl.textContent = m === 'ai' ? '// Get in Touch' : 'Get in Touch';
  if(m==='ai'){
    setTimeout(initAI, 80);
    setTimeout(initProjects3DWorld, 100);
    cancelAnimationFrame(dsRaf);
    dsctx = null;
  } else {
    cancelAnimationFrame(aRaf);
    actx = null;
    setTimeout(initDS, 80);
  }
}

window.switchMode = function(){
  const nm=mode==='ai'?'design':'ai';
  history.pushState({ mode: nm }, '', '#' + nm);
  const ov=document.getElementById('overlay');
  ov.style.background=nm==='ai'?'#080d1a':'#140c0e';
  ov.classList.add('on');
  setTimeout(()=>{
    setMode(nm);
    window.scrollTo(0,0);
    setTimeout(()=>{ov.classList.remove('on');initReveal()},200);
  },250);
}

window.openAbout = function() {
  const photo = document.getElementById('l-photo');
  const land = document.getElementById('landing');
  const ov = document.getElementById('overlay');
  
  if (!photo) return;
  photo.classList.add('expand-full');
  
  setTimeout(() => {
    ov.style.transition = 'none';
    ov.style.background = '#080d1a';
    ov.style.opacity = '1';
    ov.classList.add('on');
    
    setTimeout(() => {
      window.location.href = './profile.html';
    }, 50);
  }, 750);
}

window.backToLanding = function(push = true){
  if (push) {
    history.pushState({ mode: 'landing' }, '', '#');
  }
  const ov=document.getElementById('overlay');
  const app=document.getElementById('app');
  const land=document.getElementById('landing');
  ov.style.background='#080d1a';
  ov.classList.add('on');
  setTimeout(()=>{
    app.style.display='none';
    app.classList.remove('show');
    document.body.classList.remove('ai-mode','ds-mode');
    land.style.display='flex';
    land.classList.remove('exit');
    cancelAnimationFrame(aRaf);actx=null;
    cancelAnimationFrame(dsRaf);dsctx=null;
    landingActive = true;
    if (!isMobileViewport) {
      drawNC();
      drawDC();
    }
    window.scrollTo(0,0);
    setTimeout(()=>ov.classList.remove('on'),200);
  },250);
}

window.addEventListener('popstate', (event) => {
  const hash = window.location.hash;
  if (hash === '#ai') {
    if (mode !== 'ai') {
      window.enterMode('ai', false);
    }
  } else if (hash === '#design') {
    if (mode !== 'design') {
      window.enterMode('design', false);
    }
  } else {
    if (mode !== null && mode !== 'landing') {
      window.backToLanding(false);
    }
  }
});

window.goTo = function(id){
  if(mode === 'design') {
    if(id === 'projects') id = 'featured-works';
    if(id === 'skills') id = 'skills-ds';
    if(id === 'about') id = 'about-ds';
    if(id === 'software') id = 'software-ds';
  } else if (mode === 'ai') {
    if(id === 'projects') id = 'projects-ai';
    if(id === 'skills') id = 'skills-ai';
    if(id === 'about') id = 'about-ai';
  }
  const el=document.getElementById(id);
  if(el) el.scrollIntoView({behavior:'smooth'});
}

/* ═══════════════ SCROLL ═══════════════ */
window.addEventListener('scroll',()=>{
  const nav = document.getElementById('nav');
  if(nav) nav.classList.toggle('sc',window.scrollY>60);
}, { passive: true });

function initReveal(){
  document.querySelectorAll('.rev').forEach(el=>{el.classList.remove('vis')});
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('vis')});
  },{threshold:.1,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.rev').forEach(el=>obs.observe(el));
}

/* ═══════════════ INIT ═══════════════ */
let prevWidth = window.innerWidth;
window.addEventListener('resize', () => {
  if (window.innerWidth === prevWidth) return;
  prevWidth = window.innerWidth;
  
  initNodes();
  initDesignParticles();
  if (ac && mode === 'ai') {
    ac.width = innerWidth;
    ac.height = innerHeight;
  }
  if (dsc && mode === 'design') {
    dsc.width = innerWidth;
    dsc.height = innerHeight;
  }
});

// Initialize on DOMContentLoaded to ensure elements are present
document.addEventListener('DOMContentLoaded', () => {
  setupHoverEffects();
  wrapLandingTitleChars(document.getElementById('title-ai'));
  wrapLandingTitleChars(document.getElementById('title-ds'));
  initNodes();
  initDesignParticles();
  if (!isMobileViewport) {
    drawNC();
    drawDC();
  }

  // Handle initial hash routing
  const hash = window.location.hash;
  if (hash === '#ai') {
    window.enterMode('ai', false);
  } else if (hash === '#design') {
    window.enterMode('design', false);
  }

  // Scroll to top button logic
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 200) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Update Coding Consistency stats dynamically from Codolio
  updateCodingStats();
  // Refresh stats every 5 minutes (300000ms) to track regularly without manual reload
  setInterval(updateCodingStats, 300000);

  // Load certifications dynamically from JSON database
  loadCertifications();
});

window.toggleCaseStudy = function(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const allCS = document.querySelectorAll('.full-case-study');
  allCS.forEach(cs => {
    if (cs.id !== id) cs.style.display = 'none';
  });
  if (el.style.display === 'none' || el.style.display === '') {
    el.style.display = 'block';
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    el.style.display = 'none';
  }
}

// Authoritative fallback baseline (matching verified live metrics)
const defaultCodingStats = {
  codolioRank: '15,751',
  codolioProblems: 1088,
  codolioActive: 208,
  leetcodeRating: 1440,
  leetcodeSolved: 154,
  leetcodeActive: 120,
  codechefRating: 1167,
  codechefSolved: 898,
  codechefActive: 157,
  githubContrib: 187,
  githubCurrent: 1,
  githubLongest: 21,
  aiStreak: 15,
  aiSolved: 1088,
  aiCommits: 187,
};

let activeCodingState = { ...defaultCodingStats };

function applyCodingStatsToDOM(stats) {
  const codolioRankEl = document.getElementById('codolio-rank');
  const codolioProblemsEl = document.getElementById('codolio-problems');
  const codolioActiveEl = document.getElementById('codolio-active');
  const leetRatingEl = document.getElementById('leetcode-rating');
  const leetSolvedEl = document.getElementById('leetcode-solved');
  const leetActiveEl = document.getElementById('leetcode-active');
  const codechefRatingEl = document.getElementById('codechef-rating');
  const codechefSolvedEl = document.getElementById('codechef-solved');
  const codechefActiveEl = document.getElementById('codechef-active');
  const githubContribEl = document.getElementById('github-contrib');
  const githubCurrentEl = document.getElementById('github-current');
  const githubLongestEl = document.getElementById('github-longest');
  const aiStreakEl = document.getElementById('ai-streak-current');
  const aiSolvedEl = document.getElementById('ai-solved');
  const aiCommitsEl = document.getElementById('ai-commits');

  if (codolioRankEl && stats.codolioRank) codolioRankEl.textContent = `Global Rank: ${stats.codolioRank}`;
  if (codolioProblemsEl && stats.codolioProblems) codolioProblemsEl.textContent = `Problems: ${stats.codolioProblems}`;
  if (codolioActiveEl && stats.codolioActive) codolioActiveEl.textContent = `Active Days: ${stats.codolioActive}`;

  if (leetRatingEl && stats.leetcodeRating) leetRatingEl.textContent = `Contest Rating: ${stats.leetcodeRating}`;
  if (leetSolvedEl && stats.leetcodeSolved) leetSolvedEl.textContent = `Solved: ${stats.leetcodeSolved}`;
  if (leetActiveEl && stats.leetcodeActive) leetActiveEl.textContent = `Active Days: ${stats.leetcodeActive}`;

  if (codechefRatingEl && stats.codechefRating) codechefRatingEl.textContent = `Rating: ${stats.codechefRating}`;
  if (codechefSolvedEl && stats.codechefSolved) codechefSolvedEl.textContent = `Solved: ${stats.codechefSolved}`;
  if (codechefActiveEl && stats.codechefActive) codechefActiveEl.textContent = `Active Days: ${stats.codechefActive}`;

  if (githubContribEl && stats.githubContrib) githubContribEl.textContent = `Contributions: ${stats.githubContrib}`;
  if (githubCurrentEl && stats.githubCurrent !== undefined) githubCurrentEl.textContent = `Current Streak: ${stats.githubCurrent} Days`;
  if (githubLongestEl && stats.githubLongest !== undefined) githubLongestEl.textContent = `Longest Streak: ${stats.githubLongest} Days`;

  if (aiStreakEl && stats.aiStreak) aiStreakEl.textContent = `${stats.aiStreak} Days`;
  if (aiSolvedEl && stats.aiSolved) aiSolvedEl.textContent = `${stats.aiSolved}+`;
  if (aiCommitsEl && stats.aiCommits) aiCommitsEl.textContent = `${stats.aiCommits}+`;
}

function persistCodingStats() {
  try {
    localStorage.setItem('portfolio_coding_stats', JSON.stringify(activeCodingState));
  } catch (e) {
    // Gracefully handle private browsing mode
  }
}

async function updateCodingStats() {
  // 1. First check localStorage for previously cached live stats
  try {
    const cached = localStorage.getItem('portfolio_coding_stats');
    if (cached) {
      const parsed = JSON.parse(cached);
      activeCodingState = { ...activeCodingState, ...parsed };
    }
  } catch (e) {}

  // Immediately paint DOM with best known stats
  applyCodingStatsToDOM(activeCodingState);

  // 2. Fetch baseline local Codolio JSON (try ./codolio.json, then ./public/codolio.json)
  try {
    const candidatePaths = ['./codolio.json', './public/codolio.json', '/codolio.json'];
    let localData = null;
    for (const p of candidatePaths) {
      try {
        const res = await fetch(p);
        if (res.ok) {
          localData = await res.json();
          break;
        }
      } catch (err) {}
    }

    if (localData && localData.data && localData.data.platformProfiles?.platformProfiles) {
      const profiles = localData.data.platformProfiles.platformProfiles;

      // Extract unique active days across all platforms
      const allActiveTimestamps = new Set();
      let totalSolvedAcrossPlatforms = 0;

      profiles.forEach(p => {
        const count = p.totalQuestionStats?.totalQuestionCounts || 0;
        totalSolvedAcrossPlatforms += count;

        const cal = p.dailyActivityStatsResponse?.submissionCalendar;
        if (cal) {
          const parsedCal = typeof cal === 'string' ? JSON.parse(cal) : cal;
          Object.keys(parsedCal).forEach(ts => {
            allActiveTimestamps.add(Math.floor(parseInt(ts) / 86400));
          });
        }
      });

      if (totalSolvedAcrossPlatforms > 0) {
        activeCodingState.codolioProblems = Math.max(activeCodingState.codolioProblems, totalSolvedAcrossPlatforms);
        activeCodingState.aiSolved = activeCodingState.codolioProblems;
      }
      if (allActiveTimestamps.size > 0) {
        activeCodingState.codolioActive = Math.max(activeCodingState.codolioActive, allActiveTimestamps.size);
      }

      // Check specific platforms
      const leet = profiles.find(p => p.platform === 'leetcode');
      if (leet) {
        if (leet.userStats?.currentRating) activeCodingState.leetcodeRating = leet.userStats.currentRating;
        if (leet.totalQuestionStats?.totalQuestionCounts) {
          activeCodingState.leetcodeSolved = Math.max(activeCodingState.leetcodeSolved, leet.totalQuestionStats.totalQuestionCounts);
        }
      }

      const cc = profiles.find(p => p.platform === 'codechef');
      if (cc) {
        if (cc.userStats?.currentRating) activeCodingState.codechefRating = cc.userStats.currentRating;
        if (cc.totalQuestionStats?.totalQuestionCounts) {
          activeCodingState.codechefSolved = Math.max(activeCodingState.codechefSolved, cc.totalQuestionStats.totalQuestionCounts);
        }
      }

      applyCodingStatsToDOM(activeCodingState);
      persistCodingStats();
    }
  } catch (err) {
    console.warn('Local Codolio JSON baseline note:', err);
  }

  // 3. Fetch live LeetCode stats (solved & active calendar)
  fetch('https://leetcode-api-faisal.vercel.app/kit28adc018')
    .then(res => res.ok ? res.json() : Promise.reject(res.status))
    .then(data => {
      if (data && data.totalSolved) {
        activeCodingState.leetcodeSolved = data.totalSolved;
      }
      if (data && data.submissionCalendar) {
        const cal = typeof data.submissionCalendar === 'string' ? JSON.parse(data.submissionCalendar) : data.submissionCalendar;
        const activeCount = Object.keys(cal).length;
        if (activeCount > 0) activeCodingState.leetcodeActive = activeCount;
      }
      // Recompute Codolio total problems dynamically
      activeCodingState.codolioProblems = (activeCodingState.leetcodeSolved || 154) + (activeCodingState.codechefSolved || 898) + 36;
      activeCodingState.aiSolved = activeCodingState.codolioProblems;
      applyCodingStatsToDOM(activeCodingState);
      persistCodingStats();
    })
    .catch(err => {
      // Keep authoritative baseline gracefully
    });

  // 4. Fetch live LeetCode contest rating
  fetch('https://alfa-leetcode-api.onrender.com/kit28adc018/contest')
    .then(res => res.ok ? res.json() : Promise.reject(res.status))
    .then(data => {
      if (data && data.contestRating) {
        activeCodingState.leetcodeRating = Math.round(data.contestRating);
        applyCodingStatsToDOM(activeCodingState);
        persistCodingStats();
      }
    })
    .catch(err => {
      // 429 rate limit or cold start: gracefully retain authoritative rating 1440
    });

  // 5. Fetch live CodeChef stats
  fetch('https://codechefapi.vercel.app/kit28adc018')
    .then(res => res.ok ? res.json() : Promise.reject(res.status))
    .then(data => {
      if (data) {
        if (data.currentRating) activeCodingState.codechefRating = data.currentRating;
        if (data.numberOfProblemsSolved) activeCodingState.codechefSolved = data.numberOfProblemsSolved;
        activeCodingState.codolioProblems = (activeCodingState.leetcodeSolved || 154) + (activeCodingState.codechefSolved || 898) + 36;
        activeCodingState.aiSolved = activeCodingState.codolioProblems;
        applyCodingStatsToDOM(activeCodingState);
        persistCodingStats();
      }
    })
    .catch(err => {
      // Keep authoritative baseline gracefully
    });

  // 6. Fetch live GitHub stats
  fetch('https://github-contributions-api.jogruber.de/v4/arikrishna-03')
    .then(res => res.ok ? res.json() : Promise.reject(res.status))
    .then(json => {
      if (json && json.contributions) {
        const totalContrib = Object.values(json.total || {}).reduce((a, b) => a + b, 0);
        if (totalContrib > 0) {
          activeCodingState.githubContrib = totalContrib;
          activeCodingState.aiCommits = totalContrib;
        }

        const sorted = json.contributions.sort((a, b) => a.date.localeCompare(b.date));
        const activeDays = sorted.filter(c => c.count > 0);
        const dayIndices = activeDays.map(c => Math.floor(new Date(c.date).getTime() / 1000 / 86400)).sort((a, b) => a - b);

        let longestStreak = 0;
        let currentStreak = 0;

        if (dayIndices.length > 0) {
          let temp = 1;
          for (let i = 1; i < dayIndices.length; i++) {
            if (dayIndices[i] === dayIndices[i - 1] + 1) {
              temp++;
            } else if (dayIndices[i] > dayIndices[i - 1] + 1) {
              longestStreak = Math.max(longestStreak, temp);
              temp = 1;
            }
          }
          longestStreak = Math.max(longestStreak, temp);

          const today = Math.floor(Date.now() / 1000 / 86400);
          const lastActive = dayIndices[dayIndices.length - 1];
          if (lastActive === today || lastActive === today - 1) {
            currentStreak = 1;
            for (let i = dayIndices.length - 2; i >= 0; i--) {
              if (dayIndices[i] === dayIndices[i + 1] - 1) {
                currentStreak++;
              } else {
                break;
              }
            }
          }
        }

        activeCodingState.githubCurrent = currentStreak;
        activeCodingState.githubLongest = Math.max(activeCodingState.githubLongest, longestStreak);

        applyCodingStatsToDOM(activeCodingState);
        persistCodingStats();
      }
    })
    .catch(err => {
      // Keep authoritative baseline gracefully
    });
}

async function loadCertifications() {
  try {
    let fetchUrl = GOOGLE_DRIVE_SCRIPT_URL || './certifications.json';
    if (GOOGLE_DRIVE_SCRIPT_URL) {
      const sep = GOOGLE_DRIVE_SCRIPT_URL.includes('?') ? '&' : '?';
      fetchUrl = `${GOOGLE_DRIVE_SCRIPT_URL}${sep}_=${Date.now()}`;
    }
    const res = await fetch(fetchUrl, { cache: 'no-store' });
    if (res.ok) {
      const certs = await res.json();
      const certsGrid = document.getElementById('certs-grid');
      if (certsGrid && Array.isArray(certs)) {
        certsGrid.innerHTML = certs.map(c => `
          <a href="${c.path}" class="cert-item interactive" data-title="${c.title}" data-platform="${c.platform}">
            ${c.title} <span>- ${c.platform}</span>
          </a>
        `).join('');

        // Wire up modal events
        const modal = document.getElementById('cert-viewer-modal');
        const modalIframe = document.getElementById('cert-modal-iframe');
        const modalImg = document.getElementById('cert-modal-img');
        const modalTitle = document.getElementById('cert-modal-title');
        const modalSubtitle = document.getElementById('cert-modal-subtitle');
        const modalDownloadLink = document.getElementById('cert-modal-download-link');

        if (modal && modalIframe && modalTitle && modalSubtitle && modalDownloadLink) {
          const openModal = (title, platform, path) => {
            modalTitle.textContent = title;
            modalSubtitle.textContent = platform;
            
            const driveIdMatch = path.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
            const driveId = driveIdMatch ? driveIdMatch[1] : null;

            if (driveId) {
              modalIframe.style.display = 'none';
              modalIframe.src = 'about:blank';
              if (modalImg) {
                modalImg.src = `https://drive.google.com/thumbnail?id=${driveId}&sz=w1200`;
                modalImg.style.display = 'block';
              }
            } else {
              if (modalImg) {
                modalImg.style.display = 'none';
                modalImg.src = '';
              }
              modalIframe.style.display = 'block';
              
              // Append PDF options only for local files, keep Google Drive URLs clean
              if (path.startsWith('http') || path.startsWith('//')) {
                modalIframe.src = path;
              } else {
                modalIframe.src = path + '#toolbar=0&navpanes=0&view=Fit';
              }
            }
            modalDownloadLink.href = path.replace('/preview', '/view');
            
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('cert-modal-open');
          };

          const closeModal = () => {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('cert-modal-open');
            modalIframe.src = 'about:blank';
            if (modalImg) {
              modalImg.src = '';
            }
            
            // Ensure cursor is visible again upon modal close
            if (cur) cur.style.opacity = '1';
            if (ring) ring.style.opacity = '1';
          };

          // Handle clicks on certifications
          certsGrid.querySelectorAll('.cert-item').forEach(item => {
            item.addEventListener('click', (e) => {
              e.preventDefault();
              const path = item.getAttribute('href');
              const title = item.getAttribute('data-title');
              const platform = item.getAttribute('data-platform');
              openModal(title, platform, path);
            });
          });

          // Close modal when clicking on the overlay background
          modal.addEventListener('click', (e) => {
            if (e.target === modal) {
              closeModal();
            }
          });

          // Close modal on Escape key press
          window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
              closeModal();
            }
          });

          // Hide custom cursor when mouse is inside the iframe, show when outside
          modalIframe.addEventListener('mouseenter', () => {
            if (cur) cur.style.opacity = '0';
            if (ring) ring.style.opacity = '0';
          });
          modalIframe.addEventListener('mouseleave', () => {
            if (cur) cur.style.opacity = '1';
            if (ring) ring.style.opacity = '1';
          });

          // Re-trigger hover binding on new interactive elements
          if (typeof setupHoverEffects === 'function') {
            setupHoverEffects();
          }
        }
      }
    }
  } catch (error) {
    console.error('Error loading certifications:', error);
  }
}


/* ═══════════════ SKILL CONFIDENCE BARS ═══════════════ */
(function initSkillBars() {
  const cards = document.querySelectorAll('.sk-cat--bars');
  if (!cards.length) return;

  cards.forEach(card => {
    let animated = false;

    card.addEventListener('mouseenter', () => {
      if (animated) return;
      animated = true;

      // Animate all fills in this card simultaneously
      card.querySelectorAll('[class*="sk-bar-fill"]').forEach((fill, i) => {
        const target = fill.dataset.width || '0';
        // Stagger slightly so bars sweep in one after another
        setTimeout(() => {
          fill.style.width = target + '%';
        }, i * 60);
      });
    });
  });
})();

/* ═══════════════ HORIZONTAL SCROLL PROJECTS ═══════════════ */
(function initHorizontalProjectsScroll() {
  const container = document.getElementById('projects-ai');
  const track = document.getElementById('ai-projects-track');
  const progressBar = document.getElementById('h-scroll-progress');
  if (!container || !track) return;

  let ticking = false;

  function updateScroll() {
    if (window.innerWidth <= 900) {
      track.style.transform = 'none';
      ticking = false;
      return;
    }

    const rect = container.getBoundingClientRect();
    const containerHeight = container.offsetHeight;
    const windowHeight = window.innerHeight;
    const maxScroll = containerHeight - windowHeight;

    if (maxScroll <= 0) {
      ticking = false;
      return;
    }

    if (rect.top <= 0 && rect.bottom >= windowHeight) {
      const scrolled = -rect.top;
      const progress = Math.min(Math.max(scrolled / maxScroll, 0), 1);
      const maxTranslate = track.scrollWidth - window.innerWidth + (window.innerWidth * 0.08);
      track.style.transform = `translateX(-${progress * maxTranslate}px)`;
      if (progressBar) progressBar.style.width = `${progress * 100}%`;
    } else if (rect.top > 0) {
      track.style.transform = 'translateX(0px)';
      if (progressBar) progressBar.style.width = '0%';
    } else if (rect.bottom < windowHeight) {
      const maxTranslate = track.scrollWidth - window.innerWidth + (window.innerWidth * 0.08);
      track.style.transform = `translateX(-${maxTranslate}px)`;
      if (progressBar) progressBar.style.width = '100%';
    }

    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateScroll);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick, { passive: true });

  // Hook into mode changes & navigation
  window.addEventListener('hashchange', () => setTimeout(requestTick, 300));
  
  const origGoTo = window.goTo;
  window.goTo = function(id) {
    if (origGoTo) origGoTo(id);
    setTimeout(requestTick, 400);
  };

  requestTick();
})();

/* ═══════════════ INTERACTIVE PROJECT SHOWCASE CARDS ═══════════════ */
(function initInteractiveProjectShowcase() {
  // 1. Universal 3D Tilt & Dynamic Mouse Spotlight
  const visualCards = document.querySelectorAll('.h-project-visual[data-tilt-card]');

  visualCards.forEach((card) => {
    const mockup = card.querySelector('.hpv-mockup');
    const spotlight = card.querySelector('.hpv-spotlight');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update spotlight position
      if (spotlight) {
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      }

      // Subtle 3D tilt calculation
      const xPct = (x / rect.width) - 0.5;
      const yPct = (y / rect.height) - 0.5;
      const tiltX = -yPct * 10;
      const tiltY = xPct * 12;

      if (mockup) {
        mockup.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      if (mockup) {
        mockup.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }
    });
  });

  // 2. EDUTR // v2.4 (ML Adaptive Core) Controls & Frequency Reactor
  const edutrWaveform = document.getElementById('edutr-waveform');
  const edutrHz = document.getElementById('edutr-freq-hz');
  const edutrRunBtn = document.getElementById('edutr-run-btn');
  const edutrLivePill = document.getElementById('edutr-live-pill');
  const edutrValLat = document.getElementById('edutr-val-lat');
  const edutrValRet = document.getElementById('edutr-val-ret');
  const edutrValEng = document.getElementById('edutr-val-eng');
  const edutrTeleText = document.getElementById('edutr-tele-text');
  const simBtns = document.querySelectorAll('.hpv-sim-btn');
  const edutrMetricBoxes = document.querySelectorAll('.hpv-mockup--edutr .hpv-interactive-box');

  let activeMode = 'adaptive';
  const modeConfigs = {
    adaptive: { lat: '24ms', ret: '+42%', eng: 'Heuristic', tele: 'SYSTEM: ADAPTIVE CURRICULUM // LOSS: 0.0142 // VECTOR SYNCED' },
    stress: { lat: '16ms', ret: '+58%', eng: 'Dense-MLP', tele: 'SYSTEM: HIGH-THROUGHPUT STRESS TEST // BATCH: 256 // ZERO-DROP' },
    diagnostic: { lat: '32ms', ret: '+39%', eng: 'Bayesian', tele: 'SYSTEM: COGNITIVE DIAGNOSTIC PASS // HEURISTIC WEIGHTS VALIDATED' }
  };

  // Mode switching
  simBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      simBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeMode = btn.dataset.mode || 'adaptive';
      triggerInference(false);
    });
  });

  // Waveform interactive reaction
  if (edutrWaveform) {
    const bars = edutrWaveform.querySelectorAll('span');
    const baseHeights = [30, 55, 78, 92, 65, 88, 50, 95, 70, 40, 60, 85, 90, 45, 72, 35, 68, 82, 52, 28];

    edutrWaveform.addEventListener('mousemove', (e) => {
      const rect = edutrWaveform.getBoundingClientRect();
      const mouseX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const targetIdx = Math.floor((mouseX / rect.width) * bars.length);

      bars.forEach((bar, idx) => {
        const dist = Math.abs(idx - targetIdx);
        const factor = Math.max(0, 1 - (dist / 4.5));
        const newHeight = Math.min(100, Math.max(15, (baseHeights[idx] * 0.3) + (factor * 75) + (Math.random() * 8)));
        bar.style.height = `${newHeight}%`;
      });

      if (edutrHz) {
        const hz = (41.2 + (mouseX / rect.width) * 6.8).toFixed(1);
        edutrHz.textContent = `${hz} kHz // RES: 0.${90 + Math.floor(Math.random() * 9)}`;
      }
    });

    edutrWaveform.addEventListener('mouseleave', () => {
      bars.forEach((bar, idx) => {
        bar.style.height = `${baseHeights[idx]}%`;
      });
      if (edutrHz) edutrHz.textContent = '44.1 kHz // RES: 0.94';
    });
  }

  // Live Inference Trigger function
  function triggerInference(showFlash = true) {
    if (!edutrLivePill || !edutrValLat || !edutrValRet) return;

    if (showFlash) {
      edutrLivePill.classList.add('inferring');
      edutrLivePill.textContent = '● INFERRING...';
    }

    // Number ticker jitter
    let count = 0;
    const tickerInterval = setInterval(() => {
      count++;
      const jitterLat = Math.floor(18 + Math.random() * 26);
      edutrValLat.textContent = `${jitterLat}ms`;
      edutrValLat.style.color = '#67c7eb';

      if (count >= 5) {
        clearInterval(tickerInterval);
        const cfg = modeConfigs[activeMode] || modeConfigs.adaptive;
        edutrValLat.textContent = cfg.lat;
        edutrValLat.style.color = '#00ffaa';
        edutrValRet.textContent = cfg.ret;
        if (edutrValEng) edutrValEng.textContent = cfg.eng;
        if (edutrTeleText) edutrTeleText.textContent = cfg.tele;

        if (showFlash) {
          setTimeout(() => {
            edutrLivePill.classList.remove('inferring');
            edutrLivePill.textContent = '● INFERENCE ONLINE';
          }, 350);
        }
      }
    }, 45);
  }

  if (edutrRunBtn) {
    edutrRunBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerInference(true);
    });
  }

  edutrMetricBoxes.forEach(box => {
    box.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerInference(true);
    });
  });

  // 3. BUILDATHON 2026 (Interactive Role Switcher & Live HUD)
  const roleTabs = document.querySelectorAll('#hackathon-role-tabs .hpv-role-btn');
  const roleViews = document.querySelectorAll('#hackathon-role-hud .hpv-hud-view');
  const btnAudit = document.getElementById('btn-simulate-audit');
  const btnSyncFaculty = document.getElementById('btn-sync-faculty');
  const btnCalcGpa = document.getElementById('btn-calc-gpa');
  const adminLogStream = document.getElementById('admin-log-stream');
  const auditStatusMsg = document.getElementById('audit-status-msg');
  const facultyStatusMsg = document.getElementById('faculty-status-msg');
  const facultyAttVal = document.getElementById('faculty-att-val');
  const facultyGrdVal = document.getElementById('faculty-grd-val');
  const studentStatusMsg = document.getElementById('student-status-msg');

  roleTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetRole = tab.dataset.role;

      roleTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      roleViews.forEach(v => {
        if (v.dataset.view === targetRole) {
          v.classList.add('active');
        } else {
          v.classList.remove('active');
        }
      });
    });
  });

  // Admin audit button
  if (btnAudit && adminLogStream) {
    btnAudit.addEventListener('click', (e) => {
      e.stopPropagation();
      btnAudit.innerHTML = '<span>SCANNING...</span><span class="gold-arrow">⚡</span>';
      btnAudit.style.opacity = '0.7';

      setTimeout(() => {
        const timeStr = new Date().toTimeString().split(' ')[0];
        const newLog = document.createElement('div');
        newLog.className = 'hpv-log-row';
        newLog.innerHTML = `<span class="log-t">[${timeStr}]</span> <span class="log-ok">VERIFIED</span> 12 Campus microservices latency normal (&lt;4ms)`;
        
        adminLogStream.appendChild(newLog);
        if (adminLogStream.children.length > 4) {
          adminLogStream.removeChild(adminLogStream.children[0]);
        }

        if (auditStatusMsg) auditStatusMsg.textContent = '● Complete: 0 Anomalies Flagged';
        btnAudit.innerHTML = '<span>RUN SECURITY AUDIT</span><span class="gold-arrow">⚡</span>';
        btnAudit.style.opacity = '1';
      }, 500);
    });
  }

  // Faculty sync button
  if (btnSyncFaculty) {
    btnSyncFaculty.addEventListener('click', (e) => {
      e.stopPropagation();
      btnSyncFaculty.innerHTML = '<span>SYNCING...</span><span class="gold-arrow">↻</span>';
      
      setTimeout(() => {
        if (facultyAttVal) facultyAttVal.textContent = '96.8%';
        if (facultyGrdVal) facultyGrdVal.textContent = '124 / 124';
        if (facultyStatusMsg) facultyStatusMsg.textContent = '✓ 124/124 student biometric feeds verified';
        btnSyncFaculty.innerHTML = '<span>SYNC ATTENDANCE PIPELINE</span><span class="gold-arrow">↻</span>';
      }, 450);
    });
  }

  // Student GPA forecast
  if (btnCalcGpa) {
    btnCalcGpa.addEventListener('click', (e) => {
      e.stopPropagation();
      const sp1 = document.getElementById('sp-val-1');
      const sp2 = document.getElementById('sp-val-2');
      if (sp1) sp1.textContent = '95%';
      if (sp2) sp2.textContent = '92%';
      if (studentStatusMsg) studentStatusMsg.textContent = '★ Recalculated CGPA: 3.97 / 4.00 (Summa Cum Laude)';
    });
  }

  // 4. PORTFOLIO V2 (Dual-Perspective Lens Switcher & Theme Lab)
  const lensBtns = document.querySelectorAll('#portfolio-lens-switch .hpv-lens-btn');
  const lensViews = document.querySelectorAll('.hpv-mockup--portfolio .hpv-lens-view');
  const btnSwapLens = document.getElementById('btn-swap-lens');
  const swatches = document.querySelectorAll('.hpv-swatch');
  const swatchName = document.getElementById('brand-swatch-name');
  const portfolioGlow = document.getElementById('portfolio-glow');

  function setLens(lens) {
    lensBtns.forEach(b => {
      b.classList.toggle('active', b.dataset.lens === lens);
    });
    lensViews.forEach(v => {
      v.classList.toggle('active', v.dataset.view === lens);
    });
  }

  lensBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      setLens(btn.dataset.lens);
    });
  });

  if (btnSwapLens) {
    const lensSequence = ['dual', 'ai', 'brand'];
    let currentIdx = 0;
    btnSwapLens.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIdx = (currentIdx + 1) % lensSequence.length;
      setLens(lensSequence[currentIdx]);
    });
  }

  // Brand color swatches
  swatches.forEach(swatch => {
    swatch.addEventListener('click', (e) => {
      e.stopPropagation();
      swatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      const color = swatch.dataset.color || '#67c7eb';
      const name = swatch.dataset.name || 'Cyber Cyan';

      if (swatchName) {
        swatchName.textContent = `${name} (${color.toUpperCase()})`;
        swatchName.style.color = color;
      }

      if (portfolioGlow) {
        portfolioGlow.style.background = `radial-gradient(circle, ${color}33 0%, transparent 60%)`;
      }
    });
  });

})();

