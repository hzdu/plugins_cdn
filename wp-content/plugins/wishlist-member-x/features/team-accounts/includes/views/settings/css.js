$(
	function() {
		const cm_editor = wp.CodeMirror.fromTextArea(
			document.getElementById( 'custom-css' ),
			{
				lineNumbers: true,
				mode: 'text/css',
				matchBrackets: true
			}
		);

		$( 'body' ).off( '.wlm-team-accounts' );

		$( 'body' ).on(
			'change.wlm-team-accounts',
			'[name="team-accounts/custom-css-enabled"]',
			function(e, init) {
				$( '.panel-footer' ).toggleClass( 'd-none', ! this.checked );
				cm_editor.refresh();
				if ( ! init) {
					const fg = $( this ).closest( '.form-group' );
					fg.addClass( '-is-saving' );
					$.post(
						ajaxurl,
						{
							action: 'wishlistmember_team_accounts_save_settings',
							[this.name] : +this.checked,
							[WLM3VARS.nonce_field]: WLM3VARS.nonce
						},
						function() {
							fg.removeClass( '-is-saving' );
						}
					)
				}
			}
		);
		$( '[name="team-accounts/custom-css-enabled"]' ).trigger( 'change', true );

		$( 'body' ).on(
			'click.wlm-team-accounts',
			'.btn.save-settings',
			function(e, reset) {
				cm_editor.save();
				$.post(
					ajaxurl,
					{
						action: 'wishlistmember_team_accounts_save_settings',
						'team-accounts/custom-css' : $( '[name="team-accounts/custom-css"]' ).val(),
						[WLM3VARS.nonce_field]: WLM3VARS.nonce
					},
					function() {
						$( '.wlm-message-holder' ).show_message(
							{
								message: reset ? wp.i18n.__( 'Custom CSS Reset to Default', 'wishlist-member' ) : wp.i18n.__( 'Custom CSS Saved', 'wishlist-member' ),
								type : 'success'
							}
						);
					}
				)
			}
		);

		$( '.btn.reset-btn' ).do_confirm(
			{
				confirm_message : wp.i18n.__( 'Reset Custom CSS?', 'wishlist-member' ),
				yes_button : wp.i18n.__( 'Reset', 'wishlist-member' ),
				placement: 'right'
			}
		).on(
			'yes.do_confirm',
			function (e) {
				cm_editor.setValue( WLM3VARS.team_default_css );
				cm_editor.refresh();
				$( '.btn.save-settings' ).trigger( 'click', true );
			}
		);
	}
);
