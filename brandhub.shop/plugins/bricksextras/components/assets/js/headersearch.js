function xHeaderSearch(){

  if ( document.querySelector('body > .brx-body.iframe') ) {
    return
  }

  document.querySelectorAll('.brxe-xheadersearch').forEach((headerSearch) => {

    if ( headerSearch.querySelector('.x-header-search_toggle-open') ) {
      headerSearch.querySelector('.x-header-search_toggle-open').addEventListener('click', toggleSearch)
    }

    if ( headerSearch.querySelector('.x-header-search_toggle-close') ) {
      headerSearch.querySelector('.x-header-search_toggle-close').addEventListener('click', toggleSearch)
    }

    function toggleSearch(e) {

      e.preventDefault()

      if ( 'false' === headerSearch.querySelector('[class^="x-header-search_toggle"]').getAttribute('aria-expanded') ) {
        openSearch()
      } else {
        closeSearch()
      }

    }

    function openSearch() {
      headerSearch.querySelectorAll('[class^="x-header-search_toggle"]').forEach((headerSearchToggle) => {
        headerSearchToggle.setAttribute('aria-expanded', 'true')
      })
      setTimeout(function() {
        headerSearch.querySelector('input[type=search').focus();
      }, 100);
      
    }

    function closeSearch() {
      headerSearch.querySelectorAll('[class^="x-header-search_toggle"]').forEach((headerSearchToggle) => {
        headerSearchToggle.setAttribute('aria-expanded', 'false')
      })
    }

    document.addEventListener('keydown', function(e) {
      if((e.key === "Escape" || e.key === "Esc")){
        closeSearch()
      }
    });

  });

}
    
document.addEventListener("DOMContentLoaded",function(e){
   bricksIsFrontend&&xHeaderSearch()
});


