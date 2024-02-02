function xBackToTop() {

    if ( document.querySelector('body > .brx-body.iframe') ) {
        //return
    }

    document.querySelectorAll('.x-back-to-top').forEach((backToTop) => {

        const line = backToTop.querySelector('.x-back-to-top_progress-line');

        let lineLength, progress = false

        if ( line ) {
            lineLength = line.getTotalLength()
            progress = true
            line.style.strokeDasharray = lineLength;
             line.style.strokeDashoffset = lineLength;
        }

        const configAttr = backToTop.getAttribute('data-x-backtotop') ? backToTop.getAttribute('data-x-backtotop') : false;

        function isJSON(str) {
            try {
                return (JSON.parse(str) && !!str);
            } catch (e) {
                return false;
            }
        }

        config = isJSON(configAttr) ? JSON.parse(configAttr) : {}

        let scrollPosition = 0;
        let oldScrollPosition = 0;
        let waiting = false;        

        function setProgress(scrollPosition) {
                    
            let postTopOffset = document.body.offsetTop,                
                postBottomOffset = postTopOffset + document.body.offsetHeight, 
                windowHeight =  window.innerHeight,
                startPosition, endPosition, progressScale, dashOffset, scrollDirection
                
            startPosition = postTopOffset;
            endPosition = postBottomOffset - (windowHeight)

            if ( scrollPosition >= startPosition ) {
                
                progressScale = (scrollPosition - startPosition) / (endPosition - startPosition);

                if (progressScale <= 1) {
                    dashOffset = lineLength - ( progressScale * ( lineLength ) )
                } else {
                    dashOffset = 0;
                }

            } else {
                dashOffset = lineLength
            }

            line.style.strokeDashoffset = dashOffset

        }

        function setVisibility(scrollPosition,oldScrollPosition) {

            function revealBTT() {
                backToTop.setAttribute('aria-hidden', false)
                backToTop.removeAttribute('disabled')
                backToTop.style.opacity = '1'
                backToTop.style.transform = 'none'
                backToTop.dispatchEvent(new Event('x_back_to_top:show'))
            }

            function hideBTT() {
                backToTop.setAttribute('aria-hidden', true)
                backToTop.setAttribute('disabled', '')
                backToTop.style.removeProperty('opacity')
                backToTop.style.removeProperty('transform')
                backToTop.dispatchEvent(new Event('x_back_to_top:hide'))
            }

            if ( scrollPosition >= config.scrollDistance ) {
                if ( config.scrollUp ) {
                    if( oldScrollPosition - scrollPosition >= 0 ){
                        revealBTT()
                    } else {
                        hideBTT()
                    }
                } else {
                    revealBTT()
                }
            } else {
                hideBTT()
            }

        }

        document.addEventListener('scroll', (e) => {

            scrollPosition = window.scrollY;

            if (!waiting) {
                window.requestAnimationFrame(() => {
                    if ( progress ) {
                        setProgress(scrollPosition);
                    }
                    if ( !document.querySelector('body > .brx-body.iframe') ) {
                        setVisibility(scrollPosition,oldScrollPosition);
                    }
                    oldScrollPosition = scrollPosition;
                    waiting = false;
                });

                waiting = true;
            }

            

        });

        backToTop.addEventListener('click', (e) => {

            window.scrollTo(
                {
                    top: 0, 
                    behavior: 'smooth'
                }
            )

            backToTop.dispatchEvent(new Event('x_back_to_top:scroll'))

        })

        

    })

}

document.addEventListener("DOMContentLoaded",function(e){
    bricksIsFrontend&&xBackToTop()
 });