'use strict';

var current_style_tool = '';
var current_field = '';
var current_id = '';
var label_container = '';
var input_container = '';
var input_element = '';
var selectable_area='', x1 = 0, y1 = 0, x2 = 0, y2 = 0;
var hit_list = '';
var selectable_timer = 0;
var selectable_time_passed = 0;

var batch_selection_array = new Array();
var batch_selection_array_originals = new Array();

function run_selecatble_counter(){
	selectable_timer = setTimeout(function()	
		{
			run_selecatble_counter();
		},1
		);
	selectable_time_passed++;
}

jQuery(window).bind('keydown', 
	function(event)
		{
		var form_focus = true;
		
		if ((event.ctrlKey || event.metaKey) && !event.shiftKey)
				{
				switch (String.fromCharCode(event.which).toLowerCase())
					{
					case 's':
						event.preventDefault();
						jQuery('.save_nex_form.prime_save').trigger('click');
					break;
					}
				}
			
		
		jQuery('input').each(
			function()
				{
				if(jQuery(this).is(':focus'))
					form_focus = false;	
				}
			);
		jQuery('textarea').each(
			function()
				{
				if(jQuery(this).is(':focus'))
					form_focus = false;	
				}
			);
		if(jQuery('.form_canvas').hasClass('out-of-focus'))
			form_focus = false;	
			
			
		//DISABLE TAB		
		
		
		if(!jQuery('a.canvas_view').hasClass('active'))
			form_focus = false;
		
		if(!jQuery('a.canvas_view').parent().hasClass('current'))
			form_focus = false;
		
		if(form_focus)
			{
			//DELETE
			//console.log(event.which);
			
			if(event.which=='9')
				event.preventDefault();
		
			if(event.which=='27')
				{
				jQuery('.settings-column-style #close-settings').trigger('click');	
				jQuery('.close-preview').trigger('click');	
				
				jQuery('.inner-canvas-container.active .batch_edit').removeClass('batch_edit_sim');
				jQuery('.inner-canvas-container.active .batch_edit').removeClass('batch_edit');
				}
				
			
			
			if(event.which=='46' || event.which=='8')
				{
				event.preventDefault();
				jQuery('.inner-canvas-container.active .batch_edit').remove();
				}
			if(event.which=='13')
				{
				if(jQuery('.inner-canvas-container.active .form-target').length>0)
					{
					jQuery('.inner-canvas-container.active .form-target').find('.edit').trigger('click');	
					}
				else if(jQuery('.inner-canvas-container.active .batch_edit_sim').length>0)
					{
					jQuery('.inner-canvas-container.active .batch_edit_sim').first().find('.edit').trigger('click');	
					}
				else if(jQuery('.nex-forms-container.active .batch_edit').length>0)
					{
					jQuery('.form-canvas-area').attr('data-pre-class','.batch_edit');
					jQuery('.overall-styling-btn').trigger('click');
					jQuery('#overall-fields-styling a').trigger('click');	
					}
				
				} 
			//CTRL + SHIFT + KEY
			if ((event.ctrlKey || event.metaKey) && event.shiftKey)
				{
				switch (String.fromCharCode(event.which).toLowerCase())
					{
					case 'z':
						event.preventDefault();
						nf_run_history('redo');
					break;
					
					case 'a':
						event.preventDefault();
						
						jQuery('.inner-canvas-container.active .batch_edit').removeClass('batch_edit_sim');
						jQuery('.inner-canvas-container.active .batch_edit').removeClass('batch_edit');
						hit_list = '';
						jQuery('.form-canvas-area').attr('data-pre-class','');
						
					break;
					case 'v':
						event.preventDefault();
						if(jQuery('.inner-canvas-container.active .form-target').length>0)
							nf_paste('top','form-target','outside');
						else
							nf_paste('top',0,'outside');
						
					break;
					}
				}
			
			//CTRL + KEY
			if ((event.ctrlKey || event.metaKey) && !event.shiftKey)
				{
				switch (String.fromCharCode(event.which).toLowerCase())
					{
					
					case 'z':
						event.preventDefault();
						nf_run_history('undo');
					break;
					case 'y':
						event.preventDefault();
						nf_run_history('redo');
					break;
					case 'a':
						event.preventDefault();
						jQuery('.inner-canvas-container.active .form_field:not(.step)').addClass('batch_edit');
					break;
					
					case 'x':
						event.preventDefault();
						nf_cut('batch_edit');
					break;
					case 'c':
						event.preventDefault();
						nf_copy('batch_edit')
					break;
					case 'v':
						event.preventDefault();
						if(jQuery('.inner-canvas-container.active .form-target').length>0)
							nf_paste('bottom','form-target','outside');
						else
							nf_paste('bottom',0,'outside');
						
					break;
					
					
					}
				}
   			}
		}
	);
function nf_cut(targets){
	
	nf_save_state('undo');
	batch_selection_array = new Array();
	jQuery('.inner-canvas-container.active .'+targets).each(
		function(index)
			{
			batch_selection_array[index] = 	jQuery(this).detach();
			}
		);		
	
}
function nf_copy(targets){
	
	nf_save_state('undo');
	batch_selection_array = new Array();
	batch_selection_array_originals = new Array();
	jQuery('.new_item').removeClass('new_item');
	jQuery('.inner-canvas-container.active .'+targets).each(
		function(index)
			{
			var duplication = nf_duplicate_field(jQuery(this))
			batch_selection_array[index] = 	duplication;
			batch_selection_array_originals[index] = jQuery(this);
			}
		);		
}
function nf_paste(direction,target,placement){
	for(var i=0;i<batch_selection_array_originals.length;i++)
				{
				var get_item = batch_selection_array_originals[i];
				get_item.removeClass('batch_edit_sim');
				get_item.removeClass('batch_edit');
				
				}
		//CONTEX MENU PASTES
		if(target)
			{
			var get_position = jQuery('.inner-canvas-container.active .'+ target);
				//OUTSIDE	
				if(placement=='outside')
					{	
					if(direction=='top')
						{
						for(var i=0;i<batch_selection_array.length;i++)
							{
							var get_item = batch_selection_array[i];
							get_item.addClass('new_item');
							get_item.insertBefore(get_position);
							}
						}
					else
						{
						for(var i=(batch_selection_array.length-1);i>=0;i--)
							{
							var get_item = batch_selection_array[i];
							get_item.addClass('new_item');
								get_item.insertAfter(get_position);
							}
						}
					}
				//INSIDE
				else
					{
					if(direction=='top')
						{
						for(var i=(batch_selection_array.length-1);i>=0;i--)	
							{
							var get_item = batch_selection_array[i];
							get_item.addClass('new_item');
							get_position.prepend(get_item);
							}
						}
					else
						{
						for(var i=0;i<batch_selection_array.length;i++)
							{
							var get_item = batch_selection_array[i];
							get_item.addClass('new_item');
								get_position.append(get_item);
							}	
						}
					}
			
			
			}
		//KEYBOARD PASTES
		else
			{
			//STEP CONTAINER
			if(jQuery('.nex-forms-container .step.over-step:not(.set-parent-over-field)').length>0)
				{
				var get_position = jQuery('.nex-forms-container .over-step .panel-body').first();

				if(direction=='top')
					{
					for(var i=(batch_selection_array.length-1);i>=0;i--)
					
						{
						var get_item = batch_selection_array[i];
						get_item.addClass('new_item');
						get_position.prepend(get_item);
						}
					}
				else
					{
					for(var i=0;i<batch_selection_array.length;i++)
						{
						var get_item = batch_selection_array[i];
						get_item.addClass('new_item');
							get_position.append(get_item);
						}
			
					}
				
				
				}
			//HOVER FIELD
			else if(jQuery('.inner-canvas-container.active .over-column-tools').length>0)
				{
				var get_position = jQuery('.inner-canvas-container.active .over-column-tools .panel-body').first();
				if(direction=='top')
					{
					for(var i=(batch_selection_array.length-1);i>=0;i--)	
						{
						var get_item = batch_selection_array[i];
						get_item.addClass('new_item');
						get_position.prepend(get_item);
						}
					}
				else
					{
					for(var i=0;i<batch_selection_array.length;i++)
						{
						var get_item = batch_selection_array[i];
						get_item.addClass('new_item');
							get_position.append(get_item);
						}	
					}
				}
			//HOVER GRID COLUMN
			else if(jQuery('.nex-forms-container.active .set-over-field').length>0)
				{
				var get_position = jQuery('.inner-canvas-container.active .set-over-field:not(.set-parent-over-field)');
				if(direction=='top')
					{
					for(var i=0;i<batch_selection_array.length;i++)
						{
						var get_item = batch_selection_array[i];
						get_item.addClass('new_item');
						get_item.insertBefore(get_position);
						}
					}
				else
					{
					for(var i=(batch_selection_array.length-1);i>=0;i--)
						{
						var get_item = batch_selection_array[i];
						get_item.addClass('new_item');
							get_item.insertAfter(get_position);
						}
					}
				}
			//NEX-FORMS-CONTAINER
			else
				{
				if(direction=='top')
					{
					
					for(var i=(batch_selection_array.length-1);i>=0;i--)	
						{
						var get_item = batch_selection_array[i];
						get_item.addClass('new_item');
						jQuery('.inner-canvas-container.active').prepend(get_item);
						}
					}
				else
					{
					for(var i=0;i<batch_selection_array.length;i++)
						{
						var get_item = batch_selection_array[i];
						get_item.addClass('new_item');
							jQuery('.inner-canvas-container.active').append(get_item);
						}	
					}
				
				}
			}
		jQuery('.inner-canvas-container.active .form_field').each(
		function(index)
			{
			setup_form_element(jQuery(this))
			}
		);	
		setTimeout(function(){ jQuery('.new_item').removeClass('new_item') },1000);
		jQuery('.set-over-field').removeClass('set-over-field');
		batch_selection_array = new Array();
		batch_selection_array_originals = new Array();
		jQuery('.field-target').removeClass('field-target');
		jQuery('.col-target').removeClass('col-target');
		jQuery('.step-target').removeClass('step-target');
}
	
