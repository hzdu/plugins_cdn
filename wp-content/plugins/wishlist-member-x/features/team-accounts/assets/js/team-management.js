/**
 * Frontend Team Management JS
 *
 * @package WishistMember/Pro/TeamAccounts
 */

jQuery(
	function($) {
		// set underscores template tags to {% %} instead of <% %>
		_.templateSettings = {
			evaluate: /{%([\s\S]+?)%}/g,
			interpolate: /{%=([\s\S]+?)%}/g,
			escape: /{%-([\s\S]+?)%}/g
		};

		$( 'body' ).off( '.wlm-team-accounts' );
		/**
		 * Remove team member click handler.
		 */
		$( 'body' ).on(
			'click.wlm-team-accounts',
			'.wlm-team-accounts-remove-team-member',
			function(e) {
				var member_id    = $( e.target ).closest( 'tr' ).data( 'team-member-id' );
				var member_email = $( e.target ).closest( 'tr' ).data( 'team-member-email' );
				var team_id      = $( '#wishlist-member-team-accounts-management' ).data( 'team-id' );
				var remove_text  = +$( e.target ).closest( 'tr' ).data( 'active' ) ? wp.i18n.__( 'Remove Team Member?', 'wishlist-member' ) : wp.i18n.__( 'Cancel team invite?', 'wishlist-member' );

				if (confirm( remove_text )) {
					$.post(
						wlm_teamaccounts.ajaxurl,
						{
							action: 'wishlistmember_team_accounts_remove_user_member',
							member_id: member_id,
							team_id: team_id,
							[wlm_teamaccounts.nonce_field]: wlm_teamaccounts.nonce,
						},
						function(r) {
							if (r.success) {
								$( e.target ).closest( 'tr' ).fadeOut().remove();
								var message = '';
								if (+member_id) {
									// Translators: %s email address
									message = wp.i18n.__( 'Team Member %s removed.', 'wishlist-member' );
								} else {
									// Translators: %s email address
									message = wp.i18n.__( 'Invite cancelled for %s.', 'wishlist-member' );
								}
								show_message( message.replace( '%s', member_email ) );
							}
						}
					);
				}
			}
		);

		/**
		 * Add member submit handler
		 */
		$( 'body' ).on(
			'submit.wlm-team-accounts-team-account',
			'#wlm-team-accounts-team-invite-form',
			function(e) {
				e.preventDefault();
				var email   = this.email.value.trim();
				var team_id = $( '#wishlist-member-team-accounts-management' ).data( 'team-id' );
				var form    = this;
				if (email) {
					$.post(
						wlm_teamaccounts.ajaxurl,
						{
							action: 'wishlistmember_team_accounts_invite_member',
							email: email,
							team_id: team_id,
							[wlm_teamaccounts.nonce_field]: wlm_teamaccounts.nonce,
						},
						function(r) {
							show_message( r.data.message, r.success );
							$( 'form#wlm-team-accounts-team-search' )[0].reset();
							reload_members();
							form.reset();
							form.email.focus();
						}
					);
				}
			}
		);
		/**
		 * Add member click handler
		 */
		$( 'body' ).on(
			'click.wlm-team-accounts',
			'#wlm-team-accounts-team-invite-submit',
			function() {
				$( '#wlm-team-accounts-team-invite-form' ).submit();
			}
		);

		/**
		 * Search team members submit handler.
		 */
		$( 'body' ).on(
			'submit.wlm-team-accounts',
			'#wlm-team-accounts-team-search',
			function(e) {
				e.preventDefault();
				reload_members( $( e.target ).find( '[type=search]' ).val().trim() );
			}
		);
		$( '#wlm-team-accounts-team-search' ).trigger( 'submit.wlm-team-accounts' );

		/**
		 * Reload team members table.
		 *
		 * @param  {string} search Search text.
		 */
		function reload_members(search) {
			var team_id = $( '#wishlist-member-team-accounts-management' ).data( 'team-id' );
			$.post(
				wlm_teamaccounts.ajaxurl,
				{
					action: 'wishlistmember_team_accounts_search_member',
					team_id: team_id,
					search: search,
					[wlm_teamaccounts.nonce_field]: wlm_teamaccounts.nonce,
				},
				function(r) {
					$( '#wlm-team-accounts-team-members tbody tr:not(.wlm-team-accounts-no-members)' ).remove();
					r.data.members.forEach(
						function(member) {
							$( member.html ).insertBefore( '#wlm-team-accounts-team-members tbody .wlm-team-accounts-no-members' );
						}
					);
					$( '#wlm-team-accounts-team-members' ).show();
				}
			);
		}

		/**
		 * Team invite registration submit handler.
		 */
		$( 'body' ).on(
			'submit.wlm-team-accounts',
			'form#team-accounts-registration',
			function(e) {
				e.preventDefault();
				$.post(
					wlm_teamaccounts.ajaxurl,
					$( e.target ).serializeArray(),
					function(r) {
						if (r.success) {
							document.location = r.data.redirect;
						} else {
							show_message( r.data.message, r.success );
						}
					}
				);
			}
		);

		/**
		 * Display a message inside elements with class "wlm-team-accounts-team-message"
		 *
		 * @param  string message Message to display.
		 * @param  boolean success True to display message as success or false for error.
		 * @param  integer delay Delay in milliseconds before hiding the message. Default 3000.
		 */
		function show_message(message, success, delay) {
			var $message_box = $( '#wlm-team-accounts-team-message' );
			$message_box.attr( 'class','' )
				.addClass( success ? 'success' : 'error' )
				.html( message )
				.show()
				.delay( +delay || 5000, delay )
				.fadeOut( 400 );
		}
	}
);
