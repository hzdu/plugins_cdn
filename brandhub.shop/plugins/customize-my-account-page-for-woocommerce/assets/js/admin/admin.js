/**
 * Javascript related to admin pages.
 */

'use strict';

/**
 * Custom tab functionality.
 */
jQuery( function( $ ) {
	var currentHref   = '',
		$tabs         = $( '#tgwc-tabs' ),
		$lis          = $tabs.find( '.dd-item' ),
		$deleteDialog = $( '#tgwc-dialog-delete' );

	$( window ).on( 'load added_endpoint', function() {
		var $endpointEnable = $( 'input[name*="enable"]' );

		$endpointEnable.on(
			'change',
			function() {
				var $endpointSlug = $( this ).closest( '.tgwc-tabs-panel' ).prop( 'id' ),
					$endpointItem = $( '.dd-item[data-id="' + $endpointSlug + '"]' );

				if ( $( this ).prop( 'checked' ) ) {
					$endpointItem.find( '.tgwc-sidenav-tab-anchor span:nth-child(2)' ).hide();
				} else {
					$endpointItem.find( '.tgwc-sidenav-tab-anchor span:nth-child(2)' ).show();
				}
			}
		);
	} );

	$.each( $lis, function( index, li ){
		var $a = $( li ).find( 'a' ),
			href = $a.attr( 'href' );

		if ( index > 0 ) {
			$( href ).hide();
		} else {
			$( li ).addClass( 'active' );
			$( href ).addClass( 'active' );
			currentHref = href;
		}
	} );

	$tabs.on( 'click', '.dd-item a', function( e ) {
		e.preventDefault();
		e.stopPropagation();

		var href = $( this ).attr( 'href' );
		var $tabContainer = $( href );

		if ( currentHref === href ) {
			return;
		}

		// Remove active class.
		$tabs.find( '.dd-item' ).removeClass( 'active' );
		$( currentHref ).removeClass( 'active' );

		// Add active classes to the tab and tab content.
		$( this ).parents( '.dd-item' ).first().addClass( 'active' );
		$( href ).addClass( 'active' );

		// Fade in and fadeOut the tab container.
		$( currentHref ).fadeOut( $.proxy( function() {
			$( this ).fadeIn();
		}, $tabContainer ) );

		currentHref = href;
	} );

	/**
	 * Handle the endpoints deletion.
	 */
	$tabs.on( 'click', '.tgwc-delete-endpoints', function( e ) {
		e.preventDefault();

		$deleteDialog.dialog( {
			resizable: false,
			height: 'auto',
			width: 400,
			modal: true,
			autoOpen: true,
			open: function() {
				$( this ).parent( '.ui-dialog' ).find( '.tgwc-button--danger:eq(0)' ).focus();
			},
			buttons: [
				{
					text: window.tgwc.i18n.cancel,
					class: 'tgwc-button tgwc-button--link tgwc-endpoint-dialog-form-cancel',
					tabindex: 2,
					click:  function() {
						$( this ).dialog( 'close' );
					}
				},
				{
					text: window.tgwc.i18n.delete,
					class: 'tgwc-button tgwc-button--danger',
					tabindex: 1,
					click: $.proxy( function() {
						$deleteDialog.dialog( 'close' );

						var $panel = $( this ).closest( '.tgwc-tabs-panel' ),
							panelId = $panel.attr( 'id' ),
							$tab = $panel.siblings( '.tgwc-sidenav' ).find( '[data-id="' + panelId + '"]' ),
							$tabSibling = $tab.siblings( '.dd-item' ).first();

						if ( ! $tabSibling.length ) {
							$tabSibling = $tab.parents( '.dd-item' ).first();
						}

						$tabSibling.first().find( 'a' ).first().trigger( 'click' );
						$tab.fadeOut( function() {
							$( this ).remove();
							$panel.remove();
						} );
					}, this ),
				}
			]
		});
	} );
}  );


/**
 * Initialize select an icon list.
 *
 * @see https://stackoverflow.com/questions/15041058/select2-performance-for-large-set-of-items
 */
