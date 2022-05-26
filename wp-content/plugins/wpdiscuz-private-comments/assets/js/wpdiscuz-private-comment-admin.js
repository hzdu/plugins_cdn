jQuery(document).ready(function($) {
	$(document).on('click', '.wc_private_btn', function(e) {
		var btn = $(this);
		$('.fas', btn).addClass('fa-pulse fa-spinner');
		var commentId = btn.data('comment');
		var status = $('.fas', btn).hasClass('fa-eye-slash') ? 'private' : 'public';
		$.ajax({
			type: 'POST',
			url: ajaxurl,
			data: {
				action: 'wpdPrivateCommentChangeStatus',
				html_id: 'wpdiscuz_private_comment_' + commentId,
				status: status
			},
		}).done(function(r) {
			if (typeof r === 'object') {
				$('.fas', btn).removeClass('fa-pulse fa-spinner');
				if (r.success) {
					$('.wc_private_text', btn).text(r.data.text);
					$('.fas', btn).removeClass(status === 'private' ? 'fa-eye-slash' : 'fa-eye');
					$('.fas', btn).addClass(status === 'private' ? 'fa-eye' : 'fa-eye-slash');
				} else {
					console.log('Comment not updated');
				}
			} else {
				console.log(r);
			}
		});
		e.preventDefault();
		return false;
	});
});