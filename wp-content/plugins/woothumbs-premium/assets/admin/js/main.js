/**
 * WooThumbs - Attribute Images Scripts
 * @param $
 * @param document
 */
(function ($, document) {
  let ai_attributes_cache = {},
    ai_search_field_change_timer,
    ai_post_id = $('#post_ID').val(),
    // Elements.
    $ai_options = $('#iconic-woothumbs_ai_options'),
    $ai_action_select = $('#iconic-woothumbs-ai-action-select'),
    $ai_specific_attributes_section = $('#iconic-woothumbs-ai__section--specific'),
    $ai_all_attributes_section = $('#iconic-woothumbs-ai__section--all'),
    $ai_default_state_notice = $('.iconic-woothumbs-ai__default-state-notice'),
    // Classes.
    ai_row_class = '.iconic-woothumbs-ai__row',
    ai_row_content_class = '.iconic-woothumbs-ai__row-content',
    ai_add_row_class = '.iconic-woothumbs-ai__add-row',
    ai_section_content_class = '.iconic-woothumbs-ai__section-content',
    ai_select_field_class = '.iconic-woothumbs-ai__select',
    ai_search_field_class = '.iconic-woothumbs-ai__search-field',
    ai_image_ids_field_class = '.iconic-woothumbs-ai__image-ids',
    ai_data_loaded_class = 'ai-data-loaded',
    // Templates.
    ai_all_images_tpl = `<h2 class="iconic-woothumbs-ai__section-title" data-attribute-name="{{attribute_name}}" data-attribute-label="{{attribute_label}} Terms" data-is-new="{{is_new}}"><span>${iconic_woothumbs_vars.text.attribute_all_attributes}<span></h2>
							<div class="${ai_section_content_class.replace('.', '')}" data-attribute-name="{{attribute_name}}">
								<div class="${ai_row_class.replace('.', '')} closed" data-attribute-name="{{attribute_name}}">
									<h3><div class="${ai_row_class.replace('.', '')}-toggle" aria-label="${iconic_woothumbs_vars.text.click_to_toggle}"></div><div class="iconic-woothumbs-ai__all-row-title">${iconic_woothumbs_vars.text.all_terms}</div><div class="iconic-woothumbs-ai__image-count"></div><a href="#" class="iconic-woothumbs-ai__remove-row">${iconic_woothumbs_vars.text.remove}</a></h3>
										<div class="${ai_row_class.replace('.', '')}-content" style="display: none;">
											<ul class="iconic-woothumbs-ai__images">{{images}}</ul>
											<input type="hidden" class="${ai_image_ids_field_class.replace('.', '')}" name="all" value=""/>
											<button id="iconic-woothumbs-ai__add-all" type="button" class="manage_woothumbs_ai button-secondary iconic-woothumbs-ai__add-all">
												${iconic_woothumbs_vars.text.add_images}
											</button>
										</div>
									</div>
								</div>`,
    ai_container_tpl = `<h2 class="iconic-woothumbs-ai__section-title" data-attribute-name="{{attribute_name}}" data-attribute-label="{{attribute_label}}"><span>${iconic_woothumbs_vars.text.attribute} {{attribute_label}}</span> <a href="#" class="${ai_add_row_class.replace('.', '')} button">${iconic_woothumbs_vars.text.add} {{attribute_label}}</a></h2>
							<div data-attribute-name="{{attribute_name}}" data-term-count="" class="${ai_section_content_class.replace('.', '')}"></div>
							<div class="clear"></div>`,
    ai_row_tpl = `<div data-attribute-name="{{attribute_name}}" data-term-id="{{term_id}}" data-is-new="{{is_new}}" class="${ai_row_class.replace('.', '')} closed">
						<h3>
							<div class="${ai_row_class.replace('.', '')}-toggle" aria-label="${iconic_woothumbs_vars.text.click_to_toggle}"></div>
							<select class="${ai_select_field_class.replace('.', '')}" data-attribute="{{attribute_name}}">
								<option value="">${iconic_woothumbs_vars.text.select} {{attribute_label}}...</option>
								{{options}}
							</select><div class="iconic-woothumbs-ai__image-count"></div>
							<a href="#" class="iconic-woothumbs-ai__remove-row">${iconic_woothumbs_vars.text.remove}</a>
						</h3>

						<div class="${ai_row_class.replace('.', '')}-content" style="display: none;">
							<ul class="iconic-woothumbs-ai__images">{{images}}</ul>

							<input type="hidden" class="${ai_image_ids_field_class.replace('.', '')}" name="{{attribute_name}}__{{term_id}}" data-attribute-label="{{attribute_label}}" value=""/>

							<button {{disabled}} id="iconic-woothumbs-ai__add-specific" type="button" class="manage_woothumbs_ai button-secondary iconic-woothumbs-ai__add-specific">
								${iconic_woothumbs_vars.text.add_images}
							</button>
						</div>
					</div>`,
    ai_image_tpl = `<li class="iconic-woothumbs-ai__image-item" data-attachment-id="{{attachment_id}}" data-attachment-url="{{attachment_url}}">
							<a href="#" class="iconic-woothumbs-ai__remove-image" aria-label="${iconic_woothumbs_vars.text.remove_image}" title="${iconic_woothumbs_vars.text.remove_image}"><img class="iconic-woothumbs-ai__image" src="{{attachment_url}}"/></a>
						</li>`;

  /**
   * Insert the markup for the all images section,
   * if it's not already present, and disable the
   * select option.
   *
   * @see handler_ai_action_button
   * @param image_data
   */
  function add_ai_section_all(image_data = false) {
    let section_exists = $ai_all_attributes_section.find(ai_section_content_class).length > 0,
      images_html = '',
      is_new = image_data ? 'no' : 'yes';

    // Take no action if this section is already in the DOM.
    if (section_exists) {
      return;
    }

    // Get the HTML markup for the supplied images;
    // the context here is that we're loading this
    // section with existing data.
    if (image_data && image_data.terms.length) {
      if (image_data.terms[0].images && image_data.terms[0].images.length) {
        images_html = prepare_images_html('all', image_data.terms[0].images);
      } else {
        return;
      }
    }

    // Insert the image markup into the DOM.
    $ai_all_attributes_section.html(ai_all_images_tpl.replace(/{{is_new}}/g, is_new).replace(/{{images}}/g, images_html).replace(/{{attribute_name}}/g, 'all').replace(/{{attribute_label}}/g, 'All'));

    // Update the hidden input value.
    update_ai_gallery_state($ai_all_attributes_section.find(ai_row_class), false);

    // Open the row.
    if (!image_data) {
      $ai_all_attributes_section.find(ai_row_class).trigger('click');
    }

    // Show the changes toolbar.
    toggle_toolbars_visibility();

    // Prevent this section from being added again from the action dropdown.
    $ai_action_select.find('option[value="all"]').attr('disabled', true);
  }

  /**
   * Add a section for a specific attribute.
   *
   * @see handler_ai_action_button
   * @param attribute_name
   * @param attribute_label
   * @param term_data
   */
  function add_ai_section_specific(attribute_name, attribute_label, term_data = false) {
    let attribute_section_selector = `${ai_section_content_class}[data-attribute-name="${attribute_name}"]`,
      $attribute_section = $ai_specific_attributes_section.find(attribute_section_selector),
      row_term_data = term_data.length > 0 ? term_data : false;

    // If we do not have the container for this specific attribute, add it.
    if (!$attribute_section.length) {
      $ai_specific_attributes_section.append(ai_container_tpl.replace(/{{attribute_name}}/g, attribute_name).replace(/{{attribute_label}}/g, attribute_label));
    }

    // Cache this again.
    $attribute_section = $ai_specific_attributes_section.find(attribute_section_selector);

    // Prevent this section from being added again from the action dropdown.
    $ai_action_select.find(`option[value="${attribute_name}]"`).attr('disabled', true);

    // Check the attributes cache first before fetching
    // attribute terms for the select dropdown via AJAX,
    // and then inserting the row.
    //
    // If row_term_data contains the term data, then the
    // row will be built using that data, otherwise, it
    // will just be an empty row.
    if (ai_attributes_cache.hasOwnProperty(attribute_name)) {
      $attribute_section.attr('data-term-count', ai_attributes_cache[attribute_name].length);
      add_ai_attribute_rows(attribute_name, attribute_label, ai_attributes_cache[attribute_name], row_term_data);
    } else {
      $.ajax({
        url: iconic_woothumbs_vars.ajaxurl,
        data: {
          action: 'admin_get_attribute_terms',
          nonce: iconic_woothumbs_vars.nonce,
          attribute_name,
          product_id: ai_post_id
        }
      }).done(function (response) {
        if (response.success) {
          const response_data = response.data.replace('&amp;', '&');
          const select_term_data = JSON.parse(response_data);
          ai_attributes_cache[attribute_name] = select_term_data;
          $attribute_section.attr('data-term-count', ai_attributes_cache[attribute_name].length);
          add_ai_attribute_rows(attribute_name, attribute_label, select_term_data, row_term_data);
        }
      });
    }
  }

  /**
   * Insert an images row for a specific attribute.
   *
   * @see add_ai_section_specific
   * @param attribute_name
   * @param attribute_label
   * @param select_term_data
   * @param term_meta_data
   */
  function add_ai_attribute_rows(attribute_name, attribute_label, select_term_data, term_meta_data = false) {
    let $attribute_container = $ai_specific_attributes_section.find(`${ai_section_content_class}[data-attribute-name="${attribute_name}"]`),
      tpl = ai_row_tpl.replace(/{{attribute_name}}/g, attribute_name).replace(/{{attribute_label}}/g, attribute_label),
      options_html = '',
      images_html = '';
    $ai_default_state_notice.hide();
    if (term_meta_data) {
      // Prepare and insert a populated row.
      term_meta_data.forEach(function (data) {
        if (data && data.images && data.images.length) {
          images_html = prepare_images_html('specific', data);
          options_html = prepare_select_options(select_term_data, data.term);
          $attribute_container.prepend(tpl.replace(/{{is_new}}/g, 'no').replace(/{{term_id}}/g, data.term).replace(/{{options}}/g, options_html).replace(/{{images}}/g, images_html).replace(/{{disabled}}/g, ''));
          // Update the hidden input value.
          $term_containers = $attribute_container.find('[data-term-id]');
          $term_containers.each(function (i) {
            if ($(this).attr('data-term-id') === data.term) {
              update_ai_gallery_state($(this), false);
            }
          });
        }
      });
    } else {
      // Prepare and insert an empty row.
      options_html = prepare_select_options(select_term_data);
      $attribute_container.prepend(tpl.replace(/{{is_new}}/g, 'yes').replace(/{{term_id}}/g, 'Any').replace(/{{options}}/g, options_html).replace(/{{images}}/g, images_html).replace(/{{disabled}}/g, 'disabled'));
      // Update the hidden input value.
      update_ai_gallery_state($attribute_container.find(ai_row_class).first(), false);
    }

    // Trigger event on the selects for post-added actions.
    $attribute_container.find(ai_select_field_class).first().trigger('ai_rows_added', [attribute_name, attribute_label]);
  }

  /**
   * Prepare select options markup.
   *
   * @see add_ai_attribute_rows
   * @param select_term_data
   * @param current_term
   */
  function prepare_select_options(select_term_data, current_term) {
    let options_html = '';
    for (const key in select_term_data) {
      if (Object.hasOwnProperty.call(select_term_data, key)) {
        const selected = current_term && select_term_data[key] == current_term ? 'selected' : '';
        options_html += `<option ${selected} value="${select_term_data[key]}">${select_term_data[key]}</option>`;
      }
    }
    return options_html;
  }

  /**
   * Prepare attribute images markup.
   *
   * @see add_ai_section_all
   * @see add_ai_section_specific
   * @param section
   * @param data
   */
  function prepare_images_html(section, data) {
    let html = '',
      images = 'all' === section ? data : data.images;
    for (const img_data of images) {
      html += ai_image_tpl.replace(/{{attachment_id}}/g, img_data.id).replace(/{{attachment_url}}/g, img_data.url);
    }
    return html;
  }

  /**
   * Update the selected attribute images.
   *
   * @see handler_remove_ai_image
   * @see add_ai_section_all
   * @see add_ai_attribute_rows
   * @param $row
   * @param process_change
   */
  function update_ai_gallery_state($row, process_change = true) {
    const $selected_images = [],
      $gallery_field = $row.find(ai_image_ids_field_class);

    // Build up an object of image data.
    $row.find('.iconic-woothumbs-ai__image-item').each(function () {
      $selected_images.push({
        id: $(this).attr('data-attachment-id'),
        url: $(this).attr('data-attachment-url')
      });
    });

    // Update the hidden input field value with the image data.
    const $selected_images_json = $selected_images.length ? JSON.stringify($selected_images) : '';
    $gallery_field.val($selected_images_json);

    // Update the image count label.
    const $image_count_text = $selected_images.length === 1 ? `${$selected_images.length} Image` : `${$selected_images.length} Images`;
    $row.find('.iconic-woothumbs-ai__image-count').text($image_count_text);
    if (process_change) {
      process_ai_input_change($gallery_field);
    }
  }

  /**
   * Take action on input change.
   *
   * @see update_ai_gallery_state
   * @see handler_manage_ai_gallery
   * @param $input
   */
  function process_ai_input_change($input) {
    toggle_changes_buttons_state(false);
  }

  /**
   * Insert attribute images tab data.
   *
   * @see handler_load_ai_tab_data
   * @see handler_reset_ai_tab_data
   */
  function insert_ai_tab_content() {
    const ai_data = JSON.parse($ai_options.attr('data-ai-data'));
    if (Object.keys(ai_data).length) {
      $ai_default_state_notice.hide();
      for (const key in ai_data) {
        if (ai_data.hasOwnProperty(key)) {
          if ('all' === key) {
            add_ai_section_all(ai_data[key]);
          } else {
            add_ai_section_specific(key, ai_data[key].label, ai_data[key].terms);
          }
        }
      }
    } else {
      $ai_default_state_notice.show();
    }
    setTimeout(function () {
      $ai_options.addClass(ai_data_loaded_class);
      $ai_options.trigger('ai_data_loaded');
    }, 500);
  }

  /**
   * Update the name attribute of a hidden input field.
   *
   * @see handler_row_select_change
   * @see handler_row_added
   * @param event
   */
  function update_row_data(event) {
    const $select = $(event.target),
      $parent_row = $select.closest(ai_row_class),
      $hidden_input = $parent_row.find(ai_image_ids_field_class);
    if ($parent_row.attr('data-is-new') === 'yes') {
      $parent_row.attr('data-is-new', 'no');
    }

    // Only update if we have a valid selection; excludes brand new rows.
    if ($select.val() && $parent_row.attr('data-is-new') !== 'yes') {
      $parent_row.attr('data-term-id', $select.val());
      $hidden_input.attr('name', $select.attr('data-attribute') + '__' + $select.val());
      return true;
    }
    return false;
  }

  /**
   * Disable attribute row select options
   * to prevent duplicates.
   *
   * @see handler_row_select_change
   * @see handler_row_added
   * @param event
   * @param $selects
   */
  function disable_select_options(event) {
    const $attribute_container = $(event.target).closest(ai_section_content_class),
      $section_selects = $attribute_container.find('select'),
      selected = [];

    // Build up a collection of the currently selected select field values.
    $section_selects.each(function (index, element) {
      const value = $(element).find('option:selected').val();
      if (value && !selected.includes(value)) {
        selected.push(value);
      }
    });

    // Maybe disble select field values for the other select fields
    // in this section, to ensure that duplicates cannot be selected.
    $section_selects.each(function (index, element) {
      const $options = $(element).children('option');
      $options.each(function (index, element) {
        $(element).attr('disabled', false);
        if (selected.includes($(element).val()) && !$(element).is(':selected')) {
          $(element).attr('disabled', true);
        }
      });
    });

    // Re-init to force update the select2 data.
    init_selectWoo(event);
  }

  /**
   * Toggle the state of the save & cancel buttons.
   *
   * @param state
   * @see handler_row_select_change
   * @see handler_remove_ai_row
   * @see handler_save_ai_field_data
   * @see handler_reset_ai_tab_data
   * @see process_ai_input_change
   */
  function toggle_changes_buttons_state(state) {
    if (!$ai_options.hasClass(ai_data_loaded_class)) {
      return;
    }
    $('#save-attribute-images, #cancel-attribute-images').prop('disabled', state);
  }

  /**
   * Toggle the visibility of the expand/close links.
   *
   * @see handler_row_added
   * @see handler_remove_ai_row
   */
  function toggle_expand_close_links() {
    const $all_rows = $ai_options.find(ai_row_class),
      pagenav_class = '.iconic-woothumbs-ai__pagenav';
    if ($all_rows.length > 1) {
      $ai_options.find(pagenav_class).show();
    } else {
      $ai_options.find(pagenav_class).hide();
    }
  }

  /**
   * Get data from the attribute images fields.
   *
   * @see handler_save_ai_field_data
   */
  function get_ai_field_data() {
    const data = {},
      $inputs = $(ai_image_ids_field_class);

    // Build our data object using all of the current rows and their data.
    $inputs.each(function (index, element) {
      const el_name = $(element).attr('name'),
        el_value = $(element).val() ? JSON.parse($(element).val()) : false,
        el_label = $(element).attr('data-attribute-label'),
        attr_data = el_name.includes('__') ? el_name.split('__') : 'all',
        attr_name = attr_data === 'all' ? 'all' : attr_data[0];
      if (!data.hasOwnProperty(attr_name)) {
        data[attr_name] = {
          label: el_label,
          terms: []
        };
      }
      if (el_value) {
        if (attr_name === 'all') {
          data[attr_name].terms.push({
            term: 'all',
            images: el_value
          });
        } else {
          data[attr_name].terms.push({
            term: attr_data[1],
            images: el_value
          });
        }
      }

      // Don't save any data for a given attribute if it has no term data.
      if (!data[attr_name].terms.length) {
        delete data[attr_name];
      }
    });
    return data;
  }

  /**
   * Filter attribute rows based on search query
   *
   * @see handler_search_field_change
   * @param event
   */
  function filter_attribute_rows(event) {
    const $rows = $(`.iconic-woothumbs-ai__section--specific ${ai_row_class}`);
    search_query = $(event.target).val().toLowerCase();
    if (!$rows.length) {
      return;
    }
    block_ai_ui();
    if (!search_query) {
      // Show all rows if the query is empty.
      $rows.show();
    } else {
      // Filters based on the search query.
      $rows.each(function (index, element) {
        const $row = $(element),
          term_id = $row.attr('data-term-id').toLowerCase();
        if (!term_id.includes(search_query)) {
          $row.hide();
        } else {
          $row.show();
        }
      });
    }
    unblock_ai_ui();
  }

  /**
   * Toogle visibility of the search and changes toolbars.
   *
   * @see add_ai_attribute_rows
   * @see handler_ai_data_loaded
   */
  function toggle_toolbars_visibility() {
    const $search_container = $('#iconic-woothumbs-ai-search-container'),
      $toolbar_changes = $('#iconic-woothumbs-ai-toolbar-changes');
    if ($(ai_row_class).length) {
      $search_container.show();
      $toolbar_changes.show();
    } else {
      $search_container.hide();
      $toolbar_changes.hide();
    }
  }

  /**
   * Toggle visibility of the add new row buttons.
   *
   * @param event
   * @see handler_load_ai_tab_data
   * @see handler_ai_data_loaded
   */
  function toggle_add_row_visibility(event) {
    const $attribute_container = $(event.target).closest(ai_section_content_class);
    row_count = $attribute_container.find(ai_row_class).length, term_count = $attribute_container.attr('data-term-count');
    if (row_count === parseInt(term_count)) {
      $attribute_container.prev().find(ai_add_row_class).hide();
    } else {
      $attribute_container.prev().find(ai_add_row_class).show();
    }
  }

  /**
   * Block the AI tab UI.
   *
   * @see handler_load_ai_tab_data
   */
  function block_ai_ui() {
    $($ai_options).block({
      message: null,
      overlayCSS: {
        background: '#fff',
        opacity: 0.6
      }
    });
  }

  /**
   * Unblock the AI tab UI.
   *
   * @see handler_ai_data_loaded
   * @see handler_reset_ai_tab_data
   * @see filter_attribute_rows
   */
  function unblock_ai_ui() {
    $($ai_options).unblock();
  }

  /**
   * Initialize selectWoo and event handlers.
   *
   * @param event
   * @see handler_row_added
   */
  function init_selectWoo(event) {
    const $attribute_container = $(event.target).closest(ai_section_content_class),
      attribute_label = $attribute_container.prev().attr('data-attribute-label'),
      $selects = $attribute_container.find(ai_select_field_class);
    $selects.selectWoo({
      width: '200px',
      dropdownCssClass: 'iconic-woothumbs-ai__select2-search-field',
      minimumResultsForSearch: 5,
      placeholder: `${iconic_woothumbs_vars.text.select} ${attribute_label}...`
    })
    // Set the placeholder for the selectWoo input field.
    .on('select2:open', function (e) {
      $('.select2-search__field').attr('placeholder', `${iconic_woothumbs_vars.text.filter} ${attribute_label} ${iconic_woothumbs_vars.text.terms}`);
    });
  }

  /**
   * Callback to fire when saving done.
   *
   * Exact copy of the function in meta-boxes-product-variation.js in WC core.
   */
  function save_ai_on_submit_done() {
    const post_form = $('form#post'),
      caller_id = post_form.data('callerid');
    if ('publish' === caller_id) {
      post_form.append('<input type="hidden" name="publish" value="1" />').trigger('submit');
    } else {
      post_form.append('<input type="hidden" name="save-post" value="1" />').trigger('submit');
    }
  }

  /**
   * Add the handler to manage the images
   * via the wp.media interface.
   *
   * @see setup_attribute_images
   * @param event
   */
  function handler_manage_ai_gallery(event) {
    let attribute_images_frame,
      $woothumbs_ai_images = $(this).siblings('.iconic-woothumbs-ai__images'),
      $image_gallery_ids = $(this).siblings(ai_image_ids_field_class),
      attachment_data = $image_gallery_ids.val() ? JSON.parse($image_gallery_ids.val()) : [],
      $selected_option = $(this).closest(ai_row_class).find(`${ai_select_field_class} option:selected`),
      label = iconic_woothumbs_vars.text.all_terms;
    if ($selected_option.length) {
      label = $selected_option.text();
    }
    event.preventDefault();
    attribute_images_frame = wp.media.frames.downloadable_file = wp.media({
      title: `${iconic_woothumbs_vars.text.manage_images_for} ${label}`,
      button: {
        text: `${iconic_woothumbs_vars.text.add_to} ${label}`
      },
      library: {
        type: 'image'
      },
      multiple: true
    });
    attribute_images_frame.on('select', function () {
      const selection = attribute_images_frame.state().get('selection');
      selection.map(function (attachment) {
        attachment = attachment.toJSON();
        if (attachment.id) {
          if (!attachment_data) {
            attachment_data = [];
          }
          attachment_data.push({
            id: attachment.id,
            url: attachment.url
          });
          const image_tpl = ai_image_tpl.replace(/{{attachment_id}}/g, attachment.id).replace(/{{attachment_url}}/g, attachment.url);
          $woothumbs_ai_images.append(image_tpl);
        }
      });
      $image_gallery_ids.val(JSON.stringify(attachment_data));
      update_ai_gallery_state($(event.target).closest(ai_row_class));
    });
    attribute_images_frame.open();
    return false;
  }

  /**
   * Take action depending on the selection from the actions dropdown.
   *
   * @see setup_attribute_images
   * @param event
   */
  function handler_ai_action_select(event) {
    const action_select_val = $ai_action_select.val(),
      $action_select_button = $('#iconic-woothumbs-ai-action-button');
    if (action_select_val) {
      $action_select_button.attr('disabled', false);
    }
  }

  /**
   * Take action depending on the selection from the actions dropdown.
   *
   * @see setup_attribute_images
   * @param event
   */
  function handler_ai_action_button(event) {
    event.preventDefault();
    const action = $ai_action_select.val(),
      label = $ai_action_select.find(':selected').data('label');
    if (!action) {
      return;
    }
    $ai_default_state_notice.hide();
    if ('all' === action) {
      add_ai_section_all();
    } else {
      add_ai_section_specific(action, label);
    }
  }

  /**
   * Take action when an attribute row term change takes place.
   *
   * @param event
   * @see setup_attribute_images
   */
  function handler_row_select_change(event) {
    const updated = update_row_data(event),
      $select = $(event.target);
    if ($select.val !== '') {
      $select.closest(ai_section_content_class).find('button').attr('disabled', false);
    } else {
      $select.closest(ai_section_content_class).find('button').attr('disabled', true);
    }
    disable_select_options(event);

    // Only change the button state if we have an actual row update.
    if (updated) {
      toggle_changes_buttons_state(false);
    }
  }

  /**
   * Filter attribute rows when the search field changes.
   *
   * @see setup_attribute_images
   * @param event
   */
  function handler_search_field_change(event) {
    clearTimeout(ai_search_field_change_timer);
    ai_search_field_change_timer = setTimeout(function () {
      filter_attribute_rows(event);
    }, 300);
  }

  /**
   * Add an attribute images row.
   *
   * @see setup_attribute_images
   * @param event
   */
  function handler_add_ai_row(event) {
    event.preventDefault();
    const attribute_name = $(event.target).parent().attr('data-attribute-name'),
      attribute_label = $(event.target).parent().attr('data-attribute-label');
    add_ai_attribute_rows(attribute_name, attribute_label, ai_attributes_cache[attribute_name]);
  }

  /**
   * Remove an attribute images row.
   *
   * @param event
   * @see setup_attribute_images
   */
  function handler_remove_ai_row(event) {
    event.preventDefault();
    const $row = $(event.target).closest(ai_row_class),
      attribute_name = $row.attr('data-attribute-name'),
      attribute_label = $row.closest(ai_section_content_class).prev().attr('data-attribute-label'),
      $parent_section_content = $ai_options.find(`${ai_section_content_class}[data-attribute-name="${attribute_name}"]`),
      confirmed = confirm(`${attribute_label} - ${iconic_woothumbs_vars.text.sure_remove_images}`);
    if (!confirmed) {
      event.stopImmediatePropagation();
      return;
    }

    // Remove the row.
    $row.remove();

    // Trigger event on the parent container as the row is now out of the DOM.
    $parent_section_content.trigger('ai_row_removed');

    // Remove the parent section if it no longer contains any rows..
    if (!$parent_section_content.children().length) {
      $parent_section_content.parent().find(`[data-attribute-name="${attribute_name}"]`).remove();
      $ai_action_select.find(`option[value="${attribute_name}]"`).attr('disabled', false);
    }
  }

  /**
   * Take action once a new row has been added.
   *
   * @param event
   * @see setup_attribute_images
   */
  function handler_row_added(event) {
    // Trigger a click event on the row toggle to expand.
    if ($(event.target).closest(ai_row_class).attr('data-is-new') === 'yes') {
      $(event.target).closest(ai_row_class).find(`${ai_row_class}-toggle`).trigger('click');
    }
    init_selectWoo(event);
    update_row_data(event); // Working.
    disable_select_options(event);
    toggle_add_row_visibility(event);
    toggle_expand_close_links();
    toggle_toolbars_visibility();
  }

  /**
   * Take action once an existing row has been removed.
   *
   * @param event
   * @see setup_attribute_images
   */
  function handler_row_removed(event) {
    const $parent_section_content = $(event.target);
    $select = $parent_section_content.find('select');

    // The length will always be 1 greater than what we
    // expect given that the row has just been deleted.
    if ($(ai_row_class).length < 1) {
      $ai_default_state_notice.show();
    }
    disable_select_options(event);
    toggle_add_row_visibility(event);
    toggle_expand_close_links();
    if ($select.val() !== 'undefined') {
      toggle_changes_buttons_state(false);
    }
  }

  /**
   * Remove an attribute image.
   *
   * @param event
   * @see setup_attribute_images
   */
  function handler_remove_ai_image(event) {
    if (event.type === 'click') {
      const $row = $(this).closest(ai_row_class);
      $(this).closest('li').remove();
      update_ai_gallery_state($row);
      return false;
    }
    if (event.type === 'mouseenter') {
      $(this).find('img').animate({
        opacity: 0.3
      }, 150);
    }
    if (event.type === 'mouseleave') {
      $(this).find('img').animate({
        opacity: 1
      }, 150);
    }
  }

  /**
   * Save field data to post meta.
   *
   * @param event
   * @param callback
   * @see setup_attribute_images
   */
  function handler_save_ai_field_data(event, callback = false) {
    event.preventDefault();
    const data = {};
    data.data = get_ai_field_data();
    data.action = 'admin_save_ai_field_data';
    data.nonce = iconic_woothumbs_vars.nonce;
    data.product_id = ai_post_id;
    block_ai_ui();
    $.ajax({
      url: iconic_woothumbs_vars.ajaxurl,
      data,
      type: 'POST',
      success(response) {
        if (response.success) {
          toggle_changes_buttons_state(true);
          $ai_options.attr('data-ai-data', JSON.stringify(data.data));
          unblock_ai_ui();
          if (typeof callback === 'function') {
            callback();
          }
        }
      }
    });
  }

  /**
   * Load the attribute images field data.
   *
   * @param event
   * @see setup_attribute_images
   */
  function handler_load_ai_tab_data(event) {
    event.preventDefault();

    // If we have no variations, show the notice.
    const $variations_notice = $('.iconic-woothumbs-ai__missing-variations-notice'),
      $panel_inner = $('.iconic-woothumbs-ai__inner'),
      $toolbar = $('.iconic-woothumbs-ai__toolbar-top'),
      variations_count = $('.woocommerce_variations').attr('data-total');
    if (!parseInt(variations_count)) {
      $toolbar.hide();
      $panel_inner.hide();
      $ai_default_state_notice.hide();
      $variations_notice.show();
      return;
    }
    $toolbar.show();
    $panel_inner.show();
    $variations_notice.hide();
    if ($ai_options.hasClass(ai_data_loaded_class)) {
      return;
    }
    block_ai_ui();
    insert_ai_tab_content();
  }

  /**
   * Execute logic once the tab data has loaded.
   *
   * @see handler_ai_data_loaded
   */
  function handler_ai_data_loaded() {
    const post_form = $('form#post');
    post_form.on('submit', handler_save_on_submit);
    $('input:submit', post_form).on('click keypress', function () {
      post_form.data('callerid', this.id);
    });
    $(`${ai_row_class}.closed`).each(function (index, element) {
      $(element).find(ai_row_content_class).hide();
    });
    toggle_changes_buttons_state(true);
    toggle_toolbars_visibility();
    $ai_action_select.val('');
    $(ai_search_field_class).val('');
    unblock_ai_ui();
  }

  /**
   * Maybe save attribute images data on post submit.
   *
   * @param event
   * @see handler_ai_data_loaded
   */
  function handler_save_on_submit(event) {
    if (!$('#save-attribute-images').is(':disabled') && !$ai_options.hasClass('saved-on-submit')) {
      event.preventDefault();
      handler_save_ai_field_data(event, save_ai_on_submit_done);
      $ai_options.addClass('saved-on-submit');
    }
  }

  /**
   * Reset the attribute images field data.
   *
   * @see setup_attribute_images
   * @param event
   */
  function handler_reset_ai_tab_data(event) {
    const confirmed = confirm(iconic_woothumbs_vars.text.sure_cancel_changes);
    if (!confirmed) {
      return;
    }
    $ai_specific_attributes_section.empty();
    $ai_all_attributes_section.empty();
    $ai_options.removeClass(ai_data_loaded_class);
    block_ai_ui();

    // Mark the action dropdown options as available again.
    $ai_action_select.children('option').each(function (index, element) {
      if ($(element).val()) {
        $(element).attr('disabled', false);
      }
    });
    insert_ai_tab_content();
    setTimeout(function () {
      toggle_changes_buttons_state(true);
      unblock_ai_ui();
    }, 500);
  }

  /**
   * Clear the attribute images attribute cache when
   * attributes are saved.
   *
   * @see setup_attribute_images
   */
  function handler_clear_ai_attributes_cache() {
    ai_attributes_cache = {};
  }

  /**
   * Toggle attribute images row open/close visibility
   *
   * @see setup_attribute_images
   * @param event
   */
  function handler_toggle_row_visibility(event) {
    // We don't want to toggle if the select2 element or
    // the remove link are clicked.
    if (event.target.nodeName === 'SPAN') {
      return;
    }
    const $row = $(event.currentTarget),
      closed_class = 'closed',
      open_class = 'open';
    if ($row.hasClass(closed_class)) {
      $row.removeClass(closed_class);
    } else {
      $row.addClass(closed_class);
    }
    if ($row.hasClass(open_class)) {
      $row.removeClass(open_class);
    } else {
      $row.addClass(open_class);
    }
    $row.find(ai_row_content_class).stop().slideToggle();
  }

  /**
   * Expand all metabox contents.
   *
   * @param event
   * @see setup_attribute_images
   */
  function handler_expand_row_contents(event) {
    $(this).closest('.panel.iconic-woothumbs-ai').find(ai_row_content_class).show();
    return false;
  }

  /**
   * Close all metabox contents.
   *
   * @param event
   * @see setup_attribute_images
   */
  function handler_close_row_contents(event) {
    $(this).closest('.panel.iconic-woothumbs-ai').find(ai_row_content_class).hide();
    return false;
  }

  /**
   * Sticky scroll for the AI toolbar.
   *
   * @see setup_attribute_images
   */
  function handler_sticky_toolbar_scroll() {
    if (!$('.iconic-woothumbs_ai_options_tab').hasClass('active')) {
      return;
    }
    const $woocommerce_header = $('.woocommerce-layout__header'),
      $options_container = $('#iconic-woothumbs_ai_options'),
      $toolbar = $('.iconic-woothumbs-ai__toolbar-top');
    if ($woocommerce_header.offset().top >= $options_container.offset().top - 92) {
      $toolbar.addClass('sticky').css('width', $options_container.width());
    } else {
      $toolbar.removeClass('sticky').css('width', '');
    }
  }

  /**
   * Setup Attribute Images handlers.
   */
  function setup_attribute_images() {
    if (!$ai_options.length) {
      return;
    }
    $(document)
    // Handler for loading field data when the attribute images tab link is clicked.
    .on('click', '.iconic-woothumbs_ai_options_tab', handler_load_ai_tab_data)
    // Handler for when the tab data has loaded.
    .on('ai_data_loaded', '.iconic-woothumbs-ai', handler_ai_data_loaded)
    // Handler for the management of attribute images.
    .on('click', '.manage_woothumbs_ai', handler_manage_ai_gallery)
    // Handler for the section action dropdown button.
    .on('change', '#iconic-woothumbs-ai-action-select', handler_ai_action_select)
    // Handler for the section action dropdown button.
    .on('click', '#iconic-woothumbs-ai-action-button', handler_ai_action_button)
    // Handler for removing attribute rows.
    .on('click', ai_add_row_class, handler_add_ai_row)
    // Handler for removing attribute rows.
    .on('click', '.iconic-woothumbs-ai__remove-row', handler_remove_ai_row)
    // Handler for the deletion of individual images.
    .on('mouseenter mouseleave click', '.iconic-woothumbs-ai__remove-image', handler_remove_ai_image)
    // Handler for changes in select dropdowns.
    .on('change', ai_select_field_class, handler_row_select_change)
    // Handler for changes in select dropdowns.
    .on('keyup', ai_search_field_class, handler_search_field_change)
    // Handler for taking action after new rows are added.
    .on('ai_rows_added', ai_select_field_class, handler_row_added)
    // Handler for taking action after a row is removed.
    .on('ai_row_removed', ai_section_content_class, handler_row_removed)
    // Handler for saving the field data.
    .on('click', '#save-attribute-images', handler_save_ai_field_data)
    // Handler for resetting the field data.
    .on('click', '#cancel-attribute-images', handler_reset_ai_tab_data)
    // Handler for clearing attribute images attribute cache on attributes save.
    .on('click', '.save_attributes', handler_clear_ai_attributes_cache)
    // Handler for toggling metabox visibility
    .on('click', ai_row_class, handler_toggle_row_visibility)
    // Handler for expanding all metabox contents.
    .on('click', '.iconic-woothumbs-ai__expand-close .expand', handler_expand_row_contents)
    // Handler for closing all metabox contents.
    .on('click', '.iconic-woothumbs-ai__expand-close .close', handler_close_row_contents)
    // Handler for sticky toolbar scrolling in the AI tab.
    .on('scroll', handler_sticky_toolbar_scroll);
  }

  // Go!
  setup_attribute_images();
})(jQuery, document);
/**
 * WooThumbs - Admin Scripts.
 * @param $
 * @param document
 */
