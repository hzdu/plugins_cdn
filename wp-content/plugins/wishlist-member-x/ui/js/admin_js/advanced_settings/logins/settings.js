jQuery(function($) {
  edit_notification_modal = new wlm3_modal('#edit-notification-modal-info', function() {
    var $this_button = $(this);
    if ($this_button.prop("disabled") || $this_button.hasClass("-disable") || $this_button.hasClass("-disabled")) return false; //if disabled, do nothing
    var $save_button = $(this).closest(".modal").find(".save-button");

    var modal = $("#" + edit_notification_modal.data.id);
    var settings_data = {
      action: "admin_actions",
      WishListMemberAction: "save",
    };
    text_content = "";
    if (tinymce.editors.length) {
      settings_data[modal.find(".email-editor").data("name")] = tinymce.editors[modal.find(".email-editor").data("name")].getContent();
    } else {
      settings_data[modal.find(".email-editor").data("name")] = modal.find(".email-editor").val()
    }

    $("#edit-notification-modal").find(".content-wrapper").save_settings({
      data: settings_data,
      on_init: function($me, $data) {
        $this_button.disable_button({
          disable: true,
          icon: "update"
        });
        $save_button.disable_button({
          disable: true
        });
      },
      on_success: function($me, $result) {
        var btn_id = $("#edit-notification-modal").find(".modal-footer .notification-button-id").val();
        if ($this_button.hasClass("-close")) $('#edit-notification-modal').modal('toggle');
        $(".wlm-message-holder").show_message({
          message: $result.msg,
          type: $result.msg_type,
          icon: $result.msg_type
        });
      },
      on_fail: function($me, $data) {
        alert(WLM3VARS.request_failed);
      },
      on_error: function($me, $error_fields) {
        $.each($error_fields, function(key, obj) {
          obj.parent().addClass('has-error');
        });
        $this_button.disable_button({
          disable: false,
          icon: "save"
        });
        $save_button.disable_button({
          disable: false
        });
      },
      on_done: function($me, $data) {
        $this_button.disable_button({
          disable: false,
          icon: "save"
        });
        $save_button.disable_button({
          disable: false
        });
      }
    });
  });

  $('.edit-notification').click(function() {
    edit_notification_modal.open();
  });

  $('.email-reset-button').click(function() {
    var name = $(this).data('target');
    var subject = name + '_subject';
    var message = name + '_message';
    $(':input[name="' + subject + '"]').val(default_data[subject]).change();
    var textarea = $(':input[name="' + message + '"]');
    textarea.val(default_data[message]);
    tinymce.get(textarea[0].id).setContent(default_data[message]);
  })
});

jQuery(function($) {
  $('.login-limit-apply').apply_cancel()
    .on('apply.apply_cancel', function(e) {
      $(this).apply_cancel('hide');
      $(this).parent().save_settings({
        data: {
          action: "admin_actions",
          WishListMemberAction: "save",
        },
        on_success: function(me, result) {
          var i = $(me).find(':input[name=login_limit]');
          i.data('initial', i.val());
        },
        on_done: function(me, result) {
          $('.wlm-message-holder').show_message({
            message: result.msg,
            type: result.msg_type
          });
        }
      });
    })
    .on('cancel.apply_cancel', function(e) {
      $(this).val($(this).data('initial')).trigger('change');
    });

  $('.login-limit-error-apply').apply_cancel()
    .on('apply.apply_cancel', function(e) {
      $(this).apply_cancel('hide');
      $(this).parent().save_settings({
        data: {
          action: "admin_actions",
          WishListMemberAction: "save",
        },
        on_success: function(me, result) {
          var i = $(me).find(':input[name=login_limit_error]');
          i.data('initial', i.val());
        },
        on_done: function(me, result) {
          $('.wlm-message-holder').show_message({
            message: result.msg,
            type: result.msg_type
          });
        }
      });
    })
    .on('cancel.apply_cancel', function(e) {
      $(this).val($(this).data('initial')).trigger('change');
    });
});