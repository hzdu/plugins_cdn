function xBurgerTrigger(){

  if ( document.querySelector('body > .brx-body.iframe') ) {
    return
  }

  document.querySelectorAll('.brxe-xburgertrigger').forEach((burger) => {
    
    burger.setAttribute('aria-expanded', 'false')

    burger.addEventListener('click', toggleBurger)

    function closeBurger() {
      burger.setAttribute('aria-expanded', 'false')
      if ( burger.querySelector(".x-hamburger-box") ) {
        burger.querySelector(".x-hamburger-box").classList.remove("is-active")
      }
    }

    function openBurger() {
      burger.setAttribute('aria-expanded', 'true')
      if ( burger.querySelector(".x-hamburger-box") ) {
        burger.querySelector(".x-hamburger-box").classList.add("is-active")
      }
    }

    function toggleBurger() {

      if ('true' == burger.getAttribute('aria-expanded')) {
        closeBurger()
      } else {
        openBurger()
      }

    }

  });

}
    
document.addEventListener("DOMContentLoaded",function(e){
   bricksIsFrontend&&xBurgerTrigger()
});


