# powerbanky.eu (V2)

Website for powerbanky.eu, a charging-station rental for partner venues (cafés, restaurants, bars). The station is free, and revenue is split 50/50 with the venue (~100 Kč average per rental).

## Status
Main page built on direction A (white, warm black, brand green; Montserrat headlines, Schibsted Grotesk body).
Sections: hero with earnings calculator, station, how it works, benefits, founders, FAQ, contact form, footer.

The earlier three hero variants are archived in `designs/hero-varianty/` (open its `index.html`).

### Open TODOs
- Second founder: name and photo (`index.html`, section `#kdo-jsme`).
- Contact form: set `FORM_ENDPOINT` in `script.js` (e.g. Formspree) and confirm `CONTACT_EMAIL`. Until then the form opens a pre-filled e-mail.
- Real logo as SVG (header and footer currently use a placeholder wordmark).

## Deploy
Plain static site (no build step). On Vercel, import the repo with the framework preset "Other" and no build command; the output directory is the root.
