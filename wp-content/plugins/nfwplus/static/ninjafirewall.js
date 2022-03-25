/*
 +=====================================================================+
 | NinjaFirewall (WP+ Edition)                                         |
 |                                                                     |
 | (c) NinTechNet - https://nintechnet.com/                            |
 +=====================================================================+
*/

// =====================================================================
// Generic.

function nfwjs_switch_tabs( what, list ) {
	// Active tab:
	jQuery('#'+ what +'-options').show();
	jQuery('#tab-'+ what).addClass('nav-tab-active');
	jQuery('#tab-selected').val( what );
	// Inactive tabs:
	var tabs = list.split( ':' );
	var list_length = tabs.length;
	for ( var i = 0; i < list_length; i++ ) {
		if ( tabs[i] != what ) {
			jQuery('#'+ tabs[i] +'-options').hide();
			jQuery('#tab-'+ tabs[i]).removeClass('nav-tab-active');
		}
	}
}

function nfwjs_up_down( id ) {
	if ( jQuery('#'+ id).css('display') == 'none' ) {
		jQuery('#'+ id).slideDown();
	} else {
		jQuery('#'+ id).slideUp();
	}
}

function nfwjs_restore_default() {
   if ( confirm( nfwi18n.restore_default ) ) {
		stop_js_check = 1;
      return true;
   }
	return false;
}

var stop_js_check = 0;
// =====================================================================
// Overview page.

jQuery( document ).ready( function() {
	// Full WAF activation thickbox
	jQuery( '#nfw-activate-thickbox' ).click( function() {
		var h = jQuery(window).height() - 100;
		var w = jQuery(window).width() - 100;
		tb_show( '', '#TB_inline?width='+ (w - 20) +
			'&amp;height='+ (h - 20) +
			'&amp;inlineId=nfw-activate-thickbox-content', null );
		return false;
	} );
	// Full WAF configuration thickbox
	jQuery( '#nfw-configure-thickbox' ).click( function() {
		var h = jQuery(window).height() - 100;
		var w = jQuery(window).width() - 100;
		tb_show( '', '#TB_inline?width='+ (w - 20) +
			'&amp;height='+ (h - 20) +
			'&amp;inlineId=nfw-configure-thickbox-content', null );
		return false;
	} );
	// Error log thickbox
	jQuery( '#nfw-errorlog-thickbox' ).click( function() {
		var h = jQuery(window).height() - 100;
		var w = jQuery(window).width() - 100;
		tb_show( '', '#TB_inline?width='+ (w - 20) +
			'&amp;height='+ (h - 20) +
			'&amp;inlineId=nfw-errorlog-thickbox-content', null );
		return false;
	} );
});

function nfwjs_httpserver( what ) {

	if ( what == 6 ) {
		// Openlitespeed only
		jQuery('#diy-div').hide();

	} else {
		jQuery('#diy-div').show();
	}

	if ( what == 1 || what == 5 || what == 6 || what == 8 ) {
		// No INI file
		jQuery('#tr-ini-userini').hide();
		jQuery('#tr-ini-phpini').hide();
		jQuery('#tr-select-ini').hide();
		jQuery('#tr-htaccess-suphp').hide();

		if ( what == 1 ) {
			// mod_php
			jQuery('#tr-htaccess-litespeed').hide();
			jQuery('#tr-htaccess-openlitespeed').hide();
			jQuery('#tr-htaccess-apachelsapi').hide();
			jQuery('#tr-htaccess-modphp').show();
		} else if ( what == 5 ) {
			// Litespeed
			jQuery('#tr-htaccess-modphp').hide();
			jQuery('#tr-htaccess-openlitespeed').hide();
			jQuery('#tr-htaccess-apachelsapi').hide();
			jQuery('#tr-htaccess-litespeed').show();
		} else if ( what == 6 ) {
			// Openlitespeed
			jQuery('#tr-htaccess-modphp').hide();
			jQuery('#tr-htaccess-litespeed').hide();
			jQuery('#tr-htaccess-apachelsapi').hide();
			jQuery('#tr-htaccess-openlitespeed').show();
			jQuery('#nfwaf-step2').slideDown();
		} else { // 8
			// Apache + LSAPI
			jQuery('#tr-htaccess-modphp').hide();
			jQuery('#tr-htaccess-litespeed').hide();
			jQuery('#tr-htaccess-apachelsapi').show();
			jQuery('#tr-htaccess-openlitespeed').hide();
		}

	} else {
		jQuery( '#tr-select-ini' ).show();

		if ( what == 2 || what == 4 || what == 7 ) {
			// No .htaccess file
			jQuery('#tr-htaccess-modphp').hide();
			jQuery('#tr-htaccess-litespeed').hide();
			jQuery('#tr-htaccess-apachelsapi').hide();
			jQuery('#tr-htaccess-suphp').hide();
			jQuery('#tr-htaccess-openlitespeed').hide();

		} else if ( what == 3 ) {
			// ini + suPHP
			jQuery('#tr-htaccess-litespeed').hide();
			jQuery('#tr-htaccess-apachelsapi').hide();
			jQuery('#tr-htaccess-modphp').hide();
			jQuery('#tr-htaccess-openlitespeed').hide();
			jQuery('#tr-htaccess-suphp').show();
		}

		// Which INI?
		if ( jQuery('#ini-type-user').prop('checked') == true ) {
			jQuery('#tr-ini-userini').show();
			jQuery('#tr-ini-phpini').hide();
		} else {
			jQuery('#tr-ini-userini').hide();
			jQuery('#tr-ini-phpini').show();
		}
	}

	if ( jQuery('#diynfw').prop('checked') == true && what != 6 ) {
		nfwjs_diy_chg( 'nfw' );

	} else {
		nfwjs_diy_chg( 'usr' );
	}
}

