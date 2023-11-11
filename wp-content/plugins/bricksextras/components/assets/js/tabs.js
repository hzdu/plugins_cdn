/* mobile accordion */


function xTabsToggleAccordionItem(tabsToggle,config, customduration = true) { 
            
    let duration = customduration ? config.duration : 0;
            
    if ( true !== config.closeSibling && tabsToggle.closest('.x-tabs_content') ) {
        tabsToggle.closest('.x-tabs_content').querySelectorAll('.x-tabs_toggle[aria-expanded=true]').forEach((siblingAccordionHeader,index) => {
            let siblingAccordionContent = null != siblingAccordionHeader.nextElementSibling ? siblingAccordionHeader.nextElementSibling : siblingAccordionHeader.closest('.x-tabs_content-item').querySelector('.x-tabs_panel')
            if (siblingAccordionHeader != tabsToggle ) {
                siblingAccordionHeader.setAttribute('aria-expanded', 'false')
                siblingAccordionContent.xslideUp(duration)
            }
        })

    }

        let accordionContent = null != tabsToggle.nextElementSibling ? tabsToggle.nextElementSibling : tabsToggle.closest('.x-tabs_content-item') ? tabsToggle.closest('.x-tabs_content-item').querySelector('.x-tabs_panel') ? tabsToggle.closest('.x-tabs_content-item').querySelector('.x-tabs_panel') : false : false;
    
    
        if ( accordionContent ) {
            if ( 'true' !== tabsToggle.getAttribute('aria-expanded') ) {
                tabsToggle.setAttribute('aria-expanded', 'true')
                accordionContent.xslideDown(duration)
                
                window.dispatchEvent(new Event('resize'))
                if ( accordionContent.querySelector('.x-read-more_content') ) {
                    accordionContent.querySelector('.x-read-more_content').style.maxHeight = "";
                    setTimeout(() => {
                        if (typeof doExtrasReadmore == 'function') {
                            doExtrasReadmore(accordionContent)
                           // window.dispatchEvent(new Event('resize'))
                        }
                    }, 0)
                }
                tabsToggle.dispatchEvent(new Event('x_tabs_accordion:expand'))
            } else {

                if (!document.querySelector('body > .brx-body.iframe')) { /* simplify for inside builder */
                    tabsToggle.setAttribute('aria-expanded', 'false')
                    accordionContent.xslideUp(duration)
                    tabsToggle.dispatchEvent(new Event('x_tabs_accordion:collapse'))
                }
            }
        }
}

function xTabsSelectTab(tabLink, index = false, focus = true, animatedTab = false, tabUnselect = false, adaptiveHeight = false) {
    
    if (!tabLink) { return }

    let currentProTabs = tabLink.closest('.brxe-xtabs');

    if ( currentProTabs.classList.contains('.x-tabs-mobile') ) { return }

    /* move selected tab */
    currentProTabs.querySelector('.x-tabs_list').querySelectorAll('.x-tabs_tab-selected').forEach(prevSelected => {
        prevSelected.classList.remove('x-tabs_tab-selected');
        if (!tabUnselect) {
            prevSelected.setAttribute('tabindex', '-1');
        }
        prevSelected.setAttribute('aria-selected', 'false');
    })
    
    tabLink.classList.add('x-tabs_tab-selected');
    tabLink.setAttribute('tabindex', '0');
    tabLink.setAttribute('aria-selected', 'true');
    if (focus) {
        tabLink.focus();
    }

    if (animatedTab) {
        xTabsPositionToggleSlider(currentProTabs.querySelector('.x-tabs_list').querySelector('.x-tabs_slider'),tabLink)
    }

    if (!index) {
        index = [...tabLink.parentElement.children].indexOf(tabLink)
    }

    /* move current panel  */

    if ( currentProTabs.querySelector('.x-tabs_content') ) {

        currentProTabs.querySelector('.x-tabs_content').querySelectorAll('.x-tabs_panel:not(.brxe-xtabs .brxe-xtabs:not([data-x-id=' + currentProTabs.getAttribute('data-x-id') + ']) .x-tabs_panel )').forEach((tabPanel,i) => {

                tabPanel.classList.remove('x-tabs_panel-current');
                tabPanel.style.display = 'none'
                tabPanel.setAttribute('tabindex', '-1' )

                if (i === index) {

                    tabPanel.classList.add('x-tabs_panel-current');
                    tabPanel.style.display = 'flex'

                    
                    if (adaptiveHeight) {
                        tabPanel.closest('.x-tabs_content').style.height = tabPanel.offsetHeight + 'px';
                    }

                    xTabsMaybeFocusablePanel(tabPanel);

                    currentProTabs.dispatchEvent(new Event('x_tabs:switch'))

                    if ( tabPanel.querySelector('.x-read-more_content') ) {
                        tabPanel.querySelector('.x-read-more_content').style.maxHeight = "";
                        setTimeout(() => {
                            if (typeof doExtrasReadmore == 'function') {
                                doExtrasReadmore(tabPanel)
                                window.dispatchEvent(new Event('resize'))
                            }
                        }, 0)
                    }
                }

        })

        

    }

    window.dispatchEvent(new Event('resize'))


}

