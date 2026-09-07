/**
 * Site Backup: deferred TinyMCE init for archive notes editors.
 */
( function( $ ) {
	'use strict';

	var pendingCount = 0;
	var minEditorHeight = 40;
	var defaultEditorHeight = 120;
	var suppressEditorAutoFocus = false;
	var focusRestoreDelays = [ 0, 50, 200, 250 ];

	/**
	 * @param {string} id
	 * @return {boolean}
	 */
	function isArchiveNoteEditorId( id ) {
		id = String( id || '' );

		if ( ! id ) {
			return false;
		}

		return id === 'asenha-backup-note' || id.indexOf( 'asenha_archive_note_' ) === 0;
	}

	/**
	 * @return {Element|null}
	 */
	function captureFocusTarget() {
		var active = document.activeElement;

		if ( ! active || active === document.body || active === document.documentElement ) {
			return null;
		}

		return active;
	}

	/**
	 * @param {Element|null} target
	 */
	function restoreFocusTarget( target ) {
		if ( ! target || typeof target.focus !== 'function' ) {
			return;
		}

		try {
			target.focus( { preventScroll: true } );
		} catch ( e ) {
			try {
				target.focus();
			} catch ( e2 ) {
				// Ignore focus errors from detached or non-focusable elements.
			}
		}
	}

	/**
	 * @param {number} scrollY
	 */
	function restoreScrollPosition( scrollY ) {
		if ( typeof scrollY !== 'number' || isNaN( scrollY ) ) {
			return;
		}

		if ( window.scrollY !== scrollY ) {
			window.scrollTo( 0, scrollY );
		}
	}

	/**
	 * @param {Element|null} target
	 * @param {number|null} scrollY
	 */
	function scheduleFocusRestore( target, scrollY ) {
		if ( ! target && ( typeof scrollY !== 'number' || isNaN( scrollY ) ) ) {
			return;
		}

		focusRestoreDelays.forEach( function( delay ) {
			setTimeout( function() {
				if ( target ) {
					restoreFocusTarget( target );
				}

				if ( typeof scrollY === 'number' && ! isNaN( scrollY ) ) {
					restoreScrollPosition( scrollY );
				}
			}, delay );
		} );
	}

	/**
	 * @param {object} editor TinyMCE editor instance.
	 */
	function defocusEditor( editor ) {
		if ( ! editor ) {
			return;
		}

		try {
			if ( editor.iframeElement && document.activeElement === editor.iframeElement ) {
				editor.iframeElement.blur();
			}

			var body = editor.getBody();

			if ( body && typeof body.blur === 'function' ) {
				body.blur();
			}
		} catch ( e ) {
			// Ignore blur errors during layout refresh.
		}
	}

	/**
	 * @return {object}
	 */
	function getEditorSettings() {
		var settings = ( window.asenhaSiteBackup && window.asenhaSiteBackup.archiveNoteEditorSettings ) || {};

		settings = $.extend( true, {}, settings );

		if ( settings.tinymce === true ) {
			settings.tinymce = {};
		}

		if ( typeof settings.tinymce === 'object' ) {
			settings.tinymce = $.extend( {}, settings.tinymce );

			if ( ! settings.tinymce.content_css && window.asenhaSiteBackup && window.asenhaSiteBackup.archiveNoteEditorContentCss ) {
				settings.tinymce.content_css = window.asenhaSiteBackup.archiveNoteEditorContentCss;
			}
		}

		return settings;
	}

	/**
	 * @return {string}
	 */
	function generateEditorId() {
		pendingCount += 1;
		return 'asenha_archive_note_' + pendingCount + '_' + Date.now();
	}

	/**
	 * @param {jQuery} $textarea
	 * @return {number}
	 */
	function getTargetEditorHeight( $textarea ) {
		var rows = parseInt( $textarea.attr( 'rows' ) || '4', 10 );

		if ( isNaN( rows ) || rows < 1 ) {
			rows = 4;
		}

		return Math.max( defaultEditorHeight, rows * 20 );
	}

	/**
	 * @param {object} editor TinyMCE editor instance.
	 * @return {number}
	 */
	function getEditorIframeHeight( editor ) {
		if ( ! editor ) {
			return 0;
		}

		var iframe = editor.iframeElement;

		if ( iframe ) {
			return parseInt( iframe.style.height || iframe.clientHeight || '0', 10 ) || 0;
		}

		return 0;
	}

	/**
	 * @param {object} editor TinyMCE editor instance.
	 * @param {number} height Target iframe height in pixels.
	 */
	function setEditorHeight( editor, height ) {
		if ( ! editor || ! height ) {
			return;
		}

		if ( editor.theme && typeof editor.theme.resizeTo === 'function' ) {
			editor.theme.resizeTo( null, height );
			return;
		}

		var iframe = editor.iframeElement;

		if ( iframe ) {
			iframe.style.height = height + 'px';
		}
	}

	/**
	 * @param {object} editor TinyMCE editor instance.
	 * @return {boolean}
	 */
	function isEditorReadyForResize( editor ) {
		if ( ! editor || ! editor.initialized ) {
			return false;
		}

		try {
			if ( ! editor.getBody() ) {
				return false;
			}

			return !!( editor.selection && typeof editor.selection.getRng === 'function' );
		} catch ( e ) {
			return false;
		}
	}

	/**
	 * @param {object} editor TinyMCE editor instance.
	 * @param {jQuery} $textarea
	 * @param {object} options
	 */
	function runEditorResize( editor, $textarea, options ) {
		options = options || {};

		if ( ! editor ) {
			return;
		}

		editor.show();

		if ( editor.getContainer() ) {
			editor.getContainer().style.visibility = 'visible';
		}

		if ( ! options.preventFocus && ! editor.isHidden() && isEditorReadyForResize( editor ) ) {
			try {
				editor.execCommand( 'mceAutoResize' );
			} catch ( e ) {
				// mceAutoResize can throw when the selection range is unavailable.
			}
		}

		if ( getEditorIframeHeight( editor ) < minEditorHeight && $textarea && $textarea.length ) {
			setEditorHeight( editor, getTargetEditorHeight( $textarea ) );
		}

		if ( options.preventFocus ) {
			defocusEditor( editor );
		}
	}

	/**
	 * Run resize passes immediately and on short delays after layout paint.
	 *
	 * @param {string} id Editor textarea ID.
	 * @param {jQuery} $textarea
	 * @param {object} options
	 */
	function scheduleEditorResizePasses( id, $textarea, options ) {
		var delays = [ 0, 50, 200 ];

		delays.forEach( function( delay ) {
			setTimeout( function() {
				var editor = window.tinymce.get( id );

				if ( editor ) {
					runEditorResize( editor, $textarea, options );
				}
			}, delay );
		} );
	}

	/**
	 * @param {jQuery} $textarea
	 * @param {object} options
	 */
	function refreshEditorLayout( $textarea, options ) {
		options = options || {};
		var id = $textarea.attr( 'id' );

		if ( ! id || typeof window.tinymce === 'undefined' ) {
			return;
		}

		function startResizePasses() {
			var editor = window.tinymce.get( id );

			if ( ! editor ) {
				return;
			}

			if ( ! editor.initialized ) {
				if ( editor._asenhaResizeInitScheduled ) {
					return;
				}

				editor._asenhaResizeInitScheduled = true;

				editor.on( 'init', function onEditorInit() {
					editor.off( 'init', onEditorInit );
					editor._asenhaResizeInitScheduled = false;
					scheduleEditorResizePasses( id, $textarea, options );
				} );

				return;
			}

			scheduleEditorResizePasses( id, $textarea, options );
		}

		var editor = window.tinymce.get( id );

		if ( ! editor ) {
			setTimeout( startResizePasses, 0 );
			return;
		}

		startResizePasses();
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
	 * @param {object} options
	 */
	function initializeEditor( id, options ) {
		options = options || {};

		if ( ! id || typeof window.wp === 'undefined' || ! window.wp.editor || ! window.wp.editor.initialize ) {
			return;
		}

		if ( $( '#wp-' + id + '-wrap' ).length ) {
			return;
		}

		if ( options.preventFocus ) {
			suppressEditorAutoFocus = true;
		}

		window.wp.editor.initialize( id, getEditorSettings() );

		if ( options.preventFocus ) {
			setTimeout( function() {
				suppressEditorAutoFocus = false;
			}, 0 );
		}
	}

	/**
	 * @param {string} id
	 * @param {object} options
	 */
	function reinitializeEditor( id, options ) {
		var $textarea = $( '#' + id );

		removeEditor( id );
		initializeEditor( id, options );
		refreshEditorLayout( $textarea, options );
	}

	/**
	 * Initialize pending archive note editors inside a context element.
	 *
	 * @param {jQuery} $context
	 * @param {object} options
	 */
	function initPendingEditors( $context, options ) {
		options = options || {};

		if ( typeof window.wp === 'undefined' || ! window.wp.editor || ! window.wp.editor.initialize ) {
			return;
		}

		$context = $context || $( document );

		$context.find( '.asenha-archive-note-editor-pending textarea.asenha-archive-note-textarea' ).each( function() {
			var $textarea = $( this );
			var $pending  = $textarea.closest( '.asenha-archive-note-editor-pending' );
			var id        = $textarea.attr( 'id' );

			if ( id && $( '#wp-' + id + '-wrap' ).length ) {
				$pending.removeClass( 'asenha-archive-note-editor-pending' ).addClass( 'asenha-archive-note-editor-initialized' );
				refreshEditorLayout( $textarea, options );
				return;
			}

			if ( ! id ) {
				id = generateEditorId();
				$textarea.attr( 'id', id );
			}

			initializeEditor( id, options );
			$pending.removeClass( 'asenha-archive-note-editor-pending' ).addClass( 'asenha-archive-note-editor-initialized' );
			refreshEditorLayout( $textarea, options );
		} );
	}

	/**
	 * Refresh editors inside a context (e.g. after a hidden panel is shown).
	 *
	 * @param {jQuery} $context
	 * @param {object} options
	 */
	function refreshEditorsInContext( $context, options ) {
		options = options || {};
		var focusTarget = null;
		var scrollY     = null;

		if ( options.preventFocus ) {
			focusTarget = options.focusReturnTarget || captureFocusTarget();
			scrollY     = window.scrollY;
		}

		initPendingEditors( $context, options );

		$context.find( '.wp-editor-area' ).each( function() {
			var $textarea = $( this );
			var id        = $textarea.attr( 'id' );

			refreshEditorLayout( $textarea, options );

			setTimeout( function() {
				var editor = id && window.tinymce ? window.tinymce.get( id ) : null;

				if ( editor && getEditorIframeHeight( editor ) < minEditorHeight ) {
					reinitializeEditor( id, options );
				}
			}, 250 );
		} );

		if ( options.preventFocus ) {
			scheduleFocusRestore( focusTarget, scrollY );
		}
	}

	/**
	 * Remove archive note editors inside a context element.
	 *
	 * @param {jQuery} $context
	 */
	function removeEditorsInContext( $context ) {
		$context.find( '.asenha-archive-note-textarea' ).each( function() {
			var id = $( this ).attr( 'id' );

			if ( id ) {
				removeEditor( id );
			}
		} );

		$context.find( '.asenha-archive-note-editor-initialized' ).each( function() {
			$( this ).removeClass( 'asenha-archive-note-editor-initialized' ).addClass( 'asenha-archive-note-editor-pending' );
		} );
	}

	/**
	 * Read note content from a textarea (TinyMCE or plain).
	 *
	 * @param {jQuery} $textarea
	 * @return {string}
	 */
	function readEditorContent( $textarea ) {
		if ( ! $textarea || ! $textarea.length ) {
			return '';
		}

		var id = $textarea.attr( 'id' );
		if ( id && window.tinymce ) {
			var editor = window.tinymce.get( id );
			if ( editor && ! editor.isHidden() ) {
				return String( editor.getContent() || '' );
			}
			if ( editor ) {
				editor.save();
			}
		}

		return String( $textarea.val() || '' );
	}

	/**
	 * @param {object} init TinyMCE init object.
	 * @return {boolean}
	 */
	function isArchiveNoteTinyMceInit( init ) {
		var id       = String( init.id || '' );
		var selector = String( init.selector || '' );

		if ( isArchiveNoteEditorId( id ) ) {
			return true;
		}

		return selector.indexOf( 'asenha-archive-note-textarea' ) !== -1 || selector.indexOf( 'asenha-backup-note' ) !== -1;
	}

	$( document ).on( 'wp-before-tinymce-init', function( event, init ) {
		if ( ! window.asenhaSiteBackup || ! window.asenhaSiteBackup.archiveNoteEditorContentCss ) {
			return;
		}

		if ( ! init.content_css && window.asenhaSiteBackup.archiveNoteEditorContentCss ) {
			init.content_css = window.asenhaSiteBackup.archiveNoteEditorContentCss;
		}

		init.convert_urls = false;

		if ( suppressEditorAutoFocus && isArchiveNoteTinyMceInit( init ) ) {
			init.auto_focus = false;
		}
	} );

	window.AsenhaSiteBackupArchiveNotes = {
		initPendingEditors: initPendingEditors,
		refreshEditorsInContext: refreshEditorsInContext,
		removeEditorsInContext: removeEditorsInContext,
		readEditorContent: readEditorContent,
		removeEditor: removeEditor
	};
}( jQuery ) );
