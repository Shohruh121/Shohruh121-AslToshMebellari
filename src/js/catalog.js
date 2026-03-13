import stones from '../data/stones.json';

// ============ TELEGRAM CONFIG ============
const TELEGRAM_BOT_TOKEN = '8149591957:AAHXf76-EEPoqWB6tIfW8B7xjmE3o9fKvB8';
const TELEGRAM_CHAT_IDS = ['1093264285', '5114247292'];

// ============ LANGUAGE SYSTEM ============
let currentLang = 'ru';

function switchLanguage(lang) {
  currentLang = lang;
  document.querySelectorAll('[data-ru][data-uz]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text) {
      if (el.children.length === 0) {
        el.textContent = text;
      } else if (el.tagName === 'A' || el.tagName === 'BUTTON') {
        const span = el.querySelector('span[data-ru]');
        if (span) {
          span.textContent = span.getAttribute(`data-${lang}`);
        } else {
          for (const node of el.childNodes) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
              node.textContent = text;
              break;
            }
          }
        }
      }
    }
  });

  const newBtnText = lang === 'ru' ? 'UZ' : 'RU';
  const langBtn = document.getElementById('langToggle');
  const langBtnMobile = document.getElementById('langToggleMobile');
  if (langBtn) langBtn.textContent = newBtnText;
  if (langBtnMobile) langBtnMobile.textContent = newBtnText;

  // Update search placeholder
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.placeholder = lang === 'ru' ? 'Поиск по названию...' : 'Tosh nomini qidiring...';
  }

  renderStones();
}

// ============ DOM ELEMENTS ============
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ============ MOBILE MENU ============
const hamburger = $('#hamburger');
const mobileMenu = $('#mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('active');
  document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

$$('.mobile-nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ============ BACK TO TOP ============
window.addEventListener('scroll', () => {
  const backToTop = $('#backToTop');
  if (window.scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

$('#backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============ STONE CATALOG ============
const stoneGrid = $('#stoneGrid');
const noResults = $('#noResults');
const resultsCount = $('#resultsCount');
let currentFilter = 'all';
let searchQuery = '';

function createStoneCard(stone, index) {
  const card = document.createElement('div');
  card.className = 'stone-card reveal active';
  card.dataset.type = stone.type;
  card.dataset.id = stone.id;

  const detailText = currentLang === 'ru' ? 'Подробнее' : "Batafsil ko'rish";
  const detailShort = currentLang === 'ru' ? 'Подробнее' : 'Batafsil';
  const collText = currentLang === 'ru' ? 'коллекция' : 'kolleksiya';

  card.innerHTML = `
    <div class="relative overflow-hidden">
      <img src="${stone.thumbnail}" alt="${stone.name}" class="stone-card-image" loading="lazy" />
      <div class="stone-card-badge">${stone.category}</div>
      <div class="stone-card-overlay">
        <button class="btn-outline text-xs py-2 px-4 view-details-btn" data-id="${stone.id}">
          ${detailText}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </div>
    </div>
    <div class="stone-card-info">
      <div class="stone-card-type">${stone.category} ${collText}</div>
      <h3 class="stone-card-name">${stone.name}</h3>
      <p class="stone-card-desc">${stone.description}</p>
      <button class="stone-card-btn view-details-btn" data-id="${stone.id}">
        ${detailShort}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </button>
    </div>
  `;

  card.addEventListener('click', (e) => {
    if (!e.target.closest('.view-details-btn')) {
      openStoneModal(stone);
    }
  });

  card.querySelectorAll('.view-details-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openStoneModal(stone);
    });
  });

  return card;
}

function renderStones() {
  stoneGrid.innerHTML = '';

  const filtered = stones.filter((stone) => {
    const matchesFilter = currentFilter === 'all' || stone.category === currentFilter || stone.type === currentFilter;
    const matchesSearch = stone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          stone.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          stone.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          stone.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Update results count
  const countText = currentLang === 'ru'
    ? `Показано ${filtered.length} из ${stones.length} декоров`
    : `${filtered.length} / ${stones.length} ta dekor ko'rsatilmoqda`;
  resultsCount.textContent = countText;

  if (filtered.length === 0) {
    noResults.classList.remove('hidden');
    return;
  }

  noResults.classList.add('hidden');

  filtered.forEach((stone, index) => {
    stoneGrid.appendChild(createStoneCard(stone, index));
  });
}

// Initial render
renderStones();

// Filter buttons
$$('.filter-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    $$('.filter-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;

    stoneGrid.style.opacity = '0';
    stoneGrid.style.transform = 'translateY(20px)';

    setTimeout(() => {
      renderStones();
      stoneGrid.style.opacity = '1';
      stoneGrid.style.transform = 'translateY(0)';
    }, 300);
  });
});

// Search
let searchTimeout;
$('#searchInput').addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    searchQuery = e.target.value;
    renderStones();
  }, 300);
});

