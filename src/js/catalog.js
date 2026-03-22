// ============ THEME (apply before DOM ready) ============
(function() {
  var savedTheme = localStorage.getItem('siteTheme') || 'dark';
  if (savedTheme === 'light') document.body.classList.add('light-mode');
})();

// ============ EVERYTHING INSIDE DOMContentLoaded ============
document.addEventListener('DOMContentLoaded', async function() {

// ---- Helpers ----
var $ = function(sel) { return document.querySelector(sel); };
var $$ = function(sel) { return document.querySelectorAll(sel); };

// ---- Config ----
// Telegram token va chat IDs server-side proxy orqali (.env da saqlanadi)

// ---- State ----
var stones = [];
var allStones = [];
var currentLang = localStorage.getItem('siteLang') || 'ru';
var currentType = 'all';
var currentCategory = 'all';
var searchQuery = '';
var selectedStone = null;
var searchTimeout;

// ---- DOM Elements ----
var stoneGrid = $('#stoneGrid');
var noResults = $('#noResults');
var resultsCount = $('#resultsCount');
var subFiltersEl = $('#subFilters');
var stoneModal = $('#stoneModal');
var modalBody = $('#modalBody');
var orderModal = $('#orderModal');

// ---- Sub-categories ----
var subCategories = {
  akril: ['Adventure', 'Carrara', 'Marble', 'Delicious', 'Sand', 'Pure', 'Natural', 'Exotic'],
  kvars: ['Kvarts', 'Kvarts Premium'],
  granit: ['PS Series', 'MS Series', 'GS Series', 'AS Series', 'Classic'],
};

// ---- Theme Toggle ----
function toggleTheme() {
  document.body.classList.toggle('light-mode');
  var isLight = document.body.classList.contains('light-mode');
  localStorage.setItem('siteTheme', isLight ? 'light' : 'dark');
}
var t1 = document.getElementById('themeToggle');
var t2 = document.getElementById('themeToggleMobile');
if (t1) t1.addEventListener('click', toggleTheme);
if (t2) t2.addEventListener('click', toggleTheme);

// ---- Language ----
function getDesc(stone) {
  if (currentLang === 'uz') return stone.description_uz || stone.description_ru || '';
  return stone.description_ru || stone.description_uz || '';
}

function switchLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('siteLang', lang);
  document.querySelectorAll('[data-ru][data-uz]').forEach(function(el) {
    var text = el.getAttribute('data-' + lang);
    if (text) {
      if (el.children.length === 0) {
        el.textContent = text;
      } else if (el.tagName === 'A' || el.tagName === 'BUTTON') {
        var span = el.querySelector('span[data-ru]');
        if (span) {
          span.textContent = span.getAttribute('data-' + lang);
        } else {
          for (var node of el.childNodes) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
              node.textContent = text;
              break;
            }
          }
        }
      }
    }
  });

  var newBtnText = lang === 'ru' ? 'UZ' : 'RU';
  var langBtn = document.getElementById('langToggle');
  var langBtnMobile = document.getElementById('langToggleMobile');
  if (langBtn) langBtn.textContent = newBtnText;
  if (langBtnMobile) langBtnMobile.textContent = newBtnText;

  var searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.placeholder = lang === 'ru' ? 'Поиск по названию...' : 'Tosh nomini qidiring...';
  }

  if (stoneGrid) renderStones();
}

