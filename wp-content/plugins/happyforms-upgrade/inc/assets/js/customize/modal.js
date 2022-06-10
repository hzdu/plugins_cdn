( function( $, _, Backbone, api, settings ) {

	var FormStyle = happyForms.classes.views.FormStyle;
	var FormSetup = happyForms.classes.views.FormSetup;
	var Previewer = happyForms.previewer;

	happyForms.classes.views.FormSetup = FormSetup.extend( {
		initialize: function() {
			FormSetup.prototype.initialize.apply( this, arguments );

			this.listenTo( this.model, 'change:modal', this.onModalCheckboxChange );
		},

		onModalCheckboxChange: function( model, value ) {
			var data = {
				attribute: 'modal',
				callback: 'onModalCheckboxChangeCallback'
			};

			happyForms.previewSend( 'happyforms-form-class-update', data );
		}
	} );

	happyForms.classes.views.FormStyle = FormStyle.extend( {
		events: _.extend( {}, FormStyle.prototype.events, {
			'change [data-target="modal_class"] input[type=radio]': 'onButtonSetModalClassChange',
		} ),

		applyConditionClasses: function() {
			FormStyle.prototype.applyConditionClasses.apply( this, arguments );

			var hasOverlay = ( 1 == happyForms.form.get( 'modal' ) );

			if ( hasOverlay ) {
				this.$el.addClass( 'has-overlay' );
			}
		},

		onButtonSetModalClassChange: function( e ) {
			e.preventDefault();

			var $target = $( e.target );
			var attribute = $target.data( 'attribute' );
			var value = $target.val();

			happyForms.form.set( attribute, value );
		},
	} );

	happyForms.previewer = _.extend( {}, Previewer, {
		onModalCheckboxChangeCallback: function( attribute, html ) {
			var $formContainer = this.$( html );
			var value = happyForms.form.get( 'modal' );

			if ( 1 == value ) {
				$formContainer.addClass( 'happyforms-form--modal' );
			} else {
				$formContainer.removeClass( 'happyforms-form--modal' );
			}
		}
	} );

} ) ( jQuery, _, Backbone, wp.customize, _happyFormsSettings );