'use strict';

(function($) {
  $(document).on('wpcbn_adding_to_cart', function(e, $btn) {
    $btn.removeClass('added').addClass('loading');
  });

  $(document).
      on('wpcbn_added_to_cart', function(e, fragments, cart_hash, $btn) {
        $btn.removeClass('loading').addClass('added');
      });

  $(document).on('click touch', '.wpcbn-btn', function(e) {
    if ((wpcbn_vars.instant_checkout || wpcbn_vars.woofc) &&
        !$(this).hasClass('wpcbn-disabled')) {
      e.preventDefault();

      let $btn = $(this);
      let form_data = [];
      let data = {};
      data.action = 'wpcbn_add_to_cart';
      data.nonce = wpcbn_vars.nonce;

      if ($btn.hasClass('wpcbn-btn-single')) {
        let $form = $btn.closest('form.cart');

        form_data = $form.find(
            'input:not([name="product_id"]), select, button, textarea').
            serializeArrayAll() || [];

        $.each(form_data, function(i, item) {
          if (item.name === 'add-to-cart') {
            item.name = 'product_id';
            item.value = $form.find('input[name=variation_id]').val() ||
                $form.find('[name=variation_id]').val() ||
                $form.find('input.variation_id').val() ||
                $form.find('.variation_id').val() ||
                $form.find('input[name=add-to-cart]').val() ||
                $form.find('[name=add-to-cart]').val() || $btn.val();
          }
        });

        if ($btn.hasClass('wpcbn-btn-variable')) {
          // variable product
          let attrs = {};

          $form.find('select[name^=attribute]').each(function() {
            let attribute = $(this).attr('name');

            attrs[attribute] = $(this).val();
          });

          data.variation = attrs;
        }

        $.each(form_data, function(i, item) {
          if (item.name !== '') {
            data[item.name] = item.value;
          }
        });
      } else {
        data.product_id = $btn.data('product_id');
        data.quantity = $btn.data('quantity');

        form_data['product_id'] = $btn.data('product_id');
        form_data['quantity'] = $btn.data('quantity');
      }

      $(document.body).trigger('wpcbn_adding_to_cart', [$btn, form_data]);

      $.post(wpcbn_vars.wc_ajax_url.toString().
              replace('%%endpoint%%', 'wpcbn_add_to_cart'), data,
          function(response) {
            if (!response) {
              return;
            }

            if (response.error && response.product_url) {
              window.location = response.product_url;
              return;
            }

            $(document.body).
                trigger('wpcbn_added_to_cart',
                    [response.fragments, response.cart_hash, $btn]);

            if (wpcbn_vars.woofc) {
              $(document.body).
                  trigger('added_to_cart',
                      [response.fragments, response.cart_hash, $btn]);
            }

            if (wpcbn_vars.instant_checkout && ($('.wpcbn-area').length)) {
              wpcbn_show();

              if (!$(document).find('.wpcbn-checkout-form').length) {
                // get checkout form
                $('.wpcbn-area').addClass('wpcbn-loading');

                $.post(wpcbn_vars.wc_ajax_url.toString().
                        replace('%%endpoint%%', 'wpcbn_get_checkout_form'),
                    {
                      action: 'wpcbn_get_checkout_form',
                      nonce: wpcbn_vars.nonce,
                    },
                    function(response) {
                      if (!response) {
                        return;
                      }

                      $('.wpcbn-inner-mid').html(response);

                      if (wpcbn_vars.wc_checkout_js !== '') {
                        $.getScript(wpcbn_vars.wc_checkout_js);
                      }

                      $('.wpcbn-area').removeClass('wpcbn-loading');
                    });
              }

              wpcbn_perfect_scrollbar();

              $(document.body).
                  trigger('update_checkout', {update_shipping_method: false});
            }
          });
    }
  });

  $(document).on('click touch', '.wpcbn-overlay, .wpcbn-close', function() {
    wpcbn_hide();
  });

  $(document).on('woovr_selected', function(e, selected) {
    let id = selected.attr('data-id');
    let pid = selected.attr('data-pid');
    let purchasable = selected.attr('data-purchasable');

    if (purchasable === 'yes' && id >= 0) {
      $('.wpcbn-btn[data-product_id="' + pid + '"]').
          removeClass('wpcbn-disabled');
    } else {
      $('.wpcbn-btn[data-product_id="' + pid + '"]').addClass('wpcbn-disabled');
    }

    $(document).trigger('wpcbn_woovr_selected', [selected]);
  });

  $(document).on('found_variation', function(e, t) {
    let pid = $(e['target']).
        closest('.variations_form').
        attr('data-product_id');

    if (t['is_in_stock'] && t['is_purchasable']) {
      $('.wpcbn-btn[data-product_id="' + pid + '"]').
          removeClass('wpcbn-disabled');
    } else {
      $('.wpcbn-btn[data-product_id="' + pid + '"]').addClass('wpcbn-disabled');
    }

    $(document).trigger('wpcbn_found_variation', [t]);
  });

  $(document).on('reset_data', function(e) {
    let pid = $(e['target']).
        closest('.variations_form').
        attr('data-product_id');

    // disable button
    $('.wpcbn-btn[data-product_id="' + pid + '"]').addClass('wpcbn-disabled');

    $(document).trigger('wpcbn_reset_data');
  });

  $.fn.serializeArrayAll = function() {
    let rCRLF = /\r?\n/g;

    return this.map(function() {
      return this.elements ? $.makeArray(this.elements) : this;
    }).map(function(i, elem) {
      let val = $(this).val();

      if (val == null) {
        return val == null;
      } else if (this.type === 'checkbox') {
        if (this.checked) {
          return {name: this.name, value: this.checked ? this.value : ''};
        }
      } else if (this.type === 'radio') {
        if (this.checked) {
          return {name: this.name, value: this.checked ? this.value : ''};
        }
      } else {
        return $.isArray(val) ? $.map(val, function(val, i) {
          return {name: elem.name, value: val.replace(rCRLF, '\r\n')};
        }) : {name: elem.name, value: val.replace(rCRLF, '\r\n')};
      }
    }).get();
  };

  function wpcbn_show() {
    $('body').addClass('wpcbn-show');
  }

  function wpcbn_hide() {
    $('body').removeClass('wpcbn-show');
  }

  function wpcbn_perfect_scrollbar() {
    if (wpcbn_vars.perfect_scrollbar) {
      $('.wpcbn-inner .wpcbn-inner-mid').
          perfectScrollbar({suppressScrollX: true, theme: 'wpc'});
    }
  }
})(jQuery);
