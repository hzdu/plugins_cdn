/* global openShortcodeGenerator, fusionBuilderConfig, ajaxurl, FusionPageBuilderEvents, fusionAllElements, FusionPageBuilderApp, fusionBuilderText, noUiSlider, wNumb, FusionPageBuilderViewManager, AwbTypography */
/* eslint no-unused-vars: 0 */
/* eslint no-shadow: 0 */
/* eslint no-extend-native: 0 */
/* eslint no-alert: 0 */
/* eslint no-empty-function: 0 */
var FusionPageBuilder = FusionPageBuilder || {};

( function( $ ) {

	$( document ).ready( function() {

		FusionPageBuilder.ElementSettingsView = window.wp.Backbone.View.extend( {

			className: 'fusion_builder_module_settings',
			template: FusionPageBuilder.template( $( '#fusion-builder-block-module-settings-template' ).html() ),

			events: {
				'click #qt_element_content_fusion_shortcodes_text_mode': 'activateSCgenerator',
				'click .option-dynamic-content': 'addDynamicContent',
				'click .option-has-state': 'toggleStateOptions',
				'click .fusion-state-options li a': 'changeStateOption'
			},

			activateSCgenerator: function( event ) {
				openShortcodeGenerator( $( event.target ) );
			},

			initialize: function() {
				var functionName,
					params,
					processedParams;

				this.listenTo( FusionPageBuilderEvents, 'fusion-modal-view-removed', this.removeElement );

				// Manupulate model attributes via custom function if provided by the element
				if ( 'undefined' !== typeof fusionAllElements[ this.model.get( 'element_type' ) ].on_settings ) {

					functionName = fusionAllElements[ this.model.get( 'element_type' ) ].on_settings;

					if ( 'function' === typeof FusionPageBuilderApp[ functionName ] ) {
						params          = this.model.get( 'params' );
						processedParams = FusionPageBuilderApp[ functionName ]( params, this );

						this.model.set( 'params', processedParams );
					}
				}

				this.listenTo( FusionPageBuilderEvents, 'fusion-dynamic-data-removed', this.removeDynamicStatus );
				this.listenTo( FusionPageBuilderEvents, 'fusion-dynamic-data-added', this.addDynamicStatus );
				this.dynamicSelection = false;
				this.dynamicParams    = 'object' === typeof this.options && 'object' === typeof this.options.dynamicParams ? this.options.dynamicParams : false;

				this.onInit();
			},

			onInit: function() {
			},

			addDynamicContent: function( event ) {
				var self         = this,
					$option      = jQuery( event.target ).closest( '.fusion-builder-option' ),
					param        = $option.attr( 'data-option-id' ),
					sameParam    = false,
					viewSettings;

				if ( this.dynamicSelection ) {
					if ( param === this.dynamicSelection.model.get( 'param' ) ) {
						sameParam = true;
					}
					this.dynamicSelection.removeView();
				}

				if ( sameParam ) {
					return;
				}

				viewSettings = {
					model: new FusionPageBuilder.Element( {
						param: param,
						option: $option,
						parent: this
					} )
				};

				// On select or cancel or event we destroy.
				this.dynamicSelection = new FusionPageBuilder.DynamicSelection( viewSettings );
				$option.find( '.fusion-dynamic-selection' ).html( this.dynamicSelection.render().el );
			},

			removeDynamicStatus: function( param ) {
				this.$el.find( '.fusion-builder-option[data-option-id="' + param + '"]' ).attr( 'data-dynamic', false );

				// Needed for dependencies.
				this.$el.find( '#' + param ).trigger( 'change' );
			},

			addDynamicStatus: function( param ) {
				this.$el.find( '.fusion-builder-option[data-option-id="' + param + '"]' ).attr( 'data-dynamic', true );

				// Needed for dependencies.
				this.$el.find( '#' + param ).trigger( 'change' );
			},

			toggleStateOptions: function( event ) {
				var $element = jQuery( event.currentTarget ).parent();

				$element.toggleClass( 'active-item' );
			},
			changeStateOption: function( event ) {
				var $element   = jQuery( event.currentTarget );
				var $parent    = jQuery( event.currentTarget ).closest( '.fusion-states-panel.active-item' );
				var $option	   = jQuery( event.currentTarget ).closest( 'li.fusion-builder-option' );
				const state = $element.attr( 'data-indicator' );
				const origID = $option.hasClass( 'is-option-state' ) ? $option.attr( 'data-default-state-option' ) : $option.attr( 'data-option-id' );
				const param_name = $element.attr( 'data-param_name' ) ? $element.attr( 'data-param_name' ) : `${origID}_${state}`;
				const $stateOption = $option.parent().find( `[data-option-id=${param_name}]` );

				if ( $stateOption.attr( 'data-option-id' ) === $option.attr( 'data-option-id' ) ) {
					$parent.removeClass( 'active-item' );
					return;
				}

				$stateOption.addClass( 'state-active' );

				const $stateLink = $parent.find( '.option-has-state' );

				if ( $stateLink.attr( 'data-connect-state' ) ) {
					const connectedOptions = $stateLink.attr( 'data-connect-state' ).split( ',' );
					connectedOptions.forEach( ( option ) => {
						$option.siblings( `[data-option-id=${option}], [data-default-state-option=${option}]` ).find( '.fusion-states-panel .fusion-state-options a[data-indicator= ' + state + ']' ).click();
					} );
				}

				if ( $stateOption.find( '.fusion-panel-options .option-preview-toggle' ) ) {
					$stateOption.find( '.fusion-panel-options .option-preview-toggle:not(.active)' ).click();
				}

				if ( 'default' === state ) {
					// Trun of active preview.
					$option.find( '.fusion-state-options li a' ).each( function() {
						const optionName = jQuery( this ).attr( 'data-param_name' );
						if ( optionName ) {
							$option.parent().find( `li.fusion-builder-option[data-option-id=${optionName}] .fusion-panel-options .option-preview-toggle.active` ).click();
						}
					} );
				}

				if ( $option.hasClass( 'is-option-state' ) ) {
					if ( 'default' === state ) {
						this.defaultState( event );
					} else {
						$option.removeClass( 'state-active' );
					}
				} else {
					// eslint-disable-next-line no-lonely-if
					if ( 'default' !== state ) {
						$option.addClass( 'state-inactive' );
					}
				}

				$parent.removeClass( 'active-item' );
			},

			defaultState: function( event ) {
				var $option	    	= jQuery( event.currentTarget ).closest( 'li.fusion-builder-option' );
				var $defaultOption 	= $option.parent().find( `[data-option-id=${$option.attr( 'data-default-state-option' )}]` );

				$defaultOption.removeClass( 'state-inactive' );
				$option.removeClass( 'state-active' );
			},

			render: function() {
				var $thisEl = this.$el,
					atts    = this.model.attributes,
					parentValues;

				this.beforeRender();

				if ( 'object' === typeof this.dynamicParams ) {
					this.dynamicParams.createBackup();
					atts.dynamic_params = this.dynamicParams.getAll();
				}

				$thisEl.html( this.template( { atts: atts } ) );

				$thisEl.attr( 'data-cid', this.model.get( 'cid' ) );

				// Resposnve options setup.
				$thisEl.addClass( FusionPageBuilderApp.isFlex( FusionPageBuilderApp.getParentContainer( this.model.get( 'cid' ) ) ) ? 'has-flex' : '' );
				$thisEl.addClass( FusionPageBuilderApp.isBlockLayoutColumn( FusionPageBuilderApp.getParentColumn( this.model.get( 'cid' ) ) ) && 'fusion_builder_column' !== this.model.get( 'element_type' ) && 'fusion_builder_column_inner' !== this.model.get( 'element_type' ) ? 'has-block-column' : '' );
				$thisEl.attr( 'data-type', this.model.get( 'type' ) );

				this.optionInit( $thisEl );

				setTimeout( function() {
					$thisEl.find( 'select, input, textarea, radio' ).filter( ':eq(0)' ).not( '[data-placeholder]' ).focus();
				}, 1 );

				// Check option dependencies
				if ( 'undefined' !== typeof this.model && 'undefined' !== typeof this.model.get ) {
					parentValues = 'undefined' !== typeof this.model.get( 'parent_values' ) ? this.model.get( 'parent_values' ) : false;
					FusionPageBuilderApp.checkOptionDependency( fusionAllElements[ this.model.get( 'element_type' ) ], $thisEl, parentValues );
				}

				this.onRender();

				FusionPageBuilderEvents.trigger( 'fusion-settings-modal-open' );

				return this;
			},

			beforeRender: function() {
			},

			onRender: function() {
				var $contentOption = this.$el.find( 'li[data-option-id="content_layout"]' ),
					value          = 'column';

				if ( $contentOption.length ) {
					value = $contentOption.find( '#content_layout' ).val();
					$contentOption.attr( 'data-direction', value );

					$contentOption.find( '#content_layout' ).on( 'change', function() {
						$contentOption.attr( 'data-direction', jQuery( this ).val() );
					} );
				}
			},

			optionInit: function( $el ) {
				var $thisEl = $el,
					self    = this,
					content = '',
					params  = this.model.get( 'params' ),
					view,
					$contentTextarea,
					$contentTextareaOption,
					$colorPicker,
					$uploadButton,
					$iconPicker,
					$multiselect,
					$checkboxbuttonset,
					$radiobuttonset,
					$value,
					$id,
					$container,
					$search,
					viewCID,
					$checkboxsetcontainer,
					$radiosetcontainer,
					$subGroup,
					$subgroupWrapper,
					$conditionalSelect,
					$visibility,
					$choice,
					$rangeSlider,
					$i,
					thisModel,
					$selectField,
					textareaID,
					allowGenerator = false,
					$dimensionField,
					codeBlockId,
					$codeBlock,
					codeElement,
					that = this,
					$textField,
					$placeholderText,
					$theContent,
					fixSettingsLvl = false,
					parentAtts,
					$linkButton,
					$dateTimePicker,
					$datePicker,
					$timePicker,
					$multipleImages,
					fetchIds = [],
					parentValues,
					$repeater,
					$sortable,
					$sortableText,
					$formOptions,
					$fusionLogics,
					$connectedSortable,
					codeMirrorJSON,
					optionId,
					$columnWidth,
					$focusPoint,
					$nominatimButton,
					typoSets = {};

				thisModel = this.model;

				// Fix for deprecated 'settings_lvl' attribute
				if ( 'undefined' !== thisModel.attributes.params.settings_lvl && 'parent' === thisModel.attributes.params.settings_lvl ) {
					fixSettingsLvl = true;
					parentAtts = thisModel.attributes.params;
				}

				if ( 'undefined' !== typeof thisModel.get && 'undefined' !== typeof thisModel.get( 'allow_generator' ) && true === thisModel.get( 'allow_generator' ) ) {
					FusionPageBuilderApp.allowShortcodeGenerator = true;
				}

				const $tabs = $thisEl.find( '.fusion-tabs' );

				// Set parentValues for dependencies on child.
				parentValues = ( 'undefined' !== typeof this.model.get && 'undefined' !== typeof this.model.get( 'parent_values' ) ) ? this.model.get( 'parent_values' ) : false;
				$textField         = $thisEl.find( '[data-placeholder]' );
				$contentTextarea   = $thisEl.find( '.fusion-editor-field' );
				$colorPicker       = $thisEl.find( '.fusion-builder-color-picker-hex' );
				$uploadButton      = $thisEl.find( '.fusion-builder-upload-button' );
				$iconPicker        = $thisEl.find( '.fusion-iconpicker' );
				$multiselect       = $thisEl.find( '.fusion-form-multiple-select' );
				$checkboxbuttonset = $thisEl.find( '.fusion-form-checkbox-button-set' );
				$radiobuttonset    = $thisEl.find( '.fusion-form-radio-button-set' );
				$rangeSlider       = $thisEl.find( '.fusion-slider-container' );
				$selectField       = $thisEl.find( '.fusion-select-field:not( .fusion-skip-init )' );
				$conditionalSelect = $thisEl.find( '.fusion-select-field[data-conditions]' );
				$dimensionField    = $thisEl.find( '.single-builder-dimension' );
				$codeBlock         = $thisEl.find( '.fusion-builder-code-block' );
				$linkButton        = $thisEl.find( '.fusion-builder-link-button' );
				$dateTimePicker    = $thisEl.find( '.fusion-datetime.full-picker' );
				$datePicker    	   = $thisEl.find( '.fusion-datetime.date-picker' );
				$timePicker    	   = $thisEl.find( '.fusion-datetime.time-picker' );
				$multipleImages    = $thisEl.find( '.fusion-multiple-image-container' );
				$repeater          = $thisEl.find( '.fusion-builder-option.repeater' );
				$sortable          = $thisEl.find( '.fusion-builder-option.sortable' );
				$sortableText      = $thisEl.find( '.fusion-builder-option.sortable_text' );
				$connectedSortable = $thisEl.find( '.fusion-builder-option.connected_sortable' );
				$columnWidth	   = $thisEl.find( '.fusion-form-column-width' );
				$formOptions       = $thisEl.find( '.fusion-form-form-options' );
				$fusionLogics      = $thisEl.find( '.fusion-builder-option-logics' );
				$focusPoint        = $thisEl.find( '.fusion-image-focus-point' );
				$nominatimButton   = $thisEl.find( '.fusion-builder-nominatim-button' );

				if ( $textField.length ) {
					$textField.on( 'focus', function( event ) {
						if ( jQuery( event.target ).data( 'placeholder' ) === jQuery( event.target ).val() ) {
							jQuery( event.target ).val( '' );
						}
					} );
				}

				if ( $linkButton.length ) {
					FusionPageBuilderApp.fusionBuilderActivateLinkSelector( $linkButton );
				}

				if ( $nominatimButton.length ) {
					FusionPageBuilderApp.fusionBuilderActivateNominatimSearch( $nominatimButton );
				}

				if ( $dateTimePicker.length ) {
					jQuery( $dateTimePicker ).fusiondatetimepicker( {
						format: 'yyyy-MM-dd hh:mm:ss'
					} );
				}

				if ( $datePicker.length ) {
					jQuery( $datePicker ).fusiondatetimepicker( {
						format: 'yyyy-MM-dd',
						pickTime: false
					} );
				}

				if ( $timePicker.length ) {
					jQuery( $timePicker ).fusiondatetimepicker( {
						format: 'hh:mm:ss',
						pickDate: false
					} );
				}

				// Dynamic data init.
				this.optionDynamicData( $thisEl );

				if ( $colorPicker.length ) {
					$colorPicker.each( function() {
						var self          = $( this ),
							$defaultReset = self.parents( '.fusion-builder-option' ).find( '.fusion-builder-default-reset' );

						// Picker with default.
						$( this ).awbColorPicker();

						// Default reset icon, set value to empty.
						$defaultReset.on( 'click', function( event ) {
							var dataDefault,
								$input = jQuery( this ).closest( '.fusion-builder-option' ).find( '.color-picker' );

							event.preventDefault();
							dataDefault = $input.attr( 'data-default' ) || $input.attr( 'data-default-color' );

							// Make the color picker to start from the default color on open.
							if ( dataDefault ) {
								$input.val( dataDefault ).trigger( 'change' );
							}
							$input.val( '' ).trigger( 'change' );
						} );
					} );
				}

				if ( $multipleImages.length ) {
					$multipleImages.each( function() {
						var $multipleImageContainer = jQuery( this ),
							ids;

						$multipleImageContainer.html( '' );

						if ( 'string' !== typeof $multipleImageContainer.parent().find( '#image_ids' ).val() ) {
							return;
						}

						// Set the media dialog box state as 'gallery' if the element is gallery.
						ids = $multipleImageContainer.parent().find( '#image_ids' ).val().split( ',' );

						// Check which attachments exist.
						jQuery.each( ids, function( index, id ) {
							if ( '' !== id && 'NaN' !== id ) {

								// Doesn't exist need to fetch.
								if ( 'undefined' === typeof wp.media.attachment( id ).get( 'url' ) ) {
									fetchIds.push( id );
								}
							}
						} );

						// Fetch attachments if neccessary.
						if ( 0 < fetchIds.length ) {
							wp.media.query( { post__in: fetchIds, posts_per_page: fetchIds.length } ).more().then( function( response ) { // jshint ignore:line
								that.renderAttachments( ids, $multipleImageContainer );
							} );
						} else {
							that.renderAttachments( ids, $multipleImageContainer );
						}
					} );
				}
				if ( $codeBlock.length ) {
					$codeBlock.each( function() {
						var codeBlockLang;
						if ( 'undefined' === typeof wp.CodeMirror ) {
							return;
						}
						codeBlockId   = $( this ).attr( 'id' );
						codeElement   = $thisEl.find( '#' + codeBlockId );
						codeBlockLang = jQuery( this ).data( 'language' );

						// Get wp.CodeMirror object json.
						codeMirrorJSON = $thisEl.find( '.' + codeBlockId ).val();
						if ( 'undefined' !== typeof codeMirrorJSON ) {
							codeMirrorJSON = JSON.parse( codeMirrorJSON );
							codeMirrorJSON.lineNumbers = true;
						}
						if ( 'undefined' !== typeof codeBlockLang && 'default' !== codeBlockLang ) {
							codeMirrorJSON.mode = 'text/' + codeBlockLang;
						}

						FusionPageBuilderApp.codeEditor = wp.CodeMirror.fromTextArea( codeElement[ 0 ], codeMirrorJSON );

						// Refresh editor after initialization
						setTimeout( function() {
							FusionPageBuilderApp.codeEditor.refresh();
							FusionPageBuilderApp.codeEditor.focus();
						}, 100 );

					} );
				}

				if ( $dimensionField.length ) {
					$dimensionField.each( function() {
						jQuery( this ).find( '.fusion-builder-dimension input' ).on( 'change paste keyup', function() {
							jQuery( this ).parents( '.single-builder-dimension' ).find( 'input[type="hidden"]' ).val(
								( ( jQuery( this ).parents( '.single-builder-dimension' ).find( 'div:nth-child(1) input' ).val().length ) ? jQuery( this ).parents( '.single-builder-dimension' ).find( 'div:nth-child(1) input' ).val() : '0px' ) + ' ' +
								( ( jQuery( this ).parents( '.single-builder-dimension' ).find( 'div:nth-child(2) input' ).val().length ) ? jQuery( this ).parents( '.single-builder-dimension' ).find( 'div:nth-child(2) input' ).val() : '0px' ) + ' ' +
								( ( jQuery( this ).parents( '.single-builder-dimension' ).find( 'div:nth-child(3) input' ).val().length ) ? jQuery( this ).parents( '.single-builder-dimension' ).find( 'div:nth-child(3) input' ).val() : '0px' ) + ' ' +
								( ( jQuery( this ).parents( '.single-builder-dimension' ).find( 'div:nth-child(4) input' ).val().length ) ? jQuery( this ).parents( '.single-builder-dimension' ).find( 'div:nth-child(4) input' ).val() : '0px' )
							);
						} );
					} );
				}

				if ( $selectField.length ) {
					// For quick edit.

					if ( $selectField.closest( '.fusion-builder-option' ).find( '.awb-quick-edit-button' ).length ) {

						const $quickEditButton = $selectField.closest( '.fusion-builder-option' ).find( '.awb-quick-edit-button' );

						// On change.
						$selectField.select2().on( 'change', function() {
							var itemValue = jQuery( this ).val();

							// Quick edit option update.
							if ( jQuery( this ).closest( '.fusion-builder-option' ).find( '.awb-quick-edit-button' ).length && ( '0' == itemValue || '' == itemValue ) ) {
								jQuery( this ).closest( '.fusion-builder-option' ).find( '.awb-quick-edit-button' ).removeClass( 'has-quick-edit' );
							} else {
								jQuery( this ).closest( '.fusion-builder-option' ).find( '.awb-quick-edit-button' ).addClass( 'has-quick-edit' );
							}
						} );

						// On click.
						$quickEditButton.on( 'click', function() {
							const type    = jQuery( this ).data( 'type' ),
								itemValue = jQuery( this ).closest( '.fusion-builder-option' ).find( 'select' ).val(),
								items     = jQuery( this ).data( 'items' );
							let url;

							if ( 'menu' === type ) {
								window.open( fusionBuilderConfig.admin_url + 'nav-menus.php?action=edit&menu=' + items[ itemValue ], '_blank' ).focus();
							} else {
								url = 'live' === fusionBuilderConfig.builder_type ? items[ itemValue ] + '?fb-edit=1' : fusionBuilderConfig.admin_url + 'post.php?post=' + itemValue + '&action=edit';
								window.open( url, '_blank' ).focus();
							}
						} );
					} else {
						$selectField.select2();
					}
				}

				if ( $conditionalSelect.length ) {
					$conditionalSelect.each( function() {
						var $select      = jQuery( this ),
							conditions   = jQuery( this ).data( 'conditions' ),
							param        = jQuery( this ).attr( 'id' ),
							defaultValue = 'object' === typeof fusionAllElements[ self.model.get( 'element_type' ) ].params[ param ] ? fusionAllElements[ self.model.get( 'element_type' ) ].params[ param ][ 'default' ] : '',
							value        = null;

						conditions = conditions ? JSON.parse( _.unescape( conditions ) ) : false;
						if ( false !== conditions ) {
							if ( 'string' !== typeof conditions.option || 'object' !== typeof conditions.map ) {
								return;
							}

							// Check for value and if param exists.
							if ( 'undefined' !== params[ conditions.option ] ) {
								value = params[ conditions.option ];
							} else if ( 'object' === typeof fusionAllElements[ self.model.get( 'element_type' ) ].params[ param ] ) {
								value = fusionAllElements[ self.model.get( 'element_type' ) ].params[ param ][ 'default' ];
							}

							// Param exists and we have value.
							if ( null !== value ) {

								// We have accepted values, disable rest.
								if ( 'object' === typeof conditions.map[ value ] ) {
									$select.find( 'option' ).prop( 'disabled', true );
									_.each( conditions.map[ value ], function( acceptedValue ) {
										$select.find( 'option[value="' + acceptedValue + '"]' ).prop( 'disabled', false );
									} );
								} else {
									$select.find( 'option' ).prop( 'disabled', false );
								}

								// Listen for changes to other option.
								self.$el.find( '#' + conditions.option ).on( 'change', function() {
									var value = jQuery( this ).val();

									// Find and disable options not valid.
									if ( 'object' === typeof conditions.map[ value ] ) {
										$select.find( 'option' ).prop( 'disabled', true );
										_.each( conditions.map[ value ], function( acceptedValue ) {
											$select.find( 'option[value="' + acceptedValue + '"]' ).prop( 'disabled', false );
										} );
									} else {
										$select.find( 'option' ).prop( 'disabled', false );
									}

									// If selection is now invalid, reset to default.
									if ( $select.find( 'option:selected' ).prop( 'disabled' ) ) {
										$select.val( defaultValue ).trigger( 'change' );
									}

									// Reinit select2 to update appearance.
									$select.select2();
								} );
							}
						}
					} );
				}

				if ( $columnWidth.length ) {
					$columnWidth.each( function() {
						// Init
						var $colEl 		= jQuery( this ),
						value 			= $colEl.find( '.width-value' ).val(),
						fractionToDecimal;

						fractionToDecimal = function( newValue ) {
							var fraction;

							if ( ! newValue.includes( '_' ) ) {
								return 0;
							}
							fraction = newValue.split( '_' );
							if ( '' === newValue ) {
								return 0;
							}
							return ( parseFloat( fraction[ 0 ] ) / parseFloat( fraction[ 1 ] ) * 100 ).toFixed( 2 );
						};

						// Check if it's fraction else initialize custom width.
						if ( ! value || value.includes( '_' ) || 'auto' === value ) {
							$colEl.find( '.ui-input, .width-custom' ).hide();
							$colEl.find( '.ui-button[data-value="' + value + '"]' ).addClass( 'ui-state-active' );

							// Update input values.
							$colEl.find( '.ui-input input' ).val( fractionToDecimal( value ) );
						} else {
							$colEl.find( '.ui-buttons, .width-default' ).hide();
						}

						$colEl.on( 'click', '.column-width-toggle', function() {
							$colEl.find( '.ui-input, .ui-buttons, a .label' ).toggle();
						} );

						$colEl.on( 'click', '.ui-button', function() {
							var $widthBtn 		= jQuery( this ),
								width			= $widthBtn.data( 'value' );

							// Update input values.
							$colEl.find( '.ui-input input' ).val( fractionToDecimal( width ) );

							$colEl.find( '.ui-button' ).removeClass( 'ui-state-active' );
							$widthBtn.addClass( 'ui-state-active' );
							$colEl.find( '.width-value' ).val( $widthBtn.data( 'value' ) );
						} );

						$colEl.on( 'change', '.ui-input input', function() {
							var $widthInput = jQuery( this ),
								width		= $widthInput.val();

							$colEl.find( '.ui-button' ).removeClass( 'ui-state-active' );
							$colEl.find( '.width-value' ).val( width );
						} );
					} );
				}

				if ( $thisEl.find( '.fusion-builder-option.typography' ).length ) {
					if ( 'undefined' === typeof window.awbTypographySelect || 'undefined' === typeof window.awbTypographySelect.webfonts ) {
						jQuery.when( window.awbTypographySelect.getWebFonts() ).done( function() {
							$thisEl.find( '.fusion-builder-option.typography' ).each( function() {
								typoSets[ jQuery( this ).attr( 'data-option-id' ) ] = new AwbTypography( jQuery( this )[ 0 ], self );
							} );
						} );
					} else {
						$thisEl.find( '.fusion-builder-option.typography' ).each( function() {
							typoSets[ jQuery( this ).attr( 'data-option-id' ) ] = new AwbTypography( jQuery( this )[ 0 ], self );
						} );
					}
				}

				if ( $uploadButton.length ) {
					FusionPageBuilderApp.FusionBuilderActivateUpload( $uploadButton );
				}

				if ( $iconPicker.length ) {
					$iconPicker.each( function() {
						var $picker = jQuery( this );

						$value     = $picker.find( '.fusion-iconpicker-input' ).val();
						$id        = $picker.find( '.fusion-iconpicker-input' ).attr( 'id' );
						$container = $picker.find( '.icon_select_container' );
						$search    = $picker.find( '.fusion-icon-search' );

						FusionPageBuilderApp.fusion_builder_iconpicker( $value, $id, $container, $search );
					} );
				}

				if ( $multiselect.length ) {

					$multiselect.each( function() {

						$placeholderText = fusionBuilderText.select_options_or_leave_blank_for_all;
						if ( -1 !== jQuery( this ).attr( 'id' ).indexOf( 'cat_slug' ) || -1 !== jQuery( this ).attr( 'id' ).indexOf( 'category' ) ) {
							$placeholderText = fusionBuilderText.select_categories_or_leave_blank_for_all;
						} else if ( -1 !== jQuery( this ).attr( 'id' ).indexOf( 'exclude_cats' ) ) {
							$placeholderText = fusionBuilderText.select_categories_or_leave_blank_for_none;
						} else if ( -1 !== jQuery( this ).attr( 'id' ).indexOf( 'social_share_links' ) ) {
							$placeholderText = fusionBuilderText.select_or_leave_blank_for_global;
						}


						jQuery( this ).select2( {
							placeholder: $placeholderText
						} );
					} );
				}

				if ( $checkboxbuttonset.length ) {

					// For the visibility option check if choice is no or yes then convert to new style
					$visibility = $thisEl.find( '.fusion-form-checkbox-button-set.hide_on_mobile' );
					if ( $visibility.length ) {
						$choice = $visibility.find( '.button-set-value' ).val();
						if ( 'no' === $choice || '' === $choice ) {
							$visibility.find( 'a' ).addClass( 'ui-state-active' );
						}
						if ( 'yes' === $choice ) {
							$visibility.find( 'a:not([data-value="small-visibility"])' ).addClass( 'ui-state-active' );
						}
					}

					$checkboxbuttonset.find( 'a' ).on( 'click', function( e ) {
						e.preventDefault();
						$checkboxsetcontainer = jQuery( this ).parents( '.fusion-form-checkbox-button-set' );
						jQuery( this ).toggleClass( 'ui-state-active' );
						$checkboxsetcontainer.find( '.button-set-value' ).val( $checkboxsetcontainer.find( '.ui-state-active' ).map( function( _, el ) {
							return jQuery( el ).data( 'value' );
						} ).get() ).trigger( 'change' );
					} );
				}

				if ( $radiobuttonset.length ) {
					$radiobuttonset.each( function () {
						const hasSubGroup 	= jQuery( this ).closest( '.fusion-builder-option.subgroup' ).length;
						if ( hasSubGroup ) {
							const itemsLength = jQuery( this ).find( '.buttonset-item' ).length;
							if ( 4 < itemsLength ) {
								jQuery( this ).addClass( 'backend-icons-only' );
							} else {
								jQuery( this ).removeClass( 'backend-icons-only' );
							}
						}

					} );
					$radiobuttonset.find( 'a' ).on( 'click', function( e ) {
						e.preventDefault();
						$radiosetcontainer = jQuery( this ).parents( '.fusion-form-radio-button-set' );
						$subGroup          = $radiosetcontainer.closest( '.fusion-builder-option.subgroup' );
						optionId           = $subGroup.attr( 'data-option-id' );

						$radiosetcontainer.find( '.ui-state-active' ).removeClass( 'ui-state-active' );
						jQuery( this ).addClass( 'ui-state-active' );
						$radiosetcontainer.find( '.button-set-value' ).val( $radiosetcontainer.find( '.ui-state-active' ).data( 'value' ) ).trigger( 'change' );

						if ( $subGroup.length ) {
							$subgroupWrapper = $subGroup.parent();
							$subgroupWrapper.find( '.fusion-subgroup-content[data-group="' + optionId + '"]' ).removeClass( 'active' );
							$subgroupWrapper.find( '.fusion-subgroup-' + $radiosetcontainer.find( '.ui-state-active' ).data( 'value' ) + '[data-group="' + optionId + '"]' ).addClass( 'active' );
						}
					} );

					// Radio buttons soft dependencies. for now its check single dependency support == and != operators only.
					if ( $radiobuttonset.find( 'a[data-dependency]' ).length ) {
						$radiobuttonset.find( 'a[data-dependency]' ).each( function() {
							const prop = jQuery( this ).data( 'dependency' );
							const value = jQuery( this ).data( 'dependency-value' );
							const operator = jQuery( this ).data( 'dependency-operator' ) || '==';

							const currentValue = $tabs.find( `input#${prop}` ).val();

							if ( '==' === operator ) {
								if ( currentValue == value ) {
									jQuery( this ).show();
								} else {
									jQuery( this ).hide();
								}
							}

							if ( '!=' === operator ) {
								if ( currentValue != value ) {
									jQuery( this ).show();
								} else {
									jQuery( this ).hide();
								}
							}

						} );

					}
				}

				// Radio buttons soft dependencies. on value change.
				if ( $tabs.find( '.fusion-form-radio-button-set a[data-dependency]' ).length ) {
					$tabs.find( '.fusion-form-radio-button-set a[data-dependency]' ).each( function() {
						const $btn = jQuery( this );
						const prop = jQuery( this ).data( 'dependency' );
						const value = jQuery( this ).data( 'dependency-value' );
						const operator = jQuery( this ).data( 'dependency-operator' ) || '==';

						$tabs.find( 'input#' + prop ).on( 'change', function() {
							const currentValue = jQuery( this ).val();
							if ( '==' === operator ) {
								if ( currentValue == value ) {
									$btn.show();
								} else {
									$btn.hide();
								}
							}

							if ( '!=' === operator ) {
								if ( currentValue != value ) {
									$btn.show();
								} else {
									$btn.hide();
								}
							}
						} );
					} );
				}

				// Init sortable.
				if ( $sortable.length ) {
					FusionPageBuilderApp.fusion_builder_sortable( $sortable );
				}

				// Init sort-able text.
				if ( $sortableText.length ) {
					FusionPageBuilderApp.fusion_builder_sortable_text( $sortableText );
				}

				// Init form options.
				if ( $formOptions.length ) {
					FusionPageBuilderApp.fusion_builder_form_options( $formOptions );
				}

				// Init form logics.
				if ( $fusionLogics.length ) {
					$fusionLogics.each( function() {
						FusionPageBuilderApp.fusion_builder_logics( jQuery( this ) );
					} );
				}

				// Init connected sortable.
				if ( $connectedSortable.length ) {
					FusionPageBuilderApp.fusion_builder_connected_sortable( $connectedSortable );
				}

				// Init image focus point
				if ( $focusPoint.length ) {
					const model = this.model;
					$focusPoint.each( function() {
						var point 	= jQuery( this ).find( '.point' );
						var field 	= jQuery( this ).find( 'input.fusion-builder-focus-point-field' );
						var preview = jQuery( this ).find( '.preview' );
						var previewImg = preview.find( '.image' );
						var placeHolder = preview.find( '.no-image-holder' );
						var paramName	= previewImg.data( 'image' );
						var uploadField	= $thisEl.find( `[data-option-id="${previewImg.data( 'image' )}"]` );
						var image 	= uploadField.find( '.fusion-builder-upload-preview img' );
						var imageValue = model.attributes.params[ paramName ];

						var dynamicData = model.attributes.params.dynamic_params;
						if ( dynamicData ) {
							dynamicData = FusionPageBuilderApp.base64Decode( dynamicData );
						}
						if ( dynamicData && '' !== dynamicData[ paramName ] ) {
							imageValue = false;
						}

						if ( imageValue ) {
							placeHolder.hide();
							previewImg.show();
							previewImg.append( image.clone() );
						} else {
							previewImg.hide();
							placeHolder.show();
						}

						FusionPageBuilderEvents.on( 'awb-image-upload-url-' + previewImg.data( 'image' ), function( url ) {
							if ( url ) {
								image 	= '<img src="' + url + '" alt="">';
								previewImg.find( 'img' ).remove();
								previewImg.append( image );
								previewImg.show();
								placeHolder.hide();
							} else {
								previewImg.find( 'img' ).remove();
								previewImg.hide();
								placeHolder.show();
							}
						} );

						point.draggable( {
							containment: 'parent',
							scroll: false,
							snap: '.position-point',
							snapMode: 'inner',
							snapTolerance: 10,
							drag: function () {
								var pointEl = jQuery( this );
								var top = parseInt( 100 * parseFloat( pointEl.css( 'top' ) ) / parseFloat( pointEl.parent().height() ) );
								var left = parseInt( 100 * parseFloat( pointEl.css( 'left' ) ) / parseFloat( pointEl.parent().width() ) );

								field.val( `${left}% ${top}%` ).trigger( 'change' );
							},
							stop: function () {
								var pointEl = jQuery( this );
								var top = parseInt( 100 * parseFloat( pointEl.css( 'top' ) ) / parseFloat( pointEl.parent().height() ) );
								var left = parseInt( 100 * parseFloat( pointEl.css( 'left' ) ) / parseFloat( pointEl.parent().width() ) );

								field.val( `${left}% ${top}%` ).trigger( 'change' );
							}
						} ).css( 'position', 'absolute' );

						$thisEl.find( '.position-point' ).on( 'click', function( event ) {
							var top = '50%',
								left = '50%';
							event.preventDefault();

							const el = jQuery( this );
							if ( el.hasClass( 'top-left' ) ) {
								top = 0;
								left = 0;
							}
							if ( el.hasClass( 'top-center' ) ) {
								top = 0;
								left = '50%';
							}
							if ( el.hasClass( 'top-right' ) ) {
								top = 0;
								left = '100%';
							}
							if ( el.hasClass( 'center-left' ) ) {
								top = '50%';
								left = 0;
							}
							if ( el.hasClass( 'center-center' ) ) {
								top = '50%';
								left = '50%';
							}
							if ( el.hasClass( 'center-right' ) ) {
								top = '50%';
								left = '100%';
							}
							if ( el.hasClass( 'bottom-left' ) ) {
								top = '100%';
								left = 0;
							}
							if ( el.hasClass( 'bottom-center' ) ) {
								top = '100%';
								left = '50%';
							}
							if ( el.hasClass( 'bottom-right' ) ) {
								top = '100%';
								left = '100%';
							}
							point.css( {
								top,
								left
							} );
							field.val( `${left} ${top}` ).trigger( 'change' );
						} );
					} );
				}

				// Fusion Form label update.
				if ( this.model.get( 'element_type' ).includes( 'fusion_form_' ) ) {

					setTimeout( function() {
						var elem = $thisEl.find( 'input[name="label"]' )[ 0 ],
							elemLen,
							oSel;

						if ( elem ) {
							elemLen = elem.value.length;
							// For IE Only
							if ( document.selection ) {
								// Set focus
								elem.focus();
								// Use IE Ranges
								oSel = document.selection.createRange();
								// Reset position to 0 & then set at end
								oSel.moveStart( 'character', -elemLen );
								oSel.moveStart( 'character', elemLen );
								oSel.moveEnd( 'character', 0 );
								oSel.select();
							} else if ( elem.selectionStart || '0' == elem.selectionStart ) {
								// Firefox/Chrome
								elem.selectionStart = elemLen;
								elem.selectionEnd = elemLen;
								elem.focus();
							} // if
						}
					}, 200 );


					$thisEl.on( 'change', '[name="label"]', function( event ) {
						var label = ( event.target && event.target.value ) || '';
						var $name = jQuery( this ).parents().siblings( '[data-option-id="name"]' ).find( 'input' );
						if ( '' === $name.val() && label ) {
							$name.val( self.fusionSanitize( label ) );
						}
					} );

					$thisEl.on( 'keydown', '[name="name"], [name$="field_name"]', function( e ) {
						var c = e.which;
						var ascii = {
							'109': '45',
							'173': '45',
							'186': '59',
							'189': '45'
						};
						if ( ascii.hasOwnProperty( c ) ) {
							c = ascii[ c ];
						}
						if ( ( 65 <= c && 90 >= c ) || ( !e.shiftKey && 48 <= c && 57 >= c ) || 45 == c || ( e.shiftKey && 59 == c ) || 8 == c || ( 37 <= c && 40 >= c ) ) {
							return;
						}
						return e.preventDefault();
					} );
				}


				function createSlider( $slide, $targetId, $rangeInput, $min, $max, $step, $value, $decimals, $rangeDefault, $hiddenValue, $defaultValue, $direction ) {

					// Create slider with values passed on in data attributes.
					var $slider = noUiSlider.create( $rangeSlider[ $slide ], {
							start: [ $value ],
							step: $step,
							direction: $direction,
							range: {
								min: $min,
								max: $max
							},
							format: wNumb( {
								decimals: $decimals
							} )
						} ),
						$notFirst = false;

					// Check if default is currently set.
					if ( $rangeDefault && '' === $hiddenValue.val() ) {
						$rangeDefault.parent().addClass( 'checked' );
					}

					// If this range has a default option then if checked set slider value to data-value.
					if ( $rangeDefault ) {
						$rangeDefault.on( 'click', function( e ) {
							e.preventDefault();
							$rangeSlider[ $slide ].noUiSlider.set( $defaultValue );
							$hiddenValue.val( '' );
							jQuery( this ).parent().addClass( 'checked' );
						} );
					}

					// On slider move, update input
					$slider.on( 'update', function( values, handle ) {
						if ( $rangeDefault && $notFirst ) {
							$rangeDefault.parent().removeClass( 'checked' );
							$hiddenValue.val( values[ handle ] );
						}
						// Not needed on init, value is already set in template.
						if ( true === $notFirst ) {
							jQuery( this.target ).closest( '.fusion-slider-container' ).prev().val( values[ handle ] ).trigger( 'change' );
						}
						$thisEl.find( '#' + $targetId ).trigger( 'change' );
						$notFirst = true;
					} );

					// On manual input change, update slider position.
					$rangeInput.on( 'blur', function( event ) {

						// If slider already has value, do nothing.
						if ( this.value === $rangeSlider[ $slide ].noUiSlider.get() ) {
							return;
						}

						// This triggers 'update' event.
						if ( $min <= this.value && $max >= this.value ) {
							$rangeSlider[ $slide ].noUiSlider.set( this.value );
						} else if ( $min > this.value ) {
							$rangeSlider[ $slide ].noUiSlider.set( $min );
						} else if ( $max < this.value ) {
							$rangeSlider[ $slide ].noUiSlider.set( $max );
						}

					} );
				}

				if ( $rangeSlider.length ) {

					// Counter variable for sliders
					$i = 0;

					// Method for retreiving decimal places from step
					Number.prototype.countDecimals = function() {
						if ( Math.floor( this.valueOf() ) === this.valueOf() ) {
							return 0;
						}
						return this.toString().split( '.' )[ 1 ].length || 0;
					};

					// Each slider on page, determine settings and create slider
					$rangeSlider.each( function() {

						var $targetId     = jQuery( this ).data( 'id' ),
							$rangeInput   = jQuery( this ).prev( '.fusion-slider-input' ),
							$min          = jQuery( this ).data( 'min' ),
							$max          = jQuery( this ).data( 'max' ),
							$step         = jQuery( this ).data( 'step' ),
							$direction    = jQuery( this ).data( 'direction' ),
							$value        = $rangeInput.val(),
							$decimals     = $step.countDecimals(),
							$rangeDefault = ( jQuery( this ).parents( '.fusion-builder-option' ).find( '.fusion-range-default' ).length ) ? jQuery( this ).parents( '.fusion-builder-option' ).find( '.fusion-range-default' ) : false,
							$hiddenValue  = ( $rangeDefault ) ? jQuery( this ).parent().find( '.fusion-hidden-value' ) : false,
							$defaultValue = ( $rangeDefault ) ? jQuery( this ).parents( '.fusion-builder-option' ).find( '.fusion-range-default' ).data( 'default' ) : false;

						// Check if parent has another value set to override TO default.
						if ( 'undefined' !== typeof parentValues && 'undefined' !== typeof parentValues[ $targetId ] && $rangeDefault ) {

							//  Set default values to new value.
							jQuery( this ).parents( '.fusion-builder-option' ).find( '.fusion-range-default' ).data( 'default', parentValues[ $targetId ] );
							$defaultValue = parentValues[ $targetId ];

							// If no current value is set, also update $value as representation on load.
							if ( ! $hiddenValue || '' === $hiddenValue.val() ) {
								$value = $defaultValue;
							}
						}

						createSlider( $i, $targetId, $rangeInput, $min, $max, $step, $value, $decimals, $rangeDefault, $hiddenValue, $defaultValue, $direction );

						$i++;
					} );

				}

				// TODO: fix for WooCommerce element.
				if ( 'undefined' !== typeof this.model.get && 'fusion_woo_shortcodes' === this.model.get( 'element_type' ) ) {
					if ( true === FusionPageBuilderApp.shortcodeGenerator ) {
						$thisEl.find( '#element_content' ).attr( 'id', 'generator_element_content' );
					}
				}

				// If there is tiny mce editor ( tinymce element option )
				if ( $contentTextarea.length ) {
					$contentTextareaOption = $contentTextarea.closest( '.fusion-builder-option' );

					// Multi element ( parent )
					if ( 'undefined' !== typeof this.model.get( 'multi' ) && 'multi_element_parent' === this.model.get( 'multi' ) ) {

						viewCID = FusionPageBuilderViewManager.generateCid();

						this.view_cid = viewCID;

						$contentTextareaOption.hide();

						$contentTextarea.attr( 'id', 'fusion_builder_content_main' );

						view = new FusionPageBuilder.MultiElementSortablesView( {
							model: this,
							el: this.$el.find( '.fusion-builder-option-advanced-module-settings' ),
							attributes: {
								cid: viewCID,
								parentCid: this.model.get( 'cid' )
							}
						} );

						FusionPageBuilderViewManager.addView( viewCID, view );

						$contentTextareaOption.before( view.render() );

						if ( '' !== $contentTextarea.html() ) {
							view.generateMultiElementChildSortables( $contentTextarea.html(), $thisEl.find( '.fusion-builder-option-advanced-module-settings' ).data( 'element_type' ), fixSettingsLvl, parentAtts );
						}

					// Standard element
					} else {

						content = $contentTextarea.html();

						// Called from shortcode generator
						if ( true === FusionPageBuilderApp.shortcodeGenerator ) {

							// TODO: unique id ( multiple mce )
							if ( true === FusionPageBuilderApp.shortcodeGeneratorMultiElementChild ) {
								$contentTextarea.attr( 'id', 'generator_multi_child_content' );
							} else {
								$contentTextarea.attr( 'id', 'generator_element_content' );
							}

							textareaID = $contentTextarea.attr( 'id' );

							setTimeout( function() {

								$contentTextarea.wp_editor( content, textareaID );

								// If it is a placeholder, add an on focus listener.
								if ( jQuery( '#' + textareaID ).data( 'placeholder' ) ) {
									window.tinyMCE.get( textareaID ).on( 'focus', function() {
										$theContent = window.tinyMCE.get( textareaID ).getContent();
										$theContent = jQuery( '<div/>' ).html( $theContent ).text();
										if ( $theContent === jQuery( '#' + textareaID ).data( 'placeholder' ) ) {
											window.tinyMCE.get( textareaID ).setContent( '' );
										}
									} );
								}

							}, 100 );

						} else {

							textareaID = $contentTextarea.attr( 'id' );

							setTimeout( function() {

								if ( 'undefined' !== typeof thisModel.get( 'allow_generator' ) && true === thisModel.get( 'allow_generator' ) ) {
									allowGenerator = true;
								}

								$contentTextarea.wp_editor( content, textareaID, allowGenerator );

								// If it is a placeholder, add an on focus listener.
								if ( jQuery( '#' + textareaID ).data( 'placeholder' ) ) {
									window.tinyMCE.get( textareaID ).on( 'focus', function() {
										$theContent = window.tinyMCE.get( textareaID ).getContent();
										$theContent = jQuery( '<div/>' ).html( $theContent ).text();
										if ( $theContent === jQuery( '#' + textareaID ).data( 'placeholder' ) ) {
											window.tinyMCE.get( textareaID ).setContent( '' );
										}
									} );
								}

							}, 100 );

						}

					}

				}

				// Init repeaters last.
				if ( $repeater.length ) {
					$repeater.each( function() {
						that.initRepeater( jQuery( this ) );
					} );
				}

				// Attachment upload alert.
				$thisEl.find( '.uploadattachment .fusion-builder-upload-button' ).on( 'click', function() {
					alert( fusionBuilderText.to_add_images );
				} );

				this.initAjaxSelects();

				// Range option preview
				FusionPageBuilderApp.rangeOptionPreview( $thisEl );

			},

			initAjaxSelects: function() {
				if ( 'undefined' === typeof ajaxurl ) {
					ajaxurl = fusionBuilderConfig.ajaxurl; // eslint-disable-line no-native-reassign, no-global-assign
				}

				this.$el.find( '.fusion-ajax-select' ).each( function() {
					var $select, ajax, ajaxParams, labels, initAjaxSelect, maxInput;

					$select    = jQuery( this );
					ajax       = $select.data( 'ajax' );
					maxInput   = $select.data( 'max-input' );
					ajaxParams = $select.siblings( '.params' ).val();
					labels     = $select.siblings( '.initial-values' ).val();
					labels     = labels ? JSON.parse( _.unescape( labels ) ) : [];
					ajaxParams = ajaxParams ? JSON.parse( _.unescape( ajaxParams ) ) : [];

					initAjaxSelect 	= function() {
						var ajaxSelect = $select.select2( {
							width: '100%',
							delay: 250,
							minimumInputLength: 3,
							maximumSelectionLength: maxInput,
							ajax: {
								url: ajaxurl,
								dataType: 'json',
								data: function ( params ) {
									return {
										action: ajax,
										search: params.term,
										params: ajaxParams,
										fusion_po_nonce: jQuery( '#fusion-page-options-nonce' ).val()
									};
								}
							}
						} );

						if ( 'undefined' !== typeof ajaxSelect.data( 'select2' ).dropdown ) {
							if ( 'undefined' !== typeof ajaxSelect.data( 'select2' ).dropdown.$dropdown ) {
								ajaxSelect.data( 'select2' ).dropdown.$dropdown.addClass( 'avada-select2' );
							} else if ( 'undefined' !== typeof ajaxSelect.data( 'select2' ).dropdown.selector ) {
								jQuery( ajaxSelect.data( 'select2' ).dropdown.selector ).addClass( 'avada-select2' );
							}
						}

						ajaxSelect.data( 'select2' ).on( 'results:message', function() {
							this.dropdown._resizeDropdown();
							this.dropdown._positionDropdown();
						} );

					};

					// If there are initial values get labels else init ajax-select.
					if ( labels ) {
						$select.addClass( 'loading' );

						jQuery.post( ajaxurl, {
							action: ajax,
							labels: labels,
							params: ajaxParams,
							fusion_po_nonce: jQuery( '#fusion-page-options-nonce' ).val()
						}, function( data ) {
							data   = JSON.parse( data );
							labels = data.labels || [];

							_.each( labels, function( label ) {
								$select.append(
									'<option value="' + label.id + '" selected="selected">' + label.text + '</option>'
								);
							} );

							$select.removeClass( 'loading' );

							initAjaxSelect();
						} );
					} else {
						initAjaxSelect();
					}
				} );
			},

			beforeRemove: function() {
			},

			removeElement: function() {
				this.beforeRemove();
				// Remove settings modal on save or close/cancel
				this.remove();
			},

			initRepeater: function( $element ) {
				var self       = this,
					param      = $element.data( 'option-id' ),
					option     = fusionAllElements[ this.model.get( 'element_type' ) ].params[ param ],
					fields     = 'undefined' !== typeof option ? option.fields : {},
					params     = this.model.get( 'params' ),
					values     = 'undefined' !== typeof params[ param ] ? params[ param ] : '',
					$target    = $element.find( '.repeater-rows' ),
					rowTitle   = 'undefined' !== typeof option ? option.row_title : false,
					rows       = false;

				if ( 'string' === typeof values && '' !== values ) {
					try {
						if ( FusionPageBuilderApp.base64Encode( FusionPageBuilderApp.base64Decode( values ) ) === values ) {
							values = FusionPageBuilderApp.base64Decode( values );
							values = _.unescape( values );
							values = JSON.parse( values );
							rows   = true;
						}
					} catch ( e ) {
						console.warn( 'Something went wrong! Error triggered - ' + e );
					}
				} else if ( ! option.skip_empty_row ) {
					self.createRepeaterRow( fields, {}, $target, rowTitle );
				}

				// Create the rows for existing values.
				if ( 'object' === typeof values && rows ) {
					_.each( values, function( field, index ) {
						self.createRepeaterRow( fields, values[ index ], $target, rowTitle );
					} );
				}

				// Repeater row add click event.
				$element.on( 'click', '.repeater-row-add', function( event ) {
					event.preventDefault();
					self.createRepeaterRow( fields, {}, $target, rowTitle );
				} );

				// Repeater row remove click event.
				$element.on( 'click', '.repeater-row-remove', function( event ) {
					event.preventDefault();
					jQuery( this ).parents( '.repeater-row' ).first().remove();
				} );

				$element.on( 'click', '.repeater-title', function() {
					jQuery( this ).parent().find( '.repeater-fields' ).slideToggle( 300 );
					if ( jQuery( this ).find( '.repeater-toggle-icon' ).hasClass( 'fusiona-plus2' ) ) {
						jQuery( this ).find( '.repeater-toggle-icon' ).removeClass( 'fusiona-plus2' ).addClass( 'fusiona-minus' );
					} else {
						jQuery( this ).find( '.repeater-toggle-icon' ).removeClass( 'fusiona-minus' ).addClass( 'fusiona-plus2' );
					}
				} );

				$element.sortable( {
					handle: '.repeater-title',
					items: '.repeater-row',
					cursor: 'move',
					cancel: '.repeater-row-remove',
					update: function() {
					}
				} );

			},

			createRepeaterRow: function( fields, values, $target, rowTitle ) {
				var $html      = '',
					attributes = {},
					repeater   = FusionPageBuilder.template( jQuery( '#fusion-app-repeater-fields' ).html() ),
					depFields  = {},
					value;

				rowTitle = 'undefined' !== typeof rowTitle && rowTitle ? rowTitle : 'Repeater Row';

				$html += '<div class="repeater-row">';
				$html += '<div class="repeater-title">';
				$html += '<span class="repeater-toggle-icon fusiona-plus2"></span>';
				$html += '<h3>' + rowTitle + '</h3>';
				$html += '<span class="repeater-row-remove fusiona-plus2"></span>';
				$html += '</div>';
				$html += '<ul class="repeater-fields">';

				_.each( fields, function( field ) {
					value = values[ field.param_name ];
					depFields[ field.param_name ] = field;
					attributes = {
						field: field,
						value: value
					};
					$html += jQuery( repeater( attributes ) ).html();
				} );

				$html += '</ul>';
				$html += '</div>';

				this.optionInit( $target.append( $html ).children( 'div:last-child' ) );

				// Check option dependencies
				if ( 'undefined' !== typeof this.model && 'undefined' !== typeof this.model.get ) {
					FusionPageBuilderApp.checkOptionDependency( fusionAllElements[ this.model.get( 'element_type' ) ], $target.children( 'div:last-child' ), false, depFields, this.$el );
				}
			},

			renderAttachments: function( ids, $multipleImageContainer ) {
				var $imageHTML,
					attachment,
					imageSizes,
					thumbnail,
					image;

				if ( 0 < ids.length ) {
					jQuery.each( ids, function( index, id ) {
						if ( '' !== id && 'NaN' !== id ) {
							attachment = wp.media.attachment( id );
							imageSizes = attachment.get( 'sizes' );

							if ( 'undefined' !== typeof imageSizes[ '200' ] ) {
								image = imageSizes[ '200' ].url;
							} else if ( 'undefined' !== typeof imageSizes.thumbnail ) {
								image = imageSizes.thumbnail.url;
							} else {
								image = attachment.get( 'url' );
							}

							$imageHTML  = '<div class="fusion-multi-image" data-image-id="' + attachment.get( 'id' ) + '">';
							$imageHTML += '<img src="' + image + '"/>';
							$imageHTML += '<span class="fusion-multi-image-remove dashicons dashicons-no-alt"></span>';
							$imageHTML += '</div>';
							$multipleImageContainer.append( $imageHTML );
						}
					} );
				}
			},

			fusionSanitize: function( str ) {

				var map = {
						'À': 'A',
						'Á': 'A',
						'Â': 'A',
						'Ã': 'A',
						'Ä': 'A',
						'Å': 'A',
						'Æ': 'AE',
						'Ç': 'C',
						'È': 'E',
						'É': 'E',
						'Ê': 'E',
						'Ë': 'E',
						'Ì': 'I',
						'Í': 'I',
						'Î': 'I',
						'Ï': 'I',
						'Ð': 'D',
						'Ñ': 'N',
						'Ò': 'O',
						'Ó': 'O',
						'Ô': 'O',
						'Õ': 'O',
						'Ö': 'O',
						'Ø': 'O',
						'Ù': 'U',
						'Ú': 'U',
						'Û': 'U',
						'Ü': 'U',
						'Ý': 'Y',
						'ß': 's',
						'à': 'a',
						'á': 'a',
						'â': 'a',
						'ã': 'a',
						'ä': 'a',
						'å': 'a',
						'æ': 'ae',
						'ç': 'c',
						'è': 'e',
						'é': 'e',
						'ê': 'e',
						'ë': 'e',
						'ì': 'i',
						'í': 'i',
						'î': 'i',
						'ï': 'i',
						'ñ': 'n',
						'ò': 'o',
						'ó': 'o',
						'ô': 'o',
						'õ': 'o',
						'ö': 'o',
						'ø': 'o',
						'ù': 'u',
						'ú': 'u',
						'û': 'u',
						'ü': 'u',
						'ý': 'y',
						'ÿ': 'y',
						'Ā': 'A',
						'ā': 'a',
						'Ă': 'A',
						'ă': 'a',
						'Ą': 'A',
						'ą': 'a',
						'Ć': 'C',
						'ć': 'c',
						'Ĉ': 'C',
						'ĉ': 'c',
						'Ċ': 'C',
						'ċ': 'c',
						'Č': 'C',
						'č': 'c',
						'Ď': 'D',
						'ď': 'd',
						'Đ': 'D',
						'đ': 'd',
						'Ē': 'E',
						'ē': 'e',
						'Ĕ': 'E',
						'ĕ': 'e',
						'Ė': 'E',
						'ė': 'e',
						'Ę': 'E',
						'ę': 'e',
						'Ě': 'E',
						'ě': 'e',
						'Ĝ': 'G',
						'ĝ': 'g',
						'Ğ': 'G',
						'ğ': 'g',
						'Ġ': 'G',
						'ġ': 'g',
						'Ģ': 'G',
						'ģ': 'g',
						'Ĥ': 'H',
						'ĥ': 'h',
						'Ħ': 'H',
						'ħ': 'h',
						'Ĩ': 'I',
						'ĩ': 'i',
						'Ī': 'I',
						'ī': 'i',
						'Ĭ': 'I',
						'ĭ': 'i',
						'Į': 'I',
						'į': 'i',
						'İ': 'I',
						'ı': 'i',
						'Ĳ': 'IJ',
						'ĳ': 'ij',
						'Ĵ': 'J',
						'ĵ': 'j',
						'Ķ': 'K',
						'ķ': 'k',
						'Ĺ': 'L',
						'ĺ': 'l',
						'Ļ': 'L',
						'ļ': 'l',
						'Ľ': 'L',
						'ľ': 'l',
						'Ŀ': 'L',
						'ŀ': 'l',
						'Ł': 'l',
						'ł': 'l',
						'Ń': 'N',
						'ń': 'n',
						'Ņ': 'N',
						'ņ': 'n',
						'Ň': 'N',
						'ň': 'n',
						'ŉ': 'n',
						'Ō': 'O',
						'ō': 'o',
						'Ŏ': 'O',
						'ŏ': 'o',
						'Ő': 'O',
						'ő': 'o',
						'Œ': 'OE',
						'œ': 'oe',
						'Ŕ': 'R',
						'ŕ': 'r',
						'Ŗ': 'R',
						'ŗ': 'r',
						'Ř': 'R',
						'ř': 'r',
						'Ś': 'S',
						'ś': 's',
						'Ŝ': 'S',
						'ŝ': 's',
						'Ş': 'S',
						'ş': 's',
						'Š': 'S',
						'š': 's',
						'Ţ': 'T',
						'ţ': 't',
						'Ť': 'T',
						'ť': 't',
						'Ŧ': 'T',
						'ŧ': 't',
						'Ũ': 'U',
						'ũ': 'u',
						'Ū': 'U',
						'ū': 'u',
						'Ŭ': 'U',
						'ŭ': 'u',
						'Ů': 'U',
						'ů': 'u',
						'Ű': 'U',
						'ű': 'u',
						'Ų': 'U',
						'ų': 'u',
						'Ŵ': 'W',
						'ŵ': 'w',
						'Ŷ': 'Y',
						'ŷ': 'y',
						'Ÿ': 'Y',
						'Ź': 'Z',
						'ź': 'z',
						'Ż': 'Z',
						'ż': 'z',
						'Ž': 'Z',
						'ž': 'z',
						'ſ': 's',
						'ƒ': 'f',
						'Ơ': 'O',
						'ơ': 'o',
						'Ư': 'U',
						'ư': 'u',
						'Ǎ': 'A',
						'ǎ': 'a',
						'Ǐ': 'I',
						'ǐ': 'i',
						'Ǒ': 'O',
						'ǒ': 'o',
						'Ǔ': 'U',
						'ǔ': 'u',
						'Ǖ': 'U',
						'ǖ': 'u',
						'Ǘ': 'U',
						'ǘ': 'u',
						'Ǚ': 'U',
						'ǚ': 'u',
						'Ǜ': 'U',
						'ǜ': 'u',
						'Ǻ': 'A',
						'ǻ': 'a',
						'Ǽ': 'AE',
						'ǽ': 'ae',
						'Ǿ': 'O',
						'ǿ': 'o',
						'α': 'a',
						'Α': 'A',
						'β': 'v',
						'Β': 'V',
						'γ': 'g',
						'Γ': 'G',
						'δ': 'd',
						'Δ': 'D',
						'ε': 'e',
						'Ε': 'E',
						'ζ': 'z',
						'Ζ': 'Z',
						'η': 'i',
						'Η': 'I',
						'θ': 'th',
						'Θ': 'TH',
						'ι': 'i',
						'Ι': 'I',
						'κ': 'k',
						'Κ': 'K',
						'λ': 'l',
						'Λ': 'L',
						'μ': 'm',
						'Μ': 'M',
						'ν': 'n',
						'Ν': 'N',
						'ξ': 'ks',
						'Ξ': 'KS',
						'ο': 'o',
						'Ο': 'O',
						'π': 'p',
						'Π': 'P',
						'ρ': 'r',
						'Ρ': 'R',
						'σ': 's',
						'Σ': 'S',
						'ς': 's',
						'τ': 't',
						'Τ': 'T',
						'υ': 'y',
						'Υ': 'Y',
						'φ': 'f',
						'Φ': 'F',
						'χ': 'x',
						'Χ': 'X',
						'ψ': 'ps',
						'Ψ': 'PS',
						'ω': 'o',
						'Ω': 'O',
						' ': '_',
						'\'': '',
						'?': '',
						'/': '',
						'\\': '',
						'.': '',
						',': '',
						'`': '',
						'>': '',
						'<': '',
						'"': '',
						'[': '',
						']': '',
						'|': '',
						'{': '',
						'}': '',
						'(': '',
						')': ''
					},
					nonWord = /\W/g,
					mapping = function ( c ) {
						return ( map[ c ] !== undefined ) ? map[ c ] : c;
					};
				return str.replace( nonWord, mapping ).toLowerCase();
			}
		} );

		_.extend( FusionPageBuilder.ElementSettingsView.prototype, FusionPageBuilder.options.fusionDynamicData );
	} );
}( jQuery ) );
