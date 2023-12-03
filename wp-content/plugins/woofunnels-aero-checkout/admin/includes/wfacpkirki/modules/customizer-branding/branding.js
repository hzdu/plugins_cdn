/* global wfacpkirkiBranding */
jQuery( document ).ready( function() {

	'use strict';

	if ( '' !== wfacpkirkiBranding.logoImage ) {
		jQuery( 'div#customize-info .preview-notice' ).replaceWith( '<img src="' + wfacpkirkiBranding.logoImage + '">' );
	}

	if ( '' !== wfacpkirkiBranding.description ) {
		jQuery( 'div#customize-info > .customize-panel-description' ).replaceWith( '<div class="customize-panel-description">' + wfacpkirkiBranding.description + '</div>' );
	}

} );
