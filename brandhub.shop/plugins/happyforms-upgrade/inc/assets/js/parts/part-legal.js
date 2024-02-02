(function ($, _, Backbone, api, settings) {

	happyForms.classes.models.parts.legal = happyForms.classes.models.Part.extend( {
		defaults: function () {
			return _.extend(
				{},
				settings.formParts.legal.defaults,
				_.result( happyForms.classes.models.Part.prototype, 'defaults' ),
			);
		},
	} );

	happyForms.classes.views.parts.legal = happyForms.classes.views.Part.extend( {
		template: '#happyforms-customize-legal-template',
		editor: null,

		events: _.extend( {}, happyForms.classes.views.Part.prototype.events, {
			'sort-stop': 'onSortStop',
		} ),

		ready: function () {
			happyForms.classes.views.Part.prototype.ready.apply(this, arguments);

			this.initEditor();
		},

		initEditor: function() {
			var $textarea = $('textarea[name=legal_text]', this.$el);
			var editorId = $textarea.attr('id');
			var editorSettings = {
				tinymce: {
					toolbar1: 'bold,italic,strikethrough,link',
					setup: this.onEditorInit.bind(this)
				},
			};

			wp.editor.initialize(editorId, editorSettings);
		},

		removeEditor: function() {
			var $textarea = $('textarea[name=legal_text]', this.$el);
			var editorId = $textarea.attr('id');

			wp.editor.remove( editorId );
		},

		onSortStop: function() {
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
		onEditorInit: function ( editor ) {
			editor.on('keyup change', function () {
				this.model.set('legal_text', editor.getContent());

				var data = {
					id: this.model.get('id'),
					callback: 'onLegalTextChange',
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
		remove: function () {
			var $textarea = $('textarea[name=legal_text]', this.$el);
			var editorId = $textarea.attr('id');

			wp.editor.remove(editorId);

			happyForms.classes.views.Part.prototype.remove.apply(this, arguments);
		}
	} );

	happyForms.previewer = _.extend( happyForms.previewer, {
		onLegalTextChange: function (id, html, options) {
			var part = this.getPartModel(id);
			var $part = this.getPartElement(html);

			this.$('.happyforms-part__el .label', $part).html(part.get('legal_text'));
		},
	} );

} )( jQuery, _, Backbone, wp.customize, _happyFormsSettings );
