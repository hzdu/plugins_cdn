'use strict';
function set_field_attachments(){
	
					var set_attachement_fields = '<option value="">-- Dont Attach --</option>';
					
					
						set_attachement_fields += '<optgroup label="Text Fields">';
						jQuery('div.nex-forms-container div.form_field input[type="text"]').each(
							function()
								{
								
								if(jQuery(this).attr('name')!='multi_step_name')
									{
									if(jQuery(this).attr('name') && jQuery(this).attr('name')!='undefined')
										{
										set_attachement_fields += '<option data-field-id="'+ jQuery(this).closest('.form_field').attr('id') +'" data-field-name="'+ format_illegal_chars(jQuery(this).attr('name'))  +'" data-field-type="text"  value="'+ jQuery(this).closest('.form_field').attr('id') +'">'+ unformat_name(jQuery(this).attr('name')) +'</option>';
										}
									}
								}
							);	
						set_attachement_fields += '</optgroup>';
						
						
						
						set_attachement_fields += '<optgroup label="Selects">';
						jQuery('div.nex-forms-container div.form_field select').each(
							function()
								{
								if(jQuery(this).attr('name')!='undefined')
									{
									set_attachement_fields += '<option data-field-id="'+ jQuery(this).closest('.form_field').attr('id') +'" data-field-name="'+ format_illegal_chars(jQuery(this).attr('name'))  +'" data-field-type="text"  value="'+ jQuery(this).closest('.form_field').attr('id') +'">'+ unformat_name(jQuery(this).attr('name')) +'</option>';
									}
								}
							);	
						set_attachement_fields += '</optgroup>';
						
						set_attachement_fields += '<optgroup label="Text Areas">';
						jQuery('div.nex-forms-container div.form_field textarea').each(
							function()
								{
								set_attachement_fields += '<option data-field-id="'+ jQuery(this).closest('.form_field').attr('id') +'" data-field-name="'+ format_illegal_chars(jQuery(this).attr('name'))  +'" data-field-type="textarea"  value="'+ jQuery(this).closest('.form_field').attr('id') +'**textarea##'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ unformat_name(jQuery(this).attr('name')) +'</option>';
								}
							);	
						set_attachement_fields += '</optgroup>';
						
						
						set_attachement_fields += '<optgroup label="File Uploaders">';
						jQuery('div.nex-forms-container div.form_field input[type="file"]').each(
							function()
								{
								if(jQuery(this).attr('name')!='undefined')
									{
									set_attachement_fields += '<option data-field-id="'+ jQuery(this).closest('.form_field').attr('id') +'" data-field-name="'+ format_illegal_chars(jQuery(this).attr('name'))  +'" data-field-type="file"  value="'+ jQuery(this).closest('.form_field').attr('id') +'**file##'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ unformat_name(jQuery(this).attr('name')) +'</option>';
									}
								}
							);	
						set_attachement_fields += '</optgroup>';

					jQuery('select[name="attach_to_field"]').html(set_attachement_fields);
					
					
}

function setup_icon_options(current_field){
	jQuery('.icon-selection .single-icon-settings').remove();
	jQuery('.single-icon-settings.default_icon_select').hide();
	var icons_selection = '';
		current_field.find('.icon-holder').each(
			function(index)
				{
				var icon_holder = jQuery(this);
				
				var the_input = icon_holder.find('.the_input_element');
				var on_icon_holder = icon_holder.find('.on-icon');
				var off_icon_holder = icon_holder.find('.off-icon');
				var on_icon = icon_holder.find('.on-icon span');
				var off_icon = icon_holder.find('.off-icon span');
				var off_label = icon_holder.find('.off-label');
				
				for(var i=0;i<100;i++)
					{
					icon_holder.removeClass('icon_holder_'+i);
					on_icon_holder.removeClass('on_icon_number_'+i);
					off_icon_holder.removeClass('off_icon_number_'+i);
					}
				icon_holder.addClass('icon_holder_'+index);
				icon_holder.attr('data-icon-number',index);
				
				
				on_icon_holder.addClass('on_icon_number_'+index);
				off_icon_holder.addClass('off_icon_number_'+index);
				
				var clone_settings = jQuery('.single-icon-settings.cloneable').clone();
				
				clone_settings.removeClass('cloneable');
				
				if(icon_holder.hasClass('is_default_selection'))
					{
					clone_settings.prepend('<small>Default Select</small>');
					clone_settings.addClass('default_icon_select');
					}
				clone_settings.find('.icon-field-icon-off-color').addClass('off_color_for_icon_'+index);
				clone_settings.find('.icon-field-icon-on-color').addClass('on_color_for_icon_'+index);
				
				clone_settings.find('.current_field_icon_off').addClass('setting_off_icon_number_'+index);
				clone_settings.find('.current_field_icon_on').addClass('setting_on_icon_number_'+index);
				
				clone_settings.find('.current_field_icon_on').html('<i class="'+ on_icon.attr('class')  +'"></span>');
				clone_settings.find('.current_field_icon_off').html('<i class="'+ off_icon.attr('class')  +'"></span>');
				
				clone_settings.find('.current_field_icon_on').attr('data-edit-icon','on_icon_number_'+index)
				clone_settings.find('.current_field_icon_off').attr('data-edit-icon','off_icon_number_'+index)
				
				clone_settings.find('input[name="set_icon_value"]').attr('data-edit-icon',index);
				clone_settings.find('input[name="set_icon_tooltip"]').attr('data-edit-icon',index);
				
				clone_settings.find('input[name="set_icon_value"]').val(the_input.val());
				clone_settings.find('input[name="set_icon_tooltip"]').val(off_label.html());
				
				clone_settings.find('.duplicate_icon').attr('data-icon-id',index);
				clone_settings.find('.delete_icon').attr('data-icon-id',index);
				
				jQuery('.icon-selection').append(clone_settings);
				
				
				//SET ICON FIELD SETTINGS
				//ICON ON COLOR
					change_color('on_color_for_icon_'+index, '.on_icon_number_'+index+ ' span' ,'color','data-on-color','');
				//ICON OFF COLOR
					change_color('off_color_for_icon_'+index, '.off_icon_number_'+index+ ' span' ,'color','','');
				
				//GET INPUT RADIO BACKGOUND COLOR	
					
					clone_settings.find(".icon-field-icon-off-color").spectrum("set", off_icon.css('color'));
					clone_settings.find(".icon-field-icon-on-color").spectrum("set", on_icon.css('color')); //current_field.find('#the-radios').attr('data-checked-bg-color') );
			
				}
			);	
		if(input_container.hasClass('icon-dropdown'))
			{
			jQuery('.single-icon-settings.default_icon_select').show();
			}
		else
			{
			jQuery('.single-icon-settings.default_icon_select').hide();	
			}
		
		set_field_attachments();	
		update_select('#attach_to_field');
}


//SETUP MATH LOGIC
function get_math_settings()
	{
	var set_current_fields_math_logic = '';
	set_current_fields_math_logic += '<option value="" selected="selected">--- Select ---</option><optgroup label="Text Fields">';
	jQuery('div.nex-forms-container div.form_field input[type="text"]').each(
		function()
			{
			if(jQuery(this).attr('name')!='multi_step_name' && jQuery(this).attr('name')!='multi_step_icon' && jQuery(this).attr('name')!='multi_step_description' && jQuery(this).attr('name')!='multi_step_time_limit')
				set_current_fields_math_logic += '<option value="{'+ format_illegal_chars(jQuery(this).attr('name'))  +'}">'+ unformat_name(jQuery(this).attr('name')) +'</option>';
			}
		);	
	set_current_fields_math_logic += '</optgroup>';
	
	set_current_fields_math_logic += '<optgroup label="Radio Buttons">';
	var old_radio = '';
	var new_radio = '';
	
	jQuery('div.nex-forms-container div.form_field input[type="radio"]').each(
		function()
			{
			old_radio = jQuery(this).attr('name');
			if(old_radio != new_radio)
				set_current_fields_math_logic += '<option value="{'+ format_illegal_chars(jQuery(this).attr('name'))  +'}">'+ unformat_name(jQuery(this).attr('name')) +'</option>';
			
			new_radio = old_radio;
			
			}
		);	
	set_current_fields_math_logic += '</optgroup>';
	
	var old_check = '';
	var new_check = '';
	set_current_fields_math_logic += '<optgroup label="Check Boxes">';
	jQuery('div.nex-forms-container div.form_field input[type="checkbox"]').each(
		function()
			{
			old_check = jQuery(this).attr('name');
			if(old_check != new_check)
				set_current_fields_math_logic += '<option value="{'+ jQuery(this).attr('name')  +'}">'+ unformat_name(jQuery(this).attr('name')) +'</option>';
			new_check = old_check;
			}
		);	
	set_current_fields_math_logic += '</optgroup>';
	
	set_current_fields_math_logic += '<optgroup label="Selects">';
	jQuery('div.nex-forms-container div.form_field select').each(
		function()
			{
			set_current_fields_math_logic += '<option value="{'+ jQuery(this).attr('name')  +'}">'+ unformat_name(jQuery(this).attr('name')) +'</option>';
			}
		);	
	set_current_fields_math_logic += '</optgroup>';
	
	set_current_fields_math_logic += '<optgroup label="Text Areas">';
	jQuery('div.nex-forms-container div.form_field textarea').each(
		function()
			{
			set_current_fields_math_logic += '<option value="{'+ format_illegal_chars(jQuery(this).attr('name'))  +'}">'+ unformat_name(jQuery(this).attr('name')) +'</option>';
			}
		);	
	set_current_fields_math_logic += '</optgroup>';
						
	jQuery('select[name="math_fields"]').html(set_current_fields_math_logic);
	
	jQuery('#set_math_input_name').val(format_illegal_chars(current_field.find('.set_math_result').attr('name')))
	jQuery('#set_decimals').val(current_field.find('.the_input_element').attr('data-decimal-places'));
	jQuery('#set_decimals_delimiter').val(current_field.find('.the_input_element').attr('data-decimal-separator'));
	jQuery('#set_thousand_delimiter').val(current_field.find('.the_input_element').attr('data-thousand-separator'));
	
	jQuery('#set_math_logic_equation').val(current_field.find('.the_input_element').attr('data-math-equation'))
	
	
	//GET COUNT ANIMATION
	jQuery('.enable_count_animation button').removeClass('active');
	if(!current_field.find('.the_input_element').attr('data-animate-count') || current_field.find('.the_input_element').attr('data-animate-count')=='yes')
		jQuery('.enable_count_animation button.yes').addClass('active');
	if(current_field.find('.the_input_element').attr('data-animate-count')=='no')
		jQuery('.enable_count_animation button.no').addClass('active');
	
	
	}



function get_label_settings(){		
//LABEL TEXT
	jQuery('div.field-settings-column #set_label').val(current_field.find('label span.the_label').html())

//GET LABEL BIU
	get_biu_style(current_field,'span.label','span.the_label','bold')
	get_biu_style(current_field,'span.label','span.the_label','italic')
	get_biu_style(current_field,'span.label','span.the_label','underline')
	
//GET SUB LABEL BIU	
	get_biu_style(current_field,'span.sub-label','small.sub-text','bold')
	get_biu_style(current_field,'span.sub-label','small.sub-text','italic')
	get_biu_style(current_field,'span.sub-label','small.sub-text','underline')
	
//GET LABEL COLOR	
	jQuery(".label-color").spectrum("set", current_field.find('span.the_label').css('color'));
//GET SUB-LABEL COLOR
	jQuery(".sub-label-color").spectrum("set", current_field.find('small.sub-text').css('color'));

//GET LABEL SIZES
	var label_font_size  			= (label_container.find('.the_label').css('font-size')) ? label_container.find('.the_label').css('font-size') : '14';
	var sub_label_font_size  		= (label_container.find('.sub-text').css('font-size')) ? label_container.find('.sub-text').css('font-size') : '12';
	
	var label_margin_bottom  		= (label_container.find('.the_label').css('margin-bottom')) ? label_container.find('.the_label').css('margin-bottom') : '0';
	var sub_label_margin_bottom  	= (label_container.find('.sub-text').css('margin-bottom')) ? label_container.find('.sub-text').css('margin-bottom') : '0';
	
	var set_label_font_size 		= label_font_size.replace('px','');
	var set_sub_label_font_size 	= sub_label_font_size.replace('px','');
	var set_label_margin_bottom 	= label_margin_bottom.replace('px','');
	var set_sub_label_margin_bottom = sub_label_margin_bottom.replace('px','');
	
	
	jQuery('#set_label_font_size').val(set_label_font_size);
	jQuery('#set_sub_label_font_size').val(set_sub_label_font_size);
	
	jQuery('#set_label_margin_bottom').val(set_label_margin_bottom);
	jQuery('#set_sub_label_margin_bottom').val(set_sub_label_margin_bottom);

		
//SUB-LABEL TEXT
	jQuery('div.field-settings-column #set_subtext').val(current_field.find('label small.sub-text').html())
	
//GET LABEL POSITION
	jQuery('.label-position button').removeClass('active');
	if(label_container.hasClass('col-sm-12') && label_container.attr('style')!='display: none;')
		jQuery('.label-position button.top').addClass('active');
	if(!label_container.hasClass('col-sm-12') && !label_container.hasClass('pos_right'))
		jQuery('.label-position button.left').addClass('active');
	if(label_container.hasClass('pos_right'))
		jQuery('.label-position button.right').addClass('active');
	if(label_container.attr('style')=='display: none;')
		jQuery('.label-position button.none').addClass('active');
		
//GET LABEL ALINGMENT

	jQuery('.label-text-alignment').removeClass('active');
	if(label_container.find('.the_label').hasClass('align_right'))
		jQuery('.label-text-alignment.text-right').addClass('active');	
	else if(label_container.find('.the_label').hasClass('align_center'))
		jQuery('.label-text-alignment.text-center').addClass('active');
	else
		jQuery('.label-text-alignment.text-left').addClass('active');

	jQuery('.sub-label-text-alignment').removeClass('active');
	if(label_container.find('.sub-text').hasClass('align_right'))
		jQuery('.sub-label-text-alignment.text-right').addClass('active');	
	else if(label_container.find('.sub-text').hasClass('align_center'))
		jQuery('.sub-label-text-alignment.text-center').addClass('active');
	else
		jQuery('.sub-label-text-alignment.text-left').addClass('active');

	
//GET LABEL SIZE
	jQuery('.label-size button').removeClass('active');
	if(label_container.find('label').hasClass('text-lg'))
		jQuery('.label-size button.large').addClass('active');
	else if(label_container.find('label').hasClass('text-sm'))
		jQuery('.label-size button.small ').addClass('active');
	else
		jQuery('.label-size button.normal').addClass('active');
	
	for(var i=1;i<=12;i++)
		{
		if(label_container.hasClass('col-sm-'+i))
			var get_label_width = i;
		}
	
//GET LABEL WIDTH	
	jQuery('div.field-settings-column #slider').slider({ value: get_label_width});
	jQuery('div.field-settings-column .width_indicator.left input').val(get_label_width);
	if(get_label_width<12)
		jQuery('div.field-settings-column .width_indicator.right input').val(12-get_label_width);
	else
		jQuery('div.field-settings-column .width_indicator.right input').val(get_label_width);

}

