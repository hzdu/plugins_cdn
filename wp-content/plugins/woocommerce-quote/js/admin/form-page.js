"use strict";
var wcqt_just_created_field = false;
jQuery(document).ready(function()
{ 
	
	jQuery(document).on('click', '.wcqt_add_new_input_field_button', wcqt_on_add_input_field);
	jQuery(document).on('click', '.delete-field', wcqt_delete_input_field);
	jQuery(document).on('click', '.cancel-input-field-button', wcqt_on_cancel_click);
	jQuery(document).on('submit', '.wcqt-input-field-form', wcqt_on_save_input_field);
	jQuery(document).on('click', '.save-input-field-button', wcqt_submit); //forces the submit. Happens that by default the button click is ignored
	
	//Init
	wcqt_init_popup();
	wcqt_init_date_and_fields();	
	wcqt_manage_save_button_display(0);
	wcqt_init_sortable_table();
});
function wcqt_init_sortable_table()
{
	 jQuery("#input-fields-table").sortable({
        items: 'tr',
        cursor: 'grab',
		handle: 'span.wcqt-move-button',
        axis: 'y',
        dropOnEmpty: false,
        start: function (e, ui) {
            ui.item.addClass("selected");
        },
        stop: function (e, ui) {
            ui.item.removeClass("selected");
			wcqt_sort_form_elements(e);
        }
    });
}

function wcqt_sort_form_elements(event)
{
	//UI
	wcqt_before_ajax_loading();
	jQuery('#input-fields-table').css('opacity', '0.5');
	
	const formData = new FormData();
	jQuery("#input-fields-table-body").find("tr.field-row").each(function(index, value)
	{
		formData.append('data['+index+']', jQuery(value).data('id'));
	});
	
	formData.append('action', 'wcqt_update_form_element_indexes');
	formData.append('security', wcqt.security);
	
	jQuery.ajax({
		url: ajaxurl,
		type: 'POST',
		data: formData,
		async: true,
		success: function (response) 
		{
			//UI
			wcqt_after_ajax_loading();
			jQuery('#input-fields-table').css('opacity', '1');
			
		},
		error: function (data) 
		{
			
		},
		cache: false,
		contentType: false,
		processData: false
	});
	
}
function wcqt_init_date_and_fields()
{
	jQuery('.wcqt_time_field').each(function(index, elem)
	{
		var min = jQuery(elem).data('min');
		var max = jQuery(elem).data('max');
		var time_interval = jQuery(elem).data('interval');
		min = min != null ? min.split(",") : "";
		max = max != null ? max.split(",") : "";
		jQuery(elem).pickatime({
		  format: 'HH:i', //ToDo: wcqt_options.time_format,
		  formatSubmit: 'HH:i',
		   hiddenSuffix: '',
		   min: min,
		   max: max,
		   interval:time_interval
			
		});
	});
	
	jQuery('.wcqt_date_field').each(function(index, elem)
	{
		var min = jQuery(elem).data('min');
		var max = jQuery(elem).data('max');
		var days_to_disable = jQuery(elem).data('disabled-days')+"";
		var specific_dates_to_disable = jQuery(elem).data('specific-dates-to-disable')+"";
		min = min != null ? min.split(",") : "";
		max = max != null ? max.split(",") : "";
		if(max != "")
			max[1] = max[1] - 1 ;
		if(min != "")
			min[1] = min[1] - 1 ;
		
		if(days_to_disable == "none" || days_to_disable == null)
			days_to_disable = [];
		else 
		{
			var day_values = days_to_disable.split(",");
			days_to_disable = [];
			for(var i = 0; i < day_values.length; i++)
				days_to_disable.push(parseInt(day_values[i]));
		
		}
		
		if(specific_dates_to_disable != "" && specific_dates_to_disable != "undefined")
		{
			var dates = specific_dates_to_disable.split(";");
			for(var i = 0; i < dates.length; i++)
				days_to_disable.push(dates[i].split(","));
		}
		
		jQuery(elem).pickadate({
			 firstDay: 1,
			 format: 'yyyy-mm-dd', //Todo: wcqt_options.date_format
			 formatSubmit: 'yyyy-mm-dd',
			 hiddenSuffix: '',
			 min: min,
			 max: max,
			 selectYears: 300,
			 selectMonths: true,
			 klass: {
				 selectMonth: 'wcqt_picker__select--month',
				 selectYear: 'wcqt_picker__select--year'
			 },
			 disable: days_to_disable
			
		});
	});
}

