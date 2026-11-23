/* ==========================================================================
   Main Portfolio Controller:
   - Reusable Engineering Case Study Modal + Curated Projects & Certs Registry
   - Category Filter Pills & WCAG 2.2.2 Filmstrip Pause/Play Control
   - Native Top-Layer <dialog> with light-dismiss & exit transition fallbacks
   - Recruiter Scroll-Spy Navigation & Accessible Mobile Drawer (Esc / Outside Click)
   - Accessible Contact Form (:user-invalid fallback, aria-invalid, honest status)
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Reusable Case Study & Certificate Registries ---------- */
  var PROJECTS = {
    kairos: {
      type: 'case-study',
      kicker: 'Case Study 01 · AI & Desktop Systems',
      title: 'K.A.I.R.O.S.',
      subtitle: 'Kinetic Artificial Intelligence Responsive Operating System',
      image: 'assets/projects/kairos-hud.webp',
      alt: 'K.A.I.R.O.S. desktop HUD showing CPU and RAM gauges, audio visualizer, and chat console',
      demoSlides: [
        {
          src: 'assets/projects/kairos-hud.webp',
          title: '01 · Desktop HUD & Direct Voice Bridge',
          desc: 'PyWebView + React 19 interface with live CPU, RAM, Battery, and Disk gauges plus Groq Whisper v3 Turbo transcription (~150ms).'
        },
        {
          src: 'assets/projects/kairos-hud-2.webp',
          title: '02 · Always-On Local Wake Word Mode',
          desc: 'Background listener waiting for "Hey Kairos" or Ctrl+Alt+K across Windows apps with real-time audio visualization.'
        },
        {
          src: 'assets/projects/kairos-hud-3.webp',
          title: '03 · Cloudflare Remote Tunnel & Sandboxed Tools',
          desc: 'Secure remote phone access alongside @kairos_tool execution for URLs, workspace commands, and desktop controls.'
        }
      ],
      meta: [
        { label: 'Status', value: 'Local Windows Build (Private Repo)' },
        { label: 'Role', value: 'Sole Developer & Architect' },
        { label: 'Speech-to-Text', value: 'Groq Whisper v3 Turbo (~150ms STT)' },
        { label: 'Core Runtime', value: 'Python FastAPI + React 19 HUD' }
      ],
      overview: 'K.A.I.R.O.S. is my personal J.A.I.R.V.I.S.-inspired Windows 10/11 desktop assistant. It combines a PyWebView + React 19 HUD with an asynchronous Python FastAPI backend that handles local voice capture, complexity-aware LLM routing, 3-tier persistent memory, and sandboxed OS automation.',
      problem: 'Using browser-based AI tools alongside daily Windows coding workflows creates constant context switching, unreliable browser microphone handling, no direct awareness of local hardware or workspace files, and single-provider downtime failures.',
      solution: 'Built a local-first desktop architecture where Python captures microphone audio natively via sounddevice and NumPy, streams events over a multiplexed FastAPI WebSocket bus, routes prompts across lightweight vs. deep-reasoning tiers with circuit breakers, and executes OS actions through a tiered @kairos_tool sandbox.',
      role: 'Designed and implemented the full local stack end to end: Python FastAPI server, multiplexed WebSocket manager, complexity router and circuit breaker, 3-tier SQLite memory engine, Win32 tool sandbox, React 19 + Zustand HUD, and Cloudflare Tunnel launcher.',
      stack: [
        'Python',
        'FastAPI',
        'WebSockets',
        'React 19',
        'Vite',
        'Tailwind CSS v4',
        'Zustand',
        'PyWebView',
        'Groq Whisper Large v3 Turbo',
        'sounddevice + NumPy',
        'aiosqlite',
        'Pydantic v2',
        'psutil / pycaw / pywin32',
        'Cloudflare Tunnel'
      ],
      architecture: {
        summary: 'Event-driven local architecture built around six multiplexed WebSocket channels (token_stream, thought_graph, terminal_logs, audio_stream, telemetry, system) and per-session asyncio cancellation tokens for instant user barge-in.',
        steps: [
          {
            label: '1. Input & Audio Capture',
            detail: 'Local wake word ("Hey Kairos") or Ctrl+Alt+K captures audio directly in Python (sounddevice + NumPy) and transcribes via Groq Whisper Large v3 Turbo.'
          },
          {
            label: '2. Multiplexed WS Event Bus (core/ws_manager.py)',
            detail: 'Full-duplex WebSocket hub broadcasts tokens, thought states, logs, and telemetry while supporting asyncio.Event barge-in cancellation when the user interrupts.'
          },
          {
            label: '3. Direct Fast Path & ReAct Agent (engine/agent.py)',
            detail: 'Rule-based _try_direct_action() intercepts common Windows controls (volume, brightness, app launch, screenshot, lock/sleep) with zero LLM wait before falling back to the ReAct loop.'
          },
          {
            label: '4. Complexity Router & Circuit Breaker (engine/router.py)',
            detail: 'Heuristic ComplexityScorer classifies prompts into LIGHTWEIGHT or DEEP_REASONING tiers; per-provider CircuitBreaker (CLOSED/OPEN/HALF_OPEN) handles exponential backoff failover.'
          },
          {
            label: '5. 3-Tier Memory (engine/memory.py)',
            detail: 'Tier 1 workspace-hashed TTL semantic cache (128-dim deterministic n-gram cosine matching), Tier 2 working-context compressor, and Tier 3 aiosqlite episodic vector store.'
          },
          {
            label: '6. Sandboxed Tool Registry (tools/sandbox.py)',
            detail: 'Decorator-based ToolRegistry auto-generates JSON schemas from Python signatures and classifies tools into SAFE (read-only/telemetry) vs. RESTRICTED (shell, file write, process control).'
          }
        ]
      },
      challenges: [
        'Browser Web Speech APIs dropped audio or conflicted with desktop focus, requiring a native Python sounddevice + NumPy capture bridge.',
        'Repeated workspace queries risked returning stale cached responses after local file edits, solved by hashing workspace file modification times into the Tier 1 semantic cache key.',
        'Voice assistants feel sluggish when every simple OS command waits on an LLM round trip or cannot be interrupted mid-response.'
      ],
      decisions: [
        'Added a zero-latency _try_direct_action() fast path in ReActAgent for high-frequency Windows controls instead of sending every command to an LLM.',
        'Implemented deterministic 128-dimensional n-gram/trigram hash embeddings in Tier 1 semantic cache so local similarity lookup works without external embedding API latency or cost.',
        'Separated @kairos_tool capabilities into SAFE and RESTRICTED risk tiers with timeout guards rather than exposing unrestricted shell execution.',
        'Used Cloudflare Tunnel (deploy_free_cloud.bat) so the local Windows instance can be accessed from a phone without opening router ports.'
      ],
      limitations: [
        'Currently tightly coupled to Windows APIs (pycaw, pywin32, PyWebView) and not yet packaged for macOS or Linux.',
        'Source repository is kept local while cleaning up configuration and packaging for a public open-source release.',
        'Next steps: automated integration tests for router failover, clean installer packaging, and optional local offline LLM fallback.'
      ],
      links: [
        { label: 'GitHub Profile ↗', href: 'https://github.com/rusheditz16-code', primary: true }
      ]
    },

    'cyber-rakshak': {
      type: 'case-study',
      kicker: 'Case Study 02 · Civic AI & Public Safety',
      title: 'Botad Cyber Rakshak AI',
      subtitle: 'Bilingual Gujarati & English Cyber Fraud Helper (DDO Botad Initiative)',
      image: 'assets/projects/cyber-rakshak.webp',
      alt: 'Botad Cyber Rakshak AI English and Gujarati scam verification interface',
      meta: [
        { label: 'Status', value: 'Live on Vercel' },
        { label: 'Role', value: 'Sole Frontend & AI Workflow Builder' },
        { label: 'Languages', value: 'Gujarati & English' },
        { label: 'Core Stack', value: 'React, Vite, Tailwind CSS' }
      ],
      overview: 'Botad Cyber Rakshak AI (બોટાદ સાયબર રક્ષક) is a bilingual web application created for the Botad district initiative to help citizens quickly evaluate suspicious SMS messages, UPI payment traps, electricity bill scams, fake KYC notices, and suspicious links before taking action.',
      problem: 'Many local citizens in tier-2 and tier-3 districts receive financial scam messages in Gujarati, Hinglish, or English and do not know how to verify red flags quickly or where to report fraud within the critical 1930 Golden Hour.',
      solution: 'Designed a mobile-first bilingual checker where anyone can speak or paste a suspicious message, review clear risk indicators in Gujarati or English, and trigger immediate 1930 cyber helpline or Emergency Freeze SOS guidance without navigating complex menus.',
      role: 'Built the full responsive React + Vite frontend, bilingual Gujarati/English interface toggle, voice and text scam-checking flows, 1930 Emergency Freeze SOS section, Awareness Hub, DDO Dashboard view, and Vercel deployment.',
      stack: [
        'React',
        'Vite',
        'Tailwind CSS',
        'JavaScript (ES6+)',
        'Bilingual Gujarati / English UI',
        'Voice Input Flow',
        'Vercel'
      ],
      architecture: {
        summary: 'Client-first single-page architecture optimized for fast loading on budget smartphones and rapid panic-moment navigation.',
        steps: [
          {
            label: '1. Bilingual Input Layer',
            detail: 'Instant language switch between Gujarati and English with tap-to-speak microphone input and direct SMS/link paste box.'
          },
          {
            label: '2. Fraud Signal Verification Flow',
            detail: 'Evaluates pasted messages, links, or call scripts against common regional scam patterns (KYC expiry, UPI collect traps, fake utility bills, lottery calls).'
          },
          {
            label: '3. Immediate Action & 1930 SOS',
            detail: 'Pins the 1930 Golden Hour helpline trigger and step-by-step Emergency Freeze checklist at the top of the flow so victims act quickly.'
          },
          {
            label: '4. Awareness Hub & District View',
            detail: 'Provides educational scam examples alongside a DDO Dashboard view designed for civic demonstration and outreach.'
          }
        ]
      },
      challenges: [
        'Keeping Gujarati typography crisp and uncluttered on narrow smartphone screens without crowding emergency buttons.',
        'Structuring the UI so a stressed user who may have just clicked a phishing link finds the 1930 helpline in one tap rather than reading long paragraphs.'
      ],
      decisions: [
        'Elevated the 1930 helpline and Emergency Freeze SOS actions above secondary content instead of burying them in a footer.',
        'Combined voice input with paste-text verification to lower the barrier for older citizens less comfortable typing.',
        'Chose Vite + React with lightweight Tailwind styling so initial page loads stay fast over mobile data.'
      ],
      limitations: [
        'District dashboard views currently serve demonstration workflows rather than a live police case-management API.',
        'Next steps: connect verified government threat feeds, offline PWA caching for rural connectivity, and automated screenshot OCR.'
      ],
      links: [
        { label: 'Open Live Demo ↗', href: 'https://cyber-rakshak-ai-nine.vercel.app', primary: true },
        { label: 'GitHub Repository ↗', href: 'https://github.com/rusheditz16-code/cyber-rakshak-ai-4', primary: false }
      ]
    },

    janraksha: {
      type: 'case-study',
      kicker: 'Case Study 03 · Public Safety & Accessibility',
      title: 'JanRaksha ID',
      subtitle: 'Privacy-Safe Emergency Identity & Family Reunification',
      image: 'assets/projects/janraksha.webp',
      alt: 'JanRaksha ID emergency QR identity card and reunification interface',
      meta: [
        { label: 'Status', value: 'Live Demo on Vercel' },
        { label: 'Role', value: 'Full-Stack UI & Workflow Designer' },
        { label: 'Key Mechanism', value: 'Opaque QR / NFC Lookup Tokens' },
        { label: 'Core Stack', value: 'Next.js, TypeScript, Tailwind CSS' }
      ],
      overview: 'JanRaksha ID is a disaster-response and crowd-safety web app that pairs individuals with scannable QR/NFC emergency cards so field volunteers can view critical medical alerts and coordinate family reunification quickly.',
      problem: 'During floods, religious gatherings, or medical incidents, separated children or elderly people may be unable to communicate allergies, conditions, or family contacts, while printing raw personal details on tags creates privacy risks.',
      solution: 'Structured the system around opaque QR/NFC lookup tokens that expose only essential safety fields (blood group, allergies, emergency guidance) on scan, paired with separate mobile screens for registration, volunteer scanning, and operations overview.',
      role: 'Built the Next.js and TypeScript web application, emergency ID card layout, Volunteer Scanner workflow, Register/Update Person forms, Operations Dashboard screens, high-contrast mode, and Vercel deployment.',
      stack: [
        'Next.js',
        'TypeScript',
        'Tailwind CSS',
        'Opaque QR / NFC Tokens',
        'High-Contrast Accessibility Mode',
        'Vercel'
      ],
      architecture: {
        summary: 'Role-separated Next.js application dividing citizen card creation, field volunteer scanning, and coordination tracking.',
        steps: [
          {
            label: '1. Registration & Token Card',
            detail: 'Captures emergency medical alerts and family contacts and binds them to an opaque QR/NFC identifier.'
          },
          {
            label: '2. Volunteer Scanner View',
            detail: 'Field-ready screen prioritizing high-contrast allergy and medical banners immediately upon lookup.'
          },
          {
            label: '3. Operations Tracking',
            detail: 'Centralized view to review active records and coordinate safe family handoffs.'
          }
        ]
      },
      challenges: [
        'Balancing rapid emergency visibility with privacy so scanned codes do not expose unnecessary sensitive information.',
        'Ensuring cards and forms remain legible outdoors under bright sunlight on budget mobile screens.'
      ],
      decisions: [
        'Used opaque token identifiers instead of encoding raw personal details directly into plain-text QR payloads.',
        'Added a dedicated high-contrast toggle and clean field-first button sizing across scanner screens.'
      ],
      limitations: [
        'Hosted currently as an interactive demonstration app on Vercel; public repository link is not published yet.',
        'Next steps: encrypted cloud persistence, role-based responder authentication, and offline-first service worker caching for disaster zones with weak signal.'
      ],
      links: [
        { label: 'Open Live Demo ↗', href: 'https://janraksha-id-demo.vercel.app', primary: true }
      ]
    },

    khojsetu: {
      type: 'case-study',
      kicker: 'Case Study 04 · Campus Utility Platform',
      title: 'KhojSetu',
      subtitle: 'Explainable Campus Lost & Found Bridge',
      image: 'assets/projects/khojsetu.webp',
      alt: 'KhojSetu campus lost and found matching dashboard',
      meta: [
        { label: 'Status', value: 'Live on Vercel' },
        { label: 'Role', value: 'Sole Developer' },
        { label: 'Core Feature', value: 'Explainable Factor Match Scoring' },
        { label: 'Core Stack', value: 'Next.js, TypeScript, Tailwind CSS' }
      ],
      overview: 'KhojSetu is a campus lost-and-found web platform that pairs missing-item reports with found listings using transparent multi-factor matching and private ownership verification.',
      problem: 'Students typically post lost ID cards, chargers, or keys into fast-moving WhatsApp groups where messages disappear within hours and anyone can falsely claim a found item.',
      solution: 'Built a structured registry using approximate campus zones, explainable factor-match scoring (category, keywords, campus zone, and time window), saved tracking dossiers, and role-gated private claim reviews.',
      role: 'Implemented the Next.js + TypeScript application, factor-scoring match presentation, zone-based filters, saved dossiers, claim review workflow, and GitHub + Vercel deployment.',
      stack: [
        'Next.js',
        'TypeScript',
        'Tailwind CSS',
        'Factor Match Scoring',
        'Role-Gated Claim Review',
        'Vercel'
      ],
      architecture: {
        summary: 'Structured reporting and explainable scoring flow built in Next.js and TypeScript.',
        steps: [
          {
            label: '1. Structured Report Intake',
            detail: 'Logs item category, keywords, approximate campus zone, and time window for both lost and found entries.'
          },
          {
            label: '2. Explainable Match Scoring',
            detail: 'Ranks potential pairs and surfaces why two records matched (category, zone overlap, timing, and keyword signals) rather than showing an unexplained score.'
          },
          {
            label: '3. Private Claim Verification',
            detail: 'Gates final handoff behind role-checked private ownership details so items return to the real owner.'
          }
        ]
      },
      challenges: [
        'Making match recommendations trustworthy without hiding scoring logic behind an opaque number.',
        'Preventing false ownership claims while keeping reporting quick enough for students between lectures.'
      ],
      decisions: [
        'Displayed explicit per-factor match reasons so users can inspect overlap directly.',
        'Used approximate campus zones instead of forcing precise GPS coordinates, matching how students actually remember campus locations.'
      ],
      limitations: [
        'Next steps: university email SSO verification, push/email match alerts, and image-similarity assisted matching.'
      ],
      links: [
        { label: 'Open Live Demo ↗', href: 'https://khojsetu-pied.vercel.app/', primary: true },
        { label: 'GitHub Repository ↗', href: 'https://github.com/rusheditz16-code/KhojSetu', primary: false }
      ]
    },

    ayurswift: {
      type: 'case-study',
      kicker: 'Case Study 05 · Local E-Commerce',
      title: 'AyurSwift',
      subtitle: 'Scheduled Ayurvedic & OTC Pharmacy Storefront',
      image: 'assets/projects/ayurswift.webp',
      alt: 'AyurSwift storefront displaying Bhavnagar scheduled delivery slots',
      meta: [
        { label: 'Status', value: 'Live on Vercel' },
        { label: 'Role', value: 'Sole Developer' },
        { label: 'Local Fulfillment', value: '4 Daily Bhavnagar (364001) Slots' },
        { label: 'Core Stack', value: 'Next.js, TypeScript, Tailwind CSS' }
      ],
      overview: 'AyurSwift is a mobile-first Ayurvedic and everyday OTC storefront tailored around predictable local delivery slots in Bhavnagar (PIN 364001) alongside tracked 2-4 day All-India courier dispatch.',
      problem: 'Local pharmacy shoppers often face unclear delivery windows or cluttered e-commerce checkouts when they just want routine Ayurvedic products or a quick family medicine list fulfilled on a known schedule.',
      solution: 'Built a fast storefront organized around four clear daily Bhavnagar slots (9-10 AM, 10-11 AM, 6-7 PM, 7-8 PM), brand and category filtering, pre-confirmation stock visibility, WhatsApp list ordering, and direct UPI checkout.',
      role: 'Built the full Next.js + TypeScript storefront UI, category/brand filters, Bhavnagar slot selector, WhatsApp order helper, UPI checkout flow, and Vercel deployment.',
      stack: [
        'Next.js',
        'TypeScript',
        'Tailwind CSS',
        'Slot-Based Checkout UI',
        'WhatsApp & UPI Flows',
        'Vercel'
      ],
      architecture: {
        summary: 'Fast-browsing Next.js storefront combining catalog discovery with local neighborhood logistics options.',
        steps: [
          {
            label: '1. Catalog & Brand Filtering',
            detail: 'Category tabs and brand filters let shoppers locate Ayurvedic and OTC items quickly on mobile.'
          },
          {
            label: '2. Fulfillment Window Selection',
            detail: 'Separates local Bhavnagar (364001) 4-slot same-day runs from 2-4 day All-India tracked parcels.'
          },
          {
            label: '3. Low-Friction Checkout',
            detail: 'Supports both cart checkout with direct UPI details and quick WhatsApp list ordering for repeat household buyers.'
          }
        ]
      },
      challenges: [
        'Making both local scheduled slots and nationwide courier options immediately understandable without confusing checkout steps.',
        'Keeping catalog browsing responsive and thumb-friendly on small smartphone screens.'
      ],
      decisions: [
        'Added a quick WhatsApp list ordering path alongside standard cart checkout because local customers frequently send handwritten or typed household lists.',
        'Surfaced exact Bhavnagar slot timings clearly up front instead of hiding delivery schedules until final checkout.'
      ],
      limitations: [
        'Live inventory sync and automated payment gateway webhooks are planned next for connecting to a physical store POS.',
        'Next steps: real-time inventory backend, order tracking portal, and prescription upload verification.'
      ],
      links: [
        { label: 'Open Live Demo ↗', href: 'https://ayurswift.vercel.app', primary: true },
        { label: 'GitHub Repository ↗', href: 'https://github.com/rusheditz16-code/AyurSwift', primary: false }
      ]
    }
  };

  var CERTS = {
    oracle: {
      type: 'cert',
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
        'Directly connects to the ReAct agent loop and sandboxed tool registry built inside K.A.I.R.O.S.',
        'Signed eCertificate PDF linked below with verification ID.'
      ],
      links: [
        { label: 'Open Certificate PDF ↗', href: 'assets/certs/oracle-agentic-ai.pdf', primary: true }
      ]
    },
    deloitte: {
      type: 'cert',
      kicker: 'Virtual Job Simulation',
      title: 'Deloitte Cyber Security Job Simulation',
      image: '',
      meta: [
        { label: 'Issuer', value: 'Deloitte (via Forage)' },
        { label: 'Completed', value: 'August 24, 2026' },
        { label: 'Enrolment Code', value: '6a8c0d83e62e344f1f47d849' },
        { label: 'User Code', value: '6a8c0b008f5fb1ac612b2638' }
      ],
      summary: 'Completed practical cybersecurity simulation tasks covering log analysis, threat detection, and security operations.',
      highlights: [
        'Informed the fraud triage checklists and 1930 Emergency Freeze workflow in Botad Cyber Rakshak AI.',
        'Signed completion certificate PDF available below.'
      ],
      links: [
        { label: 'Open Certificate PDF ↗', href: 'assets/certs/deloitte-cyber-sim.pdf', primary: true }
      ]
    },
    aws: {
      type: 'cert',
      kicker: 'Course Certificate',
      title: 'AWS Foundations of Prompt Engineering',
      image: '',
      meta: [
        { label: 'Issuer', value: 'AWS Training & Certification' },
        { label: 'Completed', value: 'November 09, 2026' },
        { label: 'Topics', value: 'Prompting Patterns & Guardrails' },
        { label: 'Status', value: 'Completed' }
      ],
      summary: 'Covers zero-shot and few-shot prompting, structured outputs, and keeping model responses reliable and safe.',
      highlights: [
        'Applied directly while designing structured prompts and guardrails for K.A.I.R.O.S. and bilingual scam checks.'
      ],
      links: [
        { label: 'Open Certificate PDF ↗', href: 'assets/certs/aws-prompt-engineering.pdf', primary: true }
      ]
    },
    ibm: {
      type: 'cert',
      kicker: 'Digital Badge',
      title: 'IBM SkillsBuild: AI Fundamentals',
      image: '',
      meta: [
        { label: 'Issuer', value: 'IBM SkillsBuild' },
        { label: 'Issued', value: 'November 09, 2026' },
        { label: 'Credly Link', value: 'credly.com/go/M1KwZUPe' },
        { label: 'Topics', value: 'ML, NLP & Responsible AI' }
      ],
      summary: 'IBM SkillsBuild credential covering machine learning basics, natural language processing, computer vision, and responsible AI.',
      highlights: [
        'Publicly verifiable online on Credly alongside the archived certificate PDF.'
      ],
      links: [
        { label: 'Verify on Credly ↗', href: 'https://www.credly.com/go/M1KwZUPe', primary: true },
        { label: 'Open Certificate PDF ↗', href: 'assets/certs/ibm-ai-fundamentals.pdf', primary: false }
      ]
    },
    google: {
      type: 'cert',
      kicker: 'Course Completion',
      title: 'Google Cloud & Simplilearn: LLMs & Image Generation',
      image: '',
      meta: [
        { label: 'Issuer', value: 'Google Cloud & Simplilearn SkillUp' },
        { label: 'Issued', value: 'September 2026' },
        { label: 'Codes', value: '10717386 (LLM) · 10705691 (Img)' },
        { label: 'Topics', value: 'LLMs & Diffusion Models' }
      ],
      summary: 'Completed both Google Cloud SkillUp tracks covering Large Language Models and Image Generation fundamentals.',
      highlights: [
        'Covered transformer concepts, fine-tuning workflows, and diffusion model basics.'
      ],
      links: [
        { label: 'Open LLM Certificate PDF ↗', href: 'assets/certs/google-cloud-llm.pdf', primary: true }
      ]
    },
    chaoscore: {
      type: 'cert',
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
      summary: 'Participated in ChaosCore Hackathon 2026 representing GMIU alongside Scaler masterclasses on RAG vs. Agentic AI and Low-Level Design of Payment Apps.',
      highlights: [
        'ChaosCore Hackathon 2026 organized by Invoqe at GMIU.',
        'Scaler Masterclasses on RAG / Agentic AI and Payment App Low-Level Design.'
      ],
      links: [
        { label: 'Open Hackathon PDF ↗', href: 'assets/certs/chaoscore-hackathon.pdf', primary: true },
        { label: 'Open LLD Certificate ↗', href: 'assets/certs/scaler-lld.jpg', primary: false }
      ]
    }
  };

  /* ---------- Topbar Scroll State, Scroll-Spy & Accessible Mobile Drawer ---------- */
  var topbar = document.querySelector('.topbar');
  var navToggle = document.querySelector('[data-nav-toggle]');
  var mobileDrawer = document.querySelector('[data-mobile-drawer]');

  function closeMobileDrawer(restoreFocus) {
    if (!mobileDrawer || !navToggle) return;
    if (!mobileDrawer.classList.contains('is-open')) return;
    mobileDrawer.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.textContent = '☰';
    if (restoreFocus) navToggle.focus();
  }

  window.addEventListener('scroll', function () {
    if (topbar) topbar.classList.toggle('is-scrolled', window.scrollY > 36);
  }, { passive: true });

  if (navToggle && mobileDrawer) {
    navToggle.addEventListener('click', function () {
      var open = mobileDrawer.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.textContent = open ? '✕' : '☰';
    });

    mobileDrawer.querySelectorAll('a, button').forEach(function (el) {
      el.addEventListener('click', function () {
        closeMobileDrawer(false);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
        closeMobileDrawer(true);
      }
    });

    document.addEventListener('click', function (e) {
      if (!mobileDrawer.classList.contains('is-open')) return;
      if (mobileDrawer.contains(e.target) || (topbar && topbar.contains(e.target))) return;
      closeMobileDrawer(false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 960) closeMobileDrawer(false);
    }, { passive: true });
  }

  /* Scroll-spy active section highlighter */
  var trackedSections = Array.prototype.slice.call(document.querySelectorAll('[data-section]'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('[data-nav-link]'));

  function setActiveNav(sectionId) {
    navLinks.forEach(function (link) {
      var isCurrent = link.dataset.navLink === sectionId;
      if (isCurrent) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  if ('IntersectionObserver' in window && trackedSections.length && navLinks.length) {
    var visibleMap = {};
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var id = entry.target.dataset.section;
        visibleMap[id] = entry.isIntersecting ? entry.intersectionRatio : 0;
      });
      var bestId = null;
      var bestRatio = 0;
      trackedSections.forEach(function (sec) {
        var id = sec.dataset.section;
        if ((visibleMap[id] || 0) > bestRatio) {
          bestRatio = visibleMap[id];
          bestId = id;
        }
      });
      if (bestId) setActiveNav(bestId);
    }, {
      rootMargin: '-18% 0px -48% 0px',
      threshold: [0, 0.15, 0.35, 0.6]
    });

    trackedSections.forEach(function (sec) { navObserver.observe(sec); });
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

  var demoTimer = null;
  function stopDemoTimer() {
    if (demoTimer) {
      clearInterval(demoTimer);
      demoTimer = null;
    }
  }

  if (dialog) {
    dialog.addEventListener('cancel', function (e) {
      e.preventDefault();
      closeTopLayer(dialog);
    });

    dialog.addEventListener('close', function () {
      stopDemoTimer();
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

  function wireDemoPlayer(slides) {
    stopDemoTimer();
    var imgEl = modalBody.querySelector('[data-demo-img]');
    var titleEl = modalBody.querySelector('[data-demo-title]');
    var descEl = modalBody.querySelector('[data-demo-desc]');
    var dots = Array.prototype.slice.call(modalBody.querySelectorAll('[data-demo-dot]'));
    var prevBtn = modalBody.querySelector('[data-demo-prev]');
    var nextBtn = modalBody.querySelector('[data-demo-next]');
    var playBtn = modalBody.querySelector('[data-demo-toggle]');
    if (!imgEl || !slides || !slides.length) return;

    var idx = 0;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var playing = !reduced;

    function show(n) {
      idx = (n + slides.length) % slides.length;
      var s = slides[idx];
      imgEl.src = s.src;
      imgEl.alt = s.title + ': ' + s.desc;
      if (titleEl) titleEl.textContent = s.title;
      if (descEl) descEl.textContent = s.desc;
      dots.forEach(function (d, di) {
        d.classList.toggle('is-active', di === idx);
        d.setAttribute('aria-current', di === idx ? 'true' : 'false');
      });
    }

    function syncPlayBtn() {
      if (playBtn) playBtn.textContent = playing ? 'Pause Demo' : 'Play Demo';
    }

    function startLoop() {
      stopDemoTimer();
      if (playing) {
        demoTimer = setInterval(function () { show(idx + 1); }, 3600);
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { show(idx - 1); startLoop(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { show(idx + 1); startLoop(); });
    dots.forEach(function (d, di) {
      d.addEventListener('click', function () { show(di); startLoop(); });
    });
    if (playBtn) {
      playBtn.addEventListener('click', function () {
        playing = !playing;
        syncPlayBtn();
        startLoop();
      });
    }

    show(0);
    syncPlayBtn();
    startLoop();
  }

  function renderListSection(title, items) {
    if (!items || !items.length) return '';
    var out = '<section class="cs-block"><h3 class="cs-block__title">' + title + '</h3><ul class="dialog__bullets">';
    items.forEach(function (entry) {
      out += '<li>' + entry + '</li>';
    });
    out += '</ul></section>';
    return out;
  }

  function renderCaseStudy(item) {
    var html = '';
    if (item.subtitle) {
      html += '<p class="cs-subtitle">' + item.subtitle + '</p>';
    }

    if (item.demoSlides && item.demoSlides.length) {
      var first = item.demoSlides[0];
      html += '<div class="demo-player">' +
        '<div class="demo-player__stage">' +
        '<img data-demo-img src="' + first.src + '" alt="' + first.title + '">' +
        '<div class="demo-player__caption"><strong data-demo-title>' + first.title + '</strong><span data-demo-desc>' + first.desc + '</span></div>' +
        '</div>' +
        '<div class="demo-player__bar">' +
        '<div class="demo-player__dots">' +
        item.demoSlides.map(function (s, i) {
          return '<button type="button" class="demo-dot' + (i === 0 ? ' is-active' : '') + '" data-demo-dot aria-label="Show slide ' + (i + 1) + '"></button>';
        }).join('') +
        '</div>' +
        '<div class="demo-player__btns">' +
        '<button type="button" class="pill-btn" data-demo-prev>← Prev</button>' +
        '<button type="button" class="pill-btn" data-demo-toggle>Pause Demo</button>' +
        '<button type="button" class="pill-btn" data-demo-next>Next →</button>' +
        '</div>' +
        '</div>' +
        '</div>';
    } else if (item.image) {
      html += '<div class="dialog__hero"><img src="' + item.image + '" alt="' + (item.alt || item.title) + '"></div>';
    }

    if (item.meta && item.meta.length) {
      html += '<div class="dialog__meta-grid">';
      item.meta.forEach(function (m) {
        html += '<div class="dialog__meta-box"><span>' + m.label + '</span><strong>' + m.value + '</strong></div>';
      });
      html += '</div>';
    }

    if (item.overview) {
      html += '<section class="cs-block"><h3 class="cs-block__title">Overview</h3><p class="cs-copy">' + item.overview + '</p></section>';
    }

    if (item.problem || item.solution) {
      html += '<div class="cs-two-col">';
      if (item.problem) {
        html += '<section class="cs-callout"><h3 class="cs-block__title">Problem</h3><p class="cs-copy">' + item.problem + '</p></section>';
      }
      if (item.solution) {
        html += '<section class="cs-callout cs-callout--accent"><h3 class="cs-block__title">Solution</h3><p class="cs-copy">' + item.solution + '</p></section>';
      }
      html += '</div>';
    }

    if (item.role) {
      html += '<section class="cs-block"><h3 class="cs-block__title">My Role</h3><p class="cs-copy">' + item.role + '</p></section>';
    }

    if (item.stack && item.stack.length) {
      html += '<section class="cs-block"><h3 class="cs-block__title">Technology Stack</h3><div class="tag-row">';
      item.stack.forEach(function (tech) {
        html += '<span class="tag tag--bright">' + tech + '</span>';
      });
      html += '</div></section>';
    }

    if (item.architecture && item.architecture.steps && item.architecture.steps.length) {
      html += '<section class="cs-block"><h3 class="cs-block__title">System Architecture</h3>';
      if (item.architecture.summary) {
        html += '<p class="cs-copy">' + item.architecture.summary + '</p>';
      }
      html += '<ol class="arch-flow">';
      item.architecture.steps.forEach(function (step) {
        html += '<li class="arch-node"><strong>' + step.label + '</strong><span>' + step.detail + '</span></li>';
      });
      html += '</ol></section>';
    }

    html += renderListSection('Engineering Challenges', item.challenges);
    html += renderListSection('Key Implementation Decisions', item.decisions);
    html += renderListSection('Limitations & Future Improvements', item.limitations);

    if (item.links && item.links.length) {
      html += '<div class="dialog__actions">';
      item.links.forEach(function (lnk) {
        var cls = lnk.primary ? 'btn btn--primary' : 'btn btn--ghost';
        html += '<a class="' + cls + '" href="' + lnk.href + '" target="_blank" rel="noopener noreferrer">' + lnk.label + '</a>';
      });
      html += '</div>';
    }

    return html;
  }

  function renderCertDetail(item) {
    var html = '';
    if (item.image) {
      html += '<div class="dialog__hero"><img src="' + item.image + '" alt="' + (item.alt || item.title) + '"></div>';
    }
    if (item.summary) {
      html += '<p class="cs-copy">' + item.summary + '</p>';
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
    return html;
  }

  function openDetail(item) {
    if (!dialog || !item) return;
    stopDemoTimer();
    modalKicker.textContent = item.kicker || '';
    modalTitle.textContent = item.title || '';

    modalBody.innerHTML = item.type === 'case-study'
      ? renderCaseStudy(item)
      : renderCertDetail(item);

    modalBody.scrollTop = 0;
    if (item.demoSlides && item.demoSlides.length) wireDemoPlayer(item.demoSlides);
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
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', function () {
      var orig = copyEmailBtn.textContent;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText('rushirajdabhi16@gmail.com').then(function () {
          copyEmailBtn.textContent = 'Copied Email!';
          setTimeout(function () { copyEmailBtn.textContent = orig; }, 2000);
        });
      } else {
        window.location.href = 'mailto:rushirajdabhi16@gmail.com';
      }
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

      // Honeypot check against bots
      if (contactForm.elements._honey && contactForm.elements._honey.value) {
        return;
      }

      var nameVal = contactForm.elements.name.value.trim();
      var emailVal = contactForm.elements.email.value.trim();
      var msgVal = contactForm.elements.message.value.trim();
      var submitBtn = contactForm.querySelector('[data-submit-btn]');

      var subject = encodeURIComponent('Portfolio Inquiry from ' + nameVal);
      var body = encodeURIComponent('Hi Rushi,\n\n' + msgVal + '\n\nFrom: ' + nameVal + ' (' + emailVal + ')');
      var mailtoHref = 'mailto:rushirajdabhi16@gmail.com?subject=' + subject + '&body=' + body;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }
      if (formStatus) {
        formStatus.hidden = false;
        formStatus.classList.remove('form-status--warn');
        formStatus.textContent = 'Sending your message via FormSubmit...';
      }

      fetch('https://formsubmit.co/ajax/rushirajdabhi16@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: nameVal,
          email: emailVal,
          message: msgVal,
          _subject: 'New Portfolio Message from ' + nameVal,
          _template: 'table'
        })
      })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        })
        .then(function (data) {
          if (data && (data.success === false || data.success === 'false')) {
            throw new Error(data.message || 'Relay requires activation');
          }
          if (formStatus) {
            formStatus.hidden = false;
            formStatus.classList.remove('form-status--warn');
            formStatus.innerHTML = 'Message sent to <strong>rushirajdabhi16@gmail.com</strong>. Thanks for reaching out!';
          }
          announcer.textContent = 'Message sent directly to Rushi.';
          contactForm.reset();
          contactForm.querySelectorAll('input, textarea').forEach(function (el) {
            el.classList.remove('user-invalid-fallback', 'user-valid-fallback');
            syncField(el, false);
          });
        })
        .catch(function () {
          if (formStatus) {
            formStatus.hidden = false;
            formStatus.classList.add('form-status--warn');
            formStatus.innerHTML = 'Form relay is currently unavailable. <a href="' + mailtoHref + '" style="text-decoration:underline;color:#ffffff;font-weight:700;">Send directly via Email App ↗</a>';
          }
          announcer.textContent = 'Form relay unavailable. Use the email app link to send your message.';
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message →';
          }
        });
    });
  }
})();