function get_input_settings(){
	
	
	//GET GOOGLE FONT #google_font_html
	var get_obj_font = format_illegal_chars(input_element.css('font-family'));
	if(get_obj_font)
		{
		get_obj_font = get_obj_font.replace('-','')
		get_obj_font = get_obj_font.replace('_','')
		/*console.log('#'+get_obj_font);*/
		
	
		jQuery('select[name="google_font_html"] option').prop('selected',false);
		jQuery('select[name="google_font_html"] option.'+get_obj_font).prop('selected',true);
		}
	if(!current_field.hasClass('is_panel') && !current_field.hasClass('grid-system') && !current_field.hasClass('html_image') && !current_field.hasClass('star-rating'))
		jQuery( "#set_font_size" ).val(input_element.css('font-size').replace('px',''));
	
	if(current_field.hasClass('math_logic_slider'))
		{
		
		//GET INPUT SIZE
		jQuery('.math-slider-size button').removeClass('active');
		if(input_element.closest('.math-slider-wrapper').hasClass('nf-lg'))
			jQuery('.math-slider-size button.large').addClass('active');
		else if(input_element.closest('.math-slider-wrapper').hasClass('nf-sm'))
			jQuery('.math-slider-size button.small ').addClass('active');
		else
			jQuery('.math-slider-size button.normal').addClass('active');
		
		
		jQuery('#set_maximum_range').val(current_field.find('.the_input_element').attr('data-max-value'));
		
		
		change_color('set-math-slider-handel-bg-color','.math-slider-progress-bar-total','background-color','','');
		change_color('set-math-slider-bg-color','.math-slider-progress','background-color','','');
		change_color('set-math-slider-fill-color','.math-slider-progress-bar','background-color','','');
		
		
		jQuery(".set-math-slider-handel-bg-color").spectrum("set", input_container.find('.math-slider-progress-bar-total').css('background-color'));
		jQuery(".set-math-slider-bg-color").spectrum("set", input_container.find('.math-slider-progress').css('background-color'));
		jQuery(".set-math-slider-fill-color").spectrum("set", input_container.find('.math-slider-progress-bar').css('background-color'));
		}
		
		
	if(current_field.hasClass('icon'))
		{
		jQuery( "#set_icon_size" ).val(input_element.css('font-size').replace('px',''));
		
		var icon_border_size = (current_field.find('.icon_container').css('border-top-width')) ? current_field.find('.icon_container').css('border-top-width') : '0';
		var set_icon_border_size = icon_border_size.replace('px','');
		jQuery('#set_icon_border_size').val(set_icon_border_size);
		
		jQuery('.current_icon_element i').attr('class',current_field.find('.icon_element span').attr('class'))
		
		jQuery('#set_icon_element').val(current_field.find('.icon_element span').attr('class'));
		jQuery(".icon-border-color").spectrum("set", current_field.find('.icon_container').css('border-top-color'));
		
		jQuery('.icon-alignment').removeClass('active');
		if(current_field.find('.icon_container_wrapper').hasClass('icon_right'))
			jQuery('.icon-alignment.icon-right').addClass('active');
		else if(current_field.find('.icon_container_wrapper').hasClass('icon_center'))
			jQuery('.icon-alignment.icon-center').addClass('active');
		else
			jQuery('.icon-alignment.icon-left').addClass('active');
		}
		
	var pre_icon_text_size  	= (current_field.find('.prefix span').css('font-size')) ? current_field.find('.prefix span').css('font-size') : '17';
	var post_icon_text_size  	= (current_field.find('.postfix span').css('font-size')) ? current_field.find('.prefix span').css('font-size') : '17';
	if(pre_icon_text_size)
		{
		var set_icon_pre_text_size = pre_icon_text_size.replace('px','');
		jQuery('#set_icon_font_size_before').val(set_icon_pre_text_size);
		}
	if(post_icon_text_size)
		{
		var set_icon_post_text_size = post_icon_text_size.replace('px','');
		jQuery('#set_icon_font_size_after').val(set_icon_post_text_size);
		}
	
	jQuery('.text-alignment').removeClass('active');
		if(input_element.hasClass('align_right'))
			jQuery('.text-alignment.text-right').addClass('active');
		else if(input_element.hasClass('align_center'))
			jQuery('.text-alignment.text-center').addClass('active');
		else
			jQuery('.text-alignment.text-left').addClass('active');
	
	
	if(current_field.hasClass('grid-system'))
		{
		jQuery( "#replication_limit" ).val((current_field.find('.grid_row').attr('data-replication-limit')) ? current_field.find('.grid_row').attr('data-replication-limit') : '0');
		
		jQuery('.recreate-grid button').removeClass('active');
		if(current_field.hasClass('grid-replication-enabled'))
			jQuery('.recreate-grid button.enable-recreation').addClass('active');
		else
			jQuery('.recreate-grid button.disable-recreation').addClass('active');
		
		
		
		jQuery('.setting-responsive-grid button').removeClass('active');
		var grid_parent_class_pre = '.id-'+current_field.attr('id');
		if(current_field.find('.grid-width-slider'+grid_parent_class_pre).attr('data-col-class')=='xs')
			jQuery('.setting-responsive-grid button.set-xs').addClass('active');
		if(current_field.find('.grid-width-slider'+grid_parent_class_pre).attr('data-col-class')=='sm')
			jQuery('.setting-responsive-grid button.set-sm').addClass('active');
		if(current_field.find('.grid-width-slider'+grid_parent_class_pre).attr('data-col-class')=='md')
			jQuery('.setting-responsive-grid button.set-md').addClass('active');
		if(current_field.find('.grid-width-slider'+grid_parent_class_pre).attr('data-col-class')=='lg')
			jQuery('.setting-responsive-grid button.set-lg').addClass('active');

		
		
		jQuery('div.field-settings-column #set_grid_name').val(current_field.attr('data-grid-name'))
		
		
		jQuery('.settings-grid-system').hide();
		
		if(current_field.hasClass('grid-system-1'))
			{
			jQuery('.settings-col-1').show();	
			}
		if(current_field.hasClass('grid-system-2'))
			{
			jQuery('.settings-col-1').show();
			jQuery('.settings-col-2').show();	
			}
		if(current_field.hasClass('grid-system-3'))
			{
			jQuery('.settings-col-1').show();
			jQuery('.settings-col-2').show();
			jQuery('.settings-col-3').show();		
			}
		if(current_field.hasClass('grid-system-4'))
			{
			jQuery('.settings-col-1').show();
			jQuery('.settings-col-2').show();
			jQuery('.settings-col-3').show();
			jQuery('.settings-col-4').show();		
			}
		if(current_field.hasClass('grid-system-6'))
			{
			jQuery('.settings-col-1').show();
			jQuery('.settings-col-2').show();
			jQuery('.settings-col-3').show();
			jQuery('.settings-col-4').show();
			jQuery('.settings-col-5').show();
			jQuery('.settings-col-6').show();		
			}
		
		
		for(var i=0;i<=5;i++)
		{
		jQuery('.col-'+(i+1)+'-width button').removeClass('active');
		var grid_col = current_field.find('.row .grid_input_holder:eq('+i+')');
		if(grid_col)
			{
			var grid_class = grid_col.attr('class');
			if(grid_class)
				var grid_class2 = grid_class.replace('grid_input_holder','');
			if(grid_class2)
				var grid_class3 = grid_class2.replace('-sm','');
			if(grid_class3)
				{
				jQuery('.col-'+(i+1)+'-width button.'+grid_class3.trim()).addClass('active');
				}
			}
		}
		
	}
	
	
	
	
		

		
//GET IMAGE CHOICE SETTIGS
	
if(current_field.hasClass('image-choices-field'))
		{	
		
		
		jQuery('.thumb-auto-step button').removeClass('active');
		if(current_field.hasClass('auto-step'))
			jQuery('.thumb-auto-step button.auto-step-yes').addClass('active');
		else
			jQuery('.thumb-auto-step button.auto-step-no').addClass('active');	
		
		jQuery('.thumb-selection-type button').removeClass('active');
		if(current_field.hasClass('multi-images-choice'))
			{
			jQuery('.thumb-auto-step').hide();
			jQuery('.thumb-selection-type button.multi-thumd-select').addClass('active');
			}
		else
			{
			jQuery('.thumb-auto-step').show();
			jQuery('.thumb-selection-type button.single-thumb-select').addClass('active');
			}
		
		
		jQuery(document).on('click','.align-thumbs button',
				function()
					{
					jQuery('.align-thumbs button').removeClass('active');
					jQuery(this).addClass('active');
					input_container.removeClass('thumbs-left').removeClass('thumbs-right').removeClass('thumbs-center')
					if(jQuery(this).hasClass('left'))
						input_container.addClass('thumbs-left')
					if(jQuery(this).hasClass('right'))
						input_container.addClass('thumbs-right')
					if(jQuery(this).hasClass('center'))
						input_container.addClass('thumbs-center')
					}
				);
		
		jQuery('.align-thumbs button').removeClass('active');
		if(input_container.hasClass('thumbs-right'))
			{
			jQuery('.align-thumbs button.right').addClass('active');
			}
		else if(input_container.hasClass('thumbs-center'))
			{
			jQuery('.align-thumbs button.center').addClass('active');
			}
		else
			{
			jQuery('.align-thumbs button.left').addClass('active');
			}
			
		
		jQuery('.set-dimentions').removeClass('active');
		if(current_field.hasClass('cropped'))
			{
			jQuery('.thumbs-direction').parent().show();
			jQuery('.align-thumbs').parent().show();
			jQuery('.s-thumbs-select .display-radios-checks').parent().hide();
			jQuery('.set-dimentions.image-crop').addClass('active');
			jQuery('#thumb-image-width').spinner("enable")
			}
		else
			{
			jQuery('.thumbs-direction').parent().hide();
			jQuery('.align-thumbs').parent().hide();
			jQuery('.s-thumbs-select .display-radios-checks').parent().show();	
			jQuery('.set-dimentions.image-auto').addClass('active');
			jQuery('#thumb-image-width').spinner("disable")
			}
		jQuery('.thumbs-direction button').removeClass('active');
		if(current_field.find('.image-choices-choice').hasClass('display-block'))
			{
			jQuery('.thumbs-direction .1c').addClass('active');
			}
		else
			{
			jQuery('.thumbs-direction .inline').addClass('active');
			
			}
		
		var thumb_wrapper_padding 		= (input_container.find('.image-choices-choice label.radio-inline').css('padding')) ? input_container.find('.image-choices-choice label.radio-inline').css('padding') : '5';
		var image_wrapper_padding 		= (input_container.find('.image-choices-choice .image-choices-choice-image-wrap').css('padding')) ? input_container.find('.image-choices-choice .image-choices-choice-image-wrap').css('padding') : '0';
		var label_wrapper_padding 		= (input_container.find('.image-choices-choice .image-choices-choice-text').css('padding')) ? input_container.find('.image-choices-choice .image-choices-choice-text').css('padding') : '15';
		
		var set_thumb_wrapper_padding 	= thumb_wrapper_padding.replace('px','');
		var set_image_wrapper_padding 	= image_wrapper_padding.replace('px','');
		var set_label_wrapper_padding 	= label_wrapper_padding.replace('px','');
		
		
		
		jQuery('#thumb-wrapper-padding').val(set_thumb_wrapper_padding);
		jQuery('#image-wrapper-padding').val(set_image_wrapper_padding);
		jQuery('#label-wrapper-padding').val(set_label_wrapper_padding);
		
		
		var image_wrapper_width 		= (input_container.find('.image-choices-choice').css('width')) ? input_container.find('.image-choices-choice').css('width') : '0';
		var image_wrapper_height 		= (input_container.find('.image-choices-choice .image-choices-choice-image-wrap img').css('height')) ? input_container.find('.image-choices-choice .image-choices-choice-image-wrap img').css('height') : '0';
		
		var set_image_wrapper_width 	= image_wrapper_width.replace('px','');
		var set_image_wrapper_height 	= image_wrapper_height.replace('px','');
		
		
		jQuery('#thumb-image-width').val(set_image_wrapper_width-1);
		jQuery('#thumb-image-height').val(set_image_wrapper_height);
		
		
		var thumb_wrapper_border_width 		= (input_container.find('.image-choices-choice label.radio-inline').css('border-width')) ? input_container.find('.image-choices-choice label.radio-inline').css('border-width') : '0';
		var image_wrapper_border_width 		= (input_container.find('.image-choices-choice .image-choices-choice-image-wrap').css('border-width')) ? input_container.find('.image-choices-choice .image-choices-choice-image-wrap').css('border-width') : '0';
		var label_wrapper_border_width 		= (input_container.find('.image-choices-choice .image-choices-choice-text').css('border-width')) ? input_container.find('.image-choices-choice .image-choices-choice-text').css('border-width') : '0';
		
		var set_thumb_wrapper_border_width 	= thumb_wrapper_border_width.replace('px','');
		var set_image_wrapper_border_width 	= image_wrapper_border_width.replace('px','');
		var set_label_wrapper_border_width 	= label_wrapper_border_width.replace('px','');
		
		
		var image_wrapper_border_radius 		= (input_container.find('.image-choices-choice .image-choices-choice-image-wrap').css('border-radius')) ? input_container.find('.image-choices-choice .image-choices-choice-image-wrap').css('border-radius') : '0';
		var label_wrapper_border_radius 		= (input_container.find('.image-choices-choice .image-choices-choice-text').css('border-radius')) ? input_container.find('.image-choices-choice .image-choices-choice-text').css('border-radius') : '0';

		var set_image_wrapper_border_radius 	= image_wrapper_border_radius.replace('px','');
		var set_label_wrapper_border_radius 	= label_wrapper_border_radius.replace('px','');
		
		
		
		
		jQuery('#thumb-wrapper-padding').val(set_thumb_wrapper_padding);
		jQuery('#image-wrapper-padding').val(set_image_wrapper_padding);
		jQuery('#label-wrapper-padding').val(set_label_wrapper_padding);
		
		jQuery('#thumb-wrapper-border-width').val(set_thumb_wrapper_border_width);
		jQuery('#image-wrapper-border-width').val(set_image_wrapper_border_width);
		jQuery('#label-wrapper-border-width').val(set_label_wrapper_border_width);
		
		jQuery('#image-wrapper-border-radius').val(set_image_wrapper_border_radius);
		jQuery('#label-wrapper-border-radius').val(set_label_wrapper_border_radius);
				
				
		
		get_biu_style(current_field,'span.thumb','.image-choices-choice .image-choices-choice-text','bold')
		get_biu_style(current_field,'span.thumb','.image-choices-choice .image-choices-choice-text','italic')
		get_biu_style(current_field,'span.thumb','.image-choices-choice .image-choices-choice-text','underline')
				
		var label_wrapper_font_size 	= (input_container.find('.image-choices-choice .image-choices-choice-text').css('font-size')) ? input_container.find('.image-choices-choice .image-choices-choice-text').css('font-size') : '0';
		var set_label_wrapper_font_size 		= label_wrapper_font_size.replace('px','');
		jQuery('#set_thumb_font_size').val(set_label_wrapper_font_size);
				
		
		var label_wrapper_margin_top 		= (input_container.find('.image-choices-choice .image-choices-choice-text').css('margin-top')) ? input_container.find('.image-choices-choice .image-choices-choice-text').css('margin-top') : '0';
		var label_wrapper_margin_right 		= (input_container.find('.image-choices-choice .image-choices-choice-text').css('margin-right')) ? input_container.find('.image-choices-choice .image-choices-choice-text').css('margin-right') : '0';
		var label_wrapper_margin_bottom 	= (input_container.find('.image-choices-choice .image-choices-choice-text').css('margin-bottom')) ? input_container.find('.image-choices-choice .image-choices-choice-text').css('margin-bottom') : '0';
		var label_wrapper_margin_left 		= (input_container.find('.image-choices-choice .image-choices-choice-text').css('margin-left')) ? input_container.find('.image-choices-choice .image-choices-choice-text').css('margin-left') : '0';

		var set_label_wrapper_margin_top 		= label_wrapper_margin_top.replace('px','');	
		var set_label_wrapper_margin_right 		= label_wrapper_margin_right.replace('px','');	
		var set_label_wrapper_margin_bottom 	= label_wrapper_margin_bottom.replace('px','');	
		var set_label_wrapper_margin_left 		= label_wrapper_margin_left.replace('px','');	

		jQuery('#set_thumb_label_margin_top').val(set_label_wrapper_margin_top);
		jQuery('#set_thumb_label_margin_right').val(set_label_wrapper_margin_right);
		jQuery('#set_thumb_label_margin_bottom').val(set_label_wrapper_margin_bottom);
		jQuery('#set_thumb_label_margin_left').val(set_label_wrapper_margin_left);
		
		jQuery('.thumb-text-alignment').removeClass('active');
		if(input_container.find('.image-choices-choice .image-choices-choice-text').hasClass('align_right'))
			jQuery('.thumb-text-alignment.text-right').addClass('active');	
		else if(input_container.find('.image-choices-choice .image-choices-choice-text').hasClass('align_left'))
			jQuery('.thumb-text-alignment.text-left').addClass('active');
		else
			jQuery('.thumb-text-alignment.text-center').addClass('active');
		
		
		var google_fonts_thumbs = jQuery('#google_fonts_thumbs').attr('data-selected');
		if(google_fonts_thumbs)
			{
			google_fonts_thumbs = google_fonts_thumbs.replace(' ','.')
			
			jQuery('select[name="google_fonts_thumbs"] option').prop('selected',false);
			jQuery('select[name="google_fonts_thumbs"] option.'+google_fonts_thumbs).prop('selected',true);
			jQuery('select[name="google_fonts_thumbs"]').trigger('change');
			}
		
		
		}

//GET IMAGE SETTINGS
	//ALT TEXT
	if(current_field.hasClass('html_image'))
		{
		jQuery('#set_alt_text').val(current_field.find('img').attr('alt'));
		
		var image_width = current_field.find('img').css('width');
		if(image_width)
			{
			image_width = image_width.replace('px','');
			jQuery( "#set_image_width" ).val(image_width);
			}
		var image_height = current_field.find('img').css('height');
		
		if(image_width)
			{
			image_height = image_height.replace('px','');
			jQuery( "#set_image_height" ).val(image_height);
			}
		
		
		
		jQuery( "#set_image_width" ).spinner(
				{ 
				min:20,  
				spin: function( event, ui ) 
						{
						current_field.find('.the-image-container').css('width',ui.value+'px');
						current_field.find('.ui-wrapper').css('width',ui.value+'px');
						current_field.find('img').css('width',ui.value+'px');
						}
				}
			).on('keyup', function(e)
					{
					current_field.find('.the-image-container').css('width',jQuery(this).val()+'px');
					current_field.find('.ui-wrapper').css('width',jQuery(this).val()+'px');
					current_field.find('img').css('width',jQuery(this).val()+'px');
					});
					
		jQuery( "#set_image_height" ).spinner(
				{ 
				min:20,  
				spin: function( event, ui ) 
						{
						current_field.find('.the-image-container').css('height',ui.value+'px');
						current_field.find('.ui-wrapper').css('height',ui.value+'px');
						current_field.find('img').css('height',ui.value+'px');
						}
				}
			).on('keyup', function(e)
					{
					current_field.find('.the-image-container').css('height',jQuery(this).val()+'px');
					current_field.find('.ui-wrapper').css('height',jQuery(this).val()+'px');
					current_field.find('img').css('height',jQuery(this).val()+'px');
					});
		
		
		
		}
	



//GET SIGS SETTINGS	
	if(current_field.hasClass('digital-signature'))
		{
		
		jQuery(".stroke-color").spectrum("set", (current_field.find('.js-signature').attr('data-line-color')) ? current_field.find('.js-signature').attr('data-line-color') : '#222222');
		
		jQuery(".sig-bg-color").spectrum("set", (current_field.find('.js-signature').attr('data-background')) ? current_field.find('.js-signature').attr('data-background') : '#ffffff');
		
		jQuery(".sig-br-color").spectrum("set", (current_field.find('.js-signature').attr('data-border')) ? current_field.find('.js-signature').attr('data-border') : '#aaa');
		
		
		jQuery('.auto_fit button').removeClass('active');
		if(current_field.find('.js-signature').attr('data-auto-fit')=='true')
			{
			jQuery('.auto_fit button.yes').addClass('active');
			jQuery('#set_signature_width').spinner( "disable" );
			}
		else
			{
			jQuery('.auto_fit button.no').addClass('active');
			jQuery('#set_signature_width').spinner( "enable" );
			}
			
		
		jQuery('.sig-alignment').removeClass('active');
		if(current_field.find('.js-signature').hasClass('sig-right'))
			jQuery('.sig-alignment.sig-right').addClass('active');	
		else if(current_field.find('.js-signature').hasClass('sig-center'))
			jQuery('.sig-alignment.sig-center').addClass('active');
		else
			jQuery('.sig-alignment.sig-left').addClass('active');
			
			
		jQuery('#set_signature_width').val( (current_field.find('.js-signature').attr('data-width')) ? current_field.find('.js-signature').attr('data-width') : 300);
		jQuery('#set_signature_height').val( (current_field.find('.js-signature').attr('data-height')) ? current_field.find('.js-signature').attr('data-height') : 100);
		
		jQuery('#set_signature_line_width').val( (current_field.find('.js-signature').attr('data-line-width')) ? current_field.find('.js-signature').attr('data-line-width') : 2);
		
		}
	
	
	
	
	
//GET TAGS SETTINGS
	if(current_field.hasClass('tags'))
		{
		jQuery('#max_tags').val(current_field.find('#tags').attr('data-max-tags'))
		}
//GET THUMB RATING SETTINGS
	if(current_field.hasClass('thumb-rating'))
		{
		jQuery('#set_thumbs_up_val').val(current_field.find('input.nf-thumbs-o-up').attr('value'));
		jQuery('#set_thumbs_down_val').val(current_field.find('input.nf-thumbs-o-down').attr('value'));
		}	

//GET SMILY RATING SETTINGS
	if(current_field.hasClass('smily-rating'))
		{
		
		jQuery('#set_smily_frown_val').val(current_field.find('input.nf-smile-bad').attr('value'));
		jQuery('#set_smily_average_val').val(current_field.find('input.nf-smile-average').attr('value'));
		jQuery('#set_smily_good_val').val(current_field.find('input.nf-smile-good').attr('value'));
		}
	
//GET ICON FIELD SETTINGS
	if(current_field.hasClass('icon-select-group'))
		{
		
		//RESET ICON FIELD COLORS
		
		
		
		
		change_color('icon-field-icon-off-color-overall', '.off-icon span' ,'color','','');
		change_color('icon-field-icon-on-color-overall', '.on-icon span' ,'color','','');
		
		change_color('icon-field-label-off-color-overall', '.off-label' ,'color','','');
		change_color('icon-field-label-on-color-overall', '.on-label' ,'color','','');
		
		
		change_color('icon-dropdown-bg', '.icon-dropdown .icon-container' ,'background','','');
		change_color('icon_dropdown_border_color', '.icon-dropdown .icon-container' ,'border-color','','');

		setup_icon_options(current_field);		
		
		jQuery( "#icon_field_icon_size" ).spinner(
				{ 
				min:12, 
				max:300,  
				spin: function( event, ui ) 
						{
						current_field.find('.icon-select span').css('font-size',ui.value+'px');
						current_field.find('.icon-label div').css('line-height',ui.value+'px');
						current_field.find('span.fa-caret-down').css('line-height',ui.value+'px');
						}
				}
			).on('keyup', function(e)
						{
						current_field.find('.icon-select span').css('font-size',jQuery(this).val()+'px');
						current_field.find('.icon-label div').css('line-height',jQuery(this).val()+'px');
						current_field.find('span.fa-caret-down').css('line-height',jQuery(this).val()+'px');
						});
		
		jQuery( "#icon_field_label_size" ).spinner(
				{ 
				min:12, 
				max:300,  
				spin: function( event, ui ) 
						{
						current_field.find('.icon-label div').css('font-size',ui.value+'px');
						}
				}
			).on('keyup', function(e)
				{
				current_field.find('.icon-label div').css('font-size',jQuery(this).val()+'px');
				});	
		
		jQuery( "#icon_dropdown_width" ).spinner(
				{  
				min:0,  
				spin: function( event, ui ) 
						{
						current_field.find('.icon-dropdown .icon-container').css('width',ui.value+'px');
						}
				}
			).on('keyup', function(e)
				{
				current_field.find('.icon-dropdown .icon-container').css('width',jQuery(this).val()+'px');
				});	
		
		jQuery( "#icon_dropdown_border" ).spinner(
				{  
				min:0,  
				spin: function( event, ui ) 
						{
						current_field.find('.icon-dropdown .icon-container').css('border-width',ui.value+'px');
						}
				}
			).on('keyup', function(e)
				{
				current_field.find('.icon-dropdown .icon-container').css('border-width',jQuery(this).val()+'px');
				});	
		setTimeout(function()
			{
			jQuery('.settings-icon-field .ui-spinner .px_text').remove();
			jQuery('.settings-icon-field .ui-spinner').prepend('<span class="px_text">px</span>');
			
			},100);
		
		update_select('.icon_field_on_animation');
		
		
		jQuery('.icon-selection-type button').removeClass('active');
		if(current_field.hasClass('multi-icon-select'))
			{
			jQuery('.icon-auto-step').hide();
			jQuery('.icon-selection-type button.multi-icon-select').addClass('active');
			}
		else
			{
			jQuery('.icon-auto-step').show();
			jQuery('.icon-selection-type button.single-icon-select').addClass('active');
			}
		
		
		
		
		
			
		//AUTO STEP
		jQuery('.icon-auto-step button').removeClass('active');
		if(current_field.hasClass('auto-step'))
			jQuery('.icon-auto-step button.auto-step-yes').addClass('active');
		else
			jQuery('.icon-auto-step button.auto-step-no').addClass('active');
		
			
		jQuery('.icon-select-type button').removeClass('active');
		if(input_container.hasClass('icon-dropdown'))
			{
			jQuery('.icon-select-type button.icon-dropdown-select').addClass('active');
			jQuery('.settings-input-styling').show();	
			jQuery('.settings-icon-drop-down-styling').show();
			}
		else if(input_container.hasClass('icon-spinner'))
			{
			jQuery('.icon-select-type button.icon-spin-select').addClass('active');
			jQuery('.settings-input-styling').hide();
			jQuery('.settings-icon-drop-down-styling').hide();
			}
		else
			{
			jQuery('.icon-select-type button.icon-normal-select').addClass('active');
			jQuery('.settings-input-styling').hide();
			jQuery('.settings-icon-drop-down-styling').hide();
			}
		
		//GET ICON LAYOUT
		jQuery('.set-icon-colums button').removeClass('active');
		if(input_container.attr('data-layout')=='1c')
			jQuery('.set-icon-colums button.1c').addClass('active');
		else if(input_container.attr('data-layout')=='2c')
			jQuery('.set-icon-colums button.2c').addClass('active');
		else if(input_container.attr('data-layout')=='3c')
			jQuery('.set-icon-colums button.3c').addClass('active'); 
		else if(input_container.attr('data-layout')=='4c')
			jQuery('.set-icon-colums button.4c').addClass('active');
		else if(input_container.attr('data-layout')=='6c')
			jQuery('.set-icon-colums button.6c').addClass('active');
		else
			jQuery('.set-icon-colums button.inline').addClass('active');
		
		
		jQuery('.current_field_icon_off_overall i').attr('class',input_container.find('.off-icon span').last().attr('class'));
		jQuery('.current_field_icon_on_overall i').attr('class',input_container.find('.on-icon span').last().attr('class'));
		jQuery('.current_field_icon_off_overall i').text('');
		jQuery('.current_field_icon_on_overall i').text('');
		
		jQuery(".icon-field-icon-off-color-overall").spectrum("set", input_container.find('.off-icon span').last().css('color') );
		jQuery(".icon-field-icon-on-color-overall").spectrum("set", input_container.find('.on-icon span').last().css('color') );
		
		var icon_size = input_container.find('.off-icon span').css('font-size');
		icon_size = icon_size.replace('px','');
		jQuery('#icon_field_icon_size').val(icon_size);
		
		var animation = (input_container.attr('data-animation') && input_container.attr('data-animation')!='') ? input_container.attr('data-animation') : 'flipInY';
		jQuery('#icon_field_on_animation').attr('data-selected',animation);
		update_select('#icon_field_on_animation');
		
		jQuery('.off-icon-label-bold').removeClass('active');
		if(input_container.find('.off-label').hasClass('style_bold'))
			jQuery('.off-icon-label-bold').addClass('active');
		
		jQuery('.on-icon-label-bold').removeClass('active');
		if(input_container.find('.on-label').hasClass('style_bold'))
			jQuery('.on-icon-label-bold').addClass('active');	
		
		var label_size = input_container.find('.off-label').css('font-size');
		label_size = label_size.replace('px','');
		jQuery('#icon_field_label_size').val(label_size);
		
		
		
		jQuery(".icon-field-label-off-color-overall").spectrum("set", input_container.find('.off-label').css('color') );
		jQuery(".icon-field-label-on-color-overall").spectrum("set", input_container.find('.on-label').css('color') );
		
		
		jQuery('.icon-labels-position').removeClass('active');	
		if(input_container.hasClass('icon-label-top'))
			jQuery('.icon-labels-position.icon-label-top').addClass('active');
		if(input_container.hasClass('icon-label-bottom'))
			jQuery('.icon-labels-position.icon-label-bottom').addClass('active');
		if(input_container.hasClass('icon-label-left'))
			jQuery('.icon-labels-position.icon-label-left').addClass('active');
		if(input_container.hasClass('icon-label-right'))
			jQuery('.icon-labels-position.icon-label-right').addClass('active');
		if(input_container.hasClass('icon-label-tip'))
			jQuery('.icon-labels-position.icon-label-tip').addClass('active');
		if(input_container.hasClass('icon-label-hidden'))
			jQuery('.icon-labels-position.icon-label-hidden').addClass('active');
		
		
		jQuery('#attach_to_field').attr('data-selected',current_field.attr('data-append-to'));
		update_select('#attach_to_field');
		
		
		
		var dropdown_width = input_container.find('.icon-container').css('width');
		if(dropdown_width){
		dropdown_width = dropdown_width.replace('px','');
		jQuery('#icon_dropdown_width').val(dropdown_width);
		}
		jQuery(".icon-dropdown-bg").spectrum("set", input_container.find('.icon-container').css('background') );
		
		change_color('icon-dropdown-bg', '.icon-dropdown .icon-container' ,'background','','');
		change_color('icon_dropdown_border_color', '.icon-dropdown .icon-container' ,'border-color','','');
		
		var icon_dropdown_border = input_container.find('.icon-container').css('border-width');
		
		
		if(icon_dropdown_border){
		icon_dropdown_border = icon_dropdown_border.replace('px','');
		jQuery('#icon_dropdown_border').val(icon_dropdown_border);
		}
		jQuery(".icon_dropdown_border_color").spectrum("set",input_container.find('.icon-container').css('border-top-color') );
		
		
		
		}	
	


	
//GET STAR RATING SETTINGS
	if(current_field.hasClass('star-rating'))
		{

	//GET TOTAL STARS	
		jQuery('#total_stars').val((current_field.find('#star').attr('data-total-stars')) ? current_field.find('#star').attr('data-total-stars') : 5)
		
		jQuery('#star_rating_size').val((current_field.find('#star').attr('data-size')) ? current_field.find('#star').attr('data-size') : 25)
	
		jQuery('.star-rating-alignment').removeClass('active');
		if(input_container.hasClass('align_right'))
			jQuery('.star-rating-alignment.text-right').addClass('active');	
		else if(input_container.find('.the_label').hasClass('align_center'))
			jQuery('.star-rating-alignment.text-center').addClass('active');
		else
			jQuery('.star-rating-alignment.text-left').addClass('active');
		
		
		
		jQuery('.set_half_stars').removeClass('active');
		if(current_field.find('#star').attr('data-enable-half')=='false')
			{
			jQuery('.set_half_stars.no').addClass('active');	
			jQuery('.show-half-rating').addClass('hidden');
			}
		else
			{
			jQuery('.set_half_stars.yes').addClass('active');
			jQuery('.show-half-rating').removeClass('hidden');
			}

		jQuery(".rating-on-icon-text-color").spectrum("set", (current_field.find('#star').attr('data-styleon')) ? current_field.find('#star').attr('data-styleon') : '#ec971f');
		jQuery(".rating-off-icon-text-color").spectrum("set",(current_field.find('#star').attr('data-styleoff')) ? current_field.find('#star').attr('data-styleoff') : '#bbb');
		jQuery(".rating-half-icon-text-color").spectrum("set", (current_field.find('#star').attr('data-stylehalf')) ? current_field.find('#star').attr('data-stylehalf') : '#ec971f');
		
		
		jQuery('.setting_star_rating_on i').attr('class', (current_field.find('#star').attr('data-staron')) ? current_field.find('#star').attr('data-staron') : 'fa fa-star')
		jQuery('.setting_star_rating_off i').attr('class', (current_field.find('#star').attr('data-staroff')) ? current_field.find('#star').attr('data-staroff') : 'fa fa-star-o')
		jQuery('.setting_star_rating_half i').attr('class', (current_field.find('#star').attr('data-starhalf')) ? current_field.find('#star').attr('data-starhalf') : 'fa fa-star-half')
		
		jQuery('#set_rating_icon_on').val((current_field.find('#star').attr('data-staron')) ? current_field.find('#star').attr('data-staron') : 'fa fa-star');
		jQuery('#set_rating_icon_off').val((current_field.find('#star').attr('data-staroff')) ? current_field.find('#star').attr('data-staroff') : 'fa fa-star-o')
		jQuery('#set_rating_icon_half').val((current_field.find('#star').attr('data-starhalf')) ? current_field.find('#star').attr('data-starhalf') : 'fa fa-star-half')
		
		}

	
//GET SELECT SETTINGS	
	if (current_field.hasClass('select') || current_field.hasClass('multi-select'))
		{
	//GET OPTIONS
		var current_options = ''
		current_field.find('select option').each(
			function()
				{
				if(jQuery(this).attr('selected')!='selected')
					{
					if(jQuery(this).text()!=jQuery(this).attr('value'))
						current_options += jQuery(this).attr('value')+'=='+jQuery(this).text() +'\n';
					else
						current_options += jQuery(this).text() +'\n';
					
					}
						
				}
			);
		jQuery('#set_options').val(current_options)
		
	//GET DEFAULT OPTION
		jQuery('#set_default_select_value').val((current_field.find('select option:selected').text()) ? current_field.find('select option:selected').val()+'=='+current_field.find('select option:selected').text() : '--- Select ---')
		}
		

	jQuery('.select-auto-step button').removeClass('active');
	if(current_field.hasClass('auto-step'))
		jQuery('.select-auto-step button.auto-step-yes').addClass('active');
	else
		jQuery('.select-auto-step button.auto-step-no').addClass('active');	
		
//GET RADIO/CHECK SETTINGS	
	if (current_field.hasClass('md-check-group') || current_field.hasClass('md-radio-group') || current_field.hasClass('jq-check-group') || current_field.hasClass('jq-radio-group') || current_field.hasClass('jq-check-group') || current_field.hasClass('jq-radio-group') || current_field.hasClass('check-group') || current_field.hasClass('radio-group') || current_field.hasClass('single-image-select-group') || current_field.hasClass('multi-image-select-group') || current_field.hasClass('image-choices-field'))
		{
		//GET RADIO/CHECK LAYOUT
		jQuery('.display-radios-checks button').removeClass('active');
		if(current_field.find('#the-radios').attr('data-layout')=='1c')
			jQuery('.display-radios-checks button.1c').addClass('active');
		else if(current_field.find('#the-radios').attr('data-layout')=='2c')
			jQuery('.display-radios-checks button.2c').addClass('active');
		else if(current_field.find('#the-radios').attr('data-layout')=='3c')
			jQuery('.display-radios-checks button.3c').addClass('active');
		else if(current_field.find('#the-radios').attr('data-layout')=='4c')
			jQuery('.display-radios-checks button.4c').addClass('active');
		else if(current_field.find('#the-radios').attr('data-layout')=='6c')
			jQuery('.display-radios-checks button.6c').addClass('active');
		else
			jQuery('.display-radios-checks button.inline').addClass('active');
		
		var current_inputs = ''
		if(current_field.hasClass('check-group') || current_field.hasClass('classic-check-group'))
			{
			current_field.find('div span.check-label').each(
				function()
					{
					
					var the_label_text = jQuery(this).html();
					the_label_text = the_label_text.trim();
						
					if(jQuery(this).html()!=jQuery(this).parent().find('input').val())
						current_inputs += jQuery(this).parent().find('input').val()+'=='+the_label_text +'\n';	
					else
						current_inputs += the_label_text +'\n';	
					}
				);	
			}
		else if(current_field.hasClass('md-check-group') || current_field.hasClass('md-radio-group'))
			{
			current_field.find('.radio_check_input label').each(
				function()
					{
					var the_label_text = jQuery(this).text();
					the_label_text = the_label_text.trim();
					
					if(the_label_text!=jQuery(this).parent().find('input').val())
						current_inputs += jQuery(this).parent().find('input').val()+'=='+the_label_text +'\n';	
					else
						current_inputs += the_label_text +'\n';	
					}
				);	
			}
		else if(current_field.hasClass('jq-check-group') || current_field.hasClass('jq-radio-group'))
			{
			current_field.find('.input-label').each(
				function()
					{
					var the_label_text = jQuery(this).text();
					the_label_text = the_label_text.trim();
					
					if(the_label_text!=jQuery(this).parent().find('input').val())
						current_inputs += jQuery(this).parent().find('input').val()+'=='+the_label_text +'\n';	
					else
						current_inputs += the_label_text +'\n';
					}
				);	
			}
		else if(current_field.hasClass('single-image-select-group') || current_field.hasClass('multi-image-select-group'))
			{
			current_field.find('div span.radio-label').each(
				function()
					{
					var the_label_text = jQuery(this).text();
					the_label_text = the_label_text.trim();
					
					if(the_label_text!=jQuery(this).parent().find('input').val())
						current_inputs += jQuery(this).parent().find('input').val()+'=='+the_label_text +'\n';	
					else
						current_inputs += the_label_text +'\n';
					}
				);	
			}
		
		else if(current_field.hasClass('image-choices-field'))
			{
			current_field.find('.input-label').each(
				function()
					{
					var the_label_text = jQuery(this).html();
					the_label_text = the_label_text.trim();
					
					if(the_label_text!=jQuery(this).closest('label').find('input').val())
						current_inputs += jQuery(this).parent().find('input').val()+'=='+the_label_text +'\n';	
					else
						current_inputs += the_label_text +'\n';
					}
				);	
			}
		
		else
			{
			current_field.find('div span.radio-label').each(
				function()
					{
					if(jQuery(this).html()!=jQuery(this).parent().find('input').val())
						current_inputs += jQuery(this).parent().find('input').val()+'=='+jQuery(this).html() +'\n';	
					else
						current_inputs += jQuery(this).html() +'\n';
					}
				);
			}
		jQuery('#set_radios').val(current_inputs)
		
		
//RESET RADIO COLORS
	jQuery(".set-radio-label-color").spectrum("set",'#444444');
	jQuery(".set-radio-text-color").spectrum("set",'#ffffff');
	jQuery(".set-radio-bg-color").spectrum("set",'#ffffff');
	jQuery(".set-radio-bgc-color").spectrum("set",'#8bc34a');
	jQuery(".set-radio-border-color").spectrum("set",'#dddddd');
//GET INPUT RADIO COLOR	
	jQuery(".set-radio-label-color").spectrum("set", current_field.find('span.input-label').css('color'));	
//GET INPUT RADIO COLOR	
	jQuery(".set-radio-text-color").spectrum("set", current_field.find('a').css('color'));	
//GET INPUT RADIO BACKGOUND COLOR	

    if(current_field.find('.the-radios').attr('data-checked-bg-color'))
	jQuery(".set-radio-bgc-color").spectrum("set", current_field.find('.the-radios').attr('data-checked-bg-color') );
//GET INPUT RADIO BORDER COLOR	
	jQuery(".set-radio-border-color").spectrum("set", current_field.find('a').css('border-top-color'));
//GET RADIO ICON
	if(strstr(current_field.find('.the-radios').attr('data-checked-class'),'fa-'))
		{
		jQuery('div.field-settings-column .current_radio_icon i').attr('class','fa '+current_field.find('.the-radios').attr('data-checked-class')).text('')
		jQuery('div.field-settings-column #set_radio_icon').val('fa '+current_field.find('.the-radios').attr('data-checked-class'));
		}
	else
		{
		jQuery('div.field-settings-column .current_radio_icon i').attr('class',current_field.find('.the-radios').attr('data-checked-class')).text('')
		jQuery('div.field-settings-column #set_radio_icon').val(current_field.find('.the-radios').attr('data-checked-class'));
		}
		
	}
	
	
	
//GET SLIDER SETTINGS	
	if (current_field.hasClass('slider') || current_field.hasClass('md-slider'))
		{

	//GET SLIDER COLORS
		jQuery(".set-slider-handel-text-color").spectrum("set",'#444444');
		jQuery(".set-slider-handel-bg-color").spectrum("set",'#ffffff');
		jQuery(".set-slider-handel-border-color").spectrum("set",'#eeeeee');
		jQuery(".set-slider-bg-color").spectrum("set",'#ffffff');
		jQuery(".set-slider-fill-color").spectrum("set",'#f2f2f2');
		jQuery(".set-slider-border-color").spectrum("set",'#eeeeee');
	
		jQuery(".set-slider-handel-text-color").spectrum("set", current_field.find('.ui-slider-handle').css('color'));	
		jQuery(".set-slider-handel-bg-color").spectrum("set", current_field.find('.ui-slider-handle').css('background-color'));
		jQuery(".set-slider-handel-border-color").spectrum("set", current_field.find('.ui-slider-handle').css('border-top-color'));
	
		jQuery(".set-slider-bg-color").spectrum("set", current_field.find('.ui-slider').css('background-color'));	
		jQuery(".set-slider-fill-color").spectrum("set", current_field.find('.ui-slider-range').css('background-color'));
		jQuery(".set-slider-border-color").spectrum("set", current_field.find('.ui-slider').css('border-top-color'));
		
		
		
		jQuery('#count_text').val(current_field.find('#slider').attr('data-count-text'))
		
		jQuery('#minimum_value').val(current_field.find('#slider').attr('data-min-value'))
	
		jQuery('#step_value').val(current_field.find('#slider').attr('data-step-value'))

		jQuery('#maximum_value').val(current_field.find('#slider').attr('data-max-value'))

		jQuery('#start_value').val(current_field.find('#slider').attr('data-starting-value'))
		}
		
		
//GET DATE TIME SETTINGS	
	if (current_field.hasClass('time'))
		{
		jQuery('.display_calendar button').removeClass('active');
		jQuery('.set-popup-keep-open').hide();
		if(current_field.hasClass('display_inline_cal'))
			{
			jQuery('.set-popup-direction').hide();
			jQuery('.align-time-inline').show();
			jQuery('.display_calendar button.inline').addClass('active');
			}
		else
			{
			jQuery('.set-popup-direction').show();
			jQuery('.align-time-inline').hide();
			jQuery('.display_calendar button.popup').addClass('active');
			}
			
		jQuery('.popup-direction button').removeClass('active');
		if(current_field.find('#datetimepicker').attr('data-position')=='top')
			jQuery('.popup-direction button.top').addClass('active');
		else
			jQuery('.popup-direction button.bottom').addClass('active');
		
		jQuery('.enabled_hours button').removeClass('active');
		var enabled_hours = current_field.find('#datetimepicker').attr('data-enabled-hours');
		if(enabled_hours)
			{
			var enabled_hours_array = enabled_hours.split(',')
			for (i = 0; i < enabled_hours_array.length; i++) 
				{
				jQuery('.enabled_hours button.hour_'+enabled_hours_array[i]).addClass('active');
				}
			}
		else
			{
			jQuery('.enabled_hours button').addClass('active');	
			}
			
		jQuery('#set_time_stepping').val((current_field.find('#datetimepicker').attr('data-stepping'))? current_field.find('#datetimepicker').attr('data-stepping') : 5);	
				
		}
	if (current_field.hasClass('date') || current_field.hasClass('date-time') || current_field.hasClass('md-datepicker') || current_field.hasClass('jq-datepicker'))
		{
		
		
		jQuery('.enabled_days button').addClass('active');
		var enabled_days = current_field.find('#datetimepicker').attr('data-enabled-days');
		if(enabled_days)
			{
			var enabled_days_array = enabled_days.split(',')
			for (i = 0; i < enabled_days_array.length; i++) 
				{
				jQuery('.enabled_days button.days_'+enabled_days_array[i]).removeClass('active');
				}
			}
		else
			{
			jQuery('.enabled_days button').addClass('active');	
			}
		
			
		
		jQuery('div.field-settings-column #set_disabled_dates').val(current_field.find('#datetimepicker').attr('data-disabled-dates'));
		
		jQuery('div.field-settings-column #set_min_date').val(current_field.find('#datetimepicker').attr('data-min-date'))
		jQuery('div.field-settings-column #set_max_date').val(current_field.find('#datetimepicker').attr('data-max-date'))
		
		jQuery('#set_date_format').val(current_field.find('#datetimepicker').attr('data-format'))
		
		jQuery('#select_date_format').val(current_field.find('#datetimepicker').attr('data-selected-format'))
		jQuery('#select_date_format').attr('data-selected',current_field.find('#datetimepicker').attr('data-selected-format'))
		
		
		
		
		if(!current_field.find('#datetimepicker').attr('data-selected-format'))
			{
			jQuery('#select_date_format').val('DD/MM/YYYY')
			jQuery('#select_date_format').attr('data-selected','DD/MM/YYYY')
			}
		
		
		jQuery('#select_view_mode').val(current_field.find('#datetimepicker').attr('data-viewMode'))
		jQuery('#select_view_mode').attr('data-selected',current_field.find('#datetimepicker').attr('data-viewMode'))
		
		if(!current_field.find('#datetimepicker').attr('data-viewMode'))
			{
			jQuery('#select_view_mode').val('days')
			jQuery('#select_view_mode').attr('data-selected','dats')
			}
		
		if(current_field.find('#datetimepicker').attr('data-selected-format')=='custom')
			jQuery('.set-custom-date-format').removeClass('hidden');
		else
			jQuery('.set-custom-date-format').addClass('hidden');
			
		jQuery('#date-picker-lang-selector').val(current_field.find('#datetimepicker').attr('data-language'))
		jQuery('#date-picker-lang-selector').attr('data-selected',current_field.find('#datetimepicker').attr('data-language'))
		
		
		
		jQuery('.popup-direction button').removeClass('active');
		if(current_field.find('#datetimepicker').attr('data-position')=='top')
			jQuery('.popup-direction button.top').addClass('active');
		else
			jQuery('.popup-direction button.bottom').addClass('active');
			
		
		jQuery('.popup-keep-open button').removeClass('active');
		if(current_field.find('#datetimepicker').attr('data-keep-open')=='true')
			jQuery('.popup-keep-open button.yes').addClass('active');
		else
			jQuery('.popup-keep-open button.no').addClass('active');
		
		
		jQuery('.display_calendar button').removeClass('active');
		if(current_field.hasClass('display_inline_cal'))
			{
			jQuery('.set-popup-direction').hide();
			jQuery('.set-popup-keep-open').hide();
			jQuery('.align-time-inline').show();
			jQuery('.display_calendar button.inline').addClass('active');
			}
		else
			{
			jQuery('.set-popup-direction').show();
			jQuery('.set-popup-keep-open').show();
			jQuery('.align-time-inline').hide();
			jQuery('.display_calendar button.popup').addClass('active');
			}
		
		jQuery('.disable_past_dates button').removeClass('active');
		if(current_field.find('#datetimepicker').attr('data-disable-past-dates')=='1')
			jQuery('.disable_past_dates button.yes').addClass('active');
		else
			jQuery('.disable_past_dates button.no').addClass('active');
		
		}
//GET SPINNER SETTINGS
if (current_field.hasClass('touch_spinner'))
		{
		jQuery('#spin_minimum_value').val(current_field.find('#spinner').attr('data-minimum'))
	
		jQuery('#spin_step_value').val(current_field.find('#spinner').attr('data-step'))

		jQuery('#spin_maximum_value').val(current_field.find('#spinner').attr('data-maximum'))

		jQuery('#spin_start_value').val(current_field.find('#spinner').attr('data-starting-value'))
		
		jQuery('#spin_decimal').val(current_field.find('#spinner').attr('data-decimals'))
		
		}
//GET AUTOCOMPLETE SETTINGS
	if (current_field.hasClass('autocomplete'))
		{
		jQuery('#set_selections').val(current_field.find('.get_auto_complete_items').text())			
		}

//GET SUBMIT BUTTON SETTINGS		
	if(current_field.hasClass('submit-button') || current_field.hasClass('nex-step') || current_field.hasClass('prev-step'))
		{
		//GET BUTTON TEXT
		jQuery('div.field-settings-column #set_button_val').val(input_element.html())
		
	//GET BUTTON POSITION
		jQuery('.button-position button').removeClass('active');
		if(input_container.hasClass('align_right'))
			jQuery('.button-position button.right').addClass('active');
		else if(input_container.hasClass('align_center'))
			jQuery('.button-position button.center').addClass('active');
		else
			jQuery('.button-position button.left').addClass('active');	
	
	
	//GET BUTTON TEXT ALINGMENT
		jQuery('.button-text-align button').removeClass('active');
		if(input_element.hasClass('text-right'))
			jQuery('.button-text-align button.right').addClass('active');
		else if(input_element.hasClass('text-left'))
			jQuery('.button-text-align button.left').addClass('active');
		else
			jQuery('.button-text-align button.center').addClass('active');	
	
	//GET BUTTON SIZE
		jQuery('.button-size button').removeClass('active');
		if(input_element.hasClass('btn-lg'))
			jQuery('.button-size button.large').addClass('active');
		else if(input_element.hasClass('btn-sm'))
			jQuery('.button-size button.small ').addClass('active');
		else
			jQuery('.button-size button.normal').addClass('active');
		
		
	//GET BUTTON WIDTH
		jQuery('.button-width button').removeClass('active');
		if(input_element.hasClass('full_width') || input_element.hasClass('col-sm-12'))
			jQuery('.button-width button.full_button').addClass('active');
		else
			jQuery('.button-width button.default').addClass('active');
	
	//GET BUTTON SHINE
		jQuery('.add-button-shine button').removeClass('active');
		if(input_element.hasClass('add_shine'))
			jQuery('.add-button-shine button.do_shine').addClass('active');
		else
			jQuery('.add-button-shine button.no_shine').addClass('active');
	
	//GET BUTTON TYPE
		jQuery('.button-type button').removeClass('active');
		if(input_element.hasClass('nex-step'))
			jQuery('.button-type button.next').addClass('active');
		else if(input_element.hasClass('prev-step'))
			jQuery('.button-type button.prev').addClass('active');
		else
			jQuery('.button-type button.do-submit').addClass('active');
		
		}

//GET HEADING SETTINGS
	if(current_field.hasClass('heading') || current_field.hasClass('math_logic'))
		{
		//GET HEADING TEXT
		jQuery('div.field-settings-column #set_heading_text').val(input_element.html());
		
		//GET HEADING SIZE
		jQuery('.heading-size button').removeClass('active');
		if(input_element.is('h2'))
			jQuery('.heading-size button.heading_2').addClass('active');
		else if(input_element.is('h3'))
			jQuery('.heading-size button.heading_3').addClass('active');
		else if(input_element.is('h4'))
			jQuery('.heading-size button.heading_4').addClass('active');
		else if(input_element.is('h5'))
			jQuery('.heading-size button.heading_5').addClass('active');
		else if(input_element.is('h6'))
			jQuery('.heading-size button.heading_6').addClass('active');
		else
			jQuery('.heading-size button.heading_1').addClass('active');
		
		//GET HEADING ALINGMENT
		jQuery('.heading-text-align button').removeClass('active');
		if(input_element.hasClass('align_right'))
			jQuery('.heading-text-align button.right').addClass('active');
		else if(input_element.hasClass('align_center'))
			jQuery('.heading-text-align button.center').addClass('active');
		else
			jQuery('.heading-text-align button.left').addClass('active');	
		
		
		}
	if(current_field.hasClass('paragraph') || current_field.hasClass('html'))
		{	
		jQuery('.heading-text-align button').removeClass('active');
			if(input_element.hasClass('align_right'))
				jQuery('.heading-text-align button.right').addClass('active');
			else if(input_element.hasClass('align_center'))
				jQuery('.heading-text-align button.center').addClass('active');
			else
				jQuery('.heading-text-align button.left').addClass('active');	
		}
//GET HTML SETTINGS
	if(current_field.hasClass('paragraph') || current_field.hasClass('html'))
		{
		jQuery('div.field-settings-column #set_html').val(input_element.html());
		}
//GET DIVIDER SETTINGS
	if(current_field.hasClass('divider'))
		{
		var border_size = input_element.css('border-bottom-width');
		border_size = border_size.replace('px','');
		jQuery('#set_divider_height').val(border_size)
		}

//GET IMAGE SELECTION  SETTINGS
	if(current_field.hasClass('image-choices-field'))
		{
		//jQuery(".thumb-wrapper-color").spectrum("set", current_field.find('.image-choices-choice label.radio-inline').css('background-color'));		
		//jQuery(".thumb-border-color").spectrum("set", current_field.find('.image-choices-choice label.radio-inline').css('border-color'));		

		jQuery(".image-wrapper-color").spectrum("set", current_field.find('.image-choices-choice-image-wrap').css('background-color'));		
		jQuery(".image-border-color").spectrum("set", current_field.find('.image-choices-choice-image-wrap').css('border-color'));		
		
		jQuery(".label-wrapper-color").spectrum("set", current_field.find('.image-choices-choice .image-choices-choice-text').css('background-color'));		
		jQuery(".label-border-color").spectrum("set", current_field.find('.image-choices-choice .image-choices-choice-text').css('border-color'));		
		
		jQuery('#check_image_animation').val(input_container.attr('data-checked-animation'))
		jQuery('#check_image_animation').attr('data-selected',input_container.attr('data-checked-animation'))
		
		if(!input_container.attr('data-checked-animation'))
			{
			jQuery('#check_image_animation').val('fadeInDown')
			jQuery('#check_image_animation').attr('data-selected','fadeInDown')
			}
		
		jQuery('#uncheck_image_animation').val(input_container.attr('data-unchecked-animation'))
		jQuery('#uncheck_image_animation').attr('data-selected',input_container.attr('data-unchecked-animation'))
		
		if(!input_container.attr('data-unchecked-animation'))
			{
			jQuery('#uncheck_image_animation').val('fadeOutUp')
			jQuery('#uncheck_image_animation').attr('data-selected','fadeOutUp')
			}
		
		jQuery('.checked-v-position').removeClass('active');
		if(input_container.hasClass('checked_top'))
			jQuery('.checked-v-position.v_top').addClass('active');
		else if(input_container.hasClass('checked_bottom'))
			jQuery('.checked-v-position.v_bottom').addClass('active');
		else
			jQuery('.checked-v-position.v_center').addClass('active');
			
		
		jQuery('.checked-h-position').removeClass('active');
		if(input_container.hasClass('checked_left'))
			jQuery('.checked-h-position.h_left').addClass('active');
		else if(input_container.hasClass('checked_right'))
			jQuery('.checked-h-position.h_right').addClass('active');
		else
			jQuery('.checked-h-position.h_center').addClass('active');
			
		jQuery('.checked-radius').removeClass('active');
		if(input_container.hasClass('checked_squared'))
			jQuery('.checked-radius.icon_squared').addClass('active');
		else
			jQuery('.checked-radius.icon_round').addClass('active');
		
		
	
	
		
		}

//GET PANEL SETTINGS
	if(current_field.hasClass('is_panel'))
		{
		//GET INPUT BIU
		get_biu_style(current_field,'span.panel-heading','div.panel-heading','bold')
		get_biu_style(current_field,'span.panel-heading','div.panel-heading','italic')
		get_biu_style(current_field,'span.panel-heading','div.panel-heading','underline')
		
		jQuery(".set-panel-heading-text-color").spectrum("set", current_field.find('div.panel-heading').css('color'));	
		jQuery(".set-panel-heading-bg-color").spectrum("set", current_field.find('div.panel-heading').css('background-color'));
		jQuery(".set-panel-heading-border-color").spectrum("set", current_field.find('div.panel-heading').css('border-bottom-color'));
		
		jQuery(".set-panel-body-bg-color").spectrum("set", current_field.find('div.panel-body').css('background-color'));
		jQuery(".set-panel-body-border-color").spectrum("set", current_field.find('div.panel').css('border-top-color'));
		
	//heading size
		jQuery('.panel-heading-size button').removeClass('active');
		if(current_field.find('div.panel-heading').hasClass('btn-lg'))
			jQuery('.panel-heading-size button.large').addClass('active');
		else if(current_field.find('div.panel-heading').hasClass('btn-sm'))
			jQuery('.panel-heading-size button.small ').addClass('active');
		else
			jQuery('.panel-heading-size button.normal').addClass('active');
	
	//show heading		
		jQuery('.show_panel-heading button').removeClass('active');
		if(current_field.find('div.panel-heading').hasClass('hidden'))
			jQuery('.show_panel-heading button.no').addClass('active');
		else
			jQuery('.show_panel-heading button.yes').addClass('active');
	
	
	//Panel heading text aling
		jQuery('.panel-heading-text-align button').removeClass('active');
		if(current_field.find('div.panel-heading').hasClass('align_right'))
			jQuery('.panel-heading-text-align button.right').addClass('active');
		else if(current_field.find('div.panel-heading').hasClass('align_center'))
			jQuery('.panel-heading-text-align button.center').addClass('active');
		else
			jQuery('.panel-heading-text-align button.left').addClass('active');	
		
		jQuery('div.field-settings-column #set_panel_heading').val(current_field.find('.panel-heading').html());
		
		}
		

//GET INPUT SETTINGS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////				

//GET REPLICATE
	jQuery('.recreate-field button').removeClass('active');
	if(current_field.hasClass('field-replication-enabled'))
		jQuery('.recreate-field button.enable-recreation').addClass('active');
	else
		jQuery('.recreate-field button.disable-recreation').addClass('active');

//GET INPUT NAME
	jQuery('div.field-settings-column #set_input_name').val(format_illegal_chars(input_element.attr('name')))


//GET MATERAIL LABEL
if(current_field.find('.input-field label').text()!='')
	jQuery('div.field-settings-column #set_material_label').val(current_field.find('.input-field label').text())
else if(current_field.hasClass('multi-select'))
	jQuery('div.field-settings-column #set_material_label').val(current_field.find('select.the_input_element').text())
else
	jQuery('div.field-settings-column #set_material_label').val(current_field.find('label .the_label').text())
//GET INPUT PLACEHOLDER
	jQuery('div.field-settings-column #set_input_placeholder').val(input_element.attr('placeholder'))
//GET INPUT ID
	jQuery('div.field-settings-column #set_input_id').val(input_element.attr('id'))
//GET INPUT CLASS
	jQuery('div.field-settings-column #set_input_class').val(input_element.attr('class'))
//GET INPUT VALUE
	jQuery('div.field-settings-column #set_input_val').val(input_element.attr('value'))

//GET INPUT BIU
	get_biu_style(current_field,'span.input','.the_input_element','bold')
	get_biu_style(current_field,'span.input','.the_input_element','italic')
	get_biu_style(current_field,'span.input','.the_input_element','underline')

//GET INPUT COLOR	
	jQuery(".input-color").spectrum("set", input_element.css('color'));
//GET INPUT BG COLOR
	if(current_field.hasClass('html_fields'))	
		jQuery(".input-bg-color").spectrum("set", current_field.find('#field_container').css('background-color'));
	else
		jQuery(".input-bg-color").spectrum("set", input_element.css('background-color'));
//GET INPUT BORDER COLOR	
	if(current_field.hasClass('html_fields') || current_field.hasClass('math_logic_slider'))
		jQuery(".input-border-color").spectrum("set", current_field.find('#field_container').css('border-top-color'));
	else
		jQuery(".input-border-color").spectrum("set", input_element.css('border-top-color'));
	
//GET INPUT BORDER SIZE
	if(current_field.hasClass('html_fields') || current_field.hasClass('math_logic_slider'))
		{
		var element_border = current_field.find('#field_container').css('border-width');
			if(element_border){
			element_border = element_border.replace('px','');
			jQuery('#set_element_border_size').val(element_border);
			}
		}
	else
		{
		var element_border = input_element.css('border-width');
			if(element_border){
			element_border = element_border.replace('px','');
			jQuery('#set_element_border_size').val(element_border);
			}	
		}
	
	
	
	if(current_field.find('.prefix span').attr('class'))
		{
		//GET INPUT PRE-ADD-ON CLASS
		jQuery('div.field-settings-column #set_icon_before').val(current_field.find('.prefix span').attr('class'))
		//GET INPUT PRE-ADD-ON ICON
		jQuery('div.field-settings-column .current_icon_before i').attr('class',current_field.find('.prefix span').attr('class')).text('')
		}
	else if(current_field.find('.prefix.material-icons').attr('class'))
		{
		//GET INPUT PRE-ADD-ON CLASS
		jQuery('div.field-settings-column #set_icon_before').val(current_field.find('.prefix.material-icons').attr('class'))
		//GET INPUT PRE-ADD-ON ICON
		jQuery('div.field-settings-column .current_icon_before i').attr('class',current_field.find('.prefix.material-icons').attr('class')).text('')
		jQuery('div.field-settings-column .current_icon_before i').removeClass('material-icons');
		}
	else
		{
		jQuery('div.field-settings-column #set_icon_before').val('')
		jQuery('div.field-settings-column .current_icon_before i').attr('class','no-icon').text('');
		}
//GET INPUT CONTAINER ALINGMENT
	jQuery('.align-input-container button').removeClass('active');
	if(current_field.find('.input_container').hasClass('align_right'))
		jQuery('.align-input-container button.right').addClass('active');
	else if(current_field.find('.input_container').hasClass('align_center'))
		jQuery('.align-input-container button.center').addClass('active');
	else
		jQuery('.align-input-container button.left').addClass('active');


//GET INPUT ALINGMENT
	jQuery('.align-input button').removeClass('active');
	if(input_element.hasClass('align_right'))
		jQuery('.align-input button.right').addClass('active');
	else if(input_element.hasClass('align_center'))
		jQuery('.align-input button.center').addClass('active');
	else
		jQuery('.align-input button.left').addClass('active');
	
//GET INPUT SIZE
	jQuery('.input-size button').removeClass('active');
	if(input_element.hasClass('input-lg'))
		jQuery('.input-size button.large').addClass('active');
	else if(input_element.hasClass('input-sm'))
		jQuery('.input-size button.small ').addClass('active');
	else
		jQuery('.input-size button.normal').addClass('active');
		

//GET INPUT SIZE
	jQuery('.thumb-size button').removeClass('active');
	if(current_field.find('.input_holder').hasClass('img-thumbnail-large'))
		jQuery('.thumb-size button.large').addClass('active');
	else if(current_field.find('.input_holder').hasClass('img-thumbnail-small'))
		jQuery('.thumb-size button.small ').addClass('active');
	else
		jQuery('.thumb-size button.normal').addClass('active');


//GET CORNERS 
	jQuery('.input-corners button').removeClass('active');
	if(current_field.hasClass('square'))
		jQuery('.input-corners button.square').addClass('active');
	else if(current_field.hasClass('pill'))
		jQuery('.input-corners button.pill ').addClass('active');
	else
		jQuery('.input-corners button.normal').addClass('active');
		
//GET CORNERS 
	jQuery('.math-slider-corners button').removeClass('active');
	if(current_field.hasClass('square'))
		jQuery('.math-slider-corners button.square').addClass('active');
	else if(current_field.hasClass('pill'))
		jQuery('.math-slider-corners button.pill ').addClass('active');
	else
		jQuery('.math-slider-corners button.normal').addClass('active');
		

//GET DISABLED 
	jQuery('.input-disabled button').removeClass('active');
	if(input_element.prop('disabled')==true)
		jQuery('.input-disabled button.yes').addClass('active');
	else
		jQuery('.input-disabled button.no').addClass('active');





//RESET PRE-ADD-ON COLORS
	jQuery(".pre-icon-text-color").spectrum("set",'#555555');
	jQuery(".pre-icon-bg-color").spectrum("set",'#eeeeee');
	jQuery(".pre-icon-border-color").spectrum("set",'#cccccc');
//GET INPUT PRE-ADD-ON COLOR	
	jQuery(".pre-icon-text-color").spectrum("set", input_element.parent().find('.prefix ').css('color'));	
//GET INPUT PRE-ADD-ON BACKGOUND COLOR	
	jQuery(".pre-icon-bg-color").spectrum("set", input_element.parent().find('.prefix ').css('background-color'));
//GET INPUT PRE-ADD-ON BORDER COLOR	
	jQuery(".pre-icon-border-color").spectrum("set", input_element.parent().find('.prefix ').css('border-top-color'));

	if(current_field.find('.postfix span').attr('class'))
		{
		//GET INPUT POST-ADD-ON CLASS
		jQuery('div.field-settings-column #set_icon_after').val(current_field.find('.postfix span').attr('class'))
		//GET INPUT POST-ADD-ON ICON
		jQuery('div.field-settings-column .current_icon_after i').attr('class',current_field.find('.postfix span').attr('class')).text('')
		}
	else
		{
		jQuery('div.field-settings-column #set_icon_after').val('')
		jQuery('div.field-settings-column .current_icon_after i').attr('class','no-icon').text('');
		}
		
//RESET POST-ADD-ON COLORS
	jQuery(".post-icon-text-color").spectrum("set",'#555555');
	jQuery(".post-icon-bg-color").spectrum("set",'#eeeeee');
	jQuery(".post-icon-border-color").spectrum("set",'#cccccc');
//GET INPUT POST-ADD-ON COLOR	
	jQuery(".post-icon-text-color").spectrum("set", input_element.parent().find('.postfix ').css('color'));	
//GET INPUT POST-ADD-ON BACKGOUND COLOR	
	jQuery(".post-icon-bg-color").spectrum("set", input_element.parent().find('.postfix ').css('background-color'));
//GET INPUT POST-ADD-ON BACKGOUND COLOR	
	jQuery(".post-icon-border-color").spectrum("set", input_element.parent().find('.postfix ').css('border-top-color'));

//GET BACKGOUND TARGET ELEMENT
	if(current_field.hasClass('other-elements') && current_field.hasClass('grid'))
		var get_bg_target = current_field.find('.panel-body');
	else
		var get_bg_target = input_element;

//GET INPUT BACKGROUND IMAGE
	var image = get_bg_target.css('background-image');
	if(image)
		var image2 = image.replace( 'url("','');
	if(image2)
		var image3 = image2.replace( '")','');
	
	if(	image3 && image3!='undefined' && image3!='none' && !strstr(image3,'nex-forms-main'))
		{
		if(jQuery('#do-upload-image .fileinput-preview img').length > 0)
			jQuery('#do-upload-image .fileinput-preview img').attr('src',image3);
		else
			jQuery('#do-upload-image .fileinput-preview').append('<img src="'+ image3 +'">');
			
		jQuery('.field-settings-column .fileinput').removeClass('fileinput-new').addClass('fileinput-exists');
		jQuery('.field-settings-column .fileinput input').attr('name','do_image_upload_preview');
		}
	else
		{
		jQuery('#do-upload-image .fileinput-preview img').remove();
		jQuery('.field-settings-column .fileinput').removeClass('fileinput-exists').addClass('fileinput-new');
		jQuery('.field-settings-column .fileinput input').attr('name','do_image_upload_preview');
		}
	
//GeT Upload button text
	//jQuery('div.field-settings-column #img-upload-select').val(current_field.find('span.fileinput-new').text())
//GeT Change button text text
	//jQuery('div.field-settings-column #img-upload-change').val(current_field.find('span.fileinput-exists').text())
//GeT Upload remkove button text
	//jQuery('div.field-settings-column #img-upload-remove').val(current_field.find('a.fileinput-exists').text())
		
	

//GET BACKGOUND IMAGE SIZE		
	jQuery('.bg-size button').removeClass('active');
	if(get_bg_target.css('background-size')=='cover')
		jQuery('.bg-size button.cover').addClass('active');
	else if(get_bg_target.css('background-size')=='contain')
		jQuery('.bg-size button.contain').addClass('active');
	else
		jQuery('.bg-size button.auto').addClass('active');

//GET BACKGOUND IMAGE REPEAT
	jQuery('.bg-repeat button').removeClass('active');

	if(get_bg_target.css('background-repeat')=='no-repeat')
		jQuery('.bg-repeat button.no-repeat').addClass('active');
	else if(get_bg_target.css('background-repeat')=='repeat-x')
		jQuery('.bg-repeat button.repeat-x').addClass('active');
	else if(get_bg_target.css('background-repeat')=='repeat-y')
		jQuery('.bg-repeat button.repeat-y').addClass('active');
	else
		jQuery('.bg-repeat button.repeat').addClass('active');

//GET BACKGOUND POSITION	
	jQuery('.bg-position button').removeClass('active');
	if(get_bg_target.css('background-position')=='center' || get_bg_target.css('background-position')=='50% 0%')
		jQuery('.bg-position button.center').addClass('active');
	else if(get_bg_target.css('background-position')=='right' || get_bg_target.css('background-position')=='100% 0%')
		jQuery('.bg-position button.right').addClass('active');
	else
		jQuery('.bg-position button.left').addClass('active');











		
	if(current_field.hasClass('html_fields') || current_field.hasClass('math_logic_slider'))
		{
		if(current_field.hasClass('heading') || current_field.hasClass('math_logic') || current_field.hasClass('paragraph') || current_field.hasClass('html'))
			jQuery('#extra-settings').removeClass('current');
		
		jQuery(document).on('click','.reset-html-field-margins',
			function()
				{
				jQuery( "#html_field_spacing_margin_top" ).val('0').trigger('keyup');
				jQuery( "#html_field_spacing_margin_right" ).val('0').trigger('keyup');
				jQuery( "#html_field_spacing_margin_bottom" ).val('15').trigger('keyup');
				jQuery( "#html_field_spacing_margin_left" ).val('0').trigger('keyup');
				}
			);
	var top_margin = current_field.css('margin-top');
	jQuery( "#html_field_spacing_margin_top" ).val(top_margin.replace('px',''))
	jQuery( "#html_field_spacing_margin_top" ).spinner(
			{ 
			//min:-100,
			spin: function( event, ui ) 
					{
					//current_field.css('top',ui.value+'px');
					current_field.css('margin-top',ui.value+'px');
					} 
			}
		).on('keyup', function(e)
			{
			//current_field.css('top',jQuery(this).val()+'px');
			current_field.css('margin-top',jQuery(this).val()+'px');
			});	 
			
			
	var right_margin = current_field.css('margin-right');
	jQuery( "#html_field_spacing_margin_right" ).val(right_margin.replace('px',''))	
	jQuery( "#html_field_spacing_margin_right" ).spinner(
		{   
		spin: function( event, ui ) 
				{
				current_field.css('margin-right',ui.value+'px');
				}
		}
	).on('keyup', function(e)
		{
		current_field.css('margin-right',jQuery(this).val()+'px');
		});	
			
			
	var bottom_margin = current_field.css('margin-bottom');
	jQuery( "#html_field_spacing_margin_bottom" ).val(bottom_margin.replace('px',''))	
	jQuery( "#html_field_spacing_margin_bottom" ).spinner(
		{  
		spin: function( event, ui ) 
				{
				current_field.css('margin-bottom',ui.value+'px');
				}
		}
	).on('keyup', function(e)
		{
		current_field.css('margin-bottom',jQuery(this).val()+'px');
		});
	
	var left_margin = current_field.css('margin-left');
	jQuery( "#html_field_spacing_margin_left" ).val(left_margin.replace('px',''))	
	jQuery( "#html_field_spacing_margin_left" ).spinner(
		{  
		spin: function( event, ui ) 
				{
				current_field.css('margin-left',ui.value+'px');
				}
		}
	).on('keyup', function(e)
		{
		current_field.css('margin-left',jQuery(this).val()+'px');
		});	
		
	
//PADDING
	jQuery(document).on('click','.reset-html-field-padding',
		function()
			{
			jQuery( "#html_field_spacing_padding_top" ).val('0').trigger('keyup');
			jQuery( "#html_field_spacing_padding_right" ).val('15').trigger('keyup');
			jQuery( "#html_field_spacing_padding_bottom" ).val('0').trigger('keyup');
			jQuery( "#html_field_spacing_padding_left" ).val('15').trigger('keyup');
			}
		);	
	var top_padding = current_field.find('#field_container').css('padding-top');
	jQuery( "#html_field_spacing_padding_top" ).val(top_padding.replace('px',''))
	jQuery( "#html_field_spacing_padding_top" ).spinner(
			{ 
			min:0,
			spin: function( event, ui ) 
					{
					current_field.find('#field_container').css('padding-top',ui.value+'px');
					} 
			}
		).on('keyup', function(e)
			{
			current_field.find('#field_container').css('padding-top',jQuery(this).val()+'px');
			});	 
			
			
	var right_padding = current_field.find('#field_container').css('padding-right');
	jQuery( "#html_field_spacing_padding_right" ).val(right_padding.replace('px',''))	
	jQuery( "#html_field_spacing_padding_right" ).spinner(
		{ 
		min:0,  
		spin: function( event, ui ) 
				{
				current_field.find('#field_container').css('padding-right',ui.value+'px');
				}
		}
	).on('keyup', function(e)
		{
		current_field.find('#field_container').css('padding-right',jQuery(this).val()+'px');
		});	
			
			
	var bottom_padding = current_field.find('#field_container').css('padding-bottom');
	jQuery( "#html_field_spacing_padding_bottom" ).val(bottom_padding.replace('px',''))	
	jQuery( "#html_field_spacing_padding_bottom" ).spinner(
		{  
		min:0,
		spin: function( event, ui ) 
				{
				current_field.find('#field_container').css('padding-bottom',ui.value+'px');
				}
		}
	).on('keyup', function(e)
		{
		current_field.find('#field_container').css('padding-bottom',jQuery(this).val()+'px');
		});
	
	var left_padding = current_field.find('#field_container').css('padding-left');
	jQuery( "#html_field_spacing_padding_left" ).val(left_padding.replace('px',''))	
	jQuery( "#html_field_spacing_padding_left" ).spinner(
		{ 
		min:0, 
		spin: function( event, ui ) 
				{
				current_field.find('#field_container').css('padding-left',ui.value+'px');
				}
		}
	).on('keyup', function(e)
		{
		current_field.find('#field_container').css('padding-left',jQuery(this).val()+'px');
		});	
		
		
//Border radius
	/*jQuery(document).on('click','.reset-field-padding',
		function()
			{
			jQuery( "#html_field_spacing_padding_top" ).val('0').trigger('keyup');
			jQuery( "#html_field_spacing_padding_right" ).val('15').trigger('keyup');
			jQuery( "#html_field_spacing_padding_bottom" ).val('0').trigger('keyup');
			jQuery( "#html_field_spacing_padding_left" ).val('15').trigger('keyup');
			}
		);	*/
	var top_left_radius = current_field.find('#field_container').css('border-top-left-radius');
	jQuery( "#html_field_border_radius_top_left" ).val(top_left_radius.replace('px',''))
	jQuery( "#html_field_border_radius_top_left" ).spinner(
			{ 
			min:0,
			spin: function( event, ui ) 
					{
					current_field.find('#field_container').css('border-top-left-radius',ui.value+'px');
					} 
			}
		).on('keyup', function(e)
			{
			current_field.find('#field_container').css('border-top-left-radius',jQuery(this).val()+'px');
			});	 
			
	var top_right_radius = current_field.find('#field_container').css('border-top-right-radius');
	jQuery( "#html_field_border_radius_top_right" ).val(top_right_radius.replace('px',''))
	jQuery( "#html_field_border_radius_top_right" ).spinner(
			{ 
			min:0,
			spin: function( event, ui ) 
					{
					current_field.find('#field_container').css('border-top-right-radius',ui.value+'px');
					} 
			}
		).on('keyup', function(e)
			{
			current_field.find('#field_container').css('border-top-right-radius',jQuery(this).val()+'px');
			});	 		
			
	
	var bottom_left_radius = current_field.find('#field_container').css('border-bottom-left-radius');
	jQuery( "#html_field_border_radius_bottom_left" ).val(bottom_left_radius.replace('px',''))
	jQuery( "#html_field_border_radius_bottom_left" ).spinner(
			{ 
			min:0,
			spin: function( event, ui ) 
					{
					current_field.find('#field_container').css('border-bottom-left-radius',ui.value+'px');
					} 
			}
		).on('keyup', function(e)
			{
			current_field.find('#field_container').css('border-bottom-left-radius',jQuery(this).val()+'px');
			});	 
			
	var bottom_right_radius = current_field.find('#field_container').css('border-bottom-right-radius');
	jQuery( "#html_field_border_radius_bottom_right" ).val(bottom_right_radius.replace('px',''))
	jQuery( "#html_field_border_radius_bottom_right" ).spinner(
			{ 
			min:0,
			spin: function( event, ui ) 
					{
					current_field.find('#field_container').css('border-bottom-right-radius',ui.value+'px');
					} 
			}
		).on('keyup', function(e)
			{
			current_field.find('#field_container').css('border-bottom-right-radius',jQuery(this).val()+'px');
			});	 	
		
		
		
		}

}

