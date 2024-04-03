/* global fusionGlobalManager, FusionPageBuilderViewManager, fusionAppConfig, FusionEvents, FusionPageBuilderApp, fusionBuilderText, fusionAllElements */
/* eslint no-shadow: 0 */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Builder form step.
		FusionPageBuilder.FormStep = FusionPageBuilder.BaseView.extend( {

			className: 'fusion-builder-form-step fusion-special-item',
			template: FusionPageBuilder.template( jQuery( '#fusion-builder-form-step-template' ).html() ),
			events: {
				'click .fusion-builder-delete-form-step': 'removeContainer',
				'click .fusion-builder-settings': 'settings',
				'click .fusion-builder-special-item-drag': 'preventDefault',
				'click .fusion-builder-container-add': 'addContainer',
				'click .fusion-builder-special-item-container-clone': 'cloneSpecialElement'
			},

			initialize: function() {

				this.$el.attr( 'data-cid', this.model.get( 'cid' ) );

				this.baseInit();
			},

			render: function() {
				var self = this,
					data = this.getTemplateAtts();

				data.editLabel = this.getEditLabel();

				this.$el.html( this.template( data ) );

				setTimeout( function() {
					self.droppableContainer();
				}, 100 );

				return this;
			},

			/**
			 * Get the shortcode content for the next page.
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
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
					if ( ( 'on' === fusionAppConfig.removeEmptyAttributes && '' !== value ) || 'off' === fusionAppConfig.removeEmptyAttributes ) {
						shortcode += ' ' + name + '="' + value + '"';
					}
				} );

				shortcode += ' /]';

				return shortcode;
			},

			/**
			 * Adds drop zones for containers and makes container draggable.
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
			droppableContainer: function() {

				var $el   = this.$el,
					cid   = this.model.get( 'cid' ),
					self  = this,
					$body = jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' );

				if ( ! $el ) {
					return;
				}

				$el.draggable( {
					appendTo: FusionPageBuilderApp.$el,
					zIndex: 999999,
					delay: 100,
					cursorAt: { top: 15, left: 15 },
					iframeScroll: true,
					containment: $body,
					cancel: '.fusion-builder-column',
					helper: function() {
						var $classes = FusionPageBuilderApp.DraggableHelpers.draggableClasses( cid );
						return jQuery( '<div class="fusion-container-helper ' + $classes + '" data-cid="' + cid + '"><span class="fusiona-container"></span></div>' );
					},
					start: function() {
						$body.addClass( 'fusion-container-dragging fusion-active-dragging' );
						$el.addClass( 'fusion-being-dragged' );

						//  Add a class to hide the unnecessary target after.
						if ( $el.prev( '.fusion-builder-container' ).length ) {
							$el.prev( '.fusion-builder-container' ).addClass( 'hide-target-after' );
						}

						if ( $el.prev( '.fusion-fusion-builder-form-stepr' ).length ) {
							$el.prev( '.fusion-fusion-builder-form-step' ).addClass( 'hide-target-after' );
						}
					},
					stop: function() {
						setTimeout( function() {
							$body.removeClass( 'fusion-container-dragging fusion-active-dragging' );
						}, 10 );
						$el.removeClass( 'fusion-being-dragged' );
						FusionPageBuilderApp.$el.find( '.hide-target-after' ).removeClass( 'hide-target-after' );
					}
				} );

				$el.find( '.fusion-container-target' ).droppable( {
					tolerance: 'touch',
					hoverClass: 'ui-droppable-active',
					accept: '.fusion-builder-container, .fusion-builder-form-step',
					drop: function( event, ui ) {
						self.handleDropContainer( ui.draggable, $el, jQuery( event.target ) );
					}
				} );
			},

			handleDropContainer( $column, $targetEl, $dropTarget ) {
				// Move the actual html.
				if ( jQuery( $dropTarget ).hasClass( 'target-after' ) ) {
					$targetEl.after( $column );
				} else {
					$targetEl.before( $column );
				}

				FusionEvents.trigger( 'fusion-content-changed' );
				FusionEvents.trigger( 'fusion-rerender-form-steps' );
				FusionPageBuilderApp.scrollingContainers();
				FusionEvents.trigger( 'fusion-history-save-step', fusionBuilderText.form_step + ' Order Changed' );
			},

			/**
			 * Get template attributes.
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
			getTemplateAtts: function() {
				var templateAttributes = {};

				templateAttributes = this.filterTemplateAtts( templateAttributes );
				return templateAttributes;
			},

			/**
			 * Modify template attributes.
			 *
			 * @since 3.11
			 * @return {Object}
			 */
			filterTemplateAtts: function() {
				var attributes = {};
				this.values = this.model.get( 'params' );

				// Any extras that need passed on.
				attributes.values = this.values;
				attributes.cid = this.model.get( 'cid' );

				return attributes;
			},

			/**
			 * Set title params.
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
			updateInlineParams: function( param, value ) {
				var stepTitle = fusionBuilderText.form_step,
					el = this.$el;

				// Check if field exists and then update.
				if ( el.find( '.fusion-builder-form-step-title' ).length && 'title' === param ) {
					if ( '' !== value && 'title' === param ) {
						stepTitle = fusionBuilderText.form_step + ' - ' + value;
					}
					setTimeout( function() {
						el.find( '.fusion-builder-form-step-title' ).html( stepTitle );
					}, 100 );
				}
				FusionEvents.trigger( 'fusion-content-changed' );
				FusionEvents.trigger( 'fusion-rerender-form-steps' );
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
					FusionPageBuilderApp.blankPage = true;
					FusionPageBuilderApp.clearBuilderLayout( true );
				}

				FusionEvents.trigger( 'fusion-content-changed' );
				FusionEvents.trigger( 'fusion-rerender-form-steps' );
				FusionEvents.trigger( 'fusion-history-save-step', fusionBuilderText.deleted_form_step );
			},

			/**
			 * Adds a container.
			 *
			 * @since 2.0.0
			 * @param {Object} event - The event.
			 * @return {void}
			 */
			addContainer: function( event ) {
				var elementID,
					defaultParams,
					params,
					value,
					newContainer;

				if ( event ) {
					event.preventDefault();
					FusionPageBuilderApp.newContainerAdded = true;
				}

				elementID     = FusionPageBuilderViewManager.generateCid();
				defaultParams = fusionAllElements.fusion_builder_container.params;
				params        = {};

				// Process default options for shortcode.
				_.each( defaultParams, function( param )  {
					value = ( _.isObject( param.value ) ) ? param[ 'default' ] : param.value;
					params[ param.param_name ] = value;

					if ( 'dimension' === param.type && _.isObject( param.value ) ) {
						_.each( param.value, function( val, name )  {
							params[ name ] = val;
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

				// Make sure to add row to new container not current one.
				newContainer = FusionPageBuilderViewManager.getView( elementID );
				newContainer.addRow();

				FusionPageBuilderApp.scrollingContainers();
			},

			/**
			 * Clones the special element.
			 *
			 * @param {Object} event - The event.
			 * @return {void}
			 */
			cloneSpecialElement: function( event ) {
				var elementAttributes,
					currentModel,
					MultiGlobalArgs;

				if ( event ) {
					this.preventDefault( event );
				}

				if ( ( 'undefined' !== typeof this.$el.data( 'cloning-disabled' ) && 1 === this.$el.data( 'cloning-disabled' ) ) || true === this.elementIsCloning ) {
					return;
				}

				this.elementIsCloning = true;

				elementAttributes = jQuery.extend( true, {}, this.model.attributes );
				elementAttributes.created = 'manually';
				elementAttributes.cid = FusionPageBuilderViewManager.generateCid();
				elementAttributes.appendAfter = this.$el;
				elementAttributes.view = this;
				elementAttributes.at_index = FusionPageBuilderApp.getCollectionIndex( this.$el );

				if ( 'undefined' !== elementAttributes.from ) {
					delete elementAttributes.from;
				}

				currentModel = this.collection.add( elementAttributes );

				this.elementIsCloning = false;

				// Handle multiple global elements.
				MultiGlobalArgs = {
					currentModel: currentModel,
					handleType: 'save',
					attributes: currentModel.attributes
				};
				fusionGlobalManager.handleMultiGlobal( MultiGlobalArgs );

				FusionEvents.trigger( 'fusion-history-save-step', fusionBuilderText.cloned + ' ' + fusionAllElements[ this.model.get( 'element_type' ) ].name + ' ' + fusionBuilderText.element );
				FusionEvents.trigger( 'fusion-content-changed' );
				this._refreshJs();

			},

			/**
			 * Triggers a refresh.
			 *
			 * @since 2.0.0
			 * @return void
			 */
			_refreshJs: function() {
				jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' ).trigger( 'fusion-element-render-' + this.model.attributes.element_type, this.model.attributes.cid );
			}

		} );

	} );

}( jQuery ) );
