/* ==========================================================================
   K.A.I.R.O.S. Signal Wave Canvas + Interactive Mini-Console
   Perspective 3D particle wave field in Carbon Noir & Signal Emerald, plus
   optional user-triggered Web Audio harmonic pulse & portfolio CLI queries.
   Viewport-gated via IntersectionObserver so zero CPU runs while offscreen.
   ========================================================================== */
(function () {
  'use strict';

  var stage = document.querySelector('[data-kairos-stage]');
  if (!stage) return;

  var canvas = stage.querySelector('.wave-canvas');
  var ctx = canvas ? canvas.getContext('2d') : null;
  var output = stage.querySelector('[data-console-output]');
  var form = stage.querySelector('[data-console-form]');
  var input = stage.querySelector('[data-console-input]');
  var synthBtn = stage.querySelector('[data-synth-toggle]');
  var wavePauseBtn = stage.querySelector('[data-wave-pause]');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var state = {
    paused: reduced,
    inView: false,
    pulseEnergy: 0,
    audioOn: false
  };

  if (wavePauseBtn && state.paused) {
    wavePauseBtn.textContent = 'Resume Wave';
  }

  /* ---------- Optional Opt-In Web Audio Ambient Synth ---------- */
  var audioCtx = null;
  var oscA = null, oscB = null, filter = null, gain = null, analyser = null, freqData = null;

  function toggleAudio() {
    if (!audioCtx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      audioCtx = new AC();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      freqData = new Uint8Array(analyser.frequencyBinCount);

      filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 420;

      gain = audioCtx.createGain();
      gain.gain.value = 0;

      oscA = audioCtx.createOscillator();
      oscA.type = 'sawtooth';
      oscA.frequency.value = 55; // A1 warm drone

      oscB = audioCtx.createOscillator();
      oscB.type = 'triangle';
      oscB.frequency.value = 110.25; // slight detune harmonic

      oscA.connect(filter);
      oscB.connect(filter);
      filter.connect(gain);
      gain.connect(analyser);
      analyser.connect(audioCtx.destination);

      oscA.start();
      oscB.start();
    }

    if (audioCtx.state === 'suspended') audioCtx.resume();
    state.audioOn = !state.audioOn;
    var now = audioCtx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setTargetAtTime(state.audioOn ? 0.045 : 0, now, 0.12);

    if (synthBtn) {
      synthBtn.textContent = state.audioOn ? 'Audio Pulse: ON' : 'Audio Pulse: OFF';
      synthBtn.setAttribute('aria-pressed', String(state.audioOn));
    }
  }

  if (synthBtn) {
    synthBtn.addEventListener('click', toggleAudio);
  }

  if (wavePauseBtn) {
    wavePauseBtn.addEventListener('click', function () {
      state.paused = !state.paused;
      wavePauseBtn.textContent = state.paused ? 'Resume Wave' : 'Pause Wave';
      scheduleWave();
    });
  }

  /* ---------- Perspective 3D Dot Wave Field ---------- */
  var COLS = 52;
  var ROWS = 22;
  var waveRaf = 0;

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var rect = stage.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
  }

  function renderWave(now) {
    waveRaf = 0;
    if (!canvas || !ctx) return;
    var w = canvas.width;
    var h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    var t = now * 0.0011;
    if (!state.paused) {
      state.pulseEnergy *= 0.94;
    }

    var audioBoost = 0;
    if (state.audioOn && analyser && freqData) {
      analyser.getByteFrequencyData(freqData);
      filter.frequency.value = 340 + Math.sin(t * 0.9) * 160;
      var sum = 0;
      for (var f = 0; f < 10; f++) sum += freqData[f];
      audioBoost = (sum / 10) / 255;
    }

    var horizon = h * 0.24;
    var depthSpan = h * 0.72;
    var energy = 1 + state.pulseEnergy * 1.3 + audioBoost * 1.5;

    for (var r = ROWS - 1; r >= 0; r--) {
      var depth = r / (ROWS - 1); // 0 = front, 1 = far
      var persp = 1.0 - depth * 0.62;
      var rowY = horizon + (1 - depth) * depthSpan;
      var rowWidth = w * (0.45 + (1 - depth) * 0.78);
      var startX = (w - rowWidth) * 0.5;

      for (var c = 0; c < COLS; c++) {
        var nx = c / (COLS - 1);
        var x = startX + nx * rowWidth;
        var wave = state.paused
          ? Math.sin(nx * 5.0 + depth * 3.0) * 14
          : (Math.sin(nx * 6.2 - t * 1.9 + depth * 4.2) * 18 +
             Math.cos(nx * 11.0 + t * 1.3 - depth * 5.5) * 9) * energy;

        var y = rowY + wave * persp;
        var radius = Math.max(1.0, (1.1 + (1 - depth) * 2.1) * (w / 1200));
        var alpha = (0.14 + (1 - depth) * 0.65) * (0.6 + 0.4 * Math.sin(nx * 3.14159));

        if ((c + r) % 9 === 0) {
          ctx.fillStyle = 'rgba(52, 211, 153, ' + (alpha * 0.95).toFixed(3) + ')';
        } else {
          ctx.fillStyle = 'rgba(16, 185, 129, ' + (alpha * 0.85).toFixed(3) + ')';
        }

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (!state.paused && state.inView && !document.hidden) {
      waveRaf = requestAnimationFrame(renderWave);
    }
  }

  function scheduleWave() {
    if (document.hidden) return;
    if (!waveRaf) {
      waveRaf = requestAnimationFrame(renderWave);
    }
  }

  resizeCanvas();
  window.addEventListener('resize', function () {
    resizeCanvas();
    scheduleWave();
  }, { passive: true });

  if ('IntersectionObserver' in window) {
    var waveObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        state.inView = entry.isIntersecting;
        if (state.inView) {
          resizeCanvas();
          scheduleWave();
        } else if (waveRaf) {
          cancelAnimationFrame(waveRaf);
          waveRaf = 0;
        }
      });
    }, { rootMargin: '120px 0px' });
    waveObserver.observe(stage);
  } else {
    state.inView = true;
    scheduleWave();
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden && waveRaf) {
      cancelAnimationFrame(waveRaf);
      waveRaf = 0;
    } else if (!document.hidden && state.inView) {
      scheduleWave();
    }
  });

  /* ---------- Interactive K.A.I.R.O.S. Console Responses ---------- */
  var COMMANDS = {
    help: 'Commands: whoami · stack · projects · certs · education · resume · contact · clear',
    whoami: 'Rushi (Dabhi Rushiraj Jayeshbhai), 1st-year B.Tech CSE (AI & ML) student at Gyanmanjari Innovative University, Bhavnagar. Building full-stack web apps, civic tools, and local AI software.',
    stack: 'Languages: Python, JS, TS, HTML/CSS | Frontend: React 19, Next.js, Vite, Tailwind | Backend & AI: FastAPI, WebSockets, ReAct Agents, Groq Whisper v3 Turbo, SQLite Vector RAG.',
    projects: '1. K.A.I.R.O.S. (Local Windows Voice Assistant) | 2. Botad Cyber Rakshak AI | 3. JanRaksha ID | 4. KhojSetu | 5. AyurSwift. Open any card above for the full case study.',
    certs: 'Oracle Agentic AI Certified (Valid 2028) · Deloitte Cyber Security Simulation · AWS Prompt Engineering · IBM AI Fundamentals · Google Cloud LLMs · ChaosCore Hackathon 2026.',
    education: 'B.Tech in Computer Science & Engineering (AI & ML), Gyanmanjari Innovative University, Bhavnagar (Class of 2030).',
    resume: 'Resume PDF available at assets/docs/Rushiraj_Dabhi_Resume.pdf (click Download Resume in the top bar or Hero).',
    contact: 'Email: rushirajdabhi16@gmail.com | GitHub: github.com/rusheditz16-code | LinkedIn: linkedin.com/in/rushiraj-dabhi-a2204242b | IG: @rusheditz16'
  };

  function printCommand(rawCmd) {
    if (!output) return;
    var cmd = (rawCmd || '').trim().toLowerCase();
    if (!cmd) return;

    state.pulseEnergy = 1.0;
    scheduleWave();

    if (cmd === 'clear') {
      output.innerHTML = '<div class="cmd-echo">&gt; Cleared. Type a command or click a button above.</div>';
      return;
    }

    var reply = COMMANDS[cmd];
    if (!reply) {
      if (cmd.indexOf('kairos') !== -1) {
        reply = 'K.A.I.R.O.S.: Local FastAPI + multiplexed WebSocket desktop assistant with Groq Whisper speech transcription (~150ms), 24/7 wake word, complexity router with circuit breakers, and 3-tier SQLite memory.';
      } else if (cmd.indexOf('hello') !== -1 || cmd.indexOf('hi') !== -1) {
        reply = 'Hey! Try whoami, stack, projects, certs, resume, or contact.';
      } else {
        reply = 'Unknown command "' + cmd.replace(/[<>&]/g, '') + '". Try: whoami, stack, projects, certs, education, resume, contact, or help.';
      }
    }

    var row = document.createElement('div');
    var echo = document.createElement('span');
    echo.className = 'cmd-echo';
    echo.textContent = '$ ' + cmd + '  ';
    var msg = document.createElement('span');
    msg.textContent = reply;
    row.appendChild(echo);
    row.appendChild(msg);
    output.appendChild(row);
    output.scrollTop = output.scrollHeight;
  }

  stage.querySelectorAll('[data-cmd]').forEach(function (chip) {
    chip.addEventListener('click', function () {
      var cmd = chip.dataset.cmd;
      if (input) input.value = cmd;
      printCommand(cmd);
    });
  });

  if (form && input) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      printCommand(input.value);
      input.value = '';
    });
  }
})();
