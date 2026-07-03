import './style.css';

/* ═══════════════ CURSOR & TAIL ═══════════════ */
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
const tailPoints = Array(8).fill().map(() => ({x: -100, y: -100}));

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  if (firstMove) {
    rx = mx; ry = my;
    tailPoints.forEach(p => { p.x = mx; p.y = my; });
    firstMove = false;
  }
  if (cur) cur.style.left = mx + 'px';
  if (cur) cur.style.top = my + 'px';
});

(function tick() {
  rx += (mx - rx) * 0.11;
  ry += (my - ry) * 0.11;
  if (ring) ring.style.left = rx + 'px';
  if (ring) ring.style.top = ry + 'px';
  
  if (tailCtx && !firstMove) {
    tailCtx.clearRect(0, 0, tailCanvas.width, tailCanvas.height);
    
    // Smoothly follow the mouse with the head of the tail
    tailPoints[0].x += (mx - tailPoints[0].x) * 0.6;
    tailPoints[0].y += (my - tailPoints[0].y) * 0.6;
    
    // Each subsequent point follows the one before it
    for (let i = 1; i < tailPoints.length; i++) {
      tailPoints[i].x += (tailPoints[i-1].x - tailPoints[i].x) * 0.5;
      tailPoints[i].y += (tailPoints[i-1].y - tailPoints[i].y) * 0.5;
    }
    
    tailCtx.lineCap = 'round';
    tailCtx.lineJoin = 'round';
    
    // Draw fading bezier curves
    for (let i = 1; i < tailPoints.length - 1; i++) {
      tailCtx.beginPath();
      tailCtx.moveTo(tailPoints[i-1].x, tailPoints[i-1].y);
      const xc = (tailPoints[i].x + tailPoints[i+1].x) / 2;
      const yc = (tailPoints[i].y + tailPoints[i+1].y) / 2;
      tailCtx.quadraticCurveTo(tailPoints[i].x, tailPoints[i].y, xc, yc);
      
      const progress = 1 - (i / tailPoints.length);
      tailCtx.lineWidth = progress * 7; // Tapers from 7px down to 0
      tailCtx.strokeStyle = `rgba(247, 208, 89, ${progress * 0.8})`;
      tailCtx.stroke();
    }
  }
  
  requestAnimationFrame(tick);
})();

function setupHoverEffects() {
  document.querySelectorAll('a,button,.l-side,.l-center,.l-photo-wrap,.ai-pc,.ds-pc,.ai-stat,.sk-cat,.lab-c,.tool-chip,.ds-case-card,.t-card,.sw-icon,.hc-card,.pt-step').forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('hover-state'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('hover-state'));
  });
}

/* ═══════════════ PROFILE ORB (golden particle sphere on photo hover) ═══════════════ */
const poc = document.getElementById('profile-orb-canvas');
const pwrap = document.querySelector('.l-photo-wrap');
let pocCtx = null;
let profileOrbRaf = null;
let profileOrbActive = false;
let profileOrbPts = [];
const PROFILE_ORB_N = 920;

function buildProfileOrbPoints(n) {
  const pts = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = n === 1 ? 0 : 1 - (2 * i) / (n - 1);
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const th = golden * i;
    pts.push({
      bx: Math.cos(th) * r,
      by: y,
      bz: Math.sin(th) * r
    });
  }
  return pts;
}

function resizeProfileOrb() {
  if (!poc) return;
  const w = 580;
  const h = 580;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  poc.width = Math.floor(w * dpr);
  poc.height = Math.floor(h * dpr);
  pocCtx = poc.getContext('2d');
  if (!pocCtx) return;
  pocCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawProfileOrb(ts) {
  if (!profileOrbActive || !pocCtx || !poc) {
    profileOrbRaf = null;
    return;
  }
  const t = (ts != null ? ts : performance.now()) * 0.001;
  const w = 580;
  const h = 580;
  pocCtx.clearRect(0, 0, w, h);
  const cx = w * 0.5;
  const cy = h * 0.5;
  const rotY = t * 0.62;
  const rotX = Math.sin(t * 0.38) * 0.42;
  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);

  const projected = [];
  for (let i = 0; i < profileOrbPts.length; i++) {
    const p = profileOrbPts[i];
    const ang = Math.atan2(p.bz, p.bx);
    const rimBoost = Math.abs(p.by) > 0.42 ? 1 : 0.55;
    const wave =
      1 +
      0.1 * Math.sin(ang * 6 + t * 2.1) * rimBoost +
      0.06 * Math.sin(p.by * 11 + t * 1.4) +
      0.045 * Math.sin(ang * 3 - t * 1.1) * Math.sin(p.by * 5 + t * 0.8);
    let x = p.bx * wave;
    let y = p.by * wave;
    let z = p.bz * wave;

    const x1 = x * cosY + z * sinY;
    const z1 = -x * sinY + z * cosY;
    const y1 = y;
    const x2 = x1;
    const y2 = y1 * cosX - z1 * sinX;
    const z2 = y1 * sinX + z1 * cosX;

    const inv = 1.38 - z2 * 0.44;
    const sc = 208;
    const sx = cx + (x2 / inv) * sc;
    const sy = cy + (y2 / inv) * sc;
    const depth = (z2 + 1) * 0.5;
    projected.push({ sx, sy, depth, z2 });
  }

  projected.sort((a, b) => a.z2 - b.z2);

  for (let k = 0; k < projected.length; k++) {
    const q = projected[k];
    const rad = 0.85 + q.depth * 1.15;
    const alpha = 0.08 + q.depth * 0.82;
    pocCtx.fillStyle = `rgba(247, 240, 151, ${alpha * 0.55})`;
    pocCtx.beginPath();
    pocCtx.arc(q.sx, q.sy, rad * 1.6, 0, Math.PI * 2);
    pocCtx.fill();
  }
  for (let k = 0; k < projected.length; k++) {
    const q = projected[k];
    const rad = 0.55 + q.depth * 0.95;
    const alpha = 0.2 + q.depth * 0.75;
    pocCtx.fillStyle = `rgba(255, 250, 180, ${alpha})`;
    pocCtx.beginPath();
    pocCtx.arc(q.sx, q.sy, rad * 0.42, 0, Math.PI * 2);
    pocCtx.fill();
  }

  profileOrbRaf = requestAnimationFrame(drawProfileOrb);
}

