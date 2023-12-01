jQuery(function($){
	configure_pages = new wlm3_modal( '#configure-pages', save_configuration );

	//add http to url
    $(".system-page-url").blur(function() {
        if (!/^https*:\/\//.test(this.value)) {
            this.value = "http://" + this.value;
        }
    });

	$('.create-page-btn').click(generate_system_page);

	$('.configure-btn').click(show_configure_modal);
	$("input[name='sp']").click(switch_toggle_clicked);
	$(".add-page-btn").click(show_create_page);
	$(".hide-create-page-btn").click(hide_create_page);

	$('.wlm-mergecodes').change( insert_mergecodes );

	$('.page-message-reset-button').do_confirm({placement:'right',yes_classes:'-success'})
	.on('yes.do_confirm', function() {
		var modal = $(this).closest('.modal');
		var type = modal.find('.system-page-type').first().val() + '_internal';
		var editor = tinymce.get($('.system-page-text')[0].id);
		editor.setContent(WLM3VARS.page_templates[type]);
		$('#configure-pages .save-button.-primary').click();
	});
});

var insert_mergecodes = function() {
	$code = $(this).val();
	$target = $(this).attr("target-class");
	if ( tinymce.editors.length && $target == "system-page-text" ) {
		tinymce.editors["text"].insertContent($code);
	} else {
	    var caretPos = $('.' +$target )[0].selectionStart;
	    var textAreaTxt = $('.' +$target ).val();
	    $('.' +$target ).val(textAreaTxt.substring(0, caretPos) + $code + textAreaTxt.substring(caretPos) );
	}
	$(this).val("").trigger('change.select2');
}

var show_configure_modal = function() {
	configure_pages.open();
	$("#" +configure_pages.data.id).find(".settings-content").hide();
	$("#" +configure_pages.data.id).find(".save-button").hide();
	$("#" +configure_pages.data.id).find(".modal-title").html(wp.i18n.__( 'Loading settings, please wait...', 'wishlist-member' ));

	var $this_button = $(this);
	var settings_data = {
		action : "admin_actions",
		WishListMemberAction : "get_system_page",
		type : $(this).attr("key"),
	};
	$(this).save_settings({
		data: settings_data,
	    on_success: function( $me, $result) {
	    	if ( $result.success && $result.pages ) {
	    		if ( tinymce.editors["text"] ) tinymce.editors["text"].remove(); //remopve tinymce
		    	if ( $result.pages.text ) 	$("#" +configure_pages.data.id).find(".system-page-text").val( $result.pages.text );
		    	if ( $result.pages.internal ) 	$("#" +configure_pages.data.id).find(".system-page-internal").val( $result.pages.internal ).trigger('change.select2');
		    	if ( $result.pages.url ) 		$("#" +configure_pages.data.id).find(".system-page-url").val( $result.pages.url );
                wlm.richtext({
                    selector: 'textarea.system-page-text',
                    height: 200,
                    menubar: false,
                });

				var select = $("#" +configure_pages.data.id).find(".wlm-select-pages");
				if ( !select.data('select2') ) select.select2({theme:"bootstrap"});

				$("#" +configure_pages.data.id).find(".system-page-type").val($this_button.attr("key"));
				$("#" +configure_pages.data.id).find(".modal-title").html(
					wp.i18n.sprintf(
						// Translators: 1 - Redirect type (ie After Registration, etc );
						wp.i18n.__( 'Configure Redirect Page for <strong>%1$s</strong>', 'wishlist-member' ),
						$this_button.attr('title')
					)
				);
				$("#" +configure_pages.data.id).find("#sp-" +$result.page_type ).prop("checked", true);
				switch_toggle_clicked();

				$("#" +configure_pages.data.id).find(".settings-content").show();
				$("#" +configure_pages.data.id).find(".save-button").show();
				$("#" +configure_pages.data.id).find(".system-page-url").parent().removeClass("has-error");
				$("#" +configure_pages.data.id).find(".system-page-internal").parent().removeClass("has-error");
	    	} else {
	    		console.log($result);
	    	}
	    },
	    //display error but dont close the modal
	    on_fail: function( $me, $data) { console.log(WLM3VARS.request_failed); },
	    on_error: function( $me, $error_fields) { console.log(WLM3VARS.request_error); }
	});
}

