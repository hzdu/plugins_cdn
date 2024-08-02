document.addEventListener('DOMContentLoaded', () => {
  let allprelaoder = document.querySelectorAll('.tpgb-preloader');
  if(allprelaoder){
      allprelaoder.forEach((el)=>{
          let bodyClass = document.body.classList;
          let data = JSON.parse(el.getAttribute('data-plec')),
              post_load_opt = JSON.parse(el.getAttribute('post_load_opt')),
              post_load_exclude_class = data.post_load_exclude_class;
              if(post_load_opt === 'disablepostload'){
                  bodyClass.remove("tpgb-body-preloader");
              }
              let imgload = el.classList.contains('tpgb-img-loader');
             
              if(imgload){
                var wdthhgtimg = el.querySelector(".tpgb-img-loader .tpgb-preloader-logo-l-img"), 
                  heightimg = wdthhgtimg.clientHeight,
                  widthimg = wdthhgtimg.clientWidth;
                var imgLoaderWrap = el.querySelector(".tpgb-img-loader-wrap .tpgb-img-loader-wrap-in");
                  imgLoaderWrap.style.width = widthimg;
                  imgLoaderWrap.style.height = heightimg;
              }
              let bodyload = bodyClass.contains('tpgb-body-preloader');
              if(bodyload){
                  if(post_load_exclude_class != undefined && post_load_exclude_class !=''){
                      el.addEventListener('click', (e)=>{ //postclass add to postload class
                          var target = e.target;
                         
                          if (target.classList.contains(post_load_exclude_class) ||
                              (e.shiftKey || e.ctrlKey || e.metaKey || '_blank' === target.getAttribute('target').trim())) {
                          return;
                          }
                          
                          bodyClass.remove('tpgb-loaded');
                          bodyClass.add('tpgb-out-loaded');

                          if (bodyClass.contains('tpgb-out-loaded')) {
                            
                              var tpgbPreloader = document.querySelector('body.tpgb-out-loaded .tpgb-preloader.tpgb-preload-transion4');
                              if (tpgbPreloader) {
                                  tpgbPreloader.querySelector('.tpgb-preload-reveal-layer-box').style.transform = '';
                              
                                  var transform, direction='';
                                  var topBtmLeftRght = document.querySelector(".tpgb-out-loaded .tpgb-4-postload-topleft") || document.querySelector(".tpgb-out-loaded .tpgb-4-postload-topright") || document.querySelector(".tpgb-out-loaded .tpgb-4-postload-bottomleft") || document.querySelector(".tpgb-out-loaded .tpgb-4-postload-bottomright"),
                                  LeftRght = document.querySelector(".tpgb-out-loaded .tpgb-4-postload-left") || document.querySelector(".tpgb-4-postload-right"),
                                  topBottom = document.querySelector(".tpgb-out-loaded .tpgb-4-postload-top") || document.querySelector(".tpgb-out-loaded .tpgb-4-postload-bottom");

                                  if(topBtmLeftRght){
                                      var winsize = {width: window.innerWidth, height: window.innerHeight};
                                      var crosswh = Math.sqrt(Math.pow(winsize.width, 2) + Math.pow(winsize.height, 2));

                                      var topLeft = document.querySelector(".tpgb-out-loaded .tpgb-4-postload-topleft"),
                                          topRight = document.querySelector(".tpgb-out-loaded .tpgb-4-postload-topright"),
                                          btmLeft = document.querySelector(".tpgb-out-loaded .tpgb-4-postload-bottomleft"),
                                          btmRigt = document.querySelector(".tpgb-out-loaded .tpgb-4-postload-bottomright");

                                      if(topLeft) {
                                          transform = 'translate3d(-50%,-50%,0) rotate3d(0,0,1,135deg) translate3d(0,' + crosswh + 'px,0)';
                                      }else if(topRight) {
                                          transform = 'translate3d(-50%,-50%,0) rotate3d(0,0,1,-135deg) translate3d(0,' + crosswh + 'px,0)';
                                      }else if(btmLeft) {
                                          transform = 'translate3d(-50%,-50%,0) rotate3d(0,0,1,45deg) translate3d(0,' + crosswh + 'px,0)';
                                      }else if(btmRigt) {
                                          transform = 'translate3d(-50%,-50%,0) rotate3d(0,0,1,-45deg) translate3d(0,' + crosswh + 'px,0)';
                                      }
                                  }else if(LeftRght){
                                      direction='right';
                                      var topPostLeft = document.querySelector(".tpgb-out-loaded .tpgb-4-postload-left");
                                      if(topPostLeft){
                                          direction='left';
                                      }
                                      transform = 'translate3d(-50%,-50%,0) rotate3d(0,0,1,' + (direction === 'left' ? 90 : -90) + 'deg) translate3d(0,100%,0)';
                                  }else if(topBottom){
                                      direction='bottom';
                                      var topPostTop = document.querySelector(".tpgb-out-loaded .tpgb-4-postload-top");
                                      if(topPostTop){
                                          direction='top';
                                      }
                                      transform = direction === 'top' ? 'rotate3d(0,0,1,180deg)' : 'none';
                                  }
                                  var PostTopLftRgtBtm = document.querySelector(".tpgb-out-loaded .tpgb-4-postload-topleft") || document.querySelector(".tpgb-out-loaded .tpgb-4-postload-topright") || document.querySelector(".tpgb-out-loaded .tpgb-4-postload-bottomleft") || document.querySelector(".tpgb-out-loaded .tpgb-4-postload-bottomright") || document.querySelector(".tpgb-out-loaded .tpgb-4-postload-left") || document.querySelector(".tpgb-out-loaded .tpgb-4-postload-right") || document.querySelector(".tpgb-out-loaded .tpgb-4-postload-top") || document.querySelector(".tpgb-out-loaded .tpgb-4-postload-bottom"); 
                                  if(PostTopLftRgtBtm){
                                      document.querySelector(".tpgb-out-loaded .tpgb-preloader .tpgb-preload-reveal-layer-box").style.transform = transform,
                                      document.querySelector(".tpgb-out-loaded .tpgb-preloader .tpgb-preload-reveal-layer-box").style.webkitTransform = transform; 
                                  }
                              }
                          }
                      })
                  }else {
                    let notinclude = document.querySelectorAll('a:not(.coupon-btn-link,.ajax_add_to_cart,.button-toggle-link,.noajax,.post-load-more,.slick-slide, .woocommerce a, .btn, .button,[data-slick-index],[data-month], .popup-gallery, .popup-video, [href$=".png"], [href$=".jpg"], [href$=".jpeg"], [href$=".svg"], [href$=".mp4"], [href$=".webm"], [href$=".ogg"], [href$=".mp3"], [href^="#"],[href*="#"], [href^="mailto:"],[data-lity=""], [href=""], [href*="wp-login"], [href*="wp-admin"], .dot-nav-noajax, .pix-dropdown-arrow,[data-toggle="dropdown"],[role="tab"], .tpgb-fancy-popup),button:not(.subscribe-btn-submit,.lity-close,[type="button"],.single_add_to_cart_button,.pswp__button.pswp__button--close,.pswp__button--fs,.pswp__button--zoom,.pswp__button--arrow--left,.pswp__button--arrow--right, .splide__arrow)');
                   
                    if(notinclude){
                      notinclude.forEach((nI) =>{
                        nI.addEventListener("click", function(e) {
                          var excludedClasses = [
                            "coupon-btn-link",
                            "tpgb-unfold-toggle",
                            "share-btn",
                            "ajax_add_to_cart",
                            "button-toggle-link",
                            "noajax",
                            "post-load-more",
                            "slick-slide",
                            "woocommerce a",
                            "btn",
                            "button",
                            "[data-slick-index]",
                            "[data-month]",
                            ".popup-gallery",
                            ".popup-video",
                            "[href$='.png']",
                            "[href$='.jpg']",
                            "[href$='.jpeg']",
                            "[href$='.svg']",
                            "[href$='.mp4']",
                            "[href$='.webm']",
                            "[href$='.ogg']",
                            "[href$='.mp3']",
                            "[href^='#']",
                            "[href*='#']",
                            "[href^='mailto:']",
                            "[data-lity='']",
                            "[href='']",
                            "[href*='wp-login']",
                            "[href*='wp-admin']",
                            ".dot-nav-noajax",
                            ".pix-dropdown-arrow",
                            "[data-toggle='dropdown']",
                            "[role='tab']"
                          ];
                          
                          var target = e.target;
                          var hasExcludedClass = false;
                          
                          for (var i = 0; i < excludedClasses.length; i++) {
                            if (target.matches(excludedClasses[i])) {
                              hasExcludedClass = true;
                              break;
                            }
                          }
                          if (target.getAttribute('target')){
                            if (hasExcludedClass || e.shiftKey || e.ctrlKey || e.metaKey || '_blank' === target.getAttribute('target').trim()) {
                              return;
                            }
                          }
                          
                          bodyClass.remove('tpgb-loaded');
                          bodyClass.add('tpgb-out-loaded');
                          
                          var tpgbPreloader = document.querySelector('.tpgb-preloader.tpgb-preload-transion4');
                            if (tpgbPreloader) {
                                tpgbPreloader.querySelector('.tpgb-preload-reveal-layer-box').style.transform = '';
                                var transform = '';
                                var direction = '';

                                var topleftload = document.querySelector('.tpgb-out-loaded .tpgb-4-postload-topleft'),
                                    topRightload = document.querySelector('.tpgb-out-loaded .tpgb-4-postload-topright'),
                                    bottomleftload = document.querySelector('.tpgb-out-loaded .tpgb-4-postload-bottomleft'),
                                    bottomrightload = document.querySelector('.tpgb-out-loaded .tpgb-4-postload-bottomright'),
                                    postloadleft = document.querySelector('.tpgb-out-loaded .tpgb-4-postload-left'),
                                    postloadright = document.querySelector('.tpgb-4-postload-right'),
                                    postloadtop = document.querySelector('.tpgb-out-loaded .tpgb-4-postload-top'),
                                    postloadbottom = document.querySelector('.tpgb-out-loaded .tpgb-4-postload-bottom');
                                
                                if (topleftload || topRightload || bottomleftload || bottomrightload) {
                                var winsize = { width: window.innerWidth, height: window.innerHeight };
                                var crosswh = Math.sqrt(Math.pow(winsize.width, 2) + Math.pow(winsize.height, 2));
                                
                                  if (topleftload) {
                                      transform = 'translate3d(-50%,-50%,0) rotate3d(0,0,1,135deg) translate3d(0,' + crosswh + 'px,0)';
                                  } else if (topRightload) {
                                      transform = 'translate3d(-50%,-50%,0) rotate3d(0,0,1,-135deg) translate3d(0,' + crosswh + 'px,0)';
                                  } else if (bottomleftload) {
                                      transform = 'translate3d(-50%,-50%,0) rotate3d(0,0,1,45deg) translate3d(0,' + crosswh + 'px,0)';
                                  } else if (bottomrightload) {
                                      transform = 'translate3d(-50%,-50%,0) rotate3d(0,0,1,-45deg) translate3d(0,' + crosswh + 'px,0)';
                                  }
                                }else if (postloadleft || postloadright) {
                                direction = 'right';
                                if (postloadleft) {
                                  direction = 'left';
                                }
                                transform = 'translate3d(-50%,-50%,0) rotate3d(0,0,1,' + (direction === 'left' ? 90 : -90) + 'deg) translate3d(0,100%,0)';
                                } else if (postloadtop || postloadbottom) {
                                direction = 'bottom';
                                if (postloadtop) {
                                    direction = 'top';
                                }
                                transform = direction === 'top' ? 'rotate3d(0,0,1,180deg)' : 'none';
                                }
                                
                                if (transform) {
                                  tpgbPreloader.querySelector('.tpgb-preload-reveal-layer-box').style.transform = transform;
                                  tpgbPreloader.querySelector('.tpgb-preload-reveal-layer-box').style.webkitTransform = transform;
                                }
                            }
                        });
                      })
                    }
                      
                  }
              }
      })
  }
});

