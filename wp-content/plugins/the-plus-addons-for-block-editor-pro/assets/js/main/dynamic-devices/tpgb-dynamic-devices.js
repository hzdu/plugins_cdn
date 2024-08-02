/* Dynamic Devices Start */

document.addEventListener("DOMContentLoaded", (event) => {
    tpdyDevices(document);
});

function tpdyDevices(doc){
    let allDD = doc.querySelectorAll('.tpgb-dynamic-device');
    if(allDD){
        allDD.forEach( el => {

            let blockId = el.getAttribute("data-id"),
                dataAtt = el.getAttribute('data-fancy-option');

            if(dataAtt){
                if(dataAtt){
                    Fancybox.bind('[data-fancybox="'+blockId+'"]')
                }
            }

            let ddMul = el.classList.contains('tpgb-dd-multi-connect'),
                deviceContent = el.querySelector('.tpgb-device-content');
            if(ddMul){
                let conId = el.getAttribute("data-connectdd"),
                    conIdClass = document.querySelectorAll('.'+conId);

                deviceContent.addEventListener("mouseenter", function(){
                    conIdClass.forEach( cId => {
                        let scrlImg = cId.querySelector('.tpgb-scroll-img-js');
                        scrlImg.classList.add('active_on_scroll');
                    });
                    
                })
                deviceContent.addEventListener("mouseleave", function(){
                    conIdClass.forEach( cId => {
                        let scrlImg = cId.querySelector('.tpgb-scroll-img-js');
                        scrlImg.classList.remove('active_on_scroll');
                    });
                })
            }

            let rebHover = el.classList.contains('reusable-block-hover-scroll');
            if(rebHover){
                deviceContent.addEventListener("mouseenter", function(de){
                    de.currentTarget.classList.add('active_on_scroll');
                    
                })
                deviceContent.addEventListener("mouseleave", function(de){
                    de.currentTarget.classList.remove('active_on_scroll');
                })
            }

            let rebMul = el.classList.contains('tpgb-mul-reb-connect');
            if(rebMul){
                let rebConId = el.getAttribute("data-connectdd"),
                    rConIdClass = document.querySelectorAll('.'+rebConId);

                deviceContent.addEventListener("mouseenter", function(){
                    rConIdClass.forEach( cId => {
                        let devCon = cId.querySelector('.tpgb-device-content');
                        devCon.classList.add('active_on_scroll');
                    });
                    
                })
                deviceContent.addEventListener("mouseleave", function(){
                    rConIdClass.forEach( cId => {
                        let devCon = cId.querySelector('.tpgb-device-content');
                        devCon.classList.remove('active_on_scroll');
                    });
                })
            }

        });
    }
}
/* Dynamic Devices End */