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

  // Raspored: vodoravni ekran = 2 reda, uspravni (mobitel) = 2 stupca
  function raspored() {
    var vodoravno = window.innerWidth >= window.innerHeight * 0.9;
    var stupci = vodoravno ? Math.ceil(k / 2) : 2;
    var redovi = Math.ceil(k / stupci);
    mreza.style.setProperty('--stupci', stupci);
    mreza.style.setProperty('--redovi', redovi);
    var vrh = mz.getBoundingClientRect().top + window.scrollY;
    mz.style.height = Math.max(320, window.innerHeight - vrh - 28) + 'px';
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
