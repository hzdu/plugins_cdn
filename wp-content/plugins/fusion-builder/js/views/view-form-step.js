/* global FusionPageBuilderViewManager, FusionPageBuilderEvents, fusionHistoryManager, FusionPageBuilderApp, fusionBuilderConfig, fusionBuilderText, fusionAllElements */
var FusionPageBuilder = FusionPageBuilder || {};

( function( $ ) {

	$( document ).ready( function() {

		// Builder FOrm Step View.
		FusionPageBuilder.FormStep = window.wp.Backbone.View.extend( {

			className: 'fusion-builder-form-step',
			template: FusionPageBuilder.template( $( '#fusion-builder-form-step-template' ).html() ),
			events: {
				'click .fusion-builder-delete-form-step': 'removeContainer',
				'click .fusion-builder-edit-form-step': 'showSettings',
				'click .fusion-builder-special-item-drag': 'preventDefault',
				'click .fusion-builder-clone-special-item': 'cloneSpecial',
				'click .fusion-builder-special-item-add-container': 'addContainer'
			},

			render: function() {
				this.$el.html( this.template( this.model.toJSON() ) );
				return this;
			},

			showSettings: function( event ) {
				var $modalView,
					$viewSettings = {
						model: this.model,
						collection: this.collection,
						attributes: {
							'data-modal_view': 'element_settings'
						}
					};

				if ( event ) {
					event.preventDefault();
				}

				// Get settings view
				$modalView = new FusionPageBuilder.ModalView( $viewSettings );

				// Render settings view.
				$( 'body' ).append( $modalView.render().el );
			},

			getContent: function() {
				var params       = this.model.get( 'params' ),
					stringParams = {},
					shortcode    = '';

				_.each( params, function( value, name ) {
					if ( 'undefined' === value || 'undefined' === typeof value ) {
						stringParams[ name ] = '';
					} else {
						stringParams[ name ] = value;
					}
				} );

				shortcode += '[fusion_builder_form_step';

				// Loops params and add.
				_.each( stringParams, function( value, name ) {
					if ( ( 'on' === fusionBuilderConfig.removeEmptyAttributes && '' !== value ) || 'off' === fusionBuilderConfig.removeEmptyAttributes ) {
						shortcode += ' ' + name + '="' + value + '"';
					}
				} );

				shortcode += ' /]';

				return shortcode;
			},
			updateInlineParams: function() {
				// Detect "enter" key
				var attributes = { params: ( {} ) };

				// Preserve title.
				if ( 'undefined' !== typeof this.model.attributes.params.title ) {
					attributes.params.title = this.model.attributes.params.title;
				}
				FusionPageBuilderEvents.trigger( 'fusion-element-edited' );
			},

			removeContainer: function( event ) {
				if ( event ) {
					event.preventDefault();
				}

				FusionPageBuilderViewManager.removeView( this.model.get( 'cid' ) );

				this.model.destroy();

				this.remove();

				// If its the last container add empty page view.
				if ( 1 > FusionPageBuilderViewManager.countElementsByType( 'fusion_builder_container' ) && 1 > FusionPageBuilderViewManager.countElementsByType( 'fusion_builder_form_step' ) ) {
					FusionPageBuilderApp.clearBuilderLayout( true );
				}

				if ( event ) {
					fusionHistoryManager.turnOnTracking();
					window.fusionHistoryState = fusionBuilderText.deleted_form_step;
					FusionPageBuilderEvents.trigger( 'fusion-element-removed' );
				}
			},
			cloneSpecial: function( event  ) {
				var elementAttributes;

				if ( event ) {
					event.preventDefault();
				}

				if ( this.$el.children( '.fusion-builder-module-controls-container' ).hasClass( 'cloning-disabled' ) || true === this.elementIsCloning ) {
					return;
				}

				this.elementIsCloning = true;

				elementAttributes = $.extend( true, {}, this.model.attributes );
				elementAttributes.created = 'manually';
				elementAttributes.cid = FusionPageBuilderViewManager.generateCid();
				elementAttributes.appendAfter = this.$el;
				if ( 'undefined' !== elementAttributes.from ) {
					delete elementAttributes.from;
				}

				FusionPageBuilderApp.collection.add( elementAttributes );
				this.elementIsCloning = false;

				if ( event ) {
					// Save history state
					FusionPageBuilderEvents.trigger( 'fusion-element-cloned' );
					fusionHistoryManager.turnOnTracking();
					window.fusionHistoryState = fusionBuilderText.cloned + ' ' + fusionAllElements[ this.model.get( 'element_type' ) ].name + ' ' + fusionBuilderText.element;
				}

				// Check for globals.
				if ( elementAttributes.parent ) {
					setTimeout( FusionPageBuilderApp.checkGlobalParents, 500, elementAttributes.parent );
				}
			},
			addContainer: function( event ) {

				var elementID,
					defaultParams,
					params,
					value;

				if ( event ) {
					event.preventDefault();
					FusionPageBuilderApp.newContainerAdded = true;
				}

				FusionPageBuilderApp.activeModal = 'container';

				elementID     = FusionPageBuilderViewManager.generateCid();
				defaultParams = fusionAllElements.fusion_builder_container.params;
				params        = {};

				// Process default options for shortcode.
				_.each( defaultParams, function( param ) {
					if ( _.isObject( param.value ) ) {
						value = param[ 'default' ];
					} else {
						value = param.value;
					}
					params[ param.param_name ] = value;

					if ( 'dimension' === param.type && _.isObject( param.value ) ) {
						_.each( param.value, function( objVal, name ) {
							params[ name ] = objVal;
						} );
					}
				} );

				this.collection.add( [
					{
						type: 'fusion_builder_container',
						added: 'manually',
						element_type: 'fusion_builder_container',
						cid: elementID,
						params: params,
						view: this,
						created: 'auto'
					}
				] );

				FusionPageBuilderApp.activeModal = '';
			}
		} );
	} );
}( jQuery ) );
