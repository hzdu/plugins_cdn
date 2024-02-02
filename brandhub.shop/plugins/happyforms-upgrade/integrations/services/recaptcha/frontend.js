( function( $, settings ) {

	HappyForms.parts = HappyForms.parts || {};

	HappyForms.parts.recaptcha_v2 = {
		init: function() {
			this.type = this.$el.data( 'happyforms-type' );
			this.$input = $( '> div', this.$el );
			this.html = this.$el.html();
			this.checked = false;
			this.ready = false;
			this.widgetID = false;

			this.render();
		},

		loadLibrary: function() {
			HappyForms.scripts.fetch( 'recaptcha', settings.libraryURL, this.onLibraryLoaded.bind( this ) );
		},

		onLibraryLoaded: function() {
			grecaptcha.ready( this.onReady.bind( this ) );
		},

		onReady: function() {
			this.ready = true;
			this.render();
		},

		render: function() {
			if ( ! this.ready ) {
				this.loadLibrary();
				return;
			}

			var id = this.$input.attr( 'id' );
			var siteKey = this.$el.attr( 'data-sitekey' );
			var theme = ( this.$el.attr( 'data-theme' ) ) ? this.$el.attr( 'data-theme' ) : 'light';
			var self = this;

			if ( ! siteKey ) {
				return;
			}

			if ( false !== this.widgetID ) {
				this.reset();
			}

			this.widgetID = grecaptcha.render( id, {
				sitekey: siteKey,
				theme: theme,

				callback: function( response ) {
					self.checked = true;

					self.triggerChange( {
						recaptcha: true,
						response: response
					} );
				},
			} );
		},

		reset: function() {
			this.$el.html( this.html );
			this.widgetID = false;
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
