document.addEventListener("DOMContentLoaded", function() {
    tpgbselfVideo(document)
});

function tpgbselfVideo(doc){
    var selviDiv = doc.querySelectorAll('.tpgb-section:not(.tpgb-section-editor), .tpgb-container-row:not(.tpgb-container-row-editor)')
    selviDiv.forEach(function (element) {
        var container = element.querySelector('.tpgb-deep-layer');

        // Self Hosted Video 
        if (container.classList.contains("tpgb-video-self-hosted")) {
            container.querySelectorAll('.self-hosted-video').forEach(function (videoElement) {
                var dk_mp4 = videoElement.dataset.dkMp4,
                    width = window.innerWidth,
                    dk_webm = videoElement.dataset.dkWebm;

                videoElement.style.width = width + 'px';

                if (dk_mp4 !== undefined && dk_mp4 !== '') {
                    var mp4_source = document.createElement('source');
                    mp4_source.src = dk_mp4;
                    mp4_source.type = 'video/mp4';
                    videoElement.appendChild(mp4_source);
                }

                if (dk_webm !== undefined && dk_webm !== '') {
                    var webm_source = document.createElement('source');
                    webm_source.src = dk_webm;
                    webm_source.type = 'video/webm';
                    videoElement.appendChild(webm_source);
                }
            });
        }
    });
}