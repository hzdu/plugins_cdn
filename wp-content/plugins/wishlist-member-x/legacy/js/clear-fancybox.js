/*
 * make sure there is no fancybox
 */

if(jQuery.fancybox) {
	// version comparison
	var wlm3_fv = '00003.00005.00006';
	var their_fv = jQuery.fancybox.version.split('.');
	their_fv.forEach(function(v, i) {
		their_fv[i] = v.padStart(5, '0');
	});
	their_fv = their_fv.join('.');

	// if our version is greater than delete other fancybox
	if(wlm3_fv > their_fv) {
		delete jQuery.fn.fancybox;
	}
}