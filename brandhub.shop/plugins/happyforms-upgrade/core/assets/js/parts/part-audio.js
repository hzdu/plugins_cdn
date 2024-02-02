( function( $, _, Backbone, api, settings ) {

	happyForms.classes.models.parts.audio = happyForms.classes.models.Part.extend( {
		defaults: function() {
			return _.extend(
				{},
				settings.formParts.audio.defaults,
				_.result( happyForms.classes.models.Part.prototype, 'defaults' ),
			);
		},
	} );

	happyForms.classes.views.parts.audio = happyForms.classes.views.Part.extend( {
		template: '#happyforms-customize-audio-template',

		initialize: function() {
			happyForms.classes.views.Part.prototype.initialize.apply( this, arguments );

			this.listenTo( this.model, 'change:attachment', this.onAttachmentChange );
		},

		ready: function() {
			happyForms.classes.views.Part.prototype.ready.apply( this, arguments );

			$( '.happyforms-audio-upload', this.$el ).happyFormsAudioHandle( this.model, {
				'mediaTypes': [ 'audio' ]
			} );
		},

		onAttachmentChange: function( model, value ) {
			model.fetchHtml( function( response ) {
				var data = {
					id: model.get( 'id' ),
					html: response,
				};

				happyForms.previewSend( 'happyforms-form-part-refresh', data );
			} );
		}
	} );

} ) ( jQuery, _, Backbone, wp.customize, _happyFormsSettings );
