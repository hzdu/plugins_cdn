
function xBeforeAfterImage() {

    if ( document.querySelector('body > .brx-body.iframe') ) {
        return
    }

    document.querySelectorAll('.x-before-after').forEach((beforeAfter) => {

        const configAttr = beforeAfter.getAttribute('data-x-before-after')
		const config = configAttr ? JSON.parse(configAttr) : {}

        beforeAfter.querySelector('.x-before-after_slider').addEventListener('input', (e) => {
            beforeAfter.style.setProperty('--x-before-after-position', `${e.target.value}%`);
        })

        if ( config.maybeMouseMove ) {

            let valueHover = 0;

            function rangePosition(e) {
                return 'horizontal' === config.direction ? (e.offsetX / e.target.clientWidth) *  parseInt(e.target.getAttribute('max'),10) : 100 - (e.offsetY / e.target.clientHeight) *  parseInt(e.target.getAttribute('max'),10)
            }

            beforeAfter.querySelector('.x-before-after_slider').addEventListener('mousemove', function(e) {
                beforeAfter.style.setProperty('--x-before-after-position', `${rangePosition(e)}%`)
            });
        }

    })

}

document.addEventListener("DOMContentLoaded",function(e){
    bricksIsFrontend&&xBeforeAfterImage()
 });