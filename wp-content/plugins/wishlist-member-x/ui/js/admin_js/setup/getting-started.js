/**
 * Getting Started JS File
 *
 * @package WishListMember/Wizard
 */

/**
 * Set permalink based on dropdown.
 */
$( 'body' ).on(
	'change',
	'#site-permalink-dropdown',
	function() {
		let v = $( this ).val();
		v != '-' && $( '#site-permalink' ).val( v ).change();
		$( '#permalink-buttons' ).toggleClass( 'd-none', v != '-' );
		$( '#site-permalink-dropdown ~ .form-text' ).css( 'white-space', 'nowrap' );
	}
);

/**
 * Toggle permalink buttons active status on permalink change or keyup. also update permalink example.
 */
$( 'body' ).on(
	'change keyup',
	'#site-permalink',
	function() {
		var v = $( this ).val();
		$( '#permalink-buttons a' ).each(
			function() {
				$( this ).toggleClass( '-active', ! ! v.match( new RegExp( this.dataset.code ) ) );
			}
		);

		var codes = this.value.match( /%\w+%/g );
		if (codes) {
			var sample = this.value;
			codes.forEach(
				function(c) {
					if (wlm_wizard.permalink_replacements[c]) {
						sample = sample.replace( c, wlm_wizard.permalink_replacements[c] );
					}
				}
			);
		} else {
			sample = '/?p=123';
		}
		$( '#site-permalink-dropdown ~ .form-text' ).text( 'Example: ' + wlm_wizard.site_url + sample.replace( /\/\/+/g, '/' ) );
	}
);

/**
 * Add/remove permalink code to/from permalink field
 */
$( 'body' ).on(
	'click',
	'#permalink-buttons a',
	function() {
		var v = $( '#site-permalink' ).val();
		if ($( this ).hasClass( '-active' )) {
			v = v.replace( this.dataset.code, '' );
		} else {
			v += '/' + this.dataset.code + '/';
		}
		v = v.replace( /\/\/+/g, '/' ).trim()
		if ('/' === v) {
			v = '';
		}
		$( '#site-permalink' ).val( v ).trigger( 'permalink-code-insert' ).change();
	}
);

/**
 * Set permalink to dropdown to custom on permalink field focus or permalink-code-insert events
 *
 * @return {[type]} [description]
 */
$( 'body' ).on(
	'focus permalink-code-insert',
	'#site-permalink',
	function() {
		$( '#site-permalink-dropdown' ).val( '-' ).change();
	}
);

/**
 * Save step data and move to next step.
 */
$( 'body' ).on(
	'click',
	'.-wizard-next',
	function() {
		if ($( this ).hasClass( 'skip-license' )) {
			$( 'input[name="license"]' ).val( '****************' );
		}
		wlm_wizard_click_ajax( 'next' );
	}
);

/**
 * Move to previous step.
 */
$( 'body' ).on(
	'click',
	'button.-wizard-prev',
	function() {
		var datastep  = document.getElementById( 'wizard-container' ).dataset;
		datastep.step = $( '#' + datastep.step ).prev().prop( 'id' );
		history.pushState( null, null, '#' + (datastep.step) );
		wlm_update_progress_bar( -1 );
	}
);

$( 'body' ).on(
	'click',
	'.step-progress-item',
	function(){
		var target   = this.id.replace( 'progress-item-','' );
		var datastep = document.getElementById( 'wizard-container' ).dataset.step = target;
		history.pushState( null, null, '#' + target );

		wlm_wizard.current_step = 0
		wlm_update_progress_bar( $( '.step-progress-item' ).index( this ) + 1 );
	}
);

/**
 * Exit wizard.
 */
$( 'body' ).on(
	'click',
	'.-exit-wizard',
	function() {
		wlm_wizard_click_ajax( 'exit' );
	}
);

/**
 * Update screen on save success
 */
