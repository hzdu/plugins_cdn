document.addEventListener( 'jet-smart-filters/inited', function( initEvent ) {
        
    window.JetSmartFilters.events.subscribe( 'ajaxFilters/updated', function( provider, queryId ) {
            
            let filterGroup = window.JetSmartFilters.filterGroups[ provider + '/' + queryId ],
                $provider   = filterGroup.$provider,
                container = $provider[0].parentElement;
            
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

                 /* tabs */
                if (typeof doExtrasTabs == 'function') {
                    doExtrasTabs(container)
                }

                /* lottie */
                if (typeof doExtrasLottie == 'function') {
                    doExtrasLottie(container)
                }

                /* media player */
                if (typeof doExtrasMediaPlayer == 'function') {
                    doExtrasMediaPlayer(container)
                }

                /* copy to clipboard */
                if (typeof doExtrasCopyToClipBoard == 'function') {
                    doExtrasCopyToClipBoard(container)
                }
                if (typeof doExtrasCopyToClipBoardPopover == 'function') {
                    doExtrasCopyToClipBoardPopover(container)
                }
            
        } );

} );