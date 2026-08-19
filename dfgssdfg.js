document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. GLOBAL DEĞİŞKENLER VE REFERANSLAR
    // (Aynı isimli değişkenlerin çakışmaması için sadece burada 1 kez tanımlıyoruz)
    // ==========================================
    const menuContainer = document.getElementById('menu-container');
    const categoryList = document.getElementById('category-list');
    
    // Tema, Header ve Sidebar
    const themeBtn = document.getElementById('theme-toggle');
    const smartHeader = document.getElementById('smart-header');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sideDrawer = document.getElementById('side-drawer');
    const closeDrawerBtn = document.getElementById('close-drawer');

    // Yemek Detay Modalı (Cep Ekranı)
    const itemModal = document.getElementById('item-modal');
    const modalItemImage = document.getElementById('modal-item-image');
    const modalItemTitle = document.getElementById('modal-item-title');
    const modalItemCategory = document.getElementById('modal-item-category');
    const modalItemPrice = document.getElementById('modal-item-price');
    const modalItemDescription = document.getElementById('modal-item-description');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    // Galeri Modalı (Lightbox)
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImage = document.getElementById('lightbox-image');

    // ==========================================
    // 2. AÇILIŞ EKRANI (KİLİTLENMEYİ ÖNLER)
    // ==========================================
    function hideSplashScreen() {
        const splash = document.getElementById('splash-screen');
        const main = document.getElementById('main-content');
        if (splash && main) {
            splash.style.opacity = '0';
            splash.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                splash.style.display = 'none';
                main.style.display = 'block';
            }, 500);
        }
    }
    // Veri gelse de gelmese de, kod çökse de 1.5 saniye sonra ekranı MUTLAKA açar.
    setTimeout(hideSplashScreen, 1500);

    // ==========================================
    // 3. KARANLIK / AYDINLIK MOD
    // ==========================================
    if (themeBtn) {
        const themeIcon = themeBtn.querySelector('i');
        const savedTheme = localStorage.getItem('saklibahce_theme');

        if (savedTheme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
        }

        themeBtn.addEventListener('click', () => {
            const isDark = document.body.getAttribute('data-theme') === 'dark';
            if (isDark) {
                document.body.removeAttribute('data-theme');
                if (themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('saklibahce_theme', 'light');
            } else {
                document.body.setAttribute('data-theme', 'dark');
                if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('saklibahce_theme', 'dark');
            }
        });
    }

    // ==========================================
    // 4. AKILLI ÜST BAR VE YAN MENÜ
    // ==========================================
    let lastScrollY = window.scrollY;
    if (smartHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > lastScrollY && window.scrollY > 100) {
                smartHeader.classList.add('hidden'); // Aşağı kaydırırken gizle
            } else {
                smartHeader.classList.remove('hidden'); // Yukarı çıkarken göster
            }
            lastScrollY = window.scrollY;
        });
    }

    if (hamburgerBtn && sideDrawer && closeDrawerBtn) {
        hamburgerBtn.addEventListener('click', () => sideDrawer.classList.add('open'));
        closeDrawerBtn.addEventListener('click', () => sideDrawer.classList.remove('open'));
    }

    // ==========================================
    // 5. MODAL VE LIGHTBOX FONKSİYONLARI
    // ==========================================
    function closeAllModals() {
        if (itemModal && itemModal.classList.contains('show')) {
            itemModal.classList.remove('show');
            setTimeout(() => itemModal.style.display = 'none', 400);
        }
        if (lightboxModal && lightboxModal.classList.contains('show')) {
            lightboxModal.classList.remove('show');
            setTimeout(() => lightboxModal.style.display = 'none', 500);
        }
    }

    function openItemModal(itemData) {
        if (!itemModal) return;
        if (modalItemImage) {
            modalItemImage.src = itemData.image || '';
            modalItemImage.alt = itemData.title || 'Ürün Görseli';
        }
        if (modalItemTitle) modalItemTitle.textContent = itemData.title || '';
        if (modalItemCategory) modalItemCategory.textContent = itemData.category || '';
        if (modalItemPrice) modalItemPrice.textContent = itemData.price || '';
        if (modalItemDescription) modalItemDescription.textContent = itemData.description || '';
        
        itemModal.style.display = 'flex';
        setTimeout(() => itemModal.classList.add('show'), 10);
    }

    function openLightboxModal(imageSrc) {
        if (!lightboxModal) return;
        if (lightboxImage) lightboxImage.src = imageSrc;
        lightboxModal.style.display = 'flex';
        setTimeout(() => lightboxModal.classList.add('show'), 10);
    }

    // Kapatma Dinleyicileri
    if (itemModal) {
        const itemCloseIcon = itemModal.querySelector('.modal-close-icon');
        if (itemCloseIcon) itemCloseIcon.addEventListener('click', closeAllModals);
        if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeAllModals);
        itemModal.addEventListener('click', (e) => { if (e.target === itemModal) closeAllModals(); });
    }
    if (lightboxModal) {
        const lightCloseIcon = lightboxModal.querySelector('.lightbox-close-icon');
        if (lightCloseIcon) lightCloseIcon.addEventListener('click', closeAllModals);
        lightboxModal.addEventListener('click', (e) => { if (e.target === lightboxModal) closeAllModals(); });
    }
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAllModals(); });

    // ==========================================
    // 6. EVENT DELEGATION (KARTLARA VE GALERİYE TIKLAMA)
    // ==========================================
    if (menuContainer) {
        menuContainer.addEventListener('click', (e) => {
            // Galeri resmine tıklandıysa
            const galleryImg = e.target.closest('.gallery-img');
            if (galleryImg) {
                openLightboxModal(galleryImg.getAttribute('src'));
                return;
            }

            // Yemek kartına tıklandıysa
            const card = e.target.closest('.menu-card');
            if (card) {
                openItemModal({
                    title: card.getAttribute('data-item-title'),
                    category: card.getAttribute('data-item-category'),
                    price: card.getAttribute('data-item-price'),
                    description: card.getAttribute('data-item-description'),
                    image: card.getAttribute('data-item-image')
                });
            }
        });
    }

    // ==========================================
    // 7. MENÜ VERİSİNİ ÇEKME VE LİSTELEME
    // ==========================================
    const galleryImages = ['galeri1.jpg', 'galeri2.jpg', 'galeri3.jpg', 'galeri4.jpg', 'galeri5.jpg', 'galeri6.jpg'];

    fetch('aamenu.json')
        .then(response => {
            if (!response.ok) throw new Error("JSON dosyası okunamadı.");
            return response.json();
        })
        .then(data => {
            if (!categoryList || !menuContainer) return;

            // Kategorileri Oluştur
            categoryList.innerHTML = `<li class="active" data-category="Tümü">Tümü</li>`;
            data.forEach(cat => {
                categoryList.innerHTML += `<li data-category="${cat.category}">${cat.category}</li>`;
            });
            categoryList.innerHTML += `<li data-category="Restoranımız">Restoranımız</li>`;

            // Ekrana Çizme Fonksiyonu
            function renderItems(selectedCategory) {
                menuContainer.innerHTML = '';

                // Galeri Render
                if (selectedCategory === 'Restoranımız') {
                    let galleryHTML = '<div class="gallery-grid">';
                    galleryImages.forEach(img => {
                        galleryHTML += `<img src="${img}" class="gallery-img" alt="Mekan Görseli">`;
                    });
                    galleryHTML += '</div>';
                    menuContainer.innerHTML = galleryHTML;
                    return;
                }

                // Menü Render
                let itemsToRender = [];
                if (selectedCategory === 'Tümü') {
                    data.forEach(cat => {
                        const categoryItems = JSON.parse(JSON.stringify(cat.items));
                        categoryItems.forEach(item => item.item_category = cat.category);
                        itemsToRender = itemsToRender.concat(categoryItems);
                    });
                } else {
                    const foundCat = data.find(c => c.category === selectedCategory);
                    if (foundCat) {
                        itemsToRender = JSON.parse(JSON.stringify(foundCat.items));
                        itemsToRender.forEach(item => item.item_category = selectedCategory);
                    }
                }

                itemsToRender.forEach(item => {
                    menuContainer.innerHTML += `
                        <div class="menu-card" 
                             data-item-category="${item.item_category || ''}" 
                             data-item-price="${item.price || ''}"
                             data-item-description="${item.description || ''}"
                             data-item-image="${item.image || ''}"
                             data-item-title="${item.name || ''}">
                            ${item.image ? `<img src="${item.image}" alt="${item.name}" class="menu-card-img">` : ''}
                            <div class="menu-card-info">
                                <div class="menu-card-header">
                                    <h3 class="menu-card-title">${item.name}</h3>
                                    <span class="menu-card-price">${item.price}</span>
                                </div>
                                ${item.description ? `<p class="menu-card-desc">${item.description}</p>` : ''}
                            </div>
                        </div>
                    `;
                });
            }

            renderItems('Tümü');

            // Kategori Filtreleme
            categoryList.addEventListener('click', (e) => {
                const li = e.target.closest('li');
                if (li) {
                    categoryList.querySelectorAll('li').forEach(el => el.classList.remove('active'));
                    li.classList.add('active');
                    renderItems(li.getAttribute('data-category'));
                }
            });
        })
        .catch(err => {
            console.error("Menü yüklenirken hata oluştu:", err);
            if (menuContainer) {
                menuContainer.innerHTML = '<p style="text-align:center; padding:20px; color:#999;">Menü şu anda yüklenemedi. Lütfen sayfayı yenileyin.</p>';
            }
        });

});