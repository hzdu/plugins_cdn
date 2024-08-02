document.addEventListener("DOMContentLoaded", function() {
    tpgbyouVideo(document)
});

function tpgbyouVideo(doc){
    var yutDiv = doc.querySelectorAll('.tpgb-section:not(.tpgb-section-editor), .tpgb-container-row:not(.tpgb-container-row-editor)')

    if(yutDiv){
        yutDiv.forEach(function(section) {
            var container = section.querySelector('.tpgb-deep-layer');
        
            if (container && container.classList.contains("tpgb-video-youtube")) {
                var tag = document.createElement('script');
                tag.src = "//www.youtube.com/iframe_api";
                var firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        
                var players = {};
        
                window.onYouTubeIframeAPIReady = function() {
                    section.querySelectorAll('.tpgb-video-youtube iframe').forEach(function(iframe) {
                        var id = iframe.getAttribute('id');
                        players[id] = new YT.Player(id, {
                            playerVars: { autoplay: 1 },
                            events: {
                                onReady: function(e) {
                                    if (iframe.getAttribute('data-muted') === '1') {
                                        e.target.mute();
                                    }
                                    e.target.playVideo();
                                },
                                onStateChange: function(e) {
                                    if (e && e.data === 1) {
                                        var videoHolder = document.querySelector('.video-' + id);
                                        if (videoHolder) {
                                            videoHolder.classList.remove('tp-loading');
                                        }
                                    } else if (e && e.data === 0) {
                                        e.target.playVideo();
                                    }
                                }
                            }
                        });
                    });
                };
            }
        });
    }
}