// ---- Mobile Menu ----
var hamburger = $('#hamburger');
var mobileMenu = $('#mobileMenu');
if (hamburger) {
  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });
}
$$('.mobile-nav-link').forEach(function(link) {
  link.addEventListener('click', function() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ---- Back to Top ----
window.addEventListener('scroll', function() {
  var backToTop = $('#backToTop');
  if (backToTop) {
    if (window.scrollY > 500) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');
  }
});
var backToTopBtn = $('#backToTop');
if (backToTopBtn) backToTopBtn.addEventListener('click', function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- Stone Card ----
function createStoneCard(stone, index) {
  var card = document.createElement('div');
  card.className = 'stone-card reveal active';
  card.dataset.type = stone.type;
  card.dataset.id = stone.id;

  var detailText = currentLang === 'ru' ? 'Подробнее' : "Batafsil ko'rish";
  var detailShort = currentLang === 'ru' ? 'Подробнее' : 'Batafsil';
  var collText = currentLang === 'ru' ? 'коллекция' : 'kolleksiya';

  var aksiyaBadge = stone.type === 'granit'
    ? '<div class="absolute top-2 left-2 bg-red-600 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full z-10 animate-pulse">' + (currentLang === 'ru' ? 'Акция' : 'Aksiya') + '</div>'
    : '';

  card.innerHTML =
    '<div class="relative overflow-hidden">' +
      '<img src="' + stone.thumbnail + '" alt="' + stone.name + '" class="stone-card-image" loading="lazy" />' +
      aksiyaBadge +
      '<div class="stone-card-badge">' + stone.category + '</div>' +
      '<div class="stone-card-overlay">' +
        '<button class="btn-outline text-xs py-2 px-4 view-details-btn" data-id="' + stone.id + '">' +
          detailText +
          ' <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>' +
        '</button>' +
      '</div>' +
    '</div>' +
    '<div class="stone-card-info">' +
      '<div class="stone-card-type">' + stone.category + ' ' + collText + '</div>' +
      '<h3 class="stone-card-name">' + stone.name + '</h3>' +
      '<p class="stone-card-desc">' + getDesc(stone) + '</p>' +
      '<button class="stone-card-btn view-details-btn" data-id="' + stone.id + '">' +
        detailShort +
        ' <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>' +
      '</button>' +
    '</div>';

  card.addEventListener('click', function(e) {
    if (!e.target.closest('.view-details-btn')) openStoneModal(stone);
  });
  card.querySelectorAll('.view-details-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      openStoneModal(stone);
    });
  });

  return card;
}

// ---- Render Stones ----
function renderStones() {
  if (!stoneGrid) return;
  stoneGrid.innerHTML = '';

  var filtered = allStones.filter(function(stone) {
    var matchesType = currentType === 'all' || stone.type === currentType;
    var matchesCategory = currentCategory === 'all' || stone.category === currentCategory;
    var desc = getDesc(stone).toLowerCase();
    var q = searchQuery.toLowerCase();
    var matchesSearch = stone.name.toLowerCase().includes(q) ||
                        desc.includes(q) ||
                        stone.type.toLowerCase().includes(q) ||
                        stone.category.toLowerCase().includes(q);
    return matchesType && matchesCategory && matchesSearch;
  });

  var countText = currentLang === 'ru'
    ? 'Показано ' + filtered.length + ' из ' + allStones.length + ' декоров'
    : filtered.length + ' / ' + allStones.length + " ta dekor ko'rsatilmoqda";
  if (resultsCount) resultsCount.textContent = countText;

  if (filtered.length === 0) {
    if (noResults) noResults.classList.remove('hidden');
    return;
  }

  if (noResults) noResults.classList.add('hidden');

  filtered.forEach(function(stone, index) {
    stoneGrid.appendChild(createStoneCard(stone, index));
  });
}

// ---- Sub Filters ----
function buildSubFilters(type) {
  subFiltersEl.innerHTML = '';
  currentCategory = 'all';
  if (type === 'all' || !subCategories[type]) {
    subFiltersEl.classList.add('hidden');
    return;
  }
  subFiltersEl.classList.remove('hidden');

  var allBtn = document.createElement('button');
  allBtn.className = 'filter-btn sub-filter-btn active';
  allBtn.textContent = currentLang === 'ru' ? 'Все' : 'Barchasi';
  allBtn.dataset.category = 'all';
  subFiltersEl.appendChild(allBtn);

  subCategories[type].forEach(function(cat) {
    var btn = document.createElement('button');
    btn.className = 'filter-btn sub-filter-btn';
    btn.textContent = cat;
    btn.dataset.category = cat;
    subFiltersEl.appendChild(btn);
  });

  subFiltersEl.querySelectorAll('.sub-filter-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      subFiltersEl.querySelectorAll('.sub-filter-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      animateRender();
    });
  });
}

function animateRender() {
  stoneGrid.style.opacity = '0';
  stoneGrid.style.transform = 'translateY(20px)';
  setTimeout(function() {
    renderStones();
    stoneGrid.style.opacity = '1';
    stoneGrid.style.transform = 'translateY(0)';
  }, 300);
}

// ---- Type filter buttons ----
$$('#typeFilters .filter-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    $$('#typeFilters .filter-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    currentType = btn.dataset.type;
    buildSubFilters(currentType);
    animateRender();
  });
});

// ---- Search ----
var searchInputEl = $('#searchInput');
if (searchInputEl) {
  searchInputEl.addEventListener('input', function(e) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(function() {
      searchQuery = e.target.value;
      renderStones();
    }, 300);
  });
}

