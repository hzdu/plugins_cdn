function xContentTimelineHorizontal() {

    function setLinePositionHorizontal(slider, scroll, lineStyle, activeLineStyle) {

        if ( ! slider.querySelector('.splide__list > .x-content-timeline_line') ) {

            const lineIdentifer = slider.querySelector('.brxe-xcontenttimeline').getAttribute('data-x-id')

            const line = document.createElement("span");
            line.classList.add('x-content-timeline_line')
            line.setAttribute('data-x-id',lineIdentifer)
            slider.querySelector('.splide__list').append(line);
            const lineActive = document.createElement("div");
            lineActive.classList.add('x-content-timeline_line-active')
            line.append(lineActive);

            line.style.backgroundColor = lineStyle.backgroundColor
            line.style.height = lineStyle.height
            lineActive.style.backgroundColor = activeLineStyle.backgroundColor

        }

        slider.querySelectorAll('.brxe-xcontenttimeline .x-content-timeline_line').forEach( timeline => {
            timeline.remove()
        })

            slider.addEventListener('x_slider:init', function() {

                let firstItem = slider.querySelector('.splide__slide:first-of-type');
                let lastItem =  slider.querySelector('.splide__slide:last-of-type');
                let sliderLine = slider.querySelector('.x-content-timeline_line');
                let sliderLineActive = slider.querySelector('.x-content-timeline_line-active');

                if ( lastItem ) {

                    let sliderLineLeft = (firstItem.offsetWidth / 2)
                    let sliderLineWidth = slider.querySelector('.splide__list').scrollWidth - lastItem.scrollWidth

                    sliderLine.style.opacity = "0";
                    sliderLine.style.top = firstItem.querySelector('.x-content-timeline_marker-inner') ? ( firstItem.querySelector('.x-content-timeline_marker-inner').getBoundingClientRect().top - slider.getBoundingClientRect().top + ( firstItem.querySelector('.x-content-timeline_marker-inner').offsetHeight / 2 ) ) + 'px' : '';
                    sliderLine.style.left = sliderLineLeft + 'px';
                    sliderLine.style.opacity = "1";
                    sliderLine.style.width = sliderLineWidth + 'px';

                }

                let currentSplideInstance = xSlider.Instances[slider.getAttribute('data-x-id')]

                currentSplideInstance.on( 'active resize', function () {

                    lastItem =  slider.querySelector('.splide__slide:last-of-type');

                    sliderLine.style.opacity = "0";
                    sliderLine.style.top = firstItem.querySelector('.x-content-timeline_marker-inner') ? ( firstItem.querySelector('.x-content-timeline_marker-inner').getBoundingClientRect().top - slider.getBoundingClientRect().top + ( firstItem.querySelector('.x-content-timeline_marker-inner').offsetHeight / 2 ) ) + 'px' : ''; 
                    sliderLine.style.left = (firstItem.offsetWidth / 2) + 'px';
                    sliderLine.style.opacity = "1";
                    sliderLine.style.width = slider.querySelector('.splide__list').scrollWidth - lastItem.scrollWidth + 'px';
                    
                    if (scroll) {
                        setTimeout(function () {
                            let sliderLineTotal = slider.querySelector('.splide__list').scrollWidth - (firstItem.offsetWidth / 2) - (lastItem.offsetWidth / 2)
                            let activeMarkerLeft = slider.querySelector('.is-active').offsetLeft + ( slider.querySelector('.is-active').offsetWidth / 2 ) - (firstItem.offsetWidth / 2)

                            let lineScale = 1 / ( sliderLineTotal / activeMarkerLeft );
                            let lineScalePercent = lineScale * 100;

                            if (lineScale < 0) {
                                //sliderLineActive.style.transform = "scaleX(0)";
                                slider.style.setProperty('--x-timeline-progress', '0')
                            } else if (0 <= lineScale && lineScale <= 1) {
                                slider.style.setProperty('--x-timeline-progress', lineScalePercent)
                                //sliderLineActive.style.transform = "scaleX(" + (lineScale) + ")";
                            } else {
                                slider.style.setProperty('--x-timeline-progress', '1')
                                //sliderLineActive.style.transform = "scaleX(1)";
                            }   

                        }, 10)
                    }

                    setTimeout(function () {
                        let activeSlides = slider.querySelectorAll('.splide__slide.is-active');
                        let nextSlides = slider.querySelectorAll('.splide__slide.is-next');
                        let prevSlides = slider.querySelectorAll('.splide__slide.is-prev');
                        let overflowSlides = slider.querySelectorAll('.splide__slide:not(.is-visible)');

                        function matches(elem, filter) {
                            if (elem && elem.nodeType === 1) {
                              if (filter) {
                                return elem.matches(filter);
                              }
                              return true;
                            }
                            return false;
                          }

                        function getNextSiblings(elem, filter) {
                            var sibs = [];
                            while (elem = elem.nextSibling) {
                              if (matches(elem, filter)) {
                                sibs.push(elem);
                              }
                            }
                            return sibs;
                          }

                          function getPreviousSiblings(elem, filter) {
                            var sibs = [];
                            while (elem = elem.previousSibling) {
                              if (matches(elem, filter)) {
                                sibs.push(elem);
                              }
                            }
                            return sibs;
                          }

                        activeSlides.forEach( activeSlide => {
                            activeSlide.classList.add('was-active')

                            var nextSlides = getNextSiblings(activeSlide, '.splide__slide:not(.is-prev):not(.is-active)');
                            var prevSlides = getPreviousSiblings(activeSlide, '.splide__slide:not(.is-next):not(.is-active)');

                            nextSlides.forEach( nextSlidesSlide => {
                                nextSlidesSlide.classList.remove('was-active')
                            })

                            prevSlides.forEach( prevSlidesSlide => {
                                prevSlidesSlide.classList.add('was-active')
                            })

                        })  

                    }, 10)
                })

            })
    };    

    document.querySelectorAll('.x-slider').forEach( slider => {

        let scroll = false;
        
        if ( slider.querySelector('.brxe-xcontenttimeline') ) {
            if ( 'true' === slider.querySelector('.brxe-xcontenttimeline').getAttribute('data-x-scroll') ) {
                scroll = true;
            }

            const lineStyle = getComputedStyle(slider.querySelector('.x-content-timeline_line'))
            const activeLineStyle = getComputedStyle(slider.querySelector('.x-content-timeline_line-active'))

            setLinePositionHorizontal(slider,scroll,lineStyle, activeLineStyle)
        }
    })

    document.querySelectorAll('.brxe-xcontenttimeline[data-x-horizontal="true"]').forEach( timeline => {
        timeline.querySelector('.x-content-timeline_list').classList.add('x-content-timeline_ready')
    })

}

document.addEventListener("DOMContentLoaded",function(e){
   bricksIsFrontend&&xContentTimelineHorizontal()
});