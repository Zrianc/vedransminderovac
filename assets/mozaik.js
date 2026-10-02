// Mozaik: X slika na ekranu, jedna po jedna se polako mijenja drugom iz kolekcije
(function () {
  var mz = document.querySelector('.mozaik');
  if (!mz) return;

  var popis = Array.prototype.slice.call(mz.querySelectorAll('.mozaik-popis li')).map(function (li) {
    return { src: li.dataset.src, alt: li.dataset.alt };
  });
  if (!popis.length) return;

  var sekunde = parseFloat(mz.dataset.sekunde) || 5;
  var fade = parseFloat(mz.dataset.fade) || 2.5;      // nestajanje stare
  var pojava = parseFloat(mz.dataset.pojava) || 4;    // pojavljivanje nove
  mz.style.setProperty('--fade', fade + 's');
  mz.style.setProperty('--pojava', pojava + 's');
  var k = Math.min(parseInt(mz.dataset.naEkranu, 10) || 10, popis.length);

  // Pločice
  var mreza = document.createElement('div');
  mreza.className = 'mz-mreza';
  mz.appendChild(mreza);

  var prikazano = [];   // koji indeks iz popisa je na kojoj pločici
  var red = [];         // slike koje trenutno nisu na ekranu (čekaju red)
  var plocice = [];
  var zadnja = -1, pokazivac = -1, tajmer = null, stoji = false;

  for (var i = 0; i < popis.length; i++) (i < k ? prikazano : red).push(i);

  prikazano.forEach(function (idx, t) {
    var p = document.createElement('button');
    p.className = 'mz-plocica';
    p.style.setProperty('--poz', ['center bottom', 'center center', 'center top', 'center 70%', 'center 35%'][t % 5]);
    p.setAttribute('aria-label', popis[idx].alt);
    p.appendChild(slika(idx, true));
    p.addEventListener('click', function () { window.Lightbox && window.Lightbox.otvori(popis, prikazano[t]); });
    p.addEventListener('mouseenter', function () { pokazivac = t; });
    p.addEventListener('mouseleave', function () { pokazivac = -1; });
    mreza.appendChild(p);
    plocice.push(p);
  });

  function slika(idx, vidljiva) {
    var im = document.createElement('img');
    im.src = popis[idx].src;
    im.alt = popis[idx].alt;
    im.draggable = false;
    im.decoding = 'async';
    if (vidljiva) im.className = 'vidljiva';
    return im;
  }

  // Raspored: izračunaj broj stupaca tako da (većinom položene) fotke budu što veće
  var omjer = 1.5;                      // tipičan omjer fotke (širina / visina)
  function raspored() {
    var vrh = mz.getBoundingClientRect().top + window.scrollY;
    var H = Math.max(320, window.innerHeight - vrh - 28);
    var W = mz.clientWidth;
    var gap = window.innerWidth < 700 ? 12 : 28;
    var najbolje = null;
    for (var c = 1; c <= k; c++) {
      var r = Math.ceil(k / c);
      var w = (W - gap * (c - 1)) / c, h = (H - gap * (r - 1)) / r;
      if (w <= 0 || h <= 0) continue;
      var fw = Math.min(w, h * omjer), fh = fw / omjer;      // položena fotka u ćeliji
      var vw = Math.min(h / omjer, w), vh = vw * omjer;      // uspravna fotka u ćeliji
      var ocjena = fw * fh * 0.8 + vw * vh * 0.2;
      if (!najbolje || ocjena > najbolje.ocjena) najbolje = { c: c, r: r, w: w, h: h, ocjena: ocjena };
    }
    mz.style.height = H + 'px';
    mreza.style.setProperty('--gap', gap + 'px');
    mreza.style.setProperty('--sirina-p', Math.floor(najbolje.w) + 'px');
    mreza.style.setProperty('--visina-p', Math.floor(najbolje.h) + 'px');
  }
  raspored();
  window.addEventListener('resize', raspored);

  function zamijeni() {
    if (!red.length) return;
    // nasumična pločica, ali ne ista kao prošli put i ne ona na kojoj je miš
    var t, pokusaji = 0;
    do { t = Math.floor(Math.random() * k); pokusaji++; }
    while ((t === zadnja || t === pokazivac) && pokusaji < 20);
    zadnja = t;

    var nova = red.shift();
    var stara = prikazano[t];
    var p = plocice[t];
    var im = slika(nova, false);

    function pokazi() {
      var staraSlika = p.querySelector('img.vidljiva');
      if (staraSlika) staraSlika.classList.remove('vidljiva');
      prikazano[t] = nova;
      red.push(stara);
      p.setAttribute('aria-label', popis[nova].alt);
      // nova se počne pojavljivati kad je stara već napola nestala
      p.appendChild(im);
      setTimeout(function () {
        requestAnimationFrame(function () { im.classList.add('vidljiva'); });
      }, fade * 600);
      setTimeout(function () { if (staraSlika) staraSlika.remove(); }, fade * 1000 + 300);
    }
    if (im.complete) pokazi(); else { im.onload = pokazi; im.onerror = function () { red.push(nova); }; }
  }

  function kreni() {
    clearInterval(tajmer);
    if (!stoji && red.length) tajmer = setInterval(zamijeni, sekunde * 1000);
  }

  // Pauza dok je otvorena velika slika ili je kartica skrivena
  document.addEventListener('lightbox-otvoren', function () { stoji = true; kreni(); });
  document.addEventListener('lightbox-zatvoren', function () { stoji = false; kreni(); });
  document.addEventListener('visibilitychange', function () { stoji = document.hidden; kreni(); });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  kreni();
})();
