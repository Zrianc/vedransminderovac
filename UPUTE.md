# Upute — stranica Vedran Sminderovac (GitHub Pages)

## Što je gdje

| Stranica | HR adresa | EN adresa | Tekst se mijenja u | Slike idu u mapu |
|---|---|---|---|---|
| Početna | `/` | `/en/` | `index.md` · `en/index.md` | `slika-naslovna` (1 slika) |
| Crno-bijelo | `/crno-bijelo/` | `/en/black-and-white/` | — | `slike-crno-bijelo` |
| Boja | `/boja/` | `/en/colour/` | — | `slike-boja` |
| Info | `/info/` | `/en/info/` | `info.md` · `en/info.md` | `slika-info` (1 slika, nije obavezna) |
| Kontakt | `/kontakt/` | `/en/contact/` | `kontakt.md` · `en/contact.md` | — |

Obje jezične verzije koriste **iste slike** — ubaciš ih jednom.

## 1. Prvo postavljanje (jednom)

1. Na https://github.com klikni **New repository** → ime npr. `web` · **Public** · **Create repository**.
2. Klikni **uploading an existing file** i povuci u prozor **sve što je unutar mape `web-stranica`**
   (ne samu mapu) → **Commit changes**. Mape koje počinju s `_` moraju biti tu (`_config.yml`, `_data`, `_includes`, `_layouts`).
3. **Settings → Pages** → *Branch*: `main` i `/ (root)` → **Save**.
4. Za 1–2 minute stranica je na `https://KORISNICKO-IME.github.io/web/`.

## 2. Dodavanje slika (ovo ćeš raditi najčešće)

1. Otvori mapu (vidi tablicu gore) → **Add file → Upload files** → povuci slike → **Commit changes**.
2. Za minutu-dvije slike su na stranici.

- **Početna i Info** prikazuju samo **prvu** sliku iz svoje mape (po imenu). Za promjenu: obriši staru, ubaci novu.
  Ako mapu `slika-info` ostaviš praznu, Info stranica je samo tekst.
- **Brisanje:** klikni na sliku → `…` gore desno → **Delete file**.
- **Redoslijed u galeriji:** abecedno po imenu datoteke — imenuj ih `01-...jpg`, `02-...jpg`…
  U `crno-bijelo.md` / `boja.md` možeš staviti `redoslijed: obrnuto`.
- **Veličina:** JPG, duža stranica ~2000 px, kvaliteta ~82 %, sRGB.
- Testne slike (`test-…`) obriši kad ubaciš prave.

## Galerije: mozaik

Na stranicama **Crno-bijelo** i **Boja** na ekranu je odjednom 10 slika (bez scrollanja),
a svakih 5 sekundi jedna se polako pretopi (fade) u drugu iz mape — tako se izmijene sve slike.
Klik na sliku otvara je cijelu, preko cijelog ekrana (strelice / povlačenje prstom za ostale).
Kad je miš na slici, ta se slika ne mijenja.

Slike se prikazuju **cijele, u svom formatu** (bez rezanja).
**Ista slika nikad nije dvaput na ekranu:** slike koje nisu prikazane čekaju u redu i ulaze redom,
a slika koja izađe ide na kraj reda. Zato je dobro da u mapi bude više slika nego što ih stane na ekran
(npr. 20 slika za 10 mjesta). Ako je slika u mapi manje ili jednako `mozaik_broj`, sve su na ekranu i ništa se ne mijenja.

Postavke u `_config.yml`:
- `mozaik_broj: 10` — koliko slika je odjednom na ekranu
- `mozaik_sekunde: 5` — svakih koliko sekundi se jedna slika zamijeni (veće = sporije)
- `mozaik_fade: 2.5` — koliko sekundi stara slika nestaje
- `mozaik_pojava: 4` — koliko sekundi se nova slika pojavljuje
- `galerija_nacin: "mreza"` — vraća klasičnu galeriju (sve slike, scroll)

## 3. Tekstovi

- **Početna, Info, Kontakt:** otvori `.md` datoteku (HR u glavnoj mapi, EN u mapi `en`) → olovka **Edit** → piši.
  Prazan red = novi odlomak · `**podebljano**` · `*kurziv*` · `## Podnaslov` · `- stavka popisa`.
- **Izbornik** (nazivi stranica, HR i EN): `_data/izbornik.yml`
- **Sitni natpisi** („fotograf“ / „photographer“, natpisi u formi, poruke): `_data/tekstovi.yml`
- **Ime, Instagram, e-mail forme, font:** `_config.yml`

## 4. Font

Font imena je **Bebas Neue** (Google Fonts, besplatan). Postavlja se u `_config.yml`:

```
font_naslovi: "Bebas Neue"
font_link: "https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
```

Veličina i razmak slova imena: `assets/stil.css`, dio `.logo-ime` (`font-size`, `letter-spacing`).

Za povratak na Helveticu: `font_naslovi: "Helvetica Neue"` i `font_link: ""`.

## 5. Spajanje domene (Spaceship)

1. GitHub: **Settings → Pages → Custom domain** → upiši domenu (bez `www`) → **Save**.
2. Spaceship → domena → **DNS records**: obriši postojeće zapise za `@` i `www`, pa dodaj:
   - 4 × **A**, host `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - **CNAME**, host `www` → `KORISNICKO-IME.github.io`
3. Kad GitHub pokaže zelenu kvačicu, uključi **Enforce HTTPS**.

## 6. Forma za kontakt

Poruke stižu na adresu iz `forma_email` u `_config.yml` preko servisa FormSubmit.
Prva poruka pokreće aktivaciju: vlasniku stiže mail „Activate Form“ — klikne link **iz najnovijeg** maila, jednom.

## 7. Zaštita slika i vodeni žig

Desni klik, povlačenje, dugi pritisak na mobitelu i Ctrl+S su onemogućeni na svim slikama.
Screenshot uvijek radi — zato na stranicu idu smanjene slike, a originali ostaju kod autora.
Vodeni žig: `vodeni_zig: "© Vedran Sminderovac"` u `_config.yml` (prazno `""` = bez žiga).

## 8. Boje i razmaci

Na vrhu `assets/stil.css` (dio `:root`): boje, `--razmak` između slika (48px), širina stranice.
