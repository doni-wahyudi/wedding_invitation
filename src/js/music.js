// ============================================
// MUSIC PLAYER MODULE (YouTube API)
// ============================================

let player = null;
let isPlaying = false;
let isPlayerReady = false;
let autoplayAttempted = false;

// ID Video YouTube (Requested cover version)
const YOUTUBE_VIDEO_ID = 'D-VytLhH-KE';

export function initMusic() {
    const toggleBtn = document.getElementById('music-toggle');
    if (!toggleBtn) return;

    // Load YouTube IFrame API asynchronously
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // This function will be called globally by the YouTube API once loaded
    window.onYouTubeIframeAPIReady = () => {
        player = new YT.Player('youtube-player', {
            height: '0',
            width: '0',
            videoId: YOUTUBE_VIDEO_ID,
            playerVars: {
                'autoplay': 0,
                'controls': 0,
                'disablekb': 1,
                'loop': 1,
                'playsinline': 1,
                // For looping to work, playlist must have the same video id
                'playlist': YOUTUBE_VIDEO_ID
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    };

    toggleBtn.addEventListener('click', () => {
        if (!isPlayerReady || !player) return;

        if (isPlaying) {
            player.pauseVideo();
            toggleBtn.classList.remove('playing');
            isPlaying = false;
        } else {
            player.playVideo();
            toggleBtn.classList.add('playing');
            isPlaying = true;
        }
    });
}

function onPlayerReady(event) {
    isPlayerReady = true;
    event.target.setVolume(30); // Set volume (0-100)
    
    // If tryAutoPlay was called before the player was ready, attempt it now
    if (autoplayAttempted) {
        attemptPlay();
    }
}

function onPlayerStateChange(event) {
    const toggleBtn = document.getElementById('music-toggle');
    
    // 1 = Playing
    if (event.data === YT.PlayerState.PLAYING) {
        if (toggleBtn) toggleBtn.classList.add('playing');
        isPlaying = true;
    } 
    // 2 = Paused, 0 = Ended
    else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
        if (toggleBtn) toggleBtn.classList.remove('playing');
        isPlaying = false;
    }
}

// Auto-play attempt after user interaction (cover button click)
export function tryAutoPlay() {
    autoplayAttempted = true;
    if (isPlayerReady) {
        attemptPlay();
    }
}

function attemptPlay() {
    if (player && typeof player.playVideo === 'function') {
        player.playVideo();
        // The UI state will be handled by the onPlayerStateChange event
    }
}
