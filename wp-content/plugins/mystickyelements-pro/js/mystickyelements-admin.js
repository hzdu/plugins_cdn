( function( $ ) {
	"use strict";
	$(document).ready(function(){
		/* Apply Wp Color Picker */
		var myOptions = {
			change: function(event, ui){
				var color_id = $(this).attr('id');
				var slug = $(this).data('slug');
				var soical_icon = $(this).data('soical-icon');

				var color_code = ui.color.toString();
				if ( color_id === 'submit_button_background_color'){
					//$('#contact-form-submit-button').css('background-color', color_code );
				}
				if ( color_id === 'submit_button_text_color'){
					//$('#contact-form-submit-button').css('color', color_code );
				}

				if ( color_id === 'tab_background_color'){
					$('.mystickyelements-contact-form .mystickyelements-social-icon').css('background-color', color_code );
				}
				if ( color_id === 'tab_text_color'){
					$('.mystickyelements-contact-form .mystickyelements-social-icon').css('color', color_code );
				}

				if ( color_id === 'minimize_tab_background_color'){
					$('span.mystickyelements-minimize').css('background-color', color_code );
				}

				if ( typeof slug !== 'undefined' ){
					$('.mystickyelements-social-icon.social-' + slug ).css('background', color_code );
					//$('.social-channels-item .social-channel-input-box-section .social-' + slug ).css('background', color_code );
					social_icon_live_preview_color_css();
				}

				if ( typeof soical_icon !== 'undefined' ){
					if ( soical_icon == 'line' ) {
						$('.mystickyelements-social-icon.social-' + soical_icon + ' svg .fil1' ).css('fill', color_code );
						//$('.social-channels-item .social-channel-input-box-section .social-' + soical_icon + ' svg .fil1' ).css('fill', color_code );
					} else if (  soical_icon == 'qzone' ) {
						$('.mystickyelements-social-icon.social-' + soical_icon + ' svg .fil2' ).css('fill', color_code );
						//$('.social-channels-item .social-channel-input-box-section .social-' + soical_icon + ' svg .fil2').css('fill', color_code );
					} else {
						$('.mystickyelements-social-icon.social-' + soical_icon + ' i' ).css('color', color_code );
						//$('.social-channels-item .social-channel-input-box-section .social-' + soical_icon ).css('color', color_code );
					}
				}
			}
	    };
		$('.mystickyelement-color').wpColorPicker(myOptions);

		if ( $( 'input#redirect_after_submission' ).prop("checked") == true ) {
			$('.myStickyelements-redirect-new-tab').show();
		}

		$( 'input#redirect_after_submission' ).on( 'click', function(){
			if( $(this).prop("checked") == true ){
				$('.myStickyelements-redirect-new-tab').show();
			} else {
				$('.myStickyelements-redirect-new-tab').hide();
			}
		});

		if ( $( "#contact-form-send-leads option:selected" ).val() === 'mail' || $( 'input#send_leads_mail' ).prop("checked") == true ) {
			$('#contact-form-send-mail').show();
			$('#contact-form-sendr-name').show();
			$('#contact-form-mail-subject-line').show();
		}

		$( 'input#send_leads_mail' ).on( 'click', function(){
			if( $(this).prop("checked") == true ){
				$('#contact-form-send-mail').show();
				$('#contact-form-sendr-name').show();
				$('#contact-form-mail-subject-line').show();
			} else {
				$('#contact-form-send-mail').hide();
				$('#contact-form-sendr-name').hide();
				$('#contact-form-mail-subject-line').hide();
			}
		});
		$('#contact-form-send-leads').on( 'change', function() {
			if ( $(this).val() === 'mail' ) {
				$('#contact-form-send-mail').show();
				$('#contact-form-mail-subject-line').show();
			} else {
				$('#contact-form-send-mail').hide();
				$('#contact-form-mail-subject-line').hide();
			}
		});

		if (  $( 'input#consent_checkbox' ).prop("checked") == true ) {
			$('#contact-form-consent_checkbox').show();
		}

		$( 'input#consent_checkbox' ).on( 'click', function(){
			if( $(this).prop("checked") == true ){
				$('#contact-form-consent_checkbox').show();
			} else {
				$('#contact-form-consent_checkbox').hide();
			}
		});

		$(document).on("change", "input[name='contact-form[direction]']", function(){
			if($(this).val() == "RTL") {
				$(".mystickyelements-fixed").addClass("is-rtl");
			} else {
				$(".mystickyelements-fixed").removeClass("is-rtl");
			}
		});

		$( '#myStickyelements-contact-form-close' ).on( 'click', function() {
			if( $(this).prop("checked") == true ){
				$( '#contact-form-close-after' ).show();
			}else {
				$( '#contact-form-close-after' ).hide();
			}
		});
		$( '#myStickyelements-contact-form-enabled' ).on( 'click', function() {
			if( $(this).prop("checked") == true ){
				
				$(".turn-off-message").css('display','none');
				$(".contact-form-description").css('display','block');
				$( '#myStickyelements-preview-contact' ).show();
				//$( '.myStickyelements-preview-ul' ).removeClass( 'remove-contact-field' );
				$( '.mystickyelements-contact-form' ).removeClass( 'mystickyelements-contact-form-hide' );
			}else {
				// $( '#myStickyelements-preview-contact' ).hide();
				// //$( '.myStickyelements-preview-ul' ).addClass( 'remove-contact-field' );
				// $( '.mystickyelements-contact-form' ).addClass( 'mystickyelements-contact-form-hide' );
				// $(".turn-off-message").css('display','block');
				// $(".contact-form-description").css('display','none');

				$('#contactform-status-popup').show();
				$('#mystickyelement-contact-popup-overlay').show();
				$('.mystickyelements-disable-content-wrap').hide();
			}
			myStickyelements_mobile_count();
			mystickyelements_disable_section( 'mystickyelements-tab-contact-form', 'myStickyelements-contact-form-enabled' );
		});

		$('.button-contact-popup-disable').on('click',function(){
			$( '#myStickyelements-preview-contact' ).hide();
			$( '.mystickyelements-contact-form' ).addClass( 'mystickyelements-contact-form-hide' );
			$(".turn-off-message").css('display','block');
			$(".contact-form-description").css('display','none');
			$('#contactform-status-popup').hide();
			$('#mystickyelement-contact-popup-overlay').hide();
		});

		$(document).on('click','.button-contact-popup-keep',function(){
			var popup_from = 'contact-form';
			$(".turn-off-message").css('display','none');
			$(".contact-form-description").css('display','block');
			$( '#myStickyelements-preview-contact' ).show();
			//$( '.myStickyelements-preview-ul' ).removeClass( 'remove-contact-field' );
			$( '.mystickyelements-contact-form' ).removeClass( 'mystickyelements-contact-form-hide' );
			$('#contactform-status-popup').hide();	
			$('#mystickyelement-contact-popup-overlay').hide();

			$('#myStickyelements-contact-form-enabled').prop('checked',true);
			var parent_class = 'mystickyelements-tab-contact-form';
			$( '#' + parent_class + ' .mystickyelements-disable-wrap' ).removeClass( 'mystickyelements-disable' );
			$( '#' + parent_class + ' .mystickyelements-disable-wrap .myStickyelements-social-channels-info' ).show();
			$( '#' + parent_class + ' .mystickyelements-disable-content-wrap' ).hide();
		});

		$('#mystickyelement-contact-popup-overlay').on('click',function(){
			console.log('clicklllll');
			$(".turn-off-message").css('display','none');
			$(".contact-form-description").css('display','block');
			$( '#myStickyelements-preview-contact' ).show();
			$( '.mystickyelements-contact-form' ).removeClass( 'mystickyelements-contact-form-hide' );
			$('#contactform-status-popup').hide();	
			$('#mystickyelement-contact-popup-overlay').hide();

			$('#myStickyelements-contact-form-enabled').prop('checked',true);
			var parent_class = 'mystickyelements-tab-contact-form';
			$( '#' + parent_class + ' .mystickyelements-disable-wrap' ).removeClass( 'mystickyelements-disable' );
			$( '#' + parent_class + ' .mystickyelements-disable-wrap .myStickyelements-social-channels-info' ).show();
			$( '#' + parent_class + ' .mystickyelements-disable-content-wrap' ).hide();
		});

		/* Social Chanel Privew */
		$(document).on( "click", ".social-channel-view-desktop"  , function(e){
			var social_channel_tab_desktop = $(this).data( 'social-channel-view' );
			if($(this).prop("checked") == false ){
				$('ul.myStickyelements-preview-ul li.mystickyelements-social-' + social_channel_tab_desktop).removeClass('element-desktop-on');
			} else {
				$('ul.myStickyelements-preview-ul li.mystickyelements-social-' + social_channel_tab_desktop).addClass('element-desktop-on');
			}
			mystickyelements_border_radius();
		});
		$(document).on( "click", ".social-channel-view-mobile"  , function(e){
			var social_channel_tab_mobile = $(this).data( 'social-channel-view' );
			if($(this).prop("checked") == false ){
				$('ul.myStickyelements-preview-ul li.mystickyelements-social-' + social_channel_tab_mobile).removeClass('element-mobile-on');
			} else {
				$('ul.myStickyelements-preview-ul li.mystickyelements-social-' + social_channel_tab_mobile).addClass('element-mobile-on');
			}
			mystickyelements_border_radius();
		});

		/* Append Social Channels tab */
		$(".social-channel").on( "click", function(){
			var social_channel = $(this).data( 'social-channel' );

			/* Remove Social Channel */
			if($(this).prop("checked") == false){
				$('.social-channels-item[data-slug=' + social_channel +']').remove();
				$('.social-channel[data-social-channel=' + social_channel + ' ]').prop("checked", false);
				mysticky_social_channel_order();

				/* remove from preview */
				$('ul.myStickyelements-preview-ul li.mystickyelements-social-' + social_channel).remove();
				social_icon_live_preview_color_css();
				mystickyelements_border_radius();
            }

			/* When user add more than 2 then return and display upgrade now message. */
			if( $(".social-channel-popover").length ) {				
				var len = $(".myStickyelements-social-channels-lists input[name^='social-channels']:checked").length;
				if ( $('.social-channels-item').length >= 2 || len > 2 ) {
					$('.social-channel[data-social-channel=' + social_channel + ' ]').prop("checked", false);
					$('.social-channel-popover').show().effect('shake', {times: 4}, 1200);
					$('body,html').animate({ scrollTop:  $(".social-channel-popover").offset().top - 200 }, 800);
					return;
				}
			}

			/* Add  Social Channel */
			if( $(this).prop("checked") == true ){
                jQuery.ajax({
					url: ajaxurl,
					type:'post',
					data: 'action=mystickyelement-social-tab&social_channel=' + social_channel +'&is_ajax=true&wpnonce=' + mystickyelements.ajax_nonce,
					success: function( data ){
						$('.social-channels-tab').append(data);
						$('.mystickyelement-color').wpColorPicker(myOptions);
						mysticky_social_channel_order();
						mystickyelements_border_radius();
						social_icon_live_preview_color_css();
						//$('#mystickyelements-preview-description').show();
						$('.social-channel-fontawesome-icon').select2({
													allowClear: true,
													templateSelection: stickyelement_iconformat,
													templateResult: stickyelement_iconformat,
													allowHtml: true
												});
					},
				});

            }
		});

		/* Social Channel Delete */
		$(document).on( "click", '.social-channel-close' , function(e){
			var chanel_name = $(this).data('slug');
			$('.social-channels-item[data-slug=' + chanel_name +']').remove();
			$('.social-channel[data-social-channel=' + chanel_name + ' ]').prop("checked", false);
			mysticky_social_channel_order();
			mystickyelements_border_radius();

			/* remove from preview */
			$('ul.myStickyelements-preview-ul li.mystickyelements-social-' + chanel_name).remove();
			social_icon_live_preview_color_css();
		});

		jQuery('.social-channels-tab').sortable({
			items:'.social-channels-item',
			placeholder: "mystickyelements-state-highlight social-channels-item",
			handle: ".mystickyelements-move-handle",
			cursor:'move',
			scrollSensitivity:40,
			stop:function(event,ui){
				mysticky_social_channel_order();
				mystickyelements_border_radius();
			}
		});
		$(document).on( "click", '.myStickyelements-channel-view .social-setting' , function(e){
			console.log('click');
			var chanel_name = $(this).data('slug');
			console.log("chanel_name==>"+chanel_name);
			$('.social-channels-item[data-slug=' + chanel_name +'] .social-channel-setting').slideToggle();
		});


		/* Media Upload */
		$(document).on( "click", '.social-custom-icon-upload-button' , function(e){
			e.preventDefault();
			var social_channel = $(this).data('slug');
			var image = wp.media({
					title: 'Upload Image',
						// mutiple: true if you want to upload multiple files at once
						multiple: false
					}).open()
				.on('select', function(e){
					// This will return the selected image from the Media Uploader, the result is an object
					var uploaded_image = image.state().get('selection').first();
					// We convert uploaded_image to a JSON object to make accessing it easier
					// Output to the console uploaded_image
					var image_url = uploaded_image.toJSON().url;
					$('#social-channel-' + social_channel + '-custom-icon').val(image_url);
					$('#social-channel-' + social_channel + '-icon').show();
					$('#social-channel-' + social_channel + '-icon').parent().addClass( 'myStickyelements-custom-image-select' );
					$('#social-channel-' + social_channel + '-custom-icon-img').attr( 'src', image_url);
					var $social_icon_text = $('#social-' + social_channel + '-icon_text').val();
					var $social_icon_text_size = $('#social-' + social_channel + '-icon_text_size').val();
					var social_tooltip_text = social_channel.replace( '_', ' ' );
					if( $social_icon_text != '' ) {
						var $social_icon_text_size_style = 'display: block;font-size: '+ $social_icon_text_size + 'px;';
					} else {
						var $social_icon_text_size_style = 'display: none;font-size: '+ $social_icon_text_size + 'px;';
					}
					if( $( 'input[name="social-channels-tab[' + social_channel + '][stretch_custom_icon]"]' ).prop("checked") == true ) {
						var stretch_custom_class = 'mystickyelements-stretch-custom-img';
					} else {
						var stretch_custom_class = '';
					}
					$('#mystickyelements-' + social_channel + '-custom-icon').prop("selectedIndex", 0).trigger('change');
					$('ul.myStickyelements-preview-ul li span.social-' + social_channel + ' i').hide();
					$('ul.myStickyelements-preview-ul li span.social-' + social_channel + ' img').remove();
					$('ul.myStickyelements-preview-ul li span.social-' + social_channel + ' .mystickyelements-icon-below-text').remove();
					$('ul.myStickyelements-preview-ul li span.social-' + social_channel).append( '<img class="' + stretch_custom_class + '" src="' + image_url + '" width="40" height="40"/><span class="mystickyelements-icon-below-text" style="'+ $social_icon_text_size_style +'">'+ $social_icon_text +'</span>' );

					$('.social-channels-item .social-channel-input-box-section .social-' + social_channel + ' i').hide();
					$('.social-channels-item .social-channel-input-box-section .social-' + social_channel ).append('<img src="' + image_url + '" width="25" height="25"/>');
					if( $( 'input[name="social-channels-tab[' + social_channel + '][stretch_custom_icon]"]' ).prop("checked") == true ) {
						$( '.social-' + social_channel + ' img' ).addClass('mystickyelements-stretch-custom-img');
					} else {
						$( '.social-' + social_channel + ' img' ).removeClass('mystickyelements-stretch-custom-img');
					}
			});
		});
		$(document).on( "click", '.social-channel-icon-close' , function(e){
			var chanel_name = $(this).data('slug');
			$('#social-channel-' + chanel_name + '-custom-icon').val('');
			$('#social-channel-' + chanel_name + '-icon').hide();
			$('#social-channel-' + chanel_name + '-icon').parent().removeClass( 'myStickyelements-custom-image-select' );
			$('#social-channel-' + chanel_name + '-custom-icon-img').attr( 'src', '');
			$('ul.myStickyelements-preview-ul li span.social-' + chanel_name + ' i').show();
			$('ul.myStickyelements-preview-ul li span.social-' + chanel_name + ' img').remove();
			$('.social-channels-item .social-channel-input-box-section .social-' + chanel_name ).append( '<i class="fas fa-cloud-upload-alt"></i>' );
			$('ul.myStickyelements-preview-ul li span.social-' + chanel_name ).append( '<i class="fas fa-cloud-upload-alt"></i>' );
			$('.social-channels-item .social-channel-input-box-section .social-' + chanel_name + ' i').show();
			$('.social-channels-item .social-channel-input-box-section .social-' + chanel_name + ' img').remove();
		});

		$(document).on( "click", '.myStickyelements-stretch-icon-wrap input[type="checkbox"]' , function(e){
			var chanel_name = $(this).data('slug');
			$( '.social-' + chanel_name + ' img' ).toggleClass('mystickyelements-stretch-custom-img');
		});

		$('.social-channel-icon').each( function(){
			if ( $(this).children('img').attr('src') !='' ){
				$(this).show();
				$(this).parent().addClass( 'myStickyelements-custom-image-select' );
			}
		});

		/*  Delete Contact Lead*/
		jQuery(".mystickyelement-delete-entry").on( 'click', function(){
			var deleterowid = $( this ).attr( "data-delete" );
			var confirm_delete = window.confirm("Are you sure you want to delete Record with ID# "+deleterowid);
			if (confirm_delete == true) {
				jQuery.ajax({
					type: 'POST',
					url: ajaxurl,
					data: {"action": "mystickyelement_delete_db_record","ID": deleterowid, delete_nonce: jQuery("#delete_nonce").val(),"wpnonce": mystickyelements.ajax_nonce},
					success: function(data){
						location.href = window.location.href;
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						alert("Status: " + textStatus); alert("Error: " + errorThrown);
					}
				});
			}
			return false;
		});

		jQuery("#mystickyelement_delete_all_leads").on( 'click', function(){
			var confirm_delete = window.confirm("Are you sure you want to delete all Record from the database?");
			if (confirm_delete == true) {
				jQuery.ajax({
					type: 'POST',
					url: ajaxurl,
					data: {"action": "mystickyelement_delete_db_record", 'all_leads': 1 , delete_nonce: jQuery("#delete_nonce").val(),"wpnonce": mystickyelements.ajax_nonce},
					success: function(data){
						location.href = window.location.href;
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						alert("Status: " + textStatus); alert("Error: " + errorThrown);
					}
				});
			}
			// Prevents default submission of the form after clicking on the submit button.
			return false;
		});

		/* Desktop Position */
		jQuery("input[name='general-settings[position]'").on( 'click', function(){
			if ( $(this).val() === 'left'){
				$('.myStickyelements-preview-screen .mystickyelements-fixed').addClass('mystickyelements-position-left');
				$('.myStickyelements-preview-screen .mystickyelements-fixed').removeClass('mystickyelements-position-bottom');
				$('.myStickyelements-preview-screen .mystickyelements-fixed').removeClass('mystickyelements-position-right');

				$('span.mystickyelements-minimize').removeClass('minimize-position-right');
				$('span.mystickyelements-minimize').removeClass('minimize-position-bottom');
				$('span.mystickyelements-minimize').addClass('minimize-position-left');
				$( '.mystickyelements-minimize.minimize-position-left' ).html('&larr;');

				$( '.myStickyelements-position-on-screen-wrap' ).hide();
				$( '.myStickyelements-position-desktop-wrap' ).show();
			}
			if ( $(this).val() === 'right'){
				$('.myStickyelements-preview-screen .mystickyelements-fixed').removeClass('mystickyelements-position-left');
				$('.myStickyelements-preview-screen .mystickyelements-fixed').removeClass('mystickyelements-position-bottom');
				$('.myStickyelements-preview-screen .mystickyelements-fixed').addClass('mystickyelements-position-right');

				$('span.mystickyelements-minimize').removeClass('minimize-position-left');
				$('span.mystickyelements-minimize').removeClass('minimize-position-bottom');
				$('span.mystickyelements-minimize').addClass('minimize-position-right');
				$( '.mystickyelements-minimize.minimize-position-right' ).html('&rarr;');

				$( '.myStickyelements-position-on-screen-wrap' ).hide();
				$( '.myStickyelements-position-desktop-wrap' ).show();
			}
			if ( $(this).val() === 'bottom'){
				$('.myStickyelements-preview-screen .mystickyelements-fixed').removeClass('mystickyelements-position-left');
				$('.myStickyelements-preview-screen .mystickyelements-fixed').removeClass('mystickyelements-position-right');
				$('.myStickyelements-preview-screen .mystickyelements-fixed').addClass('mystickyelements-position-bottom');

				$('span.mystickyelements-minimize').removeClass('minimize-position-left');
				$('span.mystickyelements-minimize').removeClass('minimize-position-right');
				$('span.mystickyelements-minimize').addClass('minimize-position-bottom');
				$( '.mystickyelements-minimize.minimize-position-bottom' ).html('&darr;');

				$( '.myStickyelements-position-on-screen-wrap' ).show();

				$( '.myStickyelements-position-desktop-wrap' ).hide();
			}
			mystickyelements_border_radius();
		});

		/* Mobile Position */
		jQuery("input[name='general-settings[position_mobile]'").on( 'click', function(){

			//console.log("mobile position:==>"+$(this).val());
			
			if ( $(this).val() === 'left' || $(this).val() === 'right'){
				jQuery( '.myStickyelements-position-mobile-wrap' ).show();
			}
			if ( $(this).val() === 'bottom' || $(this).val() === 'top'){
				jQuery( '.myStickyelements-position-mobile-wrap' ).hide();
			}
			if( $( '.myStickyelements-preview-screen' ).hasClass( 'myStickyelements-preview-mobile-screen' ) == true ) {
				if ( $(this).val() === 'left'){
					$('.myStickyelements-preview-screen .mystickyelements-fixed').addClass('mystickyelements-position-mobile-left');
					$('.myStickyelements-preview-screen .mystickyelements-fixed').removeClass('mystickyelements-position-mobile-right');
					$('.myStickyelements-preview-screen .mystickyelements-fixed').removeClass('mystickyelements-position-mobile-bottom');
					$('.myStickyelements-preview-screen .mystickyelements-fixed').removeClass('mystickyelements-position-mobile-top');

					$('span.mystickyelements-minimize').removeClass('minimize-position-mobile-right');
					$('span.mystickyelements-minimize').removeClass('minimize-position-mobile-bottom');
					$('span.mystickyelements-minimize').removeClass('minimize-position-mobile-top');
					$('span.mystickyelements-minimize').addClass('minimize-position-mobile-left');

					jQuery( '#myStickyelements_mobile_templete_desc' ).hide();

				}
				if ( $(this).val() === 'right'){
					$('.myStickyelements-preview-screen .mystickyelements-fixed').removeClass('mystickyelements-position-mobile-left');
					$('.myStickyelements-preview-screen .mystickyelements-fixed').addClass('mystickyelements-position-mobile-right');
					$('.myStickyelements-preview-screen .mystickyelements-fixed').removeClass('mystickyelements-position-mobile-bottom');
					$('.myStickyelements-preview-screen .mystickyelements-fixed').removeClass('mystickyelements-position-mobile-top');

					$('span.mystickyelements-minimize').removeClass('minimize-position-mobile-left');
					$('span.mystickyelements-minimize').removeClass('minimize-position-mobile-bottom');
					$('span.mystickyelements-minimize').removeClass('minimize-position-mobile-top');
					$('span.mystickyelements-minimize').addClass('minimize-position-mobile-right');

					jQuery( '#myStickyelements_mobile_templete_desc' ).hide();
				}
				if ( $(this).val() === 'bottom'){
					$('.myStickyelements-preview-screen .mystickyelements-fixed').removeClass('mystickyelements-position-mobile-left');
					$('.myStickyelements-preview-screen .mystickyelements-fixed').removeClass('mystickyelements-position-mobile-right');
					$('.myStickyelements-preview-screen .mystickyelements-fixed').removeClass('mystickyelements-position-mobile-top');
					$('.myStickyelements-preview-screen .mystickyelements-fixed').addClass('mystickyelements-position-mobile-bottom');

					$('span.mystickyelements-minimize').removeClass('minimize-position-mobile-left');
					$('span.mystickyelements-minimize').removeClass('minimize-position-mobile-right');
					$('span.mystickyelements-minimize').removeClass('minimize-position-mobile-top');
					$('span.mystickyelements-minimize').addClass('minimize-position-mobile-bottom');

					if (jQuery('#myStickyelements-inputs-templete option:selected').val() != 'default') {
						jQuery( '#myStickyelements_mobile_templete_desc' ).show();
						$('#myStickyelements_mobile_templete_desc').fadeOut(500);
						$('#myStickyelements_mobile_templete_desc').fadeIn(500);
					} else {
						jQuery( '#myStickyelements_mobile_templete_desc' ).hide();
					}
				}
				if ( $(this).val() === 'top'){
					$('.myStickyelements-preview-screen .mystickyelements-fixed').removeClass('mystickyelements-position-mobile-left');
					$('.myStickyelements-preview-screen .mystickyelements-fixed').removeClass('mystickyelements-position-mobile-right');
					$('.myStickyelements-preview-screen .mystickyelements-fixed').removeClass('mystickyelements-position-mobile-bottom');
					$('.myStickyelements-preview-screen .mystickyelements-fixed').addClass('mystickyelements-position-mobile-top');

					$('span.mystickyelements-minimize').removeClass('minimize-position-mobile-left');
					$('span.mystickyelements-minimize').removeClass('minimize-position-mobile-right');
					$('span.mystickyelements-minimize').removeClass('minimize-position-mobile-bottom');
					$('span.mystickyelements-minimize').addClass('minimize-position-mobile-top');

					if (jQuery('#myStickyelements-inputs-templete option:selected').val() != 'default') {
						jQuery( '#myStickyelements_mobile_templete_desc' ).show();
						$('#myStickyelements_mobile_templete_desc').fadeOut(500);
						$('#myStickyelements_mobile_templete_desc').fadeIn(500);
					} else {
						jQuery( '#myStickyelements_mobile_templete_desc' ).hide();
					}
				}
			}
			mystickyelements_border_radius();
		});
		/*Icon text live preivew*/
		$(document).on( "keyup", '.myStickyelements-icon-text-input' , function(e){
			var myStickyelements_icon_text = $( this ).val();
			var myStickyelements_icon_social = $( this ).data( 'icontext' );
			if( jQuery("#myStickyelements-inputs-templete").val() == 'default' ) {
				$( '.social-' + myStickyelements_icon_social + ' .mystickyelements-icon-below-text' ).show();
			}
			$( '.social-' + myStickyelements_icon_social + ' .mystickyelements-icon-below-text' ).text( myStickyelements_icon_text );
			if( myStickyelements_icon_text == '' ) {
				$( '.social-' + myStickyelements_icon_social + ' .mystickyelements-icon-below-text' ).hide();
			}

		} );
		/*Icon text size live preivew*/
		$(document).on( "keyup", '.myStickyelements-icon-text-size' , function(e){
			var myStickyelements_icon_text_size = $( this ).val();
			var myStickyelements_icon_social = $( this ).data( 'icontextsize' );
			$( '.social-' + myStickyelements_icon_social + ' .mystickyelements-icon-below-text' ).css( 'font-size', myStickyelements_icon_text_size + 'px' );
			if( myStickyelements_icon_text_size == 0 ) {
				$( '.social-' + myStickyelements_icon_social + ' .mystickyelements-icon-below-text' ).css( 'font-size', '' );
			}
		} );
		/*Contact text live preivew*/
		$(document).on( "keyup", '[name="contact-form[text_in_tab]"]' , function(e){
			var myStickyelements_text_in_tab = $( this ).val();
			$( '.mystickyelements-contact-form .mystickyelements-social-icon' ).html( '<i class="far fa-envelope"></i> ' + myStickyelements_text_in_tab );
		} );

		jQuery(".myStickyelements-preview-window ul li").on( 'click', function(){

			$('.myStickyelements-preview-window ul li').removeClass('preview-active');
			if ( $(this).hasClass('preview-desktop') === true ) {
				$(this).addClass('preview-active');
				$('.myStickyelements-preview-screen').removeClass('myStickyelements-preview-mobile-screen');

				$('.myStickyelements-preview-screen .mystickyelements-fixed').removeClass('mystickyelements-position-mobile-left');
				$('.myStickyelements-preview-screen .mystickyelements-fixed').removeClass('mystickyelements-position-mobile-right');
				$('.myStickyelements-preview-screen .mystickyelements-fixed').removeClass('mystickyelements-position-mobile-bottom');
				$('.myStickyelements-preview-screen .mystickyelements-fixed').removeClass('mystickyelements-position-mobile-top');

				jQuery( '#myStickyelements_mobile_templete_desc' ).hide();

				if ( jQuery( 'input[name="contact-form[desktop]"]' ).prop( 'checked' ) == true ) {
					jQuery( '#myStickyelements-preview-contact' ).addClass( 'element-desktop-on' );
				} else {
					jQuery( '#myStickyelements-preview-contact' ).removeClass( 'element-desktop-on' );
				}
			}
			if ( $(this).hasClass('preview-mobile') === true ) {
				$(this).addClass('preview-active');
				$('.myStickyelements-preview-screen').addClass('myStickyelements-preview-mobile-screen');
				$("input[name='general-settings[position_mobile]']:checked").val()
				if ( $("input[name='general-settings[position_mobile]']:checked").val() === 'left'){
					$('.myStickyelements-preview-screen .mystickyelements-fixed').addClass('mystickyelements-position-mobile-left');
					$('.myStickyelements-preview-screen .mystickyelements-fixed').removeClass('mystickyelements-position-mobile-right');
					$('.myStickyelements-preview-screen .mystickyelements-fixed').removeClass('mystickyelements-position-mobile-bottom');
					$('.myStickyelements-preview-screen .mystickyelements-fixed').removeClass('mystickyelements-position-mobile-top');
				}
				if ( $("input[name='general-settings[position_mobile]']:checked").val() === 'right'){
					$('.myStickyelements-preview-screen .mystickyelements-fixed').removeClass('mystickyelements-position-mobile-left');
					$('.myStickyelements-preview-screen .mystickyelements-fixed').addClass('mystickyelements-position-mobile-right');
					$('.myStickyelements-preview-screen .mystickyelements-fixed').removeClass('mystickyelements-position-mobile-bottom');
					$('.myStickyelements-preview-screen .mystickyelements-fixed').removeClass('mystickyelements-position-mobile-top');
				}
				if ( $("input[name='general-settings[position_mobile]']:checked").val() === 'bottom'){
					$('.myStickyelements-preview-screen .mystickyelements-fixed').removeClass('mystickyelements-position-mobile-left');
					$('.myStickyelements-preview-screen .mystickyelements-fixed').removeClass('mystickyelements-position-mobile-right');
					$('.myStickyelements-preview-screen .mystickyelements-fixed').removeClass('mystickyelements-position-mobile-top');
					$('.myStickyelements-preview-screen .mystickyelements-fixed').addClass('mystickyelements-position-mobile-bottom');
				}
				if ( $("input[name='general-settings[position_mobile]']:checked").val() === 'top'){
					$('.myStickyelements-preview-screen .mystickyelements-fixed').removeClass('mystickyelements-position-mobile-left');
					$('.myStickyelements-preview-screen .mystickyelements-fixed').removeClass('mystickyelements-position-mobile-right');
					$('.myStickyelements-preview-screen .mystickyelements-fixed').removeClass('mystickyelements-position-mobile-bottom');
					$('.myStickyelements-preview-screen .mystickyelements-fixed').addClass('mystickyelements-position-mobile-top');
				}

				if ( jQuery( "#myStickyelements-inputs-templete option:selected" ).val() != 'default' && ( jQuery('input[name="general-settings[position_mobile]"]:checked').val() == 'bottom' || jQuery('input[name="general-settings[position_mobile]"]:checked').val() == 'top' ) ) {
					jQuery( '#myStickyelements_mobile_templete_desc' ).show();
					$('#myStickyelements_mobile_templete_desc').fadeOut(500);
					$('#myStickyelements_mobile_templete_desc').fadeIn(500);
				} else {
					jQuery( '#myStickyelements_mobile_templete_desc' ).hide();
				}

				if ( jQuery( 'input[name="contact-form[mobile]"]' ).prop( 'checked' ) == true && $( '#myStickyelements-contact-form-enabled' ).prop("checked") == true ) {
					jQuery( '#myStickyelements-preview-contact' ).addClass( 'element-mobile-on' );
				} else {
					jQuery( '#myStickyelements-preview-contact' ).removeClass( 'element-desktop-on' );
					jQuery( '#myStickyelements-preview-contact' ).removeClass( 'element-mobile-on' );
				}
			}
			mystickyelements_border_radius();
		});

		function mysticky_social_channel_order(){
			var social_count = 1;
			$('.social-channels-item').each( function(){
				/* remove from preview */
				$('ul.myStickyelements-preview-ul li.mystickyelements-social-' + $(this).data('slug')).remove();
			});

			$('.social-channels-item').each( function(){
				var social_channel = $(this).data('slug');
				social_count = ("0" + social_count).slice(-2);
				$('#social-' + social_channel  + '-number').html(social_count);
				social_count++;

				var $social_icon = $('.social-channel-input-box-section .social-'+social_channel).html();
				var $social_custom_icon = $('.social-channel-setting #social-channel-'+ social_channel + '-icon img').attr( 'src');

				var $social_custom_fontawe_icon = $('#mystickyelements-'+ social_channel + '-custom-icon').val();
				if ( typeof $social_custom_icon !== 'undefined' && $social_custom_fontawe_icon !== '') {
					$social_icon = '<i class="' + $social_custom_fontawe_icon + '"></i>';
				}else if ( typeof $social_custom_icon !== 'undefined' && $social_custom_icon !== '' ) {
					$social_icon = '<img src="' + $social_custom_icon + '"/>';
				}

				var $social_bg_color = $('#social-' + social_channel + '-bg_color').val();
				var $social_icon_color = $('#social-' + social_channel + '-icon_color').val();
				var $social_icon_text = $('#social-' + social_channel + '-icon_text').val();
				var $social_icon_text_size = $('#social-' + social_channel + '-icon_text_size').val();
				if( $social_icon_text != '' ) {
					var $social_icon_text_size_style = 'display: block;font-size: '+ $social_icon_text_size + 'px;';
				} else {
					var $social_icon_text_size_style = 'display: none;font-size: '+ $social_icon_text_size + 'px;';
				}

				if( $('#social_channel_' + social_channel + '_desktop').prop("checked") == true ){
					var social_channel_desktop_visible = ' element-desktop-on';
				}
				else {
					var social_channel_desktop_visible = '';
				}

				if( $('#social_channel_' + social_channel + '_mobile').prop("checked") == true ){
					var social_channel_mobile_visible = ' element-mobile-on';
				}
				else {
					var social_channel_mobile_visible = '';
				}

				var social_channel_data = '<li id="mystickyelements-social-' + social_channel + '" class="mystickyelements-social-' + social_channel + '' + social_channel_desktop_visible + '' + social_channel_mobile_visible + ' mystickyelements-social-preview "><span class="mystickyelements-social-icon social-' + social_channel + '" style="background: ' +$social_bg_color + '; color: '+ $social_icon_color + '">' + $social_icon + '<span class="mystickyelements-icon-below-text" style="'+ $social_icon_text_size_style +'">'+ $social_icon_text +'</span></span>';

				if ( social_channel == 'line') {
					social_channel_data += '<style>.mystickyelements-social-icon.social-'+ social_channel +' svg .fil1{fill: '+ $social_icon_color+'}</style>';
				}
				if ( social_channel == 'qzone') {
					social_channel_data += '<style>.mystickyelements-social-icon.social-'+ social_channel +' svg .fil2{fill: '+ $social_icon_color+'}</style>';
				}
				social_channel_data +='</li>';

				$('ul.myStickyelements-preview-ul').append(social_channel_data);
			});

			setTimeout(function(){
				myStickyelements_mobile_count();
			}, 500);
		}
		myStickyelements_mobile_count();
		function myStickyelements_mobile_count () {
			if( $( 'input[name="contact-form[desktop]"]' ).prop("checked") == true && $( '#myStickyelements-contact-form-enabled' ).prop("checked") == true ){
				jQuery( '#myStickyelements-preview-contact' ).addClass( 'element-desktop-on' );
			} else {
				jQuery( '#myStickyelements-preview-contact' ).removeClass( 'element-desktop-on' );
				jQuery( '#myStickyelements-preview-contact' ).removeClass( 'element-desktop-on' );
			}
			if( $( 'input[name="contact-form[mobile]"]' ).prop("checked") == true && $( '#myStickyelements-contact-form-enabled' ).prop("checked") == true ){
				jQuery( '#myStickyelements-preview-contact' ).addClass( 'element-mobile-on' );
			} else {
				jQuery( '#myStickyelements-preview-contact' ).removeClass( 'element-mobile-on' );
			}

			var mobile_bottom = 0;
			var $j = 0;
			if( $(this).hasClass('element-mobile-on') && $j != 4 ) {
				$(this).addClass('mystickyelements-show-last-element');
				$j++;
			} else {
				$(this).removeClass('mystickyelements-show-last-element');
			}
			$('.mystickyelements-fixed ul li').each( function () {
				if ( $(this).hasClass('element-mobile-on') ){
					mobile_bottom++;
				}
			});
			$(".myStickyelements-preview-tab .mystickyelements-fixed").removeClass (function (index, className) {
				return (className.match (/(^|\s)mystickyelements-bottom-social-channel-\S+/g) || []).join(' ');
			});
			$(".myStickyelements-preview-tab .mystickyelements-fixed").removeClass (function (index, className) {
				return (className.match (/(^|\s)mystickyelements-top-social-channel-\S+/g) || []).join(' ');
			});
			$( '.myStickyelements-preview-tab .mystickyelements-fixed' ).addClass( 'mystickyelements-bottom-social-channel-' + mobile_bottom );
			$( '.myStickyelements-preview-tab .mystickyelements-fixed' ).addClass( 'mystickyelements-top-social-channel-' + mobile_bottom );
		}

		/* Sortable Contact Form Fields */
		jQuery( '#mystickyelements-contact-form-fields' ).sortable({
			items:'.mystickyelements-option-field',
			handle: ".mystickyelements-move-handle",
			cursor:'move',
			scrollSensitivity:40,
			placeholder: "mystickyelements-state-highlight",
			helper:function(e,ui){
				ui.children().each(function(){
					jQuery(this).width(jQuery(this).width());
				});
				ui.css('left', '0');
				return ui;
			},
			start:function(event,ui){
				ui.item.css('background-color','#f9fcfc');
			},
			stop:function(event,ui){
				ui.item.removeAttr('style');
			}
		});

		$( "#mystickyelements-contact-form-fields" ).disableSelection();


		/* Open Contact form Dropdown Option popup */
		$( '.contact-form-dropdown-popup' ).on( 'click', function () {
			
			//$( '.contact-form-dropdown-open' ).show();
			$( '.contact-form-dropdown-open' ).css('display','block');
			$( 'body' ).addClass( 'contact-form-popup-open' );
		});
		$( '.contact-form-dropdown-open .contact-form-dropdfown-close' ).on( 'click', function () {
			$( '.contact-form-dropdown-open' ).hide();
			$( 'body' ).removeClass( 'contact-form-popup-open' );
		});

		$( document ).on( 'mouseup', function( event ) {
			if ( !$( event.target ).closest( ".myStickyelements-contact-form-field-option .contact-form-field-open,.mystickyelements-add-custom-fields a, .contact-form-field-popup,.contact-form-dropdown-popup, .contact-form-dropdown-open, .myStickyelements-setting-wrap .contact-form-field-open, .contact-form-setting-popup-open" ).length ) {
				$( '.contact-form-field-open' ).hide();
				$( '.contact-form-dropdown-open' ).hide();
				$( 'body' ).removeClass( 'contact-form-popup-open' );
			}				
		});

		/* Add Dropdown Option */
		$( '.add-dropdown-option' ).on( 'click', function () {
			$( this ).parent().parent( '.contact-form-dropdown-option' ).append( '<div class="option-value-field ui-sortable-handle"><div class="move-icon"></div><input type="text" name="contact-form[dropdown-option][]" value=""/><span class="delete-dropdown-option"><i class="fas fa-times"></i></span></div>' );
		});
		/* Delete Dropdown Option */
		$(document).on( "click", '.delete-dropdown-option' , function(e){
			$(this).closest('div').remove();
		});

		/* Open Contact form Field Option popup */
		$(document).on( "click", '.contact-form-field-popup' , function(e){
			$( this ).parent().next( '.contact-form-field-open' ).show();
			$( 'body' ).addClass( 'contact-form-popup-open' );
		});

		$(document).on( "click", '.contact-form-field-open .contact-form-dropdfown-close' , function(e){
			$( '.contact-form-field-open' ).hide();
			$( 'body' ).removeClass( 'contact-form-popup-open' );
		});

		$(document).on( "click", '.myStickyelements-contact-form-field-option .contact-form-field-open .contact-form-dropdfown-close' , function(e){
			$( '.myStickyelements-contact-form-field-option .contact-form-field-open' ).remove();
		});

		$(document).on( "change", '.contact-form-field-select input[type="radio"]' , function(e){
			
			var contact_form_field_select = $( this ).val();
			var contact_form_field_data = $( this ).data( 'field' );
			if( contact_form_field_select != 'iplog' && contact_form_field_select != 'recaptcha' && contact_form_field_select != 'textblock' ){
				
				var append_field = "<div class='mystickyelements-customfields mystickyelements-option-field contact-form-option myStickyelements-icon-wrap mystickyelements-enable_"+contact_form_field_data+"'><span class='mystickyelement-field-hide-content'>Field is hidden.<label for='enable_"+contact_form_field_data+"'><a>Show the field</a></label></span><div class='mystickyelements-move-handle'></div><div class='sticky-col-1'><input type='hidden' class='contact-fields' name='contact-field[][custom_fields][]' value='"+contact_form_field_data+"'><label class='text_label' id='custom_field_label"+contact_form_field_data+"'>Custom Text</label><i class='fas fa-pencil-alt stickyelement-edit'></i><input type='text' name='contact-form[custom_fields]["+contact_form_field_data+"][custom_field_name]' value='Custom Text' class='stickyelement-edit-field'/></div><div class='sticky-col-2'><div class='mystickyelements-reqired-wrap'><input type='text' name='contact-form[custom_fields]["+contact_form_field_data+"][custom_field_value]' value='' placeholder='Enter Text'><input type='hidden' name='contact-form[custom_fields]["+contact_form_field_data+"][field_dropdown]' value='"+contact_form_field_select+"' /></div><div class='mystickyelements-action'><ul><li><label  class='myStickyelements-visible-icon mystickyelements-custom-fields-tooltip'><input type='checkbox' id='enable_"+contact_form_field_data+"' name='contact-form[custom_fields]["+contact_form_field_data+"][custom_field]' value='1' checked='checked'  /><span class='visible-icon'><p class='show-field-tooltip'>Show Field</p><p class='hide-field-tooltip'>Hide Field</p></span></label></li><li><span class='custom-stickyelement-delete'><i class='fas fa-trash-alt stickyelement-delete'></i></span></li><li><label for='"+contact_form_field_data+"_require'>Required</label><label class='myStickyelements-switch'><input type='checkbox' id='"+contact_form_field_data+"_require' class='required' name='contact-form["+contact_form_field_data+"]' value='1'checked='checked'/><span class='slider round'></span></label></li><li><div id='setting_label"+contact_form_field_data+"' class='myStickyelements-setting-label' style='display: none;'><span class='contact-form-field-popup contact-form-popup-setting'><i class='fas fa-cog'></i> Settings</span></div><div id='contact_form_field_open"+contact_form_field_data+"' class='contact-form-field-open contact-form-setting-popup-open' style='display: none;'><div id='contact_form_custom_dropdown"+contact_form_field_data+"' class='contact-form-dropdown-main'><input type='text' name='contact-form[custom_fields]["+contact_form_field_data+"][dropdown-placeholder]' class='contact-form-dropdown-select' value='- Select -' placeholder='Select...'/><div class='contact-form-dropdown-option'><div class='option-value-field'><span class='move-icon'></span><input type='text' name='contact-form[custom_fields]["+contact_form_field_data+"][dropdown-option][]' value=''/><span class='add-customfield-dropdown-option' data-field='"+contact_form_field_data+"'>Add</span></div></div><input type='submit' name='submit' class='button button-primary btn-dropdown-save' value='Save'></div><span class='contact-form-dropdfown-close'><i class='fas fa-times'></i></span></div></li></ul><div class='mystickyelements-hide-field-guide'><p>The field is hidden and won\’t show.</p></div></div></div></div>";
				
				//$( '#mystickyelements-contact-form-fields' ).append( append_field );
				$( append_field ).insertBefore( ".myStickyelements-consent-main-field" );

				if( contact_form_field_select == 'dropdown' ) {
					$( '#setting_label' + contact_form_field_data ).show();
				} else {
					$( '#setting_label' + contact_form_field_data ).hide();
				}
				if( contact_form_field_select != 'textarea' && contact_form_field_select != 'dropdown' && contact_form_field_select != 'textblock' ) {
					if( contact_form_field_select == 'text' ){
						var custom_field_placeholder = 'Enter your message';
					} else if( contact_form_field_select == 'number' ) {
						var custom_field_placeholder = 'Enter a number';
					} else if( contact_form_field_select == 'url' ) {
						var custom_field_placeholder = 'Enter your website';
					} else if( contact_form_field_select == 'date' ) {
						var custom_field_placeholder = 'mm/dd/yyyy';
					}
					var textbox = $( document.createElement('input') ).attr({
						'name': 'contact-form[custom_fields][' + contact_form_field_data + '][custom_field_value]',
						'placeholder': custom_field_placeholder,
						'type': 'text'
					});
					$( '[name="contact-form[custom_fields][' + contact_form_field_data + '][custom_field_value]"]' ).replaceWith( textbox );
					if( contact_form_field_select == 'file' ) {
						var fileupload = $( document.createElement('input') ).attr({
							'name': 'contact-form[custom_fields][' + contact_form_field_data + '][custom_field_value]',
							'placeholder': custom_field_placeholder,
							'type': 'file',
							'style': 'pointer-events: none;'
						});
						$( '[name="contact-form[custom_fields][' + contact_form_field_data + '][custom_field_value]"]' ).replaceWith( fileupload );
						$( '[name="contact-form[custom_fields][' + contact_form_field_data + '][custom_field_name]"] + .myStickyelements-country-tooltip' ).show();
						$( '[name="contact-form[custom_fields][' + contact_form_field_data + '][custom_field_value]"] + i' ).hide();
					} else {
						$( '[name="contact-form[custom_fields][' + contact_form_field_data + '][custom_field_name]"] + .myStickyelements-country-tooltip' ).hide();
					}
				} else if( contact_form_field_select == 'textarea' || contact_form_field_select == 'textblock' ) {
					var textareabox = $( document.createElement('textarea') ).attr({
						'name': 'contact-form[custom_fields][' + contact_form_field_data + '][custom_field_value]',
						'placeholder': 'Enter your message',
						'rows': '5',
						'cols': '50'
					});
					$( '[name="contact-form[custom_fields][' + contact_form_field_data + '][custom_field_value]"]' ).replaceWith( textareabox );
				} else {
					var selectbox = $( document.createElement('select') ).attr({
						'name': 'contact-form[custom_fields][' + contact_form_field_data + '][custom_field_value]',
						'placeholder': 'Select'
					});
					$( '[name="contact-form[custom_fields][' + contact_form_field_data + '][custom_field_value]"]' ).replaceWith( selectbox );
					$( '[name="contact-form[custom_fields]['+contact_form_field_data+'][custom_field_value]"] + i' ).hide();
				}

				if( contact_form_field_select == 'number' ) {
					var custom_field_text_label = 'Custom Number';
				}else if ( contact_form_field_select == 'url' ) {
					var custom_field_text_label = 'Custom Website';
				}else if ( contact_form_field_select == 'textarea' ) {
					var custom_field_text_label = 'Custom Text Area';
				}else if ( contact_form_field_select == 'textblock' ) {
					var custom_field_text_label = 'Custom Text Block';
				}else if ( contact_form_field_select == 'date' ) {
					var custom_field_text_label = 'Custom Date';
				}else if ( contact_form_field_select == 'dropdown' ) {
					var custom_field_text_label = 'Custom Dropdown';
				}else if ( contact_form_field_select == 'file' ) {
					var custom_field_text_label = 'Custom File Upload';
				}else {
					var custom_field_text_label = 'Custom Text';
				}
				$('#custom_field_label'+contact_form_field_data).text( custom_field_text_label );
				$( '[name="contact-form[custom_fields][' + contact_form_field_data + '][custom_field_name]"]' ).val( custom_field_text_label );
			} else if( contact_form_field_select == 'iplog' ) {
				
				var append_field = "<div id= 'mystickyelements-option-field-iplog' class='mystickyelements-option-field-iplog mystickyelements-option-field contact-form-option myStickyelements-icon-wrap mystickyelements-iplog-field'><div class='mystickyelements-move-handle'></div><div class='sticky-col-1'><input type='hidden' class='contact-fields' name='contact-form[iplog]' value='iplog' /><span class='mystickyelements-custom-fields-tooltip'><a href='javascript:void(0);' class='mystickyelements-tooltip mystickyelements-new-custom-btn'><i class='fas fa-info'></i></a><p>When enabled, the plugin will log the IP address of each contact form submission</p></span><label class='text_label'>Enable IP address log</label></div><div class='sticky-col-2'><div class='mystickyelements-reqired-wrap'><label class='myStickyelements-switch'><input type='checkbox' name='contact-form[iplog_checkbox]' id='iplog_checkbox' value='yes' checked/><span class='slider round'></span></label><input type='hidden' name='contact-form[custom_fields]["+contact_form_field_data+"][iplog]' value='"+contact_form_field_select+"' /></div><div class='mystickyelements-action'><ul><li><span class='iplog-delete'><i class='fas fa-trash-alt stickyelement-iplog-delete'></i></span></li></ul></div></div></div><div id='setting_label"+contact_form_field_data+"' class='myStickyelements-setting-label' style='display: none;'>";
				
				$( append_field ).insertAfter( ".myStickyelements-consent-main-field" );
				
			} else if( contact_form_field_select == 'recaptcha' ) {
				
				var append_field = "<div id='mystickyelements-option-field-recaptcha' class='mystickyelements-option-field contact-form-option myStickyelements-icon-wrap mystickyelements-recaptcha-field mystickyelements-recaptcha_checkbox hide_field'><span class='mystickyelement-field-hide-content'>Field is hidden.<label for='recaptcha_checkbox'><a>Show the field</a></label></span><div class='mystickyelements-move-handle'></div><div class='sticky-col-1'><div class='mystickyelements-custom-fields-tooltip myStickyelements-country-tooltip'><a href='javascript:void(0);' class='mystickyelements-tooltip mystickyelements-new-custom-btn'><i class='fas fa-info'></i></a><p>Click <a href='https://www.google.com/recaptcha/admin/create' target='_blank'>here</a> to add your website. (please make sure you select V3). After adding your website you'll get your site key and secret key.</p></div><input type='hidden' class='contact-fields' name='contact-form[recaptcha]' value='recaptcha' /><label class='text_label'>reCAPTCHA</label></div><div class='sticky-col-2'><div class='mystickyelements-reqired-wrap' style='margin-bottom:20px;'><div class='mystickyelements-custom-fields-tooltip myStickyelements-country-tooltip' ><a href='javascript:void(0);' class='mystickyelements-tooltip mystickyelements-new-custom-btn'><i class='fas fa-info'></i></a><p>Click COPY SITE KEY from Google reCAPTCHA and paste it here<img src='"+ mystickyelements.mystickyelement_pro_url +"images/site-key.png' /></p></div>&nbsp;&nbsp;<input type='text' id='recaptcha_site_key' name='contact-form[recaptcha_site_key]' value='' placeholder='Enter your reCAPTCHA site key' /></div><div class='mystickyelements-reqired-wrap'><div class='mystickyelements-custom-fields-tooltip myStickyelements-country-tooltip' ><a href='javascript:void(0);' class='mystickyelements-tooltip mystickyelements-new-custom-btn'><i class='fas fa-info'></i></a><p>Click the COPY SECRET KEY from Google reCAPTCHA and paste it here.<img src='" +mystickyelements.mystickyelement_pro_url + "images/secret-key.png' /></p></div>&nbsp;&nbsp;<input type='text' id='recaptcha_secrete_key' name='contact-form[recaptcha_secrete_key]' value='' placeholder='Enter your reCAPTCHA secret key' /></div><div class='mystickyelements-reqired-wrap' style='margin-top:20px;'><div class='mystickyelements-custom-fields-tooltip myStickyelements-country-tooltip' ><a href='javascript:void(0);' class='mystickyelements-tooltip mystickyelements-new-custom-btn'><i class='fas fa-info'></i></a><p>You're allowed to hide the reCAPTCHA badge from the bottom of your website as long as you comply with <a href='https://developers.google.com/recaptcha/docs/faq#id-like-to-hide-the-recaptcha-badge.-what-is-allowed' target='_blank'>these guidelines</a></p></div>&nbsp;&nbsp;<label><input type='checkbox' name='contact-form[invisible_recaptcha_checkbox]' id='invisible_recaptcha_checkbox' value='yes'  />&nbsp;Hide reCAPTCHA badge&nbsp; &nbsp;</label></div><div class='mystickyelements-action'><ul><li><label  class='myStickyelements-visible-icon mystickyelements-custom-fields-tooltip'><input type='checkbox' name='contact-form[recaptcha_checkbox]' id='recaptcha_checkbox' value='yes' /><span class='visible-icon'><p class='show-field-tooltip'>Show Field</p><p class='hide-field-tooltip'>Hide Field</p></span></label></li><li><span class='recaptcha-delete'><i class='fas fa-trash-alt stickyelement-recaptcha-delete'></i></span></li><li><label for='"+contact_form_field_data+"_hide'>Hide reCAPTCHA badge</label><label class='myStickyelements-switch'><input type='checkbox' id='"+contact_form_field_data+"_hide' name='contact-form[invisible_recaptcha_checkbox]' id='invisible_recaptcha_checkbox' value='yes' /><span class='slider round'></span></label></li></ul><div class='mystickyelements-hide-field-guide'><p>The field is hidden and won\’t show.</p></div></div></div></div>";
				
				$( append_field ).insertAfter( ".myStickyelements-consent-main-field" );
				
			} else if( contact_form_field_select == 'textblock' ) {
				$( '.mystickyelements-textblock-main-field' ).addClass( 'mystickyelements-textblock-open' );
				$( 'input[name="contact-form[textblock]"]' ).val( 'textblock' );
				$('html, body').animate({scrollTop : 0},700);
			}
			$( '.myStickyelements-contact-form-field-option .contact-form-field-open' ).remove();
			$( 'body' ).removeClass( 'contact-form-popup-open' );
		} );

		$(document).on( "click", '.stickyelement-iplog-delete' , function(e){
			//$( '.mystickyelements-iplog-field' ).remove();
			console.log("click");
			$( '#mystickyelements-option-field-iplog' ).remove();
		} );
		
		$(document).on( "click", '.stickyelement-recaptcha-delete' , function(e){
			//$( '.mystickyelements-recaptcha-field' ).remove();
			$( '#mystickyelements-option-field-recaptcha' ).remove();
		} );
		
		$(document).on( "click", '.stickyelement-textblock-delete' , function(e){
			$( '#mystickyelements-option-field-textblock' ).remove();
		} );

		/*  Sortable Dropdown Option Value field*/
		jQuery( '.contact-form-dropdown-option' ).sortable({
			items:'.option-value-field',
			placeholder: "mystickyelements-state-highlight option-value-field",
			cursor:'move',
			scrollSensitivity:40,
			helper:function(e,ui){
				ui.children().each(function(){
					jQuery(this).width(jQuery(this).width());
				});
				ui.css('left', '0');
				return ui;
			},
			start:function(event,ui){
				ui.item.css('background-color','#EFF6F6');
			},
			stop:function(event,ui){
				ui.item.removeAttr('style');
			}
		});

		if ( $( '#myStickyelements-minimize-tab' ).prop("checked") != true ) {
			$( '.myStickyelements-minimize-tab .wp-picker-container' ).hide();
			$( '.myStickyelements-minimized' ).hide();
		}

		if ( $( '#myStickyelements-contact-form-enabled' ).prop("checked") != true ) {
			$('.myStickyelements-contact-form-field-hide').hide();
			myStickyelements_mobile_count();
			$(".turn-off-message").css('display','block');
			$(".contact-form-description").css('display','none');
		}
		else{
			$(".turn-off-message").css('display','none');
			$(".contact-form-description").css('display','block');
		}

		$( document ).on( 'click', '.myStickyelements-visible-icon input[type="checkbox"]', function() {
			var visible_id = $(this).attr('id');
			if( $(this).prop("checked") == true ){
				$( '.mystickyelements-' + visible_id ).removeClass( 'hide_field' );
			}else {
				$( '.mystickyelements-' + visible_id ).addClass( 'hide_field' );
			}
		});

		if ( $( '#myStickyelements-social-channels-enabled' ).prop("checked") != true ) {
			$('.social-disable-info').css('display','block');
			$('.mystickyelements-disable-wrap').addClass('mystickyelements-disable');
			$('.mystickyelements-disable-wrap .myStickyelements-social-channels-info').hide();
			$('.mystickyelements-disable-content-wrap').css('display','block');
			$('.mystickyelements-social-preview').hide();
			$('#myStickyelements-preview-contact').addClass('mystickyelements-contact-last');
			$(".myStickyelements-preview-tab .mystickyelements-fixed").removeClass (function (index, className) {
				return (className.match (/(^|\s)mystickyelements-bottom-social-channel-\S+/g) || []).join(' ');
			});
			$(".myStickyelements-preview-tab .mystickyelements-fixed").removeClass (function (index, className) {
				return (className.match (/(^|\s)mystickyelements-top-social-channel-\S+/g) || []).join(' ');
			});
			$( '.myStickyelements-preview-tab .mystickyelements-fixed' ).addClass( 'mystickyelements-bottom-social-channel-1' );
			$( '.myStickyelements-preview-tab .mystickyelements-fixed' ).addClass( 'mystickyelements-top-social-channel-1' );
		}
		else{
			
			$('.mystickyelements-disable-wrap').remove('mystickyelements-disable');
			$('.mystickyelements-disable-wrap .myStickyelements-social-channels-info').show();
			$('.mystickyelements-disable-content-wrap').css('display','none');
			$('.social-disable-info').css('display','none');
		}

		$( 'input[name="contact-form[desktop]"]' ).on( 'click', function(){
			if( $(this).prop("checked") == true ){
				jQuery( '#myStickyelements-preview-contact' ).addClass( 'element-desktop-on' );
			} else {
				jQuery( '#myStickyelements-preview-contact' ).removeClass( 'element-desktop-on' );
			}
		});
		$( 'input[name="contact-form[mobile]"]' ).on( 'click', function(){
			if( $(this).prop("checked") == true ){
				jQuery( '#myStickyelements-preview-contact' ).addClass( 'element-mobile-on' );
				myStickyelements_mobile_count();
			} else {
				jQuery( '#myStickyelements-preview-contact' ).removeClass( 'element-mobile-on' );
				myStickyelements_mobile_count();
			}
		});

		$( '#myStickyelements-minimize-tab' ).on( 'click', function () {
			if( $(this).prop("checked") == true ){
				$( '.myStickyelements-minimize-tab .wp-picker-container' ).show();
				$( '.myStickyelements-minimized' ).show();
				var position = $( 'input[name="general-settings[position]"]:checked' ).val();
				var position_arrow = '';
				if (position == 'left'){
					position_arrow = '&larr;';
				} else {
					position_arrow = '&rarr;';
				}
				var backgroud_color = $( '#minimize_tab_background_color' ).val();

				var minimize_content = "<li class='mystickyelements-minimize'><span class='mystickyelements-minimize minimize-position-"+ position +"' style='background: "+ backgroud_color +"'>"+position_arrow+"</span></li>";
				$( '.myStickyelements-preview-tab ul.myStickyelements-preview-ul li.mystickyelements-minimize' ).remove();
				$( ".myStickyelements-preview-tab ul.myStickyelements-preview-ul" ).prepend( minimize_content );
				$( '.myStickyelements-preview-tab ul.myStickyelements-preview-ul' ).removeClass( 'remove-minimize' );
			} else {
				$( '.myStickyelements-minimize-tab .wp-picker-container' ).hide();
				$( '.myStickyelements-minimized' ).hide();
				$( '.myStickyelements-preview-tab ul.myStickyelements-preview-ul li.mystickyelements-minimize' ).remove();
				$( '.myStickyelements-preview-tab ul.myStickyelements-preview-ul' ).addClass( 'remove-minimize' );
			}
			mystickyelements_border_radius();
		});

		$( '#myStickyelements-contact-form-enabled' ).on( 'click', function () {
			$('.myStickyelements-contact-form-field-hide').toggle();
		});

		$( '#myStickyelements-social-channels-enabled' ).on( 'click', function () {
			
				if ($(this).prop("checked") != true) {
					$('#socialform-status-popup').show();	
					$('#mystickyelement-social-popup-overlay').show();
					
				} else {
					$('.mystickyelements-social-preview').toggle();
					$('#myStickyelements-preview-contact').toggleClass('mystickyelements-contact-last');
					$('.social-disable-info').css('display','none');
					myStickyelements_mobile_count();
				}
				mystickyelements_disable_section( 'mystickyelements-tab-social-media', 'myStickyelements-social-channels-enabled' );
		});

		var expanded = false;

		$( '#mystickyelement-multiselectbox' ).on( 'click', function () {
			var checkboxes = document.getElementById("checkboxes");
			if (!expanded) {
				checkboxes.style.display = "block";
				expanded = true;
			} else {
				checkboxes.style.display = "none";
				expanded = false;
			}
		});

		var total_page_option = 0;
		var page_option_content = "";
		total_page_option   = $( '.myStickyelements-page-option' ).length;
	    page_option_content = $( '.myStickyelements-page-options-html' ).html();
	    $( '.myStickyelements-page-options-html' ).remove();
		$( '#remove-page-rules' ).on( 'click', function(){
			$('#myStickyelements-page-options .myStickyelements-page-option').remove();
			$('#remove-page-rules').hide();
			$( this ).prev().show();
		});
	    $( '#create-rule' ).on( 'click', function(){
			
			console.log("click");
			$('#remove-page-rules').show();
	        var append_html = page_option_content.replace(/__count__/g, total_page_option, page_option_content);
	        total_page_option++;
	        $( '.myStickyelements-page-options' ).append( append_html );
	        $( '.myStickyelements-page-options .myStickyelements-page-option' ).removeClass( 'last' );
	        $( '.myStickyelements-page-options .myStickyelements-page-option:last' ).addClass( 'last' );

			if( $( '.myStickyelements-page-option .upgrade-myStickyelements' ).length > 0 ) {
				$( this ).hide();
			}

			/*equal Show on Pages and Days and Hours width*/
			//var show_page_width = $( '#myStickyelements-page-options .myStickyelements-page-option' ).width();
			//$( '#myStickyelements-days-hours-options .myStickyelements-page-option' ).width( show_page_width );

			$(".stickyelement-gmt-timezone").select2({ dropdownCssClass: "stickyelement-gmt-timezone" });

			var topPos = jQuery(".show-on-apper").offset().top - jQuery(window).scrollTop() - 700;
			topPos = Math.abs(topPos);
			var finalpos = $( '.mystickyelements-wrap' ).position().top + topPos;
			jQuery(".myStickyelements-preview-tab").css("margin-top", ((-1)*finalpos)+"px");

			/*var show_right_pos = $( '.myStickyelements-show-on-right' ).offset().left;
			var remain_width =window_width - show_right_pos - 20;
			$( '.myStickyelements-page-options' ).width( remain_width );*/	

			mystickyelements_page_rule_width();
		
	    });
		if( $( '.myStickyelements-page-option' ).length && $( '#mystickyelements-display-settings' ).hasClass( 'active' ) ) {
			mystickyelements_page_rule_width();
		}

	    $( document ).on( 'click', '.myStickyelements-remove-rule', function() {
			$( this ).closest( '.myStickyelements-page-option' ).remove();
	        $( '.myStickyelements-page-options .myStickyelements-page-option' ).removeClass( 'last' );
	        $( '.myStickyelements-page-options .myStickyelements-page-option:last' ).addClass( 'last' );

			/*equal Show on Pages and Days and Hours width*/
			//var show_page_width = $( '#myStickyelements-page-options .myStickyelements-page-option' ).width();
			//$( '#myStickyelements-days-hours-options .myStickyelements-page-option' ).width( show_page_width );
			$(".stickyelement-gmt-timezone").select2({ dropdownCssClass: "stickyelement-gmt-timezone" });
	    });
		/* Add Days & Hours Rules */

		/*equal Show on Pages and Days and Hours width*/
		var show_page_width = $( '#myStickyelements-page-options .myStickyelements-page-option' ).width();
		$( '#myStickyelements-days-hours-options .myStickyelements-page-option' ).width( show_page_width );

		$(".ui-timepicker-input.timepicker_time").timepicker({
			showLeadingZero: true
		});
		$(".stickyelement-gmt-timezone.gmt-timezone").select2({ dropdownCssClass: "stickyelement-gmt-timezone" });

		var total_days_hours_option = 0;
		var days_hours_option_content = "";
		total_days_hours_option   = $( '.myStickyelements-days-hours-options .myStickyelements-page-option' ).length;
		console.log("total_days_hours_option="+total_days_hours_option);
	    days_hours_option_content = $( '.myStickyelements-days_hours-options-html' ).html();
		$( '.myStickyelements-days_hours-options-html' ).remove();
		
		$( '#remove-data-and-time-rule' ).on( 'click', function(){
			$('#myStickyelements-days-hours-options .myStickyelements-page-option').remove();
			$('#remove-data-and-time-rule').hide();
			$( this ).prev().show();
		});
		$( '#create-data-and-time-rule' ).on('click', function() {
			$('#remove-data-and-time-rule').show();
			var append_html = days_hours_option_content.replace(/__count__/g, total_days_hours_option, days_hours_option_content);
	        total_days_hours_option++;

			$( '.myStickyelements-days-hours-options' ).append( append_html );
	        $( '.myStickyelements-days-hours-options .myStickyelements-page-option' ).removeClass( 'last' );
	        $( '.myStickyelements-days-hours-options .myStickyelements-page-option:last' ).addClass( 'last' );

			if( $( '.myStickyelements-days-hours-options .upgrade-myStickyelements' ).length > 0 ) {
				$( this ).hide();
			}

			$(".ui-timepicker-input").timepicker({
				showLeadingZero: true
			});

			/*equal Show on Pages and Days and Hours width*/
			var show_page_width = $( '#myStickyelements-page-options .myStickyelements-page-option' ).width();
			$( '#myStickyelements-days-hours-options .myStickyelements-page-option' ).width( show_page_width );
			$(".stickyelement-gmt-timezone").select2({ dropdownCssClass: "stickyelement-gmt-timezone" });

			var topPos = jQuery(".show-on-apper").offset().top - jQuery(window).scrollTop() - 700;
			topPos = Math.abs(topPos);
			var finalpos = $( '.mystickyelements-wrap' ).position().top + topPos;
			jQuery(".myStickyelements-preview-tab").css("margin-top", ((-1)*finalpos)+"px");
			
			var window_width = $( window ).width();			
			var dir = $("html").attr("dir");
			if (dir === 'rtl') {				
				//var show_right_pos = $( '.myStickyelements-show-on-right' ).offset().left;
				
				var adminmenuwrap = $( '#adminmenuwrap' ).width();
				var more_setting_rows_width = ( $( '.more-setting-rows' ).width() - $( '.myStickyelements-show-on-right' ).width() );
				var remain_width = window_width - more_setting_rows_width - adminmenuwrap - 60;
				$( '.myStickyelements-days-hours-options' ).width( remain_width );	
			
			} else {
				var show_right_pos = $( '.myStickyelements-show-on-right' ).offset().left;
				var remain_width = window_width - show_right_pos - 20;
				$( '.myStickyelements-days-hours-options' ).width( remain_width );	
			}
		});

		/* Traffic Source*/
		$( '#remove-traffic-add-other-source' ).on( 'click', function(){
			$('#myStickyelements-direct-traffic-source').prop('checked','');
			$('#myStickyelements-social-network-traffic-source').prop('checked','');
			$('#myStickyelements-search-engines-traffic-source').prop('checked','');
			$('#myStickyelements-google-ads-traffic-source').prop('checked','');
			$('#custom-traffic-source-lists tbody tr').not(':first').remove();
			$('#remove-traffic-add-other-source').hide();
			$('.traffic-source-option').hide();
			$('#remove-traffic-add-other-source').hide();
			$( this ).prev().show();
		});
		
		$('#custom-traffic-source-lists tbody tr:first .traffic-delete-other-source').hide();
		var other_source = false;
		$('#traffic-add-other-source.traffic-add-source').on('click', function(event){
			event.preventDefault();
			$('#remove-traffic-add-other-source').show();
			$('.traffic-source-option').show();
			$('#traffic-add-other-source').removeClass('traffic-add-source');
			$('#traffic-add-other-source').addClass('traffic-add-other-source');
			$('#traffic-add-other-source').addClass('traffic-not-other-source');
			if( $( '.myStickyelements-traffic-source-inputs .upgrade-myStickyelements' ).length > 0 ) {
				$( this ).hide();
			}
		});
		
		/*$(document).on('click','.contact-form-popup-open',function(){
			$( 'body' ).removeClass( 'contact-form-popup-open' );
			$('.contact-form-setting-popup-open').hide();
		});*/
		
		$(document).on('click','#traffic-add-other-source', function(event){
			event.preventDefault();

			if ( other_source === false && $(this).hasClass('traffic-not-other-source')) {
				$(this).removeClass('traffic-not-other-source');
				other_source = true;
				return;
			}
			var $tableBody = $('#custom-traffic-source-lists').find("tbody"),
			$trLast = $tableBody.find("tr:last"),
			$trNew = $trLast.clone();
			$trNew.find('input').val('');
			$trLast.after($trNew);

			$('.traffic-delete-other-source').show();
			$('#custom-traffic-source-lists tbody tr:first .traffic-delete-other-source').hide();
		});
		$(document).on('click','.traffic-delete-other-source', function(event){
			event.preventDefault();
			$(this).parent().parent().parent().remove();

		});


		check_for_preview_pos();
		$(window).on( 'scroll', function(){
			check_for_preview_pos();
		});

		$( document ).on( 'change', '.myStickyelements-url-options', function() {
			var current_val = jQuery( this ).val();
			var myStickyelements_siteURL = jQuery( '#myStickyelements_site_url' ).val();
			var myStickyelements_newURL  = myStickyelements_siteURL;
			if( current_val == 'page_has_url' ) {
				myStickyelements_newURL = myStickyelements_siteURL;
			} else if( current_val == 'page_contains' ) {
				myStickyelements_newURL = myStickyelements_siteURL + '%s%';
			} else if( current_val == 'page_start_with' ) {
				myStickyelements_newURL = myStickyelements_siteURL + 's%';
			} else if( current_val == 'page_end_with' ) {
				myStickyelements_newURL = myStickyelements_siteURL + '%s';
			}
			$( this ).closest( '.url-content' ).find( '.myStickyelements-url' ).text( myStickyelements_newURL );

			/*equal Show on Pages and Days and Hours width*/
			var show_page_width = $( '#myStickyelements-page-options .myStickyelements-page-option' ).width();
			$( '#myStickyelements-days-hours-options .myStickyelements-page-option' ).width( show_page_width );
			$(".stickyelement-gmt-timezone").select2({ dropdownCssClass: "stickyelement-gmt-timezone" });
		});

		/* Date: 2019-08-19 Add Custom Fields */
		var customfields = $('#myStickyelements-custom-fields-length').val();
		var custom_field = ( typeof customfields !== 'undefined') ? customfields : 1;
		
		$(document).on( "click", '.mystickyelements-add-custom-fields a' , function(e){
			e.preventDefault();
			var length = $( '.mystickyelements-customfields').length;
			
			if ( length >= 6) {
				$( '#mystickyelements-contact-form-fields .mystickyelements-custom-field-limit' ).remove();
				var field = "<div class='mystickyelements-custom-field-limit'><div class='social-channel-popover'><p class='description'>You can add up to 6 custom fields</p></div></div>";
				$( '#mystickyelements-contact-form-fields' ).append(field);
				$('.social-channel-popover').show().effect('shake', { times: 3 }, 600);
			} else {
				
				var is_active = $(this).data("isactive");
				var active_url_page = $(this).data("active-page-url");
				
				var  free_version_div = ( is_active == 0 ) ? 'mystickyelements-free-version' : '';
				
				var upgrad_div = '<div class="upgrade-myStickyelements-link"><a href="'+active_url_page+'" target="_blank"><i class="fas fa-lock"></i>ACTIVATE YOUR KEY</a><p style="color: #000;">What can you do with the custom fields? </p><a href="https://premio.io/help/mystickyelements/how-to-add-custom-fields-to-your-contact-form/?utm_source=mseplugin" target="_blank">Show me the guide </a></div>';
				
				if( is_active == 1 ){
					upgrad_div='';
				}
				var field = "<div id='contact_form_field_open"+custom_field+"' class='contact-form-field-open contact-form-setting-popup-open'><div class='contact-form-popup-label'><h3>Add A New Field</h3><div class='contact-form-field-select-wrap "+free_version_div+"'><label class='contact-form-field-select'><input type='radio' value='text' data-field='"+custom_field+"' name='contact-form[custom_fields]["+custom_field+"][field_dropdown]' /><span><i class='fas fa-edit'></i>Text</span></label><label class='contact-form-field-select'><input type='radio' value='textarea' data-field='"+custom_field+"' name='contact-form[custom_fields]["+custom_field+"][field_dropdown]' /><span><i class='fas fa-align-justify'></i>Text Area</span></label><label class='contact-form-field-select'><input type='radio' value='number' data-field='"+custom_field+"' name='contact-form[custom_fields]["+custom_field+"][field_dropdown]' /><span><i class='fas fa-phone'></i>Number</span></label><label class='contact-form-field-select'><input type='radio' value='date' data-field='"+custom_field+"' name='contact-form[custom_fields]["+custom_field+"][field_dropdown]' /><span><i class='fas fa-calendar-week'></i>Date</span></label><label class='contact-form-field-select'><input type='radio' value='url' data-field='"+custom_field+"' name='contact-form[custom_fields]["+custom_field+"][field_dropdown]' /><span><i class='fas fa-link'></i>Website</span></label><label class='contact-form-field-select'><input type='radio' value='dropdown' data-field='"+custom_field+"' name='contact-form[custom_fields]["+custom_field+"][field_dropdown]' /><span><i class='fas fa-caret-down'></i>Dropdown</span>	</label><label class='contact-form-field-select'><input type='radio' value='file' data-field='"+custom_field+"' name='contact-form[custom_fields]["+custom_field+"][field_dropdown]' /><span><i class='fas fa-file-upload'></i>File Upload</span>	</label><label class='contact-form-field-select contact-form-field-iplog' style='display: none'><input type='radio' value='iplog' data-field='"+custom_field+"' name='contact-form[custom_fields]["+custom_field+"][field_dropdown]' /><span><i class='fas fa-tools'></i>IP Log</span></label><label class='contact-form-field-select contact-form-field-recaptcha' style='display: none'><input type='radio' value='recaptcha' data-field='"+custom_field+"' name='contact-form[custom_fields]["+custom_field+"][field_dropdown]' /><span><i class='fas fa-tools'></i>reCAPTCHA</span></label><label class='contact-form-field-select contact-form-field-textblock' style='display: none'><input type='radio' value='textblock' data-field='"+custom_field+"' name='contact-form[custom_fields]["+custom_field+"][field_dropdown]' /><span><i class='far fa-newspaper'></i>Text Block</span></label>"+upgrad_div+"</div></div><div id='contact_form_custom_dropdown"+custom_field+"' class='contact-form-dropdown-main' style='display: none;'><input type='text' name='contact-form[custom_fields]["+custom_field+"][dropdown-placeholder]' class='contact-form-dropdown-select' value='' placeholder='Select...'/><div class='contact-form-dropdown-option'><div class='option-value-field'><span class='move-icon'></span><input type='text' name='contact-form[custom_fields]["+custom_field+"][dropdown-option][]' value=''/><span class='add-customfield-dropdown-option' data-field='"+custom_field+"'>Add</span></div></div><input type='submit' name='submit' class='button button-primary' value='Save'></div><span class='contact-form-dropdfown-close'><i class='fas fa-times'></i></span></div>";
				
				$( '.myStickyelements-contact-form-field-option' ).append(field);
				$( 'body' ).addClass( 'contact-form-popup-open' );

				if( jQuery( '.mystickyelements-iplog-field' ).length ){
					jQuery( '.contact-form-field-iplog' ).hide();
				} else {
					jQuery( '.contact-form-field-iplog' ).show();
				}

				if( jQuery( '.mystickyelements-recaptcha-field' ).length ){
					jQuery( '.contact-form-field-recaptcha' ).hide();
				} else {
					jQuery( '.contact-form-field-recaptcha' ).show();
				}

				if( jQuery( '.mystickyelements-textblock-main-field' ).hasClass( 'mystickyelements-textblock-open' ) ){
					jQuery( '.contact-form-field-textblock' ).hide();
				} else {
					jQuery( '.contact-form-field-textblock' ).show();
				}

				jQuery( '.contact-form-dropdown-option' ).sortable({
					items:'.option-value-field',
					placeholder: "mystickyelements-state-highlight option-value-field",
					cursor:'move',
					scrollSensitivity:40,
					helper:function(e,ui){
						ui.children().each(function(){
							jQuery(this).width(jQuery(this).width());
						});
						ui.css('left', '0');
						return ui;
					},
					start:function(event,ui){
						ui.item.css('background-color','#EFF6F6');
					},
					stop:function(event,ui){
						ui.item.removeAttr('style');
					}
				});
				custom_field++;
			}
		});
		
		if( jQuery( '.mystickyelements-iplog-field' ).length ){
			jQuery( '.contact-form-field-iplog' ).hide();
		} else {
			jQuery( '.contact-form-field-iplog' ).show();
		}

		if( jQuery( '.mystickyelements-recaptcha-field' ).length ){
			jQuery( '.contact-form-field-recaptcha' ).hide();
		} else {
			jQuery( '.contact-form-field-recaptcha' ).show();
		}

		if( jQuery( '.mystickyelements-textblock-main-field' ).hasClass( 'mystickyelements-textblock-open' ) ){
			jQuery( '.contact-form-field-textblock' ).hide();
		} else {
			jQuery( '.contact-form-field-textblock' ).show();
		}
		/* Add Dropdown Option */
		$(document).on( "click", '.add-customfield-dropdown-option' , function(e){
			var dropdown_custom_field = $( this ).data( 'field' );
			$( '.contact-form-dropdown-option' ).append( '<div class="option-value-field ui-sortable-handle"><div class="move-icon"></div><input type="text" name="contact-form[custom_fields]['+dropdown_custom_field+'][dropdown-option][]" value=""/><span class="delete-dropdown-option"><i class="fas fa-times"></i></span></div>' );
		});
		/* Delete Custom Field */
		$(document).on( "click", 'i.stickyelement-delete' , function(e){
			
			$(this).parent().parent().parent().parent().parent().parent().remove();
			$( '#mystickyelements-contact-form-fields .mystickyelements-custom-field-limit' ).remove();
			
			
		});

		/* Edit Custom field Name */
		$(document).on( "click", '.stickyelement-edit' , function(e){
			$(this).hide();
			$(this).prev().hide();
			$(this).next().show();
			$(this).next().select();
		});

		$(document).on( "blur", 'input[type="text"].stickyelement-edit-field' , function(e){
			if ($.trim(this.value) == ''){
				this.value = (this.defaultValue ? this.defaultValue : '');
			} else {
				$(this).prev().prev().html(this.value);
			}

			$(this).hide();
			$(this).prev().show();
			$(this).prev().prev().show();
		 });


		$(document).on( "keypress", 'input[type="text"].stickyelement-edit-field' , function(e){
			if (event.keyCode == '13') {
				if ($.trim(this.value) == '') {
					this.value = (this.defaultValue ? this.defaultValue : '');
				} else {
					$(this).prev().prev().html(this.value);
				}
				$(this).hide();
				$(this).prev().show();
				$(this).prev().prev().show();
				return false;
			}
		});

		$("#myStickyelements-inputs-position-on-screen").on( 'change', function() {
			$(".myStickyelements-preview-tab .mystickyelements-fixed").removeClass (function (index, className) {
				return (className.match (/(^|\s)mystickyelements-position-screen-\S+/g) || []).join(' ');
			});
			$( '.myStickyelements-preview-tab .mystickyelements-fixed' ).addClass( 'mystickyelements-position-screen-' + $(this).val() );
		});
		$("#myStickyelements-widget-size").on( 'change', function() {
			$(".myStickyelements-preview-tab .mystickyelements-fixed").removeClass (function (index, className) {
				return (className.match (/(^|\s)mystickyelements-size-\S+/g) || []).join(' ');
			});
			$( '.myStickyelements-preview-tab .mystickyelements-fixed' ).addClass( 'mystickyelements-size-' + $(this).val() );
		});
		$("#myStickyelements-widget-mobile-size").on( 'change', function() {
			$(".myStickyelements-preview-tab .mystickyelements-fixed").removeClass (function (index, className) {
				return (className.match (/(^|\s)mystickyelements-mobile-size-\S+/g) || []).join(' ');
			});
			$( '.myStickyelements-preview-tab .mystickyelements-fixed' ).addClass( 'mystickyelements-mobile-size-' + $(this).val() );
		});

		$("#myStickyelements-entry-effect").on( 'change', function() {
			$(".myStickyelements-preview-tab .mystickyelements-fixed").removeClass('entry-effect');
			$(".myStickyelements-preview-tab .mystickyelements-fixed").removeClass (function (index, className) {
				return (className.match (/(^|\s)mystickyelements-entry-effect-\S+/g) || []).join(' ');
			});
			$( '.myStickyelements-preview-tab .mystickyelements-fixed' ).addClass( 'mystickyelements-entry-effect-' + $(this).val() );
			setTimeout( function(){
				$(".myStickyelements-preview-tab .mystickyelements-fixed").addClass('entry-effect');
			}, 1000 );

		});

		$("#myStickyelements-inputs-templete").on( 'change', function() {
			$(".myStickyelements-preview-tab .mystickyelements-fixed").removeClass (function (index, className) {
				return (className.match (/(^|\s)mystickyelements-templates-\S+/g) || []).join(' ');
			});
			$( '.myStickyelements-preview-tab .mystickyelements-fixed' ).addClass( 'mystickyelements-templates-' + $(this).val() );
			social_icon_live_preview_color_css();

			if ( jQuery(this).val() != 'default' && jQuery( '.preview-mobile' ).hasClass('preview-active') == true ) {
				jQuery( '#myStickyelements_mobile_templete_desc' ).show();
				$('#myStickyelements_mobile_templete_desc').fadeOut(500);
				$('#myStickyelements_mobile_templete_desc').fadeIn(500);
			} else {
				jQuery( '#myStickyelements_mobile_templete_desc' ).hide();
			}
			if( jQuery( this ).val() != 'default' ) {
				$( '.mystickyelements-icon-below-text' ).hide();
			} else {
				$( '.mystickyelements-icon-below-text' ).show();
				$( '.myStickyelements-preview-ul li' ).each( function(){
					if ( $( this ).find( '.mystickyelements-icon-below-text' ).is(':empty') ){
					  $( this ).find( '.mystickyelements-icon-below-text' ).hide();
					}
				} );
			}
		});

		$( '.mystickyelements-fixed' ).addClass( 'entry-effect' );

		/* FontAwesome icon formate in select2 */
		function stickyelement_iconformat(icon) {
			var originalOption = icon.element;
			return $('<span><i class="' + icon.text + '"></i> ' + icon.text + '</span>');
		}

		$('.social-channel-fontawesome-icon').select2({
													allowClear: true,
													templateSelection: stickyelement_iconformat,
													templateResult: stickyelement_iconformat,
													allowHtml: true
												});
		$(document).on( "change", ".social-channel-fontawesome-icon" , function(e){
			//~ $('.social-channel-icon-close').trigger('click');
			var social_channel = $(this).data('slug');
			var social_tooltip_text = social_channel.replace( '_', ' ' );
			$('ul.myStickyelements-preview-ul li span.social-' + social_channel).html('<i class="' + $(this).val() + '"></i> ');
			$('.social-channels-item .social-channel-input-box-section .social-' + social_channel ).html('<i class="' + $(this).val() + '"></i><span class="social-tooltip-popup">' + social_tooltip_text + '</span>');
			if($(this).val() != '') {
				$('#social-channel-' + social_channel + '-custom-icon').val('');
				$('#social-channel-' + social_channel + '-icon').hide();
				$('#social-channel-' + social_channel + '-custom-icon-img').attr( 'src', '');
				$('#social-channel-' + social_channel + '-icon').parent().removeClass( 'myStickyelements-custom-image-select' );
			}
			mystickyelements_border_radius();
		});
		mystickyelements_border_radius();

		//$( '.myStickyelements-preview-tab').css( 'top' , $( '.myStickyelements-contact-form-tab' ).offset().top );

		/*Confirm dialog*/
		$( '.mystickyelements-wrap p.submit input#submit' ).on( 'click', function(e){
			var icon_below_text_apper = 0;
			var mystickyelement_save_confirm_status = $( 'input#mystickyelement_save_confirm_status' ).val();
			$( '.mystickyelements-fixed ul li' ).each( function(){
				var icon_below_text_val = $( this ).find( '.mystickyelements-icon-below-text' ).text();
				if ( icon_below_text_val != '' ){
				  icon_below_text_apper = 1;
				  return false;
				}
			} );
			if ( jQuery("#myStickyelements-inputs-templete").val() != 'default' && icon_below_text_apper && mystickyelement_save_confirm_status == '' ) {
				e.preventDefault();
				$( "#mystickyelement-save-confirm" ).dialog({
					resizable: false,
					modal: true,
					draggable: false,
					height: 'auto',
					width: 600,
					buttons: {
						"Publish": {
							click:function () {
								$( 'input#mystickyelement_save_confirm_status' ).val('1');
								$( '.mystickyelement-wrap p.submit input#submit' ).trigger('click');
								$( this ).dialog('close');
							},
							text: 'Publish',
	                    	class: 'purple-btn'
						},
						"Keep Editing": {
							 click:function () {
								$( this ).dialog( 'close' );
							},
							text: 'Keep Editing',
	                    	class: 'gray-btn'
						}
					}
				});
			}
			//return false;
		} );

		/*social search*/
		$( ".myStickyelements-social-search-wrap input" ).on( "keyup", function() {
			
			var search_value = $( this ).val().toLowerCase();
			console.log("search_value==>"+search_value);
			$( ".myStickyelements-social-channels-lists li" ).filter(function() {
			  $( this ).toggle( $( this ).data( "search" ).toLowerCase().indexOf( search_value ) > -1 );
			});
		});

		/*country select*/
		if(jQuery(".myStickyelements-country-list.is-pro").length) {
            jQuery(".myStickyelements-country-list.is-pro").select2({
                placeholder: "Select country",
                allowClear: false,
                closeOnSelect: false
            });
            $('.myStickyelements-country-list.is-pro').on('select2:open', function (e) {
                if(jQuery(".select2-results__options").length) {
                    jQuery(".country-action-btns").remove();
                    jQuery(".select2-results__options").before("<div class='country-action-btns'><a class='select-all-country' href='javascript:;'>Select All</a> | <a class='remove-all-country' href='javascript:;'>Deselect All</a></div>");
                }
            });

            jQuery(document).on("click", ".select-all-country", function(e){
                e.stopPropagation();
                jQuery(".myStickyelements-country-list.is-pro option").each(function(){
                    jQuery(this).attr("selected", true);
                });
                jQuery('.myStickyelements-country-list.is-pro').trigger("change");
                $('.myStickyelements-country-list.is-pro').select2('close');

                var countryCount = parseInt($('.myStickyelements-country-list.is-pro option:selected').length);
                if(countryCount == 0) {
                    $(".myStickyelements-country-button").text("All countries");
                } else if(countryCount == 1) {
                    $(".myStickyelements-country-button").text("1 country selected");
                } else {
                    $(".myStickyelements-country-button").text(countryCount+" countries selected");
                }
            });

            jQuery(document).on("click", ".remove-all-country", function(e){
                e.stopPropagation();
                jQuery(".myStickyelements-country-list.is-pro option").each(function(){
                    jQuery(this).attr("selected", false);
                });
                jQuery('.myStickyelements-country-list.is-pro').trigger("change");
                $('.myStickyelements-country-list.is-pro').select2('close');
                var countryCount = parseInt($('.myStickyelements-country-list.is-pro option:selected').length);
                if(countryCount == 0) {
                    $(".myStickyelements-country-button").text("All countries");
                } else if(countryCount == 1) {
                    $(".myStickyelements-country-button").text("1 country selected");
                } else {
                    $(".myStickyelements-country-button").text(countryCount+" countries selected");
                }
            });

            jQuery( document ).on( "click", ".myStickyelements-country-button", function(e){
	            if(!jQuery(".myStickyelements-country-list-box").hasClass("active")) {
	                jQuery(".myStickyelements-country-list-box").addClass("active");
	                $('.myStickyelements-country-list.is-pro').select2('open');
	            } else {
	                jQuery(".myStickyelements-country-list-box").removeClass("active");
	            }
	        });

	        $('.myStickyelements-country-list.is-pro').on('select2:close', function (e) {
                jQuery(".myStickyelements-country-list-box").removeClass("active");
            });

            $('.myStickyelements-country-list.is-pro').on('select2:select', function (e) {
                var countryCount = parseInt($('.myStickyelements-country-list.is-pro option:selected').length);
                if(countryCount == 0) {
                    $(".myStickyelements-country-button").text("All countries");
                } else if(countryCount == 1) {
                    $(".myStickyelements-country-button").text("1 country selected");
                } else {
                    $(".myStickyelements-country-button").text(countryCount+" countries selected");
                }
            });

            $('.myStickyelements-country-list.is-pro').on('select2:unselect', function (e) {
                var countryCount = parseInt($('.myStickyelements-country-list.is-pro option:selected').length);
                if(countryCount == 0) {
                    $(".myStickyelements-country-button").text("All countries");
                } else if(countryCount == 1) {
                    $(".myStickyelements-country-button").text("1 country selected");
                } else {
                    $(".myStickyelements-country-button").text(countryCount+" countries selected");
                }
            });
        }
		$(document).on('click',function(e){   //try to turn off popup
			var click = $(e.target);
			if (click.hasClass('mystickyelements-popup-form')) {
				click.hide();
			}
		});
		$(document).on( "change", ".social-custom-channel-type" , function(e){
			var csc_name = $(this).val();
			var csc_id 	 = $(this).data('id');
			var csc_slug 	 = $(this).data('slug');
			var csc_option = $('option:selected', this).data('social-channel');

			$('#' + csc_id + ' .social-channel-input-box-section .social-channels-list').addClass('custom-channel-type-list');
			$('#' + csc_id + ' .social-channel-input-box-section .social-channels-list').removeClass (function (index, className) {
				return (className.match (/(^|\s)social-\S+/g) || []).join(' ');
			});
			$('#' + csc_id + ' .social-channel-input-box-section .custom-channel-type-list').addClass('social-channels-list');
			$('#' + csc_id + ' .social-channel-input-box-section .custom-channel-type-list').addClass(csc_slug);
			$('#' + csc_id + ' .social-channel-input-box-section .social-channels-list').addClass('social-'+ csc_name);
			
			$('#' + csc_id + ' .social-channel-input-box-section .social-channels-list').css( 'background', csc_option.background_color);
			$('.mystickyelements-social-icon.' + csc_slug ).css('background', csc_option.background_color );
			$('.mystickyelements-social-icon.' + csc_slug +' i').removeClass();
			$('.mystickyelements-social-icon.' + csc_slug +' i').addClass(csc_option.class);
			$('.mystickyelements-social-icon.' + csc_slug ).addClass('social-'+ csc_name);

			$('#' + csc_id + ' .social-channel-input-box-section .social-channels-list i').removeClass();
			$('#' + csc_id + ' .social-channel-input-box-section .social-channels-list i').addClass(csc_option.class);


			$('#' + csc_id + ' .social-channel-input-box-section .social-channels-list .social-tooltip-popup').text(csc_option.hover_text);

			$('#' + csc_id + ' .social-channel-input-box-section input[type="text"]').attr('placeholder',csc_option.placeholder);

			$('#' + csc_id + ' .social-channel-setting .myStickyelements-on-hover-text input[type="text"]').val(csc_option.hover_text);
			$('#' + csc_id + ' .social-channel-setting .myStickyelements-background-color input[type="text"].mystickyelement-color.wp-color-picker').val(csc_option.background_color);

			$('#' + csc_id + ' .social-channel-setting .myStickyelements-background-color .button.wp-color-result').css('background-color',csc_option.background_color);

			/* Hide*/
			if ( csc_name == 'custom' ) {
				//$('#' + csc_id + ' .social-channel-setting .myStickyelements-custom-tab').show();
				$('#' + csc_id + ' .myStickyelements-custom-icon-image').show();
			} else {
				//$('#' + csc_id + ' .social-channel-setting .myStickyelements-custom-tab').hide();
				$('#' + csc_id + ' .myStickyelements-custom-icon-image').hide();
			}

			if (csc_option.is_pre_set_message == 1) {
				$('#' + csc_id + ' .social-channel-setting .myStickyelements-custom-pre-message').show();
			} else {
				$('#' + csc_id + ' .social-channel-setting .myStickyelements-custom-pre-message').hide();
			}

		});

		$( '.mystickyelements-turnit-on' ).on( 'click', function () {
			var mystickyelements_turnit = $( this ).data( 'turnit' );
			$( '#' + mystickyelements_turnit ).trigger( 'click' );
		});
		
		$( '#success-popup-overlay' ).on( 'click', function(){
			
			var url = $(this).data('id');
			$( '.stickyelement-action-popup-open' ).hide();
			$( this ).hide();
			location.href = url
		});
	});
	$( window ).on('load',function () {

	    $( '.myStickyelements-url-options' ).each( function(){
	        $( this ).trigger( 'change' );
	    })
		$('.more-setting-rows').css('display','none');
		$('#submit').css('display','none');
		
		var widget_status = $('.mystickyelements-preivew-below-sec').data('id');
		if(widget_status == 'my-sticky-elements-new-widget'){
			$('.preview-publish').hide();
			$('#save_view').hide();
			$('.save-button').hide();
		}
		else{
			$('.preview-publish').html( 'Save' );
			$('.preview-publish').val('Save');
		}
	});
	
	function check_for_preview_pos() {
		var tab_pos_top = $( '.mystickyelements-tabs-wrap' ).offset().top;
		if( jQuery(window).scrollTop() > 80 ) {
			jQuery(".myStickyelements-preview-tab").css("top", "120px");
			jQuery( '.mystickyelements-tabs' ).addClass( 'mystickyelements-tab-sticky' );
			var tab_height = jQuery( '.mystickyelements-tabs' ).outerHeight( true );
			jQuery( '.mystickyelements-form' ).css( 'padding-top', tab_height );
			jQuery( '.mystickyelements-tabs span.mystickyelements-tabs-subheading' ).hide();
		} else {
			jQuery(".myStickyelements-preview-tab").css("top", tab_pos_top + "px");
			jQuery( '.mystickyelements-tabs' ).removeClass( 'mystickyelements-tab-sticky' );
			jQuery( '.mystickyelements-form' ).css( 'padding-top', '' );
			jQuery( '.mystickyelements-tabs span.mystickyelements-tabs-subheading' ).show();
		}

		if(jQuery(".show-on-apper").length && jQuery(".myStickyelements-preview-tab").length && jQuery( '#mystickyelements-display-settings' ).hasClass( 'active' )) {
			var widget_title = 0;
			if ( jQuery('.myStickyelements-widget-title').length){
				widget_title = jQuery(".show-on-apper").outerHeight() + 10;
			}

			var topPos = jQuery(".show-on-apper").offset().top - jQuery(window).scrollTop() - 700;
			if (topPos < 0 && $( ".myStickyelements-page-option" ).length) {
				topPos = Math.abs(topPos);
				var finalpos = $( '.mystickyelements-wrap' ).position().top + topPos;
				jQuery(".myStickyelements-preview-tab").css("margin-top", ((-1)*finalpos)+"px");
			} else {
				jQuery(".myStickyelements-preview-tab").css("margin-top", "0");
			}
		} else {
			jQuery(".myStickyelements-preview-tab").css("margin-top", "0");
		}
		if(jQuery(".show-on-apper-main").length && ! $( ".myStickyelements-page-option" ).length) {
			var widget_title = 0;
			if ( jQuery('.myStickyelements-widget-title').length){
				widget_title = jQuery(".show-on-apper-main").outerHeight() + 10;
			}

			var topPos = jQuery(".show-on-apper-main").offset().top - jQuery(window).scrollTop() - 700;
			if (topPos < 0) {
				topPos = Math.abs(topPos);
				var finalpos = $( '.mystickyelements-wrap' ).position().top + topPos;
				jQuery(".myStickyelements-preview-tab").css("margin-top", ((-1)*finalpos)+"px");
			} else {
				jQuery(".myStickyelements-preview-tab").css("margin-top", "0");
			}
		}
	}

	function social_icon_live_preview_color_css() {
		$('.myStickyelements-preview-ul li.mystickyelements-social-preview').each( function () {
			var current_icon_color = $(this).find('span.mystickyelements-social-icon').get(0).style.backgroundColor;
			var all_icon_class = this.className;
			var current_icon_class = all_icon_class.split(' ');

			var preview_css = '.myStickyelements-preview-screen:not(.myStickyelements-preview-mobile-screen) .mystickyelements-templates-diamond li:not(.mystickyelements-contact-form).'+ current_icon_class[0] +' span.mystickyelements-social-icon::before{background: '+ current_icon_color +'}';
			var preview_css = preview_css + '.myStickyelements-preview-screen.myStickyelements-preview-mobile-screen .mystickyelements-templates-diamond li:not(.mystickyelements-contact-form).'+ current_icon_class[0] +' span.mystickyelements-social-icon::before{background: '+ current_icon_color +'}';
			var preview_css = preview_css + '.myStickyelements-preview-mobile-screen .mystickyelements-position-mobile-bottom.mystickyelements-templates-diamond li:not(.mystickyelements-contact-form).'+ current_icon_class[0] +' span.mystickyelements-social-icon{background: '+ current_icon_color +' !important}';
			var preview_css = preview_css + '.myStickyelements-preview-mobile-screen .mystickyelements-position-mobile-top.mystickyelements-templates-diamond li:not(.mystickyelements-contact-form).'+ current_icon_class[0] +' span.mystickyelements-social-icon{background: '+ current_icon_color +' !important}';

			var preview_css = preview_css + '.myStickyelements-preview-screen:not(.myStickyelements-preview-mobile-screen) .mystickyelements-templates-triangle li:not(.mystickyelements-contact-form).'+ current_icon_class[0] +' span.mystickyelements-social-icon::before{background: '+ current_icon_color +'}';
			var preview_css = preview_css + '.myStickyelements-preview-screen.myStickyelements-preview-mobile-screen .mystickyelements-templates-triangle li:not(.mystickyelements-contact-form).'+ current_icon_class[0] +' span.mystickyelements-social-icon::before{background: '+ current_icon_color +'}';
			var preview_css = preview_css + '.myStickyelements-preview-mobile-screen .mystickyelements-position-mobile-bottom.mystickyelements-templates-triangle li:not(.mystickyelements-contact-form).'+ current_icon_class[0] +' span.mystickyelements-social-icon{background: '+ current_icon_color +' !important}';
			var preview_css = preview_css + '.myStickyelements-preview-mobile-screen .mystickyelements-position-mobile-top.mystickyelements-templates-triangle li:not(.mystickyelements-contact-form).'+ current_icon_class[0] +' span.mystickyelements-social-icon{background: '+ current_icon_color +' !important}';

			var preview_css = preview_css + '.myStickyelements-preview-screen:not(.myStickyelements-preview-mobile-screen) .mystickyelements-position-left.mystickyelements-templates-arrow li:not(.mystickyelements-contact-form).'+ current_icon_class[0] +' span.mystickyelements-social-icon::before{border-left-color: '+ current_icon_color +'}';
			var preview_css = preview_css + '.myStickyelements-preview-screen:not(.myStickyelements-preview-mobile-screen) .mystickyelements-position-right.mystickyelements-templates-arrow li:not(.mystickyelements-contact-form).'+ current_icon_class[0] +' span.mystickyelements-social-icon::before{border-right-color: '+ current_icon_color +'}';
			var preview_css = preview_css + '.myStickyelements-preview-screen:not(.myStickyelements-preview-mobile-screen) .mystickyelements-position-bottom.mystickyelements-templates-arrow li:not(.mystickyelements-contact-form).'+ current_icon_class[0] +' span.mystickyelements-social-icon::before{border-bottom-color: '+ current_icon_color +'}';

			var preview_css = preview_css + '.myStickyelements-preview-screen.myStickyelements-preview-mobile-screen .mystickyelements-position-mobile-left.mystickyelements-templates-arrow li:not(.mystickyelements-contact-form).'+ current_icon_class[0] +' span.mystickyelements-social-icon::before{border-left-color: '+ current_icon_color +'}';
			var preview_css = preview_css + '.myStickyelements-preview-screen.myStickyelements-preview-mobile-screen .mystickyelements-position-mobile-right.mystickyelements-templates-arrow li:not(.mystickyelements-contact-form).'+ current_icon_class[0] +' span.mystickyelements-social-icon::before{border-right-color: '+ current_icon_color +'}';

			if ( current_icon_class[0] == 'insagram' ) {
				var preview_css = preview_css + '.myStickyelements-preview-screen:not(.myStickyelements-preview-mobile-screen) .mystickyelements-templates-arrow li:not(.mystickyelements-contact-form).'+ current_icon_class[0] +' span.mystickyelements-social-icon::before{background: '+ current_icon_color +'}';
				var preview_css = preview_css + '.myStickyelements-preview-screen.myStickyelements-preview-mobile-screen .mystickyelements-templates-arrow li:not(.mystickyelements-contact-form).'+ current_icon_class[0] +' span.mystickyelements-social-icon::before{background: '+ current_icon_color +'}';
			}
			$('head').append('<style type="text/css"> '+ preview_css +' </style>');
		});
	}

	/* Date: 2019-07-26 */
	var location_href = window.location.href;
	if ( window.location.href.indexOf('page=my-sticky-elements&widget=') > -1 ) {
		$( '#toplevel_page_my-sticky-elements .wp-submenu.wp-submenu-wrap li').each(function(){
			var element_href  =  $(this).find('a').attr( 'href' );
			if ( typeof element_href !== 'undefined' ) {
				$(this).removeClass('current');
				if ( window.location.href.indexOf(element_href) > -1 && element_href.indexOf( '&widget=' ) > -1 ) {
					$(this).addClass('current');
				}
			}
		});
	}

	$(".mystickyelement-delete").on( 'click', function() {
		return window.confirm("Are you sure you want to delete this widget?");
	});
	/* END Date: 2019-07-26 */
	
	/*font family Privew*/
	$( '.form-fonts' ).on( 'change', function(){
		var font_val = $(this).val();
		$( '.sfba-google-font' ).remove();
		$( 'head' ).append( '<link href="https://fonts.googleapis.com/css?family='+ font_val +':400,600,700" rel="stylesheet" type="text/css" class="sfba-google-font">' );
		$( '.myStickyelements-preview-ul .mystickyelements-social-icon' ).css( 'font-family',font_val );
	} );
	function mystickyelements_border_radius(){
		var position_device = '';
		var social_id = '';
		var $i = 0;
		var second_social_id = '';
		var $flg = false;

		if( $(".myStickyelements-preview-screen" ).hasClass( "myStickyelements-preview-mobile-screen" ) ){
			position_device = 'mobile-';
		}
		var $mobile_bottom = 0;
		var $j = 0;
		$('.mystickyelements-fixed ul li').each( function () {
			$('.mystickyelements-position-' + position_device + 'left #' + $(this).attr('id') + ' .mystickyelements-social-icon').css('border-radius','');
			$('.mystickyelements-position-' + position_device + 'right #' + $(this).attr('id') + ' .mystickyelements-social-icon').css('border-radius','');
			$('.mystickyelements-position-' + position_device + 'bottom #' + $(this).attr('id') + ' .mystickyelements-social-icon').css('border-radius','');

			if( $(this).hasClass('element-mobile-on') && $j != 4 ) {
				$(this).addClass('mystickyelements-show-last-element');
				$j++;
			} else {
				$(this).removeClass('mystickyelements-show-last-element');
			}

			/* Check First LI */
			if ( $i == 1 ){
				if ( !$(".myStickyelements-preview-screen" ).hasClass( "myStickyelements-preview-mobile-screen" ) &&  !$(this).hasClass('element-desktop-on')){
					$flg = true;
				}
				if ( $(".myStickyelements-preview-screen" ).hasClass( "myStickyelements-preview-mobile-screen" ) &&  !$(this).hasClass('element-mobile-on')){
					$flg = true;
				}
			}
			if( $(".myStickyelements-preview-screen" ).hasClass( "myStickyelements-preview-mobile-screen" ) ) {
				second_social_id == '';
			}
			if( second_social_id == '' ) {
				//if ( $i == 1 && $flg === true) {
				if ( $flg === true ) {
					if ( !$(".myStickyelements-preview-screen" ).hasClass( "myStickyelements-preview-mobile-screen" ) && $(this).hasClass('element-desktop-on') ){
						second_social_id = $(this).attr('id');
					}
					if ( $(".myStickyelements-preview-screen" ).hasClass( "myStickyelements-preview-mobile-screen" ) && $(this).hasClass('element-mobile-on') ){
						second_social_id = $(this).attr('id');
					}
				}
			}
			if ( !$(".myStickyelements-preview-screen" ).hasClass( "myStickyelements-preview-mobile-screen" ) &&  $(this).hasClass('element-desktop-on')){
				social_id = $(this).attr('id');
			}
			if ( $(".myStickyelements-preview-screen" ).hasClass( "myStickyelements-preview-mobile-screen" ) &&  $(this).hasClass('element-mobile-on')){
				social_id = $(this).attr('id');
				$mobile_bottom++;
			}
			$i++;
		});
		$(".myStickyelements-preview-tab .mystickyelements-fixed").removeClass (function (index, className) {
			return (className.match (/(^|\s)mystickyelements-bottom-social-channel-\S+/g) || []).join(' ');
		});
		$(".myStickyelements-preview-tab .mystickyelements-fixed").removeClass (function (index, className) {
			return (className.match (/(^|\s)mystickyelements-top-social-channel-\S+/g) || []).join(' ');
		});
		$( '.mystickyelements-fixed.mystickyelements-position-mobile-bottom').addClass( 'mystickyelements-bottom-social-channel-' + $mobile_bottom );
		$( '.mystickyelements-fixed.mystickyelements-position-mobile-top').addClass( 'mystickyelements-top-social-channel-' + $mobile_bottom );
		if ( social_id != ''  ) {
			$('.mystickyelements-fixed').show();
			if ( social_id === 'myStickyelements-preview-contact' ){
				$('.mystickyelements-position-' + position_device + 'left #' + social_id + ' .mystickyelements-social-icon').css('border-bottom-left-radius', '10px' );
				$('.mystickyelements-position-' + position_device + 'right #' + social_id + ' .mystickyelements-social-icon').css('border-top-left-radius', '10px' );
				$('.mystickyelements-position-' + position_device + 'bottom #' + social_id + ' .mystickyelements-social-icon').css('border-top-right-radius', '10px' );

				if( $( 'li.mystickyelements-minimize' ).length !== 1 ){
					$('.mystickyelements-position-' + position_device + 'left #' + social_id + ' .mystickyelements-social-icon').css('border-bottom-right-radius', '10px' );
					$('.mystickyelements-position-' + position_device + 'right #' + social_id + ' .mystickyelements-social-icon').css('border-top-right-radius', '10px' );
				}
			} else if ( social_id !== 'myStickyelements-preview-contact') {
				if ( $i=== 1 ) {
					$('.mystickyelements-position-' + position_device + 'left #' + social_id + ' .mystickyelements-social-icon').css('border-radius', '0 10px 10px 0' );
					$('.mystickyelements-position' + position_device + '-right #' + social_id + ' .mystickyelements-social-icon').css('border-radius', '10px 0 0 10px' );
				} else {
					$('.mystickyelements-position-' + position_device + 'left #' + social_id + ' .mystickyelements-social-icon').css( 'border-bottom-right-radius', '10px' );
					$('.mystickyelements-position-' + position_device + 'right #' + social_id + ' .mystickyelements-social-icon').css( 'border-bottom-left-radius', '10px' );
					$('.mystickyelements-position-' + position_device + 'bottom #' + social_id + ' .mystickyelements-social-icon').css( 'border-top-right-radius', '10px' );
				}
			}
		} else {
			$('.mystickyelement-credit').hide();
			$('.mystickyelements-fixed').hide();
		}
		if ( second_social_id != '' && second_social_id !== 'myStickyelements-preview-contact' && $( 'li.mystickyelements-minimize' ).length !== 1  ) {
			$('.mystickyelements-position-' + position_device + 'left #' + second_social_id + ' .mystickyelements-social-icon').css('border-top-right-radius', '10px' );
			$('.mystickyelements-position-' + position_device + 'right #' + second_social_id + ' .mystickyelements-social-icon').css('border-top-left-radius', '10px' );
			$('.mystickyelements-position-' + position_device + 'bottom #' + second_social_id + ' .mystickyelements-social-icon').css('border-top-left-radius', '10px' );
		}
	}

	function mystickyelements_page_rule_width() {
		var dir = $("html").attr("dir");
		var window_width = $( window ).width();
		if (dir === 'rtl') {				
			//var show_right_pos = $( '.myStickyelements-show-on-right' ).offset().left;
			
			var adminmenuwrap = $( '#adminmenuwrap' ).width();
			var more_setting_rows_width = ( $( '.more-setting-rows' ).width() - $( '.myStickyelements-show-on-right' ).width() );
			var remain_width = window_width - more_setting_rows_width - adminmenuwrap - 60;
			$( '.myStickyelements-page-options' ).width( remain_width );	
		
		} else {
			var show_right_pos = $( '.myStickyelements-show-on-right' ).offset().left;
			var remain_width = window_width - show_right_pos - 20;
			$( '.myStickyelements-page-options' ).width( remain_width );	
		}
	}
	
	
	/* mysticky tab click */
		
	$(document).ready(function(){
		
		jQuery( '#mystickyelements-contact-form,#mystickyelements-social-media, #mystickyelements-display-settings' ).on( 'click', function(e) {
			e.preventDefault();
			var curent_tab = $('.mystickyelements-tab.active').data( 'tab-id');
			var next_tab = $(this).data( 'tab-id');
			var widget_status = $('.mystickyelements-preivew-below-sec').data('id');
			
//			if( next_tab == 'mystickyelements-tab-social-media' )
//			 	$('#hide_tab_index').val('mystickyelements-social-media');  	
//			else if( next_tab == 'mystickyelements-tab-display-settings' )
//				$('#hide_tab_index').val('mystickyelements-display-settings');  			
//			else
//				$('#hide_tab_index').val('mystickyelements-contact-form');  			
			
			
									  
			if ( curent_tab == next_tab) {
				return false;
			}
			
			if( widget_status == 'my-sticky-elements-new-widget' && next_tab=='mystickyelements-tab-display-settings' ){
				if ( $( '#myStickyelements-social-channels-enabled' ).prop("checked") == true ) {
					var is_links_empty = 0;
					jQuery('.mystickyelement-social-links-input').each(function(index, value) {
						if( jQuery(this).val() == '' ){
							is_links_empty = 1;
							return;	
						}
					});
					if( is_links_empty == 1 && jQuery(this).data("tab-triger") != "yes"){
						jQuery('.mystickyelements-missing-link-popup, #mystickyelement-missing-link-overlay').show();
						jQuery('.mystickyelement-dolater-widget-btn').attr('data-popupfrom', 'tab_button');
						return false;	
					}
				}
				
				$('#btn-next').hide();
				$('#next-button-prev').hide();
				$('#submit').show();
				$('.preview-publish').show();
				$('.preview-publish').html( 'Publish' );
				$('.preview-publish').val('Publish');
				$('#save_view').show();
				$('.save-button').show();
				$( '#mystickyelements-contact-form').addClass('completed');
				$( '#mystickyelements-social-media').addClass('completed');
			}
			else if( widget_status == 'my-sticky-elements-new-widget' &&  next_tab!='mystickyelements-tab-display-settings' ){

				$('#btn-next').show();
				$('#next-button-prev').show();
				$('#submit').hide();
				$('.preview-publish').hide();
				$('.preview-publish').html( 'Save' );
				$('.preview-publish').val('Save');
				$('#save_view').hide();
				$('.save-button').hide();
				if( next_tab=='mystickyelements-tab-social-media' ) {
					$( '#mystickyelements-contact-form').addClass('completed');
					$( '#mystickyelements-social-media').removeClass('completed');
				} else if( next_tab=='mystickyelements-tab-contact-form' ) {
					$( '#mystickyelements-contact-form').removeClass('completed');
					$( '#mystickyelements-social-media').removeClass('completed');
				}
			}
			else if( widget_status=='' && next_tab == 'mystickyelements-tab-display-settings' ){
				if ( $( '#myStickyelements-social-channels-enabled' ).prop("checked") == true ) {
					var is_links_empty = 0;
					jQuery('.mystickyelement-social-links-input').each(function(index, value) {
						if( jQuery(this).val() == '' ){
							
							is_links_empty = 1;
							return;	
						}
					});
					if( is_links_empty == 1 && jQuery(this).data("tab-triger") != "yes"){
						jQuery('.mystickyelements-missing-link-popup, #mystickyelement-missing-link-overlay').show();
						jQuery('.mystickyelement-dolater-widget-btn').attr('data-popupfrom', 'tab_button');
						return false;	
					}
				}
				
	
				$('#btn-next').hide();
				$('#next-button-prev').hide();
				$('#submit').show();
				$('.preview-publish').show();
				$('.preview-publish').html( 'Publish' );
				$('.preview-publish').val('Publish');
				$('#save_view').show();
				$('.save-button').show();
				$( '#mystickyelements-contact-form').addClass('completed');
				$( '#mystickyelements-social-media').addClass('completed');
			}
			else{
				$('#btn-next').show();
				$('#next-button-prev').show();
				$('#submit').hide();
				$('.preview-publish').show();
				$('.preview-publish').html( 'Save' );
				$('.preview-publish').val('Save');
				$('#save_view').show();
				$('.save-button').show();
				if( next_tab=='mystickyelements-tab-social-media' ) {
					$( '#mystickyelements-contact-form').addClass('completed');
					$( '#mystickyelements-social-media').removeClass('completed');
				} else if( next_tab=='mystickyelements-tab-contact-form' ) {
					$( '#mystickyelements-contact-form').removeClass('completed');
					$( '#mystickyelements-social-media').removeClass('completed');
				}
			}
			
			
			/*if(next_tab=='mystickyelements-tab-display-settings'){
				$('#btn-next').hide();
				$('#next-button-prev').hide();
				$('#submit').show();
			}
			else{
				$('#btn-next').show();
				$('#next-button-prev').show();
				$('#submit').hide();
			}*/

			if( next_tab=='mystickyelements-tab-contact-form' ){
				$('#btn-prev').hide();
			}
			else{
				$('#btn-prev').show();
			}
			
			$( '.mystickyelements-tab').removeClass( 'active');
			$(this).addClass('active');
			$( '#' + next_tab).show();
			$( '#' + curent_tab).hide();

			if( next_tab=='mystickyelements-tab-display-settings' ){
				mystickyelements_page_rule_width();
			}
		});
		mystickyelements_disable_section( 'mystickyelements-tab-contact-form', 'myStickyelements-contact-form-enabled' );

		
		if( $('#mystickyelements-contact-form').data('tab-index') == 'mystickyelements-contact-form' ){
			$( '#mystickyelements-contact-form' ).trigger( 'click');
		}
		else if($('#mystickyelements-social-media').data('tab-index') == 'mystickyelements-social-media' ){
			$( '#mystickyelements-social-media' ).trigger( 'click');
		}
		else{
			jQuery('#mystickyelements-display-settings').attr('data-tab-triger','yes');
			$( '#mystickyelements-display-settings' ).trigger( 'click');	
		}
		
		
		$('#btn-more').on('click',function(event){
			event.preventDefault();
			$('.more-setting-rows').slideDown();	
			$('#btn-less').show();
			$(this).hide();
		});
		
		$('#btn-less').on('click',function(event){
			event.preventDefault();
			$('.more-setting-rows').hide();	
			$('#btn-more').show();
			$(this).hide();
		});

		$( '#btn-prev' ).on( 'click' , function( event ){
			
			event.preventDefault();
			var curent_tab = $( '.mystickyelements-tab.active' ).data( 'tab-id');
			var next_tab = '';
			var widget_status = $('.mystickyelements-preivew-below-sec').data('id');
			
			$( '.mystickyelements-tab' ).removeClass( 'active' );
			if( curent_tab == 'mystickyelements-tab-display-settings' ){
			 	next_tab = 'mystickyelements-tab-social-media';
				$( '#mystickyelements-social-media' ).addClass( 'active' );
				$( '#mystickyelements-social-media').removeClass('completed');
				$( '#submit').hide();
				$( this ).show();
				$( '#next-button-prev' ).show();
				$( '#btn-next' ).show();
				$('.preview-publish').html( 'Save' );
				$('.preview-publish').val('Save');
				
			}
			else if(curent_tab == 'mystickyelements-tab-social-media'){
				next_tab = 'mystickyelements-tab-contact-form';
				$( '#mystickyelements-contact-form').addClass('active');
				$( '#mystickyelements-contact-form').removeClass('completed');
				$('.preview-publish').html( 'Save' );
				$('.preview-publish').val('Save');
				$(this).hide();
			}
			
			if( widget_status == 'my-sticky-elements-new-widget' && curent_tab == 'mystickyelements-tab-display-settings' ){
				$('.preview-publish').hide();
				$('#save_view').hide();
				$('.save-button').hide();
			}
			else if( widget_status == 'my-sticky-elements-new-widget' && curent_tab == 'mystickyelements-tab-social-media' ){
				$('.preview-publish').hide();
				$('#save_view').hide();
				$('.save-button').hide();
			}
			
			if ( curent_tab == next_tab) {
				return false;
			}
			
			$( '#' + next_tab).show();
			$( '#' + curent_tab).hide();
			
			$("html, body").animate({ scrollTop: 0 }, "slow");
		});
		
		$( '#btn-next' ).on( 'click' , function(event){
			
			event.preventDefault();
			var curent_tab = $('.mystickyelements-tab.active').data( 'tab-id');
			var next_tab = '';
			var widget_status = $('.mystickyelements-preivew-below-sec').data('id');
			$( '.mystickyelements-tab').removeClass( 'active');
			
			if(curent_tab == 'mystickyelements-tab-contact-form'){
			 	next_tab = 'mystickyelements-tab-social-media';
				$( '#mystickyelements-social-media').addClass('active');
				$( '#mystickyelements-contact-form').addClass('completed');
				$('#submit').hide();
				$(this).show();
				$('#next-button-prev').show();
				$('.preview-publish').html( 'Save' );
				$('.preview-publish').val('Save');
				$( '#btn-prev' ).show();
				$('.preview-publish').show();
				$('#save_view').show();
				$('.save-button').show();
				
				if( widget_status == 'my-sticky-elements-new-widget' ){
					$('.preview-publish').hide();
					$('#save_view').hide();
					$('.save-button').hide();
				}
			}
			else if(curent_tab == 'mystickyelements-tab-social-media'){
				if ( $( '#myStickyelements-social-channels-enabled' ).prop("checked") == true ) {
					var is_links_empty = 0;
					jQuery('.mystickyelement-social-links-input').each(function(index, value) {
						if( jQuery(this).val() == '' ){
							is_links_empty = 1;
							return;	
						}
					});
				}
				if( is_links_empty == 1 && jQuery(this).data("tab-triger") != "yes" ){
					jQuery('.mystickyelement-dolater-widget-btn').attr('data-popupfrom', 'next_button');
					if ( $( '#myStickyelements-social-channels-enabled' ).prop("checked") == true ) {
						jQuery('.mystickyelements-missing-link-popup, #mystickyelement-missing-link-overlay').show();
					}
					$( '#mystickyelements-social-media').addClass('active');
					$( '#mystickyelements-contact-form').addClass('completed');
					return false;
				}
				else{
					next_tab = 'mystickyelements-tab-display-settings';
					$( '#mystickyelements-display-settings').addClass('active');
					$( '#mystickyelements-contact-form').addClass('completed');
					$( '#mystickyelements-social-media').addClass('completed');
					$(this).hide();
					$('#next-button-prev').hide();
					$('#submit').show();
					$('.preview-publish').show();
					$('.preview-publish').html( 'Publish' );
					$('.preview-publish').val('Publish');
					$('#save_view').show();
					$('.save-button').show();
				}
			}
			
			if ( curent_tab == next_tab) {
				return false;
			}
			
			$( '#' + next_tab).show();
			$( '#' + curent_tab).hide();
			
			$("html, body").animate({ scrollTop: 0 }, "slow");

			if( next_tab=='mystickyelements-tab-display-settings' ){
				mystickyelements_page_rule_width();
			}
		});
		
		$('#next-button-prev').on('click',function(event){
			event.preventDefault();
			var curent_tab = $('.mystickyelements-tab.active').data( 'tab-id');
			var widget_status = $('.mystickyelements-preivew-below-sec').data('id');
			var next_tab = '';
			
			$( '.mystickyelements-tab').removeClass( 'active');
			if(curent_tab == 'mystickyelements-tab-contact-form'){
			 	next_tab = 'mystickyelements-tab-social-media';
				$( '#mystickyelements-social-media').addClass('active');
				$( '#mystickyelements-contact-form').addClass('completed');
				$('#submit').hide();
				$(this).show();
				$( '#btn-prev' ).show();
				$('.preview-publish').show();
				$('.preview-publish').html( 'Save' );
				$('.preview-publish').val('Save');
				$('#save_view').show();
				$('.save-button').show();
				
				if( widget_status == 'my-sticky-elements-new-widget' && next_tab == 'mystickyelements-tab-social-media' ){
					$('.preview-publish').hide();
					$('#save_view').hide();
					$('.save-button').hide();
				}
			}
			else if(curent_tab == 'mystickyelements-tab-social-media'){
				if ( $( '#myStickyelements-social-channels-enabled' ).prop("checked") == true ) {
					var is_links_empty = 0;
					jQuery('.mystickyelement-social-links-input').each(function(index, value) {
						if( jQuery(this).val() == '' ){
							is_links_empty = 1;
							return;	
						}
					});
				}
				if( is_links_empty == 1 && jQuery(this).data("tab-triger") != "yes" ){
					jQuery('.mystickyelement-dolater-widget-btn').attr('data-popupfrom', 'next_preview_button');
					if ( $( '#myStickyelements-social-channels-enabled' ).prop("checked") == true ) {
						jQuery('.mystickyelements-missing-link-popup, #mystickyelement-missing-link-overlay').show();
					}
					$( '#mystickyelements-social-media').addClass('active');
					$( '#mystickyelements-contact-form').addClass('completed');
					return false;
				}
				else{
					next_tab = 'mystickyelements-tab-display-settings';
					$( '#mystickyelements-display-settings').addClass('active');
					$( '#mystickyelements-contact-form').addClass('completed');
					$( '#mystickyelements-social-media').addClass('completed');
					$(this).hide();
					$('#btn-next').hide();
					$('#submit').show();
					$('.preview-publish').show();
					$('.preview-publish').html( 'Publish' );
					$('.preview-publish').val('Publish');
					$('#save_view').show();
					$('.save-button').show();
				}
			}
			
			if ( curent_tab == next_tab) {
				return false;
			}
			
			$( '#' + next_tab).show();
			$( '#' + curent_tab).hide();
			
			$("html, body").animate({ scrollTop: 0 }, "slow");

			if( next_tab=='mystickyelements-tab-display-settings' ){
				mystickyelements_page_rule_width();
			}
			
		});
		
		$( '.dropdown-field-setting' ).on("click",function(){
			$('.contact-form-field-open.contact-form-setting-popup-open').css('display','block');
		});
		
		if ( $(".settings-save-toast").length !== 0) {
			setTimeout(function() { 
				$(".settings-save-toast").hide(); 
			}, 5000);				
		}
	});
	

	function mystickyelements_disable_section( parent_class, enable_class ){
		if ( $( '#' + enable_class ).prop("checked") != true ) {
			$( '#' + parent_class + ' .mystickyelements-disable-wrap' ).addClass( 'mystickyelements-disable' );
			$( '#' + parent_class + ' .mystickyelements-disable .myStickyelements-social-channels-info' ).hide();
			$( '#' + parent_class + ' .mystickyelements-disable-content-wrap' ).show();
		} else {
			$( '#' + parent_class + ' .mystickyelements-disable-wrap' ).removeClass( 'mystickyelements-disable' );
			$( '#' + parent_class + ' .mystickyelements-disable-wrap .myStickyelements-social-channels-info' ).show();
			$( '#' + parent_class + ' .mystickyelements-disable-content-wrap' ).hide();
		}
	}
	
	/**  Mailchimp and mailpoet jquery  * */
	$(document).ready(function(){
		if ( $('input#send_leads_mailchimp').prop('checked') == true ) {
			$('#contact-form-mailchimp').show();
		} else {
			$('#contact-form-mailchimp').hide();
		}
		$( 'input#send_leads_mailchimp' ).on( 'click', function(){
			if( $(this).prop("checked") == true ){
				$('#contact-form-mailchimp').show();
			} else {
				$('#contact-form-mailchimp').hide();
			}
		});
		
		$(document).on( "change", "#mailchimp-enable-tag" , function(e){
			if( $(this).prop('checked') === true ) {
				$('.myStickyelements-mailchimp-tags-info').show();
			} else {
				$('.myStickyelements-mailchimp-tags-info').hide();
			}
		});
		
		$(document).on( "change", "#mailchimp-enable-group" , function(e){
			if( $(this).prop('checked') === true ) {
				$('.mailchimp-group-info').show();
			} else {
				$('.mailchimp-group-info').hide();
			}
		});
		
		$(document).on( "change", "#stickyelement_mailchimp_lists" , function(e){
			
			var widget_no = $('#mystickyelements-no-widget').val();
			if ( typeof widget_no == 'undefined' ) {
				widget_no = '';
			}
			$('.myStickyelements-mailchimp-groups ').show();
			
			jQuery.ajax({
				url: ajaxurl,
				type:'post',
				data: 'action=mystickyelement-mailchimp-field&widget_no='+widget_no+'&list_id=' + $( this ).val() +'&wpnonce=' + mystickyelements.ajax_nonce,
				success: function( data ){					
					if ( data != '' ) {
						$( '.myStickyelements-mailchimp-field-mapping' ).show();
						$('.myStickyelements-mailchimp-field-lists').html(data);
					} else {
						$( '.myStickyelements-mailchimp-field-mapping' ).hide();
					}
				},
			});
			
			jQuery.ajax({
				url: ajaxurl,
				type:'post',
				data: 'action=mystickyelement-mailchimp-group&widget_no='+widget_no+'&list_id=' + $( this ).val() +'&wpnonce=' + mystickyelements.ajax_nonce,
				success: function( data ){					
					$('.myStickyelements-mailchimp-groups #mailchimp-group').html(data);
				},
			});
		});
		
		if ( $('input#send_leads_mailpoet').prop('checked') == true ) {
			$('#contact-form-MailPoet').show();
		} else {
			$('#contact-form-MailPoet').hide();
		}
		
		$( 'input#send_leads_mailpoet' ).on( 'click', function(){
			if( $(this).prop("checked") == true ){
				$('#contact-form-MailPoet').show();
			} else {
				$('#contact-form-MailPoet').hide();
			}
		});	
		
		$('.stickyelement-action-popup').on('click',function(){
			var key_id =  $(this).data("id") 
			$('#stickyelement-action-popup-'+key_id).show();
			$('#mystickyelement-action-popup-overlay-'+key_id).show();
		});
		
		$(document).on( "click", ".mystickyelement-widgets-lists-enabled" , function(e){
			var widget_id = $(this).data('id');
			if( $(this).prop("checked") != true ){
				$('#widget-status-popup-' + widget_id).show();
				$('#mystickyelement-status-popup-overlay-' + widget_id).show();
				
			}
			else
			{
				var widget_status = 1;
				set_widget_status( widget_id, widget_status );
			}
		});
		$(document).on('click','.mystickyelement-delete-widget',function(){
			var widget_id = $(this).data('id');
			var popup_id = '#stickyelement-action-popup-' + widget_id;
			var hiden_wid_id = '#dashboard_widget_id_' + widget_id;
			$(hiden_wid_id).val(widget_id);
			$(popup_id).show();
			$('#mystickyelement-action-popup-overlay-'+widget_id).show();
		});
		
		$(document).on('click','.btn-cancel',function(){
			console.log('cliccllclc');
			var widget_id = $(this).data('id');
			var popup_id = '#stickyelement-action-popup-' + widget_id;
			$(popup_id).hide();
			$('#mystickyelement-action-popup-overlay-'+widget_id).hide();
		});
		
		$(document).on( "click", ".mystickyelement-delete-widget-btn" , function(e){
			e.preventDefault();
			var widget_id = $(this).data('id');
			
			jQuery.ajax({
				url: ajaxurl,
				type:'post',
				data: 'action=mystickyelement_widget_delete&widget_id='+widget_id+'&widget_delete=1&wpnonce=' + mystickyelements.ajax_nonce,
				success: function( data ){					
					$( '#stickyelement-widget-' + widget_id ).remove();
					setTimeout('location.reload()', 500);
				},
			});
		});

		$(document).on( 'click', '.btn-disable-cancel' , function(e){
			var widget_id = $(this).data('id');
			var widget_status = 0;
			
			set_widget_status( widget_id, widget_status );
		} );
		   
		$(document).on( 'click', '.mystickyelement-keep-widget-btn' , function() {
			var widget_id = $(this).data('id');
			console.log("widget_id="+widget_id);
			var widget_status = 1;
			//$('.mystickyelement-widgets-lists-enabled').prop('checked', true);
			$('#mystickyelement-widget-enabled-'+widget_id).prop('checked', true);
			set_widget_status( widget_id, widget_status );
		});
		
		$(document).on('click','.close-dialog',function(){
			
			var widget_id = $(this).data('id');
			var popup_from = $(this).data('from');
			
			if( popup_from == 'widget-status' ){
				var widget_status = 1;
				$('#mystickyelement-widget-enabled-'+widget_id).prop('checked', true);
				set_widget_status( widget_id, widget_status );
			}
			else if( popup_from == "widget-rename" ){
				$('#stickyelement-widget-rename-popup-' + widget_id).hide();
				$('#mystickyelement-rename-popup-overlay-' + widget_id).hide();	
			}
			else if( popup_from == 'widget-social-link'){
				$('.mystickyelements-missing-link-popup').hide();
				$('#mystickyelement-missing-link-overlay').hide();	
			}
			else{
				
				$('#stickyelement-action-popup-' + widget_id).hide();
				$('#mystickyelement-action-popup-overlay-' + widget_id).hide();
			   
			}

			if( popup_from == 'contact-form' ){
				$(".turn-off-message").css('display','none');
				$(".contact-form-description").css('display','block');
				$( '#myStickyelements-preview-contact' ).show();
				//$( '.myStickyelements-preview-ul' ).removeClass( 'remove-contact-field' );
				$( '.mystickyelements-contact-form' ).removeClass( 'mystickyelements-contact-form-hide' );
				$('#contactform-status-popup').hide();	
				$('#mystickyelement-contact-popup-overlay').hide();

				$('#myStickyelements-contact-form-enabled').prop('checked',true);
				var parent_class = 'mystickyelements-tab-contact-form';
				$( '#' + parent_class + ' .mystickyelements-disable-wrap' ).removeClass( 'mystickyelements-disable' );
				$( '#' + parent_class + ' .mystickyelements-disable-wrap .myStickyelements-social-channels-info' ).show();
				$( '#' + parent_class + ' .mystickyelements-disable-content-wrap' ).hide();
				
			}
			else if( popup_from == 'social-form' ){
				$('.social-disable-info').css('display','none');
				$('.mystickyelements-header-sub-title').css('display','block');

				$('#socialform-status-popup').hide();	
				$('#mystickyelement-social-popup-overlay').hide();
				
				$('#myStickyelements-social-channels-enabled').prop('checked',true);
				var parent_class = 'mystickyelements-tab-social-media';
				$( '#' + parent_class + ' .mystickyelements-disable-wrap' ).removeClass( 'mystickyelements-disable' );
				$( '#' + parent_class + ' .mystickyelements-disable-wrap .myStickyelements-social-channels-info' ).show();
				$( '#' + parent_class + ' .mystickyelements-disable-content-wrap' ).hide();

			}
		});


		$('.button-social-popup-disable').on('click',function(){
			$('.mystickyelements-social-preview').toggle();
			$('#myStickyelements-preview-contact').toggleClass('mystickyelements-contact-last');
			$('.mystickyelements-header-sub-title').css('display','none');
			$('.social-disable-info').css('display','block');
			$(".myStickyelements-preview-tab .mystickyelements-fixed").removeClass (function (index, className) {
				return (className.match (/(^|\s)mystickyelements-bottom-social-channel-\S+/g) || []).join(' ');
			});
			$(".myStickyelements-preview-tab .mystickyelements-fixed").removeClass (function (index, className) {
				return (className.match (/(^|\s)mystickyelements-top-social-channel-\S+/g) || []).join(' ');
			});
			$( '.myStickyelements-preview-tab .mystickyelements-fixed' ).addClass( 'mystickyelements-bottom-social-channel-1' );
			$( '.myStickyelements-preview-tab .mystickyelements-fixed' ).addClass( 'mystickyelements-top-social-channel-1' );
		
			
			$('#socialform-status-popup').hide();	
			$('#mystickyelement-social-popup-overlay').hide();
		});

		$('.button-social-popup-keep').on('click',function(){

			$('.social-disable-info').css('display','none');
			$('.mystickyelements-header-sub-title').css('display','block');

			$('#socialform-status-popup').hide();	
			$('#mystickyelement-social-popup-overlay').hide();
			
			$('#myStickyelements-social-channels-enabled').prop('checked',true);
			var parent_class = 'mystickyelements-tab-social-media';
			$( '#' + parent_class + ' .mystickyelements-disable-wrap' ).removeClass( 'mystickyelements-disable' );
			$( '#' + parent_class + ' .mystickyelements-disable-wrap .myStickyelements-social-channels-info' ).show();
			$( '#' + parent_class + ' .mystickyelements-disable-content-wrap' ).hide();
		});

		$('#mystickyelement-social-popup-overlay').on('click',function(){
			$('.social-disable-info').css('display','none');
			$('.mystickyelements-header-sub-title').css('display','block');

			$('#socialform-status-popup').hide();	
			$('#mystickyelement-social-popup-overlay').hide();
			
			$('#myStickyelements-social-channels-enabled').prop('checked',true);
			var parent_class = 'mystickyelements-tab-social-media';
			$( '#' + parent_class + ' .mystickyelements-disable-wrap' ).removeClass( 'mystickyelements-disable' );
			$( '#' + parent_class + ' .mystickyelements-disable-wrap .myStickyelements-social-channels-info' ).show();
			$( '#' + parent_class + ' .mystickyelements-disable-content-wrap' ).hide();

		});
		
		function set_widget_status( widget_id, widget_status ) {
			jQuery.ajax({
				url: ajaxurl,
				type:'post',
				data: 'action=mystickyelement_widget_status&widget_id='+widget_id+'&widget_status=' + widget_status +'&wpnonce=' + mystickyelements.ajax_nonce,
				success: function( data ){
					$('#widget-status-popup-' + widget_id).hide();
					$('#mystickyelement-status-popup-overlay-' + widget_id).hide();
					
				},
			});
		}
		
		$(document).on('click','.stickyelement-overlay',function(){
			$(this).hide();
			var widget_id = $(this).data('id');
			var widget_from = $(this).data('from');
			
			if( widget_from == 'widget-status' ){
				var widget_status = 1;
				$('#mystickyelement-widget-enabled-'+widget_id).prop('checked', true);
				set_widget_status( widget_id, widget_status );
			}
			$('.mystickyelements-action-popup-open').hide();
		});

		$(document).on('click','.close_flash_popup',function(){        
			$('#flash_message').hide();            
		}); 
	});	
	
	jQuery(document).on('click','.mystickyelemt-rename-widget',function(){
		var id = $(this).data('id');
		$( '#stickyelement-widget-rename-popup-'+id ).show();
		$('#mystickyelement-rename-popup-overlay-' + id).show();
		
	});
	
	jQuery(document).on('click','.mystickyelement-btn-rename',function(e){
		e.preventDefault();
		var widget_id = $(this).data('id');
		var widget_rename_val = $('#widget_rename_'+widget_id).val();
		jQuery.ajax({
			url: ajaxurl,
			type:'post',
			data: 'action=mystickyelement_widget_rename&widget_id='+widget_id+'&widget_rename='+widget_rename_val+'&wpnonce=' + mystickyelements.ajax_nonce,
			success: function( data ){					
				$( '#stickyelement-widget-rename-popup-'+widget_id ).hide();
				$('#mystickyelement-rename-popup-overlay-' + widget_id).hide();
				location.reload();
			},
		});
	});
	
	jQuery(document).on('click','.mystickyelement-cancel-without-color-widget-btn',function(){
		var id = $(this).data('id');
		$( '#stickyelement-widget-rename-popup-'+id ).hide();
		$('#mystickyelement-rename-popup-overlay-' + id).hide();
	});
	
	
	jQuery(document).on('click','.save-button,.btn-dropdown-save',function(e){
		var popup_from = jQuery(this).data('popupfrom');
			if ( $( '#myStickyelements-social-channels-enabled' ).prop("checked") == true ) {
				var is_links_empty = 0;
				jQuery('.mystickyelement-social-links-input').each(function(index, value) {
					if( jQuery(this).val() == '' ){
						is_links_empty = 1;
						return;	
					}
				});
			}
			if( is_links_empty == 1 && jQuery(this).data("tab-triger") != "yes"){
				if ( $( '#myStickyelements-social-channels-enabled' ).prop("checked") == true ) {
					jQuery('.mystickyelements-missing-link-popup, #mystickyelement-missing-link-overlay').show();
					jQuery('.mystickyelement-dolater-widget-btn').attr('data-popupfrom', 'save_button');
				}
				return false;	
			}
			else{
				
				var curent_tab = $('.mystickyelements-tab.active').data( 'tab-id');
				if( curent_tab == 'mystickyelements-tab-social-media' )
					 $('#hide_tab_index').val('mystickyelements-social-media');  	
				else if( curent_tab == 'mystickyelements-tab-display-settings' )
					 $('#hide_tab_index').val('mystickyelements-display-settings');  			
				else
					 $('#hide_tab_index').val('mystickyelements-contact-form');  				
			} 			
 	});
	
	jQuery(document).on('click','#save_view',function(){
		if ( $( '#myStickyelements-social-channels-enabled' ).prop("checked") == true ) {
			var is_links_empty = 0;
			jQuery('.mystickyelement-social-links-input').each(function(index, value) {
				if( jQuery(this).val() == '' ){
					is_links_empty = 1;
					return;	
				}
			});
		}
		
		if( is_links_empty == 1 && jQuery(this).data("tab-triger") != "yes"){
			if ( $( '#myStickyelements-social-channels-enabled' ).prop("checked") == true ) {
				jQuery('.mystickyelements-missing-link-popup, #mystickyelement-missing-link-overlay').show();
				jQuery('.mystickyelement-dolater-widget-btn').attr('data-popupfrom', 'save_dashboard_button');
			}
			return false;	
		}
		else{
			
			var curent_tab = $('.mystickyelements-tab.active').data( 'tab-id');
			if( curent_tab == 'mystickyelements-tab-social-media' )
				 $('#hide_tab_index').val('mystickyelements-social-media');  	
			else if( curent_tab == 'mystickyelements-tab-display-settings' )
				 $('#hide_tab_index').val('mystickyelements-display-settings');  			
			else
				 $('#hide_tab_index').val('mystickyelements-contact-form'); 

			
		}
		
	});
	
	jQuery(document).on('click','.preview-publish',function(e){
		if(jQuery(this).val() != 'Publish' ){
			var popup_from = jQuery(this).data('popupfrom');
			var is_links_empty = 0;
			jQuery('.mystickyelement-social-links-input').each(function(index, value) {
				if( jQuery(this).val() == '' ){
					is_links_empty = 1;
					return;	
				}
			});
			
			if( is_links_empty == 1 && jQuery(this).data("tab-triger") != "yes"){
				jQuery('.mystickyelements-missing-link-popup, #mystickyelement-missing-link-overlay').show();
				jQuery('.mystickyelement-dolater-widget-btn').attr('data-popupfrom', 'publish_button');
				return false;	
			}
			else{
				
				var curent_tab = $('.mystickyelements-tab.active').data( 'tab-id');
				if( curent_tab == 'mystickyelements-tab-social-media' )
					 $('#hide_tab_index').val('mystickyelements-social-media');  	
				else if( curent_tab == 'mystickyelements-tab-display-settings' )
					 $('#hide_tab_index').val('mystickyelements-display-settings');  			
				else
					 $('#hide_tab_index').val('mystickyelements-contact-form');  				
			}	
		}			
	});
	var plus_cnt=0;
	jQuery(document).on('keypress','.mystickyelement-social-text-input',function(event){
		var key = event.which;
		var inputNumber = jQuery(this).val();
		if(jQuery(this).val()=='')
			plus_cnt=0;
		
		if(key == 43)
			plus_cnt++;	
		
		if(!( (key == 43 && plus_cnt < 2) || key >= 48 && key <= 57)){
			event.preventDefault();
			return;
		}
		
	});	
	
	jQuery(document).on('click','.mystickyelement-dolater-widget-btn',function(){
		var popup_from = jQuery(this).data('popupfrom');
		jQuery('.mystickyelements-missing-link-popup, #mystickyelement-missing-link-overlay').hide();
		jQuery('#btn-next').attr('data-tab-triger', 'yes');
		jQuery('#mystickyelements-display-settings').attr('data-tab-triger', 'yes');
		jQuery('.preview-publish').attr('data-tab-triger', 'yes');
		jQuery('.save-button').attr('data-tab-triger', 'yes');
		jQuery('#save_view').attr('data-tab-triger', 'yes');
		jQuery('#next-button-prev').attr('data-tab-triger', 'yes');
		
		
		
		if( popup_from == 'tab_button' ){
			console.log("from tab");
			jQuery('#mystickyelements-display-settings').trigger("click");
		}
		else if( popup_from == 'next_button' ) {
			jQuery('#btn-next').trigger("click");
		}
		else if( popup_from == 'publish_button' ){
			jQuery('.preview-publish').trigger("click");
		}
		else if( popup_from == 'save_button'){
			jQuery('.save-button').trigger("click");
		}
		else if(popup_from == 'save_dashboard_button'){
			jQuery('#save_view').trigger("click");
		}
		else{
			jQuery('#next-button-prev').trigger("click");
		}
	});
	
	jQuery(document).on('click','.mystickyelement-btn-ok',function(e){
		e.preventDefault();
		jQuery('.mystickyelement-social-links-input').each(function(index, value) {
			if( jQuery(this).val() == '' ){
				jQuery('#mystickyelements-social-media').trigger('click');
				jQuery(this).addClass("social-link-highlight").focus();
			}
		});
		jQuery( '.mystickyelements-missing-link-popup, #mystickyelement-missing-link-overlay' ).hide();
		return false;
	});
	
})( jQuery );
