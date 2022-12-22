/*
 LCweb toolkit to dynamically create blocks
 
 @author: Luca Montanari (LCweb)
 @version: 1.2.2  
*/


(function($) { 
	"use strict";


	// transform an array into gutenberg dropdown options
	var array_to_dd_opts = function(array) {
		var to_return = [];
		
		$.each(array, function(i, v) {
			to_return.push({value: i, label: v});
		});
		
		return to_return;
	};
	
	
		
		
	
	/* register the block into Gutenberg
	 * args: object of required data 
	 	{
			block_id, (string - eg. lcweb/media-grid)
			title, (string)
			description, (string - optional - by default is "by LCweb"),
			category, (string - by default is "common")
			panels, (array - optional - field panels) 
			icon, (SVG react element - optional but suggested)
			keywords, (array - optional)
			structure, (array derived from PHP)
			attributes, (array of shortcode attributes and default values)
			on_display_callback (string representing the function name to recall after data editing - passes the block temp ID - optional)
		}
	*/ 		
	window.lc_register_block = function(args) {
		
		var createElement 		= wp.element.createElement, //React.createElement
			__ 					= wp.i18n.__; //translation functions
		
		
		// defaults for optional indexes
		var defaults = {
			description	: __('by LCweb'),
			category	:  __('common'),
			panels		: [],
			icon		: '',
			keywords	: [],
			on_display_callback : false,
		};
		args = $.extend(defaults, args);
		

		
		wp.blocks.registerBlockType(args.block_id, {
		
			title		: args.title,
			description	: args.description,
			category	: args.category,
			icon		: args.icon,
			keywords	: args.keywords,
			
			attributes	: args.attributes,
			
			// display 
			edit : function(props) {
				//console.log(props.attributes); // debug
				
				var attributes		= props.attributes,
					setAttributes 	= props.setAttributes,
					blockId 		= props.clientId;
				
				// dynamically create controls from defaults
				var has_panels = false;
				var lc_controls = [];
				
				$.each(args.structure, function(key, val) {
					
					// eventualy create panel controls array 	
					if(typeof(val.panel) != 'undefined' && val.panel && typeof(lc_controls[ val.panel ]) == 'undefined') {
						lc_controls[ val.panel ] = [];	
					}
	
					// common object structure
					var obj = {
						value: (attributes[key]) ? attributes[key] : val.default,
						label: val.label,
                        type: 'string',
						onChange: function(e) {
							
							var attrs = {}; 
							attrs[key] = (val.lc_type == 'number' && isNaN(parseInt(e, 10))) ? -1 : e; 
							props.setAttributes(attrs);
						}
					};


					// conditional field?
					if(typeof(val.condition) != 'undefined') {
						var to_be_shown = false;
						
						$.each(val.condition, function(cond_key, data) {	
							if(
								(data[0] == '=' && $.inArray(attributes[cond_key], data[1]) !== -1) ||
								(data[0] == '!=' && $.inArray(attributes[cond_key], data[1]) === -1) ||
								(data[0] == '>' && parseFloat(attributes[cond_key]) > data[1]) ||
								(data[0] == '<' && parseFloat(attributes[cond_key]) < data[1])
							) {
								to_be_shown = true;	
							}
						});
						
						if(!to_be_shown) {
							return true;
						}
					}


					// control type
					switch(val.lc_type) {
						
						case 'text' :
							var type = wp.components.TextControl;
							break;
							
						case 'number' :
							var type = wp.components.TextControl;
							
							obj.value = parseInt(obj.value, 10);
							
							obj.type= 'number';
							obj.min = val.min;
							obj.max = val.max;
							break;	
						
						case 'checkbox' :
							var type = wp.components.ToggleControl;
							obj.checked = attributes[key];
							break;
							
						case 'multi-opt' :

							var mo_opts = [];
							
							// print checkboxes
							$.each(val.opts, function(opt_key, opt_label) {
								var sel_arr = (typeof(attributes[key]) != 'string') ? [] : attributes[key].split(',');
								
								var cb_obj = {
									name	: key,
									value	: opt_key,
									label 	: opt_label,
									checked	: ($.inArray(opt_key, sel_arr) !== -1) ? true : false,
								
									onChange : function(e) {
										var sel = [];
										$('[name='+ key +']').each(function() {
											if($(this).is(':checked')) {
												sel.push( $(this).val() );	
											}
										});
										
										var attrs = {};
										attrs[key] = sel.join(','); 
										props.setAttributes(attrs);
									}
								};
							
								mo_opts.push(createElement(wp.components.CheckboxControl, cb_obj));  
							});
						
							// custom CSS to compress opts 
							if(!$('#lc_multiopt_block_style').length) {
								$('head').append('<style id="lc_multiopt_block_style">.lc_multiopt_block .components-base-control {margin: 0 !important;}</style>');	
							}

							// wrapping label
							var multi_opt_block = createElement(wp.components.BaseControl, {
								label : val.label,
								className: 'lc_multiopt_block' 
							}, mo_opts);
							
							(typeof(val.panel) == 'undefined' || !val.panel) ? lc_controls.push(multi_opt_block) : lc_controls[ val.panel ].push(multi_opt_block);
							return true;
							break;		
							
						case 'textarea' :
							var type = wp.components.TextareaControl;
							break;	
		
						case 'slider' :
							var type = wp.components.RangeControl;
							obj.min = val.min;
							obj.max = val.max;
							break;
						
						case 'colorpicker' :
							
							// have to create a label for this...! -_-
							var colorpicker_label = createElement(wp.components.BaseControl, {
								label : val.label
							});
							(typeof(val.panel) == 'undefined' || !val.panel) ? lc_controls.push(colorpicker_label) : lc_controls[ val.panel ].push(colorpicker_label);
	
							var type = wp.components.ColorPicker;
							obj.disableAlpha = true;
							break;
						
						case 'warning' :
							var type = wp.components.SandBox;
							obj = {
								html : 
									'<div style="border-left: 4px solid #f0b849; background-color: #fef8ee; padding: 8px 10px;">' +
										'<p style="font-family: sans-serif; font-size: 13px; color: #191e23; line-height: 21px; margin: 0;">'+ val.html +'</p>'+
									'</div>' +
									'<div style="height: 20px;"></div>'	
							};
							break;
						
						case 'select' :
						default :
							var type = wp.components.SelectControl;  
							obj.options = array_to_dd_opts(val.opts)
							break;
					}
					
					
					if(typeof(val.help) != 'undefined') {
						obj.help = val.help;		
					}
					
					
					
					// no belongs to a panel - enqueue directly
					if(typeof(val.panel) == 'undefined' || !val.panel) {
						lc_controls.push( createElement(type, obj) );	
					} 
					else {
						has_panels = true;	
						lc_controls[ val.panel ].push( createElement(type, obj) );
					}
				});
		
		
		
				// are there panels? - manage existing array 
				if(has_panels) {
					var temp_controls = lc_controls;
					lc_controls = [];
					
					$.each(args.panels, function(key, data) {
						lc_controls.push(
							createElement(wp.components.PanelBody, {
								title 		: data.title,
								initialOpen	: data.opened	
							}, temp_controls[key]
							
							)
						);
					});	
				}
				
				

				
				// Display block preview and UI
				return [
					
					//Preview a block with a PHP render callback
					createElement( wp.components.ServerSideRender, {
						block		: args.block_id,
						attributes	: attributes,
						onChange	: setTimeout(function() {
							if(args.on_display_callback) {
								window[args.on_display_callback](blockId);	
							}
						}, 250)
					}),
					
					
					// Block inspector
					createElement( wp.editor.InspectorControls, {}, lc_controls),
				]
			},
			
			save : function() {
				return null;
			}
		});
		
	};
	
	
})(jQuery); 