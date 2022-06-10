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

	var OptionModel = Backbone.Model.extend( {
		defaults: {
			is_default: false,
			label: '',
			description: '',
			is_heading: false,
		},
	} );

	var OptionCollection = Backbone.Collection.extend( {
		model: OptionModel,
	} );

	happyForms.classes.views.parts.checkboxOptionHeading = Backbone.View.extend( {
		template: '#customize-happyforms-checkbox-item-heading-template',

		events: {
			'click .delete-heading': 'onDeleteHeadingClick',
			'keyup [name=label]': 'onHeadingLabelChange',
			'change [name=label]': 'onHeadingLabelChange',
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

		onDeleteHeadingClick: function( e ) {
			e.preventDefault();

			this.model.collection.remove( this.model );
		},

		onHeadingLabelChange: function( e ) {
			this.model.set( 'label', $( e.target ).val() );
			this.part.trigger( 'change' );

			var data = {
				id: this.part.get( 'id' ),
				callback: 'onCheckboxHeadingLabelChangeCallback',
				options: {
					itemID: this.model.get( 'id' ),
				}
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},
	} );

	happyForms.classes.views.parts.checkboxOption = Backbone.View.extend( {
		template: '#customize-happyforms-checkbox-item-template',

		events: {
			'click .advanced-option': 'onAdvancedOptionClick',
			'click .delete-option': 'onDeleteOptionClick',
			'keyup [name=label]': 'onItemLabelChange',
			'change [name=label]': 'onItemLabelChange',
			'keyup [name=description]': 'onItemDescriptionChange',
			'change [name=is_default]': 'onItemDefaultChange',

			'keyup [name=limit_submissions_amount]': 'onItemLimitSubmissionsAmountChange',
			'change [name=limit_submissions_amount]': 'onItemLimitSubmissionsAmountChange',
		},

		initialize: function( options ) {
			this.template = _.template( $( this.template ).text() );
			this.part = options.part;

			this.listenTo( this.model, 'change:limit_submissions_amount', this.onChangeMaxSubmissionsAmount );
			this.listenTo( this, 'ready', this.onReady );
		},

		onChangeMaxSubmissionsAmount: function( e ) {
			var model = this.part;

			if ( '' == this.model.get('limit_submissions_amount') ) {
				return;
			}

			this.part.fetchHtml( function( response ) {
				var data = {
					id: model.get( 'id' ),
					html: response,
				};

				happyForms.previewSend( 'happyforms-form-part-refresh', data );

			} );
		},

		onItemLimitSubmissionsAmountChange: function( e ) {
			var value = $( '[name="limit_submissions_amount"]', this.$el ).val();

			if ( 0 > value ) {
				$( '[name="limit_submissions_amount"]', this.$el ).val( '' );
				return;
			}

			this.model.set( 'limit_submissions_amount', $( e.target ).val() );
			this.part.trigger( 'change' );
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

			var data = {
				id: this.part.get( 'id' ),
				callback: 'onCheckboxItemLabelChangeCallback',
				options: {
					itemID: this.model.get( 'id' ),
				}
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},

		onItemDescriptionChange: function( e ) {
			this.model.set( 'description', $( e.target ).val() );
			this.part.trigger( 'change' );

			if ( '' == this.model.previousAttributes().description || '' ==  this.model.get( 'description' ) ) {
				var self = this;
				this.part.fetchHtml( function( response ) {
					var data = {
						id: self.part.get( 'id' ),
						html: response,
					};

					happyForms.previewSend( 'happyforms-form-part-refresh', data );
				} );
			} else {

				var data = {
					id: this.part.get( 'id' ),
					callback: 'onCheckboxItemDescriptionChangeCallback',
					options: {
						itemID: this.model.get( 'id' ),
					}
				};

				happyForms.previewSend( 'happyforms-part-dom-update', data );
			}
		},

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
				callback: 'onCheckboxItemDefaultChangeCallback',
				options: {
					itemID: this.model.get( 'id' ),
				}
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},
	} );

	happyForms.classes.views.parts.checkbox = happyForms.classes.views.Part.extend( {
		template: '#customize-happyforms-checkbox-template',

		events: _.extend( {}, happyForms.classes.views.Part.prototype.events, {
			'click .add-option': 'onAddOptionClick',
			'click .add-heading': 'onAddHeadingClick',
			'click .import-option': 'onImportOptionClick',
			'click .import-options': 'onImportOptionsClick',
			'click .add-options': 'onAddOptionsClick',
			'change [data-bind=display_type]': 'onDisplayTypeChange',

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
				callback: 'onCheckboxItemDeleteCallback',
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

		onOptionsChange: function() {
			this.model.trigger( 'change' );
		},

		addOptionView: function( optionModel, options ) {
			var optionView = null;
			var optionAttributes = optionModel.attributes;
			var isHeading = 'undefined' !== typeof optionAttributes.is_heading && 1 == optionAttributes.is_heading;

			if ( isHeading ) {
				optionView = new happyForms.classes.views.parts.checkboxOptionHeading( _.extend( {
					model: optionModel,
					part: this.model,
				}, options ) );
			} else {
				optionView = new happyForms.classes.views.parts.checkboxOption( _.extend( {
					model: optionModel,
					part: this.model,
				}, options ) );
			}

			var optionViewModel = new Backbone.Model( {
				id: optionModel.id,
				view: optionView,
			} );

			this.optionViews.add( optionViewModel, options );
		},

		onOptionViewAdd: function( viewModel, collection, options ) {
			var optionView = viewModel.get( 'view' );
			$( '.options ul', this.$el ).append( optionView.render().$el );
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
			var timestamp = new Date().getTime();
			var id = prefix + timestamp;

			return id;
		},

		onAddOptionClick: function( e ) {
			e.preventDefault();

			var itemID = this.getOptionModelID();
			var itemModel = new OptionModel( { id: itemID } );
			this.model.get( 'options' ).add( itemModel );
		},

		onAddHeadingClick: function( e ) {
			e.preventDefault();

			var itemID = this.getOptionModelID();
			var itemModel = new OptionModel( { id: itemID, is_heading: 1 } );
			this.model.get( 'options' ).add( itemModel );
		},

		onDisplayTypeChange: function(e) {
			var $input = $( e.target );
			var attribute = $input.data( 'bind' );
			var value = $input.val();

			this.model.set( attribute, $input.val() );

			var data = {
				id: this.model.get( 'id' ),
				callback: 'onCheckboxDisplayTypeChangeCallback',
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
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
			var data = {
				id: this.model.get( 'id' ),
				callback: 'onCheckboxOtherOptionLabelChangeCallback'
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},

		onOtherOptionPlaceholderChange: function( model, value ) {
			var data = {
				id: this.model.get( 'id' ),
				callback: 'onCheckboxOtherOptionPlaceholderChangeCallback'
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
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
		},
	} );

	happyForms.previewer = _.extend( happyForms.previewer, {
		onCheckboxDisplayTypeChangeCallback: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );

			if ( 'block' === part.get( 'display_type' ) ) {
				$part.addClass( 'display-type--block' );
			} else {
				$part.removeClass( 'display-type--block' );
			}
		},

		onCheckboxItemLabelChangeCallback: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var option = part.get( 'options' ).get( options.itemID );
			var $option = $( '#' + options.itemID, $part );

			this.$( 'span.label', $option ).text( option.get( 'label' ) );
		},

		onCheckboxItemDefaultChangeCallback: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var option = part.get( 'options' ).get( options.itemID );
			var $option = $( '#' + options.itemID, $part );

			this.$( 'input', $option ).prop( 'checked', option.get( 'is_default' ) );
		},

		onCheckboxItemDescriptionChangeCallback: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var option = part.get( 'options' ).get( options.itemID );
			var $option = $( '#' + options.itemID, $part );

			this.$( '.happyforms-part-option__description', $option ).text( option.get( 'description' ) );
		},

		onCheckboxItemDeleteCallback: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var $option = $( '#' + options.itemID, $part );

			$option.remove();
		},

		onCheckboxOtherOptionLabelChangeCallback: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var $otherOptionLabel = $( '.happyforms-part-option--other .label', $part );

			$otherOptionLabel.text( part.get( 'other_option_label' ) );
		},

		onCheckboxOtherOptionPlaceholderChangeCallback: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var $otherOptionInput = $( '.happyforms-part-option--other input[type=text]', $part );

			$otherOptionInput.attr( 'placeholder', part.get( 'other_option_placeholder' ) );
		},

		onCheckboxHeadingLabelChangeCallback: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var option = part.get( 'options' ).get( options.itemID );
			var $option = $( '#' + options.itemID, $part );

			this.$( 'label.heading-label', $option ).text( option.get( 'label' ) );
		},

	} );

} ) ( jQuery, _, Backbone, wp.customize, _happyFormsSettings );
