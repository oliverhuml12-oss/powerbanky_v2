// Varianta A: odhad měsíční výplaty
(function () {
  const range = document.getElementById('a-range');
  if (!range) return;
  const REVENUE_PER_RENT = 100; // Kč, průměrná tržba z jedné výpůjčky
  const SHARE = 0.5;            // podíl podniku
  const DAYS = 30;
  const fmt = new Intl.NumberFormat('cs-CZ');
  const $ = (id) => document.getElementById(id);

  function update() {
    const n = Number(range.value);
    const rents = n * DAYS;
    const revenue = rents * REVENUE_PER_RENT;
    $('a-n').textContent = n;
    $('a-rent').textContent = fmt.format(rents);
    $('a-rev').textContent = fmt.format(revenue) + ' Kč';
    $('a-share').textContent = fmt.format(revenue * SHARE) + ' Kč';
    const pct = ((n - range.min) / (range.max - range.min)) * 100;
    $('a-meter').style.width = pct * 0.92 + 8 + '%';
    range.style.setProperty('--fill', pct + '%');
    range.setAttribute('aria-valuetext', n + ' výpůjček denně, váš podíl ' + fmt.format(revenue * SHARE) + ' Kč měsíčně');
  }
  range.addEventListener('input', update);
  update();
})();

// Varianta B: animaci spustit, až když je sekce vidět
(function () {
  const hero = document.querySelector('.hero-b');
  if (!hero) return;
  if (!('IntersectionObserver' in window)) { hero.classList.add('is-live'); return; }
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) { hero.classList.add('is-live'); io.disconnect(); }
  }, { threshold: 0.45 });
  io.observe(hero);
})();
