'use strict';
var parent_css_resets = [];
function resize_field_appendix(time){	
	setTimeout(function()
		{
		jQuery('.appendix_field').each(
			function()
				{
				var label_width = 0;
				var icon_width = 0;
				var set_appendix_width = 0;
				var set_width = 0;
				var the_field = jQuery(this);
				var input_container = the_field.find('.input_container');
				jQuery(this).find('.icon-holder').each(
					function()
						{
							
							set_width = 0;
							
							if(!input_container.hasClass('icon-label-tip') && !input_container.hasClass('icon-label-hidden'))
								{
								label_width = jQuery(this).find('.icon-label').width();
								
								label_width = parseInt(label_width)+10;
								
								}
							else
								label_width = 0;
								
							
							if(jQuery(this).find('.no-icon').is('span'))	
								jQuery(this).addClass('has_no_icon');
								
							icon_width = jQuery(this).find('.icon-select').width();
							
							jQuery(this).find('.icon-select span').css('width',(parseInt(jQuery(this).find('.icon-select span').css('font-size')) )+'px');
							
							
							set_width = (parseInt(label_width))+parseInt(icon_width);
							
							
							
							if(input_container.hasClass('icon-spinner') || input_container.hasClass('icon-dropdown'))
								{
								if(set_width>set_appendix_width)
									set_appendix_width = set_width;
								}
							else
								{
								if(the_field.hasClass('material_field'))
									set_appendix_width += 	set_width+20;
								else
									set_appendix_width += 	set_width;
								}
							
						}
					);
				if(!input_container.hasClass('icon-dropdown') && !input_container.hasClass('icon-spinner'))
					{

					jQuery(this).find('.icon-container').css('width',(set_appendix_width)+'px');
					}

					if(input_container.hasClass('icon-spinner') && !the_field.hasClass('material_field'))
						{
						icon_width = jQuery(this).find('.icon-checked .icon-select').width();
						label_width =  parseInt(jQuery(this).find('.icon-checked .icon-label').width());
						set_appendix_width = icon_width+label_width+55;
						input_container.css('width',set_appendix_width+'px');
						}
					
					if(input_container.hasClass('icon-dropdown') && !the_field.hasClass('material_field'))
						{
						icon_width = jQuery(this).find('.is_default_selection .icon-select').width();
						label_width =  parseInt(jQuery(this).find('.is_default_selection .icon-label').width());
						set_appendix_width = icon_width+label_width+55;
						input_container.css('width',set_appendix_width+'px');
						}
				}
			
			);
		},time
	);
}



function showDays(firstDate,secondDate){
                
                  

                  var startDay = new Date(firstDate);
                  var endDay = new Date(secondDate);
                  var millisecondsPerDay = 1000 * 60 * 60 * 24;

                  var millisBetween = startDay.getTime() - endDay.getTime();
                  var days = millisBetween / millisecondsPerDay;

              }


function run_parent_css_reset(popup_id)
	{
	parent_css_resets = []; 

			var the_popup = jQuery('.nex_forms_modal');
			
			var parentEls = the_popup.parents()
			  .map(function() {

				if(jQuery(this).css('position'))
					{
					parent_css_resets.push(
								{
								element: jQuery(this),
								position: jQuery(this).css('position')
								}
							);
					}
					jQuery(this).css('position','unset');
			  })
			  .get()
	}

( function( window ) {

'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
  hasClass = function( elem, c ) {
    return elem.classList.contains( c );
  };
  addClass = function( elem, c ) {
    elem.classList.add( c );
  };
  removeClass = function( elem, c ) {
    elem.classList.remove( c );
  };
}
else {
  hasClass = function( elem, c ) {
    return classReg( c ).test( elem.className );
  };
  addClass = function( elem, c ) {
    if ( !hasClass( elem, c ) ) {
      elem.className = elem.className + ' ' + c;
    }
  };
  removeClass = function( elem, c ) {
    elem.className = elem.className.replace( classReg( c ), ' ' );
  };
}

function toggleClass( elem, c ) {
  var fn = hasClass( elem, c ) ? removeClass : addClass;
  fn( elem, c );
}

var classie = {
  // full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( classie );
} else {
  // browser global
  window.classie = classie;
}

})( window );
/*function build_md_select(obj){
	
	obj.closest('.form_field').find('div.cd-dropdown').remove();
	
	if(obj.attr('data-effect')=='stack')
			{
			obj.dropdown( {
					gutter :15,
					effect : 'stack',
					select_obj : obj
				} );
			}
		else if(obj.attr('data-effect')=='angled')
			{
			obj.dropdown( {
					gutter : 10,
					delay : 100,
					random : true,
					effect : 'angled',
					select_obj : obj
				} );
			}
		else if(obj.attr('data-effect')=='fanned')
			{
			obj.dropdown( {
					gutter : 0,
					delay : 40,
					effect : 'fanned',
					rotated : 'left',
					select_obj : obj
				} );
			}
		else if(obj.attr('data-effect')=='slide-in')
			{
			obj.dropdown( {
					gutter : 15,
					stack : true,
					slidingIn : 100,
					effect : 'slide-in',
					select_obj : obj
				} );
			}
		else
			obj.dropdown({ select_obj : obj });	
	
}*/
/**
 * Number.prototype.format(d, w, s, c)
 * 
 * @param integer d: length of decimal
 * @param integer w: length of whole part
 * @param mixed   s: sections delimiter
 * @param mixed   c: decimal delimiter
 */
Number.prototype.format = function(d, w, s, c) {
    var re = '\\d(?=(\\d{' + (w || 3) + '})+' + (d > 0 ? '\\b' : '$') + ')',
        num = this.toFixed(Math.max(0, ~~d));
    
    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};

function run_count(selector, to, field_type, set_spin)
{
	
  var from = jQuery(selector).text()=='' ? 0 : parseFloat(jQuery(selector).find('.math_result').text().replace(',',''));
  
  
  var get_decimals =  parseInt(jQuery(selector).attr('data-decimal-places'));
  var decimal_separator =  (jQuery(selector).attr('data-decimal-separator')) ? jQuery(selector).attr('data-decimal-separator') : '.';
  var thousand_separator = (jQuery(selector).attr('data-thousand-separator')) ? jQuery(selector).attr('data-thousand-separator') : ',';
  
  if(!set_spin || jQuery(selector).attr('data-animate-count')=='no')
  	{
  	jQuery(selector).find('.math_result').text(parseFloat(to).format(get_decimals, '',thousand_separator,decimal_separator));
	}
  else
  	{
	  jQuery({someValue: parseFloat(from)}).animate({someValue: parseFloat(to)}, {
		duration: 300,
		easing:'linear',
		step: function() {
			jQuery(selector).find('.math_result').text(parseFloat(this.someValue).format(get_decimals, '',thousand_separator,decimal_separator));
		}
	  });
	}
	  setTimeout(function(){
		jQuery(selector).find('.math_result').text(parseFloat(to).format(get_decimals, '',thousand_separator,decimal_separator));
	  }, 400);
  jQuery(selector).find('.set_math_result').trigger('change');
}

function set_up_math_logic(target){
	

	var get_math = target.attr('data-original-math-equation');
	
	var pattern = /\{(.*?)\}/g;
	var match;
	while ((match = pattern.exec(get_math)) != null)
		{
		var element = document.getElementsByName(match[1]);
		
		jQuery(element).on('do_nf_math_event',
				function()
					{
					setTimeout(function(){run_math_logic(target, true)},30);
					}
				);	
		
		if(jQuery(element).closest('.form_field').hasClass('text'))
			{
			jQuery(element).on('keyup',
				function()
					{
					setTimeout(function(){run_math_logic(target,true)},30);
					}
				);	
			}
		else
			{
			jQuery(element).on('change',
				function()
					{
					setTimeout(function(){run_math_logic(target,true)},30);
					}
				);
			
			}
		}
		
}

function run_math_logic(target, set_spin){

	if(!strstr(target.attr('data-math-equation'),'['))
		target.attr('data-math-equation',target.attr('data-original-math-equation'));
	
	var get_math = target.attr('data-math-equation');
	get_math = get_math.trim(get_math);
	
	var the_form = target.closest('form');

	var set_result = '';
	var match_array = []
	var pattern = /\{(.*?)\}/g;
	var set_val = '';
	var clean_math ='';
	var i = 0;
	var check_val = 0;
	var select_val = 0;
	var match;
	
	
	var get_decimals =  parseInt(jQuery(target).attr('data-decimal-places'));
  	var decimal_separator =  (jQuery(target).attr('data-decimal-separator')) ? jQuery(target).attr('data-decimal-separator') : '.';
  	var thousand_separator = (jQuery(target).attr('data-thousand-separator')) ? jQuery(target).attr('data-thousand-separator') : ',';
	
	
	while ((match = pattern.exec(get_math)) != null)
		{
		match_array[i] = match[1];
		i++;
		}
		
	var arrayLength = match_array.length;
	
	for (var j = 0; j < arrayLength; j++)
		{
		
		 var set_match = match_array[j];
		 var element = document.getElementsByName(match_array[j]);

		 select_val = 0;
		 check_val = 0;
		
		 if(jQuery(element).is('select'))
			{
			the_form.find('select[name="'+match_array[j]+'"] option:selected').each(
				function()
					{
					if(jQuery(this).prop('selected')==true)
						{
						if(jQuery(element).closest('.form_field').hasClass('multi-select'))
							select_val += parseFloat(jQuery(this).val());
						else
							select_val = parseFloat(jQuery(this).val());	
						}
					else
						select_val = 0;
					}
				);
			set_val = select_val;	
			
			}
		 else if(jQuery(element).attr('type')=='checkbox')
		 	{
			the_form.find('input[name="'+match_array[j]+'"]').each(
				function()
					{
					
					if(jQuery(this).prop('checked')==true)
						check_val += parseFloat(jQuery(this).val());
					}
				);
			set_val = check_val;
			}
		 else if(jQuery(element).attr('type')=='radio')
		 	{
			
			
			
			if(the_form.find('input[name="'+match_array[j]+'"]:checked').val())
				set_val = the_form.find('input[name="'+match_array[j]+'"]:checked').val();	
			else
				set_val = 0;
			}
		else if(jQuery(element).attr('type')=='text')
		 	{
			
			if(jQuery(element).closest('.form_field').hasClass('md-datepicker') || jQuery(element).closest('.form_field').hasClass('date') || jQuery(element).closest('.form_field').hasClass('jq-datepicker'))
				{
				
				var get_date = (the_form.find('input[name="'+match_array[j]+'"]').val()) ? moment(the_form.find('input[name="'+match_array[j]+'"]').val(),the_form.find('input[name="'+match_array[j]+'"]').parent().attr('data-format')) : 0;
				var set_date = (get_date)/(1000 * 60 * 60 * 24)
				set_val = (set_date<0) ? 0 : set_date;
				
				}
			else if(jQuery(element).closest('.form_field').hasClass('time'))
				{
				
				var get_date = (the_form.find('input[name="'+match_array[j]+'"]').val()) ? moment(the_form.find('input[name="'+match_array[j]+'"]').val(),the_form.find('input[name="'+match_array[j]+'"]').parent().attr('data-format')) : 0;

				var set_date = (get_date)/(1000 * 60)
				
				set_val = set_date;
				
				}
			else	
				{
				
				if(strstr(the_form.find('input[name="'+match_array[j]+'"]').attr('data-input-mask'),','))
					set_val = (the_form.find('input[name="'+match_array[j]+'"]').val()) ? the_form.find('input[name="'+match_array[j]+'"]').val().replace(/[^\d]*/g,'') : 0;
				else
					set_val = (the_form.find('input[name="'+match_array[j]+'"]').val()) ? the_form.find('input[name="'+match_array[j]+'"]').val().replace(',','.') : 0;
				}
			}
		else if(jQuery(element).is('textarea'))
			{
			set_val = (the_form.find('textarea[name="'+match_array[j]+'"]').val()) ? the_form.find('textarea[name="'+match_array[j]+'"]').val() : 0;
			}
		else
			{
			
			if(jQuery(element).parent().find('.the_input_element').attr('data-decimal-separator')==',')
				set_val = (jQuery(element).val()) ? jQuery(element).val().replace(',','.') : 0;
			else
				set_val = (jQuery(element).val()) ? jQuery(element).val().replace(',','') : 0;
			}
		
		
		
		var set_math_equation = target.attr('data-math-equation');	
		
		set_math_equation = set_math_equation.trim(set_math_equation);
		 clean_math = set_math_equation.replace(set_match,set_val).replace('{','').replace('}','');
		 target.attr('data-math-equation',clean_math)
		}
	if(jQuery(element).closest('.form_field').hasClass('time'))
		run_count(target,math.evaluate(clean_math),'time',set_spin);
	else
		run_count(target,math.evaluate(clean_math),'',set_spin);
	
	var get_decimals =  (target.attr('data-decimal-places')) ? parseInt(target.attr('data-decimal-places')) : 0;
  	var decimal_separator =  (target.attr('data-decimal-separator')) ? target.attr('data-decimal-separator') : '.';
  	var thousand_separator = (target.attr('data-thousand-separator')) ? target.attr('data-thousand-separator') : ',';
	
	
	
	
	var set_initial_val = math.evaluate(clean_math);
	var to = math.evaluate(clean_math);
	//target.parent().find('input.set_math_result').val(parseFloat(set_initial_val).format(get_decimals, '',thousand_separator,decimal_separator));
	
	//console.log(get_decimals);
	if(get_decimals!=0)
		target.parent().find('input.set_math_result').val(parseFloat(to).toFixed(parseInt(get_decimals)));
		//target.parent().find('input.set_math_result').val((Math.ceil(math.evaluate(clean_math) * 100)/100).toFixed(parseInt(get_decimals)));
	else
		target.parent().find('input.set_math_result').val((Math.ceil(math.evaluate(clean_math) * 100)/100));
	
	//if(get_decimals!=0)
		//{
		//jQuery(selector).find('.math_result').text(parseFloat(to).format(get_decimals, '',thousand_separator,decimal_separator));
		//}
	//else
		//target.parent().find('input.set_math_result').val(math.evaluate(clean_math));
	
	if(target.closest(".form_field").hasClass("math_logic_slider"))
		{
		var set_total =  (parseFloat(set_initial_val) / parseFloat(target.attr('data-max-value')))*100;
		if(set_total>100)
			set_total=100;
		target.closest(".form_field").find(".math-slider-progress-bar-total").css("left",set_total+"%");
		target.closest(".form_field").find(".math-slider-progress-bar").css("width",set_total+"%");
		}
	
	
	if(jQuery(element).closest('.form_field').hasClass('time') || jQuery(element).closest('.form_field').hasClass('date') || jQuery(element).closest('.form_field').hasClass('survey_fields'))	
		target.parent().find('input.set_math_result').trigger('change');
		
	target.parent().find('input.set_math_result').trigger('do_nf_math_event');	
}

var the_field ='';
function clearFileInput(obj){
       var new_file_input = obj.clone();
	   
	   obj.append(new_file_input)
	   obj.remove();
	   
    }
function is_inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}


function run_nf_reanimate(the_field){
		the_field.removeClass(the_field.attr('data-animation-name'));
		the_field.removeClass('wow');
		the_field.removeClass('animated');
		the_field.css('animation-name','');
		the_field.css('visibility','visible');
	
		setTimeout(function()
			{
			the_field.addClass('animated');
			the_field.addClass('test');
			the_field.addClass(the_field.attr('data-animation-name'));	
			
			},100);
}

