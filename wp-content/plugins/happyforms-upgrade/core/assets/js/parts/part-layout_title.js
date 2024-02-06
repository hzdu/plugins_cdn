( function( $, _, Backbone, api, settings ) {

	happyForms.classes.models.parts.layout_title = happyForms.classes.models.Part.extend( {
		defaults: function() {
			return _.extend(
				{},
				settings.formParts.layout_title.defaults,
				_.result( happyForms.classes.models.Part.prototype, 'defaults' ),
			);
		},
	} );

	happyForms.classes.views.parts.layout_title = happyForms.classes.views.Part.extend( {
		template: '#customize-happyforms-layout_title-template',

		initialize: function() {
			happyForms.classes.views.Part.prototype.initialize.apply( this, arguments );

			this.listenTo( this.model, 'change:label', this.onLabelChange );
			this.listenTo( this.model, 'change:level', this.onHeadingLevel );
		},

		onLabelChange: function( model, value ) {
			var data = {
				id: this.model.id,
				callback: 'onLayoutTitlePartLabelChange',
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},

		onHeadingLevel: function( model, value ) {
			var data = {
				id: this.model.id,
				callback: 'onHeadingLevelChange',
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		}

	} );

	var Previewer = happyForms.previewer;

	happyForms.previewer = _.extend( {}, Previewer, {
		onLayoutTitlePartLabelChange: function( id, html ) {
			var part = happyForms.form.get( 'parts' ).get( id );
			var $part = this.$( html );
			var $label = this.$( '.happyforms-layout-title', $part );

			$label.text( part.get( 'label' ) );
		},

		onHeadingLevelChange: function( id, html ) {
			var part = happyForms.form.get( 'parts' ).get( id );
			var $part = this.$( html );
			var $headinglevel = part.get( 'level' );
			var $label = this.$( '.happyforms-layout-title', $part );

			$label.replaceWith( function() {
				return $( '<' + $headinglevel + '/>', {
						html: this.innerHTML,
						class: $( this ).attr( 'class' )
			    } );
			} );

		},

	} );

} ) ( jQuery, _, Backbone, wp.customize, _happyFormsSettings );
