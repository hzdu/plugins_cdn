function xContentTimeline() {

    const extrasTimeline = function ( container, ajax ) {

        let positionWaiting = false;
        let positionStatus = false;
        let activeWaiting = false;
        let activeResize = false;
        let currentScrollPos

        let scrollPosition,lineTop,scaleValue,startScale,lineScale, lineScalePercent, firstItemHeight, lastItemHeight, windowHeight = window.innerHeight, itemHeight, itemTop

        function toggleActiveClass(timelineItem,currentScrollPos,itemTop,itemHeight,windowHeight) {

            scrollPosition = 2

            if (itemTop + currentScrollPos < (currentScrollPos + windowHeight/scrollPosition - ( itemHeight/2 ) ) ) {
                timelineItem.classList.add('x-content-timeline_active')
                timelineItem.dispatchEvent(new Event('x_timeline_item:active'))  
            } else {
                timelineItem.classList.remove('x-content-timeline_active')
                timelineItem.dispatchEvent(new Event('x_timeline_item:inactive'))
            }
                
        };

        function setLinePosition(timeline, currentScrollPos, trigger) {

            let firstItem = timeline.querySelector('.x-content-timeline_item:first-of-type');
            let lastItem =  timeline.querySelector('.x-content-timeline_item:last-of-type');
            let line = timeline.querySelector('.x-content-timeline_line');
            let lineActive = timeline.querySelector('.x-content-timeline_line-active');

            if (!lastItem) {
                let items = timeline.querySelectorAll('.x-content-timeline_item')
                lastItem = items[items.length -1]
            }

            function positionLine() {

                line.style.opacity = "0";
                //line.style.top = ( firstItem.offsetHeight / 2 ) + 'px'; 
                line.style.top = firstItem.querySelector('.x-content-timeline_marker').getBoundingClientRect().top + ( firstItem.querySelector('.x-content-timeline_marker').offsetHeight / 2 ) - timeline.getBoundingClientRect().top + 'px'
                //line.style.bottom = ( lastItem.offsetHeight / 2 ) + 'px'; 
                line.style.bottom = timeline.getBoundingClientRect().bottom - lastItem.querySelector('.x-content-timeline_marker').getBoundingClientRect().bottom + ( lastItem.querySelector('.x-content-timeline_marker').offsetHeight / 2 ) + 'px'
                line.style.left = firstItem.querySelector('.x-content-timeline_marker').getBoundingClientRect().left + ( firstItem.querySelector('.x-content-timeline_marker').offsetWidth / 2 ) - timeline.getBoundingClientRect().left + 'px'
                line.style.opacity = "1";

            }

            if ( firstItem && lastItem && line && lineActive ) {

                if (false === positionStatus) {

                     firstItemHeight = firstItem.querySelector('.x-content-timeline_marker-inner').offsetHeight
                     lastItemHeight = lastItem.querySelector('.x-content-timeline_marker-inner').offsetHeight
                     windowHeight = window.innerHeight

                     positionStatus = true

                }

                scrollPosition = 2
                lineTop = currentScrollPos + firstItem.querySelector('.x-content-timeline_marker-inner').getBoundingClientRect().top + ( lastItemHeight ) - 2

                scaleValue = 1 / ( currentScrollPos + lastItem.querySelector('.x-content-timeline_marker-inner').getBoundingClientRect().top + ( lastItemHeight ) - 2 - lineTop )
                startScale = currentScrollPos - lineTop + ( windowHeight/scrollPosition );
                lineScale = startScale * scaleValue;

                lineScalePercent = lineScale * 100;
                

                if ((lineScale < 0) || isNaN(parseFloat(lineScale)) ) {
                    timeline.style.setProperty('--x-timeline-progress', '0')
                } else if (0 <= lineScale && lineScale <= 1) {
                    timeline.style.setProperty('--x-timeline-progress', lineScalePercent)
                } else {
                    timeline.style.setProperty('--x-timeline-progress', '100')
                }   


                if (positionWaiting && ('scroll' === trigger)) {
                    return;
                }

                positionWaiting = true;

                if ('resize' === trigger) {
                    positionWaiting = false;
                }

                setTimeout(() => {
                    positionLine()
                    positionWaiting = false;
                    positionStatus = false;
                }, 50);

            }
            
        };    


        function timelineOnScroll( e ) {
            requestAnimationFrame( updatePageScroll );
        }

        function timelineOnResize( e ) {
            requestAnimationFrame( updatePageResize );
        }

        function updatePageScroll() {

            currentScrollPos = window.scrollY;

            document.querySelectorAll('.brxe-xcontenttimeline[data-x-horizontal="false"]').forEach( timeline => {
                setLinePosition(timeline,currentScrollPos,'scroll')
            })

            if (activeWaiting) { return; }

            activeWaiting = true;

            setTimeout(() => {

                windowHeight = window.innerHeight

                document.querySelectorAll('.brxe-xcontenttimeline[data-x-horizontal="false"][data-x-scroll="true"] .x-content-timeline_item').forEach( item => {

                    itemTop = item.querySelector('.x-content-timeline_marker-inner').getBoundingClientRect().top
                    itemHeight = item.querySelector('.x-content-timeline_marker-inner').offsetHeight
                    
                    toggleActiveClass(item,currentScrollPos,itemTop,itemHeight,windowHeight)
                })

                activeWaiting = false;
            }, 150);
        }

        function updatePageResize() {

            currentScrollPos = window.scrollY;

            document.querySelectorAll('.brxe-xcontenttimeline[data-x-horizontal="false"]').forEach( timeline => {
                setLinePosition(timeline,currentScrollPos,'resize')
            })

            if (activeResize) { return; }

                activeResize = true;

                setTimeout(() => {

                    windowHeight = window.innerHeight

                    document.querySelectorAll('.brxe-xcontenttimeline[data-x-horizontal="false"][data-x-scroll="true"] .x-content-timeline_item').forEach( item => {

                        itemTop = item.getBoundingClientRect().top
                        itemHeight = item.offsetHeight

                        toggleActiveClass(item,currentScrollPos,itemTop,itemHeight,windowHeight) 
                    })
                    activeResize = false;
                }, 250);
        }

        window.addEventListener( 'scroll', timelineOnScroll, false );
        window.addEventListener( 'resize', timelineOnResize, false );

        container.querySelectorAll('.brxe-xcontenttimeline[data-x-horizontal="false"]').forEach( timeline => {
            
            setTimeout(() => {
                timeline.querySelector('.x-content-timeline_list').classList.add('x-content-timeline_ready')
                setLinePosition(timeline)
            }, 200)    
        })

    }

    extrasTimeline(document, ajax = false);

    // Expose function
    window.doExtrasTimeline = extrasTimeline;

}

document.addEventListener("DOMContentLoaded",function(e){
   bricksIsFrontend&&xContentTimeline()
});