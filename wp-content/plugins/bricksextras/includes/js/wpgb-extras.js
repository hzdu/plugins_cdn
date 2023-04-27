window.WP_Grid_Builder && WP_Grid_Builder.on('init', function(wpgb) {

    wpgb.facets.on('appended', function(content) {

        content.forEach((container) => {

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
          
            /* popover */
            if (typeof doExtrasPopover == 'function') {
                doExtrasPopover(container)
            }

        })

    })

})