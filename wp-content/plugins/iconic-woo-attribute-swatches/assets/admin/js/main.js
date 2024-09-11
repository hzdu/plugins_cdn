(function ($, document) {
  var iconic_was = {
    cache() {
      iconic_was.els = {};
      iconic_was.vars = {};

      // common vars
      iconic_was.vars.u_hide_class = 'iconic-was-u-hide';
      iconic_was.vars.picker_ajax_debounce = null;
      iconic_was.vars.picker_msg_debounce = null;
      iconic_was.vars.picker_container_class = '.wp-picker-container';
      iconic_was.vars.picker_ajax_msg_class = '.colour-swatch-picker-ajax__message';
      iconic_was.vars.picker_options = {
        change(event, ui) {
          // Clear messages and add the class to show the spinner.
          $(iconic_was.vars.picker_ajax_msg_class).empty();
          $(event.target).closest(iconic_was.vars.picker_container_class).siblings(iconic_was.vars.picker_ajax_msg_class).addClass('saving');

          // Update swatch meta for the term, debounced.
          clearTimeout(iconic_was.vars.picker_ajax_debounce);
          iconic_was.vars.picker_ajax_debounce = setTimeout(function () {
            iconic_was.update_swatch_colour_meta(event, ui);
          }, 1000);
        }
      };

      // common elements
      iconic_was.els.attribute_form = $('.product_page_product_attributes #attribute_label').closest('form');
      iconic_was.els.attribute_form_submit = iconic_was.els.attribute_form.find('.submit');
      iconic_was.els.product_attribute_swatch_types = $('.iconic-was-attributes__swatch-type select');
      iconic_was.els.attribute_type_field = $('select[name="attribute_type"]');
    },
    on_ready() {
      // on ready stuff here
      iconic_was.cache();
      iconic_was.setup_attribute_fields();
      iconic_was.setup_product_swatch_fields();
      iconic_was.setup_list_table_watch();
    },
    /**
     * Dynamically insert the attribute fields
     */
    setup_attribute_fields() {
      iconic_was.get_attribute_fields(function (fields) {
        const fields_formatted = iconic_was.format_attribute_fields(fields);
        iconic_was.els.attribute_form_submit.before(fields_formatted);
        $('[data-conditional]').iconicConditional();
      });
      iconic_was.els.attribute_type_field.on('change', function () {
        const attribute_type = $(this).val(),
          $attribute_fields = $('.iconic-was-attribute-fields');
        if (attribute_type === 'select') {
          $attribute_fields.removeClass(iconic_was.vars.u_hide_class);
        } else {
          $attribute_fields.addClass(iconic_was.vars.u_hide_class);
        }
      });
      iconic_was.setup_colour_pickers();
      iconic_was.setup_image_swatch_fields();
    },
    /**
     * Setup colour picker fields
     */
    setup_colour_pickers() {
      // Standard version.
      $('.colour-swatch-picker').wpColorPicker();

      // Ajax version on the product attribute terms screen.
      $('.colour-swatch-picker-ajax').each(function (i) {
        $(this).wpColorPicker(iconic_was.vars.picker_options);
      });

      // Modify the colour picker button labels to make them shorter.
      $('.wp-color-result-text').text(iconic_was_vars.i18n.select_colour);
    },
    /**
     * Update swatch colour meta via AJAX
     * @param event
     * @param ui
     */
    update_swatch_colour_meta(event, ui) {
      // Attempt to save the term meta.
      $.ajax({
        type: 'POST',
        url: iconic_was_vars.ajax_url,
        cache: false,
        dataType: 'json',
        crossDomain: true,
        data: {
          action: 'iconic_was_update_colour_swatch_meta',
          term_id: event.target.name.split('__')[1],
          value: event.target.value,
          nonce: iconic_was_vars.ajax_nonce
        },
        success(response) {
          iconic_was.update_swatch_colour_msg(response.success ? 'success' : 'error', event.target);
        },
        error(response) {
          iconic_was.update_swatch_colour_msg('error', event.target);
        }
      });
    },
    /**
     * Update the user with a success/error message.
     * @param result
     * @param target
     */
    update_swatch_colour_msg(result, target) {
      const success_msg = '<span class="dashicons dashicons-yes-alt"></span> Updated!',
        error_msg = '<span class="dashicons dashicons-dismiss"></span> Failed!',
        msg_text = 'success' === result ? success_msg : error_msg,
        success_hex = '#46B450',
        error_hex = '#DC3232',
        msg_colour = 'success' === result ? success_hex : error_hex,
        $msg_container = $(target).closest(iconic_was.vars.picker_container_class).siblings(iconic_was.vars.picker_ajax_msg_class);

      // Remove the spinner and add the message.
      $msg_container.removeClass('saving');
      $msg_container.css('color', msg_colour).html(msg_text);

      // If there was an error, trigger a click
      // on the "Default" button.
      if ('error' === result) {
        clearTimeout(iconic_was.vars.picker_msg_debounce);
        setTimeout(function () {
          $(target).parent().siblings('.wp-picker-default').trigger('click');
        }, 1000);
        return;
      }

      // Remove the message after a short period of time.
      clearTimeout(iconic_was.vars.picker_msg_debounce);
      iconic_was.vars.picker_msg_debounce = setTimeout(function () {
        $msg_container.html('').css('color', '');
      }, 3000);
    },
    /**
     * Setup image swatch fields
     */
    setup_image_swatch_fields() {
      // Uploading files
      let file_frame;
      $('.iconic-was-image-picker__upload').on('click', function (event) {
        event.preventDefault();
        const $image_swatch_upload = $(this),
          $image_swatch_wrapper = $image_swatch_upload.closest('.iconic-was-image-picker'),
          $image_swatch_field = $image_swatch_wrapper.find('.iconic-was-image-picker__field'),
          $image_swatch_preview = $image_swatch_wrapper.find('.iconic-was-image-picker__preview'),
          $image_swatch_remove = $image_swatch_wrapper.find('.iconic-was-image-picker__remove');

        // Create the media frame.
        file_frame = wp.media.frames.file_frame = wp.media({
          title: $(this).data('title'),
          button: {
            text: $(this).data('button-text')
          },
          multiple: false // Set to true to allow multiple files to be selected
        });

        // When an image is selected, run a callback.
        file_frame.on('select', function () {
          // We set multiple to false so only get one image from the uploader
          attachment = file_frame.state().get('selection').first().toJSON();
          attachment_url = typeof attachment.sizes.thumbnail !== 'undefined' ? attachment.sizes.thumbnail.url : attachment.url;
          $image_swatch_field.val(attachment.id);
          $image_swatch_preview.html('<img src="' + attachment_url + '" class="attachment-thumbnail size-thumbnail">');
          $image_swatch_upload.addClass('iconic-was-image-picker__upload--edit');
          $image_swatch_remove.show();
        });

        // Finally, open the modal
        file_frame.open();
      });
      $('.iconic-was-image-picker__remove').on('click', function (event) {
        event.preventDefault();
        const $image_swatch_wrapper = $(this).closest('.iconic-was-image-picker'),
          $image_swatch_field = $image_swatch_wrapper.find('.iconic-was-image-picker__field'),
          $image_swatch_preview = $image_swatch_wrapper.find('.iconic-was-image-picker__preview'),
          $image_swatch_upload = $image_swatch_wrapper.find('.iconic-was-image-picker__upload');
        $image_swatch_field.val('');
        $image_swatch_preview.html('');
        $image_swatch_upload.removeClass('iconic-was-image-picker__upload--edit');
        $(this).hide();
      });
    },
    /**
     * Helper: Get admin page
     */
    get_admin_page() {
      if (iconic_was.els.attribute_form.length <= 0) {
        return false;
      }
      if (iconic_was.els.attribute_form.find('table').length > 0) {
        return 'update';
      }
      return 'add';
    },
    /**
     * Helper: Get attribute fields
     *
     * @param func     callback
     * @param callback
     */
    get_attribute_fields(callback) {
      const fields = false,
        attribute_id = typeof iconic_was_vars.url_params.edit !== 'undefined' ? iconic_was_vars.url_params.edit : false,
        data = {
          action: 'iconic_was_get_attribute_fields',
          attribute_id
        };

      // since 2.8 ajaxurl is always defined in the admin header and points to admin-ajax.php
      $.post(ajaxurl, data, function (response) {
        if (response.success !== true) {
          return false;
        }
        if (callback && typeof callback === 'function') {
          callback(response.fields);
        }
      });
    },
    /**
     * Helper: Format attribute fields
     *
     * @param obj    fields
     * @param fields
     */
    format_attribute_fields(fields) {
      let formatted_fields = '',
        attribute_type = iconic_was.els.attribute_type_field.val(),
        hidden_class = attribute_type === 'text' ? iconic_was.vars.u_hide_class : '';
      if (iconic_was.get_admin_page() === 'update') {
        const $table = $('<table />'),
          $tbody = $('<tbody />');
        $table.attr('class', 'form-table iconic-was-attribute-fields ' + hidden_class);
        $.each(fields, function (field_id, field_data) {
          const condition = field_data.condition ? $.isArray(field_data.condition) ? JSON.stringify(field_data.condition) : field_data.condition : false,
            match = JSON.stringify(field_data.match),
            $row = $('<tr />'),
            $row_th = $('<th scope="row" valign="top" />'),
            $row_td = $('<td />');
          $row.attr('class', 'iconic-was-attribute-row form-field ' + field_data.class.join(' '));
          if (condition) {
            $row.attr('data-condition', condition);
            $row.attr('data-match', match);
          }
          $row_th.append('<label for="' + field_id + '">' + field_data.label + '</label>');
          $row_td.append(field_data.field + '<p class="description">' + field_data.description + '</p>');
          $row.append($row_th, $row_td);
          $tbody.append($row);
        });
        formatted_fields = $table.append($tbody);
      } else {
        const $div = $('<div />');
        $div.attr('class', 'iconic-was-attribute-fields ' + hidden_class);
        $.each(fields, function (field_id, field_data) {
          const condition = field_data.condition ? $.isArray(field_data.condition) ? JSON.stringify(field_data.condition) : field_data.condition : false,
            match = JSON.stringify(field_data.match),
            $inner_div = $('<div />');
          $inner_div.attr('class', 'iconic-was-attribute-row form-field ' + field_data.class.join(' '));
          if (condition) {
            $inner_div.attr('data-condition', condition);
            $inner_div.attr('data-match', match);
          }
          $inner_div.append('<label for="' + field_id + '">' + field_data.label + '</label>');
          $inner_div.append(field_data.field + '<p class="description">' + field_data.description + '</p>');
          $div.append($inner_div);
        });
        formatted_fields = $div;
      }
      return formatted_fields;
    },
    /**
     * Escape
     *
     * @param str    string
     * @param string
     */
    escape(string) {
      return string.replace(/[\\]/g, '\\\\').replace(/[\"]/g, '&quot;').replace(/[\/]/g, '\\/').replace(/[\b]/g, '\\b').replace(/[\f]/g, '\\f').replace(/[\n]/g, '\\n').replace(/[\r]/g, '\\r').replace(/[\t]/g, '\\t');
    },
    /**
     * Setup the swatch fields for products
     */
    setup_product_swatch_fields() {
      iconic_was.els.product_attribute_swatch_types.on('change', function () {
        const $select = $(this),
          swatch_type = $select.val(),
          swatch_type_text = $select.find(':selected').text(),
          $attribute_wrapper = $select.closest('.iconic-was-attribute-wrapper'),
          $swatch_type = $attribute_wrapper.find('.iconic-was-swatch-type'),
          $swatch_options = $attribute_wrapper.find('.iconic-was-attributes__swatch-options td'),
          product_id = parseInt($attribute_wrapper.data('product-id')),
          attribute_slug = $attribute_wrapper.data('taxonomy'),
          $wc_metabox_content = $attribute_wrapper.find('.wc-metabox-content');
        $swatch_type.text(swatch_type_text.replace('Swatch', '').trim());
        $swatch_options.html('');
        iconic_was.reset_height($wc_metabox_content);
        if (iconic_was.is_swatch_visual(swatch_type)) {
          const data = {
            action: 'iconic_was_get_product_attribute_fields',
            swatch_type,
            product_id,
            attribute_slug
          };
          $.post(ajaxurl, data, function (response) {
            if (response.success !== true) {
              return false;
            }
            if (response.fields === false) {
              return false;
            }
            $swatch_options.html(response.fields);
            iconic_was.setup_image_swatch_fields();
            iconic_was.setup_colour_pickers();
            iconic_was.reset_height($wc_metabox_content);
          });
        }
      });
    },
    /**
     * Helper: Is swatch type visual
     *
     * @param str         swatch_type
     * @param swatch_type
     */
    is_swatch_visual(swatch_type) {
      return swatch_type === 'colour-swatch' || swatch_type === 'image-swatch';
    },
    /**
     * Reset height of element
     *
     * @param obj $el
     * @param $el
     */
    reset_height($el) {
      $el.height('');
    },
    /**
     * MutationObserver callback that fires
     * when the product attributes list table
     * watcher detects a change in the DOM.
     *
     * @param array        mutationList
     * @param object       observer
     * @param mutationList
     * @param observer
     */
    list_table_watch(mutationList, observer) {
      mutationList.forEach(function (mutation) {
        switch (mutation.type) {
          case 'childList':
            // only proceed if we have at least one added node.
            if (mutation.addedNodes.length) {
              const the_node = mutation.addedNodes[0],
                $the_node = $(the_node),
                term_id = the_node.id.replace('tag-', ''),
                term_slug = $the_node.find('.column-slug').text(),
                term_colour = $('#colour-swatch').val(),
                term_tax = $('input[name="taxonomy"]').val(),
                column_text = $('th#iconic-was-swatch').text(),
                group_name = $('#iconic-was-group-field').val();
              if (!term_id || !term_slug || !term_tax) {
                return;
              }

              // Introducing another AJAX call just to return this
              // markup seems like overkill. It's unlikely the markup
              // in class swatches->get_swatch_html is going to change
              // very often after release.
              const new_td = `
							<td class="iconic-was-swatch column-iconic-was-swatch" data-colname="${column_text}">
								<input id="colour-swatch_${term_slug}" type="text" name="${term_tax}__${term_id}" value="${term_colour}" class="colour-swatch-picker-ajax" data-default-color="${term_colour}">
								<div id="colour-swatch_${term_slug}" class="colour-swatch-picker-ajax__message"></div>
							</td>`;

              // Add the new table cells into the recently added row.
              $the_node.find('.column-primary').after(new_td);

              // Only add the group column if we already have a group column in the table.
              if (group_name && document.querySelectorAll('.iconic-was-group')) {
                $the_node.find('.column-posts').after(`<td class="iconic-was-group column-iconic-was-group" data-colname="Group">${group_name}</td>`);
              }

              // Init colour picker on the new element.
              $the_node.find('.colour-swatch-picker-ajax').wpColorPicker(iconic_was.vars.picker_options);
              $the_node.find('.wp-color-result-text').text(iconic_was_vars.i18n.select_colour);
            }
            break;
        }
      });
    },
    /**
     * Setup a MutationObserver to watch for
     * changes to the product attributes list
     * table element.
     *
     * This is being used because WP core tags
     * JS does not trigger any events that we
     * can listen for, so we have to sniff for
     * changes in the DOM instead.
     */
    setup_list_table_watch() {
      const targetNode = document.querySelector('.edit-tags-php.post-type-product #posts-filter');
      if (!targetNode) {
        return;
      }
      const observer = new MutationObserver(iconic_was.list_table_watch);
      observer.observe(targetNode, {
        childList: true,
        attributes: false,
        subtree: true
      });
    }
  };
  $(document).ready(iconic_was.on_ready());
})(jQuery, document);