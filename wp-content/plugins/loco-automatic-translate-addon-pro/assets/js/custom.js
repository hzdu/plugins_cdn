/*
    It is master branch code
*/

/*
   it is testing branch
*/
!function( window, $ ){
  createSettingsPopup();
  create_G_popup();
  create_deepl_popup();
  createStringsPopup();

/*
   Google Translate Model
 */
// Get the modal
var gModal = document.getElementById("atlt_gtranslate_model");

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == gModal) {
      gModal.style.display = "none";
  }
};

// Get the <span> element that closes the modal

// When the user clicks on <span> (x), close the modal
$("#atlt_gtranslate_model").find(".close").on("click",function() {
  $("#atlt_gtranslate_model").fadeOut("slow");
});

 /*
   String Translate Model
 */
// Get the modal
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == gModal) {
    $("#atlt_strings_model").fadeOut("slow");
  }
};

// Get the <span> element that closes the modal
// When the user clicks on <span> (x), close the modal
$("#atlt_strings_model").find(".close").on("click",function() {
  $("#atlt_strings_model").fadeOut("slow");
});



  // integrates auto traslator button in editor
 function newaddAutoTranslationBtn(){
        if($("#loco-toolbar").find("#cool-auto-translate-btn").length>0){
            $("#loco-toolbar").find("#cool-auto-translate-btn").remove();
        }
        const locoActions= $("#loco-toolbar").find("#loco-actions");
        const otherBtn='<button class="button has-icon icon-warn" id="atlt_reset_all">Reset Translations</button></fieldset>';
        const proActiveBtn='<fieldset><button id="cool-auto-translate-btn" class="button has-icon icon-translate">Auto Translate</button></fieldset>';
       
        locoActions.append(proActiveBtn);
     
  }

