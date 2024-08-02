/*----load more post ajax----------------*/
var loading = false;
document.addEventListener("DOMContentLoaded", function() {
    var lazydiv = document.querySelectorAll('.tpgb-lazy-load');

    if ( lazydiv ) {
        lazydiv.forEach(function(lazyitem) {
            var isotopeContainers = lazyitem.closest('.tpgb-isotope');
            var metroContainers = lazyitem.closest('.tpgb-metro');
            var selector = isotopeContainers ? isotopeContainers : metroContainers;
            
            if(selector.offsetHeight){
                lazyInit(selector);
            }
           
        })
    }

})
var tpagblazystore ='' , windowWidth, windowHeight, documentHeight ,scrollTop, containerHeight, containerOffset;

var recalcValues = function() {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    documentHeight = document.body.clientHeight;
};

function lazyInit(isoDiv){
    tpagblazystore = isoDiv;
    var tabCnt = isoDiv.closest('.tpgb-tab-content');

    var parentOfParent1 = ( isoDiv.closest('.tpgb-tab-content') &&  isoDiv.closest('.tpgb-tab-content').parentNode.closest('.tpgb-tab-content') ) ? isoDiv.closest('.tpgb-tab-content').parentNode.closest('.tpgb-tab-content').parentNode.closest('.tpgb-tab-content') : '';
    if (parentOfParent1 && parentOfParent1.length && !parentOfParent1.classList.contains('active')) {
        return;
    }

    var parentOfParent = (isoDiv.closest('.tpgb-tab-content') ) ?  isoDiv.closest('.tpgb-tab-content').parentNode.closest('.tpgb-tab-content') : '';
    if (parentOfParent && parentOfParent.length && !parentOfParent.classList.contains('active')) {
        return;
    }

    if (tabCnt && !tabCnt.classList.contains('active')) {
        return;
    }
    
    window.addEventListener('resize', recalcValues);
    window.removeEventListener('scroll', tpgblazycall);
    window.addEventListener('scroll', tpgblazycall);
}

function tpgblazycall(e){
   
    
    e.preventDefault();
    recalcValues();
    scrollTop = window.scrollY;
    
    var containerHeight = tpagblazystore.offsetHeight,
        containerOffset = tpagblazystore.offsetTop + 50;
    if ( scrollTop < documentHeight && scrollTop > (containerHeight + containerOffset - windowHeight) && !loading) {
       
        loading = true;
        tpgb_lazy_load_ajax(tpagblazystore);
    }
}

function tpgb_lazy_load_ajax(thisElem = '') {

    var current = thisElem.querySelector(".post-lazy-load"),
        option = JSON.parse(current.dataset.dypost),
        stoption = current.dataset.postOption;

    if (option.offset_posts == undefined || option.offset_posts == "") {
        option.offset_posts = 0;
    }

    if (option.total_page >= option.page) {
        option.offset = (parseInt(option.page - 1) * parseInt(option.load_more)) + parseInt(option.display_post) + parseInt(option.offset_posts);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', (tpgb_config && tpgb_config.ajax_url) ? tpgb_config.ajax_url : tpgb_load.ajaxUrl , true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');

        xhr.onload = function() {
            if (xhr.status === 200 && xhr.status < 400) {
                var data = xhr.responseText;

                if (data === '') {
                    current.classList.add("hide");
                } else {
                    var listDiv = document.getElementById(option.load_class),
                        container = listDiv.querySelector('.post-loop-inner');
                    if (option.layout === 'grid' || option.layout === 'masonry') {
                        if (listDiv.classList.contains("tpgb-isotope")) {
                            var iso = new Isotope(container, {
                                itemSelector: ".grid-item",
                                resizable: true,
                                sortBy: "original-order",
                                layoutMode: "masonry" == option.layout ? "masonry" : "fitRows",
                                transitionDuration: (option.disableAnim) ? 0 : '0.4s',
                            });

                            var tempDiv = document.createElement('div');
                            tempDiv.innerHTML = data;
                            iso.insert(tempDiv.querySelectorAll('.grid-item'));
                            iso.layout();
                            iso.reloadItems()
                        }
                    }
                    if (listDiv.classList.contains("tpgb-metro")) {
                        container.insertAdjacentHTML('beforeend', data);
                        if (typeof tppoMetro == 'function') {
                            tppoMetro(document)
                        }
                    }
                    if (typeof tppostList == 'function') {
                        tppostList(document)
                    }
                    if (listDiv.querySelectorAll('.tpgb-category-filter').length > 0) {
                        listDiv.querySelectorAll(' .tpgb-filter-data .tpgb-categories > .tpgb-filter-list > a').forEach(function(element) {
                            var filter = element.dataset.filter;
                            var total_count = 0;

                            if (filter !== undefined && filter !== '') {
                                if (filter === '*') {
                                    total_count = listDiv.querySelectorAll('.post-loop-inner .grid-item').length;
                                } else {
                                    total_count = listDiv.querySelectorAll(' .post-loop-inner .grid-item' + filter).length;
                                }
                            }
                            if (total_count > 0 && element.querySelector(".tpgb-category-count") != null) {
                                element.querySelector(".tpgb-category-count").innerHTML = total_count;
                            }
                        });
                        if (typeof tpFilter == 'function') {
                            tpFilter(listDiv)
                        }

                    }

                    if (listDiv.classList.contains("tpgb-equal-height")) {
                        if (typeof tpeqHeight == 'function') {
                            var eDiv = document.getElementById(option.load_class);
                            tpeqHeight(eDiv)
                        }
                    }

                    if (listDiv.querySelectorAll(".tpgb-messagebox").length > 0 && typeof tpmsgBox == 'function') {
                        tpmsgBox(listDiv)
                    }

                    if (listDiv.querySelectorAll(".tpgb-fancy-popup").length > 0) {
                        let fancyDiv = listDiv.querySelectorAll(".tpgb-fancy-popup");
                        fancyDiv.forEach(function(ele) {
                            tpgb_fancy_popup(ele)
                        })
                    }
                    if (listDiv.querySelectorAll(".tpgb-accordion").length > 0) {
                        if (typeof accordionJS == 'function') {
                            accordionJS(listDiv);
                        }
                    }
                    if (listDiv.querySelectorAll(".tpgb-heading-animation").length > 0) {
                        if (typeof tpheAnim == 'function') {
                            tpheAnim(listDiv);
                        }
                    }
                }

                option.page++;
                if (option.page === option.total_page) {
                    current.classList.add("hide");
                    option.page = option.page
                    current.parentNode.insertAdjacentHTML('beforeend', '<div class="tpgb-post-loaded">' + option.loaded_posts + '</div>');
                } else {
                    option.page = option.page
                    current.setAttribute('data-page', option.page);
                }
                var newDataDypost = JSON.stringify(option);
                current.dataset.dypost = newDataDypost;
            }
            loading = false;
        };
        xhr.send('action=tpgb_post_load&option=' + encodeURIComponent(stoption) + '&dyOpt=' + encodeURIComponent(JSON.stringify(option)));
    } else {
        current.classList.add("hide");
    }
}