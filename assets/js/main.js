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
    let moved = false;
    let velocity = 0;
    let lastX = 0;
    let lastTime = 0;
    let animationId = null;
    let targetScroll = 0;

    if (servicesGrid) {
        // Smooth animation function for drag
        const animateScroll = () => {
            if (Math.abs(velocity) > 0.1) {
                // Apply velocity with easing
                targetScroll -= velocity;
                
                // Clamp scroll position
                const maxScroll = servicesGrid.scrollWidth - servicesGrid.clientWidth;
                targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
                
                servicesGrid.scrollLeft = targetScroll;
                velocity *= 0.94; // friction
                animationId = requestAnimationFrame(animateScroll);
            } else {
                velocity = 0;
                animationId = null;
            }
        };

        // Mouse
        servicesGrid.addEventListener('mousedown', (e) => {
            isDown = true;
            moved = false;
            servicesGrid.style.cursor = 'grabbing';
            startX = e.pageX;
            lastX = startX;
            scrollLeft = servicesGrid.scrollLeft;
            targetScroll = scrollLeft;
            lastTime = Date.now();
            velocity = 0;
            if (animationId) cancelAnimationFrame(animationId);
        }, { passive: true });

        document.addEventListener('mouseup', () => {
            if (isDown) {
                isDown = false;
                servicesGrid.style.cursor = 'grab';
                // Start momentum animation
                if (Math.abs(velocity) > 0.5) {
                    if (animationId) cancelAnimationFrame(animationId);
                    animationId = requestAnimationFrame(animateScroll);
                }
            }
        });

        servicesGrid.addEventListener('mouseleave', () => {
            if (isDown) {
                isDown = false;
                servicesGrid.style.cursor = 'grab';
                if (Math.abs(velocity) > 0.5) {
                    if (animationId) cancelAnimationFrame(animationId);
                    animationId = requestAnimationFrame(animateScroll);
                }
            }
        });

        servicesGrid.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            moved = true;
            const x = e.pageX;
            const currentTime = Date.now();
            const timeDelta = currentTime - lastTime;
            
            // Calculate delta (positive = drag right, negative = drag left)
            const deltaX = lastX - x;
            
            // Calculate velocity (invert for correct direction)
            if (timeDelta > 0) {
                velocity = -deltaX / timeDelta * 10; // inverted velocity
            }
            
            // Update target scroll (invert delta for correct direction)
            targetScroll = scrollLeft - deltaX;
            
            // Clamp to valid range
            const maxScroll = servicesGrid.scrollWidth - servicesGrid.clientWidth;
            targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
            
            // Update scroll position
            servicesGrid.scrollLeft = targetScroll;
            
            lastX = x;
            lastTime = currentTime;
        }, { passive: true });

        // Touch
        servicesGrid.addEventListener('touchstart', (e) => {
            isDown = true;
            moved = false;
            startX = e.touches[0].pageX;
            lastX = startX;
            scrollLeft = servicesGrid.scrollLeft;
            targetScroll = scrollLeft;
            lastTime = Date.now();
            velocity = 0;
            if (animationId) cancelAnimationFrame(animationId);
        }, {passive: true});

        servicesGrid.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            moved = true;
            const x = e.touches[0].pageX;
            const currentTime = Date.now();
            const timeDelta = currentTime - lastTime;
            
            // Calculate delta (positive = drag right, negative = drag left)
            const deltaX = lastX - x;
            
            // Calculate velocity (invert for correct direction)
            if (timeDelta > 0) {
                velocity = -deltaX / timeDelta * 10; // inverted velocity
            }
            
            // Update target scroll (invert delta for correct direction)
            targetScroll = scrollLeft - deltaX;
            
            // Clamp to valid range
            const maxScroll = servicesGrid.scrollWidth - servicesGrid.clientWidth;
            targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
            
            // Update scroll position
            servicesGrid.scrollLeft = targetScroll;
            
            lastX = x;
            lastTime = currentTime;
        }, {passive: true});

        servicesGrid.addEventListener('touchend', () => {
            if (isDown) {
                isDown = false;
                // Start momentum animation on touch end
                if (Math.abs(velocity) > 0.5) {
                    if (animationId) cancelAnimationFrame(animationId);
                    animationId = requestAnimationFrame(animateScroll);
                }
            }
        });

        // prevent clicks when dragging
        servicesGrid.addEventListener('click', (e) => {
            if (moved) {
                e.stopPropagation();
                e.preventDefault();
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

