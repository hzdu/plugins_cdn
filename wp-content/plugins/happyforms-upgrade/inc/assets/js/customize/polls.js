( function( $, _, Backbone, api, settings ) {

	var FormStyle = happyForms.classes.views.FormStyle;

	happyForms.classes.views.FormStyle = FormStyle.extend( {
		applyConditionClasses: function() {
			FormStyle.prototype.applyConditionClasses.apply( this, arguments );

			var hasPoll = happyForms.form
				.get( 'parts' )
				.findWhere( { type: 'poll' } );

			if ( hasPoll ) {
				this.$el.addClass( 'has-poll' );
			}
		},
	} );

} ( jQuery, _, Backbone, wp.customize, _happyFormsSettings ) );