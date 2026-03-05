const listingId = new URLSearchParams(window.location.search).get('id');
if (!listingId) window.location = '/search';

async function loadListing() {
  try {
    const l = await api('GET', '/listings/' + listingId, null, false);
    document.title = l.title + ' - Merrali';

    // Gallery
    const main = document.getElementById('mainPhoto');
    const thumbs = document.getElementById('thumbsRow');
    const photos = (l.media || []).filter(m => m.type === 'photo');
    const videos = (l.media || []).filter(m => m.type === 'video');

    if (photos.length) {
      main.innerHTML = '<img src="/uploads/' + escHtml(photos[0].filename) + '" alt="' + escHtml(l.title) + '">';
      thumbs.innerHTML = photos.map((p, i) =>
        `<div class="thumb ${i === 0 ? 'active' : ''}" onclick="setMainPhoto('/uploads/${escHtml(p.filename)}',this)">
          <img src="/uploads/${escHtml(p.filename)}" alt="" loading="lazy">
        </div>`
      ).join('');
    } else {
      main.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:4rem;color:#9dc9ae"><i class="fas fa-seedling"></i></div>';
    }

    // Badges
    document.getElementById('listingBadges').innerHTML =
      `<span class="badge badge-green">${l.transaction_type === 'rent' ? t('type_rent') : t('type_sale')}</span>` +
      (l.verifications_count >= 5 ? '<span class="badge badge-gold"><i class="fas fa-check-circle"></i> Verificado</span>' : '') +
      `<span class="badge badge-gray">${escHtml(l.country)}</span>`;

    document.getElementById('listingTitle').textContent = l.title;
    document.getElementById('listingLocation').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${escHtml(l.province)}, ${escHtml(l.country)}${l.city ? ' — ' + escHtml(l.city) : ''}`;
    document.getElementById('listingPrice').innerHTML = `USD ${l.total_price ? l.total_price.toLocaleString() : '—'} <span class="pph">${l.price_per_hectare ? '(USD ' + l.price_per_hectare.toLocaleString() + '/há)' : ''}</span>`;

    // Specs
    const specs = [
      {icon:'fa-ruler-combined',val: l.hectares ? l.hectares.toLocaleString() + ' há' : '—', lbl:'Hectáreas'},
      {icon:'fa-home',val: l.num_houses || 0, lbl:'Casas'},
      {icon:'fa-hard-hat',val: l.num_worker_houses || 0, lbl:'C. Trabajadores'},
      {icon:'fa-tint',val: l.num_wells || 0, lbl:'Pozos'},
      {icon:'fa-cloud-rain',val: l.annual_rainfall || '—', lbl:'Lluvia anual'},
      {icon:'fa-tree',val: (l.forest_percent || 0) + '%', lbl:'Bosque'},
      {icon:'fa-leaf',val: (l.mixed_agri_percent || 0) + '%', lbl:'Agrícola'},
    ];
    document.getElementById('specsGrid').innerHTML = specs.map(s =>
      `<div class="spec-item"><i class="fas ${s.icon}"></i><span class="spec-val">${escHtml(String(s.val))}</span><span class="spec-lbl">${escHtml(s.lbl)}</span></div>`
    ).join('');

    document.getElementById('listingDesc').textContent = l.description || '—';

    // Features
    const feats = [];
    if (l.has_river) feats.push({icon:'fa-water',label:t('feat_river')});
    if (l.has_bushes) feats.push({icon:'fa-leaf',label:t('feat_bushes')});
    if (l.has_forest) feats.push({icon:'fa-tree',label:t('feat_forest')});
    if (l.has_perimeter_fence) feats.push({icon:'fa-border-all',label:t('feat_fence')});
    if (l.grass_type) feats.push({icon:'fa-spa',label: l.grass_type});
    document.getElementById('featuresList').innerHTML = feats.map(f =>
      `<div class="feat-tag"><i class="fas ${f.icon}"></i>${escHtml(f.label)}</div>`
    ).join('') || '—';

    // Agriculture
    const agriItems = [...(l.agriculture_types||[]), ...(l.products||[]), ...(l.fruit_trees||[])];
    if (agriItems.length) {
      document.getElementById('agriContent').innerHTML = agriItems.map(a =>
        `<span class="feat-tag">${escHtml(String(a))}</span>`
      ).join(' ');
    } else document.getElementById('agriSection').style.display = 'none';

    // Video
    if (l.video_url) {
      const vs = document.getElementById('videoSection');
      const ve = document.getElementById('videoEmbed');
      vs.style.display = 'block';
      const ytId = extractYouTubeId(l.video_url);
      if (ytId) ve.innerHTML = `<iframe src="https://www.youtube.com/embed/${ytId}" allowfullscreen></iframe>`;
      else ve.innerHTML = `<video src="${escHtml(l.video_url)}" controls style="width:100%"></video>`;
    }

    // Verifications
    const vb = document.getElementById('verifBar');
    const vl = document.getElementById('verifList');
    const count = l.verifications_count || 0;
    const pct = Math.min((count / 5) * 100, 100);
    vb.innerHTML = `<span style="font-weight:700">${count}/5</span><div class="verif-progress"><div class="verif-fill" style="width:${pct}%"></div></div><span style="font-size:.8rem;color:var(--text-light)">${count >= 5 ? '✅ Verificado' : 'Pendiente'}</span>`;
    if (l.verifications && l.verifications.length) {
      vl.innerHTML = l.verifications.map(v =>
        `<div class="verif-item"><div class="vi-icon"><i class="fas fa-stamp"></i></div><div><div style="font-weight:600">${escHtml(v.notary_name)}</div><div class="vi-notes">${escHtml(v.notes || '')}</div></div></div>`
      ).join('');
    } else {
      vl.innerHTML = '<p style="color:var(--text-light);font-size:.875rem">Ningún escribano ha verificado esta propiedad aún.</p>';
    }

    // Seller
    document.getElementById('sellerInfo').innerHTML = `
      <div class="seller-info">
        <div class="seller-avatar">${escHtml(l.seller_name.charAt(0).toUpperCase())}</div>
        <div><div class="si-name">${escHtml(l.seller_name)}</div>
          ${l.seller_phone ? '<div class="si-meta"><i class="fas fa-phone"></i> ' + escHtml(l.seller_phone) + '</div>' : ''}
        </div>
      </div>`;

  } catch (e) {
    document.querySelector('.listing-detail-page').innerHTML = `<div class="no-results" style="padding:80px 0"><i class="fas fa-exclamation-circle" style="color:#c00"></i><p>No se pudo cargar la propiedad</p><a href="/search" class="btn btn-primary">Volver</a></div>`;
  }
}

function setMainPhoto(src, thumb) {
  const main = document.getElementById('mainPhoto');
  main.innerHTML = `<img src="${src}" alt="">`;
  document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
}

function extractYouTubeId(url) {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\?\/]+)/);
  return m ? m[1] : null;
}

document.getElementById('inquiryForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const msg = document.getElementById('inquiryMsg');
  try {
    await api('POST', '/listings/' + listingId + '/inquire', {
      name: document.getElementById('iqName').value,
      email: document.getElementById('iqEmail').value,
      message: document.getElementById('iqMsg').value || 'Quisiera más información sobre esta propiedad.',
    }, false);
    msg.className = 'info-msg success-msg'; msg.textContent = t('btn_send') + ' ✓'; msg.style.display = 'block';
    document.getElementById('inquiryForm').reset();
  } catch(ex) {
    msg.className = 'info-msg error-msg'; msg.textContent = ex.message; msg.style.display = 'block';
  }
});

document.addEventListener('DOMContentLoaded', loadListing);
