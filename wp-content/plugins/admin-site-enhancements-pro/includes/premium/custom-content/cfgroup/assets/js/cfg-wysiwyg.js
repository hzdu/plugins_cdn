/**
 * CFG WYSIWYG field: deferred editor init, repeater/tab/sort support.
 */
( function( $ ) {
	'use strict';

	var pendingCount = 0;
	var minEditorHeight = 40;
	var defaultEditorHeight = 200;

	/**
	 * Remove a TinyMCE plugin/button token from a comma-separated list.
	 *
	 * @param {string} list Comma-separated plugins or toolbar buttons.
	 * @param {string} token Token to remove.
	 * @return {string}
	 */
	function removeTinymceListToken( list, token ) {
		var parts;
		var i;
		var part;
		var filtered = [];

		parts = String( list || '' ).split( ',' );

		for ( i = 0; i < parts.length; i++ ) {
			part = $.trim( parts[ i ] );

			if ( part && part !== token ) {
				filtered.push( part );
			}
		}

		return filtered.join( ',' );
	}

	/**
	 * @param {jQuery|HTMLElement|string|null} [textareaOrId] Optional textarea or editor id for per-field overrides.
	 * @return {object}
	 */
	function getEditorSettings( textareaOrId ) {
		var settings = ( window.cfgWysiwygL10n && window.cfgWysiwygL10n.editorSettings ) || {};
		var $textarea;
		var $tabsSource;
		var editorTabs;

		settings = $.extend( true, {}, settings );

		if ( settings.tinymce === true ) {
			settings.tinymce = {};
		}

		if ( typeof settings.tinymce === 'object' ) {
			settings.tinymce = $.extend( {}, settings.tinymce );

			if ( ! settings.tinymce.content_css && window.cfgWysiwygL10n.contentCss ) {
				settings.tinymce.content_css = window.cfgWysiwygL10n.contentCss;
			}
		}

		// wp.editor.initialize() only renders Add Media when mediaButtons is truthy.
		if ( typeof settings.mediaButtons === 'undefined' ) {
			settings.mediaButtons = true;
		}

		if ( textareaOrId ) {
			$textarea = ( typeof textareaOrId === 'string' ) ? $( '#' + textareaOrId ) : $( textareaOrId );

			if ( $textarea.length && $textarea.closest( '[data-hide-media-button="1"]' ).length ) {
				settings.mediaButtons = false;
			} else if ( $textarea.length && $textarea.closest( '[data-media-buttons="1"]' ).length ) {
				settings.mediaButtons = true;
			}

			if ( $textarea.length && typeof settings.tinymce === 'object' ) {
				var $toolbarSource = $textarea.closest( '[data-toolbar-buttons]' );

				if ( ! $toolbarSource.length && $textarea.is( '[data-toolbar-buttons]' ) ) {
					$toolbarSource = $textarea;
				}

				if ( $toolbarSource.length ) {
					settings.tinymce.toolbar1 = $toolbarSource.attr( 'data-toolbar-buttons' ) || '';
				}
			}

			if ( $textarea.length ) {
				$tabsSource = $textarea.closest( '[data-editor-tabs]' );

				if ( ! $tabsSource.length && $textarea.is( '[data-editor-tabs]' ) ) {
					$tabsSource = $textarea;
				}

				if ( $tabsSource.length ) {
					editorTabs = $tabsSource.attr( 'data-editor-tabs' ) || 'both';

					if ( 'visual' === editorTabs ) {
						settings.quicktags = false;
					} else if ( 'code' === editorTabs ) {
						settings.tinymce = false;
						settings.quicktags = true;
					}
				}
			}
		}

		// TinyMCE fullscreen is unreliable inside Gutenberg meta boxes — omit it there.
		if ( document.body.classList.contains( 'block-editor-page' ) && typeof settings.tinymce === 'object' && settings.tinymce ) {
			if ( settings.tinymce.plugins ) {
				settings.tinymce.plugins = removeTinymceListToken( settings.tinymce.plugins, 'fullscreen' );
			}

			if ( settings.tinymce.toolbar1 ) {
				settings.tinymce.toolbar1 = removeTinymceListToken( settings.tinymce.toolbar1, 'fullscreen' );
			}
		}

		return settings;
	}

	/**
	 * Whether the editor is Code-only (no TinyMCE).
	 *
	 * @param {jQuery|HTMLElement|string} elOrId Textarea, wrapper, or editor id.
	 * @return {boolean}
	 */
	function isCodeOnlyEditor( elOrId ) {
		var $el;

		if ( ! elOrId ) {
			return false;
		}

		if ( typeof elOrId === 'string' ) {
			$el = $( '#' + elOrId );

			if ( ! $el.length ) {
				$el = $( '#wp-' + elOrId + '-wrap' );
			}
		} else {
			$el = $( elOrId );
		}

		if ( ! $el.length ) {
			return false;
		}

		return $el.closest( '[data-editor-tabs="code"]' ).length > 0 || $el.is( '[data-editor-tabs="code"]' );
	}

	/**
	 * @return {string}
	 */
	function generateEditorId() {
		pendingCount += 1;
		return 'cfgwysi_dyn_' + pendingCount + '_' + Date.now();
	}

	/**
	 * @param {object} options
	 * @return {object}
	 */
	function getRecoveryOptions( options ) {
		return $.extend(
			{
				preserveFocus: false,
				skipEditorShow: false,
				focusState: null,
			},
			options || {}
		);
	}

	/**
	 * @param {HTMLElement} element
	 * @return {boolean}
	 */
	function canRestoreSelection( element ) {
		return !! element && 'number' === typeof element.selectionStart && 'number' === typeof element.selectionEnd;
	}

	/**
	 * @param {jQuery} $active
	 * @param {jQuery} $context
	 * @return {boolean}
	 */
	function isFocusElementRelevantToContext( $active, $context ) {
		var activeScope;
		var $contextScope;

		if ( ! $context || ! $context.length ) {
			return true;
		}

		activeScope  = $active.closest( '.repeater_wrapper, .cfgroup_input' )[0] || $active[0];
		$contextScope = $context.first().closest( '.repeater_wrapper, .cfgroup_input' );

		if ( ! $contextScope.length ) {
			$contextScope = $context.first();
		}

		return $contextScope.is( activeScope ) || !! $contextScope.find( activeScope ).length || $.contains( activeScope, $contextScope[0] );
	}

	/**
	 * @param {jQuery} $context
	 * @return {object|null}
	 */
	function captureActiveFocusState( $context ) {
		var active = document.activeElement;
		var $active;

		if ( ! active || active === document.body || ! active.isConnected ) {
			return null;
		}

		$active = $( active );

		if ( ! $active.closest( '.cfgroup_input' ).length || $active.closest( '.cfgroup_wysiwyg' ).length ) {
			return null;
		}

		if ( ! isFocusElementRelevantToContext( $active, $context ) ) {
			return null;
		}

		return {
			element: active,
			scope: $active.closest( '.repeater_wrapper, .cfgroup_input' )[0] || null,
			selectionStart: canRestoreSelection( active ) ? active.selectionStart : null,
			selectionEnd: canRestoreSelection( active ) ? active.selectionEnd : null,
			selectionDirection: canRestoreSelection( active ) ? active.selectionDirection : null,
		};
	}

	/**
	 * @param {object} focusState
	 */
	function restoreFocusState( focusState ) {
		var element = focusState && focusState.element;

		if ( ! element || ! element.isConnected || document.activeElement === element ) {
			return;
		}

		try {
			element.focus( { preventScroll: true } );
		} catch ( e ) {
			try {
				element.focus();
			} catch ( focusError ) {
				return;
			}
		}

		if ( canRestoreSelection( element ) && null !== focusState.selectionStart && null !== focusState.selectionEnd ) {
			try {
				element.setSelectionRange( focusState.selectionStart, focusState.selectionEnd, focusState.selectionDirection || 'none' );
			} catch ( selectionError ) {
				// Some input types do not support setSelectionRange().
			}
		}
	}

	/**
	 * @param {object} focusState
	 * @param {jQuery} $context
	 */
	function scheduleFocusRestore( focusState, $context ) {
		var delays = [ 0, 50, 200, 400 ];

		if ( ! focusState || ! focusState.element ) {
			return;
		}

		delays.forEach( function( delay ) {
			setTimeout( function() {
				var scope = focusState.scope;
				var contextMatches = true;

				if ( scope && $context && $context.length ) {
					contextMatches = false;

					$context.each( function() {
						if ( this === scope || $.contains( this, scope ) || $.contains( scope, this ) ) {
							contextMatches = true;
							return false;
						}
					} );
				}

				if ( contextMatches ) {
					restoreFocusState( focusState );
				}
			}, delay );
		} );
	}

	/**
	 * @param {jQuery} $textarea
	 * @return {number}
	 */
	function getTargetEditorHeight( $textarea ) {
		var rows = parseInt( $textarea.attr( 'rows' ) || '8', 10 );

		if ( isNaN( rows ) || rows < 1 ) {
			rows = 8;
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
	 * @param {string} id
	 * @return {boolean}
	 */
	function isEditorHtmlMode( id ) {
		var $wrap = getEditorWrap( id );

		return $wrap.length && $wrap.hasClass( 'html-active' );
	}

	/**
	 * @param {object} editor TinyMCE editor instance.
	 * @param {jQuery} $textarea
	 */
	function runEditorResize( editor, $textarea, options ) {
		var id = editor && editor.id ? editor.id : '';
		var recoveryOptions = getRecoveryOptions( options );

		if ( ! editor ) {
			return;
		}

		// Do not force TinyMCE visible while WordPress still marks the editor as Code/html mode.
		if ( isEditorHtmlMode( id ) ) {
			return;
		}

		if ( recoveryOptions.skipEditorShow && editor.isHidden() ) {
			return;
		}

		if ( editor.isHidden() ) {
			editor.show();
		}

		if ( editor.getContainer() ) {
			editor.getContainer().style.visibility = 'visible';
		}

		if ( ! editor.isHidden() && isEditorReadyForResize( editor ) ) {
			try {
				// skip_focus is required: TinyMCE 4 execCommand() otherwise calls
				// editor.focus() first, stealing focus from the input the user is
				// typing in (e.g. the Text field that triggered conditional logic).
				editor.execCommand( 'mceAutoResize', false, null, { skip_focus: true } );
			} catch ( e ) {
				// mceAutoResize can throw when the selection range is unavailable.
			}
		}

		if ( getEditorIframeHeight( editor ) < minEditorHeight && $textarea && $textarea.length ) {
			setEditorHeight( editor, getTargetEditorHeight( $textarea ) );
		}
	}

	/**
	 * Run resize passes immediately and on short delays after layout paint.
	 *
	 * @param {string} id Editor textarea ID.
	 * @param {jQuery} $textarea
	 */
	function scheduleEditorResizePasses( id, $textarea, options ) {
		var delays = [ 0, 50, 200 ];
		var recoveryOptions = getRecoveryOptions( options );

		delays.forEach( function( delay ) {
			setTimeout( function() {
				var editor = window.tinymce.get( id );

				if ( editor ) {
					runEditorResize( editor, $textarea, recoveryOptions );
				}
			}, delay );
		} );
	}

	/**
	 * @param {jQuery} $textarea
	 */
	function refreshEditorLayout( $textarea, options ) {
		var id = $textarea.attr( 'id' );
		var recoveryOptions = getRecoveryOptions( options );

		if ( ! id || typeof window.tinymce === 'undefined' ) {
			return;
		}

		// Code-only editors have no TinyMCE instance to resize.
		if ( isCodeOnlyEditor( $textarea ) ) {
			return;
		}

		function startResizePasses() {
			var editor = window.tinymce.get( id );

			if ( ! editor ) {
				return;
			}

			if ( ! editor.initialized ) {
				if ( editor._cfgWysiwygResizeInitScheduled ) {
					return;
				}

				editor._cfgWysiwygResizeInitScheduled = true;

				editor.on( 'init', function onEditorInit() {
					editor.off( 'init', onEditorInit );
					editor._cfgWysiwygResizeInitScheduled = false;
					scheduleEditorResizePasses( id, $textarea, recoveryOptions );
				} );

				return;
			}

			scheduleEditorResizePasses( id, $textarea, recoveryOptions );
		}

		var editor = window.tinymce.get( id );

		if ( ! editor ) {
			setTimeout( startResizePasses, 0 );
			return;
		}

		startResizePasses();
	}

	/**
	 * Mark pending wrapper and field container as initialized.
	 *
	 * @param {jQuery} $textarea
	 * @param {jQuery} $pending
	 */
	function markEditorInitialized( $textarea, $pending ) {
		$pending.removeClass( 'cfg-wysiwyg-pending' ).addClass( 'cfg-wysiwyg-initialized' );
		$textarea.closest( '.cfgroup_wysiwyg' ).addClass( 'cfg-wysiwyg-initialized' );
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

		// Note: never move .wp-editor-container (or any ancestor of the TinyMCE iframe)
		// in the DOM after initialization; relocating an iframe reloads its document
		// and detaches TinyMCE from it. Layout differences between the JS-initialized
		// structure and PHP wp_editor() are handled purely in input.css.
		window.wp.editor.initialize( id, getEditorSettings( id ) );
	}

	/**
	 * @param {string} id
	 */
	function reinitializeEditor( id, options ) {
		var $textarea = $( '#' + id );

		if ( ! $textarea.length ) {
			return;
		}

		removeEditor( id );

		// wp.editor.remove() detaches the wrap; initialize builds a fresh one.
		// If a wrap somehow remains (edge case), force TinyMCE remount via remove again then initialize.
		if ( $( '#wp-' + id + '-wrap' ).length ) {
			removeEditor( id );
		}

		initializeEditor( id );
		refreshEditorLayout( $( '#' + id ), options );
	}

	/**
	 * @param {string} id
	 * @return {jQuery}
	 */
	function getEditorWrap( id ) {
		return id ? $( '#wp-' + id + '-wrap' ) : $();
	}

	/**
	 * @param {string} id
	 * @return {object|null}
	 */
	function getTinyMceEditor( id ) {
		if ( ! id || typeof window.tinymce === 'undefined' ) {
			return null;
		}

		return window.tinymce.get( id );
	}

	/**
	 * Whether an editor sits in a container that is not laid out yet.
	 * Covers conditional-logic hides, collapsed repeater rows, and inactive tab panels.
	 *
	 * @param {jQuery} $el Textarea or wrap inside the editor field.
	 * @return {boolean}
	 */
	function isEditorContainerHidden( $el ) {
		if ( $el.closest( '.cfgroup-field-wrap.cfgroup-cl-hidden, .cfgroup-repeater-sub-wrap.cfgroup-cl-hidden' ).length > 0 ) {
			return true;
		}

		if ( $el.closest( '.cfgroup_repeater_body:not(.open)' ).length > 0 ) {
			return true;
		}

		return $el.closest( '.cfgroup-tab-content:not(.active)' ).length > 0;
	}

	/**
	 * Whether the textarea, wrapper, and TinyMCE instance are all ready for use.
	 *
	 * @param {string} id
	 * @return {boolean}
	 */
	function isEditorHealthy( id ) {
		var $textarea = $( '#' + id );
		var $wrap     = getEditorWrap( id );
		var editor    = getTinyMceEditor( id );
		var iframeHeight;
		var wrapIsHtmlMode;
		var wrapIsVisualMode;
		var editorIsHidden;

		if ( ! id || ! $textarea.length || ! $wrap.length ) {
			return false;
		}

		// Code-only: Quicktags/textarea only — no TinyMCE to validate.
		if ( isCodeOnlyEditor( $textarea ) ) {
			return true;
		}

		if ( ! editor || ! editor.initialized ) {
			return false;
		}

		try {
			if ( ! editor.getBody() ) {
				return false;
			}

			// Stale iframe document: if the iframe was moved in the DOM after init,
			// its document reloads and TinyMCE keeps references to the old, discarded
			// document. Such an editor looks fine (getBody() exists in the detached
			// document) but is non-editable and its selection API is broken.
			if ( editor.iframeElement && editor.getDoc() !== editor.iframeElement.contentDocument ) {
				return false;
			}

			wrapIsHtmlMode   = $wrap.hasClass( 'html-active' );
			wrapIsVisualMode = $wrap.hasClass( 'tmce-active' );
			editorIsHidden   = editor.isHidden();

			if ( wrapIsHtmlMode && ! editorIsHidden ) {
				return false;
			}

			if ( wrapIsVisualMode && editorIsHidden ) {
				return false;
			}

			if ( wrapIsVisualMode && ! isEditorContainerHidden( $textarea ) ) {
				// A visible editor whose window has no Selection object holds a stale,
				// discarded document; core switchEditor() would crash in
				// focusHTMLBookmarkInVisualEditor() (setBaseAndExtent on null).
				if ( editor.getWin() && null === editor.getWin().getSelection() ) {
					return false;
				}

				iframeHeight = getEditorIframeHeight( editor );

				if ( iframeHeight < minEditorHeight ) {
					return false;
				}
			}

			return true;
		} catch ( e ) {
			return false;
		}
	}

	/**
	 * Ensure a non-pending textarea has a healthy editor once visible.
	 *
	 * @param {jQuery} $textarea
	 */
	function ensureVisibleEditorReady( $textarea, options ) {
		var id      = $textarea.attr( 'id' );
		var $wrap   = getEditorWrap( id );
		var editor  = getTinyMceEditor( id );
		var recoveryOptions = getRecoveryOptions( options );

		if ( ! id || isEditorContainerHidden( $textarea ) ) {
			return;
		}

		// Code-only with an existing wrap: no TinyMCE recovery needed.
		if ( isCodeOnlyEditor( $textarea ) && $wrap.length ) {
			return;
		}

		if ( $wrap.length ) {
			if ( ! isEditorHealthy( id ) ) {
				reinitializeEditor( id, recoveryOptions );
			} else {
				refreshEditorLayout( $textarea, recoveryOptions );
			}

			return;
		}

		if ( editor ) {
			reinitializeEditor( id, recoveryOptions );
			return;
		}

		initializeEditor( id );
		refreshEditorLayout( $( '#' + id ), recoveryOptions );
	}

	/**
	 * Initialize pending textareas inside a context element.
	 *
	 * @param {jQuery} $context
	 */
	function initPendingEditors( $context, options ) {
		var recoveryOptions = getRecoveryOptions( options );

		if ( typeof window.wp === 'undefined' || ! window.wp.editor || ! window.wp.editor.initialize ) {
			return;
		}

		$context = $context || $( document );

		$context.find( '.cfg-wysiwyg-pending textarea.wysiwyg' ).each( function() {
			var $textarea = $( this );
			var $pending  = $textarea.closest( '.cfg-wysiwyg-pending' );
			var id        = $textarea.attr( 'id' );

			// Never auto-init the hidden Quick Edit template (#inline-edit). Cloning an
			// already-initialized TinyMCE leaves an empty orphan editor in the live QE row.
			// Live #edit-{id} rows are inited explicitly via refreshWysiwygInContext.
			// #bulk-edit is the live Bulk Edit form; allow init when forceBulkEdit is set.
			if ( $textarea.closest( '#inline-edit' ).length ) {
				return;
			}
			if ( $textarea.closest( '#bulk-edit' ).length && ! recoveryOptions.forceBulkEdit ) {
				return;
			}

			// Avoid initializing TinyMCE while the editor is still inside a hidden container.
			if ( isEditorContainerHidden( $textarea ) ) {
				return;
			}

			if ( ! id ) {
				id = generateEditorId();
				$textarea.attr( 'id', id );
			}

			if ( getEditorWrap( id ).length ) {
				ensureVisibleEditorReady( $textarea, recoveryOptions );
				markEditorInitialized( $textarea, $pending );
				refreshEditorLayout( $( '#' + id ), recoveryOptions );
				return;
			}

			initializeEditor( id );
			markEditorInitialized( $textarea, $pending );
			refreshEditorLayout( $( '#' + id ), recoveryOptions );
		} );
	}

	/**
	 * Refresh editors inside a context (e.g. after layout tab is shown).
	 *
	 * @param {jQuery} $context
	 */
	function refreshEditorsInContext( $context, options ) {
		var recoveryOptions = getRecoveryOptions( options );

		initPendingEditors( $context, recoveryOptions );
		$context.find( '.wp-editor-area' ).each( function() {
			refreshEditorLayout( $( this ), recoveryOptions );
		} );
	}

	/**
	 * Re-initialize WYSIWYG editors after they become visible (CL show or repeater expand).
	 * TinyMCE created under display:none needs a full remove + initialize, not layout-only refresh.
	 *
	 * @param {jQuery} $context Newly shown field wraps or an expanded repeater body.
	 */
	function refreshEditorsAfterConditionalShow( $context, options ) {
		var recoveryOptions;

		if ( ! $context || ! $context.length ) {
			return;
		}

		recoveryOptions = getRecoveryOptions( options );

		if ( recoveryOptions.preserveFocus && ! recoveryOptions.focusState ) {
			recoveryOptions.focusState = captureActiveFocusState( $context );
		}

		$context.find( '.wp-editor-area' ).addBack( '.wp-editor-area' ).each( function() {
			var $textarea = $( this );

			if ( $textarea.closest( '.cfg-wysiwyg-pending' ).length ) {
				return;
			}

			ensureVisibleEditorReady( $textarea, recoveryOptions );
		} );

		initPendingEditors( $context, recoveryOptions );

		if ( recoveryOptions.preserveFocus ) {
			scheduleFocusRestore( recoveryOptions.focusState, $context );
		}
	}

	/**
	 * Copy Visual-mode TinyMCE content into CFG textareas before form serialize/submit.
	 */
	function syncAllCfgWysiwygEditors() {
		$( '.cfgroup_wysiwyg .wp-editor-area, .cfg-wysiwyg-pending textarea.wysiwyg' ).each( function() {
			var id = $( this ).attr( 'id' );

			if ( ! id ) {
				return;
			}

			if ( window.wp && window.wp.editor && window.wp.editor.save ) {
				window.wp.editor.save( id );
			}
		} );

		if ( window.tinymce ) {
			window.tinymce.triggerSave();
		}
	}

	/**
	 * @param {object} settings jQuery ajaxSend settings.
	 * @return {boolean}
	 */
	function isAddTagAjax( settings ) {
		if ( ! settings || ! settings.data ) {
			return false;
		}

		var data = settings.data;

		if ( typeof data === 'string' ) {
			return data.indexOf( 'action=add-tag' ) !== -1;
		}

		if ( typeof data === 'object' && data.action === 'add-tag' ) {
			return true;
		}

		return false;
	}

	/**
	 * Whether an editor belongs to a CFG WYSIWYG field.
	 *
	 * @param {object} editor TinyMCE editor instance.
	 * @return {boolean}
	 */
	function isCfgWysiwygEditor( editor ) {
		if ( ! editor || ! editor.id ) {
			return false;
		}

		return $( '#' + editor.id ).closest( '.cfgroup_wysiwyg' ).length > 0;
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
	 * Position a CFG fullscreen editor inside the admin content area.
	 *
	 * @param {object} editor TinyMCE editor instance.
	 */
	function layoutCfgFullscreenEditor( editor ) {
		var container;
		var iframe;
		var contentArea;
		var offsets;
		var toolbarHeight;

		if ( ! isCfgWysiwygEditor( editor ) || ! isCfgFullscreenActive( editor ) ) {
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
		var $textarea;

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

		if ( editor.id ) {
			$textarea = $( '#' + editor.id );

			if ( $textarea.length ) {
				scheduleEditorResizePasses( editor.id, $textarea );
			}
		}
	}

	/**
	 * Re-layout every CFG editor that is currently fullscreen.
	 */
	function layoutAllCfgFullscreenEditors() {
		var editors;
		var i;

		if ( typeof window.tinymce === 'undefined' || ! window.tinymce.editors ) {
			return;
		}

		editors = window.tinymce.editors;

		for ( i = 0; i < editors.length; i++ ) {
			if ( isCfgWysiwygEditor( editors[ i ] ) && isCfgFullscreenActive( editors[ i ] ) ) {
				layoutCfgFullscreenEditor( editors[ i ] );
			}
		}
	}

	/**
	 * Bind fullscreen chrome offset handling for one CFG editor.
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
		if ( ! window.cfgWysiwygL10n ) {
			return;
		}

		if ( ! init.content_css && window.cfgWysiwygL10n.contentCss ) {
			init.content_css = window.cfgWysiwygL10n.contentCss;
		}

		init.convert_urls = false;

		// Catch PHP wp_editor() inits in the block editor (getEditorSettings only covers deferred JS).
		if ( document.body.classList.contains( 'block-editor-page' ) && init ) {
			if ( init.plugins ) {
				init.plugins = removeTinymceListToken( init.plugins, 'fullscreen' );
			}

			if ( init.toolbar1 ) {
				init.toolbar1 = removeTinymceListToken( init.toolbar1, 'fullscreen' );
			}
		}
	} );

	$( document ).on( 'tinymce-editor-init', function( event, editor ) {
		if ( ! editor || ! editor.id ) {
			return;
		}

		var $textarea = $( '#' + editor.id );

		if ( ! $textarea.length || ! $textarea.closest( '.cfgroup_wysiwyg' ).length ) {
			return;
		}

		bindCfgFullscreenChrome( editor );
		scheduleEditorResizePasses( editor.id, $textarea );
	} );

	$( document ).on( 'cfgroup/cl_fields_shown', function( event, $newlyShown ) {
		if ( $newlyShown && $newlyShown.length ) {
			refreshEditorsAfterConditionalShow(
				$newlyShown,
				{
					preserveFocus: true,
					skipEditorShow: true,
				}
			);
		}
	} );

	// Available as soon as this script loads (before document ready).
	window.CFG = window.CFG || {};
	window.CFG.refreshWysiwygInContext = function( $context, options ) {
		return refreshEditorsAfterConditionalShow(
			$context,
			options || {
				preserveFocus: true,
				skipEditorShow: true,
			}
		);
	};

	$( function() {
		initPendingEditors( $( document ) );

		$( document ).on( 'cfgroup/ready', '.cfgroup_add_field', function() {
			var $repeater = $( this ).closest( '.cfgroup_repeater' );
			var $row      = $repeater.find( '.repeater_wrapper_new' ).last();
			var recoveryOptions;

			if ( ! $row.length ) {
				$row = $( this ).closest( '.table_footer' ).prev( '.repeater_wrapper' );
			}

			var $targetRow = $row.length ? $row : $repeater;
			recoveryOptions = {
				preserveFocus: true,
				skipEditorShow: true,
			};

			// Run conditional logic before first clone-row WYSIWYG init, so hidden sub-fields stay pending.
			if ( window.CFG && 'function' === typeof window.CFG.runCfgroupConditionalLogic ) {
				window.CFG.runCfgroupConditionalLogic();
			}

			window.requestAnimationFrame( function() {
				refreshEditorsAfterConditionalShow( $targetRow, recoveryOptions );
				$repeater.find( '.repeater_wrapper_new' ).removeClass( 'repeater_wrapper_new' );
			} );
		} );

		$( document ).on( 'cfgroup/tab_shown', function( event, $tabContent ) {
			if ( $tabContent && $tabContent.length ) {
				refreshEditorsAfterConditionalShow(
					$tabContent,
					{
						preserveFocus: true,
						skipEditorShow: true,
					}
				);
			}
		} );

		$( document ).on( 'click', 'button.add_media', function() {
			var editorId = $( this ).closest( '.wp-editor-wrap' ).find( '.wp-editor-area' ).attr( 'id' );

			if ( editorId ) {
				window.wpActiveEditor = editorId;
			}
		} );

		$( document ).on( 'click', '.cfgroup_repeater_head', function() {
			var $body = $( this ).siblings( '.cfgroup_repeater_body' );

			// Defer until after repeater.php toggles .open on the same click.
			window.setTimeout( function() {
				if ( $body.hasClass( 'open' ) ) {
					refreshEditorsAfterConditionalShow(
						$body,
						{
							preserveFocus: true,
							skipEditorShow: true,
						}
					);
				}
			}, 0 );
		} );

		$( document ).on( 'click', '.cfgroup_repeater_toggle', function() {
			var $field = $( this ).closest( '.field' );

			// Repeater.php toggles all row bodies on the same click.
			window.setTimeout( function() {
				$field.find( '.cfgroup_repeater_body.open' ).each( function() {
					refreshEditorsAfterConditionalShow(
						$( this ),
						{
							preserveFocus: true,
							skipEditorShow: true,
						}
					);
				} );
			}, 0 );
		} );

		$( '.meta-box-sortables, .cfgroup_repeater' ).on( 'sortstart', function( event, ui ) {
			var $items = ui.item ? ui.item.find( '.wp-editor-area' ) : $( this ).find( '.wp-editor-area' );

			$items.each( function() {
				var id = $( this ).attr( 'id' );

				if ( id ) {
					removeEditor( id );
				}
			} );
		} );

		$( '.meta-box-sortables, .cfgroup_repeater' ).on( 'sortstop', function( event, ui ) {
			var $items = ui.item ? ui.item.find( '.wp-editor-area' ) : $( this ).find( '.wp-editor-area' );

			$items.each( function() {
				var id = $( this ).attr( 'id' );

				if ( id && $( '#wp-' + id + '-wrap' ).length ) {
					reinitializeEditor( id );
				}
			} );
		} );

		$( document ).on( 'click', '.cfgroup_delete_field', function() {
			$( this ).closest( '.repeater_wrapper' ).find( '.wp-editor-area' ).each( function() {
				var id = $( this ).attr( 'id' );

				if ( id ) {
					removeEditor( id );
				}
			} );
		} );

		// Taxonomy add: core tags.js serializes #addtag on #submit click without triggerSave.
		$( document ).on( 'mousedown', '#addtag #submit', function() {
			syncAllCfgWysiwygEditors();
		} );

		$( document ).on( 'ajaxSend', function( event, jqXHR, settings ) {
			if ( isAddTagAjax( settings ) ) {
				syncAllCfgWysiwygEditors();
			}
		} );

		// Taxonomy edit: edit-tags.php inline form and term.php both use #edittag.
		$( document ).on( 'submit', '#edittag', function() {
			syncAllCfgWysiwygEditors();
		} );

		// Keep CFG fullscreen editors aligned with admin chrome (incl. Wider Admin Menu / fold).
		// Defer so this runs after TinyMCE’s own fullscreen window-resize handler.
		$( window ).on( 'resize', function() {
			window.setTimeout( layoutAllCfgFullscreenEditors, 0 );
		} );

		$( document ).on( 'click', '#collapse-menu, #collapse-button', function() {
			window.setTimeout( layoutAllCfgFullscreenEditors, 0 );
		} );
	} );
}( jQuery ) );
