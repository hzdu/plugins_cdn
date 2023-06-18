/**
 * CSS editor.
 *
 * @package fwdevp
 * @since fwdevp 1.0
 */

jQuery(document).ready(function($){
	
	'use strict';

	$("#css_text").scrollTop($("#scroll_pos").val());
	
	$("#update_btn").click(function(){
	    var val = $("#css_text").val().replace(/"/g, "'");
	    $("#css_data").val(val);
	    $("#scroll_pos").val($("#css_text").scrollTop());
    });
});