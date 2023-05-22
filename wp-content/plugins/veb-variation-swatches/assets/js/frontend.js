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

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

(function (window) {
  'use strict';

  var isVebVariationSwatchesAPIRequest = function isVebVariationSwatchesAPIRequest(options) {
    return !!options.path && options.path.indexOf('veb-variation-swatches') !== -1 || !!options.url && options.url.indexOf('veb-variation-swatches') !== -1;
  };

  window.createMiddlewareForExtraQueryParams = function () {
    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return function (options, next) {
      if (isVebVariationSwatchesAPIRequest(options) && Object.keys(args).length > 0) {
        for (var _i = 0, _Object$entries = Object.entries(args); _i < _Object$entries.length; _i++) {
          var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
              key = _Object$entries$_i[0],
              value = _Object$entries$_i[1];

          if (typeof options.url === 'string' && !wp.url.hasQueryArg(options.url, key)) {
            options.url = wp.url.addQueryArgs(options.url, _defineProperty({}, key, value));
          }

          if (typeof options.path === 'string' && !wp.url.hasQueryArg(options.path, key)) {
            options.path = wp.url.addQueryArgs(options.path, _defineProperty({}, key, value));
          }
        }
      }

      return next(options);
    };
  };

  var Plugin = function ($) {
    return function () {
      function _class2(element, options, name) {
        _classCallCheck(this, _class2);

        _defineProperty(this, "defaults", {});

        this.name = name;
        this.element = element;
        this.$element = $(element);
        this.settings = $.extend(true, {}, this.defaults, options);
        this.product_variations = this.$element.data('product_variations') || [];
        this.is_ajax_variation = this.product_variations.length < 1;
        this.product_id = this.$element.data('product_id');
        this.reset_variations = this.$element.find('.reset_variations');
        this.attributeFields = this.$element.find('.variations select');
        this.selected_item_template = "<span class=\"woo-selected-variation-item-name\" data-default=\"\"></span>";
        this.$element.addClass('inwp-loaded'); 

        this.init();
        this.update(); 

        $(document).trigger('veb_variation_swatches_loaded', this);
      }

      _createClass(_class2, [{
        key: "isAjaxVariation",
        value: function isAjaxVariation() {
          return this.is_ajax_variation; 
        }
      }, {
        key: "init",
        value: function init() {
          this.prepareLabel();
          this.prepareItems();
          this.setupItems();
          this.setupEvents();
          this.setUpStockInfo();
        }
      }, {
        key: "prepareLabel",
        value: function prepareLabel() {
          var _this = this;

          if (veb_variation_swatches_options.show_variation_label) {
            this.$element.find('.variations .label').each(function (index, el) {
              $(el).append(_this.selected_item_template);
            });
          }
        }
      }, {
        key: "prepareItems",
        value: function prepareItems() {
          this.$element.find('ul.variable-items-wrapper').each(function (i, el) {
            $(el).parent().addClass('woo-variation-items-wrapper');
          });
        }
      }, {
        key: "setupItems",
        value: function setupItems() {
          var _this2 = this;

          var self = this;
          this.$element.find('ul.variable-items-wrapper').each(function (i, element) {
            var selected = '';
            var $selected_variation_item = $(element).parent().prev().find('.woo-selected-variation-item-name');
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

            _this2.setupItem(element, selected, in_stocks, out_of_stocks, $selected_variation_item);
          });
        }
      }, {
        key: "setupItem",
        value: function setupItem(element, selected, in_stocks, out_of_stocks, $selected_variation_item) {
          var _this3 = this;

          $(element).find('li.variable-item').each(function (index, el) {
            var attribute_value = $(el).attr('data-value');
            var attribute_title = $(el).attr('data-title'); 

            $(el).removeClass('selected disabled no-stock').addClass('disabled');
            $(el).attr('aria-checked', 'false');
            $(el).attr('tabindex', '-1');
            $(el).attr('data-inwptooltip-out-of-stock', '');
            $(el).find('input.variable-item-radio-input:radio').prop('disabled', true).prop('checked', false);

            if (selected.length < 1 && veb_variation_swatches_options.show_variation_label) {
              $selected_variation_item.text('');
            } 


            if (_this3.isAjaxVariation()) {
              $(el).find('input.variable-item-radio-input:radio').prop('disabled', false);
              $(el).removeClass('selected disabled no-stock'); 

              if (attribute_value === selected) {
                $(el).addClass('selected');
                $(el).attr('aria-checked', 'true');
                $(el).attr('tabindex', '0');
                $(el).find('input.variable-item-radio-input:radio').prop('disabled', false).prop('checked', true);

                if (veb_variation_swatches_options.show_variation_label) {
                  $selected_variation_item.text("".concat(veb_variation_swatches_options.variation_label_separator, " ").concat(attribute_title));
                }

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

                  if (veb_variation_swatches_options.show_variation_label) {
                    $selected_variation_item.text("".concat(veb_variation_swatches_options.variation_label_separator, " ").concat(attribute_title));
                  }

                  $(el).trigger('inwp-item-updated', [selected, attribute_value]);
                }
              }


              if (_.includes(out_of_stocks, attribute_value) && veb_variation_swatches_options.clickable_out_of_stock) {
                $(el).removeClass('disabled').addClass('no-stock');
                $(el).attr('data-inwptooltip-out-of-stock', veb_variation_swatches_options.out_of_stock_tooltip_text);
              }
            }
          });
        }
      }, {
        key: "setupEvents",
        value: function setupEvents() {
          var self = this;
          this.$element.find('ul.variable-items-wrapper').each(function (i, element) {
            var select = $(element).parent().find('select.woo-variation-raw-select'); 

            if (veb_variation_swatches_options.clear_on_reselect) {
              $(element).on('click.inwp', 'li.variable-item:not(.selected):not(.radio-variable-item)', function (event) {
                event.preventDefault();
                event.stopPropagation();
                var value = $(this).data('value');
                select.val(value).trigger('change');
                select.trigger('click');

                if (veb_variation_swatches_options.is_mobile) {
                } 


                $(this).trigger('inwp-selected-item', [value, select, self.$element]);
              });

              $(element).on('click.inwp', 'li.variable-item.selected:not(.radio-variable-item)', function (event) {
                event.preventDefault();
                event.stopPropagation();
                var value = $(this).val();
                select.val('').trigger('change');
                select.trigger('click');

                if (veb_variation_swatches_options.is_mobile) {
                } 


                $(this).trigger('inwp-unselected-item', [value, select, self.$element]);
              });

              $(element).on('click.inwp', 'input.variable-item-radio-input:radio', function (event) {
                event.stopPropagation();
                $(this).trigger('change.inwp', {
                  radioChange: true
                });
              });
              $(element).on('change.inwp', 'input.variable-item-radio-input:radio', function (event, params) {
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

                  if (veb_variation_swatches_options.is_mobile) {
                  }
                }
              });
            } else {
              $(element).on('click.inwp', 'li.variable-item:not(.radio-variable-item)', function (event) {
                event.preventDefault();
                event.stopPropagation();
                var value = $(this).data('value');
                select.val(value).trigger('change');
                select.trigger('click');

                if (veb_variation_swatches_options.is_mobile) {
                } 


                $(this).trigger('inwp-selected-item', [value, select, self.$element]); 
              }); 

              $(element).on('change.inwp', 'input.variable-item-radio-input:radio', function (event) {
                event.preventDefault();
                event.stopPropagation();
                var value = $(this).val();
                select.val(value).trigger('change');
                select.trigger('click'); 

                if (veb_variation_swatches_options.is_mobile) {
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
          });
          this.$element.on('click.inwp', '.veb-variation-swatches-variable-item-more', function (event) {
            event.preventDefault();
            $(this).parent().removeClass('enabled-display-limit-mode enabled-catalog-display-limit-mode');
            $(this).remove();
          });
        }
      }, {
        key: "update",
        value: function update() {
          var _this4 = this;

          this.$element.on('woocommerce_variation_has_changed.inwp', function (event) {
            _this4.setupItems();
          });
        }
      }, {
        key: "setUpStockInfo",
        value: function setUpStockInfo() {
          var _this5 = this;

          if (veb_variation_swatches_options.show_variation_stock) {
            var max_stock_label = parseInt(veb_variation_swatches_options.stock_label_threshold, 10);
            this.$element.on('inwp-selected-item.inwp', function (event) {
              var attributes = _this5.getChosenAttributes();

              var variations = _this5.findStockVariations(_this5.product_variations, attributes);

              if (attributes.count > 1 && attributes.count === attributes.chosenCount) {
                _this5.resetStockInfo();
              }

              if (attributes.count > 1 && attributes.count === attributes.mayChosenCount) {
                variations.forEach(function (data) {
                  var stockInfoSelector = "[data-attribute_name=\"".concat(data.attribute_name, "\"] > [data-value=\"").concat(data.attribute_value, "\"]");

                  if (data.variation.is_in_stock && data.variation.max_qty && data.variation.variation_stock_left && data.variation.max_qty <= max_stock_label) {
                    _this5.$element.find("".concat(stockInfoSelector, " .inwp-stock-left-info")).attr('data-inwp-stock-info', data.variation.variation_stock_left);

                    _this5.$element.find(stockInfoSelector).addClass('inwp-show-stock-left-info');
                  } else {
                    _this5.$element.find(stockInfoSelector).removeClass('inwp-show-stock-left-info');

                    _this5.$element.find("".concat(stockInfoSelector, " .inwp-stock-left-info")).attr('data-inwp-stock-info', '');
                  }
                });
              }
            });
            this.$element.on('hide_variation.inwp', function () {
              _this5.resetStockInfo();
            });
          }
        }
      }, {
        key: "resetStockInfo",
        value: function resetStockInfo() {
          this.$element.find('.variable-item').removeClass('inwp-show-stock-left-info');
          this.$element.find('.inwp-stock-left-info').attr('data-inwp-stock-info', '');
        }
      }, {
        key: "getChosenAttributes",
        value: function getChosenAttributes() {
          var data = {};
          var count = 0;
          var chosen = 0;
          this.attributeFields.each(function () {
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
        key: "findStockVariations",
        value: function findStockVariations(allVariations, selectedAttributes) {
          var found = [];

          for (var _i2 = 0, _Object$entries2 = Object.entries(selectedAttributes.data); _i2 < _Object$entries2.length; _i2++) {
            var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
                attribute_name = _Object$entries2$_i[0],
                attribute_value = _Object$entries2$_i[1];

            if (attribute_value.length === 0) {
              var values = this.$element.find("ul[data-attribute_name='".concat(attribute_name, "']")).data('attribute_values') || [];

              var _iterator = _createForOfIteratorHelper(values),
                  _step;

              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  var value = _step.value;

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
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
            }
          }

          return found;
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
        key: "destroy",
        value: function destroy() {
          this.$element.removeClass('inwp-loaded');
          this.$element.removeData(this.name);
        }
      }]);

      return _class2;
    }();
  }(jQuery);

  var jQueryPlugin = function ($) {
    return function (PluginName, ClassName) {
      $.fn[PluginName] = function (options) {
        var _this6 = this;

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

          return _this6;
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

  jQueryPlugin('VebVariationSwatches', Plugin);
})(window);
}();
!function() {
jQuery(function ($) {
  try {
    $(document).on('veb_variation_swatches_init', function () {
      $('.variations_form:not(.inwp-loaded)').VebVariationSwatches(); 

      $('.veb_variation_swatches_variations_form:not(.inwp-loaded)').VebVariationSwatches();

      $('.ywcp_inner_selected_container:not(.inwp-loaded)').VebVariationSwatches();
    });
  } catch (err) {
    window.console.log('Variation Swatches:', err);
  } 


  $(document).on('wc_variation_form.inwp', function (event) {
    $(document).trigger('veb_variation_swatches_init');
  });

  $(document).ajaxComplete(function (event, request, settings) {
    _.delay(function () {
      $('.variations_form:not(.inwp-loaded)').each(function () {
        $(this).wc_variation_form();
      });
    }, 1000);
  });

  $(document.body).on('wc-composite-initializing', '.composite_data', function (event, composite) {
    composite.actions.add_action('component_options_state_changed', function (self) {
      $(self.$component_content).find('.variations_form').VebVariationSwatches('destroy');
    });
    
  });
});
}();
 })()
;