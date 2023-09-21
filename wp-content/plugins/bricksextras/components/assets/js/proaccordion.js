function xProAccordion() {

    if ( document.querySelector('body > .brx-body.iframe') ) {
        return
    }

    const extrasAccordion = function ( container ) {

        bricksQuerySelectorAll(container, ".x-accordion").forEach((proAccordion) => {

            const config = xProAccordionConfig(proAccordion);
            const identifier = proAccordion.getAttribute('data-x-id')

            bricksQuerySelectorAll(proAccordion, ".x-accordion_item").forEach((proAccordionItem,index) => {

                if (!proAccordionItem.id) {
                    if ( proAccordion.id ) {
                        proAccordionItem.id = proAccordion.id + '-' + (index + 1);
                    }
                    
                }

            })

            if ( config.hashLink ) {
                if(location.hash != null && location.hash != ""){

                    setTimeout(() => {
                        if ( proAccordion.querySelector(location.hash) ) {
                            
                            window.scrollTo({
                                top: proAccordion.querySelector(location.hash).offsetTop - config.scrollOffset,
                                left: 0,
                                behavior: 'smooth'
                            });
                            
                            if ( proAccordion.querySelector(location.hash).classList.contains('x-accordion_item') ) {
                                if ( document.querySelector(location.hash).querySelector('.x-accordion_header') ) {
                                    xOpenAccordionItem(document.querySelector(location.hash).querySelector('.x-accordion_header'),xProAccordionConfig(proAccordion)) 
                                }
                            } else {
                                xOpenAccordionItem(document.querySelector(location.hash),xProAccordionConfig(proAccordion)) 
                            }
                            
                        }
                    }, 50)      
                }

                bricksQuerySelectorAll(container, [".x-accordion_link",".x-accordion_link > a"]).forEach((proAccordionLink) => {

                    const hashLink = proAccordionLink.getAttribute('href');

                    if (null != hashLink) {

                        proAccordionLink.addEventListener('click', function(e) {

                            if ( document.querySelector(hashLink) ) {
                                e.preventDefault()

                                window.scrollTo({
                                    top: proAccordion.querySelector(hashLink).offsetTop - config.scrollOffset,
                                    left: 0,
                                    behavior: 'smooth'
                                });
                                
                                setTimeout(() => {
                                    xOpenAccordionItem(document.querySelector(hashLink),xProAccordionConfig(proAccordion)) 
                                }, 50)  
                            }
                        })

                    }

                })
                
            }

            
        
            bricksQuerySelectorAll(proAccordion, ".x-accordion_header").forEach((proAccordionHeader,index) => {

                let proAccordionContent = null != proAccordionHeader.nextSibling ? proAccordionHeader.nextSibling : proAccordionHeader.closest('.x-accordion_item') ? proAccordionHeader.closest('.x-accordion_item').querySelector('.x-accordion_content') ? proAccordionHeader.closest('.x-accordion_item').querySelector('.x-accordion_content') : false : false;

                
                if (!proAccordionHeader.id) {
                    proAccordionHeader.id = 'x-accordion_header_' + identifier + '_' + index
                }

                if (proAccordionContent) {

                    if (!proAccordionContent.id) {
                        proAccordionContent.id = 'x-accordion_content_' + identifier + '_' + index
                    }

                    if ( ( config.expandFirst && ( 0 === index ) || config.expandAll ) ) {
                        proAccordionHeader.setAttribute('aria-expanded', 'true')
                        proAccordionContent.xslideDown(0)
                        if (proAccordionHeader.closest('.x-accordion_item')) {
                            proAccordionHeader.closest('.x-accordion_item').classList.add('x-accordion_item-active')
                        }
                    } else {
                        proAccordionHeader.setAttribute('aria-expanded', 'false')
                    }

                    /* arias */
                    proAccordionHeader.setAttribute('aria-controls', proAccordionContent.id)
                    proAccordionContent.setAttribute('aria-labelledby', proAccordionHeader.id)
                    proAccordionContent.setAttribute('role', 'region')

                }


                proAccordionHeader.addEventListener('click', function() {
                    xToggleAccordionItem(proAccordionHeader,xProAccordionConfig(proAccordion))
                })

                if (proAccordionHeader.tagName != 'BUTTON') {
                    proAccordionHeader.addEventListener('keypress', function(e) {
                        if (e.code === "Enter" || e.code === "Space") {
                            e.preventDefault()
                            xToggleAccordionItem(proAccordionHeader,xProAccordionConfig(proAccordion))
                        } 
                    })
                }

            })
            

        })

       

    }

    extrasAccordion(document);

    // Expose function
    window.doExtrasAccordion = extrasAccordion;

}