// Language toggle
const langToggle = document.getElementById('langToggle');
const langToggleMobile = document.getElementById('langToggleMobile');

function handleLangToggle() {
  const newLang = currentLang === 'ru' ? 'uz' : 'ru';
  switchLanguage(newLang);
}

if (langToggle) langToggle.addEventListener('click', handleLangToggle);
if (langToggleMobile) langToggleMobile.addEventListener('click', handleLangToggle);

// ============ STONE MODAL ============
const stoneModal = $('#stoneModal');
const modalBody = $('#modalBody');

function openStoneModal(stone) {
  const orderText = currentLang === 'ru' ? 'Заказать' : 'Buyurtma berish';
  const featTitle = currentLang === 'ru' ? 'Характеристики' : 'Xususiyatlari';
  const appTitle = currentLang === 'ru' ? 'Применение' : "Qo'llanilishi";
  const sizeLabel = currentLang === 'ru' ? 'Размер' : "O'lcham";
  const thickLabel = currentLang === 'ru' ? 'Толщина' : 'Qalinlik';
  const finishLabel = currentLang === 'ru' ? 'Обработка' : 'Ishlov turi';
  const originLabel = currentLang === 'ru' ? 'Происхождение' : 'Kelib chiqishi';

  modalBody.innerHTML = `
    <div class="modal-image-container">
      <img src="${stone.images[0]}" alt="${stone.name}" class="modal-image" id="modalMainImage" />
      ${stone.images.length > 1 ? `
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          ${stone.images.map((img, i) => `
            <img src="${img}" alt="" class="gallery-thumb ${i === 0 ? 'active' : ''}" data-index="${i}" />
          `).join('')}
        </div>
      ` : ''}
    </div>
    
    <div class="modal-body">
      <div class="flex flex-wrap items-center gap-3 mb-4">
        <span class="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-[rgba(200,164,92,0.1)] text-[#c8a45c] border border-[rgba(200,164,92,0.2)]">
          ${stone.type === 'akril' ? (currentLang === 'ru' ? 'Акрил' : 'Akril') : (currentLang === 'ru' ? 'Кварц' : 'Kvarts')}
        </span>
        <span class="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-[rgba(255,255,255,0.05)] text-[#8a8578]">
          ${stone.category}
        </span>
      </div>

      <h2 class="font-heading text-3xl md:text-4xl font-bold text-white mb-4">${stone.name}</h2>
      <p class="text-[#a8a8a8] leading-relaxed mb-8">${stone.description}</p>

      <div class="grid sm:grid-cols-2 gap-8 mb-8">
        <div>
          <h4 class="text-white font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c8a45c" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            ${featTitle}
          </h4>
          <div class="flex flex-wrap gap-2">
            ${stone.features.map((f) => `
              <span class="modal-feature-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                ${f}
              </span>
            `).join('')}
          </div>
        </div>
        
        <div>
          <h4 class="text-white font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c8a45c" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            ${appTitle}
          </h4>
          <div class="flex flex-wrap gap-2">
            ${stone.applications.map((a) => `
              <span class="inline-block px-3 py-1.5 text-xs bg-[rgba(255,255,255,0.05)] text-[#a8a8a8] border border-white/5">${a}</span>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 py-6 border-y border-white/5">
        <div>
          <div class="text-[#8a8578] text-xs tracking-wider uppercase mb-1">${sizeLabel}</div>
          <div class="text-white text-sm font-medium">${stone.size || '—'}</div>
        </div>
        <div>
          <div class="text-[#8a8578] text-xs tracking-wider uppercase mb-1">${thickLabel}</div>
          <div class="text-white text-sm font-medium">${stone.thickness.join(', ')}</div>
        </div>
        <div>
          <div class="text-[#8a8578] text-xs tracking-wider uppercase mb-1">${finishLabel}</div>
          <div class="text-white text-sm font-medium">${stone.finish.join(', ')}</div>
        </div>
        <div>
          <div class="text-[#8a8578] text-xs tracking-wider uppercase mb-1">${originLabel}</div>
          <div class="text-white text-sm font-medium">${stone.origin}</div>
        </div>
      </div>

      <button class="btn-primary w-full sm:w-auto justify-center order-stone-btn" data-id="${stone.id}">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        ${orderText}
      </button>
    </div>
  `;

  // Gallery thumb click
  modalBody.querySelectorAll('.gallery-thumb').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const index = parseInt(thumb.dataset.index);
      const mainImg = $('#modalMainImage');
      mainImg.style.opacity = '0';
      setTimeout(() => {
        mainImg.src = stone.images[index];
        mainImg.style.opacity = '1';
      }, 200);
      modalBody.querySelectorAll('.gallery-thumb').forEach((t) => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });

  // Order button
  modalBody.querySelector('.order-stone-btn').addEventListener('click', () => {
    closeStoneModal();
    setTimeout(() => openOrderModal(stone), 300);
  });

  stoneModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeStoneModal() {
  stoneModal.classList.remove('active');
  document.body.style.overflow = '';
}

$('#modalClose').addEventListener('click', closeStoneModal);
stoneModal.addEventListener('click', (e) => {
  if (e.target === stoneModal) closeStoneModal();
});

// ============ ORDER MODAL ============
const orderModal = $('#orderModal');
let selectedStone = null;

// Populate stone type select with unique types
function populateOrderStoneTypes() {
  const typeSelect = $('#orderStoneType');
  if (!typeSelect) return;
  const types = [...new Set(stones.map(s => s.type))];
  const typeLabels = {
    akril: { ru: 'Акриловый камень', uz: 'Akril tosh' },
    kvars: { ru: 'Кварцевый камень', uz: 'Kvarts tosh' },
  };
  typeSelect.innerHTML = `<option value="">${currentLang === 'ru' ? 'Выберите тип...' : 'Turni tanlang...'}</option>`;
  types.forEach(t => {
    const label = typeLabels[t] ? typeLabels[t][currentLang] : t;
    typeSelect.innerHTML += `<option value="${t}">${label}</option>`;
  });
}

// Populate decor select based on chosen type
function populateOrderDecors(type) {
  const decorSelect = $('#orderDecor');
  if (!decorSelect) return;
  if (!type) {
    decorSelect.innerHTML = `<option value="">${currentLang === 'ru' ? 'Сначала выберите тип...' : 'Avval turni tanlang...'}</option>`;
    return;
  }
  const filtered = stones.filter(s => s.type === type);
  decorSelect.innerHTML = `<option value="">${currentLang === 'ru' ? 'Выберите декор...' : 'Dekorni tanlang...'}</option>`;
  filtered.forEach(s => {
    decorSelect.innerHTML += `<option value="${s.id}">${s.name} (${s.category})</option>`;
  });
}

// Listen for type change
const orderStoneTypeSelect = $('#orderStoneType');
if (orderStoneTypeSelect) {
  orderStoneTypeSelect.addEventListener('change', (e) => {
    populateOrderDecors(e.target.value);
  });
}

// Listen for decor change — auto-select the stone
const orderDecorSelect = $('#orderDecor');
if (orderDecorSelect) {
  orderDecorSelect.addEventListener('change', (e) => {
    const stoneId = e.target.value;
    if (stoneId) {
      selectedStone = stones.find(s => s.id === stoneId) || null;
      if (selectedStone) {
        $('#orderStoneId').value = selectedStone.id;
        const label = currentLang === 'ru' ? 'Выбранный камень' : 'Tanlangan tosh';
        $('#orderStoneName').textContent = `${label}: ${selectedStone.name}`;
      }
    }
  });
}

function openOrderModal(stone) {
  selectedStone = stone;
  populateOrderStoneTypes();
  const label = currentLang === 'ru' ? 'Выбранный камень' : 'Tanlangan tosh';
  $('#orderStoneName').textContent = `${label}: ${stone ? stone.name : '—'}`;
  $('#orderStoneId').value = stone ? stone.id : '';

  if (stone) {
    const typeSelect = $('#orderStoneType');
    if (typeSelect) {
      typeSelect.value = stone.type;
      populateOrderDecors(stone.type);
      const decorSelect = $('#orderDecor');
      if (decorSelect) decorSelect.value = stone.id;
    }
  } else {
    populateOrderDecors('');
  }

  orderModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeOrderModal() {
  orderModal.classList.remove('active');
  document.body.style.overflow = '';
  selectedStone = null;
}

$('#orderModalClose').addEventListener('click', closeOrderModal);
orderModal.addEventListener('click', (e) => {
  if (e.target === orderModal) closeOrderModal();
});

// ============ TELEGRAM INTEGRATION ============
async function sendToTelegram(data) {
  const { name, phone, message, stone } = data;

  let text = `🏗 *YANGI BUYURTMA!*\n\n`;
  text += `👤 *Ism:* ${name}\n`;
  text += `📱 *Telefon:* ${phone}\n`;

  if (stone) {
    text += `\n🪨 *Tanlangan tosh:*\n`;
    text += `   • Nomi: ${stone.name}\n`;
    text += `   • Turi: ${stone.type}\n`;
    text += `   • Kategoriya: ${stone.category}\n`;
  }

  if (message) {
    text += `\n💬 *Xabar:* ${message}\n`;
  }

  text += `\n📅 *Sana:* ${new Date().toLocaleString('uz-UZ')}`;

  try {
    for (const chatId of TELEGRAM_CHAT_IDS) {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'Markdown',
        }),
      });

      // Send stone thumbnail image if available
      if (stone && stone.thumbnail) {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            photo: stone.thumbnail,
            caption: `🪨 ${stone.name} (${stone.category})`,
          }),
        });
      }
    }

    return true;
  } catch (error) {
    console.error('Telegram error:', error);
    return false;
  }
}

// ============ ORDER FORM SUBMIT ============
$('#orderForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = {
    name: formData.get('name'),
    phone: formData.get('phone'),
    message: formData.get('message'),
    stone: selectedStone,
  };

  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  const loadingText = currentLang === 'ru' ? 'Отправка...' : 'Yuborilmoqda...';
  btn.innerHTML = `
    <svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
    ${loadingText}
  `;
  btn.disabled = true;

  const success = await sendToTelegram(data);

  if (success) {
    const msg = currentLang === 'ru' ? 'Ваш заказ принят! Мы скоро свяжемся.' : "Buyurtmangiz qabul qilindi! Tez orada bog'lanamiz.";
    showToast(msg, 'success');
    e.target.reset();
    closeOrderModal();
  } else {
    const msg = currentLang === 'ru' ? 'Ошибка. Попробуйте ещё раз.' : "Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.";
    showToast(msg, 'error');
  }

  btn.innerHTML = originalText;
  btn.disabled = false;
});

// ============ TOAST NOTIFICATION ============
function showToast(message, type = 'success') {
  const toast = $('#toast');
  const toastMessage = $('#toastMessage');

  toastMessage.textContent = message;
  toast.className = 'toast';
  toast.classList.add(`toast-${type}`);

  const icon = toast.querySelector('svg');
  if (type === 'success') {
    icon.setAttribute('stroke', '#22c55e');
  } else {
    icon.setAttribute('stroke', '#ef4444');
  }

  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => { toast.classList.remove('show'); }, 4000);
}

// ============ KEYBOARD SHORTCUTS ============
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeStoneModal();
    closeOrderModal();
  }
});

// ============ TRANSITION STYLES ============
stoneGrid.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
