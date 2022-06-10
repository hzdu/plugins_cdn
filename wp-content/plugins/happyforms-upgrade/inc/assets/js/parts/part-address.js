( function( $, _, Backbone, api, settings ) {

	happyForms.classes.models.parts.address = happyForms.classes.models.Part.extend( {
		defaults: function() {
			return _.extend(
				{},
				settings.formParts.address.defaults,
				_.result( happyForms.classes.models.Part.prototype, 'defaults' ),
			);
		},
	} );

	happyForms.classes.views.parts.address = happyForms.classes.views.Part.extend( {
		template: '#happyforms-customize-address-template',

		events: _.extend( {}, happyForms.classes.views.Part.prototype.events, {} ),

		initialize: function() {
			happyForms.classes.views.Part.prototype.initialize.apply( this, arguments );

			this.listenTo( this.model, 'change:mode', this.onModeChange );
		},

		onModeChange: function( model, value ) {
 			model.fetchHtml( function( response ) {
 				var data = {
 					id: model.get( 'id' ),
 					html: response,
 				};

 				happyForms.previewSend( 'happyforms-form-part-refresh', data );
 			} );
 		},

	} );

} ) ( jQuery, _, Backbone, wp.customize, _happyFormsSettings );
