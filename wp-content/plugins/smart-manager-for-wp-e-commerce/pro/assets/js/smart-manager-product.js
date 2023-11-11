
// Code for adding Add Attribute & Remove Attribute in Batch Update


jQuery(document).on('smart_manager_post_load_grid','#sm_editor_grid', function() {
	if( window.smart_manager.current_selected_dashboard == 'product' && typeof(window.smart_manager.column_names_batch_update) != 'undefined' ) {
		//Code for handling Product Attribute
		if( typeof(window.smart_manager.column_names_batch_update['custom/product_attributes']) != 'undefined' && Object.keys(window.smart_manager.column_names_batch_update['custom/product_attributes']['values']).length > 0 ) {

			let attrObj = window.smart_manager.column_names_batch_update['custom/product_attributes'];

			let attributes = window.smart_manager.column_names_batch_update['custom/product_attributes']['values'];

			// Code for handling in new UI
			let attributesActions = {}
			let attributesValues = {}
			attributes.forEach((attr) => {
				let key = attr.hasOwnProperty('key') ? attr.key : ''
				if(key != ''){
					let valObj = attr.hasOwnProperty('value') ? attr.value : {}
					attributesActions[key] = (valObj.hasOwnProperty('lbl')) ? valObj.lbl : ''
				
					let values = valObj.hasOwnProperty('val') ? valObj.val : {}

					if(Object.keys(values).length > 0){
						attributesValues[key] = [{'key': 'all', 'value': 'All'}]
						Object.keys(values).forEach((valKey) => {
							attributesValues[key].push({'key': valKey, 'value': values[valKey]})
						})
					}
				}
			})
			window.smart_manager.column_names_batch_update['custom/product_attributes']['actions'] = {...window.smart_manager.batch_update_actions['multilist'], ...{copy_from: _x('copy from', 'Bulk Edit option for WooCommerce product attribute', 'smart-manager-for-wp-e-commerce')}};
			[ 'set_to', 'copy_from_field' ].forEach(prop => delete window.smart_manager.column_names_batch_update['custom/product_attributes']['actions'][prop])
			window.smart_manager.column_names_batch_update['custom/product_attributes']['additionalValues'] = attributesActions
			window.smart_manager.column_names_batch_update['custom/product_attributes']['values'] = attributesValues
			window.smart_manager.column_names_batch_update['custom/product_attributes']['type'] = 'dropdown';
			if(!window.smart_manager.column_names_batch_update['custom/product_attributes']['additionalValues'].hasOwnProperty('custom')) {
				window.smart_manager.column_names_batch_update['custom/product_attributes']['additionalValues']['custom'] = 'Custom';
			}
		}

		//Code for handling Product Category
		// if( typeof(window.smart_manager.column_names_batch_update['terms/product_cat']) != 'undefined' && Object.keys(window.smart_manager.column_names_batch_update['terms/product_cat']['values']).length > 0 ) {

		// 	let attrObj = window.smart_manager.column_names_batch_update['terms/product_cat'],
		// 		categories = window.smart_manager.column_names_batch_update['terms/product_cat']['values'],
		// 		parentCategories = [],
		// 		childCategories = {},
		// 		parentCategoriesObj = {};

		// 	categories.forEach((cat) => {
		// 		let val = (cat.hasOwnProperty('value')) ? cat.value : {}
		// 		let title = (val.hasOwnProperty('term')) ? val.term : ''
		// 		parentCategories.push({'key': cat.key, 'value': title});
		// 		parentCategoriesObj[cat.key] = title

		// 		let parent = (val.hasOwnProperty('parent')) ? val.parent : 0
		// 		let parentExists = false
		// 		for(let i=0; i<categories.length; i++) {
		// 			if(categories[i].key == parent){
		// 				parentExists = true;
		// 				break;
		// 			} 
		// 		}

		// 		if( parent > 0 && parentExists ) {
		// 			if( typeof(childCategories[parent]) == 'undefined' ) {
		// 				childCategories[parent] = [];
		// 			}
		// 			childCategories[parent].push({'key': cat.key, 'value': title});
		// 		}
		// 	});
			
		// 	//Code for parent categories
		// 	if( Object.keys(parentCategories).length > 0 ) {
		// 		window.smart_manager.column_names_batch_update['custom/product_cat_parent'] = JSON.parse( JSON.stringify( attrObj ) );
		// 		window.smart_manager.column_names_batch_update['custom/product_cat_parent']['name'] = 'Categories';
		// 		window.smart_manager.column_names_batch_update['custom/product_cat_parent']['title'] = window.smart_manager.column_names_batch_update['custom/product_cat_parent']['name'];
		// 		window.smart_manager.column_names_batch_update['custom/product_cat_parent']['type'] = 'multilist';
		// 		window.smart_manager.column_names_batch_update['custom/product_cat_parent']['values'] = parentCategories;
		// 	}
			
		// 	//Code for child categories 
		// 	if( Object.keys(childCategories).length > 0 ) {

		// 		Object.entries(childCategories).forEach(([key, obj]) => {

		// 			let parentCatName = ( parentCategoriesObj[key] ) ? parentCategoriesObj[key] : '';
		// 			let	pkey = 'custom/product_cat_'+window.smart_manager.convert_to_slug(parentCatName);

		// 			window.smart_manager.column_names_batch_update[pkey] = JSON.parse( JSON.stringify( attrObj ) );
		// 			window.smart_manager.column_names_batch_update[pkey]['name'] = 'Categories: '+parentCatName;
		// 			window.smart_manager.column_names_batch_update[pkey]['title'] = window.smart_manager.column_names_batch_update[pkey]['name'];
		// 			window.smart_manager.column_names_batch_update[pkey]['type'] = 'multilist';
		// 			window.smart_manager.column_names_batch_update[pkey]['values'] = obj;

		// 		});
		// 	}
		// 	delete window.smart_manager.column_names_batch_update['terms/product_cat'];

		// }	
	}
})

