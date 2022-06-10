( function( $, Backbone ) {
	window.post_id = 0;

	var happyFormsExportView = Backbone.View.extend( {
		el: '#happyforms-export-form',

		events: {
			'change #happyforms-export-select-action-select': 'onActionSelectChange',
			'change #happyforms-export-select-form-select': 'onFormDropdownChange',
			'change #happyforms-export-import-upload-stub': 'onFileAdd',
			'submit': 'onFormSubmit'
		},

		initialize: function() {
			this.formPickActions = [
				'export_responses',
				'export_form',
				'export_form_responses'
			];

			this.$submitButton = $( 'button', this.$el );

			this.$actionSelect = $( '#happyforms-export-select-action-select', this.$el );
			this.$importContainer = $( '#happyforms-export-section-import', this.$el );
			this.$fileStub = $( '#happyforms-export-import-upload-stub', this.$el );
			this.importAttachmentID = 0;
			this.ajaxImportAction = 'happyforms_import_form';

			this.listenTo( this.model, 'change:action', this.onActionChange );

			this.$actionSelect.trigger( 'change' );
		},

		onActionSelectChange: function( e ) {
			var value = this.$actionSelect.val();

			this.model.set( 'action', value );
		},

		onActionChange: function( model, value ) {
			this.$el.removeClass( 'doing-action-export_responses' );
			this.$el.removeClass( 'doing-action-export_form' );
			this.$el.removeClass( 'doing-action-export_form_responses' );
			this.$el.removeClass( 'doing-action-import' );
			this.$el.removeClass( 'import-submit' );
			this.$el.removeClass( 'import-success' );
			this.$el.removeClass( 'import-error' );

			this.resetFormDropdown();
			this.clearImport();

			this.$el.addClass( 'doing-action-' + value );
			this.$submitButton.hide();

			if ( 'import' === value ) {
				this.$submitButton.show().prop( 'disabled', true );
				this.bindUploaderEvents();
			}

			this.changeButtonText();
		},

		onFileAdd: function( e ) {
			window.uploader.addFile( $( e.target ).get(0).files[0] );
		},

		changeButtonText: function() {
			var action = this.model.get( 'action' );

			if ( action ) {
				this.$submitButton.text( this.$submitButton.attr( 'data-label-' + action ) );
			}
		},

		bindUploaderEvents: function() {
			var uploader = window.uploader || {};
			var self = this;

			if ( ! uploader ) {
				return;
			}

			uploader.setOption( 'filters', {
				mime_types : [ {
					title: 'XML',
					extensions: 'xml'
				} ],
				prevent_duplicates: false
			} );

			var uploaderMultiPartParams = wpUploaderInit.multipart_params;
			uploaderMultiPartParams.is_happyforms_export = true;

			uploader.setOption( 'multipart_params', uploaderMultiPartParams );

			uploader.bind( 'FileUploaded', function( uploader, file, result ) {
				if ( 200 === result.status ) {
					if ( ! isNaN( parseInt( result.response ) ) ) {
						self.importAttachmentID = result.response;
						self.$submitButton.prop( 'disabled', false );

						uploader.files = [];
						uploader.refresh();
					}
				}
			} );

			uploader.bind( 'FilesAdded', function( uploader, files ) {
				if ( uploader.files.length > 0 ) {
					uploader.splice( 1 );
					files.splice( 1 );
				}

				uploader.start();
			} );

			uploader.refresh();
		},

		onFormDropdownChange: function( e ) {
			var $select = $( e.target );

			if ( '' !== $select.val() ) {
				this.$submitButton.prop( 'disabled', false ).show();
			} else {
				this.$submitButton.prop( 'disabled', true ).hide();
			}
		},

		resetFormDropdown: function() {
			$( '#happyforms-export-select-form-select', this.$el ).val( '' );
		},

		onFormSubmit: function( e ) {
			if ( 'import' === this.model.get( 'action' ) ) {
				e.preventDefault();

				var self = this;

				this.$submitButton.prop( 'disabled', true );
				this.$el.addClass( 'import-submit' );

				$.ajax({
					url: ajaxurl,
					data: {
						action: self.ajaxImportAction,
						attachment_id: self.importAttachmentID
					},
					success: function( response ) {
						var $importMessages = $( '#happyforms-import-messages', self.$importContainer );

						if ( response.success ) {
							self.$el.addClass( 'import-success' );
							var $div = $( '<div />' ).attr( {
								class: 'happyforms-export-message success'
							} );

							$div.html( response.data );

							$importMessages.append( $div );
						} else {
							self.$el.addClass( 'import-error' );
							$( 'p', $importMessages ).addClass( 'happyforms-export-message error' );
						}

						self.$submitButton.hide();
					}
				})
			}
		},

		clearImport: function() {
			this.$fileStub.val( '' );
		}
	} );

	var happyFormsExportModel = Backbone.Model.extend( {
		action: ''
	} );

	$( function() {
		new happyFormsExportView( {
			model: new happyFormsExportModel
		} );
	} );

} ) ( jQuery, Backbone );
