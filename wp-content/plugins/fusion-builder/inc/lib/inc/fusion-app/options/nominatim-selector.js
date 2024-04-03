/* global FusionApp, fusionBuilderText */
var FusionPageBuilder = FusionPageBuilder || {};
FusionPageBuilder.options = FusionPageBuilder.options || {};

FusionPageBuilder.options.fusionNominatimSelector = {
	optionNominatimSelector: function( $element ) {
		var $linkSelector;
		$element      = $element || this.$el;
		$linkSelector = $element.find( '.fusion-nominatim-selector' );

		if ( $linkSelector.length ) {

			$linkSelector.each( function() {
				const $linkButton = jQuery( this ).find( '.fusion-builder-nominatim-button' );
				let $input, latField, lonField, query;

				jQuery( $linkButton ).on( 'click', function( e ) {
					e.preventDefault();
					$input = jQuery( e.currentTarget ).prev( '.fusion-builder-nominatim-field' );
					latField = $input.attr( 'data-lat' );
					lonField = $input.attr( 'data-lon' );
					query = encodeURI( $input.val() );
					const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json`;
					const initFetch = { method: 'GET', mode: 'cors', headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' } };
					window.fetch( url, initFetch )
						.then( function( response ) {
							return response.json();
						} ).then( function( json ) {
							if ( Array.isArray( json ) && 0 < json.length ) {
								jQuery( `#${latField}` ).val( json[ 0 ].lat ).trigger( 'change' );
								jQuery( `#${lonField}` ).val( json[ 0 ].lon ).trigger( 'change' );
							} else {
								FusionApp.confirmationPopup( {
									title: '',
									content: `Unknown address: ${$input.val()}`,
									actions: [
										{
											label: fusionBuilderText.ok,
											classes: 'yes',
											callback: function() {
												FusionApp.confirmationPopup( {
													action: 'hide'
												} );
											}
										}
									]
								} );
							}
						} )[ 'catch' ]( function( error ) {

							FusionApp.confirmationPopup( {
								title: '',
								content: error.message,
								actions: [
									{
										label: fusionBuilderText.ok,
										classes: 'yes',
										callback: function() {
											FusionApp.confirmationPopup( {
												action: 'hide'
											} );
										}
									}
								]
							} );

						} );
				} );
			} );

		}
	}
};
