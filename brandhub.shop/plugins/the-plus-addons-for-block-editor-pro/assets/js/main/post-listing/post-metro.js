/*post Masonry*/
document.addEventListener('DOMContentLoaded', function() {
    tppoMetro(document)
});

window.addEventListener("resize", function() {
    tppoMetro(document);
});

document.body.addEventListener("post-load", function() {
    setTimeout(function() {
        tppoMetro(document);
    }, 800);
});

document.body.addEventListener("resort-isotope", function() {
    setTimeout(function() {
        tppoMetro(document);
    }, 800);
});

document.body.addEventListener("tabs-reinited", function() {
    setTimeout(function() {
        tppoMetro(document);
    }, 800);
});
document.body.addEventListener("isotope-sorted", function() {
    setTimeout(function() {
        tppoMetro(document);
    }, 500);
});

function tppoMetro(doc){
    var tpgbMetroElements = doc.querySelectorAll('.tpgb-metro');
    if (tpgbMetroElements.length > 0) {
        tpgbMetroElements.forEach(function(element) {
            tpgbMetroLayout(element);
        });
    }

    if(typeof tpFilter == 'function'){
        tpFilter(doc);
    }
}

function tpgbMetroLayout(element) {
    var Id = element.getAttribute('data-id'),
        metroAttr = JSON.parse(element.getAttribute('data-metroAttr')),
        innerWidth = window.innerWidth,
        decWidth = innerWidth >= 1024,
        tabWidth = innerWidth >= 768 && innerWidth < 1024,
        mobileWidth = innerWidth < 768,
        metroCOl = '',
        setPad = 0,
        myWindow = window;

    if (decWidth && metroAttr.metro_col) {
        metroCOl = metroAttr.metro_col;
    }
    if (tabWidth && metroAttr.tab_metro_col) {
        metroCOl = metroAttr.tab_metro_col;
    }
    if (mobileWidth && metroAttr.mobile_metro_col) {
        metroCOl = metroAttr.mobile_metro_col;
    }

    if (metroCOl == '3') {
        var norm_size = Math.floor((element.offsetWidth - setPad * 2) / 3),
            double_size = norm_size * 2;
        element.querySelectorAll('.grid-item').forEach(function(item) {
            var set_w = norm_size,
                set_h = norm_size;
            if ((decWidth && metroAttr.metro_style == 'style-1') || (tabWidth && metroAttr.tab_metro_style == 'style-1') || (mobileWidth && metroAttr.mobile_metro_style == 'style-1')) {
                if ((decWidth && (item.classList.contains('tpgb-metro-1') || item.classList.contains('tpgb-metro-7'))) || (tabWidth && (item.classList.contains('tpgb-tab-metro-1') || item.classList.contains('tpgb-tab-metro-7'))) || (mobileWidth && (item.classList.contains('tpgb-mobile-metro-1') || item.classList.contains('tpgb-mobile-metro-7')))) {
                    set_w = double_size, set_h = double_size;
                }
                if ((decWidth && (item.classList.contains('tpgb-metro-4') || item.classList.contains('tpgb-metro-9'))) || (tabWidth && (item.classList.contains('tpgb-tab-metro-4') || item.classList.contains('tpgb-tab-metro-9'))) || (mobileWidth && (item.classList.contains('tpgb-mobile-metro-4') || item.classList.contains('tpgb-mobile-metro-9')))) {
                    set_w = double_size, set_h = norm_size;
                }
            } else if ((decWidth && metroAttr.metro_style == 'style-2') || (tabWidth && metroAttr.tab_metro_style == 'style-2') || (mobileWidth && metroAttr.mobile_metro_style == 'style-2')) {
                if ((decWidth && item.classList.contains('tpgb-metro-2')) || (tabWidth && item.classList.contains('tpgb-tab-metro-2')) || (mobileWidth && item.classList.contains('tpgb-mobile-metro-2'))) {
                    set_w = double_size, set_h = norm_size;
                }
                if ((decWidth && (item.classList.contains('tpgb-metro-4') || item.classList.contains('tpgb-metro-8'))) || (tabWidth && (item.classList.contains('tpgb-tab-metro-4') || item.classList.contains('tpgb-tab-metro-8'))) || (mobileWidth && (item.classList.contains('tpgb-mobile-metro-4') || item.classList.contains('tpgb-mobile-metro-8')))) {
                    set_w = norm_size, set_h = double_size;
                }
                if ((decWidth && item.classList.contains('tpgb-metro-7')) || (tabWidth && item.classList.contains('tpgb-tab-metro-7')) || (mobileWidth && item.classList.contains('tpgb-mobile-metro-7'))) {
                    set_w = double_size, set_h = double_size;
                }
            } else if ((decWidth && metroAttr.metro_style == 'style-3') || (tabWidth && metroAttr.tab_metro_style == 'style-3') || (mobileWidth && metroAttr.mobile_metro_style == 'style-3')) {
                if ((decWidth && (item.classList.contains('tpgb-metro-4') || item.classList.contains('tpgb-metro-15'))) || (tabWidth && (item.classList.contains('tpgb-tab-metro-4') || item.classList.contains('tpgb-tab-metro-15'))) || (mobileWidth && (item.classList.contains('tpgb-mobile-metro-4') || item.classList.contains('tpgb-mobile-metro-15')))) {
                    set_w = double_size, set_h = norm_size;
                }
                if ((decWidth && item.classList.contains('tpgb-metro-9')) || (tabWidth && item.classList.contains('tpgb-tab-metro-9')) || (mobileWidth && item.classList.contains('tpgb-mobile-metro-9'))) {
                    set_w = norm_size, set_h = double_size;
                }
                if ((decWidth && item.classList.contains('tpgb-metro-10')) || (tabWidth && item.classList.contains('tpgb-tab-metro-10')) || (mobileWidth && item.classList.contains('tpgb-mobile-metro-10'))) {
                    set_w = double_size, set_h = double_size;
                }
            } else if ((decWidth && metroAttr.metro_style == 'style-4') || (tabWidth && metroAttr.tab_metro_style == 'style-4') || (mobileWidth && metroAttr.mobile_metro_style == 'style-4')) {
                if ((decWidth && item.classList.contains('tpgb-metro-1')) || (tabWidth && item.classList.contains('tpgb-tab-metro-1')) || (mobileWidth && item.classList.contains('tpgb-mobile-metro-1'))) {
                    set_w = double_size, set_h = double_size;
                }
                if ((decWidth && item.classList.contains('tpgb-metro-7')) || (tabWidth && item.classList.contains('tpgb-tab-metro-7')) || (mobileWidth && item.classList.contains('tpgb-mobile-metro-7'))) {
                    set_w = double_size, set_h = norm_size;
                }
            } else if ((decWidth && metroAttr.metro_style == 'custom') || (tabWidth && metroAttr.tab_metro_style == 'custom') || (mobileWidth && metroAttr.mobile_metro_style == 'custom')) {
                var colArr = metroAttr.customLay;
                for (var key in colArr) {
                    let col = colArr[key].layout.split(":");
                    if ((decWidth && item.classList.contains('tpgb-metro-' + key)) || (tabWidth && item.classList.contains('tpgb-tab-metro-' + key)) || (mobileWidth && item.classList.contains('tpgb-mobile-metro-' + key))) {
                        set_w = norm_size * col[0], set_h = norm_size * col[1];
                    }
                };
            }

            if (innerWidth < 768) {
                item.style.width = '100%';
                item.style.height = double_size * 2 + 'px';
            } else {
                item.style.width = set_w + 'px';
                item.style.height = set_h + 'px';
            }
        });
    }

    if (metroCOl == '4') {
        var norm_size = Math.floor((element.offsetWidth - setPad * 2) / 4),
            double_size = norm_size * 2;

        element.querySelectorAll('.grid-item').forEach(function(item) {
            var set_w = norm_size,
                set_h = norm_size;
            if ((decWidth && metroAttr.metro_style == 'style-1') || (tabWidth && metroAttr.tab_metro_style == 'style-1') || (mobileWidth && metroAttr.mobile_metro_style == 'style-1')) {
                if ((decWidth && (item.classList.contains('tpgb-metro-3') || item.classList.contains('tpgb-metro-9'))) || (tabWidth && (item.classList.contains('tpgb-tab-metro-3') || item.classList.contains('tpgb-tab-metro-9'))) || (mobileWidth && (item.classList.contains('tpgb-mobile-metro-3') || item.classList.contains('tpgb-mobile-metro-9')))) {
                    set_w = double_size, set_h = double_size;
                }
                if ((decWidth && (item.classList.contains('tpgb-metro-4') || item.classList.contains('tpgb-metro-10'))) || (tabWidth && (item.classList.contains('tpgb-tab-metro-4') || item.classList.contains('tpgb-tab-metro-10'))) || (mobileWidth && (item.classList.contains('tpgb-mobile-metro-4') || item.classList.contains('tpgb-mobile-metro-10')))) {
                    set_w = double_size, set_h = norm_size;
                }
            }
            if ((decWidth && metroAttr.metro_style == 'style-2') || (tabWidth && metroAttr.tab_metro_style == 'style-2') || (mobileWidth && metroAttr.mobile_metro_style == 'style-2')) {
                if ((decWidth && (item.classList.contains('tpgb-metro-1') || item.classList.contains('tpgb-metro-5') || item.classList.contains('tpgb-metro-9') || item.classList.contains('tpgb-metro-10'))) || (tabWidth && (item.classList.contains('tpgb-tab-metro-1') || item.classList.contains('tpgb-tab-metro-5') || item.classList.contains('tpgb-tab-metro-9') || item.classList.contains('tpgb-tab-metro-10'))) || (mobileWidth && (item.classList.contains('tpgb-mobile-metro-1') || item.classList.contains('tpgb-mobile-metro-5') || item.classList.contains('tpgb-mobile-metro-9') || item.classList.contains('tpgb-mobile-metro-10')))) {
                    set_w = double_size, set_h = double_size;
                }
                if ((decWidth && (item.classList.contains('tpgb-metro-2') || item.classList.contains('tpgb-metro-8'))) || (tabWidth && (item.classList.contains('tpgb-tab-metro-2') || item.classList.contains('tpgb-tab-metro-8'))) || (mobileWidth && (item.classList.contains('tpgb-mobile-metro-2') || item.classList.contains('tpgb-mobile-metro-8')))) {
                    set_w = double_size, set_h = norm_size;
                }
            }
            if ((decWidth && metroAttr.metro_style == 'style-3') || (tabWidth && metroAttr.tab_metro_style == 'style-3') || (mobileWidth && metroAttr.mobile_metro_style == 'style-3')) {
                if ((decWidth && item.classList.contains('tpgb-metro-5')) || (tabWidth && item.classList.contains('tpgb-tab-metro-5')) || (mobileWidth && item.classList.contains('tpgb-mobile-metro-5'))) {
                    set_w = double_size, set_h = norm_size;
                }
                if ((decWidth && item.classList.contains('tpgb-metro-1')) || (tabWidth && item.classList.contains('tpgb-tab-metro-1')) || (mobileWidth && item.classList.contains('tpgb-mobile-metro-1'))) {
                    set_w = norm_size, set_h = double_size;
                }
                if ((decWidth && (item.classList.contains('tpgb-metro-3') || item.classList.contains('tpgb-metro-6'))) || (tabWidth && (item.classList.contains('tpgb-tab-metro-3') || item.classList.contains('tpgb-tab-metro-6'))) || (mobileWidth && (item.classList.contains('tpgb-mobile-metro-3') || item.classList.contains('tpgb-mobile-metro-6')))) {
                    set_w = double_size, set_h = double_size;
                }
            } else if ((decWidth && metroAttr.metro_style == 'custom') || (tabWidth && metroAttr.tab_metro_style == 'custom') || (mobileWidth && metroAttr.mobile_metro_style == 'custom')) {
                var colArr = metroAttr.customLay;
                for (var key in colArr) {
                    let col = colArr[key].layout.split(":");
                    if ((decWidth && item.classList.contains('tpgb-metro-' + key)) || (tabWidth && item.classList.contains('tpgb-tab-metro-' + key)) || (mobileWidth && item.classList.contains('tpgb-mobile-metro-' + key))) {
                        set_w = norm_size * col[0], set_h = norm_size * col[1];
                    }
                };
            }

            if (innerWidth < 768) {
                item.style.width = '100%';
                item.style.height = double_size * 2 + 'px';
            } else {
                item.style.width = set_w + 'px';
                item.style.height = set_h + 'px';
            }
        });
    }

    if (metroCOl == '5') {
        var norm_size = Math.floor((element.offsetWidth - setPad * 2) / 5),
            double_size = norm_size * 2;
        element.querySelectorAll('.grid-item').forEach(function(item) {
            var set_w = norm_size,
                set_h = norm_size;

            if ((decWidth && metroAttr.metro_style == 'custom') || (tabWidth && metroAttr.tab_metro_style == 'custom') || (mobileWidth && metroAttr.mobile_metro_style == 'custom')) {
                var colArr = metroAttr.customLay;
                for (var key in colArr) {
                    let col = colArr[key].layout.split(":");
                    if ((decWidth && item.classList.contains('tpgb-metro-' + key)) || (tabWidth && item.classList.contains('tpgb-tab-metro-' + key)) || (mobileWidth && item.classList.contains('tpgb-mobile-metro-' + key))) {
                        set_w = norm_size * col[0], set_h = norm_size * col[1];
                    }
                };
            } else {
                if ((decWidth && (item.classList.contains('tpgb-metro-5') || item.classList.contains('tpgb-metro-15'))) || (tabWidth && (item.classList.contains('tpgb-tab-metro-5') || item.classList.contains('tpgb-tab-metro-15'))) || (mobileWidth && (item.classList.contains('tpgb-mobile-metro-5') || item.classList.contains('tpgb-mobile-metro-15')))) {
                    set_w = double_size, set_h = double_size;
                }
                if ((decWidth && (item.classList.contains('tpgb-metro-1') || item.classList.contains('tpgb-metro-2') || item.classList.contains('tpgb-metro-9') || item.classList.contains('tpgb-metro-10'))) || (tabWidth && (item.classList.contains('tpgb-tab-metro-1') || item.classList.contains('tpgb-tab-metro-2') || item.classList.contains('tpgb-tab-metro-9') || item.classList.contains('tpgb-tab-metro-10'))) || (mobileWidth && (item.classList.contains('tpgb-mobile-metro-1') || item.classList.contains('tpgb-mobile-metro-2') || item.classList.contains('tpgb-mobile-metro-9') || item.classList.contains('tpgb-mobile-metro-10')))) {
                    set_w = double_size, set_h = norm_size;
                }
                if ((decWidth && (item.classList.contains('tpgb-metro-3') || item.classList.contains('tpgb-metro-6') || item.classList.contains('tpgb-metro-14'))) || (tabWidth && (item.classList.contains('tpgb-tab-metro-3') || item.classList.contains('tpgb-tab-metro-6') || item.classList.contains('tpgb-tab-metro-14'))) || (mobileWidth && (item.classList.contains('tpgb-mobile-metro-3') || item.classList.contains('tpgb-mobile-metro-6') || item.classList.contains('tpgb-mobile-metro-14')))) {
                    set_w = norm_size, set_h = double_size;
                }
            }

            if (innerWidth < 768) {
                item.style.width = '100%';
                item.style.height = double_size * 2 + 'px';
            } else {
                item.style.width = set_w + 'px';
                item.style.height = set_h + 'px';
            }
        });
    }

    if (metroCOl == '6') {
        var norm_size = Math.floor((element.offsetWidth - setPad * 2) / 6),
            double_size = norm_size * 2;

        element.querySelectorAll('.grid-item').forEach(function(item) {
            var set_w = norm_size,
                set_h = norm_size;

            if ((decWidth && metroAttr.metro_style == 'custom') || (tabWidth && metroAttr.tab_metro_style == 'custom') || (mobileWidth && metroAttr.mobile_metro_style == 'custom')) {
                var colArr = metroAttr.customLay;
                for (var key in colArr) {
                    let col = colArr[key].layout.split(":");
                    if ((decWidth && item.classList.contains('tpgb-metro-' + key)) || (tabWidth && item.classList.contains('tpgb-tab-metro-' + key)) || (mobileWidth && item.classList.contains('tpgb-mobile-metro-' + key))) {
                        set_w = norm_size * col[0], set_h = norm_size * col[1];
                    }
                };
            } else {

                if ((decWidth && (item.classList.contains('tpgb-metro-1') || item.classList.contains('tpgb-metro-5') || item.classList.contains('tpgb-metro-9') || item.classList.contains('tpgb-metro-10'))) || (tabWidth && (item.classList.contains('tpgb-tab-metro-1') || item.classList.contains('tpgb-tab-metro-5') || item.classList.contains('tpgb-tab-metro-9') || item.classList.contains('tpgb-tab-metro-10'))) || (mobileWidth && (item.classList.contains('tpgb-mobile-metro-1') || item.classList.contains('tpgb-mobile-metro-5') || item.classList.contains('tpgb-mobile-metro-9') || item.classList.contains('tpgb-mobile-metro-10')))) {
                    set_w = double_size, set_h = double_size;
                }
                if ((decWidth && (item.classList.contains('tpgb-metro-2') || item.classList.contains('tpgb-metro-7') || item.classList.contains('tpgb-metro-14') || item.classList.contains('tpgb-metro-15') || item.classList.contains('tpgb-metro-16'))) || (tabWidth && (item.classList.contains('tpgb-tab-metro-2') || item.classList.contains('tpgb-tab-metro-7') || item.classList.contains('tpgb-tab-metro-14') || item.classList.contains('tpgb-tab-metro-15') || item.classList.contains('tpgb-tab-metro-16'))) || (mobileWidth && (item.classList.contains('tpgb-mobile-metro-2') || item.classList.contains('tpgb-mobile-metro-7') || item.classList.contains('tpgb-mobile-metro-14') || item.classList.contains('tpgb-mobile-metro-15') || item.classList.contains('tpgb-mobile-metro-16')))) {
                    set_w = double_size, set_h = norm_size;
                }
                if ((decWidth && (item.classList.contains('tpgb-metro-4') || item.classList.contains('tpgb-metro-6') || item.classList.contains('tpgb-metro-8'))) || (tabWidth && (item.classList.contains('tpgb-tab-metro-4') || item.classList.contains('tpgb-tab-metro-6') || item.classList.contains('tpgb-tab-metro-8'))) || (mobileWidth && (item.classList.contains('tpgb-mobile-metro-4') || item.classList.contains('tpgb-mobile-metro-6') || item.classList.contains('tpgb-mobile-metro-8')))) {
                    set_w = norm_size, set_h = double_size;
                }
            }

            if (innerWidth < 768) {
                item.style.width = '100%';
                item.style.height = double_size * 2 + 'px';
            } else {
                item.style.width = set_w + 'px';
                item.style.height = set_h + 'px';
            }
        });
    }

    if (element.classList.contains('tpgb-metro')) {
        var block = document.querySelector('.tpgb-block-' + Id),
            postLoopInner = block.querySelector(".post-loop-inner");
    
        // Initialize Isotope
        let isotopeOptions = {
            itemSelector: '.grid-item',
            layoutMode: 'masonry',
            masonry: {
                columnWidth: norm_size
            }
        };
    
        if (element) {
            if (myWindow.innerWidth > 767) {
                new Isotope(postLoopInner, isotopeOptions);
            } else {
                new Isotope(postLoopInner, isotopeOptions);
            }
        } else {
            new Isotope(postLoopInner, {
                layoutMode: 'masonry',
                masonry: {
                    columnWidth: norm_size
                }
            });
        }
    
        if (typeof postLoopInner.isotope === 'function') {
            postLoopInner.isotope('layout');
        }

        imagesLoaded(postLoopInner, function() {
            if (typeof postLoopInner.isotope === 'function') {
                postLoopInner.isotope('layout').isotope('reloadItems');
            }
        });
    }
}
