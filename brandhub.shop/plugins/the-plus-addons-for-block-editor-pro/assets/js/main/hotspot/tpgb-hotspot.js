/** Hotspot */
window.addEventListener('DOMContentLoaded', (event) => {
    tphospInit(document)
});

function tphospInit(doc){
    let hsAll = doc.querySelectorAll('.tpgb-hotspot');
    if(hsAll){
        hsAll.forEach((hs)=>{
            var overlay_color = hs.querySelector(".tpgb-hotspot-inner.overlay-bg-color"),
                pin_hover = hs.querySelectorAll(".pin-hotspot");
            
            pin_hover.forEach((ph)=>{
                if(overlay_color){
                    ph.addEventListener('mouseenter', ()=>{
                        overlay_color.classList.add('on-hover')
                    })
                    ph.addEventListener('mouseleave', ()=>{
                        overlay_color.classList.remove('on-hover')
                    })
                }
        
                let id = ph.getAttribute('id'),
                    settings = ph.getAttribute("data-tooltip-opt");
        
                settings = JSON.parse(settings);
        
                if(settings && settings.content){
                    tippy( '#'+id , {
                        allowHTML : true,
                        content: settings.content,
                        trigger : settings.trigger,
                        maxWidth : settings.MaxWidth,
                        appendTo: document.querySelector('#'+id),
                    });
                }
            })
        
            let hsOverlay = hs.querySelector('.hotspot-overlay'),
                waypoint = new Waypoint({
                    element: hsOverlay,
                    handler: function () {
                        let pin_hotspot = hs.querySelectorAll(".pin-hotspot-wrapper");
        
                        pin_hotspot.forEach((ph,index)=>{
                            var extrai = 1;
                            setTimeout(function () {
                                ph.classList.remove('amimation-in');
                                ph.classList.add('hotspot-animation-in');
                            }, 200 * (index + extrai));
        
                        });
                        waypoint.destroy();
                    },
                    offset: '200%'
                });
        
        });
    }
}