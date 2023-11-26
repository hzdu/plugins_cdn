'use strict';

jQuery(document).ready(
function()
	{
	jQuery('.change_image').remove();
	jQuery('.nex-forms-msg-container .form_field').each(
		function()
			{
			if(!jQuery(this).attr('id'))
				{
				var set_Id = '_' + Math.round(Math.random()*99999);
				jQuery(this).attr('id',set_Id);	
				jQuery(this).addClass('dropped');
				}
			}
		);	
	
	
	create_droppable(jQuery('.inner-canvas-container'));
	jQuery(document).on('click', '.draggable_object', 
		function()
			{
			nf_save_state('undo'); 
			
			nf_form_modified('drop');
			var animation_class = 'new_item';
			
			if(jQuery(this).parent().hasClass('step'))
			 animation_class = 'fadeInDown';
			if(jQuery(this).parent().hasClass('grid-system'))
			 animation_class = 'fadeInDown';
			
			 
			var clone_element = jQuery(this).closest('.form_field ').clone();
			if(jQuery('.form-canvas-area').hasClass('msg-editor-view'))
				{
				setup_form_element(clone_element);
				jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .nex-forms-msg-container.active').append(clone_element);	
				
				}
			else if(jQuery('.nex-forms-container .active_step').attr('class') && !clone_element.hasClass('step'))
				{
				if(jQuery('div.nex-forms-container .active_step').find('.nex_prev_steps').attr('class'))
					jQuery('div.nex-forms-container .active_step').find('.nex_prev_steps').before(clone_element);
				else
					jQuery('div.nex-forms-container .active_step .panel-body').first().append(clone_element);	
				}
			else
				{
				jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container.active').append(clone_element);
				}
				clone_element.addClass('animated').addClass(animation_class);	
				
				setTimeout(function(){ clone_element.removeClass('animated').removeClass(animation_class) },1000);
				setup_form_element(clone_element);
			
				if(jQuery('.form-canvas-area').hasClass('split_view'))
					{
					setTimeout(function() { nf_save_nex_form('','preview', '') },300);
					}
			if(jQuery('select[name="set_form_theme"]').val()!='bootstrap')
				reset_field_theme(jQuery('select[name="set_form_theme"]').val(),clone_element);
			
						
				if(clone_element.hasClass('step'))
				{
					
					clone_element.find('.form_field').each(
					function()
						{
						jQuery(this).attr('id','_' + Math.round(Math.random()*99999));	
						}
					);	
					var total_steps = nf_count_multi_steps();
					
					jQuery( "#timer_start" ).spinner( "option", "max", total_steps );
					jQuery( "#timer_end" ).spinner( "option", "max", total_steps );
					
					jQuery('.muli-step-selection ul li:eq('+ total_steps +')').find('a').trigger('click');
					jQuery('#ms-css-settings').show();
					jQuery('.show_all_steps').show();
					jQuery('.nf_step_breadcrumb').show();
					
					
					if(total_steps>0)
						jQuery('.bc-outer-container').show();
					
					nf_setup_grid(clone_element.find('.nex_prev_steps'))
					
				}		
				else
					{		
					
					var the_offset = clone_element.offset();
					setTimeout(function(){jQuery(".form_canvas").animate(
							{
							scrollTop:30000
							},100
						);
					},100);	
						
				
					}
			}
		);
	});

function reset_zindex(obj){
	//if(obj)
		//{
			setTimeout(function()
				{
				obj.css('width','');
				obj.css('right','');
				obj.css('height','');
				obj.css('bottom','');
				obj.css('left',''); 
				obj.css('z-index','');
				},20
			);
		//}
}
Number.prototype.format = function(n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};	


