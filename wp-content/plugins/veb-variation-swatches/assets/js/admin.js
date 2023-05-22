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
 	var __webpack_modules__ = ({

 "./src/js/PluginHelper.js":
 (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
 __webpack_require__.d(__webpack_exports__, {
   "PluginHelper": function() { return  PluginHelper; }
 });
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var PluginHelper = function ($) {
  var PluginHelper = function () {
    function PluginHelper() {
      _classCallCheck(this, PluginHelper);
    }

    _createClass(PluginHelper, null, [{
      key: "COMPAdmin",
      value: function COMPAdmin() {
        if ($().comp_live_feed) {
          $().comp_live_feed();
        }

        if ($().comp_deactivate_popup) {
          $().comp_deactivate_popup('veb-variation-swatches');
        }
      }
    }, {
      key: "GalleryNotification",
      value: function GalleryNotification() {
        $('.woocommerce_variation').each(function () {
          var optionsWrapper = $(this).find('.options:first');
          var galleryWrapper = $(this).find('.veb-variation-gallery-message');
          galleryWrapper.insertBefore(optionsWrapper);
        });
        $('input.upload_image_id').on('change', function (event) {
          var value = $.trim($(this).val());

          if (value) {
            $(this).closest('.data').find('.veb-variation-gallery-message').addClass('enable');
          } else {
            $(this).closest('.data').find('.veb-variation-gallery-message').removeClass('enable');
          }
        });
        $('a.install-veb-variation-gallery-action').on('click', function (event) {
          event.preventDefault();
          var $parent = $(this).parent();
          var installing = $parent.data('installing');
          var activated = $parent.data('activated');
          var nonce = $parent.data('nonce');
          $parent.text(installing);
          wp.ajax.send('install_veb_variation_gallery', {
            data: {
              'nonce': nonce
            },
            success: function success(response) {
              $parent.text(activated);

              _.delay(function () {
                $('.woocommerce_variable_attributes .veb-variation-gallery-message').remove();
              }, 5000);
            },
            error: function error(response) {
              $parent.text(activated);

              _.delay(function () {
                $('.woocommerce_variable_attributes .veb-variation-gallery-message').remove();
              }, 5000);
            }
          });
        });
      }
    }, {
      key: "PaginationAjax",
      value: function PaginationAjax($product_id, $attribute_id, $attribute_name, $offset, $selector) {
        $.ajax({
          global: false,
          url: veb_variation_swatches_admin.wc_ajax_url.toString().replace('%%endpoint%%', 'veb_variation_swatches_load_product_terms'),
          method: 'POST',
          data: {
            offset: $offset,
            product_id: $product_id,
            attribute_id: $attribute_id,
            attribute_name: $attribute_name,
            nonce: veb_variation_swatches_admin.nonce
          },
          beforeSend: function beforeSend(xhr, settings) {
            $selector.block({
              message: null,
              overlayCSS: {
                background: '#DDDDDD',
                opacity: 0.6
              }
            });
          }
        }).fail(function (jqXHR, textStatus) {
          console.error("not available on: ".concat($product_id, " ").concat($attribute_key, "."), textStatus);
        }).always(function () {
          $selector.unblock();
        }).done(function (termsMarkup) {
          if (termsMarkup) {
            $selector.html(termsMarkup);

            $(document.body).trigger('veb_variation_swatches_product_term_paging_done', $selector);
          }
        });
      }
    }, {
      key: "MetaboxToggle",
      value: function MetaboxToggle() {
        var $wrapper = $('#veb_variation_swatches_variation_product_options');
        $wrapper.on('click', '.wc-metabox > h4', function (event) {
          var box = $(this).parent('.wc-metabox');
          var content = $(this).next('.wc-metabox-content');

          if ($(event.target).filter(':input, option, .sort, select, label, .select2-selection__rendered').length) {
            return false;
          }

          if (box.hasClass('closed')) {
            box.removeClass('closed open').addClass('open');
            content.slideDown();
          } else {
            box.removeClass('closed open').addClass('closed');
            content.slideUp();
          }
        });
      }
    }, {
      key: "AttributeTypeSwitch",
      value: function AttributeTypeSwitch() {
        var $wrapper = $('#veb_variation_swatches_variation_product_options') 
        .on('change', 'select.veb_variation_swatches_attribute_type_switch', function (event) {
          var value = $(this).val();

          if (['select'].includes(value)) {
          }

          if (['image', 'color', 'button'].includes(value)) {
            $(this).closest('.wc-metabox').find('.wc-metabox-content select.veb_variation_swatches_attribute_term_type_switch').val(value).trigger('change');
          }
        }) 
        .on('change', 'select.veb_variation_swatches_attribute_term_type_switch', function (event) {
          var attribute_type = $(this).closest('.veb-variation-swatches-attribute-options-wrapper').find('select.veb_variation_swatches_attribute_type_switch').val();

          if ($(this).val() !== attribute_type) {
            $(this).closest('.veb-variation-swatches-attribute-options-wrapper').find('select.veb_variation_swatches_attribute_type_switch').val('mixed').trigger('change');
          }
        });
      }
    }, {
      key: "SetAttributeTypePaging",
      value: function SetAttributeTypePaging(selector) {
        var attribute_type_val = $(selector).closest('.veb-variation-swatches-attribute-options-wrapper').find('select.veb_variation_swatches_attribute_type_switch').val();
        var new_mode = $(selector).find('select.veb_variation_swatches_attribute_term_type_switch').hasClass('new-mode');

        if (['image', 'color', 'button'].includes(attribute_type_val)) {
          $(selector).find('select.veb_variation_swatches_attribute_term_type_switch.new-mode').val(attribute_type_val).trigger('change');
        }

        $(selector).find('select.veb_variation_swatches_attribute_term_type_switch.new-mode').each(function () {
          var value = $(this).val();

          if (!value) {
          }
        });
      }
    }, {
      key: "LoadProductAttributes",
      value: function LoadProductAttributes() {
        $('#woocommerce-product-data').on('woocommerce_variations_loaded', function (event) {
          var $wrapper = $('#veb_variation_swatches_variation_product_options');
          var product_id = $wrapper.data('product_id');
          $.ajax({
            global: false,
            url: veb_variation_swatches_admin.wc_ajax_url.toString().replace('%%endpoint%%', 'veb_variation_swatches_load_product_options'),
            method: 'POST',
            data: {
              product_id: product_id,
              nonce: veb_variation_swatches_admin.nonce
            },
            beforeSend: function beforeSend(xhr, settings) {
              $('#veb_variation_swatches_variation_product_options_inner').block({
                message: null,
                overlayCSS: {
                  background: '#DDDDDD',
                  opacity: 0.6
                }
              });
            }
          }).fail(function (jqXHR, textStatus) {
            console.error("not load option: ".concat(product_id, "."), textStatus);
          }).always(function () {
            $('#veb_variation_swatches_variation_product_options_inner').unblock();
          }).done(function (contents) {
            $(document.body).trigger('veb_variation_swatches_variation_product_options_loaded', product_id);
          });
        });
      }
    }, {
      key: "SaveProductAttributes",
      value: function SaveProductAttributes() {
        var changed = false;
        var $wrapper = $('#veb_variation_swatches_variation_product_options');
        $wrapper.on('change input color-changed', ':input:not(.inwp-skip-field)', function () {
          if (!changed) {
            window.onbeforeunload = function () {
              return veb_variation_swatches_admin.nav_warning;
            };

            changed = true;
          }
        }).on('click', '.veb_variation_swatches_save_product_attributes, .veb_variation_swatches_reset_product_attributes', function () {
          window.onbeforeunload = '';
        }).on('click', '.veb_variation_swatches_save_product_attributes', function (event) {
          event.preventDefault();
          var data = $wrapper.find(':input:not(.inwp-skip-field)').serializeJSON({
            disableColonTypes: true
          });
          var key = Object.keys(data) ? Object.keys(data).shift() : 'veb_variation_swatches_product_options';
          var product_id = $wrapper.data('product_id');
          var timeOut;
          $.ajax({
            global: false,
            url: veb_variation_swatches_admin.wc_ajax_url.toString().replace('%%endpoint%%', 'veb_variation_swatches_save_product_options'),
            method: 'POST',
            data: {
              data: data[key],
              product_id: product_id,
              nonce: veb_variation_swatches_admin.nonce
            },
            beforeSend: function beforeSend(xhr, settings) {
              clearTimeout(timeOut);
              $('#veb_variation_swatches_variation_product_options_inner').block({
                message: null,
                overlayCSS: {
                  background: '#DDDDDD',
                  opacity: 0.6
                }
              });
            }
          }).fail(function (jqXHR, textStatus) {
            console.error("not saved on: ".concat(product_id, "."), textStatus);
          }).always(function () {
            $('#veb_variation_swatches_variation_product_options_inner').unblock();
          }).done(function (contents) {
            $('#saved-message').show();
            timeOut = setTimeout(function () {
              $('#saved-message').hide(600, function () {
                $('#individual-swatches-info').removeClass('swatches-info-hide');
              });
            }, 5000);
            $(document.body).trigger('veb_variation_swatches_variation_product_options_saved', product_id);
          });
        }).on('click', '.veb_variation_swatches_reset_product_attributes', function (event) {
          event.preventDefault();

          if (confirm(veb_variation_swatches_admin.reset_notice)) {
            var product_id = $(this).data('product_id');
            $.ajax({
              global: false,
              url: veb_variation_swatches_admin.wc_ajax_url.toString().replace('%%endpoint%%', 'veb_variation_swatches_reset_product_options'),
              method: 'POST',
              data: {
                product_id: product_id,
                nonce: veb_variation_swatches_admin.nonce
              },
              beforeSend: function beforeSend(xhr, settings) {
                $('#veb_variation_swatches_variation_product_options_inner').block({
                  message: null,
                  overlayCSS: {
                    background: '#DDDDDD',
                    opacity: 0.6
                  }
                });
              }
            }).fail(function (jqXHR, textStatus) {
              console.error("not reset on: ".concat(product_id, "."), textStatus);
            }).always(function () {
              $('#veb_variation_swatches_variation_product_options_inner').unblock();
            }).done(function (contents) {
              var $html = $(contents).find('#veb_variation_swatches_variation_product_options_inner').html();
              $('#veb_variation_swatches_variation_product_options_inner').html($html); 

              $(document.body).trigger('veb_variation_swatches_variation_product_options_reset', product_id);
            });
          }
        });
      }
    }, {
      key: "ResetProductAttributes",
      value: function ResetProductAttributes() {
        var $wrapper = $('#veb_variation_swatches_variation_product_options');
      }
    }, {
      key: "Pagination",
      value: function Pagination() {
        var _this = this;

        var changed = false;
        var $wrapper = $('#veb_variation_swatches_variation_product_options');
        $wrapper.on('change input color-changed', ':input:not(.inwp-skip-field)', function (event) {
          if (!changed) {
            changed = true;
          }
        }).on('click', '.veb_variation_swatches_reset_product_attributes', function (event) {
          event.preventDefault();
          changed = false;
        }).on('click', '.veb_variation_swatches_save_product_attributes', function (event) {
          event.preventDefault();
          changed = false;
        }).on('click', '.first-page:not(.disabled), .prev-page:not(.disabled), .last-page:not(.disabled), .next-page:not(.disabled)', function (event) {
          if (changed) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            alert(veb_variation_swatches_admin.nav_warning);
          }
        }).on('click', '.first-page.disabled, .prev-page.disabled, .last-page.disabled, .next-page.disabled', function (event) {
          event.preventDefault();
        }).on('click', '.first-page:not(.disabled)', function (event) {
          event.preventDefault();
          var $selector = $(event.currentTarget).closest('.product-term-label-settings').find('.product-term-label-settings-contents');
          var $this = $(event.currentTarget).closest('.product-term-label-settings-pagination');
          var $product_id = $selector.data('product_id');
          var $attribute_id = $selector.data('attribute_id');
          var $attribute_name = $selector.data('attribute_name');
          var $offset = 0;

          _this.PaginationAjax($product_id, $attribute_id, $attribute_name, $offset, $selector);

          $this.find('.next-page, .last-page').removeClass('disabled');
          $this.find('.current-page').text(1);
          $selector.data('current', 1);
          $this.find('.first-page, .prev-page').addClass('disabled');
        }).on('click', '.prev-page:not(.disabled)', function (event) {
          event.preventDefault();
          var $selector = $(event.currentTarget).closest('.product-term-label-settings').find('.product-term-label-settings-contents');
          var $this = $(event.currentTarget).closest('.product-term-label-settings-pagination');
          $selector.block({
            message: null,
            overlayCSS: {
              background: '#DDDDDD',
              opacity: 0.6
            }
          });
          var $product_id = $selector.data('product_id');
          var $pages = $selector.data('pages');
          var $attribute_id = $selector.data('attribute_id');
          var $attribute_name = $selector.data('attribute_name');
          var $current = $selector.data('current');

          var $limit = $selector.data('limit');

          var $total = $selector.data('total');
          var $offset = ($current - 1) * $limit - $limit;
          var $prev = $current - 1;

          _this.PaginationAjax($product_id, $attribute_id, $attribute_name, $offset, $selector);

          $this.find('.next-page, .last-page').removeClass('disabled');
          $this.find('.current-page').text($prev);
          $selector.data('current', $prev);

          if ($offset === 0) {
            $this.find('.first-page, .prev-page').addClass('disabled');
          }
        }).on('click', '.next-page:not(.disabled)', function (event) {
          event.preventDefault();
          var $selector = $(event.currentTarget).closest('.product-term-label-settings').find('.product-term-label-settings-contents');
          var $this = $(event.currentTarget).closest('.product-term-label-settings-pagination');
          $selector.block({
            message: null,
            overlayCSS: {
              background: '#DDDDDD',
              opacity: 0.6
            }
          });
          var $product_id = $selector.data('product_id');
          var $pages = $selector.data('pages');
          var $attribute_id = $selector.data('attribute_id');
          var $attribute_name = $selector.data('attribute_name');
          var $current = $selector.data('current');

          var $limit = $selector.data('limit');

          var $total = $selector.data('total');
          var $offset = $current * $limit;
          var $next = $current + 1;

          _this.PaginationAjax($product_id, $attribute_id, $attribute_name, $offset, $selector);

          $this.find('.first-page, .prev-page').removeClass('disabled');
          $this.find('.current-page').text($next);
          $selector.data('current', $next);

          if ($pages === $next) {
            $this.find('.next-page, .last-page').addClass('disabled');
          }
        }).on('click', '.last-page:not(.disabled)', function (event) {
          event.preventDefault();
          var $selector = $(event.currentTarget).closest('.product-term-label-settings').find('.product-term-label-settings-contents');
          var $this = $(event.currentTarget).closest('.product-term-label-settings-pagination');
          $selector.block({
            message: null,
            overlayCSS: {
              background: '#DDDDDD',
              opacity: 0.6
            }
          });
          var $product_id = $selector.data('product_id');
          var $pages = $selector.data('pages');
          var $attribute_id = $selector.data('attribute_id');
          var $attribute_name = $selector.data('attribute_name');
          var $current = $selector.data('current');

          var $limit = $selector.data('limit');

          var $offset = $pages * $limit - $limit;

          _this.PaginationAjax($product_id, $attribute_id, $attribute_name, $offset, $selector);

          $this.find('.first-page, .prev-page').removeClass('disabled');
          $this.find('.current-page').text($pages);
          $selector.data('current', $pages);
          $this.find('.next-page, .last-page').addClass('disabled');
        });
      }
    }, {
      key: "ResetAfterTermCreate",
      value: function ResetAfterTermCreate() {
        $(document.body).on('veb_variation_swatches_admin_term_meta_added', this.ClearImagePicker);
        $(document.body).on('veb_variation_swatches_admin_term_meta_added', this.ClearColorPicker);
        $(document).ajaxComplete(function (event, request, settings) {
          try {
            var data = Object.fromEntries(new URLSearchParams(settings.data));

            if ('add-tag' === data.action && '' === $('#tag-name').val()) {
              _.delay(function () {
                $(document.body).trigger('veb_variation_swatches_admin_term_meta_added', data);
              }, 300);
            }
          } catch (err) {}
        });
      }
    }, {
      key: "ImageUploader",
      value: function ImageUploader() {
        $(document.body).off('click', 'button.inwp_upload_image_button');
        $(document.body).on('click', 'button.inwp_upload_image_button', this.AddImage);
        $(document.body).on('click', 'button.inwp_remove_image_button', this.RemoveImage); 
      }
    }, {
      key: "AddImage",
      value: function AddImage(event) {
        var _this2 = this;

        event.preventDefault();
        event.stopPropagation();
        var file_frame;

        if (typeof wp !== 'undefined' && wp.media && wp.media.editor) {
          if (file_frame) {
            file_frame.open();
            return;
          } 


          file_frame = wp.media.frames.select_image = wp.media({
            title: veb_variation_swatches_admin.media_title,
            button: {
              text: veb_variation_swatches_admin.button_title
            },
            multiple: false
          });

          file_frame.on('select', function () {
            var attachment = file_frame.state().get('selection').first().toJSON();

            if ($.trim(attachment.id) !== '') {
              var url = typeof attachment.sizes.thumbnail === 'undefined' ? attachment.sizes.full.url : attachment.sizes.thumbnail.url;
              $(_this2).prev().val(attachment.id);
              $(_this2).closest('.meta-image-field-wrapper').find('img').attr('src', url);
              $(_this2).next().show();
            }

          });

          file_frame.on('open', function () {
            var selection = file_frame.state().get('selection');
            var current = $(_this2).prev().val();
            var attachment = wp.media.attachment(current);
            attachment.fetch();
            selection.add(attachment ? [attachment] : []);
          }); 

          file_frame.open();
        }
      }
    }, {
      key: "RemoveImage",
      value: function RemoveImage(event) {
        event.preventDefault();
        event.stopPropagation();
        var placeholder = $(this).closest('.meta-image-field-wrapper').find('img').data('placeholder');
        $(this).closest('.meta-image-field-wrapper').find('img').attr('src', placeholder);
        $(this).prev().prev().val('');
        $(this).hide();
        return false;
      }
    }, {
      key: "ClearImagePicker",
      value: function ClearImagePicker() {
        $('#addtag').find('.inwp_remove_image_button').trigger('click');
      }
    }, {
      key: "__SelectWoo",
      value: function __SelectWoo() {
        var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'select.inwp-select-woo';

        try {
          $(document.body).on('veb_variation_swatches_select_woo_init', function (event) {
            $(selector).selectWoo({
              allowClear: true
            });
          }).trigger('veb_variation_swatches_select_woo_init');
        } catch (err) {
          window.console.log(err);
        }
      }
    }, {
      key: "InitTooltip",
      value: function InitTooltip() {
        $(document.body).trigger('init_tooltips');
      }
    }, {
      key: "SelectWoo",
      value: function SelectWoo() {
        try {
          $(document.body).trigger('wc-enhanced-select-init');
        } catch (err) {
          window.console.log(err);
        }
      }
    }, {
      key: "ColorPicker",
      value: function ColorPicker() {
        var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'input.inwp-color-picker';

        try {
          $(document.body).on('veb_variation_swatches_color_picker_init', function (event) {
            $(selector).wpColorPicker({
              change: function change(event, ui) {
                $(selector).trigger('color-changed');
              },
              clear: function clear() {
                $(selector).trigger('color-changed');
              }
            });
          }).trigger('veb_variation_swatches_color_picker_init');
        } catch (err) {
          window.console.log(err);
        }
      }
    }, {
      key: "ClearColorPicker",
      value: function ClearColorPicker() {
        $('#addtag').find('.wp-picker-clear').trigger('click');
      }
    }, {
      key: "FieldDependency",
      value: function FieldDependency() {
        var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-comp_dependency]';

        try {
          $(document.body).on('init_form_field_dependency', function () {
            $(selector).COMPFormFieldDependency();
          }).trigger('init_form_field_dependency');
        } catch (err) {
          window.console.log(err);
        }
      }
    }, {
      key: "FieldDependencyTrigger",
      value: function FieldDependencyTrigger() {
        $(document.body).trigger('init_form_field_dependency');
      }
    }, {
      key: "savingDialog",
      value: function savingDialog($wrapper, $dialog, taxonomy) {
        var data = {};
        var term = '';

        $dialog.find("input, select").each(function () {
          var key = $(this).attr('name');
          var value = $(this).val();

          if (key) {
            if (key === 'tag_name') {
              term = value;
            } else {
              data[key] = value;
            }

            $(this).val('');
          }
        });

        if (term) {
          $('.product_attributes').block({
            message: null,
            overlayCSS: {
              background: '#FFFFFF',
              opacity: 0.6
            }
          });

          var ajax_data = _objectSpread({
            action: 'woocommerce_add_new_attribute',
            taxonomy: taxonomy,
            term: term,
            security: woocommerce_admin_meta_boxes.add_attribute_nonce
          }, data);

          $.post(woocommerce_admin_meta_boxes.ajax_url, ajax_data, function (response) {
            if (response.error) {
              window.alert(response.error);
            } else if (response.slug) {
              $wrapper.find('select.attribute_values').append('<option value="' + response.term_id + '" selected="selected">' + response.name + '</option>');
              $wrapper.find('select.attribute_values').change();
            }

            $('.product_attributes').unblock();
          });
        } else {
          $('.product_attributes').unblock();
        }
      }
    }, {
      key: "AttributeDialog",
      value: function AttributeDialog() {
        var self = this;
        $('.product_attributes').on('click', 'button.inwp_add_new_attribute', function (event) {
          event.preventDefault();
          var $wrapper = $(this).closest('.woocommerce_attribute');
          var attribute = $wrapper.data('taxonomy');
          var title = $(this).data('dialog_title');
          $('.inwp-attribute-dialog-for-' + attribute).dialog({
            title: '',
            dialogClass: 'wp-dialog inwp-attribute-dialog',
            classes: {
              "ui-dialog": "wp-dialog inwp-attribute-dialog"
            },
            autoOpen: false,
            draggable: true,
            width: 'auto',
            modal: true,
            resizable: false,
            closeOnEscape: true,
            position: {
              my: "center",
              at: "center",
              of: window
            },
            open: function open() {
              $('.ui-widget-overlay').bind('click', function () {
                $('#attribute-dialog').dialog('close');
              });
            },
            create: function create() {
            }
          }).dialog("option", "title", title).dialog("option", "buttons", [{
            text: veb_variation_swatches_admin.dialog_save,
            click: function click() {
              self.savingDialog($wrapper, $(this), attribute);
              $(this).dialog("close").dialog("destroy");
            }
          }, {
            text: veb_variation_swatches_admin.dialog_cancel,
            click: function click() {
              $(this).dialog("close").dialog("destroy");
            }
          }]).dialog('open');
        });
      }
    }]);

    return PluginHelper;
  }();

  return PluginHelper;
}(jQuery);



 }),

 "./src/js/backend.js":
 (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

jQuery(function ($) {
  Promise.resolve().then(function () {
    return _interopRequireWildcard(__webpack_require__("./src/js/PluginHelper.js"));
  }).then(function (_ref) {
    var PluginHelper = _ref.PluginHelper;
    PluginHelper.ResetAfterTermCreate();
    PluginHelper.ColorPicker();
    PluginHelper.ImageUploader();
    PluginHelper.FieldDependency(); 

    PluginHelper.Pagination();
    PluginHelper.MetaboxToggle();
    PluginHelper.AttributeTypeSwitch();
    PluginHelper.SaveProductAttributes(); 


    $(document.body).on('veb_variation_swatches_variation_product_options_reset veb_variation_swatches_product_term_paging_done', function (event, $selector) {
      PluginHelper.InitTooltip();
      PluginHelper.SelectWoo();
      PluginHelper.ColorPicker();
      PluginHelper.FieldDependencyTrigger();
      PluginHelper.SetAttributeTypePaging($selector);
    });
  });
});

 }),

 "./src/scss/backend.scss":
 (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);


 }),

 "./src/scss/frontend.scss":
 (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);


 })

 	});

 	var __webpack_module_cache__ = {};
 	
 	function __webpack_require__(moduleId) {
 		var cachedModule = __webpack_module_cache__[moduleId];
 		if (cachedModule !== undefined) {
 			return cachedModule.exports;
 		}
 		var module = __webpack_module_cache__[moduleId] = {

 			exports: {}
 		};
 	
 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
 	
 		return module.exports;
 	}
 	
 	__webpack_require__.m = __webpack_modules__;
 	
 	!function() {
 		var deferred = [];
 		__webpack_require__.O = function(result, chunkIds, fn, priority) {
 			if(chunkIds) {
 				priority = priority || 0;
 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
 				deferred[i] = [chunkIds, fn, priority];
 				return;
 			}
 			var notFulfilled = Infinity;
 			for (var i = 0; i < deferred.length; i++) {
 				var chunkIds = deferred[i][0];
 				var fn = deferred[i][1];
 				var priority = deferred[i][2];
 				var fulfilled = true;
 				for (var j = 0; j < chunkIds.length; j++) {
 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every(function(key) { return __webpack_require__.O[key](chunkIds[j]); })) {
 						chunkIds.splice(j--, 1);
 					} else {
 						fulfilled = false;
 						if(priority < notFulfilled) notFulfilled = priority;
 					}
 				}
 				if(fulfilled) {
 					deferred.splice(i--, 1)
 					var r = fn();
 					if (r !== undefined) result = r;
 				}
 			}
 			return result;
 		};
 	}();
 	
 	!function() {
 		__webpack_require__.d = function(exports, definition) {
 			for(var key in definition) {
 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
 				}
 			}
 		};
 	}();
 	
 	!function() {
 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
 	}();
 	
 	!function() {
 		__webpack_require__.r = function(exports) {
 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
 			}
 			Object.defineProperty(exports, '__esModule', { value: true });
 		};
 	}();
 	
 	!function() {

 		var installedChunks = {
 			"/assets/js/admin": 0,
 			"assets/css/frontend": 0,
 			"assets/css/admin": 0
 		};
 		
 		__webpack_require__.O.j = function(chunkId) { return installedChunks[chunkId] === 0; };
 		
 		var webpackJsonpCallback = function(parentChunkLoadingFunction, data) {
 			var chunkIds = data[0];
 			var moreModules = data[1];
 			var runtime = data[2];
 			var moduleId, chunkId, i = 0;
 			if(chunkIds.some(function(id) { return installedChunks[id] !== 0; })) {
 				for(moduleId in moreModules) {
 					if(__webpack_require__.o(moreModules, moduleId)) {
 						__webpack_require__.m[moduleId] = moreModules[moduleId];
 					}
 				}
 				if(runtime) var result = runtime(__webpack_require__);
 			}
 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
 			for(;i < chunkIds.length; i++) {
 				chunkId = chunkIds[i];
 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
 					installedChunks[chunkId][0]();
 				}
 				installedChunks[chunkId] = 0;
 			}
 			return __webpack_require__.O(result);
 		}
 		
 		var chunkLoadingGlobal = self["webpackChunkveb_variation_swatches"] = self["webpackChunkveb_variation_swatches"] || [];
 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
 	}();

 	__webpack_require__.O(undefined, ["assets/css/frontend","assets/css/admin"], function() { return __webpack_require__("./src/js/backend.js"); })
 	__webpack_require__.O(undefined, ["assets/css/frontend","assets/css/admin"], function() { return __webpack_require__("./src/scss/backend.scss"); })
 	var __webpack_exports__ = __webpack_require__.O(undefined, ["assets/css/frontend","assets/css/admin"], function() { return __webpack_require__("./src/scss/frontend.scss"); })
 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
 	
 })()
;