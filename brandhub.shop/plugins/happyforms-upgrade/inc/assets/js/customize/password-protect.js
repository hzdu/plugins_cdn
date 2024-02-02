
( function( $, _, Backbone, api, settings ) {
	var FormSetup = happyForms.classes.views.FormSetup;

	happyForms.classes.views.FormSetup = FormSetup.extend( {
		initialize: function() {
			FormSetup.prototype.initialize.apply( this, arguments );

			this.listenTo( this.model, 'change:password_protect', this.onPasswordProtectChange );
		},

		events: _.extend( {}, FormSetup.prototype.events, {
			'click a.happyforms-reset-password': 'onResetPasswordClick'
		} ),

		onResetPasswordClick: function(e) {
			e.preventDefault();

			var $link = $( e.target );
			var $passwordWrap = $link.next( '.customize-password-field-wrap' );

			$( 'input', $passwordWrap ).val( '' ).prop( 'disabled', false );
			$passwordWrap.toggle();
			$( 'input', $passwordWrap ).trigger( 'focus' );
		},

		onPasswordProtectChange: function( model, value ) {
			var $control = $( '#customize-control-password_protect' );

			if ( value ) {
				$control.addClass( 'checked' );
			} else {
				$control.removeClass( 'checked' );
			}
		},
	} );
} ) ( jQuery, _, Backbone, wp.customize, _happyFormsSettings );