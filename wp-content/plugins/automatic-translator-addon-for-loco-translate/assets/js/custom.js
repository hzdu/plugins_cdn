 /*
                                         It is master branch code
                                     */
 ! function(window, $) {

     if (window.locoConf != undefined) {
         var locoConf = window.locoConf;
         if (locoConf.conf != undefined) {
             var allStrings = locoConf.conf.podata;
             allStrings.shift();
             var ajaxUrl = extradata.ajax_url;
             var nonces = extradata.nonce;
             var locale = locoConf.conf.locale;
             var projectId = '';
             if (locoConf.conf.project != null) {
                 projectId = locoConf.conf.project.domain + '-' + locale.lang + '_' + locale.region;
             } else {
                 projectId = 'temp-' + locale.lang + '_' + locale.region;
             }
             /*
                  since version 1.1
                  Google Translate Popup handlers
              */
             newaddAutoTranslationBtn();

             settingsModel();
             createStringsPopup();
         }
     }

     // integrates auto traslator button in editor
     function newaddAutoTranslationBtn() {
         if ($("#loco-editor nav").find("#cool-auto-translate-btn").length > 0) {
             $("#loco-editor nav").find("#cool-auto-translate-btn").remove();
         }
         const locoActions = $("#loco-editor nav").find("#loco-actions");
         const proActiveBtn = '<fieldset><button id="cool-auto-translate-btn" class="button has-icon icon-translate">Auto Translate</button></fieldset>';
         locoActions.append(proActiveBtn);
     }


     // open popup on autotranslate button click
     $("#cool-auto-translate-btn").on("click", function() {
         createPopup();
     });
     // create auto translate popup
     function createPopup() {
         $("#atlt-dialog").dialog({
             resizable: false,
             height: "auto",
             width: 400,
             modal: true,
             buttons: {
                 Cancel: function() {
                     $(this).dialog("close");
                 }
             }
         });
     }


     // Get the button that opens the modal
     // var gTranslateBtn = document.getElementById("atlt_gtranslate_btn");

     var encodeHtmlEntity = function(str) {
        var buf = [];
        for (var i=str.length-1;i>=0;i--) {
          buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
        }
        return buf.join('');
      };
     /*
     load strings in popup table 
     */
     function printStringsInPopup(jsonObj, type) {
        var html = '';
         var totalTChars = 0;
         var index = 1;
         if (jsonObj) {
             for (const key in jsonObj) {
                 if (jsonObj.hasOwnProperty(key)) {
                     const element = jsonObj[key];
                     if (element.source != '') {
                         if (type == "yandex") {
                             html += '<tr id="' + key + '" ><td>' + index + '</td><td  class="notranslate source" >' + encodeHtmlEntity(element.source) +'</td>';
                         } else {
                             if (key > 2500) {
                                 break;
                             }
                             html += '<tr id="' + key + '" ><td>' + index + '</td><td  class="notranslate source">' + element.source + '</td>';
                         }
                         if (type == "yandex") {
                             html += '<td  translate="yes"  class="target translate">' + element.source + '</td></tr>';
                         } else {
                             html += '<td class="target translate"></td></tr>';
                         }
                         index++;
                         totalTChars += element.source.length;
                     }
                 }
             }
             $(".ytstats").each(function() {
                 $(this).find(".totalChars").html(totalTChars);
             });
         }
         if (type == "yandex") {
             $("#yandex_string_tbl").html(html);
         }
     }


     /*
        String Translate Model
      */
     // Get the modal
     var gModal = document.getElementById("atlt_strings_model");

     // When the user clicks anywhere outside of the modal, close it
     window.onclick = function(event) {
         if (event.target == gModal) {
             gModal.style.display = "none";
         }
     }

     // Get the <span> element that closes the modal
     $("#atlt_strings_model").find(".close").on("click", function() {
         $("#atlt_strings_model").fadeOut("slow");
     });


     // create auto translate settings popup
     function settingsModel() {
        let ytPreviewImg = extradata['yt_preview'];
         let gtPreviewImg = extradata['gt_preview'];
         let dplPreviewImg = extradata['dpl_preview'];
         let modelHTML = ` 
        <!-- The Modal -->
        <div id="atlt-dialog" title="Step 1 - Select Translation Provider" style="display:none;">
        <div class="atlt-settings">
        
        <strong class="atlt-heading" style="margin-bottom:10px;display:inline-block;">Translate Using Yandex Page Translate Widget</strong>
        <div class="inputGroup">
        <button id="atlt_yandex_transate_btn" class="notranslate button button-primary">Yandex Translate</button>
        <span class="proonly-button alsofree">✔ Available</span>
        <br/><a href="https://translate.yandex.com/" target="_blank"><img style="margin-top: 5px;" src="${ytPreviewImg}" alt="powered by Yandex Translate Widget"></a>
        </div>
        <hr/>
  
        <strong class="atlt-heading" style="margin-bottom:10px;display:inline-block;">Translate Using Google Page Translate Widget</strong>
        <div class="inputGroup">
        <button id="atlt_gtranslate_btn" disabled="disabled" class="notranslate button button-primary">Google Translate</button>
        <span class="proonly-button"><a href="https://bit.ly/locoaddon" target="_blank" title="Buy Pro">PRO Only</a></span>
        <br/><a href="https://translate.google.com/" target="_blank"><img style="margin-top: 5px;" src="${gtPreviewImg}" alt="powered by Google Translate Widget"></a>
        </div>
        <hr/>
        
        <strong class="atlt-heading" style="margin-bottom:10px;display:inline-block;">Translate Using Deepl Doc Translator</strong>
        <div class="inputGroup">
        <button  disabled="disabled" id="atlt_deepl_btn" class="notranslate button button-primary">DeepL Translate</button>
        <span class="proonly-button"><a href="https://bit.ly/locoaddon" target="_blank" title="Buy Pro">PRO Only</a></span>
        <br/><a href="https://www.deepl.com/en/translator" target="_blank"><img style="margin-top: 5px;" src="${dplPreviewImg}" alt="powered by DeepL Translate"></a>
        <br/>DeepL translation is better than Google, Microsoft & other auto-translation providers - <a href="https://techcrunch.com/2017/08/29/deepl-schools-other-online-translators-with-clever-machine-learning/" target="_blank">read review by techcruch</a>
        </div>
        <hr/>
  
        <ul style="margin: 0;">
        <li><span style="color:green">✔</span> Unlimited Translations<br/>(<span style="font-size: 11px;color: #248e09;">*DeepL provides limited no. of free doc translations daily</span>)</li>
        <li><span style="color:green">✔</span> No API Key Required</li>
        <li><span style="color:green">✔</span> Check Languages Support - <a href="https://yandex.com/support/translate/supported-langs.html" target="_blank">Yandex</a>, <a href="https://en.wikipedia.org/wiki/Google_Translate#Supported_languages" target="_blank">Google</a>, <a href="https://www.deepl.com/en/translator" target="_blank">DeepL</a></li>
        </ul>
  
        </div>
        </div>
      `;
         $("body").append(modelHTML);
     }

     /**
      * generate model popup HTML
      */
     function createStringsPopup() {
         let modelHTML = ` 
      <!-- The Modal -->
      <div id="atlt_strings_model" class="modal atlt_custom_model">
          <!-- Modal content -->
          <div class="modal-content">
            <input type="hidden" id="project_id" value="${projectId}">
            <div class="modal-header">
              <span class="close ">&times;</span>
              <h2 class="notranslate">Step 2 - Start Automatic Translation Process</h2>
              <div class="save_btn_cont">
              <button class="notranslate save_it button button-primary" disabled="true">Merge Translation</button>
              </div>
  
              <div style="display:none" class="ytstats hidden">
                Wahooo! You have saved your valauble time via auto translating 
                 <strong class="totalChars"> </strong> characters  using 
                  <strong> 
                  <a href="https://wordpress.org/support/plugin/automatic-translator-addon-for-loco-translate/reviews/#new-post" target="_new">
                  Loco Automatic Translate Addon</a>
                </strong>     
              </div>
 
            </div>
              <div class="notice inline notice-info is-dismissible">Plugin will not translate any strings with HTML or special characters because Yandex Translator currently
               does not support HTML and special characters translations. 
              You can edit translated strings inside Loco Translate Editor after merging the translations. Only special chracters (%s, %d) fixed at the time of merging of the translations.</div>
              <div class="notice inline notice-info is-dismissible">Machine translations are not 100% correct.
               Please verify strings before using on production website.</div>
            <div class="modal-body">
              <div class="my_translate_progress">Automatic translation is in progress....<br/>It will take few minutes, enjoy ☕ coffee in this time!<br/><br/>Please do not leave this window or browser tab while translation is in progress...</div>
              <h3 class="choose-lang">Choose language <span class="dashicons-before dashicons-translation"></span></h3>
              <div id="ytWidget">..Loading</div>
              <br/>
              <div class="string_container">               
                  <table class="scrolldown" id="stringTemplate">
                      <thead>
                      <th class="notranslate">S.No</th>
                      <th class="notranslate">Source Text</th>
                      <th class="notranslate">Translation</th>
                      </thead>
                      <tbody id="yandex_string_tbl">
                      </tbody>
                  </table>
              </div>
              <div class="notice-container"></div>
            </div>
        <div class="modal-footer">
              <div class="save_btn_cont">
              <button class="notranslate save_it button button-primary" disabled="true">Merge Translation</button>
              </div>
              <div style="display:none" class="ytstats">
              Wahooo! You have saved your valauble time via auto translating 
                 <strong class="totalChars"></strong> characters  using 
                  <strong> 
                  <a href="https://wordpress.org/support/plugin/automatic-translator-addon-for-loco-translate/reviews/#new-post" target="_new">
                  Loco Automatic Translate Addon</a>
                </strong>     
              </div>
        </div>
          </div>
        </div>`;

         $("body").append(modelHTML);
     }



     // When the user clicks the button, open the modal 
     $("#atlt_yandex_transate_btn").on("click", function() {

         var defaultcode = locale.lang ? locale.lang : null;

         switch (defaultcode) {
             case 'bel':
                 defaultlang = 'be';
                 break;
             case 'he':
                 defaultlang = 'iw';
                 break;
             case 'snd':
                 defaultlang = 'sd';
                 break;
             case 'jv':
                 defaultlang = 'jv';
                 break;
             case 'nb':
                 defaultlang = 'no';
                 break;

             case 'nn':
                 defaultlang = 'no';
                 break;
             default:
                 defaultlang = defaultcode;
                 break;
         }
    
         $(".save_it").prop("disabled", true);
         $(".ytstats").css("display", "none");
         localStorage.setItem("lang", defaultlang);
         var arr = ['af', 'jv', 'no', 'am', 'ar', 'az', 'ba', 'be', 'bg', 'bn', 'bs', 'ca', 'ceb', 'cs', 'cy', 'da', 'de', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fa', 'fi', 'fr', 'ga', 'gd', 'gl', 'gu', 'he', 'hi', 'hr', 'ht', 'hu', 'hy', 'id', 'is', 'it', 'ja', 'jv', 'ka', 'kk', 'km', 'kn', 'ko', 'ky', 'la', 'lb', 'lo', 'lt', 'lv', 'mg', 'mhr', 'mi', 'mk', 'ml', 'mn', 'mr', 'mrj', 'ms', 'mt', 'my', 'ne', 'nl', 'no', 'pa', 'pap', 'pl', 'pt', 'ro', 'ru', 'si', 'sk', 'sl', 'sq', 'sr', 'su', 'sv', 'sw', 'ta', 'te', 'tg', 'th', 'tl', 'tr', 'tt', 'udm', 'uk', 'ur', 'uz', 'vi', 'xh', 'yi', 'zh'];
         if (arr.includes(defaultlang)) {
             //   googleTranslateElementInit();
         } else {
             $(".notice-container").addClass('notice inline notice-warning')
             .html("Yandex Automatic Translator Does not support this language.");
             $(".string_container").hide();
             $(".choose-lang").hide();
             $(".save_it").hide();
             $("#ytWidget").hide();
         }
         // get only plain strings 
         var plainStrArr = filterRawObject(allStrings, "plain");
         if (plainStrArr.length > 0) {
             printStringsInPopup(plainStrArr, type = "yandex");
         } else {
             $("#ytWidget").hide();
             $(".notice-container").addClass('notice inline notice-warning')
             .html("There is no plain string available for translations.");
             $(".string_container").hide();
             $(".choose-lang").hide();
             $(".save_it").hide();
         }
         $("#atlt-dialog").dialog("close");
         $("#atlt_strings_model").addClass("yandex-translator").fadeIn("slow");

     });

     function saveTranslatedStrings(translatedObj, projectId) {
      
         if (translatedObj !== undefined && translatedObj.length) {

             if (translatedObj.length < 5000 && translatedObj.length >= 2500) {
                 var firstPart = translatedObj.slice(0, 2500);
                 var secondPart = translatedObj.slice(2500);
                 sendRequest(firstPart, projectId, part = "first");
                 sendRequest(secondPart, projectId, part = "second", );
             } else if (translatedObj.length >= 5000) {
                 var firstPart = translatedObj.slice(0, 2500);
                 var secondPart = translatedObj.slice(2500, 5000);
                 var thirdpart = translatedObj.slice(5000);
                 sendRequest(firstPart, projectId, part = "first");
                 sendRequest(secondPart, projectId, part = "second", );
                 sendRequest(thirdpart, projectId, part = "third", );
             } else {
                 sendRequest(translatedObj, projectId, part = "one");
             }


         }
     }

     function sendRequest(stringData, projectId, part) {
         var data = {
             'action': 'save_translations',
             'data': JSON.stringify(stringData),
             'part': part,
             'project-id': projectId,
         };
         jQuery.post(ajaxUrl, data, function(response) {
          
             $('#loco-editor nav').find('button').each(function(i, el) {
                 var id = el.getAttribute('data-loco');
                 if (id == "auto") {
                     $(el).trigger("click");
                 }
             });
         });


     }
     /*
      Save Translated Strings
      */
     var rpl = {
         '"% s"': '"%s"',
         '"% d"': '"%d"',
         '"% S"': '"%s"',
         '"% D"': '"%d"',
         '% s': ' %s ',
         '% S': ' %s ',
         '% d': ' %d ',
         '% D': ' %d ',
         '٪ s': ' %s ',
         '٪ S': ' %s ',
         '٪ d': ' %d ',
         '٪ D': ' %d ',
         '٪ س': ' %s ',
     };

  
     //Click to merge translations
     $(".save_it").on("click", function() {
         var translatedObj = [];
         $("#stringTemplate tbody tr").each(function(index) {
            var index = $(this).find("td.source").text();
            var target = $(this).find("td.target").text();
             var source = $(this).find("td.source").text();
             var improvedTarget= strtr(target,rpl) ;
             var improvedSource= strtr(source,rpl) ;
                translatedObj.push({
                 "source": improvedSource,
                 "target": improvedTarget
             });
         });
         var projectId = $(this).parents("#atlt_strings_model").find("#project_id").val();
         saveTranslatedStrings(translatedObj, projectId);
         var translatedObj = [];
         $(".atlt_custom_model").fadeOut("slow");

         $("html").addClass("merge-translations");
         var checkModal = setInterval(function() {
             if ($('.loco-modal #loco-apis-batch').length || String($(".loco-modal").attr("style")).indexOf("none") <= -1) {
                 $("html").removeClass("merge-translations");
                 $("select#auto-api").hide();
                 $("#loco-apis-batch a.icon-help").hide();
                 $("#loco-apis-batch a.icon-group").hide();
                 $("#loco-apis-batch #loco-job-progress").hide();
                 $("select#auto-api option[value='loco_auto']").prop("selected", "selected");
                 //$("select#auto-api option[value='loco_auto']").attr("selected", "selected");
                 $("select#auto-api").val($("select#auto-api option[value='loco_auto']").val());
                 $(".loco-modal .ui-dialog-titlebar .ui-dialog-title").html("Step 3 - Add Translations into Editor and Save");
                 $("#loco-apis-batch button.button-primary span").html("Start Adding Process");
                
                $("#loco-apis-batch button.button-primary").on("click",function(){
                     $(this).find('span').html("Adding...");
                 }); 

                 $(".loco-modal").addClass("addtranslations");
                 $('.noapiadded').remove();
                 $(".loco-modal #loco-apis-batch form").show();
                 $(".loco-modal #loco-apis-batch").removeClass("loco-alert");
                 clearInterval(checkModal);
             }
         }, 100); // check every 100ms
     });

     //Click on Loco Default Auto Button
     $("button.icon-robot[data-loco='auto']").on("click", function(e) {
         if (e.originalEvent !== undefined) {
            var checkModal = setInterval(function() {
                //if ($('.loco-modal #loco-apis-batch').length || String($(".loco-modal").attr("style")).indexOf("block") > -1) {
                    if ($('.loco-modal #loco-apis-batch').length && String($(".loco-modal").attr("style")).indexOf("none") <= -1){
                    $(".loco-modal").removeClass("addtranslations");
                    $("select#auto-api").show();
                    $("#loco-apis-batch a.icon-help").show(); //Show help button again.
                    $("#loco-apis-batch a.icon-group").show(); //Show human button again.
                    $("#loco-apis-batch #loco-job-progress").show(); //Show translation status again.
                    $(".loco-modal .ui-dialog-titlebar .ui-dialog-title").html("Auto-translate this file");
                    $("#loco-apis-batch button.button-primary span").html("Translate");
                    var opt = 0;
                    $('select#auto-api option').each(function() {
                        opt = opt + 1;
                    });
                    if (opt == 1) {
                        $('.noapiadded').remove();
                        $(".loco-modal #loco-apis-batch").removeClass("loco-alert");
                        $(".loco-modal #loco-apis-batch form").hide();
                        $(".loco-modal #loco-apis-batch").addClass("loco-alert");
                        $(".loco-modal .ui-dialog-titlebar .ui-dialog-title").html("No translation APIs configured");
                        $(".loco-modal #loco-apis-batch").append("<div class='noapiadded'><p>Add automatic translation services in the plugin settings.<br>or<br>Use <strong>Auto Translate</strong> addon button.</p><nav><a href='http://locotranslate.local/wp-admin/admin.php?page=loco-config&amp;action=apis' class='button button-link has-icon icon-cog'>Settings</a><a href='https://localise.biz/wordpress/plugin/manual/providers' class='button button-link has-icon icon-help' target='_blank'>Help</a><a href='https://localise.biz/wordpress/translation?l=de-DE' class='button button-link has-icon icon-group' target='_blank'>Need a human?</a></nav></div>");
                    }
                    clearInterval(checkModal);
                }
            }, 100); // check every 100ms         
         }
     });

     // filter string based upon type
     function filterRawObject(rawArray, filterType) {
         filterdArr = [];
         return filterdArr = rawArray.filter((item, index) => {
             if ((item.source !== "" && item.source !== undefined) && (item.target === undefined || item.target == "")) {
                 if (ValidURL(item.source)) {
                     return false;
                 }
                 if (isHTML(item.source)) {
                     return false;
                 } else if (isPlacehodersChars(item.source)) {
                     return true;
                 } else if (isSpecialChars(item.source)) {
                     return false;
                 }else if (isEmoji(item.source)) {
                    return false;
                  } 
                  else if (item.source.includes('#')) {
                     return false;
                 } else {
                     return true;
                 }
             }
         });
     }


     // detect String contain URL
     function ValidURL(str) {
         var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
         if (!pattern.test(str)) {
             return false;
         } else {
             return true;
         }
     }
     // detect Valid HTML in string
     function isHTML(str) {
         var rgex = /<(?=.*? .*?\/ ?>|br|hr|input|!--|wbr)[a-z]+.*?>|<([a-z]+).*?<\/\1>/i;
         if (str !== undefined) {
             return rgex.test(str);
         } else {
             return false;
         }
     }
     //  check special chars in string
     function isSpecialChars(str) {
         var rgex = /[@^{}|<>]/g;
         if (str !== undefined) {
             return rgex.test(str);
         } else {
             return false;
         }
     }
     function isEmoji(str) {
        var ranges = [
            '(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])' // U+1F680 to U+1F6FF
        ];
        if (str.match(ranges.join('|'))) {
            return true;
        } else {
            return false;
        }
    }

     // allowed special chars in plain text
     function isPlacehodersChars(str) {
         var rgex = /%s|%d/g;
         if (str !== undefined) {
             return rgex.test(str);
         } else {
             return false;
         }
     }
  

// replace placeholders in strings
function strtr(s, p, r) {
    return !!s && {
        2: function () {
            for (var i in p) {
                s = strtr(s, i, p[i]);
            }
            return s;
        },
        3: function () {
            return s.replace(RegExp(p, 'g'), r);
        },
        0: function () {
            return;
        }
    }[arguments.length]();
  }


 }(window, jQuery);