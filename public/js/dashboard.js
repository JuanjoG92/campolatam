if (!isLoggedIn()) window.location = '/login';

const user = getUser();
let currentTab = 'overview';

function switchTab(tab, btn) {
  document.querySelectorAll('.dash-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.dash-tab').forEach(b => b.classList.remove('active'));
  const panel = document.getElementById('panel-' + tab);
  if (panel) panel.classList.add('active');
  if (btn) btn.classList.add('active');
  currentTab = tab;
  if (tab === 'my-listings') loadMyListings();
  if (tab === 'verify') loadPending();
  if (tab === 'profile') loadProfile();
}

function closeModal(id) { document.getElementById(id).style.display = 'none'; }

document.addEventListener('DOMContentLoaded', async () => {
  if (!user) return;
  const navUser = document.getElementById('navUser');
  if (navUser) navUser.textContent = user.name;

  // Show role-specific tabs
  if (user.role === 'seller' || user.role === 'admin') {
    document.getElementById('tabMyListings').style.display = 'flex';
    document.getElementById('tabNewListing').style.display = 'flex';
  }
  if (user.role === 'notary' || user.role === 'admin') {
    document.getElementById('tabVerify').style.display = 'flex';
  }

  loadOverview();
});

async function loadOverview() {
  const stats = document.getElementById('dashStats');
  const welcome = document.getElementById('welcomeMsg');
  try {
    if (user.role === 'seller') {
      const listings = await api('GET', '/listings/my/listings');
      const active = listings.filter(l => l.status === 'active').length;
      const pending = listings.filter(l => l.status === 'pending').length;
      stats.innerHTML = `
        <div class="stat-box"><i class="fas fa-list"></i><div class="sb-val">${listings.length}</div><div class="sb-lbl">Mis Campos</div></div>
        <div class="stat-box"><i class="fas fa-check-circle"></i><div class="sb-val">${active}</div><div class="sb-lbl">Activos</div></div>
        <div class="stat-box"><i class="fas fa-clock"></i><div class="sb-val">${pending}</div><div class="sb-lbl">Pendientes</div></div>`;
      welcome.innerHTML = `<h3>¡Hola, ${escHtml(user.name.split(' ')[0])}!</h3><p>Tenés ${listings.length} campo(s) publicado(s). ${pending ? pending + ' esperando verificación.' : ''}</p><br><a href="/new-listing" class="btn btn-white btn-sm"><i class="fas fa-plus"></i> Publicar nuevo campo</a>`;
    } else if (user.role === 'notary') {
      const verifs = await api('GET', '/notary/my');
      stats.innerHTML = `<div class="stat-box"><i class="fas fa-stamp"></i><div class="sb-val">${verifs.length}</div><div class="sb-lbl">Verificaciones</div></div>`;
      welcome.innerHTML = `<h3>¡Hola, Escribano ${escHtml(user.name.split(' ')[0])}!</h3><p>Sos parte de la red de verificación de Merrali. Gracias por tu labor.</p>`;
    } else {
      welcome.innerHTML = `<h3>¡Hola, ${escHtml(user.name.split(' ')[0])}!</h3><p>Bienvenido a Merrali Campo Latam. Explorá los campos disponibles en toda Sudamérica.</p><br><a href="/search" class="btn btn-white btn-sm"><i class="fas fa-search"></i> Buscar campos</a>`;
    }
  } catch (e) {
    welcome.innerHTML = `<h3>¡Hola, ${escHtml(user?.name?.split(' ')[0] || '')}!</h3>`;
  }
}

async function loadMyListings() {
  const grid = document.getElementById('myListingsGrid');
  if (!grid) return;
  grid.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>';
  try {
    const listings = await api('GET', '/listings/my/listings');
    if (!listings.length) {
      grid.innerHTML = '<div class="no-results"><i class="fas fa-plus-circle"></i><p>Todavía no publicaste ningún campo</p><a href="/new-listing" class="btn btn-primary">Publicar mi primer campo</a></div>';
      return;
    }
    grid.innerHTML = listings.map(l => buildListingCard(l)).join('');
  } catch (e) { grid.innerHTML = '<div class="no-results"><p>' + e.message + '</p></div>'; }
}

