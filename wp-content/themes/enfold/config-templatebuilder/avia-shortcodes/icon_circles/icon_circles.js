// -------------------------------------------------------------------------------------------
// Icon circles picker
// -------------------------------------------------------------------------------------------
(function($)
{
	"use strict";

	$.fn.aviaIconCircles = function(options)
	{
		return this.each( function()
		{
			var container = $(this),
				logos = container.find('.avia-icon-circles-icon'),
				logoText = container.find('.avia-icon-circles-icon-text');

			//trigger animation
			container.on( 'avia_start_animation', function()
			{
				if( container.hasClass( 'avia_animation_finished' ) )
				{
					return;
				}

				//	modal preview does not have waypoint script - simulate it
				container.addClass( 'avia_start_animation' );

				setTimeout( function()
				{
					container.addClass( 'avia_animation_finished' );

					if( container.hasClass( 'avia-active-icon' ) )
					{
						setTimeout(function()
						{
							var firstLogo = logos.filter('.av-first-active');

							if( firstLogo.length && ! logos.filter('.active').length )
							{
								firstLogo.addClass('active');
								firstLogo.next().addClass('active');
								container.addClass('active-container');
							}
						}, 800 );
					}
				}, 2000 );

				logos.on( 'mouseenter', function()
				{
					logos.removeClass('active');
					logoText.removeClass('active');

					var logo = $(this).addClass('active');
					logo.next().addClass('active');
					container.addClass('active-container');
				});

				container.on( 'mouseleave', function()
				{
					logos.removeClass('active');
					logoText.removeClass('active');
					container.removeClass('active-container');
				});
			});
		});
	};

}(jQuery));
