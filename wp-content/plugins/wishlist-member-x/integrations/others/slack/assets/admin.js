$(function() {
	$('body').off('.wlm-slack');
	$('body').on('click.wlm-slack', '.toggle-slack-active', function() {
		var state = $(this).hasClass('slack-inactive');
		var level_id = $(this).data('level');

		var checkbox = '[name="slack_settings[' + $(this).data('trigger') + '][active][' + level_id + ']"]';
		$(checkbox).prop('checked', state).trigger('change');

		$(this).find('.wlm-icons').text('update');

		// trigger save by clicking button
		$('#slack-lists-modal-' + level_id + ' .modal-footer button.btn.-primary').click();
	});
	$('body').on('click.wlm-slack', '.slack-test-webhook', function () {
		var $btn = $(this);
		$btn.prop('disabled', true).addClass('-disabled').removeClass('-default');
		$.post(
			WLM3VARS.ajaxurl,
			{
				action: 'wlm3_slack_test_webhook',
				trigger: $btn.data('trigger'),
				level: $btn.data('level'),
			},
			function(result) {
				$btn.prop('disabled', false).removeClass('-disabled').addClass('-default');
				if(result.success) {
					toaster = {message: wp.i18n.__( 'Test data sent', 'wishlist-member' )};
				} else {
					toaster = {message: wp.i18n.__( 'Test failed', 'wishlist-member' ), type:'warning'}
				}
				$('.wlm-message-holder').show_message(toaster);
			},
			'json'
		);
	});
	$('.custom-webhook-toggle :checkbox').trigger('change');
});

integration_modal_save['slack'] = function(me, settings_data, result, text_status) {
	// update active status in table
	reload_slack_lists();
}