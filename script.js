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
    // start after the preloader (≤1 s) has faded, unless it is skipped for reduced motion
    const pre = document.querySelector('.preloader');
    let delay = pre && getComputedStyle(pre).display !== 'none' ? 1.0 : 0.25;
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

// ---------- Kontaktní formulář → Supabase ----------
// Poptávky se ukládají do tabulky public.poptavky v projektu Supabase "powerbanky.eu".
// Publishable klíč je veřejný; tabulka (RLS) dovoluje webu jen vkládat, nic číst ani měnit.
const SUPABASE_URL = 'https://rtrwsimsuangnatzubpx.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ozjrENV0PqBznFIcsNC0CQ_AEFo9AIn';
const CONTACT_EMAIL = 'info@powerbanky.eu'; // záloha pro případ, že odeslání selže

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

  function done(msg, ok) {
    status.textContent = msg;
    status.classList.add(ok ? 'is-ok' : 'is-err');
  }

  // Úspěch: formulář zmizí, místo něj poděkování s animovanou fajfkou
  const success = document.getElementById('form-success');
  function showSuccess() {
    // GA4: count a sent enquiry as a lead (mark 'generate_lead' as a key event in GA4)
    if (typeof gtag === 'function') gtag('event', 'generate_lead', { form: 'kontakt' });
    form.reset();
    form.hidden = true;
    success.hidden = false;
    success.classList.remove('is-shown'); void success.offsetWidth; success.classList.add('is-shown');
    success.focus({ preventScroll: true });
    const top = success.getBoundingClientRect().top;
    if (top < 0 || top > innerHeight * 0.6) success.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
  }
  document.getElementById('form-again').addEventListener('click', () => {
    success.hidden = true; success.classList.remove('is-shown');
    status.textContent = ''; status.className = 'form-status field--full';
    form.hidden = false; f('f-name').focus();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = ''; status.className = 'form-status field--full';
    if (!validate()) return;
    const d = Object.fromEntries(new FormData(form));

    // Past na roboty: skryté pole vyplní jen bot. Tváříme se, že se odeslalo.
    if (d.web) { showSuccess(); return; }

    const clean = (v) => (v || '').trim() || null;
    const row = {
      jmeno: clean(d.jmeno),
      podnik: clean(d.podnik),
      telefon: clean(d.telefon),
      email: clean(d.email),
      zprava: clean(d.zprava),
      zdroj: location.hostname + location.pathname,
    };

    btn.disabled = true; btn.textContent = 'Odesílám…';
    try {
      const res = await fetch(SUPABASE_URL + '/rest/v1/poptavky', {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(row),
      });
      if (!res.ok) throw new Error(res.status);
      showSuccess();
    } catch {
      done(`Poptávku se nepodařilo odeslat. Zkuste to znovu, nebo napište na ${CONTACT_EMAIL}.`, false);
    } finally {
      btn.disabled = false; btn.textContent = 'Odeslat poptávku';
    }
  });
})();

// ---------- Preloader: remove from the DOM once it has faded ----------
(function () {
  const pre = document.querySelector('.preloader');
  if (!pre) return;
  // the CSS fade ends 1 s after navigation start; remove the node then (or now, if already past)
  setTimeout(() => pre.remove(), Math.max(0, 1050 - performance.now()));
})();

// ---------- Cookie lišta (Google Consent Mode v2) ----------
// Okno uprostřed: "Přijmout vše" je vždy vidět, ostatní volby jsou v "Spravovat nastavení".
// Volba se ukládá do localStorage 'pb-consent' na 6 měsíců; pak se zeptáme znovu.
(function () {
  const dlg = document.getElementById('consent');
  if (!dlg || typeof dlg.showModal !== 'function') return;
  const KEY = 'pb-consent';
  const MAX_AGE = 182 * 864e5;
  const main = dlg.querySelector('.consent-main');
  const settings = dlg.querySelector('.consent-settings');
  const analytics = document.getElementById('consent-analytics');
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
  const valid = saved && typeof saved.analytics === 'boolean' && Date.now() - saved.t < MAX_AGE;

  function open(showSettings) {
    main.hidden = !!showSettings;
    settings.hidden = !showSettings;
    if (valid || saved) analytics.checked = !!(saved && saved.analytics);
    if (!dlg.open) dlg.showModal();
    dlg.querySelector(showSettings ? '#consent-analytics' : '[data-consent="allow"]').focus();
  }
  function choose(allow) {
    saved = { analytics: allow, t: Date.now() };
    try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) {}
    if (typeof gtag === 'function') gtag('consent', 'update', { analytics_storage: allow ? 'granted' : 'denied' });
    dlg.close();
  }

  dlg.addEventListener('click', (e) => {
    const b = e.target.closest('[data-consent]');
    if (!b) return;
    const a = b.dataset.consent;
    if (a === 'allow') choose(true);
    else if (a === 'save') choose(analytics.checked);
    else if (a === 'manage') open(true);
  });
  // a choice is required: Esc does not dismiss the dialog
  dlg.addEventListener('cancel', (e) => e.preventDefault());

  const footerBtn = document.getElementById('consent-open');
  if (footerBtn) footerBtn.addEventListener('click', () => open(true));

  // first visit: show after the preloader has gone
  if (!valid) setTimeout(() => open(false), Math.max(0, 1100 - performance.now()));
})();