// create auto translate settings popup
function createSettingsPopup(){
      let preloaderImg=extradata['preloader_path'];
      let ytPreviewImg=extradata['yt_preview'];
      let gtPreviewImg=extradata['gt_preview'];
      let dplPreviewImg=extradata['dpl_preview'];
      let modelHTML=` 
      <!-- The Modal -->
      <div id="atlt-dialog" title="Auto Translate (No API Required)" style="display:none;">
      <div class="atlt-settings">
      
      <strong class="atlt-heading" style="margin-bottom:10px;display:inline-block;">Translate Using Yandex Page Translate Widget</strong>
      <div class="inputGroup">
      <button id="atlt_yandex_transate_btn" class="notranslate button button-primary">Yandex Translate</button>
      <br/><a href="https://translate.yandex.com/" target="_blank"><img style="margin-top: 5px;" src="${ytPreviewImg}" alt="powered by Yandex Translate Widget"></a>
      </div>
      <hr/>

      <strong class="atlt-heading" style="margin-bottom:10px;display:inline-block;">Translate Using Google Page Translate Widget</strong>
      <div class="inputGroup">
      <button id="atlt_gtranslate_btn" class="notranslate button button-primary">Google Translate</button>
      <br/><a href="https://translate.google.com/" target="_blank"><img style="margin-top: 5px;" src="${gtPreviewImg}" alt="powered by Google Translate Widget"></a>
      </div>
      <hr/>

      <strong class="atlt-heading" style="margin-bottom:10px;display:inline-block;">Translate Using Deepl Doc Translator</strong>
      <div class="inputGroup">
      <button id="atlt_deepl_btn" class="notranslate button button-primary">Deepl Translate</button>
      <br/><a href="https://www.deepl.com/en/translator" target="_blank"><img style="margin-top: 5px;" src="${dplPreviewImg}" alt="powered by DeepL Translate"></a>
      </div>
      <hr/>

      <ul style="margin: 0;">
      <li><span style="color:green">✔</span> Unlimited Translations</li>
      <li><span style="color:green">✔</span> No API Key Required</li>
      </ul>

      </div>
      </div>
    `;
    $("body").append( modelHTML );
  }

   /**
   * generate model popup HTML
   */  
  function createStringsPopup(){
    let modelHTML=` 
    <!-- The Modal -->
    <div id="atlt_strings_model" class="modal atlt_custom_model">
        <!-- Modal content -->
        <div class="modal-content">
          <div class="modal-header">
            <span class="close ">&times;</span>
            <h2 class="notranslate">Automatic Translations Using Yandex Translator </h2>
            <div class="save_btn_cont">
            <button class="notranslate save_it button button-primary" disabled="true">Merge Translation</button>
            </div>

            <div style="display:none" class="ytstats">
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
            <div class="my_translate_progress">Automatic translation is in progress....<br/>It will take few minutes, enjoy ☕ coffee in this time!</div>
            <h3>Choose language</h3>
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
          </div>
          <div class="modal-footer">
            <div class="save_btn_cont">
            <button class="notranslate save_it button button-primary" disabled="true">Merge Translation</button>
            </div>

            <div style="display:none" class="ytstats">
            Wahooo! You have saved your valauble time via auto translating 
             <strong class="totalChars"> </strong> characters  using 
              <strong> 
              <a href="https://wordpress.org/support/plugin/automatic-translator-addon-for-loco-translate/reviews/#new-post" target="_new">
              Loco Automatic Translate Addon</a>
            </strong>     
          </div>
          </div>
        </div>
      </div>`;
      
    $("body").append( modelHTML );
}
  

  /**
   * generate model popup HTML
   */  
  function create_G_popup(){
    let modelHTML=` 
    <!-- The Modal -->
    <div id="atlt_gtranslate_model" class="modal atlt_custom_model">
        <!-- Modal content -->
        <div class="modal-content">
          <div class="modal-header">
            <span class="close ">&times;</span>
            <h2 class="notranslate">Automatic Translations Using Google Translate Button</h2>
            <div class="save_btn_cont">
            <button class="notranslate save_it button button-primary" disabled="true">Merge Translation</button>
            </div>
            <div style="display:none" class="gtstats">
            Wahooo! You have saved your valauble time via auto translating 
             <strong class="totalChars"> </strong> characters  using 
              <strong> 
              <a href="https://wordpress.org/support/plugin/automatic-translator-addon-for-loco-translate/reviews/#new-post" target="_new">
              Loco Automatic Translate Addon</a>
            </strong>     
          </div>
          </div>
            <div class="notice inline notice-info is-dismissible">Plugin will not translate any strings with HTML or special characters because Google Translate currently does not support HTML and special characters translations. You can edit translated strings inside Loco Translate Editor after merging the translations. Only special chracters (%s, %d) fixed at the time of merging of the translations.</div>
            <div class="notice inline notice-info is-dismissible">Machine translations are not 100% correct. Please verify strings before using on production website.</div>
          <div class="modal-body">
            <div class="my_translate_progress">Automatic translation is in progress....<br/>It will take few minutes, enjoy ☕ coffee in this time!</div>
            <h3>Choose language</h3>
            <div id="google_translate_element"></div>
            <div class="string_container">               
                <table class="scrolldown" id="stringTemplate">
                    <thead>
                    <th class="notranslate">S.No</th>
                    <th class="notranslate">Source Text</th>
                    <th class="notranslate">Translation</th>
                    </thead>
                    <tbody id="string_tbl">
                    </tbody>
                </table>
            </div>
          </div>
          <div class="modal-footer">
            <div class="save_btn_cont">
            <button class="notranslate save_it button button-primary" disabled="true">Merge Translation</button>
            </div>
            <div style="display:none" class="gtstats">
            Wahooo! You have saved your valauble time via auto translating 
             <strong class="totalChars"> </strong> characters  using 
              <strong> 
              <a href="https://wordpress.org/support/plugin/automatic-translator-addon-for-loco-translate/reviews/#new-post" target="_new">
              Loco Automatic Translate Addon</a>
            </strong>     
          </div>
          </div>
        </div>
      </div>`;
    $("body").append( modelHTML );
}
  /**
   * generate model popup HTML
   */  
  function create_deepl_popup(){
    let modelHTML=` 
    <!-- The Modal -->
    <div id="atlt_deepl_model" class="modal atlt_custom_model">
        <!-- Modal content -->
        <div class="modal-content">
          <div class="modal-header">
            <span class="close_deepl close">&times;</span>
            <h2 class="notranslate">Deepl Doc Translator</h2>
            <div class="save_btn_cont">
            <button class="notranslate deepl_save_it button button-primary" disabled="true">Merge Translation</button>
            </div>
            <div style="display:none" class="dtstats">
            Wahooo! You have saved your valauble time via auto translating 
             <strong class="totalChars"> </strong> characters  using 
              <strong> 
              <a href="https://wordpress.org/support/plugin/automatic-translator-addon-for-loco-translate/reviews/#new-post" target="_new">
              Loco Automatic Translate Addon</a>
            </strong>     
          </div>
          </div>
            <div class="notice inline notice-info is-dismissible">Plugin will not translate any strings with HTML or special characters. You can edit translated strings inside Loco Translate Editor after merging the translations. Only special chracters (%s, %d) fixed at the time of merging of the translations.</div>
            <div class="notice inline notice-info is-dismissible">Machine translations are not 100% correct. Please verify strings before using on production website.</div>
          <div class="modal-body">
            <table class="deepl_steps">
            <tr>
            <td>
              <h2>Step 1</h2>
              <p>Download translatable docx file.</p>
              <button  class="button button-primary" id="download_deepl_doc">Download Docx</button>
            </td>
            <td>
              <h2>Step 2</h2>
              <p>Visit <a href="https://www.deepl.com/translator" target="_blank">https://www.deepl.com/translator</a><br/>and upload downloaded file inside it<br/>for translations.</p>
            </td>
            </tr>
            <tr>
            <td>
              <h2>Step 3</h2>
              <p>Upload translated docx file here</p>
              <input type="file" id="deepl-open-file">
              <br />
              <span id="lblError" style="color: red;"></span>
              <br />
            </td>
            <td>
              <h2>Step 4</h2>
              <p>Click on "Upload Strings" & "Merge Translation" after this.</p>
              <input type="submit" id="deepl-btn-tpload" value="Upload Strings" />
            </td>
            </tr>
            </table>
        
            <div class="string_container">               
                <table class="scrolldown" id="deepl_stringTemplate">
                    <thead>
                    <th class="notranslate">S.No</th>
                    <th class="notranslate">Source Text</th>
                    <th class="notranslate">Translation</th>
                    </thead>
                    <tbody id="deepl_string_tbl">
                    </tbody>
                </table>
                <table  id="deepl-transtmplt">
                <thead>
                <th class="notranslate">S.No</th>
                <th>Source Text</th>
                <th >Target Text</th>
                </thead>
                <tbody id="deepbody">
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <div class="save_btn_cont">
            <button class="notranslate deepl_save_it button button-primary" disabled="true">Merge Translation</button>
            </div>
            <div style="display:none" class="dtstats">
            Wahooo! You have saved your valauble time via auto translating 
             <strong class="totalChars"> </strong> characters  using 
              <strong> 
              <a href="https://wordpress.org/support/plugin/automatic-translator-addon-for-loco-translate/reviews/#new-post" target="_new">
              Loco Automatic Translate Addon</a>
            </strong>     
          </div>  
          </div>
        </div>
      </div>`;
    $("body").append( modelHTML );
}



  
}( window, jQuery );