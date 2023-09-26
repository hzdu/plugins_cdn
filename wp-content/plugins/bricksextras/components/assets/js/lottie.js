function xLottie(){

    const extrasLottie = function ( container ) {

    container.querySelectorAll('.brxe-xlottie').forEach( xlottie => {

        if ( !document.querySelector('body > .brx-body.iframe') ) {

            const onIntersection = (entries,observer) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        doLottie()
                        observer.unobserve(xlottie)
                    }
                }
            };
            
            const observer = new IntersectionObserver(onIntersection,{
                root: null,
                rootMargin: '0px 0px 50px 0px',
                threshold: 1
            });
            observer.observe(xlottie);     
        
        } else {
            doLottie()
        }

        function doLottie() {
            const configAttr = xlottie.getAttribute('data-x-lottie')
            const config = configAttr ? JSON.parse(configAttr) : {}

            lottie.destroy( xlottie.getAttribute('data-script-id') )

            const start = parseInt( config.start )
            const end = parseInt( config.end )
            const offsetBottom = parseInt(config.offsetB) / 100
            const offsetTop = 1 - parseInt(config.offsetT) / 100


                const lottieInstance = lottie.loadAnimation({
                    container: xlottie, 
                    name: xlottie.getAttribute('data-script-id'),
                    renderer: 'svg',
                    loop: config.loop != null ? config.loop : false,
                    autoplay: config.autoPlay != null ? config.autoPlay : false,
                    initialSegment: [start, end],
                    path: config.url
                })

                lottieInstance.setSpeed(parseFloat(config.speed))

                let reverseAnimation = false

                if ( 'click' === config.trigger || 'clickSelector' === config.trigger ) {

                    let clickElement = xlottie;
                    if ( 'clickSelector' === config.trigger ) {
                        clickElement = document.querySelector(config.clickSelector)
                    }

                    if ( clickElement ) {

                        if ( true !== config.rev ) {

                            if ( 'clickSelector' !== config.trigger ) {

                                LottieInteractivity.create({
                                    player: lottieInstance,
                                    mode: "cursor",
                                    actions: [
                                        {
                                            type: 'click',
                                        }
                                    ]
                                });

                            } else {

                                clickElement.addEventListener('click', function(e){

                                    e.preventDefault();
                                    lottieInstance.goToAndPlay(start)
            
                                })

                            }

                        } else {

                            clickElement.addEventListener('click', function(e){

                                e.preventDefault();

                                reverseAnimation = !reverseAnimation
                                if(!reverseAnimation) {
                                    lottieInstance.setDirection(-1); 
                                    lottieInstance.play(); 
                                } else { 
                                    lottieInstance.setDirection(1); 
                                    lottieInstance.play(); 
                                }

                            })

                        }

                    }

                }

                if ( 'scroll' === config.trigger || 'scrollSelector' === config.trigger ) {

                    let containerSelector = 'scroll' === config.trigger ? xlottie : config.scrollSelector
                    
                        LottieInteractivity.create({
                            mode: 'scroll',
                            player: lottieInstance,
                            container: containerSelector,
                            actions: [
                                {
                                    visibility:[0, offsetBottom],
                                    type: "stop",
                                    frames: [start]
                                },
                                {
                                    visibility: [offsetBottom, offsetTop],
                                    type: "seek",
                                    frames: [start, end]
                                },
                                {
                                    visibility: [offsetTop, 1],
                                    type: 'stop',
                                    frames: [end]
                                }
                            ]
                        });
                }

                if ( 'hover' === config.trigger ) {

                    const hoverType = config.hoverReverse ? "hold" : "hover"

                    LottieInteractivity.create({
                        player: lottieInstance,
                        mode:"cursor",
                        actions: [
                            {
                                type: hoverType
                            }
                        ]
                    });

                }

                if ( 'hoverSelector' === config.trigger ) {

                    document.querySelector(config.hoverSelector).addEventListener('mouseenter', function(e){

                        lottieInstance.setDirection(1); 
                        lottieInstance.goToAndPlay(start)

                    })

                    if ( config.hoverReverse ) {

                        document.querySelector(config.hoverSelector).addEventListener('mouseleave', function(e){

                            lottieInstance.setDirection(-1); 
                            lottieInstance.play(); 

                        })

                    }

                }

                if ( 'cursor' === config.trigger ) {

                    LottieInteractivity.create({
                        player: lottieInstance,
                        mode:"cursor",
                        actions: [
                            {
                                position: { x: [0, 1], y: [0, 1] },
                                type: "seek",
                                frames: [start, end]
                            }
                        ]
                    });

                }

        }

    })

    }

    extrasLottie(document);

    function xLottieAJAX(e) {

        if (typeof e.detail.queryId === 'undefined') {
            return;
        }

        if ( document.querySelector('.brxe-' + e.detail.queryId) ) {
            extrasLottie(document.querySelector('.brxe-' + e.detail.queryId).parentElement);
        }
   }
   
   document.addEventListener("bricks/ajax/load_page/completed", xLottieAJAX)
   document.addEventListener("bricks/ajax/pagination/completed", xLottieAJAX)

    // Expose function
    window.doExtrasLottie = extrasLottie;

}

document.addEventListener("DOMContentLoaded",function(e){
    bricksIsFrontend&&xLottie()
});