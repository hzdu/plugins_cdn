(function( $, document ) {

	window.iconic_woothumbs_plyr = {
		'gallery': [],
		'fullscreen': []
	};
	window.iconic_woothumbs_photoswipe = false;

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
			iconic_woothumbs.els.images_wrap = $( '.iconic-woothumbs-images-wrap' );

			iconic_woothumbs.els.video_template = $( '#iconic-woothumbs-video-template' );

			// common vars
			iconic_woothumbs.vars.zoom_setup = false;
			iconic_woothumbs.vars.media_touch_timer = false;
			iconic_woothumbs.vars.window_resize_timeout = false;
			iconic_woothumbs.vars.is_dragging_image_slide = false;
			iconic_woothumbs.vars.is_slider_layout = ( 'slider' === iconic_woothumbs_vars.settings.display_general_layout );
			iconic_woothumbs.vars.is_stacked_layout = ( 'stacked' === iconic_woothumbs_vars.settings.display_general_layout );
			iconic_woothumbs.vars.is_rtl = iconic_woothumbs.is_true( iconic_woothumbs_vars.is_rtl );
			iconic_woothumbs.vars.dedupe_images = iconic_woothumbs.is_true( iconic_woothumbs_vars.dedupe_images );
			iconic_woothumbs.vars.images_are_vertical = iconic_woothumbs_vars.settings.carousel_general_mode === "vertical";
			iconic_woothumbs.vars.thumbnails_are_vertical = iconic_woothumbs_vars.settings.navigation_thumbnails_position === "left" || iconic_woothumbs_vars.settings.navigation_thumbnails_position === "right";
			iconic_woothumbs.vars.slide_class = 'iconic-woothumbs-images__slide';
			iconic_woothumbs.vars.loading_class = "iconic-woothumbs-loading";
			iconic_woothumbs.vars.fullscreen_loading_class = 'iconic-woothumbs-fullscreen-loading';
			iconic_woothumbs.vars.media_playing_class = 'iconic-woothumbs-images-wrap--media-playing';
			iconic_woothumbs.vars.reset_class = "iconic-woothumbs-reset";
			iconic_woothumbs.vars.thumbnails_active_class = "iconic-woothumbs-thumbnails__slide--active";
			iconic_woothumbs.vars.wishlist_adding_class = "iconic-woothumbs-wishlist-buttons--adding";
			iconic_woothumbs.vars.wishlist_added_class = "iconic-woothumbs-wishlist-buttons--added";
			iconic_woothumbs.vars.is_zoom_enabled = iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.zoom_general_enable );
			iconic_woothumbs.vars.is_fullscreen_enabled = iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.fullscreen_general_enable );
			iconic_woothumbs.vars.change_on_thumb_hover = iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.navigation_thumbnails_change_on_thumb_hover );
			iconic_woothumbs.vars.thumbnail_hover_timer = false;
			iconic_woothumbs.vars.show_variation_trigger = "iconic_woothumbs_show_variation";
			iconic_woothumbs.vars.loading_variation_trigger = "iconic_woothumbs_loading_variation";
			iconic_woothumbs.vars.show_attribute_trigger = "iconic_woothumbs_show_attribute";
			iconic_woothumbs.vars.loading_attribute_trigger = "iconic_woothumbs_loading_attribute";
			iconic_woothumbs.vars.fullscreen_trigger = iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.fullscreen_general_click_anywhere ) ? ".iconic-woothumbs-fullscreen, img" : ".iconic-woothumbs-fullscreen";
			iconic_woothumbs.vars.photoswipe_container_class = '.iconic-woothumbs-pswp';
			iconic_woothumbs.vars.play_trigger = ".iconic-woothumbs-play";
			iconic_woothumbs.vars.window_size = {
				height: $( window ).height(),
				width: $( window ).width()
			};
			iconic_woothumbs.vars.placeholder_img = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

			// plyr specific settings
			iconic_woothumbs.vars.plyr_gallery_type    = 'gallery';
			iconic_woothumbs.vars.plyr_fullscreen_type = 'fullscreen';
			iconic_woothumbs.vars.plyr_video_selector  = '.iconic-woothumbs-plyr:not(.plyr)';
			iconic_woothumbs.vars.plyr_poster          = iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.media_general_poster );
			iconic_woothumbs.vars.plyr_loop            = iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.media_general_loop );
			iconic_woothumbs.vars.plyr_autoplay        = iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.media_general_autoplay );
			iconic_woothumbs.vars.plyr_controls        = iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.media_general_controls );
			iconic_woothumbs.vars.plyr_controls_list   = iconic_woothumbs_vars.settings.media_general_controls_list;
			iconic_woothumbs.vars.plyr_tooltips        = iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.display_general_icons_tooltips );

			// svg icons
			iconic_woothumbs.vars.icon_loading = JSON.parse( iconic_woothumbs_vars.icon_loading );
			iconic_woothumbs.vars.icon_video = JSON.parse( iconic_woothumbs_vars.icon_video );
			iconic_woothumbs.vars.icon_fullscreen = JSON.parse( iconic_woothumbs_vars.icon_fullscreen );
			iconic_woothumbs.vars.icon_arrow_left = JSON.parse( iconic_woothumbs_vars.icon_arrow_left );
			iconic_woothumbs.vars.icon_arrow_right = JSON.parse( iconic_woothumbs_vars.icon_arrow_right );
			iconic_woothumbs.vars.icon_arrow_up = JSON.parse( iconic_woothumbs_vars.icon_arrow_up );
			iconic_woothumbs.vars.icon_arrow_down = JSON.parse( iconic_woothumbs_vars.icon_arrow_down );
			iconic_woothumbs.vars.icon_zoom = JSON.parse( iconic_woothumbs_vars.icon_zoom );
			iconic_woothumbs.vars.icon_close = JSON.parse( iconic_woothumbs_vars.icon_close );
			iconic_woothumbs.vars.icon_pswp_arrow_left = JSON.parse( iconic_woothumbs_vars.icon_pswp_arrow_left );
			iconic_woothumbs.vars.icon_pswp_arrow_right = JSON.parse( iconic_woothumbs_vars.icon_pswp_arrow_right );
			iconic_woothumbs.vars.icon_pswp_zoom = JSON.parse( iconic_woothumbs_vars.icon_pswp_zoom );
			iconic_woothumbs.vars.icon_pswp_close = JSON.parse( iconic_woothumbs_vars.icon_pswp_close );

			// common templates
			iconic_woothumbs.tpl.prev_arrow = `<a href="javascript: void(0);" class="iconic-woothumbs-images__arrow iconic-woothumbs-images__arrow--prev">${iconic_woothumbs.vars.icon_arrow_left}</a>`;
			iconic_woothumbs.tpl.next_arrow = `<a href="javascript: void(0);" class="iconic-woothumbs-images__arrow iconic-woothumbs-images__arrow--next">${iconic_woothumbs.vars.icon_arrow_right}</a>`;
			iconic_woothumbs.tpl.prev_arrow_rtl = iconic_woothumbs.tpl.next_arrow;
			iconic_woothumbs.tpl.next_arrow_rtl = iconic_woothumbs.tpl.prev_arrow;

			iconic_woothumbs.tpl.fullscreen_button = `<a href="javascript: void(0);" class="iconic-woothumbs-fullscreen" data-iconic-woothumbs-tooltip="${iconic_woothumbs_vars.text.fullscreen}">${iconic_woothumbs.vars.icon_fullscreen}</a>`;
			iconic_woothumbs.tpl.play_button = `<a href="javascript: void(0);" class="iconic-woothumbs-play" data-iconic-woothumbs-tooltip="${iconic_woothumbs_vars.text.video}">${iconic_woothumbs.vars.icon_video}</a>`;
			iconic_woothumbs.tpl.stacked_image_slide = `<div class="${iconic_woothumbs.vars.slide_class} {{slide_index_class}}" data-index="{{index}}"><img style="{{slide_aspect}}" class="iconic-woothumbs-images__image" src="{{image_lazy}}" srcset="{{image_srcset}}" sizes="{{image_sizes}}" data-caption="{{image_caption}}" data-large_image="{{large_image_src}}" data-large_image_width="{{large_image_width}}" data-large_image_height="{{large_image_height}}" width="{{image_width}}" height="{{image_height}}" title="{{title}}" alt="{{alt}}" loading="lazy"></div>`;
			iconic_woothumbs.tpl.gallery_image_slide = `<div class="${iconic_woothumbs.vars.slide_class} {{slide_index_class}}" data-index="{{index}}"><img style="{{slide_aspect}}" class="iconic-woothumbs-images__image no-lazyload skip-lazy" src="${iconic_woothumbs.vars.placeholder_img}" data-lazy="{{image_lazy}}" data-srcset="{{image_srcset}}" data-sizes="{{image_sizes}}" data-caption="{{image_caption}}" data-large_image="{{large_image_src}}" data-large_image_width="{{large_image_width}}" data-large_image_height="{{large_image_height}}" width="{{image_width}}" height="{{image_height}}" title="{{title}}" alt="{{alt}}"></div>`;
			iconic_woothumbs.tpl.media_slide = `<div class="${iconic_woothumbs.vars.slide_class} {{slide_index_class}}" style="{{slide_aspect}}" data-index="{{index}}">{{media_embed}}</div>`;
			iconic_woothumbs.tpl.thumbnail_slide = '<div class="iconic-woothumbs-thumbnails__slide {{slide_class}}"  data-index="{{index}}"><div class="iconic-woothumbs-thumbnails__image-wrapper">{{play_icon}}<img style="{{slide_aspect}}" class="iconic-woothumbs-thumbnails__image {{lazy_classes}}" src="{{maybe_image_src}}" data-lazy="{{image_src}}" data-srcset="{{image_srcset}}" data-sizes="{{image_sizes}}" title="{{title}}" alt="{{alt}}" width="{{image_width}}" height="{{image_height}}" loading="{{lazy_type}}"></div></div>';
			iconic_woothumbs.tpl.thumbnail_play_icon = `<div class="iconic-woothumbs-thumbnails__play-overlay">${iconic_woothumbs.vars.icon_video}</div>`;
			iconic_woothumbs.tpl.photoswipe = wp.template( 'iconic-woothumbs-pswp' );
			iconic_woothumbs.tpl.media = `<div class="iconic-woothumbs-fullscreen-video-wrapper iconic-woothumbs-fullscreen-video-wrapper--wide">{{media_embed}}</div>`;
			iconic_woothumbs.tpl = $.extend(iconic_woothumbs.tpl, (iconic_woothumbs_vars.tpl !== undefined ? iconic_woothumbs_vars.tpl : [] ));

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
			// 1. If the standard `load` event has NOT already been triggered.
			// 2. Any of the specified custom plugin events have fired.
			if (
				( ! window.iconicWooThumbsLoadFired && e.type === 'load' ) ||
				-1 !== iconic_woothumbs.custom_init_events.indexOf( e.type )
				) {
				iconic_woothumbs.prepare_products();
				iconic_woothumbs.init();
				window.iconicWooThumbsLoadFired = ( e.type === 'load' );
			}
		},

		/**
		 * Run on resize
		 */

		on_resize: function() {
			iconic_woothumbs.cache();

			var new_window = {
				height: $( window ).height(),
				width: $( window ).width()
			};

			clearTimeout( iconic_woothumbs.vars.window_resize_timeout );

			iconic_woothumbs.vars.window_resize_timeout = setTimeout( function() {
				// Allow resize-end to fire the first time the resize
				// event fires; this ensures that changing device 
				// orientation and using responsive tools in the browser
				// will still lead to the responsive layout logic firing.
				if ( typeof iconic_woothumbs.vars.window_size.width === 'undefined' ) {
					$( window ).trigger( 'resize-end' );
				}

				// Dont trigger resize-end event if it is a fullscreen change.
				if ( 
					typeof iconic_woothumbs.vars.window_size.width !== 'undefined' &&
					iconic_woothumbs.vars.window_size.width !== new_window.width
				) {
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
					'wishlist_buttons': $all_images_wrap.find( '.iconic-woothumbs-images-wrap > .iconic-woothumbs-wishlist-buttons' ),
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
				iconic_woothumbs.setup_fullscreen_open_triggers( product_object );
				iconic_woothumbs.setup_video_play_triggers( product_object );
				iconic_woothumbs.watch_yith_wishlist( product_object );

				if ( iconic_woothumbs.vars.is_stacked_layout ) {
					iconic_woothumbs.setup_stacked_layout( product_object );
				}
			} );

			iconic_woothumbs.setup_yith_wishlist();
			iconic_woothumbs.setup_tooltips();
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
			args.adaptiveHeight = true;
			args.autoplay = iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.carousel_general_autoplay );
			args.autoplaySpeed = parseInt( iconic_woothumbs_vars.settings.carousel_general_duration );
			args.dots = iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.navigation_bullets_enable );
			args.prevArrow = iconic_woothumbs.vars.is_rtl ? iconic_woothumbs.tpl.prev_arrow_rtl : iconic_woothumbs.tpl.prev_arrow;
			args.nextArrow = iconic_woothumbs.vars.is_rtl ? iconic_woothumbs.tpl.next_arrow_rtl : iconic_woothumbs.tpl.next_arrow;
			args.respondTo = 'slider';
			args.centerPadding = 0;
			args.touchThreshold = iconic_woothumbs_vars.settings.carousel_general_main_slider_swipe_threshold;
			args.lazyLoad = 'anticipated';
			args.centerMode = true;
			args.waitForAnimate = false;

			if ( iconic_woothumbs.vars.images_are_vertical ) {
				args.vertical = true;
			} else if ( iconic_woothumbs_vars.settings.carousel_general_mode === "fade" ) {
				args.fade = true;
			}

			if ( iconic_woothumbs.vars.images_are_vertical !== true ) {
				args.rtl = iconic_woothumbs.vars.is_rtl;
			}

			return wp.hooks.applyFilters( 'iconic_woothumbs_image_slider_args', args );
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
			args.lazyLoad = 'anticipated';
			args.waitForAnimate = false;

			if ( iconic_woothumbs.vars.thumbnails_are_vertical ) {
				args.vertical = true;
			}

			if ( iconic_woothumbs.is_below_breakpoint() && iconic_woothumbs.move_thumbnails_at_breakpoint() ) {
				args.vertical = false;
			}

			if ( ! iconic_woothumbs.vars.thumbnails_are_vertical || ( iconic_woothumbs.is_below_breakpoint() && iconic_woothumbs.move_thumbnails_at_breakpoint() ) ) {
				args.rtl = iconic_woothumbs.vars.is_rtl;
			}

			return wp.hooks.applyFilters( 'iconic_woothumbs_thumbnails_slider_args', args );
		},

		/**
		 * Toggle fullscreen control.
		 */
		toggle_fullscreen_control: function( $current_slide, product_object ) {
			var $current_image = $current_slide.find( 'img' ),
				$fullscreen_button = product_object.all_images_wrap.find( iconic_woothumbs.vars.fullscreen_trigger ).not( 'img' );

			if (
				( ! $current_slide.find( '.iconic-woothumbs-standard-embed' ).length && iconic_woothumbs.is_media( $current_slide ) ) ||
				iconic_woothumbs.is_placeholder( $current_image )
			) {
				$fullscreen_button.hide();
			} else {
				$fullscreen_button.show();
			}
		},

		/**
		 * Helper: Is palcehodler?
		 */
		is_placeholder: function( image, src_only ) {

			var src = src_only === true ? image : image.attr( 'src' );

			if ( src == null ) {
				return false;
			}

			return src.indexOf( "woocommerce-placeholder" ) >= 0;

		},

		/**
		 * Helper: Is media?
		 */
		is_media: function( $slide ) {
			var $media = $slide.find( 'iframe, video, object, .plyr' );
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
			return iconic_woothumbs.is_below_breakpoint() ? parseInt( iconic_woothumbs_vars.settings.mobile_general_thumbnails_count ) : parseInt( iconic_woothumbs_vars.settings.navigation_thumbnails_count );
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
				var $current_slide = product_object.images.find( '.slick-slide.slick-current' ),
					$current_image = $current_slide.find( 'img:first' ),
					variation_id = parseInt( $( product_object.variation_id_field ).val() ),
					currently_showing = parseInt( product_object.all_images_wrap.attr( 'data-showing' ) );

				iconic_woothumbs.maybe_show_gallery_ui( $current_slide, product_object );
				// Only go to the thumbnail if we are initialising without any variation state.
				if ( variation_id && ! isNaN( variation_id ) && variation_id !== currently_showing && variation_id > 0 ) {
					iconic_woothumbs.go_to_thumbnail( slick.currentSlide, product_object );
				}
				iconic_woothumbs.init_zoom( $current_image, product_object );
				iconic_woothumbs.update_caption( $current_image, product_object );
				iconic_woothumbs.reveal_slides( product_object );
				iconic_woothumbs.plyr_autoplay_current_instance( iconic_woothumbs.vars.plyr_gallery_type, product_object );

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
				iconic_woothumbs.plyr_pause_current_instance( iconic_woothumbs.vars.plyr_gallery_type, product_object );

				if ( product_object.imagezoom ) {
					product_object.imagezoom.destroy();
				}
			} );

			// On after slide change
			product_object.images.on( 'afterChange', function( event, slick, current_slide_index ) {
				var $current_slide = iconic_woothumbs.get_slide_by_index( product_object, current_slide_index ),
					$current_image = $current_slide.find( 'img:first' );

				clearTimeout( iconic_woothumbs.vars.thumbnail_hover_timer );

				iconic_woothumbs.maybe_show_gallery_ui( $current_slide, product_object );
				iconic_woothumbs.init_zoom( $current_image, product_object );
				iconic_woothumbs.update_caption( $current_image, product_object );

				if ( iconic_woothumbs.plyr_has_videos_of_type( iconic_woothumbs.vars.plyr_gallery_type,product_object ) ) {
					iconic_woothumbs.plyr_autoplay_current_instance( iconic_woothumbs.vars.plyr_gallery_type, product_object );
				}
			} );

			// setup stop auto
			product_object.all_images_wrap.on( 'click', ".iconic-woothumbs-thumbnails__slide, .iconic-woothumbs-images__arrow, .iconic-woothumbs-zoom-prev, .iconic-woothumbs-zoom-next, .slick-dots button", function() {
				product_object.images.slick( 'slickPause' );
			} );

			if ( iconic_woothumbs.vars.is_slider_layout ) {
				// Prevent dragging when Plyr controls are being interacted with.
				$( document ).on( 'mouseover', '.plyr__controls', function( event ) {
					product_object.images.slick( 'setOption', 'draggable', false, false );

				} );

				$( document ).on( 'mouseout', '.plyr__controls', function( event ) {
					product_object.images.slick( 'setOption', 'draggable', true, false );
				} );
			}
		},

		/**
		 * Add a class to show the gallery UI depending
		 * on whether then current slide contains media.
		 *
		 * @param $current_slide
		 * @param product_object
		 * @param show
		 */
		maybe_show_gallery_ui: function( $current_slide, product_object, show = false ) {
			if ( show || ! $current_slide.find( '.plyr' ).length ) {
				product_object.all_images_wrap.addClass( 'iconic-woothumbs-all-images-wrap--show-ui' );
			}
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
			if ( ! ( 'stacked' === iconic_woothumbs_vars.settings.navigation_thumbnails_type && iconic_woothumbs.vars.change_on_thumb_hover ) ) {
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
			}

			// setup click thumbnail control action
			product_object.all_images_wrap.on( 'click', ".iconic-woothumbs-thumbnails__control", function() {
				if ( ! product_object.all_images_wrap.hasClass( iconic_woothumbs.vars.loading_class ) ) {
					var dir = $( this ).attr( 'data-direction' );

					if ( dir === "next" ) {
						if ( iconic_woothumbs.vars.is_rtl ) {
							product_object.thumbnails.slick( 'slickPrev' );
						} else {
							product_object.thumbnails.slick( 'slickNext' );
						}

					} else {
						if ( iconic_woothumbs.vars.is_rtl ) {
							product_object.thumbnails.slick( 'slickNext' );
						} else {
							product_object.thumbnails.slick( 'slickPrev' );
						}
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
			setTimeout( function() {
				iconic_woothumbs.set_thumbnail_controls_visibility( product_object );
			}, 500 );
		},

		/**
		 * Handle keydown navigation for the slider.
		 *
		 * event.data contains the product_object data.
		 *
		 * @param event
		 */
		slider_keydown_handler: function(e) {
			if ( e.key === 'ArrowLeft' ) {
				e.data.images.slick( 'slickPrev' );
			}

			if ( e.key === 'ArrowRight' ) {
				e.data.images.slick( 'slickNext' );
			}
		},

		/**
		 * Init Images slider
		 *
		 * @param product_object
		 */
		init_images: function( product_object, current_slide_index = 0 ) {
			if ( ! iconic_woothumbs.vars.is_slider_layout || product_object.images.length <= 0 ) {
				return;
			}

			var $slider = product_object.images.not( '.slick-initialized' );

			iconic_woothumbs.maybe_resize_wrap( product_object );

			if ( iconic_woothumbs.plyr_has_videos_of_type(iconic_woothumbs.vars.plyr_gallery_type, product_object) ) {
				product_object.all_images_wrap.addClass('iconic-woothumbs--has-video');
				iconic_woothumbs.plyr_reset( iconic_woothumbs.vars.plyr_gallery_type, product_object );
			}

			if ( ! product_object.maintain_slide_index ) {
				current_slide_index = 0;
			}

			$slider.slick( iconic_woothumbs.images_slider_args( product_object, current_slide_index ) );

			// We must ensure that the previous handler has been removed
			// before adding it again, otherwise once a variation/attribute
			// takes place, multiple handlers will fire on keydown.
			$( document ).off( 'keydown', iconic_woothumbs.slider_keydown_handler );
			$( document ).on( 'keydown', product_object, iconic_woothumbs.slider_keydown_handler );

			product_object.images_slider_data = product_object.images.length > 0;

			/**
			 * Remove lazy styling once lazy loaded.
			 */
			$slider.on( 'lazyLoaded', function( event, slick, image, imageSource ) {
				$slider.slick( 'setPosition' );
				$( image ).css( 'height', '' ).css( 'padding', '' );
			} );
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

			if ( ! iconic_woothumbs.sliding_thumbnails_enabled() ) {
				iconic_woothumbs.images_loaded( product_object.thumbnails, function () {
					iconic_woothumbs.reveal_thumbnails( product_object );
					iconic_woothumbs.add_thumbnail_hover_events( product_object );
				} );

				return;
			}

			iconic_woothumbs.images_loaded( product_object.thumbnails, function () {
				product_object.thumbnails.not( '.slick-initialized' ).slick( iconic_woothumbs.thumbnails_slider_args( product_object ) );
				product_object.thumbnails_slider_data = product_object.thumbnails.length > 0;
				iconic_woothumbs.position_thumbnails( product_object );

				if ( ! iconic_woothumbs.sliding_thumbnails_enabled() ) {
					iconic_woothumbs.add_thumbnail_hover_events( product_object );
				}

				if ( typeof callback === 'function' ) {
					callback();
				}
			} );
		},

		/**
		 * Add thumbnail hover events
		 *
		 * @param product_object
		 */
		add_thumbnail_hover_events: function( product_object ) {
			if ( iconic_woothumbs.vars.change_on_thumb_hover ) {
				product_object.thumbnails.on( 'mouseenter', '.iconic-woothumbs-thumbnails__slide', function( e ) {
					clearTimeout( iconic_woothumbs.vars.thumbnail_hover_timer );

					var index = $( this ).data( 'index' );
					iconic_woothumbs.vars.thumbnail_hover_timer = setTimeout( function() {
						if ( index !== product_object.images.slick( 'slickCurrentSlide' ) ) {
							product_object.images.slick( 'slickGoTo', index );
						}
					}, 500 );
				});
			}
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
			return (iconic_woothumbs.get_thumbnail_count( product_object ) > 0) && (iconic_woothumbs_vars.settings.navigation_thumbnails_type === "sliding" || iconic_woothumbs_vars.settings.navigation_thumbnails_type === "stacked");
		},

		/**
		 * Helper: Are thumbnails enabled?
		 */
		thumbnails_enabled: function() {
			return iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.navigation_thumbnails_enable ) && iconic_woothumbs.vars.is_slider_layout;
		},

		/**
		 * Helper: Move thumbnails at breakpoint?
		 */

		move_thumbnails_at_breakpoint: function() {
			return iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.mobile_general_thumbnails_below ) && iconic_woothumbs_vars.settings.navigation_thumbnails_position !== "below";
		},

		/**
		 * Helper: Is the window width below our breakpoint limit
		 */

		is_below_breakpoint: function() {

			return iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.mobile_general_breakpoint_enable ) && iconic_woothumbs.viewport().width <= parseInt( iconic_woothumbs_vars.settings.mobile_general_breakpoint, 10 );

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

				$next_controls.removeClass( 'iconic-woothumbs-thumbnails__control--down' ).addClass( 'iconic-woothumbs-thumbnails__control--right' ).html( iconic_woothumbs.vars.icon_arrow_right );
				$prev_controls.removeClass( 'iconic-woothumbs-thumbnails__control--up' ).addClass( 'iconic-woothumbs-thumbnails__control--left' ).html( iconic_woothumbs.vars.icon_arrow_left);

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

					$next_controls.removeClass( 'iconic-woothumbs-thumbnails__control--right' ).addClass( 'iconic-woothumbs-thumbnails__control--down' ).html( iconic_woothumbs.vars.icon_arrow_down );
					$prev_controls.removeClass( 'iconic-woothumbs-thumbnails__control--left' ).addClass( 'iconic-woothumbs-thumbnails__control--up' ).html( iconic_woothumbs.vars.icon_arrow_up );

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
			var $slick_track = product_object.thumbnails.find( '.slick-track' );

			if ( ! $slick_track.length ) {
				return;
			}

			var track_position = null,
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
				thumbnail_settings_count = parseInt( iconic_woothumbs_vars.settings.navigation_thumbnails_count );

			// We need to use the responsive thumbnail count below the breakpoint.
			if ( iconic_woothumbs.is_below_breakpoint() ) {
				thumbnail_settings_count = parseInt( iconic_woothumbs_vars.settings.responsive_general_thumbnails_count );
			}

			return thumbnail_count - thumbnail_settings_count;
		},

		/**
		 * Watch for changes in variations
		 *
		 * @param product_object
		 */

		watch_variations: function( product_object ) {
			if ( ! product_object.variations_form ) {
				return;
			}

			product_object.variation_id_field.on( 'change', function() {
				var variation_id = parseInt( $( this ).val() ),
					selected_attribute_data = iconic_woothumbs.get_selected_attributes( product_object );

				if ( ! selected_attribute_data.count ) {
					product_object.all_images_wrap.addClass( 'iconic-woothumbs-reset-required' );
				}

				if ( ! isNaN( variation_id ) && variation_id > 0 ) {
					iconic_woothumbs.get_variation_data( product_object, variation_id );

					if ( iconic_woothumbs.vars.is_stacked_layout ) {
						iconic_woothumbs.init_stacked_zoom( product_object );
					}
				}
			} );

			product_object.variations_form.on( 'click', '.reset_variations', function(event) {
				product_object.all_images_wrap.removeClass( iconic_woothumbs.vars.reset_class );
			});

			// on reset data trigger
			product_object.variations_form.on( 'reset_data', function(event) {
				// 0 is the default value of the field on page load, we've already
				// loaded the gallery at this point.
				var selected_attribute_data = iconic_woothumbs.get_selected_attributes( product_object ),
					$attribute_selects = product_object.variations_form.filter(':visible').find('select[name^=attribute_]');

				if (
					product_object.all_images_wrap.hasClass( iconic_woothumbs.vars.reset_class ) &&
					! product_object.all_images_wrap.hasClass( 'iconic-woothumbs-reset-required' ) &&
					( ! selected_attribute_data.count || selected_attribute_data.count === $attribute_selects.length )
				) {
					return;
				}

				if (
					"0" === $( product_object.variation_id_field ).val() &&
					( ! selected_attribute_data.count || selected_attribute_data.count === $attribute_selects.length )
				) {
					return;
				}

				if (
					product_object.all_images_wrap.hasClass( 'iconic-woothumbs-reset-required' ) ||
					( selected_attribute_data.count && selected_attribute_data.count !== $attribute_selects.length )
				) {
					product_object.all_images_wrap.removeClass( iconic_woothumbs.vars.reset_class );
				}

				iconic_woothumbs.reset_images( product_object );

				product_object.all_images_wrap.removeClass( 'iconic-woothumbs-reset-required' );

				if ( iconic_woothumbs.vars.is_stacked_layout ) {
					iconic_woothumbs.init_stacked_zoom( product_object );
				}
			} );

			// on loading variation trigger
			product_object.all_images_wrap.on( iconic_woothumbs.vars.loading_variation_trigger, function( event ) {
				product_object.all_images_wrap.addClass( iconic_woothumbs.vars.loading_class );
			} );

			// on show variation trigger
			product_object.all_images_wrap.on( iconic_woothumbs.vars.show_variation_trigger, function( event, variation ) {
				iconic_woothumbs.load_images( product_object, variation );

				setTimeout( function() {
					if ( iconic_woothumbs.vars.is_stacked_layout ) {
						iconic_woothumbs.plyr_reset( iconic_woothumbs.vars.plyr_gallery_type, product_object );
						iconic_woothumbs.init_stacked_zoom( product_object );
					}
					product_object.all_images_wrap.removeClass( iconic_woothumbs.vars.loading_class );
				}, 100 );
			} );

			// Manually trigger the change to handle the default variations.
			var selected_attribute_data = iconic_woothumbs.get_selected_attributes( product_object ),
				$attribute_selects = product_object.variations_form.filter(':visible').find('select[name^=attribute_]');

			// Variations.
			if ( $( product_object.variation_id_field ).val() ) {
				$( product_object.variation_id_field ).trigger( 'change' );
			}

			// Attributes.
			if ( selected_attribute_data.count && selected_attribute_data.count !== $attribute_selects.length ) {
				product_object.variations_form.filter(':visible').trigger( 'change' );
			}
		},

		/**
		 * Get the default images, which may contain attribute images.
		 *
		 * @see reset_images
		 * @param product_object
		 */
		get_no_variation_images_data: function( product_object ) {
			var maintain_gallery_setting = parseInt( iconic_woothumbs_vars.settings.variations_settings_maintain_gallery ),
				selected_attributes_data = iconic_woothumbs.get_selected_attributes( product_object ),
				selected_attributes = selected_attributes_data.selected,
				term_data = ( 'undefined' !== typeof window.iconic_woothumbs_attributes_data ) ? window.iconic_woothumbs_attributes_data : {},
				attribute_images_data = [];

			// Return the original image data if we have no term data
			// or selected attributes.
			if ( ! Object.keys( term_data ).length || ! Object.keys( selected_attributes ).length ) {
				return product_object.default_images;
			}

			// Traverse the supplied data and build an array of the image objects
			// that have been assigned to each attribute value.
			var attributes_data = iconic_woothumbs.get_attribute_images_data( term_data, selected_attributes, attribute_images_data );
			attribute_images_data = [ ...attribute_images_data, ...attributes_data ];

			// Add default parent gallery images if the context allows it.
			if (
				product_object.default_images.length && maintain_gallery_setting === 1 ||
				( product_object.default_images.length && maintain_gallery_setting === 2 && ! attributes_data.length )
			) {
				attribute_images_data = [ ...attribute_images_data, ...product_object.default_images ];
			}

			// If we have a script tag in the media embed of the first
			// default image e.g. Product Configurator, ensure this is
			// always the first image displayed in the gallery.
			if (
				product_object.default_images.length &&
				( product_object.default_images[0].media_embed && -1 !== product_object.default_images[0].media_embed.indexOf( '<script' ) )
			) {
				attribute_images_data = [ product_object.default_images[0], ...attribute_images_data ];
			}

			if ( iconic_woothumbs.vars.dedupe_images ) {
				attribute_images_data = iconic_woothumbs.dedupe_images_data( attribute_images_data );
			}

			// If we have nothing, return the default images.
			if ( ! attribute_images_data.length && maintain_gallery_setting !== 0 ) {
				return product_object.default_images;
			}

			// End result is a collection of images
			// that will be structured in this order,
			// assuming the respective data is present:
			// - Attribute images
			// - Default parent gallery images
			return attribute_images_data;
		},

		/**
		 * Return attribute images based on available term data
		 * and selected attributes.
		 *
		 * @see get_no_variation_images_data
		 * @param term_data
		 * @param selected_attributes
		 */
		get_attribute_images_data: function( term_data, selected_attributes, attribute_images_data = false ) {
			var data = ( attribute_images_data ) ? attribute_images_data : [];

			// Traverse the supplied data and build an array of the image objects
			// that have been assigned to each attribute value.
			for ( var selected_attribute_key in selected_attributes ) {

				if ( Object.hasOwnProperty.call( selected_attributes, selected_attribute_key ) ) {

					if ( Object.hasOwnProperty.call( term_data, selected_attribute_key ) ) {
						var selected_term_data = term_data[ selected_attribute_key ];

						for ( var term_data_key in selected_term_data ) {

							if ( Object.hasOwnProperty.call( selected_term_data, term_data_key ) ) {
								var sanitized_term_data_key   = iconic_woothumbs.sanitize_string( term_data_key ),
									sanitized_attribute_value = iconic_woothumbs.sanitize_string( selected_attributes[ selected_attribute_key ] );
								
								if ( sanitized_term_data_key === sanitized_attribute_value ) {
									data = [ ...data, ...selected_term_data[ term_data_key ] ];
								}

								if ( term_data_key.toLowerCase() === 'any' ) {
									data = [ ...data, ...selected_term_data.Any ];
								}
							}
						}
					}
				}
			}

			// Add images assigned for all attributes.
			if ( Object.hasOwnProperty.call( term_data, 'all' ) ) {
				data = [ ...data, ...term_data.all.all ];
			}

			return data;
		},

		/**
		 * Sanitize a string; mimicks sanitize_title.
		 *
		 * @param title
		 */
		sanitize_string: function( string ) {
			if ( typeof string !== 'string' ) {
				return string;
			}
			
			var sanitized_string = string.normalize( 'NFD' ).replace(/[\u0300-\u036f]/g, '' ),
				sanitized_string = sanitized_string.toLowerCase().replace( /[^\w\s-]/g, '-' ),
				sanitized_string = sanitized_string.replace( /[\s_-]+/g, '-' ),
				sanitized_string = sanitized_string.replace( /^-+|-+$/g, '' );

			return sanitized_string;	
		},

		/**
		 * Get the variation images, which may contain attribute images.
		 *
		 * @see reset_images
		 * @param product_object
		 */
		 get_variation_images_data: function( product_object, variation_data ) {
			var maintain_gallery_setting = parseInt( iconic_woothumbs_vars.settings.variations_settings_maintain_gallery ),
				selected_attributes_data = iconic_woothumbs.get_selected_attributes( product_object ),
				selected_attributes = selected_attributes_data.selected,
				term_data = ( 'undefined' !== typeof window.iconic_woothumbs_attributes_data ) ? window.iconic_woothumbs_attributes_data : {},
				variation_images_data = [],
				default_image_urls    = [],
				revised_variation_images_data = [],
				parent_images_data = [];

			// Return the original image data if we have no selected attributes.
			if ( ! Object.keys( selected_attributes ).length ) {
				return variation_data;
			}

			// If we have a script tag in the media embed of the first
			// default image e.g. Product Configurator, ensure this is
			// always the first image displayed in the gallery.
			if (
				product_object.default_images.length &&
				( product_object.default_images[0].media_embed && -1 !== product_object.default_images[0].media_embed.indexOf( '<script' ) )
			) {
				variation_images_data = [ variation_data[0] ];
			}

			var attribute_images_data = [];
			
			if ( ( Object.keys( term_data ).length ) ) {
				attribute_images_data = iconic_woothumbs.get_attribute_images_data( term_data, selected_attributes );
			}

			// If we have variation image data, build a new array
			// of image data  that excludes those that relate to
			// the parent gallery. This leaves us with an array of
			// revised variation data that is actual variation
			if ( variation_data.length && product_object.default_images.length && maintain_gallery_setting === 1 ) {
				product_object.default_images.forEach( function( object ) {
					default_image_urls.push( object.url );
				} );

				variation_data.forEach( function( object, index ) {
					if ( Object.hasOwnProperty.call( object, 'url' ) ) {
						if ( ! default_image_urls.includes( object.url ) ) {
							revised_variation_images_data.push( object );
						} else {
							parent_images_data.push( object );
						}
					}
				} );
			} else {
				revised_variation_images_data = variation_data;
				parent_images_data = product_object.default_images;
			}

			// Add variation images; without default parent gallery images.
			if ( revised_variation_images_data.length ) {
				variation_images_data = [ ...variation_images_data, ...revised_variation_images_data ];
			}

			// Add attribute images.
			if ( attribute_images_data.length ) {
				variation_images_data = [ ...variation_images_data, ...attribute_images_data ];
			}

			// Add default parent gallery images if the context allows it.
			if (
				parent_images_data.length && maintain_gallery_setting === 1 ||
				( parent_images_data.length && maintain_gallery_setting === 2 && ! revised_variation_images_data.length )
			) {
				variation_images_data = [ ...variation_images_data, ...parent_images_data ];
			}

			// If deduplication has not been disabled using the filter,
			// remove duplicates; this means the earliest occurence of
			// a particular image will be preserved.
			if ( iconic_woothumbs.vars.dedupe_images ) {
				variation_images_data = iconic_woothumbs.dedupe_images_data( variation_images_data );
			}

			if ( ! variation_images_data.length && maintain_gallery_setting !== 0 ) {
				return product_object.default_images;
			}

			// End result is a collection of images
			// that will be structured in this order,
			// assuming the respective data is present:
			// - Variation images (minus parent gallery images)
			// - Attribute images
			// - Default parent gallery images
			return variation_images_data;
		},

		/**
		 * De-duplicate a supplied array of image objects,
		 * with the option to keep certain images regardless.
		 *
		 * @see get_variation_images_data
		 * @see get_no_variation_images_data
		 * @param images_data
		 * @param keep_images_data
		 */
		dedupe_images_data: function( images_data ) {
			var urls = [],
				deduped_images_data = [];
			images_data.forEach( function( image_object, images_data_index ) {
				if (
					Object.hasOwnProperty.call( image_object, 'url' ) &&
					( ! urls.includes( image_object.url ) )
				) {
					urls.push( image_object.url );
					deduped_images_data.push( image_object );
				}
			} );

			return deduped_images_data;
		},

		/**
		 * Get the currently selected variations form attributes
		 *
		 * @param product_object
		 */
		get_selected_attributes: function( product_object ) {
			var selected_attributes = {};

			if ( product_object.variations_form ) {
				product_object.variations_form.filter(':visible').find( 'option:selected' ).each( function( index, element ) {
					if ( $(element).val() ) {
						selected_attributes[ $(element).parent().attr('id') ] = $(element).val();
					}
				});
			}

			return {
				count: Object.keys(selected_attributes).length,
				selected: selected_attributes,
			};
		},

		/**
		 * Load Images for variation ID
		 *
		 * @param product_object
		 * @param variation
		 */
		load_images: function( product_object, variation ) {
			if ( typeof window.iconic_woothumbs_variations_data === 'undefined' ) {
				return;
			}

			var variation_data = window.iconic_woothumbs_variations_data[ variation.variation_id ];

			if ( variation && typeof variation_data !== 'undefined' ) {
				var image_count = variation_data.length;

				if ( image_count > 0 ) {
					product_object.all_images_wrap
						.attr( 'data-showing', variation.variation_id )
						.removeClass( iconic_woothumbs.vars.reset_class );

					// Replace the WooCommerce variation data with the data
					// that MAY have been modified with additional images etc.
					//
					// We're spreading the variation_data array here as we need
					// to break the reference to the original data, given that
					// it's going to be modified and returned.
					variation_data = iconic_woothumbs.get_variation_images_data( product_object, [ ...variation_data ] );

					// For the sake of the comparison, take the first image from the parent gallery images
					// array and add it to the data to compare, if we have parent gallery images enabled.
					var maintain_gallery_setting = parseInt( iconic_woothumbs_vars.settings.variations_settings_maintain_gallery ),
						compared_variation_data = ( maintain_gallery_setting === 1  ) ? [ product_object.default_images[0], ...variation_data ] : [ ...variation_data ];

					if ( variation_data && 
						variation_data.length && 
						! iconic_woothumbs.compare_variation_data( compared_variation_data, product_object.default_images ) && 
						! iconic_woothumbs.compare_variation_data( compared_variation_data, product_object.last_replace_images ) ) {
						product_object.last_replace_images = variation_data;
						iconic_woothumbs.replace_images( product_object, variation_data );
					} else {
						product_object.all_images_wrap.removeClass( iconic_woothumbs.vars.loading_class );
						iconic_woothumbs.reset_images( product_object );
					}
				} else {
					iconic_woothumbs.reset_images( product_object );
				}

				if ( iconic_woothumbs.vars.is_stacked_layout ) {
					iconic_woothumbs.init_stacked_zoom( product_object );
				}
			} else {
				product_object.all_images_wrap.removeClass( iconic_woothumbs.vars.loading_class );
			}
		},
		
		/**
		 * Compare two arrays of objects to see if they are identical.
		 * 
		 * @param arr1 
		 * @param arr2  
		 */
		compare_variation_data: function( arr1, arr2 ) {
			if ( ! arr1 || ! arr2 || arr1.length !== arr2.length ) {
				return false;
			}

			for ( let i = 0; i < arr1.length; i++ ) {
				const obj1 = arr1[i];
				const obj2 = arr2[i];

				if ( Object.keys( obj1 ).length !== Object.keys( obj2 ).length ) {
					return false;
				}

				// Check if the title and url properties of the object properties are the same
				for ( let prop in obj1 ) {
					if ( ( 'title' === prop || 'url' === prop ) && obj1[prop] !== obj2[prop] ) {
						return false;
					}
				}
			}

			// If we got here, the arrays are identical
			return true;
		},

		/**
		 * Replace slider images
		 *
		 * @param product_object
		 * @param images
		 * @param callback
		 */
		replace_images: function( product_object, images, callback ) {
			var current_slide_index = ( iconic_woothumbs.vars.is_slider_layout ) ? product_object.images.slick( 'slickCurrentSlide' ) : false;
			
			// The requested slide index may not exist, so default to zero if this is the case.
			current_slide_index = ( current_slide_index ) ? current_slide_index : 0;

			iconic_woothumbs.remove_temporary_images();

			var temp_images = iconic_woothumbs.create_temporary_images( images, product_object ),
				has_thumbnails = temp_images.thumbnails.length > 0;

			if ( product_object.images_slider_data ) {
				product_object.images.slick( 'unslick' );
				product_object.images.html( temp_images.images );
				iconic_woothumbs.init_images( product_object, current_slide_index );
			} else {
				product_object.images.hide().html( temp_images.images ).fadeIn();
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

				product_object.thumbnails.html( temp_images.thumbnails );

				if ( has_thumbnails && iconic_woothumbs.sliding_thumbnails_enabled() ) {
					iconic_woothumbs.init_thumbnails( product_object );
				} else {
					iconic_woothumbs.reveal_thumbnails( product_object );
				}

				// maintain slide index
				if ( iconic_woothumbs.vars.is_slider_layout && iconic_woothumbs.sliding_thumbnails_enabled() ) {
					var thumbnail_count = iconic_woothumbs.get_thumbnail_count( product_object );

					if ( thumbnail_count > current_slide_index && product_object.maintain_slide_index && typeof current_slide_index !== "undefined" ) {
						setTimeout( function() {
							iconic_woothumbs.go_to_thumbnail( current_slide_index, product_object );
						}, 100 );
					}

					// Update slide count attribute
					product_object.all_images_wrap.attr( 'data-slide-count', thumbnail_count );
				}
			}

			// A short delay is required to ensure that this is triggered
			// when the page reloads after making selections, defaults are
			// set, or query parameters are used.
			setTimeout( function() {
				product_object.all_images_wrap.trigger( 'iconic_woothumbs_images_loaded', [ product_object ] );
			}, 50 );

			// run a callback, if required
			if ( callback !== undefined ) {
				callback();
			}
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
			var image_count = images.length,
				temp_images = {
					'container': $( '.iconic-woothumbs-temp' ),
					'images': '',
					'thumbnails': ''
				};

			// loop through additional images
			$.each( images, function( index, image_data ) {
				var global_aspect_ratio = product_object.all_images_wrap.attr( 'data-global-aspect-ratio' ),
					slide_has_script = ( image_data.media_embed && -1 !== image_data.media_embed.indexOf( '<script' ) ),
					slide_aspect_ratio = (
						image_data.aspect &&
						( ! global_aspect_ratio || iconic_woothumbs.vars.images_are_vertical || ( image_data.media_embed && ! slide_has_script ) )
					) ? image_data.aspect : global_aspect_ratio,
					inline_aspect_ratio = ( ! slide_has_script && slide_aspect_ratio ) ? `aspect-ratio: ${slide_aspect_ratio.replace( ':', '/' )};` : '',
					slide_index_class = `${iconic_woothumbs.vars.slide_class}-${( index + 1 )}`;
					
				if ( image_data.media_embed ) {
					var media_slide_html = iconic_woothumbs.tpl.media_slide.replace( "{{media_embed}}", image_data.media_embed );
						media_slide_html = media_slide_html.replace( '{{index}}', index )
						.replace( '{{slide_aspect}}', inline_aspect_ratio )
						.replace( '{{slide_index_class}}', slide_index_class );

					// Clone the wishlist buttons, if they exist.
					if ( product_object.wishlist_buttons.length > 0 ) {
						media_slide_html = media_slide_html.replace( /<\/div>$/, product_object.wishlist_buttons.clone().prop( 'outerHTML' ) + '</div>' );
					}

					// Add the play button, if we have media.
					if ( product_object.play_button.length > 0 && 0 === index ) {
						media_slide_html = media_slide_html.replace( /<\/div>$/, `${iconic_woothumbs.tpl.play_button}</div>` );
					}

					// This replacement will never take place in addition to the
					// previous replacement for the same slide.
					if ( iconic_woothumbs.vars.is_stacked_layout && image_data.media_embed.includes( 'iconic-woothumbs-standard-embed' ) ) {
						media_slide_html = media_slide_html.replace( /<\/div>$/, `${iconic_woothumbs.tpl.fullscreen_button}</div>` );
					}

					temp_images.images += media_slide_html;
				} else {
					var image_data_mapped = $.extend(image_data, {
						'index': index,
						'image_lazy': image_data.src,
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
						'slide_aspect': inline_aspect_ratio,
						'slide_index_class': slide_index_class
					});

					// If the layout is stacked, we have to modify the HTML template to ensure
					// the play and fullscreen icons are included if needed.
					if ( iconic_woothumbs.vars.is_stacked_layout ) {
						iconic_woothumbs.tpl.stacked_image_slide = `<div class="${iconic_woothumbs.vars.slide_class} {{slide_index_class}}" data-index="{{index}}"><img style="{{slide_aspect}}" class="iconic-woothumbs-images__image" src="{{image_lazy}}" srcset="{{image_srcset}}" sizes="{{image_sizes}}" data-caption="{{image_caption}}" data-large_image="{{large_image_src}}" data-large_image_width="{{large_image_width}}" data-large_image_height="{{large_image_height}}" width="{{image_width}}" height="{{image_height}}" title="{{title}}" alt="{{alt}}" loading="lazy">`;

						// Clone the wishlist buttons, if they exist.
						if ( product_object.wishlist_buttons.length > 0 ) {
							iconic_woothumbs.tpl.stacked_image_slide += product_object.wishlist_buttons.clone().prop( 'outerHTML' );
						}

						if ( product_object.play_button.length > 0 && 0 === index ) {
							iconic_woothumbs.tpl.stacked_image_slide += iconic_woothumbs.tpl.play_button;
						}

						if ( iconic_woothumbs.vars.is_fullscreen_enabled ) {
							iconic_woothumbs.tpl.stacked_image_slide += iconic_woothumbs.tpl.fullscreen_button;
						}

						iconic_woothumbs.tpl.stacked_image_slide += '</div>';
					}

					var image_template = iconic_woothumbs.vars.is_slider_layout ? iconic_woothumbs.tpl.gallery_image_slide :iconic_woothumbs.tpl.stacked_image_slide;

					temp_images.images += Object.keys(image_data_mapped).reduce(function (str, key) {
						return str.replace('{{' + key + '}}', iconic_woothumbs.maybe_empty(image_data_mapped[key]));
						}, image_template);
				}

				// add thumbnails to temp div if thumbnails are enabled
				if ( image_count > 1 && iconic_woothumbs.thumbnails_enabled() ) {
					var placeholder_image = ( iconic_woothumbs.is_placeholder( image_data.src, true ) ) ? image_data.src : iconic_woothumbs.vars.placeholder_img,
						play_icon = image_data.media_embed && image_data.no_media_icon !== true ? iconic_woothumbs.tpl.thumbnail_play_icon : '',
						image_src = ( iconic_woothumbs.sliding_thumbnails_enabled() ) ? placeholder_image : image_data.gallery_thumbnail_src,
						lazy_type = ( ! iconic_woothumbs.sliding_thumbnails_enabled() ) ? 'lazy' : '',
						lazy_classes = ( iconic_woothumbs.sliding_thumbnails_enabled() ) ? 'no-lazyload skip-lazy' : '',
						global_thumbs_aspect_ratio = product_object.all_images_wrap.attr( 'data-global-thumbs-aspect-ratio' ),
						thumbnail_aspect_ratio = ( image_data.aspect && iconic_woothumbs.vars.images_are_vertical ) ? image_data.aspect : global_thumbs_aspect_ratio,
						inline_thumb_aspect_ratio = ( thumbnail_aspect_ratio ) ? `aspect-ratio: ${thumbnail_aspect_ratio.replace( ':', '/' )};` : '';

					var thumbnail_html =
						iconic_woothumbs.tpl.thumbnail_slide
							.replace( "{{lazy_type}}", lazy_type )
							.replace( "{{lazy_classes}}", lazy_classes )
							.replace( "{{play_icon}}", play_icon )
							.replace( "{{maybe_image_src}}", image_src)
							.replace( "{{image_src}}", image_data.gallery_thumbnail_src )
							.replace( "{{image_srcset}}", iconic_woothumbs.maybe_empty( image_data.gallery_thumbnail_srcset ) )
							.replace( "{{image_sizes}}", iconic_woothumbs.maybe_empty( image_data.gallery_thumbnail_sizes ) )
							.replace( "{{index}}", index )
							.replace( "{{image_width}}", iconic_woothumbs.maybe_empty( image_data.gallery_thumbnail_src_w ) )
							.replace( "{{image_height}}", iconic_woothumbs.maybe_empty( image_data.gallery_thumbnail_src_h ) )
							.replace( "{{alt}}", image_data.alt )
							.replace( "{{title}}", image_data.title )
							.replace( "{{slide_class}}", index === 0 ? iconic_woothumbs.vars.thumbnails_active_class : "" )
							.replace( '{{slide_aspect}}', inline_thumb_aspect_ratio );


					temp_images.thumbnails += thumbnail_html;
				}
			} );

			// pad out the thumbnails if there is less than the
			// amount that are meant to be displayed.
			if ( product_object.thumbnails_slider_data && image_count !== 1 && image_count < iconic_woothumbs_vars.settings.navigation_thumbnails_count ) {
				var empty_count = iconic_woothumbs_vars.settings.navigation_thumbnails_count - image_count;
				var i = 0;

				while ( i < empty_count ) {
					temp_images.thumbnails += '<div></div>';
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

			return ( value || value === 0 ) ? value : "";

		},

		/**
		 * Reset Images to defaults
		 *
		 * @param product_object
		 */
		reset_images: function( product_object ) {
			if (
				product_object.all_images_wrap.hasClass( iconic_woothumbs.vars.reset_class ) ||
				product_object.all_images_wrap.hasClass( iconic_woothumbs.vars.loading_class )
			) {
				return;
			}

			product_object.all_images_wrap.trigger( iconic_woothumbs.vars.loading_variation_trigger );
			product_object.all_images_wrap.attr( 'data-showing', product_object.product_id );

			// set reset class
			product_object.all_images_wrap.addClass( iconic_woothumbs.vars.reset_class );

			// replace images
			var replace_images = iconic_woothumbs.get_no_variation_images_data( product_object );

			if (
				replace_images.length &&
				(
					( ! product_object.last_replace_images && ! iconic_woothumbs.compare_variation_data( product_object.default_images, replace_images ) ) ||
					( product_object.last_replace_images && ! iconic_woothumbs.compare_variation_data( product_object.last_replace_images, replace_images ) )
				)
			) {
				iconic_woothumbs.replace_images( product_object, replace_images );
				product_object.last_replace_images = replace_images;

				setTimeout( function() {
					if ( iconic_woothumbs.vars.is_stacked_layout ) {
						iconic_woothumbs.plyr_reset( iconic_woothumbs.vars.plyr_gallery_type, product_object );
						iconic_woothumbs.init_stacked_zoom( product_object );
					}

					product_object.all_images_wrap.removeClass( iconic_woothumbs.vars.loading_class );
				}, 100 );
			} else {
				product_object.all_images_wrap.removeClass( iconic_woothumbs.vars.loading_class );
			}
		},

		/**
		 * Helper: Check if final variation has been selected
		 *
		 * @param product_object
		 */
		found_variation: function( product_object ) {
			var variation_id = parseInt( $( product_object.variation_id_field ).val() );

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

			if ( product_object.variations ) {

				// variation data available
				$.each( product_object.variations, function( index, variation ) {

					if ( variation.variation_id === variation_id ) {
						variation_data = variation;
					}
				} );

				product_object.all_images_wrap.trigger( iconic_woothumbs.vars.show_variation_trigger, [ variation_data ] );
			} else {
				// variation data not available, look it up via ajax
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
		 * @param product_object
		 * @param $clicked_element
		 * @param last_slide
		 * @param parent_slide
		 */
		trigger_photoswipe: function( product_object, $clicked_element, last_slide, parent_slide ) {
			// build items array
			var items = iconic_woothumbs.get_gallery_items( product_object ),
				index = typeof items.index !== 'undefined' ? items.index : 0;

			if (
				iconic_woothumbs.vars.is_stacked_layout ||
				$clicked_element.hasClass( 'iconic-woothumbs-images__image' ) ||
				$clicked_element.hasClass( 'plyr__control' )
			) {
				var $clicked_element_parent = $clicked_element.closest( `.${iconic_woothumbs.vars.slide_class}` );

				if ( typeof parent_slide !== 'undefined' && parent_slide ) {
					$clicked_element_parent = parent_slide;
				}

				index = ( $clicked_element_parent.data( 'slick-index' ) ) ? $clicked_element_parent.data( 'slick-index' ) : $clicked_element_parent.data( 'index' );
			}

			var maybe_use_index = ( iconic_woothumbs.vars.is_stacked_layout || ( typeof last_slide === "undefined" || ! last_slide ) ),
				animationDuration = 100,
				options = {
					mainClass: 'iconic-woothumbs-pswp',
					dataSource: items.items,
					index: ( maybe_use_index && true !== last_slide ) ? index : items.items.length - 1,
					showHideAnimationType: 'fade',
					showAnimationDuration: animationDuration,
					hideAnimationDuration: animationDuration,
					bgOpacity: 1,
					arrowPrevSVG: iconic_woothumbs.vars.icon_pswp_arrow_left,
					arrowNextSVG: iconic_woothumbs.vars.icon_pswp_arrow_right,
					closeSVG: iconic_woothumbs.vars.icon_pswp_close,
					zoomSVG: iconic_woothumbs.vars.icon_pswp_zoom,
					paddingFn: (viewportSize, itemData, index) => {
						var padding_x = viewportSize.x < 600 ? 0 : 60,
							padding_y = 60;

						return {
							top: padding_y,
							bottom: padding_y,
							left: padding_x,
							right: padding_x
						};
					}
				};

			window.iconic_woothumbs_photoswipe = new PhotoSwipe( options );

			// Destroy the non-fullscreen gallery once the modal is open.
			window.iconic_woothumbs_photoswipe.on( 'openingAnimationEnd', function( e ) {
				iconic_woothumbs.plyr_destroy( iconic_woothumbs.vars.plyr_gallery_type );
			});

			// Ensure that Plyr's seek and range controls do not trigger
			// the pointerDown event handler used for swiping/dragging.
			window.iconic_woothumbs_photoswipe.on( 'pointerDown', function( e ) {
				var $plyr_controls = $( e.originalEvent.target ).closest( '.plyr__controls' );

				if ( $plyr_controls.length ) {
					e.preventDefault();
				}
			});

			// Pause media on slide change.
			window.iconic_woothumbs_photoswipe.on( 'contentRemove', function( e ) {
				iconic_woothumbs.plyr_pause_current_instance( iconic_woothumbs.vars.plyr_fullscreen_type, product_object );
			});

			// Initialise Plyr once the slide has received the DOM update.
			window.iconic_woothumbs_photoswipe.on( 'contentActivate', function( data ) {
				// A short delay is required before we can query the DOM
				// in other methods, such as plyr_setup etc.
				setTimeout( function() {
					var has_plyr = $( data.content.element ).find( '.plyr' );

					if ( has_plyr.length ) {
						$( data.content.element ).find( '.iconic-woothumbs-loading-overlay' ).hide();
					} else {
						$( data.content.element ).find( '.iconic-woothumbs-loading-overlay' ).show();
					}

					if ( data.content.slide.isActive && ! has_plyr.length ) {
						iconic_woothumbs.plyr_setup( iconic_woothumbs.vars.plyr_fullscreen_type, product_object );
					}
				}, 250 );
			});

			// Reset Plyr and/or remove classes on close.
			window.iconic_woothumbs_photoswipe.on( 'close', function() {
				if ( iconic_woothumbs.plyr_get_gallery_videos( product_object.images_wrap ) ) {
					iconic_woothumbs.plyr_reset( iconic_woothumbs.vars.plyr_fullscreen_type,  product_object, iconic_woothumbs.vars.plyr_gallery_type );
				}
			});

			// Register UI elements.
			window.iconic_woothumbs_photoswipe.on( 'uiRegister', function() {
				// Add caption if image title is enabled in WooThumbs' fullscreen settings.
				if ( iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.fullscreen_general_image_title ) ) {
					window.iconic_woothumbs_photoswipe.ui.registerElement( {
						name: 'caption',
						order: 9,
						isButton: false,
						appendTo: 'root',
						html: '',
						onInit: ( el, pswp ) => {
							pswp.on( 'change', () => {
								var current_slide = pswp.currSlide.data;

								if ( current_slide.caption && typeof current_slide.caption !== 'undefined' ) {
									el.innerHTML = pswp.currSlide.data.caption;
								} else if ( current_slide.title && current_slide.title !== 'undefined' ) {
									el.innerHTML = current_slide.title;
								} else {
									el.innerHTML = '';
								}
							} );
						}
					} );
				}
			} );

			window.iconic_woothumbs_photoswipe.init();
		},

		/**
		 * Setup fullscreen
		 *
		 * @param product_object
		 */
		setup_fullscreen_open_triggers: function( product_object ) {
			if ( !iconic_woothumbs.vars.is_fullscreen_enabled ) {
				return;
			}

			product_object.images_wrap.on( 'click', iconic_woothumbs.vars.fullscreen_trigger, function() {
				iconic_woothumbs.plyr_destroy( iconic_woothumbs.vars.plyr_gallery_type )
				.then( ( value ) => {
					iconic_woothumbs.trigger_photoswipe( product_object, $( this ) );
				} );
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
		 * Setup video player triggers
		 */
		setup_video_play_triggers: function( product_object ) {
			product_object.images_wrap.on( 'click touchstart', iconic_woothumbs.vars.play_trigger, function() {
				iconic_woothumbs.plyr_destroy(iconic_woothumbs.vars.plyr_gallery_type)
				.then( ( value ) => {
					iconic_woothumbs.trigger_photoswipe( product_object, $( this ), true );
				})
				.then( ( value ) => {
					iconic_woothumbs.plyr_autoplay_current_instance( iconic_woothumbs.vars.plyr_fullscreen_type, product_object );
				});
			} );
		},

		/**
		 * Setup anything required for Stacked layout.
		 */
		setup_stacked_layout: function( product_object ) {

			// Initialise Plyr if we are not loading a pre-selected
			// attribute or variation combination; either via form
			// selections or query strings in the URL.
			var selected_attribute_data = iconic_woothumbs.get_selected_attributes( product_object );

			if (
				iconic_woothumbs.plyr_has_videos_of_type( iconic_woothumbs.vars.plyr_gallery_type, product_object ) &&
				! parseInt( $( product_object.variation_id_field ).val() ) &&
				! selected_attribute_data.count
			) {
				iconic_woothumbs.plyr_setup( iconic_woothumbs.vars.plyr_gallery_type, product_object );
			}
		},

		/**
		 * Get Gallery Items
		 *
		 * @param product_object
		 * @return obj index and items
		 */

		get_gallery_items: function( product_object ) {
			var $slides = product_object.images.find( `.${iconic_woothumbs.vars.slide_class}` ),
				items = [],
				index = product_object.images_slider_data ? product_object.images.slick( 'slickCurrentSlide' ) : false;

			if ( iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.fullscreen_general_enable ) ) {
				if ( $slides.length > 0 ) {
					$slides.each( function( i, slide ) {
						var $slide = $( slide );

						if ( $slide.closest( '.slick-cloned' ).length > 0 ) {
							return;
						}

						if ( iconic_woothumbs.is_media( $slide ) ) {
							var media_html = iconic_woothumbs.tpl.media.replace( "{{media_embed}}", $slide.html() );
							var orientation = $slide.find('.iconic-woothumbs-responsive-media').data('orientation');

							if ( orientation === 'tall' ) {
								media_html = media_html.replace( '--wide', '--tall' );
							}

							if ( orientation === 'square' ) {
								media_html = media_html.replace( '--wide', '--square' );
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

						var item = {
								src: img.attr( 'data-large_image' ),
								width: img.attr( 'data-large_image_width' ),
								height: img.attr( 'data-large_image_height' ),
								caption: img.attr( 'data-caption' ),
								alt: img.attr( 'alt' )
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

			if ( iconic_woothumbs.vars.is_stacked_layout ) {
				iconic_woothumbs.init_stacked_zoom( product_object );
			}

			iconic_woothumbs.vars.zoom_setup = true;
		},

		/**
		 * Init Hover Zoom for Stacked images.
		 *
		 * @param product_object
		 */
		init_stacked_zoom: function( product_object ) {
			var $stacked_images = product_object.images.find( `.${iconic_woothumbs.vars.slide_class} .iconic-woothumbs-images__image` );

			$stacked_images.on( 'mouseenter', function(e) {
				iconic_woothumbs.init_zoom( $(e.target), product_object );
			});
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

			var $parent_slide = $image.closest( `.${iconic_woothumbs.vars.slide_class}` ),
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
					iconic_woothumbs.add_zoom_controls( product_object, $parent_slide );

					if ( iconic_woothumbs.vars.is_slider_layout ) {
						product_object.images.slick( 'slickPause' );
					}
				},
				onHide: function() {
					if (
						iconic_woothumbs.vars.is_slider_layout &&
						iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.carousel_general_autoplay )
						) {
						product_object.images.slick( 'slickPlay' );
					}
				}
			} );

			product_object.imagezoom = $parent_slide.data( 'imagezoom' );
		},

		/**
		 * Add Zoom Controls
		 *
		 * @param product_object
		 * @param parent_slide
		 */

		add_zoom_controls: function( product_object, parent_slide ) {

			var $viewer = product_object.imagezoom.$viewer;

			if ( $viewer.find( '.iconic-woothumbs-zoom-controls' ).length <= 0 && iconic_woothumbs_vars.settings.zoom_general_zoom_type === "inner" ) {

				if ( iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.display_general_icons_tooltips ) ) {
					$viewer.addClass( 'iconic-woothumbs-tooltips-enabled' );
				}

				if ( product_object.all_images_wrap.hasClass( 'iconic-woothumbs-all-images-wrap--has-product-media' ) ) {
					$viewer.addClass( 'iconic-woothumbs-has-product-media' );
				}

				$viewer.append( '<div class="iconic-woothumbs-zoom-controls"></div>' );

				var $zoom_controls = $viewer.find( '.iconic-woothumbs-zoom-controls' );

				// Wishlists.
				if (
					( iconic_woothumbs.vars.is_slider_layout || ( iconic_woothumbs.vars.is_stacked_layout && $( parent_slide ).attr( 'data-index' ) === '0' ) ) &&
					product_object.wishlist_buttons.length > 0
				) {
					$zoom_controls.append( product_object.wishlist_buttons.clone() );
				}

				// Product video.
				if (
					product_object.play_button.length > 0 &&
					( ! iconic_woothumbs.vars.is_stacked_layout || ( iconic_woothumbs.vars.is_stacked_layout && 0 === parent_slide.data('index') ) )
					) {
					$zoom_controls.append( iconic_woothumbs.tpl.play_button );

					$viewer.on( 'click', iconic_woothumbs.vars.play_trigger, function() {
						if ( iconic_woothumbs.plyr_has_videos_of_type( iconic_woothumbs.vars.plyr_gallery_type, product_object ) ) {
							iconic_woothumbs.plyr_destroy(iconic_woothumbs.vars.plyr_gallery_type)
							.then( (value) => {
								iconic_woothumbs.trigger_photoswipe( product_object, $( this ), true );
							})
							.then( (value ) => {
								iconic_woothumbs.plyr_autoplay_current_instance( iconic_woothumbs.vars.plyr_fullscreen_type, product_object );
							});
						} else {
							iconic_woothumbs.trigger_photoswipe( product_object, $( this ), true );
						}
					} );
				}

				// Fullscreen.
				if ( iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.fullscreen_general_enable ) ) {
					$zoom_controls.append( iconic_woothumbs.tpl.fullscreen_button );

					$viewer.on( 'click', iconic_woothumbs.vars.fullscreen_trigger, function() {
						iconic_woothumbs.plyr_destroy(iconic_woothumbs.vars.plyr_gallery_type)
						.then( (value) => {
							iconic_woothumbs.trigger_photoswipe( product_object, $( this ), false, parent_slide );
						});
					} );
				}

				// Navigation arrows.
				if ( iconic_woothumbs.is_true( iconic_woothumbs_vars.settings.navigation_general_controls ) && iconic_woothumbs.get_thumbnail_count( product_object ) > 1 ) {

					if ( ! product_object.images_wrap.find( '.iconic-woothumbs-images__arrow--prev' ).hasClass( 'slick-disabled' ) ) {
						$zoom_controls.append( `<a class="iconic-woothumbs-zoom-prev" href="javascript: void(0);">${iconic_woothumbs.vars.icon_arrow_left}</a>` );
					}

					if ( ! product_object.images_wrap.find( '.iconic-woothumbs-images__arrow--next' ).hasClass( 'slick-disabled' ) ) {
						$zoom_controls.append( `<a class="iconic-woothumbs-zoom-next" href="javascript: void(0);">${iconic_woothumbs.vars.icon_arrow_right}</a>` );
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

				// Bullets.
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
						debug: false,
						delay: 100,
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
		 * Reveal slides.
		 */
		reveal_slides: function( product_object ) {
			product_object.images.find( `.${iconic_woothumbs.vars.slide_class}` ).show();
			product_object.all_images_wrap.removeClass( iconic_woothumbs.vars.loading_class );
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
		 * Initialize Plyr instances for all videos
		 * passed into the method.
		 *
		 * @param type
		 * @param product_object
		 */
		plyr_setup: function( type, product_object ) {
			var $videos = false;

			// Empty our instance collections.
			window.iconic_woothumbs_plyr.fullscreen = [];
			window.iconic_woothumbs_plyr.gallery = [];

			if ( iconic_woothumbs.vars.plyr_gallery_type === type ) {
				$videos = iconic_woothumbs.plyr_get_gallery_videos( product_object.images_wrap );
			} else if ( iconic_woothumbs.vars.plyr_fullscreen_type === type ) {
				$videos = iconic_woothumbs.plyr_get_photoswipe_videos();
			}

			if ( ! $videos || 0 === $videos.length ) {
				return;
			}

			$videos.each(function(index) {
				var parent_slide      = $ (this ).closest( `.${iconic_woothumbs.vars.slide_class}` ),
					poster_gallery    = $( this ).attr( 'data-poster-gallery' ),
					poster_fullscreen = $( this ).attr( 'data-poster-fullscreen' ),
					global_aspect     = product_object.all_images_wrap.attr( 'data-global-aspect-ratio' ),
					aspect            = $( this ).attr( 'data-aspect-ratio' ),
					// Slick does not support variable height slides in vertical mode,
					// so we have to force one specific aspect for all videos.
					aspect_ratio      = ( iconic_woothumbs.vars.images_are_vertical ) ? global_aspect : aspect,
					controls          = ( iconic_woothumbs.vars.plyr_controls ) ? iconic_woothumbs.vars.plyr_controls_list : [],
					config            = {
						'ratio': aspect_ratio,
						'loop': { 'active': iconic_woothumbs.vars.plyr_loop },
						'controls': controls,
						'clickToPlay': false,
						'tooltips': {
							'controls': iconic_woothumbs.vars.plyr_tooltips,
							'seek': iconic_woothumbs.vars.plyr_tooltips
						},
						'youtube': {
							'showinfo': 0,
							'rel': 0,
							'iv_load_policy': 3,
							'modestbranding': 1,
							'playsinline': 1,
						},
						'vimeo': {
							'byline': 0,
							'title': 0,
							'portrait': 0,
						},
						iconUrl: iconic_woothumbs_vars.plyr_sprite_url
					};

				// Preload the poster images.
				var preload = new Image();
				preload.src = poster_gallery;

				// Remove the fullscreen control if fullscreen is disabled.
				if ( 'fullscreen' === type || ! iconic_woothumbs.vars.is_fullscreen_enabled ) {
					config.controls = config.controls.filter( function( value, index, arr ) {
						return value !== 'fullscreen';
					});
				}

				// Add `gallery` context specific listeners.
				if ( iconic_woothumbs.vars.plyr_gallery_type === type ) {
					config.listeners = {
						'fullscreen': function( e ) {
							if ( iconic_woothumbs.vars.plyr_fullscreen_type === type ) {
								return true;
							}

							e.preventDefault();

							iconic_woothumbs.plyr_destroy( iconic_woothumbs.vars.plyr_gallery_type )
							.then( ( value ) => {
								iconic_woothumbs.trigger_photoswipe( product_object, $( $videos [index ] ), false, parent_slide );
							} );

							return false;
						}
					};
				}

				// Add `fullscreen` context specific listeners.
				if ( iconic_woothumbs.vars.plyr_fullscreen_type === type ) {
					config.listeners = {};
				}

				var player = new Plyr( $( this ), config );
				window.iconic_woothumbs_plyr[ type ].push( player );

				// Set the poster image.
				if ( iconic_woothumbs.vars.plyr_poster ) {
					var poster_image = ( 'gallery' === type ) ? poster_gallery : poster_fullscreen;
					player.poster = poster_image;
				}

				// Pause all other videos except the one playing;
				// this is better than stopping as the UI reflects
				// that the video can be played again, and looks
				// less buggy than the UI when stopped.
				player.on( 'playing', ( event ) => {
					$( event.target ).closest( '.iconic-woothumbs-all-images-wrap' ).addClass( iconic_woothumbs.vars.media_playing_class );
					iconic_woothumbs.plyr_pause( type, event.detail.plyr );
				} );

				player.on( 'pause', ( event ) => {
					setTimeout( function() {
						$( event.target ).closest( '.iconic-woothumbs-all-images-wrap' ).removeClass( iconic_woothumbs.vars.media_playing_class );
					}, 300 );
				});

				player.on( 'ended', ( event ) => {
					setTimeout( function() {
						$( event.target ).closest( '.iconic-woothumbs-all-images-wrap' ).removeClass( iconic_woothumbs.vars.media_playing_class );
					}, 300 );
				});

				player.on( 'ready', ( event ) => {
					iconic_woothumbs.plyr_ready_tasks( type, event, product_object );
				} );
			} );
		},

		/**
		 * Fire logic when Plyr instances have been setup.
		 *
		 * @param type
		 * @param event
		 * @param product_object
		 */
		 plyr_ready_tasks: function( type, event, product_object ) {
			// Slick specific logic.
			if ( product_object.images.hasClass( 'slick-initialized' ) ) {
				// Just to be safe, force Slick to re-calculate position.
				product_object.images.slick('setPosition');

				// Show the gallery UI when the first/current slide loads.
				var plyr_ready_slide_index = $( event.target ).closest( `.${iconic_woothumbs.vars.slide_class}` ).attr( 'data-index' );

				if ( parseInt( plyr_ready_slide_index ) === product_object.images.slick( 'slickCurrentSlide' ) ) {
					var $current_slide = product_object.images.find( '.slick-slide.slick-current' );
					iconic_woothumbs.maybe_show_gallery_ui( $current_slide, product_object, true );
				}
			}

			if ( 'gallery' === type ) {
				$( event.target ).closest( `.${iconic_woothumbs.vars.slide_class}` ).addClass( 'iconic-woothumbs-plyr-ready' );
			} else {
				$( event.target ).closest( '.iconic-woothumbs-fullscreen-video-wrapper' ).addClass( 'iconic-woothumbs-plyr-ready' );
			}

			setTimeout( function() {
				if ( 'gallery' === type ) {
					$( event.target ).closest( `.${iconic_woothumbs.vars.slide_class}` ).find( '.iconic-woothumbs-loading-overlay' ).hide();
				} else {
					$( event.target ).closest( '.iconic-woothumbs-fullscreen-video-wrapper' ).find( '.iconic-woothumbs-loading-overlay' ).hide();
				}

				// Maybe play the instance.
				iconic_woothumbs.plyr_autoplay_current_instance( type, product_object );
			}, 500 );
		},

		/**
		 * Destroy all current Plyr instances in either the
		 * `gallery` or `fullscreen` contexts.
		 *
		 * Due to the fact that the `destroy()` method executes
		 * an async callback when the operation has completed,
		 * we have to leverage a Promise here to ensure that
		 * whatever we execute immediately after `destroy()` can
		 * be done in the knowledge that all of the instances
		 * have been properly destroyed.
		 *
		 * @param type
		 */
		  plyr_destroy: function( type ) {
			return new Promise( function( resolve, reject ) {
				if ( ! window.iconic_woothumbs_plyr || ! type || ! window.iconic_woothumbs_plyr[ type ].length ) {
					resolve();
				}

				var destroy_counter = 0;

				// Note: the plyr instance gets deleted from the
				// window.iconic_woothumbs_plyr[type] array in the
				// `plyr_setup` method.
				function maybe_resolve() {
					destroy_counter++;

					if ( destroy_counter === window.iconic_woothumbs_plyr[ type ].length ) {
						resolve();
					}
				}

				window.iconic_woothumbs_plyr[ type ].forEach( function( plyr_instance, index ) {
					plyr_instance.destroy( maybe_resolve );
				});
			});
		},

		/**
		 * Destroy and Re-init Plyr instances in either the
		 * `gallery` or `fullscreen` contexts.
		 *
		 * @param plyr_reset
		 */
		plyr_reset: function( type, product_object, new_type = false ) {
			if ( ! type || ! product_object ) {
				return;
			}

			var setup_type = ( new_type ) ? new_type : type;
			iconic_woothumbs.plyr_destroy( type )
			.then( iconic_woothumbs.plyr_setup( setup_type, product_object ) );
		},

		/**
		 * Pause Plyr instances in either the
		 * `gallery` or `fullscreen` contexts.
		 *
		 * @param type
		 * @param playing_instance
		 */
		plyr_pause: function( type, playing_instance ) {
			if ( ! window.iconic_woothumbs_plyr || ! window.iconic_woothumbs_plyr[ type ].length || ! type || ! playing_instance ) {
				return false;
			}

			window.iconic_woothumbs_plyr[ type ].forEach( function( plyr_instance, index ) {
				if ( playing_instance !== plyr_instance ) {
					plyr_instance.pause();
				}
			} );

			return true;
		},

		/**
		 * Check to see if we have videos in either a
		 * `gallery` or `fullscreen` context.
		 *
		 * @param type
		 * @param product_object
		 */
		plyr_has_videos_of_type: function( type, product_object ) {
			if ( ! type || ! product_object ) {
				return false;
			}

			if ( iconic_woothumbs.vars.plyr_gallery_type === type ) {
				var gallery_videos = iconic_woothumbs.plyr_get_gallery_videos( product_object.images_wrap );
				return ( gallery_videos && gallery_videos.length );
			} else if ( iconic_woothumbs.vars.plyr_fullscreen_type === type ) {
				var photoswipe_videos = iconic_woothumbs.plyr_get_photoswipe_videos();
				return ( photoswipe_videos && photoswipe_videos.length ) ;
			} else {
				return false;
			}
		},

		/**
		 * Get a video from a WooThumbs slide.
		 *
		 * @param container
		 */
		 plyr_get_gallery_videos: function( container ) {
			if ( ! container ) {
				return false;
			}

			var $video = $( container ).find( iconic_woothumbs.vars.plyr_video_selector );

			return ( $video.length ) ? $video : false;
		},

		/**
		 * Get a video from the current PhotoSwipe item.
		 */
		 plyr_get_photoswipe_videos: function() {
			var $container = $( window.iconic_woothumbs_photoswipe.currSlide.holderElement );

			if ( ! $container.length ) {
				return false;
			}

			var $videos = $container.find( iconic_woothumbs.vars.plyr_video_selector );

			return ( $videos.length ) ? $videos : false;
		},

		/**
		 * Get the current instance of Plyr and
		 * automatically PLAY it.
		 *
		 * For non-slider layouts this will play
		 * the first instance only e.g. the first
		 * video in a series of stacked slides.
		 *
		 * @param type
		 * @param product_object
		 */
		plyr_autoplay_current_instance: function( type, product_object ) {
			if ( ! iconic_woothumbs.vars.plyr_autoplay || ! type || ! product_object ) {
				return;
			}

			var $container = iconic_woothumbs.plyr_get_instance_container( type,product_object );

			if ( ! $container.length ) {
				return;
			}

			var instance = iconic_woothumbs.plyr_pluck_instance( type, $container );

			if ( ! instance ) {
				return;
			}

			setTimeout( function() {
				instance.muted = true; // We must mute before playblack for Chrome/Webkit autoplay.
				instance.play();
			}, 250 );
		},

		/**
		 * Get the current instance of Plyr and
		 * automatically STOP it.
		 *
		 * For non-slider layouts this will stop
		 * the first instance only e.g. the first
		 * video in a series of stacked slides.
		 *
		 * @param type
		 * @param product_object
		 */
		plyr_pause_current_instance: function( type, product_object ) {
			if ( ! type || ! product_object ) {
				return;
			}

			var $container = iconic_woothumbs.plyr_get_instance_container( type, product_object );

			if ( ! $container.length ) {
				return;
			}

			var instance = iconic_woothumbs.plyr_pluck_instance( type, $container );

			if ( ! instance ) {
				return;
			}

			instance.pause();
		},

		/**
		 * Pluck a plyr instance from a collection
		 * based on a supplied DOM element.
		 *
		 * @param type
		 * @param container
		 */
		plyr_pluck_instance: function( type, container ) {
			if ( ! window.iconic_woothumbs_plyr || ! type || ! container ) {
				return false;
			}

			var found_instance = false;

			window.iconic_woothumbs_plyr[ type ].forEach( instance => {
				for ( var key in instance ) {
					if ( instance.hasOwnProperty( key ) && key === 'elements' ) {
						if ( instance[ key ].container === container[0] ) {
							found_instance = instance;
						}
					}
				}
			});

			return found_instance;
		},

		/**
		 * Get a container element associated with a
		 * specific Plyr instance.
		 *
		 * @param type
		 * @param product_object
		 */
		plyr_get_instance_container: function( type, product_object ) {
			if ( ! type || ! product_object ) {
				return false;
			}

			var $container;

			if ( iconic_woothumbs.vars.plyr_gallery_type === type ) {
				if ( iconic_woothumbs.vars.is_slider_layout ) {
					$container = product_object.images.find( '.slick-current .plyr' );
				} else {
					// We only autoplay the first video, as that makes sense given that it
					// will be associated with the featured image, and autoplaying multiple
					// videos at once is very poor UX.
					$container = product_object.images.find( '.plyr:first' );
				}
			} else if ( iconic_woothumbs.vars.plyr_fullscreen_type === type ) {
				$container = $( window.iconic_woothumbs_photoswipe.currSlide.holderElement ).find( '.plyr' );
			}

			return $container;
		}
	};

	$( window ).on( 'load', function( e ) {
		iconic_woothumbs.on_load( e );
	} );
	$( 'body' ).on( 'jckqv_open', function( e ) {
		iconic_woothumbs.on_load( e );
	} );

	// Compatibility with the "quick view" functionality provided
	// by the JetWoo Popup plugin for Elementor.
	$( window ).on( 'jet-popup/show-event/after-show', function( e ) {
		iconic_woothumbs.on_load( e );
	} );
	$( window ).on( 'resize', iconic_woothumbs.on_resize );
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
