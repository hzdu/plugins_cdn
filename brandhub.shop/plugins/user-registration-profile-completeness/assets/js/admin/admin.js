/**
 * UserRegistrationProfileCompleteness Admin JS
 * Global ur_profile_completeness_params.
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
            UserRegistrationProfileCompleteness.enableOrDisableOption( $( '#user_registration_profile_completeness_enable_custom_percentage' ) );
            UserRegistrationProfileCompleteness.enableOrDisableOption( $( '#user_registration_profile_completeness_enable_profile_incomplete_notice' ) );
            // UserRegistrationProfileCompleteness.enableOrDisableOption( $( '#user_registration_profile_completeness_enable_email_reminder' ) );
            UserRegistrationProfileCompleteness.enableOrDisableProfileCompleteness( $( '#user_registration_enable_profile_completeness' ) );
            UserRegistrationProfileCompleteness.updateRemainingPercent();

            // On new field is created.
            $( document.body ).on( 'ur_new_field_created' , function ( e, data ) {
                const { fieldKey, label, visibleTo } = data;

                const excludedFields = [ 
                'hidden',
                'section_title',
				'html',
				'billing_address_title',
				'billing_country',
				'billing_first_name',
				'billing_last_name',
				'billing_company',
				'billing_address_1',
				'billing_address_2',
				'shipping_city',
				'billing_state',
				'billing_postcode',
				'separate_shipping',
				'shipping_address_title',
				'shipping_country',
				'shipping_first_name',
				'shipping_last_name',
				'shipping_company',
				'shipping_address_1',
				'shipping_address_2',
				'shipping_city',
				'shipping_state',
				'shipping_postcode',
			 ];

                // Don't append these fields.
				if ( excludedFields.includes( fieldKey ) ) {
					return;
				}

                var $option = $( '<option>', {
                    value: fieldKey,
                    text: label
                  } );

                // If field visibility addon.
                if( $( '.ur-advance-setting.ur-advance-field_visibility', $( document ) ).length ) {
                    if( 'edit_form' === visibleTo || 'both' === visibleTo || undefined === visibleTo ) {
                        $( 'select.user-registration-profile-completeness-custom-percentage-field', $( document ) ).append( $option ).trigger( 'change' );
                    }
                } else {
                    $( 'select.user-registration-profile-completeness-custom-percentage-field', $( document ) ).append( $option ).trigger( 'change' );
                }
            } );

            // On field is deleted.
            $( document.body ).on( 'ur_field_removed' , function ( e, data ) {
                const { fieldName } = data;

                // Remove the <option> element matching with fieldName.
                $( 'select.user-registration-profile-completeness-custom-percentage-field', $( document ) ).find( 'option[value="' + fieldName + '"]' ).remove().trigger( 'change' );
            } );

            // On field label update.
            $( document.body ).on( 'change', '.ur-general-setting-field.ur-type-text', function () {
                const fieldLabel = $( this ).val();

                const $parent = $( this ).parents( '.ur-general-setting-block' );
                const parentClass = $parent.attr('class');
                const filedKey = parentClass.split('ur-general-setting-block ur-general-setting-')[1];

                // Update the option text of the select box.
                const $selectBox = $( 'select.user-registration-profile-completeness-custom-percentage-field', $( document.body ) );
                $( 'option[value="' + filedKey + '"]', $selectBox ).text( fieldLabel );
            } );
		},

		/**
		 * Element bindings
		 */
		bindUIActions: function () {
            $( document ).on( 'click', '#user_registration_profile_completeness_enable_custom_percentage', function () {
                UserRegistrationProfileCompleteness.enableOrDisableOption($(this));
            });

            $( document ).on( 'click', '#user_registration_profile_completeness_enable_profile_incomplete_notice', function () {
                UserRegistrationProfileCompleteness.enableOrDisableOption( $(this) );
            } );

            /* $( document ).on( 'click', '#user_registration_profile_completeness_enable_email_reminder', function () {
                UserRegistrationProfileCompleteness.enableOrDisableOption( $(this) );
            } ); */

            $( document ).on( 'click', '#user_registration_enable_profile_completeness', function () {
                UserRegistrationProfileCompleteness.enableOrDisableProfileCompleteness( $(this) );
            } );

            $( document ).on( 'change', '.user-registration-profile-completeness-custom-percentage-field', function () {
                UserRegistrationProfileCompleteness.updateRemainingPercent();
            } );

            // Percentage value validation.
            $( document ).on( 'change', '.user-registration-profile-completeness-custom-percentage-value, #user_registration_profile_completeness_completion_percentage', function() {
                var inputValue = $( this ).val();

                var sanitized_percent = parseFloat( inputValue.replace(/[^\d\.]/g, '').replace(/\.(([^\.]*)\.)*/g, '.$2') );

                if( ! isNaN(sanitized_percent) ) {
                    if( /\./.test( sanitized_percent ) && 2 < sanitized_percent.toString().split( '.' )[1].length ) {
                        $( this ).val( sanitized_percent.toFixed( 2 ).toString() + '%' );
                    } else {
                        $( this ).val( sanitized_percent.toString() + '%' );
                    }
                } else {
                    $( this ).val( '' );
                }

                UserRegistrationProfileCompleteness.updateRemainingPercent();
            } );
		},

        /**
         * Enable or disable the option.
         *
		 * @param {jQuery} $this Checkbox element.
         */
        enableOrDisableOption: function  ( $this ) {
            if( $this.is( ':checked' ) ) {
                $this.parents( '.form-row' ).next( '.form-row' ).show();
            } else {
                $this.parents( '.form-row' ).next( '.form-row' ).hide();
            }
        },

        /**
         * Enable or disable the profile completeness.
         *
		 * @param {jQuery} $this Checkbox element.
         */
        enableOrDisableProfileCompleteness: function ( $this ) {
            if ( $this.is( ':checked' ) ) {
				$this.closest( '#profile-completeness-settings' ).find( '.form-row' ).not( $this.parents('.form-row') ).show();
                UserRegistrationProfileCompleteness.enableOrDisableOption( $( '#user_registration_profile_completeness_enable_custom_percentage' ) );
                UserRegistrationProfileCompleteness.enableOrDisableOption( $( '#user_registration_profile_completeness_enable_profile_incomplete_notice' ) );
                // UserRegistrationProfileCompleteness.enableOrDisableOption( $( '#user_registration_profile_completeness_enable_email_reminder' ) );
			} else {
				$this.closest( '#profile-completeness-settings' ).find( '.form-row' ).not( $this.parents('.form-row') ).hide();
			}
        },

        /**
         * Update the remaining percentage value.
         */
        updateRemainingPercent: function () {
            var sum = 0;

            $( '.user-registration-profile-completeness-custom-percentage-value', $( document ) ).each( function() {
                if( $( this ).parent( '.user-registration-profile-completeness-custom-percentage-value-wrapper').prev( 'div' ).find( 'select.user-registration-profile-completeness-custom-percentage-field' ).val().length ) {
                    var inputValue = $(this).val();

                    if (inputValue !== '') {
                    // Remove any percent sign and convert to a number.
                    var parsedValue = parseFloat(inputValue.replace('%', ''));

                    // Add the parsed value to the sum.
                    sum += parsedValue;
                    }
                }
            } );

            // Round the sum to two decimal places.
            sum = sum.toFixed(2);

            var remainingPercent = parseFloat( $( '#user_registration_profile_completeness_completion_percentage' ).val() ) - sum;
            $( '.ur-profile-completeness-remaining-percentage' ).text( remainingPercent );
        },
	};
	UserRegistrationProfileCompleteness.init();
} )( jQuery );
