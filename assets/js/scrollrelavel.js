/**
 * Scroll Reveal Effect
 * Shows elements with animation as they come into viewport
 */

// Configuration
const scrollRevealConfig = {
    duration: 1200,
    delay: 150,
    distance: 40,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    origin: 'bottom',
    scale: 0.95,
    opacity: 0
};

// Function to check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    const threshold = 150; // Show element 150px before it comes into full view
    
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) - threshold &&
        rect.bottom >= 0
    );
}

// Function to apply reveal effect
function revealElement(el) {
    if (el.classList.contains('reveal-animated')) return; // Skip if already animated
    
    if (isElementInViewport(el)) {
        el.classList.add('reveal-show');
        el.classList.add('reveal-animated');
    }
}

// Main scroll reveal function
function scrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    revealElements.forEach(element => {
        revealElement(element);
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Scroll Reveal initialized');
    
    // Add CSS styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        /* Scroll Reveal Styles */
        .reveal {
            opacity: 0;
            transform: translateY(${scrollRevealConfig.distance}px) scale(${scrollRevealConfig.scale});
            transition: opacity ${scrollRevealConfig.duration}ms ${scrollRevealConfig.easing},
                        transform ${scrollRevealConfig.duration}ms ${scrollRevealConfig.easing};
            will-change: opacity, transform;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
        }

        .reveal-show {
            opacity: 1;
            transform: translateY(0) scale(1);
        }

        /* Stagger effect for multiple elements */
        .reveal:nth-child(1) { transition-delay: 0ms; }
        .reveal:nth-child(2) { transition-delay: ${scrollRevealConfig.delay}ms; }
        .reveal:nth-child(3) { transition-delay: ${scrollRevealConfig.delay * 2}ms; }
        .reveal:nth-child(4) { transition-delay: ${scrollRevealConfig.delay * 3}ms; }
        .reveal:nth-child(5) { transition-delay: ${scrollRevealConfig.delay * 4}ms; }
        .reveal:nth-child(6) { transition-delay: ${scrollRevealConfig.delay * 5}ms; }
        .reveal:nth-child(7) { transition-delay: ${scrollRevealConfig.delay * 6}ms; }
        .reveal:nth-child(8) { transition-delay: ${scrollRevealConfig.delay * 7}ms; }
    `;
    document.head.appendChild(style);
    
    // Initial reveal on page load
    scrollReveal();
});

// Listen to scroll events
let scrollTimeout;
window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
        scrollReveal();
    }, 30);
}, { passive: true });

// Listen to resize events
window.addEventListener('resize', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
        scrollReveal();
    }, 100);
}, { passive: true });

console.log('✅ Scroll Reveal Script Loaded');
