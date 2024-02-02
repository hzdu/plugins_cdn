"use strict";

(function ($) {
    $(document).on('click', '.wpil-domains-report-url-edit-confirm', wpil_domains_link_update);
    $(document).on('click', '.report_links .wpil_edit_link, .wpil-domains-report-url-edit-cancel', toggleReportLinkEditor);
    $(document).on('click', '.wpil-domain-attribute-save', saveSelectedAttributes);
    $(document).on('click', 'td .wpil-collapsible-wrapper', maybeAjaxDownloadData);
    $('.wpil-domain-attribute-multiselect').select2();
    $('select').on('change', checkDomainAttributes);

    // edit link in domains report
    function wpil_domains_link_update() {
        var urlRow = $(this).parents('.wpil-domains-report-url-edit-wrapper');
        var el = $(this);
        var data = {
            action: 'edit_report_link',
            url: el.data('url'),
            new_url: urlRow.find('.wpil-domains-report-url-edit').val(),
            anchor: el.data('anchor'),
            post_id: el.data('post_id'),
            post_type: el.data('post_type'),
            link_id: typeof el.data('link_id') !== 'undefined' ? el.data('link_id') : '',
            status: 'domains',
            nonce: el.data('nonce')
        };

        // make the call to update the link
        jQuery.ajax({
            type: 'POST',
            url: ajaxurl,
            data: data,
            success: function(response){
                console.log(response);
                // if there was an error
                if(response.error){
                    // output the error message
                    wpil_swal(response.error.title, response.error.text, 'error');
                }else if(response.success){
                    // if it was successful, output the succcess message
                    wpil_swal(response.success.title, response.success.text, 'success').then(function(){
                        // and remove the link from the table when the user closes the popup
                        el.closest('li').fadeOut(300);
                    });
                }
            }
        });
    }

    // toggle display of the link editor
    function toggleReportLinkEditor(e){
        e.preventDefault();
        var urlRow = $(this).parents('li');

        if(urlRow.hasClass('editing-active')){
            urlRow.removeClass('editing-active');
            urlRow.find('.wpil-domains-report-url').css({'display': 'block'});
            urlRow.find('.wpil-domains-report-url-edit-wrapper').css({'display': 'none'});
            urlRow.find('.row-actions').css({'display': 'block'});
            urlRow.find('.wpil_edit_link').css({'display': 'block'});
        }else{
            urlRow.addClass('editing-active');
            urlRow.find('.wpil-domains-report-url').css({'display': 'none'});
            urlRow.find('.wpil-domains-report-url-edit-wrapper').css({'display': 'inline-block'});
            urlRow.find('.row-actions').css({'display': 'none'});
            urlRow.find('.wpil_edit_link').css({'display': 'none'});
        }
    }

    /**
     * Checks to see if the user has changed the domain attributes, and enables the "save" button if they are
     **/
    function checkDomainAttributes(e){
        if(undefined === e){
            return;
        }

        var select = $(e.target);
        var button = select.parent().find('.wpil-domain-attribute-save');

        var selectedAtts = select.val();
        var storedAtts = button.data('saved-attrs');

        // if there's a different number of atts
        if(selectedAtts.length !== storedAtts.length){
            // enable the button
            button.removeClass('button-disabled');
        }else{
            // compare the atts and see if there's a difference
            var same = true;
            for(var i in selectedAtts){
                if(-1 === storedAtts.indexOf(selectedAtts[i])){
                    same = false;
                }
            }

            if(same){
                button.removeClass('button-disabled').addClass('button-disabled');
            }else{
                button.removeClass('button-disabled');
            }
        }

        // update the available atts so there aren't conflicts
        select.find('option:not(:selected)').each(function(ind, element){
            var $el = $(element);
            var hasConflict = checkForAttrConflicts($el.val(), selectedAtts);
            var disabled = $el.is(':disabled');
            if(hasConflict && !disabled){
                $el.prop('disabled', true);
            }else if(!hasConflict && disabled){
                $el.prop('disabled', false);
            }

            console.log([hasConflict, disabled, $el.val()]);
        });
    }

    function checkForAttrConflicts(attr = '', attrs = []){
        if(!attr || !attrs){
            return false;
        }

        var conflicts = false;
        switch (attr) {
            case '_blank':
                if(-1 !== attrs.indexOf('no_blank')){
                    conflicts = true;
                }
            break;
            case 'no_blank':
                if(-1 !== attrs.indexOf('_blank')){
                    conflicts = true;
                }
            break;
            case 'nofollow':
                if(-1 !== attrs.indexOf('dofollow')){
                    conflicts = true;
                }
            break;
            case 'dofollow':
                if(-1 !== attrs.indexOf('nofollow')){
                    conflicts = true;
                }
            break;
            case 'sponsored':
                // no problems with sponsored
            break;
        }

        return conflicts;
    }

    /**
     * 
     **/
    function saveSelectedAttributes(){
        var button = $(this);
        
        if(button.hasClass('button-disabled') || button.hasClass('wpil_button_is_active')){
            return;
        }

        // start the loading animation
        button.addClass('wpil_button_is_active');

        var multiselect = button.parent().find('.wpil-domain-attribute-multiselect');
        var attrs = multiselect.val();

        $.ajax({
			type: 'POST',
			url: ajaxurl,
			data: {
				action: 'wpil_save_domain_attributes',
                nonce: button.data('nonce'),
				domain: button.data('domain'),
                attrs: attrs
			},
			success: function(response){
				console.log(response);
                // stop the button animation
                button.removeClass('wpil_button_is_active');

                // if there was an error
                if(response.error){
                    // output the error message
                    wpil_swal(response.error.title, response.error.text, 'error');
                    // and exit
                    return;
                }

                // if there was a notice
                if(response.info){
                    // output the notice message
                    wpil_swal(response.info.title, response.info.text, 'info');
                    // update the buttons
                    if(undefined !== response.info.data){
                        button.data('saved-attrs', response.info.data);
                        multiselect.val(response.info.data).trigger('change');
                    }
                    // and exit
                    return;
                }

                // 
                if(response.success){
                    // output the notice message
                    wpil_swal(response.success.title, response.success.text, 'success');
                    // update the buttons
                    if(undefined !== response.success.data){
                        button.data('saved-attrs', response.success.data);
                        multiselect.val(response.success.data).trigger('change');
                    }
                    // and exit
                    return;
                }
			},
            error: function(jqXHR, textStatus, errorThrown){
                console.log({jqXHR, textStatus, errorThrown});
                button.removeClass('wpil_button_is_active');
            }
		});
    }

    /**
     * Checks to see if the clicked dropdown has all of its data.
     * If the dropdown doesn't, this downloads the remaining data and adds it to the dropdown
     **/
    var globalDownloadTracker = [];
    function maybeAjaxDownloadData(e){
        var wrap = $(e.target).parents('td').find('.wpil-collapsible-wrapper'),
            count = parseInt(wrap.find('.wpil-collapsible').text()),
            current = wrap.find('.report_links li').length,
            type = (wrap.parents('.column-links').length > 0) ? 'links': 'posts',
            host = wrap.data('wpil-collapsible-host'),
            search = $('#report_domains #search-search-input').val(),
            searchType = $('[name="domain_search_type"]:checked').val(),
            processId = type + '_' + host;

        // first check if there's all the data
        if(count <= current){
            // if there is, exit
            return;
        }

        // also make sure there isn't a download for the data already running
        if(undefined !== this && -1 !== globalDownloadTracker.indexOf(processId)){
            // if there is, exit
            return;
        }

        if(-1 === globalDownloadTracker.indexOf(processId)){
            globalDownloadTracker.push(processId);
        }

        // start calling for the remaining links
        $.ajax({
			type: 'POST',
			url: ajaxurl,
			data: {
				action: 'get_domain_dropdown_data',
                dropdown_type: type,
                host: wrap.data('wpil-collapsible-host'),
                nonce: wrap.data('wpil-collapsible-nonce'),
                item_count: current,
                search: search,
                search_type: searchType
			},
			success: function(response){
                // if there was an error
                if(response.error){
                    // output the error message
                    wpil_swal(response.error.title, response.error.text, 'error');
                    // and exit
                    return;
                }

                // if there was a notice
                if(response.info){
                    // output the notice message
                    wpil_swal(response.info.title, response.info.text, 'info');
                    // and exit
                    return;
                }

                // 
                if(response.success){
                    // 
                    if(undefined !== response.success.item_data && '' !== response.success.item_data){
                        wrap.find('.report_links').append(response.success.item_data);
                    }

                    if(undefined !== response.success.item_count && response.success.item_count > 0){
                        // go for another trip!
                        maybeAjaxDownloadData(e);
                    }
                    // and exit
                    return;
                }
			},
            error: function(jqXHR, textStatus, errorThrown){
                console.log({jqXHR, textStatus, errorThrown});
                button.removeClass('wpil_button_is_active');
            }
		});
    }



})(jQuery);