function nf_run_history(action){
	if(jQuery('.'+action).html()!='')
		{
		jQuery('.field-settings-column #close-settings').trigger('click');	
		jQuery('.history_action.do_'+action).removeClass('avialable');
		if(action=='undo')
			{
			nf_save_state('redo');
			jQuery('.history_action.do_redo').addClass('avialable');
			}
		if(action=='redo')
			{
			jQuery('.history_action.do_undo').addClass('avialable');
			}
			
		jQuery('.nex-forms-container').html(jQuery('.'+action).html());
		
		jQuery('div.nex-forms-container .form_field').each(
			function(index)
				{
				var get_id = jQuery(this).attr('data-id');	
				jQuery(this).attr('id', get_id)
				setup_form_element(jQuery(this))
				}
			);
		
		}
}
			
		
jQuery(document).ready(
function()
	{
	
	jQuery(document).on('keyup','input, textarea',
		function()
			{
			var val = jQuery(this).val();
			val = val.replace( /<script[^>]*>/gi, '');
			val = val.replace( /<\/script>/gi, '');
			jQuery(this).val(val)
			}
		);	
		
	jQuery('body').prepend('<div id="selectable_area" class="selectable_area" style="display:none"></div>');
	selectable_area = document.getElementById('selectable_area');
	function reCalc() {
		var x3 = Math.min(x1,x2);
		var x4 = Math.max(x1,x2);
		var y3 = Math.min(y1,y2);
		var y4 = Math.max(y1,y2);
		jQuery('#selectable_area').css('left', x3 + 'px');
		jQuery('#selectable_area').css('top', y3 + 'px');
		jQuery('#selectable_area').css('width', (x4 - x3) + 'px');
		jQuery('#selectable_area').css('height', (y4 - y3) + 'px');
		
	}
	
	jQuery(document).on('dblclick','div.form_canvas', 
		function(e)
			{
			jQuery('.set-over-field').removeClass('set-over-field');
			jQuery('.set-parent-over-field').removeClass('set-parent-over-field');
			jQuery('.currently_editing').removeClass('currently_editing');
			
			jQuery('.field-target').removeClass('field-target');
			jQuery('.col-target').removeClass('col-target');
			jQuery('.step-target').removeClass('step-target');
			
			jQuery('.inner-canvas-container .batch_edit').removeClass('batch_edit_sim');
			jQuery('.inner-canvas-container .batch_edit').removeClass('batch_edit');
			
			jQuery('.field-settings-column #close-settings').trigger('click');
			x1 = 0;
			y1 = 0;
			x2 = 0;
			y2 = 0;
			}
		);
	
	jQuery(document).on('mousedown','.inner-canvas-container .form_field', 
		function(e)
			{
			nf_save_state('undo');
			}
		);
	
	jQuery(document).on('click','.inner-canvas-container .form_field:not(.step)', 
		function(e)
			{
			
			var target = jQuery(e.target).closest('.form_field');
			var isCtrlPressed = e.ctrlKey;
			
			var isShiftPressed = e.shiftKey;

			if(isCtrlPressed && isShiftPressed)
				{
				jQuery('.field-settings-column #close-settings').trigger('click');
				jQuery(' .inner-canvas-container .batch_edit').removeClass('batch_edit_sim');
				jQuery(' .inner-canvas-container .batch_edit').removeClass('batch_edit');
				
				run_batch_sim_select(jQuery(this))
				}
			else
				{	
				if(isCtrlPressed)
					{
					jQuery('.field-settings-column #close-settings').trigger('click');
					if(jQuery(this).hasClass('batch_edit'))
						{
						jQuery(this).removeClass('batch_edit');
						jQuery(this).removeClass('batch_edit_sim');
						}
					else
						jQuery(this).addClass('batch_edit');
					}
				}
			
			if(target.hasClass('grid'))
				{
				target.find('.batch_edit').removeClass('batch_edit_sim');
				target.find('.batch_edit').removeClass('batch_edit');	
				}
			else
				{
				target.closest('.grid').removeClass('batch_edit_sim');
				target.closest('.grid').removeClass('batch_edit');
				
				}
			
			
			
	
			}
		);
	
		

		
	
	jQuery(document).on('mousedown','div.form_canvas', 
		function(e)
			{
			
			
			jQuery("html, body").scrollTop(0);
			
			var target = jQuery(e.target);	
			var isCtrlPressed = e.ctrlKey;
				
			
			
			if(target.hasClass('form_canvas'))
				{
				jQuery('.set-over-field').removeClass('set-over-field');
				jQuery('.set-parent-over-field').removeClass('set-parent-over-field');
				jQuery('.field-target').removeClass('field-target');
				jQuery('.col-target').removeClass('col-target');
				jQuery('.step-target').removeClass('step-target');
				if(!isCtrlPressed)
					{
					jQuery('.inner-canvas-container .batch_edit').removeClass('batch_edit_sim');
					jQuery('.inner-canvas-container .batch_edit').removeClass('batch_edit');
					jQuery('.form-canvas-area').attr('data-pre-class','');
					hit_list = '';
					}
				jQuery('.field-settings-column #close-settings').trigger('click');
				jQuery('.overall-settings-column #close-settings').trigger('click');
				
				}
				
			if(!target.closest('.form_field').attr('class') && !target.hasClass('form_field') && !target.hasClass('editing_text') && !target.hasClass('ui-slider-handle') && !target.closest('.width_bar').attr('class'))
				{
				jQuery('#selectable_area').addClass('drawing');
				x1 = e.clientX;
				y1 = e.clientY;
				reCalc();
				}
		
			}
		);
	jQuery(document).on('mousemove','body', 
		function(e)
			{
			
			var isCtrlPressed = e.ctrlKey;
			
			
			
			if(jQuery('#selectable_area').hasClass('drawing'))
				{
				e.preventDefault();
				jQuery('#selectable_area').show();
				x2 = e.clientX;
				y2 = e.clientY;
				reCalc();
				}
			}
		);
	jQuery(document).on('mousemove','.inner-canvas-container', 
		function(e)
			{
			
			if(jQuery('#selectable_area').hasClass('drawing'))
				{
				e.preventDefault();
				hit_list = jQuery("#selectable_area").collision('.inner-canvas-container .form_field:not(.grid)');
				}
			}
		);
	
	
	
	
	
	jQuery(document).on('mouseup','body',
		function(e)
			{
			//console.log(e);
			jQuery('#selectable_area').hide();
			if(jQuery(e.target).hasClass('selectable_area'))
				{
				if(jQuery('#selectable_area').hasClass('drawing'))
					{
					for( var i=0; i<hit_list.length; i++ )
						{
						if(jQuery(hit_list[i]).hasClass('batch_edit'))
							jQuery(hit_list[i]).removeClass('batch_edit');
						else
							jQuery(hit_list[i]).addClass('batch_edit');
						}
					
					
					jQuery('.inner-canvas-container .grid-system.batch_edit .form_field').removeClass('batch_edit_sim');
					jQuery('.inner-canvas-container .grid-system.batch_edit .form_field').removeClass('batch_edit');
					
					x1 = 0;
					y1 = 0;
					x2 = 0;
					y2 = 0;
					reCalc();
					if(hit_list.length>0)
						{
						if(e.which=='3')
							{
							if(!dev)
								e.preventDefault();
							jQuery('.nf_context_menu_2').removeClass('sim_edit');
							jQuery('.nf_context_menu').hide();
							jQuery('.nf_context_menu_2').css('top', e.pageY+'px');
							jQuery('.nf_context_menu_2').css('left', (e.pageX-250)+'px');
							jQuery('.nf_context_menu_2').show();
							jQuery('.nf_context_menu_2').addClass('animated_extra_fast');
							jQuery('.nf_context_menu_2').addClass('zoomIn');
							}
						
						nf_save_state('undo');
						
						}
					}
				}
			jQuery('#selectable_area').removeClass('drawing');
			
			if(jQuery('.inner-canvas-container.active .batch_edit').length>0)
				jQuery('.form-canvas-area').attr('data-pre-class','.batch_edit');
				
			}
		)


	
	
	jQuery(document).on('click','.history_action', 
		function()
			{
			nf_run_history(jQuery(this).attr('data-action')); 
			}
	);
	
	
	jQuery('.inner-canvas-container.active .form_field.grid-system').each(
		function()
				{
				nf_setup_grid(jQuery(this));	
				}
		);
	
	
	
	jQuery(document).on('click','.edit-done',
		function()
			{
			jQuery('.field-settings-column #close-settings').trigger('click');
			jQuery(this).remove();
			}
		);
	jQuery(document).on('click','.inner-canvas-container div.form_field div.form_object div.edit, div.edit_mask', 
		function(e)
			{
			var isCtrlPressed = e.ctrlKey;
			
			if(isCtrlPressed)
				return;
			
			jQuery('#editing_text').trigger('blur');
			
			current_field = '';
			current_id = '';
			
			current_field = jQuery(this).closest('.form_field');
			jQuery('.field-settings-column').removeClass('group-edit');
			
			//jQuery('.field-settings-column .material_box_head').html('<span class="fa fa-edit"></span>Edit Field <span class="set_editing_field"></span>')

			if(current_field.hasClass('batch_edit_sim'))
				{
				jQuery('.field-settings-column').addClass('group-edit')
				current_field = jQuery('div.inner-canvas-container.active .batch_edit_sim');
				}
			
			if(current_field.hasClass('field_spacer'))
				return;
			
			jQuery('.field-settings-column').removeClass('open_sidenav');
			jQuery('.form_canvas').removeClass('settings-opened');
			jQuery('.form_canvas').addClass('settings-opened');
			
			jQuery('.overall-settings-column #close-settings').trigger('click');
			jQuery('.conditional_logic_wrapper #close-settings').trigger('click');
			
			if(jQuery('div.field-settings-column .current_id').text()!='')
				setTimeout(function(){jQuery('.field-settings-column').addClass('open_sidenav');},175);
			else
				jQuery('.field-settings-column').addClass('open_sidenav');
			
			
			if(current_field.hasClass('currently_editing'))
				{
				jQuery('#close-settings').trigger('click');	
				return;
				}
			
			jQuery('.form_field').removeClass('currently_editing');
			current_field.addClass('currently_editing');
			
			
			
			
			
			jQuery('.edit-done').remove();
			jQuery('.currently_editing_field').removeClass('currently_editing_field');

			
			current_field.find('.field_settings').last().prepend('<div class="btn btn-default btn-xs edit-done"><span class="fa fa-check" data-placement="bottom" data-toggle="tooltip_bs" title="Done Editing" ></span></div>');
			current_field.find('.field_settings').last().addClass('currently_editing_field');
			
			
			
			jQuery('div.field-settings-column .current_id').text(jQuery(this).closest('.form_field').attr('id'));
			current_id = jQuery('div.field-settings-column .current_id').text();

			
			label_container = current_field.find('.label_container');
			input_container = current_field.find('.input_container');
			input_element 	= current_field.find('.the_input_element');


			if(current_field.hasClass('html_image') || current_field.hasClass('heading') || current_field.hasClass('html') || current_field.hasClass('math_logic') || current_field.hasClass('paragraph') || current_field.hasClass('divider'))
				{
				current_field.removeClass('material_field');
				}
			jQuery('.settings_tabs_nf li').removeClass('current');
			jQuery(current_field.attr('data-settings-tabs')).addClass('current');
			
			//jQuery('#extra-settings').addClass('current'); 
			 
			
			jQuery('.field-setting').removeClass('current');
			jQuery(current_field.attr('data-settings')).addClass('current');
			
			
			
			
			if(current_field.hasClass('material_field'))
				{
				jQuery('.field-setting.s-odd_setting').show();
				if(current_field.hasClass('preset_fields') || current_field.hasClass('select') || current_field.hasClass('textarea') || current_field.hasClass('text'))
					jQuery('.field-setting.s-odd_setting').hide();
				}
			
			
					if(!jQuery('.field-setting-categories li.tab.active').hasClass('current'))
						{
						jQuery('.field-setting-categories li.tab.current').first().find('a').trigger('click');
						}
					else
						{
						
						jQuery('.field-setting-categories li.tab.active a').trigger('click');	
						}
					
			
			
			}
		);
	
	
	
	
	 /* MESSAGE SETTINGS */
	 
	 
	 jQuery(document).on('click','.msg_hide_form button',
		function()
			{
			jQuery('.msg_hide_form button').removeClass('active');
			jQuery(this).addClass('active');
			if(jQuery(this).hasClass('yes'))
				{
				jQuery('.msg_hide_form').attr('data-value','yes');
				}
			if(jQuery(this).hasClass('no'))
				{
				jQuery('.msg_hide_form').attr('data-value','no');
				}
			}
		);
	
	
	jQuery(document).on('click','.msg_position button',
		function()
			{
			jQuery('.msg_position button').removeClass('active');
			jQuery(this).addClass('active');
			if(jQuery(this).hasClass('top'))
				{
				jQuery('.msg_position').attr('data-value','top');
				}
			if(jQuery(this).hasClass('bottom'))
				{
				jQuery('.msg_position').attr('data-value','bottom');
				}
			}
		);
	
	
	jQuery(document).on('click','.msg_placement button',
		function()
			{
			jQuery('.msg_placement button').removeClass('active');
			jQuery(this).addClass('active');
			if(jQuery(this).hasClass('inside'))
				{
				jQuery('.msg_placement').attr('data-value','inside');
				}
			if(jQuery(this).hasClass('outside'))
				{
				jQuery('.msg_placement').attr('data-value','outside');
				}
			}
		);
	
	jQuery(document).on('click','.loader-type .nf-loader-container',
		function()
			{
			jQuery('.loader-type .nf-loader-container').removeClass('active');
			jQuery(this).addClass('active');
			
			jQuery('.loader-type').attr('data-value',jQuery(this).attr('data-type'));
			
			}
		);
	
	
	jQuery(document).on('click','.loader-color button',
		function()
			{
			jQuery('.loader-color button').removeClass('active');
			jQuery(this).addClass('active');
			
			jQuery('.loader-color').attr('data-value',jQuery(this).attr('data-color'));
			
			}
		);
	
	
	
	
	
	
	
	jQuery( ".set_form_width" ).spinner(
		{ 
		min:0, 
		max:2000,  
		spin: function( event, ui ) 
				{
				var w_unit = '%';
			
				if(jQuery('.width_input .input-group-addon.pixels').hasClass('active'))
					w_unit = 'px';
				
				if(w_unit=='%')
					jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').attr('data-width-percentage',ui.value)
				else
					jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').attr('data-width-pixels',ui.value)
					
				jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').css('width',ui.value + w_unit);
				}
		}
	).on('keyup', function(e)
				{
				var w_unit = '%';
			
				if(jQuery('.width_input .input-group-addon.pixels').hasClass('active'))
					w_unit = 'px';
				
				if(w_unit=='%')
					jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').attr('data-width-percentage',jQuery(this).val())
				else
					jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').attr('data-width-pixels',jQuery(this).val())
					
				jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').css('width',jQuery(this).val() + w_unit);
				});	
	
	
	
	
	jQuery(document).on('click','.width_input .input-group-addon.width_type',
		function()
			{
			jQuery('.width_input .input-group-addon.width_type').removeClass('active');
			jQuery(this).addClass('active');
			
			
			
			if(jQuery(this).hasClass('percentage'))
				{
				jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').attr('data-width-unit','%');
				jQuery( ".set_form_width" ).spinner( "option", "max",100 );
				jQuery( ".set_form_width" ).val(jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').attr('data-width-percentage'));
				
				
				jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').css('width',jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').attr('data-width-percentage') + '%');
				
				}
			else
				{
				jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').attr('data-width-unit','px');
				jQuery( ".set_form_width" ).spinner( "option", "max",2000 );
				
				jQuery( ".set_form_width" ).val(jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').attr('data-width-pixels'));
				
				jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').css('width',jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').attr('data-width-pixels') + 'px');
				}
			}
		);
	
	
	/* STEP SETTINGS */
	jQuery(document).on('keyup', 'input[name="multi_step_name"]',
		function()
			{
			var step_num = jQuery(this).closest('.form_field.step').attr('data-step-num');
			
			
			jQuery('.nf_ms_breadcrumb ul li:eq('+ (step_num-1) +')').find('a .step_title').html(jQuery(this).val());
			jQuery('.multi-step-stepping li:eq('+ (step_num-1) +')').find('a').attr('title',jQuery(this).val());
			jQuery('.multi-step-stepping li:eq('+ (step_num-1) +')').find('a').attr('data-title',jQuery(this).val());
			jQuery('.multi-step-stepping li:eq('+ (step_num-1) +')').find('a').attr('data-original-title',jQuery(this).val());
			jQuery(this).closest('.form_field.step').attr('data-step-name',jQuery(this).val());
			
			if(jQuery(this).val()=='' || jQuery(this).val()=='&nbsp;'  || jQuery(this).val()=='&nbsp; ' || jQuery(this).val()==' ' || jQuery(this).val()=='  ')
				jQuery('.nf_ms_breadcrumb li:eq('+ (step_num-1) +')').addClass('no-title');
			else
				jQuery('.nf_ms_breadcrumb li:eq('+ (step_num-1) +')').removeClass('no-title');
			
			}			
	
	);
	
	jQuery(document).on('click','.set_step_icon',
			function()
				{
				jQuery('.fa-icons-list').removeClass('set_animation_fast').removeClass('slideInRight').removeClass('slideOutRight').removeClass('icon_after').addClass('step_icon')
				jQuery('.fa-icons-list').addClass('set_animation_fast')
				jQuery('.fa-icons-list').addClass('slideInRight')
				jQuery('.fa-icons-list').show();
				jQuery('.fa-icons-list i').removeClass('active');
				var current_icon = jQuery('.set_step_icon i').attr('class');
				if(current_icon)
					var set_current_icon_class = current_icon.replace('fa','').replace(' ','');
				if(current_icon)
					jQuery('.fa-icons-list i.' + set_current_icon_class).addClass('active');
				
				jQuery('.fa-icons-list').attr('data-set-num',jQuery(this).closest('.step').attr('data-step-num'));
				}
			);
			
		
	jQuery(document).on('keyup', 'input[name="multi_step_description"]',
		function()
			{
			var step_num = jQuery(this).closest('.form_field.step').attr('data-step-num');
			
			
			jQuery('.nf_ms_breadcrumb ul li:eq('+ (step_num-1) +')').find('a .step_description').html(jQuery(this).val());
			
			jQuery(this).closest('.form_field.step').attr('data-step-description',jQuery(this).val());
			
			if(jQuery(this).val()=='' || jQuery(this).val()=='&nbsp;'  || jQuery(this).val()=='&nbsp; ' || jQuery(this).val()==' ' || jQuery(this).val()=='  ')
				{
				jQuery('.nf_ms_breadcrumb li:eq('+ (step_num-1) +')').addClass('no-description');
				var check_descriptions = false;
				jQuery('.nex-forms-container .form_field.step').each(
					function()	
						{
						if(jQuery(this).attr('data-step-description'))
							check_descriptions = true;
							
						}
					);
				
				if(check_descriptions)
					jQuery('.nf_ms_breadcrumb ul').addClass('has-descriptions');
				else
					jQuery('.nf_ms_breadcrumb ul').removeClass('has-descriptions');
				
				
				}
			else
				{
				jQuery('.nf_ms_breadcrumb ul').addClass('has-descriptions');
				jQuery('.nf_ms_breadcrumb li:eq('+ (step_num-1) +')').removeClass('no-description');
				}
			
			}			
	
	);
	
	
	jQuery(document).on('keyup', 'input[name="multi_step_time_limit"]',
		function()
			{
			var get_val = jQuery(this).val();
			get_val = get_val.replace(/[^\d\.\,]*/g,'');
			jQuery(this).val(get_val);
			jQuery(this).closest('.form_field.step').attr('data-step-time-limit',get_val);
			}			
	
	);
	

	jQuery(document).on('keyup', 'input[name="multi_step_icon"]',
		function()
			{
			var step_num = jQuery(this).closest('.form_field.step').attr('data-step-num');
			var current_step = jQuery('.nf_ms_breadcrumb li:eq('+(step_num-1)+')');
			
				if(jQuery(this).val()=='')
					{
					jQuery('.nf_multi_step_'+step_num).attr('data-step-icon','')
					jQuery('.nf_multi_step_'+step_num+' .set_step_icon i').attr('class','');
					
					current_step.removeClass('has-icon');
					current_step.find('.the_step_icon').attr('class','the_step_icon')
					}
				else
					{
					jQuery('.nf_multi_step_'+step_num).attr('data-step-icon',jQuery(this).val())
					jQuery('.nf_multi_step_'+step_num+' .set_step_icon i').attr('class',jQuery(this).val());
					
					current_step.addClass('has-icon');
					current_step.find('.the_step_icon').attr('class','the_step_icon '+jQuery(this).val())	
					}
			
			
			
			}			
	
	);
	

	
	jQuery(document).on('click','#ms-css-settings',
		function()
			{
			//jQuery('.form_canvas').addClass('show_breadcrumb');
			}
		);
	jQuery(document).on('click','#close-settings, #form-settings, #custom-css-settings, #overall-fields-styling',
		function()
			{
				
			jQuery('.form_canvas').removeClass('show_breadcrumb');
			}
		);
	jQuery(document).on('change','#bc_style_selection',
		function()
			{
				
				jQuery('#bc_style_selection option').each(
				function()
					{
					jQuery('.nf_ms_breadcrumb').removeClass(jQuery(this).attr('value'));
					}
				)
			jQuery('.nf_ms_breadcrumb').addClass(jQuery(this).val());
			}
		);
		
		
	jQuery(document).on('change','#set_breadcrumb_type',
		function()
			{
			if(jQuery(this).val()=='p_bar')
				{
				jQuery('.crumb-position').hide();
				jQuery('.nf_ms_breadcrumb ul').addClass('hidden').hide();
				jQuery('.nf_progressbar').removeClass('hidden').show();
				jQuery('.nf_ms_breadcrumb ul').attr('data-breadcrumb-type',jQuery(this).val());
				}
			else
				{
				jQuery('.crumb-position').show();
				jQuery('.nf_ms_breadcrumb ul').removeClass('hidden').show();
				jQuery('.nf_progressbar').addClass('hidden').hide();
					
				jQuery('#set_breadcrumb_type option').each(
				function()
					{
					jQuery('.nf_ms_breadcrumb').removeClass(jQuery(this).attr('value'));
					}
				)
					
					
				//if(jQuery(this).val()=='triangular')
					jQuery('.nf_ms_breadcrumb').addClass(jQuery(this).val());
				//else if(jQuery(this).val()=='rectangular')
				//	jQuery('.nf_ms_breadcrumb ul').attr('class','the_br text-center');
				//else if(jQuery(this).val()=='dotted')
				//	jQuery('.nf_ms_breadcrumb ul').attr('class','the_br ');
				//else if(jQuery(this).val()=='dotted_count')
				//	jQuery('.nf_ms_breadcrumb ul').attr('class','the_br count');
				//else
					//jQuery('.nf_ms_breadcrumb ul').attr('class','the_br cd-breadcrumb');
				
				
				jQuery('.nf_ms_breadcrumb ul').attr('data-breadcrumb-type',jQuery(this).val());
				jQuery('#bc_theme_selection option').each(
					function()
						{
						jQuery('.nf_ms_breadcrumb ul').removeClass('md-color-'+jQuery(this).attr('value'));
						}
					)
				
				
				jQuery('.nf_ms_breadcrumb ul').addClass('md-color-'+jQuery('.nf_ms_breadcrumb ul').attr('data-theme'));
				
				jQuery('.nf_ms_breadcrumb ul').addClass(jQuery('.nf_ms_breadcrumb ul').attr('data-breadcrumb-type'));
				
				if(jQuery(this).val()=='dotted' || jQuery(this).val()=='dotted_count')
					jQuery('.nf_ms_breadcrumb ul').addClass(jQuery('.nf_ms_breadcrumb ul').attr('data-text-pos'));
				}
			jQuery('.nf_ms_breadcrumb ul').addClass(jQuery('.nf_ms_breadcrumb ul').attr('data-align-crumb'));
			}
		);
		
	
	jQuery(document).on('change','#bc_theme_selection',
		function()
			{
			jQuery('#bc_theme_selection option').each(
				function()
					{
					jQuery('.nf_ms_breadcrumb .the_br').removeClass('md-color-'+jQuery(this).attr('value'));
					jQuery('.nf_ms_breadcrumb .nf_progressbar_percentage').removeClass('md-color-'+jQuery(this).attr('value'));
					}
				)
			jQuery('.nf_ms_breadcrumb .the_br').removeClass('md-color-default');
			jQuery('.nf_ms_breadcrumb .nf_progressbar_percentage').removeClass('md-color-yellow');
			
			
			jQuery('.nf_ms_breadcrumb .the_br').addClass('md-color-'+jQuery(this).val());
			jQuery('.nf_ms_breadcrumb .nf_progressbar_percentage').addClass('md-color-'+jQuery(this).val());
			
			jQuery('.nf_ms_breadcrumb .the_br').attr('data-theme',jQuery(this).val());
			
			}
		);
		
	
	//SET FORM BACKGROUND SIZE
	jQuery(document).on('click','.bc-text-pos button',
		function()
			{
			jQuery('.bc-text-pos button').removeClass('active');
			jQuery(this).addClass('active');

			var get_obj = jQuery('.nf_ms_breadcrumb .the_br');
			
			jQuery('.nf_ms_breadcrumb .the_br').removeClass('text-top').removeClass('text-bottom');
			
			if(jQuery('.nf_ms_breadcrumb ul').hasClass('dotted') || jQuery('.nf_ms_breadcrumb ul').hasClass('dotted_count')) 
				{
				if(jQuery(this).hasClass('top'))
					{
					get_obj.attr('data-text-pos','text-top');
					jQuery('.nf_ms_breadcrumb ul').addClass('text-top');
					}
				else
					{
					get_obj.attr('data-text-pos','text-bottom');
					jQuery('.nf_ms_breadcrumb ul').addClass('text-bottom');
					}
				}
			}
		);
		
	//SET FORM BACKGROUND SIZE
	jQuery(document).on('click','.ms-scroll-top button',
		function()
			{
			jQuery('.ms-scroll-top button').removeClass('active');
			jQuery(this).addClass('active');

			var get_obj = jQuery('.nf_step_scroll_top');
			
			if(jQuery(this).hasClass('yes'))
				{
				get_obj.text('yes');
				}
			else
				{
				get_obj.text('no');
				}
			}
		);
	
	
	jQuery(document).on('click','.bc_position button',
		function()
			{
			jQuery('.bc_position button').removeClass('active');
			jQuery(this).addClass('active');
			
			jQuery('.nf_ms_breadcrumb').removeClass('bc-top').removeClass('bc-bottom').removeClass('both');
			
			var get_obj = jQuery('.nf_bc_position');
			var get_breadcrumb_1 = jQuery('.bc-outer-container').detach();

			if(jQuery(this).hasClass('position_top'))
				{
				jQuery('.nex-forms-header').prepend(get_breadcrumb_1);
				jQuery('.bc_position').attr('data-value','top');
				}
			if(jQuery(this).hasClass('position_bottom'))
				{
				jQuery('.nex-forms-footer').prepend(get_breadcrumb_1);
				jQuery('.bc_position').attr('data-value','bottom');
				}
			}
		);
	
	
	
		
	
	jQuery(document).on('click','.bc_show_front_end button',
		function()
			{
			jQuery('.bc_show_front_end button').removeClass('active');
			jQuery(this).addClass('active');

			var get_obj = jQuery('.nf_ms_breadcrumb .the_br');
			if(jQuery(this).hasClass('show_front'))
				{
				get_obj.attr('data-show-front-end','yes');
				jQuery('.bc-outer-container').removeClass('no-front-end');
				}
			else
				{
				get_obj.attr('data-show-front-end','no');
				jQuery('.bc-outer-container').addClass('no-front-end');
				}
				
			}
		);
		
	jQuery(document).on('click','.bc_show_inside button',
		function()
			{
			jQuery('.bc_show_inside button').removeClass('active');
			jQuery(this).addClass('active');

			var get_obj = jQuery('.nf_ms_breadcrumb .the_br');
			if(jQuery(this).hasClass('show_inside'))
				{
				get_obj.attr('data-show-inside','yes');
				}
			else
				{
				get_obj.attr('data-show-inside','no');
				}
				
			}
		);
	
	
	jQuery(document).on('click','.crumb-position button',
		function()
			{
			jQuery('.crumb-position button').removeClass('active');
			jQuery(this).addClass('active');

			var get_obj = jQuery('.nf_ms_breadcrumb .the_br');
				
			get_obj.removeClass('align_left').removeClass('align_right').removeClass('align_center');
				
			if(jQuery(this).hasClass('left'))
				{
				get_obj.addClass('align_left');
				get_obj.attr('data-align-crumb','align_left');
				}
			if(jQuery(this).hasClass('right'))
				{
				get_obj.addClass('align_right');
				get_obj.attr('data-align-crumb','align_right');
				}
			if(jQuery(this).hasClass('center'))
				{
				get_obj.addClass('align_center');
				get_obj.attr('data-align-crumb','align_center');
				}
				
			}
		);
	
	
	jQuery(document).on('click','.bc_folded button',
		function()
			{
			jQuery('.bc_folded button').removeClass('active');
			jQuery(this).addClass('active');

			var get_obj = jQuery('.nf_ms_breadcrumb');
				
			get_obj.removeClass('bc-folded').removeClass('bc-unfolded');
				
			if(jQuery(this).hasClass('folded'))
				{
				get_obj.addClass('bc-folded');
				jQuery('.bc_folded').attr('data-value','bc-folded')
				}
			if(jQuery(this).hasClass('unfolded'))
				{
				get_obj.addClass('bc-unfolded');
				jQuery('.bc_folded').attr('data-value','bc-unfolded')
				}
			
				
			}
		);
		
	
	jQuery(document).on('click','.bc_connected button',
		function()
			{
			jQuery('.bc_connected button').removeClass('active');
			jQuery(this).addClass('active');

			var get_obj = jQuery('.nf_ms_breadcrumb');
				
			get_obj.removeClass('bc-connected').removeClass('bc-unconnected');
				
			if(jQuery(this).hasClass('connected'))
				{
				get_obj.addClass('bc-connected');
				jQuery('.bc_connected').attr('data-value','bc-connected')
				}
			if(jQuery(this).hasClass('unconnected'))
				{
				get_obj.addClass('bc-unconnected');
				jQuery('.bc_connected').attr('data-value','bc-unconnected')
				}
			
				
			}
		);	
	
	
	jQuery(document).on('click','.disable_back button',
		function()
			{
			jQuery('.disable_back button').removeClass('active');
			jQuery(this).addClass('active');

			
				
			if(jQuery(this).hasClass('no'))
				{
				jQuery('.disable_back').attr('data-value','no');
				
				jQuery('.outer-container').removeClass('ms_disable_back');
				
				}
			if(jQuery(this).hasClass('yes'))
				{
				jQuery('.disable_back').attr('data-value','yes');
				jQuery('.outer-container').addClass('ms_disable_back');
				}
			
				
			}
		);	
		
	
	
	//CRUMB GUTTER
	jQuery( "#bc-gutter" ).spinner(
		{ 
		min:-30, 
		max:30,  
		spin: function( event, ui ) 
				{
				for(var i=-30;i<=30;i++)
					jQuery('.nf_ms_breadcrumb').removeClass('bc-gutter-'+i)
				
				jQuery('.nf_ms_breadcrumb').addClass('bc-gutter-'+ui.value)
				}
		}
	).on('keyup', function(e)
			{
			for(var i=-30;i<=30;i++)
				jQuery('.nf_ms_breadcrumb').removeClass('bc-gutter-'+i)
				
			jQuery('.nf_ms_breadcrumb').addClass('bc-gutter-'+jQuery(this).val())	
			});
	
	
	
	
	
	
	jQuery( "#bc-brd-radius" ).spinner(
		{ 
		min:0, 
		max:100,  
		spin: function( event, ui ) 
				{
				jQuery('.nf_ms_breadcrumb').css('border-radius', ui.value +'px');
				}
		}
	).on('keyup', function(e)
			{
			jQuery('.nf_ms_breadcrumb').css('border-radius', jQuery(this).val() +'px');
			});
	
	jQuery( "#bc-brd-size" ).spinner(
		{ 
		min:0, 
		max:50,  
		spin: function( event, ui ) 
				{
				jQuery('.nf_ms_breadcrumb').css('border-width', ui.value +'px');
				}
		}
	).on('keyup', function(e)
			{
			jQuery('.nf_ms_breadcrumb').css('border-width', jQuery(this).val() +'px');
			});
	
	
	
	jQuery(".bc-bg-color").spectrum(
		{
		 
		 type: "text",
		togglePaletteOnly: "true",
		hideAfterPaletteSelect: "true",
		showInput: "true",
		showInitial: "true",
		 color: '#fff',
		 move: function(color)
			{
			jQuery('.nf_ms_breadcrumb').css('background',jQuery(this).val())
			}
		});
	jQuery(".bc-brd-color").spectrum(
		{
		 
		 type: "text",
		togglePaletteOnly: "true",
		hideAfterPaletteSelect: "true",
		showInput: "true",
		showInitial: "true",
		 color: '#ddd',
		 move: function(color)
			{
			jQuery('.nf_ms_breadcrumb').css('border-color',jQuery(this).val())
			}
		});
	
	
	
	
	jQuery(".bc-crumb-bg-color").spectrum(
		{
		 
		 type: "text",
		togglePaletteOnly: "true",
		hideAfterPaletteSelect: "true",
		showInput: "true",
		showInitial: "true",
		 color: '#fff',
		 move: function(color)
			{
			jQuery('.nf_ms_breadcrumb li').css('background',jQuery(this).val())
			}
		});
	jQuery(".bc-crumb-text-color").spectrum(
		{
		 
		 type: "text",
		togglePaletteOnly: "true",
		hideAfterPaletteSelect: "true",
		showInput: "true",
		showInitial: "true",
		 color: '#888',
		 move: function(color)
			{
			jQuery('.nf_ms_breadcrumb li *').css('color',jQuery(this).val());
			}
		});
	jQuery(".bc-crumb-border-color").spectrum(
		{
		 
		 type: "text",
		togglePaletteOnly: "true",
		hideAfterPaletteSelect: "true",
		showInput: "true",
		showInitial: "true",
		 color: '#eaeaea',
		 move: function(color)
			{
			jQuery('.nf_ms_breadcrumb li').css('border-color',jQuery(this).val())
			}
		});
	jQuery(".bc-crumb-connector-color").spectrum(
		{
		 
		 type: "text",
		togglePaletteOnly: "true",
		hideAfterPaletteSelect: "true",
		showInput: "true",
		showInitial: "true",
		 color: '#ddd',
		 move: function(color)
			{
			jQuery('.nf_ms_breadcrumb li .step_connecter').css('border-color',jQuery(this).val())
			}
		});
	
	
	
	
	jQuery('.bc-drop-shadow').click(
		function()
			{
			if(jQuery(this).hasClass('active'))
				{
				jQuery('.nf_ms_breadcrumb').css('box-shadow','');	
				jQuery(this).removeClass('active');
				}
			else
				{
				jQuery('.bc-drop-shadow').removeClass('active');
				jQuery(this).addClass('active');
				
				if(jQuery(this).hasClass('shadow-light'))
					{
					jQuery('.nf_ms_breadcrumb').css('box-shadow','0 7px 16px 0 rgba(0, 0, 0, 0.2)');
					}
				else if(jQuery(this).hasClass('shadow-dark'))
					{
					jQuery('.nf_ms_breadcrumb').css('box-shadow','0 7px 16px 0 rgba(0, 0, 0, 0.6)');
					}
				else
					{
					jQuery('.nf_ms_breadcrumb').css('box-shadow','');
					}
				}
			}
		);
	
	
	
	
	//SET BACKGROUND IMAGE
		
		jQuery(document).on('click','#do-upload-bc-image .fileinput-exists span',
		function()
			{
			jQuery('.nf_ms_breadcrumb').css('background-image','');
			}
		);
		
		
		jQuery(document).on('change','#do-upload-bc-image input',
		function()
			{
			jQuery('#do-upload-bc-image').submit();
			}
		)
		jQuery('#do-upload-bc-image').ajaxForm(
			{
			data:{action: 'do_upload_image'},
			beforeSubmit: function(formData, jqForm, options) {},
			success : function(responseText, statusText, xhr, $form)
				{
				if(responseText)
					{
					var img_attr = 	JSON.parse(responseText);
					}
				else
					{
					img_attr = '';	
					}
				if(responseText)
					jQuery('.nf_ms_breadcrumb').css('background-image','url("'+ img_attr['image_url'] +'")')
				else
					jQuery('.nf_ms_breadcrumb').css('background-image',jQuery('.bc-bg-color').val());
				},
			error: function(jqXHR, textStatus, errorThrown){/*console.log(errorThrown)*/}
			}
		);	
	
		
	
	
	
	
	
	
	//SET FORM BACKGROUND SIZE
	jQuery(document).on('click','.bc-bg-size button',
		function()
			{
			jQuery('.bc-bg-size button').removeClass('active');
			jQuery(this).addClass('active');

			var get_obj = jQuery('.nf_ms_breadcrumb');
				
			if(jQuery(this).hasClass('auto'))
				get_obj.css('background-size','auto');
			if(jQuery(this).hasClass('cover'))
				get_obj.css('background-size','cover');
			if(jQuery(this).hasClass('contain'))
				get_obj.css('background-size','contain');
			}
		);
	
	//SET FORM BACKGROUND SIZE
	jQuery(document).on('click','.bc-bg-repeat button',
		function()
			{
			jQuery('.bc-bg-repeat button').removeClass('active');
			jQuery(this).addClass('active');

			var get_obj = jQuery('.nf_ms_breadcrumb');
				
			if(jQuery(this).hasClass('no-repeat'))
				get_obj.css('background-repeat','no-repeat');
			if(jQuery(this).hasClass('repeat'))
				get_obj.css('background-repeat','repeat');
			if(jQuery(this).hasClass('repeat-x'))
				get_obj.css('background-repeat','repeat-x');
			if(jQuery(this).hasClass('repeat-y'))
				get_obj.css('background-repeat','repeat-y');
			}
		);
	
	//SET FORM BACKGROUND POSITION
	jQuery(document).on('click','.bc-bg-position button',
		function()
			{
			jQuery('.bc-bg-position button').removeClass('active');
			jQuery(this).addClass('active');

			var get_obj = jQuery('.nf_ms_breadcrumb');
				
			if(jQuery(this).hasClass('left'))
				get_obj.css('background-position','left 0%');
			if(jQuery(this).hasClass('right'))
				get_obj.css('background-position','right 0%');
			if(jQuery(this).hasClass('center'))
				get_obj.css('background-position','50% 0%');
			}
		);
	
	jQuery(document).on('click','#do-upload-bc-image .fileinput-exists span',
		function()
			{
			jQuery('.nf_ms_breadcrumb').css('background-image','');
			}
		);
	
	
	
	
	
	
	/* TIMER */
	jQuery(document).on('click','.add-timer button',
		function()
			{
			jQuery('.add-timer button').removeClass('active');
			jQuery(this).addClass('active');


			if(jQuery(this).hasClass('yes'))
				{
				jQuery('.add-timer').attr('data-value','yes');
				jQuery('.timer-outer-container').removeClass('no-front-end');
				}
			else
				{
				jQuery('.add-timer').attr('data-value','no');
				jQuery('.timer-outer-container').addClass('no-front-end');
				}
				
			}
		);
	
	jQuery(document).on('click','.timer-add-to button',
		function()
			{
			jQuery('.timer-add-to button').removeClass('active');
			jQuery(this).addClass('active');
			
			var get_timer = jQuery('.timer-outer-container').detach();

			if(jQuery(this).hasClass('header'))
				{
				jQuery('.nex-forms-header').append(get_timer);
				jQuery('.timer-add-to').attr('data-value','header');
				}
			if(jQuery(this).hasClass('footer'))
				{
				jQuery('.nex-forms-footer').append(get_timer);
				jQuery('.timer-add-to').attr('data-value','footer');
				}
			}
		);
	
	
	jQuery(document).on('click','.timer-size button',
		function()
			{
			jQuery('.timer-size button').removeClass('active');
			jQuery(this).addClass('active');

			jQuery('.nf-timer').removeClass('extra-small');
			jQuery('.nf-timer').removeClass('small');
			jQuery('.nf-timer').removeClass('normal');
			jQuery('.nf-timer').removeClass('large');
			jQuery('.nf-timer').removeClass('extra-large');
			jQuery('.nf-timer').removeClass('super-size');
			
			if(jQuery(this).hasClass('extra-small'))
				{
				jQuery('.nf-timer').addClass('extra-small');
				jQuery('.timer-size').attr('data-value','extra-small');
				}
			else if(jQuery(this).hasClass('normal'))
				{
				jQuery('.nf-timer').addClass('normal');
				jQuery('.timer-size').attr('data-value','normal');
				}
			else if(jQuery(this).hasClass('large'))
				{
				jQuery('.nf-timer').addClass('large');
				jQuery('.timer-size').attr('data-value','large');
				}
			else if(jQuery(this).hasClass('extra-large'))
				{
				jQuery('.nf-timer').addClass('extra-large');
				jQuery('.timer-size').attr('data-value','extra-large');
				}
			else if(jQuery(this).hasClass('super-size'))
				{
				jQuery('.nf-timer').addClass('super-size');
				jQuery('.timer-size').attr('data-value','super-size');
				}	
			else
				{
				jQuery('.nf-timer').addClass('small');
				jQuery('.timer-size').attr('data-value','small');
				}
			nf_timer_rebuild('admin',jQuery('.nf-timer'), false,'');	
			}
		);
	
	
	jQuery(document).on('click','.timer-animation button',
		function()
			{
			jQuery('.timer-animation button').removeClass('active');
			jQuery(this).addClass('active');


			if(jQuery(this).hasClass('smooth'))
				{
				jQuery('.nf-timer').attr('data-timer-animation','smooth');
				jQuery('.timer-animation').attr('data-value','smooth');
				}
			else
				{
				jQuery('.nf-timer').attr('data-timer-animation','ticks');
				jQuery('.timer-animation').attr('data-value','ticks');
				}
				
			}
		);
		
	
	jQuery(document).on('click','.timer-position button',
		function()
			{
			
			jQuery('.nex-forms-header-footer').removeClass('timer_inline');
			jQuery('.nex-forms-header-footer').removeClass('timer_top');
			jQuery('.nex-forms-header-footer').removeClass('timer_bottom');
			
			jQuery('.timer-position button').removeClass('active');
			jQuery(this).addClass('active');


			if(jQuery(this).hasClass('timer_top'))
				{
				jQuery('.timer-position').attr('data-value','timer_top');
				jQuery('.nex-forms-header-footer').addClass('timer_top');
				}
			else if(jQuery(this).hasClass('timer_bottom'))
				{
				jQuery('.timer-position').attr('data-value','timer_bottom');
				jQuery('.nex-forms-header-footer').addClass('timer_bottom');
				}
			else
				{
				jQuery('.timer-position').attr('data-value','timer_inline');
				jQuery('.nex-forms-header-footer').addClass('timer_inline');
				}
				
			}
		);	
		
	
	
	jQuery(document).on('click','.timer-align button',
		function()
			{
			
			jQuery('.nex-forms-header-footer').removeClass('timer_left');
			jQuery('.nex-forms-header-footer').removeClass('timer_right');
			jQuery('.nex-forms-header-footer').removeClass('timer_center');
			
			jQuery('.timer-align button').removeClass('active');
			jQuery(this).addClass('active');


			if(jQuery(this).hasClass('timer_left'))
				{
				jQuery('.timer-align').attr('data-value','timer_left');
				jQuery('.nex-forms-header-footer').addClass('timer_left');
				}
			else if(jQuery(this).hasClass('timer_center'))
				{
				jQuery('.timer-align').attr('data-value','timer_center');
				jQuery('.nex-forms-header-footer').addClass('timer_center');
				}
			else
				{
				jQuery('.timer-align').attr('data-value','timer_right');
				jQuery('.nex-forms-header-footer').addClass('timer_right');
				}
				
			}
		);	
	
	
	jQuery(document).on('click','.timer-type button',
		function()
			{
			jQuery('.timer-type button').removeClass('active');
			jQuery(this).addClass('active');

			jQuery('.outer-container').removeClass('timer_overall');
			jQuery('.outer-container').removeClass('timer_per_step');

			if(jQuery(this).hasClass('overall'))
				{
				jQuery('.outer-container').addClass('timer_overall');
				jQuery('.timer-type').attr('data-value','overall');
				}
			else
				{
				jQuery('.timer-type').attr('data-value','per_step');
				jQuery('.outer-container').addClass('timer_per_step');
				}
				
			}
		);
	
	
	
	jQuery(document).on('keyup','#timer_hours_label',
		function()
			{
			jQuery('.nf-timer').attr('data-timer-hours-label',jQuery(this).val());
			nf_timer_rebuild('admin',jQuery('.nf-timer'), false,'');	
			}
		);
	jQuery(document).on('keyup','#timer_minutes_label',
		function()
			{
			jQuery('.nf-timer').attr('data-timer-minutes-label',jQuery(this).val());
			nf_timer_rebuild('admin',jQuery('.nf-timer'), false,'');	
			}
		);
	jQuery(document).on('keyup','#timer_seconds_label',
		function()
			{
			jQuery('.nf-timer').attr('data-timer-seconds-label',jQuery(this).val());
			nf_timer_rebuild('admin',jQuery('.nf-timer'), false,'');	
			}
		);
	
	
	
	
	jQuery("#timer_hours_color").spectrum(
		{
		 
		 type: "text",
		togglePaletteOnly: "true",
		hideAfterPaletteSelect: "true",
		showInput: "true",
		showInitial: "true",

		 color: '#2979FF',
		 move: function(color)
			{
			jQuery('.nf-timer').attr('data-timer-hours-color',jQuery(this).val())
			nf_timer_rebuild('ui',jQuery('.nf-timer'), false,'');
			}
		});
	jQuery("#timer_minutes_color").spectrum(
		{
		 
		 type: "text",
		togglePaletteOnly: "true",
		hideAfterPaletteSelect: "true",
		showInput: "true",
		showInitial: "true",
		 color: '#2979FF',
		 move: function(color)
			{
			jQuery('.nf-timer').attr('data-timer-minutes-color',jQuery(this).val())
			nf_timer_rebuild('ui',jQuery('.nf-timer'), false,'');
			}
		});
	jQuery("#timer_seconds_color").spectrum(
		{
		 
		 type: "text",
		togglePaletteOnly: "true",
		hideAfterPaletteSelect: "true",
		showInput: "true",
		showInitial: "true",
		 color: '#2979FF',
		 move: function(color)
			{
			jQuery('.nf-timer').attr('data-timer-seconds-color',jQuery(this).val())
			nf_timer_rebuild('ui',jQuery('.nf-timer'), false,'');
			}
		});
	
	
	
	
	
	jQuery("#timer_text_color").spectrum(
		{
		 
		 type: "text",
		togglePaletteOnly: "true",
		hideAfterPaletteSelect: "true",
		showInput: "true",
		showInitial: "true",
		 color: '#888',
		 move: function(color)
			{
			jQuery('.nf-timer').attr('data-timer-text-color',jQuery(this).val())
			nf_timer_rebuild('ui',jQuery('.nf-timer'), false,'');
			}
		});
	
	jQuery(document).on('click','.timer-bold',
			function()
				{
				if(jQuery(this).hasClass('active'))
					{
					jQuery(this).removeClass('active');
					jQuery('.timer-inner-container').css('font-weight','normal')
					}
				else
					{
					jQuery(this).addClass('active');	
					jQuery('.timer-inner-container').css('font-weight','bold')
					}
				}
			);
		jQuery(document).on('click','.timer-italic',
			function()
				{
				if(jQuery(this).hasClass('active'))
					{
					jQuery(this).removeClass('active');
					jQuery('.timer-inner-container').css('font-style','normal')
					}
				else
					{
					jQuery(this).addClass('active');	
					jQuery('.timer-inner-container').css('font-style','italic')
					}
				}
			);
	
	
	 
	jQuery("#timer_inner_circle_color").spectrum(
		{
		 
		 type: "text",
		togglePaletteOnly: "true",
		hideAfterPaletteSelect: "true",
		showInput: "true",
		showInitial: "true",
		 color: '#aaaaaa',
		 move: function(color)
			{
			jQuery('.nf-timer').attr('data-timer-inner-circle-color',jQuery(this).val())
			nf_timer_rebuild('ui',jQuery('.nf-timer'), false,'');
			}
		});
	
	
	jQuery("#timer_hours_color").spectrum('set', jQuery('.nf-timer').attr('data-timer-hours-color'));
	jQuery("#timer_minutes_color").spectrum('set', jQuery('.nf-timer').attr('data-timer-minutes-color'));
	jQuery("#timer_seconds_color").spectrum('set', jQuery('.nf-timer').attr('data-timer-seconds-color'));
	jQuery("#timer_text_color").spectrum('set', jQuery('.nf-timer').attr('data-timer-text-color'));
	jQuery("#timer_inner_circle_color").spectrum('set', jQuery('.nf-timer').attr('data-timer-inner-circle-color'));
	
	
	jQuery( "#timer_bg_width" ).spinner(
		{  
		min:0.0,
		max:2.5,
		step:0.1,
		spin: function( event, ui ) 
				{
				jQuery('.nf-timer').attr('data-timer-bg-width',ui.value);
				}
		}
	).on('keyup', function(e)
		{
		jQuery('.nf-timer').attr('data-timer-bg-width',jQuery(this).val());
		nf_timer_rebuild('admin',jQuery('.nf-timer'), false,'');
		}).on('spinstop', function(e)
			{
			nf_timer_rebuild('admin',jQuery('.nf-timer'), false,'');
			})
	
	
	jQuery( "#timer_fg_width" ).spinner(
		{  
		min:0.00,
		max:2.00,
		step:0.01,
		spin: function( event, ui ) 
				{
				jQuery('.nf-timer').attr('data-timer-fg-width',ui.value);
				}
		}
	).on('keyup', function(e)
		{
		jQuery('.nf-timer').attr('data-timer-fg-width',jQuery(this).val());
		nf_timer_rebuild('admin',jQuery('.nf-timer'), false,'');
		}).on('spinstop', function(e)
			{
			nf_timer_rebuild('admin',jQuery('.nf-timer'), false,'');
			})
	
	
	
	jQuery( "#timer_start" ).spinner(
		{  
		min:1,
		max:jQuery('.nex-forms-container .step').length,
		step:1,
		spin: function( event, ui ) 
				{
				jQuery('.nf-timer').attr('data-timer-start',ui.value);
				}
		}
	).on('keyup', function(e)
		{
		jQuery('.nf-timer').attr('data-timer-start',jQuery(this).val());
		})
		
	
	
	jQuery( "#timer_end" ).spinner(
		{  
		min:0,
		max:jQuery('.nex-forms-container .step').length,
		step:1,
		spin: function( event, ui ) 
				{
				jQuery('.nf-timer').attr('data-timer-end',ui.value);
				}
		}
	).on('keyup', function(e)
		{
		jQuery('.nf-timer').attr('data-timer-end',jQuery(this).val());
		})	
	
	
	
	
	jQuery(document).on('click','.timer-direction button',
		function()
			{
			jQuery('.timer-direction button').removeClass('active');
			jQuery(this).addClass('active');


			if(jQuery(this).hasClass('clockwise'))
				{
				jQuery('.timer-direction').attr('data-value','clockwise');
				jQuery('.nf-timer').attr('data-timer-direction','clockwise');
				}
			else
				{
				jQuery('.timer-direction').attr('data-value','anti-clockwise');
				jQuery('.nf-timer').attr('data-timer-direction','anti-clockwise');
				}
			nf_timer_rebuild('admin',jQuery('.nf-timer'), false,'');	
			}
		);
	
	
	jQuery(document).on('click','.enabled_units button',
			function()
				{
				//jQuery('.disabled_hours button').removeClass('active');
				jQuery(this).toggleClass('active');
				var enabled_units = ''
				jQuery('.enabled_units button').each(
					function()
						{
						if(jQuery(this).hasClass('active'))
							{
							enabled_units += jQuery(this).attr('data-val')+',';
							}
						}
					);
				enabled_units = enabled_units.replace(/,\s*$/, "");
				jQuery('.enabled_units').attr('data-value',enabled_units);
				jQuery('.nf-timer').attr('data-enabled-units',enabled_units);
				
				
				
				//current_field.find('#datetimepicker').datetimepicker('destroy');
				//setup_form_element(current_field);
				nf_timer_rebuild('admin',jQuery('.nf-timer'), false,'');
				
				
				}
			);
	
	
	jQuery( "#timer_hours" ).spinner(
		{  
		min:0,
		max:24,
		spin: function( event, ui ) 
				{
				jQuery('.nf-timer').attr('data-timer-hours',ui.value);
				}
		}
	).on('keyup', function(e)
		{
		jQuery('.nf-timer').attr('data-timer-hours',jQuery(this).val());
		nf_timer_rebuild('admin',jQuery('.nf-timer'), false,'');
		}).on('spinstop', function(e)
			{
			nf_timer_rebuild('admin',jQuery('.nf-timer'), false,'');
			})
	
	
	jQuery( "#timer_minutes" ).spinner(
		{  
		min:0,
		max:60,
		spin: function( event, ui ) 
				{
				jQuery('.nf-timer').attr('data-timer-minutes',ui.value);
				}
		}
	).on('keyup', function(e)
		{
		jQuery('.nf-timer').attr('data-timer-minutes',jQuery(this).val());
		nf_timer_rebuild('admin',jQuery('.nf-timer'), false,'');
		}).on('spinstop', function(e)
			{
			nf_timer_rebuild('admin',jQuery('.nf-timer'), false,'');
			})
	
	
	
	jQuery( "#timer_seconds" ).spinner(
		{  
		min:0,
		max:60,
		spin: function( event, ui ) 
				{
				jQuery('.nf-timer').attr('data-timer-seconds',ui.value);
				}
		}
	).on('keyup', function(e)
		{
		jQuery('.nf-timer').attr('data-timer-seconds',jQuery(this).val());
		nf_timer_rebuild('admin',jQuery('.nf-timer'), false,'');
		}).on('spinstop', function(e)
			{
			nf_timer_rebuild('admin',jQuery('.nf-timer'), false,'');
			})
	
	
	
	
	
	
	jQuery( "#timer-brd-radius" ).spinner(
		{ 
		min:0, 
		max:100,  
		spin: function( event, ui ) 
				{
				jQuery('.timer-inner-container').css('border-radius', ui.value +'px');
				}
		}
	).on('keyup', function(e)
			{
			jQuery('.timer-inner-container').css('border-radius', jQuery(this).val() +'px');
			});
	
	jQuery( "#timer-brd-size" ).spinner(
		{ 
		min:0, 
		max:50,  
		spin: function( event, ui ) 
				{
				jQuery('.timer-inner-container').css('border-width', ui.value +'px');
				}
		}
	).on('keyup', function(e)
			{
			jQuery('.timer-inner-container').css('border-width', jQuery(this).val() +'px');
			});
	
	
	
	jQuery(".timer-bg-color").spectrum(
		{
		 
		 type: "text",
		togglePaletteOnly: "true",
		hideAfterPaletteSelect: "true",
		showInput: "true",
		showInitial: "true",
		 color: '#fff',
		 move: function(color)
			{
			jQuery('.timer-inner-container').css('background',jQuery(this).val())
			}
		});
	jQuery(".timer-brd-color").spectrum(
		{
		 
		 type: "text",
		togglePaletteOnly: "true",
		hideAfterPaletteSelect: "true",
		showInput: "true",
		showInitial: "true",
		 color: '#ddd',
		 move: function(color)
			{
			jQuery('.timer-inner-container').css('border-color',jQuery(this).val())
			}
		});
	
	
	
	
	jQuery(".timer-crumb-bg-color").spectrum(
		{
		 
		 type: "text",
		togglePaletteOnly: "true",
		hideAfterPaletteSelect: "true",
		showInput: "true",
		showInitial: "true",
		 color: '#fff',
		 move: function(color)
			{
			jQuery('.timer-inner-container li').css('background',jQuery(this).val())
			}
		});
	jQuery(".timer-crumb-text-color").spectrum(
		{
		 
		 type: "text",
		togglePaletteOnly: "true",
		hideAfterPaletteSelect: "true",
		showInput: "true",
		showInitial: "true",
		 color: '#888',
		 move: function(color)
			{
			jQuery('.timer-inner-container li *').css('color',jQuery(this).val());
			}
		});
	jQuery(".timer-crumb-border-color").spectrum(
		{
		 
		 type: "text",
		togglePaletteOnly: "true",
		hideAfterPaletteSelect: "true",
		showInput: "true",
		showInitial: "true",
		 color: '#eaeaea',
		 move: function(color)
			{
			jQuery('.timer-inner-container li').css('border-color',jQuery(this).val())
			}
		});
	jQuery(".timer-crumb-connector-color").spectrum(
		{
		 
		 type: "text",
		togglePaletteOnly: "true",
		hideAfterPaletteSelect: "true",
		showInput: "true",
		showInitial: "true",
		 color: '#ddd',
		 move: function(color)
			{
			jQuery('.timer-inner-container li .step_connecter').css('border-color',jQuery(this).val())
			}
		});
	
	
	
	
	jQuery('.timer-drop-shadow').click(
		function()
			{
			if(jQuery(this).hasClass('active'))
				{
				jQuery('.timer-inner-container').css('box-shadow','');	
				jQuery(this).removeClass('active');
				}
			else
				{
				jQuery('.timer-drop-shadow').removeClass('active');
				jQuery(this).addClass('active');
				
				if(jQuery(this).hasClass('shadow-light'))
					{
					jQuery('.timer-inner-container').css('box-shadow','0 7px 16px 0 rgba(0, 0, 0, 0.2)');
					}
				else if(jQuery(this).hasClass('shadow-dark'))
					{
					jQuery('.timer-inner-container').css('box-shadow','0 7px 16px 0 rgba(0, 0, 0, 0.6)');
					}
				else
					{
					jQuery('.timer-inner-container').css('box-shadow','');
					}
				}
			}
		);
	
	
	
	
	//SET BACKGROUND IMAGE
		
		jQuery(document).on('click','#do-upload-timer-image .fileinput-exists span',
		function()
			{
			jQuery('.timer-inner-container').css('background-image','');
			}
		);
		
		
		jQuery(document).on('change','#do-upload-timer-image input',
		function()
			{
			jQuery('#do-upload-timer-image').submit();
			}
		)
		jQuery('#do-upload-timer-image').ajaxForm(
			{
			data:{action: 'do_upload_image'},
			beforeSubmit: function(formData, jqForm, options) {},
			success : function(responseText, statusText, xhr, $form)
				{
				if(responseText)
					{
					var img_attr = 	JSON.parse(responseText);
					}
				else
					{
					img_attr = '';	
					}
				if(responseText)
					jQuery('.timer-inner-container').css('background-image','url("'+ img_attr['image_url'] +'")')
				else
					jQuery('.timer-inner-container').css('background-image',jQuery('.timer-bg-color').val());
				},
			error: function(jqXHR, textStatus, errorThrown){/*console.log(errorThrown)*/}
			}
		);	
	
		
	
	
	
	
	
	
	//SET FORM BACKGROUND SIZE
	jQuery(document).on('click','.timer-bg-size button',
		function()
			{
			jQuery('.timer-bg-size button').removeClass('active');
			jQuery(this).addClass('active');

			var get_obj = jQuery('.timer-inner-container');
				
			if(jQuery(this).hasClass('auto'))
				get_obj.css('background-size','auto');
			if(jQuery(this).hasClass('cover'))
				get_obj.css('background-size','cover');
			if(jQuery(this).hasClass('contain'))
				get_obj.css('background-size','contain');
			}
		);
	
	//SET FORM BACKGROUND SIZE
	jQuery(document).on('click','.timer-bg-repeat button',
		function()
			{
			jQuery('.timer-bg-repeat button').removeClass('active');
			jQuery(this).addClass('active');

			var get_obj = jQuery('.timer-inner-container');
				
			if(jQuery(this).hasClass('no-repeat'))
				get_obj.css('background-repeat','no-repeat');
			if(jQuery(this).hasClass('repeat'))
				get_obj.css('background-repeat','repeat');
			if(jQuery(this).hasClass('repeat-x'))
				get_obj.css('background-repeat','repeat-x');
			if(jQuery(this).hasClass('repeat-y'))
				get_obj.css('background-repeat','repeat-y');
			}
		);
	
	//SET FORM BACKGROUND POSITION
	jQuery(document).on('click','.timer-bg-position button',
		function()
			{
			jQuery('.timer-bg-position button').removeClass('active');
			jQuery(this).addClass('active');

			var get_obj = jQuery('.timer-inner-container');
				
			if(jQuery(this).hasClass('left'))
				get_obj.css('background-position','left 0%');
			if(jQuery(this).hasClass('right'))
				get_obj.css('background-position','right 0%');
			if(jQuery(this).hasClass('center'))
				get_obj.css('background-position','50% 0%');
			}
		);
	
	jQuery(document).on('click','#do-upload-timer-image .fileinput-exists span',
		function()
			{
			jQuery('.timer-inner-container').css('background-image','');
			}
		);
	
	
	
	
	
	
	
	
	
	
	
	
	jQuery(".form_canvas").animate(
			{
			scrollTop:0

			},10
		);
	jQuery("#fields_dropdown").animate(
			{
			scrollTop:0
			},10
		);
	jQuery(".inner").animate(
			{
			scrollTop:0
			},10
		);
	
