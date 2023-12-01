jQuery(
	function($){
		contentcontrol_settings_modal = new wlm3_modal( '#configure-scheduler', save_configuration );

		var enable_modules = 0;
		$( '.enable-content-control-switch' ).each(
			function() {
				enable_modules = enable_modules + parseInt( $( this ).attr( "option_value" ) );
			}
		);
		// for toggle boxes
		$( '.enable-content-control-switch' ).on(
			'click',
			function() {
				$( this ).parent().parent().parent().parent().parent().save_settings(
					{
						on_success: function( $me, $result) {
							var chk = $me.find( ".enable-content-control-switch" );
							$( '.wlm-message-holder' ).show_message( { message : $result.msg, type : $result.msg_type} );
							if ( chk.attr( "option_type" ) == "scheduler" ) {
								chk.attr( "option_value", $result.data.enable_content_scheduler );
							}
							if ( chk.attr( "option_type" ) == "archiver" ) {
								chk.attr( "option_value", $result.data.enable_content_archiver );
							}
							if ( chk.attr( "option_type" ) == "manager" ) {
								chk.attr( "option_value", $result.data.enable_content_manager );
							}

							if ( enable_modules == 0 && $result.data.enable_content_scheduler == 1 ) {
								$( '#the-screen' ).html( $( '#wlm-simple-loader-container' ).html() );
								location.reload();
							}
							if ( enable_modules == 1 && $result.data.enable_content_scheduler == 0 ) {
								$( '#the-screen' ).html( $( '#wlm-simple-loader-container' ).html() );
								location.reload();
							}
							enable_modules = 0;
							$( '.enable-content-control-switch' ).each(
								function() {
									enable_modules = enable_modules + parseInt( $( this ).attr( "option_value" ) );
								}
							);
						},
						on_fail: function( $me, $data) {
							$me = $me.find( ".enable-content-control-switch" );
							alert( WLM3VARS.request_failed );
							$me.prop( 'checked', ! $me.prop( 'checked' ) );
						},
						on_error: function( $me, $error_fields) {
							alert( WLM3VARS.request_error );
						}
					}
				);
			}
		);

		$( 'body' ).off( '.wlm3-errorpages' );
		$( 'body' ).on(
			'change.wlm3-errorpages',
			'.auto-save',
			function() {
				$( this ).closest( 'div' ).save_settings(
					{
						data : {
							action : 'admin_actions',
							WishListMemberAction : 'save'
						}
					}
				)
			}
		);
		// add http to url
		$( ".system-page-url" ).blur(
			function() {
				if ( ! /^https*:\/\//.test( this.value )) {
					this.value = "http://" + this.value;
				}
			}
		);
		$( '.contentcontrol-settings' ).click( show_modal );
		$( "input[name='sp']" ).click( switch_toggle_clicked );
		$( ".add-page-btn" ).click( show_create_page );
		$( ".hide-create-page-btn" ).click( hide_create_page );
		$( '.create-page-btn' ).click( generate_system_page );
		$( '.wlm-mergecodes' ).change( insert_mergecodes );

		$( '.page-message-reset-button' ).do_confirm( {placement:'right', yes_classes:'-success'} )
		.on(
			'yes.do_confirm',
			function() {
				var modal  = $( this ).closest( '.modal' );
				var type   = modal.find( '.system-page-type' ).first().val() + '_internal';
				var editor = tinymce.get( $( '.system-page-text' )[0].id );
				editor.setContent( WLM3VARS.page_templates[type] );
				$( '#configure-pages .save-button.-primary' ).click();
			}
		);
	}
);

var switch_toggle_clicked = function() {
	var modal_id   = contentcontrol_settings_modal.data.id;
	var modal_body = $( "#" + modal_id ).find( ".modal-body" );

	modal_body.find( ".sp-text-content" ).hide();
	modal_body.find( ".sp-page-content" ).hide();
	modal_body.find( ".sp-url-content" ).hide();
	if ( modal_body.find( "#sp-text" ).is( ":checked" ) ) {
		modal_body.find( ".sp-text-content" ).show();
	}
	if ( modal_body.find( "#sp-internal" ).is( ":checked" ) ) {
		modal_body.find( ".sp-page-content" ).show();
		modal_body.find( ".create-page-holder" ).hide();
	}
	if ( modal_body.find( "#sp-url" ).is( ":checked" ) ) {
		modal_body.find( ".sp-url-content" ).show();
	}
}

var show_create_page = function() {
	$( ".create-page-holder" ).show();
}
var hide_create_page = function() {
	$( ".create-page-holder" ).hide();
}

