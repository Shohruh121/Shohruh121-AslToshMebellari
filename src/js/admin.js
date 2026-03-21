
// Admin Panel Logic for Asl Tosh Mebellari

const sidebarItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section-content');
const decorContainer = document.getElementById('decor-container');
const decorModal = document.getElementById('decor-modal');
const modalTitle = document.getElementById('modal-title');
const decorForm = document.getElementById('decor-form');
const addDecorBtn = document.getElementById('add-decor-btn');
const closeModalBtn = document.getElementById('close-modal');

let decors = [];

// Navigation
sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
        const sectionId = item.getAttribute('data-section');
        
        // Update active nav
        sidebarItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        // Show section
        sections.forEach(s => {
            s.classList.remove('active');
            if (s.id === sectionId) s.classList.add('active');
        });
    });
});

// Fetching Decors
async function loadDecors() {
    try {
        const response = await fetch('/granistone_all.json');
        if (!response.ok) throw new Error('Could not fetch decors');
        decors = await response.json();
        renderDecors(decors);
        document.getElementById('stat-decors').innerText = decors.length;
    } catch (err) {
        console.error(err);
        decorContainer.innerHTML = `<div class="p-8 text-center col-span-full text-red-500">Error loading decors: ${err.message}</div>`;
    }
}

function renderDecors(data) {
    if (data.length === 0) {
        decorContainer.innerHTML = `<div class="p-8 text-center col-span-full opacity-50">Ничего не найдено</div>`;
        return;
    }

    decorContainer.innerHTML = data.map((decor, index) => `
        <div class="decor-card" data-index="${index}">
            <div class="decor-img-container">
                <img src="${decor.img}" alt="${decor.name}" onerror="this.src='https://placehold.co/200x200?text=No+Image'">
            </div>
            <div class="decor-info">
                <div class="decor-name" title="${decor.name}">${decor.name}</div>
                <div class="decor-actions">
                    <button class="btn-icon btn-edit" onclick="editDecor(${index})">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteDecor(${index})">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Global functions for inline event listeners
window.editDecor = (index) => {
    const decor = decors[index];
    modalTitle.innerText = 'Редактировать декор';
    document.getElementById('decor-index').value = index;
    document.getElementById('decor-input-name').value = decor.name;
    document.getElementById('decor-input-img').value = decor.img;
    decorModal.classList.add('active');
};

window.deleteDecor = (index) => {
    if (confirm(`Удалить декор "${decors[index].name}"?`)) {
        decors.splice(index, 1);
        renderDecors(decors);
        document.getElementById('stat-decors').innerText = decors.length;
        saveMessage('Декор успешно удален (только в браузере)');
    }
};

// Search
document.getElementById('decor-search').addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    const filtered = decors.filter(d => d.name.toLowerCase().includes(val));
    renderDecors(filtered);
});

// Modal Logic
addDecorBtn.addEventListener('click', () => {
    modalTitle.innerText = 'Добавить новый декор';
    document.getElementById('decor-index').value = '-1';
    decorForm.reset();
    decorModal.classList.add('active');
});

closeModalBtn.addEventListener('click', () => {
    decorModal.classList.remove('active');
});

decorForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const index = parseInt(document.getElementById('decor-index').value);
    const newDecor = {
        name: document.getElementById('decor-input-name').value,
        img: document.getElementById('decor-input-img').value
    };

    if (index === -1) {
        decors.unshift(newDecor);
    } else {
        decors[index] = newDecor;
    }

    renderDecors(decors);
    document.getElementById('stat-decors').innerText = decors.length;
    decorModal.classList.remove('active');
    saveMessage('Изменения сохранены (только в браузере)');
});

function saveMessage(msg) {
    // A simple toast-like notification could be added here
    console.log(msg);
    alert(msg + "\n\nВнимание: Изменения сохраняются только в текущей сессии браузера. Для перманентного сохранения необходимо подключить серверную часть.");
}

// Gallery Management
const galleryContainer = document.getElementById('gallery-container');
const uploadImgBtn = document.getElementById('upload-img-btn');

let galleryImages = [
    { name: 'Modern Kitchen Hero', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400' },
    { name: 'Classic Kitchen Showroom', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400' },
    { name: 'Bathroom Luxury', img: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400' }
];

function renderGallery() {
    galleryContainer.innerHTML = galleryImages.map((item, index) => `
        <div class="decor-card">
            <div class="decor-img-container">
                <img src="${item.img}" alt="${item.name}">
            </div>
            <div class="decor-info">
                <div class="decor-name">${item.name}</div>
                <div class="decor-actions">
                    <button class="btn-icon btn-delete" onclick="deleteGalleryImage(${index})">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

window.deleteGalleryImage = (index) => {
    if (confirm('Удалить изображение из галереи?')) {
        galleryImages.splice(index, 1);
        renderGallery();
    }
};

uploadImgBtn.addEventListener('click', () => {
    const url = prompt('Введите URL изображения:');
    if (url) {
        galleryImages.unshift({ name: 'Новое изображение', img: url });
        renderGallery();
    }
});

// Initial Load
loadDecors();
renderGallery();

// Mock some stats updates
function updateStats() {
    const visitors = document.getElementById('stat-visitors');
    const orders = document.getElementById('stat-orders');
    
    // Initial random stats
    visitors.innerText = (Math.floor(Math.random() * 5000) + 1000).toLocaleString();
    orders.innerText = (Math.floor(Math.random() * 50) + 5).toString();

    // Simulate real-time updates
    setInterval(() => {
        const v = parseInt(visitors.innerText.replace(',', '')) + Math.floor(Math.random() * 3);
        visitors.innerText = v.toLocaleString();
    }, 4000);
}

updateStats();