function get_validation_settings(){
	
	//console.log('test')

	if(current_field.hasClass('upload_fields'))
		{

			jQuery('#set_extensions').val(current_field.find('div.get_file_ext').text())
			
		}

	//GET MIN/MAX	
	if(input_element.attr('maxlength'))
		jQuery('div.field-settings-column #set_max_val').val(input_element.attr('maxlength'))
	else
		jQuery('div.field-settings-column #set_max_val').val(input_element.attr('data-length'))
		
	
    var get_max_selection = (current_field.find('#field_container').attr('data-max-selection')) ? current_field.find('#field_container').attr('data-max-selection') : '';
    var get_min_selection = (current_field.find('#field_container').attr('data-min-selection')) ? current_field.find('#field_container').attr('data-min-selection') : '';
	
	jQuery('div.field-settings-column #set_max_selection').val(get_max_selection)
	jQuery('div.field-settings-column #set_min_selection').val(get_min_selection)
	
	
	//SET MAX CHARS
		jQuery(document).on('keyup','div.field-settings-column #set_max_selection',
			function()
				{
				current_field.find('#field_container').attr('data-max-selection',jQuery(this).val());
				}
			);
	//SET MAX CHARS
		jQuery(document).on('keyup','div.field-settings-column #set_min_selection',
			function()
				{
				current_field.find('#field_container').attr('data-min-selection',jQuery(this).val());
				}
			);	
		
		
	jQuery('div.field-settings-column #set_min_val').val(input_element.attr('minlength'))
	
	jQuery('div.field-settings-column #set_input_mask').val(input_element.attr('data-input-mask'))
	
	//GET ERROR MESSAGE
	jQuery('div.field-settings-column #the_error_mesage').val(current_field.find('.error_message').attr('data-content'))
	
	//GET SECONDARY ERROR MESSAGE
	jQuery('div.field-settings-column #set_secondary_error').val(current_field.find('.error_message').attr('data-secondary-message'))
	
	//GET MAX SIZE PER FILE
	jQuery('div.field-settings-column #max_file_size_pf').val(current_field.find('.error_message').attr('data-max-size-pf'))
	jQuery('div.field-settings-column #min_file_size_pf').val(current_field.find('.error_message').attr('data-min-size-pf'))
	jQuery('div.field-settings-column #max_file_size_pf_error').val(current_field.find('.error_message').attr('data-max-per-file-message'))
	jQuery('div.field-settings-column #min_file_size_pf_error').val(current_field.find('.error_message').attr('data-min-per-file-message'))
	
	//GET MAX SIZE ALL FILES
	jQuery('div.field-settings-column #max_file_size_af').val(current_field.find('.error_message').attr('data-max-size-overall'))
	jQuery('div.field-settings-column #max_file_size_af_error').val(current_field.find('.error_message').attr('data-max-all-file-message'))
	
	//GET FILE UPLOAD LIMIT
	jQuery('div.field-settings-column #max_upload_limit').val(current_field.find('.error_message').attr('data-max-files'))
	jQuery('div.field-settings-column #max_upload_limit_error').val(current_field.find('.error_message').attr('data-file-upload-limit-message'))
	
	
	
	//GET REQUIRED FIELD STATUS
	jQuery('.required button').removeClass('active');
	if(current_field.hasClass('required'))
		jQuery('.required button.yes').addClass('active');
	else
		jQuery('.required button.no').addClass('active');
		
	//GET REQUIRED FIELD STATUS
	jQuery('.error-style button').removeClass('active');
	if(current_field.hasClass('classic_error_style'))
		jQuery('.error-style button.classic').addClass('active');
	else
		jQuery('.error-style button.modern').addClass('active');
		
	//GET REQUIRED FIELD STATUS
	jQuery('.error-position button').removeClass('active');
	if(current_field.hasClass('error_left'))
		jQuery('.error-position button.set_left').addClass('active');
	else
		jQuery('.error-position button.set_right').addClass('active');
	
	
	
	
	
	//GET REQUIRED FIELD INDICATOR
	jQuery('.required-star button').removeClass('active');
	if(current_field.find('.is_required').hasClass('glyphicon-star-empty'))
		jQuery('.required-star button.empty').addClass('active');
	else if(current_field.find('.is_required').hasClass('glyphicon-asterisk'))
		jQuery('.required-star button.asterisk').addClass('active');
	else if(current_field.find('.is_required').hasClass('glyphicon-star'))
		jQuery('.required-star button.full').addClass('active');
	else
		jQuery('.required-star button.none').addClass('active');
	
	
	/*jQuery('select[name="validate-as"] option').each(
		function()
			{
			if(current_field.hasClass(jQuery(this).text()))
				jQuery(this).prop('selected', true);
			else
				jQuery(this).prop('selected', false);
			}
		);*/
	jQuery('select[name="validate-as"] option').prop('selected',false);
	//GET VALIDATION FORMAT
	/*	
	jQuery('select[name="validate-as"] option').attr('selected',false);	
	jQuery('select[name="validate-as"] option').removeAttr('selected',);*/	
	
	//update_select('.validate_as');
	    
	if(current_field.hasClass('email'))
		{
		jQuery('select[name="validate-as"] option[value="email"]').prop('selected',true);
		jQuery('select[name="validate-as"] option[value="email"]').attr('selected','selected');
		}
	else if(current_field.hasClass('phone_number'))
		{
		jQuery('select[name="validate-as"] option[value="phone_number"]').prop('selected',true);
		jQuery('select[name="validate-as"] option[value="phone_number"]').attr('selected','selected');
		}
	else if(current_field.hasClass('url'))
		{
		jQuery('select[name="validate-as"] option[value="url"]').prop('selected',true);
		jQuery('select[name="validate-as"] option[value="url"]').attr('selected','selected');
		}
	else if(current_field.hasClass('numbers_only'))
		{
		jQuery('select[name="validate-as"] option[value="numbers_only"]').prop('selected',true);
		jQuery('select[name="validate-as"] option[value="numbers_only"]').attr('selected','selected');
		}
	else if(current_field.hasClass('text_only'))
		{
		jQuery('select[name="validate-as"] option[value="text_only"]').prop('selected',true);
		jQuery('select[name="validate-as"] option[value="text_only"]').attr('selected','selected');
		}
	else
		{
		jQuery('select[name="validate-as"] option[value="none"]').prop('selected',true);
		jQuery('select[name="validate-as"] option[value="none"]').attr('selected','selected');
		}
		
}
function get_animation_settings(){
	//GET ANIMATION DELAY
	var animation_delay = current_field.attr('data-wow-delay');
	if(animation_delay)
		{
		animation_delay = animation_delay.replace('s','')
		jQuery('#animation_delay').val(animation_delay)
		}
	else
		jQuery('#animation_delay').val('')
	
	//GET ANIMATION DURATION
	var animation_duration = current_field.attr('data-wow-duration');
			if(animation_duration)
				{
				animation_duration = animation_duration.replace('s','')
				jQuery('#animation_duration').val(animation_duration)
				}
			else
				jQuery('#animation_duration').val('')
	
	//GET ANIMATION EFFECT
	//jQuery('#field_animation option[value="no_animation"]').prop('selected',true);
   	jQuery('#field_animation option').each(
		function()
			{
			if(current_field.hasClass(jQuery(this).text()))
				jQuery(this).prop('selected', true);
			else
				jQuery(this).prop('selected', false);
			}
		);
}
function get_extra_settings(){

//MARGIN
	jQuery(document).on('click','.reset-field-margins',
			function()
				{
				jQuery( "#field_spacing_margin_top" ).val('0').trigger('keyup');
				jQuery( "#field_spacing_margin_right" ).val('0').trigger('keyup');
				jQuery( "#field_spacing_margin_bottom" ).val('15').trigger('keyup');
				jQuery( "#field_spacing_margin_left" ).val('0').trigger('keyup');
				}
			);
	var top_margin = current_field.css('margin-top');
	jQuery( "#field_spacing_margin_top" ).val(top_margin.replace('px',''))
	jQuery( "#field_spacing_margin_top" ).spinner(
			{ 
			//min:-100,
			spin: function( event, ui ) 
					{
					//current_field.css('top',ui.value+'px');
					current_field.css('margin-top',ui.value+'px');
					} 
			}
		).on('keyup', function(e)
			{
			//current_field.css('top',jQuery(this).val()+'px');
			current_field.css('margin-top',jQuery(this).val()+'px');
			});	 
			
			
	var right_margin = current_field.css('margin-right');
	jQuery( "#field_spacing_margin_right" ).val(right_margin.replace('px',''))	
	jQuery( "#field_spacing_margin_right" ).spinner(
		{   
		spin: function( event, ui ) 
				{
				current_field.css('margin-right',ui.value+'px');
				}
		}
	).on('keyup', function(e)
		{
		current_field.css('margin-right',jQuery(this).val()+'px');
		});	
			
			
	var bottom_margin = current_field.css('margin-bottom');
	jQuery( "#field_spacing_margin_bottom" ).val(bottom_margin.replace('px',''))	
	jQuery( "#field_spacing_margin_bottom" ).spinner(
		{  
		spin: function( event, ui ) 
				{
				current_field.css('margin-bottom',ui.value+'px');
				}
		}
	).on('keyup', function(e)
		{
		current_field.css('margin-bottom',jQuery(this).val()+'px');
		});
	
	var left_margin = current_field.css('margin-left');
	jQuery( "#field_spacing_margin_left" ).val(left_margin.replace('px',''))	
	jQuery( "#field_spacing_margin_left" ).spinner(
		{  
		spin: function( event, ui ) 
				{
				current_field.css('margin-left',ui.value+'px');
				}
		}
	).on('keyup', function(e)
		{
		current_field.css('margin-left',jQuery(this).val()+'px');
		});	
		
	
//PADDING
	jQuery(document).on('click','.reset-field-padding',
		function()
			{
			jQuery( "#field_spacing_padding_top" ).val('0').trigger('keyup');
			jQuery( "#field_spacing_padding_right" ).val('15').trigger('keyup');
			jQuery( "#field_spacing_padding_bottom" ).val('0').trigger('keyup');
			jQuery( "#field_spacing_padding_left" ).val('15').trigger('keyup');
			}
		);	
	var top_padding = current_field.find('#field_container').css('padding-top');
	jQuery( "#field_spacing_padding_top" ).val(top_padding.replace('px',''))
	jQuery( "#field_spacing_padding_top" ).spinner(
			{ 
			min:0,
			spin: function( event, ui ) 
					{
					current_field.find('#field_container').css('padding-top',ui.value+'px');
					} 
			}
		).on('keyup', function(e)
			{
			current_field.find('#field_container').css('padding-top',jQuery(this).val()+'px');
			});	 
			
			
	var right_padding = current_field.find('#field_container').css('padding-right');
	jQuery( "#field_spacing_padding_right" ).val(right_padding.replace('px',''))	
	jQuery( "#field_spacing_padding_right" ).spinner(
		{ 
		min:0,  
		spin: function( event, ui ) 
				{
				current_field.find('#field_container').css('padding-right',ui.value+'px');
				}
		}
	).on('keyup', function(e)
		{
		current_field.find('#field_container').css('padding-right',jQuery(this).val()+'px');
		});	
			
			
	var bottom_padding = current_field.find('#field_container').css('padding-bottom');
	jQuery( "#field_spacing_padding_bottom" ).val(bottom_padding.replace('px',''))	
	jQuery( "#field_spacing_padding_bottom" ).spinner(
		{  
		min:0,
		spin: function( event, ui ) 
				{
				current_field.find('#field_container').css('padding-bottom',ui.value+'px');
				}
		}
	).on('keyup', function(e)
		{
		current_field.find('#field_container').css('padding-bottom',jQuery(this).val()+'px');
		});
	
	var left_padding = current_field.find('#field_container').css('padding-left');
	jQuery( "#field_spacing_padding_left" ).val(left_padding.replace('px',''))	
	jQuery( "#field_spacing_padding_left" ).spinner(
		{ 
		min:0, 
		spin: function( event, ui ) 
				{
				current_field.find('#field_container').css('padding-left',ui.value+'px');
				}
		}
	).on('keyup', function(e)
		{
		current_field.find('#field_container').css('padding-left',jQuery(this).val()+'px');
		});	
		
		
//Border radius
	/*jQuery(document).on('click','.reset-field-padding',
		function()
			{
			jQuery( "#field_spacing_padding_top" ).val('0').trigger('keyup');
			jQuery( "#field_spacing_padding_right" ).val('15').trigger('keyup');
			jQuery( "#field_spacing_padding_bottom" ).val('0').trigger('keyup');
			jQuery( "#field_spacing_padding_left" ).val('15').trigger('keyup');
			}
		);	*/
	var top_left_radius = current_field.find('#field_container').css('border-top-left-radius');
	jQuery( "#field_border_radius_top_left" ).val(top_left_radius.replace('px',''))
	jQuery( "#field_border_radius_top_left" ).spinner(
			{ 
			min:0,
			spin: function( event, ui ) 
					{
					current_field.find('#field_container').css('border-top-left-radius',ui.value+'px');
					} 
			}
		).on('keyup', function(e)
			{
			current_field.find('#field_container').css('border-top-left-radius',jQuery(this).val()+'px');
			});	 
			
	var top_right_radius = current_field.find('#field_container').css('border-top-right-radius');
	jQuery( "#field_border_radius_top_right" ).val(top_right_radius.replace('px',''))
	jQuery( "#field_border_radius_top_right" ).spinner(
			{ 
			min:0,
			spin: function( event, ui ) 
					{
					current_field.find('#field_container').css('border-top-right-radius',ui.value+'px');
					} 
			}
		).on('keyup', function(e)
			{
			current_field.find('#field_container').css('border-top-right-radius',jQuery(this).val()+'px');
			});	 		
			
	
	var bottom_left_radius = current_field.find('#field_container').css('border-bottom-left-radius');
	jQuery( "#field_border_radius_bottom_left" ).val(bottom_left_radius.replace('px',''))
	jQuery( "#field_border_radius_bottom_left" ).spinner(
			{ 
			min:0,
			spin: function( event, ui ) 
					{
					current_field.find('#field_container').css('border-bottom-left-radius',ui.value+'px');
					} 
			}
		).on('keyup', function(e)
			{
			current_field.find('#field_container').css('border-bottom-left-radius',jQuery(this).val()+'px');
			});	 
			
	var bottom_right_radius = current_field.find('#field_container').css('border-bottom-right-radius');
	jQuery( "#field_border_radius_bottom_right" ).val(bottom_right_radius.replace('px',''))
	jQuery( "#field_border_radius_bottom_right" ).spinner(
			{ 
			min:0,
			spin: function( event, ui ) 
					{
					current_field.find('#field_container').css('border-bottom-right-radius',ui.value+'px');
					} 
			}
		).on('keyup', function(e)
			{
			current_field.find('#field_container').css('border-bottom-right-radius',jQuery(this).val()+'px');
			});	 		
		
	
		
}
function set_icon(set_class,icon_pos, icon_trigger, icon_target, icon_reverse_target, remove_icon){
		
		if(remove_icon == true)
			{
			jQuery('div.field-settings-column').find('.current_'+ icon_trigger + ' i').attr('class','no-icon')
			jQuery('div.field-settings-column').find('.current_'+ icon_trigger + ' i').text('')
			jQuery('div.field-settings-column #set_'+icon_trigger).val('');
			
			
			if(icon_pos=='before')
				current_field.removeClass('has_prefix_icon');
			else
				current_field.removeClass('has_postfix_icon');
			
			if(!current_field.hasClass('material_field'))
				{
				if(icon_pos=='before')
					{
					jQuery(".pre-icon-text-color").spectrum("set",'#555555');
					jQuery(".pre-icon-bg-color").spectrum("set",'#eeeeee');
					jQuery(".pre-icon-border-color").spectrum("set",'#cccccc');
					}
				else
					{
					jQuery(".post-icon-text-color").spectrum("set",'#555555');
					jQuery(".post-icon-bg-color").spectrum("set",'#eeeeee');
					jQuery(".post-icon-border-color").spectrum("set",'#cccccc');
					}
				}
			current_field.find('.'+icon_target).remove();
			if(!current_field.hasClass('material_field'))
				{
				if(input_element.parent().hasClass('input-group') && !input_element.parent().find('.' + icon_reverse_target).attr('class'))
					{
					input_element.unwrap()
					
					
					if(current_field.hasClass('date'))
						input_element.wrap('<div class="date no-icon" id="datetimepicker" data-language="'+ jQuery('#date-picker-lang-selector').val() +'" data-format="'+ jQuery('#select_date_format').val() +'"></div>');
					if(current_field.hasClass('time'))
						input_element.wrap('<div class="time no-icon" id="datetimepicker" data-language="'+ jQuery('#date-picker-lang-selector').val() +'" data-format="HH:mm"></div>');

					
					}
				}
			}
		else
			{	
			if(icon_pos=='before')
				current_field.addClass('has_prefix_icon');
			else
				current_field.addClass('has_postfix_icon');
					
			if(!current_field.hasClass('material_field'))
				{
				if(!input_element.parent().hasClass('input-group'))
					{
					if(current_field.hasClass('date'))
						{
						input_element.unwrap()
						input_element.wrap('<div class="input-group date" id="datetimepicker" data-language="'+ jQuery('#date-picker-lang-selector').val() +'" data-format="'+ jQuery('#select_date_format').val() +'"></div>');
						}
					else if(current_field.hasClass('time'))
						{
						input_element.unwrap()
						input_element.wrap('<div class="input-group time" id="datetimepicker" data-language="'+ jQuery('#date-picker-lang-selector').val() +'" data-format="HH:mm"></div>');
						}
					else
						input_element.wrap('<div class="input-group"></div>');
					
					}
				if(!input_element.parent().find('.'+icon_target).attr('class'))	
					{							
					if(icon_pos=='before')
						input_element.before('<span class="input-group-addon '+ icon_target +'"><span class=""></span></span>');
					else
						input_element.after('<span class="input-group-addon '+ icon_target +'"><span class=""></span></span>');
					}
					current_field.find('.'+ icon_target +' span').attr('class',set_class);
				}
			else
				{
				
				if(!input_element.parent().hasClass('input-group-md') && !input_element.hasClass('material_select'))
					input_element.wrap('<div class="input-group-md"></div>');
				if(!input_element.parent().find('.'+icon_target).attr('class'))	
					{							
					if(icon_pos=='before')
						input_element.before('<span class="input-group-addon hidden '+ icon_target +'2"><span class=""></span></span>');
					else
						input_element.after('<span class="input-group-addon hidden '+ icon_target +'2"><span class=""></span></span>');
					}
					current_field.find('.'+ icon_target +'2 span').attr('class',set_class);
					
				var new_label = current_field.find('#md_label').clone();
					current_field.find('#md_label').remove();
					
				
				if((current_field.hasClass('select') || current_field.hasClass('multi-select')) && current_field.hasClass('material_field'))
					{
					current_field.find('.select-wrapper').after(new_label);
					if(!current_field.find('.'+icon_target).attr('class'))	
						{	
						current_field.find('.select-wrapper').before('<i class="material-icons prefix '+ icon_target +' '+ set_class +' "></i>');
						}
					}
				else
					{
					if(!input_element.parent().find('.'+icon_target).attr('class'))	
						{	
						input_element.before('<i class="material-icons prefix '+ icon_target +' '+ set_class +' "></i>');
						}		
					
					input_element.after(new_label);
								
					}
					current_field.find('.'+ icon_target).attr('class','material-icons prefix ' + set_class);

				}
				
			jQuery('div.field-settings-column').find('.current_'+ icon_trigger + ' i').attr('class',set_class)
			jQuery('div.field-settings-column').find('.current_'+ icon_trigger + ' i').text('')
			
			jQuery('div.field-settings-column #set_'+ icon_trigger).val(set_class)
			}	
	
}


