document.addEventListener("DOMContentLoaded", function() {
    tabtoursInit(document)
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
                });
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
        if(document.body.clientHeight <= window.innerHeight) {
            isotopeElements.forEach(function(element) {
                if(element.querySelector(".post-lazy-load") && typeof tpgb_lazy_load_ajax === "function") {
                    tpgb_lazy_load_ajax(element);
                }
            });
        }
        
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
    
    // Handle before-after
    if(tabsContainer.querySelector(".tpgb-tabs-content-wrapper .tpgb-tab-content[data-tab='" + currentTabIndex + "'] .pt_tpgb_before_after")) {
        size_Elements();
    }
}