/**
 * UserRegistrationProfileCompleteness Frontend JS
 * 
 * Global user_registrations_profile_completeness_params.
 */
( function ( $ ) {
	var UserRegistrationProfileCompleteness = {
        /**
         * Initialization.
         */
		init: function () {
			UserRegistrationProfileCompleteness.bindUIActions();
			$(document).ready( UserRegistrationProfileCompleteness.ready );
		},

		/**
		 * Document Ready
		 */
		ready: function () {
            $(document).ready(function () {
				const $profileCompletenessHidden = $( '#ur-profile-completeness-hidden', $( document ) );

				if( $profileCompletenessHidden.length ) {
					const data = {
						is_profile_completed : '1' === $profileCompletenessHidden.data( 'is-profile-completed' ) ? true : false,
						completed_profile_percentage: $profileCompletenessHidden.data( 'completed-profile-percentage' ),
						profile_completion_percentage: $profileCompletenessHidden.data( 'profile-completion-percentage' ),
					}

					UserRegistrationProfileCompleteness.updateOrRemoveOption( data );
				}

            });
		},

		/**
		 * Element bindings
		 */
		bindUIActions: function () {
            $( document ).on( 'user_registration_edit_profile_after_ajax_complete', function ( e, response ) { 
                if( response.responseJSON.data.profile_complete_data ) {
					const data = response.responseJSON.data.profile_complete_data;

					$progressbar = $( '.ur-profile-completion-detail__circular-bar', $( document ) );

					$progressbar.attr( 'aria-valuemax', data.profile_completion_percentage );
					$progressbar.attr('style', '--value: ' + data.completed_profile_percentage );

					UserRegistrationProfileCompleteness.updateOrRemoveOption( data );

                }
            } )
		},

        /**
         * Update or remove the profile incomplete notice.
         * 
		 * @param array profile completeness data.
         */
        updateOrRemoveOption: function  ( data ) {
			if( $( '.user-registration-info .ur-profile-completeness', $( document ) ).length ) {
				if( data.is_profile_completed ) {
					$( '.user-registration-info .ur-profile-completeness', $( document ) ).parent().remove();
				} else {
					$( '.user-registration-info .ur-profile-completeness', $( document ) ).text( data.completed_profile_percentage + '%' );
				}
			}
        },
	};
	UserRegistrationProfileCompleteness.init();
} )( jQuery );