function run_nf_cl_animations(field,action, the_form){

	if(field.attr('data-animation-name') )
		{	
		var animation = field.attr('data-animation-name');	
		var animation_delay = 0;
		if(field.attr('data-wow-delay'))
			{
			animation_delay = field.attr('data-wow-delay');
			animation_delay = animation_delay.replace('s','');
			}
		var animation2 = animation.replace('In','Out');
		animation2 = animation2.replace('Down','Up');

	field.removeClass(field.attr('data-animation-name'));
	field.removeClass('wow');
	field.removeClass('animated');
	field.removeClass(animation2);
	field.css('animation-name','');
	
	field.addClass('animated');
	
	if(action=='show')
		{
		nf_replace_tags(the_form,field);
		if(!field.hasClass('animation_exe'))
			{
			setTimeout(function()
					{
					setTimeout(function()
						{
						field.show();
						field.addClass(field.attr('data-animation-name'));
						field.css('visibility','visible');
						field.addClass('animation_exe');
						},animation_delay);
					},100
				);
			}
		}
	else
		{
		field.addClass(animation2);
		setTimeout(function()
				{
				field.hide();
				field.removeClass('animation_exe')
				},100
			)
		}
		
	}
else
	{
	if(action=='show')
		{
		field.show();
		nf_replace_tags(the_form,field);
		}
	else
		field.hide();
	}

	
		
}
var get_pressed_key = '';
/* ##################################################################################################################################################### */
/* ################################################################################## ONLOAD ########################################################### */
/* ##################################################################################################################################################### */
jQuery(document).ready(
function()
	{
	
	
	jQuery('.v7_container').each( function()
		{
		if(!jQuery(this).find('.step').attr('class'))
			{
			jQuery(this).parent().find('.nex-forms-header-footer').remove();
			}
		}
	);		
	
	
	jQuery('input').each( function()
		{
		var val = jQuery(this).val();
		val = val.replace( /<script[^>]*>/gi, '');
		val = val.replace( /<\/script>/gi, '');
		jQuery(this).val(val)
		}
	);		
	jQuery('textarea').each( function()
		{
		var val = jQuery(this).val();
		val = val.replace( /<script[^>]*>/gi, '');
		val = val.replace( /<\/script>/gi, '');
		jQuery(this).val(val)
		}
	);
	
	jQuery.fn.isInViewport = function() {
		var elementTop = jQuery(this).offset().top;
		var elementBottom = elementTop + jQuery(this).outerHeight();
	
		var viewportTop = jQuery(window).scrollTop();
		var viewportBottom = viewportTop + jQuery(window).height();
	
		return elementBottom > viewportTop && elementTop < viewportBottom;
	};
	
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
	jQuery('#nex-forms button.add_shine').append('<div class="shine"></div>');
	jQuery(document).on('mouseover','#nex-forms button.add_shine',
			function()
				{
				var btn = jQuery(this);
				btn.addClass('do_shine');
				btn.find('.shine').addClass('animated');
				btn.find('.shine').addClass('fadeOut');
				
				btn.find('.shine').css('transform','skewX(-20deg) translateX('+ (btn.width()+200) +'px)');
				
				setTimeout(function(){ 
					btn.find('.shine').removeClass('fadeOut');
					btn.find('.shine').removeClass('animated');
					btn.find('.shine').attr('style','');
					btn.removeClass('do_shine');
				}, 400);
				}
			);
	
	
	
	jQuery('#nex-forms input[type="text"]').each(
			function()
				{
				if(jQuery(this).attr('data-input-mask'))
					jQuery(this).mask(jQuery(this).attr('data-input-mask'));
				if(jQuery(this).closest('.form_field').hasClass('date') || jQuery(this).closest('.form_field').hasClass('time'))
					{
					jQuery(this).val('');
					jQuery(this).attr('autocomplete','0');
					}
				else
					{
					if(jQuery(this).attr('data-value'))
						{
						if(jQuery(this).closest('.form_field').hasClass('date') || jQuery(this).closest('.form_field').hasClass('time'))
							jQuery(this).val('');
						else
							jQuery(this).val(jQuery(this).attr('data-value'));
						}
					}
				}
			);
		jQuery('#nex-forms textarea').each(
			function()
				{
				if(jQuery(this).attr('data-value'))
					jQuery(this).val(jQuery(this).attr('data-value'));
				}
			)	
	
	jQuery(document).on('mouseenter','.bootstrap-datetimepicker-widget',function() {
	  jQuery(this).addClass('over-picker');
	});
	jQuery(document).on('mouseleave','.bootstrap-datetimepicker-widget',function() {
	  jQuery(this).removeClass('over-picker');
	});
	
	
	jQuery(document).on('focus','.form_field .form-control',
		function()
			{
			if(!jQuery(this).closest('.form_field').hasClass('is_focused'))
				jQuery(this).closest('.form_field').addClass('is_focused');
			if(!jQuery(this).closest('.form_field').hasClass('is_typing'))
				jQuery(this).closest('.form_field').addClass('is_typing');
			}
		);
	jQuery(document).on('blur','.form_field .form-control',
		function()
			{
			if(jQuery(this).val()=='' && (jQuery(this).attr('placeholder')=='' || !jQuery(this).attr('placeholder')))
				jQuery(this).closest('.form_field').removeClass('is_focused');
			
			jQuery(this).closest('.form_field').removeClass('is_typing');
			}
		);	
		
		
	jQuery('.v7_container').each(
		function()
			{
			if(jQuery(this).hasClass('form_type_conversational'))
				{
				var form = 	jQuery(this);
				form.find('.form_field').each(
					function(index)
						{
						if(jQuery(this).hasClass('html_fields'))
							{
							jQuery(this).append('<input type="text" class="the_input_element cf_dummy_field" name="cf_dummy_field" value="" />');
							}
						jQuery(this).addClass('field_num_'+index);
						jQuery(this).attr('data-field-num',index);
						}
					);
				}
			}
		);
	
	
	
	
	jQuery(document).on('keydown', '#nex-forms .form_type_conversational form input, #nex-forms .form_type_conversational form textarea, #nex-forms .form_type_conversational form select', function(e) {
	 
	  if(e.which == 13) {
		e.preventDefault();
		var form = 	jQuery(this).closest('.v7_container');
		var field_num = parseInt(jQuery(this).closest('.form_field').attr('data-field-num'));
		var next_field = '';
		for(var i=field_num; i<100;i++)
			{
			if(form.find('.form_field.field_num_'+(i+1)).is(':visible'))
				{
				next_field = form.find('.form_field.field_num_'+(i+1));
				break;
				}
			}
		
		var get_next_field_pos = next_field.position();
		
		next_field.find('input, select, textarea, button').first().focus();
		next_field.find('input, select, textarea, button').first().trigger('focus');
		
		var checked = false;
		next_field.find('.the-radios input[type="radio"]').each(
			function()
				{
				if(jQuery(this).prop('checked'))
					checked=true;
				}
			);
		if(!checked)
			{
			next_field.find('.the-radios input[type="radio"]').first().prop('checked',true);
			next_field.find('.the-radios input[type="radio"]').first().trigger('change');
			}
		
		var icon_checked = false;
		next_field.find('.icon-holder:not(.default-selected-icon)').each(
			function()
				{
				if(jQuery(this).find('input[type="radio"]').prop('checked'))
					icon_checked=true;
				}
			);
		if(!icon_checked)
			{
			next_field.find('.icon-container .icon-holder').first().find('input[type="radio"]').trigger('click');
			}
			
		
			form.find('.form_field.active').removeClass('active');
			next_field.addClass('active');

			jQuery("html, body").animate(
					{
					scrollTop:get_next_field_pos.top+300
					},500
				);
		return false;
	  
	  }
	});
	
	
	jQuery(document).on('focus', '#nex-forms .form_type_conversational form input, #nex-forms .form_type_conversational form textarea, #nex-forms .form_type_conversational form select, #nex-forms .form_type_conversational form button',
		function(e)
			{
			if(jQuery(this).hasClass('check'))
				jQuery(this).closest('label').addClass('check_on_focus');
			
			if(jQuery(this).parent().hasClass('icon-holder'))
				jQuery(this).parent().addClass('check_on_focus');

				e.preventDefault();
				var form = 	jQuery(this).closest('.v7_container');
				var field = jQuery(this).closest('.form_field')
				
				form.find('.form_field.active').removeClass('active');
				var checked = false;
				field.find('#the-radios input[type="radio"]').each(
					function()
						{
						if(jQuery(this).prop('checked'))
							checked=true;
						}
					);
				if(!checked)
					{
					field.find('#the-radios input[type="radio"]').first().prop('checked',true);
					field.find('#the-radios input[type="radio"]').first().trigger('change');
					}
				
				var icon_checked = false;
				field.find('.icon-holder:not(.default-selected-icon)').each(
					function()
						{
						if(jQuery(this).find('input[type="radio"]').prop('checked'))
							icon_checked=true;
						}
					);
				if(!icon_checked)
					{
					field.find('.icon-container .icon-holder').first().find('input[type="radio"]').trigger('click');
					}
				
				
				field.addClass('active');
				
				var get_next_field_pos = field.position();
				
				jQuery("html, body").animate(
						{
						scrollTop:get_next_field_pos.top+300
						},500
					);
				}
		);	
	jQuery(document).on('blur', '#nex-forms .form_type_conversational form input[type="checkbox"]',
		function(e)
			{
			jQuery(this).closest('label').removeClass('check_on_focus');
			jQuery(this).parent().removeClass('check_on_focus');
			}
		);
	
	
	
	
	
	jQuery('.v7_container').each(
		function()
			{
			if(jQuery(this).hasClass('form_type_chat'))
				{
				var form = 	jQuery(this);
				form.find('.form_field').each(
					function(index)
						{
						if(index==0)
							jQuery(this).addClass('html_fields');
						jQuery(this).addClass('out_of_focus');
						
						jQuery(this).addClass('field_num_'+index);
						
						jQuery(this).attr('data-field-num',index);
						}
					);

				nf_run_chat(jQuery(this));	
				}
			
			}
		);
function nf_run_chat(form){	
	form.find('.out_of_focus').each(
			function(index)
				{
				var field = jQuery(this);
				var form = 	jQuery(this).closest('.v7_container');
				nf_replace_tags(form,field);
				
				if(!strstr(field.attr('style'),'display: none'))
					{
					if(field.hasClass('html_fields'))	
						{
						setTimeout(function(){
							field.removeClass('out_of_focus'); 
							field.find('#field_container').addClass('animated'); 
							field.find('#field_container').addClass('pulse_chat')
							},(1000*index)+(field.find('.the_input_element').text().length*10));
						return true;
						}
					else
						{
						field.addClass('chat_question');
						setTimeout(function(){
							field.removeClass('out_of_focus'); 
							field.addClass('animated'); 
							field.addClass('fadeIn')
							},(1000*index));
						return false;
						}
						
					}
					
				}
		);
}
	
	jQuery(document).on('change', '#nex-forms .form_type_chat form input[type="radio"], #nex-forms .form_type_chat form input[type="checkbox"], .form_type_chat form select', function(e) {
	 	var field = jQuery(this);
		var form = 	field.closest('.v7_container');
		
		field.closest('.form_field').removeClass('chat_question');
		field.closest('.form_field').addClass('chat_answered'); 
		setTimeout(function(){
		field.closest('.form_field').prepend('<div class="user_answer">'+ field.closest('.form_field').find('.the_value').val() +'</div>'); 
		},200);
		setTimeout(function(){nf_run_chat(form)},400);
		
	  }
	);
	setTimeout(function(){
	jQuery('label.radio_selected').each(function()
		{
		var val = jQuery(this).find('input').val();
		jQuery(this).closest('.form_field').find('.the_value').val(val);
		
		jQuery(this).find('input').val(val);
		
		}
	);
	},400);
	jQuery(document).on('keydown', '#nex-forms .form_type_chat form input, #nex-forms .form_type_chat form textarea, #nex-forms .form_type_chat form select', function(e) {
	 
	  if(e.which == 13) 
	  	{
		
		jQuery(this).closest('.form_field').removeClass('chat_question'); 
		jQuery(this).closest('.form_field').addClass('chat_answered');
		jQuery(this).closest('.form_field').prepend('<div class="user_answer">'+ jQuery(this).val() +'</div>'); 
		
		e.preventDefault();
		var form = 	jQuery(this).closest('.v7_container');
		
		setTimeout(function(){nf_run_chat(form)},500);
	
	  	}
		
	  }
	);
	
	
	jQuery(this).closest('form').find('input').removeAttr('disabled');
	
	
	
	jQuery('.ui-nex-forms-container').each(
		function()
			{
			var form_container = jQuery(this);
			var form_id		   = jQuery(this).find('form').attr('id');
			form_container.find(':disabled').each(
				function()
					{
					form_container.find('form').append('<input type="hidden" name="'+ jQuery(this).attr('name') +'" value="'+ jQuery(this).val() +'" />');
					}
				);	
			
			form_container.find('.the-radios label').each(
				function()
					{
					var label = jQuery(this);
					var field = jQuery(this).closest('.form_field');
					var input = jQuery(this).find('input');
					var set_id = form_id+'_'+ field.attr('id')+ '_'+input.attr('name')+'_'+input.attr('value')+'_'+format_illegal_chars(jQuery(this).find('.input-label').text());
					label.attr('for',set_id);
					input.attr('id',set_id);
					}
				);
			}
		);
	
	

	jQuery('.ui-nex-forms-container').each(
	function()
		{
		jQuery(this).find('.step').last().addClass('last_step');
		}
	);
	
	
	
	
	jQuery(document).on('change', '.upload_fields input[type="file"]',
		function()
			{
			hide_nf_error(jQuery(this).closest('.form_field'));
			}
		);		
	

	jQuery(document).on('click', "#nex-forms .upload-image .nf_add_image .the_input_element .fileinput-new .fa",
		function()
			{
			jQuery(this).closest('.form_field').find('.the_input_element').trigger('click');
			}
		);	
	
	
		
	/* BREADCRUMB */

	jQuery('.nex-submit').prop('disabled',false);
	jQuery('textarea').closest('.form_field').addClass('multi_line');
	
	
	jQuery('input').trigger('autoresize');
	jQuery('textarea').trigger('autoresize');
	//jQuery('select.material_select').dropdown();
	if(get_modal!='disabled')
		{
		jQuery('.nex_forms_modal.modal').modal(
				{
				dismissible: true, // Modal can be dismissed by clicking outside of the modal
				opacity: 0, // Opacity of modal background
				onOpenStart: function(element)
					{ 	
					},
				onCloseStart: function(element) 
					{ 
					} // Callback for Modal close
				}
			);
		}
		
	var get_nex_forms = {};
	var get_nex_forms_interactions = {};

	jQuery('form.submit-nex-form').each(
		function(index)
			{
			get_nex_forms[jQuery(this).attr('id')] = false;
			get_nex_forms_interactions[jQuery(this).attr('id')] = false;
			}
		);

	
	
		
	var ajaxurl = jQuery('#nf_ajax_url').text();
	
	jQuery(window).on('load resize scroll', function() {
		for (var key in get_nex_forms) {
		   if (jQuery('form#'+key).isInViewport()) { 
			if(get_nex_forms[key] == false)
				{
				var data = 	
					{
					action	 			: 'nf_add_form_view',
					nex_forms_id		: jQuery('form#'+key).find('input[name="nex_forms_Id"]').val()
					};
				jQuery.post(ajaxurl, data, function(response){});
				get_nex_forms[key] = true;
			  }
		   }
		}
	});
	
	
	jQuery(document).on('click','form[name="nex_form"]',
		function()
			{
			var the_form = jQuery(this);
			if(get_nex_forms_interactions[the_form.attr('id')] == false)
				{
				var data = 	
					{
					action	 			: 'nf_add_form_interaction',
					nex_forms_id		: the_form.find('input[name="nex_forms_Id"]').val()
					};
				jQuery.post(ajaxurl, data, function(response){});
				get_nex_forms_interactions[the_form.attr('id')] = true;
			  }
			}
		);
	
	jQuery(document).on('change','input[type="file"][multiple]',
			function(e){
				
				hide_nf_error(jQuery(this).closest('.form_field'));
				
				var files = this.files;
				var max_upload_size_per_file 	= (jQuery(this).closest('.form_field').find('.the_input_element').attr('data-max-size-pf')) ? parseFloat(jQuery(this).closest('.form_field').find('.the_input_element').attr('data-max-size-pf')) : 0;
				var min_upload_size_per_file 	= (jQuery(this).closest('.form_field').find('.the_input_element').attr('data-min-size-pf')) ? parseFloat(jQuery(this).closest('.form_field').find('.the_input_element').attr('data-min-size-pf')) : 0;
				var max_upload_size_overall 	= (jQuery(this).closest('.form_field').find('.the_input_element').attr('data-max-size-overall')) ? parseFloat(jQuery(this).closest('.form_field').find('.the_input_element').attr('data-max-size-overall')) : 0;
				var max_files 					= (jQuery(this).closest('.form_field').find('.the_input_element').attr('data-max-files')) ? parseFloat(jQuery(this).closest('.form_field').find('.the_input_element').attr('data-max-files')) : 0;
				

				var set_file_names = '';
				var total_size = 0;
				for (var i=0;i<files.length;i++){
					var size = (files[i].size/(1024*1024)).toFixed(2);
					set_file_names += '<li class="file-item"><i class="fa fa-file-o"></i>&nbsp;&nbsp;'+ files[i].name + ' - '+ size  +'MB</li>';
					total_size += parseFloat(size);
					if(max_upload_size_per_file>0)
						{
						if(parseFloat(size)>max_upload_size_per_file)
							{
							var get_error_msg = jQuery(this).closest('.form_field').find('.error_message').attr('data-max-per-file-message');
							var set_error_msg = get_error_msg.replace('{x}',max_upload_size_per_file)
							show_nf_error(jQuery(this).closest('.form_field'),set_error_msg)
							return false;

							}
						}
					if(min_upload_size_per_file>0)
						{
						if(parseFloat(size)<min_upload_size_per_file)
							{
							var get_error_msg = jQuery(this).closest('.form_field').find('.error_message').attr('data-min-per-file-message');
							var set_error_msg = get_error_msg.replace('{x}',min_upload_size_per_file)
							show_nf_error(jQuery(this).closest('.form_field'),set_error_msg)
							return false;
							}
						}
						
					var fname = files[i].name;
					var items = jQuery(this).closest('.form_field').parent().find('div.get_file_ext').text();
					
					
					if(strstr(items, ','))
						items =	items.split(',');
					else
						items =	items.split('\n');
					
					
					var ext = fname.substr((~-fname.lastIndexOf(".") >>> 0) + 2);
						if(jQuery.inArray(ext,items)<0)
							{
							show_nf_error(jQuery(this).closest('.form_field'),jQuery(this).closest('.form_field').find('.error_message').attr('data-secondary-message'))

							return false;
							}
						}
				if(max_upload_size_overall>0)
					{
					if(total_size>max_upload_size_overall)
						{
						var get_error_msg = jQuery(this).closest('.form_field').find('.error_message').attr('data-max-all-file-message');
						var set_error_msg = get_error_msg.replace('{x}',max_upload_size_overall)
						show_nf_error(jQuery(this).closest('.form_field'),set_error_msg);
						return false;
						}
					}
			    if(max_files>0)
					{
					if(files.length>max_files)
						{
						var get_error_msg = jQuery(this).closest('.form_field').find('.error_message').attr('data-file-upload-limit-message');
						var set_error_msg = get_error_msg.replace('{x}',max_files)
						show_nf_error(jQuery(this).closest('.form_field'),set_error_msg);
						return false;
						}
					}
				
				if(!jQuery(this).closest('.form_field').find('ul.file_list').attr('class'))
					jQuery(this).closest('.form_field .input_container').append('<ul class="file_list">'+ set_file_names +'</ul>');
				else
					jQuery(this).closest('.form_field').find('ul.file_list').html( set_file_names );
				
				setTimeout(function(){ jQuery(this).closest('.form_field').find('span.fileinput-filename').text(files.length+' Files Selected - ' + total_size.toFixed(2) + 'MB') },100);
				
				if(files.length==0)
					{
					jQuery(this).closest('.form_field').find('ul.file_list').remove();
					if(jQuery(this).closest('.form_field').hasClass('required'))
						{
						var set_error_msg = jQuery(this).closest('.form_field').find('.error_message').attr('data-error-message');
						show_nf_error(jQuery(this).closest('.form_field'),set_error_msg);	
						}
					}
				
				
				return false;
			});
	jQuery('.md-slider').each(
		function(index)
			{
			var the_slider = jQuery(this).find('.slider');
			var slider_min = the_slider.attr('data-starting-value');
			setTimeout(
				function()
					{
					the_slider.parent().find('input.the_slider').val(slider_min);
					the_slider.parent().find('input.the_slider').trigger('change');
					},(index+10));
			}
		);
	
	
	jQuery('#nex-forms input[type="file"]').each(
		function(index)
			{
			jQuery(this).val('');
			}
		);
	
	
	
	jQuery(document).on('click','.input-group-addon.recreate-this-field',
		function()
			{
			var clone = jQuery(this).parent().clone();
			
			
			jQuery(this).parent().parent().append(clone);
			jQuery(this).parent().append('<span class="input-group-addon delete-this-field"><i class="fa fa-minus"></i></span>');
			jQuery(this).remove();
			}
		);
	
	jQuery(document).on('click','.input-group-addon.delete-this-field',
		function()
			{
			jQuery(this).parent().remove();
			}
		);
	
	jQuery(document).on('mouseup','.js-signature canvas',
		function()
			{
			jQuery(this).parent().parent().find('textarea').val((jQuery(this).parent().parent().find('.js-signature').jqSignature('getDataURL')));
			
			}
		);
	jQuery(document).on('touchend','.js-signature canvas',
		function()
			{
			jQuery(this).parent().parent().find('textarea').val((jQuery(this).parent().parent().find('.js-signature').jqSignature('getDataURL')));
			
			}
		);	
	
	
	
	jQuery(document).on('click','.clear_digital_siganture',
		function()
			{
			jQuery(this).parent().find('textarea').val('');
			jQuery(this).parent().find('.js-signature').jqSignature('clearCanvas');
			
			jQuery(this).closest('.form_field').find('textarea').val('');
			jQuery(this).closest('.form_field').find('.js-signature').jqSignature('clearCanvas');
			}
		);
		//
	jQuery('.icon-label-tip [data-toggle="tooltip"]').tooltip_bs({ delay:{ "show": 500, "hide": 100 }})
	jQuery('.icon-label-tip [data-toggle="tooltip_bs"]').tooltip_bs({ delay:{ "show": 500, "hide": 100 }})
	
	if(get_wow!='disabled')
		{
		var wow = new WOW(
				{
				boxClass:     'wow',      // default
				animateClass: 'animated', // default
				offset:       0,          // default
				mobile:       true,       // default
				live:         true        // default
				}
			)
		wow.init();
		}
		
		jQuery(document).trigger('scroll','html, body');

	jQuery('#nex-forms .numbers_only input').on('keyup', function(){
		var get_val = jQuery(this).val();
		get_val = get_val.replace(/[^\d\.\,]*/g,'');
		
		jQuery(this).val(get_val);
		}
	);
	
	jQuery('#nex-forms .text_only input').on('keyup', function(){
		var get_val = jQuery(this).val();
		get_val = get_val.replace(/[^a-z]+/gi,'');
		
		jQuery(this).val(get_val);
		}
	);

	
	jQuery('#nex-forms input[type="text"], #nex-forms textarea').each(
		function()
			{

			if(jQuery(this).attr('minlength'))
				{
				var current_total = jQuery(this).val().length;
				var min_total = jQuery(this).attr('minlength');
				jQuery(this).parent().append('<div class="text_counter_holder"><div class="text_counter text-red" style="display:none;">' + current_total + '/' + min_total + '</div></div>')
				
				jQuery(this).focus(function () {
					jQuery(this).parent().find('.text_counter').show();
					jQuery(this).parent().find('.text_counter').addClass('animated');
					jQuery(this).parent().find('.text_counter').addClass('fadeIn');
				});
				
				jQuery(this).blur(function () {
					jQuery(this).parent().find('.text_counter').hide();
					jQuery(this).parent().find('.text_counter').removeClass('animated');
					jQuery(this).parent().find('.text_counter').removeClass('fadeIn');
				});
				
           		jQuery(this).keyup(function () {
 
            	var left = (jQuery(this).val().length-min_total);
 
				if(jQuery(this).val().length < min_total){
					jQuery(this).parent().find('.text_counter').addClass("text-red").removeClass('text-light-green');
				}else{
					jQuery(this).parent().find('.text_counter').removeClass("text-red").addClass('text-light-green');
				}
 				
				
            	jQuery(this).parent().find('.text_counter').text(jQuery(this).val().length + '/' + min_total);
				});
				}
			
			
			
			
			if(jQuery(this).attr('maxlength'))
				{
				var current_total = jQuery(this).val().length;
				var max_total = jQuery(this).attr('maxlength');
				jQuery(this).parent().append('<div class="text_counter_holder"><div class="text_counter" style="display:none;">' + current_total + '/' + max_total + '</div></div>')
				
				jQuery(this).focus(function () {
					jQuery(this).parent().find('.text_counter').show();
					jQuery(this).parent().find('.text_counter').addClass('animated');
					jQuery(this).parent().find('.text_counter').addClass('fadeIn');
				});
				
				jQuery(this).blur(function () {
					jQuery(this).parent().find('.text_counter').hide();
					jQuery(this).parent().find('.text_counter').removeClass('animated');
					jQuery(this).parent().find('.text_counter').removeClass('fadeIn');
				});
				
           		jQuery(this).keyup(function () {
 
            	var left = (max_total-jQuery(this).val().length);

				if(jQuery(this).val().length<=0)
					{
					jQuery(this).closest('.form_field').removeClass('has_max_lenght');	
					
					}
				else
					{
					jQuery(this).closest('.form_field').addClass('has_max_lenght');	
					
					}
            	jQuery(this).parent().find('.text_counter').text(jQuery(this).val().length + '/' + max_total);
				});
				}
			}
		);

		jQuery(document).on('click', '.thumb-icon-holder', function(e)
			{
			var the_field = jQuery(this).closest('.form_field');
			if(jQuery(this).closest('.radio-inline').hasClass('radio_selected'))
				{
				if(the_field.closest('.step').hasClass('auto-step'))
					{
					if(the_field.closest('.step').hasClass('last_step'))
						{
						setTimeout(function()
							{
							the_field.closest('form').submit();
							},500);
						}
					else
						{
						setTimeout(function()
								{	
									the_field.closest('.step').find('.nex-step').trigger('click');	
								},300
							)
						}
					}
				}
			}
		);
		jQuery(document).on('change', 'form .the-radios input[type="radio"], form  .the-radios input[type="checkbox"]', function(e){
				
				
				var the_field = jQuery(this).closest('.form_field');
				var checkmin  = (jQuery(this).closest("#field_container").attr('data-min-selection')) ? parseInt(jQuery(this).closest("#field_container").attr('data-min-selection')) : 0;
				var checkmax  = (jQuery(this).closest("#field_container").attr('data-max-selection')) ? parseInt(jQuery(this).closest("#field_container").attr('data-max-selection')) : 0;
				
				hide_nf_error(the_field);
				if(!the_field.hasClass('classic-radio-group') && !the_field.hasClass('classic-check-group'))
					{
						e.preventDefault();
					}
				
				var clickedParent 	= 	jQuery(this).closest('label');
				var	input 			=	jQuery(this);
				var	nexCheckable 	= 	clickedParent.find('a:first');
				var	input_label 	= 	jQuery(this).closest('label');
				
				var	input_holder 	= 	jQuery(this).closest('.input_container');
				var	input_wrapper 	= 	jQuery(this).closest('.form_field');
			
				var check_animation 	= (input_holder.attr('data-checked-animation')) ? input_holder.attr('data-checked-animation') : 'fadeInDown';
				var uncheck_animation 	= (input_holder.attr('data-unchecked-animation')) ? input_holder.attr('data-unchecked-animation') : 'fadeOutUp';
				
				if(input.prop('type') === 'radio')
					{
					
					the_field.find('.radio_selected').removeClass('radio_selected');
						the_field.find('#the-radios a').css('background','rgba(255,255,255,0.2)');
						the_field.find('.check-icon').remove();
					if(!nexCheckable.hasClass('checked'))
						{
							the_field.find('input[name="' + input.attr('name') + '"]').each(
								function(index, el)
									{
									jQuery(this).prop('checked', false).parent().find('a:first').removeClass('checked').removeClass("ui-state-active").addClass("ui-state-default").removeClass(jQuery(el).closest('.the-radios').attr('data-checked-class'));
									nexCheckable.attr('class','checked' );
									
									
									
									input_label.removeClass('radio_selected');
									jQuery(this).closest('label').removeClass('ui-state-active');
									}
								);
							
						}
					
					
					if(the_field.closest('.step').hasClass('auto-step'))
						{
							
							if(the_field.closest('.step').hasClass('last_step'))
								{
								setTimeout(function()
									{
									the_field.closest('form').submit();
									},500);
								}
							else
								{
								setTimeout(function()
										{	
											the_field.closest('.step').find('.nex-step').trigger('click');	
										},300
									)
								}
						}
					
					//nexCheckable.removeClass('animated').removeClass('pulse');
					//RADIOS
					if(input.prop('checked'))
						{
						input.prop('checked', false);
						nexCheckable.attr('class','ui-state-default');
							nexCheckable.css('background','rgba(255,255,255,0.2)');
						input_label.removeClass('radio_selected');
						nexCheckable.parent().find('.check-icon').remove();
						nexCheckable.removeClass('animated').removeClass('pulse');
						input_label.removeClass('ui-state-active');
						} 
					else 
						{
						nexCheckable.removeClass('animated').removeClass('pulse');
						the_field.find('.thumb-icon-holder .thumb-icon').removeClass(check_animation);
						the_field.find('.thumb-icon-holder .thumb-icon').addClass(uncheck_animation);
						setTimeout(function() { the_field.find('.thumb-icon-holder .thumb-icon.'+uncheck_animation).parent().remove() },300);
						
						var set_thumb_icon_bg = '#8bc34a';
						if(input_label.closest('.ui-nex-forms-container').hasClass('jquery_ui'))
							input_label.addClass('ui-state-active');
						input.prop('checked', true);
						nexCheckable.attr('class','checked');
						nexCheckable.addClass("ui-state-active").removeClass("ui-state-default")
						input_label.addClass('radio_selected');
						if(nexCheckable.closest('#the-radios').data('checked-bg-color') && nexCheckable.closest('#the-radios').data('checked-bg-color')!='')
							{
							nexCheckable.css('background',nexCheckable.closest('#the-radios').attr('data-checked-bg-color'));
							set_thumb_icon_bg = nexCheckable.closest('#the-radios').attr('data-checked-bg-color');
							}
						else
							{
							nexCheckable.css('background','#8bc34a');
							set_thumb_icon_bg = '#8bc34a';
							
							}
						var checked_color = 'rgba(255,255,255)';
						
						if(nexCheckable.css('color')!='transparent' && nexCheckable.css('color')!='undefined' && nexCheckable.css('color')!='' && nexCheckable.css('color')!='rgba(0, 0, 0, 0)')
							checked_color = nexCheckable.css('color');
						
						
						if(the_field.hasClass('image-choices-field'))
							clickedParent.find('.thumb-image-outer-wrap').prepend('<div class="thumb-icon-holder"><span style="background: '+ set_thumb_icon_bg +'; color:'+ checked_color +';" class="thumb-icon set_animation_fast '+check_animation+' checked fa '+ nexCheckable.closest('.the-radios').attr('data-checked-class')+'"></span></div>' );
						else
							nexCheckable.after('<span style="color:'+ checked_color +';" class="check-icon animated zoomInFaster checked fa '+ nexCheckable.closest('.the-radios').attr('data-checked-class')+'"></span>' );
						
						//the_field.find('.pulse2').removeClass('animated').removeClass('pulse2');
						if(!jQuery(this).closest('.ui-nex-forms-container').hasClass('neumorphism'))
							{
							nexCheckable.addClass('animated').addClass('pulse');
							setTimeout(function(){ nexCheckable.removeClass('animated').removeClass('pulse');},1300);
							}
						}	
					}	
				else
					{
					
					//CHECKS
					if(!input.prop('checked'))
						{
						nexCheckable.attr('class','ui-state-default');
							nexCheckable.css('background','rgba(255,255,255,0.2)');
						input_label.removeClass('radio_selected');
						nexCheckable.parent().find('.check-icon').remove();
						input_label.find('.thumb-icon-holder .thumb-icon').removeClass(check_animation);
						input_label.find('.thumb-icon-holder .thumb-icon').addClass(uncheck_animation);
						setTimeout(function() { input_label.find('.thumb-icon-holder').remove() },300);
						if(input_label.closest('.ui-nex-forms-container').hasClass('jquery_ui'))
							input_label.removeClass('ui-state-active');
						} 
					else 
						{
						var set_thumb_icon_bg = '#8bc34a';
						if(input_label.closest('.ui-nex-forms-container').hasClass('jquery_ui'))
							input_label.addClass('ui-state-active');
						nexCheckable.attr('class','checked');
						nexCheckable.addClass("ui-state-active").removeClass("ui-state-default")
						input_label.addClass('radio_selected');
						if(nexCheckable.closest('#the-radios').data('checked-bg-color') && nexCheckable.closest('#the-radios').data('checked-bg-color')!='')
							{
							nexCheckable.css('background',nexCheckable.closest('#the-radios').attr('data-checked-bg-color'));
							set_thumb_icon_bg = nexCheckable.closest('#the-radios').attr('data-checked-bg-color');
							}
						else
							{
							nexCheckable.css('background','#8bc34a');
							set_thumb_icon_bg = '#8bc34a';
							
							}
						var checked_color = 'rgba(255,255,255)';
						
						if(nexCheckable.css('color')!='transparent' && nexCheckable.css('color')!='undefined' && nexCheckable.css('color')!='' && nexCheckable.css('color')!='rgba(0, 0, 0, 0)')
							checked_color = nexCheckable.css('color');
						
						
						if(the_field.hasClass('image-choices-field'))
							clickedParent.find('.thumb-image-outer-wrap').prepend('<div class="thumb-icon-holder"><span style="background: '+ set_thumb_icon_bg +'; color:'+ checked_color +';" class="thumb-icon set_animation_fast '+ check_animation +' checked fa '+ nexCheckable.closest('.the-radios').attr('data-checked-class')+'"></span></div>' );
						else
							nexCheckable.after('<span style="color:'+ checked_color +';" class="check-icon animated zoomInFaster checked fa '+ nexCheckable.closest('.the-radios').attr('data-checked-class')+'"></span>' );
						
						
						
						if(!jQuery(this).closest('.ui-nex-forms-container').hasClass('neumorphism'))
							{
							nexCheckable.addClass('animated').addClass('pulse');
							
							}
						
						}
						
					if(checkmax)
						{
						
						if(input_wrapper.find('input:checked').length>=checkmax)
							{
							input_wrapper.find('input:not(:checked)').prop('disabled',true);
							input_wrapper.find('input:not(:checked)').closest('label').addClass('check_disabled');	
							}
						else
							{
							input_wrapper.find('input').prop('disabled',false);
							input_wrapper.find('input').closest('label').removeClass('check_disabled');
							}
						}
							
					}
					
				
					
				}		
				
			);

	jQuery(document).on('click','.nf-sticky-contact-form.paddel-right .nf-sticky-paddel',
		function()
			{
			
					
			var sticky_form = jQuery(this).closest('.nf-sticky-contact-form');
			
			var sticky_width = sticky_form.outerWidth();
			
			if(sticky_form.hasClass('open'))
				{
				sticky_form.removeClass('open');
				sticky_form.animate(
					{
					marginRight:-sticky_width
					}
				,300);
				}
			else
				{
				jQuery('.nf-sticky-contact-form.paddel-right.open .nf-sticky-paddel').trigger('click')
				sticky_form.animate(
					{
					marginRight:-4
					}
				,300);
				sticky_form.addClass('open')
				}
			}
		);
		
	
	jQuery(document).on('click','.nf-sticky-contact-form.paddel-left .nf-sticky-paddel',
		function()
			{
			var sticky_form = jQuery(this).closest('.nf-sticky-contact-form');
			
			var sticky_width = sticky_form.outerWidth();
			
			if(sticky_form.hasClass('open'))
				{
				sticky_form.removeClass('open');
				sticky_form.animate(
					{
					marginLeft:-sticky_width
					}
				,300);
				}
			else
				{
				jQuery('.nf-sticky-contact-form.paddel-left.open .nf-sticky-paddel').trigger('click')
				sticky_form.animate(
					{
					marginLeft:-4
					}
				,300);
				sticky_form.addClass('open')
				}
			}
		);
	
	jQuery(document).on('click','#nex-forms .input-group-addon',
		function()
			{
				jQuery(this).closest('.input_container').find('input').focus();
			}
		);	
	
	jQuery('body').prepend('<div id="nex-forms" class="nex-forms nf_popups_holder"></div>');	
		
		
	jQuery('.nex_forms_modal').each(
		function()
			{
			var the_modal = jQuery(this).detach();
			jQuery('.nf_popups_holder').prepend(the_modal);
			//console.log(jQuery(this).attr('id'));	
			}
		);	
		
		
		
		
	jQuery(document).on('click','.open_nex_forms_popup',
		function(e)
			{
			e.preventDefault();
			
			var form = jQuery('.nf_popups_holder #nexForms_popup_'+jQuery(this).attr('data-popup-id')).find('form');
			
			var default_values = jQuery(this).attr('data-default-values');
			
			
			
			if(default_values)
				{
				var get_defaults = default_values.split(',');
				for (var i = 0; i < get_defaults.length; i++) 
					{
						
					var get_name_val = get_defaults[i].split('=');
					var the_input = form.find('input[name="'+ get_name_val[0].trim() +'"]')
					var pre_val = get_name_val[1].trim();
					
					if(the_input.hasClass('the_slider'))
						{
						the_input.parent().find('#slider').slider({ value: parseInt(pre_val) });
						the_input.parent().find('.count-text').text(pre_val);
						the_input.parent().find( 'input' ).val(parseInt(pre_val));
						the_input.parent().find( 'input' ).trigger('change');
						}
					form.find('select[name="'+ get_name_val[0] +'"] option').attr('selected',false);
					form.find('select[name="'+ get_name_val[0] +'"] option[value="'+pre_val+'"]').attr('selected','selected');

					
					//CHECKS
					form.find('input[name="'+ get_name_val[0] +'[]"]').each(
						function()
							{
							if(jQuery(this).val()==pre_val)
								{

								jQuery(this).prop('checked',true);
								jQuery(this).trigger('change');
								}
							}
						)
					//INPUTS
					if(the_input.attr('type')=='text')
						{
						the_input.val(pre_val)
						}
					if(the_input.attr('type')=='hidden')
						{
						the_input.val(pre_val)
						}
					if(the_input.attr('type')=='radio')
						{
						the_input.closest('.icon-container').find('input').each(
							function()
								{
								if(jQuery(this).val()==pre_val)
									{
									var get_radio = jQuery(this).parent();
									setTimeout(function(){ get_radio.trigger('click') },200);
									}	
								}
							);
						the_input.closest('.the-radios').find('input[type="radio"]').each(
							function()
								{
								if(jQuery(this).val()==pre_val)
									jQuery(this).closest('label').trigger('click');
								}
							);
						}
						
					//CHECKS
					form.find('textarea[name="'+ get_name_val[0] +'"]').val(pre_val);

					
					}
				}
			if(get_modal!='disabled')
				{	
				jQuery('#nexForms_popup_'+jQuery(this).attr('data-popup-id')).modal('open');
				}
			}
		)

	jQuery(document).on('click','.modal-overlay, #nex-forms .modal-close', function()
			{
			jQuery.each(parent_css_resets, function(key, value)
				{
				value.element.css('position',value.position)
				});
			}
		);
		
		
	jQuery(document).on('mouseover', '.ui-state-default', function(){
			jQuery(this).addClass('ui-state-hover');
			}
		);
	jQuery(document).on('mouseleave', '.ui-state-default', function(){
			jQuery(this).removeClass('ui-state-hover');
			}
		);

	jQuery(document).on('keyup','.autocomplete the_input_element',
		function()
			{
			jQuery('.ui-autocomplete').addClass('dropdown-menu');
			}
		);
	
	
	jQuery(document).on('click', '.input-group-addon.color-select', function(){
			jQuery(this).parent().addClass('open');	
			}
		);
	jQuery(document).on('click', '.selectpicker', function(){
			jQuery(this).parent().addClass('open');
			}
		);
	jQuery(document).on('click', '#star .fa', function(){
			jQuery(this).parent().find('input').trigger('change');
			}
		);	

	jQuery(document).on('click', '.bootstrap-touchspin-down, bootstrap-touchspin-up', function(){
			jQuery(this).parent().parent().find('input').trigger('change');
			}
		);	
		
	jQuery('div.ui-nex-forms-container .zero-clipboard, div.ui-nex-forms-container .field_settings').remove();
	jQuery('div.ui-nex-forms-container .grid').removeClass('grid-system')
	jQuery('div.ui-nex-forms-container .editing-field-container').removeClass('.editing-field-container')
	jQuery('div.ui-nex-forms-container #slider').html('');
	
	jQuery('div.ui-nex-forms-container #star').each(
		function()
			{
			jQuery(this).attr('data-input-name', jQuery(this).find('input').attr('name'));
			}
		);
	
	if(jQuery('div.ui-nex-forms-container #star').attr('class'))
		{
		jQuery('div.ui-nex-forms-container #star' ).raty('destroy');
		}
	jQuery('div.ui-nex-forms-container .bootstrap-touchspin-prefix').remove();
	jQuery('div.ui-nex-forms-container .bootstrap-select').remove();
	jQuery('div.ui-nex-forms-container .bootstrap-touchspin-postfix').remove();
	jQuery('div.ui-nex-forms-container .bootstrap-touchspin .input-group-btn').remove();
	jQuery('div.ui-nex-forms-container .bootstrap-tagsinput').remove();
	
	jQuery('div.ui-nex-forms-container .editing-field').removeClass('editing-field')
	jQuery('div.ui-nex-forms-container .editing-field-container').removeClass('.editing-field-container')
	jQuery('div.ui-nex-forms-container').find('div.trash-can').remove();
	jQuery('div.ui-nex-forms-container').find('div.draggable_object').hide();
	jQuery('div.ui-nex-forms-container').find('div.draggable_object').remove();
	jQuery('div.ui-nex-forms-container').find('div.form_field').removeClass('field');
	
	jQuery('div.ui-nex-forms-container .zero-clipboard').remove();
	
	
	jQuery('div.ui-nex-forms-container').each(
		function()
			{
			jQuery(this).find('.step').hide()
			jQuery(this).find('.step').first().show();	
			}

		);
	jQuery('div.ui-nex-forms-container .tab-pane').removeClass('tab-pane');
	
	jQuery('input.radio').css('display','block');
	jQuery('input.check').css('display','block');
	
	setTimeout(function(){
	jQuery('#nex-forms .grid-replication-enabled').each(
		function(index)
			{
			var grid_name = format_illegal_chars(jQuery(this).attr('data-grid-name'));	
			jQuery(this).wrap('<div class="grid-replication-container" data-grid-name="'+ grid_name +'" data-limit="'+ jQuery(this).find('.grid_row').attr('data-replication-limit') +'" data-replicated="1"></div>');
			jQuery(this).find('input, select, textarea').each(
				function()
					{
					if(jQuery(this).attr('type')=='file')
						{
						jQuery(this).attr('data-original-name',jQuery(this).attr('name'));
						jQuery(this).attr('name','gu__'+grid_name+'__'+jQuery(this).attr('name')+'[]');	
						}
					else
						{
						jQuery(this).attr('data-original-name',jQuery(this).attr('name'));
						jQuery(this).attr('name',grid_name+'[1]['+jQuery(this).attr('name')+']');
						}
					}
				);				
			}
		);
	},400);
	
function run_replication_field_setup(){
	jQuery('#nex-forms .is_grid.grid-replication-enabled').each(
				function(index)
					{
					var grid_num = index+1;
					var grid_name = format_illegal_chars(jQuery(this).attr('data-grid-name'));
					jQuery(this).find('input, select, textarea').each(
						function(index)
							{
								var field_id = jQuery(this).attr('id');
							if(jQuery(this).attr('type')=='file')
								{
								jQuery(this).attr('name','gu__'+grid_name+'__'+jQuery(this).attr('data-original-name')+'[]');
								}
							else
								{
									jQuery(this).attr('name',grid_name+'['+ grid_num +']['+jQuery(this).attr('data-original-name')+']');
									
									jQuery(this).attr('id',field_id + grid_num);
									jQuery(this).closest('label').attr('for', field_id + grid_num);
							
								}
							}
						);		
					}
				);
}

setTimeout(function(){ run_replication_field_setup()}, 800);

	jQuery(document).on('click','.recreate-grid',
		function()
			{
			var clone = jQuery(this).closest('.is_grid').clone();
			
			var grid_container = jQuery(this).closest('.grid-replication-container');
			
			var limit = grid_container.attr('data-limit');
			var replicated = parseInt(grid_container.attr('data-replicated'));
			var grid_name = grid_container.attr('data-grid-name');
			replicated = replicated +1;
			
			grid_container.attr('data-replicated',replicated);
			
			clone.find('.grid_replicate').html('<div class="remove-grid"><span class="fa fa-minus"></span></div></span></div>');
			clone.find('.bootstrap-touchspin-prefix').remove();
			clone.find('.bootstrap-touchspin-postfix').remove();
			clone.find('.bootstrap-touchspin .input-group-btn').remove();
			clone.find('.bootstrap-touchspin .input-group-btn-vertical').remove();
			clone.find('.bootstrap-tagsinput').remove();
			clone.find('#spinner').unwrap();
			jQuery(this).closest('.is_grid').find('input').val(null);
			jQuery(this).closest('.is_grid').find('select option').prop('selected',false);
			var select_clone = '';
			select_clone = clone.closest('.is_grid').find('select');
			var selected = (select_clone.attr('data-selected')) ? select_clone.attr('data-selected') : '0';
			
			clone.closest('.is_grid').find('select').val(selected);
			jQuery(this).closest('.is_grid').find('textarea').val('');
			
			var get_radio = jQuery(this).closest('.is_grid').find('.radio_selected');
			get_radio.find('input').prop('checked', false);
			get_radio.find('a').attr('class','ui-state-default');
			get_radio.find('a').css('background','rgba(255,255,255,0.2)');
			get_radio.find('.check-icon').remove();
			
			
			
			
			
			clone.find('.form_field').each(
				function()
					{
					setup_ui_element(jQuery(this));
					}
				);
			
			
			jQuery(this).closest('.is_grid').find('.fileinput-filename').text('');
			jQuery('.fileinput-exists input[type="hidden"]').remove();
			
			
			
			clone.insertBefore(jQuery(this).closest('.is_grid'));
			
			if(replicated==limit)
				grid_container.addClass('limited');
				
			run_replication_field_setup();
			
			}
		);
	jQuery(document).on('click','.remove-grid',
		function()
			{
			var grid_container = jQuery(this).closest('.grid-replication-container');	
			var grid_name = grid_container.attr('data-grid-name');
			
			grid_container.removeClass('limited');	
			var replicated = parseInt(grid_container.attr('data-replicated'));
			replicated = replicated -1;
			grid_container.attr('data-replicated',replicated);
			
			jQuery(this).closest('.is_grid').remove();
			
			
			grid_container.find('.is_grid').each(
				function(index)
					{
					var grid_num = index+1;
					jQuery(this).find('input, select, textarea').each(
						function(index)
							{
							if(jQuery(this).attr('type')=='file')
								{
								jQuery(this).attr('name','gu__'+grid_name+'__'+jQuery(this).attr('data-original-name')+'[]');
								}
							else
							jQuery(this).attr('name',grid_name+'['+ grid_num +']['+jQuery(this).attr('data-original-name')+']');
							}
						);		
					}
				);
			
			}
		);
	
	jQuery('.glyphicon-file').addClass('fas');
	jQuery('.glyphicon-file').addClass('fa-file');
	jQuery('.glyphicon-file').removeClass('glyphicon');
	jQuery('.glyphicon-file').removeClass('glyphicon-file');
	
		
	
	
	
	
	
	jQuery('.color_scheme').each(
		function()
			{
			if(jQuery(this).attr('href')=='')
				jQuery(this).attr('href','#');
				
			var the_css = jQuery(this);
			var move_css = the_css.clone();
			
			jQuery('head').append(move_css)
			the_css.remove();
			
			}
		);
	
	jQuery(document).on('blur','textarea.materialize-textarea, input',
			function()
				{
				if(!jQuery(this).val() && (jQuery(this).attr('placeholder')==''))
					jQuery(this).parent().find('#md_label').removeClass('active');
				}
			
		);
	
	
	jQuery("input, textarea").attr('autocomplete', 'enabled');
	jQuery("#datetimepicker input").attr('autocomplete', '0');
	

	var sticky_form_bottom_height = jQuery('.nf-sticky-contact-form.paddel-bottom').height();
	var sticky_paddel_height = jQuery('.nf-sticky-contact-form .nf-sticky-paddel').height();
	
	var set_bottom_margin = (sticky_form_bottom_height + sticky_paddel_height+3 + jQuery('.nf-sticky-contact-form.paddel-bottom .panel-heading').height()-15);
	var set_open_margin = (sticky_form_bottom_height - sticky_paddel_height+3);
		
	var diff = set_bottom_margin - 300; 
	
	jQuery('.nf-sticky-contact-form.paddel-bottom .panel').css('overflow-x','hidden')
	
	if(set_bottom_margin>300)	
		jQuery('.nf-sticky-contact-form.paddel-bottom .panel').css('overflow-y','scroll').css('height',(300-diff+sticky_paddel_height+8)+'px');
	
	
	jQuery(document).on('click','.nf-sticky-contact-form.paddel-bottom .nf-sticky-paddel',
		function()
			{
			var sticky_form = jQuery(this).closest('.nf-sticky-contact-form');
			if(sticky_form.hasClass('open'))
				{
				sticky_form.removeClass('open');
				sticky_form.animate(
					{
					marginBottom:-300
					}
				,300);
				}
			else
				{
				sticky_form.animate(
					{
					marginBottom:0
					}
				,300);
				sticky_form.addClass('open')
				}
			}
		);
	
	
	
	
	jQuery('div.ui-nex-forms-container-fe .form_field').each(
		function(index)
			{
			var the_element = jQuery(this);
			
			if(jQuery(this).find('.appendix_field').is('div'))
				the_element.css('z-index',1000-index);
			else
				the_element.css('z-index','');
				
			setup_ui_element(the_element);
			
			if(the_element.hasClass('material_field'))
				{
					if(the_element.find('i.material-icons').attr('class'))
						the_element.addClass('has_icon');
					else
						the_element.addClass('no_icon');
				}
			
			if(the_element.hasClass('select') || the_element.hasClass('multi-select') || the_element.hasClass('radio-group') || the_element.hasClass('check-group') || the_element.hasClass('md-select') || the_element.hasClass('md-multi-select') || the_element.hasClass('md-radio-group')  || the_element.hasClass('jq-radio-group') || the_element.hasClass('jq-check-group') || the_element.hasClass('image-choices-field') || the_element.hasClass('icon-select-group'))
				{
				if(the_element.hasClass('md-select'))
					{
					var the_input = the_element.find('select.the_input_element');
					}
				else if(the_element.hasClass('icon-select-group'))
					{
					var the_input = the_element.find('.icon-holder .the_input_element');
					}
				else
					{
					var the_input = the_element.find('.the_input_element');
					}
					
					var input_name = the_input.attr('name');
					//input_name = input_name.replace('[]','');
					the_element.append('<input type="hidden" class="the_value" name="real_val__'+ input_name +'">'); 
				}
			
			}
		);	
	
	
	
	
	jQuery('.ui-nex-forms-container select').each(
		function()
			{
			if(jQuery(this).closest('.form_field').hasClass('md-select') && jQuery(this).closest('.form_field').hasClass('md-select'))
				jQuery(this).closest('.form_field').find('input.the_value').val(jQuery(this).closest('.form_field').find('input.select-dropdown').val());
			else
				jQuery(this).closest('.form_field').find('input.the_value').val(jQuery(this).find('option:selected').text());	
			}
		);
	
	jQuery(document).on('change','.ui-nex-forms-container select', 
		function()
			{
			if(jQuery(this).attr('data-linked-to-picker')=='linked' || jQuery(this).attr('data-linked-to-picker')=='linked-up'){
				jQuery(this).trigger('nf_reset_datepicker');
				jQuery(this).attr('data-linked-to-picker','linked-up')
			}
			jQuery(this).attr('data-selected',jQuery(this).val());
			if(jQuery(this).closest('.form_field').hasClass('md-select') && jQuery(this).closest('.form_field').hasClass('md-select'))
				jQuery(this).closest('.form_field').find('input.the_value').val(jQuery(this).closest('.form_field').find('input.select-dropdown').val());
			else
				jQuery(this).closest('.form_field').find('input.the_value').val(jQuery(this).find('option:selected').text());	
				
			var checkmin  = (jQuery(this).closest("#field_container").attr('data-min-selection')) ? parseInt(jQuery(this).closest("#field_container").attr('data-min-selection')) : 0;
			var checkmax  = (jQuery(this).closest("#field_container").attr('data-max-selection')) ? parseInt(jQuery(this).closest("#field_container").attr('data-max-selection')) : 0;
				
			if(checkmax)
				{
				
				if(jQuery(this).find('option:selected').length>=checkmax)
					{
					jQuery(this).find('option:not(:selected)').prop('disabled',true);
					jQuery(this).find('option:not(:selected)').addClass('option_disabled');	
					}
				else
					{
					jQuery(this).find('option').prop('disabled',false);
					jQuery(this).find('option').removeClass('option_disabled');
					}
				}	
				
			}
		);
	jQuery(document).on('click','.md-radio-group .radio_check_input label',
		function()
			{
			var input = jQuery(this);
			setTimeout(	function(){
				input.closest('.form_field').find('input.the_value').val(input.html());
			},300);
			
			}
		);
	jQuery(document).on('change','.ui-nex-forms-container input[type="radio"]',
		function()
			{
			if(!jQuery(this).closest('.form_field').hasClass('md-radio-group'))
				jQuery(this).closest('.form_field').find('input.the_value').val(jQuery(this).closest('label').find('.input-label').html());
			}
		);
		
	jQuery(document).on('change','.ui-nex-forms-container input[type="checkbox"]',
		function()
			{
			var selected = '';
				jQuery(this).closest('.form_field').find('.input-inner a').each(function() {
					
					if(jQuery(this).closest('label').find('input').prop('checked'))
						selected +=  jQuery(this).closest('label').find('.input-label').text() + ', ' ;
					
				});
				jQuery(this).closest('.form_field').find('input.the_value').val(selected.replace(/,(?=\s*$)/, ''));
			}
		);
		
		
		jQuery('.radio-group').each(
		function()
			{
			var group = jQuery(this);
			var set_val = '';
			group.find('.radio-inline').each(
			function()
				{
				if(jQuery(this).find('.check-icon').attr('class'))
					{
					var the_check =	jQuery(this).find('input');
					if(the_check.attr('type')=='checkbox')
						{
							jQuery(this).find('input').prop('checked', true);
							jQuery(this).find('input').trigger('change');
						}
					else
						setTimeout(function(){ the_check.closest('label').trigger('click'); }, 120); 
					}
				}
			);
			}
		);
		
		jQuery('.image-choices-field').each(
		function()
			{
			var group = jQuery(this);
			var set_val = '';
			group.find('.image-choices-choice').each(
			function()
				{
				if(jQuery(this).find('.thumb-icon-holder').attr('class'))
					{
					var the_check =	jQuery(this).find('input');
					jQuery(this).find('input').prop('checked', true);
					jQuery(this).find('input').trigger('change');
					
					if(the_check.attr('type')=='checkbox')
						{
						jQuery(this).find('input').prop('checked', true);
						jQuery(this).find('input').trigger('change');
						}
					else
						setTimeout(function(){ the_check.closest('label').trigger('click'); }, 120);
					}
				}
			);
			}
		);
	
	
	
	jQuery('.popover').remove();
	
	var sticky_form_top_height = jQuery('.nf-sticky-contact-form.paddel-top').height();
	
	var set_top_margin = (sticky_form_top_height + sticky_paddel_height+ 3 + jQuery('.nf-sticky-contact-form.paddel-top .panel-heading').height()-15);
	
	
	var diff2 = set_top_margin - 300; 
	
	if(set_top_margin>300)	
		jQuery('.nf-sticky-contact-form.paddel-top .panel').css('overflow-y','scroll').css('height',(300-diff2+sticky_paddel_height+8)+'px');
	
	jQuery(document).on('click','.nf-sticky-contact-form.paddel-top .nf-sticky-paddel',
		function()
			{
			var sticky_form = jQuery(this).closest('.nf-sticky-contact-form');
			if(sticky_form.hasClass('open'))
				{
				sticky_form.removeClass('open');
				sticky_form.animate(
					{
					marginTop:-300
					}
				,300);
				}
			else
				{
				sticky_form.animate(
					{
					marginTop:-4
					}
				,300);
				sticky_form.addClass('open')
				}
			}
		);


(function() {
				// trim polyfill : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
				if (!String.prototype.trim) {
					(function() {
						// Make sure we trim BOM and NBSP
						var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
						String.prototype.trim = function() {
							return this.replace(rtrim, '');
						};
					})();
				}

				[].slice.call( document.querySelectorAll( 'input.input__field, textarea.input__field' ) ).forEach( function( inputEl ) {
					// in case the input is already filled..
					if( inputEl.value.trim() !== '' ) {
						classie.add( inputEl.parentNode, 'input--filled' );
					}

					// events:
					inputEl.addEventListener( 'focus', onInputFocus );
					inputEl.addEventListener( 'blur', onInputBlur );
				} );

				function onInputFocus( ev ) {
					classie.add( ev.target.parentNode, 'input--filled' );
				}

				function onInputBlur( ev ) {
					if( ev.target.value.trim() === '' ) {
						classie.remove( ev.target.parentNode, 'input--filled' );
					}
				}
			})();	
			
	}
);
/* ##################################################################################################################################################### */
/* ############################################################################# ONLOAD END  ########################################################### */
/* ##################################################################################################################################################### */


