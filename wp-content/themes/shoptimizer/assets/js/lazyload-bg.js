document.addEventListener("DOMContentLoaded", function() {
  var lazyBackgrounds = [].slice.call(document.querySelectorAll(".lazy-background"));

  if ("IntersectionObserver" in window) {
    let lazyBackgroundObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          lazyBackgroundObserver.unobserve(entry.target);
        }
      });
    });

    lazyBackgrounds.forEach(function(lazyBackground) {
      lazyBackgroundObserver.observe(lazyBackground);
    });
  } else {

    // For older browsers lacking IntersectionObserver support.
    // See https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video/
    let active = false;

    const lazyLoadbg = function() {
      if ( false === active ) {
        active = true;

        setTimeout( function() {
          lazyBackgrounds.forEach( function( lazyBackground ) {
            if ( ( lazyBackground.getBoundingClientRect().top <= window.innerHeight &&  0 <= lazyBackground.getBoundingClientRect().bottom ) && 'none' !== getComputedStyle( lazyBackground ).display ) {
              
              lazyBackground.classList.add("visible");

              lazyBackgrounds = lazyBackgrounds.filter( function( image ) {
                return image !== lazyBackgrounds;
              });

              if ( 0 === lazyBackgrounds.length ) {
                document.removeEventListener( 'scroll', lazyLoadbg );
                window.removeEventListener( 'resize', lazyLoadbg );
                window.removeEventListener( 'orientationchange', lazyLoadbg );
              }
            }
          });

          active = false;
        }, 200 );
      }
    };

    document.addEventListener( 'scroll', lazyLoadbg );
    window.addEventListener( 'resize', lazyLoadbg );
    window.addEventListener( 'orientationchange', lazyLoadbg );

  }
});