function create_droppable(obj){
	
	var the_droppable 	= obj;
	var the_draggable 	= jQuery('div.field-selection-tools .form_field');
	var bath_edit_array = new Array()
	//Drag
   the_draggable.draggable(
		{
		start: function( event, ui ) { },
		drag: function( event, ui ) {  jQuery('.inner-canvas-container.active').addClass('dragging'); the_droppable.addClass('placing-field'); ui.helper.addClass('moving'); nf_form_modified('drag'); },//ui.helper.addClass('moving');
		stop: function( event, ui ) {  jQuery('.inner-canvas-container.active').removeClass('dragging');  jQuery('.field_settings').removeClass('parent-over-field');
			jQuery('.field_settings').removeClass('over-field');the_droppable.removeClass('placing-field'); ui.helper.removeClass('moving'); 
			},
		stack  : '.draggable',
		revert : 'invalid', 
		tolerance: 'pointer',
		connectToSortable:obj,
		snap:true,
		helper : 'clone',
		delay: 350,
		scroll: true,
		scrollSpeed: 20,
		scrollSensitivity: 100
		}
	);
	the_droppable.droppable(
		{
		drop   		: function(event, ui)
						{
						if(!ui.draggable.hasClass('dropped'))
						setup_form_element(ui.draggable);
						reset_zindex(ui.draggable);
						jQuery(this).removeClass('over');
						nf_form_modified('drop');
						
						
										
						},
		over        : function(){jQuery(this).addClass('over')},
		out         : function(){jQuery(this).removeClass('over')},	  
		tolerance 	: 'fit',
		helper 		: 'clone'	,
		accept      : '.form_field'
	}).sortable(
		{
		start : function(event, ui)
			{ 
			
		if(ui.helper.hasClass('batch_edit'))
			{
			jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container.active .batch_edit').each(
					function(index)
						{
						jQuery(this).attr('data-bath-pos',index);
						}
					);	
			ui.helper.removeClass('batch_edit');
			ui.helper.addClass('moving_batch');
			
			try{
				jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container.active .batch_edit').each(
					function(index)
						{
						bath_edit_array[index] = 	jQuery(this).detach();
						}
					);	
				}
			catch(err) {
					console.log('Something went wrong - Attemting Undo');
					jQuery('.history_action.do_undo').trigger('click')
				}
			finally {;
			  }
			}
			
			
			jQuery('.inner-canvas-container.active').addClass('dragging');
			jQuery('.field_settings').removeClass('parent-over-field');
			jQuery('.over-field').removeClass('over-field')
			jQuery('.set-over-field').removeClass('set-over-field')
			ui.helper.removeClass('field');
			ui.helper.addClass('moving');			
			}, 
		cursorAt: { left:0, top:0 },
		stop : function(event, ui){ 
			
			
			if(jQuery('.form-canvas-area').hasClass('split_view'))
				{
				setTimeout(function() {nf_save_nex_form('','preview', '') },300);
				}
			jQuery('.inner-canvas-container.active').removeClass('dragging');
			jQuery('.field_settings').removeClass('parent-over-field');
			jQuery('.field_settings').removeClass('over-field')
			jQuery('.set-over-field').removeClass('set-over-field')

			if(ui.item.hasClass('step'))
				nf_count_multi_steps()
				
			the_droppable.removeClass('placing-field');
			
			jQuery('.moving').removeClass('moving'); nf_form_modified('sort'); 
			if(ui.item.hasClass('moving_batch') && bath_edit_array.length>0)
				{
				var get_batch_parent = ui.item;
				var get_batch_parent_pos = parseInt(get_batch_parent.attr('data-bath-pos'));
				
				for(var i=0;i<bath_edit_array.length;i++)
					{
					var get_item = bath_edit_array[i];
					if(i<get_batch_parent_pos)
						get_item.insertBefore(get_batch_parent)
					}
				
				
				
				for(var i=(bath_edit_array.length-1);i>=0;i--)
					{
					var get_item = bath_edit_array[i];
					if(i>=get_batch_parent_pos)
						get_item.insertAfter(get_batch_parent)	
					}
				
				
				
				
				get_batch_parent.addClass('batch_edit');
				get_batch_parent.removeClass('moving_batch');
				bath_edit_array = '';
				create_droppable(jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container.active'));
				}
			},           
			placeholder: 'place-holder',
			forcePlaceholderSize : true,
			connectWith:'.panel-body',
			delay: 150,
			scroll: true,
			scrollSpeed: 15,
			scrollSensitivity: 80
		}
	);
	
}


