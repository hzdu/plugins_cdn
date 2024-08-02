document.addEventListener('DOMContentLoaded', function() {
    tpgbimgSlide(document)
});

function tpgbimgSlide(doc) {
    let getConn = doc.querySelectorAll('.tpgb-section:not(.tpgb-section-editor), .tpgb-container-row:not(.tpgb-container-row-editor)');
    if(getConn){
        getConn.forEach(function(element) {
            var container = element.querySelector('.tpgb-deep-layer');
    
            // Background Gallery Image
            if (container && container.classList.contains("row-img-slide")) {
                var gallery = container.querySelector('.row-bg-slide').dataset.imgdata;
                var conId = container.getAttribute('id');
                var option = container.querySelector('.row-bg-slide').dataset.galleryopt;

                option = JSON.parse(option);
                gallery = JSON.parse(gallery);
    
                var vegasOptions = {
                    timer: false,
                    transitionDuration: option.transduration,
                    transition: option.transition,
                    delay: option.duration,
                    slides: gallery,
                    animation: option.animation,
                    overlay: option.textureoly
                };
                new Vegas('.tpgb-block-'+conId+' .row-bg-slide', vegasOptions);
            }
        });
    }
}