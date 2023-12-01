$(
	function() {
		$( 'body' ).off( '.wlm-team-accounts' );

		new wlm3_modal(
			'#team-accounts-team-template',
			{
				save_handler: function(e) {
					// form elements.
					const el = $( '#' + e.data.modal.data.id ).find( 'form' )[0].elements;
					// trigger button.
					const btn = this;

					if ( ! el.name.value.trim()) {
						$( '.wlm-message-holder' ).show_message(
							{
								message: wp.i18n.__( 'Team Account Name required.', 'wishlist-member' ),
								type: 'danger'
							}
						);
						el.name.focus();
						return;
					}
					if ( +el.default_children.value < 1 ) {
						$( '.wlm-message-holder' ).show_message(
							{
								message: wp.i18n.__( 'Number of Team Members required.', 'wishlist-member' ),
								type: 'danger'
							}
						);
						el.default_children.focus();
						return;
					}
					if ( ! el.mirrored_access.checked && ! el.access_levels.selectedOptions.length && ! el.access_payperposts.selectedOptions.length ) {
						$( '.wlm-message-holder' ).show_message(
							{
								message: wp.i18n.__( 'At least one Membership Level or Pay Per Post must be selected if "Inherit Team Admin Access" is disabled.', 'wishlist-member' ),
								type: 'danger'
							}
						);
						el.access_levels.focus();
						return;
					}

					// ajax save.
					$.post(
						WLM3VARS.ajaxurl,
						{
							action: 'wishlistmember_team_accounts_save_team',
							[WLM3VARS.nonce_field]: WLM3VARS.nonce,
							team: {
								name: el.name.value,
								default_children: el.default_children.value,
								mirrored_access: +el.mirrored_access.checked,
								triggers: [...el.triggers.selectedOptions].map( x => x.value ),
								access_levels: [...el.access_levels.selectedOptions].map( x => x.value ),
								access_payperposts: [...el.access_payperposts.selectedOptions].map( x => x.value ),
								exclude_levels: [...el.exclude_levels.selectedOptions].map( x => x.value ),
								exclude_payperposts: [...el.exclude_payperposts.selectedOptions].map( x => x.value ),
								id: el.id.value,
							}
						},
						function(r) {
							teams = r.data;
							list_teams();
							$( '.wlm-message-holder' ).show_message(
								{
									type : 'success'
								}
							);
							// close if it's a save and close button.
							$( btn ).hasClass( '-close' ) && e.data.modal.close();
						}
					)
				},
				before_open: function(e) {
					// form elements.
					const el = $( this ).find( 'form' )[0].elements;
					// trigger button.
					const $button = $( e.relatedTarget );

					// default modal title.
					var title = wp.i18n.__( 'New Team Account', 'wishlist-member' );

					// reset the form.
					$( this ).find( 'form' )[0].reset();

					// default id.
					el.id.value = + new Date();

					// edit values.
					if ( $button.hasClass( 'edit-btn' ) ) {
						// team data.
						const team = teams[$button.data( 'id' )];

						// new modal title.
						title = wp.i18n.__( 'Editing Team Plan: %s', 'wishlist-member' ).replace( '%s', team.name );

						// set field values.
						el.id.value               = team.id;
						el.name.value             = team.name;
						el.default_children.value = team.default_children;
						$( el.triggers ).val( team.triggers );
						$( el.access_levels ).val( team.access_levels );
						$( el.access_payperposts ).val( team.access_payperposts );
						$( el.exclude_levels ).val( team.exclude_levels );
						$( el.exclude_payperposts ).val( team.exclude_payperposts );
						el.mirrored_access.checked = +team.mirrored_access;
					}
					$( el.mirrored_access ).trigger( 'change' );

					// trigger change for select2
					$( this ).find( 'select' ).change();

					// set modal title
					$( this ).find( '.modal-title' ).text( title );
				},
				after_open: function(e) {
					// form elements.
					$( this ).find( 'form input[name="name"]' ).focus();
				}
			}
		);

		/**
		 * List teams in table.
		 */
		const list_teams = function() {
			// list teams in table.
			var tmpl = _.template( $( 'script#team-accounts-teams' ).html(), {variable: 'data'} );
			$( '#teams-table tbody' ).empty().append(
				tmpl(
					{
						levels: levels,
						teams : teams,
						access_text : function( quantity, text ) {
							switch (text) {
								case 'level':
									return wp.i18n._n( '%d Level', '%d Levels', quantity, 'wishlist-member' ).replace( '%d', quantity );
								break;
								case 'ppp':
									return wp.i18n._n( '%d Pay Per Post', '%d Pay Per Posts', quantity, 'wishlist-member' ).replace( '%d', quantity );
								break;
							}
						}
					}
				)
			);
			$('#teams-table tbody, p.add-team-plan').toggleClass('no-rows', $('#teams-table tbody tr').length < 1 )

			// set delete button do_confirm.
			$( '.btn.delete-team' ).do_confirm(
				{
					confirm_message : wp.i18n.__( 'Delete Team Plan?', 'wishlist-member' ),
					yes_button : wp.i18n.__( 'Delete', 'wishlist-member' ),
					placement: 'right'
				}
			).on(
				'yes.do_confirm',
				function(e) {
					$.post(
						WLM3VARS.ajaxurl,
						{
							action: 'wishlistmember_team_accounts_delete_team',
							[WLM3VARS.nonce_field]: WLM3VARS.nonce,
							id: $( e.target ).data( 'id' )
						},
						function(r) {
							teams = r.data;
							list_teams();
							$( '.wlm-message-holder' ).show_message(
								{
									type : 'danger',
									message: wp.i18n.__( 'Team deleted.' )
								}
							);
						}
					)
				}
			);
		}

		// list the teams.
		list_teams();
	}
);
