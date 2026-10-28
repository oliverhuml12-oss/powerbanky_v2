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
    $('a-meter').style.width = ((n - range.min) / (range.max - range.min)) * 92 + 8 + '%';
  }
  range.addEventListener('input', update);
  update();
})();
