(function ( $ ) {

    // Selector Control
    $('.automatorwp-selector select').each(function() { automatorwp_selector( $(this) ); });

    // Post Selector Control
    $('.automatorwp-post-selector select').each(function() { automatorwp_post_selector( $(this) ); });

    // Term Selector Control
    $('.automatorwp-term-selector select').each(function() { automatorwp_term_selector( $(this) ); });

    // Taxonomy Selector Control
    $('.automatorwp-taxonomy-selector select').each(function() { automatorwp_selector( $(this) ); });

    // User Selector Control
    $('.automatorwp-user-selector select').each(function() { automatorwp_user_selector( $(this) ); });

    // Object Selector Control
    $('.automatorwp-object-selector select').each(function() { automatorwp_object_selector( $(this) ); });

    // Ajax Selector Control
    $('.automatorwp-ajax-selector select').each(function() { automatorwp_ajax_selector( $(this) ); });

    // Filter selector
    $('.automatorwp-filter-selector select').each(function() { automatorwp_filter_selector( $(this) ); });

    // Update items positions at init to avoid any order error
    automatorwp_update_items_position( $('.automatorwp-automation-items.automatorwp-triggers') );
    automatorwp_update_items_position( $('.automatorwp-automation-items.automatorwp-actions') );

    // Save and activate
    $('body').on('click', '.automatorwp-save-and-activate input', function(e) {
        e.preventDefault();

        if( $('select#status').length ) {
            $('select#status').val('active');
        } else if( $('input#status1').length ) {
            $('input#status1').prop('checked', true);
            $('input#status2').prop('checked', false);
        }

        $('#ct-save').trigger('click');
    });

    // Tooltip
    $('body').on('mouseover', '.automatorwp-tooltip', function(e) {
        $(this).prev('.cmb2-metabox-description').addClass('automatorwp-tooltip-dialog').fadeIn('fast');
    });

    $('body').on('mouseout', '.automatorwp-tooltip', function(e) {
        $(this).prev('.cmb2-metabox-description').fadeOut('fast');
    });

    // Make automation items sortable
    $('.automatorwp-automation-items').sortable({
        cursor: 'grabbing',
        cancel: '.automatorwp-option-form-container, .automatorwp-no-grab',
        // When the items order is updated
        update : function ( e, ui ) {

            // Event target refers to .automatorwp-triggers or .automatorwp-actions
            automatorwp_update_items_position( $(e.target) );

        },
        stop: function( e, ui ) {

            // Refresh wysiwyg editors (after drag and drop forms with editors, is required to refresh them to make them work again)
            ui.item.find( '.cmb-type-wysiwyg' ).each( function() {

                var $this = $(this);

                var textarea_id = $this.find('textarea').attr('id');
                var textarea = $this.find('textarea').clone();

                // Remove CMB2 HTML and add a single textarea to be converted as editor
                $this.find('.wp-editor-wrap').remove();
                $this.find('.cmb-td').append(textarea);

                automatorwp_initialize_wysiwyg_editor( textarea_id );

            } );

            if ( 'undefined' !== typeof window.QTags ) {
                window.QTags._buttonsInit();
            }

        }
    });

    // Toggleable options list
    $('body').on('click', '.automatorwp-toggleable-options-list-toggle', function(e) {
        e.preventDefault();

        var $this = $(this);
        var show_text = $this.data( 'show-text' );
        var hide_text = $this.data( 'hide-text' );
        var list = $this.closest('.cmb-td').find('.automatorwp-toggleable-options-list');

        // Toggle options list visitibility and change toggle text
        if( $this.text() === show_text ) {
            $this.text(hide_text);
            list.slideDown('fast');
        } else {
            $this.text(show_text);
            list.slideUp('fast');
        }

    });

    // Sequential
    $('body').on('change', 'input#sequential', function(e) {

        var selector = '.automatorwp-triggers .automatorwp-automation-item:not(.automatorwp-automation-item-filter) .automatorwp-automation-item-position';

        if( $(this).prop('checked') ) {
            $(selector).show();
        } else {
            $(selector).hide();
        }

    });

    // Move Up/Down
    $('body').on('click', '.automatorwp-automation-item-action-move-up, .automatorwp-automation-item-action-move-down', function(e) {

        var item = $(this).closest('.automatorwp-automation-item');
        var items_list = $(this).closest('.automatorwp-automation-items');
        var direction = ( $(this).hasClass('automatorwp-automation-item-action-move-up') ? 'up' : 'down' );
        var sibling_item;

        if( direction === 'up' ) {
            sibling_item = item.prev('.automatorwp-automation-item');
        } else {
            sibling_item = item.next('.automatorwp-automation-item');
        }

        if( ! sibling_item.length ) {
            return;
        }

        if( direction === 'up' ) {
            $('#' + item.attr('id')).insertBefore( '#' + sibling_item.attr('id') );
        } else {
            $('#' + item.attr('id')).insertAfter( '#' + sibling_item.attr('id') );
        }

        // Update items position
        automatorwp_update_items_position( items_list );
    });

    // Delete item
    $('body').on('click', '.automatorwp-automation-item-action-delete', function(e) {

        var item = $(this).closest('.automatorwp-automation-item');
        var items_list = $(this).closest('.automatorwp-automation-items');
        var item_type = item.hasClass('automatorwp-trigger') ? 'trigger' : 'action';
        var id = item.find('input.id').val();

        // Hide this item
        item.slideUp('fast', function() {
            // Removes this item
            item.remove();

            // Update items position
            automatorwp_update_items_position( items_list );
        });

        // If is an anonymous automation, add the add trigger form again
        if( item_type === 'trigger' && $('body.edit-anonymous-automation').length ) {
            // Show add trigger form
            $('<div class="automatorwp-automation-item automatorwp-trigger" style="display: none;">'
                + $('#automatorwp_triggers').find('.automatorwp-add-item-form').html()
                + '</div>').appendTo('.automatorwp-triggers').slideDown('fast');
        }

        $.ajax({
            url: ajaxurl,
            method: 'POST',
            data: {
                action: 'automatorwp_delete_automation_item',
                nonce: automatorwp_admin.nonce,
                id: id,
                item_type: item_type
            },
            success: function( response ) {

                if( response.success ) {

                    // Remove trigger tags
                    if( item_type === 'trigger' ) {
                        $('.automatorwp-automation-tag-selector optgroup[data-id="' + id + '"]').remove();
                    }

                } else {

                }
            },
            error: function( response ) {

            }
        });


    });

    // Update controls depending of automation type
    if( $('body.edit-anonymous-automation').length ) {

        if( $('#automatorwp_triggers .automatorwp-automation-item').length === 0 ) {
            // Show add trigger form
            $('<div class="automatorwp-automation-item automatorwp-trigger">'
                + $('#automatorwp_triggers').find('.automatorwp-add-item-form').html()
                + '</div>').appendTo('.automatorwp-triggers');
        }

        // Remove elements and inputs not allowed
        $('.automatorwp-add-trigger').remove();
        $('#automatorwp_triggers .automatorwp-add-filter').remove();
        $('.automatorwp-sequential-field').remove();
        $('#cmb-field-js-controls-times_per_user-before').remove();
        $('.cmb2-id-times-per-user').remove();
        $('#cmb-field-js-controls-times_per_user-after').remove();

    } else {
        // Remove anonymous info
        $('.automatorwp-automation-ui-anonymous-notice').remove();
    }

    // -----------------------------------------------
    // Anonymous user action
    // -----------------------------------------------

    // Anonymous user action choices
    $('body').on('click', '.automatorwp-action-automatorwp-anonymous-user .automatorwp-anonymous-user-choice', function(e) {

        var item = $(this).closest('.automatorwp-automation-item');
        var option_form = item.find('.automatorwp-option-form-container[data-option="user"]');
        var choice = $(this).data('choice');

        // Update the select value
        option_form.find('.cmb2-id-run-actions-on select').val( choice ).trigger('change');

        // Hide the choices
        $(this).closest('.automatorwp-anonymous-user-choices').slideUp('fast');

        // Show this option form
        option_form.addClass('automatorwp-option-form-active').slideDown('fast');

    });

    // Anonymous user action change button
    $('body').on('click', '.automatorwp-action-automatorwp-anonymous-user .automatorwp-anonymous-user-change-button', function(e) {
        var item = $(this).closest('.automatorwp-automation-item');

        // Hide resume
        $(this).closest('.automatorwp-anonymous-user-resume').slideUp('fast');

        // Show the choices
        item.find('.automatorwp-anonymous-user-choices').slideDown('fast');
    });

    // Anonymous user action resume buttons
    $('body').on('click', '.automatorwp-action-automatorwp-anonymous-user .automatorwp-anonymous-user-resume strong', function(e) {
        var item = $(this).closest('.automatorwp-automation-item');
        var option_form = item.find('.automatorwp-option-form-container[data-option="user"]');

        // Trigger change on select
        option_form.find('.cmb2-id-run-actions-on select').trigger('change');

        // Hide resume
        $(this).closest('.automatorwp-anonymous-user-resume').slideUp('fast');

        // Show this option form
        option_form.addClass('automatorwp-option-form-active').slideDown('fast');
    });

    // Anonymous user action fields visibility
    $('body').on('change', '.automatorwp-action-automatorwp-anonymous-user .cmb2-id-run-actions-on select', function(e) {
        var choice = $(this).val();
        var form = $(this).closest('.cmb2-metabox');
        var target = undefined;
        var checked = undefined;

        if( choice === 'existing_user' ) {

            checked = form.find('.cmb2-id-existing-user-not-exists input:checked');

            // Check if, for existing user, wants to create a new user
            if( checked.length && checked.val() === 'new_user' ) {

                target = undefined;

                // Show all fields
                form.find('> .cmb-row').show();

                // Hide new user search fields (and run actions on)
                form.find('.cmb2-id-run-actions-on,' +
                    '.cmb2-id-new-user-exists,' +
                    ' .cmb2-id-new-user-search-field').hide();

            } else {
                // Target to all existing fields
                target = form.find('.cmb2-id-search-field,' +
                    ' .cmb2-id-search-field-value,' +
                    ' .cmb2-id-existing-user-not-exists');
            }
        } else if( choice === 'new_user' ) {

            checked = form.find('.cmb2-id-new-user-exists input:checked');

            // Check if, for new user, wants to assign to a existing user
            if( checked.length && checked.val() === 'existing_user' ) {

                // Target to all new user fields
                target = form.find('.cmb2-id-user-login,' +
                    ' .cmb2-id-user-email,' +
                    ' .cmb2-id-first-name,' +
                    ' .cmb2-id-last-name,' +
                    ' .cmb2-id-user-url,' +
                    ' .cmb2-id-user-pass,' +
                    ' .cmb2-id-role,' +
                    ' .cmb2-id-send-user-notification,' +
                    ' .cmb2-id-user-meta,' +
                    ' .cmb2-id-new-user-exists,' +
                    ' .cmb2-id-new-user-search-field');

            } else {

                // target new user fields excepts the search field
                target = form.find('.cmb2-id-user-login,' +
                    ' .cmb2-id-user-email,' +
                    ' .cmb2-id-first-name,' +
                    ' .cmb2-id-last-name,' +
                    ' .cmb2-id-user-url,' +
                    ' .cmb2-id-user-pass,' +
                    ' .cmb2-id-role,' +
                    ' .cmb2-id-send-user-notification,' +
                    ' .cmb2-id-user-meta,' +
                    ' .cmb2-id-new-user-exists');

            }
        }

        if( target !== undefined ) {
            // Hide all fields
            form.find('> .cmb-row').hide();

            // Only show target fields
            target.show();
        }

    });

    // Anonymous user action existing user not exists
    $('body').on('change', '.automatorwp-action-automatorwp-anonymous-user .cmb2-id-existing-user-not-exists input', function(e) {
        var $this = $(this);
        var fields = $this.closest('.cmb2-metabox').find(
            '.cmb2-id-user-login,' +
            ' .cmb2-id-user-email,' +
            ' .cmb2-id-first-name,' +
            ' .cmb2-id-last-name,' +
            ' .cmb2-id-user-url,' +
            ' .cmb2-id-user-pass,' +
            ' .cmb2-id-role,' +
            ' .cmb2-id-send-user-notification,' +
            ' .cmb2-id-user-meta');

        if( $this.prop('checked') && $this.val() === 'new_user' ) {
            fields.slideDown('fast');
        } else {
            fields.slideUp('fast');
        }
    });

    // Anonymous user action new user exists
    $('body').on('change', '.automatorwp-action-automatorwp-anonymous-user .cmb2-id-new-user-exists input', function(e) {
        var $this = $(this);
        var fields = $this.closest('.cmb2-metabox').find('.cmb2-id-new-user-search-field');

        if( $this.prop('checked') && $this.val() === 'existing_user' ) {
            fields.slideDown('fast');
        } else {
            fields.slideUp('fast');
        }
    });

    // Anonymous user action cancel
    $('body').on('click', '.automatorwp-action-automatorwp-anonymous-user .automatorwp-cancel-option-form', function(e) {

        var item = $(this).closest('.automatorwp-automation-item');
        var option_form = item.find('.automatorwp-option-form-container[data-option="user"]');

        // Show the choices again
        $('.automatorwp-anonymous-user-choices').slideDown('fast');

        // Update the select value
        option_form.find('.cmb2-id-run-actions-on select').val('').trigger('change');
    });

    // -----------------------------------------------
    // Add Trigger/Action
    // -----------------------------------------------

    // Add trigger/action
    $('body').on('click', '.automatorwp-add-trigger, .automatorwp-add-action', function(e) {
        e.preventDefault();

        var type = $(this).hasClass('automatorwp-add-trigger') ? 'trigger' : 'action';

        $('<div class="automatorwp-automation-item automatorwp-' + type + '" style="display: none;">'
            + $(this).closest('.inside').find('.automatorwp-add-item-form').html()
        + '</div>').appendTo('.automatorwp-' + type + 's').slideDown('fast');
    });

    // Select an integration
    $('body').on('click', '.automatorwp-automation-item .automatorwp-select-integration .automatorwp-integration', function(e) {
        e.preventDefault();

        var item = $(this).closest('.automatorwp-automation-item');
        var select = item.find('.automatorwp-integration-choices[data-integration="' + $(this).data('integration') + '"]');

        // Hide the integration select
        item.find('.automatorwp-select-integration').hide();

        // Update integration icon and label
        item.find('.automatorwp-automation-item-details .automatorwp-integration-icon').append('<img src="' + $(this).data('icon') + '" />');
        item.find('.automatorwp-automation-item-content').prepend('<div class="automatorwp-integration-label">' + $(this).data('label') + '</div>');

        // Show the trigger select
        select.show();
        item.find('.automatorwp-integration-choices-container').show();

        $('<div class="automatorwp-select2-dropdown-container"></div>').insertAfter(select);

        var dropdown_container = select.next('.automatorwp-select2-dropdown-container');

        select.automatorwp_select2( {
            theme: 'default automatorwp-select2',
            placeholder: select.data('placeholder'),
            allowClear: false,
            multiple: false,
            closeOnSelect: false,
            dropdownParent: dropdown_container,
            escapeMarkup: function(markup) { return markup; },
            templateResult: function(data) {
                // Custom template result to allow HTML markup on select items
                var text = data.text;

                if( data.element !== undefined ) {

                    // Check if option has something on data-text attribute
                    var custom_text = $(data.element).data('text');

                    if( custom_text !== undefined && custom_text.length ) {
                        text = custom_text;
                    }

                }

                return text;
            },
            templateSelection: function(data) { return data.text; }
        } ).on('select2:open', function(e) {
            // Set the search input placeholder attribute
            dropdown_container.find('input.select2-search__field').attr('placeholder', select.data('placeholder'));
        }).on('select2:closing', function(e) {
            // Prevent to close dropdown
            e.preventDefault();
        }).on('select2:closed', function(e) {
            // Prevent to close dropdown
            select.select2('open');
        }).on('select2:selecting', function (e) {
            // Prevent change value if disabled
            if ( select.prop('disabled') ) {
                e.preventDefault();
            }
        });

        select.automatorwp_select2( 'open' );
    });

    // Select a trigger/action
    $('body').on('change', '.automatorwp-automation-item .automatorwp-integration-choices', function(e) {
        e.preventDefault();

        if( $(this).prop('disabled') ) {
            return;
        }

        var item = $(this).closest('.automatorwp-automation-item');
        var items_list = item.closest('.automatorwp-automation-items');
        var automation_id = $('input#object_id').val();
        var type = $(this).val();
        var item_type = item.hasClass('automatorwp-trigger') ? 'trigger' : 'action';

        if( ! type.length ) {
            return;
        }

        var last_position = items_list.find('.automatorwp-automation-item input.position').last();
        var position = 0;

        if( last_position.length ) {
            position = parseInt( last_position.val() ) + 1;
        } else {
            position = parseInt( items_list.find('.automatorwp-automation-item').length - 1 );
        }

        // Disable the dropdown
        $(this).prop('disabled', true);

        // Show spinner
        item.find('.automatorwp-spinner').show();

        $.ajax({
            url: ajaxurl,
            method: 'POST',
            data: {
                action: 'automatorwp_add_automation_item',
                nonce: automatorwp_admin.nonce,
                automation_id: automation_id,
                item_type: item_type,
                type: type,
                position: position
            },
            success: function( response ) {

                if( response.success ) {

                    // Removes the new item form
                    item.remove();

                    var new_item = $( response.data.edit_html );

                    // Append the new item
                    new_item.appendTo( items_list );

                    // If sequential enabled, show the item position
                    if( item_type === 'trigger' && $('#sequential').prop('checked') ) {
                        // Update items position
                        automatorwp_update_items_position( items_list );

                        items_list.find('.automatorwp-automation-item:not(.automatorwp-automation-item-filter) .automatorwp-automation-item-position').show();
                    }

                    // Add tags to all tags selectors
                    if( item_type === 'trigger' && response.data.tags_html.length ) {
                        $( response.data.tags_html ).appendTo('.automatorwp-automation-tag-selector');
                    }

                    // Make javascript features work on the new item
                    automatorwp_initialize_form_fields( new_item );

                } else {

                }
            },
            error: function( response ) {

            }
        });
    });

    // Cancel select a trigger/action
    $('body').on('click', '.automatorwp-automation-item .automatorwp-cancel-choice-select', function(e) {
        e.preventDefault();

        var item = $(this).closest('.automatorwp-automation-item');
        var type = ( item.hasClass('automatorwp-trigger') ? 'trigger' : 'action' );

        if( type === 'trigger' && $('body.edit-anonymous-automation').length ) {
            // Show the integration select
            item.find('.automatorwp-select-integration').show();

            // Update integration icon and label
            item.find('.automatorwp-automation-item-details .automatorwp-integration-icon img').remove();
            item.find('.automatorwp-automation-item-content .automatorwp-integration-label').remove();

            // Hide the trigger select
            item.find('.automatorwp-integration-choices-container').hide();

            // Remove choices dropdown
            $('.automatorwp-select2-dropdown-container').remove();

            return;
        }

        item.slideUp('fast', function() {
            item.remove();
        });
    });

    // On click recommended integrations
    $('body').on('click', '.automatorwp-recommended-integrations-label a', function(e) {
        e.preventDefault();

        $(this).closest('.automatorwp-recommended-integrations').find('.automatorwp-integrations').slideToggle('fast');
    });

    // -----------------------------------------------
    // Add Filter
    // -----------------------------------------------

    $('body').on('click', '.automatorwp-add-filter', function(e) {

        var button = $(this);
        var box = button.closest('.postbox');
        var items_list = box.find('.automatorwp-automation-items');
        var automation_id = $('input#object_id').val();
        var item_type = ( box.attr('id') === 'automatorwp_triggers' ? 'trigger' : 'action' );
        var type = 'filter';

        var last_position = items_list.find('.automatorwp-automation-item input.position').last();
        var position = 0;

        if( last_position.length ) {
            position = parseInt( last_position.val() ) + 1;
        } else {
            position = parseInt( items_list.find('.automatorwp-automation-item').length - 1 );
        }

        // Disable button
        button.prop('disabled', true);
        // Show spinner
        box.find('.automatorwp-box-spinner').show();

        $.ajax({
            url: ajaxurl,
            method: 'POST',
            data: {
                action: 'automatorwp_add_automation_item',
                nonce: automatorwp_admin.nonce,
                automation_id: automation_id,
                item_type: item_type,
                type: type,
                position: position
            },
            success: function( response ) {

                // Enable button
                button.prop('disabled', false);
                // Hide spinner
                box.find('.automatorwp-box-spinner').hide();

                if( response.success ) {
                    var new_item = $( response.data.edit_html );

                    // Append the new item
                    new_item.appendTo( items_list );

                    // If sequential enabled, show the item position
                    if( item_type === 'trigger' && $('#sequential').prop('checked') ) {
                        // Update items position
                        automatorwp_update_items_position( items_list );

                        items_list.find('.automatorwp-automation-item:not(.automatorwp-automation-item-filter) .automatorwp-automation-item-position').show();
                    }

                    // Add tags to all tags selectors
                    if( item_type === 'trigger' && response.data.tags_html.length ) {
                        $( response.data.tags_html ).appendTo('.automatorwp-automation-tag-selector');
                    }

                    // Make javascript features work on the new item
                    automatorwp_initialize_form_fields( new_item );

                } else {

                }
            },
            error: function( response ) {

            }
        });
    });

    // -----------------------------------------------
    // Options
    // -----------------------------------------------

    // Click on an option
    $('body').on('click', '.automatorwp-automation-item-label > .automatorwp-option', function(e) {

        var item = $(this).closest('.automatorwp-automation-item');
        var option = $(this).data('option');
        var option_form = item.find('.automatorwp-option-form-container[data-option="' + option + '"]');

        if( option_form.hasClass('automatorwp-option-form-active') ) {

            // Hide this option form
            option_form.removeClass('automatorwp-option-form-active').slideUp('fast');

        } else {

            // Hide any other option form
            item.find('.automatorwp-option-form-active').removeClass('automatorwp-option-form-active').slideUp('fast');

            // Show this option form
            option_form.addClass('automatorwp-option-form-active').slideDown('fast');

        }

    });

    // Save option
    $('body').on('click', '.automatorwp-save-option-form', function(e) {

        var button = $(this);

        if( button.prop('disabled') ) {
            return;
        }

        var item = button.closest('.automatorwp-automation-item');
        var form = button.closest('.automatorwp-option-form-container');
        var id = item.find('input.id').val();
        var item_type = item.hasClass('automatorwp-trigger') ? 'trigger' : 'action';

        // Show spinner
        form.find('.automatorwp-spinner').show();

        // Disable save and cancel button
        button.prop('disabled', true);
        button.next('.automatorwp-cancel-option-form').prop('disabled', true);

        // Get the option form values
        var data = automatorwp_get_option_form_values( form );

        // Append the request data
        data.action = 'automatorwp_update_item_option';
        data.nonce = automatorwp_admin.nonce;
        data.id = id;
        data.item_type = item_type;
        data.option_name = form.data('option');

        $.ajax({
            url: ajaxurl,
            method: 'POST',
            data: data,
            success: function( response ) {

                if( response.success ) {

                    // Hide the option form
                    form.removeClass('automatorwp-option-form-active').slideUp('fast');

                    // Override the item content HTML (used for filters)
                    if( response.data.item_html !== undefined ) {

                        if( item.hasClass('automatorwp-automation-item-filter') && item.data('update-content') === 'true' ) {

                            var item_content = $(response.data.item_html).filter('.automatorwp-automation-item').find('.automatorwp-automation-item-content').html();

                            item.find('.automatorwp-automation-item-content').html( item_content );

                            // Make javascript features work on the new item
                            automatorwp_initialize_form_fields( item );

                            item.data('update-content', 'false');
                        }
                    }

                    // Update the item label
                    item.find('.automatorwp-automation-item-label').html( response.data.edit_html );

                    if( item_type === 'trigger' ) {
                        // Update the option display on tags selector
                        $('.automatorwp-automation-tag-selector optgroup[data-id="' + id + '"]').attr('label', response.data.edit_html );

                        // Update option tags
                        if( response.data.tags_html.length ) {
                            $('.automatorwp-automation-tag-selector optgroup[data-id="' + id + '"]').html( $(response.data.tags_html).html() );

                            // To get the options correctly updated and working is required to destroy all Select2 and reinitialize them
                            $('.automatorwp-automation-tag-selector').each(function() {
                                $(this).automatorwp_select2('destroy');

                                automatorwp_tags_selector( $(this) );
                            });
                        }
                    }

                }

                // Hide the spinner
                form.find('.automatorwp-spinner').hide();

                // Enable save and cancel button
                button.prop('disabled', false);
                button.next('.automatorwp-cancel-option-form').prop('disabled', false);

            },
            error: function( response ) {

            }
        });

    });

    // Cancel option edit
    $('body').on('click', '.automatorwp-cancel-option-form', function(e) {

        // Hide the option form
        $(this).closest('.automatorwp-option-form-container').removeClass('automatorwp-option-form-active').slideUp('fast');

    });

    // On change filter field
    $('body').on('change', '.automatorwp-automation-item-filter .cmb2-id-filter select', function(e) {

        var item = $(this).closest('.automatorwp-automation-item-filter');

        item.data('update-content', 'true' );
    });

    // -----------------------------------------------
    // Options fields
    // -----------------------------------------------

    // Make radios work through javascript
    $('body').on('change', '.automatorwp-option-form input[type="radio"]', function(e) {
        $(this).closest('ul').find('input[type="radio"]:not([value="' + $(this).val() + '"])').prop('checked', false);
    });

    // Fix radio label click
    $('body').on('click', '.automatorwp-option-form input[type="radio"] + label', function(e) {
        e.preventDefault();
        $(this).prev('input').prop('checked', true).trigger('change');
    });

    // Fix checkbox label click
    $('body').on('click', '.automatorwp-option-form input[type="checkbox"] + label', function(e) {
        e.preventDefault();
        $(this).prev('input').prop( 'checked', ( ! $(this).prev('input').prop('checked') ) ).trigger('change');
    });

    // Fix repeatable fields selector
    $('.automatorwp-option-form .cmb-repeat-table').each(function() {
        var item_id = $(this).closest('.automatorwp-automation-item').find('input.id').val();
        var new_id = $(this).attr('id') + '-' + item_id;

        $(this).attr('id', new_id);
        $(this).parent().find('.cmb-add-row-button').attr('data-selector', new_id);
    });

    // Fix group fields selector
    $('.automatorwp-option-form .cmb-repeatable-group').each(function() {
        var item_id = $(this).closest('.automatorwp-automation-item').find('input.id').val();
        var new_id = $(this).attr('id') + '-' + item_id;

        $(this).attr('id', new_id);
        $(this).find('.cmb-add-group-row').attr('data-selector', new_id);
        $(this).find('.cmb-remove-group-row').attr('data-selector', new_id);
    });

    // On add a new group row, reinitialize fields
    $('body').on('cmb2_add_row', '.cmb-repeatable-group', function( e, row, cmb ) {

        // Remove Select2 element
        row.find('.select2').remove();

        // Find all Select2 elements
        var select2_elements = row.find('.select2-hidden-accessible');

        // Reset Select2 data on options
        select2_elements.find('optgroup, option')
            .removeAttr('id')
            .removeAttr('data-select2-id'); // For options and group options, select2 assigns this attribute as id

        // Reset Select2 data on the input element
        select2_elements
            .removeClass('select2-hidden-accessible')
            .removeAttr('id')
            .removeAttr('data-select2-id'); // For fields without id, select2 assigns this attribute as id

        automatorwp_initialize_form_fields( row );
    });

    // -----------------------------------------------
    // Tags
    // -----------------------------------------------

    // Tags Selector Control
    $('.automatorwp-automation-tag-selector').each(function() { automatorwp_tags_selector( $(this) ); });

    // On focus an action option input
    $('body').on('focus', '.automatorwp-action input, .automatorwp-action textarea', function(e) {
        $(this).data('focused', true);
    });

    // On change tag selector
    $('body').on('change', '.automatorwp-automation-tag-selector', function(e) {
        var $this = $(this);
        var input = $this.parent().find( 'input, textarea' );
        var value = $this.val();

        if( value && value.length ) {
            value = '{' + value + '}';

            // Support for wysiwyg field
            if( $this.closest('.cmb-row').hasClass('cmb-type-wysiwyg') ) {

                input = $this.parent().find( 'textarea.wp-editor-area' );

                var editor = window.tinyMCE.get( input.attr('id') );

                if ( editor && ! editor.isHidden() ) {
                    // Insert content to the HTML editor
                    editor.execCommand( 'mceInsertContent', false, value );

                    return;
                } else if ( typeof QTags !== 'undefined' ) {
                    // If quick tags are available, insert the HTML into its content.
                    QTags.insertContent( value );

                    return;
                }
            }

            // if input hasn't been focused yet, then set caret at end
            if( input.data('focused') !== true ) {
                automatorwp_set_caret_at_end( input );
            }

            // Insert content at caret
            automatorwp_insert_at_caret( input, value );

            // Restore tag selector value to allow select again the same option
            $this.val(null).trigger('change');

        }
    });

    // Make tags selector dropdown option groups toggleables
    $('body').on('click', '.automatorwp-tags-select2 .select2-dropdown li[role="group"] > strong', function(e) {
        $(this).next('ul').slideToggle('fast');
    });

    // -----------------------------------------------
    // Taxonomy Selector
    // -----------------------------------------------

    // Change the taxonomy
    $('body').on('change', '.automatorwp-taxonomy-selector select', function(e) {
        var row = $(this).closest('.cmb-row');
        var term_row = row.next('.automatorwp-term-selector');

        // Bail if next field is not a term selector
        if( term_row === undefined ) {
            return;
        }

        var taxonomy = $(this).val();
        var first_change = row.hasClass('is-option-change');

        if( taxonomy === 'any' || taxonomy === '' ) {
            // Hide the term selector
            if( first_change ) {
                term_row.hide();
            } else {
                term_row.slideUp('fast');
            }
        } else {
            var term_selector = term_row.find('select.select2-hidden-accessible');
            var taxonomy_label = automatorwp_get_taxonomy_label( taxonomy );

            if( ! taxonomy_label.length ) {
                taxonomy_label = 'Category';
            }

            // Remove Select2 element
            term_selector.next('.select2').remove();

            // Update the taxonomy and placeholder
            term_selector.data( 'taxonomy', taxonomy );
            term_selector.data( 'placeholder', automatorwp_admin_functions.taxonomy_selector_placeholder_pattern.replace('%s', taxonomy_label.toLowerCase() ) );

            if( ! first_change ) {
                // Update the the term value
                term_selector.val('');
            }

            // Reset the selector
            term_selector.removeAttr('data-select2-id');

            // Init it again
            automatorwp_term_selector( term_selector );

            // Show the term selector
            if( first_change ) {
                term_row.show();
            } else {
                term_row.slideDown('fast');
            }
        }

        row.removeClass('is-option-change');
    });

    // On click on an option, check if form contains the taxonomy selector
    $('body').on('click', '.automatorwp-automation-item-label > .automatorwp-option', function(e) {

        var item = $(this).closest('.automatorwp-automation-item');
        var option = $(this).data('option');
        var option_form = item.find('.automatorwp-option-form-container[data-option="' + option + '"]');
        var taxonomy_selector = option_form.find('.automatorwp-taxonomy-selector');

        if( taxonomy_selector !== undefined ) {
            taxonomy_selector.addClass('is-option-change');
            taxonomy_selector.find('select.select2-hidden-accessible').trigger('change');
        }

    });

    // -----------------------------------------------
    // Selector Custom Input
    // -----------------------------------------------

    // Change the selector
    $('body').on('change', 'select', function(e) {

        var row = $(this).closest('.cmb-row');
        var custom_input_row = row.next('.automatorwp-selector-custom-input');

        // Bail if next field is not a term selector
        if( custom_input_row === undefined ) {
            return;
        }

        var first_change = row.hasClass('is-option-change');

        if( $(this).val() === 'custom' ) {
            // Show the custom input
            if( first_change ) {
                custom_input_row.show();
            } else {
                custom_input_row.slideDown('fast');
            }
        } else {
            // Hide the custom input
            if( first_change ) {
                custom_input_row.hide();
            } else {
                custom_input_row.slideUp('fast');
            }
        }

        row.removeClass('is-option-change');
    });

    // On click on an option, check if form contains a selector custom input
    $('body').on('click', '.automatorwp-automation-item-label > .automatorwp-option', function(e) {

        var item = $(this).closest('.automatorwp-automation-item');
        var option = $(this).data('option');
        var option_form = item.find('.automatorwp-option-form-container[data-option="' + option + '"]');
        var custom_input_row = option_form.find('.automatorwp-selector-custom-input');

        if( custom_input_row !== undefined ) {

            var selector_row = custom_input_row.prev('.cmb-row');

            if( selector_row !== undefined ) {
                selector_row.addClass('is-option-change');
                selector_row.find('select.select2-hidden-accessible').trigger('change');
            }
        }

    });

    // Initial status for filters (where form is always visible)
    $('.automatorwp-selector-custom-input').each(function() {
        var selector_row = $(this).prev('.cmb-row');

        if( selector_row.find('select').val() === 'custom' ) {
            $(this).show();
        }
    });

    // -----------------------------------------------
    // Dialog
    // -----------------------------------------------

    // Dialog cancel button
    $('body').on('click', '.automatorwp-dialog-cancel', function(e) {

        var target = $(this).data('dialog');

        if( target.length ) {
            $('.' + target).dialog('close');
        }
    });

    // -----------------------------------------------
    // Automation type dialog
    // -----------------------------------------------

    // Show automation type dialog on new automation links
    $('body').on('click', 'a[href$="admin.php?page=add_automatorwp_automations"]', function(e) {
        e.preventDefault();

        $('.automatorwp-automation-type-dialog').dialog({
            dialogClass: 'automatorwp-dialog',
            closeText: '',
            show: { effect: 'fadeIn', duration: 200 },
            hide: { effect: 'fadeOut', duration: 200 },
            resizable: false,
            height: 'auto',
            width: 600,
            modal: true,
            draggable: false,
            closeOnEscape: false,
        });

    });

    // Select automation type
    $('body').on('click', '.automatorwp-automation-type-dialog .automatorwp-automation-type', function(e) {
        $('.automatorwp-automation-type-dialog .automatorwp-automation-type-selected').removeClass('automatorwp-automation-type-selected');
        $(this).addClass('automatorwp-automation-type-selected');
    });

    // Automation type dialog confirm button
    $('body').on('click', '.automatorwp-automation-type-dialog .automatorwp-automation-type-dialog-confirm', function(e) {

        var type = 'user';
        var selected = $('.automatorwp-automation-type-dialog .automatorwp-automation-type-selected');

        if( selected.length ) {
            type = selected.data('type');
        }

        var url = window.location.href.split('admin.php')[0];

        // Redirect to the add new automation
        window.location.href = url + 'admin.php?page=add_automatorwp_automations&type=' + type;

    });

    // -----------------------------------------------
    // Automation URL export dialog
    // -----------------------------------------------

    var url_export_id = 0;
    var url_export_url = '';

    // Show automation url export dialog on export links
    $('body').on('click', 'a.automatorwp-url-export-automation', function(e) {
        e.preventDefault();

        url_export_id = automatorwp_get_url_param( $(this).attr('href'), 'id', 0 );
        url_export_url = '';

        // Hide the URL
        $('.automatorwp-automation-url-export-dialog input').val('');
        $('.automatorwp-automation-url-export-dialog .automatorwp-automation-url-export-dialog-url').hide();
        $('.automatorwp-automation-url-export-dialog .automatorwp-automation-url-export-dialog-input .automatorwp-notice-error').hide();

        // Update confirm button label
        $('.automatorwp-automation-url-export-dialog-confirm .automatorwp-automation-url-export-dialog-confirm-default-text').show();
        $('.automatorwp-automation-url-export-dialog-confirm .automatorwp-automation-url-export-dialog-confirm-generating-text').hide();
        $('.automatorwp-automation-url-export-dialog-confirm .automatorwp-automation-url-export-dialog-confirm-success-text').hide();

        $('.automatorwp-automation-url-export-dialog').dialog({
            dialogClass: 'automatorwp-dialog',
            closeText: '',
            show: { effect: 'fadeIn', duration: 200 },
            hide: { effect: 'fadeOut', duration: 200 },
            resizable: false,
            height: 'auto',
            width: 600,
            modal: true,
            draggable: false,
            closeOnEscape: false,
        });

    });

    $('body').on('keypress', '.automatorwp-automation-url-export-dialog-input input', function(e) {

        var keycode = ( e.keyCode ? e.keyCode : e.which );

        if( parseInt( keycode ) === 13 ) {
            $('.automatorwp-automation-url-export-dialog-confirm').trigger('click');
        }
    });

    // Automation url export confirm button
    $('body').on('click', '.automatorwp-automation-url-export-dialog-confirm', function(e) {

        var button = $(this);
        var dialog = button.closest('.automatorwp-automation-url-export-dialog');
        dialog.find('.automatorwp-automation-url-export-dialog-input .automatorwp-notice-error').slideUp('fast');

        // Close dialog if button display the success text
        if( button.find('.automatorwp-automation-url-export-dialog-confirm-success-text').is(":visible") ) {
            dialog.dialog('close');
            return;
        }

        // Bail if button is disabled
        if( button.prop( 'disabled' ) ) {
            return;
        }

        // Bail if no automation ID provided
        if( url_export_id === 0 ) {
            return;
        }

        // Check the URL
        var url = dialog.find('.automatorwp-automation-url-export-dialog-input input').val();

        // Only check url if not is a local or development URL
        if( ! ( url.includes('dev') || url.includes('127.0.0.') || url.includes('localhost') || url.includes(':8888') ) ) {
            if( ! automatorwp_is_valid_url( url ) ) {
                dialog.find('.automatorwp-automation-url-export-dialog-input .automatorwp-notice-error').slideDown('fast');
                return;
            }
        }

        if( ! url.startsWith('http') ) {
            url = 'https://' + url;
        }

        button.prop( 'disabled', true );

        // Update confirm button label
        button.find('.automatorwp-automation-url-export-dialog-confirm-default-text').hide();
        button.find('.automatorwp-automation-url-export-dialog-confirm-generating-text').show();
        button.find('.automatorwp-automation-url-export-dialog-confirm-success-text').hide();

        $.ajax({
            url: ajaxurl,
            method: 'POST',
            data: {
                action: 'automatorwp_get_automation_export_url',
                nonce: automatorwp_admin.nonce,
                automation_id: url_export_id,
            },
            success: function( response ) {

                // Update the URL
                if( ! url.endsWith('/') ) {
                    url += '/';
                }

                url_export_url = response.data;

                url += url_export_url;

                var url_input = dialog.find('.automatorwp-automation-url-export-dialog-url input');

                url_input.val(url);

                // Show the URL input
                dialog.find('.automatorwp-automation-url-export-dialog-url').slideDown('fast', function() {
                    url_input.trigger('focus');
                    url_input.trigger('select');
                    url_input[0].setSelectionRange(0, 99999);
                });

                button.prop( 'disabled', false );

                // Update confirm button label
                button.find('.automatorwp-automation-url-export-dialog-confirm-default-text').hide();
                button.find('.automatorwp-automation-url-export-dialog-confirm-generating-text').hide();
                button.find('.automatorwp-automation-url-export-dialog-confirm-success-text').show();

            },
            error: function( response ) {

                button.prop( 'disabled', false );

                // Update confirm button label
                button.find('.automatorwp-automation-url-export-dialog-confirm-default-text').show();
                button.find('.automatorwp-automation-url-export-dialog-confirm-generating-text').hide();
                button.find('.automatorwp-automation-url-export-dialog-confirm-success-text').hide();

            }
        });

    });

    // Force select on click on the URL input
    $('body').on('click', '.automatorwp-automation-url-export-dialog-url input', function(e) {
        $(this).trigger('select');
        $(this)[0].setSelectionRange(0, 99999); // For mobile devices
    });

    // Copy URL
    $('body').on('click', '.automatorwp-automation-url-export-dialog-url-copy', function(e) {
        var input = $('.automatorwp-automation-url-export-dialog-url input');

        input.trigger('select');
        input[0].setSelectionRange(0, 99999); // For mobile devices

        document.execCommand("copy");

        $(this).find('.automatorwp-automation-url-export-dialog-url-copy-text-copy').hide();
        $(this).find('.automatorwp-automation-url-export-dialog-url-copy-text-copied').show();
    });

    // -----------------------------------------------
    // All users automation
    // -----------------------------------------------

    // Toggle visibility on schedule run checkbox change
    $('body').on('change', '#automatorwp-automations-execution-options input#schedule_run', function(e) {
        var form = $(this).closest('.cmb2-metabox');
        var target = form.find('.cmb2-id-schedule-run-datetime');

        if( $(this).prop('checked') ) {
            // Force uncheck recurring run checkbox
            if( form.find('.cmb2-id-recurring-run input').prop('checked') ) {
                form.find('.cmb2-id-recurring-run input').prop( 'checked', false ).trigger('change');
            }

            target.slideDown('fast');
        } else {
            target.slideUp('fast');
        }
    });

    if( ! $('#automatorwp-automations-execution-options input#schedule_run').prop('checked') ) {
        $('#automatorwp-automations-execution-options .cmb2-id-schedule-run-datetime').hide();
    }

    // Toggle visibility on recurring run checkbox change
    $('body').on('change', '#automatorwp-automations-execution-options input#recurring_run', function(e) {
        var form = $(this).closest('.cmb2-metabox');
        var target = form.find('.automatorwp-recurring-run-day-label, .cmb2-id-recurring-run-period, .cmb2-id-recurring-run-time');

        form.find('.cmb2-id-recurring-run-period select').trigger('change');

        if( $(this).prop('checked') ) {
            // Force uncheck schedule run checkbox
            if( form.find('.cmb2-id-schedule-run input').prop('checked') ) {
                form.find('.cmb2-id-schedule-run input').prop( 'checked', false ).trigger('change');
            }

            target.slideDown('fast');
        } else {
            target.slideUp('fast');
        }
    });

    if( ! $('#automatorwp-automations-execution-options input#recurring_run').prop('checked') ) {
        $('#automatorwp-automations-execution-options').find('.automatorwp-recurring-run-day-label, .cmb2-id-recurring-run-period, .cmb2-id-recurring-run-time').hide();
    }

    // Toggle visibility on recurring run period change
    $('body').on('change', '#automatorwp-automations-execution-options select#recurring_run_period', function(e) {
        var form = $(this).closest('.cmb2-metabox');
        var target = form.find('.cmb2-id-recurring-run-day');

        // Bail if recurring run not checked
        if( ! form.find('input#recurring_run').prop('checked') ) {
            target.slideUp('fast');
            return;
        }

        if( $(this).val() !== 'day' ) {
            target.slideDown('fast');
        } else {
            target.slideUp('fast');
        }

        // Update maximum allowed values for the day input
        var day_input = form.find('.cmb2-id-recurring-run-day input#recurring_run_day')
        var max_day = 365;

        switch( $(this).val() ) {
            case 'week':
                max_day = 7;
                break;
            case 'month':
                max_day = 31;
                break;
            case 'year':
            default:
                max_day = 365;
                break;
        }

        if( parseInt( day_input.val() ) > max_day ) {
            day_input.val( max_day );
        }

        day_input.attr( 'max', max_day );
    });

    if( $('#automatorwp-automations-execution-options select#recurring_run_period').val() === 'day' ) {
        $('#automatorwp-automations-execution-options .cmb2-id-recurring-run-day').hide();
    }

    $('#automatorwp-automations-execution-options select#recurring_run_period').trigger('change');

    // Run automation button
    $('body').on('click', '.automatorwp-run-automation button', function(e) {

        var $this = $(this);

        if ( $this.prop('disabled') ) {
            return;
        }

        var automation_id = $('input#object_id').val();
        var automation_type = $('select#type').val();
        var items_per_loop = 0;

        if( automation_type === 'all-users' ) {
            items_per_loop = $('input#users_per_loop').val();
        } else if( automation_type === 'all-posts' ) {
            items_per_loop = $('input#posts_per_loop').val();
        }

        // Disable the button and switch labels
        $this.prop('disabled', true);
        $this.find('.automatorwp-run-automation-run-label').hide();
        $this.find('.automatorwp-run-automation-running-label').show();
        $('.automatorwp-run-automation').addClass('automatorwp-is-running');

        // Show the cancel button
        $('.automatorwp-cancel-automation-run').show();
        // Update the cancel automation run flag
        automatorwp_cancel_automation_run = false;

        // Remove any error notice
        $this.closest('#major-publishing-actions').find('.automatorwp-notice-error').remove();

        // Reset the progress
        $('.automatorwp-run-automation-progress').removeClass('automatorwp-run-automation-progress-completed');
        $('.automatorwp-run-automation-progress .automatorwp-run-automation-progress-current-progress').css({ width: '0%' });
        $('.automatorwp-run-automation-progress-text').text('0/0');

        // Show the progress
        $('.automatorwp-run-automation-progress').slideDown('fast');

        automatorwp_run_automation( automation_id, items_per_loop );
    });

    if( $('.automatorwp-run-automation.automatorwp-is-running').length ) {
        var automation_id = $('input#object_id').val();
        var automation_type = $('select#type').val();
        var items_per_loop = 0;

        if( automation_type === 'all-users' ) {
            items_per_loop = $('input#users_per_loop').val();
        } else if( automation_type === 'all-posts' ) {
            items_per_loop = $('input#posts_per_loop').val();
        }

        automatorwp_run_automation( automation_id, items_per_loop );
    }

    // Cancel automation run button
    $('body').on('click', '.automatorwp-cancel-automation-run button', function(e) {

        var $this = $(this);

        if ( $this.prop('disabled') ) {
            return;
        }

        // Disable the button and switch labels
        $this.prop('disabled', true);
        $this.find('.automatorwp-cancel-automation-run-cancel-label').hide();
        $this.find('.automatorwp-cancel-automation-run-cancelling-label').show();

        automatorwp_cancel_automation_run = true;

    });

})( jQuery );

