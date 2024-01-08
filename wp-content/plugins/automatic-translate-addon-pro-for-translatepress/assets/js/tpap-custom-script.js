const tpAutoTranslator = (function (window, $) {
  //get plugin configuration object.
  const configData = window.extradata;
  const {
    ajax_url: ajaxUrl,
    nonce: nonce,
    license_key: licensekeys,
  } = configData;
  var dict_id = new Array();
  var gettxt_id = new Array();
  onLoad();

  function onLoad() {
    var default_lang = $("#trp-language-select")
      .find("option:first-child")
      .val();
    var pageLang = tpap_language_code(default_lang);
    localStorage.setItem("page_lang", pageLang);

    //create strings modal
    createStringsModal("yandex");
    createStringsModal("google");
  }

  function initialize() {
    var default_lang = $("#trp-language-select")
      .find("option:first-child")
      .val();
    var getSelectedlang = $("#trp-language-select").val();

    // Embbed Auto Translate button inside Translatepress editor
    if ($("#tpap-auto-btn").length === 0) {
      addAutoTranslatepressBtn(default_lang, getSelectedlang);
    }

    //append auto translate settings model
    settingsModel();

    //on click on auto tranlsate button
    $("#tpap-auto-btn").on("click", function () {
      openSettingsModel();
    });

    //on click on yandex transllate button
    $("#tpap_yandex_transate_btn").on("click", function () {
      onYandexTranslateClick();
    });

    //on click on google translate button
    $("#tpap_gtranslate_btn").on("click", function () {
      onGoogleTranslateClick();
    });

    //on google translation
    $("#google_translate_element").change(function () {
      translation_process();
    });

    //on click on merge button
    $(".save_it").on("click", onSaveClick);
  }

  function addAutoTranslatepressBtn(default_lang, getSelectedlang) {
    $("#trp-language-switch").before(
      '<div><label class="tpap-steps">Step 1 - Select Language</label></div>'
    );
    $("#trp-next-previous").after(
      '<div><label class="tpap-steps">Step 2 - Click Auto Translate Button</label></div><button id="tpap-auto-btn">Auto Translate</button><div class="tpap-user-message">Translate all plain strings of current page </div>'
    );
    $("#tpap-auto-btn").attr("disabled", true);
    $("#tpap-auto-btn").removeClass("enabled");
  }

  //Enable/disable the automatic translate button
  setInterval(enableAutotranslateButton, 200);
  function enableAutotranslateButton() {
    var default_lang = $("#trp-language-select")
      .find("option:first-child")
      .val();
    var getSelectedlang = $("#trp-language-select").val();

    // Check if the loader is hidden
    var isLoaderHidden = $("#trp-preview-loader").css("display") === "none";
    var isAjaxLoaderHidden = $('#trp-string-saved-ajax-loader').css("display") == "none";
    var newButtonState = default_lang !== getSelectedlang && isLoaderHidden && isAjaxLoaderHidden;

    // Enable or disable the button based on the condition
    if (newButtonState) {
      $("#tpap-auto-btn").addClass("enabled");
      $("#tpap-auto-btn").attr("disabled", false);
    } else {
      $("#tpap-auto-btn").removeClass("enabled");
      $("#tpap-auto-btn").attr("disabled", true);
    }
  }

  function settingsModel() {
    let ytPreviewImg = extradata["yt_preview"];
    let gtPreviewImg = extradata["gt_preview"];
    let licensekey = extradata["license_key"];
    var class_name = "enabled";
    if (licensekey == "No") {
      var class_name = "disabled";
    }

    let modelHTML = `<!-- The Modal -->
    <div id="tpap-dialog" title="Step 3 - Select Translation Provider" >
    <div class="tpap-settings" style="opacity:1;">
    <strong class="tpap-heading" style="margin-bottom:10px;display:inline-block;">Translate Using Yandex Page Translate Widget</strong>
    <div class="inputGroup">
    <button id="tpap_yandex_transate_btn" class="notranslate button button-primary tpap-translate" data-translate-engen="yandex">Yandex Translate</button>
    <span class="proonly-button alsofree">✔ Available</span>
    <br/><a href="https://translate.yandex.com/" target="_blank"><img style="margin-top: 5px;" src="${ytPreviewImg}" alt="powered by Yandex Translate Widget"></a>
    </div>
    <hr/>
    <strong class="tpap-heading" style="margin-bottom:10px;display:inline-block;">Translate Using Google Page Translate Widget</strong>
    <div class="inputGroup">
    <button id="tpap_gtranslate_btn"  class="notranslate button button-primary tpap-translate" ${class_name} data-translate-engen="google">Google Translate</button>
    <span class="proonly-button alsofree">✔ Available</span>
    <br/><a href="https://translate.google.com/" target="_blank"><img style="margin-top: 5px;" src="${gtPreviewImg}" alt="powered by Google Translate Widget"></a>
    </div>
    <hr/>
    <ul class="tpap-feature" style="margin: 0;">
    <li><span style="color:green">✔</span> Unlimited Translations<br/></li>
    <li><span style="color:green">✔</span> No API Key Required</li>
    <li><span style="color:green">✔</span> Check Languages Support - <a href="https://yandex.com/support/translate/supported-langs.html" target="_blank">Yandex</a>, <a href="https://en.wikipedia.org/wiki/Google_Translate#Supported_languages" target="_blank">Google</a></li>
    </ul>
    </div>
    </div>`;
    $("body").append(modelHTML);
  }

  function openSettingsModel() {
    //Get Dictionary Ids
    $('#trp-string-categories optgroup option[data-group="String List"]').each(
      function (x, el) {
        var data_group = $(this).attr("data-group");
        var database_id = $(this).attr("data-database-id");
        var id = $(this).attr("value");
        var person = database_id;
        dict_id[x] = database_id;
      }
    );

    //Get Gettext Ids
    $(
      '#trp-string-categories optgroup option[data-group="Gettext Strings"]'
    ).each(function (x, el) {
      var data_group = $(this).attr("data-group");
      var database_id = $(this).attr("data-database-id");
      var id = $(this).attr("value");
      var person = database_id;
      gettxt_id[x] = database_id;
    });
    var getSelectedlang = $("#trp-language-select").val();
    var default_lang = $("#trp-language-select")
      .find("option:first-child")
      .val();
    var defaultLang = tpap_language_code(getSelectedlang);
    localStorage.setItem("language_code", defaultLang);
    localStorage.setItem("language_name", getSelectedlang);
    localStorage.setItem("default_language", default_lang);
    localStorage.setItem("dictionary_id", dict_id);
    localStorage.setItem("gettxt_id", gettxt_id);

    createPopup();
  }

  // create auto translate popup
  function createPopup() {
    var style = $("#tpap-dialog")
      .dialog({
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
          Cancel: function () {
            $(this).dialog("close");
          },
        },
      })
      .css("background-color", "#E4D4D4");
  }

  function onYandexTranslateClick() {
    $('.tpap-preloader-wrap').show();
    $('.modal-body').hide();
    var tr_type = $('#tpap_yandex_transate_btn').attr("data-translate-engen");
    $(".save_it").prop("disabled", true);
    $(".tpap-stats").css("display", "none");
    var default_code = localStorage.getItem("language_code");
    var arr = ['en', 'pl', 'af', 'jv', 'no', 'am', 'ar', 'az', 'ba', 'be', 'bg', 'bn', 'bs', 'ca', 'ceb', 'cs', 'cy', 'da', 'de', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fa', 'fi', 'fr', 'ga', 'gd', 'gl', 'gu', 'he', 'hi', 'hr', 'ht', 'hu', 'hy', 'id', 'is', 'it', 'ja', 'jv', 'ka', 'kk', 'km', 'kn', 'ko', 'ky', 'la', 'lb', 'lo', 'lt', 'lv', 'mg', 'mhr', 'mi', 'mk', 'ml', 'mn', 'mr', 'mrj', 'ms', 'mt', 'my', 'ne', 'nl', 'no', 'pa', 'pap', 'pl', 'pt', 'ro', 'ru', 'si', 'sk', 'sl', 'sq', 'sr', 'su', 'sv', 'sw', 'ta', 'te', 'tg', 'th', 'tl', 'tr', 'tt', 'udm', 'uk', 'ur', 'uz', 'vi', 'xh', 'yi', 'zh'];
    if (arr.includes(default_code)) {
      $(".modal-body .translator-widget, .notice-info, .is-dismissible").show();
      addStringsInModal(tr_type);
    } else {
      $('.tpap-preloader-wrap').hide();
      $('.modal-body').show();
      $(".notice-container")
        .addClass("notice inline notice-warning")
        .html("Yandex Automatic Translator Does not support this language.");
      $(
        ".string_container, .choose-lang, .save_it, .notice-info, .is-dismissible"
      ).hide();
      $(".modal-body .translator-widget").hide();
    }
    var style1 = {};
    $("#tpap_yandex_transate_btn").css(style1);
    $("#tpap-dialog").dialog("close");
    $(".yandex-widget-container").fadeIn("slow");
  }

  function onGoogleTranslateClick(){
    $('.tpap-preloader-wrap').show();
    $('.modal-body').hide();
    var tr_type = $('#tpap_gtranslate_btn').attr("data-translate-engen");
    $(".save_it").prop("disabled", true);
    $(".tpap-stats").css("display", "none");
    var default_code = localStorage.getItem("language_code");
    var arr = ['en', 'pl', 'af', 'jv', 'no', 'am', 'ar', 'az', 'ba', 'be', 'bg', 'bn', 'bs', 'ca', 'ceb', 'cs', 'cy', 'da', 'de', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fa', 'fi', 'fr', 'ga', 'gd', 'gl', 'gu', 'he', 'hi', 'hr', 'ht', 'hu', 'hy', 'id', 'is', 'it', 'ja', 'jv', 'ka', 'kk', 'km', 'kn', 'ko', 'ky', 'la', 'lb', 'lo', 'lt', 'lv', 'mg', 'mhr', 'mi', 'mk', 'ml', 'mn', 'mr', 'mrj', 'ms', 'mt', 'my', 'ne', 'nl', 'no', 'pa', 'pap', 'pl', 'pt', 'ro', 'ru', 'si', 'sk', 'sl', 'sq', 'sr', 'su', 'sv', 'sw', 'ta', 'te', 'tg', 'th', 'tl', 'tr', 'tt', 'udm', 'uk', 'ur', 'uz', 'vi', 'xh', 'yi', 'zh'];
    if (arr.includes(default_code)) {
      $(".modal-body .translator-widget, .notice-info, .is-dismissible").show();
      addStringsInModal(tr_type, default_code);
    }else {
      $('.tpap-preloader-wrap').hide();
      $('.modal-body').show();
      $(".notice-container")
        .addClass("notice inline notice-warning")
        .html("Google Automatic Translator Does not support this language.");
      $(
        ".string_container, .choose-lang, .save_it, .notice-info, .is-dismissible"
      ).hide();
      $(".modal-body .translator-widget").hide();
    }
    var style1 = {};
    $("#tpap_gtranslate_btn").css(style1);
    $("#tpap-dialog").dialog("close");
    $(".google-widget-container").fadeIn("slow");
  }

  function translation_process() {
    var container = $(".google-widget-container");
    container.find(".string_container").scrollTop(0);
    var scrollHeight = container.find(".string_container").get(0).scrollHeight;
    var scrollSpeed = 800;
    if (scrollHeight > scrollSpeed) {
      scrollSpeed = scrollHeight;
    }
    if (scrollHeight !== undefined && scrollHeight > 100) {
      container.find(".my_translate_progress").fadeIn("slow");
      setTimeout(() => {
        container.find(".string_container").animate(
          {
            scrollTop: scrollHeight + 2000,
          },
          scrollSpeed * 2,
          "linear"
        );
      }, 1000);
      container.find(".string_container").on("scroll", function () {
        if (
          $(this).scrollTop() + $(this).innerHeight() + 50 >=
          $(this)[0].scrollHeight
        ) {
          setTimeout(() => {
            container.find(".save_it").prop("disabled", false);
            container.find(".tpap-stats").fadeIn("slow");
            container.find(".my_translate_progress").fadeOut("slow");
            container.find(".string_container").stop();
            $("body").css("top", "0");
          }, 1500);
        }
      });
      if (
        container.find(".string_container").innerHeight() + 10 >=
        scrollHeight
      ) {
        setTimeout(() => {
          container.find(".save_it").prop("disabled", false);
          container.find(".tpap-stats").fadeIn("slow");
          container.find(".my_translate_progress").fadeOut("slow");
          container.find(".string_container").stop();
          $("body").css("top", "0");
        }, 1500);
      }
    } else {
      setTimeout(() => {}, 2000);
    }
  }

  function addStringsInModal(tr_type, default_code) {
    var language_code = localStorage.getItem("language_name");
    var default_lang = localStorage.getItem("default_language");
    var current_page_db_id = localStorage.getItem("dictionary_id");
    var gettxt_id = localStorage.getItem("gettxt_id");
    var request_data = {
      action: "tpap_get_strings",
      data: language_code,
      dictionary_id: current_page_db_id,
      gettxt_id: gettxt_id,
      default_lang: default_lang,
      _ajax_nonce: nonce,
    };
    $.ajax({
      type: "POST",
      url: ajaxUrl,
      dataType: "json",
      data: request_data,
      success: function (response) {
        var plainStrArr = response;
        var strings = new Array();
        var group = new Array();
        var idss = new Array();
        var i = 0;
        plainStrArr.forEach(function (entry) {
          strings[i] = entry.strings;
          group[i] = entry.data_group;
          idss[i] = entry.database_ids;
          i++;
        });
        if (plainStrArr.length > 0) {
          $(".tpap-preloader-wrap").hide();
          $("#tpap-notice-check").show();
          $(".modal-body").show();
          if (tr_type == "google") {
            if (licensekeys == "No") {
              $("#tpap-notice-check").remove();
              $(".choose-lang").before(
                '<div class="notice inline notice-info is-dismissible" id="tpap-notice-check" style="">Automatic Translate Addon For TranslatePress (Pro) - License key is missing! Please add your License key in the settings panel to activate all premium features.</div>'
              );
              return;
            } else {
              $("html").addClass("notranslate");
              googleTranslateElementInit(default_code);
              printStringsInPopup(strings, tr_type, group, idss);
            }
          } else {
            $("html").attr("translate", "no");
            printStringsInPopup(strings, tr_type, group, idss);
          }
        } else {
          $('.tpap-preloader-wrap').hide();
          $('.modal-body .translator-widget, .notice-info, .is-dismissible').hide();
          $(".modal-body").show();

          if ($(".tpap_custom_model .notice-container").length > 0) {
            $(".notice-container")
              .addClass("notice inline notice-warning")
              .html("There is no plain string available for translations.");
          } else {
            $(".modal-content").append("<div class='notice-container'></div>");
            $(".notice-container")
              .addClass("notice inline notice-warning")
              .html("There is no plain string available for translations.");
          }
          $(".string_container").hide();
          $(".choose-lang").hide();
          $(".save_it").hide();
        }
      },
    });
  }

  function printStringsInPopup(jsonObj, type, group, idss) {
    if (type == "google" && licensekeys == "No") {
      return;
    }
    $(".notice-container.notice.inline.notice-warning").remove();
    $(".string_container").show();
    $(".choose-lang").show();
    $(".save_it").show();
    var html = "";
    var totalTChars = 0;
    var index = 1;
    if (jsonObj) {
      for (const key in jsonObj) {
        if (jsonObj.hasOwnProperty(key)) {
          const groups = group[key];
          const element = jsonObj[key];
          if (element.source != "") {
            if (type == "google" || type == "yandex") {
              html += `<tr id="${key}"><td>${index}</td><td  class="notranslate source" data-group= "${group[key]}" data-db-id =" ${idss[key]}">${element}</td>`;
            } else {
              if (key > 2500) {
                break;
              }
              html += `<tr id="${key}"><td>${index}</td><td  class="notranslate source" data-group= "${group[key]}" data-db-id =" ${idss[key]}">${element}</td>`;
            }
            if (type == "google" || type == "yandex") {
              html += `<td translate ="yes" class = "target translate">${element}</td></tr>`;
            } else {
              html += `<td class ="target translate"></td></tr>`;
            }
            index++;
            totalTChars += element.length;
          }
        }
      }
      $(".tpap-stats").each(function () {
        $(this).find(".totalChars").html(totalTChars);
      });
    }
    $(`#${type}_tpap_string_tbl_body`).html(html);
  }

  $(".tpap_custom_model").find(".notice-dismiss").on("click", function () {
    $(".notice.inline.notice-info.is-dismissible").fadeOut("slow");
  });
  
  // Get the <span> element that closes the modal
  $(".tpap_custom_model").find(".close").on("click", function () {
    $(".tpap_custom_model").fadeOut("slow");
    location.reload(true);
    tpa_google_Reset();
  });
  
  window.tpa_google_Reset = () => $('#\\:1\\.container').contents().find('#\\:1\\.restore').click();
  function createStringsModal(widgetType) {
    //Set wrapper, header, and body classes based on widgetType
    let { wrapperCls, headerCls, bodyCls, footerCls } =
      getWidgetClasses(widgetType);
    let modelHTML = `
    <div id="tpap_strings_model" class="modal tpap_custom_model ${wrapperCls}">
    <div class="modal-content">
    <input type="hidden" id="project_id" >
    ${modelHeaderHTML(widgetType, headerCls)}   
    ${modelBodyHTML(widgetType, bodyCls)}   
    ${modelFooterHTML(widgetType, footerCls)}
    </div></div>`;
    $("body").append(modelHTML);
  }

  // Get widget classes based on widgetType
  function getWidgetClasses(widgetType) {
    let wrapperCls = "";
    let headerCls = "";
    let bodyCls = "";
    let footerCls = "";
    switch (widgetType) {
      case "yandex":
        wrapperCls = "yandex-widget-container";
        headerCls = "yandex-widget-header";
        bodyCls = "yandex-widget-body";
        footerCls = "yandex-widget-footer";

        break;
      case "google":
        wrapperCls = "google-widget-container";
        headerCls = "google-widget-header";
        bodyCls = "google-widget-body";
        footerCls = "google-widget-footer";

        break;
      default:
        // Default class if widgetType doesn't match any case
        wrapperCls = "yandex-widget-container";
        headerCls = "yandex-widget-header";
        bodyCls = "yandex-widget-body";
        footerCls = "yandex-widget-footer";
        break;
    }
    return { wrapperCls, headerCls, bodyCls, footerCls };
  }

  function modelHeaderHTML(widgetType, headerCls) {
    const HTML = `<div class="modal-header ${headerCls}">
    <span class="close ">&times;</span>
    <h2 class="notranslate">Step 4 - Start Automatic Translation Process</h2>
    <div class="save_btn_cont">
    <button class="notranslate save_it button button-primary" disabled="true">Merge Translation</button>
    </div>
    <div style="display:none" class="tpap-stats hidden">
    Wahooo! You have saved your valuable time via auto translating 
    <strong class="totalChars"> </strong> characters  using <strong> 
    <a href="https://wordpress.org/plugins/automatic-translate-addon-for-translatepress/#reviews" target="_new">
    Automatic Translate Addon For TranslatePress</a></strong>     
    </div></div>
    <div class="notice inline notice-info is-dismissible" id="tpap-notice-check">Machine translations are not 100% correct.
    Please verify strings before using on production website.
    <button type="button" class="notice-dismiss"><span class="screen-reader-text">Dismiss this notice.</span></button></div>
    <div class="tpap-preloader-wrap">
    <div class="ph-item">
    <div class="ph-col-12">
    <div class="ph-row">
    <div class="ph-col-6 big"></div>
    <div class="ph-col-4  big"></div>
    <div class="ph-col-2 big"></div>
    <div class="ph-col-4"></div>
    <div class="ph-col-8 "></div>
    <div class="ph-col-6"></div>
    <div class="ph-col-6 "></div>
    <div class="ph-col-12"></div>
    <div class="ph-col-4"></div>
    <div class="ph-col-8 "></div>
    <div class="ph-col-6"></div>
    <div class="ph-col-6 "></div>
    <div class="ph-col-12"></div>
    <div class="ph-col-4"></div>
    <div class="ph-col-8 "></div>
    <div class="ph-col-6"></div>
    <div class="ph-col-6 "></div>
    <div class="ph-col-12"></div>
    <div class="ph-col-6 big"></div>
    <div class="ph-col-4  big"></div>
    <div class="ph-col-2 big"></div>
    </div>
    </div>
    </div>
    </div>`;
    return HTML;
  }

  function modelBodyHTML(widgetType, bodyCls) {
    const HTML = `<div class="modal-body  ${bodyCls}">
    <div class="my_translate_progress">Automatic translation is in progress....<br/>It will take few minutes, enjoy ☕ coffee in this time!<br/><br/>Please do not leave this window or browser tab while translation is in progress...</div>
    ${translatorWidget(widgetType)}
    <div class="string_container">               
    <table class="scrolldown" id="stringTemplate">
    <thead>
    <th class="notranslate">S.No</th>
    <th class="notranslate">Source Text</th>
    <th class="notranslate">Translation</th>
    </thead>
    <tbody id="${widgetType}_tpap_string_tbl_body">
    </tbody>
    </table>
    </div>
    <div class="notice-container"></div>
    </div>`;
    return HTML;
  }

  function modelFooterHTML(widgetType, footerCls) {
    const HTML = `<div class="modal-footer ${footerCls}">
    <div class="save_btn_cont">
    <button class="notranslate save_it button button-primary" disabled="true">Merge Translation</button>
    </div>
    <div style="display:none" class="tpap-stats">
    Wahooo! You have saved your valuable time via auto translating 
    <strong class="totalChars"></strong> characters  using 
    <strong><a href="https://wordpress.org/plugins/automatic-translate-addon-for-translatepress/#reviews" target="_new">
    Automatic Translate Addon For TranslatePress</a></strong>     
    </div>
    </div>`;
    return HTML;
  }

  function translatorWidget(widgetType) {
    if (widgetType === "yandex") {
      const widgetPlaceholder = '<div id="ytWidget">..Loading</div>';
      return `
            <div class="translator-widget">
            <h3 class="choose-lang">Choose language <span class="dashicons-before dashicons-translation"></span></h3>
                ${widgetPlaceholder}
            </div>
            </br>`;
    } else if (widgetType === "google") {
      const widgetPlaceholder =
        '<div id="google_translate_element"></div>';
      return `
            <div class="translator-widget">
            <h3 class="choose-lang">Choose language <span class="dashicons-before dashicons-translation"></span></h3>
                ${widgetPlaceholder}
            </div>
            </br>`;
    } else {
      return ""; // Return an empty string for non-yandex widget types
    }
  }

  /**
   *
   * This function is used to get language code
   */
  function tpap_language_code(getSelectedlang) {
    var response = getSelectedlang.substring(0, 3);
    var default_code = "";
    var sbstr = getSelectedlang.substring(0, 3);
    if (sbstr == "nb_") {
      default_code = "no";
    } else if (sbstr == "azb") {
      default_code = "azb";
    } else if (sbstr == "ceb") {
      default_code = "ceb";
    } else if (sbstr == "arg") {
      default_code = "arg";
    } else {
      default_code = getSelectedlang.substring(0, 2);
    }
    return default_code;
  }

  function onSaveClick(){
    var translatedObj = [];
    $("#stringTemplate tbody tr").each(function (index) {
        var index = $(this).find("td.source").text();
        var source = $(this).find("td.source").text();
        var target = $(this).find("td.target").text();
        var type = $(this).find("td.source").data("group");
        var db_id = $(this).find("td.source").data("db-id");
        var language_code = localStorage.getItem("language_name");
        var default_lang = localStorage.getItem("default_language");
        translatedObj.push({
            "original": source,
            "translated": target,
            "data_group": type,
            "language_code": language_code,
            "id": db_id,
            "status": "2",
            "default_lang": default_lang
        });
    });
    var data = {
        'action': 'tpap_save_translations',
        'data': JSON.stringify(translatedObj),
        '_ajax_nonce': nonce,
    };
    // Close merge translation function
    jQuery.post(ajaxUrl, data, function (response) {
        $(".tpap_custom_model").fadeOut("slow");
        location.reload();
        tpa_google_Reset();
    });
  }

  function googleTranslateElementInit(default_codes) {
    if (licensekeys == "No") {
      $("#tpap-notice-check").remove();
      $(".choose-lang").before(
        '<div class="notice inline notice-info is-dismissible" id="tpap-notice-check" style="">Automatic Translate Addon For TranslatePress (Pro) - License key is missing! Please add your License key in the settings panel to activate all premium features.</div>'
      );
      return;
    }
    var defaultlang = "";
    var default_code = default_codes;
    var page_lang = localStorage.getItem("page_lang");
    switch (default_code) {
      case "bel":
        defaultlang = "be";
        break;
      case "he":
        defaultlang = "iw";
        break;
      case "snd":
        defaultlang = "sd";
        break;
      case "jv":
        defaultlang = "jw";
        break;
      case "nb":
        defaultlang = "no";
        break;
      case "nn":
        defaultlang = "no";
        break;
      case "zh":
        defaultlang = "zh-CN,zh-TW";
        break;
      default:
        defaultlang = default_code;
        break;
        return defaultlang;
    }

    new google.translate.TranslateElement(
      {
        pageLanguage: page_lang,
        includedLanguages: defaultlang,
        defaultLanguage: defaultlang,
        multilanguagePage: true,
      },
      "google_translate_element"
    );
  }
  // oninit
  $(document).ready(function () {
    initialize();
  });
})(window, jQuery);
