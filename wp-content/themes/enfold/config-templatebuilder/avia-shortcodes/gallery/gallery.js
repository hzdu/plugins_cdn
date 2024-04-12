(function($)
{
	'use strict';

	// -------------------------------------------------------------------------------------------
	// Gallery shortcode javascript
	// -------------------------------------------------------------------------------------------

	$.fn.avia_sc_gallery = function(options)
	{
		return this.each(function()
		{
			var gallery = $(this),
				images = gallery.find('img'),
				big_prev = gallery.find('.avia-gallery-big'),
				prev = gallery.find( '.avia-slideshow-arrows .prev-slide' ),
				next = gallery.find( '.avia-slideshow-arrows .next-slide' ),
				thumbs = gallery.find( '.avia-gallery-thumb a' ),
				no_hover_effect = gallery.hasClass( 'no-hover-effect' );

			if( next.length )
			{
				gallery.avia_swipe_trigger( {prev:'.prev-slide', next:'.next-slide'} );
			}

			//trigger displaying of thumbnails
			gallery.on( 'avia_start_animation', function()
			{
				images.each(function(i)
				{
					var image = $(this);
					setTimeout( function()
					{
						image.addClass('avia_start_animation');
					}, (i * 110) );
				});
			});

			if( gallery.hasClass('deactivate_avia_lazyload') )
			{
				gallery.trigger('avia_start_animation');
			}

			//trigger thumbnail hover and big prev image change
			if( big_prev.length )
			{
				gallery.on( 'mouseenter', '.avia-gallery-thumb a', function()
				{
					var _self = $(this),
						newImgSrc = _self.attr('data-prev-img'),
						oldImg = big_prev.find('img'),
						oldImgSrc = oldImg.attr('src');

					if( no_hover_effect )
					{
						if( ! gallery.hasClass( 'av-force-img-change' ) )
						{
							return;
						}
					}

					gallery.removeClass( 'av-force-img-change' );

					if( newImgSrc == oldImgSrc )
					{
						return;
					}

					big_prev.height( big_prev.height() );

					big_prev.attr('data-onclick', _self.attr('data-onclick'));
					big_prev.attr('href', _self.attr('href'));
					big_prev.attr('title', _self.attr('title'));

					//	copy lightbox attributes
					if( 'undefined' == typeof _self.data('srcset') )
					{
						big_prev.removeAttr('data-srcset');
						big_prev.removeData('srcset');
					}
					else
					{
						big_prev.data('srcset', _self.data('srcset'));
						big_prev.attr('data-srcset', _self.data('srcset'));
					}

					if( 'undefined' == typeof _self.data('sizes') )
					{
						big_prev.removeAttr('data-sizes');
						big_prev.removeData('sizes');
					}
					else
					{
						big_prev.data('sizes', _self.data('sizes'));
						big_prev.attr('data-sizes', _self.data('sizes'));
					}

					//	since 4.8.8.2 we have a hidden img to support scrset and sizes - fallback to old version if missing
					var newPrev = _self.find( '.big-prev-fake img' ).clone( true );
					if( newPrev.length == 0 )
					{
						var next_img = new Image();
						next_img.src = newImgSrc;
						newPrev = $(next_img);
					}

					if( big_prev.hasClass( 'avia-gallery-big-no-crop-thumb' ) )
					{
//						changed 5.4: https://github.com/KriesiMedia/wp-themes/issues/4028
//						newPrev.css( {'height':big_prev.height(),'width':'auto'} );
						newPrev.css( {'height':'auto', 'width':'auto', 'max-height':'100%', 'max-width':'100%'} );
					}

					big_prev.stop().animate( {opacity:0}, function()
					{
						newPrev.insertAfter( oldImg );
						oldImg.remove();
						big_prev.animate( {opacity:1} );
					});
				});

				next.on( 'click', function( e )
				{
					e.preventDefault();

					if( ! big_prev.length )
					{
						return;
					}

					let current = big_prev[0].dataset.onclick,
						next_index = current;

					if( next_index >= thumbs.length  )
					{
						next_index = 0;
					}

					gallery.addClass( 'av-force-img-change' );
					$( thumbs[ next_index ] ).trigger( 'mouseenter' );
				});

				prev.on( 'click', function( e )
				{
					e.preventDefault();

					if( ! big_prev.length )
					{
						return;
					}

					let current = big_prev[0].dataset.onclick,
						prev_index = current - 2;

					if( prev_index < 0  )
					{
						prev_index = thumbs.length - 1;
					}

					gallery.addClass( 'av-force-img-change' );
					$( thumbs[ prev_index ] ).trigger( 'mouseenter' );
				});

				big_prev.on( 'click', function( e )
				{
					e.preventDefault();
					
					var imagelink = gallery.find('.avia-gallery-thumb a').eq( this.getAttribute('data-onclick') - 1 );

					if( imagelink && ! imagelink.hasClass('aviaopeninbrowser') )
					{
						imagelink.trigger('click');
					}
					else if( imagelink )
					{
						var imgurl = imagelink.attr('href');
						var secure = imagelink.hasClass( 'custom_link' ) ? 'noopener,noreferrer' : '';

						if( imagelink.hasClass('aviablank') && imgurl != '' )
						{
							window.open( imgurl, '_blank', secure );
						}
						else if( imgurl != '' )
						{
							window.open( imgurl, '_self', secure );
						}
					}
					return false;
				});


				$(window).on( 'debouncedresize', function()
				{
				  	big_prev.height('auto');
				});
			}
		});
	};

}(jQuery));
