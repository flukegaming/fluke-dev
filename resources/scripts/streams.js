const containerId = 'stream-player';
const container = document.getElementById(containerId);
const tabs = {
    flukeTTV: document.getElementById('tab-flukeTTV'),
    flukeYT: document.getElementById('tab-flukeYT'),
};

let twitchPlayer = null;

// ---------- TWITCH STREAM ----------

function loadTwitch() {
    container.innerHTML = ''; // clear YouTube iframe if present

    var options = {
        autoplay: false,
        muted: true,
        channel: 'flukegamingttv'
    };

    var twitchPlayer = new Twitch.Player(container, options);
    twitchPlayer.setVolume(0.5);
}

// ---------- YOUTUBE STREAM ----------

async function isYouTubeLive(channelId, apiKey) {
    const base = 'https://www.googleapis.com/youtube/v3';
    try {
        const res  = await fetch(
            `${base}/search?part=snippet&channelId=${channelId}` +
            `&eventType=live&type=video&key=${apiKey}`
        );
        const data = await res.json();
        return (data.items && data.items.length > 0)
            ? data.items[0].id.videoId     // truthy string if live
            : null;                        // null if offline
    } catch (err) {
        console.error('YT Live check failed:', err);
        return null;
    }
}

async function loadYouTube() {
    const API_KEY = 'AIzaSyBLAdU6OWt4djsbPXZGITUlkl6FYePXZ-w';
    const CHANNEL_ID = 'UCewiYYWHvvmSqnxq5U9TNZg';
        
    var videoId = await isYouTubeLive(CHANNEL_ID, API_KEY);
    console.log(videoId);

    if (videoId) {
        container.innerHTML = `
            <iframe frameborder="0" modestbranding="1" allowfullscreen
                allow="autoplay; encrypted-media"
                src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1">
            </iframe>
        `;
    } else {
        container.innerHTML = 'offline';
    }

    twitchPlayer = null;
}

// ---------- STREAM SELECTOR ----------

function setActive(active) {
    Object.entries(tabs).forEach(([key, element]) => {
        element.setAttribute('aria-selected', key === active);
    });

    if (active === 'flukeTTV') loadTwitch();
    if (active === 'flukeYT') loadYouTube();
}

tabs.flukeTTV.onclick = () => setActive('flukeTTV');
tabs.flukeYT.onclick = () => setActive('flukeYT');

// default
setActive('flukeTTV');