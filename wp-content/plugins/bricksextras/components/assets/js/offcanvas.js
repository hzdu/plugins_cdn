function xOffCanvas(offcanvas, elementConfig) {

   const offcanvasInner = offcanvas.querySelector(".x-offcanvas_inner")
   const offcanvasID = offcanvas.id

   let insideLoop = false;
   let loopContainer;

    if ( null != elementConfig.isLooping ) {
       loopContainer = offcanvas.closest('.brxe-' + elementConfig.isLooping)
    } else {
      loopContainer = document
    }

   offcanvasInner.querySelectorAll('img[loading=lazy]').forEach((lazyImage) => {
    lazyImage.setAttribute('loading','auto')
   })

    setTimeout(() => {
      offcanvasInner.classList.add("x-offcanvas_ready")
    }, "300")

    if ('false' != elementConfig.autoAriaControl) {
      document.querySelectorAll(elementConfig.clickTrigger).forEach((clickTrigger) => {
        clickTrigger.setAttribute('aria-controls', offcanvasInner.id)
        clickTrigger.setAttribute('aria-expanded', 'false')
      });
    }

    function toggleOffcanvas() {
      if ('true' == offcanvas.querySelector(".x-offcanvas_inner").getAttribute('aria-hidden')) {
        xOpenOffCanvas(offcanvasID)
      } else {
        xCloseOffCanvas(offcanvasID)
      }
    }

    if ('false' != elementConfig.escClose) {

      document.addEventListener('keydown', function(e) {
        if((e.key === "Escape" || e.key === "Esc")){
          xCloseOffCanvas(offcanvasID)
        }
      });

    }

    if ('true' == elementConfig.preventScroll) {

      offcanvas.addEventListener('x_offcanvas:open', () => {
        document.documentElement.classList.add("x-offcanvas_prevent-scroll_" + offcanvas.id)
      })
      offcanvas.addEventListener('x_offcanvas:close', () => {
        document.documentElement.classList.remove("x-offcanvas_prevent-scroll_" + offcanvas.id)
      })

    }

    if ('false' != elementConfig.backdropClose && offcanvas.querySelector(".x-offcanvas_backdrop") ) {
      offcanvas.querySelector(".x-offcanvas_backdrop").addEventListener('click', () => {
        xCloseOffCanvas(offcanvasID)
        });
    }
     
     loopContainer.querySelectorAll(elementConfig.clickTrigger).forEach((clickTrigger) => {
          
          clickTrigger.addEventListener('click', () => {

            if ( clickTrigger.classList.contains('brxe-xlottie') ) {
              if ( 'true' === clickTrigger.getAttribute('aria-expanded' ) ) {
                clickTrigger.setAttribute('aria-expanded', 'false')
              } else {
                clickTrigger.setAttribute('aria-expanded', 'true')
              }
            }

            toggleOffcanvas()

            if ('true' === elementConfig.syncBurgers) {

              loopContainer.querySelectorAll(elementConfig.clickTrigger).forEach((otherTrigger) => {

                if (otherTrigger !== clickTrigger) {

                  if ('true' != clickTrigger.getAttribute('aria-expanded')) {
                    otherTrigger.setAttribute('aria-expanded', 'false')
                    if ( otherTrigger.querySelector(".x-hamburger-box") ) {
                          otherTrigger.querySelector(".x-hamburger-box").classList.remove("is-active")
                    }
                  } else {
                    otherTrigger.setAttribute('aria-expanded', 'true')
                    if ( otherTrigger.querySelector(".x-hamburger-box") ) {
                      otherTrigger.querySelector(".x-hamburger-box").classList.add("is-active")
                    }
                  }
                  
                }

              });
            }

          });
        });

        if ( 'true' !== elementConfig.disableHashlink ) {

          offcanvasInner.querySelectorAll('a[href*=\\#]').forEach(hashLink => {

            if ( ! hashLink.parentElement.classList.contains('menu-item-has-children') ) {
             
              hashLink.addEventListener('click', e => {
                xCloseOffCanvas(offcanvasID)
              })

            }
            
          })

      }

}

