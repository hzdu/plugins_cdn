document.addEventListener("DOMContentLoaded", function() {
    tabtoursInit(document);
});

function tabtoursInit(doc){
    let tabsWrappers = doc.querySelectorAll('.tpgb-tabs-wrapper');
    if(tabsWrappers){
        tabsWrappers.forEach(function(currentTab) {
            var tabHover = currentTab.dataset.tabHover;
            var tabHeaders = currentTab.querySelectorAll('.tpgb-tab-header');
            if(tabHeaders){
                tabHeaders.forEach(function(tabHeader) {
                    if(tabHover === 'no') {
                        tabHeader.addEventListener('click', function() {
                            tabstoursclickhover(this)
                        });
                    }
                    if(tabHover === 'yes') {
                        tabHeader.addEventListener('mouseover', function() {
                            tabstoursclickhover(this)
                        });
                    }
                });
            }
            
            /* Unique Id/hash */
            var hash = window.location.hash;
            if(hash){
                let hashWrap = document.querySelector(hash);
                if(hashWrap && !hashWrap.classList.contains("active")){
                    var tab_index = hashWrap.dataset.tab;
                    let getDataWrap = document.querySelector(".tab-mobile-title[data-tab='" + tab_index + "']")
                    if(getDataWrap){
                        window.scrollTo({
                            top: getDataWrap.offsetTop,
                            behavior: 'smooth'
                        });
                        document.querySelector(hash + ".tpgb-tab-header").click();
                        getDataWrap.click();
                    }
                }
            }

            /* Swiper Tabbing */
            var swiperTabs = currentTab.classList.contains('swiper-container');
            if(swiperTabs){
                new Swiper(currentTab, {
                    slidesPerView: "auto",
                    mousewheelControl: true,
                    freeMode: true
                });   
            }

            /* Responsive Mobile Accordion */
            if(currentTab.classList.contains("mobile-accordion")) {
                window.addEventListener('resize', function() {
                    if(window.innerWidth <= 600) {
                        currentTab.classList.add("mobile-accordion-tab");
                    }
                });
        
                var mobileAccordionTabs = currentTab.querySelectorAll('.tpgb-tabs-content-wrapper .tab-mobile-title');
                if(mobileAccordionTabs){
                    mobileAccordionTabs.forEach(function(tab) {
                        tab.addEventListener('click', function() {
                            var currentTabIndex = this.dataset.tab;
                            var tabsContainer = this.closest('.tpgb-tabs-wrapper');
                            var tabsNav = tabsContainer.querySelectorAll('.tpgb-tabs-content-wrapper .tab-mobile-title');
                            var tabsContent = tabsContainer.querySelectorAll('.tpgb-tabs-content-wrapper .tpgb-tab-content');
                            
                            tabsNav.forEach(function(nav) {
                                nav.classList.remove('active', 'default-active');
                                nav.classList.add('inactive');
                            });
                            this.classList.add('active');
                            this.classList.remove('inactive');
                            
                            tabsContent.forEach(function(content) {
                                content.classList.remove('active');
                                content.classList.add('inactive');
                            });
                            tabsContainer.querySelector(".tpgb-tabs-content-wrapper .tpgb-tab-content[data-tab='" + currentTabIndex + "']").classList.add('active');
                            tabsContainer.querySelector(".tpgb-tabs-content-wrapper .tpgb-tab-content[data-tab='" + currentTabIndex + "']").classList.remove('inactive');
                        });
                    });
                }
            }

        });
    }
}

function tabstoursclickhover(e){
    var currentTabIndex = e.dataset.tab;
    var tabsContainer = e.closest('.tpgb-tabs-wrapper');
    var tabsNav = tabsContainer.querySelector('.tpgb-tabs-nav').querySelectorAll('.tpgb-tab-li .tpgb-tab-header');
    var tabsContent = tabsContainer.querySelector('.tpgb-tabs-content-wrapper').querySelectorAll('.tpgb-tab-content');
    
    tabsNav.forEach(function(nav) {
        nav.classList.remove('active', 'default-active');
        nav.classList.add('inactive');
    });
    e.classList.add('active');
    e.classList.remove('inactive');
    
    tabsContent.forEach(function(content) {
        content.classList.remove('active');
        content.classList.add('inactive');
    });
    tabsContainer.querySelector(".tpgb-tabs-content-wrapper .tpgb-tab-content[data-tab='" + currentTabIndex + "']").classList.add('active');
    tabsContainer.querySelector(".tpgb-tabs-content-wrapper .tpgb-tab-content[data-tab='" + currentTabIndex + "']").classList.remove('inactive');
    
    //Init Splide Slider
    var splideCarousels = tabsContainer.querySelectorAll(".tpgb-tab-content[data-tab='" + currentTabIndex + "'] .tpgb-carousel");
    splideCarousels.forEach(function(carousel) {
        var splideInit = slideStore.get(carousel);
        splideInit.refresh();
    });
    
    // Handle isotope
    var isotopeElements = tabsContainer.querySelectorAll(".tpgb-tab-content[data-tab='" + currentTabIndex + "'] .tpgb-isotope .post-loop-inner");
    if(isotopeElements.length) {
        isotopeElements.forEach(function(element) {
            if(element.parentNode.querySelector(".post-lazy-load") && typeof lazyInit == "function") {
                lazyInit(element.parentNode);
            }
        });
        
        isotopeElements.forEach(function(element) {
            var curr = element;
            var isotope = new Isotope(curr, {
                itemSelector: ".grid-item",
                resizable: true,
                sortBy: "original-order",
                resizesContainer: true,
                initLayout: false
            });
            isotope.layout();
            setTimeout(function() {
                isotope.layout();
            }, 50);
            
            if(curr.dataset.anim === 'no') {
                isotope.options.transitionDuration = 0;
            }
            
            if(curr.clientHeight === 0) {
                curr.style.opacity = 0;
                isotope.once('layoutComplete', function(isoInstance, laidOutItems) {
                    curr.style.opacity = 1;
                });
            }
        });
    }
    
    // Handle metro layout
    var metroElements = tabsContainer.querySelectorAll(".tpgb-tab-content[data-tab='" + currentTabIndex + "'] .tpgb-metro .post-loop-inner");
    if(metroElements.length) {
        if(document.body.clientHeight <= window.innerHeight) {
            metroElements.forEach(function(element) {
                if(element.querySelector(".post-lazy-load") && typeof tpgb_lazy_load_ajax === "function") {
                    tpgb_lazy_load_ajax(element);
                }
            });
        }
        setTimeout(function() {
            tpgb_metro_layout('');
        }, 30);
    }
    
    // Handle equal height
    var equalHeightElements = tabsContainer.querySelectorAll(".tpgb-tab-content[data-tab='" + currentTabIndex + "'] .tpgb-equal-height");
    if(equalHeightElements.length) {
        setTimeout(function() {
            equalHeightElements.forEach(function(element) {
                if(typeof equalHeightFun === 'function') {
                    equalHeightFun(element);
                }
            });
        }, 30);
    }
    
    // Handle expand
    var expandElements = tabsContainer.querySelectorAll(".tpgb-tab-content[data-tab='" + currentTabIndex + "'] .tp-expand");
    if(expandElements.length) {
        expandElements.forEach(function(element) {
            if(typeof tpgb_unfold === 'function') {
                tpgb_unfold(element);
            }
        });
    }
    
    // Handle before-after
    if(tabsContainer.querySelector(".tpgb-tabs-content-wrapper .tpgb-tab-content[data-tab='" + currentTabIndex + "'] .pt_tpgb_before_after")) {
        size_Elements();
    }
}