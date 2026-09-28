# Upute — foto stranica na GitHub Pagesu

## 1. Prvo postavljanje (jednom)

1. Napravi račun na https://github.com i klikni **New repository**.
   - Ime: npr. `moja-stranica` · označi **Public** · **Create repository**.
2. Klikni **uploading an existing file**, povuci u prozor SVE datoteke i mape iz ovog paketa
   (`_config.yml`, `_layouts`, `_includes`, `assets`, `slike-crno-bijelo`, `slike-boja`,
   `index.html`, `boja.html`, `informacije.md`, `kontakt.html`) → **Commit changes**.
3. U repozitoriju: **Settings → Pages** → pod *Branch* odaberi `main` i `/ (root)` → **Save**.
4. Za 1–2 minute stranica je na `https://TVOJE-KORISNICKO-IME.github.io/moja-stranica/`.

## 2. Ime, Instagram, e-mail

Otvori `_config.yml` → ikona olovke (**Edit**) → promijeni `naziv`, `opis`, `instagram`, `email` → **Commit changes**.
**Vodeni žig:** u `_config.yml` promijeni `vodeni_zig` (npr. `"© Ana Horvat"`). Prikazuje se u donjem desnom kutu
svake slike, ali samo na stranici — datoteke u mapama ostaju bez žiga. Za isključivanje stavi `vodeni_zig: ""`.

**Zaštita slika:** desni klik, povlačenje, dugi pritisak na mobitelu i Ctrl+S su onemogućeni na slikama.
To odvraća obične posjetitelje, ali screenshot uvijek radi — zato stavljaj smanjene slike (~2000 px), a originale čuvaj kod sebe.

## 3. Dodavanje slika (ovo ćeš raditi najčešće)

Stranica ima dvije galerije, svaka uzima slike iz svoje mape:

| Galerija | Mapa |
|---|---|
| **Crno-bijelo** (početna stranica) | `slike-crno-bijelo` |
| **Boja** | `slike-boja` |

1. Otvori odgovarajuću mapu u repozitoriju.
2. **Add file → Upload files** → povuci slike → **Commit changes**.
3. Za minutu-dvije slike su na stranici. Ništa drugo ne treba dirati.

- **Brisanje slike:** klikni na sliku u mapi → `…` gore desno → **Delete file**.
- **Redoslijed:** slike idu abecedno po imenu datoteke. Ako želiš određeni redoslijed,
  preimenuj ih npr. `01-trg.jpg`, `02-kisa.jpg`… U `index.html` ili `boja.html` možeš staviti `redoslijed: obrnuto`.
- **Veličina:** smanji slike prije uploada na ~2000 px po dužoj strani (inače se sporo učitavaju).
  GitHub prima datoteke do 25 MB kroz preglednik.
- Testne slike (`test-…`) obriši kad ubaciš prave.
- Na mobitelu radi preko aplikacije **GitHub** ili preglednika (verzija za računalo).

## 4. Tekst na stranici "Informacije"

Otvori `informacije.md` → **Edit** → piši. Prazan red = novi odlomak. `**podebljano**`, `## Naslov`.

## 5. Nova galerija (npr. "Printovi")

1. Napravi mapu `slike-printovi` (Add file → Upload files, u polje imena upiši `slike-printovi/` i ubaci slike).
2. **Add file → Create new file**, ime `printovi.html`, sadržaj:

   ```
   ---
   layout: default
   naslov: Printovi
   mapa: slike-printovi
   permalink: /printovi/
   ---
   <h1 class="naslov-stranice">{{ page.naslov }}</h1>
   {% include galerija.html mapa=page.mapa %}
   ```
3. U `_config.yml` pod `izbornik` dodaj:
   ```
     - naslov: "Printovi"
       link: "/printovi/"
   ```

## 6. Spajanje vlastite domene

1. **Settings → Pages → Custom domain** → upiši npr. `mojadomena.com` → **Save**.
2. Kod registrara domene dodaj DNS zapise:
   - 4 × **A** zapis za `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - **CNAME** za `www` → `TVOJE-KORISNICKO-IME.github.io`
3. Kad proradi (do 24 h), uključi **Enforce HTTPS**.

## 7. Forma za kontakt

1. U `_config.yml` upiši svoj e-mail pod `forma_email`.
2. Kad stranica proradi, sam pošalji probnu poruku preko stranice **Kontakt**.
3. Na e-mail ti stiže poruka od **FormSubmit** — klikni **Activate Form**. Od tada sve poruke stižu na tvoj mail
   (provjeri i spam prvi put).
4. Tekst iznad forme mijenjaš u `kontakt.html` (red `uvod:`).

Savjet: u mailu za aktivaciju FormSubmit ti da i nasumični kod (npr. `a1b2c3...`).
Ako ga upišeš u `forma_email` umjesto adrese, tvoj e-mail se neće vidjeti u kodu stranice.

## 8. Boje i izgled

Boje, razmak između slika i font su na vrhu datoteke `assets/stil.css` (dio `:root`).
