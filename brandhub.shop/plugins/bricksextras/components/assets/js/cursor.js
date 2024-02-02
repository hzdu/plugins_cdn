function xCursor() {

    if ( document.querySelector('body > .brx-body.iframe') ) { return }
    
        document.querySelectorAll(".x-interactive-cursor").forEach((cursor) => { 

                const config = cursor.getAttribute('data-x-cursor') ? JSON.parse(cursor.getAttribute('data-x-cursor')) : {}
                const balls = cursor.querySelectorAll(".x-cursor_inner")

                setTimeout(function () {
    
                let aimX = 0
                let aimY = 0
    
                balls.forEach((ball, index) => {
                        let currentX = 0
                        let currentY = 0
                        let speed = index === 0 ? 1 : (config.trailDelay * index);
                        if (speed > 1) { speed = 1 }
                    
                    const moveCursor = function () {

                        currentX += ( (aimX - currentX) * speed )
                        currentY += ( (aimY - currentY) * speed )

                         ball.style.left = currentX + "px"
                         ball.style.top = currentY + "px"
    
                        requestAnimationFrame(moveCursor)
                    }
    
                    moveCursor()

                })
    
                document.addEventListener('mousemove', updateCursorPosition, false)
    
                function updateCursorPosition(event) {

                    cursor.classList.add("x-cursor_ready")
    
                    aimX = event.clientX
                    aimY = event.clientY    

                    if (event.clientY <= 20 || event.clientX <= 20 || (event.clientX >= (window.innerWidth - 20) || event.clientY >= (window.innerHeight - 20))) {  
                        cursor.classList.add("x-cursor_offpage")
                    } else {
                        cursor.classList.remove("x-cursor_offpage")
                    }
                }
    
                document.addEventListener("mousedown", function (event) {
                    cursor.classList.add("x-cursor_mousedown")
                })
    
                document.addEventListener("mouseup", function (event) {
                    cursor.classList.remove("x-cursor_mousedown")
                })
    
                document.querySelectorAll("[data-x-hover]").forEach(hoverElement => {
                    hoverElement.addEventListener("mouseover", function () {
                        cursor.classList.add("x-cursor_text-visible")
                        cursor.classList.add("x-cursor_grow")
                        cursor.querySelector(".x-cursor_ball span").innerHTML = hoverElement.getAttribute("data-x-hover")
                    })
                    
                    hoverElement.addEventListener("mouseout", function () {
                        cursor.classList.remove("x-cursor_text-visible")
                        cursor.classList.remove("x-cursor_grow")
                    })
                })

                document.querySelectorAll( '.brxe-xbacktotop' ).forEach(backToTop => {
                    backToTop.addEventListener("x_back_to_top:hide", function () {
                        cursor.classList.remove("x-cursor_trail-grow")
                    })
                    backToTop.addEventListener("x_back_to_top:scroll", function () {
                        cursor.classList.remove("x-cursor_trail-grow")
                    })
                    
                })
    
                document.querySelectorAll( config.hoverSelectors ).forEach(growElement => {
                    growElement.addEventListener("mouseover", function () {
                        cursor.classList.add("x-cursor_trail-grow")
                    })
                    
                    growElement.addEventListener("mouseout", function () {
                        cursor.classList.remove("x-cursor_trail-grow")
                    })
                })

                let removeCursorSelectors = cursor.getAttribute('data-x-remove-cursor');
                removeCursorSelectors = removeCursorSelectors + ', iframe, stripe-pricing-table';

                document.querySelectorAll( removeCursorSelectors ).forEach(iframe => {
                    iframe.addEventListener("mouseover", function () {
                        cursor.classList.add("x-cursor_iframe")
                    })
                    
                    iframe.addEventListener("mouseleave", function () {
                        cursor.classList.remove("x-cursor_iframe")
                    })
                })

                document.addEventListener('x_readmore:before_toggle', function() {
                    cursor.classList.remove("x-cursor_trail-grow")
                    setTimeout(function () {
                        document.querySelectorAll( config.hoverSelectors ).forEach(growElement => {
                            growElement.addEventListener("mouseover", function () {
                                cursor.classList.add("x-cursor_trail-grow")
                            })
                            
                            growElement.addEventListener("mouseout", function () {
                                cursor.classList.remove("x-cursor_trail-grow")
                            })
                        })
                    }, 100)
                })

                /* disable if user using touch */
                document.addEventListener('touchstart', function() {
					cursor.style.display = 'none'
				})

            }, config.trailDelay)
         });
       
}

document.addEventListener("DOMContentLoaded",function(e){
    setTimeout(() => {
     bricksIsFrontend&&xCursor()
    }, 100) 
});