// ---------- Zvýrazňovač v hlavním nadpisu: tah po řádcích ----------
// Rozdělí text na spany po vykreslených řádcích, aby se zvýraznění kreslilo
// řádek po řádku. Při změně šířky se přepočítá už bez animace.
(function () {
  const el = document.querySelector('.marker');
  if (!el) return;
  const text = el.textContent.trim();
  let lastWidth = 0;

  function split(animate) {
    const words = text.split(/\s+/);
    el.classList.remove('is-split');
    el.innerHTML = words.map((w) => '<span class="mw">' + w + '</span>').join(' ');
    const lines = [];
    let top = null;
    el.querySelectorAll('.mw').forEach((w) => {
      const t = Math.round(w.getBoundingClientRect().top);
      if (top === null || Math.abs(t - top) > 4) { lines.push([]); top = t; }
      lines[lines.length - 1].push(w.textContent);
    });
    el.innerHTML = lines.map((l) => '<span class="marker-line">' + l.join(' ') + '</span>').join(' ');
    el.classList.add('is-split');
    // constant pen speed: each line's duration follows its width, next line starts when the previous ends
    const SPEED = 14 * parseFloat(getComputedStyle(el).fontSize); // 14 em/s: same feel on every screen
    let delay = 0.25;
    el.querySelectorAll('.marker-line').forEach((ln) => {
      const dur = Math.max(0.18, ln.getBoundingClientRect().width / SPEED);
      ln.style.setProperty('--dur', dur.toFixed(3) + 's');
      ln.style.setProperty('--delay', delay.toFixed(3) + 's');
      delay += dur;
    });
    el.classList.toggle('is-drawn', !animate);
    lastWidth = el.parentElement.clientWidth;
  }

  const start = () => split(true);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else start();

  let t;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(() => { if (el.parentElement.clientWidth !== lastWidth) split(false); }, 150);
  });
})();

// ---------- Kalkulačka výplaty ----------
(function () {
  const range = document.getElementById('calc-range');
  if (!range) return;
  const REVENUE_PER_RENT = 100; // Kč, průměrná tržba z jedné výpůjčky
  const SHARE = 0.5;            // podíl podniku
  const DAYS = 30;
  const fmt = new Intl.NumberFormat('cs-CZ');
  const $ = (id) => document.getElementById(id);

  function update() {
    const n = Number(range.value);
    const revenue = n * DAYS * REVENUE_PER_RENT;
    const share = revenue * SHARE;
    $('calc-n').textContent = n;
    $('calc-rent').textContent = fmt.format(n * DAYS);
    $('calc-rev').textContent = fmt.format(revenue) + ' Kč';
    $('calc-share').textContent = fmt.format(share) + ' Kč';
    range.style.setProperty('--fill', ((n - range.min) / (range.max - range.min)) * 100 + '%');
    range.setAttribute('aria-valuetext', n + ' výpůjček denně, váš podíl ' + fmt.format(share) + ' Kč měsíčně');
  }
  range.addEventListener('input', update);
  update();
})();

// ---------- Kontaktní formulář ----------
// FORM_ENDPOINT: adresa služby, která formulář přijme (např. Formspree).
// Dokud je prázdná, formulář otevře e-mail na CONTACT_EMAIL s vyplněnými údaji.
const FORM_ENDPOINT = '';
const CONTACT_EMAIL = 'info@powerbanky.eu'; // TODO: potvrdit adresu

(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = document.getElementById('form-status');
  const btn = form.querySelector('button[type="submit"]');
  const f = (id) => document.getElementById(id);

  function setError(input, errEl, show) {
    if (input) input.setAttribute('aria-invalid', show ? 'true' : 'false');
    if (input && errEl) input.setAttribute('aria-describedby', show ? errEl.id : '');
    errEl.hidden = !show;
  }

  function validate() {
    const name = f('f-name'), venue = f('f-venue'), phone = f('f-phone'), email = f('f-email');
    const noName = !name.value.trim();
    const noVenue = !venue.value.trim();
    const noContact = !phone.value.trim() && !email.value.trim();
    const badEmail = email.value.trim() && !email.checkValidity();
    setError(name, f('e-name'), noName);
    setError(venue, f('e-venue'), noVenue);
    f('e-contact').textContent = badEmail ? 'E-mail nevypadá správně. Zkontrolujte ho, prosím.' : 'Vyplňte telefon nebo e-mail, ať se vám můžeme ozvat.';
    setError(badEmail ? email : null, f('e-contact'), noContact || badEmail);
    if (badEmail) email.setAttribute('aria-invalid', 'true');
    const firstBad = [noName && name, noVenue && venue, (noContact && phone) || (badEmail && email)].find(Boolean);
    if (firstBad) firstBad.focus();
    return !firstBad;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = ''; status.className = 'form-status field--full';
    if (!validate()) return;
    const data = Object.fromEntries(new FormData(form));

    if (!FORM_ENDPOINT) {
      const body = Object.entries(data).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n');
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Poptávka stanice: ' + data.podnik)}&body=${encodeURIComponent(body)}`;
      status.textContent = 'Otevřeli jsme vám e-mail s vyplněnými údaji. Stačí ho odeslat.';
      status.classList.add('is-ok');
      return;
    }

    btn.disabled = true; btn.textContent = 'Odesílám…';
    try {
      const res = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      status.textContent = 'Poptávka odeslána. Ozveme se vám do 24 hodin.';
      status.classList.add('is-ok');
    } catch {
      status.textContent = `Poptávku se nepodařilo odeslat. Zkuste to znovu, nebo napište na ${CONTACT_EMAIL}.`;
      status.classList.add('is-err');
    } finally {
      btn.disabled = false; btn.textContent = 'Odeslat poptávku';
    }
  });
})();
