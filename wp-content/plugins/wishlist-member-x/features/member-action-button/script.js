/**
 * Additional scripting for wlm_member_action_button shortcode inserter 
 * @package WishListMember\Features
 */

/**
 * Filter and modify properties for wlm_member_action_button
 * @param  object e          Javascript event object
 * @param  object properties Shortcode properties
 * @param  string shortcode  Shortcode
 * @return object|string     Modified properties or "invalid"
 */
jQuery('body').on('wlm_shortcode_properties.wlm_member_action_button', function(e, properties, shortcode) {
	// we only want to process our shortcode
	if (shortcode == 'wlm_member_action_button') {
		// return invalid if no levels are chosen
		if (!properties.level) {
			return 'invalid';
		}
		// set redirect to the value of redirect-choice if it's value is not "urL"
		if (properties['redirect-choice'] != 'url') {
			properties.redirect = properties['redirect-choice'];
		}
		// delete redirect-choice property as it's not really needed
		delete properties['redirect-choice'];
		// return modified properties
		return properties;
	}
});

/**
 * Modify property form fields for wlm_member_action_button
 * @param  object e         Javascript event object
 * @param  string shortcode Shortcode
 */
jQuery('body').on('wlm_pre_shortcode_properties', function(e, shortcode) {
	// we only want to process our shortcode
	if (shortcode == 'wlm_member_action_button') {
		// get our shortcode properties' form
		var container = jQuery('form#wlm-shortcode-inserter-wlm_member_action_button.wlm-shortcode-attributes');
		// generate label placeholder
		// 1. get action
		// 2. capitalize the first letter
		// 3. set the placeholder
		var action = container.find('[name="action"]').val();
		action = action.charAt(0).toUpperCase() + action.slice(1);
		var placeholder = action + (action == 'Add' || action == 'Move' ? ' to ' : ' from ') + '%level%';
		container.find('[name="label"]').attr('placeholder', placeholder);
	}
});