function xOpenAccordionItem(proAccordionHeader, config) {
    
    proAccordionHeader.setAttribute('aria-expanded', 'true')

    let proAccordionContent = null != proAccordionHeader.nextSibling ? proAccordionHeader.nextSibling : proAccordionHeader.closest('.x-accordion_item') ? proAccordionHeader.closest('.x-accordion_item').querySelector('.x-accordion_content') ? proAccordionHeader.closest('.x-accordion_item').querySelector('.x-accordion_content') : false : false;
    
    if ( proAccordionContent ) {
         proAccordionContent.xslideDown(config.duration)
    }

    if (proAccordionHeader.closest('.x-accordion_item')) {
        proAccordionHeader.closest('.x-accordion_item').classList.add('x-accordion_item-active')
    }

    if (!config.closeSibling) {
        proAccordionHeader.closest('.x-accordion').querySelectorAll('.x-accordion_header[aria-expanded=true]').forEach((siblingAccordionHeader,index) => {
            let siblingAccordionContent = null != siblingAccordionHeader.nextSibling ? siblingAccordionHeader.nextSibling : siblingAccordionHeader.closest('.x-accordion_item').querySelector('.x-accordion_content')
            if (siblingAccordionHeader != proAccordionHeader ) {
                siblingAccordionHeader.setAttribute('aria-expanded', 'false')
                siblingAccordionContent.xslideUp(config.duration)
                if (siblingAccordionHeader.closest('.x-accordion_item')) {
                    siblingAccordionHeader.closest('.x-accordion_item').classList.remove('x-accordion_item-active')
                }
            }
        })
    }
}

function xToggleAccordionItem(proAccordionHeader, config) {

    if (!config.closeSibling) {

        proAccordionHeader.closest('.x-accordion').querySelectorAll('.x-accordion_header[aria-expanded=true]').forEach((siblingAccordionHeader,index) => {
            let siblingAccordionContent = null != siblingAccordionHeader.nextSibling ? siblingAccordionHeader.nextSibling : siblingAccordionHeader.closest('.x-accordion_item').querySelector('.x-accordion_content')
            if (siblingAccordionHeader != proAccordionHeader ) {
                siblingAccordionHeader.setAttribute('aria-expanded', 'false')
                siblingAccordionContent.xslideUp(config.duration)
                if (siblingAccordionHeader.closest('.x-accordion_item')) {
                    siblingAccordionHeader.closest('.x-accordion_item').classList.remove('x-accordion_item-active')
                }
            }
        })

    }

    let proAccordionContent = null != proAccordionHeader.nextSibling ? proAccordionHeader.nextSibling : proAccordionHeader.closest('.x-accordion_item') ? proAccordionHeader.closest('.x-accordion_item').querySelector('.x-accordion_content') ? proAccordionHeader.closest('.x-accordion_item').querySelector('.x-accordion_content') : false : false;


    if ( proAccordionContent ) {
        if ( 'true' !== proAccordionHeader.getAttribute('aria-expanded') ) {
            proAccordionHeader.setAttribute('aria-expanded', 'true')
            proAccordionContent.xslideDown(config.duration)
            window.dispatchEvent(new Event('resize'))
            if ( proAccordionContent.querySelector('.x-read-more_content') ) {
                proAccordionContent.querySelector('.x-read-more_content').style.maxHeight = "";
            setTimeout(() => {
                        doExtrasReadmore(proAccordionContent)
                        window.dispatchEvent(new Event('resize'))
                }, 0)
            }
            if (proAccordionHeader.closest('.x-accordion_item')) {
                proAccordionHeader.closest('.x-accordion_item').classList.add('x-accordion_item-active')
            }
            proAccordionHeader.dispatchEvent(new Event('x_accordion_item:expand'))
        } else {
            proAccordionHeader.setAttribute('aria-expanded', 'false')
            proAccordionContent.xslideUp(config.duration)
            if (proAccordionHeader.closest('.x-accordion_item')) {
                proAccordionHeader.closest('.x-accordion_item').classList.remove('x-accordion_item-active')
            }
            proAccordionHeader.dispatchEvent(new Event('x_accordion_item:collapse'))
        }
    }

}

function xProAccordionConfig(element) {
    const configAttr = element.getAttribute('data-x-accordion')
    return configAttr ? JSON.parse(configAttr) : {}
}

document.addEventListener("DOMContentLoaded",function(e){
    bricksIsFrontend&&xProAccordion()
});