/******/ (function(modules) { 
/******/ 	var installedModules = {};
/******/
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		module.l = true;
/******/
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
__webpack_require__(2);
__webpack_require__(3);
module.exports = __webpack_require__(4);


 }),

(function(module, exports) {

;(function ($, window, document, undefined) {

  var VariationForm = function VariationForm($form) {
    var self = this;

    self.$form = $form;
    self.$attributeFields = $form.find('.variations select');
    self.$singleVariation = $form.find('.single_variation');
    self.$singleVariationWrap = $form.find('.single_variation_wrap');
    self.$resetVariations = $form.find('.reset_variations');
    self.$product = $form.closest('.product');
    self.variationData = $form.data('product_variations');
    self.useAjax = false === self.variationData;
    self.xhr = false;
    self.loading = true;
    self.$singleVariationWrap.show();
    self.$form.off('.wc-variation-form');
    self.getChosenAttributes = self.getChosenAttributes.bind(self);
    self.findMatchingVariations = self.findMatchingVariations.bind(self);
    self.isMatch = self.isMatch.bind(self);
    self.toggleResetLink = self.toggleResetLink.bind(self);
    $form.on('click.wc-variation-form', '.reset_variations', { variationForm: self }, self.onReset);
    $form.on('reload_product_variations', { variationForm: self }, self.onReload);
    $form.on('hide_variation', { variationForm: self }, self.onHide);
    $form.on('show_variation', { variationForm: self }, self.onShow);
    $form.on('click', '.single_add_to_cart_button', { variationForm: self }, self.onAddToCart);
    $form.on('reset_data', { variationForm: self }, self.onResetDisplayedVariation);
    $form.on('reset_image', { variationForm: self }, self.onResetImage);
    $form.on('change.wc-variation-form', '.variations select', { variationForm: self }, self.onChange);
    $form.on('found_variation.wc-variation-form', { variationForm: self }, self.onFoundVariation);
    $form.on('check_variations.wc-variation-form', { variationForm: self }, self.onFindVariation);
    $form.on('update_variation_values.wc-variation-form', { variationForm: self }, self.onUpdateAttributes);

    $form.trigger('veb_variation_swatches_form_init', self);
    this.init($form);
  };

  VariationForm.prototype.afterGalleryInit = function ($form) {
    var self = this;
    _.delay(function () {
      $form.trigger('check_variations');
      $form.trigger('wc_variation_form', self);
      this.loading = false;
    }, 100);
  };

  VariationForm.prototype.init = function ($form) {
    var _this = this;

    var product_id = $form.data('product_id');
    if (this.useAjax) {

      if ($form.xhr) {
        $form.xhr.abort();
      }

      $form.xhr = $.ajax({
        headers: {
          'Cache-Control': 'max-age=86400',
          'Pragma': 'cache'
        },
        cache: true,
        url: wc_add_to_cart_variation_params.wc_ajax_url.toString().replace('%%endpoint%%', 'get_variations'),
        type: 'GET',
        data: {
          product_id: product_id
        },
        success: function success(variations) {
          if (variations) {
            $form.data('product_variations', variations);
            _this.variationData = $form.data('product_variations');
            _this.useAjax = false;
          } else {
            console.error('product variations not available on ' + product_id + '.');
          }
        },
        complete: function complete() {
        
          _this.afterGalleryInit($form);
        }
      });
    } else {
     
      this.afterGalleryInit($form);
    }
  };

  VariationForm.prototype.onReset = function (event) {
    event.preventDefault();
    
    event.data.variationForm.$attributeFields.val('').trigger('change');
    event.data.variationForm.$form.trigger('reset_data');
  };

  VariationForm.prototype.onReload = function (event) {
    var form = event.data.variationForm;
    form.variationData = form.$form.data('product_variations');
    form.useAjax = false === form.variationData;
    form.$form.trigger('check_variations');
  };

  VariationForm.prototype.onHide = function (event) {
    event.preventDefault();
    event.data.variationForm.$form.find('.single_add_to_cart_button').removeClass('wc-variation-is-unavailable').addClass('disabled wc-variation-selection-needed');
    event.data.variationForm.$form.find('.woocommerce-variation-add-to-cart').removeClass('woocommerce-variation-add-to-cart-enabled').addClass('woocommerce-variation-add-to-cart-disabled');
  };

  VariationForm.prototype.onShow = function (event, variation, purchasable) {
    event.preventDefault();
    if (purchasable) {
      event.data.variationForm.$form.find('.single_add_to_cart_button').removeClass('disabled wc-variation-selection-needed wc-variation-is-unavailable');
      event.data.variationForm.$form.find('.woocommerce-variation-add-to-cart').removeClass('woocommerce-variation-add-to-cart-disabled').addClass('woocommerce-variation-add-to-cart-enabled');
    } else {
      event.data.variationForm.$form.find('.single_add_to_cart_button').removeClass('wc-variation-selection-needed').addClass('disabled wc-variation-is-unavailable');
      event.data.variationForm.$form.find('.woocommerce-variation-add-to-cart').removeClass('woocommerce-variation-add-to-cart-enabled').addClass('woocommerce-variation-add-to-cart-disabled');
    }

    if (wp.mediaelement) {
      event.data.variationForm.$form.find('.wp-audio-shortcode, .wp-video-shortcode').not('.mejs-container').filter(function () {
        return !$(this).parent().hasClass('mejs-mediaelement');
      }).mediaelementplayer(wp.mediaelement.settings);
    }
  };

  VariationForm.prototype.onAddToCart = function (event) {
    if ($(this).is('.disabled')) {
      event.preventDefault();

      if ($(this).is('.wc-variation-is-unavailable')) {
        window.alert(wc_add_to_cart_variation_params.i18n_unavailable_text);
      } else if ($(this).is('.wc-variation-selection-needed')) {
        window.alert(wc_add_to_cart_variation_params.i18n_make_a_selection_text);
      }
    }
  };

  VariationForm.prototype.onResetDisplayedVariation = function (event) {
    var form = event.data.variationForm;
    form.$product.find('.product_meta').find('.sku').wc_reset_content();
    form.$product.find('.product_weight, .woocommerce-product-attributes-item--weight .woocommerce-product-attributes-item__value').wc_reset_content();
    form.$product.find('.product_dimensions, .woocommerce-product-attributes-item--dimensions .woocommerce-product-attributes-item__value').wc_reset_content();
    form.$form.trigger('reset_image');
    form.$singleVariation.slideUp(200).trigger('hide_variation');
  };

  VariationForm.prototype.onResetImage = function (event) {
    event.data.variationForm.$form.wc_variations_image_update(false);
  };

  VariationForm.prototype.onFindVariation = function (event) {
    var form = event.data.variationForm,
        attributes = form.getChosenAttributes(),
        currentAttributes = attributes.data;

    if (attributes.count === attributes.chosenCount) {
      if (form.useAjax) {
        if (form.xhr) {
          form.xhr.abort();
        }
        form.$form.block({ message: null, overlayCSS: { background: '#fff', opacity: 0.6 } });
        currentAttributes.product_id = parseInt(form.$form.data('product_id'), 10);
        currentAttributes.custom_data = form.$form.data('custom_data');
        form.xhr = $.ajax({
          url: wc_add_to_cart_variation_params.wc_ajax_url.toString().replace('%%endpoint%%', 'get_variation'),
          type: 'POST',
          data: currentAttributes,
          success: function success(variation) {
            if (variation) {
              form.$form.trigger('found_variation', [variation]);
            } else {
              form.$form.trigger('reset_data');
              attributes.chosenCount = 0;

              if (!form.loading) {
                form.$form.find('.single_variation').after('<p class="wc-no-matching-variations woocommerce-info">' + wc_add_to_cart_variation_params.i18n_no_matching_variations_text + '</p>');
                form.$form.find('.wc-no-matching-variations').slideDown(200);
              }
            }
          },
          complete: function complete() {
            form.$form.unblock();
          }
        });
      } else {
        form.$form.trigger('update_variation_values');

        var matching_variations = form.findMatchingVariations(form.variationData, currentAttributes),
            variation = matching_variations.shift();

        if (variation) {
          form.$form.trigger('found_variation', [variation]);
        } else {
          form.$form.trigger('reset_data');
          attributes.chosenCount = 0;

          if (!form.loading) {
            form.$form.find('.single_variation').after('<p class="wc-no-matching-variations woocommerce-info">' + wc_add_to_cart_variation_params.i18n_no_matching_variations_text + '</p>');
            form.$form.find('.wc-no-matching-variations').slideDown(200);
          }
        }
      }
    } else {
      form.$form.trigger('update_variation_values');
      form.$form.trigger('reset_data');
    }

    form.toggleResetLink(attributes.chosenCount > 0);
  };

  VariationForm.prototype.onFoundVariation = function (event, variation) {
    var form = event.data.variationForm,
        $sku = form.$product.find('.product_meta').find('.sku'),
        $weight = form.$product.find('.product_weight, .woocommerce-product-attributes-item--weight .woocommerce-product-attributes-item__value'),
        $dimensions = form.$product.find('.product_dimensions, .woocommerce-product-attributes-item--dimensions .woocommerce-product-attributes-item__value'),
        $qty = form.$singleVariationWrap.find('.quantity'),
        purchasable = true,
        variation_id = '',
        template = false,
        $template_html = '';

    if (variation.sku) {
      $sku.wc_set_content(variation.sku);
    } else {
      $sku.wc_reset_content();
    }

    if (variation.weight) {
      $weight.wc_set_content(variation.weight_html);
    } else {
      $weight.wc_reset_content();
    }

    if (variation.dimensions) {
      $dimensions.wc_set_content($.parseHTML(variation.dimensions_html)[0].data);
    } else {
      $dimensions.wc_reset_content();
    }

    form.$form.wc_variations_image_update(variation);

    if (!variation.variation_is_visible) {
      template = wp_template('unavailable-variation-template');
    } else {
      template = wp_template('variation-template');
      variation_id = variation.variation_id;
    }

    $template_html = template({
      variation: variation
    });
    $template_html = $template_html.replace('/*<![CDATA[*/', '');
    $template_html = $template_html.replace('/*]]>*/', '');

    form.$singleVariation.html($template_html);
    form.$form.find('input[name="variation_id"], input.variation_id').val(variation.variation_id).trigger('change');

    if (variation.is_sold_individually === 'yes') {
      $qty.find('input.qty').val('1').attr('min', '1').attr('max', '');
      $qty.hide();
    } else {
      $qty.find('input.qty').attr('min', variation.min_qty).attr('max', variation.max_qty);
      $qty.show();
    }

    if (!variation.is_purchasable || !variation.is_in_stock || !variation.variation_is_visible) {
      purchasable = false;
    }

    if (form.$singleVariation.text().trim()) {
      form.$singleVariation.slideDown(200).trigger('show_variation', [variation, purchasable]);
    } else {
      form.$singleVariation.show().trigger('show_variation', [variation, purchasable]);
    }
  };

  VariationForm.prototype.onChange = function (event) {
    var form = event.data.variationForm;

    form.$form.find('input[name="variation_id"], input.variation_id').val('').trigger('change');
    form.$form.find('.wc-no-matching-variations').remove();

    if (form.useAjax) {
      form.$form.trigger('check_variations');
    } else {
      form.$form.trigger('woocommerce_variation_select_change');
      form.$form.trigger('check_variations');
    }

   
    form.$form.trigger('woocommerce_variation_has_changed');
  };

  VariationForm.prototype.addSlashes = function (string) {
    string = string.replace(/'/g, '\\\'');
    string = string.replace(/"/g, '\\\"');
    return string;
  };

  VariationForm.prototype.onUpdateAttributes = function (event) {
    var form = event.data.variationForm,
        attributes = form.getChosenAttributes(),
        currentAttributes = attributes.data;

    if (form.useAjax) {
      return;
    }

    form.$attributeFields.each(function (index, el) {
      var current_attr_select = $(el),
          current_attr_name = current_attr_select.data('attribute_name') || current_attr_select.attr('name'),
          show_option_none = $(el).data('show_option_none'),
          option_gt_filter = ':gt(0)',
          attached_options_count = 0,
          new_attr_select = $('<select/>'),
          selected_attr_val = current_attr_select.val() || '',
          selected_attr_val_valid = true;

      if (!current_attr_select.data('attribute_html')) {
        var refSelect = current_attr_select.clone();

        refSelect.find('option').prop('disabled', false).prop('selected', false).removeAttr('attached');

        current_attr_select.data('attribute_options', refSelect.find('option' + option_gt_filter).get());
        current_attr_select.data('attribute_html', refSelect.html());
      }

      new_attr_select.html(current_attr_select.data('attribute_html'));

      var checkAttributes = $.extend(true, {}, currentAttributes);

      checkAttributes[current_attr_name] = '';

      var variations = form.findMatchingVariations(form.variationData, checkAttributes);

      for (var num in variations) {
        if (typeof variations[num] !== 'undefined') {
          var variationAttributes = variations[num].attributes;

          for (var attr_name in variationAttributes) {
            if (variationAttributes.hasOwnProperty(attr_name)) {
              var attr_val = variationAttributes[attr_name],
                  variation_active = '';

              if (attr_name === current_attr_name) {
                if (variations[num].variation_is_active) {
                  variation_active = 'enabled';
                }

              
                if (!variations[num].is_in_stock) {
                  variation_active += ' out-of-stock ';
                }

                if (attr_val) {
               
                  attr_val = $('<div/>').html(attr_val).text();

                  var $option_elements = new_attr_select.find('option');
                  if ($option_elements.length) {
                    for (var i = 0, len = $option_elements.length; i < len; i++) {
                      var $option_element = $($option_elements[i]),
                          option_value = $option_element.val();

                      if (attr_val === option_value) {
                        $option_element.addClass('attached ' + variation_active);
                        break;
                      }
                    }
                  }
                } else {

                  new_attr_select.find('option:gt(0)').addClass('attached ' + variation_active);
                }
              }
            }
          }
        }
      }

      attached_options_count = new_attr_select.find('option.attached').length;

      if (selected_attr_val) {
        selected_attr_val_valid = false;

        if (0 !== attached_options_count) {
          new_attr_select.find('option.attached.enabled').each(function () {
            var option_value = $(this).val();

            if (selected_attr_val === option_value) {
              selected_attr_val_valid = true;
              return false; 
            }
          });
        }
      }

      if (attached_options_count > 0 && selected_attr_val && selected_attr_val_valid && 'no' === show_option_none) {
        new_attr_select.find('option:first').remove();
        option_gt_filter = '';
      }

      new_attr_select.find('option' + option_gt_filter + ':not(.attached)').remove();

      current_attr_select.html(new_attr_select.html());
      current_attr_select.find('option' + option_gt_filter + ':not(.enabled)').prop('disabled', true);

      if (selected_attr_val) {
      
        if (selected_attr_val_valid) {
          current_attr_select.val(selected_attr_val);
        } else {

          current_attr_select.val('').trigger('change');
        }
      } else {
        current_attr_select.val(''); 
      }
    });


    form.$form.trigger('woocommerce_update_variation_values');
  };

  VariationForm.prototype.getChosenAttributes = function () {
    var data = {};
    var count = 0;
    var chosen = 0;

    this.$attributeFields.each(function () {
      var attribute_name = $(this).data('attribute_name') || $(this).attr('name');
      var value = $(this).val() || '';

      if (value.length > 0) {
        chosen++;
      }

      count++;
      data[attribute_name] = value;
    });

    return {
      'count': count,
      'chosenCount': chosen,
      'data': data
    };
  };

  VariationForm.prototype.findMatchingVariations = function (variations, attributes) {
    var matching = [];
    for (var i = 0; i < variations.length; i++) {
      var variation = variations[i];

      if (this.isMatch(variation.attributes, attributes)) {
        matching.push(variation);
      }
    }
    return matching;
  };

  VariationForm.prototype.isMatch = function (variation_attributes, attributes) {
    var match = true;
    for (var attr_name in variation_attributes) {
      if (variation_attributes.hasOwnProperty(attr_name)) {
        var val1 = variation_attributes[attr_name];
        var val2 = attributes[attr_name];
        if (val1 !== undefined && val2 !== undefined && val1.length !== 0 && val2.length !== 0 && val1 !== val2) {
          match = false;
        }
      }
    }
    return match;
  };

  VariationForm.prototype.toggleResetLink = function (on) {
    if (on) {
      if (this.$resetVariations.css('visibility') === 'hidden') {
        this.$resetVariations.css('visibility', 'visible').hide().fadeIn();
      }
    } else {
      this.$resetVariations.css('visibility', 'hidden');
    }
  };

  $.fn.wc_variation_form = function () {
    new VariationForm(this);
    return this;
  };

  $.fn.wc_set_content = function (content) {
    if (undefined === this.attr('data-o_content')) {
      this.attr('data-o_content', this.text());
    }
    this.text(content);
  };

  $.fn.wc_reset_content = function () {
    if (undefined !== this.attr('data-o_content')) {
      this.text(this.attr('data-o_content'));
    }
  };

  $.fn.wc_set_variation_attr = function (attr, value) {
    if (undefined === this.attr('data-o_' + attr)) {
      this.attr('data-o_' + attr, !this.attr(attr) ? '' : this.attr(attr));
    }
    if (false === value) {
      this.removeAttr(attr);
    } else {
      this.attr(attr, value);
    }
  };

  $.fn.wc_reset_variation_attr = function (attr) {
    if (undefined !== this.attr('data-o_' + attr)) {
      this.attr(attr, this.attr('data-o_' + attr));
    }
  };

  $.fn.wc_maybe_trigger_slide_position_reset = function (variation) {
    var $form = $(this),
        $product = $form.closest('.product'),
        $product_gallery = $product.find('.images'),
        reset_slide_position = false,
        new_image_id = variation && variation.image_id ? variation.image_id : '';

    if ($form.attr('current-image') !== new_image_id) {
      reset_slide_position = true;
    }

    $form.attr('current-image', new_image_id);

    if (reset_slide_position) {
      $product_gallery.trigger('woocommerce_gallery_reset_slide_position');
    }
  };

  $.fn.wc_variations_image_update = function (variation) {
    var $form = this,
        $product = $form.closest('.product'),
        $product_gallery = $product.find('.images'),
        $gallery_nav = $product.find('.flex-control-nav'),
        $gallery_img = $gallery_nav.find('li:eq(0) img'),
        $product_img_wrap = $product_gallery.find('.woocommerce-product-gallery__image, .woocommerce-product-gallery__image--placeholder').eq(0),
        $product_img = $product_img_wrap.find('.wp-post-image'),
        $product_link = $product_img_wrap.find('a').eq(0);

    if (variation && variation.image && variation.image.src && variation.image.src.length > 1) {
      var galleryHasImage = $gallery_nav.find('li img[data-o_src="' + variation.image.gallery_thumbnail_src + '"]').length > 0;

      if (galleryHasImage) {
        $form.wc_variations_image_reset();
      }

      var slideToImage = $gallery_nav.find('li img[src="' + variation.image.gallery_thumbnail_src + '"]');

      if (slideToImage.length > 0) {
        slideToImage.trigger('click');
        $form.attr('current-image', variation.image_id);
        window.setTimeout(function () {
          $(window).trigger('resize');
          $product_gallery.trigger('woocommerce_gallery_init_zoom');
        }, 20);
        return;
      }

      $product_img.wc_set_variation_attr('src', variation.image.src);
      $product_img.wc_set_variation_attr('height', variation.image.src_h);
      $product_img.wc_set_variation_attr('width', variation.image.src_w);
      $product_img.wc_set_variation_attr('srcset', variation.image.srcset);
      $product_img.wc_set_variation_attr('sizes', variation.image.sizes);
      $product_img.wc_set_variation_attr('title', variation.image.title);
      $product_img.wc_set_variation_attr('data-caption', variation.image.caption);
      $product_img.wc_set_variation_attr('alt', variation.image.alt);
      $product_img.wc_set_variation_attr('data-src', variation.image.full_src);
      $product_img.wc_set_variation_attr('data-large_image', variation.image.full_src);
      $product_img.wc_set_variation_attr('data-large_image_width', variation.image.full_src_w);
      $product_img.wc_set_variation_attr('data-large_image_height', variation.image.full_src_h);
      $product_img_wrap.wc_set_variation_attr('data-thumb', variation.image.src);
      $gallery_img.wc_set_variation_attr('src', variation.image.gallery_thumbnail_src);
      $product_link.wc_set_variation_attr('href', variation.image.full_src);
    } else {
      $form.wc_variations_image_reset();
    }

    window.setTimeout(function () {
      $(window).trigger('resize');
      $form.wc_maybe_trigger_slide_position_reset(variation);
      $product_gallery.trigger('woocommerce_gallery_init_zoom');
    }, 20);
  };

  $.fn.wc_variations_image_reset = function () {
    var $form = this,
        $product = $form.closest('.product'),
        $product_gallery = $product.find('.images'),
        $gallery_nav = $product.find('.flex-control-nav'),
        $gallery_img = $gallery_nav.find('li:eq(0) img'),
        $product_img_wrap = $product_gallery.find('.woocommerce-product-gallery__image, .woocommerce-product-gallery__image--placeholder').eq(0),
        $product_img = $product_img_wrap.find('.wp-post-image'),
        $product_link = $product_img_wrap.find('a').eq(0);

    $product_img.wc_reset_variation_attr('src');
    $product_img.wc_reset_variation_attr('width');
    $product_img.wc_reset_variation_attr('height');
    $product_img.wc_reset_variation_attr('srcset');
    $product_img.wc_reset_variation_attr('sizes');
    $product_img.wc_reset_variation_attr('title');
    $product_img.wc_reset_variation_attr('data-caption');
    $product_img.wc_reset_variation_attr('alt');
    $product_img.wc_reset_variation_attr('data-src');
    $product_img.wc_reset_variation_attr('data-large_image');
    $product_img.wc_reset_variation_attr('data-large_image_width');
    $product_img.wc_reset_variation_attr('data-large_image_height');
    $product_img_wrap.wc_reset_variation_attr('data-thumb');
    $gallery_img.wc_reset_variation_attr('src');
    $product_link.wc_reset_variation_attr('href');
  };

  $(function () {
    if (typeof wc_add_to_cart_variation_params !== 'undefined') {
      $('.variations_form').each(function () {
        $(this).wc_variation_form();
      });
    }
  });


  var wc_variation_form_matcher = {
    find_matching_variations: function find_matching_variations(product_variations, settings) {
      var matching = [];
      for (var i = 0; i < product_variations.length; i++) {
        var variation = product_variations[i];

        if (wc_variation_form_matcher.variations_match(variation.attributes, settings)) {
          matching.push(variation);
        }
      }
      return matching;
    },
    variations_match: function variations_match(attrs1, attrs2) {
      var match = true;
      for (var attr_name in attrs1) {
        if (attrs1.hasOwnProperty(attr_name)) {
          var val1 = attrs1[attr_name];
          var val2 = attrs2[attr_name];
          if (val1 !== undefined && val2 !== undefined && val1.length !== 0 && val2.length !== 0 && val1 !== val2) {
            match = false;
          }
        }
      }
      return match;
    }

  };var wp_template = function wp_template(templateId) {
    var html = document.getElementById('tmpl-' + templateId).textContent;
    var hard = false;

    hard = hard || /<#\s?data\./.test(html);

    hard = hard || /{{{?\s?data\.(?!variation\.).+}}}?/.test(html);

    hard = hard || /{{{?\s?data\.variation\.[\w-]*[^\s}]/.test(html);
    if (hard) {
      return wp.template(templateId);
    }
    return function template(data) {
      var variation = data.variation || {};
      return html.replace(/({{{?)\s?data\.variation\.([\w-]*)\s?(}}}?)/g, function (_, open, key, close) {

        if (open.length !== close.length) {
          return '';
        }
        var replacement = variation[key] || '';

        if (open.length === 2) {
          return window.escape(replacement);
        }
        return replacement;
      });
    };
  };
})(jQuery, window, document);

 }),
 (function(module, exports) {

 }),
 (function(module, exports) {


 }),
(function(module, exports) {


 })
 ]);