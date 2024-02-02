( function( $, _, Backbone, api, settings ) {

	happyForms.classes.models.parts.divider = happyForms.classes.models.Part.extend( {
		defaults: function() {
			return _.extend(
				{},
				settings.formParts.divider.defaults,
				_.result( happyForms.classes.models.Part.prototype, 'defaults' ),
			);
		},
	} );

	happyForms.classes.views.parts.divider = happyForms.classes.views.Part.extend( {
		template: '#customize-happyforms-divider-template',
	} );

} ) ( jQuery, _, Backbone, wp.customize, _happyFormsSettings );
