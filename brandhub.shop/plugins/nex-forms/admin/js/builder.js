'use strict';
var dev = false;
var strPos = 0;
var timer;
var help_text_timer;
var LS_MCE_l10n = 'test';
var mtheme_shortcodegen_url = '';
var set_context_id = '';
var js_editor_before = '';
var js_editor_after = '';
var css_editor = '';
var set_dev = (dev) ? '-no-menu' : '';
jQuery('div.updated').remove();
jQuery('.update-nag').remove();
jQuery('div.error').remove();


function render_radiochecks(field_container,group_name,target,radio_check_type, theme)
	{
	var set_options =''; 
		field_container.find(target).each(
			function(i)
				{
				var label = jQuery(this).find('.input-label').text();
				var value = jQuery(this).find('input').val();
				
				var radio_layout = field_container.find('#the-radios').attr('data-layout');
				var set_layout = '';
				
				
				var set_ui_theme = '';
				
				if(jQuery('select[name="set_form_theme"]').val()=='jquery_ui')
					set_ui_theme = 'ui-state-default';
				
				if(radio_layout=='1c')
					set_layout='display-block col-sm-12'; 
				if(radio_layout=='2c')
					set_layout='display-block col-sm-6';
				if(radio_layout=='3c')
					set_layout='display-block col-sm-4';
				if(radio_layout=='4c')
					set_layout='display-block col-sm-3';

				if(theme=='bootstrap' || theme=='m_design')
					{
					if(radio_check_type=='radio')
						{
						field_container.removeClass('md-radio-group').removeClass('jq-radio-group').removeClass('classic-radio-group').addClass('radio-group');
						set_options += '<label class="radio-inline  '+ set_ui_theme + ' ' + set_layout +'" for="'+ format_illegal_chars(label) +'" ><span class="svg_ready"><input class="radio the_input_element" type="radio" name="'+ format_illegal_chars(group_name) +'" id="'+format_illegal_chars(label)+'" value="'+value+'"><span class="input-label radio-label">'+label+'</span></span></label>';					
						}
					if(radio_check_type=='check')
						{
						field_container.removeClass('md-check-group').removeClass('jq-check-group').removeClass('classic-check-group').addClass('check-group');
						set_options += '<label class="checkbox-inline '+ set_ui_theme + ' ' + set_layout +'" for="'+ format_illegal_chars(label) +'" ><span class="svg_ready"><input class="check the_input_element" type="checkbox" name="'+ format_illegal_chars(group_name) +'" id="'+format_illegal_chars(label)+'" value="'+value+'"><span class="input-label check-label">'+label+'</span></span></label>';
						}
					}
					
				if(theme=='jq_ui')
					{
					if(radio_check_type=='radio')
						{
						field_container.removeClass('md-radio-group').removeClass('radio-group').removeClass('classic-radio-group').addClass('jq-radio-group');
						set_options += '<div class="jq_radio_check  '+ set_layout +'"><label class="input-label" for="'+ format_illegal_chars(label) +'_jq">'+label+'</label><input type="radio" name="'+ format_illegal_chars(group_name) +'" id="'+ format_illegal_chars(label) +'_jq" value="'+value+'"></div>';
						}
					if(radio_check_type=='check')
						{
						field_container.removeClass('md-check-group').removeClass('check-group').removeClass('classic-check-group').addClass('jq-check-group');
						set_options += '<div class="jq_radio_check  '+ set_layout +'"><label class="input-label" for="'+ format_illegal_chars(label) +'_jq">'+label+'</label><input type="checkbox" name="'+ format_illegal_chars(group_name) +'" id="'+ format_illegal_chars(label) +'_jq" value="'+value+'"></div>';	
						}
					}
				if(theme=='browser')
					{
					if(radio_check_type=='radio')
						{
						field_container.removeClass('md-radio-group').removeClass('jq-radio-group').addClass('radio-group').addClass('classic-radio-group');
						set_options += '<label class="radio-inline  '+ set_layout +'" for="'+ format_illegal_chars(label) +'" ><span class="svg_ready"><input class="radio the_input_element" type="radio" name="'+ format_illegal_chars(group_name) +'" id="'+format_illegal_chars(label)+'" value="'+value+'"><span class="input-label radio-label">'+label+'</span></span></label>';					
						}
					if(radio_check_type=='check')
						{
						field_container.removeClass('md-check-group').removeClass('jq-check-group').addClass('check-group').addClass('classic-check-group');
						set_options += '<label class="checkbox-inline  '+ set_layout +'" for="'+ format_illegal_chars(label) +'" ><span class="svg_ready"><input class="check the_input_element" type="checkbox" name="'+ format_illegal_chars(group_name) +'" id="'+format_illegal_chars(label)+'" value="'+value+'"><span class="input-label check-label">'+label+'</span></span></label>';
						}
					}
				
				
				}
			);
		field_container.find('.input-inner').html(set_options);		
	}


function reset_field_theme(set_theme,field_container){
	
	var field_container = field_container;
	var group_name = field_container.find('input').attr('name');
	var radio_check_type = 'none';
	var target = '';
	
	jQuery('.settings-column-style').removeClass('material_theme');
	jQuery('.field-setting.s-odd_setting').removeAttr('style');
	
	if(set_theme=='browser' )
				{
				jQuery('.ui-nex-forms-container .input-group').addClass('input-group-bd');
				jQuery('.ui-nex-forms-container .input-group').removeClass('input-group');
				jQuery('.ui-nex-forms-container .input-group-addon').addClass('input-group-addon-bd');
				jQuery('.ui-nex-forms-container .input-group-addon').removeClass('input-group-addon');
				jQuery('.ui-nex-forms-container button').removeClass('btn').removeClass('btn-default');
				}
			else
				{
				jQuery('.ui-nex-forms-container .input-group-bd').addClass('input-group').removeClass('input-group-bd');
				jQuery('.ui-nex-forms-container .input-group-addon-bd').addClass('input-group-addon').removeClass('input-group-addon-bd');	
				jQuery('.ui-nex-forms-container button').addClass('btn').addClass('btn-default');
				}
	
	if(field_container.hasClass('radio-group') || field_container.hasClass('md-radio-group') || field_container.hasClass('jq-radio-group') || field_container.hasClass('classic-radio-group'))
		radio_check_type = 'radio';
	if(field_container.hasClass('check-group') || field_container.hasClass('md-check-group') || field_container.hasClass('jq-check-group')  || field_container.hasClass('classic-check-group'))
		radio_check_type = 'check';
	
	if(field_container.hasClass('radio-group') || field_container.hasClass('check-group') || field_container.hasClass('classic-radio-group') || field_container.hasClass('classic-check-group'))
		target = '.input-inner label';
	if(field_container.hasClass('md-radio-group') || field_container.hasClass('md-check-group'))
		target = '.radio_check_input';
	if(field_container.hasClass('jq-radio-group') || field_container.hasClass('jq-check-group'))
		target = '.jq_radio_check';
	
	
	if(radio_check_type!='none')
		render_radiochecks(field_container,group_name,target,radio_check_type, 'bootstrap');
	if(set_theme!='browser' )
		setup_form_element(field_container);
	
	
//MATERIAL THEME				
	if(set_theme=='m_design')
		{
		
			if(field_container.hasClass('slider'))
				{
				field_container.removeClass('slider').addClass('md-slider');
				
					field_container.find( "#slider" ).slider('destroy');
					field_container.find( "#slider" ).addClass('noUi-target').addClass('noUi-ltr').addClass('noUi-horizontal');  
					setup_form_element(field_container);
					
				}
			if(field_container.hasClass('date'))
				{
				field_container.removeClass('date').addClass('md-datepicker');  
				setup_form_element(field_container);
				}
			if(field_container.hasClass('jq-datepicker'))
				{
				field_container.find('input').datepicker('destroy');
				field_container.removeClass('jq-datepicker').addClass('md-datepicker');
				setup_form_element(field_container);
				}
				
			if(field_container.hasClass('time'))
				{
				field_container.removeClass('time').addClass('md-time-picker');  
				setup_form_element(field_container);
				}
			if(field_container.hasClass('jq-time-picker'))
				{
				field_container.find('input').timepicker('destroy');
				field_container.removeClass('jq-time-picker').addClass('md-time-picker');
				setup_form_element(field_container);
				}
			
			
			
		}
	
//BOOTSTRAP THEME						
	else if(set_theme=='bootstrap' || set_theme=='browser' || set_theme=='m_design' || set_theme=='neumorphism')
		{
			if(set_theme=='bootstrap')
				{
				if(!field_container.hasClass('html_fields') || !field_container.hasClass('button_fields'))
					field_container.find('.the_input_element').addClass('form-control')
				
					field_container.find('.the_input_element').removeClass('ui-corner-all').removeClass('ui-widget').removeClass('default-browser-style');
				}
			if(set_theme=='browser' )
				{
				field_container.find('.the_input_element').removeClass('ui-corner-all').removeClass('ui-widget').removeClass('form-control').addClass('default-browser-style');
				}
		if(radio_check_type!='none' && set_theme!='browser')
			setTimeout(function(){field_container.find('#the-radios input').nexchecks()},10);
		
		
		if(field_container.hasClass('touch_spinner'))
			{
			field_container.find('#spinner').attr('data-verticalbuttons',false);
			field_container.find('.bootstrap-touchspin .input-group-btn').remove();
			field_container.find('.bootstrap-touchspin .input-group-btn-vertical').remove();
			
			field_container.find('.bootstrap-touchspin').prepend('<span class="input-group-btn"><button class="btn btn-default bootstrap-touchspin-down" type="button">-</button></span>');
			field_container.find('.bootstrap-touchspin').append('<span class="input-group-btn"><button class="btn btn-default bootstrap-touchspin-up" type="button">+</button></span>');

			field_container.removeClass('md-spinner').removeClass('jq-spinner');
			
			setup_form_element(field_container);
			}
		
		
		field_container.removeClass('jquery_field');
		field_container.removeClass('material_field');
		field_container.removeClass('bootstrap_field');
		field_container.removeClass('classic_field');
		
		if(set_theme=='bootstrap')
			field_container.addClass('bootstrap_field');
		if(set_theme=='browser')
			field_container.addClass('classic_field');
			
		if(field_container.hasClass('md-slider'))
			{
			field_container.removeClass('md-slider').addClass('slider');
			field_container.find( "#slider" ).slider('destroy');
			field_container.find( "#slider" ).removeClass('noUi-target').removeClass('noUi-ltr').removeClass('noUi-horizontal');
			setup_form_element(field_container);
			}
		
			field_container.find('#the-radios' ).addClass('the-radios');	
			
			
			if(field_container.hasClass('preset_fields') || field_container.hasClass('text') || field_container.hasClass('autocomplete') || field_container.hasClass('md-datepicker') || field_container.hasClass('jq-datepicker') || field_container.hasClass('md-time-picker') || field_container.hasClass('jq-time-picker') || field_container.hasClass('textarea') || field_container.hasClass('select') || field_container.hasClass('multi-select') || field_container.hasClass('password') )
				{
				if(field_container.hasClass('submit-button') || field_container.hasClass('nex-button') || field_container.hasClass('prev-button'))
					return;
					
				
				field_container.find('.label_container').removeClass('hidden');
				
				field_container.find('i.material-icons').remove();
				field_container.find('#md_label').remove();
				
				field_container.find('.input-field').attr('class', 'col-sm-12  input_container');
				field_container.find('.input-group-md').attr('class', 'input-group');
				field_container.find('.input-group-addon.prefix2').attr('class','input-group-addon prefix')
				field_container.find('.input-group-addon').removeClass('hidden').removeClass('ui-button').removeClass('jq-add-on');;
				
				if(field_container.hasClass('textarea'))
					{
					field_container.find('.textarea').removeClass('materialize-textarea');;
					}
				if(field_container.hasClass('select') || field_container.hasClass('multi-select'))
					{
					if(field_container.find('select').hasClass('jq_select'))
						{
						field_container.find('select').selectmenu('destroy');
						field_container.find('select').removeClass('jq_select');
						}
					field_container.find('select').material_select('destroy');
					field_container.find('select').removeClass('material_select').removeClass('initialized').addClass('form-control');
					}
				
				if(field_container.hasClass('md-datepicker'))
					{
					/*field_container.find('input').bootstrapMaterialDatePicker('destroy');
					field_container.find('input').attr('readonly',false);
					field_container.removeClass('md-datepicker').addClass('date');
					setup_form_element(field_container);*/
					}
				if(field_container.hasClass('jq-datepicker'))
					{
					/*field_container.find('input').datepicker('destroy');
					field_container.removeClass('jq-datepicker').addClass('date');
					setup_form_element(field_container);*/
					}
					
				
				if(field_container.hasClass('md-time-picker'))
					{
					/*field_container.find('input').bootstrapMaterialDatePicker('destroy');
					field_container.find('input').attr('readonly',false);
					field_container.removeClass('md-time-picker').addClass('time');
					setup_form_element(field_container);*/
					}
				if(field_container.hasClass('jq-time-picker'))
					{
					/*field_container.find('input').timepicker('destroy');
					field_container.removeClass('jq-time-picker').addClass('time');
					setup_form_element(field_container);*/
					}
			
			if(set_theme=='browser')
				jQuery('.ui-nex-forms-container .form-control').removeClass('form-control');
			}
			
			
			
			if(set_theme=='m_design')
				{
				if(field_container.hasClass('slider'))
					{
					field_container.removeClass('slider').addClass('md-slider');
					
						field_container.find( "#slider" ).slider('destroy');
						field_container.find( "#slider" ).addClass('noUi-target').addClass('noUi-ltr').addClass('noUi-horizontal');  
						setup_form_element(field_container);
						
					}
				if(field_container.hasClass('date'))
					{
					field_container.removeClass('date').addClass('md-datepicker');  
					setup_form_element(field_container);
					}
				if(field_container.hasClass('jq-datepicker'))
					{
					field_container.find('input').datepicker('destroy');
					field_container.removeClass('jq-datepicker').addClass('md-datepicker');
					setup_form_element(field_container);
					}
					
				if(field_container.hasClass('time'))
					{
					field_container.removeClass('time').addClass('md-time-picker');  
					setup_form_element(field_container);
					}
				if(field_container.hasClass('jq-time-picker'))
					{
					field_container.find('input').timepicker('destroy');
					field_container.removeClass('jq-time-picker').addClass('md-time-picker');
					setup_form_element(field_container);
					}
				}
			
			
			
		}	
	
	
//JQUERY UI THEME						
	else if(set_theme=='jq_ui')
		{
		
		if(radio_check_type!='none')
			field_container.find( "#the-radios input" ).checkboxradio();
		
		if(field_container.hasClass('touch_spinner'))
			{
			field_container.find('#spinner').attr('data-verticalbuttons',true);
			
			field_container.find('.bootstrap-touchspin .input-group-btn').remove();
			field_container.find('.bootstrap-touchspin .input-group-btn-vertical').remove();
			
			field_container.find('.bootstrap-touchspin').append('<span class="input-group-btn-vertical"><button class="btn btn-default bootstrap-touchspin-up" type="button"><i class="glyphicon glyphicon-chevron-up"></i></button><button class="btn btn-default bootstrap-touchspin-down" type="button"><i class="glyphicon glyphicon-chevron-down"></i></button></span>');
			
			field_container.removeClass('md-spinner').addClass('jq-spinner');
			
			setup_form_element(field_container);
			
			}
		if(field_container.hasClass('md-slider'))
			{
			field_container.removeClass('md-slider').addClass('slider');
			field_container.find( "#slider" ).slider('destroy');
			field_container.find( "#slider" ).removeClass('noUi-target').removeClass('noUi-ltr').removeClass('noUi-horizontal');
			setup_form_element(field_container);
			}
		
		field_container.find('#the-radios' ).removeClass('the-radios');	
		
		jQuery( ".md-radio-group #the-radios" ).removeClass('the-radios');	
		jQuery( ".md-check-group #the-radios" ).removeClass('the-radios');	

		
		field_container.find('.the_input_element').addClass('ui-corner-all').addClass('ui-widget').addClass('form-control');
		
		field_container.find('.label_container').removeClass('hidden');
		field_container.find('i.material-icons').remove();
		field_container.find('#md_label').remove();
		
		field_container.find('.input-field').attr('class', 'col-sm-12  input_container');
		field_container.find('.input-group-md').attr('class', 'input-group');
		field_container.find('.input-group-addon.prefix2').attr('class','input-group-addon prefix')
		field_container.find('.input-group-addon').removeClass('hidden').removeClass('ui-button').addClass('jq-add-on');
		
		
		if(field_container.hasClass('select') || field_container.hasClass('multi-select'))
			{
			if(field_container.hasClass('material_field'))
				{
				field_container.find('select').material_select('destroy');
				field_container.find('select').removeClass('material_select').removeClass('initialized');
				}
			}
		if(field_container.hasClass('select'))
			{
			field_container.find('select').addClass('jq_select');
			field_container.find( "select.jq_select" ).selectmenu();
			}
		
		
		if(field_container.hasClass('date') || field_container.hasClass('md-datepicker'))
			{
			field_container.removeClass('date').addClass('jq-datepicker');  
			setup_form_element(field_container);
			}
		

		
		
		if(field_container.hasClass('time') || field_container.hasClass('md-time-picker'))
			{
			field_container.removeClass('time').addClass('jq-time-picker');  
			setup_form_element(field_container);
			}
		
		
		field_container.removeClass('classic_field');
		field_container.addClass('jquery_field');
		field_container.removeClass('material_field');
		field_container.removeClass('bootstrap_field');
		
		
		jQuery('.ui-nex-forms-container select').removeClass('form-control');
		
		
		}	
		jQuery('.ui-nex-forms-container .single-image-select-group #the-radios').addClass('the-radios');
		jQuery('.ui-nex-forms-container .multi-image-select-group #the-radios').addClass('the-radios');
		jQuery('.the-icon-field-container').removeClass('form-control');
		jQuery('.ui-nex-forms-container .html_fields .the_input_element, .ui-nex-forms-container .button_fields .the_input_element').removeClass('form-control');
}

function hide_step_back_next(obj){
	var btn_container_1 = obj.closest('.form_field');			
	var btn_container_2 = btn_container_1.closest('.form_field.grid-system');
	if(btn_container_2.hasClass('grid-system'))
		btn_container_2.removeClass('hidden');	
	else
		btn_container_1.removeClass('hidden')	
}
window.onbeforeunload = confirmExit;
  function confirmExit()
  {
	if(jQuery('.check_save').hasClass('not_saved'))
   	 return "You have attempted to leave this page.  If you have made any changes without clicking the Save button, your changes will be lost.  Are you sure you want to exit this page?";
  }
 




