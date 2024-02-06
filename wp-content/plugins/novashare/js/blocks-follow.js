(function(blocks, element, blockEditor, components) {

	//setup constants
	const el = element.createElement;
	const { registerBlockType } = blocks; 
	const { InspectorControls, InnerBlocks, useBlockProps, useInnerBlocksProps, PanelColorSettings } = blockEditor;
	const { Fragment, useState } = element;
	const { TextControl, ToggleControl, Panel, PanelBody, PanelRow, ColorPicker, Icon, RangeControl, Button, ButtonGroup, BaseControl, Popover, __experimentalInputControl } = components;
	const { __ } = wp.i18n;

	//swap button colors on hover in editor
	const hoverSwap = (event) => {
		var wrapper = event.target.closest('.ns-buttons-wrapper');
		if(wrapper) {
			var buttonHoverColor = wrapper.getAttribute('data-button-hover-color');
		 	var iconHoverColor = wrapper.getAttribute('data-icon-hover-color');
		 	var blocks = event.target.querySelectorAll('.ns-button-wrapper .ns-button-block');

		 	blocks.forEach(function(block) {
		 		if(event.type == 'mouseover') {
		 			block.setAttribute('data-button-color', block.style.backgroundColor);
		 			block.setAttribute('data-icon-color', block.style.color);
		 			block.style.backgroundColor = buttonHoverColor || block.style.backgroundColor;
		 			block.style.color = iconHoverColor || block.style.color;
		 		}
		 		else if(event.type == 'mouseout') {
		 			block.style.backgroundColor = block.getAttribute('data-button-color');
		 			block.style.color = block.getAttribute('data-icon-color');
		 		}
		 	});
		}
	}
 
 	//register follow block
	registerBlockType('novashare/follow', {
		apiVersion: 2,
		title: __("Follow Buttons", 'novashare'),
		description: __("Add follow buttons for your social network profiles.", 'novashare'),
		category: 'widgets',
		icon: 'share-alt2',
		keywords: ["follow", "buttons", "novashare"],
		supports: {
        	html: false
        },
		attributes: {
			id: {
				type: 'string'
			},
			buttonShape: {
				type: 'string'
			},
			alignment: {
				type: 'string'
			},
			buttonSize: {
				type: 'number'
			},
			buttonMargin: {
				type: 'number'
			},
			newTab: {
				type: 'boolean',
			},
			buttonColor: {
				type: 'string'
			},
			iconColor: {
				type: 'string'
			},
			buttonHoverColor: {
				type: 'string'
			},
			iconHoverColor: {
				type: 'string'
			},
		},
		providesContext: {
        	'buttonShape': 'buttonShape',
        	'buttonSize': 'buttonSize',
        	'newTab': 'newTab',
        	'buttonColor': 'buttonColor',
        	'iconColor': 'iconColor',
        	'buttonHoverColor': 'buttonHoverColor',
        	'iconHoverColor': 'iconHoverColor',
    	},

    	//add hover data attributes to wrapper
    	getEditWrapperProps(attributes) {
	    	return {
	      		'data-button-hover-color': attributes.buttonHoverColor,
		      	'data-icon-hover-color': attributes.iconHoverColor
		    };
		},

		edit: (function(props) {

			props.setAttributes({
	  			id: props.clientId
	  		});

			const blockProps = useBlockProps({
				className: 'ns-buttons-wrapper' + (props.attributes.alignment ? ' ns-align-' + props.attributes.alignment : ''),
				style: {
					gap: (props.attributes.buttonMargin ?? 10) + 'px'
				}
			});

			const followPlaceholder = el('div', {
				style: {
					display: 'flex',
					alignItems: 'center'
				}},
				el(Icon, {
					icon: 'share-alt2', 
					style: {
						marginRight: '5px'
					}
				}),
				__('Follow Buttons', 'novashare')
			);

  			const selectedFollowPlaceholder = el("span", {}, __('Add Networks', 'novashare')); 

	        const innerBlocksProps = useInnerBlocksProps(blockProps, {
	            allowedBlocks: ['novashare/follow-network'],
	            orientation: 'horizontal',
	            placeholder: props.isSelected ? selectedFollowPlaceholder : followPlaceholder,
	        });

			return (
				el(Fragment, {},

					//sidebar block controls
					el(InspectorControls, {},
						el(PanelBody, { title: __('Settings', 'novashare'), className: 'novashare-block-settings', initialOpen: true },

							//button shape
							el(BaseControl, { label: __('Button Shape', 'novashare') },
								el(ButtonGroup, { style: { display: 'flex' } },
									el(Button, {
										variant: 'secondary', 
										isPressed: (() => { return (props.attributes.buttonShape == '' ? true : false) })(),
										onClick: (event) => { props.setAttributes({ buttonShape: event.target.value }) },
										value: '',
										style: { display: 'inline-flex', flexGrow: '1', justifyContent: 'center' }
									},__('Squared', 'novashare')),
									el(Button, {
										variant: 'secondary', 
										isPressed: (() => { return (props.attributes.buttonShape == 'rounded' ? true : false) })(),
										onClick: (event) => { props.setAttributes({ buttonShape: event.target.value }) },
										value: 'rounded',
										style: { display: 'inline-flex', flexGrow: '1', justifyContent: 'center' }
									}, __('Rounded', 'novashare')),
									el(Button, {
										variant: 'secondary', 
										isPressed: (() => { return (props.attributes.buttonShape == 'circular' ? true : false) })(),
										onClick: (event) => { props.setAttributes({ buttonShape: event.target.value }) },
										value: 'circular',
										style: { display: 'inline-flex', flexGrow: '1', justifyContent: 'center' }
									}, __('Circular', 'novashare'))
								)
							),

							//alignment
							el(BaseControl, { label: __('Alignment', 'novashare') },
								el(ButtonGroup, { style: { display: 'flex'} },
									el(Button, {
										variant: 'secondary', 
										isPressed: (() => { return (props.attributes.alignment == '' ? true : false) })(),
										onClick: (event) => { props.setAttributes({ alignment: event.target.value }) },
										value: '',
										icon: el(Icon, { icon: 'align-left', style: { pointerEvents: 'none' } }),
										style: { display: 'inline-flex', flexGrow: '1' }
									}),
									el(Button, {
										variant: 'secondary', 
										isPressed: (() => { return (props.attributes.alignment == 'center' ? true : false) })(),
										onClick: (event) => { props.setAttributes({ alignment: event.target.value }) },
										value: 'center',
										icon: el(Icon, { icon: 'align-center', style: { pointerEvents: 'none' } }),
										style: { display: 'inline-flex', flexGrow: '1' }
									}),
									el(Button, {
										variant: 'secondary', 
										isPressed: (() => { return (props.attributes.alignment == 'right' ? true : false) })(),
										onClick: (event) => { props.setAttributes({ alignment: event.target.value }) },
										value: 'right',
										icon: el(Icon, { icon: 'align-right', style: { pointerEvents: 'none' } }),
										style: { display: 'inline-flex', flexGrow: '1' }
									})
								)
							),

							//button size
							el(RangeControl, {
								label: __('Button Size', 'novashare'),
								onChange: (value) => {
									props.setAttributes({ buttonSize: value });
								},
								value: props.attributes.buttonSize,
								min: 10,
								max: 100,
								initialPosition: 50
							}),

							//button margin
							el(RangeControl, {
								label: __('Button Margin', 'novashare'),
								onChange: (value) => {
									props.setAttributes({ buttonMargin: value });
								},
								value: props.attributes.buttonMargin,
								min: 0,
								max: 20,
								initialPosition: 10
							}),

							//new tab
							el(ToggleControl, {
								label: __('Open Links in New Tab', 'novashare'),
								onChange: (value) => {
									props.setAttributes({ newTab: value });
								},
								checked: props.attributes.newTab
							}),
						),

						//colors
						el(PanelColorSettings, {
							title: __('Colors', 'novashare'),
							colorSettings: [
								{
									value: props.attributes.buttonColor,
									onChange: (color) => props.setAttributes({ buttonColor: color }),
									label: __('Button Color', 'novashare')
								},
								{
									value: props.attributes.buttonHoverColor,
									onChange: (color) => props.setAttributes({ buttonHoverColor: color }),
									label: __('Button Hover Color', 'novashare')
								},
								{
									value: props.attributes.iconColor,
									onChange: (color) => props.setAttributes({ iconColor: color }),
									label: __('Icon Color', 'novashare')
								},
								{
									value: props.attributes.iconHoverColor,
									onChange: (color) => props.setAttributes({ iconHoverColor: color }),
									label: __('Icon Hover Color', 'novashare')
								}
							]
						}),
					),

					//print block in editor
					el('div', { className: 'ns-buttons ns-block-' + props.attributes.id, style: { width: '100%' } },
						el("div", innerBlocksProps, innerBlocksProps.children)
					),
				)
			);
		}),

		//save block
		save: function(props) {
            return (
            	el("div", {className: 'ns-buttons ns-block-' + props.attributes.id},
            		el("div", useInnerBlocksProps.save(useBlockProps.save({className: 'ns-buttons-wrapper'  + (props.attributes.alignment ? ' ns-align-' + props.attributes.alignment : '')})))
            	)
            );
		}
	});

	var variations = [];
	var networkIcons = [];

	//setup variations
	Object.keys(novashare.networks.follow).forEach(function(key) {
		const network = novashare.networks.follow[key];
		var iconParts = network.icon.match(/viewBox="(.*?)".*?d="(.*?)"/);
        var networkIcon = el('svg', { 
				fill: 'currentColor',
				viewBox: iconParts[1]
			},
			el( 'path', { 
				d: iconParts[2]
				}
			)
		);

    	variations.push({
			isDefault: key === 'facebook' ? true : false,
        	name: key,
			title: network.name,
			icon: networkIcon,
		    attributes: {
		    	network: key,
		    	icon: networkIcon
		    }
	    });

	    networkIcons[key] = networkIcon;
	});

	variations.forEach((variation) => {
		if(variation.isActive) {
			return;
		} 
		variation.isActive = (blockAttributes, variationAttributes) => blockAttributes.network === variationAttributes.network;
	});

	//register follow network block
	registerBlockType('novashare/follow-network', {
		apiVersion: 2,
	 	title: __('Follow Network', 'novashare'),
	 	description: __('Add an icon linking to a social network profile.', 'novashare'),
		parent: [ 'novashare/follow' ],
		supports: { reusable: false, html: false },
		attributes: { 
			network: { type: "string" },
			buttonShape: { type: "string" },
			newTab: { type: "boolean" },
			link: { type: "string" },
			customSVG: { type: "string" },
			buttonColor: { type: "string" },
		},
	  	usesContext: ['buttonShape', 'buttonSize', 'newTab', 'buttonColor', 'iconColor', 'buttonHoverColor', 'iconHoverColor'],

		edit: function(props) {

	  		props.setAttributes({
	  			buttonShape: props.context['buttonShape'],
	  			newTab: props.context['newTab']
	  		});

	  		const [showPopover, setShowPopover] = useState(false);
			const toggleVisible = () => {
				setShowPopover(true);
			};

	  		const networkLinkPopover = () => {
				return showPopover && el(Popover, {
						placement: "bottom-right",
						onClose: () => setShowPopover(false) 
					},
					el("form", {
				        className: "block-editor-url-popover__link-editor",
				        onSubmit: (e) => {
				            e.preventDefault(), setShowPopover(false);
				        }},
				    	el(__experimentalInputControl, { 
				    		isPressEnterToChange: true,
				    		style: { width: '300px', height: '36px' },
				    		value: props.attributes.link, 
				    		onChange: (value) => {
				    			props.setAttributes({ link: value });
				    			setShowPopover(false);
				    		}, 
				    		placeholder: (() => {
								switch(props.attributes.network) {
							  		case 'email':
								    	return 'email@example.com or https://';
								    	break;
								  	case 'phone':
								    	return '(123)-456-7890';
							   	 		break;
							   	 	case 'messenger':
								    	return 'mypagename';
							   	 		break;
						   	 		case 'skype':
								    	return 'myusername';
							   	 		break;
						   	 		case 'line':
								    	return 'mylineid';
							   	 		break;
						   	 		case '':
								    	return '';
							   	 		break;
								  	default:
								   		return 'https://';
								}
					  		})(),
				    	}),
					    el(Button, { 
					    	icon: 'editor-break',
					    	label: __("Apply", 'novashare'),
					    	type: "submit",
					    	onClick: () => { 
					    		setShowPopover(false);
					    	}
					    })
					)
            	);
			};

	 		return (
				el(Fragment, {},

					(() => { 

						if(props.attributes.network !== 'custom') {
							return;
						}

						return el(InspectorControls, {},
							el(PanelBody, { title: __('Settings', 'novashare'), className: 'novashare-block-settings', initialOpen: true },

								//new tab
								el(TextControl, {
									label: __('Icon SVG HTML', 'novashare'),
									onChange: (value) => {
										props.setAttributes({ customSVG: value });
									},
									value: props.attributes.customSVG,
									placeholder: '<svg>...</svg>'
								}),
							),

							//colors
							el(PanelColorSettings, {
								title: __('Colors', 'novashare'),
								colorSettings: [
									{
										value: props.attributes.buttonColor,
										onChange: (color) => props.setAttributes({ buttonColor: color }),
										label: __('Button Color', 'novashare')
									}
								]
							})
						)
					})(),

					//print block in editor
					el('a', (useBlockProps)({
						onMouseOver: hoverSwap, 
						onMouseOut: hoverSwap,
						onClick: () => { 
					        toggleVisible(true);
					    },
						className: props.attributes.network + ' ns-button ns-follow-button', 
						style: {
							margin: '0',
							textDecoration: 'none',
							width: props.context['buttonSize'],
							height: props.context['buttonSize'],
							minWidth: props.context['buttonSize']
						}}),
						el('span', { className: 'ns-button-wrapper ns-button-block' + (props.context['buttonShape'] ? ' ns-' + props.context['buttonShape'] : '') },
							el('span', { 
								className: 'ns-button-icon ns-button-block', 
								style: { 
									backgroundColor: (() => {
										if(props.context['buttonColor']) {
											return props.context['buttonColor'];
										}
										if(props.attributes.buttonColor) {
											return props.attributes.buttonColor;
										}
									})(), 
									color: props.context['iconColor'],
									width: props.context['buttonSize'],
									height: props.context['buttonSize'],
									minWidth: props.context['buttonSize']
								}},
								(() => {
									if(props.attributes.customSVG && props.attributes.customSVG !== '') {
										var iconViewBox = props.attributes.customSVG.match(/viewBox="(.*?)"/);
										var iconPaths = props.attributes.customSVG.matchAll(/d="(.*?)"/g);

										if(iconViewBox && iconPaths) {

									        var customIcon = el('svg', { 
													fill: 'currentColor',
													viewBox: iconViewBox[1]
												},
												(() => {
													var paths = [];
													for(const match of iconPaths) {
													  	paths.push(el('path', { 
															d: match[1]
														}));
													}
													return paths;
							
												})()
											);
											return customIcon;
										}
									}
									return networkIcons[props.attributes.network];
								})()
							),
						),
						el(networkLinkPopover)
					)
				)
			);
	 	},
	 	variations
	});
})(
	window.wp.blocks,
	window.wp.element,
	window.wp.blockEditor,
	window.wp.components,
);