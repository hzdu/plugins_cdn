document.addEventListener("DOMContentLoaded", function() {
    tpgbrowimgMove(document)
});

function tpgbrowimgMove(doc){
    let getSection = doc.querySelectorAll('.tpgb-section:not(.tpgb-section-editor), .tpgb-container-row:not(.tpgb-container-row-editor)');

    if(getSection){
        getSection.forEach(function(section) {
            var container = section.querySelector('.tpgb-deep-layer');
            var middlecls = section.querySelector('.tpgb-middle-layer');
            if ((container && container.classList.contains("columns_animated_bg")) || (middlecls && middlecls.classList.contains("tpgb-automove-img"))) {
                var animatedElements = section.querySelectorAll('.columns_animated_bg, .tpgb-automove-img .tpgb-parlximg-wrap');
                animatedElements.forEach(function(element) {
                    var dir = element.getAttribute('data-direction');
                    var speed = 100 - element.getAttribute('data-trasition');
                    var coords = 0;
                    setInterval(function() {
                        if (dir === 'left' || dir === 'bottom') {
                            coords -= 1;
                        } else {
                            coords += 1;
                        }
                        if (dir === 'left' || dir === 'right') {
                            element.style.backgroundPosition = coords + 'px 50%';
                        } else {
                            element.style.backgroundPosition = '50% ' + coords + 'px';
                        }
                    }, speed);
                });
            }
        });
    }
   
}