//Code to handle after change of batch update field
.on('smart_manager_post_format_columns','#sm_editor_grid', function() {
	
	if(window.smart_manager.column_names_batch_update['postmeta/meta_key=_regular_price/meta_value=_regular_price']){
		window.smart_manager.column_names_batch_update['postmeta/meta_key=_regular_price/meta_value=_regular_price']['custom_actions'] = {set_to_sale_price: _x('set to sale price', 'bulk edit option for WooCommerce product price', 'smart-manager-for-wp-e-commerce')}
	}

	if(window.smart_manager.column_names_batch_update['postmeta/meta_key=_sale_price/meta_value=_sale_price']){
		window.smart_manager.column_names_batch_update['postmeta/meta_key=_sale_price/meta_value=_sale_price']['custom_actions'] = {set_to_regular_price: _x('set to regular price', 'bulk edit option for WooCommerce product price', 'smart-manager-for-wp-e-commerce')}
	}
})

//Code to handle after change of batch update field in case of product attributes and categories
.on('sm_batch_update_field_on_change', function(e, rowId, selectedField, type, colVal) {

	if( jQuery("#"+rowId+" #batch_update_value_td_2").length ) { //handling for removing custom attribute td
		jQuery("#"+rowId+" #batch_update_value_td_2").remove();
	}

	if( jQuery('#batchmod_sm_editor_grid #batch_update_value_td_2').length == 0 ) { //handling for restoring the batch update dialog size
		jQuery("#batchmod_sm_editor_grid").css('width','640px');
	}

	if( selectedField == 'custom/product_attributes' ) {
		window.smart_manager.batch_update_action_options_default = '<option value="" disabled selected>'+_x('Select Attribute', 'bulk edit default action for WooCommerce product attribute', 'smart-manager-for-wp-e-commerce')+'</option>';

		if( Object.keys(colVal).length > 0 ) {
			for( attr_nm in colVal ) {
				window.smart_manager.batch_update_action_options_default += '<option value="'+ attr_nm +'">'+ colVal[attr_nm].lbl +'</option>';
			}
		}

	} else if( selectedField.indexOf('custom/product_cat') != -1 ) {
		window.smart_manager.batch_update_action_options_default = '<option value="" disabled selected>'+_x('Select Action', 'bulk edit default action for WooCommerce product category', 'smart-manager-for-wp-e-commerce')+'</option>'+
																	'<option value="set_to">'+_x('set to', 'bulk edit option for WooCommerce product category', 'smart-manager-for-wp-e-commerce')+'</option>'+
																	'<option value="add_to">'+_x('add to', 'bulk edit option for WooCommerce product category', 'smart-manager-for-wp-e-commerce')+'</option>'+
																	'<option value="remove_from">'+_x('remove from', 'bulk edit option for WooCommerce product category', 'smart-manager-for-wp-e-commerce')+'</option>';
	}
})

