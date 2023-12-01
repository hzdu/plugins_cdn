jQuery(function($){
	// generate shortcode creator modal
	$(function() {
		var mymodal = new wlm3_modal(
			'#shortcode-creator-markup', // pointer to mark-up
			{
				before_open : function() {
					// cleanup
					jQuery('.wlm-shortcode-attributes').hide();
					jQuery('.shortcode-creator-preview').val('');
				}
			}
		);
	});
	
	$('body').on('wlm_shortcode_preview', function(e, shortcode) {
		$('.shortcode-creator-preview').val(shortcode);
	});
	// shortcode creator - highlight content of preview box on focus
	$('body').on('focus', '.shortcode-creator-preview', function () {
	  this.select();
	});

	$('.enter-license-key').click(function() {
		if($(this).data('confirm-popup')) {
			if ( !confirm(wp.i18n.__( 'Are you sure that you want to deactivate the license of this plugin for this site?', 'wishlist-member' )) ) return;
		}
		$('#the-content').html($('#wlm-simple-loader-container').html());
		$.post(
			WLM3VARS.ajaxurl,
			{
				action : 'admin_actions',
				WishListMemberAction : 'deactivate_license',
				wordpress_wishlist_deactivate : WLM3VARS.sku
			},
			function() {
				window.parent.location.reload(true);
			}
		);
	});
	$.post(WLM3VARS.ajaxurl, { action : 'wlm_feeds', age : 31877, url : 'http://feeds.feedburner.com/wishlistmemberwarnings', dismiss : 'dashboard_warningfeed_dismissed' }, function (result) {
		if(result.length < 1) return;
		$('#wlm-warning-title strong').text(result[0].title);
		var x = $('<div/>')
		x.append(result[0].content);
		var c = [];
		x.find('p').each(function() {
			if(c.join(' ').length >= 300) return false;
			var words = $(this).text().split(' ');
			while(c.join(' ').length < 300 && words.length) {
				c.push(words.shift());
			}
		});

		$('#wlm-warning-link').attr('href', result[0].permalink);
		$('#wlm-warning-content').html('<p>' + c.join(' ') + '&hellip;</p>');
		$('#wlm-warning').show();
	});

	$.post(WLM3VARS.ajaxurl, { action : 'wlm_feeds', age : 7, url : 'http://feeds.feedburner.com/wishlistmembernews', dismiss : 'dashboard_feed_dismissed' }, function (result) {
		if(result.length < 1) return;
		$('#wlm-news .panel-title').append('<a style="font-size: 1em" href="' + result[0].permalink + '" target="_blank">' + result[0].title + '</a>');
		var x = $('<div/>')
		x.append(result[0].content);
		var c = [];
		x.find('p').each(function() {
			if(c.join(' ').length >= 300) return false;
			var words = $(this).text().split(' ');
			while(c.join(' ').length < 300 && words.length) {
				c.push(words.shift());
			}
		});

		$('#wlm-news-link').attr('href', result[0].permalink);
		$('#wlm-news-content').html('<p>' + c.join(' ') + '&hellip;</p>');
		$('#wlm-news').show();
	});

	$('.wlm-dismiss-news').click(function() {
		$.post( WLM3VARS.ajaxurl, { action : 'wlm3_dismiss_news', dismiss : $(this).data('option') } );
		$(this).closest('.wlm-new-container').fadeOut();
		return false;
	});

	$.post(WLM3VARS.ajaxurl, { action : 'wlm3_get_level_stats' }, function (stats) {
		$.each(stats, function(index, stats) {
			var total = 0;
			$.each(stats, function(level, count) {
				count = parseInt( count );
				total += count;
				$('tr[data-levelid="' + level + '"] .' + index + ' a').text( count.toLocaleString( 'us' ) );
			});
			$('.t' + index).text( total.toLocaleString( 'us' ) );
		});
		level_stats = stats;
	});

	document.querySelectorAll('.fadeOut-css.highlight-fade').forEach(
		o => {
			o.onanimationend = e => {
				e.target.classList.remove('highlight-fade');
			}
		}
	);
});