function nfwjs_radio_ini( what ) {

	if ( what == 1 ) { // .user.ini
		jQuery('#tr-ini-userini').show();
		jQuery('#tr-ini-phpini').hide();

	} else { // php.ini
		jQuery('#tr-ini-userini').hide();
		jQuery('#tr-ini-phpini').show();
	}
}

function nfwjs_fullwafconfig( what) {

	// Security nonce
	var nonce = jQuery('input[name=nfwnonce_fullwaf]').val();
	if ( typeof nonce === 'undefined' || nonce == '' ) {
		alert( nfwi18n.missing_nonce );
		return false;
	}

	var data = {
		'action': 'nfw_fullwafconfig',
		'nonce': nonce
	};

	// Full WAF mode configuration
	if ( what == 1 ) {
		var exclude_waf_list = jQuery("input:checkbox[name='nfw_exclude_waf_list[]']:not(:checked)").map(function() {
			return jQuery(this).val()
		}).get();
		data['list'] = JSON.stringify( exclude_waf_list );
		data['what'] = 1;

	// Downgrade to WP WAF mode
	} else if ( what == 2 ) {
		data['what'] = 2;

	} else {
		return false;
	}

	jQuery.ajax( {
		type: "POST",
		url: ajaxurl,
		headers: {
			'Accept-Language':'en-US,en;q=0.5'
		},
		data: data,
		dataType: "text",
		success: function( response ) {
			if ( response == '200' ) {
				window.location.href = window.location.href + '&nfwafconfig=1';
			} else {
				alert( response );
			}
		},
		// Display non-200 HTTP response
		error: function( xhr, status, err ) {
			alert( nfwi18n.http_error +' "'+ xhr.status +' '+ err +'".' );
		}
	});
	return false;
}

function nfwjs_fullwafsubmit() {

	// Security nonce
	var nonce = jQuery('input[name=nfwnonce_fullwaf]').val();
	if ( typeof nonce === 'undefined' || nonce == '' ) {
		alert( nfwi18n.missing_nonce );
		return false;
	}

	var httpserver = jQuery('select[name=http_server]').val();
	if ( httpserver == '' ) {
		alert( nfwi18n.missing_httpserver );
		return false;
	}
	var initype = jQuery('input[name=ini_type]:checked').val();
	var diy = jQuery('input[name=diy-choice]:checked').val();
	var sandbox = jQuery('input[name=enable_sandbox]:checked').val();
	// Exclusion folders, if any
	var exclude_waf_list = jQuery("input:checkbox[name='nfw_exclude_waf_list[]']:not(:checked)").map(function() {
		return jQuery(this).val()
	}).get();
	exclude_waf_list_json = JSON.stringify( exclude_waf_list );

	// Ajax
	var data = {
		'action': 'nfw_fullwafsetup',
		'nonce': nonce,
		'httpserver': httpserver,
		'initype': initype,
		'exclude_waf_list': exclude_waf_list_json,
		'diy': diy,
		'sandbox': sandbox
	};
	jQuery.ajax( {
		type: "POST",
		url: ajaxurl,
		headers: {
			'Accept-Language':'en-US,en;q=0.5'
		},
		data: data,
		dataType: "text",
		success: function( response ) {
			if ( response == '200' ) {
				window.location.href = window.location.href + '&fullwaf=1';
			} else {
				alert( response );
			}
		},
		// Display non-200 HTTP response
		error: function( xhr, status, err ) {
			alert( nfwi18n.http_error +' "'+ xhr.status +' '+ err +'".' );
		}
	});
	return false;
}

