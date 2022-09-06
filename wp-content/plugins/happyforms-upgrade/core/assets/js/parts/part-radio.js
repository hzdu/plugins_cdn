( function( $, _, Backbone, api, settings ) {

	happyForms.classes.models.parts.radio = happyForms.classes.models.Part.extend( {
		defaults: function() {
			return _.extend(
				{},
				settings.formParts.radio.defaults,
				_.result( happyForms.classes.models.Part.prototype, 'defaults' ),
			);
		},

		initialize: function( attrs, options ) {
			happyForms.classes.models.Part.prototype.initialize.apply( this, arguments );

			this.attributes.options = new OptionCollection( this.get( 'options' ), options );
		},

		toJSON: function() {
			var json = Backbone.Model.prototype.toJSON.apply( this, arguments );
			json.options = json.options.toJSON();

			return json;
		},
	} );

	var OptionModel = happyForms.classes.models.Option.extend( {
		defaults: function() {
			return _.extend( {
				is_default: false,
				label: '',
				description: '',
				is_heading: false,
			}, _.result( happyForms.classes.models.Option.prototype, 'defaults' ) );
		},
	} );

	var OptionCollection = Backbone.Collection.extend( {
		model: OptionModel,
	} );

	happyForms.classes.views.radioOptionItem = happyForms.classes.views.OptionItem.extend( {
		template: '#customize-happyforms-radio-item-template',
	} );

	happyForms.classes.views.radioOptionHeading = happyForms.classes.views.OptionHeading.extend( {
		template: '#customize-happyforms-radio-item-heading-template',
	} );

	happyForms.classes.views.parts.radio = happyForms.classes.views.ChoiceField.extend( {
		template: '#customize-happyforms-radio-template',

		events: _.extend( {}, happyForms.classes.views.ChoiceField.prototype.events, {
			'change [data-bind=display_type]': 'onDisplayTypeChange',
		} ),

		getOptionItemView: function( optionModel, options ) {
			var view = new happyForms.classes.views.radioOptionItem( _.extend( {
				model: optionModel,
				part: this.model,
			}, options ) );

			return view;
		},

		getOptionHeadingView: function( optionModel, options ) {
			var view = new happyForms.classes.views.radioOptionHeading( _.extend( {
				model: optionModel,
				part: this.model,
			}, options ) );

			return view;
		},
	} );

} ) ( jQuery, _, Backbone, wp.customize, _happyFormsSettings );