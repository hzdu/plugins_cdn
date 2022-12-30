
function xExtrasBuilder() {

    function xthrottle(f, delay) {
        let timer = 0;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(() => f.apply(this, args), delay);
        }
      }
      
      if (typeof(ResizeObserver) === 'function') {
          const resizeObserver = new ResizeObserver(xthrottle((entries) => {
      
              for (const entry of entries) {
                  document.body.dispatchEvent(new Event('x_resize_throttled'))
              }
        }, 250))
        
        resizeObserver.observe(document.body, { box: 'border-box' });
      
      }

      const elementCSS = document.querySelector('#dynamic-element-css')

        const options = {
            characterData: true,
            childList: true
        }

        function callback(mutationList, observer) {
        
            mutationList.forEach(function(mutation) {
                document.body.dispatchEvent(new Event('x_style_setting_changed'))
            })
        }

        const observer = new MutationObserver(callback)
        observer.observe(elementCSS, options)
}

document.addEventListener("DOMContentLoaded",function(e){
    xExtrasBuilder()
});