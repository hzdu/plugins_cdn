/******/ (function(modules) { 
/******/ 
/******/ 	var installedModules = {};
/******/
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 	
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		
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
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ({

/***/ 10:
/***/ (function(module, exports, __webpack_require__) {

jQuery(function ($) {

  Promise.resolve().then(function () {
    return __webpack_require__(11);
  }).then(function () {

    $(document).on('wc_variation_form.inwp', '.variations_form:not(.inwp-loaded)', function (event) {
      $(this).VebVariationSwatches();
    });

    $(document).ajaxComplete(function (event, request, settings) {
      _.delay(function () {
        $('.variations_form:not(.inwp-loaded)').each(function () {
          $(this).wc_variation_form();
        });
      }, 100);
    });

    $(document.body).on('post-load.inwp', function () {
      $('.variations_form:not(.inwp-loaded)').each(function () {
        $(this).wc_variation_form();
      });
    });

    $(document.body).on('wc-composite-initializing', '.composite_data', function (event, composite) {
      composite.actions.add_action('component_options_state_changed', function (self) {
        $(self.$component_content).find('.variations_form').removeClass('inwp-loaded inwp-pro-loaded');
      });

    });

    $(document).on('yith_infs_added_elem.inwp', function () {
      $('.variations_form:not(.inwp-loaded)').each(function () {
        $(this).wc_variation_form();
      });
    });

    $(document).on('yith-wcan-ajax-filtered.inwp', function () {
      $('.variations_form:not(.inwp-loaded)').each(function () {
        $(this).wc_variation_form();
      });
    });

    $(document).on('wood-images-loaded.inwp', function () {
      $('.variations_form:not(.inwp-loaded)').each(function () {
        $(this).wc_variation_form();
      });
    });

    $(document).on('berocket_ajax_products_loaded.inwp berocket_ajax_products_infinite_loaded.inwp', function () {
      $('.variations_form:not(.inwp-loaded)').each(function () {
        $(this).wc_variation_form();
      });
    });

    $('.shop-container .products').on('append.infiniteScroll', function (event, response, path) {
      $('.variations_form:not(.inwp-loaded)').each(function () {
        $(this).wc_variation_form();
      });
    });

    $(document).on('facetwp-loaded.inwp', function () {
      $('.variations_form:not(.inwp-loaded)').each(function () {
        $(this).wc_variation_form();
      });
    });

    $(document).on('nm_infload_after.inwp nm_ajax_shop_update_content.inwp', function () {
      $('.variations_form:not(.inwp-loaded)').each(function () {
        $(this).wc_variation_form();
      });
    });

    $('body').on('aln_reloaded.inwp', function () {
      _.delay(function () {
        $('.variations_form:not(.inwp-loaded)').each(function () {
          $(this).wc_variation_form();
        });
      }, 100);
    });
  });
}); 

/***/ }),

/***/ 11:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }


var VebVariationSwatches = function ($) {

  var Default = {};

  var VebVariationSwatches = function () {
    function VebVariationSwatches(element, config) {
      _classCallCheck(this, VebVariationSwatches);

      this._element = element;
      this.$element = $(element);
      this._config = $.extend({}, Default, config);
      this._generated = {};
      this._out_of_stock = {};
      this._disabled = {};
      this.product_variations = this.$element.data('product_variations') || [];
      this.is_ajax_variation = this.product_variations.length < 1;
      this.product_id = this.$element.data('product_id');
      this.reset_variations = this.$element.find('.reset_variations');
      this.is_mobile = $('body').hasClass('veb-variation-swatches-on-mobile');
      this.selected_item_template = '<span class="veb-selected-variation-item-name" data-default=""></span>';
      this.$element.addClass('inwp-loaded');
      this.init();
      this.update();

      $(document).trigger('veb_variation_swatches', [this.$element]);
    }

    _createClass(VebVariationSwatches, [{
      key: 'checkAvailable',
      value: function checkAvailable() {
        if ([].includes) {}
      }
    }, {
      key: 'init',
      value: function init() {
        var _this2 = this;

        var _this = this;

        this._generated = this.product_variations.reduce(function (obj, variation) {

          Object.keys(variation.attributes).map(function (attribute_name) {
            if (!obj[attribute_name]) {
              obj[attribute_name] = [];
            }

            if (variation.attributes[attribute_name]) {
              obj[attribute_name].push(variation.attributes[attribute_name]);
            }
          });

          return obj;
        }, {});

        this._out_of_stock = this.product_variations.reduce(function (obj, variation) {

          Object.keys(variation.attributes).map(function (attribute_name) {
            if (!obj[attribute_name]) {
              obj[attribute_name] = [];
            }

            if (variation.attributes[attribute_name] && !variation.is_in_stock) {
              obj[attribute_name].push(variation.attributes[attribute_name]);
            }
          });

          return obj;
        }, {});

        if (veb_variation_swatches_options.show_variation_label) {
          this.$element.find('.variations .label').each(function (index, el) {
            $(el).append(_this2.selected_item_template);
          });
        }

        this.$element.find('ul.variable-items-wrapper').each(function (i, el) {

          $(this).parent().addClass('veb-variation-items-wrapper');

          var select = $(this).siblings('select.veb-variation-raw-select');
          var selected = '';

          var options = $(this).siblings('select.veb-variation-raw-select').find('option');
          var disabled = $(this).siblings('select.veb-variation-raw-select').find('option:disabled');
          var out_of_stock = $(this).siblings('select.veb-variation-raw-select').find('option.enabled.out-of-stock');
          var current = $(this).siblings('select.veb-variation-raw-select').find('option:selected');
          var eq = $(this).siblings('select.veb-variation-raw-select').find('option').eq(1);

          var li = $(this).find('li:not(.veb-variation-swatches-variable-item-more)');
          var reselect_clear = $(this).hasClass('reselect-clear');

          var mouse_event_name = 'click.inwp'; 

          var attribute = $(this).data('attribute_name');

          var selects = [];
          var disabled_selects = [];
          var out_of_stock_selects = [];
          var $selected_variation_item = $(this).parent().prev().find('.veb-selected-variation-item-name');

          if (options.length < 1) {
            select = $(this).parent().find('select.veb-variation-raw-select');
            options = $(this).parent().find('select.veb-variation-raw-select').find('option');
            disabled = $(this).parent().find('select.veb-variation-raw-select').find('option:disabled');
            out_of_stock = $(this).siblings('select.veb-variation-raw-select').find('option.enabled.out-of-stock');
            current = $(this).parent().find('select.veb-variation-raw-select').find('option:selected');
            eq = $(this).parent().find('select.veb-variation-raw-select').find('option').eq(1);
          }

          options.each(function () {
            if ($(this).val() !== '') {
              selects.push($(this).val());
              selected = current ? current.val() : eq.val();
            }
          });

          disabled.each(function () {
            if ($(this).val() !== '') {
              disabled_selects.push($(this).val());
            }
          });

          out_of_stock.each(function () {
            if ($(this).val() !== '') {
              out_of_stock_selects.push($(this).val());
            }
          });

          var in_stocks = _.difference(selects, disabled_selects);

          var available = _.difference(in_stocks, out_of_stock_selects);

          li.each(function (index, li) {

            var attribute_value = $(this).attr('data-value');
            var attribute_title = $(this).attr('data-title');
            $(this).removeClass('selected disabled out-of-stock').addClass('disabled');
            $(this).attr('aria-checked', 'false');
            $(this).attr('tabindex', '-1');

            if ($(this).hasClass('radio-variable-item')) {
              $(this).find('input.inwp-radio-variable-item:radio').prop('disabled', true).prop('checked', false);
            }


            if (_.includes(in_stocks, attribute_value)) {

              $(this).removeClass('selected disabled');
              $(this).removeAttr('aria-hidden');
              $(this).attr('tabindex', '0');

              $(this).find('input.inwp-radio-variable-item:radio').prop('disabled', false);

              if (attribute_value === selected) {

                $(this).addClass('selected');
                $(this).attr('aria-checked', 'true');

                if (veb_variation_swatches_options.show_variation_label) {
                  $selected_variation_item.text(veb_variation_swatches_options.variation_label_separator + ' ' + attribute_title);
                }

                if ($(this).hasClass('radio-variable-item')) {
                  $(this).find('input.inwp-radio-variable-item:radio').prop('checked', true);
                }
              }
            }


            if (available.length > 0 && _.includes(out_of_stock_selects, attribute_value) && veb_variation_swatches_options.clickable_out_of_stock) {
              $(this).removeClass('disabled').addClass('out-of-stock');
            }
          });


          if (reselect_clear) {
            $(this).on(mouse_event_name, 'li:not(.selected):not(.radio-variable-item):not(.veb-variation-swatches-variable-item-more)', function (e) {
              e.preventDefault();
              e.stopPropagation();
              var value = $(this).data('value');
              select.val(value).trigger('change');
              select.trigger('click');

              select.trigger('focusin');

              if (_this.is_mobile) {
                select.trigger('touchstart');
              }

              $(this).trigger('focus'); 
              $(this).trigger('inwp-selected-item', [value, select, _this.$element]); 
            });

            $(this).on(mouse_event_name, 'li.selected:not(.radio-variable-item):not(.veb-variation-swatches-variable-item-more)', function (e) {
              e.preventDefault();
              e.stopPropagation();

              var value = $(this).val();

              select.val('').trigger('change');
              select.trigger('click');

              select.trigger('focusin');

              if (_this.is_mobile) {
                select.trigger('touchstart');
              }

              $(this).trigger('focus');

              $(this).trigger('inwp-unselected-item', [value, select, _this.$element]);
            });

            $(this).on(mouse_event_name, 'input.inwp-radio-variable-item:radio', function (e) {

              e.stopPropagation();

              $(this).trigger('change.inwp', { radioChange: true });
            });

            $(this).on('change.inwp', 'input.inwp-radio-variable-item:radio', function (e, params) {

              e.preventDefault();
              e.stopPropagation();

              if (params && params.radioChange) {

                var value = $(this).val();
                var is_selected = $(this).parent('li.radio-variable-item').hasClass('selected');

                if (is_selected) {
                  select.val('').trigger('change');
                  $(this).parent('li.radio-variable-item').trigger('inwp-unselected-item', [value, select, _this.$element]); 
                } else {
                  select.val(value).trigger('change');
                  $(this).parent('li.radio-variable-item').trigger('inwp-selected-item', [value, select, _this.$element]); 
                }

                select.trigger('click');
                select.trigger('focusin');
                if (_this.is_mobile) {
                  select.trigger('touchstart');
                }
              }
            });
          } else {

            $(this).on(mouse_event_name, 'li:not(.radio-variable-item):not(.veb-variation-swatches-variable-item-more)', function (event) {

              event.preventDefault();
              event.stopPropagation();

              var value = $(this).data('value');
              select.val(value).trigger('change');
              select.trigger('click');
              select.trigger('focusin');
              if (_this.is_mobile) {
                select.trigger('touchstart');
              }

              $(this).trigger('focus'); 

              $(this).trigger('inwp-selected-item', [value, select, _this._element]); 
            });

            $(this).on('change.inwp', 'input.inwp-radio-variable-item:radio', function (event) {
              event.preventDefault();
              event.stopPropagation();

              var value = $(this).val();

              select.val(value).trigger('change');
              select.trigger('click');
              select.trigger('focusin');

              if (_this.is_mobile) {
                select.trigger('touchstart');
              }

              $(this).parent('li.radio-variable-item').removeClass('selected disabled').addClass('selected');
              $(this).parent('li.radio-variable-item').trigger('inwp-selected-item', [value, select, _this.$element]); 
            });
          }

          $(this).on('keydown.inwp', 'li:not(.disabled):not(.veb-variation-swatches-variable-item-more)', function (event) {
            if (event.keyCode && 32 === event.keyCode || event.key && ' ' === event.key || event.keyCode && 13 === event.keyCode || event.key && 'enter' === event.key.toLowerCase()) {
              event.preventDefault();
              $(this).trigger(mouse_event_name);
            }
          });
        });

        this.$element.trigger('veb_variation_swatches_init', [this, this.product_variations]);

        $(document).trigger('veb_variation_swatches_loaded', [this.$element, this.product_variations]);
      }
    }, {
      key: 'update',
      value: function update() {

        var _this = this;
        this.$element.off('woocommerce_variation_has_changed.inwp');
        this.$element.on('woocommerce_variation_has_changed.inwp', function (event) {

          $(this).find('ul.variable-items-wrapper').each(function (index, el) {

            var select = $(this).siblings('select.veb-variation-raw-select');
            var selected = '';

            var options = $(this).siblings('select.veb-variation-raw-select').find('option');
            var disabled = $(this).siblings('select.veb-variation-raw-select').find('option:disabled');
            var out_of_stock = $(this).siblings('select.veb-variation-raw-select').find('option.enabled.out-of-stock');
            var current = $(this).siblings('select.veb-variation-raw-select').find('option:selected');
            var eq = $(this).siblings('select.veb-variation-raw-select').find('option').eq(1);
            var li = $(this).find('li:not(.veb-variation-swatches-variable-item-more)');


            var attribute = $(this).data('attribute_name');


            var selects = [];
            var disabled_selects = [];
            var out_of_stock_selects = [];
            var $selected_variation_item = $(this).parent().prev().find('.veb-selected-variation-item-name');

            if (options.length < 1) {
              select = $(this).parent().find('select.veb-variation-raw-select');
              options = $(this).parent().find('select.veb-variation-raw-select').find('option');
              disabled = $(this).parent().find('select.veb-variation-raw-select').find('option:disabled');
              out_of_stock = $(this).siblings('select.veb-variation-raw-select').find('option.enabled.out-of-stock');
              current = $(this).parent().find('select.veb-variation-raw-select').find('option:selected');
              eq = $(this).parent().find('select.veb-variation-raw-select').find('option').eq(1);
            }

            options.each(function () {
              if ($(this).val() !== '') {
                selects.push($(this).val());
                selected = current ? current.val() : eq.val();
              }
            });

            disabled.each(function () {
              if ($(this).val() !== '') {
                disabled_selects.push($(this).val());
              }
            });

            out_of_stock.each(function () {
              if ($(this).val() !== '') {
                out_of_stock_selects.push($(this).val());
              }
            });

            var in_stocks = _.difference(selects, disabled_selects);

            var available = _.difference(in_stocks, out_of_stock_selects);

            if (_this.is_ajax_variation) {

              li.each(function (index, el) {

                var attribute_value = $(this).attr('data-value');
                var attribute_title = $(this).attr('data-title');

                $(this).removeClass('selected disabled');
                $(this).attr('aria-checked', 'false');

                if (selected.length < 1 && veb_variation_swatches_options.show_variation_label) {
                  $selected_variation_item.text('');
                }

                if (attribute_value === selected) {
                  $(this).addClass('selected');
                  $(this).attr('aria-checked', 'true');

                  if (veb_variation_swatches_options.show_variation_label) {
                    $selected_variation_item.text(veb_variation_swatches_options.variation_label_separator + ' ' + attribute_title);
                  }

                  if ($(this).hasClass('radio-variable-item')) {
                    $(this).find('input.inwp-radio-variable-item:radio').prop('disabled', false).prop('checked', true);
                  }
                }

                $(this).trigger('inwp-item-updated', [selected, attribute_value, _this]);
              });
            } else {

              li.each(function (index, el) {

                var attribute_value = $(this).attr('data-value');
                var attribute_title = $(this).attr('data-title');

                $(this).removeClass('selected disabled out-of-stock').addClass('disabled');
                $(this).attr('aria-checked', 'false');
                $(this).attr('tabindex', '-1');

                if ($(this).hasClass('radio-variable-item')) {
                  $(this).find('input.inwp-radio-variable-item:radio').prop('disabled', true).prop('checked', false);
                }

                if (_.includes(in_stocks, attribute_value)) {

                  $(this).removeClass('selected disabled');
                  $(this).removeAttr('aria-hidden');
                  $(this).attr('tabindex', '0');

                  $(this).find('input.inwp-radio-variable-item:radio').prop('disabled', false);

                  if (selected.length < 1 && veb_variation_swatches_options.show_variation_label) {
                    $selected_variation_item.text('');
                  }

                  if (attribute_value === selected) {

                    $(this).addClass('selected');
                    $(this).attr('aria-checked', 'true');

                    if (veb_variation_swatches_options.show_variation_label) {
                      $selected_variation_item.text(veb_variation_swatches_options.variation_label_separator + ' ' + attribute_title);
                    }

                    if ($(this).hasClass('radio-variable-item')) {
                      $(this).find('input.inwp-radio-variable-item:radio').prop('checked', true);
                    }
                  }
                }

                if (available.length > 0 && _.includes(out_of_stock_selects, attribute_value) && veb_variation_swatches_options.clickable_out_of_stock) {
                  $(this).removeClass('disabled').addClass('out-of-stock');
                }

                $(this).trigger('inwp-item-updated', [selected, attribute_value, _this]);
              });
            }

            $(this).trigger('inwp-items-updated');
          });
        });
      }
    }], [{
      key: '_jQueryInterface',
      value: function _jQueryInterface(config) {
        return this.each(function () {
          new VebVariationSwatches(this, config);
        });
      }
    }]);

    return VebVariationSwatches;
  }();


  $.fn['VebVariationSwatches'] = VebVariationSwatches._jQueryInterface;
  $.fn['VebVariationSwatches'].Constructor = VebVariationSwatches;
  $.fn['VebVariationSwatches'].noConflict = function () {
    $.fn['VebVariationSwatches'] = $.fn['VebVariationSwatches'];
    return VebVariationSwatches._jQueryInterface;
  };

  return VebVariationSwatches;
}(jQuery);

 __webpack_exports__["default"] = (VebVariationSwatches);

/***/ }),

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(10);


/***/ })

/******/ });