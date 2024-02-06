/*global wsWidgetRefresherData */

jQuery(function($) {
	//Load the Dashboard in a hidden frame.
	const frame = $('<iframe></iframe>');

	frame.on('load', function() {
		//When done, redirect back to the widget editor.
		//phpcs:ignore WordPressVIPMinimum.JS.Window.location -- This writes the location, not reads it.
		window.location.href = wsWidgetRefresherData['editorUrl'];
	});

	frame.attr({
		'src': wsWidgetRefresherData['dashboardUrl'],
		'width': 1,
		'height': 1
	});
	frame.css('visibility', 'hidden');

	frame.appendTo('#wpwrap');
});
