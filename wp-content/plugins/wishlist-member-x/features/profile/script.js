/**
 * Update the display name
 * @param  object elm Element
 */
function wlm3_update_displayname(elm) {
	if (!elm.value.trim()) return;
	var elms = document.forms['wishlist-member-profile-form'].elements;
	var options = elms.display_name.options;
	if (elm.name == 'nickname') {
		options[options.length] = new Option(elm.value);
	}
	if (elm.name == 'first_name' || elm.name == 'last_name') {
		options[options.length] = new Option(elm.value);
		var fn = elms.first_name.value.trim();
		var ln = elms.last_name.value.trim();
		if (fn && ln) {
			options[options.length] = new Option(fn + ' ' + ln);
			options[options.length] = new Option(ln + ' ' + fn);
		}
	}
}