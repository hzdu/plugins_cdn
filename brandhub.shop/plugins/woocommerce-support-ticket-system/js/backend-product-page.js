"use strict";
jQuery(document).ready(function()
{
	jQuery(document).on('change', '#field_to_edit', wcsts_process_variations_to_edit);
});

function wcsts_process_variations_to_edit(event)
{
	if(event.currentTarget.value != 'ppt_bulk_assign_questions_number')
	{
		return true;
	}
	
	value = window.prompt( wcsts.bulk_questions_number_label );
	if(value != null)
	{
		jQuery('.wcsts_questions_number_input').val(value);
		jQuery('#variable_product_options .woocommerce_variations :input').trigger('change');

	}
	
	return true;
}