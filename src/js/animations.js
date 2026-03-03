// ============================================
// ANIMATIONS MODULE — Optimized for seamless scrolling
// ============================================

import gsap from 'gsap';

// ---- Initialize Scroll Animations ----
export function initAnimations() {
    // Use Intersection Observer for scroll-triggered reveals
    // This ensures elements animate ONLY when visible, not all at once
    setupScrollReveal();

    // Animate countdown flip on number change
    setupCountdownFlip();
}

// ---- Create Floating Particles ----
export function createParticles(containerId, count = 20) {
    const container = document.getElementById(containerId);
    if (!container) return;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = `particle ${Math.random() > 0.6 ? 'star' : ''}`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${6 + Math.random() * 10}s`;
        particle.style.animationDelay = `${Math.random() * 8}s`;
        particle.style.width = `${3 + Math.random() * 5}px`;
        particle.style.height = particle.style.width;
        particle.style.opacity = `${0.3 + Math.random() * 0.5}`;
        container.appendChild(particle);
    }
}

// ---- Scroll-Triggered Reveal ----
function setupScrollReveal() {
    // Elements to reveal on scroll — with different animations
    const revealTargets = [
        { selector: '.couple-card', animation: 'fadeUp', stagger: 0.15 },
        { selector: '.divider-ornament', animation: 'scaleIn' },
        { selector: '.countdown-item', animation: 'fadeUp', stagger: 0.1 },
        { selector: '.event-card', animation: 'fadeUp', stagger: 0.15 },
        { selector: '.timeline-item', animation: 'fadeUp', stagger: 0.12 },
        { selector: '.gift-card', animation: 'fadeUp', stagger: 0.1 },
        { selector: '.gallery-item', animation: 'fadeUp', stagger: 0.05 },
        { selector: '.geometric-frame', animation: 'fadeUp' },
        { selector: '.closing-frame', animation: 'fadeUp' },
        { selector: '.rsvp-form', animation: 'fadeUp' },
        { selector: '.message-form', animation: 'fadeUp' },
    ];

    revealTargets.forEach(({ selector, animation, stagger }) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) return;

        // Find the parent section for each group
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
            threshold: 0.15,
            rootMargin: '0px 0px 50px 0px', // Trigger slightly BEFORE visible
        });

        observer.observe(parentSection);
    });
}

// ---- Animate Elements ----
function animateElements(elements, animation, stagger = 0) {
    const baseConfig = {
        duration: 0.5,       // Fast — no waiting feel
        ease: 'power2.out',  // Smooth but quick
        stagger: stagger,
    };

    switch (animation) {
        case 'fadeUp':
            gsap.fromTo(elements, {
                y: 25,
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
                rotation: -90,
            }, {
                scale: 1,
                rotation: 0,
                duration: 0.6,
                ease: 'back.out(1.5)',
            });
            break;
    }
}

// ---- Countdown Flip Animation ----
function setupCountdownFlip() {
    const countdownFlips = document.querySelectorAll('.countdown-flip');
    countdownFlips.forEach(flip => {
        const observer = new MutationObserver(() => {
            gsap.fromTo(flip, { scale: 0.95 }, { scale: 1, duration: 0.2, ease: 'back.out(2)' });
        });

        const numberEl = flip.querySelector('.countdown-number');
        if (numberEl) {
            observer.observe(numberEl, { childList: true, characterData: true, subtree: true });
        }
    });
}
