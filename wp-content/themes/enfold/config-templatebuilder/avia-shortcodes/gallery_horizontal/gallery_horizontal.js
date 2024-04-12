// -------------------------------------------------------------------------------------------
// Horizontal Gallery
//
// @since ???
// @since 5.0		extended "slideshow" navigation, added transform3d support
// -------------------------------------------------------------------------------------------

(function($)
{
	"use strict";

	$.fn.avia_hor_gallery = function(options)
	{
		var defaults =
			{
				slide_container	: '.av-horizontal-gallery-inner', //element with max width
				slide_element	: '.av-horizontal-gallery-slider', //element that gets moved
				slide_content	: '.av-horizontal-gallery-wrap',
				slide_arrows	: '.avia-slideshow-arrows',
				slide_dots		: '.avia-slideshow-dots',
				active			: 'av-active-gal-item',				// must be a class string without the . in front
				slide_controls	: '.avia-slideshow-controls',
				prev			: '.av-horizontal-gallery-prev',
				next			: '.av-horizontal-gallery-next'
			};

		var options = $.extend(defaults, options);

		var win 			= $(window),
			browserPrefix 	= $.avia_utilities.supports('transition'),
			cssActive 		= this.browserPrefix !== false ? true : false,
			isMobile 		= $.avia_utilities.isMobile,
			isTouchDevice	= $.avia_utilities.isTouchDevice,
			transform3d		= document.documentElement.className.indexOf('avia_transform3d') !== -1 ? true : false,
			transition		= {};

		return this.each(function()
		{
			var container 			= $(this),
				slide_container 	= container.find( options.slide_container ),
				slide_element		= container.find( options.slide_element ),
				slide_content		= container.find( options.slide_content ),
				slide_controls		= container.find( options.slide_controls ),
				slide_arrows		= container.find( options.slide_arrows ),	//	arrows to scroll images
				slide_dots_wrap		= container.find( options.slide_dots ),		//	dots to scroll images
				slide_dots			= slide_dots_wrap.find( 'a' ),
				prev				= container.find( options.prev ),
				next				= container.find( options.next ),
				imgs				= container.find( 'img' ),


				all_elements_width = 0,
				currentIndex = false,	//	0 based
				slideshowOptions = {
								animation: 'av-tab-slide-transition',
								autoplay: false,
								loop_autoplay: 'once',			//	'endless' | 'once'
								interval: 5,
								loop_manual: 'manual-endless',	//	'manual-endless' | 'manual-once'
								autoplay_stopper: false,
								noNavigation: false,
								initial: null,
								enlarge: 1
							},
				slideshowData = container.data( 'slideshow-data' ),		//	returns decoded json object
				timeoutIDAutoplay = null;

			if( 'undefined' != typeof slideshowData )
			{
				slideshowOptions = $.extend( {}, slideshowOptions, slideshowData );
			}

			var	set_up = function()
				{
					var sl_height = ( slide_container.width() / 100 ) * slide_container.data('av-height');

					slide_container.css( {'padding':0} ).height( sl_height );

					//fixes img distortion when resizing browser:
					imgs.css('display','inline-block');
					setTimeout( function(){ imgs.css( 'display', 'block' ); }, 10 );

					//calculate the slidelement width based on the elements inside
					all_elements_width = 0;

					slide_content.each( function()
					{
						all_elements_width += $(this).outerWidth( true );
					});

					slide_element.css( 'min-width' , all_elements_width );

					if( currentIndex !== false )
					{
						change_active( currentIndex );
					}
				},

				change_active = function( index )
				{
					//scroll the tabs if there is not enough room to display them all
					var current 	= slide_element.find( options.slide_content ).eq( index ),
						viewport	= slide_container.width(),
						modifier	= slideshowOptions.enlarge > 1  && currentIndex == index ? slideshowOptions.enlarge : 1,
						outerWidth	= current.outerWidth( true ) * modifier,
						margin_right= parseInt( current.css('margin-right'), 10 ) / 2,
						left_pos	= viewport < all_elements_width ? ( current.position().left * - 1 ) - ( outerWidth / 2 ) + ( viewport / 2 ): 0;

					//center properly
					left_pos = left_pos + margin_right;

					//out of bounce right side
					if( left_pos + all_elements_width < viewport )
					{
						left_pos = ( all_elements_width - viewport - parseInt( current.css('margin-right'), 10 ) ) * -1;
					}

					//out of bounce left side
					if( left_pos > 0 )
					{
						left_pos = 0;
					}

					if( cssActive )
					{
						transition['transform'] = transform3d ? "translate3d( " + left_pos  + "px, 0, 0 )" : "translate( " + left_pos + "px, 0 )"; //3d or 2d transform?
						transition['left'] = "0px";
						slide_element.css( transition );
					}
					else
					{
						slide_element.css( 'left', left_pos );
					}

					slide_container.find( '.' + options.active ).removeClass( options.active );
					current.addClass( options.active );
					currentIndex = index;

					set_slide_arrows_visibility();
					set_slide_dots_visibility();
				},

				clearTimeoutAutoplay = function()
				{
					if( typeof timeoutIDAutoplay === 'number' )
					{
						clearTimeout( timeoutIDAutoplay );
					}

					timeoutIDAutoplay = null;
				},

				init_autoplay = function()
				{
					if( true !== slideshowOptions.autoplay )
					{
						container.removeClass( 'av-slideshow-autoplay' ).addClass( 'av-slideshow-manual' );
					}

					if( 'undefined' == typeof slideshowOptions.loop_autoplay || 'endless' != slideshowOptions.loop_autoplay  )
					{
						slideshowOptions.loop_autoplay = 'once';
					}

					if( 'undefined' == typeof slideshowOptions.interval )
					{
						slideshowOptions.interval = 5;
					}

					if( 'undefined' == typeof slideshowOptions.autoplay || true !== slideshowOptions.autoplay  )
					{
						slideshowOptions.autoplay = false;
						container.removeClass( 'av-slideshow-autoplay' ).addClass( 'av-slideshow-manual' );
						return;
					}

					clearTimeoutAutoplay();

					timeoutIDAutoplay = setTimeout( function()
					{
						rotate_next_image();
					}, slideshowOptions.interval * 1000 );
				},

				rotate_next_image = function()
				{
					timeoutIDAutoplay = null;

					if( 'endless' != slideshowOptions.loop_autoplay )
					{
						var stop = false;

						if( currentIndex === false )
						{
							if( slide_content.length == 0 )
							{
								stop = true;
							}
						}
						else
						{
							stop = currentIndex + 1 >= slide_content.length;
						}

						if( stop )
						{
							slideshowOptions.autoplay = false;
							slideshowOptions.loop_autoplay = 'manual';
							container.removeClass( 'av-slideshow-autoplay' ).addClass( 'av-slideshow-manual' );
							container.removeClass( 'av-loop-endless' ).addClass( 'av-loop-once' );
							return;
						}
					}

					//	activates autorotate again
					next.trigger( 'click' );
				},

				set_slide_arrows_visibility = function()
				{
					if( 'endless' == slideshowOptions.loop_autoplay || 'manual-endless' == slideshowOptions.loop_manual || false === currentIndex )
					{
						slide_arrows.addClass( 'av-visible-prev' );
						slide_arrows.addClass( 'av-visible-next' );
					}
					else if( 0 == currentIndex )
					{
						slide_arrows.removeClass( 'av-visible-prev' );
						slide_arrows.addClass( 'av-visible-next' );
					}
					else if( currentIndex + 1 >= slide_content.length )
					{
						slide_arrows.addClass( 'av-visible-prev' );
						slide_arrows.removeClass( 'av-visible-next' );
					}
					else
					{
						slide_arrows.addClass( 'av-visible-prev' );
						slide_arrows.addClass( 'av-visible-next' );
					}
				},

				set_slide_dots_visibility = function()
				{
					slide_dots_wrap.find( 'a' ).removeClass( 'active' );

					var tmpIndex = false !== currentIndex ? currentIndex : 0;
					slide_dots_wrap.find( 'a' ).eq( tmpIndex ).addClass( 'active' );
				};

			//element click
			slide_content.on( 'click', function(e)
			{
				var current = $(this);
				var index = slide_content.index( current );

				if( currentIndex === index )
				{
//					if( av_enlarge > 1 && ! $( e.target ).is( 'a' ) )
//					{
//						//slide_container.find("." +options.active).removeClass(options.active);
//						//currentIndex = false;
//					}
					return;
				}

				clearTimeoutAutoplay();
				change_active( index );
				init_autoplay();
			});

			prev.on( 'click', function(e)
			{
				//	select first image by default
				var nextID = currentIndex !== false ? currentIndex - 1 : 0;

				if( nextID < 0 )
				{
					if( 'endless' != slideshowOptions.loop_autoplay && 'manual-endless' != slideshowOptions.loop_manual )
					{
						return;
					}

					nextID = slide_content.length - 1;
				}

				clearTimeoutAutoplay();
				change_active( nextID );
				init_autoplay();
			});

			next.on( 'click', function(e)
			{
				//	select first image by default to avoid zooming
				var nextID = currentIndex !== false ? currentIndex + 1 : 0;

				if( nextID >= slide_content.length )
				{
					if( 'endless' != slideshowOptions.loop_autoplay && 'manual-endless' != slideshowOptions.loop_manual )
					{
						return;
					}

					nextID = 0;
				}

				clearTimeoutAutoplay();
				change_active( nextID );
				init_autoplay();
			});

			slide_dots.on( 'click', function( e )
			{
				var current = $( this );
				var index = slide_dots.index( current );

				clearTimeoutAutoplay();
				change_active( index );
				init_autoplay();
			});

			$.avia_utilities.preload({
				container: container,
				global_callback: function()
				{
					// activate behavior
					set_up();

					if( slideshowOptions.initial )
					{
						var first = parseInt( slideshowOptions.initial, 10 );

						if( isNaN( first ) || first < 1 )
						{
							first = 1;
						}
						else if( first > slide_content.length )
						{
							first = slide_content.length;
						}

						change_active( first - 1 );
					}

					set_slide_arrows_visibility();
					set_slide_dots_visibility();
					init_autoplay();

					setTimeout( function()
					{
						container.addClass( 'av-horizontal-gallery-animated' );
					}, 10 );

					win.on( 'debouncedresize', set_up );
				}
			});

			if( ! container.hasClass( 'av-control-hidden' ) )
			{
				//if its a desktop browser add arrow navigation, otherwise add touch nav (also for touch devices)
				if( ! isMobile )
				{
					container.avia_keyboard_controls( { 37: options.prev, 39: options.next } );
				}

				if( isMobile || isTouchDevice )
				{
					container.avia_swipe_trigger( { prev: options.prev, next: options.next } );
				}
			}
		});
	};

}(jQuery));


