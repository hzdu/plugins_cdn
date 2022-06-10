( function( $, _, Backbone, api, settings ) {

	happyForms.classes.models.parts.website_url = happyForms.classes.models.Part.extend( {
		defaults: function() {
			return _.extend(
				{},
				settings.formParts.website_url.defaults,
				_.result( happyForms.classes.models.Part.prototype, 'defaults' ),
			);
		},
	} );

	happyForms.classes.views.parts.website_url = happyForms.classes.views.Part.extend( {
		template: '#customize-happyforms-website-url-template'
	} );

} ) ( jQuery, _, Backbone, wp.customize, _happyFormsSettings );
