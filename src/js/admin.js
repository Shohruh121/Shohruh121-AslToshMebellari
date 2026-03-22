// ============================================================
// Admin Panel — Asl Tosh Mebellari
// Login, Visitor Analytics, Decor CRUD via Supabase proxy
// Multi-image support (up to 10 images per decor)
// Data source: stones.json (same as catalog page)
// ============================================================

// ---- CONFIG ----
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'asltosh2026';
const STORAGE_KEY_AUTH = 'aslToshAuth';
const PER_PAGE = 30;
const MAX_IMAGES = 10;

// ---- DOM ----
const loginScreen = document.getElementById('loginScreen');
const appLayout = document.getElementById('appLayout');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const pageTitle = document.getElementById('pageTitle');

// ========== AUTH ==========
function isLoggedIn() {
  return sessionStorage.getItem(STORAGE_KEY_AUTH) === 'true';
}
function showApp() {
  loginScreen.classList.add('hidden');
  appLayout.classList.remove('locked');
  initDashboard();
  loadDecors();
}
function hideApp() {
  loginScreen.classList.remove('hidden');
  appLayout.classList.add('locked');
  sessionStorage.removeItem(STORAGE_KEY_AUTH);
}
if (isLoggedIn()) showApp();

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const user = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value;
  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    sessionStorage.setItem(STORAGE_KEY_AUTH, 'true');
    loginError.style.display = 'none';
    showApp();
  } else {
    loginError.style.display = 'block';
  }
});

logoutBtn.addEventListener('click', () => hideApp());

// ========== NAVIGATION ==========
const sidebarLinks = document.querySelectorAll('.sidebar-link[data-page]');
const navPages = { dashboard: 'pageDashboard', decors: 'pageDecors' };
const pageTitles = { dashboard: 'Дашборд', decors: 'Управление декорами' };

sidebarLinks.forEach(link => {
  link.addEventListener('click', () => {
    const pg = link.dataset.page;
    sidebarLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    Object.values(navPages).forEach(id => document.getElementById(id).classList.remove('active'));
    document.getElementById(navPages[pg]).classList.add('active');
    pageTitle.textContent = pageTitles[pg] || 'Admin';
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('active');
  });
});

// Mobile sidebar
document.getElementById('mobileToggle').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('active');
});
document.getElementById('sidebarOverlay').addEventListener('click', () => {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('active');
});

// ========== TOAST ==========
function showToast(msg, type = 'success') {
  const toast = document.getElementById('adminToast');
  const text = document.getElementById('toastText');
  const icon = document.getElementById('toastIcon');
  text.textContent = msg;
  toast.className = 'admin-toast show ' + type;
  icon.setAttribute('stroke', type === 'success' ? '#22c55e' : '#ef4444');
  setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

// ========== HELPERS ==========
function getDecorImages(d) {
  if (Array.isArray(d.images) && d.images.length > 0) return d.images;
  if (d.thumbnail) return [d.thumbnail];
  if (d.img) return [d.img];
  return [];
}
function getDecorThumb(d) {
  return d.thumbnail || (Array.isArray(d.images) && d.images[0]) || d.img || '';
}

// ========== VISITOR ANALYTICS (Supabase via proxy) ==========
async function initDashboard() {
  let visitorRows = [];
  try {
    const res = await fetch('/sb/visitors?days=30');
    visitorRows = await res.json();
    if (!Array.isArray(visitorRows)) visitorRows = [];
  } catch { visitorRows = []; }

  const visitorMap = {};
  visitorRows.forEach(r => { visitorMap[r.visit_date] = r.count; });

  const days14 = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    days14.push({ date: key, label, count: visitorMap[key] || 0 });
  }

  const todayKey = new Date().toISOString().split('T')[0];
  const today = visitorMap[todayKey] || 0;
  const week = days14.slice(-7).reduce((s, d) => s + d.count, 0);
  const month = visitorRows.reduce((s, r) => s + (r.count || 0), 0);

  document.getElementById('statToday').textContent = today.toLocaleString();
  document.getElementById('statWeek').textContent = week.toLocaleString();
  document.getElementById('statMonth').textContent = month.toLocaleString();

  const chartEl = document.getElementById('visitorChart');
  const maxCount = Math.max(...days14.map(d => d.count), 1);
  chartEl.innerHTML = days14.map(d => {
    const pct = (d.count / maxCount * 100).toFixed(1);
    return `<div class="chart-bar" style="height:100%">
      <div class="bar-fill" style="height:${pct}%"></div>
      <div class="bar-value">${d.count}</div>
      <div class="bar-label">${d.label}</div>
    </div>`;
  }).join('');

  let actLog = [];
  try {
    const res = await fetch('/sb/activity');
    actLog = await res.json();
    if (!Array.isArray(actLog)) actLog = [];
  } catch { actLog = []; }

  const actEl = document.getElementById('activityLog');
  if (actLog.length === 0) {
    actEl.innerHTML = '<p style="color:#555;font-size:0.85rem;">Пока нет активности</p>';
  } else {
    actEl.innerHTML = actLog.slice(0, 10).map(a => {
      const time = new Date(a.created_at).toLocaleString('ru-RU', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' });
      return `<div class="activity-item">
        <div><div class="a-text">${a.text}</div><div class="a-sub">${a.sub || ''}</div></div>
        <div class="a-time">${time}</div>
      </div>`;
    }).join('');
  }
}

// ========== ACTIVITY LOG ==========
async function addActivity(text, sub) {
  try {
    await fetch('/sb/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, sub: sub || '' })
    });
  } catch {}
}

