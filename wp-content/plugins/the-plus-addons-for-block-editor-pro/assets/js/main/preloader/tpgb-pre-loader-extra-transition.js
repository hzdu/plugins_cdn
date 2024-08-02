document.addEventListener('DOMContentLoaded', function() {
    var widthVal, heightVal, transform, direction = '';

    var topLeft = document.querySelector(".tpgb-4-preload-topleft"),
        topRight = document.querySelector(".tpgb-4-preload-topright"),
        bottomleft = document.querySelector(".tpgb-4-preload-bottomleft"),
        bottomright = document.querySelector(".tpgb-4-preload-bottomright"),
        left = document.querySelector(".tpgb-4-preload-left"),
        right = document.querySelector(".tpgb-4-preload-right"),
        top = document.querySelector(".tpgb-4-preload-top"),
        bottom = document.querySelector(".tpgb-4-preload-bottom");

    if (topLeft || topRight || bottomleft || bottomright) {
      var winsize = {width: window.innerWidth, height: window.innerHeight};
      var crosswh = Math.sqrt(Math.pow(winsize.width, 2) + Math.pow(winsize.height, 2));
      widthVal = heightVal = crosswh + 'px';
  
      if (topLeft) {
        transform = 'translate3d(-50%,-50%,0) rotate3d(0,0,1,135deg) translate3d(0,' + crosswh + 'px,0)';
      } else if (topRight) {
        transform = 'translate3d(-50%,-50%,0) rotate3d(0,0,1,-135deg) translate3d(0,' + crosswh + 'px,0)';
      } else if (bottomleft) {
        transform = 'translate3d(-50%,-50%,0) rotate3d(0,0,1,45deg) translate3d(0,' + crosswh + 'px,0)';
      } else if (bottomright) {
        transform = 'translate3d(-50%,-50%,0) rotate3d(0,0,1,-45deg) translate3d(0,' + crosswh + 'px,0)';
      }
    }else if (left || right) {
      widthVal = '100vh';
      heightVal = '100vw';
      direction = 'right';
      if (left) {
        direction = 'left';
      }
      transform = 'translate3d(-50%,-50%,0) rotate3d(0,0,1,' + (direction === 'left' ? 90 : -90) + 'deg) translate3d(0,100%,0)';
    }else if (top || bottom) {
      widthVal = '100vw';
      heightVal = '100vh';
      direction = 'bottom';
      if (top) {
        direction = 'top';
      }
      transform = direction === 'top' ? 'rotate3d(0,0,1,180deg)' : 'none';
    }
  
    if (topLeft || topRight || bottomleft || bottomright || left || right || top || bottom) {
      var preloaderBox = document.querySelector(".tpgb-preloader .tpgb-preload-reveal-layer-box");
      preloaderBox.style.cssText = `width:${widthVal};height:${heightVal};transform:${transform};webkitTransform:${transform};opacity:1`;
    }

  });