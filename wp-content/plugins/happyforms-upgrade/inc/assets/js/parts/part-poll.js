( function( $, _, Backbone, api, settings ) {

	happyForms.classes.models.parts.poll = happyForms.classes.models.Part.extend( {
		defaults: function() {
			return _.extend(
				{},
				settings.formParts.poll.defaults,
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

	var OptionModel = Backbone.Model.extend( {
		defaults: {
			label: '',
			description: '',
		},
	} );

	var OptionCollection = Backbone.Collection.extend( {
		model: OptionModel,
	} );

	var OptionItemView = happyForms.classes.views.OptionItem.extend( {
		template: '#customize-happyforms-poll-item-template',
	} );

	happyForms.classes.views.parts.poll = happyForms.classes.views.ChoiceField.extend( {
		template: '#customize-happyforms-poll-template',

		events: _.extend( {}, happyForms.classes.views.ChoiceField.prototype.events, {
			'change [data-bind=limit_choices_min]': 'refreshMinMaxChoices',
			'change [data-bind=limit_choices_max]': 'refreshMinMaxChoices',
		} ),

		initialize: function() {
			happyForms.classes.views.ChoiceField.prototype.initialize.apply( this, arguments );

			this.listenTo( this.model, 'change:allow_multiple', this.onAllowMultipleChange );
			this.listenTo( this.model, 'change:show_results_before_voting', this.onShowResultsBeforeVotingChange );
			this.listenTo( this.model, 'change:show_results_label', this.onShowResultsLabelChange );
			this.listenTo( this.model, 'change:back_to_poll_label', this.onBackToPollLabelChange );
			this.listenTo( this.model, 'change:limit_choices', this.onLimitChoices );
			this.listenTo( this.model.get( 'options' ), 'add remove', this.refreshMinMaxChoices );
		},

		onAddOptionClick: function( e ) {
			e.preventDefault();

			var itemID = this.getOptionModelID();
			var itemModel = new OptionModel( { id: itemID } );
			this.model.get( 'options' ).add( itemModel );
			this.model.get( 'options' ).findWhere( { id: itemID } ).trigger( 'open-widget' );
		},

		addOptionItemView: function( optionModel, options ) {
			var optionView = new OptionItemView( _.extend( {
				model: optionModel,
				part: this.model,
			}, options ) );

			var optionViewModel = new Backbone.Model( {
				id: optionModel.id,
				view: optionView,
			} );

			this.optionViews.add( optionViewModel, options );
		},

		onAllowMultipleChange: function( model, value ) {
			if ( 1 == value ) {
				$( '.happyforms-poll-limit-choices-wrap', this.$el ).show();
			} else {
				$( '[data-bind=limit_choices]', this.$el ).prop( 'checked', false );
				this.model.set( 'limit_choices', 0 );
				$( '.happyforms-poll-limit-choices-wrap', this.$el ).hide();
			}

			this.refreshPart();
		},

		onShowResultsBeforeVotingChange: function( model, value ) {
			var $showResultsOptions = $( '.happyforms-nested-settings[data-trigger="show_results_before_voting"]', this.$el );

			if ( 1 == value ) {
				$showResultsOptions.show();
			} else {
				$showResultsOptions.hide();
			}

			this.refreshPart();
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
			var numChoices = this.model.get( 'options' ).length;

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
		}
	} );

} ) ( jQuery, _, Backbone, wp.customize, _happyFormsSettings );