jQuery(document).ready(
function()
	{
	
	
	jQuery(document).on('click','div.icon-holder:not(.icon_disabled)',
				function()
					{
					
				
					
						
						
					var label = jQuery(this);
					
					var form_field = label.closest('.icon-select-group');
					
					var input_container = jQuery(this).closest('.input_container');
					
					var form_field_container = jQuery(this).closest('.form_field');
					
					
					var icon_container = input_container.find('.icon-container');
					var selected_icon_container = input_container.find('.selected-icon-holder');

					icon_container.css('width', icon_container.closest('.form_field').css('width')+'px');
					
					
					
					
					if(input_container.closest('.step').hasClass('auto-step'))
							{
							
							if(input_container.closest('.step').hasClass('last_step'))
								{
								setTimeout(function()
									{
									icon_container.closest('form').submit();
									},500);
								}
							else
								{	
								setTimeout(function()
									{
									input_container.closest('.step').find('.nex-step').trigger('click');	
									},300
									)
								}
						}
					
					
					
					
					
					
					if(label.hasClass('default-selected-icon'))
						{
						
						
						if(jQuery(this).hasClass('icon-dropdown-opened'))
							{
							icon_container.slideUp('fast');
							label.removeClass('icon-dropdown-opened');
							}
						else
							{
							label.addClass('icon-dropdown-opened');
							icon_container.slideDown('fast');	
							}
						}
					else
						{
							var animation = 'flipInY';
							if(label.closest('.input_container').attr('data-animation'))
								animation = label.closest('.input_container').attr('data-animation');
							
							
							label.find('.icon-select').removeClass('animated');
							label.find('.icon-select').removeClass(animation);
							
							setTimeout(function(){
								label.find('.icon-select').addClass('animated');
								label.find('.icon-select').addClass(animation);
								
								
							},10);
							setTimeout(function()
								{
								if(label.hasClass('icon-checked'))
									{
									
									if(input_container.hasClass('icon-spinner'))
										input_container.find('.icon-spin-next').trigger('click');
									
									if(label.hasClass('multi-dropdown-icon-checked'))
										{
										icon_container.show();
										var unselected = label.detach();
										icon_container.find('.icon_place_holder_'+ unselected.attr('data-icon-number')).prepend(unselected);
										
										if(selected_icon_container.find('.multi-dropdown-icon-checked').length>0)
											selected_icon_container.find('.default-selected-icon').hide();
										else
											{
											selected_icon_container.find('.default-selected-icon').show();
											selected_icon_container.find('.default-selected-icon input').focus();
											selected_icon_container.find('.default-selected-icon input').prop('checked',true)
											selected_icon_container.find('.default-selected-icon input').trigger('change');
											icon_container.hide();
											}
										}
										
									label.find('.off-icon').show();
									label.find('.on-icon').hide();
									
									label.find('.off-label').show();
									label.find('.on-label').hide();
									
									label.removeClass('icon-checked');
									
									label.removeClass('icon-checked');
									label.addClass('animated');
									
									label.find('.icon-select').removeClass(animation);
									label.find('.icon-select').addClass(animation);
									
									label.find('input').focus();
									label.find('input').prop('checked',false);
									label.find('input').trigger('change');
									
									
									}
								else
									{
										
									
									label.find('input').focus();	
									label.find('input').prop('checked',true);
									label.find('input').trigger('change');
									
									if(label.find('input').attr('type')!='checkbox')
										{
										label.parent().find('.icon-holder').removeClass('icon-checked');
										label.parent().find('.off-label').show();

										label.parent().find('.on-label').hide();
										
										label.parent().find('.off-icon').show();
										label.parent().find('.on-icon').hide();
										}
									
									label.addClass('icon-checked');
									
									label.find('.on-label').show();
									label.find('.off-label').hide();
									
									label.find('.on-icon').show();
									label.find('.off-icon').hide();
									
									
									
									if(input_container.hasClass('icon-spinner') )
										{
										
										if(form_field.hasClass('appendix_field') && !form_field.hasClass('material_field'))
											{
											var label_width = 0;
											var icon_width = 0;
											
											if(!input_container.hasClass('icon-label-tip') && !input_container.hasClass('icon-label-hidden'))
												{
												label_width = label.find('.on-label').outerWidth();
												}
											
											icon_width = label.find('.on-icon span').css('font-size');
											
											input_container.css('width',(55+(parseInt(label_width)+parseInt(icon_width)))+'px')
			
								
											}
										}
									if(input_container.hasClass('icon-dropdown'))
										{
										
										
										if(!icon_container.find('.icon_place_holder_'+label.attr('data-icon-number')).is('span') && !label.hasClass('is_default_selection'))
											label.wrap('<span class="icon_place_holder_'+ label.attr('data-icon-number') +'"></span>');
										
										var selected = label.detach();
										
										if(label.find('input').attr('type')!='checkbox')
											{
											icon_container.hide();
											var default_selected = selected_icon_container.find('.icon-holder').detach();
											
											selected.addClass('default-selected-icon');
										
											default_selected.removeClass('default-selected-icon');
											
											default_selected.removeClass('icon-checked');
												
										
											label.removeClass('icon-dropdown-opened');
										
											default_selected.find('.off-label').show();
											default_selected.find('.on-label').hide();
											default_selected.find('.off-icon').show();
											default_selected.find('.on-icon').hide();
										
											if(default_selected.hasClass('is_default_selection'))
												icon_container.prepend(default_selected);
											else
												icon_container.find('.icon_place_holder_'+ default_selected.attr('data-icon-number')).prepend(default_selected);
											}
										else
											{
											if(form_field.hasClass('multi-icon-select'))
												{
												if(icon_container.find('.icon-holder').length>0)
													icon_container.show();
												else
													icon_container.hide();
												}
											
											
											selected_icon_container.find('.default-selected-icon').hide();
											selected_icon_container.find('.default-selected-icon input').prop('checked',false);
											selected_icon_container.find('.default-selected-icon input').trigger('change')
											selected.addClass('multi-dropdown-icon-checked');	
											}
										selected_icon_container.append(selected);
												
										if(form_field.hasClass('appendix_field') && !form_field.hasClass('material_field'))
											{
											var label_width = 0;
											var icon_width = 0;
											if(!input_container.hasClass('icon-label-tip') && !input_container.hasClass('icon-label-hidden'))
												{
												label_width = selected_icon_container.find('.icon-checked .icon-label').outerWidth();
												}
											
											label_width = selected_icon_container.find('.icon-checked .icon-label').outerWidth();
											icon_width = selected_icon_container.find('.icon-checked .icon-select').outerWidth();
											
											input_container.css('width',(55+(parseInt(label_width)+parseInt(icon_width)))+'px')
											}	
										}
									}
								},110);
								
						
						
						
								
								
						}
						
						var checkmin  = (jQuery(this).closest("#field_container").attr('data-min-selection')) ? parseInt(jQuery(this).closest("#field_container").attr('data-min-selection')) : 0;
						var checkmax  = (jQuery(this).closest("#field_container").attr('data-max-selection')) ? parseInt(jQuery(this).closest("#field_container").attr('data-max-selection')) : 0;
					
						
						//console.log(checkmax)
						if(checkmax)
							{
							setTimeout(
								function()
									{
									//console.log(form_field_container.find('input:checked').length)
										
										
									if(form_field_container.find('input:checked').length>=checkmax)
										{
										
										form_field_container.find('input:not(:checked)').prop('disabled',true);
										form_field_container.find('input:not(:checked)').closest('.icon-holder').addClass('icon_disabled');	
										}
									else
										{
										form_field_container.find('input').prop('disabled',false);
										form_field_container.find('input').closest('.icon-holder').removeClass('icon_disabled');
										}
									},250);
						}
						
					}
				);
	
	
	setTimeout(
		function()
			{
			nf_timer_rebuild('admin',jQuery('.nf-timer'), false,'');
			},500
		);
	
	
	
	
	
	
	cm_settings_1.codeEditor.codemirror.mode = 'text/javascript';
		
	js_editor_before = wp.codeEditor.initialize(jQuery('#before_submit_js'), cm_settings_1.cm_settings);
	js_editor_after = wp.codeEditor.initialize(jQuery('#after_submit_js'), cm_settings_2.cm_settings);
 	css_editor = wp.codeEditor.initialize(jQuery('#custom_css'), cm_settings_3.cm_settings);
	
	
	js_editor_before.codemirror.refresh();
	js_editor_after.codemirror.refresh();
	css_editor.codemirror.refresh();
	
	
	
	jQuery(document).on('click','#custom-css-settings a',
		function(e)
			{
			setTimeout(function() { 
			css_editor.codemirror.refresh() ;
			},50);
			}
		);
	jQuery(document).on('click','.form_options',
		function(e)
			{
			setTimeout(function() { 
			js_editor_before.codemirror.refresh() ;
			js_editor_after.codemirror.refresh();
			},50);
			}
		);
	
	
	
		
	jQuery('.new_item').removeClass('new_item');
	
		
	jQuery(document).on('click','.html_fields:not(.math_logic) .the_input_element',
		function(e)
			{
			var isCtrlPressed = e.ctrlKey;
			if(!isCtrlPressed)
				{
				if(!jQuery(this).find('#editing_text').attr('id'))
					{
					var get_html = jQuery(this).html();
					var get_height = (jQuery(this).outerHeight()+30);
					var get_font_size = jQuery(this).css('font-size');
					var get_style = jQuery(this).attr('style');
					
					var set_html = get_html.replace(/<br>/gm, "\r\n");
					
					jQuery(this).html('');
					jQuery(this).append( '<textarea class="editing_text" id="editing_text"></textarea>');
					
					var edit_area = jQuery(this).find('#editing_text');
					
					
					
					edit_area.attr('style',get_style);
					edit_area.css('font-size',get_font_size);
					edit_area.css('height',get_height+'px');
					
					edit_area.val(set_html);
					edit_area.focus();
					}
				}
			
			}
		);
	
	jQuery(document).on('blur','#editing_text',
		function()
			{
			if(!jQuery(this).hasClass('context_open'))
				{
				var get_html = jQuery(this).val();
				var set_html = get_html.replace(/(\r\n|\n|\r)/gm, "<br>");
					
				jQuery(this).parent().html(set_html)
				

				}
			}
		);
	
	jQuery('body').on('click',':not(.nf_context_menu)',
				function()
					{
					jQuery('.nf_context_menu').removeClass('zoomIn');
					jQuery('.nf_context_menu').addClass('zoomOut');
					if(jQuery('#editing_text').length>0)
						{
						jQuery('.right_click_id').text('');
						jQuery('#editing_text').removeClass('context_open');
						jQuery('#editing_text').focus();
						}
					setTimeout(function() {
						jQuery('.nf_context_menu').removeClass('zoomOut');
						jQuery('.nf_context_menu').removeClass('sim_edit');
						jQuery('.nf_context_menu').hide();
					},400);
					}
				);
		
    var set_context_menu = jQuery('.nf_context_menu_1').detach();
	jQuery('#wpwrap').append(set_context_menu);


			jQuery(document).on('contextmenu' + set_dev,'#set_html, #editing_text, .extra_form_attr input[type="text"], input[name="set_min_date"], input[name="set_max_date"]',
			function(e)
				{
				
				if(!dev)
					e.preventDefault();
					
				set_context_id = jQuery(this).attr('id');
				jQuery('#'+set_context_id).addClass('context_open');
				jQuery('#'+set_context_id).trigger('keyup');
				jQuery('#'+set_context_id).trigger('focus');
				var set_context_menu = ''; 
				jQuery('div.nex-forms-container div.form_field input[type="text"]').each(
					function()
						{
						if(jQuery(this).attr('name')!='multi_step_name' && jQuery(this).attr('name')!='multi_step_icon' && jQuery(this).attr('name')!='multi_step_description' && jQuery(this).attr('name')!='multi_step_time_limit' && jQuery(this).attr('name')!='undefined')
							set_context_menu += '<li class="tab" data-tag="{{'+ format_illegal_chars(jQuery(this).attr('name'))  +'}}"><a href="#">'+ unformat_name(jQuery(this).attr('name')) +'</a></option>';
						}
					);	
				var old_radio = '';
				var new_radio = '';
				
				jQuery('div.nex-forms-container div.form_field input[type="radio"]').each(
					function()
						{
						old_radio = jQuery(this).attr('name');
						if(old_radio != new_radio)
							set_context_menu += '<li class="tab" data-tag="{{'+ format_illegal_chars(jQuery(this).attr('name'))  +'}}"><a href="#">'+ unformat_name(jQuery(this).attr('name')) +'</a></option>';
						
						new_radio = old_radio;
						
						}
					);	
				var old_check = '';
				var new_check = '';
				jQuery('div.nex-forms-container div.form_field input[type="checkbox"]').each(
					function()
						{
						old_check = jQuery(this).attr('name');
						if(old_check != new_check)
							set_context_menu += '<li class="tab" data-tag="{{'+ jQuery(this).attr('name')  +'}}"><a href="#">'+ unformat_name(jQuery(this).attr('name')) +'</a></option>';
						new_check = old_check;
						}
					);	
				jQuery('div.nex-forms-container div.form_field select').each(
					function()
						{
						set_context_menu += '<li class="tab" data-tag="{{'+ jQuery(this).attr('name')  +'}}"><a href="#">'+ unformat_name(jQuery(this).attr('name')) +'</a></option>';
						}
					);	
				jQuery('div.nex-forms-container div.form_field textarea').each(
					function()
						{
						if(!jQuery(this).hasClass('editing_text'))
							set_context_menu += '<li class="tab" data-tag="{{'+ format_illegal_chars(jQuery(this).attr('name'))  +'}}"><a href="#">'+ unformat_name(jQuery(this).attr('name')) +'</a></option>';
						}
					);	
				
				jQuery('.nf_context_menu').hide();
				jQuery('.nf_context_menu_1 ul').html(set_context_menu);
				jQuery('.nf_context_menu_1').css('top', e.pageY+'px');
				jQuery('.nf_context_menu_1').css('left', (e.pageX-250)+'px');
				jQuery('.nf_context_menu_1').show();
				jQuery('.nf_context_menu_1').addClass('animated_extra_fast');
				jQuery('.nf_context_menu_1').addClass('zoomIn');

				}
			);
		
		
		
		jQuery(document).on('click','.nf_context_menu_1 ul li',
		function()
			{	
			insertAtCaret(set_context_id, jQuery(this).attr('data-tag'));	
			jQuery('#'+set_context_id).trigger('focus');
			jQuery('#'+set_context_id).trigger('change');
			jQuery('#'+set_context_id).trigger('keyup');
			
			}
		);
		
		
		
		
	var set_context_menu_2 = jQuery('.nf_context_menu_2').detach();
	jQuery('#wpwrap').append(set_context_menu_2);


		jQuery(document).on('contextmenu'+ set_dev,'.inner-canvas-container .form_field.batch_edit',
			function(e)
				{
				if(!dev)
					e.preventDefault();
					
				jQuery('.nf_context_menu_2').removeClass('sim_edit');
			
				if(jQuery(e.target).closest('.form_field').hasClass('batch_edit_sim') || jQuery(e.target).hasClass('batch_edit_sim'))
					{
					jQuery('.nf_context_menu_2').addClass('sim_edit');
					}
					
				
				
				set_context_id = jQuery(this).attr('id');
				jQuery('.nf_context_menu').hide();
				jQuery('.nf_context_menu_2').css('top', e.pageY+'px');
				jQuery('.nf_context_menu_2').css('left', (e.pageX-250)+'px');
				jQuery('.nf_context_menu_2').show();
				jQuery('.nf_context_menu_2').addClass('animated_extra_fast');
				jQuery('.nf_context_menu_2').addClass('zoomIn');
				}
			);
		
		
		jQuery(document).on('click','.nf_context_menu_2 ul li',
		function()
			{
			var action = jQuery(this).attr('data-action');
			var sec_action = jQuery(this).attr('data-sec-action');
			if(action=='style')
				{
				if(jQuery('.nf_context_menu_2').hasClass('sim_edit'))
					{
					jQuery('.inner-canvas-container .batch_edit_sim').first().find('.edit').trigger('click');	
					}
				else
					{
					jQuery('.form-canvas-area').attr('data-pre-class','.batch_edit');
					jQuery('.overall-styling-btn').trigger('click');
					jQuery('#overall-fields-styling a').trigger('click');
					}
				}
			if(action=='copy')
				nf_copy('batch_edit');
			if(action=='cut')
				nf_cut('batch_edit');
			if(action=='delete')
				jQuery('.inner-canvas-container .batch_edit').remove();
			
			if(action=='required')
				{
				jQuery('.inner-canvas-container .batch_edit').each(
					function()
						{
						
						var current_field = jQuery(this);
						
						if(!current_field.hasClass('grid') && !current_field.hasClass('html_fields') && !current_field.hasClass('button_fields'))
							{
							var get_input = jQuery(this).find('.the_input_element');
							var get_obj = jQuery(this).find('label');
							var label_container = current_field.find('.label_container');
							current_field.removeClass('required')
							
							get_input.removeClass('required');
								
							if(current_field.hasClass('select') || current_field.hasClass('multi-select'))
								current_field.find('select').attr('data-required','false').removeClass('required');
							
							var label_val = label_container.find('.the_label').html();
							if(label_val)
								{
								label_val = label_val.replace('* ','');
								label_val = label_val.replace('*','');
								}
								
							
							if(sec_action=='required')
								{
								current_field.addClass('required')
								get_input.addClass('required');
								if(current_field.hasClass('select') || current_field.hasClass('multi-select'))
									current_field.find('select').attr('data-required','true').addClass('required');
									
								label_container.find('.the_label').html('*'+label_val)
								}
							else
								{
								label_container.find('.the_label').html(label_val)
								}
							
							}
							
						}
					);

				
				}
			
			}
		);
		
		
		
		var set_context_menu_3 = jQuery('.nf_context_menu_3').detach();
		jQuery('#wpwrap').append(set_context_menu_3);


		jQuery(document).on('contextmenu'+ set_dev,'.inner-canvas-container .form_field:not(.batch_edit)',
			function(e)
				{
				if(!dev)
					e.preventDefault();
				jQuery('.field-target').removeClass('field-target');
				jQuery('.col-target').removeClass('col-target');
				jQuery('.step-target').removeClass('step-target');
			//	console.log(jQuery(e.target).attr('class'));
				
				
				
				jQuery('.nf_context_menu_3 li.paste-action').addClass('disabled');
				jQuery('.nf_context_menu_3 li.paste-action-inside').addClass('disabled');
				
				
				jQuery('.nf_context_menu_3 li.field-action').addClass('disabled');
				jQuery('.nf_context_menu_3 li.required-action').addClass('disabled');
				jQuery('.nf_context_menu_3 li.duplicate-action').addClass('disabled');
				
				if(jQuery(e.target).attr('id')!='editing_text' && !jQuery(e.target).closest('.form_field').hasClass('batch_edit'))
					{
					
					
						
						if(jQuery(e.target).hasClass('tab-pane'))
							{
							jQuery(e.target).closest('.step').find('.panel-body').first().addClass('step-target');
							}
						else if(jQuery(e.target).hasClass('panel-body') || jQuery(e.target).hasClass('column_tools') || jQuery(e.target).hasClass('panel'))
							{
							if(jQuery(e.target).closest('.form_field').hasClass('is_panel'))
								jQuery(e.target).closest('.form_field').find('.panel-body').addClass('col-target');
							else if(jQuery('.over-column-tools').length>0)
								jQuery('.over-column-tools').find('.panel-body').addClass('col-target');
							else
								{
								jQuery(e.target).closest('.step').find('.panel-body').first().addClass('step-target');
								//jQuery('.nf_context_menu_3 li.duplicate-action').removeClass('disabled');
								}
							}
						else
							{
							jQuery('.nf_context_menu_3 li.field-action').removeClass('disabled');
							jQuery('.nf_context_menu_3 li.duplicate-action').removeClass('disabled');
							if(!jQuery(e.target).closest('.form_field').hasClass('grid') && !jQuery(e.target).closest('.form_field').hasClass('html_fields') && !jQuery(e.target).closest('.form_field').hasClass('button_fields'))
								jQuery('.nf_context_menu_3 li.required-action').removeClass('disabled');	
							}
						jQuery(e.target).closest('.form_field').addClass('field-target');
						
						
						
						if(batch_selection_array.length>0)
							{
							jQuery('.nf_context_menu_3 li.paste-action').removeClass('disabled');	
							
							if(jQuery('.col-target').length>0 || jQuery('.step-target').length>0)
								jQuery('.nf_context_menu_3 li.paste-action-inside').removeClass('disabled');	
							}
						
							
							jQuery('.nf_context_menu').hide();
							jQuery('.nf_context_menu_3').css('top', e.pageY+'px');
							jQuery('.nf_context_menu_3').css('left', (e.pageX-250)+'px');
							jQuery('.nf_context_menu_3').show();
							jQuery('.nf_context_menu_3').addClass('animated_extra_fast');
							jQuery('.nf_context_menu_3').addClass('zoomIn');
					}
				}
			);
		
		
		
		jQuery(document).on('click','.nf_context_menu_3 ul li:not(.disabled)',
		function()
			{
			var action = jQuery(this).attr('data-action');
			var sec_action = jQuery(this).attr('data-sec-action');
			
			if(action=='paste-above')
				nf_paste('top','field-target','outside')
			if(action=='paste-below')
				nf_paste('bottom','field-target','outside')
			
			if(action=='paste-inside-top')
				{
				if(jQuery('.col-target').length>0)
					nf_paste('top','col-target','inside')
				else if(jQuery('.step-target').length>0)
					nf_paste('top','step-target','inside')
				else
					nf_paste('top','.inner-canvas-container','inside')
				}
			if(action=='paste-inside-bottom')
				{
				if(jQuery('.col-target').length>0)
					nf_paste('bottom','col-target','inside')
				if(jQuery('.step-target').length>0)
					nf_paste('bottom','step-target','inside')
				else
					nf_paste('bottom','.inner-canvas-container','inside')
				}
			
			
			if(action=='edit')
				jQuery('.field-target').find('.edit').trigger('click');
			if(action=='duplicate')
				{
				if(jQuery('.step-target').length>0)
					jQuery('.step-target').closest('.step').find('.step-controls .duplicate_field').trigger('click');
				else
					jQuery('.field-target').find('.duplicate_field').trigger('click');
				}
			if(action=='copy')
				nf_copy('field-target');
			if(action=='cut')
				nf_cut('field-target');
			if(action=='delete')
				{
				if(jQuery('.step-target').length>0)
					jQuery('.step-target').closest('.step').find('.step-controls .delete').trigger('click');
				else if(jQuery('.col-target').length>0)
					jQuery('.col-target').closest('.grid_input_holder').find('.delete-column').trigger('click');
				else
					jQuery('.inner-canvas-container .field-target').remove();
				}
			
			if(action=='required')
				{
				var current_field = jQuery('.field-target');
				
				if(!current_field.hasClass('grid') && !current_field.hasClass('html_fields') && !current_field.hasClass('button_fields'))
					{
					var get_input = jQuery(this).find('.the_input_element');
					var get_obj = jQuery(this).find('label');
					var label_container = current_field.find('.label_container');
					current_field.removeClass('required')
					
					get_input.removeClass('required');
						
					if(current_field.hasClass('select') || current_field.hasClass('multi-select'))
						current_field.find('select').attr('data-required','false').removeClass('required');
					
					var label_val = label_container.find('.the_label').html();
					if(label_val)
						{
						label_val = label_val.replace('* ','');
						label_val = label_val.replace('*','');
						}
						
					
					if(sec_action=='required')
						{
						current_field.addClass('required')
						get_input.addClass('required');
						if(current_field.hasClass('select') || current_field.hasClass('multi-select'))
							current_field.find('select').attr('data-required','true').addClass('required');
							
						label_container.find('.the_label').html('*'+label_val)
						}
					else
						{
						label_container.find('.the_label').html(label_val)
						}
					
					}
					
				}
				
			
			jQuery('.field-target').removeClass('field-target');	
			jQuery('.col-target').removeClass('col-target');
			jQuery('.step-target').removeClass('step-target');
			}
		);




		var set_context_menu_4 = jQuery('.nf_context_menu_4').detach();
		jQuery('#wpwrap').append(set_context_menu_4);


		jQuery(document).on('contextmenu'+ set_dev,'.inner-canvas-container',
			function(e)
				{
				//console.log(jQuery(e.target).attr('class'));
				
				jQuery('.nf_context_menu_4 li.paste-action-inside').addClass('disabled');
				jQuery('.nf_context_menu_4 li.undo-action').addClass('disabled');
				jQuery('.nf_context_menu_4 li.redo-action').addClass('disabled');
				
				
				if(batch_selection_array.length>0)
					jQuery('.nf_context_menu_4 li.paste-action-inside').removeClass('disabled');	
				
				
				if(jQuery('.history_action.do_undo').hasClass('avialable'))
					jQuery('.nf_context_menu_4 li.undo-action').removeClass('disabled');
					
				if(jQuery('.history_action.do_redo').hasClass('avialable'))
					jQuery('.nf_context_menu_4 li.redo-action').removeClass('disabled');
				
				if(jQuery(e.target).hasClass('inner-canvas-container'))
					{
					if(!dev)
						e.preventDefault();
					jQuery('.nf_context_menu').hide();
					jQuery('.nf_context_menu_4').css('top', e.pageY+'px');
					jQuery('.nf_context_menu_4').css('left', (e.pageX-250)+'px');
					jQuery('.nf_context_menu_4').show();
					jQuery('.nf_context_menu_4').addClass('animated_extra_fast');
					jQuery('.nf_context_menu_4').addClass('zoomIn');
					}
				}
			);
		
		
		jQuery(document).on('click','.nf_context_menu_4 ul li:not(.disabled)',
		function()
			{
			var action = jQuery(this).attr('data-action');
			var sec_action = jQuery(this).attr('data-sec-action');
			if(action=='edit')
				{
				jQuery('.overall-styling-btn').trigger('click');
				jQuery('#form-settings a').trigger('click');
				}
			if(action=='select-all')
				jQuery('.inner-canvas-container .form_field:not(.step)').addClass('batch_edit');
			if(action=='deselect-all')
				{
				jQuery('.batch_edit').removeClass('batch_edit_sim');
				jQuery('.batch_edit').removeClass('batch_edit');
				}
			
			if(action=='paste-inside-top')
				{
				nf_paste('top',0,'outside')
				}
			if(action=='paste-inside-bottom')
				{
				nf_paste('bottom',0,'outside')
				}
			if(action=='undo')
				nf_run_history('undo');
			if(action=='redo')
				nf_run_history('redo');

				
				
			
			}
		);
			

	
	
	
		jQuery('.nex-forms-container .form_field.step').each(
		function(index, element)
			{
			jQuery(this).attr('data-settings','.s-step');
			
			var container = jQuery(this).find('.zero-clipboard');
			
			
			
			
			//if(!container.hasClass('step_2piont0'))
				//{
				//console.log('running');
				
				var step_title 			= (jQuery(this).attr('data-step-name')) ? jQuery(this).attr('data-step-name') : '';
				var step_description 	= (jQuery(this).attr('data-step-description')) ? jQuery(this).attr('data-step-description') : '';
				var step_icon 			= (jQuery(this).attr('data-step-icon')) ? jQuery(this).attr('data-step-icon') : '';
				var step_number 		= (jQuery(this).attr('data-step-num')) ? jQuery(this).attr('data-step-num') : '';
				var step_number_alias 	= (jQuery(this).attr('data-step-num-alias')) ? jQuery(this).attr('data-step-num-alias') : '';
				
				var step_time_limit 	= (jQuery(this).attr('data-step-time-limit')) ? jQuery(this).attr('data-step-time-limit') : '';
				
				step_title = (step_title=='&nbsp;' || step_title=='&nbsp; ' || step_title=='  ' || step_title=='  ') ? '' : step_title;
				
				var step_2piont0 = '';
				
				step_2piont0 += '<div class="ms-step-number-wrapper"><div class="ms-step-number">'+ step_number +'</div></div>';
				step_2piont0 += '<div class="ms-step-expand-wrapper"><div class="ms-step-expand"><span class="fas fa-chevron-down"></span></div></div>';
				
				step_2piont0 += '<div class="row step-settings">';
					step_2piont0 += '<div class="col-xs-10">';
					
						step_2piont0 += '<div class="row">';
							
							step_2piont0 += '<div class="col-xs-3">';
								step_2piont0 += '<small>Icon</small>';
								
								step_2piont0 += '<div class="input-group input-group-sm">';
								
									step_2piont0 += '<div class="input-group-addon action-btn set_step_icon"><i class="'+ step_icon +'"></i></div>';
									step_2piont0 += '<input name="multi_step_icon" type="text" class="form-control" placeholder="Icon class" value="'+ step_icon +'">';
									
									
								step_2piont0 += '</div>';
							step_2piont0 += '</div>';
							
							step_2piont0 += '<div class="col-xs-4">';
								step_2piont0 += '<small>Title</small>'
								step_2piont0 += '<input name="multi_step_name" type="text" class="form-control" placeholder="Step '+  (index+1) +' title" value="'+ step_title +'">';
							step_2piont0 += '</div>';
							
							step_2piont0 += '<div class="col-xs-5">';
								step_2piont0 += '<div class="step-description-container">';
									step_2piont0 += '<div class="description">';
										step_2piont0 += '<small>Description</small>';
										step_2piont0 += '<input name="multi_step_description" type="text" class="form-control" placeholder="Step '+  (index+1) +' description" value="'+ step_description +'">';
									step_2piont0 += '</div>';
									
									step_2piont0 += '<div class="set_time_limit">'
										step_2piont0 += '<small>Time Limit</small>'
										step_2piont0 += '<input name="multi_step_time_limit" type="text" class="form-control" placeholder="Seconds" value="'+ step_time_limit +'">';
									step_2piont0 += '</div>';
								
								step_2piont0 += '</div>';
							step_2piont0 += '</div>';
							
							
							
							
						step_2piont0 += '</div>';
						
					step_2piont0 += '</div>';
					
					step_2piont0 += '<div class="col-xs-2 step-controls">';
						
						step_2piont0 += '<div title="Delete Step" class="btn delete"><i class="fa fa-close"></i></div>';
						step_2piont0 += '<div title="Duplicate Step" class="btn duplicate_field"><i class="fa fa-files-o"></i></div>';
						step_2piont0 += '<div title="Edit Step" class="btn edit"><i class="fa fa-edit"></i></div>';
						
						
					step_2piont0 += '</div>';
					
					
				step_2piont0 += '</div>';
			
			
				
				container.html(step_2piont0);
				container.addClass('step_2piont0')
				//}
			});



		jQuery(document).on('click','.ms-step-expand',
		function()
			{
			if(jQuery(this).hasClass('exanded'))
				{
				jQuery(this).removeClass('exanded');
				jQuery(this).closest('.step').removeClass('is_expanded');
				}
			else
				{	
				jQuery(this).addClass('exanded');
				jQuery(this).closest('.step').addClass('is_expanded');
				}
			}
		);

	
	
	
	
	
	jQuery('.nf_title br').remove();
	
	jQuery(document).on('click','.close-preview',
		function()
			{
			jQuery('.form-canvas-area').removeClass('preview_view');
			jQuery('.form-canvas-area').removeClass('split_view');
			jQuery('.preview-tools .btn.workspace').removeClass('active');
			jQuery('.preview-tools .btn.workspace.normal').addClass('active');
			}
		);
	
	jQuery(document).on('click','.preview-tools .btn.workspace_theme',
		function()
			{
			jQuery('.preview-tools .btn.workspace_theme').removeClass('active');	
			jQuery(this).addClass('active');
			jQuery('.form-canvas-area').removeClass('dark');
			if(jQuery(this).attr('data-view')=='dark')
				jQuery('.form-canvas-area').addClass('dark');
			}
		);
	
	jQuery(document).on('click','.preview-tools .btn.workspace',
		function()
			{
			jQuery('.preview-tools .btn.workspace').removeClass('active');
			jQuery(this).addClass('active');	
			//jQuery('.conditional_logic_wrapper #close-settings').trigger('click');
			jQuery('.field-settings-column.open_sidenav  #close-settings').trigger('click');
			jQuery('.overall-settings-column #close-settings').trigger('click');
			
			jQuery('.conditional-logic-btn').removeClass('active');
			jQuery('.conditional_logic_wrapper').removeClass('opened');
			jQuery('.form_canvas').removeClass('conditional-logic-opened');
			jQuery('.nex_forms_admin_page_wrapper').removeClass('conditional-logic-ui');
			jQuery('.c_logic_field_type').remove();
			
			jQuery('.inner-canvas-container').removeClass('active');
			jQuery('.form-canvas-area').removeClass('form-editor-view');
			jQuery('.form-canvas-area').removeClass('msg-editor-view');
			
			if(jQuery(this).hasClass('c-logic'))
				{
				jQuery('.conditional-logic-btn').trigger('click');
				}
			
			else if(jQuery(this).hasClass('preview'))
				{
				
				if(!jQuery('.form-canvas-area').hasClass('preview_view') && !jQuery('.form-canvas-area').hasClass('split_view'))
					nf_save_nex_form('','preview', '');
				
				jQuery('.form-canvas-area').removeClass('preview_view');
				jQuery('.form-canvas-area').removeClass('split_view');
				jQuery('.form-canvas-area').addClass('preview_view');
				}
			else if(jQuery(this).hasClass('split'))
				{
				
				if(!jQuery('.form-canvas-area').hasClass('preview_view') && !jQuery('.form-canvas-area').hasClass('split_view'))
					nf_save_nex_form('','preview', '');
				
				jQuery('.inner-form-canvas .inner-canvas-container').addClass('active');
				jQuery('.inner-msg-canvas').hide();
				jQuery('.inner-form-canvas').show();
				
				jQuery('span.editor-form').show();
				jQuery('span.editor-msg').hide();
				
				
				
				jQuery('.form-canvas-area').removeClass('preview_view');
				jQuery('.form-canvas-area').removeClass('split_view');	
				jQuery('.form-canvas-area').addClass('split_view');
				
				
				
				get_overall_form_settings(jQuery('.nex-forms-container'))
				}
			else if(jQuery(this).hasClass('success-msg'))
				{
				jQuery('.form-canvas-area').addClass('msg-editor-view');
				jQuery('.inner-msg-canvas').show();
				jQuery('.inner-form-canvas').hide();
				
				jQuery('span.editor-form').hide();
				jQuery('span.editor-msg').show();
				
				
				
				jQuery('.nex-forms-msg-container').addClass('active');

				jQuery('.form-canvas-area').attr('data-sec-pre-class','.inner-msg-canvas')
				jQuery('.form-canvas-area').removeClass('preview_view');
				jQuery('.form-canvas-area').removeClass('split_view');
				
				
				get_overall_form_settings(jQuery('.nex-forms-msg-container'))
				
				}
			else
				{
				
				jQuery('li.all_steps.current a').trigger('click');
				
				jQuery('.form-canvas-area').addClass('form-editor-view');
				jQuery('.inner-msg-canvas').hide();
				jQuery('.inner-form-canvas').show();
				
				jQuery('span.editor-form').show();
				jQuery('span.editor-msg').hide();
				
				
				
				
				jQuery('.nex-forms-container').addClass('active');
				
				jQuery('.form-canvas-area').attr('data-sec-pre-class','.inner-form-canvas')
				jQuery('.form-canvas-area').removeClass('preview_view');
				jQuery('.form-canvas-area').removeClass('split_view');
				
				
				get_overall_form_settings(jQuery('.nex-forms-container'))
				
				}
			
			
			jQuery('.form_canvas').trigger('focus');
			}
		);		
		
	
	jQuery('[data-toggle="tooltip_bs"]:not(.group-addon-label)').tooltip_bs(
			{
			delay: 0,
			html:true
			}
		);
	jQuery('[data-toggle="tooltip_bs2"]').tooltip_bs(
			{
			delay: { "show": 500, "hide": 0 },
			html:true
			}
		);
	jQuery('.field-setting .btn').each(
		function()
			{
			jQuery(this).find('i').attr('title', jQuery(this).attr('title'))
			}
		);
	jQuery('.field-setting .btn i').tooltip_bs(
			{
			delay: { "show": 200, "hide": 0 },
			placement: 'top',
			html:true
			}
		);
	
	jQuery(document).on('change', '#google_analytics_conversion_code', function(){
			
			var set_val = jQuery(this).val();
			
			set_val = set_val.replace('"','\'');
			
			jQuery('#google_analytics_conversion_code').val(set_val);
			
			jQuery('.nex-submit').attr('onclick',set_val);
			
		}
	);
	
	jQuery(document).on('click', '.prime-menu .tabs_nf a', function(){
		
		jQuery('.prime-menu .tabs_nf .tab').removeClass('current');
		jQuery(this).parent().addClass('current');
		

	});
	
	jQuery(document).on('click', '.tabs_nf a', function(){

		
		if(jQuery('#demo_site').text()=='yes')
			{
			jQuery('#admin_email_body_content_ifr').contents().find('body p').css('font-family', 'Arial').css('font-size', '13px');
			jQuery('#user_email_body_content_ifr').contents().find('body p').css('font-family', 'Arial').css('font-size', '13px');
			jQuery('#on_screen_message_ifr').contents().find('body p').css('font-family', 'Arial').css('font-size', '13px');
			jQuery('#pdf_html_ifr').contents().find('body p').css('font-family', 'Arial').css('font-size', '13px');
			jQuery('#ftp_content_ifr').contents().find('body p').css('font-family', 'Arial').css('font-size', '13px');
			}
	});
	
	jQuery(document).on('click', '.form_attr_left_menu a', function(){
		jQuery(this).parent().parent().find('li').removeClass('active');
		jQuery(this).parent().addClass('active');
		}
	);
//EMAIL SETUP MENU CLICK	
	jQuery(document).on('click', '.show-admin-email-setup', function(){
		jQuery('.tri-menu .admin_email_tab a').trigger('click');
	});
	jQuery(document).on('click', '.show-user-email-setup', function(){
		jQuery('.tri-menu .user_email_tab a').trigger('click');
	});

//INTEGRATION SETUP MENU CLICK	
	jQuery(document).on('click', '.show_zapier_setup', function(){
		jQuery('.tri-menu .show_zapier_setup_menu_item a').trigger('click');
	});
	jQuery(document).on('click', '.show_paypal_setup', function(){
		set_paypal_fields();
		jQuery('.tri-menu .show_paypal_setup_menu_item a').trigger('click');
	});
	jQuery(document).on('click', '.show_pdf_setup', function(){
		jQuery('.tri-menu .show_pdf_setup_menu_item a').trigger('click');
	});
	jQuery(document).on('click', '.show_ftp_setup', function(){
		set_ftp_field_map();
		jQuery('.tri-menu .show_ftp_setup_menu_item a').trigger('click');
	});
	jQuery(document).on('click', '.show_mc_setup', function(){
		set_mc_field_map();
		jQuery('.tri-menu .show_mc_setup_menu_item a').trigger('click');
	});
	jQuery(document).on('click', '.show_gr_setup', function(){
		set_gr_field_map();
		jQuery('.tri-menu .show_gr_setup_menu_item a').trigger('click');
	});
	jQuery(document).on('click', '.show_mp_setup', function(){
		set_mp_field_map();
		jQuery('.tri-menu .show_mp_setup_menu_item a').trigger('click');
	});
	
	jQuery(document).on('click', '.show_ms_setup', function(){
		set_ms_field_map();
		jQuery('.tri-menu .show_ms_setup_menu_item a').trigger('click');
	});


//EMBED SETUP MENU CLICK	
	jQuery(document).on('click', '.show_inline_embed', function(){
		set_paypal_fields();
		jQuery('.tri-menu .show_inline_embed_menu_item a').trigger('click');
	});
	jQuery(document).on('click', '.show_popup_embed', function(){
		jQuery('.tri-menu .show_popup_embed_menu_item a').trigger('click');
	});
	jQuery(document).on('click', '.show_sticky_embed', function(){
		set_ftp_field_map();
		jQuery('.tri-menu .show_sticky_embed_menu_item a').trigger('click');
	});
	
	jQuery(document).on('click', '.form_embed_tri_menu a', function(){
		
		jQuery(this).closest('.form_embed_tri_menu').find('li').removeClass('active');
		jQuery(this).parent().addClass('active');
		
		jQuery(this).closest('.embed').find('.form_embed_shortcode_display').hide();
		jQuery(this).closest('.embed').find('.form_embed_shortcode_display.'+jQuery(this).attr('data-shortcode')).show();
		
	});
	
	jQuery(document).on('click', '.shortcode_php .btn', function(){
		jQuery('.shortcode_php .btn').removeClass('active');
		jQuery(this).addClass('active');
		if(jQuery(this).hasClass('show_php'))
			{
			jQuery('.form_embed_settings_wrapper .shortcode').hide();
			jQuery('.form_embed_settings_wrapper .php').show();
			}
		if(jQuery(this).hasClass('show_shortcode'))
			{
			jQuery('.form_embed_settings_wrapper .shortcode').show();
			jQuery('.form_embed_settings_wrapper .php').hide();
			}
	});
	

 var get_target = jQuery('.modal-container');
	
	
	
	jQuery(document).on('click', '.embed_tools.set_form_type .btn', function(){
		jQuery('.embed_tools.set_form_type .btn').removeClass('active');
		jQuery(this).addClass('active');
		
		if(jQuery(this).hasClass('popup')){
			jQuery('.form_embed_types a.popup').trigger('click');
			
			jQuery('.embed-settings-column').addClass('open_sidenav');
			
		}
		if(jQuery(this).hasClass('inline')){
			jQuery('.form_embed_types a.inline').trigger('click');
			jQuery('.embed-settings-column').removeClass('open_sidenav');
		}
		if(jQuery(this).hasClass('sticky')){
			jQuery('.embed-settings-column').removeClass('open_sidenav');
			jQuery('.popup-previews').addClass('hidden');
			jQuery('.button-preview').addClass('hidden');
		}
		
	}
	);
	
	
	jQuery(document).on('click', '.embed_options', function(){
		generate_shortcode();
	});
	
	jQuery(document).on('click', '.form_embed_types a', function(){
		generate_shortcode();
		jQuery('.popup-previews').addClass('hidden');
		jQuery('.button-preview').addClass('hidden');
		if(jQuery(this).hasClass('popup'))
			{
			jQuery('.popup-previews').removeClass('hidden');
			if(jQuery('.embed-poppup-trigger .btn.active').hasClass('button'))
				jQuery('.button-preview').removeClass('hidden');
			
			
			var get_form_bg = jQuery('.nex-forms-container').css('background-color');
			var get_form_bg_image = jQuery('.nex-forms-container').css('background-image');
			
			var res = get_form_bg.substring(get_form_bg.length - 4, get_form_bg.length);
			
			if(res == ', 0)' && (!get_form_bg_image || get_form_bg_image=='none'))
				{
				jQuery('.set_popup_bg.use_custom').trigger('click');
				}
			else
				{
				jQuery('.set_popup_bg.use_form').trigger('click');
				}
			
			}
	});
	
	jQuery(document).on('click', '.embed-form-style .btn', function(){
		jQuery('.embed-form-style .btn').removeClass('active');
		
		if(jQuery(this).hasClass('normal'))
			jQuery('.embed-form-style .btn.normal').addClass('active');
		if(jQuery(this).hasClass('conversational'))
			jQuery('.embed-form-style .btn.conversational').addClass('active');
		if(jQuery(this).hasClass('chat'))
			jQuery('.embed-form-style .btn.chat').addClass('active');
		
		generate_shortcode();
		
	});
	jQuery(document).on('click', '.embed-poppup-trigger .btn', function(){
		jQuery('.embed-poppup-trigger .btn').removeClass('active');
		jQuery(this).addClass('active');
		
		jQuery('.embed-button-text').addClass('hidden');
		jQuery('.embed-link-text').addClass('hidden');
		jQuery('.embed-custom-class').addClass('hidden');
		jQuery('.embed-on-timer').addClass('hidden');
		jQuery('.embed-on-scroll').addClass('hidden');
		
		jQuery('.embed-poppup-button-color').addClass('hidden');
		jQuery('.button-preview').addClass('hidden');
		
		if(jQuery(this).hasClass('button'))
			{
			jQuery('.embed-button-text').removeClass('hidden');
			jQuery('.button-preview').removeClass('hidden');
			jQuery('.embed-poppup-button-color').removeClass('hidden');
			
			}
		if(jQuery(this).hasClass('link'))
			{
			jQuery('.embed-link-text').removeClass('hidden');
			
			}
		if(jQuery(this).hasClass('custom'))
			{
			jQuery('.embed-custom-class').removeClass('hidden');
			}
		if(jQuery(this).hasClass('timer'))
			{
			jQuery('.embed-on-timer').removeClass('hidden');
			}
		if(jQuery(this).hasClass('scroll'))
			{
			jQuery('.embed-on-scroll').removeClass('hidden');
			}
		
		
		generate_shortcode();
	});
	
	jQuery(document).on('click', '.embed-poppup-button-color .btn', function(){
		
		jQuery('.embed-poppup-button-color .btn').removeClass('active');
		
		jQuery('.popup-previews .btn').attr('class','btn md-btn '+jQuery(this).attr('data-btn-class'));
		
		jQuery(this).addClass('active');
		
		generate_shortcode();
	});
jQuery(document).on('keyup', '#set_popup_button_text', function(){
		
		jQuery('.popup-previews .btn').html(jQuery(this).val());
	});	

jQuery(document).on('keyup', '#set_popup_button_text, #set_popup_link_text, #set_popup_custom_text', function(){
		
		generate_shortcode();
		
	});

jQuery(document).on('click', '.embed-popup-v-position .btn', function(){
		jQuery('.embed-popup-v-position .btn').removeClass('active');
		jQuery(this).addClass('active');
		
		
		jQuery('.modal-container').removeClass('v_center');
		jQuery('.modal-container').removeClass('v_top');
		jQuery('.modal-container').removeClass('v_bottom');
		
		if(jQuery(this).hasClass('center'))
			{
			jQuery('.modal-container').addClass('v_center');
			}
		if(jQuery(this).hasClass('top'))
			{
			jQuery('.modal-container').addClass('v_top');
			}
		if(jQuery(this).hasClass('bottom'))
			{
			jQuery('.modal-container').addClass('v_bottom');
			}
		
		
		generate_shortcode();
	});


jQuery(document).on('click', '.embed-popup-h-position .btn', function(){
		jQuery('.embed-popup-h-position .btn').removeClass('active');
		jQuery(this).addClass('active');
		
		
		jQuery('.modal-container').removeClass('h_center');
		jQuery('.modal-container').removeClass('h_left');
		jQuery('.modal-container').removeClass('h_right');
		
		if(jQuery(this).hasClass('center'))
			{
			jQuery('.modal-container').addClass('h_center');
			}
		if(jQuery(this).hasClass('left'))
			{
			jQuery('.modal-container').addClass('h_left');
			}
		if(jQuery(this).hasClass('right'))
			{
			jQuery('.modal-container').addClass('h_right');
			}
		
		
		generate_shortcode();
	});

jQuery(document).on('click', '.set_popup_bg', function(){
		jQuery('.set_popup_bg').removeClass('active');
		jQuery(this).addClass('active');
		
		jQuery('input[name="popup-bg-color"]').prop('disabled',true);
		
		if(jQuery(this).hasClass('use_form'))
			{
			jQuery('.popup-previews .modal-container').attr('style',jQuery('.nex-forms-container').attr('style'));
			jQuery('.popup-previews .modal-inner-container').removeAttr('style');
			/*jQuery( "#popup_padding_right" ).val(0);
			jQuery( "#popup_padding_left" ).val(0);
			jQuery( "#popup_padding_top" ).val(0);
			jQuery( "#popup_padding_bottom" ).val(0);*/
			}
		if(jQuery(this).hasClass('use_custom'))
			{
			jQuery('.popup-previews .modal-container').removeAttr('style');
			jQuery('.popup-previews .modal-container').css('background',jQuery('input[name="popup-bg-color"]').val());
		 	jQuery('.popup-previews .modal-inner-container').attr('style',jQuery('.nex-forms-container').attr('style'));
			jQuery('input[name="popup-bg-color"]').prop('disabled',false);
			/*jQuery( "#popup_padding_right" ).val(2);
			jQuery( "#popup_padding_left" ).val(2);
			jQuery( "#popup_padding_top" ).val(2);
			jQuery( "#popup_padding_bottom" ).val(2);*/
			
			}

		generate_shortcode();
	});


jQuery(document).on('click', '.modal-container .close-preview', function(){
	clear_animation(get_target);
	get_target.addClass('animated');
	get_target.addClass(jQuery('#popup_close_animation').val());
	
	setTimeout(function(){ clear_animation(get_target) },1000);
});

jQuery(document).on('click', '.button-preview .btn', function(){
	clear_animation(get_target);
	get_target.addClass('animated');
	get_target.addClass(jQuery('#popup_open_animation').val());
	
	setTimeout(function(){ clear_animation(get_target) },1000);
});
	
	
jQuery(document).on('change', '#popup_open_animation, #popup_close_animation', function(){
	
	clear_animation(get_target)
	get_target.addClass('animated');
	get_target.addClass(jQuery(this).val());
	
	generate_shortcode();
	
	setTimeout(function(){ clear_animation(get_target) },1000);
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
});
function clear_animation(obj){
		jQuery('select[name="popup_open_animation"] option').each(
			function()
				{
				obj.removeClass(jQuery(this).attr('value'));	
				}
			);	
		jQuery('select[name="popup_close_animation"] option').each(
			function()
				{
				obj.removeClass(jQuery(this).attr('value'));	
				}
			);	
	}

jQuery( "#popup_width" ).spinner(
		{ 
		min:10, 
		max:100,  
		spin: function( event, ui ) 
				{
				jQuery('.modal-container').css('width',ui.value+'%');
				},
		stop: function(event,ui){
			generate_shortcode()
			}
		}
	).on('keyup', function(e)
				{
				jQuery('.modal-container').css('width',jQuery(this).val()+'%');
				generate_shortcode()
				});	

jQuery( "#popup_height" ).spinner(
		{ 
		min:10, 
		max:100,  
		spin: function( event, ui ) 
			{
			jQuery('.modal-container').css('height',ui.value+'%');
			jQuery('.modal-container').css('top',Math.floor((100-ui.value)/2)+'%');
			},
		stop: function(event,ui){
			generate_shortcode()
			}
		}
	).on('keyup', function(e)
			{
			jQuery('.modal-container').css('height',jQuery(this).val()+'%');
			jQuery('.modal-container').css('top',Math.floor((100-jQuery(this).val())/2)+'%');
			generate_shortcode()
			});	


jQuery( "#set_popup_time" ).spinner(
		{ 
		min:0,  
		spin: function( event, ui ) 
			{
			},
		stop: function(event,ui){
			generate_shortcode()
			}
		}
	).on('keyup', function(e)
			{
			generate_shortcode()
			});	
			
jQuery( "#set_popup_scroll_pos" ).spinner(
		{ 
		min:0,  
		spin: function( event, ui ) 
			{
			},
		stop: function(event,ui){
			generate_shortcode()
			}
		}
	).on('keyup', function(e)
			{
			generate_shortcode()
			});	





jQuery(".popup-bg-color").ColorPickerSliders(
		{
		 placement: 'bottom',
		 hsvpanel: true,
		 previewformat: 'hex',
		 color: '#ffff',
		 onchange: function(container, color)
			{
			get_target.css('background','rgba('+color.rgba.r+','+color.rgba.g+','+color.rgba.b+','+color.rgba.a+')');
			generate_shortcode();
			//jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field span.the_label, #md_label, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field .input-label, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field .radio-inline, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field .checkbox-inline').css('color','rgba('+color.rgba.r+','+color.rgba.g+','+color.rgba.b+','+color.rgba.a+')')
			}
		});


      
		jQuery( "#popup_padding_top" ).spinner(
			{ 
			min:0,
			spin: function( event, ui ) 
					{
					get_target.css('padding-top',ui.value+'%');
					},
			stop: function(event,ui){
				generate_shortcode()
				}
			}
		).on('keyup', function(e)
			{
			get_target.css('padding-top',jQuery(this).val()+'%');
			generate_shortcode()
			});	 
			
	
	jQuery( "#popup_padding_right" ).spinner(
		{ 
		min:0,  
		spin: function( event, ui ) 
				{
				get_target.css('padding-right',ui.value+'%');
				},
		stop: function(event,ui){
				generate_shortcode()
				}
		}
	).on('keyup', function(e)
		{
		get_target.css('padding-right',jQuery(this).val()+'%');
		generate_shortcode()
		});	

	jQuery( "#popup_padding_bottom" ).spinner(
		{  
		min:0,
		spin: function( event, ui ) 
				{
				get_target.css('padding-bottom',ui.value+'%');
				},
		stop: function(event,ui){
				generate_shortcode()
				}
		}
	).on('keyup', function(e)
		{
		get_target.css('padding-bottom',jQuery(this).val()+'%');
		generate_shortcode()
		});

	jQuery( "#popup_padding_left" ).spinner(
		{ 
		min:0, 
		spin: function( event, ui ) 
				{
				get_target.css('padding-left',ui.value+'%');
				},
		stop: function(event,ui){
				generate_shortcode()
				}
		}
	).on('keyup', function(e)
		{
		get_target.css('padding-left',jQuery(this).val()+'%');
		generate_shortcode()
		});	



	
function generate_shortcode(){
	
	
	
	
	var ID = jQuery('#form_update_id').text();
	
	var shortcode 	= '[NEXForms id="' +ID+'"';
	
	var php_code 	= '&lt;?php NEXForms_ui_output(array("id"=>'+ID;
	
	
		
	
	if(jQuery('.embed-form-style .btn.active').hasClass('conversational'))
		{
		shortcode 	+= ' form_style="conversational"';
		php_code 	+= ', "form_style"=>"conversational"';
		}
	if(jQuery('.embed-form-style .btn.active').hasClass('chat'))
		{
		shortcode	+= ' form_style="chat"';
		php_code 	+= ', "form_style"=>"chat"';
		}
		
		
	//button_color="btn-primary" type="button" text="Open Form"
	
	if(jQuery('.form_embed_types a.active').hasClass('popup'))
		{
		shortcode += ' open_trigger="popup" ';
		php_code 	+= ', "open_trigger"=>"popup"';	
		
		
	
	
		if(jQuery('.embed-poppup-trigger .btn.active').hasClass('button'))
			{
			shortcode 	+= ' type="button"';
			php_code 	+= ', "type"=>"button"';
			
			shortcode 	+= ' text="'+ jQuery('#set_popup_button_text').val() +'"';
			php_code 	+= ', "text"=>"'+ jQuery('#set_popup_button_text').val() +'"';
			
			shortcode 	+= ' button_color="'+ jQuery('.embed-poppup-button-color .btn.active').attr('data-btn-class') +'"';
			php_code 	+= ', "button_color"=>"'+ jQuery('.embed-poppup-button-color .btn.active').attr('data-btn-class') +'"';
			}
		if(jQuery('.embed-poppup-trigger .btn.active').hasClass('link'))
			{
			shortcode	+= ' type="link"';
			php_code 	+= ', "type"=>"link"';
			
			shortcode 	+= ' text="'+ jQuery('#set_popup_link_text').val() +'"';
			php_code 	+= ', "text"=>"'+ jQuery('#set_popup_link_text').val() +'"';
			}
		if(jQuery('.embed-poppup-trigger .btn.active').hasClass('custom'))
			{
			shortcode	+= ' type="custom_trigger"';
			php_code 	+= ', "type"=>"custom_trigger"';
			
			shortcode 	+= ' element_class="'+ jQuery('#set_popup_custom_text').val() +'"';
			php_code 	+= ', "element_class"=>"'+ jQuery('#set_popup_custom_text').val() +'"';
			}
		
		if(jQuery('.embed-poppup-trigger .btn.active').hasClass('timer'))
			{
			shortcode	+= ' type="timer"';
			php_code 	+= ', "type"=>"timer"';
			
			shortcode	+= ' auto_popup_delay="'+ jQuery('#set_popup_time').val() +'"';
			php_code 	+= ', "auto_popup_delay"=>"'+ jQuery('#set_popup_time').val() +'"';
			}
		if(jQuery('.embed-poppup-trigger .btn.active').hasClass('scroll'))
			{
			shortcode	+= ' type="scroll"';
			php_code 	+= ', "type"=>"scroll"';
			
			shortcode	+= ' auto_popup_scroll_top="'+ jQuery('#set_popup_scroll_pos').val() +'"';
			php_code 	+= ', "auto_popup_scroll_top"=>"'+ jQuery('#set_popup_scroll_pos').val() +'"';
			}
		if(jQuery('.embed-poppup-trigger .btn.active').hasClass('exit'))
			{
			shortcode	+= ' type="exit"';
			php_code 	+= ', "type"=>"exit"';
			
			shortcode	+= ' exit_intent="1"';
			php_code 	+= ', "exit_intent"=>"1"';
			}
		
		if(jQuery('.embed-popup-v-position .btn.active').hasClass('top'))
			{
			shortcode	+= ' v_position="top"';
			php_code 	+= ', "v_position"=>"top"';
			}
		if(jQuery('.embed-popup-v-position .btn.active').hasClass('bottom'))
			{
			shortcode	+= ' v_position="bottom"';
			php_code 	+= ', "v_position"=>"bottom"';
			}
		
		if(jQuery('.embed-popup-h-position .btn.active').hasClass('left'))
			{
			shortcode	+= ' h_position="left"';
			php_code 	+= ', "h_position"=>"left"';
			}
		if(jQuery('.embed-popup-h-position .btn.active').hasClass('right'))
			{
			shortcode	+= ' h_position="right"';
			php_code 	+= ', "h_position"=>"right"';
			}
		
		shortcode	+= ' width="'+jQuery('#popup_width').val()+'"';
		php_code 	+= ', "width"=>"'+jQuery('#popup_width').val()+'"';
		
		shortcode	+= ' height="'+jQuery('#popup_height').val()+'"';
		php_code 	+= ', "height"=>"'+jQuery('#popup_height').val()+'"';
		
		
		
		
		
		
		if(jQuery('.set_popup_bg.active').hasClass('use_form'))
			{
			shortcode	+= ' background="use-form-background"';
			php_code 	+= ', "background"=>"use-form-background"';	
			}
		if(jQuery('.set_popup_bg.active').hasClass('use_custom'))
			{
			shortcode	+= ' background="'+jQuery('input[name="popup-bg-color"]').val()+'"';
			php_code 	+= ', "background"=>"'+jQuery('input[name="popup-bg-color"]').val()+'"';
			}
		
		
		if(jQuery('#popup_padding_left').val()!='2')
			{
			shortcode	+= ' padding_left="'+jQuery('#popup_padding_left').val()+'"';
			php_code 	+= ', "padding_left"=>"'+jQuery('#popup_padding_left').val()+'"';	
			}
		if(jQuery('#popup_padding_right').val()!='2')
			{
			shortcode	+= ' padding_right="'+jQuery('#popup_padding_right').val()+'"';
			php_code 	+= ', "padding_right"=>"'+jQuery('#popup_padding_right').val()+'"';	
			}
		if(jQuery('#popup_padding_top').val()!='2')
			{
			shortcode	+= ' padding_top="'+jQuery('#popup_padding_top').val()+'"';
			php_code 	+= ', "padding_top"=>"'+jQuery('#popup_padding_top').val()+'"';	
			}
		if(jQuery('#popup_padding_bottom').val()!='2')
			{
			shortcode	+= ' padding_bottom="'+jQuery('#popup_padding_bottom').val()+'"';
			php_code 	+= ', "padding_bottom"=>"'+jQuery('#popup_padding_bottom').val()+'"';	
			}
		
		
		
			shortcode	+= ' open_animation="'+jQuery('#popup_open_animation').val()+'"';
			php_code 	+= ', "open_animation"=>"'+jQuery('#popup_open_animation').val()+'"';	
			
			shortcode	+= ' close_animation="'+jQuery('#popup_close_animation').val()+'"';
			php_code 	+= ', "close_animation"=>"'+jQuery('#popup_close_animation').val()+'"';	
			
		
		
		get_target.css('padding-top',jQuery('#popup_padding_top').val()+'%');
		get_target.css('padding-right',jQuery('#popup_padding_right').val()+'%');
		get_target.css('padding-bottom',jQuery('#popup_padding_bottom').val()+'%');
		get_target.css('padding-left',jQuery('#popup_padding_left').val()+'%');
		get_target.css('width',jQuery( "#popup_width" ).val()+'%');
		get_target.css('height',jQuery( "#popup_height" ).val()+'%');
		get_target.css('top',Math.floor((100-jQuery( "#popup_height" ).val())/2)+'%');
		
		
		
		
	}
	
			
	
	shortcode 	+= ']';
	php_code 	+= '),true); ?&gt';
	
	if(jQuery('.form_embed_shortcode_display').hasClass('no_code') && jQuery('.form_embed_types a.active').hasClass('popup'))
		{
		shortcode = '<div class="alert alert-danger">Please register NEX-Forms to enable the use of Popup Forms. Dont have a registration code?<br><a href="http://codecanyon.net/item/nexforms-the-ultimate-wordpress-form-builder/7103891?license=regular&open_purchase_for_item_id=7103891&purchasable=source&ref=Basix" target="_blank">Get your code now</a></div>';
		php_code = '<div class="alert alert-danger">Please register NEX-Forms to enable the use of Popup Forms. Dont have a registration code?<br><a href="http://codecanyon.net/item/nexforms-the-ultimate-wordpress-form-builder/7103891?license=regular&open_purchase_for_item_id=7103891&purchasable=source&ref=Basix" target="_blank">Get your code now</a></div>';
		}
	
	jQuery('.shortcode .embed_code').html(shortcode);
	jQuery('.php .embed_code').html(php_code);
	
}
	

//OPTIONS SETUP MENU CLICK	
	jQuery(document).on('click', '.show_on_submission_options', function(){
		jQuery('.tri-menu .on_submission_options_tab a').trigger('click');
	});
	jQuery(document).on('click', '.show_file_uploads_options', function(){
		jQuery('.tri-menu .file_uploads_options_tab a').trigger('click');
	});
	jQuery(document).on('click', '.show_hidden_fields', function(){
		jQuery('.tri-menu .hidden_fields_options_tab a').trigger('click');
	});
	
	jQuery('.form_canvas .radio-inline').each(
			function()
				{
				if(jQuery(this).find('.check-icon').attr('class'))
					jQuery(this).find('input').prop('checked', true);
				
					
				}
			);
	jQuery('.form_canvas .image-choices-choice').each(
		function()
			{
			if(jQuery(this).find('.thumb-icon-holder').attr('class'))
				jQuery(this).find('input').prop('checked', true);	
			}
		);
	
	jQuery(document).on('click', '.the-radios a, .image-choices-choice-text, .the-thumb-image, .thumb-icon-holder, .the-radios .input-label, .the-radios span.check-icon', function(e){
				

				var the_field = jQuery(this).closest('.form_field');

				if(!the_field.hasClass('classic-radio-group') && !the_field.hasClass('classic-check-group'))
					{
						e.preventDefault();
					}
				
				var clickedParent = jQuery(this).closest('label');
				var	input = clickedParent.find('input');
				var	nexCheckable = clickedParent.find('a:first');
				var	input_label = clickedParent.closest('label');
				
				var	input_holder 	= 	jQuery(this).closest('.input_container');
				
				var check_animation 	= (input_holder.attr('data-checked-animation')) ? input_holder.attr('data-checked-animation') : 'fadeInDown';
				var uncheck_animation 	= (input_holder.attr('data-unchecked-animation')) ? input_holder.attr('data-unchecked-animation') : 'fadeOutUp';
				
				if(input.prop('type') === 'radio')
					{
					
					the_field.find('.radio_selected').removeClass('radio_selected');
					the_field.find('#the-radios a').css('background','#fff');
					the_field.find('.check-icon').remove();
					the_field.find('.thumb-icon-holder').remove();
					if(!nexCheckable.hasClass('checked'))
						{
							jQuery('input[name="' + input.attr('name') + '"]').each(
								function(index, el)
									{
									jQuery(el).prop('checked', false).parent().find('a:first').removeClass('checked').removeClass("ui-state-active").addClass("ui-state-default").removeClass(jQuery(el).closest('.the-radios').attr('data-checked-class'));
									nexCheckable.attr('class','checked' );
									input_label.removeClass('radio_selected');
									
									}
								);
							
						}
					}
				
					if(input.prop('checked'))
						{
						input.prop('checked', false);
						nexCheckable.attr('class','ui-state-default');
							nexCheckable.css('background','#fff');
						input_label.removeClass('radio_selected');
						nexCheckable.parent().find('.check-icon').remove();
						
						clickedParent.find('.thumb-icon-holder .thumb-icon').removeClass(check_animation);
						clickedParent.find('.thumb-icon-holder .thumb-icon').addClass(uncheck_animation);
						setTimeout(function() { clickedParent.find('.thumb-icon-holder').remove() },300);
						} 
					else 
						{
						the_field.find('.thumb-icon-holder .thumb-icon').removeClass(uncheck_animation);
						the_field.find('.thumb-icon-holder .thumb-icon').addClass(check_animation);
						
						var set_thumb_icon_bg = '#8bc34a';
						
						input.prop('checked', true);
						nexCheckable.attr('class','checked');
						nexCheckable.addClass("ui-state-active").removeClass("ui-state-default")
						input_label.addClass('radio_selected');
						if(nexCheckable.closest('.the-radios').attr('data-checked-bg-color') && nexCheckable.closest('.the-radios').attr('data-checked-bg-color')!='')
							{
							nexCheckable.css('background',nexCheckable.closest('#the-radios').attr('data-checked-bg-color'));
							set_thumb_icon_bg = nexCheckable.closest('#the-radios').attr('data-checked-bg-color');
							}
						else
							nexCheckable.css('background','#8bc34a');
						
						var checked_color = '#ffffff';
						
						if(nexCheckable.css('color')!='transparent' && nexCheckable.css('color')!='undefined' && nexCheckable.css('color')!='' && nexCheckable.css('color')!='rgba(0, 0, 0, 0)')
							checked_color = nexCheckable.css('color');
						if(the_field.hasClass('image-choices-field'))
							clickedParent.find('.thumb-image-outer-wrap').prepend('<div class="thumb-icon-holder"><span style="background: '+ set_thumb_icon_bg +'; color:'+ checked_color +';" class="thumb-icon animated_fast '+check_animation+' checked fa '+ nexCheckable.closest('.the-radios').attr('data-checked-class')+'"></span></div>' );
						else
							nexCheckable.after('<span style="color:'+ checked_color +';" class="check-icon checked fa '+ nexCheckable.closest('.the-radios').attr('data-checked-class')+'"></span>' );
						
						nexCheckable.addClass('animated').addClass('pulse');
						setTimeout(function(){ nexCheckable.removeClass('animated').removeClass('pulse');},1300);
						
						}	
						
					input.trigger('change');
					}			
				
			);

	
	jQuery(document).on('click','.resposive_tests i',
		function()
			{
			
			jQuery('.resposive_tests i').removeClass('active');
			
			jQuery(this).addClass('active');	
			jQuery('.show_form_preview').css('height','calc(100% - 37px)');
			jQuery('.preview_canvas').removeClass('preview_mobile');
			
			if(jQuery(this).hasClass('laptop'))
				jQuery('.show_form_preview').css('width','');
			else if(jQuery(this).hasClass('tablet'))
				{
				jQuery('.show_form_preview').css('width','770px');
				jQuery('.preview_canvas').addClass('preview_mobile');
				jQuery('.show_form_preview').css('height','calc(100% - 50px)');
				}
			else if(jQuery(this).hasClass('phone'))
				{
				jQuery('.preview_canvas').addClass('preview_mobile');
				jQuery('.show_form_preview').css('width','320px')
				jQuery('.show_form_preview').css('height','568px')
				}
			}
		);

	
	jQuery(document).on('click','.canvas_background_tools .shade div',
		function()
			{
			jQuery('select.md_theme_shade_selection option[value="light"]').trigger('click');
			jQuery('select.md_theme_shade_selection').trigger('change');
			}
		);
	
	
		
	
			
		
		
		update_select('.choose_form_theme');
		update_select('.set_form_theme');
		
		
		
		
		jQuery(document).on('change','.set_form_theme',
			function()
				{
				jQuery(this).attr('data-selected',jQuery(this).val())
				}
		);
		
		jQuery(document).on('click', ".date #datetimepicker input",
		function()
			{
			jQuery(this).parent().find('.input-group-addon').trigger('click');
			}
		);	
		jQuery(document).on('click', ".time #datetimepicker input",
		function()
			{
			jQuery(this).parent().find('.input-group-addon').trigger('click');
			}
		);	
		jQuery(document).on('change','select[name="choose_form_theme"]',
			function()
				{
				jQuery('.html_fields').find('.ui-state-default').removeClass('ui-state-default');
				jQuery('.html_fields').find('.ui-state-widget').removeClass('ui-state-widget');
				jQuery('.html_fields').find('.ui-state-active').removeClass('ui-state-active');
				
				jQuery('.outer-container').attr('class', 'outer-container theme-'+jQuery(this).attr('data-selected'));
				
				if(jQuery('select[name="set_form_theme"]').val()=='jquery_ui')
					{
					setTimeout(function(){ 
						
							jQuery('label.radio-inline').addClass('ui-state-default')
							jQuery('label.checkbox-inline').addClass('ui-state-default')
						 },500);
					}
				
				}
			);
				
		jQuery(document).on('change','select[name="set_form_theme"]',
			function()
				{
				
					
				jQuery('label.radio-inline,  label.checkbox-inline').removeClass('ui-state-default');	
				jQuery('.field-settings-column.open_sidenav  #close-settings').trigger('click');	
				var set_theme = jQuery(this).val();
				jQuery('.outer-container').attr('class', 'outer-container');
				jQuery('.nex_forms_admin_page_wrapper').attr('class', 'nex_forms_admin_page_wrapper');
				
				if(set_theme=='m_design' || set_theme=='neumorphism' )
					{
					jQuery('.choose_form_theme').addClass('hidden');
					jQuery('.md_theme_selection').removeClass('hidden');
					//jQuery('link.material_theme').attr('href',jQuery('.plugin_url').text()+ '/css/themes/'+ jQuery('.md_theme_selection').attr('data-selected') +'.css?v=7.5.16.1');
					jQuery('link.jquery_ui_theme').attr('href',"");
					jQuery('.ui-state-default').removeClass('ui-state-default');
					jQuery('.ui-state-active').removeClass('ui-state-active')
					jQuery('.ui-widget-content').removeClass('ui-widget-content');
					jQuery('.ui-widget-header, .panel-heading').removeClass('ui-widget-header')
					
					jQuery('.outer-container').attr('class', 'outer-container theme-'+jQuery('.md_theme_selection').attr('data-selected'));
					
					
					}
				else if(set_theme=='jquery_ui')
					{
					setTimeout(function(){ 
					
						jQuery('label.radio-inline').addClass('ui-state-default')
						jQuery('label.checkbox-inline').addClass('ui-state-default')
					 },500);
					jQuery('.choose_form_theme').removeClass('hidden');
					jQuery('.md_theme_selection').addClass('hidden');
					jQuery('.outer-container').attr('class', 'outer-container');
					jQuery('.choose_form_theme').trigger('change');
					
					jQuery('.outer-container').attr('class', 'outer-container theme-'+jQuery('.choose_form_theme').attr('data-selected'));
					
					}
				else
					{
					jQuery('.choose_form_theme').removeClass('hidden');
					jQuery('.md_theme_selection').addClass('hidden');
					jQuery('.outer-container').attr('class', 'outer-container');
					jQuery('.choose_form_theme').trigger('change');
					
					jQuery('.outer-container').attr('class', 'outer-container theme-'+jQuery('.choose_form_theme').attr('data-selected'));
					
					//jQuery('link.material_theme').attr('href',jQuery('.plugin_url').text()+ '/css/themes/none.css');	
					}
				
				jQuery('.ui-nex-forms-container').removeClass('bootstrap').removeClass('m_design').removeClass('jq_ui').removeClass('jquery_ui').removeClass('browser').removeClass('neumorphism').addClass(set_theme);	
				jQuery('.ui-nex-forms-container').attr('data-form-theme',set_theme);
				
				jQuery('.ui-nex-forms-container .form_field').each( //
					function()
						{
						
						reset_field_theme(set_theme,jQuery(this));
						
						
						
						}
					);
					
						jQuery('.inner-canvas-container .html_fields .the_input_element, .ui-nex-forms-container .input-group-addon .form-control, .ui-nex-forms-container .submit-button button, .ui-nex-forms-container .nex-step button, .ui-nex-forms-container .prev-step button').removeClass('form-control');
						jQuery('.inner-canvas-container .html_fields .the_input_element, .ui-nex-forms-container .submit-button button, .ui-nex-forms-container .nex-step button, .ui-nex-forms-container .prev-step button').removeClass('ui-corner-all').removeClass('ui-widget');
					
						
					
					
				}
			);	
		
	
	
		
		jQuery(document).on('blur','textarea, input',
			function()
				{
				if(!jQuery(this).val() && !jQuery(this).attr('placeholder'))
					jQuery(this).parent().find('#md_label').removeClass('active');
				}
			
		);
		
		
		
		
		
		jQuery('.tooltipped').tooltip(
			{
			delay: 50,
			position: 'top',
			html: true
			}
		);
		
		
		update_select('.md_theme_shade_selection');
		update_select('.md_theme_selection');
		
		
		
		
		jQuery(document).on('click','a.full-screen-btn',
			function()
				{
				if(jQuery(this).hasClass('fc'))
					{
					jQuery('.form-canvas-area').removeClass('fullscreen')
					jQuery(this).find('.material-icons').addClass('fa-expand').removeClass('fa-compress');
					jQuery(this).removeClass('fc')
					}
				else
					{
					jQuery('.form-canvas-area').addClass('fullscreen')
					jQuery(this).addClass('fc');
					jQuery(this).find('.material-icons').removeClass('fa-expand').addClass('fa-compress');
					}
				}
			);	
		
		
		jQuery(document).on('change','select[name="md_theme_shade_selection"]',
			function()
				{
				//jQuery('link.material_theme_shade').attr('href',jQuery('.plugin_url').text()+ '/css/themes/'+ jQuery(this).val() +'.css');
				}
			);	
		
		jQuery(document).on('change','select[name="md_theme_selection"]',
			function()
				{
				//jQuery('link.material_theme').attr('href',jQuery('.plugin_url').text()+ '/css/themes/'+ jQuery(this).val() +'.css?v=7.5.16.1');
				
				jQuery('.outer-container').attr('class', 'outer-container theme-'+jQuery(this).val());
				
				jQuery('select.md_theme_selection option').each(
					function()
						{
						jQuery('.nex_forms_admin_page_wrapper').removeClass('theme-'+jQuery(this).attr('value'));
						}
					)
					
					jQuery('.nex_forms_admin_page_wrapper').addClass('theme-'+jQuery(this).val());
				
				}
			);	
		
		
		jQuery(document).on('click','.field_selection_dropdown_menu', function()
			{
			if(jQuery(this).hasClass('active'))
				{
				jQuery('.form_canvas').removeClass('fields_opened');
				jQuery(this).removeClass('active');
				jQuery('ul#fields_dropdown').hide();
				jQuery(this).find('.fa').removeClass('fa-chevron-up').addClass('fa-chevron-down');
				}
			else
				{
				jQuery('.form_canvas').addClass('fields_opened');	
				jQuery(this).addClass('active');
				jQuery('ul#fields_dropdown').fadeIn();
				jQuery(this).find('.fa').removeClass('fa-chevron-down').addClass('fa-chevron-up');
				}
			}
		);
		
		
		
		jQuery('input').trigger('autoresize');
		jQuery('textarea').trigger('autoresize');
		
		jQuery(document).on('click','.tabs_nf .tab', function()
			{
			jQuery('.mce-flight_shortcodes').removeClass('is_opened');	
			}
		);
		
		jQuery('div.updated').remove();
		jQuery('.update-nag').remove();
		jQuery('div.error').remove();
		
		//REMOVE UNWANTED STYLESHEETS
			var link_id = '';
			var css_link = '';
			jQuery('head link').each(
				function()
					{
					css_link = jQuery(this);
					link_id = jQuery(this).attr('id');
					jQuery('.unwanted_css_array .unwanted_css').each(
						function()
							{
							if(link_id)
								{
								if(link_id.trim()==jQuery(this).text())
									css_link.attr('href','');
								}
							}
						);
					
					}
				)
		
		jQuery('ul.tabs_nf').tabs_nf();
		
		//setTimeout(function(){
		//jQuery('.builder_nav li.tab a.active').removeClass('active').trigger('click');
		//},500);
		
		
		jQuery('.builder_nav li.tab a.active').removeClass('active').trigger('click');
		
		
		jQuery(document).on('click','.builder_nav li.tab a.email_setup, .builder_nav li.tab a.integration', function()
				{
				//jQuery('.form_attr_left_menu li.active a').trigger('click');
				//jQuery('.tri-menu li.tab a.active').removeClass('active').trigger('click');
				setup_tags();
				}
			);
			
		jQuery(document).on('click','.builder_nav li.tab a.form_options', function()
				{
				setup_tags();
				}
			);
		
		
		
		
		var total_steps = jQuery('.nex-forms-container .form_field.step').length;
					
		if(total_steps!=0)
			{
				
			
				
				
			jQuery('#ms-css-settings').show();
			jQuery('.show_all_steps').show();
			if(jQuery('.multi-step-stepping li').length<1)
				{
				nf_count_multi_steps();
				setTimeout(function(){ 
				
				jQuery('.multi-step-tools ul li:eq(1) a').trigger('click'); 
				
				},200);
				}
			}
		jQuery('.nex-forms-container .step .nex-step').each(
			function()
				{
				hide_step_back_next(jQuery(this))
				}
			);
		jQuery('.nex-forms-container .step .prev-step').each(
			function()
				{
				hide_step_back_next(jQuery(this))
				}
			);
		jQuery('.nex-forms-container .step .nex-submit').each(
			function()
				{
				hide_step_back_next(jQuery(this))
				}
			);
		
		
		jQuery(document).on('change','select[name="ms_current_fields"]', function()
				{
				jQuery(this).attr('data-selected',jQuery(this).val())	
				}
			);
			jQuery(document).on('change','select[name="mailster_lists"]', function()
				{
				/*jQuery(this).attr('data-selected',jQuery(this).val());
				
				var data =
					{
					action	 						: 'reload_mp_form_fields',
					reload_mp_list					: 'true',
					form_Id							: jQuery('#form_update_id').text(),
					mp_list_id						: jQuery(this).val(),
					};
				jQuery('.mp_field_map').html('<div class="loading">Loading <i class="fa fa-circle-o-notch fa-spin"></i></div>')		
				jQuery.post
					(
					ajaxurl, data, function(response)
						{
						jQuery('.mp_field_map').html(response);
						set_mp_field_map();
						}
					);*/
				
				}
			);
		
		
	
		jQuery(document).on('change','select[name="mp_current_fields"]', function()
				{
				jQuery(this).attr('data-selected',jQuery(this).val())	
				}
			);
			jQuery(document).on('change','select[name="mailpoet_lists"]', function()
				{
				/*jQuery(this).attr('data-selected',jQuery(this).val());
				
				var data =
					{
					action	 						: 'reload_mp_form_fields',
					reload_mp_list					: 'true',
					form_Id							: jQuery('#form_update_id').text(),
					mp_list_id						: jQuery(this).val(),
					};
				jQuery('.mp_field_map').html('<div class="loading">Loading <i class="fa fa-circle-o-notch fa-spin"></i></div>')		
				jQuery.post
					(
					ajaxurl, data, function(response)
						{
						jQuery('.mp_field_map').html(response);
						set_mp_field_map();
						}
					);*/
				
				}
			);
		
		
	
		
		jQuery(document).on('change','select[name="mc_current_fields"]', function()
				{
				jQuery(this).attr('data-selected',jQuery(this).val())	
				}
			);
			jQuery(document).on('change','select[name="mail_chimp_lists"]', function()
				{
				jQuery(this).attr('data-selected',jQuery(this).val());
				
				var data =
					{
					action	 						: 'reload_mc_form_fields',
					reload_mc_list					: 'true',
					form_Id							: jQuery('#form_update_id').text(),
					mc_list_id						: jQuery(this).val(),
					};
				jQuery('.mc_field_map').html('<div class="loading">Loading <i class="fa fa-circle-o-notch fa-spin"></i></div>')		
				jQuery.post
					(
					ajaxurl, data, function(response)
						{
						jQuery('.mc_field_map').html(response);
						set_mc_field_map();
						}
					);
				
				}
			);
			
			
			jQuery(document).on('change','select[name="gr_current_fields"]', function()
				{
				jQuery(this).attr('data-selected',jQuery(this).val())	
				}
			);
			/*jQuery(document).on('change','select[name="get_response_lists"]', function()
				{
				jQuery(this).attr('data-selected',jQuery(this).val());
				
				var data =
					{
					action	 						: 'reload_gr_form_fields',
					reload_gr_list					: 'true',
					form_Id							: jQuery('#form_update_id').text(),
					gr_list_id						: jQuery(this).val(),
					};
				jQuery('.gr_field_map').html('<div class="loading">Loading <i class="fa fa-circle-o-notch fa-spin"></i></div>')		
				jQuery.post
					(
					ajaxurl, data, function(response)
						{
						jQuery('.gr_field_map').html(response);
						set_gr_field_map();
						}
					);
				
				}
			);*/
				
		
		setTimeout(function()
			{
			jQuery('.form_field.slider').each(
				function()
					{
					jQuery(this).find('input.the_slider').trigger('change');
					}
				);
			},100);
		
		
		jQuery(document).on('change', 'select', function()
				{
				jQuery(this).attr('data-selected',jQuery(this).val());
				}
			);
		
		jQuery(document).on('click', '.builder_nav .tab a', function()
				{
				//jQuery('.currently_editing').removeClass('currently_editing');
				if(jQuery(this).attr('class'))
					{
					jQuery('#builder_view').removeClass('styling_view').addClass(jQuery(this).attr('class'));
					}
				}
			);

		possible_email_fields();
		jQuery(document).on('click','a.user_email_tab',
			function()
				{
				possible_email_fields();
				update_select('.posible_email_fields');
				}
			);
	
		
		jQuery(document).on('click','.add_hidden_field',
				function()
					{
					var hf_clone = jQuery('.hidden_field_clone').clone();
					hf_clone.removeClass('hidden').removeClass('hidden_field_clone').addClass('hidden_field');
					
					jQuery('.hidden_fields_setup .hidden_fields').append(hf_clone);
					
					}
				);
				
			jQuery(document).on('click','.remove_hidden_field',
				function()
					{
					jQuery(this).closest('.hidden_field').remove();
					}
				);
			jQuery(document).on('change','select[name="set_hidden_field_value"]',
				function()
					{
					jQuery(this).closest('.input-group').find('.hidden_field_value').val(jQuery(this).closest('.input-group').find('.hidden_field_value').val()+ '' +jQuery(this).val());
					jQuery(this).find('option').prop('selected',false);
					}
				);
		
		jQuery('.hidden_onload').removeClass('hidden');
		
		jQuery('.modal').modal(
			{
			dismissible: true, // Modal can be dismissed by clicking outside of the modal
			opacity: .8, // Opacity of modal background
			inDuration: 300, // Transition in duration
			outDuration: 200, // Transition out duration (not for bottom modal)
			startingTop: '4%', // Starting top style attribute (not for bottom modal)
			endingTop: '10%', // Ending top style attribute (not for bottom modal)
			ready: function(modal, trigger)
				{ 	// Callback for Modal open. Modal and trigger parameters available.
				},
			complete: function() 
				{  
				} // Callback for Modal close
			}
		);
		
		
		jQuery(document).on('click','.btn-fullscreen',
			function()
				{
				jQuery('.nex_forms_admin_page_wrapper').addClass('fullscreen');
				jQuery('.nex_forms_admin_page_wrapper').addClass('fullscreen');
				jQuery('.expand_fullscreen').hide();
				jQuery('.colapse_fullscreen').show();
				}
			);
		jQuery(document).on('click','.btn-wordpress',
			function()
				{
				jQuery('.nex_forms_admin_page_wrapper').removeClass('fullscreen');
				jQuery('.expand_fullscreen').show();
				jQuery('.colapse_fullscreen').hide();
				}
			);
		
		jQuery(document).on('click','.create_new_form',
			function()
				{
				jQuery('#new_form_wizard').modal('open');
				}
			);
			
		jQuery(document).on('click','.preview-form',
			function()
				{
				jQuery('.btn.workspace.preview').trigger('click');
				//nf_save_nex_form('','preview', jQuery(this));
				}
			);
		jQuery(document).on('click','.refresh-preview ',
			function()
				{
				
				nf_save_nex_form('','preview', '');
				}
			);
		
		jQuery(document).on('click','.field_settings .btn.delete',
			function()
				{
					nf_save_state('undo');
					var get_field = jQuery(this).closest('.form_field');
					if(get_field.hasClass('currently_editing'))
						jQuery('.field-settings-column #close-settings').trigger('click');
					
					if(get_field.hasClass('auto-step'))
						get_field.closest('.step').removeClass('auto-step');
					
					
					get_field.remove();
					nf_form_modified('field delete');
					
				}
			);
		jQuery(document).on('click','.step .zero-clipboard .btn.delete',
			function()
				{
				var step_num = jQuery(this).closest('.step').attr('data-step-num');
				jQuery(this).closest('.step').fadeOut('fast',
				function()
					{
					jQuery(this).remove();	
					var total_steps = jQuery('.nex-forms-container .form_field.step').length;
					
					if(total_steps==0)
						{
						jQuery('#ms-css-settings').hide();
						jQuery('.bc-outer-container').hide();
						jQuery('.show_all_steps').hide();
						}
					nf_reset_multi_steps();
					nf_count_multi_steps();
					
					jQuery( "#timer_start" ).spinner( "option", "max", total_steps );
					jQuery( "#timer_end" ).spinner( "option", "max", total_steps );
					
					if(step_num==1)
						jQuery('li.all_steps a').trigger('click');//jQuery('.nf_ms_breadcrumb ul li:eq(0) a').trigger('click');
					else
						{
						if(!jQuery('.show_all_steps li.all_steps').hasClass('current'))
							{
							jQuery('.nf_ms_breadcrumb ul li:eq(' + (step_num-2) + ') a').trigger('click');
							jQuery('.multi-step-tools ul li:eq('+ (step_num-1) +')').find('a').trigger('click');
							}
						}
					}
				);
			}
		);
		
	jQuery(document).on('click','.duplicate_field',
		function()
			{
			nf_save_state('undo');
			var get_field = jQuery(this).closest('.form_field');
			
			
			
			var duplication = nf_duplicate_field(get_field);

			duplication.insertAfter(get_field);
			
			var panel = jQuery('.form_canvas .panel-body');
			
			if(get_field.hasClass('step'))
				{
				nf_reset_multi_steps();
				nf_count_multi_steps();
				var step_num = duplication.attr('data-step-num');
				
				
				duplication.addClass('animated');
				duplication.addClass('fadeInDown');
				//duplication.addClass('duplicated');
				
				setTimeout(function()
					{
					duplication.removeClass('animated');
					duplication.removeClass('fadeInDown');
					duplication.removeClass('duplicated');
					},1000
				);
				
				
				jQuery('.nf_ms_breadcrumb ul li:eq(' + step_num + ') a').trigger('click');
				jQuery('.multi-step-tools ul li:eq('+ step_num +')').find('a').trigger('click');
				}
			
			create_droppable(panel)
			
			if(get_field.hasClass('.step'))
				{
				nf_reset_multi_steps();
					nf_count_multi_steps();	
				}
			
			
			nf_form_modified('field duplicated');		
				
			}
		);	
	
	
	jQuery(document).on('click','.nf_ms_breadcrumb li', //
		function()
			{
				var crumb = jQuery(this).find('a');
			//jQuery('.nf_ms_breadcrumb li').removeClass('current')
			//jQuery('.nf_ms_breadcrumb li').removeClass('visited')
			//jQuery(this).parent().addClass('current');
			
			//for(var i=(parseInt(jQuery(this).attr('data-show-step'))-1) ;i>=0;i--)
			//	jQuery('.nf_ms_breadcrumb li:eq('+i+')').addClass('visited');
			
			jQuery('.multi-step-tools ul.multi-step-stepping li:eq('+ (crumb.attr('data-show-step')-1) +') a').trigger('click');
			
			}
		);
	
	
	jQuery(document).on('mouseenter','.nf_ms_breadcrumb ul li', //
		function()
			{
			jQuery(this).prev('li').addClass('over-current-prev');
			jQuery(this).next('li').addClass('over-current-next');
			}
		);
	jQuery(document).on('mouseleave','.nf_ms_breadcrumb ul li', //
		function()
			{
			jQuery('.nf_ms_breadcrumb li').removeClass('over-current-prev');
			jQuery('.nf_ms_breadcrumb li').removeClass('over-current-next');
			}
		);
	
	jQuery(document).on('click','.multi-step-tools ul li a', //
		function()
			{
			
				
			jQuery('.multi-step-tools ul li').removeClass('current');
			jQuery(this).parent().addClass('current')
			
			
			jQuery('.nex-forms-container .form_field.step').removeClass('active_step')
			
			
			jQuery('.nf_ms_breadcrumb li').removeClass('current');
			jQuery('.nf_ms_breadcrumb li').removeClass('visited');
			jQuery('.nf_ms_breadcrumb li').removeClass('current-prev');
			jQuery('.nf_ms_breadcrumb li').removeClass('current-next');
			jQuery('.nf_ms_breadcrumb li:eq('+ (jQuery(this).attr('data-show-step')-1) +')').addClass('current');
			jQuery('.nf_ms_breadcrumb li:eq('+ (jQuery(this).attr('data-show-step')-2) +')').addClass('current-prev');
			jQuery('.nf_ms_breadcrumb li:eq('+ (jQuery(this).attr('data-show-step')) +')').addClass('current-next');
			
			for(var i=(parseInt(jQuery(this).attr('data-show-step'))-1) ;i>=0;i--)
				jQuery('.nf_ms_breadcrumb li:eq('+i+')').addClass('visited');
			
			jQuery('.nf_ms_breadcrumb li:eq('+ (jQuery(this).attr('data-show-step')-1) +')').removeClass('visited');
			
			
			
			if(jQuery(this).parent().hasClass('new_step'))
				{
				jQuery('.multi-step-fields .form_field.step .draggable_object').first().trigger('click');
				return;
				}
			
			
			
			if(jQuery(this).attr('data-show-step')!='all')
				{
				jQuery('.nex-forms-container .step').hide()
				jQuery('.nex-forms-container').removeClass('view_all_steps');
				jQuery('.nex-forms-container .nf_multi_step_'+ jQuery(this).attr('data-show-step')).show();
				jQuery('.nex-forms-container .nf_multi_step_'+ jQuery(this).attr('data-show-step')).addClass('active_step');
				jQuery('.nex-forms-container .step').removeClass('step_close');
				}
			else
				{
				jQuery('.nex-forms-container').addClass('view_all_steps');
				jQuery('.nex-forms-container .step').show();
				jQuery('.nex-forms-container .step').addClass('step_close');
				}
				
			
			//if(jQuery('.form_canvas').hasClass('conditional-logic-opened'))
			//	setTimeout(function(){ logic_interface();},1000);
			
			}
		);
	
	
	
	jQuery(document).on('click', '.save_nex_form', 
		function()
			{
			nf_save_nex_form(0,1, jQuery(this));
			
				jQuery(this).addClass('saving').html('<span class="fa fa-spin fa-refresh"></span>');
			}
		);		
		
	
	
	jQuery(document).on('change', 'input[name="form_post_action"]', 
		function()
			{
			
			if(jQuery(this).val()=='ajax')
				{
				jQuery('.submit_custom_options').addClass('hidden');
				jQuery('.submit_ajax_options').removeClass('hidden');
				
				if(jQuery('input[name="on_form_submission"]:checked').val()=='message')
					{
					jQuery('.on_submit_redirect').addClass('hidden');
					jQuery('.on_submit_show_message').removeClass('hidden');
					}
				else
					{
					jQuery('.on_submit_redirect').removeClass('hidden');
					jQuery('.on_submit_show_message').addClass('hidden');
					}
					
				}
			else
				{
					
				jQuery('.on_submit_redirect').addClass('hidden');
				jQuery('.on_submit_show_message').addClass('hidden');
				jQuery('.submit_custom_options').removeClass('hidden');
				jQuery('.submit_ajax_options').addClass('hidden');
				}
			}
		);		
		
		
		jQuery(document).on('change', 'input[name="on_form_submission"]', 
		function()
			{
			
			if(jQuery(this).val()=='message')
				{
				jQuery('.on_submit_redirect').addClass('hidden');
				jQuery('.on_submit_show_message').removeClass('hidden');
				}
			else
				{
				jQuery('.on_submit_redirect').removeClass('hidden');
				jQuery('.on_submit_show_message').addClass('hidden');
				}
			
			}
		);		

	
	/* PAYPAL  */
	jQuery(document).on('click', ".paypal_product .input-group-addon",
		function()
			{
					if(!jQuery(this).hasClass('is_label'))
							{
							jQuery(this).parent().find('.input-group-addon').removeClass('active');
							jQuery(this).addClass('active');
							
							if(jQuery(this).hasClass('static_value'))
								{
								if(jQuery(this).parent().hasClass('pp_product_quantity'))
									jQuery(this).parent().find('input[name="set_quantity"]').val('static');
								if(jQuery(this).parent().hasClass('pp_product_amount'))
									jQuery(this).parent().find('input[name="set_amount"]').val('static');
									
								
								jQuery(this).parent().find('input[type="text"]').removeClass('hidden')
								jQuery(this).parent().find('select').addClass('hidden')
								}
							else
								{
								if(jQuery(this).parent().hasClass('pp_product_quantity'))
									jQuery(this).parent().find('input[name="set_quantity"]').val('map');
								if(jQuery(this).parent().hasClass('pp_product_amount'))
									jQuery(this).parent().find('input[name="set_amount"]').val('map');
									
									
								jQuery(this).parent().find('select').removeClass('hidden')
								jQuery(this).parent().find('input[type="text"]').addClass('hidden')
								}
							}
					}
				)
	jQuery(document).on('click', '#add_paypal_product', function()
					{
					var pp_clone = jQuery('.paypal_product_clone').clone();
					pp_clone.removeClass('hidden').removeClass('paypal_product_clone').addClass('paypal_product');

					jQuery('.paypal_products').append(pp_clone);
					
					pp_clone.find('.product_number').text(jQuery('.paypal_products .paypal_product').length);
					
					jQuery(".paypal_products").animate(
							{
							scrollTop:(jQuery(".paypal_product").height()*jQuery('.paypal_products .paypal_product').length)+200
							},500
						);
					
			
					var set_current_fields_math_logic = '<option value="0" selected="selected">--- Map Field --</option>';
						set_current_fields_math_logic += '<optgroup label="Text Fields">';
						jQuery('div.nex-forms-container div.form_field input[type="text"]').each(
							function()
								{
								set_current_fields_math_logic += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
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
									set_current_fields_math_logic += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								
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
									set_current_fields_math_logic += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								new_check = old_check;
								}
							);	
						set_current_fields_math_logic += '</optgroup>';
						
						set_current_fields_math_logic += '<optgroup label="Selects">';
						jQuery('div.nex-forms-container div.form_field select').each(
							function()
								{
								set_current_fields_math_logic += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								}
							);	
						set_current_fields_math_logic += '</optgroup>';
						
						set_current_fields_math_logic += '<optgroup label="Text Areas">';
						jQuery('div.nex-forms-container div.form_field textarea').each(
							function()
								{
								set_current_fields_math_logic += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								}
							);	
						set_current_fields_math_logic += '</optgroup>';
					
						set_current_fields_math_logic += '<optgroup label="Hidden Fields">';
						jQuery('div.nex-forms-container div.form_field input[type="hidden"]').each(
							function()
								{
								set_current_fields_math_logic += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								}
							);	
						set_current_fields_math_logic += '</optgroup>';
						
						
						
					pp_clone.find('select').html(set_current_fields_math_logic);
		
					
					
					}
				);
			jQuery(document).on('click', ".remove_paypal_product",
		function()
			{	
			
					jQuery('.remove_paypal_product').remove('btn-primary');
					jQuery(this).closest('.paypal_product').remove();
					jQuery('.paypal_products .paypal_product').each(
						function(index)
							{
							jQuery(this).find('.product_number').text(index+1);
							}
						);
					}
				);
	
	update_select('.set_currency_code');
	
	jQuery('.form_field.grid').each(
		function()
			{
			var panel = jQuery(this).find('.panel-body');
			create_droppable(panel)
			}
		);
	
	//setTimeout(function()
		//{
		jQuery('.inner-canvas-container .form_field').each(
			function(index)
				{
				
				if(!jQuery(this).attr('data-settings-tabs'))
					setup_field_settings(jQuery(this));
				
				setup_form_element(jQuery(this))
				}
			);
		//},200);
	
	
	if(jQuery(document).width()<1600)
		{
		jQuery('.btn-fullscreen').trigger('click'); 
		/*jQuery('.nex_forms_admin_page_wrapper').addClass('fullscreen')
					jQuery('a.full-screen-btn').addClass('fc');
					jQuery('a.full-screen-btn').find('.material-icons').removeClass('fa-expand').addClass('fa-compress');*/
		}
	
	if(jQuery('#demo_site').text()=='yes')
		{
		var test_page_tour = new Tour({
			  name: "test-page-tour-"+jQuery('#form_update_id').text(),
			  template: "<div class='popover tour'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default tour-step-back' data-role='prev'><span class='fa fa-arrow-left'></span> PREV </button><button class='btn btn-default end-tour dismiss_tour' data-role='end'><span class='fa fa-thumbs-up'></span> OK, got it. </button></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
			
			  steps: [
			  	{
				element: ".view_test_page",
				title: "New Test Page Created",
				content: "<br>A front-end test page has been created just for you!<br><br> Click on this button after you created <strong>AND SAVED</strong> the form. You can test your form live with email submissions and everything. </br></br>Remember you can download the form you create here to import into your own site!",
				placement: 'bottom'
			  	},
			  
			]});
		}
	}
);


