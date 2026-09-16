document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. AÇILIŞ EKRANI SİMÜLASYONU
    // ==========================================
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        const main = document.getElementById('main-content');
        if(splash && main) {
            splash.style.opacity = '0';
            splash.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                splash.style.display = 'none';
                main.style.display = 'block';
            }, 500); 
        }
    }, 1500);

    // ==========================================
    // 2. KARANLIK / AYDINLIK MOD DEĞİŞTİRİCİ
    // ==========================================
    const themeBtn = document.getElementById('theme-toggle');
    if(themeBtn) {
        const themeIcon = themeBtn.querySelector('i');
        const savedTheme = localStorage.getItem('saklibahce_theme');
        
        if (savedTheme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }

        themeBtn.addEventListener('click', () => {
            const isDark = document.body.getAttribute('data-theme') === 'dark';
            if (isDark) {
                document.body.removeAttribute('data-theme');
                themeIcon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('saklibahce_theme', 'light'); 
            } else {
                document.body.setAttribute('data-theme', 'dark');
                themeIcon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('saklibahce_theme', 'dark'); 
            }
        });
    }

    // ==========================================
    // 3. YANDAN AÇILAN MENÜ & AKILLI ÜST BAR
    // ==========================================
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sideDrawer = document.getElementById('side-drawer');
    const closeDrawerBtn = document.getElementById('close-drawer');
    
    if(hamburgerBtn && sideDrawer && closeDrawerBtn) {
        hamburgerBtn.addEventListener('click', () => sideDrawer.classList.add('open'));
        closeDrawerBtn.addEventListener('click', () => sideDrawer.classList.remove('open'));
    }

    let lastScrollY = window.scrollY;
    const smartHeader = document.getElementById('smart-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            smartHeader.classList.add('hidden'); 
        } else {
            smartHeader.classList.remove('hidden'); 
        }
        lastScrollY = window.scrollY;
    });

    // ==========================================
    // 4. MODAL (CEP EKRANI) VE LIGHTBOX (GALERİ) REFERANSLARI
    // ==========================================
    const menuContainer = document.getElementById('menu-container');
    const itemModal = document.getElementById('item-modal');
    const lightboxModal = document.getElementById('lightbox-modal');

    // Yemek Detay Elemanları
    const modalItemImage = document.getElementById('modal-item-image');
    const modalItemTitle = document.getElementById('modal-item-title');
    const modalItemCategory = document.getElementById('modal-item-category');
    const modalItemPrice = document.getElementById('modal-item-price');
    const modalItemDescription = document.getElementById('modal-item-description');
    const modalItemVideo = document.getElementById('modal-item-video');

    // Açma Fonksiyonu - YEMEK
    function openItemModal(itemData) {
        if(modalItemImage) {
            modalItemImage.src = itemData.image || ''; 
            modalItemImage.alt = itemData.title;
        }
        if(modalItemTitle) modalItemTitle.textContent = itemData.title;
        if(modalItemCategory) modalItemCategory.textContent = itemData.category;
        if(modalItemPrice) modalItemPrice.textContent = itemData.price;
        if(modalItemDescription) modalItemDescription.textContent = itemData.description;
        
        // Video Zekası
        if (modalItemVideo) {
            if (itemData.video && itemData.video.trim() !== '') {
                modalItemVideo.href = itemData.video;
                modalItemVideo.style.display = 'inline-flex';
            } else {
                modalItemVideo.style.display = 'none';
                modalItemVideo.href = '#';
            }
        }
        
        if(itemModal) {
            itemModal.style.display = 'flex';
            setTimeout(() => itemModal.classList.add('show'), 10);
        }
    }

    // Açma Fonksiyonu - GALERİ
    function openLightboxModal(imageSrc) {
        const lightboxImage = document.getElementById('lightbox-image');
        if(lightboxImage) lightboxImage.src = imageSrc;
        if(lightboxModal) {
            lightboxModal.style.display = 'flex';
            setTimeout(() => lightboxModal.classList.add('show'), 10);
        }
    }

    // ==========================================
    // 5. TEK BİR TIKLAMA DİNLEYİCİSİ (KARMAŞAYI ÖNLER)
    // ==========================================
    if (menuContainer) {
        menuContainer.addEventListener('click', (e) => {
            // Durum 1: Galeri Resmine Tıklandıysa
            const galleryImg = e.target.closest('.gallery-img');
            if (galleryImg) {
                openLightboxModal(galleryImg.getAttribute('src'));
                return; 
            }

            // Durum 2: Yemek Kartına Tıklandıysa
            const card = e.target.closest('.menu-card');
            if (card) {
                const itemData = {
                    title: card.getAttribute('data-item-title'),
                    category: card.getAttribute('data-item-category'),
                    price: card.getAttribute('data-item-price'),
                    description: card.getAttribute('data-item-description'),
                    image: card.getAttribute('data-item-image'),
                    video: card.getAttribute('data-item-video')
                };
                openItemModal(itemData);
            }
        });
    }

    // Tüm Ekranları Kapatma Fonksiyonu
    function closeAllModals() {
        if (itemModal && itemModal.classList.contains('show')) {
            itemModal.classList.remove('show');
            setTimeout(() => itemModal.style.display = 'none', 400);
        }
        if (lightboxModal && lightboxModal.classList.contains('show')) {
            lightboxModal.classList.remove('show');
            setTimeout(() => lightboxModal.style.display = 'none', 500);
        }
        const aboutModal = document.getElementById('about-modal');
        if (aboutModal && aboutModal.classList.contains('show')) {
            aboutModal.classList.remove('show');
            setTimeout(() => aboutModal.style.display = 'none', 400);
        }
    }

    // Modal Kapatma Tetikleyicileri
    document.querySelectorAll('.modal-close-icon, .lightbox-close-icon, #modal-close-btn').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('lightbox-overlay')) {
            closeAllModals();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllModals();
    });

    // ==========================================
    // 6. HAKKIMIZDA MODALI İŞLEMLERİ
    // ==========================================
    const btnHakkimizda = document.getElementById('btn-hakkimizda');
    const aboutModal = document.getElementById('about-modal');

    if (btnHakkimizda && aboutModal) {
        btnHakkimizda.addEventListener('click', (e) => {
            e.preventDefault(); 
            if (sideDrawer) sideDrawer.classList.remove('open'); 
            aboutModal.style.display = 'flex';
            setTimeout(() => aboutModal.classList.add('show'), 10);
        });
    }

    // ==========================================
    // 7. MENÜ VERİSİNİ ÇEKME VE LİSTELEME
    // ==========================================
    fetch('aamenu.json')
        .then(response => response.json())
        .then(data => {
            const categoryList = document.getElementById('category-list');
            if(!categoryList || !menuContainer) return;

            const galleryImages = ['galeri1.jpg', 'galeri2.jpg', 'galeri3.jpg', 'galeri4.jpg', 'galeri5.jpg', 'galeri6.jpg'];

            // Kategori Butonları Oluşturuluyor
            categoryList.innerHTML = `<li class="active" data-category="Tümü">Tümü</li>`;
            data.forEach(cat => {
                categoryList.innerHTML += `<li data-category="${cat.category}">${cat.category}</li>`;
            });
            categoryList.innerHTML += `<li data-category="Restoranımız">Restoranımız</li>`;

            // Kartları Çizen Fonksiyon
            function renderItems(selectedCategory) {
                menuContainer.innerHTML = ''; 

                if (selectedCategory === 'Restoranımız') {
                    let galleryHTML = '<div class="gallery-grid">';
                    galleryImages.forEach(img => {
                        galleryHTML += `<img src="${img}" class="gallery-img" alt="Mekan Görseli">`;
                    });
                    galleryHTML += '</div>';
                    menuContainer.innerHTML = galleryHTML;
                    return; 
                }

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
                             data-item-video="${item.video || ''}" 
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

            // Sayfa ilk açılışta "Tümü" yüklensin
            renderItems('Tümü');

            // Kategori Tıklamaları (Filtre)
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
            if(menuContainer) menuContainer.innerHTML = '<p style="text-align:center; padding:20px;">Menü şu anda yüklenemedi. Lütfen sayfayı yenileyin.</p>';
        });

}); // <-- SON
