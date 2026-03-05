let currentPage = 1;

function getSearchParams() {
  const p = new URLSearchParams(window.location.search);
  return {
    q: document.getElementById('searchQuery')?.value || p.get('q') || '',
    country: document.getElementById('fCountry')?.value || p.get('country') || '',
    province: document.getElementById('fProvince')?.value || p.get('province') || '',
    type: document.getElementById('fType')?.value || p.get('type') || '',
    minHa: document.getElementById('fMinHa')?.value || p.get('minHa') || '',
    maxHa: document.getElementById('fMaxHa')?.value || p.get('maxHa') || '',
    minPrice: document.getElementById('fMinPrice')?.value || p.get('minPrice') || '',
    maxPrice: document.getElementById('fMaxPrice')?.value || p.get('maxPrice') || '',
    page: currentPage,
  };
}

async function doSearch() {
  currentPage = 1;
  await runSearch();
}

async function runSearch() {
  const grid = document.getElementById('resultsGrid');
  const countEl = document.getElementById('resultsCount');
  grid.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>';

  const p = getSearchParams();
  const params = new URLSearchParams();
  Object.entries(p).forEach(([k, v]) => { if (v) params.set(k, v); });

  try {
    const data = await api('GET', '/search?' + params.toString(), null, false);
    const results = data.results || [];
    if (countEl) countEl.textContent = data.total + ' ' + t('results_count');

    if (!results.length) {
      grid.innerHTML = '<div class="no-results"><i class="fas fa-search"></i><p>No se encontraron propiedades con esos filtros</p></div>';
      return;
    }

    const sort = document.getElementById('sortBy')?.value || 'newest';
    if (sort === 'price_asc') results.sort((a, b) => a.total_price - b.total_price);
    else if (sort === 'price_desc') results.sort((a, b) => b.total_price - a.total_price);
    else if (sort === 'ha_asc') results.sort((a, b) => b.hectares - a.hectares);

    grid.innerHTML = results.map(l => buildListingCard(l)).join('');
    renderPagination(Math.ceil(data.total / 24));
  } catch (e) {
    grid.innerHTML = '<div class="no-results"><i class="fas fa-exclamation-circle"></i><p>' + e.message + '</p></div>';
  }
}

function renderPagination(totalPages) {
  const el = document.getElementById('pagination');
  if (!el || totalPages <= 1) { if (el) el.innerHTML = ''; return; }
  let html = '';
  for (let i = 1; i <= Math.min(totalPages, 10); i++) {
    html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goPage(${i})">${i}</button>`;
  }
  el.innerHTML = html;
}

function goPage(n) { currentPage = n; runSearch(); window.scrollTo(0, 0); }

function clearFilters() {
  ['fCountry', 'fProvince', 'fType', 'fMinHa', 'fMaxHa', 'fMinPrice', 'fMaxPrice'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  ['fRiver', 'fWells', 'fFence', 'fHouse'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.checked = false;
  });
  doSearch();
}

document.addEventListener('DOMContentLoaded', () => {
  const url = new URLSearchParams(window.location.search);
  if (url.get('country')) { const el = document.getElementById('fCountry'); if (el) { el.value = url.get('country'); loadProvinces(el.value, 'fProvince'); } }
  if (url.get('province')) { setTimeout(() => { const el = document.getElementById('fProvince'); if (el) el.value = url.get('province'); }, 500); }
  if (url.get('type')) { const el = document.getElementById('fType'); if (el) el.value = url.get('type'); }
  if (url.get('minHa')) { const el = document.getElementById('fMinHa'); if (el) el.value = url.get('minHa'); }
  if (url.get('maxHa')) { const el = document.getElementById('fMaxHa'); if (el) el.value = url.get('maxHa'); }
  if (url.get('q')) { const el = document.getElementById('searchQuery'); if (el) el.value = url.get('q'); }
  runSearch();
});
