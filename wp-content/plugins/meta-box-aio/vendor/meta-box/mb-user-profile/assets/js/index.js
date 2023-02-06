import { checkRecaptcha } from './helpers.js';

const $ = jQuery,
	passwordStrength = wp.passwordStrength,
	types = ['very-weak', 'very-weak', 'weak', 'medium', 'strong', 'mismatch'];

function processForm() {
	const $form = $( this ),
		key = 'MBUP_Data_' + $form.find( '[name^="mbup_key"]' ).val(),
		i18n = window[key];

	if ( typeof i18n !== 'object' || ! i18n.hasOwnProperty( 'strength' ) ) {
		return;
	}

	// Set ajax URL for ajax actions like query images for image_advanced fields.
	if ( typeof window.ajaxurl === 'undefined' ) {
		window.ajaxurl = i18n.ajaxUrl;
	}

	const $submitBtn = $form.find( '[name^="rwmb_profile_submit"]' ),
		requiredStrength = types.indexOf(i18n.strength),
		$result = $form.find( '#password-strength' ),
		$user_pass = $form.find( '#user_pass' ),
		$user_pass2 = $form.find( '#user_pass2' );

	const disableButtons = () => $submitBtn.prop( 'disabled', true );
	const enableButtons = () => $submitBtn.prop( 'disabled', false );
	const validate = () => {
		$( '#rwmb-validation-message' ).remove(); // Remove all previous validation message.
		return ! $.validator || $form.valid();
	};

	function checkPasswordStrength( password, password2 ) {
		if ( ! password || ! password2 ) {
			$result.hide();
			return;
		}

		// Reset the form & meter.
		disableButtons();
		$result.removeClass( 'very-weak weak medium strong mismatch' ).show();

		// Get the password strength.
		const strength = passwordStrength.meter( password, passwordStrength.userInputDisallowedList(), password2 );
		if ( 0 > strength || 5 < strength ) {
			return;
		}
		const type = types[strength];

		$result.addClass( type ).html( i18n[type] );
		if ( requiredStrength <= strength && 5 !== strength ) {
			enableButtons();
		}
	}

	function submitCallback() {
		// Native form submit.
		// Can't use form.submit() because form.submit is the submit button, not a function.
		HTMLFormElement.prototype.submit.call( $form[0] );
	}

	function handleSubmitClick( e ) {
		if ( i18n.recaptchaKey ) {
			e.preventDefault();
		}

		// Do nothing when the form is not validated.
		if ( ! validate() ) {
			return;
		}

		disableButtons();

		if ( i18n.recaptchaKey ) {
			checkRecaptcha( {
				key: i18n.recaptchaKey,
				success: token => {
					$form.find( 'input[name="mbup_recaptcha_token"]' ).val( token );
					submitCallback();
				},
				error: () => alert( i18n.captchaExecuteError )
			} );
		} else {
			submitCallback();
		}
	}

	$submitBtn.on( 'click', handleSubmitClick );
	$user_pass.on( 'keyup', () => checkPasswordStrength( $user_pass.val(), $user_pass2.val() ) );
	$user_pass2.on( 'keyup', () => checkPasswordStrength( $user_pass.val(), $user_pass2.val() ) );
}

$( () => $( '.rwmb-form' ).each( processForm ) );