(function( $, document ) {

	var iconic_woothumbs = {
		/**
		 * Set up cache with common elements and vars
		 */
		cache: function() {
			if ( iconic_woothumbs.cache_run ) {
				return;
			}

			iconic_woothumbs.els = {};
			iconic_woothumbs.vars = {};
			iconic_woothumbs.tpl = {};
			iconic_woothumbs.products = {};
			iconic_woothumbs.wishlist_adding = [];

			iconic_woothumbs.vars.d = new Date();

			// common elements
			iconic_woothumbs.els.all_images_wrap = $( '.iconic-woothumbs-all-images-wrap' );
			iconic_woothumbs.els.gallery = false;
			iconic_woothumbs.els.video_template = $( '#iconic-woothumbs-video-template' );

			// common vars
			iconic_woothumbs.vars.zoom_setup = false;
			iconic_woothumbs.vars.media_touch_timer = false;
			iconic_woothumbs.vars.window_resize_timeout = false;
			iconic_woothumbs.vars.is_dragging_image_slide = false;
			iconic_woothumbs.vars.is_rtl = iconic_woothumbs.is_true( iconic_woothumbs_vars.is_rtl );
			iconic_woothumbs.vars.images_are_vertical = iconic_woothumbs_vars.settings.carousel_general_mode === "vertical";
			iconic_woothumbs.vars.thumbnails_are_vertical = iconic_woothumbs_vars.settings.navigation_thumbnails_position === "left" || iconic_woothumbs_vars.settings.navigation_thumbnails_position === "right";
			iconic_woothumbs.vars.loading_class = "iconic-woothumbs-loading";
			iconic_woothumbs.vars.reset_class = "iconic-woothumbs-reset";
			iconic_woothumbs.vars.thumbnails_active_class = "iconic-woothumbs-thumbnails__slide--active";
			iconic_woothumbs.vars.wishlist_adding_class = "iconic-woothumbs-wishlist-buttons--adding";
			iconic_woothumbs.vars.wishlist_added_class = "iconic-woothumbs-wishlist-buttons--added";
			iconic_woothumbs.vars.is_zoom_enabled = iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.zoom_general_enable );
			iconic_woothumbs.vars.is_fullscreen_enabled = iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.fullscreen_general_enable );
			iconic_woothumbs.vars.show_variation_trigger = "iconic_woothumbs_show_variation";
			iconic_woothumbs.vars.loading_variation_trigger = "iconic_woothumbs_loading_variation";
			iconic_woothumbs.vars.fullscreen_trigger = iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.fullscreen_general_click_anywhere ) ? ".iconic-woothumbs-fullscreen, img" : ".iconic-woothumbs-fullscreen";
			iconic_woothumbs.vars.play_trigger = ".iconic-woothumbs-play";
			iconic_woothumbs.vars.media_controls_class = 'iconic-woothumbs-responsive-media__controls';
			iconic_woothumbs.vars.play_button_class = 'iconic-woothumbs-icon-play-alt';
			iconic_woothumbs.vars.pause_button_class = 'iconic-woothumbs-icon-pause';
			iconic_woothumbs.vars.play_controls_class = 'iconic-woothumbs-responsive-media__controls--play';
			iconic_woothumbs.vars.pause_controls_class = 'iconic-woothumbs-responsive-media__controls--pause';
			iconic_woothumbs.vars.window_size = {
				height: $( window ).height(),
				width: $( window ).width()
			};
			iconic_woothumbs.vars.fullscreeen_flag = false;

			// common templates
			iconic_woothumbs.tpl.prev_arrow = '<a href="javascript: void(0);" class="iconic-woothumbs-images__arrow iconic-woothumbs-images__arrow--prev"><i class="iconic-woothumbs-icon iconic-woothumbs-icon-left-open-mini"></i></a>';
			iconic_woothumbs.tpl.next_arrow = '<a href="javascript: void(0);" class="iconic-woothumbs-images__arrow iconic-woothumbs-images__arrow--next"><i class="iconic-woothumbs-icon iconic-woothumbs-icon-right-open-mini"></i></a>';
			iconic_woothumbs.tpl.prev_arrow_rtl = iconic_woothumbs.tpl.next_arrow;
			iconic_woothumbs.tpl.next_arrow_rtl = iconic_woothumbs.tpl.prev_arrow;

			iconic_woothumbs.tpl.fullscreen_button = '<a href="javascript: void(0);" class="iconic-woothumbs-fullscreen" data-iconic-woothumbs-tooltip="' + iconic_woothumbs_vars.text.fullscreen + '"><i class="iconic-woothumbs-icon iconic-woothumbs-icon-fullscreen"></i></a>';
			iconic_woothumbs.tpl.play_button = '<a href="javascript: void(0);" class="iconic-woothumbs-play" data-iconic-woothumbs-tooltip="' + iconic_woothumbs_vars.text.video + '"><i class="iconic-woothumbs-icon iconic-woothumbs-icon-play"></i></a>';
			iconic_woothumbs.tpl.temp_images_container = '<div class="iconic-woothumbs-temp"><div class="iconic-woothumbs-temp__images"></div><div class="iconic-woothumbs-icon iconic-woothumbs-temp__thumbnails"></div></div>';
			iconic_woothumbs.tpl.image_slide = '<div class="iconic-woothumbs-images__slide"><img class="iconic-woothumbs-images__image no-lazyload" src="{{image_src}}" srcset="{{image_srcset}}" sizes="{{image_sizes}}" data-caption="{{image_caption}}" data-large_image="{{large_image_src}}" data-large_image_width="{{large_image_width}}" data-large_image_height="{{large_image_height}}" width="{{image_width}}" height="{{image_height}}" title="{{title}}" alt="{{alt}}" {{style}} {{data_src}}></div>';
			iconic_woothumbs.tpl.media_slide = '<div class="iconic-woothumbs-images__slide">{{media_embed}}</div>';
			iconic_woothumbs.tpl.thumbnail_slide = '<div class="iconic-woothumbs-thumbnails__slide {{slide_class}}" data-index="{{index}}"><div class="iconic-woothumbs-thumbnails__image-wrapper">{{play_icon}}<img class="iconic-woothumbs-thumbnails__image" src="{{image_src}}" srcset="{{image_srcset}}" sizes="{{image_sizes}}" title="{{title}}" alt="{{alt}}" width="{{image_width}}" height="{{image_height}}"></div></div>';
			iconic_woothumbs.tpl.thumbnail_play_icon = '<div class="iconic-woothumbs-thumbnails__play-overlay"><i class="iconic-woothumbs-icon iconic-woothumbs-icon-play"></i></div>';
			iconic_woothumbs.tpl.photoswipe = wp.template( 'iconic-woothumbs-pswp' );
			iconic_woothumbs.tpl.media = '<div class="iconic-woothumbs-fullscreen-video-wrapper iconic-woothumbs-fullscreen-video-wrapper--wide">{{media_embed}}</div>';
			iconic_woothumbs.tpl = $.extend(iconic_woothumbs.tpl, (iconic_woothumbs_vars.tpl !== undefined ? iconic_woothumbs_vars.tpl : [] ));

			iconic_woothumbs.cache_run = true;

			// Events for other plugins that need to trigger carousel
			// initialisation should be listed here. These are then
			// checked as part of the on_load logic below.
			iconic_woothumbs.custom_init_events = [
				'jckqv_open',
				'jet-popup/show-event/after-show',
			];
		},

		/**
		 * Run on window load ready
		 */

		on_load: function(e) {
			iconic_woothumbs.cache_run = false;
			iconic_woothumbs.cache();

			// Ensure that we only execute these functions once, either:
			// 1. If the standard `load` event has been triggered once already.
			// 2. Any of the specified custom plugin events have fired.
			if ( ! window.iconicWooThumbsLoaded || iconic_woothumbs.custom_init_events.indexOf( e.type ) ) {
				iconic_woothumbs.prepare_products();
				iconic_woothumbs.init();
				window.iconicWooThumbsLoaded = true;
			}
		},

		/**
		 * Run on resize
		 */

		on_resize: function() {
			iconic_woothumbs.cache();

			clearTimeout( iconic_woothumbs.vars.window_resize_timeout );

			iconic_woothumbs.vars.window_resize_timeout = setTimeout( function() {
				var new_window = {
					height: $( window ).height(),
					width: $( window ).width()
				};
			
				// Dont trigger resize-end event if it is a fullscreen change.
				if (  iconic_woothumbs.vars.window_size.width !== new_window.width && ! iconic_woothumbs.vars.fullscreeen_flag ) {
					iconic_woothumbs.vars.window_size.width = new_window.width;
					iconic_woothumbs.vars.window_size.height = new_window.height;

					$( window ).trigger( 'resize-end' );
				}
			}, 100 );
		},

		/**
		 * Helper: Check whether a settings value is true
		 *
		 * @param str val
		 */

		is_true: function( val ) {
			return (parseInt( val ) === 1) ? true : false;
		},

		/**
		 * Helper: Check if a plugin or theme is active
		 *
		 * @param str name Name of the plugin or theme to check if is active
		 */

		is_active: function( name ) {

			if ( name === "woothemes_swatches" ) {

				return ($( '#swatches-and-photos-css' ).length > 0) ? true : false;

			}

			return false;

		},

		/**
		 * Get all products on page with WooThumbs
		 * and assign to the iconic_woothumbs.products variable
		 */
		prepare_products: function() {

			if ( iconic_woothumbs.els.all_images_wrap.length <= 0 ) {
				return;
			}

			iconic_woothumbs.els.all_images_wrap.each( function( index, element ) {

				var $all_images_wrap = $( element ),
					$product = $all_images_wrap.closest( '.product' ),
					is_variable = $all_images_wrap.data( 'product-type' ) === "variable" || $all_images_wrap.data( 'product-type' ) === "variable-subscription",
					$variations_form = is_variable ? $product.find( 'form.variations_form' ) : false,
					variations_json = $variations_form ? $variations_form.attr( 'data-product_variations' ) : false;

				iconic_woothumbs.products[ index ] = {
					'product': $product,
					'all_images_wrap': $all_images_wrap,
					'images': $all_images_wrap.find( '.iconic-woothumbs-images' ),
					'images_wrap': $all_images_wrap.find( '.iconic-woothumbs-images-wrap' ),
					'thumbnails': $all_images_wrap.find( '.iconic-woothumbs-thumbnails' ),
					'thumbnails_wrap': $all_images_wrap.find( '.iconic-woothumbs-thumbnails-wrap' ),
					'variations_form': $variations_form,
					'variation_id_field': $variations_form ? $variations_form.find( 'input[name=variation_id]' ) : false,
					'wishlist_buttons': $all_images_wrap.find( '.iconic-woothumbs-wishlist-buttons' ),
					'play_button': $all_images_wrap.find( '.iconic-woothumbs-play' ),
					'wishlist_add_button': $all_images_wrap.find( '.iconic-woothumbs-wishlist-buttons__add' ),
					'wishlist_browse_button': $all_images_wrap.find( '.iconic-woothumbs-wishlist-buttons__browse' ),
					'variations_json': variations_json,
					'maintain_slide_index': $all_images_wrap.attr( 'data-maintain-slide-index' ) === "yes",
					'variations': variations_json ? JSON.parse( variations_json ) : false,
					'product_id': $variations_form ? $variations_form.data( 'product_id' ) : false,
					'default_images': JSON.parse( $all_images_wrap.attr( 'data-default' ) ),
					'imagezoom': false,
					'caption': $all_images_wrap.find( '.iconic-woothumbs-caption' )
				};

			} );

		},

		/**
		 * Init WooThumbs
		 */
		init: function() {
			if ( iconic_woothumbs.products.length <= 0 ) {
				return;
			}

			$.each( iconic_woothumbs.products, function( index, product_object ) {
				iconic_woothumbs.setup_sliders( product_object );
				iconic_woothumbs.watch_variations( product_object );
				iconic_woothumbs.setup_zoom( product_object );
				iconic_woothumbs.setup_fullscreen( product_object );
				iconic_woothumbs.setup_video( product_object );
				iconic_woothumbs.watch_yith_wishlist( product_object );
				iconic_woothumbs.setup_media_controls( product_object );
			} );

			iconic_woothumbs.setup_yith_wishlist();
			iconic_woothumbs.setup_tooltips();
		},

		/**
		 * Helper: Lazy load images to improve loading speed
		 */

		lazy_load_images: function( product_object ) {

			var $images = product_object.images.find( 'img' );

			if ( $images.length > 0 ) {
				$images.each( function( index, el ) {
					var $image = $( el ),
						data_src = $image.attr( 'data-iconic-woothumbs-src' );

					if ( typeof data_src !== "undefined" ) {
						var $image_clone = $image.clone();

						$image_clone
							.attr( 'src', data_src ).css( { paddingTop: "", height: "" } )
							.removeAttr( "data-iconic-woothumbs-src" );
						$image.replaceWith( $image_clone );
					}
				} );
			}

			var $media = product_object.images.find( '.iconic-woothumbs-responsive-media' );

			if ( $media.length > 0 ) {
				$media.each( function( index, el ) {
					$( el ).show();
				} );
			}

		},

		/**
		 * Images Slider Args
		 *
		 * Dynamic so the options are recalculated every time
		 */

		images_slider_args: function( product_object, index ) {

			var args = {},
				image_count = product_object.images.children().length;

			args.initialSlide = typeof index !== 'undefined' && image_count > index ? index : 0;
			args.speed = parseInt( iconic_woothumbs_vars.settings.carousel_general_transition_speed );
			args.arrows = (image_count > 1) ? iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.navigation_general_controls ) : false;
			args.infinite = (image_count > 1) ? iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.carousel_general_infinite_loop ) : false;
			args.touchMove = (image_count > 1) ? true : false;
			args.adaptiveHeight = false;
			args.autoplay = iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.carousel_general_autoplay );
			args.autoplaySpeed = parseInt( iconic_woothumbs_vars.settings.carousel_general_duration );
			args.dots = iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.navigation_bullets_enable );
			args.prevArrow = iconic_woothumbs.vars.is_rtl ? iconic_woothumbs.tpl.prev_arrow_rtl : iconic_woothumbs.tpl.prev_arrow;
			args.nextArrow = iconic_woothumbs.vars.is_rtl ? iconic_woothumbs.tpl.next_arrow_rtl : iconic_woothumbs.tpl.next_arrow;
			args.respondTo = 'slider';
			args.centerPadding = 0;
			args.touchThreshold = iconic_woothumbs_vars.settings.carousel_general_main_slider_swipe_threshold;

			if ( iconic_woothumbs.vars.images_are_vertical ) {
				args.vertical = true;
			} else if ( iconic_woothumbs_vars.settings.carousel_general_mode === "fade" ) {
				args.fade = true;
			}

			if ( iconic_woothumbs.vars.images_are_vertical !== true ) {
				args.rtl = iconic_woothumbs.vars.is_rtl;
			}

			return args;

		},

		/**
		 * Thumbnails Slider Args
		 *
		 * Dynamic so the options are recalculated every time
		 *
		 * @param product_object
		 */

		thumbnails_slider_args: function( product_object ) {
			var args = {};

			args.infinite = false;
			args.speed = parseInt( iconic_woothumbs_vars.settings.navigation_thumbnails_transition_speed );
			args.slidesToShow = iconic_woothumbs.get_slides_to_show();
			args.slidesToScroll = 1;
			args.arrows = false;
			args.vertical = false;
			args.centerMode = false;
			args.swipeToSlide = true;

			if ( iconic_woothumbs.vars.thumbnails_are_vertical ) {
				args.vertical = true;
			} else {
				args.rtl = iconic_woothumbs.vars.is_rtl;
			}

			if ( iconic_woothumbs.is_below_breakpoint() && iconic_woothumbs.move_thumbnails_at_breakpoint() ) {
				args.vertical = false;
			}

			return args;
		},

		/**
		 * Toggle controls.
		 */
		toggle_controls: function( $current_slide, product_object ) {
			if ( iconic_woothumbs.is_media( $current_slide ) ) {
				iconic_woothumbs.hide_controls( product_object );
			} else {
				iconic_woothumbs.show_controls( product_object );
				iconic_woothumbs.toggle_fullscreen_control( $current_slide, product_object );
			}
		},

		/**
		 * Toggle fullscreen control.
		 */
		toggle_fullscreen_control: function( $current_slide, product_object ) {
			var $current_image = $current_slide.find( 'img' ),
				$fullscreen_button = product_object.all_images_wrap.find( iconic_woothumbs.vars.fullscreen_trigger ).not( 'img' );

			if ( iconic_woothumbs.is_placeholder( $current_image ) ) {
				$fullscreen_button.hide();
			} else {
				$fullscreen_button.show();
			}
		},

		/**
		 * Hide controls.
		 */
		hide_controls: function( product_object ) {
			product_object.images_wrap.addClass( 'iconic-woothumbs-images-wrap--hide-controls' );
		},

		/**
		 * Show controls.
		 */
		show_controls: function( product_object ) {
			product_object.images_wrap.removeClass( 'iconic-woothumbs-images-wrap--hide-controls' );
		},

		/**
		 * Helper: Is palcehodler?
		 */
		is_placeholder: function( image, src_only ) {

			var src = src_only === true ? image : image.attr( 'src' );

			if ( src == null ) {
				return false;
			}

			return src.indexOf( "placeholder.png" ) >= 0;

		},

		/**
		 * Helper: Is media?
		 */
		is_media: function( $slide ) {
			var $media = $slide.find( 'iframe, video, object' );

			if ( $media.length > 0 ) {
				return true;
			}

			return false;
		},

		/**
		 * Get slides to show
		 *
		 * @return int
		 */
		get_slides_to_show: function() {
			return iconic_woothumbs.is_below_breakpoint() ? parseInt( iconic_woothumbs_vars.settings.responsive_general_thumbnails_count ) : parseInt( iconic_woothumbs_vars.settings.navigation_thumbnails_count );
		},

		/**
		 * Get thumbnail count
		 *
		 * @param product_object
		 * @return int
		 */
		get_thumbnail_count: function( product_object ) {

			return product_object.thumbnails.find( '.iconic-woothumbs-thumbnails__slide' ).length;

		},

		/**
		 * Setup sliders
		 *
		 * @param product_object
		 */

		setup_sliders: function( product_object ) {

			iconic_woothumbs.setup_images_events( product_object );
			iconic_woothumbs.setup_thumbnails_events( product_object );

			iconic_woothumbs.init_images( product_object );
			iconic_woothumbs.init_thumbnails( product_object );

		},

		/**
		 * Setup events for Images slider
		 *
		 * @param product_object
		 */
		setup_images_events: function( product_object ) {
			// On resize.
			$( window ).on( 'resize-end', function() {
				iconic_woothumbs.maybe_resize_wrap( product_object );
			} );

			// On init
			product_object.images.on( 'init', function( event, slick ) {
				var $current_slide = product_object.images.find( '.slick-active' ),
					$current_image = $current_slide.find( 'img:first' );

				iconic_woothumbs.go_to_thumbnail( slick.currentSlide, product_object );

				iconic_woothumbs.init_zoom( $current_image, product_object );
				iconic_woothumbs.update_caption( $current_image, product_object );
				iconic_woothumbs.toggle_controls( $current_slide, product_object );
				iconic_woothumbs.reveal_slides( product_object );

				$( window ).trigger( 'resize' );
			} );

			product_object.images.on( 'init_zoom', function( event ) {
				var $current_slide = product_object.images.find( '.slick-active' ),
					$current_image = $current_slide.find( 'img:first' );

				iconic_woothumbs.init_zoom( $current_image, product_object );
			} );

			// On before slide change
			product_object.images.on( 'beforeChange', function( event, slick, current_slide_index, next_slide_index ) {
				iconic_woothumbs.go_to_thumbnail( next_slide_index, product_object );

				if ( product_object.imagezoom ) {
					product_object.imagezoom.destroy();
				}
			} );

			// On after slide change
			product_object.images.on( 'afterChange', function( event, slick, current_slide_index ) {
				var $current_slide = iconic_woothumbs.get_slide_by_index( product_object, current_slide_index ),
					$current_image = $current_slide.find( 'img:first' );

				iconic_woothumbs.init_zoom( $current_image, product_object );
				iconic_woothumbs.update_caption( $current_image, product_object );
				iconic_woothumbs.toggle_controls( $current_slide, product_object );
				iconic_woothumbs.stop_media( product_object );
				iconic_woothumbs.start_media( product_object );
			} );

			// setup stop auto
			product_object.all_images_wrap.on( 'click', ".iconic-woothumbs-thumbnails__slide, .iconic-woothumbs-images__arrow, .iconic-woothumbs-zoom-prev, .iconic-woothumbs-zoom-next, .slick-dots button", function() {
				product_object.images.slick( 'slickPause' );
			} );
		},

		/**
		 * Setup events for Thumbnails slider
		 *
		 * @param product_object
		 */
		setup_thumbnails_events: function( product_object ) {
			// On init
			product_object.thumbnails.on( 'init', function( event, slick ) {
				iconic_woothumbs.reveal_thumbnails( product_object );
				iconic_woothumbs.set_thumbnail_controls_visibility( product_object );
			} );

			// On after slide change
			product_object.thumbnails.on( 'afterChange', function( event, slick, current_slide_index ) {
				iconic_woothumbs.set_thumbnail_controls_visibility( product_object );
			} );

			// setup click thumbnail action
			product_object.all_images_wrap.on( 'click', ".iconic-woothumbs-thumbnails__slide", function() {
				if ( product_object.all_images_wrap.hasClass( iconic_woothumbs.vars.loading_class ) ) {
					return;
				}

				if ( !product_object ) {
					return;
				}

				var new_index = parseInt( $( this ).attr( 'data-index' ) );

				iconic_woothumbs.set_active_thumbnail( product_object.thumbnails, new_index );
				product_object.images.slick( 'slickGoTo', new_index );
			} );

			// setup click thumbnail control action
			product_object.all_images_wrap.on( 'click', ".iconic-woothumbs-thumbnails__control", function() {
				if ( !product_object.all_images_wrap.hasClass( iconic_woothumbs.vars.loading_class ) ) {
					var dir = $( this ).attr( 'data-direction' );

					if ( dir === "next" ) {
						product_object.thumbnails.slick( 'slickNext' );
					} else {
						product_object.thumbnails.slick( 'slickPrev' );
					}
				}
			} );

			// On window resize
			$( window ).on( 'resize-end', function() {
				iconic_woothumbs.position_thumbnails( product_object );
				iconic_woothumbs.resize_thumbnails( product_object );
			} );
		},

		/**
		 * Reveal thumbnails
		 *
		 * @param product_object
		 */
		reveal_thumbnails: function( product_object ) {
			product_object.thumbnails_wrap.height( '' ).removeClass( 'iconic-woothumbs-thumbnails-wrap--hidden' );
		},

		/**
		 * Init Images slider
		 *
		 * @param product_object
		 */
		init_images: function( product_object ) {
			if ( product_object.images.length <= 0 ) {
				return;
			}

			iconic_woothumbs.maybe_resize_wrap( product_object );
			product_object.images.not( '.slick-initialized' ).slick( iconic_woothumbs.images_slider_args( product_object ) );

			// Refresh after images are loaded, again.
			iconic_woothumbs.images_loaded( product_object.images, function() {
				product_object.images.slick( 'slickSetOption', 'adaptiveHeight', true, true );
				iconic_woothumbs.lazy_load_images( product_object );
				product_object.images[ 0 ].slick.refresh();
			} );

			product_object.images_slider_data = product_object.images.length > 0;
		},

		/**
		 * Give images a fixed width to prevent fractional width and slide peep.
		 */
		maybe_resize_wrap: function( product_object ) {
			product_object.all_images_wrap.width( '' ).width( 2 * Math.floor( product_object.all_images_wrap.width() / 2 ) );

			var $slick_elements = product_object.all_images_wrap.find( '.slick-slider' );

			if ( $slick_elements.length <= 0 ) {
				return;
			}

			$slick_elements.each( function( index, slick_element ) {
				if ( typeof slick_element.slick === 'undefined' ) {
					return;
				}

				slick_element.slick.refresh();
			} );
		},

		/**
		 * Init Thumbnails slider
		 *
		 * @param product_object
		 * @param callback
		 */
		init_thumbnails: function( product_object, callback ) {
			if ( product_object.thumbnails.find( 'img' ).length <= 0 ) {
				return;
			}

			// Don't call slick when slides_to_show is 0, to prevent browser crash.
			// Hide thumbnails if set to show 0.
			if ( iconic_woothumbs.get_slides_to_show() <= 0 ) {
				product_object.thumbnails.hide();
				return;
			}

			if ( !iconic_woothumbs.sliding_thumbnails_enabled() ) {
				iconic_woothumbs.reveal_thumbnails( product_object );
				return;
			}

			iconic_woothumbs.images_loaded( product_object.thumbnails, function () {
				product_object.thumbnails.not( '.slick-initialized' ).slick( iconic_woothumbs.thumbnails_slider_args( product_object ) );
				product_object.thumbnails_slider_data = product_object.thumbnails.length > 0;
				iconic_woothumbs.position_thumbnails( product_object );

				if ( typeof callback === 'function' ) {
					callback();
				}
			} );
		},

		/**
		 * Resize and position thumbnails
		 *
		 * @param product_object
		 */
		resize_thumbnails: function( product_object ) {
			if ( product_object.thumbnails.length < 1 ) {
				return;
			}

			var slides_to_show = iconic_woothumbs.get_slides_to_show();

			if ( slides_to_show <= 0 ) {
				product_object.thumbnails.hide();
			} else {
				product_object.thumbnails.show();

				// If slick has not been initialised, initialise it.
				if ( ! product_object.thumbnails_slider_data ) {
					iconic_woothumbs.init_thumbnails( product_object, function() {
						product_object.thumbnails.slick( 'slickSetOption', 'slidesToShow', slides_to_show );
					} );
				} else {
					product_object.thumbnails.slick( 'slickSetOption', 'slidesToShow', slides_to_show );
				}
			}
		},

		/**
		 * Helper: Get slide by index
		 *
		 * @param product_object
		 * @param int index
		 * @return obj
		 */
		get_slide_by_index: function( product_object, index ) {
			return product_object.images.find( '[data-slick-index="' + index + '"]' );
		},

		/**
		 * Helper: Are sliding thumbnails enabled?
		 *
		 * @param product_object
		 */

		sliding_thumbnails_enabled: function() {

			return iconic_woothumbs_vars.settings.navigation_thumbnails_type === "sliding";

		},

		/**
		 * Helper: Do we have thumbnails at all?
		 *
		 * @param product_object
		 * @param bool thumbnails
		 */

		has_thumbnails: function( product_object ) {

			return (iconic_woothumbs.get_thumbnail_count( product_object ) > 0 || thumbnails) && (iconic_woothumbs_vars.settings.navigation_thumbnails_type === "sliding" || iconic_woothumbs_vars.settings.navigation_thumbnails_type === "stacked");

		},

		/**
		 * Helper: Are thumbnails enabled?
		 */
		thumbnails_enabled: function() {

			return iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.navigation_thumbnails_enable );

		},

		/**
		 * Helper: Move thumbnails at breakpoint?
		 */

		move_thumbnails_at_breakpoint: function() {

			return iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.responsive_general_thumbnails_below ) && iconic_woothumbs_vars.settings.navigation_thumbnails_position !== "below";

		},

		/**
		 * Helper: Is the window width below our breakpoint limit
		 */

		is_below_breakpoint: function() {

			return iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.responsive_general_breakpoint_enable ) && iconic_woothumbs.viewport().width <= parseInt( iconic_woothumbs_vars.settings.responsive_general_breakpoint, 10 );

		},

		/**
		 * Helper: Get viewport dimensions
		 */

		viewport: function() {

			var e = window, a = 'inner';

			if ( !('innerWidth' in window) ) {
				a = 'client';
				e = document.documentElement || document.body;
			}

			return { width: e[ a + 'Width' ], height: e[ a + 'Height' ] };

		},

		/**
		 * Helper: Position thumbnails
		 *
		 * @param product_object
		 */

		position_thumbnails: function( product_object ) {

			if ( !iconic_woothumbs.move_thumbnails_at_breakpoint() ) {
				return;
			}

			if ( iconic_woothumbs.get_thumbnail_count( product_object ) <= 0 ) {
				return;
			}

			var $next_controls = product_object.all_images_wrap.find( '.iconic-woothumbs-thumbnails__control--right, .iconic-woothumbs-thumbnails__control--down' ),
				$prev_controls = product_object.all_images_wrap.find( '.iconic-woothumbs-thumbnails__control--left, .iconic-woothumbs-thumbnails__control--up' );

			if ( iconic_woothumbs.is_below_breakpoint() ) {

				product_object.all_images_wrap.removeClass( 'iconic-woothumbs-all-images-wrap--thumbnails-left iconic-woothumbs-all-images-wrap--thumbnails-right iconic-woothumbs-all-images-wrap--thumbnails-above' ).addClass( 'iconic-woothumbs-all-images-wrap--thumbnails-below' );

				product_object.images_wrap.after( product_object.thumbnails_wrap );
				product_object.thumbnails_wrap.removeClass( 'iconic-woothumbs-thumbnails-wrap--vertical' ).addClass( 'iconic-woothumbs-thumbnails-wrap--horizontal' );

				$next_controls.removeClass( 'iconic-woothumbs-thumbnails__control--down' ).addClass( 'iconic-woothumbs-thumbnails__control--right' )
					.find( 'i' ).removeClass( 'iconic-woothumbs-icon-down-open-mini' ).addClass( 'iconic-woothumbs-icon-right-open-mini' );
				$prev_controls.removeClass( 'iconic-woothumbs-thumbnails__control--up' ).addClass( 'iconic-woothumbs-thumbnails__control--left' )
					.find( 'i' ).removeClass( 'iconic-woothumbs-icon-up-open-mini' ).addClass( 'iconic-woothumbs-icon-left-open-mini' );

				if ( product_object.thumbnails_slider_data && iconic_woothumbs.sliding_thumbnails_enabled() ) {
					product_object.thumbnails.slick( 'slickSetOption', 'vertical', false ).removeClass( 'slick-vertical' );
				}

			} else {

				product_object.all_images_wrap.removeClass( 'iconic-woothumbs-all-images-wrap--thumbnails-below' ).addClass( 'iconic-woothumbs-all-images-wrap--thumbnails-' + iconic_woothumbs_vars.settings.navigation_thumbnails_position );

				if ( iconic_woothumbs_vars.settings.navigation_thumbnails_position === "left" || iconic_woothumbs_vars.settings.navigation_thumbnails_position === "above" ) {

					product_object.images_wrap.before( product_object.thumbnails_wrap );

				}

				if ( iconic_woothumbs_vars.settings.navigation_thumbnails_position === "left" || iconic_woothumbs_vars.settings.navigation_thumbnails_position === "right" ) {

					product_object.thumbnails_wrap.removeClass( 'iconic-woothumbs-thumbnails-wrap--horizontal' ).addClass( 'iconic-woothumbs-thumbnails-wrap--vertical' );

					$next_controls.removeClass( 'iconic-woothumbs-thumbnails__control--right' ).addClass( 'iconic-woothumbs-thumbnails__control--down' )
						.find( 'i' ).removeClass( 'iconic-woothumbs-icon-right-open-mini' ).addClass( 'iconic-woothumbs-icon-down-open-mini' );
					$prev_controls.removeClass( 'iconic-woothumbs-thumbnails__control--left' ).addClass( 'iconic-woothumbs-thumbnails__control--up' )
						.find( 'i' ).removeClass( 'iconic-woothumbs-icon-left-open-mini' ).addClass( 'iconic-woothumbs-icon-up-open-mini' );

					if ( product_object.thumbnails_slider_data && iconic_woothumbs.sliding_thumbnails_enabled() ) {
						product_object.thumbnails.slick( 'slickSetOption', 'vertical', true ).addClass( 'slick-vertical' );
					}

				}

			}

		},

		/**
		 * Helper: Set visibility of thumbnail controls
		 *
		 * @param product_object
		 */

		set_thumbnail_controls_visibility: function( product_object ) {

			var $slick_track = product_object.thumbnails.find( '.slick-track' ),
				track_position = null,
				track_size = null,
				thumbnails_size = null,
				end_position = null,
				$next_controls = product_object.all_images_wrap.find( '.iconic-woothumbs-thumbnails__control--right, .iconic-woothumbs-thumbnails__control--down' ),
				$prev_controls = product_object.all_images_wrap.find( '.iconic-woothumbs-thumbnails__control--left, .iconic-woothumbs-thumbnails__control--up' );

			if ( iconic_woothumbs.thumbnails_slider_args().vertical ) {

				track_position = $slick_track.position().top;
				track_size = $slick_track.height();
				thumbnails_size = product_object.thumbnails.height();

			} else {

				track_position = $slick_track.position().left;
				track_size = $slick_track.width();
				thumbnails_size = product_object.thumbnails.width();

			}

			end_position = - (track_size - thumbnails_size - parseInt( iconic_woothumbs_vars.settings.navigation_thumbnails_spacing ));

			$prev_controls.show();
			$next_controls.show();

			if ( track_position <= 1 && track_position >= - 1 ) {

				$prev_controls.hide();

			} else if ( iconic_woothumbs.get_difference( track_position, end_position ) <= 5 ) {

				$next_controls.hide();
			}

			if ( iconic_woothumbs.get_thumbnail_count( product_object ) <= iconic_woothumbs.get_slides_to_show() ) {

				$prev_controls.hide();
				$next_controls.hide();

			}

		},

		/**
		 * Get difference between 2 numbers
		 *
		 * @param int number_1
		 * @param int number_2
		 * @return int
		 */
		get_difference: function( number_1, number_2 ) {

			return Math.abs( number_1 - number_2 );

		},

		/**
		 * Helper: Set active thumbnail
		 *
		 * @param $thumbnails
		 * @param int index
		 */

		set_active_thumbnail: function( $thumbnails, index ) {

			$thumbnails.find( ".iconic-woothumbs-thumbnails__slide" ).removeClass( iconic_woothumbs.vars.thumbnails_active_class );
			$thumbnails.find( ".iconic-woothumbs-thumbnails__slide[data-index=" + index + "]" ).addClass( iconic_woothumbs.vars.thumbnails_active_class );

		},

		/**
		 * Helper: Go to thumbnail
		 *
		 * @param int index
		 */

		go_to_thumbnail: function( index, product_object ) {

			if ( product_object.thumbnails_slider_data ) {

				var thumbnail_index = iconic_woothumbs.get_thumbnail_index( index, product_object );

				product_object.thumbnails.slick( 'slickGoTo', thumbnail_index );

			}

			iconic_woothumbs.set_active_thumbnail( product_object.thumbnails, index );
		},

		/**
		 * Helper: Get thumbnail index
		 *
		 * @param int index
		 */

		get_thumbnail_index: function( index, product_object ) {

			if ( parseInt( iconic_woothumbs_vars.settings.navigation_thumbnails_count ) === 1 ) {
				return index;
			}

			var last_thumbnail_index = iconic_woothumbs.get_last_thumbnail_index( product_object ),
				new_thumbnail_index = (index > last_thumbnail_index) ? last_thumbnail_index : (index === 0) ? 0 : index - 1;

			return new_thumbnail_index;

		},

		/**
		 * Helper: Get thumbnail index
		 *
		 * @param product_object
		 */

		get_last_thumbnail_index: function( product_object ) {

			var thumbnail_count = iconic_woothumbs.get_thumbnail_count( product_object ),
				last_slide_index = thumbnail_count - iconic_woothumbs_vars.settings.navigation_thumbnails_count;

			return last_slide_index;

		},

		/**
		 * Watch for changes in variations
		 *
		 * @param product_object
		 */

		watch_variations: function( product_object ) {
			if ( !product_object.variations_form ) {
				return;
			}

			product_object.variation_id_field.on( 'change', function() {
				var variation_id = parseInt( $( this ).val() ),
					currently_showing = parseInt( product_object.all_images_wrap.attr( 'data-showing' ) );

				if ( ! isNaN( variation_id ) && variation_id !== currently_showing && variation_id > 0 ) {
					iconic_woothumbs.get_variation_data( product_object, variation_id );
				}
			} );

			// on reset data trigger
			product_object.variations_form.on( 'reset_data', function() {
				iconic_woothumbs.reset_images( product_object );
			} );

			// on loading variation trigger
			product_object.all_images_wrap.on( iconic_woothumbs.vars.loading_variation_trigger, function( event ) {
				product_object.all_images_wrap.addClass( iconic_woothumbs.vars.loading_class );
			} );

			// on show variation trigger
			product_object.all_images_wrap.on( iconic_woothumbs.vars.show_variation_trigger, function( event, variation ) {
				iconic_woothumbs.load_images( product_object, variation );
			} );

			// Manually trigger the change to handle the default variations.
			if( $( product_object.variation_id_field ).val() ) {
				$( product_object.variation_id_field ).trigger( "change" );
			}
		},

		/**
		 * Load Images for variation ID
		 *
		 * @param product_object
		 * @param variation
		 */
		load_images: function( product_object, variation ) {
			if ( variation && typeof variation.jck_additional_images !== "undefined" ) {
				var image_count = variation.jck_additional_images.length;

				if ( image_count > 0 ) {
					product_object.all_images_wrap
						.attr( 'data-showing', variation.variation_id )
						.removeClass( iconic_woothumbs.vars.reset_class );

					iconic_woothumbs.replace_images( product_object, variation.jck_additional_images );
				} else {
					product_object.all_images_wrap.removeClass( iconic_woothumbs.vars.loading_class );
					iconic_woothumbs.reset_images( product_object );
				}
			} else {
				product_object.all_images_wrap.removeClass( iconic_woothumbs.vars.loading_class );
			}
		},

		/**
		 * Replace slider images
		 *
		 * @param product_object
		 * @param images
		 * @param callback
		 */
		replace_images: function( product_object, images, callback ) {
			iconic_woothumbs.remove_temporary_images();

			var temp_images = iconic_woothumbs.create_temporary_images( images, product_object ),
				current_slide_index = product_object.images.slick( 'slickCurrentSlide' ),
				has_thumbnails = temp_images.thumbnails.children().length > 0,
				thumbnails_html = temp_images.thumbnails.html(),
				images_html = temp_images.images.html();

			// once images have loaded, place them into the appropriate sliders
			iconic_woothumbs.images_loaded( temp_images.container, function() {
				if ( product_object.images_slider_data ) {
					product_object.images.slick( 'unslick' );
					product_object.images.html( images_html );
					iconic_woothumbs.init_images( product_object );
				}

				// If thumbnails are enabled
				if ( iconic_woothumbs.thumbnails_enabled() ) {
					product_object.thumbnails_wrap
						.height( product_object.thumbnails_wrap.height() )
						.addClass( 'iconic-woothumbs-thumbnails-wrap--hidden' );

					if ( product_object.thumbnails_slider_data ) {
						product_object.thumbnails.slick( 'unslick' );
						delete product_object.thumbnails[ 0 ].slick;
						product_object.thumbnails_slider_data = false;
					}

					product_object.thumbnails.html( thumbnails_html );

					if ( has_thumbnails && iconic_woothumbs.sliding_thumbnails_enabled() ) {
						iconic_woothumbs.init_thumbnails( product_object );
					} else {
						iconic_woothumbs.reveal_thumbnails( product_object );
					}
				}

				// maintain slide index
				var thumbnail_count = iconic_woothumbs.get_thumbnail_count( product_object );
				if ( thumbnail_count > current_slide_index && product_object.maintain_slide_index && typeof current_slide_index !== "undefined" ) {
					product_object.images.slick( 'slickGoTo', current_slide_index );
					iconic_woothumbs.go_to_thumbnail( current_slide_index, product_object );
				}

				// remove loading icon
				product_object.all_images_wrap.removeClass( iconic_woothumbs.vars.loading_class );

				iconic_woothumbs.remove_temporary_images();
				iconic_woothumbs.setup_media_ended();

				product_object.all_images_wrap.trigger( 'iconic_woothumbs_images_loaded', [ product_object ] );

				// Update slide count attribute
				product_object.all_images_wrap.attr( 'data-slide-count', thumbnail_count );

				// run a callback, if required
				if ( callback !== undefined ) {
					callback();
				}
			} );
		},

		/**
		 * Remove tempory images
		 */
		remove_temporary_images: function() {
			$( '.iconic-woothumbs-temp' ).remove();
		},

		/**
		 * Create temporary images
		 *
		 * @param images parsed JSON
		 */
		create_temporary_images: function( images, product_object ) {
			// add temp images container
			$( 'body' ).append( $( iconic_woothumbs.tpl.temp_images_container ).css( { width: product_object.images.outerWidth() } ) );

			var image_count = images.length,
				temp_images = {
					'container': $( '.iconic-woothumbs-temp' ),
					'images': $( '.iconic-woothumbs-temp__images' ),
					'thumbnails': $( '.iconic-woothumbs-temp__thumbnails' )
				};

			// loop through additional images
			$.each( images, function( index, image_data ) {
				// add images to temp div
				var src = index === 0 ? image_data.src : "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=",
					data_src = index === 0 ? false : 'data-iconic-woothumbs-src="' + image_data.src + '"',
					aspect = index === 0 ? false : (image_data.src_h / image_data.src_w) * 100,
					style = aspect ? 'style="padding-top: ' + aspect + '%; height: 0px;"' : "",
					slide_html = '';

				if ( image_data.media_embed ) {
					slide_html = iconic_woothumbs.tpl.media_slide.replace( "{{media_embed}}", image_data.media_embed );
				} else {

					var image_data_mapped = $.extend(image_data, { 
						'image_srcset': image_data.srcset, 
						'image_sizes': image_data.sizes, 
						'image_caption': image_data.caption, 
						'large_image_src': image_data.large_src, 
						'large_image_width': image_data.large_src_w, 
						'large_image_height': image_data.large_src_h, 
						'image_width': image_data.src_w, 
						'image_height': image_data.src_h, 
						'alt': image_data.alt, 
						'title': image_data.title,
					});

					slide_html = Object.keys(image_data_mapped).reduce(function (str, key) { 
						return str.replace('{{' + key + '}}', iconic_woothumbs.maybe_empty(image_data_mapped[key])); 
						}, iconic_woothumbs.tpl.image_slide); 
						
					slide_html = slide_html 
					.replace( /{{image_src}}/g, src ) 
					.replace( "{{style}}", style ) 
					.replace( "{{data_src}}", data_src );
				}

				temp_images.images.append( slide_html );

				// add thumbnails to temp div if thumbnails are enabled
				if ( image_count > 1 && iconic_woothumbs.thumbnails_enabled() ) {
					var play_icon = image_data.media_embed && image_data.no_media_icon !== true ? iconic_woothumbs.tpl.thumbnail_play_icon : '';

					var thumbnail_html =
						iconic_woothumbs.tpl.thumbnail_slide
							.replace( "{{play_icon}}", play_icon )
							.replace( /{{image_src}}/g, image_data.gallery_thumbnail_src )
							.replace( "{{image_srcset}}", iconic_woothumbs.maybe_empty( image_data.gallery_thumbnail_srcset ) )
							.replace( "{{image_sizes}}", iconic_woothumbs.maybe_empty( image_data.gallery_thumbnail_sizes ) )
							.replace( "{{index}}", index )
							.replace( "{{image_width}}", iconic_woothumbs.maybe_empty( image_data.gallery_thumbnail_src_w ) )
							.replace( "{{image_height}}", iconic_woothumbs.maybe_empty( image_data.gallery_thumbnail_src_h ) )
							.replace( "{{alt}}", image_data.alt )
							.replace( "{{title}}", image_data.title )
							.replace( "{{slide_class}}", index === 0 ? iconic_woothumbs.vars.thumbnails_active_class : "" );

					temp_images.thumbnails.append( thumbnail_html );
				}
			} );

			// pad out the thumbnails if there is less than the
			// amount that are meant to be displayed.
			if ( product_object.thumbnails_slider_data && image_count !== 1 && image_count < iconic_woothumbs_vars.settings.navigation_thumbnails_count ) {
				var empty_count = iconic_woothumbs_vars.settings.navigation_thumbnails_count - image_count;
				i = 0;

				while ( i < empty_count ) {
					temp_images.thumbnails.append( '<div></div>' );
					i ++;
				}
			}

			return temp_images;
		},

		/**
		 * Helper: maybe empty
		 *
		 * @param value
		 * @return str
		 */
		maybe_empty: function( value ) {

			return value ? value : "";

		},

		/**
		 * Reset Images to defaults
		 *
		 * @param product_object
		 */

		reset_images: function( product_object ) {
			if ( product_object.all_images_wrap.hasClass( iconic_woothumbs.vars.reset_class ) || product_object.all_images_wrap.hasClass( iconic_woothumbs.vars.loading_class ) ) {
				return;
			}

			product_object.all_images_wrap.trigger( iconic_woothumbs.vars.loading_variation_trigger );
			product_object.all_images_wrap.attr( 'data-showing', product_object.product_id );

			// set reset class
			product_object.all_images_wrap.addClass( iconic_woothumbs.vars.reset_class );

			// replace images
			iconic_woothumbs.replace_images( product_object, product_object.default_images );
		},

		/**
		 * Helper: Check if final variation has been selected
		 *
		 * @param product_object
		 */
		found_variation: function( product_object ) {
			var variation_id = parseInt( product_object.variation_id_field.val() );

			return !isNaN( variation_id );
		},

		/**
		 * Gat variation data from variation ID
		 *
		 * @param product_object
		 * @param int variation_id
		 */
		get_variation_data: function( product_object, variation_id ) {
			product_object.all_images_wrap.trigger( iconic_woothumbs.vars.loading_variation_trigger );

			var variation_data = false;

			// variation data available

			if ( product_object.variations ) {

				$.each( product_object.variations, function( index, variation ) {

					if ( variation.variation_id === variation_id ) {
						variation_data = variation;
					}

				} );

				product_object.all_images_wrap.trigger( iconic_woothumbs.vars.show_variation_trigger, [ variation_data ] );

				// variation data not available, look it up via ajax

			} else {

				$.ajax( {
					type: "GET",
					url: iconic_woothumbs_vars.ajaxurl,
					cache: false,
					dataType: "jsonp",
					crossDomain: true,
					data: {
						'action': 'iconic_woothumbs_get_variation',
						'variation_id': variation_id,
						'product_id': product_object.product_id
					},
					success: function( response ) {

						if ( response.success ) {
							if ( response.variation ) {
								variation_data = response.variation;

								product_object.all_images_wrap.trigger( iconic_woothumbs.vars.show_variation_trigger, [ variation_data ] );
							}
						}

					}
				} );

			}
		},

		/**
		 * Trigger Photoswipe
		 *
		 * @param bool last_slide
		 */
		trigger_photoswipe: function( product_object, last_slide ) {

			var $photoswipe_template = $( iconic_woothumbs.tpl.photoswipe() );

			$( 'body' ).append( $photoswipe_template );

			var $photoswipe_element = $( '.iconic-woothumbs-pswp' );

			if ( $photoswipe_element.length <= 0 ) {
				return;
			}

			// build items array
			var items = iconic_woothumbs.get_gallery_items( product_object );

			// define options (if needed)
			var options = {
				// optionName: 'option value'
				// for example:
				index: typeof last_slide === "undefined" ? items.index : items.items.length - 1, // start at first slide
				shareEl: false,
				closeOnScroll: false,
				history: false,
				showHideOpacity: true,
				showAnimationDuration: 0
			};

			// Initializes and opens PhotoSwipe
			iconic_woothumbs.els.gallery = new PhotoSwipe( $photoswipe_element[ 0 ], PhotoSwipeUI_Default, items.items, options );

			iconic_woothumbs.els.gallery.init();

			iconic_woothumbs.els.gallery.listen( 'beforeChange', function() {
				iconic_woothumbs.stop_photoswipe_media();
			} );

			iconic_woothumbs.els.gallery.listen( 'close', function() {
				setTimeout( function () {
					$photoswipe_element.remove();
				}, 50 );
			} );
		},

		/**
		 * Pause iframe video
		 */
		stop_photoswipe_media: function() {
			var $media = $( '.iconic-woothumbs-fullscreen-video-wrapper iframe, .iconic-woothumbs-fullscreen-video-wrapper video' );

			if ( $media.length <= 0 ) {
				return;
			}

			$media.each( function( index, media ) {
				var $media_item = $( media );

				if ( $media_item.is( 'iframe' ) ) {
					$media_item.hide().attr( 'src', $media_item.attr( 'src' ) );
					$media_item.load( function() {
						$( this ).show();
					} );
				} else {
					iconic_woothumbs.setup_media_ended();
					iconic_woothumbs.pause_video( $media_item, true );
				}
			} );
		},

		/**
		 * Pause a video.
		 *
		 * @param $video
		 */
		pause_video: function( $video, stop ) {
			stop = stop || false;

			var $video_item = $video.get( 0 ),
				$button = $video.closest( '.iconic-woothumbs-responsive-media' ).find( '.' + iconic_woothumbs.vars.media_controls_class ),
				$icon = $button.find( '.iconic-woothumbs-icon' );

			$video.get( 0 ).pause();

			if ( stop ) {
				$video_item.load();

				if ( $video_item.autoplay && $button.length > 0 ) {
					$button.removeClass( iconic_woothumbs.vars.pause_controls_class );
					$button.removeClass( iconic_woothumbs.vars.play_controls_class );
					$icon.addClass( iconic_woothumbs.vars.pause_button_class );
					$icon.removeClass( iconic_woothumbs.vars.play_button_class );

					return;
				}
			}

			if ( $button.length <= 0 ) {
				return;
			}

			$button.removeClass( iconic_woothumbs.vars.pause_controls_class );
			$button.addClass( iconic_woothumbs.vars.play_controls_class );
			$icon.removeClass( iconic_woothumbs.vars.pause_button_class );
			$icon.addClass( iconic_woothumbs.vars.play_button_class );
		},

		/**
		 * Setup fullscreen
		 *
		 * @param product_object
		 */
		setup_fullscreen: function( product_object ) {
			if ( !iconic_woothumbs.vars.is_fullscreen_enabled ) {
				return;
			}

			product_object.images_wrap.on( 'click', iconic_woothumbs.vars.fullscreen_trigger, function() {
				iconic_woothumbs.trigger_photoswipe( product_object );
			} );

			if ( iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.fullscreen_general_click_anywhere ) ) {
				$( document ).on( 'click', '.zm-handler', function() {
					var $zm_handler = $( this ),
						$el = $zm_handler.data( 'el' );

					$el.click();
				} );
			}
		},

		/**
		 * Setup video
		 */
		setup_video: function( product_object ) {

			product_object.images_wrap.on( 'click touchstart', iconic_woothumbs.vars.play_trigger, function() {

				iconic_woothumbs.trigger_photoswipe( product_object, true );

			} );

		},

		/**
		 * Get Gallery Items
		 *
		 * @param product_object
		 * @return obj index and items
		 */

		get_gallery_items: function( product_object ) {
			var $slides = product_object.images.find( '.iconic-woothumbs-images__slide' ),
				items = [],
				index = product_object.images.slick( 'slickCurrentSlide' );

			if ( iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.fullscreen_general_enable ) ) {
				if ( $slides.length > 0 ) {
					$slides.each( function( i, slide ) {
						var $slide = $( slide );

						if ( $slide.closest( '.slick-cloned' ).length > 0 ) {
							return;
						}

						if ( iconic_woothumbs.is_media( $slide ) ) {
							media_html = iconic_woothumbs.tpl.media.replace( "{{media_embed}}", $slide.html() );
							var orientation = $slide.find('.iconic-woothumbs-responsive-media').data('orientation');

							if ( orientation === 'tall' ) {
								media_html = media_html.replace( '--wide', '--tall' );
							}

							items.push( {
								html: media_html
							} );

							return;
						}

						var img = $slide.find( 'img' );

						if ( img.length <= 0 ) {
							return;
						}

						if ( iconic_woothumbs.is_placeholder( img ) ) {
							return;
						}

						var large_image_src = img.attr( 'data-large_image' ),
							large_image_w = img.attr( 'data-large_image_width' ),
							large_image_h = img.attr( 'data-large_image_height' ),
							item = {
								src: large_image_src,
								w: large_image_w,
								h: large_image_h
							};

						if ( iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.fullscreen_general_image_title ) ) {
							var title = img.attr( 'title' );

							item.title = title;
						}

						items.push( item );
					} );
				}
			}

			if ( iconic_woothumbs.els.video_template.length > 0 ) {
				items.push( {
					html: iconic_woothumbs.els.video_template.html().trim()
				} );
			}

			return {
				index: index,
				items: items
			};

		},

		/**
		 * Setup Zoom - actions that should only be run once
		 *
		 * @param product_object
		 */

		setup_zoom: function( product_object ) {

			if ( !iconic_woothumbs.vars.is_zoom_enabled ) {
				return;
			}

			// Disable the zoom if using a tocuh device

			product_object.all_images_wrap.on( 'touchmove', '.iconic-woothumbs-images__image', function() {
				iconic_woothumbs.vars.is_dragging_image_slide = true;
			} );

			product_object.all_images_wrap.on( 'touchend', '.iconic-woothumbs-images__image', function( e ) {

				if ( !iconic_woothumbs.vars.is_dragging_image_slide ) {
					e.preventDefault();
					$( this ).click();
				}

			} );

			product_object.all_images_wrap.on( 'touchstart', '.iconic-woothumbs-images__image', function() {
				iconic_woothumbs.vars.is_dragging_image_slide = false;
			} );

			if ( iconic_woothumbs.vars.zoom_setup ) {
				return;
			}

			// Reset zoom after resize

			$( window ).on( 'resize-end', function() {
				var $active_img = product_object.images.find( '.slick-active img:first' );

				iconic_woothumbs.init_zoom( $active_img, product_object );
			} );

			iconic_woothumbs.vars.zoom_setup = true;

		},

		/**
		 * Init Hover Zoom
		 *
		 * @param $image
		 * @param product_object
		 */

		init_zoom: function( $image, product_object ) {
			if ( !iconic_woothumbs.vars.is_zoom_enabled || iconic_woothumbs.is_placeholder( $image ) ) {
				return;
			}

			var $parent_slide = $image.closest( '.iconic-woothumbs-images__slide' ),
				slide_image_width = $image.width(),
				large_image = $image.attr( 'data-large_image' ),
				large_image_width = parseInt( $image.attr( 'data-large_image_width' ) );

			if ( slide_image_width >= large_image_width ) {
				return;
			}

			if ( product_object.imagezoom ) {
				product_object.imagezoom.destroy();
			}

			$parent_slide.ImageZoom( {
				type: iconic_woothumbs_vars.settings.zoom_general_zoom_type,
				bigImageSrc: large_image,
				zoomSize: [
					iconic_woothumbs_vars.settings.zoom_outside_follow_zoom_lens_width,
					iconic_woothumbs_vars.settings.zoom_outside_follow_zoom_lens_height
				],
				zoomViewerClass: (iconic_woothumbs_vars.settings.zoom_general_zoom_type === "follow") ? 'shape' + iconic_woothumbs_vars.settings.zoom_follow_zoom_zoom_shape : "shapesquare",
				position: iconic_woothumbs_vars.settings.zoom_outside_zoom_zoom_position,
				preload: false,
				showDescription: false,
				hoverIntent: iconic_woothumbs_vars.settings.zoom_general_zoom_type === "follow",
				onShow: function() {
					iconic_woothumbs.add_zoom_controls( product_object );
					product_object.images.slick( 'slickPause' );
				},
				onHide: function() {
					if ( iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.carousel_general_autoplay ) ) {
						product_object.images.slick( 'slickPlay' );
					}
				}
			} );

			product_object.imagezoom = $parent_slide.data( 'imagezoom' );
		},

		/**
		 * Destroy Hover Zoom
		 *
		 * @param product_object
		 */

		destroy_zoom: function( product_object ) {
			var $current_zoom = product_object.images.find( '.currZoom' ),
				zoom = $current_zoom.data( 'imagezoom' );

			if ( zoom && typeof zoom !== "undefined" ) {

				$current_zoom.removeClass( 'currZoom' );
				zoom.destroy();

			}

			$( '.zm-viewer' ).remove();
			$( '.zm-handler' ).remove();
		},

		/**
		 * Add Zoom Controls
		 *
		 * @param product_object
		 */

		add_zoom_controls: function( product_object ) {

			var $viewer = product_object.imagezoom.$viewer;

			if ( $viewer.find( '.iconic-woothumbs-zoom-controls' ).length <= 0 && iconic_woothumbs_vars.settings.zoom_general_zoom_type === "inner" ) {

				if ( iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.display_general_icons_tooltips ) ) {
					$viewer.addClass( 'iconic-woothumbs-tooltips-enabled' );
				}

				$viewer.append( '<div class="iconic-woothumbs-zoom-controls"></div>' );

				var $zoom_controls = $viewer.find( '.iconic-woothumbs-zoom-controls' );

				if ( product_object.wishlist_buttons.length > 0 ) {
					$zoom_controls.append( product_object.wishlist_buttons.clone() );
				}

				if ( product_object.play_button.length > 0 ) {
					$zoom_controls.append( iconic_woothumbs.tpl.play_button );

					$viewer.on( 'click', iconic_woothumbs.vars.play_trigger, function() {
						iconic_woothumbs.trigger_photoswipe( product_object, true );
					} );
				}

				if ( iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.fullscreen_general_enable ) ) {
					$zoom_controls.append( iconic_woothumbs.tpl.fullscreen_button );

					$viewer.on( 'click', iconic_woothumbs.vars.fullscreen_trigger, function() {
						iconic_woothumbs.trigger_photoswipe( product_object );
					} );
				}

				if ( iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.navigation_general_controls ) && iconic_woothumbs.get_thumbnail_count( product_object ) > 1 ) {

					var dir = iconic_woothumbs.vars.is_rtl ? 'slickNect' : 'slickPrev';

					if ( !product_object.images_wrap.find( '.iconic-woothumbs-images__arrow--prev' ).hasClass( 'slick-disabled' ) ) {
						$zoom_controls.append( '<a class="iconic-woothumbs-zoom-prev" href="javascript: void(0);"><i class="iconic-woothumbs-icon iconic-woothumbs-icon-left-open-mini"></i></a>' );
					}

					if ( !product_object.images_wrap.find( '.iconic-woothumbs-images__arrow--next' ).hasClass( 'slick-disabled' ) ) {
						$zoom_controls.append( '<a class="iconic-woothumbs-zoom-next" href="javascript: void(0);"><i class="iconic-woothumbs-icon iconic-woothumbs-icon-right-open-mini"></i></a>' );
					}

					// Arrow nav
					$viewer.on( 'click', '.iconic-woothumbs-zoom-prev', function() {

						var dir = iconic_woothumbs.vars.is_rtl ? 'slickNext' : 'slickPrev';

						product_object.images.slick( dir );

					} );

					$viewer.on( 'click', '.iconic-woothumbs-zoom-next', function() {

						var dir = iconic_woothumbs.vars.is_rtl ? 'slickPrev' : 'slickNext';

						product_object.images.slick( dir );

					} );

				}

				if ( iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.navigation_bullets_enable ) ) {

					var $bullets = product_object.all_images_wrap.find( '.slick-dots' );

					if ( $bullets.children().length > 1 ) {

						var $bullets_clone = $bullets.clone();

						$bullets_clone.appendTo( $zoom_controls ).wrap( "<div class='iconic-woothumbs-zoom-bullets'></div>" );

						// Bullet nav

						$viewer.on( 'click', '.iconic-woothumbs-zoom-bullets button', function() {

							var selected_index = $( this ).parent().index();

							// change main slide
							product_object.images.slick( 'slickGoTo', selected_index );

							return false;

						} );

					}

				}

				iconic_woothumbs.setup_tooltips();

			}

		},

		/**
		 * Setup Yith Wishlist
		 *
		 * @param product_object
		 */
		setup_yith_wishlist: function() {

			$( 'body' ).on( 'added_to_wishlist', function() {

				if ( iconic_woothumbs.wishlist_adding.length <= 0 ) {
					return;
				}

				var adding_id = iconic_woothumbs.wishlist_adding.shift(),
					$wishlist_buttons = $( '[data-iconic-woothumbs-yith-wishlist-adding-id="' + adding_id + '"]' );

				$wishlist_buttons.addClass( iconic_woothumbs.vars.wishlist_added_class );

			} );

		},

		/**
		 * Watch Yith Wishlist Buttons
		 *
		 * @param product_object
		 */
		watch_yith_wishlist: function( product_object ) {

			if ( product_object.wishlist_buttons.length <= 0 ) {
				return;
			}

			product_object.wishlist_add_button.on( 'click', function() {

				var adding_id = iconic_woothumbs.wishlist_adding.length + 1;

				product_object.wishlist_buttons.attr( 'data-iconic-woothumbs-yith-wishlist-adding-id', adding_id );

				iconic_woothumbs.wishlist_adding.push( adding_id );

			} );

		},

		/**
		 * Setup Tooltips
		 */

		setup_tooltips: function() {

			if ( iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.display_general_icons_tooltips ) ) {

				$( '[data-iconic-woothumbs-tooltip]' ).each( function() {

					var tooltip = $( this ).attr( 'data-iconic-woothumbs-tooltip' );

					$( this ).tooltipster( {
						content: tooltip,
						debug: false
					} );
				} );

			}

		},

		/**
		 * Update caption
		 */

		update_caption: function( $current_slide, product_object ) {

			if ( product_object.caption.length <= 0 ) {
				return;
			}

			var caption = $current_slide.data( 'caption' );

			if ( typeof caption === "undefined" || caption === "" ) {
				product_object.caption.html( "&mdash;" );
			} else {
				product_object.caption.text( caption );
			}

		},

		/**
		 * Stop media.
		 */
		stop_media: function( product_object ) {
			var $media = product_object.images.find( 'iframe, video' );

			if ( $media.length <= 0 ) {
				return;
			}

			$media.each( function( index, media ) {
				var $media_item = $( media ),
					active = $media_item.closest( '.slick-active' ).length > 0;

				if ( active ) {
					return;
				}

				if ( $media_item.is( 'iframe' ) ) {
					$media_item.attr( 'src', $( media ).attr( 'src' ) );
				} else {
					var paused = $media_item.get( 0 ).paused;

					if ( !paused ) {
						$media_item.data( 'playing', true );
						$media_item.get( 0 ).pause();
					}
				}
			} );
		},

		/**
		 * Start video media (if it was playing before).
		 */
		start_media: function( product_object ) {
			var $media = product_object.images.find( 'video' );

			if ( $media.length <= 0 ) {
				return;
			}

			$media.each( function( index, media ) {
				var $media_item = $( media ),
					active = $media_item.closest( '.slick-active' ).length > 0;

				if ( !active || $media_item.data( 'playing' ) !== true ) {
					return;
				}

				$media_item.get( 0 ).play();

				// Seek video to 0 second the first time it is played. To fix
				// the issue with Edge browser where video starts from 3 seconds
				if ( ! $media_item.data( 'has-played' ) ) {
					$media_item.get( 0 ).currentTime = 0;
					$media_item.data( 'has-played', 1 );
				}

				// Remove now as it'll be added when sliding anyway
				$media_item.data( 'playing', false );
			} );
		},

		/**
		 * Setup media controls.
		 *
		 * @param product_object
		 */
		setup_media_controls: function( product_object ) {
			$( document.body ).on( 'click', '.' + iconic_woothumbs.vars.media_controls_class, function( e ) {
				var $button = $( this ),
					$media = $button.closest( '.iconic-woothumbs-responsive-media' ).find( 'video' ),
					$icon = $button.find( '.iconic-woothumbs-icon' );

				if ( $media.length <= 0 ) {
					return;
				}

				// If the timestamp of the current controls event is the same as the previous
				// event, this is a sign that we have a third party conflict causing a second
				// trigger of the click handler, which causes the video to immediately pause
				// once played. This caters for this and avoids having to spend considerable
				// time investigating each and every cause.
				if ( e.timeStamp === window.iconic_woothumbs_last_controls_event_timestamp ) {
					return;
				}

				window.iconic_woothumbs_last_controls_event_timestamp = e.timeStamp;

				$media_item = $media.get( 0 );

				var playing = !$media_item.paused;

				if ( playing ) {
					iconic_woothumbs.pause_video( $media );
				} else {
					$button.removeClass( iconic_woothumbs.vars.play_controls_class );
					$button.addClass( iconic_woothumbs.vars.pause_controls_class );
					$icon.removeClass( iconic_woothumbs.vars.play_button_class );
					$icon.addClass( iconic_woothumbs.vars.pause_button_class );
					$media_item.play();
				}
			} );

			// Add hover class.
			$( document ).on( 'mouseover touchstart', '.iconic-woothumbs-responsive-media', function () {
				$( this ).addClass( 'iconic-woothumbs-responsive-media--hover' );
			});

			// Remove hover class.
			$( document ).on( 'mouseout ', '.iconic-woothumbs-responsive-media' , function() {
				$( this ).removeClass( 'iconic-woothumbs-responsive-media--hover' );
			} );

			// Auto hide the controls after 1 second of mobile tap event.
			// Since there is no mouseout event in mobile, we need to auto-hide controls.
			jQuery(document).on( 'touchend', '.iconic-woothumbs-responsive-media' , function() {
				if ( iconic_woothumbs.vars.media_touch_timer ) {
					clearTimeout( iconic_woothumbs.vars.media_touch_timer );
				}

				iconic_woothumbs.vars.media_touch_timer = setTimeout( function() {
					jQuery(".iconic-woothumbs-responsive-media").removeClass('iconic-woothumbs-responsive-media--hover');
				}, 1000 );
			});

			iconic_woothumbs.setup_media_ended();
		},

		/**
		 * Run code when embeded video ends.
		 *
		 * @param $images
		 */
		setup_media_ended: function() {
			var $responsive_media = $( '.iconic-woothumbs-responsive-media' ).filter( function() {
				return $( this ).data( 'iconic-onended-bound' ) !== true;
			} );

			if ( $responsive_media.length <= 0 ) {
				return;
			}

			var $controls = $responsive_media.find( '.' + iconic_woothumbs.vars.media_controls_class );

			if ( $controls.length <= 0 ) {
				return;
			}

			var $media_items = $responsive_media.find( '.iconic-woothumbs-responsive-media__manual-embed' );

			if ( $media_items.length <= 0 ) {
				return;
			}

			$.each( $media_items, function( index, media_item ) {
				var $media_item = $( media_item ),
					$media = $media_item.get( 0 );

				$media.onended = function() {
					var $media = $( this ),
						$button = $media.closest( '.iconic-woothumbs-responsive-media' ).find( '.' + iconic_woothumbs.vars.media_controls_class ),
						$icon = $button.find( '.iconic-woothumbs-icon' );

					$button.removeClass( iconic_woothumbs.vars.pause_controls_class );
					$button.addClass( iconic_woothumbs.vars.play_controls_class );
					$icon.removeClass( iconic_woothumbs.vars.pause_button_class );
					$icon.addClass( iconic_woothumbs.vars.play_button_class );
				};
			} );

			$responsive_media.data( 'iconic-onended-bound', true );
		},

		/**
		 * Reveal slides.
		 */
		reveal_slides: function( product_object ) {
			product_object.images.find( '.iconic-woothumbs-images__slide' ).show();
		},

		/**
		 * Images loaded with srcset.
		 */
		images_loaded: function( selector, on_complete, on_progress ) {
			var $images = $( selector ).find( 'img, iframe, video' ),
				success = 0,
				error = 0,
				iteration = 0,
				total = $images.length;

			var check = function( el, status ) {
				iteration ++;
				var data = {
					img: el,
					iteration: iteration,
					success: success,
					error: error,
					total: total,
					status: status
				};

				if ( typeof on_progress === 'function' ) {
					on_progress( data );
				}

				if ( success + error === total && typeof on_complete === 'function' ) {
					on_complete( data );
				}
			};

			$images.each( function() {
				var $el = $( this );

				if ( !$el.is( 'img' ) ) {
					success ++;
					check( this, 'success' );
					return;
				}

				var tmpImg = new Image();

				tmpImg.onload = function() {
					success ++;
					check( this, 'success' );
				};

				tmpImg.onerror = function() {
					error ++;
					check( this, 'error' );
				};

				tmpImg.src = this.src;
			} );
		},

		/**
		 * On fullscreen change event.
		 */
		on_fullscreenchange: function () {
			iconic_woothumbs.vars.fullscreeen_flag = true;

			// set the flag back to 'false' after a while.
			setTimeout( function () {
				iconic_woothumbs.vars.fullscreeen_flag = false;
			}, 1000 );

		}

	};

	$( window ).on( 'load', function(e) {
		iconic_woothumbs.on_load(e);
	});
	$( 'body' ).on( 'jckqv_open', function(e) {
		iconic_woothumbs.on_load(e);
	});

	// Compatibility with the "quick view" functionality provided
	// by the JetWoo Popup plugin for Elementor.
	$( window ).on( 'jet-popup/show-event/after-show', function(e) {
		iconic_woothumbs.on_load(e);
	});
	$( window ).on( 'resize', iconic_woothumbs.on_resize );
	$( document ).on( 'fullscreenchange webkitfullscreenchange', iconic_woothumbs.on_fullscreenchange );

}( jQuery, document ));
/*
*	ImageZoom - Responsive jQuery Image Zoom Pluin
*   version: 1.1.1
*	by hkeyjun & jamesckemp
*   http://codecanyon.net/user/hkeyjun
*/
;(function( $, window, undefined ) {
	$.ImageZoom = function(el,options){
		var base = this;
		base.$el = $(el);
		base.$img = base.$el.is( 'img' ) ? base.$el : base.$el.find( 'img:first' );

		base.$el.data('imagezoom',base);

		base.init = function(options){
			base.options = $.extend({},$.ImageZoom.defaults,options);
			base.$viewer = $('<div class="zm-viewer '+base.options.zoomViewerClass+'"></div>').appendTo('body');
			base.$handler = $('<div class="zm-handler'+base.options.zoomHandlerClass+'"></div>').data( 'el', el ).appendTo('body');
			base.isBigImageReady = -1;
			base.$largeImg = null;
			base.isActive = false;
			base.$handlerArea = null;
			base.isWebkit = /chrome/.test(navigator.userAgent.toLowerCase()) || /safari/.test(navigator.userAgent.toLowerCase());
			base.evt ={x:-1,y:-1};
			base.options.bigImageSrc =base.options.bigImageSrc ==''?base.$img.attr('src'):base.options.bigImageSrc;
			if(base.options.preload) (new Image()).src=this.options.bigImageSrc;
			base.callIndex = $.ImageZoom._calltimes +1;
			base.animateTimer = null;
			$.ImageZoom._calltimes +=1;

			$(document).on('mousemove',function(e) {
                window.mouseX = e.pageX;
                window.mouseY = e.pageY;
            });

			$(document).on('mousemove.imagezoom'+base.callIndex,function(e){
				if(base.isActive)
				{
					base.moveHandler(e.pageX,e.pageY);
				}
			});

			if( base.options.hoverIntent ) {

    			base.$el.hoverIntent({
                    over: base.over,
                    out: base.out,
                    sensitivity: 10
                });

            } else {

                base.$el.on('mouseover.imagezoom',function(e){
                    base.isActive = true;
                    base.showViewer(e);
                });

            }

		};

		base.over = function( e ) {

    		base.isActive = true;
            base.showViewer(e);
            base.moveHandler(mouseX,mouseY);

		};

		base.out = function() {};

		//Move
		base.moveHandler = function(x,y){


			var offset = base.$el.offset(),width=base.$el.outerWidth(false),height=base.$el.outerHeight(false);

			if(x>=offset.left && x<=offset.left+width && y>=offset.top && y<=offset.top+height)
			{
				offset.left = offset.left +toNum(base.$el.css('borderLeftWidth'))+toNum(base.$el.css('paddingLeft'));
				offset.top = offset.top + toNum(base.$el.css('borderTopWidth'))+toNum(base.$el.css('paddingTop'));
				width = base.$el.width();
				height = base.$el.height();
				if(x>=offset.left && x<=offset.left+width && y>=offset.top && y<=offset.top+height)
				{
					base.evt = {x:x,y:y};
				if(base.options.type=="follow")
				{
					base.$viewer.css({top:y-base.$viewer.outerHeight(false)/2,left:x-base.$viewer.outerWidth(false)/2});
				}
				if(base.isBigImageReady ==1)
				{
					var bigTop,bigLeft;
					var innerTop = y - offset.top,innerLeft = x-offset.left;
					if(base.options.type=='inner')
					{
						bigTop = -base.$largeImg.height()*innerTop/height + innerTop;
						bigLeft = -base.$largeImg.width()*innerLeft/width + innerLeft;
					}
					else if(base.options.type=="standard")
					{
						var hdLeft=innerLeft-base.$handlerArea.width()/2,hdTop=innerTop - base.$handlerArea.height()/2,
						hdWidth = base.$handlerArea.width(),hdHeight = base.$handlerArea.height();
						if(hdLeft <0)
						{
							hdLeft =0;
						}
						else if(hdLeft>width - hdWidth)
						{
							hdLeft = width - hdWidth;
						}
						if(hdTop<0)
						{
							hdTop =0;
						}
						else if(hdTop > height -hdHeight)
						{
							hdTop = height - hdHeight;
						}
						bigLeft = -hdLeft / base.scale;
						bigTop = -hdTop /base.scale;


						if(base.isWebkit)
						{
							base.$handlerArea.css({opacity:.99});
							setTimeout(function(){
									base.$handlerArea.css({top:hdTop,left:hdLeft,opacity:1});
							},0);
						}
						else
						{
							base.$handlerArea.css({top:hdTop,left:hdLeft});
						}
					}
					else if(base.options.type=="follow")
					{

						bigTop = -base.$largeImg.height()/height * innerTop +base.options.zoomSize[1]/2;
						bigLeft = -base.$largeImg.width()/width *  innerLeft +base.options.zoomSize[0]/2;

						if(-bigTop > base.$largeImg.height() -base.options.zoomSize[1])
						{
							bigTop = -(base.$largeImg.height()-base.options.zoomSize[1]);
						}
						else if(bigTop>0)
						{
							bigTop =0;
						}

						if(-bigLeft >base.$largeImg.width() -base.options.zoomSize[0])
						{
							bigLeft = -(base.$largeImg.width()-base.options.zoomSize[0]);
						}
						else if(bigLeft>0)
						{
							bigLeft =0;
						}
					}

					if(base.options.smoothMove)
					{
						window.clearTimeout(base.animateTimer);
						base.smoothMove(bigLeft,bigTop);
					}
					else
					{
						base.$viewer.find('img').css({top:bigTop,left:bigLeft});
					}
				}
				}

			}
			else
			{
				base.isActive = false;
				//hidden the viewer
				base.$viewer.hide();
				base.$handler.hide();
				base.options.onHide(base);
				window.clearTimeout(base.animateTimer);
				base.animateTimer =null;
			}
		};
		//Show the zoom view
		base.showViewer = function(e){

			var top = base.$el.offset().top,borderTopWidth = toNum(base.$el.css('borderTopWidth')),paddingTop = toNum(base.$el.css('paddingTop')),left = base.$el.offset().left,borderLeftWidth =toNum(base.$el.css('borderLeftWidth')),paddingLeft = toNum(base.$el.css('paddingLeft'));
			top = top + borderTopWidth+paddingTop;
			left = left +borderLeftWidth+paddingLeft;

			var width = base.$el.width();
			var height = base.$el.height();
			//log(base.isBigImageReady);
			if(base.isBigImageReady <1)
			{
				$('div',base.$viewer).remove();
			}



			if(base.options.type=='inner')
			{
				base.$viewer.css({top:top,left:left,width:width,height:height}).fadeIn(200);
			}
			else if(base.options.type=='standard')
			{
				var $alignTarget = base.options.alignTo == '' ? base.$el:$('#'+base.options.alignTo);
				var viewLeft,viewTop;
				if(base.options.position == 'left')
				{
					viewLeft = $alignTarget.offset().left - base.options.zoomSize[0] - base.options.offset[0];
					viewTop = $alignTarget.offset().top + base.options.offset[1];
				}
				else if(base.options.position == 'right')
				{
					viewLeft = $alignTarget.offset().left +$alignTarget.width() + base.options.offset[0];
					viewTop = $alignTarget.offset().top + base.options.offset[1];
				}

				base.$viewer.css({top:viewTop,left:viewLeft,width:base.options.zoomSize[0],height:base.options.zoomSize[1]}).fadeIn(200);
				//zoom handler ajust
				if(base.$handlerArea)
				{
					//been change
					 base.scale = width / base.$largeImg.width();
					base.$handlerArea.css({width:base.$viewer.width()*base.scale,height:base.$viewer.height()*base.scale});
				}
			}
			else if(base.options.type=="follow")
			{
				base.$viewer.css({width:base.options.zoomSize[0],height:base.options.zoomSize[1],top:e.pageY-(base.options.zoomSize[1]/2),left:e.pageX-(base.options.zoomSize[0]/2)}).fadeIn(200);
			}


			base.$handler.css({top:top,left:left,width:width,height:height}).fadeIn(200);

			base.options.onShow(base);

			if(base.isBigImageReady ==-1)
			{
				base.isBigImageReady =0;

				fastImg(base.options.bigImageSrc, function () {

					if( $(this).attr('src').trim() == base.options.bigImageSrc.trim() )
					{
						var $baseImg = base.$el.is( 'img' ) ? base.$el : base.$el.find( 'img:first' );
						base.$viewer.append('<img src="'+$baseImg.attr('src')+'" class="zm-fast" style="position:absolute;width:'+this.width+'px;height:'+this.height+'px" nopin="nopin" \>');
						base.isBigImageReady = 1;
						base.$largeImg = $('<img src="'+base.options.bigImageSrc+'" style="position:absolute;width:'+this.width+'px;height:'+this.height+'px" nopin="nopin" \>')
						base.$viewer.append(base.$largeImg);
						if(base.options.type=='standard')
						{
							var scale = width / this.width;
							base.$handlerArea = $('<div class="zm-handlerarea" style="width:'+base.$viewer.width()*scale+'px;height:'+base.$viewer.height()*scale+'px"></div>').appendTo(base.$handler);
base.scale = scale;

						}
						//if mouse is in the img before bind mouse move event we can not get x/y from base.evt
						if(base.evt.x ==-1 && base.evt.y ==-1)
						{
							base.moveHandler(e.pageX,e.pageY);
						}
						else
						{
							base.moveHandler(base.evt.x,base.evt.y);
						}

						//add description
						if(base.options.showDescription&&base.$img.attr('alt')&& base.$img.attr('alt').trim()!='')
						{
							base.$viewer.append('<div class="'+base.options.descriptionClass+'">'+base.$img.attr('alt')+'</div>');
						}
					}
					else
					{
						//log('change onload');
					}

				},function(){
					//log('load complete');

				},function(){
					//log('error');
				});
			}
					};


		//Change Img

		base.changeImage = function(elementImgSrc,bigImgSrc)
		{
			//console.log(this.$el);
			this.$el.attr('src',elementImgSrc);
			this.isBigImageReady=-1;
			this.options.bigImageSrc = typeof bigImgSrc ==='string'?bigImgSrc:elementImgSrc;
			if(base.options.preload) (new Image()).src=this.options.bigImageSrc;
			this.$viewer.hide().empty();
			this.$handler.hide().empty();
			this.$handlerArea =null;
		};

		base.changeZoomSize = function(w,h){
			base.options.zoomSize = [w,h];
		};

		base.destroy = function(){
			$(document).off('mousemove.imagezoom'+base.callIndex);
			this.$el.off('.imagezoom');
			this.$viewer.remove();
			this.$handler.remove();
			this.$el.removeData('imagezoom');
		};
		base.smoothMove = function(left,top)
		{
			var times = 10;
			var oldTop = parseInt(base.$largeImg.css('top'));
			oldTop = isNaN(oldTop)? 0:oldTop;
			var oldLeft = parseInt(base.$largeImg.css('left'));
			oldLeft = isNaN(oldLeft)? 0:oldLeft;
			top = parseInt(top),left = parseInt(left);

			if(oldTop == top && oldLeft ==left)
			{
				window.clearTimeout(base.animateTimer);
				base.animateTimer = null;
				//console.log('clear timer');
				return;
			}
			else
			{
				var topStep = top-oldTop;
				var leftStep = left -oldLeft;

				var newTop = oldTop + topStep/Math.abs(topStep)* Math.ceil(Math.abs(topStep/times));
				var newLeft = oldLeft + leftStep/Math.abs(leftStep) *Math.ceil(Math.abs(leftStep/times));

				base.$viewer.find('img').css({top:newTop,left:newLeft});

				base.animateTimer = setTimeout(function(){
					base.smoothMove(left,top);
				},10);
			}
		};

		//tools
		function toNum(strVal)
		{
			var numVal = parseInt(strVal);
			numVal = isNaN(numVal)? 0:numVal;
			return numVal;
		}

		base.init(options);
	};
	//defaults
	$.ImageZoom.defaults = {
		bigImageSrc:'',
		preload:true,
		type:'inner',
		smoothMove: true,
		position:'right',
		offset:[10,0],
		alignTo:'',
		zoomSize:[100,100],
		descriptionClass:'zm-description',
		zoomViewerClass:'',
		zoomHandlerClass:'',
		showDescription:true,
		hoverIntent:false,
		onShow:function(target){},
		onHide:function(target){}
	};

	$.ImageZoom._calltimes = 0;

	//$.fn
	$.fn.ImageZoom = function(options){
		return this.each(function(){
			new $.ImageZoom(this,options);
		});
	};

})(jQuery,window);



var fastImg = (function () {
	var list = [], intervalId = null,
	tick = function () {
		var i = 0;
		for (; i < list.length; i++) {
			list[i].end ? list.splice(i--, 1) : list[i]();
		};
		!list.length && stop();
	},
	stop = function () {
		clearInterval(intervalId);
		intervalId = null;
	};

	return function (url, ready, load, error) {
		var onready, width, height, newWidth, newHeight,
			img = new Image();
		img.src = url;
		if (img.complete) {
			ready.call(img);
			load && load.call(img);
			return;
		};
		width = img.width;
		height = img.height;
		img.onerror = function () {
			error && error.call(img);
			onready.end = true;
			img = img.onload = img.onerror = null;
		};
		onready = function () {
			newWidth = img.width;
			newHeight = img.height;
			if (newWidth !== width || newHeight !== height ||newWidth * newHeight > 1024) {
				ready.call(img);
				onready.end = true;
			};
		};
		onready();
		img.onload = function () {
			!onready.end && onready();
			load && load.call(img);
			img = img.onload = img.onerror = null;
		};
		if (!onready.end) {
			list.push(onready);
			if (intervalId === null) intervalId = setInterval(tick, 40);
		};
	};
})();