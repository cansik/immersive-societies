function immersive() {
    let audioPlayed = false;

    // audio
    const traffic = createTrack("audio/traffic.mp3", 0, 0);
    const humans = createTrack("audio/humans.mp3", -10, 0.5);
    const nature = createTrack("audio/background.mp3", -25, 1);

    const baseImage = Jimp.read("img/pano/street_base.jpg");
    const trafficImage = Jimp.read("img/pano/street_traffic.png");
    const humanImage = Jimp.read("img/pano/street_human.png");

    initPanorama();
    initAudio();

    function initAudio() {
    }

    function createTrack(fileName, volume, offset) {
        const player = new Tone.Player(fileName).sync().start(offset);
        player.loop = true;
        const vol = new Tone.Volume(volume);
        player.chain(vol, Tone.Master);
        return vol;
    }

    function setFilteredImage(viewer) {
        Promise.all([baseImage, trafficImage, humanImage]).then(images => {
            let scene = images[0].clone();

            // render traffic
            if(!traffic.mute)
                scene.composite(images[1], 0, 0);

            // render human
            if(!humans.mute)
                scene.composite(images[2], 0, 0);

            scene.getBase64(Jimp.MIME_JPEG, function (err, src) {
                    let img = document.createElement("img");

                    let renderer = viewer.getRenderer();
                    let config = viewer.getConfig();

                    // create image
                    img.onload = function(){
                        console.log("image loaded!");
                        let params = {};
                        if (config.horizonPitch !== undefined)
                            params.horizonPitch = config.horizonPitch * Math.PI / 180;
                        if (config.horizonRoll !== undefined)
                            params.horizonRoll = config.horizonRoll * Math.PI / 180;
                        if (config.backgroundColor !== undefined)
                            params.backgroundColor = config.backgroundColor;

                        function renderInitCallback() {
                            console.log("rendering image");
                        }

                        renderer.init(img, config.type, config.dynamic, config.haov * Math.PI / 180, config.vaov * Math.PI / 180, config.vOffset * Math.PI / 180, renderInitCallback, params);
                        renderer.resize();
                        viewer.setUpdate(true);
                    };

                    img.setAttribute("src", src);
                });
        });
    }

    function initPanorama()
    {
        let viewer = pannellum.viewer('panorama', {
            "type": "equirectangular",
            "showControls": false,
            "panorama": "img/pano/street.png",
            "preview": "img/pano/street_preview.jpg"
        });

        document.getElementById('fullscreen').addEventListener('click', function(e) {
            viewer.toggleFullscreen();
        });

        document.getElementById('filter-traffic').addEventListener('click', function(e) {
            traffic.mute = !traffic.mute;
            setFilteredImage(viewer);
        });

        document.getElementById('filter-humans').addEventListener('click', function(e) {
            humans.mute = !humans.mute;
            setFilteredImage(viewer);
        });

        document.getElementById('filter-nature').addEventListener('click', function(e) {
            nature.mute = !nature.mute;
        });

        /*
        document.getElementById('test').addEventListener('click', function(e) {
            setFilteredImage(viewer);
        });
        */

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