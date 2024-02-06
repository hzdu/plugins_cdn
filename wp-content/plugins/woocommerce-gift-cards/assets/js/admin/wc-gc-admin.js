/* global wc_gc_admin_params, accounting, woocommerce_admin_meta_boxes */
;( function( $, window, document ) {

	// Main.
	$( function() {

		// Settings
		$( 'select#wc_gc_settings_send_as_gift_status' ).change( function() {
			var $this = $( this );

			if ( 'never' === $this.val() ) {
				$( '#wc_gc_allow_multiple_recipients' ).closest( 'tr' ).hide();
			} else {
				$( '#wc_gc_allow_multiple_recipients' ).closest( 'tr' ).show();
			}

		} ).trigger( 'change' );

		// Date Picker
		$( document.body ).on( 'wc-init-datepickers', function() {
			$( '.date-picker-field, .date-picker' ).datepicker( {
				dateFormat: 'yy-mm-dd',
				numberOfMonths: 1,
				showButtonPanel: true
			} );
		} ).trigger( 'wc-init-datepickers' );

		// Warning.
		$( '.woocommerce-gc-giftcards #delete-action' ).on( 'click', function( e ) {
			if ( ! window.confirm( wc_gc_admin_params.i18n_wc_delete_card_warning ) ) {
				e.preventDefault();
				return false;
			}
		} );

		$( '#giftcards-table #doaction' ).on( 'click', function( e ) {

			var value = $( '#bulk-action-selector-top' ).val();

			if ( value === 'delete' && ! window.confirm( wc_gc_admin_params.i18n_wc_bulk_delete_card_warning ) ) {
				e.preventDefault();
				return false;
			}
		} );

		$( '#giftcards-table #doaction2' ).on( 'click', function( e ) {

			var value = $( '#bulk-action-selector-bottom' ).val();

			if ( value === 'delete' && ! window.confirm( wc_gc_admin_params.i18n_wc_bulk_delete_card_warning ) ) {
				e.preventDefault();
				return false;
			}
		} );

		// Enclosed message controller.
		var handle_message_replacement = ( function() {

			var $parent = $( '.wc-gc-message-mask' );
			if ( ! $parent.length ) {
				return false;
			}

			var editing      = false,
				$placeholder = $parent.find( '.wc-gc-message-mask_placeholder' ),
				$cancel      = $parent.find( '#wc_gc_replace_message_cancel' ).hide(),
				$textarea    = $parent.find( 'textarea' ),
				$form        = $( '#edit-gift-card-form' );

			var toggle_placeholder = function() {
				if ( editing ) {
					$placeholder.hide();
				} else {
					$placeholder.fadeIn( 'fast' );
				}
			};

			var toggle_textarea = function() {
				if ( ! editing ) {
					$textarea.fadeIn( 'fast' );
					$cancel.fadeIn( 'fast' );
					editing = true;
				} else {
					editing = false;
					$textarea.hide();
					$cancel.hide();
				}
			};

			var hook = function() {

				$parent.on( 'click', '#wc_gc_replace_message_action, #wc_gc_replace_message_cancel', function( e ) {
					e.preventDefault();

					toggle_textarea();
					toggle_placeholder();

					return false;
				} );

				$form.on( 'submit', function( e ) {

					if ( editing ) {
						if ( ! window.confirm( wc_gc_admin_params.i18n_wc_edit_message_warning ) ) {
							e.preventDefault();
							return false;
						}
					}

					return true;
				} );
			};

			return {
				hook: hook
			};

		} )();

		// Hook in.
		if ( handle_message_replacement ) {
			handle_message_replacement.hook();
		}

		/**
		 * Order Items Panel
		 */
		 var wc_gc_meta_boxes_order_items = {

			$order_items_wrapper: $( '#woocommerce-order-items' ),

			view: false,

			init: function() {

				if ( ! this.$order_items_wrapper.length ) {
					return;
				}

				// Render refunds.
				this.render_refunds();

				$( document ).ajaxComplete( function( event, xhr, settings ) {

					if ( 200 !== xhr.status || ! settings.data ) {
						return;
					}

					if ( -1 !== settings.data.indexOf( 'action=woocommerce_load_order_items' ) ) {
						wc_gc_meta_boxes_order_items.render_refunds();
					} else if ( -1 !== settings.data.indexOf( 'action=woocommerce_delete_refund' ) ) {

						if ( xhr.responseJSON && false === xhr.responseJSON.success ) {
							for ( var refund_id in xhr.responseJSON.data.errors ) {
								window.alert( xhr.responseJSON.data.errors[refund_id] );
							}
						}
					}

				} );

				// Hook events.
				this.$order_items_wrapper

					// Manual redeem.
					.on( 'click', 'button.add-gift-card', this.add_gift_card.bind( this ) )
					.on( 'click', 'a.delete-gift-card-item', this.delete_gift_card.bind( this ) )

					// Manual configure.
					.on( 'click', 'button.configure_gift_card', { action: 'configure' }, this.clicked_edit_button.bind( this ) )
					.on( 'click', 'button.edit_gift_card', { action: 'edit' }, this.clicked_edit_button.bind( this ) );
			},

			maybe_render_refunds: function() {
				var $refund_button = $( '.wc-order-refund-items .refund-actions .do-gift-card-refund' );
				if ( ! Boolean( $refund_button.length ) ) {
					wc_gc_meta_boxes_order_items.render_refunds();
				}
			},

			render_refunds: function() {

				// Containers.
				var parent            = $('.wc-order-totals-items'),
					$button_container = $( '.wc-order-refund-items .refund-actions' ),
					$totals_container = $( '.wc-order-refund-items .wc-order-totals' );

				if ( ! $button_container.length ) {
					return;
				}

				console.log( 'woocommerce_admin_meta_boxes', woocommerce_admin_meta_boxes );

				var $refund_button = $( '<button/>' ),
					refund_amount  = accounting.formatMoney( 0, {
						symbol:    woocommerce_admin_meta_boxes.currency_format_symbol,
						decimal:   woocommerce_admin_meta_boxes.currency_format_decimal_sep,
						thousand:  woocommerce_admin_meta_boxes.currency_format_thousand_sep,
						precision: woocommerce_admin_meta_boxes.currency_format_num_decimals,
						format:    woocommerce_admin_meta_boxes.currency_format
					} ),
					$refund_amount = $( '<span/>' ).addClass( 'wc-order-refund-amount' ).append( '<span class="amount">' + refund_amount + '</span>' );

				$refund_button.attr( 'data-tip', wc_gc_admin_params.i18n_refund_button_tip_text );
				$refund_button.html( wc_gc_admin_params.i18n_refund_button_text.replace( '%%amount%%', $refund_amount.get( 0 ).outerHTML ) );
				$refund_button.addClass( 'button button-primary do-gift-card-refund tips' );
				$refund_button.tipTip({
					'attribute': 'data-tip',
					'fadeIn': 50,
					'fadeOut': 50,
					'delay': 200
				});
				$button_container.prepend( $refund_button );

				// Move row to refund totals.
				var $total_available   = $( 'tr.wc_gc_move_row_to_refund_summary' ).first();
				var $refund_totals_row = $( '.wc-order-refund-items .wc-order-totals td.total input#refund_amount' ).parents( 'tr' );

				$total_available.insertBefore( $refund_totals_row );
				$total_available.show();
				var $already_refunded = $( 'tr.wc_gc_move_row_to_refund_summary' ).first();
				$already_refunded.insertBefore( $total_available.prev() );
				$already_refunded.show();

				// Fix the style in refunds.
				var $native_refund_total = $( 'table.wc-order-totals .label.refunded-total:not(.gift-cards-refunded-total)' );
				if ( ! Boolean( $native_refund_total.length ) ) {
					var $refund_total_table = $( 'table.wc-order-totals .label.refunded-total' ).parents( 'table' );
					if ( Boolean( $refund_total_table.length ) ) {
						$refund_total_table.css( 'border-top', '1px solid #999' ).css( 'padding-top', '12px' ).css( 'margin-top', '12px' );
					}
				}

				// Events.
				$refund_button.on( 'click', this.handle_refund_button.bind( this ) );
			},

			handle_refund_button: function( event ) {
				event.preventDefault();
				this.do_refund();
			},

			do_refund: function() {
				this.block();

				if ( ! window.confirm( woocommerce_admin_meta_boxes.i18n_do_refund ) ) {
					this.unblock();
					return;
				}

				var refund_amount             = $( 'input#refund_amount' ).val();
				var refund_reason             = $( 'input#refund_reason' ).val();
				var refunded_amount           = $( 'input#refunded_amount' ).val();
				var gift_card_refunded_amount = $( 'input#gift_card_refunded_amount' ).val();

				// Get line item refunds
				var line_item_qtys       = {};
				var line_item_totals     = {};
				var line_item_tax_totals = {};

				$( '.refund input.refund_order_item_qty' ).each(function( index, item ) {
					if ( $( item ).closest( 'tr' ).data( 'order_item_id' ) ) {
						if ( item.value ) {
							line_item_qtys[ $( item ).closest( 'tr' ).data( 'order_item_id' ) ] = item.value;
						}
					}
				});

				$( '.refund input.refund_line_total' ).each(function( index, item ) {
					if ( $( item ).closest( 'tr' ).data( 'order_item_id' ) ) {
						line_item_totals[ $( item ).closest( 'tr' ).data( 'order_item_id' ) ] = accounting.unformat(
							item.value,
							woocommerce_admin.mon_decimal_point
						);
					}
				});

				$( '.refund input.refund_line_tax' ).each(function( index, item ) {
					if ( $( item ).closest( 'tr' ).data( 'order_item_id' ) ) {
						var tax_id = $( item ).data( 'tax_id' );

						if ( ! line_item_tax_totals[ $( item ).closest( 'tr' ).data( 'order_item_id' ) ] ) {
							line_item_tax_totals[ $( item ).closest( 'tr' ).data( 'order_item_id' ) ] = {};
						}

						line_item_tax_totals[ $( item ).closest( 'tr' ).data( 'order_item_id' ) ][ tax_id ] = accounting.unformat(
							item.value,
							woocommerce_admin.mon_decimal_point
						);
					}
				});

				var data = {
					action                    : 'woocommerce_gc_refund_line_items',
					order_id                  : woocommerce_admin_meta_boxes.post_id,
					refund_amount             : refund_amount,
					refunded_amount           : refunded_amount,
					gift_card_refunded_amount : gift_card_refunded_amount,
					refund_reason             : refund_reason,
					line_item_qtys            : JSON.stringify( line_item_qtys, null, '' ),
					line_item_totals          : JSON.stringify( line_item_totals, null, '' ),
					line_item_tax_totals      : JSON.stringify( line_item_tax_totals, null, '' ),
					restock_refunded_items    : $( '#restock_refunded_items:checked' ).length ? 'true': 'false',
					security                  : woocommerce_admin_meta_boxes.order_item_nonce
				};

				$.ajax( {
					url:     woocommerce_admin_meta_boxes.ajax_url,
					data:    data,
					type:    'POST',
					success: function( response ) {
						if ( true === response.success ) {
							// Redirect to same page for show the refunded status
							window.location.reload();
						} else {
							window.alert( response.data.error );
							wc_gc_meta_boxes_order_items.reload_items();
						}
					}
				} );

				this.unblock();
			},

			reload_items: function() {

				if ( 'yes' === wc_gc_admin_params.is_wc_version_gte_3_4 ) {
					this.$order_items_wrapper.trigger( 'wc_order_items_reload' );
				} else {

					var data = {
						order_id: woocommerce_admin_meta_boxes.post_id,
						action:   'woocommerce_load_order_items',
						security: woocommerce_admin_meta_boxes.order_item_nonce
					};

					this.block();

					$.ajax( {
						url:  woocommerce_admin_meta_boxes.ajax_url,
						data: data,
						type: 'POST',
						success: function( response ) {
							wc_gc_meta_boxes_order_items.$order_items_wrapper.find( '.inside' ).empty();
							wc_gc_meta_boxes_order_items.$order_items_wrapper.find( '.inside' ).append( response );
							wc_gc_meta_boxes_order_items.reloaded_items();
							wc_gc_meta_boxes_order_items.unblock();
						}
					} );
				}
			},

			reloaded_items: function() {

				if ( 'yes' === wc_gc_admin_params.is_wc_version_gte_3_4 ) {
					this.$order_items_wrapper.trigger( 'wc_order_items_reloaded' );
				} else {
					this.core.init_tiptip();
					this.core.stupidtable.init();
				}

				this.maybe_render_refunds();
			},

			block: function( $target, params ) {
				if ( ! $target || $target === 'undefined' ) {
					$target = this.$order_items_wrapper;
				}

				var defaults = {
						message: null,
						overlayCSS: {
							background: '#fff',
							opacity:    0.6
						}
					};

				var opts = $.extend( {}, defaults, params || {} );

				$target.block( opts );

			},

			unblock: function( $target ) {
				if ( ! $target || $target === 'undefined' ) {
					$target = this.$order_items_wrapper;
				}

				$target.unblock();
			},

			clicked_edit_button: function( event ) {

				var WCGCBackboneModal = $.WCBackboneModal.View.extend( {
					addButton: this.clicked_done_button.bind( this )
				} );

				var $item   = $( event.target ).closest( 'tr.item' ),
					item_id = $item.attr( 'data-order_item_id' );

				this.view = new WCGCBackboneModal( {
					target: 'wc-modal-edit-gift-card',
					string: {
						action: 'configure' === event.data.action ? wc_gc_admin_params.i18n_configure_order_item : wc_gc_admin_params.i18n_edit_order_item,
						item_id: item_id
					}
				} );

				this.populate_form.call( this );

				return false;
			},

			clicked_done_button: function( event ) {

				this.block( this.view.$el.find( '.wc-backbone-modal-content' ) );

				var data = $.extend( {}, this.get_taxable_address(), {
					action:    'wc_gc_edit_order_item_gift_card_in_order',
					item_id:   this.view._string.item_id,
					fields:    this.view.$el.find( 'input, select, textarea' ).serialize(),
					dataType:  'json',
					order_id:  woocommerce_admin_meta_boxes.post_id,
					security:  wc_gc_admin_params.edit_gift_card_order_item_nonce
				} );

				$.post( woocommerce_admin_meta_boxes.ajax_url, data, function( response ) {

					if ( response.result && 'success' === response.result ) {

						this.$order_items_wrapper.find( '.inside' ).empty();
						this.$order_items_wrapper.find( '.inside' ).append( response.html );

						this.reloaded_items();

						if ( 'yes' === wc_gc_admin_params.is_wc_version_gte_3_6 ) {

							// Update notes.
							if ( response.notes_html ) {
								$( 'ul.order_notes' ).empty();
								$( 'ul.order_notes' ).append( $( response.notes_html ).find( 'li' ) );
							}
						}

						this.unblock( this.view.$el.find( '.wc-backbone-modal-content' ) );

						// Make it look like something changed.
						this.block();
						setTimeout( function() {
							this.unblock();
						}.bind( this ), 250 );

						this.view.closeButton( event );

					} else {
						window.alert( response.error ? response.error.replace( /&quot;/g, '\"' ) : wc_gc_admin_params.i18n_validation_error );
						this.unblock( this.view.$el.find( '.wc-backbone-modal-content' ) );
					}

				}.bind( this ) );
			},

			populate_form: function() {

				this.block( this.view.$el.find( '.wc-backbone-modal-content' ) );

				var data = {
					action:    'wc_gc_configure_order_item_gift_card',
					item_id:   this.view._string.item_id,
					dataType:  'json',
					order_id:  woocommerce_admin_meta_boxes.post_id,
					security:  wc_gc_admin_params.edit_gift_card_order_item_nonce
				};

				$.post( woocommerce_admin_meta_boxes.ajax_url, data, function( response ) {

					if ( response.result && 'success' === response.result ) {

						var $form = this.view.$el.find( 'form' );

						$form.html( response.html );
						$form.wc_gc_datepickers();

						var $code_container = $form.find( '.wc-gc-edit-code' ),
							$code_checkbox  = $code_container.find( 'input[type="checkbox"]' ),
							$code_field     = $code_container.find( '.wc-gc-field' );

						if ( ! $code_checkbox.is( ':checked' ) ) {
							$code_field.show();
						}

						$code_checkbox.on( 'change', function( e ) {

							var $checkbox = $( this ),
								is_checked = $checkbox.is( ':checked' );

							if ( is_checked ) {
								$code_field.hide();
							} else {
								$code_field.show();
							}

						} );

						this.unblock( this.view.$el.find( '.wc-backbone-modal-content' ) );

					} else {
						window.alert( wc_gc_admin_params.i18n_form_error );
						this.unblock( this.view.$el.find( '.wc-backbone-modal-content' ) );
						this.view.$el.find( '.modal-close' ).trigger( 'click' );
					}

				}.bind( this ) );
			},

			add_gift_card: function( e ) {
				var value = window.prompt( wc_gc_admin_params.i18n_wc_add_order_item_prompt );

				if ( null !== value && '' !== value ) {
					this.block();

					var user_id    = $( '#customer_user' ).val();
					var user_email = $( '#_billing_email' ).val();

					var data = $.extend( {}, this.get_taxable_address(), {
						action     : 'wc_gc_add_order_item_gift_card',
						dataType   : 'json',
						order_id   : woocommerce_admin_meta_boxes.post_id,
						security   : woocommerce_admin_meta_boxes.order_item_nonce,
						giftcard   : value,
						user_id    : user_id,
						user_email : user_email
					} );

					$.ajax( {
						url:     woocommerce_admin_meta_boxes.ajax_url,
						data:    data,
						type:    'POST',
						success: function( response ) {

							if ( response.result && 'success' === response.result ) {
								this.$order_items_wrapper.find( '.inside' ).empty();
								this.$order_items_wrapper.find( '.inside' ).append( response.html );

								if ( 'yes' === wc_gc_admin_params.is_wc_version_gte_3_6 ) {

									// Update notes.
									if ( response.notes_html ) {
										$( 'ul.order_notes' ).empty();
										$( 'ul.order_notes' ).append( $( response.notes_html ).find( 'li' ) );
									}
								}

								this.reloaded_items();
								this.unblock();

							} else {
								window.alert( response.data.error );
							}

							this.unblock();

						}.bind( this )
					} );
				}

				e.preventDefault();
				return false;
			},

			delete_gift_card: function( e ) {

				// Get the container.
				var $item         = $( e.target ).closest( 'tr.item, tr.fee, tr.shipping' ),
					gc_code       = $item.attr( 'data-gc_code' ),
					order_item_id = $item.attr( 'data-order_item_id' );

				var answer = window.confirm( wc_gc_admin_params.i18n_wc_delete_order_item_warning.replace( '%%code%%', gc_code ) );

				if ( answer ) {

					this.block();

					var data = $.extend( {}, this.get_taxable_address(), {
						order_id      : woocommerce_admin_meta_boxes.post_id,
						order_item_ids: order_item_id,
						action        : 'wc_gc_remove_order_item_gift_card',
						security      : woocommerce_admin_meta_boxes.order_item_nonce
					} );

					// Check if items have changed, if so pass them through so we can save them before deleting.
					if ( 'true' === $( 'button.cancel-action' ).attr( 'data-reload' ) ) {
						data.items = $( 'table.woocommerce_order_items :input[name], .wc-order-totals-items :input[name]' ).serialize();
					}

					$.ajax( {
						url:     woocommerce_admin_meta_boxes.ajax_url,
						data:    data,
						type:    'POST',
						success: function( response ) {

							if ( response.result && 'success' === response.result ) {
								this.$order_items_wrapper.find( '.inside' ).empty();
								this.$order_items_wrapper.find( '.inside' ).append( response.html );

								if ( 'yes' === wc_gc_admin_params.is_wc_version_gte_3_6 ) {

									// Update notes.
									if ( response.notes_html ) {
										$( 'ul.order_notes' ).empty();
										$( 'ul.order_notes' ).append( $( response.notes_html ).find( 'li' ) );
									}
								}

								this.reloaded_items();
								this.unblock();
							} else {
								window.alert( response.data.error );
							}

							this.unblock();

						}.bind( this )
					});
				}

				e.preventDefault();
				return false;
			},

			get_taxable_address: function() {
				var country          = '';
				var state            = '';
				var postcode         = '';
				var city             = '';

				if ( 'shipping' === woocommerce_admin_meta_boxes.tax_based_on ) {
					country  = $( '#_shipping_country' ).val();
					state    = $( '#_shipping_state' ).val();
					postcode = $( '#_shipping_postcode' ).val();
					city     = $( '#_shipping_city' ).val();
				}

				if ( 'billing' === woocommerce_admin_meta_boxes.tax_based_on || ! country ) {
					country  = $( '#_billing_country' ).val();
					state    = $( '#_billing_state' ).val();
					postcode = $( '#_billing_postcode' ).val();
					city     = $( '#_billing_city' ).val();
				}

				return {
					country:  country,
					state:    state,
					postcode: postcode,
					city:     city
				};
			},

			core: {

				init_tiptip: function() {
					$( '#tiptip_holder' ).removeAttr( 'style' );
					$( '#tiptip_arrow' ).removeAttr( 'style' );
					$( '.tips' ).tipTip({
						'attribute': 'data-tip',
						'fadeIn': 50,
						'fadeOut': 50,
						'delay': 200
					});
				},

				stupidtable: {

					init: function() {
						$( '.woocommerce_order_items' ).stupidtable();
						$( '.woocommerce_order_items' ).on( 'aftertablesort', this.add_arrows );
					},

					add_arrows: function( event, data ) {
						var th    = $( this ).find( 'th' );
						var arrow = data.direction === 'asc' ? '&uarr;' : '&darr;';
						var index = data.column;
						th.find( '.wc-arrow' ).remove();
						th.eq( index ).append( '<span class="wc-arrow">' + arrow + '</span>' );
					}
				},
			}
		};

		wc_gc_meta_boxes_order_items.init();

		function handle_show_if_giftcard_containers( set, $elements ) {

			if ( false !== set ) {
				set = true;
			}

			if ( ! $elements ) {
				$elements = $product_data.find( '.show_if_giftcard' );
			}

			$elements.each( function( index ) {

				var $el                 = $( this ),
					$simple_container   = $el.find( '.show_if_giftcard_simple' ),
					$variable_container = $el.find( '.show_if_giftcard_variable' );

				set ? $el.show() : $el.hide();

				if ( 'simple' === product_type ) {

					set ? $variable_container.hide() : $variable_container.show();

					if ( $simple_container.length ) {
						set ? $simple_container.show() : $simple_container.hide();
					}
				}

				if ( 'variable' === product_type ) {

					set ? $simple_container.hide() : $simple_container.show();

					if ( $variable_container.length ) {
						set ? $variable_container.show() : $variable_container.hide();
					}
				}

			} );
		}

		// Gift Card checkbox callbacks.
		function giftcard_checkbox_on_cb( on_load ) {

			handle_show_if_giftcard_containers();

			// Global Virtual.
			$virtual_checkbox.prop( 'checked', 'checked' ).trigger( 'change' );
			$virtual_container.attr( 'class', 'tips' ); // Remove every show_if & hide_if classes.
			$virtual_container.hide();

			if ( ! on_load || 'undefined' == on_load ) {
				// Taxes.
				$tax_status_select.val( 'none' );
			}

			// Variation Virtual.
			if ( $variable_product_options.length ) {
				$variable_product_options.find( '.variable_is_virtual' ).prop( 'checked', 'checked' ).each( function() {
					var $this = $( this );
					$this.trigger( 'change' );
					$this.parent().hide();
				} );
			}
		}

		function giftcard_checkbox_off_cb( on_load ) {

			handle_show_if_giftcard_containers( false );

			// Global Virtual.
			$virtual_container.attr( 'class', virtual_classes.join( ' ' ) );
			$virtual_checkbox.prop( 'checked', virtual_value_cache ? 'checked' : null ).trigger( 'change' );

			if ( -1 !== $.inArray( 'show_if_' + product_type, virtual_classes ) ) {
				$virtual_container.show();
			}

			if ( ! on_load || 'undefined' == on_load ) {
				// Restore Taxes.
				$tax_status_select.val( tax_status );
			}

			// Variation Virtual.
			if ( $variable_product_options.length ) {
				$variable_product_options.find( '.variable_is_virtual' ).each( function() {
					$( this ).parent().show();
				} );
			}
		}

		var $product_data = $( 'div#woocommerce-product-data' );
		if ( $product_data.length ) {

			var $virtual_checkbox         = $product_data.find( '#_virtual' ),
				$virtual_container        = $virtual_checkbox.parent(),
				virtual_value_cache       = $virtual_checkbox.is( ':checked' ),
				virtual_classes           = $virtual_container.attr( 'class' ).split( /\s+/ ),

				// Product Data type and taxes.
				$product_type_select      = $product_data.find( '#product-type' ),
				product_type              = $product_type_select.val(),
				$tax_status_select        = $product_data.find( '#_tax_status' ),
				tax_status                = $tax_status_select.val(),

				// Variable virtual checkboxes.
				$variable_product_options = $product_data.find( '#variable_product_options' ),
				// Giftcard Checkbox.
				$giftcard_checkbox        = $product_data.find( '#_gift_card' ),
				$giftcard_container       = $giftcard_checkbox.parent(),
				giftcard_classes          = $giftcard_container.attr( 'class' ).split( /\s+/ );

			// Initial load.
			if ( $giftcard_checkbox.is( ':checked' ) ) {
				giftcard_checkbox_on_cb( true );
			} else {
				giftcard_checkbox_off_cb( true );
			}

			// Variations loaded callback.
			$product_data.on( 'woocommerce_variations_loaded woocommerce_variations_added', function() {

				if ( $giftcard_checkbox.is( ':checked' ) ) {
					$variable_product_options.find( '.variable_is_virtual' ).prop( 'checked', 'checked' ).each( function() {
						var $this = $( this );
						$this.trigger( 'change' );
						$this.parent().hide();
					} );

				} else {
					handle_show_if_giftcard_containers( false );
				}

				init_image_select();
			} );

			// Gift Card checkbox changed callback.
			$giftcard_checkbox.on( 'change', function() {
				if ( $( this ).is( ':checked' ) ) {
					giftcard_checkbox_on_cb();
				} else {
					giftcard_checkbox_off_cb();
				}
			} );

			// Product type select changed callback.
			$product_type_select.on( 'change', function() {

				product_type = $( this ).val();

				if ( -1 === $.inArray( 'show_if_' + product_type, giftcard_classes ) ) {

					$giftcard_container.hide();
					handle_show_if_giftcard_containers( false );

				} else {

					if ( $giftcard_checkbox.is( ':checked' ) ) {
						handle_show_if_giftcard_containers();
					} else {
						handle_show_if_giftcard_containers( false );
					}
				}

			} );

			// Gift card template Default.
			function init_image_select() {

				var $image_select_container = $product_data.find( '.template_default_image_container' );

				$image_select_container.each( function( index ) {

					var $container               = $( this ),
						$default_use_image_field = $container.find( '#_gift_card_template_default_use_image' ),
						$custom_field            = $container.find( '.gift_card_template_default_custom_image' ),
						$select_image            = $container.find( '.wc_gc_field_select_image' ),
						$remove_image            = $container.find( '.wc_gc_field_remove_image' );

					// Image type setting.
					if ( 'custom' === $default_use_image_field.val() ) {
						$custom_field.show();
					}

					$default_use_image_field.on( 'change', function() {
						if ( 'custom' === $default_use_image_field.val() ) {
							$custom_field.show();
						} else {
							$custom_field.hide();
						}
					} );

					// Remove Image.
					$remove_image.on( 'click', function( e ) {

						var $button         = $( this ),
							$option_wrapper = $button.closest( '.wc_gc_select_image' ),
							$upload_button  = $option_wrapper.find( '.wc_gc_field_select_image' );

						e.preventDefault();

						$upload_button.removeClass( 'has_image' );
						$button.removeClass( 'has_image' );
						$option_wrapper.find( 'input' ).val( '' ).trigger( 'change' );
						$upload_button.find( 'img' ).eq( 0 ).attr( 'src', wc_gc_admin_params.wc_placeholder_img_src );
					} );

					var image_frame = null;

					$select_image.on( 'click', function( e ) {

						e.preventDefault();

						var $button = $( this );

						// If the media frame already exists, reopen it.
						if ( image_frame ) {

							image_frame.open();

						} else {

							// Create the media frame.
							image_frame = wp.media( {

								// Set the title of the modal.
								title: wc_gc_admin_params.i18n_select_image_frame_title,
								button: {
									text: wc_gc_admin_params.i18n_select_image_frame_button
								},
								states: [
									new wp.media.controller.Library( {
										title: wc_gc_admin_params.i18n_select_image_frame_title,
										filterable: 'all'
									} )
								]
							} );

							// When an image is selected, run a callback.
							image_frame.on( 'select', function () {

								var attachment = image_frame.state().get( 'selection' ).first().toJSON(),
									url        = attachment.sizes && attachment.sizes.thumbnail ? attachment.sizes.thumbnail.url : attachment.url;

								$button.addClass( 'has_image' );
								$button.closest( '.wc_gc_select_image' ).find( '.wc_gc_field_remove_image' ).addClass( 'has_image' );
								$button.find( 'input' ).val( attachment.id ).trigger( 'change' );
								$button.find( 'img' ).eq( 0 ).attr( 'src', url );
							} );

							// Finally, open the modal.
							image_frame.open();
						}

					} );

				} );

			}

			// First load init.
			init_image_select();

		} // If $product_data

		// Import/Export.
		GC_Export_Modal.init();

	} );

	/**
	 * Gift card Datepicker extend.
	 */
	$.fn.wc_gc_datepickers = function() {

		var $datepickers = $( this ).find( '.datepicker' );

		$datepickers.each( function( index ) {

			// Cache local instances.
			var $datepicker       = $( this ),
				$container        = $datepicker.parent(),
				$timestamp_input  = $container.find( 'input[name="wc_gc_giftcard_delivery"]' );

			// Init datepicker.
			$datepicker.datepicker( {
				beforeShow: function( input, el ) {
					$('#ui-datepicker-div').removeClass( 'wc_gc_datepicker' );
					$('#ui-datepicker-div').addClass( 'wc_gc_datepicker' );
				},
				minDate: '+1D'
			} );

			// Fill hidden inputs with selected date if any.
			var currentDate = $datepicker.datepicker( 'getDate' );
			if ( null !== currentDate && typeof currentDate.getTime === 'function' ) {

				// Append current time.
				var now = new Date();
				currentDate.setHours( now.getHours(), now.getMinutes() );
				$timestamp_input.val( currentDate.getTime() / 1000 );
			}

			// On Change.
			$datepicker.on( 'change', function() {

				var selectedDate = $datepicker.datepicker( 'getDate' );
				if ( null !== selectedDate && typeof selectedDate.getTime === 'function' ) {

					// Append current time.
					var now = new Date();
					selectedDate.setHours( now.getHours(), now.getMinutes() );
					$timestamp_input.val( selectedDate.getTime() / 1000 );

				} else {
					$timestamp_input.val( '' );
				}

			} );

		} );
	};

	/**
	 * Handles the Giftcards export process.
	 */
	var Gift_Cards_Export_Form = function( $form ) {

		// Props.
		this.$form        = $form;
		this.is_exporting = false;
		this.canceled     = false;

		// Methods.
		this.processStep  = this.processStep.bind( this );
		this.onSubmit     = this.onSubmit.bind( this );

		// Initial state.
		this.$form.find('.woocommerce-exporter-progress').val( 0 );

		// Events.
		$form.on( 'click', '.woocommerce-exporter-button', this.onSubmit );
	};

	/**
	 * Handle export button submission.
	 */
	Gift_Cards_Export_Form.prototype.onSubmit = function( event ) {
		event.preventDefault();

		var currentDate    = new Date(),
			day            = currentDate.getDate(),
			month          = currentDate.getMonth() + 1,
			year           = currentDate.getFullYear(),
			timestamp      = currentDate.getTime(),
			filename       = 'wc-gc-giftcards-export-' + day + '-' + month + '-' + year + '-' + timestamp + '.csv';

		this.$form.addClass( 'woocommerce-exporter__exporting' );
		this.$form.find('.woocommerce-exporter-button').prop( 'disabled', true );
		this.$form.find('.woocommerce-exporter-progress').val( 0 );
		this.processStep( 1, [], '', filename );
	};


	Gift_Cards_Export_Form.prototype.cancel = function( step, data, columns, filename ) {
		this.is_exporting = false;
		this.canceled     = true;
	};

	/**
	 * Process the current export step.
	 */
	Gift_Cards_Export_Form.prototype.processStep = function( step, data, columns, filename ) {

		var export_meta    = $( '#woocommerce-exporter-meta:checked' ).length ? 1: 0,
		    export_filters = $( '#woocommerce-exporter-filtered:checked' ).length ? 1: 0;

		if ( export_filters ) {
			filters = get_table_filters();
		}

		$.ajax( {
			type: 'POST',
			url: wc_gc_admin_params.wc_ajax_url,
			data: {
				form             : data,
				action           : 'woocommerce_gc_do_ajax_giftcards_export',
				step             : step,
				export_meta      : export_meta,
				export_filters   : export_filters,
				date_filter      : export_filters && filters ? filters.date : false,
				customer_filter  : export_filters && filters ? filters.customer : false,
				status_filter    : export_filters && filters ? filters.status : false,
				search_filter    : export_filters && filters ? filters.search : false,
				filename         : filename,
				security         : wc_gc_admin_params.export_giftcards_nonce
			},
			dataType: 'json',
			success: function( response ) {

				if ( response.success ) {

					if ( 'done' === response.data.step ) {
						this.is_exporting = false;
						window.location   = response.data.url;
						this.$form.find('.woocommerce-exporter-progress').val( response.data.percentage );

						setTimeout( function() {
							this.$form.removeClass( 'woocommerce-exporter__exporting' );
							this.$form.find('.woocommerce-exporter-button').prop( 'disabled', false );
							this.$form.find('.woocommerce-exporter-progress').val( 0 );
						}.bind( this ), 2000 );

					} else {

						this.is_exporting = true;
						this.$form.find('.woocommerce-exporter-button').prop( 'disabled', true );
						this.$form.find('.woocommerce-exporter-progress').val( response.data.percentage );

						if ( this.canceled ) {

							this.canceled     = false;
							this.is_exporting = false;

							setTimeout( function() {
								this.$form.removeClass( 'woocommerce-exporter__exporting' );
								this.$form.find('.woocommerce-exporter-progress').val( 0 );
								this.$form.find('.woocommerce-exporter-button').prop( 'disabled', false );
							}.bind( this ), 2000 );

							// Quit.
							return;
						}

						this.processStep( parseInt( response.data.step, 10 ), [], '', filename );
					}
				}

			}.bind( this )

		} ).fail( function( response ) {
			window.console.log( response );
		} );
	};

	/**
	 * Generate export modal.
	 */
	var GC_Export_Modal = {

		view: false,

		export_form: false,

		init: function() {

			// Hook events.
			$( '.woocommerce-gc-giftcards' )
				// Manual redeem.
				.on( 'click', '.woocommerce-gc-exporter-button', this.open.bind( this ) );
		},

		open: function( event ) {
			event.preventDefault();

			var WC_GC_Export_Backbone_Modal = $.WCBackboneModal.View.extend( {
				closeButton: this.cancel_export.bind( this )
			} );

			this.view = new WC_GC_Export_Backbone_Modal( {
				target: 'wc-gc-export-giftcards',
				string: {
					action: wc_gc_admin_params.i18n_export_modal_title
				}
			} );

			this.populate_form.call( this );

			return false;
		},

		cancel_export: function( event ) {

			if ( false !== this.export_form && ! this.export_form.canceled ) {
				this.export_form.cancel();
			}

			event.preventDefault();
			$( document.body ).trigger( 'wc_backbone_modal_before_remove', this.view._target );
			this.view.undelegateEvents();
			$( document ).off( 'focusin' );
			$( document.body ).css({
				'overflow': 'auto'
			});
			this.view.remove();
			$( document.body ).trigger( 'wc_backbone_modal_removed', this.view._target );
		},

		populate_form: function() {

			this.block( this.view.$el.find( '.wc-backbone-modal-content' ) );

			var data = {
				action:    'wc_gc_export_modal_html',
				dataType:  'json',
				security:  wc_gc_admin_params.modal_export_giftcards_nonce
			};

			$.post( wc_gc_admin_params.wc_ajax_url, data, function( response ) {

				if ( response.result && 'success' === response.result ) {

					var $form = this.view.$el.find( 'form' );
					$form.html( response.html );

					var $export_container = $form.find( '.woocommerce-exporter' );
					this.export_form      = new Gift_Cards_Export_Form( $export_container );

				} else {
					console.error( response.result );
				}

				this.unblock( this.view.$el.find( '.wc-backbone-modal-content' ) );

			}.bind( this ) );

		},

		block: function( $target, params ) {
			if ( ! $target || $target === 'undefined' ) {
				return;
			}

			var defaults = {
				message: null,
				overlayCSS: {
					background: '#fff',
					opacity:    0.6
				}
			};

			var opts = $.extend( {}, defaults, params || {} );
			$target.block( opts );

		},

		unblock: function( $target ) {
			if ( ! $target || $target === 'undefined' ) {
				return;
			}

			$target.unblock();
		}
	};

	/**
	 * Function to call Gift_Cards_Export_Form on jquery selector.
	 */
	$.fn.wc_gc_giftcards_export_form = function() {
		new Gift_Cards_Export_Form( this );
		return this;
	};

	/**
	 * Parse GET params from current URL.
	 */
	function get_query_params( qs ) {
		qs = qs.split( '+' ).join( ' ' );

		var params = {},
			tokens,
			re     = /[?&]?([^=]+)=([^&]*)/g;

		while ( tokens = re.exec( qs ) ) {
			params[ decodeURIComponent( tokens[ 1 ] ) ] = decodeURIComponent( tokens[ 2 ] );
		}

		return params;
	}

	/**
	 * Parse active filters from list table.
	 */
	function get_table_filters() {

		var query_search = document.location.search,
			params       = get_query_params( query_search );

		var filters = {
			'date'    : params.m && 0 != params.m ? parseInt( params.m, 10 ) : false,
			'customer': params._redeemed_filter ? parseInt( params._redeemed_filter, 10 ) : false,
			'search'  : params.s ? params.s : false,
			'status'  : params.status ? params.status : false,
		};

		return filters;
	}

} )( jQuery, window, document );