function nfwjs_diy_chg( what ) {
	if ( what == 'nfw' ) {
		jQuery('#diy-msg').slideUp();
		jQuery('#nfwaf-step2').slideUp();
		jQuery('#enable-sandbox').slideDown();
	} else {
		jQuery('#diy-msg').slideDown();
		jQuery('#nfwaf-step2').slideDown();
		jQuery('#enable-sandbox').slideUp();
	}
}

var fullwaf_count;
var fullwaf;
function nfwjs_fullwaf_countdown() {

	if ( fullwaf_count > 1 ) {
		fullwaf_count--;
		jQuery('#nfw-waf-count').html( fullwaf_count  );

	} else {
		clearInterval( fullwaf );
		location.reload();
	}
}

function nfwjs_welcomeajax( nonce ) {

	// Ajax
	var data = {
		'action': 'nfw_welcomescreen',
		'nonce': nonce,
	};
	jQuery.ajax( {
		type: "POST",
		url: ajaxurl,
		headers: {
			'Accept-Language':'en-US,en;q=0.5'
		},
		data: data,
		dataType: "text",
		// We don't want any response.
	});
	return 1;
}

function nfwjs_del_errorlog() {
	if ( confirm( nfwi18n.del_errorlog ) ) {
		return true;
	}
	return false;
}
// =====================================================================
// Statistics page.

function nfwjs_stat_redir(where) {
	if (where == '') { return false;}
	document.location.href='?page=NinjaFirewall&tab=statistics&statx='+ where;
}

// =====================================================================
// Firewall Options.

function nfwjs_default_msg() {
	var msg = jQuery('#default-msg').val();
	jQuery('#blocked-msg').val( msg );

}

var restoreconf = 0;

function nfwjs_select_backup( what ) {
	if ( what == 0 ) {
		restoreconf = 0;
	} else {
		restoreconf = 1;
	}
}

function nfwjs_save_options() {
	if ( restoreconf > 0 ) {
		if ( confirm( nfwi18n.restore_warning ) ) {
			return true;
		}
		return false;
	}
	return true;
}

// =====================================================================
// Firewall Policies.

function nfwjs_upload_onoff( what ) {
	if ( what != 0 ) {
		jQuery('#san').prop('disabled', false);
		jQuery('#subs').prop('disabled', false);
		jQuery('#sizeid').prop('disabled', false);
	} else {
		jQuery('#san').prop('disabled', true);
		jQuery('#subs').prop('disabled', true);
		jQuery('#sizeid').prop('disabled', true);
	}
	if ( what == 2 ) {
		jQuery('#scanzip').prop('disabled', false);
	} else {
		jQuery('#scanzip').prop('disabled', true);
	}
}

function nfwjs_sanitise( cbox ) {
	if ( cbox.checked ) {
		if ( confirm( nfwi18n.warn_sanitise) ) {
			return true;
		}
		return false;
	}
}

function nfwjs_ssl_warn( item, is_ssl ) {
	if ( is_ssl == true || item.checked == false ) {
		return true;
	}
	if ( confirm( nfwi18n.ssl_warning ) ) {
		return true;
	}
	return false;
}

function nfwjs_woowarning( cbox ) {
	if ( cbox.checked ) {
		if ( confirm( nfwi18n.woo_warning) ) {
			return true;
		}
		return false;
	}
}
function nfwjs_reguserwarning( cbox ) {
	if ( cbox.checked ) {
		if ( confirm( nfwi18n.reguser_warning) ) {
			return true;
		}
		return false;
	}
}
function nfwjs_regsitewarning( cbox ) {
	if ( cbox.checked ) {
		if ( confirm( nfwi18n.regsite_warning) ) {
			return true;
		}
		return false;
	}
}

function nfwjs_csp_onoff( id1, id2 ) {
	if ( jQuery('#'+ id1).prop('checked') == true ) {
		jQuery('#'+ id2).prop('readonly', false);
		jQuery('#'+ id2).focus();
	} else {
		jQuery('#'+ id2).prop('readonly', true);
	}
}

