/**
 * Tooltip.
 *
 * @package fwdevp
 * @since fwdevp 1.0
 */

(function($){

  'use strict';
  
  $.fn.fwdTooltip = function(obj){
    
    var content = obj.content;
    var tooltipClass = obj.tooltipClass;
    var to;
  
    $(this).hover(function(e){
      var title = $(this).attr('title');
      if(!title && !content) return;
     
      $(this).data('toolTipText', title).removeAttr('title');
      var el1 = document.createElement('div');
      el1.className = 'fwd-tooltip';
      var el2 = document.createElement('div');
      var el3 = document.createElement('div');
      el3.className = 'fwd-pointer';

      el2.className = 'fwd-tooltip-in';
      if(tooltipClass){
        el2.className = 'fwd-tooltip-in ' + tooltipClass;
      }

      el1.appendChild(el2);

      if(content){
          el2.innerHTML = content;
      }else{
          el2.innerHTML = title;
      }
      el2.appendChild(el3);

      document.documentElement.appendChild(el1);

      var cursorX = e.pageX;
      var cursorY = e.pageY;
      var wW = $(window).width();
      var wH = $(window).height();
      var tooltip = el1;

      var targetLeft = Math.round($(this)[0].getBoundingClientRect().x);
      var targetTop = Math.round($(this)[0].getBoundingClientRect().y);
      $(this)[0].tooltip = tooltip;
      var targetW = $(this).width();
      var targetH =  $(this).height();
      var ttW = tooltip.offsetWidth;
      var ttH = tooltip.offsetHeight;
      var pTop = targetTop - ttH;
      var pLeft = Math.round(targetLeft - (ttW - targetW)/2);
     
      var pintOffset = 0;
      
      if(pLeft < 20){
          pintOffset = pLeft - 20;
          pLeft = 20;
      }else if(pLeft + ttW + 20 > wW){
          pintOffset = pLeft - (wW - ttW - 20);
          pLeft = wW - ttW - 20;
      }

      var pintLeft = Math.round((ttW - el3.offsetWidth)/2) + pintOffset;
      var pintCss;
      if(pTop <= 20){
          pTop = targetTop + targetH;
          pintCss = {left:pintLeft + 'px', bottom:'calc(100% - 4px)'};
          $('.fwd-tooltip-in').addClass('top');
      }else{
          pintCss = {left:pintLeft + 'px'}
      }
      
      $('.fwd-tooltip').css({top: pTop + 'px', left:pLeft + 'px'});
      $('.fwd-pointer').css(pintCss);

  }, function(e){
        $(this).attr('title', $(this).data('toolTipText'));
        $('.fwd-tooltip').remove();
      });
  };
}(jQuery));