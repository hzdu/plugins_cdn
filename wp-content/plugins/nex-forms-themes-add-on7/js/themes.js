jQuery(document).ready(
function ()
	{
	jQuery('select[name="choose_form_theme"]').change(
		function()
			{
			//jQuery(this).removeClass('active');
			if(jQuery(this).val()!='default')
				{
					jQuery('.active_theme').remove();
					
					jQuery('link.color_scheme').remove();
					jQuery('.active_theme').remove();
						
					
					jQuery(this).attr('data-selected',jQuery(this).val());
					
					jQuery('link.jquery_ui_theme').attr('href',jQuery('.plugins_path').text() + '/nex-forms-themes-add-on7/css/'+ jQuery(this).val() +'/jquery.ui.theme.css');
					jQuery('.form_field .the_input_element, .form_field .bootstrap-tagsinput, .form_field .radio-group a, .form_field .check-group a').addClass('ui-state-default')
					jQuery('.form_field .input-group-addon, .form_field .bootstrap-touchspin .btn').addClass('ui-state-active')
					jQuery('.form_field p.the_input_element, .form_field.heading .the_input_element').removeClass('ui-state-default');
					jQuery('.form_field .panel-heading').addClass('ui-widget-header');
					
					jQuery('.form_field.other-elements .panel-body').addClass('ui-widget-content');
					jQuery('.form_field label.title').find('span').css('color','inherit');
					jQuery('.form_field .ui-slider-handle').addClass('ui-state-default');
			
			jQuery('.form_field .panel-body').each(
				function()
						{
							if(jQuery(this).prev('div').hasClass('panel-heading'))
								jQuery(this).addClass('ui-widget-content');
						}
					);
				}
			else
				{
				jQuery('link.jquery_ui_theme').attr('href',"");
				jQuery('.ui-state-default').removeClass('ui-state-default');
				jQuery('.ui-state-active').removeClass('ui-state-active')
				jQuery('.ui-widget-content').removeClass('ui-widget-content');
				jQuery('.ui-widget-header, .panel-heading').removeClass('ui-widget-header')	
				}			
			jQuery('.overall-form-settings li').removeClass('active');
			
			jQuery('.overall-form-settings .current_selected_theme').text(jQuery(this).find('a').text());
			jQuery('.active_theme').text(jQuery(this).val());

			jQuery(this).addClass('active');
			jQuery('.is_grid .panel-body').removeClass('ui-widget-content');
			}
		);
	}
);