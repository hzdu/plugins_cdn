( function( $, _, Backbone, api, settings ) {

	happyForms.classes.models.parts.placeholder = happyForms.classes.models.Part.extend( {
		defaults: function() {
			return _.extend(
				{},
				settings.formParts.placeholder.defaults,
				_.result( happyForms.classes.models.Part.prototype, 'defaults' ),
			);
		},
	} );

	happyForms.classes.views.parts.placeholder = happyForms.classes.views.Part.extend( {
		template: '#happyforms-customize-placeholder-template',
		editorId: null,

		events: _.extend( {}, happyForms.classes.views.Part.prototype.events, {
			'sort-stop': 'onSortStop',
		} ),

		ready: function() {
			happyForms.classes.views.Part.prototype.ready.apply( this, arguments );

			this.listenTo( this, 'refresh', this.onRefresh );

			this.initEditor();
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

		/**
		 * Triggere previewer event on each `keyup` and `change` event in the WP editor.
		 *
		 * @since 1.0.0.
		 *
		 * @param {object} editor TinyMCE editor JS object.
		 *
		 * @return void
		 */
		onEditorInit: function( editor ) {
			editor.on( 'keyup change', function() {
				this.model.set( 'placeholder_text', editor.getContent() );

				var data = {
					id: this.model.get('id'),
					callback: 'onPlaceholderTextChangeCallBack',
				};

				happyForms.previewSend('happyforms-part-dom-update', data);
			}.bind( this ) );
		},

		/**
		 * Add a special treatment for removing WP editor when the part is removed.
		 *
		 * @since 1.0.0.
		 *
		 * @return void
		 */
		remove: function() {
			wp.editor.remove( this.editorId );

			happyForms.classes.views.Part.prototype.remove.apply( this, arguments );
		}
	} );

	happyForms.previewer = _.extend( happyForms.previewer, {
		onPlaceholderTextChangeCallBack: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );

			$( '.happyforms-part__el', $part ).html( part.get( 'placeholder_text' ) );
		},
	} );

} ) ( jQuery, _, Backbone, wp.customize, _happyFormsSettings );