function nf_count_multi_steps(){
	var total_steps = jQuery('.nex-forms-container .form_field.step').length;
	var set_breadcrumb = '';
	var set_stepping = '';
	var step_name = '';
	var step_description = '';
	
	var step_icon = '';
	jQuery('.nex-forms-container .form_field.step').each(
		function(index, element)
			{
			
			for(var i=0;i<80;i++)
				jQuery(this).removeClass('nf_multi_step_'+(i))
			
			
			jQuery(this).addClass('nf_multi_step_'+(index+1));

	
			step_description = (jQuery(this).attr('data-step-description')) ? jQuery(this).attr('data-step-description') : '';
			step_icon = (jQuery(this).attr('data-step-icon')) ? jQuery(this).attr('data-step-icon') : '';
			var step_title = '';	
			var des_class = 'no-description';		
			if(step_description)
				des_class = '';
			
			var icon_class = 'no-icon';		
			if(step_icon)
				icon_class = 'has-icon';
				
			jQuery(this).attr('data-step-num', (index+1) );	
			
			
			step_name = (jQuery(this).find('input[name="multi_step_name"]').val()) ? jQuery(this).find('input[name="multi_step_name"]').val() : '';
			
			
			if(!step_name || step_name=='' || step_name==null || step_name==' ' || step_name=='  ' || step_name=='   ' || step_name=='&nbsp;' || step_name=='&nbsp; ' || step_name=='&nbsp;  ')
				step_title = 'no-title';
				
			set_stepping += '<li ><a data-title="'+ step_name +'"data-toggle="tooltip_bs" data-placement="bottom" data-show-step="'+ (index+1) +'">'+ (index+1) +'</a></li>';
			
			
			
			set_breadcrumb += '<li class="'+des_class+' '+step_title+' '+icon_class+'"><div class="crumb_container"><div class="step_number_container"><span class="the_step_num">'+(index+1)+'</span><span class="the_step_icon '+step_icon+'" ></span></div><a href="#" rel="nofollow" data-show-step="'+ (index+1) +'"><div class="step_title">'+ step_name +'</div><div class="step_description">'+ step_description +'</div></a><div class="step_connecter" style="display:none"></div></div></li>';
			
			
			jQuery(this).find('.ms-step-number').text(index+1);
			jQuery(this).find('input[name="multi_step_name"]').attr('placeholder', 'Step '+(index+1)+' title');
			jQuery(this).find('input[name="multi_step_description"]').attr('placeholder', 'Step '+(index+1)+' description');

			}
		);
		
	jQuery('span.all_steps_count').html(total_steps);
	jQuery('.nf_ms_breadcrumb ul').html(set_breadcrumb);
	
	jQuery('.multi-step-stepping').html(set_stepping);
	
	jQuery('[data-toggle="tooltip_bs"]').tooltip_bs(
			{
			delay: 0,
			html:true
			}
		);
	
	
	
	return total_steps;
	
}
function nf_reset_multi_steps(){
	for(var i=0;i<80;i++)
		jQuery('.nex-forms-container .form_field.step').removeClass('nf_multi_step_'+(i))
}




