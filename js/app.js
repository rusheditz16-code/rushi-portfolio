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
      kicker: 'Personal Desktop Assistant',
      title: 'K.A.I.R.O.S.',
      subtitle: 'Kinetic Artificial Intelligence Responsive Operating System',
      image: 'assets/projects/kairos-hud.png',
      alt: 'K.A.I.R.O.S. desktop HUD showing CPU and RAM gauges, audio visualizer, and chat console',
      meta: [
        { label: 'Stack', value: 'FastAPI, WebSockets, React 19' },
        { label: 'Voice', value: 'Groq Whisper Large v3 Turbo (~150ms)' },
        { label: 'Memory', value: 'Semantic Cache + SQLite Vector RAG' },
        { label: 'Routing', value: 'Multi-Model Router with Fallback' }
      ],
      summary: 'A Windows 11/10 desktop assistant built with a custom PyWebView HUD, always-on wake word ("Hey Kairos"), global shortcut Ctrl+Alt+K, and direct local laptop automation.',
      highlights: [
        'Routes prompts across multiple models with automatic backup switching if one goes down.',
        'Captures microphone audio directly in Python (sounddevice + NumPy) to avoid browser mic glitches.',
        'Includes live CPU, RAM, Battery, and Disk C: gauges, volume/brightness sliders, and an audio wave visualizer.',
        'Supports custom @kairos_tool commands for shell/Python/Java execution plus remote phone access through Cloudflare Tunnel.'
      ],
      links: [
        { label: 'GitHub Profile ↗', href: 'https://github.com/rusheditz16-code', primary: true }
      ]
    },
    'cyber-rakshak': {
      kicker: 'District Initiative · DDO Botad',
      title: 'Botad Cyber Rakshak AI',
      subtitle: 'Bilingual Gujarati & English Cyber Safety Helper',
      image: 'assets/projects/cyber-rakshak.png',
      alt: 'Botad Cyber Rakshak AI English and Gujarati scam verification app',
      meta: [
        { label: 'Live URL', value: 'cyber-rakshak-ai-nine.vercel.app' },
        { label: 'Languages', value: 'Gujarati & English' },
        { label: 'Purpose', value: 'Scam Checking & 1930 Emergency Help' },
        { label: 'Stack', value: 'React, Vite, Tailwind CSS' }
      ],
      summary: 'A bilingual cyber-fraud checker built for Botad district so local citizens can check suspicious SMS messages, links, or calls in Gujarati or English.',
      highlights: [
        'Tap-to-speak voice input and paste box for checking electricity bill scams, KYC messages, UPI traps, and fake lottery calls.',
        'Direct 1930 Golden Hour helpline button and emergency freeze guide right at the top.',
        'Includes an awareness hub and district dashboard view.'
      ],
      links: [
        { label: 'Open Live Site ↗', href: 'https://cyber-rakshak-ai-nine.vercel.app', primary: true },
        { label: 'GitHub Repo ↗', href: 'https://github.com/rusheditz16-code/cyber-rakshak-ai-4', primary: false }
      ]
    },
    janraksha: {
      kicker: 'Disaster Relief · Public Safety',
      title: 'JanRaksha ID',
      subtitle: 'Emergency Identity & Family Reunification',
      image: 'assets/projects/janraksha.png',
      alt: 'JanRaksha ID live screen with emergency QR identity card',
      meta: [
        { label: 'Live URL', value: 'janraksha-id-demo.vercel.app' },
        { label: 'Privacy', value: 'Opaque QR / NFC Lookup Tokens' },
        { label: 'Views', value: 'Volunteer Scanner & Ops Dashboard' },
        { label: 'Stack', value: 'Next.js, TypeScript, Tailwind CSS' }
      ],
      summary: 'Web app for disaster and crowd-safety situations that lets volunteers scan an emergency QR/NFC tag to view medical alerts and help reunite separated families.',
      highlights: [
        'Uses opaque lookup tokens so sensitive personal details stay hidden while critical allergies or medical notes show immediately.',
        'Built separate mobile-friendly screens for person registration, volunteer scanning, and operations tracking.',
        'Includes a high-contrast toggle and clean field-ready layout.'
      ],
      links: [
        { label: 'Open Live Site ↗', href: 'https://janraksha-id-demo.vercel.app', primary: true }
      ]
    },
    khojsetu: {
      kicker: 'Campus Utility · Lost & Found',
      title: 'KhojSetu',
      subtitle: 'Campus Lost & Found Bridge',
      image: 'assets/projects/khojsetu.png',
      alt: 'KhojSetu live campus lost and found app',
      meta: [
        { label: 'Live URL', value: 'khojsetu-pied.vercel.app' },
        { label: 'Matching', value: 'Factor Match Scoring' },
        { label: 'Verification', value: 'Role-Gated Private Claims' },
        { label: 'Stack', value: 'Next.js, TypeScript, Tailwind CSS' }
      ],
      summary: 'Campus lost-and-found tracker that pairs missing items with found listings based on item category, keywords, approximate campus zone, and timing.',
      highlights: [
        'Shows clear match reasons instead of a black-box score so students know why two listings overlap.',
        'Uses private claim checks so items only go back to the actual owner.',
        'Fast filtering across campus zones and saved dossiers.'
      ],
      links: [
        { label: 'Open Live Site ↗', href: 'https://khojsetu-pied.vercel.app/', primary: true },
        { label: 'GitHub Repo ↗', href: 'https://github.com/rusheditz16-code/KhojSetu', primary: false }
      ]
    },
    ayurswift: {
      kicker: 'Local E-Commerce · Bhavnagar',
      title: 'AyurSwift',
      subtitle: 'Ayurvedic & OTC Pharmacy with Slot Delivery',
      image: 'assets/projects/ayurswift.png',
      alt: 'AyurSwift live store showing Bhavnagar delivery slots',
      meta: [
        { label: 'Live URL', value: 'ayurswift.vercel.app' },
        { label: 'Local Delivery', value: '4 Daily Slots in Bhavnagar (364001)' },
        { label: 'Courier', value: '2-4 Day All-India Parcel Tracking' },
        { label: 'Stack', value: 'Next.js, TypeScript, Tailwind CSS' }
      ],
      summary: 'Ayurvedic and OTC store designed for scheduled local delivery slots across Bhavnagar along with tracked All-India parcel shipping.',
      highlights: [
        'Four daily Bhavnagar delivery windows (9-10 AM, 10-11 AM, 6-7 PM, 7-8 PM) plus stock checks before confirmation.',
        'Category browsing, brand filters, quick WhatsApp list ordering, and direct UPI support.',
        'Fast mobile layout built for everyday shoppers.'
      ],
      links: [
        { label: 'Open Live Site ↗', href: 'https://ayurswift.vercel.app', primary: true },
        { label: 'GitHub Repo ↗', href: 'https://github.com/rusheditz16-code/AyurSwift', primary: false }
      ]
    }
  };

  var CERTS = {
    oracle: {
      kicker: 'Certification',
      title: 'Oracle Agentic AI Certified Foundations Associate',
      image: '',
      meta: [
        { label: 'Issuer', value: 'Oracle University' },
        { label: 'Validity', value: 'Oct 27, 2026 to Oct 27, 2028' },
        { label: 'Certificate ID', value: '103568242AAI26OFA' },
        { label: 'Topics', value: 'Agents, Tool Use & Orchestration' }
      ],
      summary: 'Official Oracle University certification covering agent architectures, multi-step planning, and tool calling.',
      highlights: [
        'Directly connects to the agent loop and tool registry I built inside K.A.I.R.O.S.',
        'Signed eCertificate PDF included below with verification ID.'
      ],
      links: [
        { label: 'Open Certificate PDF ↗', href: 'assets/certs/oracle-agentic-ai.pdf', primary: true }
      ]
    },
    deloitte: {
      kicker: 'Virtual Job Simulation',
      title: 'Deloitte Cyber Security Job Simulation',
      image: '',
      meta: [
        { label: 'Issuer', value: 'Deloitte (via Forage)' },
        { label: 'Completed', value: 'August 24, 2026' },
        { label: 'Enrolment Code', value: '6a8c0d83e62e344f1f47d849' },
        { label: 'User Code', value: '6a8c0b008f5fb1ac612b2638' }
      ],
      summary: 'Completed practical cybersecurity tasks on log analysis, threat detection, and security operations.',
      highlights: [
        'Helped shape the cyber-safety checklists and triage flow in Botad Cyber Rakshak AI.',
        'Signed completion certificate archived below.'
      ],
      links: [
        { label: 'Open Certificate PDF ↗', href: 'assets/certs/deloitte-cyber-sim.pdf', primary: true }
      ]
    },
    aws: {
      kicker: 'Course Certificate',
      title: 'AWS Foundations of Prompt Engineering',
      image: '',
      meta: [
        { label: 'Issuer', value: 'AWS Training & Certification' },
        { label: 'Completed', value: 'November 09, 2026' },
        { label: 'Topics', value: 'Prompting Patterns & Guardrails' },
        { label: 'Status', value: 'Completed' }
      ],
      summary: 'Covers zero-shot and few-shot prompting, structured outputs, and keeping model answers accurate and safe.',
      highlights: [
        'Applied directly while tuning bilingual scam detection prompts.'
      ],
      links: [
        { label: 'Open Certificate PDF ↗', href: 'assets/certs/aws-prompt-engineering.pdf', primary: true }
      ]
    },
    ibm: {
      kicker: 'Digital Badge',
      title: 'IBM SkillsBuild: AI Fundamentals',
      image: '',
      meta: [
        { label: 'Issuer', value: 'IBM SkillsBuild' },
        { label: 'Issued', value: 'November 09, 2026' },
        { label: 'Credly Link', value: 'credly.com/go/M1KwZUPe' },
        { label: 'Topics', value: 'ML, NLP & Responsible AI' }
      ],
      summary: 'IBM SkillsBuild badge covering machine learning basics, natural language processing, computer vision, and AI ethics.',
      highlights: [
        'Verifiable online directly on Credly.'
      ],
      links: [
        { label: 'Verify on Credly ↗', href: 'https://www.credly.com/go/M1KwZUPe', primary: true },
        { label: 'Open Certificate PDF ↗', href: 'assets/certs/ibm-ai-fundamentals.pdf', primary: false }
      ]
    },
    google: {
      kicker: 'Course Completion',
      title: 'Google Cloud & Simplilearn: LLMs & Image Generation',
      image: '',
      meta: [
        { label: 'Issuer', value: 'Google Cloud & Simplilearn SkillUp' },
        { label: 'Issued', value: 'September 2026' },
        { label: 'Codes', value: '10717386 (LLM) · 10705691 (Img)' },
        { label: 'Topics', value: 'LLMs & Diffusion Models' }
      ],
      summary: 'Completed both Google Cloud SkillUp tracks on Large Language Models and Image Generation fundamentals.',
      highlights: [
        'Covered transformer basics, fine-tuning concepts, and diffusion models.'
      ],
      links: [
        { label: 'Open LLM Certificate PDF ↗', href: 'assets/certs/google-cloud-llm.pdf', primary: true }
      ]
    },
    chaoscore: {
      kicker: 'Hackathon & Masterclasses',
      title: 'ChaosCore Hackathon 2026 & Scaler Sessions',
      image: 'assets/certs/scaler-rag.jpg',
      alt: 'Scaler Masterclass certificate for Dabhi Rushiraj Jayeshbhai on RAG vs AI Agents vs Agentic AI',
      meta: [
        { label: 'Organizations', value: 'Invoqe (ChaosCore) & Scaler' },
        { label: 'Dates', value: 'Sep - Nov 2026' },
        { label: 'Tracks', value: 'Hackathon · RAG & Agents · Payment LLD' },
        { label: 'College', value: 'GMIU, Bhavnagar' }
      ],
      summary: 'Participated in ChaosCore Hackathon 2026 representing GMIU alongside Scaler masterclasses on RAG vs. Agentic AI and Payment App Low-Level Design.',
      highlights: [
        'ChaosCore Hackathon 2026 (organized by Invoqe).',
        'Scaler Masterclasses on RAG/Agentic AI and Low-Level Design of Payment Apps.'
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
