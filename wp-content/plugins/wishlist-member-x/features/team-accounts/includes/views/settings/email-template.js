$(
	function() {
		$( 'body' ).off( '.wlm-team-accounts' );

		$( 'body' ).on(
			'shown.bs.modal.wlm-team-accounts',
			'#email-notification-team-invite',
			function() {
				// reset email message do_confirm
				$( '.btn.team-invite-email-reset-button' ).do_confirm(
					{
						confirm_message : wp.i18n.__( 'Are you sure?', 'wishlist-member' ),
						yes_button : wp.i18n.__( 'Yes', 'wishlist-member' ),
						placement: 'right'
					}
				).on(
					'yes.do_confirm',
					function(e) {
						var t   = $( '#' + $( e.target ).data( 'target' ) )[0];
						t.value = tinymce.get( t.id ).setContent( $( '<textarea/>' ).html( t.dataset.defaultMessage ).text() );
						$( t ).closest( '.modal' ).find( '.save-button:not(.-close)' ).click();
					}
				);
			}
		);
	}
);
