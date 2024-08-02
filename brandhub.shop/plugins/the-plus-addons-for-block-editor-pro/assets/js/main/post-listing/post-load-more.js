/*----load more post ajax----------------*/
document.addEventListener("DOMContentLoaded", function() {
    tppoLoad(document)
})

function tppoLoad(doc){
    var loadMoreButtons = doc.querySelectorAll('.post-load-more');

    if (loadMoreButtons.length && (doc.querySelector('.tpgb-isotope') || doc.querySelector('.tpgb-metro'))) {
        loadMoreButtons.forEach(function(button) {
            button.addEventListener('click', function(event) {
                event.preventDefault();
                var current = this,
                    option = JSON.parse(current.dataset.dypost),
                    stoption = current.dataset.postOption,
                    currentText = current.textContent;
                
                
                current.textContent = option.loadingtxt
                if (option.offset_posts === undefined || option.offset_posts === "") {
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
                            current.textContent = currentText
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
                                            transitionDuration:  (option.disableAnim) ? 0 : '0.4s' ,
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
                                    if(typeof tppoMetro == 'function'){
                                        tppoMetro(doc)
                                    }
                                }
                                if( typeof tppostList == 'function' ){
                                    tppostList(doc)
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
                                    if( typeof tpFilter == 'function' ){
                                        tpFilter(listDiv)
                                    }

                                }
                                
                                if(listDiv.classList.contains("tpgb-equal-height")){
                                    if(typeof tpeqHeight == 'function'){
                                        var eDiv = document.getElementById(option.load_class);
                                        tpeqHeight(eDiv)
                                    }
                                }

                                if(listDiv.querySelectorAll(".tpgb-messagebox").length > 0 && typeof tpmsgBox == 'function'){
                                    tpmsgBox(listDiv)
                                }

                                if(listDiv.querySelectorAll(".tpgb-fancy-popup").length > 0 ){
                                    let fancyDiv = listDiv.querySelectorAll(".tpgb-fancy-popup");
                                    fancyDiv.forEach(function(ele) {
                                        tpgb_fancy_popup(ele)
                                    })
                                }
                                if(listDiv.querySelectorAll(".tpgb-accordion").length > 0 ){
                                    if(typeof accordionJS == 'function'){
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
                    };
                    xhr.send('action=tpgb_post_load&option='+encodeURIComponent(stoption)+'&dyOpt='+encodeURIComponent(JSON.stringify(option)));
                } else {
                    current.classList.add("hide");
                }
            });
        });
    }
}