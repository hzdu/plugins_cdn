$(function() {
	$('[name=reg_cookie_timeout]').apply_cancel()
	.on('apply.apply_cancel', function() {
		if(!parseInt($(this).val())) {
			$(this).val($(this).data('default'));
		}
		$(this).data('initial', $(this).val());
		$(this).closest('form').save_settings({
			on_done : function() {
				$('.wlm-message-holder').show_message();
			}
		});
	})
	.on('cancel.apply_cancel', function() {
		$(this).val($(this).data('initial'));
	});

	$('[name=FormVersion]').apply_cancel()
	.on('apply.apply_cancel', function() {
		var $field = $(this);
		$field.closest('form').save_settings({
			on_done : function() {
				$field.data('initial', $field.val());
				$('.wlm-message-holder').show_message();
			}
		});
	})
	.on('cancel.apply_cancel', function() {
		$(this).val($(this).data('initial'));
		$(this).apply_cancel('hide');
	});
	$('[name=FormVersion]').on('change', function() {
		if($(this).val() != $(this).data('initial')) {
			$(this).apply_cancel('show');
		} else {
			$(this).apply_cancel('hide');
		}
	});
});

