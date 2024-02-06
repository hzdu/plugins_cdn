( function( $, _, Backbone, api, settings ) {

	happyForms.classes.models.parts.toggletip = happyForms.classes.models.Part.extend( {
		defaults: function() {
			return _.extend(
				{},
				settings.formParts.toggletip.defaults,
				_.result( happyForms.classes.models.Part.prototype, 'defaults' ),
			);
		},
	} );

	happyForms.classes.views.parts.toggletip = happyForms.classes.views.Part.extend( {
		template: '#happyforms-customize-toggletip-template',
		editorId: null,

		events: _.extend( {}, happyForms.classes.views.Part.prototype.events, {
			'sort-stop': 'onSortStop',
		} ),

		ready: function() {
			happyForms.classes.views.Part.prototype.ready.apply( this, arguments );

			this.listenTo( this, 'refresh', this.onRefresh );
			
			this.initEditor();
		},

		onPartLabelChange: function() {
			var data = {
				id: this.model.id,
				callback: 'onHeadingChangeCallback',
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},

		initEditor: function() {
			var $textarea = $( 'textarea.wp-editor-area', this.$el );

			this.editorId = $textarea.attr( 'id' );
			this.editorSettings = {
				tinymce: {
					toolbar1: 'bold,italic,strikethrough,link',
					plugins : 'charmap compat3x paste directionality hr image lists wordpress wpautoresize wpemoji wplink wptextpattern wpview',
					setup: this.onEditorInit.bind( this )
				},
				quicktags: {
					buttons: {}
				},
				mediaButtons: false
			};

			wp.editor.initialize( this.editorId, this.editorSettings );
		},

		removeEditor: function() {
			wp.editor.remove( this.editorId );
			this.editorId = null;
		},

		onSortStop: function() {
			this.removeEditor();
			this.initEditor();
		},

		onRefresh: function() {
			this.removeEditor();
			this.initEditor();
		},

		onEditorInit: function( editor ) {
			editor.on( 'keyup change', function() {
				this.model.set( 'details', editor.getContent() );

				var data = {
					id: this.model.get('id'),
					callback: 'onDescriptionChangeCallBack',
				};

				happyForms.previewSend('happyforms-part-dom-update', data);
			}.bind( this ) );
		},

		remove: function() {
			wp.editor.remove( this.editorId );

			happyForms.classes.views.Part.prototype.remove.apply( this, arguments );
		}
	} );

	happyForms.previewer = _.extend( happyForms.previewer, {
		onDescriptionChangeCallBack: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );

			$( '.happyforms-part__el details div.happyforms-toggletip-text', $part ).html( part.get( 'details' ) );
		},

		onHeadingChangeCallback: function( id, html ) {
			var part = happyForms.form.get( 'parts' ).get( id );
			var $part = this.$( html );
			var label = part.get( 'label' );
			var $label = this.$( '.happyforms-part-wrap > .happyforms-part__label-container span.label', $part ).first();

			$label.text( label );
			$( '.happyforms-part__el details summary u', $part ).html( label );


		},
	} );

} ) ( jQuery, _, Backbone, wp.customize, _happyFormsSettings );