$( 'body' ).on(
	'wlm_wizard_ran',
	function( e, stepname, result  ) {
		switch ( stepname ) {
			case 'membership-levels':
				// Remove extra level fields.
				$( '.row.membership-levels:not(:first)' ).remove();

				// Reset level name.
				$( 'input.membership-level' ).val( '' );

				// Append new levels to table.
				'levels/name' in result.data && result.data['levels/name'].forEach(
					function(n) {
						n = n.trim();
						if (n) {
							$( '.existing-levels table tbody' ).append( '<tr class="d-flex"><td class="col-12">' + n + '</td></tr>' );
							$( '.existing-levels' ).removeClass( 'd-none' );
						}
					}
				);
				break;
			case 'membership-pages':
				$( '[name="pages/login/styled"]' ).prop( 'checked', false );
				$( '[name="pages/registration/free"]' ).prop( 'checked', false );
				$( '[name="pages/registration/paid"]' ).prop( 'checked', false );
				$( '[name="pages/onboarding"]' ).prop( 'checked', false );
				$( '[name="pages/dashboard"]' ).prop( 'checked', false );
				break;
			case 'integrations':
				// Add "Already Enabled" to selected payment provider.
				if ('integration/payment' in result.data) {
					var o = $( 'select[name="integration/payment"] option[value="' + result.data['integration/payment'] + '"]' );
					o.text( o.text().replace( /\s*\(.+?\).*$/, '' ).replace( /\s*$/, ' (' + wp.i18n.__( 'Already Enabled', 'wishlist-member' ) + ')' ) );
					$( 'select[name="integration/payment"]' ).select2();
				}
				// Add "Already Enabled" to selected email provider.
				if ('integration/email' in result.data) {
					var o = $( 'select[name="integration/email"] option[value="' + result.data['integration/email'] + '"]' );
					o.text( o.text().replace( /\s*\(.+?\).*$/, '' ).replace( /\s*$/, ' (' + wp.i18n.__( 'Already Enabled', 'wishlist-member' ) + ')' ) );
					$( 'select[name="integration/email"]' ).select2();
				}
				break;
		}
	}
);

function wlm_wizard_click_ajax( process ) {
	var datastep = document.getElementById( 'wizard-container' ).dataset
	var stepid   = datastep.step;
	var stepname = document.getElementById( stepid ).dataset.stepName;
	$( '.activation-result' ).addClass( 'd-none' ).text( '' );
	$.post(
		WLM3VARS.ajaxurl,
		{
			[wlm_wizard.noncekey] : wlm_wizard.nonce,
			action: 'wlm_wizard_steps_handler',
			process: process,
			data: $( '#' + stepid + ' :input' ).serialize(),
			step: datastep.step,
			stepname: stepname
		},
		function(result) {
			if (result.success) {
				if ('next' === process) {
					datastep.step = $( '#' + stepid + ' + .card.wizard' ).prop( 'id' );
					history.pushState( null, null, '#' + (datastep.step) );
					$( 'body' ).trigger( 'wlm_wizard_ran', [stepname, result] );
					wlm_update_progress_bar( 1 );
				}

				// display success message if any.
				if ('data' in result && result.data.message) {
					$( '.wlm-message-holder' ).show_message( {message: result.data.message, type: 'success' } );
				}
				// redirect if told to.
				if ('data' in result && result.data.redirect) {
					window.location = result.data.redirect
				}
			} else {
				if (stepname === 'license') {
					$( '.wizard-step-result' ).html( result.data.message ).removeClass( 'd-none' );
				} else {
					// display error message.
					if (result.data.message) {
						$( '.wizard-step-result' ).html( result.data.message ).removeClass( 'd-none' );
					} else {
						$( '.wizard-step-result' ).html( wp.i18n.__( 'An error occured.','wishlist-member' ) ).removeClass( 'd-none' );
					}
				}
			}
			return result;
		}
	)
}

