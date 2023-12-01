$(function() {
	$('body').off('.wlm-evidence');
	$('body').on('click.wlm-evidence', '.toggle-evidence-active', function() {
		var state = $(this).hasClass('evidence-inactive');
		var level_id = $(this).data('level');

		var checkbox = '[name="evidence_settings[active][' + level_id + ']"]';
		$(checkbox).prop('checked', state);

		$(this).find('.wlm-icons').text('update');

		// trigger save by clicking button
		$('#evidence-lists-modal-' + level_id + ' .modal-footer button.btn.-primary').click();
	});
	$('body').on('click.wlm-evidence', '.evidence-test-webhook', function () {
		var $btn = $(this);
		$btn.prop('disabled', true).addClass('-disabled').removeClass('-default');
		$.post(
			WLM3VARS.ajaxurl,
			{
				action: 'wlm3_evidence_test_webhook',
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

integration_modal_save['evidence'] = function(me, settings_data, result, text_status) {
	// update active status in table
	$.each(WLM3ThirdPartyIntegration.evidence.evidence_settings.active, function(level_id, status) {
		var target = '#evidence-' + level_id + ' .toggle-evidence-active';
		$(target).find('.wlm-icons').text('check_circle');
		$(target).toggleClass('evidence-inactive', status == 0)
	});
}