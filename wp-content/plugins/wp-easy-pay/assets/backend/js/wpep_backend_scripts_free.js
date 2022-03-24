var fb;
var container;

function wpep_setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime( d.getTime() + (exdays * 24 * 60 * 60 * 1000) );
	var expires     = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function wpep_getCookie(cname) {
	var name          = cname + "=";
	var decodedCookie = decodeURIComponent( document.cookie );
	var ca            = decodedCookie.split( ';' );
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt( 0 ) == ' ') {
			c = c.substring( 1 );
		}
		if (c.indexOf( name ) == 0) {
			return c.substring( name.length, c.length );
		}
	}
	return "";
}

function wpep_delete_cookie(cname) {
	document.cookie = cname + "= ; expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/";
}


jQuery( document ).ready(
	function() {

		// allow only numeric input >=0 in payment fields
		jQuery( document ).on(
			"click",
			".selection > input",
			function(){
				jQuery( this ).inputFilter(
					function(value) {
						return /^\d*$/.test( value ); }
				);
			}
		);

		// Build form page tabs
		jQuery( 'div.easypayblock ul#tabs-list li' ).click(
			function(){
				var id = jQuery( this ).data( 'id' );
				wpep_setCookie( 'wpep-setting-tab', id, 365 );
			}
		);

		// global settings
		if (wpep_getCookie( 'wpep-payment-mode' )) {
			jQuery( "#on-off" ).attr( 'checked', true );
			jQuery( ".wp-easy-pay_page_wpep-settings #wpep_spmgt" ).removeClass( 'testActive' );
			jQuery( ".wp-easy-pay_page_wpep-settings #wpep_spmgl" ).addClass( 'liveActive' );
		} else {
			jQuery( "#on-off" ).attr( 'checked', false );
			jQuery( ".wp-easy-pay_page_wpep-settings #wpep_spmgt" ).addClass( 'testActive' );
			jQuery( ".wp-easy-pay_page_wpep-settings #wpep_spmgl" ).removeClass( 'liveActive' );
		}

		jQuery( "#on-off" ).click(
			function () {

				if (jQuery( this ).is( ":checked" )) {
					jQuery( ".wp-easy-pay_page_wpep-settings #wpep_spmgt" ).removeClass( 'testActive' );
					jQuery( ".wp-easy-pay_page_wpep-settings #wpep_spmgl" ).addClass( 'liveActive' );
					wpep_setCookie( 'wpep-payment-mode', 'live', 365 );
				} else {
					jQuery( ".wp-easy-pay_page_wpep-settings #wpep_spmgt" ).addClass( 'testActive' );
					jQuery( ".wp-easy-pay_page_wpep-settings #wpep_spmgl" ).removeClass( 'liveActive' );
					wpep_delete_cookie( 'wpep-payment-mode' );
				}
				jQuery( 'form.wpeasyPay-form' ).submit();
			}
		);

		if (jQuery( '#donation' ).is( ":checked" )) {

			jQuery( "#donation-dependedt" ).show();

		} else {

			jQuery( "#donation-dependedt" ).hide();
		}
	}
);




jQuery(document).ready(function(){

	if (jQuery("#simple-check").is(":checked")) {
			jQuery("#donation-depended-1").hide();
			jQuery("#donation-depended-2").hide();
			jQuery("#donation-depended-3").show();
			jQuery("#user-donation").attr("checked", false);
		} else {
			jQuery("#donation-depended-1").show();
			jQuery("#donation-depended-2").show();
		}


		if (jQuery("#donation-check").is(":checked")) {
			jQuery("#donation-depended-1").show();
			jQuery("#donation-depended-2").show();
		} else {
			jQuery("#donation-depended-1").hide();
			jQuery("#donation-depended-2").hide();
		}

		if (jQuery("#user-donation").is(":checked")) {
			jQuery("#donation-depended-3").hide();
		} else {
			jQuery("#donation-depended-3").show();
		}


		jQuery("#simple-check").click(function () {
			if (jQuery(this).is(":checked")) {
				jQuery("#donation-depended-1").hide();
				jQuery("#donation-depended-2").hide();
				jQuery("#donation-depended-3").show();
				jQuery("#user-donation").attr("checked", false);
			} else {
				jQuery("#donation-depended-1").show();
				jQuery("#donation-depended-2").show();
			}
		});
	
		jQuery("#donation-check").click(function () {
			if (jQuery(this).is(":checked")) {
				jQuery("#donation-depended-1").show();
				jQuery("#donation-depended-2").show();
			} else {
				jQuery("#donation-depended-1").hide();
				jQuery("#donation-depended-2").hide();
			}
		});
	
		jQuery("#user-donation").click(function () {
			if (jQuery(this).is(":checked")) {
				jQuery("#donation-depended-3").hide();
			} else {
				jQuery("#donation-depended-3").show();
			}
		});

});