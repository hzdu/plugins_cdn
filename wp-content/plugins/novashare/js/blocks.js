(function(blocks, element, blockEditor, components, data) {

	//grab plugin settings
	const settings = novashare;

	//setup constants
	const el = element.createElement;
	const { registerBlockType } = blocks; 
	const { RichText, InspectorControls } = blockEditor;
	const { Fragment } = element;
	const { SelectControl, TextControl, ToggleControl, Panel, PanelBody, PanelRow, ColorPicker } = components;
	const { withSelect } = wp.data;
	const { __ } = wp.i18n;
	const defaultAccentColor = settings.click_to_tweet?.accent_color && settings.click_to_tweet.accent_color !== '' ? settings.click_to_tweet.accent_color : '#000'

	//twitter svg icon
	const iconTwitter = el('svg', { 
			width: 20, 
			height: 20,
			fill: 'currentColor',
			viewBox: '0 0 512 512'
		},
		el( 'path', { 
			d: "M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" 
			}
		)
	);
 
 	//register click to tweet block
	registerBlockType('novashare/click-to-tweet', {
		title: __("Click to Post", 'novashare'),
		description: __("Add an X post box.", 'novashare'),
		category: 'widgets',
		icon: iconTwitter,
		keywords: ["X", "Twitter", "Tweet", "Novashare"],

		//UI attributes
		attributes: {
			theme: {
				type: 'string'
			},
			tweet: {
				type: 'string'
			},
			cta_text: {
				type: 'string'
			},
			cta_position: {
				type: 'string'
			},
			remove_url: {
				type: 'boolean',
				default: settings.click_to_tweet?.remove_url ? true : false
			},
			remove_username: {
				type: 'boolean',
				default: settings.click_to_tweet?.remove_username ? true : false
			},
			hide_hashtags: {
				type: 'boolean',
				default: settings.click_to_tweet?.hide_hashtags ? true : false
			},
			accent_color: {
				type: 'string',
				default: defaultAccentColor
			}
		},

		//react edit state
		edit: withSelect(function(select) {
			return {
				permalink: select('core/editor').getPermalink()
			};
		})(function(props) {

			//global variables
			var count_status;
			var chars_remaining;
			var defaultTheme = (!props.attributes.theme && !novashare.click_to_tweet?.theme) || props.attributes.theme == 'default' ? true : false;
		 
			return (
				el(Fragment, {},

					//sidebar block controls
					el(InspectorControls, {},
						el(PanelBody, { title: __('Settings', 'novashare'), className: 'novashare-block-settings', initialOpen: true },

							//theme
							el(SelectControl, {
								label: __('Theme', 'novashare'),
								options : [
									{ label: __('Global', 'novashare'), value: '' },
									{ label: __('Default (Accent Background)', 'novashare'), value: 'default' },
									{ label: __('Simple (Transparent Background)', 'novashare'), value: 'simple' },
									{ label: __('Simple Alternate (Gray Background)', 'novashare'), value: 'simple-alt' },
								],
								onChange: (value) => {
									props.setAttributes({ theme: value });
								},
								value: props.attributes.theme
							}),
	 
							//call to action text
							el(TextControl, {
								label: __('Call to Action Text', 'novashare'),
								onChange: (value) => {
									props.setAttributes({ cta_text: value });
								},
								value: props.attributes.cta_text
							}),

							//call to action position
							el(SelectControl, {
								label: __('Call to Action Position', 'novashare'),
								options : [
									{ label: __('Global', 'novashare'), value: '' },
									{ label: __('Right (Default)', 'novashare'), value: '' },
									{ label: __('Left', 'novashare'), value: 'left' },
								],
								onChange: (value) => {
									props.setAttributes({ cta_position: value });
								},
								value: props.attributes.cta_position
							}),
	 
							//remove url
							el(ToggleControl, {
								label: __('Remove URL', 'novashare'),
								onChange: (value) => {
									props.setAttributes({ remove_url: value });
								},
								checked: props.attributes.remove_url,
							}),

							//remove username
							el(ToggleControl, {
								label: __('Remove Username', 'novashare'),
								onChange: (value) => {
									props.setAttributes({ remove_username: value });
								},
								checked: props.attributes.remove_username,
							}),

							//hide hashtags
							el(ToggleControl, {
								label: __('Hide Hashtags', 'novashare'),
								onChange: (value) => {
									props.setAttributes({ hide_hashtags: value });
								},
								checked: props.attributes.hide_hashtags,
							}),

							//accent color
							el(ColorPicker, {
								label: __('Accent Color', 'novashare'),
								onChangeComplete: (value) => {
									if(value.source == 'hex' && value.hex == '') {
										props.setAttributes({ accent_color: '' });
									}
									else {
										props.setAttributes({ accent_color: value.hex });
									}
								},
								color: props.attributes.accent_color && props.attributes.accent_color  !== '' ? props.attributes.accent_color : defaultAccentColor,
								disableAlpha: true,
							}),
						)
					),

					//print block in editor
					el('div', {
						className: props.className + (() => {

							var extra_classes = '';

							extra_classes+= ' ns-ctt';

							//theme container class
							if(props.attributes.theme) {
								extra_classes+= ' ns-ctt-' + props.attributes.theme;
							} else if(novashare.click_to_tweet?.theme) {
								extra_classes+= ' ns-ctt-' + novashare.click_to_tweet.theme;
							}
							
							//cta position container class
							if(props.attributes.cta_position) {
								extra_classes+= ' ns-ctt-cta-' + props.attributes.cta_position;
							} else if(novashare.click_to_tweet?.cta_position) {
								extra_classes+= ' ns-ctt-cta-' + novashare.click_to_tweet.cta_position;
							}

							return extra_classes;

						})(), 
						style: {
							backgroundColor: (() => {
								if(defaultTheme) {
									return props.attributes.accent_color;
								}
							})(),
							borderColor: (() => {
								return props.attributes.accent_color;
							})(),
						}			
					},

						//editable tweet
						el('div', { className: 'ns-ctt-tweet' },
							el(RichText, {
								format: 'string',
								onChange: (value) => {
									props.setAttributes({ tweet: value });
								},
								value: props.attributes.tweet,
								allowedFormats: []
							})
						),

						//tweet cta container
						el('div', { className: 'ns-ctt-cta-container' },
							el('span', { className: 'ns-ctt-cta',
								style: {
									color: (() => {
										if(!defaultTheme) {
											return props.attributes.accent_color;
										}
									})(),
								}
							},

								//cta text
								el('span', { className: 'ns-ctt-cta-text' },
									(() => {
										if(props.attributes.cta_text) {
											return props.attributes.cta_text;
										} else if(novashare.click_to_tweet?.cta_text) {
											return novashare.click_to_tweet.cta_text;
										} else {
											return "Click to Post";
										}
									})()
								),

								//cta icon
								el('span', { className: 'ns-ctt-cta-icon' }, 
									(() => {
										return iconTwitter;
									})()
								)
							)
						)
					),

					//characters remaining
					el('div', { className: 'ns-ctt-char-count' },

						//calculate character count
						(() => {

							//max character count
							var initial_char_count = 280;

							//calculate section lengths
							var username_length = (novashare.twitter_username && props.attributes.remove_username != true) ? (novashare.twitter_username.length + 6) : 0;
							var url_length = (props.permalink && props.attributes.remove_url != true) ? 24 : 0;
							var tweet_length = (props.attributes.tweet) ? props.attributes.tweet.replace(/(<([^>]+)>)/ig, "").length : 0;
							
							//calculate remaining characters
							chars_remaining = initial_char_count - username_length - url_length - tweet_length;

							//container class based on +/- status
							count_status = (chars_remaining >= 0) ? 'ns-ctt-positive' : 'ns-ctt-negative';
						})(),

						//print finished character count
						el('span', { className: count_status }, 
							(() => {
								return chars_remaining + " " + __("Characters Remaining", 'novashare');
							})()
						)
					)
				)
			);
		}),

		//no need to save anything since we are using PHP to render on the front end
		save: function(props) {
			return null;
		}
	});
})(
	window.wp.blocks,
	window.wp.element,
	window.wp.blockEditor,
	window.wp.components,
	window.wp.data
);