function nfwjs_referrer_onoff() {
	if ( jQuery('#referrer_switch').prop('checked') == true ) {
		jQuery('#rp_select').prop('disabled', false);
		jQuery('#rp_select').focus();
	} else {
		jQuery('#rp_select').prop('disabled', true);
	}
}

function alert_input_log( val ) {
	if ( val.checked == true ) {
		if ( confirm( nfwi18n.input_warning ) ) {
			return true;
		}
		return false;
	}
	return true;
}

function check_ac_fields() {
	if ( stop_js_check == 1 ) { // Restore default values
		return true;
	}
	// If the user selected all countries, we warn them
	// they will likely get blocked
	if ( jQuery('input.country-class').not(':checked').length > 0 ) {
		return true;
	}

	if ( confirm( nfwi18n.country_warning ) ) {
		return true;
	}
	return false;
}

// =====================================================================
// Access Control

function ac_radio_toggle( on_off, rbutton ) {
	var what = rbutton;
	if ( on_off ) {
		jQuery('#' + what).prop('disabled', false);
		jQuery('#' + what).focus();
	} else {
		jQuery('#' + what).prop('disabled', true);
	}
}

function nfw_update_counter( what ) {
	var cur_val = jQuery('#total-items').text();
	if ( what.checked == true ) {
		jQuery('#total-items').text( ++cur_val );
	} else {
		jQuery('#total-items').text( --cur_val );
	}
}

function nfw_check_countries( what ) {
	var cur_val = 0;
	var nodes = document.getElementById('td-countries').getElementsByTagName('input');
	for(var i = 0; i < nodes.length; i++){
		if ( what == 0 ) {
			nodes[i].checked = false;
		} else {
			nodes[i].checked = true;
			++cur_val;
		}
		jQuery('#total-items').text( cur_val );
	}
}

function nfwjs_view_format( id ) {
	if ( jQuery('#'+ id).css('display') == 'none' ) {
		jQuery('#'+ id).slideDown();
	} else {
		jQuery('#'+ id).slideUp();
	}
}

function nfwjs_toggle_ratelimit() {
	if ( jQuery('#rate-limit').css('display') == 'none' ) {
		jQuery('#rate-limit').slideDown();
		jQuery('#rate-limit-log').fadeIn();
	} else {
		jQuery('#rate-limit').slideUp();
		jQuery('#rate-limit-log').fadeOut();
	}
}

function nfwjs_restore_bots( what, msg ) {
	if (! confirm( msg ) ) {
		return false;
	}
	var botlist = what.split('|');
	jQuery('#bot-blocked' ).val( botlist.join("\n") );
}

function nfwjs_test_headers( homepage ) {
	// Bypass caching
	homepage = homepage +'?'+ Date.now();

	jQuery('#progress-gif').show();
	jQuery.ajax( {
		url: homepage,
		method: 'HEAD'
	} ).then( function( data, status, xhr ) {
		jQuery('#progress-gif').hide();
		alert( xhr.getAllResponseHeaders() );
	});
}

// =====================================================================
// File Check.

function nfwjs_file_info(what, where) {
	if ( what == '' ) { return false; }

	// Because we use a "multiple" select for aesthetic purposes
	// but don't want the user to select multiple files, we focus
	// only on the currently selected one:
	var current_item = jQuery('#select-'+ where ).prop('selectedIndex');
	jQuery('#select-'+ where ).prop('selectedIndex',current_item);

	// New file
	if (where == 1) {
		var nfo = what.split(':');
		jQuery('#new_size').html( nfo[3] );
		jQuery('#new_chmod').html( nfo[0] );
		jQuery('#new_uidgid').html( nfo[1] + ' / ' + nfo[2] );
		jQuery('#new_mtime').html( nfo[4].replace(/~/g, ':') );
		jQuery('#new_ctime').html( nfo[5].replace(/~/g, ':') );
		jQuery('#table_new').show();

	// Modified file
	} else if (where == 2) {
		var all = what.split('::');
		var nfo = all[0].split(':');
		var nfo2 = all[1].split(':');
		jQuery('#mod_size').html( nfo[3] );
		if (nfo[3] != nfo2[3]) {
			jQuery('#mod_size2').html( '<font color="red">'+ nfo2[3] +'</font>' );
		} else {
			jQuery('#mod_size2').html( nfo2[3] );
		}
		jQuery('#mod_chmod').html( nfo[0] );
		if (nfo[0] != nfo2[0]) {
			jQuery('#mod_chmod2').html( '<font color="red">'+ nfo2[0] +'</font>' );
		} else {
			jQuery('#mod_chmod2').html( nfo2[0] );
		}
		jQuery('#mod_uidgid').html( nfo[1] + ' / ' + nfo[2] );
		if ( (nfo[1] != nfo2[1]) || (nfo[2] != nfo2[2]) ) {
			jQuery('#mod_uidgid2').html( '<font color="red">'+ nfo2[1] + '/' + nfo2[2] +'</font>' );
		} else {
			jQuery('#mod_uidgid2').html( nfo2[1] + ' / ' + nfo2[2] );
		}
		jQuery('#mod_mtime').html( nfo[4].replace(/~/g, ':') );
		if (nfo[4] != nfo2[4]) {
			jQuery('#mod_mtime2').html( '<font color="red">'+ nfo2[4].replace(/~/g, ':') +'</font>' );
		} else {
			jQuery('#mod_mtime2').html( nfo2[4].replace(/~/g, ':') );
		}
		jQuery('#mod_ctime').html( nfo[5].replace(/~/g, ':') );
		if (nfo[5] != nfo2[5]) {
			jQuery('#mod_ctime2').html( '<font color="red">'+ nfo2[5].replace(/~/g, ':') +'</font>' );
		} else {
			jQuery('#mod_ctime2').html( nfo2[5].replace(/~/g, ':') );
		}
		jQuery('#table_mod').show();
	}
}