function IsSafari() {

  var is_safari = navigator.userAgent.toLowerCase().indexOf('safari/') > -1;
 
  if(navigator.userAgent.toLowerCase().indexOf('chrome/') >-1)
  	is_safari = false;
  if(navigator.userAgent.toLowerCase().indexOf('opera/') >-1)
  	is_safari = false;
	
  return is_safari;

}			
	

function isNumber(n) {
   /*if(n!='')
   		{
		n = n.replace(',','');
		return !isNaN(parseFloat(n)) && isFinite(n);
		}*/
	return true;
}
function run_con_action(target,action){
			
	if(action=='show')
		jQuery('#'+target).show();
	if(action=='hide')
		{
		jQuery('#'+target).hide();
		var el     = jQuery('#'+target);
		var newone = el.clone();
		setup_ui_element(newone);
		   
		el.before(newone);
		el.remove();
		}
	if(action=='slideDown')
		jQuery('#'+target).slideDown('slow');
	if(action=='slideUp')
		jQuery('#'+target).slideUp('slow');
	if(action=='fadeIn')
		jQuery('#'+target).fadeIn('slow');
	if(action=='fadeOut')
		jQuery('#'+target).fadeOut('slow');
	
}
function reverse_con_action(target,action){
	if(action=='show')
		{
		jQuery('#'+target).hide();
		var el     = jQuery('#'+target);
		var newone = el.clone();
		setup_ui_element(newone);
		   
		el.before(newone);
		el.remove();
		}
	if(action=='hide')
		jQuery('#'+target).show();
	if(action=='slideDown')
		jQuery('#'+target).slideUp('slow');
	if(action=='slideUp')
		jQuery('#'+target).slideDown('slow');
	if(action=='fadeIn')
		jQuery('#'+target).fadeOut('slow');
	if(action=='fadeOut')
		jQuery('#'+target).fadeIn('slow');
}