function set_label_width(count){
	
	label_container.removeClass('col-sm-1').removeClass('col-sm-2').removeClass('col-sm-3').removeClass('col-sm-4').removeClass('col-sm-5').removeClass('col-sm-6').removeClass('col-sm-7').removeClass('col-sm-8').removeClass('col-sm-9').removeClass('col-sm-10').removeClass('col-sm-11').removeClass('col-sm-12')
	label_container.addClass('col-sm-'+	count);
	input_container.removeClass('col-sm-1').removeClass('col-sm-2').removeClass('col-sm-3').removeClass('col-sm-4').removeClass('col-sm-5').removeClass('col-sm-6').removeClass('col-sm-7').removeClass('col-sm-8').removeClass('col-sm-9').removeClass('col-sm-10').removeClass('col-sm-11').removeClass('col-sm-12')
	if(parseInt(count)==12)
		{
		input_container.addClass('col-sm-12');
		jQuery('div.field-settings-column .width_indicator.left input').val('12');
		jQuery('div.field-settings-column .width_indicator.right input').val('12');
		}
	else
		input_container.addClass('col-sm-'+	parseInt((12-parseInt(count))));	
}

function change_color(trigger,target,css,data_tag,data_tag_target){

	jQuery("." + trigger).spectrum(
		{
		 type: "text",
		 togglePaletteOnly: "true",
		 hideAfterPaletteSelect: "true",
		 showInput: "true",
		 showInitial: "true",
		 color: '#FFFFFF',
		 move: function(color) {
			if(data_tag)
				{
				if(data_tag_target)	
					current_field.find(data_tag_target).attr(data_tag,jQuery(this).val())
				else
					current_field.find(target).attr(data_tag,jQuery(this).val())
				}
				
			if(strstr(target,'data'))
				{
				current_field.find('#the-radios').attr('data-checked-bg-color',jQuery(this).val())
				current_field.find('#the-radios a.checked').css('background-color',jQuery(this).val())
				
				current_field.find('.thumb-icon.checked').css('background-color',jQuery(this).val())
				
				current_field.find('.icon-holder.editing').attr(target,jQuery(this).val())
				if(trigger=='icon-field-icon-off-color')
					current_field.find('.icon-holder.editing').find('.the-icon').css('color',jQuery(this).val())
				}
			else
				{
				if(css)	
					{
					if((current_field.hasClass('html_fields')) && css=='background-color')
						current_field.find('#field_container').css(css,jQuery(this).val())
					else if((current_field.hasClass('html_fields')) && css=='border-color')
						{
						if(current_field.hasClass('divider') && css=='border-color')
							current_field.find('.the_input_element').css(css,jQuery(this).val())
						
						current_field.find('#field_container').css(css,jQuery(this).val())
						}
					else
						current_field.find(target).css(css,jQuery(this).val())
					}
				}
			if(current_field.hasClass('slider') || current_field.hasClass('md-slider'))
				{
				//SET SLIDER HANDEL COLORS
					if(trigger=='set-slider-handel-text-color')
						current_field.find('.slider').attr('data-text-color',jQuery(this).val());
					if(trigger=='set-slider-handel-bg-color')
						current_field.find('.slider').attr('data-handel-background-color',jQuery(this).val());
					if(trigger=='set-slider-handel-border-color')
						current_field.find('.slider').attr('data-handel-border-color',jQuery(this).val());
				//SET SLIDER COLORS
					if(trigger=='set-slider-bg-color')
						current_field.find('.slider').attr('data-background-color',jQuery(this).val());
					if(trigger=='set-slider-fill-color')
						current_field.find('.slider').attr('data-fill-color',jQuery(this).val());
					if(trigger=='set-slider-border-color')
						current_field.find('.slider').attr('data-slider-border-color',jQuery(this).val());
				}
			 
			 
			},
		 
		}
	);
}


