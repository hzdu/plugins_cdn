var TVE = window.TVE || {};
var isBlockType = false;
( function ( $ ) {
	/**
	 * On TCB Main Ready
	 */
	$( window ).on( 'tcb_main_ready', function () {

		if ( [ 'tvo_display', 'tvo_capture' ].includes( TVE.CONST.post.post_type ) ) {
			isBlockType = true;
			TVE.StorageManager.unset( 'tvo_block-' + TVE.CONST.post.ID );
		}

		TVE.main.on( 'device_change', function () {
			TVE.inner_$( '.thrlider-slider' ).each( function () {
				TVE.inner_$( this ).parent().thrlider( 'redraw' );
			} )
		} );

		TVE.main.on( 'tcb_auth_login', function ( data ) {
			/* update the nonce after the user logs in back */
			TVO_Front.nonce = data.rest_nonce;
		} );

		TVE.add_action( 'tve.save_post.success', function () {
			TVE.StorageManager.set( 'tvo_block-' + TVE.CONST.post.ID, true );
		} );
		TVE.add_filter( 'editor_loaded_callback', function () {
			if ( isBlockType ) {
				TVE.Editor_Page.focus_element( TVE.Editor_Page.editor.children().first() );
			}
		} )

		TVE.TVO = {
			captureSettingsModal: {},
			captureTemplateModal: {},
			displaySettingsModal: {},
			displayTemplateModal: {},
			defaults: {
				display: {
					template: 'grid/default-template-grid',
					tags: [],
					testimonials: [],
					name: '',
					show_title: 1,
					show_role: 1,
					show_site: 0,
					type: 'display',
					max_testimonials: 0
				},
				capture: {
					id: 0,
					template: 'default-template',
					type: 'capture',
					name_label: 'Full Name',
					title_label: 'Testimonial Title',
					email_label: 'Email',
					role_label: 'Role',
					website_url_label: 'Website URL',
					name_required: 1,
					title_required: 0,
					email_required: 0,
					role_required: 0,
					role_display: 0,
					title_display: 0,
					image_display: 1,
					reCaptcha_option: 0,
					on_success_option: 'message',
					on_success: 'Thanks for submitting your testimonial.',
					button_text: 'Submit',
					questions: [ 'What was your experience with our product like?' ],
					placeholders: [ '' ],
					questions_required: [ 1 ],
					tags: '',
					color_class: ''
				}
			},
			config: {
				key: '__CONFIG_tvo_shortcode__',
				update: function ( $element, key, value ) {
					var _data = this.get();
					_data[ key ] = value;
					this.save( _data );
				},
				save: function ( $config, data ) {
					if ( ! $config.hasClass( 'thrive-shortcode-config' ) ) {
						$config = $config.find( '.thrive-shortcode-config' );
					}

					if ( $config.length === 0 ) {
						return false;
					}

					$config.html( this.key + JSON.stringify( data ).replace( /\\"/g, '_tve_quote_' ) + this.key );
				},
				get: function ( $config ) {
					if ( ! $config.hasClass( 'thrive-shortcode-config' ) ) {
						$config = $config.find( '.thrive-shortcode-config' );
					}

					if ( $config.length === 0 ) {
						return false;
					}

					var replace = new RegExp( this.key, 'g' );

					return JSON.parse( $config.html().replace( /_tveutf8_/g, '\\u' ).replace( replace, '' ).replace( /\\\'/g, "'" ).replace( /_tve_quote_/g, '\\"' ) );
				}
			},
			/**
			 * Return wrapper for a specific element inside another one.
			 * If the element does not exists it get created as a div child.
			 * @param $element
			 * @param selector
			 * @returns {*}
			 */
			getWrapper: function ( $element, selector ) {
				var $wrapper = $element.find( selector );

				if ( $wrapper.length === 0 ) {
					$wrapper = $( '<div>' ).attr( selector[ 0 ] === '.' ? 'class' : 'id', selector.substring( 1 ) ).appendTo( $element );
				}

				return $wrapper;
			},
			/**
			 * Get html template based on the shortcode config
			 * @param $modal
			 * @param config
			 */
			ajaxRender: function ( $modal, config ) {

				$modal.$el.addClass( 'loading' );

				var self = this;

				$.ajax( {
					headers: {
						'X-WP-Nonce': TVO_Front.nonce
					},
					cache: false,
					data: {
						config: config
					},
					method: "POST",
					url: TVO_Front.routes.shortcodes + '/render'
				} ).done( function ( response ) {
					self.updateElement( TVE.ActiveElement, response, $modal );
					TVE.ActiveElement.find( '.thrlider-slider' ).parent().thrlider( 'redraw' );
				} ).fail( function ( response ) {
					console.error( response );
				} )
			},
			/**
			 * Update the element html and config
			 * @param $element
			 * @param data
			 * @param $modal
			 */
			updateElement: function ( $element, data, $modal ) {

				//save active element custom_css if we need to update them
				var styles = {};
				if ( $element.attr( 'data-update-styles' ) ) {
					styles = $.extend( {}, TVE.TVO.config.get( $element.find( '.thrive-shortcode-config' ) ).custom_css );
					$element.removeAttr( 'data-update-styles' );

					//we need to update the config by adding the styles
					data.config.custom_css = styles;
				}

				/* remove the placeholder and empty the element so we can add a new one */
				$element.removeClass( 'tcb-elem-placeholder' );
				$element.empty();

				/* save the config and hide it */
				TVE.TVO.config.save( TVE.TVO.getWrapper( $element, '.thrive-shortcode-config' ).hide(), data.config );

				TVE.TVO.getWrapper( $element, '.thrive-shortcode-html' ).html( data.html );

				/* add the previous styles to the $element's sub-elements*/
				for ( var selector in styles ) {
					$element.find( selector ).attr( 'data-css', styles[ selector ] )
				}

				/* update the new config */
				$element.data( 'config', data.config );

				setTimeout( function () {
					/* update the current component */
					$modal.component && $modal.component.update();
					/* reposition the icons if needed */
					TVE.Editor_Page.reposition_icons();
				}, 500 );

				$modal.close();
				$modal.$el.removeClass( 'loading' );
				TVE.Editor_Page.focus_element( $element );
			}
		};

		TVE.Views.Components.ovation_capture = TVE.Views.Base.component.extend( {
			controls_init: function ( controls ) {
				this.template_modal = new TVE.TVO.captureTemplateModal( {
					el: TVE.modal.get_element( 'capture-testimonial-templates-lightbox' )
				} );

				this.settings_modal = new TVE.TVO.captureSettingsModal( {
					el: TVE.modal.get_element( 'capture-form-settings-lightbox' )
				} );

				controls[ 'ButtonColor' ].getButtonStyle = function () {
					var style = '',
						template = TVE.ActiveElement.data( 'config' ).template;

					switch ( template ) {
						case 'default-template':
							style = 'background';
							break;

						case 'set1-template':
							style = 'background';
							break;
						case 'set2-template':
							style = 'border-color';
							break;
					}

					return style;

				};

				controls[ 'ButtonColor' ].update = function () {
					this.setValue( this.applyTo().css( this.getButtonStyle() ) );
				};

				controls[ 'ButtonColor' ].input = function ( color ) {
					var css = {}, style = this.getButtonStyle(),
						$config = TVE.ActiveElement.find( '.thrive-shortcode-config' ),
						config = TVE.TVO.config.get( $config );

					css[ style ] = color + '!important';
					if ( style === 'border-color' ) {
						css[ 'color' ] = color + '!important';
					}

					this.applyTo().head_css( css );

					config.custom_css = config.custom_css || {};
					config.custom_css[ this.model.to ] = this.applyTo().data( 'css' );
					/* save the custom css id so we can apply it on display */
					TVE.TVO.config.save( $config, config );
				};
			},
			placeholder_action: function ( $element ) {
				$element.data( 'config', TVE.TVO.defaults.capture );

				this.template_modal.open( {template: TVE.TVO.defaults.capture.template, component: this} );
			},
			before_update: function () {
				var $element = TVE.ActiveElement,
					config = TVE.TVO.config.get( $element ) || TVE.TVO.defaults.capture;

				$element.data( 'config', config );
			},
			change_template: function () {
				var config = TVE.ActiveElement.data( 'config' );

				this.template_modal.open( {template: config.template, component: this} );
			},
			form_settings: function () {
				var config = TVE.ActiveElement.data( 'config' );

				this.settings_modal.open( {config: config, component: this} );
			}

		} );

		TVE.TVO.captureTemplateModal = TVE.modal.base.extend( {
			before_open: function ( options ) {
				/* if we have an template, mark it as selected */
				if ( options.template && options.template.length > 0 ) {
					this.$( '.tvo-template' ).each( function () {
						this.dataset.value === options.template ? this.classList.add( 'current' ) : this.classList.remove( 'current' );
					} );
				}

				this.component = options.component;
			},
			save: function () {
				var config = TVE.ActiveElement.data( 'config' );

				config.template = this.$( '.tvo-template.current' ).data( 'value' );

				TVE.TVO.ajaxRender( this, config );
			},
			select: function ( event, dom ) {
				/* lol, just having some fun with js */
				dom.parentNode.childNodes.forEach( function ( element ) {
					element.nodeType !== Node.TEXT_NODE && element.classList.remove( 'current' );
				} );

				dom.classList.add( 'current' );
			}
		} );

		TVE.TVO.captureSettingsModal = TVE.modal.base.extend( {
			before_open: function ( options ) {
				var config = options.config || {};

				/* apply settings for the shortcode from the config */
				this.applySettings( config );

				this.component = options.component;
			},
			save: function () {
				TVE.TVO.ajaxRender( this, this.readSettings( TVE.ActiveElement.data( 'config' ) ) );
			},
			applySettings: function ( settings ) {
				this.$( '.tvo_config_field' ).each( function () {
					if ( this.type === 'checkbox' ) {
						this.checked = parseInt( settings[ this.name ] ) === 1
					} else {
						this.value = settings[ this.name ];
					}
				} );

				this.$( '.tvo-question' ).remove();
				/* re-add all the questions and mark the first one as default */
				settings.questions.forEach( function ( question, index ) {
					$( '<div>', {
						class: 'tvo-row tvo-collapse tvo-question' + ( index === 0 ? ' tvo-default-question' : '' ),
						html: TVO_Front.tpl( 'new-question' )( {index: index, question: question, config: settings} )
					} ).insertBefore( '.tvo-add-question' );
				} );

				this.$( '.tvo-all-tags' ).val( settings.tags ).trigger( 'change' );
			},
			readSettings: function ( settings ) {
				this.$( '.tvo_config_field' ).each( function () {
					settings[ this.name ] = ( this.type === 'checkbox' ? ( this.checked ? 1 : 0 ) : this.value )
				} );

				settings.tags = this.$( '.tvo-all-tags' ).val();

				settings.questions = [];
				settings.placeholders = [];
				settings.questions_required = [];

				this.$( '.tvo-question' ).each( function ( index ) {
					var $this = $( this );
					settings.questions[ index ] = $this.find( '.tvo-question-input' ).val();
					settings.placeholders[ index ] = $this.find( '.tvo-placeholder-input' ).val();
					settings.questions_required[ index ] = $this.find( '.tvo-required' ).is( ':checked' ) ? 1 : 0;
				} );

				return settings;
			}
		} );

		TVE.Views.Components.ovation_display = TVE.Views.Base.component.extend( {
			controls_init: function ( controls ) {
				var self = this;

				this.template_modal = new TVE.TVO.displayTemplateModal( {
					el: TVE.modal.get_element( 'display-testimonial-templates-lightbox' )
				} );

				this.settings_modal = new TVE.modal.base( {
					el: TVE.modal.get_element( 'display-settings-lightbox' )
				} );

				/* all the controls are color pickers so we treat them all the same */
				_.each( controls, function ( control ) {
					control.update = function () {
						this.setValue( this.applyTo().css( control.model.config.style ) );
					};

					control.input = function ( color ) {
						var css = {},
							$config = TVE.ActiveElement.find( '.thrive-shortcode-config' ),
							config = TVE.TVO.config.get( $config );

						/* on some rare occasions we have a border so we have to treat it in a special way. */
						if ( control.model.config.style.indexOf( 'border' ) !== - 1 ) {
							css[ 'border' ] = '1px solid';
						}

						css[ control.model.config.style ] = color + '!important';
						this.applyTo().head_css( css, false, '', false, TVE.CONST.global_css_prefix + ' ' );

						config.custom_css = config.custom_css || {};
						config.custom_css[ control.model.to ] = this.applyTo().first().data( 'css' );
						/* save the custom css id so we can apply it on display */
						TVE.TVO.config.save( $config, config );
					};
				} );

				$( document ).on( 'tvo.get.shortcode', function ( event, config ) {
					var currentConfig = TVE.ActiveElement.data( 'config' );

					/* we keep the template from the current config, not the saved one. */
					config.template = currentConfig.template;

					/* remove the id because we will use the config to render the template */
					config.id && delete config.id;

					TVE.TVO.ajaxRender( self.settings_modal, _.extend( currentConfig, config ) );
				} );

				$( document ).on( 'tvo.save.shortcode', function ( event, config ) {
					var $element = TVE.ActiveElement,
						currentConfig = $element.data( 'config' );

					currentConfig = _.extend( currentConfig, config );

					self.settings_modal.$el.addClass( 'loading' );

					$.ajax( {
						headers: {
							'X-WP-Nonce': TVO_Front.nonce
						},
						cache: false,
						url: TVO_Front.routes.shortcodes,
						type: 'POST',
						data: {
							name: currentConfig.name,
							type: 'display',
							config: currentConfig,
							content: '',
							html: 1
						}
					} ).done( function ( response ) {
						TVE.TVO.updateElement( $element, response, self.settings_modal );
					} );
				} );
			},
			placeholder_action: function () {
				TVE.ActiveElement.data( 'config', TVE.TVO.defaults.display );

				this.template_modal.open( {init: true, template: TVE.TVO.defaults.display.template, component: this} )
			},
			after_update: function () {
				var $element = TVE.ActiveElement,
					config = TVE.TVO.config.get( $element ) || TVE.TVO.defaults.display;

				TVO_Front.active_config = config;

				$element.data( 'config', config );

				/* not all templates can be fully customized => we display only controls that can change something for the current element */
				_.each( this.controls, function ( control ) {
					setTimeout( function () {
						if ( control.applyTo().length === 0 ) {
							control.hide();
						} else {
							control.show();
						}
					}, 10 );
				} )
			},
			display_settings: function ( event, dom, route ) {
				this.settings_modal.open();

				Backbone.history.stop();
				Backbone.history.start();

				route = route ? route : '#pre-select';

				TVO_Front.router.navigate( route, {trigger: true} );
			},
			change_template: function () {
				var config = TVE.ActiveElement.data( 'config' );

				this.template_modal.open( {template: config.template, component: this} );
			}
		} );

		TVE.TVO.displayTemplateModal = TVE.modal.base.extend( {
			before_open: function ( options ) {
				if ( options.template && options.template.length > 0 ) {
					this.$( '.tvo-template' ).each( function () {
						this.dataset.value === options.template ? this.classList.add( 'current' ) : this.classList.remove( 'current' );
					} );
				}

				this.init = options && options.init;
				this.component = options && options.component;
			},
			save: function () {
				var config = TVE.ActiveElement.data( 'config' );

				//when we pick the template, the ajax should send an empty custom_css for the config
				if ( config.custom_css ) {
					config.custom_css = {};
				}

				config.template = this.$( '.tvo-template.current' ).data( 'value' );

				if ( this.init ) {
					/* on the first time, after we chose the template we go to the settings page */
					TVE.ActiveElement.data( 'config', config );
					this.close();
					this.component.display_settings( {}, {}, '#start' );
				} else {
					TVE.TVO.ajaxRender( this, config );
				}
			},
			select: function ( event, dom ) {
				/* lol, just having some fun with js */
				dom.parentNode.childNodes.forEach( function ( element ) {
					element.nodeType !== Node.TEXT_NODE && element.classList.remove( 'current' );
				} );

				dom.classList.add( 'current' );
			}
		} );

		TVE.add_filter( 'should_have_width_on_float', function ( list ) {
			list.push( 'thrv_tvo_capture_testimonials' );

			return list;
		} );
	} );

} )( jQuery );
