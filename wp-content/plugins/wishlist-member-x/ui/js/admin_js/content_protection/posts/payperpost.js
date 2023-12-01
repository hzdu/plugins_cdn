// Pay Per Post Javascript
// Loaded via $.getScript(...) on content.js

$('body').off('.content-ppp');

// Toggle Search By
$('body').on('change.content-ppp.select2', '#wlm_user_search_by', function() {
	if($(this).val() == 'by_user') {
		$('#wlm_user_search_input').closest('.col-md-5').removeClass('d-none');
		$('#wlm_level_search_input').closest('.col-md-5').addClass('d-none');
	} else {
		$('#wlm_user_search_input').closest('.col-md-5').addClass('d-none');
		$('#wlm_level_search_input').closest('.col-md-5').removeClass('d-none');
	}
});

// Search Button
$('body').on('click.content-ppp', '#wlm3-ppp-search-button', function() {
	var $search_by = $('#wlm_user_search_by').val();
	var $search = $search_by == 'by_user' ? $('#wlm_user_search_input').val() : $('#wlm_level_search_input').val();

	var xdata = {
		action: 'wlm3_post_page_ppp_user_search',
		search: $search,
		ppp_access: $('#wlm_user_access').val(),
		ppp_id: $('[name="ppp_content_id"]').val(),
		page: $('#wlm3-pagination-page').val(),
		number: $('#wlm3-pagination-number').val(),
		search_by: $search_by,
	};

	$.post(
		WLM3VARS.ajaxurl,
		xdata,
		function(result) {
			var _html;
			var $tbody = $('#wlm_payperpost_table tbody');
			if(result.total_users && !result.users.length) {
				// reset pagination
				$('#wlm3-pagination-page').val('1');
				$('#wlm3-ppp-search-button').click();
				return;
			}
			if(result.users.length) {

				var toggle_markup = $('#toggle-markup').html();

				$tbody.empty();
				$.each(result.users, function(index, user) {
					var has_access = result.contentlevels.indexOf('U-' + user.ID) > -1;
					_html = '<tr class="' + (has_access ? 'wlm3-has-ppp' : '') + '" data-userid="_id_"><td>_id_</td><td><span title="_name_">_name_</span></td><td><span title="_login_">_login_</span></td><td><span title="_email_">_email_</span></td><td style="text-align:center">_toggle_markup_</td></tr>';
					_html = _html.replace(/_id_/g, user.ID);
					_html = _html.replace(/_name_/g, user.display_name);
					_html = _html.replace(/_login_/g, user.user_login);
					_html = _html.replace(/_email_/g, user.user_email);
					_html = _html.replace(/_toggle_markup_/g, toggle_markup);
					_html = _html.replace(/_toggle_name_/g, 'payperpost_toggle');
					_html = _html.replace(/_toggle_checked_/g, (has_access ? 'checked="checked"' : ''));
					$tbody.append(_html);
				});

				hide = '';
				if(xdata.page < 2) hide = 'prev';
				if(xdata.page >= result.total_users / xdata.number) hide = 'next';
				if(result.total_users <= xdata.number) hide = 'both';

				$('a[href="#_wlm3-ppp-prev"], a[href="#_wlm3-ppp-next"]').show();
				if(hide) {
					if(hide == 'prev' || hide == 'both') {
						$('a[href="#_wlm3-ppp-prev"]').hide();
					}
					if(hide == 'next' || hide == 'both') {
						$('a[href="#_wlm3-ppp-next"]').hide();
					}
				}

				$('#wlm3-pagination-total').text(result.total_users);

				$('#wlm3-pagination-from').text( xdata.number * xdata.page - (xdata.number - 1) );
				var to = xdata.page * xdata.number;
				if( to > result.total_users ) to = result.total_users;
				$('#wlm3-pagination-to').text( to );

				$('#wlm3-pagination').show();

			} else {
				$('#wlm3-pagination').hide();
				$tbody.html('<tr><td colspan="5"><p class="text-center">' + wp.i18n.__( 'No results found', 'wishlist-member' ) + '</p></td></tr>');
			}
		}
	);
});


// Pay Per Post Toggle Switch
$('body').on('change', ':checkbox[name="payperpost_toggle"]', function() {
	var $row = $(this).closest('tr');
	var $btn = $(this);
	var _action = this.checked ? 'wlm3_add_user_ppp' : 'wlm3_remove_user_ppp';
	if(this.checked) {
		$row.addClass('wlm3-has-ppp');
	} else {
		$row.removeClass('wlm3-has-ppp');
	}
	$row.addClass('-is-saving');
	$btn.closest('.form-group').addClass('-is-saving');
	var $cid = $('[name="ppp_content_id"]').val();
	$.post(
		WLM3VARS.ajaxurl,
		{
			action: _action,
			user_id: $row.data('userid'),
			content_id: $cid,
		}
	).always(function(r) {
		var cnt = parseInt( $('.content-tr-' +$cid +' .ppp-user-count-holder').text() );
		cnt = _action == 'wlm3_add_user_ppp' ? cnt+1 : cnt-1;
		$('.content-tr-' +$cid +' .ppp-user-count-holder').text( cnt )
		$row.removeClass('-is-saving');
		$btn.closest('.form-group').removeClass('-is-saving');
	});
});

// Pagination Handlers
$('body').on('click.content-ppp', '#wlm3-pagination a[href!="#"]', function() {
	var hash = $(this).attr('href').substring(2);
	var page = Math.abs($('#wlm3-pagination-page').val());
	switch(hash) {
		case 'wlm3-ppp-prev':
			page--;
			$('#wlm3-pagination-page').val(page);
			$('#wlm3-ppp-search-button').click();
		break;
		case 'wlm3-ppp-next':
			page++;
			$('#wlm3-pagination-page').val(page);
			$('#wlm3-ppp-search-button').click();
		break;
		case '':
		break;
		default:
			$('#wlm3-pagination-page').val('1');
			$('#wlm3-pagination-number').val(hash);
			$('#wlm3-ppp-search-button').click();
	}
	return false;
});