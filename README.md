# powerbanky.eu (V2)

Website for powerbanky.eu, a charging-station rental for partner venues (cafés, restaurants, bars). The station is free, and revenue is split 50/50 with the venue (~100 Kč average per rental).

## Status
Main page built on direction A (white, near-black, brand green; Montserrat headlines, Schibsted Grotesk body).
Sections: hero (station photo), locations (social proof marquee), how it works + earnings calculator, station, benefits, founders, FAQ, contact form, footer.

The earlier three hero variants are archived in `designs/hero-varianty/` (open its `index.html`).

### Open TODOs
- Location photos: 4 of ~10 are in `assets/img/mista/`. Add the rest as `<li class="place">` in the first list of `#mista` and in the two `aria-hidden` copies (empty alt there). With 8+ photos one copy can go: delete the third list and set the keyframe back to `-50%`.
- Contact form: set `FORM_ENDPOINT` in `script.js` (e.g. Formspree) and confirm `CONTACT_EMAIL`. Until then the form opens a pre-filled e-mail.
- Real logo as SVG (header and footer currently use a placeholder wordmark).

## Deploy
Plain static site (no build step). On Vercel, import the repo with the framework preset "Other" and no build command; the output directory is the root.
