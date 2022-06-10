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

	var OptionView = Backbone.View.extend( {
		template: '#customize-happyforms-poll-item-template',

		events: {
			'click .advanced-option': 'onAdvancedOptionClick',
			'click .delete-option': 'onDeleteOptionClick',
			'keyup [name=label]': 'onItemLabelChange',
			'change [name=label]': 'onItemLabelChange',
			'keyup [name=description]': 'onItemDescriptionChange',
		},

		initialize: function( options ) {
			this.template = _.template( $( this.template ).text() );
			this.part = options.part;

			this.listenTo( this, 'ready', this.onReady );
		},

		render: function() {
			this.setElement( this.template( this.model.toJSON() ) );
			return this;
		},

		onReady: function() {
			$( '[name=label]', this.$el ).trigger( 'focus' );
		},

		onAdvancedOptionClick: function( e ) {
			e.preventDefault();

			$( '.happyforms-part-item-advanced', this.$el ).slideToggle( 300, function() {
				$( e.target ).toggleClass( 'opened' );
			} );
		},

		onDeleteOptionClick: function( e ) {
			e.preventDefault();
			this.model.collection.remove( this.model );
		},

		onItemLabelChange: function( e ) {
			this.model.set( 'label', $( e.target ).val() );
			this.part.trigger( 'change' );

			var callback = 'onRadioItemLabelChangeCallback';

			if ( 1 == this.part.get( 'allow_multiple' ) ) {
				callback = 'onCheckboxItemLabelChangeCallback';
			}

			var data = {
				id: this.part.get( 'id' ),
				callback: callback,
				options: {
					itemID: this.model.get( 'id' ),
				}
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},

		onItemDescriptionChange: function( e ) {
			this.model.set( 'description', $( e.target ).val() );
			this.part.trigger( 'change' );

			var callback = 'onRadioItemDescriptionChangeCallback';

			if ( 1 == this.part.get( 'allow_multiple' ) ) {
				callback = 'onCheckboxItemDescriptionChangeCallback';
			}

			var data = {
				id: this.part.get( 'id' ),
				callback: callback,
				options: {
					itemID: this.model.get( 'id' ),
				}
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},
	} );

	happyForms.classes.views.parts.poll = happyForms.classes.views.Part.extend( {
		template: '#customize-happyforms-poll-template',

		events: _.extend( {}, happyForms.classes.views.Part.prototype.events, {
			'click .add-option': 'onAddOptionClick',
			'click .import-option': 'onImportOptionClick',
			'click .import-options': 'onImportOptionsClick',
			'click .add-options': 'onAddOptionsClick',
			'change [data-bind=limit_choices_min]': 'refreshMinMaxChoices',
			'change [data-bind=limit_choices_max]': 'refreshMinMaxChoices',
		} ),

		initialize: function() {
			happyForms.classes.views.Part.prototype.initialize.apply( this, arguments );

			this.optionViews = new Backbone.Collection();

			this.listenTo( this.model.get( 'options' ), 'add', this.onOptionModelAdd );
			this.listenTo( this.model.get( 'options' ), 'change', this.onOptionModelChange );
			this.listenTo( this.model.get( 'options' ), 'remove', this.onOptionModelRemove );
			this.listenTo( this.model.get( 'options' ), 'reset', this.onOptionModelsSorted );
			this.listenTo( this.optionViews, 'add', this.onOptionViewAdd );
			this.listenTo( this.optionViews, 'remove', this.onOptionViewRemove );
			this.listenTo( this.optionViews, 'reset', this.onOptionViewsSorted );
			this.listenTo( this, 'sort-stop', this.onOptionSortStop );
			this.listenTo( this, 'ready', this.onReady );

			this.listenTo( this.model, 'change:other_option', this.onAddOtherOption );
			this.listenTo( this.model, 'change:other_option_label', this.onOtherOptionLabelChange );
			this.listenTo( this.model, 'change:other_option_placeholder', this.onOtherOptionPlaceholderChange );
			this.listenTo( this.model, 'change:allow_multiple', this.onAllowMultipleChange );
			this.listenTo( this.model, 'change:show_results_before_voting', this.onShowResultsBeforeVotingChange );
			this.listenTo( this.model, 'change:show_results_label', this.onShowResultsLabelChange );
			this.listenTo( this.model, 'change:back_to_poll_label', this.onBackToPollLabelChange );
			this.listenTo( this.model, 'change:limit_choices', this.onLimitChoices );
			this.listenTo( this.model.get( 'options' ), 'add remove', this.refreshMinMaxChoices );
		},

		onReady: function() {
			this.model.get( 'options' ).each( function( optionModel ) {
				this.addOptionView( optionModel );
			}, this );

			$( '.option-list', this.$el ).sortable( {
				handle: '.happyforms-part-item-handle',
				helper: 'clone',

				stop: function ( e, ui ) {
					this.trigger( 'sort-stop', e, ui );
				}.bind( this ),
			} );
		},

		onOptionModelAdd: function( optionModel, optionsCollection, options ) {
			this.model.trigger( 'change' );
			this.addOptionView( optionModel, options );

			var model = this.model;

			if ( options.refresh !== false ) {
				this.model.fetchHtml( function( response ) {
					var data = {
						id: model.get( 'id' ),
						html: response,
					};

					happyForms.previewSend( 'happyforms-form-part-refresh', data );
				} );
			}
		},

		onOptionModelChange: function( optionModel ) {
			this.model.trigger( 'change' );
		},

		onOptionModelRemove: function( optionModel ) {
			this.model.trigger( 'change' );

			var optionViewModel = this.optionViews.find( function( viewModel ) {
				return viewModel.get( 'view' ).model.id === optionModel.id;
			}, this );

			this.optionViews.remove( optionViewModel );

			if ( this.model.get( 'options' ).length == 0 ) {
				$( '.options ul', this.$el ).html( '' );
			}

			var data = {
				id: this.model.get( 'id' ),
				callback: 'onRadioItemDeleteCallback',
				options: {
					itemID: optionModel.id,
				}
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},

		onOptionModelsSorted: function() {
			this.optionViews.reset( _.map( this.model.get( 'options' ).pluck( 'id' ), function( id ) {
				return this.optionViews.get( id );
			}, this ) );
			this.model.trigger( 'change' );

			var model = this.model;

			this.model.fetchHtml( function( response ) {
				var data = {
					id: model.get( 'id' ),
					html: response,
				};

				happyForms.previewSend( 'happyforms-form-part-refresh', data );
			} );
		},

		addOptionView: function( optionModel, options ) {
			var optionView = new OptionView( _.extend( {
				model: optionModel,
				part: this.model,
			}, options ) );

			var optionViewModel = new Backbone.Model( {
				id: optionModel.id,
				view: optionView,
			} );

			this.optionViews.add( optionViewModel, options );
		},

		onOptionViewAdd: function( viewModel, collection, options ) {
			var optionView = viewModel.get( 'view' );
			$( '.option-list', this.$el ).append( optionView.render().$el );
			optionView.trigger( 'ready' );
		},

		onOptionViewRemove: function( viewModel ) {
			var optionView = viewModel.get( 'view' );
			optionView.remove();
		},

		onOptionSortStop: function( e, ui ) {
			var $sortable = $( '.option-list', this.$el );
			var ids = $sortable.sortable( 'toArray', { attribute: 'data-option-id' } );

			this.model.get( 'options' ).reset( _.map( ids, function( id ) {
				return this.model.get( 'options' ).get( id );
			}, this ) );
		},

		onOptionViewsSorted: function( optionViews ) {
			var $stage = $( '.option-list', this.$el );

			optionViews.forEach( function( optionViewModel ) {
				var optionView = optionViewModel.get( 'view' );
				var $optionViewEl = optionView.$el;
				$optionViewEl.detach();
				$stage.append( $optionViewEl );
				optionView.trigger( 'refresh' );
			}, this );
		},

		getOptionModelID: function() {
			var prefix = this.model.get( 'id' ) + '_option_';
			var collection = this.model.get( 'options' );
			var id = happyForms.utils.uniqueId( prefix, collection );

			return id;
		},

		onAddOptionClick: function( e ) {
			e.preventDefault();

			var itemID = this.getOptionModelID();
			var itemModel = new OptionModel( { id: itemID } );
			this.model.get( 'options' ).add( itemModel );
		},

		onImportOptionsClick: function( e ) {
			e.preventDefault();

			$( '.options', this.$el ).hide();
			$( '.options-import', this.$el ).show();
			$( '.links.mode-manual', this.$el ).hide();
			$( '.links.mode-import', this.$el ).show();
			$( '.option-import-area', this.$el ).trigger( 'focus' );
		},

		onAddOptionsClick: function( e ) {
			e.preventDefault();

			$( '.options', this.$el ).show();
			$( '.options-import', this.$el ).hide();
			$( '.links.mode-import', this.$el ).hide();
			$( '.links.mode-manual', this.$el ).show();
			$( '.option-import-area', this.$el ).val( '' );
		},

		onImportOptionClick: function( e ) {
			e.preventDefault();

			var $textarea = $( '.option-import-area', this.$el );
			var list = $textarea.val();
			var self = this;

			var models = list
				.split( /[\r\n]+/g )
				.map( function( s ) {
					return s.trim();
				} )
				.filter( function( s ) {
					return s;
				} )
				.forEach( function( label, i, list ) {
					_.delay( function() {
						var itemID = self.getOptionModelID();
						var item = new OptionModel( {
							id: itemID,
							label: label
						} );

						self.model.get( 'options' ).add( item, { refresh: ( list.length - 1 === i ) } );
					}, i );
				} );

			$textarea.val( '' );
			$( '.add-options', this.$el ).trigger( 'click' );
		},

		onAddOtherOption: function( model, value ) {
			var $otherOptionOptions = $( '.happyforms-nested-settings[data-trigger="other_option"]', this.$el );

			if ( 1 == value ) {
				$otherOptionOptions.show();
			} else {
				$otherOptionOptions.hide();
			}

			this.refreshPart();
		},

		onOtherOptionLabelChange: function( model, value ) {
			var callback = 'onRadioOtherOptionLabelChangeCallback';

			if ( 1 == model.get( 'allow_multiple' ) ) {
				callback = 'onCheckboxOtherOptionLabelChangeCallback';
			}

			var data = {
				id: this.model.get( 'id' ),
				callback: callback
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},

		onOtherOptionPlaceholderChange: function( model, value ) {
			var callback = 'onRadioOtherOptionPlaceholderChangeCallback';

			if ( 1 == model.get( 'allow_multiple' ) ) {
				callback = 'onCheckboxOtherOptionPlaceholderChangeCallback';
			}

			var data = {
				id: this.model.get( 'id' ),
				callback: callback
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
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

	happyForms.previewer = _.extend( happyForms.previewer, {

	} );

} ) ( jQuery, _, Backbone, wp.customize, _happyFormsSettings );
