jQuery( function ( $ ) {
	'use strict';

	$('#vp-post-formats-ui-tabs a').on('click', function(e) {

		var format = '',
			$this = $(this),
			$tab = $this.closest('li'),
			href = $this.attr('href');

		if (! $this.hasClass('current')) {
			return false;
		}

		switch (href) {
			case '#post-format-0':
				format = 'standard';
				break;
			case '#post-format-aside':
				format = 'aside';
				break;
			case '#post-format-chat':
				format = 'chat';
				break;
			case '#post-format-status':
				format = 'status';
				break;
			case '#post-format-link':
				format = 'link';
				break;
			case '#post-format-gallery':
				format = 'gallery';
				break;
			case '#post-format-video':
				format = 'video';
				break;
			case '#post-format-quote':
				format = 'quote';
				break;
			case '#post-format-audio':
				format = 'audio';
				break;
		}
	});

} );