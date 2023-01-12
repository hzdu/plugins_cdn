( function ( $, _, Backbone, api, settings ) {

	happyForms.classes.models.parts.scale = happyForms.classes.models.Part.extend( {
		defaults: function () {
			return _.extend(
				{},
				settings.formParts.scale.defaults,
				_.result( happyForms.classes.models.Part.prototype, 'defaults' ),
			);
		},
	} );

	happyForms.classes.views.parts.scale = happyForms.classes.views.Part.extend( {
		template: '#happyforms-customize-scale-template',

		initialize: function() {
			happyForms.classes.views.Part.prototype.initialize.apply( this, arguments );

			this.listenTo( this.model, 'change:multiple', this.onMultipleChange );
			this.listenTo( this.model, 'change:prefix', this.onPartScalePrefixChange );
			this.listenTo( this.model, 'change:suffix', this.onPartScaleSuffixChange );
			this.listenTo( happyForms.form, 'save', this.onFormSave );
		},

		events: _.extend( {}, happyForms.classes.views.Part.prototype.events, {
				'change [data-bind=default_value]': 'onDefaultValueChange',
				'change [data-bind=min_value]': 'onMinValueChange',
				'change [data-bind=max_value]': 'onMaxValueChange',
				'change [data-bind=default_range_from]': 'onDefaultRangeFromChange',
				'change [data-bind=default_range_to]': 'onDefaultRangeToChange',
				'change [data-bind=default_range_from]': 'refreshPart',
				'change [data-bind=default_range_to]': 'refreshPart',
				'change [data-bind=step]': 'onSliderStepIntervalChange',
		} ),

		onMinValueChange: function( e ) {
			var model = this.model;
			var value = $(e.target).val();

			model.set('min_value', value);

			if ( parseInt( value, 10 ) > parseInt( model.get( 'default_range_from' ), 10 ) ) {
				model.set( 'default_range_from', value );
			}

			$( '[data-bind=default_value]', this.$el ).val( model.get( 'default_value' ) );
			$( '[data-bind=default_range_from]', this.$el ).val( model.get( 'default_range_from' ) );

			this.refreshPart();
		},

		onMaxValueChange: function (e) {
			var model = this.model;
			var value = $(e.target).val();
			var intValue = parseInt(value, 10);

			if ( intValue < parseInt( model.get('default_value'), 10 ) ) {
				model.set('default_value', value);
			}

			if ( intValue < parseInt( model.get('default_range_to'), 10 ) ) {
				model.set('default_range_to', value );
			}

			$( '[data-bind=default_value]', this.$el ).val( model.get( 'default_value' ) );
			$( '[data-bind=default_range_to]', this.$el ).val( model.get( 'default_range_to' ) );

			this.refreshPart();
		},

		onDefaultValueChange: function( model, value ) {
			this.refreshPart();
		},

		onDefaultRangeFromChange: function( e ) {
			var value = $(e.target).val();
			var model = this.model;

			if ( parseInt( value, 10 ) < parseInt( model.get('min_value'), 10 ) ) {
				model.set('default_range_from', model.get('min_value'));
				$('[data-bind=default_range_from]', this.$el).val(model.get('min_value'));
			}
		},

		onDefaultRangeToChange: function( e ) {
			var value = $(e.target).val();
			var model = this.model;

			if (parseInt(value, 10) > parseInt(model.get('max_value'), 10)) {
				model.set('default_range_to', model.get('max_value'));
				$('[data-bind=default_range_to]', this.$el).val(model.get('max_value'));
			}
		},

		onSliderStepIntervalChange: function( e ) {
			if ( $( e.target ).val() <= 0 ) {
				$('[data-bind=step]', this.$el).val( 1 );
				this.model.set( 'step', 1 );
			}

			var data = {
				id: this.model.get( 'id' ),
				callback: 'onSliderStepIntervalChangeCallback',
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},

		onMultipleChange: function ( model, value ) {
			value = parseInt( value );
			var $multipleOptions = $( '.happyforms-nested-settings[data-trigger="multiple"]', this.$el );

			if ( 1 === value ) {
				$multipleOptions.show();
				this.$el.find('.scale-single-options').hide();
			} else {
				this.$el.find('.scale-single-options').show();
				$multipleOptions.hide();
			}

			this.refreshPart();
		},

		onPartScalePrefixChange: function( model, value ) {
			var data;

			data = {
				id: this.model.get( 'id' ),
				callback: 'onPartScalePrefixChangeCallback',
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},

		onPartScaleSuffixChange: function( model, value ) {
			var data;

			data = {
				id: this.model.get( 'id' ),
				callback: 'onPartScaleSuffixChangeCallback',
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},

		onFormSave: function( form ) {
			var part = _.findWhere( form.parts, {
				id: this.model.get( 'id' )
			} );

			if ( ! part ) {
				return;
			}

			$( '[data-bind="min_value"]', this.$el ).val( part.min_value );
			$( '[data-bind="max_value"]', this.$el ).val( part.max_value );
			$( '[data-bind="default_range_from"]', this.$el ).val( part.default_range_from );
			$( '[data-bind="default_value"]', this.$el ).val( part.default_value );
		},
	} );

	happyForms.previewer = _.extend( happyForms.previewer, {
		onSliderStepIntervalChangeCallback: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var $input = this.$( 'input', $part );

			$input.attr( 'step', part.get( 'step' ) );
		},

		onPartScalePrefixChangeCallback: function( id, html, options, $ ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var $prefix = this.$( 'span.happyforms-part--scale__prefix', $part );

			$prefix.text( part.get( 'prefix' ) );
		},

		onPartScaleSuffixChangeCallback: function( id, html, options, $ ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var $prefix = this.$( 'span.happyforms-part--scale__suffix', $part );

			$prefix.text( part.get( 'suffix' ) );
		},
	} );

	api.bind( 'ready', function () {
		api.previewer.bind( 'happyforms-part-render', function ( $el ) {
			if ( ! $el.is( '.happyforms-part--scale' ) ) {
				return;
			}

			$('input', $el).happyFormsScale();
		} );

		api.previewer.bind( 'happyforms-part-dom-updated', function ( $el ) {
			if ( ! $el.is( '.happyforms-part--scale' ) ) {
				return;
			}

			$( 'input', $el ).happyFormsScale();
		} );
	} );

} )( jQuery, _, Backbone, wp.customize, _happyFormsSettings );