function popup_user_alert(msg){
	
	Materialize.toast(msg, 2000, 'toast-success');
}

function possible_email_fields(){
	var posible_email_fields = '<option value="">Dont send confirmation mail to user</option>';	
	var has_email_fields = false;
	jQuery('div.nex-forms-container div.form_field input.email').each(
			function()
				{
				has_email_fields = true;
				posible_email_fields += '<option value="'+  jQuery(this).attr('name') +'" '+ ((jQuery('.nex_form_attr .user_email_field').text()==jQuery(this).attr('name')) ? 'selected="selected"' : '') +' >'+ jQuery(this).closest('div.form_field').find('.the_label').text() +'</option>';
				}
			);
	jQuery('select[name="posible_email_fields"]').html(posible_email_fields);	
}

function update_select(the_class){
	jQuery('select'+ the_class +' option').each(
		function()
			{
			var get_selected = jQuery(this).closest('select');
			
			
			if(jQuery(this).val()==get_selected.attr('data-selected'))
				{
				jQuery(this).attr('selected','selected');
				jQuery(this).trigger('click');
				}
			}
		);	
}

function nf_apply_font(obj, selector){	

	  if(jQuery('select[name="'+ selector +'"]').val()=='')
	  	{
			jQuery('select[name="'+ selector +'"]').attr('data-selected','')
			obj.css('font-family','');
			return;
		}

	  var font = JSON.parse( jQuery('select[name="'+ selector +'"]').val() )
	  obj.css('font-family', font.family);
	  jQuery('select[name="'+ selector +'"]').attr('data-selected',jQuery('select[name="'+ selector +'"] option:selected').attr('class'))
	  
	  if ( 'undefined' !== font.name ) {
			if(!jQuery('link[id="'+ format_illegal_chars(font.name) +'"]').length>0)
				{
				if(format_illegal_chars(font.name)!='arial'
				&& format_illegal_chars(font.name)!='bookman'
				&& format_illegal_chars(font.name)!='century_gothic'
				&& format_illegal_chars(font.name)!='comic_sans_ms'
				&& format_illegal_chars(font.name)!='courier'
				&& format_illegal_chars(font.name)!='garamond'
				&& format_illegal_chars(font.name)!='georgia'
				&& format_illegal_chars(font.name)!='helvetica'
				&& format_illegal_chars(font.name)!='lucida_grande'
				&& format_illegal_chars(font.name)!='palatino'
				&& format_illegal_chars(font.name)!='tahoma'
				&& format_illegal_chars(font.name)!='times'
				&& format_illegal_chars(font.name)!='trebuchet_ms'
				&& format_illegal_chars(font.name)!='verdana'
				)
					{
					jQuery( '<link id="'+format_illegal_chars(font.name)+'" type="text/css" role="google-font-import" rel="stylesheet" href="https://fonts.googleapis.com/css?family='+ font.name +'">').appendTo( '.nex-forms-container' );
					}
				}
		}
	  
}

