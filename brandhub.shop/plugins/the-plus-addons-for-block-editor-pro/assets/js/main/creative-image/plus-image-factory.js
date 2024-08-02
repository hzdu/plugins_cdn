/**
 * Creative Image
 */
document.addEventListener('DOMContentLoaded', () => {
    tpadvImg(document)
});

function tpadvImg(doc){
    let creaImg = doc.querySelectorAll('.tpgb-creative-image');
    if(creaImg){
        creaImg.forEach((ci, idx)=>{

            /**Img Parallax*/
            let imgParlx = ci.querySelector('.tpgb-creative-img-parallax');
            if(imgParlx){
                var controller = new ScrollMagic.Controller();
                var data_p_x = imgParlx.getAttribute('data-scroll-parallax-x'),
                    data_p_y = imgParlx.getAttribute('data-scroll-parallax-y');

                data_p_x = -(data_p_x);
                var parallax_image = imgParlx.querySelector('.tpgb-simple-parallax-img');
                    tween = 'tween-' +idx;
                tween = new TimelineMax();
                new ScrollMagic.Scene({
                    triggerElement: imgParlx,
                    duration: '150%'
                }).setTween(tween.from(parallax_image, 1, {x:data_p_x,y:data_p_y,ease: Linear.easeNone})).addTo(controller);
            }
            
            /**BG Img Animation*/
            let bgImgAnimate = ci.querySelector('.tpgb-animate-image.tpgb-bg-img-animated');
            if(bgImgAnimate){
                waypoint = new Waypoint({
                    element: bgImgAnimate,
                    handler: function(direction) {
                        if( direction == 'down' ) {
                            if(bgImgAnimate.classList.contains('tpgb-creative-animated')) {
                                bgImgAnimate.classList.contains('tpgb-creative-animated');
                            } else {
                                bgImgAnimate.classList.add('tpgb-creative-animated');
                            }
                        }
                    },
                }, {triggerOnce:true, offset: '90%'} );
            }

            /**Fancybox*/
            let tpImg = ci.querySelector('.tpgb-animate-image.tpgb-fancy-add');
            if(tpImg) {
                let BoxID = tpImg.dataset.id,
                    Setting = JSON.parse(tpImg.dataset.fancyOption);

                    Fancybox.bind('[data-fancybox="fancyImg-'+BoxID+'"]',{
                        Toolbar: {
                            display: {
                              right: Setting.button,
                            },
                        }
                    })
            }
        });
    }
}