function convert_time_to_24h(time){

var hours = Number(time.match(/^(\d+)/)[1]);
var minutes = Number(time.match(/:(\d+)/)[1]);
var AMPM = time.match(/\s(.*)$/)[1];
if(AMPM == "PM" && hours<12) hours = hours+12;
if(AMPM == "AM" && hours==12) hours = hours-12;
var sHours = hours.toString();
var sMinutes = minutes.toString();
if(hours<10) sHours = "0" + sHours;
if(minutes<10) sMinutes = "0" + sMinutes;
return sHours + ":" + sMinutes;

	
}



function setup_ui_element(obj){
	
	var save_form_progres = obj.closest('.ui-nex-forms-container').find('#nf_save_form_progress').text();
	
	
	if(save_form_progres && save_form_progres=='true')
		{
			obj.find('input[type="text"]').inputStore(
				{
				expire: 120,
				name: obj.find('input').attr("name")
				}
			);
			obj.find('input[type="radio"]').inputStore(
				{
				expire: 120,
				name: obj.find('input').attr("name")
				}
			);
			obj.find('input[type="checkbox"]').inputStore(
				{
				expire: 120,
				name: obj.find('input').attr("name")
				}
			);
			obj.find('textarea').inputStore(
				{
				expire: 120,
				name: obj.find('textarea').attr("name")
				}
			);
			
			obj.find('select').inputStore(
				{
				expire: 120,
				name: obj.find('select').attr("name")
				}
			);
		}
	
	jQuery('div.ui-nex-forms-container').find('.customcon').each(
		function()
			{
			if(obj.attr('id')==jQuery(this).attr('data-target') && (jQuery(this).attr('data-action')=='show' || jQuery(this).attr('data-action')=='slideDown' || jQuery(this).attr('data-action')=='fadeIn'))
				jQuery('div.ui-nex-forms-container #'+obj.attr('id')).hide();
			}
	);
	
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
	if(obj.hasClass('jq-datepicker'))
		{
		obj.addClass('date');
		obj.removeClass('jq-datepicker');
		}
	if(obj.hasClass('jq-time-picker'))
		{
		obj.addClass('time');
		obj.removeClass('jq-time-picker');
		}
	
	
	if((obj.hasClass('date') || obj.hasClass('md-datepicker')) )
		{
		obj.find('input').attr('autocomplete','off');
		var enabled_days = obj.find('#datetimepicker').attr('data-enabled-days');
		if(enabled_days)
			var enabled_days_array = enabled_days.split(',')
			
		var disabled_dates = obj.find('#datetimepicker').attr('data-disabled-dates');
		if(disabled_dates){
			var get_todays_date =  new Date();
			var disabled_dates_array = disabled_dates.split(',')
			
			
			var set_disabled_dates_array = new Array();
			for (var i = 0; i < disabled_dates_array.length; i++) {
			  if(strstr(disabled_dates_array[i],'today') || strstr(disabled_dates_array[i],'link'))
			  	{
				var the_form = obj.closest('form');
				var str = disabled_dates_array[i];
				var reg = /\{{2}(.*?)\}{2}/g;
				if(reg)
					var found_reg = str.match(reg);
				var get_field_name = '';
				var set_field_name = '';
				var the_input = '';
				
				if(found_reg)
					{
					var arrayLength = found_reg.length;
					for (var k = 0; k < arrayLength; k++) 
						{
						get_field_name = found_reg[k].replace('{{','').replace('}}','')
						the_input = the_form.find('[name="'+ get_field_name +'"]');
						if(the_input.attr('type')=='radio')
							set_field_name = the_form.find('[name="'+ get_field_name +'"]:checked').val();
						else if(the_input.attr('type')=='checkbox')
							{
							if(the_input.prop('checked'))
								{
								set_field_name =  the_input.closest('.form_field').find('input.the_value').val();
								}
							else
								set_field_name =  '';
							}
						else
							{
							set_field_name = the_form.find('[name="'+ get_field_name +'"]').val();
							}
							if(!the_input.attr('data-linked-to-picker'))
								the_input.attr('data-linked-to-picker','linked')
								
							if(the_input.attr('data-linked-to-picker')!='linked-up'){	
								the_input.on('nf_reset_datepicker', function(){
									
									obj.find('#datetimepicker').datetimepicker('destroy');
									obj.find('.bootstrap-datetimepicker-widget').remove();
									//setTimeout(function(){
										setup_ui_element(jQuery(obj));
										obj.find('.bootstrap-datetimepicker-widget').last().remove();
									//}
									//,200);
								});
							
							}
							
							if(the_input.closest('.form_field').hasClass('date'))
								{
								if(strstr(disabled_dates_array[i],'link'))
									{
									var get_link_date =   moment(set_field_name, the_input.closest('#datetimepicker').attr('data-format'));
									get_todays_date =new Date(moment(get_link_date).year(),moment(get_link_date).month(),moment(get_link_date).date());
									}
								}
							
								str = str.replace(found_reg[k], set_field_name);
								
						}
					}
				
				
				var re = /\[{1}(.*?)\]{1}/g;
				if(re)
					var found = str.match(re);
				
				if(found)
					{
					var get_extra_days = found[0].replace(']','').replace('[','')	;
					var leading_zero = '';
					
					if((get_todays_date.getMonth()+1)<10)
						leading_zero = '0';
					
					for (var j = 0; j <=get_extra_days; j++)
						{
						set_disabled_dates_array[i+j] = get_todays_date.getFullYear() + '/'+ leading_zero + (get_todays_date.getMonth()+1) + '/' + (get_todays_date.getDate()+j);
						}
					}
				else
					{
					set_disabled_dates_array[i] = get_todays_date.getFullYear() + '/'+ leading_zero + (get_todays_date.getMonth()+1) + '/' + get_todays_date.getDate();	
					}
				}
			  else
			  	set_disabled_dates_array[i] = disabled_dates_array[i];
			}
						
		}
		
		var get_current_date =  new Date();
		var set_leading_zero = '';
		if((get_current_date.getMonth()+1)<10)
			set_leading_zero = '0';
			
		var set_current_date = get_current_date.getFullYear() + '/'+ set_leading_zero + (get_current_date.getMonth()+1) + '/' + (get_current_date.getDate())
		
		
		var set_format = (obj.find('#datetimepicker').attr('data-format')) ? obj.find('#datetimepicker').attr('data-format') : 'MM/DD/YYYY';	
		var set_min_date = (obj.find('#datetimepicker').attr('data-min-date')) ? obj.find('#datetimepicker').attr('data-min-date') : ((obj.find('#datetimepicker').attr('data-disable-past-dates')=='1') ? set_current_date : false);	
		var set_max_date = (obj.find('#datetimepicker').attr('data-max-date')) ? obj.find('#datetimepicker').attr('data-max-date') : false;
		var use_current = (obj.find('#datetimepicker').attr('data-inline')=='true' && !obj.hasClass('required')) ? true : false;
		if(set_min_date)
			{
				
			var reg = /\{{2}(.*?)\}{2}/g;
				if(reg)
					var found = set_min_date.match(reg);
				
				if(found)
					{
					var the_form = obj.closest('form');
					var get_field_name = found[0].replace('{{','').replace('}}','')
					var the_input = the_form.find('[name="'+ get_field_name +'"]');
					the_form.find('[name="'+ get_field_name +'"]').closest('#datetimepicker').attr('data-link-min-date',obj.find('input').attr('name'))
					if(the_input.val())
						set_min_date = moment(the_input.val(),set_format);
					else
						set_min_date = false;
					}
				
			}
		
		
		
		if(set_max_date)
			{
				
			var reg = /\{{2}(.*?)\}{2}/g;
				if(reg)
					var found = set_max_date.match(reg);
				
				if(found)
					{
					var the_form = obj.closest('form');
					var get_field_name = found[0].replace('{{','').replace('}}','')
					var the_input = the_form.find('[name="'+ get_field_name +'"]');
					the_form.find('[name="'+ get_field_name +'"]').closest('#datetimepicker').attr('data-link-max-date',obj.find('input').attr('name'))
					set_max_date = false;
					}
				
			}
		
		obj.find('#datetimepicker').datetimepicker( 
				{
				useCurrent: use_current,
				allowInputToggle:true,
				disabledDates: (set_disabled_dates_array) ? set_disabled_dates_array : [],
				keepOpen:(obj.find('#datetimepicker').attr('data-keep-open')=='true') ? true : false,
				widgetPositioning: {vertical: (obj.find('#datetimepicker').attr('data-position')) ? obj.find('#datetimepicker').attr('data-position') : 'bottom', horizontal:'auto'},
				inline:(obj.find('#datetimepicker').attr('data-inline')=='true') ? true : false,
				minDate: set_min_date,
				maxDate: (set_max_date) ? set_max_date : false,
				format: set_format,
				locale: (obj.find('#datetimepicker').attr('data-language')) ? obj.find('#datetimepicker').attr('data-language') : 'en',
				defaultDate: (obj.find('input').attr('data-value')=='now') ? 'now' : '',
				viewMode: (obj.find('#datetimepicker').attr('data-viewMode')) ? obj.find('#datetimepicker').attr('data-viewMode') : 'days',
				daysOfWeekDisabled: (enabled_days_array) ? enabled_days_array : []
				} 
			);	
		}	
		
	if((obj.hasClass('time') || obj.hasClass('md-time-picker')) )
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
			
		obj.find('#datetimepicker input').datetimepicker(
				{
				useCurrent:(obj.find('#datetimepicker').attr('data-inline')=='true') ? true : false,
				allowInputToggle:true,
				widgetPositioning: {vertical: (obj.find('#datetimepicker').attr('data-position')) ? obj.find('#datetimepicker').attr('data-position') : 'bottom', horizontal:'auto'},
				inline:(obj.find('#datetimepicker').attr('data-inline')=='true') ? true : false,
				format:'HH:mm', 

				defaultDate: date,
				locale:(obj.find('#datetimepicker').attr('data-language')) ? obj.find('#datetimepicker').attr('data-language') : 'en',
				stepping: (obj.find('#datetimepicker').attr('data-stepping')) ? obj.find('#datetimepicker').attr('data-stepping') : 5,
				enabledHours: (enabled_hours_array) ? enabled_hours_array : [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,0]
				}
			);
		}
	
	
	
	/*if(obj.hasClass('select') || obj.hasClass('multi-select'))
		{
		obj.find('select').select2({
			width: '100%'	
		});
		}
	*/
	
	if(obj.hasClass('icon-select-group'))
		{
		obj.find('.the-icon-field-container').removeAttr('name');
		}
	
	if(obj.hasClass('paragraph') || obj.hasClass('heading') || obj.hasClass('html') || obj.hasClass('math_logic'))
		{
		if(obj.find('.the_input_element').attr('data-original-math-equation')!='')
			{
			var text = obj.find('.the_input_element').html();
			if(text && strstr(text,'{math_result}'))
				{
				var set_text = text.replace('{math_result}','<span class="math_result">0</span>');
				obj.find('.the_input_element').html(set_text);
				}
		
			set_up_math_logic(obj.find('.the_input_element'));
			set_up_math_logic(obj.find('.set_math_result'));
			run_math_logic(obj.find('.the_input_element'),true)
			}
		}
	if(obj.hasClass('digital-signature'))
		{
		obj.find('.js-signature').jqSignature();
		}
	
	if(obj.hasClass('field-replication-enabled'))
		{
		if(!strstr(obj.find('.the_input_element').attr('name'),'['))
			obj.find('.the_input_element').attr('name',obj.find('.the_input_element').attr('name')+'[]');	
		}
	if(obj.hasClass('text') || obj.hasClass('textarea'))
		{
			if(obj.find('.the_input_element').attr('data-default-value')!='')
				obj.find('.the_input_element').val(obj.find('.the_input_element').attr('data-default-value'));
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
	
	if(obj.hasClass('touch_spinner'))
		{
		var the_spinner = obj.find(".the_spinner");
		the_spinner.TouchSpin({
			verticalbuttons: (the_spinner.attr('data-verticalbuttons')=='true') ? true : false,
			initval: parseFloat(the_spinner.attr('data-starting-value')),
			min:  parseFloat(the_spinner.attr('data-minimum')),
			max:  parseFloat(the_spinner.attr('data-maximum')),
			step:  parseFloat(the_spinner.attr('data-step')),
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
		/*if(obj.closest('.ui-nex-forms-container').hasClass('ui-nex-forms-container-fe'))
			alert('test');
		else
			alert('test2');*/
		var count_text = obj.find( "#slider" ).attr('data-starting-value');
		var the_slider = obj.find( "#slider" )
		var set_min = the_slider.attr('data-min-value');
		var set_max = the_slider.attr('data-max-value')
		var set_start = the_slider.attr('data-starting-value');
		var set_step = the_slider.attr('data-step-value')

		obj.find( "#slider" ).slider({
				range: "min",
				min: parseFloat(set_min),
				max: parseFloat(set_max),
				value: parseFloat(set_start),
				step: parseFloat(set_step),
				slide: function( event, ui ) {	
					if(nf_isFloat(set_step))
						{
						var get_step = set_step;
						get_step = get_step.split('.');
						var decimal_places = get_step[1].length;
						obj.find('.count-text').html(the_slider.attr('data-count-text').replace('{x}',parseFloat(ui.value).format(decimal_places)));
						}
					else
						{
						obj.find('.count-text').html(the_slider.attr('data-count-text').replace('{x}',parseFloat(ui.value).format(0)));
						}
					obj.find( 'input' ).val(ui.value);
					obj.find( 'input' ).trigger('change');
				},
				create: function( event, ui ) {	
					count_text = '<span class="count-text">'+ the_slider.attr('data-count-text').replace('{x}',((set_start) ? set_start : set_min)) +'</span>';	
					the_slider.find( '.ui-slider-handle' ).html( '<span id="icon" class="'+ the_slider.attr('data-dragicon') +'"></span> '+ count_text).addClass(the_slider.attr('data-dragicon-class')).removeClass('ui-state-default');
					obj.find( 'input' ).val(parseFloat(set_start));
					obj.find( 'input' ).trigger('change');
					var handle = the_slider.find( '.ui-slider-handle' );
					handle.removeClass('btn').removeClass('btn-default');
					
					handle.css('background',the_slider.attr('data-handel-background-color'))
					handle.css('border-color',the_slider.attr('data-handel-border-color'))
					handle.css('color',the_slider.attr('data-text-color'))
					
					the_slider.find('.ui-slider-range').css('background',(the_slider.attr('data-fill-color')) == '#f2f2f2' ? '#ddd' : the_slider.attr('data-fill-color'));
					
				}
				
			});
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
		  starHalf      : (obj.find('#star').attr('data-starHalf')) ? obj.find('#star').attr('data-starHalf') : 'fa fa-star-half ',
		  starOff       : (obj.find('#star').attr('data-starOff')) ? obj.find('#star').attr('data-starOff') + ' set_animation_fast' : 'fa fa-star-o set_animation_fast ',
		  starOn        : (obj.find('#star').attr('data-starOn')) ? obj.find('#star').attr('data-starOn') + '  set_animation_fast' : 'fa fa-star set_animation_fast', 
		  styleHalf     : (obj.find('#star').attr('data-stylehalf')) ? obj.find('#star').attr('data-stylehalf') : '#ec971f',
		  styleOff      : (obj.find('#star').attr('data-styleoff')) ? obj.find('#star').attr('data-styleoff') : '#bbb',

		  styleOn       : (obj.find('#star').attr('data-styleon')) ? obj.find('#star').attr('data-styleon') : '#ec971f',
		  size        	: (obj.find('#star').attr('data-size')) ? obj.find('#star').attr('data-size') : '25'
		});
		
		obj.find('#star input').attr('name', obj.find('#star').attr('data-input-name'));
		

		
		
		}
	
	if(obj.hasClass('email'))
		{
		}
	if(obj.hasClass('tags'))
		{	
		
		if(obj.find('.input-group').attr('class'))
			{
			var the_tag_input = obj.find('input.tags');
			var the_tag_input_clone = the_tag_input.detach();
			if(obj.find('.input-group-addon').hasClass('postfix'))
				the_tag_input.insertBefore(obj.find('.input-group-addon'));
			else
				the_tag_input.insertAfter(obj.find('.input-group-addon'));
			}
		else
			var the_tag_input = obj.find('input.tags');
		
		
			
		 the_tag_input.tagsinput( {maxTags: (the_tag_input.attr('data-max-tags')) ? the_tag_input.attr('data-max-tags') : '' });
		 
		obj.find('.bootstrap-tagsinput input').css('color',the_tag_input.attr('data-text-color'));
		obj.find('.bootstrap-tagsinput').css('border-color',the_tag_input.attr('data-border-color'));
		obj.find('.bootstrap-tagsinput').css('background-color',the_tag_input.attr('data-background-color'));
		obj.find('.bootstrap-tagsinput').addClass('error_message').addClass('the_input_element');
		obj.find('.bootstrap-tagsinput').addClass('form-control');
		obj.find(".bootstrap-tagsinput").attr('data-placement',the_tag_input.attr('data-placement'));
		obj.find(".bootstrap-tagsinput").attr('data-error-class',the_tag_input.attr('data-error-class'));
		obj.find(".bootstrap-tagsinput").attr('data-content',the_tag_input.attr('data-content'));
		
		obj.find('input').removeClass('the_input_element');
		obj.find('input').addClass('tags_input');
		
		}
	
	
		
	if(obj.hasClass('autocomplete'))
		{
		var items = obj.find('div.get_auto_complete_items').text();
		if(strstr(items, ','))
			items =	items.split(',');
		else
			items =	items.split('\n');
			
		obj.find(".the_input_element").autocomplete({
			source: items
			});	
		}
		
		
	
	if(jQuery('.field_'+obj.attr('id')).attr('data-target'))
		{
		obj.find('input[type="text"]').addClass('has_con');
		obj.find('input[type="hidden"]').addClass('has_con');
		obj.find('textarea').addClass('has_con');
		obj.find('select').addClass('has_con');
		obj.find('input[type="radio"]').addClass('has_con');
		}
	
}
function format_illegal_chars(input_value){
	if(!input_value)
		return;
	
	input_value = input_value.toLowerCase();
	if(input_value=='name' || input_value=='page' || input_value=='post' || input_value=='id')
		input_value = '_'+input_value;
		
	var illigal_chars = '-+=!@#$%^&*()*{}[]:;<>,.?~`|/\'';
	
	var new_value ='';
	
    for(var i=0;i<input_value.length;i++)
		{
		if (illigal_chars.indexOf(input_value.charAt(i)) != -1)
			{
			input_value.replace(input_value.charAt(i),'');
			}
		else
			{
			if(input_value.charAt(i)==' ')

			new_value += '_';
			else
			new_value += input_value.charAt(i);
			}
		}
	return new_value;	
}