function set_biu_style(trigger, target, style){
	jQuery(document).on('click','div.field-settings-column '+ trigger +'-'+style,
	function()
		{
		if(current_field.find(target).hasClass('style_'+style))
			{
			current_field.find(target).removeClass('style_'+style);
			jQuery(this).removeClass('active');
			}
		else
			{
			current_field.find(target).addClass('style_'+style);
			jQuery(this).addClass('active');
			}
		}
	);
}

function get_biu_style(the_field, trigger, target,  style){
	jQuery('div.field-settings-column').find(trigger + '-' + style).removeClass('active');
	if(the_field.find(target).hasClass('style_'+style))
		jQuery('div.field-settings-column').find(trigger + '-' + style).addClass('active');
}

function show_current_field_type(the_obj){
	
	jQuery('.fields-column .show_field_type').removeClass('show_field_type');
	
	var obj = the_obj.clone();
	
	if(obj.hasClass('form_fields'))
		jQuery('.field-category.form_fields').trigger('click');
	if(obj.hasClass('preset_fields'))
		jQuery('.field-category.preset_fields').trigger('click');
	if(obj.hasClass('upload_fields'))
		jQuery('.field-category.upload_fields').trigger('click');
	if(obj.hasClass('other-elements'))
		jQuery('.field-category.other-elements').trigger('click');
		
	obj.removeClass('form_fields').removeClass('preset_fields').removeClass('upload_fields').removeClass('other-elements').removeClass('field').removeClass('form_field').removeClass('form_fields').removeClass('ui-draggable').removeClass('ui-draggable-handle').removeClass('admin_animated').removeClass('flipInXadmin').removeClass('ui-draggable-handle').removeClass('currently_editing').removeClass('dropped').removeClass('show_field_type')
	jQuery('.fields-column .'+obj.attr('class')).addClass('show_field_type');
}