/**
 * Update elements positions
 *
 * @since 1.0.0
 *
 * @param {Object} element
 */
function automatorwp_update_items_position( element ) {

    var $ = $ || jQuery;

    var items = element.find('.automatorwp-automation-item');
    var items_order = {};
    var items_order_for_tags = [];
    var current_position = 0;

    // Loop through each item
    items.each(function( index, value ) {

        // Write it's current position to our hidden input value
        $(this).find('input.position').val( index );

        if( ! $(this).hasClass('automatorwp-automation-item-filter') ) {
            // Update item position
            $(this).find('.automatorwp-automation-item-position').html( ( current_position + 1 ) + '.');

            current_position++;
        }

        items_order[$(this).find('input.id').val()] = index;

        // Setup a custom array for tags
        items_order_for_tags.push( $(this).find('input.id').val() );

    });

    if( Object.entries(items_order).length ) {

        var item_type = element.hasClass('automatorwp-triggers') ? 'trigger' : 'action';

        // Update automation items order trough ajax
        $.ajax({
            url: ajaxurl,
            method: 'POST',
            data: {
                action: 'automatorwp_update_automation_items_order',
                nonce: automatorwp_admin.nonce,
                items_order: items_order,
                item_type: item_type,
            },
            success: function( response ) {

                if( response.success ) {

                } else {

                }
            },
            error: function( response ) {

            }
        });

        if( item_type === 'trigger' ) {

            // Update tags selector optgroups order
            $.each(items_order_for_tags, function( index, id ) {

                $('.automatorwp-automation-tag-selector').each(function() {
                    $(this).find('optgroup[data-id="' + id + '"]').appendTo(this);
                });

            });
        }

    }

}

