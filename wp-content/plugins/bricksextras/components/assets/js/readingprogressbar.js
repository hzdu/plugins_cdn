
function xReadingProgressBar() {

    if ( document.querySelector('body > .brx-body.iframe') ) {
        return
    }

    document.querySelectorAll('.x-reading-progress-bar').forEach((readingProgress) => {

        let scrollPosition = 0;
        let waiting = false;
        
        const configAttr = readingProgress.getAttribute('data-x-progress')
		const config = configAttr ? JSON.parse(configAttr) : {}

        const reading_progress_start = null != config.start ? config.start : 'top';
        const reading_progress_end = null != config.end ? config.end : 'bottom';
        const content = null != config.containerSelector ? document.querySelector(config.containerSelector) : document.body
        const reading_progress_bar = readingProgress.querySelector( '.x-reading-progress-bar_progress' )

        function setProgress(scrollPosition) {
                    
            let postTopOffset = content.offsetTop,                
                postBottomOffset = postTopOffset + content.offsetHeight, 
                windowHeight =  window.innerHeight,
                windowWidth = document.documentElement.clientWidth,
                startPosition,
                endPosition,
                progressScale
                
            
            if ( reading_progress_start === "top" ) {
                startPosition = postTopOffset;
            } else if ( reading_progress_start == 'middle' ) {
                startPosition = postTopOffset - (windowHeight/2);
            } else if ( reading_progress_start == 'bottom' ) {
                startPosition = postTopOffset - (windowHeight);
            }
            
            if ( reading_progress_end === "top" ) {
                endPosition = postBottomOffset;
            } else if ( reading_progress_end == 'middle' ) {
                endPosition = postBottomOffset - (windowHeight/2);
            } else if ( reading_progress_end == 'bottom' ) {
                endPosition = postBottomOffset - (windowHeight)
            }                        

            if ( scrollPosition >= startPosition ) {
                
                progressScale = (scrollPosition - startPosition) / (endPosition - startPosition);

                let progressWidth = 100 * (windowWidth * progressScale) / windowWidth;

                if (progressWidth <= 100) {
                    reading_progress_bar.style.width = progressWidth + "%";
                } else {
                    reading_progress_bar.style.width = '100%';
                }

            } else {
                reading_progress_bar.style.width = '0%';
            }

        }

        if ( content ) {  

            document.addEventListener('scroll', (e) => {
                scrollPosition = window.scrollY;

                if (!waiting) {
                    window.requestAnimationFrame(() => {
                        setProgress(scrollPosition);
                        waiting = false;
                    });

                    waiting = true;
                }

            });

        } else {
            console.log('BricksExtras: Content not found on page. Check the content selector is correct.')
        }

    })

}


document.addEventListener("DOMContentLoaded",function(e){
    bricksIsFrontend&&xReadingProgressBar()
 });