function get_overall_form_settings(get_target){
	
	
	jQuery( ".set_form_width").val(get_target.attr('data-width-percentage'));
	
	
	/*try{
	jQuery( "#form_margin_top" ).spinner('destroy');
	jQuery( "#form_margin_right" ).spinner('destroy');
	jQuery( "#form_margin_bottom" ).spinner('destroy');
	jQuery( "#form_margin_left" ).spinner('destroy');
	jQuery( "#form_padding_top" ).spinner('destroy');
	jQuery( "#form_padding_right" ).spinner('destroy');
	jQuery( "#form_padding_bottom" ).spinner('destroy');
	jQuery( "#form_padding_left" ).spinner('destroy');
	console.log('done')	
	}
	catch(err)
		{
		console.log('not done')	
		}
	*/
	setTimeout(function(){
		var form_padding = jQuery('.inner-canvas-container.active').css('padding-top');
		jQuery( "#form_padding_top" ).val(parseInt(form_padding.replace('px',''))); 
		},300);
	 
	
	
	var top_margin = jQuery('.inner-canvas-container.active').css('margin-top');
	jQuery( "#form_margin_top" ).val(top_margin.replace('px',''))
	jQuery( "#form_margin_top" ).spinner(
			{ 
			//min:-100,
			spin: function( event, ui ) 
					{
					jQuery('.inner-canvas-container.active').css('margin-top',ui.value+'px');
					} 
			}
		).on('keyup', function(e)
			{
			console.log(jQuery('.inner-canvas-container.active').attr('class'));
			jQuery('.inner-canvas-container.active').css('margin-top',jQuery(this).val()+'px');
			});	 
			
			
	var right_margin = jQuery('.inner-canvas-container.active').css('margin-right');
	jQuery( "#form_margin_right" ).val(right_margin.replace('px',''))	
	jQuery( "#form_margin_right" ).spinner(
		{   
		spin: function( event, ui ) 
				{
				jQuery('.inner-canvas-container.active').css('margin-right',ui.value+'px');
				}
		}
	).on('keyup', function(e)
		{
		jQuery('.inner-canvas-container.active').css('margin-right',jQuery(this).val()+'px');
		});	
			
			
	var bottom_margin = jQuery('.inner-canvas-container.active').css('margin-bottom');
	jQuery( "#form_margin_bottom" ).val(bottom_margin.replace('px',''))	
	jQuery( "#form_margin_bottom" ).spinner(
		{  
		spin: function( event, ui ) 
				{
				jQuery('.inner-canvas-container.active').css('margin-bottom',ui.value+'px');
				}
		}
	).on('keyup', function(e)
		{
		jQuery('.inner-canvas-container.active').css('margin-bottom',jQuery(this).val()+'px');
		});
	
	var left_margin = jQuery('.inner-canvas-container.active').css('margin-left');
	jQuery( "#form_margin_left" ).val(left_margin.replace('px',''))	
	jQuery( "#form_margin_left" ).spinner(
		{  
		spin: function( event, ui ) 
				{
				jQuery('.inner-canvas-container.active').css('margin-left',ui.value+'px');
				}
		}
	).on('keyup', function(e)
		{
		jQuery('.inner-canvas-container.active').css('margin-left',jQuery(this).val()+'px');
		});	
		
	var top_padding = jQuery('.inner-canvas-container.active').css('padding-top');
	jQuery( "#form_padding_top" ).val(top_padding.replace('px',''))
	jQuery( "#form_padding_top" ).spinner(
			{ 
			min:0,
			spin: function( event, ui ) 
					{
					jQuery('.inner-canvas-container.active').css('padding-top',ui.value+'px');
					} 
			}
		).on('keyup', function(e)
			{
			jQuery('.inner-canvas-container.active').css('padding-top',jQuery(this).val()+'px');
			});	 
			
			
	var right_padding = jQuery('.inner-canvas-container.active').css('padding-right');
	jQuery( "#form_padding_right" ).val(right_padding.replace('px',''))	
	jQuery( "#form_padding_right" ).spinner(
		{ 
		min:0,  
		spin: function( event, ui ) 
				{
				jQuery('.inner-canvas-container.active').css('padding-right',ui.value+'px');
				}
		}
	).on('keyup', function(e)
		{
		jQuery('.inner-canvas-container.active').css('padding-right',jQuery(this).val()+'px');
		});	
			
			
	var bottom_padding = jQuery('.inner-canvas-container.active').css('padding-bottom');
	jQuery( "#form_padding_bottom" ).val(bottom_padding.replace('px',''))	
	jQuery( "#form_padding_bottom" ).spinner(
		{  
		min:0,
		spin: function( event, ui ) 
				{
				jQuery('.inner-canvas-container.active').css('padding-bottom',ui.value+'px');
				}
		}
	).on('keyup', function(e)
		{
		jQuery('.inner-canvas-container.active').css('padding-bottom',jQuery(this).val()+'px');
		});
	
	var left_padding = jQuery('.inner-canvas-container.active').css('padding-left');
	jQuery( "#form_padding_left" ).val(left_padding.replace('px',''))	
	jQuery( "#form_padding_left" ).spinner(
		{ 
		min:0, 
		spin: function( event, ui ) 
				{
				jQuery('.inner-canvas-container.active').css('padding-left',ui.value+'px');
				}
		}
	).on('keyup', function(e)
		{
		jQuery('.inner-canvas-container.active').css('padding-left',jQuery(this).val()+'px');
		});	
	
	
	
	var image = get_target.css('background-image');
	if(image)
		var image2 = image.replace( 'url("','');
	if(image2)
		var image3 = image2.replace( '")','');
	
	if(	image3 && image3!='undefined' && image3!='none' && !strstr(image3,'nex-forms-main'))
		{
		if(jQuery('#do-upload-form-image .fileinput-preview img').length > 0)
			jQuery('#do-upload-form-image .fileinput-preview img').attr('src',image3);
		else
			jQuery('#do-upload-form-image .fileinput-preview').append('<img src="'+ image3 +'">');
			
		jQuery('.overall-settings-column .fileinput').removeClass('fileinput-new').addClass('fileinput-exists');
		jQuery('.overall-settings-column .fileinput input').attr('name','do_image_upload_preview');
		}
	else
		{
		jQuery('#do-upload-form-image .fileinput-preview img').remove();
		jQuery('.overall-settings-column .fileinput').removeClass('fileinput-exists').addClass('fileinput-new');
		jQuery('.overall-settings-column .fileinput input').attr('name','do_image_upload_preview');
		}

//GET BACKGOUND IMAGE SIZE		
	jQuery('.form-bg-size button').removeClass('active');
	if(get_target.css('background-size')=='cover')
		jQuery('.form-bg-size button.cover').addClass('active');
	else if(get_target.css('background-size')=='contain')
		jQuery('.form-bg-size button.contain').addClass('active');
	else
		jQuery('.form-bg-size button.auto').addClass('active');

//GET BACKGOUND IMAGE REPEAT
	jQuery('.form-bg-repeat button').removeClass('active');

	if(get_target.css('background-repeat')=='no-repeat')
		jQuery('.form-bg-repeat button.no-repeat').addClass('active');
	else if(get_target.css('background-repeat')=='repeat-x')
		jQuery('.form-bg-repeat button.repeat-x').addClass('active');
	else if(get_target.css('background-repeat')=='repeat-y')
		jQuery('.form-bg-repeat button.repeat-y').addClass('active');
	else
		jQuery('.form-bg-repeat button.repeat').addClass('active');

//GET BACKGOUND POSITION	
	jQuery('.form-bg-position button').removeClass('active');
	
	
	
	if(get_target.css('background-position')=='center' || get_target.css('background-position')=='50% 50%' || get_target.css('background-position')=='50% 0%')
		jQuery('.form-bg-position button.center').addClass('active');
	else if(get_target.css('background-position')=='right' || get_target.css('background-position')=='100% 0%' )
		jQuery('.form-bg-position button.right').addClass('active');
	else
		jQuery('.form-bg-position button.left').addClass('active');
	

	jQuery(".wrapper-brd-color").spectrum("set", get_target.css('border-top-color'));
	jQuery(".wrapper-bg-color").spectrum("set", get_target.css('background-color'));
	
	
	jQuery('.drop-shadow').removeClass('active');
	if(get_target.css('box-shadow')=='rgba(0, 0, 0, 0.2) 0px 7px 16px 0px') 
		jQuery('.drop-shadow.shadow-light').addClass('active');
	else if(get_target.css('box-shadow')=='none')
		jQuery('.drop-shadow.shadow-none').addClass('active');
	else
		jQuery('.drop-shadow.shadow-dark').addClass('active');
	

	var form_padding = (jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').css('padding-top')) ? jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').css('padding-top') : '0';
	var set_padding = form_padding.replace('px','');
	jQuery('#form_padding').val(set_padding);
	
	var form_border_size = (jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').css('border-top-width')) ? jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').css('border-top-width') : '0';
	var set_form_border_size = form_border_size.replace('px','');
	jQuery('#wrapper-brd-size').val(set_form_border_size);
	
	
	
	var form_border_radius = (jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').css('border-top-right-radius')) ? jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').css('border-top-right-radius') : '4';
	var set_form_border_radius = form_border_radius.replace('px','');
	jQuery('#wrapper-brd-radius').val(set_form_border_radius);
	

	
	
		
		
		
	
	
	
	
	
		
}




