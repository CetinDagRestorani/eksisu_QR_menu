document.addEventListener('DOMContentLoaded', function() {
    
    const flipbookElement = document.getElementById('flipbook');

    fetch('aamenu.json')
        .then(response => response.json())
        .then(data => {
            
            let pagesHTML = '';
            let generatedPageCount = 0; 
            const ITEMS_PER_PAGE = 6; 

            // 1. Tarihçe ve Hakkımızda Sayfası
            const aboutPageHTML = `
                <div class="page">
                    <div class="page-content about-page">
                        <h2 class="about-motto">"Su, Yeşil ve Ahşabın<br>buluşma noktası"</h2>
                        <div class="about-profiles">
                            <div class="profile">
                                <h3 class="profile-title">USTAMIZ<br>ÇETİN BOĞA</h3>
                                <p>Erzincan'a restoran sektöründe çağ atlatmış olan Çetin Boğa 20.01.1966 doğumludur. Kendisi 10 yaşından itibaren sektörde yer almış ve kendini kısa sürede sektörde kanıtlamıştır. Şu an da Erzincan'ın en gözde restoranı olan Saklıbahçe Restoranı işletmektedir.</p>
                            </div>
                            <div class="profile">
                                <h3 class="profile-title">İŞLETMECİ<br>RUKİYE BOĞA</h3>
                                <p>Yakın çevresi tarafından el lezzeti, hamaratlığı ve titizliği ile bilinen Rukiye Boğa 01.01.1971 doğumlu ve üç çocuk annesidir. Kendisi Saklıbahçe Restoranın gizli yüzüdür işletme menüsünün en başarılı ürünlerinden olan meşhur Saklıbahçe köftenin de mimarıdır.</p>
                            </div>
                        </div>
                        <h2 class="about-history-title">SAKLIBAHÇE TARİHÇE</h2>
                        <p class="about-history-text">Saklıbahçe restoran 2008 yılında Erzincan Belediyesinden işletme ruhsatı ile projelendirilmiş ve 2009 da işletmeye açılmıştır. Aynı yıl talihsiz bir yangın sonucu büyük ölçüde kullanılamaz hale gelmiştir ve işletmecileri tarafından 2010 yılında yeniden onarılarak hizmete açılmıştır. 2014 yılında da ahşap bir yapı olarak dönüştürülmüş ve bugün ki halini almıştır. Saklıbahçe bir çok badire atlatmasına rağmen ayakta kalmayı başaran Erzincan'ın en gözde restoranlarından biridir.</p>
                    </div>
                </div>
            `;
            pagesHTML += aboutPageHTML;

            // 2. Menü Kategorileri Döngüsü
            data.forEach(category => {
                for (let i = 0; i < category.items.length; i += ITEMS_PER_PAGE) {
                    generatedPageCount++; 
                    const currentItems = category.items.slice(i, i + ITEMS_PER_PAGE);
                    const pageTitle = i === 0 ? category.category : `${category.category} (Devamı)`;

                    pagesHTML += `
                        <div class="page">
                            <div class="page-content">
                                <h2 class="menu-category-title">${pageTitle}</h2>
                                <div class="menu-items-container">
                                    ${currentItems.map(item => `
                                        <div class="menu-item">
                                            ${item.image ? `<img src="${item.image}" alt="${item.name}" class="item-thumbnail">` : ''}
                                            <div class="item-info">
                                                <div class="item-header">
                                                    <div class="item-name">${item.name}</div>
                                                    <div class="item-price">${item.price}</div>
                                                </div>
                                                ${item.description ? `<div class="item-description">${item.description}</div>` : ''}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    `;
                }
            });

            // 3. YENİ EKLENEN: GALERİ SAYFASI VE FONKSİYONLARI
            // Kendi mekan resimlerini klasöre atıp isimlerini buraya yaz kanka (istediğin kadar ekleyebilirsin)
            window.galleryImages = ['galeri1.jpg', 'galeri2.jpg', 'galeri3.jpg', 'galeri4.jpg', 'galeri5.jpg', 'galeri6.jpg', 'galeri7.jpg', 'galeri8.jpg'];
            
            let galleryGridHTML = window.galleryImages.map((img, index) => `
                <a href="javascript:void(0);" onclick="openGallery(${index})" style="display:block; text-decoration:none;">
                    <img src="${img}" class="gallery-thumb" alt="Galeri Görseli">
                </a>
            `).join('');

            const galleryPageHTML = `
                <div class="page">
                    <div class="page-content gallery-page">
                        <h2 class="menu-category-title">Mekanımız</h2>
                        <div class="gallery-grid">
                            ${galleryGridHTML}
                        </div>
                    </div>
                </div>
            `;
            pagesHTML += galleryPageHTML;

            // Arka planda tam ekran çalışacak olan Galeri Modalı (Lightbox) - Görünmez olarak eklenir
            const lightboxHTML = `
                <div id="gallery-modal" class="modal">
                    <span class="close-modal" onclick="closeGallery()">&times;</span>
                    <span class="prev-modal" onclick="changeGalleryImage(-1)">&#10094;</span>
                    <img class="modal-content" id="modal-img">
                    <span class="next-modal" onclick="changeGalleryImage(1)">&#10095;</span>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', lightboxHTML);

            // 4. Matematik Güncellemesi (Kapak + Hakkımızda + Menüler + Galeri + Arka Kapak)
            let totalPages = 1 + 1 + generatedPageCount + 1 + 1; 
            
            if (totalPages % 2 !== 0) {
                pagesHTML += `<div class="page"><div class="page-content"></div></div>`;
            }

            // 5. Arka Kapak
            const backCoverHTML = `
                <div class="page" data-density="hard">
                    <div class="page-content cover">
                        <img src="sonkapak.jpeg" alt="Arka Kapak" class="cover-img">
                        <div class="back-contact">
                            <a href="tel:+904462314545" class="action-btn call-btn" title="Ara"><i class="fas fa-phone-alt"></i></a>
                            <a href="https://wa.me/905303235013" class="action-btn wa-btn" target="_blank" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                            <a href="https://www.instagram.com/eksisusaklibahce" class="action-btn insta-btn" target="_blank" title="Instagram"><i class="fab fa-instagram"></i></a>
                            <a href="mailto:cetindagrestorani@gmail.com" class="action-btn mail-btn" title="Mail Gönder"><i class="fas fa-envelope"></i></a>
                        </div>
                    </div>
                </div>
            `;

            flipbookElement.insertAdjacentHTML('beforeend', pagesHTML + backCoverHTML);

            // 6. Kitap Motoru Ayarları
            const isMobile = window.innerWidth <= 768;
            const containerBox = document.getElementById('flipbook-container');
            let bookWidth, bookHeight;

            if (isMobile) {
                bookWidth = containerBox.offsetWidth;
                bookHeight = containerBox.offsetHeight;
            } else {
                const maxWidth = window.innerWidth * 0.90;
                const maxHeight = window.innerHeight * 0.90;
                const pageRatio = 450 / 650;
                const doubleRatio = pageRatio * 2;

                if ((maxWidth / maxHeight) < doubleRatio) {
                    bookWidth = maxWidth / 2; 
                    bookHeight = maxWidth / doubleRatio;
                } else {
                    bookHeight = maxHeight;
                    bookWidth = maxHeight * pageRatio; 
                }
            }

            const pageFlip = new St.PageFlip(flipbookElement, {
                width: bookWidth,   
                height: bookHeight, 
                size: isMobile ? "stretch" : "fixed", 
                minWidth: 300,
                maxWidth: 2000,
                minHeight: 400,
                maxHeight: 3000,
                showCover: true, 
                usePortrait: isMobile, 
                mobileScrollSupport: false, 
                maxShadowOpacity: 0.5 
            });

            pageFlip.loadFromHTML(document.querySelectorAll('.page'));

        })
        .catch(error => {
            console.error('Menü verisi yüklenirken hata oluştu:', error);
        });
});

// GALERİ İÇİN JAVASCRIPT FONKSİYONLARI (Tam Ekran Açma, Kapatma, İleri/Geri)
let currentGalleryIndex = 0;

window.openGallery = function(index) {
    currentGalleryIndex = index;
    document.getElementById('gallery-modal').style.display = "flex";
    document.getElementById('modal-img').src = window.galleryImages[currentGalleryIndex];
};

window.closeGallery = function() {
    document.getElementById('gallery-modal').style.display = "none";
};

window.changeGalleryImage = function(step) {
    currentGalleryIndex += step;
    if (currentGalleryIndex >= window.galleryImages.length) currentGalleryIndex = 0;
    if (currentGalleryIndex < 0) currentGalleryIndex = window.galleryImages.length - 1;
    document.getElementById('modal-img').src = window.galleryImages[currentGalleryIndex];
};