// ========== DECOR CRUD ==========
let allDecors = [];
let filteredDecors = [];
let currentPage = 1;
let deleteTargetIndex = -1;
let modalImages = []; // current images being edited in modal

async function loadDecors() {
  allDecors = [];

  // 1) Load stones.json (katalog dekorlari)
  try {
    const res = await fetch('/stones.json');
    if (res.ok) {
      const stones = await res.json();
      if (Array.isArray(stones)) {
        allDecors = stones.map(d => ({
          ...d,
          _source: 'json'
        }));
      }
    }
  } catch (e) {
    console.error('stones.json load error:', e);
  }

  // 2) Load Supabase decors (admin qo'shgan dekorlar)
  try {
    const res = await fetch('/sb/decors');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        const sbDecors = data.map(d => ({
          ...d,
          images: typeof d.images === 'string' ? JSON.parse(d.images) : (d.images || []),
          thumbnail: d.thumbnail || (Array.isArray(d.images) ? d.images[0] : ''),
          features: typeof d.features === 'string' ? JSON.parse(d.features) : (d.features || []),
          thickness: typeof d.thickness === 'string' ? JSON.parse(d.thickness) : (d.thickness || []),
          finish: typeof d.finish === 'string' ? JSON.parse(d.finish) : (d.finish || []),
          applications: typeof d.applications === 'string' ? JSON.parse(d.applications) : (d.applications || []),
          _source: 'supabase'
        }));
        // Supabase dekorlar boshiga qo'shiladi
        allDecors = [...sbDecors, ...allDecors];
      }
    }
  } catch (e) {
    console.error('Supabase decors load error:', e);
  }

  if (allDecors.length === 0) {
    document.getElementById('decorGrid').innerHTML = '<p style="color:#ef4444;padding:2rem;text-align:center;">Ma\'lumotlarni yuklashda xatolik</p>';
  }
  applyFilters();
  updateDecorCount();
}

function updateDecorCount() {
  document.getElementById('statDecors').textContent = allDecors.length.toLocaleString();
}

function applyFilters() {
  const search = (document.getElementById('decorSearch').value || '').toLowerCase();
  const typeFilter = document.getElementById('decorTypeFilter').value;
  filteredDecors = allDecors.filter(d => {
    const matchName = (d.name || '').toLowerCase().includes(search);
    const matchType = typeFilter === 'all' || (d.type || '') === typeFilter;
    return matchName && matchType;
  });
  currentPage = 1;
  renderDecorGrid();
}

