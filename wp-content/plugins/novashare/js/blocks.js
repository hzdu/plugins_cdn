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
	const defaultAccentColor = settings.click_to_tweet.accent_color && settings.click_to_tweet.accent_color !== '' ? settings.click_to_tweet.accent_color : '#00abf0'

	//twitter svg icon
	const iconTwitter = el('svg', { 
			width: 20, 
			height: 20,
			fill: 'currentColor',
			viewBox: '0 0 512 512'
		},
		el( 'path', { 
			d: "M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" 
			}
		)
	);
 
 	//register click to tweet block
	registerBlockType('novashare/click-to-tweet', {
		title: __("Click to Tweet", 'novashare'),
		description: __("Add a tweet box.", 'novashare'),
		category: 'widgets',
		icon: iconTwitter,
		keywords: ["Twitter", "Tweet", "Novashare"],

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
				default: settings.click_to_tweet.remove_url ? true : false
			},
			remove_username: {
				type: 'boolean',
				default: settings.click_to_tweet.remove_username ? true : false
			},
			hide_hashtags: {
				type: 'boolean',
				default: settings.click_to_tweet.hide_hashtags ? true : false
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
		 
			return (
				el(Fragment, {},

					//sidebar block controls
					el(InspectorControls, {},
						el(PanelBody, { title: __('Settings', 'novashare'), className: 'novashare-block-settings', initialOpen: true },

							//theme
							el(SelectControl, {
								label: __('Theme', 'novashare'),
								options : [
									{ label: __('Default (Accent Background)', 'novashare'), value: '' },
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
							} else if(novashare.click_to_tweet.theme) {
								extra_classes+= ' ns-ctt-' + novashare.click_to_tweet.theme;
							}
							
							//cta position container class
							if(props.attributes.cta_position) {
								extra_classes+= ' ns-ctt-cta-' + props.attributes.cta_position;
							} else if(novashare.click_to_tweet.cta_position) {
								extra_classes+= ' ns-ctt-cta-' + novashare.click_to_tweet.cta_position;
							}

							return extra_classes;

						})(), 
						style: {
							backgroundColor: (() => {
								if(!props.attributes.theme && !novashare.click_to_tweet.theme) {
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
										if(props.attributes.theme || novashare.click_to_tweet.theme) {
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
										} else if(novashare.click_to_tweet.cta_text) {
											return novashare.click_to_tweet.cta_text;
										} else {
											return "Click to Tweet";
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