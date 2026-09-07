( function( wp ) {
	'use strict';

	if ( ! wp || ! wp.element || ! wp.plugins || ! wp.components || typeof pp_params === 'undefined' ) {
		return;
	}

	var el = wp.element.createElement;
	var useState = wp.element.useState;
	var useEffect = wp.element.useEffect;
	var useLayoutEffect = wp.element.useLayoutEffect;
	var useRef = wp.element.useRef;
	var registerPlugin = wp.plugins.registerPlugin;
	var PluginPostStatusInfo = wp.editPost && wp.editPost.PluginPostStatusInfo;

	if ( ! PluginPostStatusInfo ) {
		return;
	}

	var Button = wp.components.Button;

	function getRemainingLabel( expiresAt ) {
		var remaining = expiresAt - Math.floor( Date.now() / 1000 );

		if ( remaining <= 0 ) {
			return pp_params.expiredLabel;
		}

		var days = Math.floor( remaining / 86400 );
		var hours = Math.floor( ( remaining % 86400 ) / 3600 );
		var minutes = Math.floor( ( remaining % 3600 ) / 60 );
		var duration;

		if ( days > 0 ) {
			duration = days + ( days === 1 ? ' day, ' : ' days, ' ) + hours + ( hours === 1 ? ' hour' : ' hours' );
		} else if ( hours > 0 ) {
			duration = hours + ( hours === 1 ? ' hour, ' : ' hours, ' ) + minutes + ( minutes === 1 ? ' minute' : ' minutes' );
		} else {
			minutes = Math.max( 1, minutes );
			duration = minutes + ( minutes === 1 ? ' minute' : ' minutes' );
		}

		return ( pp_params.expiresInFormat || 'Expires in %s' ).replace( '%s', duration );
	}

	// https://icon-sets.iconify.design/ion/copy-outline/
	function CopyPreviewIcon() {
		return el(
			'svg',
			{
				xmlns: 'http://www.w3.org/2000/svg',
				width: 18,
				height: 18,
				viewBox: '0 0 512 512',
				'aria-hidden': true
			},
			el( 'rect', {
				width: 336,
				height: 336,
				x: 128,
				y: 128,
				fill: 'none',
				stroke: 'currentColor',
				strokeLinejoin: 'round',
				strokeWidth: 32,
				rx: 57,
				ry: 57
			} ),
			el( 'path', {
				fill: 'none',
				stroke: 'currentColor',
				strokeLinecap: 'round',
				strokeLinejoin: 'round',
				strokeWidth: 32,
				d: 'm383.5 128l.5-24a56.16 56.16 0 0 0-56-56H112a64.19 64.19 0 0 0-64 64v216a56.16 56.16 0 0 0 56 56h24'
			} )
		);
	}

	function getCopyButtonElement( refEl ) {
		if ( ! refEl ) {
			return null;
		}

		if ( refEl.tagName === 'BUTTON' ) {
			return refEl;
		}

		var button = refEl.querySelector && refEl.querySelector( 'button' );

		return button || refEl;
	}

	function destroyTippyInstance( instanceRef ) {
		if ( instanceRef.current ) {
			instanceRef.current.destroy();
			instanceRef.current = null;
		}
	}

	function showCopySnackbar() {
		if ( ! wp.data || ! wp.data.dispatch ) {
			return;
		}

		wp.data.dispatch( 'core/notices' ).createNotice(
			'success',
			pp_params.copyCopiedLabel,
			{
				type: 'snackbar',
				isDismissible: false
			}
		);
	}

	function copyTextToClipboard( text ) {
		if ( navigator.clipboard && navigator.clipboard.writeText ) {
			return navigator.clipboard.writeText( text );
		}

		return new Promise( function( resolve, reject ) {
			var textarea = document.createElement( 'textarea' );
			textarea.value = text;
			textarea.setAttribute( 'readonly', '' );
			textarea.style.position = 'absolute';
			textarea.style.left = '-9999px';
			document.body.appendChild( textarea );
			textarea.select();

			try {
				var ok = document.execCommand( 'copy' );
				document.body.removeChild( textarea );
				if ( ok ) {
					resolve();
				} else {
					reject();
				}
			} catch ( err ) {
				document.body.removeChild( textarea );
				reject( err );
			}
		} );
	}

	function AsenhaPublicPreviewPanel() {
		var _linkState = useState( pp_params.link );
		var previewLink = _linkState[0];
		var setPreviewLink = _linkState[1];

		var _expiresState = useState( parseInt( pp_params.expiresAt, 10 ) || 0 );
		var expiresAt = _expiresState[0];
		var setExpiresAt = _expiresState[1];

		var _labelState = useState( pp_params.remainingLabel || '' );
		var remainingLabel = _labelState[0];
		var setRemainingLabel = _labelState[1];

		var _busyState = useState( false );
		var isResetting = _busyState[0];
		var setIsResetting = _busyState[1];

		var copyButtonRef = useRef( null );
		var tippyInstanceRef = useRef( null );

		useEffect( function() {
			if ( ! expiresAt ) {
				return undefined;
			}

			var intervalId = window.setInterval( function() {
				setRemainingLabel( getRemainingLabel( expiresAt ) );
			}, 60000 );

			return function() {
				window.clearInterval( intervalId );
			};
		}, [ expiresAt ] );

		useLayoutEffect( function() {
			var buttonEl = getCopyButtonElement( copyButtonRef.current );

			if ( ! buttonEl || typeof tippy === 'undefined' ) {
				destroyTippyInstance( tippyInstanceRef );
				return undefined;
			}

			destroyTippyInstance( tippyInstanceRef );

			tippyInstanceRef.current = tippy( buttonEl, {
				content: pp_params.copyCopiedLabel,
				placement: 'right',
				arrow: true,
				theme: 'light',
				trigger: 'manual',
				hideOnClick: false,
				appendTo: function() {
					return document.body;
				}
			} );

			return function() {
				destroyTippyInstance( tippyInstanceRef );
			};
		}, [ previewLink ] );

		function showCopyFeedback() {
			if ( tippyInstanceRef.current ) {
				tippyInstanceRef.current.show();
				window.setTimeout( function() {
					if ( tippyInstanceRef.current ) {
						tippyInstanceRef.current.hide();
					}
				}, 1000 );
				return;
			}

			showCopySnackbar();
		}

		function onCopyClick() {
			copyTextToClipboard( previewLink ).then( function() {
				showCopyFeedback();
			} ).catch( function() {
				window.alert( pp_params.copyError || pp_params.resetError );
			} );
		}

		function onResetClick() {
			if ( ! window.confirm( pp_params.confirmReset ) ) {
				return;
			}

			setIsResetting( true );

			if ( typeof jQuery === 'undefined' ) {
				setIsResetting( false );
				window.alert( pp_params.resetError );
				return;
			}

			jQuery.post(
				pp_params.ajaxUrl,
				{
					action: pp_params.action,
					post_id: pp_params.postId,
					nonce: pp_params.nonce
				}
			).done( function( response ) {
				if ( response.success && response.data ) {
					setPreviewLink( response.data.link );
					setExpiresAt( response.data.expires_at );
					setRemainingLabel( response.data.remaining_label );
				} else {
					window.alert( pp_params.resetError );
				}
			} ).fail( function() {
				window.alert( pp_params.resetError );
			} ).always( function() {
				setIsResetting( false );
			} );
		}

		return el(
			PluginPostStatusInfo,
			{ className: 'asenha-public-preview-status-info' },
			el(
				'div',
				{ className: 'asenha-public-preview-wrap' },
				el(
					'div',
					{ className: 'asenha-public-preview-actions' },
					el(
						Button,
						{
							variant: 'secondary',
							name: 'asenha_gutenberg_public_preview_link',
							isLink: true,
							title: pp_params.ppPostTitle,
							href: previewLink
						},
						pp_params.ppPostText
					),
					el(
						'div',
						{ className: 'asenha-public-preview-icon-group' },
						el(
							Button,
							{
								ref: copyButtonRef,
								size: 'small',
								className: 'asenha-copy-preview-link-button',
								icon: CopyPreviewIcon(),
								label: pp_params.copyLabel,
								showTooltip: false,
								onClick: onCopyClick
							}
						),
						el(
							Button,
							{
								size: 'small',
								className: 'asenha-public-preview-reset',
								icon: 'update',
								label: pp_params.resetLabel,
								showTooltip: true,
								isBusy: isResetting,
								disabled: isResetting,
								onClick: onResetClick
							}
						)
					)
				),
				el(
					'p',
					{ className: 'asenha-public-preview-expiry' },
					remainingLabel
				)
			)
		);
	}

	registerPlugin( 'asenha-public-preview-status-info-plugin', {
		render: AsenhaPublicPreviewPanel
	} );

}( window.wp ) );