(function ($, document) {
  // variables
  const cacheKey = 'data-jckwt-galleries';

  /* on doc ready */
  $(document).ready(function () {
    setup_variation_image_management();
    setup_bulk_save_buttons();
    setup_media_upload();
  });

  // local cache

  var image_galleries = {},
    localCache = {
      /**
       * timeout for cache in millis
       * @type {number}
       */
      timeout: 1800000,
      // 30 minutes
      /**
       * @type {{_: number, data: {}}}
       */
      data: {},
      remove(key) {
        delete localCache.data[key];
      },
      exist(key) {
        return !!localCache.data[key] && new Date().getTime() - localCache.data[key]._ < localCache.timeout;
      },
      get(key) {
        return localCache.data[key].data;
      },
      set(key, cachedData, callback) {
        localCache.remove(key);
        localCache.data[key] = {
          _: new Date().getTime(),
          data: cachedData
        };
        if ($.isFunction(callback)) {
          callback(cachedData);
        }
      },
      length(key) {
        return Object.keys(localCache.data[key].data).length;
      },
      hasValidDataKeys(key, dataKeys) {
        if (!dataKeys) {
          return false;
        }
        let valid = true;
        for (let i = 0; i < dataKeys.length; i++) {
          if (!localCache.data[key] || !localCache.data[key].data.hasOwnProperty(dataKeys[i])) {
            valid = false;
            break;
          }
        }
        return valid;
      }
    };

  // set an empty object to store our variation galleries by id
  localCache.set(cacheKey, {});

  // ! Bulk Save Buttons
  function setup_bulk_save_buttons() {
    $('.saveVariationImages').on('click', function () {
      const btn = $(this),
        $messageContainer = btn.next('.updateMsg'),
        updateText = btn.attr('data-update'),
        updatedText = btn.attr('data-updated'),
        updatingText = btn.attr('data-updating'),
        errorText = btn.attr('data-error'),
        varid = btn.attr('data-varid'),
        images = $(btn.attr('data-input')).val(),
        ajaxargs = {
          action: iconic_woothumbs_vars.slug + '_bulk_save',
          nonce: iconic_woothumbs_vars.nonce,
          varid,
          images
        };
      btn.val(updatingText);
      $.post(iconic_woothumbs_vars.ajaxurl, ajaxargs, function (data) {
        if (data.result == 'success') {
          btn.val(updatedText);
        } else {
          btn.val(errorText);
        }
        $messageContainer.text(data.message);
        setTimeout(function () {
          btn.val(updateText);
          $messageContainer.text('');
        }, 3000);
      });
      return false;
    });
  }

  // Update Selected Images
  function selectedImgs($tableCol) {
    // Get all selected images
    const $selectedImgs = [],
      $gallery_field = $tableCol.find('.variation_image_gallery');
    $tableCol.find('.wooThumbs .image').each(function () {
      $selectedImgs.push($(this).attr('data-attachment_id'));
    });

    // Update hidden input with chosen images
    $gallery_field.val($selectedImgs.join(','));
    input_changed($gallery_field);
  }

  // Iterate over our collection of buttons and either mark the button
  // as being ready if the images are already in the cache for this
  // variation, or if they are not already cached, add them to the
  // cache and mark the button as ready.
  function prepareUploadButtons($img_upload_btns, gallery_data) {
    $img_upload_btns.each(function () {
      const $upload_btn = $(this),
        var_id = $upload_btn.attr('rel');
      if (typeof image_galleries[var_id] !== 'undefined' && image_galleries[var_id] !== null) {
        // this gallery has been loaded before, so
        // trigger this button as ready
        $('body').trigger('gallery_ready', [$upload_btn, var_id]);
      } else {
        // add our gallery to the galleries data
        // and add it to the cache
        image_galleries[var_id] = gallery_data[var_id];
        localCache.set(cacheKey, image_galleries);

        // this gallery is now loaded, so,
        // trigger this button as ready
        $('body').trigger('gallery_ready', [$upload_btn, var_id]);
      }
    });
  }
  function triggerGalleryData() {
    let $img_upload_btns = $('.woocommerce_variations .upload_image_button'),
      gallery_data = {},
      var_ids = [];

    // Build an array of all the current variation IDs
    // that exist on this page of results.
    $img_upload_btns.each(function () {
      var_ids.push($(this).attr('rel'));
    });

    // Abort if this is the initial page load,
    // as the buttons don't exist in the DOM at
    // this time.
    if (0 === var_ids.length) {
      return;
    }

    // Cache hit or AJAX call.
    if (localCache.exist(cacheKey) && localCache.length(cacheKey) && localCache.hasValidDataKeys(cacheKey, var_ids)) {
      // If the cache key exists,
      // the cache data object is not empty,
      // and the cache data contains properties
      // that all have valid data then we hit the cache.
      gallery_data = localCache.get(cacheKey);
      prepareUploadButtons($img_upload_btns, gallery_data);
    } else {
      // Set up content to inset after variation Image
      const ajax_args = {
        action: 'admin_load_thumbnails',
        nonce: iconic_woothumbs_vars.nonce,
        var_ids: JSON.stringify(var_ids)
      };
      $.ajax({
        url: iconic_woothumbs_vars.ajaxurl,
        data: ajax_args,
        context: this
      }).done(function (response) {
        if (response.success) {
          gallery_data = JSON.parse(response.data);
          prepareUploadButtons($img_upload_btns, gallery_data);
        }
      });
    }
    refreshGalleryHtml();
  }

  // insert gallery html

  function refreshGalleryHtml() {
    $('body').on('gallery_ready', function (event, $btn, varId) {
      let galleries = {};
      if (localCache.exist(cacheKey)) {
        galleries = localCache.get(cacheKey);
      }
      if (typeof galleries[varId] !== 'undefined' && galleries[varId] !== null) {
        const galleryWrapperClass = 'wooThumbs-wrapper--' + varId;
        $('.' + galleryWrapperClass).remove();
        let image_ids = galleries[varId].image_ids,
          images = galleries[varId].images,
          list_items = '';
        for (const key in images) {
          if (Object.hasOwnProperty.call(images, key)) {
            list_items += '<li class="image" data-attachment_id="' + images[key].id + '">' + '<a href="#" class="wooThumbs-variation-image-delete" title="' + iconic_woothumbs_vars.text.remove_image + '">' + images[key].html + '</a></li>';
          }
        }
        const $wooThumbs = '<div class="wooThumbs-wrapper ' + galleryWrapperClass + '">' + '<h4>Variation Images</h4>' + '<ul class="wooThumbs">' + list_items + '</ul>' + '<input type="hidden" class="variation_image_gallery" name="variation_image_gallery[' + varId + ']" value="' + image_ids.join(',') + '">' + '<a href="#" class="manage_wooThumbs button">' + iconic_woothumbs_vars.text.add_variation_images + '</a>' + '</div>';
        $btn.after($wooThumbs);
      }

      // Sort Images
      $('.wooThumbs').sortable({
        deactivate(en, ui) {
          const $tableCol = $(ui.item).closest('.upload_image');
          selectedImgs($tableCol);
        },
        placeholder: 'ui-state-highlight'
      });
    });
  }
  function input_changed($input) {
    $input.closest('.woocommerce_variation').addClass('variation-needs-update');
    $('button.cancel-variation-changes, button.save-variation-changes').removeAttr('disabled');
    if (localCache.exist(cacheKey)) {
      galleries = localCache.get(cacheKey);
      delete galleries[$input.closest('.upload_image').find('.upload_image_button').attr('rel')];
      localCache.set(cacheKey, galleries);
    }
    $('#variable_product_options').trigger('woocommerce_variations_input_changed');
  }

  // Setup Variation Image Manager
  function setup_variation_image_management() {
    triggerGalleryData();
    let product_gallery_frame;
    $(document).on('click', '.manage_wooThumbs', function (event) {
      let $wooThumbs = $(this).siblings('.wooThumbs'),
        $image_gallery_ids = $(this).siblings('.variation_image_gallery'),
        attachment_ids = $image_gallery_ids.val();
      event.preventDefault();

      // Create the media frame.
      product_gallery_frame = wp.media.frames.downloadable_file = wp.media({
        // Set the title of the modal.
        title: iconic_woothumbs_vars.text.manage_variation_images,
        button: {
          text: iconic_woothumbs_vars.text.add_to_variation
        },
        library: {
          type: 'image'
        },
        multiple: true
      });

      // When an image is selected, run a callback.
      product_gallery_frame.on('select', function () {
        const selection = product_gallery_frame.state().get('selection');
        selection.map(function (attachment) {
          attachment = attachment.toJSON();
          if (attachment.id) {
            attachment_ids = attachment_ids ? attachment_ids + ',' + attachment.id : attachment.id;
            $wooThumbs.append('<li class="image" data-attachment_id="' + attachment.id + '">' + '<a href="#" class="wooThumbs-variation-image-delete" title="' + iconic_woothumbs_vars.text.remove_image + '"><img src="' + attachment.url + '" /></a>' + '</li>');
          }
        });
        $image_gallery_ids.val(attachment_ids);
        input_changed($image_gallery_ids);
      });

      // Finally, open the modal.
      product_gallery_frame.open();
      return false;
    });

    // Delete Image

    $(document).on('mouseenter mouseleave click', '.wooThumbs-variation-image-delete', function (event) {
      if (event.type === 'click') {
        const $tableCol = $(this).closest('.upload_image');
        // Remove clicked image
        $(this).closest('li').remove();
        selectedImgs($tableCol);
        return false;
      }
      if (event.type === 'mouseenter') {
        $(this).find('img').animate({
          opacity: 0.3
        }, 150);
      }
      if (event.type === 'mouseleave') {
        $(this).find('img').animate({
          opacity: 1
        }, 150);
      }
    });

    // after variations load
    $('#woocommerce-product-data').on('woocommerce_variations_loaded', triggerGalleryData);

    // Once a new variation is added
    $('#variable_product_options').on('woocommerce_variations_added', triggerGalleryData);
  }

  /**
   * Setup media gallery for attaching media/video to image.
   */
  function setup_media_upload() {
    if ($('form#post #post_type').length && 'attachment' === $('form#post #post_type').val()) {
      setup_media_upload_for_attachment_page();
    } else {
      setup_media_upload_for_product_and_library_page();
    }
  }
  function setup_media_upload_for_attachment_page($button) {
    $(document.body).on('click', '.iconic-wt-upload-media', function (event) {
      const $button = $(this),
        media_thumbnail_id = $button.attr('data-image-id');
      event.preventDefault();

      // If the media frame already exists, reopen it.
      if (wp.media.frames.iconic_woothumbs_media) {
        wp.media.frames.iconic_woothumbs_media.media_thumbnail_id = media_thumbnail_id;
        wp.media.frames.iconic_woothumbs_media.open();
        return;
      }

      // Create the media frame.
      wp.media.frames.iconic_woothumbs_media = wp.media({
        // Set the title of the modal.
        title: iconic_woothumbs_vars.text.select_mp4,
        button: {
          text: iconic_woothumbs_vars.text.attach_mp4
        },
        library: {
          type: ['video/mp4', 'video/webm']
        },
        multiple: false
      });

      // When an image is selected, run a callback.
      wp.media.frames.iconic_woothumbs_media.on('select', function () {
        const selected_media = wp.media.frames.iconic_woothumbs_media.state().get('selection'),
          $media_field = $('#attachments-' + wp.media.frames.iconic_woothumbs_media.media_thumbnail_id + '-iconic_woothumbs_media');
        selected_media.map(function (attachment) {
          attachment = attachment.toJSON();
          $media_field.val(attachment.url).change();
          return false;
        });
      });

      // Finally, open the modal.
      wp.media.frames.iconic_woothumbs_media.media_thumbnail_id = media_thumbnail_id;
      wp.media.frames.iconic_woothumbs_media.open();
      return false;
    });
  }
  function setup_media_upload_for_product_and_library_page() {
    $(document.body).on('click', '.iconic-wt-upload-media', function (event) {
      const $button = $(this);
      media_thumbnail_id = $button.attr('data-image-id');
      event.preventDefault();

      // Set original frame each time, as there's numerous places
      // to trigger opening the media library.
      wp.media.frames.original = wp.media.frame;
      wp.media.frames.original.close();
      // Stop watching for uploads.
      wp.media.frames.original.state().deactivate();

      // If the media frame already exists, reopen it.
      if (wp.media.frames.iconic_woothumbs_media) {
        wp.media.frames.iconic_woothumbs_media.media_thumbnail_id = media_thumbnail_id;
        wp.media.frames.iconic_woothumbs_media.open();
        return;
      }

      // Create the media frame.
      wp.media.frames.iconic_woothumbs_media = wp.media({
        // Set the title of the modal.
        title: iconic_woothumbs_vars.text.select_mp4,
        button: {
          text: iconic_woothumbs_vars.text.attach_mp4
        },
        library: {
          type: ['video/mp4', 'video/webm']
        },
        multiple: false
      });

      // When an image is selected, run a callback.
      wp.media.frames.iconic_woothumbs_media.on('select', function () {
        // Open the original media library and activate watching for uploads.
        wp.media.frames.original.state().activate();
        wp.media.frames.original.open();
        // Reassign original window to the frame.
        wp.media.frame = wp.media.frames.original;
        // Select image to attach media to.
        if (wp.media.frames.original.state().get('selection')) {
          // returns false in media library page.
          wp.media.frames.original.state().get('selection').add(wp.media.attachment(wp.media.frames.iconic_woothumbs_media.media_thumbnail_id));
        }
        const selected_media = wp.media.frames.iconic_woothumbs_media.state().get('selection'),
          $media_field = $('#attachments-' + wp.media.frames.iconic_woothumbs_media.media_thumbnail_id + '-iconic_woothumbs_media');
        selected_media.map(function (attachment) {
          attachment = attachment.toJSON();
          $media_field.val(attachment.url).change();
          return false;
        });
      });

      // Finally, open the modal.
      wp.media.frames.iconic_woothumbs_media.media_thumbnail_id = media_thumbnail_id;
      wp.media.frames.iconic_woothumbs_media.open();
      return false;
    });
  }
})(jQuery, document);