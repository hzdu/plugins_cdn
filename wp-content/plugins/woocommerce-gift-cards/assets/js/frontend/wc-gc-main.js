/* global wc_gc_params, WCSViewSubscription */
( function( $, document, window ) {

	/**
	 * Sanity check for other globals.
	 */
	if ( typeof window.WC_GC !== 'undefined' ) {
		window.console.error( 'A global window variable with the name "WC_GC" already exists. Exiting...' );
		return;
	}

	/**
	 * Document ready.
	 */
	$( function() {
		// Start the engines.
		window.WC_GC.init();
	} );

	/*-----------------------------------------------------------------*/
	/*  WC_GC_Controller                                               */
	/*-----------------------------------------------------------------*/

	/**
	 * Giftcards view controller.
	 *
	 * @constructor
	 */
	function WC_GC_Controller() {

		// Singleton.
		var instance;

		// Rewrite the constructor.
		WC_GC_Controller           = function WC_GC_Controller() {
			return instance;
		};

		WC_GC_Controller.prototype = this;
		instance                   = new WC_GC_Controller();
		instance.constructor       = WC_GC_Controller;

		// UI Handlers.
		this.handlers              = {
			'cart'     : new WC_GC_Cart_Form_Handler(),
			'checkout' : new WC_GC_Checkout_Form_Handler(),
		};

		// Integrations.
		this.integrations          = {
			'subscriptions' : new WC_GC_WCS_Toggle_Controller()
		};

		$( document.body ).trigger( 'wc_gc_before_init', [ this ] );
	}

	/**
	 * Init on document ready.
	 *
	 * @this WC_GC_Controller
	 * @return {void}
	 */
	WC_GC_Controller.prototype.init = function() {

		/**
		 * Bail early if document not ready.
		 */
		if ( 'loading' === document.readyState ) {
			window.console.error( 'WC_GC_Controller called incorrectly. Please use this function after the DOM finishes loading. Exiting...' );
			return;
		}

		/**
		 * Register handlers.
		 */
		 this.handlers.cart.register_events();
		 this.handlers.checkout.register_events();

		 /**
		 * Register integrations.
		 */
		 this.integrations.subscriptions.init();

		/**
		 * Prevent accidental submit of random HTML forms.
		 */
		$( document ).on( 'keydown', '#wc_gc_cart_code', this.prevent_accidental_submiting );

		/*
		 * Init datepickers.
		 */
		$( '.woocommerce_gc_giftcard_form' ).wc_gc_datepickers();

		/*
		 * Broadcast init.
		 */
		$( document.body ).trigger( 'wc_gc_init', [ this ] );
	};

	/**
	 * Function that prevents the 'Enter' key to sumbit an unrelated form.
	 *
	 * @this WC_GC_Controller
	 * @param  {event} e
	 * @return {void}
	 */
	WC_GC_Controller.prototype.prevent_accidental_submiting = function( e ) {
		var key = e.which || e.keyCode || 0;

		if ( 13 == key) {
			e.preventDefault();

			var $this = $( parse_event_target( e ) ),
				code  = $this.val();

			if ( ! code ) {
				return;
			}

			// Submit the actual gc form.
			var $form   = $this.closest( '.add_gift_card_form' ),
				$button = $form.find( '#wc_gc_cart_redeem_send' );

			if ( $button.length ) {
				$button.trigger( 'click' );
			}
		}
	};

	/*-----------------------------------------------------------------*/
	/*  WC_GC_Checkout_Form_Handler                                    */
	/*-----------------------------------------------------------------*/

	/**
	 * Gift Card Checkout Apply Form handler.
	 */
	function WC_GC_Checkout_Form_Handler() {

		// Shared memory between events.
		this.$notices_container     = $( '<div/>' );
		this.requires_async_process = false;

		// Restore context.
		this.handle_remove          = this.handle_remove.bind( this );
		this.handle_form            = this.handle_form.bind( this );
		this.handle_checkout        = this.handle_checkout.bind( this );
	}

	/**
	 * Register WooCommerce Checkout events.
	 *
	 * @this WC_GC_Checkout_Form_Handler
	 * @return {void}
	 */
	WC_GC_Checkout_Form_Handler.prototype.register_events = function() {
		var $checkout_parent_container = $( '.woocommerce-checkout' );
		$checkout_parent_container.on( 'click', '#wc_gc_cart_redeem_send', this.handle_form );
		$checkout_parent_container.on( 'click', '.wc_gc_remove_gift_card', this.handle_remove );

		/*
		 * Handle Checkout updated.
		 */
		$( document.body ).on( 'updated_checkout', this.handle_checkout );
	};

	/**
	 * WooCommerce Checkout 'updated_checkout' event.
	 *
	 * @this WC_GC_Checkout_Form_Handler
	 * @param  {event} e
	 * @return {void}
	 */
	WC_GC_Checkout_Form_Handler.prototype.handle_checkout = function() {

		// If not required process, clear and exit.
		if ( ! this.requires_async_process ) {
			this.$notices_container.html( '' );
			return;
		}

		// Search for newly created GC form and add notices. If the form in inside the replaced DOM we need to re-add them.
		var $form = $( '.woocommerce-checkout-payment, .woocommerce-checkout-review-order-table' ).find( '.add_gift_card_form' );
		if ( ! $form.length ) {
			this.requires_async_process = false;
			return;
		}

		var $notices_parent = $form.find( '.wc_gc_add_gift_card_form__notices' );
		if ( ! $notices_parent ) {
			this.requires_async_process = false;
			return;
		}

		$notices_parent.html( this.$notices_container );

		// Reset usage.
		this.requires_async_process = false;
	};

	/**
	 * Handle WooCommerce Checkout giftcard submit form.
	 *
	 * @this WC_GC_Checkout_Form_Handler
	 * @param  {event} e
	 * @return {void}
	 */
	WC_GC_Checkout_Form_Handler.prototype.handle_form = function( e ) {
		e.preventDefault();

		var self            = this,
			$button         = $( parse_event_target( e ) ),
			$form           = $button.closest( '.add_gift_card_form' ),
			$notices_parent = $form.find( '.wc_gc_add_gift_card_form__notices' ),
			$code           = $form.find( '#wc_gc_cart_code' ),
			code            = $code.val();

		if ( ! code ) {
			return;
		}

		// Block.
		$button.prop( 'disabled', true );
		$( document.body ).trigger( 'wc_gc_before_checkout_form_submit' );

		$.ajax( {
			type:     'post',
			url:      get_url( 'apply_gift_card_to_session' ),
			data:     'wc_gc_is_checkout=true&wc_gc_cart_code=' + code + '&security=' + wc_gc_params.security_redeem_card_nonce,
			dataType: 'json',
			success:  function( response ) {

				if ( 'success' === response.result ) {

					if ( 'yes' === response.applied ) {

						$( document.body ).trigger( 'update_checkout' );
						// Mark for later process.
						self.requires_async_process = true;
					}

					// Add notices.
					self.$notices_container.html( response.notices_html );
					self.$notices_container.hide();

					$( document.body ).trigger( 'wc_gc_checkout_form_submit' );
					$notices_parent.html( self.$notices_container );
					self.$notices_container.fadeIn( 'fast' );

					// Clear value.
					$code.val( '' );
				}

				// Unblock and refetch.
				$button.prop( 'disabled', false );
			}
		} );
	};

	/**
	 * Handle WooCommerce Checkout giftcard remove buttons.
	 *
	 * @this WC_GC_Checkout_Form_Handler
	 * @param  {event} e
	 * @return {void}
	 */
	WC_GC_Checkout_Form_Handler.prototype.handle_remove = function( e ) {
		e.preventDefault();

		var $el           = $( parse_event_target( e ) ),
		    giftcard_id   = $el.data( 'giftcard' );

		if ( giftcard_id ) {

			var $remove_input = $( '<input />' );
			// Add props.
			$remove_input.prop( 'type', 'hidden' );
			$remove_input.prop( 'class', 'wc_gc_cart_remove_giftcards' );
			$remove_input.prop( 'name', 'wc_gc_cart_remove_giftcards' );

			// Add id to be removed.
			$remove_input.appendTo( '#order_review' );
			$remove_input.val( giftcard_id );

			// Events.
			$( document.body ).trigger( 'update_checkout' );

			// Clear input for sanity.
			setTimeout( function() {
				$remove_input.remove();
			}, 500 );
		}

		return false;
	};

	/*-----------------------------------------------------------------*/
	/*  WC_GC_Cart_Form_Handler                                        */
	/*-----------------------------------------------------------------*/

	/**
	 * Gift Card Apply Form handler.
	 *
	 * @constructor
	 */
	function WC_GC_Cart_Form_Handler() {

		// Single notices DOM  container.
		this.$notices_container = $( '<div/>' );

		// Restore context.
		this.handle_submit      = this.handle_submit.bind( this );
		this.handle_remove      = this.handle_remove.bind( this );
		this.handle_checkbox    = this.handle_checkbox.bind( this );
	}

	/**
	 * Register WooCommerce Cart events.
	 *
	 * @this WC_GC_Cart_Form_Handler
	 * @param  {event} e
	 * @return {void}
	 */
	WC_GC_Cart_Form_Handler.prototype.register_events = function() {
		var $cart_parent_container = $( '.woocommerce-cart' );
		$cart_parent_container.on( 'change', '#use_gift_card_balance', this.handle_checkbox );
		$cart_parent_container.on( 'click', '.wc_gc_remove_gift_card', this.handle_remove );
		$cart_parent_container.on( 'click', '#wc_gc_cart_redeem_send', this.handle_submit );
	};

	/**
	 * Handle WooCommerce Cart 'Use balance' toggle.
	 *
	 * @this WC_GC_Cart_Form_Handler
	 * @param  {event} e
	 * @return {void}
	 */
	WC_GC_Cart_Form_Handler.prototype.handle_checkbox = function( e ) {
		e.preventDefault();

		var $el               = $( parse_event_target( e ) ),
			use               = $el.is( ':checked' ),
			wc_gc_use_balance = use === true ? 'on' : 'off';

		block( $( 'div.cart_totals' ) );

		$.ajax( {
			type:     'post',
			url:      get_url( 'toggle_balance_usage' ),
			data:     'wc_gc_use_balance=' + wc_gc_use_balance + '&security=' + wc_gc_params.security_update_use_balance_nonce,
			dataType: 'html',
			success:  function( response ) {
				unblock( $( 'div.cart_totals' ) );
				update_cart_totals_div( response );
			}
		} );

	};

	/**
	 * Handle WooCommerce Cart remove giftcard buttons.
	 *
	 * @this WC_GC_Cart_Form_Handler
	 * @param  {event} e
	 * @return {void}
	 */
	WC_GC_Cart_Form_Handler.prototype.handle_remove = function( e ) {
		e.preventDefault();

		var $el         = $( parse_event_target( e ) ),
			giftcard_id = $el.data( 'giftcard' );

		block( $( 'div.cart_totals' ) );

		$.ajax( {
			type:     'post',
			url:      get_url( 'remove_gift_card_from_session' ),
			data:     'wc_gc_cart_id=' + giftcard_id + '&render_cart_fragments=1&security=' + wc_gc_params.security_remove_card_nonce,
			dataType: 'html',
			success:  function( response ) {
				unblock( $( 'div.cart_totals' ) );
				update_cart_totals_div( response );
			}
		} );

		return false;
	};

	/**
	 * Handle WooCommerce Cart giftcard submit form.
	 *
	 * @this WC_GC_Cart_Form_Handler
	 * @param  {event} e
	 * @return {void}
	 */
	WC_GC_Cart_Form_Handler.prototype.handle_submit = function( e ) {
		e.preventDefault();

		var self            = this,
			$button         = $( parse_event_target( e ) ), // Origin button.
			$form           = $button.closest( '.add_gift_card_form' ),
			$code           = $form.find( '#wc_gc_cart_code' ),
			$notices_parent = $form.find( '.wc_gc_add_gift_card_form__notices' ),
			code            = $code.val();

		if ( ! code ) {
			return;
		}

		// Block.
		$button.prop( 'disabled', true );
		block( $( 'div.cart_totals' ) );
		$( document.body ).trigger( 'wc_gc_before_cart_form_submit' );

		$.ajax( {
			type:     'post',
			url:      get_url( 'apply_gift_card_to_session' ),
			data:     'wc_gc_cart_code=' + code + '&security=' + wc_gc_params.security_redeem_card_nonce,
			dataType: 'json',
			success:  function( response ) {

				if ( 'success' === response.result ) {

					if ( 'yes' === response.applied ) {

						var $result_cart_table_html = $( response.html ),
							$new_form_ref           = $result_cart_table_html.find( '.add_gift_card_form' );

						// Update cart table.
						update_cart_totals_div( $result_cart_table_html );

						// The references may have gone due to the replaceWith call @see update_cart_totals_div().
						if ( $new_form_ref.length ) {
							$form           = $new_form_ref;
							$notices_parent = $form.find( '.wc_gc_add_gift_card_form__notices' );
						}
					}

					// Add notices.
					self.$notices_container.html( response.notices_html );
					self.$notices_container.hide();

					$( document.body ).trigger( 'wc_gc_cart_form_submit' );
					$notices_parent.html( self.$notices_container );
					self.$notices_container.fadeIn( 'fast' );

					// Clear value.
					$code.val( '' );
				}

				// Unblock.
				unblock( $( 'div.cart_totals' ) );
				$button.prop( 'disabled', false );
			}

		} );

		return false;
	};

	/*-----------------------------------------------------------------*/
	/*  WCS integration                                                */
	/*-----------------------------------------------------------------*/

	function WC_GC_WCS_Toggle_Controller() {

		// Toggler DOM.
		this.$toggle_balance_balance_container    = null;
		this.$toggle_balance                      = null;
		this.$toggle_balance_auto_renew_container = null;
		this.$toggle_auto_renew                   = null;
		this.$parent_container                    = null;
		this.$icon                                = null;

		// Runtime vars.
		this.initial_status                       = null;

		// Style vars.
		this.txt_color                            = null;
		// Restore context.
		this.on_toggle                            = this.on_toggle.bind( this );
		this.on_auto_renew_toggle                 = this.on_auto_renew_toggle.bind( this );
		this.should_reload_before_showing_modal   = this.should_reload_before_showing_modal.bind( this );
	}

	/**
	 * Initalize integration on document ready.
	 *
	 * @param {Event}          event
	 * @param {XMLHttpRequest} xhr
	 * @param {Object}         settings
	 */
	WC_GC_WCS_Toggle_Controller.prototype.init = function() {

		// Search the DOM and cache it.
		this.$toggle_balance_balance_container = $( '.wcs-gift-cards-toggle' );
		if ( ! this.$toggle_balance_balance_container.length ) {
			return;
		}

		this.$parent_container = this.$toggle_balance_balance_container.parents( 'tr' );
		this.$toggle_balance   = $( '.subscription-auto-renew-toggle', this.$toggle_balance_balance_container );
		this.$icon             = this.$toggle_balance.find( 'i' );


		this.$toggle_balance_auto_renew_container = $( '.wcs-auto-renew-toggle' );
		this.$toggle_auto_renew                   = $( '.subscription-auto-renew-toggle', this.$toggle_balance_auto_renew_container );

		// Register events.
		this.$toggle_balance.on( 'click', this.on_toggle );
		$( document ).ajaxComplete( this.on_auto_renew_toggle );
		$( '.subscription_renewal_early' ).on( 'click', this.should_reload_before_showing_modal );

		// Init.
		this.initial_status = this.$toggle_balance.hasClass( 'subscription-auto-renew-toggle--on' ) ? true : false;
		this.maybe_apply_color();
		this.display_toggle();
		if ( this.$toggle_auto_renew.length && ! this.$toggle_auto_renew.hasClass( 'subscription-auto-renew-toggle--on' ) ) {
			this.$parent_container.hide();
		}
	};

	/**
	 * Function to force a page reload if the gift cards status has changed.
	 *
	 * @param {Event} event
	 */
	WC_GC_WCS_Toggle_Controller.prototype.should_reload_before_showing_modal = function( event ) {

		// Bail early.
		if ( 'no' === wc_gc_params.is_early_renewal_via_modal_enabled ) {
			return true;
		}

		// Determine possible changes.
		if ( this.$toggle_balance.hasClass( 'subscription-auto-renew-toggle--on' ) === this.initial_status ) {
			return true;
		}

		// Request a reload action.
		if ( window.confirm( wc_gc_params.i18n_force_reload_on_changes_notice ) ) {
			event.preventDefault();
			event.stopImmediatePropagation();
			window.location.reload();
		}
	};

	/**
	 * Function to toggle giftcards balance visibility based on auto-renew status.
	 *
	 * @param {Event}          event
	 * @param {XMLHttpRequest} xhr
	 * @param {Object}         settings
	 */
	WC_GC_WCS_Toggle_Controller.prototype.on_auto_renew_toggle = function( event, xhr, settings ) {
		if ( 200 !== xhr.status ) {
			return;
		}

		if ( -1 !== settings.data.indexOf( 'action=wcs_disable_auto_renew' ) ) {
			this.$parent_container.hide();
		} else if ( -1 !== settings.data.indexOf( 'action=wcs_enable_auto_renew' ) ) {
			this.$parent_container.show();
		}
	};

	/**
	 * Function to handle toggle 'change' event.
	 *
	 * @param  {event} e
	 * @return {void}
	 */
	WC_GC_WCS_Toggle_Controller.prototype.on_toggle = function( e ) {
		e.preventDefault();

		// Remove focus from the toggle element.
		this.$toggle_balance.blur();

		// Ignore the request if the toggle is disabled.
		if ( this.$toggle_balance.hasClass( 'subscription-auto-renew-toggle--disabled' ) ) {
			return;
		}

		var handle_response = function( response ) {
			if ( 'success' === response.result ) {
				this.toggle();
				this.maybe_apply_color();
				this.$toggle_balance.removeClass( 'subscription-auto-renew-toggle--disabled' );
			}
		};

		// Bind this callback to current object.
		handle_response = handle_response.bind( this );

		this.$toggle_balance.addClass( 'subscription-auto-renew-toggle--disabled' );

		var data = {
			subscription_id: WCSViewSubscription.subscription_id,
			security:        wc_gc_params.security_use_balance_renewals_nonce,
		};

		$.ajax( {
			type:     'post',
			url:      get_url( 'update_subscription_giftcards_toggle' ),
			data:     data,
			dataType: 'json',
			success:  handle_response
		} );
	};

	/**
	 * Getter for `txt_color` prop.
	 *
	 * @param  {event} e
	 * @return {void}
	 */
	WC_GC_WCS_Toggle_Controller.prototype.get_text_color = function() {
		if ( ! this.txt_color && ( this.$icon && this.$icon.length ) ) {
			this.txt_color = window.getComputedStyle( this.$icon[0] ).color;
		}

		return this.txt_color;
	};

	/**
	 * Function to display the toggle.
	 * Hint: We are reusing the auto-renew toggle's CSS classes for compatibility.
	 *
	 * @return {void}
	 */
	WC_GC_WCS_Toggle_Controller.prototype.display_toggle = function() {
		this.$toggle_balance.removeClass( 'subscription-auto-renew-toggle--hidden' );
	};

	/**
	 * Function to hide the toggle.
	 * Hint: We are reusing the auto-renew toggle's CSS classes for compatibility.
	 *
	 * @return {void}
	 */
	WC_GC_WCS_Toggle_Controller.prototype.hide_toggle = function() {
		this.$toggle_balance.addClass( 'subscription-auto-renew-toggle--hidden' );
	};

	/**
	 * Function to enable the toggle.
	 * Hint: We are reusing the auto-renew toggle's CSS classes for compatibility.
	 *
	 * @return {void}
	 */
	WC_GC_WCS_Toggle_Controller.prototype.enable_toggle = function() {
		this.$icon.removeClass( 'fa-toggle-off' ).addClass( 'fa-toggle-on' );
		this.$toggle_balance.removeClass( 'subscription-auto-renew-toggle--off' ).addClass( 'subscription-auto-renew-toggle--on' );
	};

	/**
	 * Function to disable the toggle.
	 * Hint: We are reusing the auto-renew toggle's CSS classes for compatibility.
	 *
	 * @return {void}
	 */
	WC_GC_WCS_Toggle_Controller.prototype.disable_toggle = function() {
		this.$icon.removeClass( 'fa-toggle-on' ).addClass( 'fa-toggle-off' );
		this.$toggle_balance.removeClass( 'subscription-auto-renew-toggle--on' ).addClass( 'subscription-auto-renew-toggle--off' );
	};

	/**
	 * Function to toggle status.
	 * Hint: We are reusing the auto-renew toggle's CSS classes for compatibility.
	 *
	 * @return {void}
	 */
	WC_GC_WCS_Toggle_Controller.prototype.toggle = function() {
		if ( this.$toggle_balance.hasClass( 'subscription-auto-renew-toggle--on' ) ) {
			this.disable_toggle();
		} else {
			this.enable_toggle();
		}
	};

	/**
	 * Function to try to apply active theme's color.
	 * Hint: We are reusing the auto-renew toggle's CSS classes for compatibility.
	 *
	 * @return {void}
	 */
	WC_GC_WCS_Toggle_Controller.prototype.maybe_apply_color = function() {

		if ( ! this.$icon.length ) {
			return;
		}

		var icon = this.$icon[0];

		if ( this.$toggle_balance.hasClass( 'subscription-auto-renew-toggle--on' ) ) {
			icon.style.backgroundColor = this.get_text_color();
			icon.style.borderColor     = this.get_text_color();
		} else {
			icon.style.backgroundColor = null;
			icon.style.borderColor     = null;
		}
	};

	/*-----------------------------------------------------------------*/
	/*  jQuery extensions                                              */
	/*-----------------------------------------------------------------*/

	/**
	 * Gift card Datepicker extend.
	 */
	$.fn.wc_gc_datepickers = function() {

		var $datepickers = $( this ).find( '.datepicker' );

		$datepickers.each( function() {

			// Cache local instances.
			var $datepicker       = $( this ),
				$container        = $datepicker.parent(),
				$clear_button     = $container.find( '.reset_delivery_date' ),
				$timestamp_input  = $container.find( 'input[name="wc_gc_giftcard_delivery"]' ),
				$offset_gmt_input = $container.find( 'input[name="_wc_gc_giftcard_delivery_gmt_offset"]' );

			// Make Template backwards compatible.
			if ( ! $offset_gmt_input.length ) {
				$offset_gmt_input = $( '<input/>' );
				$offset_gmt_input.attr( 'type', 'hidden' );
				$offset_gmt_input.attr( 'name', '_wc_gc_giftcard_delivery_gmt_offset' );
				$container.append( $offset_gmt_input );
			}

			// Fill GMT offset.
			var now           = new Date(),
				gmt_offset    = parseFloat( wc_gc_params.gmt_offset, 10 ),
				client_offset = now.getTimezoneOffset() / 60,
				datepicker_min_date;

			var diff = client_offset - gmt_offset;

			if ( 'default' === wc_gc_params.date_input_timezone_reference ) {

				$offset_gmt_input.val( client_offset );
				datepicker_min_date = '+1D';

			} else if ( 'store' === wc_gc_params.date_input_timezone_reference ) {

				var hours_now  = now.getHours() + now.getMinutes() / 60,
					day_factor = hours_now + diff;

				$offset_gmt_input.val( gmt_offset );

				if ( day_factor >= 24 ) {
					datepicker_min_date = '+' + ( Math.floor( day_factor / 24 ) + 1 ) + 'D';
				} else if ( day_factor <= 0 ) {
					datepicker_min_date = 0;
				} else {
					datepicker_min_date = '+1D';
				}
			}

			// Init datepicker.
			$datepicker.datepicker( {
				beforeShow: function( input, el ) {
					if ( wc_gc_params.datepicker_class ) {
						$('#ui-datepicker-div').removeClass( wc_gc_params.datepicker_class );
						$('#ui-datepicker-div').addClass( wc_gc_params.datepicker_class );
					}
				},
				minDate: datepicker_min_date
			} );

			// Fill hidden inputs with selected date if any.
			var currentDate = $datepicker.datepicker( 'getDate' );
			if ( null !== currentDate && typeof currentDate.getTime === 'function' ) {

				// Append current time.
				currentDate.setHours( now.getHours(), now.getMinutes() );

				if ( 'store' === wc_gc_params.date_input_timezone_reference ) {
					currentDate = add_minutes( currentDate, -1 * client_offset * 60 );
					currentDate = add_minutes( currentDate, gmt_offset * 60 );
				}

				$timestamp_input.val( currentDate.getTime() / 1000 );
				$clear_button.show();
			}

			// On Change.
			$datepicker.on( 'change', function() {

				var selectedDate = $datepicker.datepicker( 'getDate' );
				if ( null !== selectedDate && typeof selectedDate.getTime === 'function' ) {

					// Append current time.
					var now = new Date();
					selectedDate.setHours( now.getHours(), now.getMinutes() );

					if ( 'store' === wc_gc_params.date_input_timezone_reference ) {
						selectedDate = add_minutes( selectedDate, -1 * client_offset * 60 );
						selectedDate = add_minutes( selectedDate, gmt_offset * 60 );
					}

					$timestamp_input.val( selectedDate.getTime() / 1000 );
					$clear_button.show();

				} else {
					$clear_button.hide();
					$timestamp_input.val( '' );
				}

			} );

			// On clear date.
			$clear_button.on( 'click', function( event ) {
				event.preventDefault();
				// Sanity clear.
				$timestamp_input.val( '' );
				// Trigger change.
				$datepicker.val( '' ).trigger( 'change' );
			} );

		} );
	};

	/*-----------------------------------------------------------------*/
	/*  Utilities                                                      */
	/*-----------------------------------------------------------------*/

	/**
	 * Gets a url for a given AJAX endpoint.
	 *
	 * @param  {string} endpoint The AJAX Endpoint
	 * @return {string} The URL to use for the request
	 */
	function get_url( endpoint ) {

		return wc_gc_params.wc_ajax_url.toString().replace(
			'%%endpoint%%',
			endpoint
		);
	}

	/**
	 * Check if a node is blocked for processing.
	 *
	 * @param  {jQuery Object} $node JQuery Object
	 * @return {bool} True if the DOM Element is UI Blocked, false if not.
	 */
	function is_blocked( $node ) {
		return $node.is( '.processing' ) || $node.parents( '.processing' ).length;
	}

	/**
	 * Block a node visually for processing.
	 *
	 * @param  {jQuery Object} $node
	 * @return {void}
	 */
	function block( $node ) {
		if ( ! is_blocked( $node ) ) {

			$node.addClass( 'processing' ).block( {
				message: null,
				overlayCSS: {
					background: '#fff',
					opacity: 0.6
				}
			} );
		}
	}

	/**
	 * Unblock a node after processing is complete.
	 *
	 * @param  {jQuery Object} $node
	 * @return {void}
	 */
	function unblock( $node ) {
		$node.removeClass( 'processing' ).unblock();
	}

	/**
	 * Update the .cart_totals div with a string of html.
	 *
	 * @param  {string} html_str The HTML string with which to replace the div.
	 * @return {void}
	 */
	function update_cart_totals_div( html_str ) {
		$( '.cart_totals' ).replaceWith( html_str );
		$( document.body ).trigger( 'updated_cart_totals' );
	}

	/**
	 * Function to add minutes on a given Date object.
	 *
	 * @param  {Date} date The Date object to be converted.
	 * @param  {integer} minutes Number of minutes.
	 * @return {Date} The new Date including added minutes.
	 */
	function add_minutes( date, minutes ) {
		return new Date( date.getTime() + minutes * 60000 );
	}

	/**
	 * Function parse the event object for mutlibroswer support.
	 *
	 * @param  {Event} event The current Event object.
	 * @param  {integer} minutes Number of minutes.
	 * @return {Object} The event DOM origin.
	 */
	function parse_event_target( event ) {
		var src = event.target || event.srcElement;
		return src;
	}

	/*-----------------------------------------------------------------*/
	/*  Create singleton controller                                    */
	/*-----------------------------------------------------------------*/
	window.WC_GC = new WC_GC_Controller();

} )( jQuery, document, window );
