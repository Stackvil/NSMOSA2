/**
 * Global Animation Manager
 * Handles intersection observers for scroll animations
 */

export function initAnimations() {
    const observerOptions = {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Offset to trigger slightly before the bottom
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Stop observing once visible (one-time animation)
                // Remove this line if you want animations to re-trigger on scroll up/down
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select all elements to animate
    const animatedElements = document.querySelectorAll(
        '.animate-on-scroll, .fade-up, .fade-in, .slide-in-left, .slide-in-right, .stagger-children'
    );

    animatedElements.forEach((el) => {
        observer.observe(el);
    });

    // Also initialize navbar scroll effect
    initNavbarScroll();
}

function initNavbarScroll() {
    const navbar = document.querySelector('.main-nav');


    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            document.body.classList.add('is-scrolled');
        } else {
            navbar.classList.remove('scrolled');
            document.body.classList.remove('is-scrolled');
        }
    });
}
