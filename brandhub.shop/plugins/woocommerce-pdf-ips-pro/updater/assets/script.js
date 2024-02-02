jQuery( function( $ ) {
	$( '.wpo-license-registration-toggle').on('click', function( event ) {
		let $row = $(this).closest('tr');
		let $updater_row = $( '.wpo-license-row-' + $(this).data('plugin_slug') );
		let $update_helper = $updater_row.find('.wpo-update-helper');
		if ($update_helper.length) {
			if ($updater_row.has('.wpo-license-key').length && $updater_row.is(":visible")) {
				$updater_row.css('display',''); // see comment below before $updater_row.show(); 
				$updater_row.hide();
				return;
			} else {
				if ($updater_row.has('.wpo-license-key').length === 0 ) {
					$(this).addClass('wpo-spinner');
				}
				$updater_row.attr('style','display:'+$row.css('display')+' !important;'); // fixes other plugins overriding the visibility of the row with !important rules
				$updater_row.show();
			}
		} else {
			return;
		}
		let plugin_license_slug = $(this).data('plugin_license_slug');
		let edd_action = $(this).data('edd_action');
		wpo_update_helper_action( edd_action, plugin_license_slug, $update_helper );
	});

	$( '.wpo-update-helper' ).on( 'click', '.activate, .deactivate', function( event ) {
		$parent = $(this).closest('.wpo-update-helper');
		var plugin_license_slug = $parent.data('plugin_license_slug');
		var edd_action = $(this).data('edd_action');
		wpo_update_helper_action( edd_action, plugin_license_slug, $parent );
	});


	function wpo_update_helper_action( edd_action, plugin_license_slug, $parent ) {
		var license_key = $parent.find( 'input.wpo-license-key' ).val();
		$parent.find( '.license-data' ).addClass('ajax-waiting');
		$parent.find( '.license-state' ).addClass('wpo-spinner');

		var data = {
			security:          wpo_update_helper.nonce,
			action:            "wpo_updater_licence_key_action_"+plugin_license_slug,
			license_key:       license_key,
			remote_edd_action: edd_action,
		};
		xhr = $.ajax({
			type:       'POST',
			url:        wpo_update_helper.ajaxurl,
			data:       data,
			dataType:   "json", 
			context:    $parent,
			success:    function( response ) {
				$(this).find('.license-data').replaceWith( response.html );
				$row = $(this).closest('tr');
				$plugin_row = $('.wpo-license-registration-toggle[data-plugin_license_slug="' + plugin_license_slug + '"').closest('tr');
				$row.attr('style','display:'+$plugin_row.css('display')+' !important;'); // see comment above
				$row.show();
				$plugin_row.find('.wpo-license-registration-toggle').removeClass('wpo-spinner');
			}
		});
	}
});