( function( $, tgwc ) {
	var $icons   = $( 'select[name$="[icon]"]' ),
		pageSize = 50;

	$.fn.select2.amd.require( ["select2/data/array", "select2/utils"], function( ArrayData, Utils ) {
		function CustomData( $element, options ) {
			CustomData.__super__.constructor.call( this, $element, options );
		}

		Utils.Extend( CustomData, ArrayData );

		CustomData.prototype.query = function( params, callback ) {
			var results = [];
			if ( params.term && '' !== params.term ) {
				results = _.filter( tgwc.icons, function( e ) {
					return e.text.toUpperCase().indexOf( params.term.toUpperCase() ) >= 0;
				} );
			} else {
				results = tgwc.icons;
			}

			if( ! ( 'page' in params ) ) {
				params.page = 1;
			}

			var data = {};
			data.results = results.slice( (params.page - 1 ) * pageSize, params.page * pageSize );
			data.pagination = {};
			data.pagination.more = params.page * pageSize < results.length;
			callback( data );
		};


		$.each( $icons, function( index, icon ) {
			$( icon ).select2( {
				placeholder: tgwc.i18n.selectAnIcon,
				allowClear: true,
				ajax: {},
				dataAdapter: CustomData,
				escapeMarkup: function( markup ) {
					return markup;
				}
			} );

			var selectedIcon = $( icon ).data( 'selected' );
			if ( '' !== selectedIcon || undefined !== selectedIcon ) {
				var text = selectedIcon.replace('fas fa-', '' );
				text = text.replace('-', ' ' );
				text = text.charAt(0).toUpperCase() + text.slice(1);
				text = `<i class="${selectedIcon}"></i> ${text}`;

				var newOption = new Option(text, selectedIcon, true, true );
				$( icon ).append( newOption ).trigger( 'change' );
			}
		} );
	} );

} )( jQuery, window.tgwc );


/**
 * Handle addition of endpoint, links and group.
 */
