const stations = [
    {
        name: "Lofi Girl",
        videoId: 'X4VbdwhkE10', 
        bgImage: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjNvb3Axbng3bDB6MHBudDI4b21nNnVmZjlia2gwN3R6dnR0dHJrbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tjYS8yUChlzSmdKx9x/giphy.gif'
    },
    {
        name: "Synthwave City",
        videoId: 'xORCbIptqcc', // Synthwave radio
        bgImage: 'https://i.pinimg.com/1200x/3a/9f/45/3a9f4547c6828c67ab14b92bb8e07536.jpg' // Cyberpunk/Pixel art aesthetic
    },
    {
        name: "Cozy Room",
        videoId: 'JD-kMIpDfnY', // Lofi Boy radio
        bgImage: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTd3eHB2dzNtZHZtZzByeXp3YTd5d3QyMXY3aDg2Zm9hYjNlbnp2ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/C3gZCY92Cwyxq/giphy.gif' // Cozy pixel art room
    }
];

let currentStationIndex = 0; // Starts at the first station

// --- YouTube API Setup ---
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '200', 
        width: '200',  
        videoId: stations[currentStationIndex].videoId, // Loads the first video dynamically
        playerVars: {
            'playsinline': 1,
            'controls': 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    pauseBtn.hidden=true;
    playBtn.addEventListener('click', function() {
        player.playVideo();
        playBtn.hidden=true;
        pauseBtn.hidden=false;
    });

    pauseBtn.addEventListener('click', function() {
        player.pauseVideo();
        playBtn.hidden=false;
        pauseBtn.hidden=true;
    });
    let i=0;
    window.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            // Prevent the default behavior (like page scrolling down)
            event.preventDefault(); 
            if(i%2==0){
                player.playVideo();
                playBtn.hidden=true;
            pauseBtn.hidden=false;
            }else{
                player.pauseVideo();
                playBtn.hidden=false;
                pauseBtn.hidden=true;
            }
            i++;
            console.log('Space key pressed!');
        }
    });
    // Grab initial title
    updateTitle();
}

function onPlayerStateChange(event) {
    updateTitle();
}

function updateTitle() {
    const videoData = player.getVideoData();
    if (videoData && videoData.title) {
        document.getElementById('current-song').textContent = "Now playing: " + videoData.title;
    }
}

// --- Next & Prev Button Logic ---
function loadStation(index) {
    // Loop back to the start if we go past the end of the array
    if (index >= stations.length) {
        currentStationIndex = 0;
    } 
    // Loop to the end if we go backwards past zero
    else if (index < 0) {
        currentStationIndex = stations.length - 1;
    } 
    // Otherwise, just use the new index
    else {
        currentStationIndex = index;
    }

    const station = stations[currentStationIndex];

    // 1. Change the background image
    document.body.style.backgroundImage = `url('${station.bgImage}')`;

    // 2. Change the YouTube video and auto-play it
    if (player && player.loadVideoById) {
        player.loadVideoById(station.videoId);
    }

    // 3. Temporarily update title while it loads
    document.getElementById('current-song').textContent = "Tuning in to " + station.name + "...";
}

// Click Listeners for Next/Prev
document.getElementById('next-btn').addEventListener('click', function() {
    loadStation(currentStationIndex + 1);
});

document.getElementById('prev-btn').addEventListener('click', function() {
    loadStation(currentStationIndex - 1);
});

// --- Next & Prev Button Logic ---

// Load a public domain white noise/static sound
const staticSound = new Audio('https://upload.wikimedia.org/wikipedia/commons/d/d9/White_noise.ogg');
staticSound.volume = 0.4; // Keep it at 40% volume so it isn't too loud

function loadStation(index) {
    if (index >= stations.length) {
        currentStationIndex = 0;
    } else if (index < 0) {
        currentStationIndex = stations.length - 1;
    } else {
        currentStationIndex = index;
    }

    const station = stations[currentStationIndex];
    const overlay = document.getElementById('static-overlay');

    // 1. Start the visual and audio static effect
    overlay.classList.add('show-static');
    staticSound.currentTime = 0; // Rewind sound to the beginning
    staticSound.play();

    // Temporarily update title while the static plays
    document.getElementById('current-song').textContent = "Tuning in to " + station.name + "...";

    // 2. Wait for 600 milliseconds, then swap the channel
    setTimeout(() => {
        // Change the background image
        document.body.style.backgroundImage = `url('${station.bgImage}')`;

        // Change the YouTube video
        if (player && player.loadVideoById) {
            player.loadVideoById(station.videoId);
        }

        // Remove visual static
        overlay.classList.remove('show-static');

        // Stop audio static
        staticSound.pause();

    }, 2000); // 600ms = just over half a second of static
}