"use strict";

(function ($) {
    $(document).on('click', '#wpil_target_keyword_reset_button', wpil_target_keyword_reset);

    var is_wpil_target_keyword_reset = (undefined !== is_wpil_target_keyword_reset) ? is_wpil_target_keyword_reset : false;

    if (is_wpil_target_keyword_reset) {
        wpil_target_keyword_reset_process(2, 1);
    }

    function wpil_target_keyword_reset() {
        var text = $('#wpil_target_keyword_reset_notice').val();
        var auth = $('#wpil_target_keyword_gsc_authenticated').val();
        var authText = ($('#wpil_target_keyword_gsc_not_authtext_a').val() + '\n\n' + $('#wpil_target_keyword_gsc_not_authtext_b').val());

        if(auth < 1 && false){ // todo make into separate button or remove
            wpil_swal({
                title: 'Link Whisper Not Authorized',
                text: (authText) ? authText: 'Link Whisper can not connect to Google Search Console because it has not been authorized yet. \n\n Please go to the Link Whisper Settings and authorize access.',
                icon: 'info',
            });
            return;
        }


        wpil_swal({
            title: 'Please Confirm',
            text: (text) ? text: 'Please confirm refreshing the target keywords. If you\'ve authenticated the connection to Google Search Console, this will refresh the keyword data.',
            icon: 'info',
            buttons: {
                cancel: true,
                confirm: true,
            },
            }).then((reset) => {
              if(reset){
                $('#wpil_target_keyword_table .table').hide();
                $('#wpil_target_keyword_table .progress').show();
                wpil_target_keyword_reset_process(1, 1, true);
              }
            });
    }

    function wpil_target_keyword_reset_process(count, total, reset = false) {
        $.ajax({
            type: "POST",
            url: ajaxurl,
            data: {
                action: 'wpil_target_keyword_reset',
                nonce: wpil_target_keyword_nonce,
                count: count,
                total: total,
                reset: reset,
            },
            error: function (jqXHR, textStatus, errorThrown) {
                var wrapper = document.createElement('div');
                $(wrapper).append('<strong>' + textStatus + '</strong><br>');
                $(wrapper).append(jqXHR.responseText);
                wpil_swal({"title": "Error", "content": wrapper, "icon": "error"}).then(function(){
                    location.reload();
                });
            },
            success: function(response){
                console.log(response);
                if (response.error) {
                    wpil_swal(response.error.title, response.error.text, 'error');
                    return;
                }

                var state = false;
                switch (response.state) {
                    case 'gsc_query':
                        state = 'Getting Google Search Console Data... ' + response.keywords_found + ' Keywords Downloaded';
                        break;
                    case 'gsc_process':
                        state = 'Processing Google Search Console Data';
                        break;
                    case 'gsc_keyword_tag':
                        state = 'Auto Selecting Top Google Search Console Keywords';
                        break;
                    case 'yoast_process':
                        state = 'Processing Yoast Keyword Data';
                        break;
                    case 'rank_math_process':
                        state = 'Processing Rank Math Keyword Data';
                        break;
                    case 'aioseo_process':
                        state = 'Processing All in One SEO Keyword Data';
                        break;
                    case 'post_keyword_process':
                        state = 'Processing Page Content Keywords';
                        break;
                    case 'custom_process':
                        state = 'Processing Custom Keywords';
                        break;
                }

                if(state){
                    $('.progress_count').html(state);
                }

                if (response.finish) {
                    location.reload();
                } else {
                    wpil_target_keyword_reset_process(response.count, response.total)
                }
            }
        });
    }

    $(document).on('change', '#wpil_target-keywords input[type="checkbox"]', function(){
        var keyId = $(this).val();
        var checked = $(this).is(':checked');

        $('.keyword-' + keyId).prop('checked', checked);
    });

    $(document).on('click', '.wpil-update-selected-keywords', updateSelectedKeywords);
    function updateSelectedKeywords(e){
        e.preventDefault();
        var button = $(this),
            data = {};

        // if we're update keywords from the post/term edit pages
        if($('#wpil_target-keywords').length){
            $('#wpil_target-keywords').find('input').each(function(index, element){
                var el = $(element);
                if(undefined === el.data('keyword-id')){
                    return;
                }
                console.log(el);
                data[el.data('keyword-id')] = el.is(':checked');
            });
        }else{
            $(this).parents('.wpil-collapsible-wrapper').find('input').each(function(index, element){
                var el = $(element);
                console.log(el);
                data[el.data('keyword-id')] = el.is(':checked');
            });
        }

        if(!data){
            wpil_swal('Error', 'There were no keywords found in the dropdown!', 'error');
            return;
        }

        $.ajax({
            type: "POST",
            url: ajaxurl,
            data: {
                action: 'wpil_target_keyword_selected_update',
                nonce: $(this).data('nonce'),
                post_id: $(this).data('post-id'),
                selected: data
            },
            error: function (jqXHR, textStatus, errorThrown) {
                var wrapper = document.createElement('div');
                $(wrapper).append('<strong>' + textStatus + '</strong><br>');
                $(wrapper).append(jqXHR.responseText);
                wpil_swal({"title": "Error", "content": wrapper, "icon": "error"}).then(function(){
                    location.reload();
                });
            },
            success: function(response){
                if (response.error) {
                    wpil_swal(response.error.title, response.error.text, 'error');
                    return;
                }else if(response.success){
                    if($('.link-whisper_page_link_whisper_target_keywords').length > 0){
                        var noItems = true;
                        for(var i in data){
                            // if the keyword is active, show the keyword
                            if(data[i]){
                                noItems = false;
                                $('#active-keyword-' + i).css({'display': 'inline-block'});
                            }else{
                                $('#active-keyword-' + i).css({'display': 'none'});
                            }

                        }

                        if(noItems){
                            button.parents('tr').find('.no-active-keywords-notice').css({'display': 'inline-block'});
                        }else{
                            button.parents('tr').find('.no-active-keywords-notice').css({'display': 'none'});
                        }
                    }

                    wpil_swal(response.success.title, response.success.text, 'success');

                    if($('.wpil-suggestions-can-be-regenerated').length){
                        // allow the suggestions to be regenerated
                        $('.wpil-suggestions-can-be-regenerated').val(1).trigger('change');
                    }
                }
            }
        });
    }

    var addingKeywords = false;
    $(document).on('click', '.wpil-create-target-keywords', addCustomTargetKeywords);
    function addCustomTargetKeywords(e){
        e.preventDefault();

        if(addingKeywords){
            return;
        }

        addingKeywords = true;

        var button = $(this);
        var parent = $(this).parents('.create-post-keywords');
        var keywords = [];
        $(parent).find('.create-custom-target-keyword-input').each(function(index, element){
            var keyword = $(element).val();
            if(keyword){
                keywords.push(keyword);
            }
        });
        var wrapper = button.parents('.wpil-collapsible-wrapper');

        if(!keywords){
            wpil_swal('Keyword empty', 'Please enter a keyword in the New Custom Keyword field.', 'info');
            addingKeywords = false;
            return;
        }

        // flip the array so the keywords are inserted from top to bottom
        keywords.reverse();

        button.addClass('wpil_button_is_active');

        $.ajax({
            type: "POST",
            url: ajaxurl,
            data: {
                action: 'wpil_create_custom_target_keyword',
                nonce: button.data('nonce'),
                post_id: button.data('post-id'),
                post_type: button.data('post-type'),
                keywords: keywords
            },
            error: function (jqXHR, textStatus, errorThrown) {
                wpil_swal('Error', textStatus + "\n\n" + jqXHR.responseText, 'error').then(function(){
                    location.reload();
                });
            },
            success: function(response){
                console.log(response);
                if (response.error) {
                    wpil_swal(response.error.title, response.error.text, 'error');
                    return;
                }else if(response.success){
                    if($('.link-whisper_page_link_whisper_target_keywords').length > 0){
                        wpil_swal(response.success.title, response.success.text, 'success').then(function(){
                            var activeKeywordsCloud = button.parents('tr').find('.column-word_cloud ul');
                            var activeKeyword = '';

                            $(response.success.data).each(function(index, dat){
                                button.parents('.wpil-collapsible-wrapper').find('.report_links').append(dat.reportRow);
                                activeKeyword += '<li id="active-keyword-' + dat.keywordId + '" class="wpil-target-keyword-active-kywrd">' + dat.keyword + '</li>';
                            });

                            $(activeKeywordsCloud).find('.no-active-keywords-notice').css({'display': 'none'});
                            $(activeKeywordsCloud).append(activeKeyword);

                            // update the custom keyword count
                            var count = wrapper.find('.report_links li:visible').length;
                            wrapper.find('.wpil-collapsible').text(count);
                        });
                    }else{
                        wpil_swal(response.success.title, response.success.text, 'success').then(function(){
                            console.log(button.parents('#wpil-keyword-select-metabox').find('#keywordchecklist'));

                            $(response.success.data).each(function(index, dat){
                                button.parents('#wpil-keyword-select-metabox').find('#keywordchecklist').append(dat.suggestionRow);
                                button.parents('#wpil-keyword-select-metabox').find('#keywordchecklist-custom').append(dat.suggestionRow);
                            });

                            // allow the suggestions to be regenerated
                            $('.wpil-suggestions-can-be-regenerated').val(1).trigger('change');
                        });
                    }

                    parent.find('.input-clone').remove();
                    parent.find('.create-custom-target-keyword-input').val('');
                }
            },
            complete: function(){
                button.removeClass('wpil_button_is_active');
                addingKeywords = false;
            }
        });
    }

    $(document).on('click', '.wpil-add-target-keyword-row', addTargetKeywordRow);
    function addTargetKeywordRow(e){
        e.preventDefault();
        var parent = $(this).parents('.create-post-keywords');
        $(parent).find('.wpil-create-target-keywords-row-container').append('<input type="text" style="width: 100%; margin-top:5px;" class="create-custom-target-keyword-input input-clone" placeholder="New Custom Keyword">');
    }

    var deletingKeywords = false;
    $(document).on('click', '.wpil_target_keyword_delete', deleteCustomTargetKeywords);
    function deleteCustomTargetKeywords(e){
        e.preventDefault();

        if(deletingKeywords){
            return;
        }

        deletingKeywords = true;
        var keywordId = $(this).data('keyword-id');
        var nonce = $(this).data('nonce');
        var button = $(this);
        var wrapper = $(this).parents('.wpil-collapsible-wrapper');

        $.ajax({
            type: "POST",
            url: ajaxurl,
            data: {
                action: 'wpil_delete_custom_target_keyword',
                nonce: nonce,
                keyword_id: keywordId,
            },
            error: function (jqXHR, textStatus, errorThrown) {
                var wrapper = document.createElement('div');
                $(wrapper).append('<strong>' + textStatus + '</strong><br>');
                $(wrapper).append(jqXHR.responseText);
                wpil_swal({"title": "Error", "content": wrapper, "icon": "error"}).then(function(){
                    location.reload();
                });
            },
            success: function(response){
                console.log(response);
                if (response.error) {
                    wpil_swal(response.error.title, response.error.text, 'error');
                    return;
                }else if(response.success){
                    if($('.link-whisper_page_link_whisper_target_keywords').length > 0){
                        wpil_swal(response.success.title, response.success.text, 'success').then(function(){
                            $('#target-keyword-' + keywordId).fadeOut(300, function(){
                                var count = wrapper.find('.report_links li:visible').length;
                                wrapper.find('.wpil-collapsible').text(count);
                            });

                            // hide the active keyword button
                            $('#active-keyword-' + keywordId).fadeOut(300, function(){
                                var activeKeywordsCount = button.parents('tr').find('.column-word_cloud li:visible').length;
                                if(activeKeywordsCount < 1){
                                    button.parents('tr').find('.column-word_cloud li.no-active-keywords-notice').css({'display': 'inline-block'});
                                }
                            });
                            
                        });
                    }else{
                        wpil_swal(response.success.title, response.success.text, 'success').then(function(){
                            $('#keyword-all-' + keywordId + ', #keyword-custom-' + keywordId).fadeOut(300);
                            $('.wpil-suggestions-can-be-regenerated').val(1).trigger('change');
                        });
                    }
                }
            },
            complete: function(){
                deletingKeywords = false;
            }
        });
    }

    $(document).on('click', '.wpil-inbound-target-keyword-edit-button .button-primary', toggleInboundTargetKeywordForm);
    function toggleInboundTargetKeywordForm(){
        $('.wpil-inbound-target-keyword-edit-form').toggle();
        saveInboundTargetKeywordVisibility(this);
    }

    function saveInboundTargetKeywordVisibility(button){
        var visible = $('.wpil-inbound-target-keyword-edit-form').is(':visible');
        var nonce = $(button).data('nonce');

        $.ajax({
            type: "POST",
            url: ajaxurl,
            data: {
                action: 'wpil_save_inbound_target_keyword_visibility',
                nonce: nonce,
                visible: (visible) ? 1: 0,
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            },
            success: function(response){
                console.log(response);

            },
        });
    }

    // switch tabs in the keyword metabox
    $('#wpil-keyword-select-metabox #keyword-tabs a').on('click', switchTab);
    function switchTab(e){
        e.preventDefault();
        $('.keyword-tab').removeClass('tabs');
        $(this).parents('li').addClass('tabs'),
        $('#wpil-keyword-select-metabox .tabs-panel').css({'display': 'none'});
        var tab = $(this).data('keyword-tab')
        $('#' + tab).css({'display': 'block'});

        var visibleInputs = $('#wpil-keyword-select-metabox .tabs-panel input:visible');

        if(tab !== 'keywords-custom' && visibleInputs.length > 0){
            $('.wpil-update-selected-keywords').css({'display': 'inline-block'});
        }else{
            $('.wpil-update-selected-keywords').css({'display': 'none'});
        }
    }

    $(document).on('click', '#wpil_links_table_filter .button-primary', wpil_report_filter_submit);

    function wpil_report_filter_submit() {
        var block = $(this).closest('div');
        var post_type = block.find('select[name="keyword_post_type"]').val();
        var filterNonce = block.find('.post-filter-nonce').val();
        var url = wpil_admin_url + 'admin.php?page=link_whisper_target_keywords';

        if(post_type){
            url += '&keyword_post_type=' + post_type;
        }

        // save the updated filter settings
        updateFilterSettings(post_type, '', filterNonce, url);
    }

    function updateFilterSettings(postType = '', category = '', filterNonce, url){
        var data = {
            action: 'wpil_save_user_filter_settings',
            post_type: postType,
            category: category,
            setting_type: 'target_keywords',
            nonce: filterNonce
        };

        $.ajax({
            url: ajaxurl,
            dataType: 'json',
            data: data,
            method: 'post',
            error: function (jqXHR, textStatus, errorThrown) {
                wpil_swal('Error', msg, 'error');
            },
            success: function (response) {
                location.href = url;
            }
        });
    }

})(jQuery);