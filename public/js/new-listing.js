if (!isLoggedIn()) window.location = '/login';

function previewMedia(input) {
  const preview = document.getElementById('mediaPreview');
  const files = Array.from(input.files);
  preview.innerHTML = files.map((f, i) => {
    const url = URL.createObjectURL(f);
    const isVideo = f.type.startsWith('video');
    return `<div class="preview-item" id="pv${i}">
      ${isVideo
        ? `<div class="vid-overlay"><i class="fas fa-play-circle"></i></div><video src="${url}" style="width:100%;height:100%;object-fit:cover"></video>`
        : `<img src="${url}" alt="">`}
      <button class="del-btn" type="button" onclick="removePreview(${i})"><i class="fas fa-times"></i></button>
    </div>`;
  }).join('');
}

function removePreview(i) {
  document.getElementById('pv' + i)?.remove();
}

document.getElementById('newListingForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const err = document.getElementById('formError');
  const succ = document.getElementById('formSuccess');
  err.style.display = 'none'; succ.style.display = 'none';
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subiendo...';

  try {
    const form = e.target;
    const fd = new FormData(form);

    // Parse comma-separated fields into arrays
    ['agriculture_types', 'products', 'fruit_trees'].forEach(field => {
      const val = fd.get(field) || '';
      fd.delete(field);
      val.split(',').map(v => v.trim()).filter(Boolean).forEach(v => fd.append(field, v));
    });

    // Checkboxes
    ['has_river', 'has_bushes', 'has_forest', 'has_perimeter_fence'].forEach(f => {
      if (!fd.get(f)) fd.set(f, '0');
    });

    const token = localStorage.getItem('token');
    const r = await fetch('/api/listings', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token },
      body: fd
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Error al publicar');
    succ.textContent = '✅ Campo publicado. ID #' + data.id + '. Será verificado por 5 escribanos antes de aparecer en el listado.';
    succ.style.display = 'block';
    form.reset();
    document.getElementById('mediaPreview').innerHTML = '';
    setTimeout(() => window.location = '/dashboard', 3000);
  } catch (ex) {
    err.textContent = ex.message; err.style.display = 'block';
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-upload"></i> Publicar Campo';
  }
});

// Drag & drop
const uploadArea = document.getElementById('uploadArea');
if (uploadArea) {
  uploadArea.addEventListener('dragover', e => { e.preventDefault(); uploadArea.style.borderColor = 'var(--green)'; });
  uploadArea.addEventListener('dragleave', () => uploadArea.style.borderColor = '');
  uploadArea.addEventListener('drop', e => {
    e.preventDefault();
    uploadArea.style.borderColor = '';
    const inp = document.getElementById('mediaInput');
    inp.files = e.dataTransfer.files;
    previewMedia(inp);
  });
}
