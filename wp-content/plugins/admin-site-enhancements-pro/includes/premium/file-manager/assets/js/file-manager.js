/**
 * File Manager Admin JavaScript
 *
 * @package ASENHA\FileManager
 */

(function($) {
	'use strict';

	/**
	 * File Manager Object
	 */
	const FileManager = {
		// State
		currentPath: asenhafm.abspath,
		selectedItems: [],
		clipboard: null,
		clipboardAction: null, // 'cut' or 'copy'
		// Context menu target (e.g. right-clicked folder row) used for actions like Paste.
		contextMenuTarget: null, // { type: string, path: string } | null
		sortColumn: 'name',
		sortDirection: 'asc',
		isSyncingTree: false, // Flag to prevent multiple simultaneous tree sync operations
		// Tree loading state (prevents duplicate child nodes from concurrent requests).
		treeLoadInFlight: null, // Set<string> of normalized paths currently loading.
		treeChildrenLoaded: null, // Set<string> of normalized paths we've already loaded (even if empty).
		treeLoadCallbacks: null, // Map<string, Function[]> callbacks to run after a path finishes loading.
		// Navigation history
		navigationHistory: [],
		historyIndex: -1,

		/**
		 * Normalize a filesystem path for comparison.
		 *
		 * @param {string} p Path.
		 * @return {string} Normalized path (forward slashes, no trailing slash).
		 */
		normalizePath(p) {
			if (!p) {
				return '';
			}
			return p.toString().replace(/\\/g, '/').replace(/\/+$/g, '');
		},

		/**
		 * Check whether a path is within a base directory (inclusive).
		 *
		 * @param {string} base Base path.
		 * @param {string} target Target path.
		 * @return {boolean} Whether target is within base.
		 */
		isWithinPath(base, target) {
			if (!base || !target) {
				return false;
			}
			return target === base || target.indexOf(base + '/') === 0;
		},

		/**
		 * Compare two directory tree nodes by name (case-insensitive).
		 *
		 * @param {Object} a Tree node A.
		 * @param {Object} b Tree node B.
		 * @return {number} Sort order.
		 */
		compareTreeNodesByName(a, b) {
			const aName = (a && a.name ? a.name : '').toString().toLowerCase();
			const bName = (b && b.name ? b.name : '').toString().toLowerCase();

			return aName.localeCompare(bName);
		},

		/**
		 * Determine whether write operations should be restricted for a given path.
		 *
		 * Rules:
		 * - DISALLOW_FILE_MODS=true: everything is read-only.
		 * - FM_READ_ONLY=true: (ASE File Manager only) everything is read-only.
		 * - DISALLOW_FILE_EDIT=true: plugins/themes/mu-plugins are read-only.
		 *
		 * @param {string} path Path to evaluate (defaults to currentPath).
		 * @return {boolean} Whether the path should be treated as read-only.
		 */
		isWriteRestrictedPath(path = null) {
			if (typeof asenhafm === 'undefined') {
				return false;
			}

			if (asenhafm.disallowFileMods) {
				return true;
			}

			if (asenhafm.fmReadOnly) {
				return true;
			}

			if (!asenhafm.disallowFileEdit) {
				return false;
			}

			const targetPath = this.normalizePath(path || this.currentPath);
			const pluginsDir = this.normalizePath(asenhafm.pluginsDir);
			const muPluginsDir = this.normalizePath(asenhafm.muPluginsDir);
			const themesDir = this.normalizePath(asenhafm.themesDir);

			return (
				this.isWithinPath(pluginsDir, targetPath) ||
				this.isWithinPath(muPluginsDir, targetPath) ||
				this.isWithinPath(themesDir, targetPath)
			);
		},

		/**
		 * Determine whether write actions should be blocked because the current folder
		 * is a protected WordPress core directory.
		 *
		 * NOTE: This intentionally only treats wp-admin and wp-includes as protected,
		 * and does not rely on the UI "protected" marker (which can also include wp-content).
		 *
		 * @param {string} path Path to evaluate (defaults to currentPath).
		 * @return {boolean} Whether the folder is a protected core directory for write operations.
		 */
		isProtectedCoreWriteFolder(path = null) {
			const targetPath = this.normalizePath(path || this.currentPath);
			if (!targetPath) {
				return false;
			}

			const base = this.normalizePath(asenhafm && asenhafm.abspath ? asenhafm.abspath : '');
			if (!base) {
				return false;
			}

			const wpAdminDir = this.normalizePath(base + '/wp-admin');
			const wpIncludesDir = this.normalizePath(base + '/wp-includes');

			return this.isWithinPath(wpAdminDir, targetPath) || this.isWithinPath(wpIncludesDir, targetPath);
		},

		/**
		 * Get the appropriate read-only message for the current path.
		 *
		 * @param {string} path Path.
		 * @return {string} Message.
		 */
		getWriteRestrictionMessage(path) {
			if (asenhafm.disallowFileMods) {
				return asenhafm.i18n?.disallowFileModsNote || asenhafm.i18n?.error || 'Read-only mode.';
			}

			if (asenhafm.fmReadOnly) {
				return asenhafm.i18n?.fmReadOnlyNote || asenhafm.i18n?.error || 'Read-only mode.';
			}

			if (asenhafm.disallowFileEdit && this.isWriteRestrictedPath(path)) {
				return asenhafm.i18n?.disallowFileEditNote || asenhafm.i18n?.error || 'Read-only mode.';
			}

			return asenhafm.i18n?.error || 'Read-only mode.';
		},

		/**
		 * Extract a useful error message from a jQuery AJAX / REST failure.
		 *
		 * Prefers WP REST JSON message/code, then parser/invalid-response hints,
		 * then HTTP status, then the generic i18n fallback.
		 *
		 * @param {jqXHR} xhr jQuery XHR object.
		 * @param {string} [textStatus] jQuery textStatus (e.g. 'parsererror', 'error').
		 * @return {string} User-facing error message.
		 */
		getAjaxErrorMessage(xhr, textStatus) {
			const i18n = (typeof asenhafm !== 'undefined' && asenhafm.i18n) ? asenhafm.i18n : {};
			const fallback = i18n.error || 'An error occurred. Please try again.';
			const json = xhr && xhr.responseJSON ? xhr.responseJSON : null;

			if (json) {
				if (json.message) {
					return json.code ? '[' + json.code + '] ' + json.message : json.message;
				}
				if (json.code) {
					return '[' + json.code + ']';
				}
			}

			if (textStatus === 'parsererror') {
				return i18n.invalidResponse || fallback;
			}

			// Non-JSON body (WAF HTML, PHP fatal, empty response, etc.).
			if (xhr && xhr.status) {
				const statusText = xhr.statusText || '';
				const template = i18n.httpError || 'HTTP %1$s: %2$s';
				const httpMsg = template
					.replace('%1$s', String(xhr.status))
					.replace('%2$s', statusText || 'Error');

				// Prefer invalid-response wording when the body was not JSON.
				if (!json && xhr.responseText) {
					const invalidMsg = i18n.invalidResponse || fallback;
					return httpMsg + ' — ' + invalidMsg;
				}

				return httpMsg;
			}

			return fallback;
		},

		/**
		 * Show a consistent inline message when an operation is blocked by DISALLOW_*.
		 *
		 * @param {string} path Path context.
		 * @return {void}
		 */
		notifyWriteRestricted(path) {
			this.showInlineMessage(this.getWriteRestrictionMessage(path || this.currentPath), 'error');
		},

		/**
		 * Show a consistent inline message when an operation is blocked because the
		 * destination is a protected WordPress core folder.
		 *
		 * @param {string} path Path context.
		 * @return {void}
		 */
		notifyProtectedCoreWriteFolder(path) {
			const msg =
				(asenhafm && asenhafm.i18n && asenhafm.i18n.cannotModifyProtectedCoreFolder) ?
					asenhafm.i18n.cannotModifyProtectedCoreFolder :
					(asenhafm && asenhafm.i18n && asenhafm.i18n.error ? asenhafm.i18n.error : 'Operation not allowed.');
			this.showInlineMessage(msg, 'error');
		},

		/**
		 * Toggle the visibility of write-related UI elements for the current path.
		 *
		 * @param {string} path Current folder path.
		 * @return {void}
		 */
		applyWriteRestrictionsUI(path) {
			const isRestrictedByConstants = this.isWriteRestrictedPath(path);
			const isProtectedCoreWriteFolder = this.isProtectedCoreWriteFolder(path);
			const hideTopLevelWriteActions = isRestrictedByConstants || isProtectedCoreWriteFolder;

			// Hide top-level write actions when the current folder is read-only.
			$('#asenha-fm-create-file').toggle(!hideTopLevelWriteActions);
			$('#asenha-fm-create-folder').toggle(!hideTopLevelWriteActions);
			$('#asenha-fm-upload').toggle(!hideTopLevelWriteActions);

			// Hide selection-based write actions as well (they may be visible from a previous folder).
			if (isRestrictedByConstants) {
				$('#asenha-fm-cut').hide();
				$('#asenha-fm-copy').hide();
				$('#asenha-fm-compress').hide();
				$('#asenha-fm-extract').hide();
				$('#asenha-fm-paste').hide();
				$('#asenha-fm-rename').hide();
				$('#asenha-fm-delete').hide();
			} else {
				this.updatePasteButton();
			}
		},

		/**
		 * Update the DISALLOW note shown beside the page title.
		 *
		 * Rules:
		 * - If DISALLOW_FILE_MODS is true: always show the note (takes precedence).
		 * - Else if FM_READ_ONLY is true: always show the note.
		 * - Else if DISALLOW_FILE_EDIT is true: show only when current folder is within plugins/themes.
		 *
		 * @param {string} path Current folder path.
		 * @return {void}
		 */
		updateDisallowNote(path) {
			const noteEl = $('#asenha-fm-disallow-note');
			if (!noteEl.length || typeof asenhafm === 'undefined') {
				return;
			}

			// DISALLOW_FILE_MODS always wins.
			if (asenhafm.disallowFileMods) {
				noteEl
					.text(asenhafm.i18n?.disallowFileModsNote || '')
					.removeClass('is-hidden');
				return;
			}

			// FM_READ_ONLY is a File Manager-specific global read-only mode.
			if (asenhafm.fmReadOnly) {
				noteEl
					.text(asenhafm.i18n?.fmReadOnlyNote || '')
					.removeClass('is-hidden');
				return;
			}

			// If file mods aren't disallowed, only DISALLOW_FILE_EDIT might apply.
			if (!asenhafm.disallowFileEdit) {
				noteEl.addClass('is-hidden');
				return;
			}

			const targetPath = this.normalizePath(path);
			const pluginsDir = this.normalizePath(asenhafm.pluginsDir);
			const muPluginsDir = this.normalizePath(asenhafm.muPluginsDir);
			const themesDir = this.normalizePath(asenhafm.themesDir);

			if (this.isWithinPath(pluginsDir, targetPath) || this.isWithinPath(muPluginsDir, targetPath) || this.isWithinPath(themesDir, targetPath)) {
				noteEl
					.text(asenhafm.i18n?.disallowFileEditNote || '')
					.removeClass('is-hidden');
				return;
			}

			noteEl.addClass('is-hidden');
		},

	/**
	 * Initialize the file manager
	 */
	init() {
		// Initialize tree state containers (defensive in case the script is re-executed).
		if (!this.treeLoadInFlight) {
			this.treeLoadInFlight = new Set();
		}
		if (!this.treeChildrenLoaded) {
			this.treeChildrenLoaded = new Set();
		}
		if (!this.treeLoadCallbacks) {
			this.treeLoadCallbacks = new Map();
		}

		this.bindEvents();
		// Load saved path from localStorage or use default
		const savedPath = localStorage.getItem('asenha-fm-current-path');
		const initialPath = savedPath && savedPath !== '' ? savedPath : this.currentPath;

		// Reveal/hide write-related UI immediately based on the initial folder.
		// The buttons are hidden by default in PHP to prevent any flash on first paint.
		this.updateDisallowNote(initialPath);
		this.applyWriteRestrictionsUI(initialPath);
		
		// Load tree with server-side expansion, then load directory
		// Server will pre-expand tree to the current path
		this.loadTree(null, initialPath, () => {
			// Load directory immediately after tree is rendered
			this.loadDirectory(initialPath, false);
		});
	},

	/**
	 * Bind event handlers
	 */
	bindEvents() {
		// Warning notice dismissal
		$(document).on('click', '#asenha-fm-warning-notice .notice-dismiss', () => this.dismissWarning());

		// Action buttons
		$('#asenha-fm-create-file').on('click', () => this.createFile());
		$('#asenha-fm-create-folder').on('click', () => this.createFolder());
		$('#asenha-fm-upload').on('click', () => this.triggerUpload());
		$('#asenha-fm-open').on('click', () => this.openSelected());
		$('#asenha-fm-cut').on('click', () => this.cutSelected());
		$('#asenha-fm-copy').on('click', () => this.copySelected());
		$('#asenha-fm-compress').on('click', () => this.compressSelected());
		$('#asenha-fm-download').on('click', () => this.downloadSelected());
		$('#asenha-fm-extract').on('click', () => this.extractSelected());
		$('#asenha-fm-refresh').on('click', () => this.refresh());
		$('#asenha-fm-paste').on('click', () => this.paste());
		$('#asenha-fm-rename').on('click', () => this.renameSelected());
		$('#asenha-fm-delete').on('click', () => this.deleteSelected());
		
		// Navigation buttons
		$('#asenha-fm-back').on('click', () => this.navigateBack());
		$('#asenha-fm-up').on('click', () => this.navigateUp());
		$('#asenha-fm-forward').on('click', () => this.navigateForward());

		// Modal events
		$('.asenha-fm-modal-close').on('click', (e) => this.closeModal($(e.currentTarget).closest('.asenha-fm-modal')));
		$('.asenha-fm-modal-overlay').on('click', (e) => this.closeModal($(e.currentTarget).closest('.asenha-fm-modal')));
	$('#asenha-fm-rename-confirm').on('click', () => this.confirmRename());
	$('#asenha-fm-rename-input').on('keypress', (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			this.confirmRename();
		}
	});
	$('#asenha-fm-permissions-confirm').on('click', () => this.confirmPermissions());
	$('#asenha-fm-permissions-input').on('input', () => $('#asenha-fm-permissions-error').hide());
	$('#asenha-fm-editor-save').on('click', () => this.saveFileFromEditor());
		
		// Upload modal events
		$('.asenha-fm-upload-close').on('click', () => this.closeUploadModal());
		$('.asenha-fm-upload-overlay').on('click', () => this.closeUploadModal());
		$('#asenha-fm-select-files').on('click', () => $('#asenha-fm-upload-input').click());
		$('#asenha-fm-upload-input').on('change', (e) => this.handleUploadModalFiles(e));

			// File upload input
			$('#asenha-fm-file-input').on('change', (e) => this.handleFileUpload(e));

			// Search
			$('#asenha-fm-search-input').on('input', (e) => this.handleSearch(e));

			// Select all
			$('#asenha-fm-select-all').on('change', (e) => this.handleSelectAll(e));

			// Table sorting
			$('.asenha-fm-list thead th.sortable').on('click', (e) => this.handleSort(e));

		// File list events (delegated)
		$(document).on('click', '.asenha-fm-file-row', (e) => this.handleFileClick(e));
		$(document).on('dblclick', '.asenha-fm-file-row', (e) => this.handleFileDoubleClick(e));
		$(document).on('contextmenu', '.asenha-fm-file-row', (e) => this.handleContextMenu(e));
		$(document).on('change', '.asenha-fm-file-checkbox', (e) => this.handleFileSelect(e));
		
		// Context menu on empty folder list
		$(document).on('contextmenu', '#asenha-fm-file-list', (e) => this.handleEmptyContextMenu(e));

			// Tree events
			$(document).on('click', '.asenha-fm-tree-toggle', (e) => this.handleTreeToggle(e));
			$(document).on('click', '.asenha-fm-tree-item', (e) => this.handleTreeClick(e));

			// Context menu events
			$(document).on('click', '.asenha-fm-context-menu li', (e) => this.handleContextAction(e));

			// Close context menu on outside click
			$(document).on('click', (e) => {
				if (!$(e.target).closest('.asenha-fm-context-menu').length) {
					$('.asenha-fm-context-menu').hide();
				}
			});

			// Prevent default context menu
			$(document).on('contextmenu', '.asenha-fm-content', (e) => {
				if (!$(e.target).closest('.asenha-fm-file-row').length) {
					return false;
				}
			});

			// Keyboard shortcuts
			$(document).on('keydown', (e) => this.handleKeyboard(e));

		// Drag and drop
		this.initDragDrop();
		this.initUploadModalDragDrop();
	},

	/**
	 * Dismiss warning notice
	 */
	dismissWarning() {
		$.ajax({
			url: asenhafm.restUrl + 'dismiss-warning',
			method: 'POST',
			beforeSend: (xhr) => {
				xhr.setRequestHeader('X-WP-Nonce', asenhafm.nonce);
			},
			success: (response) => {
				console.log('Warning dismissed permanently');
			}
		});
	},

	/**
	 * Load directory tree
	 */
		loadTree(path = null, currentPath = null, callback = null) {
			const targetPath = path || asenhafm.abspath;
			const expandToPath = currentPath || this.currentPath;

			$.ajax({
				url: asenhafm.restUrl + 'tree',
				method: 'GET',
				data: {
					path: targetPath,
					depth: 1,
					currentPath: expandToPath
				},
				beforeSend: (xhr) => {
					xhr.setRequestHeader('X-WP-Nonce', asenhafm.nonce);
				},
				success: (response) => {
					if (response.success) {
						this.renderTree(response.data);
						// Call callback after tree is rendered
						if (typeof callback === 'function') {
							callback();
						}
					}
				},
				error: (xhr, textStatus) => {
					this.showError(this.getAjaxErrorMessage(xhr, textStatus));
				}
			});
		},

		/**
		 * Render directory tree
		 */
	renderTree(tree, container = null, isRoot = false) {
		const isInitialRender = !container;
		
	if (isInitialRender) {
		const treeContainer = $('#asenha-fm-tree');
		treeContainer.empty();
		// Ensure valid list structure: root is a single <ul> inside the container.
		container = $('<ul></ul>').addClass('asenha-fm-tree-root');
		treeContainer.append(container);
		isRoot = true;
	}

	const li = $('<li></li>');
	const item = $('<div></div>')
		.addClass('asenha-fm-tree-item')
		.attr('data-path', tree.path);

	// Mark as active if server flagged it
	if (tree.active) {
		item.addClass('active');
	}

	// Toggle button
	const toggle = $('<span></span>')
		.addClass('asenha-fm-tree-toggle')
		.append($('<span></span>').addClass('dashicons dashicons-arrow-right-alt2'));
	
	// Check if this is the root folder
	// Normalize paths by removing trailing slashes for comparison
	const normalizedTreePath = this.normalizePath(tree.path);
	const normalizedAbsPath = this.normalizePath(asenhafm.abspath);
	const isRootFolder = isRoot && (normalizedTreePath === normalizedAbsPath);
	
	if (isRootFolder) {
		// Root folder: show home icon only, no text
		const icon = $('<span></span>')
			.addClass('asenha-fm-tree-icon dashicons dashicons-admin-home');
		item.append(toggle, icon);
	} else {
		// Non-root folders: show name only, no icon
		const name = $('<span></span>')
			.addClass('asenha-fm-tree-name')
			.text(tree.name);
		item.append(toggle, name);
	}
	li.append(item);

		// Add children container
		if (tree.children && tree.children.length > 0) {
			// Sort children alphabetically
			tree.children.sort(this.compareTreeNodesByName);
			
			// Expand if: root level, or server flagged as expanded
			const shouldExpand = isRoot || tree.expanded;
			const childrenUl = $('<ul></ul>').addClass('asenha-fm-tree-children' + (shouldExpand ? ' expanded' : ''));
			tree.children.forEach(child => {
				this.renderTree(child, childrenUl, false);
			});
			li.append(childrenUl);
			
			// Update toggle icon if expanded
			if (shouldExpand) {
				toggle.find('.dashicons').removeClass('dashicons-arrow-right-alt2').addClass('dashicons-arrow-down-alt2');
			}
		}

		// Append the node <li> into the provided <ul> container.
		container.append(li);
	},

	/**
	 * Sync tree to show the current path
	 */
	syncTreeToPath(path, depth = 0) {
		// Prevent infinite recursion - max depth of 10
		if (depth > 10) {
			console.warn('syncTreeToPath: Max recursion depth reached for path:', path);
			// Always clear the flag when hitting max depth
			if (depth === 0 || this.isSyncingTree) {
				this.isSyncingTree = false;
			}
			return;
		}
		
		// Prevent multiple simultaneous sync operations at root level
		if (depth === 0) {
			if (this.isSyncingTree) {
				console.log('syncTreeToPath: Already syncing, skipping for path:', path);
				return;
			}
			this.isSyncingTree = true;
		}
		
		// Find the tree item for this path
		const treeItem = $(`.asenha-fm-tree-item[data-path="${path}"]`);
		
		if (treeItem.length === 0) {
			// Path not in tree yet, try to expand parent folders recursively
			const parentPath = path.substring(0, path.lastIndexOf('/'));
			if (parentPath && parentPath !== path && parentPath.length >= asenhafm.abspath.length) {
				// First, ensure parent path is synced
				const parentTreeItem = $(`.asenha-fm-tree-item[data-path="${parentPath}"]`);
				if (parentTreeItem.length > 0) {
					// Parent exists, expand it
					const parentLi = parentTreeItem.closest('li');
					const childrenUl = parentLi.children('.asenha-fm-tree-children');
					
					// If parent has children but they're not expanded
					if (childrenUl.length > 0 && !childrenUl.hasClass('expanded')) {
						// Expand the parent
						childrenUl.addClass('expanded');
						parentLi.find('.asenha-fm-tree-toggle:first .dashicons')
							.removeClass('dashicons-arrow-right-alt2')
							.addClass('dashicons-arrow-down-alt2');
						
						// Try again to find and highlight our target (after a short delay)
						setTimeout(() => {
							this.syncTreeToPath(path, depth + 1);
						}, 100);
						return;
				} else if (childrenUl.length === 0) {
					const parentKey = this.normalizePath(parentPath);
					const parentChildrenLoaded =
						'1' === parentLi.attr('data-children-loaded') ||
						( this.treeChildrenLoaded && this.treeChildrenLoaded.has(parentKey) );

					if (parentChildrenLoaded) {
						// We already attempted to load this parent's children and found none.
						console.warn('syncTreeToPath: Parent has no children to load for path:', parentPath);
						if (depth === 0) {
							this.isSyncingTree = false;
						}
						return;
					}

					// Parent doesn't have children loaded yet, load them.
					this.loadTreeChildren(parentLi, parentPath, () => {
						// After loading, try to sync again.
						setTimeout(() => {
							this.syncTreeToPath(path, depth + 1);
						}, 100);
					}, path);
					return;
					} else {
						// Parent is expanded but child still not found
						// This might mean the path doesn't exist in filesystem
						console.warn('syncTreeToPath: Path not found even after parent expansion:', path);
						if (depth === 0) {
							this.isSyncingTree = false;
						}
						return;
					}
				} else {
					// Parent not found either, recursively sync to parent first
					// DON'T schedule another sync to our path - let the parent sync handle it
					this.syncTreeToPath(parentPath, depth + 1);
					return;
				}
			} else {
				// No valid parent path, clear flag and exit
				if (depth === 0) {
					this.isSyncingTree = false;
				}
				return;
			}
		} else {
			// Item found, make sure all parents are expanded
			let currentItem = treeItem.closest('li');
			
			// Expand all parent ul elements
			while (currentItem.length > 0) {
				const parentUl = currentItem.parent('ul.asenha-fm-tree-children');
				if (parentUl.length > 0) {
					if (!parentUl.hasClass('expanded')) {
						parentUl.addClass('expanded');
						const parentLi = parentUl.parent('li');
						parentLi.find('.asenha-fm-tree-toggle:first .dashicons')
							.removeClass('dashicons-arrow-right-alt2')
							.addClass('dashicons-arrow-down-alt2');
					}
					currentItem = parentUl.parent('li');
				} else {
					break;
				}
			}
			
			// Highlight the current item
			$('.asenha-fm-tree-item').removeClass('active');
			treeItem.addClass('active');
			
			// Scroll the tree item into view if needed
			const treeContainer = $('#asenha-fm-tree');
			const treeItemOffset = treeItem.offset();
			const containerOffset = treeContainer.offset();
			if (treeItemOffset && containerOffset) {
				const relativeTop = treeItemOffset.top - containerOffset.top;
				const containerHeight = treeContainer.height();
				if (relativeTop < 0 || relativeTop > containerHeight) {
					treeItem[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
				}
			}
			
			// Expand the current folder's children if it has any
			const targetLi = treeItem.closest('li');
			const targetChildren = targetLi.children('.asenha-fm-tree-children');
			
			if (targetChildren.length > 0) {
				// Children exist, expand them
				if (!targetChildren.hasClass('expanded')) {
					targetChildren.addClass('expanded');
					targetLi.find('.asenha-fm-tree-toggle:first .dashicons')
						.removeClass('dashicons-arrow-right-alt2')
						.addClass('dashicons-arrow-down-alt2');
				}
			} else {
			// No children loaded yet, check if this folder has a toggle (meaning it has children)
			const toggle = targetLi.find('.asenha-fm-tree-toggle:first');
			if (toggle.length > 0) {
				const targetKey = this.normalizePath(path);
				const targetChildrenLoaded =
					'1' === targetLi.attr('data-children-loaded') ||
					( this.treeChildrenLoaded && this.treeChildrenLoaded.has(targetKey) );

				// Load the children only once.
				if (!targetChildrenLoaded) {
					this.loadTreeChildren(targetLi, path, null, path);
				}
			}
		}
		
		// Clear the syncing flag when done successfully
		if (depth === 0) {
			this.isSyncingTree = false;
		}
		}
	},

	/**
	 * Load directory contents
	 */
loadDirectory(path, syncTree = false, skipHistory = false, callback = null) {
	this.currentPath = path;

	// Update the DISALLOW note (keeps in sync as user navigates folders).
	this.updateDisallowNote(path);

	// Toggle write-related UI (toolbar, etc.) based on current folder restrictions.
	this.applyWriteRestrictionsUI(path);
	
	// Hide inline message when navigating to a different directory
	this.hideInlineMessage();
	
	// Save current path to localStorage
	localStorage.setItem('asenha-fm-current-path', path);
	
	// Add to navigation history (unless we're navigating through history)
	if (!skipHistory) {
		// Remove any forward history if we're navigating to a new path
		if (this.historyIndex < this.navigationHistory.length - 1) {
			this.navigationHistory = this.navigationHistory.slice(0, this.historyIndex + 1);
		}
		// Add new path to history
		this.navigationHistory.push(path);
		this.historyIndex = this.navigationHistory.length - 1;
		this.updateNavigationButtons();
	}
	
	// Sync tree to show current path
	if (syncTree) {
		this.syncTreeToPath(path);
	}

		$.ajax({
			url: asenhafm.restUrl + 'directory',
			method: 'GET',
			data: { path: path },
			beforeSend: (xhr) => {
				xhr.setRequestHeader('X-WP-Nonce', asenhafm.nonce);
				const loadingRow = $('<tr></tr>').addClass('asenha-fm-loading-row asenha-fm-no-hover');
				const loadingCell = $('<td></td>').attr('colspan', '5');
				const spinner = $('<span></span>').addClass('spinner is-active');
				const loadingText = $('<p></p>').text(asenhafm.i18n.loading);
				loadingCell.append(spinner, loadingText);
				loadingRow.append(loadingCell);
				$('#asenha-fm-file-list').html(loadingRow);
			},
			success: (response) => {
				if (response.success) {
					this.renderFileList(response.data);
					this.updateBreadcrumb(path);
					this.clearSelection();
					
					// Call callback if provided
					if (typeof callback === 'function') {
						callback();
					}
				}
			},
			error: (xhr, textStatus) => {
				this.showError(this.getAjaxErrorMessage(xhr, textStatus));
				$('#asenha-fm-file-list').html('<tr><td colspan="5" style="text-align: center;">Failed to load directory</td></tr>');
			}
		});
	},

	/**
	 * Load directory contents (Promise-based wrapper)
	 * 
	 * @param {string} path - Directory path to load
	 * @param {boolean} syncTree - Whether to sync tree (default: false)
	 * @param {boolean} skipHistory - Whether to skip history (default: false)
	 * @return {Promise} Promise that resolves when directory is loaded
	 */
	loadDirectoryAsync(path, syncTree = false, skipHistory = false) {
		return new Promise((resolve, reject) => {
			this.loadDirectory(path, syncTree, skipHistory, () => {
				resolve();
			});
		});
	},

	/**
	 * Load directory tree (Promise-based wrapper)
	 * 
	 * @param {string} path - Root path for tree (default: null = ABSPATH)
	 * @param {string} currentPath - Path to expand tree to (default: null = this.currentPath)
	 * @return {Promise} Promise that resolves when tree is loaded and rendered
	 */
	loadTreeAsync(path = null, currentPath = null) {
		return new Promise((resolve, reject) => {
			this.loadTree(path, currentPath, () => {
				resolve();
			});
		});
	},

	/**
	 * Render file list
	 */
	renderFileList(items) {
			const tbody = $('#asenha-fm-file-list');
			tbody.empty();

			if (!items || items.length === 0) {
				tbody.html('<tr class="asenha-fm-no-hover"><td colspan="5" style="text-align: center;">No files or folders found</td></tr>');
				return;
			}

			// Sort items
			items = this.sortItems(items);

			items.forEach(item => {
				const tr = $('<tr></tr>')
					.addClass('asenha-fm-file-row')
					.attr('data-path', item.path)
					.attr('data-type', item.type)
					.attr('data-name', item.name);

				// Checkbox
				const checkboxTd = $('<td></td>').addClass('check-column');
				const checkbox = $('<input>')
					.attr('type', 'checkbox')
					.addClass('asenha-fm-file-checkbox')
					.val(item.path);
				checkboxTd.append(checkbox);

				// Name
				const nameTd = $('<td></td>').addClass('column-name');
				const nameDiv = $('<div></div>').addClass('asenha-fm-file-name');
				
				// Create icon element using DOM methods (not string concatenation)
				let iconElement;
				if (item.type === 'directory') {
					iconElement = $('<span></span>')
						.addClass('asenha-fm-file-icon dashicons dashicons-category');
				} else {
					iconElement = this.getFileIcon(item.extension);
				}
				nameDiv.append(iconElement);
				
				// Use .text() to safely set the filename (prevents XSS)
				const nameSpan = $('<span></span>').text(item.name);
				nameDiv.append(nameSpan);
				
				if (item.is_protected) {
					const protectedIcon = $('<span></span>')
						.addClass('asenha-fm-file-protected dashicons dashicons-lock')
						.attr('title', 'Protected WordPress core file');
					nameDiv.append(protectedIcon);
				}
				
				if (item.is_wp_config) {
					const wpConfigIcon = $('<span></span>')
						.addClass('asenha-fm-file-wp-config dashicons dashicons-admin-network')
						.attr('title', 'wp-config.php');
					nameDiv.append(wpConfigIcon);
				}
				
				nameTd.append(nameDiv);

				// Permissions
				const permsTd = $('<td></td>')
					.addClass('column-permissions')
					.text(item.permissions);

				// Size
				const sizeTd = $('<td></td>')
					.addClass('column-size')
					.text(item.size_human);

				// Modified
				const modifiedTd = $('<td></td>')
					.addClass('column-modified')
					.text(item.modified_human);

				tr.append(checkboxTd, nameTd, permsTd, sizeTd, modifiedTd);
				tbody.append(tr);
			});
		},

		/**
		 * Sort items
		 */
		sortItems(items) {
			const column = this.sortColumn;
			const direction = this.sortDirection;

			return items.sort((a, b) => {
				// Directories always come first
				if (a.type === 'directory' && b.type === 'file') return -1;
				if (a.type === 'file' && b.type === 'directory') return 1;

				let aVal, bVal;

				switch (column) {
					case 'name':
						aVal = a.name.toLowerCase();
						bVal = b.name.toLowerCase();
						break;
					case 'permissions':
						aVal = a.permissions;
						bVal = b.permissions;
						break;
					case 'size':
						aVal = a.size;
						bVal = b.size;
						break;
					case 'modified':
						aVal = a.modified;
						bVal = b.modified;
						break;
					default:
						return 0;
				}

				if (aVal < bVal) return direction === 'asc' ? -1 : 1;
				if (aVal > bVal) return direction === 'asc' ? 1 : -1;
				return 0;
			});
		},

		/**
		 * Get file icon based on extension
		 */
		getFileIcon(extension) {
			const iconMap = {
				'php': 'dashicons-media-code',
				'js': 'dashicons-media-code',
				'css': 'dashicons-media-code',
				'html': 'dashicons-media-code',
				'htm': 'dashicons-media-code',
				'htaccess': 'dashicons-media-code',
				'json': 'dashicons-media-code',
				'xml': 'dashicons-media-code',
				'jpg': 'dashicons-format-image',
				'jpeg': 'dashicons-format-image',
				'png': 'dashicons-format-image',
				'gif': 'dashicons-format-image',
				'svg': 'dashicons-format-image',
				'webp': 'dashicons-format-image',
				'pdf': 'dashicons-pdf',
				'zip': 'dashicons-archive',
				'tar': 'dashicons-archive',
				'gz': 'dashicons-archive',
				'txt': 'dashicons-media-text',
				'md': 'dashicons-media-text',
				'log': 'dashicons-media-text',
			};

			const iconClass = iconMap[extension?.toLowerCase()] || 'dashicons-media-default';
			// Return jQuery element instead of HTML string to prevent XSS
			return $('<span></span>')
				.addClass('asenha-fm-file-icon dashicons ' + iconClass);
		},

		/**
		 * Update breadcrumb
		 */
		updateBreadcrumb(path) {
			const breadcrumb = $('#asenha-fm-breadcrumb');
			breadcrumb.empty();

		// Add home icon for ABSPATH
		const homeLink = $('<a></a>')
			.attr('href', '#')
			.attr('data-path', asenhafm.abspath)
			.attr('title', 'Home')
			.on('click', (e) => {
				e.preventDefault();
				this.goHome();
			});
		const homeIcon = $('<span></span>').addClass('dashicons dashicons-admin-home');
		homeLink.append(homeIcon);

		breadcrumb.append(homeLink);

			const parts = path.split('/').filter(p => p);
			
			// Skip showing ABSPATH parts in breadcrumb
			const abspathParts = asenhafm.abspath.split('/').filter(p => p);
			const relativeParts = parts.slice(abspathParts.length);
			
			if (relativeParts.length > 0) {
				breadcrumb.append('<span class="asenha-fm-breadcrumb-sep">/</span>');
			}

		// Ensure abspath doesn't have trailing slash for consistent path building
		let currentPath = asenhafm.abspath.replace(/\/$/, '');

		relativeParts.forEach((part, index) => {
			currentPath += '/' + part;
				
		// Check if this is the last item (current folder)
		const isLastItem = index === relativeParts.length - 1;
		
		if (isLastItem) {
			// Current folder - render as plain text, not a link
			const currentSpan = $('<span></span>')
				.addClass('asenha-fm-breadcrumb-current')
				.text(part);
			
			breadcrumb.append(currentSpan);
		} else {
			// Not current folder - render as clickable link
			const link = $('<a></a>')
				.attr('href', '#')
				.text(part)
				.attr('data-path', currentPath)
				.on('click', (e) => {
					e.preventDefault();
					const clickedPath = $(e.currentTarget).attr('data-path');
					// Load directory first, then reload tree with expansion
					this.loadDirectoryAsync(clickedPath, false, false)
						.then(() => {
							return this.loadTreeAsync(null, clickedPath);
						})
						.catch((error) => {
							console.error('Breadcrumb navigation error:', error);
						});
				});

				breadcrumb.append(link);

			// Add separator after this item
					breadcrumb.append('<span class="asenha-fm-breadcrumb-sep">/</span>');
				}
			});
		},

	/**
	 * Handle tree toggle
	 */
	handleTreeToggle(e) {
		e.stopPropagation();
		const toggle = $(e.currentTarget);
		const item = toggle.closest('li');
		const treeItem = toggle.closest('.asenha-fm-tree-item');
		const path = treeItem.attr('data-path');
		const children = item.children('.asenha-fm-tree-children');

		if (children.length) {
			const isExpanding = !children.hasClass('expanded');
			children.toggleClass('expanded');
			toggle.find('.dashicons').toggleClass('dashicons-arrow-right-alt2 dashicons-arrow-down-alt2');
			
			// Load directory contents when expanding
			if (isExpanding) {
				// Update active state
				$('.asenha-fm-tree-item').removeClass('active');
				treeItem.addClass('active');
				// Load directory first (fast)
				this.loadDirectory(path, false);
				// Sync tree in background to expand children
				setTimeout(() => {
					this.syncTreeToPath(path);
				}, 300);
			}
		} else {
			const pathKey = this.normalizePath(path);
			const childrenLoaded =
				'1' === item.attr('data-children-loaded') ||
				( this.treeChildrenLoaded && this.treeChildrenLoaded.has(pathKey) );

			// Always update active state and load directory contents.
			$('.asenha-fm-tree-item').removeClass('active');
			treeItem.addClass('active');
			this.loadDirectory(path, false);

			// Load children only once; then sync after the request completes.
			if (!childrenLoaded) {
				this.loadTreeChildren(item, path, () => {
					this.syncTreeToPath(path);
				}, path);
			}
		}
	},

	/**
	 * Load tree children
	 */
	loadTreeChildren(parentLi, path, callback, currentPath = null) {
		const pathKey = this.normalizePath(path);
		const expandToPath = currentPath || this.currentPath;

		// Ensure sets exist even if init() wasn't called for some reason.
		if (!this.treeLoadInFlight) {
			this.treeLoadInFlight = new Set();
		}
		if (!this.treeChildrenLoaded) {
			this.treeChildrenLoaded = new Set();
		}
		if (!this.treeLoadCallbacks) {
			this.treeLoadCallbacks = new Map();
		}

		// Prevent concurrent loads for the same path (race condition causes duplicate children).
		if (this.treeLoadInFlight.has(pathKey)) {
			if (typeof callback === 'function') {
				const existing = this.treeLoadCallbacks.get(pathKey) || [];
				existing.push(callback);
				this.treeLoadCallbacks.set(pathKey, existing);
			}
			return;
		}
		this.treeLoadInFlight.add(pathKey);
		this.treeLoadCallbacks.set(pathKey, (typeof callback === 'function') ? [callback] : []);

		$.ajax({
			url: asenhafm.restUrl + 'tree',
			method: 'GET',
			data: {
				path: path,
				depth: 1,
				currentPath: expandToPath
			},
			beforeSend: (xhr) => {
				xhr.setRequestHeader('X-WP-Nonce', asenhafm.nonce);
			},
			complete: () => {
				// Always clear in-flight marker.
				this.treeLoadInFlight.delete(pathKey);

				// Run queued callbacks (success or error).
				const callbacks = this.treeLoadCallbacks.get(pathKey) || [];
				this.treeLoadCallbacks.delete(pathKey);
				callbacks.forEach((cb) => {
					try {
						cb();
					} catch (err) {
						// eslint-disable-next-line no-console
						console.error('File Manager: tree load callback error:', err);
					}
				});
			},
			success: (response) => {
				if (response && response.success) {
					// Mark as loaded even if there are no children (prevents repeated requests).
					this.treeChildrenLoaded.add(pathKey);
					parentLi.attr('data-children-loaded', '1');

					// Replace existing children container to keep DOM idempotent.
					parentLi.children('.asenha-fm-tree-children').remove();

					const rawChildren = (response.data && Array.isArray(response.data.children)) ? response.data.children : [];

					// De-dupe children by path (defensive; also protects against double init).
					const seen = new Set();
					const children = rawChildren.filter((child) => {
						const childKey = this.normalizePath(child && child.path ? child.path : '');
						if (!childKey || seen.has(childKey)) {
							return false;
						}
						seen.add(childKey);
						return true;
					});

					if (children.length > 0) {
						const childrenUl = $('<ul></ul>').addClass('asenha-fm-tree-children expanded');

						// Sort children alphabetically so lazy-loaded expansions match initial tree render.
						children.sort(this.compareTreeNodesByName);

						children.forEach((child) => {
							this.renderTree(child, childrenUl);
						});

						parentLi.append(childrenUl);
						parentLi.find('.asenha-fm-tree-toggle:first .dashicons')
							.removeClass('dashicons-arrow-right-alt2')
							.addClass('dashicons-arrow-down-alt2');
					}
				}
			},
			error: (xhr) => {
				// No-op: callbacks are flushed in `complete`.
			}
		});
	},

	/**
	 * Handle tree click
	 */
	handleTreeClick(e) {
		if ($(e.target).closest('.asenha-fm-tree-toggle').length) {
			return;
		}

		const item = $(e.currentTarget);
		const path = item.attr('data-path');
		const li = item.closest('li');
		const children = li.children('.asenha-fm-tree-children');
		let didRequestChildren = false;

		// Update active state
		$('.asenha-fm-tree-item').removeClass('active');
		item.addClass('active');

		// Toggle expand/collapse if folder has children
		if (children.length) {
			const isExpanding = !children.hasClass('expanded');
			children.toggleClass('expanded');
			
			// Update toggle icon
			const toggle = li.find('.asenha-fm-tree-toggle:first .dashicons');
			if (isExpanding) {
				toggle.removeClass('dashicons-arrow-right-alt2').addClass('dashicons-arrow-down-alt2');
			} else {
				toggle.removeClass('dashicons-arrow-down-alt2').addClass('dashicons-arrow-right-alt2');
				// User collapsed this node. Don't run syncTreeToPath() which would re-expand it,
				// and don't reload directory contents either.
				return;
			}
		} else {
			// No children loaded yet, check if this folder has a toggle (meaning it has children)
			const toggle = li.find('.asenha-fm-tree-toggle:first');
			if (toggle.length > 0) {
				const pathKey = this.normalizePath(path);
				const childrenLoaded =
					'1' === li.attr('data-children-loaded') ||
					( this.treeChildrenLoaded && this.treeChildrenLoaded.has(pathKey) );

				// Load the children only once; sync after load completes.
				if (!childrenLoaded) {
					didRequestChildren = true;
					this.loadTreeChildren(li, path, () => {
						this.syncTreeToPath(path);
					}, path);
				}
			}
		}

		// Load directory first (fast)
		this.loadDirectory(path, false);
		// Sync tree in background to expand children (unless we already queued sync via load callback).
		if (!didRequestChildren) {
			setTimeout(() => {
				this.syncTreeToPath(path);
			}, 300);
		}
	},

		/**
		 * Handle file click
		 */
		handleFileClick(e) {
			// Only handle clicks on the checkbox column
			if (!$(e.target).closest('.check-column').length) {
				return;
			}
			
			// Don't double-handle if clicking the checkbox itself
			if ($(e.target).is('input[type="checkbox"]')) {
				return;
			}

			const row = $(e.currentTarget);

			// Handle multi-select with Ctrl/Cmd
			if (e.ctrlKey || e.metaKey) {
				row.toggleClass('selected');
				row.find('.asenha-fm-file-checkbox').prop('checked', row.hasClass('selected'));
			} 
			// Handle range select with Shift
			else if (e.shiftKey && this.selectedItems.length > 0) {
				const rows = $('.asenha-fm-file-row');
				const start = rows.index($('.asenha-fm-file-row.selected').first());
				const end = rows.index(row);
				const range = [start, end].sort((a, b) => a - b);

				rows.slice(range[0], range[1] + 1).each((i, el) => {
					$(el).addClass('selected');
					$(el).find('.asenha-fm-file-checkbox').prop('checked', true);
				});
			}
			// Single select
			else {
				$('.asenha-fm-file-row').removeClass('selected');
				row.addClass('selected');
				row.find('.asenha-fm-file-checkbox').prop('checked', true);
			}

			this.updateSelectedItems();
		},

		/**
		 * Handle file double click
		 */
	handleFileDoubleClick(e) {
		const row = $(e.currentTarget);
		const type = row.attr('data-type');
		const path = row.attr('data-path');

		if (type === 'directory') {
			// Load directory first, then reload tree with expansion
			this.loadDirectoryAsync(path, false, false)
				.then(() => {
					return this.loadTreeAsync(null, path);
				})
				.catch((error) => {
					console.error('Directory navigation error:', error);
				});
		} else {
			// Add spinner to the file name
			const fileNameCell = row.find('.asenha-fm-file-name');
			if (!fileNameCell.find('.asenha-fm-loading-spinner').length) {
				fileNameCell.append('<span class="asenha-fm-loading-spinner spinner is-active" style="float: none; margin-left: 8px;"></span>');
			}
			
			this.openFile(path, row);
		}
	},

		/**
		 * Handle file select checkbox
		 */
		handleFileSelect(e) {
			e.stopPropagation();
			const checkbox = $(e.currentTarget);
			const row = checkbox.closest('.asenha-fm-file-row');

			if (checkbox.prop('checked')) {
				row.addClass('selected');
			} else {
				row.removeClass('selected');
			}

			this.updateSelectedItems();
		},

		/**
		 * Handle select all
		 */
		handleSelectAll(e) {
			const checked = $(e.currentTarget).prop('checked');
			$('.asenha-fm-file-checkbox').prop('checked', checked);
			$('.asenha-fm-file-row').toggleClass('selected', checked);
			this.updateSelectedItems();
		},

	/**
	 * Update selected items
	 */
	updateSelectedItems() {
		this.selectedItems = $('.asenha-fm-file-row.selected').map(function() {
			return {
				path: $(this).attr('data-path'),
				type: $(this).attr('data-type'),
				name: $(this).attr('data-name')
			};
		}).get();
		this.updateActionButtons();
			this.updatePasteButton();
	},

	/**
	 * Get the file extension from a path.
	 *
	 * @param {string} path
	 * @returns {string} Lowercase extension without dot (e.g. "php"), or empty string.
	 */
	getFileExtension(path) {
		const fileName = String(path || '').split('/').pop() || '';
		if (!fileName) {
			return '';
		}

		// Handle dotfiles like ".htaccess".
		if (fileName.charAt(0) === '.' && fileName.indexOf('.', 1) === -1) {
			return fileName.substring(1).toLowerCase();
		}

		const parts = fileName.split('.');
		if (parts.length < 2) {
			return '';
		}

		return parts.pop().toLowerCase();
	},

	/**
	 * Check whether a file path is considered text-based (editable in the editor modal).
	 *
	 * @param {string} path
	 * @returns {boolean}
	 */
	isTextBasedFilePath(path) {
		const textExtensions = [
			'php',
			'js',
			'css',
			'html',
			'htm',
			'xml',
			'svg',
			'txt',
			'md',
			'json',
			'sql',
			'sh',
			'yml',
			'yaml',
			'ini',
			'conf',
			'log',
			'htaccess'
		];

		const extension = this.getFileExtension(path);
		return extension !== '' && textExtensions.includes(extension);
	},

	/**
	 * Get items that are selected via checkbox (not merely highlighted/selected rows).
	 *
	 * @returns {Array<{path: string, type: string, name: string}>}
	 */
	getCheckedItems() {
		return $('.asenha-fm-file-checkbox:checked').closest('.asenha-fm-file-row').map(function() {
			return {
				path: $(this).attr('data-path'),
				type: $(this).attr('data-type'),
				name: $(this).attr('data-name')
			};
		}).get();
	},
	
	/**
	 * Update action button visibility based on selection
	 */
	updateActionButtons() {
		const isCurrentFolderReadOnly = this.isWriteRestrictedPath(this.currentPath);
		const checkedItems = this.getCheckedItems();
		const hasSelection = checkedItems.length > 0;
		const hasSingleSelection = checkedItems.length === 1;
		const singleItem = hasSingleSelection ? checkedItems[0] : null;
		const hasSingleFileSelection = !!(singleItem && singleItem.type === 'file');
		const isZipFile = !!(singleItem && singleItem.name && singleItem.name.endsWith('.zip'));
		const canOpenSelectedFile = hasSingleFileSelection && this.isTextBasedFilePath(singleItem.path);
		
		// Check if any selected items are protected core files
		const hasProtectedFiles = hasSelection && checkedItems.some(item => {
			const row = $(`.asenha-fm-file-row[data-path="${item.path}"]`);
			return row.find('.asenha-fm-file-protected').length > 0;
		});
		
		// Check if any selected items are wp-config.php
		const hasWpConfigFile = hasSelection && checkedItems.some(item => {
			const row = $(`.asenha-fm-file-row[data-path="${item.path}"]`);
			return row.find('.asenha-fm-file-wp-config').length > 0;
		});
		
		// Open/Download are read actions and should remain available even in DISALLOW_* read-only folders.
		$('#asenha-fm-open').toggle(canOpenSelectedFile);
		$('#asenha-fm-download').toggle(hasSingleFileSelection);

		// When the current folder is read-only (DISALLOW_*), hide all write actions.
		if (isCurrentFolderReadOnly) {
			$('#asenha-fm-cut').hide();
			$('#asenha-fm-copy').hide();
			$('#asenha-fm-compress').hide();
			$('#asenha-fm-extract').hide();
			$('#asenha-fm-paste').hide();
			$('#asenha-fm-rename').hide();
			$('#asenha-fm-delete').hide();
			return;
		}

		// Show Cut button only when items are selected AND none are protected or wp-config.php.
		$('#asenha-fm-cut').toggle(hasSelection && !hasProtectedFiles && !hasWpConfigFile);

		// Show Copy button when items are selected.
		$('#asenha-fm-copy').toggle(hasSelection);

		// Show Compress button when items are selected.
		$('#asenha-fm-compress').toggle(hasSelection);

		// Show Extract button only when a single zip file is selected.
		$('#asenha-fm-extract').toggle(isZipFile);

		// Show Rename button only when a single non-protected, non-wp-config item is selected.
		$('#asenha-fm-rename').toggle(hasSingleSelection && !hasProtectedFiles && !hasWpConfigFile);

		// Show Delete button only when non-protected, non-wp-config items are selected.
		$('#asenha-fm-delete').toggle(hasSelection && !hasProtectedFiles && !hasWpConfigFile);
	},

	/**
	 * Clear selection
	 */
	clearSelection() {
		$('.asenha-fm-file-row').removeClass('selected');
		$('.asenha-fm-file-checkbox, #asenha-fm-select-all').prop('checked', false);
		this.selectedItems = [];
		this.updateActionButtons();
		this.updatePasteButton();
	},

		/**
		 * Handle sort
		 */
		handleSort(e) {
			e.preventDefault();
			const th = $(e.currentTarget);
			const column = th.attr('data-sort');

			if (this.sortColumn === column) {
				this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
			} else {
				this.sortColumn = column;
				this.sortDirection = 'asc';
			}

			// Update UI
			$('.asenha-fm-list thead th').removeClass('asc desc');
			th.addClass(this.sortDirection);

			// Reload with current items (client-side sort, no tree sync needed)
			this.loadDirectory(this.currentPath, false);
		},

		/**
		 * Handle search
		 */
		handleSearch(e) {
			const query = $(e.currentTarget).val().toLowerCase();
			
			$('.asenha-fm-file-row').each(function() {
				const name = $(this).attr('data-name').toLowerCase();
				$(this).toggle(name.includes(query));
			});
		},

	/**
	 * Handle context menu
	 */
	handleContextMenu(e) {
		e.preventDefault();
		
		const row = $(e.currentTarget);
		const path = row.attr('data-path');
		const type = row.attr('data-type');

		// Select the row if not already selected
		if (!row.hasClass('selected')) {
			$('.asenha-fm-file-row').removeClass('selected');
			row.addClass('selected');
			this.updateSelectedItems();
		}

		this.showContextMenu(e, type, path);
	},
	
	/**
	 * Handle context menu on empty folder
	 */
	handleEmptyContextMenu(e) {
		// Only show context menu if the list is empty or clicking on the "No files" row
		const tbody = $('#asenha-fm-file-list');
		const hasFiles = tbody.find('.asenha-fm-file-row').length > 0;
		
		if (hasFiles) {
			// If there are files, don't interfere with normal row context menus
			return;
		}

		// In read-only folders there are no allowed actions on empty space.
		if (this.isWriteRestrictedPath(this.currentPath)) {
			e.preventDefault();
			return;
		}
		
		e.preventDefault();
		this.clearSelection();
		this.showContextMenu(e, null, null);
	},
	
	/**
	 * Show context menu at position
	 */
	showContextMenu(e, type, path) {
		const menu = $('.asenha-fm-context-menu');

		// Remember the context menu target so actions (e.g. Paste) can operate on it.
		// If the menu is opened on empty space, there is no target.
		this.contextMenuTarget = (path && type) ? { type, path } : null;

		// Prep: make it measurable without flashing on screen.
		menu.css({
			display: 'block',
			visibility: 'hidden'
		});

		// Reset all actions first to avoid stale visibility state.
		menu.find('li').hide();

		const hasClipboardItems = !!(Array.isArray(this.clipboard) && this.clipboard.length > 0);

		// Check if any selected items are protected
		const hasProtectedFiles = this.selectedItems.some(item => {
			const row = $(`.asenha-fm-file-row[data-path="${item.path}"]`);
			return row.find('.asenha-fm-file-protected').length > 0;
		});
		
		// Check if any selected items are wp-config.php
		const hasWpConfigFile = this.selectedItems.some(item => {
			const row = $(`.asenha-fm-file-row[data-path="${item.path}"]`);
			return row.find('.asenha-fm-file-wp-config').length > 0;
		});
		
		// Check if selecting a folder
		const isFolder = type === 'directory';
		const isSingleSelection = this.selectedItems.length === 1;
		const canOpenInEditor = !!(isSingleSelection && type === 'file' && path && this.isTextBasedFilePath(path));

		// DISALLOW_*: In read-only folders, only Open and Download are allowed/visible.
		if (this.isWriteRestrictedPath(this.currentPath)) {
			menu.find('[data-action="open"]').toggle(canOpenInEditor);
			menu.find('[data-action="download"]').toggle(isSingleSelection && !isFolder);
		} else {
			// Disable/enable certain menu items based on context
			menu.find('[data-action="open"]').toggle(canOpenInEditor);
			menu.find('[data-action="copy"]').toggle(this.selectedItems.length > 0);
			// Hide Cut if any selected items are protected or wp-config.php
			menu.find('[data-action="cut"]').toggle(this.selectedItems.length > 0 && !hasProtectedFiles && !hasWpConfigFile);
			// Show Paste only when clipboard has items and selection does not include protected files.
			menu.find('[data-action="paste"]').toggle(hasClipboardItems && !hasProtectedFiles);
			// Hide Rename if any selected items are protected or wp-config.php
			menu.find('[data-action="rename"]').toggle(this.selectedItems.length === 1 && !hasProtectedFiles && !hasWpConfigFile);
			// Hide Edit Permissions if any selected items are protected
			menu.find('[data-action="permissions"]').toggle(this.selectedItems.length === 1 && !hasProtectedFiles);
			menu.find('[data-action="compress"]').toggle(this.selectedItems.length > 0);
			// Hide Download when selecting a folder
			menu.find('[data-action="download"]').toggle(isSingleSelection && !isFolder);
			// Hide Delete if any selected items are protected or wp-config.php
			menu.find('[data-action="delete"]').toggle(this.selectedItems.length > 0 && !hasProtectedFiles && !hasWpConfigFile);
			menu.find('[data-action="extract"]').toggle(this.selectedItems.length === 1 && path && path.endsWith('.zip'));
		}

		// Hide context menu entirely if there are no actions to show.
		if (menu.find('li:visible').length === 0) {
			menu.css('visibility', '').hide();
			return;
		}

		// Position and show context menu.
		const menuWidth = menu.outerWidth() || 200;
		const menuHeight = menu.outerHeight() || 300;
		const windowWidth = $(window).width();
		const windowHeight = $(window).height();

		// Menu is `position: fixed` in CSS, so use viewport coordinates.
		// `pageX/pageY` includes document scroll and will drift when the page is scrolled.
		const padding = 10;
		const evt = e.originalEvent || e;
		const clickX = (typeof evt.clientX === 'number') ? evt.clientX : e.clientX;
		const clickY = (typeof evt.clientY === 'number') ? evt.clientY : e.clientY;

		const is_finite_number = (value) => (typeof value === 'number') && Number.isFinite(value);

		let left = is_finite_number(clickX) ? clickX : null;
		let top = is_finite_number(clickY) ? clickY : null;

		// Fallback: if client coords aren't available for some reason, convert page coords to viewport coords.
		// This is defensive; for real user `contextmenu` events, `clientX/clientY` should always exist.
		if (null === left) {
			const pageX = is_finite_number(evt.pageX) ? evt.pageX : (is_finite_number(e.pageX) ? e.pageX : null);
			if (null !== pageX) {
				const scrollX = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
				left = pageX - scrollX;
			} else {
				left = padding;
			}
		}

		if (null === top) {
			const pageY = is_finite_number(evt.pageY) ? evt.pageY : (is_finite_number(e.pageY) ? e.pageY : null);
			if (null !== pageY) {
				const scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
				top = pageY - scrollY;
			} else {
				top = padding;
			}
		}

		// Clamp within viewport (with padding), so the menu doesn't go off-screen.
		const maxLeft = Math.max(padding, windowWidth - menuWidth - padding);
		const maxTop = Math.max(padding, windowHeight - menuHeight - padding);
		left = Math.max(padding, Math.min(left, maxLeft));
		top = Math.max(padding, Math.min(top, maxTop));

		menu.css({
			left: left + 'px',
			top: top + 'px',
			visibility: 'visible'
		});
	},

		/**
		 * Handle context action
		 */
		handleContextAction(e) {
			const action = $(e.currentTarget).attr('data-action');
			const isDisabled = $(e.currentTarget).hasClass('disabled');

			if (isDisabled) {
				return;
			}

			$('.asenha-fm-context-menu').hide();

			switch (action) {
				case 'open':
					if (this.selectedItems.length === 1) {
						this.openFile(this.selectedItems[0].path);
					}
					break;
				case 'cut':
					this.cutSelected();
					break;
				case 'copy':
					this.copySelected();
					break;
				case 'paste':
					this.paste(this.contextMenuTarget);
					break;
				case 'rename':
					this.renameSelected();
					break;
				case 'permissions':
					this.changePermissions();
					break;
				case 'compress':
					this.compressSelected();
					break;
				case 'download':
					this.downloadSelected();
					break;
				case 'delete':
					this.deleteSelected();
					break;
				case 'extract':
					this.extractSelected();
					break;
			}
		},

		/**
		 * Handle keyboard shortcuts
		 */
	handleKeyboard(e) {
		// Don't handle keyboard shortcuts when focused on input fields
		const isInputFocused = $(e.target).is('input, textarea, select');
		
		// Delete key
		if (e.key === 'Delete' && this.selectedItems.length > 0 && !isInputFocused) {
			if (this.isWriteRestrictedPath(this.currentPath)) {
				this.notifyWriteRestricted(this.currentPath);
				return;
			}
			this.deleteSelected();
		}
		// Ctrl/Cmd + A (select all) - only when not in an input field
		else if ((e.ctrlKey || e.metaKey) && e.key === 'a' && !isInputFocused) {
			e.preventDefault();
			$('#asenha-fm-select-all').prop('checked', true).trigger('change');
		}
		// Ctrl/Cmd + C (copy)
		else if ((e.ctrlKey || e.metaKey) && e.key === 'c' && this.selectedItems.length > 0 && !isInputFocused) {
			if (this.isWriteRestrictedPath(this.currentPath)) {
				this.notifyWriteRestricted(this.currentPath);
				return;
			}
			this.copySelected();
		}
		// Ctrl/Cmd + X (cut)
		else if ((e.ctrlKey || e.metaKey) && e.key === 'x' && this.selectedItems.length > 0 && !isInputFocused) {
			if (this.isWriteRestrictedPath(this.currentPath)) {
				this.notifyWriteRestricted(this.currentPath);
				return;
			}
			this.cutSelected();
		}
		// Ctrl/Cmd + V (paste)
		else if ((e.ctrlKey || e.metaKey) && e.key === 'v' && this.clipboard && !isInputFocused) {
			if (this.isWriteRestrictedPath(this.currentPath)) {
				this.notifyWriteRestricted(this.currentPath);
				return;
			}
			this.paste();
		}
		// Escape (clear selection / close modals)
		else if (e.key === 'Escape') {
			if (isInputFocused) {
				// Just blur the input field
				$(e.target).blur();
			} else {
				this.clearSelection();
				$('.asenha-fm-context-menu').hide();
			}
		}
	},

	/**
	 * Initialize drag and drop
	 */
	initDragDrop() {
		const dropZone = $('.asenha-fm-content');

		dropZone.on('dragover', (e) => {
			e.preventDefault();
			e.stopPropagation();
			dropZone.addClass('drag-over');
		});

		dropZone.on('dragleave', (e) => {
			e.preventDefault();
			e.stopPropagation();
			dropZone.removeClass('drag-over');
		});

		dropZone.on('drop', (e) => {
			e.preventDefault();
			e.stopPropagation();
			dropZone.removeClass('drag-over');

			const files = e.originalEvent.dataTransfer.files;
			if (files.length > 0) {
			if (this.isWriteRestrictedPath(this.currentPath)) {
				this.notifyWriteRestricted(this.currentPath);
				return;
			}
				this.uploadFiles(files);
			}
		});
	},

	/**
	 * Open the currently selected file (single selection only).
	 */
	openSelected() {
		if (this.selectedItems.length !== 1 || this.selectedItems[0].type !== 'file') {
			return;
		}

		const path = this.selectedItems[0].path;
		this.showButtonSpinner('#asenha-fm-open');
		this.openFile(path, null, { actionButtonId: '#asenha-fm-open' });
	},
	
	/**
	 * Initialize upload modal drag and drop
	 */
	initUploadModalDragDrop() {
		const dropZone = $('#asenha-fm-upload-dropzone');

		dropZone.on('dragover', (e) => {
			e.preventDefault();
			e.stopPropagation();
			dropZone.addClass('drag-over');
		});

		dropZone.on('dragleave', (e) => {
			e.preventDefault();
			e.stopPropagation();
			dropZone.removeClass('drag-over');
		});

	dropZone.on('drop', (e) => {
		e.preventDefault();
		e.stopPropagation();
		dropZone.removeClass('drag-over');

		const files = e.originalEvent.dataTransfer.files;
		if (files.length > 0) {
			// Clear any previous errors
			$('#asenha-fm-upload-error').hide().text('');
			if (this.isWriteRestrictedPath(this.currentPath)) {
				this.notifyWriteRestricted(this.currentPath);
				return;
			}
			this.uploadFilesFromModal(files);
		}
	});
	},

		/**
		 * File Operations
		 */

	createFile() {
		if (this.isWriteRestrictedPath(this.currentPath)) {
			this.notifyWriteRestricted(this.currentPath);
			return;
		}
		if (this.isProtectedCoreWriteFolder(this.currentPath)) {
			this.notifyProtectedCoreWriteFolder(this.currentPath);
			return;
		}
		const fileName = prompt(asenhafm.i18n.enterFileName);
		if (!fileName) return;

		const filePath = this.currentPath + '/' + fileName;

		$.ajax({
			url: asenhafm.restUrl + 'file',
			method: 'POST',
			data: {
				path: filePath,
				contents: '',
				create: true
			},
			beforeSend: (xhr) => {
				xhr.setRequestHeader('X-WP-Nonce', asenhafm.nonce);
			},
			success: (response) => {
				if (response.success) {
					this.showInlineMessage(response.message, 'success');
					this.refresh();
				}
			},
			error: (xhr, textStatus) => {
				this.showInlineMessage(this.getAjaxErrorMessage(xhr, textStatus), 'error');
			}
		});
	},

	createFolder() {
		if (this.isWriteRestrictedPath(this.currentPath)) {
			this.notifyWriteRestricted(this.currentPath);
			return;
		}
		if (this.isProtectedCoreWriteFolder(this.currentPath)) {
			this.notifyProtectedCoreWriteFolder(this.currentPath);
			return;
		}
		const folderName = prompt(asenhafm.i18n.enterFolderName);
		if (!folderName) return;

		const folderPath = this.currentPath + '/' + folderName;

		$.ajax({
			url: asenhafm.restUrl + 'folder',
			method: 'POST',
			data: { path: folderPath },
			beforeSend: (xhr) => {
				xhr.setRequestHeader('X-WP-Nonce', asenhafm.nonce);
			},
			success: (response) => {
				if (response.success) {
					this.showInlineMessage(response.message, 'success');
					this.refresh();
				}
			},
			error: (xhr, textStatus) => {
				this.showInlineMessage(this.getAjaxErrorMessage(xhr, textStatus), 'error');
			}
		});
	},

	openFile(path, row, options = {}) {
		const actionButtonId = options && options.actionButtonId ? options.actionButtonId : null;
		const extension = this.getFileExtension(path);

		// Check if file is text-based
		if (!this.isTextBasedFilePath(path)) {
			// Remove spinner if present
			if (row) {
				row.find('.asenha-fm-loading-spinner').remove();
			}
			if (actionButtonId) {
				this.resetButtonState(actionButtonId);
			}
			alert(asenhafm.i18n.fileTypeNotEditable);
			return;
		}
		
		// Load file content into editor via POST body (keeps sensitive filenames out of the query string).
		$.ajax({
			url: asenhafm.restUrl + 'file/read',
			method: 'POST',
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify({ path: path }),
			beforeSend: (xhr) => {
				xhr.setRequestHeader('X-WP-Nonce', asenhafm.nonce);
			},
			success: (response) => {
				// Remove spinner from file name
				if (row) {
					row.find('.asenha-fm-loading-spinner').remove();
				}

				if (response.success) {
					const fileName = path.split('/').pop();
					const isProtected = !!(response.data_meta && response.data_meta.is_protected);
					const isReadOnlyByConstants = !!(response.data_meta && response.data_meta.is_read_only_by_constants);
					const isReadOnly = isProtected || isReadOnlyByConstants || this.isWriteRestrictedPath(path);

					// Update modal title + UI based on read-only state.
					if (isReadOnly) {
						$('#asenha-fm-editor-title-text').text(asenhafm.i18n.viewFile);
						$('#asenha-fm-editor-save').hide();
						$('#asenha-fm-editor-textarea').prop('readonly', true);
					} else {
						$('#asenha-fm-editor-title-text').text(asenhafm.i18n.editFile);
						$('#asenha-fm-editor-save').show();
						$('#asenha-fm-editor-textarea').prop('readonly', false);
					}

					$('#asenha-fm-editor-file-name').text(fileName);

					// Show PHP warning only when the file is actually editable.
					if (extension === 'php' && !isReadOnly) {
						$('#asenha-fm-php-warning').show();
					} else {
						$('#asenha-fm-php-warning').hide();
					}

					// Store metadata for the Save handler.
					$('#asenha-fm-editor-textarea')
						.val(response.data)
						.data('file-path', path)
						.data('is-protected', isProtected)
						.data('is-read-only-by-constants', isReadOnlyByConstants);

					this.openModal($('#asenha-fm-editor-modal'));

					if (actionButtonId) {
						this.showButtonCheckmark(actionButtonId);
					}

					// Initialize CodeMirror if available.
					setTimeout(() => {
						if (typeof window.AsenhafmCodeMirror !== 'undefined') {
							const editor = window.AsenhafmCodeMirror.init($('#asenha-fm-editor-textarea'), { readOnly: isReadOnly });
							if (editor && isReadOnly) {
								editor.setOption('readOnly', true);
							}
						}
					}, 100);
				} else {
					if (actionButtonId) {
						this.resetButtonState(actionButtonId);
					}
					this.showError(response.message || asenhafm.i18n.error);
				}
			},
			error: (xhr, textStatus) => {
				// Remove spinner from file name
				if (row) {
					row.find('.asenha-fm-loading-spinner').remove();
				}
				if (actionButtonId) {
					this.resetButtonState(actionButtonId);
				}
				this.showError(this.getAjaxErrorMessage(xhr, textStatus));
			}
		});
	},

	saveFileFromEditor() {
		const path = $('#asenha-fm-editor-textarea').data('file-path');
		const $saveBtn = $('#asenha-fm-editor-save');
		const $spinner = $('.asenha-fm-editor-save-spinner');
		const $saveText = $saveBtn.find('.asenha-fm-editor-save-text');

		// Bail out if the file is read-only (protected core file or restricted by DISALLOW_*).
		const isProtected = !!$('#asenha-fm-editor-textarea').data('is-protected');
		const isReadOnlyByConstants = !!$('#asenha-fm-editor-textarea').data('is-read-only-by-constants');
		if (isProtected || isReadOnlyByConstants) {
			const message = isProtected ? 'This file is read-only.' : this.getWriteRestrictionMessage(path);
			this.showEditorMessage(message, 'error');
			return;
		}
		
		// Get contents from CodeMirror if available, otherwise from textarea
		let contents;
		if (typeof window.AsenhafmCodeMirror !== 'undefined' && window.AsenhafmCodeMirror.editor) {
			contents = window.AsenhafmCodeMirror.getValue();
		} else {
			contents = $('#asenha-fm-editor-textarea').val();
		}

		// Ensure contents is a string (even if empty)
		if (contents === undefined || contents === null) {
			contents = '';
		}

		$.ajax({
			url: asenhafm.restUrl + 'file',
			method: 'POST',
			data: {
				path: path,
				contents: contents,
				create: false
			},
		beforeSend: (xhr) => {
			xhr.setRequestHeader('X-WP-Nonce', asenhafm.nonce);
			// Hide any previous messages
			this.hideEditorMessage();
			// Hide PHP warning notice
			$('#asenha-fm-php-warning').hide();
			// Show spinner, disable button
			$saveBtn.prop('disabled', true);
			$spinner.css('display', 'inline-block').addClass('is-active');
			$saveText.text(asenhafm.i18n.saving);
		},
		success: (response) => {
			if (response.success) {
				this.showEditorMessage(response.message, 'success');
				this.refresh();
				// Keep modal open, just reset button state
				$saveBtn.prop('disabled', false);
				$spinner.hide().removeClass('is-active');
				$saveText.text(asenhafm.i18n.saveFile);
			}
		},
		error: (xhr, textStatus) => {
			this.showEditorMessage(this.getAjaxErrorMessage(xhr, textStatus), 'error');
			// Reset button state on error
			$saveBtn.prop('disabled', false);
			$spinner.hide().removeClass('is-active');
			$saveText.text(asenhafm.i18n.saveFile);
		}
		});
	},
	
	/**
	 * Show message inside editor modal
	 */
	showEditorMessage(message, type) {
		const $messageDiv = $('#asenha-fm-editor-message');
		$messageDiv
			.removeClass('success error')
			.addClass(type)
			.text(message)
			.show();
	},
	
	/**
	 * Hide message inside editor modal
	 */
	hideEditorMessage() {
		$('#asenha-fm-editor-message').hide();
	},
	
	/**
	 * Show inline message above file list
	 */
	showInlineMessage(message, type) {
		const $messageDiv = $('#asenha-fm-inline-message');
		$messageDiv
			.removeClass('success error')
			.addClass(type)
			.text(message)
			.fadeIn(200);
		
		// Auto-hide after 4 seconds
		setTimeout(() => {
			$messageDiv.fadeOut(200);
		}, 4000);
	},
	
	/**
	 * Hide inline message
	 */
	hideInlineMessage() {
		$('#asenha-fm-inline-message').hide();
	},
	
	/**
	 * Show button spinner with progress text
	 */
	showButtonSpinner(buttonId, progressText) {
		const $btn = $(buttonId);
		const $text = $btn.find('.asenha-fm-btn-text');
		
		// Store original text if not already stored
		if (!$text.data('original-text')) {
			$text.data('original-text', $text.text());
		}
		
		// Update text if provided
		if (progressText) {
			$text.text(progressText);
		}
		
		$btn.find('.asenha-fm-btn-checkmark').hide();
		$btn.find('.asenha-fm-btn-spinner').addClass('is-active').show();
		$btn.prop('disabled', true);
	},
	
	/**
	 * Show button checkmark with success text
	 */
	showButtonCheckmark(buttonId, successText) {
		const $btn = $(buttonId);
		const $text = $btn.find('.asenha-fm-btn-text');
		
		// Update text if provided
		if (successText) {
			$text.text(successText);
		}
		
		$btn.find('.asenha-fm-btn-spinner').removeClass('is-active').hide();
		$btn.find('.asenha-fm-btn-checkmark').show();
		$btn.prop('disabled', false);
		
		// Auto-hide checkmark and restore original text after 1.5 seconds
		setTimeout(() => {
			$btn.find('.asenha-fm-btn-checkmark').hide();
			const originalText = $text.data('original-text');
			if (originalText) {
				$text.text(originalText);
			}
		}, 1500);
	},
	
	/**
	 * Reset button state (hide spinner/checkmark, restore original text)
	 */
	resetButtonState(buttonId) {
		const $btn = $(buttonId);
		const $text = $btn.find('.asenha-fm-btn-text');
		
		$btn.find('.asenha-fm-btn-spinner').removeClass('is-active').hide();
		$btn.find('.asenha-fm-btn-checkmark').hide();
		
		// Restore original text
		const originalText = $text.data('original-text');
		if (originalText) {
			$text.text(originalText);
		}
		
		$btn.prop('disabled', false);
	},

	cutSelected() {
		if (this.selectedItems.length === 0) {
			alert(asenhafm.i18n.noItemsSelected);
			return;
		}
		
	// Cut is instant, just show checkmark
	this.clipboard = [...this.selectedItems];
	this.clipboardAction = 'cut';
	this.updatePasteButton();
	this.showButtonCheckmark('#asenha-fm-cut', 'Cut');
},

copySelected() {
	if (this.selectedItems.length === 0) {
		alert(asenhafm.i18n.noItemsSelected);
		return;
	}

	this.showButtonSpinner('#asenha-fm-copy', 'Copying');
	
	// Simulate a brief delay for visual feedback
	setTimeout(() => {
		this.clipboard = [...this.selectedItems];
		this.clipboardAction = 'copy';
		this.updatePasteButton();
		this.showButtonCheckmark('#asenha-fm-copy', 'Copied');
	}, 300);
},
	
	updatePasteButton() {
		const hasClipboardItems = !!(this.clipboard && this.clipboard.length > 0);

		if (!hasClipboardItems) {
			$('#asenha-fm-paste').fadeOut(200);
			return;
		}

		// Resolve the same destination logic as paste():
		// if a single folder row is selected, treat that as destination, else currentPath.
		let destination = this.currentPath;
		if (
			Array.isArray(this.selectedItems) &&
			this.selectedItems.length === 1 &&
			this.selectedItems[0].type === 'directory' &&
			this.selectedItems[0].path
		) {
			destination = this.selectedItems[0].path;
		}

		// Never show Paste inside a read-only folder.
		if (this.isWriteRestrictedPath(destination)) {
			$('#asenha-fm-paste').hide();
			return;
		}

		// Never show Paste when the destination is a protected WP core folder.
		if (this.isProtectedCoreDestination(destination)) {
			$('#asenha-fm-paste').hide();
			return;
		}

		$('#asenha-fm-paste').fadeIn(200);
	},

	/**
	 * Check if a destination folder is a protected WordPress core path.
	 *
	 * This is used to prevent destructive operations in core directories (e.g. wp-admin, wp-includes).
	 *
	 * @param {string} path Destination folder path.
	 * @return {boolean} Whether the destination should be treated as protected.
	 */
	isProtectedCoreDestination(path) {
		const target = this.normalizePath(path);
		if (!target) {
			return false;
		}

		// Fast path: core directories by path.
		const base = this.normalizePath(asenhafm && asenhafm.abspath ? asenhafm.abspath : '');
		if (base) {
			const coreRoots = [base + '/wp-admin', base + '/wp-includes'];
			for (let i = 0; i < coreRoots.length; i++) {
				const root = this.normalizePath(coreRoots[i]);
				if (target === root || target.indexOf(root + '/') === 0) {
					return true;
				}
			}
		}

		// Fallback: if the destination exists in the current file list, rely on the lock marker.
		// This covers cases where backend flags other core locations as protected.
		const self = this;
		const row = $('.asenha-fm-file-row').filter(function() {
			return self.normalizePath($(this).attr('data-path')) === target;
		}).first();

		return !!(row.length && row.find('.asenha-fm-file-protected').length > 0);
	},

paste(target = null) {
	if (!this.clipboard || this.clipboard.length === 0) {
		return;
	}

	const action = this.clipboardAction;
	const items = this.clipboard;

	// Resolve paste destination:
	// - If the context menu was opened on a folder row, paste into that folder.
	// - Else if a single folder row is selected, paste into that folder.
	// - Else paste into the currently opened folder.
	let destination = this.currentPath;
	if (target && target.type === 'directory' && target.path) {
		destination = target.path;
	} else if (
		Array.isArray(this.selectedItems) &&
		this.selectedItems.length === 1 &&
		this.selectedItems[0].type === 'directory' &&
		this.selectedItems[0].path
	) {
		destination = this.selectedItems[0].path;
	}

	// Do not allow paste into a write-restricted folder.
	if (this.isWriteRestrictedPath(destination)) {
		this.notifyWriteRestricted(destination);
		return;
	}

	// Do not allow paste into a protected WP core folder (toolbar/keyboard safety).
	if (this.isProtectedCoreDestination(destination)) {
		const msg =
			(asenhafm && asenhafm.i18n && asenhafm.i18n.cannotPasteProtectedFolder) ?
				asenhafm.i18n.cannotPasteProtectedFolder :
				(asenhafm && asenhafm.i18n && asenhafm.i18n.error ? asenhafm.i18n.error : 'Operation not allowed.');
		this.showInlineMessage(msg, 'error');
		return;
	}
	
	// Show progress indicator
	this.showButtonSpinner('#asenha-fm-paste', 'Pasting');
	
	// Counter for tracking completion
	let completed = 0;
	let hasError = false;
	const total = items.length;

	items.forEach(item => {
		const base = String(destination || '').replace(/\/+$/g, '');
		const name = String(item.name || '').replace(/^\/+/g, '');
		const newPath = base + '/' + name;
		
		if (action === 'copy') {
			this.copyItem(item.path, newPath, (success) => {
				completed++;
				if (!success) hasError = true;
				
				if (completed === total) {
					if (hasError) {
						this.resetButtonState('#asenha-fm-paste');
					} else {
						this.showButtonCheckmark('#asenha-fm-paste', 'Pasted');
					}
					this.refresh();
				}
			});
		} else if (action === 'cut') {
			this.moveItem(item.path, newPath, (success) => {
				completed++;
				if (!success) hasError = true;
				
				if (completed === total) {
					if (!hasError) {
						this.clipboard = null;
						this.clipboardAction = null;
						this.showButtonCheckmark('#asenha-fm-paste', 'Pasted');
						this.updatePasteButton();
					} else {
						this.resetButtonState('#asenha-fm-paste');
					}
					this.refresh();
				}
			});
		}
	});
},

copyItem(source, destination, callback) {
	$.ajax({
		url: asenhafm.restUrl + 'copy',
		method: 'POST',
		data: {
			source: source,
			destination: destination
		},
		beforeSend: (xhr) => {
			xhr.setRequestHeader('X-WP-Nonce', asenhafm.nonce);
		},
		success: (response) => {
			const ok = !!(response && response.success);
			if (callback) callback(ok);
		},
		error: (xhr) => {
			if (callback) callback(false);
		}
	});
},

moveItem(source, destination, callback) {
	$.ajax({
		url: asenhafm.restUrl + 'move',
		method: 'POST',
		data: {
			source: source,
			destination: destination
		},
		beforeSend: (xhr) => {
			xhr.setRequestHeader('X-WP-Nonce', asenhafm.nonce);
		},
		success: (response) => {
			const ok = !!(response && response.success);
			if (callback) callback(ok);
		},
		error: (xhr) => {
			if (callback) callback(false);
		}
	});
},

	renameSelected() {
		if (this.selectedItems.length !== 1) {
			alert(asenhafm.i18n.selectOneToRename);
			return;
		}

			const item = this.selectedItems[0];
			
			// Show modal
			$('#asenha-fm-rename-input').val(item.name);
			this.openModal($('#asenha-fm-rename-modal'));
			$('#asenha-fm-rename-input').focus().select();
		},

	confirmRename() {
		const newName = $('#asenha-fm-rename-input').val().trim();
		const item = this.selectedItems[0];
		
		if (!newName || newName === item.name) {
			this.closeModal($('#asenha-fm-rename-modal'));
			return;
		}

		const oldPath = item.path;
		const newPath = this.currentPath + '/' + newName;
		
		const $confirmBtn = $('#asenha-fm-rename-confirm');
		const $spinner = $('.asenha-fm-rename-spinner');
		const $text = $('.asenha-fm-rename-text');
		const $checkmark = $('.asenha-fm-rename-checkmark');

		$.ajax({
			url: asenhafm.restUrl + 'rename',
			method: 'POST',
			data: {
				old_path: oldPath,
				new_path: newPath
			},
		beforeSend: (xhr) => {
			xhr.setRequestHeader('X-WP-Nonce', asenhafm.nonce);
			// Show spinner and update text
			$confirmBtn.prop('disabled', true);
			$text.text(asenhafm.i18n.renaming);
			$spinner.addClass('is-active').show();
		},
		success: (response) => {
			if (response.success) {
				// Show checkmark
				$spinner.removeClass('is-active').hide();
				$text.text(asenhafm.i18n.renamed);
				$checkmark.show();
				
				// Close modal after a brief delay to show success
				setTimeout(() => {
					this.closeModal($('#asenha-fm-rename-modal'));
					this.refresh();
					// Reset button state for next use
					$confirmBtn.prop('disabled', false);
					$text.text(asenhafm.i18n.rename);
					$checkmark.hide();
				}, 800);
			}
		},
		error: (xhr) => {
			// Reset button state on error
			$confirmBtn.prop('disabled', false);
			$text.text(asenhafm.i18n.rename);
			$spinner.removeClass('is-active').hide();
		}
		});
	},

	deleteSelected() {
		if (this.selectedItems.length === 0) {
			alert(asenhafm.i18n.noItemsSelected);
			return;
		}

		const message = this.selectedItems.length === 1 
			? asenhafm.i18n.confirmDelete
			: asenhafm.i18n.confirmDeleteMulti;

		if (!confirm(message)) {
			return;
		}

	const paths = this.selectedItems.map(item => item.path);
	
	this.showButtonSpinner('#asenha-fm-delete', 'Deleting');

	$.ajax({
		url: asenhafm.restUrl + 'delete',
		method: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({ paths: paths }),
		beforeSend: (xhr) => {
			xhr.setRequestHeader('X-WP-Nonce', asenhafm.nonce);
		},
	success: (response) => {
		if (response.success) {
			this.showButtonCheckmark('#asenha-fm-delete', 'Deleted');
			this.refresh();
		}
	},
	error: (xhr) => {
		this.resetButtonState('#asenha-fm-delete');
	}
});
},

	changePermissions() {
		if (this.selectedItems.length !== 1) {
			alert(asenhafm.i18n.selectOneItem);
			return;
		}

			const item = this.selectedItems[0];
			
			// Clear any previous error message
			$('#asenha-fm-permissions-error').hide().text('');
			
			// Show modal
			$('#asenha-fm-permissions-input').val('755');
			this.openModal($('#asenha-fm-permissions-modal'));
			$('#asenha-fm-permissions-input').focus().select();
		},

		confirmPermissions() {
			const permissions = $('#asenha-fm-permissions-input').val().trim();
			const item = this.selectedItems[0];

			// Clear any previous error message
			$('#asenha-fm-permissions-error').hide().text('');

			if (!permissions || !/^[0-7]{3}$/.test(permissions)) {
				this.showPermissionsError('Invalid permissions format. Please use 3 octal digits (e.g., 755, 644).');
				return;
			}

			$.ajax({
				url: asenhafm.restUrl + 'permissions',
				method: 'POST',
				data: {
					path: item.path,
					permissions: permissions
				},
				beforeSend: (xhr) => {
					xhr.setRequestHeader('X-WP-Nonce', asenhafm.nonce);
				},
			success: (response) => {
				if (response.success) {
					this.closeModal($('#asenha-fm-permissions-modal'));
					this.refresh();
				}
			},
			error: (xhr, textStatus) => {
				// Show error inside modal instead of closing it
				this.showPermissionsError(this.getAjaxErrorMessage(xhr, textStatus));
			}
		});
	},

		/**
		 * Show error message inside the permissions modal
		 */
		showPermissionsError(message) {
			const errorDiv = $('#asenha-fm-permissions-error');
			errorDiv.text(message).show();
		},

	compressSelected() {
		if (this.isWriteRestrictedPath(this.currentPath)) {
			this.notifyWriteRestricted(this.currentPath);
			return;
		}
		if (this.selectedItems.length === 0) {
			alert(asenhafm.i18n.noItemsSelected);
			return;
		}

	const paths = this.selectedItems.map(item => item.path);
	const archiveName = 'archive-' + Date.now() + '.zip';

	this.showButtonSpinner('#asenha-fm-compress', 'Compressing');

	$.ajax({
		url: asenhafm.restUrl + 'compress',
		method: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({
			paths: paths,
			destination: this.currentPath,
			archive_name: archiveName
		}),
		beforeSend: (xhr) => {
			xhr.setRequestHeader('X-WP-Nonce', asenhafm.nonce);
		},
	success: (response) => {
		if (response.success) {
			this.showButtonCheckmark('#asenha-fm-compress', 'Compressed');
			this.refresh();
		}
	},
	error: (xhr) => {
		this.resetButtonState('#asenha-fm-compress');
	}
});
},

extractSelected() {
		if (this.isWriteRestrictedPath(this.currentPath)) {
			this.notifyWriteRestricted(this.currentPath);
			return;
		}
	if (this.selectedItems.length !== 1 || !this.selectedItems[0].path.endsWith('.zip')) {
		alert(asenhafm.i18n.selectSingleZip);
		return;
	}

const archivePath = this.selectedItems[0].path;
	
this.showButtonSpinner('#asenha-fm-extract', 'Extracting');

$.ajax({
		url: asenhafm.restUrl + 'extract',
		method: 'POST',
		data: {
			archive_path: archivePath,
			destination: this.currentPath
		},
		beforeSend: (xhr) => {
			xhr.setRequestHeader('X-WP-Nonce', asenhafm.nonce);
		},
		success: (response) => {
		if (response.success) {
			this.showButtonCheckmark('#asenha-fm-extract', 'Extracted');
			this.refresh();
		}
	},
	error: (xhr) => {
		this.resetButtonState('#asenha-fm-extract');
	}
});
},

	downloadSelected() {
		if (this.selectedItems.length !== 1 || this.selectedItems[0].type !== 'file') {
			alert(asenhafm.i18n.selectSingleFile);
			return;
		}

		const path = this.selectedItems[0].path;
		this.showButtonSpinner('#asenha-fm-download');
		const url = asenhafm.ajaxUrl
			+ '?action=asenha_fm_download'
			+ '&path=' + encodeURIComponent(path)
			+ '&_wpnonce=' + encodeURIComponent(asenhafm.downloadNonce);

		// Trigger download without navigating away from the File Manager UI.
		const a = document.createElement('a');
		a.href = url;
		a.style.display = 'none';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);

		// Browser download completion isn't reliably detectable. Reset after a short delay.
		setTimeout(() => {
			this.resetButtonState('#asenha-fm-download');
		}, 800);
		},

	triggerUpload() {
		if (this.isWriteRestrictedPath(this.currentPath)) {
			this.notifyWriteRestricted(this.currentPath);
			return;
		}
		if (this.isProtectedCoreWriteFolder(this.currentPath)) {
			this.notifyProtectedCoreWriteFolder(this.currentPath);
			return;
		}
		// Show the upload modal instead of file input
		this.openUploadModal();
	},
	
	openUploadModal() {
		$('#asenha-fm-upload-modal').fadeIn(200);
		$('#asenha-fm-upload-dropzone').show();
		$('#asenha-fm-upload-progress').hide();
		$('#asenha-fm-upload-error').hide().text('');
		$('#asenha-fm-upload-progress-fill').css('width', '0%');
		$('body').css('overflow', 'hidden');
	},
	
	closeUploadModal() {
		$('#asenha-fm-upload-modal').fadeOut(200);
		$('#asenha-fm-upload-input').val('');
		$('#asenha-fm-upload-error').hide().text('');
		$('body').css('overflow', '');
	},
	
	handleUploadModalFiles(e) {
		const files = e.target.files;
		if (files.length > 0) {
			// Clear any previous errors
			$('#asenha-fm-upload-error').hide().text('');
			this.uploadFilesFromModal(files);
		}
	},
	
	/**
	 * Show error message inside the upload modal
	 */
	showUploadError(message) {
		const errorDiv = $('#asenha-fm-upload-error');
		errorDiv.text(message).show();
	},
	
	uploadFilesFromModal(files) {
		if (this.isWriteRestrictedPath(this.currentPath)) {
			this.notifyWriteRestricted(this.currentPath);
			return;
		}
		if (this.isProtectedCoreWriteFolder(this.currentPath)) {
			this.notifyProtectedCoreWriteFolder(this.currentPath);
			return;
		}
		// Hide dropzone, show progress, clear errors
		$('#asenha-fm-upload-dropzone').hide();
		$('#asenha-fm-upload-progress').show();
		$('#asenha-fm-upload-error').hide().text('');
		$('#asenha-fm-upload-status').text(asenhafm.i18n.uploadingFiles.replace('%d', files.length));
		
		const formData = new FormData();
		
		// Append files
		for (let i = 0; i < files.length; i++) {
			formData.append('files[]', files[i]);
		}
		
		formData.append('destination', this.currentPath);

		$.ajax({
			url: asenhafm.restUrl + 'upload',
			method: 'POST',
			data: formData,
			processData: false,
			contentType: false,
			xhr: () => {
				const xhr = new window.XMLHttpRequest();
				xhr.upload.addEventListener('progress', (e) => {
					if (e.lengthComputable) {
						const percentComplete = (e.loaded / e.total) * 100;
						$('#asenha-fm-upload-progress-fill').css('width', percentComplete + '%');
					}
				}, false);
				return xhr;
			},
			beforeSend: (xhr) => {
				xhr.setRequestHeader('X-WP-Nonce', asenhafm.nonce);
			},
		success: (response) => {
			if (response.success) {
				// Check if there were any errors with individual files
				if (response.errors && response.errors.length > 0) {
					// Some files uploaded, some failed - show error in modal
					$('#asenha-fm-upload-status').text(asenhafm.i18n.uploadErrors);
					$('#asenha-fm-upload-progress').hide();
					$('#asenha-fm-upload-dropzone').show();
					
					let errorMsg = asenhafm.i18n.uploadErrorsPrefix + '\n\n';
					response.errors.forEach(err => {
						errorMsg += `• ${err.file}: ${err.message}\n\n`;
					});
					
					this.showUploadError(errorMsg);
					this.refresh();
				} else {
					// All files uploaded successfully
					$('#asenha-fm-upload-status').text(asenhafm.i18n.uploadComplete);
					setTimeout(() => {
						this.closeUploadModal();
						this.showSuccess(response.message);
						this.refresh();
					}, 1000);
				}
			} else {
				// Upload failed entirely
				$('#asenha-fm-upload-status').text(asenhafm.i18n.uploadFailed);
				$('#asenha-fm-upload-progress').hide();
				$('#asenha-fm-upload-dropzone').show();
				this.showUploadError(response.message || asenhafm.i18n.uploadFailed);
			}
		},
		error: (xhr, textStatus) => {
			console.error('Upload error:', xhr);
			
			// Show error inside modal instead of closing it
			$('#asenha-fm-upload-status').text(asenhafm.i18n.uploadFailed);
			$('#asenha-fm-upload-progress').hide();
			$('#asenha-fm-upload-dropzone').show();
			
		// Check for detailed error information
		if (xhr.responseJSON?.data?.errors && xhr.responseJSON.data.errors.length > 0) {
			// Build detailed error message
			let errorMsg = asenhafm.i18n.uploadFailedPrefix + '\n\n';
			xhr.responseJSON.data.errors.forEach(err => {
				errorMsg += `• ${err.file}: ${err.message}\n\n`;
			});
			this.showUploadError(errorMsg);
		} else {
			// Fallback to detailed AJAX error
			this.showUploadError(this.getAjaxErrorMessage(xhr, textStatus));
		}
		}
		});
	},

		handleFileUpload(e) {
			const files = e.target.files;
			if (files.length > 0) {
				this.uploadFiles(files);
			}
			// Reset input
			$(e.target).val('');
		},

	uploadFiles(files) {
		if (this.isWriteRestrictedPath(this.currentPath)) {
			this.notifyWriteRestricted(this.currentPath);
			return;
		}
		if (this.isProtectedCoreWriteFolder(this.currentPath)) {
			this.notifyProtectedCoreWriteFolder(this.currentPath);
			return;
		}
		const formData = new FormData();
		
		// Append files with consistent naming that matches REST API expectations
		for (let i = 0; i < files.length; i++) {
			formData.append('files[]', files[i]);
		}
		
		formData.append('destination', this.currentPath);

		$.ajax({
			url: asenhafm.restUrl + 'upload',
			method: 'POST',
			data: formData,
			processData: false,
			contentType: false,
			beforeSend: (xhr) => {
				xhr.setRequestHeader('X-WP-Nonce', asenhafm.nonce);
			},
		success: (response) => {
			if (response.success) {
				// Check if there were any errors with individual files
				if (response.errors && response.errors.length > 0) {
					// Some files uploaded, some failed
					let errorMsg = response.message + '\n\nErrors:\n';
					response.errors.forEach(err => {
						errorMsg += `• ${err.file}: ${err.message}\n`;
					});
					this.showError(errorMsg);
				} else {
					// All files uploaded successfully
					this.showSuccess(response.message);
				}
				this.refresh();
			} else {
				this.showError(response.message || asenhafm.i18n.uploadFailed);
			}
		},
	error: (xhr, textStatus) => {
		console.error('Upload error:', xhr);
		
		// Check for detailed error information
		if (xhr.responseJSON?.data?.errors && xhr.responseJSON.data.errors.length > 0) {
			// Build detailed error message
			let errorMsg = asenhafm.i18n.uploadFailedPrefix + '\n\n';
			xhr.responseJSON.data.errors.forEach(err => {
				errorMsg += `• ${err.file}: ${err.message}\n\n`;
			});
			this.showError(errorMsg);
		} else {
			// Fallback to detailed AJAX error
			this.showError(this.getAjaxErrorMessage(xhr, textStatus));
		}
	}
		});
	},

refresh() {
	// Hide inline message immediately on refresh
	this.hideInlineMessage();
	
	// Load directory first, then reload tree with expansion
	this.loadDirectoryAsync(this.currentPath, false, true)
		.then(() => {
			return this.loadTreeAsync(null, this.currentPath);
		})
		.catch((error) => {
			console.error('Refresh error:', error);
		});
},

	/**
	 * Go to home (root) and reset tree view
	 */
	goHome() {
		// Clear any active tree items
		$('.asenha-fm-tree-item').removeClass('active');
		
		// Load directory first, then reload tree with expansion to root
		this.loadDirectoryAsync(asenhafm.abspath, false, false)
			.then(() => {
				return this.loadTreeAsync(null, asenhafm.abspath);
			})
			.catch((error) => {
				console.error('Go home error:', error);
			});
	},

	/**
	 * Modal management
	 */
	openModal(modal) {
			modal.fadeIn(200);
			$('body').css('overflow', 'hidden');
		},

	closeModal(modal) {
		// Destroy CodeMirror instance and clear messages if closing editor modal
		if (modal.attr('id') === 'asenha-fm-editor-modal') {
			if (typeof window.AsenhafmCodeMirror !== 'undefined') {
				window.AsenhafmCodeMirror.destroy();
			}
			// Clear any success/error messages in the editor modal
			this.hideEditorMessage();
		}
		
		modal.fadeOut(200);
		$('body').css('overflow', '');
	},

	/**
	 * Show success message
	 */
	showSuccess(message) {
		// Use WordPress admin notices - use .text() to prevent XSS
		const notice = $('<div></div>')
			.addClass('notice notice-success is-dismissible')
			.css({
				'display': 'block',
				'margin': '15px 0',
				'padding': '12px',
				'background': '#fff',
				'border-left': '4px solid #00a32a',
				'box-shadow': '0 1px 1px rgba(0,0,0,.04)'
			});
		const messageParagraph = $('<p></p>')
			.text(message)
			.css({
				'margin': '0.5em 0',
				'padding': '2px',
				'font-size': '13px',
				'line-height': '1.5'
			});
		notice.append(messageParagraph);
		
		// Remove any existing success notices first
		$('.asenha-file-manager-wrap .notice-success').remove();
		
		// Add notice and ensure it's visible
		$('.asenha-file-manager-wrap h1').after(notice);
		notice.show();
		
		// Scroll the notice into view
		notice[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		
		setTimeout(() => {
			notice.fadeOut(() => notice.remove());
		}, 3000);
	},

	/**
	 * Show error message
	 */
	showError(message) {
		// Use .text() to prevent XSS
		const notice = $('<div></div>')
			.addClass('notice notice-error is-dismissible')
			.css({
				'display': 'block',
				'margin': '15px 0',
				'padding': '12px',
				'background': '#fff',
				'border-left': '4px solid #d63638',
				'box-shadow': '0 1px 1px rgba(0,0,0,.04)'
			});
		
		// Use pre tag for multi-line messages to preserve formatting
		const messageParagraph = $('<pre></pre>')
			.text(message)
			.css({
				'margin': '0.5em 0',
				'padding': '2px',
				'font-size': '13px',
				'line-height': '1.5',
				'white-space': 'pre-wrap',
				'word-wrap': 'break-word',
				'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
				'background': 'transparent',
				'border': 'none'
			});
		notice.append(messageParagraph);
		
		// Remove any existing error notices first
		$('.asenha-file-manager-wrap .notice-error').remove();
		
		// Add notice and ensure it's visible
		$('.asenha-file-manager-wrap h1').after(notice);
		notice.show();
		
		// Scroll the notice into view
		notice[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		
		setTimeout(() => {
			notice.fadeOut(() => notice.remove());
		}, 7000);
	},

	/**
	 * Navigate back in history
	 */
	navigateBack() {
		if (this.historyIndex > 0) {
			this.historyIndex--;
			const path = this.navigationHistory[this.historyIndex];
			// Load directory first, then reload tree with expansion
			this.loadDirectoryAsync(path, false, true) // Skip adding to history
				.then(() => {
					return this.loadTreeAsync(null, path);
				})
				.then(() => {
					this.updateNavigationButtons();
				})
				.catch((error) => {
					console.error('Navigate back error:', error);
				});
		}
	},

	/**
	 * Navigate forward in history
	 */
	navigateForward() {
		if (this.historyIndex < this.navigationHistory.length - 1) {
			this.historyIndex++;
			const path = this.navigationHistory[this.historyIndex];
			// Load directory first, then reload tree with expansion
			this.loadDirectoryAsync(path, false, true) // Skip adding to history
				.then(() => {
					return this.loadTreeAsync(null, path);
				})
				.then(() => {
					this.updateNavigationButtons();
				})
				.catch((error) => {
					console.error('Navigate forward error:', error);
				});
		}
	},

	/**
	 * Navigate up to parent folder
	 */
	navigateUp() {
		// Only navigate if not at root
		if (this.currentPath !== asenhafm.abspath) {
			const parentPath = this.currentPath.substring(0, this.currentPath.lastIndexOf('/'));
			if (parentPath) {
				// Load directory first, then reload tree with expansion
				this.loadDirectoryAsync(parentPath, false, false)
					.then(() => {
						return this.loadTreeAsync(null, parentPath);
					})
					.catch((error) => {
						console.error('Navigate up error:', error);
					});
			}
		}
	},

	/**
	 * Update navigation button states
	 */
	updateNavigationButtons() {
		// Back button
		if (this.historyIndex > 0) {
			$('#asenha-fm-back').prop('disabled', false);
		} else {
			$('#asenha-fm-back').prop('disabled', true);
		}
		
		// Forward button
		if (this.historyIndex < this.navigationHistory.length - 1) {
			$('#asenha-fm-forward').prop('disabled', false);
		} else {
			$('#asenha-fm-forward').prop('disabled', true);
		}
		
		// Up button - disable only if currently at ABSPATH root
		if (this.currentPath === asenhafm.abspath) {
			$('#asenha-fm-up').prop('disabled', true);
		} else {
			$('#asenha-fm-up').prop('disabled', false);
		}
	}
};

	// Initialize on document ready
	$(document).ready(() => {
		if ($('.asenha-file-manager-wrap').length) {
			// Defensive: prevent double initialization (e.g. script enqueued/executed twice).
			if (window.__asenhaFileManagerInitDone) {
				return;
			}
			window.__asenhaFileManagerInitDone = true;
			FileManager.init();
		}
	});

})(jQuery);

