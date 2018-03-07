function immersive() {
    let audioPlayed = false;

    // audio
    const traffic = createTrack("audio/traffic.mp3");
    const humans = createTrack("audio/humans.mp3");
    const nature = createTrack("audio/background.mp3");

    initPanorama();

    function createTrack(fileName) {
        const player = new Tone.Player(fileName).sync().start(0);
        player.loop = true;
        const panVol = new Tone.PanVol();
        player.chain(panVol, Tone.Master);
        return panVol;
    }

    function initPanorama()
    {
        let viewer = pannellum.viewer('panorama', {
            "type": "equirectangular",
            "showControls": false,
            "panorama": "https://pannellum.org/images/alma.jpg"
        });

        document.getElementById('fullscreen').addEventListener('click', function(e) {
            viewer.toggleFullscreen();
        });

        document.getElementById('filter-traffic').addEventListener('click', function(e) {
            traffic.mute = !traffic.mute;
        });

        document.getElementById('filter-humans').addEventListener('click', function(e) {
            humans.mute = !humans.mute;
        });

        document.getElementById('filter-nature').addEventListener('click', function(e) {
            nature.mute = !nature.mute;
        });

        document.getElementById('mute').addEventListener('click', function(e) {
            if(audioPlayed)
                Tone.Transport.stop();
            else
                Tone.Transport.start();

            audioPlayed = !audioPlayed;
        });

        viewer.on("load", function (e) {
            // start audio
            Tone.Transport.start();
        });
    }
}

document.addEventListener('DOMContentLoaded', immersive);