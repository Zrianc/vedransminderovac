// Izbornik na mobitelu, zaštita slika i povećani prikaz (lightbox)
(function () {
  // ----- Izbornik -----
  var gumb = document.querySelector('.izbornik-gumb');
  if (gumb) {
    gumb.addEventListener('click', function () {
      var otvoren = document.body.classList.toggle('izbornik-otvoren');
      gumb.setAttribute('aria-expanded', otvoren);
    });
  }

  // ----- Zaštita: bez desnog klika, povlačenja i Ctrl+S na slikama -----
  function blokiraj(e) {
    if (e.target.closest && e.target.closest('.galerija, .mozaik, .lightbox, .zasticeno')) e.preventDefault();
  }
  document.addEventListener('contextmenu', blokiraj);
  document.addEventListener('dragstart', blokiraj);
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) e.preventDefault();
  });

  // ----- Lightbox (koristi ga i mreža i mozaik: window.Lightbox.otvori(popis, i)) -----
  var lb, img, brojac, popis = [], trenutna = 0;

  function izgradi() {
    lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML =
      '<span class="lb-okvir"><img alt=""></span>' +
      '<button class="lb-zatvori" aria-label="×">×</button>' +
      '<button class="lb-prethodna" aria-label="←">←</button>' +
      '<button class="lb-sljedeca" aria-label="→">→</button>' +
      '<div class="lb-brojac"></div>';
    document.body.appendChild(lb);

    var zig = document.body.getAttribute('data-zig');
    if (zig) lb.querySelector('.lb-okvir').setAttribute('data-zig', zig);

    img = lb.querySelector('img');
    brojac = lb.querySelector('.lb-brojac');

    lb.querySelector('.lb-zatvori').addEventListener('click', zatvori);
    lb.querySelector('.lb-prethodna').addEventListener('click', function () { prikazi(trenutna - 1); });
    lb.querySelector('.lb-sljedeca').addEventListener('click', function () { prikazi(trenutna + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) zatvori(); });

    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('otvoren')) return;
      if (e.key === 'Escape') zatvori();
      if (e.key === 'ArrowLeft') prikazi(trenutna - 1);
      if (e.key === 'ArrowRight') prikazi(trenutna + 1);
    });

    var startX = null;
    lb.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) prikazi(trenutna + (dx < 0 ? 1 : -1));
      startX = null;
    });
  }

  function prikazi(i) {
    trenutna = (i + popis.length) % popis.length;
    img.src = popis[trenutna].src;
    img.alt = popis[trenutna].alt || '';
    brojac.textContent = (trenutna + 1) + ' / ' + popis.length;
  }
  function otvori(p, i) {
    if (!lb) izgradi();
    popis = p;
    prikazi(i);
    lb.classList.add('otvoren');
    document.body.style.overflow = 'hidden';
    document.dispatchEvent(new Event('lightbox-otvoren'));
  }
  function zatvori() {
    lb.classList.remove('otvoren');
    document.body.style.overflow = '';
    document.dispatchEvent(new Event('lightbox-zatvoren'));
  }

  window.Lightbox = { otvori: otvori };

  // ----- Mreža (galerija_nacin: "mreza") -----
  var plocice = Array.prototype.slice.call(document.querySelectorAll('.galerija .slika'));
  var mrezaPopis = plocice.map(function (a) {
    return { src: a.dataset.src, alt: a.querySelector('img').alt };
  });
  plocice.forEach(function (a, i) {
    a.addEventListener('click', function (e) { e.preventDefault(); otvori(mrezaPopis, i); });
    a.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); otvori(mrezaPopis, i); }
    });
  });
})();