function xTabsAllClicks(e) {
    
    if ( !e.target.closest('.x-tabs_tab') && !e.target.closest('.x-tabs_toggle') ) {
        return;
    }

    if (!document.querySelector('body > .brx-body.iframe')) {
        e.stopPropagation()
    }

    let config 
    
    if ( e.target.closest('.brxe-xtabs') ) {
        config = JSON.parse(e.target.closest('.brxe-xtabs').getAttribute('data-x-tabs'))
    }

    if ( e.target.closest('.x-tabs_tab') ) {

        let clickedTab = e.target.closest('.x-tabs_tab');

        let index;

        if ( clickedTab.parentElement.classList.contains('x-tabs_list') ) {
            index = [...e.target.closest('.x-tabs_tab').parentElement.children].indexOf(e.target.closest('.x-tabs_tab'))
        }

        xTabsSelectTab(e.target.closest('.x-tabs_tab'),index, false, 'true' === config.animatedTabs, config.tabUnselect, config.adaptiveHeight);
    } 
    
    if ( e.target.closest('.x-tabs_toggle') ) {
        xTabsToggleAccordionItem(e.target.closest('.x-tabs_toggle'),config)
    }

}

function xTabsPositionToggleSlider(toggleSlider,activeLabel,animateSlider = true) {

    if (!animateSlider && !document.querySelector('body > .brx-body.iframe')) {
       toggleSlider.style.transition = 'none';
    }

    if ( toggleSlider && activeLabel ) {

        toggleSlider.style.left = activeLabel.offsetLeft + "px",
        toggleSlider.style.width = activeLabel.offsetWidth + 1 +"px",
        toggleSlider.style.height = activeLabel.offsetHeight + 1 + "px"
        toggleSlider.style.top = activeLabel.offsetTop + "px"

        if (!animateSlider && !document.querySelector('body > .brx-body.iframe')) {
          toggleSlider.style.removeProperty('transition');
        }

    }

    
}

function xTabsMaybeFocusablePanel(tabPanel) {

    const isFocusableElements = tabPanel.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled]), details:not([disabled]), summary:not(:disabled)').length;
      if (isFocusableElements) {
            tabPanel.setAttribute('tabindex', '-1' )
      } else {
        tabPanel.setAttribute('tabindex', '0' )
      }
}

