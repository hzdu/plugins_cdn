/**
 * General settings.
 *
 * @package fwdevp
 * @since fwdevp 1.0
 */

jQuery(document).ready(function($){
    
    'use strict';

    var DEFAULT_SKINS_NR = 8;

    if(fwdevpTextDomain.indexOf('acora') != -1){
        DEFAULT_SKINS_NR = 1;
    } 
   
    fwdevpSettingsAr = unescapeHtml(fwdevpSettingsAr);
    fwdevpSettingsAr = JSON.parse(fwdevpSettingsAr);

    fwdevpVideoStartBehaviour = unescapeHtml(fwdevpVideoStartBehaviour);
    fwdevpVideoStartBehaviour = JSON.parse(fwdevpVideoStartBehaviour);

    fwdevpKeepCookies = unescapeHtml(fwdevpKeepCookies);
    fwdevpKeepCookies = JSON.parse(fwdevpKeepCookies);

    fwdevpReplaceDF = unescapeHtml(fwdevpReplaceDF);
    fwdevpReplaceDF = JSON.parse(fwdevpReplaceDF);

    fwdevpReplaceDFSkin = unescapeHtml(fwdevpReplaceDFSkin);
    fwdevpReplaceDFSkin = JSON.parse(fwdevpReplaceDFSkin);

    var cur_settings_obj;

    var allFields = $([]).add($("#name")).add($("#stickyOnScrollWidth")).add($("#stickyOnScrollHeight")).add($("#max_width")).add($("#max_height")).add($("#volume")).add($("#controller_height")).add($("#controller_hide_delay")).add($("#start_space_between_buttons")).add($("#space_between_buttons")).add($("#scrubbers_offset_width")).add($("#main_scrubber_offest_top")).add($("#time_offset_left_width")).add($("#time_offset_right_width")).add($("#volume_scrubber_width")).add($("#volume_scrubber_offset_right_width")).add($("#logo_path")).add($("#logo_link")).add($("#logo_margins")).add($("#embed_and_info_window_close_button_margins")).add($("#start_at_video_source")).add($("#ads_page_to_open_url")).add($("#ads_page_to_open_target")).add($("#skip_to_video_text")).add($("#skip_to_video_button_text")).add($("#privateVideoPassword")).add($("#aopwTitle")).add($("#aopwWidth")).add($("#aopwHeight")).add($("#aopwBorderSize")).add($("#openerEqulizerOffsetTop")).add($("#openerEqulizerOffsetLeft")).add($("#offsetX")).add($("#offsetY")).add($("#lightBoxBackgroundOpacity")).add($("#thumbnails_preview_width")).add($("#thumbnails_preview_height"));
                 
    var fValid = false;
  
    $("#tabs").tabs();

    $("#contextMenuBackgroundColor,#contextMenuBorderColor,#contextMenuSpacerColor,#contextMenuItemNormalColor,#contextMenuItemSelectedColor,#contextMenuItemDisabledColor,#bg_color,#thumbnails_preview_background_color,#thumbnails_preview_border_color,#thumbnails_preview_label_background_color,#thumbnails_preview_label_font_color,#atbTimeTextColorNormal,#atbTimeTextColorSelected,#atbButtonTextNormalColor,#atbButtonTextSelectedColor,#atbButtonBackgroundNormalColor,#atbButtonBackgroundSelectedColor,#scrubbersToolTipLabelBackgroundColor,#scrubbersToolTipLabelFontColor,#poster_bg_color,#time_color,#aopwTitleColor,#youtube_quality_button_normal_color,#lightBoxBackgroundColor,#normal_HEX_buttons_color,#preloaderColor1,#preloaderColor2,#youtube_quality_button_selected_color,#border_color,#main_labels_color,#secondary_labels_color, #share_and_embed_text_color,#input_background_color,#input_color,#ads_text_normal_color,#ads_text_selected_color,#ads_border_normal_color,#ads_border_selected_color,#audioVisualizerCircleColor,#audioVisualizerLinesColor").spectrum({
        color: "#888888",
        chooseText: "Update",
        showInitial: true,
        showInput: true,
        allowEmpty:true,
        preferredFormat: "hex6"
    });

    $("img").fwdTooltip({});  
  
    $("#start_space_between_buttons_img").fwdTooltip({
        content: "<img src='" + fwdevpSpacesUrl + "startSpaceBetweenButtons.jpg' width='600' height='41'>",
        tooltipClass: "fwd-ui-tooltip-img"
    });
  
    $("#space_between_buttons_img").fwdTooltip({
        content: "<img src='" + fwdevpSpacesUrl + "spaceBetweenButtons.jpg' width='600' height='41'>",
        tooltipClass: "fwd-ui-tooltip-img"
    });

    var caca = 'caca';

    // Initialize.
    function init() {   
  
        $("#startBH").change(function(){
            if(fwdevpVideoStartBehaviour != $("#startBH").val()){
              $("#update_btn").show();
            }else{
              $("#update_btn").hide();
            }
        });
    
        $("#evpCookie").change(function(){
            if(fwdevpKeepCookies != $("#evpCookie").val()){
              $("#update_btn").show();
            }else{
              $("#update_btn").hide();
            }
        });

        $("#replaceDF").change(function(){
            if(fwdevpReplaceDF != $("#replaceDF").val()){
              $("#update_btn").show();
            }else{
              $("#update_btn").hide();
            }
        });

        $("#replaceDFSkin").change(function(){
            if(fwdevpReplaceDFSkin != $("#replaceDFSkin").val()){
              $("#update_btn").show();
            }else{
              $("#update_btn").hide();
            }
        });
    
      $.each(fwdevpSettingsAr, function(i, el){
          $("#skins").append("<option value='" + el.id + "'>" + el.name + "</option>");
          $("#replaceDFSkin").append("<option value='" + el.name + "'>" + el.name + "</option>");
      });
  
      $("#skins").val(fwdevpSetId);
        
          if (fwdevpCurOrderId < DEFAULT_SKINS_NR){
              $("#update_btn").hide();
              $("#del_btn").hide();
          }else{
              $("#update_btn").show();
              $("#del_btn").show();
          }
        
          setSettings();
        
          $("#preset_id").html("ID : " + fwdevpSetId);
          $("#tabs").tabs("option", "active", fwdevpTabInitId);
      }
      

    // Set settings
    function setSettings() {
   
        $("#startBH").val(fwdevpVideoStartBehaviour);
        $("#evpCookie").val(fwdevpKeepCookies);

        $("#replaceDF").val(fwdevpReplaceDF);
        var hasDFskin = false;
        var replaceDFSkinF = fwdevpReplaceDFSkin;
        $.each(fwdevpSettingsAr, function(i, el){
           if(replaceDFSkinF == el.name){
              hasDFskin = true;
           }
        });

        if(!hasDFskin){
          fwdevpReplaceDFSkin = fwdevpSettingsAr[0].name;
        }

        $("#replaceDFSkin").val(fwdevpReplaceDFSkin);
        var settings_obj = fwdevpSettingsAr[fwdevpCurOrderId];

        // Main settings.
        $("#name").val(settings_obj.name);
        $("#use_HEX_colors_for_skin").val(settings_obj.use_HEX_colors_for_skin);
        $("#initializeOnlyWhenVisible").val(settings_obj.initializeOnlyWhenVisible);
        $("#stickyOnScroll").val(settings_obj.stickyOnScroll);
        $("#stickyOnScrollShowOpener").val(settings_obj.stickyOnScrollShowOpener);
        $("#stickyOnScrollWidth").val(parseInt(settings_obj.stickyOnScrollWidth));
        $("#stickyOnScrollHeight").val(parseInt(settings_obj.stickyOnScrollHeight));
        $("#openDownloadLinkOnMobile").val(settings_obj.openDownloadLinkOnMobile);
        $("#display_type").val(settings_obj.display_type);
        $("#playsinline").val(settings_obj.playsinline);
        $("#skin_path").val(settings_obj.skin_path);
        $("#useFontAwesomeIcons").val(settings_obj.useFontAwesomeIcons);
        $("#add_keyboard_support").val(settings_obj.add_keyboard_support);
        $("#auto_scale").val(settings_obj.auto_scale);
        $("#autoplay").val(settings_obj.autoplay);
        $("#autoPlayText").val(settings_obj.autoPlayText);
        $("#loop").val(settings_obj.loop);
        $("#max_width").val(settings_obj.max_width);
        $("#show_controller").val(settings_obj.show_controller);
        $("#use_chromeless").val(settings_obj.use_chromeless);
        $("#fill_entire_video_screen").val(settings_obj.fill_entire_video_screen);
        $("#use_resume_on_play").val(settings_obj.use_resume_on_play);
        $("#show_popup_ads_close_button").val(settings_obj.show_popup_ads_close_button);
        $("#max_height").val(settings_obj.max_height);
        $("#volume").val(settings_obj.volume);
        $("#fillEntireScreenWithPoster").val(settings_obj.fillEntireScreenWithPoster);
        $("#greenScreenTolerance").val(settings_obj.greenScreenTolerance);
        $("#showPreloader").val(settings_obj.showPreloader);
        $("#disableDoubleClickFullscreen").val(settings_obj.disableDoubleClickFullscreen);
        $("#privateVideoPassword").val(settings_obj.privateVideoPassword);
        $("#encryptVideosPath").val(settings_obj.encryptVideosPath);
        $("#loggedInMessage").val(unescapeHtml(settings_obj.loggedInMessage));
        $("#showErrorInfo").val(settings_obj.showErrorInfo);
        $("#playVideoOnlyWhenLoggedIn").val(settings_obj.playVideoOnlyWhenLoggedIn);
        $("#goFullScreenOnButtonPlay").val(settings_obj.goFullScreenOnButtonPlay);
        $("#executeCuepointsOnlyOnce").val(settings_obj.executeCuepointsOnlyOnce);
        $("#defaultPlaybackRate").val(settings_obj.defaultPlaybackRate);
        $("#showPlaybackRateButton").val(settings_obj.showPlaybackRateButton);
        $("#start_at_video_source").val(settings_obj.start_at_video_source);
        $("#showDefaultControllerForVimeo").val(settings_obj.showDefaultControllerForVimeo);
        $("#useWithoutVideoScreen").val(settings_obj.useWithoutVideoScreen);
        $("#lightBoxBackgroundOpacity").val(settings_obj.lightBoxBackgroundOpacity);
        $("#closeLightBoxWhenPlayComplete").val(settings_obj.closeLightBoxWhenPlayComplete);
        $("#showYoutubeRelAndInfo").val(settings_obj.showYoutubeRelAndInfo);
        console.log(settings_obj.showYoutubeRelAndInfo)
        $("#bg_color").spectrum("set", settings_obj.bg_color != "transparent" ? settings_obj.bg_color : null);
        $("#poster_bg_color").spectrum("set", settings_obj.poster_bg_color != "transparent" ? settings_obj.poster_bg_color : null);

        // Sticky.
        $("#showPlayerByDefault").val(settings_obj.showPlayerByDefault);
        $("#animatePlayer").val(settings_obj.animatePlayer);
        $("#googleAnalyticsTrackingCode").val(settings_obj.googleAnalyticsTrackingCode);
        $("#showOpener").val(settings_obj.showOpener);
        $("#showOpenerPlayPauseButton").val(settings_obj.showOpenerPlayPauseButton);
        $("#openerAlignment").val(settings_obj.openerAlignment);
        $("#verticalPosition").val(settings_obj.verticalPosition);
        $("#horizontalPosition").val(settings_obj.horizontalPosition);
        $("#openerEqulizerOffsetTop").val(settings_obj.openerEqulizerOffsetTop);
        $("#openerEqulizerOffsetLeft").val(settings_obj.openerEqulizerOffsetLeft);
        $("#offsetX").val(settings_obj.offsetX);
        $("#offsetY").val(settings_obj.offsetY);
        $("#mainBackgroundImagePath").val(settings_obj.mainBackgroundImagePath);
        $("#evp_bg_upload_img").attr("src", settings_obj.mainBackgroundImagePath);
        $("#evp_logo_upload_img").attr("src", settings_obj.logo_path);
    
    
        // Controller settings.
        $("#showMainScrubberToolTipLabel").val(settings_obj.showMainScrubberToolTipLabel);
        $("#showScrubberWhenControllerIsHidden").val(settings_obj.showScrubberWhenControllerIsHidden);
        $("#show_controller_when_video_is_stopped").val(settings_obj.show_controller_when_video_is_stopped);
        $("#show_volume_scrubber").val(settings_obj.show_volume_scrubber);
        $("#show_volume_button").val(settings_obj.show_volume_button);
        $("#show_time").val(settings_obj.show_time);
        $("#show_youtube_quality_button").val(settings_obj.show_youtube_quality_button);
        $("#show_share_button").val(settings_obj.show_share_button);
        $("#show_download_button").val(settings_obj.show_download_button);
        $("#show_subtitle_button").val(settings_obj.show_subtitle_button);
        $("#showAudioTracksButton").val(settings_obj.showAudioTracksButton);
        $("#subtitles_off_label").val(settings_obj.subtitles_off_label);
        $("#disableDoubleClickFullscreen").val(settings_obj.disableDoubleClickFullscreen);
        $("#privateVideoPassword").val(settings_obj.privateVideoPassword);
        $("#executeCuepointsOnlyOnce").val(settings_obj.executeCuepointsOnlyOnce);
        $("#contextMenuType").val(settings_obj.contextMenuType);
        $("#showScriptDeveloper").val(settings_obj.showScriptDeveloper);
        $("#useAToB").val(settings_obj.useAToB);
        $("#show_embed_button").val(settings_obj.show_embed_button);
        $("#showChromecastButton").val(settings_obj.showChromecastButton);
        $("#show_fullscreen_button").val(settings_obj.show_fullscreen_button);
        $("#showRewindButton").val(settings_obj.showRewindButton);
        $("#show360DegreeVideoVrButton").val(settings_obj.show360DegreeVideoVrButton);
        $("#repeat_background").val(settings_obj.repeat_background);
        $("#controller_height").val(settings_obj.controller_height);
        $("#controller_hide_delay").val(settings_obj.controller_hide_delay);
        $("#start_space_between_buttons").val(settings_obj.start_space_between_buttons);
        $("#space_between_buttons").val(settings_obj.space_between_buttons);
        $("#scrubbers_offset_width").val(settings_obj.scrubbers_offset_width);
        $("#main_scrubber_offest_top").val(settings_obj.main_scrubber_offest_top);
        $("#time_offset_left_width").val(settings_obj.time_offset_left_width);
        $("#time_offset_right_width").val(settings_obj.time_offset_right_width);
        $("#volume_scrubber_width").val(settings_obj.volume_scrubber_width);
        $("#start_at_video_source").val(settings_obj.start_at_video_source);
        $("#aopwTitle").val(settings_obj.aopwTitle);
        $("#aopwWidth").val(settings_obj.aopwWidth);
        $("#aopwHeight").val(settings_obj.aopwHeight);
        $("#aopwBorderSize").val(settings_obj.aopwBorderSize);
        $("#aopwTitleColor").spectrum("set", settings_obj.aopwTitleColor != "transparent" ? settings_obj.aopwTitleColor : null);
        $("#volume_scrubber_offset_right_width").val(settings_obj.volume_scrubber_offset_right_width);
        $("#time_color").spectrum("set", settings_obj.time_color != "transparent" ? settings_obj.time_color : null);
        $("#youtube_quality_button_normal_color").spectrum("set", settings_obj.youtube_quality_button_normal_color != "transparent" ? settings_obj.youtube_quality_button_normal_color : null);
        $("#lightBoxBackgroundColor").spectrum("set", settings_obj.lightBoxBackgroundColor != "transparent" ? settings_obj.lightBoxBackgroundColor : null);
        $("#youtube_quality_button_selected_color").spectrum("set", settings_obj.youtube_quality_button_selected_color != "transparent" ? settings_obj.youtube_quality_button_selected_color : null);
        $("#normal_HEX_buttons_color").spectrum("set", settings_obj.normal_HEX_buttons_color != "transparent" ? settings_obj.normal_HEX_buttons_color : null);
        $("#preloaderColor1").spectrum("set", settings_obj.preloaderColor1 != "transparent" ? settings_obj.preloaderColor1 : null);
        $("#preloaderColor2").spectrum("set", settings_obj.preloaderColor2 != "transparent" ? settings_obj.preloaderColor2 : null);
        $("#scrubbersToolTipLabelBackgroundColor").spectrum("set", settings_obj.scrubbersToolTipLabelBackgroundColor != "transparent" ? settings_obj.scrubbersToolTipLabelBackgroundColor : null);
        $("#scrubbersToolTipLabelFontColor").spectrum("set", settings_obj.scrubbersToolTipLabelFontColor != "transparent" ? settings_obj.scrubbersToolTipLabelFontColor : null);
    
        // Thumbnails preview settings.
        $("#thumbnails_preview_width").val(settings_obj.thumbnails_preview_width);
        $("#thumbnails_preview_height").val(settings_obj.thumbnails_preview_height);
   
        // logo settings.
        $("#show_logo").val(settings_obj.show_logo);
        $("#hide_logo_with_controller").val(settings_obj.hide_logo_with_controller);
        $("#logo_position").val(settings_obj.logo_position);
        $("#logo_path").val(settings_obj.logo_path);
        $("#logo_link").val(settings_obj.logo_link);
        $("#logo_margins").val(settings_obj.logo_margins);
    
        // Embed and info windows settings.
        $("#embed_and_info_window_close_button_margins").val(settings_obj.embed_and_info_window_close_button_margins);
        $("#border_color").spectrum("set", settings_obj.border_color != "transparent" ? settings_obj.border_color : null);
        $("#main_labels_color").spectrum("set", settings_obj.main_labels_color != "transparent" ? settings_obj.main_labels_color : null);
        $("#secondary_labels_color").spectrum("set", settings_obj.secondary_labels_color != "transparent" ? settings_obj.secondary_labels_color : null);
        $("#share_and_embed_text_color").spectrum("set", settings_obj.share_and_embed_text_color != "transparent" ? settings_obj.share_and_embed_text_color : null);
        $("#input_background_color").spectrum("set", settings_obj.input_background_color != "transparent" ? settings_obj.input_background_color : null);
        $("#input_color").spectrum("set", settings_obj.input_color != "transparent" ? settings_obj.input_color : null);
    
        // Ads settings.
        $("#open_new_page_at_the_end_of_the_ads").val(settings_obj.open_new_page_at_the_end_of_the_ads);
        $("#ads_buttons_position").val(settings_obj.ads_buttons_position);
        $("#skip_to_video_text").val(settings_obj.skip_to_video_text);
        $("#skip_to_video_button_text").val(settings_obj.skip_to_video_button_text);
        $("#ads_text_normal_color").spectrum("set", settings_obj.ads_text_normal_color != "transparent" ? settings_obj.ads_text_normal_color : null);
        $("#ads_text_selected_color").spectrum("set", settings_obj.ads_text_selected_color != "transparent" ? settings_obj.ads_text_selected_color : null);
        $("#ads_border_normal_color").spectrum("set", settings_obj.ads_border_normal_color != "transparent" ? settings_obj.ads_border_normal_color : null);
        $("#ads_border_selected_color").spectrum("set", settings_obj.ads_border_selected_color != "transparent" ? settings_obj.ads_border_selected_color : null);
        $("#audioVisualizerCircleColor").spectrum("set", settings_obj.audioVisualizerCircleColor != "transparent" ? settings_obj.audioVisualizerCircleColor : null);
        $("#audioVisualizerLinesColor").spectrum("set", settings_obj.audioVisualizerLinesColor != "transparent" ? settings_obj.audioVisualizerLinesColor : null);
        $("#atbTimeTextColorNormal").spectrum("set", settings_obj.atbTimeTextColorNormal != "transparent" ? settings_obj.atbTimeTextColorNormal : null);
        $("#atbTimeTextColorSelected").spectrum("set", settings_obj.atbTimeTextColorSelected != "transparent" ? settings_obj.atbTimeTextColorSelected : null);
        $("#atbButtonTextNormalColor").spectrum("set", settings_obj.atbButtonTextNormalColor != "transparent" ? settings_obj.atbButtonTextNormalColor : null);
        $("#atbButtonTextSelectedColor").spectrum("set", settings_obj.atbButtonTextSelectedColor != "transparent" ? settings_obj.atbButtonTextSelectedColor : null);
        $("#atbButtonBackgroundNormalColor").spectrum("set", settings_obj.atbButtonBackgroundNormalColor != "transparent" ? settings_obj.atbButtonBackgroundNormalColor : null);  
        $("#atbButtonBackgroundSelectedColor").spectrum("set", settings_obj.atbButtonBackgroundSelectedColor != "transparent" ? settings_obj.atbButtonBackgroundSelectedColor : null);        
        $("#thumbnails_preview_background_color").spectrum("set", settings_obj.thumbnails_preview_background_color != "transparent" ? settings_obj.thumbnails_preview_background_color : null);    
        $("#thumbnails_preview_border_color").spectrum("set", settings_obj.thumbnails_preview_border_color != "transparent" ? settings_obj.thumbnails_preview_border_color : null);    
        $("#thumbnails_preview_label_background_color").spectrum("set", settings_obj.thumbnails_preview_label_background_color != "transparent" ? settings_obj.thumbnails_preview_label_background_color : null);    
        $("#thumbnails_preview_label_font_color").spectrum("set", settings_obj.thumbnails_preview_label_font_color != "transparent" ? settings_obj.thumbnails_preview_label_font_color : null);    
        $("#contextMenuBackgroundColor").spectrum("set", settings_obj.contextMenuBackgroundColor != "transparent" ? settings_obj.contextMenuBackgroundColor : null);
        $("#contextMenuBorderColor").spectrum("set", settings_obj.contextMenuBorderColor != "transparent" ? settings_obj.contextMenuBorderColor : null);
        $("#contextMenuSpacerColor").spectrum("set", settings_obj.contextMenuSpacerColor != "transparent" ? settings_obj.contextMenuSpacerColor : null);
        $("#contextMenuItemNormalColor").spectrum("set", settings_obj.contextMenuItemNormalColor != "transparent" ? settings_obj.contextMenuItemNormalColor : null);
        $("#contextMenuItemSelectedColor").spectrum("set", settings_obj.contextMenuItemSelectedColor != "transparent" ? settings_obj.contextMenuItemSelectedColor : null);
        $("#contextMenuItemDisabledColor").spectrum("set", settings_obj.contextMenuItemDisabledColor != "transparent" ? settings_obj.contextMenuItemDisabledColor : null);
    }
  
    $("#skins").change(function(){
        fwdevpSetId = parseInt($("#skins").val());
      
        $.each(fwdevpSettingsAr, function(i, el){
          if (fwdevpSetId == el.id){
              fwdevpCurOrderId = i;
          }
    });
      
    setSettings();
      
    if (fwdevpCurOrderId < DEFAULT_SKINS_NR){
        $("#update_btn").hide();
            $("#del_btn").hide();
    }else{
        $("#update_btn").show();
            $("#del_btn").show();
    }
      
    allFields.removeClass("ui-state-error");
    $("#tips").text("All form fields are required.");
      
    $("#preset_id").html("ID : " + fwdevpSetId);
    });
    

    // Update settings.
    function updateSettings() {

        // Main settings.
        cur_settings_obj = {};
        cur_settings_obj.id = fwdevpSetId;
        cur_settings_obj.name = $("#name").val().replace(/"/g, "'");
        cur_settings_obj.use_HEX_colors_for_skin = $("#use_HEX_colors_for_skin").val().replace(/"/g, "'");
        cur_settings_obj.openDownloadLinkOnMobile = $("#openDownloadLinkOnMobile").val();
        cur_settings_obj.initializeOnlyWhenVisible = $("#initializeOnlyWhenVisible").val();
        cur_settings_obj.stickyOnScroll = $("#stickyOnScroll").val();
        cur_settings_obj.stickyOnScrollShowOpener = $("#stickyOnScrollShowOpener").val();
        cur_settings_obj.stickyOnScrollWidth = parseInt($("#stickyOnScrollWidth").val());
        cur_settings_obj.stickyOnScrollHeight = parseInt($("#stickyOnScrollHeight").val());
        cur_settings_obj.display_type = $("#display_type").val();
        cur_settings_obj.playsinline = $("#playsinline").val();
        cur_settings_obj.skin_path = $("#skin_path").val();
        cur_settings_obj.useFontAwesomeIcons = $("#useFontAwesomeIcons").val();
        cur_settings_obj.add_keyboard_support = $("#add_keyboard_support").val();
        cur_settings_obj.auto_scale = $("#auto_scale").val();
        cur_settings_obj.autoplay = $("#autoplay").val();
        cur_settings_obj.autoPlayText = $("#autoPlayText").val().replace(/"/g, "'");
        cur_settings_obj.loop = $("#loop").val();
        cur_settings_obj.max_width = parseInt($("#max_width").val());
        cur_settings_obj.show_controller = $("#show_controller").val();
        cur_settings_obj.use_chromeless = $("#use_chromeless").val();
        cur_settings_obj.fill_entire_video_screen = $("#fill_entire_video_screen").val();
        cur_settings_obj.use_resume_on_play = $("#use_resume_on_play").val();
        cur_settings_obj.show_popup_ads_close_button = $("#show_popup_ads_close_button").val();
        cur_settings_obj.max_height = parseInt($("#max_height").val());
        cur_settings_obj.volume = parseFloat($("#volume").val());
        cur_settings_obj.fillEntireScreenWithPoster = $("#fillEntireScreenWithPoster").val();
        cur_settings_obj.greenScreenTolerance = $("#greenScreenTolerance").val();
        cur_settings_obj.showPreloader = $("#showPreloader").val();
        cur_settings_obj.disableDoubleClickFullscreen = $("#disableDoubleClickFullscreen").val();
        cur_settings_obj.privateVideoPassword = $("#privateVideoPassword").val();
        cur_settings_obj.encryptVideosPath = $("#encryptVideosPath").val();
        cur_settings_obj.loggedInMessage = $("#loggedInMessage").val().replace(/"/g, "'");
        cur_settings_obj.showErrorInfo = $("#showErrorInfo").val();
        cur_settings_obj.playVideoOnlyWhenLoggedIn = $("#playVideoOnlyWhenLoggedIn").val();
        cur_settings_obj.goFullScreenOnButtonPlay = $("#goFullScreenOnButtonPlay").val();
        cur_settings_obj.executeCuepointsOnlyOnce = $("#executeCuepointsOnlyOnce").val();
        cur_settings_obj.showPlaybackRateButton = $("#showPlaybackRateButton").val();
        cur_settings_obj.bg_color = $("#bg_color").spectrum("get") ? $("#bg_color").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.poster_bg_color = $("#poster_bg_color").spectrum("get") ? $("#poster_bg_color").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.showPlayerByDefault = $("#showPlayerByDefault").val();
        cur_settings_obj.animatePlayer = $("#animatePlayer").val();
        cur_settings_obj.googleAnalyticsTrackingCode = $("#googleAnalyticsTrackingCode").val();
        cur_settings_obj.showOpener = $("#showOpener").val();
        cur_settings_obj.showOpenerPlayPauseButton = $("#showOpenerPlayPauseButton").val();
        cur_settings_obj.openerAlignment = $("#openerAlignment").val();
        cur_settings_obj.verticalPosition = $("#verticalPosition").val();
        cur_settings_obj.horizontalPosition = $("#horizontalPosition").val();
        cur_settings_obj.openerEqulizerOffsetTop = parseInt($("#openerEqulizerOffsetTop").val());
        cur_settings_obj.openerEqulizerOffsetLeft = parseInt($("#openerEqulizerOffsetLeft").val());
        cur_settings_obj.offsetX = parseInt($("#offsetX").val());
        cur_settings_obj.offsetY = parseInt($("#offsetY").val());
        cur_settings_obj.mainBackgroundImagePath = $("#mainBackgroundImagePath").val().replace(/"/g, "'");

        // Controller settings.
        cur_settings_obj.showScrubberWhenControllerIsHidden = $("#showScrubberWhenControllerIsHidden").val();
        cur_settings_obj.showMainScrubberToolTipLabel = $("#showMainScrubberToolTipLabel").val();
        cur_settings_obj.show_controller_when_video_is_stopped = $("#show_controller_when_video_is_stopped").val();
        cur_settings_obj.show_volume_scrubber = $("#show_volume_scrubber").val();
        cur_settings_obj.show_volume_button = $("#show_volume_button").val();
        cur_settings_obj.show_time = $("#show_time").val();
        cur_settings_obj.show_youtube_quality_button = $("#show_youtube_quality_button").val();
        cur_settings_obj.show_share_button = $("#show_share_button").val();
        cur_settings_obj.show_download_button = $("#show_download_button").val();
        cur_settings_obj.show_subtitle_button = $("#show_subtitle_button").val();
        cur_settings_obj.showAudioTracksButton = $("#showAudioTracksButton").val();
        cur_settings_obj.subtitles_off_label = $("#subtitles_off_label").val();
        cur_settings_obj.contextMenuType = $("#contextMenuType").val();
        cur_settings_obj.showScriptDeveloper = $("#showScriptDeveloper").val();
        cur_settings_obj.disableDoubleClickFullscreen = $("#disableDoubleClickFullscreen").val();
        cur_settings_obj.show_embed_button = $("#show_embed_button").val();
        cur_settings_obj.showChromecastButton = $("#showChromecastButton").val();
        cur_settings_obj.useAToB = $("#useAToB").val();
        cur_settings_obj.atbTimeBackgroundColor = 'transparent';
        cur_settings_obj.show_fullscreen_button = $("#show_fullscreen_button").val();
        cur_settings_obj.showRewindButton = $("#showRewindButton").val();
        cur_settings_obj.show360DegreeVideoVrButton = $("#show360DegreeVideoVrButton").val();
        cur_settings_obj.repeat_background = $("#repeat_background").val();
        cur_settings_obj.controller_height = parseInt($("#controller_height").val());
        cur_settings_obj.controller_hide_delay = parseFloat($("#controller_hide_delay").val());
        cur_settings_obj.start_space_between_buttons = parseInt($("#start_space_between_buttons").val());
        cur_settings_obj.space_between_buttons = parseInt($("#space_between_buttons").val());
        cur_settings_obj.scrubbers_offset_width = parseInt($("#scrubbers_offset_width").val());
        cur_settings_obj.main_scrubber_offest_top = parseInt($("#main_scrubber_offest_top").val());
        cur_settings_obj.time_offset_left_width = parseInt($("#time_offset_left_width").val());
        cur_settings_obj.time_offset_right_width = parseInt($("#time_offset_right_width").val());
        cur_settings_obj.volume_scrubber_width = parseInt($("#volume_scrubber_width").val());
        cur_settings_obj.start_at_video_source = parseInt($("#start_at_video_source").val());
        cur_settings_obj.showDefaultControllerForVimeo = $("#showDefaultControllerForVimeo").val();
        cur_settings_obj.useWithoutVideoScreen = $("#useWithoutVideoScreen").val();
        cur_settings_obj.lightBoxBackgroundOpacity = $("#lightBoxBackgroundOpacity").val();
        cur_settings_obj.showYoutubeRelAndInfo = $("#showYoutubeRelAndInfo").val();
        cur_settings_obj.closeLightBoxWhenPlayComplete = $("#closeLightBoxWhenPlayComplete").val();
        cur_settings_obj.aopwTitle = $("#aopwTitle").val();
        cur_settings_obj.aopwWidth = parseInt($("#aopwWidth").val());
        cur_settings_obj.aopwHeight = parseInt($("#aopwHeight").val());
        cur_settings_obj.aopwBorderSize = parseInt($("#aopwBorderSize").val());
        cur_settings_obj.aopwTitleColor = $("#aopwTitleColor").spectrum("get") ? $("#aopwTitleColor").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.volume_scrubber_offset_right_width = parseInt($("#volume_scrubber_offset_right_width").val());
        cur_settings_obj.time_color = $("#time_color").spectrum("get") ? $("#time_color").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.youtube_quality_button_normal_color = $("#youtube_quality_button_normal_color").spectrum("get") ? $("#youtube_quality_button_normal_color").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.lightBoxBackgroundColor = $("#lightBoxBackgroundColor").spectrum("get") ? $("#lightBoxBackgroundColor").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.youtube_quality_button_selected_color = $("#youtube_quality_button_selected_color").spectrum("get") ? $("#youtube_quality_button_selected_color").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.normal_HEX_buttons_color = $("#normal_HEX_buttons_color").spectrum("get") ? $("#normal_HEX_buttons_color").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.preloaderColor1 = $("#preloaderColor1").spectrum("get") ? $("#preloaderColor1").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.preloaderColor2 = $("#preloaderColor2").spectrum("get") ? $("#preloaderColor2").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.scrubbersToolTipLabelBackgroundColor = $("#scrubbersToolTipLabelBackgroundColor").spectrum("get") ? $("#scrubbersToolTipLabelBackgroundColor").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.scrubbersToolTipLabelFontColor = $("#scrubbersToolTipLabelFontColor").spectrum("get") ? $("#scrubbersToolTipLabelFontColor").spectrum("get").toHexString() : "transparent";
    
        // Thumbnails preview settings.
        cur_settings_obj.thumbnails_preview_width = $("#thumbnails_preview_width").val();
        cur_settings_obj.thumbnails_preview_height = $("#thumbnails_preview_height").val();

        // logo settings.
        cur_settings_obj.show_logo = $("#show_logo").val();
        cur_settings_obj.hide_logo_with_controller = $("#hide_logo_with_controller").val();
        cur_settings_obj.logo_position = $("#logo_position").val();
        cur_settings_obj.logo_path = $("#logo_path").val().replace(/"/g, "'");
        cur_settings_obj.logo_link = $("#logo_link").val().replace(/"/g, "'");
        cur_settings_obj.logo_margins = parseInt($("#logo_margins").val());
    
        // Embed and info windows settings.
        cur_settings_obj.embed_and_info_window_close_button_margins = parseInt($("#embed_and_info_window_close_button_margins").val());
        cur_settings_obj.border_color = $("#border_color").spectrum("get") ? $("#border_color").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.main_labels_color = $("#main_labels_color").spectrum("get") ? $("#main_labels_color").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.secondary_labels_color = $("#secondary_labels_color").spectrum("get") ? $("#secondary_labels_color").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.share_and_embed_text_color = $("#share_and_embed_text_color").spectrum("get") ? $("#share_and_embed_text_color").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.input_background_color = $("#input_background_color").spectrum("get") ? $("#input_background_color").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.input_color = $("#input_color").spectrum("get") ? $("#input_color").spectrum("get").toHexString() : "transparent";
        
        // Ads settings.
        cur_settings_obj.open_new_page_at_the_end_of_the_ads = $("#open_new_page_at_the_end_of_the_ads").val();
        cur_settings_obj.ads_buttons_position = $("#ads_buttons_position").val();
        cur_settings_obj.skip_to_video_text = $("#skip_to_video_text").val().replace(/"/g, "'");
        cur_settings_obj.skip_to_video_button_text = $("#skip_to_video_button_text").val().replace(/"/g, "'");
        cur_settings_obj.ads_text_normal_color = $("#ads_text_normal_color").spectrum("get") ? $("#ads_text_normal_color").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.ads_text_selected_color = $("#ads_text_selected_color").spectrum("get") ? $("#ads_text_selected_color").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.ads_border_normal_color = $("#ads_border_normal_color").spectrum("get") ? $("#ads_border_normal_color").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.ads_border_selected_color = $("#ads_border_selected_color").spectrum("get") ? $("#ads_border_selected_color").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.audioVisualizerCircleColor = $("#audioVisualizerCircleColor").spectrum("get") ? $("#audioVisualizerCircleColor").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.audioVisualizerLinesColor = $("#audioVisualizerLinesColor").spectrum("get") ? $("#audioVisualizerLinesColor").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.atbTimeTextColorNormal = $("#atbTimeTextColorNormal").spectrum("get") ? $("#atbTimeTextColorNormal").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.atbTimeTextColorSelected = $("#atbTimeTextColorSelected").spectrum("get") ? $("#atbTimeTextColorSelected").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.atbButtonTextNormalColor = $("#atbButtonTextNormalColor").spectrum("get") ? $("#atbButtonTextNormalColor").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.atbButtonTextSelectedColor = $("#atbButtonTextSelectedColor").spectrum("get") ? $("#atbButtonTextSelectedColor").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.atbButtonBackgroundNormalColor = $("#atbButtonBackgroundNormalColor").spectrum("get") ? $("#atbButtonBackgroundNormalColor").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.atbButtonBackgroundSelectedColor = $("#atbButtonBackgroundSelectedColor").spectrum("get") ? $("#atbButtonBackgroundSelectedColor").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.thumbnails_preview_background_color = $("#thumbnails_preview_background_color").spectrum("get") ? $("#thumbnails_preview_background_color").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.thumbnails_preview_label_background_color = $("#thumbnails_preview_label_background_color").spectrum("get") ? $("#thumbnails_preview_label_background_color").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.thumbnails_preview_border_color = $("#thumbnails_preview_border_color").spectrum("get") ? $("#thumbnails_preview_border_color").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.thumbnails_preview_label_font_color = $("#thumbnails_preview_label_font_color").spectrum("get") ? $("#thumbnails_preview_label_font_color").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.contextMenuBackgroundColor = $("#contextMenuBackgroundColor").spectrum("get") ? $("#contextMenuBackgroundColor").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.contextMenuBorderColor = $("#contextMenuBorderColor").spectrum("get") ? $("#contextMenuBorderColor").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.contextMenuSpacerColor = $("#contextMenuSpacerColor").spectrum("get") ? $("#contextMenuSpacerColor").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.contextMenuItemNormalColor = $("#contextMenuItemNormalColor").spectrum("get") ? $("#contextMenuItemNormalColor").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.contextMenuItemSelectedColor = $("#contextMenuItemSelectedColor").spectrum("get") ? $("#contextMenuItemSelectedColor").spectrum("get").toHexString() : "transparent";
        cur_settings_obj.contextMenuItemDisabledColor = $("#contextMenuItemDisabledColor").spectrum("get") ? $("#contextMenuItemDisabledColor").spectrum("get").toHexString() : "transparent";

    }
    
    // Validate functions.
    function checkLength(el, prop, min, max){
        if(!el) return;
        if ((el.val().length > max) || (el.val().length < min)) {
            el.addClass("ui-state-error");
            updateTips("Length of " + prop + " must be between " + min + " and " + max + ".");
          
            return false;
        }else{
            return true;
        }
    }
    
    function checkIfIntegerAndLength(el, prop, min, max){
        var int_reg_exp = /-?[0-9]+/;
        var str = el.val();
        var res = str.match(int_reg_exp);
        
        if (res && (res[0] == str)) {
          if ((el.val().length > max) || (el.val().length < min)){
                  el.addClass("ui-state-error");
                  updateTips("Length of " + prop + " must be between " + min + " and " + max + ".");
                  return false;
              }else{
                  return true;
              }
        }else{
            el.addClass("ui-state-error");
            updateTips("The " + prop + " field value must be an integer.");
            return false;
        }
    }
    
    function checkIfFloatAndLength(el, prop, min, max){
        var float_reg_exp = /1\.0|0?\.[0-9]+|[01]/;
        var str = el.val();
        var res = str.match(float_reg_exp);
        
        if (res && (res[0] == str)) {
            if ((el.val().length > max) || (el.val().length < min)){
                el.addClass("ui-state-error");
                updateTips("Length of " + prop + " must be between " + min + " and " + max + ".");
                
                return false;
            } else{
                  return true;
            }
        } else {
            el.addClass("ui-state-error");
            updateTips("The " + prop + " field value must be a float number.");
            return false;
        }
    }
  
    function checkIfFloatAndLength2(el, prop, min, max){
        var float_reg_exp = /[0-9]*\.?[0-9]+/;
        var str = el.val();
        var res = str.match(float_reg_exp);
        
        if (res && (res[0] == str)) {
            if ((el.val().length > max) || (el.val().length < min)){
                el.addClass("ui-state-error");
                updateTips("Length of " + prop + " must be between " + min + " and " + max + ".");
                
                return false;
            }else{
                return true;
            }
        }else{
            el.addClass("ui-state-error");
            updateTips("The " + prop + " field value must be a float number.");
            
            return false;
        }
    }


    // Update tips.
    function updateTips(txt){
    
        $("#tips").text(txt).addClass("ui-state-highlight");
        setTimeout(function(){
          $("#tips").removeClass("ui-state-highlight", 1500);
        }, 500);
        
        $("#tips").addClass("fwd-error");
    } 
  

    // Validate fields.
    function validateFields(){
        fValid = true;
        allFields.removeClass("ui-state-error");
        
        // Main settings.
        fValid = fValid && checkLength($("#name"), "name", 1, 64);
        fValid = fValid && checkIfIntegerAndLength($("#stickyOnScrollWidth"), "sticky on scroll player maximum width:", 1, 8);
        fValid = fValid && checkIfIntegerAndLength($("#stickyOnScrollHeight"), "sticky on scroll player maximum height:", 1, 8);
        fValid = fValid && checkIfIntegerAndLength($("#max_width"), "maximum width", 1, 8);
        fValid = fValid && checkIfIntegerAndLength($("#max_height"), "maximum height", 1, 8);
        fValid = fValid && checkIfFloatAndLength($("#volume"), "volume", 1, 8);
        fValid = fValid && checkIfIntegerAndLength($("#greenScreenTolerance"), "green screen tolerance", 1, 3);
        fValid = fValid && checkLength($("#privateVideoPassword"), "private video password", 4, 64);
        if (!fValid){
            $("#tabs").tabs("option", "active", 0); 
            window.scrollTo(0,0);
            return false;
        }
    
        // Controller settings.
        fValid = fValid && checkIfIntegerAndLength($("#controller_height"), "controller height", 1, 8);
        fValid = fValid && checkIfFloatAndLength2($("#controller_hide_delay"), "controller hide delay", 1, 8);
        fValid = fValid && checkIfIntegerAndLength($("#start_space_between_buttons"), "start space between buttons", 1, 8);
        fValid = fValid && checkIfIntegerAndLength($("#space_between_buttons"), "space between buttons", 1, 8);
        fValid = fValid && checkIfIntegerAndLength($("#scrubbers_offset_width"), "scrubbers offset width", 1, 8);
        fValid = fValid && checkIfIntegerAndLength($("#main_scrubber_offest_top"), "main scrubber offset top", 1, 8);
        fValid = fValid && checkIfIntegerAndLength($("#time_offset_left_width"), "time offset left width", 1, 8);
        fValid = fValid && checkIfIntegerAndLength($("#time_offset_right_width"), "time offset right width", 1, 8);
        fValid = fValid && checkIfIntegerAndLength($("#volume_scrubber_width"), "volume scrubber height", 1, 8);
        fValid = fValid && checkIfIntegerAndLength($("#volume_scrubber_offset_right_width"), "volume scrubber offset height", 1, 8);
        if (!fValid){
            $("#tabs").tabs("option", "active", 1);
            window.scrollTo(0,0);
            return false;
        }
    
        // logo settings.
        fValid = fValid && checkLength($("#logo_path"), "logo path", 0, 256);
        fValid = fValid && checkLength($("#logo_link"), "logo link", 0, 256);
        fValid = fValid && checkIfIntegerAndLength($("#logo_margins"), "logo margins", 1, 8);
        if (!fValid){
            $("#tabs").tabs("option", "active", 2);
            window.scrollTo(0,0);
            return false;
        }
    
        // Embed and info windows settings.
        fValid = fValid && checkIfIntegerAndLength($("#embed_and_info_window_close_button_margins"), "embed and info window close button margins", 1, 8);
        if (!fValid){
            $("#tabs").tabs("option", "active", 3); 
            window.scrollTo(0,0); 
            return false;
        }

        // Ads settings.
        fValid = fValid && checkLength($("#skip_to_video_text"), "skip to video text", 0, 256);
        fValid = fValid && checkLength($("#skip_to_video_button_text"), "skip to video button text", 0, 256);
        if (!fValid){
            $("#tabs").tabs("option", "active", 4);
            window.scrollTo(0,0);
            return false;
        }
    
        // Popup on pause settings.
        fValid = fValid && checkLength($("#aopwTitle"), "title", 0, 256);
        fValid = fValid && checkIfIntegerAndLength($("#aopwWidth"), "maximum width", 1, 10);
        fValid = fValid && checkIfIntegerAndLength($("#aopwHeight"), "maximum height", 1, 10);
        fValid = fValid && checkIfIntegerAndLength($("#aopwBorderSize"), "advertisement border size", 1, 10);
        if (!fValid){
          $("#tabs").tabs("option", "active", 6);
          window.scrollTo(0,0);
          return false;
        }
    
        // Sticky.
        fValid = fValid && checkIfIntegerAndLength($("#openerEqulizerOffsetTop"), "equalizer offset top", 1, 10);
        fValid = fValid && checkIfIntegerAndLength($("#openerEqulizerOffsetLeft"), "equalizer offset left", 1, 10);
        fValid = fValid && checkIfIntegerAndLength($("#offsetX"), "offset X", 1, 10);
        fValid = fValid && checkIfIntegerAndLength($("#offsetY"), "offset Y", 1, 10);
        if (!fValid){
            $("#tabs").tabs("option", "active", 7);
            window.scrollTo(0,0);
            return false;
        }
    
        // Lightbox.
        fValid = fValid && checkIfFloatAndLength($("#lightBoxBackgroundOpacity"), "background opacity", 1, 3);
        if (!fValid){
            $("#tabs").tabs("option", "active", 8);
            window.scrollTo(0,0);
            return false;
        }

        // Thubnails preview.
        fValid = fValid && checkIfIntegerAndLength($("#thumbnails_preview_width"), "thumbnail width", 1, 3);
        fValid = fValid && checkIfIntegerAndLength($("#thumbnails_preview_height"), "thumbnail height", 1, 3);
        if (!fValid){
            $("#tabs").tabs("option", "active", 10);
            window.scrollTo(0,0);
            return false;
        }
    }
    

    // Add preset.
    $("#add_btn").click(function(e){
        validateFields();
        if($("#name").val() == fwdevpSettingsAr[fwdevpCurOrderId]["name"]){
            updateTips("Please make sure that the preset name is unique");
            $("#name").addClass("ui-state-error");
            $("#tabs").tabs("option", "active", 0);
            window.scrollTo(0,0);
            return false;
        };

        if (fValid) {
            fwdevpSetId = $("#skins option").length;
            fwdevpCurOrderId = $("#skins option").length;
            var idsAr = []; 
            if (fwdevpSetId > DEFAULT_SKINS_NR){
                $.each(fwdevpSettingsAr, function(i, el){
                idsAr.push(el.id);
            });
              
            for (var i=DEFAULT_SKINS_NR; i<fwdevpSettingsAr.length; i++){
                if ($.inArray(i, idsAr) == -1){
                   fwdevpSetId = i;
                   break;
                }
            }}
          
            updateSettings();
            fwdevpSettingsAr.push(cur_settings_obj);
            var data_obj ={
                action: "add",
                set_id: fwdevpSetId,
                set_order_id: fwdevpCurOrderId,
                tab_init_id: $("#tabs").tabs("option", "active"),
                fwdevpVideoStartBehaviour:$("#startBH").val(),
                fwdevpReplaceDF:$("#replaceDF").val(),
                fwdevpReplaceDFSkin:$("#replaceDFSkin").val(),
                fwdevpKeepCookies:$("#evpCookie").val(),
                settings_ar: fwdevpSettingsAr
            };
            $("#settings_data").val(JSON.stringify(data_obj));
        }else{
            return false;
        }
    });


    // Logo custom uploader.
    var evp_logo_uploader;
    $("#evp_logo_bg_image_btn").click(function(e){
          e.preventDefault();
   
          //If the uploader object has already been created, reopen the dialog
          if (evp_logo_uploader){
              evp_logo_uploader.open();
              return;
          }
          
          //Extend the wp.media object
          evp_logo_uploader = wp.media.frames.file_frame = wp.media({
              title: "Choose Image",
              button:
              {
                  text: "Add Image"
              },
              library:
              {
                type: "image"
              },
              multiple: false
          });
   
          //When a file is selected, grab the URL and set it as the text field's value
          evp_logo_uploader.on("select", function(){
              var attachment = evp_logo_uploader.state().get("selection").first().toJSON();
              
              $("#logo_path").val(attachment.url);
              $("#evp_logo_upload_img").attr("src", attachment.url);
          });
   
          //Open the uploader dialog
          evp_logo_uploader.open();
    });
  
    //bg image custom uploader
    var cov_bg_custom_uploader;
    $("#evp_bg_image_btn").click(function(e){
          e.preventDefault();
   
          //If the uploader object has already been created, reopen the dialog
          if (cov_bg_custom_uploader){
            cov_bg_custom_uploader.open();
              return;
          }
          
          // Extend the wp.media object.
          cov_bg_custom_uploader = wp.media.frames.file_frame = wp.media(
          {
              title: "Choose Image",
              button:
              {
                  text: "Add Image"
              },
              library:
              {
                type: "image"
              },
              multiple: false
          });
   
          // When a file is selected, grab the URL and set it as the text field's value.
          cov_bg_custom_uploader.on("select", function(){
              var attachment = cov_bg_custom_uploader.state().get("selection").first().toJSON();
              
              $("#mainBackgroundImagePath").val(attachment.url);
              $("#evp_bg_upload_img").attr("src", attachment.url);
          });
   
          //Open the uploader dialog
          cov_bg_custom_uploader.open();
      });
      

      // Update settings.
      $("#update_btn").click(function(){
          validateFields();
          if (fValid){
            
              updateSettings();
          
              fwdevpSettingsAr[fwdevpCurOrderId] = cur_settings_obj;
          
              var data_obj ={
                  action: "save",
                  set_id: fwdevpSetId,
                  set_order_id: fwdevpCurOrderId,
                  tab_init_id: $("#tabs").tabs("option", "active"),
                  fwdevpVideoStartBehaviour:$("#startBH").val(),
                  fwdevpReplaceDF:$("#replaceDF").val(),
                  fwdevpReplaceDFSkin:$("#replaceDFSkin").val(),
                  fwdevpKeepCookies:$("#evpCookie").val(),
                  settings_ar: fwdevpSettingsAr
              };
              $("#settings_data").val(JSON.stringify(data_obj));
          }else{
              return false;
          }
      });
      

      // Delete preset.
      $("#del_btn").click(function(){
          fwdevpSettingsAr.splice(fwdevpCurOrderId, 1);
          
          var data_obj ={
              action: "del",
              settings_ar: fwdevpSettingsAr,
              fwdevpVideoStartBehaviour:$("#startBH").val(),
              fwdevpReplaceDF:$("#replaceDF").val(),
              fwdevpReplaceDFSkin:$("#replaceDFSkin").val(),
              fwdevpKeepCookies:$("#evpCookie").val()
          };
        
          $("#settings_data").val(JSON.stringify(data_obj));
      });
    
      init();

      // Utils.  
      function escapeHtml(str) {
          var map = {
              "&": "&amp;",
              "<": "&lt;",
              ">": "&gt;",
              "\"": "&quot;",
              "'": "&#039;"
          };
          str = str.replace(/'/g, "\"");
          return str.replace(/[&<>"']/g, function(m) { return map[m]; });
      }

      function unescapeHtml(str) {
          var map = {
              "&amp;": "&",
              "&lt;": "<",
              "&gt;": ">",
              "&quot;": "\"",
              "&#039;": "'"
          };
          return str.replace(/(&amp;|&lt;|&gt;|&quot;|&#039;)/g, function(m) { return map[m]; });
      }

      function removeFirstAndLastChar(str){
          str = str.substring(1);
          str = str.slice(0, -1);
          return str;
      }
});