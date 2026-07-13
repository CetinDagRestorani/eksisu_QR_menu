document.addEventListener('DOMContentLoaded', function() {
    
    const flipbookElement = document.getElementById('flipbook');

    fetch('aamenu.json')
        .then(response => response.json())
        .then(data => {
            
            let pagesHTML = '';
            
            data.forEach(category => {
                pagesHTML += `
                    <div class="page">
                        <div class="page-content">
                            <h2 class="menu-category-title">${category.category}</h2>
                            <div class="menu-items-container">
                                ${category.items.map(item => `
                                    <div class="menu-item">
                                        <div class="item-header">
                                            <div class="item-name">${item.name}</div>
                                            <div class="item-price">${item.price}</div>
                                        </div>
                                        ${item.description ? `<div class="item-description">${item.description}</div>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `;
            });

            // GÜNCELLENEN KISIM: Arka Kapak ve İkonlu Butonlar
            const backCoverHTML = `
                <div class="page" data-density="hard">
                    <div class="page-content cover">
                        <img src="sonkapak.jpeg" alt="Arka Kapak" class="cover-img">
                        <div class="back-contact">
                            <a href="tel:+904462314545" class="action-btn call-btn">
                                <i class="fas fa-phone-alt"></i>
                            </a>
                            <a href="https://wa.me/905303235013" class="action-btn wa-btn" target="_blank">
                                <i class="fab fa-whatsapp"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `;

            flipbookElement.insertAdjacentHTML('beforeend', pagesHTML + backCoverHTML);

            const pageFlip = new St.PageFlip(flipbookElement, {
                width: 400, // Genişlik
                height: 750, // Yükseklik (Telefon ekranına uyması için uzatıldı)
                size: "stretch", // Ekrana yayılmasını sağlar
                minWidth: 300,
                maxWidth: 1000,
                minHeight: 400,
                maxHeight: 2000, // Uzun ekranlı telefonlarda (iPhone Pro Max vs.) altta boşluk kalmasın diye limiti artırdık
                showCover: true, 
                usePortrait: true, // Telefonda kesinlikle tek sayfa dik açılmasını zorlar
                mobileScrollSupport: false, 
                maxShadowOpacity: 0.5 
            });

            pageFlip.loadFromHTML(document.querySelectorAll('.page'));

        })
        .catch(error => {
            console.error('Menü verisi yüklenirken hata oluştu:', error);
            alert("Menü yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.");
        });
});