function set_ms_field_map(){
	var set_current_fields_paypal = '<option value="0" selected="selected">--- Map Field --</option>';
						set_current_fields_paypal += '<optgroup label="Text Fields">';
						jQuery('div.nex-forms-container div.form_field input[type="text"]').each(
							function()
								{
								set_current_fields_paypal += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								}
							);	
						set_current_fields_paypal += '</optgroup>';
						
						set_current_fields_paypal += '<optgroup label="Text Areas">';
						jQuery('div.nex-forms-container div.form_field textarea').each(
							function()
								{
								set_current_fields_paypal += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								}
							);	
						set_current_fields_paypal += '</optgroup>';
						
						set_current_fields_paypal += '<optgroup label="Radio Buttons">';
						
						var old_radio = '';
						var new_radio = '';
						
						jQuery('div.nex-forms-container div.form_field input[type="radio"]').each(
							function()
								{
								old_radio = jQuery(this).attr('name');
								if(old_radio != new_radio)
									set_current_fields_paypal += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								
								new_radio = old_radio;
								
								}
							);	
						set_current_fields_paypal += '</optgroup>';
						
						var old_check = '';
						var new_check = '';
						set_current_fields_paypal += '<optgroup label="Check Boxes">';
						jQuery('div.nex-forms-container div.form_field input[type="checkbox"]').each(
							function()
								{
								old_check = jQuery(this).attr('name');
								if(old_check != new_check)
									set_current_fields_paypal += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								new_check = old_check;
								}
							);	
						set_current_fields_paypal += '</optgroup>';
						
						set_current_fields_paypal += '<optgroup label="Selects">';
						jQuery('div.nex-forms-container div.form_field select').each(
							function()
								{
								set_current_fields_paypal += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								}
							);	
						set_current_fields_paypal += '</optgroup>';
						set_current_fields_paypal += '<optgroup label="Hidden Fields">';
							set_current_fields_paypal += jQuery('.hidden_form_fields').html()
						set_current_fields_paypal += '</optgroup>';
						
						
					jQuery('.ms_field_map').find('select').html(set_current_fields_paypal);
					
					jQuery('.ms_field_map').find('select option').each(
						function()
							{
							var get_selected = jQuery(this).closest('select');
							if(jQuery(this).val()==get_selected.attr('data-selected'))
								{
								jQuery(this).attr('selected','selected');
								}
							}
						);
}
function set_mp_field_map(){
	var set_current_fields_paypal = '<option value="0" selected="selected">--- Map Field --</option>';
						set_current_fields_paypal += '<optgroup label="Text Fields">';
						jQuery('div.nex-forms-container div.form_field input[type="text"]').each(
							function()
								{
								set_current_fields_paypal += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								}
							);	
						set_current_fields_paypal += '</optgroup>';
						
						set_current_fields_paypal += '<optgroup label="Text Areas">';
						jQuery('div.nex-forms-container div.form_field textarea').each(
							function()
								{
								set_current_fields_paypal += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								}
							);	
						set_current_fields_paypal += '</optgroup>';
						
						set_current_fields_paypal += '<optgroup label="Radio Buttons">';
						
						var old_radio = '';
						var new_radio = '';
						
						jQuery('div.nex-forms-container div.form_field input[type="radio"]').each(
							function()
								{
								old_radio = jQuery(this).attr('name');
								if(old_radio != new_radio)
									set_current_fields_paypal += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								
								new_radio = old_radio;
								
								}
							);	
						set_current_fields_paypal += '</optgroup>';
						
						var old_check = '';
						var new_check = '';
						set_current_fields_paypal += '<optgroup label="Check Boxes">';
						jQuery('div.nex-forms-container div.form_field input[type="checkbox"]').each(
							function()
								{
								old_check = jQuery(this).attr('name');
								if(old_check != new_check)
									set_current_fields_paypal += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								new_check = old_check;
								}
							);	
						set_current_fields_paypal += '</optgroup>';
						
						set_current_fields_paypal += '<optgroup label="Selects">';
						jQuery('div.nex-forms-container div.form_field select').each(
							function()
								{
								set_current_fields_paypal += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								}
							);	
						set_current_fields_paypal += '</optgroup>';
						set_current_fields_paypal += '<optgroup label="Hidden Fields">';
							set_current_fields_paypal += jQuery('.hidden_form_fields').html()
						set_current_fields_paypal += '</optgroup>';
						
						
					jQuery('.mp_field_map').find('select').html(set_current_fields_paypal);
					
					jQuery('.mp_field_map').find('select option').each(
						function()
							{
							var get_selected = jQuery(this).closest('select');
							if(jQuery(this).val()==get_selected.attr('data-selected'))
								{
								jQuery(this).attr('selected','selected');
								}
							}
						);
}

function set_mc_field_map(){
	var set_current_fields_paypal = '<option value="0" selected="selected">--- Map Field --</option>';
						set_current_fields_paypal += '<optgroup label="Text Fields">';
						jQuery('div.nex-forms-container div.form_field input[type="text"]').each(
							function()
								{
								set_current_fields_paypal += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								}
							);	
						set_current_fields_paypal += '</optgroup>';
						
						set_current_fields_paypal += '<optgroup label="Text Areas">';
						jQuery('div.nex-forms-container div.form_field textarea').each(
							function()
								{
								set_current_fields_paypal += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								}
							);	
						set_current_fields_paypal += '</optgroup>';
						
						set_current_fields_paypal += '<optgroup label="Radio Buttons">';
						
						var old_radio = '';
						var new_radio = '';
						
						jQuery('div.nex-forms-container div.form_field input[type="radio"]').each(
							function()
								{
								old_radio = jQuery(this).attr('name');
								if(old_radio != new_radio)
									set_current_fields_paypal += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								
								new_radio = old_radio;
								
								}
							);	
						set_current_fields_paypal += '</optgroup>';
						
						var old_check = '';
						var new_check = '';
						set_current_fields_paypal += '<optgroup label="Check Boxes">';
						jQuery('div.nex-forms-container div.form_field input[type="checkbox"]').each(
							function()
								{
								old_check = jQuery(this).attr('name');
								if(old_check != new_check)
									set_current_fields_paypal += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								new_check = old_check;
								}
							);	
						set_current_fields_paypal += '</optgroup>';
						
						set_current_fields_paypal += '<optgroup label="Selects">';
						jQuery('div.nex-forms-container div.form_field select').each(
							function()
								{
								set_current_fields_paypal += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								}
							);	
						set_current_fields_paypal += '</optgroup>';
						set_current_fields_paypal += '<optgroup label="Hidden Fields">';
							set_current_fields_paypal += jQuery('.hidden_form_fields').html()
						set_current_fields_paypal += '</optgroup>';
						
						
					jQuery('.mc_field_map').find('select').html(set_current_fields_paypal);
					
					jQuery('.mc_field_map').find('select option').each(
						function()
							{
							var get_selected = jQuery(this).closest('select');
							if(jQuery(this).val()==get_selected.attr('data-selected'))
								{
								jQuery(this).attr('selected','selected');
								}
							}
						);
}