function nfwjs_del_snapshot() {
	if ( confirm( nfwi18n.del_snapshot ) ) {
		return true;
	}
	return false;
}

function nfwjs_show_changes() {
	jQuery('#changes_table').slideDown();
	jQuery('#vcbtn').prop('disabled', true);
}

// =====================================================================
// Web Filter.

function mfwjs_check_webfilter() {

	// Disabled?
	if ( jQuery('#wf-enable').prop('checked') == false ) {
		return true;
	}

	var patterns = jQuery('#wf-pattern').val();
	var pattern_array = patterns.split( /[\r\n]+/ );

	if ( jQuery('#wf-pattern').val().length < 1 ) {
		alert( nfwi18n.empty_fields );
		jQuery('#wf-pattern').focus();
		return false;
	}

	var count = 0;
	for ( i = 0; i < pattern_array.length; ++i ) {
		if ( pattern_array[i]  ) {
			++count;
			if ( pattern_array[i].length < 4 || pattern_array[i].length > 150 ) {
				alert( nfwi18n.wrong_length );
				jQuery('#wf-pattern').focus();
				return false;
			}
			if ( pattern_array[i].includes('|') == true ) {
				alert( nfwi18n.disallow_char );
				jQuery('#wf-pattern').focus();
				return false;
			}
		}
	}
	if ( count < 1 ) {
		alert( nfwi18n.empty_fields );
		jQuery('#wf-pattern').focus();
		return false;
	}
	return true;
}

// =====================================================================
// Event Notifications.

function ac_radio_toogle( on_off, rbutton ) {
	var what = "nfw_options["+rbutton+"]";
	if ( on_off ) {
		document.nfwalerts.elements[what].disabled = false;
		document.nfwalerts.elements[what].focus();
	} else {
		document.nfwalerts.elements[what].disabled = true;
	}
}


// =====================================================================
// Login Protection.

function nfwjs_auth_user_valid() {
	var e = document.bp_form.elements['nfw_options[auth_name]'];
	if ( e.value.match(/[^-\/\\_.a-zA-Z0-9 ]/) ) {
		alert( nfwi18n.invalid_char );
		e.value = e.value.replace(/[^-\/\\_.a-zA-Z0-9 ]/g,'');
		return false;
	}
	if (e.value == 'admin') {
		alert( nfwi18n.no_admin );
		e.value = '';
		return false;
	}
}

function nfwjs_realm_valid() {
	var e = document.getElementById('realm').value;
	if ( e.length >= 1024 ) {
		alert( nfwi18n.max_char );
		return false;
	}
}

function nfwjs_getpost(request){
	if ( request == 'GETPOST' ) {
		request = 'GET/POST';
	}
	document.getElementById('get_post').innerHTML = request;
}

function nfwjs_toggle_submenu( enable ) {
	if ( enable == 0 ) {
		// Disable protection
		bf_enable = 0;
		jQuery('#submenu_table').slideUp();
		jQuery('#bf_table').slideUp();
		jQuery('#bf_table_extra').slideUp();
		jQuery('#bf_table_password').slideUp();
		jQuery('#bf_table_captcha').slideUp();
	} else {
		bf_enable = enable;
		jQuery('#submenu_table').slideDown();
		// Display the right table (captcha or password protection)
		nfwjs_toggle_table( enable, bf_type );
		jQuery('#bf_table_extra').slideDown();
	}
	// Enable/disable write to auth log
	if ( bf_enable == 1 ) {
		jQuery('#nfw-authlog').prop('disabled', false);
	} else {
		jQuery('#nfw-authlog').prop('disabled', true);
	}
}