function get_multistep_settings(get_target){

	var top_margin = get_target.css('margin-top');
	jQuery( "#bc_margin_top" ).val(top_margin.replace('px',''))
	jQuery( "#bc_margin_top" ).spinner(
			{ 
			//min:-100,
			spin: function( event, ui ) 
					{
					get_target.css('margin-top',ui.value+'px');
					} 
			}
		).on('keyup', function(e)
			{
			get_target.css('margin-top',jQuery(this).val()+'px');
			});	 
			
			
	var right_margin = get_target.css('margin-right');
	jQuery( "#bc_margin_right" ).val(right_margin.replace('px',''))	
	jQuery( "#bc_margin_right" ).spinner(
		{   
		spin: function( event, ui ) 
				{
				get_target.css('margin-right',ui.value+'px');
				}
		}
	).on('keyup', function(e)
		{
		get_target.css('margin-right',jQuery(this).val()+'px');
		});	
			
			
	var bottom_margin = get_target.css('margin-bottom');
	jQuery( "#bc_margin_bottom" ).val(bottom_margin.replace('px',''))	
	jQuery( "#bc_margin_bottom" ).spinner(
		{  
		spin: function( event, ui ) 
				{
				get_target.css('margin-bottom',ui.value+'px');
				}
		}
	).on('keyup', function(e)
		{
		get_target.css('margin-bottom',jQuery(this).val()+'px');
		});
	
	var left_margin = get_target.css('margin-left');
	jQuery( "#bc_margin_left" ).val(left_margin.replace('px',''))	
	jQuery( "#bc_margin_left" ).spinner(
		{  
		spin: function( event, ui ) 
				{
				get_target.css('margin-left',ui.value+'px');
				}
		}
	).on('keyup', function(e)
		{
		get_target.css('margin-left',jQuery(this).val()+'px');
		});	
		
	var top_padding = get_target.css('padding-top');
	jQuery( "#bc_padding_top" ).val(top_padding.replace('px',''))
	jQuery( "#bc_padding_top" ).spinner(
			{ 
			min:0,
			spin: function( event, ui ) 
					{
					get_target.css('padding-top',ui.value+'px');
					} 
			}
		).on('keyup', function(e)
			{
			get_target.css('padding-top',jQuery(this).val()+'px');
			});	 
			
			
	var right_padding = get_target.css('padding-right');
	jQuery( "#bc_padding_right" ).val(right_padding.replace('px',''))	
	jQuery( "#bc_padding_right" ).spinner(
		{ 
		min:0,  
		spin: function( event, ui ) 
				{
				get_target.css('padding-right',ui.value+'px');
				}
		}
	).on('keyup', function(e)
		{
		get_target.css('padding-right',jQuery(this).val()+'px');
		});	
			
			
	var bottom_padding = get_target.css('padding-bottom');
	jQuery( "#bc_padding_bottom" ).val(bottom_padding.replace('px',''))	
	jQuery( "#bc_padding_bottom" ).spinner(
		{  
		min:0,
		spin: function( event, ui ) 
				{
				get_target.css('padding-bottom',ui.value+'px');
				}
		}
	).on('keyup', function(e)
		{
		get_target.css('padding-bottom',jQuery(this).val()+'px');
		});
	
	var left_padding = get_target.css('padding-left');
	jQuery( "#bc_padding_left" ).val(left_padding.replace('px',''))	
	jQuery( "#bc_padding_left" ).spinner(
		{ 
		min:0, 
		spin: function( event, ui ) 
				{
				get_target.css('padding-left',ui.value+'px');
				}
		}
	).on('keyup', function(e)
		{
		get_target.css('padding-left',jQuery(this).val()+'px');
		});	
	
	
	
	var image = get_target.css('background-image');
	if(image)
		var image2 = image.replace( 'url("','');
	if(image2)
		var image3 = image2.replace( '")','');
	
	if(	image3 && image3!='undefined' && image3!='none' && !strstr(image3,'nex-forms-main'))
		{
		if(jQuery('#do-upload-bc-image .fileinput-preview img').length > 0)
			jQuery('#do-upload-bc-image .fileinput-preview img').attr('src',image3);
		else
			jQuery('#do-upload-bc-image .fileinput-preview').append('<img src="'+ image3 +'">');
			
		jQuery('.mutistep-settings-column .fileinput').removeClass('fileinput-new').addClass('fileinput-exists');
		jQuery('.mutistep-settings-column .fileinput input').attr('name','do_image_upload_preview');
		}
	else
		{
		jQuery('#do-upload-bc-image .fileinput-preview img').remove();
		jQuery('.mutistep-settings-column .fileinput').removeClass('fileinput-exists').addClass('fileinput-new');
		jQuery('.mutistep-settings-column .fileinput input').attr('name','do_image_upload_preview');
		}

//GET BACKGOUND IMAGE SIZE		
	jQuery('.bc-bg-size button').removeClass('active');
	if(get_target.css('background-size')=='cover')
		jQuery('.bc-bg-size button.cover').addClass('active');
	else if(get_target.css('background-size')=='contain')
		jQuery('.bc-bg-size button.contain').addClass('active');
	else
		jQuery('.bc-bg-size button.auto').addClass('active');

//GET BACKGOUND IMAGE REPEAT
	jQuery('.form-bg-repeat button').removeClass('active');

	if(get_target.css('background-repeat')=='no-repeat')
		jQuery('.bc-bg-repeat button.no-repeat').addClass('active');
	else if(get_target.css('background-repeat')=='repeat-x')
		jQuery('.bc-bg-repeat button.repeat-x').addClass('active');
	else if(get_target.css('background-repeat')=='repeat-y')
		jQuery('.bc-bg-repeat button.repeat-y').addClass('active');
	else
		jQuery('.bc-bg-repeat button.repeat').addClass('active');

//GET BACKGOUND POSITION	
	jQuery('.bc-bg-position button').removeClass('active');
	
	
	
	if(get_target.css('background-position')=='center' || get_target.css('background-position')=='50% 50%' || get_target.css('background-position')=='50% 0%')
		jQuery('.bc-bg-position button.center').addClass('active');
	else if(get_target.css('background-position')=='right' || get_target.css('background-position')=='100% 0%' )
		jQuery('.bc-bg-position button.right').addClass('active');
	else
		jQuery('.bc-bg-position button.left').addClass('active');
	

	jQuery(".bc-brd-color").spectrum("set", get_target.css('border-top-color'));
	jQuery(".bc-bg-color").spectrum("set", get_target.css('background-color'));
	
	
	jQuery(".bc-crumb-bg-color").spectrum("set", get_target.find('li').css('background-color'));
	jQuery(".bc-crumb-text-color").spectrum("set", get_target.find('a').css('color'));
	jQuery(".bc-crumb-border-color").spectrum("set", get_target.find('li').css('border-top-color'));
	jQuery(".bc-crumb-connector-color").spectrum("set", get_target.find('.step_connecter').css('border-bottom-color'));
	

	
	var form_border_size = (jQuery('.nf_ms_breadcrumb').css('border-top-width')) ? jQuery('.nf_ms_breadcrumb').css('border-top-width') : '0';
	var set_form_border_size = form_border_size.replace('px','');
	jQuery('#bc-brd-size').val(set_form_border_size);
	
	
	
	var form_border_radius = (jQuery('.nf_ms_breadcrumb').css('border-top-right-radius')) ? jQuery('.nf_ms_breadcrumb').css('border-top-right-radius') : '4';
	var set_form_border_radius = form_border_radius.replace('px','');
	jQuery('#bc-brd-radius').val(set_form_border_radius);		
	
	if(jQuery('.nf_ms_breadcrumb ul').hasClass('align_center'))
		jQuery('.crumb-position .center').addClass('active');
	else if(jQuery('.nf_ms_breadcrumb ul').hasClass('align_right'))
		jQuery('.crumb-position .right').addClass('active');
	else
		jQuery('.crumb-position .left').addClass('active');
	
	
	update_select('#set_breadcrumb_type');
	update_select('#bc_theme_selection');
	update_select('#bc_style_selection');
	update_select('#step_in_transition_animation');
	update_select('#step_out_transition_animation');
	
	
}