window.addEventListener('load', function() {
var width = 100;
var performancedata = window.performance.timing;
var estimatedloadtime = -(performancedata.loadEventEnd - performancedata.navigationStart);
var time = parseInt((estimatedloadtime / 1000) % 60) * 100;

var containerload = document.querySelector('.tpgb-preloader');
if (containerload) {
var data = containerload.dataset.plec;
var loadtime = data['loadtime'];
var loadmaxtime = data['loadmaxtime'];
var loadmintime = data['loadmintime'];
var csttimemax1000 = loadmaxtime * 1000;
var csttimemin1000 = loadmintime * 1000;

if (csttimemax1000 !== undefined && csttimemax1000 < time && loadtime !== undefined && loadtime === 'loadtimemax') {
  time = csttimemax1000;
}

if (csttimemin1000 !== undefined && csttimemin1000 > time && loadtime !== undefined && loadtime === 'loadtimemin') {
  time = csttimemin1000;
}
}


if (width > 1) {
  var elements = document.querySelectorAll('.tpgb-percentage');
  elements.forEach(function(element) {
    element.classList.add('tpgb-percentage-load');
  });
}


var tp_preloader = 'tpgb-progress-loader';
var tp_loadbar = 'tpgb-loadbar';
var tp_percentagelayout = 'percentagelayout';
var tp_plcper = 'layout-';
var tp_logo_width = 'tpgb-preloader .tpgb-img-loader-wrap';
var tp_text_loader = 'tpgb-preloader .tpgb-text-loader .tpgb-text-loader-inner';
var tp_pre_5 = 'tpgb-pre-5-in';

if (document.querySelector("." + tp_loadbar) || document.querySelector("." + tp_percentagelayout) || document.querySelector("." + tp_preloader + "4-in") || document.querySelector("." + tp_preloader + "5." + tp_plcper + "5 ." + tp_pre_5 + "3") || document.querySelector("." + tp_preloader + "5." + tp_plcper + "5 ." + tp_pre_5 + "4") || document.querySelector("." + tp_logo_width) || document.querySelector("." + tp_text_loader)) {
animateElementWidth("." + tp_loadbar + ", ." + tp_percentagelayout + ", ." + tp_preloader + "4-in, ." + tp_preloader + "5." + tp_plcper + "5 ." + tp_pre_5 + "3, ." + tp_preloader + "5." + tp_plcper + "5 ." + tp_pre_5 + "4, ." + tp_logo_width + ", ." + tp_text_loader, width, time);
}

if (document.querySelector("." + tp_preloader + "5." + tp_plcper + "5 ." + tp_pre_5 + "1") || document.querySelector("." + tp_preloader + "5." + tp_plcper + "5 ." + tp_pre_5 + "2")) {
animateElementHeight("." + tp_preloader + "5." + tp_plcper + "5 ." + tp_pre_5 + "1, ." + tp_preloader + "5." + tp_plcper + "5 ." + tp_pre_5 + "2", width, time);
}

function animateElementWidth(selector, width, time) {
  var elements = document.querySelectorAll(selector);
  var step = width / time * 10;
  var currentWidth = 0;

  var interval = setInterval(function() {
    if (currentWidth >= width) {
      clearInterval(interval);
    } else {
      currentWidth += step;
      elements.forEach(function(element) {
        element.style.width = currentWidth + "%";
      });
    }
  }, 10);
}

function animateElementHeight(selector, height, time) {
  var elements = document.querySelectorAll(selector);
  var step = height / time * 10;
  var currentHeight = 0;

  var interval = setInterval(function() {
    if (currentHeight >= height) {
      clearInterval(interval);
    } else {
      currentHeight += step;
      elements.forEach(function(element) {
        element.style.height = currentHeight + "%";
      });
    }
  }, 10);
}

var percwrap = document.querySelectorAll(".tpgb-precent, .tpgb-precent3, .tpgb-precent4");

var start = 0;
var end = 100;
var duration = time;

if (percwrap) {
animationOutput(percwrap, start, end, duration);
}

function animationOutput(elements, start, end, duration) {
  var range = end - start;
  var current = start;
  var increment = end > start ? 1 : -1;
  var stepfortime = Math.abs(Math.floor(duration / range));

  elements.forEach(function(element) {
    var obj = element;
    var timer = setInterval(function() {
      current += increment;
      obj.textContent = current + "%";
      setProgress(current);
      if (current === end) {
        clearInterval(timer);
      }
    }, stepfortime);
  });
}

var circle = document.querySelector('.progress-ring1');
if (circle) {
var radius = circle.r.baseVal.value;
var circumference = radius * 2 * Math.PI;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = `${circumference}`;
}

function setProgress(percent) {
if (circle) {
  var offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
}
}

setTimeout(function() {
  var body = document.querySelector('body');
  body.classList.add('tpgb-loaded');

  var tpgbPreloader = body.querySelector('.tpgb-preloader');
  if(tpgbPreloader){
    if (tpgbPreloader.classList.contains('tpgb-preload-transion4')) {
      setTimeout(function() {
        tpgbPreloader.classList.add('tpprein');
        tpgbPreloader.classList.add('tppreinout');
        setTimeout(function() {
          tpgbPreloader.classList.remove('tpprein');
          tpgbPreloader.classList.add('tppreout');
        }, 1500);
      }, 20);
    }
  }
  var elementsToFadeOut = document.querySelectorAll('.tpgb-progress-loader, .percentagelayout, .tpgb-progress-loader4.layout-4, .tpgb-progress-loader6');
  elementsToFadeOut.forEach(function(element) {
    element.style.transition = 'opacity 0.3s';
    element.style.opacity = '0'; 
  });
}, time + 1000);
});