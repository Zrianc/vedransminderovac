// Izbornik na mobitelu + povećavanje slika (lightbox)
(function () {
  // ----- Izbornik -----
  var gumb = document.querySelector('.izbornik-gumb');
  if (gumb) {
    gumb.addEventListener('click', function () {
      var otvoren = document.body.classList.toggle('izbornik-otvoren');
      gumb.setAttribute('aria-expanded', otvoren);
    });
  }

  // ----- Lightbox -----
  var linkovi = Array.prototype.slice.call(document.querySelectorAll('.galerija .slika'));
  if (!linkovi.length) return;

  var lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.innerHTML =
    '<span class="lb-okvir"><img alt=""></span>' +
    '<button class="lb-zatvori" aria-label="Zatvori">×</button>' +
    '<button class="lb-prethodna" aria-label="Prethodna">←</button>' +
    '<button class="lb-sljedeca" aria-label="Sljedeća">→</button>' +
    '<div class="lb-brojac"></div>';
  document.body.appendChild(lb);

  var zig = document.body.getAttribute('data-zig');
  if (zig) lb.querySelector('.lb-okvir').setAttribute('data-zig', zig);

  var img = lb.querySelector('img');
  var brojac = lb.querySelector('.lb-brojac');
  var trenutna = 0;

  function prikazi(i) {
    trenutna = (i + linkovi.length) % linkovi.length;
    img.src = linkovi[trenutna].dataset.src;
    img.alt = linkovi[trenutna].querySelector('img').alt;
    brojac.textContent = (trenutna + 1) + ' / ' + linkovi.length;
  }
  function otvori(i) {
    prikazi(i);
    lb.classList.add('otvoren');
    document.body.style.overflow = 'hidden';
  }
  function zatvori() {
    lb.classList.remove('otvoren');
    document.body.style.overflow = '';
  }

  linkovi.forEach(function (a, i) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      otvori(i);
    });
    a.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); otvori(i); }
    });
  });

  // ----- Zaštita: bez desnog klika, povlačenja i Ctrl+S na slikama -----
  function blokiraj(e) {
    if (e.target.closest && e.target.closest('.galerija, .lightbox')) e.preventDefault();
  }
  document.addEventListener('contextmenu', blokiraj);
  document.addEventListener('dragstart', blokiraj);
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) e.preventDefault();
  });

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

  // Povlačenje prstom na mobitelu
  var startX = null;
  lb.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) prikazi(trenutna + (dx < 0 ? 1 : -1));
    startX = null;
  });
})();
