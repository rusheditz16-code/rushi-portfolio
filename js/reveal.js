/* ==========================================================================
   Editorial Typography Reveals & Hero Brand Wordmark Fitter
   Mirrors the "printed from under a mask" reveal grammar cleanly with zero
   scroll-driven jitter and full reduced-motion accessibility.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var rv = root.classList.contains('rv');
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fitTitle() {
    var el = document.querySelector('[data-fit-title]');
    if (!el) return;
    var parent = el.parentElement;
    var page = document.querySelector('.page');
    var padX = parseFloat(getComputedStyle(page).paddingLeft) * 2 || 40;
    var target = Math.max(260, page.getBoundingClientRect().width - padX);
    parent.style.fontSize = '';
    var currentSize = parseFloat(getComputedStyle(parent).fontSize);
    var measuredWidth = el.getBoundingClientRect().width;
    if (measuredWidth > 0) {
      var nextSize = currentSize * (target / measuredWidth);
      parent.style.fontSize = Math.min(265, Math.max(48, nextSize)).toFixed(2) + 'px';
    }
  }

  fitTitle();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fitTitle);
  }
  window.addEventListener('resize', fitTitle);

  if (!rv || calm) {
    root.classList.add('rv-all');
    return;
  }

  function make(tag, cls) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    return n;
  }

  function splitChars(node) {
    if (node.dataset.splitDone) return;
    node.dataset.splitDone = '1';
    var raw = node.innerHTML;
    var lines = raw.split(/<br\s*\/?>/i);
    var frag = document.createDocumentFragment();
    var idx = 0;

    node.setAttribute('aria-label', node.textContent.replace(/\s+/g, ' ').trim());

    lines.forEach(function (lineHtml, li) {
      var tmp = document.createElement('span');
      tmp.innerHTML = lineHtml;
      var text = tmp.textContent.replace(/\s+/g, ' ').trim();
      var words = text.split(' ');
      words.forEach(function (word, wi) {
        if (!word) return;
        if (wi > 0) frag.appendChild(document.createTextNode(' '));
        var wd = make('span', 'wd');
        wd.setAttribute('aria-hidden', 'true');
        word.split('').forEach(function (ch) {
          var mask = make('span', 'ch');
          var inner = make('span');
          inner.textContent = ch;
          inner.style.setProperty('--i', idx++);
          mask.appendChild(inner);
          wd.appendChild(mask);
        });
        frag.appendChild(wd);
      });
      if (li < lines.length - 1) frag.appendChild(document.createElement('br'));
    });

    node.innerHTML = '';
    node.appendChild(frag);
  }

  function splitLines(node) {
    if (node.dataset.splitDone) return;
    node.dataset.splitDone = '1';
    var raw = node.innerHTML;
    var lines = raw.split(/<br\s*\/?>/i);
    var frag = document.createDocumentFragment();
    lines.forEach(function (lineHtml, idx) {
      var mask = make('span', 'ln');
      var inner = make('span');
      inner.innerHTML = lineHtml.trim();
      inner.style.setProperty('--i', idx);
      mask.appendChild(inner);
      frag.appendChild(mask);
    });
    node.innerHTML = '';
    node.appendChild(frag);
  }

  function splitRows(node) {
    if (node.dataset.splitDone) return;
    node.dataset.splitDone = '1';
    var children = Array.prototype.slice.call(node.children);
    children.forEach(function (child, idx) {
      var mask = make('span', 'ln');
      var inner = make('span');
      inner.innerHTML = child.innerHTML;
      inner.style.setProperty('--i', idx);
      mask.appendChild(inner);
      child.innerHTML = '';
      child.appendChild(mask);
    });
  }

  var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-rv]'));
  nodes.forEach(function (el) {
    var type = el.dataset.rv;
    if (type === 'chars') splitChars(el);
    else if (type === 'lines') splitLines(el);
    else if (type === 'rows') splitRows(el);
    el.classList.add('rv-item');
  });

  function revealNode(el) {
    if (el.classList.contains('in')) return;
    el.classList.add('in');
    setTimeout(function () {
      el.classList.add('settled');
    }, 1450);
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          revealNode(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    nodes.forEach(function (el) { io.observe(el); });
  } else {
    nodes.forEach(revealNode);
  }

  // Failsafe so nothing can remain masked
  setTimeout(function () {
    root.classList.add('rv-all');
    nodes.forEach(revealNode);
  }, 2600);
})();
