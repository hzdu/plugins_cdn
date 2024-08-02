/**
 * Media Listing
 */
document.addEventListener('DOMContentLoaded', () => {
    tpmediaInit(document)
});

function tpmediaInit(doc){
    let allGallery = doc.querySelectorAll('.tpgb-gallery-list');

    if(allGallery){
        allGallery.forEach((glr)=>{
            if(glr.classList.contains('gallery-style-2') || glr.classList.contains('gallery-style-3')){
                let gItem = glr.querySelectorAll('.grid-item');
                if(gItem){
                    gItem.forEach((gi)=>{
                        if(glr.classList.contains('gallery-style-2')){
                            let gtContent = gi.querySelector('.tpgb-gallery-list-content');
                            if(gtContent){
                                gtContent.addEventListener('mouseenter',(e)=>{
                                    let hvrCnt = e.currentTarget.querySelector('.post-hover-content');
                                    if(hvrCnt){
                                        slideDownP(hvrCnt, 300)
                                    }
                                });
                                gtContent.addEventListener('mouseleave',(e)=>{
                                    let hvrCnt = e.currentTarget.querySelector('.post-hover-content');
                                    if(hvrCnt){
                                        slideUpP(hvrCnt, 300)
                                    }
                                });
                            }
                        }
                        if(glr.classList.contains('gallery-style-3')){
                            ['mouseenter', 'mouseleave'].forEach(function (eventname) {
                                gi.addEventListener(eventname, function (event) {
                                  var dir = getHoverDirection(event);
                                  event.currentTarget.classList.remove('mouseenter');
                                  event.currentTarget.classList.remove('mouseleave');
                                  event.currentTarget.classList.remove('top');
                                  event.currentTarget.classList.remove('right');
                                  event.currentTarget.classList.remove('bottom');
                                  event.currentTarget.classList.remove('left');
                                  event.currentTarget.className += ' ' + event.type + ' ' + dir;
                                }, false);
                              });
                        }
                    });
                }
            }

            let BoxID = glr.getAttribute("data-id"),
                Setting = JSON.parse(glr.getAttribute("data-fancy-option"));

                let infobar = (Setting.infobar) ? ['infobar']: [];

                // Navigation: ,
                let optns = {
                    Carousel: {
                        infinite: Setting.loop,
                        transition: Setting.transitionEffect
                    },
                    Toolbar: {
                        display: {
                          left: infobar,
                          right: Setting.button,
                        },
                    }
                }
                if(!Setting.arrows){
                    optns.Carousel.Navigation = false;
                }
                if(Setting.thumb!='no'){
                    optns.Thumbs = { 'type' : Setting.thumb}
                }else{
                    optns.Thumbs = false
                }

                Fancybox.bind('[data-fancybox="'+BoxID+'"]',optns)
        });
    }
}

const getHoverDirection = function (event) {
    var directions = ['top', 'right', 'bottom', 'left'];
    var item = event.currentTarget;
    var w = item.offsetWidth;
    var h = item.offsetHeight;
    var x = (event.clientX - item.getBoundingClientRect().left - (w / 2)) * (w > h ? (h / w) : 1);
    var y = (event.clientY - item.getBoundingClientRect().top - (h / 2)) * (h > w ? (w / h) : 1);
    var d = Math.round(Math.atan2(y, x) / 1.57079633 + 5) % 4;
    return directions[d];
  };