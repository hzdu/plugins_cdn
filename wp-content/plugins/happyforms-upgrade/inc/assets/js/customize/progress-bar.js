( function( $, _, Backbone, api, settings, progressBarSettings ) {

	var FormBuild = happyForms.classes.views.FormBuild;
	var FormStyle = happyForms.classes.views.FormStyle;
	var Previewer = happyForms.previewer;

	var HappyFormsProgressBar = function() {
		this.totalSteps = 0;
	}

	HappyFormsProgressBar.prototype.init = function() {
		var pageBreaks = happyForms.form.get( 'parts' ).where( { type: 'page_break' } ).length;
		this.totalSteps = pageBreaks;
	}

	HappyFormsProgressBar.prototype.refresh = function() {
		var self = this;
		var pageBreaks = happyForms.form.get( 'parts' ).where( { type: 'page_break' } ).length;

		if ( 1 < this.totalSteps && this.totalSteps === pageBreaks ) {
			happyForms.utils.fetchPartialHtml( 'form-steps-progress', function( response ) {
				var data = {
					selector: '[data-partial-id=form-steps-progress]',
					options: {
						after: '[data-partial-id="title"]'
					},
					html: response
				};

				happyForms.previewSend( 'happyforms-form-partial-html-fetch', data );
			} );
		}
	}

	HappyFormsProgressBar.prototype.addStep = function() {
		this.totalSteps++;

		this.refresh();
	}

	HappyFormsProgressBar.prototype.removeStep = function() {
		this.totalSteps--;

		this.refresh();
	}

	HappyFormsProgressBar.prototype.unload = function() {
		var data = {
			partial: 'form-steps-progress'
		};

		happyForms.previewSend( 'happyforms-form-partial-remove', data );
	}

	HappyFormsProgressBar.prototype.getTotalSteps = function() {
		return this.totalSteps;
	}

	happyForms.classes.views.FormBuild = FormBuild.extend( {
		ready: function() {
			FormBuild.prototype.ready.apply( this, arguments );
		},

		onPartAdd: function( type, options ) {
			FormBuild.prototype.onPartAdd.apply( this, arguments );

			if ( 'page_break' !== type ) {
				return;
			}

			var form = happyForms.form;
			var parts = happyForms.form.get( 'parts' );
			var $firstPart = $( '.happyforms-form-widgets .happyforms-widget:first-child', this.$el );
			var firstPartModel = parts.findWhere({ id: $firstPart.attr( 'data-part-id' ) });

			if ( 'page_break' !== firstPartModel.get( 'type' ) ) {
				var partModel = happyForms.factory.model(
					{ type: 'page_break' },
					{ collection: form.get( 'parts' ) },
				);

				var options = {
					index: 0,
					at: 0,
					expand: true
				};

				partModel.set( 'is_first', true );
				partModel.set( 'label', progressBarSettings.i18n.first_label );

				form.get( 'parts' ).add( partModel, options );
				form.trigger( 'change', partModel );

				partModel.fetchHtml( function( response ) {
					var data = {
						html: response,
						after: -1
					};

					happyForms.previewSend( 'happyforms-form-part-add', data );
				} );
			}
		},

		onPartSortStop: function() {
			FormBuild.prototype.onPartSortStop.apply( this, arguments );

			happyForms.progressBar.refresh();
		}
	} );

	happyForms.classes.views.FormStyle = FormStyle.extend( {
		applyConditionClasses: function() {
			FormStyle.prototype.applyConditionClasses.apply( this, arguments );

			var hasProgressBar = false;

			if ( happyForms.form.get( 'parts' ).where( { type: 'page_break' } ).length >= 2 ) {
				hasProgressBar = true;
			}

			if ( hasProgressBar ) {
				this.$el.addClass( 'has-progress-bar' );
			}
		}
	} );

	api.bind( 'ready', function() {
		happyForms.progressBar = new HappyFormsProgressBar();
		happyForms.progressBar.init();
	} );

} ) ( jQuery, _, Backbone, wp.customize, _happyFormsSettings, _happyFormsProgressBarSettings );
