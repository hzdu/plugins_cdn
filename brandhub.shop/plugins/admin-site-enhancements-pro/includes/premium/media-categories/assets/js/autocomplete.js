/**
 * JavaScript for interacting with autocomplete instances.
 *
 * @since 	1.0.0
 *
 * @package Media_Categories_Module
 * @author 	Media Categories Module
 */

/**
 * Initialize autocomplete instances for Classic Editor
 * and Meta Boxes, based on the globally registered
 * selectors.
 *
 * @since 	1.1.9
 */
function mediaLibraryOrganizerAutoCompleteInit() {

	( function( $ ) {

		$( media_categories_module_autocomplete.fields.join( ', ' ) ).each(
			function( e ) {
				if ( $( this ).data( 'autocomplete' ) ) {
					$( this ).autocomplete( 'destroy' );
					$( this ).removeData( 'autocomplete' );
				}

				// Initialize autocomplete.
				mediaLibraryOrganizerAutoCompleteInitInput( this, media_categories_module_autocomplete.terms, true );
			}
		);

	} )( jQuery );

}

/**
 * Initializes a single autocomplete input instance for the given input field
 *
 * @since 	1.1.6
 */
function mediaLibraryOrganizerAutoCompleteInitInput( input, values, destroy_if_already_initialized ) {

	( function( $ ) {

		// Destroy the autocomplete instance if it's already initialized on this element.
		if ( destroy_if_already_initialized && $( input ).data( 'autocomplete' ) ) {
			$( input ).autocomplete( 'destroy' );
			$( input ).removeData( 'autocomplete' );
		}

		// If the input is already initialized, don't do anything.
		if ( $( input ).data( 'autocomplete' ) ) {
			return;
		}

		// Initialize.
		$( input )
			.on(
				'keydown',
				function( event ) {
					if ( event.keyCode === $.ui.keyCode.TAB && $( this ).autocomplete( 'instance' ).menu.active ) {
						event.preventDefault();
					}
				}
			)
			.autocomplete(
				{
					minLength: 0,
					source: function( request, response ) {
						response( $.ui.autocomplete.filter( values, request.term.split( /[ ,]+/ ).pop() ) );
					},
					focus: function() {
						return false;
					},
					select: function( event, ui ) {
						var terms = this.value.split( /[ ,]+/ );
						terms.pop();
						terms.push( ui.item.value );
						terms.push( "" );
						this.value = terms.join( " " );
						return false;
					}
				}
			);

	} )( jQuery );

}

/**
 * Initialize autocomplete instances when the page is ready
 *
 * @since 	1.2.0
 */
jQuery( document ).ready(
	function( $ ) {

		mediaLibraryOrganizerAutoCompleteInit();

	}
);