function colorToHex(color) {
	if(!color)
		return;
	
    if (color.substr(0, 1) === '#') {
        return color;
    }
    var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);
    if(!digits)
		return '#FFF';
	
    var red = parseInt(digits[2]);
    var green = parseInt(digits[3]);
    var blue = parseInt(digits[4]);
    
    var rgb = blue | (green << 8) | (red << 16);
    return digits[1] + '#' + rgb.toString(16);
};

function strstr(haystack, needle, bool) {
    var pos = 0;

    haystack += "";
    pos = haystack.indexOf(needle); if (pos == -1) {
       return false;
    } else {
       return true;
    }
}

function nf_str_to_lower(str) {
   
   if(str)
	str = str.toLowerCase();
    
	return str;
    
}


function show_nf_error(obj, error){
	obj.addClass('nf-has-error');
	obj.find('.success_msg').remove();
	var extra_padding = '';
	var input_lg = '';
	
	if(obj.hasClass('appendix_field'))
		{
			
		}
	else
		{
		if(!obj.find('.error_msg').attr('class'))
			{
			if(obj.hasClass('md-select'))
				{
				if(obj.find('i.material-icons').attr('class'))
					obj.find('.select-wrapper').parent().append('<div class="error_msg indent fadeInRight animated">'+ error +'</div>');
				else
					obj.find('.select-wrapper').parent().append('<div class="error_msg fadeInRight animated">'+ error +'</div>');
				}
			else
				{
				if(obj.find('.error_message').hasClass('input-lg'))
					input_lg='input_large';
				
				if(!obj.find('.input-group-addon').hasClass('prefix'))
					extra_padding='extra_padding';
				
				if(obj.find('i.material-icons').attr('class'))
					obj.find('.error_message').parent().after('<div class="error_msg indent fadeInRight animated">'+ error +'</div>');
				else
					{
					if(!obj.hasClass('material_field'))
						{
						if(obj.hasClass('classic_error_style'))
							{
							if(obj.hasClass('error_left'))
							obj.find('.error_message').parent().after('<div class="error_msg indent fadeInLeft animated">'+ error +'</div>');
							else
								obj.find('.error_message').parent().after('<div class="error_msg indent fadeInRight animated">'+ error +'</div>');
							}
						else
							obj.find('.error_message').parent().after('<div data-toggle="tooltip" data-title="'+ error +'" title="'+ error +'" class="error_msg modern '+ input_lg +' '+ extra_padding +'"><i class="fa fa-info-circle"></i></div></div>');
					
						
						}
					
					}
				
				
				
				jQuery('.appendix_field .error_msg').remove();
				obj.removeClass('has_success');
				obj.addClass('has_error');
				}
			jQuery('.error_msg[data-toggle="tooltip"]').tooltip_bs(); 
			}
		}
}

function hide_nf_error(obj){

	if(!obj.hasClass('has_error'))
		return;

	
	obj.removeClass('nf-has-error');
	obj.removeClass('has_error');
	
	obj.find('.input_container').removeClass('animated2').removeClass('shake');
	var extra_padding = '';
	var input_lg = '';
	if(!obj.find('.success_msg').attr('class'))
		{
			
		if(obj.find('.error_message').hasClass('input-lg'))
			input_lg='input_large';
			
		if(!obj.find('.input-group-addon').hasClass('prefix'))
			extra_padding='extra_padding';
		
		if(!obj.hasClass('radio-group') && !obj.hasClass('check-group') && !obj.hasClass('multi-image-select-group') && !obj.hasClass('single-image-select-group'))
			obj.find('.error_message').parent().after('<div class="success_msg modern '+ input_lg +' '+ extra_padding +' "><i class="fa fa-check"></i></div>');	
		
		
		obj.find('.error_msg').remove();
		
		obj.addClass('has_success');
		
		obj.find('.success_msg.modern').addClass('animated').addClass('bounceIn');
		
		jQuery('.appendix_field .success_msg').remove();
		
		setTimeout(function(){ obj.removeClass('has_success'); obj.find('.success_msg').hide(); },1750);
		}
}

function nf_get_total_steps(the_form){
	
	return the_form.find('.step').length;
}

function nf_replace_tags(the_form,obj){
	var str = obj.html();
	if(!str)
		return;
	var re = /\{{2}(.*?)\}{2}/g;
	if(re)
		var found = str.match(re);
	var get_field_name = '';
	var set_field_name = '';
	var the_input = '';
	
	if(obj.hasClass('date'))
		return;
		
	if(found)
		{
		var arrayLength = found.length;
		for (var i = 0; i < arrayLength; i++) 
			{
			get_field_name = found[i].replace('{{','').replace('}}','')
			the_input = the_form.find('[name="'+ get_field_name +'"]');
			if(the_input.attr('type')=='radio')
				set_field_name = the_form.find('[name="'+ get_field_name +'"]:checked').val();
			else if(the_input.attr('type')=='checkbox')
				{
				if(the_input.prop('checked'))
					{
					set_field_name =  the_input.closest('.form_field').find('input.the_value').val();
					}
				else
					set_field_name =  '';
				}
			else 
				set_field_name = the_form.find('[name="'+ get_field_name +'"]').val();
				
			if(set_field_name!='0' && set_field_name!='undefined')
				obj.html(obj.html().replace(found[i], '<span data-field-name="'+ get_field_name+'">' + set_field_name +'</span>' ));
			else	
				obj.html(obj.html().replace(found[i], '' ));
			}
		}
	else
		{
		var is_span = obj.find('span');
		if(is_span)
			{
			is_span.each(
				function()
					{
					get_field_name = jQuery(this).attr('data-field-name');
					if(get_field_name)
						{
						the_input = the_form.find('[name="'+ get_field_name +'"]');
						if(the_input.attr('type')=='radio')
							set_field_name = the_form.find('[name="'+ get_field_name +'"]:checked').val();
						else if(the_input.attr('type')=='checkbox')
							{
							if(the_input.prop('checked'))
								{
								set_field_name =  the_input.closest('.form_field').find('input.the_value').val()
								}
							else
								set_field_name =  '';
							}
						else 
							set_field_name = the_form.find('[name="'+ get_field_name +'"]').val();
						
						if(set_field_name!='0' && set_field_name!='undefined')	
							jQuery(this).html(set_field_name);
						else
							jQuery(this).html('');
						}
					}
				);
			}
		}
}