function nfwjs_toggle_table( enable, type ) {
	if ( type == 1 ) {
		// Captcha
		bf_type = 1;
		if ( enable == 1 ) {
			// Yes, if under attack
			jQuery('#bf_table').slideDown();
		} else {
			// Always ON
			jQuery('#bf_table').slideUp();
		}
		jQuery('#bf_table_password').slideUp();
		jQuery('#bf_table_captcha').slideDown();
	} else { // type == 2
		//  Password
		bf_type = 0;
		if ( enable == 1 ) {
			// Yes, if under attack
			jQuery('#bf_table').slideDown();
		} else {
			// Always ON
			jQuery('#bf_table').slideUp();
		}
		jQuery('#bf_table_password').slideDown();
		jQuery('#bf_table_captcha').slideUp();
	}
}

function check_login_fields() {

	if ( jQuery('#ui-enabled').prop('checked') == false ) {
		return true;
	}

	if ( bf_enable < 1 ) {
		alert( nfwi18n.select_when );
		return false;
	}

	if ( document.bp_form.elements['nfw_options[bf_type]'].value == 0 ) {
		if ( document.bp_form.elements['nfw_options[auth_name]'].value == '' && document.bp_form.elements['nfw_options[auth_pass]'].value == '' ) {
			alert( nfwi18n.missing_auth );
			return false;
		}
	}
	return true;
}

// =====================================================================
// Antispam.

function check_asfields() {
	if ( document.as_form.elements['nfw_options[as_comment]'].checked == false && document.as_form.elements['nfw_options[as_register]'].checked == false ) {

		alert( nfwi18n.as_empty );
		return false;
	}
	return true;
}

// =====================================================================
// Firewall Log.

function nfwjs_filter_log() {
	// Clear the log
	document.frmlog.txtlog.value = '       DATE         INCIDENT  LEVEL'+
											'     RULE     IP            REQUEST\n';
	// Prepare the regex
	var nf_tmp = '';
	if ( document.frmlog.nf_crit.checked == true ) { nf_tmp += 'CRITICAL|'; }
	if ( document.frmlog.nf_high.checked == true ) { nf_tmp += 'HIGH|'; }
	if ( document.frmlog.nf_med.checked == true )  { nf_tmp += 'MEDIUM|'; }
	if ( document.frmlog.nf_upl.checked == true )  { nf_tmp += 'UPLOAD|'; }
	if ( document.frmlog.nf_nfo.checked == true )  { nf_tmp += 'INFO|'; }
	if ( document.frmlog.nf_dbg.checked == true )  { nf_tmp += 'DEBUG_ON|'; }
	// Return if empty
	if ( nf_tmp == '' ) {
		document.frmlog.txtlog.value = '\n > '+ nfwi18n.no_record;
		return true;
	}
	// Put it all together
	var nf_reg = new RegExp('^\\S+\\s+\\S+\\s+\\S+\\s+' + '(' + nf_tmp.slice(0, - 1) + ')' + '\\s');
	var nb = 0;
	var decodearray;
	for ( i = 0; i < myArray.length; ++i ) {
		decodearray = decodeURIComponent(myArray[i]);
		if ( document.frmlog.nf_today.checked == true ) {
			if (! decodearray.match(myToday) ) { continue;}
		}
		if ( decodearray.match(nf_reg) ) {
			// Display it :
			document.frmlog.txtlog.value += decodearray + '\n';
			++nb;
		}
	}
	if ( nb == 0 ) {
		document.frmlog.txtlog.value = '\n > '+ nfwi18n.no_record;
	}
}

function nfwjs_check_key() {

	var pubkey = jQuery('#clogs-pubkey').val();
	if ( pubkey == '' ) {
		return false;
	}
	if (! pubkey.match( /^[a-f0-9]{40}:(?:[a-f0-9:.]{3,39}|\*)$/) ) {
		jQuery('#clogs-pubkey').focus();
		alert( nfwi18n.invalid_key );
		return false;
	}
}

