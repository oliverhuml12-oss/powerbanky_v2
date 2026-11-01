# powerbanky.eu (V2)

Website for powerbanky.eu, a charging-station rental for partner venues (cafés, restaurants, bars). The station is free, and revenue is split 50/50 with the venue (~100 Kč average per rental).

## Status
Main page built on direction A (white, near-black, brand green; Montserrat headlines, Schibsted Grotesk body).
Sections: hero (station photo), locations (social proof marquee), how it works + earnings calculator, station, benefits, founders, FAQ, contact form, footer.

The earlier three hero variants are archived in `designs/hero-varianty/` (open its `index.html`).

### Open TODOs
- Location photos: 4 of ~10 are in `assets/img/mista/`. Add the rest as `<li class="place">` in the first list of `#mista` and in the two `aria-hidden` copies (empty alt there). With 8+ photos one copy can go: delete the third list and set the keyframe back to `-50%`.
- Real logo as SVG (header and footer currently use a placeholder wordmark).

## Contact form → Supabase
Enquiries are stored in Supabase project **powerbanky.eu** (`rtrwsimsuangnatzubpx`, eu-central-1), table `public.poptavky`
(jmeno, podnik, telefon, email, zprava, zdroj, vyrizeno, created_at). View them in the Supabase dashboard → Table Editor.

- The site posts directly to the REST API with the publishable key (`script.js`). That key is public by design.
- Row Level Security: the website (anon) can only INSERT; it cannot read, update or delete. Read via dashboard/service role only.
- The database rejects rows without a phone or e-mail, invalid e-mails and oversized fields. A hidden honeypot field drops bot submissions.

## SEO
- Canonical, Open Graph and Twitter tags point to `https://www.powerbanky.eu/`. Share image: `assets/img/og-image.jpg` (1200×630).
- JSON-LD in `index.html`: Organization (founders, logo), WebSite, Service, FAQPage. FAQ schema mirrors the FAQ section; update both together.
- `robots.txt` (blocks `/designs/`), `sitemap.xml` (update `lastmod` when content changes). `/designs/` also sends `noindex` (meta + `vercel.json` header).
- To do outside the repo: domain is live: `powerbanky.eu` and `*.vercel.app` redirect to `www.powerbanky.eu` (primary), verify in Google Search Console and Seznam Webmaster, submit the sitemap.

## Deploy
Plain static site (no build step). On Vercel, import the repo with the framework preset "Other" and no build command; the output directory is the root.
