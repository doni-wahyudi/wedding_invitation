// ============================================
// COUNTDOWN TIMER MODULE
// ============================================

let countdownInterval = null;

export function initCountdown(targetDate) {
    const target = new Date(targetDate).getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const diff = target - now;

        if (diff <= 0) {
            // Wedding day has arrived!
            setCountdownValue('cd-days', '00');
            setCountdownValue('cd-hours', '00');
            setCountdownValue('cd-minutes', '00');
            setCountdownValue('cd-seconds', '00');

            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        animateNumber('cd-days', days);
        animateNumber('cd-hours', hours);
        animateNumber('cd-minutes', minutes);
        animateNumber('cd-seconds', seconds);
    }

    // Initial update
    updateCountdown();

    // Update every second
    countdownInterval = setInterval(updateCountdown, 1000);
}

function setCountdownValue(id, value) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = value;
    }
}

function animateNumber(id, value) {
    const el = document.getElementById(id);
    if (!el) return;

    const formatted = String(value).padStart(2, '0');
    const current = el.textContent;

    if (current !== formatted) {
        // Add flip animation class
        const parent = el.closest('.countdown-flip');
        if (parent) {
            parent.classList.add('flipping');
            setTimeout(() => {
                el.textContent = formatted;
                parent.classList.remove('flipping');
            }, 150);
        } else {
            el.textContent = formatted;
        }
    }
}
