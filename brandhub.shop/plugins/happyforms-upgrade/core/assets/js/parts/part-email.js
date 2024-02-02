( function( $, _, Backbone, api, settings ) {

	happyForms.classes.models.parts.email = happyForms.classes.models.Part.extend( {
		defaults: function() {
			return _.extend(
				{},
				settings.formParts.email.defaults,
				_.result( happyForms.classes.models.Part.prototype, 'defaults' ),
			);
		},
	} );

	happyForms.classes.views.parts.email = happyForms.classes.views.Part.extend( {
		template: '#customize-happyforms-email-template',

		initialize: function() {
			happyForms.classes.views.Part.prototype.initialize.apply(this, arguments);
		},

	} );

} ) ( jQuery, _, Backbone, wp.customize, _happyFormsSettings );
