'use strict'

function validateURL(value) {
    return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
    }

function insertAtCaret(areaId,text) {
    var txtarea = document.getElementById(areaId);
    var scrollPos = txtarea.scrollTop;
    var strPos = 0;
    var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ? 
        "ff" : (document.selection ? "ie" : false ) );
    if (br == "ie") { 
        txtarea.focus();
        var range = document.selection.createRange();
        range.moveStart ('character', -txtarea.value.length);
        strPos = range.text.length;
    }
    else if (br == "ff") strPos = txtarea.selectionStart;

    var front = (txtarea.value).substring(0,strPos);  
    var back = (txtarea.value).substring(strPos,txtarea.value.length); 
    txtarea.value=front+text+back;
    strPos = strPos + text.length;
    if (br == "ie") { 
        txtarea.focus();
        var range = document.selection.createRange();
        range.moveStart ('character', -txtarea.value.length);
        range.moveStart ('character', strPos);
        range.moveEnd ('character', 0);
        range.select();
    }
    else if (br == "ff") {
        txtarea.selectionStart = strPos;
        txtarea.selectionEnd = strPos;
        txtarea.focus();
    }
    txtarea.scrollTop = scrollPos;
}

jQuery(document).ready(function() {

	jQuery('body').on('submit', '#fc_add_form_modal > form', function(event) {
		event.preventDefault();
		var form = jQuery('[name="fc_form_id"]:checked').val();
        if (jQuery('[name="fc_form_type"]:checked').val() == 'popup') {
            var placement_var = jQuery('[name="fc_form_btn_align"]:checked').val();
            var placement = jQuery('[name="fc_form_btn_align"]:checked').val()=='inline' ? '' : " placement='"+jQuery('[name="fc_form_btn_align"]:checked').val()+"'";
            var value = jQuery('#fc_button_text').val();
            value = validateURL(value) ? "<img src='"+value+"'/>" : value;
            if ( validateURL(value) ) {
                var new_class = '';
            } else if ( placement_var=='left' || placement_var=='right' ) {
                var new_class = " button_color='#4488ee' font_color='white'"
            } else {
                var new_class = " button_color='#4488ee' font_color='white'"
            }
            var code = "[fc id='"+form+"' type='popup'"+placement+new_class+"]"+value+"[/fc]";
        }
        else if (jQuery('[name="fc_form_type"]:checked').val()=='slide')
        {
            var placement_var = jQuery('[name="fc_form_btn_align"]:checked').val();
            var placement = jQuery('[name="fc_form_btn_align"]:checked').val()=='inline' ? '' : " placement='"+jQuery('[name="fc_form_btn_align"]:checked').val()+"'";
            var value = jQuery('#fc_button_text').val();
            value = validateURL(value) ? "<img src='"+value+"'/>" : value;
            if ( validateURL(value) )
            {
                new_class = '';
            }
            else if ( placement_var=='left' || placement_var=='right' )
            {
                new_class = " button_color='#4488ee' font_color='white'"
            }
            else
            {
                new_class = " button_color='#4488ee' font_color='white'"
            }
            var code = "[fc id='"+form+"' type='slide'"+placement+new_class+"]"+value+"[/fc]";
        }
        else
        {
            var align = jQuery('[name="fc_form_align"]:checked').val();            
            var code = "[fc id='"+form+"' align='"+align+"'][/fc]";
        }
		jQuery('#fc_add_form_modal').fc_modal('hide');
		tinymce.execCommand('mceInsertContent', 0, code);
		var val = jQuery('.wp-editor-area').val();
		insertAtCaret('content',code);
	});
    jQuery('body').on('change','[name="fc_form_type"]',function(event){
        if (jQuery('[name="fc_form_type"]:checked').val()=='inline')
        {
            jQuery('#fc_form_type_inline').slideDown(300);
            jQuery('#fc_form_type_popup').slideUp(300);
            jQuery('#fc_form_type_slide').slideUp(300);
            jQuery('#fc_button_text').slideUp();
        }
        else if (jQuery('[name="fc_form_type"]:checked').val()=='slide')
        {
            jQuery('#fc_form_type_slide').slideDown(300);
            jQuery('#fc_form_type_popup').slideUp(300);
            jQuery('#fc_form_type_inline').slideUp(300);
            jQuery('#fc_button_text').slideDown();
        }
        else
        {
            jQuery('#fc_form_type_popup').slideDown(300);
            jQuery('#fc_form_type_slide').slideUp(300);
            jQuery('#fc_form_type_inline').slideUp(300);
            jQuery('#fc_button_text').slideDown();
        }
    });
});