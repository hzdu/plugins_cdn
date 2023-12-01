/**
 * Add-ons Settings javascript file
 *
 * @package WishListMember/Features/Addons_Manager
 */

jQuery(
	function ($) {
		$( '.toggle-enable-addon' ).click( toggle_enable_addon );
		$('.install-addon').click(install_addon);
		$( '.deactivate-coursecure' ).click( deactivate_coursecure );
	}
);

var toggle_enable_addon = function () {
	$that    = $( this );
	var data = {
		"action": 'wlm_toggle_enable_addon',
		"addon_file":  $( this ).attr( 'addon_file' ),
		"enable"  : $( this ).prop( 'checked' ) ? '1' : '0',
	};
	$.ajax(
		{
			url: WLM3VARS.ajaxurl,
			type: 'POST',
			data: data,
			success: function (data) {
				if (data.success) {
					if ( data.data.enabled == '1' ) {
						$( '.wlm-message-holder' ).show_message( { type: 'success', message: data.data.message } );
					} else {
						$( '.wlm-message-holder' ).show_message( { type: 'danger', message: data.data.message } );
					}
					window.location.reload();
				} else {
					$( '.wlm-message-holder' ).show_message( { type: 'danger', message: data.data.message } );
					$that.prop( "checked", false );
				}
			}
		}
	);
}

var install_addon = function () {
	$that = $( this );
	if ( $that.prop( "disabled" ) || $that.hasClass( "-disable" ) || $that.hasClass( "-disabled" ) ) {
		return false; // if disabled, do nothing.
	}
	var data   = {
		"action": 'wlm_install_addon',
		"addon_url":  $( this ).attr( 'addon_url' ),
	};
	$loader    = $( $( '#wlm-simple-loader-container' ).html() );
	$container = $( this ).closest( '.addons-toggle-container' );
	$container.find( '.addon-details .addon-title' ).hide();
	$container.find( '.addon-details .addon-desc' ).hide();
	$container.find( '.addon-details' ).append( $loader.html() );
	$container.find( '.addon-details' ).find( '.d-inline-block.align-middle' ).addClass( "wlm-addon-loading w-100 text-center" ).attr( "style", false );
	$that.disable_button( {disable:true} ).html( "Installing, please wait..." );
	$.ajax(
		{
			url: WLM3VARS.ajaxurl,
			type: 'POST',
			data: data,
			success: function (data) {
				if (data.success) {
					$container.find( '.addon-details .addon-title' ).show();
					$container.find( '.addon-details .addon-desc' ).show();
					$container.find( '.wlm-addon-loading' ).remove();
					$container.find( '.install-addon' ).remove();
					$container.find('.toggle-enable-addon-holder').removeClass('hidden');
					if ( data.data.activated ) {
						$container.find('.toggle-enable-addon').prop("checked", true);
						$container.find('.action-message').hide();
					} else {
						$container.find('.toggle-enable-addon').prop("checked", false);
						$container.find('.action-message').show();
					}
					$( '.wlm-message-holder' ).show_message( { type: 'success', message: data.data.message } );
				} else {
					$( '.wlm-message-holder' ).show_message( { type: 'danger', message: data.data.message } );
					$that.disable_button( {disable:false, icon:"baseline_save_alt", text:wp.i18n.__( 'Install', 'wishlist-member' )} );
				}
			}
		}
	);
}

var deactivate_coursecure = function () {
	$that = $( this );
	if ( $that.prop( "disabled" ) || $that.hasClass( "-disable" ) || $that.hasClass( "-disabled" ) ) {
		return false; // if disabled, do nothing.
	}
	var data   = {
		"action": 'wlm_deactivate_coursecure',
	};
	$that.disable_button( {disable:true} ).html( "Deactivating CourseCure plugin, please wait..." );
	$.ajax(
		{
			url: WLM3VARS.ajaxurl,
			type: 'POST',
			data: data,
			success: function ( data ) {
				if (data.success) {
					$( '.wlm-message-holder' ).show_message( { type: 'success', message: data.data.message } );
					window.location.reload();
				} else {
					$( '.wlm-message-holder' ).show_message( { type: 'danger', message: data.data.message } );
				}
			}
		}
	);
}
