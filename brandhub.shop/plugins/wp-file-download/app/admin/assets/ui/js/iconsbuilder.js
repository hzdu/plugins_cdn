/* Load Toastr */
("function"==typeof define&&define.amd?define:function(e,t){"undefined"!=typeof module&&module.exports?module.exports=t(require("jquery")):window.toastr=t(window.jQuery)})(["jquery"],function(e){return function(){function t(t,n){return t||(t=a()),(l=e("#"+t.containerId)).length?l:(n&&(l=function(t){return(l=e("<div/>").attr("id",t.containerId).addClass(t.positionClass)).appendTo(e(t.target)),l}(t)),l)}function n(t){for(var n=l.children(),o=n.length-1;o>=0;o--)s(e(n[o]),t)}function s(t,n,s){var o=!(!s||!s.force)&&s.force;return!(!t||!o&&0!==e(":focus",t).length||(t[n.hideMethod]({duration:n.hideDuration,easing:n.hideEasing,complete:function(){r(t)}}),0))}function o(e){c&&c(e)}function i(n){function s(e){return null==e&&(e=""),e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function i(t){var n=t&&!1!==m.closeMethod?m.closeMethod:m.hideMethod,s=t&&!1!==m.closeDuration?m.closeDuration:m.hideDuration,i=t&&!1!==m.closeEasing?m.closeEasing:m.hideEasing;if(!e(":focus",v).length||t)return clearTimeout(b.intervalId),v[n]({duration:s,easing:i,complete:function(){r(v),clearTimeout(h),m.onHidden&&"hidden"!==D.state&&m.onHidden(),D.state="hidden",D.endTime=new Date,o(D)}})}function c(){(m.timeOut>0||m.extendedTimeOut>0)&&(h=setTimeout(i,m.extendedTimeOut),b.maxHideTime=parseFloat(m.extendedTimeOut),b.hideEta=(new Date).getTime()+b.maxHideTime)}function p(){clearTimeout(h),b.hideEta=0,v.stop(!0,!0)[m.showMethod]({duration:m.showDuration,easing:m.showEasing})}function g(){var e=(b.hideEta-(new Date).getTime())/b.maxHideTime*100;T.width(e+"%")}var m=a(),f=n.iconClass||m.iconClass;if(void 0!==n.optionsOverride&&(m=e.extend(m,n.optionsOverride),f=n.optionsOverride.iconClass||f),!function(e,t){if(e.preventDuplicates){if(t.message===d)return!0;d=t.message}return!1}(m,n)){u++,l=t(m,!0);var h=null,v=e("<div/>"),C=e("<div/>"),w=e("<div/>"),T=e("<div/>"),O=e(m.closeHtml),b={intervalId:null,hideEta:null,maxHideTime:null},D={toastId:u,state:"visible",startTime:new Date,options:m,map:n};return n.iconClass&&v.addClass(m.toastClass).addClass(f),function(){if(n.title){var e=n.title;m.escapeHtml&&(e=s(n.title)),C.append(e).addClass(m.titleClass),v.append(C)}}(),function(){if(n.message){var e=n.message;m.escapeHtml&&(e=s(n.message)),w.append(e).addClass(m.messageClass),v.append(w)}}(),m.closeButton&&(O.addClass(m.closeClass).attr("role","button"),v.prepend(O)),m.progressBar&&(T.addClass(m.progressClass),v.prepend(T)),m.rtl&&v.addClass("rtl"),m.newestOnTop?l.prepend(v):l.append(v),function(){var e="";switch(n.iconClass){case"toast-success":case"toast-info":e="polite";break;default:e="assertive"}v.attr("aria-live",e)}(),v.hide(),v[m.showMethod]({duration:m.showDuration,easing:m.showEasing,complete:m.onShown}),m.timeOut>0&&(h=setTimeout(i,m.timeOut),b.maxHideTime=parseFloat(m.timeOut),b.hideEta=(new Date).getTime()+b.maxHideTime,m.progressBar&&(b.intervalId=setInterval(g,10))),m.closeOnHover&&v.hover(p,c),!m.onclick&&m.tapToDismiss&&v.click(i),m.closeButton&&O&&O.click(function(e){e.stopPropagation?e.stopPropagation():void 0!==e.cancelBubble&&!0!==e.cancelBubble&&(e.cancelBubble=!0),m.onCloseClick&&m.onCloseClick(e),i(!0)}),m.onclick&&v.click(function(e){m.onclick(e),i()}),o(D),m.debug&&console&&console.log(D),v}}function a(){return e.extend({},{tapToDismiss:!0,toastClass:"toast",containerId:"toast-container",debug:!1,showMethod:"fadeIn",showDuration:300,showEasing:"swing",onShown:void 0,hideMethod:"fadeOut",hideDuration:1e3,hideEasing:"swing",onHidden:void 0,closeMethod:!1,closeDuration:!1,closeEasing:!1,closeOnHover:!0,extendedTimeOut:1e3,iconClasses:{error:"toast-error",info:"toast-info",success:"toast-success",warning:"toast-warning"},iconClass:"toast-info",positionClass:"toast-top-right",timeOut:5e3,titleClass:"toast-title",messageClass:"toast-message",escapeHtml:!1,target:"body",closeHtml:'<button type="button">&times;</button>',closeClass:"toast-close-button",newestOnTop:!0,preventDuplicates:!1,progressBar:!1,progressClass:"toast-progress",rtl:!1},g.options)}function r(e){l||(l=t()),e.is(":visible")||(e.remove(),e=null,0===l.children().length&&(l.remove(),d=void 0))}var l,c,d,u=0,p={error:"error",info:"info",success:"success",warning:"warning"},g={clear:function(e,o){var i=a();l||t(i),s(e,i,o)||n(i)},remove:function(n){var s=a();return l||t(s),n&&0===e(":focus",n).length?void r(n):void(l.children().length&&l.remove())},error:function(e,t,n){return i({type:p.error,iconClass:a().iconClasses.error,message:e,optionsOverride:n,title:t})},getContainer:t,info:function(e,t,n){return i({type:p.info,iconClass:a().iconClasses.info,message:e,optionsOverride:n,title:t})},options:{},subscribe:function(e){c=e},success:function(e,t,n){return i({type:p.success,iconClass:a().iconClasses.success,message:e,optionsOverride:n,title:t})},version:"2.1.4",warning:function(e,t,n){return i({type:p.warning,iconClass:a().iconClasses.warning,message:e,optionsOverride:n,title:t})}};return g}()});

(function ($) {
  // Extend jquery helper functions
  $.fn.extend({
    toggleText: function (a, b) {
      return this.text(this.text() == b ? a : b);
    },
    outerHTML: function () {
      return (this[0]) ? this[0].outerHTML : '';
    },
    measure: function (fn) {
      var el = $(this).clone(false);
      el.css({
        visibility: 'hidden',
        position: 'absolute'
      });
      el.appendTo('body');
      var result = fn.apply(el);
      el.remove();
      return result;
    }
  });

  var _wpfd_text = function (text) {
    if (typeof (l10n) !== 'undefined') {
      return l10n[text];
    }
    return text;
  };
  var wpfd_icons_ultilities = {
    interval: null,
    svg: '<svg class="preview-svg" width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" version="1.1">\n' +
      '        <g id="iconBackground" transform="translate(100 15)" style="color: {border-color};stroke-width: {border-size}">\n' +
      '            <rect width="400" height="400" stroke="currentColor" stroke-linecap="round" fill="{background-color}" rx="{border-radius}%"/>\n' +
      '        </g>\n' +
      '        <g id="iconFrame" transform="translate(100 15)" style="color: {frame-color};stroke-width: {frame-stroke}px;">\n' +
      '            {frame-place-holder}\n' +
      '        </g>\n' +
      '        <g id="iconIcon" transform="translate(220 81)" style="color: {icon-color}">\n' +
      '            {icon-place-holder}\n' +
      '        </g>\n' +
      '        <g id="iconText" transform="translate(300 405)" style="color: {text-color};font-size: {font-size}px;font-family: {font-family};text-transform: uppercase;">\n' +
      '            <text id="iconText" x="0" y="0" fill="currentColor" dominant-baseline="middle" text-anchor="middle">{icon-text}</text>\n' +
      '        </g>\n' +
      '    </svg>',
    svg_icon_params: {},
    source: null,
    init: function (source) {
      var $source = $(source);
      this.source = $source;
      // Init switch
      // Range slider init
      $('input[data-rangeslider]', $source).rangeslider({
        polyfill: false,
        onInit: function () {
          // this.output = $('<div class="range-output" />').insertAfter(this.$range).html(this.$element.val());
          this.output = this.$element.parent().find('input[data-rangeslider-number]').val(this.$element.val());
        },
        onSlide: function (position, value) {
          this.output.val(value);
        },
      });
      $($source)
        .on('change', '.ju-switch-button .switch input[type="checkbox"]', this.switch)
        .on('input change', 'form.wpfd_icon_params_form input, form.wpfd_icon_params_form select, form.wpfd_global_icon_params_form input, form.wpfd_global_icon_params_form select', {source: $source}, this.iconParamsChanged)
        .on('change', 'input[data-rangeslider-number]', function (e) {
          var $inputRange = $('[data-rangeslider]', e.target.parentNode);
          var value = $('input[type="number"]', e.target.parentNode)[0].value;
          $inputRange.val(value).change();
        })
        .on('click', '.js-saveSetting-trigger', {source: $source}, this.saveSettings)
        .on('click', '.js-rebuildIcons-trigger', {source: $source}, this.saveSettings)
        .on('click', '.js-restoreIcons-trigger', {source: $source}, this.restoreIcons);


      // Minicolors init
      $('.minicolors', $source).minicolors({
        position: "bottom right",
        format: 'hex',
        change: function (value, opacity) {
        }
      });
      // Collapsed init
      var collapseItems = $('.wpfd-collapse', $source);
      if (collapseItems.length) {
        collapseItems.each(function (index, item) {
          $('.wpfd-collapse--icon', item).on('click', function (e) {
            if ($(item).hasClass('wpfd-card')) {
              $(e.target).parent().next().slideToggle();
            } else if ($(item).hasClass('wpfd-options-title')) {
              $(item).next().slideToggle();
            }
            $(this).toggleText('expand_more', 'expand_less');
          });
        });
      }
      // Change icon
      $('[data-icon-name]', $source).on('click', function (e) {
        var iconName = $(this).data('icon-name');
        var svgIconContent = $(this).html();
        $('[data-icon-name]', $source).removeClass('selected');
        $(this).addClass('selected');
        $('.svg-icon-selected > svg', $source).remove();
        $('.svg-icon-selected > img', $source).remove();
        $('.svg-icon-selected', $source).prepend($(svgIconContent));
        $('.svg-icon-selected > svg', $source).attr('width', '60');
        $('.svg-icon-selected > svg', $source).attr('height', '60');

        // Change icon input
        $('[name=icon]', $source).val(iconName).trigger('change');
      });
      // Frame change
      $($source).on('click', '.wpfd-frame-list li', function (e) {
        $('[name=svg-frame]', $source).val($(this).data('id'));
        $('.wpfd-frame-list li', $source).removeClass('selected');
        $(this).addClass('selected');

        // Change width
        $('[name="frame-width"]', $source).trigger('change');
      });
    },
    iconParamsChanged: function (e) {
      e.preventDefault();
      // Live update current icon using timeout
      wpfd_icons_ultilities.livePreview(e.data.source);

      return false;
    },
    saveSettings: function (e) {
      // Save and export current icon using timeout
      var currentParams = $('form.wpfd_icon_params_form', e.data.source).serializeArray();
      var allParams = $('form.wpfd_global_icon_params_form', e.data.source).serializeArray();
      var extension = $('.wpfd-icon--svg.selected', e.data.source).data('ext');
      var endpoint = 'saveicon';
      if ($(this).data('endpoint')) {
        endpoint = $(this).data('endpoint');
      }
      var iconParams = {},
        globalParams = {};
      currentParams.forEach(function (item, index) {
        iconParams[item.name] = item.value;
      });
      allParams.forEach(function (item, index) {
        globalParams[item.name] = item.value;
      });
      $.ajax({
        method: "POST",
        url: wpfdajaxurl + 'task=iconsbuilder.' + endpoint,
        data: {
          icon: btoa(JSON.stringify(iconParams)),
          global: btoa(JSON.stringify(globalParams)),
          extension: extension
        },
        success: function (res) {
          toastr["success"]("Icon settings saved!");
          // Update current Icon
          $('.wpfd-icon--svg.selected', e.data.source).data('icon-path', res.datas.url);
          $('.wpfd-icon--svg.selected', e.data.source).css('background-image', 'url(' + res.datas.url + "?timestamp=" + new Date().getTime() + ')');
          // Update all icons if set
          if (typeof res.datas.icons !== "undefined") {
            Object.keys(res.datas.icons).forEach(function (key, index) {
              $('.wpfd-icon--svg[data-ext="' + key + '"]', e.data.source).data('icon-path', res.datas.icons[key]);
              $('.wpfd-icon--svg[data-ext="' + key + '"]', e.data.source).css('background-image', 'url(' + res.datas.icons[key] + "?timestamp=" + new Date().getTime() + ')');
            });
          }
        }
      });
    },
    rebuildIcons: function (e) {
      $.ajax({
        method: "POST",
        url: wpfdajaxurl + 'task=iconsbuilder.rebuildIcons',
        data: {
          set: $('form.wpfd_icon_params_form [name="current_icon_set"]', e.data.source).val()
        },
        success: function (res) {
          toastr["success"]("Icon rebuild success!");
          // Update all icons if set
          if (typeof res.datas.icons !== "undefined") {
            Object.keys(res.datas.icons).forEach(function (key, index) {
              $('.wpfd-icon--svg[data-ext="' + key + '"]', e.data.source).data('icon-path', res.datas.icons[key]);
              $('.wpfd-icon--svg[data-ext="' + key + '"]', e.data.source).css('background-image', 'url(' + res.datas.icons[key] + "?timestamp=" + new Date().getTime() + ')');
            });
          }
        }
      });
    },
    restoreIcons: function(e) {
      // Prompt before restore icons
      wpfd_icons_ultilities.popup({
        title: 'Are you sure',
        type: 'confirm',
        content: 'You are about to restore all icon set design and setup to default, that is not something reversible, are you sure?',
        onConfirm: function() {
          $.ajax({
            method: "POST",
            url: wpfdajaxurl + 'task=iconsbuilder.restoreicons',
            data: {
              set: $('form.wpfd_icon_params_form [name="current_icon_set"]', e.data.source).val()
            },
            success: function(res) {
              // Update params
              if (typeof res.datas.params !== "undefined") {
                if (typeof res.datas.params.global !== "undefined") {
                  Object.keys(res.datas.params.global).forEach(function(key, i) {
                    $('[name="' + key + '"]', e.data.source).val(res.datas.params.global[key]).trigger('change').trigger('keyup');
                  });
                }
                // Update selected icon
                if (typeof res.datas.params.icons !== "undefined") {
                  var currentExt = $('.wpfd-icon--svg.selected', e.data.source).data('ext');
                  Object.keys(res.datas.params.icons['wpfd-icon-' + currentExt]).forEach(function(key, i) {
                    if (key === 'icon') {
                      $('[data-icon-name="' + res.datas.params.icons['wpfd-icon-' + currentExt][key] + '"]', e.data.source).click();
                      $('.wpfd_icon_params_form [name=icon]', e.data.source).prop('value', res.datas.params.icons['wpfd-icon-' + currentExt][key]);
                    } else {
                      $('.wpfd_icon_params_form [name=' + key + ']', e.data.source).prop('value', res.datas.params.icons['wpfd-icon-' + currentExt][key]).trigger('keyup').trigger('change');
                    }
                  });
                }
              }
              // Update all icons if set
              if (typeof res.datas.icons !== "undefined") {
                Object.keys(res.datas.icons).forEach(function (key, index) {
                  $('.wpfd-icon--svg[data-ext="' + key + '"]', e.data.source).data('icon-path', res.datas.icons[key]);
                  $('.wpfd-icon--svg[data-ext="' + key + '"]', e.data.source).css('background-image', 'url(' + res.datas.icons[key] + "?timestamp=" + new Date().getTime() + ')');
                });
              }
              toastr["success"]("All icons restored!");
            }
          });
        },
        onCancel: function() {
          console.log('onCancel fire!');
        },
      });
    },
    livePreview: function ($source, $return = false) {
      var globalParams = $('form.wpfd_global_icon_params_form', $source).serializeArray();
      var currentParams = $('form.wpfd_icon_params_form', $source).serializeArray();
      wpfd_icons_ultilities.svg_icon_params = {}; // Made sure reset this value
      var useBackgroudAll = false;
      var globalBackground = 'transparent';
      globalParams.forEach(function (elm, index) {
        if (elm.name === 'background-color-all' && elm.value === 'on') {
          useBackgroudAll = true;
        }
        if (elm.name === 'background-color' && useBackgroudAll && elm.value !== '') {
          globalBackground = elm.value;
        }
        wpfd_icons_ultilities.svg_icon_params[elm.name] = elm.value;
      });
      currentParams.forEach(function (elm, index) {
        // Check key exits or empty value
        if (typeof elm.value !== "undefined" && elm.value !== '') {
          wpfd_icons_ultilities.svg_icon_params[elm.name] = elm.value;
        }
      });

      if (useBackgroudAll) {
        wpfd_icons_ultilities.svg_icon_params['background-color'] = globalBackground;
      }

      // Update current icon params
      var svg = wpfd_icons_ultilities.svg;
      Object.keys(wpfd_icons_ultilities.svg_icon_params).map(function (key) {
        svg = svg.replace('{' + key + '}', wpfd_icons_ultilities.svg_icon_params[key]);
      });
      // Live update
      /* Frame */
      var frameSvg = $($('.wpfd-frame-list [data-id="' + wpfd_icons_ultilities.svg_icon_params['svg-frame'] + '"]', $source).html());
      frameSvg.attr('width', 400);
      frameSvg.attr('height', 400);
      frameSvg.find('g, path, line, rect').removeAttr('stroke-width');
      // Change frame width
      var value = wpfd_icons_ultilities.svg_icon_params['frame-width'];
      var paths = $('path', frameSvg);
      if (paths.length) {
        var rawpath = paths.data('path-raw');
        if (rawpath.includes('frame-')) { // Frame
          var top = value - 80;
          var bottom = value - 40;
          rawpath = rawpath.replace('{frame-bottom-width}', bottom).replace('{frame-top-width}', top);
          paths.attr('d', rawpath);
        }
      }

      var rects = $('rect', frameSvg);
      if (rects.length) {
        rects.attr('width', value);
      }

      var lines = $('line', frameSvg);
      if (lines.length) {
        lines.attr('x2', value);
      }

      var circles = $('circle', frameSvg);
      if (circles.length) {
        circles.attr('r', value / 2);
      }

      svg = svg.replace('{frame-place-holder}', frameSvg.outerHTML());
      /* Icon */
      var iconSvg = $($('[data-icon-name="' + wpfd_icons_ultilities.svg_icon_params['icon'] + '"]', $source).html());
      iconSvg.attr('width', 160);
      iconSvg.attr('height', 160);
      svg = svg.replace('{icon-place-holder}', iconSvg.outerHTML());
      svg = wpfd_icons_ultilities.centerAllGroups(wpfd_icons_ultilities.svg_icon_params, svg);
      svg = wpfd_icons_ultilities.applyBoxShadow(wpfd_icons_ultilities.svg_icon_params, svg);
      if ($return) {
        return svg;
      }
      // Update svg preview
      $('.svg_placeholder', $source).html(svg);
    },
    centerAllGroups: function (params, svg) {
      var viewBox = 600;
      var iconWidth = 400;
      var borderWidth = params['border-size'] || 0;
      var frameId = params['svg-frame'];
      var frameWidth = params['frame-width'] || 240;
      var frameHeight = 300;
      var $svg, $item, $transform, translateX, translateY;
      $svg = $(svg);
      // Background #iconBackground
      $item = $('#iconBackground', $svg);
      $transform = $item.attr('transform');
      if ($transform) {
        translateX = (viewBox - iconWidth - borderWidth) / 2;
        translateY = (viewBox - iconWidth - borderWidth) / 2;

        $item.attr('transform', 'translate(' + translateX + ', ' + translateY + ')');

      }
      // Frame #iconFrame
      $item = $('#iconFrame', $svg);
      // Remove frame on deactive
      if (parseInt(wpfd_icons_ultilities.svg_icon_params['frame-active']) !== 1) {
        $item.remove();
      } else {
        $transform = $item.attr('transform');
        if ($transform) {
          var innerTransform = $('svg > g', $item).attr('transform');
          var innerTransformX = 0,
            innerTransformY = 0;
          if (typeof innerTransform !== "undefined") {
            innerTransformX = innerTransform.replace('translate(', '').replace(')', '').split(' ')[0];
            innerTransformY = innerTransform.replace('translate(', '').replace(')', '').split(' ')[1];
          }
          if (parseInt(frameId) === 1) {
            innerTransformY = 40;
          }
          if (parseInt(frameId) === 8) {
            innerTransformX = 60;
          }
          translateX = (viewBox - borderWidth - frameWidth) / 2 - innerTransformX;
          translateY = (viewBox - borderWidth - frameHeight) / 2 - innerTransformY;
          if (parseInt(frameId) === 7 || parseInt(frameId) === 8) {
            translateY = 120;
          }

          if (parseInt(frameId) === 5 || parseInt(frameId) === 6) {
            translateX = 100;
            translateY = 100;
          }

          $item.attr('transform', 'translate(' + translateX + ', ' + translateY + ')');
        }
      }

      // Icon #iconIcon
      $item = $('#iconIcon', $svg);
      var iconIconWidth = $('svg', $item).measure(function () {
        return this.width();
      });
      var iconIconHeight = $('svg', $item).measure(function () {
        return this.height();
      });

      $transform = $item.attr('transform');
      if ($transform) {
        var innerTransform = $('svg > g', $item).attr('transform');
        var innerTransformX = 0,
          innerTransformY = 0;
        if (typeof innerTransform !== "undefined") {
          innerTransformX = innerTransform.replace('translate(', '').replace(')', '').split(' ')[0];
          innerTransformY = innerTransform.replace('translate(', '').replace(')', '').split(' ')[1];
        }

        translateX = (viewBox - iconIconWidth) / 2 - innerTransformX;
        translateY = (viewBox - iconIconHeight) / 2 - innerTransformY - 55; // Magic number
        $item.attr('transform', 'translate(' + translateX + ', ' + translateY + ')');
      }
      // Text #iconText it's ok

      return $svg.outerHTML();
    },
    applyBoxShadow: function (params, svg) {
      if (parseInt(params['boxshadow-active']) !== 1) {
        return svg;
      }
      var time = new Date().getTime();
      var $svg = $(svg);
      var filters = '<filter id="dropshadow-'+time+'" height="130%">\n' +
        '  <feGaussianBlur in="SourceGraphic" stdDeviation="{blur-radius}"/>\n' +
        '  <feOffset dx="{horizontal-position}" dy="{vertical-position}" result="offsetBlur"/>\n' +
        '  <feComponentTransfer>\n' +
        '    <feFuncA type="linear" slope="0.5"/>\n' +
        '  </feComponentTransfer>\n' +
        '  <feMerge> \n' +
        '    <feMergeNode/> \n' +
        '    <feMergeNode in="SourceGraphic"/>\n' +
        '  </feMerge>\n' +
        '</filter>';
      // Replace variables on filters
      Object.keys(params).map(function (key) {
        filters = filters.replace('{' + key + '}', params[key]);
      });

      // Add filter before background rect
      var $shadow = $('#iconBackground', $svg).clone(false);
      $shadow.find('rect').attr('width', $shadow.find('rect').attr('width') - 2);
      $shadow.find('rect').attr('height', $shadow.find('rect').attr('height') - 2);
      var transform = $shadow.attr('transform');
      if (transform) {
        transform = transform.replace(',', '');
        var transformX = transform.replace('translate(', '').replace(')', '').split(' ')[0];
        var transformY = transform.replace('translate(', '').replace(')', '').split(' ')[1];
        transformX = parseInt(transformX) + 1;
        transformY = parseInt(transformY) + 1;
        $shadow.attr('transform', 'translate(' + transformX.toString()  + ', ' + transformY.toString() + ')');
      }
      $shadow.attr('id', 'iconShadow');
      $shadow.css('filter', 'url(#dropshadow-'+time+')');
      $shadow.find('rect').attr('fill', params['shadow-color']);
      $svg.prepend($shadow);
      $svg.prepend(filters);

      return $svg.outerHTML();
    },
    switch: function (e) {
      var $this = $(e.target);
      var ref = $this.attr('name').replace('ref_', '');
      $('input[name="' + ref + '"]').val($this.prop('checked') ? 1 : 0);
    },
    popup: function(options) {
      var $options = $.extend({
        title: '',
        showHeader: true,
        showClose: true,
        type: 'confirm',
        content: '',
        close: 'Close',
        onConfirm: function() {},
        onCancel: function() {}
      }, options);

      var modal = $('<div id="wpfd-modal-wrapper" class="wpfd-modal"></div>').hide();
      var backdrop = $('<div class="wpfd-modal-backdrop fade in"></div>');
      backdrop.on('click', {options: $options}, function(e) {
        modal.remove();
        this.remove();
        var options = e.data.options;
        options.onCancel.call();
      });
      if ($options.showHeader) {
        var modalHeader = $('<div class="wpfd-modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="' + $options.close + '"><span aria-hidden="true">&times;</span></button></div>');
        modalHeader.prepend($("<h4>" + $options.title + "</h4>"));
        modalHeader.find('.close').on('click', {options: $options}, function(e) {
          modal.remove();
          backdrop.remove();
          var options = e.data.options;
          options.onCancel.call();
        });
        modal.prepend(modalHeader);
      }
      var modalContent = $('<div class="wpfd-modal-body"></div>');
      modalContent.html($options.content);
      modal.append(modalContent);
      var modalFooter = $('<div class="wpfd-modal-footer"></div>');

      if ($options.type === 'confirm') {
        var cancel = $('<button class="ju-button ju-button-sm ju-rect-button gray-outline-button">Cancel</button>');
        cancel.on('click', {options: $options}, function(e) {
          modal.remove();
          backdrop.remove();
          var options = e.data.options;
          options.onCancel.call();
        });

        var confirm = $('<button class="ju-button ju-button-sm ju-rect-button ju-material-button">Confirm</button>');
        confirm.on('click', {options: $options}, function(e) {
          modal.remove();
          backdrop.remove();
          var options = e.data.options;
          options.onConfirm.call();
        });

        modalFooter.prepend(confirm);
        modalFooter.prepend(cancel);
      }
      modal.append(modalFooter);
      modal.show();

      $('body').append(backdrop);
      $('body').append(modal);
    },
  };
  var wpfd_icons_builder = {
    init: function () {
      // this.initInlineSvg();
      $(document).on('click', '.wpfd-icon--png', this.initIconClick);
      $(document).on('click', '.wpfd-icon--svg', this.initSvgIconClick);
      $(document).on('click', '.wpfd-icon--png .icon-button', this.restoreDefaultIcon);
      $(document).on('click', '.wpfd-icon--svg .icon-button', this.restoreDefaultIcon)
      $(document).on('click', '.addition-icon', this.showAdditionIconModal);
      $(document).on('click', '#wpfd-addition-icon .close, #wpfd-addition-icon .jsCancel, #wpfd-addition-icon .wpfd-modal-backdrop', this.closeAdditionIconModal);
      $(document).on('click', '.jsUpload', this.uploadAdditionIcon);
      $(document).on('drop', '#extension-upload', this.initAdditionIconDropEvent);
      $(document).on('change', '#wpfd_add_icon_upload', function (e) {
        var files = $(this).prop('files');
        // Display preview
        var reader = new FileReader();
        reader.onload = function (b) {
          $('.addition-icon-preview').css('background-image', 'url(' + b.target.result + ')');
          $('.addition-icon-preview').fadeIn();
        };
        reader.readAsDataURL(files[0]);
      });
      $(document).on('click', '.js-fileDialog-trigger', this.fileDialog);
      this.initDropBox();
    },
    fileDialog: function (e) {
      e.preventDefault();

      var dialogId = $('#' + $(this).data('file-dialog'));
      if (dialogId.length) {
        dialogId.trigger('click');
      }
    },
    initInlineSvg: function () {
      if (typeof (inlineSVG) === 'undefined') {
        console.log('inlineSVG missing! Some svg feature may not working!');
        return false;
      }
      inlineSVG.init({
        svgSelector: 'img.wpfdsvg', // the class attached to all images that should be inlined
        initClass: 'js-inlinesvg', // class added to <html>
      }, function () {
        console.log('All SVGs inlined!');
      });
    },
    showAdditionIconModal: function (e) {
      e.preventDefault();
      $('#wpfd-addition-icon').show('fast');
      return false;
    },
    closeAdditionIconModal: function (e) {
      e.preventDefault();
      $('#wpfd-addition-icon').fadeOut('400', function () {
        $('.addition-icon-preview').css('background-image', 'unset');
        $('.addition-icon-preview').hide();
      });
      return false;
    },
    initSvgIconClick: function (e) {
      e.preventDefault();
      var $this = $(this);
      var set = $this.data('set');
      var $source = $('#wpfd_icons_' + set);
      $('.wpfd-icon--svg', $source).removeClass('selected');
      $this.addClass('selected');
      var extension = $this.data('ext');
      wpfd_icons_builder.loadSvgIcon(extension, set);

      return false;
    },
    loadSvgIcon: function (extension, set) {
      var $source = $('#wpfd_icons_' + set);
      $.ajax({
        method: 'POST',
        url: wpfdajaxurl + '&task=iconsbuilder.load',
        data: {
          set: set,
          extension: extension
        },
        success: function (res, xhr) {
          if (typeof res.datas !== 'undefined') {
            Object.keys(res.datas).forEach(function (item, index) {
              if (item === 'icon') {
                $('[data-icon-name="' + res.datas[item] + '"]', $source).click();
                $('.wpfd_icon_params_form [name=icon]', $source).prop('value', res.datas[item]);
              } else {
                $('.wpfd_icon_params_form [name=' + item + ']', $source).prop('value', res.datas[item]).trigger('keyup');
              }
            });
            wpfd_icons_ultilities.livePreview($source);
          }
        }
      });
    },
    initIconClick: function (e) {
      e.preventDefault();
      var $this = $(this);
      $('.wpfd-icon--png').removeClass('selected');
      $this.addClass('selected');
      var iconPath = $this.data('icon-path');
      var extension = $this.data('ext');

      $('#icon-placeholder').css('background-image', 'url(\'' + iconPath + '\')');
      var imageIcon = new Image();
      imageIcon.src = iconPath;
      $('#icon-information .width').html(imageIcon.width.toString());
      $('#icon-information .height').html(imageIcon.height.toString());
      return false;
    },
    restoreDefaultIcon: function (e) {
      e.preventDefault();
      var $this = $(this);
      var $parent = $this.parent();
      var set = $parent.data('set');
      var extension = $parent.data('ext');

      $.ajax({
        method: 'POST',
        url: wpfdajaxurl + 'task=iconsbuilder.restore',
        data: {set: set, extension: extension},
        success: function (res, status, xhr) {
          if (typeof res === typeof string) {
            res = JSON.parse(res);
          }

          if (res.response === true) {
            var date = new Date();
            if (res.datas.deleted === true && set === 'png') {
              $('.wpfd-icon--' + set.replace(/[0-9]+/, '') + '[data-ext="' + res.datas.ext + '"]').fadeOut(400, function () {
                this.remove();
                $('<option value="' + res.datas.ext + '">' + res.datas.ext + '</option>').appendTo($('select[name="extension"]'));
              });
            } else {
              $('.wpfd-icon--' + set.replace(/[0-9]+/, '') + '[data-ext="' + res.datas.ext + '"]', $('#wpfd_icons_' + set)).css('background-image', 'url(\'' + res.datas.url + '?time=' + date.getMilliseconds() + '\')');
              $('.wpfd-icon--' + set.replace(/[0-9]+/, '') + '[data-ext="' + res.datas.ext + '"]', $('#wpfd_icons_' + set)).data('icon-path', res.datas.url + '?time=' + date.getMilliseconds());
              $('.wpfd-icon--' + set.replace(/[0-9]+/, '') + '[data-ext="' + res.datas.ext + '"]', $('#wpfd_icons_' + set)).click();
              if (set === 'png') {
                var imageIcon = new Image();
                imageIcon.src = res.datas.url;
                $('#icon-information .width').html(imageIcon.width.toString());
                $('#icon-information .height').html(imageIcon.height.toString());
              }
            }
          }

          toastr["success"](res.datas.message);
        },
        error: function (error) {
          console.log(error);
        }
      });

      return false;
    },
    selectFirstIcon: function () {
      $.each($('.wpfd-icon--svg.selected'), function (index, elm) {
        $(elm).trigger('click');
      });
    },
    initDropBox: function (e) {
      $('#wpfd-icon-dropbox').filedrop({
        paramname: 'image',
        fallback_id: 'wpfd_icon_upload',
        maxfiles: 1,
        maxfilesize: 20, // Max file size in MBs
        allowedfiletypes: ['image/png', 'application/zip'],
        allowedfileextensions: ['.png', '.zip'],
        data: {
          extension: function () {
            return $('.wpfd-icon.selected').data('ext');
          },
          set: function () {
            return $('.wpfd-icon.selected').data('set');
          }
        },
        url: wpfdajaxurl + 'task=iconsbuilder.upload',
        dragOver: function () {
          $('#wpfd-icon-dropbox').addClass('wpfd-dragover');
        },
        dragLeave: function () {
          $('#wpfd-icon-dropbox').removeClass('wpfd-dragover');
        },
        drop: function () {
          $('#wpfd-icon-dropbox').removeClass('wpfd-dragover');
        },
        uploadFinished: function (i, file, response) {
          if (response.response === true) {
            if (response.datas.ext !== undefined && response.datas.url !== undefined) {
              var date = new Date();
              // Update current icon
              $('.wpfd-icon--png[data-ext="' + response.datas.ext + '"]').css('background-image', 'url(\'' + response.datas.url + '?time=' + date.getMilliseconds() + '\')');
              $('.wpfd-icon--png[data-ext="' + response.datas.ext + '"]').data('icon-path', response.datas.url + '?time=' + date.getMilliseconds());
              $('.wpfd-icon--png[data-ext="' + response.datas.ext + '"]').click();
            } else if (response.datas.ext === undefined && response.datas.urls !== undefined) {
              var urls = response.datas.urls;
              var keys = Object.keys(urls);
              var date = new Date();
              var lastIcon;
              keys.forEach(function (ext, index) {
                $('.wpfd-icon--png[data-ext="' + ext + '"]').css('background-image', 'url(\'' + urls[ext] + '?time=' + date.getMilliseconds() + '\')');
                $('.wpfd-icon--png[data-ext="' + ext + '"]').data('icon-path', urls[ext] + '?time=' + date.getMilliseconds());
                lastIcon = $('.wpfd-icon--png[data-ext="' + ext + '"]');
              });
              if (lastIcon.length) {
                lastIcon.click();
              }
            }
          }

          $('#wpfd-icon-dropbox .wpfd-loading').hide();
          $('#wpfd-icon-dropbox .upload-text').show();
          toastr["success"](response.datas.message);
        },
        error: function (err, file) {
          switch (err) {
            case 'BrowserNotSupported':
              toastr["error"](_wpfd_text('Your browser does not support HTML5 file uploads'));
              break;
            case 'TooManyFiles':
              toastr["info"](_wpfd_text('You can upload one image/zip file per times. If you want to bulk upload icons, rename icon to fit file extension then compress to a zip file!') + '!');
              break;
            case 'FileTooLarge':
              toastr["error"](file.name + ' ' + _wpfd_text('is too large') + '!');
              break;
            case 'FileTypeNotAllowed':
              toastr["error"]('The file type is not allow!');
              break;
            case 'FileExtensionNotAllowed':
              toastr["error"]('The file extension is not allow!');
              break;
            default:
              break;
          }
        },
        beforeSend: function (file, i, done) {
          $('#wpfd-icon-dropbox .wpfd-loading').show();
          $('#wpfd-icon-dropbox .upload-text').hide();
          done();
        },
        beforeEach: function (file) {
          if (!file.type.match(/^image\//) && !file.type.match(/^application\/zip/)) {
            toastr["error"](_wpfd_text('Only images or archive zip are allowed', 'Only images or archive zip are allowed') + '!');
            return false;
          }
        }
      });
    },
    uploadAdditionIcon: function (e) {
      e.preventDefault();
      var extension = $('select[name=extension]').val();
      var image = $('#wpfd_add_icon_upload')[0].files[0];

      var formData = new FormData();
      formData.append('extension', extension);
      formData.append('set', 'png');
      formData.append('image', image);

      $.ajax({
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        url: wpfdajaxurl + 'task=iconsbuilder.upload',
        success: function (res, status, xhr) {
          if (typeof res === typeof string) {
            res = JSON.parse(res);
          }
          if (res.response === false) {
            toastr["success"](res.datas.message);
            return false;
          }

          var iconPath = res.datas.url;
          var extension = res.datas.ext;

          // Add new icon
          var item = $('<li data-icon-path="' + iconPath + '" data-ext="' + extension + '" data-set="png" class="wpfd-icon wpfd-icon--png ' + extension + '">\n' +
            '<div class="icon-button">\n' +
            '<span class="material-icons">clear</span>\n' +
            '</div></li>');
          item.css('background-image', 'url(\'' + iconPath + '\')');
          $('.addition-icon').before(item);
          // Remove uploaded extension
          $('option[value=' + extension + ']').remove();
          wpfd_icons_builder.closeAdditionIconModal(e);
        },
        error: function (error) {
          console.log(error);
        }
      });

      return false;
    },
    initAdditionIconDropEvent: function (e) {
      e.preventDefault();
      e.stopPropagation();
      $('#wpfd_add_icon_upload').prop("files", e.dataTransfer.files);
      $('#wpfd_add_icon_upload').trigger('change');
      return false;
    }
  };
  $(document).ready(function ($) {
    promise = new Promise(function (resolve, reject) {
      wpfd_icons_builder.initInlineSvg();
      toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "300",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
      };

      $('.ju-tooltip').qtip({
        content: {
          attr: 'title',
        },
        position: {
          my: 'bottom right',
          at: 'top right',
        },
        style: {
          tip: {
            corner: true,
          },
          classes: 'wpfd-qtip qtip-rounded wpfd-qtip-dashboard',
        },
        show: 'mouseover',
        hide: {
          fixed: true,
          delay: 10,
        },
      });

      resolve();
    });
    promise.then(function () {
      var svg1 = wpfd_icons_ultilities;
      var svg2 = wpfd_icons_ultilities;
      // Init Notify options

      svg1.init('#wpfd_icons_svg1');
      svg2.init('#wpfd_icons_svg2');

      wpfd_icons_builder.init();
    }).then(function () {
      $('.wpfd-icon--png:first-child').click();
      $(document).one('click', wpfd_icons_builder.selectFirstIcon);
    });
  });
})(jQuery);