jQuery( function( $ ) {
	var $tabs               = $( '#tgwc-tabs' ),
		$endpointDialog     = $( '#tgwc-endpoint-dialog' ),
		$endpointDialogType = $( '#tgwc-endpoint-dialog-type' ),
		$endpointDialogName = $( '#tgwc-endpoint-dialog-name' ),
		$endpointActions    = $( '#tgwc-endpoint-actions' );

	/**
	 * Handle click on 'Add endpoint'.
	 */
	$endpointActions.on( 'click', 'button', function( e ) {
		e.preventDefault();

		var type = $( this ).data( 'type' );
		$endpointDialogType.val( type );

		$endpointDialog.dialog({
			resizable: false,
			autoOpen: true,
			modal: true,
			title: `Add ${type}`,
			minWidth: 460,
			buttons: [
				{
					text: window.tgwc.i18n.cancel,
					class: 'tgwc-button tgwc-button--link tgwc-endpoint-dialog-form-cancel',
					tabindex: 2,
					click: function() {
						$( this ).dialog( 'close' );
					}
				},
				{
					text: `${window.tgwc.i18n.add} ${type}`,
					class: 'tgwc-button tgwc-button--primary tgwc-endpoint-dialog-form-add',
					tabindex: 1,
					click: function() {
						if ( addTab( this ) ) {
							$( this ).dialog( 'close' );
						}
					}
				},
			],
			close: function() {
				$endpointDialog.find( 'form' ).get( 0 ).reset();
				$endpointDialog.find( '.tgwc-error-message' ).html( '' );
			}
		});
	});

	/**
	 * Handle enter key press in the endpoint dialog.
	 */
	$( 'body' ).on('keydown', '#tgwc-endpoint-dialog', function( e ) {
		if ( e.keyCode === $.ui.keyCode.ENTER ) {
			if( addTab( this ) ) {
				$( this ).dialog( 'close' );
			}
			e.preventDefault();
			e.stopPropagation();
		}
	});

	/**
	 * Add tab.
	 *
	 * @since 0.1.0
	 * @return void
	 */
	function addTab( form ) {
		var name       = $endpointDialogName.val(),
			type       = $endpointDialogType.val(),
			prefixType = type.substring(0, 1).toUpperCase(),
			slug       = textToID( name );

		// Generate the slug even if th slug is already registered.
		slug = generateEndpointSlug( slug );
		var li  = [
			`<li class="dd-item ${type}" data-id="${slug}" data-type="${type}">`,
			`<span class="dd-handle dd3-handle"></span>`,
			`<a class="dd3-content tgwc-sidenav-tab-anchor" href="#${slug}"><span title="${type.charAt(0).toUpperCase() + type.slice(1)}">[${prefixType}]</span> <span>[D]</span> <span>${name}</span></a>`,
			`</li>`
		].join('');

		if ( '' === name ) {
			$( form).find( '.tgwc-error-message' ).html( 'Empty name is not allowed.' );
			return false;
		}

		var template = wp.template( `tgwc-${type}` );

		// Add tab and tab template.
		$tabs.find( '.dd-list' ).first().append( li );
		$tabs.append( template( {
			slug: slug,
			text: name,
			type: type,
			i18n: window.tgwc.i18n
		} ) );
		$( `#tgwc-${slug}` ).hide( 0 );

		$( document ).trigger( 'added_endpoint' );

		$.fn.select2.amd.require( ["select2/data/array", "select2/utils"], function( ArrayData, Utils ) {
			var pageSize = 50;
			function CustomData( $element, options ) {
				CustomData.__super__.constructor.call( this, $element, options );
			}

			Utils.Extend( CustomData, ArrayData );

			CustomData.prototype.query = function( params, callback ) {
				var results = [];
				if ( params.term && '' !== params.term ) {
					results = _.filter( window.tgwc.icons, function( e ) {
						return e.text.toUpperCase().indexOf( params.term.toUpperCase() ) >= 0;
					} );
				} else {
					results = window.tgwc.icons;
				}

				if( ! ( 'page' in params ) ) {
					params.page = 1;
				}

				var data = {};
				data.results = results.slice( (params.page - 1 ) * pageSize, params.page * pageSize );
				data.pagination = {};
				data.pagination.more = params.page * pageSize < results.length;
				callback( data );
			};

			$( `select[name$="tgwc_endpoints[${slug}][icon]"]` ).select2({
				placeholder: window.tgwc.i18n.selectAnIcon,
				allowClear: true,
				ajax: {},
				dataAdapter: CustomData,
				escapeMarkup: function( markup ) {
					return markup;
				}
			});
		});

		$( `select[name$="tgwc_endpoints[${slug}][user_role]"]` ).select2({
			placeholder: tgwc.i18n.selectUserRoles,
			allowClear: true,
			multiple: true,
			data: window.tgwc.roles
		});

		// Initialize the custom content.
		var textAreaId = `tgwc_endpoints_${slug}_content`;
		wp.editor.initialize( textAreaId, {
			tinymce: {
				wpautop: true,
				plugins : 'charmap colorpicker compat3x directionality fullscreen hr image lists media paste tabfocus textcolor wordpress wpautoresize wpdialogs wpeditimage wpemoji wpgallery wplink wptextpattern wpview',
				toolbar1: 'bold italic underline strikethrough | bullist numlist | blockquote hr wp_more | alignleft aligncenter alignright | link unlink | fullscreen | wp_adv',
				toolbar2: 'formatselect alignjustify forecolor | pastetext removeformat charmap | outdent indent | undo redo | wp_help',
				media_strict: false
			},
			quicktags: true,
			mediaButtons: true,
		} );

		// Select the currently added tab.
		$tabs.find( '.dd-item' ).last().find( 'a' ).trigger( 'click' );

		// Customize tooltip.
		$( '[data-toggle="tgwc-tooltip"]' ).tooltip({
			position: {
				my: 'center top-120%',
				at: 'center top',
				collision: "none",
			},
			tooltipClass: 'tgwc-tooltip'
		} );
		return true;
	}

	/**
	 * Check whether the endpoint or link or group exists or not.
	 *
	 * @since 0.1.0
	 *
	 * @param {string} endpoint Endpoint or link or group.
	 *
	 * @return {boolean}
	 */
	function isEndpointExists( endpoint ) {
		endpoint = '#' + endpoint;

		var $anchors = $tabs.find( 'li a' );
		var hrefs = $.map( $anchors, function( anchor ) {
			return $( anchor ).attr( 'href' );
		} );

		return -1 !== hrefs.indexOf( endpoint ) ;
	}

	/**
	 * Generate the endpoint slug.
	 *
	 * @since 0.2.0
	 *
	 * @param {string} slug Endpoint or link or group.
	 *
	 * @return {string} Slug.
	 */
	function generateEndpointSlug( slug ) {
		var pattern = /[^\w- ]+/g;

		// Remove characters except alphanumberic, underscore(_) and dash(-).
		slug = slug.replace( pattern, '' );

		// Remove underscore and dash from start the slug.
		slug = slug.trim();
		var firstCharacter = slug.substring( 0, 1 );
		if ( '-' === firstCharacter || '_' === firstCharacter ) {
			slug = slug.substring(1, slug.length );
		}

		// Remove underscore and dash from end of the slug.
		slug = slug.trim();
		var lastCharacter = slug.substring (slug.length - 1, slug.length );
		if ( '-' === lastCharacter || '_' === lastCharacter ) {
			slug = slug.substring(0, slug.length - 1 );
		}

		slug = '#' + slug;

		var $anchors = $tabs.find( 'li a' );
		var hrefs = $.map( $anchors, function( anchor ) {
			return $( anchor ).attr( 'href' );
		} );

		hrefs = hrefs.concat( ['#pagename', '#page', '#page_id', '#preview'] );

		var index = 0;
		while( true ) {
			if ( hrefs.indexOf( slug ) > -1 ) {
				slug = slug + 1;
			} else {
				break;
			}
		}

		return slug.substr(1);
	}

} );


