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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ({

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(9);


/***/ }),

/***/ 9:
/***/ (function(module, exports) {


jQuery(function ($) {

  $('#woocommerce-product-data').on('woocommerce_variations_loaded', function () {
    wp.ajax.send('inwp_pro_load_product_attributes', {
      success: function success(data) {
        $('#inwp-pro-product-variable-swatches-options').html(data);
        $(document.body).trigger('inwp_pro_product_swatches_variation_loaded');
      },
      data: {
        post_id: inwp_pro_product_variation_data.post_id,
        nonce: inwp_pro_product_variation_data.nonce
      }
    });
  });

  $(document.body).on('click', '.inwp_pro_save_product_attributes', function () {

    var data = $('#inwp-pro-product-variable-swatches-options').find(':input:not(.inwp-skip-field)').serializeJSON({
      disableColonTypes: true
    });
    var key = Object.keys(data) ? Object.keys(data).shift() : '_inwp_pro_swatch_option';


    $('#inwp-pro-product-variable-swatches-options').block({
      message: null,
      overlayCSS: {
        background: '#fff',
        opacity: 0.6
      }
    });

    wp.ajax.send('inwp_pro_save_product_attributes', {
      success: function success(data) {
        $('#inwp-pro-product-variable-swatches-options').unblock();
        $('#inwp-pro-product-variable-swatches-options-notice').removeClass('notice updated error').html(data.message).addClass(data.class);
      },
      error: function error(_error) {
        console.error(_error);
        $('#inwp-pro-product-variable-swatches-options').unblock();
        $('#inwp-pro-product-variable-swatches-options-notice').removeClass('notice updated error').html('Ajax error. Please check console').addClass('error');
      },

      data: {
        post_id: inwp_pro_product_variation_data.post_id,
        nonce: inwp_pro_product_variation_data.nonce,
        data: data[key]
      }
    });
  });

  $(document.body).on('click', '.inwp_pro_reset_product_attributes', function () {
    if (confirm(inwp_pro_product_variation_data.reset_notice)) {
      $('#inwp-pro-product-variable-swatches-options').block({
        message: null,
        overlayCSS: {
          background: '#fff',
          opacity: 0.6
        }
      });
      wp.ajax.send('inwp_pro_reset_product_attributes', {
        success: function success(data) {
          $('#woocommerce-product-data').trigger('woocommerce_variations_loaded');
          $('#inwp-pro-product-variable-swatches-options').unblock();
        },
        error: function error(_error2) {
          console.error(_error2);
          $('#inwp-pro-product-variable-swatches-options').unblock();
        },

        data: {
          post_id: inwp_pro_product_variation_data.post_id,
          nonce: inwp_pro_product_variation_data.nonce
        }
      });
    }
  });

  $.fn.inwp_pro_product_attribute_type = function (options) {
    return this.each(function () {
      var _this = this;

      var $wrapper = $(this).closest('.inwp-pro-variable-swatches-attribute-wrapper');

      var change_classes = function change_classes() {
        var value = $(_this).val();
        var visible_class = 'visible_if_' + value;

        var existing_classes = Object.keys(inwp_pro_product_variation_data.attribute_types).map(function (type) {
          return 'visible_if_' + type;
        }).join(' ');

        $wrapper.removeClass(existing_classes).removeClass('visible_if_custom').addClass(visible_class);
        return value;
      };

      $(this).on('change', function (e) {
        var value = change_classes();
        $wrapper.find('.inwp-pro-swatch-tax-type').val(value).trigger('change.taxonomy');
      });

      $(this).on('change.attribute', function (e) {
        change_classes();
      });
    });
  };

  $.fn.inwp_pro_product_taxonomy_type = function (options) {
    return this.each(function () {
      var _this2 = this;

      var $wrapper = $(this).closest('.inwp-pro-variable-swatches-attribute-tax-wrapper');
      var $main_wrapper = $(this).closest('.inwp-pro-variable-swatches-attribute-wrapper');

      var change_classes = function change_classes() {
        var value = $(_this2).val();
        var visible_class = 'visible_if_tax_' + value;

        var existing_classes = Object.keys(inwp_pro_product_variation_data.attribute_types).map(function (type) {
          return 'visible_if_tax_' + type;
        }).join(' ');

        $wrapper.removeClass(existing_classes).addClass(visible_class);
        return value;
      };

      $(this).on('change', function (e) {

        change_classes();

        var allValues = [];
        $main_wrapper.find('.inwp-pro-swatch-tax-type').each(function () {
          allValues.push($(this).val());
        });

        var uniqueValues = _.uniq(allValues);
        var is_all_tax_same = uniqueValues.length === 1;

        if (is_all_tax_same) {
          $main_wrapper.find('.inwp-pro-swatch-option-type').val(uniqueValues.toString()).trigger('change.attribute');
        } else {
          $main_wrapper.find('.inwp-pro-swatch-option-type').val('custom').trigger('change.attribute');
        }
      });

      $(this).on('change.taxonomy', function (e) {
        change_classes();
      });
    });
  };

  $.fn.inwp_pro_product_taxonomy_item_tooltip_type = function (options) {
    return this.each(function () {
      var _this3 = this;

      var $wrapper = $(this).closest('tbody');

      var change_classes = function change_classes() {
        var value = $(_this3).val();
        var visible_class = 'visible_if_item_tooltip_type_' + value;

        var existing_classes = ['', 'text', 'image', 'no'].map(function (type) {
          return 'visible_if_item_tooltip_type_' + type;
        }).join(' ');

        $wrapper.find('.inwp-pro-item-tooltip-type-item').removeClass(existing_classes).addClass(visible_class);
        return value;
      };

      $(this).on('change', function (e) {
        change_classes();
      });

      $(this).trigger('change');
    });
  };

  $.fn.inwp_pro_product_taxonomy_item_dual_color = function (options) {
    return this.each(function () {
      var _this4 = this;

      var $wrapper = $(this).closest('tbody');

      var change_classes = function change_classes() {
        var value = $(_this4).val();
        var visible_class = 'visible_if_item_dual_color_' + value;

        var existing_classes = ['', 'yes', 'no'].map(function (type) {
          return 'visible_if_item_dual_color_' + type;
        }).join(' ');

        $wrapper.find('.inwp-pro-item-secondary-color-item').removeClass(existing_classes).addClass(visible_class);
        return value;
      };

      $(this).on('change', function (e) {
        change_classes();
      });

      $(this).trigger('change');
    });
  };

  $('.inwp-pro-swatch-option-type').inwp_pro_product_attribute_type();
  $('.inwp-pro-swatch-tax-type').inwp_pro_product_taxonomy_type();
  $('.inwp-pro-item-tooltip-type').inwp_pro_product_taxonomy_item_tooltip_type();
  $('.inwp-pro-item-tooltip-is-dual-color').inwp_pro_product_taxonomy_item_dual_color();

  $(document.body).on('inwp_pro_product_swatches_variation_loaded', function () {
    $('.inwp-pro-swatch-option-type').inwp_pro_product_attribute_type();
    $('.inwp-pro-swatch-tax-type').inwp_pro_product_taxonomy_type();
    $('.inwp-pro-item-tooltip-type').inwp_pro_product_taxonomy_item_tooltip_type();
    $('.inwp-pro-item-tooltip-is-dual-color').inwp_pro_product_taxonomy_item_dual_color();
  });
});

 })

 });