function set_gr_field_map(){
	var set_current_fields_paypal = '<option value="0" selected="selected">--- Map Field --</option>';
						set_current_fields_paypal += '<optgroup label="Text Fields">';
						jQuery('div.nex-forms-container div.form_field input[type="text"]').each(
							function()
								{
								set_current_fields_paypal += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								}
							);	
						set_current_fields_paypal += '</optgroup>';
						
						set_current_fields_paypal += '<optgroup label="Text Areas">';
						jQuery('div.nex-forms-container div.form_field textarea').each(
							function()
								{
								set_current_fields_paypal += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								}
							);	
						set_current_fields_paypal += '</optgroup>';
						
						set_current_fields_paypal += '<optgroup label="Radio Buttons">';
						
						var old_radio = '';
						var new_radio = '';
						
						jQuery('div.nex-forms-container div.form_field input[type="radio"]').each(
							function()
								{
								old_radio = jQuery(this).attr('name');
								if(old_radio != new_radio)
									set_current_fields_paypal += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								
								new_radio = old_radio;
								
								}
							);	
						set_current_fields_paypal += '</optgroup>';
						
						var old_check = '';
						var new_check = '';
						set_current_fields_paypal += '<optgroup label="Check Boxes">';
						jQuery('div.nex-forms-container div.form_field input[type="checkbox"]').each(
							function()
								{
								old_check = jQuery(this).attr('name');
								if(old_check != new_check)
									set_current_fields_paypal += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								new_check = old_check;
								}
							);	
						set_current_fields_paypal += '</optgroup>';
						
						set_current_fields_paypal += '<optgroup label="Selects">';
						jQuery('div.nex-forms-container div.form_field select').each(
							function()
								{
								set_current_fields_paypal += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								}
							);	
						set_current_fields_paypal += '</optgroup>';
						set_current_fields_paypal += '<optgroup label="Hidden Fields">';
							set_current_fields_paypal += jQuery('.hidden_form_fields').html()
						set_current_fields_paypal += '</optgroup>';
						
						
						
						
					jQuery('.gr_field_map').find('select').html(set_current_fields_paypal);
					
					jQuery('.gr_field_map').find('select option').each(
						function()
							{
							var get_selected = jQuery(this).closest('select');
							if(jQuery(this).val()==get_selected.attr('data-selected'))
								{
								jQuery(this).attr('selected','selected');
								}
							}
						);
}

function set_ftp_field_map(){
	var set_current_fields_paypal = '<option value="0" selected="selected">--- Map Field --</option>';
						set_current_fields_paypal += '<optgroup label="Text Fields">';
						jQuery('div.nex-forms-container div.form_field input[type="text"]').each(
							function()
								{
								set_current_fields_paypal += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								}
							);	
						set_current_fields_paypal += '</optgroup>';
						
						set_current_fields_paypal += '<optgroup label="Text Areas">';
						jQuery('div.nex-forms-container div.form_field textarea').each(
							function()
								{
								set_current_fields_paypal += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								}
							);	
						set_current_fields_paypal += '</optgroup>';
						
						set_current_fields_paypal += '<optgroup label="Radio Buttons">';
						
						var old_radio = '';
						var new_radio = '';
						
						jQuery('div.nex-forms-container div.form_field input[type="radio"]').each(
							function()
								{
								old_radio = jQuery(this).attr('name');
								if(old_radio != new_radio)
									set_current_fields_paypal += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								
								new_radio = old_radio;
								
								}
							);	
						set_current_fields_paypal += '</optgroup>';
						
						var old_check = '';
						var new_check = '';
						set_current_fields_paypal += '<optgroup label="Check Boxes">';
						jQuery('div.nex-forms-container div.form_field input[type="checkbox"]').each(
							function()
								{
								old_check = jQuery(this).attr('name');
								if(old_check != new_check)
									set_current_fields_paypal += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								new_check = old_check;
								}
							);	
						set_current_fields_paypal += '</optgroup>';
						
						set_current_fields_paypal += '<optgroup label="Selects">';
						jQuery('div.nex-forms-container div.form_field select').each(
							function()
								{
								set_current_fields_paypal += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								}
							);	
						set_current_fields_paypal += '</optgroup>';
						
						set_current_fields_paypal += '<optgroup label="File Uploaders">';
						jQuery('div.nex-forms-container div.form_field input[type="file"]').each(
							function()
								{
								set_current_fields_paypal += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								}
							);	
						set_current_fields_paypal += '</optgroup>';
						
						
						set_current_fields_paypal += '<optgroup label="Hidden Fields">';
							set_current_fields_paypal += jQuery('.hidden_form_fields').html()
						set_current_fields_paypal += '</optgroup>';
						
						
					jQuery('.ftp-form-field').find('select').html(set_current_fields_paypal);
					
					jQuery('.ftp-form-field').find('select option').each(
						function()
							{
							var get_selected = jQuery(this).closest('select');
							if(jQuery(this).val()==get_selected.attr('data-selected'))
								{
								jQuery(this).attr('selected','selected');
								}
							}
						);
}


function set_paypal_fields(){
	var set_current_fields_paypal = '<option value="0" selected="selected">--- Map Field --</option>';
						set_current_fields_paypal += '<optgroup label="Text Fields">';
						jQuery('div.nex-forms-container div.form_field input[type="text"]').each(
							function()
								{
								set_current_fields_paypal += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								}
							);	
						set_current_fields_paypal += '</optgroup>';
						
						set_current_fields_paypal += '<optgroup label="Radio Buttons">';
						
						var old_radio = '';
						var new_radio = '';
						
						jQuery('div.nex-forms-container div.form_field input[type="radio"]').each(
							function()
								{
								old_radio = jQuery(this).attr('name');
								if(old_radio != new_radio)
									set_current_fields_paypal += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								
								new_radio = old_radio;
								
								}
							);	
						set_current_fields_paypal += '</optgroup>';
						
						var old_check = '';
						var new_check = '';
						set_current_fields_paypal += '<optgroup label="Check Boxes">';
						jQuery('div.nex-forms-container div.form_field input[type="checkbox"]').each(
							function()
								{
								old_check = jQuery(this).attr('name');
								if(old_check != new_check)
									set_current_fields_paypal += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								new_check = old_check;
								}
							);	
						set_current_fields_paypal += '</optgroup>';
						
						set_current_fields_paypal += '<optgroup label="Selects">';
						jQuery('div.nex-forms-container div.form_field select').each(
							function()
								{
								set_current_fields_paypal += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								}
							);	
						set_current_fields_paypal += '</optgroup>';
						
						set_current_fields_paypal += '<optgroup label="Text Areas">';
						jQuery('div.nex-forms-container div.form_field textarea').each(
							function()
								{
								set_current_fields_paypal += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								}
							);	
						set_current_fields_paypal += '</optgroup>';
					
						set_current_fields_paypal += '<optgroup label="Hidden Fields">';
						jQuery('div.nex-forms-container div.form_field input[type="hidden"]').each(
							function()
								{
								set_current_fields_paypal += '<option value="'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ jQuery(this).attr('name') +'</option>';
								}
							);	
						set_current_fields_paypal += jQuery('.hidden_form_fields').html()
						set_current_fields_paypal += '</optgroup>';
						
						
						
					jQuery('.paypal_products').find('select').html(set_current_fields_paypal);
					
					jQuery('.paypal-column').find('select option').each(
						function()
							{
							var get_selected = jQuery(this).closest('select');
							if(jQuery(this).val()==get_selected.attr('data-selected'))
								{
								jQuery(this).attr('selected','selected');
								}
							}
						);
}



function setup_tags(){
	
	var tag_str = '';
	var old_radio = '';
	var new_radio = '';
	
	tag_str += '<li class="tiny_menu_head"><strong>Default tags</strong></li>';
	
	
	tag_str += '<li><a class="item" element="tag" code="nf_form_data" href="#">Form Data Table</a></li>';
	tag_str += '<li><a class="item" element="tag" code="nf_page_title" href="#">Page Title</a></li>';
	tag_str += '<li><a class="item" element="tag" code="nf_page_id" href="#">Page ID</a></li>';
	tag_str += '<li><a class="item" element="tag" code="nf_from_page" href="#">From Page</a></li>';
	tag_str += '<li><a class="item" element="tag" code="nf_form_title" href="#">Form Title</a></li>';
	tag_str += '<li><a class="item" element="tag" code="nf_form_id" href="#">Form ID</a></li>';
	tag_str += '<li><a class="item" element="tag" code="nf_entry_id" href="#">Unique Entry ID</a></li>';
	tag_str += '<li><a class="item" element="tag" code="nf_entry_date_time" href="#">Date &amp; Time</a></li>';
	tag_str += '<li><a class="item" element="tag" code="nf_entry_date" href="#">Date</a></li>';
	tag_str += '<li><a class="item" element="tag" code="nf_entry_date_day" href="#">Date - Day </a></li>';
	tag_str += '<li><a class="item" element="tag" code="nf_entry_date_month" href="#">Date - Month </a></li>';
	tag_str += '<li><a class="item" element="tag" code="nf_entry_date_year" href="#">Date - Year </a></li>';
	tag_str += '<li><a class="item" element="tag" code="nf_entry_time" href="#">Time</a></li>';
	tag_str += '<li><a class="item" element="tag" code="nf_user_ip" href="#">User IP</a></li>';
	
	tag_str += '<li class="tiny_menu_head"><strong>Field tags</strong></li>';
	
	jQuery('div.nex-forms-container div.form_field input.the_input_element').each(
		function()	
			{
			var input_name	 = 	jQuery(this).attr('name');	
			input_name = input_name.replace(']','');
			input_name = input_name.replace('[','');
			var input_type	 = 	jQuery(this).attr('type');	
			if(input_type=='radio' || input_type=='checkbox')
				{
				old_radio = jQuery(this).attr('name');
				if(old_radio != new_radio)
					tag_str += '<li><a class="item" element="tag" code="'+ input_name +'" href="#">'+ unformat_name(input_name) +'</a></li>';
				new_radio = old_radio;
				}
			else
				{
				tag_str += '<li><a class="item" element="tag" code="'+ input_name +'" href="#">'+ unformat_name(input_name) +'</a></li>';
				}
			}
		);
	
	jQuery('div.nex-forms-container div.form_field select.the_input_element').each(
		function()	
			{
			var input_name	 = 	jQuery(this).attr('name');	
			tag_str += '<li><a class="item" element="tag" code="'+ input_name +'" href="#">'+ unformat_name(input_name) +'</a></li>';
			}
		);
	
	jQuery('div.nex-forms-container div.form_field textarea.the_input_element').each(
		function()	
			{
			var input_name	 = 	jQuery(this).attr('name');	
			tag_str += '<li><a class="item" element="tag" code="'+ input_name +'" href="#">'+ unformat_name(input_name) +'</a></li>';
			}
		);
	
	tag_str += '<li class="tiny_menu_head"><strong>Logged-in User tags</strong></li>';
	tag_str += '<li><a class="item" element="tag" code="nf_user_name" href="#">Username</a></li>';
	tag_str += '<li><a class="item" element="tag" code="nf_user_first_name" href="#">User First Name</a></li>';
	tag_str += '<li><a class="item" element="tag" code="nf_user_last_name" href="#">User Last Name</a></li>';
	tag_str += '<li><a class="item" element="tag" code="nf_user_email_address" href="#">User Email Address</a></li>';
	tag_str += '<li><a class="item" element="tag" code="nf_user_url" href="#">User URL</a></li>';
	
	
	tag_str += '<li class="tiny_menu_head"><strong>PayPal tags</strong></li>';
	tag_str += '<li><a class="item" element="tag" code="nf_paypal_data" href="#">PayPal Data Table</a></li>';
	tag_str += '<li><a class="item" element="tag" code="nf_paypal_status" href="#">Payment Status</a></li>';
	tag_str += '<li><a class="item" element="tag" code="nf_paypal_ammount" href="#">Payment Ammount</a></li>';
	tag_str += '<li><a class="item" element="tag" code="nf_paypal_currency" href="#">Payment Currency</a></li>';
	tag_str += '<li><a class="item" element="tag" code="nf_paypal_payment_id" href="#">Payment ID</a></li>';
	tag_str += '<li><a class="item" element="tag" code="nf_paypal_payment_token" href="#">Payment Token</a></li>';
	
	
	
	
	
	jQuery('.tiny_button_tags_placeholders').html(	tag_str);	
}



function setup_tags2(){
		var set_email_tags = '';
						set_email_tags += '<optgroup label="Text Fields">';
						jQuery('div.nex-forms-container div.form_field input[type="text"]').each(
							function()
								{
								set_email_tags += '<option value="{{'+ format_illegal_chars(jQuery(this).attr('name'))  +'}}">'+ unformat_name(jQuery(this).attr('name')) +'</option>';
								
								}
							);	
						set_email_tags += '</optgroup>';
						
						set_email_tags += '<optgroup label="Radio Buttons">';
						var old_radio = '';
						var new_radio = '';
						
						jQuery('div.nex-forms-container div.form_field input[type="radio"]').each(
							function()
								{
								old_radio = jQuery(this).attr('name');
								if(old_radio != new_radio)
									set_email_tags += '<option value="{{'+ format_illegal_chars(jQuery(this).attr('name'))  +'}}">'+ unformat_name(jQuery(this).attr('name')) +'</option>';
								
								new_radio = old_radio;
								
								}
							);	
						set_email_tags += '</optgroup>';
						
						var old_check = '';
						var new_check = '';
						set_email_tags += '<optgroup label="Check Boxes">';
						jQuery('div.nex-forms-container div.form_field input[type="checkbox"]').each(
							function()
								{
								var check_name = jQuery(this).attr('name').replace('[]','')
									
								old_check = check_name;
								if(old_check != new_check)
									set_email_tags += '<option value="{{'+ format_illegal_chars(check_name)  +'}}">'+ unformat_name(jQuery(this).attr('name')) +'</option>';
								new_check = old_check;
								}
							);	
						set_email_tags += '</optgroup>';
						
						set_email_tags += '<optgroup label="Selects">';
						jQuery('div.nex-forms-container div.form_field select').each(
							function()
								{
								set_email_tags += '<option value="{{'+ format_illegal_chars(jQuery(this).attr('name'))  +'}}">'+ unformat_name(jQuery(this).attr('name')) +'</option>';
								}
							);	
						set_email_tags += '</optgroup>';
						
						set_email_tags += '<optgroup label="Text Areas">';
						jQuery('div.nex-forms-container div.form_field textarea').each(
							function()
								{
								set_email_tags += '<option value="{{'+ format_illegal_chars(jQuery(this).attr('name'))  +'}}">'+ unformat_name(jQuery(this).attr('name')) +'</option>';
								}
							);	
						set_email_tags += '</optgroup>';
						
						
						set_email_tags += '<optgroup label="File Uploaders">';
						jQuery('div.nex-forms-container div.form_field input[type="file"]').each(
							function()
								{
								set_email_tags += '<option value="{{'+ format_illegal_chars(jQuery(this).attr('name'))  +'}}">'+ unformat_name(jQuery(this).attr('name')) +'</option>';
								}
							);	
						set_email_tags += '</optgroup>';
						
						set_email_tags += '<optgroup label="Hidden Fields">';
						jQuery('div.nex-forms-container div.form_field input[type="hidden"]').each(
							function()
								{
								set_email_tags += '<option value="{{'+ format_illegal_chars(jQuery(this).attr('name'))  +'}}">'+ unformat_name(jQuery(this).attr('name')) +'</option>';
								}
							);	
						set_email_tags += jQuery('.hidden_form_fields').html()
						set_email_tags += '</optgroup>';
						
						
						set_email_tags += '<optgroup label="More Tags">';
						set_email_tags += '<option value="{{nf_form_data}}">Form Data Table</option>';
						set_email_tags += '<option value="{{nf_user_ip}}">IP Address</option>';
						set_email_tags += '<option value="{{nf_from_page}}">Page Title</option>';
						set_email_tags += '<option value="{{nf_form_title}}">Form Title</option>';
						set_email_tags += '<option value="{{nf_user_name}}">User Name</option>';
						
					
						
						set_email_tags += '</optgroup>';
						
						
						
					jQuery('select[name="email_field_tags"], select[name="user_email_field_tags"]').html(set_email_tags);
						
	}
function setup_field_settings(field_obj){
	//console.log('ran ' + field_obj.attr('class'));
	if(field_obj.hasClass('icon-select-group'))
		{
		field_obj.attr('data-settings-tabs',jQuery('.field-selection-tools .icon-select-group').attr('data-settings-tabs'));
		field_obj.attr('data-settings',jQuery('.field-selection-tools .icon-select-group').attr('data-settings'));
		}
	if(field_obj.hasClass('digital-signature'))
		{
		field_obj.attr('data-settings-tabs',jQuery('.field-selection-tools .digital-signature').attr('data-settings-tabs'));
		field_obj.attr('data-settings',jQuery('.field-selection-tools .digital-signature').attr('data-settings'));
		}
	if(field_obj.hasClass('preset_fields'))
		{
		field_obj.attr('data-settings-tabs',jQuery('.field-selection-tools .preset_fields.name').attr('data-settings-tabs'));
		field_obj.attr('data-settings',jQuery('.field-selection-tools .preset_fields.name').attr('data-settings'));
		}
	if(field_obj.hasClass('textarea'))
		{
		field_obj.attr('data-settings-tabs',jQuery('.field-selection-tools .textarea.common_fields').attr('data-settings-tabs'));
		field_obj.attr('data-settings',jQuery('.field-selection-tools .textarea.common_fields').attr('data-settings'));
		}
	if(field_obj.hasClass('text'))
		{
		field_obj.attr('data-settings-tabs',jQuery('.field-selection-tools .text').attr('data-settings-tabs'));
		field_obj.attr('data-settings',jQuery('.field-selection-tools .text').attr('data-settings'));
		}
	if(field_obj.hasClass('password'))
		{
		field_obj.attr('data-settings-tabs',jQuery('.field-selection-tools .password').attr('data-settings-tabs'));
		field_obj.attr('data-settings',jQuery('.field-selection-tools .password').attr('data-settings'));
		}
	if(field_obj.hasClass('select'))
		{
		field_obj.attr('data-settings-tabs',jQuery('.field-selection-tools .select').attr('data-settings-tabs'));
		field_obj.attr('data-settings',jQuery('.field-selection-tools .select').attr('data-settings'));
		}
	if(field_obj.hasClass('multi-select'))
		{
		field_obj.attr('data-settings-tabs',jQuery('.field-selection-tools .multi-select').attr('data-settings-tabs'));
		field_obj.attr('data-settings',jQuery('.field-selection-tools .multi-select').attr('data-settings'));
		}
	if(field_obj.hasClass('radio-group') || field_obj.hasClass('md-radio-group'))
		{
		field_obj.attr('data-settings-tabs',jQuery('.field-selection-tools .radio-group').attr('data-settings-tabs'));
		field_obj.attr('data-settings',jQuery('.field-selection-tools .radio-group').attr('data-settings'));
		}
	if(field_obj.hasClass('check-group') || field_obj.hasClass('md-check-group'))
		{
		field_obj.attr('data-settings-tabs',jQuery('.field-selection-tools .check-group').attr('data-settings-tabs'));
		field_obj.attr('data-settings',jQuery('.field-selection-tools .check-group').attr('data-settings'));
		}
	if(field_obj.hasClass('single-image-select-group'))
		{
		field_obj.attr('data-settings-tabs',jQuery('.field-selection-tools .single-image-select-group').attr('data-settings-tabs'));
		field_obj.attr('data-settings',jQuery('.field-selection-tools .single-image-select-group').attr('data-settings'));
		}
	if(field_obj.hasClass('multi-image-select-group'))
		{
		field_obj.attr('data-settings-tabs',jQuery('.field-selection-tools .multi-image-select-group').attr('data-settings-tabs'));
		field_obj.attr('data-settings',jQuery('.field-selection-tools .multi-image-select-group').attr('data-settings'));
		}
	if(field_obj.hasClass('slider') || field_obj.hasClass('md-slider'))
		{
		field_obj.attr('data-settings-tabs',jQuery('.field-selection-tools .slider').attr('data-settings-tabs'));
		field_obj.attr('data-settings',jQuery('.field-selection-tools .slider').attr('data-settings'));
		}
	if(field_obj.hasClass('touch_spinner'))
		{
		field_obj.attr('data-settings-tabs',jQuery('.field-selection-tools .touch_spinner').attr('data-settings-tabs'));
		field_obj.attr('data-settings',jQuery('.field-selection-tools .touch_spinner').attr('data-settings'));
		}
	if(field_obj.hasClass('autocomplete'))
		{
		field_obj.attr('data-settings-tabs',jQuery('.field-selection-tools .autocomplete').attr('data-settings-tabs'));
		field_obj.attr('data-settings',jQuery('.field-selection-tools .autocomplete').attr('data-settings'));
		}	
	if(field_obj.hasClass('tags'))
		{
		field_obj.attr('data-settings-tabs',jQuery('.field-selection-tools .tags').attr('data-settings-tabs'));
		field_obj.attr('data-settings',jQuery('.field-selection-tools .tags').attr('data-settings'));
		}
	if(field_obj.hasClass('date') || field_obj.hasClass('md-datepicker') || field_obj.hasClass('jq-datepicker'))
		{
		field_obj.attr('data-settings-tabs',jQuery('.field-selection-tools .date').attr('data-settings-tabs'));
		field_obj.attr('data-settings',jQuery('.field-selection-tools .date').attr('data-settings'));
		}	
	if(field_obj.hasClass('time') || field_obj.hasClass('md-time-picker') || field_obj.hasClass('jq-time-picker'))
		{
		field_obj.attr('data-settings-tabs',jQuery('.field-selection-tools .time').attr('data-settings-tabs'));
		field_obj.attr('data-settings',jQuery('.field-selection-tools .time').attr('data-settings'));
		}	
	if(field_obj.hasClass('star-rating'))
		{
		field_obj.attr('data-settings-tabs',jQuery('.field-selection-tools .star-rating').attr('data-settings-tabs'));
		field_obj.attr('data-settings',jQuery('.field-selection-tools .star-rating').attr('data-settings'));
		}
	if(field_obj.hasClass('thumb-rating'))
		{
		field_obj.attr('data-settings-tabs',jQuery('.field-selection-tools .thumb-rating').attr('data-settings-tabs'));
		field_obj.attr('data-settings',jQuery('.field-selection-tools .thumb-rating').attr('data-settings'));
		}	
	if(field_obj.hasClass('smily-rating'))
		{
		field_obj.attr('data-settings-tabs',jQuery('.field-selection-tools .smily-rating').attr('data-settings-tabs'));
		field_obj.attr('data-settings',jQuery('.field-selection-tools .smily-rating').attr('data-settings'));
		}
	if(field_obj.hasClass('upload-multi'))
		{
		field_obj.attr('data-settings-tabs',jQuery('.field-selection-tools .upload-multi').attr('data-settings-tabs'));
		field_obj.attr('data-settings',jQuery('.field-selection-tools .upload-multi').attr('data-settings'));
		}	
	if(field_obj.hasClass('upload-single'))
		{
		field_obj.attr('data-settings-tabs',jQuery('.field-selection-tools .upload-single').attr('data-settings-tabs'));
		field_obj.attr('data-settings',jQuery('.field-selection-tools .upload-single').attr('data-settings'));
		}
	if(field_obj.hasClass('upload-image'))
		{
		field_obj.attr('data-settings-tabs',jQuery('.field-selection-tools .upload-image').attr('data-settings-tabs'));
		field_obj.attr('data-settings',jQuery('.field-selection-tools .upload-image').attr('data-settings'));
		}
	if(field_obj.hasClass('submit-button') || field_obj.hasClass('submit-button-2'))
		{
		field_obj.attr('data-settings-tabs',jQuery('.field-selection-tools .submit-button').attr('data-settings-tabs'));
		field_obj.attr('data-settings',jQuery('.field-selection-tools .submit-button').attr('data-settings'));
		}
	if(field_obj.hasClass('heading'))
		{
		field_obj.attr('data-settings-tabs',jQuery('.field-selection-tools .heading').attr('data-settings-tabs'));
		field_obj.attr('data-settings',jQuery('.field-selection-tools .heading').attr('data-settings'));
		}
	if(field_obj.hasClass('math_logic'))
		{
		field_obj.attr('data-settings-tabs',jQuery('.field-selection-tools .math_logic').attr('data-settings-tabs'));
		field_obj.attr('data-settings',jQuery('.field-selection-tools .math_logic').attr('data-settings'));
		}
	if(field_obj.hasClass('paragraph'))
		{
		field_obj.attr('data-settings-tabs',jQuery('.field-selection-tools .paragraph').attr('data-settings-tabs'));
		field_obj.attr('data-settings',jQuery('.field-selection-tools .paragraph').attr('data-settings'));
		}
	if(field_obj.hasClass('html'))
		{
		field_obj.attr('data-settings-tabs',jQuery('.field-selection-tools .html').attr('data-settings-tabs'));
		field_obj.attr('data-settings',jQuery('.field-selection-tools .html').attr('data-settings'));
		}
	if(field_obj.hasClass('divider'))
		{
		field_obj.attr('data-settings-tabs',jQuery('.field-selection-tools .divider').attr('data-settings-tabs'));
		field_obj.attr('data-settings',jQuery('.field-selection-tools .divider').attr('data-settings'));
		}
	if(field_obj.hasClass('is_panel'))
		{
		field_obj.attr('data-settings-tabs',jQuery('.field-selection-tools .is_panel').attr('data-settings-tabs'));
		field_obj.attr('data-settings',jQuery('.field-selection-tools .is_panel').attr('data-settings'));
		}
	if(field_obj.hasClass('grid-system'))
		{
		field_obj.attr('data-settings-tabs',jQuery('.field-selection-tools .grid-system').attr('data-settings-tabs'));
		field_obj.attr('data-settings',jQuery('.field-selection-tools .grid-system').attr('data-settings'));
		}
	
	
}


