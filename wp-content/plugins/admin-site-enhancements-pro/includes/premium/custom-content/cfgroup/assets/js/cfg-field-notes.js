/**
 * CFG Field Group editor: deferred TinyMCE init for field Instructions.
 */
( function( $ ) {
	'use strict';

	var pendingCount = 0;

	/**
	 * @return {object}
	 */
	function getEditorSettings() {
		var settings = ( window.cfgFieldNotesL10n && window.cfgFieldNotesL10n.editorSettings ) || {};

		settings = $.extend( true, {}, settings );

		if ( settings.tinymce === true ) {
			settings.tinymce = {};
		}

		if ( typeof settings.tinymce === 'object' ) {
			settings.tinymce = $.extend( {}, settings.tinymce );

			if ( ! settings.tinymce.content_css && window.cfgFieldNotesL10n.contentCss ) {
				settings.tinymce.content_css = window.cfgFieldNotesL10n.contentCss;
			}
		}

		return settings;
	}

	/**
	 * @return {string}
	 */
	function generateEditorId() {
		pendingCount += 1;
		return 'cfgnotes_dyn_' + pendingCount + '_' + Date.now();
	}

	/**
	 * @param {jQuery} $textarea
	 */
	function refreshEditorLayout( $textarea ) {
		var id = $textarea.attr( 'id' );

		if ( ! id || typeof window.tinymce === 'undefined' ) {
			return;
		}

		var editor = window.tinymce.get( id );

		if ( editor ) {
			editor.show();

			if ( editor.getContainer() ) {
				editor.getContainer().style.visibility = 'visible';
			}
		}
	}

	/**
	 * @param {string} id
	 */
	function removeEditor( id ) {
		if ( ! id ) {
			return;
		}

		if ( window.wp && window.wp.editor && window.wp.editor.remove ) {
			window.wp.editor.remove( id );
		} else if ( window.tinymce ) {
			window.tinymce.execCommand( 'mceRemoveEditor', false, id );
		}
	}

	/**
	 * @param {string} id
	 */
	function initializeEditor( id ) {
		if ( ! id || typeof window.wp === 'undefined' || ! window.wp.editor || ! window.wp.editor.initialize ) {
			return;
		}

		if ( $( '#wp-' + id + '-wrap' ).length ) {
			return;
		}

		window.wp.editor.initialize( id, getEditorSettings() );
	}

	/**
	 * Initialize pending Instructions editors inside a context element.
	 *
	 * @param {jQuery} $context
	 */
	function initPendingEditors( $context ) {
		if ( typeof window.wp === 'undefined' || ! window.wp.editor || ! window.wp.editor.initialize ) {
			return;
		}

		$context = $context || $( document );

		$context.find( '.cfg-field-notes-pending textarea.cfg-field-notes-textarea' ).each( function() {
			var $textarea = $( this );
			var $pending  = $textarea.closest( '.cfg-field-notes-pending' );
			var id        = $textarea.attr( 'id' );

			if ( id && $( '#wp-' + id + '-wrap' ).length ) {
				$pending.removeClass( 'cfg-field-notes-pending' ).addClass( 'cfg-field-notes-initialized' );
				return;
			}

			if ( ! id ) {
				id = generateEditorId();
				$textarea.attr( 'id', id );
			}

			initializeEditor( id );
			$pending.removeClass( 'cfg-field-notes-pending' ).addClass( 'cfg-field-notes-initialized' );
			refreshEditorLayout( $textarea );
		} );
	}

	/**
	 * Remove Instructions editors inside a context element.
	 *
	 * @param {jQuery} $context
	 */
	function removeEditorsInContext( $context ) {
		$context.find( '.cfg-field-notes-textarea' ).each( function() {
			var id = $( this ).attr( 'id' );

			if ( id ) {
				removeEditor( id );
			}
		} );

		$context.find( '.cfg-field-notes-initialized' ).each( function() {
			$( this ).removeClass( 'cfg-field-notes-initialized' ).addClass( 'cfg-field-notes-pending' );
		} );
	}

	/**
	 * Whether an editor belongs to a CFG Instructions field.
	 *
	 * @param {object} editor TinyMCE editor instance.
	 * @return {boolean}
	 */
	function isCfgFieldNotesEditor( editor ) {
		if ( ! editor || ! editor.id ) {
			return false;
		}

		return $( '#' + editor.id ).closest( '.cfg-field-notes-editor' ).length > 0;
	}

	/**
	 * Whether a CFG editor is currently in TinyMCE fullscreen mode.
	 *
	 * @param {object} editor TinyMCE editor instance.
	 * @return {boolean}
	 */
	function isCfgFullscreenActive( editor ) {
		if ( ! editor || ! editor.plugins || ! editor.plugins.fullscreen ) {
			return false;
		}

		return !! editor.plugins.fullscreen.isFullscreen();
	}

	/**
	 * Available viewport region beside admin bar / admin menu.
	 * Uses computed #wpcontent margin so Wider Admin Menu custom widths apply.
	 *
	 * @return {{ top: number, side: number, width: number, height: number, isRtl: boolean }}
	 */
	function getFullscreenChromeOffsets() {
		var top = 0;
		var side = 0;
		var isRtl = document.body.classList.contains( 'rtl' );
		var adminBar;
		var wpcontent;
		var style;
		var marginValue;

		if ( ! document.body.classList.contains( 'wp-admin' ) ) {
			return {
				top: 0,
				side: 0,
				width: window.innerWidth,
				height: window.innerHeight,
				isRtl: isRtl,
			};
		}

		if ( document.body.classList.contains( 'admin-bar' ) ) {
			adminBar = document.getElementById( 'wpadminbar' );

			if ( adminBar ) {
				top = adminBar.offsetHeight || 0;
			}
		}

		wpcontent = document.getElementById( 'wpcontent' );

		if ( wpcontent ) {
			style = window.getComputedStyle( wpcontent );
			marginValue = parseInt( isRtl ? style.marginRight : style.marginLeft, 10 );
			side = isNaN( marginValue ) ? 0 : Math.max( 0, marginValue );
		}

		return {
			top: top,
			side: side,
			width: Math.max( 0, window.innerWidth - side ),
			height: Math.max( 0, window.innerHeight - top ),
			isRtl: isRtl,
		};
	}

	/**
	 * Position an Instructions fullscreen editor inside the admin content area.
	 *
	 * @param {object} editor TinyMCE editor instance.
	 */
	function layoutCfgFullscreenEditor( editor ) {
		var container;
		var iframe;
		var contentArea;
		var offsets;
		var toolbarHeight;

		if ( ! isCfgFieldNotesEditor( editor ) || ! isCfgFullscreenActive( editor ) ) {
			return;
		}

		container = editor.getContainer();
		contentArea = editor.getContentAreaContainer();
		iframe = contentArea ? contentArea.firstChild : null;

		if ( ! container || ! iframe ) {
			return;
		}

		offsets = getFullscreenChromeOffsets();

		// Cache toolbar height from TinyMCE's consistent fullscreen layout (before we shrink
		// the container). Reuse on later resize/fold so TinyMCE's full-window iframe math
		// cannot produce a negative or wrong chrome measurement.
		if ( 'number' === typeof editor._cfgFullscreenToolbarHeight ) {
			toolbarHeight = editor._cfgFullscreenToolbarHeight;
		} else {
			toolbarHeight = Math.max( 0, container.clientHeight - iframe.clientHeight );
			editor._cfgFullscreenToolbarHeight = toolbarHeight;
		}

		container.style.setProperty( 'top', offsets.top + 'px', 'important' );
		container.style.setProperty( 'width', offsets.width + 'px', 'important' );
		container.style.setProperty( 'height', offsets.height + 'px', 'important' );

		if ( offsets.isRtl ) {
			container.style.setProperty( 'right', offsets.side + 'px', 'important' );
			container.style.setProperty( 'left', 'auto', 'important' );
		} else {
			container.style.setProperty( 'left', offsets.side + 'px', 'important' );
			container.style.setProperty( 'right', 'auto', 'important' );
		}

		iframe.style.height = Math.max( 0, offsets.height - toolbarHeight ) + 'px';
	}

	/**
	 * Remove CFG fullscreen layout overrides so TinyMCE can restore normal sizing.
	 *
	 * @param {object} editor TinyMCE editor instance.
	 */
	function clearCfgFullscreenLayout( editor ) {
		var container;
		var contentArea;
		var iframe;

		if ( ! editor || typeof editor.getContainer !== 'function' ) {
			return;
		}

		if ( Object.prototype.hasOwnProperty.call( editor, '_cfgFullscreenToolbarHeight' ) ) {
			delete editor._cfgFullscreenToolbarHeight;
		}

		container = editor.getContainer();

		if ( container && container.style ) {
			container.style.removeProperty( 'top' );
			container.style.removeProperty( 'left' );
			container.style.removeProperty( 'right' );
			container.style.removeProperty( 'width' );
			container.style.removeProperty( 'height' );
		}

		contentArea = typeof editor.getContentAreaContainer === 'function' ? editor.getContentAreaContainer() : null;
		iframe = contentArea ? contentArea.firstChild : null;

		if ( iframe && iframe.style ) {
			iframe.style.removeProperty( 'height' );
		}

		if ( contentArea && contentArea.style ) {
			contentArea.style.removeProperty( 'height' );
		}
	}

	/**
	 * Re-layout every Instructions editor that is currently fullscreen.
	 */
	function layoutAllCfgFullscreenEditors() {
		var editors;
		var i;

		if ( typeof window.tinymce === 'undefined' || ! window.tinymce.editors ) {
			return;
		}

		editors = window.tinymce.editors;

		for ( i = 0; i < editors.length; i++ ) {
			if ( isCfgFieldNotesEditor( editors[ i ] ) && isCfgFullscreenActive( editors[ i ] ) ) {
				layoutCfgFullscreenEditor( editors[ i ] );
			}
		}
	}

	/**
	 * Bind fullscreen chrome offset handling for one Instructions editor.
	 *
	 * @param {object} editor TinyMCE editor instance.
	 */
	function bindCfgFullscreenChrome( editor ) {
		if ( ! editor || editor._cfgFullscreenChromeBound ) {
			return;
		}

		editor._cfgFullscreenChromeBound = true;

		editor.on( 'FullscreenStateChanged', function( e ) {
			if ( e && e.state ) {
				// Defer so TinyMCE finishes its own fullscreen resize first.
				window.setTimeout( function() {
					layoutCfgFullscreenEditor( editor );
				}, 0 );
			} else {
				clearCfgFullscreenLayout( editor );
			}
		} );
	}

	$( document ).on( 'wp-before-tinymce-init', function( event, init ) {
		if ( ! window.cfgFieldNotesL10n ) {
			return;
		}

		if ( ! init.content_css && window.cfgFieldNotesL10n.contentCss ) {
			init.content_css = window.cfgFieldNotesL10n.contentCss;
		}

		init.convert_urls = false;
	} );

	$( document ).on( 'tinymce-editor-init', function( event, editor ) {
		if ( ! editor || ! editor.id ) {
			return;
		}

		if ( ! isCfgFieldNotesEditor( editor ) ) {
			return;
		}

		bindCfgFullscreenChrome( editor );
	} );

	$( function() {
		$( document ).on( 'cfgroup/field_notes_init', function( event, $context ) {
			if ( $context && $context.length ) {
				initPendingEditors( $context );
			}
		} );

		$( document ).on( 'cfgroup/field_notes_remove', function( event, $context ) {
			if ( $context && $context.length ) {
				removeEditorsInContext( $context );
			}
		} );

		$( 'form#post' ).on( 'submit', function() {
			if ( window.tinymce ) {
				window.tinymce.triggerSave();
			}
		} );

		// Keep Instructions fullscreen editors aligned with admin chrome (incl. Wider Admin Menu / fold).
		// Defer so this runs after TinyMCE’s own fullscreen window-resize handler.
		$( window ).on( 'resize', function() {
			window.setTimeout( layoutAllCfgFullscreenEditors, 0 );
		} );

		$( document ).on( 'click', '#collapse-menu, #collapse-button', function() {
			window.setTimeout( layoutAllCfgFullscreenEditors, 0 );
		} );
	} );
}( jQuery ) );
