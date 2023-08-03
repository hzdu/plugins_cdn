
function xStickyHeader() {

    const headerTemplate = document.querySelector('.x-header_sticky')

    if (!headerTemplate) {
        return;
    }

    const mediaWidth = headerTemplate.dataset.xBreak
    const scrollDistance = headerTemplate.dataset.xScroll
    let headerHeight = headerTemplate.offsetHeight
    let desktopStatus = false;
    var start;

    if ( headerTemplate.querySelector('.brxe-xnotificationbar') ) {
        let notificationBar = headerTemplate.querySelector('.brxe-xnotificationbar');
        let notificationHeight = notificationBar.offsetHeight

        const notificationAttr = notificationBar.getAttribute('data-x-notification')
        const notificationConfig = notificationAttr ? JSON.parse(notificationAttr) : {}

        let notificationDuration = notificationConfig.slideDuration

        notificationBar.addEventListener('x_notification:close', function(){
            if ( 'show' !== notificationBar.getAttribute('data-x-sticky') ) {
                if ('overlay' !== getComputedStyle(headerTemplate).getPropertyValue('--x-header-position').split(" ").join("")) {
                    if ( notificationBar.closest('.x-header_sticky:not(.x-header_sticky-active)') ) {
                        setTimeout(function () {
                            headerHeight = headerTemplate.offsetHeight
                        }, notificationDuration + 10)
                        
                    } else if ( notificationBar.closest('.x-header_sticky.x-header_sticky-active') ) {

                        var elMarginTop     = notificationHeight
                        var stepMarginTop     = elMarginTop  / notificationDuration;

                        var oldHeaderHeight = headerHeight;
                        headerHeight = headerTemplate.offsetHeight - notificationHeight
        
                        function step(timestamp) {
                    
                            if (start === undefined) start = timestamp;
                            var elapsed = timestamp - start;
                    
                            document.body.style.marginTop = oldHeaderHeight - (stepMarginTop * elapsed) + "px";
                        
                            if (elapsed >= notificationDuration) {
                            } else {
                                window.requestAnimationFrame(step);
                            }
                        }
                    
                        window.requestAnimationFrame(step);
                    }
                }
            }
        })

        
    }

    

    /* sticky */

    function stickyFunction() {
        
        let currentScroll = window.pageYOffset;  

                headerTemplate.classList.remove('x-header_sticky-hidden')

                if ( currentScroll > scrollDistance ) {
                    headerTemplate.classList.add('x-header_sticky-active')
                    headerTemplate.classList.remove('x-header_sticky-inactive')
                    headerTemplate.querySelectorAll('[data-x-sticky]:not([data-x-sticky=hide])').forEach((stickyRow) => {
                        stickyRow.setAttribute('data-x-sticky-active','true')
                    })

                    if ( getComputedStyle(headerTemplate).position != 'absolute' && headerTemplate.classList.contains('x-header_sticky-active') ) {
                        if ('overlay' !== getComputedStyle(headerTemplate).getPropertyValue('--x-header-position').split(" ").join("")) {
                            document.body.style.marginTop = headerHeight + "px";
                        }
                    }

                } else {
                    document.body.style.marginTop = "0";
                    headerTemplate.classList.remove('x-header_sticky-active')
                    headerTemplate.classList.add('x-header_sticky-inactive')
                    headerTemplate.querySelectorAll('[data-x-sticky-active*=true]').forEach((stickyRow) => {
                        stickyRow.removeAttribute('data-x-sticky-active')
                    })
                } 

    };

    const debounce = (fn, threshold) => {
        var timeout;
        threshold = threshold || 100;
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


     var checkDeviceforScroll = function() {
                
        // Above breakpoint
        if( window.innerWidth >= mediaWidth ){
            if (!desktopStatus) {
                window.addEventListener('scroll', stickyFunction);
                desktopStatus = true;
            }
        } 
        // No scroll events below breakpoint
        else {
            if (desktopStatus) {
                document.body.style.marginTop = "0";
                headerTemplate.classList.remove('x-header_sticky-active')
                headerTemplate.querySelectorAll('[data-x-sticky-active*=true]').forEach((stickyRow) => {
                    stickyRow.removeAttribute('data-x-sticky-active')
                })
                window.removeEventListener('scroll', stickyFunction)
            }
            desktopStatus = false;
            
        }

    };

    checkDeviceforScroll()

    window.addEventListener('resize', debounce(() => {
        checkDeviceforScroll()
    }));

}

document.addEventListener("DOMContentLoaded",function(e){
    bricksIsFrontend&&xStickyHeader()
 });