function nf_save_nex_form(form_id,form_status, clicked_obj)
	{
	var set_form_id = 0;
	if(clicked_obj)
	clicked_obj.find('.waves-ripple').remove();

	jQuery('.new_item').removeClass('new_item');
	
	if(jQuery('.ui-nex-forms-container .jq-datepicker').attr('class')!='')
		jQuery('.ui-nex-forms-container .jq-datepicker input').datepicker("destroy")
	
	if(jQuery('.ui-nex-forms-container .jq-radio-group').attr('class')!='')
		jQuery('.ui-nex-forms-container .jq-radio-group input').checkboxradio("destroy");
	if(jQuery('.ui-nex-forms-container .jq-check-group').attr('class')!='')
		jQuery('.ui-nex-forms-container .jq-check-group input').checkboxradio("destroy");
		
	if(jQuery('.ui-nex-forms-container .jq_select').attr('class')!='')
		jQuery('.ui-nex-forms-container select.jq_select').selectmenu('destroy');
	
	var text_before_save = '';
	if(clicked_obj)
		{
		var text_before_save = clicked_obj.html();
		clicked_obj.addClass('saving_btn');
		clicked_obj.html('<span class="fa fa-spin fa-refresh"></span>');
		}
	if(tinyMCE && tinyMCE!='undefined')
		tinyMCE.triggerSave();	


		jQuery('link#arial').remove();
		jQuery('link#bookman').remove();
		jQuery('link#century_gothic').remove();
		jQuery('link#comic_sans_ms').remove();
		jQuery('link#courier').remove();
		jQuery('link#garamond').remove();
		jQuery('link#georgia').remove();
		jQuery('link#helvetica').remove();
		jQuery('link#lucida_grande').remove();
		jQuery('link#palatino').remove();
		jQuery('link#tahoma').remove();
		jQuery('link#times').remove();
		jQuery('link#trebuchet_ms').remove();
		jQuery('link#verdana').remove();
		jQuery('link#open_sans_condensed').remove();
		
		jQuery('div.nex-forms-container .edit_mask').remove();
		
		jQuery('div.admin_html').html(jQuery('div.nex-forms-container').html());
		jQuery('div.clean_html').html(jQuery('div.nex-forms-container').html());
		
		jQuery('div.clean_success_html').html(jQuery('div.nex-forms-msg-container').html())
		jQuery('div.clean_success_admin_html').html(jQuery('div.nex-forms-msg-container').html())
		
		var clean_html = nf_cleanup_ui_html(jQuery('div.clean_html'));
		var admin_html = nf_cleanup_admin_html(jQuery('div.admin_html'));
		
		var clean_success_html = nf_cleanup_ui_html(jQuery('div.clean_success_html'));
		var clean_success_admin_html = nf_cleanup_admin_html(jQuery('div.clean_success_admin_html'));
		
		var hidden_fields = '';	
		jQuery('.hidden_fields_setup .hidden_fields .hidden_field').each(
			function()
				{
				hidden_fields += jQuery(this).find('input.field_name').val();
				hidden_fields += '[split]';
				hidden_fields += jQuery(this).find('input.field_value').val();
				hidden_fields += '[end]';
				}
			);
		
		var form_hidden_fields = []; 

		jQuery('.hidden_fields_setup .hidden_fields .hidden_field').each(
			function()
				{
				form_hidden_fields.push(
						{
						field_name: jQuery(this).find('input.field_name').val(),
						field_value: jQuery(this).find('input.field_value').val(),
						}
					);
				}
			);	

		var mc_field_map = '';	
		jQuery('.mc_field_map .mc-form-field').each(
			function()
				{
				mc_field_map += jQuery(this).attr('data-field-tag');
				mc_field_map += '[split]';
				mc_field_map += jQuery(this).find('select').attr('data-selected');
				mc_field_map += '[end]';
				}
			);
			
		var gr_field_map = '';	
		jQuery('.gr_field_map .gr-form-field').each(
			function()
				{
				gr_field_map += jQuery(this).attr('data-field-tag');
				gr_field_map += '[split]';
				gr_field_map += jQuery(this).find('select').attr('data-selected');
				gr_field_map += '[end]';
				}
			);
		var mp_field_map = '';	
		jQuery('.mp_field_map .mp-form-field').each(
			function()
				{
				mp_field_map += jQuery(this).attr('data-field-tag');
				mp_field_map += '[split]';
				mp_field_map += jQuery(this).find('select').attr('data-selected');
				mp_field_map += '[end]';
				}
			);
			
		var ms_field_map = '';	
		jQuery('.ms_field_map .ms-form-field').each(
			function()
				{
				ms_field_map += jQuery(this).attr('data-field-tag');
				ms_field_map += '[split]';
				ms_field_map += jQuery(this).find('select').attr('data-selected');
				ms_field_map += '[end]';
				}
			);
		
		var ftp_field_map = '';	
		
		jQuery('.ftp_reponse_setup .ftp-attr').each(
			function()
				{
				ftp_field_map += jQuery(this).attr('data-field-tag');
				ftp_field_map += '[split]';
				ftp_field_map += jQuery(this).find('select').attr('data-selected');
				ftp_field_map += '[end]';
				}
			);
		
		jQuery('.ftp_reponse_setup .ftp-form-field').each(
			function()
				{
				ftp_field_map += jQuery(this).attr('data-field-tag');
				ftp_field_map += '[split]';
				
				if( jQuery(this).attr('data-field-tag')=='post_content')
					ftp_field_map += jQuery('#ftp_content').val();
				else
					ftp_field_map += jQuery(this).find('select').attr('data-selected');
				ftp_field_map += '[end]';
				}
			);
			
		var cl_array = '';						
		jQuery('.set_rules .new_rule').each(
			function(index)
				{
				cl_array += '[start_rule]';
					//OPERATOR
					cl_array += '[operator]';
						cl_array += jQuery(this).find('select[name="selector"]').val() + '##' + jQuery(this).find('select[name="reverse_actions"] option:selected').val();
					cl_array += '[end_operator]';
					//CONDITIONS
					cl_array += '[conditions]';
					jQuery(this).find('.get_rule_conditions .the_rule_conditions').each(
						function(index)
							{
							cl_array += '[new_condition]';
								cl_array += '[field]';
									cl_array += jQuery(this).find('.cl_field').attr('data-selected');
								cl_array += '[end_field]';
								cl_array += '[field_condition]';
									cl_array += jQuery(this).find('select[name="field_condition"]').val();
								cl_array += '[end_field_condition]';
								cl_array += '[value]';
									cl_array += jQuery(this).find('input[name="conditional_value"]').val();
								cl_array += '[end_value]';
							cl_array += '[end_new_condition]';
							}
						);
					cl_array += '[end_conditions]';
					//ACTIONS
					cl_array += '[actions]';
					jQuery(this).find('.get_rule_actions .the_rule_actions').each(
						function(index)
							{
							cl_array += '[new_action]';
								cl_array += '[the_action]';
									cl_array += jQuery(this).find('select[name="the_action"]').val();
								cl_array += '[end_the_action]';
								cl_array += '[field_to_action]';
									cl_array += jQuery(this).find('select[name="cla_field"]').attr('data-selected');
								cl_array += '[end_field_to_action]';
								cl_array += '[to_value]';
									cl_array += jQuery(this).find('input[name="action_value_to"]').val();
								cl_array += '[end_to_value]';
							cl_array += '[end_new_action]';
							}
						);
					cl_array += '[end_actions]';				
				cl_array += '[end_rule]';
				}
			);
									
		
		if(jQuery('.set_rules .new_rule').length>0)
			var cl_rule_array = [];
		else
			var cl_rule_array = '';
		
		var cl_actions_array = [];
		var cl_conditions_array = [];
								
		jQuery('.set_rules .new_rule').each(
			function(index)
				{
				var cl_actions_array = [];
				var cl_conditions_array = [];
				
				jQuery(this).find('.get_rule_conditions .the_rule_conditions').each(
					function(index)
						{
						if(jQuery(this).find('.input-group'))
							{
							if(
								(jQuery(this).find('select.cl_field').val() && jQuery(this).find('select.cl_field').val()!='0')
								&&
								(jQuery(this).find('select[name="field_condition"]').val() && jQuery(this).find('select[name="field_condition"]').val()!='0')
								)
								{
								cl_conditions_array.push(
										{
										field_Id: jQuery(this).find('.cl_field option:selected').attr('data-field-id'),
										field_name: jQuery(this).find('.cl_field option:selected').attr('data-field-name'),
										field_type: jQuery(this).find('.cl_field option:selected').attr('data-field-type'),
										condition: jQuery(this).find('select[name="field_condition"]').val(),
										condition_value: jQuery(this).find('input[name="conditional_value"]').val(),
										selected_value: jQuery(this).find('.cl_field').attr('data-selected')
										}
									);
								}
							}
						}
					);
					
					jQuery(this).find('.get_rule_actions .the_rule_actions').each(
						function(index)
							{
							if(jQuery(this).find('.input-group'))
								{
								if(jQuery('#'+ jQuery(this).find('select[name="cla_field"] option:selected').attr('data-field-id')).hasClass('step') && jQuery(this).find('select[name="the_action"]').val()=='show')
										clean_html.find('#'+ jQuery(this).find('select[name="cla_field"] option:selected').attr('data-field-id')).hide().addClass('hidden_by_logic').removeClass('step');
								
								if(jQuery(this).find('select[name="the_action"]').val()=='show')
									{
									clean_html.find('#'+ jQuery(this).find('select[name="cla_field"] option:selected').attr('data-field-id')).hide().addClass('hidden');
									
									}
								if(
									(jQuery(this).find('select[name="cla_field"]').val() && jQuery(this).find('select[name="cla_field"]').val()!='0')
									&&
									(jQuery(this).find('select[name="the_action"]').val() && jQuery(this).find('select[name="the_action"]').val()!='0')
									){
										cl_actions_array.push(
											{
											target_field_Id: jQuery(this).find('select[name="cla_field"] option:selected').attr('data-field-id'),
											target_field_name: jQuery(this).find('select[name="cla_field"] option:selected').attr('data-field-name'),
											target_field_type: jQuery(this).find('select[name="cla_field"] option:selected').attr('data-field-type'),
											do_action: jQuery(this).find('select[name="the_action"]').val(),
											selected_value: jQuery(this).find('select[name="cla_field"]').attr('data-selected'),
											change_value: jQuery(this).find('input[name="action_value_to"]').val()
											
											}
										);	
									}
								}
							
							}
						);
					
				
				if(cl_conditions_array.length>0 && cl_actions_array.length>0)
					{
					cl_rule_array.push(
							{
							operator: jQuery(this).find('select[name="selector"]').val(),
							reverse_actions: jQuery(this).find('select[name="reverse_actions"] option:selected').val(),
							conditions: cl_conditions_array,
							actions: cl_actions_array
							}
						)
					}
				
				}
			);
		
	var product_array = '';
	var paypal_products_array = [];
								
	jQuery('.paypal_products .paypal_product').each(
		function(index)
			{
			//JSON ARRAY
			//To BE USED IN FUTURE UPDATES
			/*paypal_products_array.push(
							{
							item_name: jQuery(this).find('input[name="item_name"]').val(),
							set_quantity: jQuery(this).find('input[name="set_quantity"]').val(),
							item_qty: jQuery(this).find('input[name="item_quantity"]').val(),
							map_item_qty: jQuery(this).find('select[name="map_item_quantity"]').val(),
							set_amount: jQuery(this).find('input[name="set_amount"]').val(),
							item_amount: jQuery(this).find('input[name="item_amount"]').val(),
							map_item_amount: jQuery(this).find('select[name="map_item_amount"]').val()
							}
						);*/
			
			product_array += '[start_product]';
			
				product_array += '[item_name]';
					product_array += jQuery(this).find('input[name="item_name"]').val();
				product_array += '[end_item_name]';
				
				product_array += '[item_qty]';
					product_array += jQuery(this).find('input[name="item_quantity"]').val();
				product_array += '[end_item_qty]';
				
				product_array += '[map_item_qty]';
					product_array += jQuery(this).find('select[name="map_item_quantity"]').val();
				product_array += '[end_map_item_qty]';
				
				product_array += '[set_quantity]';
					product_array += jQuery(this).find('input[name="set_quantity"]').val();
				product_array += '[end_set_quantity]';
				
				product_array += '[item_amount]';
					product_array += jQuery(this).find('input[name="item_amount"]').val();
				product_array += '[end_item_amount]';
				
				product_array += '[map_item_amount]';
					product_array += jQuery(this).find('select[name="map_item_amount"]').val();
				product_array += '[end_map_item_amount]';
				
				product_array += '[set_amount]';
					product_array += jQuery(this).find('input[name="set_amount"]').val();
				product_array += '[end_set_amount]';
														
			product_array += '[end_product]';
			
			
			}
		);		
	jQuery('.current_id').text('');

	var get_multistep_html = jQuery('.nf_ms_breadcrumb');
	
	var multistep_html = get_multistep_html.clone();
	
	if(clean_html.find('.step').length<2)
		multistep_html.find('ol').addClass('hidden');
	
	multistep_html.find('ul.show_all_steps').remove(); 
	multistep_html.find('li.new_step').remove(); 
	multistep_html.find('li').removeClass('current'); 
	multistep_html.find('li').removeClass('visited'); 
	multistep_html.find('li').first().addClass('current');
	multistep_html.find('.bc_settings').remove();
	
	
	var multistep_nav = jQuery('.multi-step-stepping').clone();
	multistep_nav.find('li').removeClass('current');
	multistep_nav.find('li:eq(0)').addClass('current');
	var md_theme = []; 
	md_theme.push(
			{
			theme_name: jQuery('select[name="md_theme_selection"]').val(),
			theme_shade: (jQuery('.workspace_theme_dark').hasClass('active')) ? 'dark' : 'light',
			
			overall_font: jQuery('#google_fonts_overall').attr('data-selected'),
			
			field_spacing: jQuery('#field_spacing').val(),
			
			overall_label_font: jQuery('#google_fonts_lable').attr('data-selected'),
			overall_label_font_size: jQuery('#label_font_size').val(),
			overall_label_align: jQuery('.overall-fields-styling-settings .o-label-text-align.active').attr('data-style-tool'),
			overall_label_color: jQuery('.o-label-color').val(),
			overall_label_bold: (jQuery('.o-label-bold').hasClass('active')) ? 'bold' : 'not-bold',
			overall_label_italic: (jQuery('.o-label-italic').hasClass('active')) ? 'italic' :'not-italic',
			overall_label_underline: (jQuery('.o-label-underline').hasClass('active')) ? 'underline' : 'not-underline',
			overall_input_font: jQuery('#google_fonts_input').attr('data-selected'),
			overall_input_font_size: jQuery('#input_font_size').val(),
			overall_input_align: jQuery('.overall-fields-styling-settings .o-input-text-align.active').attr('data-style-tool'),
			overall_input_color: jQuery('.o-input-color').val(),
			overall_input_bg_color: jQuery('.o-input-bg-color').val(),
			overall_input_border_color: jQuery('.o-input-border-color').val(),
			overall_input_bold: (jQuery('.o-input-bold').hasClass('active')) ? 1 : 0,
			overall_input_italic: (jQuery('.o-input-italic').hasClass('active')) ? 1 : 0,
			overall_input_underline: (jQuery('.o-input-underline').hasClass('active')) ? 1 : 0,
			overall_field_layout: jQuery('.overall-fields-styling-settings .set_layout.active').attr('data-style-tool'),
			overall_field_corners: jQuery('.overall-fields-styling-settings .overall-input-corners .btn.active').attr('data-style-tool'),
			overall_icon_font_size: jQuery('#icon_font_size').val(),
			overall_icon_color: jQuery('.o-icon-text-color').val(),
			overall_icon_bg_color: jQuery('.o-icon-bg-color').val(),
			overall_icon_border_color: jQuery('.o-icon-brd-color').val(),
			overall_field_errors: jQuery('.overall-fields-styling-settings .overall-error-style .btn.active').attr('data-style-tool'),
			overall_field_errors_pos: jQuery('.overall-fields-styling-settings .overall-error-position .btn.active').attr('data-style-tool'),
			
			
			msg_hide_form:jQuery('.msg_hide_form').attr('data-value'),
			msg_position:jQuery('.msg_position').attr('data-value'),
			msg_placement:jQuery('.msg_placement').attr('data-value'),
			
			
			loader_type:jQuery('.loader-type').attr('data-value'),
			loader_color:jQuery('.loader-color').attr('data-value'),
			}
		);
	
	var multistep_settings = [];	
	multistep_settings.push(
			{
			multi_step_total: jQuery('.nex-forms-container .form_field.step').length,
			multi_step_stepping:multistep_nav.html(),
			multi_step_transition_in:jQuery('select#step_in_transition_animation').attr('data-selected'), 
			multi_step_transition_out:jQuery('select#step_out_transition_animation').attr('data-selected'), 
			multi_step_back_disabled: jQuery('.disable_back').attr('data-value'),
			breadcrumb_list:jQuery('.nf_ms_breadcrumb ul').html(),
			breadcrumb_type:jQuery('.nf_ms_breadcrumb ul').attr('data-breadcrumb-type'),
			text_pos: jQuery('.nf_ms_breadcrumb ul').attr('data-text-pos'),
			crumb_align: jQuery('.nf_ms_breadcrumb ul').attr('data-align-crumb'),
			bc_position: jQuery('.bc_position').attr('data-value'),
			data_theme: jQuery('.nf_ms_breadcrumb ul').attr('data-theme'),
			show_front_end: jQuery('.nf_ms_breadcrumb ul').attr('data-show-front-end'),
			show_inside: jQuery('.nf_ms_breadcrumb ul').attr('data-show-inside'),
			scroll_to_top: jQuery('.nf_step_scroll_top').text(),
			form_width_pixels: jQuery('.ui-nex-forms-container').attr('data-width-pixels'),
			form_width_percentage: jQuery('.ui-nex-forms-container').attr('data-width-percentage'),
			form_width_unit: jQuery('.ui-nex-forms-container').attr('data-width-unit'),
			msg_width_pixels: jQuery('.nex-forms-msg-container').attr('data-width-pixels'),
			msg_width_percentage: jQuery('.nex-forms-msg-container').attr('data-width-percentage'),
			msg_width_unit: jQuery('.nex-forms-msg-container').attr('data-width-unit'),
			//BC 2.0
			bc_gutter: jQuery('#bc-gutter').val(),
			bc_folded: jQuery('.bc_folded').attr('data-value'),
			bc_connected: jQuery('.bc_connected').attr('data-value'),
			bc_style: jQuery('.bc_style_selection').attr('data-selected'),
			bc_css: jQuery('.nf_ms_breadcrumb').attr('style'),
			bc_converted: 1,
			//TIMER SETTINGS
			add_timer: jQuery('.add-timer').attr('data-value'),
			timer_add_to: jQuery('.timer-add-to').attr('data-value'),
			timer_type: jQuery('.timer-type').attr('data-value'),
			enabled_units: jQuery('.enabled_units').attr('data-value'),
			timer_size: jQuery('.timer-size').attr('data-value'),
			timer_position: jQuery('.timer-position').attr('data-value'),
			timer_align: jQuery('.timer-align').attr('data-value'),
			timer_animation: jQuery('.timer-animation').attr('data-value'),
			timer_hours: (jQuery('#timer_hours').val()) ? jQuery('#timer_hours').val() : 0,
			timer_minutes: (jQuery('#timer_minutes').val()) ? jQuery('#timer_minutes').val() : 0,
			timer_seconds: (jQuery('#timer_seconds').val()) ? jQuery('#timer_seconds').val() : 0,
			timer_hours_label: (jQuery('#timer_hours_label').val()) ? jQuery('#timer_hours_label').val() : '',
			timer_minutes_label: (jQuery('#timer_minutes_label').val()) ? jQuery('#timer_minutes_label').val() : '',
			timer_seconds_label: (jQuery('#timer_seconds_label').val()) ? jQuery('#timer_seconds_label').val() : '',
			timer_hours_color: (jQuery('#timer_hours_color').val()) ? jQuery('#timer_hours_color').val() : '',
			timer_minutes_color: (jQuery('#timer_minutes_color').val()) ? jQuery('#timer_minutes_color').val() : '',
			timer_seconds_color: (jQuery('#timer_seconds_color').val()) ? jQuery('#timer_seconds_color').val() : '',
			timer_direction: (jQuery('.timer-direction').attr('data-value')),
			timer_wrapper_css: jQuery('.timer-inner-container').attr('style'),
			timer_text_color: (jQuery('#timer_text_color').val()) ? jQuery('#timer_text_color').val() : '#888',
			timer_inner_circle_color: (jQuery('#timer_inner_circle_color').val()) ? jQuery('#timer_inner_circle_color').val() : '#aaa',
			timer_bg_width: (jQuery('#timer_bg_width').val()) ? jQuery('#timer_bg_width').val() : 0.1,
			timer_fg_width: (jQuery('#timer_fg_width').val()) ? jQuery('#timer_fg_width').val() : 0.05,
			timer_start: (jQuery('#timer_start').val()) ? jQuery('#timer_start').val() : 0,
			timer_end: (jQuery('#timer_end').val()) ? jQuery('#timer_end').val() : 0,
			}
		);
	var option_settings = [];	
	option_settings.push(
			{
			save_form_progress:jQuery('input[name="save_form_progress"]:checked').val(),
			submit_limit:jQuery('input[name="submit_limit"]').val(),
			submit_limit_msg:jQuery('textarea[name="submit_limit_msg"]').val(),
			send_admin_email:(jQuery('input[name="send_admin_email"]:checked').val()) ? jQuery('input[name="send_admin_email"]:checked').val() : 'true',
			before_submit_js:(js_editor_before.codemirror.getValue()) ? js_editor_before.codemirror.getValue() : 'return true;',
			after_submit_js:(js_editor_after.codemirror.getValue()) ? js_editor_after.codemirror.getValue() : 'return true;',
			save_to_db:jQuery('input[name="save_to_db"]:checked').val(),
			}
		);
	
	var upload_settings = [];	
	upload_settings.push(
			{
			upload_to_server:jQuery('input[name="upload_to_server"]:checked').val(),
			}
		);
	
	var attachment_settings = [];	
	attachment_settings.push(
			{
			attach_to_user_email:jQuery('input[name="attach_to_user_email"]:checked').val(),
			attach_to_admin_email:jQuery('input[name="attach_to_admin_email"]:checked').val(),
			}
		);
		
	var take_action = 'nf_insert_record';
	
	if(jQuery('#form_update_id').text() || form_id)
		take_action = 'nf_update_record'
	if(form_status == 'preview')
		take_action = 'preview_nex_form'
	if(form_status == 'draft')
		take_action = 'nf_update_draft'
	var active_mail_subscriptions = '';
		
	if(jQuery('input[name="mc_integration"]:checked').val()=='1')
		active_mail_subscriptions += 'mc,';
	if(jQuery('input[name="gr_integration"]:checked').val()=='1')
		active_mail_subscriptions += 'gr,';
	if(jQuery('input[name="mp_integration"]:checked').val()=='1')
		active_mail_subscriptions += 'mp,';
	if(jQuery('input[name="ms_integration"]:checked').val()=='1')
		active_mail_subscriptions += 'ms,';
		
	 var pdf_attachements = '';
	if(jQuery('input[name="pdf_admin_attach"]:checked').val()=='1')
		pdf_attachements += 'admin,';
	if(jQuery('input[name="pdf_user_attach"]:checked').val()=='1')
		pdf_attachements += 'user,';
		
	 var email_on_payment_success = '';
	if(jQuery('input[name="email_on_payments"]:checked').val()=='1')
		email_on_payment_success += 'payments,';
	if(jQuery('input[name="email_on_failures"]:checked').val()=='1')
		email_on_payment_success += 'failures,';
	if(jQuery('input[name="email_before_payments"]:checked').val()=='1')
		email_on_payment_success += 'before_payments,';
	
	jQuery( ".ui-nex-forms-container .jq-radio-group input" ).checkboxradio();
	jQuery( ".ui-nex-forms-container .jq-check-group input" ).checkboxradio();

	jQuery('.ui-nex-forms-container .jq-datepicker input').datepicker();

	jQuery('input[name="nex_autoresponder_recipients"]').trigger('change');
	jQuery('input[name="nex_autoresponder_from_address"]').trigger('change')
	jQuery('input[name="nex_autoresponder_from_name"]').trigger('change')
	
	var inc_math 			= 'false';
	var inc_datepicker 		= 'false';
	var inc_touchspin 		= 'false';
	var inc_raty 			= 'false';
	var inc_slider 			= 'false';
	var inc_autocomplete 	= 'false';
	var inc_sigs		 	= 'false';
	var inc_tags		 	= 'false';
	var inc_mask		 	= 'false';
	
	if(clean_html.find('.date.special_fields').attr('class') || clean_html.find('.time.special_fields').attr('class'))
		inc_datepicker 	= 'true';
	
	if(clean_html.find('.digital-signature').attr('class'))
		inc_sigs = 'true';	
		
	if(clean_html.find('.tags.special_fields').attr('class'))
		inc_tags = 'true';
	
	if(clean_html.find('.touch_spinner').attr('class'))
		inc_touchspin = 'true';	
		
	if(clean_html.find('.star-rating').attr('class'))
		inc_raty = 'true';
	
	if(clean_html.find('.slider.special_fields').attr('class') || clean_html.find('.md-slider.special_fields').attr('class'))
		inc_slider = 'true';
	
	if(clean_html.find('.autocomplete.special_fields').attr('class'))
		inc_autocomplete = 'true';
	 
	clean_html.find('input[data-input-mask]').each(
		function()
			{
			if(jQuery(this).attr('name'))
				inc_mask = 'true';
			}
		);
	
	clean_html.find('.html_fields').each(
		function()
			{
			if(jQuery(this).find('.the_input_element').attr('data-math-equation'))
				inc_math = 'true';
			}
		);
	
	var enqueue_array = [];	
	enqueue_array.push(
			{
			is_inc_math:inc_math,
			is_inc_datepicker:inc_datepicker,
			is_inc_touchspin:inc_touchspin,
			is_inc_raty:inc_raty,
			is_inc_slider:inc_slider,
			is_inc_autocomplete:inc_autocomplete,
			is_inc_sigs:inc_sigs,
			is_inc_tags:inc_tags,
			is_inc_mask:inc_mask,
			}
		);
	
	var data =
		{
		action	 							: take_action,
		_wpnonce							: jQuery('#_wpnonce').text(),
		table								: 'wap_nex_forms',
		edit_Id								: (form_id) ? form_id : jQuery('#form_update_id').text().trim(),
		plugin								: 'shared',
		title								: jQuery('#form_name').val(),
		form_fields							: admin_html.html(),
		clean_html							: clean_html.html(),
		is_form								: form_status,
		is_template							: '0',
		post_type							: jQuery('input[name="form_post_method"]:checked').val(),
		post_action							: jQuery('input[name="form_post_action"]:checked').val(),
		custom_url							: jQuery('#on_form_submission_custum_url').val(),
		mail_to								: jQuery('input[name="nex_autoresponder_recipients"]').val(),
		reply_to							: jQuery('input[name="nex_admin_reply_to"]').val(),
		from_address						: jQuery('input[name="nex_autoresponder_from_address"]').val(),
		from_name							: jQuery('input[name="nex_autoresponder_from_name"]').val(),
		on_screen_confirmation_message		: clean_success_html.html(),
		on_screen_confirmation_message_admin : clean_success_admin_html.html(),
		google_analytics_conversion_code	: jQuery('#google_analytics_conversion_code').val(),
		confirmation_page					: jQuery('#nex_autoresponder_confirmation_page').val(),
		user_email_field					: jQuery('#nex_autoresponder_user_email_field').attr('data-selected'),
		confirmation_mail_subject			: jQuery('#nex_autoresponder_confirmation_mail_subject').val(),
		user_confirmation_mail_subject		: jQuery('#nex_autoresponder_user_confirmation_mail_subject').val(),
		confirmation_mail_body				:  jQuery('#user_email_body_content').val(),
		on_form_submission					: jQuery('input[name="on_form_submission"]:checked').val(),
		form_hidden_fields					: (form_hidden_fields.length>0) ? form_hidden_fields : '',
		hidden_fields						: (form_hidden_fields.length>0) ? form_hidden_fields : '',
		conditional_logic					: cl_array,
		conditional_logic_array				: cl_rule_array,
		admin_email_body					: jQuery('#admin_email_body_content').val(),
		bcc									: jQuery('#nex_admin_bcc_recipients').val(),
		bcc_user_mail						: jQuery('#nex_autoresponder_bcc_recipients').val(),
		custom_css							: (css_editor.codemirror.getValue()) ? css_editor.codemirror.getValue() : '',
		is_paypal							: jQuery('input[name="go_to_paypal"]:checked').val(),
		form_type							: jQuery('.form_attr .form_type').text(),
		draft_Id							: 0,
		products							: product_array,
		currency_code						: (jQuery('.paypal-column select[name="currency_code"]').val()) ? jQuery('.paypal-column select[name="currency_code"]').val() : 'USD',
		business							: jQuery('.paypal-column input[name="business"]').val(),
		paypal_client_Id					: jQuery('.paypal-column input[name="paypal_client_Id"]').val(),
		paypal_client_secret				: jQuery('.paypal-column input[name="paypal_client_secret"]').val(),
		payment_success_msg					: jQuery('.paypal-column textarea[name="payment_success_msg"]').val(),
		payment_failed_msg					: jQuery('.paypal-column textarea[name="payment_failed_msg"]').val(),
		email_on_payment_success			: email_on_payment_success,
		cmd									: '_cart',
		return_url							: jQuery('.paypal-column input[name="return"]').val(),
		cancel_url							: jQuery('.paypal-column input[name="cancel_url"]').val(),
		lc									: (jQuery('.paypal-column select[name="paypal_language_selection"]').val()) ? jQuery('.paypal-column select[name="paypal_language_selection"]').val() : 'US',
		environment							: jQuery('input[name="paypal_environment"]:checked').val(),
		mc_field_map						: mc_field_map,
		mc_list_id							: jQuery('select[name="mail_chimp_lists"]').attr('data-selected'),
		gr_field_map						: gr_field_map,
		gr_list_id							: jQuery('select[name="get_response_lists"]').attr('data-selected'),
		mp_field_map						: mp_field_map,
		mp_list_id							: jQuery('select[name="mailpoet_lists"]').attr('data-selected'),
		ms_field_map						: ms_field_map,
		ms_list_id							: jQuery('select[name="mailster_lists"]').attr('data-selected'),
		email_subscription					: active_mail_subscriptions,
		pdf_html							: jQuery('#pdf_html').val(),
		attach_pdf_to_email					: pdf_attachements,
		form_to_post_map					: ftp_field_map,
		is_form_to_post						: jQuery('.ftp_reponse_setup input[name="ftp_integration"]:checked').val(),
		md_theme							: md_theme,
		form_theme							: jQuery('.set_form_theme').attr('data-selected'),
		jq_theme							: jQuery('.choose_form_theme').attr('data-selected'),
		form_style							: jQuery('.nex-forms-container').attr('style'),
		msg_style							: jQuery('.nex-forms-msg-container').attr('style'),
		multistep_settings					: multistep_settings,
		multistep_html						: multistep_html.html(),
		upload_settings						: upload_settings,
		attachment_settings					: attachment_settings,
		option_settings						: option_settings,
		enqueue_array						: enqueue_array,
		zapier_web_hook_url					: jQuery('input[name="zapier_web_hook_url"]').val()
		};
		if(clicked_obj)
			{
			if(clicked_obj.hasClass('is_template'))
				{
				data.is_form = '0';
				data.is_template = '1';
				data.action = 'nf_insert_record';
				
				if(jQuery('#form_type').text()=='template')
					{
					data.action = 'nf_update_record';	
					}
				
				var is_template = '1';
				}
			}
		else
			{
			if(jQuery('#form_type').text()=='template')
				{
				data.action = 'nf_insert_record';	
				}
			
			data.is_template = '0';
			var is_template = '0';
			}
	
	jQuery('.form_preview_loader').show();
	
	if(clicked_obj)
		clicked_obj.html();
	
	clearTimeout(timer);				
	jQuery.post
		(
		ajaxurl, data, function(response)
			{
			jQuery('.ns').remove();
			
			
			
			
			
			
			if(form_status=='preview')
				{
				jQuery('.show_form_preview').attr('src',jQuery('.admin_url').text() + '/admin.php?page=nex-forms-preview&form_Id='+response);
				if(clicked_obj)
					clicked_obj.html(text_before_save);	
					
				setTimeout(
						function()
							{
							jQuery('.form_preview_loader').hide();
							
							}
							,300
						);
				jQuery('div.clean_html').html('');	
				}
			else
				{
				jQuery('div.clean_html').html('');
				jQuery('div.admin_html').html('');
				
				
					if(is_template=='1')
						{
						popup_user_alert('Template Saved');
						jQuery('.save_nex_form.is_template').removeClass('saving').html('Update Template');
						}
					else
						{
						if(jQuery('#form_update_id').text())
							{
							if(jQuery('#form_type').text()=='template')
								{
								popup_user_alert('New Form Created');
								jQuery('.save_nex_form.is_template').removeClass('saving').html('Save as template');
								}
							else
								{
								jQuery('.prime_save').removeClass('saving');
								jQuery('.prime_save').parent().addClass('flip_btn');
								
								jQuery('.prime_save').html('<span class="top-icon fas fa-save"></span><span class="menu-text">SAVED!</span>');
								
								setTimeout(function(){ jQuery('.prime_save').html('<span class="top-icon fas fa-save"></span><span class="menu-text">SAVE</span>'); //jQuery('.prime_save').removeClass('flip_btn'); 
								},2000);
								
								}
							}
						else
							{
							popup_user_alert('New Form Created');
							jQuery('.prime_save').html('<span class="fa fa-floppy-o"></span>&nbsp;&nbsp;UPDATE');
							}
						}
									
				if(response)
					{
					if(!is_template || is_template==0 || form_status!='draft')
						{
						jQuery('#form_update_id').text(response.trim())
						
						}
					jQuery('.check_save').removeClass('not_saved');
					}
				}
			}
		);		
}

