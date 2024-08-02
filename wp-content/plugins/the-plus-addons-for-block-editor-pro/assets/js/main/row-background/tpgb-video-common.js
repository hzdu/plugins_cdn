document.addEventListener("DOMContentLoaded", function() {
    tpgbvideoComm(document)
});

function tpgbvideoComm(doc){
    let getSections = doc.querySelectorAll('.tpgb-section:not(.tpgb-section-editor), .tpgb-container-row:not(.tpgb-container-row-editor)');
    getSections.forEach(function(section) {
        var container = section.querySelector('.tpgb-deep-layer');

        if (section.querySelectorAll("video.self-hosted-video, .tpgb-iframe").length > 0) {
            // setTimeout(function() {
                var videos = container.querySelectorAll('video.self-hosted-video, .tpgb-iframe');

                videos.forEach(function(video) {
                    if( video.classList.contains('self-hosted-video') ){
                        const promise = video.play();
                        if(promise !== undefined){
                            promise.then(() => {
                            }).catch(() => {
                                video.muted = true;
                                video.play()
                            });
                        }
                    }
                });

                videos.forEach(function(video) {
                    tpgb_VideoBgInit(video);
                });

                function tpgb_VideoBgInit(ele) {
                    var self = ele,
                        parent = ele.parentNode,
                        ratio = 1.778,
                        pWidth = ( parent ) ? parent.offsetWidth : '',
                        pHeight = ( parent ) ? parent.offsetHeight : '',
                        selfWidth,
                        selfHeight;

                    function setSizes() {
                        if (pWidth / ratio < pHeight) {
                            selfWidth = Math.ceil(pHeight * ratio);
                            selfHeight = pHeight;
                            self.style.width = selfWidth + "px";
                            self.style.height = selfHeight + "px";
                        } else {
                            selfWidth = pWidth;
                            selfHeight = Math.ceil(pWidth / ratio);
                            self.style.width = selfWidth + "px";
                            self.style.height = selfHeight + "px";
                        }
                    }

                    setSizes();
                    window.addEventListener('resize', setSizes);
                }

            // }, 100);
        }
    });
}