/* The Hermes Cookbook — navigation, search, theme, copy buttons.
   The whole site is static; this script only builds the sidebar and pager
   from the chapter manifest so the markup in each chapter stays clean. */

(function () {
  'use strict';

  var CHAPTERS = [
    { n: '1',  file: 'chapters/01-getting-started.html',         title: 'Getting started',            blurb: 'A working bot in five minutes' },
    { n: '2',  file: 'chapters/02-polling-and-webhooks.html',    title: 'Polling and webhooks',       blurb: 'Two ways to receive updates, and when each is right' },
    { n: '3',  file: 'chapters/03-the-context.html',             title: 'The context',                blurb: 'The one object every handler receives' },
    { n: '4',  file: 'chapters/04-keyboards.html',               title: 'Keyboards and buttons',      blurb: 'Inline keyboards, reply keyboards, and the 64-byte rule' },
    { n: '5',  file: 'chapters/05-typed-callbacks.html',         title: 'Typed callbacks',            blurb: 'Stop parsing callback data with strings.Split' },
    { n: '6',  file: 'chapters/06-filters-groups-middleware.html', title: 'Filters, groups, middleware', blurb: 'Routing beyond exact commands' },
    { n: '7',  file: 'chapters/07-sessions.html',                title: 'Sessions',                   blurb: 'Remembering things between updates' },
    { n: '8',  file: 'chapters/08-state-machines.html',          title: 'State machines',             blurb: 'Conversations that stay readable as they grow' },
    { n: '9',  file: 'chapters/09-files-and-media.html',         title: 'Files and media',            blurb: 'Photos, documents, and streaming uploads' },
    { n: '10', file: 'chapters/10-ephemeral-messages.html',      title: 'Ephemeral messages',         blurb: 'Answers only one user can see' },
    { n: '11', file: 'chapters/11-production-hardening.html',    title: 'Production hardening',       blurb: 'Rate limits, deduplication, errors, observability' },
    { n: '12', file: 'chapters/12-testing-with-hermes-lab.html', title: 'Testing with Hermes Lab',    blurb: 'Full bot tests without touching Telegram' },
    { n: '13', file: 'chapters/13-fleets.html',                  title: 'Running a fleet',            blurb: 'Many bots, one process, one lifecycle' }
  ];

  var inChapter = location.pathname.indexOf('/chapters/') !== -1;
  var root = inChapter ? '../' : '';
  var current = location.pathname.split('/').pop() || 'index.html';

  /* ---------- sidebar ---------- */

  var nav = document.querySelector('nav.toc ol');
  if (nav) {
    var home = document.createElement('li');
    home.className = 'nav-home';
    home.innerHTML = '<a href="' + root + 'index.html">Start here</a>';
    nav.appendChild(home);
    CHAPTERS.forEach(function (ch) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = root + ch.file;
      a.innerHTML = '<span class="n">' + ch.n + '.</span>' + ch.title;
      if (ch.file.split('/').pop() === current) a.className = 'active';
      li.appendChild(a);
      nav.appendChild(li);
    });
    var homeLink = home.firstChild;
    if (current === 'index.html' && !inChapter) homeLink.className = 'active';
  }

  /* ---------- prev / next pager ---------- */

  var pager = document.querySelector('.pager');
  if (pager) {
    var idx = -1;
    for (var i = 0; i < CHAPTERS.length; i++) {
      if (CHAPTERS[i].file.split('/').pop() === current) { idx = i; break; }
    }
    var prevHTML = '<span class="spacer">·</span>';
    var nextHTML = '<span class="spacer">·</span>';
    if (idx > 0) {
      prevHTML = '<a href="' + CHAPTERS[idx - 1].file.split('/').pop() + '"><span class="dir">← Previous</span><span class="t">' +
        CHAPTERS[idx - 1].n + '. ' + CHAPTERS[idx - 1].title + '</span></a>';
    } else if (idx === 0) {
      prevHTML = '<a href="../index.html"><span class="dir">← Previous</span><span class="t">Start here</span></a>';
    }
    if (idx !== -1 && idx < CHAPTERS.length - 1) {
      nextHTML = '<a class="next" href="' + CHAPTERS[idx + 1].file.split('/').pop() + '"><span class="dir">Next →</span><span class="t">' +
        CHAPTERS[idx + 1].n + '. ' + CHAPTERS[idx + 1].title + '</span></a>';
    }
    pager.innerHTML = '<div>' + prevHTML + '</div><div>' + nextHTML + '</div>';
  }

  /* ---------- landing chapter list ---------- */

  var list = document.querySelector('.chapters');
  if (list) {
    CHAPTERS.forEach(function (ch) {
      var a = document.createElement('a');
      a.className = 'ch';
      a.href = ch.file;
      a.innerHTML = '<span class="num">' + ch.n + '</span><span class="name">' + ch.title + '</span>' +
        '<span class="blurb">' + ch.blurb + '</span>';
      list.appendChild(a);
    });
  }

  /* ---------- sidebar footer (chapter pages get it from here) ---------- */

  var tocWrap = document.querySelector('nav.toc');
  if (tocWrap && !tocWrap.querySelector('.toc-foot')) {
    var foot = document.createElement('div');
    foot.className = 'toc-foot';
    foot.innerHTML = 'MIT licensed — corrections welcome in the ' +
      '<a href="https://github.com/sidwiskers/hermes-cookbook">repo</a>.<br>' +
      'Full API reference on ' +
      '<a href="https://pkg.go.dev/github.com/sidwiskers/hermes">pkg.go.dev</a>.';
    tocWrap.appendChild(foot);
  }

  /* ---------- search filters the sidebar ---------- */

  var q = document.getElementById('q');
  if (q && nav) {
    q.addEventListener('input', function () {
      var needle = q.value.trim().toLowerCase();
      var items = nav.querySelectorAll('li');
      for (var i = 0; i < items.length; i++) {
        var text = items[i].textContent.toLowerCase();
        items[i].classList.toggle('hidden', needle !== '' && text.indexOf(needle) === -1);
      }
    });
  }

  /* ---------- theme ---------- */

  var saved = null;
  try { saved = localStorage.getItem('cookbook-theme'); } catch (e) {}
  if (saved === 'dark' || saved === 'light') {
    document.documentElement.setAttribute('data-theme', saved);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  var themeBtn = document.getElementById('theme');
  if (themeBtn) {
    var paint = function () {
      themeBtn.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? 'Light' : 'Dark';
    };
    paint();
    themeBtn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('cookbook-theme', next); } catch (e) {}
      paint();
    });
  }

  /* ---------- mobile menu ---------- */

  var toggle = document.getElementById('menuToggle');
  var sidebar = document.querySelector('nav.toc');
  if (toggle && sidebar) {
    toggle.addEventListener('click', function () { sidebar.classList.toggle('open'); });
    sidebar.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') sidebar.classList.remove('open');
    });
  }

  /* ---------- syntax highlighting (hand-rolled; Go only, no library) ---------- */

  var GO_TOKEN = /(\/\/[^\n]*)|(\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|`[^`]*`|'(?:\\.|[^'\\\n])')|\b(package|import|const|var|type|func|return|if|else|for|range|switch|case|default|select|go|defer|struct|interface|map|chan|break|continue|fallthrough|goto|nil|true|false|iota)\b|\b(string|bool|error|any|byte|rune|uintptr|int|int8|int16|int32|int64|uint|uint8|uint16|uint32|uint64|float32|float64|complex64|complex128)\b|\b(\d[\d_]*(?:\.[\d_]+)?)\b/g;

  function escHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function highlightGo(src) {
    GO_TOKEN.lastIndex = 0;
    var out = '';
    var last = 0;
    var m;
    while ((m = GO_TOKEN.exec(src)) !== null) {
      out += escHTML(src.slice(last, m.index));
      var cls = (m[1] || m[2]) ? 'c' : m[3] ? 's' : m[4] ? 'k' : m[5] ? 't' : 'n';
      out += '<span class="tok-' + cls + '">' + escHTML(m[0]) + '</span>';
      last = m.index + m[0].length;
    }
    return out + escHTML(src.slice(last));
  }

  document.querySelectorAll('pre code').forEach(function (code) {
    var text = code.textContent;
    // Shell snippets stay monochrome; the first token gives them away.
    if (/^(mkdir\b|python3\b|go (get|mod|run|test|build) |[A-Z_]+=)/.test(text.replace(/^\s+/, ''))) return;
    code.innerHTML = highlightGo(text);
  });

  /* ---------- copy buttons ---------- */

  document.querySelectorAll('pre').forEach(function (pre) {
    if (pre.querySelector('.file-tab')) pre.classList.add('has-tab');
    var btn = document.createElement('button');
    btn.className = 'copy';
    btn.type = 'button';
    btn.textContent = 'Copy';
    btn.addEventListener('click', function () {
      var code = pre.querySelector('code');
      var text = code ? code.innerText : pre.innerText;
      var done = function () { btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = 'Copy'; }, 1400); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta);
        done();
      }
    });
    pre.appendChild(btn);
  });
})();