// ---- Language toggle buttons ----
var langToggle = document.getElementById('langToggle');
var langToggleMobile = document.getElementById('langToggleMobile');
function handleLangToggle() {
  var newLang = currentLang === 'ru' ? 'uz' : 'ru';
  switchLanguage(newLang);
}
if (langToggle) langToggle.addEventListener('click', handleLangToggle);
if (langToggleMobile) langToggleMobile.addEventListener('click', handleLangToggle);

// ---- Transition style ----
if (stoneGrid) stoneGrid.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

// ============ STONE MODAL ============
function openStoneModal(stone) {
  const orderText = currentLang === 'ru' ? 'Заказать' : 'Buyurtma berish';
  const featTitle = currentLang === 'ru' ? 'Характеристики' : 'Xususiyatlari';
  const appTitle = currentLang === 'ru' ? 'Применение' : "Qo'llanilishi";
  const sizeLabel = currentLang === 'ru' ? 'Размер' : "O'lcham";
  const thickLabel = currentLang === 'ru' ? 'Толщина' : 'Qalinlik';
  const finishLabel = currentLang === 'ru' ? 'Обработка' : 'Ishlov turi';
  const originLabel = currentLang === 'ru' ? 'Происхождение' : 'Kelib chiqishi';

  modalBody.innerHTML = `
    <div class="modal-image-container" id="galleryContainer">
      <div class="gallery-swipe" id="gallerySwipe" style="display:flex;width:${stone.images.length * 100}%;transition:transform 0.3s ease;">
        ${stone.images.map((img, i) => `
          <div style="width:${100 / stone.images.length}%;flex-shrink:0;overflow:hidden;">
            <img src="${img}" alt="${stone.name}" class="modal-image gallery-slide-img${stone.type === 'granit' ? ' granit-crop' : ''}" data-index="${i}" style="width:100%;height:100%;object-fit:cover;${stone.type === 'granit' ? 'object-position:center 20%;' : ''}" />
          </div>
        `).join('')}
      </div>
      ${!(stone.type === 'granit' && String(stone.id).startsWith('extra-') && stone.images.length <= 1) ? `
      <button class="absolute top-3 right-3 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white/80 hover:text-white hover:bg-black/70 transition-all cursor-pointer" id="fullscreenBtn" title="${currentLang === 'ru' ? 'Увеличить' : 'Kattalashtirish'}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
      </button>
      ` : ''}
      ${stone.images.length > 1 ? `
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2" id="galleryDots">
          ${stone.images.map((_, i) => `
            <span class="gallery-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>
          `).join('')}
        </div>
        <div class="absolute top-1/2 -translate-y-1/2 left-2 z-10">
          <button class="gallery-arrow" id="galleryPrev"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg></button>
        </div>
        <div class="absolute top-1/2 -translate-y-1/2 right-2 z-10">
          <button class="gallery-arrow" id="galleryNext"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></button>
        </div>
      ` : ''}
    </div>
    
    <div class="modal-body">
      <div class="flex flex-wrap items-center gap-3 mb-4">
        <span class="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-[rgba(200,164,92,0.1)] text-[#c8a45c] border border-[rgba(200,164,92,0.2)]">
          ${stone.type === 'akril' ? (currentLang === 'ru' ? 'Акрил' : 'Akril') : stone.type === 'granit' ? (currentLang === 'ru' ? 'Жидкий гранит' : 'Suyuq granit') : (currentLang === 'ru' ? 'Кварц' : 'Kvarts')}
        </span>
        <span class="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-[rgba(255,255,255,0.05)] text-[#8a8578]">
          ${stone.category}
        </span>
      </div>

      <h2 class="font-heading text-3xl md:text-4xl font-bold text-white mb-4">${stone.name}</h2>
      ${stone.type === 'granit' ? `
      <div class="mb-6 p-4 rounded-lg border border-red-500/30 bg-red-600/10">
        <div class="flex items-center gap-2 mb-2">
          <span class="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">${currentLang === 'ru' ? 'Акция' : 'Aksiya'}</span>
          <span class="text-red-400 font-semibold text-sm">${currentLang === 'ru' ? 'Мойка в подарок!' : 'Moyka sovg\'a!'}</span>
        </div>
        <p class="text-[#ccc] text-sm leading-relaxed">${currentLang === 'ru' ? 'При заказе столешницы из жидкого гранита — интегрированная мойка в подарок! Мойка изготавливается из того же материала, что и столешница, и встраивается бесшовно.' : 'Suyuq granitdan stol buyurtma berganingizda — integratsiyalangan moyka sovg\'a! Moyka xuddi shu materialdan tayyorlanadi va stolga chegsiz (bezshovniy) o\'rnatiladi.'}</p>
      </div>
      ` : ''}
      <p class="text-[#a8a8a8] leading-relaxed mb-8">${getDesc(stone)}</p>

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

  // ---- Gallery swipe logic ----
  let currentSlide = 0;
  const totalSlides = stone.images.length;
  const gallerySwipe = document.getElementById('gallerySwipe');
  const galleryDots = document.querySelectorAll('#galleryDots .gallery-dot');

  function goToSlide(idx) {
    currentSlide = Math.max(0, Math.min(idx, totalSlides - 1));
    if (gallerySwipe) gallerySwipe.style.transform = `translateX(-${currentSlide * (100 / totalSlides)}%)`;
    galleryDots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }

  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');
  if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

  galleryDots.forEach(dot => {
    dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.index)));
  });

  let touchStartX = 0;
  const galleryContainer = document.getElementById('galleryContainer');
  if (galleryContainer) {
    galleryContainer.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    galleryContainer.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) goToSlide(currentSlide + 1);
        else goToSlide(currentSlide - 1);
      }
    });
  }

  // ---- Fullscreen logic ----
  const oldFs = document.getElementById('fullscreenOverlay');
  if (oldFs) oldFs.remove();

  const fullscreenOverlay = document.createElement('div');
  fullscreenOverlay.id = 'fullscreenOverlay';
  fullscreenOverlay.className = 'fullscreen-overlay';
  fullscreenOverlay.innerHTML = `
    <button class="fullscreen-close" id="fullscreenClose"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    <img id="fullscreenImg" src="" alt="" class="${stone.type === 'granit' ? 'granit-crop-fs' : ''}" style="max-width:90vw;max-height:85vh;object-fit:${stone.type === 'granit' ? 'cover' : 'contain'};${stone.type === 'granit' ? 'object-position:center 20%;' : ''}" />
    ${stone.images.length > 1 ? `
      <div style="position:absolute;top:50%;left:12px;transform:translateY(-50%);z-index:9002;">
        <button class="gallery-arrow" id="fsPrev"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg></button>
      </div>
      <div style="position:absolute;top:50%;right:12px;transform:translateY(-50%);z-index:9002;">
        <button class="gallery-arrow" id="fsNext"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></button>
      </div>
      <div style="position:absolute;bottom:24px;left:50%;transform:translateX(-50%);display:flex;gap:12px;" id="fullscreenDots">
        ${stone.images.map((_, i) => `
          <span class="gallery-dot fullscreen-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>
        `).join('')}
      </div>
    ` : ''}
  `;
  document.body.appendChild(fullscreenOverlay);

  const fullscreenImg = document.getElementById('fullscreenImg');
  const fullscreenDots = document.querySelectorAll('#fullscreenDots .fullscreen-dot');
  let fsSlide = 0;

  function goToFsSlide(idx) {
    fsSlide = Math.max(0, Math.min(idx, totalSlides - 1));
    if (fullscreenImg) fullscreenImg.src = stone.images[fsSlide];
    fullscreenDots.forEach((d, i) => d.classList.toggle('active', i === fsSlide));
  }

  const isOldGranit = stone.type === 'granit' && String(stone.id).startsWith('extra-');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      // Eski granit dekorlar: 2-rasmdan (index 1) boshlash (1-rasmda logo bor)
      if (isOldGranit && stone.images.length > 1) {
        fsSlide = 1;
      } else {
        fsSlide = currentSlide;
      }
      goToFsSlide(fsSlide);
      fullscreenOverlay.classList.add('active');
    });
  }

  document.getElementById('fullscreenClose').addEventListener('click', () => {
    fullscreenOverlay.classList.remove('active');
  });
  fullscreenOverlay.addEventListener('click', (e) => {
    if (e.target === fullscreenOverlay) fullscreenOverlay.classList.remove('active');
  });

  // Fullscreen arrows
  const fsPrev = document.getElementById('fsPrev');
  const fsNext = document.getElementById('fsNext');
  if (fsPrev) fsPrev.addEventListener('click', () => goToFsSlide(fsSlide - 1));
  if (fsNext) fsNext.addEventListener('click', () => goToFsSlide(fsSlide + 1));

  fullscreenDots.forEach(dot => {
    dot.addEventListener('click', () => goToFsSlide(parseInt(dot.dataset.index)));
  });

  let fsTouchStartX = 0;
  fullscreenOverlay.addEventListener('touchstart', (e) => { fsTouchStartX = e.touches[0].clientX; }, { passive: true });
  fullscreenOverlay.addEventListener('touchend', (e) => {
    const diff = fsTouchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) goToFsSlide(fsSlide + 1);
      else goToFsSlide(fsSlide - 1);
    }
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
  const fs = document.getElementById('fullscreenOverlay');
  if (fs) fs.remove();
}

if ($('#modalClose')) $('#modalClose').addEventListener('click', closeStoneModal);
if (stoneModal) stoneModal.addEventListener('click', function(e) {
  if (e.target === stoneModal) closeStoneModal();
});

// ============ ORDER MODAL ============
// Populate stone type select with unique types
function populateOrderStoneTypes() {
  const typeSelect = $('#orderStoneType');
  if (!typeSelect) return;
  const types = [...new Set(allStones.map(s => s.type))];
  const typeLabels = {
    akril: { ru: 'Акриловый камень', uz: 'Akril tosh' },
    kvars: { ru: 'Кварцевый камень', uz: 'Kvarts tosh' },
    granit: { ru: 'Жидкий гранит', uz: 'Suyuq granit' },
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
  const filtered = allStones.filter(s => s.type === type);
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
      selectedStone = allStones.find(s => s.id === stoneId) || null;
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

if ($('#orderModalClose')) $('#orderModalClose').addEventListener('click', closeOrderModal);
if (orderModal) orderModal.addEventListener('click', function(e) {
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
    // Send text via server proxy (token hidden in .env)
    await fetch('/tg/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    // Send stone thumbnail image if available
    if (stone && stone.thumbnail) {
      var photoForm = new FormData();
      photoForm.append('photo', stone.thumbnail);
      photoForm.append('caption', `🪨 ${stone.name} (${stone.category})`);
      await fetch('/tg/sendPhoto', {
        method: 'POST',
        body: photoForm,
      });
    }

    return true;
  } catch (error) {
    console.error('Telegram error:', error);
    return false;
  }
}

// ============ ORDER FORM SUBMIT ============
var orderFormEl = $('#orderForm');
if (orderFormEl) orderFormEl.addEventListener('submit', async (e) => {
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
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeStoneModal();
    closeOrderModal();
  }
});

// ============ LOAD STONES DATA & INITIAL RENDER ============
async function loadStonesData() {
  try {
    var response = await fetch('/stones.json');
    if (response.ok) {
      stones = await response.json();
      console.log('Stones loaded:', stones.length);
      return true;
    }
    console.error('Failed to load stones:', response.status);
    return false;
  } catch (error) {
    console.error('Error loading stones:', error);
    return false;
  }
}

var loaded = await loadStonesData();
if (loaded) {
  allStones = stones.slice();
  renderStones();
} else {
  console.error('Failed to load stones data');
}

// Load admin-added decors from Supabase
try {
  var sbRes = await fetch('/sb/decors');
  if (sbRes.ok) {
    var sbDecors = await sbRes.json();
    if (Array.isArray(sbDecors) && sbDecors.length > 0) {
      var formatted = sbDecors.map(function(d) {
        return {
          id: 'sb-' + d.id,
          name: d.name || '',
          type: d.type || '',
          category: d.category || '',
          thumbnail: d.thumbnail || (Array.isArray(d.images) ? d.images[0] : ''),
          images: Array.isArray(d.images) ? d.images : (typeof d.images === 'string' ? JSON.parse(d.images) : []),
          features: Array.isArray(d.features) ? d.features : [],
          thickness: Array.isArray(d.thickness) ? d.thickness : [],
          finish: Array.isArray(d.finish) ? d.finish : [],
          origin: d.origin || '',
          applications: Array.isArray(d.applications) ? d.applications : [],
          size: d.size || '',
          description_uz: d.description_uz || '',
          description_ru: d.description_ru || ''
        };
      });
      allStones = formatted.concat(allStones);
      renderStones();
    }
  }
} catch (err) {
  console.error('Error loading Supabase decors:', err);
}

// Apply saved language
if (currentLang !== 'ru') {
  switchLanguage(currentLang);
}

}); // end DOMContentLoaded