function nfw_ajax_ip( nonce ) {

	var ip = jQuery('input[name=nfw-ajax-ip]').val();
	if (! ip ) {
		alert( nfwi18n.missing_address );
		jQuery('#nfw-ajax-ip-id').focus();
		return false;
	}
	var ac_list = jQuery('select[name=nfw-ajax-ip-list]').val();

	// Ajax
	var data = {
		'action': 'nfw_add_ip',
		'nonce': nonce,
		'ac_list': ac_list,
		'ip': ip
	};
	jQuery.ajax( {
		type: "POST",
		url: ajaxurl,
		headers: {
			'Accept-Language':'en-US,en;q=0.5'
		},
		data: data,
		dataType: "text",
		success: function( response ) {
			if ( response != '200' ) {
				alert( response );
				jQuery('#nfw-ajax-ip-id').animate({backgroundColor: '#F08F8F'}, 'slow').animate({backgroundColor: 'default'}, 'slow');
			} else {
				jQuery('#nfw-ajax-label').css({opacity: 1.0, visibility: "visible"}).animate({opacity: 0}, 8000);
				jQuery('#nfw-ajax-ip-id').val('');
			}
		},
		// Display non-200 HTTP response
		error: function( xhr, status, err ) {
			alert( nfwi18n.http_error +' "'+ xhr.status +' '+ err +'".' );
			jQuery('#nfw-ajax-ip-id').animate({backgroundColor: '#F08F8F'}, 'slow').animate({backgroundColor: 'default'}, 'slow');
		}
	});
	return true;
}

// =====================================================================
// Centralized logging.

function nfwjs_clear_pubkey() {

	jQuery('#pubkey').html( '<font color="red">'+ nfwi18n.pukey_1 +
			'</font><p class="description">'+ nfwi18n.pukey_2 +'</p>' );
}

function nfwjs_centlog_check() {

	if ( jQuery('#clogs_table').css('display') == 'none' ) { return; }

	// Secret key
	var myseckey = jQuery('#clogs-seckey').val();
	if (! myseckey || ! myseckey.match( /^[\x20-\x7e]{30,100}$/ ) ) {
		alert( nfwi18n.missing_key );
		jQuery('#clogs-seckey').focus();
		return false;
	}
	// Server IP
	if (! jQuery('#clogs-ip').val() ) {
		alert( nfwi18n.missing_ip );
		jQuery('#clogs-ip').focus();
		return false;
	}
	// URI
	if ( jQuery('#clogs-urls').val().length < 11 ) {
		alert( nfwi18n.missing_url );
		jQuery('#clogs-urls').focus();
		return false;
	}
	return true;
}

// =====================================================================
// Live Log.

var livelog = 0;
var livecls = 0;
var lines = 0;
var livecount = 1;
var counter = 0;

function nfwjs_livelog() {

	if ( jQuery('#livelog-switch').prop('checked') == false ) {
		nfwjs_livelog_stop();
		return true;
	}
	if ( jQuery('#idtxtlog').val() == nfwi18n.live_log_desc || jQuery('#idtxtlog').val() == '' ) {
		jQuery('#idtxtlog').val( nfwi18n.no_traffic +' '+ liveinterval/1000 + nfwi18n.seconds +"\n" );
	}
	if ( scroll == 1 ) {
		document.getElementById('idtxtlog').scrollTop = document.getElementById('idtxtlog').scrollHeight;
	}
	jQuery('#nfw-progress').show();

	counter = setInterval( nfwjs_countdown, 1000 );
	livelog = setInterval( nfwjs_start_livelog, liveinterval );
}

function nfwjs_countdown() {
	if ( livecount <= ( liveinterval/1000 ) ) {
		jQuery('#nfw-progress').val( livecount++ );
	}
	jQuery('#nfw-progress').attr( 'max', liveinterval/1000 );
}

