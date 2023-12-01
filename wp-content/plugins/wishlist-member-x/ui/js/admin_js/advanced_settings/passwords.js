jQuery(function($){
    edit_notification_modal = new wlm3_modal( '#edit-notification-modal-info', edit_notification_save );

    $('.edit-notification').click(edit_notification);

    $( '.min-passlength-apply' ).apply_cancel()
    .on('apply.apply_cancel', function(e) {
        $( this ).apply_cancel( 'hide' );
        $( this ).parent().save_settings({
            data: { action : "admin_actions", WishListMemberAction : "save", },
            on_success: function( me, result ) {
                var i = $( me ).find( ':input[name=min_passlength]' );
                i.data( 'initial', i.val() );
            },
            on_done: function( me, result ) {
                $( '.wlm-message-holder' ).show_message( {
                    message : result.msg,
                    type : result.msg_type
                } );
            }
        });
    })
    .on('cancel.apply_cancel', function(e) {
        $( this ).val( $( this ).data( 'initial' ) ).trigger( 'change' );
    });

    $('.notification-switch-password').click(function(){
        $this = $(this);
        $(this).parent().parent().parent().parent().parent().save_settings({
            on_success: function( $me, $result) {
                $( '.wlm-message-holder' ).show_message( { message : $result.msg, type : $result.msg_type} );
                if ( $result.data.mask_passwords_in_emails !== "0" ) {
                    $me.closest(".row").find(".help-block").addClass("d-none");
                } else {
                    $me.closest(".row").find(".help-block").removeClass("d-none");
                }
            },
            on_fail: function( $me, $data) {
                $me = $me.find(".notification-switch");
                alert(WLM3VARS.request_failed);
                $me.prop('checked', ! $me.prop('checked') );
            },
            on_error: function( $me, $error_fields) {
                alert(WLM3VARS.request_error);
            }
        });
    });
});

var edit_notification = function() {
    var $this_button = $(this);

    edit_notification_modal.open();
    $("#" +edit_notification_modal.data.id).find(".content-wrapper").hide();
    $("#" +edit_notification_modal.data.id).find(".save-button").hide();
    $("#" +edit_notification_modal.data.id).find(".modal-title").html(wp.i18n.__( 'Loading settings, please wait...', 'wishlist-member' ));

    var $option_title   = $this_button.closest('.row').find(".title-label").html();
    var $option_key         = $this_button.closest('.row').find(".notification-switch").prop("name");
    if ( $option_key == "password_hinting" ) {
        $option_title = wp.i18n.__( 'Configure: Password Hinting Email Notification', 'wishlist-member' );
    } else {
        $option_title = wp.i18n.__( 'Configure: Password Reset Email Notification', 'wishlist-member' );
    }
    var $this_button = $(this);
    var settings_data = {
        action : "admin_actions",
        WishListMemberAction : "get_password_notification",
        type : $option_key,
    };
    $(this).save_settings({
        data: settings_data,
        on_success: function( $me, $result) {
            if ( $result.success && $result.form ) {
                // console.log($result.form);
                $("#edit-notification-modal").find(".modal-title").html($option_title);
                $("#edit-notification-modal").find(".modal-body .content-wrapper").html($result.form);
                $("#edit-notification-modal").find(".modal-body .content-wrapper").transformers();

                $('#edit-notification-modal .email-reset-button').each(function() {
                    $(this).do_confirm({placement:'right',yes_classes:'-success'})
                    .on('yes.do_confirm', function() {
                        var type = $(this).data('target');
                        var subject = type + '_subject';
                        var message = type + '_message';
                        $('[name="' + subject + '"]').val(default_data[subject]);
                        var target = $('[name="' + message + '"]');
                        var editor = tinymce.get(target[0].id);
                        editor.setContent(default_data[message]);
                        target.val(default_data[message]);
                        $('#edit-notification-modal .save-button.-primary').click();
                    });
                });

                wlm.richtext({
                    selector: 'textarea.email-editor',
                    height: 200,
                    menubar: false,
                });
                $("#" +edit_notification_modal.data.id).find(".content-wrapper").show();
                $("#" +edit_notification_modal.data.id).find(".save-button").show();
            } else {
                $(".wlm-message-holder").show_message({message:$result.msg, type:$result.msg_type, icon:$result.msg_type});
            }
        },
        //display error but dont close the modal
        on_fail: function( $me, $data) { console.log(WLM3VARS.request_failed); },
        on_error: function( $me, $error_fields) { console.log(WLM3VARS.request_error); }
    });
}

var edit_notification_save = function() {
    var $this_button = $(this);
    if ( $this_button.prop("disabled") || $this_button.hasClass("-disable") || $this_button.hasClass("-disabled") ) return false; //if disabled, do nothing
    var $save_button = $(this).closest(".modal").find(".save-button");

    var modal = $("#" +edit_notification_modal.data.id);
    var settings_data = {
        action : "admin_actions",
        WishListMemberAction : "save",
    };
    text_content = "";
    if ( tinymce.editors.length ) {
        settings_data[ modal.find(".email-editor").data("name")] =  tinymce.editors[modal.find(".email-editor").data("name")].getContent();
    } else {
       settings_data[ modal.find(".email-editor").data("name")] = modal.find(".email-editor").val()
    }

    $("#edit-notification-modal").find(".content-wrapper").save_settings({
        data: settings_data,
        on_init: function( $me, $data) {
            $this_button.disable_button({disable:true, icon:"update"});
            $save_button.disable_button({disable:true});
        },
        on_success: function( $me, $result) {
            var btn_id = $("#edit-notification-modal").find(".modal-footer .notification-button-id").val();
            if ( $this_button.hasClass("-close") ) $('#edit-notification-modal').modal('toggle');
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
            $save_button.disable_button({disable:false});
        },
        on_done: function( $me, $data) {
            $this_button.disable_button( {disable:false, icon:"save"} );
            $save_button.disable_button({disable:false});
        }
    });
}

$("#edit-notification-modal").on("hidden.bs.modal", function () { //clear modal when closed
    $("#" +edit_notification_modal.data.id).find(".content-wrapper").html("");
    $("#" +edit_notification_modal.data.id).find(".save-button").hide();
    $("#" +edit_notification_modal.data.id).find(".modal-title").html(wp.i18n.__( 'Loading settings, please wait...', 'wishlist-member' ));
});