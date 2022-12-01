/**
 * wcj-track-users.js
 *
 * @version 1.0.0
 * @version 1.0.0
 */

jQuery(document).ready(function() {
	var data = {
		'action': 'wcj_track_users',
		'wcj_http_referer': track_users_ajax_object.http_referer,
		'wpnonce': track_users_ajax_object.wpnonce,
		'wcj_user_ip': track_users_ajax_object.user_ip
	};
	jQuery.ajax({
		type: "POST",
		url: track_users_ajax_object.ajax_url,
		data: data,
	});
});
