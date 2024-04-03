/* global FusionApp, FusionPageBuilderApp, FusionEvents */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	FusionPageBuilder.offCanvasStyles = Backbone.Model.extend( {

		/**
		 * Off Canvas Live editor preview initialization.
		 *
		 * @since 3.6
		 * @return {void}
		 */
		initialize: function() {
			const 	body 				= jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' ),
					ocID				= body.find( '.awb-off-canvas-wrap' ).attr( 'data-id' );

			this.baseSelector = '.awb-off-canvas-wrap[data-id="' + ocID + '"]';
			this.dynamic_css  = {};
			this.options     = this.filterOptions();
			this.buildAttr();

			// Remove saved styles.
			body.find( '#awb-off-canvas-style-block-' + ocID ).remove();

			this.listenTo( FusionEvents, 'awb-off-canvas-styles', this.buildStyles );
			this.listenTo( FusionEvents, 'awb-off-canvas-attr', this.buildAttr );
			this.listenTo( FusionEvents, 'awb-off-canvas-custom-close-button', this.customCloseButton );
			this.listenTo( FusionEvents, 'awb-off-canvas-enter-animation', this.enterAnimation );
			this.listenTo( FusionEvents, 'awb-off-canvas-exit-animation', this.exitAnimation );

			this.listenTo( FusionEvents, 'fusion-builder-loaded', this.buildStyles );
			this.listenTo( FusionEvents, 'fusion-builder-loaded', this.buildAttr );
			this.listenTo( FusionEvents, 'fusion-builder-loaded', this.customCloseButton );
		},

		/**
		 * Array with animations without directions.
		 *
		 * @since 3.6
		 * @return {void}
		 */
		animationsWithoutDirection: [ 'flash', 'rubberBand', 'shake', 'flipinx', 'flipiny', 'lightspeedin', 'flipOutX', 'flipOutY', 'lightSpeedOut' ],

		/**
		 * Modify options mostly for sliding bar type.
		 *
		 * @since 3.6
		 * @return {Object} Modified options object.
		 */
		filterOptions: function() {
			const options = FusionApp.data.postMeta._fusion;
			const filteredOptions = Object.assign( {}, options );

			if ( 'undefined' !== typeof options && 'sliding-bar' === options.type ) {
				filteredOptions.type = 'sliding-bar';
				filteredOptions.enter_animation = filteredOptions.sb_enter_animation;
				filteredOptions.enter_animation_speed = filteredOptions.sb_enter_animation_speed;
				filteredOptions.exit_animation = filteredOptions.sb_exit_animation;
				filteredOptions.exit_animation_speed = filteredOptions.sb_exit_animation_speed;

				if ( 'left' === filteredOptions.position || !filteredOptions.position ) {
					filteredOptions.height = 'full';
					filteredOptions.width = options.width || 400;
					filteredOptions.enter_animation_direction = 'left';
					filteredOptions.exit_animation_direction = 'left';
					filteredOptions.vertical_position = 'flex-start';
					if ( this.isRTL() ) {
						filteredOptions.horizontal_position = 'flex-end';
					} else {
						filteredOptions.horizontal_position = 'flex-start';
					}
				}

				if ( 'right' === filteredOptions.position ) {
					filteredOptions.height = 'full';
					filteredOptions.width = options.width || 400;
					filteredOptions.enter_animation_direction = 'right';
					filteredOptions.exit_animation_direction = 'right';
					filteredOptions.vertical_position = 'flex-start';
					if ( this.isRTL() ) {
						filteredOptions.horizontal_position = 'flex-start';
					} else {
						filteredOptions.horizontal_position = 'flex-end';
					}
				}

				if ( 'top' === filteredOptions.position ) {
					const height = filteredOptions.sb_height || 'auto';
					filteredOptions.width = '100vw';
					filteredOptions.height = 'custom';
					filteredOptions.custom_height = height;
					filteredOptions.enter_animation_direction = 'down';
					filteredOptions.exit_animation_direction = 'up';
					filteredOptions.vertical_position = 'flex-start';
					filteredOptions.horizontal_position = 'flex-start';
				}

				if ( 'bottom' === filteredOptions.position ) {
					const height = filteredOptions.sb_height || 'auto';
					filteredOptions.width = '100vw';
					filteredOptions.height = 'custom';
					filteredOptions.custom_height = height;
					filteredOptions.enter_animation_direction = 'up';
					filteredOptions.exit_animation_direction = 'down';
					filteredOptions.vertical_position = 'flex-end';
					filteredOptions.horizontal_position = 'flex-start';
				}
				return this.parseOptions( filteredOptions );
			}

			return this.parseOptions( options );
		},

		/**
		 * Merge default options with current options.
		 * To ensure the preview works as same as the front-end.
		 * @since 3.6
		 * @param {Object} options - The options object.
		 * @return {Object} New options object with default values.
		 */
		parseOptions( options ) {
			const defaults = {
				// General.
				'type': 'popup',
				'width': '800',
				'width_medium': '',
				'width_small': '',
				'height': 'fit',
				'custom_height': '',
				'custom_height_medium': '',
				'custom_height_small': '',
				'horizontal_position': 'center',
				'horizontal_position_medium': '',
				'horizontal_position_small': '',
				'vertical_position': 'center',
				'vertical_position_medium': '',
				'vertical_position_small': '',
				'content_layout': 'column',
				'align_content': 'flex-start',
				'valign_content': 'flex-start',
				'content_wrap': 'wrap',
				'enter_animation': '',
				'enter_animation_direction': 'static',
				'enter_animation_speed': 0.5,
				'exit_animation': '',
				'exit_animation_direction': 'static',
				'exit_animation_speed': 0.5,

				'off_canvas_state': 'closed',
				'sb_height': '',
				'position': 'left',
				'transition': 'overlap',

				'sb_enter_animation': 'slideShort',
				'sb_enter_animation_speed': 0.5,
				'sb_exit_animation': 'slideShort',
				'sb_exit_animation_speed': 0.5,

				// Design.
				'background_color': '#ffffff',
				'background_image': '',
				'background_position': 'left top',
				'background_repeat': 'repeat',
				'background_size': '',
				'background_custom_size': '',
				'background_blend_mode': 'none',
				'oc_scrollbar': 'default',
				'oc_scrollbar_background': '#f2f3f5',
				'oc_scrollbar_handle_color': '#65bc7b',
				'margin': '',
				'padding': '',
				'box_shadow': 'no',
				'box_shadow_position': '',
				'box_shadow_blur': '0',
				'box_shadow_spread': '0',
				'box_shadow_color': '',
				'border_radius': '',
				'border_width': '',
				'border_color': '',

				// Overlay.
				'overlay': 'yes',
				'overlay_z_index': '',
				'overlay_close_on_click': 'yes',
				'overlay_page_scrollbar': 'yes',
				'overlay_background_color': 'rgba(0,0,0,0.8)',
				'overlay_background_image': '',
				'overlay_background_position': 'left top',
				'overlay_background_repeat': 'repeat',
				'overlay_background_size': '',
				'overlay_background_custom_size': '',
				'overlay_background_blend_mode': 'none',

				// close button.
				'close_button': 'yes',
				'close_on_esc': 'yes',
				'close_button_position': 'right',
				'close_button_margin': {},
				'close_button_color': '',
				'close_button_color_hover': '',
				'close_icon_size': '16',
				'close_button_custom_icon': ''
			};

			return Object.assign( defaults, options );
		},

		/**
		 * Adds CSS property to object.
		 *
		 * @since  3.2
		 * @param  {String} selectors - The CSS selectors.
		 * @param  {String} property - The CSS property.
		 * @param  {String} value - The CSS property value.
		 * @param  {Bool}   important - Should have important tag.
		 * @return {void}
		 */
		addCssProperty: function ( selectors, property, value, important ) {

			if ( 'object' === typeof selectors ) {
				selectors = Object.values( selectors );
			}

			if ( 'object' === typeof selectors ) {
				selectors = selectors.join( ',' );
			}

			if ( 'object' !== typeof this.dynamic_css[ selectors ] ) {
				this.dynamic_css[ selectors ] = {};
			}

			if ( 'undefined' !== typeof important && important ) {
				value += ' !important';
			}
			if ( 'undefined' === typeof this.dynamic_css[ selectors ][ property ] || ( 'undefined' !== typeof important && important ) || ! this.dynamic_css[ selectors ][ property ].includes( 'important' ) ) {
				this.dynamic_css[ selectors ][ property ] = value;
			}
		},

		/**
		 * Parses CSS.
		 *
		 * @since  3.2
		 * @return {String}
		 */
		parseCSS: function () {
			var css = '';
			if ( 'object' !== typeof this.dynamic_css ) {
				return '';
			}

			_.each( this.dynamic_css, function ( properties, selector ) {
				if ( 'object' === typeof properties ) {
					css += selector + '{';
					_.each( properties, function ( value, property ) {
						css += property + ':' + value + ';';
					} );
					css += '}';
				}
			} );

			return css;
		},

		/**
		 * Checks if param has got default value or not.
		 *
		 * @since  3.2
		 * @param  {String} param - The param.
		 * @return {Bool}
		 */
		isDefault: function( param, subset ) {
			if ( 'string' === typeof subset ) {
				return 'undefined' === typeof this.options[ param ] || 'undefined' === typeof this.options[ param ][ subset ] || '' === this.options[ param ][ subset ];
			}
			return 'undefined' === typeof this.options[ param ] || '' === this.options[ param ];
		},

		/**
		 * Checks if website using RTL language.
		 *
		 * @since  3.6
		 * @return {Bool}
		 */
		isRTL: function () {
			return jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' ).hasClass( 'rtl' );
		},

		/**
		 * Get CSS from spacing fields.
		 * used for margin, padding, position, etc.
		 * @since 3.6
		 * @param {Object} options - The options object.
		 * @param {String} key - options key.
		 * @param {String} prop - CSS property, if empty key will used instead.
		 * @return {String} CSS code.
		 */
		getSpacing: function( options, key ) {
			if ( !options[ key ] && 'object' !== typeof options[ key ] ) {
				return [];
			}
			const vars = [];

			const keys = [ 'top', 'right', 'bottom', 'left' ];

			keys.forEach( ( k ) => {
				const v = options[ key ][ k ] || '';
				if ( '' !== v ) {
					vars[ key + '_' + k ] = _.fusionGetValueWithUnit( v );
				}
			} );

			return vars;
		},

		/**
		 * Get CSS code for box shadow.
		 *
		 * @since 3.6
		 * @param {Object} options - The options object.
		 * @return {String} CSS code.
		 */
		getShadow( options ) {
			if ( 'yes' !== options.box_shadow ) {
				return '';
			}
			let 	h 		= '0',
					v 		= '0';
			const 	blur 	= options.box_shadow_blur || '0',
					spread	= options.box_shadow_spread || '0',
					color	= options.box_shadow_color || '';
			if ( options.box_shadow_position && 'object' === typeof options.box_shadow_position ) {
				h = options.box_shadow_position.horizontal || h;
				v = options.box_shadow_position.vertical || v;
			}

			return `${_.fusionGetValueWithUnit( h )} ${_.fusionGetValueWithUnit( v )} ${_.fusionGetValueWithUnit( blur )} ${_.fusionGetValueWithUnit( spread )} ${color}`;
		},

		/**
		 * Get CSS code for borders including border radius.
		 *
		 * @since 3.6
		 * @param {Object} options - The options object.
		 * @return {String} CSS code.
		 */
		getBorder( options ) {
			const vars = [];

			// Border radius.
			if ( options.border_radius && 'object' === typeof options.border_radius ) {
				const br = options.border_radius;
				// ensure preview works when delete value.
				if ( !br.top_left ) {
					br.top_left = '';
				}
				if ( !br.top_right ) {
					br.top_right = '';
				}
				if ( !br.bottom_right ) {
					br.bottom_right = '';
				}
				if ( !br.bottom_left ) {
					br.bottom_left = '';
				}
				// loop through border radius.
				Object.keys( br ).forEach( ( r ) => {
					const v = br[ r ] || 0;
					vars[ `border_${r}_radius` ] = _.fusionGetValueWithUnit( v );
				} );
			}

			// Border width.
			if ( options.border_width && 'object' === typeof options.border_width ) {
				const bw = options.border_width;
				// ensure preview works when delete value.
				if ( !bw.top ) {
					bw.top = '';
				}
				if ( !bw.right ) {
					bw.right = '';
				}
				if ( !bw.bottom ) {
					bw.bottom = '';
				}
				if ( !bw.left ) {
					bw.left = '';
				}

				Object.keys( bw ).forEach( ( b ) => {
					const v = bw[ b ] || 0;
					vars[ `border_${b}_width` ] = _.fusionGetValueWithUnit( v );
				} );
			}
			// Border color.
			if ( options.border_color ) {
				vars.border_color = options.border_color;
			}
			return vars;
		},

		/**
		 * Build CSS style block and add it to the head.
		 *
		 * @since 3.6
		 * @return {void} CSS code.
		 */
		buildStyles: function() {
			var selectors,
				css = '';

			this.dynamic_css = {};

			const options = this.filterOptions();

			// Add style variables.
			const body = jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' );
			body.find( this.baseSelector ).attr( 'style', this.getStylesVars() );

			// Fix close button z-index in LE.
			selectors = [ this.baseSelector + ' .awb-off-canvas:hover .off-canvas-close' ];
			this.addCssProperty( selectors, 'display',  'none' );

			// Close button.
			selectors = [ this.baseSelector + ' .off-canvas-close' ];
			if ( 'no' === options.close_button ) {
				this.addCssProperty( selectors, 'display', 'none' );
			}

			// Add attribute to the option.
			const value = jQuery( '[data-option-id="content_layout"]' ).find( 'input#content_layout' ).val();
			jQuery( '[data-option-id="content_layout"]' ).attr( 'data-direction', value );

			// hidden scrollbar.
			if ( 'hidden' === options.oc_scrollbar ) {
				selectors = [ this.baseSelector + ' .off-canvas-content' ];
				// Firefox.
				this.addCssProperty( selectors, 'scrollbar-width',  'none' );

				// Chrome, Safari, Edge.
				this.addCssProperty( [ this.baseSelector + ' .off-canvas-content::-webkit-scrollbar' ], 'display',  'none' );
			}

			css = this.parseCSS();

			if ( jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'head' ).find( '#awb-off-canvas-style-block' ).length ) {
				jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'head' ).find( '#awb-off-canvas-style-block' ).html( css );
				return;
			}

			jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'head' ).prepend( '<style id="awb-off-canvas-style-block">' + css + '</style>' );


		},

		/**
		 * Build style variables.
		 *
		 * @since 3.9
		 * @return String CSS variables.
		 */
		getStylesVars: function() {
			const options = this.filterOptions();
			let vars = {};

			if ( options.horizontal_position ) {
				vars.horizontal_position = options.horizontal_position;
			}

			if ( options.horizontal_position_medium ) {
				vars.horizontal_position_medium = options.horizontal_position_medium;
			}

			if ( options.horizontal_position_small ) {
				vars.horizontal_position_small = options.horizontal_position_small;
			}

			if ( options.vertical_position ) {
				vars.vertical_position = options.vertical_position;
			}

			if ( options.vertical_position_medium ) {
				vars.vertical_position_medium = options.vertical_position_medium;
			}

			if ( options.vertical_position_small ) {
				vars.vertical_position_small = options.vertical_position_small;
			}

			if ( options.overlay_z_index ) {
				vars.overlay_z_index = options.overlay_z_index;
			}

			// Overlay Background.
			if ( 'yes' === options.overlay ) {
				if ( options.overlay_background_color ) {
					vars.overlay_background_color = options.overlay_background_color;
				}

				if ( options.overlay_background_image ) {
					let overlay_background_image = options.overlay_background_image;
					if ( _.isObject( overlay_background_image ) ) {
						overlay_background_image = overlay_background_image.url;
					}
					vars.overlay_background_image = `url(${overlay_background_image})`;

					if ( options.overlay_background_repeat ) {
						vars.overlay_background_repeat = options.overlay_background_repeat;
					}

					if ( options.overlay_background_position ) {
						vars.overlay_background_position = options.overlay_background_position;
					}

					if ( options.overlay_background_blend_mode ) {
						vars.overlay_background_blend_mode = options.overlay_background_blend_mode;
					}

					if ( '' !== options.overlay_background_size ) {
						if ( 'custom' === options.overlay_background_size ) {
							const width       = options.overlay_background_custom_size.width ? _.fusionGetValueWithUnit( options.overlay_background_custom_size.width ) : '';
							const height      = options.overlay_background_custom_size.height ? _.fusionGetValueWithUnit( options.overlay_background_custom_size.height ) : '';

							// eslint-disable-next-line max-depth
							if ( width ) {
								vars.overlay_background_size = width + ' ' + height;
							}

						} else {
							vars.overlay_background_size = options.overlay_background_size;
						}
					}

				}
			}

			if ( options.width ) {
				vars.width = _.fusionGetValueWithUnit( options.width );
			}

			if ( options.width_medium ) {
				vars.width_medium = _.fusionGetValueWithUnit( options.width_medium );
			}

			if ( options.width_small ) {
				vars.width_small = _.fusionGetValueWithUnit( options.width_small );
			}

			if ( options.height ) {
				if ( 'full' === options.height ) {
					vars.height = '100vh';
				}

				if ( 'custom' === options.height ) {
					if ( options.custom_height ) {
						vars.height = _.fusionGetValueWithUnit( options.custom_height );
					}

					if ( options.custom_height_medium ) {
						vars.height_medium = _.fusionGetValueWithUnit( options.custom_height_medium );
					}

					if ( options.custom_height_small ) {
						vars.height_small = _.fusionGetValueWithUnit( options.custom_height_small );
					}
				}
			}

			// Margin.
			vars = { ...vars, ...this.getSpacing( options, 'margin' ) };

			// Padding.
			vars = { ...vars, ...this.getSpacing( options, 'padding' ) };

			vars.box_shadow = this.getShadow( options );
			vars = { ...vars, ...this.getBorder( options ) };

			if ( options.background_color ) {
				vars.background_color = options.background_color;
			}

			if ( options.background_image ) {
				let background_image = options.background_image;
				if ( _.isObject( background_image ) ) {
					background_image = background_image.url;
				}
				vars.background_image = `url(${background_image})`;

				if ( options.background_repeat ) {
					vars.background_repeat = options.background_repeat;
				}

				if ( options.background_position ) {
					vars.background_position = options.background_position;
				}

				if ( options.background_blend_mode ) {
					vars.background_blend_mode = options.background_blend_mode;
				}

				if ( '' !== options.background_size ) {
					if ( 'custom' === options.background_size ) {
						const width       = options.background_custom_size.width ? _.fusionGetValueWithUnit( options.background_custom_size.width ) : '';
						const height      = options.background_custom_size.height ? _.fusionGetValueWithUnit( options.background_custom_size.height ) : '';

						if ( width ) {
							vars.background_size = width + ' ' + height;
						}

					} else {
						vars.background_size = options.background_size;
					}
				}

			}

			// Custom Scrollbar.
			if ( 'custom' === options.oc_scrollbar ) {
				if ( options.oc_scrollbar_handle_color ) {
					vars.oc_scrollbar_handle_color = options.oc_scrollbar_handle_color;
				}

				if ( options.oc_scrollbar_background ) {
					vars.oc_scrollbar_background = options.oc_scrollbar_background;
				}
			}

			// Alignment.
			if ( options.content_layout ) {
				vars.content_layout = options.content_layout;
			}

			if ( options.align_content ) {
				vars.align_content = options.align_content;
			}

			if ( options.valign_content ) {
				vars.valign_content = options.valign_content;
			}

			if ( options.content_wrap ) {
				vars.content_wrap = options.content_wrap;
			}

			// Close button.
			vars = { ...vars, ...this.getSpacing( options, 'close_button_margin' ) };

			if ( options.close_button_color ) {
				vars.close_button_color = options.close_button_color;
			}

			if ( options.close_icon_size ) {
				vars.close_icon_size = _.fusionGetValueWithUnit( options.close_icon_size );
			}

			if ( options.close_button_color_hover ) {
				vars.close_button_color_hover = options.close_button_color_hover;
			}

			let style = '';

			Object.keys( vars ).forEach( ( v ) => {
				const var_name  = '--awb-' + v.replaceAll( '_', '-' );
				style += var_name + ':' + vars[ v ] + ';';
			} );


			return style;

		},

		/**
		 * build attributes.
		 *
		 * @since 3.6
		 * @return {String} CSS code.
		 */
		buildAttr: function() {
			const body = jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' );
			const options = this.filterOptions();

			// Wrap Classes.
			let wrapClasses = 'awb-off-canvas-wrap awb-show';
			if ( '' !== options.css_id ) {
				body.find( this.baseSelector ).attr( 'id', options.css_id );
			}

			if ( '' !== options.css_class ) {
				wrapClasses += ' ' + options.css_class;
			}
			if ( '' !== options.type ) {
				wrapClasses += ' type-' + options.type;
			}

			if ( 'sliding-bar' === options.type ) {
				if ( !options.position ) {
					options.position = 'left';
				}
				wrapClasses += ' position-' + options.position;
			}

			if ( 'no' === options.overlay ) {
				wrapClasses += ' overlay-disabled';
			}

			if ( 'custom' === options.oc_scrollbar ) {
				wrapClasses += ' has-custom-scrollbar';
			}

			if ( 'hidden' === options.oc_scrollbar ) {
				wrapClasses += ' hidden-scrollbar';
			}

			body.find( this.baseSelector ).removeClass().addClass( wrapClasses );

			body.find( this.baseSelector ).attr( 'style', this.getStylesVars() );

			// remove is empty class.
			if ( 1 < FusionPageBuilderApp.collection.length ) {
				body.find( this.baseSelector + ' .awb-off-canvas-inner' ).removeClass( 'is-empty' );
			}

			// close button attr.
			const closeButton = body.find( this.baseSelector ).find( '.off-canvas-close' );

			closeButton.removeClass( function ( index, className ) {
				return ( className.match( /(^|\s)close-position-\S+/g ) || [] ).join( ' ' );
			} );
			closeButton.addClass( 'close-position-' + options.close_button_position );

		},

		/**
		 * Custom close button.
		 *
		 * @since 3.6
		 * @return {void}.
		 */
		customCloseButton: function() {
			const options = this.filterOptions();

			const 	body 				= jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' );
			let		closeButton 		= body.find( '.off-canvas-close' );
			if ( ! closeButton.length ) {
				body.find( '.awb-off-canvas' ).prepend( '<button class="off-canvas-close"></button>' );
				closeButton = body.find( '.off-canvas-close' );
			}
			let cls = 'off-canvas-close';
			if ( options.close_button_custom_icon ) {
				cls +=  ' ' + _.fusionFontAwesome( options.close_button_custom_icon );
			} else {
				cls += ' awb-icon-close';
			}

			cls += ' close-position-' + options.close_button_position;

			closeButton.removeClass().addClass( cls );
		},

		/**
		 * Capitalize string.
		 *
		 * @since 3.6
		 * @return {String} The capitalized string.
		 */
		capitalize: function ( string ) {
			return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
		},

		/**
		 * Enter animation preview.
		 *
		 * @since 3.6
		 * @param {String} string
		 * @return {void}
		 */
		enterAnimation: function() {
			const 	body 				= jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' ),
					offCanvas			= body.find( '.awb-off-canvas' ),
					options 			= this.filterOptions();

			let     animation = options.enter_animation;
			const   animationDirection = options.enter_animation_direction && 'static' !== options.enter_animation_direction ? this.capitalize( options.enter_animation_direction ) : '',
			animationSpeed = options.enter_animation_speed || 1;

			if ( animation ) {
				if ( ! this.animationsWithoutDirection.includes( animation ) ) {
					animation = animation + 'In' + animationDirection;
				}
				offCanvas.addClass( 'fusion-animated ' + animation );
				offCanvas.attr( 'data-animation-type', animation );
				offCanvas.css( {
					'visibility': 'visible',
					'animation-duration': animationSpeed + 's'
				} );
			}
			offCanvas.addClass( 'fusion-animated ' + animation );

			offCanvas.on( 'animationend', function() {
				const   el = jQuery( this );

				if ( el.attr( 'data-animation-type' ) ) {
					el.removeClass( 'fusion-animated' ).removeClass( el.attr( 'data-animation-type' ) ).removeAttr( 'data-animation-type' );
				}
			} );
		},

		/**
		 * Exit animation preview.
		 *
		 * @since 3.6
		 * @return {void}
		 */
		exitAnimation: function() {
			const 	body 				= jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' ),
					offCanvas			= body.find( '.awb-off-canvas' ),
					options 			= this.filterOptions();

			let     animation = options.exit_animation;
			const   animationDirection = options.exit_animation_direction && 'static' !== options.exit_animation_direction ? this.capitalize( options.exit_animation_direction ) : '',
			animationSpeed = options.enter_animation_speed || 1;

			if ( animation ) {
				if ( ! this.animationsWithoutDirection.includes( animation ) ) {
					animation = animation + 'Out' + animationDirection;
				}
				offCanvas.addClass( 'fusion-animated ' + animation );
				offCanvas.attr( 'data-animation-type', animation );
				offCanvas.css( {
					'visibility': 'visible',
					'animation-duration': animationSpeed + 's'
				} );
			}
			offCanvas.addClass( 'fusion-animated ' + animation );

			offCanvas.on( 'animationend', function() {
				const   el = jQuery( this );
				setTimeout( () => {
					if ( el.attr( 'data-animation-type' ) ) {
						el.removeClass( 'fusion-animated' ).removeClass( el.attr( 'data-animation-type' ) ).removeAttr( 'data-animation-type' );
					}
				}, 500 );

			} );
		}
	} );
}( jQuery ) );
