/* Dentomate: shared scripts for sub/inner pages */
(function () {
  // Nav scroll shadow
  var nav = document.getElementById('site-nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Mobile hamburger
  var burger = document.getElementById('nav-hamburger');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', open);
      // Rebuild the <i> rather than re-attributing it: Lucide swaps the element
      // for an <svg> and drops data-lucide, which would break the next toggle.
      burger.innerHTML = '<i data-lucide="' + (open ? 'x' : 'menu') + '"></i>';
      if (window.lucide) window.lucide.createIcons();
    });
    nav.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('nav-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Cross-domain auth: if already signed in on .dentomate.in, surface a "Go to app" hint
  try {
    if (/(?:^|;\s*)dm_auth=1/.test(document.cookie)) {
      document.querySelectorAll('[data-auth-signin]').forEach(function (el) {
        el.textContent = 'Open app';
        el.setAttribute('href', 'https://app.dentomate.in/select_clinic');
      });
    }
  } catch (e) {}

  // Returning customers: the nav CTA sells a signup to someone who already has an
  // account, and there is no other way in from this site. dm_seen outlives logout,
  // so it is the only signal that tells a returning customer from a new visitor.
  // Guarded on !dm_auth so someone still signed in is not told to sign in again.
  try {
    var seen = /(?:^|;\s*)dm_seen=1/.test(document.cookie);
    var live = /(?:^|;\s*)dm_auth=1/.test(document.cookie);
    if (seen && !live) {
      var nav = document.getElementById('site-nav');
      if (nav) {
        nav.querySelectorAll('a[href*="/signup"]').forEach(function (el) {
          // Keep the mobile item's arrow; it is a list row, not a button.
          el.textContent = el.classList.contains('nav-cta-mobile') ? 'Sign in \u2192' : 'Sign in';
          el.setAttribute('href', 'https://app.dentomate.in/?signin=1');
        });
      }
    }
  } catch (e) {}

  // Inline glossary: click a dotted term to open its definition, click away or
  // press Escape to close. Click rather than hover so it works on touch too.
  (function () {
    function close(t) {
      t.setAttribute('aria-expanded', 'false');
      document.getElementById(t.getAttribute('aria-controls')).hidden = true;
    }
    function openOnes() {
      return document.querySelectorAll('.define-t[aria-expanded="true"]');
    }
    // The term can sit anywhere in a line, so nudge the box back inside the
    // text column once it is measurable rather than guessing an anchor side.
    // Clamped to .prose, since that is where the article text lives.
    function fit(box) {
      box.style.left = '0px';
      var col = box.closest('.prose');
      if (!col) return;
      var c = col.getBoundingClientRect(), r = box.getBoundingClientRect(), dx = 0;
      if (r.right > c.right) dx = c.right - r.right;
      if (r.left + dx < c.left) dx = c.left - r.left;
      box.style.left = dx + 'px';
    }
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('.define-t') : null;
      Array.prototype.forEach.call(openOnes(), function (o) { if (o !== t) close(o); });
      if (!t) return;
      var box = document.getElementById(t.getAttribute('aria-controls'));
      var isOpen = t.getAttribute('aria-expanded') === 'true';
      t.setAttribute('aria-expanded', String(!isOpen));
      box.hidden = isOpen;
      if (!isOpen) fit(box);
    });
    addEventListener('resize', function () {
      Array.prototype.forEach.call(openOnes(), function (t) {
        fit(document.getElementById(t.getAttribute('aria-controls')));
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      Array.prototype.forEach.call(openOnes(), function (t) { close(t); t.focus(); });
    });
  })();

  // Lucide icons: mirrors the app/homepage loader. Guarded so pages that
  // haven't yet added the Lucide <script> (pre-Phase-2) degrade gracefully.
  function renderIcons() { if (window.lucide) window.lucide.createIcons(); }
  renderIcons();
  var iconTimer;
  new MutationObserver(function () {
    clearTimeout(iconTimer);
    iconTimer = setTimeout(renderIcons, 150);
  }).observe(document.body, { childList: true, subtree: true });
})();