function get_timer_settings(get_target){

	var top_margin = get_target.css('margin-top');
	jQuery( "#timer_margin_top" ).val(top_margin.replace('px',''))
	jQuery( "#timer_margin_top" ).spinner(
			{ 
			//min:-100,
			spin: function( event, ui ) 
					{
					get_target.css('margin-top',ui.value+'px');
					} 
			}
		).on('keyup', function(e)
			{
			get_target.css('margin-top',jQuery(this).val()+'px');
			});	 
			
			
	var right_margin = get_target.css('margin-right');
	jQuery( "#timer_margin_right" ).val(right_margin.replace('px',''))	
	jQuery( "#timer_margin_right" ).spinner(
		{   
		spin: function( event, ui ) 
				{
				get_target.css('margin-right',ui.value+'px');
				}
		}
	).on('keyup', function(e)
		{
		get_target.css('margin-right',jQuery(this).val()+'px');
		});	
			
			
	var bottom_margin = get_target.css('margin-bottom');
	jQuery( "#timer_margin_bottom" ).val(bottom_margin.replace('px',''))	
	jQuery( "#timer_margin_bottom" ).spinner(
		{  
		spin: function( event, ui ) 
				{
				get_target.css('margin-bottom',ui.value+'px');
				}
		}
	).on('keyup', function(e)
		{
		get_target.css('margin-bottom',jQuery(this).val()+'px');
		});
	
	var left_margin = get_target.css('margin-left');
	jQuery( "#timer_margin_left" ).val(left_margin.replace('px',''))	
	jQuery( "#timer_margin_left" ).spinner(
		{  
		spin: function( event, ui ) 
				{
				get_target.css('margin-left',ui.value+'px');
				}
		}
	).on('keyup', function(e)
		{
		get_target.css('margin-left',jQuery(this).val()+'px');
		});	
		
	var top_padding = get_target.css('padding-top');
	jQuery( "#timer_padding_top" ).val(top_padding.replace('px',''))
	jQuery( "#timer_padding_top" ).spinner(
			{ 
			min:0,
			spin: function( event, ui ) 
					{
					get_target.css('padding-top',ui.value+'px');
					} 
			}
		).on('keyup', function(e)
			{
			get_target.css('padding-top',jQuery(this).val()+'px');
			});	 
			
			
	var right_padding = get_target.css('padding-right');
	jQuery( "#timer_padding_right" ).val(right_padding.replace('px',''))	
	jQuery( "#timer_padding_right" ).spinner(
		{ 
		min:0,  
		spin: function( event, ui ) 
				{
				get_target.css('padding-right',ui.value+'px');
				}
		}
	).on('keyup', function(e)
		{
		get_target.css('padding-right',jQuery(this).val()+'px');
		});	
			
			
	var bottom_padding = get_target.css('padding-bottom');
	jQuery( "#timer_padding_bottom" ).val(bottom_padding.replace('px',''))	
	jQuery( "#timer_padding_bottom" ).spinner(
		{  
		min:0,
		spin: function( event, ui ) 
				{
				get_target.css('padding-bottom',ui.value+'px');
				}
		}
	).on('keyup', function(e)
		{
		get_target.css('padding-bottom',jQuery(this).val()+'px');
		});
	
	var left_padding = get_target.css('padding-left');
	jQuery( "#timer_padding_left" ).val(left_padding.replace('px',''))	
	jQuery( "#timer_padding_left" ).spinner(
		{ 
		min:0, 
		spin: function( event, ui ) 
				{
				get_target.css('padding-left',ui.value+'px');
				}
		}
	).on('keyup', function(e)
		{
		get_target.css('padding-left',jQuery(this).val()+'px');
		});	
	
	
	
	var image = get_target.css('background-image');
	if(image)
		var image2 = image.replace( 'url("','');
	if(image2)
		var image3 = image2.replace( '")','');
	
	if(	image3 && image3!='undefined' && image3!='none' && !strstr(image3,'nex-forms-main'))
		{
		if(jQuery('#do-upload-timer-image .fileinput-preview img').length > 0)
			jQuery('#do-upload-timer-image .fileinput-preview img').attr('src',image3);
		else
			jQuery('#do-upload-timer-image .fileinput-preview').append('<img src="'+ image3 +'">');
			
		jQuery('.mutistep-settings-column .fileinput').removeClass('fileinput-new').addClass('fileinput-exists');
		jQuery('.mutistep-settings-column .fileinput input').attr('name','do_image_upload_preview');
		}
	else
		{
		jQuery('#do-upload-timer-image .fileinput-preview img').remove();
		jQuery('.mutistep-settings-column .fileinput').removeClass('fileinput-exists').addClass('fileinput-new');
		jQuery('.mutistep-settings-column .fileinput input').attr('name','do_image_upload_preview');
		}

//GET BACKGOUND IMAGE SIZE		
	jQuery('.timer-bg-size button').removeClass('active');
	if(get_target.css('background-size')=='cover')
		jQuery('.timer-bg-size button.cover').addClass('active');
	else if(get_target.css('background-size')=='contain')
		jQuery('.timer-bg-size button.contain').addClass('active');
	else
		jQuery('.timer-bg-size button.auto').addClass('active');

//GET BACKGOUND IMAGE REPEAT
	jQuery('.form-bg-repeat button').removeClass('active');

	if(get_target.css('background-repeat')=='no-repeat')
		jQuery('.timer-bg-repeat button.no-repeat').addClass('active');
	else if(get_target.css('background-repeat')=='repeat-x')
		jQuery('.timer-bg-repeat button.repeat-x').addClass('active');
	else if(get_target.css('background-repeat')=='repeat-y')
		jQuery('.timer-bg-repeat button.repeat-y').addClass('active');
	else
		jQuery('.timer-bg-repeat button.repeat').addClass('active');

//GET BACKGOUND POSITION	
	jQuery('.timer-bg-position button').removeClass('active');
	
	
	
	if(get_target.css('background-position')=='center' || get_target.css('background-position')=='50% 50%' || get_target.css('background-position')=='50% 0%')
		jQuery('.timer-bg-position button.center').addClass('active');
	else if(get_target.css('background-position')=='right' || get_target.css('background-position')=='100% 0%' )
		jQuery('.timer-bg-position button.right').addClass('active');
	else
		jQuery('.timer-bg-position button.left').addClass('active');
	

	jQuery(".timer-brd-color").spectrum("set", get_target.css('border-top-color'));
	jQuery(".timer-bg-color").spectrum("set", get_target.css('background-color'));
	
	
	jQuery(".timer-crumb-bg-color").spectrum("set", get_target.find('li').css('background-color'));
	jQuery(".timer-crumb-text-color").spectrum("set", get_target.find('a').css('color'));
	jQuery(".timer-crumb-border-color").spectrum("set", get_target.find('li').css('border-top-color'));
	jQuery(".timer-crumb-connector-color").spectrum("set", get_target.find('.step_connecter').css('border-bottom-color'));
	

	
	var form_border_size = (jQuery('.timer-inner-container').css('border-top-width')) ? jQuery('.timer-inner-container').css('border-top-width') : '0';
	var set_form_border_size = form_border_size.replace('px','');
	jQuery('#timer-brd-size').val(set_form_border_size);

	
	
	jQuery('.timer-bold').removeClass('active');
	if(get_target.css('font-weight')=='bold' || get_target.css('font-weight')=='700')
		jQuery('.timer-bold').addClass('active');

	jQuery('.timer-italic').removeClass('active');
	if(get_target.css('font-style')=='italic')
		jQuery('.timer-italic').addClass('active');
	
	
	
}