var file_inputs= new Array();
var file_ext= new Array();
jQuery(document).ready(
function ()
	{
	
	
	jQuery('.step input').on('keypress', function (e) {
		 if(e.which === 13){
			 e.preventDefault();
			 if(jQuery(this).closest('.step').find('.nex-step'))
            	jQuery(this).closest('.step').find('.nex-step').trigger('click');
			 if(jQuery(this).closest('.step').find('.nex-submit'))
            	jQuery(this).closest('.step').find('.nex-submit').trigger('click');
         }
   });
	

	jQuery(document).on('change','#nex-forms select',
		function()
			{
				var the_select = jQuery(this);
				if(	jQuery(this).closest('.form_field').hasClass('required'))
					{
					if(jQuery(this).val() == 0 || jQuery(this).val()==jQuery(this).attr('data-default-selected-value'))
						{
						if(jQuery(this).closest('.form_field').hasClass('md-select'))
							show_nf_error(jQuery(this).closest('.form_field'),jQuery(this).closest('.form_field').find('select.error_message').attr('data-content'))
						else
							show_nf_error(jQuery(this).closest('.form_field'),jQuery(this).closest('.form_field').find('.error_message').attr('data-content'))
						
						//settings.errors++;
						}
					 else
						{
						hide_nf_error(jQuery(this).closest('.form_field'));
						}
					}
				
			//AUTO STEP
			
			if(the_select.closest('.step').hasClass('auto-step'))
				{
					
					if(the_select.closest('.step').hasClass('last_step'))
						{
						setTimeout(function()
							{
							the_select.closest('form').submit();
							},500);	
						}
					else
						{
						setTimeout(function()
								{
								the_select.closest('.step').find('.nex-step').trigger('click');	
								},300
							)
						}
				}
					
					
			
			}
		);
		
	jQuery(document).on('blur','#nex-forms select',
		function()
			{
				
				if(	jQuery(this).closest('.form_field').hasClass('required'))
					{
					if(jQuery(this).val() == 0 || jQuery(this).val()==jQuery(this).attr('data-default-selected-value'))
						{
						if(jQuery(this).closest('.form_field').hasClass('md-select'))
							show_nf_error(jQuery(this).closest('.form_field'),jQuery(this).closest('.form_field').find('select.error_message').attr('data-content'))
						else
							show_nf_error(jQuery(this).closest('.form_field'),jQuery(this).closest('.form_field').find('.error_message').attr('data-content'))
						}
					 else
						{
						hide_nf_error(jQuery(this).closest('.form_field'));
						}
					}
			}
		);
	
	

	jQuery(document).on('blur','input.email',
		function()
			{
			if(!IsValidEmail(jQuery(this).val()) && jQuery(this).val()!='')
				{
				show_nf_error(jQuery(this).closest('.form_field'),jQuery(this).attr('data-secondary-message'));
				}
			else if(jQuery(this).hasClass('required') && jQuery(this).val()=='')
				show_nf_error(jQuery(this).closest('.form_field'),jQuery(this).attr('data-content'));
			else
				hide_nf_error(jQuery(this).closest('.form_field'));
			}
		);
	jQuery(document).on('blur','input.phone_number',
		function()
			{
			if(!allowedChars(jQuery(this).val(), 'tel') && jQuery(this).val()!='')
				{
				show_nf_error(jQuery(this).closest('.form_field'),jQuery(this).attr('data-secondary-message'));
				}
			else if(jQuery(this).hasClass('required') && jQuery(this).val()=='')
				show_nf_error(jQuery(this).closest('.form_field'),jQuery(this).attr('data-content'));
			else
				hide_nf_error(jQuery(this).closest('.form_field'));
			}
		);
		
	jQuery(document).on('blur','input.numbers_only',
		function()
			{
			//if(!isNumber(jQuery(this).val()) && jQuery(this).val()!='')
				//{
				//show_nf_error(jQuery(this).closest('.form_field'),jQuery(this).attr('data-secondary-message'));
				//}
			if(jQuery(this).hasClass('required') && jQuery(this).val()=='')
				show_nf_error(jQuery(this).closest('.form_field'),jQuery(this).attr('data-content'));
			else
				hide_nf_error(jQuery(this).closest('.form_field'));
			}
		);
	
	jQuery(document).on('blur','input.text_only',
		function()
			{
			if(!allowedChars(jQuery(this).val(), 'text') && jQuery(this).val()!='') {
				show_nf_error(jQuery(this).closest('.form_field'),jQuery(this).attr('data-secondary-message'));
				}
			else if(jQuery(this).hasClass('required') && jQuery(this).val()=='')
				show_nf_error(jQuery(this).closest('.form_field'),jQuery(this).attr('data-content'));
			else
				hide_nf_error(jQuery(this).closest('.form_field'));
			}
		);
	
	jQuery(document).on('blur','input.url',
		function()
			{
			if(!validate_url(jQuery(this).val()) && jQuery(this).val()!='') {
				show_nf_error(jQuery(this).closest('.form_field'),jQuery(this).attr('data-secondary-message'));
				}
			else if(jQuery(this).hasClass('required') && jQuery(this).val()=='')
				show_nf_error(jQuery(this).closest('.form_field'),jQuery(this).attr('data-content'));
			else
				hide_nf_error(jQuery(this).closest('.form_field'));
			}
		);
	
	
	
	jQuery(document).on('blur','input[type="text"].required, input[type="password"].required, textarea.required',
		function()
			{
			if(
			!jQuery(this).hasClass('email') 
			&& !jQuery(this).hasClass('phone_number') 
			&& !jQuery(this).hasClass('numbers_only')
			&& !jQuery(this).hasClass('text_only')
			&& !jQuery(this).hasClass('url'))
			{
			
			if(jQuery(this).val()=='')
				{
				show_nf_error(jQuery(this).closest('.form_field'),jQuery(this).attr('data-content'));
				}
			else
				hide_nf_error(jQuery(this).closest('.form_field'));
			}
			}
			
		);
	
	jQuery(document).on('blur','input[type="text"].required, input[type="password"].required, textarea.required',
		function()
			{
			if(
			!jQuery(this).hasClass('email') 
			&& !jQuery(this).hasClass('phone_number') 
			&& !jQuery(this).hasClass('numbers_only')
			&& !jQuery(this).hasClass('text_only')
			&& !jQuery(this).hasClass('url'))
			{
			if(jQuery(this).val()=='')
				{
				show_nf_error(jQuery(this).closest('.form_field'),jQuery(this).attr('data-content'));
				}
			else
				hide_nf_error(jQuery(this).closest('.form_field'));
			}
			}
		);

	jQuery(document).on('click','#star .fa', 
			function(e)
				{
				hide_nf_error(jQuery(this).closest('.form_field'));
				}
			);
	jQuery(document).on('change','select',
			function(e)
				{
				hide_nf_error(jQuery(this).closest('.form_field'));
				}
			);
	jQuery(document).on('change','input.the_slider',
		function()
			{
			hide_nf_error(jQuery(this).closest('.form_field'));
			}
		);
	jQuery(document).on('click','.bootstrap-touchspin .btn',
		function()
			{
			hide_nf_error(jQuery(this).closest('.form_field'));
			}
		);
	jQuery(document).on('change','.tags_input',
		function()
			{
			hide_nf_error(jQuery(this).closest('.form_field'));
			}
		);
	jQuery('input#selected-color').blur(
		function()
			{
			hide_nf_error(jQuery(this).closest('.form_field'));
			}
		);

	
	
	
	function nf_go_to_step(container, go_to_step, current_step_container, last_visited_step, direction){
				
				
				var the_form_tag = container.find('form');
				var the_form = container.find('.ui-nex-forms-container');
				var jump_to_step = (go_to_step-1);
				
				var to_step = the_form.find('.step:eq('+ (jump_to_step) +')');
				
				var current_step_num = parseInt(container.find('.current_step').text());
				var last_step_num = parseInt(container.find('.last_visited_step').text())
				
				if(direction=='back')
					{
					if(!to_step.hasClass('validated'))
						{
						jump_to_step = jump_to_step-1;
						//if(go_to_step<parseInt(container.find('.current_step').text()))
						//	jump_to_step = jump_to_step+1;
						
						var get_valid_step = container.find('div.nf_ms_breadcrumb ul').find('li.current').prevAll('li.visited.validated').first();
						
						if(get_valid_step)
							{
							//console.log('found')
							get_valid_step.trigger('click')
							}
						//else
							//console.log('not found')
						
						
						
						
						return //nf_go_to_step(container, jump_to_step, current_step_container, last_visited_step);
						}
					}
					
					
					
				if(!last_visited_step)
					last_visited_step = parseInt(container.find('.current_step').text());
				
				container.find('.last_visited_step').text(last_visited_step);
				container.find('.current_step').text(go_to_step);
				

				container.find('input[name="ms_current_step"]').val(go_to_step);
				setTimeout(function() {container.find('input[name="ms_current_step"]').trigger('change')},400);
				
				
				
				var step_in_transition = (the_form.find('.step_transition_in').text()) ? the_form.find('.step_transition_in').text() : 'fadeIn';
				var step_out_transition = (the_form.find('.step_transition_out').text()) ? the_form.find('.step_transition_out').text() : 'fadeOut';

				
				
				the_form_tag.css('min-height',to_step.outerHeight()+'px')
				current_step_container.addClass('animated').addClass(step_out_transition);
				
				
				var set_total_steps = parseInt(nf_get_total_steps(the_form));
				var get_percentage = Math.round(100/(set_total_steps));
				var set_percentage = parseInt(get_percentage*(jump_to_step));
				
				if(set_percentage>=100)
					{
					container.find('div.nf_ms_breadcrumb .nf_progressbar_percentage').css('width','100%');
					container.find('div.nf_ms_breadcrumb .nf_progressbar_percentage span').text('100%');	
					container.find('div.nf_ms_breadcrumb .nf_progressbar_percentage').addClass('total_percent');
					container.find('div.nf_step_breadcrumb .nf_progressbar_percentage').css('width','100%');
					container.find('div.nf_step_breadcrumb .nf_progressbar_percentage span').text('100%');	
					container.find('div.nf_step_breadcrumb .nf_progressbar_percentage').addClass('total_percent');
					}
				else if(set_percentage<=0)
					{
					container.find('div.nf_ms_breadcrumb .nf_progressbar_percentage').css('width','5%');
					container.find('div.nf_ms_breadcrumb .nf_progressbar_percentage span').text('0%');	
					container.find('div.nf_step_breadcrumb .nf_progressbar_percentage').css('width','5%');
					container.find('div.nf_step_breadcrumb .nf_progressbar_percentage span').text('0%');	
					}
				else
					{
					container.find('div.nf_ms_breadcrumb .nf_progressbar_percentage').css('width',(set_percentage)+'%');
					container.find('div.nf_ms_breadcrumb .nf_progressbar_percentage span').text((set_percentage)+'%');
					container.find('div.nf_ms_breadcrumb .nf_progressbar_percentage').removeClass('total_percent');
					container.find('div.nf_step_breadcrumb .nf_progressbar_percentage').css('width',(set_percentage)+'%');
					container.find('div.nf_step_breadcrumb .nf_progressbar_percentage span').text((set_percentage)+'%');
					container.find('div.nf_step_breadcrumb .nf_progressbar_percentage').removeClass('total_percent');	
					}
				
				
				container.find('div.nf_ms_breadcrumb ul').find('li').removeClass('current');
				container.find('div.nf_ms_breadcrumb ul').find('li:eq('+ (jump_to_step) +')').addClass('current');
				
				container.find('div.nf_step_breadcrumb ol').find('li').removeClass('current');
				container.find('div.nf_step_breadcrumb ol').find('li:eq('+ (jump_to_step) +')').addClass('current');
				
				
				
				for(var i=jump_to_step;i>0;i--)
					{
					container.find('div.nf_ms_breadcrumb ul').find('li:eq('+ (i-1) +')').addClass('visited');
					container.find('div.nf_step_breadcrumb ol').find('li:eq('+ (i-1) +')').addClass('visited');
					
					container.find('.step:eq('+ (i-1) +')').addClass('step_visited');
					
					}
				
				container.find('div.nf_ms_breadcrumb ul .current').removeClass('visited');
				
				container.find('div.nf_ms_breadcrumb ul li.visited:not(.validated)').removeClass('visited');
				
				container.find('div.nf_step_breadcrumb ol .current').removeClass('visited');
				
				
				
				//container.find('div.nf_ms_breadcrumb ul .validated:not(.current)').addClass('visited');
				
				
				to_step.find('.form_field').each(
					function()
						{
						run_nf_reanimate(jQuery(this));
						}
					);
				
				to_step.find('.html_fields').each(
					function()
						{
						nf_replace_tags(the_form,jQuery(this));
						}
					);
				
				
				var get_container = container.find('.ui-nex-forms-container');
				var has_time_limit = (get_container.hasClass('has_time_limit')) ? true : false;
				var timer_type = (get_container.hasClass('timer_overall')) ? 'overall' : 'per_step';
				var get_step_time_limit = to_step.attr('data-step-time-limit');
				
				var started = (get_container.attr('data-timer-started')=='true') ? true : false;
				var ended = (get_container.attr('data-timer-ended')=='true') ? true : false;
				
				var timer = get_container.find('.nf-timer');
				
				//console.log(started);
				
				if(get_step_time_limit)
					var set_time_limit = (get_step_time_limit) ? parseInt(get_step_time_limit) : false;
				
				if(timer_type=='per_step' && has_time_limit && ended==false)
					nf_timer_rebuild('ui',timer, true, timer_type, set_time_limit);
				
				
				
				setTimeout(function() { current_step_container.hide()},301);
				setTimeout(function() { current_step_container.removeClass('animated').removeClass(step_out_transition) },1000)
				
				setTimeout(function() { 
					the_form.find('.step').hide();
					the_form.find('.step').removeClass('animated').removeClass(step_out_transition);
					to_step.addClass('animated').addClass(step_in_transition).show(); 
					
				},300);
				setTimeout(function() { 
					
					to_step.removeClass('animated').removeClass(step_in_transition); 
				
				},1000);
				
				
				
				var scroll_to_top = true;
				
				if(container.find('#ms_scroll_to_top').text()=='no')
					 scroll_to_top = false;

				
				if(scroll_to_top)
					{
					var offset = container.offset();
					setTimeout(function()
						{
						if(offset)
							{
							jQuery("html, body").animate(
									{
									scrollTop:offset.top-250
									},300
								);
							}
						},300);
					}
	}
	
	
	jQuery(document).on('click','.nf_step_breadcrumb ol li.visited a, .nf_ms_breadcrumb ul li.visited.validated',
		function()
			{
			if(!jQuery('.v7_container').hasClass('ms_disable_back'))
				{
				var the_form = jQuery(this).closest('#nex-forms');
				var the_form_tag = the_form.find('form');
				var jump_to_step = parseInt(jQuery(this).attr('data-show-step'));
				
				var current_step_container = the_form.find('.step:eq('+ (parseInt(the_form.find('.current_step').text())-1) +')');

				if(!jump_to_step)
					jump_to_step = parseInt(jQuery(this).find('a').attr('data-show-step'));

				jQuery(this).closest('li').addClass('current').removeClass('visited');
				jQuery(this).closest('li').nextAll('li').removeClass('visited').removeClass('current');

				nf_go_to_step(the_form, jump_to_step, current_step_container, (jump_to_step-1))
				}
			}
		);
	
	jQuery(document).on('click', 'div.ui-nex-forms-container .nex-step', function(e){
			e.preventDefault();
						
			var the_form = jQuery(this).closest('form');
			var the_container = jQuery(this).closest('#nex-forms');
			var this_step = jQuery(this).closest('.step');
			var this_step_num =  parseInt(this_step.attr('data-step-num'));
			
			this_step.find('input[type="text"]').each(
				function()
				{
				var val = jQuery(this).val();
				val = val.replace( /(<([^>]+)>)/ig, '')
				jQuery(this).val(val)
				}
			);
			
			this_step.find('textarea').each(
				function()
				{
				var val = jQuery(this).val();
				val = val.replace( /(<([^>]+)>)/ig, '')
				jQuery(this).val(val)
				}
			);
			
			if(validate_form(the_form))
				{
				//BUTTON DISABLE
				jQuery(this).prop('disabled',true);
				var the_button = jQuery(this);
				setTimeout(function() { the_button.prop('disabled',false); },500);
				
				
				
				var jump_to = parseInt(the_container.find('input[name="ms_current_step"]').val())+1;
				
				
				if(jQuery(this).attr('data-skip-to'))
					jump_to = (parseInt(jQuery(this).attr('data-skip-to')));
				
				
				
				this_step.addClass('validated');
				the_container.find('div.nf_ms_breadcrumb ul').find('li:eq('+ (this_step_num-1) +')').addClass('validated');
				the_container.find('div.nf_ms_breadcrumb ul').find('li:eq('+ (this_step_num) +')').addClass('can-navigate');
				
				nf_go_to_step(the_container, jump_to, this_step)
				}
			else
				{
				this_step.removeClass('validated');
				the_container.find('div.nf_ms_breadcrumb ul').find('li:eq('+ (this_step_num-1) +')').removeClass('validated');
				the_container.find('div.nf_ms_breadcrumb ul').find('li:eq('+ (this_step_num) +')').removeClass('can-navigate');
				}
			}
		);
	
	jQuery(document).on('click', 'div.ui-nex-forms-container .prev-step', function(e){
	
			e.preventDefault();
			jQuery(this).prop('disabled',true);
			var the_button = jQuery(this);
			setTimeout(function() { the_button.prop('disabled',false); },500);
			
			var the_container = jQuery(this).closest('#nex-forms');
			var this_step = jQuery(this).closest('.step');
			
			this_step.find('input[type="text"]').each(
				function()
				{
				var val = jQuery(this).val();
				val = val.replace( /(<([^>]+)>)/ig, '')
				jQuery(this).val(val)
				}
			);
			
			this_step.find('textarea').each(
				function()
				{
				var val = jQuery(this).val();
				val = val.replace( /(<([^>]+)>)/ig, '')
				jQuery(this).val(val)
				}
			);
			
			
			var jump_to = parseInt(the_container.find('.last_visited_step').text());
			
			nf_go_to_step(the_container, jump_to, this_step, (jump_to-1), 'back')
			
			}
		);
/**************************************************************************************************************************************************************************************************/	
/**************************************************************************************************************************************************************************************************/	
/**************************************************************************************************************************************************************************************************/	
/************************************************************************************************* TIMER ******************************************************************************************/	
/**************************************************************************************************************************************************************************************************/	
/**************************************************************************************************************************************************************************************************/	
/**************************************************************************************************************************************************************************************************/	
	
	
	
	
	jQuery('.has_time_limit').each(
		function()
			{
			var get_start = parseInt(jQuery(this).attr('data-timer-start'));
			var timer_type = (jQuery(this).hasClass('timer_overall')) ? 'overall' : 'per_step';
			
			var started = (jQuery(this).attr('data-timer-started')=='true') ? true : false;
			
			//console.log('start ' + get_start);
			
			var timer = jQuery(this).find('.nf-timer');
			
			var get_form = jQuery(this).find('form');
			nf_timer_rebuild('ui',timer, false, timer_type);

			if(get_start==1)
				{
				setTimeout(
					function()
						{
						if(get_form.isInViewport() && !started)
							timer.TimeCircles().start(); 
						},
				1000);
				
				
				jQuery(window).on('load resize scroll', function()
					{
					
					if(get_form.isInViewport() && !started)
						timer.TimeCircles().start(); 
					
					});
				}
			}
		);
	
	
	jQuery(document).on('change','.ms_current_step',
		function()
			{
			var current_step = parseInt(jQuery(this).val());
			var get_container = jQuery(this).closest('.ui-nex-forms-container');
			var has_time_limit = (get_container.hasClass('has_time_limit')) ? true : false;
			var timer_type = (get_container.hasClass('timer_overall')) ? 'overall' : 'per_step';
			
			var timer = get_container.find('.nf-timer');

			if(has_time_limit)
				{
				var get_start 	= 	parseInt(get_container.attr('data-timer-start'));
				var get_end 	=	parseInt( get_container.attr('data-timer-end'));
				
				var set_end 	=	(get_end==0) ? get_container.find('.step').length : get_end;
				
				var started = (get_container.attr('data-timer-started')=='true') ? true : false;
				
				
				if((current_step==get_start) && started==false)
					{
					timer.TimeCircles().start(); 
					get_container.attr('data-timer-started','true')	
					}
				
				if(timer_type=='overall')
					{
					if(  (current_step <= (set_end+1))  && started==false)
						{
						timer.TimeCircles().start(); 
						get_container.attr('data-timer-started','true')	
						}
					}
				
				
				if(current_step==(set_end+1))
					{
					//console.log(set_end);
					if(timer_type=='overall')
						{
						timer.TimeCircles().stop(); 
						get_container.attr('data-timer-started','false')	
						}
					else
						{ 
						timer.TimeCircles().stop(); 
						get_container.attr('data-timer-ended','true')
						timer.find('.textDiv_Hours span').text('0');
						timer.find('.textDiv_Minutes span').text('0');
						timer.find('.textDiv_Seconds span').text('0');
						}
					}
				}
			}
		);
	

/**************************************************************************************************************************************************************************************************/	
/**************************************************************************************************************************************************************************************************/	
/**************************************************************************************************************************************************************************************************/	
/************************************************************************************************* SUBMIT ******************************************************************************************/	
/**************************************************************************************************************************************************************************************************/	
/**************************************************************************************************************************************************************************************************/	
/**************************************************************************************************************************************************************************************************/	
	


	
	
	jQuery(document).on('click','.send-nex-form button.nex-submit',
		function(e)
			{
			
			e.preventDefault();
			if(validate_form(jQuery(this).closest('.send-nex-form')))
				{
				jQuery(this).closest('.send-nex-form').submit();
				}
			}
		);
			
	jQuery('form.submit-nex-form').ajaxForm({
    data: {
       action: 'submit_nex_form',
	   paypal_return_url: jQuery('#paypal_return_url').text()
    },

    beforeSubmit: function(formData, jqForm, options) {
		

		
		if(jQuery('.ui-nex-forms-container').hasClass('has_time_limit'))
			{
			var timer = jqForm.closest('.nex-forms').find('.nf-timer');
			timer.TimeCircles().stop(); 	
			}
		
		
		 if(jqForm.hasClass('no-submit'))
		 	return false;
			
		 if(jqForm.closest('.nex-forms').find('.on_form_submmision').text()=='redirect')
			{
			nf_replace_tags(jqForm,jqForm.closest('.nex-forms').find('.confirmation_page'))
			}
		 
		 var user_func = true;
		 try{ 
		 	user_func = nf_custom_user_func_before_submit(formData, jqForm, options);
		 	}
		 catch(err)
		 	{
			console.log('JS ERRORS in custom Code - ' + err);
			user_func = true;
			}
		 finally
		 	{
			user_func = true;
		 	}
		    if(user_func)
				{
			 if(validate_form(jqForm))
				{
				var success_msg = jqForm.closest('.nex-forms').find('.nex_success_message');	
				
				
				var nf_container =  jqForm.closest('.nex-forms');
				
				var hide_form 		=  (nf_container.attr('data-msg-hide-form')=='yes') ? true : false;
				
				if(hide_form)
				success_msg.hide();
				
				var nf_container =  jqForm.closest('#nex-forms');
				var loader_type 	=  (nf_container.attr('data-loader')) ? nf_container.attr('data-loader') : 'ellipsis';
				
				//console.log(loader_type);
				
				
				var submit_val = jqForm.find('.nex-submit').html();
				jqForm.addClass('fadeout');
				
				//circle
				if(loader_type=='circle')
					jqForm.prepend('<div class="nf_loading"><div class="nf-loader-lds-circle"><div></div></div></div>')
				//dual-ring
				if(loader_type=='dual-ring')
					jqForm.prepend('<div class="nf_loading"><div class="nf-loader-lds-dual-ring"></div></div>') 
				//fb
				if(loader_type=='fb')
					jqForm.prepend('<div class="nf_loading"><div class="nf-loader-lds-facebook"><div></div><div></div><div></div></div></div>')
				//heart 
				if(loader_type=='heart')
					jqForm.prepend('<div class="nf_loading"><div class="nf-loader-lds-heart"><div></div></div></div>')
				//ring
				if(loader_type=='ring')
					jqForm.prepend('<div class="nf_loading"><div class="nf-loader-lds-ring"><div></div><div></div><div></div><div></div></div></div>')
				//roller
				if(loader_type=='roller')
					jqForm.prepend('<div class="nf_loading"><div class="nf-loader-lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>')
				//roller2
				if(loader_type=='roller2')
					jqForm.prepend('<div class="nf_loading"><div class="nf-loader-lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>')
				//ellipsis
				if(loader_type=='ellipsis')
					jqForm.prepend('<div class="nf_loading"><div class="nf-loader-lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>')
				//grid
				if(loader_type=='grid')
					jqForm.prepend('<div class="nf_loading"><div class="nf-loader-lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>')
				//hourglass
				if(loader_type=='umbrella')
					jqForm.prepend('<div class="nf_loading"><div class="nf-loader-lds-hourglass"></div></div>')
				//ripple
				if(loader_type=='ripple')
					jqForm.prepend('<div class="nf_loading"><div class="nf-loader-lds-ripple"><div></div><div></div></div></div>')
				//spinner
				if(loader_type=='spinner')
					jqForm.prepend('<div class="nf_loading"><div class="nf-loader-lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>')
				
				
				jqForm.find('.nex-submit').closest('.form_field').addClass('sending');
				jqForm.find('.nex-submit').addClass('submitting');
				//jqForm.find('.nex-submit').addClass('animated');
				//jqForm.find('.nex-submit').addClass('flipOutX');
				//jqForm.find('.nex-submit').fadeOut('slow');
				//jqForm.find('.nex-submit').html('<span class="running-submit fa fa-refresh fa-spin"></span>'+submit_val);
				jqForm.find('.nex-submit').prop('disabled',true);
				
				var offset = jqForm.offset();
				jQuery("html, body").animate(
						{
						scrollTop:offset.top-300
						},500
					);
				
				jqForm.closest('#nex-forms').find('div.nf_ms_breadcrumb .nf_progressbar_percentage').css('width','100%');
				jqForm.closest('#nex-forms').find('div.nf_ms_breadcrumb .nf_progressbar_percentage span').text('100%');
				jqForm.closest('#nex-forms').find('div.nf_ms_breadcrumb .nf_progressbar_percentage').addClass('total_percent');
				
				jqForm.closest('#nex-forms').find('div.nf_step_breadcrumb .nf_progressbar_percentage').css('width','100%');
				jqForm.closest('#nex-forms').find('div.nf_step_breadcrumb .nf_progressbar_percentage span').text('100%');
				jqForm.closest('#nex-forms').find('div.nf_step_breadcrumb .nf_progressbar_percentage').addClass('total_percent');
				
				return true;
				}
			else
				return false;
			}
		else
			return false; 
		 
    },
    success : function(responseText, statusText, xhr, $form) {
	
	  
	   	try{ 
		 	 nf_custom_user_func_after_submit(responseText, statusText, xhr, $form);
		 	}
		 catch(err)
		 	{
			console.log('JS ERRORS in custom Code - ' + err);
			}
		 finally
		 	{
		 	}
	  
		var nf_container =  $form.closest('.nex-forms');
	 	
	
	  
			
		
      if(nf_container.find('.on_form_submmision').text()=='redirect')
			{
			$form.closest('.ui-nex-forms-container').slideUp('slow');
			var url = '' + $form.closest('.nex-forms').find('.confirmation_page').text()+'';    
			jQuery(location).attr('href',url);
			}
		else
			{
			
			
			
			var hide_form 		=  (nf_container.attr('data-msg-hide-form')=='yes') ? true : false;
			var msg_placement 	=  (nf_container.attr('data-msg-placement')) ? nf_container.attr('data-msg-placement') : 'outside';
				
			if(hide_form)
				{	
				if(msg_placement=='inside')
					{
					$form.hide();
					}
				else
					{
					$form.closest('.ui-nex-forms-container').hide();
					}
				}
			else
				{
				nf_container.find('form').removeClass('fadeout');
				nf_container.find('.submitting').prop('disabled',false);
				nf_container.find('.submitting').removeClass('submitting');		
				}
			$form.closest('#nex-forms').find('.nf_loading').remove();
			$form.closest('#nex-forms').find('.nex_success_message').show();
			$form.closest('#nex-forms').find('.nex_success_message').removeClass('hidden');
			$form.closest('#nex-forms').find('.nex_success_message').addClass('show_success');
					
					var success_msg = $form.closest('#nex-forms').find('.nex_success_message');
			
					var success_icon = success_msg.find('.success_icon');
					var success_msg_box = success_msg.find('.msg_box');
					var success_msg_text = success_msg.find('.msg_text');
					
					nf_replace_tags($form,success_msg_text);
					
					success_msg.show();
					success_msg.removeClass('hidden');
					success_icon.show().addClass('animated').addClass('flipInY');
			
					success_msg_text.show().addClass('animated').addClass('fadeIn'); 
					
			$form.closest('#nex-forms').find('.mailer-error').remove();	
		    $form.closest('#nex-forms').find('.nex_success_message_container').append('<div class="mailer-error">' + responseText + '</div>' );
			$form.trigger('NEXForms_entry_submission');
			jQuery('#nf_paypal').submit();
			}
		}
	});
	}
);