function wlm_update_progress_bar(increment) {
	wlm_wizard.current_step += increment;
	if ($( '.wlm-step-progress-container' ).length) {
		wlm_vimeo_stop_all();
		$( '.wlm-step-progress-container .step-progress-item' ).removeClass( 'current done' );
		$( '.card.wizard.wizard-form' ).addClass( 'd-none' );

		$( '.wlm-step-progress-container div.step-progress-item:not(:nth-of-type(n+' + wlm_wizard.current_step + '))' ).addClass( 'done' );

		var $step = $( '.wlm-step-progress-container div.step-progress-item:nth-of-type(' + wlm_wizard.current_step + ')' );
		$step.addClass( 'current' );
		$( '.card.wizard.wizard-form[data-step-name="' + $step.attr( 'id' ).replace( 'progress-item-','' ) + '"]' ).removeClass( 'd-none' )
	} else {
		$( '.card.wizard.wizard-form' ).removeClass( 'd-none' );
	}
	$('.wizard-step-result').addClass('d-none').html('');
	$('[name="license_only"]').val() || wlm_vimeo_play_visible();
}

function wlm_vimeo_stop_all() {
	if (typeof Vimeo !== 'undefined') {
		$( '.wlm-wizard-vimeo iframe' ).each(
			function() {
				var iframe = this;
				var p      = new Vimeo.Player( iframe );
				p.pause();
			}
		);
	} else {
		setTimeout( arguments.callee,500 );
	}
}

function wlm_vimeo_play_visible() {
	if (typeof Vimeo !== 'undefined') {
		$( '.wlm-wizard-vimeo iframe:visible' ).each(
			function() {
				var iframe = this;
				p          = new Vimeo.Player( iframe );
				p.getPlayed().then(
					function(played){
						played.length || p.play();
					}
				);
			}
		);
	} else {
		setTimeout( arguments.callee,500 );
	}
}

/**
 * Add level field.
 */
$( 'body' ).on(
	'click',
	'#add-level',
	function() {
		$( '.row.membership-levels:first' ).clone().insertAfter( $( '.row.membership-levels:last' ) );
		$( '.row.membership-levels:last :input' ).val( '' ).focus();
	}
);

/**
 * Remove level field.
 */
$( 'body' ).on(
	'click',
	'.remove-level-btn',
	function() {
		$( this ).closest( 'div.row.membership-levels' ).remove();
	}
);

/**
 * Initialization
 */
$(
	function() {
		// Generate progress bars per screen.
		Object.keys( wlm_wizard.step_titles ).forEach(
			function(t,s) {
				$( '.wlm-step-progress-container' ).append( '<div id="progress-item-' + t + '" class="step-progress-item"><div class="wlm-circle"><span class="step-progress-num">' + (++s) + '</span></div><span class="step-progress-title">' + wlm_wizard.step_titles[t] + '</span></div>' );
			}
		);

		$( '.site-permalink-dropdown' ).css(
			{
				minWidth: '200px',
				maxWidth: '200px',
				width: '200px'
			}
		);
		$( '[data-default-value]' ).each(
			function() {
				$( this ).val( $( this ).data( 'default-value' ) ).change();
			}
		);
		var p = $( '#site-permalink' ).val();
		p     = $( '#site-permalink-dropdown option[value="' + p + '"]' ).length ? p : '-';
		$( '#site-permalink-dropdown' ).val( p ).change();

		var wizard_screen = document.getElementById( 'wizard-container' ).dataset;
		if ( location.hash && $( '.card.wizard' + location.hash ).length ) {
			wizard_screen.step = location.hash.substring( 1 );
		} else if ( ! wizard_screen.step) {
			wizard_screen.step = $( '#wizard-container .card.wizard' ).first().data( 'stepName' );
		}
		wlm_update_progress_bar(
			Object.keys( wlm_wizard.step_titles ).findIndex(
				function(s) {
					return wizard_screen.step == s;
				}
			)
		);
	}
);