/**
 * Turns the given element into a tags selector
 *
 * @since 1.0.0
 *
 * @param {Object} element
 */
function automatorwp_tags_selector( element ) {

    var $ = $ || jQuery;

    element.automatorwp_select2({
        theme: 'default automatorwp-select2 automatorwp-tags-select2',
        escapeMarkup: function(markup) { return markup; },
        templateResult: function(data) {
            // Custom template result to allow HTML markup on select items
            var text = data.text;

            if( data.element !== undefined ) {
                // Check if option has something on label attribute
                var label = $(data.element).attr('label');

                if( label !== undefined && label.length ) {
                    text = label;
                }

                // Check if option has something on data-text attribute
                var custom_text = $(data.element).data('text');

                if( custom_text !== undefined && custom_text.length ) {
                    text = custom_text;
                }

                // Check if option has an icon
                var icon = $(data.element).data('icon');

                if( icon !== undefined ) {
                    text = '<img src="' + icon + '" />' + text;
                }

            }

            return text;
        },
        matcher: automatorwp_select2_optgroup_matcher,
        dropdownPosition: 'below',
    });

    element.val(null).trigger('change');

}

/**
 * Turns the given element into a filter selector
 *
 * @since 1.0.0
 *
 * @param {Object} element
 */
function automatorwp_filter_selector( element ) {

    var $ = $ || jQuery;

    element.automatorwp_select2({
        theme: 'default automatorwp-select2 automatorwp-filter-select2',
        escapeMarkup: function(markup) { return markup; },
        templateResult: function(data) {
            // Custom template result to allow HTML markup on select items
            var text = data.text;

            if( data.element !== undefined ) {
                // Check if option has something on label attribute
                var label = $(data.element).attr('label');

                if( label !== undefined && label.length ) {
                    text = label;
                }

                // Check if option has something on data-text attribute
                var custom_text = $(data.element).data('text');

                if( custom_text !== undefined && custom_text.length ) {
                    text = custom_text;
                }

                // Check if option has an icon
                var icon = $(data.element).data('icon');

                if( icon !== undefined ) {
                    text = '<img src="' + icon + '" />' + text;
                }

            }

            return text;
        },
        matcher: automatorwp_select2_optgroup_matcher,
    });

}