function xCloseOffCanvas(elementID) {
  document.getElementById(elementID).querySelector(".x-offcanvas_inner").setAttribute('inert', '')
  document.getElementById(elementID).dispatchEvent(new Event('x_offcanvas:close'))
  xOffCanvasCloseBurger(elementID)
  xOffCanvasCloseOther(elementID)
  document.querySelectorAll(xOffCanvasConfig(elementID).clickTrigger).forEach((clickTrigger) => {
    if ( clickTrigger.classList.contains('brxe-xlottie') ) {
      if ( 'true' === clickTrigger.getAttribute('aria-expanded' ) ) {
        clickTrigger.click()
      }
    }
  });

  document.getElementById(elementID).querySelectorAll( 'iframe').forEach(iframe => {
    iframe.src = iframe.src;
  });

  document.getElementById(elementID).querySelectorAll( 'video').forEach(video => {  
    video.pause();
  });

  document.getElementById(elementID).querySelectorAll('form').forEach(form => {  
    form.reset();
  });
}

function xOpenOffCanvas(elementID) {
  document.getElementById(elementID).querySelector(".x-offcanvas_inner").removeAttribute('inert')
  xOffCanvasMoveFocus(elementID)
  document.getElementById(elementID).dispatchEvent(new Event('x_offcanvas:open'))  
}

function xOffCanvasCloseBurger(elementID) {
  document.querySelectorAll(xOffCanvasConfig(elementID).clickTrigger).forEach((clickTrigger) => {
    if ( clickTrigger.classList.contains('brxe-xburgertrigger') ) {
      
      setTimeout(() => {
        clickTrigger.setAttribute('aria-expanded', 'false')
        clickTrigger.querySelector(".x-hamburger-box").classList.remove("is-active")
      }, 5)
      
    }
  });
}

function xOffCanvasCloseOther(elementID) {
  if (null != xOffCanvasConfig(elementID).secondClose) {
    if ( document.querySelector(xOffCanvasConfig(elementID).secondClose) ) {
      document.querySelector(xOffCanvasConfig(elementID).secondClose).querySelector(".x-offcanvas_inner").setAttribute('inert', '')
    }
  }
}

function xOffCanvasMoveFocus(elementID) {
    setTimeout(function() {
    if ( null == xOffCanvasConfig(elementID).focus ) {
      document.getElementById(elementID).querySelector(".x-offcanvas_inner").focus();
    } else {
      document.getElementById(elementID).querySelector(".x-offcanvas_inner").querySelector(xOffCanvasConfig(elementID).focus).focus();
    }
  }, 0);
}

function xOffCanvasConfig(elementID, extraData = {}) {
  const element = document.getElementById(elementID)
  const configAttr = element.getAttribute('data-x-offcanvas')
  const elementConfig = configAttr ? JSON.parse(configAttr) : {}

  return elementConfig

}
    
document.addEventListener("DOMContentLoaded",function(e){

  if (!bricksIsFrontend) {
    return;
  }

  if ( document.querySelector('body > .brx-body.iframe') ) {
    return
 }

  const extrasOffCanvas = function ( container ) {

    const offcanvases = container.querySelectorAll(".x-offcanvas")
      
    offcanvases.forEach(offcanvas => {

      if ( '' === offcanvas.id ) {
        offcanvas.setAttribute('id','x-offcanvas_' + offcanvas.getAttribute('data-x-id'))
      }

      xOffCanvas(offcanvas, xOffCanvasConfig(offcanvas.id))

    })

  }

  extrasOffCanvas(document);

  // Expose function
  window.doExtrasOffCanvas = extrasOffCanvas;

  // Expose function
  window.xOpenOffCanvas = xOpenOffCanvas;
  window.xCloseOffCanvas = xCloseOffCanvas;


});