var generate_system_page = function() {
	var $this_button = $( this );
	if ( $this_button.prop( "disabled" ) || $this_button.hasClass( "-disable" ) || $this_button.hasClass( "-disabled" ) ) {
		return false; // if disabled, do nothing
	}

	var modal_id = contentcontrol_settings_modal.data.id;

	var $save_button = $( "#" + modal_id ).find( ".save-button" );

	var settings_data = {
		action : "admin_actions",
		WishListMemberAction : "create_system_page",
		page_for : $( "#" + modal_id ).find( ".system-page-type" ).val(),
	};

	$this_button.closest( '.row' ).save_settings(
		{
			data: settings_data,
			on_init: function( $me, $result) {
				$this_button.disable_button( {disable:true} );
				$save_button.disable_button( {disable:true} );
				$( "#" + modal_id ).on(
					'hide.bs.modal',
					function(e) {
						if ( $this_button.prop( "disabled" ) || $this_button.hasClass( "-disable" ) || $this_button.hasClass( "-disabled" ) ) {
							e.preventDefault();
						}
					}
				);
			},
			on_success: function( $me, $result) {
				if ( $result.post_id ) {
					$( "#" + modal_id ).find( ".wlm-select-pages" ).append( new Option( $result.post_title, $result.post_id ) );
					$( "#" + modal_id ).find( ".wlm-select-pages" ).val( $result.post_id ).trigger( "change" );
					$( ".create-page-holder" ).hide();
				}
				$( '.wlm-message-holder' ).show_message(
					{
						message: $result.msg,
						type: $result.msg_type
					}
				);
			},
			on_fail: function( $me, $data) {
				console.log( $data );
				alert( WLM3VARS.request_failed );
			},
			on_error: function( $me, $error_fields) {
				$.each(
					$error_fields,
					function( key, obj ) {
						if ( typeof obj == "object" ) {
							obj.parent().addClass( 'has-error' );
						}
					}
				);
				$this_button.disable_button( {disable:false} );
				$save_button.disable_button( {disable:false} );
				$( "#" + modal_id ).unbind( "hide.bs.modal" );
			},
			on_done: function( $me, $data) {
				$this_button.disable_button( {disable:false} );
				$save_button.disable_button( {disable:false} );
				$( "#" + modal_id ).unbind( "hide.bs.modal" );
			}
		}
	);
}

var insert_mergecodes = function() {
	$code   = $( this ).val();
	$target = $( this ).attr( "target-class" );
	if ( tinymce.editors.length && $target == "system-page-text" ) {
		tinymce.editors["text"].insertContent( $code );
	} else {
		var caretPos    = $( '.' + $target )[0].selectionStart;
		var textAreaTxt = $( '.' + $target ).val();
		$( '.' + $target ).val( textAreaTxt.substring( 0, caretPos ) + $code + textAreaTxt.substring( caretPos ) );
	}
	$( this ).val( "" ).trigger( 'change.select2' );
}

var show_modal = function() {
	var modal_id     = contentcontrol_settings_modal.data.id;
	var $this_button = $( this );
	if ( $this_button.prop( "disabled" ) || $this_button.hasClass( "-disable" ) || $this_button.hasClass( "-disabled" ) ) {
		return false; // if disabled, do nothing
	}

	contentcontrol_settings_modal.open();
	$( "#" + modal_id ).find( ".settings-content" ).hide();
	$( "#" + modal_id ).find( ".save-button" ).hide();
	$( "#" + modal_id ).find( ".modal-title" ).html( wp.i18n.__( 'Loading settings, please wait...', 'wishlist-member' ) );

	var settings_data = {
		action : "admin_actions",
		WishListMemberAction : "get_contentcontrol_settings",
		type : $this_button.attr( "key" ),
	};
	$( this ).save_settings(
		{
			data: settings_data,
			on_success: function( $me, $result) {
				if ( $result.success && $result.settings ) {
					if ( tinymce.editors["text"] ) {
						tinymce.editors["text"].remove(); // remopve tinymce
					}
					$( "#" + modal_id ).find( ".system-page-text" ).val( $result.settings.text );
					$( "#" + modal_id ).find( ".system-page-internal" ).val( $result.settings.internal ).trigger( 'change.select2' );
					$( "#" + modal_id ).find( ".system-page-url" ).val( $result.settings.url );

					wlm.richtext(
						{
							selector: 'textarea.system-page-text',
							height: 200,
							menubar: false,
						}
					);

					var select = $( "#" + modal_id ).find( ".wlm-select-pages" );
					if ( ! select.data( 'select2' ) ) {
						select.select2( {theme:"bootstrap"} );
					}

					$( "#" + modal_id ).find( ".system-page-type" ).val( $this_button.attr( "key" ) );
					if ( $this_button.attr( "key" ) == "archiver" ) {
						$( "#" + modal_id ).find( ".modal-title" ).html( wp.i18n.__( 'Content Archiver Settings', 'wishlist-member' ) );
						$( "#" + modal_id ).find( ".archiver-settings" ).removeClass( "d-none" );
						$( "#" + modal_id ).find( ".content-access" ).val( $result.settings.content_access ).trigger( 'change.select2' );
						$( "#" + modal_id ).find( ".content-visibility" ).val( $result.settings.content_visibility ).trigger( 'change.select2' );
					} else {
						$( "#" + modal_id ).find( ".modal-title" ).html( wp.i18n.__( 'Content Scheduler Settings', 'wishlist-member' ) );
						$( "#" + modal_id ).find( ".archiver-settings" ).addClass( "d-none" );
					}
					$( "#" + modal_id ).find( "#sp-" + $result.settings.type ).prop( "checked", true );
					switch_toggle_clicked();

					$( "#" + modal_id ).find( ".settings-content" ).show();
					$( "#" + modal_id ).find( ".save-button" ).show();
					$( "#" + modal_id ).find( ".system-page-url" ).parent().removeClass( "has-error" );
					$( "#" + modal_id ).find( ".system-page-internal" ).parent().removeClass( "has-error" );
				} else {
					console.log( $result );
				}
			},
			// display error but dont close the modal
			on_fail: function( $me, $data) { console.log( WLM3VARS.request_failed ); },
			on_error: function( $me, $error_fields) { console.log( WLM3VARS.request_error ); }
		}
	);
}

