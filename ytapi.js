var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '200', // YouTube needs >0 dimensions to load properly
        width: '200',  
        videoId: 'xORCbIptqcc', // Lofi Girl Live Stream
        playerVars: {
            'playsinline': 1,
            'controls': 0
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');

    playBtn.addEventListener('click', function() {
        player.playVideo();
    });

    pauseBtn.addEventListener('click', function() {
        player.pauseVideo();
    });
}