(function ($) {
    "use strict";

    var ajaxUrl = formbuilder_admin_js_obj.ajax_url;
    var adminNonce = formbuilder_admin_js_obj.ajax_nonce;

    $('.fb-color-picker').wpColorPicker({
        change: function (event, ui) {
            var element = $(event.target).closest('.wp-picker-input-wrap').find('.wp-color-picker');
            if (element) {
                setTimeout(function () {
                    element.trigger('change');
                }, 100);
            }
        },
        clear: function (event) {
            var element = $(event.target).closest('.wp-picker-input-wrap').find('.wp-color-picker');
            if (element) {
                setTimeout(function () {
                    element.trigger('change');
                }, 100);
            }
        }
    });

    // Call all the necessary functions for Icon Picker
    $('body').on('click', '.fb-icon-box-wrap .fb-icon-list li', function () {
        var icon_class = $(this).find('i').attr('class');
        $(this).closest('.fb-icon-box').find('.fb-icon-list li').removeClass('icon-active');
        $(this).addClass('icon-active');
        $(this).closest('.fb-icon-box').prev('.fb-selected-icon').children('i').attr('class', '').addClass(icon_class);
        $(this).closest('.fb-icon-box').next('input').val(icon_class).trigger('change');
        $(this).closest('.fb-icon-box').slideUp();
    });

    $('body').on('click', '.fb-icon-box-wrap .fb-selected-icon', function () {
        $(this).next().slideToggle();
    });

    $('body').on('change', '.fb-icon-box-wrap .fb-icon-search select', function () {
        var selected = $(this).val();
        $(this).parents('.fb-icon-box').find('.fb-icon-search-input').val('');
        $(this).parents('.fb-icon-box').children('.fb-icon-list').hide().removeClass('active');
        $(this).parents('.fb-icon-box').children('.' + selected).fadeIn().addClass('active');
        $(this).parents('.fb-icon-box').children('.' + selected).find('li').show();
    });

    $('body').on('keyup', '.fb-icon-box-wrap .fb-icon-search input', function (e) {
        var $input = $(this);
        var keyword = $input.val().toLowerCase();
        var search_criteria = $input.closest('.fb-icon-box').find('.fb-icon-list.active i');
        delay(function () {
            $(search_criteria).each(function () {
                if ($(this).attr('class').indexOf(keyword) > -1) {
                    $(this).parent().show();
                } else {
                    $(this).parent().hide();
                }
            });
        }, 500);
    });

    var delay = (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

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
            slide: function (e, ui) {
                $(this).next().val(ui.value).trigger('change');
            }
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

    // Show/ Hide Single Page Options
    $(document).on('change', '.fb-typography-font-family', function () {
        var $this = $(this);
        var font_family = $(this).val();
        var standard_fonts = ['Default', 'Helvetica', 'Verdana', 'Arial', 'Times', 'Georgia', 'Courier', 'Trebuchet', 'Tahoma', 'Palatino'];
        if (!standard_fonts.includes(font_family)) {
            var fontId = $this.attr('id');
            var $fontId = $('link#' + fontId);

            if ($fontId.length > 0) {
                $fontId.remove();
            }
            $('head').append('<link rel="stylesheet" id="' + fontId + '" href="https://fonts.googleapis.com/css?family=' + font_family + ':100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i&subset=latin,latin-ext&display=swap" type="text/css" media="all">');
        }
        $.ajax({
            url: ajaxUrl,
            data: {
                action: 'formbuilder_get_google_font_variants',
                font_family: font_family,
                wp_nonce: adminNonce
            },
            beforeSend: function () {
                $this.closest('.fb-typography-font-family-field').next('.fb-typography-font-style-field').addClass('fb-typography-loading');
            },
            success: function (response) {
                $this.closest('.fb-typography-font-family-field').next('.fb-typography-font-style-field').removeClass('fb-typography-loading');
                $this.closest('.fb-typography-font-family-field').next('.fb-typography-font-style-field').find('select').html(response).trigger("chosen:updated").trigger('change');
            }
        });
    });

    $('body').find(".fb-typography-fields select").chosen({width: "100%"});

    $('.fb-style-sidebar [name]').on('change', function () {
        var id = $(this).attr('id');
        if (id) {
            var to = $(this).val();
            var unit = $(this).attr('data-unit');
            unit = (unit === undefined) ? '' : unit;

            if ($(this).attr('data-style')) {
                var weight = to.replace(/\D/g, '');
                var eid = id.replace('style', 'weight');
                var css = '--' + eid + ':' + weight + ';';

                var style = to.replace(/\d+/g, '');
                if ('' == style) {
                    style = 'normal';
                }
                css += '--' + id + ':' + style + '}';
            } else {
                var css = '--' + id + ':' + to + unit + '}';
            }
            fbDynamicCss(id, css, to);
        }
    });

    $('body').on('click', '.fb-setting-tab li', function () {
        // Add and remove the class for active tab
        $(this).closest('.fb-tab-container').find('.fb-setting-tab li').removeClass('fb-tab-active');
        $(this).addClass('fb-tab-active');

        var selected_menu = $(this).attr('data-tab');

        $(this).closest('.fb-tab-container').find('.fb-tab-content').hide();

        // Display The Clicked Tab Content
        $(this).closest('.fb-tab-container').find('.' + selected_menu).show();


    });

    $('body').on('click', '.fb-settings-heading', function () {
        if ($(this).hasClass('fb-active'))
            $(this).siblings('.fb-form-settings').slideDown();
            // $(this).find('.fb-triangle-small-down').css("transform","rotate(180deg)");
            $(this).removeClass('fb-active');
            $(this).next('.fb-form-settings').slideToggle();
            return;
        $(this).siblings('.fb-form-settings').slideUp();
        $(this).siblings('.fb-settings-heading').removeClass('fb-active');
        // $(this).find('.fb-triangle-small-down').css("transform","rotate(180deg)");
        $(this).addClass('fb-active');
        $(this).next('.fb-form-settings').slideToggle();
    });

    // Linked button
    $('.fb-linked').on('click', function () {
        $(this).closest('.fb-unit-fields').addClass('fb-not-linked');
    });

    // Unlinked button
    $('.fb-unlinked').on('click', function () {
        $(this).closest('.fb-unit-fields').removeClass('fb-not-linked');
    });

    // Values linked inputs
    $('.fb-unit-fields input').on('input', function () {
        var $val = $(this).val();
        $(this).closest('.fb-unit-fields:not(.fb-not-linked)').find('input').each(function (key, value) {
            $(this).val($val).change();
        });
    });

    $('#fb-template-preview-form-id').on('change', function () {
        const formId = $(this).val();
        const templateId = $('#post_ID').val();
        $('.fb-form-wrap').html('');
        $.ajax({
            url: ajaxUrl,
            type: 'POST',
            data: {
                action: 'formbuilder_template_style_preview',
                form_id: formId,
                template_id: templateId
            },
            dataType: "html",
            success: function (data) {
                if (formId) {
                    data = data.replace('fb-container-' + formId, 'fb-container-00');
                }
                $('.fb-form-wrap').html(data);
            }
        });
    })

    // Custom File Upload
    $(".fb-dropzone").change(function () {
        var $input = $(this);
        var input = this;
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var htmlPreview = '<p>' + input.files[0].name + '</p>';
                var wrapperZone = $input.parent();
                var previewZone = $input.parent().parent().find('.fb-preview-zone');
                var boxZone = $input.closest('form').find('.fb-box-body');

                wrapperZone.removeClass('dragover');
                previewZone.removeClass('hidden');
                boxZone.empty();
                boxZone.append(htmlPreview);
            };

            reader.readAsDataURL(input.files[0]);
        }
    });

    $('.fb-dropzone-wrapper').on('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).addClass('dragover');
    });

    $('.fb-dropzone-wrapper').on('dragleave', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).removeClass('dragover');
    });

    $('.fb-remove-preview').on('click', function () {
        try {
            var boxZone = $(this).parents('.fb-preview-zone').find('.box-body');
            var previewZone = $(this).parents('.fb-preview-zone');
            var dropzone = $(this).parents('.fb-preview-zone').siblings('.fb-dropzone-wrapper').find('.fb-dropzone');
            boxZone.empty();
            previewZone.addClass('hidden');
            dropzone.wrap('<form>').closest('form').get(0).reset();
            dropzone.unwrap();
        } catch (err) {
            console.log(err)
        }

    });

    $('body').on('click', '#fb-copy-shortcode', function () {
        if ($(this).closest('#fb-add-template').hasClass('fb-success')) {
            return false;
        }
        var textToCopy = $(this).prev('input').val();
        var tempTextarea = $('<textarea>');
        var successDiv = $(this).closest('#fb-add-template');
        $('body').append(tempTextarea);
        tempTextarea.val(textToCopy).select();
        document.execCommand('copy');
        tempTextarea.remove();
        successDiv.addClass('fb-success');
        setTimeout(function () {
            successDiv.removeClass('fb-success');
        }, 3000)
    });

    $(document).ready(function () {
        setTimeout(function () {
            jQuery('.fb-settings-updated').fadeOut('slow', function () {
                this.parentNode.removeChild(this);
            });
        }, 3000);
        
        $('.post-type-formbuilder-styles #submitpost').appendTo('#titlediv');
    });

    $(".fb-field-content input, .fb-field-content select, .fb-field-content textarea").on('focus', function () {
        $(this).parent().addClass('fb-field-focussed');
    }).on('focusout', function () {
        $(this).parent().removeClass('fb-field-focussed');
    })
})(jQuery);

function fbDynamicCss(control, style, val) {
    ctrlEscaped = control.replaceAll('(', '\\(').replaceAll(')', '\\)');
    jQuery('style.' + ctrlEscaped).remove();
    if (val) {
        // console.log(style);
        jQuery('head').append('<style class="' + control + '">body #fb-container-00{' + style + '}</style>');
    }
}