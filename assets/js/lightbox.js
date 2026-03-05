// Lightbox functionality for Services
document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDesc');
    const lightboxClose = document.getElementById('lightboxClose');
    const viewButtons = document.querySelectorAll('.view-btn');

    if (viewButtons && lightbox) {
        viewButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                
                // Get the service card
                const card = this.closest('.services-card');
                if (!card) return;
                
                // Get data from card
                const imgSrc = card.querySelector('img').src;
                const title = card.querySelector('h4').textContent;
                const description = card.querySelector('.services-desc').textContent;
                
                // Update lightbox
                lightboxImage.src = imgSrc;
                lightboxTitle.textContent = title;
                lightboxDesc.textContent = description;
                
                // Show lightbox
                lightbox.classList.add('active');
            });
        });

        // Close lightbox
        lightboxClose && lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
        lightbox && lightbox.addEventListener('click', (e) => { 
            if (e.target === lightbox) lightbox.classList.remove('active'); 
        });
        document.addEventListener('keydown', (e) => { 
            if (e.key === 'Escape') lightbox.classList.remove('active'); 
        });
    }
});