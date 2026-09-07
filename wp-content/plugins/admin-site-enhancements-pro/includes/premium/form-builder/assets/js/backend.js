var formAdmin = formAdmin || {};

(function ($) {
    'use strict';
    let $buildForm = $('#fb-fields-form'),
        $formMeta = $('#fb-meta-form'),
        $formSettings = $('#fb-settings-form'),
        $styleSettings = $('#fb-style-form'),
        copyHelper = false,
        fieldsUpdated = 0;
    var isCheckedField = false;

    formAdmin = {
        init: function () {
            if ($formSettings.length > 0) {
                this.initFormSettings();

            } else if ($styleSettings.length > 0) {
                this.initStyleSettings();

            } else if ($buildForm.length > 0) {
                $('.formbuilder-ajax-udpate-button').on('click', formAdmin.submitBuild);
                formAdmin.ensureWebhookKeysForAllFields();
                formAdmin.initConditionalLogicBuilder();

            } else {
                this.initOtherSettings();
            }

            formAdmin.liveChanges();

            formAdmin.setupFieldOptionSorting($('.fb-option-list'));

            formAdmin.initBulkOptionsOverlay();

            formAdmin.initNewFormModal();

            $(document).find('.fb-color-picker').not('.fb-progress-base-color').wpColorPicker();
            formAdmin.initProgressBaseColorPicker();

            $(document).on('click', '#fb-fields-tabs a', formAdmin.clickNewTab);
            $(document).on('input', '.fb-search-fields-input', formAdmin.searchContent);
            $(document).on('click', '.fb-settings-tab a', formAdmin.clickNewTabSettings);

            /* Image */
            $(document).on('click', '.fb-image-preview .fb-choose-image', formAdmin.addImage);
            $(document).on('click', '.fb-image-preview .fb-remove-image', formAdmin.removeImage);

            /* Add field attr to form in Settings page */
            $(document).on('click', '.fb-add-field-attr-to-form li', formAdmin.addFieldAttrToForm);

            /* Open/Close embed popup */
            $(document).on('click', '.fb-embed-button', function () {
                $('#fb-shortcode-form-modal').addClass('fb-open');
            });

            $(document).on('click', '.formbuilder-close-form-modal', function () {
                $('#fb-shortcode-form-modal').removeClass('fb-open');
            });

            $(document).on('change', '.fb-fields-type-time .default-value-field', formAdmin.addTimeDefaultValue);
            $(document).on('change', '.fb-fields-type-time .min-value-field, .fb-fields-type-time .max-value-field, .fb-fields-type-time .fb-default-value-field', formAdmin.validateTimeValue);

            $('.fb-fields-type-date .fb-default-value-field').datepicker({
                changeMonth: true,
                changeYear: true,
                yearRange: 'c-100:c+20',
            });

            document.addEventListener(
                "formbuilder_added_field", (e) => {
                    if (e.hfType == 'date') {
                        $(document).find('.fb-fields-type-date .fb-default-value-field').datepicker({
                            changeMonth: true,
                            changeYear: true,
                            yearRange: 'c-100:c+20',
                        });
                    }
                }, false,
            );
        },

        /**
         * Init solid-only Base Color picker for multi-step progress (Form tab).
         */
        initProgressBaseColorPicker: function () {
            var $input = $('#fb-progress-base-color');

            if (!$input.length || typeof $.fn.wpColorPicker !== 'function') {
                return;
            }

            if ($input.hasClass('wp-color-picker') || $input.parent().hasClass('wp-picker-input-wrap')) {
                try {
                    $input.wpColorPicker('destroy');
                } catch (e) {
                    // Ignore destroy errors on partially initialized pickers.
                }
            }

            $input.wpColorPicker({
                defaultColor: '#333333',
                palettes: [
                    '#f44336', '#e91e63', '#9c27b0', '#3f51b5',
                    '#2196f3', '#00bcd4', '#4caf50', '#cddc39',
                    '#ff9800', '#795548', '#9e9e9e', '#333333'
                ]
            });
        },

        clickNewTab: function () {
            var href = $(this).attr('href'),
                $link = $(this);
            if (typeof href === 'undefined') {
                return false;
            }

            $link.closest('li').addClass('fb-active-tab').siblings('li').removeClass('fb-active-tab');
            $link.closest('.fb-fields-container').find('.fb-fields-panel').hide();
            $(href).show();
            return false;
        },

        searchContent: function () {
            $('.fields-list-accordion').addClass('search-is-filtering');
            
            var i,
                searchText = $(this).val().toLowerCase(),
                toSearch = $(this).attr('data-tosearch'),
                $items = $('.' + toSearch);

            $items.each(function () {
                if ($(this).attr('data-field-name').toLowerCase().indexOf(searchText) > -1) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });

            // Restore all results when the x button on search input field is clicked. 
            // The click triggers a 'search' event we're listening to below
            if ( searchText.length === 0 ) {
                $('.fields-list-accordion').removeClass('search-is-filtering');
            }
        },

        clickNewTabSettings: function () {
            var id = this.getAttribute('href'),
                $link = $(this);

            if (typeof id === 'undefined') {
                return false;
            }

            $link.closest('li').addClass('fb-active').siblings('li').removeClass('fb-active');
            $(id).removeClass('fb-hidden').siblings().addClass('fb-hidden');
            return false;
        },

        addImage: function (e) {
            e.preventDefault();
            const imagePreview = $(this).closest('.fb-image-preview');
            const fileFrame = wp.media({
                multiple: false,
                library: {
                    type: ['image']
                }
            });

            fileFrame.on('select', function () {
                const attachment = fileFrame.state().get('selection').first().toJSON();
                imagePreview.find('img').attr('src', attachment.url);
                imagePreview.find('input.fb-image-id').val(attachment.id);
                imagePreview.find('.fb-image-preview-wrap').removeClass('fb-hidden');
                imagePreview.find('.fb-choose-image').addClass('fb-hidden');

                const frontImagePreview = imagePreview.find('input.fb-image-id').attr('id');
                $('.' + frontImagePreview).append('<img src="' + attachment.url + '"/>');
                $('.' + frontImagePreview).find('.fb-no-image-field').addClass('fb-hidden');
            });
            fileFrame.open();
        },

        removeImage: function (e) {
            const imagePreview = $(this).closest('.fb-image-preview');
            e.preventDefault();
            imagePreview.find('img').attr('src', '');
            imagePreview.find('.fb-image-preview-wrap').addClass('fb-hidden');
            imagePreview.find('.fb-choose-image').removeClass('fb-hidden');
            imagePreview.find('input.fb-image-id').val('');

            const frontImagePreview = imagePreview.find('input.fb-image-id').attr('id');
            $('.' + frontImagePreview).find('.fb-no-image-field').removeClass('fb-hidden');
            $('.' + frontImagePreview).find('img').remove();
        },

        addFieldAttrToForm: function (e) {
            const fieldId = $(this).attr('data-value');
            const inputChange = $(this).closest('.fb-form-row').find('input');
            const textAreaChange = $(this).closest('.fb-form-row').find('textarea');

            if (fieldId && inputChange.length > 0) {
                inputChange.val(inputChange.val() + ' ' + fieldId);
            }

            if (fieldId && textAreaChange.length > 0) {
                textAreaChange.val(textAreaChange.val() + ' ' + fieldId);
            }
        },

        submitBuild: function (e) {
            e.preventDefault();
            var $thisEle = this;

            // Make sure all webhook keys are populated in the UI before saving.
            formAdmin.ensureWebhookKeysForAllFields();

            formAdmin.preFormSave(this);
            /*
            var fieldsData = $buildForm.serializeArray(); 
            var settingsData = $formMeta.serializeArray(); 

            var formbuilder_fields = {};
            $.each(fieldsData, function () {
                formbuilder_fields[this.name] = this.value;
            });

            var formbuilder_settings = {};
            $.each(settingsData, function () {
                formbuilder_settings[this.name] = this.value;
            });
            */
            var formbuilder_fields = JSON.stringify($buildForm.serializeArray());
            var formbuilder_settings = JSON.stringify($formMeta.serializeArray());

            jQuery.ajax({
                type: 'POST',
                url: ajaxurl,
                data: {
                    action: 'formbuilder_update_form',
                    formbuilder_fields: formbuilder_fields,
                    formbuilder_settings: formbuilder_settings,
                    nonce: formbuilder_backend_js.nonce
                },
                success: function (msg) {
                    formAdmin.afterFormSave($thisEle);
                    // var $postStuff = document.getElementById('fb-form-panel');
                    // var $html = document.createElement('div');
                    // $html.setAttribute('class', 'fb-updated-info');
                    // $html.innerHTML = msg;
                    // $postStuff.insertBefore($html, $postStuff.firstChild);
                }
            });
        },

        addImageToOption: function (e) {
            e.preventDefault();
            const imagePreview = e.target.closest('li');
            const fileFrame = wp.media({
                multiple: false,
                library: {
                    type: ['image']
                }
            });

            fileFrame.on('select', function () {
                const attachment = fileFrame.state().get('selection').first().toJSON();
                const $imagePreview = $(imagePreview);
                $imagePreview.find('.fb-is-image-holder').html('<img src="' + attachment.url + '"/>');
                $imagePreview.find('.fb-is-image-preview-box').addClass('fb-image-added');

                $imagePreview.find('input.fb-image-id').val(attachment.id).trigger('change');
                var fieldId = $imagePreview.closest('.fb-fields-settings').data('fid');
                formAdmin.resetDisplayedOpts(fieldId);
            });
            fileFrame.open();
        },

        removeImageFromOption: function (e) {
            var $this = $(this),
                previewWrapper = $this.closest('li');
            e.preventDefault();
            e.stopPropagation();

            previewWrapper.find('.fb-is-image-holder').html('');
            previewWrapper.find('.fb-is-image-preview-box').removeClass('fb-image-added');
            previewWrapper.find('input.fb-image-id').val('').trigger('change');
            var fieldId = previewWrapper.closest('.fb-fields-settings').data('fid');
            formAdmin.resetDisplayedOpts(fieldId);
        },

        liveChanges: function () {
            $('#fb-meta-panel').on('input', '[data-changeme]', formAdmin.liveChangesInput);
            $('#fb-meta-panel').on('change', 'select[name="submit_btn_alignment"]', formAdmin.liveChangeButtonPosition);

            // $buildForm.on('input, change', '[data-changeme]', formAdmin.liveChangesInput); // Original. No live update for keyboard input.
            $buildForm.on('change', 'select[data-changeme]', formAdmin.liveChangesInput);
            $buildForm.on('input', '[data-changeme]', formAdmin.liveChangesInput); // Keyboard, paste, IME — live preview (replaces keyup-only).
            $(document).on('input', '.fb-fields-settings textarea[name^="field_options[name_"]', formAdmin.maybeAutofillWebhookKeyFromLabel);

            $buildForm.on('change', 'input.fb-form-field-required', formAdmin.markRequired);

            $buildForm.on('click', '.fb-add-option', formAdmin.addFieldOption);

            // Default, row, column options in choice / matrix fields
            $buildForm.on('input', '.fb-option-list-type-default .fb-single-option input[type="text"]', formAdmin.resetOptOnChange);
            $buildForm.on('input', '.fb-option-list-type-rows .fb-single-option input[type="text"]', formAdmin.resetMatrixOptOnChange);
            $buildForm.on('input', '.fb-option-list-type-columns .fb-single-option input[type="text"]', formAdmin.resetMatrixOptOnChange);

            $buildForm.on('mousedown', '.fb-single-option input[type=radio]', formAdmin.maybeUncheckRadio);
            $buildForm.on('click', '.fb-single-option .fb-choice-input', formAdmin.resetOptOnChange);
            $buildForm.on('change', '.fb-image-id', formAdmin.resetOptOnChange);

            $buildForm.on('click', '.fb-single-option a[data-removeid]', formAdmin.deleteFieldOption);

            $buildForm.on('click', '.fb-is-image-preview-box', formAdmin.addImageToOption);
            $buildForm.on('click', '.fb-is-remove-image', formAdmin.removeImageFromOption);

            $buildForm.on('input', '[data-changeheight]', formAdmin.liveChangeHeight);
            $buildForm.on('input', '[data-changerows]', formAdmin.liveChangeRows);
            $buildForm.on('input', '[data-changestars]', formAdmin.liveChangeStars);

            $buildForm.on('change', 'select[name^="field_options[label_position"]', formAdmin.liveChangeLabelPosition);
            $buildForm.on('change', 'select[name^="field_options[label_alignment"]', formAdmin.liveChangeLabelAlignment);

            $buildForm.on('change', 'select[name^="field_options[options_layout"]', formAdmin.liveChangeOptionsLayout);
            $buildForm.on('change', 'select[name^="field_options[heading_type"]', formAdmin.liveChangeHeadingType);
            $buildForm.on('change', 'select[name^="field_options[text_alignment"]', formAdmin.liveChangeTextAlignment);
            $buildForm.on('change', 'select.fb-select-image-type', formAdmin.liveChangeSelectImageType);

            $buildForm.on('change', '[data-changebordertype]', formAdmin.liveChangeBorderType);
            $buildForm.on('input', '[data-changeborderwidth]', formAdmin.liveChangeBorderWidth);

            $buildForm.on('input', 'input[name^="field_options[field_max_width"]', formAdmin.liveChangeFieldMaxWidth);
            $buildForm.on('change', 'select[name^="field_options[field_max_width_unit"]', formAdmin.liveChangeFieldMaxWidth);

            $buildForm.on('input', 'input[name^="field_options[image_max_width"]', formAdmin.liveChangeImageMaxWidth);
            $buildForm.on('change', 'select[name^="field_options[image_max_width_unit"]', formAdmin.liveChangeImageMaxWidth);

            $buildForm.on('change click', '[data-disablefield]', formAdmin.liveChangeAddressFields);

            $buildForm.on('change click', 'input[name^="field_options[auto_width"]', formAdmin.liveChangeAutoWidth);

            $buildForm.on('change', 'select[name^="field_options[field_alignment"]', formAdmin.liveChangeFieldAlignment);

            $buildForm.on('change', '[data-row-show-hide]', formAdmin.liveChangeHideShowRow);
            $buildForm.on('input', '[data-label-show-hide]', formAdmin.liveChangeHideShowLabel);
            $buildForm.on('change', '[data-label-show-hide-checkbox]', formAdmin.liveChangeHideShowLabelCheckbox);
        },

        slugifyWebhookKey: function (label) {
            if (typeof label !== 'string') {
                return '';
            }

            let key = label.toLowerCase().trim();

            // Replace non-alphanumeric with underscores.
            key = key.replace(/[^a-z0-9]+/g, '_');
            // Collapse duplicate underscores and trim.
            key = key.replace(/_+/g, '_').replace(/^_+|_+$/g, '');

            return key;
        },

        ensureWebhookKeysForAllFields: function () {
            const usedKeys = {};

            // Collect all existing webhook keys first.
            $('.fb-fields-settings input.fb-webhook-key-field').each(function () {
                const val = ($(this).val() || '').toString().trim();
                if (val !== '') {
                    usedKeys[val] = true;
                }
            });

            $('.fb-fields-settings').each(function () {
                const $fieldSettings = $(this);
                const fieldId = $fieldSettings.data('fid');
                const $webhookKeyInput = $fieldSettings.find('input.fb-webhook-key-field');

                if (!$webhookKeyInput.length) {
                    return;
                }

                const currentWebhookKey = ($webhookKeyInput.val() || '').toString().trim();
                if (currentWebhookKey !== '') {
                    return;
                }

                const $labelInput = $fieldSettings.find('textarea[name^="field_options[name_"]').first();
                const label = ($labelInput.val() || '').toString();
                const baseKey = formAdmin.slugifyWebhookKey(label);

                if (baseKey === '') {
                    return;
                }

                let candidate = baseKey;
                if (usedKeys[candidate]) {
                    candidate = baseKey + '_' + fieldId;
                    let i = 2;
                    while (usedKeys[candidate]) {
                        candidate = baseKey + '_' + fieldId + '_' + i;
                        i++;
                    }
                }

                $webhookKeyInput.val(candidate);
                usedKeys[candidate] = true;
            });
        },

        maybeAutofillWebhookKeyFromLabel: function () {
            const $labelInput = $(this);
            const $fieldSettings = $labelInput.closest('.fb-fields-settings');
            const fieldId = $fieldSettings.data('fid');
            const $webhookKeyInput = $fieldSettings.find('input.fb-webhook-key-field');

            if (!$webhookKeyInput.length) {
                return;
            }

            const currentWebhookKey = ($webhookKeyInput.val() || '').toString().trim();
            if (currentWebhookKey !== '') {
                return;
            }

            const label = ($labelInput.val() || '').toString();
            let baseKey = formAdmin.slugifyWebhookKey(label);
            if (baseKey === '') {
                return;
            }

            // Ensure uniqueness against other webhook key inputs.
            const usedKeys = {};
            $('input.fb-webhook-key-field').each(function () {
                if (this === $webhookKeyInput.get(0)) {
                    return;
                }
                const val = ($(this).val() || '').toString().trim();
                if (val !== '') {
                    usedKeys[val] = true;
                }
            });

            let candidate = baseKey;
            if (usedKeys[candidate]) {
                candidate = baseKey + '_' + fieldId;
                let i = 2;
                while (usedKeys[candidate]) {
                    candidate = baseKey + '_' + fieldId + '_' + i;
                    i++;
                }
            }

            $webhookKeyInput.val(candidate);
        },

        /**
         * Updates the first blank placeholder option on a select (Form Builder preview).
         *
         * @param {HTMLSelectElement} selectEl Target select.
         * @param {string}            newValue Placeholder label text.
         */
        updateSelectPlaceholderOption: function (selectEl, newValue) {
            var option;
            if (!selectEl || selectEl.tagName !== 'SELECT') {
                return;
            }
            option = selectEl.options[0];
            if (option && option.value === '') {
                option.innerHTML = newValue;
            } else {
                formAdmin.addBlankSelectOption(selectEl, newValue);
            }
        },

        /**
         * Parses matrix cell select id (fb-field-{key}-{row}-{col}) column segment.
         *
         * @param {string} selectId Full element id.
         * @param {string} baseId    fb-field-{field_key}.
         * @return {string|null} Column key or null.
         */
        getMatrixColumnFromSelectId: function (selectId, baseId) {
            var prefix = baseId + '-',
                rest,
                lastDash;
            if (!selectId || selectId.indexOf(prefix) !== 0) {
                return null;
            }
            rest = selectId.slice(prefix.length);
            lastDash = rest.lastIndexOf('-');
            if (lastDash === -1) {
                return null;
            }
            return rest.slice(lastDash + 1);
        },

        /**
         * Live-updates matrix dropdown placeholder labels when the sidebar input has no single matching preview id.
         *
         * @param {HTMLInputElement} inputEl Input with data-changeme / data-fb-matrix-*.
         * @param {string}           newValue New placeholder text.
         * @return {boolean} True if matrix selects were updated.
         */
        applyMatrixPlaceholderLive: function (inputEl, newValue) {
            var baseId = inputEl.getAttribute('data-changeme'),
                allCols = inputEl.hasAttribute('data-fb-matrix-all-columns'),
                colAttr = inputEl.getAttribute('data-fb-matrix-column'),
                selects,
                i,
                sel,
                col,
                matched = false;

            if (!baseId || inputEl.getAttribute('data-changeatt') !== 'placeholder') {
                return false;
            }

            selects = document.querySelectorAll('select[id^="' + baseId + '-"]');
            if (selects.length === 0) {
                return false;
            }

            if (!allCols && (colAttr === null || colAttr === '')) {
                return false;
            }

            for (i = 0; i < selects.length; i++) {
                sel = selects[i];
                if (allCols) {
                    formAdmin.updateSelectPlaceholderOption(sel, newValue);
                    matched = true;
                } else {
                    col = formAdmin.getMatrixColumnFromSelectId(sel.id, baseId);
                    if (col !== null && col === colAttr) {
                        formAdmin.updateSelectPlaceholderOption(sel, newValue);
                        matched = true;
                    }
                }
            }
            return matched;
        },

        liveChangesInput: function () {
            var newValue = this.value,
                changes = document.getElementById(this.getAttribute('data-changeme')),
                att = this.getAttribute('data-changeatt'),
                fieldAttrType = this.getAttribute('type'),
                parentField = $(changes).closest('.fb-editor-form-field');

            if (att == 'value' && fieldAttrType == "email") {
                $(this).closest('div').find('.fb-error').remove();
                if (newValue && !formAdmin.isEmail(newValue)) {
                    $(this).closest('div').append('<p class="fb-error">Invalid Email Value</p>');
                }
            }

            if (att == 'value' && parentField.attr('data-type') == 'url') {
                $(this).closest('div').find('.fb-error').remove();
                if (newValue && !formAdmin.isUrl(newValue)) {
                    $(this).closest('div').append('<p class="fb-error">Invalid Website / URL Value. Please add full URL value</p>');
                }
            }

            if (parentField.attr('data-type') == 'range_slider') {
                setTimeout(function () {
                    var newSlider = parentField.find('.formbuilder-range-input-selector');
                    var sliderValue = newSlider.val();
                    var sliderMinValue = parseFloat(newSlider.attr('min'));
                    var sliderMaxValue = parseFloat(newSlider.attr('max'));
                    var sliderStepValue = parseFloat(newSlider.attr('step'));
                    sliderValue = sliderValue < sliderMinValue ? sliderMinValue : sliderValue;
                    sliderValue = sliderValue > sliderMaxValue ? sliderMaxValue : sliderValue;
                    var remainder = sliderValue % sliderStepValue;
                    sliderValue = sliderValue - remainder;
                    newSlider.prev('.formbuilder-range-slider').slider({
                        value: sliderValue,
                        min: sliderMinValue,
                        max: sliderMaxValue,
                        step: sliderStepValue,
                        range: 'min',
                        slide: function (e, ui) {
                            $(this).next().val(ui.value).trigger('change');
                        }
                    });
                }, 100)
            }

            if (changes === null && att === 'placeholder') {
                if (formAdmin.applyMatrixPlaceholderLive(this, newValue)) {
                    return;
                }
            }

            if (changes === null) {
                return;
            }

            if (att !== null) {
                if (changes.tagName === 'SELECT' && att === 'placeholder') {
                    formAdmin.updateSelectPlaceholderOption(changes, newValue);
                } else if (att === 'class') {
                    formAdmin.changeFieldClass(changes, this);
                } else {
                    if ('TEXTAREA' === changes.nodeName && att == 'value') {
                        changes.innerHTML = newValue;
                    } else {
                        changes.setAttribute(att, newValue);
                    }
                }
            } else if (changes.id.indexOf('setup-message') === 0) {
                if (newValue !== '') {
                    changes.innerHTML = '<input type="text" value="" disabled />';
                }
            } else {
                changes.innerHTML = newValue;

                if ('TEXTAREA' === changes.nodeName && changes.classList.contains('wp-editor-area')) {
                    $(changes).trigger('change');
                }

                if (changes.classList.contains('fb-form-label') && 'break' === changes.nextElementSibling.getAttribute('data-type')) {
                    changes.nextElementSibling.querySelector('.fb-editor-submit-button').textContent = newValue;
                }
            }
        },

        liveChangeButtonPosition: function (e) {
            $('.fb-editor-submit-button-wrap').removeClass('fb-submit-btn-align-left fb-submit-btn-align-right fb-submit-btn-align-center').addClass('fb-submit-btn-align-' + e.target.value);
        },

        markRequired: function () {
            var thisid = this.id.replace('fb-', ''),
                fieldId = thisid.replace('req-field-', ''),
                checked = this.checked,
                label = $('#fb-editor-field-required-' + fieldId),
                $clNote = $(this).closest('.fb-fields-settings').find('.fb-cl-required-note');

            formAdmin.toggleValidationBox(checked, '.fb-required-detail-' + fieldId);

            if ($clNote.length) {
                $clNote.toggleClass('fb-hidden', !checked);
            }

            if (checked) {
                var $reqBox = $('input[name="field_options[required_indicator_' + fieldId + ']"]');
                if ($reqBox.val() === '') {
                    $reqBox.val('*');
                }
                label.removeClass('fb-hidden');
            } else {
                label.addClass('fb-hidden');
            }
        },

        //Add new option or "Other" option to radio / checkbox / dropdown / scale / likert_matrix_scale
        addFieldOption: function () {
            /*jshint validthis:true */
            var fieldId = $(this).closest('.fb-fields-settings').data('fid'),
                fieldType = $(this).closest('.fb-fields-settings').data('field-type'), // e.g. 'radio', 'likert_matrix_scale', 'matrix_of_dropdowns'
                fieldKey = $(this).closest('.fb-fields-settings').data('field-key'), // e.g. 9ziztc
                optionsId = $(this).data('options-id'), // e.g. for Likert / Matrix Scale field, can be 'rows' or 'columns'
                newOption = '',         
                optType = $(this).data('opttype'),
                optKey = 0,
                oldKey = '000',
                lastKey = formAdmin.getHighestOptKey(fieldId,optionsId);
                
            if ( 'default' == optionsId ) {
                // e.g. for radio / checkbox / dropdown / scale
                newOption = $('#fb-field-options-' + fieldId + ' .fb-option-template').prop('outerHTML');
            } else {
                // e.g. for likert_matrix_scale, can be 'rows', 'columns', 'dropdowns', 'first_dropdown', etc.
                newOption = $('#fb-field-options-' + fieldId + '-' + optionsId + ' .fb-option-template').prop('outerHTML');
            }

            if (lastKey !== oldKey) {
                optKey = lastKey + 1;
            }

            //Update hidden field
            if (optType === 'other') {
                document.getElementById('other_input_' + fieldId).value = 1;

                //Hide "Add Other" option now if this is radio field
                var ftype = $(this).data('ftype');
                if (ftype === 'radio' || ftype === 'select') {
                    $(this).fadeOut('slow');
                }

                var data = {
                    action: 'fb-add-field_option',
                    field_id: fieldId,
                    opt_key: optKey,
                    opt_type: optType,
                    nonce: formbuilder_backend_js.nonce
                };

                jQuery.post(ajaxurl, data, function (msg) {
                    $('#fb-field-options-' + fieldId).append(msg);
                    formAdmin.resetDisplayedOpts(fieldId,optionsId,fieldType,fieldKey);
                });

            } else {
                // here, optType is most likely 'single'
                newOption = newOption.replace(new RegExp('optkey="' + oldKey + '"', 'g'), 'optkey="' + optKey + '"');
                newOption = newOption.replace(new RegExp('-' + oldKey + '_', 'g'), '-' + optKey + '_');
                newOption = newOption.replace(new RegExp('-' + oldKey + '"', 'g'), '-' + optKey + '"');
                newOption = newOption.replace(new RegExp('\\[' + oldKey + '\\]', 'g'), '[' + optKey + ']');
                newOption = newOption.replace('fb-hidden fb-option-template', '');
                newOption = {newOption};

                if ( 'default' == optionsId ) {
                    // e.g. for radio / checkbox / dropdown / scale
                    $('#fb-field-options-' + fieldId).append(newOption.newOption);
                } else {
                    // e.g. for likert_matrix_scale, can be 'rows', 'columns', 'dropdowns', 'first_dropdown', etc.
                    $('#fb-field-options-' + fieldId + '-' + optionsId).append(newOption.newOption);
                }
                formAdmin.resetDisplayedOpts(fieldId,optionsId,fieldType,fieldKey);
            }
        },

        resetOptOnChange: function () {
            var field, thisOpt;
            var check = $(this);

            field = formAdmin.getFieldKeyFromOpt(this);
            if (!field) {
                return;
            }

            thisOpt = $(this).closest('li');
            formAdmin.resetSingleOpt(field.fieldId, field.fieldKey, thisOpt);

            setTimeout(function () {
                check.next('input').trigger('change');
            }, 100);
        },

        // For matrix fields options
        resetMatrixOptOnChange: function () {
            var field, thisOpt;
            var check = $(this);

            field = formAdmin.getFieldKeyFromOpt(this);
            if (!field) {
                return;
            }

            thisOpt = $(this).closest('li');
            formAdmin.resetMatrixSingleOpt(field.fieldId, field.fieldKey, thisOpt);

            setTimeout(function () {
                check.next('input').trigger('change');
            }, 100);
        },
        
        maybeUncheckRadio: function () {
            var $self, uncheck, unbind, up;

            $self = $(this);
            if ($self.is(':checked')) {
                uncheck = function () {
                    setTimeout(function () {
                        $self.prop('checked', false);
                    }, 0);
                };

                unbind = function () {
                    $self.off('mouseup', up);
                };

                up = function () {
                    uncheck();
                    unbind();
                };

                $self.on('mouseup', up);
                $self.one('mouseout', unbind);
            } else {
                $self.closest('li').siblings().find('.fb-choice-input').prop('checked', false);
            }
        },

        deleteFieldOption: function () {
            var otherInput,
                parentLi = this.closest('li'),
                parentUl = parentLi.parentNode,
                fieldId = this.getAttribute('data-fid'),
                optionsId = $(this).data('options-id'), // e.g. for Likert / Matrix Scale field, can be 'rows' or 'columns'
                fieldType,
                fieldKey;

            if ( 'default' == optionsId ) {
                fieldType = this.getAttribute('data-field-type');
                fieldKey = this.getAttribute('data-field-key');
            } else {
                fieldType = parentUl.getAttribute('data-field-type');
                fieldKey = parentUl.getAttribute('data-key');                
            }

            $(parentLi).fadeOut('slow', function () {
                $(parentLi).remove();
                var hasOther = $(parentUl).find('.formbuilder_other_option');
                if (hasOther.length < 1) {
                    otherInput = document.getElementById('other_input_' + fieldId);
                    if (otherInput !== null) {
                        otherInput.value = 0;
                    }
                    $('#other_button_' + fieldId).fadeIn('slow');
                }
                formAdmin.resetDisplayedOpts(fieldId,optionsId,fieldType,fieldKey);
            });
        },

        liveChangeHeight: function () {
            var newValue = this.value,
                changes = document.getElementById(this.getAttribute('data-changeheight'));

            if (changes === null) {
                return;
            }

            $(changes).css("height", newValue);
        },

        liveChangeRows: function () {
            var newValue = this.value,
                changes = document.getElementById(this.getAttribute('data-changerows'));

            if (changes === null) {
                return;
            }

            $(changes).attr("rows", newValue);
        },

        liveChangeStars: function () {
            var newValue = this.value,
                stars = '',
                changes = document.getElementById(this.getAttribute('data-changestars'));

            if (changes === null) {
                return;
            }

            for (var i = 0; i < newValue; i++) {
                stars = stars + '<label class="fb-star-rating"><input type="radio"><span class="fb-star-outline"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="m12 2l3.104 6.728l7.358.873l-5.44 5.03l1.444 7.268L12 18.28L5.534 21.9l1.444-7.268L1.538 9.6l7.359-.873z"/></svg></span></label>';
            }
            $(changes).html(stars);
        },

        liveChangeLabelPosition: function (e) {
            const fieldId = $(this).closest('.fb-fields-settings').data('fid');
            $('#fb-editor-field-id-' + fieldId).removeClass('fb-label-position-top').removeClass('fb-label-position-left').removeClass('fb-label-position-right').removeClass('fb-label-position-hide').addClass('fb-label-position-' + e.target.value);
        },

        liveChangeLabelAlignment: function (e) {
            const fieldId = $(this).closest('.fb-fields-settings').data('fid');
            $('#fb-editor-field-id-' + fieldId).removeClass('fb-label-alignment-left').removeClass('fb-label-alignment-right').removeClass('fb-label-alignment-center').addClass('fb-label-alignment-' + e.target.value);
        },

        liveChangeOptionsLayout: function (e) {
            const fieldId = $(this).closest('.fb-fields-settings').data('fid');
            $('#fb-editor-field-id-' + fieldId).removeClass('fb-options-layout-inline').removeClass('fb-options-layout-1').removeClass('fb-options-layout-2').removeClass('fb-options-layout-3').removeClass('fb-options-layout-4').removeClass('fb-options-layout-5').removeClass('fb-options-layout-6').addClass('fb-options-layout-' + e.target.value);
        },

        liveChangeHeadingType: function (e) {
            const fieldId = $(this).closest('.fb-fields-settings').data('fid');
            $('#fb-field-' + fieldId).replaceWith(function () {
                return '<' + e.target.value + ' id="' + 'fb-field-' + fieldId + '">' + $(this).html() + '</' + e.target.value + '>';
            });
        },

        liveChangeTextAlignment: function (e) {
            const fieldId = $(this).closest('.fb-fields-settings').data('fid');
            $('#fb-editor-field-id-' + fieldId).removeClass('fb-text-alignment-left').removeClass('fb-text-alignment-right').removeClass('fb-text-alignment-center').addClass('fb-text-alignment-' + e.target.value);
        },

        liveChangeSelectImageType: function () {
            var option = $(this).val();
            var id = $(this).attr('data-is-id');
            $('#fb-field-options-' + id).find('.fb-choice-input').prop('checked', false);
            $('#fb-editor-field-container-' + id).find('input').prop('checked', false);
            $('#fb-field-options-' + id).find('.fb-choice-input').attr('type', option);
            $('#fb-editor-field-container-' + id).find('input').attr('type', option);
        },

        liveChangeBorderType: function (e) {
            $('#' + this.getAttribute('data-changebordertype')).css("border-bottom-style", this.value);
        },

        liveChangeBorderWidth: function (e) {
            $('#' + this.getAttribute('data-changeborderwidth')).css("border-bottom-width", this.value + 'px');
        },

        liveChangeFieldMaxWidth: function () {
            const settings = $(this).closest('.fb-fields-settings');
            const fieldId = settings.data('fid');
            const fieldMaxWidth = settings.find('input[name^="field_options[field_max_width"]').val();
            const fieldMaxWidthUnit = settings.find('select[name^="field_options[field_max_width_unit"]').val();
            if (parseInt(fieldMaxWidth) > 0) {
                $('#fb-editor-field-container-' + fieldId).css('--fb-width', parseInt(fieldMaxWidth) + fieldMaxWidthUnit);
            } else {
                $('#fb-editor-field-container-' + fieldId).prop('style').removeProperty('--fb-width');
            }
        },

        liveChangeImageMaxWidth: function () {
            const settings = $(this).closest('.fb-fields-settings');
            const fieldId = settings.data('fid');
            const imageMaxWidth = settings.find('input[name^="field_options[image_max_width"]').val();
            const imageMaxWidthUnit = settings.find('select[name^="field_options[image_max_width_unit"]').val();
            if (parseInt(imageMaxWidth) > 0) {
                $('#fb-editor-field-container-' + fieldId).css('--fb-image-width', parseInt(imageMaxWidth) + imageMaxWidthUnit);
            } else {
                $('#fb-editor-field-container-' + fieldId).prop('style').removeProperty('--fb-image-width');
            }
        },

        liveChangeAddressFields: function () {
            const disableField = $(this).attr('data-disablefield');
            if ($(this).is(":checked")) {
                $(document).find('#' + disableField).addClass('fb-hidden');
            } else {
                $(document).find('#' + disableField).removeClass('fb-hidden');
            }
        },

        liveChangeAutoWidth: function (e) {
            const fieldId = $(this).closest('.fb-fields-settings').data('fid');
            if ($(this).is(":checked")) {
                $('#fb-editor-field-id-' + fieldId).addClass('fb-auto-width');
            } else {
                $('#fb-editor-field-id-' + fieldId).removeClass('fb-auto-width');
            }
        },

        liveChangeFieldAlignment: function (e) {
            const fieldId = $(this).closest('.fb-fields-settings').data('fid');
            $('#fb-editor-field-id-' + fieldId).removeClass('fb-field-alignment-left').removeClass('fb-field-alignment-right').removeClass('fb-field-alignment-center').addClass('fb-field-alignment-' + e.target.value);
        },

        initFormSettings: function () {
            $('.formbuilder-ajax-udpate-button').on('click', formAdmin.submitSettingsBuild);
            $('.fb-multiple-rows').on('click', '.fb-add-email', function () {
                $(this).closest('.fb-multiple-rows').find('.fb-multiple-email').append('<div class="fb-email-row"><input type="email" name="email_to[]" value=""/><span class="fb fb-trash-can-outline fb-delete-email-row"><svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24"><path fill="currentColor" d="M6.225 4.811a1 1 0 0 0-1.414 1.414L10.586 12L4.81 17.775a1 1 0 1 0 1.414 1.414L12 13.414l5.775 5.775a1 1 0 0 0 1.414-1.414L13.414 12l5.775-5.775a1 1 0 0 0-1.414-1.414L12 10.586z"/></svg></span></div>');
            })
            $(document).on('click', '.fb-multiple-rows .fb-delete-email-row', function () {
                $(this).closest('.fb-email-row').remove();
            })
            $('.fb-multiple-rows').on('click', '.fb-add-webhook', function () {
                $(this).closest('.fb-multiple-rows').find('.fb-multiple-webhook').append('<div class="fb-webhook-row"><input type="text" name="webhook_urls[]" value=""/><span class="fb fb-trash-can-outline fb-delete-webhook-row"><svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24"><path fill="currentColor" d="M6.225 4.811a1 1 0 0 0-1.414 1.414L10.586 12L4.81 17.775a1 1 0 1 0 1.414 1.414L12 13.414l5.775 5.775a1 1 0 0 0 1.414-1.414L13.414 12l5.775-5.775a1 1 0 0 0-1.414-1.414L12 10.586z"/></svg></span></div>');
            })
            $(document).on('click', '.fb-multiple-rows .fb-delete-webhook-row', function () {
                $(this).closest('.fb-webhook-row').remove();
            })

            formAdmin.initWebhookPayloadExample();
        },

        initWebhookPayloadExample: function () {
            const $payloadTypeSelect = $('select[name="webhook_payload_type"]');
            const $exampleCode = $('.fb-webhook-payload-example__code');

            if (!$payloadTypeSelect.length || !$exampleCode.length) {
                return;
            }

            const exampleMessage = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. ';

            const exampleFieldValues = {
                name: {
                    first: 'John',
                    last: 'Doe',
                },
                email: 'john.doe@gmail.com',
                message: exampleMessage,
            };

            const exampleRawByFieldId = {
                '101': {
                    name: 'Name',
                    type: 'name',
                    webhook_key: 'name',
                    value: exampleFieldValues.name,
                },
                '102': {
                    name: 'Email',
                    type: 'email',
                    webhook_key: 'email',
                    value: exampleFieldValues.email,
                },
                '103': {
                    name: 'Message',
                    type: 'textarea',
                    webhook_key: 'message',
                    value: exampleFieldValues.message,
                },
            };

            const examplesByType = {
                full: {
                    form_id: 123,
                    form_title: 'Contact Form',
                    form_url: 'https://example.com/contact/',
                    form_data: exampleRawByFieldId,
                },
                raw_by_field_id: exampleRawByFieldId,
                raw_by_field_webhook_key: {
                    name: {
                        id: 101,
                        name: 'Name',
                        type: 'name',
                        value: exampleFieldValues.name,
                    },
                    email: {
                        id: 102,
                        name: 'Email',
                        type: 'email',
                        value: exampleFieldValues.email,
                    },
                    message: {
                        id: 103,
                        name: 'Message',
                        type: 'textarea',
                        value: exampleFieldValues.message,
                    },
                },
                named: exampleFieldValues,
                flat_named: {
                    name_first: exampleFieldValues.name.first,
                    name_last: exampleFieldValues.name.last,
                    email: exampleFieldValues.email,
                    message: exampleFieldValues.message,
                },
            };

            const renderExample = function () {
                const payloadType = $payloadTypeSelect.val() || 'full';
                const example = examplesByType[payloadType] || examplesByType.full;
                $exampleCode.text(JSON.stringify(example, null, 2));
            };

            renderExample();
            $payloadTypeSelect.on('change', renderExample);
        },

        /**
         * jQuery collection of all .fb-cl-root instances.
         * Field settings panels may live under #fb-editor-fields until moved into #fb-fields-form.
         *
         * @return {JQuery}
         */
        getConditionalLogicRoots: function () {
            return $('#fb-editor-fields, #fb-fields-form').find('.fb-cl-root');
        },

        initConditionalLogicBuilder: function () {
            if (!$buildForm.length) {
                return;
            }

            $buildForm.on('change', '.fb-cl-toggle', formAdmin.toggleConditionalLogicBuilder);
            $buildForm.on('click', '.fb-cl-add-group', formAdmin.addConditionalLogicGroup);
            $buildForm.on('click', '.fb-cl-add-rule', formAdmin.addConditionalLogicRule);
            $buildForm.on('click', '.fb-cl-remove-rule', formAdmin.removeConditionalLogicRule);
            $buildForm.on('change', '.fb-cl-field-id', formAdmin.onConditionalLogicFieldChange);
            $buildForm.on('change', '.fb-cl-operator', formAdmin.onConditionalLogicOperatorChange);
            $buildForm.on('input change', 'input[name^="field_options[step_"]', formAdmin.onBuilderFieldStepInputChange);

            formAdmin.getConditionalLogicRoots().each(function () {
                formAdmin.refreshConditionalLogicBuilder($(this));
            });

            document.addEventListener('formbuilder_added_field', function () {
                formAdmin.getConditionalLogicRoots().each(function () {
                    formAdmin.refreshConditionalLogicBuilder($(this));
                });
            });

            document.addEventListener('formbuilder_sync_after_drag_and_drop', function () {
                formAdmin.getConditionalLogicRoots().each(function () {
                    formAdmin.refreshConditionalLogicBuilder($(this));
                });
            });
        },

        toggleConditionalLogicBuilder: function () {
            const $toggle = $(this);
            const $panel = $toggle.closest('.fb-cl-toggle-row').next('.fb-cl-builder-panel');

            $panel.toggleClass('fb-hidden', !$toggle.is(':checked'));

            if ($toggle.is(':checked')) {
                const $root = $panel.find('.fb-cl-root').first();
                if ($root.length) {
                    formAdmin.refreshConditionalLogicBuilder($root);
                }
            }
        },

        addConditionalLogicGroup: function (e) {
            e.preventDefault();

            const $root = $(this).closest('.fb-cl-root');
            const $groups = $root.find('.fb-cl-groups').first();
            const $group = formAdmin.getConditionalLogicTemplateElement($root, '.fb-cl-group-template');

            if (!$group.length) {
                return;
            }

            $groups.append($group);
            formAdmin.refreshConditionalLogicBuilder($root);
        },

        addConditionalLogicRule: function (e) {
            e.preventDefault();

            const $group = $(this).closest('.fb-cl-group');
            const $root = $group.closest('.fb-cl-root');
            const $rules = $group.find('.fb-cl-rules').first();
            const $rule = formAdmin.getConditionalLogicTemplateElement($root, '.fb-cl-rule-template');

            if (!$rule.length) {
                return;
            }

            $rules.append($rule);
            formAdmin.refreshConditionalLogicBuilder($root);
        },

        /**
         * Read Step from a dependency field's settings panel (live DOM value for number / range_slider / spinner).
         *
         * @param {string|number} fieldId Dependency field ID.
         * @return {string} Valid step string or '' if missing or invalid.
         */
        getLiveNumericStepForDependencyField: function (fieldId) {
            const fid = String(fieldId || '');

            if (!fid) {
                return '';
            }

            const $panel = $('#fb-fields-settings-' + fid);
            const $stepIn = $panel.find('input[name="field_options[step_' + fid + ']"]');

            if (!$stepIn.length || $stepIn.val() === '' || typeof $stepIn.val() === 'undefined') {
                return '';
            }

            const raw = ($stepIn.val() || '').toString().trim();
            const num = parseFloat(raw);

            if (isNaN(num) || num <= 0) {
                return '';
            }

            return raw;
        },

        /**
         * When Step changes in field settings, refresh conditional value UIs that depend on that field (e.g. numeric "between" step).
         */
        onBuilderFieldStepInputChange: function () {
            const name = $(this).attr('name') || '';
            const m = name.match(/^field_options\[step_(\d+)\]$/);

            if (!m) {
                return;
            }

            const changedFid = m[1];

            formAdmin.getConditionalLogicRoots().each(function () {
                $(this).find('.fb-cl-rule').each(function () {
                    const $rule = $(this);
                    const $fieldSelect = $rule.find('.fb-cl-field-id');

                    if (($fieldSelect.val() || '').toString() === changedFid) {
                        formAdmin.refreshConditionalLogicValueField($rule);
                    }
                });
            });
        },

        removeConditionalLogicRule: function (e) {
            e.preventDefault();

            const $rule = $(this).closest('.fb-cl-rule');
            const $group = $rule.closest('.fb-cl-group');
            const $root = $group.closest('.fb-cl-root');
            const groupCount = $root.find('.fb-cl-group').length;
            const ruleCount = $group.find('.fb-cl-rule').length;

            if (groupCount === 1 && ruleCount === 1) {
                return;
            }

            if (ruleCount > 1) {
                $rule.remove();
            } else if (groupCount > 1) {
                $group.remove();
            }

            formAdmin.refreshConditionalLogicBuilder($root);
        },

        onConditionalLogicFieldChange: function () {
            const $rule = $(this).closest('.fb-cl-rule');
            formAdmin.refreshConditionalLogicOperatorSelect($rule, false);
            formAdmin.refreshConditionalLogicValueField($rule);
        },

        onConditionalLogicOperatorChange: function () {
            const $rule = $(this).closest('.fb-cl-rule');
            formAdmin.refreshConditionalLogicValueField($rule);
        },

        /**
         * Tear down jQuery UI datepicker / jquery-timepicker on inputs inside a conditional value slot before replacing markup.
         *
         * @param {JQuery} $valueSlot .fb-cl-value-slot
         */
        destroyConditionalLogicValueSlotWidgets: function ($valueSlot) {
            if (!$valueSlot || !$valueSlot.length) {
                return;
            }

            $valueSlot.find('input').each(function () {
                const $el = $(this);

                if ($.fn.datepicker && $el.hasClass('hasDatepicker')) {
                    try {
                        $el.datepicker('destroy');
                    } catch (e) {
                        // Ignore if widget was not initialized.
                    }
                }

                if (typeof $.fn.timepicker === 'function' && $el.hasClass('ui-timepicker-input')) {
                    try {
                        $el.timepicker('remove');
                    } catch (e2) {
                        // Ignore if widget was not initialized.
                    }
                }
            });
        },

        /**
         * @param {JQuery} $input Input element.
         * @param {string} dateFormat jQuery UI dateFormat string.
         * @param {Function} [onSelect] Optional jQuery UI datepicker onSelect callback.
         */
        initClDatePickerAdmin: function ($input, dateFormat, onSelect) {
            const df = dateFormat || 'MM dd, yy';
            const opts = {
                changeMonth: true,
                changeYear: true,
                yearRange: 'c-100:c+20',
                dateFormat: df,
            };

            if (typeof onSelect === 'function') {
                opts.onSelect = onSelect;
            }

            $input.datepicker(opts);
        },

        /**
         * @param {JQuery} $input Input element.
         * @param {string|number} step Step in minutes.
         * @param {string} minTime Min time string.
         * @param {string} maxTime Max time string.
         */
        initClTimePickerAdmin: function ($input, step, minTime, maxTime) {
            let stepMin = parseInt(step, 10);

            if (isNaN(stepMin) || stepMin < 1) {
                stepMin = 60;
            }

            $input.timepicker({
                showDuration: false,
                timeFormat: 'g:ia',
                minTime: minTime || '00:00',
                maxTime: maxTime || '23:59',
                step: stepMin,
            });
        },

        /**
         * Rebuild dependency field options from current .fb-fields-settings panels (e.g. after a new field is added).
         *
         * @param {JQuery} $root .fb-cl-root element.
         */
        refreshConditionalLogicDependencyFieldSelects: function ($root) {
            if (!$root || !$root.length || !$buildForm.length) {
                return;
            }

            if (!$root.find('.fb-cl-field-id').length) {
                return;
            }

            const vars = typeof formbuilder_backend_js !== 'undefined' ? formbuilder_backend_js : {};
            const operatorsByType = vars.cl_operators_by_type || {};
            const selectFieldLabel = vars.cl_select_field_label || 'Select field';
            const labelWithFieldIdFormat = vars.cl_label_with_field_id || '%1$s (ID %2$d)';

            if (!operatorsByType || typeof operatorsByType !== 'object' || !Object.keys(operatorsByType).length) {
                return;
            }

            const currentFieldId = parseInt($root.data('fieldId'), 10) || 0;
            const fieldIds = [];

            // Panels may live under #fb-fields-form or still inside .fb-editor-field-box until moveFieldSettings() runs.
            $('.fb-fields-settings[id^="fb-fields-settings-"]').each(function () {
                const fid = parseInt($(this).data('fid'), 10) || 0;

                if (fid && fieldIds.indexOf(fid) === -1) {
                    fieldIds.push(fid);
                }
            });

            // Order by builder field_order (matches DB / drag-drop), not document order (sidebar form vs canvas).
            fieldIds.sort(function (a, b) {
                const orderA = parseInt($('input[name="field_options[field_order_' + a + ']"]').val(), 10);
                const orderB = parseInt($('input[name="field_options[field_order_' + b + ']"]').val(), 10);
                const numA = isNaN(orderA) ? 999999 : orderA;
                const numB = isNaN(orderB) ? 999999 : orderB;

                if (numA !== numB) {
                    return numA - numB;
                }

                return a - b;
            });

            const deps = [];

            fieldIds.forEach(function (fid) {
                if (!fid || fid === currentFieldId) {
                    return;
                }

                const $panel = $('#fb-fields-settings-' + fid);

                if (!$panel.length) {
                    return;
                }

                const fieldType = ($panel.data('fieldType') || $panel.attr('data-field-type') || '').toString();

                if (!operatorsByType[fieldType]) {
                    return;
                }

                const $nameTa = $panel.find('textarea[name="field_options[name_' + fid + ']"]');
                let rawName = $nameTa.length ? ($nameTa.val() || '').toString() : '';

                rawName = $('<div>').html(rawName).text().trim();

                let label = rawName;

                if (!label) {
                    label = fieldType.replace(/_/g, ' ');
                    label = label.charAt(0).toUpperCase() + label.slice(1);
                }

                if (typeof wp !== 'undefined' && wp.i18n && typeof wp.i18n.sprintf === 'function') {
                    label = wp.i18n.sprintf(labelWithFieldIdFormat, label, fid);
                } else {
                    label = label + ' (ID ' + fid + ')';
                }

                const dep = {
                    id: fid,
                    type: fieldType,
                    label: label,
                    operators: operatorsByType[fieldType] || [],
                };

                if (fieldType === 'date') {
                    const $dfs = $panel.find('select[name="field_options[date_format_' + fid + ']"]');
                    dep.dateFormat = $dfs.length ? (($dfs.val() || '').toString() || 'MM dd, yy') : 'MM dd, yy';
                }

                if (fieldType === 'time') {
                    const $st = $panel.find('input[name="field_options[step_' + fid + ']"]');
                    let stepNum = $st.length && $st.val() !== '' ? parseInt($st.val(), 10) : 60;
                    if (isNaN(stepNum) || stepNum < 1) {
                        stepNum = 60;
                    }
                    dep.timeStep = String(stepNum);
                    const $minIn = $panel.find('input[name="field_options[min_time_' + fid + ']"]');
                    const $maxIn = $panel.find('input[name="field_options[max_time_' + fid + ']"]');
                    dep.minTime = $minIn.length ? (($minIn.val() || '').toString() || '00:00') : '00:00';
                    dep.maxTime = $maxIn.length ? (($maxIn.val() || '').toString() || '23:59') : '23:59';
                }

                if (fieldType === 'number' || fieldType === 'range_slider' || fieldType === 'spinner') {
                    const $nst = $panel.find('input[name="field_options[step_' + fid + ']"]');
                    let numericStep = '1';
                    if ($nst.length && $nst.val() !== '') {
                        const raw = ($nst.val() || '').toString().trim();
                        const num = parseFloat(raw);
                        if (!isNaN(num) && num > 0) {
                            numericStep = raw;
                        }
                    }
                    dep.numericStep = numericStep;
                }

                deps.push(dep);
            });

            $root.find('.fb-cl-field-id').each(function () {
                const $select = $(this);
                const prevVal = ($select.val() || '').toString();
                let optionsMarkup = '<option value="">' + formAdmin.escapeHtml(selectFieldLabel) + '</option>';

                deps.forEach(function (dep) {
                    const opsJson = JSON.stringify(dep.operators);
                    let optAttrs = 'value="' + String(dep.id) + '" data-field-type="' + formAdmin.escapeHtml(dep.type) + '" data-operators="' + formAdmin.escapeHtml(opsJson) + '"';

                    if (dep.type === 'date' && dep.dateFormat) {
                        optAttrs += ' data-date-format="' + formAdmin.escapeHtml(String(dep.dateFormat)) + '"';
                    }

                    if (dep.type === 'time') {
                        optAttrs += ' data-time-step="' + formAdmin.escapeHtml(String(dep.timeStep || '60')) + '"';
                        optAttrs += ' data-min-time="' + formAdmin.escapeHtml(String(dep.minTime || '00:00')) + '"';
                        optAttrs += ' data-max-time="' + formAdmin.escapeHtml(String(dep.maxTime || '23:59')) + '"';
                    }

                    if (dep.type === 'number' || dep.type === 'range_slider' || dep.type === 'spinner') {
                        optAttrs += ' data-numeric-step="' + formAdmin.escapeHtml(String(dep.numericStep || '1')) + '"';
                    }

                    optionsMarkup += '<option ' + optAttrs + '>' + formAdmin.escapeHtml(dep.label) + '</option>';
                });

                $select.html(optionsMarkup);

                if (prevVal !== '' && deps.some(function (d) {
                    return String(d.id) === prevVal;
                })) {
                    $select.val(prevVal);
                } else {
                    $select.val('');
                }
            });
        },

        refreshConditionalLogicBuilder: function ($root) {
            if (!$root || !$root.length) {
                return;
            }

            formAdmin.refreshConditionalLogicDependencyFieldSelects($root);

            $root.find('.fb-cl-rule').each(function () {
                formAdmin.refreshConditionalLogicOperatorSelect($(this), true);
                formAdmin.refreshConditionalLogicValueField($(this));
            });

            formAdmin.renameConditionalLogicFields($root);
            formAdmin.refreshConditionalLogicConnectors($root);
            formAdmin.refreshConditionalLogicButtons($root);
        },

        renameConditionalLogicFields: function ($root) {
            const fieldId = $root.data('fieldId');

            $root.find('.fb-cl-group').each(function (groupIndex) {
                $(this).find('.fb-cl-rule').each(function (ruleIndex) {
                    const baseName = 'field_options[conditional_logic_' + fieldId + '][groups][' + groupIndex + '][' + ruleIndex + ']';

                    $(this).find('[data-name-part="field_id"]').attr('name', baseName + '[field_id]');
                    $(this).find('[data-name-part="operator"]').attr('name', baseName + '[operator]');
                    $(this).find('[data-name-part="value"]').attr('name', baseName + '[value]');
                });
            });
        },

        refreshConditionalLogicConnectors: function ($root) {
            const andLabel = $root.attr('data-and-label') || 'and';
            const orLabel = $root.attr('data-or-label') || 'or';

            $root.find('.fb-cl-rule-connector, .fb-cl-group-connector').remove();

            $root.find('.fb-cl-group').each(function () {
                const $rules = $(this).find('.fb-cl-rule');
                const ruleCount = $rules.length;

                $rules.each(function (index) {
                    const $slot = $(this).find('.fb-cl-rule-connector-slot').first();

                    if (index < ruleCount - 1) {
                        $slot.text(andLabel);
                    } else {
                        $slot.text('');
                    }
                });
            });

            const $groups = $root.find('.fb-cl-group');

            $groups.each(function (index) {
                if (index < $groups.length - 1) {
                    $('<div class="fb-cl-group-connector"></div>').text(orLabel).insertAfter($(this));
                }
            });
        },

        refreshConditionalLogicButtons: function ($root) {
            const groupCount = $root.find('.fb-cl-group').length;

            $root.find('.fb-cl-group').each(function () {
                const $group = $(this);
                const ruleCount = $group.find('.fb-cl-rule').length;
                const $removeRuleButtons = $group.find('.fb-cl-remove-rule');

                if (groupCount === 1 && ruleCount === 1) {
                    $removeRuleButtons.addClass('is-disabled').attr('aria-disabled', 'true');
                } else {
                    $removeRuleButtons.removeClass('is-disabled').removeAttr('aria-disabled');
                }
            });
        },

        refreshConditionalLogicOperatorSelect: function ($rule, preserveValue) {
            const $fieldSelect = $rule.find('.fb-cl-field-id');
            const $operatorSelect = $rule.find('.fb-cl-operator');
            const $selectedOption = $fieldSelect.find('option:selected');
            const operatorLabels = formAdmin.getConditionalLogicOperatorLabels($rule.closest('.fb-cl-root'));
            const selectOperatorLabel = $rule.closest('.fb-cl-root').attr('data-select-operator-label') || 'Select operator';
            const operatorsJson = $selectedOption.attr('data-operators');
            const operators = operatorsJson ? JSON.parse(operatorsJson) : [];
            const currentValue = preserveValue ? ($operatorSelect.val() || '') : '';
            let nextValue = currentValue;
            let optionsMarkup = '<option value="">' + selectOperatorLabel + '</option>';

            operators.forEach(function (operator) {
                const label = operatorLabels[operator] || operator;
                optionsMarkup += '<option value="' + operator + '">' + formAdmin.escapeHtml(label) + '</option>';
            });

            $operatorSelect.html(optionsMarkup);

            if (operators.indexOf(currentValue) === -1) {
                nextValue = '';
            }

            $operatorSelect.val(nextValue);
        },

        refreshConditionalLogicValueField: function ($rule) {
            const $root = $rule.closest('.fb-cl-root');
            const $fieldSelect = $rule.find('.fb-cl-field-id');
            const $valueSlot = $rule.find('.fb-cl-value-slot');
            const $selectedOption = $fieldSelect.find('option:selected');
            const operator = $rule.find('.fb-cl-operator').val() || '';
            const operatorNorm = String(operator || '').trim();
            const depFieldId = String($fieldSelect.val() || '').trim();
            let fieldType = String($selectedOption.attr('data-field-type') || '').trim();

            if (!fieldType && depFieldId) {
                const $depPanel = $('#fb-fields-settings-' + depFieldId);
                fieldType = String($depPanel.attr('data-field-type') || '').trim();
            }

            const rawVal = ($rule.find('[data-name-part="value"]').first().val() || '').toString();
            const defaultValuePlaceholder = $root.attr('data-value-placeholder') || 'Value';
            const betweenPlaceholder = $root.attr('data-between-placeholder') || defaultValuePlaceholder;
            const startLabel = $root.attr('data-between-start-label') || '';
            const endLabel = $root.attr('data-between-end-label') || '';

            formAdmin.destroyConditionalLogicValueSlotWidgets($valueSlot);
            $valueSlot.removeClass('fb-cl-value-slot-between');

            if (operatorNorm === '' || operatorNorm === 'empty' || operatorNorm === 'not_empty') {
                $valueSlot.empty();
                $valueSlot.append(
                    $('<input type="text" />').attr('data-name-part', 'value').addClass('fb-cl-value').val('').prop('disabled', true).attr('placeholder', defaultValuePlaceholder)
                );
                $valueSlot.addClass('fb-hidden');
                formAdmin.renameConditionalLogicFields($root);
                return;
            }

            $valueSlot.removeClass('fb-hidden');

            const isDateOrTime = fieldType === 'date' || fieldType === 'time';
            const isBetween = isDateOrTime && operatorNorm === 'between';

            if (isDateOrTime) {
                const dateFormat = ($selectedOption.attr('data-date-format') || 'MM dd, yy').toString();
                const timeStep = ($selectedOption.attr('data-time-step') || '60').toString();
                const minTime = ($selectedOption.attr('data-min-time') || '00:00').toString();
                const maxTime = ($selectedOption.attr('data-max-time') || '23:59').toString();

                if (isBetween) {
                    const parts = rawVal.split('|');
                    const startVal = parts[0] ? parts[0].trim() : '';
                    const endVal = parts[1] ? parts[1].trim() : '';

                    $valueSlot.empty();
                    $valueSlot.addClass('fb-cl-value-slot-between');

                    const $wrap = $('<span class="fb-cl-value-between-wrap" />');
                    const $startField = $('<span class="fb-cl-value-between-field" />');
                    const $endField = $('<span class="fb-cl-value-between-field" />');

                    if (startLabel) {
                        $startField.append($('<span class="fb-cl-value-between-label" />').text(startLabel));
                    }

                    if (endLabel) {
                        $endField.append($('<span class="fb-cl-value-between-label" />').text(endLabel));
                    }

                    const $startIn = $('<input type="text" />').addClass('fb-cl-value-between-input').attr('autocomplete', 'off').attr('placeholder', betweenPlaceholder).val(startVal);
                    const $endIn = $('<input type="text" />').addClass('fb-cl-value-between-input').attr('autocomplete', 'off').attr('placeholder', betweenPlaceholder).val(endVal);
                    const $hidden = $('<input type="hidden" />').attr('data-name-part', 'value').addClass('fb-cl-value').val(rawVal);

                    $startField.append($startIn);
                    $endField.append($endIn);
                    $wrap.append($startField).append($endField);
                    $valueSlot.append($wrap).append($hidden);

                    const syncHidden = function () {
                        const a = ($startIn.val() || '').toString().trim();
                        const b = ($endIn.val() || '').toString().trim();
                        $hidden.val(a + '|' + b);
                    };

                    if (fieldType === 'date') {
                        formAdmin.initClDatePickerAdmin($startIn, dateFormat, syncHidden);
                        formAdmin.initClDatePickerAdmin($endIn, dateFormat, syncHidden);
                        $startIn.on('change input', syncHidden);
                        $endIn.on('change input', syncHidden);
                    } else {
                        formAdmin.initClTimePickerAdmin($startIn, timeStep, minTime, maxTime);
                        formAdmin.initClTimePickerAdmin($endIn, timeStep, minTime, maxTime);
                        $startIn.on('change input changeTime', syncHidden);
                        $endIn.on('change input changeTime', syncHidden);
                    }

                    formAdmin.renameConditionalLogicFields($root);
                    return;
                }

                $valueSlot.empty();
                const $single = $('<input type="text" />').attr('data-name-part', 'value').addClass('fb-cl-value').attr('autocomplete', 'off').val(rawVal).attr('placeholder', defaultValuePlaceholder);
                $valueSlot.append($single);

                if (fieldType === 'date') {
                    formAdmin.initClDatePickerAdmin($single, dateFormat);
                } else {
                    formAdmin.initClTimePickerAdmin($single, timeStep, minTime, maxTime);
                }

                formAdmin.renameConditionalLogicFields($root);
                return;
            }

            const isNumericType =
                fieldType === 'number' ||
                fieldType === 'range_slider' ||
                fieldType === 'spinner' ||
                fieldType === 'star' ||
                fieldType === 'scale';

            if (isNumericType && operatorNorm === 'between') {
                const parts = rawVal.split('|');
                const startVal = parts[0] ? parts[0].trim() : '';
                const endVal = parts[1] ? parts[1].trim() : '';

                $valueSlot.empty();
                $valueSlot.addClass('fb-cl-value-slot-between');

                const $wrap = $('<span class="fb-cl-value-between-wrap" />');
                const $startField = $('<span class="fb-cl-value-between-field" />');
                const $endField = $('<span class="fb-cl-value-between-field" />');

                if (startLabel) {
                    $startField.append($('<span class="fb-cl-value-between-label" />').text(startLabel));
                }

                if (endLabel) {
                    $endField.append($('<span class="fb-cl-value-between-label" />').text(endLabel));
                }

                let betweenStep = 'any';

                if (fieldType === 'number' || fieldType === 'range_slider' || fieldType === 'spinner') {
                    const liveStep = formAdmin.getLiveNumericStepForDependencyField(depFieldId);
                    const fallbackStep = ($selectedOption.attr('data-numeric-step') || '1').toString();

                    betweenStep = liveStep !== '' ? liveStep : fallbackStep;
                }

                const $startIn = $('<input type="number" />')
                    .addClass('fb-cl-value-between-input')
                    .attr('autocomplete', 'off')
                    .attr('placeholder', betweenPlaceholder)
                    .attr('step', betweenStep)
                    .val(startVal);
                const $endIn = $('<input type="number" />')
                    .addClass('fb-cl-value-between-input')
                    .attr('autocomplete', 'off')
                    .attr('placeholder', betweenPlaceholder)
                    .attr('step', betweenStep)
                    .val(endVal);
                const $hidden = $('<input type="hidden" />').attr('data-name-part', 'value').addClass('fb-cl-value').val(rawVal);

                $startField.append($startIn);
                $endField.append($endIn);
                $wrap.append($startField).append($endField);
                $valueSlot.append($wrap).append($hidden);

                const syncHidden = function () {
                    const a = ($startIn.val() || '').toString().trim();
                    const b = ($endIn.val() || '').toString().trim();
                    $hidden.val(a + '|' + b);
                };

                $startIn.on('change input', syncHidden);
                $endIn.on('change input', syncHidden);

                formAdmin.renameConditionalLogicFields($root);
                return;
            }

            if (operatorNorm === 'between' && rawVal.indexOf('|') !== -1) {
                const partsFb = rawVal.split('|');
                const startValFb = partsFb[0] ? partsFb[0].trim() : '';
                const endValFb = partsFb[1] ? partsFb[1].trim() : '';

                $valueSlot.empty();
                $valueSlot.addClass('fb-cl-value-slot-between');

                const $wrapFb = $('<span class="fb-cl-value-between-wrap" />');
                const $startFieldFb = $('<span class="fb-cl-value-between-field" />');
                const $endFieldFb = $('<span class="fb-cl-value-between-field" />');

                if (startLabel) {
                    $startFieldFb.append($('<span class="fb-cl-value-between-label" />').text(startLabel));
                }

                if (endLabel) {
                    $endFieldFb.append($('<span class="fb-cl-value-between-label" />').text(endLabel));
                }

                const $startInFb = $('<input type="text" />')
                    .addClass('fb-cl-value-between-input')
                    .attr('autocomplete', 'off')
                    .attr('placeholder', betweenPlaceholder)
                    .val(startValFb);
                const $endInFb = $('<input type="text" />')
                    .addClass('fb-cl-value-between-input')
                    .attr('autocomplete', 'off')
                    .attr('placeholder', betweenPlaceholder)
                    .val(endValFb);
                const $hiddenFb = $('<input type="hidden" />').attr('data-name-part', 'value').addClass('fb-cl-value').val(rawVal);

                $startFieldFb.append($startInFb);
                $endFieldFb.append($endInFb);
                $wrapFb.append($startFieldFb).append($endFieldFb);
                $valueSlot.append($wrapFb).append($hiddenFb);

                const syncHiddenFb = function () {
                    const a = ($startInFb.val() || '').toString().trim();
                    const b = ($endInFb.val() || '').toString().trim();
                    $hiddenFb.val(a + '|' + b);
                };

                $startInFb.on('change input', syncHiddenFb);
                $endInFb.on('change input', syncHiddenFb);

                formAdmin.renameConditionalLogicFields($root);
                return;
            }

            $valueSlot.empty();
            const $plain = $('<input type="text" />').attr('data-name-part', 'value').addClass('fb-cl-value').val(rawVal).attr('placeholder', defaultValuePlaceholder);

            if (fieldType === 'number' || fieldType === 'range_slider' || fieldType === 'spinner' || fieldType === 'star' || fieldType === 'scale') {
                $plain.attr('type', 'number').attr('step', 'any');
            }

            $valueSlot.append($plain);
            formAdmin.renameConditionalLogicFields($root);
        },

        getConditionalLogicTemplateElement: function ($root, selector) {
            const template = $root.find(selector).get(0);

            if (!template) {
                return $();
            }

            if (template.content && template.content.firstElementChild) {
                return $(template.content.firstElementChild.cloneNode(true));
            }

            return $(template.innerHTML).first();
        },

        getConditionalLogicOperatorLabels: function ($root) {
            const labelsAttr = $root.attr('data-operator-labels');

            if (!labelsAttr) {
                return {};
            }

            try {
                return JSON.parse(labelsAttr);
            } catch (error) {
                return {};
            }
        },

        submitSettingsBuild: function (e) {
            e.preventDefault();
            var $thisEle = this;
            formAdmin.preFormSave(this);
            var v = JSON.stringify($formSettings.serializeArray());
            $('#formbuilder_compact_fields').val(v);
            $.ajax({
                type: 'POST',
                url: ajaxurl,
                data: {
                    action: 'formbuilder_save_form_settings',
                    formbuilder_compact_fields: v,
                    nonce: formbuilder_backend_js.nonce
                },
                success: function (msg) {
                    formAdmin.afterFormSave($thisEle);
                    // var $postStuff = document.getElementById('fb-form-panel');
                    // var $html = document.createElement('div');
                    // $html.setAttribute('class', 'fb-updated-info');
                    // $html.innerHTML = msg;
                    // $postStuff.insertBefore($html, $postStuff.firstChild);
                }
            });
        },

        initStyleSettings: function () {
            $('.formbuilder-ajax-udpate-button').on('click', formAdmin.submitStylesBuild);
            $('#fb-form-style-template').on('change', function (e) {
                e.preventDefault();
                const templateID = $(this).val();
                var style = '';
                if (templateID) {
                    style = $(document).find('option[value="' + templateID + '"]').attr('data-style');
                }
                $('style.fb-style-content').text(style);
            });
            $('#fb-form-style-select').on('change', function (e) {
                e.preventDefault();
                const styleClass = $(this).find(":selected").val();
                $(document).find('form.formbuilder-form').removeClass('fb-form-no-style').removeClass('fb-form-default-style').removeClass('fb-form-custom-style').addClass('fb-form-' + styleClass);
            });
        },

        submitStylesBuild: function (e) {
            e.preventDefault();
            var $thisEle = this;
            formAdmin.preFormSave(this);
            var v = JSON.stringify($styleSettings.serializeArray());
            $('#formbuilder_compact_fields').val(v);
            jQuery.ajax({
                type: 'POST',
                url: ajaxurl,
                data: {
                    action: 'formbuilder_save_form_style',
                    'formbuilder_compact_fields': v,
                    nonce: formbuilder_backend_js.nonce
                },
                success: function (msg) {
                    formAdmin.afterFormSave($thisEle);
                    // var $postStuff = document.getElementById('fb-form-panel');
                    // var $html = document.createElement('div');
                    // $html.setAttribute('class', 'fb-updated-info');
                    // $html.innerHTML = msg;
                    // $postStuff.insertBefore($html, $postStuff.firstChild);
                }
            });
        },

        initOtherSettings: function () {
            $(document).on('click', '#fb-test-email-button', function (e) {
                e.preventDefault();
                const testEmailButton = $(this);
                const testEmail = $(document).find('#fb-test-email').val();
                $(document).find('.fb-error').remove();
                if (!formAdmin.isEmail(testEmail)) {
                    testEmailButton.closest('.fb-grid-3').append('<div class="fb-error">Invalid Email</div>');
                    return;
                }
                testEmailButton.addClass('fb-loading-button');
                var emailTemplate = $('#fb-settings-email-template').val();
                $('.fb-test-email-notice').html('');
                jQuery.ajax({
                    type: 'POST',
                    url: ajaxurl,
                    data: {
                        action: 'formbuilder_test_email_template',
                        email_template: emailTemplate,
                        test_email: testEmail,
                        nonce: formbuilder_backend_js.nonce
                    },
                    success: function (res) {
                        testEmailButton.removeClass('fb-loading-button');
                        const response = JSON.parse(res);
                        if (response.success) {
                            testEmailButton.closest('.fb-settings-row').find('.fb-test-email-notice').html('<div class="fb-success">' + response.message + '</div>');
                        } else {
                            testEmailButton.closest('.fb-settings-row').find('.fb-test-email-notice').html('<div class="fb-error">' + response.message + '</div>');
                        }
                    }
                });
            })
        },

        isEmail: function (email) {
            var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return regex.test(email);
        },

        isUrl: function (url) {
            var regex = /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
            return regex.test(url);
        },

        setupFieldOptionSorting: function (sort) {
            var opts = {
                items: 'li',
                axis: 'y',
                opacity: 0.65,
                forcePlaceholderSize: false,
                handle: '.fb-drag',
                helper: function (e, li) {
                    if (li.find('input[type="radio"]:checked, input[type="checkbox"]:checked').length > 0) {
                        isCheckedField = true;
                    }
                    // copyHelper = li.clone().insertAfter(li);
                    return li.clone();
                },
                stop: function (e, ui) {
                    // copyHelper && copyHelper.remove();
                    var fieldId = ui.item.attr('id').replace('fb-option-list-', '').replace('-' + ui.item.data('optkey'), '');
                    var optionsId = ui.item.closest('.fb-option-list').attr('data-options-id');
                    var fieldType = ui.item.closest('.fb-option-list').attr('data-field-type');
                    var fieldKey = ui.item.closest('.fb-option-list').attr('data-key');
                    formAdmin.resetDisplayedOpts(fieldId,optionsId,fieldType,fieldKey);
                    var uiSortField = ui.item.find('input[type="radio"], input[type="checkbox"]');

                    if (isCheckedField) {
                        uiSortField.prop('checked', true);
                        ui.item.find('input[type="radio"]').trigger('click');
                        isCheckedField = false;
                    }
                }
            };
            $(sort).sortable(opts);
        },

        getFieldKeyFromOpt: function (object) {
            var allOpts, fieldId, fieldKey;

            allOpts = $(object).closest('.fb-option-list');
            if (!allOpts.length) {
                return false;
            }

            fieldId = allOpts.attr('id').replace('fb-field-options-', '');
            fieldKey = allOpts.data('key');

            return {
                fieldId: fieldId,
                fieldKey: fieldKey
            };
        },

        usingSeparateValues: function (fieldId) {
            var field = document.getElementById('separate_value_' + fieldId);
            if (field === null) {
                return false;
            } else {
                return field.checked;
            }
        },

        resetSingleOpt: function (fieldId, fieldKey, thisOpt) {
            var saved, text, defaultVal, previewInput,
                optionsId = thisOpt.data('options-id'),
                optKey = thisOpt.data('optkey'),
                separateValues = formAdmin.usingSeparateValues(fieldId),
                single = $('label[for="field_' + fieldKey + '-' + optKey + '"]'),
                baseName = 'field_options[options_' + fieldId + '][' + optKey + ']',
                label = $('input[name="' + baseName + '[label]"]');
                
            if (single.length < 1) {
                formAdmin.resetDisplayedOpts(fieldId,optionsId);

                // Set the default value.
                defaultVal = thisOpt.find('input[name^="default_value_"]');
                if (defaultVal.is(':checked') && label.length > 0) {
                    $('select[name^="item_meta[' + fieldId + ']"]').val(label.val());
                }
                return;
            }

            previewInput = single.children('input');

            if (label.length < 1) {
                // Check for other label.
                label = $('input[name="' + baseName + '"]');
                saved = label.val();
            } else if (separateValues) {
                saved = $('input[name="' + baseName + '[value]"]').val();
            } else {
                saved = label.val();
            }

            if (label.length < 1) {
                return;
            }

            // Set the displayed value.
            text = single[0].childNodes;
            text[text.length - 1].nodeValue = ' ' + label.val();
            previewInput.closest('.fb-choice').find('.fb-field-is-label').text(saved);

            // Set saved value.
            previewInput.val(saved);

            // Set the default value.
            defaultVal = thisOpt.find('input[name^="default_value_"]');
            previewInput.prop('checked', defaultVal.is(':checked') ? true : false);
        },

        resetMatrixSingleOpt: function (fieldId, fieldKey, thisOpt) {
            var fieldIdElements, fieldNumber, optInput, optInputVal, previewDivId,
                optionsId = thisOpt.data('options-id'), // rows, columns, dropdowns, first_dropdown, etc.
                optKey = thisOpt.data('optkey'); // 0, 1, 2, etc.
                
            fieldIdElements = fieldId.split('-');
            fieldNumber = fieldIdElements[0]; // e.g. 123

            optInput = $('input[name="field_options[options_' + fieldNumber +']['+optionsId+']['+optKey+'][label]');
            optInputVal = optInput.val(); // The default row / column option text or the one being input

            previewDivId = 'fb-field-' + fieldKey + '-' + optionsId + '-' + optKey; // e.g. fb-field-xwaprh-rows-0

            // Perform the live update of row and column headings
            $('#'+previewDivId).html(optInputVal);
        },

        resetDisplayedOpts: function (fieldId,optionsId,fieldType,fieldKey) {
            var i, opts, type, placeholder, fieldInfo;

            if (optionsId == 'default') {
                var input = $('[name^="item_meta[' + fieldId + ']"]'); // The input in the builder preview
            } else if (optionsId == 'rows') {
                // var input = [];
                var input = $('[id^="fb-matrix-choice-row-' + fieldKey + '"]');
            } else if (optionsId == 'columns') {
                // var input = [];
                var input = $('[id^="fb-field-' + fieldKey + '-columns"]');
            } else {
                var input = [];
            }

            if (input.length < 1) {
                return;
            }

            if (input.is('select')) {
                const selectedValDefault = input.val();
                placeholder = document.getElementById('fb-placeholder-' + fieldId);

                if (placeholder !== null && placeholder.value === '') {
                    formAdmin.fillDropdownOpts(input[0], {sourceID: fieldId});
                } else {
                    formAdmin.fillDropdownOpts(input[0], {
                        sourceID: fieldId,
                        placeholder: placeholder.value
                    });
                }

                if ($('[name^="item_meta[' + fieldId + ']"]').length > 0 && $('[name^="item_meta[' + fieldId + ']"]')[0].contains(selectedValDefault)) {
                    $('[name^="item_meta[' + fieldId + ']"]').val(selectedValDefault);
                }
            } else {
                if (optionsId == 'default') {
                    type = input.attr('type'); // e.g. radio
                    opts = formAdmin.getMultipleOpts(fieldId,optionsId);
                    $('#fb-editor-field-container-' + fieldId + ' .fb-choice-container').html('');
                    fieldInfo = formAdmin.getFieldKeyFromOpt($('#fb-option-list-' + fieldId + '-000'));

                    var container = $('#fb-editor-field-container-' + fieldId + ' .fb-choice-container');

                    for (i = 0; i < opts.length; i++) {
                        container.append(formAdmin.addRadioCheckboxOpt(type, opts[i], fieldId, fieldInfo.fieldKey));
                    }
                } else if (optionsId == 'rows') {
                    var headerRow = $('#fb-matrix-header-row-' + fieldKey);
                    var rowOpts = formAdmin.getMultipleOpts(fieldId,optionsId);
                    var columnOpts = formAdmin.getMultipleOpts(fieldId,'columns');
                    $('#fb-editor-field-container-' + fieldId + ' .fb-choice-container').html('');
                    fieldInfo = formAdmin.getFieldKeyFromOpt($('#fb-option-list-' + fieldId + '-000'));

                    var container = $('#fb-editor-field-container-' + fieldId + ' .fb-choice-container');

                    container.append(headerRow);

                    for (i = 0; i < rowOpts.length; i++) {
                        container.append(formAdmin.addMatrixRowOpt(rowOpts[i], fieldType, fieldId, fieldInfo.fieldKey, optionsId, columnOpts.length));
                    }
                } else if (optionsId == 'columns') {
                    fieldInfo = formAdmin.getFieldKeyFromOpt($('#fb-option-list-' + fieldId + '-000'));

                    var headerRow = $('#fb-matrix-header-row-' + fieldKey);
                    $('#fb-matrix-header-row-' + fieldKey).html('');
                    
                    var columnOpts = formAdmin.getMultipleOpts(fieldId,'columns');

                    headerRow = '<div id="fb-matrix-header-row-' + fieldKey + '" class="fb-matrix-header-row">' +
                        '<div class="fb-matrix-row-title"></div>' +
                        '<div class="fb-columns">';

                    for (i = 0; i < columnOpts.length; i++) {
                        headerRow += '<div id="fb-field-' + fieldKey + '-columns-' + i + '" class="fb-column-item fb-column-item-' + fieldKey + '">' + columnOpts[i]['saved'] + '</div>';
                    }

                    headerRow += '</div>' +
                    '</div>';

                    $('#fb-editor-field-container-' + fieldId + ' .fb-choice-container').html('');
                    var container = $('#fb-editor-field-container-' + fieldId + ' .fb-choice-container');

                    container.append(headerRow);

                    var rowOpts = formAdmin.getMultipleOpts(fieldId,'rows');
                    for (i = 0; i < rowOpts.length; i++) {
                        container.append(formAdmin.addMatrixRowOpt(rowOpts[i], fieldType, fieldId, fieldInfo.fieldKey, optionsId, columnOpts.length));
                    }
                }

            }

        },

        fillDropdownOpts: function (field, atts) {
            if (field === null) {
                return;
            }
            var sourceID = atts.sourceID,
                placeholder = atts.placeholder,
                showOther = atts.other;

            formAdmin.removeDropdownOpts(field);
            var opts = formAdmin.getMultipleOpts(sourceID),
                hasPlaceholder = (typeof placeholder !== 'undefined');

            for (var i = 0; i < opts.length; i++) {
                var label = opts[i].label,
                    isOther = opts[i].key.indexOf('other') !== -1;

                if (hasPlaceholder && label !== '') {
                    formAdmin.addBlankSelectOption(field, placeholder);
                } else if (hasPlaceholder) {
                    label = placeholder;
                }
                hasPlaceholder = false;

                if (!isOther || showOther) {
                    var opt = document.createElement('option');
                    opt.value = opts[i].saved;
                    opt.innerHTML = label;
                    field.appendChild(opt);
                }
            }
        },
        
        addBlankSelectOption: function (field, placeholder) {
            var label = placeholder;
            var opt = document.createElement('option');
            opt.value = '';
            opt.innerHTML = label;
            field.appendChild(opt);
        },

        addRadioCheckboxOpt: function (type, opt, fieldId, fieldKey) {
            var single,
                id = 'fb-field-' + fieldKey + '-' + opt.key;

            single = '<div class="fb-choice fb-' + type + '" id="fb-' + type + '-' + fieldId + '-' + opt.key + '"><label for="' + id +
                '"><input type="' + type +
                '" name="item_meta[' + fieldId + ']' + (type === 'checkbox' ? '[]' : '') +
                '" value="' + formAdmin.escapeHtml(opt.saved) + '" id="' + id + '"' + (opt.checked ? ' checked="checked"' : '') + '> ' + opt.label + '</label>' +
                '</div>';

            return single;
        },

        // Ref: https://stackoverflow.com/a/6234804
        escapeHtml: function (unsafe) {
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        },
        
        addMatrixRowOpt: function (opt, fieldType, fieldId, fieldKey, optionsId, columnOptsLength) {
            var single,
                optKey,
                id,
                i;
                
            optKey = opt.key;
            id = 'fb-field-' + fieldKey + '-' + optKey;

            var columnOpts = '';
            for (i = 0; i < columnOptsLength; i++) {
                if ( 'likert_matrix_scale' == fieldType ) {
                    columnOpts += '<div class="fb-choice fb-checkbox"><input type="radio"><label></label></div>';
                }
                if ('matrix_of_dropdowns' == fieldType) {
                    columnOpts += '<div class="fb-choice fb-checkbox"><select><option>' + formbuilder_backend_js.matrix_select_placeholder + '</option></select></div>';
                }
                if (fieldType.indexOf('matrix_of_variable_dropdowns') >= 0) {
                    columnOpts += '<div class="fb-choice fb-checkbox"><select><option>' + formbuilder_backend_js.matrix_select_placeholder + '</option></select></div>';
                }
            }

            single = '<div id="fb-matrix-choice-row-' + fieldKey + '-' + optKey + '" class="fb-matrix-choice-row">' + 
                '<div id="fb-field-' + fieldKey + '-rows-' + optKey + '" class="fb-matrix-row-title">' + opt.saved + '</div>' +
                '<div class="fb-row-choices">' +
                columnOpts + 
                '</div>' +
                '</div>';

            return single;
        },
                
        initBulkOptionsOverlay: function () {
            var $info = formAdmin.initModal('#fb-bulk-edit-modal', '700px');
            if ($info === false)
                return;
            $('.fb-insert-preset').on('click', function (event) {
                var opts = JSON.parse(this.getAttribute('data-opts'));
                event.preventDefault();
                document.getElementById('fb-bulk-options').value = opts.join('\n');
                return false;
            });

            $buildForm.on('click', 'a.fb-bulk-edit-link', function (event) {
                event.preventDefault();
                var i, key, label,
                    content = '',
                    optList,
                    opts,
                    fieldId = $(this).closest('[data-fid]').data('fid'),
                    fieldType = $(this).closest('[data-field-type]').data('field-type'),
                    fieldKey = $(this).data('key'),
                    optionsId = $(this).data('options-id'), // e.g. for Likert / Matrix Scale field, can be 'rows' or 'columns'
                    separate = formAdmin.usingSeparateValues(fieldId);

                if (optionsId == 'default') {
                    optList = document.getElementById('fb-field-options-' + fieldId);                
                } else {
                    optList = document.getElementById('fb-field-options-' + fieldId + '-' + optionsId);
                }
                if (!optList)
                    return;

                opts = optList.getElementsByTagName('li');
                document.getElementById('bulk-field-id').value = fieldId;

                for (i = 0; i < opts.length; i++) {
                    key = opts[i].getAttribute('data-optkey');
                    if (key !== '000') {
                        if (optionsId == 'default') {
                            label = document.getElementsByName('field_options[options_' + fieldId + '][' + key + '][label]')[0];
                        } else {
                            label = document.getElementsByName('field_options[options_' + fieldId + '][' + optionsId + '][' + key + '][label]')[0];
                        }
                        if (typeof label !== 'undefined') {
                            content += label.value;
                            if (separate) {
                                if (optionsId == 'default') {
                                    content += '|' + document.getElementsByName('field_options[options_' + fieldId + '][' + key + '][value]')[0].value;
                                } else {
                                    content += '|' + document.getElementsByName('field_options[options_' + fieldId + '][' + optionsId + '][' + key + '][value]')[0].value;                                    
                                }
                            }
                            content += '\r\n';
                        }
                    }

                    if (i >= opts.length - 1) {
                        document.getElementById('fb-bulk-options').value = content;
                    }
                }
                $info.dialog('open');
                $('#fb-update-bulk-options').attr('data-options-id',optionsId);
                $('#fb-update-bulk-options').attr('data-field-type',fieldType);
                $('#fb-update-bulk-options').attr('data-key',fieldKey);
                return false;
            });

            $(document).on('click', '#fb-update-bulk-options', function () {
                var fieldId = document.getElementById('bulk-field-id').value;
                var optionsId = $(this).attr('data-options-id');
                var fieldType = $(this).attr('data-field-type');
                var fieldKey = $(this).attr('data-key');
                var optionType = document.getElementById('bulk-option-type').value;
                if (optionType)
                    return;
                this.classList.add('fb-loading-button');
                var separate = formAdmin.usingSeparateValues(fieldId),
                    action = 'formbuilder_import_options';

                jQuery.ajax({
                    type: 'POST',
                    url: ajaxurl,
                    data: {
                        action: action,
                        field_id: fieldId,
                        field_type: fieldType,
                        options_id: optionsId,
                        opts: document.getElementById('fb-bulk-options').value,
                        separate: separate,
                        nonce: formbuilder_backend_js.nonce
                    },
                    success: function (html) {
                        if (optionsId == 'default') {
                            document.getElementById('fb-field-options-' + fieldId).innerHTML = html;
                        } else {
                            document.getElementById('fb-field-options-' + fieldId + '-' + optionsId).innerHTML = html;
                        }
                        formAdmin.resetDisplayedOpts(fieldId,optionsId,fieldType,fieldKey);
                        if (typeof $info !== 'undefined') {
                            $info.dialog('close');
                            document.getElementById('fb-update-bulk-options').classList.remove('fb-loading-button');
                        }
                    }
                });
            });
        },

        initModal: function (id, width) {
            const $info = $(id);
            if (!$info.length)
                return false;
            if (typeof width === 'undefined')
                width = '550px';
            const dialogArgs = {
                dialogClass: 'fb-dialog',
                modal: true,
                autoOpen: false,
                closeOnEscape: true,
                width: width,
                resizable: false,
                draggable: false,
                open: function () {
                    $('.ui-dialog-titlebar').addClass('fb-hidden').removeClass('ui-helper-clearfix');
                    $('#wpwrap').addClass('formbuilder_overlay');
                    $('.fb-dialog').removeClass('ui-widget ui-widget-content ui-corner-all');
                    $info.removeClass('ui-dialog-content ui-widget-content');
                    formAdmin.bindClickForDialogClose($info);
                },
                close: function () {
                    $('#wpwrap').removeClass('formbuilder_overlay');
                    $('.spinner').css('visibility', 'hidden');

                    this.removeAttribute('data-option-type');
                    const optionType = document.getElementById('bulk-option-type');
                    if (optionType) {
                        optionType.value = '';
                    }
                }
            };
            $info.dialog(dialogArgs);
            return $info;
        },

        initNewFormModal: function () {
            $(document).on('click', '.fb-trigger-modal', () => {
                $('#fb-add-form-modal').addClass('fb-open');
            });

            $(document).on('click', '.formbuilder-close-form-modal', () => {
                $('#fb-add-form-modal').removeClass('fb-open');
            });

            $(document).on('submit', '#fb-add-template', function (event) {
                event.preventDefault();
                const addTemplateButton = $(this).closest('#fb-add-template').find('button');
                if (!addTemplateButton.hasClass('formbuilder-updating')) {
                    var template_name = $(this).closest('#fb-add-template').find('input[name=template_name]').val();
                    addTemplateButton.addClass('formbuilder-updating');
                    jQuery.ajax({
                        type: 'POST',
                        url: ajaxurl,
                        data: {
                            action: 'formbuilder_create_form',
                            name: template_name,
                            nonce: formbuilder_backend_js.nonce
                        },
                        success: function (response) {
                            const res = JSON.parse(response)
                            if (res.error) {
                                alert(res.message || 'Failed to create form. Please try again.');
                                addTemplateButton.removeClass('formbuilder-updating');
                            } else if (typeof res.redirect !== 'undefined') {
                                const redirect = res.redirect;
                                window.location = redirect;
                            }
                        }
                    });
                }
            });
        },

        preFormSave: function (b) {
            formBuilder.removeWPUnload();
            if ($('form.inplace_form').length) {
                $('.inplace_save, .postbox').trigger('click');
            }

            if (typeof formBuilder !== 'undefined') {
                formBuilder.normalizeEditorFieldRows();
                formBuilder.ensureAllSectionMarkerLayouts();
            }

            if (b.classList.contains('formbuilder-ajax-udpate-button')) {
                b.classList.add('formbuilder-updating');
            } else {
                b.classList.add('formbuilder_loading_button');
            }
            b.setAttribute('aria-busy', 'true');
        },

        afterFormSave: function (button) {
            button.classList.remove('formbuilder-updating');
            button.classList.remove('formbuilder_loading_button');
            button.classList.add('formbuilder-updated');
            formBuilder.resetOptionTextDetails();
            fieldsUpdated = 0;
            button.setAttribute('aria-busy', 'false');

            setTimeout(function () {
                // $('.fb-updated-info').fadeOut('slow', function () {
                //     this.parentNode.removeChild(this);
                // });
                button.classList.remove('formbuilder-updated');
            }, 2000);
        },

        toggleValidationBox: function (hasValue, messageClass) {
            var $msg = $(messageClass);
            if (hasValue) {
                $msg.removeClass('fb-hidden');
                $msg.closest('.fb-form-container').find('.fb-validation-header').removeClass('fb-hidden');
            } else {
                $msg.addClass('fb-hidden');
                $msg.closest('.fb-form-container').find('.fb-validation-header').addClass('fb-hidden');
            }
        },

        addTimeDefaultValue: function () {
            const that = $(this);
            if (that.val() && !that.val().match(/^(2[0-3]|[01][0-9]):[0-5][0-9]$/)) {
                that.val('00:00');
            }
            const fieldId = that.closest('.fb-fields-settings').data('fid');
            const [hourString, minute] = that.val().split(":");
            const hour = +hourString % 24;
            $('#fb-editor-field-container-' + fieldId + ' .fb-timepicker').val(minute && (hour % 12 || 12) + ':' + minute + (hour < 12 ? "am" : "pm"));
        },

        validateTimeValue: function () {
            const that = $(this);
            if (that.val() && !that.val().match(/^(2[0-3]|[01][0-9]):[0-5][0-9]$/)) {
                that.val('00:00');
            }
            that.trigger('input');
        },

        removeDropdownOpts: function (field) {
            var i;
            if (typeof field.options === 'undefined') {
                return;
            }

            for (i = field.options.length - 1; i >= 0; i--) {
                field.remove(i);
            }
        },

        getMultipleOpts: function (fieldId,optionsId) {
            var i, saved, labelName, label, key, optObj,
                image, savedLabel, input, field, checkbox, fieldType,
                checked = false,
                opts = [],
                imageUrl = '',
                hasImageOptions = document.getElementsByName('field_options[select_option_type_' + fieldId + ']').length > 0,
                optVals,
                separateValues = formAdmin.usingSeparateValues(fieldId);

            if ( 'default' == optionsId || '' == optionsId || typeof optionsId === 'undefined' ) {
                optVals = $('input[name^="field_options[options_' + fieldId + ']"]');
            } else {
                optVals = $('input[name^="field_options[options_' + fieldId + '][' + optionsId + ']"]');
            }

            for (i = 0; i < optVals.length; i++) {
                if (optVals[i].name.indexOf('[000]') > 0 || optVals[i].name.indexOf('[value]') > 0 || optVals[i].name.indexOf('[image_id]') > 0 || optVals[i].name.indexOf('[price]') > 0) {
                    continue;
                }
                saved = optVals[i].value;
                label = saved;
                if ( 'default' == optionsId || '' == optionsId || typeof optionsId === 'undefined'  ) {
                    key = optVals[i].name.replace('field_options[options_' + fieldId + '][', '').replace('[label]', '').replace(']', '');
                } else {
                    key = optVals[i].name.replace('field_options[options_' + fieldId + '][' + optionsId + '][', '').replace('[label]', '').replace(']', '');                    
                }

                if (separateValues) {
                    labelName = optVals[i].name.replace('[label]', '[value]');
                    saved = $('input[name="' + labelName + '"]').val();
                }

                checked = formBuilder.getChecked(optVals[i].getAttribute('class'));

                if (hasImageOptions) {
                    imageUrl = formBuilder.getImageUrlFromInput(optVals[i]);
                    fieldType = document.getElementsByName('field_options[select_option_type_' + fieldId + ']').value;
                    label = formBuilder.getImageLabel(label, false, imageUrl, fieldType);
                }

                optObj = {
                    saved: saved,
                    label: label,
                    checked: checked,
                    key: key
                };
                opts.push(optObj);
            }
            return opts;
        },

        getFieldOptions: function (fieldId,optionsId) {
            var index, input, li,
                options = [];

            if (optionsId == 'default') {
                var listItems = document.getElementById('fb-field-options-' + fieldId).querySelectorAll('.formbuilder_single_option');
            } else {
                var listItems = document.getElementById('fb-field-options-' + fieldId + '-' + optionsId).querySelectorAll('.formbuilder_single_option');
            }
            
            var length = listItems.length;
                            
            for (index = 0; index < length; index++) {
                li = listItems[index];

                if (li.classList.contains('fb-hidden')) {
                    continue;
                }

                input = li.querySelector('.field_' + fieldId + '_option');
                options.push(input.value);
            }
            return options;
        },

        getHighestOptKey: function (fieldId,optionsId) {
            var i = 0,
                optKey = 0,
                lastKey = 0;
            
            if (optionsId == 'default') {
                var opts = $('#fb-field-options-' + fieldId + ' li');
            } else {
                var opts = $('#fb-field-options-' + fieldId + '-' + optionsId + ' li');
            }

            for (i; i < opts.length; i++) {
                optKey = opts[i].getAttribute('data-optkey');
                if (opts.length === 1) {
                    return optKey;
                }
                if (optKey !== '000') {
                    optKey = optKey.replace('other_', '');
                    optKey = parseInt(optKey, 10);
                }

                if (!isNaN(lastKey) && (optKey > lastKey || lastKey === '000')) {
                    lastKey = optKey;
                }
            }
            return lastKey;
        },

        liveChangeHideShowRow: function () {
            const that = $(this),
                parentRow = that.closest('.fb-form-container');
            var val = that.val();
            parentRow.find('.fb-row-show-hide').addClass('fb-hidden');
            var valArray = val.split('_');
            $.each(valArray, function (index, value) {
                parentRow.find('.fb-row-show-hide.fb-sub-field-' + value).removeClass('fb-hidden');
            });
        },

        liveChangeHideShowLabel: function () {
            const that = $(this);
            var val = that.val();
            const parentFieldSetting = $(this).closest('.fb-fields-settings'),
                fieldId = parentFieldSetting.data('fid'),
                fieldLabel = $('#fb-editor-field-id-' + fieldId).find('label.fb-label-show-hide');

            if (!val || (parentFieldSetting.find('[data-label-show-hide-checkbox]').is(':checked'))) {
                fieldLabel.addClass('fb-hidden');
            } else {
                fieldLabel.removeClass('fb-hidden');
            }
        },

        liveChangeHideShowLabelCheckbox: function () {
            const that = $(this);
            const parentFieldSetting = $(this).parents('.fb-fields-settings'),
                fieldId = parentFieldSetting.data('fid'),
                fieldLabel = $('#fb-editor-field-id-' + fieldId).find('label.fb-label-show-hide');

            // if (that.is(':checked') || !parentFieldSetting.find('[data-label-show-hide]').val()) {
            if (that.is(':checked') ) {
                fieldLabel.addClass('fb-hidden');
            } else {
                fieldLabel.removeClass('fb-hidden');
            }
        },

        bindClickForDialogClose: function ($modal) {
            const closeModal = function () {
                $modal.dialog('close');
            };
            $('.ui-widget-overlay').on('click', closeModal);
            $modal.on('click', 'a.dismiss', closeModal);
        },

    };

    $(function () {
        formAdmin.init();
    });

    $(document).ready( function() { 
        // Copy shortcode button on forms listing page
        // https://tippyjs.bootcss.com/
        tippy('.copy-shortcode-button', {
            content: 'Copied!',
            placement: 'left',
            arrow: true,
            theme: 'light',
            trigger: 'click',
            onShow(instance) {
                setTimeout(() => {
                    instance.hide();
                }, 1000);
            }
        });

        // https://clipboardjs.com/
        var clipboard = new ClipboardJS('.copy-shortcode-button', {
            text: function( trigger ) {
                return '[formbuilder id="' + trigger.getAttribute('data-clipboard-text') + '"]';
            }
        });    
    });

})(jQuery);


HTMLSelectElement.prototype.contains = function (value) {
    for (var i = 0, l = this.options.length; i < l; i++) {
        if (this.options[i].value == value) {
            return true;
        }
    }
    return false;
}