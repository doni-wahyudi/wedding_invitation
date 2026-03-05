// ============================================
// MAIN APPLICATION ENTRY POINT
// ============================================

import { initCountdown } from './countdown.js';
import { initSupabase, loadMessages, submitMessage, submitRSVP, verifyGuest } from './supabase.js';
import { initGallery } from './gallery.js';
import { initMusic, tryAutoPlay } from './music.js';
import { initAnimations, createParticles } from './animations.js';

// ---- Config ----
const WEDDING_DATE = '2026-08-15T08:00:00+07:00';

// ---- Initialize App ----
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Supabase first (needed for guest verification)
    initSupabase();

    // Create particles on cover
    createParticles('cover-particles', 25);

    // Verify guest from URL parameter
    await verifyAndPersonalize();
});

// ---- Verify Guest & Personalize ----
async function verifyAndPersonalize() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('to') || params.get('p') || params.get('guest');

    const coverContent = document.querySelector('.cover-content');
    const guestNameEl = document.getElementById('guest-name');
    const openBtn = document.getElementById('open-btn');
    const coverGuestEl = document.querySelector('.cover-guest');

    if (!slug) {
        // No slug provided — show "not invited" message
        showNotInvited(coverContent, coverGuestEl, openBtn);
        return;
    }

    // Show loading state while verifying
    if (guestNameEl) guestNameEl.textContent = 'Memverifikasi...';
    if (openBtn) openBtn.style.display = 'none';

    // Check guest in database
    const guest = await verifyGuest(slug);

    if (guest) {
        // Guest found — personalize the invitation
        if (guestNameEl) guestNameEl.textContent = guest.name;
        if (coverGuestEl) {
            const greetingP = coverGuestEl.querySelector('p:first-child');
            if (greetingP) greetingP.textContent = `Kepada Yth. ${guest.greeting || 'Bapak/Ibu/Saudara/i'} :`;
        }
        if (openBtn) openBtn.style.display = 'inline-flex';

        // Store guest info for RSVP pre-fill
        window.__weddingGuest = guest;

        // Set up cover open button
        setupCover();
    } else {
        // Guest not found in database
        showNotInvited(coverContent, coverGuestEl, openBtn);
    }
}

// ---- Show Not Invited State ----
function showNotInvited(coverContent, coverGuestEl, openBtn) {
    if (coverGuestEl) {
        coverGuestEl.innerHTML = `
            <div class="not-invited-message">
                <p style="color: var(--gold-light); font-size: 0.9rem; margin-bottom: 8px;">
                    Maaf, undangan ini bersifat pribadi.
                </p>
                <p style="color: var(--white-alpha-40); font-size: 0.8rem;">
                    Silakan gunakan link undangan yang telah diberikan kepada Anda.
                </p>
            </div>
        `;
    }
    if (openBtn) openBtn.style.display = 'none';
}

// ---- Cover Section ----
function setupCover() {
    const openBtn = document.getElementById('open-btn');
    const cover = document.getElementById('cover');
    const mainContent = document.getElementById('main-content');

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            // Animate cover closing
            cover.classList.add('closing');

            setTimeout(() => {
                cover.style.display = 'none';
                mainContent.classList.remove('hidden');

                // Initialize everything after opening
                initializeApp();

                // Smooth scroll to bismillah
                const bismillah = document.getElementById('bismillah');
                if (bismillah) {
                    bismillah.scrollIntoView({ behavior: 'smooth' });
                }
            }, 800);
        });
    }
}