/* OVERALL FORM SETTINGS */
	
	jQuery( "#label_font_size" ).spinner(
		{ 
		min:10, 
		max:30,  
		spin: function( event, ui ) 
				{
				jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field span.the_label').css('font-size',ui.value+'px');
				jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field #md_label').css('font-size',ui.value+'px');
				}
		}
	).on('keyup', function(e)
				{
				jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field span.the_label').css('font-size',jQuery(this).val()+'px');
				jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field #md_label').css('font-size',jQuery(this).val()+'px');
				});	
	
	jQuery( "#input_font_size" ).spinner(
		{ 
		min:10, 
		max:30,  
		spin: function( event, ui ) 
				{
				jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field input.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field select.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field textarea.the_input_element').css('font-size',ui.value+'px');
				}
		}
	).on('keyup', function(e)
				{
				jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field input.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field select.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field textarea.the_input_element').css('font-size',jQuery(this).val()+'px');
				});	
	
	jQuery( "#icon_font_size" ).spinner(
		{ 
		min:10, 
		max:35,  
		spin: function( event, ui ) 
				{
				jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field span.prefix span, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field span.postfix span, .material-icons.fa').css('font-size',ui.value+'px');
				}
		}
	).on('keyup', function(e)
			{
			jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field span.prefix span, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field span.postfix span, .material-icons.fa').css('font-size',jQuery(this).val()+'px');
			});	
	
	jQuery( "#field_spacing" ).spinner(
		{ 
		min:-20, 
		spin: function( event, ui ) 
				{
				jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field.common_fields, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field.selection_fields, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field.survey_fields, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field.special_fields, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field.upload_fields, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field.preset_fields, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field.button_fields, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field.html_fields').css('margin-bottom',ui.value+'px');
				}
		}
	).on('keyup', function(e)
			{
			jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field.common_fields, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field.selection_fields, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field.survey_fields, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field.special_fields, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field.upload_fields, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field.preset_fields, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field.button_fields, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field.html_fields').css('margin-bottom',jQuery(this).val()+'px');
			});	
	
	
	
	jQuery( "#form_padding" ).spinner(
		{ 
		min:0, 
		max:100,  
		spin: function( event, ui ) 
				{
				jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').css('padding',ui.value+'px');
				}
		}
	).on('keyup', function(e)
			{
			jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').css('padding',jQuery(this).val()+'px');
			});
	
	
	jQuery( "#wrapper-brd-radius" ).spinner(
		{ 
		min:0, 
		max:100,  
		spin: function( event, ui ) 
				{
				jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').css('border-radius', ui.value +'px');
				}
		}
	).on('keyup', function(e)
			{
			jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').css('border-radius', jQuery(this).val() +'px');
			});
	
	jQuery( "#wrapper-brd-size" ).spinner(
		{ 
		min:0, 
		max:50,  
		spin: function( event, ui ) 
				{
				jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').css('border-width', ui.value +'px');
				}
		}
	).on('keyup', function(e)
			{
			jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').css('border-width', jQuery(this).val() +'px');
			});
	
	jQuery('.drop-shadow').click(
		function()
			{
			if(jQuery(this).hasClass('active'))
				{
				jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').css('box-shadow','');	
				jQuery(this).removeClass('active');
				}
			else
				{
				jQuery('.drop-shadow').removeClass('active');
				jQuery(this).addClass('active');
				
				if(jQuery(this).hasClass('shadow-light'))
					{
					jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').css('box-shadow','0 7px 16px 0 rgba(0, 0, 0, 0.2)');
					}
				else if(jQuery(this).hasClass('shadow-dark'))
					{
					jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').css('box-shadow','0 7px 16px 0 rgba(0, 0, 0, 0.6)');
					}
				else
					{
					jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').css('box-shadow','');
					}
				}
			}
		);

	//jQuery('.settings-column-style .ui-spinner a.ui-spinner-down').html('<span class="fa fa-caret-down"></span>');
	//jQuery('.settings-column-style .ui-spinner a.ui-spinner-up').html('<span class="fa fa-caret-up"></span>');	
	//jQuery('.settings-column-style .ui-spinner').prepend('<span class="px_text">px</span>');	
	
	//change_color('wrapper-bg-color',jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container','background','')
	
	/*jQuery("." + trigger).spectrum(
		{
		 type: "text",
		  togglePaletteOnly: "true",
		  hideAfterPaletteSelect: "true",
		  showInput: "true",
		  showInitial: "true",
		 color: '#FFFFFF',
		 move: function(color) {
		*/	
	jQuery(".wrapper-bg-color").spectrum(
		{
		 
		 type: "text",
		togglePaletteOnly: "true",
		hideAfterPaletteSelect: "true",
		showInput: "true",
		showInitial: "true",
		 color: '#fff',
		 move: function(color)
			{
			jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').css('background',jQuery(this).val())
			}
		});
	jQuery(".wrapper-brd-color").spectrum(
		{
		 
		 type: "text",
		togglePaletteOnly: "true",
		hideAfterPaletteSelect: "true",
		showInput: "true",
		showInitial: "true",
		 color: '#ddd',
		 move: function(color)
			{
			jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').css('border-color',jQuery(this).val())
			}
		});
	
	
	
	//SET FORM BACKGROUND SIZE
	jQuery(document).on('click','.form-bg-size button',
		function()
			{
			jQuery('.form-bg-size button').removeClass('active');
			jQuery(this).addClass('active');

			var get_obj = jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container');
				
			if(jQuery(this).hasClass('auto'))
				get_obj.css('background-size','auto');
			if(jQuery(this).hasClass('cover'))
				get_obj.css('background-size','cover');
			if(jQuery(this).hasClass('contain'))
				get_obj.css('background-size','contain');
			}
		);
	
	//SET FORM BACKGROUND SIZE
	jQuery(document).on('click','.form-bg-repeat button',
		function()
			{
			jQuery('.form-bg-repeat button').removeClass('active');
			jQuery(this).addClass('active');

			var get_obj = jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container');
				
			if(jQuery(this).hasClass('no-repeat'))
				get_obj.css('background-repeat','no-repeat');
			if(jQuery(this).hasClass('repeat'))
				get_obj.css('background-repeat','repeat');
			if(jQuery(this).hasClass('repeat-x'))
				get_obj.css('background-repeat','repeat-x');
			if(jQuery(this).hasClass('repeat-y'))
				get_obj.css('background-repeat','repeat-y');
			}
		);
	
	//SET FORM BACKGROUND POSITION
	jQuery(document).on('click','.form-bg-position button',
		function()
			{
			jQuery('.form-bg-position button').removeClass('active');
			jQuery(this).addClass('active');

			var get_obj = jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container');
				
			if(jQuery(this).hasClass('left'))
				get_obj.css('background-position','left 0%');
			if(jQuery(this).hasClass('right'))
				get_obj.css('background-position','right 0%');
			if(jQuery(this).hasClass('center'))
				get_obj.css('background-position','50% 0%');
			}
		);
	
	jQuery(document).on('click','#do-upload-form-image .fileinput-exists span',
		function()
			{
			jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').css('background-image','');
			}
		);
	
	
	jQuery(document).on('click','.o-label-bold',
	function()
		{
		if(jQuery(this).hasClass('active'))
			{
			jQuery(this).removeClass('active');
			jQuery(jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field span.the_label, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field #md_label').removeClass('style_bold')
			}
		else
			{
			jQuery(this).addClass('active');	
			jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field span.the_label, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field #md_label').addClass('style_bold')
			}
		}
	);
	
	jQuery(document).on('click','.o-label-italic',
	function()
		{
		if(jQuery(this).hasClass('active'))
			{
			jQuery(this).removeClass('active');
			jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field span.the_label, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field #md_label').removeClass('style_italic')
			
			}
		else
			{
			jQuery(this).addClass('active');	
			jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field span.the_label, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field #md_label').addClass('style_italic')
			}
		}
	);
	
	jQuery(document).on('click','.o-label-underline',
	function()
		{
		if(jQuery(this).hasClass('active'))
			{
			jQuery(this).removeClass('active');
			jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field span.the_label, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field #md_label').removeClass('style_underline')
			}
		else
			{
			jQuery(this).addClass('active');	
			jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field span.the_label, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field #md_label').addClass('style_underline')
			}
		}
	);
	
	
	jQuery(document).on('click','.o-label-text-align',
	function()
		{
		jQuery('.o-label-text-align').removeClass('active');	
		jQuery(this).addClass('active');	
		
		jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field .label_container, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field #md_label').removeClass('align_left').removeClass('align_right').removeClass('align_center');
				
		if(jQuery(this).hasClass('_left'))
			jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field .label_container, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field #md_label').addClass('align_left');
		if(jQuery(this).hasClass('_right'))
			jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field .label_container, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field #md_label').addClass('align_right');
		if(jQuery(this).hasClass('_center'))
			jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field .label_container, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field #md_label').addClass('align_center');
		}
	);
	

	
	jQuery(document).on('change','#google_fonts_overall',
		function()
			{
			var get_pre_class = (jQuery('.form-canvas-area').attr('data-pre-class')) ? jQuery('.form-canvas-area').attr('data-pre-class') : jQuery('.form-canvas-area').attr('data-sec-pre-class');
			nf_apply_font(jQuery(get_pre_class+' .form_field span.the_label'), 'google_fonts_overall');
			nf_apply_font(jQuery(get_pre_class+' .form_field span.sub_label'), 'google_fonts_overall');
			nf_apply_font(jQuery(get_pre_class+' .form_field #md_label'), 'google_fonts_overall');
			nf_apply_font(jQuery(get_pre_class+' .form_field .radio-inline'), 'google_fonts_overall');
			nf_apply_font(jQuery(get_pre_class+' .form_field .checkbox-inline'), 'google_fonts_overall');
			nf_apply_font(jQuery(get_pre_class+' .form_field .input-label'), 'google_fonts_overall');
			nf_apply_font(jQuery(get_pre_class+' .form_field .the_input_element'), 'google_fonts_overall');
			nf_apply_font(jQuery(get_pre_class+' .form_field .panel-heading'), 'google_fonts_overall');
			nf_apply_font(jQuery(get_pre_class+' .form_field .icon-label'), 'google_fonts_overall');
			
			}
		);
	jQuery(document).on('change','#google_fonts_lable',
		function()
			{
			nf_apply_font(jQuery(jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field span.the_label'), 'google_fonts_lable');
			nf_apply_font(jQuery(jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field span.sub_label'), 'google_fonts_lable');
			nf_apply_font(jQuery(jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field #md_label'), 'google_fonts_lable');
			nf_apply_font(jQuery(jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field .radio-inline'), 'google_fonts_lable');
			nf_apply_font(jQuery(jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field .checkbox-inline'), 'google_fonts_lable');
			nf_apply_font(jQuery(jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field .input-label'), 'google_fonts_lable');
			}
		);
		
		
		
	jQuery(document).on('change','#google_fonts_input',
		function()
			{
			nf_apply_font(jQuery(jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field input.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field select.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field textarea.the_input_element'), 'google_fonts_input');
			}
		);
	
	jQuery(document).on('click','.o-input-bold',
	function()
		{
		if(jQuery(this).hasClass('active'))
			{
			jQuery(this).removeClass('active');
			jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field input.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field select.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field textarea.the_input_element').removeClass('style_bold')
			}
		else
			{
			jQuery(this).addClass('active');	
			jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field input.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field select.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field textarea.the_input_element').addClass('style_bold')
			}
		}
	);
	
	jQuery(document).on('click','.o-input-italic',
	function()
		{
		if(jQuery(this).hasClass('active'))
			{
			jQuery(this).removeClass('active');
			jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field input.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field select.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field textarea.the_input_element').removeClass('style_italic')
			
			}
		else
			{
			jQuery(this).addClass('active');	
			jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field input.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field select.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field textarea.the_input_element').addClass('style_italic')
			}
		}
	);
	
	jQuery(document).on('click','.o-input-underline',
	function()
		{
		if(jQuery(this).hasClass('active'))
			{
			jQuery(this).removeClass('active');
			jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field input.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field select.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field textarea.the_input_element').removeClass('style_underline')
			}
		else
			{
			jQuery(this).addClass('active');	
			jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field input.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field select.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field textarea.the_input_element').addClass('style_underline')
			}
		}
	);
	
	jQuery(document).on('click','.o-input-text-align',
		function()
			{
			jQuery('.o-input-text-align').removeClass('active');	
			jQuery(this).addClass('active');	
			
			jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field input.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field select.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field textarea.the_input_element').removeClass('align_left');
			jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field input.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field select.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field textarea.the_input_element').removeClass('align_right');
			jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field input.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field select.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field textarea.the_input_element').removeClass('align_center');
			
			
			if(jQuery(this).hasClass('_left'))
				jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field input.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field select.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field textarea.the_input_element').addClass('align_left');
			else if(jQuery(this).hasClass('_right'))
				jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field input.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field select.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field textarea.the_input_element').addClass('align_right');
			else if(jQuery(this).hasClass('_center'))
				jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field input.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field select.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field textarea.the_input_element').addClass('align_center');
			}
		);

	
	
	jQuery(document).on('click','button.set_layout',
			function()
				{
					
				jQuery('button.set_layout').removeClass('active');
				jQuery(this).addClass('active');
				
				var the_button = jQuery(this);

				jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field').each(
					function()
						{
						var label_container = jQuery(this).find('.label_container');
						var input_container = jQuery(this).find('.input_container');
						
						if(!jQuery(this).hasClass('step') && !jQuery(this).hasClass('material_field') && !jQuery(this).hasClass('button_fields') && !jQuery(this).hasClass('html_fields') &&  !jQuery(this).hasClass('other-elements') &&  !jQuery(this).hasClass('grid-system') )
							{
							if(the_button.hasClass('set_layout_top'))
								{
								label_container.show();
								label_container.removeClass('col-sm-1').removeClass('col-sm-2').removeClass('col-sm-3').removeClass('col-sm-4').removeClass('col-sm-5').removeClass('col-sm-6').removeClass('col-sm-7').removeClass('col-sm-8').removeClass('col-sm-9').removeClass('col-sm-10').removeClass('col-sm-11').removeClass('col-sm-12').removeClass('pos_right')
								label_container.addClass('col-sm-12');
								input_container.removeClass('col-sm-1').removeClass('col-sm-2').removeClass('col-sm-3').removeClass('col-sm-4').removeClass('col-sm-5').removeClass('col-sm-6').removeClass('col-sm-7').removeClass('col-sm-8').removeClass('col-sm-9').removeClass('col-sm-10').removeClass('col-sm-11').removeClass('col-sm-12')
								input_container.addClass('col-sm-12');
								
								var copy_label = label_container.clone();
								label_container.remove();
								input_container.before(copy_label);
								}
							if(the_button.hasClass('set_layout_left'))
								{
								label_container.show();
								label_container.removeClass('col-sm-1').removeClass('col-sm-2').removeClass('col-sm-3').removeClass('col-sm-4').removeClass('col-sm-5').removeClass('col-sm-6').removeClass('col-sm-7').removeClass('col-sm-8').removeClass('col-sm-9').removeClass('col-sm-10').removeClass('col-sm-11').removeClass('col-sm-12').removeClass('pos_right')
								label_container.addClass('col-sm-3');
								
								input_container.removeClass('col-sm-1').removeClass('col-sm-2').removeClass('col-sm-3').removeClass('col-sm-4').removeClass('col-sm-5').removeClass('col-sm-6').removeClass('col-sm-7').removeClass('col-sm-8').removeClass('col-sm-9').removeClass('col-sm-10').removeClass('col-sm-11').removeClass('col-sm-12')
								input_container.addClass('col-sm-9');
								
								var copy_label = label_container.clone();
								label_container.remove();
								input_container.before(copy_label);
								
								}
							
							if(the_button.hasClass('set_layout_right'))
								{
								label_container.show();
								label_container.removeClass('col-sm-1').removeClass('col-sm-2').removeClass('col-sm-3').removeClass('col-sm-4').removeClass('col-sm-5').removeClass('col-sm-6').removeClass('col-sm-7').removeClass('col-sm-8').removeClass('col-sm-9').removeClass('col-sm-10').removeClass('col-sm-11').removeClass('col-sm-12').addClass('pos_right')
								label_container.addClass('col-sm-3');
								
								input_container.removeClass('col-sm-1').removeClass('col-sm-2').removeClass('col-sm-3').removeClass('col-sm-4').removeClass('col-sm-5').removeClass('col-sm-6').removeClass('col-sm-7').removeClass('col-sm-8').removeClass('col-sm-9').removeClass('col-sm-10').removeClass('col-sm-11').removeClass('col-sm-12')
								input_container.addClass('col-sm-9');
								
								var copy_label = label_container.clone();
								label_container.remove();
								input_container.after(copy_label);
								
								}
							if(the_button.hasClass('set_layout_hide'))
								{
								input_container.removeClass('col-sm-1').removeClass('col-sm-2').removeClass('col-sm-3').removeClass('col-sm-4').removeClass('col-sm-5').removeClass('col-sm-6').removeClass('col-sm-7').removeClass('col-sm-8').removeClass('col-sm-9').removeClass('col-sm-10').removeClass('col-sm-11').removeClass('col-sm-12').removeClass('pos_right')
								input_container.addClass('col-sm-12');
								label_container.hide();
								}
							}
						}
					);
				}
	
	);
	
	jQuery(".o-input-color").spectrum(
		{
		 
		 type: "text",
		togglePaletteOnly: "true",
		hideAfterPaletteSelect: "true",
		showInput: "true",
		showInitial: "true",
		 color: jQuery('.overall-settings-column .o-input-color').val(),
		 move: function(color)
			{
			jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field input.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field select.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field textarea.the_input_element').css('color',jQuery(this).val())
			}
		});
	jQuery(".o-input-bg-color").spectrum(
		{
		 
		 type: "text",
		togglePaletteOnly: "true",
		hideAfterPaletteSelect: "true",
		showInput: "true",
		showInitial: "true",
		 color: jQuery('.overall-settings-column .o-input-bg-color').val(),
		 move: function(color)
			{
			jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field input.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field select.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field textarea.the_input_element').css('background',jQuery(this).val())
			}
		});
	jQuery(".o-input-border-color").spectrum(
		{
		 
		 type: "text",
		togglePaletteOnly: "true",
		hideAfterPaletteSelect: "true",
		showInput: "true",
		showInitial: "true",
		 color: jQuery('.overall-settings-column .o-input-border-color').val(),
		 move: function(color)
			{
			jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field input.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field select.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field textarea.the_input_element').css('border-color',jQuery(this).val())
			}
		});
	
	jQuery(".o-label-color").spectrum(
		{
		 
		 type: "text",
		togglePaletteOnly: "true",
		hideAfterPaletteSelect: "true",
		showInput: "true",
		showInitial: "true",
		 color: jQuery('.overall-settings-column .o-label-color').val(),
		 move: function(color)
			{
			jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field span.the_label, #md_label, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field .input-label, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field .radio-inline, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field .checkbox-inline').css('color',jQuery(this).val())
			}
		});
	
	
	
	jQuery(".o-icon-text-color").spectrum(
		{
		 
		 type: "text",
		togglePaletteOnly: "true",
		hideAfterPaletteSelect: "true",
		showInput: "true",
		showInitial: "true",
		 color: jQuery('.overall-settings-column .o-icon-text-color').val(),
		 move: function(color)
			{
			jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field span.prefix, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field span.postfix, .material-icons.fa').css('color',jQuery(this).val())
			}
		});
	jQuery(".o-icon-bg-color").spectrum(
		{
		 
		 type: "text",
		togglePaletteOnly: "true",
		hideAfterPaletteSelect: "true",
		showInput: "true",
		showInitial: "true",
		 color: jQuery('.overall-settings-column .o-icon-bg-color').val(),
		 move: function(color)
			{
			jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field span.prefix, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field span.postfix').css('background',jQuery(this).val())
			}
		});
	jQuery(".o-icon-brd-color").spectrum(
		{
		 
		 type: "text",
		togglePaletteOnly: "true",
		hideAfterPaletteSelect: "true",
		showInput: "true",
		showInitial: "true",
		 color: jQuery('.overall-settings-column .o-icon-brd-color').val(),
		 move: function(color)
			{
			jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field span.prefix, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field span.postfix').css('border-color',jQuery(this).val())
			}
		});
	
	
	var form_themes_run = new Tour({
		  name: "Form-Themes",
		  onStart: function(){ },
		  onEnd: function(){ },
		  template: "<div class='popover tour'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default tour-step-back' data-role='prev'><span class='fa fa-arrow-left'></span> PREV </button></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
		  steps: [
		  {
			
			element: "#nex-forms",
			title: "<strong>Form Themes Add-on Not Installed</strong>",
			content: "To enable this feature please install Form Themes for NEX-Forms Add-on. <a href='https://codecanyon.net/item/form-themes-for-nexforms/10037800?ref=Basix&src=backend' target='_blank' class='start-button' data-role='' style='display:block;'><span class='start-border'>Buy Now</span><span class='start-border-2 pulsate_1'></span></a>",
			template: "<div class='popover tour first-run tutorial-step-1 animated bounceInDown'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
			placement: 'bottom',
		  },
		  ]
		}
	);

	
	jQuery(document).on('click','.ft_not_installed',
			function()
				{
				form_themes_run.init();
				// Start the tour
				form_themes_run.restart();
				}
			);
	
	jQuery(document).on('click','.overall-error-style button',
			function()
				{
				jQuery('.overall-error-style button').removeClass('active');
				jQuery(this).addClass('active');
				
				if(jQuery(this).hasClass('classic'))
					{
					jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field').addClass('classic_error_style');	
					}
				else
					{
					jQuery('.form_field').removeClass('classic_error_style')
					}
				}
			);
	
	jQuery(document).on('click','.overall-error-position button',
			function()
				{
				jQuery('.overall-error-position button').removeClass('active');
				jQuery(this).addClass('active');
				
				if(jQuery(this).hasClass('set_left'))
					{
					jQuery('.form_field').removeClass('error_right')
					jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field').addClass('error_left');	
					}
				else
					{
					jQuery('.form_field').removeClass('error_left')	
					}
				}
			);
	
	//SET CORNERS
		
	
		jQuery(document).on('click','.overall-input-corners button',
			function()
				{
				jQuery('.overall-input-corners button').removeClass('active');
				jQuery(this).addClass('active');
				var corner = jQuery(this);
				jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field').each(
					function()
						{
						jQuery(this).removeClass('pill').removeClass('square');	
						
						if(corner.hasClass('square'))
							jQuery(this).addClass('square');
						if(corner.hasClass('pill'))
							{
							jQuery(this).addClass('pill');
							
							if(jQuery(this).find('.prefix').length>0)
								jQuery(this).addClass('has_prefix_icon')
								
								
							if(jQuery(this).find('.postfix').length>0)
								jQuery(this).addClass('has_postfix_icon')
							
							}
						
						}
					);
				
				
				}
			);
	
	
	
	
	
	jQuery(document).on('keyup',"textarea#custom_css",
		function()
			{
			jQuery('.custom_css_live').text(jQuery(this).val());
			}
		);
	jQuery('.outer_container').prepend('<div class="current-style-tool"><span class=""></span></div>');
	
	
	
		
	/*jQuery( "body" ).mousemove(function( event ) {
		 
		 jQuery('.current-style-tool').css('top',event.pageY);
		 jQuery('.current-style-tool').css('left',event.pageX);
		});*/
	
	
	/*jQuery(document).on('click','.styling-bar .styling-tool-item',
		function()
			{
			jQuery('#close-settings').trigger('click');
			jQuery('.nex-forms-container').removeClass('styling_field_layout').removeClass('styling_font_style').removeClass('styling_text_alignment').removeClass('styling_colors').removeClass('styling_size')
			if(jQuery(this).attr('data-style-tool-group')=='layout')
				jQuery('.nex-forms-container').addClass('styling_field_layout')
			if(jQuery(this).attr('data-style-tool-group')=='font-style')
				jQuery('.nex-forms-container').addClass('styling_font_style')
			if(jQuery(this).attr('data-style-tool-group')=='text-align')
				jQuery('.nex-forms-container').addClass('styling_text_alignment')
			if(jQuery(this).attr('data-style-tool-group')=='color')
				jQuery('.nex-forms-container').addClass('styling_colors')
			if(jQuery(this).attr('data-style-tool-group')=='size')
				jQuery('.nex-forms-container').addClass('styling_size')
			
			if(jQuery(this).hasClass('active') && jQuery(this).attr('data-style-tool')!='default-tool')
				{
				jQuery('[data-style-tool="default-tool"]').trigger('click')
				return;
				}
			jQuery('.styling-bar .styling-tool-item').removeClass('active');
			jQuery('.current-style-tool span').css('color','#444');
			if(jQuery(this).attr('data-style-tool')=='default-tool')
				{
				jQuery(this).addClass('active');
				jQuery('.nex-forms-container').removeClass('enable-form-styling')
				current_style_tool = '';
				jQuery('.current-style-tool span').attr('class','')
				}
			else
				{
				jQuery('.nex-forms-container').addClass('enable-form-styling')
				current_style_tool = jQuery(this).attr('data-style-tool');
				jQuery(this).addClass('active');	
				jQuery('.current-style-tool span').attr('class',jQuery(this).find('i').attr('class'))
				
				if(current_style_tool == 'set-font-color')
					{
					jQuery('.current-style-tool span').css('color',jQuery('input.font-color-tool').val());	
					}
				if(current_style_tool == 'set-background-color')
					{
					jQuery('.current-style-tool span').css('color',jQuery('input.background-color-tool').val());	
					}
				if(current_style_tool == 'set-border-color')
					{
					jQuery('.current-style-tool span').css('color',jQuery('input.border-color-tool').val());	
					}
				
				if(current_style_tool=='layout-top')
					{
					jQuery('.current-style-tool span').attr('class','fa fa-arrow-up')
					}
				if(current_style_tool=='layout-hide')
					{
					jQuery('.current-style-tool span').attr('class','fa fa-eye-slash')
					}
				if(current_style_tool=='layout-left')
					{
					jQuery('.current-style-tool span').attr('class','fa fa-arrow-left')
					}
				if(current_style_tool=='layout-right')
					{
					jQuery('.current-style-tool span').attr('class','fa fa-arrow-right')
					}
				
				}
			}
		);
	*/	
	jQuery(document).on('click','.nex-forms-container.enable-form-styling .label_container, .nex-forms-container.enable-form-styling .input_container',
		function()
			{
			if(current_style_tool=='align-left')
				jQuery(this).addClass('align_left').removeClass('align_center').removeClass('align_right');
			if(current_style_tool=='align-center')
				jQuery(this).addClass('align_center').removeClass('align_left').removeClass('align_right');
			if(current_style_tool=='align-right')
				jQuery(this).addClass('align_right').removeClass('align_center').removeClass('align_left');
				
			
			}
		);
	jQuery(document).on('click','.nex-forms-container.enable-form-styling .input_container .the_input_element',
		function()
			{
			if(current_style_tool=='align-left')
				jQuery(this).addClass('align_left').removeClass('align_center').removeClass('align_right');
			if(current_style_tool=='align-center')
				jQuery(this).addClass('align_center').removeClass('align_left').removeClass('align_right');
			if(current_style_tool=='align-right')
				jQuery(this).addClass('align_right').removeClass('align_center').removeClass('align_left');
				
			if(current_style_tool=='size-sm')
				jQuery(this).addClass('input-sm').removeClass('input-lg');
			if(current_style_tool=='size-normal')
				jQuery(this).removeClass('input-sm').removeClass('input-lg');
			if(current_style_tool=='size-lg')
				jQuery(this).addClass('input-lg').removeClass('input-sm');
				
			if(current_style_tool=='text-bold')
				{
				if(	jQuery(this).hasClass('style_bold'))
					jQuery(this).removeClass('style_bold')
				else
					jQuery(this).addClass('style_bold')
				}
			if(current_style_tool=='text-italic')
				{
				if(	jQuery(this).hasClass('style_italic'))
					jQuery(this).removeClass('style_italic')
				else
					jQuery(this).addClass('style_italic')
				}
			if(current_style_tool=='text-underline')
				{
				if(	jQuery(this).hasClass('style_underline'))
					jQuery(this).removeClass('style_underline')
				else
					jQuery(this).addClass('style_underline')
				}
			
			}
		);
	
	jQuery(document).on('click','.nex-forms-container.enable-form-styling #field_container',
		function()
			{
				
				var set_label_container = jQuery(this).find('.label_container');
				var set_input_container = jQuery(this).find('.input_container');
				
				if(current_style_tool=='layout-top')
					{
					set_label_container.show();
					set_label_container.removeClass('col-sm-1').removeClass('col-sm-2').removeClass('col-sm-3').removeClass('col-sm-4').removeClass('col-sm-5').removeClass('col-sm-6').removeClass('col-sm-7').removeClass('col-sm-8').removeClass('col-sm-9').removeClass('col-sm-10').removeClass('col-sm-11').removeClass('col-sm-12').removeClass('pos_right')
					set_label_container.addClass('col-sm-12');
					set_input_container.removeClass('col-sm-1').removeClass('col-sm-2').removeClass('col-sm-3').removeClass('col-sm-4').removeClass('col-sm-5').removeClass('col-sm-6').removeClass('col-sm-7').removeClass('col-sm-8').removeClass('col-sm-9').removeClass('col-sm-10').removeClass('col-sm-11').removeClass('col-sm-12')
					set_input_container.addClass('col-sm-12');
					
					var copy_label = set_label_container.clone();
					set_label_container.remove();
					set_input_container.before(copy_label);
					}
				if(current_style_tool=='layout-left')
					{
					set_label_container.show();
					set_label_container.removeClass('col-sm-1').removeClass('col-sm-2').removeClass('col-sm-3').removeClass('col-sm-4').removeClass('col-sm-5').removeClass('col-sm-6').removeClass('col-sm-7').removeClass('col-sm-8').removeClass('col-sm-9').removeClass('col-sm-10').removeClass('col-sm-11').removeClass('col-sm-12').removeClass('pos_right')
					set_label_container.addClass('col-sm-3');
					
					set_input_container.removeClass('col-sm-1').removeClass('col-sm-2').removeClass('col-sm-3').removeClass('col-sm-4').removeClass('col-sm-5').removeClass('col-sm-6').removeClass('col-sm-7').removeClass('col-sm-8').removeClass('col-sm-9').removeClass('col-sm-10').removeClass('col-sm-11').removeClass('col-sm-12')
					set_input_container.addClass('col-sm-9');
					
					var copy_label = set_label_container.clone();
					set_label_container.remove();
					set_input_container.before(copy_label);
					
					}
				
				if(current_style_tool=='layout-right')
					{
					set_label_container.show();
					set_label_container.removeClass('col-sm-1').removeClass('col-sm-2').removeClass('col-sm-3').removeClass('col-sm-4').removeClass('col-sm-5').removeClass('col-sm-6').removeClass('col-sm-7').removeClass('col-sm-8').removeClass('col-sm-9').removeClass('col-sm-10').removeClass('col-sm-11').removeClass('col-sm-12').addClass('pos_right')
					set_label_container.addClass('col-sm-3');
					
					set_input_container.removeClass('col-sm-1').removeClass('col-sm-2').removeClass('col-sm-3').removeClass('col-sm-4').removeClass('col-sm-5').removeClass('col-sm-6').removeClass('col-sm-7').removeClass('col-sm-8').removeClass('col-sm-9').removeClass('col-sm-10').removeClass('col-sm-11').removeClass('col-sm-12')
					set_input_container.addClass('col-sm-9');
					
					var copy_label = set_label_container.clone();
					set_label_container.remove();
					set_input_container.after(copy_label);
					
					}
				if(current_style_tool=='layout-hide')
					{
					set_input_container.removeClass('col-sm-1').removeClass('col-sm-2').removeClass('col-sm-3').removeClass('col-sm-4').removeClass('col-sm-5').removeClass('col-sm-6').removeClass('col-sm-7').removeClass('col-sm-8').removeClass('col-sm-9').removeClass('col-sm-10').removeClass('col-sm-11').removeClass('col-sm-12').removeClass('pos_right')
					set_input_container.addClass('col-sm-12');
					set_label_container.hide();
					set_input_container.find('input').attr('placeholder',set_label_container.find('.the_label').text());
					}
			}
			);
	
	jQuery(document).on('click','.nex-forms-container.enable-form-styling .label_container .the_label,.nex-forms-container.enable-form-styling .label_container .sub-text',
		function()
			{
				
			if(current_style_tool=='font-family')
				nf_apply_font(jQuery(this));	

			if(current_style_tool=='size-sm')
				jQuery(this).parent().addClass('text-sm').removeClass('text-lg');
			if(current_style_tool=='size-normal')
				jQuery(this).parent().removeClass('text-sm').removeClass('text-lg');
			if(current_style_tool=='size-lg')
				jQuery(this).parent().addClass('text-lg').removeClass('text-sm');	
				
			if(current_style_tool=='set-font-color')
				jQuery(this).css('color',jQuery('input.font-color-tool').val());
			
			if(current_style_tool=='text-bold')
				{
				if(	jQuery(this).hasClass('style_bold'))
					jQuery(this).removeClass('style_bold')
				else
					jQuery(this).addClass('style_bold')
				}
			if(current_style_tool=='text-italic')
				{
				if(	jQuery(this).hasClass('style_italic'))
					jQuery(this).removeClass('style_italic')
				else
					jQuery(this).addClass('style_italic')
				}
			if(current_style_tool=='text-underline')
				{
				if(	jQuery(this).hasClass('style_underline'))
					jQuery(this).removeClass('style_underline')
				else
					jQuery(this).addClass('style_underline')
				}
			
			}
		);
		
	
	
	jQuery(document).on('click','.nex-forms-container.enable-form-styling .input_container',
		function()
			{
			if(current_style_tool=='font-family')
				nf_apply_font(jQuery(this).find('.the_input_element'));
			
			if(current_style_tool=='set-font-color')
				{
				jQuery(this).find('.the_input_element').css('color',jQuery('input.font-color-tool').val());
				jQuery(this).find('label a').css('color',jQuery('input.font-color-tool').val());
				}
			if(current_style_tool=='set-background-color')
				{
				jQuery(this).find('.the_input_element').css('background',jQuery('input.background-color-tool').val());
				jQuery(this).find('label a').css('background',jQuery('input.background-color-tool').val());
				}
			if(current_style_tool=='set-border-color')
				{
				jQuery(this).find('.the_input_element').css('border-color',jQuery('input.border-color-tool').val());
				jQuery(this).find('label a').css('border-color',jQuery('input.border-color-tool').val());
				}
			}
		);
	jQuery(document).on('click','.nex-forms-container.enable-form-styling .input-label',
		function()
			{
			if(current_style_tool=='set-font-color')
				jQuery(this).parent().parent().find('.input-label').css('color',jQuery('input.font-color-tool').val());
			
			if(current_style_tool=='font-family')
				nf_apply_font(jQuery(this).parent().parent().find('.input-label'));	
				
			}
		);
	
	jQuery(document).on('click','.nex-forms-container.enable-form-styling .form_field .panel-heading ',
		function()
			{
			if(current_style_tool=='set-font-color')
				jQuery(this).css('color',jQuery('input.font-color-tool').val());
			if(current_style_tool=='set-background-color')
				jQuery(this).css('background',jQuery('input.background-color-tool').val());
			if(current_style_tool=='set-border-color')
				jQuery(this).css('border-bottom-color',jQuery('input.border-color-tool').val());
			
			if(current_style_tool=='size-sm')
				jQuery(this).addClass('btn-sm').removeClass('btn-lg');
			if(current_style_tool=='size-normal')
				jQuery(this).removeClass('btn-sm').removeClass('btn-lg');
			if(current_style_tool=='size-lg')
				jQuery(this).addClass('btn-lg').removeClass('btn-sm');	
			
			if(current_style_tool=='font-family')
				nf_apply_font(jQuery(this));	
			
			if(current_style_tool=='text-bold')
				{
				if(	jQuery(this).hasClass('style_bold'))
					jQuery(this).removeClass('style_bold')
				else
					jQuery(this).addClass('style_bold')
				}
			if(current_style_tool=='text-italic')
				{
				if(	jQuery(this).hasClass('style_italic'))
					jQuery(this).removeClass('style_italic')
				else
					jQuery(this).addClass('style_italic')
				}
			if(current_style_tool=='text-underline')
				{
				if(	jQuery(this).hasClass('style_underline'))
					jQuery(this).removeClass('style_underline')
				else
					jQuery(this).addClass('style_underline')
				}
			
			if(current_style_tool=='align-left')
				jQuery(this).addClass('align_left').removeClass('align_center').removeClass('align_right');
			if(current_style_tool=='align-center')
				jQuery(this).addClass('align_center').removeClass('align_left').removeClass('align_right');
			if(current_style_tool=='align-right')
				jQuery(this).addClass('align_right').removeClass('align_center').removeClass('align_left');
				
			}
		);
		
	jQuery(document).on('click','.nex-forms-container.enable-form-styling .form_field .panel-body ',
		function()
			{
			
			if(current_style_tool=='set-background-color')
				jQuery(this).css('background',jQuery('input.background-color-tool').val());
			if(current_style_tool=='set-border-color')
				jQuery(this).parent().css('border-color',jQuery('input.border-color-tool').val());

			}
		);
	
	jQuery(document).on('click','.nex-forms-container.enable-form-styling .img-thumbnail',
		function()
			{
			if(current_style_tool=='set-border-color')
				jQuery(this).css('border-color',jQuery('input.border-color-tool').val());
			if(current_style_tool=='set-border-color')
				jQuery(this).css('background',jQuery('input.background-color-tool').val());
			}
		);
	
	jQuery(document).on('click','.nex-forms-container.enable-form-styling .input-group-addon',
		function()
			{
			if(current_style_tool=='set-font-color')
				jQuery(this).css('color',jQuery('input.font-color-tool').val());
			if(current_style_tool=='set-background-color')
				jQuery(this).css('background',jQuery('input.background-color-tool').val());
			if(current_style_tool=='set-border-color')
				jQuery(this).css('border-color',jQuery('input.border-color-tool').val());
			}
		);
		

	jQuery('.font-color-tool').spectrum(
		{
		 placement: 'right',
		 hsvpanel: true,
		 type: "text",
		togglePaletteOnly: "true",
		hideAfterPaletteSelect: "true",
		showInput: "true",
		showInitial: "true",
		 color: '#444444',
		 move: function(color)
			{
			if(current_style_tool=='set-font-color')
				jQuery('.current-style-tool span').css('color',jQuery('input.font-color-tool').val());	
			}
		}
	);
	
	jQuery('.background-color-tool').spectrum(
		{
		 placement: 'right',
		 hsvpanel: true,
		 type: "text",
		togglePaletteOnly: "true",
		hideAfterPaletteSelect: "true",
		showInput: "true",
		showInitial: "true",
		 color: '#FFFFFF',
		 move: function(color)
			{
			if(current_style_tool=='set-background-color')
				jQuery('.current-style-tool span').css('color',jQuery('input.background-color-tool').val());	
			}
		}
	);
	
	jQuery('.border-color-tool').spectrum(
		{
		 placement: 'right',
		 hsvpanel: true,
		 type: "text",
		togglePaletteOnly: "true",
		hideAfterPaletteSelect: "true",
		showInput: "true",
		showInitial: "true",
		 color: '#bbbbbb',
		 move: function(color)
			{
			if(current_style_tool=='set-border-color')
				jQuery('.current-style-tool span').css('color',jQuery('input.border-color-tool').val());	
			}
		}
	);
	
	
	
	
	

	
	jQuery(document).on('click','.field-settings-column #close-settings',
		function()
			{
			jQuery('.edit-done').remove();
			jQuery('.currently_editing_field').removeClass('currently_editing_field');
			jQuery('.currently_editing_settings').remove();
			jQuery('.show_field_type').removeClass('show_field_type');
			jQuery('.form_field').removeClass('currently_editing');
			jQuery('.field-settings-column').removeClass('open_sidenav');
			jQuery('.form_canvas').removeClass('settings-opened');
			jQuery('div.field-settings-column .current_id').text('');
			
			}
		);
	
	jQuery(document).on('click','.overall-settings-column #close-settings',
		function()
			{
			jQuery('.overall-settings-column').removeClass('open_sidenav');
			jQuery('.overall-styling-btn').removeClass('active');
			jQuery('.multi-step-settings-btn').removeClass('active');
			jQuery('.form_canvas').removeClass('overall-opened');
			jQuery('.settings_more_styling_options .btn').removeClass('active');
			}
		);
	get_multistep_settings(jQuery('.nf_ms_breadcrumb'))
	jQuery(document).on('click', '.bc_settings', 
		function()
			{
				jQuery('.overall-settings-column').removeClass('open_sidenav');
				jQuery('.mutistep-settings-column').addClass('open_sidenav');
				jQuery('.multi-step-settings-btn').addClass('active');
				jQuery('.form_canvas').addClass('overall-opened');
				jQuery('.conditional_logic_wrapper #close-settings').trigger('click');
				jQuery('.field-settings-column #close-settings').trigger('click');
				jQuery('#ms-css-settings a').trigger('click');
				
				//get_multistep_settings(jQuery('.nf_ms_breadcrumb'))
				
			}
		);
	
	get_timer_settings(jQuery('.timer-inner-container'))
	jQuery(document).on('click', '.timer_settings', 
		function()
			{
				jQuery('.overall-settings-column').removeClass('open_sidenav');
				jQuery('.mutistep-settings-column').addClass('open_sidenav');
				jQuery('.multi-step-settings-btn').addClass('active');
				jQuery('.form_canvas').addClass('overall-opened');
				jQuery('.conditional_logic_wrapper #close-settings').trigger('click');
				jQuery('.field-settings-column #close-settings').trigger('click');
				jQuery('#ms-timer-settings a').trigger('click');
				
				//get_multistep_settings(jQuery('.nf_ms_breadcrumb'))
				
			}
		);
	
	
	jQuery(document).on('click', '.multi-step-settings-btn', 
		function()
			{
			if(jQuery(this).hasClass('active'))
				{
				jQuery('.mutistep-settings-column #close-settings').trigger('click');	
				}
			else
				{
				jQuery('.mutistep-settings-column').addClass('open_sidenav');
				jQuery('.multi-step-settings-btn').addClass('active');
				jQuery('.form_canvas').addClass('overall-opened');
				jQuery('.conditional_logic_wrapper #close-settings').trigger('click');
				jQuery('.field-settings-column #close-settings').trigger('click');
				
				//get_multistep_settings(jQuery('.nf_ms_breadcrumb'))
				}
			}
		);
	
	jQuery(document).on('click', '.settings_more_styling_options .btn', 
		function()
			{
			jQuery('.overall-styling-btn').trigger('click');
			jQuery('#form-settings a').trigger('click');
			}
		);
	
	jQuery(document).on('click', '.overall-styling-btn', 
		function()
			{
			if(jQuery(this).hasClass('active'))
				{
				jQuery('.overall-settings-column #close-settings').trigger('click');	
				}
			else
				{
				
				jQuery('.overall-settings-column').addClass('open_sidenav');
				jQuery('.overall-styling-btn').addClass('active');
				jQuery('.settings_more_styling_options .btn').addClass('active');
				jQuery('.form_canvas').addClass('overall-opened');
				jQuery('.conditional_logic_wrapper #close-settings').trigger('click');
				jQuery('.field-settings-column #close-settings').trigger('click');
				setTimeout(function(){ get_overall_form_settings(jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container')) }, 300);
				}
			}
		);
		
	jQuery(document).on('click', '#close-logic', 
		function()
			{
			jQuery('.conditional-logic').removeClass('active');
			jQuery('.con-logic-column').hide();
			if(jQuery('.currently_editing').attr('id'))
				jQuery('.field-settings-column').show()
			
			}
		);
	jQuery(document).on('click', '#close-extra-styling', 
		function()
			{
			jQuery('.form-styling').removeClass('active');
			jQuery('.form-styling').hide()
			if(jQuery('.currently_editing').attr('id'))
				jQuery('.field-settings-column').show()
			
			}
		);
	jQuery(document).on('click', '#close-paypal', 
		function()
			{
			jQuery('.paypal-options').removeClass('active');
			jQuery('.paypal-column').hide()
			if(jQuery('.currently_editing').attr('id'))
				jQuery('.field-settings-column').show()
			
			}
		);	

	
	jQuery(document).on('click', '.field-setting-categories .tab', 
		function()
			{
			if(jQuery(this).attr('id')!='close-settings')
				{
				jQuery('.field-settings-column .field-setting-categories .tab').removeClass('active');
				jQuery(this).addClass('active');
				jQuery('.field-settings-column .inner .settings-section').hide();
				jQuery('.field-settings-column .inner .settings-section.'+jQuery(this).attr('id')).show();
				//jQuery('.nex-forms-container').removeClass('extra-settings');
				if(jQuery(this).attr('id')=='label-settings')
					get_label_settings();
				if(jQuery(this).attr('id')=='input-settings')
					get_input_settings();
				if(jQuery(this).attr('id')=='validation-settings')
					get_validation_settings();
				if(jQuery(this).attr('id')=='animation-settings')
					get_animation_settings();
				if(jQuery(this).attr('id')=='math-settings')
					get_math_settings();
				if(jQuery(this).attr('id')=='extra-settings')
					{
					get_extra_settings();
					//jQuery('.nex-forms-container').addClass('extra-settings');
					}
				}
			}
		);
	
	
	


		
//SETUP LABEL SETTINGS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////				
	
	//SET LABEL TEXT	
		jQuery(document).on('keyup','div.field-settings-column #set_label',
			function()
				{
				current_field.find('label span.the_label').html(jQuery(this).val());
				current_field.find('.draggable_object span.field_title').html(jQuery(this).val())
				
				var formated_value = format_illegal_chars(jQuery(this).val());
				input_element.attr('name',formated_value)
				current_field.find('input[type="file"]').attr('name',formated_value)
				
				jQuery('div.field-settings-column #set_input_name').val(formated_value);
					
				if(current_field.hasClass('check-group') || current_field.hasClass('md-check-group')  || current_field.hasClass('multi-select') || current_field.hasClass('classic-check-group') || current_field.hasClass('classic-multi-select') || current_field.hasClass('upload-multi') || current_field.hasClass('multi-image-select-group') || current_field.hasClass('multi-icon-select') || current_field.hasClass('multi-images-choice'))
					input_element.attr('name',formated_value+'[]')
					
				}
			);
	//SET SUB LABEL TEXT
		jQuery(document).on('keyup','div.field-settings-column #set_subtext',
			function()
				{
				current_field.find('label small.sub-text').html(jQuery(this).val())
				}
			);
			
	//SET LABEL BIU
		set_biu_style('span.label','span.the_label','bold');
		set_biu_style('span.label','span.the_label','italic');
		set_biu_style('span.label','span.the_label','underline');
	
	//SET SUB LABEL BIU
		set_biu_style('span.sub-label','small.sub-text','bold');
		set_biu_style('span.sub-label','small.sub-text','italic');
		set_biu_style('span.sub-label','small.sub-text','underline');
		
	//SET LABEL COLORS
		change_color('label-color','span.the_label','color','','');
		change_color('sub-label-color','small.sub-text','color','','')
		
	//SET INPUT BG COLOR
	//if(current_field.hasClass('html_fields'))
		//change_color('input-bg-color','#field_container','background-color','');
	//else
		change_color('input-bg-color','.the_input_element','background-color','','');
		
			
		
	//SET LABEL POSTITION
		jQuery(document).on('click','.label-position button',
			function()
				{
				setTimeout(function(){jQuery('.field-settings-column').removeClass('admin_animated').removeClass('pulse')},10);
				jQuery('.label-position button').removeClass('active');
				jQuery(this).addClass('active');

				if(jQuery(this).hasClass('top'))
					{
					label_container.show();
					label_container.removeClass('col-sm-1').removeClass('col-sm-2').removeClass('col-sm-3').removeClass('col-sm-4').removeClass('col-sm-5').removeClass('col-sm-6').removeClass('col-sm-7').removeClass('col-sm-8').removeClass('col-sm-9').removeClass('col-sm-10').removeClass('col-sm-11').removeClass('col-sm-12').removeClass('pos_right')
					label_container.addClass('col-sm-12');
					input_container.removeClass('col-sm-1').removeClass('col-sm-2').removeClass('col-sm-3').removeClass('col-sm-4').removeClass('col-sm-5').removeClass('col-sm-6').removeClass('col-sm-7').removeClass('col-sm-8').removeClass('col-sm-9').removeClass('col-sm-10').removeClass('col-sm-11').removeClass('col-sm-12')
					input_container.addClass('col-sm-12');
					
					var copy_label = label_container.clone();
					label_container.remove();
					input_container.before(copy_label);
					if(jQuery('.field-settings-column').hasClass('open_sidenav'))
						jQuery('.field-settings-column #close-settings').trigger('click');
					
					current_field.find('div.edit').trigger('click');
					
					jQuery('div.field-settings-column .width_indicator.left input').val('12');
					jQuery('div.field-settings-column .width_indicator.right input').val('12');
					}
				if(jQuery(this).hasClass('left'))
					{
					label_container.show();
					label_container.removeClass('col-sm-1').removeClass('col-sm-2').removeClass('col-sm-3').removeClass('col-sm-4').removeClass('col-sm-5').removeClass('col-sm-6').removeClass('col-sm-7').removeClass('col-sm-8').removeClass('col-sm-9').removeClass('col-sm-10').removeClass('col-sm-11').removeClass('col-sm-12').removeClass('pos_right')
					label_container.addClass('col-sm-3');
					
					input_container.removeClass('col-sm-1').removeClass('col-sm-2').removeClass('col-sm-3').removeClass('col-sm-4').removeClass('col-sm-5').removeClass('col-sm-6').removeClass('col-sm-7').removeClass('col-sm-8').removeClass('col-sm-9').removeClass('col-sm-10').removeClass('col-sm-11').removeClass('col-sm-12')
					input_container.addClass('col-sm-9');
					
					var copy_label = label_container.clone();
					label_container.remove();
					input_container.before(copy_label);
					if(jQuery('.field-settings-column').hasClass('open_sidenav'))
						jQuery('.field-settings-column #close-settings').trigger('click');
					
					current_field.find('div.edit').trigger('click');
					jQuery('div.field-settings-column .width_indicator.left input').val('3');
					jQuery('div.field-settings-column .width_indicator.right input').val('9');
					
					}
				
				if(jQuery(this).hasClass('right'))
					{
					label_container.show();
					label_container.removeClass('col-sm-1').removeClass('col-sm-2').removeClass('col-sm-3').removeClass('col-sm-4').removeClass('col-sm-5').removeClass('col-sm-6').removeClass('col-sm-7').removeClass('col-sm-8').removeClass('col-sm-9').removeClass('col-sm-10').removeClass('col-sm-11').removeClass('col-sm-12').addClass('pos_right')
					label_container.addClass('col-sm-3');
					
					input_container.removeClass('col-sm-1').removeClass('col-sm-2').removeClass('col-sm-3').removeClass('col-sm-4').removeClass('col-sm-5').removeClass('col-sm-6').removeClass('col-sm-7').removeClass('col-sm-8').removeClass('col-sm-9').removeClass('col-sm-10').removeClass('col-sm-11').removeClass('col-sm-12')
					input_container.addClass('col-sm-9');
					
					var copy_label = label_container.clone();
					label_container.remove();
					input_container.after(copy_label);
					if(jQuery('.field-settings-column').hasClass('open_sidenav'))
						jQuery('.field-settings-column #close-settings').trigger('click');
					
					current_field.find('div.edit').trigger('click');
					jQuery('div.field-settings-column .width_indicator.left input').val('3');
					jQuery('div.field-settings-column .width_indicator.right input').val('9');
					
					}
				if(jQuery(this).hasClass('none'))
					{
					input_container.removeClass('col-sm-1').removeClass('col-sm-2').removeClass('col-sm-3').removeClass('col-sm-4').removeClass('col-sm-5').removeClass('col-sm-6').removeClass('col-sm-7').removeClass('col-sm-8').removeClass('col-sm-9').removeClass('col-sm-10').removeClass('col-sm-11').removeClass('col-sm-12').removeClass('pos_right')
					input_container.addClass('col-sm-12');
					label_container.hide();
					}
				}
		);
	
	
	jQuery(document).on('click','.label-text-alignment',
			function()
				{
				jQuery('.label-text-alignment').removeClass('active');
				jQuery(this).addClass('active');
				
				label_container.removeClass('align_left').removeClass('align_right').removeClass('align_center');
				label_container.find('.the_label').removeClass('align_left').removeClass('align_right').removeClass('align_center');
				
				if(jQuery(this).hasClass('text-left'))
					{
					label_container.addClass('align_left');
					label_container.find('.the_label').addClass('align_left');
					}
				if(jQuery(this).hasClass('text-right'))
					{
					label_container.addClass('align_right');
					label_container.find('.the_label').addClass('align_right');
					}
				if(jQuery(this).hasClass('text-center'))
					{
					label_container.addClass('align_center');
					label_container.find('.the_label').addClass('align_center');
					}
				}
			);
		
	jQuery(document).on('click','.sub-label-text-alignment',
			function()
				{
				jQuery('.sub-label-text-alignment').removeClass('active');
				jQuery(this).addClass('active');
				
				//label_container.removeClass('align_left').removeClass('align_right').removeClass('align_center');
				label_container.find('.sub-text').removeClass('align_left').removeClass('align_right').removeClass('align_center');
				
				if(jQuery(this).hasClass('text-left'))
					label_container.find('.sub-text').addClass('align_left');
				if(jQuery(this).hasClass('text-right'))
					label_container.find('.sub-text').addClass('align_right');
				if(jQuery(this).hasClass('text-center'))
					label_container.find('.sub-text').addClass('align_center');
				}
			);
	//SET LABEL ALIGNMENT
		/*jQuery(document).on('click','.align-label button',
			function()
				{
				jQuery('.align-label button').removeClass('active');
				jQuery(this).addClass('active');
				
				label_container.removeClass('align_left').removeClass('align_right').removeClass('align_center');
				
				if(jQuery(this).hasClass('left'))
					label_container.addClass('align_left');
				if(jQuery(this).hasClass('right'))
					label_container.addClass('align_right');
				if(jQuery(this).hasClass('center'))
					label_container.addClass('align_center');
				}
			);*/
	//SET LABEL SIZE
		jQuery(document).on('click','.label-size button',
			function()
				{
				jQuery('.label-size button').removeClass('active');
				jQuery(this).addClass('active');
				
				var get_label = current_field.find('label');
				get_label.removeClass('text-lg').removeClass('text-sm');
				
				if(jQuery(this).hasClass('small'))
					get_label.addClass('text-sm');
				if(jQuery(this).hasClass('large'))
					get_label.addClass('text-lg');
				}
			);
			
	jQuery( "#set_label_font_size" ).spinner(
		{ 
		min:7,
		max:99,   
		spin: function( event, ui ) 
				{
				label_container.find('.the_label').css('font-size',ui.value+'px');
				}
		}
	).on('keyup', function(e)
			{
			label_container.find('.the_label').css('font-size',jQuery(this).val()+'px');
			});
	
	jQuery( "#set_label_margin_bottom" ).spinner(
		{ 
		//min:8,  
		spin: function( event, ui ) 
			{
			label_container.find('.the_label').css('margin-bottom',ui.value+'px');
			}
		}
	).on('keyup', function(e)
			{
			label_container.find('.the_label').css('margin-bottom',jQuery(this).val()+'px');
			});
	
	
	
	jQuery( "#set_sub_label_font_size" ).spinner(
		{ 
		min:7,
		max:99,   
		spin: function( event, ui ) 
				{
				label_container.find('.sub-text').css('font-size',ui.value+'px');
				}
		}
	).on('keyup', function(e)
			{
			label_container.find('.sub-text').css('font-size',jQuery(this).val()+'px');
			});
	
	jQuery( "#set_sub_label_margin_bottom" ).spinner(
		{ 
		//min:8,  
		spin: function( event, ui ) 
				{
				label_container.find('.sub-text').css('margin-bottom',ui.value+'px');
				}
		}
	).on('keyup', function(e)
			{
			label_container.find('.sub-text').css('margin-bottom',jQuery(this).val()+'px');
			});
	
	
	
	
	
		
	//SET LABEL WIDTH
		var selecter = jQuery( "#label_width" );
		var slider = jQuery( "<div id='slider'></div>" ).insertAfter( selecter ).slider(
			{
			min: 1,
			max: 12,
			range: "min",
			value: selecter[ 0 ].selectedIndex + 1,
			slide: function( event, ui )
				{
				selecter[ 0 ].selectedIndex = ui.value - 1;	
				jQuery(this).find( '.ui-slider-handle' ).html('&nbsp;');
				jQuery('div.field-settings-column .width_indicator.left input').val(ui.value);
				if(ui.value<12)
					jQuery('div.field-settings-column .width_indicator.right input').val((12-ui.value));
				else
					jQuery('div.field-settings-column .width_indicator.right input').val((ui.value));
				set_label_width(ui.value);
				},
			create: function( event, ui )
				{	
				var count_text = '<span class="count-text">1</span>';	
				jQuery(this).find( '.ui-slider-handle' ).html('&nbsp;');				
				}
			}
		);
		jQuery(document).on('change',"#label_width",
			function()
				{
				slider.slider( "value", this.selectedIndex + 1 );
				}
		);
		
		jQuery(document).on('keyup','div.field-settings-column #set_label_width',
			function()
				{
				label_container.removeClass('col-sm-1').removeClass('col-sm-2').removeClass('col-sm-3').removeClass('col-sm-4').removeClass('col-sm-5').removeClass('col-sm-6').removeClass('col-sm-7').removeClass('col-sm-8').removeClass('col-sm-9').removeClass('col-sm-10').removeClass('col-sm-11').removeClass('col-sm-12').removeClass('pos_right')
				label_container.addClass('col-sm-'+jQuery(this).val());
				}
			);
		jQuery(document).on('key','div.field-settings-column #set_input_width',
			function()
				{
				input_container.removeClass('col-sm-1').removeClass('col-sm-2').removeClass('col-sm-3').removeClass('col-sm-4').removeClass('col-sm-5').removeClass('col-sm-6').removeClass('col-sm-7').removeClass('col-sm-8').removeClass('col-sm-9').removeClass('col-sm-10').removeClass('col-sm-11').removeClass('col-sm-12').removeClass('pos_right')
				input_container.addClass('col-sm-'+jQuery(this).val());
				}
			);
//SETUP IMAGE SETTINGS
//SET ALT TEXT
		jQuery(document).on('keyup','div.field-settings-column #set_alt_text',
			function()
				{
				current_field.find('img').attr('alt',jQuery(this).val());
				current_field.find('img').attr('title',jQuery(this).val());
				}
			);
		

			
			
			
			
		
//SETUP INPUT SETTINGS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////				
	
	//ENABLE/DISABLE FIELD REPLICATION
	jQuery(document).on('click','.recreate-field button',
			function()
				{
				jQuery('.recreate-field button').removeClass('active');
				jQuery(this).addClass('active');
				
				
				
				if(jQuery(this).hasClass('enable-recreation'))
					{
					if(!strstr(input_element.attr('name'),'['))
						input_element.attr('name',input_element.attr('name')+'[]');
					
					current_field.addClass('field-replication-enabled');
						
						
					if(!input_element.closest('.input_container').find('.input-group').attr('class'))
						{
						input_element.wrap('<div class="input-group"></div>');
						}
					if(!input_element.closest('.input_container').find('.recreate-this-field').attr('class'))
						input_element.closest('.input-group').append('<span class="input-group-addon recreate-this-field"><i class="fa fa-plus"></i></span>');
						
					}
				else
					{
					
					var set_input_name = input_element.attr('name')
					set_input_name = set_input_name.replace('[]','');
					input_element.attr('name',set_input_name);
					current_field.removeClass('field-replication-enabled');
					
					current_field.find('.recreate-this-field').remove();
					if(!input_element.closest('.input_container').find('.prefix').attr('class') && !input_element.closest('.input_container').find('.postfix').attr('class'))
						{
						input_element.unwrap();
						}
					}
				}
			);
	
	//SET INPUT NAME
		jQuery(document).on('keyup','div.field-settings-column #set_input_name',
			function()
				{
				var formated_value = format_illegal_chars(jQuery(this).val());
				input_element.attr('name',formated_value)
				if(current_field.hasClass('upload_fields'))
					current_field.find('input[type="file"]').attr('name',formated_value)
				
				
				//if(current_field.hasClass('check-group') || current_field.hasClass('md-check-group')  || current_field.hasClass('multi-select') || current_field.hasClass('classic-check-group') || current_field.hasClass('classic-multi-select') || current_field.hasClass('upload-multi'))
				//	jQuery(this).val(formated_value+'[]')
				//else
					jQuery(this).val(formated_value);
					
				}
			);
			
		jQuery(document).on('change','div.field-settings-column #set_input_name',
			function()
				{
				var formated_value = format_illegal_chars(jQuery(this).val());
				input_element.attr('name',formated_value)
				if(current_field.hasClass('upload_fields'))
					current_field.find('input[type="file"]').attr('name',formated_value)
				
				
				if(current_field.hasClass('check-group') || current_field.hasClass('md-check-group') || current_field.hasClass('multi-select') || current_field.hasClass('classic-check-group') || current_field.hasClass('classic-multi-select') || current_field.hasClass('upload-multi') || current_field.hasClass('multi-image-select-group') || current_field.hasClass('multi-icon-select'))
						{
						if(!strstr(input_element.attr('name'),'['))
							{
							input_element.attr('name',format_illegal_chars(jQuery(this).val())+'[]');
							jQuery(this).val(formated_value+'[]');
							}
						}
					
				}
			);

	//SET IMG SELECT BUTTON
		/*jQuery(document).on('keyup','div.field-settings-column #img-upload-select',
			function()
				{
				current_field.find('span.fileinput-new').text(jQuery(this).val());
				}
			);*/
	//SET IMG CHANGE BUTTON
		/*jQuery(document).on('keyup','div.field-settings-column #img-upload-change',
			function()
				{
				current_field.find('span.fileinput-exists').text(jQuery(this).val());
				}
			);*/
	//SET IMG REMOVE BUTTON
		/*jQuery(document).on('keyup','div.field-settings-column #img-upload-remove',
			function()
				{
				current_field.find('a.fileinput-exists').text(jQuery(this).val());
				}
			);*/
		
	//SET INPUT PLACEHOLDER
		jQuery(document).on('keyup','div.field-settings-column #set_input_placeholder',
			function()
				{
				input_element.attr('placeholder',jQuery(this).val())
				if(jQuery(this).val()=='')
					current_field.removeClass('is_focused');
				else
					{
					if(!current_field.hasClass('is_focused'))
						current_field.addClass('is_focused');
					}
				}
			);
			
	//SET MATERIAL LABEL
		jQuery(document).on('keyup','div.field-settings-column #set_material_label',
			function()
				{
				if(current_field.find('.input-field label').length>0)
					current_field.find('.input-field label').text(jQuery(this).val());
				else
					current_field.find('label .the_label').text(jQuery(this).val());
					
				var formated_value = format_illegal_chars(jQuery(this).val());
				input_element.attr('name',formated_value)
				current_field.find('input[type="file"]').attr('name',formated_value)
				
				jQuery('div.field-settings-column #set_input_name').val(formated_value);
				
				}
			);
	
	//SET INPUT ID
		jQuery(document).on('keyup','div.field-settings-column #set_input_id',
			function()
				{
				input_element.attr('id',jQuery(this).val())
				}
			);
	//SET INPUT ID
		jQuery(document).on('keyup','div.field-settings-column #set_input_class',
			function()
				{
				input_element.attr('class',jQuery(this).val())
				}
			);
	
	//SET INPUT VALUE
	jQuery(document).on('keyup','div.field-settings-column #set_input_val',
			function()
				{
				input_element.attr('value',jQuery(this).val())
				input_element.attr('data-value',jQuery(this).val());
				//input_element.trigger('change');
				
				if(jQuery(this).val()=='')
					current_field.removeClass('is_focused');
				else
					{
					if(!current_field.hasClass('is_focused'))
						current_field.addClass('is_focused');
					}
				
				}
			);
	jQuery(document).on('blur','div.field-settings-column #set_input_val',
		function()
			{
			input_element.trigger('focus');
			input_element.trigger('blur');
			}
		);
	//SET INPUT BIU
		set_biu_style('span.input','.the_input_element','bold');
		set_biu_style('span.input','.the_input_element','italic');
		set_biu_style('span.input','.the_input_element','underline');
				
	//SET INPUT COLOR
		change_color('input-color','.the_input_element','color','','');
	
		
		
	//SET INPUT BORDER COLOR
	
		change_color('input-border-color','.the_input_element','border-color','','');
	
	//SET INPUT CONTAINER ALIGNMENT
	jQuery(document).on('click','.align-input-container button',
		function()
			{
			jQuery('.align-input-container button').removeClass('active');
			jQuery(this).addClass('active');
			
			current_field.find('.input_container').removeClass('align_left').removeClass('align_right').removeClass('align_center');
			
			if(jQuery(this).hasClass('left'))
				current_field.find('.input_container').addClass('align_left');
			if(jQuery(this).hasClass('right'))
				current_field.find('.input_container').addClass('align_right');
			if(jQuery(this).hasClass('center'))
				current_field.find('.input_container').addClass('align_center');
			}
		);
	
	jQuery(document).on('change','#google_font_html',
		function()
			{
			nf_apply_font(input_element, 'google_font_html');
			}
		);
	
	//SET LABEL ALIGNMENT
	jQuery(document).on('click','.align-input button',
		function()
			{
			jQuery('.align-input button').removeClass('active');
			jQuery(this).addClass('active');
			
			input_element.removeClass('align_left').removeClass('align_right').removeClass('align_center');
			
			if(jQuery(this).hasClass('left'))
				input_element.addClass('align_left');
			if(jQuery(this).hasClass('right'))
				input_element.addClass('align_right');
			if(jQuery(this).hasClass('center'))
				input_element.addClass('align_center');
			}
		);
	//SET INPUT SIZE
		jQuery(document).on('click','.input-size button',
			function()
				{
				jQuery('.input-size button').removeClass('active');
				jQuery(this).addClass('active');
				
				var get_label = current_field.find('.the_input_element');
				get_label.removeClass('input-lg').removeClass('input-sm');
				
				if(jQuery(this).hasClass('small'))
					get_label.addClass('input-sm');
				if(jQuery(this).hasClass('large'))
					get_label.addClass('input-lg');
				}
			);
			
	//SET THUMB SIZE
		jQuery(document).on('click','.thumb-size button',
			function()
				{
				jQuery('.thumb-size button').removeClass('active');
				jQuery(this).addClass('active');
				
				var get_label = current_field.find('.input_holder');
				get_label.removeClass('img-thumbnail-large').removeClass('img-thumbnail-small');
				
				if(jQuery(this).hasClass('small'))
					get_label.addClass('img-thumbnail-small');
				if(jQuery(this).hasClass('large'))
					get_label.addClass('img-thumbnail-large');
				}
			);
	
	//SET CORNERS
		jQuery(document).on('click','.input-corners button',
			function()
				{
				jQuery('.input-corners button').removeClass('active');
				jQuery(this).addClass('active');
				
				current_field.removeClass('pill').removeClass('square');
				
				if(jQuery(this).hasClass('square'))
					current_field.addClass('square');
				if(jQuery(this).hasClass('pill'))
					{
					current_field.addClass('pill');
					
					if(current_field.find('.prefix').length>0)
						current_field.addClass('has_prefix_icon')
						
						
					if(current_field.find('.postfix').length>0)
						current_field.addClass('has_postfix_icon')
					
					}
				}
			);
		
		jQuery(document).on('click','.math-slider-corners button',
			function()
				{
				jQuery('.math-slider-corners button').removeClass('active');
				jQuery(this).addClass('active');
				
				current_field.removeClass('pill').removeClass('square');
				
				if(jQuery(this).hasClass('square'))
					current_field.addClass('square');
				if(jQuery(this).hasClass('pill'))
					{
					current_field.addClass('pill');
					
					if(current_field.find('.prefix').length>0)
						current_field.addClass('has_prefix_icon')
						
						
					if(current_field.find('.postfix').length>0)
						current_field.addClass('has_postfix_icon')
					
					}
				}
			);
			
	//SET DISABLED
		jQuery(document).on('click','.input-disabled button',
			function()
				{
				jQuery('.input-disabled button').removeClass('active');
				jQuery(this).addClass('active');
				
				//current_field.removeClass('pill').removeClass('square');
				
				if(jQuery(this).hasClass('yes'))
					input_element.prop('disabled', true);
				if(jQuery(this).hasClass('no'))
					input_element.prop('disabled', false)
				}
			);
	
	
	//SET INPUT PRE-ICON CLASS
	jQuery(document).on('keyup','div.field-settings-column #set_icon_before',
			function()
				{
				jQuery(this).parent().find('.current_icon_before i').attr('class',jQuery(this).val())
				input_element.parent().find('.prefix span').attr('class',jQuery(this).val())
				
				if(jQuery(this).val()=='')
					set_icon(jQuery(this).val(),'before', 'icon_before', 'prefix', 'postfix',true)
				else
					set_icon(jQuery(this).val(),'before', 'icon_before', 'prefix', 'postfix','')
				
				}
			);
	//SET INPUT PRE-ICON
	jQuery(document).on('click','.current_icon_before',
			function()
				{
				jQuery('.fa-icons-list').removeClass('set_animation_fast').removeClass('slideInRight').removeClass('slideOutRight').removeClass('icon_after').addClass('icon_before')
				jQuery('.fa-icons-list').addClass('set_animation_fast')
				jQuery('.fa-icons-list').addClass('slideInRight')
				jQuery('.fa-icons-list').show();
				jQuery('.fa-icons-list i').removeClass('active');
				var current_icon = jQuery('.current_icon_before i').attr('class');
				if(current_icon)
					var set_current_icon_class = current_icon.replace('fa','').replace(' ','');
				if(current_icon)
					jQuery('.fa-icons-list i.' + set_current_icon_class).addClass('active');
				}
			);

	//SET PRE-ICON TEXT COLOR
		change_color('pre-icon-text-color','.prefix','color','','');
	//SET PRE-ICON BG COLOR
		change_color('pre-icon-bg-color','.prefix','background-color','','');
	//SET PRE-ICON BORDER COLOR
		change_color('pre-icon-border-color','.prefix','border-color','','');
	
	jQuery( "#set_icon_font_size_before" ).spinner(
		{ 
		min:7, 
		max:99,  
		spin: function( event, ui ) 
				{
				current_field.find('span.prefix span, .material-icons.fa').css('font-size',ui.value+'px');
				}
		}
	).on('keyup', function(e)
			{
			current_field.find('span.prefix span, .material-icons.fa').css('font-size',jQuery(this).val()+'px');
			});
	
	jQuery( "#set_icon_font_size_after" ).spinner(
		{ 
		min:7, 
		max:99,  
		spin: function( event, ui ) 
				{
				current_field.find('span.postfix span').css('font-size',ui.value+'px');
				}
		}
	).on('keyup', function(e)
			{
			current_field.find('span.postfix span').css('font-size',jQuery(this).val()+'px');
			});
	
	
	change_color('stroke-color',".js-signature",'color','data-line-color','');
	
	change_color('sig-bg-color',".js-signature canvas",'background','data-background','.js-signature');
	
	change_color('sig-br-color',".js-signature canvas",'border-color','data-border','.js-signature');
	
	jQuery(document).on('click','.auto_fit button',
			function()
				{
				jQuery('.auto_fit button').removeClass('active');
				jQuery(this).addClass('active');
				
				var get_obj = current_field.find('.js-signature');
				
				
				if(jQuery(this).hasClass('yes'))
					{
					get_obj.attr('data-auto-fit','true');
					jQuery('#set_signature_width').spinner( "disable" );
					get_obj.jqSignature('clearCanvas');
					}
				if(jQuery(this).hasClass('no'))
					{
					get_obj.attr('data-auto-fit','false');
					jQuery('#set_signature_width').spinner( "enable" );
					current_field.find('canvas').css('width',jQuery('#set_signature_width').val()+'px');
					
					}
				
				
				}
			);	
	
	jQuery(document).on('click','.sig-alignment',
			function()
				{
				jQuery('.sig-alignment').removeClass('active');
				jQuery(this).addClass('active');
				
				current_field.find('.js-signature').removeClass('sig-left').removeClass('sig-right').removeClass('sig-center');
				
				if(jQuery(this).hasClass('sig-left'))
					{
					current_field.find('.js-signature').addClass('sig-left');
					}
				if(jQuery(this).hasClass('sig-right'))
					{
					current_field.find('.js-signature').addClass('sig-right');
					}
				if(jQuery(this).hasClass('sig-center'))
					{
					current_field.find('.js-signature').addClass('sig-center');
					}
				}
			);
			
			
	jQuery( "#set_signature_width" ).spinner(
		{ 
		min:100, 
		max:2000,
		step:1,  
		spin: function( event, ui ) 
				{

				current_field.find('.js-signature').attr('data-width',ui.value);
				current_field.find('canvas').attr('width',ui.value);
				current_field.find('canvas').css('width',ui.value+'px');
				
				}
		}
	).on('keyup', function(e)
			{
			current_field.find('.js-signature').attr('data-width',jQuery(this).val());
				current_field.find('canvas').attr('width',jQuery(this).val());
				current_field.find('canvas').css('width',jQuery(this).val()+'px');
			});
	
	
	jQuery( "#set_signature_height" ).spinner(
		{ 
		min:100, 
		max:2000,
		step:1,  
		spin: function( event, ui ) 
				{

				current_field.find('.js-signature').attr('data-height',ui.value);
				current_field.find('canvas').attr('height',ui.value);
				current_field.find('canvas').css('height',ui.value+'px');
				
				}
		}
	).on('keyup', function(e)
			{
			current_field.find('.js-signature').attr('data-height',jQuery(this).val());
				current_field.find('canvas').attr('height',jQuery(this).val());
				current_field.find('canvas').css('height',jQuery(this).val()+'px');
			});
	
	
	jQuery( "#set_signature_line_width" ).spinner(
		{ 
		min:1, 
		max:20,
		step:1,  
		spin: function( event, ui ) 
				{
				current_field.find('.js-signature').attr('data-line-width',ui.value);
				}
		}
	);
	
	
	//jQuery('.settings-column-style .ui-spinner a.ui-spinner-down').html('<span class="fa fa-caret-down"></span>');
	//jQuery('.settings-column-style .ui-spinner a.ui-spinner-up').html('<span class="fa fa-caret-up"></span>');	
	//jQuery('.settings-column-style .ui-spinner').prepend('<span class="px_text">px</span>');
	
	
	//SET INPUT POST-ICON CLASS
	jQuery(document).on('keyup','div.field-settings-column #set_icon_after',
			function()
				{
				jQuery(this).parent().find('.current_icon_after i').attr('class',jQuery(this).val())
				input_element.parent().find('.postfix span').attr('class',jQuery(this).val())
				
				if(jQuery(this).val()=='')
					set_icon(jQuery(this).val(),'after', 'icon_after', 'postfix', 'prefix', true)
				else
					set_icon(jQuery(this).val(),'after', 'icon_after', 'postfix', 'prefix', '')
				}
			);
	
	//SET INPUT POST-ICON
	jQuery(document).on('click','.current_icon_after',
			function()
				{
				jQuery('.fa-icons-list').removeClass('set_animation_fast').removeClass('slideInRight').removeClass('slideOutRight').removeClass('icon_before').addClass('icon_after')
				jQuery('.fa-icons-list').addClass('set_animation_fast')
				jQuery('.fa-icons-list').addClass('slideInRight')
				jQuery('.fa-icons-list').show();
				jQuery('.fa-icons-list i').removeClass('active');
				var current_icon = jQuery('.current_icon_after i').attr('class');
				if(current_icon)
					var set_current_icon_class = current_icon.replace('fa','').replace(' ','');
				if(current_icon)
					jQuery('.fa-icons-list i.' + set_current_icon_class).addClass('active');
				
				}
			);
	
	
	
	
	//SET INPUT POST-ICON CLASS
	jQuery(document).on('keyup','div.field-settings-column #set_rating_icon_on',
			function()
				{
				jQuery(this).parent().find('.setting_star_rating_on i').attr('class',jQuery(this).val())
				if(jQuery(this).val()=='')
					{
					current_field.find('#star').attr('data-staron','fa fa-star')
					current_field.find( "#star" ).raty('set',{ starOn: 'fa fa-star' })
					}
				else
					{
					current_field.find('#star').attr('data-staron',jQuery(this).val())
					current_field.find( "#star" ).raty('set',{ starOn: jQuery(this).val() })
					}
				}
			);
	jQuery(document).on('keyup','div.field-settings-column #set_rating_icon_off',
			function()
				{
				jQuery(this).parent().find('.setting_star_rating_off i').attr('class',jQuery(this).val())
				if(jQuery(this).val()=='')
					{
					current_field.find('#star').attr('data-staroff','fa fa-star')
					current_field.find( "#star" ).raty('set',{ starOff: 'fa fa-star' })
					}
				else
					{
					current_field.find('#star').attr('data-staroff',jQuery(this).val())
					current_field.find( "#star" ).raty('set',{ starOff: jQuery(this).val() })
					}
				}
			);
	
	jQuery(document).on('keyup','div.field-settings-column #set_rating_icon_half',
			function()
				{
				jQuery(this).parent().find('.setting_star_rating_half i').attr('class',jQuery(this).val())
				if(jQuery(this).val()=='')
					{
					current_field.find('#star').attr('data-starhalf','fa fa-star')
					current_field.find( "#star" ).raty('set',{ starHalf: 'fa fa-star' })
					}
				else
					{
					current_field.find('#star').attr('data-starhalf',jQuery(this).val())
					current_field.find( "#star" ).raty('set',{ starHalf: jQuery(this).val() })
					}
				}
			);
	
	change_color('rating-on-icon-text-color',"#star",'color','data-styleon','');
	change_color('rating-off-icon-text-color',"#star",'color','data-styleoff','');
	change_color('rating-half-icon-text-color',"#star",'color','data-stylehalf','');
	jQuery(document).on('blur','.rating-on-icon-text-color',
			function()
				{
				current_field.find( "#star" ).raty('set',{ styleOn: jQuery(this).val() })
				}
			);
	jQuery(document).on('blur','.rating-off-icon-text-color',
			function()
				{
				current_field.find( "#star" ).raty('set',{ styleOff: jQuery(this).val() })
				}
			);
	jQuery(document).on('blur','.rating-half-icon-text-color',
			function()
				{
				current_field.find( "#star" ).raty('set',{ styleHalf: jQuery(this).val() })
				}
			);
	
	//SET INPUT POST-ICON
	jQuery(document).on('click','.current_icon_on',
			function()
				{
				jQuery('.fa-icons-list').attr('data-edit-icon',jQuery(this).attr('data-edit-icon'));
				jQuery('.fa-icons-list').removeClass('set_animation_fast').removeClass('slideInRight').removeClass('slideOutRight').removeClass('current_icon_off').removeClass('current_icon_half').removeClass('icon_before').addClass('current_icon_on')
				jQuery('.fa-icons-list').addClass('set_animation_fast')
				jQuery('.fa-icons-list').addClass('slideInRight')
				jQuery('.fa-icons-list').show();
				jQuery('.fa-icons-list i').removeClass('active');
				var current_icon = jQuery('.current_icon_on i').attr('class');
				if(current_icon)
					var set_current_icon_class = current_icon.replace('fa','').replace(' ','');
				if(current_icon)
					jQuery('.fa-icons-list i.' + set_current_icon_class).addClass('active');
				
				}
			);
	jQuery(document).on('click','.current_icon_off',
			function()
				{
				jQuery('.fa-icons-list').attr('data-edit-icon',jQuery(this).attr('data-edit-icon'));
				jQuery('.fa-icons-list').removeClass('set_animation_fast').removeClass('slideInRight').removeClass('slideOutRight').removeClass('current_icon_on').removeClass('current_icon_half').addClass('current_icon_off')
				jQuery('.fa-icons-list').addClass('set_animation_fast')
				jQuery('.fa-icons-list').addClass('slideInRight')
				jQuery('.fa-icons-list').show();
				jQuery('.fa-icons-list i').removeClass('active');
				var current_icon = jQuery('.current_icon_on i').attr('class');
				if(current_icon)
					var set_current_icon_class = current_icon.replace('fa','').replace(' ','');
				if(current_icon)
					jQuery('.fa-icons-list i.' + set_current_icon_class).addClass('active');
				
				}
			);
	jQuery(document).on('click','.current_icon_half',
			function()
				{
				jQuery('.fa-icons-list').attr('data-edit-icon',jQuery(this).attr('data-edit-icon'));
				jQuery('.fa-icons-list').removeClass('set_animation_fast').removeClass('slideInRight').removeClass('slideOutRight').removeClass('current_icon_on').removeClass('current_icon_off').addClass('current_icon_half')
				jQuery('.fa-icons-list').addClass('set_animation_fast')
				jQuery('.fa-icons-list').addClass('slideInRight')
				jQuery('.fa-icons-list').show();
				jQuery('.fa-icons-list i').removeClass('active');
				var current_icon = jQuery('.current_icon_on i').attr('class');
				if(current_icon)
					var set_current_icon_class = current_icon.replace('fa','').replace(' ','');
				if(current_icon)
					jQuery('.fa-icons-list i.' + set_current_icon_class).addClass('active');
				
				}
			);
	
	
	
	//SET POST-ICON TEXT COLOR
		change_color('post-icon-text-color','.postfix','color','','');
	//SET POST-ICON BG COLOR
		change_color('post-icon-bg-color','.postfix','background-color','','');
	//SET POST-ICON BORDER COLOR
		change_color('post-icon-border-color','.postfix','border-color','','');
	
	
	//SET ICON	
	jQuery(document).on('click','.fa-icons-list .inner i',
		function()
			{	
			var remove_icon = false;
			var icon_to_edit = jQuery('.fa-icons-list').attr('data-edit-icon');
			if(jQuery(this).hasClass('no-icon'))
				remove_icon = true;
			
			jQuery('.fa-icons-list i').removeClass('active');
			jQuery(this).removeClass('set_animation_fast');
			jQuery(this).removeClass('zoomIn');
		
		if(current_field)
			{
			if(current_field.hasClass('radio-group') || current_field.hasClass('check-group'))
				{
				current_field.find('span.check-icon').attr('class','check-icon checked fa ' + jQuery(this).attr('class'));
				}	
			if(current_field.hasClass('image-choices-field'))
				{
				current_field.find('.thumb-icon.checked').attr('class','thumb-icon checked ' + jQuery(this).attr('class'));
				}		
			}
			
		if(jQuery(this).closest('.fa-icons-list').hasClass('step_icon'))
				{
				
				var current_step_num = jQuery(this).closest('.fa-icons-list').attr('data-set-num');
				var current_step = jQuery('.nf_ms_breadcrumb li:eq('+(current_step_num-1)+')');
				
				//console.log(current_step_num);
				
				//SET ICON
				if(jQuery(this).hasClass('no-icon'))
					{
					jQuery('.nf_multi_step_'+current_step_num).attr('data-step-icon','')
					jQuery('.nf_multi_step_'+current_step_num+' .set_step_icon i').attr('class','');
					jQuery('.nf_multi_step_'+current_step_num+' input[name="multi_step_icon"]').val('');
					
					current_step.removeClass('has-icon');
					current_step.find('.the_step_icon').attr('class','the_step_icon')
					}
				else
					{
					jQuery('.nf_multi_step_'+current_step_num).attr('data-step-icon',jQuery(this).attr('class'))
					jQuery('.nf_multi_step_'+current_step_num+' .set_step_icon i').attr('class',jQuery(this).attr('class'));
					jQuery('.nf_multi_step_'+current_step_num+' input[name="multi_step_icon"]').val(jQuery(this).attr('class'));
					
					current_step.addClass('has-icon');
					current_step.find('.the_step_icon').attr('class','the_step_icon '+jQuery(this).attr('class'))	
					}
				
				
				
				jQuery(this).closest('.fa-icons-list').removeClass('step_icon');
				jQuery('.fa-icons-list .close_icons').trigger('click');
				return;
				}
		
		if(jQuery(this).closest('.fa-icons-list').attr('data-icon-target') && jQuery(this).closest('.fa-icons-list').attr('data-icon-target')!='')
				{
				current_field.find(jQuery(this).closest('.fa-icons-list').attr('data-icon-target')).attr('class',jQuery(this).attr('class'));	

				if(remove_icon)
					{
					jQuery('.field-settings-column .icon-select.open i').html('<span class="small_addon_text">Icon</span>');
					jQuery('.field-settings-column .icon-select.open i').attr('class','');
					}
				else
					{
					jQuery('.field-settings-column .icon-select.open i').html('');
					jQuery('.field-settings-column .icon-select.open i').attr('class',jQuery(this).attr('class'));
					jQuery('#set_radio_icon').val(jQuery(this).attr('class'));
					}
				
				jQuery(this).closest('.fa-icons-list').removeAttr('data-icon-target');
				jQuery('.field-settings-column .icon-select').removeClass('open');
				
				if(current_field.hasClass('icon-select-group'))
					setup_icon_options(current_field);
				
				}
		
		
		
		if(current_field.hasClass('star-rating'))
			{
				
				//find('#star').attr('data-starHalf')
				if(icon_to_edit=='star_rating_on')
					{
					current_field.find('#star').attr('data-starOn',jQuery(this).attr('class'))
					current_field.find( "#star" ).raty('set',{ starOn: jQuery(this).attr('class') })
					jQuery('#set_rating_icon_on').val(jQuery(this).attr('class'))
					}
				if(icon_to_edit=='star_rating_off')
					{
					current_field.find('#star').attr('data-starOff',jQuery(this).attr('class'))
					current_field.find( "#star" ).raty('set',{ starOff: jQuery(this).attr('class') })
					jQuery('#set_rating_icon_off').val(jQuery(this).attr('class'))
					}
				if(icon_to_edit=='star_rating_half')
					{
					current_field.find('#star').attr('data-starHalf',jQuery(this).attr('class'))
					current_field.find( "#star" ).raty('set',{ starHalf: jQuery(this).attr('class') })
					jQuery('#set_rating_icon_half').val(jQuery(this).attr('class'))
					}
					
					
				jQuery('.setting_'+icon_to_edit+' i').attr('class',jQuery(this).attr('class'));	
				
				
			
			}
		
		
		else if(current_field.hasClass('icon-select-group'))
			{
			
			
			if(jQuery('.fa-icons-list').hasClass('set_icon_off'))
				{
				current_field.find('.off-icon.'+icon_to_edit+' span').attr('class',jQuery(this).attr('class'));	
				jQuery('.current_field_icon_off.setting_'+icon_to_edit+' i').attr('class',jQuery(this).attr('class'));	
				}
			if(jQuery('.fa-icons-list').hasClass('set_icon_on'))
				{
				current_field.find('.on-icon.'+icon_to_edit+' span').attr('class',jQuery(this).attr('class'));	
				jQuery('.current_field_icon_on.setting_'+icon_to_edit+' i').attr('class',jQuery(this).attr('class'));	
				}
			
			}
		
		
		
		else if(current_field.hasClass('radio-group') || current_field.hasClass('check-group') || current_field.hasClass('image-choices-field') || current_field.hasClass('single-image-select-group') || current_field.hasClass('multi-image-select-group'))
			{
			current_field.find('.the-radios').attr('data-checked-class',jQuery(this).attr('class'));
			current_field.find('a.checked').attr('class','checked ui-state-active '+ jQuery(this).attr('class'));
			if(remove_icon)
				{
				jQuery('.current_radio_icon i').text('Select Icon');
				jQuery('.current_radio_icon i').attr('class','');
				jQuery('#set_radio_icon').val('');
				}
			else
				{
				jQuery('.current_radio_icon i').text('');
				jQuery('.current_radio_icon i').attr('class',jQuery(this).attr('class'));
				jQuery('#set_radio_icon').val(jQuery(this).attr('class'));
				}
			}
		
		else if(current_field.hasClass('icon'))
			{
			if(remove_icon)
				{
				jQuery('.current_icon_element i').text('Select Icon');
				jQuery('.current_icon_element i').attr('class','');
				jQuery('#set_icon_element').val('');
				}
			else
				{
				jQuery('.current_icon_element i').text('');
				jQuery('.current_icon_element i').attr('class',jQuery(this).attr('class'));
				jQuery('#set_icon_element').val(jQuery(this).attr('class'));
				}
			jQuery('#set_icon_element').trigger('keyup');
			}
		
		else
			{
			if(jQuery(this).parent().parent().hasClass('icon_before'))
				set_icon(jQuery(this).attr('class'),'before', 'icon_before', 'prefix', 'postfix',remove_icon)
			if(!current_field.hasClass('material_field'))
				{
				if(jQuery(this).parent().parent().hasClass('icon_after'))
					set_icon(jQuery(this).attr('class'),'after', 'icon_after', 'postfix', 'prefix',remove_icon)
				}
			}
			
		jQuery(this).addClass('active');
		jQuery('.fa-icons-list').removeClass('admin_animated').removeClass('bounceInDown').removeClass('bounceOutUp')
		jQuery('.fa-icons-list .close_icons').trigger('click');
		}
	);
	//CLOSE ICONS
	jQuery(document).on('click','.fa-icons-list .close_icons',
		function()
			{
			jQuery('.fa-icons-list').removeClass('slideInRight')
			jQuery('.fa-icons-list').addClass('set_animation_fast')
			jQuery('.fa-icons-list').addClass('slideOutRight')
			setTimeout(function(){ 
			jQuery('.fa-icons-list').hide();
			jQuery('.fa-icons-list').removeClass('slideOutRight')
			 }, 300);
			}
		);
	//ICON SEARCH
	jQuery(document).on('change','.icon_search',
		function()
			{
			var search_term = jQuery(this).val();
			jQuery('.fa-icons-list .inner i').each(
				function()
					{
					if(!strstr(jQuery(this).attr('class'),search_term))
						{
						jQuery(this).show().removeClass('set_animation_fast').removeClass('zoomIn');
						jQuery(this).hide();
						}
					else
						{
						jQuery(this).show().addClass('set_animation_fast').addClass('zoomIn');
						}
					}
				);
			}
		)	
	//SET BACKGROUND IMAGE
	
		jQuery(document).on('change','#do-upload-form-image input',
		function()
			{
			jQuery('#do-upload-form-image').submit();
			}
		)
		jQuery('#do-upload-form-image').ajaxForm(
			{
			data:{action: 'do_upload_image'},
			beforeSubmit: function(formData, jqForm, options) {},
			success : function(responseText, statusText, xhr, $form)
				{
				if(responseText)
					{
					var img_attr = 	JSON.parse(responseText);
					}
				else
					{
					img_attr = '';	
					}
				if(responseText)
					jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').css('background-image','url("'+ img_attr['image_url'] +'")')
				else
					jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').css('background-image',jQuery('.wrapper-bg-color').val());
				},
			error: function(jqXHR, textStatus, errorThrown){/*console.log(errorThrown)*/}
			}
		);	
	
		jQuery(document).on('change','#do-upload-image input',
		function()
			{
			jQuery('#do-upload-image').submit();
			}
		)
		jQuery('#do-upload-image').ajaxForm(
			{
			data:{action: 'do_upload_image'},
			beforeSubmit: function(formData, jqForm, options) {},
			success : function(responseText, statusText, xhr, $form)
				{
				if(responseText)
					{
					var img_attr = 	JSON.parse(responseText);
					}
				else
					{
					img_attr = '';	
					}
				if(current_field.hasClass('other-elements') && current_field.hasClass('grid'))
					current_field.find('.panel-heading').next('.panel-body').css('background','url("'+ img_attr['image_url'] +'")');
				else
					input_element.css('background','url("'+ img_attr['image_url'] +'")');
				},
			error: function(jqXHR, textStatus, errorThrown){/*console.log(errorThrown)*/}
			}
		);	
	
	
	
	//SET BACKGROUND SIZE
	jQuery(document).on('click','.bg-size button',
		function()
			{
			jQuery('.bg-size button').removeClass('active');
			jQuery(this).addClass('active');
			if(current_field.hasClass('other-elements') && current_field.hasClass('grid'))
				var get_obj = current_field.find('.panel-body');
			else
				var get_obj = input_element;
				
			if(jQuery(this).hasClass('auto'))
				get_obj.css('background-size','auto');
			if(jQuery(this).hasClass('cover'))
				get_obj.css('background-size','cover');
			if(jQuery(this).hasClass('contain'))
				get_obj.css('background-size','contain');
			}
		);
	
	//SET BACKGROUND SIZE
	jQuery(document).on('click','.bg-repeat button',
		function()
			{
			jQuery('.bg-repeat button').removeClass('active');
			jQuery(this).addClass('active');
			if(current_field.hasClass('other-elements') && current_field.hasClass('grid'))
				var get_obj = current_field.find('.panel-body');
			else
				var get_obj = input_element;
				
			if(jQuery(this).hasClass('no-repeat'))
				get_obj.css('background-repeat','no-repeat');
			if(jQuery(this).hasClass('repeat'))
				get_obj.css('background-repeat','repeat');
			if(jQuery(this).hasClass('repeat-x'))
				get_obj.css('background-repeat','repeat-x');
			if(jQuery(this).hasClass('repeat-y'))
				get_obj.css('background-repeat','repeat-y');
			}
		);
	
	//SET BACKGROUND POSITION
	jQuery(document).on('click','.bg-position button',
		function()
			{
			jQuery('.bg-position button').removeClass('active');
			jQuery(this).addClass('active');
			if(current_field.hasClass('other-elements') && current_field.hasClass('grid'))
				var get_obj = current_field.find('.panel-body');
			else
				var get_obj = input_element;
				
			if(jQuery(this).hasClass('left'))
				get_obj.css('background-position','left 0%');
			if(jQuery(this).hasClass('right'))
				get_obj.css('background-position','right 0%');
			if(jQuery(this).hasClass('center'))
				get_obj.css('background-position','50% 0%');
			}
		);
/********************************************************************************************/
//TAGS
		jQuery(document).on('keyup','#max_tags',
			function()
				{
				current_field.find( "#tags" ).attr('data-max-tags',jQuery(this).val());				
				}
			);
/********************************************************************************************/
//THUMB RATING
		jQuery(document).on('keyup','#set_thumbs_up_val',
				function()
					{
					current_field.find('input.nf-thumbs-o-up').attr('value',jQuery(this).val())
					current_field.find('span.the-thumb.fa-thumbs-o-up').attr('data-original-title',jQuery(this).val())
					current_field.find('span.the-thumb.fa-thumbs-o-up').attr('title',jQuery(this).val())
					}
				)
		jQuery(document).on('keyup','#set_thumbs_down_val',
				function()
					{
					current_field.find('input.nf-thumbs-o-down').attr('value',jQuery(this).val())
					current_field.find('span.the-thumb.fa-thumbs-o-down').attr('data-original-title',jQuery(this).val())
					current_field.find('span.the-thumb.fa-thumbs-o-down').attr('title',jQuery(this).val())
					}
				)

/********************************************************************************************/
//SMILY RATING
		jQuery(document).on('keyup','#set_smily_frown_val',
				function()
					{
					current_field.find('input.nf-smile-bad').attr('value',jQuery(this).val())
					current_field.find('span.the-smile.nf-smile-bad').attr('data-original-title',jQuery(this).val())
					current_field.find('span.the-smile.nf-smile-bad').attr('title',jQuery(this).val())
					}
				)
		jQuery(document).on('keyup','#set_smily_average_val',
				function()
					{
					current_field.find('input.nf-smile-average').attr('value',jQuery(this).val())
					current_field.find('span.the-smile.nf-smile-average').attr('data-original-title',jQuery(this).val())
					current_field.find('span.the-smile.nf-smile-average').attr('title',jQuery(this).val())
					}
				)
		jQuery(document).on('keyup','#set_smily_good_val',
				function()
					{
					current_field.find('input.nf-smile-good').attr('value',jQuery(this).val())
					current_field.find('span.the-smile.nf-smile-good').attr('data-original-title',jQuery(this).val())
					current_field.find('span.the-smile.nf-smile-good').attr('title',jQuery(this).val())
					}
				)
		
/********************************************************************************************/
//STAR RATING
		
		
		jQuery( "#total_stars" ).spinner(
		{ 
			min:1,
			max:20,  
			spin: function( event, ui ) 
				{
				current_field.find( "#star" ).attr('data-total-stars',ui.value);
				current_field.find( "#star" ).raty('set',{ number: ui.value })
				}
			}
		).on('keyup', function(e)
				{
				current_field.find( "#star" ).attr('data-total-stars',jQuery(this).val());
				current_field.find( "#star" ).raty('set',{ number: jQuery(this).val() })
				});
				
				
				
		jQuery( "#star_rating_size" ).spinner(
		{ 
			min:8,
			max:100,  
			spin: function( event, ui ) 
				{
				current_field.find( "#star" ).attr('data-size',ui.value);
				current_field.find( "#star" ).raty('set',{ size: ui.value })
				}
			}
		).on('keyup', function(e)
				{
				current_field.find( "#star" ).attr('data-size',jQuery(this).val());
				current_field.find( "#star" ).raty('set',{ size: jQuery(this).val() })
				});
		
		
		
		jQuery(document).on('click','.star-rating-alignment',
			function()
				{
				jQuery('.star-rating-alignment').removeClass('active');
				jQuery(this).addClass('active');
				
				input_container.removeClass('align_left').removeClass('align_right').removeClass('align_center');
				
				if(jQuery(this).hasClass('text-left'))
					{
					input_container.addClass('align_left');
					}
				if(jQuery(this).hasClass('text-right'))
					{
					input_container.addClass('align_right');
					}
				if(jQuery(this).hasClass('text-center'))
					{
					input_container.addClass('align_center');
					}
				}
			);
		
		
		
		jQuery(document).on('click','.set_half_stars',
			function()
				{
				jQuery('.set_half_stars').removeClass('active');
				jQuery(this).addClass('active');
				
				if(jQuery(this).hasClass('no'))
					{
					jQuery('.show-half-rating').addClass('hidden');
					current_field.find( "#star" ).attr('data-enable-half','false');
					current_field.find( "#star" ).raty('set',{ half: false });
					}
				else
					{
					jQuery('.show-half-rating').removeClass('hidden');
					current_field.find( "#star" ).attr('data-enable-half','true');
					current_field.find( "#star" ).raty('set',{ half: true });	
					}
				}
			);
		

//SET SELECT OPTIONS
		jQuery(document).on('change', "#set_options",
		function()
			{	
					
					var items = jQuery.trim(jQuery(this).val());
			
					if(items == 'wp_categories')
						{
						nf_get_wp_cats('set_options');
						return;	
						}
					
					
					if(strstr(jQuery(' #set_default_select_value').val(),'=='))
						{
						var split_default_option = jQuery(' #set_default_select_value').val().split('==')
						var set_options = '<option value="'+ split_default_option[0] +'" selected="selected">'+ split_default_option[1] +'</option>';
						current_field.find('select').attr('data-default-selected-value',split_default_option[0])
						}
					else
						{
						var set_options = '<option value="'+ jQuery(' #set_default_select_value').val() +'" selected="selected">'+ jQuery(' #set_default_select_value').val() +'</option>';
						current_field.find('select').attr('data-default-selected-value',jQuery(' #set_default_select_value').val())
						}
					var set_selections = '';
					items = items.split('\n');
					for (var i = 0; i < items.length; i++)
						{
						if(items[i]!='')
							{
							if(strstr(items[i],'=='))
								{
								var split_option = items[i].split('==')
								set_options += '<option value="'+ split_option[0] +'">'+ split_option[1] +'</option>';
								}
							else
								set_options += '<option value="'+ items[i] +'">'+ items[i] +'</option>';
							}
						}	
					current_field.find('select').html(set_options);
					
					if(current_field.hasClass('material_field'))
						current_field.find('select').material_select();
					
					}
				
				);
		jQuery(document).on('keyup','#set_default_select_value',
				function()
					{
					
					if(strstr(jQuery(this).val(),'=='))
						{
						var split_default_option = jQuery(this).val().split('==')
						current_field.find('select option:selected').text(split_default_option[1])
						current_field.find('select option:selected').val(split_default_option[0])
						current_field.find('select').attr('data-default-selected-value',split_default_option[0])
						}
					else
						{
						current_field.find('select option:selected').text(jQuery(this).val())
						current_field.find('select option:selected').val(jQuery(this).val())
						current_field.find('select').attr('data-default-selected-value',jQuery(this).val())
						}
					}
				);


//SET RADIO/CHECK SETTINGS	
jQuery(document).on('click', ".convert_image_field_button",
		function()
			{
			
					var converted = '';
					var radio_layout = current_field.find('.the-radios').attr('data-layout');
					var set_layout = 'images-inline';
					if(radio_layout=='1c')
						set_layout='col-sm-12'; 
					if(radio_layout=='2c')
						set_layout='col-sm-6';
					if(radio_layout=='3c')
						set_layout='col-sm-4';
					if(radio_layout=='4c')
						set_layout='col-sm-3';
					if(radio_layout=='6c')
						set_layout='col-sm-2';
					
					var check_icon = current_field.find('.the-radios').attr('data-checked-class');
					var check_color = (current_field.find('.the-radios').attr('data-checked-bg-color')) ? current_field.find('.the-radios').attr('data-checked-bg-color') : '#8bc34a';
					var image_size = '151px';
					if(current_field.find('input_holder').hasClass('img-thumbnail-large'))
						image_size = '201px';
					if(current_field.find('input_holder').hasClass('img-thumbnail-small'))
						image_size = '101px';
					
					var alignment = '';
					if(current_field.find('input_holder').hasClass('align_center'))
						alignment = 'thumbs-center';
					if(current_field.find('input_holder').hasClass('align_right'))
						alignment = 'thumbs-right';
					
					converted += '<div id="the-radios" class="the-radios error_message" data-checked-bg-color="'+ check_color  +'" data-layout="'+ current_field.find('.the-radios').attr('data-layout') +'" data-checked-class="'+ check_icon +'" data-unchecked-class="" data-placement="bottom" data-content="Required" title="">';
					  converted += '<div class="image-choices-inner row">';
						converted += '<div class="input-inner">';
						
						  
						  
						
					
					current_field.find('.the-radios label').each(
						function()
							{
								
							var input_name = jQuery(this).find('input').attr('name');
							var input_type = jQuery(this).find('input').attr('type');
							var input_value =  jQuery(this).find('input').val();
							var label_name =  jQuery(this).find('.input-label').text();
							var image = jQuery(this).find('img').attr('src');
							
							
							var label_color =  jQuery(this).find('.input-label').attr('style');
								
							converted += '<div class="image-choices-choice images-inline" style="width: '+ image_size +';">';
								converted += '<label class="radio-inline" for="" style="color: rgb(158, 158, 158);">';
									converted += '<div class="thumb-image-outer-wrap">';
									  converted += '<div class="prettyradio">';
										converted += '<input name="'+ input_name +'" type="'+ input_type +'" value="'+ input_value +'" id="" style="display: none; font-size: 13px; color: rgb(158, 158, 158); background: rgb(255, 255, 255); border-color: rgb(221, 221, 221);" autocomplete="disabled" class="the_input_element align_left">';
										converted += '<a class="ui-state-default" style="background: rgb(139, 195, 74);"></a></div>';
									  converted += '<div class="image-choices-choice-image-wrap"><img class="the-thumb-image" src="'+ image +'">';
										converted += '<div class="change_thumb" title="Change Image"><span class="fas fa-exchange-alt"></span></div>';
									  converted += '</div>';
									converted += '</div>';
									converted += '<span class="image-choices-choice-text input-label" style="'+ label_color +'">'+ label_name +'</span>';
								converted += '</label>';
						  	converted += '</div>';	
							}
						);
					
					
					converted += '</div>';
					  converted += '</div>';
					converted += '</div>';
					
				if(current_field.hasClass('multi-image-select-group'))
						current_field.addClass('multi-images-choice')	
				
				current_field.removeClass('multi-image-select-group')
				current_field.removeClass('single-image-select-group')
				
				current_field.addClass('image-choices-field')
				current_field.addClass('cropped');
				current_field.addClass('image_converted');
				
				current_field.attr('data-settings','.s-thumbs-select')		
				
				
				current_field.find('.input_holder').removeClass('img-thumbnail-large');
				current_field.find('.input_holder').removeClass('img-thumbnail-small');
				current_field.find('.input_holder').addClass(alignment);
				
				
				current_field.find('.input_holder').html(converted);
				current_field.find('.edit-done').trigger('click');
				jQuery('.image_converted .edit').trigger('click'); jQuery('.image_converted').removeClass('image_converted');
			
			}

		);	


//SET RADIO/CHECK SETTINGS	
jQuery(document).on('change', "#set_radios",
		function()
			{
			var items = jQuery.trim(jQuery(this).val());
			
			if(items == 'wp_categories')
				{
				nf_get_wp_cats('set_radios');
				return;	
				}
			
			var set_inputs = '';
			items = items.split('\n');
			for (var i = 0; i < items.length; i++)
				{
				if(items[i]!='')
					{
					var radio_layout = current_field.find('.the-radios').attr('data-layout');
					var set_layout = '';
					if(radio_layout=='1c')
						set_layout='col-sm-12'; 
					if(radio_layout=='2c')
						set_layout='col-sm-6';
					if(radio_layout=='3c')
						set_layout='col-sm-4';
					if(radio_layout=='4c')
						set_layout='col-sm-3';
					if(radio_layout=='6c')
						set_layout='col-sm-2';
					
					if(current_field.find('div#the-radios .input-inner label:eq('+ i +') img').attr('src'))
						{
						if(current_field.hasClass('image-choices-field'))
							var the_image = '<img class="the-thumb-image" src="' + current_field.find('div#the-radios .input-inner label:eq('+ i +') img').attr('src') + '"><div class="change_thumb" title="Change Image"><span class="fas fa-exchange-alt"></span></div>';
						else
							var the_image = '<img class="radio-image" src="' + current_field.find('div#the-radios .input-inner label:eq('+ i +') img').attr('src') + '">';
						}
					else
						{
						if(current_field.hasClass('image-choices-field'))
							var the_image = '<div class="thumb-placeholder"><span class="fa far fa-image"></span><br>Click to add image</div>';
						else
							var the_image = '';
						}
					if(current_field.hasClass('multi-image-select-group') || current_field.hasClass('single-image-select-group'))
						{
						if(current_field.hasClass('multi-image-select-group'))
							{											
							if(strstr(items[i],'=='))
								{
								var split_option = items[i].split('==')
								set_inputs += '<label class="radio-inline '+ set_layout +'" for="'+ format_illegal_chars(current_field.find('.the_label').text())+'_'+format_illegal_chars(split_option[1]) +'"  data-svg="demo-input-1"><span class="svg_ready has-pretty-child"><input class="radio the_input_element" type="checkbox" name="'+ format_illegal_chars(current_field.find('.the_label').text()) +'[]" id="'+format_illegal_chars(current_field.find('.the_label').text())+'_'+format_illegal_chars(split_option[1])+'" value="'+split_option[0]+'"><span class="input-label radio-label  img-thumbnail">'+split_option[1]+ the_image +'</span></span></label>';
								}
							else
								{
								set_inputs += '<label class="radio-inline '+ set_layout +'" for="'+ format_illegal_chars(current_field.find('.the_label').text())+'_'+format_illegal_chars(items[i]) +'"  data-svg="demo-input-1"><span class="svg_ready has-pretty-child"><input class="radio the_input_element" type="checkbox" name="'+ format_illegal_chars(current_field.find('.the_label').text()) +'[]" id="'+format_illegal_chars(current_field.find('.the_label').text())+'_'+format_illegal_chars(items[i])+'" value="'+items[i]+'"><span class="input-label radio-label  img-thumbnail">'+items[i]+ the_image +'</span></span></label>';
								}
							}
						else
							{
							if(strstr(items[i],'=='))
								{
								var split_option = items[i].split('==')
								set_inputs += '<label class="radio-inline '+ set_layout +'" for="'+ format_illegal_chars(current_field.find('.the_label').text())+'_'+format_illegal_chars(split_option[1]) +'"  data-svg="demo-input-1"><span class="svg_ready has-pretty-child"><input class="radio the_input_element" type="radio" name="'+ format_illegal_chars(current_field.find('.the_label').text()) +'" id="'+format_illegal_chars(current_field.find('.the_label').text())+'_'+format_illegal_chars(split_option[1])+'" value="'+split_option[0]+'"><span class="input-label radio-label  img-thumbnail">'+split_option[1]+the_image +'</span></span></label>';
								}
							else
								{
								set_inputs += '<label class="radio-inline '+ set_layout +'" for="'+ format_illegal_chars(current_field.find('.the_label').text())+'_'+format_illegal_chars(items[i]) +'"  data-svg="demo-input-1"><span class="svg_ready has-pretty-child"><input class="radio the_input_element" type="radio" name="'+ format_illegal_chars(current_field.find('.the_label').text()) +'" id="'+format_illegal_chars(current_field.find('.the_label').text())+'_'+format_illegal_chars(items[i])+'" value="'+items[i]+'"><span class="input-label radio-label  img-thumbnail">'+items[i]+the_image +'</span></span></label>';
								}
							
							}
						}
					
					else if(current_field.hasClass('image-choices-field'))
						{
						var image_container_cls = current_field.find('.image-choices-choice').attr('class');
						var image_container_css = current_field.find('.image-choices-choice').attr('style');	
						
						var label_cls = current_field.find('.radio-inline').attr('class');
						var label_css = current_field.find('.radio-inline').attr('style');
						
						var thumb_wrap_cls = current_field.find('.thumb-image-outer-wrap').attr('class');
						var thumb_wrap_css = current_field.find('.thumb-image-outer-wrap').attr('style');
						
						var input_name 	   = current_field.find('input').attr('name');
						var input_type 	   = current_field.find('input').attr('type');
						var input_cls 	   = current_field.find('input').attr('class');
						var input_css 	   = current_field.find('input').attr('style');
						
						var icon_cls = current_field.find('.prettyradio a').attr('class');
						var icon_css = current_field.find('.prettyradio a').attr('style');
						
						var image_wrap_cls = current_field.find('.image-choices-choice-image-wrap').attr('class');
						var image_wrap_css = current_field.find('.image-choices-choice-image-wrap').attr('style');
						
						var thumb_label_txt_cls = current_field.find('.image-choices-choice-text').attr('class');
						var thumb_label_txt_css = current_field.find('.image-choices-choice-text').attr('style');
						
						/*var is_checked = (current_field.find('.thumb-icon-holder').attr('class')) ? true : false;
						if(is_checked)
							{	
							var thumb_checked_cls = current_field.find('.thumb-icon-holder span').attr('class');
							var thumb_checked_css = current_field.find('.thumb-icon-holder span').attr('style');
							}*/
						if(strstr(items[i],'=='))
							{
							var split_option = items[i].split('==')
							var input_value = split_option[0];
							var label_text 	= split_option[1];
							}
						else
							{
							var input_value = items[i];
							var label_text 	= items[i];
							}
						set_inputs += '<div class="'+image_container_cls+'" style="'+image_container_css+'">';
						  set_inputs += '<label class="'+label_cls+'" style="'+label_css+'">';
						  	   
							  if(input_container.hasClass('label-pos-top'))
							  	set_inputs += '<span class="'+thumb_label_txt_cls+'" style="'+ thumb_label_txt_css +'">'+label_text+'</span>'; 
								
							  set_inputs += '<div class="'+thumb_wrap_cls+'" style="'+thumb_wrap_css+'">';
								 
								 /* if(is_checked)
								  	{
								  	set_inputs += '<div class="thumb-icon-holder">';
										set_inputs += '<span style="'+ thumb_checked_css +'" class="'+ thumb_checked_cls  +'"></span>';
								  	set_inputs += '</div>';
									}*/
								  set_inputs += '<div class="prettyradio">';
									set_inputs += '<input name="'+input_name+'"  type="'+input_type+'" value="'+input_value+'" id="" style="'+input_css+'" autocomplete="disabled" class="'+input_cls+'">';											
									set_inputs += '<a class="'+icon_cls+'" style="'+ icon_css +'"></a>';
								  set_inputs += '</div>';
							  
								  set_inputs += '<div class="'+image_wrap_cls+'" style="'+image_wrap_css+'">';
									set_inputs += the_image;
								  set_inputs += '</div>';
									
							  set_inputs += '</div>';
							  if(!input_container.hasClass('label-pos-top'))
							  	set_inputs += '<span class="'+thumb_label_txt_cls+'" style="'+ thumb_label_txt_css +'">'+label_text+'</span>';
								
						  set_inputs += '</label>';
						set_inputs += '</div>';
						}
					
					else if(current_field.hasClass('check-group') || current_field.hasClass('classic-check-group'))
						{
						if(strstr(items[i],'=='))
							{
							var split_option = items[i].split('==')
							set_inputs += '<label class="checkbox-inline '+ set_layout +'" for="'+ format_illegal_chars(current_field.find('.the_label').text())+'_'+format_illegal_chars(items[i]) +'" ><span class="svg_ready"><input class="check the_input_element" type="checkbox" name="'+ format_illegal_chars(current_field.find('.the_label').text()) +'[]" id="'+format_illegal_chars(current_field.find('.the_label').text())+'_'+format_illegal_chars(items[i])+'" value="'+split_option[0]+'"><span class="input-label check-label">'+split_option[1]+'</span></span></label>';
							}
						else
							set_inputs += '<label class="checkbox-inline '+ set_layout +'" for="'+ format_illegal_chars(current_field.find('.the_label').text())+'_'+format_illegal_chars(items[i]) +'" ><span class="svg_ready"><input class="check the_input_element" type="checkbox" name="'+ format_illegal_chars(current_field.find('.the_label').text()) +'[]" id="'+format_illegal_chars(current_field.find('.the_label').text())+'_'+format_illegal_chars(items[i])+'" value="'+items[i]+'"><span class="input-label check-label">'+items[i]+'</span></span></label>';
						}
					else if(current_field.hasClass('md-check-group'))
						{
						if(strstr(items[i],'=='))
							{
							var split_option = items[i].split('==')
							set_inputs += '<p class="radio_check_input '+ set_layout +'"><input class=" the_input_element" type="checkbox" name="'+ format_illegal_chars(current_field.find('.the_label').text()) +'[]" id="'+format_illegal_chars(current_field.find('.the_label').text())+'_'+format_illegal_chars(items[i])+'_'+ i +'_c" value="'+split_option[0]+'"><label class="input-label" for="'+format_illegal_chars(current_field.find('.the_label').text())+'_'+format_illegal_chars(items[i])+'_'+ i +'_c">'+ split_option[1] +'</label></p>';
							}
						else
							set_inputs += '<p class="radio_check_input '+ set_layout +'"><input class=" the_input_element" type="checkbox" name="'+ format_illegal_chars(current_field.find('.the_label').text()) +'[]" id="'+format_illegal_chars(current_field.find('.the_label').text())+'_'+format_illegal_chars(items[i])+'_'+ i +'_c" value="'+items[i]+'"><label class="input-label" for="'+format_illegal_chars(current_field.find('.the_label').text())+'_'+format_illegal_chars(items[i])+'_'+ i +'_c">'+ items[i] +'</label></p>';
						}
					else if(current_field.hasClass('md-radio-group'))
						{
						if(strstr(items[i],'=='))
							{
							var split_option = items[i].split('==')
							set_inputs += '<p class="radio_check_input '+ set_layout +'"><input class="with-gap the_input_element" type="radio" name="'+ format_illegal_chars(current_field.find('.the_label').text()) +'" id="'+format_illegal_chars(current_field.find('.the_label').text())+'_'+format_illegal_chars(items[i])+'_'+ i +'_r" value="'+split_option[0]+'"><label class="input-label" for="'+format_illegal_chars(current_field.find('.the_label').text())+'_'+format_illegal_chars(items[i])+'_'+ i +'_r">'+ split_option[1] +'</label></p>';
							}
						else
							set_inputs += '<p class="radio_check_input '+ set_layout +'"><input class="with-gap the_input_element" type="radio" name="'+ format_illegal_chars(current_field.find('.the_label').text()) +'" id="'+format_illegal_chars(current_field.find('.the_label').text())+'_'+format_illegal_chars(items[i])+'_'+ i +'_r" value="'+items[i]+'"><label class="input-label" for="'+format_illegal_chars(current_field.find('.the_label').text())+'_'+format_illegal_chars(items[i])+'_'+ i +'_r">'+ items[i] +'</label></p>';
						}
					else if(current_field.hasClass('jq-check-group'))
						{
						if(strstr(items[i],'=='))
							{
							var split_option = items[i].split('==')
							set_inputs += '<div class="jq_radio_check '+ set_layout +'"><label class="input-label" for="'+format_illegal_chars(current_field.find('.the_label').text())+'_'+format_illegal_chars(items[i])+'_'+ i +'_jq">'+ split_option[1] +'</label><input type="checkbox" name="'+ format_illegal_chars(current_field.find('.the_label').text()) +'[]" id="'+format_illegal_chars(current_field.find('.the_label').text())+'_'+format_illegal_chars(items[i])+'_'+ i +'_jq" value="'+split_option[0]+'"></div>';
							}
						else
							set_inputs += '<div class="jq_radio_check '+ set_layout +'"><label class="input-label" for="'+format_illegal_chars(current_field.find('.the_label').text())+'_'+format_illegal_chars(items[i])+'_'+ i +'_jq">'+ items[i] +'</label><input type="checkbox" name="'+ format_illegal_chars(current_field.find('.the_label').text()) +'[]" id="'+format_illegal_chars(current_field.find('.the_label').text())+'_'+format_illegal_chars(items[i])+'_'+ i +'_jq" value="'+items[i]+'"></div>';
						}
					else if(current_field.hasClass('jq-radio-group'))

						{
						if(strstr(items[i],'=='))
							{
							var split_option = items[i].split('==')
							set_inputs += '<div class="jq_radio_check '+ set_layout +'"><label class="input-label" for="'+format_illegal_chars(current_field.find('.the_label').text())+'_'+format_illegal_chars(items[i])+'_'+ i +'_jq">'+ split_option[1] +'</label><input type="radio" name="'+ format_illegal_chars(current_field.find('.the_label').text()) +'" id="'+format_illegal_chars(current_field.find('.the_label').text())+'_'+format_illegal_chars(items[i])+'_'+ i +'_jq" value="'+split_option[0]+'"></div>';
							}
						else
							set_inputs += '<div class="jq_radio_check '+ set_layout +'"><label class="input-label" for="'+format_illegal_chars(current_field.find('.the_label').text())+'_'+format_illegal_chars(items[i])+'_'+ i +'_jq">'+ items[i] +'</label><input type="radio" name="'+ format_illegal_chars(current_field.find('.the_label').text()) +'" id="'+format_illegal_chars(current_field.find('.the_label').text())+'_'+format_illegal_chars(items[i])+'_'+ i +'_jq" value="'+items[i]+'"></div>';
						}
					else
						{
						if(strstr(items[i],'=='))
							{
							var split_option = items[i].split('==')
							set_inputs += '<label class="radio-inline '+ set_layout +'" for="'+ format_illegal_chars(current_field.find('.the_label').text())+'_'+format_illegal_chars(items[i]) +'" ><span class="svg_ready"><input class="radio the_input_element" type="radio" name="'+ format_illegal_chars(current_field.find('.the_label').text()) +'" id="'+format_illegal_chars(current_field.find('.the_label').text())+'_'+format_illegal_chars(items[i])+'" value="'+split_option[0]+'"><span class="input-label radio-label">'+split_option[1]+'</span></span></label>';
							}
						else
							set_inputs += '<label class="radio-inline '+ set_layout +'" for="'+ format_illegal_chars(current_field.find('.the_label').text())+'_'+format_illegal_chars(items[i]) +'" ><span class="svg_ready"><input class="radio the_input_element" type="radio" name="'+ format_illegal_chars(current_field.find('.the_label').text()) +'" id="'+format_illegal_chars(current_field.find('.the_label').text())+'_'+format_illegal_chars(items[i])+'" value="'+items[i]+'"><span class="input-label radio-label">'+items[i]+'</span></span></label>';
						}
					}
				}

				current_field.find('div#the-radios .input-inner').html(set_inputs);
				
			if(!current_field.hasClass('classic-check-group') && !current_field.hasClass('classic-radio-group'))
				{
				if(current_field.hasClass('check-group') || current_field.hasClass('radio-group') || current_field.hasClass('multi-image-select-group') || current_field.hasClass('single-image-select-group'))
					current_field.find('div#the-radios input').nexchecks();
				}
			if(current_field.hasClass('jq-check-group') || current_field.hasClass('jq-radio-group'))
				current_field.find( "#the-radios input" ).checkboxradio();
			}

		);	
	//SET RADIO TEXT COLOR
		change_color('set-radio-label-color','span.input-label','color','','');
	//SET RADIO BG COLOR
		change_color('set-radio-bgc-color','data-checked-bg-color','background-color','','');
	//SET RADIO TEXT COLOR	
		change_color('set-radio-text-color','a','color','','');
	//SET RADIO BG COLOR
		/*change_color('set-radio-bg-color','a','background-color');*/
	//SET RADIO BORDER COLOR
		change_color('set-radio-border-color','a','border-color','','');
	
	//SET INPUT RADIO CLASS
	jQuery(document).on('keyup','#set_radio_icon',
			function()
				{
				jQuery('.current_radio_icon i').attr('class',jQuery(this).val())
				
				
				if(jQuery(this).val()=='')
					{
					jQuery('.current_radio_icon i').text('Select Icon');
					jQuery('.current_radio_icon i').attr('class','');
					input_element.parent().find('a.checked').attr('class','checked ui-state-active fa fa-check');
					current_field.find('.the-radios').attr('data-checked-class','fa-check');
					}
				else
					{
					jQuery('.current_radio_icon i').text('');
					jQuery('.current_radio_icon i').attr('class',jQuery(this).val());
					current_field.find('.the-radios').attr('data-checked-class',jQuery(this).val());
					input_element.parent().find('a.checked').attr('class','checked ui-state-active ' + jQuery(this).val());
					}
				}
			);
	
	jQuery(document).on('click','.select-auto-step button',
			function()
				{
				jQuery('.select-auto-step button').removeClass('active');
				jQuery(this).addClass('active');
				
				current_field.removeClass('auto-step');
				current_field.closest('.step').removeClass('auto-step');
				
				if(jQuery(this).hasClass('auto-step-yes'))
					{
					current_field.addClass('auto-step');
					current_field.closest('.step').addClass('auto-step');
					}
				}
			);
	
	//SET RADIO LAYOUT
	jQuery(document).on('click','.display-radios-checks button',
				function()
					{
					jQuery('.display-radios-checks button').removeClass('active');
					jQuery(this).addClass('active');
					if(current_field.hasClass('image-choices-field'))
						var set_label = current_field.find('.image-choices-choice');
					else
						var set_label = current_field.find('#the-radios label');
					
					if(!set_label.attr('class'))
						var set_label = current_field.find('#the-radios div.jq_radio_check');
					
					if(!set_label.attr('class'))
						var set_label = current_field.find('#the-radios p.radio_check_input');
					
					set_label.removeClass('images-inline').removeClass('col-sm-2').removeClass('col-sm-3').removeClass('col-sm-4').removeClass('col-sm-6').removeClass('col-sm-12').removeClass('display-block');				
					
					
					
					if(jQuery(this).hasClass('1c'))
						{
						set_label.addClass('col-sm-12').addClass('display-block');
						current_field.find('#the-radios').attr('data-layout','1c');
						}
					else if(jQuery(this).hasClass('2c'))
						{
						set_label.addClass('col-sm-6');
						current_field.find('#the-radios').attr('data-layout','2c');
						}
					else if(jQuery(this).hasClass('3c'))
						{
						set_label.addClass('col-sm-4');
						current_field.find('#the-radios').attr('data-layout','3c');
						}
					else if(jQuery(this).hasClass('4c'))
						{
						set_label.addClass('col-sm-3');
						current_field.find('#the-radios').attr('data-layout','4c');
						}
					else if(jQuery(this).hasClass('6c'))
						{
						set_label.addClass('col-sm-2');
						current_field.find('#the-radios').attr('data-layout','6c');
						}
					else
						{
						set_label.removeClass('display-block');
						current_field.find('#the-radios').attr('data-layout','');
						}
					}
				);
	
	//SET INPUT POST-ICON
	jQuery(document).on('click','.current_radio_icon',
			function()
				{
				jQuery('.fa-icons-list').removeClass('set_animation_fast').removeClass('slideInRight').removeClass('slideOutRight').removeClass('icon_before').addClass('icon_after')
				jQuery('.fa-icons-list').addClass('set_animation_fast')
				jQuery('.fa-icons-list').addClass('slideInRight')
				jQuery('.fa-icons-list').show();
				jQuery('.fa-icons-list i').removeClass('active');
				var current_icon = jQuery('.current_radio_icon i').attr('class');
				if(current_icon)
					var set_current_icon_class = current_icon.replace('fa','').replace(' ','');
				if(current_icon)
					jQuery('.fa-icons-list i.' + set_current_icon_class).addClass('active');
				
				}
			);

	
	//SET ICON FIELD ICON
	jQuery(document).on('click','.icon-select',
			function()
				{
				jQuery(this).addClass('open');
				jQuery('.fa-icons-list').attr('data-edit-icon',jQuery(this).attr('data-edit-icon'));
				jQuery('.fa-icons-list').addClass('set_icon_on').removeClass('set_icon_off');
				jQuery('.fa-icons-list').removeClass('admin_animated').removeClass('slideInRight').removeClass('slideOutRight').removeClass('icon_before').addClass('icon_after')
				jQuery('.fa-icons-list').addClass('admin_animated').addClass('slideInRight').show();
				jQuery('.fa-icons-list i').removeClass('active');
				
				jQuery('.fa-icons-list').attr('data-icon-target',jQuery(this).attr('data-icon-target'))
				}
			);
	
	jQuery(document).on('click','.current_field_icon_on',
			function()
				{
				jQuery('.fa-icons-list').attr('data-edit-icon',jQuery(this).attr('data-edit-icon'));
				jQuery('.fa-icons-list').addClass('set_icon_on').removeClass('set_icon_off');
				jQuery('.fa-icons-list').removeClass('admin_animated').removeClass('slideInRight').removeClass('slideOutRight').removeClass('icon_before').addClass('icon_after')
				jQuery('.fa-icons-list').addClass('admin_animated').addClass('slideInRight').show();
				jQuery('.fa-icons-list i').removeClass('active');
				}
			);
	jQuery(document).on('click','.current_field_icon_off',
			function()
				{
				jQuery('.fa-icons-list').attr('data-edit-icon',jQuery(this).attr('data-edit-icon'));
				jQuery('.fa-icons-list').addClass('set_icon_off').removeClass('set_icon_on');
				jQuery('.fa-icons-list').removeClass('admin_animated').removeClass('slideInRight').removeClass('slideOutRight').removeClass('icon_before').addClass('icon_after')
				jQuery('.fa-icons-list').addClass('admin_animated').addClass('slideInRight').show();
				jQuery('.fa-icons-list i').removeClass('active');
				}
			);
			
//SET SLIDER SETTINGS	
	//SET SLIDER HANDEL COLORS
		change_color('set-slider-handel-text-color','.ui-slider-handle','color','','');
		change_color('set-slider-handel-bg-color','.ui-slider-handle','background-color','','');
		change_color('set-slider-handel-border-color','.ui-slider-handle','border-color','','');
	//SET SLIDER COLORS
		change_color('set-slider-bg-color','.ui-slider','background-color','','');
		change_color('set-slider-fill-color','.ui-slider-range','background-color','','');
		change_color('set-slider-border-color','.ui-slider','border-color','','');
		
	jQuery(document).on('keyup','#count_text',
		function()
			{
			current_field.find('#slider .ui-slider-handle span.count-text').html(jQuery(this).val());
			current_field.find('#slider').attr('data-count-text',jQuery(this).val());
			}
		);			

	jQuery(document).on('keyup','#minimum_value',
		function()
			{
			current_field.find( "#slider" ).attr('data-min-value',jQuery(this).val());
			current_field.find( "#slider" ).slider('option','min',parseInt(jQuery(this).val()))						
			}
		);
	
	jQuery(document).on('keyup','#step_value',
		function()
			{
			current_field.find( "#slider" ).attr('data-step-value',jQuery(this).val());
			current_field.find( "#slider" ).slider('option','step',parseInt(jQuery(this).val()))						
			}
		);
	
	jQuery(document).on('keyup','#maximum_value',
		function()
			{
			current_field.find( "#slider" ).attr('data-max-value',jQuery(this).val());
			current_field.find( "#slider" ).slider('option','max',parseInt(jQuery(this).val()))					
			}
		);
	
	jQuery(document).on('keyup','#start_value',
		function()
			{
			current_field.find( "#slider" ).attr('data-starting-value',jQuery(this).val());	
			current_field.find( "#slider" ).slider('value',parseInt(jQuery(this).val()))				
			}
		);
	
//SET SPINNER SETTINGS
	
	jQuery(document).on('keyup','#spin_minimum_value',
		function()
			{
			current_field.find( "#spinner" ).attr('data-minimum',jQuery(this).val());
			current_field.find( "#spinner" ).trigger("touchspin.updatesettings"	, {min:parseInt(jQuery(this).val())});				
			}
		);
	
	jQuery(document).on('keyup','#spin_maximum_value',
		function()
			{
			current_field.find( "#spinner" ).attr('data-maximum',jQuery(this).val());
			current_field.find( "#spinner" ).trigger("touchspin.updatesettings"	, {max:parseInt(jQuery(this).val())});				
			}
		);
		
	jQuery(document).on('keyup','#spin_start_value',
		function()
			{
			current_field.find( "#spinner" ).attr('data-starting-value',jQuery(this).val());
			current_field.find( "#spinner" ).trigger("touchspin.updatesettings"	, { initval:parseInt(jQuery(this).val()) } );				
			}
		);
		
	jQuery(document).on('keyup','#spin_step_value',
		function()
			{
			current_field.find( "#spinner" ).attr('data-step',jQuery(this).val());
			current_field.find( "#spinner" ).trigger("touchspin.updatesettings"	, { step:parseFloat(jQuery(this).val()) } );				
			}
		);
		
	jQuery(document).on('keyup','#spin_decimal',
		function()
			{
			current_field.find( "#spinner" ).attr('data-decimals',jQuery(this).val());
			current_field.find( "#spinner" ).trigger("touchspin.updatesettings"	, { decimals:parseInt(jQuery(this).val()) } );				
			}
		);
			

//SET SATE TIME SETTINGS

	jQuery(document).on('change','select#select_date_format',
		function()
			{
			current_field.find('#datetimepicker').attr('data-selected-format',jQuery(this).val())
			if(jQuery(this).val()!='custom')
				{
				current_field.find('#datetimepicker').attr('data-format',jQuery(this).val())
				jQuery('.set-custom-date-format').addClass('hidden');
				}
			else
				{
				current_field.find('#datetimepicker').attr('data-format',jQuery('#set_date_format').val())
				jQuery('.set-custom-date-format').removeClass('hidden');
				}
			}
	)
	
	jQuery(document).on('change','select#select_view_mode',
		function()
			{
			current_field.find('#datetimepicker').attr('data-viewMode',jQuery(this).val())
			current_field.find('#datetimepicker').datetimepicker('destroy');
			setup_form_element(current_field);
			}
	)

	jQuery(document).on('keyup','#set_date_format',
		function()
			{
			current_field.find('#datetimepicker').attr('data-format',jQuery(this).val())
			
			current_field.find('#datetimepicker').datetimepicker('destroy');
			setup_form_element(current_field);
			}
		);
				

	jQuery(document).on('change','select#date-picker-lang-selector',
		function()
			{
			current_field.find('#datetimepicker').attr('data-language',jQuery(this).val())
			
			current_field.find('#datetimepicker').datetimepicker('destroy');
			setup_form_element(current_field);
			}
	)
	
	jQuery(document).on('click','.enabled_hours button',
			function()
				{
				//jQuery('.disabled_hours button').removeClass('active');
				jQuery(this).toggleClass('active');
				var enabled_hours = ''
				jQuery('.enabled_hours button').each(
					function()
						{
						if(jQuery(this).hasClass('active'))
							{
							enabled_hours += jQuery(this).attr('data-val')+',';
							}
						}
					);
				enabled_hours = enabled_hours.replace(/,\s*$/, "");
				current_field.find('#datetimepicker').attr('data-enabled-hours',enabled_hours);
				
				current_field.find('#datetimepicker').datetimepicker('destroy');
				setup_form_element(current_field);
				}
			);
	
	
	jQuery(document).on('click','.enabled_days button',
			function()
				{
				//jQuery('.disabled_hours button').removeClass('active');
				jQuery(this).toggleClass('active');
				var enabled_days = ''
				jQuery('.enabled_days button').each(
					function()
						{
						if(!jQuery(this).hasClass('active'))
							{
							enabled_days += jQuery(this).attr('data-val')+',';
							}
						}
					);
				enabled_days = enabled_days.replace(/,\s*$/, "");
				current_field.find('#datetimepicker').attr('data-enabled-days',enabled_days);
				
				current_field.find('#datetimepicker').datetimepicker('destroy');
				setup_form_element(current_field);
				
				}
			);
		
	
	jQuery( "#set_time_stepping" ).spinner(
		{ 
		min:1,  
		spin: function( event, ui ) 
			{
			current_field.find('#datetimepicker').attr('data-stepping',ui.value);
			}
		}
		).on('keyup', function(e)
			{
			current_field.find('#datetimepicker').attr('data-stepping',jQuery(this).val());
			}
		).on('blur', function(e)
			{
			current_field.find('#datetimepicker').datetimepicker('destroy');
			setup_form_element(current_field);
			});
			
	jQuery(document).on('keyup','div.field-settings-column #set_disabled_dates',
			function()
				{
				current_field.find('#datetimepicker').attr('data-disabled-dates',jQuery(this).val())
				}
			);	
	
	jQuery(document).on('keyup','div.field-settings-column #set_min_date',
			function()
				{
				current_field.find('#datetimepicker').attr('data-min-date',jQuery(this).val())
				}
			);	
	
	jQuery(document).on('keyup','div.field-settings-column #set_max_date',
			function()
				{
				current_field.find('#datetimepicker').attr('data-max-date',jQuery(this).val())
				}
			);		
	
	
	jQuery(document).on('blur','div.field-settings-column #set_disabled_dates',
			function()
				{
				current_field.find('#datetimepicker').datetimepicker('destroy');
				setup_form_element(current_field);
				}
			);	
	
	jQuery(document).on('click','.popup-direction button',
			function()
				{
				jQuery('.popup-direction button').removeClass('active');
				jQuery(this).addClass('active');
				if(jQuery(this).hasClass('bottom')) 
					{
					current_field.find('#datetimepicker').attr('data-position','bottom')
					}
				else
					current_field.find('#datetimepicker').attr('data-position','top')
				}
				
			);
	
	jQuery(document).on('click','.popup-keep-open button',
			function()
				{
				jQuery('.popup-keep-open button').removeClass('active');
				jQuery(this).addClass('active');
				if(jQuery(this).hasClass('yes'))
					{
					current_field.find('#datetimepicker').attr('data-keep-open','true')
					}
				else
					current_field.find('#datetimepicker').attr('data-keep-open','false')
				}
				
			);
	
	jQuery(document).on('click','.display_calendar button',
			function()
				{
				jQuery('.display_calendar button').removeClass('active');
				jQuery(this).addClass('active');
				if(jQuery(this).hasClass('inline'))
					{
					jQuery('.set-popup-direction').hide();
					jQuery('.set-popup-keep-open').hide();
					jQuery('.align-time-inline').show();
					current_field.find('.input-group').addClass('date-group').removeClass('input-group')
					current_field.find('#datetimepicker').attr('data-inline','true')
					current_field.addClass('display_inline_cal');					
					}
				else
					{
					jQuery('.set-popup-direction').show();
					jQuery('.set-popup-keep-open').show();
					jQuery('.align-time-inline').hide();
					current_field.find('.date-group').addClass('input-group').removeClass('date-group')
					current_field.find('#input').prop('disabled',false);
					current_field.find('#datetimepicker').attr('data-calendar-display','popup')
					current_field.removeClass('display_inline_cal');
					current_field.find('#datetimepicker').attr('data-inline','false')
					}
				
				if(current_field.hasClass('time'))
					jQuery('.set-popup-keep-open').hide();
					
				current_field.find('#datetimepicker').datetimepicker('destroy');
				setup_form_element(current_field);
				}
			);
	jQuery(document).on('click','.disable_past_dates button',
			function()
				{
				jQuery('.disable_past_dates button').removeClass('active');
				jQuery(this).addClass('active');
				if(jQuery(this).hasClass('yes'))
					{
					current_field.find('#datetimepicker').attr('data-disable-past-dates','1')
					}
				else
					current_field.find('#datetimepicker').attr('data-disable-past-dates','0')
					
				current_field.find('#datetimepicker').datetimepicker('destroy');
				setup_form_element(current_field);	
				}
				
			);
	
		
//SET AUTOCOMPLETE SETTINGS
jQuery(document).on('change', "#set_selections",
		function()
			{
				current_field.find('.get_auto_complete_items').html(jQuery(this).val());
				if(current_field.hasClass('md-select'))
				{
				//build_md_select(current_field.find('#cd-dropdown'))
				}
			else if(current_field.hasClass('classic-select') || current_field.hasClass('classic-multi-select') || current_field.hasClass('classic-multi-select'))
				{
				}
			else
				{
				current_field.find('select').selectpicker('refresh');
				}
				
				var items = jQuery(this).val();
					items = items.split('\n');
					current_field.find("#autocomplete").autocomplete({
					source: items
					});	
			}
		);

//SET BUTTON SETTINGS
	//SET BUTTON VALUE
		jQuery(document).on('keyup','div.field-settings-column #set_button_val',
			function()
				{
				input_element.html(jQuery(this).val())
				}
			);
	//SET BUTTON POSITION
		jQuery(document).on('click','.button-position button',
			function()
				{
				jQuery('.button-position button').removeClass('active');
				jQuery(this).addClass('active');
				
				input_container.removeClass('align_left').removeClass('align_right').removeClass('align_center');
				
				if(jQuery(this).hasClass('left'))
					input_container.addClass('align_left');
				if(jQuery(this).hasClass('right'))
					input_container.addClass('align_right');
				if(jQuery(this).hasClass('center'))
					input_container.addClass('align_center');
				}
			);
	//SET BUTTON TEXT ALIGNMENT
		
		jQuery(document).on('click','.text-alignment',
			function()
				{
				jQuery('.text-alignment').removeClass('active');
				jQuery(this).addClass('active');
				
				input_element.removeClass('align_left').removeClass('align_right').removeClass('align_center');
				
				if(jQuery(this).hasClass('text-left'))
					input_element.addClass('align_left');
				if(jQuery(this).hasClass('text-right'))
					input_element.addClass('align_right');
				if(jQuery(this).hasClass('text-center'))
					input_element.addClass('align_center');
				}
			);
		
		jQuery(document).on('click','.button-text-align button',
			function()
				{
				jQuery('.button-text-align button').removeClass('active');
				jQuery(this).addClass('active');
				
				input_element.removeClass('text-left').removeClass('text-right').removeClass('text-center');
				
				if(jQuery(this).hasClass('left'))
					input_element.addClass('text-left');
				if(jQuery(this).hasClass('right'))
					input_element.addClass('text-right');
				if(jQuery(this).hasClass('center'))
					input_element.addClass('text-center');
				}
			);
		jQuery(document).on('click','.button-size button',
			function()
				{
				jQuery('.button-size button').removeClass('active');
				jQuery(this).addClass('active');
				
				input_element.removeClass('btn-lg').removeClass('btn-sm');
				
				if(jQuery(this).hasClass('small'))
					input_element.addClass('btn-sm');
				if(jQuery(this).hasClass('large'))
					input_element.addClass('btn-lg');
				}
			);
		jQuery(document).on('click','.button-width button',
			function()
				{
				jQuery('.button-width button').removeClass('active');
				jQuery(this).addClass('active');
				
				input_element.removeClass('full_width').removeClass('col-sm-12');
				
				if(jQuery(this).hasClass('full_button'))
					input_element.addClass('col-sm-12');
				}
			);
			
		jQuery(document).on('click','.add-button-shine button',
			function()
				{
				jQuery('.add-button-shine button').removeClass('active');
				jQuery(this).addClass('active');
				
				input_element.removeClass('add_shine');
				
				if(jQuery(this).hasClass('do_shine'))
					{
					input_element.addClass('add_shine');
					}
				
				}
			);
		
		
		jQuery(document).on('click','.button-type button',
			function()
				{
				jQuery('.button-type button').removeClass('active');
				jQuery(this).addClass('active');
				
				input_element.removeClass('nex-submit').removeClass('nex-step').removeClass('prev-step');
				
				if(jQuery(this).hasClass('next'))
					input_element.addClass('nex-step');
				else if(jQuery(this).hasClass('prev'))
					input_element.addClass('prev-step');
				else
					input_element.addClass('nex-submit');
					
				}
			);
//SET MATH SLIDER SETTINGS
		change_color('set-math-slider-handel-bg-color','.math-slider-progress-bar-total','background-color','','');
		change_color('set-math-slider-bg-color','.math-slider-progress','background-color','','');
		change_color('set-math-slider-fill-color','.math-slider-progress-bar','background-color','','');

//SET HEADING SETTINGS
	//SET HEADING TEXT
		jQuery(document).on('keyup','div.field-settings-column #set_heading_text',
			function()
				{
				input_element.html(jQuery(this).val())
				}
			);
	//SET HEADING SIZE	
		jQuery(document).on('click','.heading-size button',
			function()
				{
				jQuery('.heading-size button').removeClass('active');
				jQuery(this).addClass('active');
				
				var get_style = input_element.attr('style');
				var get_class = input_element.attr('class');
				var get_text  = input_element.html();
				var get_math  = input_element.attr('data-math-equation');
				var get_math2  = input_element.attr('data-original-math-equation');
				
				if(jQuery(this).hasClass('heading_1'))
					input_element.replaceWith('<h1 style="'+ get_style +'" data-original-math-equation="'+ get_math2 +'" data-math-equation="'+ get_math +'" class="'+ get_class +'">'+ get_text +'</h1>');
				if(jQuery(this).hasClass('heading_2'))
					input_element.replaceWith('<h2 style="'+ get_style +'" data-original-math-equation="'+ get_math2 +'" data-math-equation="'+ get_math +'" class="'+ get_class +'">'+ get_text +'</h2>');
				if(jQuery(this).hasClass('heading_3'))
					input_element.replaceWith('<h3 style="'+ get_style +'" data-original-math-equation="'+ get_math2 +'" data-math-equation="'+ get_math +'" class="'+ get_class +'">'+ get_text +'</h3>');
				if(jQuery(this).hasClass('heading_4'))
					input_element.replaceWith('<h4 style="'+ get_style +'" data-original-math-equation="'+ get_math2 +'" data-math-equation="'+ get_math +'" class="'+ get_class +'">'+ get_text +'</h4>');
				if(jQuery(this).hasClass('heading_5'))
					input_element.replaceWith('<h5 style="'+ get_style +'" data-original-math-equation="'+ get_math2 +'" data-math-equation="'+ get_math +'" class="'+ get_class +'">'+ get_text +'</h5>');
				if(jQuery(this).hasClass('heading_6'))
					input_element.replaceWith('<h6 style="'+ get_style +'" data-original-math-equation="'+ get_math2 +'" data-math-equation="'+ get_math +'" class="'+ get_class +'">'+ get_text +'</h6>');
				
				if(jQuery('.field-settings-column').hasClass('open_sidenav'))
						jQuery('.field-settings-column #close-settings').trigger('click');
				
				current_field.find('div.edit').trigger('click');
				setTimeout(function(){jQuery('.field-settings-column').removeClass('admin_animated').removeClass('pulse')},10);
				
				}
			);
	//SET HEADING ALINGMENT
		jQuery(document).on('click','.heading-text-align button',
			function()
				{
				jQuery('.heading-text-align button').removeClass('active');
				jQuery(this).addClass('active');
				
				input_element.removeClass('align_left').removeClass('align_right').removeClass('align_center');
				
				if(jQuery(this).hasClass('left'))
					input_element.addClass('align_left');
				if(jQuery(this).hasClass('right'))
					input_element.addClass('align_right');
				if(jQuery(this).hasClass('center'))
					input_element.addClass('align_center');
				}
			);	

//SET HTML SETTINGS
	//SET HTML
		jQuery(document).on('keyup','div.field-settings-column #set_html',
			function()
				{
				input_element.html(jQuery(this).val())
				}
			);

	jQuery( "#set_font_size" ).spinner(
		{ 
		min:7, 
		max:99,  
		spin: function( event, ui ) 
				{
				input_element.css('font-size',ui.value+'px');
				}
		}
	).on('keyup', function(e)
			{
			input_element.css('font-size',jQuery(this).val()+'px');
			});

		
		
	jQuery( "#set_element_border_size" ).spinner(
		{ 
		min:0, 
		max:50,  
		spin: function( event, ui ) 
				{
				if(current_field.hasClass('html_fields') || current_field.hasClass('math_logic_slider'))
					current_field.find('#field_container').css('border-width', ui.value +'px');
				else
					input_element.css('border-width', ui.value +'px');
				}
		}
	).on('keyup', function(e)
			{
			
			if(current_field.hasClass('html_fields') || current_field.hasClass('math_logic_slider'))
				current_field.find('#field_container').css('border-width', jQuery(this).val()+'px');
			else
				input_element.css('border-width', jQuery(this).val()+'px');
			
			});	


//SET ICON SIZE 


jQuery(document).on('click','.icon-alignment',
			function()
				{
				jQuery('.icon-alignment').removeClass('active');
				jQuery(this).addClass('active');
				
				var the_element = current_field.find('.icon_container_wrapper');
				
				the_element.removeClass('icon_left').removeClass('icon_right').removeClass('icon_center');
				
				if(jQuery(this).hasClass('icon-left'))
					the_element.addClass('icon_left');
				if(jQuery(this).hasClass('icon-right'))
					the_element.addClass('icon_right');
				if(jQuery(this).hasClass('icon-center'))
					the_element.addClass('icon_center');
				}
			);
jQuery( "#set_icon_size" ).spinner(
		{ 
		min:7, 
		max:200,  
		spin: function( event, ui ) 
				{
				input_element.css('font-size',ui.value+'px');
				}
		}
	).on('keyup', function(e)
			{
			input_element.css('font-size',jQuery(this).val()+'px');
			});
jQuery( "#set_icon_border_size" ).spinner(
		{ 
		min:0, 
		max:50,  
		spin: function( event, ui ) 
				{
				current_field.find('.icon_container').css('border-width', ui.value +'px');
				}
		}
	).on('keyup', function(e)
			{
			current_field.find('.icon_container').css('border-width',jQuery(this).val()+'px');
			});

change_color('icon-border-color','.icon_container','border-color','','');

jQuery(document).on('keyup','div.field-settings-column #set_icon_element',
			function()
				{
				jQuery(this).parent().find('.current_icon_element i').attr('class',jQuery(this).val())
				input_element.parent().find('.prefix span').attr('class',jQuery(this).val())
				
				
				// set_icon(set_class,icon_pos, icon_trigger, icon_target, icon_reverse_target, remove_icon)
				
				
				if(jQuery(this).val()=='')
					set_icon(jQuery(this).val(),'', 'current_icon_element', 'icon_element', '',true)
				else
					set_icon(jQuery(this).val(),'', 'current_icon_element', 'icon_element', '','')
				
				}
			);
	//SET INPUT PRE-ICON
	jQuery(document).on('click','.current_icon_element',
			function()
				{
				jQuery('.fa-icons-list').removeClass('set_animation_fast').removeClass('slideInRight').removeClass('slideOutRight').removeClass('icon_after').removeClass('icon_before')
				jQuery('.fa-icons-list').addClass('set_animation_fast')
				jQuery('.fa-icons-list').addClass('slideInRight')
				jQuery('.fa-icons-list').show();
				jQuery('.fa-icons-list i').removeClass('active');
				var current_icon = jQuery('.current_icon_element i').attr('class');
				if(current_icon)
					var set_current_icon_class = current_icon.replace('fa','').replace(' ','');
				if(current_icon)
					jQuery('.fa-icons-list i.' + set_current_icon_class).addClass('active');
				}
			);

// SET IMAGE THUMB SELECTION 
var current_image_selection = '';
jQuery(document).on('click',' .nex-forms-container .thumb-placeholder, .nex-forms-container .change_thumb',
		function()
			{
			current_image_selection = jQuery(this).closest('.image-choices-choice');
			jQuery('#do_upload_image_selection .fileinput input').trigger('click');
			}
		);

jQuery(document).on('click','.nex-forms-container .single-image-select-group .radio-label, .nex-forms-container .multi-image-select-group .radio-label, .html_image .image_container, .html_image .change_image2',
		function()
			{
				current_image_selection = jQuery(this);
					if(!jQuery('.nex-forms-container').hasClass('enable-form-styling'))
						{
						
						jQuery('#do_upload_image_selection .fileinput input').trigger('click');
						}
					}
				);
			
			jQuery(document).on('change','#do_upload_image_selection .fileinput input',
				function()
					{	
					jQuery('#do_upload_image_selection').submit();
					}
				)
			
			jQuery('#do_upload_image_selection').ajaxForm({
				data: {
				   action: 'do_upload_image',
				   mimeType: "multipart/form-data"
				},
				beforeSubmit: function(formData, jqForm, options) {
					
				},
			   success : function(responseText, statusText, xhr, $form) {
				  
				  var img_attr = 	JSON.parse(responseText);
				  
				 if(current_image_selection.closest('.form_field').hasClass('html_image'))
				 	{
					var form_field = current_image_selection.closest('.form_field');
					var placer = form_field.find('.image_container');
					form_field.find('.the-image-container').remove();
					//JSON.parse(
					var set_image = '<div class="the-image-container" style="width:'+ img_attr['dimention'][0] +'px;height:'+ img_attr['dimention'][1] +'px; "><img src="'+ img_attr['image_url'] +'" class="html-image-obj" data-original-height="'+ img_attr['dimention'][1] +'" data-original-width="'+ img_attr['dimention'][0] +'" alt="" width="'+ img_attr['dimention'][0] +'" height="'+ img_attr['dimention'][1] +'"><span class="show-width">'+ img_attr['dimention'][1] +'px</span><span class="show-height">'+ img_attr['dimention'][0] +'px</span><div class="change_image2"><button class="btn md-btn btn-light-blue ">Change</button></div></div>';
				 	jQuery(set_image).insertAfter(placer);
					placer.hide();	
					
					var image = form_field.find('.the-image-container');
					var width_display = form_field.find('.show-width');
					var height_display = form_field.find('.show-height');

					form_field.find('.the-image-container img').resizable({
					  minHeight: 20,
					  minWidth: 20,
					  resize: function( event, ui ) {
						  image.addClass('resizing');
						  image.css('width',ui.size['width']+'px');
						  image.css('height',ui.size['height']+'px');
						  width_display.text(ui.size['width']+'px');
						  height_display.text(ui.size['height']+'px');
						  
						   if(form_field.hasClass('currently_editing'))
							{
							jQuery('#set_image_width').val(ui.size['width']);
							jQuery('#set_image_height').val(ui.size['height']);
							}
						  
						  },
					  stop: function( event, ui ){
						  image.removeClass('resizing');
					  }
					});
					
					
					
					}
				else if(current_image_selection.closest('.form_field').hasClass('image-choices-field'))
					{
					current_image_selection.find('.image-choices-choice-image-wrap').html('<img class="the-thumb-image" src="'+ img_attr['image_url'] +'"><div class="change_thumb" title="Change Image"><span class="fas fa-exchange-alt"></span></div>');
					}
				 else  
				   	{
					current_image_selection.find('img').remove();
				 	current_image_selection.append('<img src="'+ img_attr['image_url'] +'" class="radio-image">')
					}
				 
				},
				 error: function(jqXHR, textStatus, errorThrown)
					{
					   console.log(errorThrown)
					}
			});
//IMAGE CHOICES FIELD
	//Outer Wrapper
	change_color('thumb-wrapper-color','.image-choices-choice label.radio-inline','background-color','','');
	change_color('thumb-border-color','.image-choices-choice label.radio-inline','border-color','','');

	//Image Wrapper
	change_color('image-wrapper-color','.image-choices-choice .image-choices-choice-image-wrap','background-color','','');
	change_color('image-border-color','.image-choices-choice .image-choices-choice-image-wrap','border-color','','');

	//Label Wrapper
	change_color('label-wrapper-color','.image-choices-choice .image-choices-choice-text','background-color','','');
	change_color('label-border-color','.image-choices-choice .image-choices-choice-text','border-color','','');
	
	set_biu_style('span.thumb','.image-choices-choice .image-choices-choice-text','bold');
	set_biu_style('span.thumb','.image-choices-choice .image-choices-choice-text','italic');
	set_biu_style('span.thumb','.image-choices-choice .image-choices-choice-text','underline');
	
	jQuery(document).on('change','#google_fonts_thumbs',
		function()
			{
			nf_apply_font(jQuery('.image-choices-choice .image-choices-choice-text'), 'google_fonts_thumbs');
			}
		);
	
	jQuery(document).on('click','.thumb-text-alignment',
		function()
			{
			jQuery('.thumb-text-alignment').removeClass('active');
			jQuery(this).addClass('active');
			input_container.find('.image-choices-choice .image-choices-choice-text').removeClass('align_left').removeClass('align_right').removeClass('align_center');
			if(jQuery(this).hasClass('text-left'))
				{
				input_container.find('.image-choices-choice .image-choices-choice-text').addClass('align_left');
				}
			if(jQuery(this).hasClass('text-right'))
				{
				input_container.find('.image-choices-choice .image-choices-choice-text').addClass('align_right');
				}
			if(jQuery(this).hasClass('text-center'))
				{
				input_container.find('.image-choices-choice .image-choices-choice-text').addClass('align_center');
				}
			}
		);
	
	jQuery(document).on('click','.thumb-label-pos',
		function()
			{
			jQuery('.thumb-label-pos').removeClass('active');
			jQuery(this).addClass('active');
			input_container.removeClass('label-pos-top');
			var the_selection = jQuery(this);
			if(the_selection.hasClass('set-label-top'))
				input_container.addClass('label-pos-top');
						
			
			input_container.find('.image-choices-choice').each(
				function()
					{
					var the_label = jQuery(this).find('.image-choices-choice-text').detach();
					var the_image = jQuery(this).find('.thumb-image-outer-wrap');
					if(the_selection.hasClass('set-label-top'))
						{
						the_label.insertBefore(the_image);
						}
					if(the_selection.hasClass('set-label-bottom'))
						{
						the_label.insertAfter(the_image);
						}
					}
				);
			}
		);
	
	
	
	jQuery(document).on('click','.thumbs-direction button',
				function()
					{
					jQuery('.thumbs-direction button').removeClass('active');
					jQuery(this).addClass('active');
					
					var set_label = current_field.find('.image-choices-choice');
					set_label.removeClass('images-inline').removeClass('col-sm-2').removeClass('col-sm-3').removeClass('col-sm-4').removeClass('col-sm-6').removeClass('col-sm-12').removeClass('display-block');				
					
					
					
					if(jQuery(this).hasClass('inline'))
						{
						set_label.addClass('images-inline');
						}
					else
						{
						set_label.addClass('col-sm-12').addClass('display-block');	
						}
					}
				);
	
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
	
	
	jQuery(document).on('click','.set-dimentions',
		function()
			{
			jQuery('.set-dimentions').removeClass('active');
			jQuery(this).addClass('active');
			current_field.removeClass('cropped');
			if(jQuery(this).hasClass('image-auto'))
				{
				input_container.find('.image-choices-choice').css('width','');
				input_container.find('.image-choices-choice').css('heigth','auto');
				jQuery('.thumbs-direction').parent().hide();
				jQuery('.align-thumbs').parent().hide();
				jQuery('.s-thumbs-select .display-radios-checks').parent().show();	
				jQuery('#thumb-image-width').spinner("disable")	
				jQuery('.s-thumbs-select .display-radios-checks button.active').trigger('click');
				}
			if(jQuery(this).hasClass('image-crop'))
				{
				jQuery('.thumbs-direction').parent().show();
				jQuery('.align-thumbs').parent().show();
				jQuery('.s-thumbs-select .display-radios-checks').parent().hide()
				input_container.find('.image-choices-choice').css('width',jQuery( "#thumb-image-width" ).val()+'px');
				current_field.addClass('cropped');
				jQuery('#thumb-image-width').spinner("enable")//;prop('disabled',false);	
				jQuery('.thumbs-direction button.active').trigger('click');
				}
			}
		);
		
	
	jQuery(document).on('click','.thumb-auto-step button',
			function()
				{
				jQuery('.thumb-auto-step button').removeClass('active');
				jQuery(this).addClass('active');
				
				current_field.removeClass('auto-step');
				current_field.closest('.step').removeClass('auto-step');
				
				if(jQuery(this).hasClass('auto-step-yes'))
					{
					current_field.addClass('auto-step');
					current_field.closest('.step').addClass('auto-step');
					}
				}
			);
	
	jQuery(document).on('click','.thumb-selection-type button',
			function()
				{
				jQuery('.thumb-selection-type button').removeClass('active');
				jQuery(this).addClass('active');
				
				
				var inputs = current_field.find('input');
				var input_name = inputs.attr('name');
				
				if(jQuery(this).hasClass('multi-thumd-select'))
					{
					inputs.attr('type','checkbox');
					
					if(!strstr(input_name,'[]'))

						input_name = input_name+'[]';
					
					inputs.attr('name',input_name);
					current_field.addClass('multi-images-choice');
					
					jQuery('div.field-settings-column #set_input_name').val(input_name);
					jQuery('div.field-settings-column .thumb-auto-step').hide();
					
					current_field.addClass('multi-images-choice');
					current_field.removeClass('auto-step');
					current_field.closest('.step').removeClass('auto-step');
					}
				else
					{
					inputs.attr('type','radio');
					
					if(strstr(input_name,'[]'))
						input_name = input_name.replace('[]','');
					
					inputs.attr('name',input_name);
					jQuery('div.field-settings-column #set_input_name').val(input_name);
					
					jQuery('div.field-settings-column .thumb-auto-step').show();
					current_field.removeClass('multi-images-choice');
					if(jQuery('.thumb-auto-step button.auto-step-yes').hasClass('active'))
						{
						current_field.addClass('auto-step');
						current_field.closest('.step').addClass('auto-step');
						}
					
					}
				
				
				}
			);
	
	//Outer
	jQuery( "#thumb-wrapper-padding" ).spinner(
		{ 
		min:0,  
		spin: function( event, ui ) 
				{
				input_container.find('.image-choices-choice label.radio-inline').css('padding',ui.value+'px');
				}
		}
	).on('keyup', function(e)
			{
			input_container.find('.image-choices-choice label.radio-inline').css('padding',jQuery(this).val()+'px');
			});
			
	//Image		
	jQuery( "#image-wrapper-padding" ).spinner(
		{ 
		min:0,  
		spin: function( event, ui ) 
				{
				input_container.find('.image-choices-choice .image-choices-choice-image-wrap').css('padding',ui.value+'px');
				}
		}
	).on('keyup', function(e)
			{
			input_container.find('.image-choices-choice .image-choices-choice-image-wrap').css('padding',jQuery(this).val()+'px');
			});
	
	jQuery( "#thumb-image-width" ).spinner(
		{ 
		min:0,  
		spin: function( event, ui ) 
				{
				input_container.find('.image-choices-choice').css('width',ui.value+'px');
				
				}
		}
	).on('keyup', function(e)
			{
			input_container.find('.image-choices-choice').css('width',jQuery(this).val()+'px');
			});
	
	jQuery( "#thumb-image-height" ).spinner(
		{ 
		min:0,  
		spin: function( event, ui ) 
				{
				input_container.find('.image-choices-choice').css('height',ui.value+'px');
				//input_container.find('.image-choices-choice .image-choices-choice-image-wrap img').css('height',ui.value+'px');
				}
		}
	).on('keyup', function(e)
			{
			input_container.find('.image-choices-choice').css('height',jQuery(this).val()+'px');
			//input_container.find('.image-choices-choice .image-choices-choice-image-wrap img').css('height',ui.value+'px');
			});
			
	//Label	
	jQuery( "#label-wrapper-padding" ).spinner(
		{ 
		min:0,  
		spin: function( event, ui ) 
				{
				input_container.find('.image-choices-choice .image-choices-choice-text').css('padding',ui.value+'px');
				}
		}
	).on('keyup', function(e)
			{
			input_container.find('.image-choices-choice .image-choices-choice-text').css('padding',jQuery(this).val()+'px');
			});
	
	
	
	//Outer
	jQuery( "#thumb-wrapper-border-width" ).spinner(
		{ 
		min:0,  
		spin: function( event, ui ) 
				{
				input_container.find('.image-choices-choice label.radio-inline').css('border-width',ui.value+'px');
				}
		}
	).on('keyup', function(e)
			{
			input_container.find('.image-choices-choice label.radio-inline').css('border-width',jQuery(this).val()+'px');
			});
			
	//Image		
	jQuery( "#image-wrapper-border-width" ).spinner(
		{ 
		min:0,  
		spin: function( event, ui ) 
				{
				input_container.find('.image-choices-choice .image-choices-choice-image-wrap').css('border-width',ui.value+'px');
				}
		}
	).on('keyup', function(e)
			{
			input_container.find('.image-choices-choice .image-choices-choice-image-wrap').css('border-width',jQuery(this).val()+'px');
			});
	
	
			
	//Label	
	jQuery( "#label-wrapper-border-width" ).spinner(
		{ 
		min:0,  
		spin: function( event, ui ) 
				{
				input_container.find('.image-choices-choice .image-choices-choice-text').css('border-width',ui.value+'px');
				}
		}
	).on('keyup', function(e)
			{
			input_container.find('.image-choices-choice .image-choices-choice-text').css('border-width',jQuery(this).val()+'px');
			});
	
	
	
	jQuery( "#image-wrapper-border-radius" ).spinner(
		{ 
		min:0,  
		spin: function( event, ui ) 
				{
				input_container.find('.image-choices-choice .image-choices-choice-image-wrap').css('border-radius',ui.value+'px');
				input_container.find('.image-choices-choice .thumb-image-outer-wrap').css('border-radius',ui.value+'px');
				}
		}
	).on('keyup', function(e)
			{
			input_container.find('.image-choices-choice .image-choices-choice-image-wrap').css('border-radius',jQuery(this).val()+'px');
			input_container.find('.image-choices-choice .thumb-image-outer-wrap').css('border-radius',jQuery(this).val()+'px');
			});
	
	
	jQuery( "#label-wrapper-border-radius" ).spinner(
		{ 
		min:0,  
		spin: function( event, ui ) 
				{
				input_container.find('.image-choices-choice .image-choices-choice-text').css('border-radius',ui.value+'px');
				}
		}
	).on('keyup', function(e)
			{
			input_container.find('.image-choices-choice .image-choices-choice-text').css('border-radius',jQuery(this).val()+'px');
			});
	
	
	jQuery( "#set_thumb_font_size" ).spinner(
		{ 
		min:7,
		max:99,   
		spin: function( event, ui ) 
				{
				input_container.find('.image-choices-choice .image-choices-choice-text').css('font-size',ui.value+'px');
				}
		}
	).on('keyup', function(e)
			{
			input_container.find('.image-choices-choice .image-choices-choice-text').css('font-size',jQuery(this).val()+'px');
			});
	
	jQuery( "#set_thumb_label_margin_top" ).spinner(
		{ 
		//min:8,  
		spin: function( event, ui ) 
			{
			input_container.find('.image-choices-choice .image-choices-choice-text').css('margin-top',ui.value+'px');
			}
		}
	).on('keyup', function(e)
			{
			input_container.find('.image-choices-choice .image-choices-choice-text').css('margin-top',jQuery(this).val()+'px');
			});
	
	
	jQuery( "#set_thumb_label_margin_right" ).spinner(
		{ 
		//min:8,  
		spin: function( event, ui ) 
			{
			input_container.find('.image-choices-choice .image-choices-choice-text').css('margin-right',ui.value+'px');
			}
		}
	).on('keyup', function(e)
			{
			input_container.find('.image-choices-choice .image-choices-choice-text').css('margin-right',jQuery(this).val()+'px');
			});
			
			
	jQuery( "#set_thumb_label_margin_bottom" ).spinner(
		{ 
		//min:8,  
		spin: function( event, ui ) 
			{
			input_container.find('.image-choices-choice .image-choices-choice-text').css('margin-bottom',ui.value+'px');
			}
		}
	).on('keyup', function(e)
			{
			input_container.find('.image-choices-choice .image-choices-choice-text').css('margin-bottom',jQuery(this).val()+'px');
			});
	
	
	jQuery( "#set_thumb_label_margin_left" ).spinner(
		{ 
		//min:8,  
		spin: function( event, ui ) 
			{
			input_container.find('.image-choices-choice .image-choices-choice-text').css('margin-left',ui.value+'px');
			}
		}
	).on('keyup', function(e)
			{
			input_container.find('.image-choices-choice .image-choices-choice-text').css('margin-left',jQuery(this).val()+'px');
			});
			
	jQuery(document).on('click','.checked-v-position',
		function()
			{
			jQuery('.checked-v-position').removeClass('active');
			jQuery(this).addClass('active');
			input_container.removeClass('checked_top').removeClass('checked_bottom');
			if(jQuery(this).hasClass('v_top'))
				{
				input_container.addClass('checked_top');
				}
			if(jQuery(this).hasClass('v_bottom'))
				{
				input_container.addClass('checked_bottom');
				}
			}
		);
	
	jQuery(document).on('click','.checked-h-position',
		function()
			{
			jQuery('.checked-h-position').removeClass('active');
			jQuery(this).addClass('active');
			input_container.removeClass('checked_left').removeClass('checked_right');
			if(jQuery(this).hasClass('h_left'))
				{
				input_container.addClass('checked_left');
				}
			if(jQuery(this).hasClass('h_right'))
				{
				input_container.addClass('checked_right');
				}
			}
		);	
	
	jQuery(document).on('click','.checked-radius',
		function()
			{
			jQuery('.checked-radius').removeClass('active');
			jQuery(this).addClass('active');
			input_container.removeClass('checked_squared');
			if(jQuery(this).hasClass('icon_squared'))
				{
				input_container.addClass('checked_squared');
				}
			}
		);	
			
	
	jQuery(document).on('change','select#check_image_animation',
		function()
			{
			input_container.attr('data-checked-animation',jQuery(this).val())
			}
	)
	
	jQuery(document).on('change','select#uncheck_image_animation',
		function()
			{
			input_container.attr('data-unchecked-animation',jQuery(this).val())
			}
	)
			
//PANEL SETTINGS
	//SET PANEL HEADING TEXT
		jQuery(document).on('keyup','div.field-settings-column #set_panel_heading',
			function()
				{
				current_field.find('div.panel-heading').html(jQuery(this).val())
				}
			);
	//SET PANEL BIU
		set_biu_style('span.panel-heading','div.panel-heading','bold');
		set_biu_style('span.panel-heading','div.panel-heading','italic');
		set_biu_style('span.panel-heading','div.panel-heading','underline');
	
	//SET PANEL COLORS
	change_color('set-panel-heading-text-color','div.panel-heading','color','','');
	change_color('set-panel-heading-bg-color','div.panel-heading','background-color','','');
	change_color('set-panel-heading-border-color','div.panel-heading','border-color','','');
	
	change_color('set-panel-body-bg-color','div.panel-body','background-color','','');
	change_color('set-panel-body-border-color','div.panel','border-color','','');
	
	
	
	
	
	//SET PANEL HEADING DISPLAY
	jQuery(document).on('click','.show_panel-heading button',
		function()
			{
			jQuery('.show_panel-heading button').removeClass('active');
			jQuery(this).addClass('active');
			
			var get_obj = current_field.find('.panel-heading');
		
				if(jQuery(this).hasClass('yes'))
					{
					get_obj.removeClass('hidden');
					current_field.removeClass('no_heading')
					}
				if(jQuery(this).hasClass('no'))
					{
					get_obj.addClass('hidden');
					current_field.addClass('no_heading')
					}
			}
		);	
	
	jQuery(document).on('click','.panel-heading-size button',
			function()
				{
				jQuery('.panel-heading-size button').removeClass('active');
				jQuery(this).addClass('active');
				
				var get_obj = current_field.find('.panel-heading');
				get_obj.removeClass('input-lg').removeClass('input-sm').removeClass('btn-lg').removeClass('btn-sm');
				
					if(jQuery(this).hasClass('small'))
						get_obj.addClass('btn-sm');
					if(jQuery(this).hasClass('large'))
						get_obj.addClass('btn-lg');
				}
			);
	
	//SET HEADING ALINGMENT
		jQuery(document).on('click','.panel-heading-text-align button',
			function()
				{
				jQuery('.panel-heading-text-align button').removeClass('active');
				jQuery(this).addClass('active');
				
				var get_obj = current_field.find('.panel-heading');
				
				get_obj.removeClass('align_left').removeClass('align_right').removeClass('align_center');
				
				if(jQuery(this).hasClass('left'))
					get_obj.addClass('align_left');
				if(jQuery(this).hasClass('right'))
					get_obj.addClass('align_right');
				if(jQuery(this).hasClass('center'))
					get_obj.addClass('align_center');
				}
			);	
	
//SETUP VALIDATION SETTINGS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////				
	//SET REQUERED FIELD
		jQuery(document).on('click','.required button',
				function()
					{
					jQuery('.required button').removeClass('active');
					jQuery(this).addClass('active');
				
					var get_input = current_field.find('.the_input_element');
					var get_obj = current_field.find('label');
					current_field.removeClass('required')
					
					get_input.removeClass('required');
					current_field.find('.is_required').addClass('hidden')
						
					if(current_field.hasClass('select') || current_field.hasClass('multi-select'))
						current_field.find('select').attr('data-required','false').removeClass('required');
					
					var label_val = label_container.find('.the_label').html();
					label_val = label_val.replace('* ','');
					label_val = label_val.replace('*','');
						
						
					
					if(jQuery(this).hasClass('yes'))
						{
						
						current_field.addClass('required')
						get_input.addClass('required');
						if(current_field.hasClass('select') || current_field.hasClass('multi-select'))
							current_field.find('select').attr('data-required','true').addClass('required');

						//jQuery('#set_label').val('*'+label_val);
						label_container.find('.the_label').html('*'+label_val)
						}
					else
						{
						label_container.find('.the_label').html(label_val)
						}
							
					}
				);
		
		jQuery(document).on('click','.error-style button',
			function()
				{
				jQuery('.error-style button').removeClass('active');
				jQuery(this).addClass('active');
				current_field.removeClass('classic_error_style')
				if(jQuery(this).hasClass('classic'))
					{
					current_field.addClass('classic_error_style');	
					}
				}
			);
	
		jQuery(document).on('click','.error-position button',
			function()
				{
				jQuery('.error-position button').removeClass('active');
				jQuery(this).addClass('active');
				current_field.removeClass('error_left')
				if(jQuery(this).hasClass('set_left'))
					{
					current_field.addClass('error_left');	
					}
				}
			);
		
		
		//SET REQUIRED INDICATOR
			jQuery(document).on('click','.required-star button',
				function()
					{
					jQuery('.required-star button').removeClass('active');
					jQuery(this).addClass('active');
					if(jQuery(this).hasClass('empty'))
						current_field.find('.is_required').removeClass('glyphicon-star').removeClass('glyphicon-asterisk').addClass('glyphicon-star-empty');
					else if(jQuery(this).hasClass('asterisk'))
						current_field.find('.is_required').removeClass('glyphicon-star-empty').removeClass('glyphicon-star').addClass('glyphicon-asterisk');
					else if(jQuery(this).hasClass('none'))
						current_field.find('.is_required').removeClass('glyphicon-star-empty').removeClass('glyphicon-star').removeClass('glyphicon-asterisk');
					else
						current_field.find('.is_required').removeClass('glyphicon-star-empty').removeClass('glyphicon-asterisk').addClass('glyphicon-star');	
					}
				);
		//SET VALIDATION FORMAT
		jQuery(document).on('change','select[name="validate-as"]',
		function()
			{
				current_field.find('input').removeClass('email').removeClass('url').removeClass('phone_number').removeClass('numbers_only').removeClass('text_only');
				current_field.removeClass('email').removeClass('url').removeClass('phone_number').removeClass('numbers_only').removeClass('text_only');	
				
				current_field.find('input').addClass(jQuery(this).val());
				current_field.addClass(jQuery(this).val());
				
				if(jQuery(this).val()=='none' || jQuery(this).val()=='')
					{
					jQuery('#set_secondary_error').val('');	
					}
				else
					{
					if(jQuery(this).val()=='email')
						current_field.find('.error_message').attr('data-secondary-message','Invalid e-mail format');
					if(jQuery(this).val()=='url')
						current_field.find('.error_message').attr('data-secondary-message','Invalid url format');
					if(jQuery(this).val()=='phone_number')
						current_field.find('.error_message').attr('data-secondary-message','Invalid phone number format');
					if(jQuery(this).val()=='numbers_only')
						current_field.find('.error_message').attr('data-secondary-message','Only numbers are allowed');
					if(jQuery(this).val()=='text_only')
						current_field.find('.error_message').attr('data-secondary-message','Only text are allowed');
				
					jQuery('#set_secondary_error').val(current_field.find('.error_message').attr('data-secondary-message'));
					}
				}
		)	
		
		set_max_selection
		
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
	//SET MAX CHARS
		jQuery(document).on('keyup','div.field-settings-column #set_max_val',
			function()
				{
				input_element.attr('maxlength',jQuery(this).val())
				input_element.attr('data-length',jQuery(this).val())
				}
			);
	//SET MAX CHARS
		jQuery(document).on('keyup','div.field-settings-column #set_min_val',
			function()
				{
				input_element.attr('minlength',jQuery(this).val())
				}
			);
	//SET INPUT MASK
		jQuery(document).on('keyup','div.field-settings-column #set_input_mask',
			function()
				{
				input_element.attr('data-input-mask',jQuery(this).val())
				}
			);
	
	//SET ERROR MESSAGE
		jQuery(document).on('keyup','div.field-settings-column #the_error_mesage',
			function()
				{
				current_field.find('.error_message').attr('data-content',jQuery(this).val())
				}
			);
	//SET SECONDARY ERROR MESSAGE
		jQuery(document).on('keyup','div.field-settings-column #set_secondary_error',
			function()
				{
				current_field.find('.error_message').attr('data-secondary-message',jQuery(this).val())
				}
			);
	//SET MAX SIZE PER FILE
	jQuery(document).on('keyup','div.field-settings-column #max_file_size_pf',
		function()
			{
			input_element.attr('data-max-size-pf',jQuery(this).val())
			}
		);
	//SET MIN SIZE PER FILE
	jQuery(document).on('keyup','div.field-settings-column #min_file_size_pf',
		function()
			{
			input_element.attr('data-min-size-pf',jQuery(this).val())
			}
		);
	
	jQuery(document).on('keyup','div.field-settings-column #max_file_size_pf_error',
		function()
			{
			input_element.attr('data-max-per-file-message',jQuery(this).val())
			}
		);
	
	jQuery(document).on('keyup','div.field-settings-column #min_file_size_pf_error',
		function()
			{
			input_element.attr('data-min-per-file-message',jQuery(this).val())
			}
		);
	
	
	//SET MAX SIZE ALL FILES
	jQuery(document).on('keyup','div.field-settings-column #max_file_size_af',
		function()
			{
			input_element.attr('data-max-size-overall',jQuery(this).val())
			}
		);
	jQuery(document).on('keyup','div.field-settings-column #max_file_size_af_error',
		function()
			{
			input_element.attr('data-max-all-file-message',jQuery(this).val())
			}
		);

	//SET MAX UPLOAD LIMIT
	jQuery(document).on('keyup','div.field-settings-column #max_upload_limit',
		function()
			{
			input_element.attr('data-max-files',jQuery(this).val())
			}
		);
	jQuery(document).on('keyup','div.field-settings-column #max_upload_limit_error',
		function()
			{
			input_element.attr('data-file-upload-limit-message',jQuery(this).val())
			}
		);
	//SET MAX UPLOAD LIMIT
	jQuery(document).on('keyup','#set_divider_height',
		function()
			{
			input_element.css('border-width',jQuery(this).val());	
			}
		);
	
			
			
			
	//SET ALLOWED EXTENTIONS
	jQuery(document).on('change','#set_extensions',
		function()
			{
				current_field.find('div.get_file_ext').html(jQuery(this).val());
				}
			);	
//SETUP ANIMATION SETTINGS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////					   
	//SET ANIMATION
	  jQuery(document).on('change','#field_animation',
			function()
				{
				
				var animation_preview = jQuery('.animation_preview')
				animation_preview.attr('class','');
				
				animation_preview.addClass('animation_preview');
				animation_preview.addClass(jQuery(this).val());
				animation_preview.addClass('animated');
				
				setTimeout(function(){ animation_preview.removeClass('animated') },1000);
				
				current_field.attr('data-animation-name','');
				jQuery('#field_animation option').each(
					function()
						{
						current_field.removeClass(jQuery(this).text());
						}
					)
				
				
				if(jQuery(this).val()=='no_animation')
					{
					current_field.removeClass('wow');
					current_field.attr('data-animation-name','');
					}
				else
					current_field.addClass('wow').addClass(jQuery(this).val());
					current_field.attr('data-animation-name',jQuery(this).val());
					}
			);
	//SET DELAY
		jQuery(document).on('keyup','#animation_delay',
			function()
				{
				current_field.attr('data-wow-delay', jQuery(this).val()+'s');
				}
			);
	//SET DURATION
		jQuery(document).on('keyup','#animation_duration',
			function()
				{
				current_field.attr('data-wow-duration', jQuery(this).val()+'s');
				}
			);
//SET MATH LOGIC SETTINGS
	//SET CURRENT FIELDS
		jQuery(document).on('change','select[name="math_fields"]',
			function(){
				jQuery('#set_math_logic_equation').trigger('focus');
				insertAtCaret('set_math_logic_equation', jQuery(this).val());
			}
		);
	//SET MATH EQUATION	
		jQuery(document).on('keyup','#set_math_logic_equation',
			function()
				{
				current_field.find('.the_input_element').attr('data-math-equation',jQuery(this).val());
				current_field.find('.the_input_element').attr('data-original-math-equation',jQuery(this).val());
				}
			);
		jQuery(document).on('blur','#set_math_logic_equation',
			function()
				{
				if(current_field)
					{
					current_field.find('.the_input_element').attr('data-math-equation',jQuery(this).val());
					current_field.find('.the_input_element').attr('data-original-math-equation',jQuery(this).val());
					}
				}
			);
		jQuery(document).on('keyup','#set_math_input_name',
			function()
				{
				var formated_value = format_illegal_chars(jQuery(this).val());
				jQuery('#set_math_input_name').val(formated_value);
				current_field.find('.set_math_result').attr('name',formated_value)
				}
			);
		jQuery(document).on('keyup','#set_decimals',
			function()
				{
				current_field.find('.the_input_element').attr('data-decimal-places',jQuery(this).val())
				}
			);
		jQuery(document).on('keyup','#set_decimals_delimiter',
			function()
				{
				current_field.find('.the_input_element').attr('data-decimal-separator',jQuery(this).val())
				}
			);
		jQuery(document).on('keyup','#set_thousand_delimiter',
			function()
				{
				current_field.find('.the_input_element').attr('data-thousand-separator',jQuery(this).val())
				}
			);
		jQuery(document).on('keyup','#set_maximum_range',
			function()
				{
				current_field.find('.the_input_element').attr('data-max-value',jQuery(this).val())
				}
			);
		
		//SET INPUT SIZE
		jQuery(document).on('click','.math-slider-size button',
			function()
				{
				jQuery('.math-slider-size button').removeClass('active');
				jQuery(this).addClass('active');
				
				var get_label = current_field.find('.math-slider-wrapper');
				get_label.removeClass('nf-lg').removeClass('nf-sm');
				
				if(jQuery(this).hasClass('small'))
					get_label.addClass('nf-sm');
				if(jQuery(this).hasClass('large'))
					get_label.addClass('nf-lg');
				}
			);	
		
		jQuery(document).on('click','.enable_count_animation button',
		function()
			{
			jQuery('.enable_count_animation button').removeClass('active');
			jQuery(this).addClass('active');
			current_field.find('.the_input_element').attr('data-animate-count','yes')
				if(jQuery(this).hasClass('no'))
					{
					current_field.find('.the_input_element').attr('data-animate-count','no')
					}
			}
		);	
//SET GRID SETTINGS
//COL-1 WIDTH
			
			
			
			
						
			
			
			jQuery(document).on('keyup','#set_grid_name',
				function()
					{
					current_field.attr('data-grid-name',jQuery(this).val())
					}
				);
							
							
			jQuery(document).on('click','.setting-responsive-grid button',
				function()
					{
					jQuery('.setting-responsive-grid button').removeClass('active');
					jQuery(this).addClass('active');
					
					
					var grid_parent_class_pre = '.id-'+current_field.attr('id');
					var set_grid_class = 'sm';
					
					if(jQuery(this).hasClass('set-xs'))
						set_grid_class = 'xs';
					if(jQuery(this).hasClass('set-sm'))
						set_grid_class = 'sm';
					if(jQuery(this).hasClass('set-md'))
						set_grid_class = 'md';
					if(jQuery(this).hasClass('set-lg'))
						set_grid_class = 'lg';
					
					current_field.find('.grid-width-slider'+grid_parent_class_pre).each(
					function(index)
						{
						jQuery(this).attr('data-col-class',set_grid_class);
						}
					);
					
					current_field.find('.grid_input_holder'+grid_parent_class_pre).each(
					function(index)
						{
						var grid_class = jQuery(this).attr('class');
						
						grid_class = grid_class.replace('col-xs','col-'+set_grid_class);
						grid_class = grid_class.replace('col-sm','col-'+set_grid_class);
						grid_class = grid_class.replace('col-md','col-'+set_grid_class);
						grid_class = grid_class.replace('col-lg','col-'+set_grid_class);
						
						jQuery(this).attr('class', grid_class)
						}
					);
					
					
					
					}
			);	

			//ENABLE/DISABLE FIELD REPLICATION
			jQuery(document).on('click','.recreate-grid button',
				function()
					{
					jQuery('.recreate-grid button').removeClass('active');
					jQuery(this).addClass('active');
					
					
					
					if(jQuery(this).hasClass('enable-recreation'))
						{
						current_field.addClass('grid-replication-enabled');
						current_field.find('.grid_row').prepend('<div class="grid_replicate"><div class="recreate-grid"><span class="fa fa-plus"></span></div></div>');
						}
					else
						{
						current_field.removeClass('grid-replication-enabled');
						current_field.find('.grid_replicate').remove();
						}
					}
			);
			
			
				jQuery( "#replication_limit" ).spinner(
					{ 
					min:0,  
					spin: function( event, ui ) 
							{
							current_field.find('.grid_row').attr('data-replication-limit',ui.value);
							}
					}
				).on('keyup', function(e)
						{
						current_field.find('.grid_row').attr('data-replication-limit',jQuery(this).val()+'px');
						});
			
			
		
			

						
			jQuery(document).on('click','.delete_icon',
				function()
					{
					var icon = current_field.find('.icon_holder_'+jQuery(this).attr('data-icon-id')).remove();
					setup_icon_options(current_field);
					}
				);
				
			jQuery(document).on('click','.duplicate_icon',
				function()
					{
					var icon = current_field.find('.icon_holder_'+jQuery(this).attr('data-icon-id'));	
					var icon_clone = icon.clone();
					icon.after(icon_clone);
					setup_icon_options(current_field);
					//jQuery('.settings-column-style').scrollTop(100000);
					}
				);
			
			jQuery(document).on('keyup','input[name="set_icon_value"]',
				function()
					{
					current_field.find('.icon_holder_'+jQuery(this).attr('data-edit-icon')+' input').val(jQuery(this).val());	
					
					}
				);
			jQuery(document).on('keyup','input[name="set_icon_tooltip"]',
				function()
					{
					current_field.find('.icon_holder_'+jQuery(this).attr('data-edit-icon')+' span').attr('title',jQuery(this).val());
					current_field.find('.icon_holder_'+jQuery(this).attr('data-edit-icon')+' .off-label').html(jQuery(this).val());
					current_field.find('.icon_holder_'+jQuery(this).attr('data-edit-icon')+' .on-label').html(jQuery(this).val());	
					
					}
				);
			jQuery(document).on('blur','input[name="icon-field-icon-off-color-overall"]',
				function()
					{
					setup_icon_options(current_field);
					}
				);
			
			jQuery(document).on('blur','input[name="icon-field-icon-on-color-overall"]',
				function()
					{
					setup_icon_options(current_field);
					}
				);
			jQuery(document).on('click','.icon-labels-position',
				function()
					{
					jQuery('.icon-labels-position').removeClass('active');
					
					jQuery(this).addClass('active');
					
					input_container.removeClass('icon-label-top').removeClass('icon-label-right').removeClass('icon-label-bottom').removeClass('icon-label-left').removeClass('icon-label-tip').removeClass('icon-label-hidden');
					
					input_container.addClass(jQuery(this).attr('data-set-class'));
					
					if(jQuery(this).attr('data-set-class')=='icon-label-bottom' || jQuery(this).attr('data-set-class')=='icon-label-right')
						{
						input_container.find('.icon-holder').each(
							function()
								{
								var icon_label = jQuery(this).find('.icon-label').detach();
								jQuery(this).find('.icon-select').after(icon_label);
								}
							);
						}
					else
						{
						input_container.find('.icon-holder').each(
							function()
								{
								var icon_label = jQuery(this).find('.icon-label').detach();
								jQuery(this).find('.icon-select').before(icon_label);
								}
							);	
						}
					}
				);
			
			
			
			
			jQuery(document).on('click','.on-icon-label-bold',
			function()
				{
				if(jQuery(this).hasClass('active'))
					{
					jQuery(this).removeClass('active');
					input_container.find('.icon-holder .on-label').removeClass('style_bold')
					}
				else
					{
					jQuery(this).addClass('active');	
					input_container.find('.icon-holder .on-label').addClass('style_bold')
					}
				}
			);
			
			jQuery(document).on('click','.off-icon-label-bold',
			function()
				{
				if(jQuery(this).hasClass('active'))
					{
					jQuery(this).removeClass('active');
					input_container.find('.icon-holder .off-label').removeClass('style_bold')
					}
				else
					{
					jQuery(this).addClass('active');	
					input_container.find('.icon-holder .off-label').addClass('style_bold')
					}
				}
			);
			
			
			
			jQuery(document).on('change','#icon_field_on_animation',
				function()
					{					
					if(jQuery(this).val()=='no_animation')
						input_container.removeAttr('data-animation');
					else
						input_container.attr('data-animation',jQuery(this).val());
					
					
					jQuery(this).attr('data-selected',jQuery(this).val());
					
					}
				);
			
			
			
			jQuery(document).on('click','.icon-select-type button',
			function()
				{
				jQuery('.icon-select-type button').removeClass('active');
				jQuery(this).addClass('active');
				
				input_container.removeClass('icon-dropdown').removeClass('icon-spinner');
				
				if(jQuery(this).hasClass('icon-dropdown-select'))
					{
					input_container.addClass('icon-dropdown')
					jQuery('.settings-input-styling').show();
					jQuery('.single-icon-settings.default_icon_select').show();
					jQuery('.settings-icon-drop-down-styling').show();
					}
				
				else if(jQuery(this).hasClass('icon-spin-select'))
					{
					input_container.addClass('icon-spinner');
					jQuery('.settings-input-styling').hide();
					jQuery('.single-icon-settings.default_icon_select').hide();
					jQuery('.settings-icon-drop-down-styling').hide();
					}
				else
					{
					jQuery('.settings-input-styling').hide();
					jQuery('.single-icon-settings.default_icon_select').hide();
					jQuery('.settings-icon-drop-down-styling').hide();
					}
				}
			);
			
			jQuery(document).on('click','.icon-selection-type button',
			function()
				{
				jQuery('.icon-selection-type button').removeClass('active');
				jQuery(this).addClass('active');
				
				
				var inputs = current_field.find('input');
				var input_name = inputs.attr('name');
				
				if(jQuery(this).hasClass('multi-icon-select'))
					{
					inputs.attr('type','checkbox');
					
					if(!strstr(input_name,'[]'))
						input_name = input_name+'[]';
					
					inputs.attr('name',input_name);
					current_field.addClass('multi-icon-select');
					
					jQuery('div.field-settings-column #set_input_name').val(input_name);
					jQuery('div.field-settings-column .icon-auto-step').hide();
					current_field.removeClass('auto-step');
					current_field.closest('.step').removeClass('auto-step');
					}
				else
					{
					current_field.removeClass('multi-icon-select');
					inputs.attr('type','radio');
					
					if(strstr(input_name,'[]'))
						input_name = input_name.replace('[]','');
					
					inputs.attr('name',input_name);
					jQuery('div.field-settings-column #set_input_name').val(input_name);
					
					jQuery('div.field-settings-column .icon-auto-step').show();
					
					if(jQuery('.icon-auto-step button.auto-step-yes').hasClass('active'))
						{
						current_field.addClass('auto-step');
						current_field.closest('.step').addClass('auto-step');
						}
					
					}
				
				
				}
			);
	
	jQuery(document).on('click','.icon-auto-step button',
			function()
				{
				jQuery('.icon-auto-step button').removeClass('active');
				jQuery(this).addClass('active');
				
				current_field.removeClass('auto-step');
				current_field.closest('.step').removeClass('auto-step');
				
				if(jQuery(this).hasClass('auto-step-yes'))
					{
					current_field.addClass('auto-step');
					current_field.closest('.step').addClass('auto-step');
					}
				}
			);
	
	
	
	//SET ICON FIELD LAYOUT
	jQuery(document).on('click','.set-icon-colums button',
				function()
					{
					jQuery('.set-icon-colums button').removeClass('active');
					jQuery(this).addClass('active');
					
					var set_label = current_field.find('.icon-holder');
					
					
					set_label.removeClass('col-sm-2').removeClass('col-sm-3').removeClass('col-sm-4').removeClass('col-sm-6').removeClass('col-sm-12').removeClass('.col-list').removeClass('display-block');				
					
					
					
					if(jQuery(this).hasClass('1c'))
						{
						set_label.addClass('col-list');
						input_container.attr('data-layout','1c');
						input_container.addClass('has_col_layout');
						}
					else if(jQuery(this).hasClass('2c'))
						{
						set_label.addClass('col-sm-6');
						input_container.attr('data-layout','2c');
						input_container.addClass('has_col_layout');
						}
					else if(jQuery(this).hasClass('3c'))
						{
						set_label.addClass('col-sm-4');
						input_container.attr('data-layout','3c');
						input_container.addClass('has_col_layout');
						}
					else if(jQuery(this).hasClass('4c'))
						{
						set_label.addClass('col-sm-3');
						input_container.attr('data-layout','4c');
						input_container.addClass('has_col_layout');
						}
					else if(jQuery(this).hasClass('6c'))
						{
						set_label.addClass('col-sm-2');
						input_container.attr('data-layout','6c');
						input_container.addClass('has_col_layout');
						}
					else
						{
						set_label.removeClass('display-block').removeClass('col-list');
						input_container.attr('data-layout','');
						input_container.removeClass('has_col_layout');
						}
					}
				);
		
		
		
		jQuery(document).on('change','#attach_to_field',
				function()
					{	
					current_field.attr('data-append-to',jQuery(this).val());
					}
				);
		jQuery(document).on('click','.set_field_attachment .action-btn',
				function()
					{	
					jQuery('.set_field_attachment .action-btn').removeClass('active');
					jQuery(this).addClass('active');
					if(jQuery(this).hasClass('pre-attach'))
						current_field.attr('data-appendix','pre');
					if(jQuery(this).hasClass('post-attach'))
						current_field.attr('data-appendix','post');
					}
				);
				
				
		jQuery('.form-canvas-area').attr('data-pre-class','.canvas-tools ');

		//jQuery('select[name="choose_form_theme"]').trigger('change');
		////jQuery('select[name="set_form_theme"]').val(jQuery('select[name="set_form_theme"]').attr('data-selected'));
	//	jQuery('select[name="set_form_theme"]').trigger('change');
		if(jQuery('select[name="set_form_theme"]').attr('data-selected')=='neumorphism')
			{
			jQuery('link.jquery_ui_theme').attr('href',"");
			jQuery('.ui-state-default').removeClass('ui-state-default');
			jQuery('.ui-state-active').removeClass('ui-state-active')
			jQuery('.ui-widget-content').removeClass('ui-widget-content');
			jQuery('.ui-widget-header, .panel-heading').removeClass('ui-widget-header')
			}
		if(jQuery('select[name="set_form_theme"]').attr('data-selected')=='m_design')
			{
				
			jQuery('link.jquery_ui_theme').attr('href',"");
			jQuery('.ui-state-default').removeClass('ui-state-default');
			jQuery('.ui-state-active').removeClass('ui-state-active')
			jQuery('.ui-widget-content').removeClass('ui-widget-content');
			jQuery('.ui-widget-header, .panel-heading').removeClass('ui-widget-header')
			
			
			jQuery('.ui-nex-forms-container .form_field').each( //
				function()
					{
					reset_field_theme('bootstrap',jQuery(this));
					reset_field_theme('m_design',jQuery(this));
					}
				);
			}
		
		jQuery('.html_fields .ui-state-default').removeClass('ui-state-default')
		jQuery('.html_fields .ui-state-active').removeClass('ui-state-active')
		
		//OVERALL FONT
		var get_overall_font = jQuery('#google_fonts_overall').attr('data-selected');
		if(get_overall_font)
			{
			get_overall_font = get_overall_font.replace(' ','.')
			
			jQuery('select[name="google_fonts_overall"] option').prop('selected',false);
			jQuery('select[name="google_fonts_overall"] option.'+get_overall_font).prop('selected',true);
			jQuery('select[name="google_fonts_overall"]').trigger('change');
			}
		//OVERALL LABEL
		var google_fonts_lable = jQuery('#google_fonts_lable').attr('data-selected');
		if(google_fonts_lable)
			{
			google_fonts_lable = google_fonts_lable.replace(' ','.')
			
			jQuery('select[name="google_fonts_lable"] option').prop('selected',false);
			jQuery('select[name="google_fonts_lable"] option.'+google_fonts_lable).prop('selected',true);
			jQuery('select[name="google_fonts_lable"]').trigger('change');
			}
		
		//OVERALL INPUT
		var google_fonts_input = jQuery('#google_fonts_input').attr('data-selected');
		if(google_fonts_input)
			{
			google_fonts_input = google_fonts_input.replace(' ','.')
			
			jQuery('select[name="google_fonts_input"] option').prop('selected',false);
			jQuery('select[name="google_fonts_input"] option.'+google_fonts_input).prop('selected',true);
			jQuery('select[name="google_fonts_input"]').trigger('change');
			}
		
		
		jQuery('#field_spacing').trigger('keyup');
		
		
		
		jQuery('#label_font_size').trigger('keyup');
		jQuery('.o-label-text-align.active').trigger('click');
		
		
		jQuery('.o-label-bold').trigger('click');
		jQuery('.o-label-italic').trigger('click');
		jQuery('.o-label-underline').trigger('click');
		

		jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field span.the_label, #md_label, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field .input-label, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field .radio-inline, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field .checkbox-inline').css('color',jQuery(".o-label-color").val())
		
		
		jQuery('#input_font_size').trigger('keyup');
		jQuery('.o-input-bold').trigger('click');
		jQuery('.o-input-italic').trigger('click');
		jQuery('.o-input-underline').trigger('click');
		jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field input.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field select.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field textarea.the_input_element').css('color',jQuery(".o-input-color").val())
		jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field input.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field select.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field textarea.the_input_element').css('background',jQuery(".o-input-bg-color").val())
		jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field input.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field select.the_input_element, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field textarea.the_input_element').css('border-color',jQuery(".o-input-border-color").val())
		jQuery('.o-input-text-align.active').trigger('click');
		
		
		jQuery('.set_layout.active').trigger('click');
		jQuery('.overall-input-corners .btn.active').trigger('click');
		
		
		jQuery('#icon_font_size').trigger('keyup');
		
		jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field span.prefix, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field span.postfix, .material-icons.fa').css('color',jQuery('.o-icon-text-color').val())
		jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field span.prefix, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field span.postfix').css('background',jQuery('.o-icon-bg-color').val())
		jQuery(''+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field span.prefix, '+jQuery('.form-canvas-area').attr('data-pre-class')+'.form_field span.postfix').css('border-color',jQuery('.o-icon-brd-color').val())
		
		jQuery('.overall-error-style .btn.active').trigger('click');
		jQuery('.overall-error-position .btn.active').trigger('click');
		
		setTimeout(function(){ jQuery('.form-canvas-area').attr('data-pre-class','');},1000);
	
	
	
	
	
	
	setTimeout(function(){ get_overall_form_settings(jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container')) }, 300);
	
	jQuery('.form_loader').hide();
	jQuery('.form_loader').remove();
	
	jQuery('.width_bar').addClass('animated');
	jQuery('.width_bar').addClass('zoomIn');
	jQuery('.width_bar').show();
	
	setTimeout(function(){	
	jQuery('.width_input').addClass('animated');
	jQuery('.width_input').addClass('flipInX');
	jQuery('.width_input').show();
	
	var total_steps = jQuery('.nex-forms-container .form_field.step').length;
	
	
			jQuery('.hide_on_load').removeClass('hide_on_load');		
		if(total_steps!=0)
			{
			var set_crumb_html = '';
			var has_des = 'has-no-descriptions';
			jQuery('.nex-forms-container .form_field.step').each(
				function(index)
					{
					//if(!jQuery(this).find('.step_number_container').attr('class'))
						//{
						var step_name = (jQuery(this).attr('data-step-name')) ? jQuery(this).attr('data-step-name') : '';
						var step_description = (jQuery(this).attr('data-step-description')) ? jQuery(this).attr('data-step-description') : '';
						var step_icon = (jQuery(this).attr('data-step-icon')) ? jQuery(this).attr('data-step-icon') : '';
						var des_class = 'no-description';
						var icon_class = 'no-icon';
						
						if(step_icon)
							icon_class = 'has-icon';
							
						if(step_description)
							{
							des_class = '';
							has_des = 'has-descriptions';
							}
						
						if(step_name=='' || step_name=='&nbsp;'  || step_name=='&nbsp; ' || step_name==' ' || step_name=='  ')
							set_crumb_html += '<li class="no-title '+des_class+' '+ icon_class +'"><div class="crumb_container"><div class="step_number_container"><span class="the_step_num">'+(index+1)+'</span><span class="the_step_icon '+step_icon+'" ></span></div><a href="#" rel="nofollow" data-show-step="'+ (index+1) +'"><div class="sreader">'+ (index+1) +'</div><div class="step_title">'+ step_name +'</div><div class="step_description">'+ step_description +'</div></span></a><div class="step_connecter" style="display:none"></div></div></li>';
						else
							set_crumb_html += '<li class="'+des_class+' '+ icon_class +'"><div class="crumb_container"><div class="step_number_container"><span class="the_step_num">'+(index+1)+'</span><span class="the_step_icon '+step_icon+'" ></span></div><a href="#" rel="nofollow" data-show-step="'+ (index+1) +'"><div class="sreader">'+ (index+1) +'</div><div class="step_title">'+ step_name +'</div><div class="step_description">'+ step_description +'</div></a><div class="step_connecter" style="display:none"></div></div></li>';
						//}
					}
				);
			jQuery('.nf_ms_breadcrumb ul').addClass(has_des);
			jQuery('.nf_ms_breadcrumb ul').html(set_crumb_html);
			jQuery('.nf_ms_breadcrumb li').removeClass('current')
			jQuery('.nf_ms_breadcrumb li').removeClass('visited')
			jQuery('.nf_ms_breadcrumb li').removeClass('current-prev')
			jQuery('.nf_ms_breadcrumb li').removeClass('current-next')
			jQuery('.nf_ms_breadcrumb li:first-child').addClass('current')
			jQuery('.nf_ms_breadcrumb li:eq(1)').addClass('current-next')
			jQuery('.bc-outer-container').show();
			
			
			jQuery('.bc-outer-container').addClass('animated');
			jQuery('.bc-outer-container').addClass('fadeIn');
			
			}
	if (typeof jQuery.fn.jqSignature === 'function')
		{
		jQuery('.outer-container .js-signature').each(
			function()
				{
				if(jQuery(this).attr('data-auto-fit')=='true')
					jQuery(this).jqSignature('clearCanvas');
				}
			);
		}
	jQuery('.outer-container').addClass('animated');
	jQuery('.outer-container').addClass('fadeIn');
	jQuery('.outer-container').show();
	},1000);
	
	
	setTimeout(function(){	
		jQuery('.width_bar').removeClass('zoomIn');
		jQuery('.outer-container').removeClass('fadeIn');
		jQuery('.width_input').removeClass('flipInX');
	},2000);
	
	}
);


