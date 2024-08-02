document.addEventListener("DOMContentLoaded", function() {
	tpgbvimooVideo(document)
})

function tpgbvimooVideo(doc){
	var sections = doc.querySelectorAll('.tpgb-section:not(.tpgb-section-editor), .tpgb-container-row:not(.tpgb-container-row-editor)');
    sections.forEach(function(section) {
        var container = section.querySelector('.tpgb-deep-layer');

        if (container.classList.contains("tpgb-video-vimeo")) {
            var iframes = section.querySelectorAll('.tpgb-video-vimeo iframe');
            iframes.forEach(function(iframe) {
                var self = iframe;

                if (window.addEventListener) {
                    window.addEventListener('message', onMessageReceived, false);
                } else {
                    window.attachEvent('onmessage', onMessageReceived, false);
                }

                function onMessageReceived(e) {
                    if (e.origin === 'https://player.vimeo.com') {
                        var data = JSON.parse(e.data),
                            id = self.getAttribute('id');

                        switch (data.event) {
                            case 'ready':
                                self.contentWindow.postMessage('{"method":"play", "value":1}', 'https://player.vimeo.com');
                                if (self.dataset.muted && self.dataset.muted === '1') {
                                    self.contentWindow.postMessage('{"method":"setVolume", "value":0}', 'https://player.vimeo.com');
                                }
                                var videoHolder = document.getElementsByClassName('video-' + id);
                                if (videoHolder.length > 0) {
                                    videoHolder[0].classList.remove('tp-loading');
                                }
                                break;
                        }
                    }
                }
            });
        }
    });
}
