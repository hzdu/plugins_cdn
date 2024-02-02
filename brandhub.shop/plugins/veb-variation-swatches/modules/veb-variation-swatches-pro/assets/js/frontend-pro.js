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
!function() {
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(function (window) {
  'use strict';

  var Plugin = function ($) {
    return function () {
      function _class2(element, options, name) {
        var _this = this;

        _classCallCheck(this, _class2);

        _defineProperty(this, "defaults", {});

        _defineProperty(this, "onInit", function (event) {
          _this.initFetch();
        });

        _defineProperty(this, "onAjaxAddToCart", function (event) {
          if ($(event.target).is('.loading')) {
            return false;
          }

          if ($(event.target).is('.inwp_ajax_add_to_cart')) {
            event.preventDefault();
            event.stopPropagation();

            _this.AjaxAddToCart(event.target);
          }
        });

        _defineProperty(this, "onExpandVariableItems", function (event) {
          event.preventDefault();

          _this.expandVariableItems(event);
        });

        _defineProperty(this, "onPreviewChange", function (event) {
          event.preventDefault();

          _this.$element.off('reset_data.wc-variation-form');


          _this.fetchPreviewChange(event.currentTarget);
        });

        _defineProperty(this, "onChange", function (event) {
          _this.$element.trigger('woocommerce_variation_select_change');

          _this.$element.trigger('check_variations');


          _this.$element.trigger('woocommerce_variation_has_changed');
        });

        _defineProperty(this, "onReset", function (event) {
          event.preventDefault();

          _this.reset();
        });

        _defineProperty(this, "onResetDisplayedVariation", function (event) {
          _this.resetDisplayedVariation();
        });

        _defineProperty(this, "onUpdateAttributes", function (event) {
          _this.updateAttributes(event);
        });

        _defineProperty(this, "onCheckVariations", function (event) {
          _this.checkVariations();
        });

        _defineProperty(this, "onVariationChanged", function (event) {
          _this.setupSwatchesItems();
        });

        _defineProperty(this, "onFoundVariation", function (event, variation, is_ajax) {
          _this.foundVariation(variation, is_ajax);
        });

        this.name = name;
        this.element = element;
        this.$element = $(element);
        this.settings = $.extend(true, {}, this.defaults, options);
        this.product_variations = this.$element.data('product_variations') || [];
        this.is_ajax_variation = this.product_variations.length < 1;
        this.product_id = parseInt(this.$element.data('product_id'), 10);
        this.threshold_min = parseInt(this.$element.data('threshold_min'), 10);
        this.threshold_max = parseInt(this.$element.data('threshold_max'), 10);
        this.total_children = parseInt(this.$element.data('total_children'), 10);
        this.total_attribute = parseInt(this.$element.data('total_attribute'), 10);
        this.xhr = false;
        this.previewXhr = false;
        this.loading = true;
        this.$information = this.$element.find('.inwp-archive-information');
        this.$wrapper = this.$element.closest(veb_variation_swatches_pro_options.archive_product_wrapper);
        this.$image = this.$wrapper.find(veb_variation_swatches_pro_options.archive_image_selector);
        this.$cart_button = this.$wrapper.find(veb_variation_swatches_pro_options.archive_cart_button_selector);
        this.$price = this.$wrapper.find('.price');
        this.$firstUL = this.$element.find('.variations ul:first');

        this.is_cart_button_available = this.$cart_button.length > 0;

        this.$price_html = this.$price.clone().html();
        this.$attributeFields = this.$element.find('.variations select');
        this.$resetVariations = this.$element.find('.inwp_archive_reset_variations');
        var single_variation_preview_selector = false;
        var single_variation_preview_selected = false;

        if (veb_variation_swatches_pro_options.enable_single_variation_preview && veb_variation_swatches_pro_options.enable_single_variation_preview_archive) {
          var _name = this.$firstUL.data('preview_attribute_name') ? this.$firstUL.data('preview_attribute_name') : this.$attributeFields.first().data('attribute_name');

          single_variation_preview_selector = ".variations select[data-attribute_name='".concat(_name, "']");
        }

        this.$element.off('.wc-variation-form');
        this.$element.addClass('inwp-pro-loaded');

        this.$element.on('click.wc-variation-form', '.inwp_archive_reset_variations > a', this.onReset);
        this.$element.on('change.wc-variation-form', '.variations select', this.onChange);

        this.$element.on('check_variations.wc-variation-form', this.onCheckVariations);
        this.$element.on('update_variation_values.wc-variation-form', this.onUpdateAttributes);
        this.$element.on('found_variation.wc-variation-form', this.onFoundVariation);
        this.$element.on('reset_data.wc-variation-form', this.onResetDisplayedVariation);
        this.$element.on('woocommerce_variation_has_changed.wc-variation-form', this.onVariationChanged);

        if (this.is_cart_button_available) {
          this.$cart_button.on('click.wc-variation-form', this.onAjaxAddToCart);
        }

        if (this.haveSingleVariationPreview()) {
          this.$element.on('click.wc-variation-form', '.inwp_archive_reset_variations > a', this.onResetDisplayedVariation);
          this.$element.on('change.wc-variation-form', single_variation_preview_selector, this.onPreviewChange);
        }

        if ('expand' === veb_variation_swatches_pro_options.catalog_mode_behaviour) {
          this.$element.on('click.wc-variation-form', '.veb-variation-swatches-variable-item-more', this.onExpandVariableItems);
        }

        this.$element.on('veb_variation_swatches_pro_loaded.wc-variation-form', this.onInit);
        this.$element.trigger('veb_variation_swatches_pro_loaded', this);
      }

      _createClass(_class2, [{
        key: "start",
        value: function start() {
          var _this2 = this;

          setTimeout(function () {
            _this2.$element.trigger('check_variations'); 


            _this2.$element.trigger('veb_variation_swatches_pro', _this2);

            _this2.swatchInit();
          }, 100);
        }
      }, {
        key: "haveSingleVariationPreview",
        value: function haveSingleVariationPreview() {
          return !veb_variation_swatches_pro_options.enable_catalog_mode && veb_variation_swatches_pro_options.enable_single_variation_preview && veb_variation_swatches_pro_options.enable_single_variation_preview_archive;
        }
      }, {
        key: "AjaxAddToCart",
        value: function AjaxAddToCart(button) {
          var $thisbutton = $(button);
          var quantity = $thisbutton.data('quantity');
          var args = this.getQueryArgs($thisbutton.attr('href'));
          var variations = this.getAttributes(args);
          var product_id = args.variation_id;

          var data = _objectSpread(_objectSpread({}, variations), {}, {
            quantity: quantity,
            product_id: product_id
          });

          $thisbutton.removeClass('added');
          $thisbutton.addClass('loading'); 

          $(document.body).trigger('adding_to_cart', [$thisbutton, data]);
          $.ajax({
            dataType: 'json',
            global: false,
            url: veb_variation_swatches_pro_params.wc_ajax_url.toString().replace('%%endpoint%%', 'woo_add_to_cart_variation'),
            method: 'POST',
            data: data
          }).fail(function (jqXHR, textStatus) {
            console.error("product cart data not available.", data, textStatus);
          }).done(function (response) {
            if (!response) {
              return;
            }

            if (response.error && response.product_url) {
              window.location = response.product_url;
              return;
            }


            if (veb_variation_swatches_pro_options.cart_redirect_after_add === 'yes') {
              window.location = veb_variation_swatches_pro_options.cart_url;
              return;
            } 


            $(document.body).trigger('added_to_cart', [response.fragments, response.cart_hash, $thisbutton]);
          }).always(function () {});
        }
      }, {
        key: "getAttributes",
        value: function getAttributes(raw_attributes) {
          var attributes = {};

          for (var attr_name in raw_attributes) {
            if ('attribute_' === attr_name.substring(0, 10)) {
              attributes[attr_name] = raw_attributes[attr_name];
            }
          }

          return attributes;
        }
      }, {
        key: "expandVariableItems",
        value: function expandVariableItems(event) {
          $(event.currentTarget).parent().removeClass('enabled-display-limit-mode enabled-catalog-display-limit-mode');
          $(event.currentTarget).remove();
        }
      }, {
        key: "init",
        value: function init() {
          var _this3 = this;

          var limit = this.threshold_max;
          var total = this.total_children; 
          this.defaultImage();
          this.defaultCartButton();

          if (this.isAjaxVariation() && limit >= total) {
            if (this.xhr) {
              this.xhr.abort();
            }

            if (veb_variation_swatches_pro_options.enable_archive_preloader) {
              this.$element.block({
                message: null,
                overlayCSS: {
                  background: '#FFFFFF',
                  opacity: 0.6
                }
              });
            }

            this.xhr = $.ajax({
              global: false,
              cache: true,
              url: veb_variation_swatches_pro_params.wc_ajax_url.toString().replace('%%endpoint%%', 'woo_get_variations'),
              method: 'POST',
              data: {
                product_id: this.product_id,
                is_archive: true
              }
            });
            this.xhr.fail(function (jqXHR, textStatus) {
              console.error("product archive variations not available on: ".concat(_this3.product_id, "."), textStatus);
            });
            this.xhr.done(function (variations) {
              if (variations) {
                _this3.$element.data('product_variations', variations);

                _this3.product_variations = _this3.$element.data('product_variations');
                _this3.is_ajax_variation = false;

                _this3.start();
              }
            });
            this.xhr.always(function () {
              if (veb_variation_swatches_pro_options.enable_archive_preloader) {
                _this3.$element.unblock();
              }
            });
          } else {
            this.start();
          }
        }
      }, {
        key: "initFetch",
        value: function initFetch() {
          var _this4 = this;

          var limit = this.threshold_max;
          var total = this.total_children;
          this.defaultImage();
          this.defaultCartButton();

          if (this.isAjaxVariation() && limit >= total) {
            if (veb_variation_swatches_pro_options.enable_archive_preloader) {
              this.$element.block({
                message: null,
                overlayCSS: {
                  background: '#FFFFFF',
                  opacity: 0.6
                }
              });
            }

            wp.apiFetch({
              path: "veb-variation-swatches/v1/archive-product/".concat(this.product_id)
            }).then(function (variations) {
              _this4.$element.data('product_variations', variations);

              _this4.product_variations = _this4.$element.data('product_variations');
              _this4.is_ajax_variation = false;

              _this4.start();
            })["catch"](function (error) {
              console.error("archive product variations fetching failed: ".concat(_this4.product_id, "."), error);
            })["finally"](function () {
              if (veb_variation_swatches_pro_options.enable_archive_preloader) {
                _this4.$element.unblock();
              }
            });
          } else {
            this.start();
          }
        }
      }, {
        key: "fetchPreviewChange",
        value: function fetchPreviewChange(el) {
          var _this5 = this;

          var attribute_name = $(el).data('attribute_name') || $(el).attr('name');
          var value = $(el).val() || '';
          var currentAttributes = {};
          var attributes = this.getChosenAttributes();

          if (value && attributes.count && attributes.count > attributes.chosenCount) {
            currentAttributes['product_id'] = this.product_id;
            currentAttributes[attribute_name] = value;
            wp.apiFetch({
              path: wp.url.addQueryArgs("/veb-variation-swatches/v1/archive-product-preview", currentAttributes)
            }).then(function (variation) {
              _this5.updatePreviewImage(variation);
            })["catch"](function (error) {
              console.error("archive product variation preview fetching failed: ".concat(_this5.product_id, "."), error);
            })["finally"](function () {});
          }
        }
      }, {
        key: "previewChange",
        value: function previewChange(el) {
          var _this6 = this;

          var attribute_name = $(el).data('attribute_name') || $(el).attr('name');
          var value = $(el).val() || '';
          var currentAttributes = {};
          var attributes = this.getChosenAttributes();

          if (value && attributes.count && attributes.count > attributes.chosenCount) {
            currentAttributes['product_id'] = this.product_id;
            currentAttributes[attribute_name] = value;
            this.previewXhr = $.ajax({
              global: false,
              url: veb_variation_swatches_pro_params.wc_ajax_url.toString().replace('%%endpoint%%', 'woo_get_preview_variation'),
              method: 'POST',
              data: currentAttributes
            });
            this.previewXhr.fail(function (jqXHR, textStatus) {
              console.error("archive product preview not available on ".concat(_this6.product_id, "."), attribute_name, textStatus);
            });
            this.previewXhr.done(function (variation) {
              _this6.updatePreviewImage(variation);
            });
          }
        }
      }, {
        key: "getAvailableVariations",
        value: function getAvailableVariations() {
          return this.$element.data('product_variations') || [];
        }
      }, {
        key: "toggleResetLink",
        value: function toggleResetLink(show) {
          if (show) {
            this.$resetVariations.removeClass('show hide').addClass('show');
          } else {
            this.$resetVariations.removeClass('show hide').addClass('hide');
          }
        }
      }, {
        key: "reset",
        value: function reset() {
          this.$attributeFields.val('').trigger('change');
          this.$element.trigger('reset_data');
        }
      }, {
        key: "getChosenAttributes",
        value: function getChosenAttributes() {
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
        }
      }, {
        key: "isMatch",
        value: function isMatch(variation_attributes, attributes) {
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
        }
      }, {
        key: "findMatchingVariations",
        value: function findMatchingVariations(variations, attributes) {
          var matching = [];

          for (var i = 0; i < variations.length; i++) {
            var variation = variations[i];

            if (this.isMatch(variation.attributes, attributes)) {
              matching.push(variation);
            }
          }

          return matching;
        }
      }, {
        key: "updateAttributes",
        value: function updateAttributes(event) {
          var _this7 = this;

          var attributes = this.getChosenAttributes();
          var currentAttributes = attributes.data;

          if (this.isAjaxVariation()) {
            return;
          }
          this.$attributeFields.each(function (index, el) {
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

              refSelect.find('option').prop('disabled', false).prop('selected', false).removeAttr('attached').removeClass('out-of-stock'); 

              current_attr_select.data('attribute_html', refSelect.html());
            }

            new_attr_select.html(current_attr_select.data('attribute_html')); 

            var checkAttributes = $.extend(true, {}, currentAttributes);
            checkAttributes[current_attr_name] = '';

            var variations = _this7.findMatchingVariations(_this7.getAvailableVariations(), checkAttributes);


            for (var num in variations) {
              if (typeof variations[num] !== 'undefined') {
                var variationAttributes = variations[num].attributes;

                for (var attr_name in variationAttributes) {
                  if (variationAttributes.hasOwnProperty(attr_name)) {
                    var attr_val = variationAttributes[attr_name];
                    var variation_active = '';
                    var variation_out_of_stock = false;

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
                            var $option_element = $($option_elements[i]);
                            var option_value = $option_element.val();

                            if (attr_val === option_value) {
                              $option_element.addClass('attached ' + variation_active);

                              if (attributes.count > 1 && attributes.chosenCount > 0 && !selected_attr_val && variation_out_of_stock) {
                                $option_element.addClass('out-of-stock');
                              }


                              if (attributes.count > 1 && attributes.chosenCount === attributes.count && variation_out_of_stock) {
                                $option_element.addClass('out-of-stock');
                              }

                              if (!veb_variation_swatches_pro_options.enable_clickable_out_of_stock_archive && attributes.count === 1 && variation_out_of_stock) {
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

          this.$element.trigger('woocommerce_update_variation_values');
        }
      }, {
        key: "checkVariations",
        value: function checkVariations() {
          var _this8 = this;

          var chosenAttributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
          var attributes = chosenAttributes ? chosenAttributes : this.getChosenAttributes();
          var currentAttributes = attributes.data;

          if (attributes.count && attributes.count === attributes.chosenCount) {
            if (this.isAjaxVariation()) {
              if (this.xhr) {
                this.xhr.abort();
              }

              this.$element.block({
                message: null,
                overlayCSS: {
                  background: '#FFFFFF',
                  opacity: 0.6
                }
              });
              currentAttributes.product_id = this.product_id;
              currentAttributes.custom_data = this.$element.data('custom_data');
              this.xhr = $.ajax({
                global: false,
                url: veb_variation_swatches_pro_params.wc_ajax_url.toString().replace('%%endpoint%%', 'woo_get_variation'),
                method: 'POST',
                data: currentAttributes
              });
              this.xhr.fail(function (jqXHR, textStatus) {
                console.error("product variations not available on ".concat(_this8.product_id, "."), textStatus);
              });
              this.xhr.done(function (variation) {
                if (variation) {
                  _this8.$element.trigger('found_variation', [variation, true]);
                } else {
                  _this8.$element.trigger('reset_data');

                  attributes.chosenCount = 0;
                }
              });
              this.xhr.always(function () {
                _this8.$element.unblock();
              });
            } else {
              this.$element.trigger('update_variation_values');
              var variations = this.getAvailableVariations();
              var matching_variations = this.findMatchingVariations(variations, currentAttributes);
              var variation = matching_variations.shift();

              if (variation) {
                this.$element.trigger('found_variation', [variation, false]);
              } else {
                this.$element.trigger('reset_data');
                attributes.chosenCount = 0;
              }
            }
          } else {
            this.$element.trigger('update_variation_values');
            this.$element.trigger('reset_data');
          } 
          this.toggleResetLink(attributes.chosenCount > 0);
          this.$element.trigger('veb_variation_swatches_pro_check_variations', [attributes]);
        }
      }, {
        key: "isAjaxVariation",
        value: function isAjaxVariation() {
          return this.is_ajax_variation;
        }
      }, {
        key: "swatchInit",
        value: function swatchInit() {
          this.setupSwatchesItems();
          this.setupSwatchesEvents();
        }
      }, {
        key: "setupSwatchesItems",
        value: function setupSwatchesItems() {
          var _this9 = this;

          var self = this;
          this.$element.find('ul.variable-items-wrapper').each(function (i, element) {
            var selected = '';
            var select = $(element).parent().find('select.woo-variation-raw-select');
            var options = select.find('option');
            var disabled = select.find('option:disabled');
            var out_of_stock = select.find('option.enabled.out-of-stock');
            var current = select.find('option:selected');
            var eq = select.find('option').eq(1);
            var selects = [];
            var disabled_selects = [];
            var out_of_stocks = []; 
            options.each(function () {
              if ($(this).val() !== '') {
                selects.push($(this).val());
                selected = current.length === 0 ? eq.val() : current.val();
              }
            }); 
            disabled.each(function () {
              if ($(this).val() !== '') {
                disabled_selects.push($(this).val());
              }
            });
            out_of_stock.each(function () {
              if ($(this).val() !== '') {
                out_of_stocks.push($(this).val());
              }
            });

            var in_stocks = _.difference(selects, disabled_selects);

            _this9.setupSwatchesItem(element, selected, in_stocks, out_of_stocks);
          });
        }
      }, {
        key: "setupSwatchesItem",
        value: function setupSwatchesItem(element, selected, in_stocks, out_of_stocks) {
          var _this10 = this;

          $(element).find('li.variable-item').each(function (index, el) {
            var attribute_value = $(el).attr('data-value');
            var attribute_title = $(el).attr('data-title');

            $(el).removeClass('selected disabled no-stock').addClass('disabled');
            $(el).attr('aria-checked', 'false');
            $(el).attr('tabindex', '-1');
            $(el).attr('data-inwptooltip-out-of-stock', '');
            $(el).find('input.variable-item-radio-input:radio').prop('disabled', true).prop('checked', false); 

            if (_this10.isAjaxVariation()) {
              $(el).find('input.variable-item-radio-input:radio').prop('disabled', false);
              $(el).removeClass('selected disabled no-stock');

              if (attribute_value === selected) {
                $(el).addClass('selected');
                $(el).attr('aria-checked', 'true');
                $(el).attr('tabindex', '0');
                $(el).find('input.variable-item-radio-input:radio').prop('disabled', false).prop('checked', true);
                $(el).trigger('inwp-item-updated', [selected, attribute_value]);
              }
            } else {
              if (_.includes(in_stocks, attribute_value)) {
                $(el).removeClass('selected disabled');
                $(el).removeAttr('aria-hidden');
                $(el).attr('tabindex', '0');
                $(el).find('input.variable-item-radio-input:radio').prop('disabled', false);
                if (attribute_value === selected) {
                  $(el).addClass('selected');
                  $(el).attr('aria-checked', 'true');
                  $(el).find('input.variable-item-radio-input:radio').prop('checked', true);
                  $(el).trigger('inwp-item-updated', [selected, attribute_value]);
                }
              }
              if (_.includes(out_of_stocks, attribute_value) && veb_variation_swatches_pro_options.clickable_out_of_stock) {
                $(el).removeClass('disabled').addClass('no-stock');
                $(el).attr('data-inwptooltip-out-of-stock', veb_variation_swatches_pro_options.out_of_stock_tooltip_text);
              }
            }
          });
        }
      }, {
        key: "setupSwatchesEvents",
        value: function setupSwatchesEvents() {
          var _this11 = this;

          var self = this;
          this.$element.find('ul.variable-items-wrapper').each(function (i, element) {
            var select = $(element).parent().find('select.woo-variation-raw-select'); 
            if (veb_variation_swatches_pro_options.clear_on_reselect) {
              $(element).on('click.wc-variation-form', 'li.variable-item:not(.selected):not(.radio-variable-item)', function (event) {
                event.preventDefault();
                event.stopPropagation();
                var value = $(this).data('value');
                select.val(value).trigger('change');
                select.trigger('click'); 
                if (veb_variation_swatches_pro_options.is_mobile) {
                }
                $(this).trigger('inwp-selected-item', [value, select, self.$element]);
              });
              $(element).on('click.wc-variation-form', 'li.variable-item.selected:not(.radio-variable-item)', function (event) {
                event.preventDefault();
                event.stopPropagation();
                var value = $(this).val();

                if (veb_variation_swatches_pro_options.enable_catalog_mode && 'hover' === veb_variation_swatches_pro_options.catalog_mode_trigger) {
                  return false;
                }

                select.val('').trigger('change');
                select.trigger('click');
                $(this).trigger('inwp-unselected-item', [value, select, self.$element]);
              });
              $(element).on('click.wc-variation-form', 'input.variable-item-radio-input:radio', function (event) {
                event.stopPropagation();
                $(this).trigger('change.wc-variation-form', {
                  radioChange: true
                });
              });
              $(element).on('change.wc-variation-form', 'input.variable-item-radio-input:radio', function (event, params) {
                event.preventDefault();
                event.stopPropagation();

                if (params && params.radioChange) {
                  var value = $(this).val();
                  var is_selected = $(this).parent('li.radio-variable-item').hasClass('selected');

                  if (is_selected) {
                    select.val('').trigger('change');
                    $(this).parent('li.radio-variable-item').trigger('inwp-unselected-item', [value, select, self.$element]);
                  } else {
                    select.val(value).trigger('change');
                    $(this).parent('li.radio-variable-item').trigger('inwp-selected-item', [value, select, self.$element]);
                  }

                  select.trigger('click'); 
                  if (veb_variation_swatches_pro_options.is_mobile) {
                  }
                }
              });
            } else {
              $(element).on('click.wc-variation-form', 'li.variable-item:not(.radio-variable-item)', function (event) {
                event.preventDefault();
                event.stopPropagation();
                var value = $(this).data('value');
                select.val(value).trigger('change');
                select.trigger('click');
                if (veb_variation_swatches_pro_options.is_mobile) {
                } 
                $(this).trigger('inwp-selected-item', [value, select, self._element]);
              }); 
              $(element).on('change.wc-variation-form', 'input.variable-item-radio-input:radio', function (event) {
                event.preventDefault();
                event.stopPropagation();
                var value = $(this).val();
                select.val(value).trigger('change');
                select.trigger('click');

                if (veb_variation_swatches_pro_options.is_mobile) {
                }


                $(this).parent('li.radio-variable-item').removeClass('selected disabled no-stock').addClass('selected');
                $(this).parent('li.radio-variable-item').trigger('inwp-selected-item', [value, select, self.$element]);
              });
            } 


            $(element).on('keydown.inwp', 'li.variable-item:not(.disabled)', function (event) {
              if (event.keyCode && 32 === event.keyCode || event.key && ' ' === event.key || event.keyCode && 13 === event.keyCode || event.key && 'enter' === event.key.toLowerCase()) {
                event.preventDefault();
                $(this).trigger('click');
              }
            });

            if (!veb_variation_swatches_pro_options.is_mobile && veb_variation_swatches_pro_options.enable_catalog_mode && 'hover' === veb_variation_swatches_pro_options.catalog_mode_trigger) {
              if (_this11.threshold_max < _this11.total_children) {
                $(element).on('mouseenter.inwp', 'li.variable-item:not(.radio-variable-item)', function () {
                  $(this).trigger('click');
                  $(element).off('mouseenter.inwp');
                });
              } else {
                $(element).on('mouseenter.inwp', 'li.variable-item:not(.radio-variable-item)', function (event) {
                  $(this).trigger('click');
                });
              } 
              if (veb_variation_swatches_pro_options.linkable_attribute) {
                $(element).on('click.linkable', 'li.variable-item:not(.radio-variable-item)', function (event) {
                  if ('undefined' !== typeof event.originalEvent) {
                    var url = $(this).attr('data-url');
                    url ? window.location.href = url : '';
                  }
                });
              }
            }
          });
        } 
      }, {
        key: "resetDisplayedVariation",
        value: function resetDisplayedVariation() {
          this.resetPrice();
          this.resetImage();
          this.resetAvailabilityInfo();
          this.resetCartButton();
        }
      }, {
        key: "foundVariation",
        value: function foundVariation(variation, is_ajax) {
          var purchasable = true;
          var template;
          var $template_html;
          this.updateImage(variation);
          this.reAttachCatalogModeHover();

          if (!veb_variation_swatches_pro_options.enable_catalog_mode) {
            this.updateAvailabilityInfo(variation);
            this.updatePrice(variation);
          } 
          if (!variation.is_purchasable || !variation.is_in_stock || !variation.variation_is_visible) {
            purchasable = false;
          }

          if (purchasable && !veb_variation_swatches_pro_options.enable_catalog_mode) {
            this.updateCartButton(variation);
          } else {
            this.resetCartButton();
          } 
          if (this.total_attribute === 1 && veb_variation_swatches_pro_options.enable_catalog_mode && veb_variation_swatches_pro_options.disable_catalog_mode_on_single_attribute) {
            this.updateAvailabilityInfo(variation);
            this.updatePrice(variation);

            if (purchasable) {
              this.updateCartButton(variation);
            } else {
              this.resetCartButton();
            }
          }

          this.$element.trigger('show_variation', [variation, purchasable]);
        }
      }, {
        key: "reAttachCatalogModeHover",
        value: function reAttachCatalogModeHover() {
          if (!veb_variation_swatches_pro_options.is_mobile && this.threshold_max < this.total_children && veb_variation_swatches_pro_options.enable_catalog_mode && 'hover' === veb_variation_swatches_pro_options.catalog_mode_trigger) {
            this.$element.find('ul.variable-items-wrapper').each(function (i, element) {
              $(element).one('mouseenter.wc-variation-form', 'li.variable-item:not(.radio-variable-item):not(.selected)', function () {
                $(this).trigger('click');
              });
            });
          }
        }
      }, {
        key: "updateCartButton",
        value: function updateCartButton(variation) {
          if (!this.is_cart_button_available) {
            return;
          } 
          this.$cart_button.removeClass('added');
          this.$wrapper.find('.added_to_cart').remove();

          var params = _objectSpread(_objectSpread({}, this.getChosenAttributes().data), {}, {
            'add-to-cart': this.product_id,
            variation_id: variation.variation_id
          });

          this.$cart_button.attr('href', this.addQueryArgs(this.$cart_button.attr('href'), params));
          this.$cart_button.html(variation.add_to_cart_text); 

          this.$cart_button.attr('aria-label', variation.add_to_cart_description);

          if ('yes' === veb_variation_swatches_pro_options.enable_ajax_add_to_cart) {
            this.$cart_button.addClass('inwp_ajax_add_to_cart');
          }
        }
      }, {
        key: "resetCartButton",
        value: function resetCartButton() {
          if (!this.is_cart_button_available) {
            return;
          }

          this.$cart_button.data('variation_id', '');
          this.$cart_button.data('variations', '');
          this.$cart_button.html(this.$cart_button.attr('data-o_html'));
          this.$cart_button.attr('data-product_id', this.$cart_button.attr('data-o_product_id'));
          this.$cart_button.attr('href', this.$cart_button.attr('data-o_href'));
          this.$cart_button.attr('aria-label', this.$cart_button.attr('data-o_aria-label'));
          this.$cart_button.removeClass('inwp_ajax_add_to_cart');
          this.$cart_button.removeClass('added');
          this.$wrapper.find('.added_to_cart').remove();
        }
      }, {
        key: "addQueryArgs",
        value: function addQueryArgs(url) {
          var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          var createURL = new URL(url);

          for (var key in param) {
            createURL.searchParams.set(key, param[key]);
          }

          return createURL.href;
        }
      }, {
        key: "getQueryArgs",
        value: function getQueryArgs(url) {
          var createURL = new URL(url);
          return Object.fromEntries(createURL.searchParams);
        }
      }, {
        key: "updateAvailabilityInfo",
        value: function updateAvailabilityInfo(variation) {
          if (veb_variation_swatches_pro_options.archive_show_availability) {
            var $template_html;
            var template = !variation.variation_is_visible ? wp.template('inwp-unavailable-variation-template') : wp.template('inwp-variation-template');
            $template_html = template({
              variation: variation
            });
            $template_html = $template_html.replace('/*<![CDATA[*/', '');
            $template_html = $template_html.replace('/*]]>*/', '');
            this.$information.html($template_html);
          }
        }
      }, {
        key: "resetAvailabilityInfo",
        value: function resetAvailabilityInfo() {
          this.$information.html('');
        }
      }, {
        key: "updatePrice",
        value: function updatePrice(variation) {
          if (variation && variation.price_html && variation.price_html.length > 1) {
            this.$price.html(variation.price_html);
          }
        }
      }, {
        key: "resetPrice",
        value: function resetPrice() {
          this.$price.html(this.$price_html);
        }
      }, {
        key: "defaultImage",
        value: function defaultImage() {
          this.$image.attr('data-o_src', this.$image.attr('src'));

          if (this.$image.attr('srcset')) {
            this.$image.attr('data-o_srcset', this.$image.attr('srcset'));
          }

          if (this.$image.attr('sizes')) {
            this.$image.attr('data-o_sizes', this.$image.attr('sizes'));
          }
        }
      }, {
        key: "defaultCartButton",
        value: function defaultCartButton() {
          if (!this.is_cart_button_available) {
            return;
          }

          this.$cart_button.attr('data-o_html', this.$cart_button.html());

          if (this.$cart_button.attr('href')) {
            this.$cart_button.attr('data-o_href', this.$cart_button.attr('href'));
          }

          if (this.$cart_button.attr('aria-label')) {
            this.$cart_button.attr('data-o_aria-label', this.$cart_button.attr('aria-label'));
          }
        }
      }, {
        key: "updateImage",
        value: function updateImage(variation) {
          if (variation && variation.image && variation.image.src && variation.image.src.length > 1) {
            this.$image.attr('src', variation.image.src);

            if (variation.image.srcset && variation.image.srcset.length > 1) {
              this.$image.attr('srcset', variation.image.srcset);
            }

            if (variation.image.sizes && variation.image.sizes.length > 1) {
              this.$image.attr('sizes', variation.image.sizes);
            }
          }
        }
      }, {
        key: "updatePreviewImage",
        value: function updatePreviewImage(variation) {
          if (variation && variation.image && variation.image.thumb_src && variation.image.thumb_src.length > 1) {
            this.$image.attr('src', variation.image.thumb_src);

            if (variation.image.srcset && variation.image.srcset.length > 1) {
              this.$image.attr('srcset', variation.image.srcset);
            }

            if (variation.image.sizes && variation.image.sizes.length > 1) {
              this.$image.attr('sizes', variation.image.sizes);
            }
          }
        }
      }, {
        key: "resetImage",
        value: function resetImage() {
          this.$image.attr('src', this.$image.attr('data-o_src'));

          if (this.$image.attr('data-o_srcset')) {
            this.$image.attr('srcset', this.$image.attr('data-o_srcset'));
          }

          if (this.$image.attr('data-o_sizes')) {
            this.$image.attr('sizes', this.$image.attr('data-o_sizes'));
          }
        }
      }, {
        key: "destroy",
        value: function destroy() {
          this.$element.off('.wc-variation-form');
          this.$element.removeClass('inwp-pro-loaded');
          this.$element.removeData(this.name);
        }
      }]);

      return _class2;
    }();
  }(jQuery);

  var jQueryPlugin = function ($) {
    return function (PluginName, ClassName) {
      $.fn[PluginName] = function (options) {
        var _this12 = this;

        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return this.each(function (index, element) {
          var $element = $(element);
          var data = $element.data(PluginName);

          if (!data) {
            data = new ClassName($element, $.extend({}, options), PluginName);
            $element.data(PluginName, data);
          }

          if (typeof options === 'string') {
            if (_typeof(data[options]) === 'object') {
              return data[options];
            }

            if (typeof data[options] === 'function') {
              var _data;

              return (_data = data)[options].apply(_data, args);
            }
          }

          return _this12;
        });
      }; 
      $.fn[PluginName].Constructor = ClassName;
      $[PluginName] = function (options) {
        var _$;

        for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }

        return (_$ = $({}))[PluginName].apply(_$, [options].concat(args));
      }; 
      $.fn[PluginName].noConflict = function () {
        return $.fn[PluginName];
      };
    };
  }(jQuery);

  jQueryPlugin('VebVariationSwatchesPro', Plugin);
})(window);
}();
!function() {
jQuery(function ($) {
  try {
    $(document).on('veb_variation_swatches_pro_init', function () {
      $('.inwp-archive-variations-wrapper:not(.inwp-pro-loaded)').VebVariationSwatchesPro();
    }).trigger('veb_variation_swatches_pro_init');
  } catch (err) {
    window.console.log('Variation Swatches Pro:', err);
  } 
  $(document).on('jet-filter-content-rendered.inwp', function () {
    $(document).trigger('veb_variation_swatches_pro_init');
  });
  $(document).on('yith_infs_added_elem.inwp', function () {
    $(document).trigger('veb_variation_swatches_pro_init');
  });
  $(document).on('astraInfinitePaginationLoaded.inwp', function () {
    $(document).trigger('veb_variation_swatches_pro_init');
  });
  $(document).ajaxComplete(function (event, request, settings) {
    _.delay(function () {
    }, 100);
  }); 
  $(document.body).on('post-load.inwp', function () {
    $(document).trigger('veb_variation_swatches_pro_init');
  }); 
  $(document).on('yith-wcan-ajax-filtered.inwp', function () {
    $(document).trigger('veb_variation_swatches_pro_init');
  });
  $(document).on('yith_wcwl_reload_fragments', function () {
    $(document).trigger('veb_variation_swatches_pro_init');
  }); 
  $(document).on('berocket_ajax_products_loaded.inwp berocket_ajax_products_infinite_loaded.inwp', function () {
    $(document).trigger('veb_variation_swatches_pro_init');
  }); 
  $('.shop-container .products, .infinite-scroll-wrap').on('append.infiniteScroll', function (event, response, path) {
    $(document).trigger('veb_variation_swatches_pro_init');
  }); 
  $(document).on('facetwp-loaded.inwp', function () {
    $(document.body).trigger('veb_variation_swatches_pro_init');
  }); 
  $(document).on('nm_infload_after.inwp nm_ajax_shop_update_content.inwp', function () {
    $(document).trigger('veb_variation_swatches_pro_init');
  }); 
  $('body').on('aln_reloaded.inwp', function () {
    _.delay(function () {
      $(document).trigger('veb_variation_swatches_pro_init');
    }, 100);
  });
});
}();
 })()
;