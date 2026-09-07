jQuery(function($) {

	"use strict";

	// ****************************************************************
	// Dashboard iFrame
	// ****************************************************************

	var getbowtied_iframe = $('#getbowtied_dashboard_iframe');

	getbowtied_iframe.on("load", function() {
		if (typeof(jQuery().iFrameResize) != 'undefined') {
			getbowtied_iframe.iFrameResize({
				log: false,
				autoResize: true,
				onInit: function() {
					$(window).scrollTop(0);
					//document.getElementById('getbowtied_dashboard_iframe').iFrameResizer.sendMessage('iFrame Loaded');
					//document.getElementById('getbowtied_dashboard_iframe').iFrameResizer.close();
				},
				onMessage: function (messageData) {
					//console.log(messageData.message + " - message from getbowtied.com to WordPress iFrame #" + messageData.iframe.id);
					//$('a.toplevel_page_getbowtied-dashboard')[0].click();
				}
			})
		}
	})
})