/**
 * Get form fields values
 *
 * @since 1.0.0
 *
 * @param {Object} form
 *
 * @return {Object}
 */
function automatorwp_get_option_form_values( form ) {

    var $ = $ || jQuery;
    var data = {};

    form.find('input:not([type="button"]):not([type="submit"]), select, textarea').each(function() {

        var option = $(this).data('option');
        var value = $(this).val();

        // Skip pattern fields
        if( $(this).closest('.cmb-row.empty-row').length ) {
            return;
        }

        if( $(this).attr('type') === 'checkbox' || $(this).attr('type') === 'radio' ) {

            if( $(this).closest('.cmb2-checkbox-list').length ) {
                // Multicheck
                value = [];
                $(this).closest('.cmb2-checkbox-list').find('input:checked').each(function() {
                    value.push($(this).val());
                });
            } else if( ! $(this).prop('checked') ) {
                // Checkbox and radio
                return;
            }

        } else if( $(this).closest('.cmb-row.cmb-type-text-datetime-timestamp').length ) {
            // Datetime Picker

            value = {
                'date': $(this).closest('.cmb-row.cmb-type-text-datetime-timestamp').find('input.cmb2-datepicker').val(),
                'time': $(this).closest('.cmb-row.cmb-type-text-datetime-timestamp').find('input.cmb2-timepicker').val(),
            };

        } else if( $(this).hasClass('wp-editor-area') ) {
            // Wysiwyg

            option = $(this).attr('name');

            // Force save tinyMCE editor to get textarea value updated
            if( window.tinyMCE.editors.length && window.tinyMCE.editors[$(this).attr('id')] ) {
                window.tinyMCE.editors[$(this).attr('id')].save();
                value = $(this).val();
            }
        }

        if( option !== undefined ) {

            // Repeatable and group fields
            if( option.indexOf('[') !== -1 ) {
                var parts = option.split('[');
                option = parts[0];

                if( data[option] === undefined ) {
                    data[option] = []
                }

                if( parts[1] !== ']' ) {

                    var option_key = parts[1].replace(']', '');
                    var index = $(this).closest('.cmb-repeatable-grouping').data('iterator');

                    if( data[option][index] === undefined ) {
                        data[option][index] = {}
                    }

                    // Group field
                    data[option][index][option_key] = value;
                } else {
                    // Repeatable
                    data[option].push(value);
                }

            } else {
                // Single option value
                data[option] = value;
            }
        }
    });

    return data;

}

