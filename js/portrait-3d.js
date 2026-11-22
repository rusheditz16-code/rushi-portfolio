/* ==========================================================================
   3D Particle Portrait + Ambient Field (WebGL2 with seamless Canvas2D fallback)
   Renders ~28,000 colored surface particles from Rushi's cutout portrait plus
   ~2,200 ambient obsidian-amber particles across the viewport.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var canvas = document.getElementById('portrait-canvas');
  var slot = document.querySelector('[data-portrait-slot]');
  var modeBtns = Array.prototype.slice.call(document.querySelectorAll('[data-portrait-mode]'));
  var pauseBtn = document.querySelector('[data-portrait-pause]');
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

  var state = {
    mode: reduced ? 'photo' : 'dots', // 'dots' | 'photo'
    paused: reduced,
    rotY: 0,
    userRot: 0,
    velRot: 0,
    dragging: false,
    dragStartX: 0,
    dragStartRot: 0,
    ptrX: -9,
    ptrY: -9,
    ptrActive: 0,
    ripX: 0,
    ripY: 0,
    ripT: 10,
    assemble: reduced ? 1 : 0,
    scrollEnergy: 0,
    lastScroll: window.scrollY
  };

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

  /* Pointer & Drag Orbit on Portrait Slot + Viewport Repulsion */
  window.addEventListener('pointermove', function (e) {
    state.ptrX = (e.clientX / window.innerWidth) * 2 - 1;
    state.ptrY = 1 - (e.clientY / window.innerHeight) * 2;
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
    state.ripX = (e.clientX / window.innerWidth) * 2 - 1;
    state.ripY = 1 - (e.clientY / window.innerHeight) * 2;
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
    state.ripX = (e.clientX / window.innerWidth) * 2 - 1;
    state.ripY = 1 - (e.clientY / window.innerHeight) * 2;
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
    // Subtle mix of carbon dust and signal-emerald motes
    var isAccent = (w % 7 === 0);
    colors[idx * 4] = isAccent ? 0.06 : 0.62;
    colors[idx * 4 + 1] = isAccent ? 0.73 : 0.78;
    colors[idx * 4 + 2] = isAccent ? 0.51 : 0.71;
    colors[idx * 4 + 3] = isAccent ? 0.45 : 0.15;
    seeds[idx] = (w * 0.6180339887) % 1;
  }

  var gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false });

  if (!gl) {
    // Graceful Canvas2D particle fallback if WebGL2 is disabled
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
    'uniform float uTime, uAssemble, uEnergy, uAspect, uDataAspect, uDpr, uFade;\n' +
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
    '    gl_PointSize = (1.4 + aSeed * 1.9) * uDpr;\n' +
    '    vCol = aCol;\n' +
    '    vWall = 1.0;\n' +
    '    return;\n' +
    '  }\n' +
    '  vec3 p = aPos;\n' +
    '  float ease = 1.0 - pow(1.0 - uAssemble, 3.0);\n' +
    '  float scatter = (1.0 - ease) * (1.2 + aSeed * 1.5);\n' +
    '  float ang = aSeed * 6.28318 + (1.0 - ease) * 3.5;\n' +
    '  p.x += cos(ang) * scatter * 0.6;\n' +
    '  p.y += sin(ang) * scatter * 0.45;\n' +
    '  p.z += (aSeed - 0.5) * (scatter + uEnergy * 0.35);\n' +
    '  // Breathing & micro-float\n' +
    '  p.y += sin(uTime * 1.4 + p.x * 3.0 + aSeed * 6.0) * 0.005;\n' +
    '  p.z += cos(uTime * 1.1 + aSeed * 9.0) * 0.008;\n' +
    '  // 3D Y-axis rotation\n' +
    '  vec3 r;\n' +
    '  r.x = p.x * uRot.x + p.z * uRot.y;\n' +
    '  r.y = p.y;\n' +
    '  r.z = -p.x * uRot.y + p.z * uRot.x;\n' +
    '  // Perspective divide\n' +
    '  float persp = 1.0 / (1.0 - r.z * 0.38);\n' +
    '  vec2 ndc;\n' +
    '  ndc.x = uSlot.x + (r.x / uDataAspect) * uSlot.z * persp;\n' +
    '  ndc.y = uSlot.y + r.y * uSlot.w * persp;\n' +
    '  // Cursor parting + signal-emerald rim boost\n' +
    '  vec2 dPtr = vec2((ndc.x - uPtr.x) * uAspect, ndc.y - uPtr.y);\n' +
    '  float distPtr = length(dPtr);\n' +
    '  float part = uPtr.z * smoothstep(0.24, 0.0, distPtr);\n' +
    '  vec2 dirPtr = distPtr > 0.0005 ? dPtr / distPtr : vec2(0.0, 1.0);\n' +
    '  ndc += dirPtr * part * (0.045 + aSeed * 0.03);\n' +
    '  // Click shockwave ripple\n' +
    '  vec2 dRip = vec2((ndc.x - uRip.x) * uAspect, ndc.y - uRip.y);\n' +
    '  float distRip = length(dRip);\n' +
    '  float waveR = uRip.z * 0.95;\n' +
    '  float rip = exp(-pow((distRip - waveR) * 14.0, 2.0)) * exp(-uRip.z * 2.1);\n' +
    '  ndc += (distRip > 0.001 ? dRip / distRip : vec2(0.0)) * rip * 0.03;\n' +
    '  gl_Position = vec4(ndc, clamp(0.2 - r.z * 0.4, -0.95, 0.95), 1.0);\n' +
    '  float basePt = max(1.65, min(3.4, uSlot.w * 280.0 / 120.0));\n' +
    '  gl_PointSize = (basePt + persp * 0.45 + rip * 1.8) * uDpr;\n' +
    '  vec3 tint = mix(aCol.rgb, vec3(0.20, 0.85, 0.60), part * 0.58 + rip * 0.45);\n' +
    '  vCol = vec4(tint, aCol.a * uFade * (0.85 + 0.15 * ease));\n' +
    '  vWall = 0.0;\n' +
    '}\n';

  var FS = '#version 300 es\n' +
    'precision mediump float;\n' +
    'in vec4 vCol;\n' +
    'in float vWall;\n' +
    'out vec4 fragColor;\n' +
    'void main() {\n' +
    '  vec2 c = gl_PointCoord - 0.5;\n' +
    '  float r2 = dot(c, c);\n' +
    '  if (r2 > 0.25) discard;\n' +
    '  float soft = smoothstep(0.25, vWall > 0.5 ? 0.04 : 0.09, r2);\n' +
    '  float a = vCol.a * soft;\n' +
    '  fragColor = vec4(vCol.rgb * a, a);\n' +
    '}\n';

  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      return null;
    }
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
  var uTime = gl.getUniformLocation(prog, 'uTime');
  var uAssemble = gl.getUniformLocation(prog, 'uAssemble');
  var uEnergy = gl.getUniformLocation(prog, 'uEnergy');
  var uAspect = gl.getUniformLocation(prog, 'uAspect');
  var uDataAspect = gl.getUniformLocation(prog, 'uDataAspect');
  var uDpr = gl.getUniformLocation(prog, 'uDpr');
  var uFade = gl.getUniformLocation(prog, 'uFade');

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  root.classList.add('is-3d');
  applyModeClasses();

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(window.innerWidth * dpr));
    canvas.height = Math.max(1, Math.floor(window.innerHeight * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  window.addEventListener('resize', resize);

  var prevT = performance.now();
  function frame(now) {
    var dt = Math.min(0.05, (now - prevT) / 1000);
    prevT = now;

    if (!state.paused) {
      state.assemble = Math.min(1, state.assemble + dt * 0.72);
      state.ripT = Math.min(10, state.ripT + dt * 1.15);

      var scrollDelta = Math.abs(window.scrollY - state.lastScroll);
      state.lastScroll = window.scrollY;
      state.scrollEnergy = Math.max(state.scrollEnergy * 0.9, Math.min(1.0, scrollDelta * 0.012));

      if (!state.dragging) {
        state.userRot *= Math.pow(0.18, dt);
      }
      var scrollRot = Math.sin(window.scrollY * 0.0018) * 0.24;
      var hoverRot = state.ptrActive * state.ptrX * 0.09;
      state.rotY = scrollRot + state.userRot + hoverRot;
    }

    var rect = slot.getBoundingClientRect();
    var vw = window.innerWidth || 1;
    var vh = window.innerHeight || 1;

    // Position in NDC relative to slot element so portrait tracks scroll accurately
    var cx = ((rect.left + rect.width * 0.5) / vw) * 2 - 1;
    var cy = 1 - ((rect.top + rect.height * 0.5) / vh) * 2;
    var hw = rect.width / vw;
    var hh = rect.height / vh;

    // Fade portrait particles smoothly as hero scrolls out, while keeping ambient wall active
    var onScreen = rect.bottom > -80 && rect.top < vh + 80;
    var portraitFade = state.mode === 'dots' && onScreen ? 1.0 : 0.0;

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(prog);
    gl.bindVertexArray(vao);

    gl.uniform4f(uSlot, cx, cy, hw, hh);
    gl.uniform2f(uRot, Math.cos(state.rotY), Math.sin(state.rotY));
    gl.uniform3f(uPtr, state.ptrX, state.ptrY, state.ptrActive);
    gl.uniform3f(uRip, state.ripX, state.ripY, state.ripT);
    gl.uniform1f(uTime, now * 0.001);
    gl.uniform1f(uAssemble, state.assemble);
    gl.uniform1f(uEnergy, state.scrollEnergy);
    gl.uniform1f(uAspect, vw / vh);
    gl.uniform1f(uDataAspect, data.aspect || 1.034);
    gl.uniform1f(uDpr, dpr);
    gl.uniform1f(uFade, portraitFade);

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
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
    }
    resize2D();
    window.addEventListener('resize', resize2D);

    var step = Math.max(1, Math.floor(portraitCount / 7500));
    function draw2D(now) {
      var w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      var rect = slot.getBoundingClientRect();
      var t = now * 0.001;
      if (!state.paused) {
        state.assemble = Math.min(1, state.assemble + 0.02);
        state.rotY = Math.sin(window.scrollY * 0.0018) * 0.2 + state.userRot;
      }

      // Draw wall motes
      for (var j = portraitCount; j < totalCount; j += 3) {
        var wx = ((positions[j * 3] + 1) * 0.5) * w;
        var wy = (((positions[j * 3 + 1] + t * 0.015 + 1) % 2 + 2) % 2) * 0.5 * h;
        ctx.fillStyle = 'rgba(16, 185, 129, 0.28)';
        ctx.fillRect(wx, wy, 2 * dpr, 2 * dpr);
      }

      if (state.mode === 'dots' && rect.bottom > -50 && rect.top < window.innerHeight + 50) {
        var cx = (rect.left + rect.width * 0.5) * dpr;
        var cy = (rect.top + rect.height * 0.5) * dpr;
        var sw = (rect.width * 0.5 / (data.aspect || 1.034)) * dpr;
        var sh = rect.height * 0.5 * dpr;
        var cosR = Math.cos(state.rotY), sinR = Math.sin(state.rotY);

        for (var k = 0; k < portraitCount; k += step) {
          var px = positions[k * 3], py = positions[k * 3 + 1], pz = positions[k * 3 + 2];
          var rx = px * cosR + pz * sinR;
          var sx = cx + rx * sw;
          var sy = cy - py * sh;
          var r = Math.round(colors[k * 4] * 255);
          var g = Math.round(colors[k * 4 + 1] * 255);
          var b = Math.round(colors[k * 4 + 2] * 255);
          ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + colors[k * 4 + 3].toFixed(2) + ')';
          ctx.fillRect(sx, sy, 2 * dpr, 2 * dpr);
        }
      }
      requestAnimationFrame(draw2D);
    }
    requestAnimationFrame(draw2D);
  }
})();
