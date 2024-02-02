"use strict";
jQuery(document).ready(function()
{
	jQuery('#post-query-submit').val(wcsts_custom_ui.filter_button_text);
	
	wcsts_apply_color_to_priorities();
}); 
function wcsts_apply_color_to_priorities()
{
	var all_priority_columns_array = jQuery('td.taxonomy-wcsts_ticket_priority.column-taxonomy-wcsts_ticket_priority');
	
	var column_id_index = 0;
	jQuery('td.id.column-id a').each(function(index, element)
	{
		if(jQuery(this).data('is-priority-data-defined') == true)
		{
			var background_color = jQuery(this).data('priority-background-color');
			var text_color =  jQuery(this).data('priority-text-color');
			
			
			jQuery(all_priority_columns_array).each(function(priority_row_index, priority_row_elem)
			{
				if(priority_row_index == column_id_index)
				{
					
					jQuery(priority_row_elem).find('a').css({'background-color': background_color,
										   'color': text_color,
										   'padding': '5px 15px 5px 15px',
										   'display': 'inline-block', 
										   'width': '50%',
										   'margin-top' : '0 auto',
										   'text-align': 'center',
										   'font-weight': 'bold',
										   
										  });
				}
			});
			column_id_index++;
		}
	});
}