jQuery(function($){
	$(".import-settings-btn").click(function(){
		 $(".import-form").submit();
	});
	if ( $("input[name='import_err']") && $("input[name='import_err']").val() ) {
		console.log($("input[name='import_err']").val());
		$(".wlm-message-holder").show_message({message:$("input[name='import_err']").val(), type:"danger", icon:"danger"});
	}
	if ( $("input[name='import_msg']") && $("input[name='import_msg']").val() ) {
		$(".wlm-message-holder").show_message({message:$("input[name='import_msg']").val(), type:"success", icon:"success"});
	}
});
