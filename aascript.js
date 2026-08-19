document.addEventListener('DOMContentLoaded', () => {
    
    // 1. AÇILIŞ EKRANI SİMÜLASYONU
    setTimeout(() => {
        document.getElementById('splash-screen').style.opacity = '0';
        document.getElementById('splash-screen').style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.getElementById('splash-screen').style.display = 'none';
            document.getElementById('main-content').style.display = 'block';
        }, 500); 
    }, 1500);

    // 2. KARANLIK / AYDINLIK MOD DEĞİŞTİRİCİ VE HAFIZA (LOCALSTORAGE)
    const themeBtn = document.getElementById('theme-toggle');
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

    // 3. MENÜ VERİSİNİ ÇEKME VE FİLTRELEME MOTORU
    fetch('aamenu.json')
        .then(response => response.json())
        .then(data => {
            const categoryList = document.getElementById('category-list');
            const menuContainer = document.getElementById('menu-container');

            // Galeri Resimlerimiz
            const galleryImages = ['galeri1.jpg', 'galeri2.jpg', 'galeri3.jpg', 'galeri4.jpg', 'galeri5.jpg', 'galeri6.jpg'];

            // Kategorileri Oluştur
            categoryList.innerHTML = `<li class="active" data-category="Tümü">Tümü</li>`;
            data.forEach(cat => {
                categoryList.innerHTML += `<li data-category="${cat.category}">${cat.category}</li>`;
            });
            // En sona "Restoranımız" kategorisini ekliyoruz
            categoryList.innerHTML += `<li data-category="Restoranımız">Restoranımız</li>`;

            // Ürünleri Ekrana Çizen Fonksiyon
            function renderItems(selectedCategory) {
                menuContainer.innerHTML = ''; 

                // Eğer Restoranımız seçildiyse menüleri değil, galeriyi çiz
                if (selectedCategory === 'Restoranımız') {
                    let galleryHTML = '<div class="gallery-grid">';
                    galleryImages.forEach(img => {
                        galleryHTML += `<img src="${img}" class="gallery-img" alt="Mekan Görseli">`;
                    });
                    galleryHTML += '</div>';
                    menuContainer.innerHTML = galleryHTML;
                    return; 
                }

                // Normal Menü Kartları İşlemi
                let itemsToRender = [];
                if (selectedCategory === 'Tümü') {
                    data.forEach(cat => itemsToRender = itemsToRender.concat(cat.items));
                } else {
                    const foundCat = data.find(c => c.category === selectedCategory);
                    if (foundCat) itemsToRender = foundCat.items;
                }

                // Yemekleri Ekrana Bas
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

            categoryList.addEventListener('click', (e) => {
                if (e.target.tagName === 'LI') {
                    categoryList.querySelectorAll('li').forEach(li => li.classList.remove('active'));
                    e.target.classList.add('active');
                    
                    const categoryName = e.target.getAttribute('data-category');
                    renderItems(categoryName);
                }
            });
        })
        .catch(err => {
            console.error("Menü yüklenirken hata oluştu:", err);
            document.getElementById('menu-container').innerHTML = '<p style="text-align:center; padding:20px;">Menü yüklenemedi. Lütfen sayfayı yenileyin.</p>';
        });

        // ==========================================
    // YENİ EKLENEN: YANDAN AÇILAN MENÜ İŞLEMLERİ
    // ==========================================
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sideDrawer = document.getElementById('side-drawer');
    const closeDrawerBtn = document.getElementById('close-drawer');

    // 3 Çizgiye basınca menüyü aç
    hamburgerBtn.addEventListener('click', () => {
        sideDrawer.classList.add('open');
    });

    // Çarpıya basınca menüyü kapat
    closeDrawerBtn.addEventListener('click', () => {
        sideDrawer.classList.remove('open');
    });

    // ==========================================
    // YENİ EKLENEN: AKILLI ÜST BAR (SCROLL ZEKASI)
    // ==========================================
    let lastScrollY = window.scrollY;
    const smartHeader = document.getElementById('smart-header');

    window.addEventListener('scroll', () => {
        // Eğer kullanıcı aşağı kaydırıyorsa VE tepe noktasından 100px uzaklaştıysa
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            smartHeader.classList.add('hidden'); // Butonları gizle
        } else {
            // Kullanıcı yukarı doğru kaydırıyorsa
            smartHeader.classList.remove('hidden'); // Butonları göster
        }
        // Mevcut konumu hafızaya al
        lastScrollY = window.scrollY;
    });

    const menuContainer = document.getElementById('menu-container');
    const itemModal = document.getElementById('item-modal');
    const modalItemImage = document.getElementById('modal-item-image');
    const modalItemTitle = document.getElementById('modal-item-title');
    const modalItemCategory = document.getElementById('modal-item-category');
    const modalItemPrice = document.getElementById('modal-item-price');
    const modalItemDescription = document.getElementById('modal-item-description');
    const modalCloseIcon = itemModal.querySelector('.modal-close-icon');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    // Cep Ekranını Açma Fonksiyonu
    function openItemModal(itemData) {
        modalItemImage.src = itemData.image || ''; // Placeholder gerekebilir
        modalItemImage.alt = itemData.title;
        modalItemTitle.textContent = itemData.title;
        modalItemCategory.textContent = itemData.category;
        modalItemPrice.textContent = itemData.price;
        modalItemDescription.textContent = itemData.description;
        itemModal.style.display = 'flex';
        setTimeout(() => itemModal.classList.add('show'), 10);
        
        // UX: Sayfa ana içeriğini de bulanıklaştırabiliriz, ama overlay blur yeterli.
        // Ama örnekteki gibi sert bulanıklık için overlay backdrop-filter yeterli.
    }

    // Cep Ekranını Kapatma Fonksiyonu
    function closeItemModal() {
        itemModal.classList.remove('show');
        setTimeout(() => itemModal.style.display = 'none', 400); // Transition bekle
    }

    // Event Delegation: Menü Kartlarına Tıklama Olayı
    menuContainer.addEventListener('click', (e) => {
        // Kartın veya kartın içindeki bir elemanın tıklandığını kontrol et
        const card = e.target.closest('.menu-card');
        if (!card) return;

        // Kartın data-niteliklerinden veriyi çek
        const itemData = {
            title: card.getAttribute('data-item-title'),
            category: card.getAttribute('data-item-category'),
            price: card.getAttribute('data-item-price'),
            description: card.getAttribute('data-item-description'),
            image: card.getAttribute('data-item-image')
        };

        openItemModal(itemData);
    });

    // Kapatma Dinleyicileri
    modalCloseIcon.addEventListener('click', closeItemModal);
    modalCloseBtn.addEventListener('click', closeItemModal);
    
    // Overlay dışına tıklayarak kapatma
    itemModal.addEventListener('click', (e) => {
        if (e.target === itemModal) closeItemModal();
    });
    
    // Esc tuşu ile kapatma
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && itemModal.classList.contains('show')) {
            closeItemModal();
        }
    });

    // ==========================================
    // MENÜ VERİSİNİ ÇEKME VE CEP EKRANI VERİSİNİ EKLEME
    // ==========================================
    fetch('aamenu.json')
        .then(response => response.json())
        .then(data => {
            // ... (Kategorileri oluşturma kodu aynı kalıyor) ...
            
            // Ürünleri Ekrana Çizen Fonksiyon (Güncellendi)
            function renderItems(selectedCategory) {
                menuContainer.innerHTML = ''; 

                // ... (Galeri kodu aynı kalıyor) ...

                // Normal Menü Kartları İşlemi (Güncellendi)
                let itemsToRender = [];

                if (selectedCategory === 'Tümü') {
                    // Tümü seçiliyse bütün ürünleri tek listede birleştir ve kategori verisini ekle
                    data.forEach(cat => {
                        // Kategori altındaki ürünlerin derin kopyasını oluştur
                        const categoryItems = JSON.parse(JSON.stringify(cat.items));
                        // Her ürüne kendi kategorisini ata
                        categoryItems.forEach(item => item.item_category = cat.category);
                        itemsToRender = itemsToRender.concat(categoryItems);
                    });
                } else {
                    // Sadece tıklanan kategorinin ürünlerini al ve kategori verisini ekle
                    const foundCat = data.find(c => c.category === selectedCategory);
                    if (foundCat) {
                        itemsToRender = JSON.parse(JSON.stringify(foundCat.items));
                        itemsToRender.forEach(item => item.item_category = selectedCategory);
                    }
                }

                // Yemek Kartlarını Veri Nitelikleriyle Ekrana Bas
                itemsToRender.forEach(item => {
                    menuContainer.innerHTML += `
                        <div class="menu-card" 
                             data-item-category="${item.item_category}" 
                             data-item-price="${item.price}"
                             data-item-description="${item.description || ''}"
                             data-item-image="${item.image || ''}"
                             data-item-title="${item.name}">
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
            
            // ... (Kategori tıklama kodu aynı kalıyor) ...
        })
        .catch(err => {
            // ... (Hata kodu aynı kalıyor) ...
        });

// ==========================================
    // LIGHTBOX (GALERİ POP-UP) İŞLEMLERİ
    // ==========================================
    
    // Lightbox Elementlerine Referanslar
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCloseIcon = lightboxModal.querySelector('.lightbox-close-icon');

    // Lightbox Açma Fonksiyonu
    function openLightboxModal(imageSrc) {
        lightboxImage.src = imageSrc;
        lightboxModal.style.display = 'flex';
        setTimeout(() => lightboxModal.classList.add('show'), 10);
    }

    // Lightbox Kapatma Fonksiyonu
    function closeLightboxModal() {
        lightboxModal.classList.remove('show');
        setTimeout(() => lightboxModal.style.display = 'none', 500); // Transition bekle
    }

    // Event Delegation: Menü Kartları ve Galeri Resimlerine Tıklama Olayı (Genişletilmiş)
    
    menuContainer.addEventListener('click', (e) => {
        // 1. Durum: Galeri Resmine Tıklanması
        const galleryImg = e.target.closest('.gallery-img');
        if (galleryImg) {
            const imageSrc = galleryImg.getAttribute('src');
            openLightboxModal(imageSrc);
            return; // Yemek kodlarına geçmeyi engelle
        }

        // 2. Durum: Yemek Kartına Tıklanması (Eski kod)
        const card = e.target.closest('.menu-card');
        if (!card) return;

        // Kartın data-niteliklerinden veriyi çek
        const itemData = {
            title: card.getAttribute('data-item-title'),
            category: card.getAttribute('data-item-category'),
            price: card.getAttribute('data-item-price'),
            description: card.getAttribute('data-item-description'),
            image: card.getAttribute('data-item-image')
        };
        // openItemModal zaten yukarıda tanımlı
        openItemModal(itemData);
    });

    // Lightbox Kapatma Dinleyicileri
    lightboxCloseIcon.addEventListener('click', closeLightboxModal);
    
    // Overlay dışına tıklayarak kapatma
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) closeLightboxModal();
    });
    
    // Esc tuşu ile kapatma
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal.classList.contains('show')) {
            closeLightboxModal();
        }
    });

}); // <-- Sihirli kapanış parantezleri (aascript.js'in son satırı)