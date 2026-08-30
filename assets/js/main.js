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
