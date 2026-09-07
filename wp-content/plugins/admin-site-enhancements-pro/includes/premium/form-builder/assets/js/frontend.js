jQuery(function ($) {

    'use strict';

    /**
     * Clear Turnstile state after server-side validation errors so the widget matches
     * the response token (single-use tokens may have been consumed or rejected).
     *
     * @param {jQuery} $form Form builder form element.
     */
    function formbuilderResetTurnstileInForm($form) {
        if (typeof window.turnstile === 'undefined' || typeof window.turnstile.reset !== 'function') {
            return;
        }

        var containers = $form.find('.cf-turnstile').toArray();
        if (!containers.length) {
            return;
        }

        var runReset = function () {
            containers.forEach(function (el) {
                try {
                    window.turnstile.reset(el);
                } catch (err) {
                    // Widget not ready or API mismatch; ignore.
                }
            });
        };

        if (typeof window.turnstile.ready === 'function') {
            window.turnstile.ready(runReset);
        } else {
            runReset();
        }
    }

    $(document).on('submit.formbuilder-form', '.formbuilder-form', function (e) {
        e.preventDefault();
        var form = $(this);

        // Multi-step: Enter / implicit submit on non-last step advances instead of submitting.
        if (form.data('fbMultiStep') && !formBuilderMultiStepIsLastVisible(form)) {
            formBuilderMultiStepGoNext(form);
            return;
        }

        if (form.find('button.fb-submit-button').hasClass('fb-button-loading')) {
            return;
        } else {
            form.find('button.fb-submit-button').addClass('fb-button-loading');
        }

        const siteKey = $('.g-recaptcha').attr('data-sitekey');

        const isV3 = $('.g-recaptcha').attr('data-size') == "invisible";
        isV3 && grecaptcha.ready(function () {
            grecaptcha.execute(siteKey, {action: 'formbuilder'}).then(function (token) {
                form.append('<input type="hidden" id="recaptcha_token" value="' + token + '">');
            });
        });

        $('.fb-error-msg').remove();
        $('.fb-success-msg').remove();
        $('.fb-failed-msg').remove();
        $(document).find('.formbuilder-error-container').removeClass('formbuilder-error-container');

        setTimeout(() => {
            var data = form.serializeArray();

            if (isV3) {
                const reCaptchaTokenValue = $(document).find('#recaptcha_token').val();
                $(document).find('#recaptcha_token').remove();
                data.forEach(function (item) {
                    if (item.name === 'g-recaptcha-response') {
                        item.value = item.value ? item.value : reCaptchaTokenValue;
                    }
                });
            }

            jQuery.ajax({
                type: 'POST',
                url: formbuilder_vars.ajaxurl,
                dataType: 'json',
                data: {
                    action: 'formbuilder_process_entry',
                    data: $.param(data),
                    location: window.location.href
                },
                success: function (response) {
                    form.find('button.fb-submit-button').removeClass('fb-button-loading');
                    if (response.status == "redirect") {
                        window.location.replace(response.message);
                    } else if (response.status == "success") {
                        if (response.hide_form_after_submission == "off") {
                            form.trigger("reset");
                            form.find('.fb-star-rating').removeClass('fb-star-checked');
                            form.find('.formbuilder-range-input-selector').each(function () {
                                var newSlider = $(this);
                                var sliderValue = newSlider.val();
                                var sliderMinValue = parseFloat(newSlider.attr('min'));
                                var sliderMaxValue = parseFloat(newSlider.attr('max'));
                                var sliderStepValue = parseFloat(newSlider.attr('step'));
                                newSlider.prev('.formbuilder-range-slider').slider({
                                    value: sliderValue,
                                    min: sliderMinValue,
                                    max: sliderMaxValue,
                                    step: sliderStepValue,
                                    range: 'min',
                                    slide: formBuilderRangeSliderSlide
                                });
                            });
                            $('body').find('.fb-preview-remove').trigger('click');                            
                            form.trigger('formbuilder:conditional-logic-refresh');
                        }
                        form.append('<span class="fb-success-msg">' + response.message + '</span>');
                        if (response.hide_form_after_submission == "on") {
                            form.find('.fb-form-preview').fadeOut();
                        }
                    } else if (response.status == "failed") {
                        form.append('<span class="fb-failed-msg">' + response.message + '</span>');
                    } else {
                        $.each(response.message, function (key, value) {
                            const errorFieldId = key.replace("field", "");
                            $('#' + 'fb-field-container-' + errorFieldId).addClass('formbuilder-error-container').append('<span class="fb-error-msg">' + value + '</span>');
                        });

                        formbuilderResetTurnstileInForm(form);

                        const firstError = Object.keys(response.message)[0];
                        const subFieldIndex = firstError.indexOf('-');
                        var firstErrorItem;

                        if (subFieldIndex > 0) {
                            const errorFieldId = firstError.substr(0, subFieldIndex).replace("field", "");
                            const subField = firstError.substr(subFieldIndex + 1, firstError.length);
                            firstErrorItem = $('#' + 'fb-subfield-container-' + subField + '-' + errorFieldId);
                        } else {
                            const errorFieldId = firstError.replace("field", "");
                            firstErrorItem = $('#' + 'fb-field-container-' + errorFieldId);
                        }

                        $('html, body').animate({
                            scrollTop: firstErrorItem.offset().top - 300
                        }, 300);
                    }
                }
            });
        }, 1000);
    });

    $(document).on('click', '.formbuilder-field-type-spinner .fb-quantity .fb-plus', function () {
        const parent = $(this).closest('.formbuilder-field-type-spinner');
        const numberInput = parent.find('input');
        const max = numberInput.attr('max');
        const numberInputVal = Number(numberInput.val());
        numberInput.val(numberInputVal < max ? numberInputVal + 1 : max);
        numberInput.trigger('input');
    });

    $(document).on('click', '.formbuilder-field-type-spinner .fb-quantity .fb-minus', function () {
        const parent = $(this).closest('.formbuilder-field-type-spinner');
        const numberInput = parent.find('input');
        const min = numberInput.attr('min');
        const numberInputVal = Number(numberInput.val());
        numberInput.val(numberInputVal > min ? numberInputVal - 1 : min);
        numberInput.trigger('input');
    });

    /**
     * jQuery UI slider slide: sync value to the adjacent input and notify conditional logic.
     * Programmatic .val() does not fire input/change; trigger input so runConditionalLogic runs.
     *
     * @this {HTMLElement} The slider track element (.formbuilder-range-slider).
     */
    function formBuilderRangeSliderSlide(e, ui) {
        var $input = $(this).next();
        $input.val(ui.value);
        $input.trigger('input');
    }

    // Range JS
    $('.formbuilder-range-input-selector').each(function () {
        var newSlider = $(this);
        var sliderValue = newSlider.val();
        var sliderMinValue = parseFloat(newSlider.attr('min'));
        var sliderMaxValue = parseFloat(newSlider.attr('max'));
        var sliderStepValue = parseFloat(newSlider.attr('step'));

        newSlider.prev('.formbuilder-range-slider').slider({
            value: sliderValue,
            min: sliderMinValue,
            max: sliderMaxValue,
            step: sliderStepValue,
            range: 'min',
            slide: formBuilderRangeSliderSlide
        });
    });

    // Update slider if the input field loses focus as it's most likely changed
    $('.formbuilder-range-input-selector').blur(function () {
        var resetValue = isNaN($(this).val()) ? '' : $(this).val();

        if (resetValue) {
            var sliderMinValue = parseFloat($(this).attr('min'));
            var sliderMaxValue = parseFloat($(this).attr('max'));
            // Make sure our manual input value doesn't exceed the minimum & maxmium values
            if (resetValue < sliderMinValue) {
                resetValue = sliderMinValue;
                $(this).val(resetValue);
            }
            if (resetValue > sliderMaxValue) {
                resetValue = sliderMaxValue;
                $(this).val(resetValue);
            }
        }
        $(this).val(resetValue);
        $(this).prev('.formbuilder-range-slider').slider('value', resetValue);
    });

    function hoverStars() {
        $(this).prevAll('.fb-star-rating').addBack().addClass('fb-star-hovered');
        $(this).nextAll('.fb-star-rating').addClass('fb-star-non-hovered');
    }

    function unhoverStars() {
        $(this).closest('.formbuilder-star-group').find('.fb-star-rating').removeClass('fb-star-hovered fb-star-non-hovered');
    }

    function loadStars() {
        $(this).closest('.formbuilder-star-group').find('.fb-star-rating').removeClass('fb-star-checked');
        $(this).parent('.fb-star-rating').prevAll('.fb-star-rating').addBack().addClass('fb-star-checked');
    }

    $(document).on('click', '.formbuilder-star-group input', loadStars);
    $(document).on('mouseenter', '.formbuilder-star-group .fb-star-rating:not(.fb-star-rating-readonly)', hoverStars);
    $(document).on('mouseleave', '.formbuilder-star-group .fb-star-rating:not(.fb-star-rating-readonly)', unhoverStars);

    $('.formbuilder-field-type-date input').each(function () {
        const $this = $(this);
        const dtFormat = $this.attr('data-format');
        const dtVal = $this.val();
        if (dtVal) {
            var date = new Date(dtVal);
            $this.val(date == 'Invalid Date' ? '' : moment(date).format(dtFormat.replace("dd", "DD").replace("MM", "MMMM").replace("mm", "MM")));
        }
        $this.datepicker({
            changeMonth: true,
            changeYear: true,
            yearRange: 'c-100:c+20',
            dateFormat: dtFormat,
        });
    })

    $('.formbuilder-field-type-time').each(function () {
        var timePickerWrap = $(this).find('.fb-timepicker');
        var timePickerValueInput = $(this).find('.fb-output');
        timePickerWrap.timepicker({
            'showDuration': false,
            'timeFormat': 'g:ia',
        });
    })

    function getConditionalLogicConfig(form) {
        const cachedConfig = form.data('fbConditionalLogicConfig');
        if (cachedConfig) {
            return cachedConfig;
        }

        const configInput = form.find('.formbuilder-conditional-logic-config').first();
        if (!configInput.length) {
            return null;
        }

        try {
            const parsedConfig = JSON.parse(configInput.val() || '{}');
            form.data('fbConditionalLogicConfig', parsedConfig);
            return parsedConfig;
        } catch (error) {
            return null;
        }
    }

    const MIN_NEGATIVE_CL_INPUT_LENGTH = 2;
    const CONDITIONAL_LOGIC_INPUT_DEBOUNCE_MS = 100;

    function isConditionalLogicEmptyValue(value) {
        if (Array.isArray(value)) {
            return value.filter(function (item) {
                const normalizedItem = (typeof item === 'undefined' || item === null) ? '' : item;
                return $.trim(String(normalizedItem)) !== '';
            }).length === 0;
        }

        const normalizedValue = (typeof value === 'undefined' || value === null) ? '' : value;
        return $.trim(String(normalizedValue)) === '';
    }

    /**
     * Field types where users type free text; negative operators need min length after non-empty.
     *
     * @param {string} fieldType Field type slug.
     * @return {boolean}
     */
    function fieldTypeUsesTypedNegativeGate(fieldType) {
        const t = fieldType || '';
        return $.inArray(t, ['text', 'textarea', 'email', 'url', 'phone', 'name', 'address']) !== -1;
    }

    /**
     * @param {object} fieldMeta Field metadata from conditional logic config.
     * @param {string} operator  Rule operator.
     * @param {*}        rawValue Current dependency value.
     * @return {boolean} True when is_not / does_not_contain must not match yet (inconclusive).
     */
    function negativeOperatorInsufficientInput(fieldMeta, operator, rawValue) {
        if (operator !== 'is_not' && operator !== 'does_not_contain') {
            return false;
        }

        if (isConditionalLogicEmptyValue(rawValue)) {
            return true;
        }

        if (!fieldTypeUsesTypedNegativeGate(fieldMeta.type)) {
            return false;
        }

        if (Array.isArray(rawValue)) {
            let sum = 0;
            for (let i = 0; i < rawValue.length; i++) {
                const normalizedItem = (typeof rawValue[i] === 'undefined' || rawValue[i] === null) ? '' : rawValue[i];
                sum += $.trim(String(normalizedItem)).length;
            }
            return sum < MIN_NEGATIVE_CL_INPUT_LENGTH;
        }

        const normalizedRawValue = (typeof rawValue === 'undefined' || rawValue === null) ? '' : rawValue;
        return $.trim(String(normalizedRawValue)).length < MIN_NEGATIVE_CL_INPUT_LENGTH;
    }

    function getConditionalLogicFieldValue(form, fieldId) {
        const baseName = 'item_meta[' + fieldId + ']';
        const singleField = form.find('[name="' + baseName + '"]');
        const multiField = form.find('[name="' + baseName + '[]"]');

        if (multiField.length) {
            const inputType = (multiField.first().attr('type') || '').toLowerCase();

            if (inputType === 'checkbox' || inputType === 'radio') {
                return multiField.filter(':checked').map(function () {
                    return $(this).val();
                }).get();
            }

            return multiField.map(function () {
                return $(this).val();
            }).get();
        }

        if (!singleField.length) {
            const groupedPrefix = 'item_meta[' + fieldId + '][';
            const grouped = form.find('input, select, textarea').filter(function () {
                const n = this.name || '';
                return n.indexOf(groupedPrefix) === 0;
            });

            if (grouped.length) {
                return grouped.map(function () {
                    const $el = $(this);

                    if ($el.is(':radio')) {
                        return $el.is(':checked') ? $el.val() : '';
                    }

                    if ($el.is(':checkbox')) {
                        return $el.is(':checked') ? $el.val() : '';
                    }

                    return $el.val();
                }).get();
            }

            return '';
        }

        if (singleField.is(':checkbox')) {
            return singleField.is(':checked') ? singleField.val() : '';
        }

        if (singleField.first().is(':radio')) {
            const checked = singleField.filter(':checked');
            return checked.length ? (checked.val() || '') : '';
        }

        if (singleField.is('select') && singleField.prop('multiple')) {
            return singleField.val() || [];
        }

        return singleField.val() || '';
    }

    /**
     * Map jQuery UI datepicker format to moment.js format (same order as datepicker init in this file).
     *
     * @param {string} jq jQuery UI dateFormat string.
     * @return {string}
     */
    function formBuilderClJqueryUiDateFormatToMoment(jq) {
        if (!jq) {
            return 'MMMM DD, YYYY';
        }

        var f = String(jq);

        f = f.replace(/yy/g, 'YYYY');
        f = f.replace(/dd/g, 'DD');
        f = f.replace(/MM/g, 'MMMM');
        f = f.replace(/mm/g, 'MM');

        return f;
    }

    /**
     * Map jquery-timepicker timeFormat (e.g. g:ia) to moment format.
     *
     * @param {string} tf Time format string.
     * @return {string}
     */
    function formBuilderClJqueryTimeFormatToMoment(tf) {
        if (!tf) {
            return 'h:mm a';
        }

        return String(tf).replace(/g/g, 'h').replace(/i/g, 'mm');
    }

    /**
     * @param {string} valueStr
     * @param {object} fieldMeta
     * @return {moment|null}
     */
    function formBuilderClParseMomentDate(valueStr, fieldMeta) {
        var fmt = formBuilderClJqueryUiDateFormatToMoment(fieldMeta.dateFormat || '');
        var m = moment(valueStr, fmt, true);

        if (!m.isValid()) {
            m = moment(valueStr);
        }

        return m.isValid() ? m : null;
    }

    /**
     * @param {string} valueStr
     * @param {object} fieldMeta
     * @return {number|null} Minutes from midnight.
     */
    function formBuilderClParseTimeMinutes(valueStr, fieldMeta) {
        var tf = fieldMeta.timeFormat || 'g:ia';
        var mFmt = formBuilderClJqueryTimeFormatToMoment(tf);
        var m = moment(valueStr, mFmt, true);

        if (!m.isValid()) {
            m = moment(valueStr, ['h:mm a', 'h:mmA', 'hh:mm a', 'H:mm', 'HH:mm'], true);
        }

        if (!m.isValid()) {
            return null;
        }

        return m.hours() * 60 + m.minutes();
    }

    /**
     * @param {object} fieldMeta
     * @param {string} operator
     * @param {*} rawValue
     * @param {string} expected
     * @return {boolean}
     */
    function conditionalLogicRuleMatchesDateOrTime(fieldMeta, operator, rawValue, expected) {
        const value = $.trim(String((typeof rawValue === 'undefined' || rawValue === null) ? '' : rawValue));

        if (value === '' || isConditionalLogicEmptyValue(rawValue)) {
            return false;
        }

        if (fieldMeta.type === 'date') {
            const cur = formBuilderClParseMomentDate(value, fieldMeta);

            if (!cur) {
                return false;
            }

            if (operator === 'between') {
                const parts = expected.split('|');

                if (parts.length < 2) {
                    return false;
                }

                let start = formBuilderClParseMomentDate($.trim(parts[0]), fieldMeta);
                let end = formBuilderClParseMomentDate($.trim(parts[1]), fieldMeta);

                if (!start || !end) {
                    return false;
                }

                let s = start.clone().startOf('day');
                let e = end.clone().startOf('day');

                if (s.isAfter(e)) {
                    const t = s;
                    s = e;
                    e = t;
                }

                const v = cur.clone().startOf('day');

                return v.isBetween(s, e, 'day', '[]');
            }

            if (expected === '') {
                return false;
            }

            const exp = formBuilderClParseMomentDate(expected, fieldMeta);

            if (!exp) {
                return false;
            }

            const v = cur.clone().startOf('day');
            const e = exp.clone().startOf('day');

            switch (operator) {
                case 'before':
                    return v.isBefore(e, 'day');
                case 'before_or_equal':
                    return v.isSameOrBefore(e, 'day');
                case 'after':
                    return v.isAfter(e, 'day');
                case 'after_or_equal':
                    return v.isSameOrAfter(e, 'day');
                default:
                    return false;
            }
        }

        if (fieldMeta.type === 'time') {
            const curMin = formBuilderClParseTimeMinutes(value, fieldMeta);

            if (curMin === null) {
                return false;
            }

            if (operator === 'between') {
                const parts = expected.split('|');

                if (parts.length < 2) {
                    return false;
                }

                let start = formBuilderClParseTimeMinutes($.trim(parts[0]), fieldMeta);
                let end = formBuilderClParseTimeMinutes($.trim(parts[1]), fieldMeta);

                if (start === null || end === null) {
                    return false;
                }

                if (start > end) {
                    const t = start;
                    start = end;
                    end = t;
                }

                return curMin >= start && curMin <= end;
            }

            if (expected === '') {
                return false;
            }

            const expMin = formBuilderClParseTimeMinutes(expected, fieldMeta);

            if (expMin === null) {
                return false;
            }

            switch (operator) {
                case 'before':
                    return curMin < expMin;
                case 'before_or_equal':
                    return curMin <= expMin;
                case 'after':
                    return curMin > expMin;
                case 'after_or_equal':
                    return curMin >= expMin;
                default:
                    return false;
            }
        }

        return false;
    }

    function conditionalLogicRuleMatches(fieldMeta, rule, rawValue) {
        const operator = rule.operator || '';
        const expected = $.trim(String(rule.value || ''));

        if (operator === 'empty') {
            if (fieldMeta.type === 'date' || fieldMeta.type === 'time') {
                return false;
            }

            return isConditionalLogicEmptyValue(rawValue);
        }

        if (operator === 'not_empty') {
            return !isConditionalLogicEmptyValue(rawValue);
        }

        if (negativeOperatorInsufficientInput(fieldMeta, operator, rawValue)) {
            return false;
        }

        if (fieldMeta.type === 'date' || fieldMeta.type === 'time') {
            if (Array.isArray(rawValue)) {
                return false;
            }

            return conditionalLogicRuleMatchesDateOrTime(fieldMeta, operator, rawValue, expected);
        }

        if (Array.isArray(rawValue)) {
            if (operator === 'contains') {
                if (expected === '') {
                    return false;
                }

                for (let i = 0; i < rawValue.length; i++) {
                    const normalizedItem = (typeof rawValue[i] === 'undefined' || rawValue[i] === null) ? '' : rawValue[i];
                    const normalized = $.trim(String(normalizedItem));

                    if (normalized.indexOf(expected) !== -1) {
                        return true;
                    }
                }

                return false;
            }

            const values = rawValue.map(function (item) {
                const normalizedItem = (typeof item === 'undefined' || item === null) ? '' : item;
                return $.trim(String(normalizedItem));
            }).filter(function (item) {
                return item !== '';
            });

            if (operator === 'is') {
                return values.indexOf(expected) !== -1;
            }

            if (operator === 'is_not') {
                return values.indexOf(expected) === -1;
            }

            return false;
        }

        const normalizedRawValue = (typeof rawValue === 'undefined' || rawValue === null) ? '' : rawValue;
        const value = $.trim(String(normalizedRawValue));

        if ($.inArray(fieldMeta.type, ['number', 'range_slider', 'spinner', 'star', 'scale']) !== -1) {
            if (operator === 'between') {
                if (value === '') {
                    return false;
                }

                const parts = expected.split('|');

                if (parts.length < 2) {
                    return false;
                }

                let low = parseFloat($.trim(parts[0]), 10);
                let high = parseFloat($.trim(parts[1]), 10);

                if (isNaN(low) || isNaN(high)) {
                    return false;
                }

                if (low > high) {
                    const tmp = low;
                    low = high;
                    high = tmp;
                }

                const currentNumber = parseFloat(value, 10);

                if (isNaN(currentNumber)) {
                    return false;
                }

                return currentNumber >= low && currentNumber <= high;
            }

            if (value === '' || expected === '') {
                return false;
            }

            const currentNumber = parseFloat(value);
            const expectedNumber = parseFloat(expected);

            switch (operator) {
                case 'is':
                    return currentNumber === expectedNumber;
                case 'is_not':
                    return currentNumber !== expectedNumber;
                case 'greater_than':
                    return currentNumber > expectedNumber;
                case 'greater_than_or_equal':
                    return currentNumber >= expectedNumber;
                case 'less_than':
                    return currentNumber < expectedNumber;
                case 'less_than_or_equal':
                    return currentNumber <= expectedNumber;
            }
        }

        switch (operator) {
            case 'is':
                return value === expected;
            case 'is_not':
                return value !== expected;
            case 'contains':
                return expected !== '' && value.indexOf(expected) >= 0;
            case 'does_not_contain':
                return expected !== '' && value.indexOf(expected) === -1;
        }

        return false;
    }

    function evaluateConditionalLogicTarget(form, targetConfig, fieldMap, visibleMap) {
        if (!targetConfig.groups || !targetConfig.groups.length) {
            return true;
        }

        for (let groupIndex = 0; groupIndex < targetConfig.groups.length; groupIndex++) {
            const group = targetConfig.groups[groupIndex];
            let groupMatches = true;

            for (let ruleIndex = 0; ruleIndex < group.length; ruleIndex++) {
                const rule = group[ruleIndex];
                const dependencyId = String(rule.field_id);
                const dependencyField = fieldMap[dependencyId];

                if (!dependencyField || visibleMap[dependencyId] === false) {
                    groupMatches = false;
                    break;
                }

                if (!conditionalLogicRuleMatches(dependencyField, rule, getConditionalLogicFieldValue(form, dependencyId))) {
                    groupMatches = false;
                    break;
                }
            }

            if (groupMatches) {
                return true;
            }
        }

        return false;
    }

    function applySectionVisibility(visibleMap, sections) {
        let hasChanges = false;

        $.each(sections || {}, function (startId, section) {
            if (visibleMap[String(startId)] !== false) {
                return;
            }

            $.each(section.field_ids || [], function (_, fieldId) {
                const normalizedFieldId = String(fieldId);

                if (visibleMap[normalizedFieldId] !== false) {
                    visibleMap[normalizedFieldId] = false;
                    hasChanges = true;
                }
            });
        });

        return hasChanges;
    }

    function getSectionFieldIdsToToggle(sections) {
        const fieldIds = {};

        $.each(sections || {}, function (_, section) {
            $.each(section.field_ids || [], function (_, fieldId) {
                fieldIds[String(fieldId)] = true;
            });
        });

        return fieldIds;
    }

    function computeConditionalLogicVisibility(form, config) {
        const fieldMap = config.fields || {};
        const targets = config.targets || {};
        const sections = config.sections || {};
        const visibleMap = {};

        $.each(fieldMap, function (fieldId) {
            visibleMap[String(fieldId)] = true;
        });

        $.each(targets, function (fieldId) {
            if (typeof visibleMap[String(fieldId)] === 'undefined') {
                visibleMap[String(fieldId)] = true;
            }
        });

        $.each(sections, function (startId, section) {
            $.each(section.field_ids || [], function (_, fieldId) {
                if (typeof visibleMap[String(fieldId)] === 'undefined') {
                    visibleMap[String(fieldId)] = true;
                }
            });

            if (typeof visibleMap[String(startId)] === 'undefined') {
                visibleMap[String(startId)] = true;
            }
        });

        for (let i = 0; i < 25; i++) {
            let hasChanges = false;

            $.each(targets, function (fieldId, targetConfig) {
                const normalizedFieldId = String(fieldId);
                const nextVisible = evaluateConditionalLogicTarget(form, targetConfig, fieldMap, visibleMap);

                if (visibleMap[normalizedFieldId] !== nextVisible) {
                    visibleMap[normalizedFieldId] = nextVisible;
                    hasChanges = true;
                }
            });

            if (applySectionVisibility(visibleMap, sections)) {
                hasChanges = true;
            }

            if (!hasChanges) {
                break;
            }
        }

        return visibleMap;
    }

    function applyConditionalLogicVisibility(form, visibleMap, config) {
        const fieldIdsToToggle = {};

        $.each(config.targets || {}, function (fieldId) {
            fieldIdsToToggle[String(fieldId)] = true;
        });

        $.each(getSectionFieldIdsToToggle(config.sections || {}), function (fieldId) {
            fieldIdsToToggle[fieldId] = true;
        });

        $.each(fieldIdsToToggle, function (fieldId) {
            const fieldWrap = form.find('#fb-field-container-' + fieldId);
            const isVisible = visibleMap[String(fieldId)] !== false;

            fieldWrap.toggleClass('fb-hidden', !isVisible).attr('aria-hidden', isVisible ? 'false' : 'true');
        });
    }

    function hasConditionalLogicConfig(config) {
        if (!config) {
            return false;
        }

        const hasTargets = config.targets && Object.keys(config.targets).length > 0;
        const hasSections = config.sections && Object.keys(config.sections).length > 0;

        return hasTargets || hasSections;
    }

    function runConditionalLogic(form) {
        const config = getConditionalLogicConfig(form);

        if (!hasConditionalLogicConfig(config)) {
            if (form.data('fbMultiStep')) {
                formBuilderMultiStepRefreshAfterCl(form);
            }
            return;
        }

        applyConditionalLogicVisibility(form, computeConditionalLogicVisibility(form, config), config);

        if (form.data('fbMultiStep')) {
            formBuilderMultiStepRefreshAfterCl(form);
        }
    }

    $('.formbuilder-form').each(function () {
        const form = $(this);
        const config = getConditionalLogicConfig(form);

        if (!hasConditionalLogicConfig(config)) {
            return;
        }

        form.on('change blur', ':input', function () {
            clearTimeout(form.data('fbClInputTimer'));
            runConditionalLogic(form);
        });

        form.on('input', ':input', function () {
            clearTimeout(form.data('fbClInputTimer'));
            const timerId = setTimeout(function () {
                runConditionalLogic(form);
            }, CONDITIONAL_LOGIC_INPUT_DEBOUNCE_MS);
            form.data('fbClInputTimer', timerId);
        });

        form.on('formbuilder:conditional-logic-refresh', function () {
            clearTimeout(form.data('fbClInputTimer'));
            runConditionalLogic(form);
        });

        runConditionalLogic(form);
    });

    /**
     * Layout / non-input field types ignored when deciding if a step has visible content.
     * Captcha-like fields still count so a last step with only CAPTCHA is not skipped.
     */
    var FB_MULTI_STEP_LAYOUT_TYPES = {
        section_start: true,
        section_end: true,
        page_break: true,
        separator: true,
        heading: true,
        html: true,
        image: true,
        paragraph: true,
        spacer: true,
        hidden: true,
        user_id: true
    };

    /**
     * @param {jQuery} $container Field container (#fb-field-container-*).
     * @return {boolean}
     */
    function formBuilderMultiStepIsLayoutOnlyContainer($container) {
        var className = $container.attr('class') || '';
        var match = className.match(/formbuilder-field-type-([a-z0-9_]+)/i);

        if (match && FB_MULTI_STEP_LAYOUT_TYPES[match[1]]) {
            return true;
        }

        if ($container.find('.fb-section-marker, .fb-page-break-marker').length &&
            !$container.find('input:not([type="hidden"]), select, textarea').length) {
            return true;
        }

        return false;
    }

    /**
     * @param {jQuery} form
     * @param {number} stepIndex
     * @return {jQuery}
     */
    function formBuilderMultiStepGetStepEl(form, stepIndex) {
        return form.find('.fb-form-step[data-step-index="' + String(stepIndex) + '"]');
    }

    /**
     * A step is visible when it has at least one non-hidden, non-layout field container.
     *
     * @param {jQuery} form
     * @param {number} stepIndex
     * @return {boolean}
     */
    function formBuilderMultiStepIsStepVisible(form, stepIndex) {
        var $step = formBuilderMultiStepGetStepEl(form, stepIndex);
        var hasVisibleInput = false;

        if (!$step.length) {
            return false;
        }

        $step.find('[id^="fb-field-container-"]').each(function () {
            var $container = $(this);

            if ($container.hasClass('fb-hidden')) {
                return;
            }

            if (formBuilderMultiStepIsLayoutOnlyContainer($container)) {
                return;
            }

            hasVisibleInput = true;
            return false;
        });

        return hasVisibleInput;
    }

    /**
     * @param {jQuery} form
     * @return {number[]} Visible step indexes in order.
     */
    function formBuilderMultiStepGetVisibleIndexes(form) {
        var state = form.data('fbMultiStep');
        var visible = [];

        if (!state || !state.steps) {
            return visible;
        }

        $.each(state.steps, function (_, step) {
            var index = parseInt(step.index, 10);

            if (formBuilderMultiStepIsStepVisible(form, index)) {
                visible.push(index);
            }
        });

        return visible;
    }

    /**
     * @param {jQuery} form
     * @return {boolean}
     */
    function formBuilderMultiStepIsLastVisible(form) {
        var state = form.data('fbMultiStep');

        if (!state) {
            return true;
        }

        var visible = state.visibleIndexes || [];

        if (!visible.length) {
            return true;
        }

        return state.currentIndex === visible[visible.length - 1];
    }

    /**
     * @param {jQuery} form
     * @return {boolean}
     */
    function formBuilderMultiStepIsFirstVisible(form) {
        var state = form.data('fbMultiStep');

        if (!state) {
            return true;
        }

        var visible = state.visibleIndexes || [];

        if (!visible.length) {
            return true;
        }

        return state.currentIndex === visible[0];
    }

    /**
     * @param {jQuery} form
     * @param {number} fromIndex
     * @param {number} direction 1 = next, -1 = previous
     * @return {number|null}
     */
    function formBuilderMultiStepFindNeighborVisible(form, fromIndex, direction) {
        var state = form.data('fbMultiStep');
        var visible = (state && state.visibleIndexes) ? state.visibleIndexes : [];
        var pos = $.inArray(fromIndex, visible);

        if (pos === -1) {
            if (direction > 0) {
                for (var i = 0; i < visible.length; i++) {
                    if (visible[i] > fromIndex) {
                        return visible[i];
                    }
                }
            } else {
                for (var j = visible.length - 1; j >= 0; j--) {
                    if (visible[j] < fromIndex) {
                        return visible[j];
                    }
                }
            }
            return visible.length ? (direction > 0 ? visible[0] : visible[visible.length - 1]) : null;
        }

        var nextPos = pos + direction;

        if (nextPos < 0 || nextPos >= visible.length) {
            return null;
        }

        return visible[nextPos];
    }

    /**
     * Nearest visible step to a (possibly empty) index.
     *
     * @param {jQuery} form
     * @param {number} preferredIndex
     * @return {number|null}
     */
    function formBuilderMultiStepNearestVisible(form, preferredIndex) {
        var state = form.data('fbMultiStep');
        var visible = (state && state.visibleIndexes) ? state.visibleIndexes : [];

        if (!visible.length) {
            return null;
        }

        if ($.inArray(preferredIndex, visible) !== -1) {
            return preferredIndex;
        }

        var best = visible[0];
        var bestDist = Math.abs(best - preferredIndex);

        for (var i = 1; i < visible.length; i++) {
            var dist = Math.abs(visible[i] - preferredIndex);

            if (dist < bestDist) {
                best = visible[i];
                bestDist = dist;
            }
        }

        return best;
    }

    /**
     * @param {jQuery} $container
     * @return {boolean}
     */
    function formBuilderMultiStepIsRequiredFieldEmpty($container) {
        var $file = $container.find('.fb-uploaded-files');

        if ($file.length) {
            return $.trim(String($file.val() || '')) === '';
        }

        if ($container.hasClass('formbuilder-field-type-star') ||
            $container.hasClass('formbuilder-field-type-scale') ||
            $container.hasClass('formbuilder-field-type-likert_matrix_scale')) {
            return $container.find('input[type="radio"]:checked, input[type="checkbox"]:checked').length === 0;
        }

        var $choiceInputs = $container.find('input[type="checkbox"], input[type="radio"]');
        var $otherInputs = $container.find('input, select, textarea').filter(function () {
            var type = (($(this).attr('type') || '') + '').toLowerCase();

            if (type === 'hidden' || type === 'button' || type === 'submit' || type === 'checkbox' || type === 'radio') {
                return false;
            }

            if ($(this).prop('disabled')) {
                return false;
            }

            return true;
        });

        if ($choiceInputs.length && !$otherInputs.length) {
            return $choiceInputs.filter(':checked').length === 0;
        }

        var empty = false;

        $otherInputs.each(function () {
            var $el = $(this);

            if ($el.is('select')) {
                var val = $el.val();

                if (val === null || val === undefined || val === '' || ($.isArray(val) && !val.length)) {
                    empty = true;
                    return false;
                }

                return;
            }

            if ($.trim(String($el.val() || '')) === '') {
                empty = true;
                return false;
            }
        });

        if ($otherInputs.length) {
            return empty;
        }

        if ($choiceInputs.length) {
            return $choiceInputs.filter(':checked').length === 0;
        }

        return false;
    }

    /**
     * Client-side required check for visible required fields in a step.
     *
     * @param {jQuery} form
     * @param {number} stepIndex
     * @return {Object} Map of field{id} => message (empty if valid).
     */
    function formBuilderMultiStepValidateRequiredClient(form, stepIndex) {
        var errors = {};
        var $step = formBuilderMultiStepGetStepEl(form, stepIndex);
        var blankMsg = 'This field is required.';

        $step.find('.fb-form-field-required').each(function () {
            var $container = $(this);

            if ($container.hasClass('fb-hidden') || formBuilderMultiStepIsLayoutOnlyContainer($container)) {
                return;
            }

            if (!formBuilderMultiStepIsRequiredFieldEmpty($container)) {
                return;
            }

            var idAttr = $container.attr('id') || '';
            var fieldId = idAttr.replace('fb-field-container-', '');

            if (fieldId) {
                errors['field' + fieldId] = blankMsg;
            }
        });

        return errors;
    }

    /**
     * Show field errors using the same markup as the submit handler.
     *
     * @param {jQuery} form
     * @param {Object} messageMap
     */
    function formBuilderMultiStepShowFieldErrors(form, messageMap) {
        form.find('.fb-error-msg').remove();
        form.find('.formbuilder-error-container').removeClass('formbuilder-error-container');

        $.each(messageMap, function (key, value) {
            var errorFieldId = String(key).replace('field', '');
            form.find('#fb-field-container-' + errorFieldId)
                .addClass('formbuilder-error-container')
                .append('<span class="fb-error-msg">' + value + '</span>');
        });

        var firstError = Object.keys(messageMap)[0];

        if (!firstError) {
            return;
        }

        var subFieldIndex = firstError.indexOf('-');
        var firstErrorItem;

        if (subFieldIndex > 0) {
            var errorFieldId = firstError.substr(0, subFieldIndex).replace('field', '');
            var subField = firstError.substr(subFieldIndex + 1);
            firstErrorItem = form.find('#fb-subfield-container-' + subField + '-' + errorFieldId);
        } else {
            firstErrorItem = form.find('#fb-field-container-' + String(firstError).replace('field', ''));
        }

        if (firstErrorItem.length && firstErrorItem.offset()) {
            $('html, body').animate({
                scrollTop: firstErrorItem.offset().top - 300
            }, 300);
        }
    }

    /**
     * Clear step field errors.
     *
     * @param {jQuery} form
     */
    function formBuilderMultiStepClearErrors(form) {
        form.find('.fb-error-msg').remove();
        form.find('.formbuilder-error-container').removeClass('formbuilder-error-container');
    }

    /**
     * Update Prev / Next / Submit visibility for the current visible step.
     *
     * @param {jQuery} form
     */
    function formBuilderMultiStepUpdateButtons(form) {
        var state = form.data('fbMultiStep');
        var $prev = form.find('.fb-prev-button');
        var $next = form.find('.fb-next-button');
        var $submit = form.find('.fb-submit-button');
        var isFirst = formBuilderMultiStepIsFirstVisible(form);
        var isLast = formBuilderMultiStepIsLastVisible(form);

        if ($prev.length) {
            $prev.prop('hidden', isFirst);
        }

        if ($next.length) {
            $next.prop('hidden', isLast);
        }

        if ($submit.length) {
            $submit.prop('hidden', !isLast);
        }

        if (state) {
            form.find('input[name="fb_current_step"]').val(String(state.currentIndex));
        }
    }

    /**
     * Update progress bar fill and label.
     *
     * @param {jQuery} form
     */
    function formBuilderMultiStepUpdateProgressBar(form) {
        var state = form.data('fbMultiStep');
        var $preview = form.find('.fb-form-preview--multi-step');
        var $bar = $preview.find('.fb-form-progress-bar');
        var $fill = $preview.find('.fb-form-progress-bar__fill');
        var $label = $preview.find('.fb-form-progress-bar__label');

        if (!$bar.length || !state) {
            return;
        }

        var visible = state.visibleIndexes || [];
        var total = visible.length || 1;
        var pos = $.inArray(state.currentIndex, visible);
        var currentOrdinal = pos === -1 ? 1 : pos + 1;
        var percent = Math.round((currentOrdinal / total) * 100);
        var stepMeta = null;

        $.each(state.steps || [], function (_, step) {
            if (parseInt(step.index, 10) === state.currentIndex) {
                stepMeta = step;
                return false;
            }
        });

        $fill.css('width', percent + '%');
        $bar.attr('aria-valuenow', percent);

        if ($label.length) {
            var title = stepMeta && stepMeta.title ? stepMeta.title : '';
            var labelText = title
                ? title + ' (' + currentOrdinal + ' / ' + total + ')'
                : currentOrdinal + ' / ' + total;
            $label.text(labelText);
        }
    }

    /**
     * Update steps breadcrumbs: visited enablement, current marker.
     *
     * @param {jQuery} form
     */
    function formBuilderMultiStepUpdateBreadcrumbs(form) {
        var state = form.data('fbMultiStep');
        var $preview = form.find('.fb-form-preview--multi-step');
        var $items = $preview.find('.fb-form-progress-steps__item');

        if (!$items.length || !state) {
            return;
        }

        var visibleSet = {};

        $.each(state.visibleIndexes || [], function (_, idx) {
            visibleSet[idx] = true;
        });

        $items.each(function () {
            var $item = $(this);
            var index = parseInt($item.attr('data-step-index'), 10);
            var $button = $item.find('.fb-form-progress-steps__button');
            var isCurrent = index === state.currentIndex;
            var isVisited = !!state.visited[index];
            var isVisibleStep = !!visibleSet[index];

            $item.toggleClass('is-current', isCurrent);
            $item.toggleClass('is-visited', isVisited);
            $item.toggleClass('is-hidden-step', !isVisibleStep);

            if (isCurrent) {
                $button.attr('aria-current', 'step');
            } else {
                $button.removeAttr('aria-current');
            }

            // Only visited (and still visible) steps are clickable.
            $button.prop('disabled', !(isVisited && isVisibleStep));
        });

        // Connector N→N+1 is complete when the next visible step has been visited.
        $items.each(function () {
            var $item = $(this);
            var nextVisited = false;

            if (!$item.hasClass('is-hidden-step')) {
                var $nextVisible = $item.nextAll('.fb-form-progress-steps__item:not(.is-hidden-step)').first();
                nextVisited = $nextVisible.length > 0 && $nextVisible.hasClass('is-visited');
            }

            $item.toggleClass('is-connector-complete', nextVisited);
        });
    }

    /**
     * Show one step, hide others; scroll and focus.
     *
     * @param {jQuery} form
     * @param {number} stepIndex
     * @param {Object} [options]
     * @param {boolean} [options.scroll=true]
     * @param {boolean} [options.focus=true]
     */
    function formBuilderMultiStepShowStep(form, stepIndex, options) {
        var state = form.data('fbMultiStep');
        var opts = options || {};
        var doScroll = opts.scroll !== false;
        var doFocus = opts.focus !== false;

        if (!state) {
            return;
        }

        state.currentIndex = stepIndex;
        state.visited[stepIndex] = true;
        form.data('fbMultiStep', state);

        form.find('.fb-form-step').each(function () {
            var $step = $(this);
            var idx = parseInt($step.attr('data-step-index'), 10);
            var isCurrent = idx === stepIndex;

            $step.prop('hidden', !isCurrent);
            $step.attr('aria-hidden', isCurrent ? 'false' : 'true');
        });

        formBuilderMultiStepUpdateButtons(form);
        formBuilderMultiStepUpdateProgressBar(form);
        formBuilderMultiStepUpdateBreadcrumbs(form);

        if (doScroll) {
            var $preview = form.find('.fb-form-preview--multi-step');
            var $scrollTarget = $preview.length ? $preview : form;

            if ($scrollTarget.offset()) {
                $('html, body').animate({
                    scrollTop: $scrollTarget.offset().top - 80
                }, 300);
            }
        }

        if (doFocus) {
            var $currentStep = formBuilderMultiStepGetStepEl(form, stepIndex);
            var $focusable = $currentStep.find('input, select, textarea, button, a[href], [tabindex]:not([tabindex="-1"])')
                .filter(function () {
                    var $el = $(this);

                    if ($el.prop('disabled') || $el.prop('hidden')) {
                        return false;
                    }

                    if ($el.closest('.fb-hidden').length) {
                        return false;
                    }

                    var type = (($el.attr('type') || '') + '').toLowerCase();

                    if (type === 'hidden') {
                        return false;
                    }

                    return $el.is(':visible');
                })
                .first();

            if ($focusable.length) {
                setTimeout(function () {
                    $focusable.trigger('focus');
                }, 320);
            }
        }
    }

    /**
     * Recompute visible steps after CL; move off empty current step if needed.
     *
     * @param {jQuery} form
     */
    function formBuilderMultiStepRefreshAfterCl(form) {
        var state = form.data('fbMultiStep');

        if (!state) {
            return;
        }

        state.visibleIndexes = formBuilderMultiStepGetVisibleIndexes(form);
        form.data('fbMultiStep', state);

        var nextIndex = formBuilderMultiStepNearestVisible(form, state.currentIndex);

        if (nextIndex === null) {
            formBuilderMultiStepUpdateButtons(form);
            formBuilderMultiStepUpdateProgressBar(form);
            formBuilderMultiStepUpdateBreadcrumbs(form);
            return;
        }

        if (nextIndex !== state.currentIndex) {
            formBuilderMultiStepShowStep(form, nextIndex, { scroll: false, focus: false });
        } else {
            formBuilderMultiStepUpdateButtons(form);
            formBuilderMultiStepUpdateProgressBar(form);
            formBuilderMultiStepUpdateBreadcrumbs(form);
        }
    }

    /**
     * @param {jQuery} form
     * @param {number} stepIndex
     * @return {string[]}
     */
    function formBuilderMultiStepGetStepFieldIds(form, stepIndex) {
        var state = form.data('fbMultiStep');
        var fieldIds = [];

        if (!state) {
            return fieldIds;
        }

        $.each(state.steps || [], function (_, step) {
            if (parseInt(step.index, 10) === stepIndex) {
                fieldIds = step.field_ids || [];
                return false;
            }
        });

        return fieldIds;
    }

    /**
     * Advance to the next visible step after client + server validation.
     *
     * @param {jQuery} form
     */
    function formBuilderMultiStepGoNext(form) {
        var state = form.data('fbMultiStep');

        if (!state || state.busy) {
            return;
        }

        var currentIndex = state.currentIndex;
        var nextIndex = formBuilderMultiStepFindNeighborVisible(form, currentIndex, 1);

        if (nextIndex === null) {
            return;
        }

        formBuilderMultiStepClearErrors(form);

        var clientErrors = formBuilderMultiStepValidateRequiredClient(form, currentIndex);

        if (Object.keys(clientErrors).length) {
            formBuilderMultiStepShowFieldErrors(form, clientErrors);
            return;
        }

        var $nextBtn = form.find('.fb-next-button');
        var fieldIds = formBuilderMultiStepGetStepFieldIds(form, currentIndex);

        state.busy = true;
        form.data('fbMultiStep', state);
        $nextBtn.addClass('fb-button-loading').prop('disabled', true);

        $.ajax({
            type: 'POST',
            url: formbuilder_vars.ajaxurl,
            dataType: 'json',
            data: {
                action: 'formbuilder_validate_step',
                data: form.serialize(),
                field_ids: fieldIds,
                step_index: currentIndex,
                location: window.location.href
            },
            success: function (response) {
                if (response && response.status === 'success') {
                    formBuilderMultiStepShowStep(form, nextIndex);
                    return;
                }

                if (response && response.message && typeof response.message === 'object') {
                    formBuilderMultiStepShowFieldErrors(form, response.message);
                } else if (response && response.message) {
                    form.find('.fb-failed-msg').remove();
                    form.append('<span class="fb-failed-msg">' + response.message + '</span>');
                }
            },
            error: function () {
                // Allow advance only when server is unreachable? Prefer stay put.
            },
            complete: function () {
                var latest = form.data('fbMultiStep');

                if (latest) {
                    latest.busy = false;
                    form.data('fbMultiStep', latest);
                }

                $nextBtn.removeClass('fb-button-loading').prop('disabled', false);
            }
        });
    }

    /**
     * Go to the previous visible step.
     *
     * @param {jQuery} form
     */
    function formBuilderMultiStepGoPrev(form) {
        var state = form.data('fbMultiStep');

        if (!state || state.busy) {
            return;
        }

        var prevIndex = formBuilderMultiStepFindNeighborVisible(form, state.currentIndex, -1);

        if (prevIndex === null) {
            return;
        }

        formBuilderMultiStepClearErrors(form);
        formBuilderMultiStepShowStep(form, prevIndex);
    }

    /**
     * Ensure hidden inputs for draft resume exist and update them.
     *
     * @param {jQuery} form
     * @param {number|string} entryId
     * @param {string} resumeKey
     */
    function formBuilderMultiStepUpdateResumeHidden(form, entryId, resumeKey) {
        var $entry = form.find('input[name="fb_entry_id"]');
        var $key = form.find('input[name="fb_resume_key"]');

        if (!$entry.length) {
            form.find('.fb-container').prepend('<input type="hidden" name="fb_entry_id" value="" />');
            $entry = form.find('input[name="fb_entry_id"]');
        }

        if (!$key.length) {
            form.find('.fb-container').prepend('<input type="hidden" name="fb_resume_key" value="" />');
            $key = form.find('input[name="fb_resume_key"]');
        }

        if (typeof entryId !== 'undefined' && entryId !== null && entryId !== '') {
            $entry.val(String(entryId));
        }

        if (resumeKey) {
            $key.val(String(resumeKey));
        }
    }

    /**
     * Save draft via AJAX; does not advance the step.
     *
     * @param {jQuery} form
     */
    function formBuilderMultiStepSaveDraft(form) {
        var state = form.data('fbMultiStep');
        var $saveBtn = form.find('.fb-save-resume-button');
        var $message = form.find('.fb-save-resume-message');
        var config = getConditionalLogicConfig(form) || {};

        if (state && state.busy) {
            return;
        }

        if (state) {
            state.busy = true;
            form.data('fbMultiStep', state);
        }

        $saveBtn.addClass('fb-button-loading').prop('disabled', true);
        $message.prop('hidden', true).empty();

        $.ajax({
            type: 'POST',
            url: formbuilder_vars.ajaxurl,
            dataType: 'json',
            data: {
                action: 'formbuilder_save_draft',
                data: form.serialize(),
                location: window.location.href
            },
            success: function (response) {
                if (!response) {
                    return;
                }

                if (response.entry_id || response.resume_key) {
                    formBuilderMultiStepUpdateResumeHidden(form, response.entry_id, response.resume_key);
                }

                if (response.status === 'success' || response.status === 'ok') {
                    var msg = response.message || config.save_resume_message || '';
                    var resumeUrl = response.resume_url || '';

                    if (resumeUrl) {
                        msg = String(msg);
                        if (msg.indexOf('{resume_url}') !== -1) {
                            msg = msg.split('{resume_url}').join(resumeUrl);
                        } else if (msg.indexOf(resumeUrl) === -1) {
                            msg = msg + (msg ? ' ' : '') + '<a href="' + resumeUrl + '">' + resumeUrl + '</a>';
                        }
                    }

                    $message.html(msg).prop('hidden', false);
                } else if (response.message) {
                    $message.text(typeof response.message === 'string' ? response.message : 'Unable to save progress.')
                        .prop('hidden', false);
                }
            },
            complete: function () {
                var latest = form.data('fbMultiStep');

                if (latest) {
                    latest.busy = false;
                    form.data('fbMultiStep', latest);
                }

                $saveBtn.removeClass('fb-button-loading').prop('disabled', false);
            }
        });
    }

    /**
     * Initialize multi-step navigation for a single form.
     *
     * @param {jQuery} form
     */
    function formBuilderMultiStepInit(form) {
        var $preview = form.find('.fb-form-preview--multi-step');

        if (!$preview.length) {
            return;
        }

        var config = getConditionalLogicConfig(form);

        if (!config || !config.is_multi_step || !config.steps || !config.steps.length) {
            return;
        }

        var startIndex = parseInt(form.find('input[name="fb_current_step"]').val(), 10);

        if (isNaN(startIndex) || startIndex < 0) {
            startIndex = 0;
        }

        var visited = {};
        visited[startIndex] = true;

        // Mark all steps up to start as visited (resume mid-form).
        for (var i = 0; i <= startIndex; i++) {
            visited[i] = true;
        }

        form.data('fbMultiStep', {
            steps: config.steps,
            currentIndex: startIndex,
            visited: visited,
            visibleIndexes: [],
            busy: false,
            progressIndicator: config.progress_indicator || 'bar'
        });

        form.data('fbMultiStep').visibleIndexes = formBuilderMultiStepGetVisibleIndexes(form);

        var nearest = formBuilderMultiStepNearestVisible(form, startIndex);

        if (nearest === null) {
            nearest = startIndex;
        }

        formBuilderMultiStepShowStep(form, nearest, { scroll: false, focus: false });

        form.off('.fbMultiStep');

        form.on('click.fbMultiStep', '.fb-next-button', function (e) {
            e.preventDefault();
            formBuilderMultiStepGoNext(form);
        });

        form.on('click.fbMultiStep', '.fb-prev-button', function (e) {
            e.preventDefault();
            formBuilderMultiStepGoPrev(form);
        });

        form.on('click.fbMultiStep', '.fb-save-resume-button', function (e) {
            e.preventDefault();
            formBuilderMultiStepSaveDraft(form);
        });

        form.on('click.fbMultiStep', '.fb-form-progress-steps__button', function (e) {
            e.preventDefault();

            var $btn = $(this);

            if ($btn.prop('disabled')) {
                return;
            }

            var targetIndex = parseInt($btn.attr('data-step-index'), 10);
            var state = form.data('fbMultiStep');

            if (!state || isNaN(targetIndex)) {
                return;
            }

            if (!state.visited[targetIndex]) {
                return;
            }

            if ($.inArray(targetIndex, state.visibleIndexes || []) === -1) {
                return;
            }

            formBuilderMultiStepClearErrors(form);
            formBuilderMultiStepShowStep(form, targetIndex);
        });

        form.on('formbuilder:conditional-logic-refresh.fbMultiStep', function () {
            formBuilderMultiStepRefreshAfterCl(form);
        });
    }

    $('.formbuilder-form').each(function () {
        formBuilderMultiStepInit($(this));
    });

    $(".fb-field-content input, .fb-field-content select, .fb-field-content textarea").on('focus', function () {
        $(this).parent().addClass('fb-field-focussed');
    }).on('focusout', function () {
        $(this).parent().removeClass('fb-field-focussed');
    })

    var upload_counter = 0;
    var uploader = {};
    $('.fb-file-uploader').each(function () {
        upload_counter++;
        var attr_element_id = $(this).attr('id'),
            size = $(this).attr('data-max-upload-size'),
            selector = $(this),
            wrapper = selector.closest('.fb-file-uploader-wrapper'),
            uploader_label = $(this).attr('data-upload-label'),
            multiple_upload = ($(this).attr('data-multiple-uploads') == 'true') ? true : false,
            upload_limit = $(this).attr('data-multiple-uploads-limit'),
            upload_limit_message = $(this).attr('data-multiple-uploads-error-message'),
            extensions = $(this).attr('data-extensions'),
            extension_error_message = $(this).attr('data-extensions-error-message'),
            extensions_array = extensions.split(','),
            form_id = selector.closest('form').find('input[name="form_id"]').first().val(),
            field_name = wrapper.find('.fb-uploaded-files').attr('name') || '',
            field_id_match = field_name.match(/item_meta\[(\d+)\]/),
            field_id = field_id_match ? field_id_match[1] : '';

        if (!form_id) {
            form_id = selector.closest('.fb-container').find('input[name="form_id"]').first().val();
        }

        upload_limit = upload_limit < 1 ? 1 : upload_limit;

        uploader['uploader' + upload_counter] = new qq.FileUploader({
            element: document.getElementById(attr_element_id),
            action: formbuilder_vars.ajaxurl,
            params: {
                action: 'formbuilder_file_upload_action',
                file_uploader_nonce: formbuilder_vars.ajax_nounce,
                form_id: form_id,
                field_id: field_id,
            },
            allowedExtensions: extensions_array,
            sizeLimit: size,
            minSizeLimit: 50,
            uploadButtonText: uploader_label,

            onSubmit: function (id, fileName) {
                if (multiple_upload == true && upload_limit != -1) {
                    var limit_counter = selector.parent().find('.fb-multiple-upload-limit').val();
                    limit_counter++;
                    selector.parent().find('.fb-multiple-upload-limit').val(limit_counter);
                    if (limit_counter > upload_limit) {
                        upload_limit_message = (upload_limit_message != '') ? upload_limit_message : 'Maximum number of files allowed is ' + upload_limit;
                        alert(upload_limit_message);
                        selector.parent().find('.fb-multiple-upload-limit').val(upload_limit);
                        return false;
                    }
                }
            },

            onProgress: function (id, fileName, loaded, total) { },

            onComplete: function (id, fileName, responseJSON) {

                if (responseJSON.success) {

                    $('#' + attr_element_id).closest('.fb-file-uploader-wrapper').find('.fb-error').html('');
                    var extension_array = fileName.split('.');
                    var extension = extension_array.pop();

                    if (extension == 'jpg' || extension == 'jpeg' || extension == 'png' || extension == 'gif' || extension == 'JPG' || extension == 'JPEG' || extension == 'PNG' || extension == 'GIF') {
                        var preview_img = responseJSON.url;
                    }

                    var preview_html = '<div class="fb-prev-holder" id="fb-uploaded-' + id + '">';
                    if (preview_img) {
                        preview_html += '<img src="' + preview_img + '" />';
                    }
                    preview_html += '<span class="fb-prev-name">' + fileName + '</span></div>';

                    if (multiple_upload) {
                        var url = responseJSON.url;
                        var added_url = $('#' + attr_element_id).closest('.fb-file-uploader-wrapper').find('.fb-uploaded-files').val();
                        if (added_url == '') {
                            added_url = url;
                        } else {
                            var added_url_array = added_url.split(',');
                            added_url_array.push(url);
                            added_url = added_url_array.join();
                        }

                        $('#' + attr_element_id).closest('.fb-file-uploader-wrapper').find('.fb-uploaded-files').val(added_url).trigger('change');
                        $('#' + attr_element_id).closest('.fb-file-uploader-wrapper').find('.fb-file-preview').append(preview_html);

                    } else {
                        $('#' + attr_element_id).closest('.fb-file-uploader-wrapper').find('.fb-uploaded-files').val(responseJSON.url).trigger('change');
                        $('#' + attr_element_id).closest('.fb-file-uploader-wrapper').find('.fb-file-preview').html(preview_html);
                    }

                } else {
                    console.log(responseJSON);
                }
            },

            onCancel: function (id, fileName) { },
            onError: function (id, fileName, xhr) { },

            messages: {
                typeError: extension_error_message,
                sizeError: "{file} is too large, maximum file size is {sizeLimit}.",
                minSizeError: "{file} is too small, minimum file size is {minSizeLimit}.",
                emptyError: "{file} is empty, please select files again without it.",
                onLeave: "The files are being uploaded, if you leave now the upload will be cancelled."
            },

            showMessage: function (message) {
                alert(message);
            },

            multiple: multiple_upload
        });

    });


    $('body').on('click', '.fb-preview-remove', function () {
        const selector = $(this);
        const wrapper = selector.closest('.fb-file-uploader-wrapper');
        const field_name = wrapper.find('.fb-uploaded-files').attr('name') || '';
        const field_id_match = field_name.match(/item_meta\[(\d+)\]/);
        const field_id = field_id_match ? field_id_match[1] : '';
        let form_id = wrapper.closest('form').find('input[name="form_id"]').first().val();
        if (!form_id) {
            form_id = wrapper.closest('.fb-container').find('input[name="form_id"]').first().val();
        }

        $.ajax({
            url: formbuilder_vars.ajaxurl,
            data: {
                action: 'formbuilder_file_delete_action',
                path: selector.data('path'),
                form_id: form_id,
                field_id: field_id,
                _wpnonce: formbuilder_vars.ajax_nounce
            },
            type: 'post',
            success: function (res) {
                if (res == 'success') {
                    var parent_wrapper = selector.closest('.fb-file-uploader-wrapper')
                    var prev_url = parent_wrapper.find('.fb-uploaded-files').val();
                    var new_url = prev_url.replace(selector.data('url'), '');
                    new_url = new_url.replace(',,', ',');
                    parent_wrapper.find('.fb-uploaded-files').val(new_url).trigger('change');

                    var limit_counter = parent_wrapper.find('.fb-multiple-upload-limit').val();
                    limit_counter--;
                    limit_counter = (limit_counter < 0) ? 0 : limit_counter;
                    parent_wrapper.find('.fb-multiple-upload-limit').val(limit_counter);

                    selector.parent().fadeOut('1500', function () {
                        selector.parent().remove();
                        parent_wrapper.find('#' + selector.attr('data-remove-id')).remove();
                    });
                }
            }
        });
    });

});