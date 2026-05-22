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
        const liveResponse = await fetch(
            `${base}/search?part=snippet&channelId=${channelId}` +
            `&eventType=live&type=video&key=${apiKey}`
        );

        const liveData = await liveResponse.json();
        return (liveData.items && liveData.items.length > 0);

    } catch (err) {
      console.error('YT Live check failed:', err);
      elStatus.querySelector('.stream__status-text').textContent =
        'Could not load stream info.';
    }
}

function loadYouTube() {
    const API_KEY = 'AIzaSyBLAdU6OWt4djsbPXZGITUlkl6FYePXZ-w';
    const CHANNEL_ID = 'UCewiYYWHvvmSqnxq5U9TNZg';

    // Twitch embed doesn't have a clean destroy API, so wipe DOM
    container.innerHTML = `
        <iframe frameborder="0" modestbranding="1" mute="1" allowfullscreen
        src="https://www.youtube.com/embed/live_stream?channel=${CHANNEL_ID}">
        </iframe>
    `;
    twitchPlayer = null;
    
    var isLive = isYouTubeLive(CHANNEL_ID, API_KEY);
    console.log(isLive);
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