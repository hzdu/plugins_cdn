/**
 * Yoast SEO Integration
 */

 const FusionYoast = function() {
	window.YoastSEO.app.registerPlugin( 'FusionYoast', { status: 'ready' } );
	window.YoastSEO.app.registerModification( 'content', this.myContentModification, 'FusionYoast', 5 );

	this.events();
  };

  FusionYoast.prototype.myContentModification = function( content ) {
	content = jQuery( '#fusion-builder-rendered-content' ).val();
	return content;
  };

  FusionYoast.prototype.events = function( ) {
	jQuery( document ).on( 'fusion-builder-content-updated', function() {
		jQuery.post( window.fusionBuilderConfig.rest_url + 'awb/rendered_content', { content: window.fusionBuilderGetContent( 'content' ) }, function( result ) {
		jQuery( '#fusion-builder-rendered-content' ).val( result.content );

		window.setTimeout( function() {
			window.YoastSEO.app.pluginReloaded( 'FusionYoast' );
		}, 500 );
	} );

	} );
  };

  /**
 * Initializes the Additional ReplaceVars plugin.
 *
 * @returns {void}
 */
 function initializeFusionYoast() {
	// When YoastSEO is available, just instantiate the plugin.
	if ( 'undefined' !== typeof window.YoastSEO && 'undefined' !== typeof window.YoastSEO.app ) {
		new FusionYoast(); // eslint-disable-line no-new
		return;
	}

	// Otherwise, add an event that will be executed when YoastSEO will be available.
	jQuery( window ).on( 'YoastSEO:ready', function () {
		new FusionYoast(); // eslint-disable-line no-new
	} );
  }

  initializeFusionYoast();

