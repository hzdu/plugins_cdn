( function( $, _, Backbone, api, settings ) {

	happyForms.classes.models.parts.checkbox = happyForms.classes.models.Part.extend( {
		defaults: function() {
			return _.extend(
				{},
				settings.formParts.checkbox.defaults,
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

	happyForms.classes.views.checkboxOptionItem = happyForms.classes.views.OptionItem.extend( {
		template: '#customize-happyforms-checkbox-item-template',

		onItemDefaultChange: function( e ) {
			var $target = $( e.target );

			if ( $target.is( ':checked' ) ) {
				this.model.set( 'is_default', 1 );
				$target.prop( 'checked', true );
			} else {
				this.model.set( 'is_default', 0 );
				$target.prop( 'checked', false );
			}

			var data = {
				id: this.part.get( 'id' ),
				callback: 'onOptionDefaultChangeCallback',
				options: {
					itemID: this.model.get( 'id' ),
				}
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},
	} );

	happyForms.classes.views.checkboxOptionHeading = happyForms.classes.views.OptionHeading.extend( {
		template: '#customize-happyforms-checkbox-item-heading-template',
	} );

	happyForms.classes.views.parts.checkbox = happyForms.classes.views.ChoiceField.extend( {
		template: '#customize-happyforms-checkbox-template',

		events: _.extend( {}, happyForms.classes.views.ChoiceField.prototype.events, {
			'change [data-bind=limit_choices_min]': 'refreshMinMaxChoices',
			'change [data-bind=limit_choices_max]': 'refreshMinMaxChoices',
		} ),

		initialize: function() {
			happyForms.classes.views.ChoiceField.prototype.initialize.apply( this, arguments );

			this.listenTo( this.model, 'change:limit_choices', this.onLimitChoices );
			this.listenTo( this.model.get( 'options' ), 'add remove', this.refreshMinMaxChoices );
		},

		getOptionItemView: function( optionModel, options ) {
			var view = new happyForms.classes.views.checkboxOptionItem( _.extend( {
				model: optionModel,
				part: this.model,
			}, options ) );

			return view;
		},

		getOptionHeadingView: function( optionModel, options ) {
			var view = new happyForms.classes.views.checkboxOptionHeading( _.extend( {
				model: optionModel,
				part: this.model,
			}, options ) );

			return view;
		},

		onLimitChoices: function( model, value ) {
			var $limitChoicesOptions = $( '.happyforms-nested-settings[data-trigger="limit_choices"]', this.$el );

			if ( 1 == value ) {
				$limitChoicesOptions.show();
			} else {
				$limitChoicesOptions.hide();
			}
		},

		refreshMinMaxChoices: function() {
			var minChoices = this.model.get( 'limit_choices_min' );
			var maxChoices = this.model.get( 'limit_choices_max' );
			var numChoices = this.model.get( 'options' ).filter( function( option ) {
				return ! option.get( 'is_heading' );
			} ).length;

			var clamp = function( v, min, max ) {
				return Math.min( Math.max( v, min ), max );
			};

			minChoices = clamp( minChoices, numChoices > 1 ? 2 : 1, minChoices );
			minChoices = clamp( minChoices, minChoices, numChoices );
			maxChoices = clamp( maxChoices, minChoices, numChoices );

			this.model.set( 'limit_choices_min', minChoices );
			this.model.set( 'limit_choices_max', maxChoices );

			var $limitMinChoice = $( '[data-trigger="limit_choices_min"]', this.$el );
			var $limitMaxChoice = $( '[data-trigger="limit_choices_max"]', this.$el );

			$limitMinChoice.val( minChoices );
			$limitMaxChoice.val( maxChoices );
		},
	} );

} ) ( jQuery, _, Backbone, wp.customize, _happyFormsSettings );
