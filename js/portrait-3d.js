/* ==========================================================================
   3D Particle Portrait + Cinematic Flickering Light Reveal + Ambient Field
   WebGL2 with seamless Canvas2D fallback:
   1. 0.0s - 1.25s: 59,460 particles assemble from void in moody dark shadow
   2. 1.25s - 4.00s: Suspenseful Halloween/thriller light on/off pulses
      (strictly <= 1.5 pulses/sec, WCAG 2.3.1 compliant)
   3. 4.00s+: Full face reveal locked into razor-sharp Retina cutout with
      0.0px coordinate alignment & hover-clipped 3D emerald particles (zero ghost shadow)
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var canvas = document.getElementById('portrait-canvas');
  var slot = document.querySelector('[data-portrait-slot]');
  var photoEl = slot ? slot.querySelector('.portrait-fallback') : null;
  var flickerGlowEl = slot ? slot.querySelector('[data-flicker-glow]') : null;
  var modeBtns = Array.prototype.slice.call(document.querySelectorAll('[data-portrait-mode]'));
  var pauseBtn = document.querySelector('[data-portrait-pause]');
  var replayBtn = document.querySelector('[data-portrait-replay]');
  var data = window.__RUSHI_PORTRAIT__;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!canvas || !slot || !data) return;

  function decodeBase64Bytes(b64) {
    var bin = atob(b64);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }

  var posRaw = new Int16Array(decodeBase64Bytes(data.pos).buffer);
  var colRaw = decodeBase64Bytes(data.col);
  var portraitCount = data.count;
  var wallCount = 2200;
  var totalCount = portraitCount + wallCount;
  var IMG_ASPECT = data.aspect || (982 / 950);

  var state = {
    mode: reduced ? 'photo' : 'dots', // 'dots' | 'photo'
    paused: reduced,
    rotY: 0,
    userRot: 0,
    dragging: false,
    dragStartX: 0,
    dragStartRot: 0,
    ptrX: -9,
    ptrY: -9,
    ptrClientX: -999,
    ptrClientY: -999,
    ptrActive: 0,
    ripX: 0,
    ripY: 0,
    ripT: 10,
    introT: reduced ? 10 : 0, // 0..4.2s cinematic arrival sequence
    assemble: reduced ? 1 : 0,
    light: reduced ? 1 : 0.08,
    scrollEnergy: 0,
    lastScroll: window.scrollY,
    photoAlpha: reduced ? 1 : 0,
    maskR: 0
  };

  /* Suspenseful cinema light on/off curve (1.25s..4.0s, <= 1.5 pulses/sec WCAG 2.3.1 safe) */
  function computeIntroLight(t) {
    if (t >= 4.25) return 1.0;
    if (t < 1.25) {
      // Shrouded in dark moody shadow while particles assemble
      return 0.07 + 0.04 * (t / 1.25);
    }
    if (t < 1.62) {
      // Pulse 1: eerie dim glimpse ON then dark OFF
      var p1 = (t - 1.25) / 0.37;
      return 0.08 + Math.sin(p1 * Math.PI) * 0.56;
    }
    if (t < 1.98) {
      // Dark tension beat
      return 0.06;
    }
    if (t < 2.34) {
      // Pulse 2: sharper electric flicker ON then pitch dark
      var p2 = (t - 1.98) / 0.36;
      return 0.06 + Math.sin(p2 * Math.PI) * 0.78;
    }
    if (t < 2.72) {
      // Deep dark pause before climax
      return 0.05;
    }
    if (t < 3.24) {
      // Pulse 3: suspenseful warm-emerald swell ON, dips back dark
      var p3 = (t - 2.72) / 0.52;
      return 0.08 + Math.sin(p3 * Math.PI) * 0.84;
    }
    if (t < 3.60) {
      // Final blackout beat right before the big reveal
      return 0.07;
    }
    // 3.60s -> 4.25s: Full power-up surge & smooth reveal lock to 1.0
    var p4 = Math.min(1, (t - 3.60) / 0.55);
    var easeOut = 1 - Math.pow(1 - p4, 3);
    var surge = Math.sin(p4 * Math.PI) * 0.16;
    return Math.min(1.14, 0.08 + easeOut * 0.92 + surge);
  }

  function applyModeClasses() {
    root.classList.toggle('portrait-mode-dots', state.mode === 'dots');
    root.classList.toggle('portrait-mode-photo', state.mode === 'photo');
    modeBtns.forEach(function (btn) {
      btn.textContent = state.mode === 'dots' ? 'Switch to Photo' : 'Switch to 3D Dots';
    });
    if (pauseBtn) {
      pauseBtn.textContent = state.paused ? 'Resume 3D' : 'Pause 3D';
    }
  }

  modeBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      state.mode = state.mode === 'dots' ? 'photo' : 'dots';
      applyModeClasses();
    });
  });

  if (pauseBtn) {
    pauseBtn.addEventListener('click', function () {
      state.paused = !state.paused;
      applyModeClasses();
    });
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', function () {
      state.mode = 'dots';
      state.paused = false;
      state.introT = 0;
      state.assemble = 0;
      state.photoAlpha = 0;
      state.light = 0.07;
      state.maskR = 0;
      applyModeClasses();
    });
  }

  function clientToNdc(clientX, clientY) {
    var cRect = canvas.getBoundingClientRect();
    var vw = cRect.width || 1;
    var vh = cRect.height || 1;
    return {
      x: ((clientX - cRect.left) / vw) * 2 - 1,
      y: 1 - ((clientY - cRect.top) / vh) * 2
    };
  }

  /* Compute exact rendered image box inside .portrait-slot (object-fit: contain; object-position: center bottom) */
  function getExactImageBox(slotRect) {
    var sw = slotRect.width || 1;
    var sh = slotRect.height || 1;
    var slotAspect = sw / sh;
    var drawW, drawH;
    if (slotAspect > IMG_ASPECT) {
      drawH = sh;
      drawW = sh * IMG_ASPECT;
    } else {
      drawW = sw;
      drawH = sw / IMG_ASPECT;
    }
    var drawLeft = slotRect.left + (sw - drawW) * 0.5;
    var drawTop = slotRect.top + (sh - drawH); // object-position: center bottom
    return { left: drawLeft, top: drawTop, width: drawW, height: drawH };
  }

  /* Pointer & Drag Orbit on Portrait Slot + Viewport Repulsion */
  window.addEventListener('pointermove', function (e) {
    state.ptrClientX = e.clientX;
    state.ptrClientY = e.clientY;
    var ndc = clientToNdc(e.clientX, e.clientY);
    state.ptrX = ndc.x;
    state.ptrY = ndc.y;
    state.ptrActive = 1;
    if (state.dragging) {
      var dx = e.clientX - state.dragStartX;
      state.userRot = Math.max(-1.05, Math.min(1.05, state.dragStartRot + dx * 0.0065));
    }
  }, { passive: true });

  window.addEventListener('pointerleave', function () {
    state.ptrActive = 0;
  });

  slot.addEventListener('pointerdown', function (e) {
    state.dragging = true;
    state.dragStartX = e.clientX;
    state.dragStartRot = state.userRot;
    var ndc = clientToNdc(e.clientX, e.clientY);
    state.ripX = ndc.x;
    state.ripY = ndc.y;
    state.ripT = 0;
    if (slot.setPointerCapture) {
      try { slot.setPointerCapture(e.pointerId); } catch (_) {}
    }
  });

  window.addEventListener('pointerup', function () {
    state.dragging = false;
  });

  window.addEventListener('click', function (e) {
    if (e.target.closest('a, button, input, textarea, dialog')) return;
    var ndc = clientToNdc(e.clientX, e.clientY);
    state.ripX = ndc.x;
    state.ripY = ndc.y;
    state.ripT = 0;
  });

  /* Build interleaved buffers for portrait + ambient background wall */
  var positions = new Float32Array(totalCount * 3);
  var colors = new Float32Array(totalCount * 4);
  var seeds = new Float32Array(totalCount);

  for (var i = 0; i < portraitCount; i++) {
    positions[i * 3] = posRaw[i * 3] / 10000;
    positions[i * 3 + 1] = posRaw[i * 3 + 1] / 10000;
    positions[i * 3 + 2] = posRaw[i * 3 + 2] / 10000;

    colors[i * 4] = colRaw[i * 4] / 255;
    colors[i * 4 + 1] = colRaw[i * 4 + 1] / 255;
    colors[i * 4 + 2] = colRaw[i * 4 + 2] / 255;
    colors[i * 4 + 3] = colRaw[i * 4 + 3] / 255;
    seeds[i] = ((i * 2654435761) >>> 0) / 4294967295;
  }

  for (var w = 0; w < wallCount; w++) {
    var idx = portraitCount + w;
    var s1 = Math.sin(w * 12.9898) * 43758.5453;
    var s2 = Math.sin(w * 78.233) * 24634.6345;
    var s3 = Math.sin(w * 37.719) * 19374.2913;
    var rx = (s1 - Math.floor(s1)) * 2 - 1;
    var ry = (s2 - Math.floor(s2)) * 2 - 1;
    var rz = (s3 - Math.floor(s3)) * 2 - 1;
    positions[idx * 3] = rx;
    positions[idx * 3 + 1] = ry;
    positions[idx * 3 + 2] = rz;
    var isAccent = (w % 7 === 0);
    colors[idx * 4] = isAccent ? 0.06 : 0.62;
    colors[idx * 4 + 1] = isAccent ? 0.73 : 0.78;
    colors[idx * 4 + 2] = isAccent ? 0.51 : 0.71;
    colors[idx * 4 + 3] = isAccent ? 0.45 : 0.15;
    seeds[idx] = (w * 0.6180339887) % 1;
  }

  var gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false });

  if (!gl) {
    initCanvas2DFallback();
    return;
  }

  var VS = '#version 300 es\n' +
    'in vec3 aPos;\n' +
    'in vec4 aCol;\n' +
    'in float aSeed;\n' +
    'in float aIsWall;\n' +
    'uniform vec4 uSlot;\n' +       // centerX_ndc, centerY_ndc, halfW_ndc, halfH_ndc
    'uniform vec2 uRot;\n' +        // cos(rotY), sin(rotY)
    'uniform vec3 uPtr;\n' +        // ptrX_ndc, ptrY_ndc, active
    'uniform vec3 uRip;\n' +        // ripX_ndc, ripY_ndc, ripT
    'uniform vec4 uHoverClip;\n' +  // maskX_ndc, maskY_ndc, maskR_ndc_y, photoAlpha
    'uniform float uTime, uAssemble, uEnergy, uAspect, uDataAspect, uCellPx, uDpr, uFade, uLight;\n' +
    'out vec4 vCol;\n' +
    'out float vWall;\n' +
    'void main() {\n' +
    '  if (aIsWall > 0.5) {\n' +
    '    float wx = aPos.x + sin(uTime * 0.22 + aSeed * 18.0) * 0.04;\n' +
    '    float wy = mod(aPos.y + uTime * 0.014 * (0.4 + aSeed) + 1.0, 2.0) - 1.0;\n' +
    '    vec2 d = vec2((wx - uPtr.x) * uAspect, wy - uPtr.y);\n' +
    '    float dist = length(d);\n' +
    '    float push = uPtr.z * smoothstep(0.32, 0.0, dist) * 0.06;\n' +
    '    wx += (dist > 0.001 ? d.x / dist : 0.0) * push;\n' +
    '    wy += (dist > 0.001 ? d.y / dist : 0.0) * push;\n' +
    '    gl_Position = vec4(wx, wy, 0.5 + aPos.z * 0.25, 1.0);\n' +
    '    gl_PointSize = (1.4 + aSeed * 1.8) * uDpr;\n' +
    '    vCol = aCol;\n' +
    '    vWall = 1.0;\n' +
    '    return;\n' +
    '  }\n' +
    '  vec3 p = aPos;\n' +
    '  float ease = 1.0 - pow(1.0 - uAssemble, 3.0);\n' +
    '  float scatter = (1.0 - ease) * (1.1 + aSeed * 1.4);\n' +
    '  float ang = aSeed * 6.28318 + (1.0 - ease) * 3.2;\n' +
    '  p.x += cos(ang) * scatter * 0.55;\n' +
    '  p.y += sin(ang) * scatter * 0.42;\n' +
    '  p.z += (aSeed - 0.5) * (scatter + uEnergy * 0.24);\n' +
    '  // Subtle cohesive breathing only when particles are full-frame (zero drift under photo)\n' +
    '  float fullCloud = 1.0 - uHoverClip.w;\n' +
    '  p.y += sin(uTime * 1.25 + p.x * 1.8) * 0.0022 * fullCloud;\n' +
    '  p.z += cos(uTime * 0.95 + p.y * 1.6) * 0.003 * fullCloud;\n' +
    '  // Natural 3D Y-axis rotation\n' +
    '  vec3 r;\n' +
    '  r.x = p.x * uRot.x + p.z * uRot.y;\n' +
    '  r.y = p.y;\n' +
    '  r.z = -p.x * uRot.y + p.z * uRot.x;\n' +
    '  float persp = 1.0 / (1.0 - r.z * 0.16 * fullCloud);\n' +
    '  vec2 ndc;\n' +
    '  ndc.x = uSlot.x + (r.x / uDataAspect) * uSlot.z * persp;\n' +
    '  ndc.y = uSlot.y + r.y * uSlot.w * persp;\n' +
    '  // Zero-ghosting clip: when Retina photo is visible, ONLY draw particles inside the cursor window\n' +
    '  vec2 dClip = vec2((ndc.x - uHoverClip.x) * uAspect, ndc.y - uHoverClip.y);\n' +
    '  float distClip = length(dClip);\n' +
    '  float insideWindow = uHoverClip.z > 0.001 ? smoothstep(uHoverClip.z + 0.10, uHoverClip.z * 0.72, distClip) : 0.0;\n' +
    '  float clipAlpha = mix(1.0, insideWindow, uHoverClip.w);\n' +
    '  // Cursor parting + signal-emerald rim boost\n' +
    '  vec2 dPtr = vec2((ndc.x - uPtr.x) * uAspect, ndc.y - uPtr.y);\n' +
    '  float distPtr = length(dPtr);\n' +
    '  float part = uPtr.z * smoothstep(0.22, 0.0, distPtr);\n' +
    '  vec2 dirPtr = distPtr > 0.0005 ? dPtr / distPtr : vec2(0.0, 1.0);\n' +
    '  ndc += dirPtr * part * (0.042 + aSeed * 0.028);\n' +
    '  // Click shockwave ripple\n' +
    '  vec2 dRip = vec2((ndc.x - uRip.x) * uAspect, ndc.y - uRip.y);\n' +
    '  float distRip = length(dRip);\n' +
    '  float waveR = uRip.z * 0.95;\n' +
    '  float rip = exp(-pow((distRip - waveR) * 14.0, 2.0)) * exp(-uRip.z * 2.1);\n' +
    '  ndc += (distRip > 0.001 ? dRip / distRip : vec2(0.0)) * rip * 0.028;\n' +
    '  gl_Position = vec4(ndc, clamp(0.2 - r.z * 0.4, -0.95, 0.95), 1.0);\n' +
    '  float disturb = clamp(part + rip + (1.0 - ease) + uEnergy * 0.5, 0.0, 1.0);\n' +
    '  float ptSize = uCellPx * mix(1.52, 1.05, disturb) + rip * 1.4 * uDpr;\n' +
    '  gl_PointSize = max(1.6 * uDpr, ptSize);\n' +
    '  // Thriller/Halloween eerie emerald lighting during 0..4s intro flicker, full color at uLight=1\n' +
    '  float rimFactor = clamp(1.0 - abs(aPos.z) * 7.5, 0.0, 1.0);\n' +
    '  vec3 eerieShade = aCol.rgb * uLight + vec3(0.04, 0.42, 0.28) * (1.0 - min(1.0, uLight)) * rimFactor * 0.35;\n' +
    '  vec3 tint = mix(eerieShade, vec3(0.20, 0.85, 0.60), part * 0.58 + rip * 0.42);\n' +
    '  vCol = vec4(tint, aCol.a * uFade * clipAlpha * (0.92 + 0.08 * ease));\n' +
    '  vWall = 0.0;\n' +
    '}\n';

  var FS = '#version 300 es\n' +
    'precision mediump float;\n' +
    'in vec4 vCol;\n' +
    'in float vWall;\n' +
    'out vec4 fragColor;\n' +
    'void main() {\n' +
    '  if (vCol.a <= 0.003) discard;\n' +
    '  vec2 c = gl_PointCoord - 0.5;\n' +
    '  float r2 = dot(c, c);\n' +
    '  if (r2 > 0.25) discard;\n' +
    '  float soft = smoothstep(0.25, vWall > 0.5 ? 0.04 : 0.06, r2);\n' +
    '  float a = vCol.a * soft;\n' +
    '  fragColor = vec4(vCol.rgb * a, a);\n' +
    '}\n';

  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) return null;
    return s;
  }

  var vs = compile(gl.VERTEX_SHADER, VS);
  var fs = compile(gl.FRAGMENT_SHADER, FS);
  if (!vs || !fs) { initCanvas2DFallback(); return; }

  var prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { initCanvas2DFallback(); return; }

  gl.useProgram(prog);

  var isWall = new Float32Array(totalCount);
  isWall.fill(0, 0, portraitCount);
  isWall.fill(1, portraitCount);

  var vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  function bindAttr(name, arr, size) {
    var loc = gl.getAttribLocation(prog, name);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
  }

  bindAttr('aPos', positions, 3);
  bindAttr('aCol', colors, 4);
  bindAttr('aSeed', seeds, 1);
  bindAttr('aIsWall', isWall, 1);

  var uSlot = gl.getUniformLocation(prog, 'uSlot');
  var uRot = gl.getUniformLocation(prog, 'uRot');
  var uPtr = gl.getUniformLocation(prog, 'uPtr');
  var uRip = gl.getUniformLocation(prog, 'uRip');
  var uHoverClip = gl.getUniformLocation(prog, 'uHoverClip');
  var uTime = gl.getUniformLocation(prog, 'uTime');
  var uAssemble = gl.getUniformLocation(prog, 'uAssemble');
  var uEnergy = gl.getUniformLocation(prog, 'uEnergy');
  var uAspect = gl.getUniformLocation(prog, 'uAspect');
  var uDataAspect = gl.getUniformLocation(prog, 'uDataAspect');
  var uCellPx = gl.getUniformLocation(prog, 'uCellPx');
  var uDpr = gl.getUniformLocation(prog, 'uDpr');
  var uFade = gl.getUniformLocation(prog, 'uFade');
  var uLight = gl.getUniformLocation(prog, 'uLight');

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  root.classList.add('is-3d');
  applyModeClasses();

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    var cRect = canvas.getBoundingClientRect();
    var cw = cRect.width || document.documentElement.clientWidth || window.innerWidth;
    var ch = cRect.height || window.innerHeight;
    canvas.width = Math.max(1, Math.round(cw * dpr));
    canvas.height = Math.max(1, Math.round(ch * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  window.addEventListener('resize', resize);

  var prevT = performance.now();
  function frame(now) {
    var dt = Math.min(0.05, (now - prevT) / 1000);
    prevT = now;

    if (!state.paused) {
      state.introT = Math.min(10, state.introT + dt);
      state.assemble = Math.min(1, state.introT / 1.25);
      state.light = computeIntroLight(state.introT);
      state.ripT = Math.min(10, state.ripT + dt * 1.15);

      var scrollDelta = Math.abs(window.scrollY - state.lastScroll);
      state.lastScroll = window.scrollY;
      state.scrollEnergy = Math.max(state.scrollEnergy * 0.9, Math.min(1.0, scrollDelta * 0.012));

      if (!state.dragging) {
        state.userRot *= Math.pow(0.18, dt);
      }
      var scrollRot = Math.sin(window.scrollY * 0.0018) * 0.14;
      // Only tilt via scroll/drag when photo is dissolved so zero offset occurs under resting photo
      var rotBlend = 1.0 - state.photoAlpha;
      state.rotY = (scrollRot + state.userRot) * rotBlend + state.userRot * state.photoAlpha;
    }

    var cRect = canvas.getBoundingClientRect();
    var vw = cRect.width || 1;
    var vh = cRect.height || 1;
    // Keep canvas buffer synced if scrollbar state changes
    var expectedW = Math.max(1, Math.round(vw * dpr));
    if (Math.abs(canvas.width - expectedW) > 2) resize();

    var slotRect = slot.getBoundingClientRect();
    var imgBox = getExactImageBox(slotRect);

    // 0.0px-aligned NDC mapping matching the exact rendered photo box
    var cx = ((imgBox.left + imgBox.width * 0.5 - cRect.left) / vw) * 2 - 1;
    var cy = 1 - ((imgBox.top + imgBox.height * 0.5 - cRect.top) / vh) * 2;
    var hw = imgBox.width / vw;
    var hh = imgBox.height / vh;
    var cellPx = (imgBox.height / (data.rows || 335)) * dpr;

    // Update dramatic flicker spotlight aura during 1.25s..4.2s intro
    if (flickerGlowEl) {
      var glowAlpha = state.introT < 4.35
        ? Math.max(0, (state.light - 0.12) * 0.95)
        : 0.18;
      flickerGlowEl.style.setProperty('--flicker-glow', glowAlpha.toFixed(3));
    }

    var maskX_ndc = -9;
    var maskY_ndc = -9;
    var maskR_ndc = 0;

    if (photoEl && state.mode === 'dots') {
      // Keep pure 3D particle cloud during 0..3.85s arrival + light flicker, click ripples, drag, or rapid scroll
      var isIntro = state.introT < 3.85;
      var isDisturbed = isIntro || state.dragging || state.ripT < 1.35 || state.scrollEnergy > 0.14 || Math.abs(state.userRot) > 0.04;
      var targetAlpha = isDisturbed ? 0 : 1;
      state.photoAlpha += (targetAlpha - state.photoAlpha) * Math.min(1, dt * 8.5);
      photoEl.style.setProperty('--photo-alpha', state.photoAlpha.toFixed(3));
      photoEl.style.setProperty('--photo-bright', Math.max(0.08, Math.min(1.12, state.light)).toFixed(3));

      var relX = state.ptrClientX - slotRect.left;
      var relY = state.ptrClientY - slotRect.top;
      var overImg = state.ptrActive > 0 && state.introT >= 3.85 &&
        state.ptrClientX > imgBox.left - 40 && state.ptrClientX < imgBox.left + imgBox.width + 40 &&
        state.ptrClientY > imgBox.top - 40 && state.ptrClientY < imgBox.top + imgBox.height + 40;
      var targetR = overImg ? 64 : 0;
      state.maskR += (targetR - state.maskR) * Math.min(1, dt * 11.0);

      if (state.maskR > 0.5) {
        photoEl.style.setProperty('--mask-x', relX.toFixed(1) + 'px');
        photoEl.style.setProperty('--mask-y', relY.toFixed(1) + 'px');
        photoEl.style.setProperty('--mask-r', state.maskR.toFixed(1) + 'px');
        maskX_ndc = ((state.ptrClientX - cRect.left) / vw) * 2 - 1;
        maskY_ndc = 1 - ((state.ptrClientY - cRect.top) / vh) * 2;
        maskR_ndc = ((state.maskR + 48) / vh) * 2;
      } else {
        photoEl.style.setProperty('--mask-x', '-300px');
        photoEl.style.setProperty('--mask-y', '-300px');
        photoEl.style.setProperty('--mask-r', '0px');
      }
    }

    var onScreen = slotRect.bottom > -80 && slotRect.top < vh + 80;
    var needParticles = Math.min(1.0, Math.max(1.0 - state.photoAlpha, state.maskR / 24.0));
    var portraitFade = state.mode === 'dots' && onScreen ? needParticles : 0.0;

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(prog);
    gl.bindVertexArray(vao);

    gl.uniform4f(uSlot, cx, cy, hw, hh);
    gl.uniform2f(uRot, Math.cos(state.rotY), Math.sin(state.rotY));
    gl.uniform3f(uPtr, state.ptrX, state.ptrY, state.ptrActive);
    gl.uniform3f(uRip, state.ripX, state.ripY, state.ripT);
    gl.uniform4f(uHoverClip, maskX_ndc, maskY_ndc, maskR_ndc, state.photoAlpha);
    gl.uniform1f(uTime, now * 0.001);
    gl.uniform1f(uAssemble, state.assemble);
    gl.uniform1f(uEnergy, state.scrollEnergy);
    gl.uniform1f(uAspect, vw / vh);
    gl.uniform1f(uDataAspect, IMG_ASPECT);
    gl.uniform1f(uCellPx, cellPx);
    gl.uniform1f(uDpr, dpr);
    gl.uniform1f(uFade, portraitFade);
    gl.uniform1f(uLight, state.light);

    gl.drawArrays(gl.POINTS, 0, totalCount);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* Canvas2D fallback if WebGL2 fails */
  function initCanvas2DFallback() {
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    root.classList.add('is-3d');
    applyModeClasses();

    function resize2D() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      var cRect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round((cRect.width || window.innerWidth) * dpr));
      canvas.height = Math.max(1, Math.round((cRect.height || window.innerHeight) * dpr));
    }
    resize2D();
    window.addEventListener('resize', resize2D);

    var prev2D = performance.now();
    function draw2D(now) {
      var dt = Math.min(0.05, (now - prev2D) / 1000);
      prev2D = now;
      var w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      var t = now * 0.001;
      if (!state.paused) {
        state.introT = Math.min(10, state.introT + dt);
        state.light = computeIntroLight(state.introT);
      }
      if (photoEl && state.mode === 'dots') {
        photoEl.style.setProperty('--photo-alpha', '1');
        photoEl.style.setProperty('--photo-bright', Math.max(0.08, Math.min(1.12, state.light)).toFixed(3));
      }
      for (var j = portraitCount; j < totalCount; j += 3) {
        var wx = ((positions[j * 3] + 1) * 0.5) * w;
        var wy = (((positions[j * 3 + 1] + t * 0.015 + 1) % 2 + 2) % 2) * 0.5 * h;
        ctx.fillStyle = 'rgba(16, 185, 129, 0.28)';
        ctx.fillRect(wx, wy, 2 * dpr, 2 * dpr);
      }
      requestAnimationFrame(draw2D);
    }
    requestAnimationFrame(draw2D);
  }
})();