function validate_form(object){
	var items;
	var set_name;
	jQuery('.ui-nex-forms-container input[type="file"]').each(
		function()
			{
			items = jQuery(this).closest('.form_field').find('div.get_file_ext').text();
			set_name = new Array(jQuery(this).attr('name'))
			if(strstr(items, ','))
				set_name.push(items.split(','));
			else
				set_name.push(items.split('\n'));
			
			file_inputs.push(set_name);
			}
		);
	var current_form = object;
	
	var formdata = {
                   radios : [], //an array of already validate radio groups
                   checkboxes : [], //an array of already validate checkboxes
                   runCnt : 0, //number of times the validation has been run
                   errors: 0
               }
	
	var defaultErrorMsgs = {
                    email : 'Not a valid email address',
                    number: 'Not a valid phone number',
                    required: 'Please enter a value',
                    text: 'Only text allowed'
                }
	
	var settings = {
                'requiredClass': 'required',
                'customRegex': false,
				'errors' : 0,
                'checkboxDefault': 0,
                'selectDefault': 0,
                'beforeValidation': null,
                'onError': null,
                'onSuccess': null,
                'beforeSubmit': null, 
                'afterSubmit': null,
                'onValidationSuccess': null,
                'onValidationFailed': null
            };
	
	settings.errors = 0;
	jQuery(current_form).find('input').each( function() {
		
		
		var input = jQuery(this);
		var val = input.val();                                                                                
		var name = input.attr('name');
		
		if(input.is('input'))
			{
			
			var type = input.attr('type');
			
			
			switch(type)
				{
				
				case 'hidden':	
					if(input.closest('.form_field').hasClass('required') && input.closest('.form_field').is(':visible')) {
						if(input.closest('.form_field').hasClass('star-rating')  && input.closest('.form_field').is(':visible'))
							{
							if(val.length < 1 || val=='')
								{
								settings.errors++;                   
								show_nf_error(input.closest('.form_field'),input.closest('.form_field').find('.error_message').attr('data-content'))
								}
							else
								{
								hide_nf_error(input.closest('.form_field'));
								}
							}
					}
							
				break;
				case 'text':
					
					if(input.hasClass('required') && (input.closest('.form_field').is(':visible') && !input.closest('.form_field').hasClass('disabled'))) {
					
						if(input.hasClass('the_slider') && (val==input.parent().find('#slider').attr('data-starting-value') || val==''))
							{
							settings.errors++;
							show_nf_error(input.closest('.form_field'),input.closest('.form_field').find('.error_message').attr('data-content'))
							}
						
						
						else if(input.hasClass('the_spinner') && (val==input.attr('data-starting-value') || val==''))
							{
							settings.errors++;
							show_nf_error(input.closest('.form_field'),input.closest('.form_field').find('.error_message').attr('data-content'))
							}
						
						else if(input.hasClass('tags') && val=='')
							{
							settings.errors++;
							show_nf_error(input.closest('.form_field'),input.closest('.form_field').find('.error_message').attr('data-content'))
							}
						
						
						
						else if(val.length < 1 || val=='')
							{
								settings.errors++;        
								show_nf_error(input.closest('.form_field'),input.closest('.form_field').find('.error_message').attr('data-content'))
								break;
							}
						 else
							{
							if(input.hasClass('email') && input.is(':visible'))
								{
								if(!IsValidEmail(val))
									{   
									settings.errors++;
									if(input.attr('data-secondary-message'))
										show_nf_error(input.closest('.form_field'),input.attr('data-secondary-message'))
									break;
									}
								else
									{
									
									hide_nf_error(input.closest('.form_field'));
									break;
									}
								}
							else if(input.hasClass('phone_number') && input.is(':visible'))
								{
								if(!allowedChars(val, 'tel'))
									{
									settings.errors++;
									if(input.attr('data-secondary-message'))
										show_nf_error(input.closest('.form_field'),input.attr('data-secondary-message'))
									
									break;
									} 
								else

									{
									hide_nf_error(input.closest('.form_field'));
									break;
									}  
								}
							else if(input.hasClass('numbers_only') && input.is(':visible'))
								{
								if(!isNumber(val))
									{
									settings.errors++;
									if(input.attr('data-secondary-message'))
										show_nf_error(input.closest('.form_field'),input.attr('data-secondary-message'))
									
									break;
									} 
								else
									{
									if((input.attr('minlength') && input.attr('minlength')!='')) {
										if(input.val().length<parseInt(input.attr('minlength')))
											{
											settings.errors++;
											show_nf_error(input.closest('.form_field'),input.closest('.form_field').find('.error_message').attr('data-content'))	
											break;
											}
										else
											{
											
											hide_nf_error(input.closest('.form_field'));
											break;
											}  
										}
									else
										{
										
										hide_nf_error(input.closest('.form_field'));
										break;
										}  
									} 
								}
							else if(input.hasClass('text_only') && input.is(':visible'))
								{
								if(!allowedChars(val, 'text'))
									{
									settings.errors++;
									if(input.attr('data-secondary-message'))
										show_nf_error(input.closest('.form_field'),input.attr('data-secondary-message'))
									
									break;
									} 
								else
									{
									hide_nf_error(input.closest('.form_field'));
									break;
									} 
								}
							else if(input.hasClass('url') && input.is(':visible'))
								{
								if(!validate_url(val))
									{
									settings.errors++;
									if(input.attr('data-secondary-message'))
										show_nf_error(input.closest('.form_field'),input.attr('data-secondary-message'))
									
									break;
									} 
								else
									{
									hide_nf_error(input.closest('.form_field'));
									break;
									}  
								}
							
							}
						}
				    else if(input.hasClass('email') && val!='' && input.is(':visible')) {
					   if(!IsValidEmail(val)) {  
							settings.errors++;
									if(input.attr('data-secondary-message'))
										show_nf_error(input.closest('.form_field'),input.attr('data-secondary-message'))
									
							break;
					   }
					}
					else if(input.hasClass('phone_number') && val!='' && input.is(':visible')) {
					   if(!allowedChars(val, 'tel')) {
							settings.errors++;
									if(input.attr('data-secondary-message'))
										show_nf_error(input.closest('.form_field'),input.attr('data-secondary-message'))
									
							break;
					   }
					}
					else if(input.hasClass('numbers_only') && val!='' && input.is(':visible')) {
					   if(!isNumber(val)) {
							settings.errors++;
									if(input.attr('data-secondary-message'))
										show_nf_error(input.closest('.form_field'),input.attr('data-secondary-message'))
									
							break;
					   }
					  
					}
					else if(input.hasClass('text_only') && val!='' && input.is(':visible')) {
					   if(!allowedChars(val, 'text')) {
							settings.errors++;
							show_nf_error(input.closest('.form_field'),input.attr('data-secondary-message'))	
							break;
					   }
					}
					else if(input.hasClass('url') && val!='' && input.is(':visible')) {
					   if(!validate_url(val)) {
							settings.errors++;
									if(input.attr('data-secondary-message'))
										show_nf_error(input.closest('.form_field'),input.attr('data-secondary-message'))
									
							break;
					   }   
					}
				else
					hide_nf_error(input.closest('.form_field'));
				break;
				case 'password':
					if(input.hasClass('required') && input.is(':visible'))
						{						
						if(val.length < 1 || val=='')
							{
							settings.errors++;      
							show_nf_error(input.closest('.form_field'),input.attr('data-content'))
							
							}
						}
					else
						{
							hide_nf_error(input.closest('.form_field'));
						}
				break;							
				case 'file':
					if(input.closest('.form_field').hasClass('required') && input.closest('.form_field').is(':visible')) {
						
						
						if(val.length < 1 || val=='' )
							{
							settings.errors++;                               
							show_nf_error(input.closest('.form_field'),input.closest('.form_field').find('.error_message').attr('data-content'))
							
							break;
							}
						 else
							{
							
							for (var i = 0; i < file_inputs.length; i++)
								{
								var fname = val;
								
								
								
							    var ext = fname.substr((~-fname.lastIndexOf(".") >>> 0) + 2);
								if(input.attr('name')==file_inputs[i][0])
									{
									if(jQuery.inArray(ext,file_inputs[i][1])<0)
										{
										settings.errors++;
										if(input.closest('.form_field').find('.error_message').attr('data-secondary-message'))
											show_nf_error(input.closest('.form_field'),input.parent().parent().find('.the_input_element').attr('data-secondary-message'))
										}
									else
										{
										hide_nf_error(input.closest('.form_field'));
										break;
										}
									}
								}
							break;
							}
						}
					if(!input.closest('.form_field').hasClass('required') && input.closest('.form_field').is(':visible')) {
						
						
						if(val!='' )
							{
							
							for (var i = 0; i < file_inputs.length; i++)
								{
								var fname = val;
								
								
								
							    var ext = fname.substr((~-fname.lastIndexOf(".") >>> 0) + 2);
								
								
								if(input.attr('name')==file_inputs[i][0])
									{
									if(!is_inArray(ext,file_inputs[i][1]))
										{
										settings.errors++;
										show_nf_error(input.closest('.form_field'),input.parent().parent().find('.the_input_element').attr('data-secondary-message'))
										}
									else
										{
										hide_nf_error(input.closest('.form_field'));
										break;
										}
									}
								}
							break;
							}
						}
					
				break;
				
				
				case 'radio':
					//avoid checking the same radio group more than once                                    
					var radioData = formdata.radios;
						if(input.closest('.form_field').hasClass('required') && input.closest('.form_field').is(':visible'))
							{
							if(radioData)
								{
								if(jQuery.inArray(name, radioData) >= 0) 
									break;
								else
									{
									var checked = false;
									input.closest('.form_field').find('input[type="radio"]').each(
										function()
											{
											if(jQuery(this).prop('checked')==true)
												checked = true;	
											}
										);
									if(!checked)
										{
										settings.errors++;
										show_nf_error(input.closest('.form_field'),input.closest('.form_field').find('.error_message').attr('data-content'))
										}
									 else
										{
										hide_nf_error(input.closest('.form_field'));
										break;
										}                                           
									radioData.push(name);
									} 
								}                                
							}	
					break;
				
				 case 'checkbox':
					//avoid checking the same radio group more than once                                    
					var checkData = formdata.checkboxes;
					var checkmax  = (input.closest("#field_container").attr('data-max-selection')) ? parseInt(input.closest("#field_container").attr('data-max-selection')) : 0;
					var checkmin  = (input.closest("#field_container").attr('data-min-selection')) ? parseInt(input.closest("#field_container").attr('data-min-selection')) : 0;
					if(input.closest('.form_field').hasClass('required') && input.closest('.form_field').is(':visible'))
						{
						if(input.closest('.form_field').find('input:checked').length<=0)
							{
							settings.errors++;
							show_nf_error(input.closest('.form_field'),input.closest('.form_field').find('.error_message').attr('data-content'))	
							}
						else
							{
							hide_nf_error(input.closest('.form_field'));	
							
							if(checkmin)
								{
								if(input.closest('.form_field').find('input:checked').length<checkmin)
									{
									var sec_err_msg = (input.closest('.form_field').find('.error_message').attr('data-secondary-message')) ? input.closest('.form_field').find('.error_message').attr('data-secondary-message') : 'Minimum selection of '+checkmin+' required';
									var set_sec_err_msg = sec_err_msg.replace('{x}',checkmin,sec_err_msg);
									settings.errors++;
									show_nf_error(input.closest('.form_field'),set_sec_err_msg);
									}
								else
									{
									hide_nf_error(input.closest('.form_field'));	
									}
									
								}
							}
														  
						}
				break;
				}
			}
		}
	);                       
	
    jQuery(current_form).find('.digital-signature-data').each( function() {	
		if(jQuery(this).hasClass('required') && jQuery(this).parent().find('.js-signature').is(':visible'))
			{
			if(jQuery(this).val() == '') {
				settings.errors++;
				show_nf_error(jQuery(this).closest('.form_field'),jQuery(this).closest('.form_field').find('.error_message').attr('data-content'))
				}
			 else
				{
				hide_nf_error(jQuery(this).closest('.form_field'));
				}
			}
  		 }
   	);	
	
   jQuery(current_form).find('textarea').each( function() {	
		if(jQuery(this).hasClass('required') && (jQuery(this).is(':visible')  && !jQuery(this).closest('.form_field').hasClass('disabled')))
			{
			if(jQuery(this).val() == '') {
				settings.errors++;
				show_nf_error(jQuery(this).closest('.form_field'),jQuery(this).closest('.form_field').find('.error_message').attr('data-content'))
				}
			else if(jQuery(this).closest('.form_field').hasClass('text_only') && jQuery(this).is(':visible'))
				{
				if(!allowedChars(jQuery(this).val(), 'text'))
					{
					settings.errors++;
					show_nf_error(jQuery(this).closest('.form_field'),jQuery(this).closest('.form_field').find('.error_message').attr('data-secondary-message'))
					} 
				}
			 else
				{
				hide_nf_error(jQuery(this).closest('.form_field'));
				}
			}
  		 }
   	);
	
	jQuery(current_form).find('select').each( function() {	
		var checkmin  = (jQuery(this).closest("#field_container").attr('data-min-selection')) ? parseInt(jQuery(this).closest("#field_container").attr('data-min-selection')) : 0;
		if((jQuery(this).hasClass('required') || jQuery(this).closest('.form_field').hasClass('required')) && jQuery(this).closest('.form_field').is(':visible'))
			{
				
			if(jQuery(this).val() == 0 || jQuery(this).val()==jQuery(this).attr('data-default-selected-value')) {
				if(jQuery(this).closest('.form_field').hasClass('md-select'))
					show_nf_error(jQuery(this).closest('.form_field'),jQuery(this).closest('.form_field').find('select.error_message').attr('data-content'))
				else
					show_nf_error(jQuery(this).closest('.form_field'),jQuery(this).closest('.form_field').find('.error_message').attr('data-content'))
				
				settings.errors++;
				}
			 else
				{
				hide_nf_error(jQuery(this).closest('.form_field'));
				
				if(checkmin)
					{
					if(jQuery(this).closest('.form_field').find('option:selected').length<checkmin)
						{
						var sec_err_msg = (jQuery(this).closest('.form_field').find('.error_message').attr('data-secondary-message')) ? jQuery(this).closest('.form_field').find('.error_message').attr('data-secondary-message') : 'Minimum selection of '+checkmin+' required';
						var set_sec_err_msg = sec_err_msg.replace('{x}',checkmin,sec_err_msg);
						settings.errors++;
						show_nf_error(jQuery(this).closest('.form_field'),set_sec_err_msg)
						}
					else
						{
						hide_nf_error(jQuery(this).closest('.form_field'));	
						}
						
					}
				}
			}
  		 }
   	);
var the_button = jQuery(jQuery(current_form).find('.nex-submit'));
if(settings.errors == 0)
	{
	return true;
	}
else
	{
	the_button.addClass('animated').addClass('shake');
	
	jQuery(current_form).find('.nex-step').addClass('animated').addClass('shake');
	setTimeout(function(){ 
		jQuery(current_form).find('.nex-step').removeClass('animated').removeClass('shake');
		the_button.removeClass('animated').removeClass('shake');
	
	},1000);

	var error_msg = jQuery('div.error_msg').first();
	error_msg.closest('.form_field').find('input, select, textarea').focus();
	var error_offset = error_msg.offset();
	setTimeout(function(){
		if(error_offset && !error_msg.closest('.form_field').isInViewport())
			{
			jQuery("html, body").animate(
					{
					scrollTop:error_offset.top-150
					},300
				)
			}
		},300);
		
	return false;
	}

}
function isNumber(n) {
  /* if(n!='')
		return !isNaN(parseFloat(n)) && isFinite(n);*/
	
	return true;
}

function IsValidEmail(email){
  if(email!=''){
	var filter = /^([\w-\.]+)@((\[[0-9 \-]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,22}|[0-9]{1,3})(\]?)$/;
	return filter.test(email);
  }
	return true;
}


function allowedChars(input_value, accceptedchars){
	var aChars = ' -_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	if(accceptedchars)
		{
		switch(accceptedchars)
			{
			case 'tel': aChars = '1234567890-+() '; break;
			case 'text': aChars = ' abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';break;
			default: aChars = accceptedchars; break;
			}
		}
	var valid = false;
	var txt = input_value.toString();
	
	for(var i=0;i<txt.length;i++) {
		if (aChars.indexOf(txt.charAt(i)) != -1) {
			valid = true;
		} else {
			valid = false;
			break;
		}
	 }
	return valid;
}