/**
 * Nestable js related code.
 */
( function( $ ) {
	/**
	 * Initialize the nestable jquery plugin.
	 */
	$( '.dd' ).nestable( {
		maxDepth       : 2,
		expandBtnHTML  : '',
		collapseBtnHTML: '',
		listNodeName   : 'ul',
		onDragStart    : function( container, el ) {
			var type = $( el ).data( 'type' );

			container.find( '[data-type="endpoint"]' ).addClass( 'dd-nochildren' );
			container.find( '[data-type="link"]' ).addClass( 'dd-nochildren' );

			if ( 'group' === type ) {
				container.find( '[data-type="group"]' ).addClass( 'dd-nochildren' );
			} else {
				container.find( '[data-type="group"]' ).removeClass( 'dd-nochildren' );
			}
		},
		beforeDragStop: function( container, el, drop ) {
			var secondList = $( drop ).parents( '.dd-item' );
			var type = $( el ).data( 'type' );
			if ( 'group' === type && secondList.length ) {
				return false;
			}
		}
	} );

	/**
	 * Serialize the nested list and submit the form.
	 */
	$( '#tgwc-customization-form' ).submit( function( e ) {
		if ( $( '.dd' ).length ) {
			var data = $( '.dd' ).nestable( 'serialize' );
			data = JSON.stringify( data );
			var input = `<input type='hidden' name='tgwc_endpoints[endpoints_order]' value='${data}' />`;
			$( this ).append( input );
		}
	} );
} ) ( jQuery );

/**
 * Initializes the user roles select.
 */
( function( $ ) {

	$( '#tgwc-endpoints' ).find( 'select[name$="[user_role][]"]').each( function( index, userRole ) {
		var $userRole = $( userRole );
		$userRole.select2( {
			placeholder: window.tgwc.i18n.selectUserRoles,
			multiple: true,
			allowClear: true,
			data: window.tgwc.roles
		} );

		$userRole.val( $userRole.data( 'selected' ) );
		$userRole.trigger( 'change' );
	} );

} ) ( jQuery );


/**
 * Display restore options.
 */