function nf_cleanup_admin_html(admin_html)
	{
	admin_html.find('.icon-select').each(
		function(){
			var get_tip = jQuery(this).find('span').attr('data-original-title');
			if(get_tip)
				{
				get_tip = get_tip.replace(/(<([^>]+)>)/ig," ")
				jQuery(this).find('span').attr('data-original-title', get_tip);
				}
			var get_title = jQuery(this).find('span').attr('title');
			if(get_title)
				{
				get_title = get_title.replace(/(<([^>]+)>)/ig," ")
				jQuery(this).find('span').attr('title', get_title);
				}
		}
	);
	admin_html.find('.batch_edit').removeClass('batch_edit_sim');
	admin_html.find('.batch_edit').removeClass('batch_edit');
	admin_html.find('.change_image').remove();
	admin_html.find('.bootstrap-datetimepicker-widget').remove();
	admin_html.find('.change_image2').remove();
	admin_html.find('.c_logic_field_type').remove();
	admin_html.find('.adv_arrow').remove();
	admin_html.find('.adv_target').remove();
	admin_html.find('.cl_arrow').remove();
	admin_html.find('.currently_editing_field').removeClass('currently_editing_field');
	admin_html.find('.edit-done').remove();
	admin_html.find('.currently_editing_settings').remove();
	admin_html.find('.grid-width-slider').remove();
	admin_html.find('.column_tools').remove();
	admin_html.find('.the-image-container .ui-resizable-handle').remove();
	admin_html.find('.the-image-container img').unwrap();
	admin_html.find('.form_field.field_spacer .ui-resizable-handle').remove();
	admin_html.find('.form_field.field_spacer').attr('class','form_field field_spacer');
	admin_html.find('.form_field').css('visibility','');
	admin_html.find('.form_field').css('display','');
	admin_html.find('.btn-lg.move_field').remove();
	admin_html.find('#slider').html('');
	admin_html.find('#slider').html('');
	admin_html.find('.the-thumb').removeClass('text-danger').removeClass('text-success').removeClass('checked');
	admin_html.find('.js-signature canvas').remove();
	admin_html.find('#star' ).html('');
	admin_html.find('.bootstrap-touchspin-postfix').remove();
	admin_html.find('.bootstrap-touchspin .input-group-btn').remove();
	admin_html.find('.bootstrap-touchspin .input-group-btn-vertical').remove();
	admin_html.find('.bootstrap-tagsinput').remove();
	admin_html.find('#spinner').unwrap();
	admin_html.find('.bootstrap-tagsinput').remove();
	admin_html.find('.popover').remove();
	admin_html.find('div.cd-dropdown').remove();
	admin_html.find('.form_field').removeClass('edit-field').removeClass('currently_editing');
	admin_html.find('.bootstrap-select').remove();
	admin_html.find('.popover').remove();
	admin_html.find('.step').removeClass('active_step');
	admin_html.find('.step').hide()
	admin_html.find('.step').first().show();	
	
	return admin_html;
	}

function nf_cleanup_ui_html(ui_html)
	{
		
	
		ui_html.find('.the-thumb-image').each(
			function(){
				jQuery(this).attr('alt',jQuery(this).closest('label.radio-inline').find('.image-choices-choice-text').text());				
			}
		);
	ui_html.find('.icon-select').each(
		function(){
			var get_tip = jQuery(this).find('span').attr('data-original-title');
			if(get_tip)
				{
				get_tip = get_tip.replace(/(<([^>]+)>)/ig," ")
				jQuery(this).find('span').attr('data-original-title', get_tip);
				}
			var get_title = jQuery(this).find('span').attr('title');
			if(get_title)
				{
				get_title = get_title.replace(/(<([^>]+)>)/ig," ")
				jQuery(this).find('span').attr('title', get_title);
				}
		}
	);
	ui_html.find('.form_field').removeAttr('data-settings');
	ui_html.find('.form_field').removeAttr('data-settings-tabs');
	ui_html.find('.batch_edit').removeClass('batch_edit_sim');
	ui_html.find('.batch_edit').removeClass('batch_edit');
	
	ui_html.find('.change_thumb').remove();
	ui_html.find('.bootstrap-datetimepicker-widget').remove();
	ui_html.find('.form_field.date input').removeAttr('value');
	ui_html.find('.c_logic_field_type').remove();
	ui_html.find('.cl_arrow').remove();
	ui_html.find('.adv_arrow').remove();
	ui_html.find('.adv_target').remove();
	
	ui_html.find('.the-image-container .ui-resizable-handle').remove();
	ui_html.find('.the-image-container img').unwrap();
	ui_html.find('.the-image-container .show-width').remove();
	ui_html.find('.the-image-container .show-height').remove();
	ui_html.find('.the-image-container .change_image').remove();
	ui_html.find('.the-image-container .change_image2').remove();
	
	
	ui_html.find('.the-image-container img').unwrap();
	ui_html.find('.field_settings').remove();
	ui_html.find('.currently_editing_settings').remove();
	ui_html.find('.column_tools').remove();
	ui_html.find('.grid-width-slider').remove();
	ui_html.find('.field_spacer .field_spacer').html('');
	ui_html.find('.field_spacer').attr('class','field_spacer');
	ui_html.find('.form_field').css('visibility','');
	ui_html.find('.form_field').css('display','');
	ui_html.find('.btn-lg.move_field').remove();
	ui_html.find('#star' ).raty('destroy');	
	ui_html.find('.the-thumb').removeClass('text-danger').removeClass('text-success').removeClass('checked');
	ui_html.find('.js-signature canvas').remove();	
	ui_html.find('.zero-clipboard, div.ui-nex-forms-container .field_settings').remove();
	ui_html.find('.grid').removeClass('grid-system')		
	ui_html.find('.editing-field-container').removeClass('.editing-field-container')
	ui_html.find('.bootstrap-touchspin-prefix').remove();
	ui_html.find('.bootstrap-touchspin-postfix').remove();
	ui_html.find('.bootstrap-touchspin .input-group-btn').remove();
	ui_html.find('.bootstrap-touchspin .input-group-btn-vertical').remove();
	ui_html.find('.bootstrap-tagsinput').remove();
	ui_html.find('#spinner').unwrap();
	ui_html.find('.editing-field').removeClass('editing-field')
	ui_html.find('.editing-field-container').removeClass('.editing-field-container')
	ui_html.find('div.trash-can').remove();
	ui_html.find('div.draggable_object').hide();
	ui_html.find('div.draggable_object').remove();
	ui_html.find('div.form_field').removeClass('field').removeClass('currently_editing');
	ui_html.find('.zero-clipboard').remove();
	ui_html.find('.tab-pane').removeClass('tab-pane');	
	ui_html.find('.help-block.hidden, .is_required.hidden').remove();
	ui_html.find('.has-pretty-child, .slider').removeClass('svg_ready')
	ui_html.find('.input-group').removeClass('date');
	ui_html.find('.popover').remove();
	ui_html.find('.the_input_element, .row, .svg_ready, .radio-inline').each(
		function()
			{
			if(!jQuery(this).closest('.form_field').hasClass('image-choices-field'))
				{
				if(jQuery(this).parent().hasClass('input-inner') || jQuery(this).parent().hasClass('input_holder')){
					jQuery(this).unwrap();
					}	
				}
			}
		);
	
	ui_html.find('div').each(
		function()
			{
			if(!jQuery(this).closest('.form_field').hasClass('image-choices-field'))
				{
				if(jQuery(this).parent().hasClass('svg_ready') || jQuery(this).parent().hasClass('form_object') || jQuery(this).parent().hasClass('input-inner')){
					jQuery(this).unwrap();
					}
				}
			}
		);
	ui_html.find('div.form_field').each(
		function()
			{
			
			
			if(jQuery(this).hasClass('paragraph') || jQuery(this).hasClass('heading') || jQuery(this).hasClass('html') || jQuery(this).hasClass('math_logic'))
				{
				if(jQuery(this).find('.the_input_element').attr('data-original-math-equation')!='')
					{
					var text = jQuery(this).find('.the_input_element').html();
					if(text)
						{
						var set_text = text.replace('{math_result}','<span class="math_result">0</span>');
						jQuery(this).find('.the_input_element').html(set_text);
						}
					}
				}
			
			
			/*if(!jQuery(this).hasClass('material_field')){ 
				jQuery(this).find('#field_container').unwrap();
				jQuery(this).find('#field_container .row').unwrap('#field_container');
			}*/
				
			if(jQuery(this).parent().parent().hasClass('panel-default') && !jQuery(this).parent().prev('div').hasClass('panel-heading')){
				jQuery(this).parent().unwrap();
				jQuery(this).unwrap();
				}
			}

		);
		
	ui_html.find('.help-block').each(
		function()
			{
			if(!jQuery(this).text())
				jQuery(this).remove()
			}
		);
	ui_html.find('.sub-text').each(
		function()
			{
			if(jQuery(this).text()=='')
				{
				jQuery(this).parent().find('br').remove()
				jQuery(this).remove();
				}
			}
		);
	ui_html.find('.label_container').each(
		function()
			{
			if(jQuery(this).css('display')=='none')
				{
				jQuery(this).remove()
				}
			}
		);
	ui_html.find('.ui-draggable').removeClass('ui-draggable');
	ui_html.find('.ui-draggable-handle').removeClass('ui-draggable-handle')
	ui_html.find('.dropped').removeClass('dropped')
	ui_html.find('.ui-sortable-handle').removeClass('ui-sortable-handle');
	ui_html.find('.ui-sortable').removeClass('ui-sortable-handle');
	ui_html.find('.ui-droppable').removeClass('ui-sortable-handle');
	ui_html.find('.over').removeClass('ui-sortable-handle');
	ui_html.find('.the_input_element.bs-tooltip').removeClass('bs-tooltip') 
	ui_html.find('.bs-tooltip.glyphicon').removeClass('glyphicon');
	ui_html.find('.grid-system.panel').removeClass('panel-body');
	ui_html.find('.grid-system.panel').removeClass('panel');
	ui_html.find('.form_field.grid').removeClass('grid').removeClass('form_field').addClass('is_grid');
	ui_html.find('.grid-system').removeClass('grid-system');
	ui_html.find('.move_field').remove();
	ui_html.find('.input-group-addon.btn-file span').attr('class','fa fa-cloud-upload');
	//ui_html.find('.input-group-addon.fileinput-exists span').attr('class','fa fa-close');
	ui_html.find('.input-group-addon.fileinput-exists span').remove();
	ui_html.find('.input-group-addon.fileinput-exists').prepend('<span class="fu-text">X</span>');
	ui_html.find('.checkbox-inline').addClass('radio-inline');
	ui_html.find('.check-group').addClass('radio-group');
	ui_html.find('.submit-button small.svg_ready').remove();
	ui_html.find('.radio-group a, .check-group a').addClass('ui-state-default')
	ui_html.find('.is_grid .panel-body').removeClass('ui-widget-content');
	ui_html.find('.bootstrap-select.ui-state-default').removeClass('ui-state-default');
	ui_html.find('.selectpicker, .dropdown-menu.the_input_element').addClass('ui-state-default');
	ui_html.find('.selectpicker').removeClass('dropdown-toggle')
	ui_html.find('.is_grid .panel-body').removeClass('ui-widget-content');
	ui_html.find('.bootstrap-select.ui-state-default').removeClass('ui-state-default');
	ui_html.find('.is_grid .panel-body').removeClass('ui-sortable').removeClass('ui-droppable').removeClass('ui-widget-content').removeClass('');
	ui_html.find('.step').hide()
	ui_html.find('.step').first().show();
	ui_html.find('.step').removeClass('active_step');
	ui_html.find('.is_grid').css('z-index','');	
	
	
	ui_html.find('.form_field').each(
		function()
			{
			
			
				
			
			var obj = jQuery(this);
			
			
			
			
			
			
			if(!obj.hasClass('tags') && !obj.hasClass('autocomplete') && !obj.hasClass('touch_spinner') && !obj.hasClass('star-rating') && !obj.hasClass('upload_fields') && !obj.hasClass('paragraph') && !obj.hasClass('heading') && !obj.hasClass('divider') && !obj.hasClass('image-choices-field') && !obj.hasClass('radio-group') && !obj.hasClass('check-group') ){
				if(obj.find('label').attr('class') && !obj.find('.the_input_element').parent().hasClass('icon-holder'))
					{
					if(obj.find('label'))
						{
						obj.find('label').attr('for','input_'+obj.attr('id'));
						if(!obj.find('input.the_input_element').attr('id'))
							{
							obj.find('input.the_input_element').attr('id','input_'+obj.attr('id'));
							}
						
						if(!obj.find('textarea.the_input_element').attr('id'))
							{
							obj.find('textarea.the_input_element').attr('id','input_'+obj.attr('id'));
							}
							
						if(!obj.find('select.the_input_element').attr('id'))
							{
							obj.find('select.the_input_element').attr('id','input_'+obj.attr('id'));
							}
						
						}
					}
			}
			
			obj.find('input').each(
				function()
					{
					jQuery(this).attr('autocomplete','enabled');
					if(!jQuery(this).attr('id'))
						{
						jQuery(this).attr('id', obj.attr('id')+'__'+jQuery(this).attr('name'))	
						}
					}
				);
			
			
			if(obj.hasClass('touch_spinner')){
				
					obj.find('label').attr('for','input_'+obj.attr('id'));
					if(obj.find('.the_input_element').attr('id')=='spinner')
						obj.find('.the_input_element').attr('id','input_'+obj.attr('id'));
					
			}
			
			if(obj.hasClass('autocomplete')){
				
					obj.find('label').attr('for','input_'+obj.attr('id'));
					if(obj.find('.the_input_element').attr('id')=='autocomplete')
						obj.find('.the_input_element').attr('id','input_'+obj.attr('id'));
					
			}
			
			if(obj.hasClass('tags')){
				
					obj.find('label').attr('for','input_'+obj.attr('id'));
					if(obj.find('.the_input_element').attr('id')=='tags')
						obj.find('.the_input_element').attr('id','input_'+obj.attr('id'));
					
			}
			
			if(obj.hasClass('upload_fields')){
				
					obj.find('label').attr('for','input_'+obj.attr('id'));
					if(!obj.find('input.the_input_element').attr('id'))
						obj.find('input.the_input_element').attr('id','input_'+obj.attr('id'));
					
			}
			
			/*if(obj.hasClass('icon-select-group'))
				{
				obj.find('.icon-holder').each(
				function()
					{
					var the_input = jQuery(this).find('input');
					var set_id = jQuery(this).attr('data-icon-number')+' '+jQuery('#form_update_id').text() +'_'+ obj.attr('id') + '_' + jQuery(this).find('input').attr('name');
					
					the_input.attr('id',set_id);
					
					jQuery(this).find('input').wrap('<label class="icon-holder-label" for="'+ set_id +'"><input id="'+ set_id +'" class="'+ the_input.attr('class') +'" type="'+ the_input.attr('type') +'" name="'+ the_input.attr('name') +'" value="'+ the_input.attr('value') +'" style="'+ the_input.attr('style') +'" autocomplete="enabled"><div class="ss-label">'+ jQuery(this).find('.off-label').html() +'</div></label>');	
					
					}
				);
					
				}*/
			
			
			
			obj.find('.the-radios label').each(
			function()
				{
				var label = jQuery(this);
					var field = jQuery(this).closest('.form_field');
					var input = jQuery(this).find('input');
					input.attr('autocomplete','enabled');
					var set_id = '__'+jQuery('#form_update_id').text() +'_'+ field.attr('id')+ '_'+input.attr('name')+'_'+input.attr('value')+'_'+format_illegal_chars(jQuery(this).find('.input-label').text());
					label.attr('for',set_id);
					input.attr('id',set_id);
				}
			);
			
			
			obj.find('.the-radios a').each(
			function()
				{
				jQuery(this).attr('rel','nofollow');
				jQuery(this).attr('href','#');
				jQuery(this).text('.');
				}
			);
			
			if(obj.find('.input-group-addon.prefix').length>0)
				obj.addClass('has_prefix_icon');
			else
				obj.removeClass('has_prefix_icon');
				
				
			if(obj.find('.input-group-addon.postfix').length>0)
				obj.addClass('has_postfix_icon');
			else
				obj.removeClass('has_postfix_icon');
				
					
			ui_html.find('.customcon').each(
					function()
						{
						if(obj.attr('id')==jQuery(this).attr('data-target') && (jQuery(this).attr('data-action')=='show' || jQuery(this).attr('data-action')=='slideDown' || jQuery(this).attr('data-action')=='fadeIn'))
							ui_html.find('#'+obj.attr('id')).hide();
						}
					);
				}
			);
	
	
	return ui_html;
	}
