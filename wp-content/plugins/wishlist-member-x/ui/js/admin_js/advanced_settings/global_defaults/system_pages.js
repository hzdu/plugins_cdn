jQuery(function($){
	configure_pages = new wlm3_modal( '#configure-pages', save_configuration );

	$('.system-page-url-chkbx').click(toggle_url_field);
	$('.system-pages-save').click(save_system_pages);
	$('.generate-system-page').click(generate_system_page);
	//add http to url
    $(".system-page-url").blur(function() {
        if (!/^https*:\/\//.test(this.value)) {
            this.value = "http://" + this.value;
        }
    });

	$('.configure-btn').click(show_configure_modal);

	$("input[name='sp']").click(switch_toggle_clicked);
});

var show_configure_modal = function() {
	configure_pages.open();
	var select = $("#" +configure_pages.data.id).find(".wlm-select-pages");
	if ( !select.data('select2') ) select.select2({theme:"bootstrap"});
}

var save_configuration = function() {
	alert("adsa");
}

var switch_toggle_clicked = function() {
	$(".sp-text-content").hide();
	$(".sp-page-content").hide();
	$(".sp-url-content").hide();
	if ( $("#sp-text").is(":checked") ) {
		$(".sp-text-content").show();
	}
	if ( $("#sp-page").is(":checked") ) {
		$(".sp-page-content").show();
	}
	if ( $("#sp-url").is(":checked") ) {
		$(".sp-url-content").show();
	}
}

var save_system_pages = function() {
	var $this_button = $(this);
	if ( $this_button.prop("disabled") || $this_button.hasClass("-disable") || $this_button.hasClass("-disabled") ) return false; //if disabled, do nothing

	$this_button.closest('.content-wrapper').save_settings({
	    on_init: function( $me, $data) {
	    	$me.find(".system-pages-save").disable_button({disable:true, icon:"update"});
	    },
	    on_success: function( $me, $result) {
	    	$(".wlm-message-holder").show_message({message:$result.msg, type:$result.msg_type, icon:$result.msg_type});
	    },
	    on_fail: function( $me, $data) {
	    	alert(WLM3VARS.request_failed);
	    },
	    on_error: function( $me, $error_fields) {
	    	$.each( $error_fields, function( key, obj ) {
  				obj.parent().addClass('has-error');
			});
	    	$me.find(".system-pages-save").disable_button( {disable:false, icon:"save"} );
	    },
	    on_done: function( $me, $data) {
	    	$me.find(".system-pages-save").disable_button( {disable:false, icon:"save"} );
	    },
	});
}


var toggle_url_field = function() {
	if ( $(this).is(':checked') ) {
	    $(this).closest('.row').find(".system-page-url").parent().removeClass("d-none");
	    $(this).closest('.row').find(".wlm-select").parent().addClass("d-none");
		$(this).closest('.chkbox-holder').find(".create-page").disable_button({disable:true});
	} else {
	    $(this).closest('.row').find(".system-page-url").parent().addClass("d-none");
	    $(this).closest('.row').find(".wlm-select").parent().removeClass("d-none");
	    $(this).closest('.chkbox-holder').find(".create-page").disable_button({disable:false});
	}
}

var create_page = function() {
	var $this_button = $(this);
	if ( $this_button.prop("disabled") || $this_button.hasClass("-disable") || $this_button.hasClass("-disabled") ) return false; //if disabled, do nothing

	$("#create-page-modal").modal();
	$("#create-page-modal").find("input[name='page_for']").val($this_button.attr("key"));
	$("#create-page-modal").find("input[name='page_title']").val($this_button.attr("title") +" page");
	$("#create-page-modal").find("#create-page-title").html($this_button.attr("title"));
}

var generate_system_page = function() {
	var $this_button = $(this);
	if ( $this_button.prop("disabled") || $this_button.hasClass("-disable") || $this_button.hasClass("-disabled") ) return false; //if disabled, do nothing

	//we need this to identify what select to update
	var $select_name = $this_button.closest('.modal-content').find("input[name='page_for']").val();

	//prepare data
	var $data = $this_button.closest('.modal-content').get_form_data();
	if ( $data.error ) return false; //no data? something is wrong

	//disable button and retrieve previous value
	$this_button.disable_button({disable:true});

	// send post
	$.post( WLM3VARS.ajaxurl, $data, function( $result ) {
		if ( $result != 0 || $result != "" ) {
	        try {
				$result = wlm.json_parse($result);
				if ( $result.post_id ) {
					$('.content-wrapper').find(".wlm-select").append( new Option( $result.post_title, $result.post_id) );
					$('.content-wrapper').find("select[name='" +$select_name +"']").val($result.post_id).trigger("change");
					$("#create-page-modal").modal("toggle");
				} else {
					alert( $result.msg );
				}
	        } catch (e) {
	            alert(WLM3VARS.request_failed);
	        }
		}
	})
	.fail( function() {
	    alert(WLM3VARS.request_failed);
	})
	.always( function() {
		//enable button and revert to previous values
		$this_button.disable_button( {disable:false} );
	})
}
