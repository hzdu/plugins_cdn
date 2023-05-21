
 function xImageHotspots(){

    bricksQuerySelectorAll(document, '.brxe-ximagehotspots').forEach( imageHotspot => {

        const configAttr = imageHotspot.getAttribute('data-x-hotspots')
        const config = configAttr ? JSON.parse(configAttr) : {}
        
        imageHotspot.querySelectorAll('.x-marker').forEach( marker => {

            let instance = tippy(marker.querySelector('button.x-marker_marker'), {
                content: marker.querySelector('.x-marker_popover-content'), 
                allowHTML: true,     
                interactive: true, 
                arrow: true,
                trigger: config.interaction,
                appendTo: marker.querySelector('.x-marker_popover'),
                placement: config.placement,
                maxWidth: 'none',    
                animation: 'extras',
                theme: 'extras',     
                touch: true, 
                moveTransition: 'transform ' + config.moveTransition + 'ms ease-out', 
                offset: [ config.offsetSkidding , config.offsetDistance], 
                
            });

        })

    })

}

document.addEventListener("DOMContentLoaded",function(e){
    
    if ( !bricksIsFrontend ) {
        return;
    }

    xImageHotspots()
})
