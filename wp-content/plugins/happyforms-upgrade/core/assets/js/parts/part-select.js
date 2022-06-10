( function( $, _, Backbone, api, settings ) {

	happyForms.classes.models.parts.select = happyForms.classes.models.Part.extend( {
		defaults: function() {
			return _.extend(
				{},
				settings.formParts.select.defaults,
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
			is_heading: false,
		},
	} );

	var OptionCollection = Backbone.Collection.extend( {
		model: OptionModel,
	} );

	happyForms.classes.views.parts.selectOptionHeading = Backbone.View.extend( {
		template: '#customize-happyforms-select-item-heading-template',

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
			var self = this;

			this.part.fetchHtml( function( response ) {
				var data = {
					id: self.part.id,
					html: response,
				};

				happyForms.previewSend( 'happyforms-form-part-refresh', data );
			} );
		},
	} );

	happyForms.classes.views.parts.selectOption = Backbone.View.extend( {
		template: '#customize-happyforms-select-item-template',

		events: {
			'click .advanced-option': 'onAdvancedOptionClick',
			'click .delete-option': 'onDeleteOptionClick',
			'keyup [name=label]': 'onItemLabelKeyup',
			'change [name=label]': 'onItemLabelChange',
			'change [name=is_default]': 'onItemDefaultChange',
			'keyup [name=limit_submissions_amount]': 'onItemLimitSubmissionsAmountChange',
			'change [name=limit_submissions_amount]': 'onItemLimitSubmissionsAmountChange',
		},

		initialize: function( options ) {
			this.template = _.template( $( this.template ).text() );
			this.part = options.part;

			this.listenTo( this, 'ready', this.onReady );
			this.listenTo( this.model, 'change:limit_submissions_amount', this.onChangeMaxSubmissionsAmount );
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

		onItemLabelKeyup: function( e ) {
			if ( 'Enter' === e.key ) {
				$( '.add-option', this.$el ).trigger( 'click' );
				return;
			}

			this.model.set( 'label', $( e.target ).val() );
			this.part.trigger( 'change' );
		},

		onItemLabelChange: function( e ) {
			var self = this;

			this.part.fetchHtml( function( response ) {
				var data = {
					id: self.part.id,
					html: response,
				};

				happyForms.previewSend( 'happyforms-form-part-refresh', data );
			} );
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
				callback: 'onSelectItemDefaultChangeCallback',
				options: {
					itemID: this.model.get( 'id' ),
				}
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
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
	} );

	happyForms.classes.views.parts.select = happyForms.classes.views.Part.extend( {
		template: '#customize-happyforms-select-template',

		events: _.extend( {}, happyForms.classes.views.Part.prototype.events, {
			'click .add-option': 'onAddOptionClick',
			'click .add-heading': 'onAddHeadingClick',
			'click .import-option': 'onImportOptionClick',
			'click .import-options': 'onImportOptionsClick',
			'click .add-options': 'onAddOptionsClick',
			'click .show-all-options': 'onShowAllOptionsClick',

			'change [data-bind=other_option_label]': 'onOtherSelectOptionLabelChange',
		} ),

		initialize: function() {
			happyForms.classes.views.Part.prototype.initialize.apply( this, arguments );

			this.optionViews = new Backbone.Collection();

			this.listenTo( this.model, 'change:placeholder', this.onPlaceholderChange );
			this.listenTo( this.model, 'change:required', this.onRequiredChange );
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

			if ( 1 == optionModel.get( 'is_default' ) ) {
				$( '[name=is_default]', optionViewModel.$el ).prop( 'checked', false ).trigger( 'change' );
			}

			this.optionViews.remove( optionViewModel );

			if ( this.model.get( 'options' ).length == 0 ) {
				$( '.options ul', this.$el ).html( '' );
			}

			var data = {
				id: this.model.get( 'id' ),
				callback: 'onSelectItemDeleteCallback',
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
				optionView = new happyForms.classes.views.parts.selectOptionHeading( _.extend( {
					model: optionModel,
					part: this.model,
				}, options ) );
			} else {
				optionView = new happyForms.classes.views.parts.selectOption( _.extend( {
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

		onShowAllOptionsClick: function(e) {
			var $link = $(e.target);
			this.$el.find('.happyforms-part-widget--sub').show();
			$link.hide();
		},

		onPlaceholderChange: function( model, value ) {
			var data = {
				id: model.get( 'id' ),
				callback: 'onSelectPlaceholderChangeCallback',
				options: {
					label: value
				}
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},

		onRequiredChange: function( model, value ) {
			model.fetchHtml( function (response) {
				var data = {
					id: model.get('id'),
					html: response,
				};

				happyForms.previewSend('happyforms-form-part-refresh', data);
			} );
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
			var model = this.model;

			if ( 1 == value ) {
				$otherOptionOptions.show();
			} else {
				$otherOptionOptions.hide();
			}

			this.model.trigger( 'change' );

			this.model.fetchHtml( function( response ) {
				var data = {
					id: model.get( 'id' ),
					html: response,
				};

				happyForms.previewSend( 'happyforms-form-part-refresh', data );
			} );
		},

		onOtherSelectOptionLabelChange: function( model, value ) {
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

		onOtherOptionLabelChange: function() {
			var data = {
				id: this.model.get( 'id' ),
				callback: 'onSelectOtherOptionLabelChangeCallback'
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},

		onOtherOptionPlaceholderChange: function() {
			var data = {
				id: this.model.get( 'id' ),
				callback: 'onSelectOtherOptionPlaceholderChangeCallback'
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},

	} );

	happyForms.previewer = _.extend( happyForms.previewer, {
		onSelectItemAdd: function( id, html, options ) {
			var $part = this.getPartElement( html );

			this.$( '.happyforms-part__el', $part ).append( this.$( options.optionHTML ) );
		},

		onSelectItemLabelChangeCallback: function( id, html, options, $ ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var option = part.get( 'options' ).get( options.itemID );
			var $option = $( '[data-option-id=' + options.itemID + ']', $part );

			$option.text( option.get( 'label' ) );

			if ( option.get( 'is_default' ) ) {
				$( 'input', $part ).val( option.get( 'label' ) );
			}
		},

		onSelectItemDefaultChangeCallback: function( id, html, options, $ ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var option = part.get( 'options' ).get( options.itemID );

			$( 'input', $part ).val( '' );

			if ( option && 1 === option.get('is_default') ) {
				$( 'input', $part ).val( option.get( 'label' ) );
			}
		},

		onSelectItemDeleteCallback: function( id, html, options ) {
			var $part = this.getPartElement( html );
			var $option = $( '[data-option-id=' + options.itemID + ']', $part );

			$option.remove();
		},

		onSelectPlaceholderChangeCallback: function( id, html, options, $ ) {
			var $part = this.getPartElement( html );

			$( 'select option.happyforms-placeholder-option', $part ).text( options.label );
		},

		onSelectOtherOptionLabelChangeCallback: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var $otherOptionLabel = $( '.happyforms-custom-select-dropdown [data-value="999"]', $part );

			$otherOptionLabel.text( part.get( 'other_option_label' ) );
			$otherOptionLabel.attr( 'data-label', part.get( 'other_option_label' ) );
		},

		onSelectOtherOptionPlaceholderChangeCallback: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var $otherOptionInput = $( '.happyforms-part-option--other input[type=text]', $part );

			$otherOptionInput.attr( 'placeholder', part.get( 'other_option_placeholder' ) );
		},

		onSelectHeadingLabelChangeCallback: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var option = part.get( 'options' ).get( options.itemID );
			var $option = $( '#' + options.itemID, $part );

			this.$( 'label.heading-label', $option ).text( option.get( 'label' ) );
		},

	} );

} ) ( jQuery, _, Backbone, wp.customize, _happyFormsSettings );
