( function( $, _, Backbone, api, settings ) {

	happyForms.classes.models.Option = Backbone.Model.extend( {
		defaults: {
			type: 'option',
		}
	} );

	happyForms.classes.views.Option = Backbone.View.extend( {
		events: {
			'click .happyforms-delete-item': 'onDeleteClick',
			'click .happyforms-duplicate-item': 'onDuplicateClick',
			'click .happyforms-advanced-option-action': 'onAdvancedOptionClick',
		},

		initialize: function( options ) {
			this.template = _.template( $( this.template ).text() );
			this.part = options.part;
			this.listenTo( this, 'ready', this.onReady );
			this.listenTo( this.model, 'open-widget', this.onAddOpenWidget );
		},

		onReady: function() {
			// noop
		},

		render: function() {
			this.setElement( this.template( this.model.toJSON() ) );

			return this;
		},

		onDuplicateClick: function( e ) {
			e.preventDefault();

			this.$el.trigger( 'item-duplicate', this.model );
		},

		closeOpenWidgets: function( $currentElement ) {
			var $openWidgets = $( '.happyforms-choice-item-widget').not( $currentElement );

			$openWidgets.removeClass( 'happyforms-widget-choice-expanded' );
			$openWidgets.find( '.happyforms-part-item-advanced' ).slideUp( 200, function() {
				var $toggleIndicator = $openWidgets.find( '.toggle-indicator' );
				$toggleIndicator.removeClass( 'opened' );
			} );

			this.$el.trigger( 'close-bulk-options', this.model );
		},

		onAddOpenWidget: function( e ) {
			var $el = this.$el;

			$el.toggleClass( 'happyforms-widget-choice-expanded' );
			this.closeOpenWidgets( $el );

			$( '.happyforms-part-item-advanced', this.$el ).slideToggle( 200, function() {
				if ( $el.hasClass( 'happyforms-widget-choice-expanded' ) ) {
					$( 'input[data-option-attribute=label]', $el ).trigger( 'focus' );
				}
			} );

			$( '.toggle-indicator', $el ).toggleClass( 'opened' );
		},

		onAdvancedOptionClick: function( e ) {
			e.preventDefault();

			var $el = this.$el;
			$el.toggleClass( 'happyforms-widget-choice-expanded' );
			this.closeOpenWidgets( $el );

			$( '.happyforms-part-item-advanced', this.$el ).slideToggle( 200, function() {
				if ( $el.hasClass( 'happyforms-widget-choice-expanded' ) ) {
					$( 'input[data-option-attribute=label]', $el ).trigger( 'focus' );
				}
			} );

			$( '.toggle-indicator', $el ).toggleClass( 'opened' );
		},

		onDeleteClick: function( e ) {
			e.preventDefault();

			var self = this;

			$( '.happyforms-part-item-advanced', this.$el ).slideUp( 'fast', function() {
				self.model.collection.remove( self.model );
			} );

		},
	} );

	happyForms.classes.views.OptionHeading = happyForms.classes.views.Option.extend( {
		events: _.extend( {}, happyForms.classes.views.Option.prototype.events, {
			'keyup [name=label]': 'onLabelChange',
			'change [name=label]': 'onLabelChange',
		} ),

		onReady: function() {
			$( '.in-widget-title[name=label]', this.$el ).trigger( 'focus' );
		},

		onLabelChange: function( e ) {
			var label = $( e.target ).val();
			this.model.set( 'label', label );
			this.part.trigger( 'change', this.part, {} );
			$('.happyforms-item-choice-widget-title h3 .choice-in-widget-title span', this.$el ).text( label );

			var data = {
				id: this.part.get( 'id' ),
				callback: 'onOptionHeadingLabelChangeCallback',
				options: {
					itemID: this.model.get( 'id' ),
				}
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},
	} );

	happyForms.classes.views.OptionItem = happyForms.classes.views.Option.extend( {
		events: _.extend( {}, happyForms.classes.views.Option.prototype.events, {
			'keyup [name=label]': 'onItemLabelChange',
			'change [name=label]': 'onItemLabelChange',
			'keyup [name=description]': 'onItemDescriptionChange',
			'change [name=is_default]': 'onItemDefaultChange',
			'keyup [name=limit_submissions_amount]': 'onItemLimitSubmissionsAmountChange',
			'change [name=limit_submissions_amount]': 'onItemLimitSubmissionsAmountChange',
		} ),

		initialize: function( options ) {
			happyForms.classes.views.Option.prototype.initialize.apply( this, arguments );

			this.listenTo( this.model, 'change:limit_submissions_amount', this.onChangeMaxSubmissionsAmount );
		},

		onReady: function() {
			$( '.in-widget-title[name=label]', this.$el ).trigger( 'focus' );
		},

		onItemLabelChange: function( e ) {
			var label = $( e.target ).val();
			this.model.set( 'label', label );
			this.part.trigger( 'change', this.part, {} );
			$('.happyforms-item-choice-widget-title h3 .choice-in-widget-title span', this.$el ).text( label );

			var data = {
				id: this.part.get( 'id' ),
				callback: 'onOptionLabelChangeCallback',
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
					callback: 'onOptionDescriptionChangeCallback',
					options: {
						itemID: this.model.get( 'id' ),
					}
				};

				happyForms.previewSend( 'happyforms-part-dom-update', data );
			}
		},

		onItemDefaultChange: function( e ) {
			var isChecked = $( e.target ).is( ':checked' );

			this.model.collection.forEach( function( item ) {
				item.set( 'is_default', 0 );
			} );

			$( '[name=is_default]', this.$el.siblings() ).prop( 'checked', false );

			if ( isChecked ) {
				this.model.set( 'is_default', 1 );
				$( e.target ).prop( 'checked', true );
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

		onChangeMaxSubmissionsAmount: function( e ) {
			var model = this.part;

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

	} );

	happyForms.classes.views.ChoiceField = happyForms.classes.views.Part.extend( {
		events: _.extend( {}, happyForms.classes.views.Part.prototype.events, {
			'click .add-option': 'onAddOptionClick',
			'click .add-heading': 'onAddHeadingClick',
			'click .bulk-options': 'onAddBulkChoiceClick',
			'click .add-import-options': 'onAddBulkChoices',
			'keyup .option-import-area': 'onBulkTextChange',
			'input .option-import-area': 'onBulkTextChange',
			'click .cancel-import-options': 'closeBulkOpions',
			'item-duplicate': 'onOptionDuplicate',
			'close-bulk-options': 'closeBulkOpions',
			'change [data-bind=display_type]': 'onDisplayTypeChange',
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
		},

		onReady: function() {
			this.model.get( 'options' ).each( function( optionModel ) {
				this.addOptionItemView( optionModel );
			}, this );

			$( '.option-list', this.$el ).sortable( {
				handle: '.happyforms-part-item-handle',
				helper: 'clone',

				stop: function ( e, ui ) {
					this.trigger( 'sort-stop', e, ui );
				}.bind( this ),
			} );
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
			var modelClass = this.model.get( 'options' ).model;
			var itemModel = new modelClass( { id: itemID } );
			this.model.get( 'options' ).add( itemModel );
			this.model.get( 'options' ).findWhere( { id: itemID } ).trigger( 'open-widget' );
		},

		onAddHeadingClick: function( e ) {
			e.preventDefault();

			var itemID = this.getOptionModelID();
			var modelClass = this.model.get( 'options' ).model;
			var itemModel = new modelClass( { id: itemID, is_heading: 1 } );
			this.model.get( 'options' ).add( itemModel );
			this.model.get( 'options' ).findWhere( { id: itemID } ).trigger( 'open-widget' );
		},

		onAddBulkChoiceClick: function( e ) {
			e.preventDefault();

			this.closeAllItemWidget();

			if ( 0 == this.model.get( 'options' ).length ) {
				$( '.options', this.$el ).hide();
			}

			$( '.options-import', this.$el ).show();
			$( '.links.mode-manual', this.$el ).hide();
			$( '.links.mode-import', this.$el ).show();
			$( '.option-import-area', this.$el ).trigger( 'focus' );
			$( '.add-import-options', this.$el ).attr( 'disabled', 'disabled' );
		},

		onAddBulkChoices: function( e ) {
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
						var modelClass = self.model.get( 'options' ).model;
						var item = new modelClass( {
							id: itemID,
							label: label
						} );

						self.model.get( 'options' ).add( item, { refresh: ( list.length - 1 === i ) } );
					}, i );
				} );

			$textarea.val( '' );
			$( '.cancel-import-options', this.$el ).trigger( 'click' );
		},

		onBulkTextChange: function( e ) {
			var val = $( e.target ).val();
			var $addBulkButton = $( '.add-import-options', this.$el );

			var disabled = '' === val;

			if ( disabled ) {
				$addBulkButton.attr( 'disabled', 'disabled' );
			} else {
				$addBulkButton.removeAttr('disabled')
			}
		},

		closeBulkOpions: function( e ) {
			e.preventDefault();

			$( '.options', this.$el ).show();
			$( '.options-import', this.$el ).hide();
			$( '.links.mode-import', this.$el ).hide();
			$( '.links.mode-manual', this.$el ).show();
			$( '.option-import-area', this.$el ).val( '' );
		},

		onOptionDuplicate: function( e, fieldChoice ) {
			e.preventDefault();
			
			var attrs = fieldChoice.toJSON();
			var index = this.model.get( 'options' ).indexOf( fieldChoice );
			index = index + 1;
			attrs.id = this.getOptionModelID();
			var modelClass = this.model.get( 'options' ).model;
			var clonedModel = new modelClass( attrs );
			this.model.get( 'options' ).add( clonedModel, { 
				at: index,
				duplicateOf: fieldChoice,
			} );
			this.model.get( 'options' ).findWhere( { id: attrs.id } ).trigger( 'open-widget' );
		},

		onDisplayTypeChange: function(e) {
			var $input = $( e.target );
			var attribute = $input.data( 'bind' );
			var value = $input.val();

			this.model.set( attribute, value );

			var data = {
				id: this.model.get( 'id' ),
				callback: 'onChoiceFieldDisplayTypeChangeCallback',
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},

		onOptionModelAdd: function( optionModel, optionsCollection, options ) {
			this.model.trigger( 'change', this.model, {} );
			this.addOptionItemView( optionModel, options );

			var model = this.model;

			if ( options.refresh !== false ) {
				this.model.fetchHtml( function( response ) {
					var data = {
						id: model.get( 'id' ),
						html: response,
						callback: 'onOptionAddCallback',
					};

					happyForms.previewSend( 'happyforms-form-part-refresh', data );
				} );
			}
		},

		onOptionModelChange: function( optionModel ) {
			this.model.trigger( 'change', this.model, {} );
		},

		onOptionModelRemove: function( optionModel ) {
			this.model.trigger( 'change', this.model, {} );

			var optionViewModel = this.optionViews.find( function( viewModel ) {
				return viewModel.get( 'view' ).model.id === optionModel.id;
			}, this );

			this.optionViews.remove( optionViewModel );

			if ( this.model.get( 'options' ).length == 0 ) {
				$( '.options ul', this.$el ).html( '' );
			}

			var data = {
				id: this.model.get( 'id' ),
				callback: 'onOptionDeleteCallback',
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

		addOptionItemView: function( optionModel, options ) {
			var optionView = null;
			var optionAttributes = optionModel.attributes;
			var isHeading = 'undefined' !== typeof optionAttributes.is_heading && 1 == optionAttributes.is_heading;
			var optionView = (
				isHeading ?
				this.getOptionHeadingView( optionModel ) :
				this.getOptionItemView( optionModel )
			);
			var optionViewModel = new Backbone.Model( {
				id: optionModel.id,
				view: optionView,
			} );

			this.optionViews.add( optionViewModel, options );
		},

		getOptionItemView: function( optionModel, options ) {
			var view = new happyForms.classes.views.OptionItem( _.extend( {
				model: optionModel,
				part: this.model,
			}, options ) );

			return view;
		},

		getOptionHeadingView: function( optionModel, options ) {
			var view = new happyForms.classes.views.OptionHeading( _.extend( {
				model: optionModel,
				part: this.model,
			}, options ) );

			return view;
		},

		onOptionViewAdd: function( viewModel, collection, options ) {
			var optionView = viewModel.get( 'view' );

			if ( 'undefined' === typeof( options.index ) ) {
				$( '.option-list', this.$el ).append( optionView.render().$el );
			} else if ( 0 === options.index ) {
				$( '.option-list', this.$el ).prepend( optionView.render().$el );
			} else {
				$( '.happyforms-choice-item-widget:nth-child(' + options.index + ')', this.$el ).after( optionView.render().$el );
			}

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

		onAddOtherOption: function( model, value ) {
			var $otherOptionOptions = $( '.happyforms-nested-settings[data-trigger="other_option"]', this.$el );

			if ( 1 == value ) {
				$otherOptionOptions.show();
			} else {
				$otherOptionOptions.hide();
			}

			this.refreshPart();
		},

		onOtherOptionLabelChange: function() {
			var data = {
				id: this.model.get( 'id' ),
				callback: 'onOtherOptionLabelChangeCallback'
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},

		onOtherOptionPlaceholderChange: function() {
			var data = {
				id: this.model.get( 'id' ),
				callback: 'onOtherOptionPlaceholderChangeCallback'
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},

		closeAllItemWidget: function() {
			var $openWidgets = $( '.happyforms-choice-item-widget', this.$el );

			$openWidgets.removeClass( 'happyforms-widget-choice-expanded' );
			$openWidgets.find( '.happyforms-part-item-advanced' ).slideUp( 200, function() {
				var $toggleIndicator = $openWidgets.find( '.toggle-indicator' );
				$toggleIndicator.removeClass( 'opened' );
			} );
		},

	} );

	happyForms.previewer = _.extend( happyForms.previewer, {
		onOptionAddCallback: function() {
			// noop
		},

		onOptionDeleteCallback: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var $option = $( '#' + options.itemID, $part );

			$option.remove();
		},

		onOptionLabelChangeCallback: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var option = part.get( 'options' ).get( options.itemID );
			var $option = $( '#' + options.itemID, $part );

			this.$( 'span.label', $option ).text( option.get( 'label' ) );
		},

		onOptionDescriptionChangeCallback: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var option = part.get( 'options' ).get( options.itemID );
			var $option = $( '#' + options.itemID, $part );

			this.$( '.happyforms-part-option__description', $option ).text( option.get( 'description' ) );
		},

		onOptionDefaultChangeCallback: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var option = part.get( 'options' ).get( options.itemID );
			var $option = $( '#' + options.itemID, $part );

			this.$( 'input', $option ).prop( 'checked', option.get( 'is_default' ) );
		},

		onOtherOptionLabelChangeCallback: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var $otherOptionLabel = $( '.happyforms-part-option--other .label', $part );

			$otherOptionLabel.text( part.get( 'other_option_label' ) );
		},

		onOtherOptionPlaceholderChangeCallback: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var $otherOptionInput = $( '.happyforms-part-option--other input[type=text]', $part );

			$otherOptionInput.attr( 'placeholder', part.get( 'other_option_placeholder' ) );
		},

		onOptionHeadingLabelChangeCallback: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var option = part.get( 'options' ).get( options.itemID );
			var $option = $( '#' + options.itemID, $part );

			this.$( 'label.heading-label', $option ).text( option.get( 'label' ) );
		},

		onChoiceFieldDisplayTypeChangeCallback: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );

			if ( 'block' === part.get( 'display_type' ) ) {
				$part.addClass( 'display-type--block' );
			} else {
				$part.removeClass( 'display-type--block' );
			}
		},
	} );

} ) ( jQuery, _, Backbone, wp.customize, _happyFormsSettings );
