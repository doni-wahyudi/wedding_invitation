// ============================================
// ANIMATIONS MODULE — Ivory Romance Theme
// Soft, organic animations with floating petals
// ============================================

import gsap from 'gsap';

// ---- Initialize Scroll Animations ----
export function initAnimations() {
    setupScrollReveal();
    setupCountdownFlip();
    createFloatingPetals();
}

// ---- Floating Petals System ----
function createFloatingPetals() {
    const container = document.getElementById('petals-container');
    if (!container) return;

    const petalCount = 15; // Subtle, not overwhelming

    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        petal.classList.add('petal');

        // Random positioning and timing
        const startX = Math.random() * 100;
        const size = 6 + Math.random() * 10;
        const duration = 12 + Math.random() * 18; // 12-30 seconds
        const delay = Math.random() * 15;
        const swayAmount = 30 + Math.random() * 60;

        petal.style.cssText = `
            left: ${startX}%;
            width: ${size}px;
            height: ${size}px;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            opacity: 0;
        `;

        // Add gentle horizontal sway via CSS custom property
        petal.style.setProperty('--sway', `${swayAmount}px`);

        container.appendChild(petal);
    }
}

// ---- Scroll-Triggered Reveal ----
function setupScrollReveal() {
    const revealTargets = [
        { selector: '.couple-card', animation: 'fadeUp', stagger: 0.2 },
        { selector: '.divider-ornament', animation: 'scaleIn' },
        { selector: '.countdown-item', animation: 'fadeUp', stagger: 0.12 },
        { selector: '.event-card', animation: 'fadeUp', stagger: 0.2 },
        { selector: '.timeline-item', animation: 'fadeUp', stagger: 0.15 },
        { selector: '.gift-card', animation: 'fadeUp', stagger: 0.12 },
        { selector: '.geometric-frame', animation: 'fadeUp' },
        { selector: '.closing-frame', animation: 'fadeUp' },
        { selector: '.rsvp-form', animation: 'fadeUp' },
        { selector: '.message-form', animation: 'fadeUp' },
    ];

    revealTargets.forEach(({ selector, animation, stagger }) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) return;

        const parentSection = elements[0].closest('.section');
        if (!parentSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateElements(elements, animation, stagger);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px 30px 0px',
        });

        observer.observe(parentSection);
    });
}

// ---- Animate Elements ----
function animateElements(elements, animation, stagger = 0) {
    const baseConfig = {
        duration: 0.7,
        ease: 'power2.out',
        stagger: stagger,
    };

    switch (animation) {
        case 'fadeUp':
            gsap.fromTo(elements, {
                y: 30,
                opacity: 0,
            }, {
                y: 0,
                opacity: 1,
                ...baseConfig,
            });
            break;

        case 'scaleIn':
            gsap.fromTo(elements, {
                scale: 0,
                rotation: -45,
            }, {
                scale: 1,
                rotation: 0,
                duration: 0.8,
                ease: 'back.out(1.2)',
            });
            break;
    }
}

// ---- Countdown Flip Animation ----
function setupCountdownFlip() {
    const countdownFlips = document.querySelectorAll('.countdown-flip');
    countdownFlips.forEach(flip => {
        const observer = new MutationObserver(() => {
            gsap.fromTo(flip, { scale: 0.95 }, { scale: 1, duration: 0.3, ease: 'back.out(1.5)' });
        });

        const numberEl = flip.querySelector('.countdown-number');
        if (numberEl) {
            observer.observe(numberEl, { childList: true, characterData: true, subtree: true });
        }
    });
}
