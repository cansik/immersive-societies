function immersive() {
    initAudio();
    initPanorama();

    function initAudio() {

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
            viewer.setPitch(viewer.getPitch() + 10);
        });

        document.getElementById('filter-humans').addEventListener('click', function(e) {
            viewer.setPitch(viewer.getPitch() + 10);
        });

        document.getElementById('filter-nature').addEventListener('click', function(e) {
            viewer.setPitch(viewer.getPitch() + 10);
        });
    }
}

document.addEventListener('DOMContentLoaded', immersive);