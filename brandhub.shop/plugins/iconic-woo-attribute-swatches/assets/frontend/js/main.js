(function ($, document) {
  var iconic_was = {
    cache() {
      iconic_was.els = {};
      iconic_was.vars = {};

      // common vars
      iconic_was.vars.swatch_group_class = '.iconic-was-swatches';
      iconic_was.vars.swatch_class = '.iconic-was-swatch';
      iconic_was.vars.selected_class = 'iconic-was-swatch--selected';
      iconic_was.vars.li_selected_class = 'iconic-was-swatches__item--selected';
      iconic_was.vars.disabled_class = 'iconic-was-swatch--disabled';
      iconic_was.vars.follow_class = 'iconic-was-swatch--follow';
      iconic_was.vars.variations_form_class = '.variations_form';
      iconic_was.vars.attribute_labels_class = '.variations .label';
      iconic_was.vars.chosen_attribute_class = '.iconic-was-chosen-attribute';
      iconic_was.vars.no_selection = '<span class="iconic-was-chosen-attribute__no-selection">' + iconic_was_vars.i18n.no_selection + '</span>';
      iconic_was.vars.attribute_selects_selector = '.variations select';
      iconic_was.vars.change_image_links_class = '.iconic-was-swatch--change-image';
      iconic_was.vars.widget_class = '.iconic-was-swatches--widget ul';
      iconic_was.vars.widget_group_item = '.iconic-was-swatch[data-group]';
      iconic_was.vars.window_size = $(window).width();
    },
    on_ready() {
      // on ready stuff here
      iconic_was.cache();
      iconic_was.setup_swatches();
      iconic_was.setup_change_image_links();
      iconic_was.setup_fees();
      iconic_was.setup_filter_groups();
    },
    /**
     * Setup the swatches on the frontend.
     */
    setup_swatches() {
      /**
       * When a swatch is clicked
       */
      $(document.body).on('click', iconic_was.vars.swatch_class, function (event) {
        let $swatch = $(this),
          $form = $swatch.closest(iconic_was.vars.variations_form_class),
          $table = $swatch.closest('table'),
          $swatch_wrapper = $swatch.closest(iconic_was.vars.swatch_group_class),
          attribute = $swatch_wrapper.data('attribute'),
          attribute_value = $swatch.data('attribute-value'),
          $select = $table.find('select[id="' + attribute.replace('attribute_', '') + '"]');

        // Compatibility with WooCommerce Product Bundles by Somewherewarm.
        if (0 === $select.length && $swatch.closest('.bundled_item_cart_content')) {
          $form = $swatch.closest('.bundled_item_cart_content');
          $select = $table.find('select[id="' + attribute.replace('attribute_', '') + '_' + $form.data('bundled_item_id') + '"]');
        }
        let select_name = $select.attr('name'),
          $cell = $swatch.closest('.value'),
          $label_selected = $cell.prev('.label').find(iconic_was.vars.chosen_attribute_class),
          is_visual = $swatch.hasClass('iconic-was-swatch--colour-swatch') || $swatch.hasClass('iconic-was-swatch--image-swatch'),
          selected = iconic_was.get_current_values($form),
          reselect_values = false;
        if ($swatch.hasClass(iconic_was.vars.follow_class)) {
          return true;
        }

        // do nothing if swatch is disabled
        if ($swatch.hasClass(iconic_was.vars.disabled_class)) {
          iconic_was.reset_form(event, $form);
          delete selected[select_name];
          reselect_values = true;
        }

        // trigger focusin on the select field to run WooCommerce triggers
        // this refreshes the select field with available options
        $select.trigger('focusin');

        // deselect if swatch is already selected
        if ($swatch.hasClass(iconic_was.vars.selected_class)) {
          iconic_was.deselect_swatch($swatch);
          iconic_was.select_value($select, '');
          $label_selected.html(iconic_was.vars.no_selection);
          return;
        }
        let $is_ajax_variations = $(iconic_was.vars.variations_form_class).data('product_variations') === false,
          $option_selector = '[value="' + iconic_was.esc_double_quotes(attribute_value) + '"]';
        if (!$is_ajax_variations) {
          $option_selector = '.enabled' + $option_selector;
        }

        // if the select field has the value we want still, select it
        if ($select.find($option_selector).length > 0) {
          iconic_was.deselect_swatch_group($form, attribute);
          iconic_was.select_swatch($swatch);
          iconic_was.select_value($select, attribute_value);
          if (reselect_values) {
            iconic_was.select_values($form, selected);
          }
        }
      });

      /**
       * Trigger focusin on the select field to run WooCommerce triggers
       * this refreshes the select field with available options
       */
      $(document).on('mouseenter mouseleave', iconic_was.vars.swatch_class, function (e) {
        const $select = $(this).closest(iconic_was.vars.swatch_group_class).next('div').find('select');
        if ($select.length <= 0) {
          return;
        }
        $select.trigger('focusin');
      });

      /**
       * When select fields are updated to reflect available atts
       */
      $(document).on('woocommerce_update_variation_values', iconic_was.vars.variations_form_class, function () {
        const $form = $(this),
          $selects = $form.find('select');
        $selects.each(function (index) {
          const $select = $(this),
            $options = $select.find('option'),
            attribute = $select.data('attribute_name'),
            $swatch_group = $form.find(iconic_was.vars.swatch_group_class + '[data-attribute="' + iconic_was.esc_double_quotes(attribute) + '"]');
          $swatch_group.find(iconic_was.vars.swatch_class).not(iconic_was.vars.swatch_class + '--dummy').addClass(iconic_was.vars.disabled_class);
          $options.each(function (index, option) {
            const $option = $(option),
              attribute_value = $option.val(),
              $swatch = $swatch_group.find('[data-attribute-value="' + iconic_was.esc_double_quotes(attribute_value) + '"]');
            if (!$option.hasClass('enabled')) {
              iconic_was.deselect_swatch($swatch);
              return;
            }
            $swatch.removeClass(iconic_was.vars.disabled_class);
          });
        });
      });

      /**
       * When select fields change
       */
      $(document).on('change', iconic_was.vars.attribute_selects_selector, function () {
        iconic_was.change_label($(this));
      });

      /**
       * When form data is reset
       */
      $(document.body).on('click', '.reset_variations', function (event) {
        const $form = $(this).closest(iconic_was.vars.variations_form_class);
        iconic_was.reset_form(event, $form);
      });

      /**
       * Deselect unavailable attribute.
       */
      $(document).on('check_variations', 'form.variations_form', function () {
        const $form = $(this),
          $disabled = $form.find('.' + iconic_was.vars.disabled_class);
        if ($disabled.length <= 0) {
          return;
        }
        if (!$disabled.hasClass(iconic_was.vars.selected_class)) {
          return;
        }
        const $row = $disabled.closest('tr'),
          $chosen_label = $row.find(iconic_was.vars.chosen_attribute_class);
        $chosen_label.html(iconic_was.vars.no_selection);
        iconic_was.deselect_swatch($disabled);
      });

      /**
       * On page load
       */
      iconic_was.swatches_on_load();
    },
    /**
     * Selected values from array
     *
     * @param element $form
     * @param array   values
     * @param $form
     * @param values
     */
    select_values($form, values) {
      const $selects = $form.find('select');
      if ($selects.length <= 0) {
        return false;
      }
      $selects.each(function (index, select) {
        const $select = $(this),
          name = $select.attr('name');
        if (typeof values[name] === 'undefined') {
          return;
        }
        const $option = $select.find('option[value="' + iconic_was.esc_double_quotes(values[name]) + '"]');
        if ($option.length <= 0) {
          return;
        }
        if (!$option.hasClass('enabled')) {
          return;
        }
        iconic_was.select_value($select, values[name]);
        $form.find(iconic_was.vars.swatch_class + '[data-attribute-value="' + iconic_was.esc_double_quotes(values[name]) + '"]').click();
      });
    },
    /**
     * Reset variations form
     *
     * @param obj     event
     * @param element $form
     * @param event
     * @param $form
     */
    reset_form(event, $form) {
      event.preventDefault();
      const $swatches = $form.find(iconic_was.vars.swatch_class);
      iconic_was.deselect_swatch($swatches);
      $form.find(iconic_was.vars.attribute_selects_selector).find('option').prop('selected', false).end().change().end().find(iconic_was.vars.attribute_labels_class + ' ' + iconic_was.vars.chosen_attribute_class).html(iconic_was.vars.no_selection).end().trigger('reset_data');
      iconic_was.deselect_all_swatch_groups($form);
    },
    /**
     * Get currently selected values
     *
     * @param element $form
     * @param $form
     */
    get_current_values($form) {
      const values = {},
        $selects = $form.find('select');
      if ($selects.length <= 0) {
        return false;
      }
      $selects.each(function () {
        const $select = $(this),
          name = $select.attr('name'),
          value = $select.val();
        if (!value || value === '') {
          return;
        }
        values[name] = value;
      });
      return values;
    },
    /**
     * Select a swatch.
     *
     * @param $swatch
     */
    select_swatch($swatch) {
      $swatch.addClass(iconic_was.vars.selected_class).closest('.iconic-was-swatches__item').addClass(iconic_was.vars.li_selected_class);
    },
    /**
     * Deselect a swatch.
     *
     * @param $swatch
     */
    deselect_swatch($swatch) {
      $swatch.removeClass(iconic_was.vars.selected_class).closest('.iconic-was-swatches__item').removeClass(iconic_was.vars.li_selected_class);
    },
    /**
     * Deselect a group of swatches
     *
     * @param element   $form
     * @param str       attribute
     * @param $form
     * @param attribute
     */
    deselect_swatch_group($form, attribute) {
      const $swatches = $form.find('[data-attribute="' + iconic_was.esc_double_quotes(attribute) + '"] ' + iconic_was.vars.swatch_class);
      iconic_was.deselect_swatch($swatches);
    },
    /**
     * Deselect all swatches
     *
     * @param element $form
     * @param $form
     */
    deselect_all_swatch_groups($form) {
      const $swatches = $form.find(iconic_was.vars.swatch_class);
      iconic_was.deselect_swatch($swatches);
    },
    /**
     * Trigger swatch selections on load
     */
    swatches_on_load() {
      const $selected_options = $('.variations select').find(':selected');
      if ($selected_options.length <= 0) {
        return;
      }
      $selected_options.each(function () {
        const $select = $(this).closest('select');
        if (!$select.length) {
          return;
        }
        const $form = $select.closest('form');
        if (!$form.length) {
          return;
        }
        const attribute = $select.data('attribute_name');
        const selected_values = $(this).val();
        iconic_was.change_label($select);
        if (!attribute || !selected_values) {
          return;
        }
        const $swatch = $form.find('.iconic-was-swatches[data-attribute="' + attribute + '"] a.iconic-was-swatch[data-attribute-value="' + selected_values + '"]');
        iconic_was.deselect_swatch_group($form, attribute);
        iconic_was.select_swatch($swatch);
      });
    },
    /**
     * Helper: Select value
     *
     * @param $select
     * @param value
     */
    select_value($select, value) {
      $select.val(value).change();
    },
    /**
     * Change selected label
     * @param $select
     */
    change_label($select) {
      const value = $select.val(),
        $cell = $select.closest('.value'),
        // JSON.stringify( value ) adds double quote marks around the value,
        // so no need to have them in the selector. It escapes quotes, etc.
        $swatch = $cell.find(iconic_was.vars.swatch_class + '[data-attribute-value=' + JSON.stringify(value) + ']'),
        $label_selected = $cell.prev('.label').find(iconic_was.vars.chosen_attribute_class),
        attribute_value_name = $swatch.length > 0 ? $swatch.data('attribute-value-name') : $select.find('option[value="' + iconic_was.esc_double_quotes(value) + '"]').text();
      if (value === '' || typeof attribute_value_name === 'undefined') {
        return;
      }
      $label_selected.text(attribute_value_name);
    },
    /**
     * Setup change image links
     */
    setup_change_image_links() {
      $(document.body).on('click', iconic_was.vars.change_image_links_class, function () {
        const $link = $(this),
          src = $link.attr('href'),
          srcset = $link.data('srcset'),
          sizes = $link.data('sizes'),
          $parent = $link.closest('.product'),
          $main_image = $parent.find('img:first'),
          $main_picture = $parent.find('picture source');

        // <image> elements.
        $main_image.attr('src', src).attr('srcset', srcset).attr('sizes', sizes);

        // <picture> elements.
        if ($main_picture.length > 0) {
          $main_picture.attr('srcset', srcset).attr('sizes', sizes);
        }
        return false;
      });
    },
    /**
     * Escape double quotes.
     *
     * @param string
     * @return string
     */
    esc_double_quotes(string) {
      return String(string).replace(/"/g, '\\"');
    },
    /**
     * Setup fees.
     */
    setup_fees() {
      $(document.body).on('change', 'input[name="variation_id"]', function () {
        const $field = $(this),
          variation_id = $field.val();
        if (variation_id === '') {
          return;
        }
        const $form = $field.closest('form');
        if ($form.length <= 0) {
          return;
        }
        const fee_values = iconic_was.get_selected_fee_value($form);
        if (!fee_values || fee_values.default === 0) {
          return;
        }
        const $variation_price = $form.find('.woocommerce-variation-price'),
          $prices = $variation_price.find('.amount');
        if ($prices.length <= 0) {
          return;
        }
        let $suffix = $form.find('.woocommerce-price-suffix'),
          suffix_map = $suffix.length > 0 ? iconic_was.get_suffix_map($suffix) : false,
          suffix_index = 0,
          fee = 0;
        $prices.each(function (index, price) {
          let $price = $(price),
            price_text;

          // If this is a price located in the price suffix, determine
          // if tax is inc or ex, and then select the correct fee.
          if ($price.closest('.woocommerce-price-suffix').length > 0) {
            const suffix_price_type = suffix_map[suffix_index];
            fee = fee_values[suffix_price_type];
            suffix_index++;
          } else {
            fee = fee_values.default;
          }

          // Save price to data attribute so it can be used later. So if the change
          // event is triggered twice on variation_id, we would not add the fees twice.
          if (!$price.data('was-price')) {
            price_text = $price.text();
            $price.data('was-price', price_text);
          } else {
            price_text = $price.data('was-price');
          }
          let price_value = accounting.unformat(price_text, iconic_was_vars.currency.format_decimal_sep),
            new_value = price_value + fee;
          new_value = accounting.formatMoney(new_value, {
            symbol: '',
            decimal: iconic_was_vars.currency.format_decimal_sep,
            thousand: iconic_was_vars.currency.format_thousand_sep,
            precision: iconic_was_vars.currency.format_num_decimals,
            format: ''
          });
          $price.html($price.html().toString().replace(iconic_was.get_price_match_regex(), new_value));
        });
      });
    },
    /**
     * Get regex for matching price strings.
     *
     * @return {RegExp}
     */
    get_price_match_regex() {
      const thousand_regex = iconic_was_vars.currency.format_thousand_sep ? '\\d{1,3}(' + iconic_was_vars.currency.format_thousand_sep + '\\d{3})*' : '(\\d+)';
      return new RegExp(thousand_regex + '(\\' + iconic_was_vars.currency.format_decimal_sep + '\\d+)?', 'gm');
    },
    /**
     * Determine which type of price appears in the price suffix.
     *
     * @param  $suffix
     * @return {[]}
     */
    get_suffix_map($suffix) {
      const map = [],
        suffix = iconic_was_vars.currency.price_display_suffix,
        suffix_split = suffix.split('{');
      $.each(suffix_split, function (index, string) {
        if (-1 !== string.indexOf('price_including_tax')) {
          map.push('price_including_tax');
        } else if (-1 !== string.indexOf('price_excluding_tax')) {
          map.push('price_excluding_tax');
        }
      });
      return map;
    },
    /**
     * Setup filterable groups
     */
    setup_filter_groups() {
      // check to see if items with the group data attribute exist.
      if ($(iconic_was.vars.widget_group_item).length <= 0) {
        return;
      }

      // if so, loop through.
      $(iconic_was.vars.widget_group_item).each(function () {
        if ('' === $(this).data('group')) {
          return;
        }
        let $group_list_item = false;
        const $group_name = 'iconic-was-group-' + $(this).data('group').toLowerCase().replace(' ', '-');

        // check to make sure we only add one of each group label.
        if ($('li.iconic-was-swatches__group.' + $group_name).length === 0) {
          $group_list_item = document.createElement('li');
          $group_list_item.classList = 'iconic-was-swatches__group ' + $group_name;
          const $group_list_item_text = document.createElement('div');
          $group_list_item_text.classList = 'iconic-was-swatches__group-label';
          $group_list_item_text.innerHTML = $(this).data('group');
          $group_list_item.appendChild($group_list_item_text);
        }

        // check to see if group list item isn't false and append if it is not.
        if (false !== $group_list_item) {
          // hide original li so we don't get any random spaces appearing.
          $(iconic_was.vars.widget_class).append($group_list_item);
        }
        $(this).parent().remove();
        $('li.iconic-was-swatches__group.' + $group_name).append($(this));
      });
    },
    /**
     * Get total value of selected fees.
     *
     * @param $form
     *
     * @return float
     */
    get_selected_fee_value($form) {
      const $fee_data = $form.find('.iconic-was-fees');
      if ($fee_data.length <= 0) {
        return false;
      }
      let fees_value = {
          default: 0,
          price_including_tax: 0,
          price_excluding_tax: 0
        },
        fee_data = JSON.parse($fee_data.text()),
        attributes = iconic_was.get_attributes_from_form($form);
      $.each(attributes, function (attribute, value) {
        if (typeof fee_data[attribute] === 'undefined' || typeof fee_data[attribute][value] === 'undefined') {
          return;
        }
        fees_value = {
          default: fees_value.default + fee_data[attribute][value].default,
          price_including_tax: fees_value.price_including_tax + fee_data[attribute][value].price_including_tax,
          price_excluding_tax: fees_value.price_excluding_tax + fee_data[attribute][value].price_excluding_tax
        };
      });
      return fees_value;
    },
    /**
     * Get attributes from form.
     *
     * @param  $form
     * @return {{}}
     */
    get_attributes_from_form($form) {
      const attributes = {},
        data = $form.serializeArray();
      if (data.length <= 0) {
        return attributes;
      }
      $.each(data, function (index, item) {
        if (item.value === '' || !item.name.startsWith('attribute_')) {
          return;
        }
        const name = item.name.replace('attribute_', '');
        attributes[name] = item.value;
      });
      return attributes;
    },
    /**
     * Run function only once in the certain period.
     * @param function  func      function to call
     * @param int       wait      Time interval.
     * @param bool      immediate Immediate.
     * @param func
     * @param wait
     * @param immediate
     */
    debounce(func, wait, immediate) {
      let timeout;
      return function () {
        const context = this,
          args = arguments;
        const later = function () {
          timeout = null;
          if (!immediate) {
            func.apply(context, args);
          }
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
          func.apply(context, args);
        }
      };
    }
  };
  var iconic_was_accordion = {
    /**
     * On Ready.
     */
    on_ready() {
      if ($('.iconic-was-accordion.product').length && $('.iconic-was-accordion.product').find('.iconic-was-swatches').length) {
        iconic_was_accordion.cache();
        iconic_was_accordion.setup_accordion_html();
        iconic_was_accordion.click_handler();
        //iconic_was_accordion.open_first_swatch();
      }
      const debounced_resize = iconic_was.debounce(iconic_was_accordion.reset_accordion_height, 250);
      $(window).resize(debounced_resize);
    },
    /**
     * setup cache variables.
     */
    cache() {
      iconic_was_accordion.els = {};
      iconic_was_accordion.els.$product = $('.iconic-was-accordion.product');
      iconic_was_accordion.els.$table = iconic_was_accordion.els.$product.find('table.variations');
      iconic_was_accordion.els.$trs = iconic_was_accordion.els.$table.find('>tbody>tr');
      iconic_was_accordion.els.$td_labels = iconic_was_accordion.els.$table.find('>tbody>tr>.label');
    },
    /**
     * Add markup for accordion header.
     */
    setup_accordion_html() {
      iconic_was_accordion.els.$td_labels.each(function () {
        const $label = $(this),
          $row = $label.closest('tr'),
          $variation_wrap = $row.find('.single_variation_wrap');
        if ($variation_wrap.length > 0 || $label.find('.iconic-was-accordion__handle').length > 0) {
          return;
        }
        $row.addClass('iconic-was-accordion__row');
        $label.append("<span class='iconic-was-accordion__handle'></span>");
      });
    },
    /**
     * Handle open and close of accordion.
     */
    click_handler() {
      iconic_was_accordion.els.$td_labels.click(function () {
        const $tr = $(this).parent(),
          $handle = $(this).find('.iconic-was-accordion__handle'),
          $value = $(this).siblings('.value');
        if (!$tr.hasClass('iconic-was-accordion--active')) {
          const height = iconic_was_accordion.get_hidden_elements_height($value);
          $value.show();
          $value.height(height);
          $tr.addClass('iconic-was-accordion--active');
          //we need set overflow:hidden only during the animation
          $value.css('overflow', 'hidden');
          window.setTimeout(function () {
            $value.css('overflow', 'visible');
          }, 150);
        } else {
          $tr.removeClass('iconic-was-accordion--active');
          //we need set overflow:hidden only during the animation
          $value.css('overflow', 'hidden');
          $value.height(0);
          window.setTimeout(function () {
            $value.css('overflow', 'visible');
            $value.hide();
          }, 150);
        }
      });
    },
    /**
     * Reset the accordion height.
     */
    reset_accordion_height() {
      const $active_accordions = $('.iconic-was-accordion--active');
      if ($active_accordions.length <= 0) {
        return;
      }
      $active_accordions.each(function (index, accordion) {
        let $value = $(accordion).find('td.value'),
          $children = $value.children(),
          height = 0;
        if ($children.length > 0) {
          $children.each(function (index, child) {
            const $child = $(child);
            if (!$child.is(':visible')) {
              return;
            }
            height += $(child).outerHeight(true);
          });
        }
        $value.height(height);
      });
    },
    /**
     * Returns the height of element which is hidden.
     * @param {Object} $element
     */
    get_hidden_elements_height($element) {
      $element.height('auto').addClass('test');
      const height = $element.height();
      $element.height(0);
      return height;
    },
    /**
     * Open the first item in accordion on page load.
     */
    open_first_swatch() {
      const $first_label = iconic_was_accordion.els.$trs && iconic_was_accordion.els.$trs.first() && iconic_was_accordion.els.$trs.first().find('.label');
      if ($first_label) {
        $first_label.trigger('click');
      }
    }
  };

  /**
   * Functions responsible for 'single-line' and 'slider' Overflow behaviour.
   */
  var iconic_was_adaptive = {
    /**
     * On Ready.
     */
    on_ready() {
      $('ul.iconic-was-swatches.iconic-was-swatches--loop').not('.iconic-was-swatches--stacked').each(function () {
        // Avoid race condition, by adding a slight delay.
        const $self = $(this);
        window.setTimeout(function () {
          iconic_was_adaptive.handle_adaptive_for_single_ul($self);
        }, 1);
      });
      $(document.body).on('click', '.iconic-was-swatches__item--dummy', iconic_was_adaptive.show_all_attributes);
      const debounced_resize = iconic_was.debounce(iconic_was_adaptive.on_window_resize, 250);
      $(window).resize(debounced_resize);
    },
    /**
     * On window resize.
     */
    on_window_resize() {
      $('.iconic-was-swatches').each(function () {
        const $ul = $(this);
        iconic_was_adaptive.handle_adaptive_for_single_ul($ul);
      });
    },
    /**
     * If the inner content of $ul is more then the width of inner content then it make it work
     * @param {jQuery Object} $ul .iconic-was-swatches
     */
    handle_adaptive_for_single_ul($ul) {
      const overflow_behaviour = $ul.data('overflow');
      if (!overflow_behaviour || 'stacked' === overflow_behaviour) {
        return;
      }

      // iconic-was-swatches--loading class is added by PHP to non-stacked ULs during
      // HTML generation. Need to remove this class before calculations,
      // else "white-space: nowrap" property will interfere in the calculations below.
      $ul.removeClass('iconic-was-swatches--loading');
      $ul.css('height', 'auto');
      if ('slider' === overflow_behaviour) {
        let wrapper_class = 'iconic-was-swatches--slider-wrapper',
          has_wrapper = $ul.parent('.' + wrapper_class).length > 0;
        if (!has_wrapper) {
          $ul.wrap('<div class="' + wrapper_class + '"></div>');
          has_wrapper = true;
        }
        const $row = $ul.parent(),
          row_inner_width = $row.width(),
          $ul_children = $ul.find('li'),
          $li = $ul_children.not('.iconic-was-swatches__label').first(),
          li_width = $li.outerWidth(true),
          li_margin_right = parseInt($li.css('margin-right')),
          visible_swatches = Math.floor(row_inner_width / li_width),
          number_of_swatches = $ul_children.length,
          max_width = visible_swatches * li_width - li_margin_right,
          needs_slider = number_of_swatches > visible_swatches;
        if (!needs_slider && has_wrapper) {
          $ul.unwrap();
        }
        if ($ul.hasClass('flickity-enabled')) {
          if (needs_slider) {
            const new_width = max_width > row_inner_width ? max_width : row_inner_width;
            $ul.width(new_width);
            $ul.flickity('resize');
          } else {
            $ul.flickity('destroy');
            $ul.width('');
          }
        } else if (needs_slider) {
          $ul.width(max_width);
          $ul.flickity({
            resize: false,
            percentPosition: false,
            selectedAttraction: 0.075,
            friction: 0.42,
            pageDots: false,
            cellAlign: 'left',
            groupCells: true,
            contain: true,
            rightToLeft: false,
            arrowShape: {
              x0: 20,
              x1: 55,
              y1: 35,
              x2: 60,
              y2: 30,
              x3: 30
            }
          });
        } else {
          $ul.width('');
        }
      } else {
        // Single Line.
        const ul_width = $ul.width();
        const include_margin = true;
        let total_inner_width = 0;
        let visible_items = 0;
        $ul.find('.iconic-was-swatches__item').each(function () {
          total_inner_width += $(this).outerWidth(include_margin);
          if (total_inner_width < ul_width) {
            visible_items++;
          }
        });
        iconic_was_adaptive.adapt($ul, visible_items);
      }
    },
    /**
     * Returns the total width of inner li's of $ul
     * @param {jQuery Object} $ul
     */
    get_inner_elements_total_width($ul) {
      let total_width = 0;
      const include_margin = true;
      jQuery($ul).find('>li').each(function () {
        if (jQuery(this).is(':visible')) {
          total_width += jQuery(this).outerWidth(include_margin);
        }
      });
      return total_width;
    },
    /**
     * Only show items_to_show items and hide the rest.
     *
     * @param {jQuery Object} $ul
     * @param {int}           items_to_show
     */
    adapt($ul, items_to_show) {
      const $all_items = $ul.find('>li').not('.iconic-was-swatches__item--dummy');
      $all_items.removeClass('iconic-was-swatches__item--hidden');
      const $items_to_hide = $all_items.length <= items_to_show ? false : $all_items.slice(items_to_show - 1);
      if ($items_to_hide) {
        $items_to_hide.addClass('iconic-was-swatches__item--hidden');
        $ul.find('>.iconic-was-swatches__item--dummy a').text('+' + $items_to_hide.length);
        $ul.find('>.iconic-was-swatches__item--dummy').removeClass('iconic-was-swatches__item--hidden');
        $ul.addClass('iconic-was-swatches--single-line');
      } else {
        $ul.find('>.iconic-was-swatches__item--dummy').addClass('iconic-was-swatches__item--hidden');
        $ul.removeClass('iconic-was-swatches--single-line');
      }
    },
    /**
     * Show all attributes when clicked on the '+n' button.
     * @param e
     */
    show_all_attributes(e) {
      e.preventDefault();
      const $ul = $(this).parent();
      if ($ul.hasClass('iconic-was-swatches--loop')) {
        window.location.href = $(this).find('a').attr('href');
        return;
      }
      $ul.find('.iconic-was-swatches__item--hidden').removeClass('iconic-was-swatches__item--hidden');
      $(this).addClass('iconic-was-swatches__item--hidden');
      $ul.removeClass('iconic-was-swatches--single-line');
      $ul.data('overflow', 'stacked');
      $ul.find('.iconic-was-swatches__item--dummy').hide();
      $(document).trigger('iconic_was_reset_accordion_height');
    }
  };
  var iconic_was_tooltip = {
    cache() {
      iconic_was_tooltip.cache.vars = {
        tooltip: '.iconic-was-tooltip',
        arrow: '.iconic-was-tooltip__arrow',
        anchor: '.iconic-was-swatches--tooltips .iconic-was-swatch:not(.iconic-was-swatch--dummy)'
      };
    },
    on_ready() {
      iconic_was_tooltip.cache();
      if (0 === $('.iconic-was-tooltip').length) {
        $('body').append('<div class="iconic-was-tooltip"><div class="iconic-was-tooltip__inner_wrap"></div><div class="iconic-was-tooltip__arrow"></div></div>');
        $('.iconic-was-tooltip').hide();
      }
      $(window).resize(iconic_was_tooltip.on_resize);
      const debounced_mouseenter = iconic_was.debounce(iconic_was_tooltip.handle_mouseenter, 200);
      const debounced_mouseleave = iconic_was.debounce(iconic_was_tooltip.handle_mouseleave, 200);

      // Mobile needs different handling than desktop.
      if (iconic_was_vars.is_mobile) {
        iconic_was_tooltip.mobile_click_handler();
        $(window).scroll(iconic_was_tooltip.handle_mouseleave);
        $(window).on('resize_threshold', iconic_was_tooltip.handle_mouseleave);
      } else {
        $(document.body).on('mouseenter', iconic_was_tooltip.cache.vars.anchor, debounced_mouseenter);
        $(document.body).on('mouseleave', iconic_was_tooltip.cache.vars.anchor, debounced_mouseleave);
        $(window).scroll(iconic_was_tooltip.handle_mouseleave).resize(iconic_was_tooltip.handle_mouseleave);
      }
    },
    handle_mouseenter() {
      // determine the coordinates of element and place the tooltip accordingly.
      const $a = $(this),
        text = $a.find('.iconic-was-swatch__text').html(),
        $tooltip = $(iconic_was_tooltip.cache.vars.tooltip);

      // Update the text before calculation for accuracy.
      $tooltip.find('.iconic-was-tooltip__inner_wrap').html(text);
      $tooltip.css({
        left: '',
        right: ''
      });
      let $arrow = $tooltip.find(iconic_was_tooltip.cache.vars.arrow),
        tooltip_width = $tooltip.outerWidth(true),
        rect = $a.get(0).getBoundingClientRect(),
        a_center_point_x = rect.left + rect.width / 2,
        tootltip_left = a_center_point_x - tooltip_width / 2;
      tootltip_left = tootltip_left < 0 ? 0 : tootltip_left;
      const window_width = $(window).width();

      // If we're off the right side of the screen, use right offset instead.
      if (tooltip_width + tootltip_left > window_width) {
        $tooltip.css({
          left: '',
          right: 0
        });
      } else {
        $tooltip.css({
          left: tootltip_left,
          right: ''
        });
      }
      const tooltip_height = $tooltip.outerHeight(true),
        tooltip_top = rect.top - tooltip_height;
      $tooltip.css('top', tooltip_top).show().addClass('iconic-was-tooltip--animate-opacity iconic-was-tooltip--animate-top iconic-was-tooltip--active');
      const tooltip_offset = $tooltip.offset();
      $arrow.css('left', a_center_point_x - tooltip_offset.left);
    },
    handle_mouseleave() {
      $(iconic_was_tooltip.cache.vars.tooltip).removeClass('iconic-was-tooltip--animate-top iconic-was-tooltip--animate-opacity iconic-was-tooltip--active');
    },
    /**
     * Click behaviour is slightly different for mobile.
     * We will "show" the preview on tap/click event instead of hover.
     * And "hide" the preview when clicked outside.
     */
    mobile_click_handler() {
      const swatches = document.querySelectorAll(iconic_was_tooltip.cache.vars.anchor);
      document.addEventListener('click', function (event) {
        const composedPath = event.composedPath();
        let swatch_clicked = false;

        // Determine which swatch was clicked.
        for (const swatch_idx in swatches) {
          const swatch = swatches[swatch_idx];
          if (composedPath.includes(swatch)) {
            swatch_clicked = swatch;
            break;
          }
        }
        if (!swatch_clicked) {
          // if swatch_clicked is empty then user clicked outside of a swatch
          // trigger a mouseleave event.
          iconic_was_tooltip.handle_mouseleave();
        } else {
          // Clicked on a swatch. Call handle_mouseenter and pass the swatch element
          // which was cicked as `this`.
          iconic_was_tooltip.handle_mouseenter.call(swatch_clicked);
        }
      });
    },
    /**
     * Trigger 'resize_threshold' event if the difference of screen width is more than 10px.
     */
    on_resize() {
      const old_size = iconic_was.vars.window_size;
      const new_size = $(window).width();
      const diff = old_size - new_size;
      if (Math.abs(diff) > 10) {
        iconic_was.vars.window_size = new_size;
        $(window).trigger('resize_threshold');
      }
    }
  };
  $(document).ready(iconic_was.on_ready);
  $(document).ready(iconic_was_accordion.on_ready);
  $(document).ready(iconic_was_tooltip.on_ready);
  $(document).ready(iconic_was_adaptive.on_ready);
  $(document).on('iconic_was_reset_accordion_height', iconic_was_accordion.reset_accordion_height);
})(jQuery, document);