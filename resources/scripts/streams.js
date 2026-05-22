const containerId = 'stream-player';
const container = document.getElementById(containerId);
const tabs = {
    flukeTTV: document.getElementById('tab-flukeTTV'),
    flukeYT: document.getElementById('tab-flukeYT'),
};

let twitchPlayer = null;

function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-CA', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
}

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
        const res = await fetch(
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

async function getYouTubeVideos(channelId, apiKey) {
    const base = 'https://www.googleapis.com/youtube/v3';
    try {
        const res = await fetch(
            `${base}/search?part=snippet&channelId=${channelId}` +
            `&order=date&type=video&maxResults=2&key=${apiKey}`
        );
        const data = await res.json();
        return (data.items && data.items.length > 0)
            ? data.items : null;
    } catch (err) {
        console.error('YT Video check failed:', err);
        return null;
    }
}

function showYouTubeVideos(videos) {
    html = videos.map(v => {
        const id = v.id.videoId;
        const title = v.snippet.title;
        const thumb = v.snippet.thumbnails.medium.url;
        const date = formatDate(v.snippet.publishedAt);

        return `
            <a class="stream__card"
                href="https://www.youtube.com/watch?v=${id}"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="${title}">
                <div class="stream__card-thumb-wrap">
                    <img class="stream__card-thumb"
                        src="${thumb}"
                        alt="${title}"
                        loading="lazy">
                </div>
                <div class="stream__card-info">
                    <p class="stream__card-title">${title}</p>
                    <p class="stream__card-date">${date}</p>
                </div>
            </a>
        `;
    }).join('');

    return html;
}

async function loadYouTube() {
    const API_KEY = 'AIzaSyBLAdU6OWt4djsbPXZGITUlkl6FYePXZ-w';
    const CHANNEL_ID = 'UCewiYYWHvvmSqnxq5U9TNZg';

    const videoId = await isYouTubeLive(CHANNEL_ID, API_KEY);
    console.log(videoId);

    if (videoId) {
        container.innerHTML = `
            <iframe frameborder="0" modestbranding="1" allowfullscreen
                allow="autoplay; encrypted-media"
                src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1">
            </iframe>
        `;
    } else {
        const ytVideos = await getYouTubeVideos(CHANNEL_ID, API_KEY);
        if (ytVideos) {
            container.innerHTML = `
                <p class="stream__offline-label">Latest Videos</p>
            `;
        } else {
            container.innerHTML = `
                <h2 class="section__subheader">Could not load channel info.</h2>
            `;
        }

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