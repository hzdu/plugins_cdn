//pinterest image block attributes
(function() {

	//setup constants
	const el = wp.element.createElement;
	const { useSelect } = wp.data;
	const { __ } = wp.i18n;
	
	//register block attributes for existing image block
	function novashareRegisterImageBlockAttributes(settings, name) {

		//disregard if not an image block
		if(name !== 'core/image') {
			return settings;
		}

		//add pinterest attributes to existing attributes
		settings.attributes = Object.assign(settings.attributes, {
			novasharePinTitle : {
				attribute : 'data-pin-title',
				type 	  : 'string',
				selector  : 'img',
				source    : 'attribute',
				default   : ''
			},
			novasharePinDescription : {
				attribute : 'data-pin-description',
				type 	  : 'string',
				selector  : 'img',
				source    : 'attribute',
				default   : ''
			},
			novasharePinRepinID : {
				attribute : 'data-pin-id',
				type 	  : 'string',
				selector  : 'img',
				source	  : 'attribute',
				default   : ''
			},
			novasharePinNoPin : {
				attribute : 'data-pin-nopin',
				type  	  : 'boolean',
				selector  : 'img',
				source    : 'attribute',
				default   : ''
			},
			novasharePinImageID : {
				type      : 'number',
				default   : 0
			},
			novasharePinImageURL : {
				type      : 'string',
				default   : ''
			}
		});

		//extend raw <img> HTML transformation
		settings.transforms.from[0] = lodash.merge(settings.transforms.from[0], {
			schema: {
				figure: {
					children: {
						a: {
							children: {
								img: {
									attributes: ['src', 'alt', 'data-pin-title', 'data-pin-description', 'data-pin-id', 'data-pin-nopin', 'data-pin-media']
								}
							}
						},
						img: {
							attributes: ['src', 'alt', 'data-pin-title', 'data-pin-description', 'data-pin-id', 'data-pin-nopin', 'data-pin-media']
						}
					}
				}
			}
		});

		return settings;
	}
	wp.hooks.addFilter('blocks.registerBlockType', 'novashare/image', novashareRegisterImageBlockAttributes);

	var newClientIDs = [];

	//register inspector controls for existing image block
	var novashareRegisterImageBlockInspectorControls = wp.compose.createHigherOrderComponent(function(BlockEdit) {

		return function(props) {

			//disregard if not an image block
			if(props.name !== 'core/image') {
				return el(BlockEdit, props);
			}

			//check existing attributes
			if(typeof props.attributes.id == 'undefined') {

				if(newClientIDs.indexOf(props.clientId ) === -1) {
					newClientIDs.push(props.clientId);
				}

				return el(BlockEdit, props);
			}

			//set attributes from attachment if we need to
			if(newClientIDs.indexOf(props.clientId) !== -1) {

				var attachment = wp.media.attachment(props.attributes.id);

				props.setAttributes({
					novasharePinTitle : attachment.get('novashare_pin_title'),
					novasharePinDescription : attachment.get('novashare_pin_description'),
					novasharePinRepinID : attachment.get('novashare_pin_repin_id'),
					novasharePinNoPin : attachment.get('novashare_pin_nopin') == '1' ? 1 : 0
				});

				newClientIDs.splice(newClientIDs.indexOf(props.clientId), 1);
			}

			//populate hidden image array
			const novasharePinImage = useSelect((select) => {

				if(!props.attributes.novasharePinImageID) {
					return null;
				}

				var media = select('core').getMedia(props.attributes.novasharePinImageID);

				if(!media) {
					return null;
				}

				return {
		       		id: media.id,
              		title: media.title,
              		url: media.source_url,
              		thumbnail: media.media_details.sizes.thumbnail.source_url
				};
			});

			return el(wp.element.Fragment, {},
				el(BlockEdit, props),
				el(wp.blockEditor.InspectorControls, {},

					//novashare panel section
					el(wp.components.PanelBody, {title : 'Novashare'},

						//depcrated
						el('div', {style: {display: (() => {
							return (!novashare.show_deprecated ? 'none' : '');
						})()}},

							//pin title
							el(wp.components.TextControl, {
								value    : props.attributes.novasharePinTitle,
								label    : __('Pin Title', 'novashare') + ' (' + __('Deprecated', 'novashare') + ')',
								onChange : function( new_value ) {
									props.setAttributes({novasharePinTitle : new_value});
								}
							}),
						),

						//pin description
						el(wp.components.TextareaControl, {
							value    : props.attributes.novasharePinDescription,
							label    : __('Pin Description', 'novashare'),
							onChange : function (new_value) {
								props.setAttributes({novasharePinDescription : new_value});
							}
						}),

						//pin repin id
						el(wp.components.TextControl, {
							value    : props.attributes.novasharePinRepinID,
							label    : __('Pin Repin ID', 'novashare'),
							onChange : function(new_value) {
								props.setAttributes({novasharePinRepinID : new_value});
							}
						}),

						//disable pinning
						el(wp.components.ToggleControl, {
							checked  : props.attributes.novasharePinNoPin,
							label    : __('Disable Pinning', 'novashare'),
							onChange : function(new_value) {
								props.setAttributes({novasharePinNoPin : new_value});
							}
						}),

						//pin image
						el('div', {style: {marginBottom: '8px'}}, 
							__('Pin Image', 'novashare')
						),
						el(wp.blockEditor.MediaUpload, {

							render : function({open}) {

								var pinImage = props.attributes.novasharePinImageDetails ? props.attributes.novasharePinImageDetails : novasharePinImage;

								if(!pinImage) {
									return el(wp.components.Button, {
										text    : __('Upload Image', 'novashare'),
										className : 'editor-post-featured-image__toggle',
										onClick : open
									});
								}
								else {
									return el(wp.element.Fragment, {},
										el('div', {style : {border : '1px solid #f0f0f0', textAlign: 'center', borderRadius: '2px', marginBottom: '10px'}},
											el(wp.components.ResponsiveWrapper, {naturalWidth: 0, naturalHeight : 150}, 
												el('img', {
													src : pinImage.thumbnail,
													style: {width: 'auto', margin: '0px auto', maxHeight: '150px'}
												}),
											),
										),
										el(wp.components.Button, {
											text    : __('Replace Image', 'novashare'),
											className : 'is-secondary',
											onClick : open

										}),
										el(wp.components.Button, {
											text    : __('Remove image', 'novashare'),
											className : 'is-link is-destructive',
											style: {display: 'block', margin: '1em 0px 0px'},
											onClick : function() {
												props.setAttributes({
													novasharePinImageID : undefined,
													novasharePinImageURL : undefined,
													novasharePinImageDetails : undefined
												});
											}
										})
									);
								}
							},
							onSelect : function(media) {
				              	props.setAttributes({
				              		novasharePinImageID: media.id,
				              		novasharePinImageURL: media.url,
				                	novasharePinImageDetails: {
				                		id: media.id,
				                  		title: media.title,
				                  		filename: media.filename,
				                  		url: media.url,
				                  		thumbnail: media.sizes.thumbnail.url
				                	}
				              	});
				            }
						})
					)
				)
			);
		}
	});
	wp.hooks.addFilter('editor.BlockEdit', 'novashare/image', novashareRegisterImageBlockInspectorControls);

	//save our custom image block attributes when saving existing image block
	function novashareSaveImageBlockAttributes(element, blockType, attributes) {

		//disregard if not an image block
		if(blockType.name !== 'core/image') {
			return element;
		}

		var pinData = [];

		//build array of data that needs saving
		if(!lodash.isEmpty(attributes.novasharePinTitle)) {
			pinData.push({
				attribute : 'data-pin-title',
				value     : attributes.novasharePinTitle
			});
		}

		if(!lodash.isEmpty(attributes.novasharePinDescription)) {
			pinData.push({
				attribute : 'data-pin-description',
				value     : attributes.novasharePinDescription
			});
		}

		if(!lodash.isEmpty(attributes.novasharePinRepinID)) {
			pinData.push({
				attribute : 'data-pin-id',
				value     : attributes.novasharePinRepinID
			});
		}

		if(attributes.novasharePinNoPin) {
			pinData.push({
				attribute : 'data-pin-nopin',
				value     : 'true'
			});
		}

		if(!lodash.isEmpty(attributes.novasharePinImageURL)) {
			pinData.push({
				attribute : 'data-pin-media',
				value     : attributes.novasharePinImageURL
			});
		}

		//return original element if no custom data is present
		if(lodash.isEmpty(pinData)) {
			return element;
		}

		//convert element to string
		var elementString = wp.element.renderToString(element);

		//loop through our custom input data
		for(index in pinData) {

			var attribute = pinData[index]['attribute'];
			var value = pinData[index]['value'].replace(/\"/g, '').replace(/</g, '').replace(/>/g, '').replace(/&/g, '&amp;');

			//make sure the attribute doesn't already exist in the element
			if(elementString.indexOf(attribute) !== -1) {
				continue;
			}

			//add attribute/value data to image tag
			elementString = elementString.replace('<img ', '<img ' + attribute + '="' + value + '" ');
		}

		return el(wp.element.RawHTML, {}, elementString);
	}
	wp.hooks.addFilter('blocks.getSaveElement', 'novashare/image', novashareSaveImageBlockAttributes, 50);
})();