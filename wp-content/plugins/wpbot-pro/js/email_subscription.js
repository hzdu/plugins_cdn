jQuery(document).ready(function($){
	"use strict";
	$('#wpbot_checked_all').on('click', function(){
		if($(this).is(':checked')){
			$('.wpbot_email_checkbox').prop('checked', true);
		}else{
			$('.wpbot_email_checkbox').prop('checked', false);
		}
	})
	
	$('#wpbot_submit_email_form').on('click', function(e){
		e.preventDefault();
		$( "#wpcs_form_sessions" ).submit();
	})
})