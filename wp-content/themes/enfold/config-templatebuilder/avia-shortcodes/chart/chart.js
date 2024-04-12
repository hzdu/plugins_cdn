/*
 * ALB Shortcode chart implementation
 *
 * @since 5.3
 */
(function($)
{
	"use strict";

	$.fn.aviaChart = function( options )
	{
		if( ! this.length )
		{
			return;
		}

		return this.each( function()
		{
			var container = $( this ),
				config = container.data( 'chart_config' ),
				context = container.find( '.avia-chart').first(),
				chart = null;

			if( ! context.length || 'undefined' == typeof( config ) )
			{
				return;
			}

			chart = new Chart( context, config );
		});
	};

	$( function()
	{
		$('.avia-chart-container').aviaChart();
	});

}(jQuery));

