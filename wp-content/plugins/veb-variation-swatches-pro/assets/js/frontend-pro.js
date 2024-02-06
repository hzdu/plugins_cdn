/******/ (function(modules) { 
/******/ 	var installedModules = {};
/******/ 	function __webpack_require__(moduleId) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(6);


/***/ }),
/***/ (function(module, exports, __webpack_require__) {

jQuery(function ($) {
    Promise.resolve().then(function () {
        return __webpack_require__(7);
    }).then(function () {
        $(document).on('wc_variation_form.inwp', '.variations_form:not(.inwp-pro-loaded)', function (event, form) {
            $(this).VebVariationSwatchesPro();
        });
    });
}); 

/***/ }),
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VebVariationSwatchesPro = function ($) {

  var Default = {};

  var VebVariationSwatchesPro = function () {
    function VebVariationSwatchesPro(element, config) {
      _classCallCheck(this, VebVariationSwatchesPro);

      this._el = element;
      this._element = $(element);
      this._config = $.extend({}, Default, config);
      this._generated = {};
      this.product_variations = this._element.data('product_variations');
      this.is_ajax_variation = !this.product_variations;
      this.is_loop = this._element.hasClass('inwp-archive-variation-wrapper');
      this.is_single_product = !this.is_loop;
      this._attributeFields = this._element.find('.variations select');
      this._wrapper = this._element.closest(veb_variation_swatches_options.archive_product_wrapper);
      this._cart_button = this._wrapper.find('.inwp_add_to_cart_button');
      this._cart_button_ajax = this._wrapper.find('.inwp_ajax_add_to_cart');
      this._cart_button_html = this._cart_button.clone().html();
      this._image = this._wrapper.find(veb_variation_swatches_options.archive_image_selector);
      this._price = this._wrapper.find('.price');
      this._price_html = this._price.clone().html();
      this._product_id = this._cart_button.data('product_id');
      this._variation_shown = false;
      this._resetVariations = this._element.find('.veb_variation_swatches_archive_reset_variations');
      this.is_mobile = $('body').hasClass('veb-variation-swatches-on-mobile');
      this.iconic_woothumbs_all_images_wrap = $('.iconic-woothumbs-all-images-wrap');
      this.iconic_woothumbs_show_variation_trigger = 'iconic_woothumbs_show_variation';

      if (veb_variation_swatches_options.archive_cart_button_selector.trim()) {
        this._cart_button = this._wrapper.find(veb_variation_swatches_options.archive_cart_button_selector);
        this._cart_button_ajax = this._wrapper.find(veb_variation_swatches_options.archive_cart_button_selector);
      }

      this._element.addClass('inwp-pro-loaded');
      this.init();

      $(document).trigger('veb_variation_swatches_pro', [this._element]);
    }

    _createClass(VebVariationSwatchesPro, [{
      key: 'init',
      value: function init() {

        this.archiveCatalogHoverEvent();
        this.setDefaultTemplate();
        this.archiveEvents();
        this.clickableVariationURL();
        this.variationImagePreview();
        this.showStockLabel();

        this._element.trigger('veb_variation_swatches_pro_init', [this, this.product_variations]);
        $(document).trigger('veb_variation_swatches_pro_loaded', [this._element, this.product_variations]);
      }
    }, {
      key: 'variationImagePreview',
      value: function variationImagePreview() {

        var preview_attribute = veb_variation_swatches_options.single_variation_preview_attribute;

        if (this.is_single_product && veb_variation_swatches_options.enable_single_variation_preview && veb_variation_swatches_options.single_variation_preview_attribute) {
          this._attributeFieldSingle = this._element.find('.variations select#' + preview_attribute);
          this.changeSingleAttributeImage();
          this._attributeFieldSingle.trigger('change.inwp');
        }

        if (this.is_loop && veb_variation_swatches_options.enable_single_variation_preview_archive && veb_variation_swatches_options.enable_single_variation_preview && veb_variation_swatches_options.single_variation_preview_attribute) {

          var archiveAttribute = this._element.data('single_variation_preview_attribute').trim();

          preview_attribute = archiveAttribute ? archiveAttribute : preview_attribute;
          this._attributeFieldSingle = this._element.find('.variations select#' + preview_attribute);
          this.changeSingleAttributeImage();
        }
      }
    }, {
      key: 'clickableVariationURL',
      value: function clickableVariationURL() {

        if (this.is_single_product && veb_variation_swatches_options.enable_linkable_variation_url) {
          this.generateVariationURL();
        }
      }
    }, {
      key: 'generateVariationURL',
      value: function generateVariationURL() {
        var _this2 = this;

        var url = new URL(window.location.toString());
        var search = url.searchParams.toString();

        var originalUrl = url.origin + url.pathname;

        this._element.on('check_variations.wc-variation-form', function (event) {

          var attributes = void 0;

          if (veb_variation_swatches_options.wc_bundles_enabled) {
            url = new URL(window.location.toString());
            search = url.searchParams.toString();
            attributes = _this2.getChosenAttributesBundleSupport();
          } else {
            attributes = _this2.getChosenAttributes();
          }

          var attributesObject = Object.keys(attributes).reduce(function (attrs, current) {

            if (attributes[current]) {
              attrs[current] = attributes[current];
            }
            return attrs;
          }, {});

          var searchObject = [].concat(_toConsumableArray(new URLSearchParams(search).keys())).reduce(function (attrs, current) {
            attrs[current] = new URLSearchParams(search).get(current);
            return attrs;
          }, {});

          var data = _extends({}, searchObject, attributesObject);

          var params = $.param(data);

          window.history.pushState({}, '', _this2.addQueryArg(originalUrl, params));
        });
      }
    }, {
      key: 'setDefaultTemplate',
      value: function setDefaultTemplate() {

        if (this.is_single_product) {
          return false;
        }

        var product_variations = this._element.data('product_variations');

        var attributes = this.getChosenAttributesAll();
        var currentAttributes = attributes.data;

        if (attributes.count && attributes.count === attributes.chosenCount) {
          var matching_variations = this.findMatchingVariations(product_variations, currentAttributes);
          var variation = matching_variations.shift();

          if (variation) {
            this.archiveImageUpdate(variation);
            this.archiveTemplateUpdate(variation);
          } else {
            console.error('Default Product variation not available on product id ' + this._product_id);
          }
        }
      }
    }, {
      key: 'archiveCatalogHoverEvent',
      value: function archiveCatalogHoverEvent() {

        var _this = this;
        this._element.find('ul.variable-items-wrapper.inwp-catalog-variable-wrapper > li:not(.disabled):not(.veb-variation-swatches-variable-item-more)').each(function (i, el) {

          $(this).off('inwp-selected-item.catalog-image-hover');
          $(this).off('inwp-selected-item.catalog-image-click');
          $(this).off('mouseenter.catalog-image-hover');
          $(this).off('mouseleave.catalog-image-hover');
          $(this).off('click.linkable');

          if (veb_variation_swatches_options.catalog_mode_event === 'hover') {

            $(this).on('mouseenter.catalog-image-hover', function (event) {
              event.stopPropagation();

              $(this).trigger('click').trigger('focusin');

              if (_this.is_mobile) {
                $(this).trigger('touchstart');
              }
            });

            if (veb_variation_swatches_options.linkable_attribute) {
              $(this).on('click.linkable', function (event) {
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
      key: 'archiveEvents',
      value: function archiveEvents() {
        var _this3 = this;

        if (this.is_single_product) {
          return false;
        }

        this._element.off('found_variation.inwp');
        this._element.off('reset_data.inwp');
        this._element.off('inwp_single_attribute_chosen.inwp');
        this._cart_button_ajax.off('click.inwp');

        this._element.on('found_variation.inwp', function (event, variation) {
          var purchasable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

          event.preventDefault();
          event.stopPropagation();
          _this3.archiveImageUpdate(variation);
          if (purchasable) {
            _this3.archiveTemplateUpdate(variation);
          }
        });

        this._element.on('reset_data.inwp', function (event) {

          event.preventDefault();
          event.stopPropagation();

          var chosen = _this3.getChosenAttributesAll();

          if (chosen.chosenCount === 0) {
            _this3.archiveImageUpdate();
            _this3.archiveTemplateReset();
          }
        });

        this._element.on('inwp_single_attribute_chosen.inwp', function (event, variation) {
          _this3.archiveImageUpdate(variation);
        });

        this._cart_button_ajax.on('click.inwp', function (event) {

          var $button = $(this);

          if (veb_variation_swatches_options.enable_catalog_mode) {
            return true;
          }

          if (!$button.data('variation_id')) {
            return true;
          }

          event.preventDefault(); 
          event.stopPropagation(); 

          $button.removeClass('added');
          $button.addClass('loading');

          var data = {
            action: 'inwp_add_variation_to_cart'
          };

          $.each($button.data(), function (key, value) {

            if (!_.includes(['selectOptions', 'addToCart', 'selectOptionsAriaLabel', 'addToCartAriaLabel'], key)) {
              data[key] = value;
            }
          });

          $(document.body).trigger('adding_to_cart', [$button, data]);

          $.post(wc_add_to_cart_variation_params.ajax_url.toString(), data, function (response) {
            if (!response) {
              return;
            }

            if (response.error && response.product_url) {
              window.location = response.product_url;
              return;
            }

            if (wc_add_to_cart_params.cart_redirect_after_add === 'yes') {
              window.location = wc_add_to_cart_params.cart_url;
              return;
            }

            $(document.body).trigger('added_to_cart', [response.fragments, response.cart_hash, $button]);
          });
        });
      }


    }, {
      key: 'archiveTemplateReset',
      value: function archiveTemplateReset() {

        if (!veb_variation_swatches_options.enable_catalog_mode) {

          if (this._cart_button.length > 0) {

            this._cart_button.data('variation_id', '');
            this._cart_button.data('variation', '');
            this._cart_button.attr('aria-label', this._cart_button.data('select-options-aria-label'));
            this._cart_button.html(this._cart_button.data('select-options'));
            this._cart_button.removeClass('added');

            if ('no' === wc_add_to_cart_variation_params.enable_ajax_add_to_cart) {
              this._cart_button.prop('href', this._cart_button.data('product_permalink'));
            }
          }

          this._wrapper.find('.price').html(this._price_html);
          this._wrapper.find('.added_to_cart, .added_to_cart_button').remove();
        }
      }
    }, {
      key: 'archiveTemplateUpdate',
      value: function archiveTemplateUpdate(variation) {

        var template = void 0;
        if (variation && variation.variation_is_visible) {
          template = wp.template('inwp-variation-template');
        } else {
          template = wp.template('unavailable-variation-template');
        }

        var $template_html = template({
          variation: variation,
          price_html: $(variation.price_html).unwrap().html() || this._price_html
        });

        $template_html = $template_html.replace('/*<![CDATA[*/', '');
        $template_html = $template_html.replace('/*]]>*/', '');

        if (!veb_variation_swatches_options.enable_catalog_mode) {

          if (this._cart_button.length > 0) {

            this._cart_button.data('variation_id', variation.variation_id);
            this._cart_button.data('variation', this.getChosenAttributes());
            this._cart_button.attr('aria-label', this._cart_button.data('add-to-cart-aria-label'));
            this._cart_button.html(this._cart_button.data('add-to-cart'));
            this._cart_button.removeClass('added');

            if ('no' === wc_add_to_cart_variation_params.enable_ajax_add_to_cart) {
              var params = $.param(_extends({}, this.getChosenAttributes(), {
                'add-to-cart': this._product_id,
                variation_id: variation.variation_id
              }));


              this._cart_button.prop('href', this.addQueryArg(this._cart_button.data('add_to_cart_url'), params));
            }
          }

          this._wrapper.find('.price').html($template_html);
          this._wrapper.find('.added_to_cart, .added_to_cart_button').remove();
        }
      }
    }, {
      key: 'archiveImageUpdate',
      value: function archiveImageUpdate() {
        var variation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        if (variation && variation.image && variation.image.thumb_src && variation.image.thumb_src.length > 1) {
          this._image.wc_set_variation_attr('src', variation.image.thumb_src);
          this._image.wc_set_variation_attr('height', variation.image.thumb_src_h);
          this._image.wc_set_variation_attr('width', variation.image.thumb_src_w);
          this._image.wc_set_variation_attr('srcset', variation.image.thumb_srcset);
          this._image.wc_set_variation_attr('sizes', variation.image.thumb_sizes);
          this._image.wc_set_variation_attr('title', variation.image.title);
          this._image.wc_set_variation_attr('alt', variation.image.alt);
        } else {
          this._image.wc_reset_variation_attr('src');
          this._image.wc_reset_variation_attr('width');
          this._image.wc_reset_variation_attr('height');
          this._image.wc_reset_variation_attr('srcset');
          this._image.wc_reset_variation_attr('sizes');
          this._image.wc_reset_variation_attr('title');
          this._image.wc_reset_variation_attr('alt');
        }
      }
    }, {
      key: 'getChosenAttributesBundleSupport',
      value: function getChosenAttributesBundleSupport() {
        var data = {};
        var count = 0;
        var chosen = 0;

        this._attributeFields.each(function () {
          var attribute_name = $(this).attr('name');
          var value = $(this).val() || '';

          if (value.length > 0) {
            chosen++;
          }

          count++;
          data[attribute_name] = value;
        });

        return data;
      }
    }, {
      key: 'getChosenAttributes',
      value: function getChosenAttributes() {

        var data = {};
        var count = 0;
        var chosen = 0;

        this._attributeFields.each(function () {
          var attribute_name = $(this).data('attribute_name') || $(this).attr('name');
          var value = $(this).val() || '';

          if (value.length > 0) {
            chosen++;
          }

          count++;
          data[attribute_name] = value;
        });

        return data;
      }
    }, {
      key: 'addQueryArg',
      value: function addQueryArg(url, query) {
        if (query) {
          query = query.trim().replace(/^(\?|#|&)/, '').replace(/(\?|#|&)$/, '');
          query = query ? '?' + query : query;

          var parts = url.split(/[\?\#]/);
          var start = parts[0];
          if (query && /\:\/\/[^\/]*$/.test(start)) {
            start = start + '/';
          }
          var match = url.match(/(\#.*)$/);
          url = start + query;
          if (match) {
            url = url + match[0];
          }
        }
        return url;
      }
    }, {
      key: 'eventReAttach',
      value: function eventReAttach(element, eventName, callback) {

        for (var key in callback) {

          if (callback.hasOwnProperty(key)) {
            var fn = callback[key];
            var namespace = fn.namespace ? '.' + fn.namespace : '';
            var data = fn.data ? fn.data : {};
            var handler = fn.handler ? fn.handler : function () {};
            element.on('' + eventName + namespace, data, handler);
          }
        }
      }

    }, {
      key: 'changeSingleAttributeImage',
      value: function changeSingleAttributeImage() {
        var _this4 = this;

        var events = $._data(this._el, 'events');
        var reset_data_callback = jQuery.extend(true, {}, events['reset_data']);

        this._attributeFieldSingle.on('change.inwp', function (event) {

          var allAttributes = _this4.getChosenAttributesAll();
          var attributes = _this4.getChosenAttributesSingle();
          var currentAttributes = attributes.data;

          if (attributes.count > 0) {
            if (allAttributes.count > 1 && allAttributes.chosenCount === 1) {

              var variationData = _this4._element.data('product_variations');
              var matching_variations = _this4.findMatchingVariations(variationData, currentAttributes);
              var variation = matching_variations.shift();

              if (variation) {

                _this4._element.off('reset_data');
                _this4._element.wc_variations_image_update(variation);
                _this4._element.trigger('inwp_pro_single_preview_found_variation', [_this4, variation]);
                _this4._element.trigger('inwp_single_attribute_chosen', [variation, _this4]);
                _this4._element.trigger(veb_variation_swatches_options.single_variation_preview_js_event, [variation, false]);

                _this4._element.find('.single_add_to_cart_button').removeClass('wc-variation-is-unavailable').addClass('disabled wc-variation-selection-needed');
              }
            } else {
              _this4.eventReAttach(_this4._element, 'reset_data', reset_data_callback);
            }
          }
        });
      }
    }, {
      key: 'findStockLabelVariation',
      value: function findStockLabelVariation(allVariations, selectedAttributes) {

        var found = [];

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Object.entries(selectedAttributes.data)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _ref = _step.value;

            var _ref2 = _slicedToArray(_ref, 2);

            var attribute_name = _ref2[0];
            var attribute_value = _ref2[1];


            if (attribute_value.length === 0) {

              var values = this._element.find('ul[data-attribute_name=\'' + attribute_name + '\']').data('attribute_values') || [];

              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                for (var _iterator2 = values[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  var value = _step2.value;


                  var compare = _.extend(selectedAttributes.data, _defineProperty({}, attribute_name, value));
                  var matched_variation = this.findMatchingVariations(allVariations, compare);

                  if (matched_variation.length > 0) {
                    var variation = matched_variation.shift();
                    var data = {};
                    data['attribute_name'] = attribute_name;
                    data['attribute_value'] = value;
                    data['variation'] = variation;
                    found.push(data);
                  }
                }
              } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                  }
                } finally {
                  if (_didIteratorError2) {
                    throw _iteratorError2;
                  }
                }
              }
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return found;
      }
    }, {
      key: 'resetStockLabel',
      value: function resetStockLabel() {
        this._element.find('.variable-item').removeClass('inwp-show-stock-left-info');
        this._element.find('.inwp-stock-left-info').attr('data-inwp-stock-info', '');
      }
    }, {
      key: 'showStockLabel',
      value: function showStockLabel() {
        var _this5 = this;

        if (this.is_single_product && veb_variation_swatches_options.show_variation_stock_info) {

          this._element.off('inwp-selected-item.wc-variation-form');
          this._element.off('reset_data.inwp');

          var max_stock_label = parseInt(veb_variation_swatches_options.stock_label_display_threshold);

          var variations = this._element.data('product_variations');
          var attributes = this.getChosenAttributesAll();

          this._element.on('inwp-selected-item.wc-variation-form', 'li.variable-item:not(.radio-variable-item):not(.veb-variation-swatches-variable-item-more)', function (event) {

            var attributes = _this5.getChosenAttributesAll();

            if (attributes.count > 1 && attributes.count === attributes.chosenCount) {
              _this5.resetStockLabel();
            }

            if (attributes.count > 1 && attributes.count === attributes.mayChosenCount) {

              var variationData = _this5.findStockLabelVariation(variations, attributes);

              variationData.forEach(function (data) {

                var stockInfoSelector = '[data-attribute_name="' + data.attribute_name + '"] > [data-value="' + data.attribute_value + '"]';
                if (data.variation.is_in_stock && data.variation.max_qty && data.variation.inwp_stock_left && data.variation.max_qty <= max_stock_label) {
                  _this5._element.find(stockInfoSelector + ' .inwp-stock-left-info').attr('data-inwp-stock-info', data.variation.inwp_stock_left);
                  _this5._element.find(stockInfoSelector).addClass('inwp-show-stock-left-info');
                } else {
                  _this5._element.find(stockInfoSelector).removeClass('inwp-show-stock-left-info');
                  _this5._element.find(stockInfoSelector + ' .inwp-stock-left-info').attr('data-inwp-stock-info', '');
                }
              });
            }
          });

          this._element.on('reset_data.inwp', function (event) {

            event.stopImmediatePropagation();

            var attributes = _this5.getChosenAttributesAll();
            if (attributes.count > 1 && attributes.chosenCount < 1) {
              _this5.resetStockLabel();
            }
          });
        }
      }
    }, {
      key: 'getChosenAttributesAll',
      value: function getChosenAttributesAll() {
        var data = {};
        var count = 0;
        var chosen = 0;

        this._attributeFields.each(function () {
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
          'mayChosenCount': chosen + 1,
          'data': data
        };
      }
    }, {
      key: 'getChosenAttributesSingle',
      value: function getChosenAttributesSingle() {
        var data = {};
        var count = 0;
        var chosen = 0;

        this._attributeFieldSingle.each(function () {
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
      key: 'findMatchingVariations',
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
      key: 'isMatch',
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
    }], [{
      key: '_jQueryInterface',
      value: function _jQueryInterface(config) {
        return this.each(function () {
          new VebVariationSwatchesPro(this, config);
        });
      }
    }]);

    return VebVariationSwatchesPro;
  }();


  $.fn['VebVariationSwatchesPro'] = VebVariationSwatchesPro._jQueryInterface;
  $.fn['VebVariationSwatchesPro'].Constructor = VebVariationSwatchesPro;
  $.fn['VebVariationSwatchesPro'].noConflict = function () {
    $.fn['VebVariationSwatchesPro'] = $.fn['VebVariationSwatchesPro'];
    return VebVariationSwatchesPro._jQueryInterface;
  };

  return VebVariationSwatchesPro;
}(jQuery);

 __webpack_exports__["default"] = (VebVariationSwatchesPro);

/***/ })
/******/ ]);