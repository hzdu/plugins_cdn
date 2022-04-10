( function( $ ) {
	"use strict";
	var social_id = '';
	var second_social_id = '';
	var $i = 0;
	var $flg = false;
	$( document ).ready( function(){
		if ($.cookie("hide_mystickyelements") == 'closed') {
			$('.mystickyelements-fixed').each(function(){
				jQuery(this).hide();
			});
		}

		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
			$(document).on("click", ".mystickyelements-contact-form", function () {
				//$(".mystickyelements-contact-form").addClass("non-active");
				//$(".mystickyelements-contact-form").toggleClass("elements-active");
			});
			$(".mystickyelements-fixed").addClass("mystickyelements-on-click").removeClass("mystickyelements-on-hover");
		}
		if ( $( '#stickyelements-form' ).find( '.mse-g-recaptcha-response' ).length ) {
			getRecaptcha();
			$( "#stickyelements-form input:not(.stickyelements-submit-form), #stickyelements-form textarea, #stickyelements-form select" ).on( 'click', function(){
				getRecaptcha();
			});
		}

		$( '.stickyelements-form' ).on( 'submit', function( event ){
			event.preventDefault();
			var mystickyelement_widget_no = $( this ).data( 'mystickyelement-widget' );
			var close_after = $( this ).data( 'close-after' );
			if ( $( this ).find( '.mse-g-recaptcha-response' ).length ) {
				getRecaptcha();
				if( $( ".mystickyelements-fixed-widget-" + mystickyelement_widget_no + " #contact-form-recaptcha" ).hasClass( 'mystickyelement-invisible-recaptcha' ) ) {
					$( '.grecaptcha-badge' ).css( 'visibility', 'hidden' );
				}
			}

			$( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #stickyelements-form .mse-input-error' ).removeClass("mse-input-error");
			$( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #stickyelements-form .mse-input-message' ).remove();

			var totalErrors = 0;

			if( $( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #stickyelements-form .required' ).length ) {
				$( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #stickyelements-form .required' ).each( function(){
					if( $.trim( $( this ).val() ) == "" ) {
						$( this ).addClass( "mse-input-error" );
						$( this ).after( "<span class='mse-input-message'>This field is required</span>" );
						totalErrors++;
					}
				});
			}
			if( $( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #stickyelements-form .email.required:not(.mse-input-error)' ).length ) {
				$( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #stickyelements-form .email.required:not(.mse-input-error)' ).each( function(){
					var thisVal = $.trim( $( this ).val() );
					var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
					if ( !regex.test(thisVal) ) {
						$( this ).addClass("mse-input-error");
						$( this ).after("<span class='mse-input-message'>Email address is not valid</span>");
						totalErrors++;
					}
				});
			}
			if ( $( this ).find( 'input[type="file"]' ).length ) {
				var extension_list = ["jpg","jpeg","png","gif","pdf","doc","docx","ppt","pptx","pps","ppsx","odt","xls","xlsx","mp3","mp4","wav","mpg","avi","mov","wmv","3gp","ogv"];
				jQuery( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' form#stickyelements-form input[type="file"]' ).each( function(){
					var contact_file_string = $( this ).val();
					var extension = contact_file_string.replace(/^.*\./, '');
					if ( contact_file_string != '' && extension != '' && jQuery.inArray(extension, extension_list) == -1 ) {
						$( this ).addClass( "mse-input-error" );
						$( this ).after( "<span class='mse-input-message'>Please Upload .jpg, .jpeg, .png, .gif, .pdf, .doc, .docx, .ppt, .pptx, .pps, .ppsx, .odt, .xls, .xlsx, .mp3, .mp4, .wav, .mpg, .avi, .mov, .wmv, .3gp, .ogv file extension only</span>" );
						totalErrors++;
					}
				} );
			}

			if( totalErrors == 0 ) {
				if ( mystickyelements.google_analytics === '1' ) {
					stickyelements_google_analytics( 'contact-form' );
				}
				var formData = new FormData( this );

				jQuery.ajax({
					url: mystickyelements.ajaxurl,
					type: 'post',
					processData: false,
					contentType: false,
					data: formData,
					beforeSend: function() {
						$( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #stickyelements-submit-form' ).prop('disabled', true);
					},
					success: function (data) {
						$( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #stickyelements-submit-form' ).prop('disabled', false);
						$( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #stickyelements-form .mse-input-error' ).removeClass("mse-input-error");
						$( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #stickyelements-form .mse-input-message' ).remove();
						if ( $( this ).find( '.mse-g-recaptcha-response' ).length ) {
							getRecaptcha();
						}

						data = $.parseJSON(data);
						if( data.error == '1' ) {
							for( var i=0; i<data.errors.length; i++ ) {
								if( data.errors[i].key != "mse-form-error" ) {
									$( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #stickyelements-form #' + data.errors[i].key).addClass("mse-input-error");
									$( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #stickyelements-form #' + data.errors[i].key).after( "<span class='mse-input-message'>" + data.errors[i].message + "</span>" );
									if( data.errors[i].key == 'contact-form-recaptcha' ) {
										$( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' .grecaptcha-badge' ).css( 'visibility', 'visible' );
									}
								} else {
									$( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #mse-form-error' ).removeClass( "mse-form-success-message" ).addClass( "mse-form-error-message" ).show();
									$( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #mse-form-error' ).html( data.errors[i].message );
								}
							}
						} else if( data.status == '0' ) {
							$('.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #mse-form-error' ).removeClass('mse-form-success-message').addClass('mse-form-error-message').show();
							$('.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #mse-form-error' ).html( data.message );
						} else {
							$('.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #mse-form-error' ).removeClass("mse-form-error-message").addClass("mse-form-success-message").show();
							$('.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #mse-form-error' ).html( data.message );

							$( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #stickyelements-form input[type="text"], .mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #stickyelements-form input[type="tel"], .mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #stickyelements-form input[type="email"], .mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #stickyelements-form input[type="url"], .mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #stickyelements-form input[type="number"], .mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #stickyelements-form input[type="date"], .mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #stickyelements-form input[type="file"]').val("");
							$( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #stickyelements-form textarea').val("");
							$( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #stickyelements-form option:selected' ).prop("selected", false);

							$.cookie("closed_contactform_" + mystickyelement_widget_no, "closed", { path: '/' });
						}
						setTimeout(function () {
							$('.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' .mse-form-success-message').slideUp("slow");
						}, 5000);

						/* redirct Page After Submission */
						if ( data.status == 1 && data.redirect_link != '' ) {
							if( data.open_new_tab == 1 ) {
								window.open( data.redirect_link, '_blank' );
							} else {
								window.location = data.redirect_link;
							}
						} else {

							close_after = close_after * 1000;
							setTimeout(function () {
								$('.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' .mystickyelements-contact-form ').removeClass("elements-active");
							}, close_after);
						}
						return false;
					}
				});
			}
			return false;
		});

		/* Open tab on Click Event */
		$('.mystickyelements-on-click .mystickyelements-social-icon').on( 'click touch', function(event){
			if(!$(this).parent('li').hasClass("elements-active")) {
				$('.mystickyelements-on-click .elements-active').removeClass("elements-active");
				$(this).parent('li').addClass('elements-active');
			} else {
				$(this).parent('li').removeClass('elements-active');
				var mystickyelement_widget_no = $(this).data('mystickyelement-widget');
				$.cookie("closed_contactform_" + mystickyelement_widget_no, "closed", { path: '/' });
				event.preventDefault();
			}
		});

		/*close contact form on click close icon*/
		$('.mystickyelements-on-hover .mystickyelements-social-icon').on( 'click', function(event){
			if($(this).parent('li').hasClass("elements-active") && $( this ).children('a').length == 0 ) {
				//$(this).parent('li').removeClass('elements-active');
				$(this).parent('li').removeClass('elements-hover-active');
				event.preventDefault();
				$(this).parent().parent().parent().parent('.mystickyelements-on-hover').removeClass('mystickyelements-on-click');
			}

		});
		$( '.mystickyelements-on-hover .mystickyelements-social-icon-li' ).on('mouseenter', function(){
			if($(this).hasClass("elements-active")) {
				//$(this).parent('li').removeClass('elements-active');
			}
			if(!$(this).hasClass("elements-active")) {
				$('.mystickyelements-on-click .elements-active').removeClass("elements-active");
				$(this).addClass('elements-active');
				$(this).addClass('elements-hover-active');
				$(this).parent().parent().parent('.mystickyelements-on-hover').addClass('mystickyelements-on-click');
			}
		}).on('mouseleave', function(){
			$(this).removeClass('elements-active');
			$(this).removeClass('elements-hover-active');
			$(this).parent().parent().parent('.mystickyelements-on-hover').removeClass('mystickyelements-on-click');
		});

		$( '.mystickyelements-on-hover ul li.mystickyelements-contact-form' ).on('mouseenter', function(){
			$( this ).addClass( 'element-contact-active' );
		} ).on('mouseleave', function(){
			$( this ).removeClass( 'element-contact-active' );
		});
		$( '.element-contact-close' ).on( 'click touch', function(event){
			$( '.mystickyelements-contact-form' ).removeClass('elements-active');
			$( '.mystickyelements-contact-form' ).removeClass('element-contact-active');

			var mystickyelement_widget_no = $( this ).data( 'mystickyelement-widget' );
			$.cookie("closed_contactform_" + mystickyelement_widget_no, "closed", { path: '/' });
		});

		$('#stickyelements-form input:not(#stickyelements-submit-form), #stickyelements-form textarea ').on( 'keyup', function(event){
			if ($(this).val()){
				$(this).css('background-color', '#EFF5F8');
				$(this).css('border-color', '#7761DF');
			}

		});
		mystickyelements_border_radius();
		/* Minimize Sticky Elements  */
		//$('.mystickyelements-fixed ul').css( 'height', $('.mystickyelements-fixed ul').height() + 'px');
		$('li.mystickyelements-minimize').on('click',function(event){
			var element_minimize, minimize_device, position_device,element_on_device;
			var mystickyelement_widget_no = $( this ).data( 'mystickyelement-widget' );

			$( this ).toggleClass( 'element-minimize' );
			if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
				minimize_device = 'mobile';
				position_device = 'mobile-';
				element_on_device = 'element-mobile-on';
			} else {
				minimize_device = 'desktop';
				position_device = '';
				element_on_device = 'element-desktop-on';
			}
			if ( $( this ).hasClass( 'element-minimize' ) === true ) {
				$.cookie("minimize_" + minimize_device + "_" + mystickyelement_widget_no, "minimize", { path: '/' });
				element_minimize = true;
			} else {
				$.cookie("minimize_" + minimize_device + "_" + mystickyelement_widget_no, 'minimize_not', { path: '/' });
				element_minimize = false;
			}

			/* Left Position */
			$(".mystickyelements-position-" + position_device + "left.mystickyelements-fixed-widget-" + mystickyelement_widget_no + " ul li").each( function() {
				if ( $(this).hasClass( element_on_device ) == true ) {
					var mystickyelements_size = $( '.mystickyelements-fixed.mystickyelements-fixed-widget-' + mystickyelement_widget_no ).hasClass( 'mystickyelements-size-large' );
					if ( mystickyelements_size == true ) {
						$(this).animate({
							width: 'toggle',
							left: ( element_minimize === true ) ? '-=80' : ''
						});
					} else {
						$(this).animate({
							width: 'toggle',
							left: ( element_minimize === true ) ? '-=50' : ''
						});
					}
				}
			});

			/* Right Position */
			$(".mystickyelements-position-" + position_device + "right.mystickyelements-fixed-widget-" + mystickyelement_widget_no + " ul li").each( function() {
				if ( $(this).hasClass( element_on_device ) == true ) {
					var mystickyelements_size = $( '.mystickyelements-fixed.mystickyelements-fixed-widget-' + mystickyelement_widget_no ).hasClass( 'mystickyelements-size-large' );
					if ( mystickyelements_size == true ) {
						$(this).animate({
							width: 'toggle',
							left: ( element_minimize === true ) ? '+=80' : ''
						}, 300 , function() {
						});
					} else {
						$(this).animate({
							width: 'toggle',
							left: ( element_minimize === true ) ? '+=50' : ''
						}, 300 , function() {
						});
					}
				}
			});
			/* Bottom Position */
			$(".mystickyelements-position-" + position_device + "bottom.mystickyelements-fixed-widget-" + mystickyelement_widget_no + " ul li").each( function() {
				if ( $(this).hasClass( element_on_device ) == true ) {
					$(this).css( 'position', 'relative' );
					var mystickyelements_size = $( '.mystickyelements-fixed.mystickyelements-fixed-widget-' + mystickyelement_widget_no ).hasClass( 'mystickyelements-size-large' );
					if ( mystickyelements_size == true ) {
						$(this).animate({
							height: 'toggle',
							bottom: ( element_minimize === true ) ? '-=80' : '',
						}, 300 , function() {
							$(this).css( 'position', ( element_minimize === true ) ? 'relative' : 'static' );
						});
					} else {
						$(this).animate({
							height: 'toggle',
							bottom: ( element_minimize === true ) ? '-=60' : '',
						}, 300 , function() {
							$(this).css( 'position', ( element_minimize === true ) ? 'relative' : 'static' );
						});
					}
				}
			});
			/* Top Position */
			$(".mystickyelements-position-" + position_device + "top.mystickyelements-fixed-widget-" + mystickyelement_widget_no + " ul li").each( function() {
				if ( $(this).hasClass( element_on_device ) == true ) {
					$(this).css( 'position', 'relative' );
					var mystickyelements_size = $( '.mystickyelements-fixed.mystickyelements-fixed-widget-' + mystickyelement_widget_no ).hasClass( 'mystickyelements-size-large' );
					if ( mystickyelements_size == true ) {
						$(this).animate({
							height: 'toggle',
							top: ( element_minimize === true ) ? '-=80' : '',
						}, 300 , function() {
							$(this).css( 'position', ( element_minimize === true ) ? 'relative' : 'static' );
						});
					} else {
						$(this).animate({
							height: 'toggle',
							top: ( element_minimize === true ) ? '-=60' : '',
						}, 300 , function() {
							$(this).css( 'position', ( element_minimize === true ) ? 'relative' : 'static' );
						});
					}
				}
			});

			/*$(".mystickyelements-position-" + position_device + "left ul li").not('.mystickyelements-minimize, .' + element_on_device ).animate({
				width: 'toggle',
				left: ( element_minimize === true ) ? '-=50' : ''
			});

			$(".mystickyelements-position-" + position_device + "right ul li").not('.mystickyelements-minimize, .' + element_on_device).animate({
				width: 'toggle',
				left: ( element_minimize === true ) ? '+=50' : ''
			}, 300 , function() {
			});*/

			/* Move arrow base on minimize */
			if ( $( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' span.mystickyelements-minimize' ).hasClass( 'minimize-position-' + position_device + 'left' ) === true ) {

				if ( $( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' li.mystickyelements-minimize' ).hasClass( 'element-minimize' ) === true) {
					$( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' .mystickyelements-minimize.minimize-position-' + position_device + 'left' ).html('&rarr;')
				} else {
					$( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' .mystickyelements-minimize.minimize-position-' + position_device + 'left' ).html('&larr;')
				}
			} else if ( $( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' span.mystickyelements-minimize' ).hasClass( 'minimize-position-' + position_device + 'bottom' ) === true ) {

				if ( $( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' li.mystickyelements-minimize' ).hasClass( 'element-minimize' ) === true) {
					$( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' .mystickyelements-minimize.minimize-position-' + position_device + 'bottom' ).html('&uarr;')
				} else {
					$( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' .mystickyelements-minimize.minimize-position-' + position_device + 'bottom' ).html('&darr;')
				}
			} else if ( $( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' span.mystickyelements-minimize' ).hasClass( 'minimize-position-' + position_device + 'top' ) === true ) {

				if ( $( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' li.mystickyelements-minimize' ).hasClass( 'element-minimize' ) === true) {
					$( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' .mystickyelements-minimize.minimize-position-' + position_device + 'top' ).html('&darr;')
				} else {
					$( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' .mystickyelements-minimize.minimize-position-' + position_device + 'top' ).html('&uarr;')
				}
			} else {
				if ( $( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' li.mystickyelements-minimize' ).hasClass( 'element-minimize' ) === true) {
					$( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' .mystickyelements-minimize.minimize-position-' + position_device + 'right' ).html('&larr;')
				} else {
					$( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' .mystickyelements-minimize.minimize-position-' + position_device + 'right' ).html('&rarr;')
				}
			}
			mystickyelements_border_radius();
		});

		/* Google Analytics */
		$( "body" ).on( "click touch", ".update-analytics", function (e) {
			var elementname;
			elementname = $(this).attr( 'data-social-slug');
			if(elementname != undefined && elementname != "") {
				stickyelements_google_analytics( elementname );
			}
		});

		$(".analytics-update").on( "click touch", function (e) {
			var elementname;
			elementname = $(this).attr("id").split('mystickyelements-social-');
			elementname = elementname[1];
			if(elementname != undefined && elementname != "") {
				stickyelements_google_analytics( elementname );
			}
		});
		$(".mystickyelements-on-hover .analytics-update").on('mouseenter',  function(){
			$( this ).trigger( "click" );
		});

		/*iframe set*/
		$( '.mystickyelements-fixed ul li' ).each( function(){
			var custom_html_class = $( this ).hasClass( 'mystickyelements-custom-html-main' );
			var mystickyelement_widget_no = $( this ).parent().data( 'mystickyelement-widget' );
			if( custom_html_class ) {
				var custom_html_child_class = $( this ).hasClass( 'mystickyelements-custom-html-iframe' );
				if( custom_html_child_class ) {
					//var custom_html_iframe = $( this ).find( 'iframe' ).height();
					var custom_html_iframe = $( this ).find( '.mystickyelements-custom-html' ).height();
					var main_ul_height = $( '.mystickyelements-fixed.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' ul' ).height();
					if( main_ul_height > custom_html_iframe ) {
						//$( this ).addClass( 'mystickyelements-custom-iframe-bottom' );
					}
				}
			}
		});

		setTimeout( function(){
			$( '.mystickyelements-entry-effect-fade.entry-effect,.mystickyelements-entry-effect-slide-in.entry-effect' ).css( 'transition', 'all 0s ease 0s' );
		}, 1000 );

		$( '.mystickyelements-fixed ul li' ).on( 'click', function(){
			var mystickyelement_widget_no = $( this ).parent().data( 'mystickyelement-widget' );
			if ( $( this ).hasClass( 'mystickyelements-custom-html-iframe' ) ) {
				$( '.mystickyelements-fixed.mystickyelements-fixed-widget-' + mystickyelement_widget_no ).toggleClass( 'mystickyelements-custom-html-iframe-open' );
			} else {
				$( '.mystickyelements-fixed.mystickyelements-fixed-widget-' + mystickyelement_widget_no ).removeClass( 'mystickyelements-custom-html-iframe-open' );
			}
		} );

		$( '.mystickyelements-fixed' ).addClass( 'entry-effect' );
		if ( $( window ).width() > 1024  ) {
			$( '.mystickyelements-fixed' ).each( function(){
				var mystickyelement_widget_no = $( this ).data( 'mystickyelement-widget' );
				var mystickyelements_bottom_width = $( '.mystickyelements-position-bottom.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' .mystickyelements-lists' ).width();
				if ( mystickyelements_bottom_width < 300 ) {
					$( '.mystickyelements-position-bottom.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' .mystickyelements-contact-form .element-contact-form' ).width( '300' );
				}
			} );
		}
		mystickyelements_mobile_top_pos();

		/* DATE: 13-12-2019 Start */
		$( '.mystickyelements-fixed' ).each( function(){
			var mystickyelement_widget_no = $( this ).data( 'mystickyelement-widget' );
			var WindowHeight = ( jQuery(window).height() );
			var ElementHeight = ( jQuery( '.mystickyelements-fixed.mystickyelements-fixed-widget-' + mystickyelement_widget_no ).height() );
			var AttributeVal = ( jQuery( '.mystickyelements-fixed.mystickyelements-fixed-widget-' + mystickyelement_widget_no ).data( "custom-position" ) );
			var Ele_Att_Height = parseInt( ElementHeight ) + parseInt( AttributeVal );
			var Total_Count = parseInt( WindowHeight ) - parseInt( Ele_Att_Height );
			var Height = parseInt( WindowHeight / 3 );
			var contact_frm_height = $('.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #mystickyelements-contact-form .element-contact-form').height();
			if ( Total_Count > Height && WindowHeight < contact_frm_height) {
				jQuery( '.mystickyelements-fixed.mystickyelements-fixed-widget-' + mystickyelement_widget_no ).addClass("mystickyelements-custom-position-on");
			}
		} );
		/* DATE: 13-12-2019 End */
		/*Country option*/
		/*var mystickyelement_country_list_hidden = jQuery( '.mystickyelement-country-list-hidden' ).val();
		if ( jQuery( '.mystickyelement-country-list-hidden' ).length ) {
			var countries_list_array = mystickyelement_country_list_hidden.split( ',' );
		} else {
			var countries_list_array = '';
		}
		var $ipurl = 'https://www.cloudflare.com/cdn-cgi/trace';
		if ( countries_list_array != '' && countries_list_array != null ) {
	        jQuery.get($ipurl, function(cloudflaredata) {
	            var currentCountry = cloudflaredata.match("loc=(.*)");
	            if(currentCountry.length > 1) {
	                currentCountry = currentCountry[1];
                    currentCountry = currentCountry.toUpperCase();
                    if (jQuery.inArray(currentCountry, countries_list_array) != -1) {
                    	jQuery(".mystickyelements-fixed").show();
                    } else {
                        jQuery(".mystickyelements-fixed").hide();
                    }
	            }
	        });
    	} else {
    		jQuery(".mystickyelements-fixed").show();
    	}*/
		
	});

	$( window ).on('resize', function() {
		mystickyelements_border_radius();
		mystickyelements_mobile_top_pos();
	});

	function mystickyelements_mobile_top_pos() {
		if ( $( window ).width() <= 1024  ) {
			$( '.mystickyelements-fixed' ).each( function(){
				var mystickyelement_widget_no = $( this ).data( 'mystickyelement-widget' );
				if ( $( '.mystickyelements-fixed.mystickyelements-fixed-widget-' + mystickyelement_widget_no ).hasClass( 'mystickyelements-position-mobile-top' ) ) {
					var mystickyelements_height = $( '.mystickyelements-fixed.mystickyelements-fixed-widget-' + mystickyelement_widget_no ).height();
					$( 'html' ).attr( 'style', 'margin-top: ' + mystickyelements_height + 'px !important' );
				}
			});
		} else {
			$( 'html' ).css( 'margin-top', '' );
		}
	}

	function mystickyelements_border_radius(){

		/* Contact Us form Height */
		$( '.mystickyelements-fixed' ).each( function(){
			var mystickyelement_widget_no = $( this ).data( 'mystickyelement-widget' );
			if ( $('.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' .element-contact-form').length !== 0 ) {
				var win_height = $(window).height();
				var element_position = $( '.mystickyelements-fixed.mystickyelements-fixed-widget-' + mystickyelement_widget_no ).position().top;
				var element_offset = $('.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' .element-contact-form').offset().top;
				//var contact_frm_height = $('#mystickyelements-contact-form .element-contact-form').height();
				var contact_frm_height = $('.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #mystickyelements-contact-form #stickyelements-form').innerHeight() + $( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' .element-contact-form h3' ).innerHeight();
				//console.log(element_position + "==" + element_offset + " == " + contact_frm_height +" == " + win_height);

				if ( win_height < contact_frm_height ) {
					var new_height = (win_height - 70 );
					$('.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #mystickyelements-contact-form .element-contact-form').css('max-height', new_height+ 'px' );
					$('.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #mystickyelements-contact-form .element-contact-form').css('overflowY', 'auto' );
					var contact_form_top = element_position - 10;
					//console.log(contact_form_top + " ==" + new_height );
					if( $(window).width() > 1025 &&  ! $( '.mystickyelements-fixed.mystickyelements-fixed-widget-' + mystickyelement_widget_no ).hasClass( 'mystickyelements-position-bottom' ) ){
						$('.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #mystickyelements-contact-form .element-contact-form').css('top', '-' + contact_form_top + 'px' );
					}
					if( $(window).width() < 1024 &&  ! $( '.mystickyelements-fixed.mystickyelements-fixed-widget-' + mystickyelement_widget_no ).hasClass( 'mystickyelements-position-mobile-bottom' ) ){
						$('.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #mystickyelements-contact-form .element-contact-form').css('top', '-' + contact_form_top + 'px' );
					}
				} else {
					var minimize_height = $('.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' ul.mystickyelements-lists .mystickyelements-minimize').height();
					if ( minimize_height === null ) {
						minimize_height = 0;
					}
					var contact_form_top = element_position - (win_height - contact_frm_height) + minimize_height + 10;
					if( $(window).width() > 1025 &&  ! $( '.mystickyelements-fixed.mystickyelements-fixed-widget-' + mystickyelement_widget_no ).hasClass('mystickyelements-position-bottom') ){
						$('.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #mystickyelements-contact-form .element-contact-form').css('top', '-' + contact_form_top + 'px' );
					}
					if( $(window).width() < 1024 &&  ! $( '.mystickyelements-fixed.mystickyelements-fixed-widget-' + mystickyelement_widget_no ).hasClass('mystickyelements-position-mobile-bottom') ){
						$('.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #mystickyelements-contact-form .element-contact-form').css('top', '-' + contact_form_top + 'px' );
					}

					$('.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #mystickyelements-contact-form .element-contact-form').css('overflowY', '' );
					$('.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #mystickyelements-contact-form .element-contact-form').css('max-height', '');
				}
			}

			var position_device = '';
			if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
				position_device = 'mobile-';
			}
			var $mobile_bottom = 0;
			var $j = 0;
			var element_mobile_count = 0;

			$('.mystickyelements-fixed.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' ul li').each( function () {
				/* Check google analytics enable then add 'update-analytics' class */
				if ( mystickyelements.google_analytics === '1'  && $(this).hasClass('mystickyelements-minimize') !== true && $(this).attr('id') !== 'mystickyelements-contact-form' ) {
					if ( $(this).find( "a" ).length !== 0 ) {
						var elementname = $(this).attr("id").split('mystickyelements-social-');
						$(this).find( "a" ).addClass('update-analytics');
						$(this).find( "a" ).attr( 'data-social-slug', elementname[1]);
					} else {
						$(this).addClass('analytics-update');
					}
				}
				$('.mystickyelements-position-' + position_device + 'left.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #' + $(this).attr('id') + ' .mystickyelements-social-icon').css('border-radius','');
				$('.mystickyelements-position-' + position_device + 'right.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #' + $(this).attr('id') + ' .mystickyelements-social-icon').css('border-radius','');

				if ( $( window ).width() < 1025 ) {
					element_mobile_count = '12';
				}
				if ( $( window ).width() < 992 ) {
					element_mobile_count = '9';
				}
				if ( $( window ).width() < 768 ) {
					element_mobile_count = '4';
				}
				if( $(this).hasClass('element-mobile-on') && $j != element_mobile_count ) {
					$(this).addClass('mystickyelements-show-last-element');
					$j++;
				} else {
					$(this).removeClass('mystickyelements-show-last-element');
				}

				/* Check First LI */
				if ( $i == 0 ){
					if ( $( window ).width() > 1024 &&  !$(this).hasClass('element-desktop-on')){
						$flg = true;
					}
					if ( $( window ).width() < 1025 &&  !$(this).hasClass('element-mobile-on')){
						$flg = true;
					}
				}
				if ( $( window ).width() > 1024 &&  $(this).hasClass('element-desktop-on')){
					social_id = $(this).attr('id');
				}
				if ( $( window ).width() < 1025 &&  $(this).hasClass('element-mobile-on')){
					social_id = $(this).attr('id');
					$mobile_bottom++;
				}
				if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
					second_social_id == '';
				}
				if( second_social_id == '' ) {
					//if ( $i == 1 && $flg === true) {
					if ( $flg === true ) {
						if ( $( window ).width() > 1024 && $(this).hasClass('element-desktop-on') ){
							second_social_id = $(this).attr('id');
						}
						if ( $( window ).width() < 1025 && $(this).hasClass('element-mobile-on') ){
							second_social_id = $(this).attr('id');
						}
					}
				}
				$i++;
			});

			$( '.mystickyelements-fixed.mystickyelements-position-mobile-bottom.mystickyelements-fixed-widget-' + mystickyelement_widget_no ).addClass( 'mystickyelements-bottom-social-channel-' + $mobile_bottom );
			$( '.mystickyelements-fixed.mystickyelements-position-mobile-top.mystickyelements-fixed-widget-' + mystickyelement_widget_no ).addClass( 'mystickyelements-top-social-channel-' + $mobile_bottom );
			if ( social_id != '' ) {
				if ( social_id === 'mystickyelements-contact-form' ){
					$('.mystickyelements-position-' + position_device + 'left.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #' + social_id + ' .mystickyelements-social-icon').css('border-bottom-left-radius', '10px' );
					$('.mystickyelements-position-' + position_device + 'right.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #' + social_id + ' .mystickyelements-social-icon').css('border-top-left-radius', '10px' );
					$('.mystickyelements-position-' + position_device + 'bottom.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #' + social_id + ' .mystickyelements-social-icon').css('border-top-right-radius', '10px' );

					if( $( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' li.mystickyelements-minimize' ).length !== 1 ){
						$('.mystickyelements-position-' + position_device + 'left.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #' + social_id + ' .mystickyelements-social-icon').css('border-bottom-right-radius', '10px' );
						$('.mystickyelements-position-' + position_device + 'right.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #' + social_id + ' .mystickyelements-social-icon').css('border-top-right-radius', '10px' );
					}
				} else if ( social_id !== 'mystickyelements-contact-form') {
					if ( $i=== 1 ) {
						$('.mystickyelements-position-' + position_device + 'left.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #' + social_id + ' .mystickyelements-social-icon').css('border-radius', '0px 10px 10px 0' );
						$('.mystickyelements-position' + position_device + '-right.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #' + social_id + ' .mystickyelements-social-icon').css('border-radius', '10px 0 0 10px' );
					} else {
						$('.mystickyelements-position-' + position_device + 'left.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #' + social_id + ' .mystickyelements-social-icon').css('border-bottom-right-radius', '10px' );
						$('.mystickyelements-position-' + position_device + 'right.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #' + social_id + ' .mystickyelements-social-icon').css('border-bottom-left-radius', '10px' );
						$('.mystickyelements-position-' + position_device + 'bottom.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #' + social_id + ' .mystickyelements-social-icon').css('border-top-right-radius', '10px' );
					}
				}
			} else {
				$( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' .mystickyelement-credit' ).hide();
				$( '.mystickyelements-fixed.mystickyelements-fixed-widget-' + mystickyelement_widget_no ).hide();
			}
			if ( second_social_id != '' && second_social_id !== 'mystickyelements-contact-form' && $( '.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' li.mystickyelements-minimize' ).length !== 1  ) {
				$('.mystickyelements-position-' + position_device + 'left.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #' + second_social_id + ' .mystickyelements-social-icon').css('border-top-right-radius', '10px' );
				$('.mystickyelements-position-' + position_device + 'right.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #' + second_social_id + ' .mystickyelements-social-icon').css('border-top-left-radius', '10px' );
				$('.mystickyelements-position-' + position_device + 'bottom.mystickyelements-fixed-widget-' + mystickyelement_widget_no + ' #' + second_social_id + ' .mystickyelements-social-icon').css('border-top-left-radius', '10px' );
			}
		});
	}

	/*
	 * Google Analytics for Sticky Elements
	 */
	function stickyelements_google_analytics( elementname ){
		if (window.hasOwnProperty("gtag")) {
			gtag('event', 'stickyelements_' + elementname, { 'eventCategory': 'stickyelements_' + elementname, 'event_action': 'stickyelements_' + elementname});
		}
		if (window.hasOwnProperty("ga")) {
			var gaVar = window.ga.getAll()[0];
			if(gaVar) {
				gaVar.send("event", "click", { eventCategory: 'stickyelements_' + elementname, eventAction: 'stickyelements_' + elementname});
			}
		}
	}
	$(window).ready(function() {
		setTimeout(function(){ mystickyelements_border_radius(); }, 1500);
    });

	$('#mystickyelements-contact-form').on( 'hover', function(){
		mystickyelements_border_radius();
	}) ;


})( jQuery );

function launch_mystickyelements( ele_no = '1'){
	var ele_device = 'desktop';
	var lists_loop =1;
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		ele_device = 'mobile';
	}
	jQuery('.mystickyelements-fixed .mystickyelements-lists').each(function(){

		if ( lists_loop > 1) {
			return;
		}

		var count = 1;
		jQuery(this).find('li').each(function(){
			/* Return Minimize Element */
			if ( jQuery(this).hasClass('mystickyelements-minimize')) {
				if ( jQuery(this).hasClass('element-minimize')) {
					jQuery(this).trigger('click');
				}
				return;
			}
			/* Return element device not found */
			if ( !jQuery(this).hasClass('element-' + ele_device + '-on')) {
				return;
			}

			if ( ele_no == count) {
				jQuery(this).addClass('elements-active');
				if ( !jQuery(this).parent().parent().parent().hasClass('mystickyelements-on-click') ) {
					jQuery(this).parent().parent().parent().addClass('mystickyelements-on-click');
				}
				return false;
			}
			count++;
		});

		lists_loop++;
	});
}


function close_mystickyelements(){
	var ele_device = 'desktop';
	var lists_loop =1;
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		ele_device = 'mobile';
	}

	jQuery('.mystickyelements-fixed .mystickyelements-lists').each(function(){
		jQuery(this).find('li').each(function(){
			if ( jQuery(this).hasClass('elements-active') ) {
				jQuery(this).removeClass('elements-active');
			}
		});
	});
}

function hide_mystickyelements(){
	jQuery('.mystickyelements-fixed').each(function(){
		jQuery(this).hide();
		jQuery.cookie("hide_mystickyelements"  , "closed", { expires: 365, path: '/' });
	});
}

function show_mystickyelements(){
	jQuery('.mystickyelements-fixed').each(function(){
		jQuery(this).show();
		jQuery.cookie("hide_mystickyelements"  , "opened", { expires: 1, path: '/' });
	});
}