//Code to handle after change of batch update field in regular & sales price
.on('sm_batch_update_field_post_on_change', function(e, rowId, selectedField, type, colVal, actionOptions) {

	if( selectedField == 'postmeta/meta_key=_regular_price/meta_value=_regular_price' || selectedField == 'postmeta/meta_key=_sale_price/meta_value=_sale_price' ) {

		let option = ( selectedField == 'postmeta/meta_key=_regular_price/meta_value=_regular_price' ) ? 'set_to_sale_price' : 'set_to_regular_price';
		actionOptions.batch_update_action_options_number += '<option value="'+option+'">'+window.smart_manager.convert_to_pretty_text(option)+'</option>';

        jQuery("#"+rowId+" .batch_update_action").empty().append(actionOptions.batch_update_action_options_number);
    }
})

//Code to handle after specific attribute has been selected in case of add or remove attribute
.on('change','.batch_update_action',function(){
	let rowId = jQuery(this).closest('tr').attr('id'),
		selectedField = jQuery( "#"+rowId+" .batch_update_field option:selected" ).val(),
        selectedAction = jQuery( "#"+rowId+" .batch_update_action option:selected" ).val(),
        type = window.smart_manager.column_names_batch_update[selectedField].type,
        colVal = window.smart_manager.column_names_batch_update[selectedField].values;

    if( selectedAction == 'set_to_sale_price' || selectedAction == 'set_to_regular_price' ) {
   		jQuery("#"+rowId+" #batch_update_value_td").hide();
    } else {
    	jQuery("#"+rowId+" #batch_update_value_td").show();
    }


    if( jQuery("#"+rowId+" #batch_update_value_td_2").length ) { //handling for removing custom attribute td
		jQuery("#"+rowId+" #batch_update_value_td_2").remove();
	}

	if( jQuery('#batchmod_sm_editor_grid #batch_update_value_td_2').length == 0 ) { //handling for restoring the batch update dialog size
		jQuery("#batchmod_sm_editor_grid").css('width','640px');
	}

    if( selectedField == 'custom/product_attributes' ) {

    	if( selectedAction != 'custom' ) { //code for handling action for non-custom attribute

    		let batchUpdateValueOptions = '',
    			batchUpdateValueSelectOptions = '',
	    		valueOptionsEmpty = true;

	    	if( typeof (colVal[selectedAction]) != 'undefined' && typeof (colVal[selectedAction].val) != 'undefined' ) {

	    		colVal = colVal[selectedAction].val;

	    		for (var key in colVal) {
		            if( typeof (colVal[key]) != 'object' && typeof (colVal[key]) != 'Array' ) {
		                valueOptionsEmpty = false;
		                batchUpdateValueSelectOptions += '<option value="'+key+'">'+ colVal[key] + '</option>';
		            }
		        }
	    	}

	        if( valueOptionsEmpty === false ) {
	        	batchUpdateValueOptions = '<select class="batch_update_value" style="min-width:130px !important;">'+
	        									'<option value="all">'+_x('All', 'radio - bulk edit', 'smart-manager-for-wp-e-commerce')+'</option>'+
	        									batchUpdateValueSelectOptions +
	        									'</select>';
	            jQuery("#"+rowId+" #batch_update_value_td").empty().append(batchUpdateValueOptions)
	            jQuery("#"+rowId+" #batch_update_value_td").find('.batch_update_value').select2({ width: '15em', dropdownCssClass: 'sm_beta_batch_update_field', dropdownParent: jQuery('[aria-describedby="sm_inline_dialog"]') });
	        }

    	} else { //code for handling action for custom attribute

    		jQuery("#"+rowId+" #batch_update_value_td").html("<input type='text' class='batch_update_value' placeholder='"+_x('Enter Attribute name...', 'placeholder', 'smart-manager-for-wp-e-commerce')+"' class='FormElement ui-widget-content'>");
    		jQuery("<td id='batch_update_value_td_2' style='white-space: pre;'><input type='text' class='batch_update_value_2' placeholder='"+_x('Enter values...', 'placeholder', 'smart-manager-for-wp-e-commerce')+"' title='"+_x('For more than one values, use pipe (|) as delimiter', 'tooltip', 'smart-manager-for-wp-e-commerce')+"' class='FormElement ui-widget-content'></td>").insertAfter("#"+rowId+" #batch_update_value_td");
    		jQuery("#batchmod_sm_editor_grid").css('width','760px');
    	}
    	
    }

})

//Code to make changes to batch_update_actons on batch update form submit for custom attribute handling
.off('sm_batch_update_on_submit').on('sm_batch_update_on_submit',function(){

	let index = 0;

	jQuery('tr[id^=batch_update_action_row_]').each(function() {
		let value2 = jQuery(this).find('.batch_update_value_2').val();

		if( typeof (value2) != 'undefined' ) {
			window.smart_manager.batch_update_actions[index].value2 = value2; 
		}

		index++;
	});
});
