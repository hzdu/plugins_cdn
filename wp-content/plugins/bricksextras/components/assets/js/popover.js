
 function xPopover(){

    const extrasPopover = function ( container ) {

        bricksQuerySelectorAll(container, '.brxe-xpopover').forEach( popover => {

            const configAttr = popover.getAttribute('data-x-popover')
            const config = configAttr ? JSON.parse(configAttr) : {}

            let insideLoop = false;

            if ( null != config.isLooping ) {
                insideLoop = true
            }

            let elementSelector = insideLoop ? popover.closest('.brxe-' + config.isLooping).querySelector(config.elementSelector) : config.elementSelector;

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

                    const innerContent = config.multipleTriggers ? popover.querySelector('.x-popover_content-inner').innerHTML : popover.querySelector('.x-popover_content-inner');
                    const content = config.dynamicContent ? '' : innerContent;
                    const finalElementSelector = config.dynamicContent ? elementSelector + '[data-tippy-content]' : elementSelector;

                    tippyEl = config.elementSelector ? finalElementSelector : popover.querySelector('.x-popover_button')
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
                        interactiveDebounce: 50,
                        followCursor: 'false' === config.followCursor ? false : config.followCursor,
                        delay: config.delay,
                        moveTransition: 'transform ' + config.moveTransition + 'ms ease-out', 
                        offset: [ config.offsetSkidding , config.offsetDistance], 
                        onShow(instance) {
                            tippy.hideAll({exclude: instance})
                            setTimeout(() => {
                                if( typeof bricksLazyLoad === "function" ){
                                    bricksLazyLoad()
                                }
                            }, 50)
                            popover.addEventListener('keydown', function(e) {
                                if((e.key === "Escape" || e.key === "Esc")){
                                    instance.hide();
                                }
                            });
                        },
                        onShown() {
                            popover.dispatchEvent(new Event('x_popover:show'))
                            
                        },
                        onHide() {
                            popover.dispatchEvent(new Event('x_popover:hide'))
                        }
                    };
                }  

                let xTippyInstance = tippy(tippyEl,tippyProps);
                window.xTippy.Instances[popover.dataset.xId] = xTippyInstance;

                if ( config.multipleTriggers && !document.querySelector('body > .brx-body.iframe') ) {
                    const singleton = tippy.createSingleton(xTippyInstance, tippyProps);
                }
                

                popover.addEventListener('x_popover:show', () => {

                    let container = popover.querySelector('.x-popover_content')

                    if ( container ) {

                        /* Pro Accordion */
                        if (typeof doExtrasAccordion == 'function') {
                            doExtrasAccordion(container)
                        }

                        /* Pro Slider */
                        if (typeof doExtrasSlider == 'function') {
                            doExtrasSlider(container)
                        }

                        /* Read More / Less */
                        if (typeof doExtrasReadmore == 'function') {
                            setTimeout(() => {
                                doExtrasReadmore(container)
                            }, 100);
                            
                        }

                        /* Dynamic Lightbox */
                        if (typeof doExtrasLightbox == 'function') {
                            doExtrasLightbox(container, true)
                        }
                    
                        /* Social share */
                        if (typeof doExtrasSocialShare == 'function') {
                            doExtrasSocialShare(container)
                        }
                    
                        /* OffCanvas */
                        if (typeof doExtrasOffCanvas == 'function') {
                            doExtrasOffCanvas(container)
                        }
                    
                        /* modal */
                        if (typeof doExtrasModal == 'function') {
                            doExtrasModal(container)
                        }

                    }

                })

        })

    }

    extrasPopover(document);

    function xPopoverAjax(e) {

        if (typeof e.detail.queryId === 'undefined') {
            return;
        }

        if ( document.querySelector('.brxe-' + e.detail.queryId) ) {
            extrasPopover(document.querySelector('.brxe-' + e.detail.queryId).parentElement);
        }
   }
   
   document.addEventListener("bricks/ajax/load_page/completed", xPopoverAjax)
   document.addEventListener("bricks/ajax/pagination/completed", xPopoverAjax)

    // Expose function
    window.doExtrasPopover = extrasPopover;

}

document.addEventListener("DOMContentLoaded",function(e){
    bricksIsFrontend&&xPopover()
})
