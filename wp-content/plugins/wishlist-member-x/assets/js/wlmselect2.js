/**
 * This script does the ff:
 * 1. Backup existing jQuery.fn.select2
 * 2. Load our select2 and move it to jQuery.fn.wlmselect2
 * 3. Restore the original jQuery.fn.select2
 *
 * The idea is to prevent conflicts with other plugins' select2
 */

// backup existing select2
if ( typeof jQuery.fn.select2 == 'function' ) {
	jQuery.fn.wlm_select2bak = jQuery.fn.select2;
	// delete .fn.select2 so our select2 can use it
	delete jQuery.fn.select2;
}

// load select2
jQuery.ajax( {
	async    : false,
	url      : wlmselect2src,
	dataType : 'script'
} );

// move our select2 to .fn.wlmselect2
jQuery.fn.wlmselect2 = jQuery.fn.select2;

// restore the backup select2 to its original state
if ( typeof jQuery.fn.wlm_select2bak == 'function' ) {
	jQuery.fn.select2 = jQuery.fn.wlm_select2bak;
	delete jQuery.fn.wlm_select2bak;
}