/**
 * Initialize form fields
 *
 * @since 1.0.0
 *
 * @param {Object} form
 */
function automatorwp_initialize_form_fields( form ) {

    var $ = $ || jQuery;

    // Selector Control
    form.find('.automatorwp-selector select').each(function() { automatorwp_selector( $(this) ); });

    // Post Selector Control
    form.find('.automatorwp-post-selector select').each(function() { automatorwp_post_selector( $(this) ); });

    // Term Selector Control
    form.find('.automatorwp-term-selector select').each(function() { automatorwp_term_selector( $(this) ); });

    // Taxonomy Selector Control
    form.find('.automatorwp-taxonomy-selector select').each(function() { automatorwp_selector( $(this) ); });

    // User Selector Control
    form.find('.automatorwp-user-selector select').each(function() { automatorwp_user_selector( $(this) ); });

    // Object Selector Control
    form.find('.automatorwp-object-selector select').each(function() { automatorwp_object_selector( $(this) ); });

    // Ajax Selector Control
    form.find('.automatorwp-ajax-selector select').each(function() { automatorwp_ajax_selector( $(this) ); });

    // Tags selector
    form.find('.automatorwp-automation-tag-selector').each(function() { automatorwp_tags_selector( $(this) ); });

    // Filter selector
    form.find('.automatorwp-filter-selector select').each(function() { automatorwp_filter_selector( $(this) ); });

    // Fix repeatable fields selector
    form.find('.cmb-repeat-table').each(function() {
        var item_id = $(this).closest('.automatorwp-automation-item').find('input.id').val();
        var new_id = $(this).attr('id') + '-' + item_id;

        $(this).attr('id', new_id);
        $(this).parent().find('.cmb-add-row-button').attr('data-selector', new_id);
    });

    // Fix group fields selector
    form.find('.cmb-repeatable-group').each(function() {
        var item_id = $(this).closest('.automatorwp-automation-item').find('input.id').val();
        var new_id = $(this).attr('id') + '-' + item_id;

        $(this).attr('id', new_id);
        $(this).find('.cmb-add-group-row').attr('data-selector', new_id);
        $(this).find('.cmb-remove-group-row').attr('data-selector', new_id);
    });

    // Init CMB2 callbacks
    form
        // Repeatable content
        .on( 'click', '.cmb-add-group-row', function(e) {
            window.CMB2.addGroupRow.apply(this, [e] );
        })
        .on( 'click', '.cmb-add-row-button', function(e) {
            window.CMB2.addAjaxRow.apply(this, [e] );
        })
        .on( 'click', '.cmb-remove-group-row', function(e) {
            window.CMB2.removeGroupRow.apply(this, [e] );
        })
        .on( 'click', '.cmb-remove-row-button', function(e) {
            window.CMB2.removeAjaxRow.apply(this, [e] );
        })
        // Reset titles when removing a row
        .on( 'cmb2_remove_row', '.cmb-repeatable-group', function(e) {
            window.CMB2.resetTitlesAndIterator.apply(this, [e] );
        })
        .on( 'click', '.cmbhandle, .cmbhandle + .cmbhandle-title', function(e) {
            window.CMB2.toggleHandle.apply(this, [e] );
        });

    // Init time/date/color pickers
    window.CMB2.initPickers( form.find('input[type="text"].cmb2-timepicker'), form.find('input[type="text"].cmb2-datepicker'), form.find('input[type="text"].cmb2-colorpicker') );

    // Init wysiwyg editors
    form.find( '.cmb-type-wysiwyg' ).each( function() {

        var $this = $(this);

        var textarea_id = $this.find('textarea').attr('id');
        var textarea = $this.find('textarea').clone();

        // Remove CMB2 HTML and add a single textarea to be converted as editor
        $this.find('.wp-editor-wrap').remove();
        $this.find('.cmb-td').append(textarea);

        automatorwp_initialize_wysiwyg_editor( textarea_id );

    } );

    if ( 'undefined' !== typeof window.QTags ) {
        window.QTags._buttonsInit();
    }

}

