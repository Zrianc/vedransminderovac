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

  // Raspored: fotke "razbacane" po ekranu, nasumičnih veličina, bez preklapanja i bez velikih rupa.
  // Svaki put kad se stranica otvori raspored je drugačiji.
  var omjer = 1.5;                                   // okvir fotke (širina / visina) — većina fotki je položena
  var faktori = plocice.map(function () { return 0.75 + Math.random() * 0.55; });   // veličine 75 %–130 %

  function sudara(o, ostali, gap) {
    return ostali.some(function (b) {
      return b !== o && o.x < b.x + b.w + gap && o.x + o.w + gap > b.x && o.y < b.y + b.h + gap && o.y + o.h + gap > b.y;
    });
  }

  function jedanRaspored(W, H, gap, popuna) {
    var baza = Math.sqrt(W * H * popuna / k * omjer);
    var redoslijed = faktori.map(function (f, i) { return i; }).sort(function (a, b) { return faktori[b] - faktori[a]; });
    for (var mjera = 1; mjera > 0.3; mjera *= 0.94) {
      var post = [], ok = true;
      for (var n = 0; n < redoslijed.length && ok; n++) {
        var t = redoslijed[n];
        var w = Math.min(W, baza * faktori[t] * mjera), h = w / omjer;
        if (h > H) { h = H; w = h * omjer; }
        var naj = null;
        for (var p = 0; p < 300; p++) {
          var o = { t: t, x: Math.random() * (W - w), y: Math.random() * (H - h), w: w, h: h };
          if (sudara(o, post, gap)) continue;
          var d = post.reduce(function (m, b) {
            var dx = (o.x + o.w / 2) - (b.x + b.w / 2), dy = (o.y + o.h / 2) - (b.y + b.h / 2);
            return Math.min(m, dx * dx + dy * dy);
          }, Infinity);
          if (!naj || d > naj.d) { naj = o; naj.d = d; }
        }
        if (!naj) ok = false; else post.push(naj);
      }
      if (ok) break;
    }
    // "rast": svaka fotka se malo po malo širi u prazan prostor oko sebe
    for (var krug = 0; krug < 120; krug++) {
      var naraslo = false;
      post.forEach(function (o) {
        // prvo se pokušaj malo pomaknuti prema najbližem praznom prostoru
        var korak = Math.max(4, o.w * 0.04);
        [[korak, 0], [-korak, 0], [0, korak], [0, -korak]].forEach(function (d) {
          var c = { x: Math.max(0, Math.min(W - o.w, o.x + d[0])), y: Math.max(0, Math.min(H - o.h, o.y + d[1])), w: o.w * 1.02, h: o.w * 1.02 / omjer };
          if (c.x + c.w <= W && c.y + c.h <= H && !sudara(c, post.filter(function (b) { return b !== o; }), gap)) {
            o.x = c.x; o.y = c.y; o.w = c.w; o.h = c.h; naraslo = true;
          }
        });
        var nw = o.w * 1.02, nh = nw / omjer;
        var pomaci = [[0.5, 0.5], [0, 0], [1, 0], [0, 1], [1, 1], [0.5, 0], [0.5, 1], [0, 0.5], [1, 0.5]];
        for (var q = 0; q < pomaci.length; q++) {
          var c = { x: o.x - (nw - o.w) * pomaci[q][0], y: o.y - (nh - o.h) * pomaci[q][1], w: nw, h: nh };
          c.x = Math.max(0, Math.min(W - nw, c.x)); c.y = Math.max(0, Math.min(H - nh, c.y));
          if (nw <= W && nh <= H && !sudara(c, post.filter(function (b) { return b !== o; }), gap)) {
            o.x = c.x; o.y = c.y; o.w = nw; o.h = nh; naraslo = true; break;
          }
        }
      });
      if (!naraslo) break;
    }
    post.povrsina = post.reduce(function (s, o) { return s + o.w * o.h; }, 0);
    return post;
  }

  function raspored() {
    var vrh = mz.getBoundingClientRect().top + window.scrollY;
    var H = Math.max(360, window.innerHeight - vrh - 28);
    var W = mz.clientWidth;
    var mob = window.innerWidth < 700;
    var gap = mob ? 10 : 18;
    mz.style.height = H + 'px';
    var najbolji = null;
    for (var pokusaj = 0; pokusaj < 12; pokusaj++) {       // od 12 rasporeda uzmi najpopunjeniji
      var r = jedanRaspored(W, H, gap, mob ? 0.62 : 0.55);
      if (!najbolji || r.povrsina > najbolji.povrsina) najbolji = r;
    }
    najbolji.forEach(function (o) {
      var st = plocice[o.t].style;
      st.left = Math.round(o.x) + 'px'; st.top = Math.round(o.y) + 'px';
      st.width = Math.round(o.w) + 'px'; st.height = Math.round(o.h) + 'px';
    });
  }
  raspored();
  var cekaj; window.addEventListener('resize', function () { clearTimeout(cekaj); cekaj = setTimeout(raspored, 150); });

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
