function xSlideMenu(){

    let extrasSlideMenu = function ( container ) {

      container.querySelectorAll('.brxe-xslidemenu').forEach( slideMenu => {

          const configAttr = slideMenu.getAttribute('data-x-slide-menu')
          const elementConfig = configAttr ? JSON.parse(configAttr) : {}

          let speedAnimation = elementConfig.slideDuration;

          /* add icons */
          slideMenu.querySelectorAll('.menu-item-has-children > a').forEach( menuHasChildren => {

            if ( menuHasChildren.querySelector('.x-slide-menu_dropdown-icon') ) {
              menuHasChildren.querySelector('.x-slide-menu_dropdown-icon').remove()
            }

              var btn = document.createElement("button");
                  btn.setAttribute("aria-expanded", "false");
                  btn.setAttribute("class", "x-slide-menu_dropdown-icon");
                  btn.setAttribute("aria-label", elementConfig.subMenuAriaLabel);

              menuHasChildren.append(btn)

              btn.innerHTML += '<svg class="x-slide-menu_dropdown-icon-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/>'
          
              btn.addEventListener('click', toggleSubMenu);
              
          
              function toggleSubMenu(e) {
                  e.preventDefault()
                  e.stopPropagation()
      
                  let parent = this.closest(".menu-item-has-children");
                  
                  this.setAttribute("aria-expanded", "true" === this.getAttribute("aria-expanded") ? "false" : "true" );
                  
                  if (typeof jQuery === 'undefined') {
                    parent.lastElementChild.xslideToggle(speedAnimation)
                  } else {
                    jQuery(parent.lastElementChild).slideToggle( parseInt(elementConfig.slideDuration) )
                  }
                  
      
                  let allSiblings = Array.from(parent.parentElement.children).filter(sibling => sibling.textContent !== parent.textContent);
      
                  allSiblings.forEach( dropDownSibling => {
      
                      if (dropDownSibling.classList.contains('menu-item-has-children') ){
                        
                          if (typeof jQuery === 'undefined') {
                            dropDownSibling.lastElementChild.xslideUp(speedAnimation)
                          } else {
                            jQuery(dropDownSibling.lastElementChild).slideUp( parseInt(elementConfig.slideDuration) )
                          }
      
                          dropDownSibling.children[0].lastElementChild.setAttribute("aria-expanded", "false")
                      }
      
                  })
      
              }

          })

          slideMenu.querySelectorAll('.menu-item-has-children > a[href*="#"]').forEach( menuHashLink => {

              menuHashLink.addEventListener('click', function(e) {

                  e.preventDefault()
                  e.stopPropagation()

                  menuHashLink.querySelector('.x-slide-menu_dropdown-icon').click()

          })

        })

          if (null != elementConfig.clickSelector && document.querySelectorAll(elementConfig.clickSelector).length) {

              document.querySelectorAll(elementConfig.clickSelector).forEach(trigger => {

                      trigger.addEventListener('click', function(e) {

                        e.preventDefault()
                        e.stopPropagation()

                        if (typeof jQuery === 'undefined') {
                          slideMenu.xslideToggle(speedAnimation)
                        } else {
                          jQuery(slideMenu).slideToggle( parseInt(elementConfig.slideDuration) )
                        }

                    })

              })
      
          }

    })  

  }

  extrasSlideMenu(document);
                
  // Expose function
  window.doExtrasSlideMenu = extrasSlideMenu;

}

document.addEventListener("DOMContentLoaded",function(e){
    bricksIsFrontend&&xSlideMenu()
})