function renderDecorGrid() {
  const grid = document.getElementById('decorGrid');
  const total = filteredDecors.length;
  const totalPages = Math.ceil(total / PER_PAGE) || 1;
  if (currentPage > totalPages) currentPage = totalPages;
  const start = (currentPage - 1) * PER_PAGE;
  const pageItems = filteredDecors.slice(start, start + PER_PAGE);

  if (total === 0) {
    grid.innerHTML = '<p style="color:#555;padding:2rem;text-align:center;grid-column:1/-1;">Ничего не найдено</p>';
    renderPagination(0, 0);
    return;
  }

  grid.innerHTML = pageItems.map((d) => {
    const realIdx = allDecors.indexOf(d);
    const thumb = getDecorThumb(d);
    const imgCount = getDecorImages(d).length;
    const typeBadge = d.type ? `<div class="d-type">${d.type}</div>` : '';
    const imgBadge = imgCount > 1 ? `<div class="img-count-badge"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>${imgCount}</div>` : '';
    return `<div class="decor-card">
      <div class="decor-thumb" style="position:relative;">
        <img src="${thumb}" alt="${d.name}" onerror="this.src='https://placehold.co/200x200/1a1a1a/555?text=No+Image'" loading="lazy">
        ${imgBadge}
      </div>
      <div class="decor-body">
        <div class="d-name" title="${d.name}">${d.name}</div>
        ${typeBadge}
        <div class="d-actions">
          <button class="d-btn" data-edit="${realIdx}" title="Редактировать">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="d-btn del" data-delete="${realIdx}" title="Удалить">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    </div>`;
  }).join('');

  renderPagination(totalPages, total);

  grid.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => openEditModal(parseInt(btn.dataset.edit)));
  });
  grid.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', () => openDeleteModal(parseInt(btn.dataset.delete)));
  });
}

function renderPagination(totalPages, total) {
  const pag = document.getElementById('decorPagination');
  if (totalPages <= 1) { pag.innerHTML = ''; return; }
  let html = `<button class="page-btn" ${currentPage===1?'disabled':''} data-pg="${currentPage-1}">&lt;</button>`;

  const pgNums = [];
  pgNums.push(1);
  if (currentPage > 3) pgNums.push('...');
  for (let i = Math.max(2, currentPage-1); i <= Math.min(totalPages-1, currentPage+1); i++) pgNums.push(i);
  if (currentPage < totalPages-2) pgNums.push('...');
  if (totalPages > 1) pgNums.push(totalPages);

  pgNums.forEach(p => {
    if (p === '...') { html += '<span class="page-info">...</span>'; }
    else { html += `<button class="page-btn${p===currentPage?' active':''}" data-pg="${p}">${p}</button>`; }
  });
  html += `<button class="page-btn" ${currentPage===totalPages?'disabled':''} data-pg="${currentPage+1}">&gt;</button>`;
  html += `<span class="page-info">${total} ta dekor</span>`;
  pag.innerHTML = html;

  pag.querySelectorAll('[data-pg]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pg = parseInt(btn.dataset.pg);
      if (pg >= 1 && pg <= totalPages) {
        currentPage = pg;
        renderDecorGrid();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
}

// Search & Filter
document.getElementById('decorSearch').addEventListener('input', debounce(() => applyFilters(), 300));
document.getElementById('decorTypeFilter').addEventListener('change', () => applyFilters());

function debounce(fn, ms) {
  let t;
  return function() { clearTimeout(t); t = setTimeout(fn, ms); };
}

// ========== MULTI-IMAGE GALLERY IN MODAL ==========
const imagesGallery = document.getElementById('imagesGallery');
const imgAddBtn = document.getElementById('imgAddBtn');
const imgInputArea = document.getElementById('imgInputArea');
const decorInputImg = document.getElementById('decorInputImg');
const imgUrlAddBtn = document.getElementById('imgUrlAddBtn');
const decorFileInput = document.getElementById('decorFileInput');
const fileUploadArea = document.getElementById('fileUploadArea');

function renderModalImages() {
  // Remove all img-thumb elements (keep the + button)
  imagesGallery.querySelectorAll('.img-thumb').forEach(el => el.remove());
  // Insert thumbs before the + button
  modalImages.forEach((url, i) => {
    const div = document.createElement('div');
    div.className = 'img-thumb';
    div.innerHTML = `<img src="${url}" onerror="this.src='https://placehold.co/72x72/1a1a1a/555?text=Err'"><button type="button" class="img-remove" data-img-idx="${i}">&times;</button>`;
    imagesGallery.insertBefore(div, imgAddBtn);
  });
  // Hide + button if max reached
  imgAddBtn.style.display = modalImages.length >= MAX_IMAGES ? 'none' : 'flex';
  // Hide input area if not adding
  imgInputArea.style.display = 'none';
}

function addImageToModal(url) {
  if (!url || modalImages.length >= MAX_IMAGES) return;
  modalImages.push(url);
  renderModalImages();
}

// + button -> show input area
imgAddBtn.addEventListener('click', () => {
  if (modalImages.length >= MAX_IMAGES) {
    showToast(`Максимум ${MAX_IMAGES} изображений`, 'error');
    return;
  }
  imgInputArea.style.display = 'block';
  decorInputImg.value = '';
  decorInputImg.focus();
});

// "Добавить" button for URL
imgUrlAddBtn.addEventListener('click', () => {
  const url = decorInputImg.value.trim();
  if (url) {
    addImageToModal(url);
    decorInputImg.value = '';
  }
});

// Enter key in URL input
decorInputImg.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    imgUrlAddBtn.click();
  }
});

