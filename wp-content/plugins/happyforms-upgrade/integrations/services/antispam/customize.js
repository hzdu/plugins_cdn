( function( $, _, Backbone, api, settings, integrationsSettings ) {

	var FormStyle = happyForms.classes.views.FormStyle;
	var FormSetup = happyForms.classes.views.FormSetup;
	var Previewer = happyForms.previewer;

	happyForms.classes.views.FormSetup = FormSetup.extend( {
		initialize: function() {
			FormSetup.prototype.initialize.apply( this, arguments );

			this.listenTo( this.model, 'change:captcha', this.onChangeCaptcha );
			this.listenTo( this.model, 'change:captcha_label', this.onChangeCaptchaLabel );
			this.listenTo( this.model, 'change:captcha_theme', this.onChangeCaptcha );
		},

		ready: function() {
			FormSetup.prototype.ready.apply( this, arguments );

			this.onChangeCaptcha();
		},

		onChangeCaptcha: function() {
			if ( 'recaptchav3' == integrationsSettings.spam ) {
				return;
			}

			var data = {
				callback: 'onRecaptchaUpdateCallback',
			};

			happyForms.previewSend( 'happyforms-form-recaptcha-update', data );
		},

		onChangeCaptchaLabel: function() {
			var data = {
				callback: 'onRecaptchaLabelChangeCallback',
			};

			happyForms.previewSend( 'happyforms-form-dom-update', data );
		},
	} );

	happyForms.classes.views.FormStyle = FormStyle.extend( {
		events: _.extend( {}, FormStyle.prototype.events, {
			'change [data-target="recaptcha"]': 'onRecaptchaChange',
		} ),

		onRecaptchaChange: function( e ) {
			e.preventDefault();

			var $target = $( e.target );
			var attribute = $target.data( 'attribute' );
			var value = $target.val();

			happyForms.form.set( attribute, value );

			var data = {
				callback: 'onRecaptchaUpdateCallback',
			};

			happyForms.previewSend( 'happyforms-form-recaptcha-update', data );
		},
	} );

	happyForms.previewer = _.extend( {}, Previewer, {
		onRecaptchaUpdateCallback: function( $recaptcha, $ ) {
			var captcha = happyForms.form.get( 'captcha' );

			if ( captcha ) {
				var siteKey = happyForms.form.get( 'captcha_site_key' ) || 'null';
				$recaptcha.attr( 'data-sitekey', siteKey );
				var theme = happyForms.form.get( 'captcha_theme' ) || 'light';
				$recaptcha.attr( 'data-theme', theme );
				$recaptcha.show();
				$recaptcha.happyFormPart( 'render' );
			} else {
				$recaptcha.hide();
				$recaptcha.happyFormPart( 'reset' );
			}
		},

		onRecaptchaLabelChangeCallback: function( $form ) {
			var recaptchaLabel = happyForms.form.get( 'captcha_label' );
			$( '.happyforms-part--recaptcha .label', $form ).text( recaptchaLabel );
		},
	} );

} ) ( jQuery, _, Backbone, wp.customize, _happyFormsSettings, _happyFormsIntegrations );