function validate_url(get_url) {
        var url = get_url;
        var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        if (pattern.test(url))
            return true;
 
        return false;
}
function nf_timeConvert(n) {
var num = n;
var hours = (num / 60);
var rhours = Math.floor(hours);
var minutes = (hours - rhours) * 60;
var rminutes = Math.round(minutes);
return  rhours + "." + rminutes + "";
}
;(function ( $, window, document, undefined ) {
   
}(jQuery, window, document));
! function(t) {
    "use strict";
    var e = [
        ["#000000", "#424242", "#636363", "#9C9C94", "#CEC6CE", "#EFEFEF", "#F7F7F7", "#FFFFFF"],
        ["#FF0000", "#FF9C00", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#9C00FF", "#FF00FF"],
        ["#F7C6CE", "#FFE7CE", "#FFEFC6", "#D6EFD6", "#CEDEE7", "#CEE7F7", "#D6D6E7", "#E7D6DE"],
        ["#E79C9C", "#FFC69C", "#FFE79C", "#B5D6A5", "#A5C6CE", "#9CC6EF", "#B5A5D6", "#D6A5BD"],
        ["#E76363", "#F7AD6B", "#FFD663", "#94BD7B", "#73A5AD", "#6BADDE", "#8C7BC6", "#C67BA5"],
        ["#CE0000", "#E79439", "#EFC631", "#6BA54A", "#4A7B8C", "#3984C6", "#634AA5", "#A54A7B"],
        ["#9C0000", "#B56308", "#BD9400", "#397B21", "#104A5A", "#085294", "#311873", "#731842"],
        ["#630000", "#7B3900", "#846300", "#295218", "#083139", "#003163", "#21104A", "#4A1031"]
    ],
        i = function(e, i) {
            e.addClass("bootstrap-colorpalette");
            var n = [];
            t.each(i, function(e, i) {
                n.push("<div>"), t.each(i, function(t, e) {
                    var i = ['<button type="button" class="btn-color" style="background-color:', e, '" data-value="', e, '" title="', e, '"></button>'].join("");
                    n.push(i)
                }), n.push("</div>")
            }), e.html(n.join(""))
        }, n = function(e) {
            e.element.on("click", function(i) {
                var n = t(i.target),
                    s = n.closest(".btn-color");
                if (s[0]) {
                    var a = s.attr("data-value");
                    e.value = a, e.element.trigger({
                        type: "selectColor",
                        color: a,
                        element: e.element
                    })
                }
            })
        }, s = function(t, s) {
            this.element = t, i(t, s && s.colors || e), n(this)
        };
    t.fn.extend({
        colorPalette: function(e) {
            return this.each(function() {
                var i = t(this),
                    n = i.data("colorpalette");
                n || i.data("colorpalette", new s(i, e))
            }), this
        }
    })
}(jQuery),
(window.jQuery), + function(t) {
    "use strict";
    var e = "Microsoft Internet Explorer" == window.navigator.appName,
        i = function(e, i) {
            if (this.$element = t(e), this.$input = this.$element.find(":file"), 0 !== this.$input.length) {
                this.name = this.$input.attr("name") || i.name, this.$hidden = this.$element.find('input[type=hidden][name="' + this.name + '"]'), 0 === this.$hidden.length && (this.$hidden = t('<input type="hidden" />'), this.$element.prepend(this.$hidden)), this.$preview = this.$element.find(".fileinput-preview");
                var n = this.$preview.css("height");

                "inline" != this.$preview.css("display") && "0px" != n && "none" != n && this.$preview.css("line-height", n), this.original = {
                    exists: this.$element.hasClass("fileinput-exists"),
                    preview: this.$preview.html(),
                    hiddenVal: this.$hidden.val()
                }, this.listen()
            }
        };
    i.prototype.listen = function() {
        this.$input.on("change.bs.fileinput", t.proxy(this.change, this)), t(this.$input[0].form).on("reset.bs.fileinput", t.proxy(this.reset, this)), this.$element.find('[data-trigger="fileinput"]').on("click.bs.fileinput", t.proxy(this.trigger, this)), this.$element.find('[data-dismiss="fileinput"]').on("click.bs.fileinput", t.proxy(this.clear, this))
    }, i.prototype.change = function(e) {
        if (void 0 === e.target.files && (e.target.files = e.target && e.target.value ? [{
            name: e.target.value.replace(/^.+\\/, "")
        }] : []), 0 !== e.target.files.length) {
            this.$hidden.val(""), this.$hidden.attr("name", ""), this.$input.attr("name", this.name);
            var i = e.target.files[0];
            if (this.$preview.length > 0 && ("undefined" != typeof i.type ? i.type.match("image.*") : i.name.match(/\.(gif|png|jpe?g)$/i)) && "undefined" != typeof FileReader) {
                var n = new FileReader,
                    s = this.$preview,
                    a = this.$element;
                n.onload = function(n) {
                    var o = t("<img>").attr("src", n.target.result);
                    e.target.files[0].result = n.target.result, a.find(".fileinput-filename").text(i.name), "none" != s.css("max-height") && o.css("max-height", parseInt(s.css("max-height"), 10) - parseInt(s.css("padding-top"), 10) - parseInt(s.css("padding-bottom"), 10) - parseInt(s.css("border-top"), 10) - parseInt(s.css("border-bottom"), 10)), s.html(o), a.addClass("fileinput-exists").removeClass("fileinput-new"), a.trigger("change.bs.fileinput", e.target.files)
                }, n.readAsDataURL(i)
            } else this.$element.find(".fileinput-filename").text(i.name), this.$preview.text(i.name), this.$element.addClass("fileinput-exists").removeClass("fileinput-new"), this.$element.trigger("change.bs.fileinput")
        }
    }, i.prototype.clear = function(t) {
        if (t && t.preventDefault(), this.$hidden.val(""), this.$hidden.attr("name", this.name), this.$input.attr("name", ""), e) {
            var i = this.$input.clone(!0);
            this.$input.after(i), this.$input.remove(), this.$input = i
        } else this.$input.val("");
        this.$preview.html(""), this.$element.find(".fileinput-filename").text(""), this.$element.addClass("fileinput-new").removeClass("fileinput-exists"), t !== !1 && (this.$input.trigger("change"), this.$element.trigger("clear.bs.fileinput"))
    }, i.prototype.reset = function() {
        this.clear(!1), this.$hidden.val(this.original.hiddenVal), this.$preview.html(this.original.preview), this.$element.find(".fileinput-filename").text(""), this.original.exists ? this.$element.addClass("fileinput-exists").removeClass("fileinput-new") : this.$element.addClass("fileinput-new").removeClass("fileinput-exists"), this.$element.trigger("reset.bs.fileinput")
    }, i.prototype.trigger = function(t) {
        this.$input.trigger("click"), t.preventDefault()
    }, t.fn.fileinput = function(e) {
        return this.each(function() {
            var n = t(this),
                s = n.data("fileinput");
            s || n.data("fileinput", s = new i(this, e)), "string" == typeof e && s[e]()
        })
    }, t.fn.fileinput.Constructor = i, t(document).on("click.fileinput.data-api", '[data-provides="fileinput"]', function(e) {
        var i = t(this);
        if (!i.data("fileinput")) {
            i.fileinput(i.data());
            var n = t(e.target).closest('[data-dismiss="fileinput"],[data-trigger="fileinput"]');
            n.length > 0 && (e.preventDefault(), n.trigger("click.bs.fileinput"))
        }
    })
}(jQuery)

jQuery(document).ready(
function()
	{
	resize_field_appendix(10);
	setTimeout(
		function()
			{
			resize_field_appendix(100);
			},500
		);
	setTimeout(
		function()
			{
			resize_field_appendix(100);
			},1000
		);
	setTimeout(
		function()
			{
			resize_field_appendix(100);
			},2000
		);
	setTimeout(
		function()
			{
			resize_field_appendix(100);
			},4000
		);
	
	
	jQuery(document).on('click','.the-thumb',
				function()
					{
					hide_nf_error(jQuery(this).closest('.form_field'));
					jQuery(this).closest('.form_field').find('.the-thumb').removeClass('checked').removeClass('text-success').removeClass('text-danger');
					if(jQuery(this).hasClass('fa-thumbs-o-up'))
						jQuery(this).addClass('text-success').addClass('checked')
						
					if(jQuery(this).hasClass('fa-thumbs-o-down'))
						jQuery(this).addClass('text-danger').addClass('checked')
						
					jQuery(this).parent().find('input').trigger('click');
					}
				);
		jQuery(document).on('click','.the-smile',
				function()
					{
					hide_nf_error(jQuery(this).closest('.form_field'));
					jQuery(this).closest('.form_field').find('.the-smile').removeClass('checked').removeClass('text-success').removeClass('text-danger').removeClass('text-warning');
					if(jQuery(this).hasClass('fa-smile-o'))
						jQuery(this).addClass('text-success').addClass('checked')						
					if(jQuery(this).hasClass('fa-frown-o'))
						jQuery(this).addClass('text-danger').addClass('checked')
					if(jQuery(this).hasClass('fa-meh-o'))
						jQuery(this).addClass('text-warning').addClass('checked')
						
					jQuery(this).parent().find('input').trigger('click');
					}
				);
	
	jQuery('body').on('click',':not(.icon-dropdown .icon-container)',
				function()
					{
					jQuery('.icon-dropdown-opened').removeClass('icon-dropdown-opened');
					jQuery('.icon-dropdown .icon-container').hide();
					}
				);

	jQuery('.icon-select-group').each(
		function()
			{
			if(jQuery(this).attr('data-append-to') && jQuery(this).attr('data-append-to')!='')
				{	
				var field = jQuery(this).detach();
				
				var select_group = jQuery(this);
				field.addClass('appendix_field');
				field.removeClass('form_field');
				
				var set_drop_down_width = 0;
				var append_to_field = jQuery('#'+jQuery(this).attr('data-append-to'));
				
				var the_input = append_to_field.find('input');
				
				
					
				if(append_to_field.hasClass('material_field'))
					{
					if(the_input.parent().attr('class')!='input-group-md')
						the_input.wrap('<div class="input-group-md"></div>');
					
					if(!append_to_field.find('#field_container .appendix-group').is('div'))
						append_to_field.find('#field_container .input-group-md').append('<div class="appendix-group"></div>');
					
					append_to_field.find('#field_container .input-group-md .appendix-group').append(field);
					}
				else
					{
					if(the_input.parent().attr('class')!='input-group')
						the_input.wrap('<div class="input-group"></div>');
						
						
					if(jQuery(this).attr('data-appendix') && jQuery(this).attr('data-appendix')=='pre')
						{
						append_to_field.find('#field_container .input-group').prepend('<div class="input-group-addon prefix add_on_id'+ jQuery(this).attr('id') +'"></div>');
						append_to_field.find('#field_container .input-group-addon.prefix.add_on_id'+ jQuery(this).attr('id') +'').append(field);	
						}
					else
						{
						append_to_field.find('#field_container .input-group').append('<div class="input-group-addon postfix add_on_id'+ jQuery(this).attr('id') +'"></div>');
						append_to_field.find('#field_container .input-group-addon.postfix.add_on_id'+ jQuery(this).attr('id') +'').append(field);	
						}
					
					
					}
				}
			}
		);


	setTimeout(function()
		{ 
		
		jQuery('.icon-spinner').each(
			function()
				{
				var icon_spinner = jQuery(this);
				icon_spinner.find('.icon-container .icon-holder').first().trigger('click'); 	
				
				}
			);
		

		},50);
	
	function nf_spin_icon(spinner,spin){
		
		if(spin=='up')
			var obj = spinner.find('.icon-spin-next')
		else
			var obj = spinner.find('.icon-spin-prev')
		
		obj.find('span').removeClass('animated');
		obj.find('span').removeClass('pulse_icon');
		setTimeout(function(){	
			obj.find('span').addClass('animated');
			obj.find('span').addClass('pulse_icon');
		},20 );
		var select_container = obj.parent();
		var current_selection = select_container.find('.icon-container .icon-checked');	
		var selection_container = select_container.find('.icon-container');	

		if(spin=='up')
			{
			if(current_selection.next('.icon-holder').is('div'))
				current_selection.next('.icon-holder').trigger('click');
			else
				selection_container.find('.icon-holder').first().trigger('click');
			}
		else
			{
			if(current_selection.prev('.icon-holder').is('div'))
				current_selection.prev('.icon-holder').trigger('click');
			else
				selection_container.find('.icon-holder').last().trigger('click');	
			}
			
	}
	
	jQuery('.icon-spinner').on('mousewheel DOMMouseScroll', function(ev) {
         
          var delta = ev.originalEvent.wheelDelta || -ev.originalEvent.deltaY || -ev.originalEvent.detail;

          ev.stopPropagation();
          ev.preventDefault();

          if (delta < 0) {
            nf_spin_icon(jQuery(this),'down');
          }
          else {
            nf_spin_icon(jQuery(this),'up');
          }
        });
 
	
	jQuery(document).on('click','.icon-spin-next',
				function()
					{
					nf_spin_icon(jQuery(this).closest('.icon-spinner')	,'up');
					}
				);
	
	jQuery(document).on('click','.icon-spin-prev',
				function()
					{
					nf_spin_icon(jQuery(this).closest('.icon-spinner'),'down');
					}
				);
	
	
	jQuery(document).on('click','.icon-holder-label',
				function(e)
					{
						e.preventDefault();
					}
				);
	
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
								
								
								var set_val = '';
										label.closest('.form_field').find('.icon-holder').each(
											function()
												{
													
													if(jQuery(this).find('input').prop('checked'))
														{
														set_val += jQuery(this).find('.on-label').text() + ', ';
														}
												}
											);
										
								
								label.closest('.form_field').find('input.the_value').val(set_val.replace(/,(?=\s*$)/, '').trim());
									
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
	
	jQuery("#datetimepicker input").on("change", function (e) {
		
			
			var set_min_date = jQuery(this).closest('#datetimepicker').attr('data-link-min-date');
			var set_max_date = jQuery(this).closest('#datetimepicker').attr('data-link-max-date');
			if(set_min_date)
				{
				var the_form = jQuery(this).closest('form');
				var the_input = the_form.find('[name="'+ set_min_date +'"]');
				the_input.closest('#datetimepicker').data("DateTimePicker").minDate(moment(jQuery(this).val(),the_input.closest('#datetimepicker').attr('data-format')));
				
				
				
				the_input.closest('#datetimepicker').data("DateTimePicker").locale(the_input.closest('#datetimepicker').attr('data-language'));
				
				var date_1  = moment(the_input.val(), the_input.closest('#datetimepicker').attr('data-format'));
				var date_2  =  moment(jQuery(this).val(), jQuery(this).closest('#datetimepicker').attr('data-format'));
				
				var set_date_1 = (date_1)/(1000 * 60 * 60 * 24)
				var set_date_2 = (date_2)/(1000 * 60 * 60 * 24)
				
				var date_diff =   set_date_1 - set_date_2;
				
				if(date_diff<0)
					the_input.closest('#datetimepicker').data("DateTimePicker").date(moment(jQuery(this).val()).format(the_input.closest('#datetimepicker').attr('data-format')));
				
				jQuery('[data-linked-to-picker="linked-up"]').trigger('change');	
				}
			if(set_max_date)
				{
				var the_form = jQuery(this).closest('form');
				var the_input = the_form.find('[name="'+ set_max_date +'"]');
				the_input.closest('#datetimepicker').data("DateTimePicker").maxDate(moment(jQuery(this).val(), jQuery(this).closest('#datetimepicker').attr('data-format')))
				the_input.closest('#datetimepicker').data("DateTimePicker").locale(the_input.closest('#datetimepicker').attr('data-language'));
				jQuery('[data-linked-to-picker="linked-up"]').trigger('change');	
				}
			
        });
	
	
	
	
	
	
	jQuery('.pre_fill_fields input').each(
		function()
			{
			var the_input = jQuery('div.ui-nex-forms-container').find('input[name="'+ jQuery(this).attr('name') +'"]')
			
			var pre_val = jQuery(this).val();
			
			
			if(the_input.hasClass('the_slider'))
				{
					the_input.parent().find('#slider').slider({ value: parseInt(pre_val) });
					the_input.parent().find('.count-text').text(pre_val);
					the_input.parent().find( 'input' ).val(parseInt(pre_val));
					the_input.parent().find( 'input' ).trigger('change');
				}
			
			jQuery('div.ui-nex-forms-container').find('select[name="'+ jQuery(this).attr('name') +'[]"] option, select[name="'+ jQuery(this).attr('name') +'"] option').each(
				function(index)
					{
					if(jQuery(this).attr('value')==pre_val)
						{
						jQuery(this).attr('selected','selected');
						jQuery('select[name="'+ jQuery(this).attr('name') +'[]"]').trigger('change');
						jQuery('select[name="'+ jQuery(this).attr('name') +'"]').trigger('change');
						jQuery(this).closest('.input_container').find('ul.dropdown-menu li:eq('+ index +')').addClass('selected');
						var setval = jQuery(this).closest('.input_container').find('ul.dropdown-menu li.selected').text();
						jQuery(this).closest('.input_container').find('button.selectpicker span.filter-option').text(setval);
						}
					else
						{
						jQuery(this).closest('.input_container').find('ul.dropdown-menu li:eq('+ index +')').removeClass('selected');
						}
					}
				)
			
			//CHECKS
			jQuery('div.ui-nex-forms-container').find('input[name="'+ jQuery(this).attr('name') +'[]"]').each(
				function()
					{
					if(jQuery(this).val()==pre_val)
						{
						jQuery(this).prop('checked',true);
						jQuery(this).trigger('change');
						}
					}
				)
			//INPUTS
				if(the_input.attr('type')=='text')
					{
					the_input.val(jQuery(this).val())
					}
				if(the_input.attr('type')=='hidden')
					{
					the_input.val(jQuery(this).val())
					}
				if(the_input.attr('type')=='radio')
					{
					the_input.closest('.icon-container').find('input').each(
						function()
							{
							if(jQuery(this).val()==pre_val)
								{
								var get_radio = jQuery(this).parent();
								setTimeout(function(){ get_radio.trigger('click') },200);
								}	
							}
						);
					the_input.closest('.the-radios').find('input[type="radio"]').each(
						function()
							{
							if(jQuery(this).val()==pre_val)
								jQuery(this).closest('label').trigger('click');
							}
						);
					}
				
			//CHECKS
			jQuery('div.ui-nex-forms-container').find('textarea[name="'+ jQuery(this).attr('name') +'"]').val(pre_val);
				
			}
		);
	}
);


function resend_nf_email(){
	nf_ajax_url
	var data = 	
		{
		action	 			: 'nf_resend_email',
		nex_forms_Id		: jQuery('#resend_email_nex_forms_Id').text(),
		entry_Id			: jQuery('#resend_email_entry_Id').text(),
		resend_email		: 1
		};
	jQuery.post(jQuery('#nf_ajax_url').text(), data, function(response){
		
		console.log(response);
		
		});
}
function nf_isFloat(n){
    return n != "" && !isNaN(n) && Math.round(n) != n;
}


function nf_countAllCharacters(str) {
  var a = str.split("");
  var obj = {};
  a.forEach(function(s){
    var count=0;
    for(var j=0;j<a.length;j++){
      if(s==a[j]){
        count+=1;
      }
      obj[a[j]]=count;
    }
  });
  return obj;
}

'use strict';

(function ( $ ) {

    function inputStoreSet(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; expires=" + expires + "; path=/";
    };

    function inputStoreGet(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };

    function store(settings, type, dom) {
        
		if($(dom).is('select'))
		 	type = 'select';
			
		if(type === "select" && $(dom).attr('multiple'))
			{
			var select_options = [];
			$(dom).find('option:selected').each(
				function()
					{
					select_options.push(jQuery(this).attr('value'));	
					}
				);
			inputStoreSet(settings.name, select_options, settings.expire);
			}
		else if(type === "checkbox")
			{
			var checkboxes = $(dom).closest('.input_container');
			var checks = [];
			checkboxes.find('input:checked').each(
				function()
					{
					if(jQuery(this).attr('checked')=='checked')
						checks.push(jQuery(this).val());
					}
				);
			inputStoreSet(settings.name, checks, settings.expire);
			}
		else if(type === "radio") {
          inputStoreSet(settings.name, $(dom).val(), settings.expire);
        } 
		else {
		
		  var get_area_val = dom.value; 
  
		 get_area_val = get_area_val.replace(/\n/g,'[BREAK]'); 	 	
			
          inputStoreSet(settings.name, get_area_val, settings.expire);
          if(settings.debug) {
            console.log("Previous Input for ["+settings.name+"] = ["+dom.value+"]");
          }
        }
    }

    $.fn.inputStore = function( options ) {

        // This is the easiest way to have default options.
        var settings = $.extend({
            name: this.attr("name"),
            expire: 365,
            debug: false
        }, options );

        var previousSet = inputStoreGet(settings.name);

        var type = this.attr("type");
		
		if(this.is('select'))
		 	type = 'select';
		

		if((type && type == "select")){
           
		   var select_options = previousSet.split(',');
		   this.find('option').prop('selected',false);
		   for (var i = 0; i < select_options.length; i++) {
				this.find('option[value="'+ select_options[i] +'"]').prop('selected',true);
				this.trigger('change');
			}
		} 
		
        else if(type && type == "checkbox"){
           
		   var checks = previousSet.split(',');
		   
		   for (i = 0; i < checks.length; i++) {
				var the_check = this.parent().find('input[value="'+ checks[i] +'"]');
				setTimeout(function(){ the_check.closest('label').trigger('click'); }, 100); 
				//the_check.closest('label').find('a').trigger('click');
				
				var the_super_check = this.closest('.icon-container').find('input[value="'+ checks[i] +'"]');
				the_super_check.prop('checked',true);
				the_super_check.trigger('change');
				
				the_super_check.parent().addClass('icon-checked');
				
				the_super_check.parent().find('.on-label').show();
				the_super_check.parent().find('.off-label').hide();
				
				the_super_check.parent().find('.on-icon').show();
				the_super_check.parent().find('.off-icon').hide();
				
			}
		} 
		else if(type && type == "radio"){
		  this.prop('checked',false);
          var the_radio = this.parent().find('input[value="'+ previousSet +'"]');
	
		  setTimeout(function(){ the_radio.closest('label').trigger('click'); }, 100); 

		  the_radio.closest('.icon-holder').trigger('click');
		  
		  
		  var the_super_check = this.closest('.icon-container').find('input[value="'+ previousSet +'"]');
		  the_super_check.prop('checked',true);
		  the_super_check.trigger('change');
		
		  the_super_check.parent().addClass('icon-checked');

		
		  the_super_check.parent().find('.on-label').show();
		  the_super_check.parent().find('.off-label').hide();
		
		  the_super_check.parent().find('.on-icon').show();
		  the_super_check.parent().find('.off-icon').hide();
		  
        }
		
		else {
			if(previousSet)
				{
				if(this.closest('.ui-nex-forms-container').hasClass('m_design'))
					this.closest('.form_field').addClass('is_focused');	
				}
				
		var get_area_val = previousSet; 
  
		 get_area_val = get_area_val.replace(/\[BREAK\]/g,'\n'); 
		  
          this.val(get_area_val); 
        }
        if(settings.debug) {
          console.log("Previous Input for ["+settings.name+"] = ["+previousSet+"]");
        }
        this.on('keyup', function(){
          store(settings, type, this);
        });

        this.on('change', function(){
          store(settings, type, this);
        });
        return this;
    };

}( jQuery ));