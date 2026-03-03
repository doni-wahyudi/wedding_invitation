// ============================================
// MUSIC PLAYER MODULE
// ============================================

let audio = null;
let isPlaying = false;

export function initMusic() {
    const toggleBtn = document.getElementById('music-toggle');

    if (!toggleBtn) return;

    // Create audio element
    // Replace this URL with your actual background music (nasheed, etc.)
    audio = new Audio();
    // Example: audio.src = '/assets/audio/background-nasheed.mp3';
    // For now, we keep it empty - you can add your own nasheed audio file
    audio.loop = true;
    audio.volume = 0.3;

    toggleBtn.addEventListener('click', () => {
        if (!audio.src || audio.src === window.location.href) {
            // No audio source set
            console.warn('⚠️ Belum ada file audio. Tambahkan file audio di src/js/music.js');
            return;
        }

        if (isPlaying) {
            audio.pause();
            toggleBtn.classList.remove('playing');
            isPlaying = false;
        } else {
            audio.play().then(() => {
                toggleBtn.classList.add('playing');
                isPlaying = true;
            }).catch(err => {
                console.warn('Audio autoplay blocked:', err);
            });
        }
    });
}

// Auto-play attempt after user interaction (cover button click)
export function tryAutoPlay() {
    if (audio && audio.src && audio.src !== window.location.href) {
        audio.play().then(() => {
            const toggleBtn = document.getElementById('music-toggle');
            if (toggleBtn) toggleBtn.classList.add('playing');
            isPlaying = true;
        }).catch(() => {
            // Autoplay blocked, user can click the button manually
        });
    }
}
