function xProAccordion() {

    if ( document.querySelector('body > .brx-body.iframe') ) {
        return
    }

    const extrasAccordion = function ( container ) {

        bricksQuerySelectorAll(container, ".x-accordion").forEach((proAccordion) => {

            const config = xProAccordionConfig(proAccordion);
            const identifier = proAccordion.getAttribute('data-x-id')

            if ( config.hashLink ) {
                if(location.hash != null && location.hash != ""){

                    setTimeout(() => {
                        if ( proAccordion.querySelector(location.hash) ) {
                            
                            window.scrollTo({
                                top: proAccordion.querySelector(location.hash).offsetTop - config.scrollOffset,
                                left: 0,
                                behavior: 'smooth'
                            });
                            
                            
                                xOpenAccordionItem(document.querySelector(location.hash),xProAccordionConfig(proAccordion)) 
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

            if ( config.faqSchema ) {

                bricksQuerySelectorAll(container, '.x-accordion > .brxe-block').forEach((question) => {
                    question.setAttribute('itemscope','')
                    question.setAttribute('itemprop','mainEntity')
                    question.setAttribute('itemtype','https://schema.org/Question')
                })

                bricksQuerySelectorAll(container, '.x-accordion_header > span').forEach((name) => {
                    name.setAttribute('itemprop','name')
                })

                bricksQuerySelectorAll(container, '.x-accordion_content').forEach((answer) => {
                    answer.setAttribute('itemscope','')
                    answer.setAttribute('itemprop','acceptedAnswer')
                    answer.setAttribute('itemtype','https://schema.org/Answer')
                })

                bricksQuerySelectorAll(container, '.x-accordion_content-inner').forEach((text) => {
                    text.setAttribute('itemprop','text')
                })
                

                bricksQuerySelectorAll(document, 'html').forEach((html) => {
                    html.setAttribute('itemscope','')
                    html.setAttribute('itemtype','https://schema.org/FAQPage')
                })

            }
        
            bricksQuerySelectorAll(proAccordion, ".x-accordion_header").forEach((proAccordionHeader,index) => {

                let proAccordionContent = proAccordionHeader.nextSibling
                
                if (!proAccordionHeader.id) {
                    proAccordionHeader.id = 'x-accordion_header_' + identifier + '_' + index
                }

                if (proAccordionContent) {

                    if (!proAccordionContent.id) {
                        proAccordionContent.id = 'x-accordion_content_' + identifier + '_' + index
                    }

                    if ( ( config.expandFirst && ( 0 === index ) || config.expandAll ) ) {
                        proAccordionHeader.setAttribute('aria-expanded', 'true')
                        proAccordionHeader.nextSibling.xslideDown(0)
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

            })
            

        })

       

    }

    extrasAccordion(document);

    // Expose function
    window.doExtrasAccordion = extrasAccordion;

}

function xOpenAccordionItem(proAccordionHeader, config) {
    
    proAccordionHeader.setAttribute('aria-expanded', 'true')
    proAccordionHeader.nextSibling.xslideDown(config.duration)

    if (!config.closeSibling) {
        proAccordionHeader.closest('.x-accordion').querySelectorAll('.x-accordion_header[aria-expanded=true]').forEach((siblingAccordionHeader,index) => {
            if (siblingAccordionHeader != proAccordionHeader ) {
                siblingAccordionHeader.setAttribute('aria-expanded', 'false')
                siblingAccordionHeader.nextSibling.xslideUp(config.duration)
            }
        })
    }
}

function xToggleAccordionItem(proAccordionHeader, config) {

    if (!config.closeSibling) {

        proAccordionHeader.closest('.x-accordion').querySelectorAll('.x-accordion_header[aria-expanded=true]').forEach((siblingAccordionHeader,index) => {
            if (siblingAccordionHeader != proAccordionHeader ) {
                siblingAccordionHeader.setAttribute('aria-expanded', 'false')
                siblingAccordionHeader.nextSibling.xslideUp(config.duration)
            }
        })

    }

    if ( 'true' !== proAccordionHeader.getAttribute('aria-expanded') ) {
        proAccordionHeader.setAttribute('aria-expanded', 'true')
        proAccordionHeader.nextSibling.xslideDown(config.duration)
        window.dispatchEvent(new Event('resize'))
        if ( proAccordionHeader.nextSibling.querySelector('.x-read-more_content') ) {
         proAccordionHeader.nextSibling.querySelector('.x-read-more_content').style.maxHeight = "";
           setTimeout(() => {
                    doExtrasReadmore(proAccordionHeader.nextSibling)
                    window.dispatchEvent(new Event('resize'))
            }, 0)
        }
        proAccordionHeader.dispatchEvent(new Event('x_accordion_item:expand'))
    } else {
        proAccordionHeader.setAttribute('aria-expanded', 'false')
        proAccordionHeader.nextSibling.xslideUp(config.duration)
        proAccordionHeader.dispatchEvent(new Event('x_accordion_item:collapse'))
    }

}

function xProAccordionConfig(element) {
    const configAttr = element.getAttribute('data-x-accordion')
    return configAttr ? JSON.parse(configAttr) : {}
}

document.addEventListener("DOMContentLoaded",function(e){
    bricksIsFrontend&&xProAccordion()
});