// Remove image
imagesGallery.addEventListener('click', (e) => {
  const removeBtn = e.target.closest('.img-remove');
  if (removeBtn) {
    const idx = parseInt(removeBtn.dataset.imgIdx);
    modalImages.splice(idx, 1);
    renderModalImages();
  }
});

// File upload (multiple)
fileUploadArea.addEventListener('click', () => decorFileInput.click());
fileUploadArea.addEventListener('dragover', (e) => { e.preventDefault(); fileUploadArea.style.borderColor = '#c8a45c'; });
fileUploadArea.addEventListener('dragleave', () => { fileUploadArea.style.borderColor = ''; });
fileUploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  fileUploadArea.style.borderColor = '';
  if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
});
decorFileInput.addEventListener('change', () => {
  if (decorFileInput.files.length) handleFiles(decorFileInput.files);
});

async function handleFiles(files) {
  for (const file of Array.from(files)) {
    if (!file.type.startsWith('image/') || modalImages.length >= MAX_IMAGES) continue;
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = 'decors/' + Date.now() + '-' + Math.random().toString(36).substr(2, 6) + '.' + ext;
    try {
      const res = await fetch('/sb/upload?filename=' + encodeURIComponent(filename), {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file
      });
      const data = await res.json();
      if (data.ok && data.url) {
        addImageToModal(data.url);
      } else {
        // Fallback to base64 if upload fails
        const reader = new FileReader();
        reader.onload = (e) => addImageToModal(e.target.result);
        reader.readAsDataURL(file);
      }
    } catch (e) {
      // Fallback to base64
      const reader = new FileReader();
      reader.onload = (ev) => addImageToModal(ev.target.result);
      reader.readAsDataURL(file);
    }
  }
  decorFileInput.value = '';
}

// ========== ADD / EDIT MODAL ==========
const decorModal = document.getElementById('decorModal');
const decorModalTitle = document.getElementById('decorModalTitle');
const decorEditId = document.getElementById('decorEditId');
const decorInputName = document.getElementById('decorInputName');
const decorInputType = document.getElementById('decorInputType');
const decorInputCategory = document.getElementById('decorInputCategory');

function openAddModal() {
  decorModalTitle.textContent = 'Добавить декор';
  decorEditId.value = '-1';
  decorInputName.value = '';
  decorInputType.value = '';
  decorInputCategory.value = '';
  modalImages = [];
  renderModalImages();
  imgInputArea.style.display = 'none';
  decorModal.classList.add('active');
}

function openEditModal(idx) {
  const d = allDecors[idx];
  if (!d) return;
  decorModalTitle.textContent = 'Редактировать декор';
  decorEditId.value = idx;
  decorInputName.value = d.name || '';
  decorInputType.value = d.type || '';
  decorInputCategory.value = d.category || '';
  modalImages = getDecorImages(d).slice(0, MAX_IMAGES);
  renderModalImages();
  imgInputArea.style.display = 'none';
  decorModal.classList.add('active');
}

