( function( $, _, Backbone, api, settings ) {

	var AddressView = happyForms.classes.views.parts.address;

	happyForms.classes.views.parts.address = AddressView.extend( {
		events: _.extend( {}, AddressView.prototype.events, {} ),

		initialize: function() {
			AddressView.prototype.initialize.apply( this, arguments );

			this.listenTo( this.model, 'change:mode', this.onModeChange );
			this.listenTo( this.model, 'change:has_geolocation', this.onGeolocationChange );
		},

		ready: function() {},

		onGeolocationChange: function( e ) {
			var model = this.model;

			this.model.set( 'has_geolocation', this.model.get( 'has_geolocation' ) );

			this.model.fetchHtml( function( response ) {
				var data = {
					id: model.get( 'id' ),
					html: response,
				};

				happyForms.previewSend( 'happyforms-form-part-refresh', data );
			} );
		}
	} );

} ) ( jQuery, _, Backbone, wp.customize, _happyFormsSettings );
