(function($) {

	//bail if our localized settings aren't available
	if(typeof novashare === 'undefined') {
		return;
	}

	//register plugin with tinymce editor
	tinymce.PluginManager.add('novashare_click_to_tweet', function(editor, url) {

		//click to tweet button
		editor.addButton('novashare_click_to_tweet', {
			icon 	: 'novashare-ctt-icon',
			tooltip : 'Novashare ' + novashare.translations.ctt.tooltip,
			cmd     : 'novashare_click_to_tweet'
		});

		//click to tweet button command
		editor.addCommand('novashare_click_to_tweet', function() {

			editor.windowManager.open({
				id		 : 'novashare_click_to_tweet_popup',
				title 	 : novashare.translations.ctt.title,
				minWidth : 750,
				buttons	 : [
					{
						text 		: novashare.translations.ctt.submit,
						classes 	: 'primary abs-layout-item',
						minWidth 	: 130,
						onclick		: 'submit'
					}
				],
				body  	 : [
					{
						type 		: 'textbox',
						id			: 'novashare_ctt_tweet_share',
						name		: 'novashare_ctt_tweet_share',
						label		: novashare.translations.ctt.body.tweet,
						multiline	: true,
						minWidth	: 400,
						minHeight	: 100
					},
					{
						type		: 'listbox',
						id			: 'novashare_ctt_theme',
						name		: 'novashare_ctt_theme',
						label		: novashare.translations.ctt.body.theme.title,
						values		: [
							{
								text  : novashare.translations.ctt.body.theme.values.default,
								value : ''
							},
							{
								text  : novashare.translations.ctt.body.theme.values.simple,
								value : 'simple'
							},
							{
								text  : novashare.translations.ctt.body.theme.values.simplealt,
								value : 'simple-alt'
							}
						]
					},
					{
						type 		: 'textbox',
						id			: 'novashare_ctt_cta_text',
						name		: 'novashare_ctt_cta_text',
						label		: novashare.translations.ctt.body.ctatext
					},
					{
						type		: 'listbox',
						id			: 'novashare_ctt_cta_position',
						name		: 'novashare_ctt_cta_position',
						label		: novashare.translations.ctt.body.ctaposition.title,
						values		: [
							{
								text  : novashare.translations.ctt.body.ctaposition.values.default,
								value : ''
							},
							{
								text  : novashare.translations.ctt.body.ctaposition.values.left,
								value : 'left'
							}
						]
					},
					{
						type		: 'checkbox',
						id			: 'novashare_ctt_remove_url',
						name		: 'novashare_ctt_remove_url',
						label		: novashare.translations.ctt.body.removeurl.title,
						text 		: novashare.translations.ctt.body.removeurl.text,
						checked     : novashare.click_to_tweet.remove_url ? true : false
					},
					{
						type		: 'checkbox',
						id			: 'novashare_ctt_remove_username',
						name		: 'novashare_ctt_remove_username',
						label		: novashare.translations.ctt.body.removeuser.title,
						text 		: novashare.translations.ctt.body.removeuser.text,
						checked     : novashare.click_to_tweet.remove_username ? true : false
					},
					{
						type		: 'checkbox',
						id			: 'novashare_ctt_hide_hashtags',
						name		: 'novashare_ctt_hide_hashtags',
						label		: novashare.translations.ctt.body.hidehash.title,
						text 		: novashare.translations.ctt.body.hidehash.text,
						checked     : novashare.click_to_tweet.hide_hashtags ? true : false
					},
					{
						type 		: 'textbox',
						id			: 'novashare_ctt_accent_color',
						name		: 'novashare_ctt_accent_color',
						label		: novashare.translations.ctt.body.accentcolortext
					}
					
				],
				onsubmit : function(e) {

					var shortcode = '';

					//build shortcode
					if(e.data.novashare_ctt_tweet_share) {

						shortcode = '[novashare_tweet';
						shortcode += ' tweet="' + e.data.novashare_ctt_tweet_share + '"';

						if(e.data.novashare_ctt_theme != 0) {
							shortcode += ' theme="' + e.data.novashare_ctt_theme + '"';
						}	

						if(e.data.novashare_ctt_cta_text) {
							shortcode += ' cta_text="' + e.data.novashare_ctt_cta_text + '"';
						}	

						if(e.data.novashare_ctt_cta_position != 0) {
							shortcode += ' cta_position="' + e.data.novashare_ctt_cta_position + '"';
						}	

						if(e.data.novashare_ctt_remove_url) {
							shortcode += ' remove_url="true"';
						}
							
						if(e.data.novashare_ctt_remove_username) {
							shortcode += ' remove_username="true"';
						}

						if(e.data.novashare_ctt_hide_hashtags) {
							shortcode += ' hide_hashtags="true"';
						}

						if(e.data.novashare_ctt_accent_color) {
							shortcode += ' accent_color="' + e.data.novashare_ctt_accent_color + '"';
						}
							
						shortcode += ']';
					}

					//output shortcode
					if(shortcode) {
						editor.insertContent(shortcode);
					}
				}
			});

			//base variables
			$novashare_tweet = $('#novashare_ctt_tweet_share');
			$permalink = $('#sample-permalink');

			//calculate initial counts
			var initial_char_count = 280;
			var username_length = (novashare.twitter_username && $("#novashare_ctt_remove_username").hasClass("mce-checked") != true) ? (novashare.twitter_username.length + 6) : 0;
			var url_length = ($permalink && $("#novashare_ctt_remove_url").hasClass("mce-checked") != true) ? 24 : 0;

			//print character count element
			$novashare_tweet.after('<p id="novashare_tweet_length">' + get_char_count() + ' ' + novashare.translations.ctt.body.charcount + '</p>');

			//adjust heights to make room for the character count
			$novashare_ctt_container = $('#novashare_click_to_tweet_popup-body');
			$novashare_ctt_container.height($novashare_ctt_container.height() + 25);
			$novashare_tweet_container = $novashare_tweet.closest('.mce-formitem');
			$novashare_tweet_container.height($novashare_tweet_container.height() + 25);
			$novashare_tweet_container.siblings('.mce-formitem').each(function() {
				$(this).css('top', parseInt( $(this).css('top'), 10) + 25);
			});
			
			//update character count on keyup
			$novashare_tweet.keyup(function() {
				var char_count = get_char_count();
				$('#novashare_tweet_length').html(char_count + ' ' + novashare.translations.ctt.body.charcount);
				$('#novashare_tweet_length').removeClass();
				if(char_count < 0) {
					$('#novashare_tweet_length').addClass('novashare_tweet_length_negative');
				}
			});

			//update username length if removed
			$('#novashare_ctt_remove_username').click( function() {
				if($(this).attr('aria-checked') == "true") {
					username_length = (novashare.twitter_username.length + 6);
				} else {
					username_length = 0;
				}
				$novashare_tweet.trigger('keyup');
			});

			//update url length if removed
			$('#novashare_ctt_remove_url').click( function() {
				if($(this).attr('aria-checked') == "true") {
					url_length = 24
				}
				else {
					url_length = 0;
				}
				$novashare_tweet.trigger('keyup');
			});

			//return calculated character count
			function get_char_count() {
				return initial_char_count - username_length - url_length - $novashare_tweet.val().replace(/(<([^>]+)>)/ig, "").length;
			}
		});
	});
})(jQuery);