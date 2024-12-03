jQuery(document).ready(function ($) {
    'use strict';
    if ($('.vi-ui.tabular.menu').length) {
        $('.vi-ui.tabular.menu .item').vi_tab({history: true, historyType: 'hash'});
    }
    if ($('.vi-ui.accordion').length) {
        $('.vi-ui.accordion:not(.wlwl-accordion-init)').addClass('wlwl-accordion-init').vi_accordion('refresh');
    }
    $('.vi-ui.checkbox:not(.wlwl-checkbox-init)').addClass('wlwl-checkbox-init').off().checkbox();
    $('.vi-ui.dropdown:not(.wlwl-dropdown-init)').addClass('wlwl-dropdown-init').off().dropdown();

    $('#gdpr_policy,#wlwl_enable_funnelkit,#wlwl_enable_sendy,#wlwl_mailster_list,#wlwl_enable_mailpoet,#mailchimp_enable, #wlwl_enable_active_campaign, #wlwl_sendgrid_enable, #wlwl_enable_sendinblue, #wlwl_enable_klaviyo,#wlwl_enable_hubspot, #metrilo_enable').on('change', function () {
        if ($(this).prop('checked')){
            $('.wlwl-'+$(this).attr('id')+'-class').show() ;
        }else {
            $('.wlwl-'+$(this).attr('id')+'-class').hide();
        }
    }).trigger('change');
    $('.wheel-settings .ui-sortable').sortable({
        update: function (event, ui) {
            indexChangeCal();
        }
    });

    /*Select White or Black list*/
    $(document).on('change', 'input[name="choose_using_white_black_list"]',function () {
        handle_choose_list($(this).val());
    });
    handle_choose_list($('input[name="choose_using_white_black_list"]:checked').val());

    function handle_choose_list(intent) {
        let $white_list = $('[name="white_list"]').closest('tr');
        let $black_list = $('[name="black_list"]').closest('tr');
        switch (intent) {
            case 'white_list':
                $black_list.hide();
                $white_list.show();
                break;
            case 'black_list':
                $white_list.hide();
                $black_list.show();
                break;
        }
    }

    /*Select intent*/
    $('select[name="notify_intent"]').on('change', function () {
        handle_select_intent_value($(this).val());
    });
    handle_select_intent_value($('select[name="notify_intent"]').val());

    function handle_select_intent_value(intent) {
        let $ini_time = $('input[name="show_wheel"]').closest('tr');
        let $scroll_amount = $('input[name="scroll_amount"]').closest('tr');
        switch (intent) {
            case 'popup_icon':
            case 'show_wheel':
                $ini_time.closest('tr').fadeIn(200);
                $scroll_amount.closest('tr').fadeOut(200);
                break;
            case 'random':
                $ini_time.closest('tr').fadeIn(200);
                $scroll_amount.closest('tr').fadeIn(200);
                break;
            case 'on_scroll':
                $ini_time.closest('tr').fadeOut(200);
                $scroll_amount.closest('tr').fadeIn(200);
                break;
            case 'on_exit':
                $ini_time.closest('tr').fadeOut(200);
                $scroll_amount.closest('tr').fadeOut(200);
                break;
        }
    }
    
    /*select recaptcha version */
    jQuery('.wlwl_recaptcha_version').dropdown({
        onChange: function (val) {
            if (val == 2) {
                jQuery('.wlwl-recaptcha-v2-wrap').show();
                jQuery('.wlwl-recaptcha-v3-wrap').hide();
            } else {
                jQuery('.wlwl-recaptcha-v2-wrap').hide();
                jQuery('.wlwl-recaptcha-v3-wrap').show();
            }
        }
    });
    /*Color picker*/
    $('.color-picker').iris({
        change: function (event, ui) {
            $(this).parent().find('.color-picker').css({backgroundColor: ui.color.toString()});
            if ($(this).parent().find('#wheel_wrap_bg_color')){
                $('.wlwl-image-container').find('.review-images').css({'background' : ui.color.toString()});
            }
        },
        hide: true,
        border: true
    }).click(function () {
        $('.iris-picker').hide();
        $(this).closest('td').find('.iris-picker').show();
    });
    $('body').click(function () {
        $('.iris-picker').hide();
    });
    $('.color-picker').click(function (event) {
        event.stopPropagation();
    });
    /*Select popup icon*/
    $('.wheel-popup-icon').on('click', function () {
        let $button = $(this), $container = $button.closest('.wheel-popup-icons-container');
        if ($button.hasClass('wheel-popup-icon-selected')) {
            $button.removeClass('wheel-popup-icon-selected').attr('style', '');
            $container.find('input[name="wheel_popup_icon"]').val('');
        } else {
            let $selected = $container.find('.wheel-popup-icon-selected');
            $container.find('input[name="wheel_popup_icon"]').val($button.data('wheel_popup_icon'));
            $button.addClass('wheel-popup-icon-selected').attr('style', $selected.attr('style'));
            $selected.attr('style', '').removeClass('wheel-popup-icon-selected');
        }
    });


    $('#wheel_popup_icon_color').iris({
        change: function (event, ui) {
            $(this).parent().find('.color-picker').css({backgroundColor: ui.color.toString()});
            $('.wheel-popup-icon-selected').css({color: ui.color.toString()});
        },
        hide: true,
        border: true
    });
    $('#wheel_popup_icon_bg_color').iris({
        change: function (event, ui) {
            $(this).parent().find('.color-picker').css({backgroundColor: ui.color.toString()});
            $('.wheel-popup-icon-selected').css({'background-color': ui.color.toString()});
        },
        hide: true,
        border: true
    });

    $(document).on('click', '.clone_piece', function () {
        let new_row = $(this).parent().parent().clone();
        let new_val = parseInt(new_row.find('input[name="probability[]"]').val());
        new_row.find('input[name="probability[]"]').val(new_val);
        new_row.insertAfter($(this).parent().parent());
        indexChangeCal();
        changes_probability();
        new_row.find('.vi-ui.dropdown').dropdown({placeholder: ''});
        new_row.find('.color-picker').iris({
            change: function (ev, uis) {
                $(this).parent().find('.color-picker').css({backgroundColor: uis.color.toString()});
            },
            hide: true,
            border: true,
            width: 270
        }).on('click', function (e) {
            e.stopPropagation();
        });
    });
    $(document).on('click', '.remove_field', function () {
        changes_probability();
        if (confirm("Would you want to remove this?")) {
            if ($('.wheel_col').length > 3) {
                $(this).closest('tr').remove();
                changes_probability();
                indexChangeCal();
            } else {
                alert('Must have at least 3 columns!');
                return false;
            }
        }
    });

    changes_probability();
    $(document).on('change', '.prize_quantity', function () {
        changes_probability();
    });
    $(document).on('change', '.probability', function () {
        changes_probability();
    });

    /**
     * Calculate probability
     */
    function changes_probability() {// check probability
        let tong = 0;
        let $probability = $('.probability');
        $probability.each(function () {
            let $current = $(this);
            let $row = $current.closest('tr');
            let $coupon_type = $row.find('select[name="coupon_type[]"]');
            let $prize_quantity = $row.find('input[name="prize_quantity[]"]');
            if ($coupon_type.val() === 'non' || parseInt($prize_quantity.val()) !== 0) {
                tong += parseInt($current.val());
            }
        });
        if (tong > 0) {
            $probability.each(function () {
                let $current = $(this);
                let $row = $current.closest('tr');
                let $coupon_type = $row.find('select[name="coupon_type[]"]');
                let $prize_quantity = $row.find('input[name="prize_quantity[]"]');
                let percent = 0;
                if ($coupon_type.val() === 'non' || parseInt($prize_quantity.val()) !== 0) {
                    let weigh = parseInt($current.val());
                    percent = roundResult(weigh * 100 / tong);
                }
                $row.find('.probability-percent').val(percent);
            });
        } else {
            $probability.each(function () {
                let $current = $(this);
                $current.closest('tr').find('.probability-percent').val(0);
            });
        }
    }

    function indexChangeCal() {
        let i = 1;
        $('.wheel-col-index').map(function () {
            $(this).html(i);
            i++;
        })
    }

    indexChangeCal();
    $('select[name="coupon_type[]"]').map(function () {
        let $current = $(this);
        let $selected = $current.find(`option[value="${$current.val()}"]`);
        if ($selected.data('coupon_amount') !== undefined) {
            $current.closest('tr').find('input[name="coupon_amount[]"]').val($selected.data('coupon_amount'));
        }
    });
    $(document).on('change', 'select[name="coupon_type[]"]', function () {
        changes_probability();
        let $coupon_type = $(this);
        let $row = $coupon_type.closest('tr');
        let coupon_type = $coupon_type.val();
        switch (coupon_type) {
            case 'non':
                $row.attr('class', `wheel_col wheel_col-${coupon_type}`);
                $row.find('.coupon_amount').val(0).prop('readonly', true).addClass('coupon-amount-readonly');
                $row.find('.custom_type_label').val('Not Lucky');
                $row.find('select[name="email_templates[]"]').val('').trigger('change');
                break;
            case 'custom':
                $row.attr('class', `wheel_col wheel_col-${coupon_type}`);
                $row.find('.custom_type_value').val('');
                $row.find('.custom_type_label').val('');
                break;
            case 'existing_coupon':
                $row.attr('class', `wheel_col wheel_col-${coupon_type}`);
                $row.find('.custom_type_label').val(woo_lucky_wheel_params_admin.default_coupon_label);
                break;
            case 'percent':
            case 'fixed_product':
            case 'fixed_cart':
                $row.attr('class', `wheel_col wheel_col-${coupon_type}`);
                $row.find('.custom_type_label').val(woo_lucky_wheel_params_admin.default_coupon_label);
                $row.find('.coupon_amount').removeClass('coupon-amount-readonly').prop('readonly', false);
                break;
            default:
                $row.find('.coupon_amount').val($coupon_type.find(`option[value="${coupon_type}"]`).data('coupon_amount')).prop('readonly', true).addClass('coupon-amount-readonly');
                $row.attr('class', 'wheel_col wheel_col-dynamic_coupon');
        }
    });

    $('.wlwl_color_palette').on('click', function () {
        let color_code = $(this).data('color_code');
        let color_array = [],color_des = $('.color_palette').data('color_arr')[color_code];
        if (color_des?.pointer){
            $('#pointer_color').val(color_des.pointer).trigger('change');
        }
        $('#wheel_wrap_bg_color').val(color_code).trigger('change');
        if (color_des?.color && color_des.color.length){
            color_array = color_des.color;
        }
        let piece_color = $('.wheel_col').find('input[name="bg_color[]"]').map(function () {
            return $(this).val();
        }).get();
        let color_size = color_array.length,piece_size = piece_color.length,i, j = 0;
        for (i = 0; i < piece_size; i++) {
            if (j == color_size) {
                j = 0;
            }
            $('.wheel_col').find('input[name="bg_color[]"]').eq(i).val(color_array[j]).css({'background-color': color_array[j]});
            j++;
        }
        $('.auto_color_ok').on('click', function () {
            $('.color_palette').hide();
            $('.auto_color_ok_cancel').hide();
            $('.auto_color').show();
        });
        $('.auto_color_cancel').on('click', function () {
            j = 0;
            for (i = 0; i < piece_size; i++) {
                if (j == color_size) {
                    j = 0;
                }
                $wheel_col.find('input[name="bg_color[]"]').eq(i).val(piece_color[j]).css({'background-color': piece_color[j]});
                j++;
            }
            $('.color_palette').hide();
            $('.auto_color_ok_cancel').hide();
            $('.auto_color').show();
        })
    });
    $('.auto_color').on('click', function () {
        $('.color_palette').css({'display': 'flex'});
        $('.auto_color_ok_cancel').css({'display': 'inline-block'});
        $(this).hide();
        $('.auto_color_ok').on('click', function () {
            $('.color_palette').hide();
            $('.auto_color_ok_cancel').hide();
            $('.auto_color').show();
        });
        $('.auto_color_cancel').on('click', function () {
            $('.color_palette').hide();
            $('.auto_color_ok_cancel').hide();
            $('.auto_color').show();
        })
    });
    $('.wlwl-button-save-settings-container').closest('form').on('submit', function () {
        let $label = $('.custom_type_label');
        let $coupon_type = $('select[name="coupon_type[]"]');
        for (let i = 0; i < $label.length; i++) {
            if ($label.eq(i).val() === '') {
                alert('Label cannot be empty.');
                $label.eq(i).focus();
                return false;

            }
            if ($coupon_type.eq(i).val() === 'custom' && $('.custom_type_value').eq(i).val() === '') {
                alert('Value cannot be empty.');
                $('.custom_type_value').eq(i).focus();
                return false;

            }
            if ($coupon_type.eq(i).val() === 'existing_coupon' && $('select[name="wlwl_existing_coupon[]"]')[i].lastElementChild.innerHTML == '') {
                alert('Value of Existing coupon cannot be empty.');
                $('select[name="wlwl_existing_coupon[]"]')[i].focus();
                return false;
            }
        }

        $('.wlwl-button-save-settings-container').find('button').addClass('loading');
    });

    function roundResult(number, round = 2) {
        let temp = Math.pow(10, round);
        return Math.round(number * temp) / temp;
    }

});

