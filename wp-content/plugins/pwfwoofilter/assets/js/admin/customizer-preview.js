(function( $ ) {
	"use strict";

	function addStyleText( id, cssStyle ) {
		if ( $('#'+id).length > 0 ) {
			$('#'+id).remove();
		}

		let addStyle = '<style type="text/css" id="' + id + '">' + cssStyle + '</style>';
		$('head').append(addStyle);
	}
	/**
	 * Start general options
	 */
	wp.customize( 'pwf_style[filter_bg]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-woo-filter').css( 'background-color', newval );
		} );
	});

	/**
	 * Item title
	 */
	wp.customize( 'pwf_style[title_color]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-field-item-title,.pwf-field-item-title .pwf-toggle').css( 'color', newval );
		});
	});
	wp.customize( 'pwf_style[title_font_size]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-field-item-title,.pwf-field-item-title .pwf-toggle::before').css( 'font-size', newval + 'px' );
			let addStyle = '.pwf-field-item-title, .pwf-field-item-title .pwf-toggle::before{ font-size:' + newval + 'px;}';
			let id = 'pwf_title_font_size';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[title_font_weight]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-field-item-title,.pwf-field-item-title .pwf-toggle').css( 'font-weight', newval );
		});
	});
	wp.customize( 'pwf_style[title_margin_bottom]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-field-item-title').css( 'margin-bottom', newval + 'px' );
		});
	});
	wp.customize( 'pwf_style[title_border_status]', function( value ) {
		value.bind( function( newval ) {
		});
	});
	wp.customize( 'pwf_style[title_padding_bottom]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-field-item-title').css( 'padding-bottom', newval + 'px' );
		} );
	});

	wp.customize( 'pwf_style[title_border_color]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-field-item-title').css( 'border-bottom-style', 'solid' );
			$('.pwf-field-item-title').css( 'border-bottom-color', newval );
		});
	});

	wp.customize( 'pwf_style[title_border_width]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-field-item-title').css( 'border-bottom-width', newval + 'px' );
		} );
	});

	/**
	 * Active product Filters
	 */
	 wp.customize( 'pwf_style[af_font_size]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-note-item').css( 'font-size', newval + 'px' );
		});
	});
	wp.customize( 'pwf_style[af_line_height]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-note-item').css( 'line-height', newval + 'px' );
		});
	});
	wp.customize( 'pwf_style[af_border_width]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-note-item').css( 'border-width', newval + 'px' );
		});
	});
	wp.customize( 'pwf_style[af_border_radius]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-note-item').css( 'border-radius', newval + 'px' );
		});
	});
	wp.customize( 'pwf_style[af_text_color]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = '.pwf-icon-remove::before{ background-color:' + newval + ';}';
			addStyle    += '.pwf-note-item{ color:"' + newval + ';}'
			let id = 'pwf_af_text_color';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[af_bg_color]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = '.pwf-note-item{ background-color:' + newval + ';}';
			let id = 'pwf_af_bg_color';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[af_border_color]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = '.pwf-note-item{ border-color:' + newval + ';}';
			let id = 'pwf_af_border_color';
			addStyleText( id, addStyle );
		});
	});

	wp.customize( 'pwf_style[af_text_hover_color]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = '.pwf-note-item:hover{ color:' + newval + ';}';
			let id = 'pwf_af_text_hover_color';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[af_bg_hover_color]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = '.pwf-note-item:hover{ background-color:' + newval + ';}';
			let id = 'pwf_af_bg_hover_color';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[af_border_hover_color]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = '.pwf-note-item:hover{ border-color:' + newval + ';}';
			let id = 'pwf_af_border_hover_color';
			addStyleText( id, addStyle );
		});
	});
	
	/**
	 * Boxlist
	 */
	let boxlistLabelSelector = '.pwf-field-item-boxlist .pwf-item-label .pwf-title-container .text-title';
	wp.customize( 'pwf_style[boxlist_font_size]', function( value ) {
		value.bind( function( newval ) {
			$(boxlistLabelSelector).css( 'font-size', newval + 'px' );
		});
	});
	wp.customize( 'pwf_style[boxlist_font_weight]', function( value ) {
		value.bind( function( newval ) {
			$(boxlistLabelSelector).css( 'font-weight', newval );
		});
	});
	wp.customize( 'pwf_style[boxlist_border_width]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-boxlist-item').css( 'border-width', newval + 'px' );
		});
	});
	wp.customize( 'pwf_style[boxlist_border_radius]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-boxlist-item').css( 'border-radius', newval + 'px' );
		});
	});
	wp.customize( 'pwf_style[boxlist_margin]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-boxlist-item').css({ 'margin-right': newval + 'px', 'margin-top': newval + 'px' });
		});
	});
	wp.customize( 'pwf_style[boxlist_text_color]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = boxlistLabelSelector + '{ border-color:' + newval + ';}';
			let id = 'pwf_boxlist_text_color';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[boxlist_text_hover_color]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = '.pwf-boxlist-item.selected .pwf-item-label .pwf-title-container .text-title,.pwf-boxlist-item:hover .pwf-item-label .pwf-title-container .text-title { color:' + newval+ ';}';
			let id = 'pwf_boxlist_text_hover_color';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[boxlist_bg_color]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = '.pwf-boxlist-item{ background-color:' + newval + ';}';
			let id = 'pwf_boxlist_bg_color';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[boxlist_bg_hover_color]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = '.pwf-boxlist-item.selected, .pwf-boxlist-item:hover { background-color:' + newval+ ';}';
			let id = 'pwf_boxlist_bg_hover_color';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[boxlist_border_color]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = '.pwf-boxlist-item{ border-color:' + newval + ';}';
			let id = 'pwf_boxlist_border_color';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[boxlist_border_hover_color]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-boxlist-item.selected, .pwf-boxlist-item:hover').css( 'border-color', newval );
			let addStyle = ".pwf-boxlist-item.selected, .pwf-boxlist-item:hover { border-color:" + newval+ ";} ";
			let id = 'pwf_boxlist_border_hover_color';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[boxlist_count_font_size]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-boxlist-item .pwf-product-counts').css( 'font-size', newval + 'px' );
		} );
	});
	wp.customize( 'pwf_style[boxlist_count_font_weight]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-boxlist-item .pwf-product-counts').css( 'font-weight', newval );
		} );
	});
	wp.customize( 'pwf_style[boxlist_count_text_color]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = '.pwf-boxlist-item .pwf-product-counts{ color:' + newval + ';}';
			let id = 'pwf_boxlist_count_text_color';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[boxlist_count_text_hover_color]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = '.pwf-boxlist-item.selected .pwf-product-counts, .pwf-boxlist-item:hover .pwf-product-counts { color:' + newval+ ';}';
			let id = 'pwf_boxlist_border_hover_color';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[boxlist_count_bg_color]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = '.pwf-boxlist-item .pwf-product-counts{ background-color:' + newval + ';}';
			let id = 'pwf_boxlist_count_bg_color';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[boxlist_count_hover_bg_color]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = '.pwf-boxlist-item.selected .pwf-product-counts, .pwf-boxlist-item:hover .pwf-product-counts { background-color:' + newval+ ';}';
			let id = 'pwf_boxlist_count_hover_bg_color';
			addStyleText( id, addStyle );
		});
	});

	/**
	 * Button
	 */
	 wp.customize( 'pwf_style[button_font_size]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-field-item-button .pwf-item-button').css( 'font-size', newval + 'px' );
		});
	});
	wp.customize( 'pwf_style[button_font_weight]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-field-item-button .pwf-item-button').css( 'font-weight', newval );
		});
	});
	wp.customize( 'pwf_style[button_border_radius]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-field-item-button .pwf-item-button').css( 'border-radius', newval + 'px' );
		});
	});
	wp.customize( 'pwf_style[button_color]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = '.pwf-field-item-button .pwf-item-button{ color:' + newval+ ';}';
			let id = 'pwf_button_color';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[button_bg_color]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = '.pwf-field-item-button .pwf-item-button{ background-color:' + newval+ ';}';
			let id = 'pwf_button_bg_color';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[button_border_color]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = '.pwf-field-item-button .pwf-item-button{ border-color:' + newval+ ';}';
			let id = 'pwf_button_border_color';
			addStyleText( id, addStyle );
		});
	});
	
	wp.customize( 'pwf_style[button_hover_color]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = '.pwf-field-item-button .pwf-item-button:hover{ color:' + newval + ';}';
			let id = 'pwf_button_hover_color';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[button_bg_hover_color]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = '.pwf-field-item-button .pwf-item-button:hover{ background-color:' + newval + ';}';
			let id = 'pwf_button_bg_hover_color';
			addStyleText( id, addStyle );
		} );
	});
	wp.customize( 'pwf_style[button_border_hover_color]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = '.pwf-field-item-button .pwf-item-button:hover{ border-color:' + newval + ';}';
			let id = 'pwf_button_border_hover_color';
			addStyleText( id, addStyle );
		});
	});

	/**
	 * Color List
	 */
	 wp.customize( 'pwf_style[colorlist_margin]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-colorlist-item').css({ 'margin-right': newval + 'px', 'margin-top': newval + 'px' });
		});
	});
	wp.customize( 'pwf_style[colorlist_count_font_size]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-field-item-colorlist .pwf-product-counts, .pwf-field-item-colorlist.pwf-rounded .pwf-product-counts').css( 'font-size', newval + 'px' );
		} );
	});
	wp.customize( 'pwf_style[colorlist_count_font_weight]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-field-item-colorlist .pwf-product-counts').css( 'font-weight', newval );
		} );
	});
	wp.customize( 'pwf_style[colorlist_count_text_color]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-field-item-colorlist .pwf-product-counts').css( 'color', newval );
		});
	});
	wp.customize( 'pwf_style[colorlist_count_bg_color]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-field-item-colorlist .pwf-product-counts').css( 'background-color', newval );
		});
	});

	/**
	 * Range slider
	 */
	 wp.customize( 'pwf_style[slider_line_height]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-field-item .noUi-horizontal]').css( 'height', newval + 'px' );
		});
	});
	wp.customize( 'pwf_style[slider_handle_width]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-field-item .noUi-horizontal .noUi-handle').css( 'width', newval + 'px' );
		});
	});
	wp.customize( 'pwf_style[slider_handle_height]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-field-item .noUi-horizontal .noUi-handle').css( 'height', newval + 'px' );
		});
	});
	wp.customize( 'pwf_style[slider_handle_top]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-field-item .noUi-handle').css( 'top', newval + 'px' );
		});
	});
	wp.customize( 'pwf_style[slider_handle_border_width]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-field-item .noUi-handle').css( 'border-width', newval + 'px' );
		});
	});
	wp.customize( 'pwf_style[slider_handle_border_radius]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-field-item .noUi-handle').css( 'border-radius', newval + '%' );
		});
	});
	wp.customize( 'pwf_style[slider_handle_bg_color]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-field-item .noUi-connect, .pwf-field-item .noUi-origin, .pwf-field-item .noUi-handle').css( 'background-color', newval );
		});
	});
	wp.customize( 'pwf_style[slider_handle_border_color]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-field-item .noUi-handle').css( 'border-color', newval );
		});
	});
	wp.customize( 'pwf_style[slider_label_color]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-range-slider-labels').css( 'color', newval );
		});
	});

	/**
	 * Search
	 */
	 wp.customize( 'pwf_style[search_icon_color]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-search-icon').css( 'color', newval );
			$('.pwf-search-icon::before').css( 'background-color', newval );
		});
	});

	/**
	 * Select
	 */
	let selectSelectors = '#sidebar .pwf-field-item-dropdownlist select,';
	selectSelectors    += '.pwf-field-item-dropdownlist .select2-container--default .select2-selection--single,';
	selectSelectors    += '.woocommerce-page .sidebar .pwf-field-item-dropdownlist select,';
	selectSelectors    += '.pwf-field-item-dropdownlist select,';
	selectSelectors    += '.select2-container--default .select2-selection--multiple li,';
	selectSelectors    += '.select2-container--default .select2-selection--multiple .select2-selection__choice__remove';
	wp.customize( 'pwf_style[select_font_size]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = selectSelectors + '{ font-size:' + newval + 'px;}';
			addStyle    += '.pwf-field-item-dropdownlist .pwf-select::after{ font-size:' + newval + 'px;}';
			let id = 'pwf_select_font_size';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[select_font_weight]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = selectSelectors + '{ font-weight:' + newval + ';}';
			addStyle    += '.pwf-field-item-dropdownlist .pwf-select::after{ font-weight:' + newval + ';}';
			let id = 'pwf_select_font_weight';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[select_height]', function( value ) {
		value.bind( function( newval ) {
			let xselectSelectors = '#sidebar .pwf-field-item-dropdownlist select,';
			xselectSelectors    += '.woocommerce-page .sidebar .pwf-field-item-dropdownlist select,';
			xselectSelectors    += '.pwf-field-item-dropdownlist select';
			let addStyle = xselectSelectors + '{ line-height:' + newval + 'px; height:' + newval + 'px; min-height:' + newval + 'px;}';
			addStyle    += '.pwf-field-item-dropdownlist .select2-container .select2-selection--multiple{ min-height:' + newval + 'px;}';
			let id = 'pwf_select_height';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[select_color]', function( value ) {
		value.bind( function( newval ) {
			let colorSelector = '#sidebar .pwf-field-item-dropdownlist select, .pwf-field-item-dropdownlist .select2-container--default .select2-selection--single, .pwf-field-item-dropdownlist .select2-container--default .select2-selection--single .select2-selection__rendered, .pwf-field-item-dropdownlist select, .pwf-field-item-dropdownlist .pwf-select::after, .pwf-field-item-dropdownlist .select2-container--default .select2-selection--multiple li, #sidebar .pwf-field-item-dropdownlist .select2-container--default .select2-selection--multiple li';
			let addStyle = colorSelector + '{ color:' + newval + ';}';
			addStyle    += '.pwf-field-item-dropdownlist .pwf-select::after{ color:' + newval + ';}';
			let id = 'pwf_select_color';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[select_border_color]', function( value ) {
		value.bind( function( newval ) {
			let borderSelectors = '#sidebar .pwf-field-item-dropdownlist select, .pwf-field-item-dropdownlist .select2-container--default .select2-selection--single, .pwf-field-item-dropdownlist .select2-container--default .select2-selection--multiple, .pwf-field-item-dropdownlist select, .select2-container--open .pwf-customize-select2';
			let addStyle = borderSelectors + '{ border-color:' + newval + ';}';
			let id = 'pwf_select_border_color';
			addStyleText( id, addStyle );
		});
	});
	
	/**
	 * Text input
	 */
	let inputSelectors = '.pwf-price-slider-min-max-inputs input,.pwf-date-field input[type="text"],.woocommerce .pwf-date-field input[type="text"],.pwf-price-slider-min-max-inputs input[type="number"],.pwf-field-item-search input[type="text"],.woocommerce .pwf-field-item-search input[type="text"],.woocommerce-page .pwf-field-item-search  input[type="text"]';

	wp.customize( 'pwf_style[input_font_size]', function( value ) {
		value.bind( function( newval ) {
			$(inputSelectors).css( 'font-size', newval + 'px' );
		});
	});
	wp.customize( 'pwf_style[input_height]', function( value ) {
		value.bind( function( newval ) {
			$(inputSelectors).css( {'line-height': newval + 'px', 'height': newval + 'px' });
		});
	});
	wp.customize( 'pwf_style[input_border_radius]', function( value ) {
		value.bind( function( newval ) {
			$(inputSelectors).css( 'border-radius', newval + 'px' );
		});
	});
	wp.customize( 'pwf_style[input_text_color]', function( value ) {
		value.bind( function( newval ) {
			$(inputSelectors).css( 'color', newval );
		});
	});
	wp.customize( 'pwf_style[input_border_color]', function( value ) {
		value.bind( function( newval ) {
			$(inputSelectors).css( 'border-color', newval );
		});
	});

	/**
	 * Group Checkbox, Radio, Textlist
	 */
	wp.customize( 'pwf_style[group_items_margin_bottom]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-item-label').css( 'margin-bottom', newval + 'px' );
		});
	});
	wp.customize( 'pwf_style[group_items_font_size]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = '.pwf-item-label .pwf-title-container .text-title, .pwf-item-label .pwf-toggle::before { font-size:' + newval + 'px;}';
			let id = 'pwf_group_items_font_size';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[group_items_line_height]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-item-label .pwf-title-container .text-title,.pwf-item-label .pwf-toggle').css( 'line-height', newval + 'px' );
		});
	});
	wp.customize( 'pwf_style[group_items_font_weight]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-item-label .pwf-title-container .text-title, .pwf-item-label .pwf-toggle').css( 'font-weight', newval );
		} );
	});
	wp.customize( 'pwf_style[group_items_text_color]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = '.pwf-item-label .pwf-title-container .text-title,.pwf-item-label .pwf-toggle{ color:' + newval + ';}';
			let id = 'pwf_group_items_text_color';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[group_items_text_hover_color]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = ".pwf-item-label.pwf-ui-state-hover > .pwf-title-container .text-title { color:" + newval + ";}";
			let id = 'pwf_group_items_text_hover_color';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[group_items_count_font_size]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-product-counts').css( 'font-size', newval + 'px');
		} );
	});
	wp.customize( 'pwf_style[group_items_count_font_weight]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-product-counts').css( 'font-weight', newval );
		} );
	});
	wp.customize( 'pwf_style[group_items_count_text_color]', function( value ) {
		value.bind( function( newval ) {
			$('.pwf-product-counts').css( 'color', newval );
		});
	});

	/**
	 * Checkbox
	 */
	let checkboxSelector = '.pwf-checkbox-label .pwf-input-container, .pwf-rating-checkbox-type .pwf-input-container';
	wp.customize( 'pwf_style[checkbox_size]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = checkboxSelector + '{ height:' + newval + 'px; width:' + newval + 'px;}';
			let id = 'pwf_checkbox_size';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[checkbox_border_width]', function( value ) {
		value.bind( function( newval ) {
			$(checkboxSelector).css( 'border-width', newval + 'px' );
		});
	});
	wp.customize( 'pwf_style[checkbox_border_radius]', function( value ) {
		value.bind( function( newval ) {
			$(checkboxSelector).css( 'border-radius', newval + 'px' );
		});
	});
	wp.customize( 'pwf_style[checkbox_bg_color]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = checkboxSelector + '{ background-color:' + newval + ';}';
			let id = 'pwf_checkbox_bg_color';
			addStyleText( id, addStyle );
		});
	});
	let checkboxHoverSelectors = '.pwf-item-label.pwf-ui-state-hover > .pwf-input-container,';
	checkboxHoverSelectors    += '.pwf-checkboxlist-item.checked > .pwf-item-inner > .pwf-item-label > .pwf-input-container,';
	checkboxHoverSelectors    += '.pwf-rating-checkbox-type.pwf-ui-state-hover > .pwf-input-container,';
	checkboxHoverSelectors    += '.pwf-rating-checkbox-type.checked > .pwf-input-container';
	wp.customize( 'pwf_style[checkbox_bg_hover_color]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = checkboxHoverSelectors + '{ background-color:' + newval + ';}';
			let id = 'pwf_checkbox_bg_hover_color';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[checkbox_border_color]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = checkboxSelector + '{ border-color:' + newval + ';}';
			let id = 'pwf_checkbox_border_color';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[checkbox_border_hover_color]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = checkboxHoverSelectors + '{ border-color:' + newval + ';}';
			let id = 'pwf_checkbox_border_hover_color';
			addStyleText( id, addStyle );
		});
	});

	let markSelectors  = '.pwf-checkboxlist-item.checked > .pwf-item-inner > .pwf-item-label .pwf-input-container::after,';
	markSelectors     += '.pwf-checkboxlist-item > .pwf-item-inner > .pwf-item-label.pwf-ui-state-hover .pwf-input-container::after,';
	markSelectors     += '.pwf-rating-checkbox-type .pwf-star-rating-item.pwf-ui-state-hover .pwf-input-container::after,';
	markSelectors     += '.pwf-rating-checkbox-type .pwf-star-rating-item.checked .pwf-input-container::after';
	wp.customize( 'pwf_style[checkbox_mark_color]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = markSelectors + '{ color:' + newval + '; border-color:' + newval+ ';}';
			let id = 'pwf_checkbox_mark_color';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[checkbox_mark_width]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = markSelectors + '{ width:' + newval + 'px;}';
			let id = 'pwf_checkbox_mark_width';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[checkbox_mark_height]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = markSelectors + '{ height:' + newval + 'px;}';
			let id = 'pwf_checkbox_mark_height';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[checkbox_mark_top_position]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = markSelectors + '{ top:' + newval + 'px;}';
			let id = 'pwf_checkbox_mark_top_position';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[checkbox_mark_left_position]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = markSelectors + '{ left:' + newval + 'px;}';
			let id = 'pwf_checkbox_mark_left_position';
			addStyleText( id, addStyle );
		});
	});
	
	/**
	 * Radio
	 */
	let radioSelector = '.pwf-radiolist-label .pwf-input-container, .pwf-rating-radio-type .pwf-input-container';
	wp.customize( 'pwf_style[radio_size]', function( value ) {
		value.bind( function( newval ) {
			$(radioSelector).css({ 'width': newval +'px', 'height': newval + 'px' });
		});
	});
	wp.customize( 'pwf_style[radio_border_width]', function( value ) {
		value.bind( function( newval ) {
			$(radioSelector).css( 'border-width', newval + 'px' );
		});
	});
	wp.customize( 'pwf_style[radio_border_radius]', function( value ) {
		value.bind( function( newval ) {
			$(radioSelector).css( 'border-radius', newval + '%' );
		});
	});
	wp.customize( 'pwf_style[radio_bg_color]', function( value ) {
		 value.bind( function( newval ) {
			let addStyle = radioSelector + '{ background-color:' + newval+ ';}';
			let id = 'pwf_radio_bg_color';
			addStyleText( id, addStyle );
		});
	});

	let radioHoverSelectors = '.pwf-radiolist-label.pwf-ui-state-hover > .pwf-input-container,';
	radioHoverSelectors    += '.pwf-radiolist-label.checked > .pwf-input-container,';
	radioHoverSelectors    += '.pwf-rating-radio-type .pwf-star-rating-item.pwf-ui-state-hover > .pwf-input-container,';
	radioHoverSelectors    += '.pwf-rating-radio-type .pwf-star-rating-item.checked > .pwf-input-container';
	wp.customize( 'pwf_style[radio_bg_hover_color]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = radioHoverSelectors + '{ background-color:' + newval+ ';}';
			let id = 'pwf_radio_bg_hover_color';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[radio_border_color]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = radioSelector + '{ border-color:' + newval+ ';}';
			let id = 'pwf_radio_border_color';
			addStyleText( id, addStyle );
		 });
	});
	wp.customize( 'pwf_style[radio_border_hover_color]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = radioHoverSelectors + '{ border-color:' + newval+ ';}';
			let id = 'pwf_radio_border_hover_color';
			addStyleText( id, addStyle );
		});
	});
	
	let radioMarkSelectors = '.pwf-radiolist-label.checked > .pwf-input-container::after,';
	radioMarkSelectors    += '.pwf-radiolist-label.pwf-ui-state-hover > .pwf-input-container::after,';
	radioMarkSelectors    += '.pwf-star-rating-item.pwf-ui-state-hover > .pwf-input-container::after,';
	radioMarkSelectors    += '.pwf-star-rating-item.checked > .pwf-input-container::after';
	wp.customize( 'pwf_style[radio_mark_color]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = radioMarkSelectors + '{ background-color:' + newval + ';}';
			let id = 'pwf_radio_mark_color';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[radio_mark_width]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = radioMarkSelectors + '{ width:' + newval + '%;}';
			let id = 'pwf_radio_mark_width';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[radio_mark_height]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = radioMarkSelectors + '{ height:' + newval + '%;}';
			let id = 'pwf_radio_mark_height';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[radio_mark_top_position]', function( value ) {
		value.bind( function( newval ) {		
			let addStyle = radioMarkSelectors + '{ top:' + newval + '20%;}';
			let id = 'pwf_radio_mark_top_position';
			addStyleText( id, addStyle );
		});
	});
	wp.customize( 'pwf_style[radio_mark_left_position]', function( value ) {
		value.bind( function( newval ) {
			let addStyle = radioMarkSelectors + '{ left:' + newval + '20%;}';
			let id = 'pwf_radio_mark_left_position';
			addStyleText( id, addStyle );
		});
	});

}(jQuery));