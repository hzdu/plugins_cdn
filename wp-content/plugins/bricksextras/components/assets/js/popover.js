
 function xPopover(){

    bricksQuerySelectorAll(document, '.brxe-xpopover').forEach( popover => {

        const configAttr = popover.getAttribute('data-x-popover')
        const config = configAttr ? JSON.parse(configAttr) : {}

        let tippyProps, tippyEl;

            if ( document.querySelector('body > .brx-body.iframe') ) {

                tippyEl = popover.querySelector('.x-popover_button')
                tippyProps = {
                    render(instance) {
                        const popper = popover.querySelector('[data-tippy-root]');
                        return {
                            popper,
                        };
                    },
                    allowHTML: true,     
                    interactive: true, 
                    arrow: true,
                    trigger: 'click',
                    appendTo: popover.querySelector('.x-popover_content'),
                    placement: config.placement,
                    maxWidth: 'none',    
                    animation: 'extras',
                    theme: 'extras',     
                    touch: true, 
                    moveTransition: 'transform ' + config.moveTransition + 'ms ease-out', 
                    offset: [ config.offsetSkidding , config.offsetDistance], 
                    
                }

            } else {

                const content = config.dynamicContent ? '' : popover.querySelector('.x-popover_content-inner');
                const elementSelector = config.dynamicContent ? config.elementSelector + '[data-tippy-content]' : config.elementSelector;

                tippyEl = config.elementSelector ? elementSelector : popover.querySelector('.x-popover_button')
                tippyProps = {
                    content: content, 
                    allowHTML: true,     
                    interactive: true, 
                    arrow: true,
                    trigger: config.interaction,
                    appendTo: popover.querySelector('.x-popover_content'),
                    placement: config.placement,
                    maxWidth: 'none',    
                    animation: 'extras',
                    theme: 'extras',     
                    touch: true, 
                    moveTransition: 'transform ' + config.moveTransition + 'ms ease-out', 
                    offset: [ config.offsetSkidding , config.offsetDistance], 
                    onShow(instance) {
                        setTimeout(() => {
                            if( typeof bricksLazyLoad === "function" ){
                                bricksLazyLoad()
                            }
                        }, 50)
                    }
                };
            }  

            const xTippyInstance = tippy(tippyEl,tippyProps);
            window.xTippy.Instances[popover.dataset.xId] = xTippyInstance;

    })

}

document.addEventListener("DOMContentLoaded",function(e){
    
    if ( !bricksIsFrontend ) {
        return;
    }

    xPopover()
})