jQuery(document).ready(function ($) {
    // Set all variables to be used in scope
    var frame,
        metaBox = $('#wlwl-bg-image'), // Your meta box id here
        addImgLink = metaBox.find('.wlwl-upload-custom-img'),
        imgContainer = metaBox.find('.wlwl-image-container');
    $('.wheel_wrap_bg_image_custom').css('margin-top','15px');
    $('.wheel_wrap_bg_image_type').dropdown({
        onChange:function (val) {
            handle_choose_bg_image_type(val);
        }
    });
    handle_choose_bg_image_type($('.wheel_wrap_bg_image_type select').val())
    function handle_choose_bg_image_type(val){
        if (parseInt(val)){
            $('.wheel_wrap_bg_image_custom').show();
            if ($('.wlwl-remove-image').length){
                $('.wlwl-upload-custom-img').hide();
            }else {
                $('.wlwl-upload-custom-img').show();
            }
        }else {
            $('.wheel_wrap_bg_image_custom').hide();
            $('.wheel_wrap_bg_image').val(woo_lucky_wheel_params_admin.bg_img_default);
            imgContainer.find('.review-images').attr({src:woo_lucky_wheel_params_admin.bg_img_default});
        }
    }

    // ADD IMAGE LINK
    addImgLink.on('click', function (event) {
        event.preventDefault();

        // If the media frame already exists, reopen it.
        if (frame) {
            frame.open();
            return;
        }

        // Create a new media frame
        frame = wp.media({
            title: 'Select or Upload Media Of Your Chosen Persuasion',
            button: {
                text: 'Use this media'
            },
            multiple: false  // Set to true to allow multiple files to be selected
        });


        // When an image is selected in the media frame...
        frame.on('select', function () {

            // Get media attachment details from the frame state
            var attachment = frame.state().get('selection').first().toJSON();
            console.log(attachment);
            var attachment_url;
            if (attachment.sizes.thumbnail) {
                attachment_url = attachment.sizes.thumbnail.url;
            } else if (attachment.sizes.medium) {
                attachment_url = attachment.sizes.medium.url;
            } else if (attachment.sizes.large) {
                attachment_url = attachment.sizes.large.url;
            } else if (attachment.url) {
                attachment_url = attachment.url;
            }
            // Send the attachment URL to our custom image input field.
            imgContainer.html('<img style="width: 300px;background:'+$('#wheel_wrap_bg_color').val() + '"class="review-images" src="' + attachment_url + '"/><input class="wheel_wrap_bg_image" name="wheel_wrap_bg_image" type="hidden" value="' + attachment.id + '"/><span class="wlwl-remove-image negative vi-ui button">Remove</span>');

            $('.wlwl-upload-custom-img').hide();

        });

        // Finally, open the modal on click
        frame.open();
    });
    // DELETE IMAGE LINK

    $(document).on('click','.wlwl-remove-image', function (event) {
        event.preventDefault();
        $(this).parent().html('');
        $('.wlwl-upload-custom-img').show();
    });
});
jQuery(document).ready(function ($) {
    // Set all variables to be used in scope
    var frame1,
        metaBox1 = $('#wlwl-bg-image1'), // Your meta box id here
        addImgLink1 = metaBox1.find('.wlwl-upload-custom-img1'),
        imgContainer1 = metaBox1.find('#wlwl-new-image1');

    // ADD IMAGE LINK
    addImgLink1.on('click', function (event) {
        event.preventDefault();

        // If the media frame already exists, reopen it.
        if (frame1) {
            frame1.open();
            return;
        }

        // Create a new media frame
        frame1 = wp.media({
            title: 'Select or Upload Media Of Your Chosen Persuasion',
            button: {
                text: 'Use this media'
            },
            multiple: false  // Set to true to allow multiple files to be selected
        });


        // When an image is selected in the media frame...
        frame1.on('select', function () {

            // Get media attachment details from the frame state
            var attachment1 = frame1.state().get('selection').first().toJSON();
            console.log(attachment1);
            var attachment_url1;
            if (attachment1.sizes.thumbnail) {
                attachment_url1 = attachment1.sizes.thumbnail.url;
            } else if (attachment1.sizes.medium) {
                attachment_url1 = attachment1.sizes.medium.url;
            } else if (attachment1.sizes.large) {
                attachment_url1 = attachment1.sizes.large.url;
            }else if (attachment1.sizes.full) {
                attachment_url1 = attachment1.sizes.full.url;
            } else if (attachment1.url) {
                attachment_url1 = attachment1.url;
            }

            // Send the attachment URL to our custom image input field.
            imgContainer1.append('<div class="wlwl-image-container1"><img style="border: 1px solid;"class="review-images" src="' + attachment_url1 + '"/><input class="wheel_center_image" name="wheel_center_image" type="hidden" value="' + attachment1.id + '"/><span class="wlwl-remove-image1 nagative vi-ui button">Remove</span></div>');

            $('.wlwl-upload-custom-img1').hide();
            $('.wlwl-remove-image1').on('click', function (event) {
                event.preventDefault();
                $(this).parent().html('');
                $('.wlwl-upload-custom-img1').show();
            })

        });

        // Finally, open the modal on click
        frame1.open();
    });
    // DELETE IMAGE LINK

    $('.wlwl-remove-image1').on('click', function (event) {
        event.preventDefault();
        $(this).parent().html('');
        $('.wlwl-upload-custom-img1').show();
    });
    $(".suggested-product-search").select2({
        placeholder: "Please fill in your product title",
        ajax: {
            url: "admin-ajax.php?action=wlwl_search_suggested_product",
            dataType: 'json',
            type: "GET",
            quietMillis: 50,
            delay: 250,
            data: function (params) {
                return {
                    keyword: params.term
                };
            },
            processResults: function (data) {
                return {
                    results: data
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) {
            return markup;
        }, // let our custom formatter work
        minimumInputLength: 1
    });
    $(".category-search").select2({
        placeholder: "Please enter category title",
        ajax: {
            url: "admin-ajax.php?action=wlwl_search_cate",
            dataType: 'json',
            type: "GET",
            quietMillis: 50,
            delay: 250,
            data: function (params) {
                return {
                    keyword: params.term
                };
            },
            processResults: function (data) {
                return {
                    results: data
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) {
            return markup;
        }, // let our custom formatter work
        minimumInputLength: 1
    });
    $(".product-search").select2({
        closeOnSelect: false,
        placeholder: "Please fill in your product title",
        ajax: {
            url: "admin-ajax.php?action=wlwl_search_product",
            dataType: 'json',
            type: "GET",
            quietMillis: 50,
            delay: 250,
            data: function (params) {
                return {
                    keyword: params.term
                };
            },
            processResults: function (data) {
                return {
                    results: data
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) {
            return markup;
        }, // let our custom formatter work
        minimumInputLength: 1
    });
    $(".coupon-search").select2({
        placeholder: "Type coupon code here",
        ajax: {
            url: "admin-ajax.php?action=wlwl_search_coupon",
            dataType: 'json',
            type: "GET",
            quietMillis: 50,
            delay: 250,
            data: function (params) {
                return {
                    keyword: params.term
                };
            },
            processResults: function (data) {
                return {
                    results: data
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) {
            return markup;
        }, // let our custom formatter work
        minimumInputLength: 1
    });

    $(".wlwl-ac-search-list").select2({
        placeholder: "Type list name",
        ajax: {
            url: "admin-ajax.php?action=wlwl_search_active_campaign_list",
            dataType: 'json',
            type: "GET",
            quietMillis: 50,
            delay: 250,
            data: function (params) {
                return {
                    keyword: params.term
                };
            },
            processResults: function (data) {
                return {
                    results: data
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) {
            return markup;
        }, // let our custom formatter work
        minimumInputLength: 1,
        allowClear: true
    });

//    select google font
    $('#wlwl-google-font-select').fontselect().change(function () {
        // replace + signs with spaces for css
        $('#wlwl-google-font-select').val($(this).val());
        $('.wlwl-google-font-select-remove').show();
    });
    $('.wlwl-google-font-select-remove').on('click', function () {
        $(this).parent().find('.font-select span').html('<span>Select a font</span>');
        $('#wlwl-google-font-select').val('');
        $(this).hide();
    });
    /*design button "shop now"*/
    var buttonShopNow = $('.wlwl-button-shop-now');
    $('#wlwl_button_shop_title').on('keyup', function () {
        buttonShopNow.html($(this).val());
    });
    $('#wlwl_button_shop_url').on('keyup', function () {
        buttonShopNow.attr('href', $(this).val());
    });
    $('#wlwl_button_shop_size').on('change', function () {
        buttonShopNow.css('font-size', $(this).val() + 'px');
    });
    /*Color picker*/
    $('#wlwl_button_shop_color').iris({
        change: function (event, ui) {
            $(this).parent().find('.color-picker').css({backgroundColor: ui.color.toString()});
            buttonShopNow.css({'color': ui.color.toString()});
        },
        hide: true,
        border: true
    }).click(function (event) {
        event.stopPropagation();
        $('.iris-picker').hide();
        $(this).closest('td').find('.iris-picker').show();
    });
    $('#wlwl_button_shop_bg_color').iris({
        change: function (event, ui) {
            $(this).parent().find('.color-picker').css({backgroundColor: ui.color.toString()});
            buttonShopNow.css({'background-color': ui.color.toString()});
        },
        hide: true,
        border: true
    }).click(function (event) {
        event.stopPropagation();
        $('.iris-picker').hide();
        $(this).closest('td').find('.iris-picker').show();
    });

    $('.preview-emails-html-overlay').on('click', function () {
        $('.preview-emails-html-container').addClass('preview-html-hidden');
    });
    $('.wlwl-preview-emails-button').on('click', function () {
        let button = $(this);
        let old_preview_text = button.html();
        button.html('Please wait...');
        let language = button.data()['wlwl_language'];
        let suggested_products = $('#wlwl_suggested_products').val();
        $.ajax({
            url: woo_lucky_wheel_params_admin.url,
            type: 'GET',
            dataType: 'JSON',
            data: {
                action: 'wlwl_preview_emails',
                heading: $('#heading' + language).val(),
                footer_text: $('#footer_text' + language).val(),
                content: tinyMCE.get('content' + language) ? tinyMCE.get('content' + language).getContent() : $('#content' + language).val(),
                button_shop_size: $('#wlwl_button_shop_size').val(),
                button_shop_color: $('#wlwl_button_shop_color').val(),
                button_shop_bg_color: $('#wlwl_button_shop_bg_color').val(),
                button_shop_title: $('#wlwl_button_shop_title' + language).val(),
                button_shop_url: $('#wlwl_button_shop_url' + language).val(),
                suggested_products: suggested_products ? suggested_products : [],
            },
            success: function (response) {
                button.html(old_preview_text);
                if (response) {
                    $('.preview-emails-html').html(response.html);
                    $('.preview-emails-html-container').removeClass('preview-html-hidden');
                }
            },
            error: function (err) {
                button.html(old_preview_text);
            }
        })
    });

    /*preview wheel*/
    $('.woocommerce-lucky-wheel-preview-overlay').on('click', function () {
        $('.woocommerce-lucky-wheel-preview').addClass('preview-html-hidden');
    });
    $('.preview-lucky-wheel').on('click', function () {
        $(this).addClass('loading');
        let prize_quantity = [];
        $('input[name="prize_quantity[]"]').map(function () {
            prize_quantity.push($(this).val());
        });
        let color = [];
        $('input[name="bg_color[]"]').map(function () {
            color.push($(this).val());
        });
        let slices_text_color = [];
        $('input[name="slices_text_color[]"]').map(function () {
            slices_text_color.push($(this).val());
        });
        let label = [];
        $('input[name="custom_type_label[]"]').map(function () {
            label.push($(this).val());
        });
        let coupon_type = [];
        $('select[name="coupon_type[]"]').map(function () {
            coupon_type.push($(this).val());
        });
        let coupon_amount = [];
        $('input[name="coupon_amount[]"]').map(function () {
            coupon_amount.push($(this).val());
        });
        $.ajax({
            url: woo_lucky_wheel_params_admin.url,
            type: 'GET',
            dataType: 'JSON',
            data: {
                action: 'wlwl_preview_wheel',
                label: label,
                coupon_type: coupon_type,
                coupon_amount: coupon_amount,
                prize_quantity: prize_quantity,
                quantity_label: $('input[name="quantity_label"]').val(),
            },
            success: function (response) {
                $('.preview-lucky-wheel').removeClass('loading');
                let font_size = $('#font_size').val();
                let wlwl_center_color = $('#wheel_center_color').val();
                let wlwl_border_color = $('#wheel_border_color').val();
                let wlwl_dot_color = $('#wheel_dot_color').val();
                let slices = color.length;
                let sliceDeg = 360 / slices;
                let deg = -(sliceDeg / 2);
                let cv = document.getElementById('wlwl_canvas');
                let ctx = cv.getContext('2d');
                let width = 400;// size
                cv.width = width;
                cv.height = width;
                let center = (width) / 2;
                let wheel_text_size = parseInt(width / 28) * parseInt(font_size) / 100;
                if (response.labels) {
                    let labels = response.labels;
                    for (let i = 0; i < slices; i++) {
                        drawSlice(ctx, deg, color[i]);
                        drawText(ctx, deg + sliceDeg / 2, labels[i], slices_text_color[i], wheel_text_size);
                        deg += sliceDeg;
                    }
                    cv = document.getElementById('wlwl_canvas1');
                    ctx = cv.getContext('2d');
                    cv.width = width;
                    cv.height = width;
                    drawPoint(ctx, deg, wlwl_center_color);
                    let center_image = $('input[name="wheel_center_image"]').parent().find('img').attr('src');
                    if (center_image) {
                        let wl_image = new Image;
                        wl_image.onload = function () {
                            cv = document.getElementById('wlwl_canvas1');
                            ctx = cv.getContext('2d');
                            let image_size = 2 * (width / 8 - 7);
                            ctx.arc(center, center, image_size / 2, 0, 2 * Math.PI);
                            ctx.clip();
                            ctx.drawImage(wl_image, center - image_size / 2, center - image_size / 2, image_size, image_size);

                        };
                        wl_image.src = center_image;
                    }
                    drawBorder(ctx, wlwl_border_color, 'rgba(0,0,0,0)', 20, 4, 5, 'rgba(0,0,0,0.2)');
                    cv = document.getElementById('wlwl_canvas2');
                    ctx = cv.getContext('2d');

                    cv.width = width;
                    cv.height = width;
                    drawBorder(ctx, 'rgba(0,0,0,0)', wlwl_dot_color, 20, 4, 5, 'rgba(0,0,0,0)');

                    $('.woocommerce-lucky-wheel-preview').removeClass('preview-html-hidden');
                }

                function deg2rad(deg) {
                    return deg * Math.PI / 180;
                }

                function drawSlice(ctx, deg, color) {
                    ctx.beginPath();
                    ctx.fillStyle = color;
                    ctx.moveTo(center, center);
                    let r;
                    if (width <= 480) {
                        r = width / 2 - 10;
                    } else {
                        r = width / 2 - 14;
                    }
                    ctx.arc(center, center, r, deg2rad(deg), deg2rad(deg + sliceDeg));
                    ctx.lineTo(center, center);
                    ctx.fill();
                }

                function drawPoint(ctx, deg, color) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.fillStyle = color;
                    ctx.shadowBlur = 1;
                    ctx.shadowOffsetX = 8;
                    ctx.shadowOffsetY = 8;
                    ctx.shadowColor = 'rgba(0,0,0,0.2)';
                    ctx.arc(center, center, width / 8, 0, 2 * Math.PI);
                    ctx.fill();

                    ctx.clip();
                    ctx.restore();
                }

                function drawBorder(ctx, borderC, dotC, lineW, dotR, des, shadColor) {
                    ctx.beginPath();
                    ctx.strokeStyle = borderC;
                    ctx.lineWidth = lineW;
                    ctx.shadowBlur = 1;
                    ctx.shadowOffsetX = 8;
                    ctx.shadowOffsetY = 8;
                    ctx.shadowColor = shadColor;
                    ctx.arc(center, center, center, 0, 2 * Math.PI);
                    ctx.stroke();
                    let x_val, y_val, deg;
                    deg = sliceDeg / 2;
                    let center1 = center - des;
                    for (let i = 0; i < slices; i++) {
                        ctx.beginPath();
                        ctx.fillStyle = dotC;
                        x_val = center + center1 * Math.cos(deg * Math.PI / 180);
                        y_val = center - center1 * Math.sin(deg * Math.PI / 180);
                        ctx.arc(x_val, y_val, dotR, 0, 2 * Math.PI);
                        ctx.fill();
                        deg += sliceDeg;
                    }
                }
                function drawText(ctx,deg, text, color,wheel_text_size) {
                    let draw_x = 7*center / 8 ;
                    ctx.save();
                    ctx.translate(center, center);
                    ctx.rotate(deg2rad(deg));
                    ctx.textAlign = "right";
                    ctx.fillStyle = color;
                    ctx.font = '200 ' + wheel_text_size + 'px Helvetica';
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    text = text.replace(/&#(\d{1,4});/g, function (fullStr, code) {
                        return String.fromCharCode(code);
                    });
                    text = text.replaceAll(/&nbsp;/g, ' ');
                    let reText = text.split('\/n'), text1 = '', text2 = '', text3 = '';
                    if (reText.length > 1) {
                        text1 = reText[0];
                        if (reText.length > 2) {
                            text2 = reText[1];
                        } else {
                            text2 = reText.splice(1, reText.length - 1);
                            text2 = text2.join('');
                        }
                        text3 = reText.splice(2, reText.length - 1);
                        text3 = text3.join('');

                    } else {
                        reText = text.split('\\n');
                        if (reText.length > 1) {
                            text1 = reText[0];
                            text2 = reText.splice(1, reText.length - 1);
                            text2 = text2.join('');
                            text3 = reText.splice(2, reText.length - 2);
                            text3 = text3.join('');
                        }
                    }
                    if (text1.trim() !== "" && text2.trim() !== "" && text3.trim() === "") {
                        ctx.fillText(text1.trim(), draw_x, -(wheel_text_size * 1 / 4));
                        ctx.fillText(text2.trim(), draw_x, wheel_text_size * 3 / 4);
                    } else if (text1.trim() !== "" && text2.trim() !== "" && text3.trim() !== "") {
                        ctx.fillText(text1.trim(), draw_x, -(wheel_text_size * 1 / 2));
                        ctx.fillText(text2.trim(), draw_x, (wheel_text_size * 1 / 2));
                        ctx.fillText(text3.trim(), draw_x, (wheel_text_size * 1.5));
                    } else {
                        text = text.replace(/\\n/g, '').replace(/\/n/g, '');
                        let wrappedText = wrapText(ctx, text, draw_x, wheel_text_size, width <= 480 ? (width / 3 - 10):(width /3 - 14), wheel_text_size);
                        for (let wrappedTextItem of wrappedText) {
                            ctx.fillText(wrappedTextItem.text, wrappedTextItem.x, wrappedTextItem.y);
                        }
                    }
                    ctx.restore();
                }
                function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
                    let words = text.split(' ');
                    let countWords = words.length ;
                    let line = ''; // This will store the text of the current line
                    let testLine = ''; // This will store the text when we add a word, to test if it's too long
                    let lineArray = [], result = []; // This is an array of lines, which the function will return
                    for (let i in words) {
                        testLine += `${words[i]} `;
                        let metrics = ctx.measureText(testLine);
                        let testWidth = metrics.width;
                        if (testWidth > maxWidth && i > 0) {
                            // Then the line is finished, push the current line into "lineArray"
                            lineArray.push({text:line,x:x,y:y});
                            line = `${words[i]} `;
                            testLine = `${words[i]} `;
                        } else {
                            // If the test line is still less than the max width, then add the word to the current line
                            line += `${words[i]} `;
                        }
                        if( i == countWords - 1) {
                            lineArray.push({text:line,x:x,y:y});
                        }
                    }
                    let start_y = y / 2 - 2, countLine = lineArray.length;
                    if (countLine > 4){
                        start_y = -y ;
                    }else if (countLine > 2){
                        start_y = -(y * 1 / 2);
                    } else if (countLine > 1){
                        start_y = -(y * 1 / 4);
                    }
                    for (let i in lineArray) {
                        let tmp = lineArray[i];
                        if (i > 0){
                            start_y += lineHeight ;
                        }
                        tmp['y'] = start_y;
                        result.push(tmp);
                    }
                    return result;
                }
            },
            error: function (err) {
                $('.wlwl-preview-emails-button').html('Preview emails');
                $('.preview-lucky-wheel').removeClass('loading');
            }
        })


    });
    /**
     * Start Get download key
     */
    jQuery('.villatheme-get-key-button').one('click', function (e) {
        let v_button = jQuery(this);
        v_button.addClass('loading');
        let data = v_button.data();
        let item_id = data.id;
        let app_url = data.href;
        let main_domain = window.location.hostname;
        main_domain = main_domain.toLowerCase();
        let popup_frame;
        e.preventDefault();
        let download_url = v_button.attr('data-download');
        popup_frame = window.open(app_url, "myWindow", "width=380,height=600");
        window.addEventListener('message', function (event) {
            /*Callback when data send from child popup*/
            let obj = JSON.parse(event.data);
            let update_key = '';
            let message = obj.message;
            let support_until = '';
            let check_key = '';
            if (obj['data'].length > 0) {
                for (let i = 0; i < obj['data'].length; i++) {
                    if (obj['data'][i].id == item_id && (obj['data'][i].domain == main_domain || obj['data'][i].domain == '' || obj['data'][i].domain == null)) {
                        if (update_key == '') {
                            update_key = obj['data'][i].download_key;
                            support_until = obj['data'][i].support_until;
                        } else if (support_until < obj['data'][i].support_until) {
                            update_key = obj['data'][i].download_key;
                            support_until = obj['data'][i].support_until;
                        }
                        if (obj['data'][i].domain == main_domain) {
                            update_key = obj['data'][i].download_key;
                            break;
                        }
                    }
                }
                if (update_key) {
                    check_key = 1;
                    jQuery('.villatheme-autoupdate-key-field').val(update_key);
                }
            }
            v_button.removeClass('loading');
            if (check_key) {
                jQuery('<p><strong>' + message + '</strong></p>').insertAfter(".villatheme-autoupdate-key-field");
                jQuery(v_button).closest('form').submit();
            } else {
                jQuery('<p><strong> Your key is not found. Please contact support@villatheme.com </strong></p>').insertAfter(".villatheme-autoupdate-key-field");
            }
        });
    });
    /**
     * End get download key
     */
});
