// Slanje kontakt forme preko FormSubmita (poruke su na jeziku stranice)
(function () {
  var forma = document.querySelector('.forma');
  if (!forma) return;
  var status = forma.querySelector('.forma-status');
  var gumb = forma.querySelector('button');
  var d = forma.dataset;

  function kraj() {
    gumb.disabled = false;
    gumb.textContent = d.gumb;
  }

  forma.addEventListener('submit', function (e) {
    e.preventDefault();
    status.textContent = '';

    if (location.protocol === 'file:') {
      status.textContent = d.lokalno;
      return;
    }

    gumb.disabled = true;
    gumb.textContent = d.saljem;

    var podaci = new FormData(forma);
    if (d.servis === 'web3forms') {
      podaci.set('replyto', podaci.get('email') || '');   // "Odgovori" u mailu ide pošiljatelju
    }

    fetch(d.ajax, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: podaci
    })
      .then(function (r) { return r.json(); })
      .then(function (odg) {
        if (String(odg.success) === 'true') {
          forma.reset();
          status.textContent = d.ok;
          return;
        }
        var poruka = String(odg.message || '');
        status.textContent = /activat/i.test(poruka)
          ? d.aktivacija
          : d.greska + (poruka ? ' (' + poruka + ')' : '');
      })
      .catch(function () { status.textContent = d.mreza; })
      .then(kraj);
  });
})();
