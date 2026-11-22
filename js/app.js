/* ==========================================================================
   Main Portfolio Controller:
   - Curated Projects & Certifications data + Filter Pills
   - Filmstrip Pause/Play toggle (WCAG 2.2.2)
   - Native Top-Layer <dialog> with light-dismiss & exit animation fallbacks
   - Accessible Contact Form (:user-invalid fallback, aria-invalid, live region)
   - Mobile Navigation Drawer & Sticky Topbar scroll state
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Project & Certificate Data Registries ---------- */
  var PROJECTS = {
    kairos: {
      kicker: 'Flagship Autonomous Desktop AI OS',
      title: 'K.A.I.R.O.S.',
      subtitle: 'Kinetic Artificial Intelligence Responsive Operating System',
      image: 'assets/projects/kairos-hud.png',
      alt: 'K.A.I.R.O.S. Stark-style holographic desktop HUD showing CPU/RAM telemetry gauges, Arc Reactor audio visualizer, and live chat stream',
      meta: [
        { label: 'Architecture', value: 'FastAPI + WebSockets + React 19' },
        { label: 'Voice Engine', value: 'Groq Whisper Large v3 Turbo (~150ms)' },
        { label: 'Memory', value: '3-Tier Semantic Cache + SQLite Vector RAG' },
        { label: 'Routing', value: 'HeteroRoute Multi-Model + Circuit Breaker' }
      ],
      summary: 'Engineered a full-duplex desktop AI operating system built for Windows 11/10 with hardware-level always-on wake word ("Hey Kairos"), global hotkey Ctrl+Alt+K, PyWebView HUD, and local system automation.',
      highlights: [
        'Multi-tier cognitive engine combining HeteroRoute complexity scoring and automatic failover across LLM backends.',
        '24/7 microphone bridge using sounddevice + NumPy bypassing browser audio limitations.',
        'Interactive Arc Reactor audio visualizer, live CPU/RAM/Battery/Disk telemetry gauges, and Node Memory Graph.',
        'Decorator-based sandboxed tool registry (@kairos_tool) supporting PowerShell, Python, Java runtime execution, and Cloudflare Tunnel remote mobile pairing.'
      ],
      links: [
        { label: 'View GitHub Profile ↗', href: 'https://github.com/rusheditz16-code', primary: true }
      ]
    },
    'cyber-rakshak': {
      kicker: 'Civic-Tech · District Governance (DDO Botad)',
      title: 'Botad Cyber Rakshak AI',
      subtitle: 'બોટાદ સાયબર રક્ષક — Bilingual Rural Cyber Safety Assistant',
      image: 'assets/projects/cyber-rakshak.png',
      alt: 'Botad Cyber Rakshak AI live web interface in English and Gujarati showing voice scam check and 1930 Golden Hour emergency helpline',
      meta: [
        { label: 'Deployment', value: 'cyber-rakshak-ai-nine.vercel.app' },
        { label: 'Languages', value: 'Gujarati & English (Bilingual)' },
        { label: 'Focus', value: 'Cyber Fraud Prevention & 1930 SOS' },
        { label: 'Stack', value: 'React, Vite, Tailwind, Prompt Workflows' }
      ],
      summary: 'Localized AI-powered cybersecurity awareness and citizen assistance platform crafted for rural and district citizens under the DDO Botad public governance initiative.',
      highlights: [
        'Voice-first and text scam verification workflow guiding citizens in native Gujarati on suspicious calls, UPI traps, and KYC fraud.',
        'Direct Golden Hour emergency escalation guiding users to dial 1930 immediately during active financial fraud.',
        'Structured awareness modules and interactive DDO operations readiness.'
      ],
      links: [
        { label: 'Open Live Site ↗', href: 'https://cyber-rakshak-ai-nine.vercel.app', primary: true },
        { label: 'GitHub Repo ↗', href: 'https://github.com/rusheditz16-code/cyber-rakshak-ai-4', primary: false }
      ]
    },
    janraksha: {
      kicker: 'Humanitarian Crisis & Public Safety',
      title: 'JanRaksha ID',
      subtitle: 'Emergency Identity Verification & Family Reunification',
      image: 'assets/projects/janraksha.png',
      alt: 'JanRaksha ID live interface displaying emergency reunification hero metrics and sample medical QR identity card',
      meta: [
        { label: 'Deployment', value: 'janraksha-id-demo.vercel.app' },
        { label: 'Standards', value: 'Privacy-Safe Opaque QR/NFC Tokens' },
        { label: 'Workflows', value: 'Volunteer Scanner + Incident Ops' },
        { label: 'Stack', value: 'Next.js, TypeScript, Responsive UI' }
      ],
      summary: 'Rapid-response emergency identity and family reunification platform enabling displaced individuals and responders to verify identity, medical alerts, and family links during disasters.',
      highlights: [
        'Opaque QR/NFC lookup tokens protect private citizen data while surfacing critical emergency medical allergies and notes.',
        'Dedicated Volunteer Scanner, Person Registration, and Operations Command views optimized for mobile responders.',
        'High-contrast accessibility toggle and multi-language readiness for field deployment.'
      ],
      links: [
        { label: 'Open Live Site ↗', href: 'https://janraksha-id-demo.vercel.app', primary: true }
      ]
    },
    khojsetu: {
      kicker: 'AI Campus Utility & Match Engine',
      title: 'KhojSetu',
      subtitle: 'AI-Assisted Campus Lost & Found Bridge',
      image: 'assets/projects/khojsetu.png',
      alt: 'KhojSetu live campus lost and found platform showing search gateway, approximate campus zones, and top overlap listing',
      meta: [
        { label: 'Deployment', value: 'khojsetu-pied.vercel.app' },
        { label: 'Core Engine', value: 'Explainable Factor Match Scoring' },
        { label: 'Trust Layer', value: 'Role-Gated Private Ownership Claims' },
        { label: 'Stack', value: 'Next.js, TypeScript, Tailwind CSS' }
      ],
      summary: 'Community-driven campus lost-and-found bridge connecting students and staff through explainable multi-factor matching and privacy-preserving ownership verification.',
      highlights: [
        'Matches lost and found reports via category, keyword, approximate campus zone, and timestamp signals.',
        'Role-gated claim review prevents fraudulent claims while keeping personal student dossier records private.',
        'Clean editorial registry layout with fast cross-device filtering and archive tracking.'
      ],
      links: [
        { label: 'Open Live Site ↗', href: 'https://khojsetu-pied.vercel.app/', primary: true },
        { label: 'GitHub Repo ↗', href: 'https://github.com/rusheditz16-code/KhojSetu', primary: false }
      ]
    },
    ayurswift: {
      kicker: 'HealthTech E-Commerce & Logistics',
      title: 'AyurSwift',
      subtitle: 'Authentic Ayurvedic & OTC Pharmacy — Scheduled Slot Delivery',
      image: 'assets/projects/ayurswift.png',
      alt: 'AyurSwift live store interface showcasing Bhavnagar 4 daily delivery slots and Ayurvedic product spotlight',
      meta: [
        { label: 'Deployment', value: 'ayurswift.vercel.app' },
        { label: 'City Logistics', value: '4 Scheduled Bhavnagar Daily Slots' },
        { label: 'National Reach', value: '2–4 Day All-India Tracked Courier' },
        { label: 'Stack', value: 'Next.js, TypeScript, Tailwind CSS' }
      ],
      summary: 'Full-stack Ayurvedic and OTC wellness storefront designed for real-world local pharmacy dispatch in Bhavnagar alongside nationwide courier fulfillment.',
      highlights: [
        'Structured time-slot selector (9–10 AM, 10–11 AM, 6–7 PM, 7–8 PM) built for local Bhavnagar PIN code 364001 operations.',
        'Category-driven wellness discovery, brand filtering, quick WhatsApp list ordering, and direct UPI checkout flow.',
        'Responsive storefront tuned for fast mobile browsing and crisp typographic hierarchy.'
      ],
      links: [
        { label: 'Open Live Site ↗', href: 'https://ayurswift.vercel.app', primary: true },
        { label: 'GitHub Repo ↗', href: 'https://github.com/rusheditz16-code/AyurSwift', primary: false }
      ]
    }
  };

  var CERTS = {
    oracle: {
      kicker: 'Official Industry Certification',
      title: 'Oracle Agentic AI Certified Foundations Associate',
      image: '',
      meta: [
        { label: 'Issuer', value: 'Oracle University' },
        { label: 'Issued / Valid', value: 'Oct 27, 2026 — Oct 27, 2028' },
        { label: 'Certificate ID', value: '103568242AAI26OFA' },
        { label: 'Focus', value: 'Autonomous Agents, Tool Use & Orchestration' }
      ],
      summary: 'Recognized by Oracle Corporation for foundational mastery in Agentic AI architectures, multi-step reasoning loops, tool orchestration, and enterprise AI workflows.',
      highlights: [
        'Validates practical knowledge behind systems like K.A.I.R.O.S. multi-step tool-calling agents.',
        'Signed eCertificate archived locally with verifiable Oracle credential ID.'
      ],
      links: [
        { label: 'Open Certificate PDF ↗', href: 'assets/certs/oracle-agentic-ai.pdf', primary: true }
      ]
    },
    deloitte: {
      kicker: 'Virtual Industry Job Simulation',
      title: 'Deloitte — Cyber Security Job Simulation',
      image: '',
      meta: [
        { label: 'Issuer', value: 'Deloitte (via Forage)' },
        { label: 'Completed', value: 'August 24, 2026' },
        { label: 'Enrolment Code', value: '6a8c0d83e62e344f1f47d849' },
        { label: 'User Code', value: '6a8c0b008f5fb1ac612b2638' }
      ],
      summary: 'Completed practical enterprise cybersecurity analysis, log/threat assessment, and incident security operations tasks modeled after Deloitte Cyber teams.',
      highlights: [
        'Bridges defensive security operations thinking with civic anti-fraud work in Botad Cyber Rakshak AI.',
        'Verified completion credential signed by Tina McCreery, Chief Human Resources Officer, Deloitte.'
      ],
      links: [
        { label: 'Open Certificate PDF ↗', href: 'assets/certs/deloitte-cyber-sim.pdf', primary: true }
      ]
    },
    aws: {
      kicker: 'Cloud & Generative AI Credential',
      title: 'AWS — Foundations of Prompt Engineering',
      image: '',
      meta: [
        { label: 'Issuer', value: 'AWS Training & Certification' },
        { label: 'Completed', value: 'November 09, 2026' },
        { label: 'Domain', value: 'Structured Prompting & Guardrails' },
        { label: 'Status', value: 'Verified Completion' }
      ],
      summary: 'Covers zero-shot/few-shot prompting, chain-of-thought reasoning, prompt safety, and structured output engineering on modern foundation models.',
      highlights: [
        'Directly applied to multilingual scam classification and safe guardrails in production AI apps.'
      ],
      links: [
        { label: 'Open Certificate PDF ↗', href: 'assets/certs/aws-prompt-engineering.pdf', primary: true }
      ]
    },
    ibm: {
      kicker: 'Credly Verified Digital Badge',
      title: 'IBM SkillsBuild — AI Fundamentals',
      image: '',
      meta: [
        { label: 'Issuer', value: 'IBM SkillsBuild' },
        { label: 'Issued', value: 'November 09, 2026' },
        { label: 'Credly URL', value: 'credly.com/go/M1KwZUPe' },
        { label: 'Scope', value: 'Foundations for Understanding AI' }
      ],
      summary: 'Industry-recognized IBM credential covering machine learning foundations, natural language understanding, computer vision concepts, and ethical AI.',
      highlights: [
        'Independently verifiable live via Credly digital badge registry.'
      ],
      links: [
        { label: 'Verify on Credly ↗', href: 'https://www.credly.com/go/M1KwZUPe', primary: true },
        { label: 'Open Certificate PDF ↗', href: 'assets/certs/ibm-ai-fundamentals.pdf', primary: false }
      ]
    },
    google: {
      kicker: 'Generative AI Track',
      title: 'Google Cloud & Simplilearn — LLMs & Image Generation',
      image: '',
      meta: [
        { label: 'Issuer', value: 'Google Cloud & Simplilearn SkillUp' },
        { label: 'Issued', value: 'September 2026' },
        { label: 'Verification Codes', value: '10717386 (LLM) · 10705691 (Img)' },
        { label: 'Focus', value: 'Large Language Models & Diffusion' }
      ],
      summary: 'Dual completion covering transformer-based Large Language Model architectures, fine-tuning workflows, and diffusion-based image generation systems.',
      highlights: [
        'Covers both text intelligence pipelines and visual generative AI concepts.'
      ],
      links: [
        { label: 'Open LLM Certificate PDF ↗', href: 'assets/certs/google-cloud-llm.pdf', primary: true }
      ]
    },
    chaoscore: {
      kicker: 'Hackathon & Systems Engineering',
      title: 'ChaosCore Hackathon 2026 & Scaler AI/LLD Masterclasses',
      image: 'assets/certs/scaler-rag.jpg',
      alt: 'Scaler Masterclass certificate for Dabhi Rushiraj Jayeshbhai on Understand RAG vs AI Agents vs Agentic AI',
      meta: [
        { label: 'Organizations', value: 'Invoqe (ChaosCore) & Scaler' },
        { label: 'Dates', value: 'Sep – Nov 2026' },
        { label: 'Tracks', value: 'Hackathon · RAG/Agentic AI · Payment LLD' },
        { label: 'Institution', value: 'Representing GMIU, Bhavnagar' }
      ],
      summary: 'Hands-on builder participation in ChaosCore Hackathon 2026 paired with Scaler technical deep-dives on RAG vs. Agentic AI and Low-Level Design of Payment Apps.',
      highlights: [
        'ChaosCore Hackathon 2026 (organized by Invoqe, representing GMIU Bhavnagar).',
        'Scaler Masterclasses: Understand RAG vs AI Agents vs Agentic AI & Low-Level Design of Payment Apps.'
      ],
      links: [
        { label: 'Open Hackathon PDF ↗', href: 'assets/certs/chaoscore-hackathon.pdf', primary: true },
        { label: 'Open LLD Certificate ↗', href: 'assets/certs/scaler-lld.jpg', primary: false }
      ]
    }
  };

  /* ---------- Topbar Scroll State & Mobile Drawer ---------- */
  var topbar = document.querySelector('.topbar');
  var navToggle = document.querySelector('[data-nav-toggle]');
  var mobileDrawer = document.querySelector('[data-mobile-drawer]');

  window.addEventListener('scroll', function () {
    if (topbar) topbar.classList.toggle('is-scrolled', window.scrollY > 36);
  }, { passive: true });

  if (navToggle && mobileDrawer) {
    navToggle.addEventListener('click', function () {
      var open = mobileDrawer.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    mobileDrawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileDrawer.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Project Filter Pills ---------- */
  var filterBtns = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  var projectCards = Array.prototype.slice.call(document.querySelectorAll('.project-card[data-category]'));

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = btn.dataset.filter;
      filterBtns.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      projectCards.forEach(function (card) {
        var cats = (card.dataset.category || '').split(/\s+/);
        var match = target === 'all' || cats.indexOf(target) !== -1;
        card.classList.toggle('is-hidden', !match);
      });
    });
  });

  /* ---------- WCAG 2.2.2 Filmstrip Pause / Play Control ---------- */
  var feed = document.querySelector('[data-feed]');
  var feedToggle = document.querySelector('[data-feed-toggle]');

  if (feed && feedToggle) {
    feedToggle.addEventListener('click', function () {
      var paused = feed.classList.toggle('is-paused');
      // Do NOT set aria-pressed when button label switches between Pause and Play (WCAG 2.2.2 guidance)
      feedToggle.textContent = paused ? 'Play Reel' : 'Pause Reel';
    });
  }

  /* ---------- Accessible Native Top-Layer <dialog> with Fallbacks ---------- */
  var dialog = document.getElementById('detail-modal');
  var modalKicker = document.getElementById('modal-kicker');
  var modalTitle = document.getElementById('modal-title');
  var modalBody = document.getElementById('modal-body');

  var supportsDisplayTransition;
  function canTransitionDisplay() {
    if (supportsDisplayTransition !== undefined) return supportsDisplayTransition;
    if (!window.CSS || !CSS.supports || !CSS.supports('transition-behavior', 'allow-discrete') || !document.body) {
      return false;
    }
    var probe = document.createElement('div');
    probe.style.cssText = 'transition: display 1s allow-discrete !important; display: block;';
    document.body.appendChild(probe);
    getComputedStyle(probe).display;
    probe.style.display = 'none';
    supportsDisplayTransition = getComputedStyle(probe).display === 'block';
    probe.remove();
    return supportsDisplayTransition;
  }

  function supportsTopLayerExit() {
    return !!(window.CSS && CSS.supports && CSS.supports('overlay', 'auto') && canTransitionDisplay());
  }

  function closeTopLayer(el) {
    if (!el || !el.open) return;
    if (!supportsTopLayerExit()) {
      el.setAttribute('data-closing', '');
      var anims = el.getAnimations ? el.getAnimations({ subtree: true }) : [];
      if (anims.length > 0) {
        Promise.race([
          Promise.allSettled(anims.map(function (a) { return a.finished; })),
          new Promise(function (r) { setTimeout(r, 500); })
        ]).then(function () {
          if (!el.hasAttribute('data-closing')) return;
          el.removeAttribute('data-closing');
          el.close();
        });
        return;
      }
      el.removeAttribute('data-closing');
    }
    el.close();
  }

  if (dialog) {
    dialog.addEventListener('cancel', function (e) {
      e.preventDefault();
      closeTopLayer(dialog);
    });

    dialog.addEventListener('close', function () {
      dialog.returnValue = '';
      dialog.removeAttribute('data-closing');
    });

    // Fallback light-dismiss for browsers lacking closedBy="any" (e.g. Safari)
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      var pressedOutside = false;
      var isOutside = function (e) {
        var r = dialog.getBoundingClientRect();
        return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
      };
      dialog.addEventListener('pointerdown', function (e) { pressedOutside = isOutside(e); });
      dialog.addEventListener('pointerup', function (e) {
        if (pressedOutside && isOutside(e)) closeTopLayer(dialog);
      });
    }

    var closeBtn = dialog.querySelector('[data-dialog-close]');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        closeTopLayer(dialog);
      });
    }
  }

  function openDetail(item) {
    if (!dialog || !item) return;
    modalKicker.textContent = item.kicker || '';
    modalTitle.textContent = item.title || '';

    var html = '';
    if (item.subtitle) {
      html += '<p style="font-weight:600;font-size:17px;color:var(--accent);">' + item.subtitle + '</p>';
    }
    if (item.image) {
      html += '<div class="dialog__hero"><img src="' + item.image + '" alt="' + (item.alt || item.title) + '"></div>';
    }
    if (item.summary) {
      html += '<p style="line-height:1.65;color:rgba(244,243,238,0.88);">' + item.summary + '</p>';
    }
    if (item.meta && item.meta.length) {
      html += '<div class="dialog__meta-grid">';
      item.meta.forEach(function (m) {
        html += '<div class="dialog__meta-box"><span>' + m.label + '</span><strong>' + m.value + '</strong></div>';
      });
      html += '</div>';
    }
    if (item.highlights && item.highlights.length) {
      html += '<ul class="dialog__bullets">';
      item.highlights.forEach(function (h) {
        html += '<li>' + h + '</li>';
      });
      html += '</ul>';
    }
    if (item.links && item.links.length) {
      html += '<div class="dialog__actions">';
      item.links.forEach(function (lnk) {
        var cls = lnk.primary ? 'btn btn--primary' : 'btn btn--ghost';
        html += '<a class="' + cls + '" href="' + lnk.href + '" target="_blank" rel="noopener noreferrer">' + lnk.label + '</a>';
      });
      html += '</div>';
    }

    modalBody.innerHTML = html;
    dialog.removeAttribute('data-closing');
    dialog.showModal();
  }

  document.addEventListener('click', function (e) {
    var projBtn = e.target.closest('[data-open-project]');
    if (projBtn) {
      openDetail(PROJECTS[projBtn.dataset.openProject]);
      return;
    }
    var certBtn = e.target.closest('[data-open-cert]');
    if (certBtn) {
      openDetail(CERTS[certBtn.dataset.openCert]);
    }
  });

  /* ---------- Copy Email Quick Action ---------- */
  var copyEmailBtn = document.querySelector('[data-copy-email]');
  if (copyEmailBtn && navigator.clipboard) {
    copyEmailBtn.addEventListener('click', function () {
      navigator.clipboard.writeText('rushirajdabhi16@gmail.com').then(function () {
        var orig = copyEmailBtn.textContent;
        copyEmailBtn.textContent = 'Copied email!';
        setTimeout(function () { copyEmailBtn.textContent = orig; }, 2000);
      });
    });
  }

  /* ---------- Contact Form Validation (Modern Web Guidance: validate-input-after-interaction) ---------- */
  var contactForm = document.getElementById('contact-form');
  var formStatus = document.getElementById('form-status');

  if (contactForm) {
    var announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.classList.add('visually-hidden');
    document.body.appendChild(announcer);
    var announceTimer, announcedField;

    var linkError = function (el, shown) {
      var errorId = el.dataset.error;
      if (!errorId) return;
      var ids = (el.getAttribute('aria-describedby') || '').split(/\s+/).filter(function (id) { return id && id !== errorId; });
      if (shown) ids.push(errorId);
      if (ids.length) el.setAttribute('aria-describedby', ids.join(' '));
      else el.removeAttribute('aria-describedby');
    };

    var spokenText = function (node) {
      var copy = node.cloneNode(true);
      copy.querySelectorAll('[aria-hidden="true"]').forEach(function (n) { n.remove(); });
      copy.querySelectorAll('[role="img"][aria-label]').forEach(function (n) {
        n.replaceWith(n.getAttribute('aria-label') + ': ');
      });
      return copy.textContent.replace(/\s+/g, ' ').trim();
    };

    var announceError = function (el) {
      var errEl = document.getElementById(el.dataset.error);
      if (!errEl) return;
      var label = el.labels && el.labels[0] ? spokenText(el.labels[0]) + ': ' : '';
      clearTimeout(announceTimer);
      announcer.textContent = '';
      announcedField = el;
      announceTimer = setTimeout(function () {
        announcer.textContent = label + spokenText(errEl);
      }, 450);
    };

    var supportsUserInvalid = CSS.supports && CSS.supports('selector(:user-invalid)');
    var flagged = new WeakSet();
    var announced = new WeakSet();
    var dirtyState = new WeakMap();

    var isFieldInvalid = function (el) {
      if (supportsUserInvalid) return el.matches(':user-invalid');
      var st = dirtyState.get(el);
      return !!(st && st.hasBlurred && !el.validity.valid);
    };

    var syncField = function (el, allowAnnounce) {
      if (!el.matches || !el.matches('input, select, textarea')) return;
      var invalid = isFieldInvalid(el);

      if (!supportsUserInvalid && dirtyState.has(el) && dirtyState.get(el).hasBlurred) {
        el.classList.toggle('user-invalid-fallback', invalid);
        el.classList.toggle('user-valid-fallback', !invalid);
      }

      if (invalid) {
        if (allowAnnounce && !announced.has(el)) {
          announceError(el);
          announced.add(el);
        }
        el.setAttribute('aria-invalid', 'true');
        linkError(el, true);
        flagged.add(el);
      } else if (flagged.has(el) || el.getAttribute('aria-invalid') !== 'true') {
        el.setAttribute('aria-invalid', 'false');
        linkError(el, false);
        flagged.delete(el);
        announced.delete(el);
        if (announcedField === el) {
          clearTimeout(announceTimer);
          announcer.textContent = '';
        }
      }
    };

    contactForm.querySelectorAll('input, textarea').forEach(function (el) {
      syncField(el, false);
    });

    contactForm.addEventListener('blur', function (e) {
      var st = dirtyState.get(e.target) || { hasInteracted: false, hasBlurred: false };
      st.hasBlurred = true;
      dirtyState.set(e.target, st);
      syncField(e.target, true);
    }, true);

    contactForm.addEventListener('input', function (e) {
      var st = dirtyState.get(e.target) || { hasInteracted: false, hasBlurred: false };
      st.hasInteracted = true;
      dirtyState.set(e.target, st);
      if (e.target.hasAttribute('aria-invalid')) syncField(e.target, false);
    });

    contactForm.addEventListener('invalid', function (e) {
      dirtyState.set(e.target, { hasInteracted: true, hasBlurred: true });
      announced.add(e.target);
      syncField(e.target, false);
    }, true);

    contactForm.addEventListener('submit', function (e) {
      if (!contactForm.checkValidity()) {
        e.preventDefault();
        var firstInvalid = contactForm.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      e.preventDefault();
      var nameVal = contactForm.elements.name.value.trim();
      var emailVal = contactForm.elements.email.value.trim();
      var msgVal = contactForm.elements.message.value.trim();

      var subject = encodeURIComponent('Portfolio Inquiry from ' + nameVal);
      var body = encodeURIComponent('Hi Rushi,\n\n' + msgVal + '\n\n— ' + nameVal + ' (' + emailVal + ')');
      var mailtoHref = 'mailto:rushirajdabhi16@gmail.com?subject=' + subject + '&body=' + body;

      if (formStatus) {
        formStatus.hidden = false;
        formStatus.innerHTML = 'Message prepared for <strong>rushirajdabhi16@gmail.com</strong>. <a href="' + mailtoHref + '" style="text-decoration:underline;color:#ffffff;font-weight:700;">Open in Email App ↗</a>';
      }
      announcer.textContent = 'Message prepared for rushirajdabhi16@gmail.com.';
      window.location.href = mailtoHref;
    });
  }
})();
