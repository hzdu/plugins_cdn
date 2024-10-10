(function ($) {
    "use strict";

    $(document).ready(function () {

        var ajaxUrl = uwcc_admin_js_obj.ajax_url;
        var adminNonce = uwcc_admin_js_obj.ajax_nonce;

        $('.uwcc-color-picker').wpColorPicker();
        codeMirrorDisplay();

        $('body').on('click', '.uwcc-tab', function () {
            var selected_menu = $(this).data('tab');

            $('.uwcc-menu-field-wrap .tab-content').hide();

            // Display The Clicked Tab Content
            $('#' + selected_menu).show();

            // Add and remove the class for active tab
            $(this).parent().find('.uwcc-tab').removeClass('uwcc-tab-active');
            $(this).addClass('uwcc-tab-active');
        });

        $('body').on('click', '.uwcc-submenu-tab', function () {
            var selected_menu = $(this).data('tab');

            $(this).parent('.uwcc-submenu').next('.uwcc-submenu-content').find('.uwcc-submenu-section').hide();

            // Display The Clicked Tab Content
            $(this).parent('.uwcc-submenu').next('.uwcc-submenu-content').find('#' + selected_menu).show();

            // Add and remove the class for active tab
            $(this).parent('.uwcc-submenu').find('.uwcc-submenu-tab').removeClass('uwcc-tab-active');
            $(this).addClass('uwcc-tab-active');
        });

        // Call all the necessary functions for Icon Picker
        $('body').on('click', '.uwcc-icon-box-wrap .uwcc-icon-list li', function () {
            var icon_class = $(this).find('i').attr('class');
            $(this).closest('.uwcc-icon-box').find('.uwcc-icon-list li').removeClass('icon-active');
            $(this).addClass('icon-active');
            $(this).closest('.uwcc-icon-box').prev('.uwcc-selected-icon').children('i').attr('class', '').addClass(icon_class);
            $(this).closest('.uwcc-icon-box').next('input').val(icon_class).trigger('change');
            $(this).closest('.uwcc-icon-box').slideUp();
        });

        $('body').on('click', '.uwcc-icon-box-wrap .uwcc-selected-icon', function () {
            $(this).next().slideToggle();
        });

        $('body').on('change', '.uwcc-icon-box-wrap .uwcc-icon-search select', function () {
            var selected = $(this).val();
            $(this).parents('.uwcc-icon-box').find('.uwcc-icon-search-input').val('');
            $(this).parents('.uwcc-icon-box').children('.uwcc-icon-list').hide().removeClass('active');
            $(this).parents('.uwcc-icon-box').children('.' + selected).fadeIn().addClass('active');
            $(this).parents('.uwcc-icon-box').children('.' + selected).find('li').show();
        });

        $('body').on('keyup', '.uwcc-icon-box-wrap .uwcc-icon-search input', function (e) {
            var $input = $(this);
            var keyword = $input.val().toLowerCase();
            var search_criteria = $input.closest('.uwcc-icon-box').find('.uwcc-icon-list.active i');
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

        /* Custom Image Upload */
        $('body').on('click', '.uwcc-image-upload', function (e) {
            e.preventDefault();
            var $this = $(this);
            $this.closest('.uwcc-icon-image-uploader').find('.uwcc-custom-menu-image-icon').html('');
            var image = wp.media({
                title: 'Upload Image',
                multiple: false
            }).open().on('select', function () {
                var uploaded_image = image.state().get('selection').first();
                var image_url = uploaded_image.toJSON().url;

                $this.closest('.uwcc-icon-image-uploader').find('.uwcc-upload-background-url').val(image_url);
                $this.closest('.uwcc-icon-image-uploader').find('.uwcc-custom-menu-image-icon').append('<img src="' + image_url + '"/>');
                if ($this.closest('.uwcc-icon-image-uploader').find('.uwcc-upload-background-url').val(image_url) !== '') {
                    $this.closest('.uwcc-icon-image-uploader').find('.uwcc-custom-menu-image-icon').show();
                } else {
                    $this.closest('.uwcc-icon-image-uploader').find('.uwcc-custom-menu-image-icon').hide();
                }
            });
        });

        /* Remove Uploaded Custom Image */
        $('body').on('click', '.uwcc-image-remove', function () {
            $(this).closest('.uwcc-icon-image-uploader').find('.uwcc-custom-menu-image-icon').html('');
            $(this).closest('.uwcc-icon-image-uploader').find('.uwcc-upload-background-url').val('');
        });

        // Range JS
        $('.uwcc-range-input-selector').each(function () {
            var newSlider = $(this);
            var sliderValue = newSlider.val();
            var sliderMinValue = parseFloat(newSlider.attr('min'));
            var sliderMaxValue = parseFloat(newSlider.attr('max'));
            var sliderStepValue = parseFloat(newSlider.attr('step'));
            newSlider.prev('.uwcc-range-slider').slider({
                value: sliderValue,
                min: sliderMinValue,
                max: sliderMaxValue,
                step: sliderStepValue,
                range: 'min',
                slide: function (e, ui) {
                    $(this).next().val(ui.value);
                }
            });
        });

        // Update slider if the input field loses focus as it's most likely changed
        $('.uwcc-range-input-selector').blur(function () {
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
            $(this).prev('.uwcc-range-slider').slider('value', resetValue);
        });

        /*Show/ Hide Single Page Options*/
        $('input#uwcc_single_pages').on('change', function () {
            var checked_value = $('input#uwcc_single_pages:checked').val();

            if (checked_value == 'on') {
                $(this).closest('.uwcc-display-lists').find('.uwcc-hide-singular').fadeOut();
            } else {
                $(this).closest('.uwcc-display-lists').find('.uwcc-hide-singular').fadeIn();
            }
        });

        $(document).on('change', '.uwcc-typography-font-family', function () {

            var font_family = $(this).val();
            var $this = $(this);
            $.ajax({
                url: ajaxUrl,
                data: {
                    action: 'uwcc_get_google_font_variants',
                    font_family: font_family,
                    wp_nonce: adminNonce
                },
                beforeSend: function () {
                    $this.closest('.uwcc-typography-font-family-field').next('.uwcc-typography-font-style-field').addClass('uwcc-typography-loading');
                },
                success: function (response) {
                    $this.closest('.uwcc-typography-font-family-field').next('.uwcc-typography-font-style-field').removeClass('uwcc-typography-loading');
                    $this.closest('.uwcc-typography-font-family-field').next('.uwcc-typography-font-style-field').find('select').html(response).trigger("chosen:updated").trigger('change');
                }
            });
        });

        $('body').find(".uwcc-typography-fields select").chosen({width: "100%"});

        $('body').find('.uwcc-selected-cpt-ids').each(function () {
            const postType = $(this).attr('data-posttype');
            var $ele = $(this);
            $ele.select2({
                placeholder: "Search",
                allowClear: false,
                minimumInputLength: 3,
                dropdownParent: $ele.parent('.uwcc-toggle-tab-body'),
                ajax: {
                    url: uwcc_admin_js_obj.ajax_url,
                    dataType: 'json',
                    method: 'post',
                    quietMillis: 250,
                    data: function (params) {
                        return {
                            q: params.term,
                            action: 'uwcc_get_posts_by_query',
                            post_type: postType,
                        };
                    },
                    results: function (data) {
                        return {results: data.items};
                    },
                    cache: true
                },
            });
        });

        $('body').find('#uwcc-selected-product-ids').each(function () {
            const postType = 'product';
            var $ele = $(this);
            $ele.select2({
                placeholder: "Search",
                allowClear: false,
                minimumInputLength: 3,
                dropdownParent: $ele.parent('.uwcc-settings-fields'),
                ajax: {
                    url: uwcc_admin_js_obj.ajax_url,
                    dataType: 'json',
                    method: 'post',
                    quietMillis: 250,
                    data: function (params) {
                        return {
                            q: params.term,
                            action: 'uwcc_get_posts_by_query',
                            post_type: postType,
                        };
                    },
                    results: function (data) {
                        return {results: data.items};
                    },
                    cache: true
                },
            });
        });

        $('body').on('click', '.uwcc-open-cart-editor', function () {
            $('form#post').trigger('submit');
            var el = $(this),
                    cart_id = el.data('cart-id');
            $('body').addClass('uwcc-cart-popup-active');
            $('<div class="uwcc-cart-popup" data-cart-id="' + cart_id + '">' +
                    '<div class="uwcc-cart-popup-content">' +
                    '<div class="uwcc-cart-popup-close">' +
                    '<i class="icofont-close-line"></i>' +
                    '</div>' +
                    '<iframe src="' + uwcc_admin_js_obj.admin_url + '?uwcc-open-editor=1&item=' + cart_id + '"></iframe>' +
                    '</div>' +
                    '</div>').appendTo('body');
        })

        $('body').on('click', '.uwcc-open-checkout-editor', function () {
            $('form#post').trigger('submit');
            var el = $(this),
                    cart_id = el.data('cart-id');
            $('body').addClass('uwcc-cart-popup-active');
            $('<div class="uwcc-cart-popup" data-cart-id="' + cart_id + '">' +
                    '<div class="uwcc-cart-popup-content">' +
                    '<div class="uwcc-cart-popup-close">' +
                    '<i class="icofont-close-line"></i>' +
                    '</div>' +
                    '<iframe src="' + uwcc_admin_js_obj.admin_url + '?uwcc-open-checkout-editor=1&item=' + cart_id + '"></iframe>' +
                    '</div>' +
                    '</div>').appendTo('body');
        })

        $('body').on('click', '.uwcc-cart-popup-close', function () {
            $('.uwcc-cart-popup').remove();
            $('body').removeClass('uwcc-cart-popup-active');
        })

        /* Custom File Upload */
        function uwccReadFile(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    var htmlPreview =
                            '<p>' + input.files[0].name + '</p>';
                    var wrapperZone = $(input).parent();
                    var previewZone = $(input).parent().parent().find('.uwcc-preview-zone');
                    var boxZone = $(input).parent().parent().find('.uwcc-preview-zone').find('.box').find('.box-body');

                    wrapperZone.removeClass('dragover');
                    previewZone.removeClass('hidden');
                    boxZone.empty();
                    boxZone.append(htmlPreview);
                };

                reader.readAsDataURL(input.files[0]);
            }
        }

        function reset(e) {
            e.wrap('<form>').closest('form').get(0).reset();
            e.unwrap();
        }

        $(".uwcc-dropzone").change(function () {
            uwccReadFile(this);
        });

        $('.uwcc-dropzone-wrapper').on('dragover', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).addClass('dragover');
        });

        $('.uwcc-dropzone-wrapper').on('dragleave', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).removeClass('dragover');
        });

        $('.uwcc-remove-preview').on('click', function () {
            var boxZone = $(this).parents('.uwcc-preview-zone').find('.box-body');
            var previewZone = $(this).parents('.uwcc-preview-zone');
            var dropzone = $(this).parents('.uwcc-settings-fields').find('.uwcc-dropzone');
            boxZone.empty();
            previewZone.addClass('hidden');
            reset(dropzone);
        });

        function uwcc_update_template_url(template) {
            var template_url = 'https://demo.hashthemes.com/ultimate-woocommerce-cart/templates/' + template.val().replace('uwcc_', '').replace('_', '-');
            var template_name = template.find(':selected').text()
            $('.uwcc_import_template_form #uwcc_temp_view_demo').attr('href', template_url);
            $('.uwcc_import_template_form #uwcc_temp_view_demo .uwcc-view-demo').text(template_name);
            if (template.find(':selected').data("elementor")) {
                $('.uwcc-require-elementor-notice').show()
            } else {
                $('.uwcc-require-elementor-notice').hide();
            }
        }

        $('.uwcc_import_template_form select[name="uwcc_import_template"]').on('change', function () {
            uwcc_update_template_url($(this));
        })
        //uwcc_update_template_url($('.uwcc_import_template_form select[name="uwcc_import_template"]'));

        $('.uwcc-activate-elementor-plugin').on('click', function (e) {
            e.preventDefault();
            var button = $(this);
            button.addClass('updating-message').html(uwcc_admin_js_obj.activating_text);

            $.ajax({
                url: ajaxurl,
                type: 'POST',
                data: {
                    action: 'uwcc_activate_plugin',
                    slug: 'elementor',
                    file: 'elementor'
                },
            }).done(function (result) {
                var result = JSON.parse(result)
                if (result.success) {
                    $('.uwcc-install-elementor-plugin').remove();
                    $('.uwcc-activate-elementor-plugin').remove();
                    $('.uwcc-open-cart-editor').show();
                    $('.uwcc-open-checkout-editor').show();
                } else {
                    button.removeClass('updating-message').html(uwcc_admin_js_obj.error);
                }

            });
        });

        $('.uwcc-install-elementor-plugin').on('click', function (e) {
            e.preventDefault();
            var button = $(this);

            button.addClass('updating-message').html(uwcc_admin_js_obj.installing_text);

            wp.updates.installPlugin({
                slug: 'elementor'
            }).done(function () {
                button.html(uwcc_admin_js_obj.activating_text);
                $.ajax({
                    url: ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'uwcc_activate_plugin',
                        slug: 'elementor',
                        file: 'elementor'
                    },
                }).done(function (result) {
                    var result = JSON.parse(result)
                    if (result.success) {
                        $('.uwcc-install-elementor-plugin').remove();
                        $('.uwcc-activate-elementor-plugin').remove();
                        $('.uwcc-open-cart-editor').show();
                        $('.uwcc-open-checkout-editor').show();
                    } else {
                        button.removeClass('updating-message').html(uwcc_admin_js_obj.error);
                    }

                });
            });
        });

        /*Code mirror activation*/
        function codeMirrorDisplay() {
            var $codeMirrorEditors = $('.uwcc-codemirror-textarea');

            if ($codeMirrorEditors.length) {
                var editorSettings = wp.codeEditor.defaultSettings ? _.clone(wp.codeEditor.defaultSettings) : {};
                editorSettings.codemirror = _.extend(
                        {},
                        editorSettings.codemirror,
                        {
                            lineNumbers: true,
                            lineWrapping: true,
                            autoRefresh: true,
                            mode: 'css',
                        }
                );
                var editor = wp.codeEditor.initialize($codeMirrorEditors, editorSettings);
            }
        }

        var getUrlParameter = function getUrlParameter(sParam) {
            var sPageURL = window.location.search.substring(1),
                    sURLVariables = sPageURL.split('&'),
                    sParameterName,
                    i;

            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');

                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
                }
            }
            return false;
        };

        var uwccalert = getUrlParameter('uwccalert');
        if (uwccalert) {
            const params = new URLSearchParams(window.location.search)
            params.delete('uwccalert');
            history.pushState("", document.title, window.location.pathname + '?' + params.toString());
            $('.uwcc-alert').addClass('uwcc-alert-success');
            $('.uwcc-alert span').html(uwccalert.replaceAll('+', ' '));
            $('.uwcc-alert').addClass('uwcc-alert-active');
            uwccHideAlert(3500);
        }

        function uwccHideAlert(timer) {
            clearTimeout();
            setTimeout(function () {
                if ($('.uwcc-alert').hasClass('uwcc-alert-active')) {
                    $('.uwcc-alert').removeClass('uwcc-alert-active');
                    $('.uwcc-alert').removeClass('uwcc-alert-success uwcc-alert-warning uwcc-alert-neutral');
                }
            }, timer);
        }

        $(document).on('click', '.uwcc-hide-show-cpt-posts', function () {
            var posttype = '#uwcc-cpt-' + $(this).data('posttype');
            $(this).is(':checked') ? $(posttype).hide() : $(posttype).show();
        });

        $(document).on('click', '.uwcc-hide-show-archive-list', function () {
            var arclist = '#uwcc-show-archive';
            $(this).is(':checked') ? $(arclist).hide() : $(arclist).show();
        });

        setTimeout(function () {
            $('.uwcc-save-notice').fadeOut("slow");
        }, 3000);

        $('.uwcc_elements_order_wrapper').sortable({
            axis: 'y',
            helper: 'clone',
            cursor: 'move',
            opacity: 0.9,
            items: '> li.uwcc-each-elements:not(.uwcc-ignore)',
        });
    });

})(jQuery);