( function( $ ) {
	var data                   = window.tgwc,
		$settingsForm          = $( '#tgwc-customization-form' ),
		$restoreDefaultsDialog = $( '#tgwc-dialog-restore-defaults' ),
		$setting               = $( '#tgwc-restore-defaults-settings' ),
		$customization         = $( '#tgwc-restore-defaults-customization' ),
		$debug                 = $( '#tgwc-restore-defaults-debug-settings' );


	/**
	 * Handle setting checkbox.
	 */
	$setting.add( $customization ).add( $debug ).change( function( e ) {
		e.preventDefault();

		var $noticeContainer = $( '#tgwc-dialog-restore-defaults' ).find( '.tgwc-dialog-notice' ),
			title            = '',
			message          = '',
			noticeId         = $( this ).attr( 'id' ) + '-notice';

		if ( 'tgwc-restore-defaults-settings-notice' === noticeId ) {
			title = data.i18n.settings;
			message = data.i18n.restoreSettingsInfo;
		} else if ( 'tgwc-restore-defaults-customization-notice' === noticeId ) {
			title = data.i18n.designCustomization;
			message = data.i18n.restoreCustomizationInfo;
		}

		var html = [
			'<div class="notice notice-warning" style="display: none" id="' + noticeId + '">',
			'<p>',
			'<strong>' + title + ': </strong>',
			message,
			'</p>',
			'</div>'
		].join('');


		if ( $(this ).prop( 'checked' ) ) {
			$noticeContainer.append( html );
			$( '#' + noticeId ).fadeIn();
		} else {
			$( '#' + noticeId ).fadeOut( function() {
				$( this ).remove();
			} );
		}
	} );

	/**
	 * Display restore dialog box.
	 */
	$( '#tgwc-reset').click( function( e ) {
		e.preventDefault();
		$('#tgwc-dialog-restore-defaults').dialog({
			modal: true,
			resizable: false,
			minWidth: 460,
			buttons: [
				{
					text: window.tgwc.i18n.cancel,
					class: 'tgwc-button tgwc-button--link tgwc-endpoint-dialog-form-cancel',
					tabindex: 2,
					click: function() {
						$( this ).dialog( 'close' );
					}
				},
				{
					text: window.tgwc.i18n.reset,
					class: 'tgwc-button tgwc-button--primary tgwc-endpoint-dialog-form-add',
					tabindex: 1,
					click: function() {
						var $setting       = $restoreDefaultsDialog.find( '#tgwc-restore-defaults-settings' );
						var $customization = $restoreDefaultsDialog.find( '#tgwc-restore-defaults-customization' );
						// Remove previous reset options hidden fields.
						$settingsForm.find( 'input[name^=tgwc_reset_options]' ).remove();

						var html = '';
						if ( $setting.prop( 'checked' ) ) {
							html += '<input type="hidden" name="tgwc_reset_options[setting]" value="setting" />';
						}

						if ( $customization.prop( 'checked' ) ) {
							html += '<input type="hidden" name="tgwc_reset_options[customization]" value="customization" />';
						}

						if ( $debug.prop( 'checked' ) ) {
							html += '<input type="hidden" name="tgwc_reset_options[debug]" value="debug" />';
						}
						$settingsForm.append( html );
						$( '#tgwc-submit' ).trigger( 'click' );
						$( this ).dialog( 'close' );
					}
				},
			],
			close: function() {
				$restoreDefaultsDialog.find( 'form' ).get( 0 ).reset();
				$restoreDefaultsDialog.find( '.notice' ).hide();
			}
		} );
	} );

}) ( jQuery );

jQuery( function( $ ) {

	/**
	 * Customize tooltip.
	 */
	$( '[data-toggle="tgwc-tooltip"]' ).tooltip({
		position: {
			my: 'center top-120%',
			at: 'center top',
			collision: 'none',
		},
		tooltipClass: 'tgwc-tooltip'
	} );
} );

/**
 * Change the title of the endpoints, group or link when the label is changed.
 */
