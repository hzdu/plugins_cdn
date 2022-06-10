( function( $, _, Backbone, api, settings ) {

	var FormEmail = happyForms.classes.views.FormEmail;

	happyForms.classes.views.FormEmail = FormEmail.extend( {
		ready: function() {
			FormEmail.prototype.ready.apply( this, arguments );

			this.initMediaUploads();
		},

		initMediaUploads: function() {
			$( '.happyforms-media-upload' ).happyFormsMediaHandle( this.model );
		},
	} );

} ) ( jQuery, _, Backbone, wp.customize, _happyFormsSettings );