var save_configuration = function() {
	var $this_button = $(this);
	if ( $this_button.prop("disabled") || $this_button.hasClass("-disable") || $this_button.hasClass("-disabled") ) return false; //if disabled, do nothing
	var $save_button = $(this).closest(".modal").find(".save-button");

	var modal = $("#" +configure_pages.data.id);
	var settings_data = {
		action : "admin_actions",
		WishListMemberAction : "save",
	};

	if ( $("#sp-text").is(":checked") ) {
		var text_content = "";
		if ( tinymce.editors.length ) {
			text_content = tinymce.editors["text"].getContent();
		} else {
		    text_content = modal.find(".system-page-text").val()
		}
		text_content = text_content.replace(/\n|\r/g, "");//remove new lines
		if ( text_content == "" ) {
			modal.find(".system-page-text").parent().addClass("has-error");
			return false;
		}
		settings_data[ modal.find(".system-page-type").val() +"_type" ] = "text";
		settings_data[ modal.find(".system-page-type").val() +"_text" ] =  text_content;
	}
	if ( $("#sp-internal").is(":checked") ) {
		var p = $.trim(modal.find(".system-page-internal").val());
		if ( p == "" ) {
			modal.find(".system-page-internal").parent().addClass("has-error");
			return false;
		}
		settings_data[ modal.find(".system-page-type").val() +"_type" ] = "internal";
		settings_data[ modal.find(".system-page-type").val() +"_internal" ] =  p;
	}
	if ( $("#sp-url").is(":checked") ) {
		var url = $.trim(modal.find(".system-page-url").val());
		  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
		  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
		  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
		  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
		  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
		  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
		if ( !pattern.test(url) ) {
			modal.find(".system-page-url").parent().addClass("has-error");
			return false;
		}
		settings_data[ modal.find(".system-page-type").val() +"_type" ] = "url";
		settings_data[ modal.find(".system-page-type").val() ] =  url;
	}

	var x = $(this).save_settings({
		data: settings_data,
	    on_init: function( $me, $result) {
	    	$me.disable_button({disable:true, icon:"update"});
	    	$save_button.disable_button({disable:true});
	    },
	    on_success: function( $me, $result) {
	    	// modal.modal('toggle');
	    	// tinyMCE.remove();
	    	if ( $this_button.hasClass("-close") ) modal.modal('toggle');
	    	$(".wlm-message-holder").show_message({message:$result.msg, type:$result.msg_type, icon:$result.msg_type});
	    },
	    on_fail: function( $me, $data) {
	    	$save_button.disable_button({disable:false});
	    	$me.disable_button( {disable:false, icon:"save"} );
	    	$(".wlm-message-holder").show_message({message: WLM3VARS.request_failed, type: "danger" });
	    },
	    on_error: function( $me, $error_fields) {
	    	$save_button.disable_button({disable:false});
	    	$me.disable_button( {disable:false, icon:"save"} );
	    	$(".wlm-message-holder").show_message({message: WLM3VARS.request_error, type: "danger" });
	    },
	    on_done: function( $me, $data) {
	    	$save_button.disable_button({disable:false});
	    	$me.disable_button( {disable:false, icon:"save"} );
	    }
	});
}

var switch_toggle_clicked = function() {
	$(".sp-text-content").hide();
	$(".sp-page-content").hide();
	$(".sp-url-content").hide();
	if ( $("#sp-text").is(":checked") ) {
		$(".sp-text-content").show();
	}
	if ( $("#sp-internal").is(":checked") ) {
		$(".sp-page-content").show();
		$(".create-page-holder").hide();
	}
	if ( $("#sp-url").is(":checked") ) {
		$(".sp-url-content").show();
	}
}

var show_create_page = function() {
	$(".create-page-holder").show();
}
var hide_create_page = function() {
	$(".create-page-holder").hide();
}


var generate_system_page = function() {
	var $this_button = $(this);
	if ( $this_button.prop("disabled") || $this_button.hasClass("-disable") || $this_button.hasClass("-disabled") ) return false; //if disabled, do nothing

	var $save_button = $("#" +configure_pages.data.id).find(".save-button");

	var settings_data = {
		action : "admin_actions",
		WishListMemberAction : "create_system_page",
		page_for : $("#" +configure_pages.data.id).find(".system-page-type").val(),
	};

	$this_button.closest('.row').save_settings({
		data: settings_data,
	    on_init: function( $me, $result) {
	    	$this_button.disable_button({disable:true});
	    	$save_button.disable_button({disable:true});
			$("#" +configure_pages.data.id).on('hide.bs.modal', function(e) {
				if ( $this_button.prop("disabled") || $this_button.hasClass("-disable") || $this_button.hasClass("-disabled") ) {
					e.preventDefault();
				}
			});
	    },
	    on_success: function( $me, $result) {
			if ( $result.post_id ) {
				$("#" +configure_pages.data.id).find(".wlm-select-pages").append( new Option( $result.post_title, $result.post_id) );
				$("#" +configure_pages.data.id).find(".wlm-select-pages").val($result.post_id).trigger("change");
				$(".create-page-holder").hide();
			}
			$('.wlm-message-holder').show_message({
				message: $result.msg,
				type: $result.msg_type
			});
	    },
	    on_fail: function( $me, $data) {
	    	console.log($data);
	    	alert(WLM3VARS.request_failed);
	    },
	    on_error: function( $me, $error_fields) {
	    	$.each( $error_fields, function( key, obj ) {
	    		if ( typeof obj == "object" ) obj.parent().addClass('has-error');
			});
	    	$this_button.disable_button({disable:false});
	    	$save_button.disable_button({disable:false});
	    	$("#" +configure_pages.data.id).unbind("hide.bs.modal");
	    },
	    on_done: function( $me, $data) {
	    	$this_button.disable_button({disable:false});
	    	$save_button.disable_button({disable:false});
	    	$("#" +configure_pages.data.id).unbind("hide.bs.modal");
	    }
	});
}