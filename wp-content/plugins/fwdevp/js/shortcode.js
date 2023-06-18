/**
 * Shortcode.
 *
 * @package fwdevp
 * @since fwdevp 1.0
 */

jQuery(document).ready(function($){
	
	'use strict';

	var ignoreCookiesOnce = true;

	fwdevpPresetsObj = unescapeHtml(fwdevpPresetsObj);
    fwdevpPresetsObj = JSON.parse(fwdevpPresetsObj);

    fwdevpKeepCookies = unescapeHtml(fwdevpKeepCookies);
    fwdevpKeepCookies = JSON.parse(fwdevpKeepCookies);

	$("#fwdevp_shortcode_options_div img, #fwd-evp-ccreate-cuepoint-dialog img, #fwdevp_add-vast-dialog img, #fwdevp-add-video-dialog img, #fwdevp_add-videoad-dialog img, #fwdevp_add-popupad-dialog img, #fwdevp_add-subtitle-dialog img").fwdTooltip({});
	
	$.each(fwdevpPresetsObj, function(i, el){
		$("#fwdevp_presets_list").append("<option value='" + el.name + "'>" + el.name + "</option>");
	});
	
	$("#fwdevp_presets_list").change(function() {
		$("#fwdevpShortCode").val(getShortcode());
	});	
	
	$("#fwdevp_playback_rate_speed").change(function() {
		$("#fwdevpShortCode").val(getShortcode());
	});	
	
	$("#redirectTarget").change(function() {
		$("#fwdevpShortCode").val(getShortcode());
	});	
	
	$("#fwdevp_div").hide();

	$("#fwdevp_presets_list").val(fwdevpPresetsObj[0].name);
	$("#fwdevp_playback_rate_speed").val(1);
	$("#fwdevp_start_at_video").val(1);
	$("#fwdevp_start_at_subtitle").val(1);

	
	//####################################//
	/* Cookies */
	//####################################//
	if(fwdevpKeepCookies == "yes"){
		setTimeout(setCookiesInputValues, 50);
	}
	
	function setCookies(){
		document.cookie = "sid=" +  $("#fwdevp_presets_list option:selected").val() + "; expires=Thu, 18 Dec 2080 12:00:00 UTC; path=/";
		document.cookie = "fwdevp_vid_path=" + $("#fwdevp_vid_path").val() + "; expires=Thu, 18 Dec 2080 12:00:00 UTC; path=/";
		document.cookie = "fwdevp_start_at_video=" + $("#fwdevp_start_at_video").val() + "; expires=Thu, 18 Dec 2080 12:00:00 UTC; path=/";
		document.cookie = "fwdevp_playback_rate_speed=" + $("#fwdevp_playback_rate_speed").val() + "; expires=Thu, 18 Dec 2080 12:00:00 UTC; path=/";
		document.cookie = "fwdevp_start_at_time=" + $("#fwdevp_start_at_time").val() + "; expires=Thu, 18 Dec 2080 12:00:00 UTC; path=/";
		document.cookie = "fwdevp_stop_at_time=" + $("#fwdevp_stop_at_time").val() + "; expires=Thu, 18 Dec 2080 12:00:00 UTC; path=/";
		document.cookie = "fwdevp_vid_poster=" + $("#fwdevp_vid_poster").val() + "; expires=Thu, 18 Dec 2080 12:00:00 UTC; path=/";
		document.cookie = "fwdevp_subtitle_path=" + $("#fwdevp_subtitle_path").val() + "; expires=Thu, 18 Dec 2080 12:00:00 UTC; path=/";
		document.cookie = "fwdevp_start_at_subtitle=" + $("#fwdevp_start_at_subtitle").val() + "; expires=Thu, 18 Dec 2080 12:00:00 UTC; path=/";
		document.cookie = "fwdevp_popupad_path=" + $("#fwdevp_popupad_path").val() + "; expires=Thu, 18 Dec 2080 12:00:00 UTC; path=/";
		document.cookie = "fwdevp_vast_path=" + String($("#fwdevp_vast_path").val()).replace(/;/g,'--') + "; expires=Thu, 18 Dec 2080 12:00:00 UTC; path=/";
		document.cookie = "fwdevp_video_ad_path=" + $("#fwdevp_video_ad_path").val() + "; expires=Thu, 18 Dec 2080 12:00:00 UTC; path=/";
		document.cookie = "pawp_source=" + $("#pawp_source").val() + "; expires=Thu, 18 Dec 2080 12:00:00 UTC; path=/";
		document.cookie = "redirectURL=" + $("#redirectURL").val() + "; expires=Thu, 18 Dec 2080 12:00:00 UTC; path=/";
		document.cookie = "fwdevp_video_cueppoint=" + String($("#fwdevp_video_cueppoint").val()).replace(/;/g,'--') + "; expires=Thu, 18 Dec 2080 12:00:00 UTC; path=/";
		document.cookie = "fwdevp_thumbnails_preview=" + $("#fwdevp_thumbnails_preview_input").val() + "; expires=Thu, 18 Dec 2080 12:00:00 UTC; path=/";
	}

	function setCookiesInputValues(){
		if(getCookie("sid") !=  undefined) $("#fwdevp_presets_list").val(getCookie("sid"));
		if(getCookie("fwdevp_vid_path") != undefined) $("#fwdevp_vid_path").val(getCookie("fwdevp_vid_path"));
		if(getCookie("fwdevp_start_at_video") != undefined) $("#fwdevp_start_at_video").val(getCookie("fwdevp_start_at_video"));
		if(getCookie("fwdevp_playback_rate_speed") != undefined) $("#fwdevp_playback_rate_speed").val(getCookie("fwdevp_playback_rate_speed"));
		if(getCookie("fwdevp_start_at_time") != undefined) $("#fwdevp_start_at_time").val(getCookie("fwdevp_start_at_time"));
		if(getCookie("fwdevp_stop_at_time") != undefined) $("#fwdevp_stop_at_time").val(getCookie("fwdevp_stop_at_time"));
		if(getCookie("fwdevp_vid_poster") != undefined) $("#fwdevp_vid_poster").val(getCookie("fwdevp_vid_poster"));
		if(getCookie("fwdevp_subtitle_path") != undefined) $("#fwdevp_subtitle_path").val(getCookie("fwdevp_subtitle_path"))
		if(getCookie("fwdevp_start_at_subtitle") != undefined) $("#fwdevp_start_at_subtitle").val(getCookie("fwdevp_start_at_subtitle"));
		if(getCookie("fwdevp_popupad_path") != undefined) $("#fwdevp_popupad_path").val(getCookie("fwdevp_popupad_path"));
		if(getCookie("fwdevp_vast_path") != undefined) $("#fwdevp_vast_path").val(String(getCookie("fwdevp_vast_path").replace(/--/g,';')));
		if(getCookie("fwdevp_video_ad_path") != undefined) $("#fwdevp_video_ad_path").val(getCookie("fwdevp_video_ad_path"));
		if(getCookie("pawp_source") != undefined) $("#pawp_source").val(getCookie("pawp_source"));
		if(getCookie("redirectURL") != undefined) $("#redirectURL").val(getCookie("redirectURL"));
		if(getCookie("fwdevp_video_cueppoint") != undefined) $("#fwdevp_video_cueppoint").val(String(getCookie("fwdevp_video_cueppoint").replace(/--/g,';')));
		if(getCookie("fwdevp_thumbnails_preview") != undefined) $("#fwdevp_thumbnails_preview_input").val(getCookie("fwdevp_thumbnails_preview"));
		$("#fwdevpShortCode").val(getShortcode());
	}
	
	
	function getCookie(cname) {
		var name = cname + "=";
		var decodedCookie = document.cookie;
		var ca = decodedCookie.split(';');
	
		for(var i = 0; i <ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return undefined;
	}
	
	
	//#############################################//
	/* Shortcode */
	//#############################################//
	var sid;
	var fwdevp_vid_path;
	var startAtVideo;
	var playbackRateSpeed;
	var fwdevp_vid_poster;
	var redirectTarget;
	var cuepoints_val;
	var fwdevp_subtitle_path;
	var popup_ads;
	var vast;
	var fwdevp_video_ad_path;
	var startAtSubtitle;
	var startAtTime;
	var stopAtTime;
	var thumbnailsPreview;
	var fwdevp_vid_path_mobile;
	var fwdevp_vid_poster_mobile;
	var fwdevp_ads_fwdevp_vid_path;
	var fwdevp_ads_fwdevp_vid_path_mobile;
	var pawp_source;
	var redirect;
	var ads_thumb_path;
	var str;
	var reg_exp;

	
	$('.fwdevpInputFleds').each(function() {
	   var elem = $(this);
	
	   // Save current value of element
	   elem.data('oldVal', elem.val());
	   // Look for changes in the value
	   elem.bind("propertychange change click keyup input paste", function(event){
		   
		  // If value has changed...
		  if (elem.data('oldVal') != elem.val()) {
		   // Updated stored value
		   elem.data('oldVal', elem.val());
		  
		  $("#fwdevpShortCode").val(getShortcode());
		 }
	   });
	});

	
	
	function getShortcode(){
		sid = $("#fwdevp_presets_list option:selected").val();
		fwdevp_vid_path = $("#fwdevp_vid_path").val();
		fwdevp_vid_poster = $("#fwdevp_vid_poster").val();
		fwdevp_vid_path_mobile = $("#fwdevp_vid_path_mobile").val();
		fwdevp_vid_poster_mobile = $("#fwdevp_vid_poster_mobile").val();
		fwdevp_ads_fwdevp_vid_path = $("#fwdevp_ads_fwdevp_vid_path").val();
		pawp_source = $("#pawp_source").val();
		redirect = $("#redirectURL").val();
		redirectTarget = $("#redirectTarget").val();
		fwdevp_subtitle_path = $("#fwdevp_subtitle_path").val();
		popup_ads = $("#fwdevp_popupad_path").val();
		vast = $("#fwdevp_vast_path").val();
		fwdevp_video_ad_path = $("#fwdevp_video_ad_path").val();
		fwdevp_ads_fwdevp_vid_path_mobile = $("#fwdevp_ads_fwdevp_vid_path_mobile").val();
		ads_thumb_path = $("#ads_thumb_path").val();
		cuepoints_val = $("#fwdevp_video_cueppoint").val();
		startAtVideo = $("#fwdevp_start_at_video").val();
		startAtSubtitle =  $("#fwdevp_start_at_subtitle").val();
		playbackRateSpeed = $("#fwdevp_playback_rate_speed").val() 
		startAtTime =  $("#fwdevp_start_at_time").val();
		stopAtTime =  $("#fwdevp_stop_at_time").val();
		thumbnailsPreview =  $("#fwdevp_thumbnails_preview_input").val();

		if(fwdevp_vid_poster){
			$("#fwdevp_upload_poster").attr("src", fwdevp_vid_poster);
		}
	
		str = fwdevp_vid_path.toLowerCase();
	
		var fwdevpShortCode = '[fwdevp preset_id="' + sid + '" video_path="' + fwdevp_vid_path + '"';
		
		if (startAtVideo.length > 0){
			fwdevpShortCode += ' start_at_video="' + startAtVideo + '"';
		}
		
		if (playbackRateSpeed.length > 0){
			fwdevpShortCode += ' playback_rate_speed="' + playbackRateSpeed + '"';
		}
		
		$("#fwdevp_start_at_time").removeClass("ui-state-error");
		if (startAtTime.length > 0){
			if(checkTimeFormat2($("#fwdevp_start_at_time"))){
				fwdevpShortCode += ' start_at_time="' + startAtTime + '"';
			}
		}
		
		$("#fwdevp_stop_at_time").removeClass("ui-state-error");
		if (stopAtTime.length > 0){
			if(checkTimeFormat2($("#fwdevp_stop_at_time"))){
				fwdevpShortCode += ' stop_at_time="' + stopAtTime + '"';
			}
		}
		
		if (fwdevp_vid_poster.length > 0){
			fwdevpShortCode += ' poster_path="' + fwdevp_vid_poster + '"';
		}

		if (fwdevp_subtitle_path.length > 0){
			fwdevpShortCode += ' subtitle_path="' + fwdevp_subtitle_path + '"';
		}
		
		if (startAtSubtitle.length > 0 && fwdevp_subtitle_path.length > 0){
			fwdevpShortCode += ' start_at_subtitle="' + startAtSubtitle + '"';
		}
		
		if(vast.length > 0){
			fwdevpShortCode += ' vast="' + vast + '"';
		}
		
		if(popup_ads.length > 0){
			fwdevpShortCode += ' popup_ads="' + popup_ads + '"';
		}
		
		if(fwdevp_video_ad_path.length > 0){
			fwdevpShortCode += ' video_ad_path="' + fwdevp_video_ad_path + '"';
		}
		
		if(pawp_source.length > 0){
			fwdevpShortCode += ' advertisement_on_pause_source="' + pawp_source + '"';
		}
		
		if(redirect.length > 0){
			fwdevpShortCode += ' redirect_url="' + redirect + '" redirect_target="' + redirectTarget + '"';
		}
		
		if(cuepoints_val.length > 0){
			fwdevpShortCode += ' cuepoints="' + cuepoints_val + '"';
		}

		if(thumbnailsPreview.length > 0){
			fwdevpShortCode += ' thumbnails_preview="' + thumbnailsPreview + '"';
		}

		
		fwdevpShortCode += ']';
		
		setTimeout(function(){
			fwdevp_adjustHeight(document.getElementById("fwdevp_vid_path"));
			fwdevp_adjustHeight(document.getElementById("fwdevpShortCode"));
			fwdevp_adjustHeight(document.getElementById("fwdevp_vast_path"));
			fwdevp_adjustHeight(document.getElementById("fwdevp_video_cueppoint"));
			fwdevp_adjustHeight(document.getElementById("fwdevp_video_ad_path"));
			fwdevp_adjustHeight(document.getElementById("fwdevp_popupad_path"));
			fwdevp_adjustHeight(document.getElementById("fwdevp_subtitle_path"))
		},100);

		if(!ignoreCookiesOnce){
			if(fwdevpKeepCookies == "yes"){
				setCookies();
			}
		}
		ignoreCookiesOnce = false;
	
		return fwdevpShortCode;
	}
	
	function addfwdevpShortCodeFinal(){
		var fwdevpShortCode = getShortcode();
		if (typeof tinymce != "undefined"){
			var editor = tinymce.get("content");
			if (editor && (editor instanceof tinymce.Editor) && ($("textarea#content:hidden").length != 0)){
				editor.selection.setContent(fwdevpShortCode);
				editor.save({no_events: true});
			}else{
				var text = $("textarea#content").val();
				var select_pos1 = $("textarea#content").prop("selectionStart");
				var select_pos2 = $("textarea#content").prop("selectionEnd");
				var new_text = text.slice(0, select_pos1) + fwdevpShortCode + text.slice(select_pos2);
				$("textarea#content").val(new_text);
			} 
		}else{
			var text = $("textarea#content").val();
			var select_pos1 = $("textarea#content").prop("selectionStart");
			var select_pos2 = $("textarea#content").prop("selectionEnd");
			var new_text = text.slice(0, select_pos1) + fwdevpShortCode + text.slice(select_pos2);
			$("textarea#content").val(new_text);
		}
		$("#fwdevp_div").hide();
		$("#fwdevp_div").fadeIn(600);
		$("#fwdevp_msg").html("The fwdevpShortCode has been added!");
	}
	
	//###############################################//
	/* Create cuepoints */
	//###############################################//
	$("#fwdevp_add_cuepoint_button").click(function(e){
        e.preventDefault();
		$("#fwd-evp-ccreate-cuepoint-dialog").dialog("open");
	});
	
	var allFieldsCuepoints = $([]).add($("#fwdevp_cuepoint_start_time")).add($("#fwdevp_cuepoint_code"));
	
	$("#fwd-evp-ccreate-cuepoint-dialog").dialog({
		autoOpen: false,
		width: 520,
	    height: 259,
	    modal: true,
	    dialogClass:'fwdevp',
	    buttons:[{
	    	text:fwdevpAdd__,
	        click: function(){
	         	var fValid = true;
	         	var tips = $("#fwdevp_cuepoint_tips");
	          	allFieldsCuepoints.removeClass("ui-state-error");
				fValid = fValid && checkTimeFormat(tips, $("#fwdevp_cuepoint_start_time"), "start time");
				fValid = fValid && checkLength(tips, $("#fwdevp_cuepoint_code"), "cuepoint javascript code", 1, 1000);
			
						
	          	if (fValid){
					var cuepointsPathsObj = $("#fwdevp_video_cueppoint").val();
					
					if(cuepointsPathsObj.indexOf("}") != -1){
						cuepointsPathsObj += ", {timeStart:'" + $("#fwdevp_cuepoint_start_time").val() + "', javascriptCall:'" +  $("#fwdevp_cuepoint_code").val() + "'}";
					}else{
						cuepointsPathsObj = "{timeStart:'" + $("#fwdevp_cuepoint_start_time").val() + "', javascriptCall:'" +  $("#fwdevp_cuepoint_code").val() + "'}";
					}
					
					$("#fwdevp_video_cueppoint").val(cuepointsPathsObj);
					$("#fwdevpShortCode").val(getShortcode());
					fwdevp_adjustHeight(document.getElementById("fwdevp_video_cueppoint"));
					$(this).dialog("close");
	         	}
	        }},
	        {
	        text:fwdevpCancel__,
	        click: function(){
	        	$(this).dialog("close");
	        }}
	    ],
	    close: function(){
		    allFieldsAddannotation.removeClass("ui-state-error");
		    $("#fwdevp_add_pr_tips").removeClass("fwd-error");
	    },
	    open: function(){
			$("#fwdevp_cuepoint_start_time").val("00:00:10");
	    	$("#fwdevp_cuepoint_code").val("");
		    $("#fwdevp_cuepoint_tips").text("The start time field is required.");
		    $('.ui-widget-overlay').addClass('fwdevp');
		}
	});
	
	
	//###############################################//
	/* Create annotation */
	//###############################################//
	$("#create_annotation_button").click(function(e){
        e.preventDefault();
		$("#create-annotation-dialog").dialog("open");
	});
	
	$("#createannteeny").height(250);
	$("#create-annotation-dialog").dialog({
		autoOpen: false,
		width: 800,
	    height: 600,
	    modal: true,
	    dialogClass:'fwdevp',
	    buttons:[{
	    	text:fwdevpAdd__,
	        click: function(){
	         	var fValid = true;
	         	var tips = $("#add_annotation_tips");
	          	allFieldsAddannotation.removeClass("ui-state-error");
	          	
				fValid = fValid && checkLength(tips, $("#annotation_image_source"), "source", 1, 2000);
				fValid = fValid && checkTimeFormat(tips, $("#annotation_start_time"), "start time");
				fValid = fValid && checkLength(tips, $("#fwdevp_time_to_hold_ad"), "time to hold add" , 1, 8);
				fValid = fValid && checkTimeFormat(tips, $("#fwdevp_add_duration"), "add duration");
						
	          	if (fValid){
					var annotationPathsObj = $("#annotation_ad_path").val();
					
					if(annotationPathsObj.indexOf("}") != -1){
						annotationPathsObj += ", {source:'" + $("#annotation_image_source").val() + "', url:'" +  $("#annotation_url").val() + "', target:'" +  $("#annotation_target").val() + "', start_time:'" + $("#annotation_start_time").val() +   " fwdevp_time_to_hold_add:'" +  $("#fwdevp_time_to_hold_ad").val() + "' fwdevp_add_duration:'" +  $("#fwdevp_add_duration").val() + "'}";
					}else{
						annotationPathsObj = "{source:'" + $("#annotation_image_source").val() + "', url:'" +  $("#annotation_url").val() + "', target:'" +  $("#annotation_target").val() + "', start_time:'" + $("#annotation_start_time").val() +   " fwdevp_time_to_hold_add:'" +  $("#fwdevp_time_to_hold_ad").val() + "' fwdevp_add_duration:'" +  $("#fwdevp_add_duration").val() + "'}";
					}
					
					$("#annotation_ad_path").val(annotationPathsObj);
					$("#fwdevpShortCode").val(getShortcode());
					fwdevp_adjustHeight(document.getElementById("annotation_ad_path"));
					$(this).dialog("close");
	         	}
	        }},
	        {
	        text:fwdevpCancel__,
	        click: function(){
	        	$(this).dialog("close");
	        }}
	    ],
	    close: function(){
		    allFieldsAddannotation.removeClass("ui-state-error");
		    $("#fwdevp_add_pr_tips").removeClass("fwd-error");
	    },
	    open: function(){
	    	$("#annotation_image_source").val("");
			$("#annotation_url").val("");
			$("#annotation_target").val("_blank");
			$("#annotation_start_time").val("");
			$("#fwdevp_time_to_hold_ad").val("00:00:04");
			$("#annotation_stop_time").val("");
			$("#fwdevp_add_duration").val("00:00:10");
		    $("#add_annotation_tips").text("The source field is required.");
		    $('.ui-widget-overlay').addClass('fwdevp');
		}
	});
	
	//###############################################//
	/* Add annotation sources */
	//###############################################//
	$("#add_annotation_button").click(function(e){
        e.preventDefault();
		$("#add-annotation-dialog").dialog("open");
	});
	
	var allFieldsAddannotation = $([]).add($("#annotation_image_source")).add($("#annotation_start_time")).add($("#fwdevp_time_to_hold_ad")).add($("#fwdevp_add_duration"));
	
	$("#add-annotation-dialog").dialog({
		autoOpen: false,
		width: 580,
	    height: 400,
	    modal: true,
	    dialogClass:'fwdevp',
	    buttons:[{
	    	text:fwdevpAdd__,
	        click: function(){
	         	var fValid = true;
	         	var tips = $("#add_annotation_tips");
	          	allFieldsAddannotation.removeClass("ui-state-error");
	          	
				fValid = fValid && checkLength(tips, $("#annotation_image_source"), "source", 1, 2000);
				fValid = fValid && checkTimeFormat(tips, $("#annotation_start_time"), "start time");
				fValid = fValid && checkTimeFormat(tips, $("#fwdevp_time_to_hold_ad"), "time to hold add");
				fValid = fValid && checkTimeFormat(tips, $("#fwdevp_add_duration"), "add duration");
						
	          	if (fValid){
					var annotationPathsObj = $("#annotation_ad_path").val();
					
					if(annotationPathsObj.indexOf("}") != -1){
						annotationPathsObj += ", {source:'" + $("#annotation_image_source").val() + "', url:'" +  $("#annotation_url").val() + "', target:'" +  $("#annotation_target").val() + "', start_time:'" + $("#annotation_start_time").val() +   " fwdevp_time_to_hold_add:'" +  $("#fwdevp_time_to_hold_ad").val() + "' fwdevp_add_duration:'" +  $("#fwdevp_add_duration").val() + "'}";
					}else{
						annotationPathsObj = "{source:'" + $("#annotation_image_source").val() + "', url:'" +  $("#annotation_url").val() + "', target:'" +  $("#annotation_target").val() + "', start_time:'" + $("#annotation_start_time").val() +   " fwdevp_time_to_hold_add:'" +  $("#fwdevp_time_to_hold_ad").val() + "' fwdevp_add_duration:'" +  $("#fwdevp_add_duration").val() + "'}";
					}
					
					$("#annotation_ad_path").val(annotationPathsObj);
					$("#fwdevpShortCode").val(getShortcode());
					fwdevp_adjustHeight(document.getElementById("annotation_ad_path"));
					$(this).dialog("close");
	         	}
	        }},
	        {
	        text:fwdevpCancel__,
	        click: function(){
	        	$(this).dialog("close");
	        }}
	    ],
	    close: function(){
		    allFieldsAddannotation.removeClass("ui-state-error");
		    $("#fwdevp_add_pr_tips").removeClass("fwd-error");
	    },
	    open: function(){
	    	$("#annotation_image_source").val("");
			$("#annotation_url").val("");
			$("#annotation_target").val("_blank");
			$("#annotation_start_time").val("");
			$("#fwdevp_time_to_hold_ad").val("00:00:04");
			$("#annotation_stop_time").val("");
			$("#fwdevp_add_duration").val("00:00:10");
		    $("#add_annotation_tips").text("The source field is required.");
		    $('.ui-widget-overlay').addClass('fwdevp');
		}
	});
	
	//###############################################//
	/* VAST */
	//###############################################//
	$("#fwdevp_add_vast_button").click(function(e){
        e.preventDefault();
		$("#fwdevp_add-vast-dialog").dialog("open");
	});
	
	var allFieldsAddvideoad = $([]).add($("#fwdevp_videoad_image_source")).add($("#fwdevp_videoad_start_time")).add($("#fwdevp_time_to_hold_ad")).add($("#fwdevp_add_duration"));
	
	$("#fwdevp_add-vast-dialog").dialog({
		autoOpen: false,
		width: 600,
	    height: 208,
	    modal: true,
	    dialogClass:'fwdevp',
	    buttons:[{
	    	text:fwdevpAdd__,
	        click: function(){
			
	         	var fValid = true;
	         	var tips = $("#fwdevp_add_vast_tips");
	          	allFieldsAddvideoad.removeClass("ui-state-error");
	          	
				fValid = fValid && checkLength(tips, $("#fwdevp_vast_xml_url"), "source", 1, 2000);
				
	          	if (fValid){
					var vastObj = $("#fwdevp_vast_xml_url").val();
					
					vastObj = "{source:'" +  $("#fwdevp_vast_xml_url").val() + "'}";

					$("#fwdevp_vast_path").val(vastObj);
					$("#fwdevpShortCode").val(getShortcode());
					fwdevp_adjustHeight(document.getElementById("fwdevp_vast_xml_url"));

					$(this).dialog("close");
	         	}
				
	        }},
	        {
	        text:fwdevpCancel__,
	        click: function(){
	        	$(this).dialog("close");
	        }}
	    ],
	    close: function(){
		    allFieldsAddvideoad.removeClass("ui-state-error");
		    $("#fwdevp_add_vast_tips").removeClass("fwd-error");
	    },
	    open: function(){
			
	    	$("#fwdevp_vast_xml_url").val("");
			$("#fwdevp_vast_xml_target").val("_blank");
			$("#fwdevp_vast_start_time").val("00:00:00");
			$('.ui-widget-overlay').addClass('fwdevp');
		}
	});
	
	
	//###############################################//
	/* Add videoad sources */
	//###############################################//
	$("#fwdevp_add_video_ad_button").click(function(e){
        e.preventDefault();
		$("#fwdevp_add-videoad-dialog").dialog("open");
	});
	
	var allFieldsAddvideoad = $([]).add($("#fwdevp_videoad_image_source")).add($("#fwdevp_videoad_start_time")).add($("#fwdevp_time_to_hold_ad")).add($("#fwdevp_add_duration"));
	
	$("#fwdevp_add-videoad-dialog").dialog({
		autoOpen: false,
		width: 630,
	    height: 496,
	    modal: true,
	    dialogClass:'fwdevp',
	    buttons:[{
	    	text:fwdevpAdd__,
	        click: function(){
	         	var fValid = true;
	         	var tips = $("#fwdevp_add_videoad_tips");
	          	allFieldsAddvideoad.removeClass("ui-state-error");
	          	
				fValid = fValid && checkLength(tips, $("#fwdevp_videoad_image_source"), "source", 1, 2000);
				fValid = fValid && checkTimeFormat(tips, $("#fwdevp_videoad_start_time"), "start time");
				fValid = fValid && checkLength(tips, $("#fwdevp_time_to_hold_ad"), "time to hold add", 1, 8);
				fValid = fValid && checkTimeFormat(tips, $("#fwdevp_add_duration"), "add duration");
						
	          	if (fValid){
					var videoadPathsObj = $("#fwdevp_video_ad_path").val();
					
					if(videoadPathsObj.indexOf("}") != -1){
						videoadPathsObj += ", {source:'" + $("#fwdevp_videoad_image_source").val() + "', url:'" +  $("#fwdevp_videofwdevp_ad_url").val() + "', target:'" +  $("#fwdevp_videofwdevp_ad_target").val() + "', start_time:'" + $("#fwdevp_videoad_start_time").val() +   "', fwdevp_time_to_hold_add:'" +  $("#fwdevp_time_to_hold_ad").val() + "', fwdevp_add_duration:'" +  $("#fwdevp_add_duration").val() + "'}";
					}else{
						videoadPathsObj = "{source:'" + $("#fwdevp_videoad_image_source").val() + "', url:'" +  $("#fwdevp_videofwdevp_ad_url").val() + "', target:'" +  $("#fwdevp_videofwdevp_ad_target").val() + "', start_time:'" + $("#fwdevp_videoad_start_time").val() +   "', fwdevp_time_to_hold_add:'" +  $("#fwdevp_time_to_hold_ad").val() + "', fwdevp_add_duration:'" +  $("#fwdevp_add_duration").val() + "'}";
					}
					
					$("#fwdevp_video_ad_path").val(videoadPathsObj);
					$("#fwdevpShortCode").val(getShortcode());
					fwdevp_adjustHeight(document.getElementById("fwdevp_video_ad_path"));
					$(this).dialog("close");
	         	}
	        }},
	        {
	        text:fwdevpCancel__,
	        click: function(){
	        	$(this).dialog("close");
	        }}
	    ],
	    close: function(){
		    allFieldsAddvideoad.removeClass("ui-state-error");
		    $("#fwdevp_add_pr_tips").removeClass("fwd-error");
	    },
	    open: function(){
	    	$("#fwdevp_videoad_image_source").val("");
			$("#fwdevp_videofwdevp_ad_url").val("");
			$("#fwdevp_videofwdevp_ad_target").val("_blank");
			$("#fwdevp_videoad_start_time").val("");
			$("#fwdevp_time_to_hold_ad").val("4");
			$("#videoad_stop_time").val("");
			$("#fwdevp_add_duration").val("00:00:10");
		    $("#fwdevp_add_videoad_tips").text("The source field is required.");
		    $('.ui-widget-overlay').addClass('fwdevp');
		}
	});
	
	//###############################################//
	/* Add popupad sources */
	//###############################################//
	$("#popupad_type").change(function() {
		initPopupAdForm();
	});
	
	function initPopupAdForm(){
		if($("#popupad_type").val() == "image"){
			$("#evp_image_source").show();
			$("#evp_adsense").hide();
			$("#fwdevp_add-popupad-dialog").dialog({width:590,height:502});
		}else{
			$("#evp_image_source").hide();
			$("#evp_adsense").show();
			$("#fwdevp_add-popupad-dialog").dialog({width:430,height:525});	
		}
	}
	
	$("#fwdevp_add_popupad_button").click(function(e){
        e.preventDefault();
		$("#fwdevp_add-popupad-dialog").dialog("open");
	});
	
	var allFieldsAddpopupad = $([]).add($("#fwdevp_popup_image_source")).add($("#fwdevp_popup_start_time")).add($("#fwdevp_popup_stop_time")).add($("#google_ad_client")).add($("#google_ad_slot")).add($("#google_ad_width")).add($("#google_ad_height")).add($("#google_ad_start_time")).add($("#google_ad_stop_time"));
	
	$("#fwdevp_add-popupad-dialog").dialog({
		autoOpen: false,
		width: 590,
	    height: 700,
	    modal: true,
	    dialogClass:'fwdevp',
	    buttons:[{
	    	text:fwdevpAdd__,
	        click: function(){
	         	var fValid = true;
				
	         	var tips = $("#fwdevp_add_pr_tips");
	          	allFieldsAddpopupad.removeClass("ui-state-error");
				
				if($("#popupad_type").val() == "image"){
	          	
					fValid = fValid && checkLength(tips, $("#fwdevp_popup_image_source"), "source", 1, 2000);
					fValid = fValid && checkTimeFormat(tips, $("#fwdevp_popup_start_time"), "start time");
					fValid = fValid && checkTimeFormat(tips, $("#fwdevp_popup_stop_time"), "stop time");
					
					if (fValid){
						var popupadPathsObj = $("#fwdevp_popupad_path").val();
						
						if(popupadPathsObj.indexOf("}") != -1){
							popupadPathsObj += ", {source:'" + $("#fwdevp_popup_image_source").val() + "', url:'" +  $("#fwdevp_ad_url").val() + "', target:'" +  $("#fwdevp_ad_target").val() + "', start_time:'" + $("#fwdevp_popup_start_time").val() + "', stop_time:'" +  $("#fwdevp_popup_stop_time").val() + "'}";
						}else{
							popupadPathsObj = "{source:'" + $("#fwdevp_popup_image_source").val() + "', url:'" +  $("#fwdevp_ad_url").val() + "', target:'" +  $("#fwdevp_ad_target").val() + "', start_time:'" +  $("#fwdevp_popup_start_time").val() + "', stop_time:'" +  $("#fwdevp_popup_stop_time").val() + "'}";
						}
						
						$("#fwdevp_popupad_path").val(popupadPathsObj);
						$("#fwdevpShortCode").val(getShortcode());
						fwdevp_adjustHeight(document.getElementById("fwdevp_popupad_path"));
						$(this).dialog("close");
					}
				}else{
					
					fValid = fValid && checkLength(tips, $("#google_ad_client"), "google adsense ad client code", 1, 300);
					fValid = fValid && checkLength(tips, $("#google_ad_slot"), "google adsense ad slot code", 1, 300);
					fValid = fValid && checkIfIntegerAndLength(tips, $("#google_ad_width"), "google adsense ad width", 1, 5);
					fValid = fValid && checkIfIntegerAndLength(tips, $("#google_ad_height"), "google adsense ad height", 1, 5);
					fValid = fValid && checkTimeFormat(tips, $("#google_ad_start_time"), "google adsense ad start time");
					fValid = fValid && checkTimeFormat(tips, $("#google_ad_stop_time"), "google adsense ad stop time");
					
					if (fValid){
						var popupadPathsObj = $("#fwdevp_popupad_path").val();
						
						if(popupadPathsObj.indexOf("}") != -1){
							popupadPathsObj += ", {google_ad_client:'" + $("#google_ad_client").val() + "', google_ad_slot:'" +  $("#google_ad_slot").val() + "', google_ad_start_time:'" +  $("#google_ad_start_time").val() + "', google_ad_stop_time:'" + $("#google_ad_stop_time").val() + "', google_ad_width:" +  $("#google_ad_width").val() + ", google_ad_height:" +  $("#google_ad_height").val() + "}";
						}else{
							popupadPathsObj = "{google_ad_client:'" + $("#google_ad_client").val() + "', google_ad_slot:'" +  $("#google_ad_slot").val() + "', google_ad_start_time:'" +  $("#google_ad_start_time").val() + "', google_ad_stop_time:'" + $("#google_ad_stop_time").val() + "', google_ad_width:" +  $("#google_ad_width").val() + ", google_ad_height:" +  $("#google_ad_height").val() + "}";
						}
						
						$("#fwdevp_popupad_path").val(popupadPathsObj);
						$("#fwdevpShortCode").val(getShortcode());
						fwdevp_adjustHeight(document.getElementById("fwdevp_popupad_path"));
						$(this).dialog("close");
					}		
				}
	        }},
	        {
	        text:fwdevpCancel__,
	        click: function(){
	        	$(this).dialog("close");
	        }}
	    ],
	    close: function(){
		    allFieldsAddpopupad.removeClass("ui-state-error");
		    $("#fwdevp_add_pr_tips").removeClass("fwd-error");
	    },
	    open: function(){
		    $("#fwdevp_popup_ads_thumb_source").attr("src", "");
			
	    	$("#fwdevp_popup_image_source").val("");
			$("#fwdevp_ad_url").val("");
			$("#target").val("_blank");
			$("#fwdevp_popup_start_time").val("");
			$("#fwdevp_popup_stop_time").val("");
		    $("#add-popupad-tips").text("The name field is required.");
			
			$("#evp_image_source").show();
			$("#link_type").show();
			$("#ad_time_start").show();
			$("#evp_adsense").hide();
			
			$("#fwdevp_add_pr_tips").text("The image source field is required");
			$("#popupad_type").val("image");
			initPopupAdForm();
			$('.ui-widget-overlay').addClass('fwdevp');
		}
	});
	
	
	//###############################################//
	/* Add subtitle sources */
	//###############################################//
	$("#fwdevp_add_subtitle_button").click(function(e){
        e.preventDefault();
		$("#fwdevp_add-subtitle-dialog").dialog("open");
	});
	
	var allFieldsAddsubtitle = $([]).add($("#fwdevp_subtitle_label")).add($("#fwdevp_subtitle_source"));
	
	$("#fwdevp_add-subtitle-dialog").dialog({
		autoOpen: false,
		width: 528,
	    height: 341,
	    modal: true,
	    dialogClass:'fwdevp',
	    buttons:[{
	    	text:fwdevpAdd__,
	        click: function(){
	         	var fValid = true;
	         	var tips = $("#fwdevp_add-subtitle-tips");
	          	allFieldsAddsubtitle.removeClass("ui-state-error");
	          
				fValid = fValid && checkLength(tips, $("#fwdevp_subtitle_label"), "label", 1, 64);
				fValid = fValid && checkLength(tips, $("#fwdevp_subtitle_source"), "source", 1, 2000);
						
	          	if (fValid){
					var subtitlePathsObj = $("#fwdevp_subtitle_path").val();
					if(!attachment2){
						var attachment2 = {}
						attachment2.url =  $("#fwdevp_subtitle_source").val();
					}
					
					if($("#subtitle_evpencript").val() == "yes"){
						attachment2.url = "encrypt:" + btoa(attachment2.url);
					}
					
					if(subtitlePathsObj.indexOf("}") != -1){
						subtitlePathsObj += ", {source:'" + attachment2.url + "', label:'" +  clean($("#fwdevp_subtitle_label").val()) + "'}";
					}else{
						subtitlePathsObj = "{source:'" + attachment2.url + "', label:'" +  clean($("#fwdevp_subtitle_label").val()) + "'}";
					}
					
					
					$("#fwdevp_subtitle_path").val(subtitlePathsObj);
					$("#fwdevpShortCode").val(getShortcode());
					fwdevp_adjustHeight(document.getElementById("fwdevp_subtitle_path"));
					$(this).dialog("close");
	         	}
	        }},
	        {
	        text:fwdevpCancel__,
	        click: function(){
	        	$(this).dialog("close");
	        }}
	    ],
	    close: function(){
		    allFieldsAddsubtitle.removeClass("ui-state-error");
		    $("#add_mp_tips").removeClass("fwd-error");
	    },
	    open: function(){
			$("#fwdevp_subtitle_source").val("");
			$("#fwdevp_subtitle_label").val("");
			$("#subtitle_evpencript").val("no");
		    $("#fwdevp_add-subtitle-tips").text("The name field is required.");
		    $('.ui-widget-overlay').addClass('fwdevp');
		}
	});
	
	
	//###############################################//
	/* Add video sources */
	//###############################################//
	$("#fwdevp-add_video_button").click(function(e){
        e.preventDefault();
		$("#fwdevp-add-video-dialog").dialog("open");
	});
	
	var allFieldsAddVideo = $([]).add($("#video_label")).add($("#fwdevp_video_source"));
	

	//###############################################//
	/* Add video sources */
	//###############################################//
	$("#fwdevp-add_video_button").click(function(e){
        e.preventDefault();
		$("#fwdevp-add-video-dialog").dialog("open");
	});
	
	var allFieldsAddVideo = $([]).add($("#video_label")).add($("#rotationY360DegreeVideo")).add($("#fwdevp_video_source"));

	$('#fwdevp_videoType').on('change', function() {
	   var val = $(this).find(":selected").val();
	   if(val == '360DegreeVideo'){
	   		$('.vr-options').addClass('fwdevp-visible');
	   		$("#fwdevp-add-video-dialog").dialog({height:630});
	   }else{
	   	   $('.vr-options').removeClass('fwdevp-visible');
	   	   $("#fwdevp-add-video-dialog").dialog({height:526});
	   }
	});
	
	$("#fwdevp-add-video-dialog").dialog({
		autoOpen: false,
		width: 610,
	    height: 526,
	    modal: true,
	    dialogClass:'fwdevp',
	    buttons:[{
	    	text:fwdevpAdd__,
	        click: function(){
	         	var fValid = true;
	         	var tips = $("#fwdevp_add-video-tips");
	          	allFieldsAddVideo.removeClass("ui-state-error");

				fValid = fValid && checkIfIntegerAndLength(tips, $("#rotationY360DegreeVideo"), "360 video start rotation", 0, 5);
				fValid = fValid && checkLength(tips, $("#video_label"), "label", 1, 64);
				fValid = fValid && checkLength(tips, $("#fwdevp_video_source"), "source", 1, 2000);
				
				var isLive = $("#fwdevp_videoType").val().indexOf("hlsLiveStream") != -1;
				if(isLive){
					isLive = "yes";
				}else{
					isLive = "no";
				}
				
	          	if (fValid){
					var videoPathsObj = $("#fwdevp_vid_path").val();
					if(!attachment){
						var attachment = {}
						attachment.url =  $("#fwdevp_video_source").val();
					}
					
					if($("#fwd_evpencript").val() == "yes"){
						attachment.url = "encrypt:" + btoa(attachment.url);
					}

					var secondSource = '';
					var secondSourceVal = $("#fwdevp_video_source2").val();
					if(secondSourceVal && secondSourceVal.length){
						if($("#fwd_evpencript").val() == "yes"){
							secondSource = " ,source2:'" +  "encrypt:" + btoa(secondSourceVal) + "'"
						}else{
							secondSource = " ,source2:'" + secondSourceVal + "'";
						}
						
					}
			
					if(isLive == "yes"){
						if(videoPathsObj.indexOf("}") != -1){
							videoPathsObj += ", {source:'" + attachment.url + "'"  + secondSource + ", label:'" +  clean($("#video_label").val()) + "', videoType:'" +  $("#fwdevp_videoType").val() + "', isLive:'" +  isLive  + "', isPrivate:'" +  $("#fwdevp_is_private").val();
							videoPathsObj += "'}"
						}else{
							videoPathsObj = "{source:'" + attachment.url + "'"  + secondSource + ", label:'" +  clean($("#video_label").val()) + "', videoType:'" +  $("#fwdevp_videoType").val()  + "', isLive:'" +  isLive  + "', isPrivate:'" +  $("#fwdevp_is_private").val();
							videoPathsObj += "'}"
						}
					}else{
						if(videoPathsObj.indexOf("}") != -1){
							videoPathsObj += ", {source:'" + attachment.url + "'"  + secondSource + ", label:'" +  clean($("#video_label").val()) + "', videoType:'" +  $("#fwdevp_videoType").val()  + "', isPrivate:'" +  $("#fwdevp_is_private").val()
							if($("#fwdevp_videoType").val() == '360DegreeVideo'){
								if($('#startWhenPlayButtonClick360DegreeVideo').val() == 'yes'){
									videoPathsObj += "', startWhenPlayButtonClick360DegreeVideo:'" +  $("#startWhenPlayButtonClick360DegreeVideo").val()
								}
								
								if($('#rotationY360DegreeVideo').val().length){
									videoPathsObj += "', rotationY360DegreeVideo:'" +  $("#rotationY360DegreeVideo").val()
								}
							}
							videoPathsObj += "'}"
						}else{
							videoPathsObj = "{source:'" + attachment.url + "'"  + secondSource + ", label:'" +  clean($("#video_label").val()) + "', videoType:'" +  $("#fwdevp_videoType").val()  + "', isPrivate:'" +  $("#fwdevp_is_private").val()
							if($("#fwdevp_videoType").val() == '360DegreeVideo'){
								if($('#startWhenPlayButtonClick360DegreeVideo').val() == 'yes'){
									videoPathsObj += "', startWhenPlayButtonClick360DegreeVideo:'" +  $("#startWhenPlayButtonClick360DegreeVideo").val()
								}
								
								if($('#rotationY360DegreeVideo').val().length){
									videoPathsObj += "', rotationY360DegreeVideo:'" +  $("#rotationY360DegreeVideo").val()
								}
							}
							videoPathsObj += "'}"
						}
					}
					
					
					$("#fwdevp_vid_path").val(videoPathsObj);
					$("#fwdevpShortCode").val(getShortcode());
					
					fwdevp_adjustHeight(document.getElementById("fwdevp_vid_path"));
					$(this).dialog("close");
	         	}	
	        }},
	        {
	        text:fwdevpCancel__,
	        click: function(){
	        	$(this).dialog("close");
	        }}
	    ],
	    close: function(){
		    allFieldsAddVideo.removeClass("ui-state-error");
		    $("#add_mp_tips").removeClass("fwd-error");
	    },
	    open: function(){
			$("#video_label").val("");
			$("#fwdevp_video_source").val("");
			$("#fwdevp_video_source2").val("");
			$("#fwdevp_videoType").val("normal");
			$("#fwdevp_is_private").val("no");
			$("#fwd_evpencript").val("no");
			
		    $("#fwdevp_add-video-tips").text("The name field is required.");
		    $('.ui-widget-overlay').addClass('fwdevp'); 
		    $('#rotationY360DegreeVideo').val('');
		    $('#startWhenPlayButtonClick360DegreeVideo').val('no');
		    $('.vr-options').removeClass('fwdevp-visible');
		    $("#fwdevp-add-video-dialog").dialog({height:526});
		}
	});


	// Video custom uploader.
	var custom_uploader;
    $("#fwdevp_upload_video_button").click(function(e){
        e.preventDefault();
 
        //If the uploader object has already been created, reopen the dialog
        if (custom_uploader){
            custom_uploader.open();
            return;
        }
        
        // Extend the wp.media object.
        custom_uploader = wp.media.frames.file_frame = wp.media({
            title: "Choose media",
            button:{
                text: "Add media"
            },
            library:{
            	type: "video, audio"
            },
            multiple: false
        });
 
        // When a file is selected, grab the URL and set it as the text field's value.
        custom_uploader.on("select", function(){
            var attachment = custom_uploader.state().get("selection").first().toJSON();
            $("#fwdevp_video_source").val(attachment.url);
			$("#fwdevpShortCode").val(getShortcode());
        });
 
        // Open the uploader dialog.
        custom_uploader.open();
    });

    var secondSrcUploader;
    $("#fwdevp_upload_video_button2").click(function(e){
        e.preventDefault();
 
        // If the uploader object has already been created, reopen the dialog.
        if (secondSrcUploader){
            secondSrcUploader.open();
            return;
        }
        
        // Extend the wp.media object.
        secondSrcUploader = wp.media.frames.file_frame = wp.media({
            title: "Choose media",
            button:{
                text: "Add media"
            },
            library:{
            	type: "video, audio"
            },
            multiple: false
        });
 
        // When a file is selected, grab the URL and set it as the text field's value.
        secondSrcUploader.on("select", function(){
            var attachment = secondSrcUploader.state().get("selection").first().toJSON();
            $("#fwdevp_video_source2").val(attachment.url);
			$("#fwdevpShortCode").val(getShortcode());
        });
 
        // Open the uploader dialog.
        secondSrcUploader.open();
    });
	

	// Video custom uploader mobile.
	var custom_uploader2;
    
    $("#upload_video_button_mobile").click(function(e){
        e.preventDefault();
 
        // If the uploader object has already been created, reopen the dialog.
        if (custom_uploader2){
            custom_uploader2.open();
            return;
        }
        
        // Extend the wp.media object.
        custom_uploader2 = wp.media.frames.file_frame = wp.media({
            title: "Choose MP4",
            button:
            {
                text: "Add MP4"
            },
            library:
            {
            	type: "video/mp4"
            },
            multiple: false
        });
 
        // When a file is selected, grab the URL and set it as the text field's value.
        custom_uploader2.on("select", function(){
            var attachment = custom_uploader2.state().get("selection").first().toJSON();
            
            $("#fwdevp_vid_path_mobile").val(attachment.url);
			$("#fwdevpShortCode").val(getShortcode());
        });
 
        //Open the uploader dialog
        custom_uploader2.open();
    });
	

	// Video poster custom uploader.
	var custom_uploader3;
   
    $("#fwdevp_upload_poster_button").click(function(e){
        e.preventDefault();
 
        // If the uploader object has already been created, reopen the dialog.
        if (custom_uploader3){
            custom_uploader3.open();
            return;
        }
        
        // Extend the wp.media object.
        custom_uploader3 = wp.media.frames.file_frame = wp.media({
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
        custom_uploader3.on("select", function(){
            var attachment = custom_uploader3.state().get("selection").first().toJSON();
            
            $("#fwdevp_vid_poster").val(attachment.url);
            $("#fwdevp_upload_poster").attr("src", attachment.url);
			$("#fwdevpShortCode").val(getShortcode());
        });
 
        // Open the uploader dialog.
        custom_uploader3.open();
    });
	

	// Video mobile poster custom uploader.
	var custom_uploader4;  
    $("#fwdevp_upload_poster_button_mobile").click(function(e){
        e.preventDefault();
 
        // If the uploader object has already been created, reopen the dialog.
        if (custom_uploader4){
            custom_uploader4.open();
            return;
        }
        
        // Extend the wp.media object.
        custom_uploader4 = wp.media.frames.file_frame = wp.media({
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
        custom_uploader4.on("select", function(){
            var attachment = custom_uploader4.state().get("selection").first().toJSON();
            
            $("#fwdevp_vid_poster_mobile").val(attachment.url);
            $("#upload_poster_mobile").attr("src", attachment.url);
			$("#fwdevpShortCode").val(getShortcode());
        });
 
        //Open the uploader dialog
        custom_uploader4.open();
    });
	

	// Ads video custom uploader.
	var custom_uploader5;
    
    $("#upload_ads_video_button").click(function(e){
        e.preventDefault();
 
        //If the uploader object has already been created, reopen the dialog
        if (custom_uploader5){
            custom_uploader5.open();
            return;
        }
        
        //Extend the wp.media object
        custom_uploader5 = wp.media.frames.file_frame = wp.media({
            title: "Choose MP4",
            button:
            {
                text: "Add MP4"
            },
            library:
            {
            	type: "video/mp4"
            },
            multiple: false
        });
 
        //When a file is selected, grab the URL and set it as the text field's value
        custom_uploader5.on("select", function(){
            var attachment = custom_uploader5.state().get("selection").first().toJSON();
            
            $("#fwdevp_ads_fwdevp_vid_path").val(attachment.url);
			$("#fwdevpShortCode").val(getShortcode());
        });
 
        //Open the uploader dialog
        custom_uploader5.open();
    });
	

	// Ads video custom uploader mobile.
	var subtitle_uploader;
    
    $("#fwdevp_fwdevp_upload_subtitle_button").click(function(e){
        e.preventDefault();
 
        //If the uploader object has already been created, reopen the dialog
        if (subtitle_uploader){
            subtitle_uploader.open();
            return;
        }
        
        //Extend the wp.media object
        subtitle_uploader = wp.media.frames.file_frame = wp.media({
            title: "Choose subtitle file (.srt or .txt)",
            button:
            {
                text: "Add subtitle file"
            },
            
            multiple: false
        });
 
        //When a file is selected, grab the URL and set it as the text field's value
        subtitle_uploader.on("select", function(){
            var attachment2 = subtitle_uploader.state().get("selection").first().toJSON();
         
            $("#fwdevp_subtitle_source").val(attachment2.url);
			$("#fwdevpShortCode").val(getShortcode());
        });
 
        //Open the uploader dialog
        subtitle_uploader.open();
    });
	

	// Ads video custom uploader mobile.
	var custom_uploader6;
    
    $("#fwdevp_videoad_image_source_button").click(function(e){
        e.preventDefault();
 
        //If the uploader object has already been created, reopen the dialog
        if (custom_uploader6)
        {
            custom_uploader6.open();
            return;
        }
        
        // Extend the wp.media object.
        custom_uploader6 = wp.media.frames.file_frame = wp.media({
            title: "Choose mp4 or image",
            button:
            {
                text: "Add mp4 or image"
            },
            library:
            {
            	type: "video/mp4, image"
            },
            multiple: false
        });
 
        // When a file is selected, grab the URL and set it as the text field's value.
        custom_uploader6.on("select", function(){
            var attachment3 = custom_uploader6.state().get("selection").first().toJSON();
            $("#fwdevp_videoad_image_source").val(attachment3.url);
			
			$("#fwdevpShortCode").val(getShortcode());
        });
 
        // Open the uploader dialog.
        custom_uploader6.open();
    });
	

	// Ads thumb custom uploader.
	var custom_uploader7;
    
    $("#fwdevp_upload_image_source_button").click(function(e){
        e.preventDefault();
        //If the uploader object has already been created, reopen the dialog
        if (custom_uploader7){
            custom_uploader7.open();
            return;
        }

        // Extend the wp.media object.
        custom_uploader7 = wp.media.frames.file_frame = wp.media({
            title: "Choose Image",
            button:{
                text: "Add Image"
            },
            library:
            {
            	type: "image"
            },
            multiple: false
        });

        // When a file is selected, grab the URL and set it as the text field's value.
        custom_uploader7.on("select", function(){
            var attachment = custom_uploader7.state().get("selection").first().toJSON();
            $("#fwdevp_popup_image_source").val(attachment.url);
            $("#fwdevp_popup_ads_thumb_source").attr("src", attachment.url);
        });
 
        // Open the uploader dialog.
        custom_uploader7.open();
    });
	

	// Ads video custom uploader mobile.
	var thumbnails_preview_uploader;
    
    $("#fwdevp_thumbnails_preview_button").click(function(e){
        e.preventDefault();
 
        // If the uploader object has already been created, reopen the dialog.
        if (thumbnails_preview_uploader){
            thumbnails_preview_uploader.open();
            return;
        }
        
        // Extend the wp.media object.
        thumbnails_preview_uploader = wp.media.frames.file_frame = wp.media({
            title: "Choose subtitle file (.srt or .txt)",
            button:
            {
                text: "Add subtitle file"
            },
            
            multiple: false
        });
 
        // When a file is selected, grab the URL and set it as the text field's value.
        thumbnails_preview_uploader.on("select", function(){
            var attachment2 = thumbnails_preview_uploader.state().get("selection").first().toJSON();
         
            $("#fwdevp_thumbnails_preview_input").val(attachment2.url);
			$("#fwdevpShortCode").val(getShortcode());
        });
 
        // Open the uploader dialog.
        thumbnails_preview_uploader.open();
    });
	
	
	// Utils.
	function checkTimeFormat(tips, el, prop, min, max){
		var timeRegExp = /^(?:2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]$/;
		
      	if(!timeRegExp.test(el.val())){
        	el.addClass("ui-state-error");
        	updateTips(tips, "The  " + prop + " field must have the format hh:mm:ss ex:00:10:48 .");
        	return false;
      	}else{
        	return true;
      	}
	}
	
	function checkTimeFormat2(el){
		var timeRegExp = /^(?:2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]$/;
		
      	if(!timeRegExp.test(el.val())){
        	el.addClass("ui-state-error");
        	return false;
      	}else{
        	return true;
      	}
	}

	
	function checkLength(tips, el, prop, min, max){
      	if ((el.val().length > max) || (el.val().length < min)){
        	el.addClass("ui-state-error");
        	updateTips(tips, "Length of " + prop + " must be between " + min + " and " + max + ".");
        	
        	return false;
      	}else{
        	return true;
      	}
	}
	
	function updateTips(tips, txt){
	    tips.text(txt).addClass("ui-state-highlight");
	    setTimeout(function(){
	    	tips.removeClass("ui-state-highlight", 1500);
	    }, 500);
	    
	    tips.addClass("fwd-error");
	}
	
	 function checkIfIntegerAndLength(tips, el, prop, min, max){
    	var int_reg_exp = /-?[0-9]+/;
    	var str = el.val();
    	var res = str.match(int_reg_exp);

    	if(str.length === 0 && min === 0){
    		return true;
    	}
    	
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
        	updateTips(tips, "The " + prop + " field value must be an integer.");
        	return false;
        }
	}

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

	function clean(str){
		return str.replace(/[^A-Za-z0-9\-\s]/gi, '');
	}
});

function fwdevp_adjustHeight(element){
	element.style.height = "auto";
    element.style.height = (element.scrollHeight) + "px";
}