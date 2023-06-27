document.addEventListener("DOMContentLoaded", (e) => {
   
    if (typeof wp !== "undefined") {

        wp.hooks.addAction('piotnetgrid-facet-loaded', 'piotnetgrid', function(facets){

            /* get Bricks loop ID */
            const loopID = facets[0].getAttribute('data-piotnetgrid-facet-grid').substring(7)

            /* get container of query loop */
            const queryLoopEl = document.querySelector('[data-piotnetgrid-bricks-loop-id="' + loopID + '"]')

            if ( queryLoopEl ) {

                const container = queryLoopEl.parentElement
            
                if ( container ) {

                    /* Pro Accordion */
                    if ( typeof doExtrasAccordion == 'function') {
                        doExtrasAccordion(container)
                    }

                    /* Pro Slider */
                    if ( typeof doExtrasSlider == 'function') {
                        doExtrasSlider(container)
                    }

                    /* Read More / Less */
                    if ( typeof doExtrasReadmore == 'function') {
                        setTimeout(() => {
                            doExtrasReadmore(container)
                            }, 100);
                    }

                    /* Dynamic Lightbox */
                    if ( typeof doExtrasLightbox == 'function') {
                        doExtrasLightbox(container, true)
                    }

                    /* Social share */
                    if ( typeof doExtrasSocialShare == 'function') {
                        doExtrasSocialShare(container)
                    }

                    /* OffCanvas */
                    if ( typeof doExtrasOffCanvas == 'function') {
                        doExtrasOffCanvas(container)
                    }

                    /* modal */
                    if ( typeof doExtrasModal == 'function') {
                        doExtrasModal(container)
                    }

                    /* popover */
                    if ( typeof doExtrasPopover == 'function') {
                        doExtrasPopover(container)
                    }
                
                }

            }

        });

    }

});