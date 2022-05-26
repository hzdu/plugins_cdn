
/* global fp_rac_admin_params */

jQuery( function ( $ ) {
	'use strict';

	var Advance_Tab = {
		init: function () {

			$( document ).on( 'click', '.fp-rac-upload-image-btn', this.upload_image );
			$( document ).on( 'change', '#rac_cart_link_options', this.toggle_email_cart_link_option );
			$( document ).on( 'change', '#rac_hide_product_name_product_info_shortcode', this.toggle_product_name_option );
			$( document ).on( 'change', '#rac_hide_product_image_product_info_shortcode', this.toggle_product_image_option );
			$( document ).on( 'change', '#rac_hide_product_quantity_product_info_shortcode', this.toggle_product_quantity_option );
			$( document ).on( 'change', '#rac_hide_product_price_product_info_shortcode', this.toggle_product_price_option );
			$( document ).on( 'change', '#rac_unsub_myaccount_option', this.toggle_unsubscription_option );
			$( document ).on( 'change', '#rac_menu_show_hide', this.toggle_user_role_select_option );
			$( document ).on( 'change', '#rac_hide_tax_row_product_info_shortcode', this.toggle_product_info_tax_option );
			$( document ).on( 'change', '#rac_hide_shipping_row_product_info_shortcode', this.toggle_product_info_shipping_option );
			$( document ).on( 'change', 'input[name="rac_unsubscription_type"]:radio', this.toggle_email_unsubcribe_type_option );
			$( document ).on( 'change', '#rac_hide_tax_total_product_info_shortcode', this.toggle_hide_product_info_total_option );

			// Variation name show or hide
			$( document ).on( 'change', '#rac_email_product_variation_sh', this.toggle_product_variation_show );

			$( 'table#rac_drag_n_drop_product_info' ).sortable( {
				axis: "y",
				items: 'tbody',
				update: function ( event, ui ) {
					var data = $( this ).sortable( "toArray" );
					$.ajax( {
						data: ( {
							action: 'rac_drag_n_drop_product_info_column',
							data: data,
							rac_security: fp_rac_admin_params.sortable_nonce,
						} ),
					type: 'POST',
					url: ajaxurl,
					success: function ( response ) {
						console.log( response );
					},
					} );
				}
			} );

			this.trigger_on_page_load();
		},
		trigger_on_page_load: function () {
			this.get_email_cart_link_option( '#rac_cart_link_options' );
			this.get_product_name_option( '#rac_hide_product_name_product_info_shortcode' );
			this.get_product_image_option( '#rac_hide_product_image_product_info_shortcode' );
			this.get_product_quantity_option( '#rac_hide_product_quantity_product_info_shortcode' );
			this.get_product_price_option( '#rac_hide_product_price_product_info_shortcode' );
			this.get_unsubscription_option( '#rac_unsub_myaccount_option' );
			this.get_email_unsubcribe_type_option( "input[name='rac_unsubscription_type']:checked" );
			this.get_hide_product_info_total_option( '#rac_hide_tax_total_product_info_shortcode' );
			this.get_user_role_select_option( '#rac_menu_show_hide' );
			this.product_variation_show( '#rac_email_product_variation_sh' );

		},
		upload_image: function ( e ) {
			e.preventDefault( );
			// Upload Batch Image.
			var file_frame;
			var $button = $( this );
			var formfield = $( this ).prev( );
			// If the media frame already exists, reopen it.
			if ( file_frame ) {
				file_frame.open( );
				return;
			}

			// Create the media frame.
			file_frame = wp.media.frames.file_frame = wp.media( {
				frame: 'select',
				// Set the title of the modal.
				title: $button.data( 'title' ),
				multiple: false,
				library: {
					type: 'image'
				},
				button: {
					text: $button.data( 'button' )
				}
			} );

			//When a file is selected, grab the URL and set it as the text field's value
			file_frame.on( 'select', function () {
				var file_path = '';
				var selection = file_frame.state( ).get( 'selection' );
				selection.map( function ( attachment ) {
					attachment = attachment.toJSON( );
					if ( attachment.url ) {
						file_path = attachment.url;
					}
				} );

				formfield.val( file_path );

			} );

			//Open the uploader dialog
			file_frame.open();
		},
		toggle_email_cart_link_option: function ( event ) {
			event.preventDefault();
			var $this = $( event.currentTarget );
			Advance_Tab.get_email_cart_link_option( $this );
		},
		toggle_product_name_option: function ( event ) {
			event.preventDefault();
			var $this = $( event.currentTarget );
			Advance_Tab.get_product_name_option( $this );
		},
		toggle_product_image_option: function ( event ) {
			event.preventDefault();
			var $this = $( event.currentTarget );
			Advance_Tab.get_product_image_option( $this );
		},
		toggle_product_quantity_option: function ( event ) {
			event.preventDefault();
			var $this = $( event.currentTarget );
			Advance_Tab.get_product_quantity_option( $this );
		},
		toggle_product_price_option: function ( event ) {
			event.preventDefault();
			var $this = $( event.currentTarget );
			Advance_Tab.get_product_price_option( $this );
		},
		toggle_unsubscription_option: function ( event ) {
			event.preventDefault();
			var $this = $( event.currentTarget );
			Advance_Tab.get_unsubscription_option( $this );
		},
		toggle_user_role_select_option: function ( event ) {
			event.preventDefault();
			var $this = $( event.currentTarget );
			Advance_Tab.get_user_role_select_option( $this );
		},
		toggle_email_unsubcribe_type_option: function ( event ) {
			event.preventDefault();
			var $this = $( event.currentTarget );
			Advance_Tab.get_email_unsubcribe_type_option( $this );
		},
		toggle_hide_product_info_total_option: function ( event ) {
			event.preventDefault();
			var $this = $( event.currentTarget );
			Advance_Tab.get_hide_product_info_total_option( $this );
		},
		toggle_product_info_tax_option: function ( event ) {
			event.preventDefault();
			var $this = $( event.currentTarget );
			Advance_Tab.get_hide_product_info_tax_option( $this.val() );
		},
		toggle_product_info_shipping_option: function ( event ) {
			event.preventDefault();
			var $this = $( event.currentTarget );
			Advance_Tab.get_hide_product_info_shipping_option( $this.val() );
		},
		toggle_product_variation_show: function ( event ) {
			event.preventDefault();
			var $this = $( event.currentTarget );
			Advance_Tab.product_variation_show( $this );
		},

		get_email_cart_link_option: function ( $this ) {
			if ( $( $this ).val() === '4' ) {
				$( '.racbutton' ).closest( 'tr' ).hide();
				$( '.raclink' ).closest( 'tr' ).hide();
				$( '.fp_rac_class_cartlink_image' ).closest( 'tr' ).show();
			} else if ( $( $this ).val() === '3' ) {
				$( '.racbutton' ).closest( 'tr' ).show();
				$( '.raclink' ).closest( 'tr' ).hide();
				$( '.fp_rac_class_cartlink_image' ).closest( 'tr' ).hide();
			} else if ( $( $this ).val() === '2' ) {
				$( '.raclink' ).closest( 'tr' ).hide();
				$( '.racbutton' ).closest( 'tr' ).hide();
				$( '.fp_rac_class_cartlink_image' ).closest( 'tr' ).hide();
			} else {
				$( '.racbutton' ).closest( 'tr' ).hide();
				$( '.raclink' ).closest( 'tr' ).show();
				$( '.fp_rac_class_cartlink_image' ).closest( 'tr' ).hide();
			}
		},
		get_email_unsubcribe_type_option: function ( $this ) {
			var option = $( $this ).val();
			if ( option == '1' ) {
				$( '.rac_unsub_auto' ).closest( 'tr' ).show();
				$( '.rac_unsub_manual' ).closest( 'tr' ).hide();
			} else {
				$( '.rac_unsub_auto' ).closest( 'tr' ).hide();
				$( '.rac_unsub_manual' ).closest( 'tr' ).show();
			}
		},
		get_product_name_option: function ( $this ) {
			var option = $( $this ).val();
			if ( option == 'yes' ) {
				$( '#rac_product_info_product_name' ).closest( 'tr' ).hide();
			} else {
				$( '#rac_product_info_product_name' ).closest( 'tr' ).show();
			}
		},
		get_product_image_option: function ( $this ) {
			var option = $( $this ).val();
			if ( option == 'yes' ) {
				$( '#rac_product_info_product_image' ).closest( 'tr' ).hide();
				$( '.rac_product_img_size' ).closest( 'tr' ).hide();
			} else {
				$( '#rac_product_info_product_image' ).closest( 'tr' ).show();
				$( '.rac_product_img_size' ).closest( 'tr' ).show();
			}
		},
		get_product_quantity_option: function ( $this ) {
			var option = $( $this ).val();
			if ( option == 'yes' ) {
				$( '#rac_product_info_quantity' ).closest( 'tr' ).hide();
			} else {
				$( '#rac_product_info_quantity' ).closest( 'tr' ).show();
			}
		},
		get_product_price_option: function ( $this ) {
			var option = $( $this ).val();
			if ( option == 'yes' ) {
				$( '#rac_product_info_product_price' ).closest( 'tr' ).hide();
			} else {
				$( '#rac_product_info_product_price' ).closest( 'tr' ).show();
			}
		},
		get_unsubscription_option: function ( $this ) {
			var option = $( $this ).is( ":checked" );
			if ( option == true ) {
				$( '.rac_unsubscribe_hide' ).closest( 'tr' ).show();
			} else {
				$( '.rac_unsubscribe_hide' ).closest( 'tr' ).hide();
			}
		},
		get_user_role_select_option: function ( $this ) {
			var option = $( $this ).is( ":checked" );
			if ( option == true ) {
				$( '#rac_menu_disp_user_roles' ).closest( 'tr' ).show();
			} else {
				$( '#rac_menu_disp_user_roles' ).closest( 'tr' ).hide();
			}
		},
		product_variation_show: function ( $this ) {
			if ( 'no' == $( $this ).val() ) {
				$( '#rac_var_product_disp_opt' ).closest( 'tr' ).hide();
			} else {
				$( '#rac_var_product_disp_opt' ).closest( 'tr' ).show();
			}
		},
		get_hide_product_info_total_option: function ( $this ) {
			var product_info_rows_sh_option = $( $this ).val();
			if ( product_info_rows_sh_option == 'yes' ) {
				$( '.rac_hide_total_info' ).closest( 'tr' ).hide();
				Advance_Tab.get_hide_product_info_shipping_option( 'yes' );
				Advance_Tab.get_hide_product_info_tax_option( 'yes' );
			} else {
				$( '.rac_hide_total_info' ).closest( 'tr' ).show();
				Advance_Tab.get_hide_product_info_shipping_option( $( '#rac_hide_shipping_row_product_info_shortcode' ).val() );
				Advance_Tab.get_hide_product_info_tax_option( $( '#rac_hide_tax_row_product_info_shortcode' ).val() );
			}
		},
		get_hide_product_info_shipping_option: function ( $val ) {
			if ( $val == 'yes' ) {
				$( '#rac_product_info_shipping' ).closest( 'tr' ).hide();
			} else {
				$( '#rac_product_info_shipping' ).closest( 'tr' ).show();
			}
		},
		get_hide_product_info_tax_option: function ( $val ) {
			if ( $val == 'yes' ) {
				$( '#rac_product_info_tax' ).closest( 'tr' ).hide();
			} else {
				$( '#rac_product_info_tax' ).closest( 'tr' ).show();
			}
		}

	};
	Advance_Tab.init();
} );