// ---- Initialize all features after cover opens ----
function initializeApp() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50,
            disable: false,
        });
    }

    // Initialize countdown
    initCountdown(WEDDING_DATE);

    // Load messages
    loadMessages();

    // Initialize gallery
    initGallery();

    // Initialize music
    initMusic();
    tryAutoPlay();

    // Initialize scroll animations
    initAnimations();

    // Setup forms (with guest pre-fill)
    setupForms();

    // Setup navigation
    setupNavigation();

    // Setup copy buttons
    setupCopyButtons();

    // Pre-fill RSVP name from verified guest
    if (window.__weddingGuest) {
        const rsvpNameInput = document.getElementById('rsvp-name');
        const msgNameInput = document.getElementById('msg-name');
        const guestCountInput = document.getElementById('rsvp-guests');
        if (rsvpNameInput) rsvpNameInput.value = window.__weddingGuest.name;
        if (msgNameInput) msgNameInput.value = window.__weddingGuest.name;
        if (guestCountInput && window.__weddingGuest.max_guests) {
            guestCountInput.max = window.__weddingGuest.max_guests;
        }
    }
}

// ---- Forms ----
function setupForms() {
    // RSVP Form
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('rsvp-submit');
            const statusEl = document.getElementById('rsvp-status');

            const data = {
                name: document.getElementById('rsvp-name').value.trim(),
                attendance: document.getElementById('rsvp-attendance').value,
                guest_count: parseInt(document.getElementById('rsvp-guests').value) || 1,
                message: document.getElementById('rsvp-message').value.trim(),
            };

            if (!data.name || !data.attendance) {
                statusEl.textContent = 'Mohon lengkapi nama dan kehadiran';
                statusEl.className = 'form-status error';
                return;
            }

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Mengirim...</span>';

            const result = await submitRSVP(data);

            if (result.success) {
                statusEl.textContent = '✅ Terima kasih atas konfirmasi Anda!';
                statusEl.className = 'form-status success';
                rsvpForm.reset();
            } else {
                statusEl.textContent = '❌ Maaf, terjadi kesalahan. Silakan coba lagi.';
                statusEl.className = 'form-status error';
            }

            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Kirim Konfirmasi</span>';
        });
    }

    // Message Form
    const msgForm = document.getElementById('message-form');
    if (msgForm) {
        msgForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('msg-submit');
            const statusEl = document.getElementById('msg-status');

            const data = {
                name: document.getElementById('msg-name').value.trim(),
                message: document.getElementById('msg-text').value.trim(),
            };

            if (!data.name || !data.message) {
                statusEl.textContent = 'Mohon lengkapi nama dan ucapan';
                statusEl.className = 'form-status error';
                return;
            }

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Mengirim...</span>';

            const result = await submitMessage(data);

            if (result.success) {
                statusEl.textContent = '✅ Terima kasih atas ucapan dan doanya!';
                statusEl.className = 'form-status success';
                msgForm.reset();
                // Reload messages
                loadMessages();
            } else {
                statusEl.textContent = '❌ Maaf, terjadi kesalahan. Silakan coba lagi.';
                statusEl.className = 'form-status error';
            }

            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Kirim Ucapan</span>';
        });
    }
}

// ---- Navigation ----
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');

    // Smooth scroll navigation
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href').replace('#', '');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Active section tracking with Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -70% 0px',
        threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navItems.forEach(item => {
                    item.classList.toggle('active', item.getAttribute('data-section') === id ||
                        item.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        if (section.id !== 'cover') {
            observer.observe(section);
        }
    });
}

// ---- Copy to Clipboard ----
function setupCopyButtons() {
    // Make copyToClipboard available globally
    window.copyToClipboard = async function (btn) {
        const textToCopy = btn.getAttribute('data-copy');
        try {
            await navigator.clipboard.writeText(textToCopy);
            btn.classList.add('copied');
            const textSpan = btn.querySelector('.copy-text');
            const originalText = textSpan.textContent;
            textSpan.textContent = 'Tersalin!';
            setTimeout(() => {
                btn.classList.remove('copied');
                textSpan.textContent = originalText;
            }, 2000);
        } catch {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            btn.classList.add('copied');
            const textSpan = btn.querySelector('.copy-text');
            textSpan.textContent = 'Tersalin!';
            setTimeout(() => {
                btn.classList.remove('copied');
                textSpan.textContent = 'Salin';
            }, 2000);
        }
    };
}