/**
 * Initialize a wysiwyg editor
 *
 * @since 1.0.0
 *
 * @param {string} textarea_id
 */
function automatorwp_initialize_wysiwyg_editor( textarea_id ) {

    if( window.tinyMCE.editors.length && window.tinyMCE.editors[textarea_id] ) {
        window.tinyMCE.editors[textarea_id].remove();
    }

    wp.editor.initialize( textarea_id, {
        mediaButtons: true,
        tinymce: {
            wpautop: true,
            toolbar1: 'formatselect bold italic bullist numlist blockquote alignleft aligncenter alignright link unlink wp_more fullscreen wp_adv',
            toolbar2: 'strikethrough hr forecolor pastetext removeformat charmap outdent indent undo redo wp_help'
        },
        quicktags: {
            buttons: 'strong,em,link,block,del,ins,img,ul,ol,li,,code,more,close'
        }
    });

}

var automatorwp_original_automation_status = '';
var automatorwp_cancel_automation_run = false;

/**
 * Run an automation through ajax
 *
 * @since 1.0.0
 *
 * @param {int} automation_id
 * @param {int} items_per_loop
 */
function automatorwp_run_automation( automation_id, items_per_loop ) {

    var $ = $ || jQuery;

    if( automatorwp_original_automation_status === '' ) {
        automatorwp_original_automation_status = $('select#status').val();

        if( automatorwp_original_automation_status === 'in-progress' ) {
            automatorwp_original_automation_status = $('.automatorwp-run-automation').data('original-status');
        }

        // Switch status to in-progress
        $('select#status').val('in-progress').trigger('change');
        $('#cmb-field-js-controls-status-value .cmb2-id-status').html($('select#status option[value="in-progress"]').html());
    }

    $.ajax({
        url: ajaxurl,
        method: 'POST',
        data: {
            action: 'automatorwp_run_automation',
            nonce: automatorwp_admin.nonce,
            automation_id: automation_id,
            items_per_loop: items_per_loop,
        },
        success: function( response ) {

            if( response.success ) {

                if( automatorwp_cancel_automation_run === true ) {

                    // Send an ajax request to cancel run
                    $.ajax({
                        url: ajaxurl,
                        method: 'POST',
                        data: {
                            action: 'automatorwp_cancel_automation_run',
                            nonce: automatorwp_admin.nonce,
                            automation_id: automation_id,
                        },
                        success: function( response ) {
                            // Show cancel done text
                            $('.automatorwp-cancel-automation-run button .automatorwp-cancel-automation-run-cancelling-label').hide();
                            $('.automatorwp-cancel-automation-run button .automatorwp-cancel-automation-run-done-label').show();

                            // Update the cancel automation run flag
                            automatorwp_cancel_automation_run = false;

                            setTimeout(function() {
                                // Restore the run automation elements
                                automatorwp_restore_run_automation_elements( response );
                            }, 2000);
                        },
                        error: function( response ) {
                            // Restore the run automation elements
                            automatorwp_restore_run_automation_elements( response );
                        }
                    });

                    return;
                }

                // Update progress
                $('.automatorwp-run-automation-progress .automatorwp-run-automation-progress-current-progress').css({ width: response.data.percentage + '%' });
                $('.automatorwp-run-automation-progress-text').text(response.data.processed + '/' + response.data.count);

                if( response.data.percentage === 100 ) {
                    $('.automatorwp-run-automation-progress').addClass('automatorwp-run-automation-progress-completed');
                }

                if( response.data.run_again ) {
                    // Get the details
                    automatorwp_run_automation( automation_id, items_per_loop );
                } else {

                    // Show run automation done text
                    $('.automatorwp-run-automation button .automatorwp-run-automation-running-label').hide();
                    $('.automatorwp-run-automation button .automatorwp-run-automation-done-label').show();

                    // Hide the cancel button
                    $('.automatorwp-cancel-automation-run').hide();

                    setTimeout(function() {
                        // Restore the run automation elements
                        automatorwp_restore_run_automation_elements( response );
                    }, 2000);
                }

            } else {
                // Restore the run automation elements
                automatorwp_restore_run_automation_elements( response );
            }
        },
        error: function( response ) {
            // Restore the run automation elements
            automatorwp_restore_run_automation_elements( response );
        }
    });

}