function wcqt_init_popup()
{
	jQuery('td.table-actions').magnificPopup({
		  delegate: 'a span.expand-field',
		  removalDelay: 50, //delay removal by X to allow out-animation,
		  closeOnBgClick: true,
		  callbacks: {
			beforeOpen: function() {
				wcqt_just_created_field = false;
			   this.st.mainClass = this.st.el.attr('data-effect');
			   wcqt_popup_open(); 
			}
		  },
		  midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
		});
}
function wcqt_close_popup(event)
{
	event.preventDefault();
	event.stopPropagation();
	
	jQuery.magnificPopup.instance.close();
	wcqt_popup_on_close();
	
	return false;
}
function wcqt_update_row_data(id, formProps)
{
	
	const field_to_update = Array('label', 'connects_to', 'required', 'disabled');
	field_to_update.forEach(function(item, index)
	{
		if(item == "disabled" || item == "required" )
		{
			jQuery("#wcqt-td-"+item+"-"+id).html(formProps.hasOwnProperty("wcqt_options[input_fields]["+id+"]["+item+"]") && formProps["wcqt_options[input_fields]["+id+"]["+item+"]"] == "true" ? wcqt.yes_text : wcqt.no_text);
		}
		else if(item == "label")
		{
			jQuery("#wcqt-td-"+item+"-"+id).html( formProps["wcqt_options[input_fields]["+id+"]["+item+"]["+wcqt.curr_lang+"]"]);
		}
		else
			jQuery("#wcqt-td-"+item+"-"+id).html(formProps["wcqt_options[input_fields]["+id+"]["+item+"]"]);
	});
}
function wcqt_submit(event)
{
	jQuery('.wcqt-input-field-form').trigger('submit');
}
function wcqt_on_save_input_field(event)
{
	event.preventDefault();
	const id = jQuery(event.currentTarget).data('id');
	const formData = new FormData(event.target);
	const formProps = Object.fromEntries(formData); 
	
	//UI
	wcqt_before_ajax_loading();
	wcqt_update_row_data(id, formProps);
	
	formData.append('action', 'wcqt_save_input_field'); 
	formData.append('security', wcqt.security);
	jQuery.ajax({
		url: ajaxurl,
		type: 'POST',
		data: formData,
		async: true,
		success: function (response) 
		{
			wcqt_just_created_field = false;
			
			//UI
			jQuery("#input-fields-table-body").append(response);
			wcqt_force_open_popup_for_just_created_field();
			wcqt_manage_save_button_display(100);
			wcqt_after_ajax_loading();
			wcqt_init_date_and_fields();
			wcqt_close_popup(event);
			
		},
		error: function (data) 
		{
			
		},
		cache: false,
		contentType: false,
		processData: false
	});
	
	return false;
}
function wcqt_on_add_input_field(event)
{
	event.preventDefault();
	const type = jQuery("#wcqt_input_fields_type").val();
	
	var formData = new FormData();
	formData.append('action', 'wcqt_add_new_input_field'); 
	formData.append('type', type); 
	formData.append('security', wcqt.security); 

	//UI
	wcqt_before_ajax_loading();
	
	jQuery.ajax({
		url: ajaxurl,
		type: 'POST',
		data: formData,
		async: true,
		success: function (response) 
		{
			wcqt_just_created_field = true;
			
			//UI
			jQuery("#input-fields-table-body").append(response);
			wcqt_force_open_popup_for_just_created_field();
			wcqt_manage_save_button_display(100);
			wcqt_after_ajax_loading();
			wcqt_init_date_and_fields();
			wcqt_init_popup();
			
		},
		error: function (data) 
		{
			
		},
		cache: false,
		contentType: false,
		processData: false
	});
	
	return false;
}
function wcqt_force_open_popup_for_just_created_field()
{
	jQuery.magnificPopup.open({
			  items: {
				src: jQuery('tr.field-row').last().find('span.expand-field').attr("href")
			  },			 
			}); 
}
function wcqt_on_cancel_click(event)
{
	if(!wcqt_just_created_field)
		wcqt_close_popup(event);
	else 
		wcqt_delete_input_field(event);
	return false;
}
function wcqt_remove_just_created_field(event)
{
	const id = jQuery(event.currentTarget).data('id');
	wcqt_close_popup(event);
	jQuery('#wcqt-input-field-'+id).fadeOut(300, function() { wcqt_just_created_field = false; jQuery(this).remove(); });
}
function wcqt_delete_input_field(event)
{
	const id = jQuery(event.currentTarget).data('id');
	if(confirm(wcqt.confirm_delete_message))
	{
		//UI
		wcqt_close_popup(event);
		jQuery('#wcqt-input-field-'+id).fadeOut(300, function() { wcqt_just_created_field = false; jQuery(this).remove(); });
		wcqt_before_ajax_loading();
		
		var formData = new FormData();
		formData.append('action', 'wcqt_delete_input_field'); 
		formData.append('id', id); 
		formData.append('security', wcqt.security); 
	
		jQuery.ajax({
					url: ajaxurl,
					type: 'POST',
					data: formData,
					async: true,
					success: function (response) 
					{
						wcqt_just_created_field = true;
						
						//UI
						wcqt_after_ajax_loading();
						
					},
					error: function (data) 
					{
						
					},
					cache: false,
					contentType: false,
					processData: false
				});
	
	}
	
	//ToDo ajax function to remove backend data
	return false;
}
function wcqt_popup_open()
{
	jQuery('.actions-button-container').fadeIn();
}
function wcqt_popup_on_close()
{
	jQuery('.actions-button-container').fadeOut();
}
function wcqt_manage_save_button_display(fadeOut)
{
	if(jQuery("#wcqt-options-container").children().length == 0)
		jQuery('.wcqt_save_button').fadeOut(fadeOut);
	else
		jQuery('.wcqt_save_button').fadeIn()
}
function wcqt_before_ajax_loading()
{
	jQuery(".disable_during_animation").attr('disabled', true);
	jQuery(".disable_during_animation").css('pointer-events','none');
	jQuery(".load_new_upload_field_spinner, .load_new_input_field_spinner").addClass('is-active');
}
function wcqt_after_ajax_loading()
{
	jQuery(".disable_during_animation").removeAttr('disabled');
	jQuery(".disable_during_animation").css('pointer-events','');
	jQuery(".load_new_upload_field_spinner, .load_new_input_field_spinner").removeClass('is-active');
}