async function loadPending() {
  const grid = document.getElementById('pendingGrid');
  if (!grid) return;
  grid.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>';
  try {
    const listings = await api('GET', '/notary/pending');
    if (!listings.length) {
      grid.innerHTML = '<div class="no-results"><i class="fas fa-check-circle" style="color:var(--green)"></i><p>No hay propiedades pendientes de verificación</p></div>';
      return;
    }
    grid.innerHTML = listings.map(l => {
      const card = buildListingCard(l);
      return card.replace('window.location=', `openVerifyModal(${l.id},'${escHtml(l.title)}'); void`).replace("onclick=\"window.location", `onclick="openVerifyModal(${l.id},'${escHtml(l.title)}'); void(0)//`);
    }).join('') + '<style>.listing-card{cursor:pointer}</style>';

    grid.innerHTML = listings.map(l => `
      <div class="listing-card" onclick="openVerifyModal(${l.id},'${escHtml(l.title)}')">
        <div class="card-img">
          ${l.media && l.media.length ? '<img src="/uploads/' + escHtml(l.media[0].filename) + '" loading="lazy">' : '<div class="no-photo"><i class="fas fa-seedling"></i></div>'}
          <span class="card-badge">${l.verifications_count || 0}/5 verificaciones</span>
          ${l.already_verified ? '<span class="card-verif" style="background:var(--green);color:#fff">Ya verificaste</span>' : ''}
        </div>
        <div class="card-body">
          <div class="card-title">${escHtml(l.title)}</div>
          <div class="card-location"><i class="fas fa-map-marker-alt"></i>${escHtml(l.province)}, ${escHtml(l.country)}</div>
          <div class="card-specs">
            ${l.hectares ? '<div class="card-spec"><i class="fas fa-ruler-combined"></i>' + l.hectares.toLocaleString() + ' há</div>' : ''}
          </div>
          <button class="btn btn-primary btn-sm btn-block" style="margin-top:8px" ${l.already_verified ? 'disabled' : ''}>
            ${l.already_verified ? '✅ Ya verificaste' : '<i class="fas fa-stamp"></i> Verificar'}
          </button>
        </div>
      </div>`
    ).join('');
  } catch (e) { grid.innerHTML = '<div class="no-results"><p>' + e.message + '</p></div>'; }
}

function openVerifyModal(id, title) {
  document.getElementById('verifyListingId').value = id;
  document.getElementById('verifyModalBody').innerHTML = `<p style="margin-bottom:16px;font-weight:600">${escHtml(title)}</p>`;
  document.getElementById('verifyModal').style.display = 'flex';
}

document.getElementById('verifyForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const id = document.getElementById('verifyListingId').value;
  const status = document.getElementById('verifyStatus').value;
  const notes = document.getElementById('verifyNotes').value;
  try {
    const r = await api('POST', '/notary/' + id + '/verify', { status, notes });
    closeModal('verifyModal');
    alert('Verificación enviada. ' + (r.activated ? '✅ ¡La propiedad ya tiene 5 verificaciones y está activa!' : `Verificaciones: ${r.verifications}/5`));
    loadPending();
  } catch (e) { alert(e.message); }
});

async function loadProfile() {
  const el = document.getElementById('profileInfo');
  try {
    const u = await api('GET', '/auth/me');
    const roleMap = { buyer: 'Comprador', seller: 'Vendedor', notary: 'Escribano', admin: 'Administrador' };
    el.innerHTML = [
      ['Nombre', u.name], ['Email', u.email],
      ['Rol', roleMap[u.role] || u.role], ['País', u.country || '—'],
      ['Teléfono', u.phone || '—'],
      ['Miembro desde', new Date(u.created_at).toLocaleDateString('es')],
    ].map(([l, v]) => `<div class="pi-row"><span class="pi-label">${l}</span><span class="pi-value">${escHtml(String(v))}</span></div>`).join('');
  } catch (e) { el.innerHTML = '<p>' + e.message + '</p>'; }
}
