# powerbanky.eu (V2)

Website for powerbanky.eu, a charging-station rental for partner venues (cafés, restaurants, bars). The station is free, and revenue is split 50/50 with the venue (~100 Kč average per rental).

## Status
The main page currently contains three hero variants (A, B, C) for review. The floating "Varianta" switcher at the bottom right is review-only, so delete it once a variant is chosen.

- **A: Výplatní páska.** White, warm black and brand green, with a live monthly-earnings calculator.
- **B: Stanice v barvě.** A white and brand-green split, with an animated station (one powerbank leaves, "+50 Kč pro podnik").
- **C: Položka na menu.** Brand-grey canvas and a white card, with a serif headline and the station framed as a menu item.

## Deploy
Plain static site (no build step). On Vercel, import the repo with the framework preset "Other" and no build command; the output directory is the root.
