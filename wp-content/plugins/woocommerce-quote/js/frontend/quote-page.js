"use strict"; 
var wcqt_state_already_autofilled = false;
jQuery(document).ready(function()
{
	/*country-state */
	jQuery(document).on('change','.wcqt_country_selector' , wcqt_load_state);
	jQuery('.wcqt_country_selector').trigger('change');
	wcqt_init_country_state_fields();
	//
	
	//on submit: jQuery(document).on('submit', 'form.wcqt-contact-form', wcqt_check_data_before_submit);
	
	wcqt_init_date_and_fields();
	wcqt_init_select2_fields();
	
	//Update menu
	wcqt_force_refreshing_menu()
	
});
function wcqt_force_refreshing_menu()
{
	jQuery(document).on('wc_fragments_refreshed', function()
	{
		jQuery(".wcqt-menu").fadeTo(300, 1);
	});
	jQuery( document.body ).trigger( 'wc_fragment_refresh' );
			

}
function wcqt_check_data_before_submit(event)
{
	 event.preventDefault();
	
	const data = new FormData(event.target);
	const value = Object.fromEntries(data.entries());	
	console.log(value);
	return false;
}

function wcqt_init_date_and_fields()
{
	jQuery('.wcqt_input_time_field').each(function(index, elem)
	{
		var id = jQuery(elem).data('upload-field-id');
		var min = jQuery(elem).data('min');
		var max = jQuery(elem).data('max');
		var time_interval = jQuery(elem).data('interval');
		min = min != null && min != "" ? min.split(",") : "";
		max = max != null && max != "" ? max.split(",") : "";
		jQuery(elem).pickatime({
		  format: wcqt.time_format,//'HH:i',//wcqt_datetime.time_format
		  formatSubmit: 'HH:i',
		   hiddenSuffix: '',
		   min: min,
		   max: max,
		   interval:time_interval
			
		});
		
		//"readonly" attribute removal: this is necessary in order to performe the "required" validation on submit
		if(jQuery(elem).data('required'))
			jQuery(elem).removeAttr('readonly');
		
	});
	
	jQuery('.wcqt_input_date_field').each(function(index, elem)
	{
		var min = jQuery(elem).data('min-date');
		var max = jQuery(elem).data('max-date');
		var id = jQuery(elem).data('upload-field-id');
		var days_to_disable = jQuery(elem).data('week-days-to-disable')+"";
		var specific_dates_to_disable = jQuery(elem).data('dates-to-exclude')+"";
		min = min != null && min != "" ? min.split(",") : "";
		max = max != null && max != "" ? max.split(",") : "";
		
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
			 format: wcqt.date_format,//'yyyy-mm-dd',  
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
		
		//"readonly" attribute removal: this is necessary in order to performe the "required" validation on submit
		if(jQuery(elem).data('required'))
			jQuery(elem).removeAttr('readonly');
		
	});
}
function wcqt_init_select2_fields()
{
	jQuery('.wcqt_input_select_field').each(function(index,elem)
	{
		jQuery(elem).select2(
			{
				width: '100%',
				placeholder: jQuery(elem).prop('placeholder')
			});
	});
}
//Country state
function wcqt_init_country_state_fields()
{
	jQuery('.wcqt_country_selector').each(function(index,elem)
	{
		jQuery(elem).select2(
			{
				width: '100%',
				placeholder: jQuery(elem).prop('placeholder')
			});
	});
}
function wcqt_load_state(event)
{
	var country_id = event.target.value;
	var id = jQuery(event.target).data('id');
	var random = Math.floor((Math.random() * 1000000) + 999);
	var formData = new FormData();
	formData.append('action', 'wcqt_load_state_by_country_id');
	formData.append('country_id', country_id);
	formData.append('unique_id', id);
	formData.append('autofill_state', wcqt_state_already_autofilled ? "" : jQuery(event.target).data('autofill-state'));
	
	//UI 
	jQuery('#wcqt_state_selector_'+ id).empty();
	if(event.target.value == 0)
		return;
	
	jQuery('#wcqt_preloader_image_'+ id).show();
	
	jQuery.ajax({
		url: wcqt.ajax_url+"?nocache="+random,
		type: 'POST',
		data: formData,
		async: true,
		success: function (data) 
		{
			//UI	
			//var result = jQuery.parseJSON(data);
			jQuery('#wcqt_preloader_image_'+ id).hide();
			jQuery('#wcqt_state_selector_'+ id).html(data);
			wcqt_state_already_autofilled = true;
						
		},
		error: function (data) 
		{
			//console.log(data);
			//alert("Error: "+data);
		},
		cache: false,
		contentType: false,
		processData: false
	});
}