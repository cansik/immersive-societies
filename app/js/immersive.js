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

            viewer.loadScene('newSceneId', viewer.getPitch(), viewer.getYaw(), viewer.getHfov());
        });

        document.getElementById('filter-humans').addEventListener('click', function(e) {
            humans.mute = !humans.mute;
        });

        document.getElementById('filter-nature').addEventListener('click', function(e) {
            nature.mute = !nature.mute;
        });

        document.getElementById('test').addEventListener('click', function(e) {
            /*
            Jimp.read("img/alma-bw.jpg").then(function (lenna) {
                lenna.resize(256, 256)            // resize
                    .quality(60)                 // set JPEG quality
                    .greyscale()                 // set greyscale
                    .getBase64(Jimp.MIME_JPEG, function (err, src) {
                        var img = document.createElement("img");
                        img.setAttribute("src", src);
                        document.body.appendChild(img);
                    });
            }).catch(function (err) {
                console.error(err);
            });
            */

            let renderer = viewer.getRenderer();
            let config = viewer.getConfig();

            // create image
            let img = new Image();

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
            };

            img.src = "img/alma-bw.jpg";
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