( function( $ ) {
	var $container = $( '#tgwc-customization' );
	var data = window.tgwc;

	/**
	 * Change the title of the endpoints, group or link when the label is changed.
	 */
	$container.on( 'keyup keydown', 'input[name$="[label]"]', function( e ) {
		if ( e.keyCode === $.ui.keyCode.ENTER ) {
			e.preventDefault();
		}

		var label        = $( this ).val(),
			isValid      = true,
			errorMessage = '',
			panelId      = $( this ).parents( '.tgwc-tabs-panel.active' ).first().attr( 'id' ),
			eroorLabel   = $( '#tgwc-tabs' ).find( '[data-id="' + panelId + '"]').find( '.dd3-content' ).text().trim().substring(4);

		$( this ).parents( '.tgwc-tabs-panel.active' ).find( '.tgwc-tabs-panel-header h2' ).html( label );
		$( '.dd-item[data-id="' + panelId + '"]' ).find( '.tgwc-sidenav-tab-anchor span:nth-child(3)' ).html( label );
		$( this ).siblings('.notice' ).remove();

		if ( '' ===  label ) {
			errorMessage = data.i18n.labelCannotBeEmpty;
			$( this ).after( '<div class="notice notice-error"><p>' + errorMessage + '</p></div>' );
			isValid = false;
		}

		$( this ).data( 'isValid', isValid );
		$( this ).data( 'error', {
			label: eroorLabel,
			message: errorMessage
		} );
	} );

	/**
	 * Verify the slug.
	 */
	$container.on( 'keyup keydown', 'input[name$="[slug]"]', function( e ) {
		if ( e.keyCode === $.ui.keyCode.ENTER ) {
			e.preventDefault();
		}

		var currentSlug                = $( this ).parents( '.tgwc-tabs-panel.active' ).attr('id'),
			panelId                    = $( this ).parents( '.tgwc-tabs-panel.active' ).first().attr( 'id' ),
			label                      = $( '#tgwc-tabs' ).find( '[data-id="' + panelId + '"]').find( '.dd3-content' ).text().trim().substring(4),
			slug                       = $( this ).val().toLowerCase(),
			message                    = data.i18n.available,
			errorMessage               = '',
			$endpoints                 = $container.find( 'li.endpoint' ),
			cssClass                   = 'notice-success',
			isValid                    = true,
			patternValidCharacterCheck = /^[\w-]+$/g,
			patternBeginWithCheck      = /^[a-zA-Z0-9]+[\w-]*[a-zA-Z0-9]$/g;

		var endpoints = $.map( $endpoints, function( endpoint ) {
			var slug = $( endpoint ).data( 'id' );
			if ( currentSlug !== slug ) {
				return slug;
			}
		} );

		// Add kyewords which cannot be used as slugs.
		endpoints = endpoints.concat( ['pagename', 'page', 'page_id', 'preview'] );

		if ( endpoints.indexOf( slug ) >= 0 ) {
			message      = data.i18n.notAvailable;
			errorMessage = data.i18n.notAvailable;
			cssClass     = 'notice-error';
			isValid      = false;
		}

		if ( ! patternBeginWithCheck.test( slug ) ) {
			message      = data.i18n.slugMustBeginWith;
			errorMessage = data.i18n.slugMustBeginWith;
			cssClass     = 'notice-error';
			isValid      = false;
		}

		if ( ! patternValidCharacterCheck.test( slug ) ) {
			message      = data.i18n.slugCanOnlyContains;
			errorMessage = data.i18n.slugCanOnlyContains;
			cssClass     = 'notice-error';
			isValid      = false;
		}

		if ( slug.length < 3 ) {
			message      = data.i18n.slugMustBeOfLength;
			errorMessage = data.i18n.slugMustBeOfLength;
			cssClass     = 'notice-error';
			isValid      = false;
		}

		if ( '' === slug ) {
			message      = data.i18n.slugCannotBeEmpty;
			errorMessage = data.i18n.slugCannotBeEmpty;
			cssClass     = 'notice-error';
			isValid      = false;
		}

		$( this ).siblings('.notice' ).remove();
		$( this ).after( '<div class="notice ' + cssClass + '"><p>' + message+ '</p></div>' );
		$( this ).data( 'isValid', isValid );
		$( this ).data( 'error', {
			label: label,
			message: errorMessage
		} );
		this.value = slug;
	} );

	/**
	 * Disable submit when enter is pressed in class input field.
	 */
	$container.on( 'keyup keydown', 'input[name$="[class]"]', function( e ) {
		if ( e.keyCode === $.ui.keyCode.ENTER ) {
			e.preventDefault();
		}
	} );

	/**
	 * Dislay error dialog if the form is invalid.
	 */
	$container.find( 'form' ).submit( function( e ) {
		var isValid   = true,
			errorHtml = '',
			$inputs   = $container.find( 'input[name$="[slug]"], input[name$="[label]"] ');

		$.each( $inputs, function( index, input ) {
			var valid = $( input ).data( 'isValid' );
			var error = $( input ).data( 'error' );
			var html  = '';

			valid   = undefined === valid ? true : valid;
			isValid = isValid && valid;

			if ( ! valid ) {
				html = [
					'<div class="notice notice-error">',
					'<p>',
					'<strong>' + error.label + ': </strong>',
					error.message,
					'</p>',
					'</div>'
				].join('');
			}

			errorHtml = errorHtml + html;
		} );


		if ( ! isValid ) {
			e.preventDefault();
			$( '<div/>' ).html(
				'<div class="tgwc-dialog-content"><span class="ui-icon ui-icon-alert"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-triangle"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></span><div class="tgwc-dialog-content__detail"><p>' + data.i18n.resolveFormErrors + '</p></div></div>'  +  '<div class="tgwc-dialog-content-list">' + errorHtml + '</div>'
			).dialog( {
				title: data.i18n.couldNotSaveChanges,
				dialogClass: "no-close",
				resizable: false,
				width: '400px',
				modal: true,
				buttons: [
					{
						text: data.i18n.ok.toUpperCase(),
						class: 'tgwc-button tgwc-button--link tgwc-endpoint-dialog-form-cancel',
						click: function() {
							$( this ).dialog( 'close' );
						}
					}
				]
			} );
		}
	} );
} ) ( jQuery );