var save_configuration = function() {
	var $this_button = $( this );
	if ( $this_button.prop( "disabled" ) || $this_button.hasClass( "-disable" ) || $this_button.hasClass( "-disabled" ) ) {
		return false; // if disabled, do nothing
	}
	var $save_button = $( this ).closest( ".modal" ).find( ".save-button" );

	var modal_id      = contentcontrol_settings_modal.data.id;
	var modal         = $( "#" + modal_id );
	var settings_data = {
		action : "admin_actions",
		WishListMemberAction : "save",
	};

	if ( $( "#sp-text" ).is( ":checked" ) ) {
		var text_content = "";
		if ( tinymce.editors.length ) {
			text_content = tinymce.editors["text"].getContent();
		} else {
			text_content = modal.find( ".system-page-text" ).val()
		}
		text_content = text_content.replace( /\n|\r/g, "" );// remove new lines
		if ( text_content == "" ) {
			modal.find( ".system-page-text" ).parent().addClass( "has-error" );
			return false;
		}
		settings_data[ modal.find( ".system-page-type" ).val() + "_error_page_type" ] = "text";
		settings_data[ modal.find( ".system-page-type" ).val() + "_error_page_text" ] = text_content;
	}
	if ( $( "#sp-internal" ).is( ":checked" ) ) {
		var p = $.trim( modal.find( ".system-page-internal" ).val() );
		if ( p == "" ) {
			modal.find( ".system-page-internal" ).parent().addClass( "has-error" );
			return false;
		}
		settings_data[ modal.find( ".system-page-type" ).val() + "_error_page_type" ]     = "internal";
		settings_data[ modal.find( ".system-page-type" ).val() + "_error_page_internal" ] = p;
	}
	if ( $( "#sp-url" ).is( ":checked" ) ) {
		var url     = $.trim( modal.find( ".system-page-url" ).val() );
		var pattern = new RegExp(
			'^(https?:\\/\\/)?' + // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
			'(\\#[-a-z\\d_]*)?$',
			'i'
		); // fragment locator
		if ( ! pattern.test( url ) ) {
			modal.find( ".system-page-url" ).parent().addClass( "has-error" );
			return false;
		}
		settings_data[ modal.find( ".system-page-type" ).val() + "_error_page_type" ] = "url";
		settings_data[ modal.find( ".system-page-type" ).val() + "_error_page_url" ]  = url;
	}
	modal.find( ".system-page-url" ).parent().removeClass( "has-error" );

	if ( modal.find( ".system-page-type" ).val() == "archiver" ) {
		settings_data[ modal.find( ".system-page-type" ).val() + "_content_access" ]     = modal.find( ".content-access" ).val();
		settings_data[ modal.find( ".system-page-type" ).val() + "_content_visibility" ] = modal.find( ".content-visibility" ).val();
	}

	var x = $( this ).save_settings(
		{
			data: settings_data,
			on_init: function( $me, $result) {
				$me.disable_button( {disable:true, icon:"update"} );
				$save_button.disable_button( {disable:true} );
			},
			on_success: function( $me, $result) {
				// modal.modal('toggle');
				// tinyMCE.remove();
				if ( $this_button.hasClass( "-close" ) ) {
					modal.modal( 'toggle' );
				}
				$( ".wlm-message-holder" ).show_message( {message:$result.msg, type:$result.msg_type, icon:$result.msg_type} );
			},
			on_fail: function( $me, $data) {
				$save_button.disable_button( {disable:false} );
				$me.disable_button( {disable:false, icon:"save"} );
				$( ".wlm-message-holder" ).show_message( {message: WLM3VARS.request_failed, type: "danger" } );
			},
			on_error: function( $me, $error_fields) {
				$save_button.disable_button( {disable:false} );
				$me.disable_button( {disable:false, icon:"save"} );
				$( ".wlm-message-holder" ).show_message( {message: WLM3VARS.request_error, type: "danger" } );
			},
			on_done: function( $me, $data) {
				$save_button.disable_button( {disable:false} );
				$me.disable_button( {disable:false, icon:"save"} );
			}
		}
	);
}
