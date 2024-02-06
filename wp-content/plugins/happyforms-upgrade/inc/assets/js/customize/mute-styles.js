( function( $, _, Backbone, api, settings ) {

	var FormStyle = happyForms.classes.views.FormStyle;
	var FormSetup = happyForms.classes.views.FormSetup;
	var Previewer = happyForms.previewer;

	happyForms.classes.views.FormSetup = FormSetup.extend( {
		initialize: function() {
			FormSetup.prototype.initialize.apply( this, arguments );
		},

		onMuteStylesChange: function( model, value ) {
			var data = {
				callback: 'onMuteStylesCheckboxChangeCallback'
			};

			happyForms.previewSend( 'happyforms-form-class-update', data );
		}
	} );

	happyForms.classes.views.FormStyle = FormStyle.extend( {
		events: _.extend({}, FormStyle.prototype.events, {
			'change [name=mute_styles]': 'onMuteStylesChange',
		}),

		initialize: function() {
			FormStyle.prototype.initialize.apply( this, arguments );

			this.listenTo( happyForms.form, 'change:mute_styles', this.onMuteStylesChange );
		},

		onMuteStylesChange: function( e ) {
			var mutedStyles = ( 1 == happyForms.form.get( 'mute_styles' ) );

			if ( mutedStyles ) {
				this.$el.addClass( 'muted-styles' );
			} else {
				this.$el.removeClass( 'muted-styles' );
			}

			var data = {
				callback: 'onMuteStylesCheckboxChangeCallback'
			};

			happyForms.previewSend( 'happyforms-form-class-update', data );
		},

		applyConditionClasses: function() {
			FormStyle.prototype.applyConditionClasses.apply( this, arguments );

			var mutedStyles = ( 1 == happyForms.form.get( 'mute_styles' ) );

			if ( mutedStyles ) {
				this.$el.addClass( 'muted-styles' );
			}
		},
	} );

	happyForms.previewer = _.extend( {}, Previewer, {
		onMuteStylesCheckboxChangeCallback: function( attribute, html ) {
			var $formContainer = this.$( html );
			var value = happyForms.form.get( 'mute_styles' );

			if ( 1 == value ) {
				$formContainer.removeClass( 'happyforms-styles' );
			} else {
				$formContainer.addClass( 'happyforms-styles' );
			}
		}
	} );

} ) ( jQuery, _, Backbone, wp.customize, _happyFormsSettings );
