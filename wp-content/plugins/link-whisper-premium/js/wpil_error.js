"use strict";

(function ($) {
    $(document).on('change', '#wpil_check_all_errors', wpil_check_all_errors);
    $(document).on('change', '#report_error table input[type="checkbox"]', wpil_error_delete_button_update);
    $(document).on('click', '#wpil_error_delete_selected', wpil_delete_error_links);
    $(document).on('click', '#wpil_error_filter', wpil_error_codes_update);
    $(document).on('click', '#check_all_codes', wpil_toggle_available_codes);
    $(document).on('click', '#error_table_code_filter .item:first-of-type', wpil_error_codes_toggle);
    $(document).on('click', '.wpil-error-report-url-edit-confirm', wpil_error_link_update);
    $(document).on('click', '.column-url .row-actions .wpil_edit_link, .wpil-error-report-url-edit-cancel', toggleReportLinkEditor);
    $(document).on('submit', '#wpil_error_reset_data_form', wpil_error_reset_data);

    $(document).click(function(e){
        if (!$(e.target).hasClass('.codes') && !$(e.target).parents('.codes').length) {
            $('#error_table_code_filter .codes').height(30);
            $(this).find('.dashicons-arrow-up').hide();
            $(this).find('.dashicons-arrow-down').show();
        }
    });

    function wpil_check_all_errors() {
        var checked = false;

        if ($(this).prop('checked')) {
            checked = true;
        }

        $('#report_error table input[type="checkbox"]').each(function(){
            $(this).prop('checked', checked);
        });
    }

    function wpil_error_delete_button_update() {
        if ($('#report_error table input[type="checkbox"]:checked').length) {
            $('#wpil_error_delete_selected').removeClass('button-disabled');
        } else {
            $('#wpil_error_delete_selected').addClass('button-disabled');
        }
    }

    function wpil_delete_error_links() {
        if($(this).hasClass('button-disabled')){
            return;
        }

        if (confirm("Are you sure you want to delete the selected links?")) {
            var links = [];

            $('#report_error table input[type="checkbox"]:checked').each(function () {
                if (parseInt($(this).data('id')) > 0) {
                    links.push($(this).data('id'));
                }
            });

            $.ajax({
                type: 'POST',
                url: ajaxurl,
                data: {links: links, action: 'wpil_delete_error_links'},
                success: function (response) {
                    if (response.error) {
                        wpil_swal(response.error.title, response.error.text, 'error');
                    } else if (response.success) {
                        location.reload();
                    }
                }
            });
        }
    }

    function wpil_error_codes_update() {
        var codes = [];
        $('#error_table_code_filter input[type="checkbox"]:not(.check_all)').each(function(){
            if ($(this).prop('checked')) {
                codes.push($(this).data('code'));
            }
        });

        var post = '';
        var currentPost = parseInt($('#error_table_code_filter input[type="hidden"].current-post').val());
        if(currentPost){
            post = '&post_id=' + currentPost;
        }

        document.location.href = 'admin.php?page=link_whisper&type=error&codes='+codes.join(',')+post;
    }

    function wpil_toggle_available_codes(){
        var checked = $('#error_table_code_filter input.check_all').is(':checked');
        $('#error_table_code_filter input[type="checkbox"]:not(.check_all)').each(function(){
            if(checked){
                $(this).prop('checked', true);
            }else{
                $(this).prop('checked', false);
            }
        });
    }

    function wpil_error_codes_toggle() {
        var block = $('#error_table_code_filter .codes');
        if ($(this).hasClass('closed')) {
            $(this).find('.dashicons-arrow-down').hide();
            $(this).find('.dashicons-arrow-up').css('display', 'inline-block');
            block.css('height', 'auto');
            $(this).removeClass('closed');
            $(this).addClass('open');
        } else {
            $(this).find('.dashicons-arrow-up').hide();
            $(this).find('.dashicons-arrow-down').show();
            block.css('height', 30);
            $(this).removeClass('open');
            $(this).addClass('closed');
        }
    }

    // edit link in error report
    function wpil_error_link_update() {
        var urlRow = $(this).parents('.column-url');
        var el = $(urlRow).find('.wpil_edit_link');
        var data = {
            action: 'edit_report_link',
            url: el.data('url'),
            new_url: urlRow.find('.wpil-error-report-url-edit').val(),
            anchor: el.data('anchor'),
            post_id: el.data('post_id'),
            post_type: el.data('post_type'),
            link_id: typeof el.data('link_id') !== 'undefined' ? el.data('link_id') : '',
            status: 'error_report',
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
                        if (el.hasClass('wpil_edit_link')) {
                            el.closest('tr').fadeOut(300);
                        } else {
                            el.closest('li').fadeOut(300);
                        }
                    });
                }
            }
        });
    }

    // toggle display of the link editor
    function toggleReportLinkEditor(){
        var urlRow = $(this).parents('.column-url');

        if(urlRow.hasClass('editing-active')){
            urlRow.removeClass('editing-active');
            urlRow.find('.wpil-error-report-url').css({'display': 'block'});
            urlRow.find('.wpil-error-report-url-edit-wrapper').css({'display': 'none'});
            urlRow.find('.row-actions').css({'display': 'block'});
        }else{
            urlRow.addClass('editing-active');
            urlRow.find('.wpil-error-report-url').css({'display': 'none'});
            urlRow.find('.wpil-error-report-url-edit-wrapper').css({'display': 'inline-block'});
            urlRow.find('.row-actions').css({'display': 'none'});
        }
    }

    //send request to proceed broken links search
    var globalErrorCount = 0;
    function wpil_error_process()
    {
        jQuery.ajax({
			type: 'POST',
			url: ajaxurl,
			data: {
				action: 'wpil_error_process',
			},
            error: function (jqXHR, textStatus) {
                globalErrorCount++;

                if(globalErrorCount < 10){
                    wpil_error_process();
                    return;
                }

				var wrapper = document.createElement('div');
				$(wrapper).append('<strong>' + textStatus + '</strong><br>');
				$(wrapper).append(jqXHR.responseText);
				wpil_swal({"title": "Error", "content": wrapper, "icon": "error"}).then(wpil_report_next_step());
			},
			success: function(response){
                // if there was an error
                if(response.error){
                    wpil_swal(response.error.title, response.error.text, 'error');
                    return;
                }

                // if there was no error, reset the error counter
                globalErrorCount = 0;

                $('.progress_count:first').css('width', response.percents + '%');
                $('.wpil-loading-status:first').text(response.status);
    
                if(response.finish){
                    wpil_swal('Success!', 'Synchronization has been completed.', 'success').then(function(){
                        location.reload();
                    });
                }else{
                    wpil_error_process();
                }
            }
		});
    }

    //send request to reset data about broken links
    function wpil_error_reset_data(e){
        e.preventDefault();
        var nonce = $(this).find('input[name="nonce"]').val();

        $(this).attr('disabled', true);
        $(this).find('button.button-primary').addClass('wpil_button_is_active');

        $.post(ajaxurl, {
            action: 'wpil_error_reset_data',
            nonce: nonce
        }, function(response){
            if (typeof response.error != 'undefined') {
                wpil_swal(response.error.title, response.error.text, 'error');
                return;
            } else if (typeof response.template != 'undefined') {
                $('#wpbody-content').html(response.template);
                wpil_error_process();
            }
        }, 'json');
    }

    //show progress bar and send search request if user interrupted the search
    if (typeof error_reset_run != 'undefined' && error_reset_run) {
        $.post(ajaxurl, {
            action: 'wpil_error_process',
            get_status: 1
        }, function(response){
            console.log(response);
            $('.progress_count:first').css('width', response.percents + '%');
            $('.wpil-loading-status:first').text(response.status);
            wpil_error_process();
        });
    }

    $(document).on('change', '#wpil_error_table_post_filter select', wpil_report_filter);
    $(document).on('click', '#wpil_error_table_post_filter .button-primary', wpil_report_filter_submit);

    function wpil_report_filter() {
        var block = $('#wpil_error_table_post_filter');

        var post_type = block.find('select[name="post_type"]').val();

        $('.wpil_filter_post_type:not(.' + post_type + ')').css({'display': 'none'});
        $('.wpil_filter_post_type.' + post_type).css({'display': 'block'});

        if($(this).attr('name') === 'post_type'){
            block.find('select[name="category"]').val(0);
        }
    }
    wpil_report_filter();

    function wpil_report_filter_submit() {
        var block = $(this).closest('div');
        var post_type = block.find('select[name="post_type"]').val();
        var category = block.find('select[name="category"]').val();
        var urlParams = parseURLParams(location.href);
        var codes = (urlParams.codes) ? 'codes=' + encodeURIComponent(urlParams.codes[0]) : '';
        var url = wpil_admin_url + 'admin.php?page=link_whisper&type=error&' + codes + '&post_type=' + post_type + '&category=' + category;

        location.href = url;
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

})(jQuery);
