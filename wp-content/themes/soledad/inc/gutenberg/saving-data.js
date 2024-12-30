jQuery( function ( $ ) {
	'use strict';
	/**
	 * Handles updating tiny mce instances when saving a gutenberg post.
	 * https://github.com/WordPress/gutenberg/issues/7176
	 */
	function PenciEnsureSave() {
		if ( ! wp.data || ! window.tinyMCE ) {
			return;
		}
		wp.data.subscribe( function() {
			if ( wp.data.select( 'core/editor' ).isSavingPost() ) {
				window.tinyMCE.triggerSave();
			}
		} );
	}
	
	
	PenciEnsureSave();
} );