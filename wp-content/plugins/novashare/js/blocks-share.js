(function(blocks, element, blockEditor, components) {

	//setup constants
	const el = element.createElement;
	const { registerBlockType } = blocks; 
	const { InspectorControls, useBlockProps, useInnerBlocksProps, __experimentalColorGradientControl } = blockEditor;
	const { Fragment, useEffect } = element;
	const { BaseControl, TextControl, ToggleControl, PanelBody, Icon, RangeControl, Button, ButtonGroup, Dropdown, SelectControl, ColorIndicator, FlexItem, __experimentalHStack } = components;
	const { __ } = wp.i18n;

	//swap button colors on hover in editor
	const hoverSwap = (event) => {
		var container = event.target.closest('.ns-buttons');
		if(container) {
			var inverseHover = container.classList.contains('ns-inverse-hover');
			var buttonHoverColor = container.getAttribute('data-button-hover-color');
		 	var iconHoverColor = container.getAttribute('data-icon-hover-color');
		 	var block = event.target.closest('.ns-button');
		 	var iconBlock = block.querySelector('.ns-button-icon');
		 	var labelWrapper = block.querySelector('.ns-button-label-wrapper');

	 		if(event.type == 'mouseover') {

	 			block.setAttribute('data-button-color', block.style.getPropertyValue('--ns-button-color'));
	 			if(buttonHoverColor) {
	 				block.style.setProperty('--ns-button-color', buttonHoverColor);
	 			}

	 			if(inverseHover) {
	 				inverseHoverSwap(block);
	 				return;
	 			}
	 			
	 			iconBlock.setAttribute('data-icon-color', iconBlock.style.color);
	 			iconBlock.style.color = iconHoverColor || iconBlock.style.color;
	 			labelWrapper.style.color = iconHoverColor || iconBlock.style.color;
	 		}
	 		else if(event.type == 'mouseout') {

	 			block.style.setProperty('--ns-button-color', block.getAttribute('data-button-color'));

	 			if(inverseHover) {
	 				inverseHoverSwap(block);
	 				return;
	 			}
	 			
	 			iconBlock.style.color = iconBlock.getAttribute('data-icon-color');
	 			labelWrapper.style.color = iconBlock.getAttribute('data-icon-color');
	 		}
		}

		function inverseHoverSwap(block) {
			block.classList.contains('ns-hover-swap') ? block.classList.remove('ns-hover-swap') : block.classList.add('ns-hover-swap');
			var iconBorderBlocks = block.querySelectorAll('.ns-button-icon.ns-border');
			(iconBorderBlocks.length ? iconBorderBlocks : block.querySelectorAll('.ns-button-block')).forEach(function (e) {
				e.classList.contains("ns-inverse") ? e.classList.remove("ns-inverse") : e.classList.add("ns-inverse");
			});
		}
	}

	var variations = [];
	var networkIcons = [];

	//setup variations
	Object.keys(novashare.networks.share).forEach(function(key) {
		const network = novashare.networks.share[key];
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

 	//register share block
	registerBlockType('novashare/share', {
		apiVersion: 2,
		title: __("Share Buttons", 'novashare'),
		description: __("Add share buttons for your social network profiles.", 'novashare'),
		category: 'widgets',
		icon: 'share',
		keywords: ["share", "buttons", "novashare"],
		supports: {
        	html: false
        },
		attributes: {
			id: {
				type: 'string'
			},
			buttonStyle: {
				type: 'string'
			},
			buttonLayout: {
				type: 'string'
			},
			alignment: {
				type: 'string',
				default: ''
			},
			buttonSize: {
				type: 'string',
				default: ''
			},
			buttonShape: {
				type: 'string',
				default: ''
			},
			buttonMargin: {
				type: 'number'
			},
			showLabels: {
				type: 'boolean'
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
			inverseHover: {
				type: 'boolean'
			},
			mobileBreakpoint: {
				type: 'number'
			},
			hideAboveBreakpoint: {
				type: 'boolean'
			},
			hideBelowBreakpoint: {
				type: 'boolean'
			},
			totalShareCount: {
				type: 'boolean'
			},
			totalShareCountPosition: {
				type: 'string',
				default: ''
			},
			totalShareCountColor: {
				type: 'string'
			},
			networkShareCounts: {
				type: 'boolean'
			},
			ctaText: {
				type: 'string'
			},
			ctaSize: {
				type: 'number'
			},
			ctaColor: {
				type: 'string'
			},
			styleClasses: {
				type: 'object',
				default: {
					containerClass: '',
					buttonClass: '',
					iconClass: '',
					labelClass: ''
				}
			}
		},
		providesContext: {
			'buttonStyle': 'buttonStyle',
			'buttonLayout': 'buttonLayout',
        	'buttonShape': 'buttonShape',
        	'buttonMargin': 'buttonMargin',
        	'buttonSize': 'buttonSize',
        	'showLabels': 'showLabels',
        	'buttonColor': 'buttonColor',
        	'iconColor': 'iconColor',
        	'buttonHoverColor': 'buttonHoverColor',
        	'iconHoverColor': 'iconHoverColor',
        	'inverseHover' : 'inverseHover',
        	'networkShareCounts': 'networkShareCounts',
        	'styleClasses': 'styleClasses'
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

	  		useEffect(() => {  

	  			const styleClasses = (() => {

					var containerClass = '', shapeClass, buttonClass, iconClass = '', labelClass = '';

					//build container class
					if(props.attributes.buttonLayout) {
						containerClass+= " ns-columns ns-" + props.attributes.buttonLayout;
					}
					if(props.attributes.buttonSize) {
						containerClass+= " " + props.attributes.buttonSize;
					}
					if(props.attributes.totalShareCount) {
						containerClass+= " ns-has-total-share-count-";
						containerClass+= props.attributes.totalShareCountPosition ? props.attributes.totalShareCountPosition : 'after';
					}
					if(props.attributes.inverseHover) {
						containerClass+= " ns-inverse-hover";
					}

					shapeClass = props.attributes.buttonShape ? ' ns-' + props.attributes.buttonShape : '';
					
					if(props.attributes.buttonStyle) {
						if(props.attributes.buttonStyle == 'inverse') {
							buttonClass = " ns-inverse";
							iconClass+= " ns-inverse ns-border" + shapeClass;
							labelClass+= " ns-inverse";
						}
						else if(props.attributes.buttonStyle == 'solid-inverse-border') {
							buttonClass = " ns-inverse" + shapeClass;
							labelClass+= " ns-border ns-inverse";
						}
						else if(props.attributes.buttonStyle == 'full-inverse-border') {
							buttonClass = " ns-inverse ns-border" + shapeClass;
							iconClass+= " ns-inverse";
							labelClass+= " ns-inverse";
						}
						else if(props.attributes.buttonStyle == 'solid-inverse') {
							buttonClass = " ns-inverse";
							iconClass+= shapeClass;
							labelClass+= " ns-inverse";
						}
						else if(props.attributes.buttonStyle == 'full-inverse') {
							buttonClass = " ns-inverse" + shapeClass;
							iconClass+= " ns-inverse";
							labelClass+= " ns-inverse";
						}
					}
					else {
						buttonClass = shapeClass;
					}

					if(!props.attributes.showLabels) {
						labelClass+= ' ns-hide';
					}

					return {
						'containerClass' : containerClass,
						'buttonClass': buttonClass,
						'iconClass': iconClass,
						'labelClass': labelClass
					};

				})();

	  			props.setAttributes({
	  				styleClasses: styleClasses
	  			})

	  		}, [
	  			props.attributes.buttonStyle, 
	  			props.attributes.buttonLayout, 
	  			props.attributes.buttonSize, 
	  			props.attributes.buttonShape, 
	  			props.attributes.showLabels, 
	  			props.attributes.inverseHover,
	  			props.attributes.totalShareCount, 
	  			props.attributes.totalShareCountPosition
	  		]);

			const blockProps = useBlockProps({
				className: 'ns-buttons ns-block-' + props.attributes.id + props.attributes.styleClasses.containerClass, 
				style: { width: '100%' }
			});

	        const innerBlocksProps = useInnerBlocksProps(blockProps, {
	            allowedBlocks: ['novashare/share-network'],
	            orientation: 'horizontal',
	            placeholder: (() => {

	            	if(!props.isSelected) {
	            		return el('div', {
							style: {
								display: 'flex',
								alignItems: 'center'
							}},
							el(Icon, {
								icon: 'share', 
								style: {
									marginRight: '5px'
								}
							}),
							__('Share Buttons', 'novashare')
						);
	            	}
	            	else {
	            		return el("span", {}, __('Add Networks', 'novashare'));
	            	}

	            })()
	            
	        });

	        const nsColorPicker = (props, attribute, label) => {

		        return el(Dropdown, {
		        	className: 'ns-color-picker',
					style: { display: 'block' },
					popoverProps: { 
						placement: 'top-left'
					},
					renderToggle: ({isOpen, onToggle}) => el(Button, {
						style: { width: '100%' },
				    	onClick: onToggle,
				    	"aria-expanded": isOpen,
				  		}, 
					  	el(__experimentalHStack, { alignment: 'left' },

							el(ColorIndicator, { 
								style: { background: props.attributes[attribute] }
							}),

							el(FlexItem, {}, label)
						)
					),
					renderContent: () => el('div', {
						className: 'ns-color-popover',
						style: { padding: '8px', width: '244px' }
						},
						el(__experimentalColorGradientControl, {
					  		colorValue: props.attributes[attribute],
						  	onColorChange: newValue => props.setAttributes({
					    		[attribute]: newValue
						  	}),
						  	disableCustomGradients: true
						})
					)
				});
		    }

			const nsTotalShareCountOutput = (props) => {
				if(props.attributes.totalShareCount) {
					return el('div', {className: 'ns-total-share-count', style: {color: props.attributes.totalShareCountColor}},
						el('div', {className: 'ns-total-share-count-wrapper'},
							el('div', {className: 'ns-total-share-count-details'},
								el('div', {className: 'ns-total-share-count-amount'}, '#'),
								el('div', {className: 'ns-total-share-count-text'}, __('SHARES', 'novashare'))
							)
						)
					)
				}
			}

			return (
				el(Fragment, {},

					//sidebar block controls
					el(InspectorControls, {},
						el(PanelBody, { title: __('Settings', 'novashare'), className: 'novashare-block-settings', initialOpen: true },

							//button style
							el(SelectControl, { 
								label: __('Button Style', 'novashare'),
								value: props.attributes.buttonStyle,
							    onChange: (value) => {
									props.setAttributes({ buttonStyle: value });
								},
							    options: [{
								    value: '',
								    label: __('Solid', 'novashare')
								}, {
								    value: 'inverse',
								    label: __('Inverse', 'novashare')
								}, {
								    value: 'solid-inverse-border',
								    label: __('Bordered Label', 'novashare')
								}, {
								    value: 'full-inverse-border',
								    label: __('Bordered Button', 'novashare')
								}, {
								    value: 'solid-inverse',
								    label: __('Minimal Label', 'novashare')
								}, {
								    value: 'full-inverse',
								    label: __('Minimal', 'novashare')
								}],
							}),

							//button layout
							el(SelectControl, { 
								label: __('Button Layout', 'novashare'),
								value: props.attributes.buttonLayout,
							    onChange: (value) => {
									props.setAttributes({ buttonLayout: value });
								},
							    options: [{
								    value: '',
								    label: __('Auto Width', 'novashare')
								}, {
								    value: '1-col',
								    label: __('1 Column', 'novashare')
								}, {
								    value: '2-col',
								    label: __('2 Columns', 'novashare')
								}, {
								    value: '3-col',
								    label: __('3 Columns', 'novashare')
								}, {
								    value: '4-col',
								    label: __('4 Columns', 'novashare')
								}, {
								    value: '5-col',
								    label: __('5 Columns', 'novashare')
								}, {
								    value: '6-col',
								    label: __('6 Columns', 'novashare')
								}],
							}),

							//alignment
							(() => {
								if(!props.attributes.buttonLayout) {
									return el(BaseControl, { label: __('Alignment', 'novashare') },
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
									);
								}
							})(),

							//button size
							el(BaseControl, { label: __('Button Size', 'novashare') },
								el(ButtonGroup, { style: { display: 'flex' } },
									el(Button, {
										variant: 'secondary', 
										isPressed: (() => { return (props.attributes.buttonSize == 'small' ? true : false) })(),
										onClick: (event) => { props.setAttributes({ buttonSize: event.target.value }) },
										value: 'small',
										style: { display: 'inline-flex', flexGrow: '1', justifyContent: 'center' }
									},__('Small', 'novashare')),
									el(Button, {
										variant: 'secondary', 
										isPressed: (() => { return (props.attributes.buttonSize == '' ? true : false) })(),
										onClick: (event) => { props.setAttributes({ buttonSize: event.target.value }) },
										value: '',
										style: { display: 'inline-flex', flexGrow: '1', justifyContent: 'center' }
									}, __('Medium', 'novashare')),
									el(Button, {
										variant: 'secondary', 
										isPressed: (() => { return (props.attributes.buttonSize == 'large' ? true : false) })(),
										onClick: (event) => { props.setAttributes({ buttonSize: event.target.value }) },
										value: 'large',
										style: { display: 'inline-flex', flexGrow: '1', justifyContent: 'center' }
									}, __('Large', 'novashare'))
								)
							),

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

							//show labels
							el(ToggleControl, {
								label: __('Show Labels', 'novashare'),
								onChange: (value) => {
									props.setAttributes({ showLabels: value });
								},
								checked: props.attributes.showLabels
							}),

							//colors
							el(BaseControl, {
								label: __('Colors', 'novashare')
								},
								nsColorPicker(props, 'buttonColor', __('Button Color', 'novashare')),
								nsColorPicker(props, 'buttonHoverColor', __('Button Hover Color', 'novashare')),								
								(() => {return !props.attributes.inverseHover ? nsColorPicker(props, 'iconColor', __('Icon Color', 'novashare')) : ''})(),
								(() => {return !props.attributes.inverseHover ? nsColorPicker(props, 'iconHoverColor', __('Icon Hover Color', 'novashare')) : ''})()
							),

							//inverse on hover
							el(ToggleControl, {
								label: __('Inverse on Hover', 'novashare'),
								onChange: (value) => {
									props.setAttributes({ inverseHover: value });
								},
								checked: props.attributes.inverseHover
							}),
						),

						//display settings
						el(PanelBody, { title: __('Display', 'novashare'), className: '', initialOpen: false },

							//mobile breakpoint
							el(RangeControl, {
								label: __('Mobile Breakpoint', 'novashare'),
								onChange: (value) => {
									props.setAttributes({ mobileBreakpoint: value });
								},
								value: props.attributes.mobileBreakpoint,
								min: 400,
								max: 2000,
								initialPosition: 1200
							}),

							//hide above breakpoint
							el(ToggleControl, {
								label: __('Hide Above Breakpoint', 'novashare'),
								onChange: (value) => {
									props.setAttributes({ hideAboveBreakpoint: value });
								},
								checked: props.attributes.hideAboveBreakpoint
							}),

							//hide below breakpoint
							el(ToggleControl, {
								label: __('Hide Below Breakpoint', 'novashare'),
								onChange: (value) => {
									props.setAttributes({ hideBelowBreakpoint: value });
								},
								checked: props.attributes.hideBelowBreakpoint
							}),
						),

						el(PanelBody, { title: __('Share Counts', 'novashare'), className: '', initialOpen: false },

							//total share count
							el(ToggleControl, {
								label: __('Total Share Count', 'novashare'),
								onChange: (value) => {
									props.setAttributes({ totalShareCount: value });
								},
								checked: props.attributes.totalShareCount
							}),

							//total share count options
							(() => {
								if(props.attributes.totalShareCount) {
									return el(Fragment, {},
										el(BaseControl, { label: __('Total Share Count Position', 'novashare') },
											el(ButtonGroup, { style: { display: 'flex'} },
												el(Button, {
													variant: 'secondary', 
													isPressed: (() => { return (props.attributes.totalShareCountPosition == 'before' ? true : false) })(),
													onClick: (event) => { props.setAttributes({ totalShareCountPosition: event.target.value }) },
													value: 'before',
													style: { display: 'inline-flex', flexGrow: '1' }
												}, __('Before', 'novashare')),
												el(Button, {
													variant: 'secondary', 
													isPressed: (() => { return (props.attributes.totalShareCountPosition == '' ? true : false) })(),
													onClick: (event) => { props.setAttributes({ totalShareCountPosition: event.target.value }) },
													value: '',
													style: { display: 'inline-flex', flexGrow: '1' }
												}, __('After', 'novashare'))
											)
										),
										el(BaseControl, { label: __('Color', 'novashare')},
											nsColorPicker(props, 'totalShareCountColor', __('Total Share Count Color', 'novashare'))
										)
									);
								}
							})(),

							//network share counts
							el(ToggleControl, {
								label: __('Network Share Counts', 'novashare'),
								onChange: (value) => {
									props.setAttributes({ networkShareCounts: value });
								},
								checked: props.attributes.networkShareCounts
							}),
						),

						//call to action
						el(PanelBody, { title: __('Call to Action', 'novashare'), className: '', initialOpen: false },

							//text
							el(TextControl, { 
								label: __('Text', 'novashare'),
								value: props.attributes.ctaText,
							    onChange: (value) => {
									props.setAttributes({ ctaText: value });
								}
							}),

							//size
							el(RangeControl, {
								label: __('Font Size', 'novashare'),
								onChange: (value) => {
									props.setAttributes({ ctaSize: value });
								},
								value: props.attributes.ctaSize,
								min: 1,
								max: 100,
								initialPosition: 20
							}),

							//color
							el(BaseControl, {
								label: __('Color', 'novashare')

								},
								nsColorPicker(props, 'ctaColor', __('Font Color', 'novashare'))
							)
						)
					),

					el("div", innerBlocksProps, 
						el('div', { 
							className: 'ns-inline-cta', 
							style: {
								fontSize: (props.attributes.ctaSize ?? 20) + 'px',
								color: props.attributes.ctaColor,
								textAlign: props.attributes.alignment
							}}, 
							props.attributes.ctaText
						),

						el("div", {
								className: 'ns-buttons-wrapper' + (props.attributes.alignment && !props.attributes.buttonLayout ? ' ns-align-' + props.attributes.alignment : ''),
								style: {
									gap: (props.attributes.buttonMargin ?? 10) + 'px'
								}
							},

							(() => {
								if(props.attributes.totalShareCountPosition) {
									return nsTotalShareCountOutput(props);
								}
							})(),

							innerBlocksProps.children,

							(() => {
								if(!props.attributes.totalShareCountPosition) {
									return nsTotalShareCountOutput(props);
								}
							})(),		
						)
					)
				)
			);
		}),

		//save block
		save: function(props) {
			const block = useInnerBlocksProps.save(useBlockProps.save());
			return block.children;
		}
	});

	//register share network block
	registerBlockType('novashare/share-network', {
		apiVersion: 2,
	 	title: __('Follow Network', 'novashare'),
	 	description: __('Add an icon linking to a social network profile.', 'novashare'),
		parent: [ 'novashare/share' ],
		supports: { reusable: false, html: false },
		attributes: { 
			network: { type: "string" },
			styleClasses: { type: "object" }
		},
	  	usesContext: ['buttonStyle', 'buttonLayout', 'buttonShape', 'buttonMargin', 'buttonSize', 'showLabels', 'buttonColor', 'iconColor', 'buttonHoverColor', 'iconHoverColor', 'inverseHover', 'networkShareCounts', 'styleClasses'],

		edit: function(props) {

	  		useEffect(() => {  
	  			props.setAttributes({
	  				styleClasses: props.context.styleClasses
	  			})
	  		}, [props.context.styleClasses]);

	  		const networkShareCounts = props.context.networkShareCounts && ['twitter','facebook','pinterest','buffer','reddit','tumblr','vkontakte','yummly'].includes(props.attributes.network);

	 		return (

				el(Fragment, {},

					//print block in editor
					el('a', (useBlockProps)({
						onMouseOver: hoverSwap, 
						onMouseOut: hoverSwap,
						className: props.attributes.network + ' ns-button' + (() => { return networkShareCounts ? ' ns-share-count' : ''; })(), 
						style: {
							margin: '0',
							'--ns-button-color': props.context.buttonColor,
							textDecoration: 'none',
							flexBasis: (() => {
								if(props.context.buttonLayout && (props.context.buttonMargin || props.context.buttonMargin == 0)) {
									var columns = props.context.buttonLayout.replace(/[^0-9]/g, '');
									return 'calc(' + (100/columns).toFixed(6) + '% - ' + ((columns-1)*props.context.buttonMargin)/columns + 'px)';
								}
							})()
						}}),
						el('span', { className: 'ns-button-wrapper ns-button-block' + props.context.styleClasses.buttonClass },
							el('span', { 
								className: 'ns-button-icon ns-button-block' + props.context.styleClasses.iconClass, 
								style: { 
									color: (() => {return !props.context.inverseHover ? props.context.iconColor : ''})(),
									width: !props.context.showLabels ? '100%' : ''
								}},
							    networkIcons[props.attributes.network],
							    (() => {
							    	if(networkShareCounts) {
							    		return el('span', {className: 'ns-button-share-count'}, '#');
							    	}
							    })()
							),
							el('span', {
								className: 'ns-button-label ns-button-block' + props.context.styleClasses.labelClass,
								},
								el('span', {
									className: 'ns-button-label-wrapper',
									style: {
										color: (() => {return !props.context.inverseHover ? props.context.iconColor : ''})()
									}
									}, 
									novashare.networks.share[props.attributes.network].name
								)
							)
						)
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