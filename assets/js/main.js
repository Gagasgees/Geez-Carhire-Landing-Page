// Hamburger Menu Toggle & Header Scroll Effect
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const header = document.querySelector('.header');

    // Hamburger Menu Toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                // mark active link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            });
        });

        document.addEventListener('click', function(event) {
            const isClickInsideNavbar = event.target.closest('.navbar');
            if (!isClickInsideNavbar) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Header Scroll Effect
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) header.classList.add('scrolled'); else header.classList.remove('scrolled');
        });
    }

    // Services drag/slide for horizontal scroll with smooth momentum
    const servicesGrid = document.querySelector('.services-grid');
    
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let velocity = 0;
    let lastX = 0;
    let lastTime = 0;
    let rafId = null;
    let moved = false;
    
    const FRICTION = 0.95;
    const VELOCITY_MIN = 0.3;
    const SENSITIVITY = 2;

    if (servicesGrid) {
        const applyMomentum = () => {
            if (Math.abs(velocity) > VELOCITY_MIN) {
                servicesGrid.scrollLeft += velocity;
                velocity *= FRICTION;
                rafId = requestAnimationFrame(applyMomentum);
            } else {
                velocity = 0;
                rafId = null;
            }
        };

        // Mouse Down
        servicesGrid.addEventListener('mousedown', (e) => {
            isDown = true;
            moved = false;
            startX = e.pageX;
            lastX = e.pageX;
            scrollLeft = servicesGrid.scrollLeft;
            lastTime = Date.now();
            velocity = 0;
            servicesGrid.style.cursor = 'grabbing';
            servicesGrid.style.userSelect = 'none';
            if (rafId) cancelAnimationFrame(rafId);
        });

        // Mouse Move
        servicesGrid.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            
            const now = Date.now();
            const timeDelta = Math.max(1, now - lastTime);
            const currentX = e.pageX;
            const diff = currentX - lastX;
            
            // Apply movement with sensitivity
            servicesGrid.scrollLeft = scrollLeft - (currentX - startX) * SENSITIVITY;
            
            // Calculate velocity for momentum
            if (timeDelta > 0) {
                velocity = -(diff * SENSITIVITY) / timeDelta * 16; // Normalize for 60fps
            }
            
            if (Math.abs(currentX - startX) > 5) {
                moved = true;
            }
            
            lastX = currentX;
            lastTime = now;
            scrollLeft = servicesGrid.scrollLeft;
        });

        // Mouse Up
        document.addEventListener('mouseup', () => {
            if (isDown) {
                isDown = false;
                servicesGrid.style.cursor = 'grab';
                servicesGrid.style.userSelect = 'auto';
                
                if (moved && Math.abs(velocity) > VELOCITY_MIN) {
                    if (rafId) cancelAnimationFrame(rafId);
                    rafId = requestAnimationFrame(applyMomentum);
                }
                velocity = 0;
            }
        });

        // Mouse Leave
        servicesGrid.addEventListener('mouseleave', () => {
            if (isDown) {
                isDown = false;
                servicesGrid.style.cursor = 'grab';
                servicesGrid.style.userSelect = 'auto';
                
                if (moved && Math.abs(velocity) > VELOCITY_MIN) {
                    if (rafId) cancelAnimationFrame(rafId);
                    rafId = requestAnimationFrame(applyMomentum);
                }
                velocity = 0;
            }
        });

        // Touch Start
        servicesGrid.addEventListener('touchstart', (e) => {
            isDown = true;
            moved = false;
            startX = e.touches[0].clientX;
            lastX = e.touches[0].clientX;
            scrollLeft = servicesGrid.scrollLeft;
            lastTime = Date.now();
            velocity = 0;
            if (rafId) cancelAnimationFrame(rafId);
        }, { passive: true });

        // Touch Move
        servicesGrid.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            
            const now = Date.now();
            const timeDelta = Math.max(1, now - lastTime);
            const currentX = e.touches[0].clientX;
            const diff = currentX - lastX;
            
            // Apply movement with sensitivity
            servicesGrid.scrollLeft = scrollLeft - (currentX - startX) * SENSITIVITY;
            
            // Calculate velocity for momentum
            if (timeDelta > 0) {
                velocity = -(diff * SENSITIVITY) / timeDelta * 16; // Normalize for 60fps
            }
            
            if (Math.abs(currentX - startX) > 5) {
                moved = true;
            }
            
            lastX = currentX;
            lastTime = now;
            scrollLeft = servicesGrid.scrollLeft;
        }, { passive: true });

        // Touch End
        servicesGrid.addEventListener('touchend', () => {
            if (isDown) {
                isDown = false;
                
                if (moved && Math.abs(velocity) > VELOCITY_MIN) {
                    if (rafId) cancelAnimationFrame(rafId);
                    rafId = requestAnimationFrame(applyMomentum);
                }
                velocity = 0;
            }
        }, { passive: true });

        // Prevent text selection during drag
        servicesGrid.addEventListener('selectstart', (e) => {
            if (moved) {
                e.preventDefault();
            }
        });

        // Prevent default link/button click when dragging
        servicesGrid.addEventListener('click', (e) => {
            if (moved) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, true);
    }

    // Services Price Calculator
    const daysInputs = document.querySelectorAll('.days-input');
    daysInputs.forEach(input => {
        // Calculate price on input change
        input.addEventListener('change', function() {
            const card = this.closest('.services-card');
            if (card) {
                const basePrice = parseFloat(card.querySelector('.price').getAttribute('data-base-price'));
                const days = parseInt(this.value) || 1;
                
                // If 2 or more days, apply discount (5% off)
                let totalPrice = basePrice * days;
                if (days >= 2) {
                    const discount = basePrice * days * 0.05; // 5% discount
                    totalPrice = totalPrice - discount;
                }
                
                const priceElement = card.querySelector('.price');
                priceElement.textContent = `$${totalPrice.toFixed(2)} / ${days} Day${days > 1 ? 's' : ''}`;
            }
        });

        // Also trigger on input event for real-time updates
        input.addEventListener('input', function() {
            const card = this.closest('.services-card');
            if (card) {
                const basePrice = parseFloat(card.querySelector('.price').getAttribute('data-base-price'));
                const days = parseInt(this.value) || 1;
                
                if (days >= 1) {
                    let totalPrice = basePrice * days;
                    if (days >= 2) {
                        const discount = basePrice * days * 0.05; // 5% discount
                        totalPrice = totalPrice - discount;
                    }
                    
                    const priceElement = card.querySelector('.price');
                    priceElement.textContent = `$${totalPrice.toFixed(2)} / ${days} Day${days > 1 ? 's' : ''}`;
                }
            }
        });
    });

    // Handle booking button click to pass car data to booking page
    const bookingBtns = document.querySelectorAll('.booking-btn');
    bookingBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get parent card information
            const card = this.closest('.services-card');
            if (card) {
                const carImg = card.querySelector('img').getAttribute('alt');
                const carName = card.querySelector('h4').textContent;
                const priceText = card.querySelector('.price').getAttribute('data-base-price');
                
                // Map car name to carType value
                const carTypeMap = {
                    'Premium Car': 'premium-car',
                    'Executive Car': 'executive-car',
                    'Economy Car': 'economy-car',
                    'Compact Car': 'compact-car',
                    'Family SUV': 'family-suv',
                    'Sports Car': 'sports-car',
                    'Sedan': 'sedan',
                    'Luxury SUV': 'luxury-suv'
                };
                
                const carType = carTypeMap[carName] || '';
                
                // Build booking URL with parameters
                const bookingUrl = `booking.html?carType=${encodeURIComponent(carType)}&carName=${encodeURIComponent(carName)}&price=${encodeURIComponent(priceText)}`;
                
                // Navigate to booking page
                window.location.href = bookingUrl;
            }
        });
    });
});