/**
 * Helper fuction to restore the elements disabled or hidden during the run automation process
 *
 * @since 1.0.0
 *
 * @param {Object} response
 */
function automatorwp_restore_run_automation_elements( response ) {

    var $ = $ || jQuery;

    // Enable run automation button, switch labels and restore status
    $('.automatorwp-run-automation button').prop('disabled', false);
    $('.automatorwp-run-automation button .automatorwp-run-automation-run-label').show();
    $('.automatorwp-run-automation button .automatorwp-run-automation-running-label').hide();
    $('.automatorwp-run-automation button .automatorwp-run-automation-done-label').hide();
    $('.automatorwp-run-automation').removeClass('automatorwp-is-running');
    $('select#status').val(automatorwp_original_automation_status).trigger('change');
    $('#cmb-field-js-controls-status-value .cmb2-id-status').html($('select#status option[value="' + automatorwp_original_automation_status + '"]').html());

    // Hide the progress
    $('.automatorwp-run-automation-progress').slideUp('fast');

    // Restore the cancel button
    $('.automatorwp-cancel-automation-run').hide();
    $('.automatorwp-cancel-automation-run button').prop('disabled', false);
    $('.automatorwp-cancel-automation-run button .automatorwp-cancel-automation-run-cancel-label').show();
    $('.automatorwp-cancel-automation-run button .automatorwp-cancel-automation-run-cancelling-label').hide();
    $('.automatorwp-cancel-automation-run button .automatorwp-cancel-automation-run-done-label').hide();

    // Update the cancel automation run flag
    automatorwp_cancel_automation_run = false;

    // Show a message if required
    if( response !== undefined && response.data !== undefined && response.data.message !== undefined ) {
        $('.automatorwp-run-automation button').closest('#major-publishing-actions').append('<div class="automatorwp-notice-error" style="display: none;">' + response.data.message + '</div>');
        $('.automatorwp-run-automation button').closest('#major-publishing-actions').find('.automatorwp-notice-error').slideDown('fast');
    }

}