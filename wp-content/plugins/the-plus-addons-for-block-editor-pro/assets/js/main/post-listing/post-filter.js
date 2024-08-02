function tpFilter(doc) {
    try {
        var tpFilterData = doc.querySelectorAll('.tpgb-isotope .tpgb-filter-data, .tpgb-metro .tpgb-filter-data');

        if (tpFilterData.length) {
            tpFilterData.forEach(function(filterData) {
                var categoryList = filterData.querySelectorAll('.tpgb-category-list');
                categoryList.forEach(function(item) {
                    item.addEventListener('click', function(event) {
                        event.preventDefault();
                        var pList = item.closest(".tpgb-isotope,.tpgb-metro"),
                            uid = pList.dataset.id
                            layout = pList.dataset.layout,
                            filterValue = this.getAttribute("data-filter"),
                            siblings = item.parentNode.parentNode.querySelectorAll('.active'),
                            isotopeContainer = document.getElementById(uid).querySelector(".post-loop-inner"),
                            iso = '',
                            layoutMode =( layout=='metro' || layout=='grid' ) ? 'fitRows' : 'masonry';

                        siblings.forEach(function(sibling) {
                            sibling.classList.remove('active');
                        });

                        this.classList.add('active');

                        if (!isotopeContainer.isotope) {
                            iso = new Isotope(isotopeContainer, {
                                itemSelector: '.grid-item',
                                layoutMode: layoutMode,
                            });
                            isotopeContainer.isotope = iso;
                        } else {
                            iso = isotopeContainer.isotope;
                        }

                        iso.arrange({ filter: filterValue });
                        iso.layout();

                        var isotopeSortedEvent = new Event('isotope-sorted');
                        document.body.dispatchEvent(isotopeSortedEvent);
                    });
                });

            });
        }

        let dyHcntAll = doc.querySelectorAll(".tpgb-post-listing");
        if (dyHcntAll) {
            dyHcntAll.forEach(function(dyAll) {
                if(  dyAll.classList.contains('tpgb-child-filter')){
                    let filList = dyAll.querySelectorAll('.tpgb-filter-list');
                    if(filList){
                        filList.forEach((fl)=>{
                            let fBtn = fl.querySelector('a');
                            if(fBtn){
                                fBtn.addEventListener('click', (e)=>{
                                    e.preventDefault();
                                    var get_filter = e.currentTarget.getAttribute("data-filter"),
                                    get_filter_remove_dot = get_filter.split('.').join(""),  
                                    get_sub_class = 'cate-parent-',
                                    get_filter_add_class = get_sub_class.concat(get_filter_remove_dot);
        
                                    let clostFil = e.currentTarget.closest('.tpgb-category-filter'),
                                        catFchild = clostFil.querySelectorAll('.category-filters-child');
                                    if(get_filter_remove_dot=="*" && get_filter_remove_dot !=undefined){
                                        catFchild.forEach((catC)=>{
                                            if(catC.classList.contains('active')){
                                                catC.classList.remove('active');
                                            }
                                        })
                                    }else{
                                        catFchild.forEach((catC)=>{
                                            if(catC.classList.contains('active')){
                                                catC.classList.remove('active');
                                            }
                                        })
                                        let childClass = clostFil.querySelector('.'+get_filter_add_class);
                                        if(childClass){
                                            childClass.classList.add('active');
                                        }
                                    }
                                })
                            }
                        });
                    }
                }
            })
        }

    } catch (error) {
        console.error('Error in tpFilter:', error);
    }
}