function nfwjs_start_livelog() {
	// Send HTTP request
	var data = {
		'livecls': livecls,
		'lines': lines
	};
	jQuery.ajax( {
		type: "POST",
		url: site_url,
		data: data,
		dataType: "text",
		success: function( response ) {
			if ( response == '' ) {
				jQuery('#idtxtlog').val( nfwi18n.no_traffic +' '+ liveinterval/1000 + nfwi18n.seconds +"\n" );
			} else if ( response != '*' ) {
				if ( response.charAt(0) != '^' ) {
					jQuery('#idtxtlog').val( nfwi18n.err_unexpected + "\n\n" + response );
					// Stop
					nfwjs_livelog_stop( 'force' );
					return;
				} else {
					var line = response.substr(1);
					line = line.replace( '<?php exit; ?>', '' );
					if ( line != '' ) {
						// Get number of lines
						var res = line.split(/\n/).length - 1;
						// Work around for old IE bug
						if (! res ) { res = 1; }
						if ( lines == 0 ) {
							document.liveform.txtlog.value = line;
						} else {
							document.liveform.txtlog.value += line;
						}
						lines += res;
						if ( scroll ) {
							document.getElementById('idtxtlog').scrollTop = document.getElementById('idtxtlog').scrollHeight;
						}
					}
				}
			}
		},
		// Display non-200 HTTP response
		error: function( xhr, status, err ) {
			if ( xhr.status == 404 ) {
				document.liveform.txtlog.value += nfwi18n.error_404 +' '+ site_url + "\n";
			} else if ( xhr.status == 503 ) {
				document.liveform.txtlog.value += nfwi18n.log_not_found + "\n";
			} else {
				document.liveform.txtlog.value += nfwi18n.http_error +' '+ xhr.status + "\n";
			}
			// Stop
			nfwjs_livelog_stop( 'force' );
			return;
		}
	});
	livecls = 0;
	livecount = 1;

	if ( jQuery('#idtxtlog').val() == nfwi18n.live_log_desc ) {
 		jQuery('#idtxtlog').val( nfwi18n.no_traffic +' '+ liveinterval/1000 + nfwi18n.seconds +"\n" );
	}
	return false;
}

function nfwjs_livelog_stop( force ) {
	// Clear timer
	if ( livelog != 0 ) {
		clearInterval( livelog );
		livelog = 0;

		clearInterval( counter );
		livecount = 1;
	}

	jQuery('#nfw-progress').hide();
	jQuery('#nfw-progress').val( 0 );

	var textarea = jQuery('#idtxtlog').val();
	if ( textarea.includes( nfwi18n.no_traffic ) ) {
		jQuery('#idtxtlog').val( nfwi18n.live_log_desc );
	}

	lines = 0;

	if ( force == 'force' ) {
		jQuery('#livelog-switch').prop('checked', false);
	}
}

function nfwjs_cls() {
	if ( jQuery('#livelog-switch').prop('checked') == true ) {
		jQuery('#idtxtlog').val( nfwi18n.no_traffic +' '+ liveinterval/1000 + nfwi18n.seconds +"\n" );
	} else {
		jQuery('#idtxtlog').val( '' );
	}
	livecls = 1;
	lines = 0;
}

function nfwjs_change_int( intv ) {
	liveinterval = intv;
	nfwjs_create_cookie( 'nfwintval', intv );
	// We must restart
	if ( livelog != 0 ) {
		clearInterval( livelog );
		livelog = 0;
		var textarea = jQuery('#idtxtlog').val();
		if ( textarea.includes( nfwi18n.no_traffic ) ) {
			jQuery('#idtxtlog').val( nfwi18n.no_traffic +' '+ liveinterval/1000 + nfwi18n.seconds +"\n" );
		}
		livelog = setInterval( nfwjs_start_livelog, liveinterval );

		clearInterval( counter );
		livecount = 1;
		counter = setInterval( nfwjs_countdown, 1000 );
	}
}

function nfwjs_is_scroll() {
	if ( jQuery('#livescroll').prop('checked') == true ) {
		scroll = 1;
		if ( livelog != 0 ) {
			document.getElementById('idtxtlog').scrollTop = document.getElementById('idtxtlog').scrollHeight;
		}
		nfwjs_create_cookie( 'nfwscroll', scroll );
	} else {
		scroll = 0;
		nfwjs_delete_cookie( 'nfwscroll' )
	}
}

function nfwjs_create_cookie( name, value ) {
	var d = new Date();
	d.setTime(d.getTime() + ( 365 * 24 * 60 * 60 * 1000) );
	var expires = "expires=" + d.toUTCString();
	document.cookie = name +'=' + value + "; " + expires;
}

function nfwjs_delete_cookie( name ) {
	document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function nfwjs_lv_select( value ) {
	if ( value > 0 ) {
		jQuery('#lr-disabled').prop('disabled', false);
		jQuery('#lr-disabled').focus();
	} else {
		jQuery('#lr-disabled').prop('disabled', true);
	}
}

// =====================================================================
// About.

function nfwjs_about_table(table_id) {
	var av_table = [11, 12, 13, 14, 15];
	for (var i = 0; i < av_table.length; ++i) {
		if ( table_id == av_table[i] ) {
			jQuery("#" + table_id).slideDown();
		} else {
			jQuery("#" + av_table[i]).slideUp();
		}
	};
}

// =====================================================================
// EOF
