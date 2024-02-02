( function( $, _, Backbone, api, settings, partSettings ) {

	happyForms.classes.models.parts.narrative = happyForms.classes.models.Part.extend( {
		defaults: function() {
			return _.extend(
				{},
				settings.formParts.narrative.defaults,
				_.result( happyForms.classes.models.Part.prototype, 'defaults' ),
			);
		},
	} );

	happyForms.classes.views.parts.narrative = happyForms.classes.views.Part.extend( {
		template: '#customize-happyforms-narrative-template',

		events: _.extend( {}, happyForms.classes.views.Part.prototype.events, {
			'click .insert-media': 'onAddMediaClick',
			'sort-stop': 'onSortStop',
		} ),

		editorId: null,

		ready: function() {
			happyForms.classes.views.Part.prototype.ready.apply( this, arguments );

			this.initEditor();
		},

		initEditor: function() {
			var $textarea = $( 'textarea.wp-editor-area', this.$el );
			this.editorId = $textarea.attr( 'id' );
			this.editorSettings = {
				tinymce: {
					toolbar1: 'bold,italic,strikethrough,link,happyforms_narrative_input,hfmedia',
					plugins : 'charmap compat3x paste directionality hr image lists media wordpress wpautoresize wpeditimage wpemoji wplink wptextpattern wpview',
					setup: this.onEditorInit.bind( this ),
				},
				quicktags: {
					buttons: 'strong,em,del,link,blank,close'
				},
				mediaButtons: true,
				hfmedia: {
					minimal: false,
					supports: {
						'image' : 'Image',
						'audio' : 'Audio',
						'video' : 'Video'
					},
					filters: {
						'image' : 'Image',
						'audio' : 'Audio',
						'video' : 'Video'
					},
				}
			};

			wp.editor.initialize( this.editorId, this.editorSettings );
		},

		removeEditor: function() {
			wp.editor.remove( this.editorId );
		},

		onSortStop: function() {
			this.removeEditor();
			this.initEditor();
		},

		onEditorInit: function( editor ) {
			var self = this;
			var refreshPreview = _.debounce( this.refreshPreview.bind( this ), 500 );

			if ( 'undefined' !== typeof QTags ) {
				QTags.addButton( 'hf_blank', 'blank', '[]', '', 'blank', 'Blank', 50, this.editorId );
			}

			editor.on( 'keyup change', function() {
				self.model.set( 'format', editor.getContent() );
				refreshPreview();
			} );

			editor.addButton( 'happyforms_narrative_input', {
				title: partSettings.blankTooltip,

				onClick: function() {
					editor.insertContent( '[]' );
				},
			} );
		},

		refreshPreview: function() {
			var model = this.model;

			model.fetchHtml(function (response) {
				var data = {
					id: model.get('id'),
					html: response
				};

				happyForms.previewSend( 'happyforms-form-part-refresh', data );
			} );
		},

		onAddMediaClick: function( e ) {
			e.preventDefault();
			e.stopPropagation();

			var editor              = tinymce.get( this.editorId );
			var editorMediaSettings = this.editorSettings.hfmedia;

			happyForms.utils.setMediaFilters( editorMediaSettings.filters );

			happyforms.iodia = new wp.media.view.MediaFrame.Select();
			happyforms.iodia.open();
			happyforms.iodia.on( 'close', happyForms.utils.onAttachmentSelected.bind( this, editor, editorMediaSettings.supports ) );
		},

		remove: function() {
			var editorId = this.model.id + '_format';
			wp.editor.remove( editorId );

			happyForms.classes.views.Part.prototype.remove.apply( this, arguments );
		},
	} );

} ) ( jQuery, _, Backbone, wp.customize, _happyFormsSettings, _happyFormsNarrativeSettings );
