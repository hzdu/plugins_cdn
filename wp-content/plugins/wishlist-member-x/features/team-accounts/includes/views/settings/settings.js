$(
	function() {
		$( 'body' ).off( '.wlm-team-accounts' );

		$( 'body' ).on(
			'shown.bs.modal.wlm-team-accounts',
			'#team-accounts-admin-welcome',
			function() {
				// reset admin welcome message do_confirm
				$( '.btn.admin-welcome-reset-button' ).do_confirm(
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

		$( 'body' ).on(
			'shown.bs.modal.wlm-team-accounts',
			'#team-accounts-member-welcome',
			function() {
				// reset member welcome message do_confirm
				$( '.btn.member-welcome-reset-button' ).do_confirm(
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

		// save team management page.
		$( 'body' ).on(
			'click.wlm-team-accounts',
			'.btn.save-settings',
			function() {
				$.post(
					ajaxurl,
					{
						action: 'wishlistmember_team_accounts_save_settings',
						'team-accounts/team_management_page' : $( '[name="team-accounts/team_management_page"]' ).val(),
						[WLM3VARS.nonce_field]: WLM3VARS.nonce,
					},
					function() {
						$( '.wlm-message-holder' ).show_message( { type : 'success' } );
					}
				)
			}
		);

		// create team management page.
		$( 'body' ).on(
			'click.wlm-team-accounts',
			'.btn.create-page',
			function() {
				$.post(
					ajaxurl,
					{
						action: 'wishlistmember_team_accounts_create_page',
						title : $( '#create-page-title' ).val().trim() || wp.i18n.__( 'Team Management', 'wishlist-member' ),
						[WLM3VARS.nonce_field]: WLM3VARS.nonce,
					},
					function(r) {
						if ( ! r.success) {
							$( '.wlm-message-holder' ).show_message( { message: wp.i18n.__( 'Failed creating page', 'wishlist-member' ), type : 'error' } );
							return;
						}
						$( '[name="team-accounts/team_management_page"]' ).append( '<option value="' + r.data.id + '">' + r.data.title + '</option>' ).val( r.data.id );
						$( '#create-page' ).collapse( 'hide' );
						$( '.wlm-message-holder' ).show_message(
							{
									// Translators: %s: Page Title
								message: wp.i18n.__( 'Page %s created and set as Team Management Page.', 'wishlist-member' ).replace( '%s', r.data.title ),
								type : 'success'
							}
						);

					}
				)
			}
		);

		// clear create page title and focus on it when shown.
		$( 'body' ).on(
			'shown.bs.collapse.wlm-team-accounts',
			'#create-page',
			function() {
				$( '#create-page-title' ).val( '' ).focus();
			}
		);
	}
);
