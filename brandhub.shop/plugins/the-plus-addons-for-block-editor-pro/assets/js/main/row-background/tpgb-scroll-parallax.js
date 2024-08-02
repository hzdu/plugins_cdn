document.addEventListener('DOMContentLoaded', () => {
    tpgbscrollParallex(document)
});

function tpgbscrollParallex(doc) {
    let allScrollP = doc.querySelectorAll('.tpgb-section:not(.tpgb-section-editor),.tpgb-container-row:not(.tpgb-container-row-editor)');
    if(allScrollP){
        allScrollP.forEach((sp)=>{
            if(sp.classList.contains('tpgb-scroll-parallax')){
                var controller = new ScrollMagic.Controller();
                let bcg = sp.querySelector('.img-scroll-parallax');

                var slideParallaxScene = new ScrollMagic.Scene({
                    triggerElement: sp,
                    triggerHook: 1,
                    duration: "200%"
                })
                .setTween(TweenMax.fromTo(bcg, 1, {backgroundPositionY: '15%', ease: "Power0.easeNone"},{backgroundPositionY: '85%', ease:"Power0.easeNone"}))
                .addTo(controller);
            }

        });
    }
}