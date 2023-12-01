var cm_editor = null;
jQuery(function($){
  cm_editor = wp.CodeMirror.fromTextArea(document.getElementById("customcss"), {
      lineNumbers: true,
      mode: "text/css",
      matchBrackets: true
  });

  reset_modal = new wlm3_modal( '#reset-modal', reset_settings );
  $('.save-settings').click(save_settings);
  $('.reset-btn').click(show_reset_modal);
});

var show_reset_modal = function() {
    reset_modal.open();
}

var reset_settings = function() {
    var $this_button = $(this);
    var settings_data = {
        action : "admin_actions",
        WishListMemberAction : "reset_custom_css",
    };

    reset_modal.close();

    $this_button.save_settings({
        data: settings_data,
        on_init: function( $me, $data) {
            $('.reset-btn').disable_button({disable:true, class: "-default"});
            $this_button.disable_button({disable:true});
        },
        on_success: function( $me, $result) {
            cm_editor.setValue($result.css);
            $(".wlm-message-holder").show_message({message:$result.msg, type:$result.msg_type, icon:$result.msg_type});
        },
        on_fail: function( $me, $data) {
            $this_button.disable_button( {disable:false} );
            $('.reset-btn').disable_button({disable:false, class: "-default"});
            alert(WLM3VARS.request_failed);
        },
        on_error: function( $me, $error_fields) {
            $this_button.disable_button( {disable:false} );
            $('.reset-btn').disable_button({disable:false, class: "-default"});
            alert(WLM3VARS.request_error);
        },
        on_done: function( $me, $data) {
            $this_button.disable_button( {disable:false} );
            $('.reset-btn').disable_button({disable:false, class: "-default"});
        }
    });
}

var save_settings = function() {
    var $this_button = $(this);
    if ( $this_button.prop("disabled") || $this_button.hasClass("-disable") || $this_button.hasClass("-disabled") ) return false; //if disabled, do nothing

    var settings_data = {
        action : "admin_actions",
        WishListMemberAction : "save",
        wlm_css : cm_editor.getValue(),
    };

    $this_button.save_settings({
        data: settings_data,
        on_init: function( $me, $data) {
            $this_button.disable_button({disable:true, icon:"update"});
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
            $this_button.disable_button( {disable:false, icon:"save"} );
        },
        on_done: function( $me, $data) {
            $this_button.disable_button( {disable:false, icon:"save"} );
        }
    });
}

