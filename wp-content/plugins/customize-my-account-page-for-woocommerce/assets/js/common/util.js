/**
 * Common js required in both admin and frontend.
 */

/**
 * Convert the icon class name to text.
 *
 * e.g. 'fas fa-address-book' -> 'Address book'
 *
 * @since 0.1.0
 *
 * @param {string} icon Fontawesome icon class.
 *
 * @return {string} Text of fontawesome class.
 */
function iconToText(icon) {
	text = icon.replace('fas', '');
	text = text.replace('fa-', '');
	text = text.replace(/\-/g, ' ');
	text = text.trim();
	text = text.charAt(0).toUpperCase() + text.substring(1);

	return text;
}

/**
 * Convert text to ID.
 *
 * e.g. 'Hello World' -> 'hello-world'
 *
 * @param {string} text Text to be converted to be ID.
 */
function textToID(text) {
	return text.replace(/\s+/g, '-').toLowerCase();
}