function setup_form_element(obj){
	jQuery('div.inner-canvas-container').find('div.draggable_object').remove();
	obj.find('div.form_object').show();
	jQuery('div.inner-canvas-container').find('div.form_field').removeClass('field');
	
	
	if(!obj.hasClass('step') && !obj.hasClass('field_spacer'))
		{
		if(!obj.find('.edit_mask').attr('class'))
			obj.prepend('<div class="edit_mask"></div>');
		}
	
	
	obj.removeClass('field');
	
	if(obj.find('.input-group-addon.prefix').length>0)
		obj.addClass('has_prefix_icon');
	else
		obj.removeClass('has_prefix_icon');
		
		
	if(obj.find('.input-group-addon.postfix').length>0)
		obj.addClass('has_postfix_icon');
	else
		obj.removeClass('has_postfix_icon');
		
	if(obj.hasClass('html_image'))
		{	
		
		
		
		
		var image = obj.find('.the-image-container');
		var width_display = obj.find('.show-width');
		var height_display = obj.find('.show-height');
		obj.find('.the-image-container').append('<div class="change_image2"><button class="btn md-btn btn-light-blue ">Change</button></div>');
		
		if(obj.find('img').css('width')=='0px')
			obj.find('img').css('width',obj.find('img').attr('width')+'px')
		if(obj.find('img').css('height')=='0px')
			obj.find('img').css('height',obj.find('img').attr('height')+'px')
		
		obj.find('.the-image-container img').resizable({
		 // minHeight: 20,
		 // minWidth: 20,
		 // width:200,
		  resize: function( event, ui ) {
			  image.addClass('resizing');
			  image.css('width',ui.size['width']+'px');
			  image.css('height',ui.size['height']+'px');
			  width_display.text(ui.size['width']+'px');
			  height_display.text(ui.size['height']+'px');
			  
			  if(obj.hasClass('currently_editing'))
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

	if(obj.hasClass('field_spacer'))
		{	
		 obj.find('.field_spacer').resizable({
		  handles: "s",
		  minHeight: 5,
		  resize: function( event, ui ) {
			  obj.find('.total_px').text(ui.size['height']);
			  }
		});
		}
	
	if(obj.hasClass('jq-datepicker'))
		{	
		 obj.find('#datetimepicker input').datepicker();
		}
	
	if(obj.hasClass('jq-radio-group') || obj.hasClass('jq-check-group'))
		{
		obj.find( "#the-radios input" ).checkboxradio();
		}
	
	
	if(obj.hasClass('digital-signature'))
		{
		if (typeof jQuery.fn.jqSignature === 'function'){
			obj.find('.js-signature').jqSignature();
			
			var eraser = obj.find('.clear_digital_siganture').detach();
			
			obj.find('.js-signature').append(eraser);
			
			}
		}

	
	if(obj.hasClass('md-select'))
		{
		obj.find('select').material_select();
		}

	if(obj.hasClass('text') || obj.hasClass('textarea'))
		{
		if(obj.find('.the_input_element').attr('data-value'))
				obj.find('.the_input_element').val(obj.find('.the_input_element').attr('data-value'));
		}
	if(obj.hasClass('paragraph') || obj.hasClass('heading'))
		{
		if(!obj.find('input.set_math_result').attr('name'))
			obj.find('.the_input_element').parent().append('<input type="hidden" class="set_math_result" value="0" name="math_result">');
		}
					
	if(obj.hasClass('grid'))
		{
		var panel = obj.find('.panel-body');
		create_droppable(panel);
		create_droppable(jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container'));
		}
	if(obj.hasClass('datetime'))
		{
		obj.find('#datetimepicker').datetimepicker( 
				{ 
				format: (obj.find('#datetimepicker').attr('data-format')) ? obj.find('#datetimepicker').attr('data-format') : 'MM/DD/YYYY hh:mm A',
				locale: (obj.find('#datetimepicker').attr('data-language')) ? obj.find('#datetimepicker').attr('data-language') : 'en'
				} 
			);	
		}
	
	if(obj.hasClass('md-datepicker'))
		{
		obj.addClass('date');
		obj.removeClass('md-datepicker');
		}
	if(obj.hasClass('md-time-picker'))
		{
		obj.addClass('time');
		obj.removeClass('md-time-picker');
		}
	
	if(obj.hasClass('date') || obj.hasClass('md-datepicker'))
		{
		var enabled_days = obj.find('#datetimepicker').attr('data-enabled-days');
		if(enabled_days)
			var enabled_days_array = enabled_days.split(',')
		
		var disabled_dates = obj.find('#datetimepicker').attr('data-disabled-dates');
		if(disabled_dates)
			var disabled_dates_array = disabled_dates.split(',')
		obj.find('#datetimepicker').datetimepicker( 
				{
				useCurrent:false,
				disabledDates: (disabled_dates_array) ? disabled_dates_array : [],
				keepOpen:(obj.find('#datetimepicker').attr('data-keep-open')=='true') ? true : false,
				widgetPositioning: {vertical: (obj.find('#datetimepicker').attr('data-position')) ? obj.find('#datetimepicker').attr('data-position') : 'bottom', horizontal:'auto'},
				inline:(obj.find('#datetimepicker').attr('data-inline')=='true') ? true : false,
				minDate: (obj.find('#datetimepicker').attr('data-disable-past-dates')=='1') ? new Date() : false,
				format: (obj.find('#datetimepicker').attr('data-format')) ? obj.find('#datetimepicker').attr('data-format') : 'MM/DD/YYYY',
				locale: (obj.find('#datetimepicker').attr('data-language')) ? obj.find('#datetimepicker').attr('data-language') : 'en',
				defaultDate: (obj.find('input').attr('data-value'))=='now' ? 'now' : '',
				viewMode: (obj.find('#datetimepicker').attr('data-viewMode')) ? obj.find('#datetimepicker').attr('data-viewMode') : 'days',
				daysOfWeekDisabled: (enabled_days_array) ? enabled_days_array : []
				} 
			);	
		}	
	if(obj.hasClass('time') || obj.hasClass('md-time-picker'))
		{
		var enabled_hours = obj.find('#datetimepicker').attr('data-enabled-hours');
		if(enabled_hours)
			var enabled_hours_array = enabled_hours.split(',')
		
		
		var date = '';
		if(obj.find('input').attr('data-value'))
			{
			var dateString = '00-00-00 '+(obj.find('input').attr('data-value')),
			dateTimeParts = dateString.split(' '),
			timeParts = dateTimeParts[1].split(':'),
			dateParts = dateTimeParts[0].split('-');
			date = new Date(dateParts[2], parseInt(dateParts[1], 10) - 1, dateParts[0], timeParts[0], timeParts[1]);
			}
		if(obj.find('input').attr('data-value')=='now')
			date = 'now';	
			
		obj.find('#datetimepicker').datetimepicker(
				{
				useCurrent:false,
				viewDate: false,
				widgetPositioning: {vertical: (obj.find('#datetimepicker').attr('data-position')) ? obj.find('#datetimepicker').attr('data-position') : 'bottom', horizontal:'auto'},
				inline:(obj.find('#datetimepicker').attr('data-inline')=='true') ? true : false,
				format:'HH:mm',
				//defaultDate: date,
				locale:(obj.find('#datetimepicker').attr('data-language')) ? obj.find('#datetimepicker').attr('data-language') : 'en',
				stepping: (obj.find('#datetimepicker').attr('data-stepping')) ? obj.find('#datetimepicker').attr('data-stepping') : 5,
				enabledHours: (enabled_hours_array) ? enabled_hours_array : [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,0]
				}
			);
		}
	
	if(obj.hasClass('jq-datepicker'))
		{
		if((obj.find('#datetimepicker').attr('data-disable-past-dates')=='1'))
			{	
			 obj.find('#datetimepicker input').datepicker(
					{
					minDate: (obj.find('#datetimepicker').attr('data-disable-past-dates')=='1') ? new Date() : false,
					}
				
				 );
			}
		else
			{
			obj.find('#datetimepicker input').datepicker({});
			}
		}
	

	if(obj.hasClass('touch_spinner'))
		{
		var the_spinner = obj.find("#spinner");
		the_spinner.TouchSpin({
			verticalbuttons: (the_spinner.attr('data-verticalbuttons')=='true') ? true : false,
			initval: parseInt(the_spinner.attr('data-starting-value')),
			min:  parseInt(the_spinner.attr('data-minimum')),
			max:  parseInt(the_spinner.attr('data-maximum')),
			step:  parseInt(the_spinner.attr('data-step')),
			decimals:  parseInt(the_spinner.attr('data-decimals')),
			boostat: 5,
			maxboostedstep: 10,
			postfix: (the_spinner.attr('data-postfix-icon')) ? '<span class="'+ the_spinner.attr('data-postfix-icon') +' '+ the_spinner.attr('data-postfix-class') +'">' + the_spinner.attr('data-postfix-text') + '</span>' : '',
			prefix: (the_spinner.attr('data-prefix-icon')) ? '<span class="'+ the_spinner.attr('data-prefix-icon') +' '+ the_spinner.attr('data-prefix-class') +'">' + the_spinner.attr('data-prefix-text') + '</span>' : '',
			buttondown_class:  'btn ' + the_spinner.attr('data-down-class'),
			buttonup_class: 'btn ' + the_spinner.attr('data-up-class')
		});
		
		
		}
	if(obj.hasClass('color_pallet'))
		{
		obj.find('#colorpalette').colorPalette().on('selectColor', function(e) {
		obj.find('#selected-color').val(e.color);
		obj.find('#selected-color').trigger('change');
		obj.find('.input-group-addon').css('background',e.color);
		});	
		}
	
	if(obj.hasClass('slider'))
		{
		var count_text = obj.find( "#slider" ).attr('data-starting-value');
		var the_slider = obj.find( "#slider" )
		var set_min = the_slider.attr('data-min-value');
		var set_max = the_slider.attr('data-max-value')
		var set_start = the_slider.attr('data-starting-value');
		var set_step = the_slider.attr('data-step-value')

		obj.find( "#slider" ).slider({
				range: "min",
				min: parseInt(set_min),
				max: parseInt(set_max),
				value: parseInt(set_start),
				step: parseInt(set_step),
				slide: function( event, ui ) {	
					count_text = '<span class="ui-slider-tip count-text">' + the_slider.attr('data-count-text').replace('{x}',parseInt(ui.value).format(0)) + '</span>';	
					the_slider.find( '.ui-slider-handle' ).html( '<span id="icon" class="'+ the_slider.attr('data-dragicon') +'"></span> '+ count_text).addClass(the_slider.attr('data-dragicon-class')).removeClass('ui-state-default');
					obj.find( 'input' ).val(ui.value);
					obj.find( 'input' ).trigger('change');
				},
				create: function( event, ui ) {	
					count_text = '<span class="ui-slider-tip count-text">'+ the_slider.attr('data-count-text').replace('{x}',((set_start) ? set_start : set_min)) +'</span>';	
					the_slider.find( '.ui-slider-handle' ).html( '<span id="icon" class="'+ the_slider.attr('data-dragicon') +'"></span> '+ count_text).addClass(the_slider.attr('data-dragicon-class')).removeClass('ui-state-default');
					
				}
				
			});
			//Slider text color
			the_slider.find('.ui-slider-handle').css('color',the_slider.attr('data-text-color'));
			//Handel border color
			the_slider.find('.ui-slider-handle').css('border-color',the_slider.attr('data-handel-border-color'));
			//Handel Background color
			the_slider.find('.ui-slider-handle').css('background-color',the_slider.attr('data-handel-background-color'));
			//Slider border color
			the_slider.find('.ui-widget-content').css('border-color',the_slider.attr('data-slider-border-color'));
			//Slider background color
			//Slider fill color
			the_slider.find('.ui-slider-range:first-child').css('background',(the_slider.attr('data-fill-color')) == '#f2f2f2' ? '#ddd' : the_slider.attr('data-fill-color'));

			the_slider.find('.ui-slider-range:last-child').css('background',the_slider.attr('data-background-color'));
		}	
	
	if(obj.hasClass('md-slider'))
		{
		var count_text = obj.find( "#slider" ).attr('data-starting-value');
		var the_slider = obj.find( "#slider" )
		var set_min = the_slider.attr('data-min-value');
		var set_max = the_slider.attr('data-max-value')
		var set_start = the_slider.attr('data-starting-value');
		var set_step = the_slider.attr('data-step-value')

		obj.find( "#slider" ).slider({
				range: "min",
				min: parseInt(set_min),
				max: parseInt(set_max),
				value: parseInt(set_start),
				step: parseInt(set_step),
				slide: function( event, ui ) {	

				obj.find('.count-text').html(the_slider.attr('data-count-text').replace('{x}',parseInt(ui.value).format(0)));
				
				obj.find( 'input' ).val(ui.value);
				obj.find( 'input' ).trigger('change');
				
				},
				create: function( event, ui ) {	
					count_text = '<span class="noUi-tooltip"><span class="count-text">'+ the_slider.attr('data-count-text').replace('{x}',((set_start) ? parseInt(set_start).format(0) : parseInt(set_min).format(0))) +'</span></span>';	
					the_slider.find( '.ui-slider-handle' ).html( count_text).addClass(the_slider.attr('data-dragicon-class')).removeClass('ui-state-default');
					
					the_slider.find( '.ui-slider-handle' ).addClass('noUi-handle noUi-handle-lower ').removeClass('btn').removeClass('btn-default');
					
				}
				
			});
			
		}			
	
			
	if(obj.hasClass('star-rating'))
		{
		obj.find('#star').raty({
		  number   : parseInt(obj.find('#star').attr('data-total-stars')),
		  scoreName: format_illegal_chars(obj.find('.the_label').text()),
		  half: (obj.find('#star').attr('data-enable-half')=='false') ? false : true,
		  starHalf      : (obj.find('#star').attr('data-starHalf')) ? obj.find('#star').attr('data-starHalf') : 'fa fa-star-half',
		  starOff       : (obj.find('#star').attr('data-starOff')) ? obj.find('#star').attr('data-starOff') : 'fa fa-star-o',
		  starOn        : (obj.find('#star').attr('data-starOn')) ? obj.find('#star').attr('data-starOn') : 'fa fa-star', 
		  styleHalf     : (obj.find('#star').attr('data-stylehalf')) ? obj.find('#star').attr('data-stylehalf') : '#ec971f',
		  styleOff      : (obj.find('#star').attr('data-styleoff')) ? obj.find('#star').attr('data-styleoff') : '#bbb',
		  styleOn       : (obj.find('#star').attr('data-styleon')) ? obj.find('#star').attr('data-styleon') : '#ec971f',
		  size        	: (obj.find('#star').attr('data-size')) ? obj.find('#star').attr('data-size') : '25'
		});
		obj.find('#star input').addClass('the_input_element').addClass('hidden');
		obj.find('#star input').prop('type','text');
		}
	if(obj.hasClass('select'))
		{	
		//obj.find('select.jq_select').selectmenu();
		}
	
	if(obj.hasClass('tags'))
		{	
		
		if(obj.find('.input-group').attr('class'))
			{
			var the_tag_input = obj.find('input#tags');
			var the_tag_input_clone = the_tag_input.detach();
			if(obj.find('.input-group-addon').hasClass('postfix'))
				the_tag_input.insertBefore(obj.find('.input-group-addon.postfix'));
			else
				the_tag_input.insertAfter(obj.find('.input-group-addon.prefix'));
			}
		else
			var the_tag_input = obj.find('input#tags');
		
		 the_tag_input.tagsinput( {maxTags: (the_tag_input.attr('data-max-tags')) ? the_tag_input.attr('data-max-tags') : '' });
		 
		obj.find('.bootstrap-tagsinput input').css('color',the_tag_input.attr('data-text-color'));
		obj.find('.bootstrap-tagsinput').css('border-color',the_tag_input.attr('data-border-color'));
		obj.find('.bootstrap-tagsinput').css('background-color',the_tag_input.attr('data-background-color'));
		obj.find('.bootstrap-tagsinput').addClass('error_message').addClass('the_input_element');
		obj.find(".bootstrap-tagsinput").attr('data-placement',the_tag_input.attr('data-placement'));
		obj.find(".bootstrap-tagsinput").attr('data-error-class',the_tag_input.attr('data-error-class'));
		obj.find(".bootstrap-tagsinput").attr('data-content',the_tag_input.attr('data-content'));
		obj.find('.bootstrap-tagsinput').addClass('form-control');
		obj.find('input').removeClass('the_input_element');
		
		}
		
		
	if(obj.hasClass('autocomplete'))
		{
		var items = obj.find('div.get_auto_complete_items').text();
		items = items.split('\n');
		obj.find("#autocomplete").autocomplete({
		source: items
		});	
		}	
	
	
	if(obj.hasClass('image-choices-field'))
		{
	//	obj.find('input[type="radio"]').nexchecks();
		}
	
	
	
	
	if(obj.hasClass('single-image-select-group'))
		{
		if(obj.find('input[type="radio"]').attr('class'))
			{
			obj.find('input[type="radio"]').nexchecks();
			obj.find('input[type="radio"]').closest('label').find('.input-label').addClass('img-thumbnail');
			}
		}
	
	
	
	if(obj.hasClass('multi-image-select-group'))
		{
		if(obj.find('input[type="checkbox"]').attr('class'))
			{
			obj.find('input[type="checkbox"]').nexchecks();
			obj.find('input[type="checkbox"]').closest('label').find('.input-label').addClass('img-thumbnail');
			}
		}
	if(obj.hasClass('radio-group') && !obj.hasClass('classic-radio-group'))
		{
		if(obj.find('input[type="radio"]').attr('class'))
			obj.find('input[type="radio"]').nexchecks()
		}
	if(obj.hasClass('check-group') && !obj.hasClass('classic-check-group'))
		{
		if(obj.find('input[type="checkbox"]').attr('class'))
			obj.find('input[type="checkbox"]').nexchecks()
		}
	
	if(obj.hasClass('upload_fields'))
		{
		obj.find('.btn-file').removeClass('btn');	
		}
	
	if(obj.hasClass('grid-system'))
		{
		obj.removeClass('ui-widget-content');
		}

	if(!obj.hasClass('dropped'))
		{
		var set_Id = '_' + Math.round(Math.random()*99999);
		obj.attr('id',set_Id);	
		obj.addClass('dropped');
		}
	/*if(obj.hasClass('step'))
		{
		obj.find('.grid-system').each(
			function()
				{
				nf_setup_grid(jQuery(this));
				}
			);
		}*/
	if(obj.hasClass('grid-system'))
		{
		nf_setup_grid(obj);
		}
		
	/*if(obj.hasClass('heading') || obj.hasClass('html') || obj.hasClass('math_logic') || obj.hasClass('paragraph') || obj.hasClass('divider'))
		{
		obj.find('.field_settings').html('<div class="btn btn-default waves-effect waves-light btn-xs move_field"><i class="fa fa-arrows"></i></div><div class="btn btn-default waves-effect waves-light btn-xs edit" title="Edit Field Attributes"><i class="fa fa-edit"></i></div><div class="btn btn-default waves-effect waves-light btn-xs duplicate_field" title="Duplicate Field"><i class="fa fa-files-o"></i></div><div class="btn btn-default waves-effect waves-light btn-xs delete" title="Delete field"><i class="fa fa-close"></i></div>');
		obj.removeClass('material_field');
		}*/
	obj.find('.field_settings').removeAttr('style');
	
	obj.find('.field_settings .btn').removeClass('waves-effect');
	obj.find('.field_settings .btn').removeClass('waves-light');
	obj.find('.field_settings .waves-ripple').remove();
	//obj.find('.field_settings .fa-close').addClass('far');
	//obj.find('.field_settings .fa-close').removeClass('fa');
	//obj.find('.field_settings .fa-close').removeClass('fa-close');
	
}