function xTabs() {

     /* for the builder */
    let insideBuilder = false;
    if ( document.querySelector('body > .brx-body.iframe') ) {
       insideBuilder = true;
    }

    function createNewID(proTabs,index,suffix = false) {

        const idSuffix = suffix ? suffix + '-' : '';

        let newID;

        if (proTabs.id) {
            newID = proTabs.id + '-' + idSuffix + (index + 1) 
        } else if (proTabs.getAttribute('data-tabs-id')) {
            newID = proTabs.getAttribute('data-tabs-id') + '-' + idSuffix + (index + 1) 
        } else {
            newID = proTabs.getAttribute('data-x-id') + '-' + idSuffix + (index + 1) 
        }

        return newID

    }


    const debounce = (fn, threshold) => {
        var timeout;
        threshold = threshold || 50;
        return function debounced() {
           clearTimeout(timeout);
           var args = arguments;
           var _this = this;
  
           function delayed() {
              fn.apply(_this, args);
           }
           timeout = setTimeout(delayed, threshold);
        };
     };

     function tabsAccordionResize(proTabs,config) {

        if ( 'none' === config.accordionBreakpoint ) {
            proTabs.classList.remove('x-tabs-mobile')
            proTabs.querySelector('.x-tabs_content').classList.remove('x-tabs_content-accordion')
            proTabs.querySelector('.x-tabs_list').classList.remove('x-tabs_list-accordion')
        }

        /* mobile accordion */
        else if ( 'none' !== config.accordionBreakpoint && parseInt(window.innerWidth) <= parseInt(config.accordionBreakpoint) ) {

            if ( !proTabs.classList.contains('x-tabs-mobile') ) {
                closeAllAccordions(proTabs)
                proTabs.dispatchEvent(new Event('x_tabs:accordion'))
            }

            proTabs.classList.add('x-tabs-mobile')

            if (proTabs.querySelector('.x-tabs_content')) {
                proTabs.querySelector('.x-tabs_content').style.removeProperty('height');
                proTabs.querySelector('.x-tabs_content').classList.add('x-tabs_content-accordion')
            } 

            if (proTabs.querySelector('.x-tabs_list')) {
                proTabs.querySelector('.x-tabs_list').classList.add('x-tabs_list-accordion')
            }
            
        } 
        
        /* desktop tabs */
        else {

            if ( proTabs.classList.contains('x-tabs-mobile') ) {

                proTabs.classList.remove('x-tabs-mobile')
                
                if ( proTabs.querySelector('.x-tabs_content') ) {
                    proTabs.querySelector('.x-tabs_content').classList.remove('x-tabs_content-accordion')
                }
                if (proTabs.querySelector('.x-tabs_list')) {
                    proTabs.querySelector('.x-tabs_list').classList.remove('x-tabs_list-accordion')
                }
                
                resetAllTabs(proTabs);
                proTabs.dispatchEvent(new Event('x_tabs:tabs'))
            }
        }
  
      }


    function closeAllAccordions(proTabs) {  

        const configAttr = proTabs.getAttribute('data-x-tabs')
        const config = configAttr ? JSON.parse(configAttr) : {}
        
        let accordionToggles = proTabs.querySelectorAll('.x-tabs_toggle')

        accordionToggles.forEach(accordionToggle => {
            accordionToggle.setAttribute('aria-expanded', 'false')
        })

        let currentPanel = proTabs.querySelector('.x-tabs_panel-current')

        if (currentPanel) {
            currentPanel.style.display = 'none'
        }

        if (config.expandFirstItem) {

            proTabs.querySelectorAll('.x-tabs_toggle').forEach((toggle,index) => {
                if (0 === index) {
                    toggle.setAttribute('aria-expanded', 'true')
                    return
                }
            })


            if ( proTabs.querySelector('.x-tabs_content' ) ) {
        
                Array.from(proTabs.querySelector('.x-tabs_content').children).forEach((tabContentItem,index) => {
    
                    const tabPanel = tabContentItem.querySelector('.x-tabs_panel');
    
                    if (tabPanel) {
                        if (0 === index) {
                            
                                tabPanel.classList.add('x-tabs_panel-current')
                                tabPanel.style.removeProperty('display');
                            }

                        }

                    })

                }
            
        }

    }

    function resetAllTabs(proTabs) {

        proTabs.querySelectorAll('.x-tabs_panel').forEach(tabsPanel => {
            tabsPanel.style.removeProperty('display');
        })
        xTabsSelectTab(proTabs.querySelector('.x-tabs_tab-selected'),0, false, false);

    }


  

    const extrasTabs = function ( container ) {
    

    container.querySelectorAll('.brxe-xtabs').forEach(proTabs => {

        const configAttr = proTabs.getAttribute('data-x-tabs')
        const config = configAttr ? JSON.parse(configAttr) : {}

        const animatedTab = 'true' === config.animatedTabs;

        tabsAccordionResize(proTabs,config)

        window.addEventListener('resize', debounce(() => {
            tabsAccordionResize(proTabs,config)
        }, 0))

        if ( proTabs.querySelector('.x-tabs_list') ) {

            proTabs.querySelector('.x-tabs_list').querySelectorAll('.x-tabs_tab').forEach((tabLink,index) => {
                if (!tabLink.id) { tabLink.id = createNewID(proTabs,index,'tab') }
            })

        }

        /* on page load */
        if(location.hash != null && location.hash != ""){

            setTimeout(() => {

                if ( proTabs.querySelector(location.hash) ) {

                    if ( !proTabs.querySelector(location.hash).classList.contains('x-tabs_panel' ) ) {
                        return
                    }

                    let allTabItems = Array.from(document.querySelector(location.hash).closest('.x-tabs_content').children)
                    let tabItem = document.querySelector(location.hash).closest('.x-tabs_content-item')
                    let tabIndex = Array.prototype.indexOf.call(allTabItems,tabItem);

                    if ( !proTabs.classList.contains('x-tabs-mobile') ){ 
                        xTabsSelectTab(proTabs.querySelector('.x-tabs_list').querySelectorAll('.x-tabs_tab')[tabIndex],tabIndex, false, animatedTab,config.tabUnselect,config.adaptiveHeight);
                    } else {
                        xTabsToggleAccordionItem(proTabs.querySelectorAll('.x-tabs_content-item')[tabIndex].querySelector('.x-tabs_toggle'),config, false)
                    }

                    if ( config.hashLink ) {
                    
                        window.scrollTo({
                            top: document.querySelector(location.hash).offsetTop - config.scrollOffset,
                            left: 0,
                            behavior: 'smooth'
                        });

                    }
                    
                }
            }, 50)      
            
        } else {
            if ( proTabs.querySelector('.x-tabs_list') ) {
                xTabsSelectTab(proTabs.querySelector('.x-tabs_list').querySelectorAll('.x-tabs_tab')[0],0, false, animatedTab,config.tabUnselect,config.adaptiveHeight);
            }
        }

        if ( proTabs.querySelector('.x-tabs_content' ) ) {
        
            Array.from(proTabs.querySelector('.x-tabs_content').children).forEach((tabContentItem,index) => {

                const tabPanel = tabContentItem.querySelector('.x-tabs_panel');

                if (tabPanel) {

                    if (tabPanel.closest('.x-tabs_content') !== proTabs.querySelector('.x-tabs_content')) { return }
                    
                    if (!tabPanel.id) { tabPanel.id = createNewID(proTabs,index,false) }
                    
                    if ( proTabs.querySelectorAll('.x-tabs_tab')[index] ) {
                        tabPanel.setAttribute('aria-labelledby', proTabs.querySelectorAll('.x-tabs_tab')[index].id );
                    }

                    if (0 === index) {
                        if ( !proTabs.classList.contains('x-tabs-mobile') || config.expandFirstItem ) {
                            tabPanel.classList.add('x-tabs_panel-current')
                            xTabsMaybeFocusablePanel(tabPanel)
                        }
                    } else {
                        tabPanel.setAttribute('tabindex', '-1')
                    }

                    if ( config.hashLink && !document.querySelector('body > .brx-body.iframe') ) {
                        document.querySelectorAll('a[href="#' + tabPanel.id + '"]').forEach(hashlink => {

                            hashlink.addEventListener('click', (e) => {

                                e.preventDefault();

                                let allTabItems = Array.from(document.querySelector('#' + tabPanel.id).closest('.x-tabs_content').children)
                                let tabItem = document.querySelector('#' + tabPanel.id).closest('.x-tabs_content-item')
                                let tabIndex = Array.prototype.indexOf.call(allTabItems,tabItem);

                                if ( !proTabs.classList.contains('x-tabs-mobile') ){ 
                                    xTabsSelectTab(proTabs.querySelectorAll('.x-tabs_tab')[tabIndex],tabIndex, false,config.animatedTabs,config.tabUnselect,config.adaptiveHeight);
                                } else {
                                    xTabsToggleAccordionItem(proTabs.querySelectorAll('.x-tabs_content-item')[tabIndex].querySelector('.x-tabs_toggle'),config, false)
                                }



                                window.scrollTo({
                                    top: document.querySelector('#' + tabPanel.id).offsetTop - config.scrollOffset,
                                    left: 0,
                                    behavior: 'smooth'
                                });

                                history.replaceState(undefined, undefined, '#' + tabPanel.id)

                            })
                        })
                    }

                }

            })

        }

        if ( animatedTab ) {

            if (!proTabs.querySelector('.x-tabs_slider')) {
                let tabAnimated = document.createElement("div");
                tabAnimated.classList.add('x-tabs_slider');
                if (proTabs.querySelector('.x-tabs_list')) {
                    proTabs.querySelector('.x-tabs_list').append(tabAnimated);
                }

                if ( proTabs.querySelector('.x-tabs_tab') ) {
                    xTabsPositionToggleSlider(tabAnimated,proTabs.querySelector('.x-tabs_tab'))
                }

                if (typeof(ResizeObserver) === 'function') {
                        const resizeObserver = new ResizeObserver((entries) => {
                            for (const entry of entries) {
                                xTabsPositionToggleSlider(tabAnimated,proTabs.querySelector('.x-tabs_tab-selected'), false)
                        }
                    });
                    
                    if ( proTabs.querySelector('.x-tabs_list') ) {
                     resizeObserver.observe(proTabs.querySelector('.x-tabs_list'), { box: 'border-box' });
                    }
    
                }
            }
            

        }

        let currentTab = ''; 
            

            proTabs.removeEventListener('click', xTabsAllClicks, true)
            proTabs.addEventListener('click', xTabsAllClicks, true)

            const tabsList = proTabs.querySelector('.x-tabs_list');

            const tabLinks = tabsList ? tabsList.querySelectorAll('.x-tabs_tab') : [];

            tabLinks.forEach((tabLink,index) => {
                if ( proTabs.querySelectorAll('.x-tabs_panel')[index] ) {
                    setTimeout(() => {
                        tabLink.setAttribute('aria-controls', Array.from(proTabs.querySelector('.x-tabs_content').children)[index].querySelector('.x-tabs_panel').id );
                    }, 0)       
                }

                if (tabLink.matches(".x-tabs_tab:first-child") ) {
                    tabLink.classList.add('x-tabs_tab-selected');
                    tabLink.setAttribute('tabindex', '0');
                    tabLink.setAttribute('aria-selected', 'true');
                } else {
                    if (config.tabUnselect) {
                        tabLink.setAttribute('tabindex', '0');
                    }
                }

                if (config.hoverSelect && !insideBuilder) {
                    tabLink.addEventListener("mouseover", (e) => {
                        xTabsSelectTab(tabLink,false, true, animatedTab,config.tabUnselect,config.adaptiveHeight);
                    })
                }

                tabLink.addEventListener("keydown", (e) => {
                    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                        if ( tabLink.previousElementSibling ) {
                            xTabsSelectTab(tabLink.previousElementSibling,(index - 1), true, animatedTab,config.tabUnselect,config.adaptiveHeight);
                        } else {
                            xTabsSelectTab(tabLinks[tabLinks.length - 1],(tabLinks.length - 1), true, animatedTab,config.tabUnselect,config.adaptiveHeight);
                        }
                        
                    } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                        if ( tabLink.nextElementSibling && tabLink.nextElementSibling.classList.contains('x-tabs_tab') ) {
                            xTabsSelectTab(tabLink.nextElementSibling,(index + 1), true, animatedTab,config.tabUnselect,config.adaptiveHeight);
                        } else {
                            xTabsSelectTab(tabLink.closest('.x-tabs_list').querySelector('.x-tabs_tab'), 0, true, animatedTab,config.tabUnselect,config.adaptiveHeight);
                        }
                    } else if (e.code === "Enter" || e.code === "Space") {
                        if (config.tabUnselect) {
                            xTabsSelectTab(tabLink,index, true, animatedTab,config.tabUnselect,config.adaptiveHeight);
                        }
                    }
                });

            })



        

        if ( proTabs.querySelector('.x-tabs_content' ) ) {

            Array.from(proTabs.querySelector('.x-tabs_content').children).forEach((tabContentItem,index) => {

                const tabsToggle = tabContentItem.querySelector('.x-tabs_toggle');

                if (!tabsToggle || !tabsToggle.closest('.x-tabs_content'))  { return }
            
                let accordionContent = null != tabsToggle.nextElementSibling ? tabsToggle.nextElementSibling : tabsToggle.closest('.x-tabs_content-item') ? tabsToggle.closest('.x-tabs_content-item').querySelector('.x-tabs_panel') ? tabsToggle.closest('.x-tabs_content-item').querySelector('.x-tabs_panel') : false : false;
        
                    if (!tabsToggle.id) { tabsToggle.id = createNewID(proTabs,index,'toggle') }
        
                    if (accordionContent) {
        
                        if ( 0 === index && config.expandFirstItem) {
                            tabsToggle.setAttribute('aria-expanded', 'true')
                            if (proTabs.classList.contains('x-tabs-mobile') ) {
                                accordionContent.xslideDown(0)
                                
                            }
                        } else {
                            tabsToggle.setAttribute('aria-expanded', 'false')
                        }
        
                    
                        tabsToggle.setAttribute('aria-controls', accordionContent.id)
        
                    }
                    
                        tabsToggle.addEventListener('keypress', function(e) {

                            if (tabsToggle.tagName != 'BUTTON') {
                                if (e.code === "Enter" || e.code === "Space") {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    xTabsToggleAccordionItem(tabsToggle,config)
                                } 
                            }

                    })
        
        
            })

        }



    })


    }
    

    extrasTabs(document);

    function xTabsAjax(e) {

        if (typeof e.detail.queryId === 'undefined') {
            return;
        }

        if ( document.querySelector('.brxe-' + e.detail.queryId) ) {
            extrasTabs(document.querySelector('.brxe-' + e.detail.queryId).parentElement);
        }
      }
      
      document.addEventListener("bricks/ajax/load_page/completed", xTabsAjax)
      document.addEventListener("bricks/ajax/pagination/completed", xTabsAjax)

    // Expose function
    window.doExtrasTabs = extrasTabs;
    

}


document.addEventListener("DOMContentLoaded",() => {
    bricksIsFrontend&&xTabs()
});