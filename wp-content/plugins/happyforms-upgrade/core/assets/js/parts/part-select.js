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

	var OptionModel = happyForms.classes.models.Option.extend( {
		defaults: function() {
			return _.extend( {
				is_default: false,
				label: '',
				is_heading: false,
			}, _.result( happyForms.classes.models.Option.prototype, 'defaults' ) );
		},
	} );

	var OptionCollection = Backbone.Collection.extend( {
		model: OptionModel,
	} );

	happyForms.classes.views.selectOptionHeading = happyForms.classes.views.OptionHeading.extend( {
		template: '#customize-happyforms-select-item-heading-template',

		onLabelChange: function( e ) {
			var label = $( e.target ).val();
			this.model.set( 'label', label );
			this.part.trigger( 'change' );
			$('.happyforms-item-choice-widget-title h3 .choice-in-widget-title span', this.$el ).text( label );

			var data = {
				id: this.part.get( 'id' ),
				callback: 'onSelectItemHeadingLabelChangeCallback',
				options: {
					itemID: this.model.get( 'id' ),
				}
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},
	} );

	happyForms.classes.views.selectOptionItem = happyForms.classes.views.OptionItem.extend( {
		template: '#customize-happyforms-select-item-template',

		onItemLabelChange: function( e ) {
			var label = $( e.target ).val();
			this.model.set( 'label', label );
			this.part.trigger( 'change' );
			$('.happyforms-item-choice-widget-title h3 .choice-in-widget-title span', this.$el ).text( label );

			var data = {
				id: this.part.get( 'id' ),
				callback: 'onSelectItemLabelChangeCallback',
				options: {
					itemID: this.model.get( 'id' ),
				}
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
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
					checked: isChecked
				}
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},
	} );

	happyForms.classes.views.parts.select = happyForms.classes.views.ChoiceField.extend( {
		template: '#customize-happyforms-select-template',

		initialize: function() {
			happyForms.classes.views.ChoiceField.prototype.initialize.apply( this, arguments );

			this.listenTo( this.model, 'change:placeholder', this.onPlaceholderChange );
		},

		getOptionItemView: function( optionModel, options ) {
			var view = new happyForms.classes.views.selectOptionItem( _.extend( {
				model: optionModel,
				part: this.model,
			}, options ) );

			return view;
		},

		getOptionHeadingView: function( optionModel, options ) {
			var view = new happyForms.classes.views.selectOptionHeading( _.extend( {
				model: optionModel,
				part: this.model,
			}, options ) );

			return view;
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

		onOtherOptionLabelChange: function() {
			var data = {
				id: this.model.get( 'id' ),
				callback: 'onSelectOtherLabelChangeCallback'
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
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

			var model = this.model;

			this.model.fetchHtml( function( response ) {
				var data = {
					id: model.get( 'id' ),
					html: response,
				};

				happyForms.previewSend( 'happyforms-form-part-refresh', data );
			} );
		},
	} );

	happyForms.previewer = _.extend( happyForms.previewer, {
		onSelectItemLabelChangeCallback: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var option = part.get( 'options' ).get( options.itemID );

			this.$( '#' + options.itemID, $part ).text( option.get( 'label' ) );
		},

		onSelectItemHeadingLabelChangeCallback: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var option = part.get( 'options' ).get( options.itemID );

			this.$( '#' + options.itemID, $part ).attr( 'label', option.get( 'label' ) );
		},

		onSelectItemDefaultChangeCallback: function( id, html, options, $ ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var option = part.get( 'options' ).get( options.itemID );

			this.$( 'select option', $part ).removeAttr( 'selected' );

			if ( options.checked ) {
				this.$( '#' + options.itemID, $part ).prop( 'selected', 'selected' );
			}
		},

		onSelectPlaceholderChangeCallback: function( id, html, options, $ ) {
			var $part = this.getPartElement( html );

			$( 'select option.happyforms-placeholder-option', $part ).text( options.label );
		},

		onSelectOtherLabelChangeCallback: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );

			this.$( '.happyforms-select option#other-option', $part ).text( part.get( 'other_option_label' ) );
		},
	} );

} ) ( jQuery, _, Backbone, wp.customize, _happyFormsSettings );
