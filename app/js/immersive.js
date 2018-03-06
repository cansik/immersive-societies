class ImmersiveSocieties {
    init() {
        pannellum.viewer('panorama', {
            "type": "equirectangular",
            "panorama": "https://pannellum.org/images/alma.jpg"
        });
    }

    setupPanorama()
    {
        pannellum.viewer('panorama', {
            "type": "equirectangular",
            "panorama": "https://pannellum.org/images/alma.jpg"
        });
    }
}

let immersiveSocieties = new ImmersiveSocieties();
document.addEventListener('DOMContentLoaded', immersiveSocieties.init);