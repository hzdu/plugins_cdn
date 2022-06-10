( function( $, settings ) {

	HappyForms.parts = HappyForms.parts || {};

	HappyForms.parts.recaptcha_v3 = {
		init: function() {
			this.type = this.$el.data( 'happyforms-type' );
			this.$input = $( '> div', this.$el );
			this.$form = this.$input.parents( 'form' );

			this.loadLibrary();
		},

		loadLibrary: function() {
			HappyForms.scripts.fetch( 'recaptcha', settings.libraryURL, this.onLibraryLoaded.bind( this ) );
		},

		onLibraryLoaded: function() {
			grecaptcha.ready( this.onReady.bind( this ) );
		},

		onReady: function() {
			var self = this;

			this.$form.off( 'submit' );
			this.$form.on( 'submit', this.onSubmit.bind( this ) );
		},

		onSubmit: function( e ) {
			e.preventDefault();

			var self = this;
			var form = this.$form.parents( '.happyforms-form' ).data( 'HappyForm' );
			var originalArguments = arguments;

			grecaptcha.execute( this.$el.data( 'sitekey' ), { action: 'happyforms_submit' } ).then( function( token ) {
				var $tokenInput = $( '<input />', {
					name: 'g-recaptcha-response',
					type: 'hidden'
				} );

				$tokenInput.val( token );
				self.$input.append( $tokenInput );

				HappyForms.Form.prototype.submit.apply( form, originalArguments );
			} );
		},

		isFilled: function() {
			return this.checked;
		},

		isValid: function() {
			return this.checked;
		},

		serialize: function() {
			var serialized = [ {
				name: 'g-recaptcha-response',
				value: $( '[name=g-recaptcha-response]', this.$el ).val(),
			} ];

			return serialized;
		},
	};

} )( jQuery, _happyFormsSettings.googleRecaptcha );
