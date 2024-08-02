// Js For Splide Slider
let slideStore = new Map();

document.addEventListener('DOMContentLoaded', function() {
    tppocaro(document)
});

function tppocaro(doc){
    var scope = doc.querySelectorAll('.tpgb-carousel');
    if(scope){
        scope.forEach(function(obj) {
            splide_init(obj)
        });
    }
}

function splide_init(ele) {
    var connId = ele.getAttribute('data-connection'),
        setting = JSON.parse(ele.getAttribute('data-splide')),
        slide = new Splide(ele).mount( ( setting && setting.autoScroll != undefined && setting.autoScroll && window.splide && window.splide !== undefined && window.splide.Extensions) ? window.splide.Extensions : '' ),
        target = document.querySelectorAll('#' + connId);
    slideStore.set(ele, slide);

    if(ele.classList.contains('tpgb-infobox')){
        slide.on('move', function(e, currentSlide, nextSlide) {
            let gtSlide = ele.querySelectorAll('.tpgb-draw-svg');
            gtSlide.forEach((ee)=>{
                ee.querySelector('object').style.opacity = '1';
            })
        });
    }

    //Carousel Remote
    if (target.length) {
        target.forEach(function(connDiv) {
            if (connDiv && connDiv.classList.contains('tpgb-carousel-remote')) {
                var remoteType = connDiv.getAttribute('data-remote'),
                    remote = connDiv.querySelectorAll('.slider-btn'),
                    dotDiv = connDiv.querySelectorAll('.tpgb-carousel-dots .tpgb-carodots-item');

                if (remote !== undefined && remote !== '') {
                    remote.forEach(function(btn) {
                        btn.addEventListener('click', function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            var btnDiv = this,
                                carousel_slide = btnDiv.getAttribute("data-nav");

                            if (remoteType == 'carousel') {
                                if (carousel_slide == 'next') {
                                    slide.go('+');
                                } else if (carousel_slide == 'prev') {
                                    slide.go('-');
                                }

                            }
                        });
                    });
                }
                if (dotDiv && dotDiv !== null) {
                    dotDiv.forEach(function(dot) {
                        dot.addEventListener('click', function() {
                            const dots = connDiv.querySelectorAll('.tpgb-carousel-dots .tpgb-carodots-item');
                            
                            dots.forEach(dot => {
                                dot.classList.remove('active', 'default-active');
                                dot.classList.add('inactive');
                            });
                
                            this.classList.add('active');
                            this.classList.remove('inactive');
                
                            const connection = this.closest(".tpgb-carousel-remote").dataset.connection;
                            const tabIndex = Number(this.dataset.tab);
                            
                            tpgb_carousel_conn(tabIndex, connection);
                        });
                    });
                }
            }

            //Accordion Connection
            if (connDiv && connDiv.classList.contains('tpgb-accor-wrap')) {
                var accordion = connDiv.querySelectorAll('.tpgb-accordion-header'),
                    dataconn = connDiv.getAttribute('data-connection'),
                    type = connDiv.getAttribute('data-type');

                if (dataconn && dataconn !== '') {
                    if ('accordion' == type) {
                        accordion.forEach(function(acc) {
                            acc.addEventListener('click', function() {
                                var tab_index = acc.dataset.tab;
                                tpgb_carousel_conn(tab_index - 1, dataconn);
                            })
                        })
                    }
                    if ('hover' == type) {
                        accordion.forEach(function(acc) {
                            acc.addEventListener('mouseover', function() {
                                var tab_index = acc.dataset.tab;
                                tpgb_carousel_conn(tab_index - 1, dataconn);
                            })
                        })
                    }
                }
            }

            //Tab Tours
            if (connDiv && connDiv.classList.contains('tpgb-tabs-wrapper')) {
                var Tab = connDiv.querySelectorAll('.tpgb-tab-header'),
                    tabdataconn = connDiv.getAttribute('data-connection'),
                    hover = connDiv.getAttribute('data-tab-hover');

                if (tabdataconn && tabdataconn !== '') {
                    if ('no' == hover) {
                        Tab.forEach(function(acc) {
                            acc.addEventListener('click', function() {
                                var tab_index = acc.dataset.tab;
                                tpgb_carousel_conn(tab_index - 1, dataconn);
                            })
                        })
                    }
                    if ('yes' == hover) {
                        Tab.forEach(function(acc) {
                            acc.addEventListener('mouseover', function() {
                                var tab_index = acc.dataset.tab;
                                tpgb_carousel_conn(tab_index - 1, dataconn);
                            })
                        })
                    }
                }
            }

            //Process Step
            if (connDiv && connDiv.classList.contains('tpgb-process-steps')) {
                var step = connDiv.querySelectorAll('.tpgb-p-s-wrap'),
                    stepdataconn = connDiv.getAttribute('data-connection'),
                    hover = connDiv.getAttribute('data-eventtype');

                if (stepdataconn && stepdataconn !== '') {
                    if ('con_pro_click' == hover) {
                        step.forEach(function(acc) {
                            acc.addEventListener('click', function() {
                                var tab_index = acc.dataset.index;
                                tpgb_carousel_conn(tab_index - 1, dataconn);
                            })
                        })
                    }
                    if ('con_pro_hover' == hover) {
                        step.forEach(function(acc) {
                            acc.addEventListener('mouseover', function() {
                                var tab_index = acc.dataset.index;
                                tpgb_carousel_conn(tab_index - 1, dataconn);
                            })
                        })
                    }
                }
            }
			
			//Interactive Circle Info
			if (connDiv && connDiv.classList.contains('tpgb-ia-circle-info')) {
                var step = connDiv.querySelectorAll('.tpgb-ia-circle-item'),
                    stepdataconn = connDiv.getAttribute('data-connection'),
                    hover = connDiv.getAttribute('data-eventtype');

                if (stepdataconn && stepdataconn !== '') {
                    if ('click' == hover) {
                        step.forEach(function(acc) {
                            acc.addEventListener('click', function() {
                                var tab_index = acc.dataset.index;
                                tpgb_carousel_conn(tab_index - 1, stepdataconn);
                            })
                        })
                    }
                    if ('hover' == hover) {
                        step.forEach(function(acc) {
                            acc.addEventListener('mouseover', function() {
                                var tab_index = acc.dataset.index;
                                tpgb_carousel_conn(tab_index - 1, stepdataconn);
                            })
                        })
                    }
                }
            }

            // Scroll Navigation connection
            if (connDiv && connDiv.classList.contains('tpgb-scroll-nav-inner')) {
                var step = connDiv.querySelectorAll('.tpgb-scroll-nav-item'),
                    stepdataconn = connDiv.getAttribute('data-connection');

                if (stepdataconn && stepdataconn !== '') {
                    step.forEach(function(acc) {
                        acc.addEventListener('click', function() {
                            var tab_index = acc.dataset.tab;
                            tpgb_carousel_conn( Number(tab_index), dataconn);
                        })
                    })

                }
            }

            function tpgb_carousel_conn(tab_index, Connection) {
                if (Connection != '') {
                    var current = slide.index;
                    if (current != (tab_index)) {
                        slide.go(tab_index);
                    }
                }
            }
        });

        // vice versa Connection    
        slide.on('move', function(e, currentSlide, nextSlide) {
            if (slide.length == nextSlide) {
                nextSlide = 0;
            }

            // carousel Custom Dots
            var connElement = document.getElementById(connId),
                nextDot = connElement.querySelector('.tpgb-carodots-item[data-tab="' + parseInt(nextSlide) + '"]');
            
            if (nextDot && !nextDot.classList.contains("active")) {
                nextDot.click();
            }

            // Pagination 
            var paginationElement = connElement.querySelector('.carousel-pagination .pagination-list');
            if (paginationElement) {
                const nextSlideIndex = nextSlide + 1;
                const formattedIndex = nextSlideIndex <= 9 ? '0' + nextSlideIndex : nextSlideIndex;
                paginationElement.innerHTML = '<div class="active">' + formattedIndex + '</div>';
            }

            // Accordion Connection
            var nextAccordionHeader = connElement.querySelector('.tpgb-accordion-header[data-tab="' + (nextSlide + 1) + '"]');
            if (nextAccordionHeader && !nextAccordionHeader.classList.contains("active")) {
                nextAccordionHeader.click();
            }

            //Tab Tours Connection
            var nextTabHeader = connElement.querySelector('.tpgb-tab-li .tpgb-tab-header[data-tab="' + (nextSlide + 1) + '"]');
            if (nextTabHeader && !nextTabHeader.classList.contains("active")) {
                nextTabHeader.click();
            }

            //Scroll Nav connection
            var nextNavItem = connElement.querySelector('a.tpgb-scroll-nav-item[data-tab="' + nextSlide + '"]');
            if (nextNavItem && !nextNavItem.classList.contains("active")) {
                nextNavItem.click();
            }

            // Process Step Connection
            var nextSlideElement = connElement.querySelector('.tpgb-p-s-wrap[data-index="' + (nextSlide + 1) + '"]');

            if (nextSlideElement && !nextSlideElement.classList.contains("active")) {
                const allSlideElements = connElement.querySelectorAll('.tpgb-p-s-wrap');
                allSlideElements.forEach(slide => {
                    slide.classList.remove("active");
                });
                nextSlideElement.classList.add("active");
            }
			
			// Interactive Circle Info
            const nextCircleItem = connElement.querySelector('.tpgb-ia-circle-item[data-index="' + (nextSlide + 1) + '"]');
            if (nextCircleItem && !nextCircleItem.classList.contains("active")) {
                const allCircleItems = connElement.querySelectorAll('.tpgb-ia-circle-item');
                allCircleItems.forEach(item => {
                    item.classList.remove("active");
                });
                
                nextCircleItem.classList.add("active");
            }
        })
    }
}