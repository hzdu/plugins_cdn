(function ($) {
  var progress_bar_enable = false;
  var width = 0;
  var UR_Import_User_Admin = {
    init: function () {
      // After uploading csv file user clicks on mapping buttons.
      $(".ur_import_users_action_button").on("click", function () {
        UR_Import_User_Admin.mapping_csv_file();
      });

      // After Mapping completion user clicks on import user buttons.
      $(document).on("click", ".ur_import_mapped_column_button", function () {
        UR_Import_User_Admin.import_mapped_users();
      });

      // On CSV Title changed checked whether required field are selected to do not import or not.
      $(document).on("change", ".csv_title", function () {
        if (
          "" !== this.value &&
          1 ===
            $(this)
              .closest(".ur-table-map-field")
              .find(".ur-table-map-label-invalid").length
        ) {
          $(this).removeClass("is_required");
          $(this)
            .closest(".ur-table-map-field")
            .find(".ur-table-map-label-invalid")
            .remove();
        }
      });
    },
    /**
     * After Uploading CSV file user clicks on mapping button where the mapping starts.
     *
     * @since  1.0.0
     */
    mapping_csv_file: function () {
      var file_data = $("#csvfile").prop("files")[0];
      var form_id = $("#form_id").val();
      var form_data = new FormData();

      form_data.append("csvfile", file_data);
      form_data.append("form_id", form_id);
      form_data.append("action", "user_registration_import_users_action");
      form_data.append(
        "security",
        uriu_upload_script_data.uriu_import_users_save
      );

      $.ajax({
        url: uriu_upload_script_data.ajax_url,
        dataType: "json", // what to expect back from the PHP script, if anything
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,
        type: "post",
        beforeSend: function () {
          var spinner = '<span class="ur-spinner is-active"></span>';

          $(".ur_import_users_action_button").append(spinner);
          $(".ur-import_notice").remove();
        },
        complete: function (response) {
          $(".ur_import_users_action_button").find(".ur-spinner").remove();

          if (response.responseJSON.success === true) {
            $("#importusers_div").hide();
            UR_Import_User_Admin.display_column_mapping(
              response.responseJSON.data
            );
          } else {
            $(".ur-import_notice").remove();
            var message_string =
              '<div id="message" class="error inline ur-import_notice"><p><strong>' +
              response.responseJSON.data.message +
              "</strong></p></div>";
            $(".ur-export-users-page").prepend(message_string);
            $("#csvfile").val("");
          }
        },
      });
    },
    /**
     * This functions shows mapping field with respective form field with csv titles.
     *
     * @since  1.0.0
     */
    display_column_mapping: function (data) {
      var csv_title = data.csv_title;
      csv_title = csv_title.split(",");

      var form_fields = data.form_fields;
      var column_mapping_html = "";
      column_mapping_html +=
        '<form id="column_mapping_form" method="post" class="ur-import-users-map-page">';
      column_mapping_html += '<div class="postbox">';
      column_mapping_html +=
        '<table id="column_mapping_html" class="table user-registration-table">';
      column_mapping_html +=
        "<caption>" + uriu_upload_script_data.uriu_map_csv_title + "</caption>";
      column_mapping_html += "<thead>";
      column_mapping_html +=
        '<th width="50%">' + uriu_upload_script_data.uriu_form_label + "</th>";
      column_mapping_html +=
        '<th width="50%">' +
        uriu_upload_script_data.uriu_map_to_field +
        "</th>";
      column_mapping_html += "</thead>";
      $.each(form_fields, function (key, label) {
        column_mapping_html += "<tr>";
        column_mapping_html +=
          '<td class="ur-table-map-label">' +
          label +
          '<span class="ur-table-map-label-desc">' +
          key +
          "</span></td>";
        column_mapping_html += '<td class="ur-table-map-field">';
        column_mapping_html += '<select name="' + key + '" class="csv_title">';
        if ("user_role" === key) {
          column_mapping_html +=
            '<option value="default_role" selected = selected >' +
            uriu_upload_script_data.uriu_default +
            "</option>";
        } else if ("user_registered" === key) {
          column_mapping_html +=
            '<option value="current_date" selected = selected >' +
            uriu_upload_script_data.uriu_current_date +
            "</option>";
        } else {
          column_mapping_html +=
            '<option value="" >' +
            uriu_upload_script_data.uriu_do_not_import +
            "</option>";
        }
        $.each(csv_title, function (index, title) {
          form_label = label.replace(/\"/g, "");
          form_label = form_label.replace(/\ /g, "_");
          form_label = form_label.toLowerCase();
          form_label = form_label.split("[");

          title = title.replace(/\"/g, "");
          title_key = title.replace(/\ /g, "_");
          title_key = title_key.toLowerCase();
          title_key = title_key.split("[");
          column_mapping_html += '<option value="' + title_key[0] + '" ';

          if (title_key[0] === form_label[0]) {
            column_mapping_html += "selected = selected";
          }

          column_mapping_html += " >" + title + "</option>";
        });

        column_mapping_html += "</select>";
        column_mapping_html += "</td>";
        column_mapping_html += "</tr>";
      });

      column_mapping_html += "<tfoot>";
      column_mapping_html += "<tr>";
      column_mapping_html += '<td colspan="2" style="border-bottom: none">';
      column_mapping_html += '<div class="publishing-action">';
      column_mapping_html +=
        '<button type="button" name="ur_import_mapped_column_button" class="button button-primary ur_import_mapped_column_button"> ' +
        uriu_upload_script_data.uriu_import_users_button +
        " </button>";
      column_mapping_html += "</div>";
      column_mapping_html += "</td>";
      column_mapping_html += "</tr>";
      column_mapping_html += "</tfoot>";

      column_mapping_html += "</table>";
      column_mapping_html += "</div>";
      column_mapping_html +=
        '<input type="hidden" name="form_id" value="' + data.form_id + '">';
      column_mapping_html += "</form>";

      $(".nav-tab-inside").prepend(column_mapping_html);
    },
    /**
     * After Mapping Complete Import User Button Click where importing users starts.
     *
     * @since  1.0.0
     */
    import_mapped_users: function () {
      var form_data = {
        data: $("form").serializeArray(),
        action: "user_registration_import_mapped_users_action",
        security: uriu_upload_script_data.uriu_import_users_save,
      };

      $.ajax({
        url: uriu_upload_script_data.ajax_url,
        data: form_data,
        type: "POST",
        beforeSend: function () {
          var spinner = '<span class="ur-spinner is-active"></span>';
          $(".ur_import_mapped_column_button").append(spinner);
          $(".ur-import_notice").remove();
        },
        complete: function (response) {
          $(".ur_import_mapped_column_button").find(".ur-spinner").remove();
          $(".ur-import_notice").remove();

          var message_string = "";

          if (response.responseJSON.success === true) {
            $("#importusers_div").show();
            $("#column_mapping_form").remove();
            UR_Import_User_Admin.show_import_notice();
          } else {
            if (
              "undefined" !== typeof response.responseJSON.data.required_list
            ) {
              $.each(
                response.responseJSON.data.required_list,
                function (index, value) {
                  if (
                    0 ===
                    $("select[name=" + value)
                      .closest(".ur-table-map-field")
                      .find(".ur-table-map-label-invalid").length
                  ) {
                    $("select[name=" + value).addClass("is_required");
                    $("select[name=" + value).after(
                      "<span class='ur-table-map-label-invalid'>" +
                        uriu_upload_script_data.uriu_this_field_is_required +
                        ".</span>"
                    );
                  }
                }
              );
            }
            message_string =
              '<div id="message" class="error inline ur-import_notice"><p><strong>' +
              response.responseJSON.data.message +
              "</strong></p></div>";
          }

          $(".ur-export-users-page").prepend(message_string);
          $("html,body").animate(
            {
              scrollTop: $("div.user-registration").offset().top - 100,
            },
            1000
          );
        },
      });
    },
    /**
     * This functions shows the progess bar in notice area after import users starts.
     *
     * @since  1.0.0
     */
    show_import_notice: function () {
      var form_data = {
        data: "",
        action: "user_registration_import_users_notice_action",
        security: uriu_upload_script_data.uriu_import_users_save,
      };
      $.ajax({
        url: uriu_upload_script_data.ajax_url,
        data: form_data,
        type: "POST",
        complete: function (response) {
          if (response.responseJSON.success === true) {
            if (response.responseJSON.data.notice !== "") {
              if (
                response.responseJSON.data.notice.progress_bar_enable ===
                  true &&
                progress_bar_enable === true
              ) {
                if (
                  typeof response.responseJSON.data.notice.percentage !=
                  "undefined"
                ) {
                  if (width <= response.responseJSON.data.notice.percentage) {
                    width = response.responseJSON.data.notice.percentage;
                    $(".user-registration-progress-bar").attr(
                      "style",
                      "width:" +
                        response.responseJSON.data.notice.percentage +
                        "%"
                    );
                    $(".user-registration-progress-bar").attr(
                      "aria-valuenow",
                      response.responseJSON.data.notice.percentage
                    );
                    $(".user-registration-progress-bar").html(
                      response.responseJSON.data.notice.percentage + "%"
                    );
                    $(".ur-import_notice").css("display", "block");
                  }
                }
                UR_Import_User_Admin.show_import_notice();
              } else {
                $(".ur-import_notice").remove();
                var message_string = "";
                var notice_bar =
                  response.responseJSON.data.notice.status === true
                    ? "notice-success"
                    : "notice-info";
                message_string +=
                  '<div id="user_registration_import_users_notice" class="notice ' +
                  notice_bar +
                  ' is-dismissible ur-import_notice">';
                message_string +=
                  "<p>" + response.responseJSON.data.notice.message + "</p>";
                if (!response.responseJSON.data.notice.status) {
                  message_string += '<div class="user-registration-progress">';
                  message_string +=
                    '<div class="user-registration-progress-bar" style="width:' +
                    response.responseJSON.data.notice.percentage +
                    '%" aria-valuenow="' +
                    response.responseJSON.data.notice.percentage +
                    '" role="progressbar" aria-valuemin="0" aria-valuemax="100">' +
                    response.responseJSON.data.notice.percentage +
                    "%</div>";
                  message_string += "</div>";
                  progress_bar_enable = true;
                }
                if (notice_bar === "notice-success") {
                  progress_bar_enable = false;
                }
                message_string += "<p>";
                if (
                  typeof response.responseJSON.data.notice
                    .invaild_users_data !== "undefined"
                ) {
                  message_string +=
                    '<form id="invalid_users_form" method="post">';
                  message_string +=
                    '<input type="submit" name="download_csv_invalid_user" class="button button-primary" value="' +
                    uriu_upload_script_data.uriu_invalid_users_download_button +
                    '">';
                  message_string += "</form>";
                  progress_bar_enable = false;
                }
                message_string +=
                  '<button type="button" class="notice-dismiss"><span class="screen-reader-text">Dismiss this notice.</span></button>';
                message_string += "</p>";
                message_string += "</div>";
                $("h1").first().after(message_string);
                if (progress_bar_enable) {
                  UR_Import_User_Admin.show_import_notice();
                }
                $(".ur-import_notice").css("display", "block");
              }
            }
          }
        },
      });
    },
  };

  $(document).ready(function () {
    UR_Import_User_Admin.init();

    /**
     * If user did not dismiss the notice then it's shows the notice after re-visiting the same page.
     *
     * @since  1.0.0
     */
    if ($("#user_registration_import_users_notice").length) {
      UR_Import_User_Admin.show_import_notice();
    }
  });
})(jQuery);
