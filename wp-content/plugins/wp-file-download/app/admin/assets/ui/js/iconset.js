;
'use strict';
(function($) {
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
  var wpfd_png = {
    init: function() {
      $(document).on('click', '.js-PngUpload-trigger', {'wrapper': this}, this._upload);
      $(document).on('click', '.js-PngDelete-trigger', {'wrapper': this}, this._delete);
      $('.wpfd-default-icon img').each(function() {
        var row = $(this).parent().parent();
        var mayBeUploadedImg = row.find('.wpfd-uploaded-icon img');
        if (mayBeUploadedImg.length) {
          wpfd_ultilities.updateSize(mayBeUploadedImg.attr('src'), row);
        } else {
          wpfd_ultilities.updateSize($(this).attr('src'), row);
        }
      });
    },
    _upload: function(e) {
      e.preventDefault();
      var $this = $(this);
      var $wrapper = e.data.wrapper;
      var ext = $this.data('extension');
      var iconSet = $this.data('icon-set');
      $wrapper._openFileDialog(function(files) {
        $wrapper._doUpload(files, ext, iconSet, $this);
      });
    },
    _delete: function(e) {
      e.preventDefault();
      var $this = $(this);
      var $wrapper = e.data.wrapper;
      var ext = $this.data('extension');
      var iconSet = $this.data('icon-set');
      $wrapper._doDelete(ext, iconSet, $this);
    },
    _openFileDialog: function(cb) {
      $('<input type="file" accept="image/png" />')
      .on('change', function () {
        cb(this.files);
      }).click();
    },
    _doDelete: function(ext, set, $button) {
      var $wrapper = this;
      $.ajax({
        method: 'POST',
        url: wpfdajaxurl + 'task=iconsbuilder.restore',
        data: {set: set, extension: ext},
        success: function (data) {
          if (typeof data === typeof string) {
            data = JSON.parse(data);
          }

          wpfd_ultilities.removeUploaded(data.datas.url, data.datas.ext, $button);

          toastr["success"](data.datas.message);
        },
        error: function(error) {
          toastr["error"](error.datas.message);
        },
      });
    },
    _doUpload: function (files, ext, set, $button) {
      var formdata = false;
      if (window.FormData) {
        formdata = new FormData();
      }
      formdata.append('image', files[0]);
      formdata.append('extension', ext);
      formdata.append('set', set);

      $.ajax({
        method: 'POST',
        url: wpfdajaxurl + 'task=iconsbuilder.upload',
        data: formdata,
        processData: false,
        contentType: false,
        success: function(data) {
          if (typeof data === typeof string) {
            data = JSON.parse(data);
          }
          wpfd_ultilities.updateIcon(data.datas.url, data.datas.ext, $button);
          toastr["success"](data.datas.message);
        },
        error: function(error) {
          toastr["error"](error.datas.message);
        },
      });
    },
  };
  var wpfd_svg = {
    init: function() {
      $(document).on('click', '.js-SvgEdit-trigger', this.loadSvgEditor);
      $(document).on('click', '.js-SvgBack-trigger', this.backToList);
      $(document).on('click', '.js-SvgSave-trigger', this.save);
      $(document).on('click', '.js-SvgDelete-trigger', this.delete);
      $(document).on('click', '.js-SvgApplyAll-trigger', this.applyStyleForAll);
      $(document).on('click', '.js-SvgResetOriginal-trigger', this.restoreOriginal);
      // Update preview on params changes
      this.bindPreviewOnChanges();
    },
    bindPreviewOnChanges: function() {
      $(document).on('input keyup change', '#svg-icons-editor input, #svg-icons-editor select', wpfd_svg_icon.livePreview);
    },
    unbindPreviewOnChanges: function() {
      $(document).off('input keyup change', '#svg-icons-editor input, #svg-icons-editor select', wpfd_svg_icon.livePreview);
    },
    loadSvgEditor: function(e) {
      wpfd_ultilities.showEditor();
      var set = $(this).data('icon-set');
      var extension = $(this).data('extension');
      // Load icon params and render preview
      $.ajax({
        method: 'POST',
        url: wpfdajaxurl + '&task=iconsbuilder.load',
        data: {
          set: set,
          extension: extension
        },
        beforeSend: function() {
          // todo: show loading
          wpfd_svg.unbindPreviewOnChanges();
        },
        success: function (data) {
          if (typeof data === typeof string) {
            data = JSON.parse(data);
          }
          // Fill editor with current data
          if (typeof data.datas !== 'undefined') {
            Object.keys(data.datas).forEach(function (item) {
              if (item === 'icon') {
                $('[data-icon-name="' + data.datas[item] + '"]').click();
                $('[name=icon]').prop('value', data.datas[item]);
              } else {

                if (item.includes('-active')) {
                  $('[name=ref_' + item + ']').prop('checked', parseInt(data.datas[item]) === 1 ? true : false);
                  $('[name=' + item + ']').prop('value', data.datas[item]);
                } else {
                  $('[name=' + item + ']').prop('value', data.datas[item]).trigger('keyup').trigger('change').trigger('input');
                }
              }
            });
            $('.js-SvgSave-trigger').data('extension', extension);
            wpfd_svg_icon.livePreview();
          }
        },
        complete: function() {
          // todo: hide loading
          wpfd_svg.bindPreviewOnChanges();
        },
      });
    },
    backToList: function(e) {
      wpfd_ultilities.hideEditor();
    },
    save: function(e) {
      var extension = $(this).data('extension');
      // Save and export current icon using timeout
      $.ajax({
        method: "POST",
        url: wpfdajaxurl + 'task=iconsbuilder.saveicon',
        data: {
          icon: btoa(JSON.stringify(wpfd_ultilities._getSVGParams())),
          extension: extension
        },
        success: function (data) {
          if (typeof data === typeof string) {
            data = JSON.parse(data);
          }
          toastr["success"](data.datas.message);
          // Replace override icon
          var button = $('#svg-icons-list [data-extension="'+extension+'"] .wpfd-actions button:first');
          wpfd_ultilities.updateIcon(data.datas.url, extension, button);
          //wpfd_ultilities.initInlineSvg(false);
        }
      });
    },
    delete: function(e) {
      var extension = $(this).data('extension');
      $.ajax({
        method: 'POST',
        url: wpfdajaxurl + 'task=iconsbuilder.restore',
        data: {set: 'svg', extension: extension},
        success: function(data) {
          if (typeof data === typeof string) {
            data = JSON.parse(data);
          }
          toastr['success'](data.datas.message);
          var button = $('#svg-icons-list [data-extension="'+extension+'"] .wpfd-actions button:first');
          wpfd_ultilities.removeUploaded(data.datas.url, extension, button);
        },
        error: function(error) {},
      });
    },
    restoreOriginal: function(e) {
      wpfd_ultilities.popup({
        title: 'Are you sure?',
        type: 'confirm',
        content: 'You are about to restore all icon set design and setup to default, that is not something reversible, are you sure?',
        onConfirm: function() {
          // Send ajax
          $.ajax({
            method: "POST",
            url: wpfdajaxurl + 'task=iconsbuilder.restoreicons',
            data: {
              set: 'svg'
            },
            success: function (data) {
              if (typeof data === typeof string) {
                data = JSON.parse(data);
              }
              if (typeof data.datas.icons === "undefined") {
                toastr["error"](data.datas.message);
              }
              toastr["success"](data.datas.message);
              // Replace override icons
              Object.keys(data.datas.icons).forEach(function(ext) {
                var button = $('#svg-icons-list [data-extension="'+ext+'"] .wpfd-actions button:first');
                if (button.length) {
                  wpfd_ultilities.updateIcon(data.datas.icons[ext], ext, button, true);
                  wpfd_ultilities.removeUploaded(data.datas.icons[ext], ext, button, true);
                }
              });
              //wpfd_ultilities.initInlineSvg(false);
            },
            error: function(data) {
              if (typeof data === typeof string) {
                data = JSON.parse(data);
              }
              toastr["error"](data.datas.message);
            }
          });
        },
        onCancel: function() {
        },
      });
      // Clean all Override and button
    },
    applyStyleForAll: function(e) {
      var extension = $(this).data('extension');
      // Save and export current icon using timeout
      $.ajax({
        method: "POST",
        url: wpfdajaxurl + 'task=iconsbuilder.applyall',
        data: {
          extension: extension
        },
        success: function (data) {
          if (typeof data === typeof string) {
            data = JSON.parse(data);
          }
          if (typeof data.datas.icons === "undefined") {
            toastr["error"](data.datas.message);
          }
          toastr["success"](data.datas.message);
          // Replace override icons
          Object.keys(data.datas.icons).forEach(function(ext) {
            var button = $('#svg-icons-list [data-extension="'+ext+'"] .wpfd-actions button:first');
            if (button.length) {
              wpfd_ultilities.updateIcon(data.datas.icons[ext], ext, button);
            }
          });
          //wpfd_ultilities.initInlineSvg(false);
        },
        error: function(data) {
          if (typeof data === typeof string) {
            data = JSON.parse(data);
          }
          toastr["error"](data.datas.message);
        }
      });
    },
  };
  var wpfd_svg_icon = {
    livePreview: function () {
      var $params = wpfd_ultilities._getSVGParams();
      var svg = '<svg style="" class="preview-svg" width="150" height="150" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" version="1.1">\n' +
        '        <g id="iconBackground" transform="translate(0 0)">\n' +
        '            <rect width="400" height="400" fill="{background-color}" rx="0"/>\n' +
        '        </g>\n' +
        '        <g id="iconFrame" transform="translate(100 15)" style="color: {frame-color};stroke-width: {frame-stroke}px;">\n' +
        '            {frame-place-holder}\n' +
        '        </g>\n' +
        '        <g id="iconIcon" transform="translate(220 81)" style="color: {icon-color}">\n' +
        '            {icon-place-holder}\n' +
        '        </g>\n' +
        '        <g id="iconText" transform="translate(0 300)" style="color: {text-color};font-size: {font-size}px;font-family: {font-family};text-transform: uppercase;">\n' +
        '            <text id="iconText" x="200" y="0" fill="currentColor" dominant-baseline="middle" text-anchor="middle">{icon-text}</text>\n' +
        '        </g>\n' +
        '    </svg>';

      // Live update
      if (parseInt($params['wrapper-active']) === 0) {
        $params['background-color'] = 'transparent';
        $params['border-radius'] = 0;
        $params['border-size'] = 0;
      }

      // Update current icon params
      Object.keys($params).map(function (key) {
        svg = svg.replace('{' + key + '}', $params[key]);
      });
      /* Frame */
      var frameSvg = $($('.wpfd-frame-list [data-id="' + $params['svg-frame'] + '"]').html());
      frameSvg.attr('width', 400);
      frameSvg.attr('height', 400);
      frameSvg.find('g, path, line, rect').each(function() {$(this).removeAttr('stroke-width')});
      // Change frame width
      var value = $params['frame-width'];
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

      if (parseInt($params['icon-active']) === 1) {
        var iconSvg = $($('[data-icon-name="' + $params['icon'] + '"]').html());
        iconSvg.attr('width', (typeof $params['icon-size'] !== "undefined") ? $params['icon-size'] : 160);
        iconSvg.attr('height', (typeof $params['icon-size'] !== "undefined") ? $params['icon-size'] : 160);
        svg = svg.replace('{icon-place-holder}', iconSvg.outerHTML());
      } else {
        var $svgTmp = $(svg);
        $('#iconIcon', $svgTmp).remove();
        svg = $svgTmp.outerHTML();
      }

      if (parseInt($params['extension-name-active']) === 0) {
        var $svgTmp = $(svg);
        $('#iconText', $svgTmp).remove();
        svg = $svgTmp.outerHTML();
      }

      svg = wpfd_svg_icon.centerAllGroups($params, svg);
      // Init shadow
      svg = wpfd_svg_icon.addShadow($params, svg);
      // Update svg preview
      $('.svg_placeholder').html(svg);
    },
    centerAllGroups: function ($params, svg) {
      var viewBox = 400;
      var iconWidth = 400;
      var frameId = $params['svg-frame'];
      var frameWidth = $params['frame-width'] || 240;
      var frameHeight = 300;
      var $svg, $item, $transform, translateX, translateY;
      $svg = $(svg);
      // Background #iconBackground
      $item = $('#iconBackground', $svg);
      $transform = $item.attr('transform');
      if ($transform) {
        translateX = (viewBox - iconWidth) / 2;
        translateY = (viewBox - iconWidth) / 2;

        $item.attr('transform', 'translate(' + translateX + ' ' + translateY + ')');

      }
      // Frame #iconFrame
      $item = $('#iconFrame', $svg);

      // Remove frame on deactive
      if (parseInt($params['frame-active']) !== 1 || parseInt(frameId) === 0) {
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
          translateX = (viewBox - frameWidth) / 2 - innerTransformX;
          translateY = (viewBox - frameHeight) / 2 - innerTransformY;
          if (parseInt(frameId) === 7 || parseInt(frameId) === 8) {
            translateY = 10;
          }

          if (parseInt(frameId) === 5 || parseInt(frameId) === 6) {
            translateX = 0;
            translateY = 0;
          }

          $item.attr('transform', 'translate(' + translateX + ' ' + translateY + ')');
        }
      }

      // Icon #iconIcon
      $item = $('#iconIcon', $svg);
      if ($item.length) {
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
          $item.attr('transform', 'translate(' + translateX + ' ' + translateY + ')');
        }
      }

      // Text #iconText it's ok

      return $svg.outerHTML();
    },
    addShadow: function($params, svg) {
      var $svg = $(svg);
      if (parseInt($params['wrapper-active']) === 0) {
        $params['background-color'] = 'transparent';
      } else {
        $svg.css('border-radius', $params['border-radius'] + '%');
        $svg.css('box-shadow', $params['horizontal-position'] + 'px ' + $params['vertical-position'] + 'px ' + $params['blur-radius'] + 'px ' + $params['spread-radius'] + 'px ' + $params['shadow-color']);
        $svg.css('border', $params['border-size'] + 'px solid ' + $params['border-color']);
      }

      $svg.css('background-color', $params['background-color']);
      return $svg.outerHTML();
    }
  };
  window.wpfd_ultilities = {
    init: function() {
      $(document).on('input', '.js-typeFilter-trigger', this._filterIcon);
      $(document).on('change', '.ju-switch-button .switch input[type="checkbox"]', this.switch);
      $(document).on('change', '.wpfd-icons-header [name=ref_active_svg_set], .wpfd-icons-header [name=ref_active_png_set]', this.setDefaultIconSet);
      this.rangeSlider();
      this.collapse();
      this.minicolors();
      this.initInlineSvg();
      $('#adminmenuwrap').mCustomScrollbar({
        axis: 'y',
        theme: 'light',
        scrollInertia: 800,
        autoHideScrollbar: true,
        autoExpandScrollbar: false,
      });
    },
    setDefaultIconSet: function (e) {
      var $this = $(this);
      var currentName = $this.prop('name');
      var svgActive = $('.wpfd-icons-header [name=ref_active_svg_set]').prop('checked') ? '1' : '0';
      var pngActive = $('.wpfd-icons-header [name=ref_active_png_set]').prop('checked') ? '1' : '0';

      if (parseInt(svgActive) === 1 && parseInt(pngActive) === 1) {
        if (currentName === 'ref_active_svg_set') {
          $('.wpfd-icons-header [name=ref_active_png_set]').prop('checked', false);
          $('.wpfd-icons-header [name=active_png_set]').val('0');
          pngActive = '0';
        }
        if (currentName === 'ref_active_png_set') {
          $('.wpfd-icons-header [name=ref_active_svg_set]').prop('checked', false);
          $('.wpfd-icons-header [name=active_svg_set]').val('0');
          svgActive = '0';
        }
      }
      // Send ajax
      $.ajax({
        method: 'POST',
        url: wpfdajaxurl + 'task=iconsbuilder.changedefaulticonset',
        data: {svg: svgActive, png: pngActive},
        success: function(data) {
          if (typeof data === typeof string) {
            data = JSON.parse(data);
          }


          toastr["success"](data.datas.message);
        },
        error: function(error) {},
      });
    },
    updateIcon: function(url, ext, $button, $default = false) {
      var iconRow = $button.closest('tr[data-extension="'+ext+'"]');
      if (iconRow.length === 0) {
        toastr["error"]("Something went wrong!");
        return false;
      }
      url = url + '?time=' + new Date().getTime();
      var $params = this._getSVGParams();
      var $div = $('<div>');
      $div.css('width', '70px');
      $div.css('height', '70px');
      $div.css({background:'url("'+url+'") no-repeat center center', backgroundSize: 'contain', margin: '0 auto'});
      if (parseInt($params['wrapper-active']) === 1) {
        $div.css('border-radius', $params['border-radius'] + '%');
        $div.css('box-shadow', $params['horizontal-position'] + 'px ' + $params['vertical-position'] + 'px ' + $params['blur-radius'] + 'px ' + $params['spread-radius'] + 'px ' + $params['shadow-color']);
        $div.css('border', $params['border-size'] + 'px solid ' + $params['border-color']);
      }

      if ($default) {
        iconRow.find('.wpfd-default-icon').html('<img class="wpfdsvg" width="70" src="' + url +'">');
      } else {
        iconRow.find('.wpfd-uploaded-icon').html($div);
      }

      iconRow.find('.wpfd-actions button[data-action="delete"]').show();
      // Set icon size
      wpfd_ultilities.updateSize(url, iconRow);

      // Check for unknown extension
      if (ext === 'unknown') {
        // Restore all default icons
        $('table[data-icon-set="png"] td.wpfd-default-icon').each(function() {
          var $tr = $(this);
          if ($tr.find('img').prop('src').includes('unknown.png')) {
            $tr.html('<img width="70" src="' + url +'">');
          }
        });
      }
    },
    removeUploaded: function(url, ext, $button) {
      var iconRow = $button.closest('tr[data-extension="'+ext+'"]');
      url = url + '?time=' + new Date().getTime();
      iconRow.find('.wpfd-uploaded-icon').html('');
      iconRow.find('.wpfd-actions button[data-action="delete"]').hide();
      // Set icon size
      this.updateSize(url, iconRow);

      // Check for unknown extension
      if (ext === 'unknown') {
        // Restore all default icons
        $('table[data-icon-set="png"] td.wpfd-default-icon').each(function() {
          var $tr = $(this);
          if ($tr.find('img').prop('src').includes('unknown.png')) {
            $tr.html('<img width="70" src="' + url +'">');
          }
        });
      }
    },
    _filterIcon: function(e) {
      e.preventDefault();
      var $filter = $(this);
      var searchText = $filter.val();
      var $target = $filter.data('search');
      if (searchText === '') {
        $('table[data-search-ref="'+$target+'"] tbody tr').show();
      } else {
        $('table[data-search-ref="' + $target + '"] tbody tr').hide();
        $('table[data-search-ref="' + $target + '"] tbody tr').each(function () {
          if ($(this).data('extension').toString().toLowerCase().includes(searchText.toLowerCase())) {
            $(this).show();
          }
        });
      }

      return false;
    },
    _getSVGParams: function() {
      var data = {};
      $('#svg-icons-editor input').each(function() {
        if ($(this).prop('name') !== '' && !$(this).prop('name').includes('ref_')) {
          data[$(this).prop('name')] = $(this).val();
        }
      });
      $('#svg-icons-editor select').each(function() {
        if ($(this).prop('name') !== '' && !$(this).prop('name').includes('ref_')) {
          data[$(this).prop('name')] = $(this).val();
        }
      });

      Object.keys(data).forEach(function(key, index) {
        if (key.match(/(-color|_color|_start|_end|_solid)$/) && (data[key].toString() === '' || data[key].toString() === 'transparent')) {
          data[key] = 'rgba(0,0,0,0)';
        }
      });

      return data;
    },
    popup: function(options) {
      var $options = $.extend({
        title: '',
        showHeader: true,
        showClose: false,
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

        var modalHeader = $('<div class="wpfd-modal-header"></div>');
        var closeButton = $('<button type="button" class="close" data-dismiss="modal" aria-label="' + $options.close + '"><span aria-hidden="true">&times;</span></button>');
        if ($options.showClose) {
          modalHeader.prepend(closeButton);
          modalHeader.find('.close').on('click', {options: $options}, function(e) {
            modal.remove();
            backdrop.remove();
            var options = e.data.options;
            options.onCancel.call();
          });
        }
        modalHeader.prepend($("<h4>" + $options.title + "</h4>"));

        modal.prepend(modalHeader);
      }
      var modalContent = $('<div class="wpfd-modal-body"></div>');
      modalContent.html($options.content);
      modal.append(modalContent);
      var modalFooter = $('<div class="wpfd-modal-footer"></div>');

      if ($options.type === 'confirm') {
        var cancel = $('<button class="ju-button ju-rect-button ju-link-button">Cancel</button>');
        cancel.on('click', {options: $options}, function(e) {
          modal.remove();
          backdrop.remove();
          var options = e.data.options;
          options.onCancel.call();
        });

        var confirm = $('<button class="ju-button ju-rect-button ju-material-button">Confirm</button>');
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
    updateSize: function(url, row) {
      $("<img/>",{
        load : function(){
          row.find('.wpfd-icon-size').html(this.width + 'x' + this.height + 'px');
        },
        src: url
      });
    },
    showEditor: function() {
      $('#svg-icons-list').fadeOut('fast', function() {
        $('#svg-icons-editor').fadeIn('fast');
      });
    },
    hideEditor: function() {
      $('#svg-icons-editor').fadeOut('fast', function() {
        $('#svg-icons-list').fadeIn('fast');
      });
    },
    rangeSlider: function() {
      $('input[data-rangeslider]').rangeslider({
        polyfill: false,
        onInit: function () {
          // this.output = $('<div class="range-output" />').insertAfter(this.$range).html(this.$element.val());
          this.output = this.$element.parent().find('input[data-rangeslider-number]').val(this.$element.val());
        },
        onSlide: function (position, value) {
          this.output.val(value);
        },
      });
      $(document)
        .on('change', 'input[data-rangeslider-number]', function (e) {
          var $inputRange = $('[data-rangeslider]', e.target.parentNode);
          var value = $('input[type="number"]', e.target.parentNode)[0].value;
          $inputRange.val(value).change();
        });
    },
    switch: function (e) {
      var $this = $(this);
      var ref = $this.attr('name').replace('ref_', '');
      $('input[name="' + ref + '"]').val($this.prop('checked') ? 1 : 0);
    },
    collapse: function() {
      var collapseItems = $('.wpfd-collapse');
      if (collapseItems.length) {
        collapseItems.each(function (index, item) {
          $('.wpfd-collapse--icon, .card-title', item).on('click', function (e) {
            var closeGroup = $(item).data('close-group');
            // console.log(closeGroup.toString().split(','));
            if (closeGroup) {
              closeGroup.toString().split(',').forEach(function(name) {
                $('.wpfd-card-body', $('[data-collapse-name='+name+']')).slideUp('slow', function() {
                  $('.wpfd-collapse--icon', $('[data-collapse-name='+name+']')).text('expand_more');
                });
              });
            }
              //var name = item.data('collapse-name');

            if ($(item).hasClass('wpfd-card')) {
              $('.wpfd-card-body', item).slideToggle('slow', function() {
                $('.wpfd-collapse--icon', item).toggleText('expand_more', 'expand_less');
              });
            }
          });
        });
      }
    },
    minicolors: function() {
      $('.minicolors:not([name=icon-color])').minicolors({
        position: "top right",
        format: 'hex',
        change: function (value, opacity) {
        }
      });
      // Reinit minicolor to fix position
      // $('.minicolors[name=icon-color]').minicolors('destroy');
      $('.minicolors[name=icon-color]').minicolors({
        position: "bottom right",
        format: 'hex',
        change: function (value, opacity) {
        }
      });
    },
    icons: function() {
      $('[data-icon-name]').on('click', function (e) {
        var iconName = $(this).data('icon-name');
        var svgIconContent = $(this).html();
        $('[data-icon-name]').removeClass('selected');
        $(this).addClass('selected');
        $('.svg-icon-selected > svg').remove();
        $('.svg-icon-selected > img').remove();
        $('.svg-icon-selected').prepend($(svgIconContent));
        $('.svg-icon-selected > svg').attr('width', '60');
        $('.svg-icon-selected > svg').attr('height', '60');

        // Change icon input
        $('[name=icon]').val(iconName).trigger('change');
      });
    },
    frames: function() {
      // Frame change
      $(document).on('click', '.wpfd-frame-list li', function (e) {
        $('[name=svg-frame]').val($(this).data('id'));
        $('li', $(this).parent()).removeClass('selected');
        $(this).addClass('selected');

        // Change width
        $('[name="frame-width"]').trigger('change');
      });
    },
    initInlineSvg: function (bind = true) {
      if (typeof (inlineSVG) === 'undefined') {
        console.log('inlineSVG missing! Some svg feature may not working!');
        return false;
      }
      inlineSVG.init({
        svgSelector: 'img.wpfdsvg', // the class attached to all images that should be inlined
        initClass: 'js-inlinesvg', // class added to <html>
      }, function () {
        console.log('All SVGs inlined!');
        if (bind) {
          wpfd_ultilities.icons();
          wpfd_ultilities.frames();
        }
      });
    },
  };
  // Remember activate tab
  var wpfd_tabs = {
    init: function () {
      $(document).on('click', '.ju-menu-tabs > .tab > a,.ju-top-tabs > .tab > a', this.tabClick);
      // $(document).on('click', '.ju-top-tabs > .tab > a', this.subTabClick);
      $(document).ready(this.activateTabFromCookie);
    },
    tabClick: function (e) {
      var $this = $(e.target);
      var tab_id = $this.attr('href').replace('#', '');
      wpfd_tabs.setActivatedTabToCookie(tab_id);
    },
    subTabClick: function (e) {
      var $this = $(e.target);
      var tab_id = $this.attr('href').replace('#', '');
      wpfd_tabs.setActivatedTabToCookie(tab_id);
    },
    activateTabFromCookie: function () {
      var active_tab = wpfd_tabs.getActivatedTabFromCookie();
      if (active_tab === '') {
        active_tab = 'svg';
      }
      if (active_tab !== '') {
        var tab = $(".ju-menu-tabs a[href='#" + active_tab + "']");
        if (tab.length) {
          tab.trigger('click');
        } else { // This is sub tab
          tab = $(".ju-top-tabs a[href='#" + active_tab + "']");
          var parentHref = $(tab).closest('.ju-content-wrapper').attr('id');
          var tabHref = $(tab).attr('href').replace('#', '');
          $('.ju-menu-tabs .tab a.link-tab').removeClass('expanded active');
          var parentNode = $('.ju-menu-tabs .tab a.link-tab[href="#' + parentHref + '"]');
          $(parentNode).trigger('click');
          $(parentNode).closest('li.tab').find('.ju-submenu-tabs').find('div.link-tab[data-href="#' + tabHref + '"]').trigger('click');
        }
      }
    },
    getActivatedTabFromCookie: function () {
      var name = "wpfd_icons_builder_activated_tab=";
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
      }
      return '';
    },
    setActivatedTabToCookie: function (id) {
      document.cookie = 'wpfd_icons_builder_activated_tab=' + id;
    },
  };
  $(document).ready(function() {
    wpfd_png.init();
    wpfd_svg.init();
    wpfd_ultilities.init();
    wpfd_tabs.init();
  });
})(jQuery);
