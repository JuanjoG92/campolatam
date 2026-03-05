async function doQuickSearch(e) {
  if (e) e.preventDefault();
  const params = new URLSearchParams();
  const c = document.getElementById('qsCountry')?.value;
  const p = document.getElementById('qsProvince')?.value;
  const tp = document.getElementById('qsType')?.value;
  const minH = document.getElementById('qsMinHa')?.value;
  const maxH = document.getElementById('qsMaxHa')?.value;
  if (c) params.set('country', c);
  if (p) params.set('province', p);
  if (tp) params.set('type', tp);
  if (minH) params.set('minHa', minH);
  if (maxH) params.set('maxHa', maxH);
  window.location = '/search?' + params.toString();
}

async function loadRecentListings() {
  const grid = document.getElementById('recentGrid');
  if (!grid) return;
  try {
    const data = await api('GET', '/search/stats', null, false);
    document.getElementById('statTotal').textContent = data.total || 0;
    if (!data.recent || !data.recent.length) {
      grid.innerHTML = '<div class="no-results"><i class="fas fa-seedling"></i><p>Sé el primero en publicar un campo</p><a href="/register?role=seller" class="btn btn-primary">Publicar Campo</a></div>';
      return;
    }
    grid.innerHTML = data.recent.map(l => buildListingCard(l)).join('');

    // Countries
    const cg = document.getElementById('countriesGrid');
    if (cg && data.countries) {
      cg.innerHTML = data.countries.map(c =>
        `<div class="country-chip" onclick="window.location='/search?country=${encodeURIComponent(c.country)}'">
          <i class="fas fa-map-marker-alt" style="color:var(--green)"></i>
          <span>${escHtml(c.country)}</span>
          <span class="count">(${c.n})</span>
        </div>`
      ).join('') || Object.keys(countriesData).map(c =>
        `<div class="country-chip" onclick="window.location='/search?country=${encodeURIComponent(c)}'">${c}</div>`
      ).join('');
    }
  } catch (e) {
    grid.innerHTML = '<div class="no-results"><i class="fas fa-seedling"></i><p>Sé el primero en publicar un campo</p><a href="/register?role=seller" class="btn btn-primary">Publicar Campo</a></div>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadRecentListings();

  // Preload countries for quick search
  setTimeout(() => {
    if (Object.keys(countriesData).length) {
      const cg = document.getElementById('countriesGrid');
      if (cg && !cg.innerHTML.trim()) {
        cg.innerHTML = Object.keys(countriesData).map(c =>
          `<div class="country-chip" onclick="window.location='/search?country=${encodeURIComponent(c)}'">${c}</div>`
        ).join('');
      }
    }
  }, 1500);
});