function startProfileOrb() {
  profileOrbActive = true;
  if (!profileOrbPts.length) profileOrbPts = buildProfileOrbPoints(PROFILE_ORB_N);
  resizeProfileOrb();
  if (!profileOrbRaf && pocCtx) profileOrbRaf = requestAnimationFrame(drawProfileOrb);
}

function stopProfileOrb() {
  profileOrbActive = false;
  if (profileOrbRaf) cancelAnimationFrame(profileOrbRaf);
  profileOrbRaf = null;
  if (poc && pocCtx) {
    pocCtx.setTransform(1, 0, 0, 1, 0, 0);
    pocCtx.clearRect(0, 0, poc.width, poc.height);
  }
}

if (pwrap && poc) {
  pwrap.addEventListener('mouseenter', startProfileOrb);
  pwrap.addEventListener('mouseleave', stopProfileOrb);
  window.addEventListener('resize', () => {
    if (profileOrbActive) resizeProfileOrb();
  });
}

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
  if (!nc) return;
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
  if (!nctx || !nc) return;
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
  if (!dc) return;
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
  if (!dctx || !dc) return;
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

function initAI(){
  ac=document.getElementById('ai-canvas');
  if(!ac) return;
  actx=ac.getContext('2d');
  ac.width=innerWidth;ac.height=innerHeight;
  aN=[];
  for(let i=0;i<90;i++) aN.push({
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

/* ═══════════════ MODE ═══════════════ */
let mode=null;

window.enterMode = function(m){
  mode=m;
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
  },650);
}

function setMode(m){
  mode=m;
  document.body.classList.remove('ai-mode','ds-mode');
  document.body.classList.add(m==='ai'?'ai-mode':'ds-mode');
  document.getElementById('ai-c').style.display=m==='ai'?'block':'none';
  document.getElementById('ds-c').style.display=m==='design'?'block':'none';
  document.getElementById('m-txt').textContent=m==='ai'?'Design Mode':'AI Mode';
  document.getElementById('n-skills').style.display=m==='ai'?'':'none';
  document.getElementById('n-lab').style.display=m==='ai'?'':'none';
  document.getElementById('c-lbl').textContent=m==='ai'?'// Get in Touch':'Get in Touch';
  if(m==='ai'){setTimeout(initAI,80)}else{cancelAnimationFrame(aRaf);actx=null}
}

window.switchMode = function(){
  const nm=mode==='ai'?'design':'ai';
  const ov=document.getElementById('overlay');
  ov.style.background=nm==='ai'?'#080d1a':'#140c0e';
  ov.classList.add('on');
  setTimeout(()=>{
    setMode(nm);
    window.scrollTo(0,0);
    setTimeout(()=>{ov.classList.remove('on');initReveal()},300);
  },380);
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

window.backToLanding = function(){
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
    window.scrollTo(0,0);
    setTimeout(()=>ov.classList.remove('on'),300);
  },380);
}

window.goTo = function(id){
  if(mode === 'design') {
    if(id === 'projects') id = 'featured-works';
    if(id === 'skills') id = 'skills-ds';
    if(id === 'about') id = 'about-ds';
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
  if(nav) nav.classList.toggle('sc',scrollY>60);
});

function initReveal(){
  document.querySelectorAll('.rev').forEach(el=>{el.classList.remove('vis')});
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('vis')});
  },{threshold:.1,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.rev').forEach(el=>obs.observe(el));
}

/* ═══════════════ INIT ═══════════════ */
window.addEventListener('resize', () => {
  initNodes();
  initDesignParticles();
  if (ac && mode === 'ai') {
    ac.width = innerWidth;
    ac.height = innerHeight;
  }
});

// Initialize on DOMContentLoaded to ensure elements are present
document.addEventListener('DOMContentLoaded', () => {
  setupHoverEffects();
  wrapLandingTitleChars(document.getElementById('title-ai'));
  wrapLandingTitleChars(document.getElementById('title-ds'));
  initNodes();
  initDesignParticles();
  drawNC();
  drawDC();
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
