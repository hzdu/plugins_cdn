(function ($, _, Backbone, api, settings) {

	happyForms.classes.models.parts.email_integration = happyForms.classes.models.Part.extend( {
		defaults: function () {
			return _.extend(
				{},
				settings.formParts.email_integration.defaults,
				_.result( happyForms.classes.models.Part.prototype, 'defaults' ),
			);
		},
	} );

	happyForms.classes.models.parts.mailchimp = happyForms.classes.models.parts.email_integration;

	happyForms.classes.views.parts.email_integration = happyForms.classes.views.Part.extend( {
		template: '#happyforms-customize-email_integration-template',
		editor: null,

		events: _.extend( {}, happyForms.classes.views.Part.prototype.events, {
			'sort-stop': 'onSortStop',
		} ),

		ready: function () {
			happyForms.classes.views.Part.prototype.ready.apply(this, arguments);

			this.initEditor();
		},

		initEditor: function() {
			var $textarea = $('textarea[name=email_integration_text]', this.$el);
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
			var $textarea = $('textarea[name=email_integration_text]', this.$el);
			var editorId = $textarea.attr('id');

			wp.editor.remove( editorId );
		},

		onSortStop: function () {
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
				this.model.set('email_integration_text', editor.getContent());

				var data = {
					id: this.model.get('id'),
					callback: 'onEmailIntegrationTextChange',
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
			var $textarea = $('textarea[name=email_integration_text]', this.$el);
			var editorId = $textarea.attr('id');

			wp.editor.remove(editorId);

			happyForms.classes.views.Part.prototype.remove.apply(this, arguments);
		}
	} );

	happyForms.classes.views.parts.mailchimp = happyForms.classes.views.parts.email_integration;

	happyForms.previewer = _.extend( happyForms.previewer, {
		onEmailIntegrationTextChange: function (id, html, options) {
			var part = this.getPartModel(id);
			var $part = this.getPartElement(html);

			this.$( '.happyforms-part__el .label', $part ).html( part.get( 'email_integration_text' ) );
		},
	} );

	var FormBuild = happyForms.classes.views.FormBuild;

	happyForms.classes.views.FormBuild = FormBuild.extend( {
		ready: function() {
			FormBuild.prototype.ready.apply( this, arguments );

			var emailIntegrationPart = happyForms.form.get( 'parts' ).findWhere( { type: 'email_integration' } );

			if ( emailIntegrationPart ) {
				this.drawer.$el.addClass( 'has-email_integration-part' );
			}
		},

		onPartAdd: function( type, options ) {
			if ( 'email_integration' === type ) {
				var emailIntegrationPart = happyForms.form.get( 'parts' ).findWhere( { type: 'email_integration' } );

				if ( emailIntegrationPart ) {
					return;
				}

				this.drawer.$el.addClass( 'has-email_integration-part' );
			}

			FormBuild.prototype.onPartAdd.apply( this, arguments );
		},

		onPartModelRemove: function( model ) {
			FormBuild.prototype.onPartModelRemove.apply( this, arguments );

			if ( 'email_integration' === model.get( 'type' ) ) {
				this.drawer.$el.removeClass( 'has-email_integration-part' );
			}
		}
	} );

} )( jQuery, _, Backbone, wp.customize, _happyFormsSettings );
