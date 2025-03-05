jQuery(document).ready(function ($) {
    'use strict';
    init();
    function init() {
        $('.vi-ui.tabular.menu .item').vi_tab({
            history: true,
            historyType: 'hash'
        });
        $('.vi-ui.accordion:not(.viwcpr-rule-wrap)').vi_accordion('refresh');
        $('.tab:not(.viwcpr-coupon-tab)').find('.dropdown').addClass('viwcpr-dropdown-init').dropdown({placeholder: ''});
        $('.tab:not(.viwcpr-coupon-tab), .viwcpr-coupon-tab1').find('.checkbox').addClass('viwcpr-checkbox-init').checkbox();
        /*Color picker*/
        $('.verified-color').iris({
            change: function (event, ui) {
                $(this).parent().find('.color-picker').css({backgroundColor: ui.color.toString()});
                $('.verified-text').css({'color': ui.color.toString()});
                $('.wcpr-verified-badge-wrap').css({'color': ui.color.toString()});
            },
            hide: true,
            border: true
        }).on('click', function () {
            $('.iris-picker').hide();
            $(this).closest('td').find('.iris-picker').show();
        });
        $('.color-picker').not('.verified-color').wpColorPicker().on('click', function () {
            $('.iris-picker').hide();
            $(this).closest('td').find('.iris-picker').show();
        });
        $('body').on('click',function () {
            $('.wp-picker-active').click();
        });
        $('.color-picker').on('click',function (event) {
            event.stopPropagation();
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
        let wcpr_condition_hide = $('.wcpr_condition_hide');
        if(wcpr_condition_hide.length > 0){
            wcpr_condition_hide.each(function (index, element) {
                let t = $(element),
                    field_condition_id = t.attr('data-field_condition_id'),
                    show_value = t.attr('data-show_value');
                if(field_condition_id.length > 0){
                    let field_condition_selector = $('#'+field_condition_id);

                    if(field_condition_selector.val() == show_value){
                        t.addClass('wcpr-hidden-items');
                    }else{
                        t.removeClass('wcpr-hidden-items');
                    }

                    field_condition_selector.on('change', function(){
                        if ($(this).val() == show_value) {
                            t.removeClass('wcpr-hidden-items');
                        } else {
                            t.addClass('wcpr-hidden-items');
                        }
                    }).trigger('change');
                }
            });
        }
    }
    $(document).on('submit', '.vi-ui.form', function () {
        let error = false, form = $(this);
        let share_review=[];
        form.find('.wcpr-share-reviews-products').each(function (k,v) {
            if ($(v).val().length) {
                share_review.push($(v).val());
            }
            $(v).removeAttr('name');
        });
        form.find('[name=share_reviews]').val(JSON.stringify(share_review));
        form.find('.viwcpr-rule-name-value').each(function (k, v) {
            if (!jQuery(v).val()){
                form.find('.item[data-tab=coupon]').trigger('click');
                jQuery(v).trigger('focus');
                alert("Rule name cannot be empty!");
                error = true;
                return false;
            }
            if (k && form.find('.viwcpr-rule-name-value').eq(k-1).val() === jQuery(v).val()){
                form.find('.item[data-tab=coupon]').trigger('click');
                jQuery(v).trigger('focus');
                alert("Rule name are unique!");
                error = true;
                return false;
            }
        });
        if (!error) {
            form.find('.viwcpr-rule-wrap').each(function (k, v) {
                if (!jQuery(v).find('.coupon-search').val() && jQuery(v).find('.kt_coupons_select').dropdown('get value') === 'kt_existing_coupon'){
                    form.find('.item[data-tab=coupon]').trigger('click');
                    alert("Please select a coupon then save settings!");
                    error = true;
                    return false;
                }
            });
        }
        if (!error) {
            $('input[name="wcpr_custom_fields[name][]"]').each(function () {
                if (!$(this).val()) {
                    form.find('.item[data-tab=custom_fields]').trigger('click');
                    $(this).trigger('focus');
                    alert('Optional field names can not be empty');
                    error = true;
                    return false;
                }
            });
        }
        if (error) {
            form.find('button[type="submit"].loading').removeClass('loading');
            return false;
        }
        $('.wcpr-button-save-settings-container').find('button[type="submit"]').addClass('loading');
    });
    /*Default settings*/
    jQuery(document).on('change','.tab:not(.viwcpr-coupon-tab) input[type="checkbox"], .viwcpr-coupon-tab1 input[type="checkbox"]', function () {
        if (jQuery(this).prop('checked')) {
            jQuery(this).parent().find('input[type="hidden"]').val('1');
        } else {
            jQuery(this).parent().find('input[type="hidden"]').val('');
        }
    });
    $('#ajax_check_content_reviews').on('change',function () {
        if ($(this).prop('checked')){
            $('#ajax_upload_file').closest('tr').fadeIn(300);
        }else {
            $('#ajax_upload_file').closest('tr').fadeOut(300);
        }
    }).trigger('change');
    $('#wcpr-pagination-ajax').on('change', function (e) {
        if ($(this).prop('checked')) {
            $('.wcpr-default-filters').removeClass('wcpr-hidden-items');
        } else {
            $('.wcpr-default-filters').addClass('wcpr-hidden-items');
        }
    });
    $('.wcpr-verified-badge-wrap').on('click', function () {
        $('.wcpr-verified-badge-wrap').removeClass('wcpr-verified-active-badge');
        $(this).addClass('wcpr-verified-active-badge');
        $('input[name="verified_badge"]').val($(this).data('class_name'));
    });
    $(document).on('change','[name=reviews_display]', function () {
        if (jQuery(this).val() === '1'||jQuery(this).val() === '3'||jQuery(this).val() === '4'){
            $('.masonry-options').removeClass('wcpr-hidden-items');
            $('.default-options').addClass('wcpr-hidden-items');
        }else {
            $('.masonry-options').addClass('wcpr-hidden-items');
            $('.default-options').removeClass('wcpr-hidden-items');
        }
    });
    $('.verified-type').dropdown({
        onChange: function (val) {
            switch (val) {
                case 'text':
                    $('.wcpr-verified-badge-wrap-wrap').hide();
                    $('.wcpr-verified-text-wrap-wrap').show();
                    break;
                case 'badge':
                    $('.wcpr-verified-badge-wrap-wrap').show();
                    $('.wcpr-verified-text-wrap-wrap').hide();
                    break;
                default:
                    $('.wcpr-verified-badge-wrap-wrap').hide();
                    $('.wcpr-verified-text-wrap-wrap').hide();
            }
        }
    });
    $(".exclude-addresses").select2({
        closeOnSelect: true,
        tags: true,
        createTag: function (params) {
            // Don't offset to create a tag if there is no @ symbol
            if (params.term.indexOf('@') === -1) {
                // Return null to disable tag creation
                return null;
            }

            return {
                id: params.term,
                text: params.term
            }
        }
    });
    $('.viwcpr-search-select2').each(function (k, v) {
        v = $(v);
        if ($(v).closest('.viwcpr-coupon-tab').length){
            return true;
        }
        let placeholder = '', action = '', close_on_select = false, allowClear = false;
        if (v.hasClass('category-search')){
            placeholder = 'Please enter the category title';
            action = 'wcpr_search_cate';
        }else if (v.hasClass('product-search')){
            placeholder = 'Please fill in your product title';
            action = 'wcpr_search_parent_product';
        }else if (v.hasClass('wcpr-page-search')){
            placeholder = 'Please fill in your page title';
            action = 'wcpr_search_page';
            close_on_select = true;
            allowClear = true;
        }
        if (action) {
            v.addClass('viwcpr-search-select2-init').select2(select2_params(placeholder, action, close_on_select, allowClear));
        }
    });
    function select2_params(placeholder = '', action = '', close_on_select = false, allowClear = false,min_input = 1){
        let result = {
            closeOnSelect: close_on_select,
            placeholder: placeholder,
            allowClear: allowClear,
        };
        if (action) {
            result['minimumInputLength'] = min_input;
            result['escapeMarkup'] = function (markup) {
                return markup;
            };
            result['ajax'] = {
                url: "admin-ajax.php?action=" + action,
                dataType: 'json',
                type: "GET",
                quietMillis: 50,
                delay: 250,
                data: function (params) {
                    return {
                        keyword: params.term,
                        nonce:$('#wcpr_nonce_field').val()
                    };
                },
                processResults: function (data) {
                    return {
                        results: data
                    };
                },
                cache: true
            };
        }
        return result;
    }
    /*rule coupons*/
    if ($('.viwcpr-coupon-rules-wrap').length) {
        $('.viwcpr-coupon-rules-wrap').sortable({
            connectWith: ".viwcpr-coupon-rules-wrap",
            handle: ".viwcpr-rule-info",
            cancel: ".viwcpr-rule-active-wrap,.viwcpr-rule-action,.title,.content",
            placeholder: "viwcpr-placeholder",
        });
        $('.viwcpr-coupon-tab .viwcpr-rule-wrap:not(.viwcpr-rule-wrap-init)').each(function () {
            viwcpr_rule(jQuery(this).addClass('viwcpr-rule-wrap-init'));
        });
    }
    let tinyMceOptions = {
        tinymce: {
            theme: "modern",
            skin: "lightgray",
            language: "en",
            formats: {
                alignleft: [
                    {selector: "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li", styles: {textAlign: "left"}},
                    {selector: "img,table,dl.wp-caption", classes: "alignleft"}
                ],
                aligncenter: [
                    {selector: "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li", styles: {textAlign: "center"}},
                    {selector: "img,table,dl.wp-caption", classes: "aligncenter"}
                ],
                alignright: [
                    {selector: "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li", styles: {textAlign: "right"}},
                    {selector: "img,table,dl.wp-caption", classes: "alignright"}
                ],
                strikethrough: {inline: "del"}
            },
            relative_urls: false,
            remove_script_host: false,
            convert_urls: false,
            browser_spellcheck: true,
            fix_list_elements: true,
            entities: "38,amp,60,lt,62,gt",
            entity_encoding: "raw",
            keep_styles: false,
            cache_suffix: "wp-mce-49110-20201110",
            resize: "vertical",
            menubar: false,
            branding: false,
            preview_styles: "font-family font-size font-weight font-style text-decoration text-transform",
            end_container_on_empty_block: true,
            wpeditimage_html5_captions: true,
            wp_lang_attr: "en-US",
            wp_keep_scroll_position: false,
            plugins: "charmap,colorpicker,hr,lists,media,paste,tabfocus,textcolor,wordpress,wpautoresize,wpeditimage,wpemoji,wpgallery,wplink,wpdialogs,wptextpattern,wpview",
            wpautop: true,
            indent: false,
            toolbar1: "formatselect,fontsizeselect,forecolor,bold,italic,bullist,numlist,blockquote,alignleft,aligncenter,alignright,link,spellchecker,wp_adv",
            toolbar2: "strikethrough,hr,pastetext,removeformat,charmap,outdent,indent,undo,redo,wp_help",
            tabfocus_elements: ":prev,:next",
            body_class: "excerpt post-type-product post-status-publish page-template-default locale-en-us",
        },
        mediaButtons: true,
        quicktags: true
    };
    function viwcpr_rule(rule){
        rule = $(rule);
        rule.vi_accordion('refresh');
        rule.find('.vi-ui.dropdown:not(.viwcpr-dropdown-init)').addClass('viwcpr-dropdown-init').dropdown();
        rule.find('.vi-ui.checkbox:not(.viwcpr-checkbox-init)').addClass('viwcpr-checkbox-init').checkbox();
        rule.find('input[type="checkbox"]').on('change', function () {
            if (jQuery(this).prop('checked')) {
                jQuery(this).parent().find('input[type="hidden"]').val('1');
            } else {
                jQuery(this).parent().find('input[type="hidden"]').val('');
            }
        });
        rule.find('.viwcpr-rule-name-value').on('keyup', function () {
           rule.find('.viwcpr-rule-name').html(jQuery(this).val());
        });
        rule.find('.viwcpr-search-select2:not(.viwcpr-search-select2-init)').map(function (k, v) {
            v = $(v);
            let placeholder = '', action = '', close_on_select = false, allowClear = false;
            if (v.hasClass('category-search')){
                placeholder = 'Please enter the category title';
                action = 'wcpr_search_cate';
            }else if (v.hasClass('product-search')){
                placeholder = 'Please fill in your product title';
                action = 'wcpr_search_parent_product';
            }else if (v.hasClass('coupon-search')){
                placeholder = 'Type coupon code here';
                action = 'wcpr_search_coupon';
            }
            if (action) {
                v.addClass('viwcpr-search-select2-init').select2(select2_params(placeholder, action, close_on_select, allowClear));
            }
        });
        if (rule.find('.kt_coupons_select').dropdown('get value') === 'kt_generate_coupon'){
            rule.find('.kt-custom-coupon').removeClass('wcpr-hidden');
            rule.find('.kt-existing-coupons').addClass('wcpr-hidden');
        }else {
            rule.find('.kt-custom-coupon').addClass('wcpr-hidden');
            rule.find('.kt-existing-coupons').removeClass('wcpr-hidden');
        }
        rule.find('.kt_coupons_select').dropdown({
            onChange:function (val) {
                if (val === 'kt_generate_coupon'){
                    rule.find('.kt-custom-coupon').removeClass('wcpr-hidden');
                    rule.find('.kt-existing-coupons').addClass('wcpr-hidden');
                }else {
                    rule.find('.kt-custom-coupon').addClass('wcpr-hidden');
                    rule.find('.kt-existing-coupons').removeClass('wcpr-hidden');
                }
            }
        });
        rule.on('click','.coupon-preview-emails-button', function () {
            let old_preview_text = $(this).html(), button = $(this);
            button.html(woo_photo_reviews_params_admin.text_please_wait);
            let language = button.data('wcpr_language'),
                editor_id = button.data('editor_id');
            $.ajax({
                url: woo_photo_reviews_params_admin.url,
                type: 'GET',
                dataType: 'JSON',
                data: {
                    action: 'wcpr_preview_emails',
                    nonce: $('#wcpr_nonce_field').val(),
                    email_type: 'coupon',
                    heading: rule.find('.heading' + language).val(),
                    content: tinyMCE.get(editor_id) ? tinyMCE.get(editor_id).getContent() : $('#content' + language).val(),
                },
                success: function (response) {
                    button.html(old_preview_text);
                    if (response) {
                        $('.preview-emails-html').html(response.html);
                        $('.preview-emails-html-container').removeClass('preview-html-hidden');
                    }
                },
                error: function (err) {
                    console.log(err)
                    button.html(old_preview_text);
                }
            })
        });
        rule.find('.viwcpr-rule-remove').unbind().on('click', function (e) {
            if (jQuery('.viwcpr-rule-remove').length === 1) {
                alert('You can not remove the last item.');
                return false;
            }
            if (confirm("Would you want to remove this?")) {
                rule.remove();
            }
            e.stopPropagation();
        });
        rule.find('.viwcpr-rule-clone').unbind().on('click', function (e) {
            e.stopPropagation();
            let rule_id = rule.data('rule_id'),
                newRow = rule.clone(),
                $now = Date.now();
            newRow.attr('data-rule_id', $now);
            newRow.find('.viwcpr-rule-id').val($now);
            newRow.find('input, select, textarea').each(function (k, v) {
                let name = jQuery(v).attr('name') || '';
                name = name.replace('['+rule_id+']','['+ $now+']');
                jQuery(v).attr('name', name);
                if (jQuery(v).is('textarea') && jQuery(v).closest('.wp-editor-wrap').length){
                    let id = jQuery(v).attr('id');
                    id = id.replace('--'+rule_id+'--','--'+ $now+'--');
                    jQuery(v).attr('id',id).attr('class', '').show();
                    let temp = jQuery(v).clone(),
                        button = jQuery(v).closest('.wp-editor-wrap').find('.coupon-preview-emails-button').clone();
                    button.attr('data-editor_id', id);
                    jQuery(v).closest('.wp-editor-wrap').replaceWith(temp);
                    setTimeout(function (textarea_id,button) {
                        let init_editor = async function(){
                            await new Promise(function (resolve) {
                                wp.editor.initialize(textarea_id, tinyMceOptions);
                                resolve(textarea_id);
                            });
                        };
                        init_editor().then(function () {
                            jQuery('#'+textarea_id).closest('.wp-editor-wrap').find('.wp-media-buttons').append(button);
                        })
                    },100, id,button);
                }
            });
            for (let i = 0; i < newRow.find('.vi-ui.dropdown').length; i++) {
                let selected = rule.find('.vi-ui.dropdown').eq(i).dropdown('get value');
                newRow.find('.vi-ui.dropdown').eq(i).dropdown('set selected', selected);
            }
            newRow.find('.viwcpr-condition-wrap-wrap').removeClass('viredis-condition-wrap-wrap-init');
            newRow.find('.viwcpr-dropdown-init').removeClass('viwcpr-dropdown-init');
            newRow.find('.viwcpr-checkbox-init').removeClass('viwcpr-checkbox-init');
            newRow.find('.select2').remove();
            newRow.find('.viwcpr-search-select2.viwcpr-search-select2-init').each(function (k, v) {
                let val = jQuery(v).hasClass('coupon-search') ?'':rule.find('.viwcpr-search-select2.viwcpr-search-select2-init').eq(k).val();
                jQuery(v).removeClass('viwcpr-search-select2-init').val(val).trigger('change');
            });
            viwcpr_rule(newRow);
            newRow.insertAfter(rule);
            e.stopPropagation();
        });
    }
    /*preview email*/
    $(document).on('click','.preview-emails-html-overlay', function () {
        $('.preview-emails-html-container').addClass('preview-html-hidden');
    });
    $(document).on('click', '.reminder-preview-emails-button', function () {
        let button = $(this);
        let old_preview_text = button.html();
        button.html(woo_photo_reviews_params_admin.text_please_wait);
        let language = button.data('wcpr_language'),
            editor_id = button.data('wcpr_id') || ('follow_up_email_content' + language);
        $.ajax({
            url: woo_photo_reviews_params_admin.url,
            type: 'GET',
            dataType: 'JSON',
            data: {
                action: 'wcpr_preview_emails',
                nonce: $('#wcpr_nonce_field').val(),
                anchor: $('#wcpr-reviews-anchor-link').val(),
                email_type: 'reminder',
                heading: $('#follow_up_email_heading' + language).val(),
                review_button: $('#button-review-now' + language).val(),
                review_button_bg_color: $('#button-review-now-bg-color').val(),
                review_button_color: $('#button-review-now-color').val(),
                product_image_width: $('#product-image-width').val(),
                content: tinyMCE.get(editor_id) ? tinyMCE.get(editor_id).getContent() : $('#' + editor_id).val(),
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
    /*Select all product*/
    $(document).on('click','.wcpr-clear-all-product', function () {
        let select_field = $(this).parent().find('.product-search');
        if (select_field.length) {
            select_field.val(null).trigger('change');
        }
    });
    $(document).on('click','.wcpr-select-all-product', function () {
        let button = $(this);
        if (button.hasClass('loading')) {
            return;
        }
        let select_field = button.parent().find('.product-search');
        button.addClass('loading');
        $.ajax({
            url: woo_photo_reviews_params_admin.url,
            type: 'GET',
            dataType: 'JSON',
            data: {
                action: 'wcpr_select_all_products',
                nonce: woo_photo_reviews_params_admin.nonce,
            },
            success: function (response) {
                if (response.length > 0) {
                    select_field.val(null).trigger('change');
                    let ids = [];
                    for (let i in response) {
                        let product_id = response[i].id;
                        ids.push(product_id);
                        if (select_field.find("option[value='" + product_id + "']").length == 0) {
                            let data = {
                                id: product_id,
                                text: response[i].text
                            };
                            let newOption = new Option(data.text, data.id, false, false);
                            select_field.append(newOption).trigger('change');
                        }
                    }
                    select_field.val(ids).trigger('change')
                }
            },
            error: function (err) {
                console.log(err);
            },
            complete: function () {
                button.removeClass('loading')
            }
        })
    });
    /*update comment meta - vote */
    let updateCmtMetaProcess = $('.update-comment-meta-process');
    let updateCmtMetaButton = $('.reviews-update-comment-meta');
    function update_comment_meta(currentPage, maxPage) {
        $.ajax({
            url: "admin-ajax.php",
            type: 'POST',
            dataType: 'json',
            data: {
                action: 'wcpr_update_comment_meta',
                nonce: woo_photo_reviews_params_admin.nonce,
                page: currentPage,
                end: currentPage === maxPage
            },
            success(res) {
                if (res.success) {
                    updateCmtMetaProcess.text(Math.ceil(currentPage / maxPage * 100) + '%');
                    if (currentPage + 1 <= maxPage) {
                        update_comment_meta(currentPage + 1, maxPage);
                    }

                    if (currentPage === maxPage) {
                        updateCmtMetaButton.removeClass('loading');
                    }
                }
            }
        });
    }
    updateCmtMetaButton.on('click', function () {
        $.ajax({
            url: "admin-ajax.php?action=wcpr_count_comment_meta",
            type: 'GET',
            dataType: 'json',
            beforeSend() {
                updateCmtMetaButton.addClass('loading')
            },
            success(res) {
                if (res.success && res.data.pages) {
                    updateCmtMetaProcess.text('0%');
                    update_comment_meta(1, res.data.pages);
                }
            }
        });
    });
    /* resend reminder email */
    jQuery(document).on('change','#followup_email_loop', function () {
        if (jQuery(this).prop('checked')) {
            $('.wcpr-followup_email_loop-enable').removeClass('wcpr-hidden-items');
        } else {
            $('.wcpr-followup_email_loop-enable').addClass('wcpr-hidden-items');
        }
    });
    $(document).on('click', '.wcpr-reminder_email_template-remove', function () {
        if (confirm('Do you really want to remove this row?')) {
            $(this).closest('.wcpr-reminder_email_template-row').remove();
        }
    });
    $(document).on('click', '.wcpr-reminder_email_template-add', function () {
        $('.wcpr-reminder_email_template-container tbody').append(woo_photo_reviews_params_admin.reminder_email_template_html);
        jQuery('.wcpr-reminder_email_template-row').last().find('.dropdown').dropdown({placeholder: ''});
    });
    $(document).on('click', '.wcpr-reminder_email_content-remove', function () {
        if (confirm('Do you really want to remove this row?')) {
            $(this).closest('.wcpr-reminder_email_content-row').remove();
        }
    });
    $(document).on('click', '.wcpr-reminder_email_content-add:not(.loading)', function () {
        let reminder_email_content_html = jQuery('.wcpr-reminder_email_content-html-wrap tbody').html();
        $('.wcpr-reminder_email_content-container tbody').append(reminder_email_content_html);
    });
    /*optional field*/
    $('.wcpr-add-custom-field').on('click', function () {
        $('.wcpr-add-custom-field-container').append(woo_photo_reviews_params_admin.add_field_html);
    });
    $('body').on('click', '.wcpr-remove-custom-field', function () {
        if (confirm('Remove this field?')) {
            $(this).closest('tr').remove();
        }
    });
    /*Phrases filter*/
    $('.add-phrases-filter-rule').on('click', function () {
        let clone = `<tr class="clone-source">
                        <td>
                            <input type="text" name="phrases_filter[from_string][]">
                        </td>
                         <td>
                            <div class="phrases-filter-sensitive-container">
                            <input type="checkbox" value="1" class="phrases-filter-sensitive">                            
                            <input type="hidden" class="phrases-filter-sensitive-value" value="" name="phrases_filter[sensitive][]">
                            </div>
                        </td>
                        <td>
                            <input type="text" name="phrases_filter[to_string][]"  placeholder="Leave blank to delete matches">
                        </td>
                        <td>
                            <button type="button" class="vi-ui button negative delete-phrases-filter-rule">
                                <i class="dashicons dashicons-trash "></i>
                            </button>
                        </td>
                    </tr>`;

        $('.phrases-filter tbody').append(clone);
    });
    $('body').on('change', '.phrases-filter-sensitive', function () {
        let $container = $(this).closest('.phrases-filter-sensitive-container');
        let $sensitive_value = $container.find('.phrases-filter-sensitive-value');
        let sensitive_value = $(this).prop('checked') ? 1 : '';
        $sensitive_value.val(sensitive_value);
    });
    $('body').on('click', '.delete-phrases-filter-rule', function () {
        if (confirm('Remove this item?')) {
            $(this).closest('.clone-source').remove();
        }
    });
    /*Secret key for chrome extension*/
    $('.wcpr-generate-secretkey').on('click', function () {
        var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split(""), b = [];
        for (let i = 0; i < 32; i++) {
            var j = (Math.random() * (a.length - 1)).toFixed(0);
            b[i] = a[j];
        }

        $('.wcpr-secret-key').val(b.join(""));
    });
    $('.wcpr-copy-secretkey').on('click', function () {
        let $container = $(this).closest('td');
        $container.find('.wcpr-secret-key').select();
        $container.find('.wcpr-copy-secretkey-success').remove();
        document.execCommand('copy', true);
        let $result_icon = $('<span class="wcpr-copy-secretkey-success dashicons dashicons-yes" title="Copied to Clipboard"></span>');
        $container.append($result_icon);
        $result_icon.fadeOut(10000);
        setTimeout(function () {
            $result_icon.remove();
        }, 10000);
    });
    /*Share reviews*/
    $(document).on('click', '.wcpr-share-reviews-remove', function () {
        if (confirm('Do you really want to remove this row?')) {
            let $button = $(this), $container = $button.closest('table');
            let $rows = $container.find('.wcpr-share-reviews-row');
            if ($rows.length > 1) {
                $button.closest('.wcpr-share-reviews-row').remove();
                share_reviews_recalculate_index()
            } else if ($rows.length === 1) {
                $rows.eq(0).find('.wcpr-share-reviews-products').val('').trigger('change');
            }
        }
    });
    $(document).on('click', '.wcpr-share-reviews-add', function () {
        let $button = $(this), $container = $button.closest('table');
        let $row = $container.find('.wcpr-share-reviews-row').last().clone();
        $row.find('.select2-container').remove();
        $row.find('.product-search').select2({
            closeOnSelect: false,
            placeholder: "Please fill in your product title",
            ajax: {
                url: "admin-ajax.php?action=wcpr_search_parent_product",
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
        }).val('').trigger('change');
        $container.find('tbody').append($row);
        share_reviews_recalculate_index();
    });
    function share_reviews_recalculate_index() {
        let index = 0;
        $('.wcpr-share-reviews-row').map(function () {
            let $row = $(this);
            // $row.find('.wcpr-share-reviews-products').attr('name', `share_reviews[${index}][]`);
            index++;
            $row.find('.wcpr-share-reviews-row-no').html(index);
        })
    }
});