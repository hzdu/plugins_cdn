// Js For Splide Slider
let slideStore = new Map();

document.addEventListener('DOMContentLoaded', function() {
    tppocaro(document)
});

function tppocaro(doc){
    var scope = doc.querySelectorAll('.tpgb-carousel');
    if(scope){
        scope.forEach(function(obj){
            splide_init(obj)
        });
    }
}

function splide_init(ele){
    var slide = new Splide( ele ).mount( ( window.splide && window.splide !== undefined && window.splide.Extensions) ? window.splide.Extensions : '' );
	slideStore.set( ele, slide);

    if(ele.classList.contains('tpgb-infobox')){
        slide.on('move', function(e, currentSlide, nextSlide) {
            let gtSlide = ele.querySelectorAll('.tpgb-draw-svg');
            gtSlide.forEach((ee)=>{
                ee.querySelector('object').style.opacity = '1';
            })
        });
    }
}