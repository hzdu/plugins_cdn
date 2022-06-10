( function ( $, _, Backbone, api, settings ) {

	happyForms.classes.models.parts.phone = happyForms.classes.models.Part.extend( {
		defaults: function () {
			return _.extend(
				{},
				settings.formParts.phone.defaults,
				_.result( happyForms.classes.models.Part.prototype, 'defaults' ),
			);
		},
	} );

	happyForms.classes.views.parts.phone = happyForms.classes.views.Part.extend( {
		template: '#happyforms-customize-phone-template',

		events: _.extend({}, happyForms.classes.views.Part.prototype.events, {
			'change [data-bind=masked]': 'onMaskedChange',
		}),

		/**
		 * Toggle masked input configuration on `Mask this input` checkbox change.
		 *
		 * @since 1.0.0.
		 *
		 * @param {object} e JS event.
		 *
		 * @return void
		 */
		onMaskedChange: function (e) {
			var $input = $(e.target);
			var attribute = $input.data('bind');
			var model = this.model;

			this.model.set( attribute, parseInt( $input.val() ) );

			this.model.fetchHtml( function ( response ) {
				var data = {
					id: model.get('id'),
					html: response,
				};

				happyForms.previewSend( 'happyforms-form-part-refresh', data );
			} );
		},

		onDefaultValueChange: function() {
			var data = {
				id: this.model.id,
				callback: 'onPhoneDefaultValueChangeCallback',
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},

		onPlaceholderChange: function() {
			var data = {
				id: this.model.id,
				callback: 'onPhonePlaceholderChangeCallback',
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},

	} );

	happyForms.previewer = _.extend( happyForms.previewer, {
		onPhoneDefaultValueChangeCallback: function( id, $part ) {
			var part = happyForms.form.get( 'parts' ).get( id );
			var default_value = part.get( 'default_value' );

			$part.find( '.happyforms-part-phone-wrap > .happyforms-input input' ).val( default_value );
		},

		onPhonePlaceholderChangeCallback: function( id, html ) {
			var part = happyForms.form.get( 'parts' ).get( id );
			var $part = this.$( html );

			$part.find( '.happyforms-part-phone-wrap > .happyforms-input input' ).attr( 'placeholder', part.get( 'placeholder' ) );
		},
	} );

} )( jQuery, _, Backbone, wp.customize, _happyFormsSettings );
