
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

        document.addEventListener('click',function(e){

            if( e.target && e.target.classList.contains('x-accordion_header') && !e.target.closest('.x-accordion_builder-collapse') ) {

                let accordionContent;
                let accordionHeaderSiblings = e.target.nextElementSibling;

                if ( null == accordionHeaderSiblings ) {
                    accordionHeaderSiblings = e.target.closest('.x-accordion_item').querySelector('.x-accordion_content')
                }

                while (accordionHeaderSiblings) {
                if (accordionHeaderSiblings.classList.contains('x-accordion_content')) {
                    accordionContent = accordionHeaderSiblings;
                    break;
                }
                    
                    if ( null != accordionContent.nextElementSibling ) {
                        accordionContent = accordionContent.nextElementSibling;
                    } else {
                        accordionContent = accordionContent.closest('.x-accordion_item').querySelector('.x-accordion_content')
                    }
                }

                if ('false' !== e.target.getAttribute('aria-expanded') ) {
                    e.target.setAttribute('aria-expanded', 'false')
                    if (typeof xslideUp !== 'function') {
                        accordionContent.style.display = 'none'
                    } else {
                        accordionContent.xslideUp('300');
                    }
                    if (e.target.closest('.x-accordion_item')) {
                        e.target.closest('.x-accordion_item').classList.remove('x-accordion_item-active')
                    }
                } else {
                    e.target.setAttribute('aria-expanded', 'true')
                    if (typeof xslideDown !== 'function') {
                        accordionContent.style.display = 'flex'
                    } else {
                        accordionContent.xslideDown('300')
                    }
                    if (e.target.closest('.x-accordion_item')) {
                        e.target.closest('.x-accordion_item').classList.add('x-accordion_item-active')
                    }
                    
                }
                
            }
         });

}

document.addEventListener("DOMContentLoaded",function(e){
    xExtrasBuilder()
});