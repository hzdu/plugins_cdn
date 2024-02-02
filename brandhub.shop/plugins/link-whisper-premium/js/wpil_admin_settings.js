"use strict";

(function ($)
{
    
    var hasChangedLanguage = false;


    jQuery('.wpil-setting-multiselect').select2();

    $('.settings-carrot').on('click', openCloseSettings);
    function openCloseSettings(){
        var $setting = $(this),
            active = $setting.hasClass('active');
        if(active){
            $setting.removeClass('active');
            $(this).closest('tr').find('.setting-control').css({'height': '0px', 'overflow': 'hidden'});
            $('.setting-control-container').css({'display': 'none'});
        }else{
            $setting.addClass('active');
            $(this).closest('tr').find('.setting-control').css('height', 'initial');
            $('.setting-control-container').css({'display': 'table-cell'});
        }
    }
    
    $('#wpil-selected-language').on('change', updateDisplayedIgnoreWordList);
    function updateDisplayedIgnoreWordList(){

        var wordLists = $('#wpil-available-language-word-lists').val(),
            selectedLang = $('#wpil-selected-language').val();
        if(!wordLists){
            return;
        }

        if(!hasChangedLanguage){
            var str1 = $('#wpil-currently-selected-language-confirm-text-1').val();
            var str2 = $('#wpil-currently-selected-language-confirm-text-2').val();
            var text = (str1 + '\n\n' + str2);

            wpil_swal({
                title: 'Notice:',
                text: (text) ? text: 'Changing Link Whisper\'s language will replace the current Words to be Ignored with a new list of words. \n\n If you\'ve added any words to the Words to be Ignored area, this will erase them.',
                icon: 'info',
                buttons: {
                    cancel: true,
                    confirm: true,
                },
                }).then((replace) => {
                  if (replace) {
                        wordLists = JSON.parse(wordLists);
                        if(wordLists[selectedLang]){
                            $('#ignore_words_textarea').val(wordLists[selectedLang].join('\n'));
                            $('#wpil-currently-selected-language').val(selectedLang);
                            hasChangedLanguage = true;
                        }
                  } else {
                    $('#wpil-selected-language').val($('#wpil-currently-selected-language').val());
                  }
                });
        }else{
            wordLists = JSON.parse(wordLists);
            if(wordLists[selectedLang]){
                $('#ignore_words_textarea').val(wordLists[selectedLang].join('\n'));
                $('#wpil-currently-selected-language').val(selectedLang);
            }
        }
    }

    // supplies base64ed data for the 
    $(document).on('submit', '#frmSaveSettings', function(){
        var ignoreWords = $('#ignore_words_textarea').val();
        if(ignoreWords){
            $('#ignore_words').val(Base64.encode(ignoreWords));
        }
    });

    $(document).on('change', 'input[name="wpil_add_icon_to_external_link"], input[name="wpil_add_icon_to_internal_link"]', toggleSiteLinkIconSettings);
    function toggleSiteLinkIconSettings(){
        var settings = ($(this).data('linking-icon-type') === 'external') ? '.wpil-external-link-icon-settings': '.wpil-internal-link-icon-settings',
            visible = ($(this).val() !== 'never');

        // if the link icons are set to be added
        if(visible){
            // show the setting inputs
            $(settings).css({'display': 'table-row'});
        }else{
            // if it's set to 'never', hide the inputs
            $(settings).css({'display': 'none'});
        }
    }

    $(document).on('change', 'select[name="wpil_external_link_icon_size"], select[name="wpil_internal_link_icon_size"]', adjustSvgIconSize);
    function adjustSvgIconSize(){
        var icons = ($(this).data('linking-icon-type') === 'external') ? '.wpil-external-link-icon-container svg': '.wpil-internal-link-icon-container svg',
            size = parseInt($(this).val());

        if(size > 0){
            $(icons).css({'height': size, 'width': size});
        }else{
            $(icons).css({'height': 12, 'width': 12});
        }
    }

    $(document).on('input', 'input[name="wpil_external_link_icon_color"], input[name="wpil_internal_link_icon_color"]', adjustSvgIconColor);
    $(document).on('change', 'input[name="wpil_external_link_icon_color"], input[name="wpil_internal_link_icon_color"]', adjustSvgIconColor);
    function adjustSvgIconColor(){
        var icons = ($(this).data('linking-icon-type') === 'external') ? '.wpil-external-link-icon-container svg': '.wpil-internal-link-icon-container svg',
            color = $(this).val();

        if(color){
            $(icons).css({'fill': color, 'stroke': color});
        }else{
            $(icons).css({'fill': '#000000', 'stroke': '#000000'});
        }
    }


    $(document).on('change', 'input[name="wpil_show_all_links"]', function(){
        var checkbox = $(this);
        wpil_swal({
            title: 'Notice:',
            text: 'After changing this setting, you are required to click "Run a Link Scan" reports on the links report page in order to see the correct link counts.',
            icon: 'info',
            buttons: ['Cancel', 'I Understand'],
        }).then((replace) => {
            if (!replace) {
                checkbox.prop('checked', !checkbox.prop('checked'));
            } else {
                $('#frmSaveSettings').submit();
            }
        });
    });

    $(document).on('change', 'input[name="wpil_content_formatting_level"]', function(){
        var level = $(this).val();
        $('.wpil-content-formatting-text').css({'display': 'none'});
        $('.wpil-content-formatting-text.wpil-format-'+level).css({'display': 'inline-block'});
    });

    $(document).on('change', 'input[name="wpil_delete_all_data"]', function(){
        var checkbox = $(this);

        // don't show the warning message if the user is turning off the data delete
        if(!checkbox.is(':checked')){
            return;
        }

        var wrapper = document.createElement('div');
        var message = $('.wpil-delete-all-data-message').val();
        $(wrapper).append(message);

        wpil_swal({
            title: 'Notice:',
            content: wrapper,
            icon: 'info',
            buttons: ['Cancel', 'I Understand'],
        }).then((replace) => {
            if (!replace) {
                checkbox.prop('checked', !checkbox.prop('checked'));
            } else {
                $('#frmSaveSettings').submit();
            }
        });
    });

    $(document).on('change', 'input[name="wpil_link_external_sites"]', toggleSiteLinkingDisplay);
    function toggleSiteLinkingDisplay(){
        var input = $('input[name="wpil_link_external_sites"]');

        // if the site linking is toggled on
        if(input.is(':checked')){
            // show the setting inputs
            $('.wpil-site-linking-setting-row').css({'display': 'table-row'});
        }else{
            // if it's toggled off, hide the inputs
            $('.wpil-site-linking-setting-row').css({'display': 'none'});
        }
    }

    // if no sites have been linked yet, add the first "link site" input
    if($('.wpil-linked-site-input').length < 2){
        addLinkedSiteInput();
    }
    
    $(document).on('click', '.wpil-linked-site-add-button', function(e){ e.preventDefault(); addLinkedSiteInput(); });

    function addLinkedSiteInput(){
        var newInput = $('.wpil-linked-site-input.template-input').clone().removeClass('template-input').removeClass('hidden');
        $(newInput).insertBefore('.wpil-linked-site-add-button-container');
    }

    $(document).on('click', '.wpil-register-site-button', registerSite);
    function registerSite(e){
        e.preventDefault();

        var button = $(this),
            parent = button.parent(),
            nonce = button.data('nonce'),
            url = button.parents('.wpil-linked-site-input').find('[name="wpil_linked_site_url[]"]').val(),
            urlRegex = /^(http|https):\/\/(([a-zA-Z0-9$\-_.+!*'(),;:&=]|%[0-9a-fA-F]{2})+@)?(((25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])(\.(25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])){3})|localhost|([a-zA-Z0-9\-\u00C0-\u017F]+\.)+([a-zA-Z]{2,}))(:[0-9]+)?(\/(([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*(\/([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*)*)?(\?([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?(\#([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?)?$/,
            code = $('[name="wpil_link_external_sites_access_code"]:visible').val();

        // if there's no url given
        if(url.length < 1){
            // ask the user to add one
            wpil_swal('No Site Url Given', 'The site url field is empty, please add the url of the site you want to link to.', 'error');
            return;
        }

        // if the site url isn't properly formatted
        if(!urlRegex.test(url)){
            // throw an error
            wpil_swal('Format Error', 'The given url was not in the necessary format. Please enter the url as it appears in your browser\'s address bar including the protocol (https or http).', 'error');
            return;
        }

        wpil_swal({
            title: 'Confirm Code',
            text: "Please confirm that the access code on \"" + url + "\" is: \n\n\n " + code + "\n\n\n If the codes don't match, please update them so they match.",
            icon: 'info',
            buttons: ['They Don\'t Match', 'They Match'],
        }).then((match) => {
            if (match) {
                jQuery.ajax({
                    type: 'POST',
                    url: ajaxurl,
                    data: {
                        action: 'wpil_register_selected_site',
                        url: url,
                        nonce: nonce,
                    },
                    success: function(response){
                        console.log(response);
                        // if there was an error
                        if(response.error){
                            // output the error message
                            wpil_swal(response.error.title, response.error.text, 'error');
                            // and exit
                            return;
                        }else if(response.info){
                            // output the success message
                            wpil_swal(response.info.title, response.info.text, 'info');
                            // replace the link button with the unlink button
                            button.remove();
                            parent.append(response.info.link_button);
                            // and exit
                            return;
                        }
                    }
                });
            }
        });
    }

    $(document).on('click', '.wpil-link-site-button', linkSite);
    function linkSite(e){
        e.preventDefault();

        var button = $(this),
            parent = button.parent(),
            nonce = button.data('nonce'),
            url = button.parents('.wpil-linked-site-input').find('[name="wpil_linked_site_url[]"]').val(),
            urlRegex = /^(http|https):\/\/(([a-zA-Z0-9$\-_.+!*'(),;:&=]|%[0-9a-fA-F]{2})+@)?(((25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])(\.(25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])){3})|localhost|([a-zA-Z0-9\-\u00C0-\u017F]+\.)+([a-zA-Z]{2,}))(:[0-9]+)?(\/(([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*(\/([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*)*)?(\?([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?(\#([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?)?$/;
            
        // if there's no url given
        if(url.length < 1){
            // ask the user to add one
            wpil_swal('No Site Url Given', 'The site url field is empty, please add the url of the site you want to link to.', 'error');
            return;
        }

        // if the site url isn't properly formatted
        if(!urlRegex.test(url)){
            // throw an error
            wpil_swal('Format Error', 'The given url was not in the necessary format. Please enter the url as it appears in your browser\'s address bar including the protocol (https or http).', 'error');
            return;
        }

        jQuery.ajax({
            type: 'POST',
            url: ajaxurl,
            data: {
                action: 'wpil_link_selected_site',
                url: url,
                nonce: nonce,
            },
            success: function(response){
                console.log(response);
                // if there was an error
                if(response.error){
                    // output the error message
                    wpil_swal(response.error.title, response.error.text, 'error');
                    // and exit
                    return;
                }else if(response.success){
                    // output the success message
                    wpil_swal(response.success.title, response.success.text, 'success');
                    // replace the link button with the unlink button
                    parent.find('a').remove();
                    parent.append(response.success.import_button);
                    parent.append(response.success.suggestions_button);
                    parent.append(response.success.unlink_button);
                    parent.append('<div class="progress_panel loader site-import-loader" style="display: none;"><div class="progress_count" style="width:100%">' + $('#wpil-site-linking-initial-loading-message').val() + '</div></div>');
                    // and exit
                    return;
                }else if(response.info){
                    // output the info message
                    wpil_swal(response.info.title, response.info.text, 'info');
                    // and exit
                    return;
                }
            }
        });
    }

    $(document).on('click', '.wpil-unlink-site-button', unlinkSite);
    function unlinkSite(e){
        e.preventDefault();

        var button = $(this),
            parent = button.parents('.wpil-linked-site-input'),
            nonce = button.data('nonce'),
            url = button.parents('.wpil-linked-site-input').find('[name="wpil_linked_site_url[]"]').val(),
            urlRegex = /^(http|https):\/\/(([a-zA-Z0-9$\-_.+!*'(),;:&=]|%[0-9a-fA-F]{2})+@)?(((25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])(\.(25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])){3})|localhost|([a-zA-Z0-9\-\u00C0-\u017F]+\.)+([a-zA-Z]{2,}))(:[0-9]+)?(\/(([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*(\/([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*)*)?(\?([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?(\#([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?)?$/;
            
        // if there's no url given
        if(url.length < 1){
            // ask the user to add one
            wpil_swal('No Site Url', 'The site url field is empty, please reload the page and try again.', 'error');
            return;
        }

        // if the site url isn't properly formatted
        if(!urlRegex.test(url)){
            // throw an error
            wpil_swal('Format Error', 'The given url was not in the necessary format. Please reload the page and try again.', 'error');
            return;
        }

        // give the active class to the remove button
        button.addClass('wpil_button_is_active_purple');

        jQuery.ajax({
            type: 'POST',
            url: ajaxurl,
            data: {
                action: 'wpil_remove_linked_site',
                url: url,
                nonce: nonce,
            },
            success: function(response){
                console.log(response);
                // if there was an error
                if(response.error){
                    // output the error message
                    wpil_swal(response.error.title, response.error.text, 'error');
                    // remove the active class
                    button.removeClass('wpil_button_is_active_purple');
                    // and exit
                    return;
                }else if(response.success){
                    // output the success message
                    wpil_swal(response.success.title, response.success.text, 'success');
                    // replace the link button with the unlink button
                    parent.fadeOut(300, function(){ parent.remove(); });
                    // and exit
                    return;
                }else if(response.info){
                    // output the success message
                    wpil_swal(response.info.title, response.info.text, 'info');
                    // and exit
                    return;
                }
            }
        });
    }

    $(document).on('click', '.wpil-unregister-site-button', unregisterSite);
    function unregisterSite(e){
        e.preventDefault();

        var button = $(this),
            parent = button.parents('.wpil-linked-site-input'),
            nonce = button.data('nonce'),
            url = button.parents('.wpil-linked-site-input').find('[name="wpil_linked_site_url[]"]').val(),
            urlRegex = /^(http|https):\/\/(([a-zA-Z0-9$\-_.+!*'(),;:&=]|%[0-9a-fA-F]{2})+@)?(((25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])(\.(25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])){3})|localhost|([a-zA-Z0-9\-\u00C0-\u017F]+\.)+([a-zA-Z]{2,}))(:[0-9]+)?(\/(([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*(\/([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*)*)?(\?([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?(\#([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?)?$/;
            
        // if there's no url given
        if(url.length < 1){
            // ask the user to add one
            wpil_swal('No Site Url', 'The site url field is empty, please reload the page and try again.', 'error');
            return;
        }

        // if the site url isn't properly formatted
        if(!urlRegex.test(url)){
            // throw an error
            wpil_swal('Format Error', 'The given url was not in the necessary format. Please reload the page and try again.', 'error');
            return;
        }

        // give the active class to the remove button
        button.addClass('wpil_button_is_active_purple');

        jQuery.ajax({
            type: 'POST',
            url: ajaxurl,
            data: {
                action: 'wpil_remove_registered_site',
                url: url,
                nonce: nonce,
            },
            success: function(response){
                console.log(response);
                // if there was an error
                if(response.error){
                    // output the error message
                    wpil_swal(response.error.title, response.error.text, 'error');
                    // remove the active class
                    button.removeClass('wpil_button_is_active_purple');
                    // and exit
                    return;
                }else if(response.success){
                    // output the success message
                    wpil_swal(response.success.title, response.success.text, 'success');
                    // replace the link button with the unlink button
                    parent.fadeOut(300, function(){ parent.remove(); });
                    // and exit
                    return;
                }else if(response.info){
                    // output the success message
                    wpil_swal(response.info.title, response.info.text, 'info');
                    // and exit
                    return;
                }
            }
        });
    }

    $(document).on('click', '.wpil-refresh-post-data', function(e){
        e.preventDefault(); 
        var button = $(this),
        url = button.parents('.wpil-linked-site-input').find('[name="wpil_linked_site_url[]"]').val(),
        urlRegex = /^(http|https):\/\/(([a-zA-Z0-9$\-_.+!*'(),;:&=]|%[0-9a-fA-F]{2})+@)?(((25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])(\.(25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])){3})|localhost|([a-zA-Z0-9\-\u00C0-\u017F]+\.)+([a-zA-Z]{2,}))(:[0-9]+)?(\/(([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*(\/([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*)*)?(\?([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?(\#([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?)?$/;

        // if there's no url given
        if(url.length < 1){
            // ask the user to add one
            wpil_swal('No Site Url', 'The site url field is empty, please reload the page and try again.', 'error');
            return;
        }

        // if the site url isn't properly formatted
        if(!urlRegex.test(url)){
            // throw an error
            wpil_swal('Format Error', 'The given url was not in the necessary format. Please reload the page and try again.', 'error');
            return;
        }

        refreshPostData(url, 0, 0, 0, button, 1); 
    });

    function refreshPostData(url, page, saved, total, button, reset = 0){

        var parent = button.parent(),
        loadingBar = parent.find('.site-import-loader'),
        nonce = button.data('nonce');

        // hide the current site's buttons
        parent.find('.site-linking-button').css({'display': 'none'});
        // show the loading bar
        loadingBar.css({'display': 'inline-block'});

        jQuery.ajax({
            type: 'POST',
            url: ajaxurl,
            data: {
                action: 'wpil_refresh_site_data',
                url: url,
                nonce: nonce,
                page: page,
                saved: saved,
                total: total,
                reset: reset
            },
            success: function(response){
                console.log(response);
                // if there was an error
                if(response.error){
                    // output the error message
                    wpil_swal(response.error.title, response.error.text, 'error');
                    // unhide the current site's buttons
                    parent.find('.site-linking-button').css({'display': 'inline-block'});
                    // hide the loading bar
                    loadingBar.css({'display': 'none'});
                    // and reset the status message
                    loadingBar.find('.progress_count').html($('#wpil-site-linking-initial-loading-message').val());
                    // and exit
                    return;
                }else if(response.success){
                    // output the success message
                    wpil_swal(response.success.title, response.success.text, 'success');
                    // unhide the current site's buttons
                    parent.find('.site-linking-button').css({'display': 'inline-block'});
                    // hide the loading bar
                    loadingBar.css({'display': 'none'});
                    // and reset the status message
                    loadingBar.find('.progress_count').html($('#wpil-site-linking-initial-loading-message').val());
                    // and exit
                    return;
                }else if(response){
                    // update the loading bar with the status
                    loadingBar.find('.progress_count').html(response.message);
                    // and go around again
                    refreshPostData(response.url, response.page, response.saved, response.total, button);
                    return;
                }
            },
        });
    }

    $(document).on('click', '.wpil-external-site-suggestions-toggle', function(e){
        e.preventDefault(); 
        var suggestionsEnabled = parseInt($(this).attr('data-suggestions-enabled'));
        var button = $(this);
        button.addClass('wpil_button_is_active');

        jQuery.ajax({
            type: 'POST',
            url: ajaxurl,
            data: {
                action: 'wpil_external_site_suggestion_toggle',
                url: button.data('site-url'),
                suggestions_enabled: suggestionsEnabled,
                nonce: $(this).data('nonce')
            },
            success: function(response){
                console.log(response);
                // if there was an error
                if(response.error){
                    // output the error message
                    wpil_swal(response.error.title, response.error.text, 'error');
                }else if(response.success){
                    // output the success message
                    wpil_swal(response.success.title, response.success.text, 'success');
                    // toggle the suggestion status
                    button.attr('data-suggestions-enabled', (suggestionsEnabled ? 0: 1));
                    // toggle the suggestion status text
                    button.html((!suggestionsEnabled ? $(button).data('disable-text'): $(button).data('enable-text')));
                }else if(response.info){
                    wpil_swal(response.info.title, response.info.text, 'info');
                }
            },
            complete: function(){
                button.removeClass('wpil_button_is_active');
            }
        });
    });

    $(document).on('click', '.wpil-generate-id-code', generateIdCode);
    function generateIdCode(e){
        e.preventDefault();
        var idCodeNum = $(this).data('wpil-id-code'),
            baseString = $(this).data('wpil-base-id-string'),
            code = shuffle(baseString).slice(0, 120),
            message = "The site interlinking access code has been generated successfully! \n\n Please copy this code and paste it into \"Site Interlinking Access Code\" inputs for all sites that you want to link together. \n\n\n " + code;
            console.log(code);
            wpil_swal('Access Code Generated!', message, 'info', {buttons: {'copy' : 'Copy Code'}}).then((value) => {
                if(value === 'copy'){
                    copyTextToClipboard(code);
                }
            });
    }

    function shuffle(string) {
        var a = string.split(""),
            n = a.length;
    
        for(var i = n - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = a[i];
            a[i] = a[j];
            a[j] = tmp;
        }
        return a.join("");
    }

    function fallbackCopyTextToClipboard(text) {
        var textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Fallback: Copying text command was ' + msg);
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
    }

    function copyTextToClipboard(text) {
        if (!navigator.clipboard) {
            fallbackCopyTextToClipboard(text);
            return;
        }
        navigator.clipboard.writeText(text).then(function() {
            console.log('Async: Copying to clipboard was successful!');
        }, function(err) {
            console.error('Async: Could not copy text: ', err);
        });
    }

    /** Show the settings for the current tab and hide the others **/
    $(document).on('click', '#settings_page .nav-tab-wrapper .nav-tab', function(e){
        e.preventDefault();

        // get the tab id
        var tabId = $(this).prop('id');

        // highlight the current tab
        $('#settings_page .nav-tab-wrapper .nav-tab').removeClass('nav-tab-active');
        $(this).addClass('nav-tab-active');

        // set the current tab in the form's selected tab input
        $('[name=wpil_setting_selected_tab]').val(tabId.substring(5));

        // show the correct tab's settings
        $('.wpil-setting-row').css({'display': 'none'});
        $('.' + tabId).css({'display': 'table-row'});

        // show the correct tab's settings
//        $('.wpil-setting-row').removeClass('show-setting');
//        $('.' + tabId).addClass('show-setting');

        toggleLicenseSaving(tabId);

        // make sure that options that need to be toggled on to be seen stay hidden if not toggled
        if(!$('input[type="checkbox"][name="wpil_link_external_sites"]').is(':checked')){
            $('.wpil-site-linking-setting-row').css({'display': 'none'});
        }
        if($('input[type="radio"][name="wpil_add_icon_to_external_link"]:checked').val() === 'never'){
            $('.wpil-external-link-icon-settings').css({'display': 'none'});
        }
        if($('input[type="radio"][name="wpil_add_icon_to_internal_link"]:checked').val() === 'never'){
            $('.wpil-internal-link-icon-settings').css({'display': 'none'});
        }

        // 
        if(tabId === 'wpil-domain-settings'){
            showForcejSLinkOpening();
            showDomainExceptionFields();
        }
    });
    
    /**
     * Enables license activating when the user is on the Licensing tab, 
     * and disables licensing activating when on the other settings tabs.
     * 
     * @param {string} tabId The id of the current setting tab.
     **/
    function toggleLicenseSaving(tabId){
        if(tabId === 'wpil-licensing-settings'){
            $('#wpil_license_action_input').removeAttr('disabled');
            $('.wpil-setting-button.save-settings').css({'display': 'none'});
            $('.wpil-setting-button.activate-license').css({'display': 'block'});
        }else{
            $('#wpil_license_action_input').prop('disabled', 'disabled');
            $('.wpil-setting-button.save-settings').css({'display': 'block'});
            $('.wpil-setting-button.activate-license').css({'display': 'none'});
        }
    }

    function showLicensingPageOnPageLoad(){
        var params = parseURLParams(window.location.href);

        if(params && params.licensing){
            $('#settings_page .nav-tab-wrapper #wpil-licensing-settings').trigger('click');
        }
    }
    showLicensingPageOnPageLoad();

    function showForcejSLinkOpening(){
        var int = $('[name=wpil_open_all_internal_new_tab]').is(':checked');
        var ext = $('[name=wpil_open_all_external_new_tab]').is(':checked');
        if(int || ext){
            $('.js-force-open-new-tabs').css({'display': 'table-row'});
        }else{
            $('.js-force-open-new-tabs').css({'display': 'none'});
        }
    }

    $(document).on('change', '[name=wpil_open_all_internal_new_tab],[name=wpil_open_all_external_new_tab]', showForcejSLinkOpening);

    function showDomainExceptionFields(){
        // get the set options
        var nofollow = $('[name=wpil_add_nofollow]').is(':checked');
        var openNew = $('[name=wpil_open_all_internal_new_tab]').is(':checked') || $('[name=wpil_open_all_external_new_tab]').is(':checked');
        var openSame = $('[name=wpil_open_all_internal_same_tab]').is(':checked') || $('[name=wpil_open_all_external_same_tab]').is(':checked');

        // list the field rows
        var nofollowExclude = $('#wpil_nofollow_ignore_domains').parents('tr');
        var openNewExclude = $('#wpil_new_tab_ignore_domains').parents('tr');
        var openSameExclude = $('#wpil_same_tab_ignore_domains').parents('tr');
        
        if(nofollow){
            nofollowExclude.css({'display': 'table-row'});
        }else{
            nofollowExclude.css({'display': 'none'});
        }
        
        if(openNew){
            openNewExclude.css({'display': 'table-row'});
        }else{
            openNewExclude.css({'display': 'none'}); 
        }
        
        if(openSame){
            openSameExclude.css({'display': 'table-row'});
        }else{
            openSameExclude.css({'display': 'none'});
        }
    }

    $(document).on('change', 
    '[name=wpil_add_nofollow],\
    [name=wpil_open_all_internal_new_tab],\
    [name=wpil_open_all_external_new_tab],\
    [name=wpil_open_all_internal_same_tab],\
    [name=wpil_open_all_external_same_tab]',
    showDomainExceptionFields);

    function toggleOpenSameOpening(e){
        if(undefined === e.target || undefined === e.target.name){
            return;
        }
        var name = e.target.name;
        var checked = $(e.target).is(':checked');

        if(name === 'wpil_open_all_internal_new_tab' && checked){
            var int = $('[name=wpil_open_all_internal_same_tab]');

            if(int.is(':checked')){
                int.trigger('click');
            }
        }else if(name === 'wpil_open_all_external_new_tab' && checked){
            var ext = $('[name=wpil_open_all_external_same_tab]');

            if(ext.is(':checked')){
                ext.trigger('click');
            }
        }
    }

    $(document).on('change', '[name=wpil_limit_suggestions_to_post_types]', toggleSuggestionPostTypes);

    function toggleSuggestionPostTypes(e){
        if(undefined === e.target || undefined === e.target.name){
            return;
        }

        var suggestionPTs = $('.wpil-suggestion-post-type-limit-setting');

        if($(e.target).is(':checked')){
            suggestionPTs.removeClass('hide-setting');
        }else{
            suggestionPTs.removeClass('hide-setting').addClass('hide-setting');
        }
    }

    $(document).on('change', '[name=wpil_2_post_types\\\[\\\]]', toggleAvailableSuggestionPostTypes);

    function toggleAvailableSuggestionPostTypes(e){
        if(undefined === e.target || undefined === e.target.name){
            return;
        }

        var postType = $(e.target);
        var searchClass = '.wpil-suggestion-limit-type-' + postType.val();
        var suggestionPT = $(searchClass);
        var suggestionPTInput = $('input'+searchClass);

        if(postType.is(':checked')){
            suggestionPT.removeClass('hide-setting');
            suggestionPTInput.prop('checked', true);
        }else{
            suggestionPT.removeClass('hide-setting').addClass('hide-setting');
            suggestionPTInput.prop('checked', false);
        }

        if(postType.val() === 'wprm_recipe'){
            if(postType.is(':checked')){
                $('.wpil-wprm-content-field-setting').removeClass('hide-setting');
            }else{
                $('.wpil-wprm-content-field-setting').addClass('hide-setting');
            }
        }
    }

    $(document).on('change', '[name=wpil_open_all_internal_new_tab],[name=wpil_open_all_external_new_tab]', toggleOpenSameOpening);


    function toggleOpenNewOpening(e){
        if(undefined === e.target || undefined === e.target.name){
            return;
        }
        var name = e.target.name;
        var checked = $(e.target).is(':checked');

        if(name === 'wpil_open_all_internal_same_tab' && checked){
            var int = $('[name=wpil_open_all_internal_new_tab]');

            if(int.is(':checked')){
                int.trigger('click');
            }
        }else if(name === 'wpil_open_all_external_same_tab' && checked){
            var ext = $('[name=wpil_open_all_external_new_tab]');

            if(ext.is(':checked')){
                ext.trigger('click');
            }
        }
    }
    $(document).on('change', '[name=wpil_open_all_internal_same_tab],[name=wpil_open_all_external_same_tab]', toggleOpenNewOpening);

    function toggleImageURLScanning(e){
        if(undefined === e.target || undefined === e.target.name){
            return;
        }
        var name = e.target.name;
        var checked = $(e.target).is(':checked');

        if(name === 'wpil_ignore_image_urls' && checked){
            var opposite = $('[name=wpil_include_image_src]');

            if(opposite.is(':checked')){
                opposite.trigger('click');
            }
        }else if(name === 'wpil_include_image_src' && checked){
            var opposite = $('[name=wpil_ignore_image_urls]');

            if(opposite.is(':checked')){
                opposite.trigger('click');
            }
        }
    }
    $(document).on('change', '[name=wpil_ignore_image_urls],[name=wpil_include_image_src]', toggleImageURLScanning);

    $(document).on('change', 'input[name="wpil_disable_click_tracking_info_gathering"]', toggleDeleteUserDataDisplay);
    function toggleDeleteUserDataDisplay(){
        var input = $(this);
        var deleteDataInput = $('input[name="wpil_delete_stored_visitor_data"]');

        // if the site linking is toggled on
        if(input.is(':checked')){
            // show the setting input
            deleteDataInput.parents('tr').removeClass('hide-setting');
        }else{
            // if it's toggled off, hide the input
            deleteDataInput.parents('tr').addClass('hide-setting');
            // and make sure it's toggled off
            deleteDataInput.prop('checked', false);
        }
    }

    $(document).on('change', 'input[name="wpil_autotag_gsc_keywords"]', toggleAutoSelectKeywordDisplay);
    function toggleAutoSelectKeywordDisplay(){
        var input = $(this);
        var autoSelectBasis = $('select[name="wpil_autotag_gsc_keyword_basis"]');
        var autoSelectCount = $('select[name="wpil_autotag_gsc_keyword_count"]');

        // if the site linking is toggled on
        if(input.is(':checked')){
            // show the setting inputs
            autoSelectBasis.parents('tr').removeClass('hide-setting');
            autoSelectCount.parents('tr').removeClass('hide-setting');
        }else{
            // if it's toggled off, hide the inputs
            autoSelectBasis.parents('tr').addClass('hide-setting');
            autoSelectCount.parents('tr').addClass('hide-setting');
        }
    }

    $(document).on('change', 'select[name="wpil_get_partial_titles"]', togglePartialTitleInputDisplay);
    function togglePartialTitleInputDisplay(){
        var basis = $(this).val();
        var wordCountSetting = $('select[name="wpil_partial_title_word_count"]').parents('tr');
        var delimiterSetting = $('input[name="wpil_partial_title_split_char"]').parents('tr');

        if(basis === '1' || basis === '2'){
            wordCountSetting.removeClass('hide-setting');
            delimiterSetting.addClass('hide-setting');
        }else if(basis === '3' || basis === '4'){
            wordCountSetting.addClass('hide-setting');
            delimiterSetting.removeClass('hide-setting');
        }else{
            wordCountSetting.addClass('hide-setting');
            delimiterSetting.addClass('hide-setting');
        }
    }

    $(document).on('change', 'input[name="wpil_filter_staging_url"]', toggleStagingSiteURLFiltering);
    function toggleStagingSiteURLFiltering(){
        var input = $(this);
        var liveURL = $('input[name="wpil_live_site_url"]');
        var stagingURL = $('input[name="wpil_staging_site_url"]');

        // if the site linking is toggled on
        if(input.is(':checked')){
            // show the setting inputs
            liveURL.parents('tr').removeClass('hide-setting');
            stagingURL.parents('tr').removeClass('hide-setting');
        }else{
            // if it's toggled off, hide the inputs
            liveURL.parents('tr').addClass('hide-setting');
            stagingURL.parents('tr').addClass('hide-setting');
        }
    }

    /**
     * Helper function that parses urls to get their query vars.
     **/
	function parseURLParams(url) {
		var queryStart = url.indexOf("?") + 1,
			queryEnd   = url.indexOf("#") + 1 || url.length + 1,
			query = url.slice(queryStart, queryEnd - 1),
			pairs = query.replace(/\+/g, " ").split("&"),
			parms = {}, i, n, v, nv;
	
		if (query === url || query === "") return;
	
		for (i = 0; i < pairs.length; i++) {
			nv = pairs[i].split("=", 2);
			n = decodeURIComponent(nv[0]);
			v = decodeURIComponent(nv[1]);
	
			if (!parms.hasOwnProperty(n)) parms[n] = [];
			parms[n].push(nv.length === 2 ? v : null);
		}
		return parms;
	}

/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info
*
**/
var Base64 = {

    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="

    // public method for encoding
    , encode: function (input)
    {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length)
        {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2))
            {
                enc3 = enc4 = 64;
            }
            else if (isNaN(chr3))
            {
                enc4 = 64;
            }

            output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
        } // Whend 

        return output;
    } // End Function encode 


    // public method for decoding
    ,decode: function (input)
    {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length)
        {
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64)
            {
                output = output + String.fromCharCode(chr2);
            }

            if (enc4 != 64)
            {
                output = output + String.fromCharCode(chr3);
            }

        } // Whend 

        output = Base64._utf8_decode(output);

        return output;
    } // End Function decode 


    // private method for UTF-8 encoding
    ,_utf8_encode: function (string)
    {
        var utftext = "";
        string = string.replace(/\r\n/g, "\n");

        for (var n = 0; n < string.length; n++)
        {
            var c = string.charCodeAt(n);

            if (c < 128)
            {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048))
            {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else
            {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        } // Next n 

        return utftext;
    } // End Function _utf8_encode 

    // private method for UTF-8 decoding
    ,_utf8_decode: function (utftext)
    {
        var string = "";
        var i = 0;
        var c, c1, c2, c3;
        c = c1 = c2 = 0;

        while (i < utftext.length)
        {
            c = utftext.charCodeAt(i);

            if (c < 128)
            {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224))
            {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else
            {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        } // Whend 

        return string;
    } // End Function _utf8_decode 

}

})(jQuery);
