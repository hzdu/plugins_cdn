/**
 * Ajax login javascript
 *
 * @package WishListMember\Features\Ajax_Login
 */

jQuery(
	function($) {
		/**
		 * Remove login form messages.
		 */
		const remove_messages = function() {
			$( '.wlm-ajax-login-error, .wlm-ajax-login-notice:not(.-permanent)' ).remove();
		}

		/**
		 * Display messages
		 *
		 * @param  {array} messages               Array of messages to display.
		 * @param  {string} type                   Message type. Can be error or notice
		 * @param  {object} form                   Form object
		 */
		const show_messages = function ( messages, type, form ) {
			remove_messages();
			var d = [
				'<div class="wlm-ajax-login-' + type + '">',
				'</div>'
			];
			$( d[0] + messages.join( d[1] + d[0] ) + d[1] ).prependTo( form );
		}

		/**
		 * Toggle form.
		 *
		 * @param  {object} trigger The object that triggered the event.
		 * @param  {string} target  Target class name.
		 * @return (object} Form object
		 */
		const toggle_form = function( trigger, target ) {
			var ff = find_form( trigger, target );
			ff.container.find( '[class*="wlm-ajax-login-form"]' ).slideUp();
			return ff.form.slideDown();
		}

		/**
		 * Find form.
		 *
		 * @param  {object} trigger The object that triggered the event.
		 * @param  {string} target  Target class name.
		 * @return {object} {
		 *   Object container form and container.
		 *   @type {object} form Form object
		 *   @type {object} form Form Container
		 * }
		 */
		const find_form = function( trigger, target ) {
			$container = $( trigger ).closest( '.wlm-ajax-login' );
			return {form:$container.find( target ), container:$container};
		}

		// ajax login event handler.
		$( 'body' ).on(
			'submit',
			wlm_ajax_login_forms.join( ',' ),
			function(e) {
				if ($( this ).hasClass( '-no-ajax-login' )) {
					return true;
				}
				e.preventDefault();
				const form = this;
				const el   = form.elements;

				$.post(
					wlm_ajax_login_url,
					{
						action: 'wishlistmember_ajax_login',
						u: el.log.value,
						p: el.pwd.value,
						n: wlm_ajax_login_nonce
					},
					function(r) {
						if (r.success) {
							$( form ).addClass( '-no-ajax-login' ).submit();
						} else {
							show_messages( r.data, 'error', form );
						}
					}
				);
			}
		);

		// ajax lost password event handler.
		$( 'body' ).on(
			'submit',
			'form.wlm-ajax-login-form-lost',
			function(e) {
				e.preventDefault();
				const form = this;
				const el   = form.elements;

				$.post(
					wlm_ajax_login_url,
					{
						action: 'wishlistmember_ajax_login_lostpassword',
						user_login: el.user_login.value,
						n: wlm_ajax_login_nonce
					},
					function(r) {
						if (r.success) {
							form.reset();
							show_messages( r.data,'notice',find_form( form,'.wlm-ajax-login-form' ).form );
							toggle_form( form, '.wlm-ajax-login-form' );
						} else {
							show_messages( r.data, 'error', form );
						}
					}
				);
			}
		);

		// OTL event handler.
		$( 'body' ).on(
			'submit',
			'form.wlm-ajax-login-form-otl',
			function(e) {
				e.preventDefault();
				const form = this;
				const el   = form.elements;

				$.post(
					wlm_ajax_login_url,
					{
						action: 'wishlistmember_ajax_login_otl',
						user_login: el.user_login.value,
						n: wlm_ajax_login_nonce
					},
					function(r) {
						if (r.success) {
							form.reset();
							show_messages( r.data,'notice', form )
						} else {
							show_messages( r.data, 'error', form );
						}
					}
				);
			}
		);

		// show login form.
		$( 'body' ).on(
			'click',
			'[href*="action=login"]',
			function(e) {
				e.preventDefault();
				remove_messages();
				toggle_form( this,'.wlm-ajax-login-form' );
			}
		);
		// show lost password form.
		$( 'body' ).on(
			'click',
			'[href*="action=lostpassword"]',
			function(e) {
				e.preventDefault();
				remove_messages();
				toggle_form( this,'.wlm-ajax-login-form-lost' );
			}
		);
		// show otl form.
		$( 'body' ).on(
			'click',
			'[href*="action=wishlistmember-otl"]',
			function(e) {
				e.preventDefault();
				remove_messages();
				toggle_form( this,'.wlm-ajax-login-form-otl' );
			}
		);
	}
);