function closeDecorModal() {
  decorModal.classList.remove('active');
  imgInputArea.style.display = 'none';
}

document.getElementById('addDecorBtn').addEventListener('click', openAddModal);
document.getElementById('decorModalClose').addEventListener('click', closeDecorModal);
document.getElementById('decorModalCancel').addEventListener('click', closeDecorModal);
decorModal.addEventListener('click', (e) => { if (e.target === decorModal) closeDecorModal(); });

// Save decor
document.getElementById('decorModalSave').addEventListener('click', async () => {
  const name = decorInputName.value.trim();
  if (!name) { decorInputName.focus(); return; }
  if (modalImages.length === 0) {
    showToast('Kamida 1 ta rasm qo\'shing', 'error');
    return;
  }

  const idx = parseInt(decorEditId.value);
  const decor = {
    name,
    type: decorInputType.value || '',
    category: decorInputCategory.value || '',
    images: modalImages.slice(),
    thumbnail: modalImages[0]
  };

  try {
    if (idx === -1 || (idx >= 0 && allDecors[idx]._source === 'json')) {
      // INSERT new decor to Supabase (or copy from stones.json)
      const res = await fetch('/sb/decors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(decor)
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(typeof data.error === 'string' ? data.error : JSON.stringify(data.error));
      }
      if (Array.isArray(data) && data.length > 0) {
        data[0]._source = 'supabase';
        if (idx >= 0) {
          // Replacing a json decor — update in place
          allDecors[idx] = data[0];
        } else {
          allDecors.unshift(data[0]);
        }
        addActivity('Yangi dekor qo\'shildi', name);
        showToast('Декор добавлен');
      } else {
        throw new Error('Insert javob bo\'sh qaytdi: ' + JSON.stringify(data));
      }
    } else {
      // UPDATE existing Supabase decor
      const existingId = allDecors[idx].id;
      const res = await fetch('/sb/decor-update?id=' + existingId, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(decor)
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(typeof data.error === 'string' ? data.error : JSON.stringify(data.error));
      }
      if (Array.isArray(data) && data.length > 0) {
        data[0]._source = 'supabase';
        allDecors[idx] = data[0];
      } else {
        allDecors[idx] = { ...allDecors[idx], ...decor };
      }
      addActivity('Dekor tahrirlandi', name);
      showToast('Декор обновлен');
    }
  } catch (err) {
    showToast('Xatolik: ' + err.message, 'error');
    console.error('Save error:', err);
  }

  updateDecorCount();
  applyFilters();
  closeDecorModal();
});

// ========== DELETE MODAL ==========
const deleteModal = document.getElementById('deleteModal');
const deleteDecorNameEl = document.getElementById('deleteDecorName');

function openDeleteModal(idx) {
  deleteTargetIndex = idx;
  deleteDecorNameEl.textContent = `"${allDecors[idx].name}"`;
  deleteModal.classList.add('active');
}

function closeDeleteModal() { deleteModal.classList.remove('active'); deleteTargetIndex = -1; }

document.getElementById('deleteModalClose').addEventListener('click', closeDeleteModal);
document.getElementById('deleteCancelBtn').addEventListener('click', closeDeleteModal);
deleteModal.addEventListener('click', (e) => { if (e.target === deleteModal) closeDeleteModal(); });

document.getElementById('deleteConfirmBtn').addEventListener('click', async () => {
  if (deleteTargetIndex >= 0 && deleteTargetIndex < allDecors.length) {
    const decor = allDecors[deleteTargetIndex];
    const name = decor.name;
    try {
      // DELETE from Supabase
      await fetch('/sb/decor-delete?id=' + decor.id, { method: 'POST' });
      allDecors.splice(deleteTargetIndex, 1);
      addActivity('Dekor o\'chirildi', name);
      showToast('Декор удален');
    } catch (err) {
      showToast('O\'chirishda xatolik', 'error');
      console.error(err);
    }
    updateDecorCount();
    applyFilters();
  }
  closeDeleteModal();
});

// ========== KEYBOARD ==========
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDecorModal();
    closeDeleteModal();
  }
});
