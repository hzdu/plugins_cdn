( function( $, _, Backbone, api, settings ) {

	happyForms.classes.models.parts.image = happyForms.classes.models.Part.extend( {
		defaults: function() {
			return _.extend(
				{},
				settings.formParts.image.defaults,
				_.result( happyForms.classes.models.Part.prototype, 'defaults' ),
			);
		},
	} );

	happyForms.classes.views.parts.image = happyForms.classes.views.Part.extend( {
		template: '#happyforms-customize-image-template',

		initialize: function() {
			happyForms.classes.views.Part.prototype.initialize.apply( this, arguments );

			this.listenTo( this.model, 'change:attachment', this.onAttachmentChange );
		},

		ready: function() {
			happyForms.classes.views.Part.prototype.ready.apply( this, arguments );

			$( '.happyforms-image-upload', this.$el ).happyFormsImageHandle( this.model, {
				'mediaTypes': [ 'image' ]
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
