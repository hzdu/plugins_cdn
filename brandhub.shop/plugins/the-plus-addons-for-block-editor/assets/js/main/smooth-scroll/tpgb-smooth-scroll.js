document.addEventListener('DOMContentLoaded',()=>{
  tpsmScroll(document);
});

function tpsmScroll(doc){
  let smoothSc = doc.querySelectorAll('.tpgb-smooth-scroll');

  if(smoothSc){
    smoothSc.forEach(function (item) {
    var data = JSON.parse(item.getAttribute('data-scrollAttr'));
    if (!document.body.classList.contains("tpgb-smooth-scroll-tras")) {
      document.body.classList.add("tpgb-smooth-scroll-tras");
      var style = document.createElement('style');
      style.textContent = '.tpgb-smooth-scroll-tras .magic-scroll .parallax-scroll, .tpgb-smooth-scroll-tras .magic-scroll .scale-scroll, .tpgb-smooth-scroll-tras .magic-scroll .both-scroll {-webkit-transition: -webkit-transform 0s ease .0s;-ms-transition: -ms-transform 0s ease .0s;-moz-transition: -moz-transform 0s ease .0s;-o-transition: -o-transform 0s ease .0s;transition: transform 0s ease .0s;will-change: transform;}';
      document.head.appendChild(style);
    }
    if(data.responsive == 'yes'){
      let wWidth = window.innerWidth;
      if(wWidth > 800){
        if (!document.body.classList.contains("tpgb-smooth-scroll-tras")) {
          document.body.classList.add("tpgb-smooth-scroll-tras");
        }
        SmoothScroll({
          frameRate: data.frameRate,
          animationTime: data.animationTime,
          stepSize: data.stepSize,
          pulseAlgorithm: data.pulseAlgorithm,
          pulseScale: data.pulseScale,
          pulseNormalize: data.pulseNormalize,
          accelerationDelta: data.accelerationDelta,
          accelerationMax: data.accelerationMax,
          keyboardSupport: data.keyboardSupport,
          arrowScroll: data.arrowScroll,
          fixedBackground: data.fixedBackground,
          touchpadSupport: data.touchpadSupport
        });
      }else{
        if(document.body.classList.contains("tpgb-smooth-scroll-tras")){
          document.body.classList.remove("tpgb-smooth-scroll-tras");
        }
      }
    }else{
      SmoothScroll({
        frameRate: data.frameRate,
        animationTime: data.animationTime,
        stepSize: data.stepSize,
        pulseAlgorithm: data.pulseAlgorithm,
        pulseScale: data.pulseScale,
        pulseNormalize: data.pulseNormalize,
        accelerationDelta: data.accelerationDelta,
        accelerationMax: data.accelerationMax,
        keyboardSupport: data.keyboardSupport,
        arrowScroll: data.arrowScroll,
        fixedBackground: data.fixedBackground,
        touchpadSupport: data.touchpadSupport
      });
    }
  });
  }
}