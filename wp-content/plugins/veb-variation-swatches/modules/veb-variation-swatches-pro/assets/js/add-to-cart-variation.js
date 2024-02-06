
/**
 * WooCommerce Additional Variation Images And Swatches Pro
 *
 * This source file is subject to the GNU General Public License v3.0
 * that is bundled with this package in the file license.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.gnu.org/licenses/gpl-3.0.html
 * 
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to support@innovativewp.org so we can send you a copy immediately.
 *
 * @author    InnovativeWP
 * @copyright Copyright (c) 2021, InnovativeWP.
 * @license   http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License v3.0
 */

 (function() { 
var __webpack_exports__ = {};
;

(function ($, window, document, undefined) {

  var VariationForm = function VariationForm($form) {
    var self = this;
    self.$form = $form;
    self.$wrapper = $form.find('>div');
    self.threshold_max = parseInt(self.$wrapper.data('threshold_max'), 10);
    self.total_children = parseInt(self.$wrapper.data('total'), 10);
    self.$attributeFields = $form.find('.variations select');
    self.$singleVariation = $form.find('.single_variation');
    self.$singleVariationWrap = $form.find('.single_variation_wrap');
    self.$resetVariations = $form.find('.reset_variations');
    self.$product = $form.closest('.product');
    self.variationData = $form.data('product_variations');
    self.useAjax = false === self.variationData;
    self.xhr = false;
    self.previewXhr = false;
    self.loading = true;
    self.product_id = parseInt($form.data('product_id'), 10);

    if (veb_variation_swatches_pro_options.enable_linkable_url) {
      self.currentURL = new URL(window.location.href);
    }

    self.$firstUL = $form.find('.variations ul:first');
    var single_variation_preview_selector = false;
    self.single_variation_preview_selected = false;

    if (veb_variation_swatches_pro_options.enable_single_variation_preview) {
      var name = self.$firstUL.data('preview_attribute_name') ? self.$firstUL.data('preview_attribute_name') : self.$attributeFields.first().data('attribute_name');
      single_variation_preview_selector = ".variations select[data-attribute_name='".concat(name, "']");
      self.single_variation_preview_selected = ".variations select[data-attribute_name='".concat(name, "']");
    } 


    self.$singleVariationWrap.show();
    self.$form.off('.wc-variation-form'); 

    self.getChosenAttributes = self.getChosenAttributes.bind(self);
    self.findMatchingVariations = self.findMatchingVariations.bind(self);
    self.isMatch = self.isMatch.bind(self);
    self.toggleResetLink = self.toggleResetLink.bind(self);
    self.generateShareableURL = self.generateShareableURL.bind(self); 

    $form.on('click.wc-variation-form', '.reset_variations', {
      variationForm: self
    }, self.onReset);
    $form.on('reload_product_variations', {
      variationForm: self
    }, self.onReload);
    $form.on('hide_variation', {
      variationForm: self
    }, self.onHide);
    $form.on('show_variation', {
      variationForm: self
    }, self.onShow);
    $form.on('click', '.single_add_to_cart_button', {
      variationForm: self
    }, self.onAddToCart);
    $form.on('reset_data.wc-variation-form', {
      variationForm: self
    }, self.onResetDisplayedVariation);
    $form.on('reset_image.wc-variation-form', {
      variationForm: self
    }, self.onResetImage);
    $form.on('change.wc-variation-form', '.variations select', {
      variationForm: self
    }, self.onChange);
    $form.on('found_variation.wc-variation-form', {
      variationForm: self
    }, self.onFoundVariation);
    $form.on('check_variations.wc-variation-form', {
      variationForm: self
    }, self.onFindVariation);
    $form.on('update_variation_values.wc-variation-form', {
      variationForm: self
    }, self.onUpdateAttributes);

    if (veb_variation_swatches_pro_options.enable_single_variation_preview) {
      $form.on('veb_variation_swatches_add-to-cart-variation_start.wc-variation-form', {
        variationForm: self
      }, self.initPreviewChange);
      $form.on('change.wc-variation-form', single_variation_preview_selector, {
        variationForm: self
      }, self.onPreviewChange);
      $form.on('click.wc-variation-form', '.reset_variations', {
        variationForm: self
      }, self.onResetPreview);
    } 


    $form.on('veb_variation_swatches_add-to-cart-variation_init.wc-variation-form', {
      variationForm: self
    }, self.initFetch);
    $form.trigger('veb_variation_swatches_add-to-cart-variation_init', self); 
  };

  VariationForm.prototype.start = function (event) {
    var form = event.data.variationForm;
    setTimeout(function () {
      form.$form.trigger('check_variations');
      form.$form.trigger('wc_variation_form', self);
      form.$form.trigger('veb_variation_swatches_add-to-cart-variation_start', self);
      form.loading = false;
    }, 100);
  };


  VariationForm.prototype.init = function (event) {
    var form = event.data.variationForm;
    var limit = parseInt(wc_add_to_cart_variation_params.veb_variation_swatches_ajax_variation_threshold_max, 10);
    var total = parseInt(wc_add_to_cart_variation_params.veb_variation_swatches_total_children, 10);
    var product_id = form.product_id;

    if (form.useAjax && limit >= total) {
      if (form.xhr) {
        form.xhr.abort();
      }

      if (veb_variation_swatches_pro_options.enable_single_preloader) {
        form.$form.block({
          message: null,
          overlayCSS: {
            background: '#FFFFFF',
            opacity: 0.6
          }
        });
      }

      form.xhr = $.ajax({
        global: false,
        cache: true,
        url: wc_add_to_cart_variation_params.wc_ajax_url.toString().replace('%%endpoint%%', 'woo_get_all_variations'),
        method: 'POST',
        data: {
          product_id: product_id,
          is_archive: false
        }
      });
      form.xhr.fail(function (jqXHR, textStatus) {
        console.error("single product variations ajax failed: ".concat(product_id, "."), textStatus);
      });
      form.xhr.done(function (variations) {
        if (variations) {
          form.$form.data('product_variations', variations);
          form.variationData = form.$form.data('product_variations');
          form.useAjax = false;
          form.start(event);
        } else {
          console.error("single product variations not available on: ".concat(product_id, "."));
        }
      });
      form.xhr.always(function () {
        if (veb_variation_swatches_pro_options.enable_single_preloader) {
          form.$form.unblock();
        }
      });
    } else {
      form.start(event);
    }
  }; 


  VariationForm.prototype.initFetch = function (event) {
    var form = event.data.variationForm;
    var limit = parseInt(wc_add_to_cart_variation_params.veb_variation_swatches_ajax_variation_threshold_max, 10);
    var total = parseInt(wc_add_to_cart_variation_params.veb_variation_swatches_total_children, 10);
    var product_id = form.product_id;
    limit = isNaN(limit) ? form.threshold_max : limit;
    total = isNaN(total) ? form.total_children : total;
    if (form.useAjax && limit >= total) {
      if (veb_variation_swatches_pro_options.enable_single_preloader) {
        form.$form.block({
          message: null,
          overlayCSS: {
            background: '#FFFFFF',
            opacity: 0.6
          }
        });
      }

      wp.apiFetch({
        path: "veb-variation-swatches/v1/single-product/".concat(product_id)
      }).then(function (variations) {
        form.$form.data('product_variations', variations);
        form.variationData = form.$form.data('product_variations');
        form.useAjax = false;
        form.start(event);
      })["catch"](function (error) {
        console.error("single product variations fetching failed: ".concat(product_id, "."), error);
      })["finally"](function () {
        if (veb_variation_swatches_pro_options.enable_single_preloader) {
          form.$form.unblock();
        }
      });
    } else {
      form.start(event);
    }
  };

  VariationForm.prototype.onReset = function (event) {
    event.preventDefault();
    event.data.variationForm.$attributeFields.val('').trigger('change');
    event.data.variationForm.$form.trigger('reset_data');
  };

  VariationForm.prototype.onResetPreview = function (event) {
    var form = event.data.variationForm;
    form.$form.on('reset_image.wc-variation-form', {
      variationForm: form
    }, form.onResetImage).trigger('reset_image');
  };

  VariationForm.prototype.showPreviewFetch = function (form, attribute_name, value) {
    var attributes = form.getChosenAttributes();
    var currentAttributes = {};

    if (value && attributes.count && attributes.count > attributes.chosenCount) {
      currentAttributes['product_id'] = form.product_id;
      currentAttributes[attribute_name] = value;
      var $gallery = $('.woocommerce-product-gallery');

      if ($gallery.length > 0) {
        $gallery.block({
          message: null,
          overlayCSS: {
            background: '#FFFFFF',
            opacity: 0.6
          }
        });
      }

      wp.apiFetch({
        path: wp.url.addQueryArgs("/veb-variation-swatches/v1/single-product-preview", currentAttributes)
      }).then(function (variation) {
        var attributes = form.getChosenAttributes();

        if (attributes.count && attributes.count > attributes.chosenCount) {
          form.$form.off('reset_image.wc-variation-form');
          form.$form.wc_variations_image_update(variation); 

          form.$form.trigger('show_variation', [variation, false]);
        }

        if ($gallery.length > 0) {
          $gallery.unblock();
        }
      })["catch"](function (error) {
        console.error("single product variation preview fetching failed: ".concat(form.product_id, "."), error);
      })["finally"](function () {
        if ($gallery.length > 0) {
          $gallery.unblock();
        }
      });
    }

    if (!value && veb_variation_swatches_pro_options.clear_on_reselect) {
      form.$form.on('reset_image.wc-variation-form', {
        variationForm: form
      }, form.onResetImage).trigger('reset_image');
    }
  };

  VariationForm.prototype.initPreviewChange = function (event) {
    var form = event.data.variationForm;
    var attribute_name = $(form.single_variation_preview_selected).data('attribute_name') || $(form.single_variation_preview_selected).attr('name');
    var value = $(form.single_variation_preview_selected).val() || '';
    form.showPreviewFetch(form, attribute_name, value);
  };

  VariationForm.prototype.onPreviewChange = function (event) {
    event.preventDefault();
    var form = event.data.variationForm;
    var attribute_name = $(this).data('attribute_name') || $(this).attr('name');
    var value = $(this).val() || '';
    form.showPreviewFetch(form, attribute_name, value);
  };

  VariationForm.prototype.__showPreview = function (form, attribute_name, value) {
    var _this = this;

    var attributes = form.getChosenAttributes();
    var currentAttributes = {};

    if (value && attributes.count && attributes.count > attributes.chosenCount) {
      currentAttributes['product_id'] = form.product_id;
      currentAttributes[attribute_name] = value;

      if ($('.woocommerce-product-gallery').length > 0) {
        $('.woocommerce-product-gallery').block({
          message: null,
          overlayCSS: {
            background: '#FFFFFF',
            opacity: 0.6
          }
        });
      }

      form.previewXhr = $.ajax({
        global: false,
        url: veb_variation_swatches_pro_params.wc_ajax_url.toString().replace('%%endpoint%%', 'woo_get_preview_variation'),
        method: 'POST',
        data: currentAttributes
      });
      form.previewXhr.fail(function (jqXHR, textStatus) {
        console.error("product preview not available on ".concat(_this.product_id, "."), attribute_name, textStatus);
      });
      form.previewXhr.done(function (variation) {

        form.$form.off('reset_image.wc-variation-form');

        form.$form.wc_variations_image_update(variation);
        form.$form.trigger('show_variation', [variation, false]);

        if ($('.woocommerce-product-gallery').length > 0) {
          $('.woocommerce-product-gallery').unblock();
        }
      });
    }

    if (!value && veb_variation_swatches_pro_options.clear_on_reselect) {
      form.$form.on('reset_image.wc-variation-form', {
        variationForm: form
      }, form.onResetImage).trigger('reset_image');
    }
  };

  VariationForm.prototype.__onPreviewChange = function (event) {
    var _this2 = this;

    event.preventDefault();
    var form = event.data.variationForm;
    var attribute_name = $(this).data('attribute_name') || $(this).attr('name');
    var value = $(this).val() || '';
    var attributes = form.getChosenAttributes();
    var currentAttributes = {};

    if (value && attributes.count && attributes.count > attributes.chosenCount) {
      currentAttributes['product_id'] = form.product_id;
      currentAttributes[attribute_name] = value;

      if ($('.woocommerce-product-gallery').length > 0) {
        $('.woocommerce-product-gallery').block({
          message: null,
          overlayCSS: {
            background: '#FFFFFF',
            opacity: 0.6
          }
        });
      }

      form.previewXhr = $.ajax({
        global: false,
        url: veb_variation_swatches_pro_params.wc_ajax_url.toString().replace('%%endpoint%%', 'woo_get_preview_variation'),
        method: 'POST',
        data: currentAttributes
      });
      form.previewXhr.fail(function (jqXHR, textStatus) {
        console.error("product preview not available on ".concat(_this2.product_id, "."), attribute_name, textStatus);
      });
      form.previewXhr.done(function (variation) {

        form.$form.off('reset_image.wc-variation-form');

        form.$form.wc_variations_image_update(variation);
        form.$form.trigger('show_variation', [variation, false]);

        if ($('.woocommerce-product-gallery').length > 0) {
          $('.woocommerce-product-gallery').unblock();
        }
      });
    }

    if (!value && veb_variation_swatches_pro_options.clear_on_reselect) {
      form.$form.on('reset_image.wc-variation-form', {
        variationForm: form
      }, form.onResetImage).trigger('reset_image');
    }
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

  VariationForm.prototype.generateShareableURL = function (attributes) {
    if (veb_variation_swatches_pro_options.enable_linkable_url) {
      var oldURL = this.currentURL;

      if (attributes.chosenCount > 0) {
        var newURL = new URL(window.location.href);

        for (var key in attributes.data) {
          var value = attributes.data[key];

          if (value) {
            newURL.searchParams.set(key, value); 
          }
        }

        if (oldURL.href !== newURL.href) {
          window.history.replaceState({}, '', newURL.href);
        }
      } else {
        window.history.replaceState({}, '', this.$form.attr('action'));
      }
    }
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

  VariationForm.prototype.onFindVariation = function (event, chosenAttributes) {
    var form = event.data.variationForm,
        attributes = 'undefined' !== typeof chosenAttributes ? chosenAttributes : form.getChosenAttributes(),
        currentAttributes = attributes.data;
    form.generateShareableURL(attributes);

    if (attributes.count && attributes.count === attributes.chosenCount) {
      if (form.useAjax) {
        if (form.xhr) {
          form.xhr.abort();
        }

        form.$form.block({
          message: null,
          overlayCSS: {
            background: '#FFFFFF',
            opacity: 0.6
          }
        });
        currentAttributes.product_id = parseInt(form.$form.data('product_id'), 10);
        currentAttributes.custom_data = form.$form.data('custom_data');
        form.xhr = $.ajax({
          global: false,
          url: wc_add_to_cart_variation_params.wc_ajax_url.toString().replace('%%endpoint%%', 'get_variation'),
          method: 'POST',
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
      $qty.find('input.qty').val('1').attr('min', '1').attr('max', '').trigger('change');
      $qty.hide();
    } else {
      var $qty_input = $qty.find('input.qty'),
          qty_val = parseFloat($qty_input.val());

      if (isNaN(qty_val)) {
        qty_val = variation.min_qty;
      } else {
        qty_val = qty_val > parseFloat(variation.max_qty) ? variation.max_qty : qty_val;
        qty_val = qty_val < parseFloat(variation.min_qty) ? variation.min_qty : qty_val;
      }

      $qty_input.attr('min', variation.min_qty).attr('max', variation.max_qty).val(qty_val).trigger('change');
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
        refSelect.find('option').removeAttr('attached').prop('disabled', false).prop('selected', false);

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
                  variation_active = '',
                  variation_out_of_stock = false;

              if (attr_name === current_attr_name) {
                if (variations[num].variation_is_active) {
                  variation_active = 'enabled';
                }

                if (!variations[num].is_in_stock) {
                  variation_out_of_stock = true;
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

                        if (attributes.count > 1 && attributes.chosenCount > 0 && !selected_attr_val && variation_out_of_stock) {
                          $option_element.addClass('out-of-stock');
                        }

                        if (attributes.count > 1 && attributes.chosenCount === attributes.count && variation_out_of_stock) {
                          $option_element.addClass('out-of-stock');
                        }

                        if (attributes.count === 1 && variation_out_of_stock) {
                          $option_element.addClass('out-of-stock');
                        }

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

  var wp_template = function wp_template(templateId) {
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
 })()
;