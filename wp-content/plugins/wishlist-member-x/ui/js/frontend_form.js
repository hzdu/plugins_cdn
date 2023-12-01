function wlm3_random_password() {
	var chars = ['0123456789', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz', '~!@#$%^&*()_-+={[}]<>?'];
	var randomstring = '';
	for(var c = 0; c < chars.length; c++) {
		for (var i=0; i<5; i++) {
			var rnum = Math.floor(Math.random() * Math.floor(chars[c].length)/5);
			randomstring += chars[c].substring(rnum,rnum+1);
		}	
	}
	return randomstring.split('').sort(function(){return 0.5-Math.random()}).join('');	
}

function wlm3_password_size(hash) {
	var $buttons = jQuery('#wlm3-password-generator-buttons' + hash);
	$buttons.show();
	var w = $buttons.width() + 10;
	jQuery('#wlm3-password-field' + hash).css('width', 'calc(100% - ' + w + 'px');
	jQuery('#wlm3-password-generator-strength' + hash).show().css('width', 'calc(100% - ' + w + 'px');

}

function wlm3_password_strength(el, hash) {
	wlm3_password_size(hash);
	var strengthResult = jQuery('#wlm3-password-generator-strength' + hash);
	strengthResult.removeClass('bad good strong short');

	if(wlm3_password_strength_check(el.value)) {
		strengthResult.addClass('strong').html( wp.i18n.__( 'Strong', 'wishlist-member' ) );
	} else {
		strengthResult.addClass('bad').html( wp.i18n.__( 'Weak', 'wishlist-member' ) );
	}
}

function wlm3_generate_password(hash) {
	var fld = jQuery('#wlm3-password-field' + hash);
	fld.show();
	fld.val(wlm3_random_password());
	fld.attr('type', 'text');
	jQuery('#wlm3-password-generator-toggle' + hash).text( wp.i18n.__( 'Hide', 'wishlist-member' ) );
	jQuery('#wlm3-password-generator-buttons' + hash).show();

	jQuery('#wlm3-password-generator-button' + hash).hide();
	wlm3_password_size(hash);
	fld.trigger('keyup');
}

function wlm3_generate_password_toggle(el, hash) {
	var fld = jQuery('#wlm3-password-field' + hash)[0];
	if(fld.type == 'password') {
		fld.type = 'text';
		el.innerText = jQuery(el).data('hide');
	} else {
		fld.type = 'password';
		el.innerText = jQuery(el).data('show');
	}

	var w = jQuery('#wlm3-password-generator-buttons' + hash).width() + 10;
	wlm3_password_size(hash);
}

function wlm3_generate_password_hide(hash) {
	var fld = jQuery('#wlm3-password-field' + hash);
	fld.hide();
	fld.val('');
	jQuery('#wlm3-password-generator-buttons' + hash).hide();
	jQuery('#wlm3-password-generator-button' + hash).show();
	jQuery('#wlm3-password-generator-strength' + hash).hide();
}

function wlm3_password_strength_check(password) {
		if(password.length < 12) return false;
		if(!password.match(/[A-Z]/g)) return false;
		if(!password.match(/[a-z]/g)) return false;
		if(!password.match(/[0-9]/g)) return false;
		if(!password.match(/[`~!@#$%^&*()-_=+\[{\]}|;:",<\.>\'\?]/g)) return false;
		return true;
}

function wlm3_register_disable_prefill() {
	if(jQuery('input[name="mergewith"]').val() == null) {
		return;
	} 
	if (jQuery('input[name="orig_firstname"]').val() != "") {
	  jQuery('input[name="firstname"]').attr("readonly", "readonly");
	}
	if (jQuery('input[name="orig_lastname"]').val() != "") {
	 jQuery('input[name="lastname"]').attr("readonly", "readonly");
	}
	if (jQuery('input[name="orig_email"]').val() != "") {
	 jQuery('input[name="email"]').attr("readonly", "readonly");
	}
}

jQuery(function($) {
	var fancys = jQuery('a.wlm3-tos-fancybox')
	if(fancys.length) {
		fancys.fancybox({
			baseClass : 'wlm3-fancybox'
		});
	}

	/**
	 * Set profile photo to file upload value
	 * @param  object event Change event
	 */
	$( '.wlm3-profile-photo-container input[type="file"]' ).on( 'change', function( event ) {
		var reader = new FileReader();
		var $container = $(this).closest('.wlm3-profile-photo-container');
		$container.removeClass( '-clean' );
		var img = $container.find('.wlm3-profile-photo img')[0];
		var hidden = $container.find('input[type="hidden"]')[0];
    reader.onload = function (e) {
			// get loaded data and render thumbnail.
			img.src = e.target.result;
    };
		if(this.value.match(/^.+?\.(jpg|jpeg|png)/i)) {
			// read the image file as a data URL.
			reader.readAsDataURL(this.files[0]);
			hidden.value = this.value;
		} else {
			alert( 'JPG and PNG files only' );
		}
	} );
	
	/**
	 * Clear profile photo
	 * @param  object event Click event
	 */
	$( '.wlm3-profile-photo-clear' ).on( 'click', function ( event ) {
		event.preventDefault();
		var $container = $( this ).closest( '.wlm3-profile-photo-container' );
		$container.removeClass( '-clean' );
		$container.find( 'input[type="hidden"]' ).val( 'delete' );
		$container.find( 'input[type="file"]' ).val( '' );
		$container.find( 'img.profile-photo' ).attr( 'src', WLM3VARS.pluginurl + '/assets/images/grey.png' );
	} );
	
	/**
	 * Set profile photo to gravatar
	 * @param  object event Click event
	 */
	$( '.wlm3-profile-photo-gravatar').on( 'click', function ( event ) {
		event.preventDefault();
		var $container = $( this ).closest( '.wlm3-profile-photo-container' );
		$container.removeClass( '-clean' );
		$container.find( 'input[type="hidden"]' ).val( 'gravatar' );
		$container.find( 'input[type="file"]' ).val( '' );
		var $img = $container.find( 'img.profile-photo' );
		$img.attr( 'src', $img.attr( 'gravatar-src') );
	} );
	
	/**
	 * Undo unsaved changes to profile photo
	 * @param  object event Click event
	 */
	$( '.wlm3-profile-photo-undo' ).on( 'click', function ( event ) {
		event.preventDefault();
		var $container = $( this ).closest( '.wlm3-profile-photo-container' );
		$container.addClass( '-clean' );
		var $hidden = $container.find( 'input[type="hidden"]' );
		var $img = $container.find( 'img.profile-photo' );
		
		$container.find( 'input[type="file"]' ).val( '' );
		$hidden.val( $hidden.attr( 'old-src' ) );
		$img.attr( 'src', $img.attr( 'old-src') );
	} );
});

