( function ( $, _, Backbone, api, settings ) {

	happyForms.classes.models.parts.likert_scale = happyForms.classes.models.Part.extend( {
		defaults: function () {
			return _.extend(
				{},
				settings.formParts.likert_scale.defaults,
				_.result( happyForms.classes.models.Part.prototype, 'defaults' ),
			);
		},
	} );

	happyForms.classes.views.parts.likert_scale = happyForms.classes.views.Part.extend( {
		template: '#happyforms-customize-likert-scale-template',

		initialize: function() {
			happyForms.classes.views.Part.prototype.initialize.apply( this, arguments );

			this.listenTo( this.model, 'change:step', this.onStepChange );
			this.listenTo( this.model, 'change:min_value', this.refreshPart );
			this.listenTo( this.model, 'change:max_value', this.refreshPart );
			this.listenTo( this.model, 'change:min_label', this.onMinLabelChange );
			this.listenTo( this.model, 'change:max_label', this.onMaxLabelChange );
			this.listenTo( happyForms.form, 'save', this.onFormSave );
		},

		onMinLabelChange: function( model, value ) {
			var data = {
				id: this.model.get( 'id' ),
				callback: 'onLikertScaleMinLabelChange',
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},

		onMaxLabelChange: function ( model, value ) {
			var data = {
				id: this.model.get( 'id' ),
				callback: 'onLikertScaleMaxLabelChange',
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
		},
	} );

	happyForms.previewer = _.extend( happyForms.previewer, {
		onLikertScaleMinLabelChange: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var $label = this.$( '.happyforms-likert-scale-label--min', $part );

			$label.text( part.get( 'min_label' ) );
		},

		onLikertScaleMaxLabelChange: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var $label = this.$( '.happyforms-likert-scale-label--max', $part );

			$label.text( part.get( 'max_label' ) );
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
