(function($) {
	'use strict';

	/**
	 * Safe string accessors for localized UI strings.
	 *
	 * @param {string} key
	 * @return {string}
	 */
	var asenhaSbT = function(key) {
		if (typeof asenhaSiteBackup === 'undefined' || !asenhaSiteBackup || !asenhaSiteBackup.strings) {
			return '';
		}
		return (typeof asenhaSiteBackup.strings[key] !== 'undefined') ? String(asenhaSiteBackup.strings[key]) : '';
	};

	/**
	 * Safe sub-progress string accessors.
	 *
	 * @param {string} key
	 * @return {string}
	 */
	var asenhaSbP = function(key) {
		if (typeof asenhaSiteBackup === 'undefined' || !asenhaSiteBackup || !asenhaSiteBackup.subProgress) {
			return '';
		}
		return (typeof asenhaSiteBackup.subProgress[key] !== 'undefined') ? String(asenhaSiteBackup.subProgress[key]) : '';
	};

	/**
	 * Lightweight placeholder formatter for %s and %1$s / %1$d patterns.
	 *
	 * @param {string} tpl
	 * @param {Object<string,string|number>} vars
	 * @return {string}
	 */
	var asenhaSbFmt = function(tpl, vars) {
		tpl = String(tpl || '');
		vars = vars || {};
		Object.keys(vars).forEach(function(k) {
			var v = String(vars[k]);
			tpl = tpl.replace(new RegExp('%' + k + '\\$s', 'g'), v);
			tpl = tpl.replace(new RegExp('%' + k + '\\$d', 'g'), v);
		});
		return tpl;
	};

	/**
	 * Canonical WordPress core DB table short names.
	 *
	 * @type {Array<string>}
	 */
	var asenhaCoreDbTableNames = [
		'commentmeta',
		'comments',
		'links',
		'options',
		'postmeta',
		'posts',
		'termmeta',
		'terms',
		'term_relationships',
		'term_taxonomy',
		'usermeta',
		'users',
		// Multisite / network tables.
		'blogs',
		'blogmeta',
		'site',
		'sitemeta',
		'signups',
		'registration_log',
		'blog_versions'
	];

	/**
	 * Canonical set of WordPress core DB table short names.
	 *
	 * @type {Object<string, boolean>}
	 */
	var asenhaCoreDbTableNameSet = {};
	for (var asenhaCoreTableIndex = 0; asenhaCoreTableIndex < asenhaCoreDbTableNames.length; asenhaCoreTableIndex++) {
		asenhaCoreDbTableNameSet[asenhaCoreDbTableNames[asenhaCoreTableIndex]] = true;
	}

	/**
	 * Determine whether a DB table is an ASE table.
	 *
	 * Rule: table key starts with "asenha_".
	 *
	 * @param {Object} table Table entry { key, full }.
	 * @return {boolean}
	 */
	var asenhaIsDbTableAse = function(table) {
		table = table || {};
		var key = String(table.key || '').toLowerCase();
		if (key && key.indexOf('asenha_') === 0) {
			return true;
		}

		// Fallback when the key contains full table name.
		var full = String(table.full || '').toLowerCase();
		return !!(full && full.indexOf('asenha_') === 0);
	};

	/**
	 * Determine whether a DB table is a core WordPress table.
	 *
	 * @param {Object} table Table entry { key, full }.
	 * @param {string} dbPrefix Current site table prefix.
	 * @param {string} dbBasePrefix Network base table prefix.
	 * @return {boolean}
	 */
	var asenhaIsDbTableCore = function(table, dbPrefix, dbBasePrefix) {
		table = table || {};
		var key = String(table.key || '');
		var full = String(table.full || '');
		var p1 = String(dbPrefix || '');
		var p2 = String(dbBasePrefix || '');
		var prefixes = [];
		var candidates = [];
		var stripped = [];
		var j = 0;

		if (p1) {
			prefixes.push(p1);
		}
		if (p2 && p2 !== p1) {
			prefixes.push(p2);
		}

		if (key) {
			candidates.push(key);
		}
		if (full && full !== key) {
			candidates.push(full);
		}

		for (j = 0; j < candidates.length; j++) {
			var name = String(candidates[j] || '');
			if (!name) {
				continue;
			}
			stripped.push(name);

			for (var k = 0; k < prefixes.length; k++) {
				var pref = prefixes[k];
				if (pref && name.indexOf(pref) === 0) {
					stripped.push(name.substring(pref.length));
				}
			}
		}

		for (var n = 0; n < stripped.length; n++) {
			var tail = String(stripped[n] || '').toLowerCase();
			if (!tail) {
				continue;
			}
			if (asenhaCoreDbTableNameSet[tail]) {
				return true;
			}

			// Multisite blog tables, e.g. wp_3_posts.
			var matched = tail.match(/^(\d+)_(.+)$/);
			if (matched && matched[2] && asenhaCoreDbTableNameSet[matched[2]]) {
				return true;
			}
		}

		return false;
	};

	/**
	 * Normalize a tree path used by wp-content selectors.
	 *
	 * Keeps a trailing slash for directory paths.
	 *
	 * @param {string} path
	 * @return {string}
	 */
	var asenhaNormalizeTreePath = function(path) {
		path = String(path || '');
		if (!path) {
			return '';
		}

		var hasTrailingSlash = /\/$/.test(path);
		path = path.replace(/\\/g, '/');
		path = path.replace(/^\/+/, '');
		path = path.replace(/\/+/g, '/');
		path = path.replace(/\/+$/, '');

		if (!path) {
			return '';
		}

		if (hasTrailingSlash) {
			path += '/';
		}

		return path;
	};

	/**
	 * Normalize and dedupe path selections while preserving order.
	 *
	 * @param {Array<string>} paths
	 * @return {Array<string>}
	 */
	var asenhaNormalizeTreeSelection = function(paths) {
		var normalized = [];
		var seen = {};

		paths = Array.isArray(paths) ? paths : [];
		for (var i = 0; i < paths.length; i++) {
			var p = asenhaNormalizeTreePath(paths[i]);
			if (!p || seen[p]) {
				continue;
			}
			seen[p] = true;
			normalized.push(p);
		}

		return normalized;
	};

	/**
	 * Build a map for quick selected-path lookups.
	 *
	 * @param {Array<string>} paths
	 * @return {Object<string, boolean>}
	 */
	var asenhaTreeSelectionToSet = function(paths) {
		var set = {};
		paths = asenhaNormalizeTreeSelection(paths);
		for (var i = 0; i < paths.length; i++) {
			set[paths[i]] = true;
		}
		return set;
	};

	/**
	 * Check whether a path is selected directly or via selected ancestor directory.
	 *
	 * @param {string} path
	 * @param {Object<string, boolean>} selectedSet
	 * @return {boolean}
	 */
	var asenhaIsTreePathSelected = function(path, selectedSet) {
		path = asenhaNormalizeTreePath(path);
		if (!path) {
			return false;
		}

		if (selectedSet[path]) {
			return true;
		}

		var probe = path;
		if ('/' === probe.slice(-1)) {
			probe = probe.slice(0, -1);
		}

		var idx = probe.lastIndexOf('/');
		while (idx !== -1) {
			var parent = probe.substring(0, idx);
			if (!parent) {
				break;
			}
			if (selectedSet[parent + '/']) {
				return true;
			}
			probe = parent;
			idx = probe.lastIndexOf('/');
		}

		return false;
	};

	/**
	 * Find the nearest selected ancestor directory for a given path.
	 *
	 * @param {string} path
	 * @param {Object<string, boolean>} selectedSet
	 * @return {string}
	 */
	var asenhaFindNearestSelectedAncestorDir = function(path, selectedSet) {
		path = asenhaNormalizeTreePath(path);
		if (!path) {
			return '';
		}

		var probe = path;
		if ('/' === probe.slice(-1)) {
			probe = probe.slice(0, -1);
		}

		var idx = probe.lastIndexOf('/');
		while (idx !== -1) {
			var parent = probe.substring(0, idx);
			if (!parent) {
				break;
			}
			var candidate = parent + '/';
			if (selectedSet[candidate]) {
				return candidate;
			}
			probe = parent;
			idx = probe.lastIndexOf('/');
		}

		return '';
	};

	/**
	 * Remove a selected path, and for directories remove the entire subtree.
	 *
	 * @param {Array<string>} selectedPaths
	 * @param {string} path
	 * @return {Array<string>}
	 */
	var asenhaRemoveTreePathAndDescendants = function(selectedPaths, path) {
		path = asenhaNormalizeTreePath(path);
		selectedPaths = asenhaNormalizeTreeSelection(selectedPaths);

		if (!path) {
			return selectedPaths;
		}

		var isDir = ('/' === path.slice(-1));
		return selectedPaths.filter(function(item) {
			item = asenhaNormalizeTreePath(item);
			if (!item) {
				return false;
			}
			if (item === path) {
				return false;
			}
			if (isDir && item.indexOf(path) === 0) {
				return false;
			}
			return true;
		});
	};

	/**
	 * Get ancestor directory paths from nearest to farthest.
	 *
	 * @param {string} path
	 * @return {Array<string>}
	 */
	var asenhaGetAncestorDirPaths = function(path) {
		path = asenhaNormalizeTreePath(path);
		if (!path) {
			return [];
		}

		var ancestors = [];
		var probe = path;
		if ('/' === probe.slice(-1)) {
			probe = probe.slice(0, -1);
		}

		var idx = probe.lastIndexOf('/');
		while (idx !== -1) {
			var parent = probe.substring(0, idx);
			if (!parent) {
				break;
			}
			ancestors.push(parent + '/');
			probe = parent;
			idx = probe.lastIndexOf('/');
		}

		return ancestors;
	};

	/**
	 * Get loaded direct child checkbox metadata for a directory node.
	 *
	 * @param {jQuery} $treeRoot
	 * @param {string} dirPath Directory path with trailing slash.
	 * @param {string} checkboxSelector
	 * @return {Array<{path:string,disabled:boolean}>}
	 */
	var asenhaGetLoadedDirectChildCheckboxMeta = function($treeRoot, dirPath, checkboxSelector) {
		var out = [];
		dirPath = asenhaNormalizeTreePath(dirPath);
		if (!dirPath || !$treeRoot || !$treeRoot.length) {
			return out;
		}

		var dirRel = dirPath.replace(/\/+$/, '');
		var $dirLi = $();
		$treeRoot.find('.asenha-tree-item[data-type="dir"]').each(function() {
			var $li = $(this);
			if (String($li.data('rel') || '') === dirRel) {
				$dirLi = $li;
				return false;
			}
		});
		if (!$dirLi.length) {
			return out;
		}

		var childSelector = '> .asenha-tree-children > ul.asenha-tree > li.asenha-tree-item > .asenha-tree-row ' + checkboxSelector;
		$dirLi.find(childSelector).each(function() {
			var $cb = $(this);
			var p = asenhaNormalizeTreePath(String($cb.data('store-path') || ''));
			if (!p) {
				return;
			}
			out.push({
				path: p,
				disabled: $cb.is(':disabled')
			});
		});

		return out;
	};

	/**
	 * Promote loaded ancestor directories when all direct children are selected.
	 *
	 * @param {Array<string>} selectedPaths
	 * @param {string} toggledPath
	 * @param {jQuery} $treeRoot
	 * @param {string} checkboxSelector
	 * @return {Array<string>}
	 */
	var asenhaPromoteLoadedAncestorsWhenDirectChildrenSelected = function(selectedPaths, toggledPath, $treeRoot, checkboxSelector) {
		selectedPaths = asenhaNormalizeTreeSelection(selectedPaths);
		if (!$treeRoot || !$treeRoot.length) {
			return selectedPaths;
		}

		var ancestors = asenhaGetAncestorDirPaths(toggledPath);
		if (!ancestors.length) {
			return selectedPaths;
		}

		var set = asenhaTreeSelectionToSet(selectedPaths);
		for (var i = 0; i < ancestors.length; i++) {
			var dirPath = ancestors[i];
			var childrenMeta = asenhaGetLoadedDirectChildCheckboxMeta($treeRoot, dirPath, checkboxSelector);
			if (!childrenMeta.length) {
				continue;
			}

			var relevantCount = 0;
			var allRelevantChecked = true;
			for (var j = 0; j < childrenMeta.length; j++) {
				var child = childrenMeta[j];
				var childSelected = asenhaIsTreePathSelected(child.path, set);

				// Ignore non-selectable unchecked children (e.g. always excluded).
				if (child.disabled && !childSelected) {
					continue;
				}

				relevantCount++;
				if (!childSelected) {
					allRelevantChecked = false;
					break;
				}
			}

			if (relevantCount > 0 && allRelevantChecked) {
				selectedPaths = asenhaRemoveTreePathAndDescendants(selectedPaths, dirPath);
				selectedPaths.push(dirPath);
				selectedPaths = asenhaNormalizeTreeSelection(selectedPaths);
				set = asenhaTreeSelectionToSet(selectedPaths);
			}
		}

		return selectedPaths;
	};

	/**
	 * Check direct-child selected state within a specific ancestor context.
	 *
	 * Unlike ancestor-inherited checks, this only considers explicit selections
	 * on the direct child itself (files) or explicit selections in the child's
	 * subtree (directories). This prevents higher ancestors from masking a
	 * middle-parent demotion decision.
	 *
	 * @param {string} childPath Direct child path.
	 * @param {string} ancestorPath Ancestor directory path.
	 * @param {Array<string>} selectedPaths Normalized selected paths list.
	 * @param {Object<string, boolean>} selectedSet Selected-path lookup map.
	 * @return {boolean}
	 */
	var asenhaIsDirectChildSelectedInAncestorContext = function(childPath, ancestorPath, selectedPaths, selectedSet) {
		childPath = asenhaNormalizeTreePath(childPath);
		ancestorPath = asenhaNormalizeTreePath(ancestorPath);
		selectedPaths = asenhaNormalizeTreeSelection(selectedPaths);
		selectedSet = selectedSet || {};

		if (!childPath || !ancestorPath || childPath.indexOf(ancestorPath) !== 0) {
			return false;
		}

		// File children must be explicitly selected.
		if ('/' !== childPath.slice(-1)) {
			return !!selectedSet[childPath];
		}

		// Directory children are selected if the directory itself or any descendant
		// path in the subtree is explicitly selected.
		if (selectedSet[childPath]) {
			return true;
		}

		for (var i = 0; i < selectedPaths.length; i++) {
			var p = asenhaNormalizeTreePath(selectedPaths[i]);
			if (p && p.indexOf(childPath) === 0) {
				return true;
			}
		}

		return false;
	};

	/**
	 * Demote loaded ancestor directories when no relevant direct children are selected.
	 *
	 * Relevant children mirror the auto-check rules:
	 * - disabled + unchecked children are ignored
	 * - otherwise children are relevant
	 *
	 * @param {Array<string>} selectedPaths
	 * @param {string} toggledPath
	 * @param {jQuery} $treeRoot
	 * @param {string} checkboxSelector
	 * @return {Array<string>}
	 */
	var asenhaDemoteLoadedAncestorsWhenNoRelevantChildrenSelected = function(selectedPaths, toggledPath, $treeRoot, checkboxSelector) {
		selectedPaths = asenhaNormalizeTreeSelection(selectedPaths);
		if (!$treeRoot || !$treeRoot.length) {
			return selectedPaths;
		}

		var ancestors = asenhaGetAncestorDirPaths(toggledPath);
		if (!ancestors.length) {
			return selectedPaths;
		}

		var set = asenhaTreeSelectionToSet(selectedPaths);
		for (var i = 0; i < ancestors.length; i++) {
			var dirPath = ancestors[i];
			var childrenMeta = asenhaGetLoadedDirectChildCheckboxMeta($treeRoot, dirPath, checkboxSelector);
			if (!childrenMeta.length) {
				continue;
			}

			var relevantCount = 0;
			var relevantCheckedCount = 0;
			for (var j = 0; j < childrenMeta.length; j++) {
				var child = childrenMeta[j];
				var childSelected = asenhaIsDirectChildSelectedInAncestorContext(child.path, dirPath, selectedPaths, set);

				// Ignore non-selectable unchecked children (e.g. always excluded).
				if (child.disabled && !childSelected) {
					continue;
				}

				relevantCount++;
				if (childSelected) {
					relevantCheckedCount++;
				}
			}

			if (relevantCount > 0 && relevantCheckedCount === 0) {
				selectedPaths = selectedPaths.filter(function(item) {
					return item !== dirPath;
				});
				selectedPaths = asenhaNormalizeTreeSelection(selectedPaths);
				set = asenhaTreeSelectionToSet(selectedPaths);
			}
		}

		return selectedPaths;
	};

	/**
	 * Promote currently-loaded checked descendants to explicit selections.
	 *
	 * Used when unchecking an inherited child under a selected parent folder.
	 *
	 * @param {Array<string>} selectedPaths
	 * @param {string} ancestorPath
	 * @param {string} excludedPath
	 * @param {jQuery} $treeRoot
	 * @param {string} checkboxSelector
	 * @return {Array<string>}
	 */
	var asenhaPromoteLoadedCheckedDescendants = function(selectedPaths, ancestorPath, excludedPath, $treeRoot, checkboxSelector) {
		selectedPaths = asenhaNormalizeTreeSelection(selectedPaths);
		ancestorPath = asenhaNormalizeTreePath(ancestorPath);
		excludedPath = asenhaNormalizeTreePath(excludedPath);

		if (!ancestorPath || !$treeRoot || !$treeRoot.length) {
			return selectedPaths;
		}

		var additions = [];
		$treeRoot.find(checkboxSelector).each(function() {
			var $cb = $(this);
			if (!$cb.is(':checked')) {
				return;
			}

			var nodePath = asenhaNormalizeTreePath(String($cb.data('store-path') || ''));
			if (!nodePath || nodePath === ancestorPath || nodePath.indexOf(ancestorPath) !== 0) {
				return;
			}

			if (excludedPath) {
				var excludedIsDir = ('/' === excludedPath.slice(-1));
				if (nodePath === excludedPath) {
					return;
				}
				if (excludedIsDir && nodePath.indexOf(excludedPath) === 0) {
					return;
				}
			}

			additions.push(nodePath);
		});

		return asenhaNormalizeTreeSelection(selectedPaths.concat(additions));
	};

	/**
	 * Collect checked descendants for a directory path from currently loaded tree nodes.
	 *
	 * @param {string} dirPath
	 * @param {jQuery} $treeRoot
	 * @param {string} checkboxSelector
	 * @param {{disabledOnly?: boolean}} options
	 * @return {Array<string>}
	 */
	var asenhaCollectCheckedDescendantPaths = function(dirPath, $treeRoot, checkboxSelector, options) {
		var collected = [];
		options = options || {};
		dirPath = asenhaNormalizeTreePath(dirPath);
		if (!dirPath || !$treeRoot || !$treeRoot.length) {
			return collected;
		}

		var disabledOnly = !!options.disabledOnly;
		$treeRoot.find(checkboxSelector).each(function() {
			var $cb = $(this);
			if (!$cb.is(':checked')) {
				return;
			}
			if (disabledOnly && !$cb.is(':disabled')) {
				return;
			}

			var nodePath = asenhaNormalizeTreePath(String($cb.data('store-path') || ''));
			if (!nodePath || nodePath === dirPath) {
				return;
			}
			if (nodePath.indexOf(dirPath) !== 0) {
				return;
			}

			collected.push(nodePath);
		});

		return asenhaNormalizeTreeSelection(collected);
	};

	/**
	 * Apply recursive tree toggle semantics to the selected path list.
	 *
	 * @param {Array<string>} selectedPaths
	 * @param {string} toggledPath
	 * @param {boolean} isChecked
	 * @param {jQuery} $treeRoot
	 * @param {string} checkboxSelector
	 * @param {{preserveDisabledCheckedDescendantsOnDirectDirUncheck?: boolean}} options
	 * @return {Array<string>}
	 */
	var asenhaApplyTreeToggleSelection = function(selectedPaths, toggledPath, isChecked, $treeRoot, checkboxSelector, options) {
		selectedPaths = asenhaNormalizeTreeSelection(selectedPaths);
		options = options || {};
		toggledPath = asenhaNormalizeTreePath(toggledPath);
		if (!toggledPath) {
			return selectedPaths;
		}

		if (isChecked) {
			selectedPaths = asenhaRemoveTreePathAndDescendants(selectedPaths, toggledPath);
			selectedPaths.push(toggledPath);
			selectedPaths = asenhaPromoteLoadedAncestorsWhenDirectChildrenSelected(selectedPaths, toggledPath, $treeRoot, checkboxSelector);
			return asenhaNormalizeTreeSelection(selectedPaths);
		}

		var selectedSet = asenhaTreeSelectionToSet(selectedPaths);

		// Directly selected path: remove this path (and subtree if directory).
		if (selectedSet[toggledPath]) {
			if ('/' === toggledPath.slice(-1) && options.preserveDisabledCheckedDescendantsOnDirectDirUncheck) {
				var preservedDisabledDescendants = asenhaCollectCheckedDescendantPaths(
					toggledPath,
					$treeRoot,
					checkboxSelector,
					{ disabledOnly: true }
				);
				selectedPaths = asenhaRemoveTreePathAndDescendants(selectedPaths, toggledPath);
				selectedPaths = asenhaNormalizeTreeSelection(selectedPaths.concat(preservedDisabledDescendants));
				selectedPaths = asenhaDemoteLoadedAncestorsWhenNoRelevantChildrenSelected(selectedPaths, toggledPath, $treeRoot, checkboxSelector);
				return selectedPaths;
			}

			selectedPaths = asenhaRemoveTreePathAndDescendants(selectedPaths, toggledPath);
			selectedPaths = asenhaDemoteLoadedAncestorsWhenNoRelevantChildrenSelected(selectedPaths, toggledPath, $treeRoot, checkboxSelector);
			return selectedPaths;
		}

		// Inherited selection: remove selected ancestor, keep loaded checked siblings explicit.
		var ancestor = asenhaFindNearestSelectedAncestorDir(toggledPath, selectedSet);
		if (!ancestor) {
			return asenhaRemoveTreePathAndDescendants(selectedPaths, toggledPath);
		}

		selectedPaths = selectedPaths.filter(function(item) {
			return item !== ancestor;
		});
		selectedPaths = asenhaRemoveTreePathAndDescendants(selectedPaths, toggledPath);
		selectedPaths = asenhaPromoteLoadedCheckedDescendants(selectedPaths, ancestor, toggledPath, $treeRoot, checkboxSelector);
		selectedPaths = asenhaDemoteLoadedAncestorsWhenNoRelevantChildrenSelected(selectedPaths, toggledPath, $treeRoot, checkboxSelector);

		return asenhaNormalizeTreeSelection(selectedPaths);
	};

	var SiteBackup = {
		currentBackupId: null,
		currentRestoreId: null,
		currentMigrationId: null,
		currentMigrationFilename: null,
		currentMigrationPublicProgressUrl: null,
		currentImportUrlTransferId: null,
		currentImportUrlTransferContext: null,
		importUrlTransferInterval: null,
		currentTransferId: null,
		currentTransferMigrationId: null,
		currentTransferMigrationPublicProgressUrl: null,
		currentTransferPublicProgressUrl: null,
		progressInterval: null,
		timeInterval: null,
		startTime: null,
		currentBackupType: null,
		currentRestoreOptions: null,
		currentRestoreButton: null,
		currentRestorePassphraseRequired: false,
		currentRestoreHadPassphrase: false,
		currentMigrationComponents: null,
		transferKeyExpiryInterval: null,
		multipartDownloadToggleListener: null,
		liveClockInterval: null,
		liveClockServerEpochMs: null,
		liveClockClientEpochMs: null,

		/** @const {string} localStorage key for Storage tab Backup Archives sort mode. */
		storageOriginsSortStorageKey: 'asenha_site_backup_storage_origins_sort',

		// Backup Templates state.
		templatesCache: [],
		policiesCache: [],
		policyTemplatesByType: {},
		policyEstimateXhr: null,
		policyEstimateTimer: null,
		policyFirstRunXhr: null,
		policyFirstRunTimer: null,
		templatesIncludedState: {
			dbTotalTables: null,
			scanByTemplate: {},
			wpContentTotals: null,
			scanXhr: null,
			dbXhr: null,
			scanToken: 0
		},

		/**
		 * Initialize Storage tab UI (storage site).
		 *
		 * @since 8.7.0
		 */
		initStorageUi: function() {
			if (!$('#asenha-storage-tab').length) {
				return;
			}

			// Storage tab events.
			$(document).on('click', '#asenha-storage-show-add-origin', this.onStorageShowAddOrigin.bind(this));
			$(document).on('click', '#asenha-storage-add-origin-cancel', this.onStorageCancelAddOrigin.bind(this));
			$(document).on('click', '#asenha-storage-add-origin-submit', this.onStorageAddOrigin.bind(this));
			$(document).on('click', '.asenha-storage-origin-manage-secret', this.onStorageToggleSecretPanel.bind(this));
			$(document).on('click', '.asenha-storage-origin-regenerate', this.onStorageRegenerateOriginKey.bind(this));
			$(document).on('click', '.asenha-storage-delete-archive', this.onStorageDeleteArchive.bind(this));
			$(document).on('click', '.asenha-storage-origin-delete-storage', this.onStorageDeleteOrigin.bind(this));
			$(document).on('click', '.asenha-storage-origin-archives-toggle', this.onStorageToggleArchivesPanel.bind(this));
			$(document).on('click', '#asenha-storage-expand-all-archives', this.onStorageExpandCollapseAllArchives.bind(this));
			$(document).on('change', '#asenha-storage-origins-sort', this.onStorageOriginsSortChange.bind(this));
			this.initStorageOriginsSortFromStorage();
			this.syncStorageExpandAllArchivesButton();
		},

		/**
		 * Toggle visibility of a storage origin's backup archives panel.
		 *
		 * @param {jQuery.Event} e Click event.
		 * @return {void}
		 */
		onStorageToggleArchivesPanel: function(e) {
			e.preventDefault();

			var $btn = $(e.currentTarget);
			var panelId = String($btn.attr('aria-controls') || '').trim();
			if (!panelId) {
				return;
			}

			var el = document.getElementById(panelId);
			if (!el) {
				return;
			}

			var isHidden = el.hasAttribute('hidden');
			if (isHidden) {
				el.removeAttribute('hidden');
				$btn.attr('aria-expanded', 'true');
			} else {
				el.setAttribute('hidden', 'hidden');
				$btn.attr('aria-expanded', 'false');
			}

			this.syncStorageExpandAllArchivesButton();
		},

		/**
		 * Expand or collapse every storage origin archives panel from the global heading control.
		 *
		 * @param {jQuery.Event} e Click event.
		 * @return {void}
		 */
		onStorageExpandCollapseAllArchives: function(e) {
			e.preventDefault();

			var $btn = $('#asenha-storage-expand-all-archives');
			if (!$btn.length || $btn.prop('disabled')) {
				return;
			}

			var collapse = ($btn.attr('aria-expanded') === 'true');

			$('#asenha-storage-origins-list .asenha-storage-origin').each(function() {
				var $origin = $(this);
				var $panel = $origin.find('.asenha-storage-origin-archives-panel').first();
				var $toggle = $origin.find('.asenha-storage-origin-archives-toggle').first();
				var panelEl = $panel.length ? $panel[0] : null;
				if (!panelEl) {
					return;
				}
				if (collapse) {
					panelEl.setAttribute('hidden', 'hidden');
					if ($toggle.length) {
						$toggle.attr('aria-expanded', 'false');
					}
				} else {
					panelEl.removeAttribute('hidden');
					if ($toggle.length) {
						$toggle.attr('aria-expanded', 'true');
					}
				}
			});

			this.syncStorageExpandAllArchivesButton();
		},

		/**
		 * Sync global Expand/Collapse All button label and state with per-site archive panels.
		 *
		 * @return {void}
		 */
		syncStorageExpandAllArchivesButton: function() {
			var $btn = $('#asenha-storage-expand-all-archives');
			if (!$btn.length) {
				return;
			}

			var $list = $('#asenha-storage-origins-list');
			var $origins = $list.children('.asenha-storage-origin');
			var expandLabel = asenhaSbT('storageExpandAllArchives') || 'Expand All Archives';
			var collapseLabel = asenhaSbT('storageCollapseAllArchives') || 'Collapse All Archives';

			var $sort = $('#asenha-storage-origins-sort');
			if (!$origins.length) {
				$btn.prop('disabled', true).attr('aria-expanded', 'false').text(expandLabel);
				if ($sort.length) {
					$sort.prop('disabled', true);
				}
				return;
			}

			if ($sort.length) {
				$sort.prop('disabled', false);
			}

			$btn.prop('disabled', false);

			var allExpanded = true;
			$origins.each(function() {
				var $panel = $(this).find('.asenha-storage-origin-archives-panel').first();
				var panelEl = $panel.length ? $panel[0] : null;
				if (!panelEl || panelEl.hasAttribute('hidden')) {
					allExpanded = false;
					return false;
				}
			});

			if (allExpanded) {
				$btn.attr('aria-expanded', 'true').text(collapseLabel);
			} else {
				$btn.attr('aria-expanded', 'false').text(expandLabel);
			}
		},

		onStorageToggleSecretPanel: function(e) {
			e.preventDefault();

			var $link = $(e.currentTarget);
			var $origin = $link.closest('.asenha-storage-origin');
			var $panel = $origin.find('.asenha-storage-secret-panel').first();
			if (!$panel.length) {
				return;
			}

			var isOpen = $panel.hasClass('is-open');
			$panel.toggleClass('is-open', !isOpen);
			$link.attr('aria-expanded', (!isOpen) ? 'true' : 'false');

			if (!isOpen) {
				$panel.find('input.asenha-storage-origin-secret').trigger('focus');
			}
		},

		onStorageShowAddOrigin: function(e) {
			e.preventDefault();
			$('#asenha-storage-add-origin-form').show();
			$('#asenha-storage-origin-site-url').trigger('focus');
		},

		onStorageCancelAddOrigin: function(e) {
			e.preventDefault();
			$('#asenha-storage-origin-site-url').val('');
			$('#asenha-storage-add-origin-form').hide();
		},

		onStorageAddOrigin: function(e) {
			e.preventDefault();

			var self = this;
			var url = String($('#asenha-storage-origin-site-url').val() || '').trim();
			if (!url) {
				self.showNotice('error', asenhaSbT('storageOriginUrlRequired'));
				return;
			}

			var $spinner = $('#asenha-storage-add-origin-spinner');
			if ($spinner.length) { $spinner.show(); }
			$('#asenha-storage-add-origin-submit').prop('disabled', true);

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_storage_add_origin',
					nonce: asenhaSiteBackup.nonce,
					origin_site_url: url
				}
			}).done(function(resp) {
				if ($spinner.length) { $spinner.hide(); }
				$('#asenha-storage-add-origin-submit').prop('disabled', false);

				if (!resp || !resp.success) {
					self.showNotice('error', (resp && resp.data && resp.data.message) ? resp.data.message : asenhaSbT('storageOriginAddFailed'));
					return;
				}

				var origin = (resp && resp.data && resp.data.origin) ? resp.data.origin : null;
				if (!origin || !origin.origin_id || !origin.origin_site_url) {
					self.showNotice('error', asenhaSbT('storageOriginAddFailed'));
					return;
				}

				self.appendStorageOriginToList(origin);

				$('#asenha-storage-origin-site-url').val('');
				$('#asenha-storage-add-origin-form').hide();

				self.showNotice('success', asenhaSbT('storageOriginAdded'));
			}).fail(function() {
				if ($spinner.length) { $spinner.hide(); }
				$('#asenha-storage-add-origin-submit').prop('disabled', false);
				self.showNotice('error', asenhaSbT('storageOriginAddFailed'));
			});
		},

		onStorageRegenerateOriginKey: function(e) {
			e.preventDefault();

			var self = this;
			var $btn = $(e.currentTarget);
			var originId = String($btn.data('originId') || '');
			if (!originId) {
				return;
			}

			var $origin = $btn.closest('.asenha-storage-origin');
			var $spinner = $origin.find('.asenha-storage-origin-spinner');
			if ($spinner.length) { $spinner.show(); }
			$btn.prop('disabled', true);

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_storage_regenerate_origin_key',
					nonce: asenhaSiteBackup.nonce,
					origin_id: originId
				}
			}).done(function(resp) {
				if ($spinner.length) { $spinner.hide(); }
				$btn.prop('disabled', false);

				if (!resp || !resp.success) {
					self.showNotice('error', (resp && resp.data && resp.data.message) ? resp.data.message : asenhaSbT('storageOriginKeyRegenFailed'));
					return;
				}

				var secret = (resp && resp.data && resp.data.secret_key) ? String(resp.data.secret_key) : '';
				if (!secret) {
					self.showNotice('error', asenhaSbT('storageOriginKeyRegenFailed'));
					return;
				}

				$origin.find('input.asenha-storage-origin-secret').val(secret);
				self.showNotice('success', asenhaSbT('storageOriginKeyRegenerated'));
			}).fail(function() {
				if ($spinner.length) { $spinner.hide(); }
				$btn.prop('disabled', false);
				self.showNotice('error', asenhaSbT('storageOriginKeyRegenFailed'));
			});
		},

		onStorageDeleteArchive: function(e) {
			e.preventDefault();

			var self = this;
			var $btn = $(e.currentTarget);
			var originId = String($btn.attr('data-origin-id') || '');
			if (!originId) {
				originId = String($btn.data('originId') || '');
			}
			originId = String(originId || '').trim();

			var filename = String($btn.attr('data-filename') || '');
			if (!filename) {
				filename = String($btn.data('filename') || '');
			}
			filename = String(filename || '').trim();
			if (!originId || !filename) {
				return;
			}

			var confirmMsg = (asenhaSiteBackup.strings && asenhaSiteBackup.strings.confirmStorageDeleteArchive)
				? String(asenhaSiteBackup.strings.confirmStorageDeleteArchive)
				: '';
			if (!confirm(confirmMsg)) {
				return;
			}

			$btn.prop('disabled', true);

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_storage_delete_archive',
					nonce: asenhaSiteBackup.nonce,
					origin_id: originId,
					filename: filename
				}
			}).done(function(resp) {
				$btn.prop('disabled', false);

				if (!resp || !resp.success) {
					self.showNotice('error', (resp && resp.data && resp.data.message) ? resp.data.message : asenhaSbT('failedToDeleteArchive'));
					return;
				}

				var deletedFilenames = (resp && resp.data && resp.data.deleted_filenames && $.isArray(resp.data.deleted_filenames))
					? resp.data.deleted_filenames
					: [filename];

				var unique = {};
				var list = [];
				for (var i = 0; i < deletedFilenames.length; i++) {
					var fn = String(deletedFilenames[i] || '').trim();
					if (!fn || unique[fn]) {
						continue;
					}
					unique[fn] = true;
					list.push(fn);
				}
				if (list.length === 0) {
					list = [String(filename)];
					unique[String(filename)] = true;
				}
				// Ensure clicked filename is included.
				if (filename && !unique[String(filename)]) {
					list.push(String(filename));
					unique[String(filename)] = true;
				}

				var $scope = $btn.closest('.asenha-storage-origin');
				for (var j = 0; j < list.length; j++) {
					var fn2 = list[j];
					var $rows = ($scope.length)
						? $scope.find('tr[data-origin-id="' + self.escapeAttr(originId) + '"][data-filename="' + self.escapeAttr(fn2) + '"]')
						: $('tr[data-origin-id="' + self.escapeAttr(originId) + '"][data-filename="' + self.escapeAttr(fn2) + '"]');
					$rows.each(function() {
						var $r = $(this);
						if ($r.hasClass('asenha-chain-base-row')) {
							$r.next('tr.asenha-chain-incrementals-row-storage').remove();
						}
						$r.remove();
					});
				}

				// Remove any now-empty expansion rows.
				var $outerRows = ($scope.length) ? $scope.find('tr.asenha-chain-incrementals-row-storage') : $('tr.asenha-chain-incrementals-row-storage');
				$outerRows.each(function() {
					var $outer = $(this);
					var remaining = $outer.find('table.asenha-chain-incrementals-table-storage tbody tr').length;
					if (!remaining) {
						$outer.remove();
					} else {
						self.updateIncrementalsSummary($outer);
					}
				});

				self.updateStorageOriginArchiveTotalsFromTable($scope);
				self.updateStorageArchivesGrandTotalFromOrigins();
				self.updateStorageOriginArchivesSummary($scope);
				var sortModeAfterDelete = self.getStorageOriginsSortMode();
				if (sortModeAfterDelete === 'total_size' || sortModeAfterDelete === 'recency') {
					self.applyStorageOriginsListSort();
				}

				self.showNotice('success', asenhaSbT('storageArchiveDeleted'));
			}).fail(function() {
				$btn.prop('disabled', false);
				self.showNotice('error', asenhaSbT('failedToDeleteArchive'));
			});
		},

		onStorageDeleteOrigin: function(e) {
			e.preventDefault();

			var self = this;
			var $btn = $(e.currentTarget);
			var originId = String($btn.data('originId') || '');
			if (!originId) {
				return;
			}
			if ($btn.hasClass('is-disabled') || String($btn.attr('aria-disabled') || '') === 'true') {
				return;
			}

			var $origin = $btn.closest('.asenha-storage-origin');
			var hasRows = ($origin.find('.asenha-storage-archives-table > tbody > tr').length > 0);
			if (hasRows) {
				var blockedMsg = (asenhaSiteBackup.strings && asenhaSiteBackup.strings.storageDeleteOriginBlocked)
					? String(asenhaSiteBackup.strings.storageDeleteOriginBlocked)
					: '';
				alert(blockedMsg);
				return;
			}

			var confirmMsg = (asenhaSiteBackup.strings && asenhaSiteBackup.strings.confirmStorageDeleteOrigin)
				? String(asenhaSiteBackup.strings.confirmStorageDeleteOrigin)
				: '';
			if (!confirm(confirmMsg)) {
				return;
			}

			$btn.addClass('is-disabled').attr('aria-disabled', 'true');

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_storage_delete_origin',
					nonce: asenhaSiteBackup.nonce,
					origin_id: originId
				}
			}).done(function(resp) {
				if (!resp || !resp.success) {
					$btn.removeClass('is-disabled').attr('aria-disabled', 'false');
					self.showNotice('error', (resp && resp.data && resp.data.message) ? resp.data.message : asenhaSbT('failedToDeleteOriginSite'));
					return;
				}

				if ($origin.length) {
					$origin.remove();
				}
				self.updateStorageArchivesGrandTotalFromOrigins();
				var sortModeAfterOriginDelete = self.getStorageOriginsSortMode();
				if (sortModeAfterOriginDelete === 'total_size' || sortModeAfterOriginDelete === 'recency') {
					self.applyStorageOriginsListSort();
				}
				self.syncStorageExpandAllArchivesButton();
				self.showNotice('success', asenhaSbT('storageOriginDeleted'));
			}).fail(function() {
				$btn.removeClass('is-disabled').attr('aria-disabled', 'false');
				self.showNotice('error', asenhaSbT('failedToDeleteOriginSite'));
			});
		},

		/**
		 * Current Storage origins sort mode from the select.
		 *
		 * @return {string} 'site_name'|'total_size'|'recency'
		 */
		getStorageOriginsSortMode: function() {
			var $sel = $('#asenha-storage-origins-sort');
			if (!$sel.length) {
				return 'site_name';
			}
			var v = String($sel.val() || '');
			if (v === 'total_size') {
				return 'total_size';
			}
			if (v === 'recency') {
				return 'recency';
			}
			return 'site_name';
		},

		/**
		 * Set the sort select value from localStorage when the control is enabled.
		 *
		 * @return {void}
		 */
		applyStorageOriginsSortSelectFromLocalStorage: function() {
			var $sel = $('#asenha-storage-origins-sort');
			if (!$sel.length || $sel.prop('disabled')) {
				return;
			}
			try {
				var v = window.localStorage.getItem(this.storageOriginsSortStorageKey);
				if (v === 'site_name' || v === 'total_size' || v === 'recency') {
					$sel.val(v);
				}
			} catch (err) { // eslint-disable-line no-unused-vars
				// Private mode or storage blocked.
			}
		},

		/**
		 * Apply saved sort mode from localStorage to the select, then sort the list.
		 *
		 * @return {void}
		 */
		initStorageOriginsSortFromStorage: function() {
			var $sel = $('#asenha-storage-origins-sort');
			if (!$sel.length || $sel.prop('disabled')) {
				return;
			}
			this.applyStorageOriginsSortSelectFromLocalStorage();
			this.applyStorageOriginsListSort();
		},

		/**
		 * Persist sort mode and re-order origins.
		 *
		 * @param {jQuery.Event} e Change event.
		 * @return {void}
		 */
		onStorageOriginsSortChange: function() {
			var mode = this.getStorageOriginsSortMode();
			try {
				window.localStorage.setItem(this.storageOriginsSortStorageKey, mode);
			} catch (err) { // eslint-disable-line no-unused-vars
				// Private mode or storage blocked.
			}
			this.applyStorageOriginsListSort();
		},

		/**
		 * Sort Storage tab origin rows by site name (A–Z), total archive bytes (desc), or latest backup time (desc).
		 *
		 * @return {void}
		 */
		applyStorageOriginsListSort: function() {
			var $list = $('#asenha-storage-origins-list');
			if (!$list.length) {
				return;
			}
			var items = $list.children('.asenha-storage-origin').get();
			if (items.length < 2) {
				return;
			}

			var getSortKey = function($el) {
				var $link = $el.find('.asenha-storage-origin-title a').first();
				var text = $link.length ? String($link.text() || '') : String($el.find('.asenha-storage-origin-title').first().text() || '');
				text = text.trim();
				text = text.replace(/^https?:\/\//i, '');
				return text;
			};

			var mode = this.getStorageOriginsSortMode();
			if (mode === 'total_size') {
				items.sort(function(a, b) {
					var $a = $(a);
					var $b = $(b);
					var ba = Math.max(0, parseInt($a.attr('data-archives-total-bytes') || '0', 10) || 0);
					var bb = Math.max(0, parseInt($b.attr('data-archives-total-bytes') || '0', 10) || 0);
					if (bb !== ba) {
						return bb - ba;
					}
					return getSortKey($a).localeCompare(getSortKey($b), undefined, { sensitivity: 'base' });
				});
			} else if (mode === 'recency') {
				items.sort(function(a, b) {
					var $a = $(a);
					var $b = $(b);
					var ta = Math.max(0, parseInt($a.attr('data-archives-latest-ts') || '0', 10) || 0);
					var tb = Math.max(0, parseInt($b.attr('data-archives-latest-ts') || '0', 10) || 0);
					if (tb !== ta) {
						return tb - ta;
					}
					return getSortKey($a).localeCompare(getSortKey($b), undefined, { sensitivity: 'base' });
				});
			} else {
				items.sort(function(a, b) {
					return getSortKey($(a)).localeCompare(getSortKey($(b)), undefined, { sensitivity: 'base' });
				});
			}
			$(items).appendTo($list);
		},

		/**
		 * Backward-compatible alias.
		 *
		 * @return {void}
		 */
		sortStorageOriginsListDom: function() {
			this.applyStorageOriginsListSort();
		},

		/**
		 * Sum data-size-bytes from Storage archive table rows under one origin.
		 *
		 * @param {jQuery} $origin .asenha-storage-origin
		 * @return {number}
		 */
		sumStorageOriginArchiveBytesFromDom: function($origin) {
			if (!$origin || !$origin.length) {
				return 0;
			}
			var sum = 0;
			$origin.find('.asenha-storage-archives-table tr.asenha-chain-base-row[data-size-bytes]').each(function() {
				sum += Math.max(0, parseInt($(this).attr('data-size-bytes') || '0', 10) || 0);
			});
			$origin.find('.asenha-chain-incrementals-table-storage tbody tr[data-size-bytes]').each(function() {
				sum += Math.max(0, parseInt($(this).attr('data-size-bytes') || '0', 10) || 0);
			});
			return sum;
		},

		/**
		 * Refresh origin header total and data-archives-total-bytes from remaining table rows.
		 *
		 * @param {jQuery} $origin .asenha-storage-origin
		 * @return {void}
		 */
		updateStorageOriginArchiveTotalsFromTable: function($origin) {
			if (!$origin || !$origin.length) {
				return;
			}
			var sum = this.sumStorageOriginArchiveBytesFromDom($origin);
			$origin.attr('data-archives-total-bytes', String(sum));
			var $badge = $origin.find('.asenha-storage-origin-title-wrap .asenha-total-size').first();
			if ($badge.length) {
				$badge.text(this.formatBytes(sum, 2));
			}
		},

		/**
		 * Update Backup Archives heading grand total from per-origin data-archives-total-bytes.
		 *
		 * @return {void}
		 */
		updateStorageArchivesGrandTotalFromOrigins: function() {
			var $badge = $('#asenha-storage-archives-grand-total');
			if (!$badge.length) {
				return;
			}
			var sum = 0;
			$('#asenha-storage-origins-list .asenha-storage-origin').each(function() {
				sum += Math.max(0, parseInt($(this).attr('data-archives-total-bytes') || '0', 10) || 0);
			});
			$badge.text(this.formatBytes(sum, 2));
		},

		/**
		 * Sum data-size-bytes from Backup Archives table rows.
		 *
		 * @return {number}
		 */
		sumBackupArchivesBytesFromDom: function() {
			var sum = 0;
			var $section = $('.asenha-backup-history');
			if (!$section.length) {
				return 0;
			}
			$section.find('.asenha-backup-list tr.asenha-chain-base-row[data-size-bytes]').each(function() {
				sum += Math.max(0, parseInt($(this).attr('data-size-bytes') || '0', 10) || 0);
			});
			$section.find('.asenha-chain-incrementals-table tbody tr[data-size-bytes]').each(function() {
				sum += Math.max(0, parseInt($(this).attr('data-size-bytes') || '0', 10) || 0);
			});
			return sum;
		},

		/**
		 * Update Backup tab Archives heading grand total badge.
		 *
		 * @param {number} bytes Total bytes.
		 * @return {void}
		 */
		updateBackupArchivesGrandTotal: function(bytes) {
			var $section = $('.asenha-backup-history');
			var $badge = $('#asenha-backup-archives-grand-total');
			if (!$section.length || !$badge.length) {
				return;
			}
			var total = Math.max(0, parseInt(bytes, 10) || 0);
			$section.attr('data-archives-total-bytes', String(total));
			$badge.text(this.formatBytes(total, 2));
		},

		/**
		 * Recompute Backup tab Archives heading total from remaining table rows.
		 *
		 * @return {void}
		 */
		updateBackupArchivesGrandTotalFromTable: function() {
			this.updateBackupArchivesGrandTotal(this.sumBackupArchivesBytesFromDom());
		},

		/**
		 * Whether a completed backup's archive should count toward the grand total.
		 *
		 * @param {Object} state Backup progress state.
		 * @return {boolean}
		 */
		backupArchiveCountsTowardGrandTotal: function(state) {
			if (!state || typeof state !== 'object') {
				return false;
			}
			if (state.local_archive_deleted) {
				return false;
			}
			var locations = (state.locations && typeof state.locations === 'object') ? state.locations : {};
			return !('local_enabled' in locations) || !!locations.local_enabled;
		},

		appendStorageOriginToList: function(origin) {
			var originId = String(origin.origin_id || '');
			var originUrl = String(origin.origin_site_url || '');
			var secret = String(origin.secret_key || '');
			if (!originId || !originUrl) {
				return;
			}

			var panelId = 'asenha-storage-secret-panel-' + originId;
			var archivesPanelId = 'asenha-storage-origin-archives-' + originId;
			var storageSiteUrl = String((window.asenhaSiteBackup && window.asenhaSiteBackup.currentSiteUrl) || '').trim();
			storageSiteUrl = storageSiteUrl.replace(/\/+$/, '');

			var archivesSummaryLabel = this.buildStorageOriginArchivesSummaryLabel(0, 0, '-', '-');
			var totalSizeHuman = this.formatBytes(0, 2);

			var html = '';
			html += '<div class="asenha-storage-origin" data-origin-id="' + this.escapeAttr(originId) + '" data-archives-total-bytes="0" data-archives-latest-ts="0">';
			html += '  <div class="asenha-storage-origin-title-wrap">';
			html += '    <h3 class="asenha-storage-origin-title">' + this.escapeHtml(originUrl) + '</h3>';
			html += '    <span class="asenha-total-size">' + this.escapeHtml(totalSizeHuman) + '</span>';
			html += '    <button type="button" class="asenha-storage-origin-archives-toggle" aria-expanded="false" aria-controls="' + this.escapeAttr(archivesPanelId) + '" aria-label="' + this.escapeAttr(asenhaSbT('storageOriginArchivesToggleAria')) + '">' + this.escapeHtml(archivesSummaryLabel) + '</button>';
			html += '    <div class="asenha-storage-origin-links">';
			html += '      <a href="#" class="asenha-storage-origin-manage-secret" aria-expanded="true" aria-controls="' + this.escapeAttr(panelId) + '">' + this.escapeHtml(asenhaSbT('storageManageSecretKey')) + '</a>';
			html += '      <a href="#" class="asenha-storage-origin-delete-storage" data-origin-id="' + this.escapeAttr(originId) + '">' + this.escapeHtml(asenhaSbT('storageDeleteStorageForThisSite')) + '</a>';
			html += '    </div>';
			html += '  </div>';
			html += '  <div class="asenha-storage-secret-panel is-open" id="' + this.escapeAttr(panelId) + '">';
			html += '    <p class="description">' + this.escapeHtml(asenhaSbT('storageSecretLabel')) + '</p>';
			html += '    <div class="asenha-storage-secret-row">';
			html += '      <input type="text" class="regular-text code asenha-storage-origin-secret" readonly value="' + this.escapeAttr(secret) + '" />';
			html += '      <button type="button" class="button asenha-storage-origin-regenerate" data-origin-id="' + this.escapeAttr(originId) + '">' + this.escapeHtml(asenhaSbT('storageRegenerate')) + '</button> ';
			html += '      <button type="button" class="button asenha-copy-text" data-copy-source="input.asenha-storage-origin-secret">' + this.escapeHtml(asenhaSbT('copy')) + '</button> ';
			html += '      <button type="button" class="button asenha-copy-backup-url" data-url="' + this.escapeAttr(storageSiteUrl) + '">' + this.escapeHtml(asenhaSbT('storageCopyThisStorageSiteUrl')) + '</button> ';
			html += '      <span class="spinner asenha-storage-origin-spinner" style="float:none; display:none;"></span>';
			html += '    </div>';
			html += '  </div>';
			html += '  <div id="' + this.escapeAttr(archivesPanelId) + '" class="asenha-storage-origin-archives-panel" hidden>';
			html += '  <div class="asenha-storage-origin-archives">';
			html += '    <h4>' + this.escapeHtml(asenhaSbT('storageArchivesHeading')) + '</h4>';
			html += '    <p class="description">' + this.escapeHtml(asenhaSbT('storageArchivesPlaceholder')) + '</p>';
			html += '  </div>';
			html += '  </div>';
			html += '  <hr />';
			html += '</div>';

			var $list = $('#asenha-storage-origins-list');
			if ($list.length) {
				// Remove the empty-state description if present.
				$list.find('p.description').first().remove();
				$list.append(html);
				this.syncStorageExpandAllArchivesButton();
				this.applyStorageOriginsSortSelectFromLocalStorage();
				this.applyStorageOriginsListSort();

				var $origin = $list.children('.asenha-storage-origin').filter(function() {
					return String($(this).attr('data-origin-id') || '') === originId;
				}).first();
				$origin.find('.asenha-storage-origin-secret').trigger('focus');
			}
		},

		/**
		 * Copy text to clipboard.
		 *
		 * Supports:
		 * - data-copy-text (explicit string)
		 * - data-copy-source (CSS selector to find value/text within the nearest storage origin)
		 *
		 * @since 8.7.0
		 */
		copyText: function(e) {
			e.preventDefault();
			var self = this;
			var $btn = $(e.currentTarget);

			var text = '';
			var explicit = $btn.data('copyText');
			if (explicit) {
				text = String(explicit);
			}

			if (!text) {
				var selector = String($btn.data('copySource') || '').trim();
				if (selector) {
					var $scope = $btn.closest('.asenha-storage-origin');
					if (!$scope.length) {
						$scope = $(document.body);
					}
					var $el = $scope.find(selector).first();
					if ($el.length) {
						if ($el.is('input, textarea')) {
							text = String($el.val() || '');
						} else {
							text = String($el.text() || '');
						}
					}
				}
			}

			text = String(text || '');
			if (!text) {
				self.showNotice('error', asenhaSbT('copyFailed'));
				return;
			}

			var done = function(ok) {
				if (!ok) {
					self.showNotice('error', asenhaSbT('copyFailed'));
					return;
				}
				self.showNotice('success', asenhaSbT('secretCopied'));
				$btn.text(asenhaSbT('copied'));
				setTimeout(function() {
					$btn.text(asenhaSbT('copy'));
				}, 1500);
			};

			// Prefer async Clipboard API.
			if (navigator && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
				navigator.clipboard.writeText(text).then(function() {
					done(true);
				}).catch(function() {
					// Fallback below.
					try {
						var $tmp = $('<textarea readonly style="position:absolute; left:-9999px; top:-9999px;"></textarea>');
						$tmp.val(text);
						$('body').append($tmp);
						$tmp[0].select();
						var ok = false;
						try {
							ok = document.execCommand('copy');
						} catch (e) {
							ok = false;
						}
						$tmp.remove();
						done(!!ok);
					} catch (e) {
						done(false);
					}
				});
				return;
			}

			// Legacy fallback.
			try {
				var $tmp2 = $('<textarea readonly style="position:absolute; left:-9999px; top:-9999px;"></textarea>');
				$tmp2.val(text);
				$('body').append($tmp2);
				$tmp2[0].select();
				var ok2 = false;
				try {
					ok2 = document.execCommand('copy');
				} catch (e) {
					ok2 = false;
				}
				$tmp2.remove();
				done(!!ok2);
			} catch (e) {
				done(false);
			}
		},

		// Template modal excluded descendants scan state.
		templateModalExcludedState: {
			timer: null,
			xhr: null,
			token: 0
		},

		// Store completed step statistics to persist them after moving to next phase
		completedStepStats: {},

		// Store backup completed step stats
		backupCompletedStats: {},

		// Track previous backup step for detecting transitions
		previousBackupStep: null,

		// Track last known sub_progress for backup
		lastBackupSubProgress: null,

		// Track database scan stats for backup
		lastDatabaseStats: null,

		// Track files scan stats for backup
		lastFilesStats: null,

		// Track archive size for backup
		lastArchiveSize: null,

		// Store restore completed step stats
		restoreCompletedStats: {},

		// Track previous restore step for detecting transitions
		previousRestoreStep: null,

		// Track last known sub_progress for restore
		lastRestoreSubProgress: null,

		// Track last known retrieving sub_progress for restore
		lastRestoreRetrievingSubProgress: null,

		// Track last known extraction size for restore
		lastRestoreExtractionSize: 0,

		// Track last known rows total for restore
		lastRestoreRowsTotal: 0,

		// Track last known tables total for restore
		lastRestoreTablesTotal: 0,

		// Flag to prevent duplicate completion handling
		restoreCompletionHandled: false,

		// Track highest step index reached during restore to prevent UI regression
		highestRestoreStepIndex: -1,

		// localStorage key prefix
		storagePrefix: 'asenha_backup_progress_',

		// localStorage key prefix for static (public) restore progress URL
		restorePublicUrlPrefix: 'asenha_restore_public_url_',

		// localStorage key prefix for static (public) migration progress URL
		migrationPublicUrlPrefix: 'asenha_migration_public_url_',

		// Step order for backup types
		backupSteps: {
			full: ['preparing', 'files', 'database', 'archive', 'cleanup'],
			database: ['preparing', 'database', 'archive', 'cleanup'],
			files: ['preparing', 'files', 'archive', 'cleanup']
		},

		// Per-run computed step list (e.g., includes 'sending' when needed).
		currentBackupSteps: null,

		// Step order for restore
		restoreSteps: {
			full: ['preparing', 'files', 'database', 'cleanup'],
			database: ['preparing', 'database', 'cleanup'],
			files: ['preparing', 'files', 'cleanup']
		},

		/**
		 * Compute the restore checklist steps for a run.
		 *
		 * For remote restores, insert a "retrieving" checkpoint between "preparing" and the first
		 * restore operation step, so the UI can show "Retrieving archive" progress.
		 *
		 * @since 8.7.0
		 *
		 * @param {Object} opts
		 * @param {string} opts.components One of: 'all' | 'database' | 'files'
		 * @param {string} opts.locationId Location ID (empty/'local' for local)
		 * @return {Array}
		 */
		getRestoreStepsForOptions: function(opts) {
			opts = opts || {};
			var components = String(opts.components || 'all');
			var locationId = String(opts.locationId || '');
			var isRemote = locationId && locationId !== 'local';

			var steps;
			if (components === 'database') {
				steps = (this.restoreSteps.database || []).slice();
			} else if (components === 'files') {
				steps = (this.restoreSteps.files || []).slice();
			} else {
				steps = (this.restoreSteps.full || []).slice();
			}

			if (!isRemote) {
				return steps;
			}

			// Insert retrieving after preparing (if present).
			if (steps.indexOf('retrieving') === -1) {
				var i = steps.indexOf('preparing');
				if (i === -1) {
					steps.unshift('retrieving');
				} else {
					steps.splice(i + 1, 0, 'retrieving');
				}
			}

			return steps;
		},

		// Step order for migration (v8.3.0+)
		// New order: extracting -> files -> search_replace (on SQL) -> database -> cleanup
		migrationSteps: {
			full: ['extracting', 'files', 'search_replace', 'database', 'cleanup'],
			database: ['extracting', 'search_replace', 'database', 'cleanup'],
			files: ['extracting', 'files', 'cleanup']
		},

		// Step order for transfer (v8.3.0+)
		// New order: connecting -> creating -> downloading -> extracting -> files -> search_replace -> database -> cleanup
		transferSteps: ['connecting', 'creating', 'downloading', 'extracting', 'files', 'search_replace', 'database', 'cleanup'],

		// Store transfer package info for completion stats
		transferPackageInfo: null,

		// Store transfer completed step stats
		transferCompletedStats: {},

		// Track previous transfer step for detecting transitions
		previousTransferStep: null,

		// Track last known sub_progress for transfer extraction
		lastTransferExtractionSize: 0,

		// Track final stats for transfer steps (used at completion)
		lastTransferPackageSize: 0,
		lastTransferFilesTotal: 0,
		lastTransferTablesTotal: 0,
		lastTransferRowsTotal: 0,
		lastTransferManifestRowCount: 0, // From database_stats.total_rows - more reliable than tracking during import
		lastTransferDownloadSize: 0,
		lastTransferSearchReplaceStats: null,

		// Track last known sub_progress for transfer (used when state updates are incomplete)
		lastTransferSubProgress: null,
		
		// Track last known sub_progress for transfer creating step (used for completion summaries)
		// We keep this separate because once the step transitions to downloading, subsequent polls
		// will overwrite lastTransferSubProgress with the new step payload.
		lastTransferCreatingSubProgress: null,

		// Incremental baseline destinations cache (filename => destinations).
		incrementalBaselinesCache: {},
		incrementalMultipartLock: null,
		incrementalDestinationLock: null,
		incrementalEncryptionLock: null,

		init: function() {
			this.bindEvents();
			this.initLiveClock();
			this.hideRestorePassphraseField(true);
			this.setRestoreScriptUiState(asenhaSiteBackup && asenhaSiteBackup.restoreScript ? asenhaSiteBackup.restoreScript : null);
			this.cleanupOldStorage();
			this.initFilenameTruncation();
			this.initIncrementalsColumnSync();
			this.initTemplatesUi();
			this.initPoliciesUi();
			this.initBackupDestinationUi();
			this.initLocationsUi();
			this.initStorageUi();
		},

		/**
		 * Initialize the live clock shown in the top tabs row.
		 *
		 * Uses server time as the initial anchor and keeps ticking every second.
		 */
		initLiveClock: function() {
			var $clock = $('#asenha-site-backup-live-clock');
			if (!$clock.length) {
				return;
			}

			if (this.liveClockInterval) {
				clearInterval(this.liveClockInterval);
				this.liveClockInterval = null;
			}

			var clockConfig = (asenhaSiteBackup && asenhaSiteBackup.clock) ? asenhaSiteBackup.clock : {};
			var serverNowSeconds = parseInt(clockConfig.serverNow, 10);
			if (isNaN(serverNowSeconds) || serverNowSeconds <= 0) {
				serverNowSeconds = Math.floor(Date.now() / 1000);
			}

			this.liveClockServerEpochMs = serverNowSeconds * 1000;
			this.liveClockClientEpochMs = Date.now();

			this.renderLiveClock();
			this.liveClockInterval = setInterval(this.renderLiveClock.bind(this), 1000);
		},

		/**
		 * Render current date/time in WordPress-configured format.
		 */
		renderLiveClock: function() {
			var $clock = $('#asenha-site-backup-live-clock');
			if (!$clock.length) {
				return;
			}

			var clockConfig = (asenhaSiteBackup && asenhaSiteBackup.clock) ? asenhaSiteBackup.clock : {};
			var dateFormat = String(clockConfig.dateFormat || '');
			var timeFormat = String(clockConfig.timeFormat || '');
			var displayFormat = String(clockConfig.dateTimeFormat || '').trim();
			var timezone = String(clockConfig.timezone || '').trim();
			var nowMs = this.getLiveClockNowMs();
			var nowDate = new Date(nowMs);
			var displayText = '';
			var isoDatetime = '';

			if (!displayFormat) {
				if (dateFormat && timeFormat) {
					displayFormat = dateFormat + ', ' + timeFormat;
				} else {
					displayFormat = (dateFormat + ' ' + timeFormat).trim();
				}
			}
			if (!displayFormat) {
				displayFormat = 'Y-m-d H:i:s';
			}

			if (
				typeof wp !== 'undefined' &&
				wp &&
				wp.date &&
				typeof wp.date.dateI18n === 'function'
			) {
				try {
					displayText = String(wp.date.dateI18n(displayFormat, nowMs, timezone || undefined) || '');
					isoDatetime = String(wp.date.dateI18n('c', nowMs, timezone || undefined) || '');
				} catch (e) {
					// Fall back to browser formatting below.
				}
			}

			if (!displayText) {
				displayText = nowDate.toLocaleString();
			}
			if (!isoDatetime) {
				isoDatetime = nowDate.toISOString();
			}

			$clock.text(displayText);
			$clock.attr('datetime', isoDatetime);
		},

		/**
		 * Get current clock timestamp in milliseconds.
		 *
		 * @return {number}
		 */
		getLiveClockNowMs: function() {
			if (!this.liveClockServerEpochMs || !this.liveClockClientEpochMs) {
				return Date.now();
			}

			return this.liveClockServerEpochMs + (Date.now() - this.liveClockClientEpochMs);
		},

		/**
		 * Save progress to localStorage
		 */
		saveProgress: function(id, data) {
			try {
				data.last_updated = Date.now();
				localStorage.setItem(this.storagePrefix + id, JSON.stringify(data));
			} catch (e) {
				// localStorage not available or quota exceeded
			}
		},

		/**
		 * Save the static (public) restore progress URL to localStorage.
		 *
		 * This URL points to a tokenized JSON file under wp-content that can be polled
		 * even when admin-ajax.php is temporarily unavailable during database restore.
		 */
		saveRestorePublicProgressUrl: function(id, url) {
			if (!id || !url) {
				return;
			}
			try {
				localStorage.setItem(this.restorePublicUrlPrefix + id, String(url));
			} catch (e) {
				// Ignore errors (localStorage not available or quota exceeded)
			}
		},

		/**
		 * Get the static (public) restore progress URL from localStorage.
		 */
		getRestorePublicProgressUrl: function(id) {
			if (!id) {
				return null;
			}
			try {
				var url = localStorage.getItem(this.restorePublicUrlPrefix + id);
				return url ? String(url) : null;
			} catch (e) {
				return null;
			}
		},

		/**
		 * Clear the static (public) restore progress URL from localStorage.
		 */
		clearRestorePublicProgressUrl: function(id) {
			if (!id) {
				return;
			}
			try {
				localStorage.removeItem(this.restorePublicUrlPrefix + id);
			} catch (e) {
				// Ignore errors
			}
		},

		/**
		 * Save the static (public) migration progress URL to localStorage.
		 *
		 * This URL points to a tokenized JSON file under wp-content that can be polled
		 * even when admin-ajax.php is temporarily unavailable during database import.
		 */
		saveMigrationPublicProgressUrl: function(id, url) {
			if (!id || !url) {
				return;
			}
			try {
				localStorage.setItem(this.migrationPublicUrlPrefix + id, String(url));
			} catch (e) {
				// Ignore errors (localStorage not available or quota exceeded)
			}
		},

		/**
		 * Get the static (public) migration progress URL from localStorage.
		 */
		getMigrationPublicProgressUrl: function(id) {
			if (!id) {
				return null;
			}
			try {
				var url = localStorage.getItem(this.migrationPublicUrlPrefix + id);
				return url ? String(url) : null;
			} catch (e) {
				return null;
			}
		},

		/**
		 * Clear the static (public) migration progress URL from localStorage.
		 */
		clearMigrationPublicProgressUrl: function(id) {
			if (!id) {
				return;
			}
			try {
				localStorage.removeItem(this.migrationPublicUrlPrefix + id);
			} catch (e) {
				// Ignore errors
			}
		},

		/**
		 * Get progress from localStorage
		 */
		getProgress: function(id) {
			try {
				var data = localStorage.getItem(this.storagePrefix + id);
				return data ? JSON.parse(data) : null;
			} catch (e) {
				return null;
			}
		},

		/**
		 * Clear progress from localStorage
		 */
		clearProgress: function(id) {
			try {
				localStorage.removeItem(this.storagePrefix + id);
			} catch (e) {
				// Ignore errors
			}
		},

		/**
		 * Cleanup old storage entries (older than 1 hour)
		 */
		cleanupOldStorage: function() {
			try {
				var prefix = this.storagePrefix;
				var oneHourAgo = Date.now() - (60 * 60 * 1000);
				
				for (var i = localStorage.length - 1; i >= 0; i--) {
					var key = localStorage.key(i);
					if (key && key.indexOf(prefix) === 0) {
						var data = JSON.parse(localStorage.getItem(key));
						if (data && data.last_updated && data.last_updated < oneHourAgo) {
							localStorage.removeItem(key);
						}
					}
				}
			} catch (e) {
				// Ignore errors
			}
		},

		/**
		 * Initialize filename truncation (middle truncation + tooltip).
		 *
		 * We truncate only when needed (text overflows) and preserve the backup ID
		 * segment near the end of filenames (e.g. `_7dox9tcx.zip.parts.json`).
		 */
		initFilenameTruncation: function() {
			var self = this;

			self.applyFilenameTruncation();

			$(window)
				.off('resize.asenhaFilenameTruncate')
				.on('resize.asenhaFilenameTruncate', function() {
					if (self.filenameTruncateTimer) {
						clearTimeout(self.filenameTruncateTimer);
					}
					self.filenameTruncateTimer = setTimeout(function() {
						self.applyFilenameTruncation();
					}, 150);
				});
		},

		/**
		 * Sync Incrementals columns to match the base list table.
		 *
		 * We measure the outer table's actual rendered header cell widths in px and
		 * apply them as CSS variables on the expansion row. CSS then uses these vars
		 * for the incrementals grid + nested colgroup widths for pixel-perfect alignment.
		 */
		initIncrementalsColumnSync: function() {
			var self = this;

			var syncOpenClosedClasses = function($details) {
				if (!$details || !$details.length) {
					return;
				}
				var isOpen = !!$details.prop('open');
				$details.toggleClass('open', isOpen);
				$details.toggleClass('closed', !isOpen);
			};

			// Toggle event is emitted by <details> when open/closed.
			$(document)
				.off('toggle.asenhaIncrementalsColumnSync')
				.on('toggle.asenhaIncrementalsColumnSync', 'details.asenha-chain-incrementals', function() {
					var $details = $(this);
					syncOpenClosedClasses($details);

					var isOpen = !!$details.prop('open');
					if (!isOpen) {
						return;
					}

					// Ensure layout has settled (especially after tab switches).
					if (typeof window.requestAnimationFrame === 'function') {
						window.requestAnimationFrame(function() {
							self.syncOpenIncrementalsInScope($details.closest('tr.asenha-chain-incrementals-row'));
						});
						return;
					}

					self.syncOpenIncrementalsInScope($details.closest('tr.asenha-chain-incrementals-row'));
				});

			// Fallback for browsers where <details> toggle event is unreliable:
			// sync on summary click after layout updates.
			$(document)
				.off('click.asenhaIncrementalsColumnSync')
				.on('click.asenhaIncrementalsColumnSync', 'details.asenha-chain-incrementals > summary', function() {
					var $row = $(this).closest('tr.asenha-chain-incrementals-row');
					if (!$row.length) {
						return;
					}
					if (typeof window.requestAnimationFrame === 'function') {
						window.requestAnimationFrame(function() {
							var $details = $row.find('details.asenha-chain-incrementals').first();
							if ($details.length) {
								syncOpenClosedClasses($details);
							}
							self.syncOpenIncrementalsInScope($row);
						});
						return;
					}
					var $detailsNow = $row.find('details.asenha-chain-incrementals').first();
					if ($detailsNow.length) {
						syncOpenClosedClasses($detailsNow);
					}
					self.syncOpenIncrementalsInScope($row);
				});

			// Best-effort: sync any incrementals already open on load.
			self.syncOpenIncrementalsInScope($(document));

			// Keep alignment on viewport changes.
			$(window)
				.off('resize.asenhaIncrementalsColumnSync')
				.on('resize.asenhaIncrementalsColumnSync', function() {
					if (self.incrementalsColumnSyncTimer) {
						clearTimeout(self.incrementalsColumnSyncTimer);
					}
					self.incrementalsColumnSyncTimer = setTimeout(function() {
						self.syncOpenIncrementalsInScope($(document));
					}, 150);
				});
		},

		/**
		 * Sync widths for any currently-open Incrementals within a scope.
		 *
		 * @param {jQuery} $scope Scope to search within.
		 * @return {void}
		 */
		syncOpenIncrementalsInScope: function($scope) {
			var self = this;
			if (!$scope || !$scope.length) {
				return;
			}

			var $detailsList = $scope.find('details.asenha-chain-incrementals[open]');
			if (!$detailsList.length && $scope.is('details.asenha-chain-incrementals[open]')) {
				$detailsList = $scope;
			}

			$detailsList.each(function() {
				var $details = $(this);
				$details.toggleClass('open', true);
				$details.toggleClass('closed', false);

				var $outerIncRow = $details.closest('tr.asenha-chain-incrementals-row');
				if (!$outerIncRow.length) {
					return;
				}

				var $outerTable = $outerIncRow.closest('table.wp-list-table, table.widefat').first();
				if (!$outerTable.length) {
					return;
				}

				// Skip if not laid out (e.g. hidden tab).
				var tableEl = $outerTable.get(0);
				if (!tableEl || typeof tableEl.getBoundingClientRect !== 'function') {
					return;
				}
				var trect = tableEl.getBoundingClientRect();
				if (!trect || !trect.width || trect.width <= 0) {
					return;
				}

				var widths = self.measureListTableColumnWidthsPx($outerTable);
				if (!widths) {
					return;
				}
				self.applyIncrementalsColumnVars($outerIncRow, widths);
			});
		},

		/**
		 * Measure the rendered header cell widths (px) of a list table.
		 *
		 * @param {jQuery} $table List table element.
		 * @return {Object<string,number>|null}
		 */
		measureListTableColumnWidthsPx: function($table) {
			if (!$table || !$table.length) {
				return null;
			}

			var $thead = $table.children('thead').first();
			if (!$thead.length) {
				$thead = $table.find('thead').first();
			}
			if (!$thead.length) {
				return null;
			}

			var $headRow = $thead.find('tr').first();
			if (!$headRow.length) {
				return null;
			}

			var read = function(selector) {
				var $th = $headRow.find(selector).first();
				if (!$th.length) {
					return null;
				}
				var el = $th.get(0);
				if (!el || typeof el.getBoundingClientRect !== 'function') {
					return 0; // Column exists, but can't be measured.
				}
				var rect = el.getBoundingClientRect();
				var w = rect && rect.width ? rect.width : 0;
				w = parseFloat(w) || 0;
				return (w >= 0) ? w : 0;
			};

			return {
				type: read('th.column-type'),
				filename: read('th.column-filename'),
				size: read('th.column-size'),
				date: read('th.column-date'),
				locations: read('th.column-locations'),
				actions: read('th.column-actions')
			};
		},

		/**
		 * Apply measured column widths as CSS variables for a specific expansion row.
		 *
		 * @param {jQuery} $outerIncRow Outer incrementals row element.
		 * @param {Object<string,number>} widths Width map from measureListTableColumnWidthsPx().
		 * @return {void}
		 */
		applyIncrementalsColumnVars: function($outerIncRow, widths) {
			if (!$outerIncRow || !$outerIncRow.length || !widths) {
				return;
			}

			var $grid = $outerIncRow.find('.asenha-chain-incrementals-grid').first();
			if (!$grid.length) {
				return;
			}

			var el = $grid.get(0);
			if (!el || !el.style || typeof el.style.setProperty !== 'function') {
				return;
			}

			var setPx = function(name, value) {
				if (value === null || typeof value === 'undefined') {
					return;
				}
				var n = parseFloat(value);
				if (isNaN(n)) {
					n = 0;
				}
				n = Math.max(0, n);
				el.style.setProperty(name, String(n) + 'px');
			};

			setPx('--asenha-col-type', widths.type);
			setPx('--asenha-col-filename', widths.filename);
			setPx('--asenha-col-size', widths.size);
			setPx('--asenha-col-date', widths.date);
			setPx('--asenha-col-locations', widths.locations);
			setPx('--asenha-col-actions', widths.actions);
		},

		/**
		 * Apply truncation to all known filename cells.
		 */
		applyFilenameTruncation: function() {
			var els = document.querySelectorAll('.asenha-filename-text');
			if (!els || !els.length) {
				return;
			}

			for (var i = 0; i < els.length; i++) {
				this.truncateFilenameElement(els[i]);
			}
		},

		/**
		 * Truncate a filename in the middle if it overflows.
		 *
		 * @param {HTMLElement} el Element containing the filename text.
		 */
		truncateFilenameElement: function(el) {
			if (!el) {
				return;
			}

			// Skip if the element isn't laid out.
			if (!el.clientWidth || el.clientWidth <= 0) {
				return;
			}

			var full = '';
			try {
				full = el.getAttribute('data-full') || el.textContent || '';
			} catch (e) {
				full = el.textContent || '';
			}
			full = String(full).trim();
			if (!full) {
				return;
			}

			el.setAttribute('data-full', full);
			el.setAttribute('title', full);
			el.setAttribute('aria-label', full);

			// Reset to full before checking overflow.
			el.textContent = full;

			// If it fits, keep it unmodified.
			if (el.scrollWidth <= el.clientWidth) {
				return;
			}

			// Preserve the final `_<id>.zip` or `_<id>.zip.parts.json` tail when possible.
			var tailMatch = full.match(/(_[A-Za-z0-9]{6,}\.zip(?:\.parts\.json)?)$/);
			var tail = tailMatch ? String(tailMatch[1]) : '';
			if (!tail) {
				tail = full.slice(Math.max(0, full.length - 24));
			}
			var head = full.slice(0, Math.max(0, full.length - tail.length));
			if (!head) {
				return;
			}

			// Binary search best head length that fits: head + '…' + tail.
			var low = 0;
			var high = head.length;
			var best = '…' + tail;

			while (low <= high) {
				var mid = Math.floor((low + high) / 2);
				var candidate = head.slice(0, mid) + '…' + tail;
				el.textContent = candidate;

				if (el.scrollWidth <= el.clientWidth) {
					best = candidate;
					low = mid + 1;
				} else {
					high = mid - 1;
				}
			}

			el.textContent = best;
		},

		/**
		 * Suppress the WordPress interim login modal
		 *
		 * Uses multiple approaches to prevent the interim login modal from appearing
		 * when user session is invalidated during migration/transfer operations:
		 * 1. Injects CSS to hide the modal
		 * 2. Sets up a MutationObserver to catch and hide the modal if it appears
		 * 3. Attempts to disable heartbeat via available methods
		 */
		suspendHeartbeat: function() {
			var self = this;

			// Approach 1: Inject CSS to hide the interim login modal
			if (!$('#asenha-hide-interim-login').length) {
				$('<style id="asenha-hide-interim-login">')
					.text('#wp-auth-check-wrap, .wp-auth-check-wrap, #wp-auth-check-bg { display: none !important; visibility: hidden !important; }')
					.appendTo('head');
			}

			// Approach 2: Set up MutationObserver to catch and remove the modal if it appears
			if (!this.authCheckObserver) {
				this.authCheckObserver = new MutationObserver(function(mutations) {
					mutations.forEach(function(mutation) {
						mutation.addedNodes.forEach(function(node) {
							if (node.nodeType === 1) {
								// Check if the added node is the auth check modal
								if (node.id === 'wp-auth-check-wrap' || $(node).hasClass('wp-auth-check-wrap')) {
									$(node).remove();
								}
								// The auth-check background overlay can also block interaction.
								if (node.id === 'wp-auth-check-bg') {
									$(node).remove();
								}
								// Also check children
								$(node).find('#wp-auth-check-wrap, .wp-auth-check-wrap, #wp-auth-check-bg').remove();
							}
						});
					});
				});

				this.authCheckObserver.observe(document.body, {
					childList: true,
					subtree: true
				});
			}

			// Approach 3: Try to disable heartbeat via available methods
			if (typeof wp !== 'undefined' && wp.heartbeat) {
				// Try setting a very long interval (5 hours = 18000000ms)
				if (typeof wp.heartbeat.interval === 'function') {
					try {
						wp.heartbeat.interval(18000000);
					} catch (e) {
						// Ignore errors
					}
				}

				// Unbind heartbeat-tick which triggers auth check
				$(document).off('heartbeat-tick.wp-auth-check');
			}

			// Approach 4: Remove any existing auth check modal
			$('#wp-auth-check-wrap').remove();
			$('#wp-auth-check-bg').remove();
		},

		/**
		 * Resume WordPress Heartbeat API
		 *
		 * Resumes the heartbeat after migration/transfer operations.
		 * Note: This is kept for completeness but typically not used
		 * since the page redirects after migration/transfer completes.
		 */
		resumeHeartbeat: function() {
			// Remove the injected CSS
			$('#asenha-hide-interim-login').remove();

			// Disconnect the MutationObserver
			if (this.authCheckObserver) {
				this.authCheckObserver.disconnect();
				this.authCheckObserver = null;
			}

			// Re-enable heartbeat auth check
			if (typeof wp !== 'undefined' && wp.heartbeat) {
				if (typeof wp.heartbeat.interval === 'function') {
					try {
						wp.heartbeat.interval('standard');
					} catch (e) {
						// Ignore errors
					}
				}
			}
		},

		bindEvents: function() {
			var self = this;
			// Backup buttons
			$(document).on('click', '.asenha-start-backup', this.startBackup.bind(this));
			$(document).on('click', '.asenha-cancel-backup', this.cancelBackup.bind(this));

			// Multipart backup options (Backup tab).
			var updateMultipartBackupOptionsUi = function() {
				var enabled = $('#asenha-multipart-enabled').is(':checked');
				$('#asenha-multipart-part-bytes').prop('disabled', !enabled);
				$('.asenha-multipart-description').toggle(!!enabled);
			};

			$(document).on('change', '#asenha-multipart-enabled', function() {
				updateMultipartBackupOptionsUi();
			});
			updateMultipartBackupOptionsUi();

			// Backup archive encryption options (Backup tab).
			var updateBackupArchiveEncryptionOptionsUi = function() {
				var enabled = $('#asenha-backup-archive-encryption-enabled').is(':checked');
				$('#asenha-backup-archive-encryption-fields').toggle(!!enabled);
			};

			$(document).on('change', '#asenha-backup-archive-encryption-enabled', function() {
				updateBackupArchiveEncryptionOptionsUi();
			});
			updateBackupArchiveEncryptionOptionsUi();

			// Backup destination options (Backup tab).
			$(document).on('change', '#asenha-backup-destination-local, #asenha-backup-destination-remote', this.onBackupDestinationChange.bind(this));

			// Multipart transfer options (Migration tab, Send).
			var updateMultipartTransferOptionsUi = function() {
				var enabled = $('#asenha-transfer-multipart-enabled').is(':checked');
				$('#asenha-transfer-multipart-part-bytes').prop('disabled', !enabled);
				$('.asenha-transfer-multipart-description').toggle(!!enabled);
			};

			$(document).on('change', '#asenha-transfer-multipart-enabled', function() {
				updateMultipartTransferOptionsUi();
			});
			updateMultipartTransferOptionsUi();

			// Transfer archive encryption options (Migration tab, Send).
			var updateTransferArchiveEncryptionOptionsUi = function() {
				var enabled = $('#asenha-transfer-archive-encryption-enabled').is(':checked');
				$('#asenha-transfer-archive-encryption-fields').toggle(!!enabled);
			};

			$(document).on('change', '#asenha-transfer-archive-encryption-enabled', function() {
				updateTransferArchiveEncryptionOptionsUi();
			});
			updateTransferArchiveEncryptionOptionsUi();
			
			// Delete backup
			$(document).on('click', '.asenha-delete-backup', this.deleteBackup.bind(this));
			
			// Copy backup URL
			$(document).on('click', '.asenha-copy-backup-url', this.copyBackupUrl.bind(this));

			// Generic copy-to-clipboard (used by Storage tab secret key copy).
			$(document).on('click', '.asenha-copy-text', this.copyText.bind(this));
			
			// Restore from backup list (Backup tab)
			$(document).on('click', '.asenha-restore-backup', this.showRestoreOptions.bind(this));
			
			// Restore from local backups list (Restore tab - button click)
			$(document).on('click', '.asenha-select-restore-backup', this.selectRestoreBackup.bind(this));
			$(document).on('click', '.asenha-toggle-all-locations', this.toggleAllLocations.bind(this));
			$(document).on('click', '.asenha-toggle-all-incrementals', this.toggleAllIncrementals.bind(this));
			$(document).on('click', '.asenha-toggle-all-notes', this.toggleAllNotes.bind(this));
			$(document).on('click', '.asenha-archive-note-toggle', this.onArchiveNoteToggle.bind(this));
			$(document).on('click', '.asenha-archive-note-edit', this.onArchiveNoteEdit.bind(this));
			$(document).on('click', '.asenha-archive-note-save', this.onArchiveNoteSave.bind(this));
			$(document).on('click', '.asenha-archive-note-cancel', this.onArchiveNoteCancel.bind(this));
			$(document).on('change', '.asenha-archive-policy-filter', this.onArchivePolicyFilterChange.bind(this));

			// Upload functionality
			this.initUpload();

			// Logs actions
			$(document).on('click', '#asenha-clear-logs', this.clearLogs.bind(this));
			$(document).on('change', '#asenha-log-max-entries', this.saveLogMaxEntries.bind(this));

			// Templates (Backup > Templates subtab)
			$(document).on('click', '#asenha-create-backup-template', this.onCreateTemplateClick.bind(this));
			$(document).on('click', '#asenha-create-transfer-template', this.onCreateTemplateClick.bind(this));
			$(document).on('click', '.asenha-backup-template-edit', this.onEditTemplateClick.bind(this));
			$(document).on('click', '.asenha-backup-template-delete', this.onDeleteTemplateClick.bind(this));

			// Template picker (Backup > Create Backup)
			$(document).on('change', '#asenha-template-picker-select', this.onTemplatePickerSelectChange.bind(this));
			$(document).on('change', '#asenha-backup-method-incremental', this.onBackupMethodChange.bind(this));
			$(document).on('change', '#asenha-baseline-picker-select', this.onBaselinePickerSelectChange.bind(this));
			$(document).on('click', '.asenha-template-picker-start', this.onStartBackupFromPickerClick.bind(this));
			$(document).on('click', '.asenha-template-picker-cancel', this.onCancelTemplatePickerClick.bind(this));

			// Template picker (Migration > Direct Transfer > Send)
			$(document).on('change', '#asenha-transfer-template-picker-select', this.onTransferTemplatePickerSelectChange.bind(this));
			$(document).on('click', '.asenha-transfer-template-picker-generate', this.onGenerateTransferKeyFromPickerClick.bind(this));
			$(document).on('click', '.asenha-transfer-template-picker-cancel', this.onCancelTransferTemplatePickerClick.bind(this));

			// Toggle upload section buttons
			$(document).on('click', '#asenha-show-upload-backup', this.showUploadBackupSection.bind(this));
			$(document).on('click', '#asenha-show-import-dropzone', this.showImportDropzoneSection.bind(this));
			$(document).on('click', '#asenha-show-restore-url-transfer', this.showRestoreUrlTransferSection.bind(this));
			$(document).on('click', '#asenha-show-import-url-transfer', this.showImportUrlTransferSection.bind(this));
			$(document).on('click', '#asenha-start-restore-url-transfer', this.startRestoreUrlTransfer.bind(this));
			$(document).on('click', '#asenha-start-import-url-transfer', this.startImportUrlTransfer.bind(this));

			// Migration events
			$(document).on('click', '.asenha-import-site-btn', this.onImportSiteClick.bind(this));
			$(document).on('click', '#asenha-start-migration', this.startMigration.bind(this));
			$(document).on('click', '#asenha-cancel-migration-setup', this.cancelMigrationSetup.bind(this));

			// Component checkbox handling
			$(document).on('change', 'input[name="import_components"]', this.onComponentChange.bind(this));

			// Direct transfer events
			$(document).on('click', '#asenha-generate-transfer-key', this.generateTransferKey.bind(this));
			$(document).on('click', '#asenha-copy-transfer-key', this.copyTransferKey.bind(this));
			$(document).on('click', '#asenha-start-transfer', this.startTransfer.bind(this));
			$(document).on('click', '#asenha-cancel-transfer', this.cancelTransfer.bind(this));
			$(document).on('input change', '#asenha-transfer-key-input', this.updateTransferReceivePassphraseUi.bind(this));
			this.updateTransferReceivePassphraseUi();

			// Emergency restore script toggle and download
			$(document).on('click', '#asenha-show-restore-script', this.showRestoreScriptSection.bind(this));
			$(document).on('click', '#asenha-download-restore-script', this.downloadRestoreScript.bind(this));
			$(document).on('click', '#asenha-install-restore-script', this.installRestoreScript.bind(this));
			$(document).on('click', '#asenha-uninstall-restore-script', this.uninstallRestoreScript.bind(this));

			// Clean Up tab actions
			$(document).on('click', '#asenha-scan-cleanup-artifacts', this.scanCleanupArtifacts.bind(this));
			$(document).on('click', '#asenha-delete-all-cleanup-artifacts', this.deleteAllCleanupArtifacts.bind(this));
			$(document).on('click', '.asenha-delete-cleanup-item', this.deleteCleanupItem.bind(this));
			$(document).on('click', '.asenha-delete-cleanup-group', this.deleteCleanupGroup.bind(this));
			$(document).on('click', '.asenha-delete-cleanup-zip', this.deleteCleanupZip.bind(this));

			// Multipart parts dropdown: close when clicking outside.
			$(document)
				.off('click.asenhaMultipartPartsClose')
				.on('click.asenhaMultipartPartsClose', function(e) {
					var openDetails = document.querySelectorAll('details.asenha-multipart-parts[open], details.asenha-multipart-download[open]');
					if (!openDetails || openDetails.length === 0) {
						return;
					}

					for (var i = 0; i < openDetails.length; i++) {
						var details = openDetails[i];
						if (details && !details.contains(e.target)) {
							details.removeAttribute('open');
						}
					}
				});

			// Multipart parts dropdown: close on Escape.
			$(document)
				.off('keydown.asenhaMultipartPartsClose')
				.on('keydown.asenhaMultipartPartsClose', function(e) {
					var key = e && (e.key || e.keyCode);
					if (key !== 'Escape' && key !== 'Esc' && key !== 27) {
						return;
					}

					var openDetails = document.querySelectorAll('details.asenha-multipart-parts[open], details.asenha-multipart-download[open]');
					if (!openDetails || openDetails.length === 0) {
						return;
					}

					for (var i = 0; i < openDetails.length; i++) {
						openDetails[i].removeAttribute('open');
					}
				});

			// Multipart download dropdown: maximize list height based on viewport space below the button.
			// Use native capture-phase listener because <details> "toggle" does not bubble.
			if (this.multipartDownloadToggleListener) {
				document.removeEventListener('toggle', this.multipartDownloadToggleListener, true);
			}
			this.multipartDownloadToggleListener = function(e) {
				var details = e && e.target ? e.target : null;
				if (!details || !details.matches || !details.matches('details.asenha-multipart-download')) {
					return;
				}
				if (!details.open) {
					self.resetMultipartDownloadDropdownPosition(details);
					return;
				}
				self.adjustMultipartDownloadDropdownHeight(details);
			};
			document.addEventListener('toggle', this.multipartDownloadToggleListener, true);
		},

		/**
		 * Expand/collapse all location rows in the current archives section.
		 *
		 * This only targets location disclosure toggles and never opens/closes
		 * the incrementals disclosure itself.
		 */
		toggleAllLocations: function(e) {
			e.preventDefault();

			var $button = $(e.currentTarget);
			var $section = $button.closest('.asenha-backup-history, .asenha-local-backups-section');
			if (!$section.length) {
				$section = $button.closest('.asenha-backup-section');
			}
			if (!$section.length) {
				return;
			}

			var $locationToggles = $section.find('details.asenha-backup-locations-toggle');
			if (!$locationToggles.length) {
				return;
			}

			var allOpen = true;
			$locationToggles.each(function() {
				if (!$(this).prop('open')) {
					allOpen = false;
					return false;
				}
			});

			$locationToggles.prop('open', !allOpen);

			var expandLabel = String($button.attr('data-expand-label') || '');
			var collapseLabel = String($button.attr('data-collapse-label') || '');
			if (!expandLabel) {
				expandLabel = 'Expand Locations';
			}
			if (!collapseLabel) {
				collapseLabel = 'Collapse Locations';
			}

			$button.text(allOpen ? expandLabel : collapseLabel);
		},

		/**
		 * Expand/collapse all incrementals rows in the current archives section.
		 *
		 * This targets chain incrementals disclosures and does not affect
		 * the inner locations disclosures.
		 */
		toggleAllIncrementals: function(e) {
			e.preventDefault();

			var self = this;
			var $button = $(e.currentTarget);
			var $section = $button.closest('.asenha-backup-history, .asenha-local-backups-section, .asenha-storage-origin');
			if (!$section.length) {
				$section = $button.closest('.asenha-backup-section');
			}
			if (!$section.length) {
				return;
			}

			var $incrementalsToggles = $section.find('details.asenha-chain-incrementals');
			if (!$incrementalsToggles.length) {
				return;
			}

			var allOpen = true;
			$incrementalsToggles.each(function() {
				if (!$(this).prop('open')) {
					allOpen = false;
					return false;
				}
			});

			var shouldOpen = !allOpen;
			$incrementalsToggles.prop('open', shouldOpen);
			$incrementalsToggles.toggleClass('open', shouldOpen);
			$incrementalsToggles.toggleClass('closed', !shouldOpen);

			var expandLabel = String($button.attr('data-expand-label') || '');
			var collapseLabel = String($button.attr('data-collapse-label') || '');
			if (!expandLabel) {
				expandLabel = 'Expand Incrementals';
			}
			if (!collapseLabel) {
				collapseLabel = 'Collapse Incrementals';
			}

			$button.text(shouldOpen ? collapseLabel : expandLabel);

			if (shouldOpen) {
				if (typeof window.requestAnimationFrame === 'function') {
					window.requestAnimationFrame(function() {
						self.syncOpenIncrementalsInScope($section);
					});
				} else {
					self.syncOpenIncrementalsInScope($section);
				}
			}
		},

		/**
		 * Resolve the archive list scope for a policy filter control.
		 *
		 * @param {jQuery} $select Policy filter select element.
		 * @return {jQuery}
		 */
		getArchivePolicyFilterScope: function($select) {
			return $select.closest('.asenha-backup-history, .asenha-local-backups-section, .asenha-storage-origin');
		},

		/**
		 * Whether a baseline archive row should be visible for the active policy filter.
		 *
		 * @param {jQuery} $row Baseline chain row.
		 * @param {string} selected Selected filter value.
		 * @param {string} manualVal Manual-backups filter token.
		 * @param {string} withNotesVal With-notes filter token.
		 * @return {boolean}
		 */
		shouldShowArchiveChainRow: function($row, selected, manualVal, withNotesVal) {
			var pid = String($row.attr('data-policy-id') || '');
			var hasNote = String($row.attr('data-has-note') || '0');

			if (selected === '') {
				return true;
			}
			if (manualVal !== '' && selected === manualVal) {
				return (pid === '');
			}
			if (withNotesVal !== '' && selected === withNotesVal) {
				return (hasNote === '1');
			}
			return (pid !== '' && pid === selected);
		},

		/**
		 * Apply archive policy filter visibility within a section.
		 *
		 * @param {jQuery} $section Archive list scope.
		 * @param {jQuery} [$select] Optional policy filter select; defaults to first in scope.
		 */
		applyArchivePolicyFilter: function($section, $select) {
			if (!$section || !$section.length) {
				return;
			}

			$select = $select && $select.length ? $select : $section.find('.asenha-archive-policy-filter').first();
			if (!$select.length) {
				return;
			}

			var selected = String($select.val() || '');
			var manualVal = String($select.attr('data-manual-filter-value') || '');
			var withNotesVal = String($select.attr('data-with-notes-filter-value') || '');
			var self = this;

			$section.find('tbody tr.asenha-chain-base-row').each(function() {
				var $row = $(this);
				var show = self.shouldShowArchiveChainRow($row, selected, manualVal, withNotesVal);
				$row.toggle(show);
				var $next = $row.next('tr.asenha-chain-incrementals-row');
				if ($next.length) {
					$next.toggle(show);
				}
			});
		},

		/**
		 * Filter archive chain rows by backup policy (Backup / Restore / Storage tabs).
		 *
		 * @param {Event} e Change event from .asenha-archive-policy-filter.
		 */
		onArchivePolicyFilterChange: function(e) {
			var $select = $(e.currentTarget);
			var $section = this.getArchivePolicyFilterScope($select);
			if (!$section.length) {
				return;
			}
			this.applyArchivePolicyFilter($section, $select);
		},

		/**
		 * Initialize the create-backup notes editor in the template picker.
		 */
		initCreateBackupNoteEditor: function() {
			if (!window.AsenhaSiteBackupArchiveNotes) {
				return;
			}
			var $fieldset = $('#asenha-backup-notes-fieldset');
			if (!$fieldset.length) {
				return;
			}
			window.AsenhaSiteBackupArchiveNotes.refreshEditorsInContext($fieldset, {
				preventFocus: true,
				focusReturnTarget: this.pendingBackupFocusButton || null
			});
		},

		/**
		 * Clear the create-backup notes editor after a backup starts.
		 */
		clearCreateBackupNoteEditor: function() {
			var $fieldset = $('#asenha-backup-notes-fieldset');
			var $textarea = $('#asenha-backup-note');
			if (!$textarea.length) {
				return;
			}

			if (window.AsenhaSiteBackupArchiveNotes) {
				window.AsenhaSiteBackupArchiveNotes.removeEditorsInContext($fieldset);
			}
			$textarea.val('');
			this.initCreateBackupNoteEditor();
		},

		/**
		 * Read note content from the create-backup editor.
		 *
		 * @return {string}
		 */
		getCreateBackupNoteContent: function() {
			var $textarea = $('#asenha-backup-note');
			if (!$textarea.length) {
				return '';
			}
			if (window.AsenhaSiteBackupArchiveNotes) {
				return window.AsenhaSiteBackupArchiveNotes.readEditorContent($textarea);
			}
			return String($textarea.val() || '');
		},

		/**
		 * Expand or collapse all archive note panels in a section.
		 *
		 * @param {Event} e Click event from .asenha-toggle-all-notes.
		 */
		toggleAllNotes: function(e) {
			e.preventDefault();

			var $control = $(e.currentTarget);
			var $section = $control.closest('.asenha-backup-history, .asenha-local-backups-section, .asenha-full-backup-archives-section, .asenha-storage-origin');
			if (!$section.length) {
				return;
			}

			var $panels = $section.find('.asenha-archive-note-panel');
			if (!$panels.length) {
				return;
			}

			var allOpen = true;
			$panels.each(function() {
				if ($(this).prop('hidden')) {
					allOpen = false;
					return false;
				}
			});

			var shouldOpen = !allOpen;
			$panels.prop('hidden', !shouldOpen);
			$section.find('.asenha-archive-note-toggle').attr('aria-expanded', shouldOpen ? 'true' : 'false');

			var expandLabel = String($control.attr('data-expand-label') || asenhaSbT('expandNotes') || 'Expand Notes');
			var collapseLabel = String($control.attr('data-collapse-label') || asenhaSbT('collapseNotes') || 'Collapse Notes');
			$control.text(shouldOpen ? collapseLabel : expandLabel);
		},

		/**
		 * Toggle a single archive note panel.
		 *
		 * @param {Event} e Click event from .asenha-archive-note-toggle.
		 */
		onArchiveNoteToggle: function(e) {
			e.preventDefault();

			var $toggle = $(e.currentTarget);
			var panelId = String($toggle.attr('aria-controls') || '');
			var $panel = panelId ? $('#' + panelId) : $toggle.closest('.column-filename').find('.asenha-archive-note-panel').first();
			if (!$panel.length) {
				return;
			}

			var isOpen = !$panel.prop('hidden');
			$panel.prop('hidden', isOpen);
			$toggle.attr('aria-expanded', isOpen ? 'false' : 'true');
		},

		/**
		 * Show inline archive note editor for a row.
		 *
		 * @param {Event} e Click event from .asenha-archive-note-edit.
		 */
		onArchiveNoteEdit: function(e) {
			e.preventDefault();

			var $btn = $(e.currentTarget);
			var $cell = $btn.closest('.column-filename');
			var $panel = $cell.find('.asenha-archive-note-panel').first();
			var $wrap = $cell.find('.asenha-archive-note-editor-wrap').first();
			if (!$wrap.length) {
				return;
			}

			$panel.prop('hidden', true);
			$wrap.prop('hidden', false);

			var $textarea = $wrap.find('.asenha-archive-note-textarea').first();
			$wrap.attr('data-original-note', String($textarea.val() || ''));

			if (window.AsenhaSiteBackupArchiveNotes) {
				window.AsenhaSiteBackupArchiveNotes.refreshEditorsInContext($wrap);
			}
		},

		/**
		 * Cancel inline archive note editing and restore the previous content.
		 *
		 * @param {Event} e Click event from .asenha-archive-note-cancel.
		 */
		onArchiveNoteCancel: function(e) {
			e.preventDefault();

			var $wrap = $(e.currentTarget).closest('.asenha-archive-note-editor-wrap');
			var $cell = $wrap.closest('.column-filename');
			var $panel = $cell.find('.asenha-archive-note-panel').first();
			var $textarea = $wrap.find('.asenha-archive-note-textarea').first();
			var originalNote = String($wrap.attr('data-original-note') || $textarea.val() || '');

			if (window.AsenhaSiteBackupArchiveNotes) {
				window.AsenhaSiteBackupArchiveNotes.removeEditorsInContext($wrap);
			}

			$textarea.val(originalNote);
			$wrap.removeAttr('data-original-note');
			$wrap.prop('hidden', true);
			$panel.prop('hidden', false);
		},

		/**
		 * Update archive note display for all rows sharing a baseline filename.
		 *
		 * @param {jQuery} $scope Archive list scope.
		 * @param {string} baselineFilename Baseline archive filename.
		 * @param {string} noteHtml Sanitized note HTML.
		 * @param {boolean} hasNote Whether the chain has note content.
		 */
		updateArchiveNoteDisplayInScope: function($scope, baselineFilename, noteHtml, hasNote) {
			if (!$scope || !$scope.length || !baselineFilename) {
				return;
			}

			var placeholder = asenhaSbT('archiveNotePlaceholder') || 'No note for this backup.';
			var contentHtml = hasNote ? noteHtml : '<p class="asenha-archive-note-placeholder">' + $('<div/>').text(placeholder).html() + '</p>';

			$scope.find('.asenha-archive-note-editor-wrap').each(function() {
				var $wrap = $(this);
				if (String($wrap.attr('data-baseline-filename') || '') !== baselineFilename) {
					return;
				}

				var $cell = $wrap.closest('.column-filename');
				$cell.find('.asenha-archive-note-content').html(contentHtml);
				$cell.find('.asenha-archive-note-textarea').val(hasNote ? noteHtml : '');
				$cell.find('.asenha-archive-note-toggle').toggleClass('asenha-archive-note-toggle--has-note', !!hasNote);
			});

			$scope.find('tr.asenha-chain-base-row').each(function() {
				var $row = $(this);
				if (String($row.attr('data-filename') || '') === baselineFilename) {
					$row.attr('data-has-note', hasNote ? '1' : '0');
				}
			});
		},

		/**
		 * Re-apply the active archive policy filter after a note save.
		 *
		 * @param {jQuery} $scope Archive list scope.
		 * @param {string} baselineFilename Baseline archive filename.
		 */
		refreshArchivePolicyFilterAfterNoteSave: function($scope, baselineFilename) {
			if (!$scope || !$scope.length) {
				return;
			}

			var $select = $scope.find('.asenha-archive-policy-filter').first();
			if (!$select.length) {
				return;
			}

			var withNotesVal = String($select.attr('data-with-notes-filter-value') || '');
			if (withNotesVal === '' || String($select.val() || '') !== withNotesVal) {
				return;
			}

			var $row = $scope.find('tr.asenha-chain-base-row').filter(function() {
				return String($(this).attr('data-filename') || '') === baselineFilename;
			}).first();
			if (!$row.length) {
				this.applyArchivePolicyFilter($scope, $select);
				return;
			}

			var show = this.shouldShowArchiveChainRow(
				$row,
				withNotesVal,
				String($select.attr('data-manual-filter-value') || ''),
				withNotesVal
			);
			$row.toggle(show);
			var $next = $row.next('tr.asenha-chain-incrementals-row');
			if ($next.length) {
				$next.toggle(show);
			}
		},

		/**
		 * Save an inline archive note via AJAX.
		 *
		 * @param {Event} e Click event from .asenha-archive-note-save.
		 */
		onArchiveNoteSave: function(e) {
			e.preventDefault();

			var self = this;
			var $btn = $(e.currentTarget);
			var $wrap = $btn.closest('.asenha-archive-note-editor-wrap');
			var $textarea = $wrap.find('.asenha-archive-note-textarea').first();
			var filename = String($wrap.attr('data-filename') || '');
			var baselineFilename = String($wrap.attr('data-baseline-filename') || filename);
			var context = String($wrap.attr('data-context') || 'local');
			var originId = String($wrap.attr('data-origin-id') || '');
			var note = '';

			if (window.AsenhaSiteBackupArchiveNotes) {
				note = window.AsenhaSiteBackupArchiveNotes.readEditorContent($textarea);
			} else {
				note = String($textarea.val() || '');
			}

			$btn.prop('disabled', true);

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_save_backup_archive_note',
					nonce: asenhaSiteBackup.nonce,
					filename: filename,
					baseline_filename: baselineFilename,
					note: note,
					context: context,
					origin_id: originId
				},
				success: function(response) {
					if (!response || !response.success) {
						var msg = response && response.data && response.data.message ? response.data.message : (asenhaSbT('archiveNoteSaveFailed') || 'Failed to save backup note.');
						self.showNotice('error', msg);
						return;
					}

					var hasNote = !!(response.data && response.data.has_note);
					var noteHtml = response.data && response.data.note_html ? String(response.data.note_html) : '';
					var $cell = $wrap.closest('.column-filename');
					var $panel = $cell.find('.asenha-archive-note-panel').first();
					var $scope = $wrap.closest('.asenha-backup-history, .asenha-local-backups-section, .asenha-full-backup-archives-section, .asenha-storage-origin');

					if (window.AsenhaSiteBackupArchiveNotes) {
						window.AsenhaSiteBackupArchiveNotes.removeEditorsInContext($wrap);
					}

					self.updateArchiveNoteDisplayInScope($scope, baselineFilename, noteHtml, hasNote);
					$wrap.prop('hidden', true);
					$panel.prop('hidden', false);
					self.refreshArchivePolicyFilterAfterNoteSave($scope, baselineFilename);
				},
				error: function() {
					self.showNotice('error', asenhaSbT('archiveNoteSaveFailed') || 'Failed to save backup note.');
				},
				complete: function() {
					$btn.prop('disabled', false);
				}
			});
		},

		/**
		 * Initialize Backup > Create destination UI (local + remote).
		 *
		 * This only wires the UI and loads the remote location list; the selected values
		 * are read at backup start time.
		 *
		 * @since 8.7.0
		 */
		initBackupDestinationUi: function() {
			if (!$('#asenha-backup-destination').length) {
				return;
			}

			// Ensure correct initial visibility.
			this.onBackupDestinationChange();
		},

		/**
		 * Handle destination toggles (Local storage / Remote locations).
		 *
		 * @since 8.7.0
		 */
		onBackupDestinationChange: function() {
			var $remoteToggle = $('#asenha-backup-destination-remote');
			var $remotesWrap = $('#asenha-backup-destination-remotes');

			if (!$remoteToggle.length || !$remotesWrap.length) {
				return;
			}

			var remoteEnabled = $remoteToggle.is(':checked');
			$remotesWrap.toggle(!!remoteEnabled);

			if (remoteEnabled) {
				this.refreshBackupDestinationRemoteLocations();
			}
		},

		/**
		 * Load and render remote locations as destination checkboxes.
		 *
		 * @since 8.7.0
		 */
		refreshBackupDestinationRemoteLocations: function() {
			var self = this;
			var $list = $('#asenha-backup-destination-remotes-list');
			if (!$list.length) {
				return;
			}

			// Avoid wiping existing selections while refreshing.
			var selected = {};
			$list.find('input.asenha-backup-destination-remote-id:checked').each(function() {
				selected[String($(this).val() || '')] = true;
			});

			$list.html('<p class="description">' + this.escapeHtml(asenhaSbT('loading')) + '</p>');

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_get_backup_locations',
					nonce: asenhaSiteBackup.nonce
				}
			}).done(function(resp) {
				// If an incremental lock is waiting for the remote list, allow it to proceed.
				if (self.incrementalDestinationLock && self.incrementalDestinationLock.active) {
					self.incrementalDestinationLock.waiting_for_remote_list = false;
				}

				if (!resp || !resp.success || !resp.data) {
					$list.html('<p class="description">' + self.escapeHtml(asenhaSbT('failedToLoadRemoteLocations')) + '</p>');
					self.maybeApplyIncrementalDestinationLockFromRenderedRemotes();
					return;
				}

				// Cache response for later use (e.g., label generation).
				self.locationsCache = resp.data.locations || {};

				var remotes = [];
				if (self.locationsCache && self.locationsCache.remotes && $.isArray(self.locationsCache.remotes)) {
					remotes = self.locationsCache.remotes;
				}

				// Filter: enabled, connected, supported remote types.
				var eligible = [];
				var allowedTypes = { sftp: true, webdav: true, wp_site: true, s3: true, s3_compatible: true, google_drive: true, dropbox: true };
				for (var i = 0; i < remotes.length; i++) {
					var r = remotes[i] || {};
					if (!r || !r.id) {
						continue;
					}
					var t = String(r.type || '');
					if (!allowedTypes[t]) {
						continue;
					}
					if (!r.enabled) {
						continue;
					}

					var cfg = r.config || {};
					var connected = false;
					if (t === 'google_drive' || t === 'dropbox') {
						connected = !!cfg.refresh_token_is_set;
					} else {
						connected = (String(cfg.connection_state || '') === 'connected');
					}
					if (!connected) {
						continue;
					}

					eligible.push(r);
				}

				if (!eligible.length) {
					$list.html('<p class="description">' + self.escapeHtml(asenhaSbT('noConnectedRemoteLocations')) + '</p>');
					self.maybeApplyIncrementalDestinationLockFromRenderedRemotes();
					return;
				}

				var esc = function(s) { return self.escapeHtml(String(s || '')); };
				var html = '';
				for (var j = 0; j < eligible.length; j++) {
					var loc = eligible[j] || {};
					var id = String(loc.id || '');
					var type = String(loc.type || '');
					var title = String(loc.title || '');
					var label = self.formatRemoteLocationLabel(type, title);

					html += '<label>';
					html += '<input type="checkbox" class="asenha-backup-destination-remote-id" value="' + esc(id) + '"' + (selected[id] ? ' checked' : '') + '> ';
					html += esc(label);
					html += '</label>';
				}

				$list.html(html);
				self.maybeApplyIncrementalDestinationLockFromRenderedRemotes();
			}).fail(function() {
				if (self.incrementalDestinationLock && self.incrementalDestinationLock.active) {
					self.incrementalDestinationLock.waiting_for_remote_list = false;
				}
				$list.html('<p class="description">' + self.escapeHtml(asenhaSbT('failedToLoadRemoteLocations')) + '</p>');
				self.maybeApplyIncrementalDestinationLockFromRenderedRemotes();
			});
		},

		onBaselinePickerSelectChange: function(e) {
			e.preventDefault();
			var filename = String($('#asenha-baseline-picker-select').val() || '');
			this.applyIncrementalDestinationLock(filename);
			this.applyIncrementalMultipartLock(filename);
			this.applyIncrementalEncryptionLock(filename);
		},

		/**
		 * Enable/disable Backup > Create multipart controls (Split large backups).
		 *
		 * @param {boolean} locked
		 * @param {string}  hint Optional hint text to show under Split options.
		 */
		setBackupMultipartUiLocked: function(locked, hint) {
			locked = !!locked;
			hint = String(hint || '');

			var $enabled = $('#asenha-multipart-enabled');
			var $partBytes = $('#asenha-multipart-part-bytes');

			$enabled.prop('disabled', locked);
			$partBytes.prop('disabled', locked || !$enabled.is(':checked'));

			var $wrap = $('.asenha-backup-options');
			if ($wrap.length) {
				var $hint = $wrap.find('.asenha-incremental-multipart-hint');
				var $multipartDescription = $wrap.find('.asenha-multipart-description').first();
				if (locked && hint) {
					if (!$hint.length) {
						$hint = $('<p class="description asenha-baseline-lock-hint asenha-incremental-multipart-hint"></p>');
					}
					$hint.addClass('asenha-baseline-lock-hint');
					$hint.text(hint);
					if ($multipartDescription.length) {
						$multipartDescription.after($hint);
					} else {
						$wrap.append($hint);
					}
				} else {
					$hint.remove();
				}
			}
		},

		clearIncrementalMultipartLock: function() {
			if (this.incrementalMultipartLock && this.incrementalMultipartLock.active) {
				// Restore prior user setting.
				var prev = this.incrementalMultipartLock.prev || {};
				var $enabled = $('#asenha-multipart-enabled');
				var $partBytes = $('#asenha-multipart-part-bytes');

				if ($enabled.length) {
					$enabled.prop('checked', !!prev.enabled);
				}
				if ($partBytes.length && prev.part_bytes) {
					$partBytes.val(String(prev.part_bytes));
				}

				// Re-enable controls and refresh UI.
				this.setBackupMultipartUiLocked(false, '');
				$('.asenha-multipart-description').toggle(!!$enabled.is(':checked'));
			}
			this.incrementalMultipartLock = null;
		},

		clearIncrementalEncryptionLock: function() {
			if (this.incrementalEncryptionLock && this.incrementalEncryptionLock.active) {
				var prev = this.incrementalEncryptionLock.prev || {};
				var $enabled = $('#asenha-backup-archive-encryption-enabled');
				var $passphrase = $('#asenha-backup-archive-passphrase');
				var $passphraseConfirm = $('#asenha-backup-archive-passphrase-confirm');
				var $fields = $('#asenha-backup-archive-encryption-fields');

				if ($enabled.length) {
					$enabled.prop('checked', !!prev.enabled);
				}
				if ($passphrase.length && typeof prev.passphrase !== 'undefined') {
					$passphrase.val(String(prev.passphrase || ''));
				}
				if ($passphraseConfirm.length && typeof prev.passphrase_confirm !== 'undefined') {
					$passphraseConfirm.val(String(prev.passphrase_confirm || ''));
				}

				this.setBackupEncryptionUiLocked(false, '');
				$fields.toggle(!!$enabled.is(':checked'));
			} else {
				this.setBackupEncryptionUiLocked(false, '');
			}

			this.incrementalEncryptionLock = null;
		},

		clearIncrementalDestinationLock: function() {
			this.incrementalDestinationLock = null;
			this.setBackupDestinationUiLocked(false, '');
		},

		/**
		 * Enable/disable Backup > Create archive encryption controls.
		 *
		 * @param {boolean} locked
		 * @param {string}  hint Optional hint text shown under encryption controls.
		 */
		setBackupEncryptionUiLocked: function(locked, hint) {
			locked = !!locked;
			hint = String(hint || '');

			var $enabled = $('#asenha-backup-archive-encryption-enabled');
			var $passphrase = $('#asenha-backup-archive-passphrase');
			var $passphraseConfirm = $('#asenha-backup-archive-passphrase-confirm');

			$enabled.prop('disabled', locked);
			$passphrase.prop('disabled', locked);
			$passphraseConfirm.prop('disabled', locked);

			var $wrap = $('.asenha-backup-options .asenha-backup-options-encryption');
			if (!$wrap.length) {
				$wrap = $('.asenha-backup-options');
			}
			if ($wrap.length) {
				var $hint = $wrap.find('.asenha-incremental-encryption-hint');
				if (locked && hint) {
					if (!$hint.length) {
						$hint = $('<p class="description asenha-baseline-lock-hint asenha-incremental-encryption-hint"></p>');
					}
					$hint.addClass('asenha-baseline-lock-hint');
					$hint.text(hint);
					var $fields = $wrap.find('#asenha-backup-archive-encryption-fields').first();
					if ($fields.length) {
						$fields.after($hint);
					} else {
						$wrap.append($hint);
					}
				} else {
					$hint.remove();
				}
			}
		},

		/**
		 * Enable/disable Backup > Create destination controls.
		 *
		 * @param {boolean} locked
		 * @param {string}  hint Optional hint text to show under Locations.
		 */
		setBackupDestinationUiLocked: function(locked, hint) {
			locked = !!locked;
			hint = String(hint || '');

			var $local = $('#asenha-backup-destination-local');
			var $remote = $('#asenha-backup-destination-remote');
			var $remoteIds = $('.asenha-backup-destination-remote-id');

			$local.prop('disabled', locked);
			$remote.prop('disabled', locked);
			$remoteIds.prop('disabled', locked);

			var $dest = $('#asenha-backup-destination');
			if ($dest.length) {
				var $hint = $dest.find('.asenha-incremental-destination-hint');
				if (locked && hint) {
					if (!$hint.length) {
						$hint = $('<p class="description asenha-baseline-lock-hint asenha-incremental-destination-hint"></p>');
						$dest.append($hint);
					}
					$hint.addClass('asenha-baseline-lock-hint');
					$hint.text(hint);
				} else {
					$hint.remove();
				}
			}
		},

		/**
		 * Best-effort: if an incremental destination lock is active, apply it after remote destination list renders.
		 */
		maybeApplyIncrementalDestinationLockFromRenderedRemotes: function() {
			if (!this.incrementalDestinationLock || !this.incrementalDestinationLock.active) {
				return;
			}
			this.applyIncrementalDestinationLock(this.incrementalDestinationLock.filename || '');
		},

		/**
		 * Lock Backup > Create destinations to match selected baseline.
		 *
		 * Fallback policy: if any required baseline remote location is not eligible/selectable,
		 * fall back to Local-only and lock controls.
		 *
		 * @param {string} filename Baseline filename.
		 */
		applyIncrementalDestinationLock: function(filename) {
			filename = String(filename || '');
			if (!this.isIncrementalFromBaselineChecked()) {
				this.clearIncrementalDestinationLock();
				return;
			}

			if (!filename || !this.incrementalBaselinesCache || !this.incrementalBaselinesCache[filename]) {
				// No baseline selected yet: keep UI editable.
				this.clearIncrementalDestinationLock();
				return;
			}

			var required = this.incrementalBaselinesCache[filename] || {};
			var requiredLocal = !!required.local_enabled;
			var requiredRemotes = $.isArray(required.remote_location_ids) ? required.remote_location_ids.slice(0) : [];
			requiredRemotes = requiredRemotes.map(function(v) { return String(v || ''); }).filter(function(v) { return !!v; });

			// Preserve prior lock flags when re-applying (e.g. after remote list renders).
			var prevLock = (this.incrementalDestinationLock && this.incrementalDestinationLock.active && this.incrementalDestinationLock.filename === filename)
				? this.incrementalDestinationLock
				: null;

			this.incrementalDestinationLock = {
				active: true,
				filename: filename,
				requiredLocal: requiredLocal,
				requiredRemotes: requiredRemotes,
				waiting_for_remote_list: prevLock ? !!prevLock.waiting_for_remote_list : false
			};

			var $local = $('#asenha-backup-destination-local');
			var $remote = $('#asenha-backup-destination-remote');
			var $remotesWrap = $('#asenha-backup-destination-remotes');
			if (!$local.length || !$remote.length || !$remotesWrap.length) {
				return;
			}

			// If baseline expects remotes, ensure remote UI is visible and list loaded.
			// IMPORTANT: do not call onBackupDestinationChange() here, because it always refreshes the
			// remote list and can keep resetting it to "Loading..." (render loop).
			if (requiredRemotes.length) {
				if (!$remote.is(':checked')) {
					$remote.prop('checked', true);
				}
				$remotesWrap.toggle(true);

				// If the remote list isn't rendered yet, load it once and re-apply after render callback.
				if (!$('.asenha-backup-destination-remote-id').length) {
					if (!this.incrementalDestinationLock.waiting_for_remote_list) {
						this.incrementalDestinationLock.waiting_for_remote_list = true;
						this.refreshBackupDestinationRemoteLocations();
					}
					return;
				}
			} else {
				// Baseline does not require remote destinations.
				$remote.prop('checked', false);
				$remotesWrap.toggle(false);
			}

			// Determine which required remote IDs are currently selectable in the destination UI.
			var eligibleIds = {};
			$('.asenha-backup-destination-remote-id').each(function() {
				var id = String($(this).val() || '');
				if (id) {
					eligibleIds[id] = true;
				}
			});

			var resolvedRemotes = requiredRemotes.filter(function(id) { return !!eligibleIds[id]; });

			// Strict match: if any required remote is missing/unselectable, fall back to Local-only.
			if (requiredRemotes.length && resolvedRemotes.length !== requiredRemotes.length) {
				$local.prop('checked', true);
				$remote.prop('checked', false);
				$remotesWrap.toggle(false);
				this.setBackupDestinationUiLocked(true, asenhaSbT('incrementalDestinationsFallbackLocalOnly'));
				return;
			}

			// Apply required selections.
			$local.prop('checked', !!requiredLocal);
			$remote.prop('checked', !!resolvedRemotes.length);
			$remotesWrap.toggle(!!resolvedRemotes.length);

			if (resolvedRemotes.length) {
				$('.asenha-backup-destination-remote-id').prop('checked', false);
				resolvedRemotes.forEach(function(id) {
					$('.asenha-backup-destination-remote-id').filter(function() {
						return String($(this).val() || '') === String(id || '');
					}).prop('checked', true);
				});
			}

			this.setBackupDestinationUiLocked(true, asenhaSbT('incrementalDestinationsLockedHint'));
		},

		/**
		 * Lock Backup > Create multipart (Split large backups) settings to match selected baseline.
		 *
		 * @param {string} filename Baseline filename.
		 */
		applyIncrementalMultipartLock: function(filename) {
			filename = String(filename || '');
			if (!this.isIncrementalFromBaselineChecked()) {
				this.clearIncrementalMultipartLock();
				return;
			}

			if (!filename || !this.incrementalBaselinesCache || !this.incrementalBaselinesCache[filename]) {
				this.clearIncrementalMultipartLock();
				return;
			}

			var required = this.incrementalBaselinesCache[filename] || {};
			var mp = required.multipart || {};
			var requiredEnabled = !!mp.enabled;
			var requiredPartBytes = parseInt(mp.part_bytes || '0', 10) || 0;

			// Preserve user's prior selection once when entering locked state.
			if (!this.incrementalMultipartLock || !this.incrementalMultipartLock.active) {
				this.incrementalMultipartLock = {
					active: true,
					filename: filename,
					prev: {
						enabled: $('#asenha-multipart-enabled').is(':checked'),
						part_bytes: parseInt($('#asenha-multipart-part-bytes').val() || '0', 10) || 0
					}
				};
			} else {
				this.incrementalMultipartLock.filename = filename;
			}

			// Apply baseline settings.
			var $enabled = $('#asenha-multipart-enabled');
			var $partBytes = $('#asenha-multipart-part-bytes');
			if ($enabled.length) {
				$enabled.prop('checked', requiredEnabled);
			}
			if ($partBytes.length && requiredPartBytes > 0) {
				$partBytes.val(String(requiredPartBytes));
			}

			// Keep the description visibility consistent with the checkbox.
			$('.asenha-multipart-description').toggle(!!requiredEnabled);

			// Lock controls.
			this.setBackupMultipartUiLocked(true, asenhaSbT('incrementalMultipartLockedHint'));
		},

		/**
		 * Lock Backup > Create archive encryption settings to match selected baseline.
		 *
		 * @param {string} filename Baseline filename.
		 */
		applyIncrementalEncryptionLock: function(filename) {
			filename = String(filename || '');
			if (!this.isIncrementalFromBaselineChecked()) {
				this.clearIncrementalEncryptionLock();
				return;
			}

			if (!filename || !this.incrementalBaselinesCache || !this.incrementalBaselinesCache[filename]) {
				this.clearIncrementalEncryptionLock();
				return;
			}

			var required = this.incrementalBaselinesCache[filename] || {};
			var enc = required.encryption || {};
			var requiredEnabled = !!enc.enabled || !!enc.passphrase_required;

			if (!this.incrementalEncryptionLock || !this.incrementalEncryptionLock.active) {
				this.incrementalEncryptionLock = {
					active: true,
					filename: filename,
					required_enabled: requiredEnabled,
					prev: {
						enabled: $('#asenha-backup-archive-encryption-enabled').is(':checked'),
						passphrase: String($('#asenha-backup-archive-passphrase').val() || ''),
						passphrase_confirm: String($('#asenha-backup-archive-passphrase-confirm').val() || '')
					}
				};
			} else {
				this.incrementalEncryptionLock.filename = filename;
				this.incrementalEncryptionLock.required_enabled = requiredEnabled;
			}

			var $enabled = $('#asenha-backup-archive-encryption-enabled');
			var $passphrase = $('#asenha-backup-archive-passphrase');
			var $passphraseConfirm = $('#asenha-backup-archive-passphrase-confirm');
			var $fields = $('#asenha-backup-archive-encryption-fields');

			if ($enabled.length) {
				$enabled.prop('checked', requiredEnabled);
			}
			if ($passphrase.length) {
				$passphrase.val('');
			}
			if ($passphraseConfirm.length) {
				$passphraseConfirm.val('');
			}
			$fields.toggle(!!requiredEnabled);

			var lockHint = asenhaSbT('incrementalEncryptionLockedHint') || 'Archive encryption is locked to match the selected baseline.';
			if (requiredEnabled) {
				lockHint = asenhaSbT('incrementalEncryptionReusePassphraseHint') || 'Archive encryption is locked to match the selected baseline. The baseline passphrase will be reused automatically.';
			}

			this.setBackupEncryptionUiLocked(true, lockHint);
		},

		/**
		 * Check whether details element is a chain action popup.
		 *
		 * @param {HTMLElement} detailsEl <details> element.
		 * @return {boolean}
		 */
		isChainActionPopupDetails: function(detailsEl) {
			return !!(detailsEl && detailsEl.classList && detailsEl.classList.contains('asenha-chain-action-popup'));
		},

		/**
		 * Apply default dropdown horizontal alignment for multipart popups.
		 *
		 * @param {HTMLElement} detailsEl <details> element.
		 * @param {HTMLElement} listEl Popup list element.
		 */
		applyMultipartDownloadDropdownDefaultAlignment: function(detailsEl, listEl) {
			if (!listEl) {
				return;
			}

			if (this.isChainActionPopupDetails(detailsEl)) {
				listEl.style.left = 'auto';
				listEl.style.right = '0px';
				return;
			}

			listEl.style.left = '';
			listEl.style.right = '';
		},

		/**
		 * Reset inline multipart dropdown horizontal position overrides.
		 *
		 * @param {HTMLElement} detailsEl <details> element.
		 */
		resetMultipartDownloadDropdownPosition: function(detailsEl) {
			if (!detailsEl) {
				return;
			}

			var list = detailsEl.querySelector('.asenha-multipart-parts-list');
			if (!list) {
				return;
			}

			this.applyMultipartDownloadDropdownDefaultAlignment(detailsEl, list);
		},

		/**
		 * Get horizontal bounds for multipart dropdown clamping.
		 *
		 * Bounds are the intersection of viewport bounds and the nearest
		 * clipping ancestor bounds (first ancestor whose overflow-x is not visible).
		 *
		 * @param {HTMLElement} detailsEl <details> element.
		 * @param {number} margin Minimum screen margin.
		 * @return {Object|null}
		 */
		getMultipartDownloadHorizontalBounds: function(detailsEl, margin) {
			var viewportW = window.innerWidth || document.documentElement.clientWidth || 0;
			if (!viewportW) {
				return null;
			}

			var minLeft = margin;
			var maxRight = viewportW - margin;
			var node = detailsEl ? detailsEl.parentElement : null;

			while (node && node !== document.body && node !== document.documentElement) {
				var style = window.getComputedStyle(node);
				var overflowX = style ? String(style.overflowX || '').toLowerCase() : 'visible';
				if (overflowX && overflowX !== 'visible') {
					var clipRect = node.getBoundingClientRect();
					if (clipRect && clipRect.width > 0) {
						minLeft = Math.max(minLeft, clipRect.left + margin);
						maxRight = Math.min(maxRight, clipRect.right - margin);
					}
					break;
				}
				node = node.parentElement;
			}

			if (maxRight <= minLeft) {
				minLeft = margin;
				maxRight = viewportW - margin;
			}

			return {
				minLeft: minLeft,
				maxRight: maxRight
			};
		},

		/**
		 * Adjust multipart dropdown dimensions and position to fit viewport space.
		 *
		 * @param {HTMLElement} detailsEl <details> element.
		 */
		adjustMultipartDownloadDropdownHeight: function(detailsEl) {
			if (!detailsEl) {
				return;
			}

			var list = detailsEl.querySelector('.asenha-multipart-parts-list');
			if (!list) {
				return;
			}

			// Start from the default alignment on each open.
			this.applyMultipartDownloadDropdownDefaultAlignment(detailsEl, list);

			var rect = list.getBoundingClientRect();
			var viewportH = window.innerHeight || document.documentElement.clientHeight || 0;
			if (!viewportH || !rect) {
				return;
			}

			// Leave a small margin to avoid touching the bottom of the viewport.
			var margin = 16;
			var available = Math.floor(viewportH - rect.top - margin);
			var minH = 140;
			var maxH = Math.max(minH, available);
			list.style.maxHeight = String(maxH) + 'px';

			// Clamp horizontal position inside effective visible bounds.
			var bounds = this.getMultipartDownloadHorizontalBounds(detailsEl, margin);
			if (!bounds) {
				return;
			}

			rect = list.getBoundingClientRect();
			if (!rect) {
				return;
			}

			var shiftX = 0;
			if (rect.right > bounds.maxRight) {
				shiftX -= (rect.right - bounds.maxRight);
			}

			if ((rect.left + shiftX) < bounds.minLeft) {
				shiftX += (bounds.minLeft - (rect.left + shiftX));
			}

			if (Math.abs(shiftX) >= 1) {
				if (this.isChainActionPopupDetails(detailsEl)) {
					// Right-anchored popups should keep their right edge attached.
					list.style.left = 'auto';
					list.style.right = String(Math.round(-shiftX)) + 'px';
				} else {
					list.style.left = String(Math.round(shiftX)) + 'px';
					list.style.right = 'auto';
				}
			}
		},

		/**
		 * Build checklist HTML for given steps
		 */
		buildChecklist: function(steps, checkpointLabels) {
			var html = '';
			for (var i = 0; i < steps.length; i++) {
				var step = steps[i];
				var label = checkpointLabels[step] || step;
				html += '<div class="asenha-checkpoint pending" data-step="' + step + '">';
				html += '<span class="asenha-checkpoint-icon"></span>';
				html += '<span class="asenha-checkpoint-label">' + label + '</span>';
				html += '<span class="asenha-checkpoint-sub"></span>';
				html += '</div>';
			}
			return html;
		},

		/**
		 * Format number with comma separators (e.g., 1,234,567)
		 */
		formatNumber: function(num) {
			return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		},

		/**
		 * Format a count label using localized single/plural templates.
		 *
		 * Supports %s / %d and %1$s / %1$d placeholders.
		 *
		 * @param {number} count
		 * @param {string} singleTpl
		 * @param {string} pluralTpl
		 * @return {string}
		 */
		formatCountLabel: function(count, singleTpl, pluralTpl) {
			count = parseInt(count || 0, 10) || 0;
			count = Math.max(0, count);

			var tpl = (count === 1) ? String(singleTpl || '') : String(pluralTpl || '');
			var formatted = this.formatNumber(count);

			tpl = tpl.replace(/%(\d+\$)?d/, formatted);
			tpl = tpl.replace(/%(\d+\$)?s/, formatted);
			return tpl;
		},

		/**
		 * Format completion summary for the Backup "sending" step.
		 *
		 * @since 8.7.0
		 *
		 * @param {number} count Number of remote locations.
		 * @return {string}
		 */
		formatSendingCompletedSummary: function(count) {
			count = parseInt(count || 0, 10) || 0;
			count = Math.max(0, count);

			var single = (asenhaSiteBackup && asenhaSiteBackup.subProgress && asenhaSiteBackup.subProgress.sentToRemoteLocationsSingle)
				? String(asenhaSiteBackup.subProgress.sentToRemoteLocationsSingle)
				: '';
			var plural = (asenhaSiteBackup && asenhaSiteBackup.subProgress && asenhaSiteBackup.subProgress.sentToRemoteLocationsPlural)
				? String(asenhaSiteBackup.subProgress.sentToRemoteLocationsPlural)
				: '';

			var tpl = (count === 1) ? single : plural;
			var formatted = this.formatNumber(count);

			// Support %d, %1$d, %s, %1$s patterns (single placeholder expected).
			tpl = tpl.replace(/%(\d+\$)?d/, formatted);
			tpl = tpl.replace(/%(\d+\$)?s/, formatted);
			return tpl;
		},

		/**
		 * Format the completed Backup "Creating archive" checkpoint summary.
		 *
		 * Archive completion can advance directly into sending/cleanup before final state has
		 * file_size_human, so use the best archive size source available in the current state.
		 *
		 * @since 8.7.0
		 *
		 * @param {Object} state          Current backup progress state.
		 * @param {Object} completedStats Server-provided completed_stats object.
		 * @return {string}
		 */
		formatBackupArchiveCreatedSummary: function(state, completedStats) {
			if (!asenhaSiteBackup || !asenhaSiteBackup.subProgress || !asenhaSiteBackup.subProgress.archiveCreated) {
				return '';
			}

			state = state || {};
			completedStats = completedStats || {};

			var archiveStats = completedStats.archive || {};
			var archiveSize = archiveStats.file_size_human || state.file_size_human || '';

			if (!archiveSize && state.sub_progress && state.sub_progress.zip_size > 0) {
				archiveSize = this.formatBytes(state.sub_progress.zip_size);
			}

			if (!archiveSize && this.lastArchiveSize) {
				archiveSize = this.lastArchiveSize;
			}

			if (!archiveSize) {
				return '';
			}

			this.lastArchiveSize = archiveSize;
			return asenhaSiteBackup.subProgress.archiveCreated.replace('%s', archiveSize);
		},

		/**
		 * Append MySQL 8 collation remapping note when remaps occurred during DB import.
		 *
		 * @param {string} label Existing completion label.
		 * @param {Object} stats Stats or sub_progress that may include collation_remap_*.
		 * @return {string}
		 */
		appendCollationRemapNote: function(label, stats) {
			label = String(label || '');
			stats = stats || {};
			var remapCount = parseInt(stats.collation_remap_count || 0, 10) || 0;
			if (remapCount <= 0 || !asenhaSiteBackup.subProgress || !asenhaSiteBackup.subProgress.collationRemapNote) {
				return label;
			}
			var target = stats.collation_remap_target ? String(stats.collation_remap_target) : 'utf8mb4_unicode_ci';
			var note = asenhaSiteBackup.subProgress.collationRemapNote.replace('%s', target);
			return label ? (label + ' · ' + note) : note;
		},

		/**
		 * Format completed step statistics from server-provided data
		 */
		formatCompletedStats: function(step, stats) {
			if (!stats || !asenhaSiteBackup.subProgress) {
				return '';
			}

			switch (step) {
				case 'database':
					if (stats.table_count > 0 && asenhaSiteBackup.subProgress.databaseStats) {
						return asenhaSiteBackup.subProgress.databaseStats
							.replace('%1$s', this.formatNumber(stats.table_count))
							.replace('%2$s', this.formatNumber(stats.row_count || 0))
							.replace('%3$s', this.formatBytes(stats.sql_file_size || stats.db_size || 0));
					}
					return '';

				case 'files':
					if (stats && stats.delta_stats && asenhaSiteBackup.subProgress.filesDeltaSummary) {
						var ds = stats.delta_stats || {};
						var changedFiles = parseInt(ds.changed_files || 0, 10) || 0;
						var deletedFiles = parseInt(ds.deleted_files || 0, 10) || 0;
						var changedBytes = parseInt(ds.changed_bytes || 0, 10) || 0;
						var deletedBytes = parseInt(ds.deleted_bytes || 0, 10) || 0;

						if (changedFiles > 0 || deletedFiles > 0) {
							return asenhaSiteBackup.subProgress.filesDeltaSummary
								.replace('%1$s', this.formatNumber(changedFiles))
								.replace('%2$s', this.formatBytes(changedBytes))
								.replace('%3$s', this.formatNumber(deletedFiles))
								.replace('%4$s', this.formatBytes(deletedBytes));
						}
					}
					if (stats.total_files > 0) {
						return asenhaSiteBackup.subProgress.filesFound
							.replace('%1$s', this.formatNumber(stats.total_files))
							.replace('%2$s', this.formatBytes(stats.files_size || 0));
					}
					return '';

				case 'archive':
					// Show archive size if available
					if (stats.file_size_human && asenhaSiteBackup.subProgress.archiveCreated) {
						return asenhaSiteBackup.subProgress.archiveCreated.replace('%s', stats.file_size_human);
					}
					return '';

				default:
					return '';
			}
		},

		/**
		 * Format sub-progress label based on step and data
		 */
		formatSubProgress: function(step, subProgress) {
			if (!subProgress || !asenhaSiteBackup.subProgress) {
				return '';
			}

			/**
			 * Strip the WordPress DB table prefix from a table name for display.
			 *
			 * @param {string} name
			 * @return {string}
			 */
			var stripDbPrefix = function(name) {
				name = String(name || '');
				var prefix = (asenhaSiteBackup && asenhaSiteBackup.dbPrefix) ? String(asenhaSiteBackup.dbPrefix) : '';
				if (!prefix) {
					return name;
				}
				return name.indexOf(prefix) === 0 ? name.slice(prefix.length) : name;
			};

			var label = subProgress.label || '';
			var current = subProgress.current || 0;
			var total = subProgress.total || 0;

			// Handle different step types
			switch (step) {
				case 'retrieving':
					var loc = subProgress.location_label ? String(subProgress.location_label) : '';
					var bytesCurrent = parseInt(current || 0, 10) || 0;
					var bytesTotal = parseInt(total || 0, 10) || 0;

					if (label === 'downloading') {
						if (loc && bytesTotal > 0) {
							var percent = Math.round((bytesCurrent / Math.max(bytesTotal, 1)) * 100);
							percent = Math.max(0, Math.min(100, percent));
							return loc + ' ' + this.formatBytes(bytesCurrent) + ' / ' + this.formatBytes(bytesTotal) + ' (' + percent + '%)';
						}
						return asenhaSbP('processing');
					}

					if (label === 'assembling') {
						if (bytesTotal > 0) {
							var percent = Math.round((bytesCurrent / Math.max(bytesTotal, 1)) * 100);
							percent = Math.max(0, Math.min(100, percent));
							return asenhaSbFmt(asenhaSbP('assemblingArchiveProgress'), {
								'1': this.formatBytes(bytesCurrent),
								'2': this.formatBytes(bytesTotal),
								'3': percent
							});
						}
						return asenhaSbP('assemblingArchive');
					}

					if (label === 'done') {
						if (subProgress.done_summary) {
							return String(subProgress.done_summary);
						}
						if (loc && bytesTotal > 0) {
							var percent = Math.round((bytesCurrent / Math.max(bytesTotal, 1)) * 100);
							percent = Math.max(0, Math.min(100, percent));
							return loc + ' ' + this.formatBytes(bytesCurrent) + ' / ' + this.formatBytes(bytesTotal) + ' (' + percent + '%)';
						}
						return asenhaSbP('done');
					}

					return asenhaSbP('processing');

				case 'preparing':
					if (label === 'starting') {
						return asenhaSiteBackup.subProgress.starting;
					} else if (label === 'done') {
						return asenhaSiteBackup.subProgress.done;
					}
					return asenhaSiteBackup.subProgress.processing;

				case 'database':
					if (label === 'starting') {
						return asenhaSiteBackup.subProgress.starting;
					} else if (label === 'verifying') {
						return asenhaSbP('verifyingDatabaseIntegrity');
					} else if (label === 'done') {
						// Show completion statistics when done
						// For restore, use tables_restored
						if (subProgress.tables_restored && subProgress.tables_restored > 0) {
							var rowsRestored = subProgress.rows_restored || 0;
							return this.appendCollationRemapNote(
								asenhaSiteBackup.subProgress.tablesRestored
									.replace('%1$d', subProgress.tables_restored)
									.replace('%2$s', this.formatNumber(rowsRestored)),
								subProgress
							);
						}
						// Restore fallback: when the restore state doesn't include tables_restored/rows_restored,
						// use current/total and the tracked restore rows total. This keeps the database step
						// summary consistent even when we switch to static JSON polling.
						var restoreTablesFallback = total || current;
						if (restoreTablesFallback > 0 && !subProgress.tables_imported && !subProgress.table_count && asenhaSiteBackup.subProgress.tablesRestored) {
							var restoreRowsFallback = subProgress.rows_restored || subProgress.rows_imported || this.lastRestoreRowsTotal || 0;
							return this.appendCollationRemapNote(
								asenhaSiteBackup.subProgress.tablesRestored
									.replace('%1$d', restoreTablesFallback)
									.replace('%2$s', this.formatNumber(restoreRowsFallback)),
								subProgress
							);
						}
						// For migration (import), use tables_imported
						if (subProgress.tables_imported && subProgress.tables_imported > 0) {
							var rowsImported = subProgress.rows_imported || 0;
							return this.appendCollationRemapNote(
								asenhaSiteBackup.subProgress.tablesImported
									.replace('%1$d', subProgress.tables_imported)
									.replace('%2$s', this.formatNumber(rowsImported)),
								subProgress
							);
						}
						// For backup (export), show scan stats
						var tableCount = subProgress.table_count || 0;
						var rowCount = subProgress.row_count || 0;
						var dbSize = subProgress.sql_file_size || subProgress.db_size || 0;
						if (tableCount > 0 && asenhaSiteBackup.subProgress.databaseStats) {
							return asenhaSiteBackup.subProgress.databaseStats
								.replace('%1$s', this.formatNumber(tableCount))
								.replace('%2$s', this.formatNumber(rowCount))
								.replace('%3$s', this.formatBytes(dbSize));
						}
						return asenhaSiteBackup.subProgress.done;
					} else if (label === 'importing' && current > 0 && total > 0) {
						// Migration/Restore: importing tables with percentage and current table info.
						var percent = Math.round((current / total) * 100);
						var tableName = stripDbPrefix(subProgress.current_table_name || '');
						var tableRows = subProgress.current_table_rows_expected || 0;
						var base = asenhaSiteBackup.subProgress.importingTables
							.replace('%1$d', current)
							.replace('%2$d', total)
							.replace('%3$s', percent)
							.replace('%4$s', tableName)
							.replace('%5$s', this.formatNumber(tableRows));

						return base;
					} else if (current > 0 && total > 0) {
						// Backup: scanning tables
						var tableRows = subProgress.table_rows || 0;
						return asenhaSiteBackup.subProgress.tableOf
							.replace('%1$d', current)
							.replace('%2$d', total)
							.replace('%3$s', label)
							.replace('%4$s', this.formatNumber(tableRows))
							.replace('%5$s', this.formatBytes(subProgress.sql_file_size || 0));
					}
					return asenhaSiteBackup.subProgress.processing;

				case 'files':
					if (label === 'starting') {
						return asenhaSiteBackup.subProgress.starting;
					} else if (label === 'done') {
						// Show completion stats
						var totalFiles = subProgress.files_restored || subProgress.files_imported || subProgress.total_files || current;
						if (totalFiles > 0) {
							// For restore, show files restored
							if (subProgress.files_restored && asenhaSiteBackup.subProgress.filesRestored) {
								return asenhaSiteBackup.subProgress.filesRestored.replace('%d', this.formatNumber(totalFiles));
							}
							// For migration, show files imported
							if ((subProgress.files_imported || subProgress.total_files) && asenhaSiteBackup.subProgress.filesImported) {
								return asenhaSiteBackup.subProgress.filesImported.replace('%d', this.formatNumber(totalFiles));
							}
							// For backup, show files found
							return asenhaSiteBackup.subProgress.filesFound
								.replace('%1$s', this.formatNumber(totalFiles))
								.replace('%2$s', this.formatBytes(subProgress.files_size || 0));
						}
						return asenhaSiteBackup.subProgress.done;
					} else if (label === 'collected') {
						// Backup: files collected
						var totalFilesCollected = subProgress.total_files || current;
						return asenhaSiteBackup.subProgress.filesFound
							.replace('%1$s', this.formatNumber(totalFilesCollected))
							.replace('%2$s', this.formatBytes(subProgress.files_size || 0));
					} else if (label === 'restoring' && current > 0 && total > 0) {
						// Restore: restoring files
						var percent = Math.round((current / total) * 100);
						return asenhaSiteBackup.subProgress.restoringFiles
							.replace('%1$d', this.formatNumber(current))
							.replace('%2$d', this.formatNumber(total))
							.replace('%3$s', percent);
					} else if (label === 'importing' && current > 0 && total > 0) {
						// Migration: importing files
						var percent = Math.round((current / total) * 100);
						return asenhaSiteBackup.subProgress.importingFiles
							.replace('%1$d', this.formatNumber(current))
							.replace('%2$d', this.formatNumber(total))
							.replace('%3$s', percent);
					} else if (label === 'cleaning' && current >= 0 && total > 0) {
						// Migration: sync-delete cleanup of destination leftovers
						var cleaningPercent = Math.round((current / total) * 100);
						var cleaningTpl = asenhaSiteBackup.subProgress.cleaningExtraFiles
							|| asenhaSiteBackup.subProgress.importingFiles;
						return cleaningTpl
							.replace('%1$d', this.formatNumber(current))
							.replace('%2$d', this.formatNumber(total))
							.replace('%3$s', cleaningPercent);
					} else if (label === 'collecting' && current > 0) {
						return asenhaSiteBackup.subProgress.processing;
					}
					return asenhaSiteBackup.subProgress.processing;

		case 'archive':
			if (label === 'starting') {
				return asenhaSiteBackup.subProgress.starting;
			} else if (label === 'done') {
				return asenhaSiteBackup.subProgress.done;
			} else if (label === 'adding_files') {
				// Phase 1: Adding files to archive
				if (current > 0 && total > 0) {
					return asenhaSiteBackup.subProgress.addingFile
						.replace('%1$d', current)
						.replace('%2$d', total);
				}
				return asenhaSiteBackup.subProgress.processing;
		} else if (label === 'finalizing') {
			// Phase 2: Finalizing archive (ZIP size-based progress)
			var zipSize = subProgress.zip_size || 0;
			var expectedSize = subProgress.expected_size || 0;
			// Display-only clamp: when the dynamic server-side estimate under-shoots the actual
			// growing zip_size, never let the displayed expected size be smaller than the actual
			// size. This keeps the line readable (e.g. "Archiving 609.5 MB / ~610.0 MB (100%)")
			// without changing the server-side estimator that other logic depends on.
			var displayExpected = Math.max(expectedSize, zipSize);
			// Show sizes if we have expected size (zipSize can be 0 at start)
			if (expectedSize > 0) {
				var percent = Math.round((zipSize / expectedSize) * 100);
				percent = Math.max(0, Math.min(100, percent));
				return asenhaSiteBackup.subProgress.finalizingArchive
					.replace('%1$s', this.formatBytes(zipSize))
					.replace('%2$s', this.formatBytes(displayExpected))
					.replace('%3$s', percent);
			}
			return asenhaSiteBackup.subProgress.finalizingArchive
				.replace('%1$s', '...')
				.replace('%2$s', '...')
				.replace('%3$s', '0');
			} else if (label === 'closing') {
				// Phase 3: Closing archive (writing central directory)
				// This is a checkpoint before $zip->close() which can take time for large archives
				return asenhaSbP('closingArchive');
			} else if (label === 'archiving' && current > 0 && total > 0) {
				// Legacy support for old label
				return asenhaSiteBackup.subProgress.archivingFile
					.replace('%1$d', current)
					.replace('%2$d', total);
			}
			return asenhaSiteBackup.subProgress.processing;

				case 'sending':
					var transfers = subProgress.remote_transfers || [];
					if (transfers && transfers.length) {
						var lines = [];
						for (var i = 0; i < transfers.length; i++) {
							var t = transfers[i] || {};
							var tLabel = String(t.label || '');
							var sent = parseInt(t.bytes_sent || 0, 10) || 0;
							var tTotal = parseInt(t.total_bytes || 0, 10) || 0;
							var pct = (tTotal > 0) ? Math.round((sent / tTotal) * 100) : 0;
							pct = Math.max(0, Math.min(100, pct));
							if (tLabel) {
								lines.push(tLabel + ' — ' + this.formatBytes(sent) + ' / ' + this.formatBytes(tTotal) + ' (' + pct + '%)');
							}
						}
						return lines.join('\n');
					}
					if (current > 0 && total > 0) {
						var percent = Math.round((current / total) * 100);
						percent = Math.max(0, Math.min(100, percent));
						return this.formatBytes(current) + ' / ' + this.formatBytes(total) + ' (' + percent + '%)';
					}
					return asenhaSiteBackup.subProgress.processing;

			case 'extracting':
				if (label === 'extracting_control') {
					// Control file extraction (with or without decryption).
					if (subProgress.encrypted) {
						return asenhaSbP('decryptingAndExtracting');
					}
					return asenhaSbP('extractingControlFiles');
				} else if (label === 'assembling') {
					// Multipart assembly (within incremental collapse or standalone).
					if (total > 0) {
						var percent = Math.round((current / Math.max(total, 1)) * 100);
						percent = Math.max(0, Math.min(100, percent));
						return asenhaSbP('assemblingArchiveProgress')
							.replace('%1$s', this.formatBytes(current))
							.replace('%2$s', this.formatBytes(total))
							.replace('%3$s', percent);
					}
					return asenhaSbP('assemblingArchive');
				} else if (label === 'extracting') {
					// Size-based extraction progress or incremental chain extraction.
					if (subProgress.total_size > 0) {
						// Show size-based progress: "x MB / ~yMB (z%)"
						var extractedSize = subProgress.extracted_size || 0;
						var totalSize = subProgress.total_size || 1;
						var percent = Math.round((extractedSize / totalSize) * 100);
						return asenhaSbP('extractingProgress')
							.replace('%1$s', this.formatBytes(extractedSize))
							.replace('%2$s', this.formatBytes(totalSize))
							.replace('%3$s', percent);
					}
					if (current > 0 && total > 0) {
						// Chain-based extraction (collapsing incrementals).
						return asenhaSbP('collapsingIncrementals')
							.replace('%1$d', current)
							.replace('%2$d', total);
					}
					return asenhaSbP('processing');
				} else if (label === 'finalizing') {
					// Building collapsed archive from staging directory.
					if (current >= 0 && total > 0) {
						return asenhaSbP('buildingCollapsedArchive')
							.replace('%1$d', current)
							.replace('%2$d', total);
					}
					return asenhaSbP('processing');
				} else if (label === 'done') {
					// Show done_summary if available, otherwise fall back to size or generic "Done".
					if (subProgress.done_summary) {
						return String(subProgress.done_summary);
					}
					if (subProgress.total_size > 0) {
						return asenhaSbP('extractionComplete')
							.replace('%s', this.formatBytes(subProgress.total_size));
					}
					return asenhaSbP('done');
				}
				return asenhaSbP('processing');

				case 'cleanup':
					if (label === 'finishing') {
						return asenhaSiteBackup.subProgress.finishing;
					} else if (label === 'done') {
						return asenhaSiteBackup.subProgress.done;
					}
					return asenhaSiteBackup.subProgress.finishing;

				default:
					if (label === 'starting') {
						return asenhaSiteBackup.subProgress.starting;
					} else if (label === 'done') {
						return asenhaSiteBackup.subProgress.done;
					}
					return asenhaSiteBackup.subProgress.processing;
			}
		},

		/**
		 * Compute backup steps for this run (inserts 'sending' when needed).
		 *
		 * @param {string} backupType
		 * @param {boolean} wantsSending
		 * @return {Array}
		 */
		computeBackupStepsForBackupType: function(backupType, wantsSending) {
			var base = (this.backupSteps[backupType] || this.backupSteps.full || []).slice();
			wantsSending = !!wantsSending;

			if (wantsSending && base.indexOf('sending') === -1) {
				var cleanupIndex = base.indexOf('cleanup');
				if (cleanupIndex === -1) {
					base.push('sending');
				} else {
					base.splice(cleanupIndex, 0, 'sending');
				}
			}

			return base;
		},

		/**
		 * Initialize progress UI for backup
		 */
		initBackupProgress: function(backupType) {
			var $progress = $('.asenha-backup-progress');
			var steps = this.currentBackupSteps || this.backupSteps[backupType] || this.backupSteps.full;
			var checkpointLabels = asenhaSiteBackup.checkpoints.backup;

			// Build and insert checklist
			var checklistHtml = this.buildChecklist(steps, checkpointLabels);
			$progress.find('.asenha-progress-checklist').html(checklistHtml);

			// Reset circular progress
			$progress.find('.asenha-circle-progress').attr('stroke-dasharray', '0, 100').removeClass('completed failed');
			$progress.find('.asenha-progress-percent').text('0%');

			// Reset time display
			$progress.find('.asenha-time-elapsed .asenha-time-value').text('0s');
			$progress.find('.asenha-time-remaining .asenha-time-value').text('--');
			$progress.find('.asenha-time-remaining').show(); // Ensure it's visible for new operation

			// Store start time and type
			this.startTime = Date.now();
			this.currentBackupType = backupType;

			// Reset completed step statistics
			this.completedStepStats = {};
			this.backupCompletedStats = {};
			this.previousBackupStep = null;
			this.lastBackupSubProgress = null;
			this.lastDatabaseStats = null;
			this.lastFilesStats = null;
			this.lastArchiveSize = null;

			// Start time update interval
			this.startTimeUpdater($progress);
		},

		/**
		 * Initialize progress UI for restore
		 * 
		 * @param {string} components - The restore components ('all', 'database', or 'files')
		 */
		initRestoreProgress: function(components) {
			var $progress = $('.asenha-restore-progress');
			var opts = this.currentRestoreOptions || { components: components, locationId: '' };
			opts.components = components;
			var steps = this.getRestoreStepsForOptions(opts);

			var checkpointLabels = asenhaSiteBackup.checkpoints.restore;

			// Build and insert checklist
			var checklistHtml = this.buildChecklist(steps, checkpointLabels);
			$progress.find('.asenha-progress-checklist').html(checklistHtml);

			// Reset circular progress
			$progress.find('.asenha-circle-progress').attr('stroke-dasharray', '0, 100').removeClass('completed failed');
			$progress.find('.asenha-progress-percent').text('0%');

			// Reset time display
			$progress.find('.asenha-time-elapsed .asenha-time-value').text('0s');
			$progress.find('.asenha-time-remaining .asenha-time-value').text('--');
			$progress.find('.asenha-time-remaining').show(); // Ensure it's visible for new operation

			// Store start time and options
			this.startTime = Date.now();
			this.currentRestoreOptions = {
				components: components,
				locationId: opts && typeof opts.locationId !== 'undefined' ? String(opts.locationId || '') : ''
			};

			// Reset completed step statistics
			this.completedStepStats = {};
			this.restoreCompletedStats = {};
			this.previousRestoreStep = null;
			this.lastRestoreSubProgress = null;
			this.lastRestoreRetrievingSubProgress = null;
			this.lastRestoreExtractionSize = 0;
			this.lastRestoreRowsTotal = 0;
			this.lastRestoreTablesTotal = 0;
			this.restoreCompletionHandled = false;

			// Start time update interval
			this.startTimeUpdater($progress);
		},

		/**
		 * Start time updater interval
		 */
		startTimeUpdater: function($progress) {
			var self = this;

			// Clear any existing interval
			if (this.timeInterval) {
				clearInterval(this.timeInterval);
			}

			this.timeInterval = setInterval(function() {
				self.updateTimeDisplay($progress);
			}, 1000);
		},

		/**
		 * Update time display
		 */
		updateTimeDisplay: function($progress) {
			if (!this.startTime) {
				return;
			}

			var elapsed = Math.floor((Date.now() - this.startTime) / 1000);
			var elapsedFormatted = this.formatTime(elapsed);
			$progress.find('.asenha-time-elapsed .asenha-time-value').text(elapsedFormatted);

			// Calculate remaining time based on current progress
			var percentText = $progress.find('.asenha-progress-percent').text();
			var percent = parseInt(percentText, 10) || 0;

			if (percent > 5 && percent < 100) {
				var estimatedTotal = (elapsed / percent) * 100;
				var remaining = Math.ceil(estimatedTotal - elapsed);
				if (remaining > 0) {
					$progress.find('.asenha-time-remaining .asenha-time-value').text('~' + this.formatTime(remaining));
				} else {
					$progress.find('.asenha-time-remaining .asenha-time-value').text('--');
				}
			} else if (percent >= 100) {
				$progress.find('.asenha-time-remaining .asenha-time-value').text('--');
			}
		},

		/**
		 * Format seconds into human-readable time
		 */
		formatTime: function(seconds) {
			if (seconds < 60) {
				return seconds + 's';
			} else if (seconds < 3600) {
				var mins = Math.floor(seconds / 60);
				var secs = seconds % 60;
				return mins + 'm ' + secs + 's';
			} else {
				var hours = Math.floor(seconds / 3600);
				var mins = Math.floor((seconds % 3600) / 60);
				var secs = seconds % 60;
				return hours + 'h ' + mins + 'm ' + secs + 's';
			}
		},

		/**
		 * Format bytes into human-readable size
		 */
		formatBytes: function(bytes, precision) {
			precision = precision || 1;
			var units = ['B', 'KB', 'MB', 'GB', 'TB'];
			var pow = Math.floor((bytes ? Math.log(bytes) : 0) / Math.log(1024));
			pow = Math.min(pow, units.length - 1);
			var size = bytes / Math.pow(1024, pow);
			return size.toFixed(precision) + ' ' + units[pow];
		},

		/**
		 * Start backup
		 */
		startBackup: function(e) {
			e.preventDefault();
			
			var $button = $(e.currentTarget);
			var backupType = $button.data('type') || 'full';

			// If the template picker UI exists on this view, show it first (per-template backups).
			if ($('#asenha-backup-template-picker').length) {
				this.pendingBackupFocusButton = $button[0] || null;
				$('.asenha-start-backup').prop('disabled', true);
				this.pendingBackupType = backupType;
				this.showTemplatePicker(backupType);
				return;
			}

			// Fallback: start immediately (no picker present).
			var multipartEnabled = $('#asenha-multipart-enabled').is(':checked');
			var multipartPartBytes = parseInt($('#asenha-multipart-part-bytes').val() || '0', 10);
			if (!multipartEnabled) {
				multipartPartBytes = 0;
			}
			var archiveEncryption = this.getBackupArchiveEncryptionSelection();
			if (!archiveEncryption) {
				return;
			}
			var zipDiagnosticMode = $('#asenha-backup-zip-diagnostic-mode').is(':checked');
			this.startBackupWithTemplate(
				backupType,
				'',
				multipartEnabled,
				multipartPartBytes,
				'baseline',
				'',
				archiveEncryption.enabled,
				archiveEncryption.passphrase,
				archiveEncryption.passphraseConfirm,
				zipDiagnosticMode
			);
		},

		/**
		 * Get current destination selection for a backup run.
		 *
		 * @return {{location_local:number, location_remote:number, location_remote_location_ids:Array}}
		 * @since 8.7.0
		 */
		getBackupDestinationSelection: function() {
			var localEnabled = $('#asenha-backup-destination-local').is(':checked');
			var remoteEnabled = $('#asenha-backup-destination-remote').is(':checked');

			var remoteIds = [];
			if (remoteEnabled) {
				$('.asenha-backup-destination-remote-id:checked').each(function() {
					var id = String($(this).val() || '');
					if (id) {
						remoteIds.push(id);
					}
				});
			}

			return {
				location_local: localEnabled ? 1 : 0,
				location_remote: remoteEnabled ? 1 : 0,
				location_remote_location_ids: remoteIds
			};
		},

		/**
		 * Get/validate backup archive encryption options from the backup picker UI.
		 *
		 * @return {{enabled:boolean, passphrase:string, passphraseConfirm:string}|null}
		 */
		getBackupArchiveEncryptionSelection: function() {
			var enabled = $('#asenha-backup-archive-encryption-enabled').is(':checked');
			var passphrase = String($('#asenha-backup-archive-passphrase').val() || '');
			var passphraseConfirm = String($('#asenha-backup-archive-passphrase-confirm').val() || '');
			var lock = this.incrementalEncryptionLock && this.incrementalEncryptionLock.active ? this.incrementalEncryptionLock : null;

			if (enabled && lock && lock.required_enabled) {
				// Locked incremental mode reuses baseline secret server-side.
				return {
					enabled: true,
					passphrase: '',
					passphraseConfirm: ''
				};
			}

			if (enabled && !passphrase) {
				this.showNotice('error', asenhaSbT('backupArchivePassphraseRequired'));
				return null;
			}

			if (enabled && passphraseConfirm && passphrase !== passphraseConfirm) {
				this.showNotice('error', asenhaSbT('archivePassphraseMismatch'));
				return null;
			}

			return {
				enabled: enabled,
				passphrase: passphrase,
				passphraseConfirm: passphraseConfirm
			};
		},

		/**
		 * Start backup with selected template.
		 *
		 * @param {string} backupType
		 * @param {string} templateId
		 * @param {boolean} multipartEnabled
		 * @param {number} multipartPartBytes
		 * @param {boolean} [zipDiagnosticMode] When true, one-file-per-flush ZIP mode for isolating close() failures (next run only).
		 */
		startBackupWithTemplate: function(backupType, templateId, multipartEnabled, multipartPartBytes, backupMethod, baseFilename, archiveEncryptionEnabled, archiveEncryptionPassphrase, archiveEncryptionPassphraseConfirm, zipDiagnosticMode) {
			var $progress = $('.asenha-backup-progress');
			var destinations = this.getBackupDestinationSelection();
			var wantsSending = !!(destinations.location_remote && destinations.location_remote_location_ids && destinations.location_remote_location_ids.length);
			this.currentBackupSteps = this.computeBackupStepsForBackupType(backupType, wantsSending);
			zipDiagnosticMode = !!zipDiagnosticMode;
			archiveEncryptionEnabled = !!archiveEncryptionEnabled;
			archiveEncryptionPassphrase = String(archiveEncryptionPassphrase || '');
			archiveEncryptionPassphraseConfirm = String(archiveEncryptionPassphraseConfirm || '');

			// Disable buttons
			$('.asenha-start-backup').prop('disabled', true);

			// Initialize and show progress
			this.initBackupProgress(backupType);
			$progress.show();

			var postData = {
				action: 'asenha_start_backup',
				nonce: asenhaSiteBackup.nonce,
				backup_type: backupType,
				template_id: templateId || '',
				backup_method: backupMethod || 'baseline',
				base_filename: baseFilename || '',
				multipart_enabled: multipartEnabled ? 1 : 0,
				multipart_part_bytes: multipartPartBytes,
				archive_encryption_enabled: archiveEncryptionEnabled ? 1 : 0,
				archive_encryption_passphrase: archiveEncryptionPassphrase,
				archive_encryption_passphrase_confirm: archiveEncryptionPassphraseConfirm,
				location_local: destinations.location_local,
				location_remote: destinations.location_remote,
				location_remote_location_ids: destinations.location_remote_location_ids,
				zip_diagnostic_mode: zipDiagnosticMode ? 1 : 0
			};
			if ('incremental' !== (backupMethod || 'baseline')) {
				postData.backup_note = this.getCreateBackupNoteContent();
			}

			// Start backup
			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: postData,
				success: function(response) {
					if (response.success) {
						$('#asenha-backup-archive-passphrase').val('');
						$('#asenha-backup-archive-passphrase-confirm').val('');
						$('#asenha-backup-zip-diagnostic-mode').prop('checked', false);
						this.clearCreateBackupNoteEditor();
						this.currentBackupId = response.data.backup_id;
						this.pollBackupProgress();
						$('.asenha-cancel-backup').show();
					} else {
						this.backupFailed(response.data && response.data.message ? response.data.message : 'Backup failed.');
					}
				}.bind(this),
				error: function(xhr, status, error) {
					this.backupFailed(error);
				}.bind(this)
			});
		},

		/**
		 * Poll backup progress
		 * 
		 * Polls immediately on first call, then continues polling every second.
		 * This ensures we capture progress updates even for fast operations.
		 * Uses localStorage for faster UI updates between AJAX polls.
		 */
		pollBackupProgress: function() {
			if (!this.currentBackupId) {
				return;
			}

			var self = this;

			/**
			 * Update UI from stored progress data
			 */
			var updateFromStorage = function() {
				var stored = self.getProgress(self.currentBackupId);
				if (stored) {
					var $progress = $('.asenha-backup-progress');
					self.updateProgress($progress, stored.progress || 0, stored.current_step || 'preparing', 'backup', stored.sub_progress, stored.completed_stats, stored);
				}
			};

			/**
			 * Single poll request
			 */
			var doPoll = function() {
				if (!self.currentBackupId) {
					return;
				}

				$.ajax({
					url: asenhaSiteBackup.ajaxUrl,
					type: 'POST',
					data: {
						action: 'asenha_get_backup_progress',
						nonce: asenhaSiteBackup.nonce,
						backup_id: self.currentBackupId
					},
					success: function(response) {
						if (response.success) {
							var state = response.data;
							var $progress = $('.asenha-backup-progress');
							var currentStep = state.current_step || 'preparing';
							
							// Save to localStorage for faster subsequent updates
							self.saveProgress(self.currentBackupId, state);
							
							// Store completion stats when a step completes with 'done' label
							if (state.sub_progress && state.sub_progress.label === 'done') {
								self.backupCompletedStats[currentStep] = state.sub_progress;
							}

							// Track database stats specifically (table_count, row_count)
							if (currentStep === 'database' && state.sub_progress) {
								if (state.sub_progress.table_count > 0) {
									self.lastDatabaseStats = {
										table_count: state.sub_progress.table_count,
										row_count: state.sub_progress.row_count || 0,
										// Prefer exported SQL file size for summaries.
										sql_file_size: state.sub_progress.sql_file_size || 0,
										// Keep db_size for backward compatibility/fallback.
										db_size: state.sub_progress.db_size || 0
									};
								} else if (state.sub_progress.total > 0) {
									// Track progress through tables for fallback
									self.lastDatabaseStats = {
										table_count: state.sub_progress.total,
										row_count: 0
									};
								}
							}

							// Track files stats specifically (total_files and files_size)
							if (currentStep === 'files' && state.sub_progress) {
								if (state.sub_progress.total_files > 0) {
									self.lastFilesStats = {
										total_files: state.sub_progress.total_files,
										files_size: state.sub_progress.files_size || 0
									};
								} else if (state.sub_progress.total > 0) {
									// Track progress for fallback
									self.lastFilesStats = {
										total_files: state.sub_progress.total,
										files_size: state.sub_progress.files_size || 0
									};
								}
							}

							// Track archive size when available (from completed state)
							if (state.file_size_human) {
								self.lastArchiveSize = state.file_size_human;
							}

							// Detect step transition - if step changed, store stats for the previous step
							if (self.previousBackupStep && self.previousBackupStep !== currentStep) {
								// Store database stats if we missed the 'done' label
								if (self.previousBackupStep === 'database' && !self.backupCompletedStats['database'] && self.lastDatabaseStats) {
									self.backupCompletedStats['database'] = $.extend({}, self.lastDatabaseStats, { label: 'done' });
								}
								// Store files stats if we missed the 'done' label
								if (self.previousBackupStep === 'files' && !self.backupCompletedStats['files'] && self.lastFilesStats) {
									self.backupCompletedStats['files'] = $.extend({}, self.lastFilesStats, { label: 'done' });
								}
							}

							// Update previous step tracker
							self.previousBackupStep = currentStep;

							// Update progress UI using server-provided completed_stats
							self.updateProgress($progress, state.progress, state.current_step, 'backup', state.sub_progress, state.completed_stats, state);

							if (state.status === 'completed') {
								self.backupCompleted(state);
							} else if (state.status === 'failed') {
								self.backupFailed(state.error || state.message);
							} else if (state.status === 'cancelled') {
								self.backupCancelled();
							}
						}
					},
					error: function() {
						// Try to update from localStorage on error
						updateFromStorage();
					}
				});
			};

			// Poll immediately on first call
			doPoll();

			// Then set up interval for subsequent polls (1 second interval for responsive updates)
			this.progressInterval = setInterval(doPoll, 1000);
		},

		/**
		 * Cancel backup
		 */
		cancelBackup: function(e) {
			e.preventDefault();

			if (!this.currentBackupId) {
				return;
			}

			var self = this;
			var backupId = this.currentBackupId;

			// Show immediate visual feedback
			this.backupCancelling();

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_cancel_backup',
					nonce: asenhaSiteBackup.nonce,
					backup_id: backupId
				},
				success: function(response) {
					if (response.success) {
						// Start polling for cleanup completion
						self.pollCancelStatus(backupId);
					} else {
						self.showNotice('error', response.data.message || asenhaSbT('failedToCancelBackup'), 3000);
						setTimeout(function() {
							self.backupCancelled();
						}, 100);
					}
				},
				error: function() {
					self.showNotice('error', asenhaSbT('failedToCancelBackup'), 3000);
					setTimeout(function() {
						self.backupCancelled();
					}, 100);
				}
			});
		},

		/**
		 * Poll for cancellation cleanup status
		 * Keeps checking until cleanup is confirmed complete
		 */
		pollCancelStatus: function(backupId) {
			var self = this;
			var pollCount = 0;
			var maxPolls = 120; // Max 2 minutes of polling (1 second intervals)
			var isPolling = false; // Prevent concurrent requests

			var doPoll = function() {
				// Prevent concurrent requests
				if (isPolling) {
					return;
				}

				pollCount++;

				// Safety check - stop after max polls
				if (pollCount > maxPolls) {
				self.showNotice('warning', asenhaSbT('backupCancelled'), 7000);
					setTimeout(function() {
						self.backupCancelled();
					}, 100);
					return;
				}

				isPolling = true;

				$.ajax({
					url: asenhaSiteBackup.ajaxUrl,
					type: 'POST',
					data: {
						action: 'asenha_check_cancel_status',
						nonce: asenhaSiteBackup.nonce,
						backup_id: backupId
					},
					success: function(response) {
						isPolling = false;

						if (response.success && response.data.cleanup_complete) {
							// Cleanup is complete - show success
							// Show notice FIRST so it's visible before UI resets
							self.showNotice('warning', asenhaSbT('backupCancelled'), 7000);
							
							// Then reset UI after a brief moment to let notice appear
							setTimeout(function() {
								self.backupCancelled();
							}, 100);
						} else {
							// Not complete yet - schedule next poll
							setTimeout(doPoll, 1000);
						}
					},
					error: function() {
						isPolling = false;
						// On error, assume cleanup might be done (transient deleted)
						self.showNotice('warning', asenhaSbT('backupCancelled'), 7000);
						setTimeout(function() {
							self.backupCancelled();
						}, 100);
					}
				});
			};

			// Start polling immediately
			doPoll();
		},

		/**
		 * Show cancelling state with visual feedback
		 */
		backupCancelling: function() {
			// Stop progress polling immediately
			clearInterval(this.progressInterval);
			clearInterval(this.timeInterval);

			var $progress = $('.asenha-backup-progress');
			var $cancelButton = $('.asenha-cancel-backup');

			// Disable cancel button to prevent multiple clicks
			$cancelButton.prop('disabled', true).text(asenhaSbT('cancelling'));

			// Update progress display to show cancelling state
			$progress.find('.asenha-checkpoint.in-progress .asenha-checkpoint-sub').text(asenhaSbT('cancelling'));
			$progress.find('.asenha-circle-progress').addClass('cancelling');
		},

		/**
		 * Backup completed
		 */
		backupCompleted: function(state) {
			clearInterval(this.progressInterval);
			clearInterval(this.timeInterval);
			
			// Clear localStorage
			if (this.currentBackupId) {
				this.clearProgress(this.currentBackupId);
			}
			this.currentBackupId = null;

			var self = this;
			var $progress = $('.asenha-backup-progress');
			var serverStats = state.completed_stats || {};
			
			// Store archive size from state for archive step formatting
			if (state.file_size_human) {
				this.lastArchiveSize = state.file_size_human;
			}
			
			// Mark all checkpoints as completed and update their sub-labels
			$progress.find('.asenha-checkpoint').each(function() {
				var $checkpoint = $(this);
				var step = $checkpoint.data('step');
				var $subLabel = $checkpoint.find('.asenha-checkpoint-sub');
				
				$checkpoint.removeClass('pending in-progress').addClass('completed');
				
				// Try server-provided stats first, then client-tracked stats (operation complete, so isOperationComplete=true)
				var statsText = '';
				
				// 1. Try server-provided completed_stats
				if (serverStats[step]) {
					statsText = self.formatCompletedStats(step, serverStats[step]);
				}
				
				// 2. Fall back to client-tracked stats
				if (!statsText) {
					statsText = self.formatBackupCompletedStats(step, true);
				}
				
				// 3. For archive step, use the best available final archive size source.
				if (!statsText && step === 'archive') {
					statsText = self.formatBackupArchiveCreatedSummary(state, serverStats);
				}
				
				// 4. Update sub-label if we have stats, otherwise preserve existing text
				if (statsText) {
					$subLabel.text(statsText);
				}

				// 5. Backup: ensure sending step has a concise completion summary.
				var sendStatus = state ? String(state.sending_status || '') : '';
				if (!statsText && step === 'sending' && state && (sendStatus === 'completed' || sendStatus === 'completed_with_errors')) {
					var remoteCount = 0;
					if (state.locations && $.isArray(state.locations.remote_location_ids)) {
						remoteCount = state.locations.remote_location_ids.length;
					} else if ($.isArray(state.sending_location_ids)) {
						remoteCount = state.sending_location_ids.length;
					}
					if (remoteCount > 0) {
						var summary = self.formatSendingCompletedSummary(remoteCount);
						if (sendStatus === 'completed_with_errors') {
							summary += ' (' + asenhaSbT('failed') + ')';
						}
						$subLabel.text(summary);
					}
				}
			});
			
			// Update circular progress
			$progress.find('.asenha-circle-progress').attr('stroke-dasharray', '100, 100').addClass('completed');
			$progress.find('.asenha-progress-percent').text('100%');

			// Final time update
			this.updateTimeDisplay($progress);
			$progress.find('.asenha-time-remaining').hide();

			// Re-enable buttons
			$('.asenha-start-backup').prop('disabled', false);
			$('.asenha-cancel-backup').hide();

			if (this.backupArchiveCountsTowardGrandTotal(state)) {
				var fileSize = Math.max(0, parseInt(state.file_size || 0, 10) || 0);
				if (fileSize > 0) {
					var $section = $('.asenha-backup-history');
					var current = Math.max(0, parseInt($section.attr('data-archives-total-bytes') || '0', 10) || 0);
					this.updateBackupArchivesGrandTotal(current + fileSize);
				}
			}

			// Show completion UI with Reload Now button
			this.showCompletionUI($progress, 'backup');
		},

		/**
		 * Backup failed
		 */
		backupFailed: function(message) {
			clearInterval(this.progressInterval);
			clearInterval(this.timeInterval);
			
			// Clear localStorage
			if (this.currentBackupId) {
				this.clearProgress(this.currentBackupId);
			}
			this.currentBackupId = null;

			var $progress = $('.asenha-backup-progress');
			
			// Mark current step as failed and update sub-label
			var $failedStep = $progress.find('.asenha-checkpoint.in-progress');
			$failedStep.removeClass('in-progress').addClass('failed');
			$failedStep.find('.asenha-checkpoint-sub').text(asenhaSbT('failed'));
			
			// Update circular progress
			$progress.find('.asenha-circle-progress').addClass('failed');

			// Re-enable buttons
			$('.asenha-start-backup').prop('disabled', false);
			$('.asenha-cancel-backup').hide();

			// Show error notice
			this.showNotice('error', message);
		},

		/**
		 * Backup cancelled
		 */
		backupCancelled: function() {
			clearInterval(this.progressInterval);
			clearInterval(this.timeInterval);
			
			// Clear localStorage
			if (this.currentBackupId) {
				this.clearProgress(this.currentBackupId);
			}
			this.currentBackupId = null;

			var $progress = $('.asenha-backup-progress');
			var $cancelButton = $('.asenha-cancel-backup');

			// Remove cancelling class from progress
			$progress.find('.asenha-circle-progress').removeClass('cancelling');

			// Hide progress section
			$progress.hide();

			// Re-enable buttons and reset cancel button text
			$('.asenha-start-backup').prop('disabled', false);
			$cancelButton.prop('disabled', false).text(asenhaSbT('cancel')).hide();
		},

		/**
		 * Delete backup
		 */
		deleteBackup: function(e) {
			e.preventDefault();

			if (!confirm(asenhaSiteBackup.strings.confirmDelete)) {
				return;
			}

			var $button = $(e.currentTarget);
			var filename = String($button.attr('data-filename') || '');
			if (!filename) {
				filename = String($button.data('filename') || '');
			}
			filename = String(filename || '').trim();
			// NOTE: prefer reading raw attribute; jQuery `.data()` uses camelCase keys.
			var locationId = String($button.attr('data-location-id') || '');
			if (!locationId) {
				locationId = String($button.data('locationId') || '');
			}
			locationId = String(locationId || '').trim();

			$button.prop('disabled', true);

			var actionName = locationId ? 'asenha_delete_backup_from_location' : 'asenha_delete_backup';
			var data = {
				action: actionName,
				nonce: asenhaSiteBackup.nonce,
				filename: filename
			};
			if (locationId) {
				data.location_id = locationId;
			}

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: data,
				success: function(response) {
					if (response.success) {
						var message = (response && response.data && response.data.message) ? response.data.message : '';
						var deletedFilenames = (response && response.data && response.data.deleted_filenames && $.isArray(response.data.deleted_filenames))
							? response.data.deleted_filenames
							: [filename];

						// Normalize list.
						var unique = {};
						var list = [];
						for (var i = 0; i < deletedFilenames.length; i++) {
							var fn = String(deletedFilenames[i] || '').trim();
							if (!fn || unique[fn]) {
								continue;
							}
							unique[fn] = true;
							list.push(fn);
						}
						if (list.length === 0 && filename) {
							var fnClicked = String(filename || '').trim();
							list = [fnClicked];
							unique[fnClicked] = true;
						}
						// Ensure the clicked filename is always included (defensive).
						if (filename) {
							var fnClicked2 = String(filename || '').trim();
							if (fnClicked2 && !unique[fnClicked2]) {
								list.push(fnClicked2);
								unique[fnClicked2] = true;
							}
						}

						var removedAny = false;
						var $outerIncRowClickedRef = $button.closest('tr.asenha-chain-incrementals-row');

						// Determine a reasonable scope: prefer the outer list table when clicking within nested incrementals.
						var $scope = $button.closest('table');
						if ($scope.length && $scope.hasClass('asenha-chain-incrementals-table')) {
							var $outerTable = $button.closest('tr.asenha-chain-incrementals-row').closest('table');
							if ($outerTable.length) {
								$scope = $outerTable;
							} else {
								var $fallbackScope = $scope.closest('tr.asenha-chain-incrementals-row').closest('table');
								if ($fallbackScope.length) {
									$scope = $fallbackScope;
								}
							}
						}
						if (!$scope.length) {
							$scope = $(document);
						}

						var locationScope = locationId ? String(locationId) : 'local';
						var reconcileIncrementalsRowsInScope = function($targetScope) {
							if (!$targetScope || !$targetScope.length) {
								return;
							}
							$targetScope.find('tr.asenha-chain-incrementals-row').each(function() {
								var $outer = $(this);
								var remaining = $outer.find('table.asenha-chain-incrementals-table tbody tr').length;
								if (!remaining) {
									$outer.remove();
									removedAny = true;
								} else {
									this.updateIncrementalsSummary($outer);
								}
							}.bind(this));
						}.bind(this);

						// Remove UI elements for each deleted logical backup.
						for (var j = 0; j < list.length; j++) {
							var fn2 = String(list[j] || '').trim();
							if (!fn2) {
								continue;
							}

							var $rows = $scope.find('tr[data-filename="' + this.escapeAttr(fn2) + '"]');
							$rows.each(function() {
								var $row = $(this);
								var hasLocationBlocks = ($row.find('.asenha-backup-location').length > 0);

								if (hasLocationBlocks) {
									// Backup tab: remove only the requested location block (local or specific remote).
									var $blocks = $row.find('.asenha-backup-location[data-location-id="' + SiteBackup.escapeAttr(locationScope) + '"]');
									if ($blocks.length) {
										$blocks.remove();
										removedAny = true;
									}

									// If no remaining location blocks, remove the whole row (+ expansion if base).
									if ($row.find('.asenha-backup-location').length === 0) {
										if ($row.hasClass('asenha-chain-base-row')) {
											$row.next('tr.asenha-chain-incrementals-row').remove();
										}
										$row.remove();
										removedAny = true;
									}
								} else {
									// Migration tab (or any list without location blocks): remove the row directly.
									if ($row.hasClass('asenha-chain-base-row')) {
										$row.next('tr.asenha-chain-incrementals-row').remove();
									}
									$row.remove();
									removedAny = true;
								}
							});
						}

						// Cleanup pass 1: remove empty incrementals rows and refresh summaries in scope.
						reconcileIncrementalsRowsInScope($scope);

						// Post-success fallback: ensure the clicked element disappears if it's still present.
						// Covers any unexpected markup mismatches.
						var clickedStillPresent = ($button && $button.length && $button[0] && $.contains(document, $button[0]));
						var $outerIncRowClicked = $outerIncRowClickedRef;
						if (clickedStillPresent) {
							var $rowClicked = $button.closest('tr');
							$outerIncRowClicked = $button.closest('tr.asenha-chain-incrementals-row');
							var $clickedBlock = $button.closest('.asenha-backup-location');

							if ($clickedBlock.length) {
								$clickedBlock.remove();
								removedAny = true;
							}

							if ($rowClicked.length && $rowClicked.find('.asenha-backup-location').length === 0) {
								if ($rowClicked.hasClass('asenha-chain-base-row')) {
									$rowClicked.next('tr.asenha-chain-incrementals-row').remove();
								}
								$rowClicked.remove();
								removedAny = true;
							}

							if ($outerIncRowClicked.length) {
								var remainingClicked = $outerIncRowClicked.find('table.asenha-chain-incrementals-table tbody tr').length;
								if (!remainingClicked) {
									$outerIncRowClicked.remove();
									removedAny = true;
								} else {
									this.updateIncrementalsSummary($outerIncRowClicked);
								}
							}
						}

						// Deterministic refresh/removal for the clicked incrementals disclosure row.
						if ($outerIncRowClicked.length && $outerIncRowClicked[0] && $.contains(document, $outerIncRowClicked[0])) {
							var remainingClickedFinal = $outerIncRowClicked.find('table.asenha-chain-incrementals-table tbody tr').length;
							if (!remainingClickedFinal) {
								$outerIncRowClicked.remove();
								removedAny = true;
							} else {
								this.updateIncrementalsSummary($outerIncRowClicked);
							}
						}

						// Cleanup pass 2 (defensive): ensure no stale incrementals summaries remain in scope.
						reconcileIncrementalsRowsInScope($scope);

						// Check if backup list is empty.
						if ($('.asenha-backup-list tbody tr').length === 0) {
							$('.asenha-backup-list').replaceWith('<p class="asenha-no-backups">' + asenhaSiteBackup.strings.noBackups + '</p>');
						}

						this.updateBackupArchivesGrandTotalFromTable();

						if (message) {
							this.showNotice('success', message);
						}

						// If the clicked button is still in the DOM, re-enable it to avoid a stuck disabled state.
						if ($button && $button.length && $button[0] && $.contains(document, $button[0])) {
							$button.prop('disabled', false);
						}
					} else {
						$button.prop('disabled', false);
						this.showNotice('error', response.data.message);
					}
				}.bind(this),
				error: function(xhr, status, error) {
					$button.prop('disabled', false);
					this.showNotice('error', error);
				}.bind(this)
			});
		},

		/**
		 * Scan for cleanup artifacts (Clean Up tab)
		 */
		scanCleanupArtifacts: function(e) {
			if (e && e.preventDefault) {
				e.preventDefault();
			}

			var $scanButton = $('#asenha-scan-cleanup-artifacts');
			var $deleteAllButton = $('#asenha-delete-all-cleanup-artifacts');
			var $spinner = $('#asenha-cleanup-scan-spinner');
			var $results = $('#asenha-cleanup-results');
			var $summary = $('#asenha-cleanup-summary');

			$scanButton.prop('disabled', true);
			$deleteAllButton.prop('disabled', true);
			$spinner.show().addClass('is-active');

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_scan_cleanup_artifacts',
					nonce: asenhaSiteBackup.nonce
				},
				success: function(response) {
					$spinner.hide().removeClass('is-active');
					$scanButton.prop('disabled', false);

					if (!response || !response.success) {
						var msg = (response && response.data && response.data.message) ? response.data.message : 'Failed';
						this.showNotice('error', msg);
						return;
					}

					this.renderCleanupResults(response.data);

					var hasDeletables = false;
					if (response.data && response.data.summary) {
						hasDeletables = ((response.data.summary.artifact_count || 0) > 0) || ((response.data.summary.invalid_zip_count || 0) > 0);
					}

					$results.show();
					$summary.show();
					$deleteAllButton.prop('disabled', !hasDeletables);
				}.bind(this),
				error: function(xhr, status, error) {
					$spinner.hide().removeClass('is-active');
					$scanButton.prop('disabled', false);
					this.showNotice('error', error || asenhaSbT('failed'));
				}.bind(this)
			});
		},

		/**
		 * Render cleanup results into the Clean Up tab.
		 *
		 * @param {Object} payload Scan payload.
		 */
		renderCleanupResults: function(payload) {
			var $results = $('#asenha-cleanup-results');
			var $summary = $('#asenha-cleanup-summary');

			if (!payload || !payload.groups || !payload.groups.length) {
				$summary.html('<p class="asenha-cleanup-empty">' + this.escapeHtml(asenhaSbT('noArtifactsFound')) + '</p>');
				$results.html('');
				return;
			}

			var s = payload.summary || {};
			var t = asenhaSiteBackup.strings || {};
			var summaryHtml = '';
			summaryHtml += '<div class="asenha-cleanup-summary-inner">';
			summaryHtml += '<span class="asenha-cleanup-summary-item"><strong>' + this.escapeHtml(String(s.groups || 0)) + '</strong> ' + this.escapeHtml(asenhaSbT('cleanupGroupsLabel')) + '</span>';
			summaryHtml += '<span class="asenha-cleanup-summary-item"><strong>' + this.escapeHtml(String(s.artifact_count || 0)) + '</strong> ' + this.escapeHtml(asenhaSbT('cleanupArtifactsLabel')) + ' (' + this.escapeHtml(String(s.artifact_size_human || '0 B')) + ')</span>';
			summaryHtml += '<span class="asenha-cleanup-summary-item"><strong>' + this.escapeHtml(String(s.invalid_zip_count || 0)) + '</strong> ' + this.escapeHtml(asenhaSbT('cleanupInvalidZipsLabel')) + ' (' + this.escapeHtml(String(s.invalid_zip_size_human || '0 B')) + ')</span>';
			summaryHtml += '</div>';
			$summary.html(summaryHtml);

			var html = '';
			for (var i = 0; i < payload.groups.length; i++) {
				html += this.renderCleanupGroup(payload.groups[i]);
			}
			$results.html(html);
		},

		/**
		 * Render one group section.
		 *
		 * @param {Object} group Group data.
		 * @return {string}
		 */
		renderCleanupGroup: function(group) {
			if (!group || !group.id) {
				return '';
			}

			var groupId = String(group.id);
			var title = group.title || groupId;
			var stats = group.stats || {};
			var t = asenhaSiteBackup.strings || {};

			var html = '';
			html += '<details class="asenha-cleanup-group" open>';
			html += '<summary class="asenha-cleanup-group-summary">';
			html += '<span class="asenha-cleanup-group-title">' + this.escapeHtml(String(title)) + '</span>';

			html += '<span class="asenha-cleanup-group-meta">';
			html += this.escapeHtml(String(stats.artifact_count || 0)) + ' ' + this.escapeHtml(asenhaSbT('cleanupItemsLabel'));
			if (stats.invalid_zip_count && stats.invalid_zip_count > 0) {
				html += ' • ' + this.escapeHtml(String(stats.invalid_zip_count)) + ' ' + this.escapeHtml(asenhaSbT('cleanupInvalidZipsLabel'));
			}
			html += '</span>';

			html += '<button type="button" class="button button-small asenha-delete-cleanup-group" data-group-id="' + this.escapeAttr(groupId) + '">';
			html += this.escapeHtml(asenhaSbT('cleanupDeleteGroup'));
			html += '</button>';
			html += '</summary>';

			// Artifacts tree.
			html += '<div class="asenha-cleanup-group-body">';
			if (group.tree && group.tree.length) {
				html += '<div class="asenha-cleanup-tree-wrapper">';
				html += this.renderCleanupTree(group.tree, groupId);
				html += '</div>';
			} else {
				html += '<p class="asenha-cleanup-empty">' + this.escapeHtml(asenhaSbT('noArtifactsFound')) + '</p>';
			}

			// Related zips section.
			if (group.related_zips && group.related_zips.length) {
				html += '<div class="asenha-cleanup-zips">';
				html += '<h3 class="asenha-cleanup-zips-title">' + this.escapeHtml(asenhaSbT('cleanupRelatedArchives')) + '</h3>';
				html += '<table class="wp-list-table widefat striped asenha-cleanup-zips-table">';
				html += '<thead><tr>';
				html += '<th>' + this.escapeHtml(asenhaSbT('cleanupFilename')) + '</th>';
				html += '<th>' + this.escapeHtml(asenhaSbT('cleanupSize')) + '</th>';
				html += '<th>' + this.escapeHtml(asenhaSbT('cleanupAge')) + '</th>';
				html += '<th>' + this.escapeHtml(asenhaSbT('cleanupStatus')) + '</th>';
				html += '<th>' + this.escapeHtml(asenhaSbT('cleanupActions')) + '</th>';
				html += '</tr></thead><tbody>';

				for (var z = 0; z < group.related_zips.length; z++) {
					var zip = group.related_zips[z];
					var isValid = zip.is_valid_zip;
					var statusLabel = (isValid === true) ? asenhaSbT('cleanupValid') : (isValid === false) ? asenhaSbT('cleanupInvalid') : asenhaSbT('cleanupUnknown');
					var statusClass = (isValid === true) ? 'asenha-cleanup-zip-valid' : (isValid === false) ? 'asenha-cleanup-zip-invalid' : 'asenha-cleanup-zip-unknown';

					html += '<tr>';
					html += '<td><strong>' + this.escapeHtml(String(zip.filename || zip.rel_path || '')) + '</strong></td>';
					html += '<td>' + this.escapeHtml(String(zip.size_human || '')) + '</td>';
					html += '<td>' + this.escapeHtml(String(zip.age_human || '')) + '</td>';
					html += '<td><span class="asenha-cleanup-zip-status ' + statusClass + '">' + this.escapeHtml(statusLabel) + '</span></td>';
					html += '<td>';
					if (zip.deletable) {
						html += '<button type="button" class="button button-small asenha-delete-cleanup-zip" data-kind="zip" data-group-id="' + this.escapeAttr(groupId) + '" data-root-id="' + this.escapeAttr(String(zip.root_id || '')) + '" data-rel-path="' + this.escapeAttr(String(zip.rel_path || '')) + '">' + this.escapeHtml(asenhaSbT('cleanupDelete')) + '</button>';
					} else {
						html += '<span class="asenha-cleanup-zip-action-disabled">—</span>';
					}
					html += '</td>';
					html += '</tr>';
				}

				html += '</tbody></table>';
				html += '</div>';
			}

			html += '</div>'; // group body
			html += '</details>';

			return html;
		},

		/**
		 * Render a tree list for a group.
		 *
		 * @param {Array} nodes Tree nodes.
		 * @param {string} groupId Group id.
		 * @return {string}
		 */
		renderCleanupTree: function(nodes, groupId) {
			var html = '<ul class="asenha-cleanup-tree">';
			for (var i = 0; i < nodes.length; i++) {
				html += this.renderCleanupNode(nodes[i], groupId);
			}
			html += '</ul>';
			return html;
		},

		/**
		 * Render a single node (recursive).
		 *
		 * @param {Object} node Node.
		 * @param {string} groupId Group id.
		 * @return {string}
		 */
		renderCleanupNode: function(node, groupId) {
			if (!node || !node.rel_path || !node.root_id) {
				return '';
			}

			var hasChildren = node.children && node.children.length;
			var icon = (node.type === 'dir') ? 'dashicons-category' : 'dashicons-media-default';

			var row = '';
			row += '<span class="asenha-cleanup-col asenha-cleanup-col-name">';
			row += '<span class="dashicons ' + icon + '"></span> ';
			row += '<span class="asenha-cleanup-name">' + this.escapeHtml(String(node.name || node.rel_path)) + '</span>';
			row += '<span class="asenha-cleanup-path">' + this.escapeHtml(String(node.rel_path)) + '</span>';
			row += '</span>';
			row += '<span class="asenha-cleanup-col asenha-cleanup-col-size">' + this.escapeHtml(String(node.size_human || '')) + '</span>';
			row += '<span class="asenha-cleanup-col asenha-cleanup-col-age">' + this.escapeHtml(String(node.age_human || '')) + '</span>';
			row += '<span class="asenha-cleanup-col asenha-cleanup-col-actions">';
			row += '<button type="button" class="button button-small asenha-delete-cleanup-item" data-kind="artifact" data-group-id="' + this.escapeAttr(String(groupId)) + '" data-root-id="' + this.escapeAttr(String(node.root_id)) + '" data-rel-path="' + this.escapeAttr(String(node.rel_path)) + '">' + this.escapeHtml(asenhaSbT('cleanupDelete')) + '</button>';
			row += '</span>';

			var html = '<li class="asenha-cleanup-tree-item">';

			if (hasChildren) {
				html += '<details class="asenha-cleanup-node asenha-cleanup-node-dir">';
				html += '<summary class="asenha-cleanup-node-summary">' + row + '</summary>';
				html += '<div class="asenha-cleanup-node-children">';
				html += '<ul class="asenha-cleanup-tree">';
				for (var i = 0; i < node.children.length; i++) {
					html += this.renderCleanupNode(node.children[i], groupId);
				}
				html += '</ul>';
				html += '</div>';
				html += '</details>';
			} else {
				html += '<div class="asenha-cleanup-node asenha-cleanup-node-file">' + row + '</div>';
			}

			html += '</li>';
			return html;
		},

		/**
		 * Delete a single artifact node.
		 */
		deleteCleanupItem: function(e) {
			e.preventDefault();
			e.stopPropagation();

			if (!confirm(asenhaSiteBackup.strings.confirmCleanupDeleteItem)) {
				return;
			}

			var $button = $(e.currentTarget);
			var rootId = String($button.data('rootId') || '');
			var relPath = String($button.data('relPath') || '');
			var groupId = String($button.data('groupId') || '');

			if (!rootId || !relPath) {
				this.showNotice('error', asenhaSbT('invalidArtifactParameters'));
				return;
			}

			$button.prop('disabled', true);

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_delete_cleanup_artifact',
					nonce: asenhaSiteBackup.nonce,
					root_id: rootId,
					rel_path: relPath,
					kind: 'artifact',
					group_id: groupId
				},
				success: function(response) {
					if (response && response.success) {
						this.showNotice('success', (response.data && response.data.message) ? response.data.message : asenhaSbT('deleted'));
						this.scanCleanupArtifacts();
					} else {
						$button.prop('disabled', false);
						this.showNotice('error', (response && response.data && response.data.message) ? response.data.message : asenhaSbT('failed'));
					}
				}.bind(this),
				error: function(xhr, status, error) {
					$button.prop('disabled', false);
					this.showNotice('error', error || asenhaSbT('failed'));
				}.bind(this)
			});
		},

		/**
		 * Delete an invalid related zip.
		 */
		deleteCleanupZip: function(e) {
			e.preventDefault();
			e.stopPropagation();

			if (!confirm(asenhaSiteBackup.strings.confirmCleanupDeleteItem)) {
				return;
			}

			var $button = $(e.currentTarget);
			var rootId = String($button.data('rootId') || '');
			var relPath = String($button.data('relPath') || '');
			var groupId = String($button.data('groupId') || '');

			if (!rootId || !relPath || !groupId) {
				this.showNotice('error', asenhaSbT('invalidArchiveParameters'));
				return;
			}

			$button.prop('disabled', true);

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_delete_cleanup_artifact',
					nonce: asenhaSiteBackup.nonce,
					root_id: rootId,
					rel_path: relPath,
					kind: 'zip',
					group_id: groupId
				},
				success: function(response) {
					if (response && response.success) {
						this.showNotice('success', (response.data && response.data.message) ? response.data.message : asenhaSbT('deleted'));
						this.scanCleanupArtifacts();
					} else {
						$button.prop('disabled', false);
						this.showNotice('error', (response && response.data && response.data.message) ? response.data.message : asenhaSbT('failed'));
					}
				}.bind(this),
				error: function(xhr, status, error) {
					$button.prop('disabled', false);
					this.showNotice('error', error || asenhaSbT('failed'));
				}.bind(this)
			});
		},

		/**
		 * Delete all items in a group.
		 */
		deleteCleanupGroup: function(e) {
			e.preventDefault();
			e.stopPropagation();

			if (!confirm(asenhaSiteBackup.strings.confirmCleanupDeleteGroup)) {
				return;
			}

			var $button = $(e.currentTarget);
			var groupId = String($button.data('groupId') || '');
			if (!groupId) {
				this.showNotice('error', asenhaSbT('invalidGroup'));
				return;
			}

			$button.prop('disabled', true);

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_delete_cleanup_group',
					nonce: asenhaSiteBackup.nonce,
					group_id: groupId
				},
				success: function(response) {
					if (response && response.success) {
						this.showNotice('success', (response.data && response.data.message) ? response.data.message : asenhaSbT('deleted'));
						this.scanCleanupArtifacts();
					} else {
						$button.prop('disabled', false);
						this.showNotice('error', (response && response.data && response.data.message) ? response.data.message : asenhaSbT('failed'));
					}
				}.bind(this),
				error: function(xhr, status, error) {
					$button.prop('disabled', false);
					this.showNotice('error', error || asenhaSbT('failed'));
				}.bind(this)
			});
		},

		/**
		 * Delete all artifacts (and invalid related zips).
		 */
		deleteAllCleanupArtifacts: function(e) {
			e.preventDefault();

			if (!confirm(asenhaSiteBackup.strings.confirmCleanupDeleteAll)) {
				return;
			}

			var $button = $(e.currentTarget);
			$button.prop('disabled', true);

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_delete_all_cleanup_artifacts',
					nonce: asenhaSiteBackup.nonce
				},
				success: function(response) {
					$button.prop('disabled', false);
					if (response && response.success) {
						this.showNotice('success', (response.data && response.data.message) ? response.data.message : asenhaSbT('deleted'));
						this.scanCleanupArtifacts();
					} else {
						this.showNotice('error', (response && response.data && response.data.message) ? response.data.message : asenhaSbT('failed'));
					}
				}.bind(this),
				error: function(xhr, status, error) {
					$button.prop('disabled', false);
					this.showNotice('error', error || asenhaSbT('failed'));
				}.bind(this)
			});
		},

		/**
		 * Escape HTML for safe rendering.
		 *
		 * @param {string} str Input string.
		 * @return {string}
		 */
		escapeHtml: function(str) {
			var s = (str === null || typeof str === 'undefined') ? '' : String(str);
			return s.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/\"/g, '&quot;')
				.replace(/'/g, '&#039;');
		},

		/**
		 * Escape a string for attribute context.
		 *
		 * @param {string} str Input string.
		 * @return {string}
		 */
		escapeAttr: function(str) {
			return this.escapeHtml(str);
		},

		/**
		 * Recompute and update an incrementals chain summary.
		 *
		 * Output format:
		 * "{N} incrementals | {totalSize} | Latest: {latestDate}".
		 *
		 * @param {jQuery} $outerIncRow Outer row element: tr.asenha-chain-incrementals-row*
		 * @return {void}
		 */
		updateIncrementalsSummary: function($outerIncRow) {
			if (!$outerIncRow || !$outerIncRow.length) {
				return;
			}

			var $details = $outerIncRow.find('details.asenha-chain-incrementals').first();
			if (!$details.length) {
				return;
			}

			var $summary = $details.children('summary').first();
			if (!$summary.length) {
				$summary = $details.find('summary').first();
			}
			if (!$summary.length) {
				return;
			}

			var $rows = $outerIncRow.find('table.asenha-chain-incrementals-table tbody tr');
			var count = Math.max(0, parseInt($rows.length, 10) || 0);
			if (count <= 0) {
				$summary.text('');
				return;
			}

			var fallbackLocationId = $outerIncRow.hasClass('asenha-chain-incrementals-row-storage') ? 'storage' : 'local';
			var locationStats = {};
			var latestTs = 0;
			var latestHuman = '';
			var latestHumanFallback = '';

			$rows.each(function() {
				var $row = $(this);
				var sizeBytes = Math.max(0, parseInt($row.attr('data-size-bytes') || '0', 10) || 0);
				var modifiedTs = Math.max(0, parseInt($row.attr('data-modified-ts') || '0', 10) || 0);
				var modifiedHuman = String($row.attr('data-modified-human') || '').trim();

				if (!latestHumanFallback && modifiedHuman) {
					latestHumanFallback = modifiedHuman;
				}
				if (modifiedTs > latestTs) {
					latestTs = modifiedTs;
					latestHuman = modifiedHuman;
				}

				var rowLocationIds = [];
				var seenLocationIds = {};
				$row.find('.asenha-backup-location[data-location-id]').each(function() {
					var locationId = String($(this).attr('data-location-id') || '').trim();
					if (!locationId || seenLocationIds[locationId]) {
						return;
					}
					seenLocationIds[locationId] = true;
					rowLocationIds.push(locationId);
				});

				if (!rowLocationIds.length) {
					var csv = String($row.attr('data-locations') || '');
					if (csv) {
						csv.split(',').forEach(function(rawLocationId) {
							var locationId = String(rawLocationId || '').trim();
							if (!locationId || seenLocationIds[locationId]) {
								return;
							}
							seenLocationIds[locationId] = true;
							rowLocationIds.push(locationId);
						});
					}
				}

				if (!rowLocationIds.length) {
					rowLocationIds.push(fallbackLocationId);
				}

				rowLocationIds.forEach(function(locationId) {
					if (!locationStats[locationId]) {
						locationStats[locationId] = {
							count: 0,
							bytes: 0
						};
					}
					locationStats[locationId].count += 1;
					locationStats[locationId].bytes += sizeBytes;
				});
			});

			var bestLocationId = '';
			var bestCount = -1;
			var bestBytes = -1;
			Object.keys(locationStats).forEach(function(locationId) {
				var stats = locationStats[locationId] || {};
				var locCount = Math.max(0, parseInt(stats.count || 0, 10) || 0);
				var locBytes = Math.max(0, parseInt(stats.bytes || 0, 10) || 0);
				var isBetter = false;

				if (locCount > bestCount) {
					isBetter = true;
				} else if (locCount === bestCount && locBytes > bestBytes) {
					isBetter = true;
				} else if (locCount === bestCount && locBytes === bestBytes) {
					var bestIsLocal = (bestLocationId === 'local');
					var locIsLocal = (locationId === 'local');
					if (locIsLocal && !bestIsLocal) {
						isBetter = true;
					} else if (locIsLocal === bestIsLocal) {
						if (!bestLocationId || locationId < bestLocationId) {
							isBetter = true;
						}
					}
				}

				if (isBetter) {
					bestLocationId = locationId;
					bestCount = locCount;
					bestBytes = locBytes;
				}
			});

			var totalBytesHuman = this.formatBytes(Math.max(0, bestBytes), 2);
			var incrementalLabel = (count === 1)
				? (asenhaSbT('incrementalLabelSingular') || 'incremental')
				: (asenhaSbT('incrementalLabelPlural') || 'incrementals');
			var latestLabel = asenhaSbT('latestLabel') || 'Latest';
			var latestText = latestHuman || latestHumanFallback || '-';
			var summaryTpl = asenhaSbT('incrementalsSummaryTpl') || '%1$d %2$s | %3$s | %4$s: %5$s';
			var summaryText = asenhaSbFmt(summaryTpl, {
				'1': count,
				'2': incrementalLabel,
				'3': totalBytesHuman,
				'4': latestLabel,
				'5': latestText
			});

			$summary.text(summaryText);
		},

		/**
		 * Build localized Storage tab per-origin archives summary line (matches PHP format).
		 *
		 * @param {number} baselineCount    Baseline chain count.
		 * @param {number} incrementalCount Incremental row count (including orphans).
		 * @param {string} oldestHuman      Oldest archive display datetime or dash.
		 * @param {string} latestHuman      Latest archive display datetime or dash.
		 * @return {string}
		 */
		buildStorageOriginArchivesSummaryLabel: function(baselineCount, incrementalCount, oldestHuman, latestHuman) {
			var bc = Math.max(0, parseInt(baselineCount, 10) || 0);
			var ic = Math.max(0, parseInt(incrementalCount, 10) || 0);
			var baselineWord = (bc === 1)
				? (asenhaSbT('storageBaselineSingular') || 'baseline')
				: (asenhaSbT('storageBaselinePlural') || 'baselines');
			var incWord = (ic === 1)
				? (asenhaSbT('incrementalLabelSingular') || 'incremental')
				: (asenhaSbT('incrementalLabelPlural') || 'incrementals');
			var tpl = asenhaSbT('storageOriginArchivesSummaryTpl') || '%1$d %2$s | %3$d %4$s | %5$s: %6$s | %7$s: %8$s';
			return asenhaSbFmt(tpl, {
				'1': bc,
				'2': baselineWord,
				'3': ic,
				'4': incWord,
				'5': asenhaSbT('storageArchivesOldestLabel') || 'Oldest',
				'6': (oldestHuman && String(oldestHuman).trim()) ? String(oldestHuman).trim() : '-',
				'7': asenhaSbT('latestLabel') || 'Latest',
				'8': (latestHuman && String(latestHuman).trim()) ? String(latestHuman).trim() : '-'
			});
		},

		/**
		 * Recompute Storage tab per-origin summary from remaining archive rows (after delete, etc.).
		 *
		 * @param {jQuery} $origin .asenha-storage-origin scope.
		 * @return {void}
		 */
		updateStorageOriginArchivesSummary: function($origin) {
			if (!$origin || !$origin.length) {
				return;
			}

			var $btn = $origin.find('.asenha-storage-origin-archives-toggle').first();
			if (!$btn.length) {
				return;
			}

			var baselineCount = 0;
			var incrementalCount = 0;
			var minTs = null;
			var maxTs = null;
			var oldestHuman = '-';
			var latestHuman = '-';

			$origin.find('.asenha-storage-archives-table tbody tr.asenha-chain-base-row').each(function() {
				var $r = $(this);
				var role = String($r.attr('data-chain-base-role') || 'baseline').trim();
				if (role === 'baseline') {
					baselineCount++;
				} else if (role === 'incremental_orphan' || role === 'broken_incremental') {
					incrementalCount++;
				}
				var ts = Math.max(0, parseInt($r.attr('data-modified-ts') || '0', 10) || 0);
				var hum = String($r.attr('data-modified-human') || '').trim();
				if (ts > 0) {
					if (minTs === null || ts < minTs) {
						minTs = ts;
						oldestHuman = hum || '-';
					}
					if (maxTs === null || ts > maxTs) {
						maxTs = ts;
						latestHuman = hum || '-';
					}
				}
			});

			$origin.find('.asenha-chain-incrementals-table-storage tbody tr').each(function() {
				incrementalCount++;
				var $r = $(this);
				var ts = Math.max(0, parseInt($r.attr('data-modified-ts') || '0', 10) || 0);
				var hum = String($r.attr('data-modified-human') || '').trim();
				if (ts > 0) {
					if (minTs === null || ts < minTs) {
						minTs = ts;
						oldestHuman = hum || '-';
					}
					if (maxTs === null || ts > maxTs) {
						maxTs = ts;
						latestHuman = hum || '-';
					}
				}
			});

			if (minTs === null) {
				oldestHuman = '-';
				latestHuman = '-';
			}

			var label = this.buildStorageOriginArchivesSummaryLabel(baselineCount, incrementalCount, oldestHuman, latestHuman);
			$btn.text(label);

			var latestTsAttr = (maxTs !== null && maxTs > 0) ? maxTs : 0;
			$origin.attr('data-archives-latest-ts', String(latestTsAttr));
		},

		/**
		 * Backward-compatible alias for older call sites.
		 *
		 * @param {jQuery} $outerIncRow Outer row element: tr.asenha-chain-incrementals-row*
		 * @return {void}
		 */
		updateIncrementalsSummaryCount: function($outerIncRow) {
			this.updateIncrementalsSummary($outerIncRow);
		},

		/**
		 * Get normalized label for a remote location type.
		 *
		 * @param {string} type Remote location type slug (e.g. sftp, wp_site).
		 * @return {string}
		 */
		getRemoteLocationTypeLabel: function(type) {
			var raw = String(type || '');
			var key = raw.toLowerCase();

			if (key === 'sftp') {
				return asenhaSbT('locationTypeSftp');
			}
			if (key === 'webdav') {
				return asenhaSbT('locationTypeWebdav');
			}
			if (key === 'wp_site') {
				return asenhaSbT('locationTypeWpSiteLabel');
			}
			if (key === 'google_drive') {
				return asenhaSbT('locationTypeGoogleDrive');
			}
			if (key === 'dropbox') {
				return asenhaSbT('locationTypeDropbox');
			}
			if (key === 's3') {
				return asenhaSbT('locationTypeS3');
			}
			if (key === 's3_compatible') {
				return asenhaSbT('locationTypeS3Compatible');
			}

			// Fallback: best-effort humanization (snake_case -> Title Case).
			if (!key) {
				return asenhaSbT('remoteLocation');
			}
			var human = key.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
			return human.replace(/\b\w/g, function(m) { return m.toUpperCase(); });
		},

		/**
		 * Format a remote location label.
		 *
		 * Output format: "{TypeLabel} - {TitleOrUntitled}"
		 *
		 * @param {string} type Remote location type slug.
		 * @param {string} title Remote location title.
		 * @return {string}
		 */
		formatRemoteLocationLabel: function(type, title) {
			var typeLabel = this.getRemoteLocationTypeLabel(type);
			var sTitle = String(title || '').trim();
			if (!sTitle) {
				sTitle = asenhaSbT('untitled');
			}
			return typeLabel + ' - ' + sTitle;
		},
		
		/**
		 * Copy backup URL to clipboard
		 */
		copyBackupUrl: function(e) {
			e.preventDefault();
			
			var $button = $(e.currentTarget);
			var url = ($button.data('url') || '').toString();
			
			if (!url) {
				this.showNotice('error', asenhaSbT('copyFailed'));
				return;
			}
			
			var originalText = $button.data('asenhaOriginalText');
			if (!originalText) {
				originalText = $button.text();
				$button.data('asenhaOriginalText', originalText);
			}
			
			var showCopied = function() {
				this.showNotice('success', asenhaSbT('backupUrlCopied'));
				$button.text(asenhaSbT('copied'));
				setTimeout(function() {
					$button.text(originalText);
				}, 2000);
			}.bind(this);
			
			var showCopyFailed = function() {
				this.showNotice('error', asenhaSbT('copyFailed'));
			}.bind(this);
			
			// Modern clipboard API
			if (navigator.clipboard && navigator.clipboard.writeText) {
				navigator.clipboard.writeText(url).then(function() {
					showCopied();
				}).catch(function() {
					// Fall back if Clipboard API fails (e.g. not a secure context)
					var copied = false;
					var $temp = $('<textarea readonly></textarea>')
						.val(url)
						.css({
							position: 'absolute',
							left: '-9999px',
							top: '0'
						});
					$('body').append($temp);
					$temp[0].select();
					
					try {
						copied = document.execCommand('copy');
					} catch (err) {
						copied = false;
					}
					
					$temp.remove();
					
					if (copied) {
						showCopied();
					} else {
						showCopyFailed();
					}
				});
				return;
			}
			
			// Fallback
			var copied = false;
			var $temp = $('<textarea readonly></textarea>')
				.val(url)
				.css({
					position: 'absolute',
					left: '-9999px',
					top: '0'
				});
			$('body').append($temp);
			$temp[0].select();
			
			try {
				copied = document.execCommand('copy');
			} catch (err) {
				copied = false;
			}
			
			$temp.remove();
			
			if (copied) {
				showCopied();
			} else {
				showCopyFailed();
			}
		},

		/**
		 * Show restore options
		 */
		showRestoreOptions: function(e) {
			var $target = $(e.currentTarget);
			var filename;

			if ($target.is('button')) {
				filename = $target.data('filename');
			} else {
				filename = $target.val();
			}

			if (!filename) {
				return;
			}

			// Store selected filename
			$('.asenha-restore-options').data('filename', filename).slideDown();
		},

		/**
		 * Parse a loosely-typed truthy flag value.
		 *
		 * @param {*} value
		 * @return {boolean}
		 */
		isTruthyFlag: function(value) {
			if (value === true || value === 1) {
				return true;
			}
			if (typeof value === 'string') {
				var normalized = value.toLowerCase();
				return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on';
			}
			return false;
		},

		/**
		 * Get restore passphrase field wrapper.
		 *
		 * @return {jQuery}
		 */
		getRestorePassphraseField: function() {
			return $('.asenha-restore-archive-passphrase-field').first();
		},

		/**
		 * Hide and reset inline restore passphrase UI.
		 *
		 * @param {boolean} clearValue
		 */
		hideRestorePassphraseField: function(clearValue) {
			var $field = this.getRestorePassphraseField();
			if (!$field.length) {
				return;
			}

			$('.asenha-chain-action-popup-item-passphrase-open').removeClass('asenha-chain-action-popup-item-passphrase-open');

			var $host = $('#asenha-restore-passphrase-host');
			if ($host.length) {
				$host.append($field);
			}

			$field.removeClass('asenha-restore-archive-passphrase-inline').hide();
			if (clearValue) {
				$field.find('#asenha-restore-archive-passphrase').val('');
			}
		},

		/**
		 * Close the restore-point popover that contains the given button.
		 *
		 * @param {jQuery} $button
		 */
		closeRestorePopover: function($button) {
			if (!$button || !$button.length) {
				return;
			}

			var detailsEl = $button.closest('details.asenha-multipart-download, details.asenha-chain-action-popup').get(0);
			if (detailsEl) {
				detailsEl.removeAttribute('open');
				this.resetMultipartDownloadDropdownPosition(detailsEl);
			}
		},

		/**
		 * Open the restore-point popover that contains the given button.
		 *
		 * @param {jQuery} $button
		 */
		openRestorePopover: function($button) {
			if (!$button || !$button.length) {
				return;
			}

			var detailsEl = $button.closest('details.asenha-multipart-download, details.asenha-chain-action-popup').get(0);
			if (detailsEl) {
				detailsEl.setAttribute('open', '');
				this.adjustMultipartDownloadDropdownHeight(detailsEl);
			}
		},

		/**
		 * Scroll the restore table row (or action area) into view.
		 *
		 * @param {jQuery} $button
		 */
		scrollRestoreRowIntoView: function($button) {
			if (!$button || !$button.length) {
				return;
			}

			var $target = $button.closest('tr.asenha-restore-selected');
			if (!$target.length) {
				$target = $button.closest('tr');
			}
			if (!$target.length) {
				$target = $button.closest('.asenha-chain-action-popup-item, .asenha-backup-location-actions');
			}
			if ($target.length && $target.offset()) {
				$('html, body').animate({
					scrollTop: $target.offset().top - 80
				}, 400);
			}
		},

		/**
		 * Clear tracked restore trigger state after a terminal restore outcome.
		 */
		clearRestoreTriggerState: function() {
			this.currentRestoreButton = null;
			this.currentRestorePassphraseRequired = false;
			this.currentRestoreHadPassphrase = false;
		},

		/**
		 * Determine whether a failed restore should reopen the passphrase UI for retry.
		 *
		 * @param {string} message
		 * @param {string} errorCode
		 * @return {boolean}
		 */
		isRestorePassphraseRetryableFailure: function(message, errorCode) {
			if (!this.currentRestorePassphraseRequired) {
				return false;
			}
			if (!this.currentRestoreButton || !this.currentRestoreButton.length) {
				return false;
			}

			var code = String(errorCode || '').toLowerCase();
			if (code === 'archive_passphrase_invalid') {
				return true;
			}
			if (code === 'manifest_not_found' && this.currentRestoreHadPassphrase) {
				return true;
			}

			var msg = String(message || '').toLowerCase();
			if (msg.indexOf('verify the archive passphrase') !== -1) {
				return true;
			}
			if (msg.indexOf('failed to decrypt') !== -1) {
				return true;
			}
			if (msg.indexOf('manifest not found in archive') !== -1 && this.currentRestoreHadPassphrase) {
				return true;
			}

			return false;
		},

		/**
		 * Place and show restore passphrase field near the selected restore point.
		 *
		 * @param {jQuery} $button
		 * @param {string} mode Optional display mode: 'initial' or 'retry'.
		 */
		showRestorePassphraseField: function($button, mode) {
			var $field = this.getRestorePassphraseField();
			if (!$field.length || !$button || !$button.length) {
				return;
			}

			var promptKey = (mode === 'retry') ? 'restoreArchivePassphraseRetryPrompt' : 'restoreArchivePassphrasePrompt';
			var prompt = asenhaSbT(promptKey) || asenhaSbT('restoreArchivePassphrasePrompt');
			var $message = $field.find('.asenha-restore-archive-passphrase-message');
			if (prompt && $message.length) {
				$message.text(prompt);
			}

			$('.asenha-chain-action-popup-item-passphrase-open').removeClass('asenha-chain-action-popup-item-passphrase-open');

			var $popupItem = $button.closest('.asenha-chain-action-popup-item');
			if ($popupItem.length) {
				$popupItem.addClass('asenha-chain-action-popup-item-passphrase-open');
				$popupItem.append($field);
			} else {
				var $actions = $button.closest('.asenha-backup-location-actions');
				if ($actions.length) {
					$actions.append($field);
				} else {
					$field.insertAfter($button);
				}
			}

			$field.addClass('asenha-restore-archive-passphrase-inline').show();
			$field.find('#asenha-restore-archive-passphrase').trigger('focus');

			var detailsEl = $button.closest('details.asenha-multipart-download').get(0);
			if (detailsEl && detailsEl.open) {
				this.adjustMultipartDownloadDropdownHeight(detailsEl);
			}
		},

		/**
		 * Determine whether a restore point requires an archive passphrase.
		 *
		 * @param {jQuery} $button
		 * @param {jQuery} $row
		 * @return {boolean}
		 */
		isRestorePassphraseRequired: function($button, $row) {
			var buttonRequired = $button.attr('data-archive-passphrase-required');
			var rowRequired = $row.attr('data-archive-passphrase-required');
			var buttonEncrypted = $button.attr('data-is-encrypted-archive');
			var rowEncrypted = $row.attr('data-is-encrypted-archive');

			var requiresPassphrase = this.isTruthyFlag(buttonRequired) || this.isTruthyFlag(rowRequired);
			var isEncryptedArchive = this.isTruthyFlag(buttonEncrypted) || this.isTruthyFlag(rowEncrypted);

			return requiresPassphrase || isEncryptedArchive;
		},

		/**
		 * Select restore backup (from Restore tab button click)
		 * Directly starts the restore process based on backup type
		 */
		selectRestoreBackup: function(e) {
			e.preventDefault();

			var $button = $(e.currentTarget);
			var $row = $button.closest('tr');
			var $table = $row.closest('table');
			var archivePassphrase = String($('#asenha-restore-archive-passphrase').val() || '');
			
			// Get backup details from data attributes.
			// Prefer the clicked button (needed for nested incremental entries).
			var backupType = $button.data('type');
			var filename = $button.data('filename');
			if (!filename) {
				backupType = $row.data('type');
				filename = $row.data('filename');
			}
			if (!backupType) {
				backupType = $row.data('type');
			}

			if (!filename) {
				return;
			}

			// Map backup type to restore components
			// 'full' -> 'all', 'database' -> 'database', 'files' -> 'files'
			var components = backupType === 'full' ? 'all' : backupType;

			// Remove highlight from all rows and add to selected row
			$table.find('tr').removeClass('asenha-restore-selected');
			$row.addClass('asenha-restore-selected');

			var passphraseRequired = this.isRestorePassphraseRequired($button, $row);
			if (!passphraseRequired) {
				this.hideRestorePassphraseField(true);
			} else if (!archivePassphrase) {
				this.showRestorePassphraseField($button);
				return;
			}

			// Show confirmation dialog
			if (!confirm(asenhaSiteBackup.strings.confirmRestore)) {
				return;
			}

			this.closeRestorePopover($button);
			if (passphraseRequired) {
				this.hideRestorePassphraseField(false);
			}

			// Start the restore process
			var locationId = $button.data('location-id');
			locationId = (typeof locationId === 'undefined' || locationId === null) ? '' : String(locationId);
			this.startRestore(filename, components, $button, locationId, passphraseRequired);
		},

		/**
		 * Start restore
		 * 
		 * @param {string} filename - The backup filename to restore
		 * @param {string} components - The restore components ('all', 'database', or 'files')
		 * @param {jQuery} $button - The button element that triggered the restore
		 * @param {boolean} passphraseRequired - Whether the restore point requires a passphrase
		 */
		startRestore: function(filename, components, $button, locationId, passphraseRequired) {
			var $progress = $('.asenha-restore-progress');
			var archivePassphrase = String($('#asenha-restore-archive-passphrase').val() || '');
			var $row = $button.closest('tr');

			this.currentRestoreButton = $button;
			this.currentRestorePassphraseRequired = !!passphraseRequired || this.isRestorePassphraseRequired($button, $row);
			this.currentRestoreHadPassphrase = archivePassphrase !== '';

			// Suspend heartbeat to prevent the interim login modal from showing while restore is running.
			// Restores often invalidate the current session once wp_options/users are restored.
			this.suspendHeartbeat();

			$button.prop('disabled', true);
			
			// Initialize and show progress
			locationId = (typeof locationId === 'undefined' || locationId === null) ? '' : String(locationId);
			this.currentRestoreOptions = { components: components, locationId: locationId };
			this.initRestoreProgress(components);
			$progress.show();

			// Reset step tracking for new restore
			this.highestRestoreStepIndex = -1;

			// Scroll to progress section
			$('html, body').animate({
				scrollTop: $progress.offset().top - 50
			}, 400);

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_start_restore',
					nonce: asenhaSiteBackup.nonce,
					filename: filename,
					location_id: locationId,
					components: [components],
					archive_passphrase: archivePassphrase,
					create_backup_first: 'false'
				},
				success: function(response) {
					if (response.success) {
						this.currentRestoreId = response.data.restore_id;
						this.currentRestorePublicProgressUrl = response.data.public_progress_url || null;
						if (this.currentRestorePublicProgressUrl) {
							this.saveRestorePublicProgressUrl(this.currentRestoreId, this.currentRestorePublicProgressUrl);
						}
						this.pollRestoreProgress();
					} else {
						var errorData = response && response.data ? response.data : {};
						this.restoreFailed(errorData.message, errorData.code);
					}
				}.bind(this),
				error: function(xhr, status, error) {
					this.restoreFailed(error);
				}.bind(this)
			});
		},

		/**
		 * Poll restore progress
		 * 
		 * Polls immediately on first call, then continues polling.
		 * Uses faster polling (500ms) during database step to capture rapid table progress.
		 * Uses localStorage for faster UI updates between AJAX polls.
		 * 
		 * Proactively switches to noauth endpoint during database step to avoid
		 * session invalidation issues when wp_options is restored.
		 */
		pollRestoreProgress: function() {
			if (!this.currentRestoreId) {
				return;
			}

			var self = this;
			// Reset per-restore trackers (prevents percent jitter between chunked requests).
			if (this._restorePercentTrackerId !== this.currentRestoreId) {
				this._restorePercentTrackerId = this.currentRestoreId;
				this.maxRestorePercent = 0;
				this.lastRestoreProgress = 0;
			}
			var consecutiveErrors = 0;
			var useNoAuth = false;
			var inDatabaseStep = false;     // Track if we're in the database step
			var useStatic = false;          // Poll static JSON when admin-ajax is unavailable
			var lastSeenUpdate = null;      // Track the last_update timestamp from server
			var lastSeenUpdateTime = null;  // Track when we first saw this timestamp (JS time)
			var staleThresholdMs = 30000;   // 30 seconds - if no state update for this long, assume completed
			var currentPollInterval = 1000; // Start with 1 second, reduce during database step
			var staticUrl = self.currentRestorePublicProgressUrl || self.getRestorePublicProgressUrl(self.currentRestoreId);
			var runnerStaleThresholdMs = 60000; // 60s with no last_update change => treat as stale runner.
			var directThrottleMs = 30000; // 30s between direct runner pings.

			var looksLikeTablesUnavailable = function(text) {
				if (!text) {
					return false;
				}
				return String(text).indexOf('One or more database tables are unavailable') !== -1;
			};

			/**
			 * Detect whether the restore DB runner is active for this restore.
			 *
			 * - Auth/noauth state can include db_runner_active.
			 * - Static JSON from runner includes db_runner=1.
			 */
			var isRestoreDbRunnerActive = function(state) {
				if (!state || typeof state !== 'object') {
					return false;
				}
				if (state.db_runner_active === true || state.db_runner_active === 1 || state.db_runner_active === '1') {
					return true;
				}
				if (state.db_runner === 1 || state.db_runner === '1') {
					return true;
				}
				return false;
			};

			/**
			 * Prefer polling the static public progress JSON when the DB runner is active.
			 *
			 * This avoids firing admin-ajax.php requests during the database step once the
			 * restore DB runner is handling the import.
			 */
			var maybePreferStaticForDbRunner = function(state) {
				if (!state || typeof state !== 'object') {
					return;
				}
				if (String(state.current_step || '') !== 'database') {
					return;
				}
				// Capture runner URL/token when available (only in auth/noauth payloads).
				if (state.db_runner_url && state.db_runner_token) {
					self._restoreDbRunnerUrl = String(state.db_runner_url);
					self._restoreDbRunnerToken = String(state.db_runner_token);
				}
				// Capture/refresh public progress URL when available.
				if (state.public_progress_url && !staticUrl) {
					staticUrl = String(state.public_progress_url);
				}
				if (isRestoreDbRunnerActive(state) && staticUrl) {
					useStatic = true;
					self.currentRestorePublicProgressUrl = staticUrl;
					if (self.currentRestoreId) {
						self.saveRestorePublicProgressUrl(self.currentRestoreId, staticUrl);
					}
				}
			};

			/**
			 * Best-effort keepalive for the Restore DB runner (direct ping only).
			 *
			 * This mitigates hosts where the runner's self-spawn loopback fails. We only ping when:
			 * - we're in the database step
			 * - the runner appears active
			 * - last_update has stopped changing for >= runnerStaleThresholdMs
			 * - we have previously captured runner URL + token from auth/noauth state
			 *
			 * @param {Object} state Restore state object (may be static or full).
			 * @param {string} pollMode One of: 'auth', 'noauth', 'static'.
			 */
			var maybeKeepaliveRestoreDbRunner = function(state, pollMode) {
				if (!state || typeof state !== 'object') {
					return;
				}
				if (!self.currentRestoreId) {
					return;
				}
				if (String(state.current_step || '') !== 'database') {
					return;
				}
				if (!isRestoreDbRunnerActive(state)) {
					return;
				}

				var lastUpdate = (typeof state.last_update !== 'undefined') ? parseInt(state.last_update, 10) : 0;
				if (!lastUpdate || isNaN(lastUpdate)) {
					return;
				}

				// Capture runner URL/token when available (auth/noauth payloads only).
				if (state.db_runner_url && state.db_runner_token) {
					self._restoreDbRunnerUrl = String(state.db_runner_url);
					self._restoreDbRunnerToken = String(state.db_runner_token);
				}

				// Update stale-tracking markers.
				var nowMs = Date.now ? Date.now() : (new Date()).getTime();
				if (!self._restoreDbRunnerLastUpdate || self._restoreDbRunnerLastUpdate !== lastUpdate) {
					self._restoreDbRunnerLastUpdate = lastUpdate;
					self._restoreDbRunnerLastUpdateSeenAt = nowMs;
					return;
				}

				// Same last_update observed; consider keepalive if stale threshold exceeded.
				var lastSeenAt = parseInt(self._restoreDbRunnerLastUpdateSeenAt, 10) || 0;
				if (!lastSeenAt) {
					self._restoreDbRunnerLastUpdateSeenAt = nowMs;
					return;
				}
				var ageMs = nowMs - lastSeenAt;
				if (ageMs < runnerStaleThresholdMs) {
					return;
				}

				// Direct runner ping (throttled).
				var runnerUrl = self._restoreDbRunnerUrl ? String(self._restoreDbRunnerUrl) : '';
				var runnerToken = self._restoreDbRunnerToken ? String(self._restoreDbRunnerToken) : '';
				if (!runnerUrl || !runnerToken) {
					return;
				}

				var lastDirectAt = parseInt(self._restoreDbRunnerLastDirectAttemptAt, 10) || 0;
				if ((nowMs - lastDirectAt) < directThrottleMs) {
					return;
				}
				self._restoreDbRunnerLastDirectAttemptAt = nowMs;

				var sep = (runnerUrl.indexOf('?') === -1) ? '?' : '&';
				var url = runnerUrl + sep
					+ 'asenha_action=restore_db'
					+ '&restore_id=' + encodeURIComponent(self.currentRestoreId)
					+ '&token=' + encodeURIComponent(runnerToken)
					+ '&t=' + encodeURIComponent(String(Date.now()));

				if (window.console && window.console.warn) {
					window.console.warn('ASE: Restore DB runner heartbeat appears stale (>60s). Pinging runner.', {
						restore_id: String(self.currentRestoreId),
						poll_mode: String(pollMode || ''),
						last_update: lastUpdate
					});
				}

				$.ajax({
					url: url,
					type: 'GET',
					cache: false,
					timeout: 5000
				});
			};

			var doPollStatic = function() {
				if (!self.currentRestoreId || !staticUrl) {
					return;
				}
				var url = staticUrl;
				url += (url.indexOf('?') === -1 ? '?' : '&') + 't=' + Date.now();

				$.ajax({
					url: url,
					type: 'GET',
					dataType: 'json',
					cache: false,
					success: function(state) {
						if (state && typeof state === 'object') {
							handleStateResponse(state, 'static');
							return;
						}
						consecutiveErrors++;
						updateFromStorage();
					},
					error: function(xhr) {
						consecutiveErrors++;
						// If the static file is blocked/404, keep trying the existing mechanism.
						updateFromStorage();
						if (xhr && xhr.responseText && looksLikeTablesUnavailable(xhr.responseText)) {
							// Stay in static mode; admin-ajax is likely unavailable.
							useStatic = true;
						}
					}
				});
			};

			/**
			 * Update UI from stored progress data
			 */
			var updateFromStorage = function() {
				var stored = self.getProgress(self.currentRestoreId);
				if (stored) {
					var $progress = $('.asenha-restore-progress');
					self.updateRestoreProgress($progress, stored);
				}
			};

			/**
			 * Handle successful state response
			 */
			var handleStateResponse = function(state, pollMode) {
				var $progress = $('.asenha-restore-progress');
				var currentStep = state.current_step || 'preparing';
				var progressValue = state.progress || 0;

				// Reset error counter on success
				consecutiveErrors = 0;

				// Keep the standalone DB runner alive during the database step (best-effort).
				maybeKeepaliveRestoreDbRunner(state, pollMode);

				// Proactively switch to noauth when entering database step
				// This prevents session invalidation issues when wp_options is restored
				if (currentStep === 'database' && !inDatabaseStep) {
					inDatabaseStep = true;
					useNoAuth = true;
					// Switch to faster polling during database step (500ms)
					if (self.progressInterval) {
						clearInterval(self.progressInterval);
						self.progressInterval = setInterval(doPoll, 500);
						currentPollInterval = 500;
					}
				}

				// Switch back to normal polling after database step
				if (inDatabaseStep && currentStep !== 'database') {
					inDatabaseStep = false;
					// Restore normal polling interval
					if (self.progressInterval && currentPollInterval !== 1000) {
						clearInterval(self.progressInterval);
						self.progressInterval = setInterval(doPoll, 1000);
						currentPollInterval = 1000;
					}
				}

				// Save to localStorage for faster subsequent updates
				self.saveProgress(self.currentRestoreId, state);

				// Track last seen overall progress for error handling and smoothing.
				self.lastRestoreProgress = progressValue;
				if (!self.maxRestorePercent || progressValue > self.maxRestorePercent) {
					self.maxRestorePercent = progressValue;
				}

				if (state.completed_stats && typeof state.completed_stats === 'object') {
					$.each(state.completed_stats, function(stepKey, stats) {
						if (!stats || typeof stats !== 'object') {
							return;
						}
						if (stepKey === 'retrieving') {
							self.restoreCompletedStats[stepKey] = self.normalizeRestoreRetrievingStats(stats);
						} else {
							self.restoreCompletedStats[stepKey] = $.extend({}, self.restoreCompletedStats[stepKey] || {}, stats);
						}
					});
				}

				// Store completion stats when a step completes with 'done' label
				if (state.sub_progress && state.sub_progress.label === 'done') {
					self.restoreCompletedStats[currentStep] = (currentStep === 'retrieving')
						? self.normalizeRestoreRetrievingStats($.extend({}, state.sub_progress, self.restoreCompletedStats[currentStep] || {}))
						: state.sub_progress;
					// Also update tracked values from the 'done' state for fallback
					if (currentStep === 'database') {
						if (state.sub_progress.tables_restored > 0) {
							// Store tables for fallback (use total from lastRestoreSubProgress if available)
						}
						if (state.sub_progress.rows_restored > 0) {
							self.lastRestoreRowsTotal = state.sub_progress.rows_restored;
						}
					}
				}

				// Track extraction total size for fallback
				if (currentStep === 'extracting' && state.sub_progress && state.sub_progress.total_size > 0) {
					self.lastRestoreExtractionSize = state.sub_progress.total_size;
				}

				// Track rows imported during database step for fallback
				if (currentStep === 'database' && state.sub_progress && state.sub_progress.rows_imported > 0) {
					self.lastRestoreRowsTotal = state.sub_progress.rows_imported;
				}

				// Track total tables during database step for fallback.
				if (currentStep === 'database' && state.sub_progress) {
					if (state.sub_progress.total > 0) {
						self.lastRestoreTablesTotal = state.sub_progress.total;
					} else if (state.sub_progress.tables_restored > 0) {
						self.lastRestoreTablesTotal = state.sub_progress.tables_restored;
					}
				}

				// Capture pre-analyzed database stats (more reliable than tracking during import)
				if (state.database_stats && state.database_stats.total_rows > 0) {
					self.lastRestoreRowsTotal = state.database_stats.total_rows;
				}
				if (state.database_stats && state.database_stats.total_tables > 0) {
					self.lastRestoreTablesTotal = state.database_stats.total_tables;
				}

				// Detect step transition - if step changed, store stats for the previous step
				// This catches cases where the 'done' label state was missed between polls
				if (self.previousRestoreStep && self.previousRestoreStep !== currentStep) {
					// Step changed from retrieving - store the last known download/assemble summary.
					if (self.previousRestoreStep === 'retrieving' && !self.restoreCompletedStats['retrieving']) {
						self.ensureRestoreRetrievingCompletedStats();
					}

				// Step changed from extracting - check if we have stats stored
				if (self.previousRestoreStep === 'extracting' && !self.restoreCompletedStats['extracting']) {
					// We missed the 'done' state, use last known sub_progress or extraction size
					if (self.lastRestoreSubProgress && self.lastRestoreSubProgress.done_summary) {
						self.restoreCompletedStats['extracting'] = {
							label: 'done',
							done_summary: self.lastRestoreSubProgress.done_summary
						};
					} else if (self.lastRestoreExtractionSize > 0) {
						self.restoreCompletedStats['extracting'] = {
							label: 'done',
							total_size: self.lastRestoreExtractionSize
						};
					}
				}
					// Step changed from files - check if we have stats stored
					if (self.previousRestoreStep === 'files' && !self.restoreCompletedStats['files']) {
						// We missed the 'done' state, check if we have last known sub_progress
						// Use total (manifest file_count) for consistent display
						if (self.lastRestoreSubProgress && self.lastRestoreSubProgress.total > 0) {
							self.restoreCompletedStats['files'] = {
								label: 'done',
								files_restored: self.lastRestoreSubProgress.total
							};
						}
					}
					// Step changed from database - check if we have stats stored
					if (self.previousRestoreStep === 'database' && !self.restoreCompletedStats['database']) {
						// We missed the 'done' state, check if we have last known sub_progress
						if (self.lastRestoreSubProgress && self.lastRestoreSubProgress.total > 0) {
							self.restoreCompletedStats['database'] = {
								label: 'done',
								tables_restored: self.lastRestoreSubProgress.total,
								rows_restored: self.lastRestoreRowsTotal
							};
						}
					}
				}

				// Track the current sub_progress for this step
				if (state.sub_progress && state.sub_progress.current > 0) {
					self.lastRestoreSubProgress = state.sub_progress;
				}
				if (currentStep === 'retrieving' && state.sub_progress && (state.sub_progress.current > 0 || state.sub_progress.total > 0 || state.sub_progress.label === 'done')) {
					self.lastRestoreRetrievingSubProgress = state.sub_progress;
				}

				// Update previous step tracker
				self.previousRestoreStep = currentStep;

				// Stale state detection - if state hasn't changed for too long, handle appropriately
				// This handles cases where the PHP script timed out or state updates stopped
				if (state.last_update) {
					if (lastSeenUpdate !== state.last_update) {
						// New update received, reset tracking
						lastSeenUpdate = state.last_update;
						lastSeenUpdateTime = Date.now();
						// Reset stale warning flags on fresh updates
						self.restoreFilesStaleWarned = false;
						self.restoreRetrieveStaleWarned = false;
					} else if (lastSeenUpdateTime) {
						// Same update, check if it's been too long
						var elapsedMs = Date.now() - lastSeenUpdateTime;
						
						// For cleanup step, use shorter timeout (30s)
						if (currentStep === 'cleanup' && elapsedMs >= staleThresholdMs) {
							self.restoreCompletedWithReload();
							return;
						}
						
						// For database/verifying steps, use longer timeout (60s)
						// These steps can take a while, especially with large databases
						if ((currentStep === 'database' || currentStep === 'verifying') && elapsedMs >= 60000) {
							// Check if we've made significant progress (indicates restore is working but slow)
							if (state.sub_progress && state.sub_progress.current >= state.sub_progress.total) {
								// All tables processed but stuck - likely completed
								self.restoreCompletedWithReload();
								return;
							}
							// If not complete, log but don't give up - restore might still be running
							console.log('ASE Backup: Database step stale for 60s, continuing to poll');
						}

						// For retrieving step, keep the restore moving if the async loopback chain stalls.
						if (currentStep === 'retrieving' && elapsedMs >= 60000) {
							if (!self.lastRestoreContinueAt) {
								self.lastRestoreContinueAt = 0;
							}
							if (Date.now() - self.lastRestoreContinueAt >= 10000) {
								self.lastRestoreContinueAt = Date.now();
								$.ajax({
									url: asenhaSiteBackup.ajaxUrl,
									type: 'POST',
									data: {
										action: 'asenha_continue_restore_noauth',
										restore_id: self.currentRestoreId
									}
								});
							}

							if (!self.restoreRetrieveStaleWarned) {
								self.restoreRetrieveStaleWarned = true;
								console.log('ASE Backup: Retrieving step stale for 60s, kicking restore worker');
							}
						}
						
						// For files step, do NOT assume completion.
						// A stall during files restore often means the worker died or is stuck.
						// Keep polling and show a warning, then fail after a longer threshold.
						if (currentStep === 'files' && elapsedMs >= 90000) {
							// If loopback continuation is unreliable, actively "kick" the restore forward.
							// This calls a noauth endpoint that runs the next chunk in the current request.
							// Throttle to avoid hammering the server.
							if (!self.lastRestoreContinueAt) {
								self.lastRestoreContinueAt = 0;
							}
							if (Date.now() - self.lastRestoreContinueAt >= 5000) {
								self.lastRestoreContinueAt = Date.now();
								$.ajax({
									url: asenhaSiteBackup.ajaxUrl,
									type: 'POST',
									data: {
										action: 'asenha_continue_restore_noauth',
										restore_id: self.currentRestoreId
									}
								});
							}

							if (!self.restoreFilesStaleWarned) {
								self.restoreFilesStaleWarned = true;
								console.log('ASE Backup: Files step stale for 90s, continuing to poll');
								if (typeof self.showNotice === 'function') {
									self.showNotice(
										'warning',
										asenhaSbT('restoreFilesTakingLonger')
									);
								}
							}

							// Hard stop after 15 minutes with no updates in files step
							if (elapsedMs >= (15 * 60 * 1000)) {
								self.restoreFailed(
									asenhaSbT('restoreFilesStuck')
								);
								return;
							}
						}
					}
				}

				self.updateRestoreProgress($progress, state);

				if (state.status === 'completed') {
					self.restoreCompleted(state);
				} else if (state.status === 'failed') {
					self.restoreFailed(state.error || state.message, state.error_code || state.code);
				}
			};

			/**
			 * Poll using noauth endpoint (file-based state)
			 * Used when normal authenticated endpoint fails after DB restore
			 */
			var doPollNoAuth = function() {
				if (!self.currentRestoreId) {
					return;
				}

				// If the DB runner is active, avoid admin-ajax and poll static JSON.
				if (!useStatic) {
					var storedState = self.getProgress(self.currentRestoreId);
					maybePreferStaticForDbRunner(storedState || {});
				}
				if (useStatic) {
					doPollStatic();
					return;
				}

				$.ajax({
					url: asenhaSiteBackup.ajaxUrl,
					type: 'POST',
					data: {
						action: 'asenha_get_restore_progress_noauth',
						restore_id: self.currentRestoreId
					},
					success: function(response) {
						// Some hosts return an HTML error page with status 200 during DB restore.
						if (typeof response === 'string' && looksLikeTablesUnavailable(response)) {
							useStatic = true;
							doPollStatic();
							return;
						}
						if (response.success) {
							// If the DB runner is active, switch to static polling immediately.
							maybePreferStaticForDbRunner(response.data || {});
							handleStateResponse(response.data, 'noauth');
						} else {
							// If we got a database tables unavailable error, switch to static file polling.
							if (response && response.data && response.data.message && looksLikeTablesUnavailable(response.data.message) && staticUrl) {
								useStatic = true;
								doPollStatic();
								return;
							}
							consecutiveErrors++;
							// Try to update from localStorage on error
							updateFromStorage();
							// If we can't read state, don't assume completion during early steps
							// (especially 'files', which frequently indicates a real failure when stuck).
							if (consecutiveErrors >= 30) {
								// Do NOT assume completion just because we're in a late step like 'database'.
								// During DB restore, WordPress can temporarily error while tables are being replaced.
								// Only assume completion if we were actually near the end.
								var likelyCompleted =
									(self.lastRestoreProgress && self.lastRestoreProgress >= 95) ||
									(self.previousRestoreStep === 'cleanup' || self.previousRestoreStep === 'completed');

								if (likelyCompleted) {
									console.log('ASE Backup: 30 consecutive errors and we were in late steps, assuming completion');
									self.restoreCompletedWithReload();
									return;
								}

								// Warn once, keep polling longer.
								if (!self.restoreNoAuthErrorWarned) {
									self.restoreNoAuthErrorWarned = true;
									console.log('ASE Backup: 30 consecutive errors while restore is in early steps, continuing to poll');
									if (typeof self.showNotice === 'function') {
										self.showNotice(
											'warning',
											'Unable to read restore progress right now. The restore may still be running. If this persists, check your server error log.'
										);
									}
								}

								// During database restore, allow a much longer error window because the DB can be
								// temporarily unavailable while tables are dropped/created.
								var failThreshold = (self.previousRestoreStep === 'database' || self.previousRestoreStep === 'verifying') ? 1200 : 180;
								if (consecutiveErrors >= failThreshold) {
									self.restoreFailed(
										'Restore progress could not be read for several minutes. The restore may have stopped. Please check your server error log and try again.'
									);
									return;
								}
							}
						}
					},
					error: function(xhr) {
						consecutiveErrors++;
						// Try to update from localStorage on error
						updateFromStorage();
						// If WordPress can't access core tables, admin-ajax will fail. Switch to static polling.
						if (staticUrl && xhr && looksLikeTablesUnavailable(xhr.responseText)) {
							useStatic = true;
							doPollStatic();
							return;
						}
						// Use the same late-step vs early-step handling as above.
						if (consecutiveErrors >= 30) {
							var likelyCompleted =
								(self.lastRestoreProgress && self.lastRestoreProgress >= 95) ||
								(self.previousRestoreStep === 'cleanup' || self.previousRestoreStep === 'completed');

							if (likelyCompleted) {
								console.log('ASE Backup: 30 consecutive AJAX errors and we were in late steps, assuming completion');
								self.restoreCompletedWithReload();
								return;
							}

							if (!self.restoreNoAuthErrorWarned) {
								self.restoreNoAuthErrorWarned = true;
								console.log('ASE Backup: 30 consecutive AJAX errors while restore is in early steps, continuing to poll');
								if (typeof self.showNotice === 'function') {
									self.showNotice(
										'warning',
										'Unable to read restore progress right now. The restore may still be running. If this persists, check your server error log.'
									);
								}
							}

							if (consecutiveErrors >= 180) {
								var failThreshold = (self.previousRestoreStep === 'database' || self.previousRestoreStep === 'verifying') ? 1200 : 180;
								if (consecutiveErrors < failThreshold) {
									return;
								}
								self.restoreFailed(
									'Restore progress could not be read for several minutes. The restore may have stopped. Please check your server error log and try again.'
								);
								return;
							}
						}
					}
				});
			};

			/**
			 * Single poll request (authenticated)
			 */
			var doPoll = function() {
				if (!self.currentRestoreId) {
					return;
				}

				// If the DB runner is active, avoid admin-ajax and poll static JSON.
				if (!useStatic) {
					var storedState = self.getProgress(self.currentRestoreId);
					maybePreferStaticForDbRunner(storedState || {});
				}
				if (useStatic) {
					doPollStatic();
					return;
				}

				// If we've switched to noauth mode, use that endpoint
				if (useNoAuth) {
					doPollNoAuth();
					return;
				}

				$.ajax({
					url: asenhaSiteBackup.ajaxUrl,
					type: 'POST',
					data: {
						action: 'asenha_get_restore_progress',
						nonce: asenhaSiteBackup.nonce,
						restore_id: self.currentRestoreId
					},
					success: function(response) {
						if (response.success) {
							// If the DB runner is active, switch to static polling immediately.
							maybePreferStaticForDbRunner(response.data || {});
							handleStateResponse(response.data, 'auth');
						} else {
							// Some hosts return a DB-tables-unavailable error before auth is invalidated.
							if (staticUrl && response && response.data && response.data.message && looksLikeTablesUnavailable(response.data.message)) {
								useStatic = true;
								doPollStatic();
								return;
							}
							// Auth or permission error - switch to noauth endpoint immediately
							// Don't wait for multiple errors as database restore can invalidate session quickly
							consecutiveErrors++;
							useNoAuth = true;
							doPollNoAuth();
						}
					},
					error: function(xhr) {
						consecutiveErrors++;

						// If WordPress can't access core tables, admin-ajax will fail (even noauth).
						// Switch to static polling when available.
						if (staticUrl && xhr && looksLikeTablesUnavailable(xhr.responseText)) {
							useStatic = true;
							doPollStatic();
							return;
						}

						// On error (likely auth failure after DB restore), switch to noauth immediately
						useNoAuth = true;
						doPollNoAuth();
					}
				});
			};

			// Poll immediately on first call
			doPoll();

			// Then set up interval for subsequent polls (1 second interval for responsive updates)
			this.progressInterval = setInterval(doPoll, 1000);
		},

		/**
		 * Normalize completed restore retrieving stats.
		 *
		 * @param {Object} stats Retrieval stats.
		 * @return {Object}
		 */
		normalizeRestoreRetrievingStats: function(stats) {
			stats = $.extend({}, stats || {});
			var label = String(stats.label || '');
			var total = parseInt(stats.total || 0, 10) || 0;

			if (label === 'done' && total > 0) {
				stats.current = total;
			}

			return stats;
		},

		/**
		 * Ensure completed retrieving stats exist before rendering a completed checkpoint.
		 *
		 * @return {Object}
		 */
		ensureRestoreRetrievingCompletedStats: function() {
			if (this.restoreCompletedStats['retrieving']) {
				this.restoreCompletedStats['retrieving'] = this.normalizeRestoreRetrievingStats(this.restoreCompletedStats['retrieving']);
				return this.restoreCompletedStats['retrieving'];
			}

			var source = null;
			if (this.lastRestoreRetrievingSubProgress) {
				source = this.lastRestoreRetrievingSubProgress;
			} else if (this.lastRestoreSubProgress && this.lastRestoreSubProgress.location_label) {
				source = this.lastRestoreSubProgress;
			}

			if (source && (parseInt(source.total || 0, 10) || 0) > 0) {
				this.restoreCompletedStats['retrieving'] = this.normalizeRestoreRetrievingStats($.extend({ label: 'done' }, source));
			} else {
				this.restoreCompletedStats['retrieving'] = {
					label: 'done',
					done_summary: asenhaSbP('done')
				};
			}

			return this.restoreCompletedStats['retrieving'];
		},

		/**
		 * Restore completed
		 * 
		 * Updates UI to show completion and reloads the page after a delay.
		 * The page reload is necessary because:
		 * 1. The database has been restored, so WordPress data has changed
		 * 2. Session tokens may be invalid, requiring re-authentication
		 * 3. WordPress will redirect to login if the current user doesn't exist in restored DB
		 */
		restoreCompleted: function(finalState) {
			// Prevent duplicate completion handling from race conditions
			if (this.restoreCompletionHandled) {
				return;
			}
			this.restoreCompletionHandled = true;

			clearInterval(this.progressInterval);
			clearInterval(this.timeInterval);

			var self = this;
			var $progress = $('.asenha-restore-progress');

			// Prevent the WordPress interim login modal (WP Heartbeat auth-check) from appearing.
			this.suspendHeartbeat();

			// Read the latest known state BEFORE clearing storage so we can finalize summaries.
			var restoreId = this.currentRestoreId;
			var storedState = restoreId ? this.getProgress(restoreId) : null;
			var state = finalState || storedState || {};

			// Capture final DB totals from the best available sources.
			var finalTables = 0;
			var finalRows = 0;
			if (state && state.sub_progress) {
				finalTables = state.sub_progress.tables_restored || 0;
				finalRows = state.sub_progress.rows_restored || 0;
			}
			if (state && state.database_stats) {
				if (state.database_stats.total_tables) {
					finalTables = finalTables || state.database_stats.total_tables;
				}
				if (state.database_stats.total_rows) {
					finalRows = finalRows || state.database_stats.total_rows;
				}
			}
			if (finalTables > 0) {
				this.lastRestoreTablesTotal = finalTables;
			}
			if (finalRows > 0) {
				this.lastRestoreRowsTotal = finalRows;
			}

			// Clear localStorage once we've harvested completion info.
			if (restoreId) {
				this.clearProgress(restoreId);
				this.clearRestorePublicProgressUrl(restoreId);
			}
			this.currentRestoreId = null;
			this.currentRestorePublicProgressUrl = null;
			this.clearRestoreTriggerState();

			// Store any missing stats from tracked values before updating UI
			if (!this.restoreCompletedStats['extracting'] && this.lastRestoreExtractionSize > 0) {
				this.restoreCompletedStats['extracting'] = { total_size: this.lastRestoreExtractionSize };
			}
			this.ensureRestoreRetrievingCompletedStats();
			// Use total (manifest file_count) for consistent display
			if (!this.restoreCompletedStats['files'] && this.lastRestoreSubProgress && this.lastRestoreSubProgress.total > 0) {
				this.restoreCompletedStats['files'] = { files_restored: this.lastRestoreSubProgress.total };
			}
			if (!this.restoreCompletedStats['database'] && this.lastRestoreTablesTotal > 0) {
				this.restoreCompletedStats['database'] = { tables_restored: this.lastRestoreTablesTotal, rows_restored: this.lastRestoreRowsTotal };
			}
			
			// Mark all checkpoints as completed and set summaries
			$progress.find('.asenha-checkpoint').each(function() {
				var $checkpoint = $(this);
				var step = $checkpoint.data('step');
				var $subLabel = $checkpoint.find('.asenha-checkpoint-sub');
				
				$checkpoint.removeClass('pending in-progress').addClass('completed');
				
				// Get stats from formatRestoreCompletedStats (operation complete, so isOperationComplete=true)
				var statsText = self.formatRestoreCompletedStats(step, true);
				if (statsText) {
					$subLabel.text(statsText);
				} else {
					// Ensure we don't leave stale "Processing" text at completion.
					// For the database step, at least show a generic completion label.
					if (step === 'retrieving' || step === 'database') {
						$subLabel.text(asenhaSbP('done'));
					}
				}
			});
			
			// Update circular progress
			$progress.find('.asenha-circle-progress').attr('stroke-dasharray', '100, 100').addClass('completed');
			$progress.find('.asenha-progress-percent').text('100%');

			// Final time update
			this.updateTimeDisplay($progress);
			$progress.find('.asenha-time-remaining').hide();

			$('#asenha-start-restore').prop('disabled', false);

			// Show completion UI with Reload Now button
			this.showCompletionUI($progress, 'restore');

			// Best-effort: request immediate cleanup now that the UI has a final state.
			// This complements the scheduled cleanup + plugins_loaded GC fallback.
			this.triggerRestoreCleanupNoAuth(restoreId);
		},

		/**
		 * Best-effort: trigger restore cleanup without auth.
		 *
		 * After a database restore, the current session may be invalid. We use a noauth endpoint
		 * secured by the restore_id (UUID) which acts as an unguessable token.
		 *
		 * @param {string} restoreId Restore UUID.
		 */
		triggerRestoreCleanupNoAuth: function(restoreId) {
			restoreId = restoreId || '';
			if (!restoreId) {
				return;
			}

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_cleanup_restore_artifacts_noauth',
					restore_id: restoreId
				},
				timeout: 10000
			});
		},

		/**
		 * Best-effort: trigger migration cleanup without auth.
		 *
		 * After a database import, the current session may be invalid. We reuse the restore cleanup
		 * noauth endpoint secured by the operation UUID (migration_id/restore_id) which acts as an
		 * unguessable token, and the endpoint only allows cleanup for final states.
		 *
		 * @param {string} migrationId Migration UUID.
		 */
		triggerMigrationCleanupNoAuth: function(migrationId) {
			migrationId = migrationId || '';
			if (!migrationId) {
				return;
			}

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_cleanup_restore_artifacts_noauth',
					restore_id: migrationId
				},
				timeout: 10000
			});
		},

		/**
		 * Best-effort: trigger transfer cleanup without auth.
		 *
		 * After a database import, the current session may be invalid. The transfer completion
		 * happens after "Finalizing", so it is safe to request cleanup once the UI has confirmed
		 * completion. Security is provided by the transfer_id (UUID) which acts as an unguessable token.
		 *
		 * @param {string} transferId Transfer UUID.
		 */
		triggerTransferCleanupNoAuth: function(transferId) {
			transferId = transferId || '';
			if (!transferId) {
				return;
			}

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_cleanup_transfer_artifacts_noauth',
					transfer_id: transferId
				},
				timeout: 10000
			});
		},

		/**
		 * Restore completed with immediate reload
		 * 
		 * Called when we detect restore completed but couldn't get final state.
		 * This typically happens when the state file was already cleaned up.
		 */
		restoreCompletedWithReload: function() {
			// Prevent duplicate completion handling from race conditions
			if (this.restoreCompletionHandled) {
				return;
			}
			this.restoreCompletionHandled = true;

			clearInterval(this.progressInterval);
			clearInterval(this.timeInterval);

			var self = this;
			var $progress = $('.asenha-restore-progress');

			// Prevent the WordPress interim login modal (WP Heartbeat auth-check) from appearing.
			this.suspendHeartbeat();

			// Read the latest known state BEFORE clearing storage so we can finalize summaries.
			var restoreId = this.currentRestoreId;
			var storedState = restoreId ? this.getProgress(restoreId) : null;
			var state = storedState || {};

			// Capture final DB totals from the best available sources.
			var finalTables = 0;
			var finalRows = 0;
			if (state && state.sub_progress) {
				finalTables = state.sub_progress.tables_restored || 0;
				finalRows = state.sub_progress.rows_restored || 0;
			}
			if (state && state.database_stats) {
				if (state.database_stats.total_tables) {
					finalTables = finalTables || state.database_stats.total_tables;
				}
				if (state.database_stats.total_rows) {
					finalRows = finalRows || state.database_stats.total_rows;
				}
			}
			if (finalTables > 0) {
				this.lastRestoreTablesTotal = finalTables;
			}
			if (finalRows > 0) {
				this.lastRestoreRowsTotal = finalRows;
			}

			// Clear localStorage once we've harvested completion info.
			if (restoreId) {
				this.clearProgress(restoreId);
				this.clearRestorePublicProgressUrl(restoreId);
			}
			this.currentRestoreId = null;
			this.currentRestorePublicProgressUrl = null;
			this.clearRestoreTriggerState();

			// Store any missing stats from tracked values before updating UI
			if (!this.restoreCompletedStats['extracting'] && this.lastRestoreExtractionSize > 0) {
				this.restoreCompletedStats['extracting'] = { total_size: this.lastRestoreExtractionSize };
			}
			this.ensureRestoreRetrievingCompletedStats();
			// Use total (manifest file_count) for consistent display
			if (!this.restoreCompletedStats['files'] && this.lastRestoreSubProgress && this.lastRestoreSubProgress.total > 0) {
				this.restoreCompletedStats['files'] = { files_restored: this.lastRestoreSubProgress.total };
			}
			if (!this.restoreCompletedStats['database'] && this.lastRestoreTablesTotal > 0) {
				this.restoreCompletedStats['database'] = { tables_restored: this.lastRestoreTablesTotal, rows_restored: this.lastRestoreRowsTotal };
			}
			
			// Mark all checkpoints as completed and set summaries
			$progress.find('.asenha-checkpoint').each(function() {
				var $checkpoint = $(this);
				var step = $checkpoint.data('step');
				var $subLabel = $checkpoint.find('.asenha-checkpoint-sub');
				
				$checkpoint.removeClass('pending in-progress').addClass('completed');
				
				// Get stats from formatRestoreCompletedStats (operation complete, so isOperationComplete=true)
				var statsText = self.formatRestoreCompletedStats(step, true);
				if (statsText) {
					$subLabel.text(statsText);
				} else {
					// Ensure we don't leave stale "Processing" text at completion.
					if (step === 'retrieving' || step === 'database') {
						$subLabel.text(asenhaSbP('done'));
					}
				}
			});
			
			// Update circular progress to 100%
			$progress.find('.asenha-circle-progress').attr('stroke-dasharray', '100, 100').addClass('completed');
			$progress.find('.asenha-progress-percent').text('100%');
			
			// Hide remaining time section
			$progress.find('.asenha-time-remaining').hide();

			$('#asenha-start-restore').prop('disabled', false);

			// Show completion UI with Reload Now button
			this.showCompletionUI($progress, 'restore');
		},

		/**
		 * Restore failed
		 *
		 * @param {string} message
		 * @param {string} errorCode
		 */
		restoreFailed: function(message, errorCode) {
			clearInterval(this.progressInterval);
			clearInterval(this.timeInterval);
			
			// Clear localStorage
			if (this.currentRestoreId) {
				this.clearProgress(this.currentRestoreId);
				this.clearRestorePublicProgressUrl(this.currentRestoreId);
			}
			this.currentRestoreId = null;
			this.currentRestorePublicProgressUrl = null;

			var $progress = $('.asenha-restore-progress');
			var $restoreButton = this.currentRestoreButton;
			var canRetryPassphrase = this.isRestorePassphraseRetryableFailure(message, errorCode);
			
			// Mark current step as failed
			$progress.find('.asenha-checkpoint.in-progress').removeClass('in-progress').addClass('failed');
			
			// Update circular progress
			$progress.find('.asenha-circle-progress').addClass('failed');

			$('#asenha-start-restore').prop('disabled', false);

			if ($restoreButton && $restoreButton.length) {
				$restoreButton.prop('disabled', false);
			}

			this.showNotice('error', message);

			if (canRetryPassphrase && $restoreButton && $restoreButton.length) {
				this.openRestorePopover($restoreButton);
				this.showRestorePassphraseField($restoreButton, 'retry');
				this.getRestorePassphraseField().find('#asenha-restore-archive-passphrase').val('').trigger('focus');
				this.scrollRestoreRowIntoView($restoreButton);
			} else {
				this.clearRestoreTriggerState();
			}
		},

		/**
		 * Format completion stats for completed backup steps (client-side fallback)
		 *
		 * @param {string} step Step name.
		 * @return {string} Formatted completion stats text.
		 */
		formatBackupCompletedStats: function(step, isOperationComplete) {
			if (!asenhaSiteBackup.subProgress) {
				return '';
			}

			var stats = this.backupCompletedStats[step];

			switch (step) {
				case 'preparing':
					// Show 'Done' only at operation completion
					return isOperationComplete ? asenhaSbP('done') : '';

				case 'database':
					// Try stats first, then fallback to lastDatabaseStats
					var dbStats = stats || this.lastDatabaseStats;
					if (dbStats && dbStats.table_count > 0 && asenhaSiteBackup.subProgress.databaseStats) {
						return asenhaSiteBackup.subProgress.databaseStats
							.replace('%1$s', this.formatNumber(dbStats.table_count))
							.replace('%2$s', this.formatNumber(dbStats.row_count || 0))
							.replace('%3$s', this.formatBytes(dbStats.sql_file_size || dbStats.db_size || 0));
					}
					return '';

				case 'files':
					// Try stats first, then fallback to lastFilesStats
					var filesStats = stats || this.lastFilesStats;
					if (filesStats && filesStats.total_files > 0) {
						return asenhaSiteBackup.subProgress.filesFound
							.replace('%1$s', this.formatNumber(filesStats.total_files))
							.replace('%2$s', this.formatBytes(filesStats.files_size || 0));
					}
					return '';

				case 'archive':
					// Show archive size if available
					if (stats && stats.file_size_human && asenhaSiteBackup.subProgress.archiveCreated) {
						return asenhaSiteBackup.subProgress.archiveCreated.replace('%s', stats.file_size_human);
					}
					// Fallback to backup completed state file_size_human
					if (this.lastArchiveSize && asenhaSiteBackup.subProgress.archiveCreated) {
						return asenhaSiteBackup.subProgress.archiveCreated.replace('%s', this.lastArchiveSize);
					}
					return '';

				case 'cleanup':
					// Show 'Done' only at operation completion
					return isOperationComplete ? asenhaSbP('done') : '';

				default:
					return '';
			}
		},

		/**
		 * Update restore progress display
		 *
		 * Tracks the highest step index reached to prevent UI regression.
		 * If the server returns an earlier step (e.g., due to stale state after
		 * database restore changes the backup directory), we use the highest
		 * step reached instead of regressing.
		 *
		 * @param {jQuery} $progress Progress container element.
		 * @param {Object} state     State data from server.
		 */
		updateRestoreProgress: function($progress, state) {
			// Once completion UI has been handled, never let subsequent/stale polls overwrite it.
			if (this.restoreCompletionHandled) {
				return;
			}

			var percent = state.progress || 0;
			var currentStep = state.current_step || 'preparing';

			// Prevent percent regression (common during chunked restore requests).
			if (this.maxRestorePercent && percent < this.maxRestorePercent) {
				percent = this.maxRestorePercent;
			} else if (!this.maxRestorePercent || percent > this.maxRestorePercent) {
				this.maxRestorePercent = percent;
			}
			var now = Date.now();
			if (this._restoreUiTrackerId !== this._restorePercentTrackerId) {
				this._restoreUiTrackerId = this._restorePercentTrackerId;
				this.restoreDisplayedPercentFloat = percent;
				this.restoreDisplayedPercentAt = now;
			}

			// Get step order based on restore type + whether this is a remote restore.
			var opts = this.currentRestoreOptions || { components: 'all', locationId: '' };
			// If polling progress after a reload, infer remote restore from state.
			if ((!opts.locationId || opts.locationId === 'local') && state && state.source_location_id) {
				opts.locationId = String(state.source_location_id);
				if (!this.currentRestoreOptions) {
					this.currentRestoreOptions = {};
				}
				this.currentRestoreOptions.locationId = opts.locationId;
			}
			var steps = this.getRestoreStepsForOptions(opts);

			// Find current step index
			var currentIndex = steps.indexOf(currentStep);
			if (currentIndex === -1) {
				// 'completed' step means all steps are done
				// Set index past all steps so all checkpoints show as completed
				if (currentStep === 'completed') {
					currentIndex = steps.length;
				} else {
					// Unknown step - use previous highest if available
					currentIndex = Math.max(0, this.highestRestoreStepIndex);
				}
			}

			// Prevent regression: never go backward from the highest step reached
			// This handles race conditions where the server returns stale state
			// during database restore (e.g., backup_dir changed)
			if (currentIndex < this.highestRestoreStepIndex && this.highestRestoreStepIndex >= 0) {
				// Use the highest step we've seen, not the regressed one
				currentIndex = this.highestRestoreStepIndex;
				// If we had a higher step, don't regress the progress percentage either
				if (percent < 15 && this.highestRestoreStepIndex > 0) {
					// Keep the current progress display unchanged by returning early
					// The UI already shows a later step, don't update with stale data
					return;
				}
			}

			// Update highest step tracker
			if (currentIndex > this.highestRestoreStepIndex) {
				this.highestRestoreStepIndex = currentIndex;
			}

			// Update circular progress
			// Determine a \"target\" percent that we can animate towards.
			var targetPercent = percent;

			var self = this;
			var subProgress = state.sub_progress || {};

			// During database restore, use real rows-based percent when available.
			// This keeps the circle progress moving on large tables without relying on synthetic/ghost values.
			if (currentStep === 'database' && 'importing' === (subProgress.label || 'importing')) {
				var manifestTotalRows = (state.database_stats && state.database_stats.total_rows) ? parseInt(state.database_stats.total_rows, 10) : 0;
				var rowsImportedTotal = 0;
				if (typeof subProgress.rows_imported_total !== 'undefined') {
					rowsImportedTotal = parseInt(subProgress.rows_imported_total, 10) || 0;
				} else if (typeof subProgress.rows_imported !== 'undefined') {
					rowsImportedTotal = parseInt(subProgress.rows_imported, 10) || 0;
				}

				if (manifestTotalRows > 0 && rowsImportedTotal >= 0) {
					var ratio = Math.max(0, Math.min(1, rowsImportedTotal / Math.max(manifestTotalRows, 1)));
					var rowsBased = 70 + (ratio * 15);
					targetPercent = Math.max(targetPercent, rowsBased);
				}
			}

			// Animate the displayed percent towards the (possibly ghosted) targetPercent.
			// This smooths sudden jumps (e.g. 72% -> 89%) into gradual increments.
			var dtRenderSec = (now - (this.restoreDisplayedPercentAt || now)) / 1000;
			this.restoreDisplayedPercentAt = now;
			if (typeof this.restoreDisplayedPercentFloat !== 'number') {
				this.restoreDisplayedPercentFloat = targetPercent;
			}
			var maxIncreasePerSec = 2.0; // percent points per second
			if (targetPercent > this.restoreDisplayedPercentFloat) {
				var delta = Math.min(targetPercent - this.restoreDisplayedPercentFloat, dtRenderSec * maxIncreasePerSec);
				this.restoreDisplayedPercentFloat += delta;
			} else {
				this.restoreDisplayedPercentFloat = targetPercent;
			}
			var displayPercent = Math.max(percent, Math.round(this.restoreDisplayedPercentFloat));

			$progress.find('.asenha-circle-progress').attr('stroke-dasharray', displayPercent + ', 100');
			$progress.find('.asenha-progress-percent').text(displayPercent + '%');

			// Update checkpoint states
			$progress.find('.asenha-checkpoint').each(function() {
				var $checkpoint = $(this);
				var step = $checkpoint.data('step');
				var stepIndex = steps.indexOf(step);
				var $subLabel = $checkpoint.find('.asenha-checkpoint-sub');

				$checkpoint.removeClass('pending in-progress completed');

				if (stepIndex < currentIndex) {
					$checkpoint.addClass('completed');
					// Show statistics for completed steps (not final completion, so isOperationComplete=false)
					// Only update if we have stats - preserve existing text if no stats available
					if (step === 'retrieving') {
						self.ensureRestoreRetrievingCompletedStats();
					}
					var statsText = self.formatRestoreCompletedStats(step, false);
					if (statsText) {
						$subLabel.text(statsText);
					} else if (step === 'retrieving') {
						$subLabel.text(asenhaSbP('done'));
					}
				} else if (stepIndex === currentIndex) {
				$checkpoint.addClass('in-progress');
				// Show sub-progress for current step.
				// Use currentStep (PHP current_step) instead of checkpoint step name,
				// because restore uses 'preparing' as checkpoint name while PHP sends
				// 'extracting' -- formatSubProgress needs the PHP step to match the
				// correct case block with detailed sub-progress labels.
				if (subProgress.label) {
					var subText = self.formatSubProgress(currentStep, subProgress);
					$subLabel.text(subText);
				}
				// Don't clear sub-label if no subProgress - keep existing value
				} else {
					$checkpoint.addClass('pending');
					$subLabel.text('');
				}
			});
		},

		/**
		 * Format completion stats for completed restore steps
		 *
		 * @param {string} step Step name.
		 * @return {string} Formatted completion stats text.
		 */
		formatRestoreCompletedStats: function(step, isOperationComplete) {
			if (!asenhaSiteBackup.subProgress) {
				return '';
			}

			var stats = this.restoreCompletedStats[step];

			switch (step) {
				case 'retrieving':
					if (stats) {
						stats = this.normalizeRestoreRetrievingStats(stats);
						this.restoreCompletedStats[step] = stats;
					}
					if (stats && stats.done_summary) {
						return String(stats.done_summary);
					}
					if (stats) {
						var loc = stats.location_label ? String(stats.location_label) : '';
						var cur = parseInt(stats.current || 0, 10) || 0;
						var tot = parseInt(stats.total || 0, 10) || 0;
						if (stats.label === 'done' && tot > 0) {
							cur = tot;
						}
						if (loc && tot > 0) {
							var percent = Math.round((cur / Math.max(tot, 1)) * 100);
							percent = Math.max(0, Math.min(100, percent));
							return loc + ' ' + this.formatBytes(cur) + ' / ' + this.formatBytes(tot) + ' (' + percent + '%)';
						}
					}
					return asenhaSbP('done');

			case 'preparing':
				if (stats && stats.done_summary) {
					return String(stats.done_summary);
				}
				return isOperationComplete ? asenhaSbP('done') : '';

		case 'extracting':
			if (stats && stats.done_summary) {
				return String(stats.done_summary);
			}
			if (stats && stats.total_size && stats.total_size > 0) {
				return asenhaSbP('extractionComplete')
					.replace('%s', this.formatBytes(stats.total_size));
			}
			// Always show at least "Done" for completed extracting step to prevent
			// stale in-progress text from being preserved when stats were missed.
			return asenhaSbP('done');

		case 'files':
			if (stats && stats.files_restored && stats.files_restored > 0) {
				return asenhaSiteBackup.subProgress.filesRestored
						.replace('%d', this.formatNumber(stats.files_restored));
				}
				return '';

				case 'database':
					// Prefer explicit completion stats, fall back to tracked totals.
					var tablesRestored = 0;
					var rowsRestored = 0;
					if (stats) {
						tablesRestored = stats.tables_restored || 0;
						rowsRestored = stats.rows_restored || 0;
					}
					if (!tablesRestored) {
						tablesRestored = this.lastRestoreTablesTotal || 0;
					}
					if (!tablesRestored && this.lastRestoreSubProgress && this.lastRestoreSubProgress.total > 0) {
						tablesRestored = this.lastRestoreSubProgress.total;
					}
					if (!rowsRestored) {
						rowsRestored = this.lastRestoreRowsTotal || 0;
					}
					if (tablesRestored > 0 && asenhaSiteBackup.subProgress.tablesRestored) {
						return this.appendCollationRemapNote(
							asenhaSiteBackup.subProgress.tablesRestored
								.replace('%1$d', tablesRestored)
								.replace('%2$s', this.formatNumber(rowsRestored)),
							stats || this.lastRestoreSubProgress || {}
						);
					}
					return isOperationComplete ? asenhaSbP('done') : '';

				case 'cleanup':
					// Show 'Done' only at operation completion
					return isOperationComplete ? asenhaSbP('done') : '';

				default:
					return '';
			}
		},

		/**
		 * Initialize upload functionality
		 */
		initUpload: function() {
			var self = this;

			// Click to select file (use event delegation for elements inside hidden containers)
			$(document).on('click', '#asenha-select-file, #asenha-select-import-file', function(e) {
				e.preventDefault();
				$(this).siblings('input[type="file"]').click();
			});

			// Dropzone click (use event delegation)
			$(document).on('click', '#asenha-upload-dropzone, #asenha-import-dropzone', function(e) {
				if (!$(e.target).is('button, input[type="file"]')) {
					$(this).find('input[type="file"]').click();
				}
			});

			// File input change (use event delegation)
			$(document).on('change', '#asenha-backup-upload, #asenha-import-upload', function() {
				if (this.files && this.files.length) {
					var $container = $(this).closest('.asenha-upload-section, .asenha-migration-import');
					if (this.files.length > 1) {
						self.uploadMultipartFiles(this.files, $container);
					} else {
						self.uploadFile(this.files[0], $container);
					}
				}
			});

			// Drag and drop (use event delegation)
			$(document).on('dragover dragenter', '#asenha-upload-dropzone, #asenha-import-dropzone', function(e) {
				e.preventDefault();
				$(this).addClass('dragover');
			}).on('dragleave drop', '#asenha-upload-dropzone, #asenha-import-dropzone', function(e) {
				e.preventDefault();
				$(this).removeClass('dragover');
			}).on('drop', '#asenha-upload-dropzone, #asenha-import-dropzone', function(e) {
				var files = e.originalEvent.dataTransfer.files;
				if (files && files.length) {
					var $container = $(this).closest('.asenha-upload-section, .asenha-migration-import');
					if (files.length > 1) {
						self.uploadMultipartFiles(files, $container);
					} else {
						self.uploadFile(files[0], $container);
					}
				}
			});
		},

		/**
		 * Upload multiple files as a multipart backup (parts + metadata).
		 *
		 * This uploads each file using the existing chunked uploader, marking each as multipart.
		 * Files are uploaded sequentially. On success, the page is reloaded once at the end.
		 *
		 * @param {FileList|Array<File>} fileList FileList from input/drag-drop.
		 * @param {jQuery} $container Upload container.
		 */
		uploadMultipartFiles: function(fileList, $container) {
			var self = this;
			var files = [];
			try {
				files = Array.prototype.slice.call(fileList || []);
			} catch (e) {
				files = [];
			}

			if (!files || !files.length) {
				return;
			}

			var metaFiles = [];
			var partFiles = [];
			var nonMultipartFiles = [];
			for (var i = 0; i < files.length; i++) {
				var name = (files[i] && files[i].name) ? String(files[i].name).toLowerCase() : '';
				if (!name) {
					continue;
				}
				if (name.indexOf('.parts.json') !== -1) {
					metaFiles.push(files[i]);
					continue;
				}
				if (/\.part\d{3}$/.test(name)) {
					partFiles.push(files[i]);
					continue;
				}
				nonMultipartFiles.push(files[i]);
			}

			// If the selection looks like multipart, require exactly 1 meta + >= 1 part.
			var looksMultipart = (metaFiles.length > 0 || partFiles.length > 0);
			if (looksMultipart) {
				if (metaFiles.length !== 1) {
					if (metaFiles.length > 1) {
						self.showNotice('error', asenhaSbT('multipartMultipleMeta'));
					} else {
						self.showNotice('error', asenhaSbT('multipartMissingMeta'));
					}
					return;
				}
				if (partFiles.length < 1) {
					self.showNotice('error', asenhaSbT('multipartMissingParts'));
					return;
				}
			} else if (nonMultipartFiles.length > 1) {
				// Multiple unrelated files selected; guide user to upload one at a time.
				self.showNotice('error', asenhaSbT('uploadMultipleNotSupported'));
				return;
			}

			// Aggregate progress across all files.
			var totalFiles = files.length;
			var totalBytes = 0;
			for (var tb = 0; tb < files.length; tb++) {
				if (files[tb] && typeof files[tb].size === 'number') {
					totalBytes += files[tb].size;
				}
			}
			var totalBytesHuman = self.formatBytes(totalBytes);

			// Ensure a single progress UI exists and reset styling.
			var $progress = $container && $container.length ? $container.find('.asenha-upload-progress') : $();
			if ($progress.length === 0) {
				$progress = $('<div class="asenha-upload-progress"><div class="asenha-progress-bar"><div class="asenha-progress-fill" style="width: 0%;"></div></div><span class="asenha-upload-message">' + asenhaSbT('uploading') + '</span></div>');
				if ($container && $container.length) {
					$container.find('.asenha-upload-dropzone').after($progress);
				}
			}
			$progress.show();
			var $fill = $progress.find('.asenha-progress-fill');
			var $msg = $progress.find('.asenha-upload-message');
			$fill.removeClass('completed failed').css('width', '0%');

			var bytesCompletedSoFar = 0;

			var setAggregateMessage = function(fileIndex1, fileObj) {
				var filename = (fileObj && fileObj.name) ? String(fileObj.name) : '';
				var fileBytes = (fileObj && typeof fileObj.size === 'number') ? parseInt(fileObj.size, 10) : 0;
				if (isNaN(fileBytes) || fileBytes < 0) {
					fileBytes = 0;
				}
				var fileBytesHuman = self.formatBytes(fileBytes);

				$msg.text(
					asenhaSbFmt(asenhaSbT('uploadingFilesAggregate'), {
						'1': String(fileIndex1),
						'2': String(totalFiles),
						'3': String(totalBytesHuman),
						'4': filename,
						'5': fileBytesHuman
					})
				);
			};

			var updateAggregatePercent = function(bytesUploadedCurrentFile) {
				if (totalBytes <= 0) {
					return;
				}
				var agg = Math.max(0, Math.min(totalBytes, bytesCompletedSoFar + (parseInt(bytesUploadedCurrentFile, 10) || 0)));
				var percent = Math.min(100, Math.max(0, Math.round((agg / totalBytes) * 100)));
				$fill.css('width', percent + '%');
			};

			// Sort: meta first, then parts ascending (001,002,...).
			files.sort(function(a, b) {
				var an = (a && a.name) ? String(a.name).toLowerCase() : '';
				var bn = (b && b.name) ? String(b.name).toLowerCase() : '';
				var aIsMeta = an.endsWith('.parts.json');
				var bIsMeta = bn.endsWith('.parts.json');
				if (aIsMeta && !bIsMeta) return -1;
				if (!aIsMeta && bIsMeta) return 1;

				var aPart = an.match(/\.part(\d{3})$/);
				var bPart = bn.match(/\.part(\d{3})$/);
				if (aPart && bPart) {
					return (parseInt(aPart[1], 10) || 0) - (parseInt(bPart[1], 10) || 0);
				}
				return an.localeCompare(bn);
			});

			var idx = 0;
			var total = files.length;

			var next = function() {
				if (idx >= total) {
					$fill.addClass('completed').css('width', '100%');
					$msg.text(asenhaSbT('uploadCompleted'));
					self.showNotice('success', asenhaSbT('uploadCompleted'));
					self.refreshBackupList();
					return;
				}

				var fileIndex1 = idx + 1;
				var currentFile = files[idx];
				setAggregateMessage(fileIndex1, currentFile);
				updateAggregatePercent(0);

				self.uploadFile(currentFile, $container, {
					isMultipart: true,
					suppressRefresh: true,
					aggregate: true,
					onProgress: function(bytesUploaded) {
						updateAggregatePercent(bytesUploaded);
					},
					onCompleted: function() {
						bytesCompletedSoFar += (currentFile && typeof currentFile.size === 'number') ? currentFile.size : 0;
						updateAggregatePercent(0);
						idx++;
						next();
					}
				});
			};

			idx = 0;
			next();
		},

		/**
		 * Show Upload Backup section in Restore tab
		 */
		showUploadBackupSection: function(e) {
			e.preventDefault();
			var $button = $(e.currentTarget);
			$button.hide();
			$('#asenha-show-restore-url-transfer').hide();
			$('.asenha-restore-url-transfer-wrapper').hide();
			$('.asenha-upload-dropzone-wrapper').slideDown(100);
		},

		/**
		 * Show Import dropzone section in Migration tab
		 */
		showImportDropzoneSection: function(e) {
			e.preventDefault();
			var $button = $(e.currentTarget);
			$button.hide();
			$('#asenha-show-import-url-transfer').hide();
			$('.asenha-import-url-transfer-wrapper').hide();
			$('.asenha-import-dropzone-wrapper').slideDown(100);
		},

		/**
		 * Show Import from URL section in Migration tab
		 */
		showImportUrlTransferSection: function(e) {
			this.showUrlTransferSection('migration', e);
		},

		/**
		 * Show Restore from URL section in Restore tab
		 */
		showRestoreUrlTransferSection: function(e) {
			this.showUrlTransferSection('restore', e);
		},

		/**
		 * Show URL transfer section in Restore or Migration tab
		 */
		showUrlTransferSection: function(context, e) {
			e.preventDefault();
			var $button = $(e.currentTarget);
			var cfg = this.getUrlTransferConfig(context);
			$button.hide();

			if (cfg.context === 'restore') {
				$('#asenha-show-upload-backup').hide();
				$('.asenha-upload-dropzone-wrapper').hide();
			} else {
				$('#asenha-show-import-dropzone').hide();
				$('.asenha-import-dropzone-wrapper').hide();
			}

			$(cfg.wrapperSelector).slideDown(100);
		},

		/**
		 * Get URL transfer UI selectors for a context
		 */
		getUrlTransferConfig: function(context) {
			var normalizedContext = (context === 'restore') ? 'restore' : 'migration';

			if (normalizedContext === 'restore') {
				return {
					context: 'restore',
					inputSelector: '#asenha-restore-url-transfer-input',
					buttonSelector: '#asenha-start-restore-url-transfer',
					wrapperSelector: '.asenha-restore-url-transfer-wrapper',
					progressSelector: '.asenha-restore-url-transfer-progress'
				};
			}

			return {
				context: 'migration',
				inputSelector: '#asenha-import-url-transfer-input',
				buttonSelector: '#asenha-start-import-url-transfer',
				wrapperSelector: '.asenha-import-url-transfer-wrapper',
				progressSelector: '.asenha-import-url-transfer-progress'
			};
		},

		/**
		 * Start Restore URL transfer
		 */
		startRestoreUrlTransfer: function(e) {
			this.startUrlTransfer('restore', e);
		},

		/**
		 * Start import-from-URL transfer (download remote .zip to imported archive)
		 */
		startImportUrlTransfer: function(e) {
			this.startUrlTransfer('migration', e);
		},

		/**
		 * Start URL transfer for Restore or Migration
		 */
		startUrlTransfer: function(context, e) {
			e.preventDefault();

			var cfg = this.getUrlTransferConfig(context);
			var url = ($(cfg.inputSelector).val() || '').toString().trim();
			var $button = $(e.currentTarget);
			var $progress = $(cfg.progressSelector);
			var $fill = $progress.find('.asenha-progress-fill');
			var $msg = $progress.find('.asenha-upload-message');

			if (!url) {
				this.showNotice('error', asenhaSbT('urlRequired'));
				return;
			}

			// Basic client-side hint; server performs authoritative validation.
			var urlLower = url.toLowerCase();
			var isSftpRef = urlLower.indexOf('asenha-sftp://') === 0;
			if (!isSftpRef) {
				var urlBase = url.split('#')[0].split('?')[0].toLowerCase();
				if (!urlBase.endsWith('.zip') && !urlBase.endsWith('.parts.json')) {
					this.showNotice('error', asenhaSbT('urlMustBeZipOrMeta'));
					return;
				}
			}

			$button.prop('disabled', true);
			$progress.show();
			$fill.removeClass('failed completed').css('width', '0%');
			$msg.text(asenhaSbT('downloadStarting'));

			// Clear existing poller if any.
			if (this.importUrlTransferInterval) {
				clearInterval(this.importUrlTransferInterval);
				this.importUrlTransferInterval = null;
			}
			this.currentImportUrlTransferId = null;
			this.currentImportUrlTransferContext = cfg.context;

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_start_import_from_url',
					nonce: asenhaSiteBackup.nonce,
					url: url,
					transfer_context: cfg.context
				},
				success: function(response) {
					if (response && response.success && response.data && response.data.job_id) {
						this.currentImportUrlTransferId = String(response.data.job_id);
						this.currentImportUrlTransferContext = cfg.context;
						this.pollImportUrlTransferProgress(cfg.context);
						return;
					}

					var msg = (response && response.data && response.data.message) ? response.data.message : asenhaSbT('transferFailed');
					$fill.addClass('failed');
					$msg.text(asenhaSbT('failed'));
					$button.prop('disabled', false);
					this.showNotice('error', msg);
				}.bind(this),
				error: function(xhr) {
					var msg = (xhr && xhr.responseJSON && xhr.responseJSON.data && xhr.responseJSON.data.message) ? xhr.responseJSON.data.message : asenhaSbT('transferFailed');
					$fill.addClass('failed');
					$msg.text(asenhaSbT('failed'));
					$button.prop('disabled', false);
					this.showNotice('error', msg);
				}.bind(this)
			});
		},

		/**
		 * Poll import-from-URL progress
		 */
		pollImportUrlTransferProgress: function() {
			var self = this;
			var cfg = this.getUrlTransferConfig(this.currentImportUrlTransferContext);

			if (!this.currentImportUrlTransferId) {
				return;
			}

			// Ensure only one poller is active.
			if (this.importUrlTransferInterval) {
				clearInterval(this.importUrlTransferInterval);
				this.importUrlTransferInterval = null;
			}

			var $progress = $(cfg.progressSelector);
			var $fill = $progress.find('.asenha-progress-fill');
			var $msg = $progress.find('.asenha-upload-message');
			var $button = $(cfg.buttonSelector);

			var pollOnce = function() {
				$.ajax({
					url: asenhaSiteBackup.ajaxUrl,
					type: 'POST',
					data: {
						action: 'asenha_get_import_from_url_progress',
						nonce: asenhaSiteBackup.nonce,
						job_id: self.currentImportUrlTransferId
					},
					success: function(response) {
						if (!response || !response.success || !response.data) {
							return;
						}

						var state = response.data;
						var bytesReceived = parseInt(state.bytes_received, 10);
						if (isNaN(bytesReceived) || bytesReceived < 0) {
							bytesReceived = 0;
						}
						var totalFilesBytes = parseInt(state.total_files_bytes, 10);
						if (isNaN(totalFilesBytes) || totalFilesBytes < 0) {
							totalFilesBytes = 0;
						}
						var queueTotal = parseInt(state.queue_total, 10);
						var queueIndex = parseInt(state.queue_index, 10);

						var fileIndex = parseInt(state.file_index, 10);
						var fileTotal = parseInt(state.file_total, 10);
						if (isNaN(fileIndex) || fileIndex <= 0) fileIndex = 1;
						if (isNaN(fileTotal) || fileTotal <= 0) fileTotal = 1;

						var isChainTransfer = false;
						if (!isNaN(queueTotal) && queueTotal > 1) {
							isChainTransfer = true;
							fileTotal = queueTotal;
							if (!isNaN(queueIndex) && queueIndex >= 0) {
								fileIndex = Math.min(fileTotal, queueIndex + 1);
							}
						} else if (fileTotal > 1) {
							isChainTransfer = true;
						}

						var progress = 0;
						if (isChainTransfer) {
							progress = parseInt(state.progress, 10);
							if (isNaN(progress) || progress < 0) {
								progress = 0;
							}
							if (progress > 100) {
								progress = 100;
							}
						} else if (totalFilesBytes > 0) {
							progress = Math.min(100, Math.max(0, Math.round((bytesReceived / totalFilesBytes) * 100)));
						} else {
							progress = parseInt(state.progress, 10);
							if (isNaN(progress) || progress < 0) {
								progress = 0;
							}
							if (progress > 100) {
								progress = 100;
							}
						}

						$fill.css('width', progress + '%');

						var currentFilename = state.current_filename ? String(state.current_filename) : '';
						if (!currentFilename && state.filename) {
							currentFilename = String(state.filename);
						}

						var currentFileBytes = parseInt(state.current_file_bytes, 10);
						if (isNaN(currentFileBytes) || currentFileBytes < 0) {
							currentFileBytes = 0;
						}

						var totalHuman = totalFilesBytes > 0 ? self.formatBytes(totalFilesBytes) : '';
						var currentHuman = currentFileBytes > 0 ? self.formatBytes(currentFileBytes) : '';

						var line = '';
						if (isChainTransfer) {
							line = asenhaSbFmt(asenhaSbT('importUrlDownloadingArchive'), {
								'1': String(fileIndex),
								'2': String(fileTotal)
							});
						} else {
							line = asenhaSbFmt(asenhaSbT('importUrlDownloadingFiles'), {
								'1': String(fileIndex),
								'2': String(fileTotal)
							});
							if (totalHuman) {
								line += ' ' + asenhaSbFmt(asenhaSbT('importUrlTotalSuffix'), { '1': totalHuman });
							}
						}
						if (currentFilename) {
							line += ': ' + currentFilename;
							if (currentHuman) {
								line += ' (' + currentHuman + ')';
							}
						}

						$msg.text(line);

						if (state.status === 'completed') {
							if (self.importUrlTransferInterval) {
								clearInterval(self.importUrlTransferInterval);
								self.importUrlTransferInterval = null;
							}
							self.currentImportUrlTransferContext = null;

							$fill.addClass('completed').css('width', '100%');
							$msg.text(asenhaSbT('downloadCompleted'));
							self.showNotice('success', (state.success_message || asenhaSbT('downloadCompleted')));
							self.refreshBackupList();
							return;
						}

						if (state.status === 'failed') {
							if (self.importUrlTransferInterval) {
								clearInterval(self.importUrlTransferInterval);
								self.importUrlTransferInterval = null;
							}
							self.currentImportUrlTransferContext = null;

							$fill.addClass('failed');
							$msg.text(asenhaSbT('failed'));
							$button.prop('disabled', false);
							self.showNotice('error', (state.error || asenhaSbT('transferFailed')));
						}
					}
				});
			};

			// Initial poll and start interval.
			pollOnce();
			this.importUrlTransferInterval = setInterval(pollOnce, 1500);
		},

		/**
		 * Upload file
		 */
		uploadFile: function(file, $container, opts) {
			var self = this;
			opts = opts || {};
			var isAggregate = !!opts.aggregate;
			var $progress = $container.find('.asenha-upload-progress');
			if ($progress.length === 0) {
				$progress = $('<div class="asenha-upload-progress"><div class="asenha-progress-bar"><div class="asenha-progress-fill" style="width: 0%;"></div></div><span class="asenha-upload-message">' + asenhaSbT('uploading') + '</span></div>');
				$container.find('.asenha-upload-dropzone').after($progress);
			}

			$progress.show();

			// Determine upload source based on container class
			var uploadSource = $container.hasClass('asenha-migration-import') ? 'migration' : 'restore';
			var isMultipart = !!opts.isMultipart;

			var uploadCfg = asenhaSiteBackup.upload || {};
			var chunkBytes = parseInt(uploadCfg.chunkBytes, 10) || (2 * 1024 * 1024);
			var minChunkBytes = parseInt(uploadCfg.minChunkBytes, 10) || (256 * 1024);
			var maxRetries = parseInt(uploadCfg.maxRetries, 10) || 3;

			// Helper: update message in progress UI.
			var setMessage = function(msg) {
				if (isAggregate) {
					return;
				}
				if (msg) {
					$progress.find('.asenha-upload-message').text(msg);
				}
			};

			// Helper: update overall percent based on bytes uploaded.
			var updatePercent = function(bytesUploaded) {
				if (isAggregate && opts && typeof opts.onProgress === 'function') {
					opts.onProgress(bytesUploaded);
					return;
				}
				var total = file && file.size ? file.size : 0;
				if (total <= 0) {
					return;
				}
				var percent = Math.min(100, Math.max(0, Math.round((bytesUploaded / total) * 100)));
				$progress.find('.asenha-progress-fill').css('width', percent + '%');
			};

			if (!isAggregate) {
				setMessage(asenhaSbT('uploadStarting') || asenhaSbT('uploading'));
			}

			// Initialize upload session on server (creates state + selects final filename).
			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_init_backup_upload',
					nonce: asenhaSiteBackup.nonce,
					original_filename: file.name,
					file_size: file.size,
					upload_source: uploadSource,
					is_multipart: isMultipart ? 1 : 0
				},
				success: function(initResponse) {
					if (!initResponse || !initResponse.success) {
						var msg = (initResponse && initResponse.data && initResponse.data.message) ? initResponse.data.message : asenhaSbT('uploadFailed');
						$progress.find('.asenha-progress-fill').addClass('failed');
						setMessage(asenhaSbT('uploadFailed'));
						self.showNotice('error', msg);
						return;
					}

					var uploadId = initResponse.data.upload_id;
					var bytesReceived = parseInt(initResponse.data.bytes_received, 10) || 0;

					if (initResponse.data.chunk_bytes) {
						chunkBytes = Math.max(minChunkBytes, parseInt(initResponse.data.chunk_bytes, 10) || chunkBytes);
					}
					if (initResponse.data.min_chunk_bytes) {
						minChunkBytes = parseInt(initResponse.data.min_chunk_bytes, 10) || minChunkBytes;
					}

					updatePercent(bytesReceived);

					var retryDelayMs = function(attempt) {
						return Math.min(5000, 500 * (attempt + 1));
					};

					var failUpload = function(message, xhr) {
						$progress.find('.asenha-progress-fill').addClass('failed');
						setMessage(asenhaSbT('uploadFailed'));

						// Provide a more actionable message for 413.
						if (xhr && xhr.status === 413 && asenhaSbT('upload413Hint')) {
							self.showNotice('error', asenhaSbT('upload413Hint'));
							return;
						}

						self.showNotice('error', message || asenhaSbT('uploadFailed'));
					};

					var fetchStatusAndResume = function(onDone, onFail) {
						$.ajax({
							url: asenhaSiteBackup.ajaxUrl,
							type: 'POST',
							data: {
								action: 'asenha_get_backup_upload_status',
								nonce: asenhaSiteBackup.nonce,
								upload_id: uploadId
							},
							success: function(statusResponse) {
								if (statusResponse && statusResponse.success && statusResponse.data) {
									var serverBytes = parseInt(statusResponse.data.bytes_received, 10);
									if (!isNaN(serverBytes) && serverBytes >= 0) {
										bytesReceived = serverBytes;
										updatePercent(bytesReceived);
									}
									onDone();
									return;
								}
								onFail();
							},
							error: function() {
								onFail();
							}
						});
					};

					var uploadNextChunk = function(attempt) {
						attempt = attempt || 0;

						if (bytesReceived >= file.size) {
							// Finalize (rename .part to final .zip).
							if (!isAggregate) {
								setMessage(asenhaSbT('uploadFinalizing') || asenhaSbT('uploading'));
							}

							$.ajax({
								url: asenhaSiteBackup.ajaxUrl,
								type: 'POST',
								data: {
									action: 'asenha_finalize_backup_upload',
									nonce: asenhaSiteBackup.nonce,
									upload_id: uploadId
								},
								success: function(finalResponse) {
									if (finalResponse && finalResponse.success) {
										if (!isAggregate) {
											$progress.find('.asenha-progress-fill').addClass('completed').css('width', '100%');
											setMessage(asenhaSbT('uploadCompleted'));
											self.showNotice('success', finalResponse.data.message);
										}
										if (opts && typeof opts.onCompleted === 'function') {
											opts.onCompleted(finalResponse);
										} else if (!opts || !opts.suppressRefresh) {
											self.refreshBackupList();
										}
										return;
									}

									var msg = (finalResponse && finalResponse.data && finalResponse.data.message) ? finalResponse.data.message : asenhaSbT('uploadFailed');
									failUpload(msg);
								},
								error: function(xhr) {
									failUpload(asenhaSbT('uploadFailed'), xhr);
								}
							});
							return;
						}

						var end = Math.min(bytesReceived + chunkBytes, file.size);
						var chunkBlob = file.slice(bytesReceived, end);

						var formData = new FormData();
						formData.append('action', 'asenha_upload_backup_chunk');
						formData.append('nonce', asenhaSiteBackup.nonce);
						formData.append('upload_id', uploadId);
						formData.append('chunk_offset', bytesReceived);
						formData.append('chunk', chunkBlob, 'chunk.bin');

						if (!isAggregate) {
							setMessage(asenhaSbT('uploading'));
						}

						$.ajax({
							url: asenhaSiteBackup.ajaxUrl,
							type: 'POST',
							data: formData,
							processData: false,
							contentType: false,
							success: function(chunkResponse) {
								if (chunkResponse && chunkResponse.success && chunkResponse.data) {
									var newBytes = parseInt(chunkResponse.data.bytes_received, 10);
									if (!isNaN(newBytes) && newBytes >= bytesReceived) {
										bytesReceived = newBytes;
									} else {
										bytesReceived = end;
									}

									updatePercent(bytesReceived);
									uploadNextChunk(0);
									return;
								}

								// Handle structured errors (including offset mismatch).
								if (chunkResponse && chunkResponse.data && typeof chunkResponse.data.bytes_received !== 'undefined') {
									var serverBytes = parseInt(chunkResponse.data.bytes_received, 10);
									if (!isNaN(serverBytes) && serverBytes >= 0) {
										bytesReceived = serverBytes;
										updatePercent(bytesReceived);
									}
								}

								var msg = (chunkResponse && chunkResponse.data && chunkResponse.data.message) ? chunkResponse.data.message : asenhaSbT('uploadFailed');

								if (attempt < maxRetries) {
									setMessage(asenhaSbT('uploadRetrying') || asenhaSbT('uploading'));
									window.setTimeout(function() {
										uploadNextChunk(attempt + 1);
									}, retryDelayMs(attempt));
									return;
								}

								// Last resort: ask server where it is and resume.
								fetchStatusAndResume(
									function() {
										uploadNextChunk(0);
									},
									function() {
										failUpload(msg);
									}
								);
							},
							error: function(xhr) {
								// If the proxy rejects the request (413), reduce chunk size and retry.
								if (xhr && xhr.status === 413) {
									if (chunkBytes > minChunkBytes) {
										chunkBytes = Math.max(minChunkBytes, Math.floor(chunkBytes / 2));
									}
								}

								if (attempt < maxRetries) {
									setMessage(asenhaSbT('uploadRetrying') || asenhaSbT('uploading'));
									window.setTimeout(function() {
										uploadNextChunk(attempt + 1);
									}, retryDelayMs(attempt));
									return;
								}

								fetchStatusAndResume(
									function() {
										uploadNextChunk(0);
									},
									function() {
										var msg = (xhr && xhr.responseJSON && xhr.responseJSON.data && xhr.responseJSON.data.message) ? xhr.responseJSON.data.message : asenhaSbT('uploadFailed');
										failUpload(msg, xhr);
									}
								);
							}
						});
					};

					uploadNextChunk(0);
				},
				error: function(xhr) {
					var msg = (xhr && xhr.responseJSON && xhr.responseJSON.data && xhr.responseJSON.data.message) ? xhr.responseJSON.data.message : asenhaSbT('uploadFailed');
					$progress.find('.asenha-progress-fill').addClass('failed');
					setMessage(asenhaSbT('uploadFailed'));
					self.showNotice('error', msg);
				}
			});
		},

		/**
		 * Refresh backup list
		 */
		refreshBackupList: function() {
			// Reload the page to refresh the list
			// In a future version, this could be an AJAX refresh
			location.reload();
		},

		/**
		 * Clear logs
		 */
		clearLogs: function(e) {
			e.preventDefault();

			if (!confirm(asenhaSiteBackup.strings.confirmClearLogs)) {
				return;
			}

			var $button = $('#asenha-clear-logs');
			$button.prop('disabled', true);

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_clear_logs',
					nonce: asenhaSiteBackup.nonce
				},
				success: function(response) {
					$button.prop('disabled', false);
					if (response.success) {
						this.showNotice('success', response.data.message);
						// Reload page to keep logs filters/pagination UI in sync.
						window.setTimeout(function() {
							window.location.reload();
						}, 350);
					} else {
						this.showNotice('error', response.data.message);
					}
				}.bind(this),
				error: function() {
					$button.prop('disabled', false);
					this.showNotice('error', asenhaSbT('requestFailed'));
				}.bind(this)
			});
		},

		/**
		 * Save maximum log entries retention (site-wide).
		 */
		saveLogMaxEntries: function(e) {
			var $select = $(e.target);
			var prev = String($select.attr('data-asenha-log-max-prev') || '');
			var val = String($select.val() || '');
			if (val === prev) {
				return;
			}

			$select.prop('disabled', true);

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_save_log_max_entries',
					nonce: asenhaSiteBackup.nonce,
					max_entries: val
				},
				success: function(response) {
					$select.prop('disabled', false);
					if (response.success) {
						var msg = (response.data && response.data.message) ? response.data.message : (asenhaSiteBackup.strings.logMaxEntriesSaved || '');
						this.showNotice('success', msg);
						window.setTimeout(function() {
							window.location.reload();
						}, 350);
					} else {
						$select.val(prev);
						var err = (response.data && response.data.message) ? response.data.message : (asenhaSiteBackup.strings.logMaxEntriesSaveFailed || '');
						this.showNotice('error', err);
					}
				}.bind(this),
				error: function() {
					$select.prop('disabled', false);
					$select.val(prev);
					this.showNotice('error', asenhaSiteBackup.strings.logMaxEntriesSaveFailed || asenhaSbT('requestFailed'));
				}.bind(this)
			});
		},

		/**
		 * Show emergency restore script section
		 */
		showRestoreScriptSection: function(e) {
			e.preventDefault();
			
			// Hide the toggle link and show the section
			$('#asenha-show-restore-script').closest('.asenha-restore-script-toggle').hide();
			$('.asenha-restore-script-section').fadeIn(100);
		},

		/**
		 * Download emergency restore script
		 */
		downloadRestoreScript: function(e) {
			e.preventDefault();

			// Trigger file download via URL
			window.location.href = asenhaSiteBackup.ajaxUrl + 
				'?action=asenha_download_restore_script&nonce=' + asenhaSiteBackup.nonce;
		},

		/**
		 * Set Emergency Restore Script UI state (install vs access/uninstall).
		 */
		setRestoreScriptUiState: function(state) {
			var installed = state && state.installed;
			var filename = state && state.filename ? String(state.filename) : '';
			var url = state && state.url ? String(state.url) : '';

			var $install = $('#asenha-install-restore-script');
			var $access = $('#asenha-access-restore-script');
			var $uninstall = $('#asenha-uninstall-restore-script');

			if (!$install.length || !$access.length || !$uninstall.length) {
				return;
			}

			if (installed) {
				$install.hide();
				$access.attr('href', url || '#').show();
				$uninstall.data('filename', filename).attr('data-filename', filename).show();
			} else {
				$access.hide().attr('href', '#');
				$uninstall.hide().data('filename', '').attr('data-filename', '');
				$install.show();
			}
		},

		/**
		 * Install emergency restore script into ABSPATH.
		 */
		installRestoreScript: function(e) {
			e.preventDefault();

			if (asenhaSiteBackup && asenhaSiteBackup.strings && asenhaSiteBackup.strings.confirmInstallRestoreScript) {
				if (!confirm(asenhaSiteBackup.strings.confirmInstallRestoreScript)) {
					return;
				}
			}

			var $button = $('#asenha-install-restore-script');
			$button.prop('disabled', true);

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_install_restore_script',
					nonce: asenhaSiteBackup.nonce
				},
				success: function(response) {
					$button.prop('disabled', false);
					if (response && response.success && response.data) {
						asenhaSiteBackup.restoreScript = response.data;
						this.setRestoreScriptUiState(response.data);
						this.showNotice('success', response.data.message || asenhaSbT('restoreScriptInstalled'));
					} else {
						var msg = (response && response.data && response.data.message) ? response.data.message : asenhaSbT('restoreScriptInstallFailed');
						this.showNotice('error', msg);
					}
				}.bind(this),
				error: function(xhr) {
					$button.prop('disabled', false);
					var msg = (xhr && xhr.responseJSON && xhr.responseJSON.data && xhr.responseJSON.data.message) ? xhr.responseJSON.data.message : asenhaSbT('restoreScriptInstallFailed');
					this.showNotice('error', msg);
				}.bind(this)
			});
		},

		/**
		 * Uninstall emergency restore script from ABSPATH.
		 */
		uninstallRestoreScript: function(e) {
			e.preventDefault();

			if (asenhaSiteBackup && asenhaSiteBackup.strings && asenhaSiteBackup.strings.confirmUninstallRestoreScript) {
				if (!confirm(asenhaSiteBackup.strings.confirmUninstallRestoreScript)) {
					return;
				}
			}

			var $button = $('#asenha-uninstall-restore-script');
			var filename = $button.attr('data-filename') || ($button.data('filename') ? String($button.data('filename')) : '');
			$button.prop('disabled', true);

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_uninstall_restore_script',
					nonce: asenhaSiteBackup.nonce,
					filename: filename
				},
				success: function(response) {
					$button.prop('disabled', false);
					if (response && response.success && response.data) {
						asenhaSiteBackup.restoreScript = response.data;
						this.setRestoreScriptUiState(response.data);
						this.showNotice('success', response.data.message || asenhaSbT('restoreScriptUninstalled'));
					} else {
						var msg = (response && response.data && response.data.message) ? response.data.message : asenhaSbT('restoreScriptUninstallFailed');
						this.showNotice('error', msg);
					}
				}.bind(this),
				error: function(xhr) {
					$button.prop('disabled', false);
					var msg = (xhr && xhr.responseJSON && xhr.responseJSON.data && xhr.responseJSON.data.message) ? xhr.responseJSON.data.message : asenhaSbT('restoreScriptUninstallFailed');
					this.showNotice('error', msg);
				}.bind(this)
			});
		},

		/**
		 * Update progress display with checklist
		 */
		updateProgress: function($progress, percent, currentStep, type, subProgress, completedStats, state) {
			// Update circular progress
			$progress.find('.asenha-circle-progress').attr('stroke-dasharray', percent + ', 100');
			$progress.find('.asenha-progress-percent').text(percent + '%');

			// Get step order based on type
			var steps;
			if (type === 'backup') {
				var baseSteps = this.backupSteps[this.currentBackupType] || this.backupSteps.full;
				var wantsSending = false;
				if (state && state.locations && $.isArray(state.locations.remote_location_ids) && state.locations.remote_location_ids.length) {
					wantsSending = true;
				}
				if (String(currentStep || '') === 'sending') {
					wantsSending = true;
				}

				this.currentBackupSteps = this.computeBackupStepsForBackupType(this.currentBackupType || 'full', wantsSending);
				steps = this.currentBackupSteps || baseSteps;

				// If steps changed (e.g. resumed run that requires 'sending'), rebuild checklist.
				var currentCheckpointCount = $progress.find('.asenha-checkpoint').length;
				if (currentCheckpointCount !== steps.length) {
					var checklistHtml = this.buildChecklist(steps, asenhaSiteBackup.checkpoints.backup);
					$progress.find('.asenha-progress-checklist').html(checklistHtml);
				}
			} else {
				// Determine restore steps based on components
				var opts = this.currentRestoreOptions || { components: 'all' };
				if (opts.components === 'database') {
					steps = this.restoreSteps.database;
				} else if (opts.components === 'files') {
					steps = this.restoreSteps.files;
				} else {
					steps = this.restoreSteps.full;
				}
			}

			// Find current step index
			var currentIndex = steps.indexOf(currentStep);
			if (currentIndex === -1) {
				currentIndex = 0;
			}

			var self = this;

			// Update checkpoint states
			$progress.find('.asenha-checkpoint').each(function() {
				var $checkpoint = $(this);
				var step = $checkpoint.data('step');
				var stepIndex = steps.indexOf(step);
				var $subLabel = $checkpoint.find('.asenha-checkpoint-sub');

				$checkpoint.removeClass('pending in-progress completed');

				if (stepIndex < currentIndex) {
					$checkpoint.addClass('completed');
					var subLabelHandled = false;
					if (
						type === 'backup'
						&& step === 'sending'
						&& state
						&& ( String(state.sending_status || '') === 'completed' || String(state.sending_status || '') === 'completed_with_errors' )
					) {
						var remoteCount = 0;
						if (state.locations && $.isArray(state.locations.remote_location_ids)) {
							remoteCount = state.locations.remote_location_ids.length;
						} else if ($.isArray(state.sending_location_ids)) {
							remoteCount = state.sending_location_ids.length;
						}
						if (remoteCount > 0) {
							var sendStatus = String(state.sending_status || '');
							var summary = self.formatSendingCompletedSummary(remoteCount);
							if (sendStatus === 'completed_with_errors') {
								summary += ' (' + asenhaSbT('failed') + ')';
							}
							$subLabel.text(summary);
							subLabelHandled = true;
						}
					}
					// Show statistics for completed steps from server-provided completedStats
					// Only update if we have stats - preserve existing text if no stats available
					if (!subLabelHandled && type === 'backup' && step === 'archive') {
						var archiveSummary = self.formatBackupArchiveCreatedSummary(state, completedStats);
						if (archiveSummary) {
							$subLabel.text(archiveSummary);
							subLabelHandled = true;
						}
					}
					if (!subLabelHandled && completedStats && completedStats[step]) {
						var statsText = self.formatCompletedStats(step, completedStats[step]);
						$subLabel.text(statsText);
					}
					// Don't clear sub-label if no stats - keep existing value
				} else if (stepIndex === currentIndex) {
					$checkpoint.addClass('in-progress');
					// Update sub-label for current step
					if (subProgress) {
						var subText = self.formatSubProgress(step, subProgress);
						$subLabel.text(subText);
					}
				} else {
					$checkpoint.addClass('pending');
					// Clear sub-label for pending steps
					$subLabel.text('');
				}
			});
		},

		// =====================================================
		// Migration Methods
		// =====================================================

		/**
		 * Get migration archive passphrase field row.
		 *
		 * @return {jQuery}
		 */
		getMigrationPassphraseFieldRow: function() {
			return $('.asenha-migration-archive-passphrase-field').first();
		},

		/**
		 * Determine whether migration import requires an archive passphrase.
		 *
		 * @param {jQuery} $button
		 * @param {jQuery} $row
		 * @return {boolean}
		 */
		isMigrationPassphraseRequired: function($button, $row) {
			var buttonRequired = $button.attr('data-archive-passphrase-required');
			var rowRequired = $row.attr('data-archive-passphrase-required');
			var buttonEncrypted = $button.attr('data-is-encrypted-archive');
			var rowEncrypted = $row.attr('data-is-encrypted-archive');

			var requiresPassphrase = this.isTruthyFlag(buttonRequired) || this.isTruthyFlag(rowRequired);
			var isEncryptedArchive = this.isTruthyFlag(buttonEncrypted) || this.isTruthyFlag(rowEncrypted);

			return requiresPassphrase || isEncryptedArchive;
		},

		/**
		 * Toggle migration archive passphrase row visibility.
		 *
		 * @param {boolean} shouldShow
		 */
		setMigrationPassphraseFieldVisibility: function(shouldShow) {
			var $row = this.getMigrationPassphraseFieldRow();
			if (!$row.length) {
				return;
			}

			if (shouldShow) {
				$row.show();
				return;
			}

			$row.hide();
			$('#asenha-migration-archive-passphrase').val('');
		},

		/**
		 * Handle Import Site button click from the Full Backup Archives table
		 */
		onImportSiteClick: function(e) {
			e.preventDefault();

			var $button = $(e.currentTarget);
			var $row = $button.closest('tr');
			var $table = $row.closest('table');
			var filename = $button.data('filename');
			var requiresArchivePassphrase = this.isMigrationPassphraseRequired($button, $row);

			if (!filename) {
				this.showNotice('error', asenhaSbT('noBackupFileSpecified'));
				return;
			}

			// Highlight the selected row
			$table.find('tr').removeClass('asenha-import-selected');
			$row.addClass('asenha-import-selected');

			// Disable the button and show analyzing state
			$button.prop('disabled', true).text(asenhaSbT('detectingPackage'));

			// Store the filename
			this.currentMigrationFilename = filename;

			// Analyze the package and show the package info panel
			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_detect_package_info',
					nonce: asenhaSiteBackup.nonce,
					filename: filename
				},
				success: function(response) {
					$button.prop('disabled', false).text(asenhaSbT('importSite'));

					if (response.success) {
						this.showPackageInfo(response.data, filename, requiresArchivePassphrase);
					} else {
						this.showNotice('error', response.data.message);
						$row.removeClass('asenha-import-selected');
					}
				}.bind(this),
				error: function(xhr, status, error) {
					$button.prop('disabled', false).text(asenhaSbT('importSite'));
					this.showNotice('error', error);
					$row.removeClass('asenha-import-selected');
				}.bind(this)
			});
		},

		/**
		 * Show package info and configuration UI
		 */
		showPackageInfo: function(info, filename, requiresArchivePassphrase) {
			var $packageInfo = $('.asenha-package-info');

			// Store filename
			this.currentMigrationFilename = filename;

			// Update package info display
			$packageInfo.find('.asenha-package-wp-version').text(info.source_wp_version || '-');
			$packageInfo.find('.asenha-package-created').text(info.created_at || '-');

			// Update search/replace fields
			$('#asenha-migration-old-url').val(info.source_url || '');
			$('#asenha-migration-new-url').val(info.destination_url || asenhaSiteBackup.currentSiteUrl);
			$('#asenha-migration-old-path').val(info.source_path || '');
			$('#asenha-migration-new-path').val(info.destination_path || asenhaSiteBackup.currentAbspath || '');

			this.setMigrationPassphraseFieldVisibility(!!requiresArchivePassphrase);
			$('#asenha-start-migration').prop('disabled', false);

			// Show package info section
			$packageInfo.slideDown();

			// Scroll to package info
			$('html, body').animate({
				scrollTop: $packageInfo.offset().top - 50
			}, 400);
		},

		/**
		 * Handle component checkbox change
		 */
		onComponentChange: function(e) {
			var $checkbox = $(e.currentTarget);
			var value = $checkbox.val();
			var isChecked = $checkbox.prop('checked');
			var $allComponents = $('input[name="import_components"]');
			var $allCheckbox = $('input[name="import_components"][value="all"]');
			var $otherCheckboxes = $('input[name="import_components"]:not([value="all"])');

			if (value === 'all') {
				// If "All" is checked, disable others
				if (isChecked) {
					$otherCheckboxes.prop('checked', false).prop('disabled', true);
				} else {
					$otherCheckboxes.prop('disabled', false);
				}
			} else {
				// If any individual component is checked, uncheck "All"
				if (isChecked) {
					$allCheckbox.prop('checked', false);
				}

				// If no individual components checked, re-check "All"
				if ($otherCheckboxes.filter(':checked').length === 0) {
					$allCheckbox.prop('checked', true);
					$otherCheckboxes.prop('disabled', true);
				}
			}
		},

		/**
		 * Cancel migration setup
		 */
		cancelMigrationSetup: function(e) {
			e.preventDefault();

			$('.asenha-package-info').slideUp();
			this.setMigrationPassphraseFieldVisibility(false);
			this.currentMigrationFilename = null;
			$('#asenha-import-select-package').val('');
			$('#asenha-analyze-package').prop('disabled', true);
		},

		/**
		 * Start migration
		 */
		startMigration: function(e) {
			e.preventDefault();

			if (!confirm(asenhaSiteBackup.strings.confirmMigration)) {
				return;
			}

			// Suspend heartbeat to prevent interim login modal after session invalidation
			this.suspendHeartbeat();

			var $button = $(e.currentTarget);
			var filename = this.currentMigrationFilename;
			var oldUrl = $('#asenha-migration-old-url').val();
			var newUrl = $('#asenha-migration-new-url').val();
			var oldPath = $('#asenha-migration-old-path').val();
			var newPath = $('#asenha-migration-new-path').val();
			var archivePassphrase = String($('#asenha-migration-archive-passphrase').val() || '');
			var archivePassphraseTrimmed = archivePassphrase.trim();
			var isMigrationPassphraseRequired = this.getMigrationPassphraseFieldRow().is(':visible');

			// Get selected components
			var components = [];
			$('input[name="import_components"]:checked').each(function() {
				components.push($(this).val());
			});

			if (components.length === 0) {
				components = ['all'];
			}

			if (!filename) {
				this.showNotice('error', asenhaSbT('selectPackageFirst'));
				return;
			}

			if (isMigrationPassphraseRequired && !archivePassphraseTrimmed) {
				this.showNotice('error', asenhaSbT('migrationArchivePassphraseRequired'));
				$('#asenha-migration-archive-passphrase').trigger('focus');
				return;
			}

			// Disable button and hide setup UI
			$button.prop('disabled', true);
			$('.asenha-package-info').hide();

			// Show progress
			this.initMigrationProgress(components);
			$('.asenha-migration-progress').show();

			// Store components
			this.currentMigrationComponents = components;

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_start_migration',
					nonce: asenhaSiteBackup.nonce,
					filename: filename,
					components: components,
					old_url: oldUrl,
					new_url: newUrl,
					old_path: oldPath,
					new_path: newPath,
					archive_passphrase: archivePassphrase
				},
				success: function(response) {
					if (response.success) {
						this.currentMigrationId = response.data.migration_id;
						this.currentMigrationPublicProgressUrl = response.data.public_progress_url || null;
						// Store public progress URL for static JSON polling fallback
						if (this.currentMigrationPublicProgressUrl) {
							this.saveMigrationPublicProgressUrl(this.currentMigrationId, this.currentMigrationPublicProgressUrl);
						}
						this.pollMigrationProgress();
					} else {
						this.migrationFailed(response.data.message);
						$button.prop('disabled', false);
					}
				}.bind(this),
				error: function(xhr, status, error) {
					this.migrationFailed(error);
					$button.prop('disabled', false);
				}.bind(this)
			});
		},

		/**
		 * Initialize migration progress UI
		 */
		initMigrationProgress: function(components) {
			var $progress = $('.asenha-migration-progress');
			var steps;

			// Determine steps based on components
			if (components.indexOf('all') !== -1) {
				steps = this.migrationSteps.full;
			} else if (components.indexOf('database') !== -1 && components.length === 1) {
				steps = this.migrationSteps.database;
			} else if (components.indexOf('database') === -1) {
				steps = this.migrationSteps.files;
			} else {
				steps = this.migrationSteps.full;
			}

			var checkpointLabels = asenhaSiteBackup.checkpoints.migration;

			// Build and insert checklist
			var checklistHtml = this.buildChecklist(steps, checkpointLabels);
			$progress.find('.asenha-progress-checklist').html(checklistHtml);

			// Reset circular progress
			$progress.find('.asenha-circle-progress').attr('stroke-dasharray', '0, 100').removeClass('completed failed');
			$progress.find('.asenha-progress-percent').text('0%');

			// Reset time display
			$progress.find('.asenha-time-elapsed .asenha-time-value').text('0s');
			$progress.find('.asenha-time-remaining .asenha-time-value').text('--');
			$progress.find('.asenha-time-remaining').show(); // Ensure it's visible for new operation

			// Store start time
			this.startTime = Date.now();

			// Reset completed step stats
			this.migrationCompletedStats = {};
			this.previousMigrationStep = null;
			this.lastMigrationExtractionSize = 0;
			this.lastMigrationFilesTotal = 0;
			this.lastMigrationTablesTotal = 0;
			this.lastMigrationRowsTotal = 0;
			this.lastMigrationManifestRowCount = 0;
			this.lastMigrationSearchReplaceStats = null;
			this.lastMigrationSubProgress = null;
			this._migrationDbRunnerAnnounced = false;
			this._migrationDbRunnerLastStaleWarnAt = 0;
			this._migrationDbRunnerUrl = null;
			this._migrationDbRunnerToken = null;
			this._migrationDbRunnerLastUpdate = 0;
			this._migrationDbRunnerLastUpdateSeenAt = 0;
			this._migrationDbRunnerLastKickAttemptAt = 0;
			this._migrationDbRunnerLastDirectAttemptAt = 0;
			this._migrationInvalidFinalStateWarned = false;

			// Start time update interval
			this.startTimeUpdater($progress);
		},

		/**
		 * Emit a one-time console marker when the Migration DB runner is detected.
		 *
		 * Note: The runner does NOT use WordPress bootstrap, so the browser can only infer
		 * runner activity from the migration state payloads that the UI polls.
		 *
		 * @since 8.7.0
		 *
		 * @param jQuery $progress Progress container. Kept for backwards compatibility.
		 * @param Object state Migration state.
		 * @param string pollMode One of: 'auth', 'noauth', 'static'.
		 */
		maybeReportMigrationDbRunner: function($progress, state, pollMode) {
			if (!$progress || !state || typeof state !== 'object') {
				return;
			}

			var inDatabaseStep = (state.current_step === 'database');
			var isRunnerActive = false;

			// Auth/noauth state can include db_runner_active; static JSON from runner includes db_runner=1.
			if (state.db_runner_active === true || state.db_runner_active === 1 || state.db_runner_active === '1') {
				isRunnerActive = true;
			} else if (state.db_runner === 1 || state.db_runner === '1') {
				isRunnerActive = true;
			}

			// Console marker (one-time per migration UI run).
			if (inDatabaseStep && isRunnerActive && !this._migrationDbRunnerAnnounced) {
				this._migrationDbRunnerAnnounced = true;
				if (window.console && window.console.info) {
					var migrationId = this.currentMigrationId || state.id || '';
					var lastUpdate = (typeof state.last_update !== 'undefined') ? parseInt(state.last_update, 10) : 0;
					var currentTable = (state.sub_progress && state.sub_progress.current_table_name) ? String(state.sub_progress.current_table_name) : '';
					var current = (state.sub_progress && typeof state.sub_progress.current !== 'undefined') ? parseInt(state.sub_progress.current, 10) : null;
					var total = (state.sub_progress && typeof state.sub_progress.total !== 'undefined') ? parseInt(state.sub_progress.total, 10) : null;

					window.console.info(
						'ASE: Migration DB runner active',
						{
							migration_id: String(migrationId),
							poll_mode: String(pollMode || ''),
							last_update: isNaN(lastUpdate) ? null : lastUpdate,
							progress: (typeof state.progress !== 'undefined') ? parseInt(state.progress, 10) : null,
							table: currentTable,
							table_index: (isNaN(current) ? null : current),
							tables_total: (isNaN(total) ? null : total)
						}
					);
				}
			}

			// Stale heartbeat warning (throttled).
			if (inDatabaseStep && isRunnerActive) {
				var nowMs = Date.now ? Date.now() : (new Date()).getTime();
				var nowSec = Math.floor(nowMs / 1000);
				var lastUpdateSec = (typeof state.last_update !== 'undefined') ? parseInt(state.last_update, 10) : 0;
				if (!isNaN(lastUpdateSec) && lastUpdateSec > 0) {
					var age = nowSec - lastUpdateSec;
					if (age > 60) {
						var lastWarnAt = parseInt(this._migrationDbRunnerLastStaleWarnAt, 10) || 0;
						if ((nowMs - lastWarnAt) > 30000) {
							this._migrationDbRunnerLastStaleWarnAt = nowMs;
							if (window.console && window.console.warn) {
								window.console.warn('ASE: Migration DB runner heartbeat appears stale (>60s).', {
									age_seconds: age,
									poll_mode: String(pollMode || ''),
									last_update: lastUpdateSec
								});
							}
						}
					}
				}
			}
		},

		/**
		 * Poll migration progress
		 *
		 * Uses separate functions for authenticated, noauth, and static endpoints.
		 * After database import invalidates the session, switches to noauth endpoint.
		 * If admin-ajax.php becomes completely unavailable (database tables being replaced),
		 * switches to polling the static JSON file directly.
		 *
		 * @since 8.7.0
		 * Added static JSON polling fallback for database import resilience.
		 */
		pollMigrationProgress: function() {
			if (!this.currentMigrationId) {
				return;
			}

			var self = this;
			var useNoAuth = false;
			var useStatic = false;
			var consecutiveErrors = 0;
			var inDatabaseStep = false;
			var staticUrl = this.currentMigrationPublicProgressUrl || this.getMigrationPublicProgressUrl(this.currentMigrationId);
			var kickThrottleMs = 15000; // 15s between keepalive attempts (server kick).
			var directThrottleMs = 30000; // 30s between direct runner pings.
			var staleThresholdMs = 60000; // 60s with no last_update change => treat as stale.
			var warnedAboutPollingIssues = false;
			var migrationProgressReadWarning = 'Unable to read migration progress right now. The migration may still be running. If this persists, reload the page and check your server error log.';
			var migrationProgressReadFailed = 'Migration progress could not be read for several minutes. The migration may have stopped. Please reload the page, check your server error log, and retry if needed.';

			/**
			 * Check if error indicates database tables are unavailable
			 * This happens during database import when core tables are being replaced
			 */
			var looksLikeTablesUnavailable = function(text) {
				if (!text) {
					return false;
				}
				return String(text).indexOf('One or more database tables are unavailable') !== -1;
			};

			/**
			 * Determine if static polling should be preferred after repeated endpoint failures.
			 *
			 * @return {boolean}
			 */
			var shouldSwitchToStaticFromErrors = function() {
				if (!staticUrl || useStatic) {
					return false;
				}
				// Switch faster during DB step, but also allow fallback before DB when auth/noauth endpoints
				// are unstable for several polls.
				var threshold = inDatabaseStep ? 3 : 5;
				return consecutiveErrors >= threshold;
			};

			/**
			 * Determine terminal polling-failure threshold.
			 *
			 * @return {number}
			 */
			var getPollingFailureThreshold = function() {
				return inDatabaseStep ? 1200 : 180;
			};

			/**
			 * Handle migration polling errors consistently.
			 *
			 * @param {Object=} options
			 * @param {boolean=} options.allowStaticSwitch
			 * @return {boolean} True when a terminal action was taken.
			 */
			var handleMigrationPollingError = function(options) {
				options = options || {};
				var allowStaticSwitch = (options.allowStaticSwitch !== false);
				consecutiveErrors++;

				if (allowStaticSwitch && shouldSwitchToStaticFromErrors()) {
					useStatic = true;
					doPollStatic();
					return true;
				}

				if (consecutiveErrors >= 30 && !warnedAboutPollingIssues) {
					warnedAboutPollingIssues = true;
					if (typeof self.showNotice === 'function') {
						self.showNotice('warning', migrationProgressReadWarning);
					}
				}

				if (consecutiveErrors >= getPollingFailureThreshold()) {
					self.migrationProgressUnavailable(migrationProgressReadFailed);
					return true;
				}

				return false;
			};

			/**
			 * Best-effort keepalive for the Migration DB runner.
			 *
			 * Strategy:
			 * 1) Call a noauth AJAX endpoint that triggers a server-side runner spawn.
			 * 2) If we have the runner URL + token, also attempt a direct GET fallback.
			 *
			 * @param {Object} state Migration state object (may be static or full).
			 * @param {string} pollMode One of: 'auth', 'noauth', 'static'.
			 */
			var maybeKeepaliveDbRunner = function(state, pollMode) {
				if (!state || typeof state !== 'object') {
					return;
				}

				if (state.current_step !== 'database') {
					return;
				}

				// Only keepalive when runner appears active.
				var runnerActive = false;
				if (state.db_runner_active === true || state.db_runner_active === 1 || state.db_runner_active === '1') {
					runnerActive = true;
				} else if (state.db_runner === 1 || state.db_runner === '1') {
					runnerActive = true;
				}
				if (!runnerActive) {
					return;
				}

				var lastUpdate = (typeof state.last_update !== 'undefined') ? parseInt(state.last_update, 10) : 0;
				if (!lastUpdate || isNaN(lastUpdate)) {
					return;
				}

				// Track runner URL/token when available (only in auth/noauth payloads).
				if (state.db_runner_url && state.db_runner_token) {
					self._migrationDbRunnerUrl = String(state.db_runner_url);
					self._migrationDbRunnerToken = String(state.db_runner_token);
				}

				// Update stale-tracking markers.
				var nowMs = Date.now ? Date.now() : (new Date()).getTime();
				if (!self._migrationDbRunnerLastUpdate || self._migrationDbRunnerLastUpdate !== lastUpdate) {
					self._migrationDbRunnerLastUpdate = lastUpdate;
					self._migrationDbRunnerLastUpdateSeenAt = nowMs;
					return;
				}

				// Same last_update observed; consider keepalive if stale threshold exceeded.
				var lastSeenAt = parseInt(self._migrationDbRunnerLastUpdateSeenAt, 10) || 0;
				if (!lastSeenAt) {
					self._migrationDbRunnerLastUpdateSeenAt = nowMs;
					return;
				}

				var ageMs = nowMs - lastSeenAt;
				if (ageMs < staleThresholdMs) {
					return;
				}

				// Throttle server-side kick attempts.
				var lastKickAt = parseInt(self._migrationDbRunnerLastKickAttemptAt, 10) || 0;
				if ((nowMs - lastKickAt) >= kickThrottleMs) {
					self._migrationDbRunnerLastKickAttemptAt = nowMs;
					$.ajax({
						url: asenhaSiteBackup.ajaxUrl,
						type: 'POST',
						data: {
							action: 'asenha_kick_migration_db_runner_noauth',
							migration_id: self.currentMigrationId
						}
					});
				}

				// Direct runner ping fallback (helps when server loopback is blocked).
				// Only attempt if we have previously captured a runner URL+token.
				var runnerUrl = self._migrationDbRunnerUrl ? String(self._migrationDbRunnerUrl) : '';
				var runnerToken = self._migrationDbRunnerToken ? String(self._migrationDbRunnerToken) : '';
				if (runnerUrl && runnerToken) {
					var lastDirectAt = parseInt(self._migrationDbRunnerLastDirectAttemptAt, 10) || 0;
					if ((nowMs - lastDirectAt) >= directThrottleMs) {
						self._migrationDbRunnerLastDirectAttemptAt = nowMs;

						// Build the runner URL with required query args.
						var sep = (runnerUrl.indexOf('?') === -1) ? '?' : '&';
						var url = runnerUrl + sep
							+ 'asenha_action=migration_db'
							+ '&migration_id=' + encodeURIComponent(self.currentMigrationId)
							+ '&token=' + encodeURIComponent(runnerToken)
							+ '&t=' + encodeURIComponent(String(Date.now()));

						$.ajax({
							url: url,
							type: 'GET',
							cache: false,
							timeout: 5000
						});
					}
				}
			};

			/**
			 * Detect when the general migration worker (files, sync-delete, search/replace)
			 * appears stuck because the loopback continuation request failed, and re-kick it
			 * via the noauth AJAX handler.
			 *
			 * Modeled on maybeKeepaliveDbRunner() but targets non-database steps.
			 *
			 * @since 8.7.0
			 *
			 * @param {Object} state    Migration state from the poller.
			 * @param {string} pollMode Current poll mode ('auth', 'noauth', 'static').
			 */
			var workerKickThrottleMs = 15000; // 15s between worker kick attempts.
			var workerStaleThresholdMs = 30000; // 30s with no last_update change => treat as stale worker.
			var maybeKeepaliveMigrationWorker = function(state, pollMode) {
				if (!state || typeof state !== 'object') {
					return;
				}

				var step = state.current_step || '';

				// Only target non-database, non-final steps (the DB runner has its own keepalive).
				var skipSteps = ['database', 'completed', 'failed', 'cancelled', 'redirect', ''];
				var shouldSkip = false;
				for (var i = 0; i < skipSteps.length; i++) {
					if (step === skipSteps[i]) {
						shouldSkip = true;
						break;
					}
				}
				if (shouldSkip) {
					return;
				}

				var lastUpdate = (typeof state.last_update !== 'undefined') ? parseInt(state.last_update, 10) : 0;
				if (!lastUpdate || isNaN(lastUpdate)) {
					return;
				}

				// Update stale-tracking markers.
				var nowMs = Date.now ? Date.now() : (new Date()).getTime();
				if (!self._migrationWorkerLastUpdate || self._migrationWorkerLastUpdate !== lastUpdate) {
					self._migrationWorkerLastUpdate = lastUpdate;
					self._migrationWorkerLastUpdateSeenAt = nowMs;
					return;
				}

				// Same last_update observed; consider keepalive if stale threshold exceeded.
				var lastSeenAt = parseInt(self._migrationWorkerLastUpdateSeenAt, 10) || 0;
				if (!lastSeenAt) {
					self._migrationWorkerLastUpdateSeenAt = nowMs;
					return;
				}

				var ageMs = nowMs - lastSeenAt;
				if (ageMs < workerStaleThresholdMs) {
					return;
				}

				// Throttle kick attempts.
				var lastKickAt = parseInt(self._migrationWorkerLastKickAttemptAt, 10) || 0;
				if ((nowMs - lastKickAt) >= workerKickThrottleMs) {
					self._migrationWorkerLastKickAttemptAt = nowMs;
					$.ajax({
						url: asenhaSiteBackup.ajaxUrl,
						type: 'POST',
						data: {
							action: 'asenha_kick_migration_worker_noauth',
							migration_id: self.currentMigrationId
						}
					});
				}
			};

			/**
			 * Handle successful state response
			 */
			var handleStateResponse = function(state, pollMode) {
				var $progress = $('.asenha-migration-progress');
				var currentStep = state.current_step || 'preparing';
				var maybeStaticUrl = (state && state.public_progress_url) ? String(state.public_progress_url) : '';

				// Reset error counter on success
				consecutiveErrors = 0;
				warnedAboutPollingIssues = false;

				// Refresh static URL whenever backend provides one.
				if (maybeStaticUrl) {
					staticUrl = maybeStaticUrl;
					self.currentMigrationPublicProgressUrl = maybeStaticUrl;
					if (self.currentMigrationId) {
						self.saveMigrationPublicProgressUrl(self.currentMigrationId, maybeStaticUrl);
					}
				}

				// Proactively switch to noauth when entering database step
				// This prevents session invalidation issues when wp_options is imported
				if (currentStep === 'database' && !inDatabaseStep) {
					inDatabaseStep = true;
					useNoAuth = true;
				}

				// Proactively keep the standalone DB runner alive during the database step.
				// This mitigates hosts where the runner's self-spawn loopback fails.
				maybeKeepaliveDbRunner(state, pollMode);

				// Proactively keep the general migration worker alive during file/search-replace
				// phases. This mitigates hosts where the loopback continuation request fails.
				maybeKeepaliveMigrationWorker(state, pollMode);

				self.maybeReportMigrationDbRunner($progress, state, pollMode);
				self.updateMigrationProgress($progress, state);

				if (state.status === 'completed' || state.current_step === 'redirect') {
					if (self.isValidMigrationFinalState(state)) {
						self.migrationCompleted(state);
					} else if (!self._migrationInvalidFinalStateWarned) {
						self._migrationInvalidFinalStateWarned = true;
						if (typeof self.showNotice === 'function') {
							self.showNotice(
								'warning',
								'A migration completion signal was received without a verifiable final state. Continuing to poll.'
							);
						}
					}
				} else if (state.status === 'failed') {
					self.migrationFailed(state.error || state.message);
				}
			};

			/**
			 * Poll static JSON file directly (no WordPress/admin-ajax involved)
			 * Used when admin-ajax.php is completely unavailable during DB import
			 */
			var doPollStatic = function() {
				if (!self.currentMigrationId || !staticUrl) {
					// Fall back to noauth if no static URL
					doPollNoAuth();
					return;
				}
			
				var url = staticUrl;
				url += (url.indexOf('?') === -1 ? '?' : '&') + 't=' + Date.now();

				$.ajax({
					url: url,
					type: 'GET',
					dataType: 'json',
					cache: false,
					success: function(state) {
						if (state && typeof state === 'object') {
							handleStateResponse(state, 'static');
							return;
						}
						handleMigrationPollingError({ allowStaticSwitch: false });
					},
					error: function(xhr) {
						// If static file is blocked/404, keep trying longer, but do not assume success.
						handleMigrationPollingError({ allowStaticSwitch: false });
					}
				});
			};

			/**
			 * Poll using noauth endpoint (file-based state)
			 * Used when normal authenticated endpoint fails after DB import
			 */
			var doPollNoAuth = function() {
				if (!self.currentMigrationId) {
					return;
				}

				// If we've switched to static mode, use that
				if (useStatic) {
					doPollStatic();
					return;
				}

				// Switch to static polling after repeated endpoint failures, even if database step
				// has not been observed yet.
				if (shouldSwitchToStaticFromErrors()) {
					useStatic = true;
					doPollStatic();
					return;
				}

				$.ajax({
					url: asenhaSiteBackup.ajaxUrl,
					type: 'POST',
					data: {
						action: 'asenha_get_migration_progress_noauth',
						migration_id: self.currentMigrationId
					},
					success: function(response) {
						// Some hosts return HTML error page with status 200 during DB import
						if (typeof response === 'string' && looksLikeTablesUnavailable(response)) {
							useStatic = true;
							doPollStatic();
							return;
						}
						if (response.success) {
							handleStateResponse(response.data, 'noauth');
						} else {
							// If we got a database tables unavailable error, switch to static polling
							if (response && response.data && response.data.message && looksLikeTablesUnavailable(response.data.message) && staticUrl) {
								useStatic = true;
								doPollStatic();
								return;
							}
							if (handleMigrationPollingError()) {
								return;
							}
						}
					},
					error: function(xhr) {
						// If WordPress can't access core tables, admin-ajax will fail
						// Switch to static polling when available
						if (staticUrl && xhr && looksLikeTablesUnavailable(xhr.responseText)) {
							useStatic = true;
							doPollStatic();
							return;
						}
						if (handleMigrationPollingError()) {
							return;
						}
					}
				});
			};

			/**
			 * Single poll request (authenticated)
			 */
			var doPoll = function() {
				if (!self.currentMigrationId) {
					return;
				}

				// If we've switched to static mode, use that
				if (useStatic) {
					doPollStatic();
					return;
				}

				// If we've switched to noauth mode, use that endpoint
				if (useNoAuth) {
					doPollNoAuth();
					return;
				}

				$.ajax({
					url: asenhaSiteBackup.ajaxUrl,
					type: 'POST',
					data: {
						action: 'asenha_get_migration_progress',
						nonce: asenhaSiteBackup.nonce,
						migration_id: self.currentMigrationId
					},
					success: function(response) {
						if (response.success) {
							handleStateResponse(response.data, 'auth');
						} else {
							// Some hosts return DB-tables-unavailable error before auth is invalidated
							if (staticUrl && response && response.data && response.data.message && looksLikeTablesUnavailable(response.data.message)) {
								useStatic = true;
								doPollStatic();
								return;
							}
							// Auth or permission error - switch to noauth endpoint
							handleMigrationPollingError({ allowStaticSwitch: false });
							if (consecutiveErrors >= 2) {
								useNoAuth = true;
								doPollNoAuth();
							}
						}
					},
					error: function(xhr) {
						// If WordPress can't access core tables, admin-ajax will fail
						// Switch to static polling when available
						if (staticUrl && xhr && looksLikeTablesUnavailable(xhr.responseText)) {
							useStatic = true;
							doPollStatic();
							return;
						}
						// Switch to noauth after 2 consecutive errors
						handleMigrationPollingError({ allowStaticSwitch: false });
						if (consecutiveErrors >= 2) {
							useNoAuth = true;
							doPollNoAuth();
						}
					}
				});
			};

			// Poll immediately
			doPoll();

			// Then poll every second
			this.progressInterval = setInterval(doPoll, 1000);
		},

		// Store migration completed step stats
		migrationCompletedStats: {},

		// Track previous migration step for detecting transitions
		previousMigrationStep: null,

		// Track last known extraction size for migration
		lastMigrationExtractionSize: 0,

		// Track final stats for migration steps (used at completion)
		lastMigrationFilesTotal: 0,
		lastMigrationTablesTotal: 0,
		lastMigrationRowsTotal: 0,
		lastMigrationManifestRowCount: 0, // From database_stats.total_rows - more reliable than tracking during import
		lastMigrationSearchReplaceStats: null,

		// Track last known sub_progress for migration (used when state updates are incomplete)
		lastMigrationSubProgress: null,

		/**
		 * Update migration progress display
		 */
		updateMigrationProgress: function($progress, state) {
			var percent = state.progress || 0;
			var currentStep = state.current_step || 'preparing';

			// Migration no longer has a separate 'redirect' checkpoint; treat it as finalizing.
			// This keeps UI stable for in-flight migrations that may still emit 'redirect' from older code/runner scripts.
			if (currentStep === 'redirect') {
				currentStep = 'cleanup';
			}

			// Update circular progress
			$progress.find('.asenha-circle-progress').attr('stroke-dasharray', percent + ', 100');
			$progress.find('.asenha-progress-percent').text(percent + '%');

			// Determine steps
			var components = this.currentMigrationComponents || ['all'];
			var steps;
			if (components.indexOf('all') !== -1) {
				steps = this.migrationSteps.full;
			} else if (components.indexOf('database') !== -1 && components.length === 1) {
				steps = this.migrationSteps.database;
			} else if (components.indexOf('database') === -1) {
				steps = this.migrationSteps.files;
			} else {
				steps = this.migrationSteps.full;
			}

			var currentIndex = steps.indexOf(currentStep);
			if (currentIndex === -1) {
				currentIndex = 0;
			}

			var self = this;

			// Store completion stats when a step completes with 'done' label
			if (state.sub_progress && state.sub_progress.label === 'done') {
				this.migrationCompletedStats[currentStep] = state.sub_progress;
				// Also update tracked values from the 'done' state for fallback
				if (currentStep === 'database') {
					if (state.sub_progress.tables_imported > 0) {
						this.lastMigrationTablesTotal = state.sub_progress.tables_imported;
					}
					if (state.sub_progress.rows_imported > 0) {
						this.lastMigrationRowsTotal = state.sub_progress.rows_imported;
					}
				}
			}

			// Track extraction total size for fallback
			if (currentStep === 'extracting' && state.sub_progress && state.sub_progress.total_size > 0) {
				this.lastMigrationExtractionSize = state.sub_progress.total_size;
			}

			// Track total files during files import step (always use 'total' which is the full count)
			if (currentStep === 'files' && state.sub_progress) {
				if (state.sub_progress.total > 0) {
					this.lastMigrationFilesTotal = state.sub_progress.total;
				} else if (state.sub_progress.total_files > 0) {
					this.lastMigrationFilesTotal = state.sub_progress.total_files;
				}
			}

			// Track total tables and rows during database import step (always use 'total' which is the full count)
			if (currentStep === 'database' && state.sub_progress) {
				if (state.sub_progress.total > 0) {
					this.lastMigrationTablesTotal = state.sub_progress.total;
				} else if (state.sub_progress.total_tables > 0) {
					this.lastMigrationTablesTotal = state.sub_progress.total_tables;
				}
				// Track rows imported
				if (state.sub_progress.rows_imported > 0) {
					this.lastMigrationRowsTotal = state.sub_progress.rows_imported;
				}
			}

			// Capture pre-analyzed database stats (more reliable than tracking during import)
			// Store manifest row count separately - it's the most reliable value at completion
			if (state.database_stats && state.database_stats.total_rows > 0) {
				this.lastMigrationManifestRowCount = state.database_stats.total_rows;
				// Also update lastMigrationRowsTotal as a fallback
				this.lastMigrationRowsTotal = state.database_stats.total_rows;
			}
		// Capture pre-analyzed table count too (needed when DB step is very fast and UI may jump to redirect).
		if (state.database_stats && state.database_stats.total_tables > 0) {
			this.lastMigrationTablesTotal = parseInt(state.database_stats.total_tables, 10) || this.lastMigrationTablesTotal;
		}

		// If we jumped straight to finalizing with a DB summary payload, ensure the database checkpoint
		// gets a summary even if we never observed an intermediate 'database' poll.
		if (
			currentStep === 'cleanup'
			&& state.sub_progress
			&& state.sub_progress.label === 'done'
			&& (state.sub_progress.tables_imported > 0 || this.lastMigrationTablesTotal > 0)
			&& !this.migrationCompletedStats['database']
		) {
			var tablesImported = state.sub_progress.tables_imported || this.lastMigrationTablesTotal || 0;
			var rowsImported = this.lastMigrationManifestRowCount || state.sub_progress.rows_imported || this.lastMigrationRowsTotal || 0;
			if (tablesImported > 0) {
				this.migrationCompletedStats['database'] = {
					label: 'done',
					tables_imported: tablesImported,
					rows_imported: rowsImported
				};
				if (state.sub_progress.collation_remap_count > 0) {
					this.migrationCompletedStats['database'].collation_remap_count = parseInt(state.sub_progress.collation_remap_count, 10) || 0;
					this.migrationCompletedStats['database'].collation_remap_target = state.sub_progress.collation_remap_target || '';
				}
			}
		}

			// Track search/replace stats - check dedicated field first (persists across steps), then sub_progress
			if (state.search_replace_stats) {
				this.lastMigrationSearchReplaceStats = {
					url_replacements: state.search_replace_stats.url_replacements || 0,
					path_replacements: state.search_replace_stats.path_replacements || 0,
					serialized_fixes: state.search_replace_stats.serialized_fixes || 0
				};
				// Also store in completedStats immediately when we have the dedicated field
				if (!this.migrationCompletedStats['search_replace']) {
					this.migrationCompletedStats['search_replace'] = this.lastMigrationSearchReplaceStats;
				}
			} else if (currentStep === 'search_replace' && state.sub_progress) {
				if (state.sub_progress.url_replacements !== undefined || state.sub_progress.path_replacements !== undefined) {
					this.lastMigrationSearchReplaceStats = {
						url_replacements: state.sub_progress.url_replacements || 0,
						path_replacements: state.sub_progress.path_replacements || 0,
						serialized_fixes: state.sub_progress.serialized_fixes || 0
					};
				}
			}

			// Detect step transition - if step changed, store stats for the previous step
			if (this.previousMigrationStep && this.previousMigrationStep !== currentStep) {
			// Step changed from extracting - check if we have stats stored
			if (this.previousMigrationStep === 'extracting' && !this.migrationCompletedStats['extracting']) {
				if (this.lastMigrationSubProgress && this.lastMigrationSubProgress.done_summary) {
					this.migrationCompletedStats['extracting'] = {
						label: 'done',
						done_summary: this.lastMigrationSubProgress.done_summary
					};
				} else if (this.lastMigrationExtractionSize > 0) {
					this.migrationCompletedStats['extracting'] = {
						label: 'done',
						total_size: this.lastMigrationExtractionSize
					};
				}
			}
				// Step changed from files - store files total
				if (this.previousMigrationStep === 'files' && !this.migrationCompletedStats['files']) {
					if (this.lastMigrationFilesTotal > 0) {
						this.migrationCompletedStats['files'] = {
							label: 'done',
							files_imported: this.lastMigrationFilesTotal
						};
					}
				}
				// Step changed from database - store tables and rows total
				if (this.previousMigrationStep === 'database' && !this.migrationCompletedStats['database']) {
					if (this.lastMigrationTablesTotal > 0) {
						this.migrationCompletedStats['database'] = {
							label: 'done',
							tables_imported: this.lastMigrationTablesTotal,
							rows_imported: this.lastMigrationRowsTotal
						};
					}
				}
				// Step changed from search_replace - store search/replace stats
				if (this.previousMigrationStep === 'search_replace' && !this.migrationCompletedStats['search_replace']) {
					if (this.lastMigrationSearchReplaceStats) {
						this.migrationCompletedStats['search_replace'] = {
							label: 'done',
							url_replacements: this.lastMigrationSearchReplaceStats.url_replacements,
							path_replacements: this.lastMigrationSearchReplaceStats.path_replacements,
							serialized_fixes: this.lastMigrationSearchReplaceStats.serialized_fixes
						};
					}
				}

				// --- Step-jump detection ---
				// When the poller misses intermediate steps (e.g. jumps from 'extracting' to
				// 'database'), retroactively populate best-effort stats for every skipped step
				// so that the UI can render them as completed with a summary instead of blank.
				var prevIdx = steps.indexOf(this.previousMigrationStep);
				if (prevIdx !== -1 && currentIndex > prevIdx + 1) {
					for (var skippedIdx = prevIdx + 1; skippedIdx < currentIndex; skippedIdx++) {
						var skippedStep = steps[skippedIdx];
						if (this.migrationCompletedStats[skippedStep]) {
							continue; // Already populated by an earlier check or state payload.
						}

						if (skippedStep === 'extracting') {
							if (this.lastMigrationExtractionSize > 0) {
								this.migrationCompletedStats['extracting'] = {
									label: 'done',
									total_size: this.lastMigrationExtractionSize
								};
							} else {
								this.migrationCompletedStats['extracting'] = { label: 'done' };
							}
						} else if (skippedStep === 'files') {
							if (this.lastMigrationFilesTotal > 0) {
								this.migrationCompletedStats['files'] = {
									label: 'done',
									files_imported: this.lastMigrationFilesTotal
								};
							} else if (state.files_step_stats && state.files_step_stats.total_files > 0) {
								this.migrationCompletedStats['files'] = {
									label: 'done',
									files_imported: state.files_step_stats.total_files
								};
							} else {
								this.migrationCompletedStats['files'] = { label: 'done' };
							}
						} else if (skippedStep === 'search_replace') {
							if (this.lastMigrationSearchReplaceStats) {
								this.migrationCompletedStats['search_replace'] = {
									label: 'done',
									url_replacements: this.lastMigrationSearchReplaceStats.url_replacements || 0,
									path_replacements: this.lastMigrationSearchReplaceStats.path_replacements || 0,
									serialized_fixes: this.lastMigrationSearchReplaceStats.serialized_fixes || 0
								};
							} else if (state.search_replace_stats) {
								this.migrationCompletedStats['search_replace'] = {
									label: 'done',
									url_replacements: state.search_replace_stats.url_replacements || 0,
									path_replacements: state.search_replace_stats.path_replacements || 0,
									serialized_fixes: state.search_replace_stats.serialized_fixes || 0
								};
							} else if (state.search_replace_step_stats) {
								this.migrationCompletedStats['search_replace'] = {
									label: 'done',
									url_replacements: state.search_replace_step_stats.url_replacements || 0,
									path_replacements: state.search_replace_step_stats.path_replacements || 0,
									serialized_fixes: state.search_replace_step_stats.serialized_fixes || 0
								};
							} else {
								this.migrationCompletedStats['search_replace'] = { label: 'done' };
							}
						} else if (skippedStep === 'database') {
							if (this.lastMigrationTablesTotal > 0) {
								this.migrationCompletedStats['database'] = {
									label: 'done',
									tables_imported: this.lastMigrationTablesTotal,
									rows_imported: this.lastMigrationRowsTotal || 0
								};
							} else {
								this.migrationCompletedStats['database'] = { label: 'done' };
							}
						} else {
							this.migrationCompletedStats[skippedStep] = { label: 'done' };
						}
					}
				}
			}

			// Track the current sub_progress for this step (only when it has meaningful data)
			if (state.sub_progress && (state.sub_progress.label || state.sub_progress.current > 0)) {
				this.lastMigrationSubProgress = state.sub_progress;
			}

			// Update previous step tracker
			this.previousMigrationStep = currentStep;

			// Get sub_progress - prefer current state, fall back to last known good
			var subProgress = (state.sub_progress && (state.sub_progress.label || state.sub_progress.current > 0)) 
				? state.sub_progress 
				: this.lastMigrationSubProgress;

			// Update checkpoint states
			$progress.find('.asenha-checkpoint').each(function() {
				var $checkpoint = $(this);
				var step = $checkpoint.data('step');
				var stepIndex = steps.indexOf(step);
				var $subLabel = $checkpoint.find('.asenha-checkpoint-sub');

				$checkpoint.removeClass('pending in-progress completed');

				if (stepIndex < currentIndex) {
					$checkpoint.addClass('completed');
					// Show completion stats for completed steps (not final completion, so isOperationComplete=false)
					// Only update if we have stats - preserve existing text if no stats available
					var statsText = self.formatMigrationCompletedStats(step, false);
					if (statsText) {
						$subLabel.text(statsText);
					}
				} else if (stepIndex === currentIndex) {
					$checkpoint.addClass('in-progress');
					// Only update sub-label when we have meaningful sub_progress (like restore does)
					if (subProgress && subProgress.label) {
						var subText = self.formatSubProgress(step, subProgress);
						$subLabel.text(subText);
					}
					// Don't clear sub-label if no subProgress - keep existing value
				} else {
					$checkpoint.addClass('pending');
					$subLabel.text('');
				}
			});
		},

		/**
		 * Format completion stats for completed migration steps
		 *
		 * @param {string} step Step name.
		 * @return {string} Formatted completion stats text.
		 */
		formatMigrationCompletedStats: function(step, isOperationComplete) {
			if (!asenhaSiteBackup.subProgress) {
				return '';
			}

			var stats = this.migrationCompletedStats[step];

			switch (step) {
			case 'extracting':
				if (stats && stats.done_summary) {
					return String(stats.done_summary);
				}
				if (stats && stats.total_size && stats.total_size > 0) {
					return asenhaSbP('extractionComplete')
						.replace('%s', this.formatBytes(stats.total_size));
				}
				// Always show at least "Done" for completed extracting step to prevent
				// stale in-progress text from being preserved when stats were missed.
				return asenhaSbP('done');

			case 'files':
				// Check stored stats first
					if (stats) {
						var filesCount = stats.files_imported || stats.total_files;
						if (filesCount && filesCount > 0) {
							return asenhaSiteBackup.subProgress.filesImported
								.replace('%d', this.formatNumber(filesCount));
						}
					}
					// Fallback to tracked total (most reliable at completion)
					if (this.lastMigrationFilesTotal > 0) {
						return asenhaSiteBackup.subProgress.filesImported
							.replace('%d', this.formatNumber(this.lastMigrationFilesTotal));
					}
					return '';

				case 'search_replace':
					// Check stored stats first
					if (stats && (stats.url_replacements !== undefined || stats.path_replacements !== undefined)) {
						var urlReplacements = stats.url_replacements || 0;
						var pathReplacements = stats.path_replacements || 0;
						var fixes = stats.serialized_fixes || 0;
						return asenhaSiteBackup.subProgress.searchReplaceStats
							.replace('%1$s', this.formatNumber(urlReplacements))
							.replace('%2$s', this.formatNumber(pathReplacements))
							.replace('%3$s', this.formatNumber(fixes));
					}
					// Fallback to tracked stats
					if (this.lastMigrationSearchReplaceStats) {
						var srStats = this.lastMigrationSearchReplaceStats;
						var urlReplacements = srStats.url_replacements || 0;
						var pathReplacements = srStats.path_replacements || 0;
						var fixes = srStats.serialized_fixes || 0;
						return asenhaSiteBackup.subProgress.searchReplaceStats
							.replace('%1$s', this.formatNumber(urlReplacements))
							.replace('%2$s', this.formatNumber(pathReplacements))
							.replace('%3$s', this.formatNumber(fixes));
					}
					// Show 'Done' only at operation completion when no stats available
					return isOperationComplete ? asenhaSbP('done') : '';

				case 'database':
					// Check stored stats first - prefer manifest row count when available
					if (stats && stats.tables_imported && stats.tables_imported > 0) {
						// Use manifest row count (from database_stats.total_rows) when available,
						// as it's more reliable than the incrementally tracked rows_imported
						var rowsImported = this.lastMigrationManifestRowCount || stats.rows_imported || 0;
						return this.appendCollationRemapNote(
							asenhaSiteBackup.subProgress.tablesImported
								.replace('%1$d', stats.tables_imported)
								.replace('%2$s', this.formatNumber(rowsImported)),
							stats
						);
					}
					// Fallback to tracked total - prefer manifest row count
					if (this.lastMigrationTablesTotal > 0) {
						var rowCount = this.lastMigrationManifestRowCount || this.lastMigrationRowsTotal || 0;
						return this.appendCollationRemapNote(
							asenhaSiteBackup.subProgress.tablesImported
								.replace('%1$d', this.lastMigrationTablesTotal)
								.replace('%2$s', this.formatNumber(rowCount)),
							stats || {}
						);
					}
					return '';

				case 'cleanup':
					// Show 'Done' only at operation completion
					return isOperationComplete ? asenhaSbP('done') : '';

				case 'redirect':
					// Show 'Done' only at operation completion
					return isOperationComplete ? asenhaSbP('done') : '';

				default:
					return '';
			}
		},

		/**
		 * Validate whether a migration state is safely final.
		 *
		 * @param {Object} state Migration state payload.
		 * @return {boolean}
		 */
		isValidMigrationFinalState: function(state) {
			if (!state || typeof state !== 'object') {
				return false;
			}

			var status = String(state.status || '');
			var currentStep = String(state.current_step || '');
			var progress = parseInt(state.progress, 10);
			if (isNaN(progress)) {
				progress = 0;
			}

			var finalized = (
				state.finalized === true ||
				state.finalized === 1 ||
				state.finalized === '1' ||
				state.is_finalized === true ||
				state.is_finalized === 1 ||
				state.is_finalized === '1'
			);

			if (status === 'completed' && finalized) {
				return true;
			}

			// Backward-compatible fallback for older payloads that may not include `finalized`.
			if (status === 'completed' && (currentStep === 'cleanup' || currentStep === 'completed' || currentStep === 'redirect') && progress >= 100) {
				return true;
			}

			if (currentStep === 'redirect' && progress >= 100) {
				return true;
			}

			return false;
		},

		/**
		 * Migration completed - show redirect countdown
		 */
		migrationCompleted: function(state) {
			clearInterval(this.progressInterval);
			clearInterval(this.timeInterval);

			// Capture migration ID before clearing state so we can trigger best-effort cleanup.
			var migrationId = this.currentMigrationId;

			if (this.currentMigrationId) {
				this.clearProgress(this.currentMigrationId);
				this.clearMigrationPublicProgressUrl(this.currentMigrationId);
			}
			this.currentMigrationId = null;
			this.currentMigrationPublicProgressUrl = null;
			this.currentMigrationFilename = null;

			var self = this;
			var $progress = $('.asenha-migration-progress');

			// Store any missing stats from tracked values before updating UI
			if (!this.migrationCompletedStats['files'] && this.lastMigrationFilesTotal > 0) {
				this.migrationCompletedStats['files'] = { files_imported: this.lastMigrationFilesTotal };
			}
			if (!this.migrationCompletedStats['database'] && this.lastMigrationTablesTotal > 0) {
				// Prefer manifest row count (from database_stats.total_rows) as it's more reliable
				var rowCount = this.lastMigrationManifestRowCount || this.lastMigrationRowsTotal || 0;
				this.migrationCompletedStats['database'] = { tables_imported: this.lastMigrationTablesTotal, rows_imported: rowCount };
			}
			if (!this.migrationCompletedStats['search_replace'] && this.lastMigrationSearchReplaceStats) {
				this.migrationCompletedStats['search_replace'] = this.lastMigrationSearchReplaceStats;
			}

			// Mark all checkpoints as completed and set summaries
			$progress.find('.asenha-checkpoint').each(function() {
				var $checkpoint = $(this);
				var step = $checkpoint.data('step');
				var $subLabel = $checkpoint.find('.asenha-checkpoint-sub');
				
				$checkpoint.removeClass('pending in-progress').addClass('completed');
				
				// Get stats from formatMigrationCompletedStats (operation complete, so isOperationComplete=true)
				var statsText = self.formatMigrationCompletedStats(step, true);
				if (statsText) {
					$subLabel.text(statsText);
				}
			});

			// Update circular progress
			$progress.find('.asenha-circle-progress').attr('stroke-dasharray', '100, 100').addClass('completed');
			$progress.find('.asenha-progress-percent').text('100%');

			// Final time update
			this.updateTimeDisplay($progress);
			$progress.find('.asenha-time-remaining').hide();

			// Show completion UI with Reload Now button
			this.showCompletionUI($progress, 'migration');

			// Best-effort: request immediate cleanup now that the UI has a final state.
			// This complements the scheduled cleanup + plugins_loaded GC fallback.
			this.triggerMigrationCleanupNoAuth(migrationId);
		},

		/**
		 * Migration completed with reload (fallback when state is unavailable)
		 */
		migrationCompletedWithReload: function() {
			clearInterval(this.progressInterval);
			clearInterval(this.timeInterval);

			if (this.currentMigrationId) {
				this.clearProgress(this.currentMigrationId);
				this.clearMigrationPublicProgressUrl(this.currentMigrationId);
			}
			this.currentMigrationId = null;
			this.currentMigrationPublicProgressUrl = null;

			var self = this;
			var $progress = $('.asenha-migration-progress');
			
			// Store any missing stats from tracked values before updating UI
			if (!this.migrationCompletedStats['files'] && this.lastMigrationFilesTotal > 0) {
				this.migrationCompletedStats['files'] = { files_imported: this.lastMigrationFilesTotal };
			}
			if (!this.migrationCompletedStats['database'] && this.lastMigrationTablesTotal > 0) {
				// Prefer manifest row count (from database_stats.total_rows) as it's more reliable
				var rowCount = this.lastMigrationManifestRowCount || this.lastMigrationRowsTotal || 0;
				this.migrationCompletedStats['database'] = { tables_imported: this.lastMigrationTablesTotal, rows_imported: rowCount };
			}
			if (!this.migrationCompletedStats['search_replace'] && this.lastMigrationSearchReplaceStats) {
				this.migrationCompletedStats['search_replace'] = this.lastMigrationSearchReplaceStats;
			}
			
			// Mark all checkpoints as completed and set summaries
			$progress.find('.asenha-checkpoint').each(function() {
				var $checkpoint = $(this);
				var step = $checkpoint.data('step');
				var $subLabel = $checkpoint.find('.asenha-checkpoint-sub');
				
				$checkpoint.removeClass('pending in-progress').addClass('completed');
				
				// Get stats from formatMigrationCompletedStats (operation complete, so isOperationComplete=true)
				var statsText = self.formatMigrationCompletedStats(step, true);
				if (statsText) {
					$subLabel.text(statsText);
				}
			});
			
			$progress.find('.asenha-circle-progress').attr('stroke-dasharray', '100, 100').addClass('completed');
			$progress.find('.asenha-progress-percent').text('100%');
			
			// Hide remaining time section
			$progress.find('.asenha-time-remaining').hide();

			// Show completion UI with Reload Now button
			this.showCompletionUI($progress, 'migration');
		},

		/**
		 * Migration polling became unavailable.
		 *
		 * This is intentionally distinct from migrationFailed(): we could not verify
		 * backend completion/failure, so we must not mark success or trigger cleanup.
		 */
		migrationProgressUnavailable: function(message) {
			clearInterval(this.progressInterval);
			clearInterval(this.timeInterval);

			var $progress = $('.asenha-migration-progress');

			$progress.find('.asenha-checkpoint.in-progress').removeClass('in-progress').addClass('failed');
			$progress.find('.asenha-circle-progress').addClass('failed');
			$progress.find('.asenha-time-remaining').hide();

			var warningMessage = message || 'Migration progress is temporarily unavailable. Reload the page and check your server error log.';
			if (typeof this.showNotice === 'function') {
				this.showNotice('warning', warningMessage);
			}

			$progress.find('.asenha-checkpoint.failed .asenha-checkpoint-sub').first().text(
				'Progress unavailable. Reload page to continue.'
			);
		},

		/**
		 * Migration failed
		 */
		migrationFailed: function(message) {
			clearInterval(this.progressInterval);
			clearInterval(this.timeInterval);

			// Capture migration ID before clearing state so we can trigger best-effort cleanup.
			var migrationId = this.currentMigrationId;

			if (this.currentMigrationId) {
				this.clearProgress(this.currentMigrationId);
				this.clearMigrationPublicProgressUrl(this.currentMigrationId);
			}
			this.currentMigrationId = null;
			this.currentMigrationPublicProgressUrl = null;

			var $progress = $('.asenha-migration-progress');

			// Mark current step as failed
			$progress.find('.asenha-checkpoint.in-progress').removeClass('in-progress').addClass('failed');

			// Update circular progress
			$progress.find('.asenha-circle-progress').addClass('failed');

			$('#asenha-start-migration').prop('disabled', false);

			var fallback = asenhaSbT('migrationFailedGeneric') || asenhaSbT('migrationFailed');

			this.showNotice('error', message || fallback);

			// Best-effort: cleanup artifacts after failure once the UI has shown the error.
			this.triggerMigrationCleanupNoAuth(migrationId);
		},

		// =====================================================
		// Direct Transfer Methods
		// =====================================================

		/**
		 * Generate transfer key
		 */
		generateTransferKey: function(e) {
			e.preventDefault();

			var $button = $(e.currentTarget);
			$button.prop('disabled', true);

			// Hide any prior key display while choosing new settings.
			$('.asenha-transfer-key-display').hide();

			// Show the transfer template picker panel (mirrors Backup > Create behavior).
			this.showTransferTemplatePicker();
		},

		/**
		 * Show template picker panel for transfer key generation.
		 *
		 * @param {Object} opts Optional.
		 * @param {string} opts.selectedTemplateId Optional template id to preselect.
		 */
		showTransferTemplatePicker: function(opts) {
			var self = this;
			opts = opts || {};
			var selectedTemplateId = (typeof opts.selectedTemplateId !== 'undefined') ? String(opts.selectedTemplateId || '') : null;

			var $picker = $('#asenha-transfer-template-picker');
			if (!$picker.length) {
				$('#asenha-generate-transfer-key').prop('disabled', false);
				return;
			}

			var $dynamic = $picker.find('.asenha-template-picker-dynamic');
			var $actions = $picker.find('.asenha-template-picker-actions');

			$picker.show();
			$dynamic.html('<p class="description">' + asenhaSbT('loading') + '</p>');
			$actions.empty();

			this.fetchTemplates('full').done(function(resp) {
				if (!resp || !resp.success) {
					var msg = '<p class="description">' + (resp && resp.data && resp.data.message ? resp.data.message : asenhaSbT('failedToLoadTemplates')) + '</p>';
					$dynamic.html(msg);
					$actions.html(self.renderTransferTemplatePickerActionsHtml());
					return;
				}

				var templates = resp.data && resp.data.templates ? resp.data.templates : [];
				self.templatesCache = templates;

				$dynamic.html(self.renderTransferTemplatePickerDynamicHtml(templates));
				$actions.html(self.renderTransferTemplatePickerActionsHtml());

				var $select = $picker.find('#asenha-transfer-template-picker-select');
				if ($select.length && selectedTemplateId !== null) {
					$select.val(selectedTemplateId);
					if (selectedTemplateId && String($select.val() || '') !== selectedTemplateId) {
						$select.val('');
					}
				}
				self.updateTransferTemplatePickerLinkState();
			}).fail(function() {
				$dynamic.html('<p class="description">' + asenhaSbT('failedToLoadTemplates') + '</p>');
				$actions.html(self.renderTransferTemplatePickerActionsHtml());
			});
		},

		/**
		 * Render transfer template picker dynamic HTML.
		 *
		 * @param {Array} templates
		 * @return {string}
		 */
		renderTransferTemplatePickerDynamicHtml: function(templates) {
			templates = templates || [];
			var esc = function(s) {
				return $('<div/>').text(String(s || '')).html();
			};

			var defaultTitle = asenhaSbT('defaultTemplateTitleFull');
			var chooseTemplate = asenhaSbT('chooseTemplate');
			var createTemplateLabel = asenhaSbT('createTemplateShort') || asenhaSbT('createTemplate');
			var backupHeadingFull = asenhaSbT('backupHeadingFull');

			var html = '';
			html += '<h3 class="asenha-template-picker-backup-heading">' + esc(backupHeadingFull) + '</h3>';
			html += '<div class="asenha-template-picker-header">';
			html += '<p class="description"><strong>' + esc(chooseTemplate) + '</strong></p>';
			html += '</div>';

			html += '<div class="asenha-template-picker-row">';
			html += '<label class="screen-reader-text" for="asenha-transfer-template-picker-select">' + esc(chooseTemplate) + '</label>';
			html += '<select id="asenha-transfer-template-picker-select" class="asenha-template-picker-select">';
			html += '<option value="">' + esc(defaultTitle) + '</option>';
			for (var i = 0; i < templates.length; i++) {
				var tpl = templates[i] || {};
				var id = String(tpl.id || '');
				var title = String(tpl.title || '');
				var type = String(tpl.type || '');
				if (!id || !title || type !== 'full') {
					continue;
				}
				html += '<option value="' + esc(id) + '">' + esc(title) + '</option>';
			}
			html += '</select>';
			html += '<a href="#" id="asenha-create-transfer-template" class="button-link asenha-template-picker-create-link asenha-transfer-template-picker-create-link">' + esc(createTemplateLabel) + '</a>';
			html += '</div>';

			return html;
		},

		/**
		 * Render transfer template picker actions HTML (Generate Transfer Key Now + Cancel).
		 *
		 * @return {string}
		 */
		renderTransferTemplatePickerActionsHtml: function() {
			var esc = function(s) {
				return $('<div/>').text(String(s || '')).html();
			};
			var generateLabel = asenhaSbT('generateTransferKeyNow');
			var cancelLabel = asenhaSbT('cancel');

			var html = '';
			html += '<button type="button" class="button button-primary asenha-transfer-template-picker-generate">' + esc(generateLabel) + '</button> ';
			html += '<button type="button" class="button asenha-transfer-template-picker-cancel">' + esc(cancelLabel) + '</button>';
			return html;
		},

		onTransferTemplatePickerSelectChange: function(e) {
			e.preventDefault();
			this.updateTransferTemplatePickerLinkState();
		},

		/**
		 * Update the transfer picker link label (Create vs Edit) based on selection.
		 */
		updateTransferTemplatePickerLinkState: function() {
			var $picker = $('#asenha-transfer-template-picker');
			if (!$picker.length || !$picker.is(':visible')) {
				return;
			}

			var $link = $picker.find('.asenha-transfer-template-picker-create-link');
			if (!$link.length) {
				return;
			}

			var $select = $picker.find('#asenha-transfer-template-picker-select');
			var templateId = $select.length ? String($select.val() || '') : '';

			var createLabel = asenhaSbT('createTemplateShort') || asenhaSbT('createTemplate');
			var editLabel = asenhaSbT('editTemplateShort') || asenhaSbT('editTemplate');
			$link.text(templateId ? editLabel : createLabel);
		},

		/**
		 * Generate transfer key from the transfer template picker panel.
		 */
		onGenerateTransferKeyFromPickerClick: function(e) {
			e.preventDefault();

			var self = this;
			var $btn = $(e.currentTarget);
			if ($btn && $btn.length) {
				$btn.prop('disabled', true);
			}

			var $picker = $('#asenha-transfer-template-picker');
			var $select = $picker.find('#asenha-transfer-template-picker-select');
			var templateId = $select.length ? String($select.val() || '') : '';

			var multipartEnabled = $('#asenha-transfer-multipart-enabled').is(':checked');
			var multipartPartBytes = parseInt($('#asenha-transfer-multipart-part-bytes').val() || '0', 10);
			if (!multipartEnabled) {
				multipartPartBytes = 0;
			}
			var archiveEncryptionEnabled = $('#asenha-transfer-archive-encryption-enabled').is(':checked');
			var archivePassphrase = String($('#asenha-transfer-archive-passphrase').val() || '');
			var archivePassphraseConfirm = String($('#asenha-transfer-archive-passphrase-confirm').val() || '');
			if (archiveEncryptionEnabled && !archivePassphrase) {
				self.showNotice('error', asenhaSbT('transferArchivePassphraseRequired'));
				if ($btn && $btn.length) {
					$btn.prop('disabled', false);
				}
				return;
			}
			if (archiveEncryptionEnabled && archivePassphraseConfirm && archivePassphrase !== archivePassphraseConfirm) {
				self.showNotice('error', asenhaSbT('transferArchivePassphraseMismatch'));
				if ($btn && $btn.length) {
					$btn.prop('disabled', false);
				}
				return;
			}

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_generate_transfer_key',
					nonce: asenhaSiteBackup.nonce,
					expiry: 3600,
					components: ['all'],
					template_id: templateId,
					multipart_enabled: multipartEnabled ? 1 : 0,
					multipart_part_bytes: multipartPartBytes,
					archive_encryption_enabled: archiveEncryptionEnabled ? 1 : 0,
					archive_passphrase: archivePassphrase,
					archive_passphrase_confirm: archivePassphraseConfirm
				}
			}).done(function(response) {
				if ($btn && $btn.length) {
					$btn.prop('disabled', false);
				}

				if (!response || !response.success) {
					self.showNotice('error', (response && response.data && response.data.message) ? response.data.message : asenhaSbT('failedToGenerateTransferKey'));
					return;
				}

				var data = response.data || {};

				// Close picker and re-enable entry button.
				self.hideTransferTemplatePicker(true);

				// Show the transfer key.
				$('#asenha-generated-transfer-key').val(data.transfer_key || '');
				$('.asenha-transfer-key-display').slideDown();

				// Start expiry countdown.
				if (data.expires_at) {
					self.startTransferKeyCountdown(data.expires_at);
				}
				$('#asenha-transfer-archive-passphrase').val('');
				$('#asenha-transfer-archive-passphrase-confirm').val('');

				self.showNotice('success', asenhaSiteBackup.strings.transferKeyGenerated);
			}).fail(function(xhr, status, error) {
				if ($btn && $btn.length) {
					$btn.prop('disabled', false);
				}
				self.showNotice('error', error || asenhaSbT('failedToGenerateTransferKey'));
			});
		},

		onCancelTransferTemplatePickerClick: function(e) {
			e.preventDefault();
			this.hideTransferTemplatePicker(false);
		},

		/**
		 * Hide transfer template picker panel and optionally clear it.
		 *
		 * @param {boolean} clear If true, clear dynamic/action contents.
		 */
		hideTransferTemplatePicker: function(clear) {
			var $picker = $('#asenha-transfer-template-picker');
			if ($picker.length) {
				$picker.hide();
				if (clear) {
					$picker.find('.asenha-template-picker-dynamic').empty();
					$picker.find('.asenha-template-picker-actions').empty();
				}
			}
			$('#asenha-generate-transfer-key').prop('disabled', false);
		},

		/**
		 * Start countdown for transfer key expiry
		 */
		startTransferKeyCountdown: function(expiresAt) {
			var self = this;
			var $countdown = $('.asenha-expiry-countdown');

			// Clear any existing interval
			if (this.transferKeyExpiryInterval) {
				clearInterval(this.transferKeyExpiryInterval);
			}

			var updateCountdown = function() {
				var now = Math.floor(Date.now() / 1000);
				var remaining = expiresAt - now;

				if (remaining <= 0) {
					clearInterval(self.transferKeyExpiryInterval);
					$countdown.text(asenhaSbT('expired'));
					$('.asenha-transfer-key-display').slideUp();
					self.showNotice('warning', asenhaSiteBackup.strings.transferKeyExpired);
					return;
				}

				var minutes = Math.floor(remaining / 60);
				var seconds = remaining % 60;
				$countdown.text(minutes + ':' + (seconds < 10 ? '0' : '') + seconds);
			};

			updateCountdown();
			this.transferKeyExpiryInterval = setInterval(updateCountdown, 1000);
		},

		/**
		 * Copy transfer key to clipboard
		 */
		copyTransferKey: function(e) {
			e.preventDefault();

			var $input = $('#asenha-generated-transfer-key');
			$input.select();

			// Modern clipboard API
			if (navigator.clipboard) {
				navigator.clipboard.writeText($input.val()).then(function() {
					this.showNotice('success', asenhaSbT('transferKeyCopied'));
				}.bind(this));
			} else {
				// Fallback
				document.execCommand('copy');
				this.showNotice('success', asenhaSbT('transferKeyCopied'));
			}
		},

		/**
		 * Decode transfer key payload.
		 *
		 * @param {string} transferKey
		 * @return {Object|null}
		 */
		decodeTransferKeyPayload: function(transferKey) {
			var normalizedKey = String(transferKey || '').trim();
			var base64;
			var decoded;
			var parsed;

			if (!normalizedKey) {
				return null;
			}

			normalizedKey = normalizedKey.replace(/\s+/g, '');
			base64 = normalizedKey.replace(/-/g, '+').replace(/_/g, '/');

			while ((base64.length % 4) !== 0) {
				base64 += '=';
			}

			try {
				decoded = atob(base64);
				parsed = JSON.parse(decoded);
			} catch (error) {
				return null;
			}

			if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
				return null;
			}

			return parsed;
		},

		/**
		 * Determine whether transfer receive archive passphrase is required.
		 *
		 * @param {string} transferKey
		 * @return {boolean}
		 */
		isTransferReceivePassphraseRequired: function(transferKey) {
			var payload = this.decodeTransferKeyPayload(transferKey);
			if (!payload) {
				return false;
			}

			return this.isTruthyFlag(payload.archive_passphrase_required) || this.isTruthyFlag(payload.archive_encryption_enabled);
		},

		/**
		 * Show/hide transfer receive passphrase field based on key metadata.
		 */
		updateTransferReceivePassphraseUi: function() {
			var transferKey = String($('#asenha-transfer-key-input').val() || '').trim();
			var $passphraseField = $('.asenha-transfer-receive-passphrase');
			var shouldShowPassphraseField = this.isTransferReceivePassphraseRequired(transferKey);

			if (!$passphraseField.length) {
				return;
			}

			$passphraseField.toggleClass('asenha-transfer-receive-passphrase-hidden', !shouldShowPassphraseField);

			if (!shouldShowPassphraseField) {
				$('#asenha-transfer-receive-archive-passphrase').val('');
			}
		},

		/**
		 * Start transfer from source site
		 */
		startTransfer: function(e) {
			e.preventDefault();

			var transferKey = $('#asenha-transfer-key-input').val().trim();
			var archivePassphrase = String($('#asenha-transfer-receive-archive-passphrase').val() || '');
			var archivePassphraseTrimmed = archivePassphrase.trim();
			var isTransferPassphraseRequired = this.isTransferReceivePassphraseRequired(transferKey);
			var $button = $(e.currentTarget);
			var $statusDiv = $('.asenha-transfer-connection-status');
			var self = this;

			if (!transferKey) {
				this.showNotice('error', asenhaSbT('transferKeyRequired'));
				return;
			}

			if (isTransferPassphraseRequired && !archivePassphraseTrimmed) {
				this.showNotice('error', asenhaSbT('migrationArchivePassphraseRequired'));
				$('#asenha-transfer-receive-archive-passphrase').trigger('focus');
				return;
			}

			// Suspend heartbeat to prevent interim login modal after session invalidation
			this.suspendHeartbeat();

			$button.prop('disabled', true);

			// Show progress UI immediately with 'creating' as in-progress
			// The AJAX call blocks while the source site creates the package
			this.initTransferProgress();
			$('.asenha-transfer-progress').show();
			$statusDiv.hide();

			// Set initial state to show 'connecting' briefly, then 'creating'
			var $progress = $('.asenha-transfer-progress');
			this.updateTransferCheckpoints($progress, 'creating', {});
			$progress.find('.asenha-circle-progress').attr('stroke-dasharray', '3, 100');
			$progress.find('.asenha-progress-percent').text('3%');

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_initiate_transfer',
					nonce: asenhaSiteBackup.nonce,
					transfer_key: transferKey,
					archive_passphrase: archivePassphrase
				},
				success: function(response) {
					if (response.success) {
						var data = response.data;
						var packageInfo = data.package_info || {};
						var packageStatus = packageInfo.status ? String(packageInfo.status) : '';
						var totalChunks = packageInfo.total_chunks ? parseInt(packageInfo.total_chunks, 10) : 0;

						self.currentTransferId = data.transfer_id;
						// Store public progress URL for static polling fallback.
						if (data.public_progress_url) {
							self.currentTransferPublicProgressUrl = data.public_progress_url;
						}
						// Store package info for completion stats
						if (data.package_info) {
							self.transferPackageInfo = data.package_info;
						}

						// Only switch UI to "downloading" when the source package is actually ready.
						// When the source is still preparing, the backend returns status=creating and total_chunks=0.
						if (packageStatus === 'creating' || totalChunks <= 0) {
							// Stay on "creating" until polling reports the download phase.
							self.updateTransferCheckpoints($progress, 'creating', {});
							$progress.find('.asenha-circle-progress').attr('stroke-dasharray', '3, 100');
							$progress.find('.asenha-progress-percent').text('3%');
						} else {
							// Mark 'creating' as complete and show package size.
							var packageSize = packageInfo && packageInfo.total_bytes ? parseInt(packageInfo.total_bytes, 10) : 0;

							// Store the package size as the 'creating' step completion stat.
							if (packageSize > 0) {
								self.lastTransferPackageSize = packageSize;
								self.lastTransferDownloadSize = packageSize;
								self.transferCompletedStats['creating'] = {
									label: 'done',
									package_size: packageSize
								};
							}

							self.updateTransferCheckpoints($progress, 'downloading', {
								package_size: packageSize
							});
							$progress.find('.asenha-circle-progress').attr('stroke-dasharray', '5, 100');
							$progress.find('.asenha-progress-percent').text('5%');
						}

						// Poll for progress
						self.pollTransferProgress();
					} else {
						$button.prop('disabled', false);
						$('.asenha-transfer-progress').hide();
						self.showNotice('error', response.data.message || asenhaSiteBackup.strings.connectionFailed);
					}
				},
				error: function(xhr, status, error) {
					$button.prop('disabled', false);
					$('.asenha-transfer-progress').hide();
					self.showNotice('error', asenhaSiteBackup.strings.connectionFailed);
				}
			});
		},

		/**
		 * Initialize transfer progress UI
		 */
		initTransferProgress: function() {
			var $progress = $('.asenha-transfer-progress');
			var steps = this.transferSteps;
			var checkpointLabels = asenhaSiteBackup.checkpoints.transfer;

			// Build and insert checklist
			var checklistHtml = this.buildChecklist(steps, checkpointLabels);
			$progress.find('.asenha-progress-checklist').html(checklistHtml);

			// Reset circular progress
			$progress.find('.asenha-circle-progress').attr('stroke-dasharray', '0, 100').removeClass('completed failed');
			$progress.find('.asenha-progress-percent').text('0%');

			// Reset time display
			$progress.find('.asenha-time-elapsed .asenha-time-value').text('0s');
			$progress.find('.asenha-time-remaining .asenha-time-value').text('--');
			$progress.find('.asenha-time-remaining').show(); // Ensure it's visible for new operation

			// Store start time
			this.startTime = Date.now();

			// Reset transfer package info
			this.transferPackageInfo = null;

			// Reset transfer completed step stats
			this.transferCompletedStats = {};
			this.previousTransferStep = null;
			this.lastTransferExtractionSize = 0;
			this.lastTransferPackageSize = 0;
			this.lastTransferFilesTotal = 0;
			this.lastTransferTablesTotal = 0;
			this.lastTransferRowsTotal = 0;
			this.lastTransferDownloadSize = 0;
			this.lastTransferSearchReplaceStats = null;
			this.lastTransferSubProgress = null;
			this.lastTransferManifestRowCount = 0;
			this.transferExtractingStaleWarned = false;
			this._transferExtractingLastRecoveryAt = 0;

			// Reset Migration DB runner tracking used during transfer's DB import.
			// Transfer may rely on keepalive when the runner's self-spawn loopback fails.
			this._migrationDbRunnerUrl = null;
			this._migrationDbRunnerToken = null;
			this._transferMigrationDbRunnerLastUpdate = 0;
			this._transferMigrationDbRunnerLastUpdateSeenAt = 0;
			this._transferMigrationDbRunnerLastKickAttemptAt = 0;
			this._transferMigrationDbRunnerLastDirectAttemptAt = 0;
			this._transferMigrationRunnerDetailsLastFetchAt = 0;
			this._transferMigrationRunnerDetailsFetchInFlight = false;

			// Start time update interval
			this.startTimeUpdater($progress);
		},

		/**
		 * Poll transfer progress
		 *
		 * When authenticated endpoint fails (e.g., after database restore invalidates session),
		 * automatically switches to noauth endpoint that uses file-based state.
		 * If noauth also fails (admin-ajax unavailable during DB import), falls back to
		 * static JSON polling using the public progress file.
		 *
		 * @since 8.7.0
		 * Added static polling fallback for database import phase.
		 */
		pollTransferProgress: function() {
			if (!this.currentTransferId) {
				return;
			}

			var self = this;
			var useNoAuth = false;
			var useStatic = false;
			var consecutiveErrors = 0;
			var lastKnownStep = 'connecting';
			var kickThrottleMs = 15000; // 15s between keepalive attempts (server kick).
			var directThrottleMs = 30000; // 30s between direct runner pings.
			var staleThresholdMs = 60000; // 60s with no last_update change => treat as stale.
			var extractingStaleThresholdMs = 45000; // 45s in extracting => try noauth/static recovery sooner.
			var extractingRecoveryThrottleMs = 10000; // 10s between extracting recovery attempts.
			var lastSeenUpdate = null; // Track last_update from server.
			var lastSeenUpdateTime = null; // JS timestamp when that last_update was first seen.

			var looksLikeTablesUnavailable = function(text) {
				if (!text) {
					return false;
				}
				return String(text).indexOf('One or more database tables are unavailable') !== -1;
			};

			var getStaticUrl = function() {
				// Prefer the transfer's current public progress URL if available.
				if (self.currentTransferPublicProgressUrl) {
					return self.currentTransferPublicProgressUrl;
				}
				if (self.currentTransferMigrationPublicProgressUrl) {
					return self.currentTransferMigrationPublicProgressUrl;
				}
				if (self.currentTransferMigrationId) {
					return self.getMigrationPublicProgressUrl(self.currentTransferMigrationId);
				}
				return null;
			};

			var doPollStatic = function() {
				if (!self.currentTransferId) {
					return;
				}

				var staticUrl = getStaticUrl();
				if (!staticUrl) {
					return;
				}

				var url = staticUrl;
				url += (url.indexOf('?') === -1 ? '?' : '&') + 't=' + Date.now();

				// One-time console hint for debugging.
				if (!self._transferStaticPollAnnounced) {
					self._transferStaticPollAnnounced = true;
					if (window.console && window.console.info) {
						window.console.info('ASE: transfer progress falling back to static migration progress JSON');
					}
				}

				$.ajax({
					url: url,
					type: 'GET',
					dataType: 'json',
					cache: false,
					success: function(state) {
						if (state && typeof state === 'object') {
							handleStateResponse(state, 'static');
						} else {
							consecutiveErrors++;
						}
					},
					error: function() {
						consecutiveErrors++;
					}
				});
			};

			/**
			 * Handle successful state response
			 */
			var handleStateResponse = function(state, pollMode) {
				var $progress = $('.asenha-transfer-progress');
				var currentStep = state.current_step || 'connecting';
				pollMode = pollMode || 'auth';

				// Normalize migration step names to transfer step names so the checklist never
				// "regresses" to the first step when an unknown migration step is returned.
				if (currentStep === 'preparing' || currentStep === 'initializing') {
					currentStep = 'extracting';
				}

				// Transfer no longer has a separate 'redirect' checkpoint; treat it as finalizing.
				// This keeps UI stable for in-flight transfers that may still emit 'redirect' from older code.
				if (currentStep === 'redirect') {
					currentStep = 'cleanup';
				}

				// If we still have an unknown step but we're already migrating, keep the UI in
				// the migration section (never fall back to "connecting").
				if (self.transferSteps && self.transferSteps.indexOf(currentStep) === -1) {
					if (state && state.status === 'migrating') {
						// Preserve lastKnownStep if it's already a later valid step.
						if (lastKnownStep && self.transferSteps.indexOf(lastKnownStep) !== -1) {
							currentStep = lastKnownStep;
						} else {
							currentStep = 'extracting';
						}
					} else {
						currentStep = 'connecting';
					}
				}

				// Prevent step regression: once we move forward in the transfer checklist,
				// do not allow polling responses to move the UI backwards (e.g. downloading -> creating).
				// This can happen briefly due to backend session timing (connected/creating/download-start race).
				if (state && state.status !== 'failed' && lastKnownStep && self.transferSteps) {
					var currentIndex = self.transferSteps.indexOf(currentStep);
					var lastIndex = self.transferSteps.indexOf(lastKnownStep);
					if (currentIndex !== -1 && lastIndex !== -1 && currentIndex < lastIndex) {
						currentStep = lastKnownStep;
					}
				}

				// Reset error counter on success
				consecutiveErrors = 0;

				// Track current step for checking if we're in database import phase.
				lastKnownStep = currentStep;

				// Capture migration_id + public_progress_url during transfer->migration so we can
				// fall back to static JSON polling when admin-ajax becomes unavailable.
				if (state.migration_id) {
					self.currentTransferMigrationId = String(state.migration_id);
				}

				if (state.public_progress_url) {
					self.currentTransferMigrationPublicProgressUrl = String(state.public_progress_url);
					self.currentTransferPublicProgressUrl = String(state.public_progress_url);

					if (self.currentTransferMigrationId) {
						self.saveMigrationPublicProgressUrl(self.currentTransferMigrationId, self.currentTransferMigrationPublicProgressUrl);
					}
				}

				// Auth-only: capture runner URL/token early so we can direct-ping the runner later
				// even if admin-ajax becomes unavailable during DB import.
				if (state.db_runner_url && state.db_runner_token) {
					self._migrationDbRunnerUrl = String(state.db_runner_url);
					self._migrationDbRunnerToken = String(state.db_runner_token);
				}

				// Best-effort: fetch runner URL/token early so we can direct-ping the runner
				// if admin-ajax becomes unavailable (static polling) and loopback self-spawn fails.
				maybeFetchTransferMigrationRunnerDetails(state, pollMode, currentStep);

				// Best-effort keepalive for the Migration DB runner during the database step.
				// This mitigates hosts where the runner's self-spawn loopback fails and DB import stalls.
				maybeKeepaliveTransferMigrationDbRunner(state, pollMode, currentStep);

				// Best-effort keepalive for the mu-plugin migration worker during non-database steps.
				// This mitigates hosts where incompatible extracted plugins break the worker loopback chain.
				maybeKickTransferMigrationWorker(state, pollMode, currentStep);

				// Stale-state detection for transfer->migration extracting step.
				// If "Preparing import" stops updating, switch recovery mode earlier (noauth/static)
				// and surface a warning without hard-failing the operation.
				if (typeof state.last_update !== 'undefined') {
					var stateLastUpdate = parseInt(state.last_update, 10) || 0;
					if (stateLastUpdate > 0) {
						if (lastSeenUpdate !== stateLastUpdate) {
							lastSeenUpdate = stateLastUpdate;
							lastSeenUpdateTime = Date.now();
							self.transferExtractingStaleWarned = false;
						} else if (lastSeenUpdateTime && currentStep === 'extracting') {
							var extractingElapsedMs = Date.now() - lastSeenUpdateTime;
							if (extractingElapsedMs >= extractingStaleThresholdMs) {
								if (!self.transferExtractingStaleWarned) {
									self.transferExtractingStaleWarned = true;
									if (typeof self.showNotice === 'function') {
										self.showNotice(
											'warning',
											asenhaSbT('transferPreparingImportTakingLonger') || 'Preparing import is taking longer than expected. Attempting recovery.'
										);
									}
								}

								var nowMs = Date.now();
								var lastRecoveryAt = parseInt(self._transferExtractingLastRecoveryAt, 10) || 0;
								if (!lastRecoveryAt || (nowMs - lastRecoveryAt) >= extractingRecoveryThrottleMs) {
									self._transferExtractingLastRecoveryAt = nowMs;

									// Escalate to noauth earlier than the database phase fallback.
									if (!useNoAuth) {
										useNoAuth = true;
									}

									// If noauth is already active and we have a static URL, switch to static polling.
									if (useNoAuth && !useStatic && getStaticUrl()) {
										useStatic = true;
									}
								}
							}
						}
					}
				}

				// Store completion stats when a step completes with 'done' label
				if (state.sub_progress && state.sub_progress.label === 'done') {
					self.transferCompletedStats[currentStep] = state.sub_progress;
					// Also update tracked values from the 'done' state for fallback
					if (currentStep === 'database') {
						if (state.sub_progress.tables_imported > 0) {
							self.lastTransferTablesTotal = state.sub_progress.tables_imported;
						}
						if (state.sub_progress.rows_imported > 0) {
							self.lastTransferRowsTotal = state.sub_progress.rows_imported;
						}
					}
				}

				// Track extraction total size for fallback (use latest non-zero value)
				if (currentStep === 'extracting' && state.sub_progress && state.sub_progress.total_size > 0) {
					self.lastTransferExtractionSize = state.sub_progress.total_size;
				}

				// Track total bytes during downloading step (this is the final package size)
				if (currentStep === 'downloading' && state.total_bytes > 0) {
					self.lastTransferDownloadSize = state.total_bytes;
					// Also use this as the package size since it represents the complete archive
					if (!self.lastTransferPackageSize || self.lastTransferDownloadSize > self.lastTransferPackageSize) {
						self.lastTransferPackageSize = self.lastTransferDownloadSize;
					}
				}

				// Track total files during files import step (always use 'total' which is the full count)
				if (currentStep === 'files' && state.sub_progress) {
					// Store the total count (not current progress)
					if (state.sub_progress.total > 0) {
						self.lastTransferFilesTotal = state.sub_progress.total;
					} else if (state.sub_progress.total_files > 0) {
						self.lastTransferFilesTotal = state.sub_progress.total_files;
					}
				}

				// Track total tables and rows during database import step (always use 'total' which is the full count)
				if (currentStep === 'database' && state.sub_progress) {
					// Store the total count (not current progress)
					if (state.sub_progress.total > 0) {
						self.lastTransferTablesTotal = state.sub_progress.total;
					} else if (state.sub_progress.total_tables > 0) {
						self.lastTransferTablesTotal = state.sub_progress.total_tables;
					}
					// Track rows imported
					if (state.sub_progress.rows_imported > 0) {
						self.lastTransferRowsTotal = state.sub_progress.rows_imported;
					}
				}

				// Capture pre-analyzed database stats (more reliable than tracking during import)
				// Store manifest row count separately - it's the most reliable value at completion
				if (state.database_stats && state.database_stats.total_rows > 0) {
					self.lastTransferManifestRowCount = state.database_stats.total_rows;
					// Also update lastTransferRowsTotal as a fallback
					self.lastTransferRowsTotal = state.database_stats.total_rows;
				}
				// Capture pre-analyzed table count too (needed when DB step is very fast and UI may jump to cleanup).
				if (state.database_stats && state.database_stats.total_tables > 0) {
					self.lastTransferTablesTotal = parseInt(state.database_stats.total_tables, 10) || self.lastTransferTablesTotal;
				}

				// If we jumped straight to finalizing with a DB summary payload, ensure the database checkpoint
				// gets a summary even if we never observed an intermediate 'database' poll.
				if (
					currentStep === 'cleanup'
					&& state.sub_progress
					&& state.sub_progress.label === 'done'
					&& (state.sub_progress.tables_imported > 0 || self.lastTransferTablesTotal > 0)
					&& !self.transferCompletedStats['database']
				) {
					var tablesImported = state.sub_progress.tables_imported || self.lastTransferTablesTotal || 0;
					var rowsImported = self.lastTransferManifestRowCount || state.sub_progress.rows_imported || self.lastTransferRowsTotal || 0;
					if (tablesImported > 0) {
						self.transferCompletedStats['database'] = {
							label: 'done',
							tables_imported: tablesImported,
							rows_imported: rowsImported
						};
					}
				}

				// Track search/replace stats - check dedicated field first (persists across steps), then sub_progress
				if (state.search_replace_stats) {
					self.lastTransferSearchReplaceStats = {
						url_replacements: state.search_replace_stats.url_replacements || 0,
						path_replacements: state.search_replace_stats.path_replacements || 0,
						serialized_fixes: state.search_replace_stats.serialized_fixes || 0
					};
					// Also store in completedStats immediately when we have the dedicated field
					if (!self.transferCompletedStats['search_replace']) {
						self.transferCompletedStats['search_replace'] = self.lastTransferSearchReplaceStats;
					}
				} else if (currentStep === 'search_replace' && state.sub_progress) {
					if (state.sub_progress.url_replacements !== undefined || state.sub_progress.path_replacements !== undefined) {
						self.lastTransferSearchReplaceStats = {
							url_replacements: state.sub_progress.url_replacements || 0,
							path_replacements: state.sub_progress.path_replacements || 0,
							serialized_fixes: state.sub_progress.serialized_fixes || 0
						};
					}
				}

				// Track the current sub_progress for this step (only when it has meaningful data)
				if (state.sub_progress && (state.sub_progress.label || state.sub_progress.current > 0)) {
					self.lastTransferSubProgress = state.sub_progress;
				}
				
				// Preserve a dedicated snapshot for the creating step so we can build the enhanced
				// completion summary even after the UI transitions to the downloading step.
				if (currentStep === 'creating' && state.sub_progress && typeof state.sub_progress === 'object') {
					self.lastTransferCreatingSubProgress = $.extend({}, self.lastTransferCreatingSubProgress || {}, state.sub_progress);
				}

				// Detect step transition - if step changed, store stats for the previous step
				if (self.previousTransferStep && self.previousTransferStep !== currentStep) {
					// Step changed from extracting - check if we have stats stored
					if (self.previousTransferStep === 'extracting' && !self.transferCompletedStats['extracting']) {
						// Always store a completion marker so the UI can show "Done" even when we didn't
						// capture a reliable extracted size (some flows don't provide total_size).
						self.transferCompletedStats['extracting'] = {
							label: 'done'
						};
						if (self.lastTransferExtractionSize > 0) {
							self.transferCompletedStats['extracting'].total_size = self.lastTransferExtractionSize;
						}
					}
					// Step changed from creating - store package size (use download size which is the final archive size)
					if (self.previousTransferStep === 'creating' && !self.transferCompletedStats['creating']) {
						// Package size from transfer info or download size
						var pkgSize = self.lastTransferPackageSize || self.lastTransferDownloadSize || 
							(self.transferPackageInfo && self.transferPackageInfo.total_bytes);
						if (pkgSize > 0) {
							// Persist enriched summary fields so completion text can include files + DB stats.
							// We use the last known creating sub_progress snapshot (often the richest payload).
							var creatingStats = {};
							if (self.lastTransferCreatingSubProgress && typeof self.lastTransferCreatingSubProgress === 'object') {
								var sp = self.lastTransferCreatingSubProgress;

								// Files stats.
								if ((sp.total_files || 0) > 0) {
									creatingStats.total_files = sp.total_files;
								}
								if ((sp.files_size || 0) > 0) {
									creatingStats.files_size = sp.files_size;
								}

								// Database stats.
								if ((sp.table_count || 0) > 0) {
									creatingStats.table_count = sp.table_count;
								}
								if ((sp.row_count || 0) > 0) {
									creatingStats.row_count = sp.row_count;
								}
								// Prefer exported SQL file size (more accurate for “DB size” in summaries).
								if ((sp.sql_file_size || 0) > 0) {
									creatingStats.sql_file_size = sp.sql_file_size;
								} else if ((sp.db_size || 0) > 0) {
									creatingStats.db_size = sp.db_size;
								}
							}

							self.transferCompletedStats['creating'] = $.extend({}, creatingStats, {
								label: 'done',
								package_size: pkgSize
							});
						}
					}
					// Step changed from downloading - store download size
					if (self.previousTransferStep === 'downloading' && !self.transferCompletedStats['downloading']) {
						if (self.lastTransferDownloadSize > 0) {
							self.transferCompletedStats['downloading'] = {
								label: 'done',
								total_bytes: self.lastTransferDownloadSize
							};
						}
					}
					// Step changed from files - store files total
					if (self.previousTransferStep === 'files' && !self.transferCompletedStats['files']) {
						if (self.lastTransferFilesTotal > 0) {
							self.transferCompletedStats['files'] = {
								label: 'done',
								files_imported: self.lastTransferFilesTotal
							};
						}
					}
					// Step changed from database - store tables and rows total
					if (self.previousTransferStep === 'database' && !self.transferCompletedStats['database']) {
						if (self.lastTransferTablesTotal > 0) {
							self.transferCompletedStats['database'] = {
								label: 'done',
								tables_imported: self.lastTransferTablesTotal,
								rows_imported: self.lastTransferRowsTotal
							};
						}
					}
					// Step changed from search_replace - store search/replace stats
					if (self.previousTransferStep === 'search_replace' && !self.transferCompletedStats['search_replace']) {
						if (self.lastTransferSearchReplaceStats) {
							self.transferCompletedStats['search_replace'] = {
								label: 'done',
								url_replacements: self.lastTransferSearchReplaceStats.url_replacements,
								path_replacements: self.lastTransferSearchReplaceStats.path_replacements,
								serialized_fixes: self.lastTransferSearchReplaceStats.serialized_fixes
							};
						}
					}

					// --- Step-jump detection ---
					// When the poller misses intermediate steps (e.g. jumps from 'downloading' to
					// 'cleanup' on small/fast sites), retroactively populate best-effort stats for
					// every skipped step so the UI renders them as completed with a summary.
					var prevIdx = self.transferSteps.indexOf(self.previousTransferStep);
					var curIdx = self.transferSteps.indexOf(currentStep);
					if (prevIdx !== -1 && curIdx > prevIdx + 1) {
						for (var skippedIdx = prevIdx + 1; skippedIdx < curIdx; skippedIdx++) {
							var skippedStep = self.transferSteps[skippedIdx];
							if (self.transferCompletedStats[skippedStep]) {
								continue; // Already populated by an earlier check or state payload.
							}

							if (skippedStep === 'extracting') {
								if (self.lastTransferExtractionSize > 0) {
									self.transferCompletedStats['extracting'] = {
										label: 'done',
										total_size: self.lastTransferExtractionSize
									};
								} else {
									self.transferCompletedStats['extracting'] = { label: 'done' };
								}
							} else if (skippedStep === 'files') {
								if (self.lastTransferFilesTotal > 0) {
									self.transferCompletedStats['files'] = {
										label: 'done',
										files_imported: self.lastTransferFilesTotal
									};
								} else if (state.files_step_stats && state.files_step_stats.total_files > 0) {
									self.transferCompletedStats['files'] = {
										label: 'done',
										files_imported: state.files_step_stats.total_files
									};
								} else {
									self.transferCompletedStats['files'] = { label: 'done' };
								}
							} else if (skippedStep === 'search_replace') {
								if (self.lastTransferSearchReplaceStats) {
									self.transferCompletedStats['search_replace'] = {
										label: 'done',
										url_replacements: self.lastTransferSearchReplaceStats.url_replacements || 0,
										path_replacements: self.lastTransferSearchReplaceStats.path_replacements || 0,
										serialized_fixes: self.lastTransferSearchReplaceStats.serialized_fixes || 0
									};
								} else if (state.search_replace_stats) {
									self.transferCompletedStats['search_replace'] = {
										label: 'done',
										url_replacements: state.search_replace_stats.url_replacements || 0,
										path_replacements: state.search_replace_stats.path_replacements || 0,
										serialized_fixes: state.search_replace_stats.serialized_fixes || 0
									};
								} else if (state.search_replace_step_stats) {
									self.transferCompletedStats['search_replace'] = {
										label: 'done',
										url_replacements: state.search_replace_step_stats.url_replacements || 0,
										path_replacements: state.search_replace_step_stats.path_replacements || 0,
										serialized_fixes: state.search_replace_step_stats.serialized_fixes || 0
									};
								} else {
									self.transferCompletedStats['search_replace'] = { label: 'done' };
								}
							} else if (skippedStep === 'database') {
								if (self.lastTransferTablesTotal > 0) {
									var rowCount = self.lastTransferManifestRowCount || self.lastTransferRowsTotal || 0;
									self.transferCompletedStats['database'] = {
										label: 'done',
										tables_imported: self.lastTransferTablesTotal,
										rows_imported: rowCount
									};
								} else if (state.database_stats && state.database_stats.total_tables > 0) {
									self.transferCompletedStats['database'] = {
										label: 'done',
										tables_imported: state.database_stats.total_tables,
										rows_imported: state.database_stats.total_rows || 0
									};
								} else {
									self.transferCompletedStats['database'] = { label: 'done' };
								}
							} else {
								self.transferCompletedStats[skippedStep] = { label: 'done' };
							}
						}
					}
				}

				// Update previous step tracker
				self.previousTransferStep = currentStep;

				// Update progress display
				$progress.find('.asenha-circle-progress').attr('stroke-dasharray', state.progress + ', 100');
				$progress.find('.asenha-progress-percent').text(state.progress + '%');

				// Update checkpoint steps based on current_step, passing full state for sub-progress
				self.updateTransferCheckpoints($progress, currentStep, state);

				if (state.status === 'completed' || state.current_step === 'redirect') {
					self.transferCompleted(state);
				} else if (state.status === 'failed') {
					self.transferFailed(state.error);
				}
			};

			/**
			 * Check if we're in the database import step.
			 */
			var inDatabaseStep = function() {
				return lastKnownStep === 'database';
			};

			/**
			 * Best-effort fetch of Migration DB runner URL + token (transfer -> migration).
			 *
			 * The static progress JSON written by the runner intentionally does NOT include secrets,
			 * so we try to capture the runner URL+token from the state file via noauth endpoint.
			 *
			 * @param {Object} state Transfer/migration state.
			 * @param {string} pollMode One of: 'auth', 'noauth', 'static'.
			 * @param {string} currentStep Normalized step.
			 */
			var maybeFetchTransferMigrationRunnerDetails = function(state, pollMode, currentStep) {
				if (!state || typeof state !== 'object') {
					return;
				}

				var migrationId = self.currentTransferMigrationId ? String(self.currentTransferMigrationId) : '';
				if (!migrationId) {
					return;
				}

				// If we already have runner details, nothing to do.
				if (self._migrationDbRunnerUrl && self._migrationDbRunnerToken) {
					return;
				}

				// Only attempt when we're in the migration portion (extracting->cleanup) or specifically database step.
				if (currentStep !== 'database' && state.status !== 'migrating' && !inDatabaseStep()) {
					return;
				}

				var nowMs = Date.now ? Date.now() : (new Date()).getTime();
				var lastFetchAt = parseInt(self._transferMigrationRunnerDetailsLastFetchAt, 10) || 0;
				if (self._transferMigrationRunnerDetailsFetchInFlight) {
					return;
				}

				// Throttle fetch attempts (static mode can be very chatty).
				var throttleMs = (pollMode === 'static') ? 30000 : 10000;
				if (lastFetchAt && (nowMs - lastFetchAt) < throttleMs) {
					return;
				}

				self._transferMigrationRunnerDetailsLastFetchAt = nowMs;
				self._transferMigrationRunnerDetailsFetchInFlight = true;

				$.ajax({
					url: asenhaSiteBackup.ajaxUrl,
					type: 'POST',
					data: {
						action: 'asenha_get_migration_progress_noauth',
						migration_id: migrationId
					},
					timeout: 8000,
					success: function(response) {
						if (response && response.success && response.data && typeof response.data === 'object') {
							if (response.data.db_runner_url && response.data.db_runner_token) {
								self._migrationDbRunnerUrl = String(response.data.db_runner_url);
								self._migrationDbRunnerToken = String(response.data.db_runner_token);
							}
						}
					},
					complete: function() {
						self._transferMigrationRunnerDetailsFetchInFlight = false;
					}
				});
			};

			/**
			 * Best-effort keepalive for the Migration DB runner during transfer's DB import.
			 *
			 * Strategy (same as migration polling):
			 * - If last_update stops changing for >60s, call a noauth endpoint that kicks the runner.
			 * - If runner URL+token are known, also do a direct runner GET (helps when loopback is blocked).
			 *
			 * @param {Object} state Transfer/migration state (may be static or full).
			 * @param {string} pollMode One of: 'auth', 'noauth', 'static'.
			 * @param {string} currentStep Normalized step.
			 */
			var maybeKeepaliveTransferMigrationDbRunner = function(state, pollMode, currentStep) {
				if (!state || typeof state !== 'object') {
					return;
				}

				if (currentStep !== 'database') {
					return;
				}

				// Only keepalive when we have a migration ID to target.
				var migrationId = self.currentTransferMigrationId ? String(self.currentTransferMigrationId) : '';
				if (!migrationId) {
					return;
				}

				// Skip on terminal states.
				if (state.status === 'completed' || state.status === 'failed') {
					return;
				}

				var lastUpdate = (typeof state.last_update !== 'undefined') ? parseInt(state.last_update, 10) : 0;
				if (!lastUpdate || isNaN(lastUpdate)) {
					return;
				}

				// Update stale-tracking markers.
				var nowMs = Date.now ? Date.now() : (new Date()).getTime();
				if (!self._transferMigrationDbRunnerLastUpdate || self._transferMigrationDbRunnerLastUpdate !== lastUpdate) {
					self._transferMigrationDbRunnerLastUpdate = lastUpdate;
					self._transferMigrationDbRunnerLastUpdateSeenAt = nowMs;
					return;
				}

				// Same last_update observed; consider keepalive if stale threshold exceeded.
				var lastSeenAt = parseInt(self._transferMigrationDbRunnerLastUpdateSeenAt, 10) || 0;
				if (!lastSeenAt) {
					self._transferMigrationDbRunnerLastUpdateSeenAt = nowMs;
					return;
				}

				var ageMs = nowMs - lastSeenAt;
				if (ageMs < staleThresholdMs) {
					return;
				}

				// Try to fetch runner URL/token before keepalive actions if we don't have them yet.
				maybeFetchTransferMigrationRunnerDetails(state, pollMode, currentStep);

				// Throttle server-side kick attempts.
				var lastKickAt = parseInt(self._transferMigrationDbRunnerLastKickAttemptAt, 10) || 0;
				if ((nowMs - lastKickAt) >= kickThrottleMs) {
					self._transferMigrationDbRunnerLastKickAttemptAt = nowMs;
					$.ajax({
						url: asenhaSiteBackup.ajaxUrl,
						type: 'POST',
						data: {
							action: 'asenha_kick_migration_db_runner_noauth',
							migration_id: migrationId
						}
					});
				}

				// Direct runner ping fallback (helps when server loopback is blocked).
				// Only attempt if we have previously captured a runner URL+token.
				var runnerUrl = self._migrationDbRunnerUrl ? String(self._migrationDbRunnerUrl) : '';
				var runnerToken = self._migrationDbRunnerToken ? String(self._migrationDbRunnerToken) : '';
				if (runnerUrl && runnerToken) {
					var lastDirectAt = parseInt(self._transferMigrationDbRunnerLastDirectAttemptAt, 10) || 0;
					if ((nowMs - lastDirectAt) >= directThrottleMs) {
						self._transferMigrationDbRunnerLastDirectAttemptAt = nowMs;

						// Build the runner URL with required query args.
						var sep = (runnerUrl.indexOf('?') === -1) ? '?' : '&';
						var url = runnerUrl + sep
							+ 'asenha_action=migration_db'
							+ '&migration_id=' + encodeURIComponent(migrationId)
							+ '&token=' + encodeURIComponent(runnerToken)
							+ '&t=' + encodeURIComponent(String(Date.now()));

						$.ajax({
							url: url,
							type: 'GET',
							cache: false,
							timeout: 5000
						});
					}
				}
			};

			/**
			 * Best-effort keepalive kick for the mu-plugin migration worker during
			 * non-database transfer migration steps (extracting, files, search_replace).
			 *
			 * When the files-import phase writes incompatible plugins into wp-content/plugins/,
			 * subsequent WordPress bootstraps may fatally error, preventing ASE's AJAX hooks
			 * from registering. This breaks the self-spawning worker loopback chain.
			 * The mu-plugin (000-asenha-migration-worker.php) loads before regular plugins,
			 * so its `asenha_kick_migration_worker_noauth` action remains available even when
			 * ASE's main hooks fail. This helper fires that action to keep the worker alive.
			 *
			 * @param {Object} state  Transfer/migration state (may be static or full).
			 * @param {string} pollMode  One of: 'auth', 'noauth', 'static'.
			 * @param {string} currentStep  Normalized step.
			 */
			var maybeKickTransferMigrationWorker = function(state, pollMode, currentStep) {
				// Only act during the migration phase when we have a migration ID.
				var migrationId = self.currentTransferMigrationId
					? String(self.currentTransferMigrationId)
					: (state && state.migration_id ? String(state.migration_id) : '');
				if (!migrationId) {
					return;
				}

				var step = currentStep || (state && state.current_step ? state.current_step : '');

				// Database step has its own standalone runner keepalive; cleanup and completed
				// do not need worker kicks.
				var skipSteps = ['database', 'cleanup', 'completed'];
				if (skipSteps.indexOf(step) !== -1) {
					return;
				}

				// Skip terminal states.
				if (state && (state.status === 'completed' || state.status === 'failed')) {
					return;
				}

				// Stale detection: only kick when last_update hasn't changed for 15+ seconds.
				var muKickStaleMs = 15000;
				var lastUpdate = (state && typeof state.last_update !== 'undefined')
					? parseInt(state.last_update, 10)
					: 0;
				if (!lastUpdate || isNaN(lastUpdate)) {
					return;
				}

				var nowMs = Date.now ? Date.now() : (new Date()).getTime();

				if (!self._transferMuWorkerLastUpdate || self._transferMuWorkerLastUpdate !== lastUpdate) {
					// last_update changed -- reset stale tracker.
					self._transferMuWorkerLastUpdate = lastUpdate;
					self._transferMuWorkerLastUpdateSeenAt = nowMs;
					return;
				}

				// Same last_update observed -- check staleness.
				var seenAt = parseInt(self._transferMuWorkerLastUpdateSeenAt, 10) || 0;
				if (!seenAt) {
					self._transferMuWorkerLastUpdateSeenAt = nowMs;
					return;
				}

				if ((nowMs - seenAt) < muKickStaleMs) {
					return;
				}

				// Throttle: 15s between kick requests.
				var lastKickAt = parseInt(self._transferMuWorkerLastKickAt, 10) || 0;
				if (lastKickAt && (nowMs - lastKickAt) < 15000) {
					return;
				}
				self._transferMuWorkerLastKickAt = nowMs;

				$.ajax({
					url: asenhaSiteBackup.ajaxUrl,
					type: 'POST',
					data: {
						action: 'asenha_kick_migration_worker_noauth',
						migration_id: migrationId
					}
				});
			};

			/**
			 * Poll using noauth endpoint (file-based state)
			 * Used when normal authenticated endpoint fails after DB restore.
			 * Falls back to static polling if noauth also fails during database import.
			 */
			var doPollNoAuth = function() {
				if (!self.currentTransferId) {
					return;
				}

				// If we've switched to static mode, use that instead.
				if (useStatic) {
					doPollStatic();
					return;
				}

				// During database step, switch to static polling early if noauth fails.
				if (inDatabaseStep() && consecutiveErrors >= 3 && getStaticUrl()) {
					useStatic = true;
					doPollStatic();
					return;
				}
				$.ajax({
					url: asenhaSiteBackup.ajaxUrl,
					type: 'POST',
					data: {
						action: 'asenha_get_transfer_progress_noauth',
						transfer_id: self.currentTransferId
					},
					success: function(response) {
						if (response.success) {
							handleStateResponse(response.data, 'noauth');
						} else {
							consecutiveErrors++;

							// Best-effort mu-plugin kick when progress endpoint fails.
							// The mu-plugin loads before regular plugins, so it works even
							// when ASE hooks fail due to incompatible extracted plugins.
							var migrationId = self.currentTransferMigrationId;
							if (migrationId) {
								var nowMs = Date.now ? Date.now() : (new Date()).getTime();
								var lastKickAt = parseInt(self._transferMuWorkerErrorKickAt, 10) || 0;
								if (!lastKickAt || (nowMs - lastKickAt) >= 10000) {
									self._transferMuWorkerErrorKickAt = nowMs;
									$.ajax({
										url: asenhaSiteBackup.ajaxUrl,
										type: 'POST',
										data: {
											action: 'asenha_kick_migration_worker_noauth',
											migration_id: String(migrationId)
										}
									});
								}
							}

							// During migration phase, switch to static polling after a few errors.
							// This covers all migration steps (files, search_replace, database, etc.),
							// not just the database step, because incompatible extracted plugins can
							// break admin-ajax at any point during the migration.
							if (consecutiveErrors >= 3 && getStaticUrl() && self.currentTransferMigrationId) {
								useStatic = true;
								doPollStatic();
								return;
							}
							// If still failing after many attempts, show completion anyway
							// (transfer likely completed but state was cleaned up)
							if (consecutiveErrors >= 90) {
								self.transferCompletedWithReload();
							}
						}
					},
					error: function(xhr) {
						consecutiveErrors++;

						// Best-effort mu-plugin kick when progress endpoint errors out.
						// The mu-plugin loads before regular plugins, so it works even
						// when ASE hooks fail due to incompatible extracted plugins.
						var migrationId = self.currentTransferMigrationId;
						if (migrationId) {
							var nowMs = Date.now ? Date.now() : (new Date()).getTime();
							var lastKickAt = parseInt(self._transferMuWorkerErrorKickAt, 10) || 0;
							if (!lastKickAt || (nowMs - lastKickAt) >= 10000) {
								self._transferMuWorkerErrorKickAt = nowMs;
								$.ajax({
									url: asenhaSiteBackup.ajaxUrl,
									type: 'POST',
									data: {
										action: 'asenha_kick_migration_worker_noauth',
										migration_id: String(migrationId)
									}
								});
							}
						}

						// During migration phase, switch to static polling after a few errors.
						// This covers all migration steps (files, search_replace, database, etc.),
						// not just the database step, because incompatible extracted plugins can
						// break admin-ajax at any point during the migration.
						if (consecutiveErrors >= 3 && getStaticUrl() && self.currentTransferMigrationId) {
							useStatic = true;
							doPollStatic();
							return;
						}
						// If WordPress can't access core tables, admin-ajax may fail. Prefer static polling when available.
						if (getStaticUrl() && xhr && looksLikeTablesUnavailable(xhr.responseText)) {
							useStatic = true;
							doPollStatic();
							return;
						}
						// If many consecutive errors, assume transfer completed
						if (consecutiveErrors >= 90) {
							self.transferCompletedWithReload();
						}
					}
				});
			};

			/**
			 * Single poll request (authenticated)
			 */
			var doPoll = function() {
				if (!self.currentTransferId) {
					return;
				}

				// If we've switched to static mode, use that
				if (useStatic) {
					doPollStatic();
					return;
				}

				// If we've switched to noauth mode, use that endpoint
				if (useNoAuth) {
					doPollNoAuth();
					return;
				}

				// Proactively switch to noauth when entering database step.
				if (inDatabaseStep()) {
					useNoAuth = true;
					doPollNoAuth();
					return;
				}

				$.ajax({
					url: asenhaSiteBackup.ajaxUrl,
					type: 'POST',
					data: {
						action: 'asenha_get_transfer_progress',
						nonce: asenhaSiteBackup.nonce,
						transfer_id: self.currentTransferId
					},
					success: function(response) {
						if (response.success) {
							handleStateResponse(response.data, 'auth');
							// If we just entered database step, switch to noauth for next poll.
							if (inDatabaseStep() && !useNoAuth) {
								useNoAuth = true;
							}
						} else {
							// Auth or permission error - switch to noauth endpoint
							consecutiveErrors++;

							// Best-effort mu-plugin kick when authenticated progress endpoint fails.
							// Incompatible extracted plugins may prevent ASE hooks from registering.
							var migrationId = self.currentTransferMigrationId;
							if (migrationId) {
								var nowMs = Date.now ? Date.now() : (new Date()).getTime();
								var lastKickAt = parseInt(self._transferMuWorkerErrorKickAt, 10) || 0;
								if (!lastKickAt || (nowMs - lastKickAt) >= 10000) {
									self._transferMuWorkerErrorKickAt = nowMs;
									$.ajax({
										url: asenhaSiteBackup.ajaxUrl,
										type: 'POST',
										data: {
											action: 'asenha_kick_migration_worker_noauth',
											migration_id: String(migrationId)
										}
									});
								}
							}

							// If DB tables are unavailable, fall back to static polling (if available).
							if (getStaticUrl() && response && response.data && response.data.message && looksLikeTablesUnavailable(response.data.message)) {
								useStatic = true;
								doPollStatic();
								return;
							}
							if (consecutiveErrors >= 2) {
								useNoAuth = true;
								doPollNoAuth();
							}
						}
					},
					error: function(xhr) {
						consecutiveErrors++;

						// Best-effort mu-plugin kick when authenticated endpoint errors out.
						// Incompatible extracted plugins may prevent ASE hooks from registering.
						var migrationId = self.currentTransferMigrationId;
						if (migrationId) {
							var nowMs = Date.now ? Date.now() : (new Date()).getTime();
							var lastKickAt = parseInt(self._transferMuWorkerErrorKickAt, 10) || 0;
							if (!lastKickAt || (nowMs - lastKickAt) >= 10000) {
								self._transferMuWorkerErrorKickAt = nowMs;
								$.ajax({
									url: asenhaSiteBackup.ajaxUrl,
									type: 'POST',
									data: {
										action: 'asenha_kick_migration_worker_noauth',
										migration_id: String(migrationId)
									}
								});
							}
						}

						// If admin-ajax is failing during DB import, prefer static polling when available.
						if (getStaticUrl() && xhr && looksLikeTablesUnavailable(xhr.responseText)) {
							useStatic = true;
							doPollStatic();
							return;
						}
						// During migration phase, switch to static polling after a few errors.
						// This covers all migration steps (files, search_replace, database, etc.),
						// not just the database step, because incompatible extracted plugins can
						// break admin-ajax at any point during the migration.
						if (consecutiveErrors >= 3 && getStaticUrl() && self.currentTransferMigrationId) {
							useStatic = true;
							doPollStatic();
							return;
						}
						// On error (likely auth failure after DB restore), try noauth endpoint
						if (consecutiveErrors >= 2) {
							useNoAuth = true;
							doPollNoAuth();
						}
					}
				});
			};

			// Poll immediately
			doPoll();

			// Then poll every second
			this.progressInterval = setInterval(doPoll, 1000);
		},

		/**
		 * Update transfer checkpoint states based on current step
		 *
		 * @param {jQuery}  $progress    Progress container element.
		 * @param {string}  currentStep  Current step name.
		 * @param {Object}  state        State data including sub_progress, bytes_received, total_bytes, etc.
		 */
		updateTransferCheckpoints: function($progress, currentStep, state) {
			var steps = this.transferSteps;
			var currentIndex = steps.indexOf(currentStep);
			var self = this;
			state = state || {};

			if (currentIndex === -1) {
				currentIndex = 0;
			}

			// Use last known sub_progress as fallback when current state doesn't have meaningful data
			var hasValidSubProgress = state.sub_progress && (state.sub_progress.label || state.sub_progress.current > 0);
			var effectiveState = state;
			if (!hasValidSubProgress && this.lastTransferSubProgress) {
				// Create a state object with the last known sub_progress
				effectiveState = $.extend({}, state, { sub_progress: this.lastTransferSubProgress });
			}

			$progress.find('.asenha-checkpoint').each(function() {
				var $checkpoint = $(this);
				var step = $checkpoint.data('step');
				var stepIndex = steps.indexOf(step);
				var $subLabel = $checkpoint.find('.asenha-checkpoint-sub');

				$checkpoint.removeClass('pending in-progress completed');

				if (stepIndex < currentIndex) {
					$checkpoint.addClass('completed');
					// Show completion stats for completed steps (not final completion, so isOperationComplete=false)
					// Only update if we have stats - preserve existing text if no stats available
					var statsText = self.formatTransferCompletedStats(step, state, false);
					if (statsText) {
						$subLabel.text(statsText);
					}
				} else if (stepIndex === currentIndex) {
					$checkpoint.addClass('in-progress');
					// Show progress indicator for current step (use effectiveState which includes fallback sub_progress)
					var progressText = self.formatTransferSubProgress(step, effectiveState);
					// Only update if we have meaningful progress text (not generic "Processing")
					if (progressText && progressText !== asenhaSbP('processing')) {
						$subLabel.text(progressText);
					}
					// Don't clear sub-label if no meaningful progressText - keep existing value
				} else {
					$checkpoint.addClass('pending');
					$subLabel.text('');
				}
			});
		},

		/**
		 * Format sub-progress text for transfer steps
		 *
		 * @param {string} step  Current step name.
		 * @param {Object} state State data.
		 * @return {string} Formatted progress text.
		 */
		formatTransferSubProgress: function(step, state) {
			if (!asenhaSiteBackup.subProgress) {
				return '';
			}

			switch (step) {
				case 'creating':
					if (state.sub_progress && state.sub_progress.zip_size > 0 && state.sub_progress.expected_size > 0) {
						var percent = Math.round((state.sub_progress.zip_size / state.sub_progress.expected_size) * 100);
						// Cap at 99% since expected_size is an estimate
						if (percent > 99) percent = 99;

						// Enrich archiving message when we also have file+DB stats available.
						var sp = state.sub_progress || {};
						var filesCount = sp.total_files || 0;
						var filesSize = sp.files_size || 0;
						var dbTables = sp.table_count || 0;
						var dbRows = sp.row_count || 0;
						var dbSqlSize = sp.sql_file_size || sp.db_size || 0;
						if (
							asenhaSiteBackup.subProgress.transferArchivingSummary
							&& filesCount > 0
							&& dbTables > 0
							&& dbRows > 0
						) {
							return asenhaSiteBackup.subProgress.transferArchivingSummary
								.replace('%1$s', this.formatNumber(filesCount))
								.replace('%2$s', this.formatBytes(filesSize))
								.replace('%3$s', this.formatNumber(dbTables))
								.replace('%4$s', this.formatNumber(dbRows))
								.replace('%5$s', this.formatBytes(dbSqlSize))
								.replace('%6$s', this.formatBytes(sp.zip_size))
								.replace('%7$s', this.formatBytes(sp.expected_size))
								.replace('%8$s', percent);
						}

						return asenhaSiteBackup.subProgress.finalizingArchive
							.replace('%1$s', this.formatBytes(state.sub_progress.zip_size))
							.replace('%2$s', this.formatBytes(state.sub_progress.expected_size))
							.replace('%3$s', percent);
					}
					// Show "Closing archive" when in closing phase
					if (state.sub_progress && state.sub_progress.label === 'closing') {
						return asenhaSbP('closingArchive');
					}

					// Show DB export progress when the source site is still exporting database.sql.
					if (state.sub_progress && (state.sub_progress.total || 0) > 0 && typeof state.sub_progress.table_rows !== 'undefined') {
						var dbCurrent = parseInt(state.sub_progress.current || 0, 10) || 0;
						var dbTotal = parseInt(state.sub_progress.total || 0, 10) || 0;
						var dbPercent = Math.round((dbCurrent / (dbTotal || 1)) * 100);
						dbPercent = Math.max(0, Math.min(100, dbPercent));

						var sqlSize = state.sub_progress.sql_file_size || 0;
						var tmpl = asenhaSiteBackup.subProgress.transferCreatingDbExport;
						if (tmpl) {
							return tmpl
								.replace('%1$s', this.formatNumber(state.sub_progress.total_files || 0))
								.replace('%2$s', this.formatBytes(state.sub_progress.files_size || 0))
								.replace('%3$s', String(state.sub_progress.label || ''))
								.replace('%4$s', this.formatNumber(state.sub_progress.table_rows || 0))
								.replace('%5$s', dbCurrent)
								.replace('%6$s', dbTotal)
								.replace('%7$s', dbPercent)
								.replace('%8$s', this.formatBytes(sqlSize));
						}
					}
					return asenhaSbP('processing');

				case 'downloading':
					if (state.bytes_received > 0 && state.total_bytes > 0) {
						var percent = Math.round((state.bytes_received / state.total_bytes) * 100);
						return asenhaSiteBackup.subProgress.downloadProgress
							.replace('%1$s', this.formatBytes(state.bytes_received))
							.replace('%2$s', this.formatBytes(state.total_bytes))
							.replace('%3$s', percent);
					}
					return asenhaSbP('starting');

				case 'files':
					if (state.sub_progress && state.sub_progress.label === 'importing') {
						var percent = Math.round(((state.sub_progress.current || 0) / (state.sub_progress.total || 1)) * 100);
						return asenhaSiteBackup.subProgress.importingFiles
							.replace('%1$d', state.sub_progress.current || 0)
							.replace('%2$d', state.sub_progress.total || 0)
							.replace('%3$s', percent);
					}
					return asenhaSbP('processing');

				case 'database':
					if (state.sub_progress && state.sub_progress.label === 'importing') {
						var percent = Math.round(((state.sub_progress.current || 0) / (state.sub_progress.total || 1)) * 100);
						var tableName = state.sub_progress.current_table_name || '';
						// Strip DB prefix for display consistency (migration/transfer/restore).
						var prefix = (asenhaSiteBackup && asenhaSiteBackup.dbPrefix) ? String(asenhaSiteBackup.dbPrefix) : '';
						if (prefix && tableName.indexOf(prefix) === 0) {
							tableName = tableName.slice(prefix.length);
						}
						var tableRows = state.sub_progress.current_table_rows_expected || 0;
						return asenhaSiteBackup.subProgress.importingTables
							.replace('%1$d', state.sub_progress.current || 0)
							.replace('%2$d', state.sub_progress.total || 0)
							.replace('%3$s', percent)
							.replace('%4$s', tableName)
							.replace('%5$s', this.formatNumber(tableRows));
					}
					return asenhaSbP('processing');

				case 'extracting':
					if (state.sub_progress && state.sub_progress.label === 'extracting' && state.sub_progress.total_size > 0) {
						var extractedSize = state.sub_progress.extracted_size || 0;
						var totalSize = state.sub_progress.total_size || 1;
						var percent = Math.round((extractedSize / totalSize) * 100);
						return asenhaSiteBackup.subProgress.extractingProgress
							.replace('%1$s', this.formatBytes(extractedSize))
							.replace('%2$s', this.formatBytes(totalSize))
							.replace('%3$s', percent);
					} else if (state.sub_progress && state.sub_progress.label === 'done') {
						// Show completion summary: "z MB extracted"
						if (state.sub_progress.total_size > 0) {
							return asenhaSiteBackup.subProgress.extractionComplete
								.replace('%s', this.formatBytes(state.sub_progress.total_size));
						}
						return asenhaSbP('done');
					}
					return asenhaSbP('processing');

				default:
					return asenhaSbP('processing');
			}
		},

		/**
		 * Format completion stats for completed transfer steps
		 *
		 * @param {string} step  Step name.
		 * @param {Object} state State data.
		 * @return {string} Formatted completion stats text.
		 */
		formatTransferCompletedStats: function(step, state, isOperationComplete) {
			if (!asenhaSiteBackup.subProgress) {
				return '';
			}

			// Get stored stats for this step (preferred) or fall back to state.sub_progress
			var stats = this.transferCompletedStats[step];

			switch (step) {
				case 'connecting':
					// Show "Done" as soon as connecting becomes a completed checkpoint (not only at final completion).
					// Note: while connecting is the current step, the UI uses formatTransferSubProgress(), so this
					// does not show "Done" prematurely.
					return asenhaSbP('done');

				case 'creating':
					// Show package size - try stored stats first, then state, then tracked value
					var packageSize = (stats && stats.package_size) || state.package_size || (this.transferPackageInfo && this.transferPackageInfo.total_bytes) || this.lastTransferPackageSize;
					if (packageSize && packageSize > 0) {
						// Prefer detailed summary when we also have file+DB stats.
						var sp = (stats && typeof stats === 'object') ? stats : null;
						if (!sp && state && state.sub_progress) {
							sp = state.sub_progress;
						}
						// Prefer the dedicated creating snapshot if available (it may contain richer stats
						// than the current state's sub_progress during step transitions).
						if ((!sp || typeof sp !== 'object') && this.lastTransferCreatingSubProgress) {
							sp = this.lastTransferCreatingSubProgress;
						}
						// Fallback to last known sub_progress (often more complete than the current state during step transitions).
						if ((!sp || typeof sp !== 'object') && this.lastTransferSubProgress) {
							sp = this.lastTransferSubProgress;
						}
						sp = sp || {};

						var filesCount = parseInt(sp.total_files || 0, 10) || 0;
						var filesSize = parseInt(sp.files_size || 0, 10) || 0;
						var tableCount = parseInt(sp.table_count || 0, 10) || 0;
						var rowCount = parseInt(sp.row_count || 0, 10) || 0;
						var dbSize = parseInt(sp.sql_file_size || sp.db_size || 0, 10) || 0;

						if (
							asenhaSiteBackup.subProgress.packageCreatedWithStats
							&& filesCount > 0
							&& filesSize > 0
							&& tableCount > 0
							&& rowCount > 0
							&& dbSize > 0
						) {
							return asenhaSiteBackup.subProgress.packageCreatedWithStats
								.replace('%1$s', this.formatBytes(packageSize))
								.replace('%2$s', this.formatNumber(filesCount))
								.replace('%3$s', this.formatBytes(filesSize))
								.replace('%4$s', this.formatNumber(tableCount))
								.replace('%5$s', this.formatNumber(rowCount))
								.replace('%6$s', this.formatBytes(dbSize));
						}

						return asenhaSiteBackup.subProgress.packageCreated
							.replace('%s', this.formatBytes(packageSize));
					}
					return '';

				case 'downloading':
					// Show downloaded size - try stored stats first, then state, then tracked value
					var downloadedSize = (stats && stats.total_bytes) || state.total_bytes || (this.transferPackageInfo && this.transferPackageInfo.total_bytes) || this.lastTransferDownloadSize;
					if (downloadedSize && downloadedSize > 0 && asenhaSiteBackup.subProgress.downloadComplete) {
						return asenhaSiteBackup.subProgress.downloadComplete
							.replace('%s', this.formatBytes(downloadedSize));
					}
					return '';

				case 'extracting':
					// Use stored stats (preferred) or fall back to state.sub_progress
					if (stats && stats.total_size && stats.total_size > 0) {
						return asenhaSiteBackup.subProgress.extractionComplete
							.replace('%s', this.formatBytes(stats.total_size));
					}
					// Fallback to state.sub_progress if stats not stored yet
					if (state.sub_progress && state.sub_progress.total_size > 0) {
						return asenhaSiteBackup.subProgress.extractionComplete
							.replace('%s', this.formatBytes(state.sub_progress.total_size));
					}
					// If we don't have extracted size, show "Done" to avoid an empty summary.
					// This is only used when the checkpoint is completed (updateTransferCheckpoints),
					// so it will not display prematurely while extracting is still in progress.
					return asenhaSbP('done');

				case 'files':
					// Use stored stats first
					if (stats) {
						var filesCount = stats.files_imported || stats.total_files;
						if (filesCount && filesCount > 0) {
							return asenhaSiteBackup.subProgress.filesImported
								.replace('%d', this.formatNumber(filesCount));
						}
					}
					// Fallback to tracked total (most reliable at completion)
					if (this.lastTransferFilesTotal > 0) {
						return asenhaSiteBackup.subProgress.filesImported
							.replace('%d', this.formatNumber(this.lastTransferFilesTotal));
					}
					// Fallback to state.sub_progress total (not current)
					if (state.sub_progress && state.sub_progress.total > 0) {
						return asenhaSiteBackup.subProgress.filesImported
							.replace('%d', this.formatNumber(state.sub_progress.total));
					}
					return '';

				case 'search_replace':
					// Check stored stats first
					if (stats && (stats.url_replacements !== undefined || stats.path_replacements !== undefined)) {
						var urlReplacements = stats.url_replacements || 0;
						var pathReplacements = stats.path_replacements || 0;
						var fixes = stats.serialized_fixes || 0;
						return asenhaSiteBackup.subProgress.searchReplaceStats
							.replace('%1$s', this.formatNumber(urlReplacements))
							.replace('%2$s', this.formatNumber(pathReplacements))
							.replace('%3$s', this.formatNumber(fixes));
					}
					// Fallback to tracked stats
					if (this.lastTransferSearchReplaceStats) {
						var srStats = this.lastTransferSearchReplaceStats;
						var urlReplacements = srStats.url_replacements || 0;
						var pathReplacements = srStats.path_replacements || 0;
						var fixes = srStats.serialized_fixes || 0;
						return asenhaSiteBackup.subProgress.searchReplaceStats
							.replace('%1$s', this.formatNumber(urlReplacements))
							.replace('%2$s', this.formatNumber(pathReplacements))
							.replace('%3$s', this.formatNumber(fixes));
					}
					// Show 'Done' only at operation completion when no stats available
					return isOperationComplete ? asenhaSbP('done') : '';

				case 'database':
					// Use stored stats first - prefer manifest row count when available
					if (stats && stats.tables_imported) {
						// Use manifest row count (from database_stats.total_rows) when available,
						// as it's more reliable than the incrementally tracked rows_imported
						var rowsImported = this.lastTransferManifestRowCount || stats.rows_imported || 0;
						return this.appendCollationRemapNote(
							asenhaSiteBackup.subProgress.tablesImported
								.replace('%1$d', stats.tables_imported)
								.replace('%2$s', this.formatNumber(rowsImported)),
							stats
						);
					}
					// Fallback to tracked total - prefer manifest row count
					if (this.lastTransferTablesTotal > 0) {
						var rowCount = this.lastTransferManifestRowCount || this.lastTransferRowsTotal || 0;
						return this.appendCollationRemapNote(
							asenhaSiteBackup.subProgress.tablesImported
								.replace('%1$d', this.lastTransferTablesTotal)
								.replace('%2$s', this.formatNumber(rowCount)),
							stats || {}
						);
					}
					// Fallback to state.sub_progress total (not current)
					if (state.sub_progress && state.sub_progress.total > 0) {
						var subProgressRows = this.lastTransferManifestRowCount || state.sub_progress.rows_imported || 0;
						return this.appendCollationRemapNote(
							asenhaSiteBackup.subProgress.tablesImported
								.replace('%1$d', state.sub_progress.total)
								.replace('%2$s', this.formatNumber(subProgressRows)),
							state.sub_progress
						);
					}
					return '';

				case 'cleanup':
					// Show 'Done' only at operation completion
					return isOperationComplete ? asenhaSbP('done') : '';

				case 'redirect':
					// Show 'Done' only at operation completion
					return isOperationComplete ? asenhaSbP('done') : '';

				default:
					return '';
			}
		},

		/**
		 * Transfer completed - show redirect countdown
		 */
		transferCompleted: function(state) {
			clearInterval(this.progressInterval);
			clearInterval(this.timeInterval);

			// Capture IDs before clearing so we can trigger best-effort cleanup.
			var transferId = this.currentTransferId;
			var migrationId = (state && state.migration_id) ? state.migration_id : '';
			// When polling falls back to static migration progress JSON, the migration ID is `state.id`
			// (and the transfer ID is typically exposed as `state.transfer_id`).
			if (!migrationId && state && state.id && state.transfer_id) {
				migrationId = state.id;
			}

			this.currentTransferId = null;
			this.currentTransferPublicProgressUrl = null;

			var self = this;
			var $progress = $('.asenha-transfer-progress');

			// --- Pre-completion step-jump detection ---
			// On small/fast sites the poller may jump from 'downloading' (or another early step)
			// directly to 'completed' without ever observing the migration-phase steps.
			// Retroactively populate stats for every step between the last observed step and 'cleanup'
			// so the final UI can show meaningful summaries instead of blank labels.
			var lastObserved = this.previousTransferStep || 'downloading';
			var lastIdx = this.transferSteps.indexOf(lastObserved);
			var cleanupIdx = this.transferSteps.indexOf('cleanup');
			if (lastIdx !== -1 && cleanupIdx > lastIdx + 1) {
				for (var skIdx = lastIdx + 1; skIdx < cleanupIdx; skIdx++) {
					var skStep = this.transferSteps[skIdx];
					if (this.transferCompletedStats[skStep]) {
						continue;
					}

					if (skStep === 'extracting') {
						if (this.lastTransferExtractionSize > 0) {
							this.transferCompletedStats['extracting'] = { label: 'done', total_size: this.lastTransferExtractionSize };
						} else {
							this.transferCompletedStats['extracting'] = { label: 'done' };
						}
					} else if (skStep === 'files') {
						if (this.lastTransferFilesTotal > 0) {
							this.transferCompletedStats['files'] = { label: 'done', files_imported: this.lastTransferFilesTotal };
						} else if (state && state.files_step_stats && state.files_step_stats.total_files > 0) {
							this.transferCompletedStats['files'] = { label: 'done', files_imported: state.files_step_stats.total_files };
						} else {
							this.transferCompletedStats['files'] = { label: 'done' };
						}
					} else if (skStep === 'search_replace') {
						if (this.lastTransferSearchReplaceStats) {
							this.transferCompletedStats['search_replace'] = {
								label: 'done',
								url_replacements: this.lastTransferSearchReplaceStats.url_replacements || 0,
								path_replacements: this.lastTransferSearchReplaceStats.path_replacements || 0,
								serialized_fixes: this.lastTransferSearchReplaceStats.serialized_fixes || 0
							};
						} else if (state && state.search_replace_stats) {
							this.transferCompletedStats['search_replace'] = {
								label: 'done',
								url_replacements: state.search_replace_stats.url_replacements || 0,
								path_replacements: state.search_replace_stats.path_replacements || 0,
								serialized_fixes: state.search_replace_stats.serialized_fixes || 0
							};
						} else if (state && state.search_replace_step_stats) {
							this.transferCompletedStats['search_replace'] = {
								label: 'done',
								url_replacements: state.search_replace_step_stats.url_replacements || 0,
								path_replacements: state.search_replace_step_stats.path_replacements || 0,
								serialized_fixes: state.search_replace_step_stats.serialized_fixes || 0
							};
						} else {
							this.transferCompletedStats['search_replace'] = { label: 'done' };
						}
					} else if (skStep === 'database') {
						if (this.lastTransferTablesTotal > 0) {
							var dbRowCount = this.lastTransferManifestRowCount || this.lastTransferRowsTotal || 0;
							this.transferCompletedStats['database'] = { label: 'done', tables_imported: this.lastTransferTablesTotal, rows_imported: dbRowCount };
						} else if (state && state.database_stats && state.database_stats.total_tables > 0) {
							this.transferCompletedStats['database'] = { label: 'done', tables_imported: state.database_stats.total_tables, rows_imported: state.database_stats.total_rows || 0 };
						} else {
							this.transferCompletedStats['database'] = { label: 'done' };
						}
					} else {
						this.transferCompletedStats[skStep] = { label: 'done' };
					}
				}
			}

			// Store any missing stats from tracked values before updating UI
			if (!this.transferCompletedStats['creating'] && this.lastTransferPackageSize > 0) {
				this.transferCompletedStats['creating'] = { package_size: this.lastTransferPackageSize };
			}
			if (!this.transferCompletedStats['downloading'] && this.lastTransferDownloadSize > 0) {
				this.transferCompletedStats['downloading'] = { total_bytes: this.lastTransferDownloadSize };
			}
			if (!this.transferCompletedStats['files'] && this.lastTransferFilesTotal > 0) {
				this.transferCompletedStats['files'] = { files_imported: this.lastTransferFilesTotal };
			}
			if (!this.transferCompletedStats['database'] && this.lastTransferTablesTotal > 0) {
				// Prefer manifest row count (from database_stats.total_rows) as it's more reliable
				var rowCount = this.lastTransferManifestRowCount || this.lastTransferRowsTotal || 0;
				this.transferCompletedStats['database'] = { tables_imported: this.lastTransferTablesTotal, rows_imported: rowCount };
			}
			if (!this.transferCompletedStats['search_replace'] && this.lastTransferSearchReplaceStats) {
				this.transferCompletedStats['search_replace'] = this.lastTransferSearchReplaceStats;
			}
			
			// Mark all checkpoints as completed and set summaries
			$progress.find('.asenha-checkpoint').each(function() {
				var $checkpoint = $(this);
				var step = $checkpoint.data('step');
				var $subLabel = $checkpoint.find('.asenha-checkpoint-sub');
				
				$checkpoint.removeClass('pending in-progress').addClass('completed');
				
				// Get stats from formatTransferCompletedStats (operation complete, so isOperationComplete=true)
				var statsText = self.formatTransferCompletedStats(step, state, true);
				if (statsText) {
					$subLabel.text(statsText);
				}
			});
			
			$progress.find('.asenha-circle-progress').attr('stroke-dasharray', '100, 100').addClass('completed');
			$progress.find('.asenha-progress-percent').text('100%');
			
			// Hide remaining time section
			$progress.find('.asenha-time-remaining').hide();

			// Hide the Cancel Transfer button when transfer is complete
			$('#asenha-cancel-transfer').hide();

			// Show completion UI with Reload Now button
			this.showCompletionUI($progress, 'transfer');

			// Best-effort: request immediate cleanup now that the UI has a final state.
			// This complements scheduled cleanup + plugins_loaded GC fallback.
			// - migrationId cleans up migration artifacts (restore_state/mapping/progress/locks)
			// - transferId cleans up transfer artifacts (transfer_session/public progress/transfer_receive zip)
			if (migrationId) {
				this.triggerMigrationCleanupNoAuth(migrationId);
			}
			if (transferId) {
				this.triggerTransferCleanupNoAuth(transferId);
			}

			// Retry once after a short delay: admin-ajax.php can be briefly unstable immediately after DB import.
			// Cleanup endpoints are final-state-only and idempotent, so it is safe to re-fire once.
			if (migrationId || transferId) {
				setTimeout(function() {
					if (migrationId) {
						self.triggerMigrationCleanupNoAuth(migrationId);
					}
					if (transferId) {
						self.triggerTransferCleanupNoAuth(transferId);
					}
				}, 10000);
			}
		},

		/**
		 * Transfer completed with immediate reload (fallback when state is unavailable)
		 *
		 * Called when we detect transfer completed but couldn't get final state.
		 * This typically happens when the state was already cleaned up.
		 */
		transferCompletedWithReload: function() {
			clearInterval(this.progressInterval);
			clearInterval(this.timeInterval);

			this.currentTransferId = null;
			this.currentTransferPublicProgressUrl = null;

			var self = this;

			/**
			 * Populate tracking variables and transferCompletedStats from a state object.
			 * Used to ingest stats from the static public progress JSON before rendering.
			 *
			 * @param {Object} state State payload (may be from static JSON or AJAX response).
			 */
			var ingestStatsFromState = function(state) {
				if (!state || typeof state !== 'object') {
					return;
				}

				// Database stats (manifest totals).
				if (state.database_stats && state.database_stats.total_tables > 0) {
					self.lastTransferTablesTotal = parseInt(state.database_stats.total_tables, 10) || self.lastTransferTablesTotal;
				}
				if (state.database_stats && state.database_stats.total_rows > 0) {
					self.lastTransferManifestRowCount = parseInt(state.database_stats.total_rows, 10);
					self.lastTransferRowsTotal = self.lastTransferManifestRowCount;
				}

				// Files step stats.
				if (state.files_step_stats && state.files_step_stats.total_files > 0) {
					self.lastTransferFilesTotal = parseInt(state.files_step_stats.total_files, 10) || self.lastTransferFilesTotal;
				}

				// Search/replace stats (check both field names).
				var srStats = state.search_replace_stats || state.search_replace_step_stats;
				if (srStats && (srStats.url_replacements !== undefined || srStats.path_replacements !== undefined)) {
					self.lastTransferSearchReplaceStats = {
						url_replacements: srStats.url_replacements || 0,
						path_replacements: srStats.path_replacements || 0,
						serialized_fixes: srStats.serialized_fixes || 0
					};
				}

				// Sub-progress completion stats (e.g. database 'done' with tables_imported).
				if (state.sub_progress && state.sub_progress.label === 'done') {
					if (state.sub_progress.tables_imported > 0 && !self.lastTransferTablesTotal) {
						self.lastTransferTablesTotal = parseInt(state.sub_progress.tables_imported, 10);
					}
					if (state.sub_progress.rows_imported > 0 && !self.lastTransferRowsTotal) {
						self.lastTransferRowsTotal = parseInt(state.sub_progress.rows_imported, 10);
					}
					if (state.sub_progress.files_imported > 0 && !self.lastTransferFilesTotal) {
						self.lastTransferFilesTotal = parseInt(state.sub_progress.files_imported, 10);
					}
				}
			};

			/**
			 * Render the forced-completion UI using whatever stats are available.
			 */
			var renderCompletion = function() {
				var $progress = $('.asenha-transfer-progress');

				// Store any missing stats from tracked values before updating UI.
				if (!self.transferCompletedStats['creating'] && self.lastTransferPackageSize > 0) {
					self.transferCompletedStats['creating'] = { package_size: self.lastTransferPackageSize };
				}
				if (!self.transferCompletedStats['downloading'] && self.lastTransferDownloadSize > 0) {
					self.transferCompletedStats['downloading'] = { total_bytes: self.lastTransferDownloadSize };
				}
				if (!self.transferCompletedStats['files'] && self.lastTransferFilesTotal > 0) {
					self.transferCompletedStats['files'] = { files_imported: self.lastTransferFilesTotal };
				}
				if (!self.transferCompletedStats['database'] && self.lastTransferTablesTotal > 0) {
					// Prefer manifest row count (from database_stats.total_rows) as it's more reliable.
					var rowCount = self.lastTransferManifestRowCount || self.lastTransferRowsTotal || 0;
					self.transferCompletedStats['database'] = { tables_imported: self.lastTransferTablesTotal, rows_imported: rowCount };
				}
				if (!self.transferCompletedStats['search_replace'] && self.lastTransferSearchReplaceStats) {
					self.transferCompletedStats['search_replace'] = self.lastTransferSearchReplaceStats;
				}

				// Mark all checkpoints as completed and set summaries.
				$progress.find('.asenha-checkpoint').each(function() {
					var $checkpoint = $(this);
					var step = $checkpoint.data('step');
					var $subLabel = $checkpoint.find('.asenha-checkpoint-sub');

					$checkpoint.removeClass('pending in-progress').addClass('completed');

					// Get stats from formatTransferCompletedStats (operation complete, so isOperationComplete=true).
					var statsText = self.formatTransferCompletedStats(step, {}, true);
					if (statsText) {
						$subLabel.text(statsText);
					}
				});

				$progress.find('.asenha-circle-progress').attr('stroke-dasharray', '100, 100').addClass('completed');
				$progress.find('.asenha-progress-percent').text('100%');

				// Hide remaining time section.
				$progress.find('.asenha-time-remaining').hide();

				// Hide the Cancel Transfer button when transfer is complete.
				$('#asenha-cancel-transfer').hide();

				// Show completion UI with Reload Now button.
				self.showCompletionUI($progress, 'transfer');
			};

			// Last-ditch attempt: try to read the static public progress JSON to capture
			// any step stats that were persisted by the migration worker. The public JSON
			// includes database_stats, files_step_stats, search_replace_stats, etc.
			// This helps produce accurate step summaries even when the normal polling path
			// was broken by incompatible extracted plugins causing admin-ajax 400 errors.
			var staticUrl = this.currentTransferMigrationPublicProgressUrl;
			if (!staticUrl && this.currentTransferMigrationId) {
				staticUrl = this.getMigrationPublicProgressUrl(this.currentTransferMigrationId);
			}

			if (staticUrl) {
				var fetchUrl = staticUrl;
				fetchUrl += (fetchUrl.indexOf('?') === -1 ? '?' : '&') + 't=' + Date.now();

				$.ajax({
					url: fetchUrl,
					type: 'GET',
					dataType: 'json',
					cache: false,
					timeout: 3000,
					success: function(state) {
						if (state && typeof state === 'object') {
							ingestStatsFromState(state);
						}
						renderCompletion();
					},
					error: function() {
						// Static JSON unavailable -- render with whatever stats we already have.
						renderCompletion();
					}
				});
			} else {
				// No static URL available -- render immediately.
				renderCompletion();
			}
		},

		/**
		 * Transfer failed
		 */
		transferFailed: function(message) {
			clearInterval(this.progressInterval);
			clearInterval(this.timeInterval);

			this.currentTransferId = null;
			this.currentTransferPublicProgressUrl = null;

			var $progress = $('.asenha-transfer-progress');
			$progress.find('.asenha-checkpoint.in-progress').removeClass('in-progress').addClass('failed');
			$progress.find('.asenha-circle-progress').addClass('failed');

			$('#asenha-start-transfer').prop('disabled', false);

			this.showNotice('error', message || asenhaSiteBackup.strings.transferFailed);
		},

		/**
		 * Cancel ongoing transfer
		 */
		cancelTransfer: function(e) {
			e.preventDefault();

			if (!this.currentTransferId) {
				return;
			}

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_cancel_transfer',
					nonce: asenhaSiteBackup.nonce,
					transfer_id: this.currentTransferId,
					type: 'receive'
				},
				success: function(response) {
					clearInterval(this.progressInterval);
					clearInterval(this.timeInterval);

					this.currentTransferId = null;

					$('.asenha-transfer-progress').hide();
					$('#asenha-start-transfer').prop('disabled', false);

					this.showNotice('info', asenhaSbT('transferCancelled'));
				}.bind(this)
			});
		},

		/**
		 * Show completion UI with Reload Now button
		 *
		 * Displays a success message with a "Reload Now" button for all operations.
		 * No auto-redirect - user must click the button to reload.
		 *
		 * @param {jQuery} $progress     The progress container element.
		 * @param {string} operationType Type of operation ('backup', 'restore', 'migration', or 'transfer').
		 */
		showCompletionUI: function($progress, operationType) {
			// Determine success message and info message based on operation type
			var successMessage, infoMessage, buttonLabel, useReload = false;
			buttonLabel = asenhaSbT('reloadNow');
			
			switch (operationType) {
				case 'backup':
					successMessage = asenhaSbT('backupCompleted');
					infoMessage = asenhaSbT('reloadPromptBackup');
					useReload = true;
					break;
				case 'restore':
					successMessage = asenhaSbT('restoreCompleted');
					infoMessage = asenhaSbT('reloadPromptRestore');
					buttonLabel = asenhaSbT('reloadNow');
					useReload = true;
					break;
				case 'transfer':
					successMessage = asenhaSbT('transferCompleted');
					infoMessage = asenhaSbT('reloadPrompt');
					break;
				case 'migration':
				default:
					successMessage = asenhaSbT('migrationCompleted');
					infoMessage = asenhaSbT('reloadPrompt');
					break;
			}

			// Build the completion UI HTML
			var completionHtml = '<div class="asenha-completion-ui">';
			completionHtml += '<div class="asenha-completion-success-icon">✓</div>';
			completionHtml += '<div class="asenha-completion-message">' + successMessage + '</div>';
			completionHtml += '<div class="asenha-completion-info">';
			completionHtml += infoMessage;
			completionHtml += '</div>';
			completionHtml += '<div class="asenha-completion-actions">';
			completionHtml += '<button type="button" class="button button-primary asenha-reload-now-btn">';
			completionHtml += buttonLabel;
			completionHtml += '</button>';
			completionHtml += '</div>';
			completionHtml += '</div>';

			// Insert completion section after the last checkpoint in the checklist
			$progress.find('.asenha-completion-ui').remove(); // Remove any existing completion UI
			$progress.find('.asenha-reload-section').remove(); // Remove any existing reload section
			var $checklist = $progress.find('.asenha-progress-checklist');
			if ($checklist.length) {
				$checklist.append(completionHtml);
			} else {
				$progress.append(completionHtml);
			}

			// Handle completion CTA click - use reload for backup/restore, login redirect otherwise (migration/transfer).
			$progress.find('.asenha-reload-now-btn').on('click', function(e) {
				e.preventDefault();
				if (useReload) {
					window.location.reload();
				} else {
					window.location.href = asenhaSiteBackup.loginUrl || '/wp-login.php';
				}
			});
		},

		/**
		 * Initialize Templates UI (Backup subtab + template picker).
		 */
		initTemplatesUi: function() {
			// Templates list view.
			if ($('#asenha-backup-templates-list').length) {
				this.refreshTemplatesList();
			}

			// Ensure picker is hidden on load.
			if ($('#asenha-backup-template-picker').length) {
				$('#asenha-backup-template-picker').hide();
			}
		},

		/**
		 * Initialize Policies UI (Backup > Policies subtab).
		 */
		initPoliciesUi: function() {
			var self = this;
			var setPoliciesCronGuidanceExpanded = function(isExpanded, moveFocusToHeading) {
				var $trigger = $('#asenha-policies-cron-guidance-trigger');
				var $guidance = $('#asenha-policies-cron-guidance');
				var $guidanceHeading = $('#asenha-policies-cron-guidance-heading');

				if (!$trigger.length || !$guidance.length) {
					return;
				}

				$guidance.prop('hidden', !isExpanded);
				$trigger.attr('aria-expanded', isExpanded ? 'true' : 'false');

				if (isExpanded && moveFocusToHeading && $guidanceHeading.length) {
					$guidanceHeading.trigger('focus');
				}

				if (!isExpanded) {
					$trigger.trigger('focus');
				}
			};

			if (!$('#asenha-backup-policies-list').length) {
				return;
			}

			this.refreshPoliciesList();

			$(document).off('click.asenhaPoliciesCronGuidance').on('click.asenhaPoliciesCronGuidance', '#asenha-policies-cron-guidance-trigger', function(e) {
				e.preventDefault();
				setPoliciesCronGuidanceExpanded($(this).attr('aria-expanded') !== 'true', true);
			});

			$(document).off('click.asenhaPoliciesCronGuidanceDismiss').on('click.asenhaPoliciesCronGuidanceDismiss', '#asenha-policies-cron-guidance .asenha-policies-cron-guidance-dismiss', function(e) {
				e.preventDefault();
				setPoliciesCronGuidanceExpanded(false, false);
			});

			$(document).off('click.asenhaCreatePolicy').on('click.asenhaCreatePolicy', '#asenha-create-backup-policy', function(e) {
				e.preventDefault();
				self.openPolicyModal(null);
			});

			$(document).off('click.asenhaEditPolicy').on('click.asenhaEditPolicy', '.asenha-policy-edit', function(e) {
				e.preventDefault();
				var id = String($(this).data('policyId') || $(this).data('policy-id') || '');
				if (!id) {
					return;
				}
				var policy = self.getCachedPolicyById(id);
				if (!policy) {
					self.showNotice('error', asenhaSbT('requestFailed'));
					return;
				}
				self.openPolicyModal(policy);
			});

			$(document).off('click.asenhaDeletePolicy').on('click.asenhaDeletePolicy', '.asenha-policy-delete', function(e) {
				e.preventDefault();
				var id = String($(this).data('policyId') || $(this).data('policy-id') || '');
				if (!id) {
					return;
				}
				if (!window.confirm(asenhaSbT('policyDeleteConfirm'))) {
					return;
				}
				self.deletePolicy(id);
			});

			$(document).off('change.asenhaTogglePolicy').on('change.asenhaTogglePolicy', '.asenha-policy-toggle-enabled', function() {
				var id = String($(this).data('policyId') || $(this).data('policy-id') || '');
				if (!id) {
					return;
				}
				self.togglePolicy(id, $(this).is(':checked'));
			});

			$(document).off('click.asenhaRunPolicyNow').on('click.asenhaRunPolicyNow', '.asenha-policy-run-now', function(e) {
				e.preventDefault();
				var $button = $(this);
				if ($button.prop('disabled')) {
					return;
				}
				var id = String($(this).data('policyId') || $(this).data('policy-id') || '');
				if (!id) {
					return;
				}
				self.runPolicyNow(id, $button);
			});
		},

		updateBackupPolicyStatus: function(policies) {
			var $status = $('#asenha-backup-policy-status');
			if (!$status.length) {
				return;
			}

			policies = $.isArray(policies) ? policies : [];
			var enabledCount = 0;
			for (var i = 0; i < policies.length; i++) {
				var policy = policies[i] || {};
				if (!!policy.enabled) {
					enabledCount++;
				}
			}

			var enabledSingular = String($status.attr('data-enabled-singular') || asenhaSbT('policyStatusEnabledSingular') || '%s backup policy enabled');
			var enabledPlural = String($status.attr('data-enabled-plural') || asenhaSbT('policyStatusEnabledPlural') || '%s backup policies enabled');
			var noneEnabledText = String($status.attr('data-none-enabled') || asenhaSbT('policyStatusNoneEnabled') || 'No backup policies enabled.');
			var createNowLabel = String($status.attr('data-create-label') || asenhaSbT('policyStatusCreateNow') || 'Create one now');
			var policiesUrl = String($status.attr('data-policies-url') || '');
			var html = '';

			if (enabledCount > 0) {
				var enabledLabel = this.formatCountLabel(enabledCount, enabledSingular, enabledPlural);
				$status.removeClass('is-warning').addClass('is-success');
				html += '<span class="dashicons dashicons-yes-alt asenha-backup-subtabs-status-icon" aria-hidden="true"></span>';
				html += '<span class="asenha-backup-subtabs-status-text">' + this.escapeHtml(enabledLabel) + '</span>';
			} else {
				$status.removeClass('is-success').addClass('is-warning');
				html += '<span class="dashicons dashicons-warning asenha-backup-subtabs-status-icon" aria-hidden="true"></span>';
				html += '<span class="asenha-backup-subtabs-status-text">' + this.escapeHtml(noneEnabledText) + '</span>';
				if (policiesUrl) {
					html += '<a class="asenha-backup-subtabs-status-link" href="' + this.escapeAttr(policiesUrl) + '">' + this.escapeHtml(createNowLabel) + '</a>';
				}
			}

			$status.html(html);
		},

		refreshPoliciesList: function() {
			var self = this;
			var $wrap = $('#asenha-backup-policies-list');
			if (!$wrap.length) {
				return;
			}

			$wrap.html('<p class="description">' + this.escapeHtml(asenhaSbT('loading')) + '</p>');

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_get_backup_policies',
					nonce: asenhaSiteBackup.nonce
				}
			}).done(function(resp) {
				if (!resp || !resp.success || !resp.data) {
					$wrap.html('<p class="description">' + self.escapeHtml(asenhaSbT('requestFailed')) + '</p>');
					return;
				}

				self.policiesCache = (resp.data && $.isArray(resp.data.policies)) ? resp.data.policies : [];
				self.updateBackupPolicyStatus(self.policiesCache);
				$wrap.html(self.renderPoliciesTableHtml(self.policiesCache));
			}).fail(function() {
				$wrap.html('<p class="description">' + self.escapeHtml(asenhaSbT('requestFailed')) + '</p>');
			});
		},

		renderPoliciesTableHtml: function(policies) {
			policies = $.isArray(policies) ? policies : [];
			if (!policies.length) {
				return '<p class="description">' + this.escapeHtml(asenhaSbT('policyNoPolicies')) + '</p>';
			}

			var html = '';
			html += '<table class="wp-list-table widefat fixed striped asenha-policies-list">';
			html += '<thead><tr>';
			html += '<th class="column-title-status">' + this.escapeHtml(asenhaSbT('policyTitleAndStatus') || asenhaSbT('templateTitle')) + '</th>';
			html += '<th class="column-backup">' + this.escapeHtml(asenhaSbT('policyBackup') || asenhaSbT('policyType')) + '</th>';
			html += '<th class="column-frequency-retention">' + this.escapeHtml(asenhaSbT('policyFrequencyRetention') || ((asenhaSbT('policyFrequency') || 'Frequency') + ' & ' + (asenhaSbT('policyRetention') || 'Retention'))) + '</th>';
			html += '<th class="column-locations">' + this.escapeHtml(asenhaSbT('policyLocations')) + '</th>';
			html += '<th class="column-estimate">' + this.escapeHtml(asenhaSbT('policyStorage') || asenhaSbT('policyStorageEstimate')) + '</th>';
			html += '<th class="column-runs">' + this.escapeHtml(asenhaSbT('policyRuns') || asenhaSbT('policyNextRun')) + '</th>';
			html += '<th class="column-actions">' + this.escapeHtml(asenhaSbT('actions')) + '</th>';
			html += '</tr></thead><tbody>';

			for (var i = 0; i < policies.length; i++) {
				var policy = policies[i] || {};
				var id = String(policy.id || '');
				if (!id) {
					continue;
				}
				var hasAnyRuns = this.policyHasAnyRuns(policy);

				var estimate = policy.storage_estimate || null;
				html += '<tr data-policy-id="' + this.escapeAttr(id) + '">';
				html += '<td class="column-title-status">';
				html += '<div class="asenha-policy-cell-lines">';
				html += '<div class="asenha-policy-cell-line"><strong>' + this.escapeHtml(String(policy.title || '')) + '</strong></div>';
				html += '<div class="asenha-policy-cell-line">';
				html += '<label class="asenha-policy-toggle asenha-policy-toggle-inline">';
				html += '<input type="checkbox" class="asenha-policy-toggle-enabled" data-policy-id="' + this.escapeAttr(id) + '"' + (policy.enabled ? ' checked' : '') + ' />';
				html += '<span>' + this.escapeHtml(asenhaSbT('policyEnabled')) + '</span>';
				html += '</label>';
				html += '</div>';
				var failureNotificationSummary = this.formatPolicyFailureNotificationSummary(policy);
				if (failureNotificationSummary) {
					html += '<div class="asenha-policy-cell-line asenha-policy-failure-notification-line">' + this.escapeHtml(failureNotificationSummary) + '</div>';
				}
				var archivesHealth = policy.archives_size_health && typeof policy.archives_size_health === 'object' ? policy.archives_size_health : null;
				if (archivesHealth && archivesHealth.warning && archivesHealth.message) {
					html += '<div class="asenha-policy-cell-line asenha-policy-archives-size-health notice notice-warning inline"><p>' + this.escapeHtml(String(archivesHealth.message)) + '</p></div>';
				}
				html += '</div>';
				html += '</td>';
				html += '<td class="column-backup">' + this.renderPolicyBackupHtml(policy) + '</td>';
				html += '<td class="column-frequency-retention">' + this.renderPolicyFrequencyRetentionHtml(policy) + '</td>';
				html += '<td class="column-locations">' + this.renderPolicyLocationsHtml(policy) + '</td>';
				html += '<td class="column-estimate">' + this.renderPolicyStorageHtml(estimate) + '</td>';
				html += '<td class="column-runs">' + this.formatPolicyRunsHtml(policy) + '</td>';
				html += '<td class="column-actions">';
				html += '<div class="asenha-policy-actions-stack">';
				if (!hasAnyRuns) {
					html += '<button type="button" class="button button-small asenha-policy-run-now" data-policy-id="' + this.escapeAttr(id) + '">' + this.escapeHtml(asenhaSbT('policyRunNow')) + '</button>';
				}
				html += '<button type="button" class="button button-small asenha-policy-edit" data-policy-id="' + this.escapeAttr(id) + '">' + this.escapeHtml(asenhaSbT('edit')) + '</button>';
				html += '<button type="button" class="button button-small asenha-policy-delete" data-policy-id="' + this.escapeAttr(id) + '">' + this.escapeHtml(asenhaSbT('remove')) + '</button>';
				html += '</div>';
				html += '</td>';
				html += '</tr>';
			}

			html += '</tbody></table>';
			return html;
		},

		policyHasAnyRuns: function(policy) {
			policy = policy || {};
			var runsDisplay = (policy.runs_display && typeof policy.runs_display === 'object') ? policy.runs_display : {};
			var totalRuns = parseInt(runsDisplay.total_runs, 10);
			if (!isNaN(totalRuns) && totalRuns > 0) {
				return true;
			}

			totalRuns = parseInt(policy.run_count, 10);
			if (!isNaN(totalRuns) && totalRuns > 0) {
				return true;
			}

			var lastRun = (runsDisplay.last_run && typeof runsDisplay.last_run === 'object') ? runsDisplay.last_run : {};
			if (lastRun.available === true) {
				return true;
			}

			var lastRunAt = parseInt(policy.last_run_at, 10);
			return !isNaN(lastRunAt) && lastRunAt > 0;
		},

		getCachedPolicyById: function(id) {
			id = String(id || '');
			if (!id || !this.policiesCache || !this.policiesCache.length) {
				return null;
			}
			for (var i = 0; i < this.policiesCache.length; i++) {
				var p = this.policiesCache[i] || {};
				if (String(p.id || '') === id) {
					return p;
				}
			}
			return null;
		},

		getPolicyTypeLabel: function(policy) {
			policy = policy || {};
			var type = String(policy.type || 'full');
			var options = (asenhaSiteBackup && asenhaSiteBackup.policyOptions && $.isArray(asenhaSiteBackup.policyOptions.types)) ? asenhaSiteBackup.policyOptions.types : [];
			for (var i = 0; i < options.length; i++) {
				var opt = options[i] || {};
				if (String(opt.value || '') === type) {
					return String(opt.label || type);
				}
			}
			return type;
		},

		getPolicyMethodLabel: function(method) {
			method = String(method || 'baseline');
			var options = (asenhaSiteBackup && asenhaSiteBackup.policyOptions && $.isArray(asenhaSiteBackup.policyOptions.methods)) ? asenhaSiteBackup.policyOptions.methods : [];
			for (var i = 0; i < options.length; i++) {
				var opt = options[i] || {};
				if (String(opt.value || '') === method) {
					return String(opt.label || method);
				}
			}
			return method;
		},

		getPolicyMethodShortLabel: function(method) {
			method = String(method || 'baseline');
			if (method === 'incremental') {
				return String(asenhaSbT('policyMethodIncrementalShort') || 'Incremental');
			}
			return String(asenhaSbT('policyMethodCompleteShort') || 'Complete');
		},

		renderPolicyMethodBadgeHtml: function(method) {
			method = String(method || '');
			if (method !== 'baseline' && method !== 'incremental') {
				return '';
			}
			return '<span class="asenha-backup-badge asenha-backup-badge-multipart asenha-policy-run-method-badge">' + this.escapeHtml(this.getPolicyMethodShortLabel(method)) + '</span>';
		},

		getPolicyFrequencyLabel: function(method, key) {
			method = String(method || 'baseline');
			key = String(key || '');
			var listKey = (method === 'incremental') ? 'frequencies_incremental' : 'frequencies_complete';
			var options = (asenhaSiteBackup && asenhaSiteBackup.policyOptions && $.isArray(asenhaSiteBackup.policyOptions[listKey])) ? asenhaSiteBackup.policyOptions[listKey] : [];
			for (var i = 0; i < options.length; i++) {
				var opt = options[i] || {};
				if (String(opt.value || '') === key) {
					return String(opt.label || key);
				}
			}
			return key;
		},

		getPolicyRetentionPeriodLabel: function(key) {
			key = String(key || '');
			var options = (asenhaSiteBackup && asenhaSiteBackup.policyOptions && $.isArray(asenhaSiteBackup.policyOptions.retention_periods)) ? asenhaSiteBackup.policyOptions.retention_periods : [];
			for (var i = 0; i < options.length; i++) {
				var opt = options[i] || {};
				if (String(opt.value || '') === key) {
					return String(opt.label || key);
				}
			}
			return key;
		},

		getPolicyFailureNotificationUsers: function() {
			var users = (asenhaSiteBackup && $.isArray(asenhaSiteBackup.policyFailureNotificationUsers)) ? asenhaSiteBackup.policyFailureNotificationUsers : [];
			return users;
		},

		getPolicyFailureNotificationEnhancer: function() {
			var enhancer = (asenhaSiteBackup && asenhaSiteBackup.policyFailureNotificationEnhancer) ? String(asenhaSiteBackup.policyFailureNotificationEnhancer) : '';
			enhancer = enhancer.toLowerCase();
			if (enhancer !== 'select2' && enhancer !== 'chosen') {
				enhancer = '';
			}
			return enhancer;
		},

		destroyPolicyFailureNotificationUsersSelectEnhancer: function($select) {
			if (!$select || !$select.length) {
				return;
			}

			if ($select.hasClass('select2-hidden-accessible') && typeof $select.select2 === 'function') {
				$select.select2('destroy');
			}

			if (typeof $select.chosen === 'function' && $select.data('chosen')) {
				$select.chosen('destroy');
			}

			$select.removeClass('chosen-select');
		},

		enhancePolicyFailureNotificationUsersSelect: function($select) {
			if (!$select || !$select.length) {
				return;
			}

			var enhancer = this.getPolicyFailureNotificationEnhancer();
			var placeholder = String(asenhaSbT('policyFailureNotificationPlaceholder') || 'Select admin users');
			var noResultsText = String(asenhaSbT('policyFailureNotificationNoUsers') || 'No admin users found.');
			$select.attr('data-placeholder', placeholder);

			if ((enhancer === 'select2' || enhancer === '') && typeof $select.select2 === 'function') {
				var $policyModal = $('#asenha-policy-modal');
				$select.select2({
					width: '100%',
					closeOnSelect: false,
					dropdownParent: $policyModal.length ? $policyModal : $(document.body),
					placeholder: placeholder,
					language: {
						noResults: function() {
							return noResultsText;
						}
					}
				});
				return;
			}

			if ((enhancer === 'chosen' || enhancer === '') && typeof $select.chosen === 'function') {
				$select.addClass('chosen-select');
				$select.chosen({
					width: '100%',
					search_contains: true,
					disable_search_threshold: 0,
					placeholder_text_multiple: placeholder,
					no_results_text: noResultsText + ' '
				});
			}
		},

		normalizePolicyFailureNotificationUserIds: function(userIds) {
			userIds = $.isArray(userIds) ? userIds : [];
			var seen = {};
			var normalized = [];
			for (var i = 0; i < userIds.length; i++) {
				var userId = parseInt(userIds[i], 10);
				if (isNaN(userId) || userId <= 0 || seen[userId]) {
					continue;
				}
				seen[userId] = true;
				normalized.push(userId);
			}
			return normalized;
		},

		populatePolicyFailureNotificationUsersSelect: function(selectedUserIds) {
			var $select = $('#asenha-policy-failure-notification-users');
			if (!$select.length) {
				return;
			}

			selectedUserIds = this.normalizePolicyFailureNotificationUserIds(selectedUserIds);
			var selectedLookup = {};
			for (var i = 0; i < selectedUserIds.length; i++) {
				selectedLookup[String(selectedUserIds[i])] = true;
			}

			var users = this.getPolicyFailureNotificationUsers();
			var html = '';
			for (var j = 0; j < users.length; j++) {
				var user = users[j] || {};
				var userId = parseInt(user.id, 10);
				if (isNaN(userId) || userId <= 0) {
					continue;
				}

				var value = String(userId);
				var label = String(user.text || '').trim();
				if (!label) {
					var name = String(user.name || '').trim();
					var email = String(user.email || '').trim();
					label = email ? (name + ' (' + email + ')') : name;
				}
				if (!label) {
					label = value;
				}

				html += '<option value="' + this.escapeAttr(value) + '"' + (selectedLookup[value] ? ' selected' : '') + '>' + this.escapeHtml(label) + '</option>';
			}
			$select.html(html);

			this.destroyPolicyFailureNotificationUsersSelectEnhancer($select);
			this.enhancePolicyFailureNotificationUsersSelect($select);
		},

		formatPolicyFailureNotificationSummary: function(policy) {
			policy = policy || {};
			var users = $.isArray(policy.failure_notification_users) ? policy.failure_notification_users : [];
			var labels = [];
			for (var i = 0; i < users.length; i++) {
				var user = users[i] || {};
				var label = String(user.label || '').trim();
				if (!label) {
					var name = String(user.display_name || user.name || '').trim();
					var email = String(user.email || '').trim();
					label = email ? (name + ' (' + email + ')') : name;
				}
				if (label) {
					labels.push(label);
				}
			}

			if (!labels.length) {
				return '';
			}

			var prefix = String(asenhaSbT('policyFailureNotification') || 'Failure notification');
			if (prefix.slice(-1) !== ':') {
				prefix += ':';
			}

			return prefix + ' ' + labels.join(', ');
		},

		formatPolicyFrequencySummary: function(policy) {
			policy = policy || {};
			var method = String(policy.backup_method || 'baseline');
			var freqKey = String(policy.frequency_key || '');
			return this.getPolicyFrequencyLabel(method, freqKey);
		},

		formatPolicyRetentionSummary: function(policy) {
			policy = policy || {};
			var retention = policy.retention || {};
			var mode = String(retention.mode || 'period');
			if (mode === 'count') {
				if (retention.keep_all) {
					return asenhaSbT('policyKeepAsManyAsPossible') || this.getPolicyRetentionPeriodLabel('keep_forever');
				}
				return String(retention.complete_count || 10) + ' ' + (asenhaSbT('policyCompleteBackupsLabel') || 'complete backups');
			}
			return this.getPolicyRetentionPeriodLabel(String(retention.period_key || '3_months'));
		},

		getPolicyFirstSuccessfulRunDisplay: function(policy) {
			policy = policy || {};
			var runsDisplay = (policy.runs_display && typeof policy.runs_display === 'object') ? policy.runs_display : {};
			var firstRun = (runsDisplay.first_successful_run && typeof runsDisplay.first_successful_run === 'object') ? runsDisplay.first_successful_run : {};
			var timestamp = parseInt(firstRun.timestamp, 10);
			var date = String(firstRun.date || '').trim();
			var time = String(firstRun.time || '').trim();
			var available = !!firstRun.available;

			if (isNaN(timestamp) || timestamp <= 0) {
				timestamp = 0;
				available = false;
			}

			if (!date || date === '-' || !time || time === '-') {
				available = false;
			}

			return {
				available: available,
				timestamp: timestamp,
				date: date || '-',
				time: time || '-'
			};
		},

		renderPolicyFrequencyRetentionHtml: function(policy) {
			policy = policy || {};
			var frequencySummary = String(this.formatPolicyFrequencySummary(policy) || '-').trim() || '-';
			var retentionSummary = String(this.formatPolicyRetentionSummary(policy) || '-').trim() || '-';
			var firstRunDisplay = this.getPolicyFirstSuccessfulRunDisplay(policy);
			var firstRunLabel = String(asenhaSbT('policyFirstSuccessfulRunLabel') || 'First run');
			if (firstRunLabel.slice(-1) !== ':') {
				firstRunLabel += ':';
			}

			var html = '<div class="asenha-policy-frequency-retention-blocks">';
			html += '<div class="asenha-policy-frequency-retention-block">';
			html += '<div class="asenha-policy-frequency-retention-line">' + this.escapeHtml(frequencySummary) + '</div>';
			html += '</div>';
			html += '<div class="asenha-policy-frequency-retention-block">';
			html += '<div class="asenha-policy-frequency-retention-line">' + this.escapeHtml(retentionSummary) + '</div>';
			html += '</div>';

			if (firstRunDisplay.available) {
				html += '<div class="asenha-policy-frequency-retention-block">';
				html += '<div class="asenha-policy-frequency-retention-line asenha-policy-frequency-retention-label">' + this.escapeHtml(firstRunLabel) + '</div>';
				html += '<div class="asenha-policy-frequency-retention-line">' + this.escapeHtml(firstRunDisplay.date) + '</div>';
				html += '<div class="asenha-policy-frequency-retention-line">' + this.escapeHtml(firstRunDisplay.time) + '</div>';
				html += '</div>';
			}

			html += '</div>';
			return html;
		},

		formatPolicyFrequencyRetentionLines: function(policy) {
			policy = policy || {};
			return [
				this.formatPolicyFrequencySummary(policy),
				this.formatPolicyRetentionSummary(policy)
			];
		},

		formatPolicyLocationsSummary: function(policy) {
			return this.formatPolicyLocationLines(policy).join('\n');
		},

		formatPolicyEstimateSummary: function(estimate) {
			estimate = estimate || {};
			if (!estimate.available) {
				return asenhaSbT('policyEstimateUnavailable');
			}
			if (estimate.is_unbounded) {
				return this.getPolicyRetentionPeriodLabel('keep_forever');
			}
			var estimatedHuman = String(estimate.estimated_total_human || '').trim();
			return estimatedHuman || String(asenhaSbT('policyEstimateUnavailable') || '-');
		},

		formatPolicyEstimateLines: function(estimate) {
			return [
				String(asenhaSbT('policyEstimatedLabel') || 'Estimated:'),
				this.formatPolicyEstimateSummary(estimate)
			];
		},

		formatPolicyCurrentStorageSummary: function(estimate) {
			estimate = estimate || {};
			var currentHuman = String(estimate.current_total_human || '').trim();
			if (currentHuman) {
				return currentHuman;
			}
			var currentBytes = parseInt(estimate.current_total_bytes, 10);
			if (!isNaN(currentBytes) && currentBytes >= 0) {
				return this.formatBytes(currentBytes, 1);
			}
			return '0 B';
		},

		renderPolicyStorageHtml: function(estimate) {
			estimate = estimate || {};
			var currentLabel = String(asenhaSbT('policyCurrentLabel') || 'Current');
			var maximumLabel = String(asenhaSbT('policyMaximumLabel') || 'Maximum');
			var currentValue = this.formatPolicyCurrentStorageSummary(estimate);
			var maximumValue = '';

			if (!estimate.available) {
				maximumValue = String(asenhaSbT('policyEstimateUnavailable') || '-');
			} else if (estimate.is_unbounded) {
				maximumValue = this.getPolicyRetentionPeriodLabel('keep_forever');
			} else {
				var estimatedHuman = String(estimate.estimated_total_human || '').trim();
				maximumValue = estimatedHuman ? ('~' + estimatedHuman) : String(asenhaSbT('policyEstimateUnavailable') || '-');
			}

			if (currentLabel && currentLabel.slice(-1) !== ':') {
				currentLabel += ':';
			}
			if (maximumLabel && maximumLabel.slice(-1) !== ':') {
				maximumLabel += ':';
			}

			var html = '<div class="asenha-policy-storage-blocks">';
			html += '<div class="asenha-policy-storage-block">';
			html += '<div class="asenha-policy-storage-line asenha-policy-storage-label">' + this.escapeHtml(currentLabel) + '</div>';
			html += '<div class="asenha-policy-storage-line">' + this.escapeHtml(currentValue) + '</div>';
			html += '</div>';
			html += '<div class="asenha-policy-storage-block">';
			html += '<div class="asenha-policy-storage-line asenha-policy-storage-label">' + this.escapeHtml(maximumLabel) + '</div>';
			html += '<div class="asenha-policy-storage-line">' + this.escapeHtml(maximumValue) + '</div>';
			html += '</div>';
			html += '</div>';
			return html;
		},

		formatPolicyNextRun: function(policy) {
			policy = policy || {};
			var nextRunAt = parseInt(policy.next_run_at, 10) || 0;
			if (nextRunAt <= 0) {
				return '-';
			}
			try {
				var nextRunDate = new Date(nextRunAt * 1000);
				if (isNaN(nextRunDate.getTime())) {
					return '-';
				}
				var dateLabel = nextRunDate.toLocaleDateString();
				var hours = ('0' + String(nextRunDate.getHours())).slice(-2);
				var minutes = ('0' + String(nextRunDate.getMinutes())).slice(-2);
				return dateLabel + '\n' + hours + ':' + minutes;
			} catch (e) {
				return '-';
			}
		},

		getPolicyDefaultTemplateLabelByType: function(type) {
			type = String(type || 'full');
			var defaultLabel = asenhaSbT('defaultTemplateTitleFull');
			if (type === 'database') {
				defaultLabel = asenhaSbT('defaultTemplateTitleDatabase');
			} else if (type === 'files') {
				defaultLabel = asenhaSbT('defaultTemplateTitleFiles');
			}
			return String(defaultLabel || asenhaSbT('chooseTemplate') || '');
		},

		formatPolicyBackupLines: function(policy) {
			policy = policy || {};
			var lines = [];
			var type = String(policy.type || 'full');
			var typeLabel = this.getPolicyTypeLabel(policy);
			var typePrefix = asenhaSbT('templateType') || 'Type';
			if (typeLabel) {
				lines.push(String(typePrefix) + ':');
				lines.push(String(typeLabel));
			}

			var templateTitle = String(policy.template_title || '').trim();
			if (!templateTitle) {
				templateTitle = this.getPolicyDefaultTemplateLabelByType(type);
			}
			var templateLabel = asenhaSbT('templateLabel') || 'Template';
			lines.push(String(templateLabel) + ':');
			lines.push(String(templateTitle || '-'));

			if (policy.multipart_enabled) {
				var partBytes = parseInt(policy.multipart_part_bytes, 10) || 0;
				if (partBytes > 0) {
					var splitSizeHuman = this.formatBytes(partBytes, 1).replace(/\.0(\s+[A-Z]+)$/i, '$1');
					lines.push((asenhaSbT('policySplitShort') || 'Split') + ' (' + splitSizeHuman + ')');
				} else {
					lines.push(asenhaSbT('policySplitShort') || 'Split');
				}
			}

			if (policy.archive_encryption_enabled) {
				lines.push(asenhaSbT('policyEncryptedShort') || 'Encrypted');
			}

			return lines;
		},

		renderPolicyBackupHtml: function(policy) {
			var lines = this.formatPolicyBackupLines(policy);
			lines = $.isArray(lines) ? lines : [];
			var normalized = [];
			for (var i = 0; i < lines.length; i++) {
				var line = String(lines[i] || '').trim();
				if (line) {
					normalized.push(line);
				}
			}
			if (!normalized.length) {
				return '-';
			}

			var typePrefixLine = String(asenhaSbT('templateType') || 'Type') + ':';
			var templatePrefixLine = String(asenhaSbT('templateLabel') || 'Template') + ':';
			var html = '<div class="asenha-policy-cell-lines">';
			for (var j = 0; j < normalized.length; j++) {
				var currentLine = String(normalized[j] || '');
				var nextLine = String(normalized[j + 1] || '');
				var isPairPrefix = (currentLine === typePrefixLine || currentLine === templatePrefixLine);
				if (isPairPrefix && nextLine) {
					html += '<div class="asenha-policy-cell-line"><div class="asenha-policy-backup-entry">';
					html += '<div class="asenha-policy-backup-line">' + this.escapeHtml(currentLine) + '</div>';
					html += '<div class="asenha-policy-backup-line">' + this.escapeHtml(nextLine) + '</div>';
					html += '</div></div>';
					j++;
					continue;
				}
				html += '<div class="asenha-policy-cell-line">' + this.escapeHtml(currentLine) + '</div>';
			}
			html += '</div>';
			return html;
		},

		formatPolicyLocationLines: function(policy) {
			policy = policy || {};
			var labels = [];
			var locations = (policy.locations && typeof policy.locations === 'object') ? policy.locations : {};
			if (locations.local_enabled) {
				labels.push(asenhaSbT('localStorageLabel') || 'Local storage');
			}

			var remoteLocations = $.isArray(policy.remote_locations) ? policy.remote_locations : [];
			if (remoteLocations.length) {
				for (var i = 0; i < remoteLocations.length; i++) {
					var remote = remoteLocations[i] || {};
					var remoteLabel = '';
					if (typeof remote === 'string') {
						remoteLabel = String(remote);
					} else {
						remoteLabel = String(remote.label || remote.id || '');
					}
					if (remoteLabel) {
						labels.push(remoteLabel);
					}
				}
			} else {
				var remotes = $.isArray(locations.remote_location_ids) ? locations.remote_location_ids : [];
				for (var j = 0; j < remotes.length; j++) {
					var remoteId = String(remotes[j] || '');
					if (remoteId) {
						labels.push(remoteId);
					}
				}
			}

			return labels;
		},

		renderPolicyLocationsHtml: function(policy) {
			policy = policy || {};
			var entries = [];
			var locations = (policy.locations && typeof policy.locations === 'object') ? policy.locations : {};
			if (locations.local_enabled) {
				entries.push({
					type: 'plain',
					text: String(asenhaSbT('localStorageLabel') || 'Local storage')
				});
			}

			var remoteLocations = $.isArray(policy.remote_locations) ? policy.remote_locations : [];
			if (remoteLocations.length) {
				for (var i = 0; i < remoteLocations.length; i++) {
					var remote = remoteLocations[i] || {};
					if (typeof remote === 'string') {
						entries.push({
							type: 'plain',
							text: String(remote || '')
						});
						continue;
					}

					var typeLabel = String(remote.type_label || '').trim();
					var title = String(remote.title || '').trim();
					var fallback = String(remote.label || remote.id || '').trim();
					if (!typeLabel && !title && fallback) {
						entries.push({
							type: 'plain',
							text: fallback
						});
						continue;
					}

					entries.push({
						type: 'remote',
						typeLabel: typeLabel,
						title: title,
						fallback: fallback
					});
				}
			} else {
				var remotes = $.isArray(locations.remote_location_ids) ? locations.remote_location_ids : [];
				for (var j = 0; j < remotes.length; j++) {
					var remoteId = String(remotes[j] || '').trim();
					if (remoteId) {
						entries.push({
							type: 'plain',
							text: remoteId
						});
					}
				}
			}

			if (!entries.length) {
				return '-';
			}

			var html = '<div class="asenha-policy-cell-lines">';
			for (var k = 0; k < entries.length; k++) {
				var entry = entries[k] || {};
				html += '<div class="asenha-policy-cell-line">';
				if (entry.type === 'remote') {
					var entryTypeLabel = String(entry.typeLabel || '');
					var entryTitle = String(entry.title || '');
					var entryFallback = String(entry.fallback || '');
					html += '<div class="asenha-policy-location-entry">';
					if (entryTypeLabel) {
						html += '<div class="asenha-policy-location-type">' + this.escapeHtml(entryTypeLabel) + '</div>';
					}
					if (entryTitle) {
						html += '<div class="asenha-policy-location-title">' + this.escapeHtml(entryTitle) + '</div>';
					}
					if (!entryTypeLabel && !entryTitle) {
						html += '<div class="asenha-policy-location-title">' + this.escapeHtml(entryFallback || '-') + '</div>';
					}
					html += '</div>';
				} else {
					html += this.escapeHtml(String(entry.text || '-'));
				}
				html += '</div>';
			}
			html += '</div>';
			return html;
		},

		renderPolicyTextLinesHtml: function(lines) {
			lines = $.isArray(lines) ? lines : [];
			var normalized = [];
			for (var i = 0; i < lines.length; i++) {
				var line = String(lines[i] || '').trim();
				if (line) {
					normalized.push(line);
				}
			}
			if (!normalized.length) {
				return '-';
			}

			var html = '<div class="asenha-policy-cell-lines">';
			for (var j = 0; j < normalized.length; j++) {
				html += '<div class="asenha-policy-cell-line">' + this.escapeHtml(normalized[j]) + '</div>';
			}
			html += '</div>';
			return html;
		},

		formatPolicyRunsHtml: function(policy) {
			policy = policy || {};
			var runsDisplay = (policy.runs_display && typeof policy.runs_display === 'object') ? policy.runs_display : {};
			var totalRuns = parseInt(runsDisplay.total_runs, 10);
			if (isNaN(totalRuns)) {
				totalRuns = parseInt(policy.run_count, 10);
			}
			if (isNaN(totalRuns) || totalRuns < 0) {
				totalRuns = 0;
			}

			var lastRun = (runsDisplay.last_run && typeof runsDisplay.last_run === 'object') ? runsDisplay.last_run : {};
			var nextRun = (runsDisplay.next_run && typeof runsDisplay.next_run === 'object') ? runsDisplay.next_run : {};

			var lastDate = String(lastRun.date || '-');
			var lastTime = String(lastRun.time || '-');
			var nextDate = String(nextRun.date || '-');
			var nextTime = String(nextRun.time || '-');
			var lastMethod = String(lastRun.method || policy.last_run_type || '');
			var nextMethod = String(nextRun.method || '');
			var lastMethodBadge = this.renderPolicyMethodBadgeHtml(lastMethod);
			var nextMethodBadge = this.renderPolicyMethodBadgeHtml(nextMethod);

			var html = '<div class="asenha-policy-runs-blocks">';
			html += '<div class="asenha-policy-runs-block">';
			html += '<div class="asenha-policy-run-line">' + this.escapeHtml(String(totalRuns) + ' ' + (asenhaSbT('policyRunsInTotal') || 'runs in total')) + '</div>';
			html += '</div>';
			html += '<div class="asenha-policy-runs-block">';
			html += '<div class="asenha-policy-run-line asenha-policy-run-label">' + this.escapeHtml((asenhaSbT('policyLastRun') || 'Last run') + ':') + '</div>';
			html += '<div class="asenha-policy-run-line asenha-policy-run-method">' + (lastMethodBadge || this.escapeHtml('-')) + '</div>';
			html += '<div class="asenha-policy-run-line">' + this.escapeHtml(lastDate) + '</div>';
			html += '<div class="asenha-policy-run-line">' + this.escapeHtml(lastTime) + '</div>';
			html += '</div>';
			html += '<div class="asenha-policy-runs-block">';
			html += '<div class="asenha-policy-run-line asenha-policy-run-label">' + this.escapeHtml((asenhaSbT('policyNextRunLabel') || asenhaSbT('policyNextRun') || 'Next run') + ':') + '</div>';
			html += '<div class="asenha-policy-run-line asenha-policy-run-method">' + (nextMethodBadge || this.escapeHtml('-')) + '</div>';
			html += '<div class="asenha-policy-run-line">' + this.escapeHtml(nextDate) + '</div>';
			html += '<div class="asenha-policy-run-line">' + this.escapeHtml(nextTime) + '</div>';
			html += '</div>';
			html += '</div>';
			return html;
		},

		deletePolicy: function(policyId) {
			var self = this;
			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_delete_backup_policy',
					nonce: asenhaSiteBackup.nonce,
					policy_id: policyId
				}
			}).done(function(resp) {
				if (!resp || !resp.success) {
					self.showNotice('error', (resp && resp.data && resp.data.message) ? resp.data.message : asenhaSbT('requestFailed'));
					return;
				}
				self.showNotice('success', asenhaSbT('policyDeleted'));
				self.refreshPoliciesList();
			}).fail(function() {
				self.showNotice('error', asenhaSbT('requestFailed'));
			});
		},

		togglePolicy: function(policyId, enabled) {
			var self = this;
			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_toggle_backup_policy',
					nonce: asenhaSiteBackup.nonce,
					policy_id: policyId,
					enabled: enabled ? 1 : 0
				}
			}).done(function(resp) {
				if (!resp || !resp.success) {
					self.showNotice('error', (resp && resp.data && resp.data.message) ? resp.data.message : asenhaSbT('requestFailed'));
					self.refreshPoliciesList();
					return;
				}
				self.refreshPoliciesList();
			}).fail(function() {
				self.showNotice('error', asenhaSbT('requestFailed'));
				self.refreshPoliciesList();
			});
		},

		runPolicyNow: function(policyId, $button) {
			var self = this;
			policyId = String(policyId || '');
			if (!policyId) {
				return;
			}

			if (!self.policyRunNowPending || typeof self.policyRunNowPending !== 'object') {
				self.policyRunNowPending = {};
			}
			if (self.policyRunNowPending[policyId]) {
				return;
			}

			self.policyRunNowPending[policyId] = true;
			if ($button && $button.length) {
				$button.prop('disabled', true).addClass('asenha-is-busy');
			}

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_run_backup_policy_now',
					nonce: asenhaSiteBackup.nonce,
					policy_id: policyId
				}
			}).done(function(resp) {
				if (!resp || !resp.success) {
					self.showNotice('error', (resp && resp.data && resp.data.message) ? resp.data.message : asenhaSbT('requestFailed'));
					return;
				}
				self.showNotice('success', (resp && resp.data && resp.data.message) ? resp.data.message : asenhaSbT('backupStarted'));
				self.refreshPoliciesList();
			}).fail(function() {
				self.showNotice('error', asenhaSbT('requestFailed'));
			}).always(function() {
				delete self.policyRunNowPending[policyId];
				if ($button && $button.length) {
					$button.prop('disabled', false).removeClass('asenha-is-busy');
				}
			});
		},

		ensurePolicyModalExists: function() {
			if ($('#asenha-policy-modal').length) {
				return;
			}

			var localStorageLabel = asenhaSbT('localStorageLabel') || 'Local storage';
			var splitEncryptLabel = asenhaSbT('policySplitEncrypt') || 'Split / Encrypt';
			var splitLargeLabel = asenhaSbT('policySplitLargeBackups') || 'Split large backups';
			var encryptLabel = asenhaSbT('policyEncryptArchive') || 'Encrypt backup archive (AES-256)';
			var passphraseLabel = asenhaSbT('policyArchivePassphrase') || 'Archive passphrase';
			var confirmPassphraseLabel = asenhaSbT('policyArchivePassphraseConfirm') || 'Confirm passphrase';
			var existingPassphraseHint = asenhaSbT('policyExistingPassphraseHint') || 'A passphrase is already saved for this policy. Leave fields blank to keep it.';
			var retentionPeriodLabel = asenhaSbT('policyRetentionModePeriod') || 'Period';
			var retentionCountLabel = asenhaSbT('policyRetentionModeCount') || 'Count';
			var keepAllLabel = asenhaSbT('policyKeepAsManyAsPossible') || 'Keep as many complete backup chains as possible';
			var failureNotificationLabel = asenhaSbT('policyFailureNotificationUsers') || 'Notify these users if this policy run fails';
			var failureNotificationPlaceholder = asenhaSbT('policyFailureNotificationPlaceholder') || 'Select admin users';
			var timeLabel = asenhaSbT('policyTime') || 'Time';

			var html = '';
			html += '<div class="asenha-modal-overlay" id="asenha-policy-modal" style="display:none;">';
			html += '  <div class="asenha-modal">';
			html += '    <div class="asenha-modal-header">';
			html += '      <h2 id="asenha-policy-modal-title">' + this.escapeHtml(asenhaSbT('createPolicy')) + '</h2>';
			html += '      <button type="button" class="button-link asenha-policy-modal-close" aria-label="' + this.escapeAttr(asenhaSbT('close')) + '">×</button>';
			html += '    </div>';
			html += '    <div class="asenha-modal-body asenha-policy-modal-body">';
			html += '      <input type="hidden" id="asenha-policy-id" value="" />';
			html += '      <table class="form-table">';
			html += '        <tr><th scope="row"><label for="asenha-policy-title">' + this.escapeHtml(asenhaSbT('policyTitle')) + '</label></th><td><div class="asenha-policy-title-enabled-inline"><input type="text" class="regular-text" id="asenha-policy-title" value="" /><label class="asenha-policy-enabled-inline"><input type="checkbox" id="asenha-policy-enabled" value="1" checked /> ' + this.escapeHtml(asenhaSbT('policyEnabled')) + '</label></div></td></tr>';
			html += '        <tr><th scope="row"><label for="asenha-policy-type">' + this.escapeHtml(asenhaSbT('policyType')) + '</label></th><td><select id="asenha-policy-type"></select></td></tr>';
			html += '        <tr><th scope="row"><label for="asenha-policy-template">' + this.escapeHtml(asenhaSbT('chooseTemplateShort')) + '</label></th><td><div class="asenha-policy-template-inline"><select id="asenha-policy-template"><option value="">' + this.escapeHtml(asenhaSbT('chooseTemplateShort')) + '</option></select><a href="#" id="asenha-policy-template-action" class="button-link asenha-template-picker-create-link">' + this.escapeHtml(asenhaSbT('createTemplateShort') || asenhaSbT('createTemplate')) + '</a></div></td></tr>';
			html += '        <tr><th scope="row"><label for="asenha-policy-method">' + this.escapeHtml(asenhaSbT('policyBackupMethod')) + '</label></th><td><select id="asenha-policy-method"></select></td></tr>';
			html += '        <tr><th scope="row">' + this.escapeHtml(splitEncryptLabel) + '</th><td>';
			html += '          <label><input type="checkbox" id="asenha-policy-multipart-enabled" value="1" /> ' + this.escapeHtml(splitLargeLabel) + '</label> ';
			html += '          <select id="asenha-policy-multipart-part-bytes">';
			html += '            <option value="' + this.escapeAttr(String(10 * 1024 * 1024)) + '">10 MB</option>';
			html += '            <option value="' + this.escapeAttr(String(100 * 1024 * 1024)) + '">100 MB</option>';
			html += '            <option value="' + this.escapeAttr(String(256 * 1024 * 1024)) + '" selected>256 MB</option>';
			html += '            <option value="' + this.escapeAttr(String(512 * 1024 * 1024)) + '">512 MB</option>';
			html += '          </select>';
			html += '          <div class="asenha-policy-encryption-wrap">';
			html += '            <label><input type="checkbox" id="asenha-policy-encryption-enabled" value="1" /> ' + this.escapeHtml(encryptLabel) + '</label>';
			html += '            <div id="asenha-policy-encryption-fields" style="display:none;">';
			html += '              <input type="password" class="regular-text" id="asenha-policy-encryption-passphrase" placeholder="' + this.escapeAttr(passphraseLabel) + '" autocomplete="new-password" />';
			html += '              <input type="password" class="regular-text" id="asenha-policy-encryption-passphrase-confirm" placeholder="' + this.escapeAttr(confirmPassphraseLabel) + '" autocomplete="new-password" />';
			html += '              <p class="description" id="asenha-policy-encryption-existing-hint" style="display:none;">' + this.escapeHtml(existingPassphraseHint) + '</p>';
			html += '            </div>';
			html += '          </div>';
			html += '        <tr><th scope="row">' + this.escapeHtml(asenhaSbT('policyLocations')) + '</th><td>';
			html += '          <div id="asenha-policy-locations-inline">';
			html += '            <label class="asenha-policy-location-local-option"><input type="checkbox" id="asenha-policy-location-local" value="1" checked /> ' + this.escapeHtml(localStorageLabel) + '</label>';
			html += '            <div id="asenha-policy-remote-locations" class="asenha-policy-remote-locations"></div>';
			html += '          </div>';
			html += '        </td></tr>';
			html += '        <tr><th scope="row"><label for="asenha-policy-frequency">' + this.escapeHtml(asenhaSbT('policyFrequency')) + '</label></th><td><select id="asenha-policy-frequency"></select></td></tr>';
			html += '        <tr id="asenha-policy-time-row"><th scope="row"><label for="asenha-policy-time-controls">' + this.escapeHtml(timeLabel) + '</label></th><td><div id="asenha-policy-time-controls"></div><div id="asenha-policy-first-run-preview" class="asenha-policy-first-run-preview"></div></td></tr>';
			html += '        </td></tr>';
			html += '        <tr><th scope="row">' + this.escapeHtml(asenhaSbT('policyRetention')) + '</th><td>';
			html += '          <div id="asenha-policy-retention-inline">';
			html += '            <select id="asenha-policy-retention-mode"><option value="period">' + this.escapeHtml(retentionPeriodLabel) + '</option><option value="count">' + this.escapeHtml(retentionCountLabel) + '</option></select>';
			html += '            <div id="asenha-policy-retention-period-wrap"><select id="asenha-policy-retention-period"></select></div>';
			html += '            <div id="asenha-policy-retention-count-wrap" style="display:none;">';
			html += '            <input type="number" min="1" step="1" id="asenha-policy-retention-count" value="10" /> ';
			html += '            <label><input type="checkbox" id="asenha-policy-retention-keep-all" value="1" /> ' + this.escapeHtml(keepAllLabel) + '</label>';
			html += '            </div>';
			html += '          </div>';
			html += '        </td></tr>';
			html += '        <tr><th scope="row"><label for="asenha-policy-failure-notification-users">' + this.escapeHtml(asenhaSbT('policyFailureNotification') || 'Failure notification') + '</label></th><td>';
			html += '          <select id="asenha-policy-failure-notification-users" multiple="multiple" data-placeholder="' + this.escapeAttr(failureNotificationPlaceholder) + '"></select>';
			html += '          <p class="description">' + this.escapeHtml(failureNotificationLabel) + '</p>';
			html += '        </td></tr>';
			html += '      </table>';
			html += '    </div>';
			html += '    <div class="asenha-modal-footer">';
			html += '      <span class="asenha-policy-estimate-footer"><strong>' + this.escapeHtml(asenhaSbT('policyStorageEstimate')) + ':</strong> <span id="asenha-policy-estimate-preview">-</span></span>';
			html += '      <button type="button" class="button button-primary" id="asenha-policy-save">' + this.escapeHtml(asenhaSbT('save')) + '</button>';
			html += '      <button type="button" class="button asenha-policy-modal-cancel">' + this.escapeHtml(asenhaSbT('close')) + '</button>';
			html += '    </div>';
			html += '  </div>';
			html += '</div>';

			$('body').append(html);

			var self = this;
			$(document).on('click', '.asenha-policy-modal-close, .asenha-policy-modal-cancel', function(e) {
				e.preventDefault();
				$('#asenha-policy-modal').hide();
			});

			$(document).on('change', '#asenha-policy-type', function() {
				self.updatePolicyMethodControl();
				self.populatePolicyTemplateSelect(String($(this).val() || ''), String($('#asenha-policy-template').val() || ''));
				self.updatePolicyFrequencyOptions('', { preserveCurrent: true });
				self.schedulePolicyEstimatePreview();
				self.schedulePolicyFirstRunPreview();
			});
			$(document).on('change', '#asenha-policy-template', function() {
				self.updatePolicyTemplateActionLinkState();
			});
			$(document).on('change', '#asenha-policy-method', function() {
				self.updatePolicyFrequencyOptions('', { preserveCurrent: true });
				self.schedulePolicyEstimatePreview();
				self.schedulePolicyFirstRunPreview();
			});
			$(document).on('change', '#asenha-policy-frequency', function() {
				self.syncPolicyRetentionPeriodOptions();
				self.renderPolicyTimeControls({
					preserveCurrent: true
				});
				self.schedulePolicyFirstRunPreview();
			});
			$(document).on('change', '#asenha-policy-time-controls select', function() {
				self.schedulePolicyFirstRunPreview();
			});
			$(document).on('change', '#asenha-policy-encryption-enabled', function() {
				self.updatePolicyEncryptionFieldsState();
				self.schedulePolicyEstimatePreview();
			});
			$(document).on('change', '#asenha-policy-retention-mode, #asenha-policy-retention-keep-all', function() {
				self.updatePolicyRetentionFieldsState();
				self.schedulePolicyEstimatePreview();
			});
			$(document).on('change input', '#asenha-policy-modal input, #asenha-policy-modal select', function() {
				self.schedulePolicyEstimatePreview();
			});
			$(document).on('click', '#asenha-policy-save', function(e) {
				e.preventDefault();
				self.savePolicyFromModal();
			});
			$(document).on('click', '#asenha-policy-template-action', function(e) {
				e.preventDefault();
				var type = String($('#asenha-policy-type').val() || 'full');
				if (['full', 'database', 'files'].indexOf(type) === -1) {
					type = 'full';
				}
				var templateId = String($('#asenha-policy-template').val() || '');
				var modalOpts = {
					lockType: true,
					forcedType: type,
					compactTemplateLabels: true,
					stayOpenAfterEditSave: true
				};
				if (!templateId) {
					self.openTemplateModal(null, modalOpts);
					return;
				}

				var openSelectedTemplate = function() {
					var tpl = self.getCachedTemplateById(templateId);
					if (!tpl) {
						var typedTemplates = $.isArray(self.policyTemplatesByType[type]) ? self.policyTemplatesByType[type] : [];
						for (var i = 0; i < typedTemplates.length; i++) {
							var candidate = typedTemplates[i] || {};
							if (String(candidate.id || '') === templateId) {
								tpl = candidate;
								break;
							}
						}
					}

					if (!tpl) {
						self.showNotice('error', asenhaSbT('templateNotFound') || asenhaSbT('requestFailed'));
						return;
					}

					self.openTemplateModal(tpl, modalOpts);
				};

				if (self.getCachedTemplateById(templateId)) {
					openSelectedTemplate();
					return;
				}

				self.fetchTemplates(type).done(function(resp) {
					if (resp && resp.success && resp.data && $.isArray(resp.data.templates)) {
						self.templatesCache = resp.data.templates;
						self.policyTemplatesByType[type] = resp.data.templates;
					}
					openSelectedTemplate();
				}).fail(function() {
					openSelectedTemplate();
				});
			});
		},

		openPolicyModal: function(policy) {
			var self = this;
			this.ensurePolicyModalExists();

			var isEdit = !!(policy && policy.id);
			var type = String((policy && policy.type) ? policy.type : 'full');
			var method = String((policy && policy.backup_method) ? policy.backup_method : 'baseline');
			if (type === 'database') {
				method = 'baseline';
			}
			var locations = (policy && policy.locations) ? policy.locations : {};
			var retention = (policy && policy.retention) ? policy.retention : {};
			var failureNotificationUserIds = this.normalizePolicyFailureNotificationUserIds((policy && policy.failure_notification_user_ids) ? policy.failure_notification_user_ids : []);
			var policyOptions = (asenhaSiteBackup && asenhaSiteBackup.policyOptions) ? asenhaSiteBackup.policyOptions : {};
			var typeOptions = $.isArray(policyOptions.types) ? policyOptions.types : [];
			var methodOptions = $.isArray(policyOptions.methods) ? policyOptions.methods : [];
			var retentionPeriods = $.isArray(policyOptions.retention_periods) ? policyOptions.retention_periods : [];
			var defaultFrequencyKey = (method === 'incremental') ? 'baseline_weekly_inc_daily' : 'weekly';
			var defaultRetentionPeriodKey = isEdit ? '3_months' : '1_month';

			$('#asenha-policy-modal-title').text(isEdit ? asenhaSbT('editPolicy') : asenhaSbT('createPolicy'));
			$('#asenha-policy-id').val(isEdit ? String(policy.id || '') : '');
			$('#asenha-policy-title').val(isEdit ? String(policy.title || '') : '');
			$('#asenha-policy-enabled').prop('checked', isEdit ? !!policy.enabled : true);

			var typeHtml = '';
			for (var i = 0; i < typeOptions.length; i++) {
				var t = typeOptions[i] || {};
				var tv = String(t.value || '');
				typeHtml += '<option value="' + this.escapeAttr(tv) + '"' + ((tv === type) ? ' selected' : '') + '>' + this.escapeHtml(String(t.label || tv)) + '</option>';
			}
			$('#asenha-policy-type').html(typeHtml);

			var methodHtml = '';
			for (var j = 0; j < methodOptions.length; j++) {
				var m = methodOptions[j] || {};
				var mv = String(m.value || '');
				methodHtml += '<option value="' + this.escapeAttr(mv) + '"' + ((mv === method) ? ' selected' : '') + '>' + this.escapeHtml(String(m.label || mv)) + '</option>';
			}
			$('#asenha-policy-method').html(methodHtml);

			var periodHtml = '';
			for (var k = 0; k < retentionPeriods.length; k++) {
				var rp = retentionPeriods[k] || {};
				var rpv = String(rp.value || '');
				var selected = (rpv === String(retention.period_key || defaultRetentionPeriodKey)) ? ' selected' : '';
				periodHtml += '<option value="' + this.escapeAttr(rpv) + '"' + selected + '>' + this.escapeHtml(String(rp.label || rpv)) + '</option>';
			}
			$('#asenha-policy-retention-period').html(periodHtml);

			$('#asenha-policy-multipart-enabled').prop('checked', !!(policy && policy.multipart_enabled));
			$('#asenha-policy-multipart-part-bytes').val(String((policy && policy.multipart_part_bytes) ? policy.multipart_part_bytes : (256 * 1024 * 1024)));

			$('#asenha-policy-encryption-enabled').prop('checked', isEdit ? !!(policy && policy.archive_encryption_enabled) : true);
			$('#asenha-policy-encryption-passphrase').val('');
			$('#asenha-policy-encryption-passphrase-confirm').val('');
			$('#asenha-policy-encryption-existing-hint').toggle(!!(policy && policy.archive_encryption_passphrase_is_set));

			$('#asenha-policy-location-local').prop('checked', !!locations.local_enabled);

			$('#asenha-policy-retention-mode').val(String(retention.mode || 'period'));
			$('#asenha-policy-retention-count').val(parseInt(retention.complete_count, 10) || 10);
			$('#asenha-policy-retention-keep-all').prop('checked', !!retention.keep_all);
			this.populatePolicyFailureNotificationUsersSelect(failureNotificationUserIds);

			this.updatePolicyMethodControl();
			this.updatePolicyEncryptionFieldsState();
			this.updatePolicyRetentionFieldsState();
			var preferredFrequencyKey = String(policy && policy.frequency_key ? policy.frequency_key : '');
			if (!isEdit && !preferredFrequencyKey) {
				preferredFrequencyKey = defaultFrequencyKey;
			}
			this.updatePolicyFrequencyOptions(
				preferredFrequencyKey,
				{
					preserveCurrent: false,
					scheduleTime: (policy && policy.schedule_time && typeof policy.schedule_time === 'object') ? policy.schedule_time : {}
				}
			);
			this.syncPolicyRetentionPeriodOptions({ currentValue: String(retention.period_key || defaultRetentionPeriodKey) });
			this.updatePolicyTemplateActionLinkState();

			var selectedRemoteIds = $.isArray(locations.remote_location_ids) ? locations.remote_location_ids : [];
			this.ensurePolicyLocationsLoaded(function() {
				self.renderPolicyRemoteLocations(selectedRemoteIds);
			});
			this.populatePolicyTemplateSelect(type, String(policy && policy.template_id ? policy.template_id : ''));

			$('#asenha-policy-modal').show();
			this.schedulePolicyEstimatePreview();
			this.schedulePolicyFirstRunPreview();
		},

		ensurePolicyLocationsLoaded: function(callback) {
			var self = this;
			if (this.locationsCache && this.locationsCache.remotes && $.isArray(this.locationsCache.remotes)) {
				if (typeof callback === 'function') {
					callback();
				}
				return;
			}

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_get_backup_locations',
					nonce: asenhaSiteBackup.nonce
				}
			}).done(function(resp) {
				if (resp && resp.success && resp.data) {
					self.locationsCache = resp.data.locations || {};
				}
				if (typeof callback === 'function') {
					callback();
				}
			}).fail(function() {
				if (typeof callback === 'function') {
					callback();
				}
			});
		},

		renderPolicyRemoteLocations: function(selectedRemoteIds) {
			selectedRemoteIds = $.isArray(selectedRemoteIds) ? selectedRemoteIds : [];
			var selectedSet = {};
			for (var i = 0; i < selectedRemoteIds.length; i++) {
				selectedSet[String(selectedRemoteIds[i] || '')] = true;
			}

			var remotes = [];
			if (this.locationsCache && this.locationsCache.remotes && $.isArray(this.locationsCache.remotes)) {
				remotes = this.locationsCache.remotes;
			}

			var html = '';
			if (!remotes.length) {
				html = '<p class="description">' + this.escapeHtml(asenhaSbT('noRemoteLocations')) + '</p>';
			} else {
				for (var j = 0; j < remotes.length; j++) {
					var r = remotes[j] || {};
					var id = String(r.id || '');
					if (!id) {
						continue;
					}
					var label = this.formatRemoteLocationLabel(String(r.type || ''), String(r.title || ''));
					var enabled = !!r.enabled;
					var checked = !!selectedSet[id];
					html += '<label class="asenha-policy-remote-location">';
					html += '<input type="checkbox" class="asenha-policy-remote-location-checkbox" value="' + this.escapeAttr(id) + '"' + (checked ? ' checked' : '') + (enabled ? '' : ' disabled') + ' /> ';
					html += this.escapeHtml(label);
					if (!enabled) {
						html += ' (' + this.escapeHtml(asenhaSbT('connectionStatusNotAvailableDisabled')) + ')';
					}
					html += '</label>';
				}
			}

			$('#asenha-policy-remote-locations').html(html);
		},

		populatePolicyTemplateSelect: function(type, selectedTemplateId) {
			var self = this;
			type = String(type || 'full');
			selectedTemplateId = String(selectedTemplateId || '');

			var cacheKey = type;
			var cached = this.policyTemplatesByType[cacheKey];
			if ($.isArray(cached)) {
				this.renderPolicyTemplateSelect(cached, selectedTemplateId);
				return;
			}

			$('#asenha-policy-template').html('<option value="">' + this.escapeHtml(asenhaSbT('loading')) + '</option>');
			this.updatePolicyTemplateActionLinkState();

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_get_backup_templates',
					nonce: asenhaSiteBackup.nonce,
					type: type
				}
			}).done(function(resp) {
				var templates = (resp && resp.success && resp.data && $.isArray(resp.data.templates)) ? resp.data.templates : [];
				self.policyTemplatesByType[cacheKey] = templates;
				self.renderPolicyTemplateSelect(templates, selectedTemplateId);
			}).fail(function() {
				self.renderPolicyTemplateSelect([], selectedTemplateId);
			});
		},

		renderPolicyTemplateSelect: function(templates, selectedTemplateId) {
			templates = $.isArray(templates) ? templates : [];
			selectedTemplateId = String(selectedTemplateId || '');
			var type = String($('#asenha-policy-type').val() || 'full');
			var defaultLabel = asenhaSbT('defaultTemplateTitleFull');
			if (type === 'database') {
				defaultLabel = asenhaSbT('defaultTemplateTitleDatabase');
			} else if (type === 'files') {
				defaultLabel = asenhaSbT('defaultTemplateTitleFiles');
			}

			var emptyOptionLabel = defaultLabel || asenhaSbT('chooseTemplate');

			var html = '<option value="">' + this.escapeHtml(emptyOptionLabel) + '</option>';
			for (var i = 0; i < templates.length; i++) {
				var tpl = templates[i] || {};
				var id = String(tpl.id || '');
				var title = String(tpl.title || '');
				if (!id) {
					continue;
				}
				html += '<option value="' + this.escapeAttr(id) + '"' + ((id === selectedTemplateId) ? ' selected' : '') + '>' + this.escapeHtml(title || id) + '</option>';
			}
			$('#asenha-policy-template').html(html);
			this.updatePolicyTemplateActionLinkState();
		},

		updatePolicyTemplateActionLinkState: function() {
			var $link = $('#asenha-policy-template-action');
			if (!$link.length) {
				return;
			}

			var templateId = String($('#asenha-policy-template').val() || '');
			var label = templateId ? (asenhaSbT('editTemplateShort') || asenhaSbT('editTemplate')) : (asenhaSbT('createTemplateShort') || asenhaSbT('createTemplate'));
			$link.text(label);
		},

		updatePolicyMethodControl: function() {
			var type = String($('#asenha-policy-type').val() || 'full');
			var $method = $('#asenha-policy-method');
			if (!$method.length) {
				return;
			}

			var isDatabase = (type === 'database');
			var currentMethod = String($method.val() || '');
			$method.find('option[value="incremental"]').prop('disabled', isDatabase);
			if (isDatabase && currentMethod !== 'baseline') {
				$method.val('baseline');
			}
			if (isDatabase && currentMethod === 'incremental') {
				this.showNotice('info', asenhaSbT('policyDatabaseForcesCompleteOnly'));
			}
		},

		updatePolicyFrequencyOptions: function(preferredValue, opts) {
			opts = opts || {};
			preferredValue = String(preferredValue || '');
			var method = String($('#asenha-policy-method').val() || 'baseline');
			var methodDefaultFrequencyKey = (method === 'incremental') ? 'baseline_weekly_inc_daily' : 'weekly';
			var listKey = (method === 'incremental') ? 'frequencies_incremental' : 'frequencies_complete';
			var options = (asenhaSiteBackup && asenhaSiteBackup.policyOptions && $.isArray(asenhaSiteBackup.policyOptions[listKey])) ? asenhaSiteBackup.policyOptions[listKey] : [];
			var $select = $('#asenha-policy-frequency');
			if (!$select.length) {
				return;
			}

			var current = preferredValue;
			if (!current) {
				current = String($select.val() || '');
			}
			var html = '';
			var hasCurrentOption = false;
			var optionsByValue = {};
			for (var i = 0; i < options.length; i++) {
				var opt = options[i] || {};
				var value = String(opt.value || '');
				var label = String(opt.label || value);
				optionsByValue[value] = true;
				if (value === current) {
					hasCurrentOption = true;
				}
				html += '<option value="' + this.escapeAttr(value) + '"' + ((value === current) ? ' selected' : '') + '>' + this.escapeHtml(label) + '</option>';
			}
			$select.html(html);

			if (hasCurrentOption && current) {
				$select.val(current);
			} else if (optionsByValue[methodDefaultFrequencyKey]) {
				$select.val(methodDefaultFrequencyKey);
			} else if (options.length) {
				$select.val(String(options[0].value || ''));
			}

			this.syncPolicyRetentionPeriodOptions();
			this.renderPolicyTimeControls({
				preserveCurrent: !!opts.preserveCurrent,
				scheduleTime: (opts.scheduleTime && typeof opts.scheduleTime === 'object') ? opts.scheduleTime : {},
				forceHighFrequencyDefault: !!opts.forceHighFrequencyDefault
			});
		},

		getPolicyCompleteFrequencyCategoryMap: function() {
			return {
				yearly: 'yearly',
				every_6_months: 'monthly',
				every_3_months: 'monthly',
				monthly: 'monthly',
				every_2_weeks: 'weekly',
				weekly: 'weekly',
				every_3_days: 'weekly',
				daily: 'daily',
				every_12_hours: 'high_frequency',
				every_8_hours: 'high_frequency',
				every_6_hours: 'high_frequency',
				every_4_hours: 'high_frequency',
				every_2_hours: 'high_frequency',
				hourly: 'high_frequency'
			};
		},

		getPolicyIncrementalFrequencyCategoryMap: function() {
			return {
				baseline_yearly_inc_every_2_months: 'yearly',
				baseline_every_6_months_inc_monthly: 'monthly',
				baseline_every_3_months_inc_every_2_weeks: 'monthly',
				baseline_monthly_inc_every_5_days: 'monthly',
				baseline_every_2_weeks_inc_every_3_days: 'weekly',
				baseline_weekly_inc_daily: 'weekly',
				baseline_every_3_days_inc_every_12_hours: 'weekly',
				baseline_daily_inc_every_4_hours: 'daily',
				baseline_every_12_hours_inc_every_2_hours: 'high_frequency',
				baseline_every_8_hours_inc_hourly: 'high_frequency',
				baseline_every_6_hours_inc_hourly: 'high_frequency',
				baseline_every_4_hours_inc_every_30_minutes: 'high_frequency',
				baseline_every_2_hours_inc_every_30_minutes: 'high_frequency',
				baseline_hourly_inc_every_10_minutes: 'high_frequency'
			};
		},

		getPolicySelectedFrequencyCategory: function() {
			var method = String($('#asenha-policy-method').val() || 'baseline');
			var frequencyKey = String($('#asenha-policy-frequency').val() || '');
			var category = 'daily';

			if (method === 'incremental') {
				var incrementalCategoryMap = this.getPolicyIncrementalFrequencyCategoryMap();
				category = String(incrementalCategoryMap[frequencyKey] || 'daily');
			} else {
				var completeCategoryMap = this.getPolicyCompleteFrequencyCategoryMap();
				category = String(completeCategoryMap[frequencyKey] || 'daily');
			}

			return category;
		},

		getPolicyTimeMonthOptions: function() {
			var options = [];
			if (asenhaSiteBackup && asenhaSiteBackup.policyOptions && $.isArray(asenhaSiteBackup.policyOptions.time_months)) {
				options = asenhaSiteBackup.policyOptions.time_months;
			}

			if (!options.length) {
				options = [
					{ value: 1, label: 'January' }, { value: 2, label: 'February' }, { value: 3, label: 'March' }, { value: 4, label: 'April' },
					{ value: 5, label: 'May' }, { value: 6, label: 'June' }, { value: 7, label: 'July' }, { value: 8, label: 'August' },
					{ value: 9, label: 'September' }, { value: 10, label: 'October' }, { value: 11, label: 'November' }, { value: 12, label: 'December' }
				];
			}

			return options;
		},

		getPolicyTimeWeekdayOptions: function() {
			var options = [];
			if (asenhaSiteBackup && asenhaSiteBackup.policyOptions && $.isArray(asenhaSiteBackup.policyOptions.time_weekdays)) {
				options = asenhaSiteBackup.policyOptions.time_weekdays;
			}

			if (!options.length) {
				options = [
					{ value: 1, label: 'Monday' }, { value: 2, label: 'Tuesday' }, { value: 3, label: 'Wednesday' }, { value: 4, label: 'Thursday' },
					{ value: 5, label: 'Friday' }, { value: 6, label: 'Saturday' }, { value: 7, label: 'Sunday' }
				];
			}

			return options;
		},

		getPolicyHourOptions: function() {
			var options = [];
			for (var hour = 0; hour < 24; hour++) {
				var value = (hour < 10 ? '0' : '') + String(hour);
				options.push({
					value: hour,
					label: value
				});
			}
			return options;
		},

		getPolicyMinuteOptions: function() {
			return [
				{ value: 0, label: '00' },
				{ value: 15, label: '15' },
				{ value: 30, label: '30' },
				{ value: 45, label: '45' }
			];
		},

		getPolicyNextTopHourDefaults: function() {
			var now = new Date();
			var hour = parseInt(now.getHours(), 10) || 0;
			hour = (hour + 1) % 24;
			return {
				hour: hour,
				minute: 0
			};
		},

		buildPolicySelectOptionsHtml: function(options, selectedValue) {
			options = $.isArray(options) ? options : [];
			selectedValue = String(selectedValue || '');
			var html = '';
			for (var i = 0; i < options.length; i++) {
				var opt = options[i] || {};
				var value = String(opt.value);
				var label = String(opt.label || value);
				html += '<option value="' + this.escapeAttr(value) + '"' + ((value === selectedValue) ? ' selected' : '') + '>' + this.escapeHtml(label) + '</option>';
			}
			return html;
		},

		normalizePolicyScheduleTime: function(scheduleTime, category, opts) {
			scheduleTime = (scheduleTime && typeof scheduleTime === 'object') ? scheduleTime : {};
			opts = opts || {};
			var now = new Date();
			var topHourDefaults = this.getPolicyNextTopHourDefaults();
			var standardDefaultHour = 3;
			var mode = String(scheduleTime.mode || category || 'daily');
			var month = parseInt(scheduleTime.month, 10);
			var day = parseInt(scheduleTime.day, 10);
			var weekday = parseInt(scheduleTime.weekday, 10);
			var hour = parseInt(scheduleTime.hour, 10);
			var minute = parseInt(scheduleTime.minute, 10);

			if (isNaN(month) || month < 1 || month > 12) {
				month = parseInt(now.getMonth(), 10) + 1;
			}
			if (isNaN(day) || day < 1 || day > 31) {
				day = parseInt(now.getDate(), 10);
			}
			if (isNaN(weekday) || weekday < 1 || weekday > 7) {
				var nativeWeekday = parseInt(now.getDay(), 10); // 0=Sunday.
				weekday = (nativeWeekday === 0) ? 7 : nativeWeekday;
			}
			if (isNaN(hour) || hour < 0 || hour > 23) {
				hour = (category === 'high_frequency') ? topHourDefaults.hour : standardDefaultHour;
			}
			if ([0, 15, 30, 45].indexOf(minute) === -1) {
				minute = 0;
			}

			var forceHighFrequencyDefault = !!opts.forceHighFrequencyDefault;
			var preserveCurrent = !!opts.preserveCurrent;
			var previousMode = String(scheduleTime.mode || '');
			if (category === 'high_frequency') {
				var shouldResetToTopHour = forceHighFrequencyDefault || !preserveCurrent || previousMode !== 'high_frequency';
				if (shouldResetToTopHour) {
					hour = topHourDefaults.hour;
					minute = topHourDefaults.minute;
				}
			}

			return {
				mode: mode,
				month: month,
				day: day,
				weekday: weekday,
				hour: hour,
				minute: minute
			};
		},

		renderPolicyTimeControls: function(opts) {
			opts = opts || {};
			var $row = $('#asenha-policy-time-row');
			var $controls = $('#asenha-policy-time-controls');
			if (!$row.length || !$controls.length) {
				return;
			}

			var category = this.getPolicySelectedFrequencyCategory();
			if (!category) {
				$row.hide();
				$controls.empty();
				return;
			}

			var currentCollected = this.collectPolicyScheduleTimeFromModal();
			var scheduleTime = (opts.scheduleTime && typeof opts.scheduleTime === 'object' && !$.isEmptyObject(opts.scheduleTime))
				? opts.scheduleTime
				: currentCollected;
			var normalized = this.normalizePolicyScheduleTime(scheduleTime, category, {
				forceHighFrequencyDefault: !!opts.forceHighFrequencyDefault,
				preserveCurrent: !!opts.preserveCurrent
			});

			var monthOptions = this.getPolicyTimeMonthOptions();
			var weekdayOptions = this.getPolicyTimeWeekdayOptions();
			var hourOptions = this.getPolicyHourOptions();
			var minuteOptions = this.getPolicyMinuteOptions();
			var dayPrefixLabel = asenhaSbT('policyTimeDayPrefix') || 'Day';

			var html = '';
			html += '<input type="hidden" id="asenha-policy-time-mode" value="' + this.escapeAttr(category) + '" />';

			if (category === 'yearly') {
				html += '<select id="asenha-policy-time-month" class="asenha-policy-time-month">' + this.buildPolicySelectOptionsHtml(monthOptions, String(normalized.month)) + '</select>';
				html += '<select id="asenha-policy-time-day" class="asenha-policy-time-day">' + this.buildPolicySelectOptionsHtml(this.getPolicyDayNumberOptions(), String(normalized.day)) + '</select>';
				html += '<span class="asenha-policy-time-sep">-</span>';
			} else if (category === 'monthly') {
				html += '<span class="asenha-policy-time-static-label">' + this.escapeHtml(dayPrefixLabel) + '</span>';
				html += '<select id="asenha-policy-time-day" class="asenha-policy-time-day">' + this.buildPolicySelectOptionsHtml(this.getPolicyDayNumberOptions(), String(normalized.day)) + '</select>';
				html += '<span class="asenha-policy-time-sep">-</span>';
			} else if (category === 'weekly') {
				html += '<select id="asenha-policy-time-weekday" class="asenha-policy-time-weekday">' + this.buildPolicySelectOptionsHtml(weekdayOptions, String(normalized.weekday)) + '</select>';
				html += '<span class="asenha-policy-time-sep">-</span>';
			}

			html += '<select id="asenha-policy-time-hour" class="asenha-policy-time-hour">' + this.buildPolicySelectOptionsHtml(hourOptions, String(normalized.hour)) + '</select>';
			html += '<span class="asenha-policy-time-colon">:</span>';
			html += '<select id="asenha-policy-time-minute" class="asenha-policy-time-minute">' + this.buildPolicySelectOptionsHtml(minuteOptions, String(normalized.minute)) + '</select>';

			$controls.html(html);
			$row.show();
			this.schedulePolicyFirstRunPreview();
		},

		getPolicyDayNumberOptions: function() {
			var options = [];
			for (var day = 1; day <= 31; day++) {
				options.push({
					value: day,
					label: String(day)
				});
			}
			return options;
		},

		getPolicyRetentionPeriodSecondsMap: function() {
			var minute = 60;
			var hour = 60 * minute;
			var day = 24 * hour;
			var week = 7 * day;
			var month = 2629746;
			var year = 31556926;

			return {
				keep_forever: 0,
				'3_years': 3 * year,
				'2_years': 2 * year,
				'1_year': year,
				'9_months': 9 * month,
				'6_months': 6 * month,
				'3_months': 3 * month,
				'2_months': 2 * month,
				'1_month': month,
				'2_weeks': 2 * week,
				'1_week': week,
				'3_days': 3 * day,
				'1_day': day
			};
		},

		getPolicyCompleteFrequencyCadenceSecondsMap: function() {
			var hour = 3600;
			var day = 24 * hour;
			var week = 7 * day;
			var month = 2629746;
			var year = 31556926;

			return {
				yearly: year,
				every_6_months: 6 * month,
				every_3_months: 3 * month,
				monthly: month,
				every_2_weeks: 2 * week,
				weekly: week,
				every_3_days: 3 * day,
				daily: day,
				every_12_hours: 12 * hour,
				every_8_hours: 8 * hour,
				every_6_hours: 6 * hour,
				every_4_hours: 4 * hour,
				every_2_hours: 2 * hour,
				hourly: hour
			};
		},

		getPolicyIncrementalBaselineCadenceSecondsMap: function() {
			var completeMap = this.getPolicyCompleteFrequencyCadenceSecondsMap();
			return {
				baseline_yearly_inc_every_2_months: completeMap.yearly,
				baseline_every_6_months_inc_monthly: completeMap.every_6_months,
				baseline_every_3_months_inc_every_2_weeks: completeMap.every_3_months,
				baseline_monthly_inc_every_5_days: completeMap.monthly,
				baseline_every_2_weeks_inc_every_3_days: completeMap.every_2_weeks,
				baseline_weekly_inc_daily: completeMap.weekly,
				baseline_every_3_days_inc_every_12_hours: completeMap.every_3_days,
				baseline_daily_inc_every_4_hours: completeMap.daily,
				baseline_every_12_hours_inc_every_2_hours: completeMap.every_12_hours,
				baseline_every_8_hours_inc_hourly: completeMap.every_8_hours,
				baseline_every_6_hours_inc_hourly: completeMap.every_6_hours,
				baseline_every_4_hours_inc_every_30_minutes: completeMap.every_4_hours,
				baseline_every_2_hours_inc_every_30_minutes: completeMap.every_2_hours,
				baseline_hourly_inc_every_10_minutes: completeMap.hourly
			};
		},

		getPolicySelectedCadenceSeconds: function() {
			var method = String($('#asenha-policy-method').val() || 'baseline');
			var frequencyKey = String($('#asenha-policy-frequency').val() || '');
			var cadenceSeconds = 0;

			if (method === 'incremental') {
				var baselineMap = this.getPolicyIncrementalBaselineCadenceSecondsMap();
				cadenceSeconds = parseInt(baselineMap[frequencyKey], 10) || 0;
			} else {
				var completeMap = this.getPolicyCompleteFrequencyCadenceSecondsMap();
				cadenceSeconds = parseInt(completeMap[frequencyKey], 10) || 0;
			}

			return Math.max(0, cadenceSeconds);
		},

		syncPolicyRetentionPeriodOptions: function(opts) {
			opts = opts || {};
			var $select = $('#asenha-policy-retention-period');
			if (!$select.length) {
				return;
			}

			var currentValue = (typeof opts.currentValue !== 'undefined')
				? String(opts.currentValue || '')
				: String($select.val() || '');
			var cadenceSeconds = this.getPolicySelectedCadenceSeconds();
			var secondsMap = this.getPolicyRetentionPeriodSecondsMap();
			var options = (asenhaSiteBackup && asenhaSiteBackup.policyOptions && $.isArray(asenhaSiteBackup.policyOptions.retention_periods))
				? asenhaSiteBackup.policyOptions.retention_periods
				: [];

			var allowed = [];
			for (var i = 0; i < options.length; i++) {
				var opt = options[i] || {};
				var value = String(opt.value || '');
				var label = String(opt.label || value);
				var periodSeconds = parseInt(secondsMap[value], 10);
				if (!value || isNaN(periodSeconds)) {
					continue;
				}

				if (periodSeconds === 0 || cadenceSeconds <= 0 || periodSeconds >= cadenceSeconds) {
					allowed.push({
						value: value,
						label: label,
						seconds: periodSeconds
					});
				}
			}

			if (!allowed.length) {
				allowed.push({
					value: 'keep_forever',
					label: this.getPolicyRetentionPeriodLabel('keep_forever'),
					seconds: 0
				});
			}

			var html = '';
			var allowedMap = {};
			for (var j = 0; j < allowed.length; j++) {
				allowedMap[allowed[j].value] = true;
				html += '<option value="' + this.escapeAttr(allowed[j].value) + '">' + this.escapeHtml(allowed[j].label) + '</option>';
			}
			$select.html(html);

			var selectedValue = '';
			if (currentValue && allowedMap[currentValue]) {
				selectedValue = currentValue;
			} else if (allowedMap['1_month']) {
				selectedValue = '1_month';
			} else {
				var nearestFiniteValue = '';
				var nearestFiniteSeconds = Number.MAX_SAFE_INTEGER;
				for (var k = 0; k < allowed.length; k++) {
					var item = allowed[k] || {};
					if (item.seconds > 0 && item.seconds < nearestFiniteSeconds) {
						nearestFiniteSeconds = item.seconds;
						nearestFiniteValue = item.value;
					}
				}
				selectedValue = nearestFiniteValue || (allowedMap.keep_forever ? 'keep_forever' : String(allowed[0].value || ''));
			}

			if (selectedValue) {
				$select.val(selectedValue);
			}
		},

		updatePolicyEncryptionFieldsState: function() {
			var enabled = $('#asenha-policy-encryption-enabled').is(':checked');
			$('#asenha-policy-encryption-fields').toggle(!!enabled);
		},

		updatePolicyRetentionFieldsState: function() {
			var mode = String($('#asenha-policy-retention-mode').val() || 'period');
			var keepAll = $('#asenha-policy-retention-keep-all').is(':checked');

			$('#asenha-policy-retention-period-wrap').css('display', (mode === 'period') ? 'block' : 'none');
			$('#asenha-policy-retention-count-wrap').css('display', (mode === 'count') ? 'flex' : 'none');
			$('#asenha-policy-retention-count').prop('disabled', mode !== 'count' || keepAll);
		},

		collectPolicyPayloadFromModal: function() {
			var remoteIds = [];
			$('#asenha-policy-remote-locations .asenha-policy-remote-location-checkbox:checked').each(function() {
				var value = String($(this).val() || '');
				if (value) {
					remoteIds.push(value);
				}
			});
			var failureNotificationUserIds = [];
			$('#asenha-policy-failure-notification-users option:selected').each(function() {
				var userId = parseInt($(this).val(), 10);
				if (!isNaN(userId) && userId > 0) {
					failureNotificationUserIds.push(userId);
				}
			});
			failureNotificationUserIds = this.normalizePolicyFailureNotificationUserIds(failureNotificationUserIds);

			var payload = {
				title: String($('#asenha-policy-title').val() || '').trim(),
				enabled: $('#asenha-policy-enabled').is(':checked'),
				type: String($('#asenha-policy-type').val() || 'full'),
				template_id: String($('#asenha-policy-template').val() || ''),
				backup_method: String($('#asenha-policy-method').val() || 'baseline'),
				multipart_enabled: $('#asenha-policy-multipart-enabled').is(':checked'),
				multipart_part_bytes: parseInt($('#asenha-policy-multipart-part-bytes').val(), 10) || (256 * 1024 * 1024),
				archive_encryption_enabled: $('#asenha-policy-encryption-enabled').is(':checked'),
				archive_encryption_passphrase: String($('#asenha-policy-encryption-passphrase').val() || ''),
				archive_encryption_passphrase_confirm: String($('#asenha-policy-encryption-passphrase-confirm').val() || ''),
				locations: {
					local_enabled: $('#asenha-policy-location-local').is(':checked'),
					remote_location_ids: remoteIds
				},
				frequency_key: String($('#asenha-policy-frequency').val() || ''),
				schedule_time: this.collectPolicyScheduleTimeFromModal(),
				retention: {
					mode: String($('#asenha-policy-retention-mode').val() || 'period'),
					period_key: String($('#asenha-policy-retention-period').val() || '1_month'),
					complete_count: parseInt($('#asenha-policy-retention-count').val(), 10) || 10,
					keep_all: $('#asenha-policy-retention-keep-all').is(':checked')
				},
				failure_notification_user_ids: failureNotificationUserIds
			};

			if (!payload.locations.local_enabled && !payload.locations.remote_location_ids.length) {
				payload.locations.local_enabled = true;
			}
			if (payload.type === 'database') {
				payload.backup_method = 'baseline';
			}

			return payload;
		},

		collectPolicyScheduleTimeFromModal: function() {
			var mode = String($('#asenha-policy-time-mode').val() || '');
			if (!mode) {
				return {};
			}

			var hour = parseInt($('#asenha-policy-time-hour').val(), 10);
			var minute = parseInt($('#asenha-policy-time-minute').val(), 10);
			var month = parseInt($('#asenha-policy-time-month').val(), 10);
			var day = parseInt($('#asenha-policy-time-day').val(), 10);
			var weekday = parseInt($('#asenha-policy-time-weekday').val(), 10);

			if (isNaN(hour)) {
				hour = 0;
			}
			if (isNaN(minute)) {
				minute = 0;
			}

			var scheduleTime = {
				mode: mode,
				hour: hour,
				minute: minute
			};

			if (mode === 'yearly') {
				scheduleTime.month = isNaN(month) ? 1 : month;
				scheduleTime.day = isNaN(day) ? 1 : day;
			} else if (mode === 'monthly') {
				scheduleTime.day = isNaN(day) ? 1 : day;
			} else if (mode === 'weekly') {
				scheduleTime.weekday = isNaN(weekday) ? 1 : weekday;
			}

			return scheduleTime;
		},

		schedulePolicyEstimatePreview: function() {
			var self = this;
			if (this.policyEstimateTimer) {
				clearTimeout(this.policyEstimateTimer);
			}
			this.policyEstimateTimer = setTimeout(function() {
				self.refreshPolicyEstimatePreview();
			}, 250);
		},

		schedulePolicyFirstRunPreview: function() {
			var self = this;
			if (this.policyFirstRunTimer) {
				clearTimeout(this.policyFirstRunTimer);
			}
			this.policyFirstRunTimer = setTimeout(function() {
				self.refreshPolicyFirstRunPreview();
			}, 250);
		},

		renderPolicyFirstRunPreview: function(upcomingRuns) {
			var $preview = $('#asenha-policy-first-run-preview');
			if (!$preview.length) {
				return;
			}

			var runsLabel = String(asenhaSbT('policyNextRunsLabel') || 'Next runs');
			if (runsLabel && runsLabel.slice(-1) !== ':') {
				runsLabel += ':';
			}

			var fallbackText = String(asenhaSbT('policyFirstRunUnavailable') || '-');
			var normalizedRuns = $.isArray(upcomingRuns) ? upcomingRuns.slice(0, 3) : [];
			while (normalizedRuns.length < 3) {
				normalizedRuns.push({
					available: false,
					formatted: fallbackText,
					method: ''
				});
			}

			var html = '';
			html += '<span class="asenha-policy-run-preview-label">' + this.escapeHtml(runsLabel) + '</span>';
			for (var i = 0; i < normalizedRuns.length; i++) {
				var run = normalizedRuns[i] || {};
				var method = String(run.method || '');
				var formatted = String(run.formatted || '');
				if (!formatted) {
					formatted = fallbackText;
				}
				var methodBadge = this.renderPolicyMethodBadgeHtml(method);
				if (i > 0) {
					html += '<span class="asenha-policy-run-preview-arrow" aria-hidden="true">=&gt;</span>';
				}
				html += '<span class="asenha-policy-run-preview-item">';
				if (methodBadge) {
					html += methodBadge + ' ';
				}
				html += '<span class="asenha-policy-run-preview-time">' + this.escapeHtml(formatted) + '</span>';
				html += '</span>';
			}

			$preview.html(html);
		},

		refreshPolicyFirstRunPreview: function() {
			var payload = this.collectPolicyPayloadFromModal();
			var $modal = $('#asenha-policy-modal');
			if (!$modal.length || !$modal.is(':visible')) {
				return;
			}

			if (this.policyFirstRunXhr && this.policyFirstRunXhr.readyState !== 4) {
				this.policyFirstRunXhr.abort();
			}

			var loadingText = String(asenhaSbT('policyFirstRunLoading') || asenhaSbT('loading'));
			this.renderPolicyFirstRunPreview([
				{ available: false, formatted: loadingText, method: '' },
				{ available: false, formatted: loadingText, method: '' },
				{ available: false, formatted: loadingText, method: '' }
			]);
			this.policyFirstRunXhr = $.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_preview_backup_policy_first_run',
					nonce: asenhaSiteBackup.nonce,
					policy: JSON.stringify(payload)
				}
			}).done(function(resp) {
				var fallbackText = String(asenhaSbT('policyFirstRunUnavailable') || '-');
				if (!resp || !resp.success || !resp.data) {
					SiteBackup.renderPolicyFirstRunPreview([
						{ available: false, formatted: fallbackText, method: '' },
						{ available: false, formatted: fallbackText, method: '' },
						{ available: false, formatted: fallbackText, method: '' }
					]);
					return;
				}

				var rawUpcomingRuns = $.isArray(resp.data.upcoming_runs) ? resp.data.upcoming_runs.slice(0, 3) : [];
				if (!rawUpcomingRuns.length) {
					rawUpcomingRuns = [
						resp.data.first_run || {},
						resp.data.second_run || {},
						{}
					];
				}

				var upcomingRuns = [];
				for (var i = 0; i < 3; i++) {
					var entry = rawUpcomingRuns[i] || {};
					var formatted = String(entry.formatted || '');
					if (!formatted) {
						formatted = fallbackText;
					}
					upcomingRuns.push({
						available: !!entry.available,
						formatted: formatted,
						method: String(entry.method || '')
					});
				}

				SiteBackup.renderPolicyFirstRunPreview(upcomingRuns);
			}).fail(function(jqXHR, textStatus) {
				if (textStatus === 'abort') {
					return;
				}
				var fallback = String(asenhaSbT('policyFirstRunUnavailable') || '-');
				SiteBackup.renderPolicyFirstRunPreview([
					{ available: false, formatted: fallback, method: '' },
					{ available: false, formatted: fallback, method: '' },
					{ available: false, formatted: fallback, method: '' }
				]);
			});
		},

		refreshPolicyEstimatePreview: function() {
			var self = this;
			var payload = this.collectPolicyPayloadFromModal();
			if (this.policyEstimateXhr && this.policyEstimateXhr.readyState !== 4) {
				this.policyEstimateXhr.abort();
			}

			$('#asenha-policy-estimate-preview').text(asenhaSbT('loading'));
			this.policyEstimateXhr = $.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_estimate_backup_policy_storage',
					nonce: asenhaSiteBackup.nonce,
					policy: JSON.stringify(payload)
				}
			}).done(function(resp) {
				if (!resp || !resp.success || !resp.data) {
					$('#asenha-policy-estimate-preview').text(asenhaSbT('policyEstimateUnavailable'));
					return;
				}
				var estimate = resp.data.estimate || {};
				if (!estimate.available) {
					$('#asenha-policy-estimate-preview').text(asenhaSbT('policyEstimateUnavailable'));
					return;
				}
				if (estimate.is_unbounded) {
					$('#asenha-policy-estimate-preview').text(self.getPolicyRetentionPeriodLabel('keep_forever'));
					return;
				}
				var estimatedTotalHuman = String(estimate.estimated_total_human || '');
				if (!estimatedTotalHuman) {
					$('#asenha-policy-estimate-preview').text(asenhaSbT('policyEstimateUnavailable'));
					return;
				}
				$('#asenha-policy-estimate-preview').text('~' + estimatedTotalHuman);
			}).fail(function() {
				$('#asenha-policy-estimate-preview').text(asenhaSbT('policyEstimateUnavailable'));
			});
		},

		savePolicyFromModal: function() {
			var self = this;
			var payload = this.collectPolicyPayloadFromModal();
			var policyId = String($('#asenha-policy-id').val() || '');
			var isEdit = !!policyId;

			if (!payload.title) {
				self.showNotice('error', asenhaSbT('policyTitle') + ' is required.');
				return;
			}

			var action = isEdit ? 'asenha_update_backup_policy' : 'asenha_create_backup_policy';
			var requestData = {
				action: action,
				nonce: asenhaSiteBackup.nonce,
				policy: JSON.stringify(payload)
			};
			if (isEdit) {
				requestData.policy_id = policyId;
			}

			$('#asenha-policy-save').prop('disabled', true);
			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: requestData
			}).done(function(resp) {
				$('#asenha-policy-save').prop('disabled', false);
				if (!resp || !resp.success) {
					self.showNotice('error', (resp && resp.data && resp.data.message) ? resp.data.message : asenhaSbT('requestFailed'));
					return;
				}

				$('#asenha-policy-modal').hide();
				self.showNotice('success', asenhaSbT('policySaved'));
				self.refreshPoliciesList();
			}).fail(function() {
				$('#asenha-policy-save').prop('disabled', false);
				self.showNotice('error', asenhaSbT('requestFailed'));
			});
		},

		/**
		 * Initialize Locations UI (Backup > Locations subtab).
		 *
		 * @since 8.7.0
		 */
		initLocationsUi: function() {
			var self = this;

			if (!$('#asenha-remote-locations-list').length && !$('#asenha-location-local-enabled').length) {
				return;
			}

			this.refreshLocationsUi();

			$(document).off('click.asenhaAddBackupLocation').on('click.asenhaAddBackupLocation', '#asenha-add-backup-location', function(e) {
				e.preventDefault();
				self.openBackupLocationModal(null);
			});

			$(document).off('change.asenhaToggleBackupLocation').on('change.asenhaToggleBackupLocation', '.asenha-location-enabled, .asenha-backup-location-enabled', function() {
				var $cb = $(this);
				var locationId = String($cb.data('locationId') || $cb.data('location-id') || '');
				var enabled = $cb.is(':checked');
				if (!locationId) {
					return;
				}
				self.toggleBackupLocation(locationId, enabled, $cb);
			});

			$(document).off('click.asenhaEditBackupLocation').on('click.asenhaEditBackupLocation', '.asenha-backup-location-edit', function(e) {
				e.preventDefault();
				var id = String($(this).data('locationId') || $(this).data('location-id') || '');
				if (!id) { return; }
				var loc = self.getCachedRemoteLocationById(id);
				self.openBackupLocationModal(loc);
			});

			$(document).off('click.asenhaDeleteBackupLocation').on('click.asenhaDeleteBackupLocation', '.asenha-backup-location-delete', function(e) {
				e.preventDefault();
				var id = String($(this).data('locationId') || $(this).data('location-id') || '');
				if (!id) { return; }
				self.deleteBackupLocation(id);
			});
		},

		/**
		 * Refresh Locations settings from server and re-render UI.
		 *
		 * @since 8.7.0
		 */
		refreshLocationsUi: function() {
			var self = this;
			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_get_backup_locations',
					nonce: asenhaSiteBackup.nonce
				}
			}).done(function(resp) {
				if (!resp || !resp.success || !resp.data) {
					return;
				}
				self.locationsCache = resp.data.locations || {};
				self.locationCounts = resp.data.location_counts || {};
				self.locationCanDelete = resp.data.can_delete || {};

				var localEnabled = true;
				if (resp.data.local && typeof resp.data.local.enabled !== 'undefined') {
					localEnabled = !!resp.data.local.enabled;
				} else if (self.locationsCache && self.locationsCache.local && typeof self.locationsCache.local.enabled !== 'undefined') {
					localEnabled = !!self.locationsCache.local.enabled;
				}

				$('#asenha-location-local-enabled').prop('checked', localEnabled);
				$('.asenha-location-card-local .asenha-location-details').toggle(!!localEnabled);

				self.renderRemoteLocationsList();
			}).fail(function() {
				// Best-effort only.
			});
		},

		getRemoteLocationStatusText: function(remote) {
			remote = remote || {};
			var enabled = !!remote.enabled;
			var type = String(remote.type || '');
			var cfg = remote.config || {};

			if (!enabled) {
				return asenhaSbT('connectionStatusNotAvailableDisabled');
			}

			// OAuth-backed locations: connection is derived from token presence.
			if (type === 'google_drive' || type === 'dropbox') {
				if (cfg && cfg.refresh_token_is_set) {
					return asenhaSbT('connectionStatusConnected');
				}
				var msg = String((cfg && cfg.connection_message) ? cfg.connection_message : '').trim();
				if (msg) {
					var tpl = asenhaSbT('connectionStatusNotConnectedWithReason');
					tpl = tpl.replace(/%(\d+\$)?s/, msg);
					return tpl;
				}
				return asenhaSbT('connectionStatusNotConnected');
			}

			var state = String((cfg && cfg.connection_state) ? cfg.connection_state : '');
			var message = String((cfg && cfg.connection_message) ? cfg.connection_message : '').trim();

			if (state === 'connected') {
				return asenhaSbT('connectionStatusConnected');
			}
			if (state === 'not_connected') {
				if (message) {
					var tpl = asenhaSbT('connectionStatusNotConnectedWithReason');
					tpl = tpl.replace(/%(\d+\$)?s/, message);
					return tpl;
				}
				return asenhaSbT('connectionStatusNotConnected');
			}
			if (state === 'not_tested') {
				var tpl = asenhaSbT('connectionStatusNotConnectedWithReason');
				tpl = tpl.replace(/%(\d+\$)?s/, asenhaSbT('connectionStatusNotTestedDot'));
				return tpl;
			}

			var tpl = asenhaSbT('connectionStatusNotConnectedWithReason');
			tpl = tpl.replace(/%(\d+\$)?s/, asenhaSbT('connectionStatusNotTestedDot'));
			return tpl;
		},

		/**
		 * Render remote locations list.
		 *
		 * @since 8.7.0
		 */
		renderRemoteLocationsList: function() {
			var self = this;
			var $wrap = $('#asenha-remote-locations-list');
			if (!$wrap.length) {
				return;
			}

			var remotes = [];
			if (self.locationsCache && self.locationsCache.remotes && $.isArray(self.locationsCache.remotes)) {
				remotes = self.locationsCache.remotes;
			}

			var supportedTypes = { sftp: true, webdav: true, wp_site: true, s3: true, s3_compatible: true, google_drive: true, dropbox: true };
			remotes = $.grep(remotes, function(remote) {
				var type = String((remote && remote.type) ? remote.type : '');
				return !!supportedTypes[type];
			});

			if (!remotes.length) {
				$wrap.html('<p class="description">' + asenhaSbT('noRemoteLocations') + '</p>');
				return;
			}

			var esc = function(s) { return $('<div/>').text(String(s || '')).html(); };
			var html = '';
			html += '<table class="wp-list-table widefat fixed striped asenha-remote-locations-table">';
			html += '<thead><tr>';
			html += '<th class="column-location">' + esc(asenhaSbT('location')) + '</th>';
			html += '<th class="column-enabled">' + esc(asenhaSbT('enabled')) + '</th>';
			html += '<th class="column-status">' + esc(asenhaSbT('status')) + '</th>';
			html += '<th class="column-actions">' + esc(asenhaSbT('actions')) + '</th>';
			html += '</tr></thead><tbody>';

			for (var i = 0; i < remotes.length; i++) {
				var r = remotes[i] || {};
				var id = String(r.id || '');
				if (!id) { continue; }
				var type = String(r.type || '');
				var title = String(r.title || '');
				var enabled = !!r.enabled;
				var label = self.formatRemoteLocationLabel(type, title);
				var statusText = self.getRemoteLocationStatusText(r);

				var canDelete = true;
				if (self.locationCanDelete && typeof self.locationCanDelete[id] !== 'undefined') {
					canDelete = !!self.locationCanDelete[id];
				}
				var count = 0;
				if (self.locationCounts && typeof self.locationCounts[id] !== 'undefined') {
					count = parseInt(self.locationCounts[id], 10) || 0;
				}

				var deleteTitle = canDelete ? '' : asenhaSbT('locationDeleteBlocked');
				if (!canDelete && count > 0) {
					deleteTitle = deleteTitle + ' (' + count + ')';
				}

				html += '<tr data-location-id="' + esc(id) + '">';
				html += '<td class="column-location"><strong>' + esc(label) + '</strong></td>';
				html += '<td class="column-enabled">';
				html += '<label class="asenha-location-toggle">';
				html += '<input type="checkbox" class="asenha-backup-location-enabled" data-location-id="' + esc(id) + '"' + (enabled ? ' checked' : '') + ' /> ';
				html += '<span class="screen-reader-text">' + esc(asenhaSbT('enabled')) + '</span>';
				html += '</label>';
				html += '</td>';
				html += '<td class="column-status"><span class="asenha-remote-location-status">' + esc(statusText) + '</span></td>';
				html += '<td class="column-actions">';
				html += '<button type="button" class="button button-small asenha-backup-location-edit" data-location-id="' + esc(id) + '">' + esc(asenhaSbT('edit')) + '</button> ';
				html += '<button type="button" class="button button-small asenha-backup-location-delete" data-location-id="' + esc(id) + '"' + (canDelete ? '' : ' disabled') + (deleteTitle ? ' title="' + esc(deleteTitle) + '"' : '') + '>' + esc(asenhaSbT('remove')) + '</button>';
				html += '</td>';
				html += '</tr>';
			}

			html += '</tbody></table>';
			$wrap.html(html);
		},

		getCachedRemoteLocationById: function(id) {
			id = String(id || '');
			if (!id || !this.locationsCache || !this.locationsCache.remotes || !this.locationsCache.remotes.length) {
				return null;
			}
			for (var i = 0; i < this.locationsCache.remotes.length; i++) {
				var r = this.locationsCache.remotes[i] || {};
				if (String(r.id || '') === id) {
					return r;
				}
			}
			return null;
		},

		toggleBackupLocation: function(locationId, enabled, $cb) {
			var self = this;
			enabled = !!enabled;
			locationId = String(locationId || '');
			if (!locationId) { return; }

			var prev = !enabled;
			if ($cb && $cb.length) {
				prev = !$cb.is(':checked');
				$cb.prop('disabled', true);
			}

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_toggle_backup_location',
					nonce: asenhaSiteBackup.nonce,
					location_id: locationId,
					enabled: enabled ? 1 : 0
				}
			}).done(function(resp) {
				if ($cb && $cb.length) {
					$cb.prop('disabled', false);
				}
				if (!resp || !resp.success) {
					if ($cb && $cb.length) {
						$cb.prop('checked', prev);
					}
					self.showNotice('error', (resp && resp.data && resp.data.message) ? resp.data.message : asenhaSbT('failedToUpdateLocation'));
					return;
				}
				self.refreshLocationsUi();
			}).fail(function() {
				if ($cb && $cb.length) {
					$cb.prop('disabled', false).prop('checked', prev);
				}
				self.showNotice('error', asenhaSbT('failedToUpdateLocation'));
			});
		},

		deleteBackupLocation: function(locationId) {
			var self = this;
			locationId = String(locationId || '');
			if (!locationId) { return; }

			if (!window.confirm(asenhaSbT('confirmDelete'))) {
				return;
			}

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_delete_backup_location',
					nonce: asenhaSiteBackup.nonce,
					location_id: locationId
				}
			}).done(function(resp) {
				if (!resp || !resp.success) {
					self.showNotice('error', (resp && resp.data && resp.data.message) ? resp.data.message : asenhaSbT('failedToDeleteLocation'));
					return;
				}
				self.refreshLocationsUi();
			}).fail(function() {
				self.showNotice('error', asenhaSbT('failedToDeleteLocation'));
			});
		},

		/**
		 * Normalize a remote-like path (best-effort).
		 *
		 * - Uses forward slashes
		 * - Ensures leading slash
		 * - Removes trailing slash (except for root '/')
		 * - Rejects traversal segments
		 *
		 * @param {string} path
		 * @return {string}
		 * @since 8.7.0
		 */
		normalizeSftpPath: function(path) {
			path = String(path || '');
			path = path.replace(/\0/g, '');
			path = path.trim();
			path = path.replace(/\\/g, '/');
			path = path.replace(/\/+/g, '/');

			// Disallow traversal.
			if (/(^|\/)\.\.(\/|$)/.test(path)) {
				return '/';
			}

			if (!path) {
				return '/';
			}
			if (path.charAt(0) !== '/') {
				path = '/' + path;
			}
			if (path.length > 1) {
				path = path.replace(/\/+$/, '');
			}
			return path;
		},

		/**
		 * Get the base path for SFTP browsing/display.
		 *
		 * Prefer server-provided base (modal data), fallback to /home/{username}.
		 *
		 * @param {string} username
		 * @param {string} modalBasePath
		 * @return {string}
		 * @since 8.7.0
		 */
		getSftpBasePath: function(username, modalBasePath) {
			modalBasePath = String(modalBasePath || '').trim();
			if (modalBasePath) {
				return this.normalizeSftpPath(modalBasePath);
			}

			username = String(username || '');
			username = username.replace(/[\/\\\0]/g, '').trim();
			if (!username) {
				return '/home';
			}
			return this.normalizeSftpPath('/home/' + username);
		},

		/**
		 * Convert a full path to a display path relative to base.
		 *
		 * @param {string} fullPath
		 * @param {string} basePath
		 * @return {string}
		 * @since 8.7.0
		 */
		sftpPathToDisplay: function(fullPath, basePath) {
			fullPath = this.normalizeSftpPath(fullPath);
			basePath = String(basePath || '').trim();
			basePath = basePath ? this.normalizeSftpPath(basePath) : '';

			if (!basePath || basePath === '/') {
				return fullPath;
			}
			if (fullPath === basePath) {
				return '/';
			}
			if (fullPath.indexOf(basePath + '/') === 0) {
				var rest = fullPath.substring(basePath.length);
				if (!rest) {
					return '/';
				}
				if (rest.charAt(0) !== '/') {
					rest = '/' + rest;
				}
				return rest;
			}

			// If path is outside base, show as-is (backend will clamp on save).
			return fullPath;
		},

		/**
		 * Convert a display path (relative to base) back into a full absolute path.
		 *
		 * @param {string} displayPath
		 * @param {string} basePath
		 * @return {string}
		 * @since 8.7.0
		 */
		sftpPathToFull: function(displayPath, basePath) {
			basePath = String(basePath || '').trim();
			basePath = basePath ? this.normalizeSftpPath(basePath) : '';

			displayPath = String(displayPath || '').trim();
			if (!basePath || basePath === '/') {
				return this.normalizeSftpPath(displayPath);
			}

			if (!displayPath || displayPath === '/') {
				return basePath;
			}

			// If already a full path under base, keep it.
			var maybeFull = this.normalizeSftpPath(displayPath);
			if (maybeFull === basePath || maybeFull.indexOf(basePath + '/') === 0) {
				return maybeFull;
			}

			var rel = maybeFull;
			if (rel.charAt(0) !== '/') {
				rel = '/' + rel;
			}

			var full = String(basePath).replace(/\/+$/, '') + rel;
			full = full.replace(/\/+/g, '/');
			return this.normalizeSftpPath(full);
		},

		ensureBackupLocationModalExists: function() {
			if ($('#asenha-location-modal').length) {
				return;
			}
			var html = '';
			html += '<div class="asenha-modal-overlay" id="asenha-location-modal" style="display:none;">';
			html += '  <div class="asenha-modal">';
			html += '    <div class="asenha-modal-header">';
			html += '      <h2 id="asenha-location-modal-title">' + this.escapeHtml(asenhaSbT('location')) + '</h2>';
			html += '      <button type="button" class="button-link asenha-modal-close" aria-label="' + this.escapeAttr(asenhaSbT('close')) + '">×</button>';
			html += '    </div>';
			html += '    <div class="asenha-modal-body">';
			html += '      <input type="hidden" id="asenha-location-id" value="" />';
			html += '      <table class="form-table">';
			html += '        <tr><th scope="row"><label for="asenha-location-type">' + this.escapeHtml(asenhaSbT('locationType')) + '</label></th>';
			html += '        <td><select id="asenha-location-type">';
			html += '          <option value="wp_site">' + this.escapeHtml(asenhaSbT('locationTypeWpSiteShort')) + '</option>';
			html += '          <option value="s3">' + this.escapeHtml(asenhaSbT('locationTypeS3')) + '</option>';
			html += '          <option value="s3_compatible">' + this.escapeHtml(asenhaSbT('locationTypeS3Compatible')) + '</option>';
			html += '          <option value="google_drive">' + this.escapeHtml(asenhaSbT('locationTypeGoogleDrive')) + '</option>';
			html += '          <option value="dropbox">' + this.escapeHtml(asenhaSbT('locationTypeDropbox')) + '</option>';
			html += '          <option value="sftp">' + this.escapeHtml(asenhaSbT('locationTypeSftp')) + '</option>';
			html += '          <option value="webdav">' + this.escapeHtml(asenhaSbT('locationTypeWebdav')) + '</option>';
			html += '        </select></td></tr>';
			html += '        <tr><th scope="row"><label for="asenha-location-title">' + this.escapeHtml(asenhaSbT('locationTitle')) + '</label></th>';
			html += '        <td><input type="text" class="regular-text" id="asenha-location-title" value="" /></td></tr>';
			html += '      </table>';

			html += '      <div class="asenha-location-type-panel" data-type-panel="sftp">';
			html += '        <h3 class="asenha-location-modal-subheading">' + this.escapeHtml(asenhaSbT('locationTypeSftp')) + '</h3>';
			html += '        <table class="form-table asenha-sftp-settings">';
			html += '          <tr><th scope="row"><label for="asenha-location-sftp-host">' + this.escapeHtml(asenhaSbT('host')) + '</label></th>';
			html += '          <td><input type="text" id="asenha-location-sftp-host" class="regular-text" autocomplete="off" /></td></tr>';
			html += '          <tr><th scope="row"><label for="asenha-location-sftp-port">' + this.escapeHtml(asenhaSbT('port')) + '</label></th>';
			html += '          <td><input type="number" id="asenha-location-sftp-port" class="small-text" value="22" min="1" max="65535" /></td></tr>';
			html += '          <tr><th scope="row"><label for="asenha-location-sftp-username">' + this.escapeHtml(asenhaSbT('username')) + '</label></th>';
			html += '          <td><input type="text" id="asenha-location-sftp-username" class="regular-text" autocomplete="off" /></td></tr>';
			html += '          <tr><th scope="row"><label for="asenha-location-sftp-password">' + this.escapeHtml(asenhaSbT('password')) + '</label></th>';
			html += '          <td><input type="password" id="asenha-location-sftp-password" class="regular-text" autocomplete="new-password" />';
			html += '          <p class="description" id="asenha-location-sftp-password-hint" style="display:none;"></p></td></tr>';
			html += '          <tr><th scope="row"><label for="asenha-location-sftp-path">' + this.escapeHtml(asenhaSbT('path')) + '</label></th>';
			html += '          <td><input type="text" id="asenha-location-sftp-path" class="regular-text" placeholder="/backups" autocomplete="off" /> ';
			html += '          <button type="button" class="button" id="asenha-location-sftp-browse" disabled>' + this.escapeHtml(asenhaSbT('browseFolders')) + '</button></td></tr>';
			html += '          <tr><th scope="row">' + this.escapeHtml(asenhaSbT('status')) + '</th>';
			html += '          <td>';
			html += '            <strong id="asenha-sftp-connection-status" class="asenha-connection-status-text"></strong> ';
			html += '            <button type="button" class="button" id="asenha-sftp-test-connection">' + this.escapeHtml(asenhaSbT('testConnection')) + '</button> ';
			html += '            <span class="spinner" id="asenha-sftp-test-spinner" style="float:none; display:none;"></span>';
			html += '          </td></tr>';
			html += '        </table>';
			html += '      </div>';

			html += '      <div class="asenha-location-type-panel" data-type-panel="webdav" style="display:none;">';
			html += '        <h3 class="asenha-location-modal-subheading">' + this.escapeHtml(asenhaSbT('locationTypeWebdav')) + '</h3>';
			html += '        <table class="form-table asenha-webdav-settings">';
			html += '          <tr><th scope="row"><label for="asenha-location-webdav-base-url">' + this.escapeHtml(asenhaSbT('webdavUrl')) + '</label></th>';
			html += '          <td><input type="url" id="asenha-location-webdav-base-url" class="regular-text" placeholder="https://cloud.example.com/remote.php/dav/files/username" autocomplete="off" />';
			html += '          <p class="description">' + this.escapeHtml(asenhaSbT('webdavUrlHelp')) + '</p></td></tr>';
			html += '          <tr><th scope="row"><label for="asenha-location-webdav-username">' + this.escapeHtml(asenhaSbT('username')) + '</label></th>';
			html += '          <td><input type="text" id="asenha-location-webdav-username" class="regular-text" autocomplete="off" /></td></tr>';
			html += '          <tr><th scope="row"><label for="asenha-location-webdav-password">' + this.escapeHtml(asenhaSbT('password')) + '</label></th>';
			html += '          <td><input type="password" id="asenha-location-webdav-password" class="regular-text" autocomplete="new-password" />';
			html += '          <p class="description" id="asenha-location-webdav-password-hint" style="display:none;"></p></td></tr>';
			html += '          <tr><th scope="row"><label for="asenha-location-webdav-path">' + this.escapeHtml(asenhaSbT('path')) + '</label></th>';
			html += '          <td><input type="text" id="asenha-location-webdav-path" class="regular-text" placeholder="/backups" autocomplete="off" />';
			html += '          <p class="description">' + this.escapeHtml(asenhaSbT('webdavPathHelp')) + '</p></td></tr>';
			html += '          <tr><th scope="row">' + this.escapeHtml(asenhaSbT('status')) + '</th>';
			html += '          <td>';
			html += '            <strong id="asenha-webdav-connection-status" class="asenha-connection-status-text"></strong> ';
			html += '            <button type="button" class="button" id="asenha-webdav-test-connection">' + this.escapeHtml(asenhaSbT('testConnection')) + '</button> ';
			html += '            <span class="spinner" id="asenha-webdav-test-spinner" style="float:none; display:none;"></span>';
			html += '          </td></tr>';
			html += '        </table>';
			html += '      </div>';

			html += '      <div class="asenha-location-type-panel" data-type-panel="wp_site" style="display:none;">';
			html += '        <h3 class="asenha-location-modal-subheading">' + this.escapeHtml(asenhaSbT('locationTypeWpSite')) + '</h3>';
			html += '        <table class="form-table asenha-wp-site-settings">';
			html += '          <tr><th scope="row"><label for="asenha-location-wp-site-url">' + this.escapeHtml(asenhaSbT('storageSiteUrl')) + '</label></th>';
			html += '          <td><input type="url" id="asenha-location-wp-site-url" class="regular-text" placeholder="https://storage.example.com" autocomplete="off" /></td></tr>';
			html += '          <tr><th scope="row"><label for="asenha-location-wp-site-secret">' + this.escapeHtml(asenhaSbT('originSecretKey')) + '</label></th>';
			html += '          <td><input type="password" id="asenha-location-wp-site-secret" class="regular-text" autocomplete="new-password" />';
			html += '          <p class="description" id="asenha-location-wp-site-secret-hint" style="display:none;"></p>';
			html += '          <p class="description">' + this.escapeHtml(asenhaSbT('originSecretKeyHelp')) + '</p>';
			html += '          </td></tr>';
			html += '          <tr><th scope="row">' + this.escapeHtml(asenhaSbT('status')) + '</th>';
			html += '          <td>';
			html += '            <strong id="asenha-wp-site-connection-status" class="asenha-connection-status-text"></strong> ';
			html += '            <button type="button" class="button" id="asenha-wp-site-test-connection">' + this.escapeHtml(asenhaSbT('testConnection')) + '</button> ';
			html += '            <span class="spinner" id="asenha-wp-site-test-spinner" style="float:none; display:none;"></span>';
			html += '          </td></tr>';
			html += '        </table>';
			html += '      </div>';

			html += '      <div class="asenha-location-type-panel" data-type-panel="s3" style="display:none;">';
			html += '        <h3 class="asenha-location-modal-subheading">';
			html += '          ' + this.escapeHtml(asenhaSbT('locationTypeS3'));
			html += '          <span class="asenha-location-modal-subheading-link"> | ';
			html += '            <a href="http://console.aws.amazon.com/iam/home?#/users" target="_blank" rel="noopener noreferrer">';
			html += '              ' + this.escapeHtml(asenhaSbT('s3IamUsersLinkText'));
			html += '            </a>';
			html += '          </span>';
			html += '        </h3>';
			html += '        <table class="form-table asenha-s3-settings">';
			html += '          <tr><th scope="row"><label for="asenha-location-s3-bucket">' + this.escapeHtml(asenhaSbT('s3Bucket')) + '</label></th>';
			html += '          <td><input type="text" id="asenha-location-s3-bucket" class="regular-text" autocomplete="off" /></td></tr>';
			html += '          <tr><th scope="row"><label for="asenha-location-s3-region">' + this.escapeHtml(asenhaSbT('s3Region')) + '</label></th>';
			html += '          <td><input type="text" id="asenha-location-s3-region" class="regular-text" placeholder="us-east-1" autocomplete="off" /></td></tr>';
			html += '          <tr><th scope="row"><label for="asenha-location-s3-prefix">' + this.escapeHtml(asenhaSbT('s3Prefix')) + '</label></th>';
			html += '          <td><input type="text" id="asenha-location-s3-prefix" class="regular-text" placeholder="backups" autocomplete="off" />';
			html += '          <p class="description">' + this.escapeHtml(asenhaSbT('s3PrefixHelp')) + '</p></td></tr>';
			html += '          <tr><th scope="row"><label for="asenha-location-s3-access-key-id">' + this.escapeHtml(asenhaSbT('s3AccessKeyId')) + '</label></th>';
			html += '          <td><input type="text" id="asenha-location-s3-access-key-id" class="regular-text" autocomplete="off" /></td></tr>';
			html += '          <tr><th scope="row"><label for="asenha-location-s3-secret-access-key">' + this.escapeHtml(asenhaSbT('s3SecretAccessKey')) + '</label></th>';
			html += '          <td><input type="password" id="asenha-location-s3-secret-access-key" class="regular-text" autocomplete="new-password" />';
			html += '          <p class="description" id="asenha-location-s3-secret-access-key-hint" style="display:none;"></p></td></tr>';
			html += '          <tr><th scope="row"><label for="asenha-location-s3-policy-json">' + this.escapeHtml(asenhaSbT('s3PolicyJsonLabel')) + '</label></th>';
			html += '          <td>';
			html += '            <textarea id="asenha-location-s3-policy-json" class="large-text code" rows="10" readonly="readonly"></textarea>';
			html += '            <button type="button" class="button asenha-copy-text" data-copy-source="#asenha-location-s3-policy-json" style="margin-left:6px;">' + this.escapeHtml(asenhaSbT('copy')) + '</button>';
			html += '            <p class="description" style="margin-top:6px;">' + this.escapeHtml(asenhaSbT('s3PolicyInlinePolicyHelp')) + '</p>';
			html += '          </td></tr>';
			html += '          <tr><th scope="row">' + this.escapeHtml(asenhaSbT('status')) + '</th>';
			html += '          <td>';
			html += '            <strong id="asenha-s3-connection-status" class="asenha-connection-status-text"></strong> ';
			html += '            <button type="button" class="button" id="asenha-s3-test-connection">' + this.escapeHtml(asenhaSbT('s3TestConnection')) + '</button> ';
			html += '            <span class="spinner" id="asenha-s3-test-spinner" style="float:none; display:none;"></span>';
			html += '          </td></tr>';
			html += '        </table>';
			html += '      </div>';

			html += '      <div class="asenha-location-type-panel" data-type-panel="s3_compatible" style="display:none;">';
			html += '        <h3 class="asenha-location-modal-subheading">' + this.escapeHtml(asenhaSbT('locationTypeS3Compatible')) + '</h3>';
			html += '        <table class="form-table asenha-s3-compatible-settings">';
			html += '          <tr><th scope="row"><label for="asenha-location-s3-compatible-endpoint-url">' + this.escapeHtml(asenhaSbT('s3CompatibleEndpointUrl')) + '</label></th>';
			html += '          <td><input type="url" id="asenha-location-s3-compatible-endpoint-url" class="regular-text" placeholder="https://storage.example.com" autocomplete="off" />';
			html += '          <p class="description">' + this.escapeHtml(asenhaSbT('s3CompatibleEndpointUrlHelp')) + '</p></td></tr>';
			html += '          <tr><th scope="row"><label for="asenha-location-s3-compatible-bucket">' + this.escapeHtml(asenhaSbT('s3Bucket')) + '</label></th>';
			html += '          <td><input type="text" id="asenha-location-s3-compatible-bucket" class="regular-text" autocomplete="off" /></td></tr>';
			html += '          <tr><th scope="row"><label for="asenha-location-s3-compatible-region">' + this.escapeHtml(asenhaSbT('s3Region')) + '</label></th>';
			html += '          <td><input type="text" id="asenha-location-s3-compatible-region" class="regular-text" placeholder="auto" autocomplete="off" /></td></tr>';
			html += '          <tr><th scope="row"><label for="asenha-location-s3-compatible-prefix">' + this.escapeHtml(asenhaSbT('s3Prefix')) + '</label></th>';
			html += '          <td><input type="text" id="asenha-location-s3-compatible-prefix" class="regular-text" placeholder="backups" autocomplete="off" />';
			html += '          <p class="description">' + this.escapeHtml(asenhaSbT('s3PrefixHelp')) + '</p></td></tr>';
			html += '          <tr><th scope="row"><label for="asenha-location-s3-compatible-access-key-id">' + this.escapeHtml(asenhaSbT('s3AccessKeyId')) + '</label></th>';
			html += '          <td><input type="text" id="asenha-location-s3-compatible-access-key-id" class="regular-text" autocomplete="off" /></td></tr>';
			html += '          <tr><th scope="row"><label for="asenha-location-s3-compatible-secret-access-key">' + this.escapeHtml(asenhaSbT('s3SecretAccessKey')) + '</label></th>';
			html += '          <td><input type="password" id="asenha-location-s3-compatible-secret-access-key" class="regular-text" autocomplete="new-password" />';
			html += '          <p class="description" id="asenha-location-s3-compatible-secret-access-key-hint" style="display:none;"></p></td></tr>';
			html += '          <tr><th scope="row">' + this.escapeHtml(asenhaSbT('s3CompatiblePathStyle')) + '</th>';
			html += '          <td><label for="asenha-location-s3-compatible-force-path-style">';
			html += '            <input type="checkbox" id="asenha-location-s3-compatible-force-path-style" value="1" /> ' + this.escapeHtml(asenhaSbT('s3CompatiblePathStyle'));
			html += '          </label><p class="description">' + this.escapeHtml(asenhaSbT('s3CompatiblePathStyleHelp')) + '</p></td></tr>';
			html += '          <tr><th scope="row">' + this.escapeHtml(asenhaSbT('status')) + '</th>';
			html += '          <td>';
			html += '            <strong id="asenha-s3-compatible-connection-status" class="asenha-connection-status-text"></strong> ';
			html += '            <button type="button" class="button" id="asenha-s3-compatible-test-connection">' + this.escapeHtml(asenhaSbT('testConnection')) + '</button> ';
			html += '            <span class="spinner" id="asenha-s3-compatible-test-spinner" style="float:none; display:none;"></span>';
			html += '          </td></tr>';
			html += '        </table>';
			html += '      </div>';

			html += '      <div class="asenha-location-type-panel" data-type-panel="google_drive" style="display:none;">';
			html += '        <h3 class="asenha-location-modal-subheading">';
			html += '          ' + this.escapeHtml(asenhaSbT('locationTypeGoogleDrive'));
			html += '          <span class="asenha-location-modal-subheading-link"> | ';
			html += '            <a href="https://www.google.com/search?q=google+oauth+client+id+secret+key" target="_blank" rel="noopener noreferrer">';
			html += '              ' + this.escapeHtml(asenhaSbT('gdriveGettingCredentialsLink'));
			html += '            </a>';
			html += '          </span>';
			html += '        </h3>';
			html += '        <table class="form-table asenha-gdrive-settings">';
			html += '          <tr><th scope="row"><label for="asenha-location-gdrive-js-origin">' + this.escapeHtml(asenhaSbT('gdriveJavascriptOriginLabel')) + '</label></th>';
			html += '          <td><input type="text" id="asenha-location-gdrive-js-origin" class="regular-text" readonly="readonly" />';
			html += '          <button type="button" class="button asenha-copy-text" data-copy-source="#asenha-location-gdrive-js-origin" style="margin-left:6px;">' + this.escapeHtml(asenhaSbT('copy')) + '</button>';
			html += '          <p class="description">' + this.escapeHtml(asenhaSbT('gdriveJavascriptOriginHelp')) + '</p></td></tr>';
			html += '          <tr><th scope="row"><label for="asenha-location-gdrive-redirect-uri">' + this.escapeHtml(asenhaSbT('gdriveRedirectUriLabel')) + '</label></th>';
			html += '          <td><input type="text" id="asenha-location-gdrive-redirect-uri" class="regular-text" readonly="readonly" />';
			html += '          <button type="button" class="button asenha-copy-text" data-copy-source="#asenha-location-gdrive-redirect-uri" style="margin-left:6px;">' + this.escapeHtml(asenhaSbT('copy')) + '</button>';
			html += '          <p class="description">' + this.escapeHtml(asenhaSbT('gdriveRedirectUriHelp')) + '</p></td></tr>';
			html += '          <tr><th scope="row"><label for="asenha-location-gdrive-client-id">' + this.escapeHtml(asenhaSbT('gdriveClientId')) + '</label></th>';
			html += '          <td><input type="text" id="asenha-location-gdrive-client-id" class="regular-text" autocomplete="off" /></td></tr>';
			html += '          <tr><th scope="row"><label for="asenha-location-gdrive-client-secret">' + this.escapeHtml(asenhaSbT('gdriveClientSecret')) + '</label></th>';
			html += '          <td><input type="password" id="asenha-location-gdrive-client-secret" class="regular-text" autocomplete="new-password" />';
			html += '          <p class="description" id="asenha-location-gdrive-client-secret-hint" style="display:none;"></p></td></tr>';
			html += '          <tr><th scope="row">' + this.escapeHtml(asenhaSbT('status')) + '</th>';
			html += '          <td>';
			html += '            <div id="asenha-gdrive-connection-status" class="description"></div>';
			html += '            <div id="asenha-gdrive-folder-status" class="description" style="margin-top:6px;"></div>';
			html += '            <p class="description" style="margin-top:10px;">';
			html += '              <button type="button" class="button" id="asenha-gdrive-connect"></button> ';
			html += '              <button type="button" class="button" id="asenha-gdrive-disconnect"></button> ';
			html += '              <button type="button" class="button" id="asenha-gdrive-reset-folder"></button>';
			html += '            </p>';
			html += '          </td></tr>';
			html += '        </table>';
			html += '      </div>';

			html += '      <div class="asenha-location-type-panel" data-type-panel="dropbox" style="display:none;">';
			html += '        <h3 class="asenha-location-modal-subheading">';
			html += '          ' + this.escapeHtml(asenhaSbT('locationTypeDropbox'));
			html += '          <span class="asenha-location-modal-subheading-link"> | ';
			html += '            <a href="https://www.dropbox.com/developers/apps" target="_blank" rel="noopener noreferrer">';
			html += '              ' + this.escapeHtml(asenhaSbT('dropboxGettingCredentialsLink'));
			html += '            </a>';
			html += '          </span>';
			html += '        </h3>';
			html += '        <table class="form-table asenha-dropbox-settings">';
			html += '          <tr><th scope="row"><label for="asenha-location-dropbox-redirect-uri">' + this.escapeHtml(asenhaSbT('dropboxRedirectUriLabel')) + '</label></th>';
			html += '          <td><input type="text" id="asenha-location-dropbox-redirect-uri" class="regular-text" readonly="readonly" />';
			html += '          <button type="button" class="button asenha-copy-text" data-copy-source="#asenha-location-dropbox-redirect-uri" style="margin-left:6px;">' + this.escapeHtml(asenhaSbT('copy')) + '</button>';
			html += '          <p class="description">' + this.escapeHtml(asenhaSbT('dropboxRedirectUriHelp')) + '</p></td></tr>';
			html += '          <tr><th scope="row"><label for="asenha-location-dropbox-app-key">' + this.escapeHtml(asenhaSbT('dropboxAppKey')) + '</label></th>';
			html += '          <td><input type="text" id="asenha-location-dropbox-app-key" class="regular-text" autocomplete="off" /></td></tr>';
			html += '          <tr><th scope="row"><label for="asenha-location-dropbox-app-secret">' + this.escapeHtml(asenhaSbT('dropboxAppSecret')) + '</label></th>';
			html += '          <td><input type="password" id="asenha-location-dropbox-app-secret" class="regular-text" autocomplete="new-password" />';
			html += '          <p class="description" id="asenha-location-dropbox-app-secret-hint" style="display:none;"></p></td></tr>';
			html += '          <tr><th scope="row">' + this.escapeHtml(asenhaSbT('status')) + '</th>';
			html += '          <td>';
			html += '            <div id="asenha-dropbox-connection-status" class="description"></div>';
			html += '            <div id="asenha-dropbox-folder-status" class="description" style="margin-top:6px;"></div>';
			html += '            <p class="description" style="margin-top:10px;">';
			html += '              <button type="button" class="button" id="asenha-dropbox-connect"></button> ';
			html += '              <button type="button" class="button" id="asenha-dropbox-disconnect"></button> ';
			html += '              <button type="button" class="button" id="asenha-dropbox-reset-folder"></button>';
			html += '            </p>';
			html += '          </td></tr>';
			html += '        </table>';
			html += '      </div>';

			html += '    </div>';
			html += '    <div class="asenha-modal-footer">';
			html += '      <span id="asenha-location-save-notice" class="asenha-location-save-notice" aria-live="polite"></span>';
			html += '      <span class="spinner" id="asenha-location-save-spinner" style="float:none; display:none;"></span>';
			html += '      <button type="button" class="button button-primary" id="asenha-location-save">' + this.escapeHtml(asenhaSbT('save')) + '</button> ';
			html += '      <button type="button" class="button asenha-modal-cancel">' + this.escapeHtml(asenhaSbT('close')) + '</button>';
			html += '    </div>';
			html += '  </div>';
			html += '</div>';

			$('body').append(html);

			var self = this;
			$(document).on('click', '#asenha-location-modal .asenha-modal-close, #asenha-location-modal .asenha-modal-cancel', function(ev) {
				ev.preventDefault();
				self.resetBackupLocationModalPostSaveUi();
				$('#asenha-location-modal').hide();
				self.refreshLocationsUi();
			});
			$(document).on('change', '#asenha-location-type', function() {
				self.updateBackupLocationTypePanels();
				self.updateBackupLocationModalSaveButtonState();
			});
			$(document).on('input change', '#asenha-location-modal input:not([readonly]), #asenha-location-modal select', function() {
				self.updateBackupLocationModalSaveButtonState();
			});
			$(document).on('click', '#asenha-location-save', function(ev) {
				ev.preventDefault();
				self.saveBackupLocationFromModal();
			});
			$(document).on('click', '#asenha-location-sftp-browse', function(ev) {
				ev.preventDefault();
				self.openSftpPathPickerFromLocationModal();
			});

			// Google Drive actions.
			$(document).on('click', '#asenha-gdrive-connect', function(ev) {
				ev.preventDefault();
				self.gdriveStartAction('connect');
			});
			$(document).on('click', '#asenha-gdrive-disconnect', function(ev) {
				ev.preventDefault();
				self.gdriveStartAction('disconnect');
			});
			$(document).on('click', '#asenha-gdrive-reset-folder', function(ev) {
				ev.preventDefault();
				self.gdriveStartAction('reset_folder');
			});

			// Dropbox actions.
			$(document).on('click', '#asenha-dropbox-connect', function(ev) {
				ev.preventDefault();
				self.dropboxStartAction('connect');
			});
			$(document).on('click', '#asenha-dropbox-disconnect', function(ev) {
				ev.preventDefault();
				self.dropboxStartAction('disconnect');
			});
			$(document).on('click', '#asenha-dropbox-reset-folder', function(ev) {
				ev.preventDefault();
				self.dropboxStartAction('reset_folder');
			});

			// Amazon S3 test action.
			$(document).on('click', '#asenha-s3-test-connection', function(ev) {
				ev.preventDefault();
				self.s3TestConnection();
			});

			// S3-compatible storage test action.
			$(document).on('click', '#asenha-s3-compatible-test-connection', function(ev) {
				ev.preventDefault();
				self.s3CompatibleTestConnection();
			});

			// SFTP test action.
			$(document).on('click', '#asenha-sftp-test-connection', function(ev) {
				ev.preventDefault();
				self.sftpTestConnection();
			});

			// WebDAV test action.
			$(document).on('click', '#asenha-webdav-test-connection', function(ev) {
				ev.preventDefault();
				self.webdavTestConnection();
			});

			// WP-site test action.
			$(document).on('click', '#asenha-wp-site-test-connection', function(ev) {
				ev.preventDefault();
				self.wpSiteTestConnection();
			});

			// Amazon S3 policy JSON live refresh.
			$(document).on('input', '#asenha-location-s3-bucket, #asenha-location-s3-prefix', function() {
				self.refreshS3PolicyJson();
			});
		},

		getBackupLocationModalFormSnapshot: function() {
			var self = this;
			var type = String($('#asenha-location-type').val() || 'wp_site');
			var snapshot = {
				type: type,
				title: String($('#asenha-location-title').val() || '')
			};

			if (type === 'sftp') {
				var modalBasePath = String($('#asenha-location-modal').data('sftpBasePath') || '');
				var username = String($('#asenha-location-sftp-username').val() || '');
				var basePath = self.getSftpBasePath(username, modalBasePath);
				snapshot.host = String($('#asenha-location-sftp-host').val() || '');
				snapshot.port = String($('#asenha-location-sftp-port').val() || '22');
				snapshot.username = username;
				snapshot.password = String($('#asenha-location-sftp-password').val() || '');
				snapshot.path = self.sftpPathToFull(String($('#asenha-location-sftp-path').val() || ''), basePath);
			}
			if (type === 'webdav') {
				snapshot.base_url = String($('#asenha-location-webdav-base-url').val() || '');
				snapshot.username = String($('#asenha-location-webdav-username').val() || '');
				snapshot.password = String($('#asenha-location-webdav-password').val() || '');
				snapshot.path = String($('#asenha-location-webdav-path').val() || '/');
			}
			if (type === 'wp_site') {
				snapshot.storage_site_url = String($('#asenha-location-wp-site-url').val() || '');
				snapshot.secret_key = String($('#asenha-location-wp-site-secret').val() || '');
			}
			if (type === 's3') {
				snapshot.bucket = String($('#asenha-location-s3-bucket').val() || '');
				snapshot.region = String($('#asenha-location-s3-region').val() || '');
				snapshot.prefix = String($('#asenha-location-s3-prefix').val() || '');
				snapshot.access_key_id = String($('#asenha-location-s3-access-key-id').val() || '');
				snapshot.secret_access_key = String($('#asenha-location-s3-secret-access-key').val() || '');
			}
			if (type === 's3_compatible') {
				snapshot.endpoint_url = String($('#asenha-location-s3-compatible-endpoint-url').val() || '');
				snapshot.bucket = String($('#asenha-location-s3-compatible-bucket').val() || '');
				snapshot.region = String($('#asenha-location-s3-compatible-region').val() || '');
				snapshot.prefix = String($('#asenha-location-s3-compatible-prefix').val() || '');
				snapshot.access_key_id = String($('#asenha-location-s3-compatible-access-key-id').val() || '');
				snapshot.secret_access_key = String($('#asenha-location-s3-compatible-secret-access-key').val() || '');
				snapshot.force_path_style = $('#asenha-location-s3-compatible-force-path-style').is(':checked') ? '1' : '';
			}
			if (type === 'google_drive') {
				snapshot.client_id = String($('#asenha-location-gdrive-client-id').val() || '');
				snapshot.client_secret = String($('#asenha-location-gdrive-client-secret').val() || '');
			}
			if (type === 'dropbox') {
				snapshot.app_key = String($('#asenha-location-dropbox-app-key').val() || '');
				snapshot.app_secret = String($('#asenha-location-dropbox-app-secret').val() || '');
			}

			return snapshot;
		},

		captureBackupLocationModalSavedState: function() {
			var $modal = $('#asenha-location-modal');
			if (!$modal.length) {
				return;
			}
			$modal.data('savedFormSnapshot', this.getBackupLocationModalFormSnapshot());
		},

		isBackupLocationModalDirty: function() {
			var $modal = $('#asenha-location-modal');
			var saved = $modal.data('savedFormSnapshot');
			if (!saved) {
				return true;
			}
			return JSON.stringify(this.getBackupLocationModalFormSnapshot()) !== JSON.stringify(saved);
		},

		updateBackupLocationModalSaveButtonState: function() {
			var $save = $('#asenha-location-save');
			if (!$save.length) {
				return;
			}
			var saved = $('#asenha-location-modal').data('savedFormSnapshot');
			if (!saved) {
				$save.prop('disabled', false);
				return;
			}
			$save.prop('disabled', !this.isBackupLocationModalDirty());
		},

		isBackupLocationConfigConnected: function(type, cfg) {
			cfg = cfg || {};
			type = String(type || '');
			if (type === 'google_drive' || type === 'dropbox') {
				return !!cfg.refresh_token_is_set;
			}
			return String(cfg.connection_state || '') === 'connected';
		},

		showBackupLocationSaveNotice: function() {
			var $notice = $('#asenha-location-save-notice');
			if ($notice.length) {
				$notice.text(asenhaSbT('locationSavedTestNotice')).addClass('is-visible');
			}
		},

		hideBackupLocationSaveNotice: function() {
			var $notice = $('#asenha-location-save-notice');
			if ($notice.length) {
				$notice.removeClass('is-visible').text('');
			}
		},

		syncBackupLocationSaveNotice: function(type, cfg) {
			var locationId = String($('#asenha-location-id').val() || '');
			if (!locationId) {
				this.hideBackupLocationSaveNotice();
				return;
			}
			if (this.isBackupLocationConfigConnected(type, cfg)) {
				this.hideBackupLocationSaveNotice();
				return;
			}
			this.showBackupLocationSaveNotice();
		},

		resetBackupLocationModalSaveState: function() {
			var $modal = $('#asenha-location-modal');
			if ($modal.length) {
				$modal.removeData('savedFormSnapshot');
			}
			$('#asenha-location-save').prop('disabled', false);
		},

		initBackupLocationModalSaveStateOnOpen: function(isEdit, type, cfg) {
			if (isEdit && String($('#asenha-location-id').val() || '') &&
				this.isBackupLocationConfigConnected(type, cfg)) {
				this.captureBackupLocationModalSavedState();
				this.updateBackupLocationModalSaveButtonState();
				return;
			}
			this.resetBackupLocationModalSaveState();
		},

		resetBackupLocationModalPostSaveUi: function() {
			this.resetBackupLocationModalSaveState();
			this.hideBackupLocationSaveNotice();
		},

		applyBackupLocationModalPostSaveUi: function(loc) {
			loc = loc || {};
			var type = String(loc.type || $('#asenha-location-type').val() || '');
			var cfg = loc.config || {};
			this.captureBackupLocationModalSavedState();
			$('#asenha-location-save').prop('disabled', true);
			this.syncBackupLocationSaveNotice(type, cfg);
		},

		onBackupLocationTestSuccess: function(loc) {
			this.hideBackupLocationSaveNotice();
		},

		updateBackupLocationTypePanels: function() {
			var type = String($('#asenha-location-type').val() || 'wp_site');
			type = type.replace(/[^A-Za-z0-9_-]/g, '');
			$('.asenha-location-type-panel').hide();
			$('.asenha-location-type-panel[data-type-panel="' + type + '"]').show();
		},

		openBackupLocationModal: function(location) {
			var self = this;
			this.ensureBackupLocationModalExists();

			var isEdit = !!(location && location.id);
			$('#asenha-location-modal-title').text(isEdit ? asenhaSbT('editLocation') : asenhaSbT('addLocation'));

			var id = isEdit ? String(location.id || '') : '';
			var type = isEdit ? String(location.type || 'sftp') : 'wp_site';
			var title = isEdit ? String(location.title || '') : '';
			var cfg = isEdit ? (location.config || {}) : {};

			$('#asenha-location-id').val(id);
			$('#asenha-location-type').val(type);
			$('#asenha-location-type').prop('disabled', isEdit);
			$('#asenha-location-title').val(title);

			self.updateBackupLocationTypePanels();

			$('#asenha-location-sftp-host').val(String(cfg.host || ''));
			$('#asenha-location-sftp-port').val(String(cfg.port || 22));
			$('#asenha-location-sftp-username').val(String(cfg.username || ''));

			var basePath = self.getSftpBasePath(String(cfg.username || ''), String(cfg.base_path || ''));
			$('#asenha-location-sftp-path').val(self.sftpPathToDisplay(String(cfg.path || ''), basePath));
			$('#asenha-location-sftp-password').val('');

			var $hint = $('#asenha-location-sftp-password-hint');
			if ($hint.length) {
				if (cfg.password_is_set) {
					$hint.text(asenhaSbT('sftpPasswordHintSet')).show();
				} else {
					$hint.hide().text('');
				}
			}

			// Store the base path for browsing (server-determined).
			$('#asenha-location-modal').data('sftpBasePath', basePath);
			self.updateSftpStatusUi(cfg);

			// WebDAV settings.
			$('#asenha-location-webdav-base-url').val(String(cfg.base_url || ''));
			$('#asenha-location-webdav-username').val(String(cfg.username || ''));
			$('#asenha-location-webdav-password').val('');
			$('#asenha-location-webdav-path').val(String(cfg.path || '/'));
			var $webdavHint = $('#asenha-location-webdav-password-hint');
			if ($webdavHint.length) {
				if (cfg.password_is_set) {
					$webdavHint.text(asenhaSbT('webdavPasswordHintSet')).show();
				} else {
					$webdavHint.hide().text('');
				}
			}
			self.updateWebdavStatusUi(cfg);

			// WP-site settings.
			$('#asenha-location-wp-site-url').val(String(cfg.storage_site_url || ''));
			$('#asenha-location-wp-site-secret').val('');
			var $wpHint = $('#asenha-location-wp-site-secret-hint');
			if ($wpHint.length) {
				if (cfg.secret_is_set) {
					$wpHint.text(asenhaSbT('originSecretHintSet')).show();
				} else {
					$wpHint.hide().text('');
				}
			}
			self.updateWpSiteStatusUi(cfg);

			// Amazon S3 settings.
			$('#asenha-location-s3-bucket').val(String(cfg.bucket || ''));
			$('#asenha-location-s3-region').val(String(cfg.region || 'us-east-1'));
			$('#asenha-location-s3-prefix').val(String(cfg.prefix || ''));
			$('#asenha-location-s3-access-key-id').val(String(cfg.access_key_id || ''));
			$('#asenha-location-s3-secret-access-key').val('');
			var $s3Hint = $('#asenha-location-s3-secret-access-key-hint');
			if ($s3Hint.length) {
				if (cfg.secret_access_key_is_set) {
					$s3Hint.text(asenhaSbT('s3SecretHintSet')).show();
				} else {
					$s3Hint.hide().text('');
				}
			}
			self.refreshS3PolicyJson();
			self.updateS3StatusUi(cfg);

			// S3-compatible storage settings.
			$('#asenha-location-s3-compatible-endpoint-url').val(String(cfg.endpoint_url || ''));
			$('#asenha-location-s3-compatible-bucket').val(String(cfg.bucket || ''));
			$('#asenha-location-s3-compatible-region').val(String(cfg.region || 'auto'));
			$('#asenha-location-s3-compatible-prefix').val(String(cfg.prefix || ''));
			$('#asenha-location-s3-compatible-access-key-id').val(String(cfg.access_key_id || ''));
			$('#asenha-location-s3-compatible-secret-access-key').val('');
			$('#asenha-location-s3-compatible-force-path-style').prop('checked', !!cfg.force_path_style);
			var $s3CompatibleHint = $('#asenha-location-s3-compatible-secret-access-key-hint');
			if ($s3CompatibleHint.length) {
				if (cfg.secret_access_key_is_set) {
					$s3CompatibleHint.text(asenhaSbT('s3CompatibleSecretHintSet')).show();
				} else {
					$s3CompatibleHint.hide().text('');
				}
			}
			self.updateS3CompatibleStatusUi(cfg);

			// Google Drive settings.
			$('#asenha-location-gdrive-client-id').val(String(cfg.client_id || ''));
			$('#asenha-location-gdrive-client-secret').val('');
			$('#asenha-location-gdrive-js-origin').val(String((asenhaSiteBackup && asenhaSiteBackup.gdriveJavascriptOrigin) ? asenhaSiteBackup.gdriveJavascriptOrigin : ''));
			$('#asenha-location-gdrive-redirect-uri').val(String((asenhaSiteBackup && asenhaSiteBackup.gdriveRedirectUri) ? asenhaSiteBackup.gdriveRedirectUri : ''));

			var $gHint = $('#asenha-location-gdrive-client-secret-hint');
			if ($gHint.length) {
				if (cfg.client_secret_is_set) {
					$gHint.text(asenhaSbT('gdriveClientSecretHintSet')).show();
				} else {
					$gHint.hide().text('');
				}
			}

			self.updateGdriveStatusUi(cfg);

			// Dropbox settings.
			$('#asenha-location-dropbox-app-key').val(String(cfg.app_key || ''));
			$('#asenha-location-dropbox-app-secret').val('');
			$('#asenha-location-dropbox-redirect-uri').val(String((asenhaSiteBackup && asenhaSiteBackup.dropboxRedirectUri) ? asenhaSiteBackup.dropboxRedirectUri : ''));

			var $dHint = $('#asenha-location-dropbox-app-secret-hint');
			if ($dHint.length) {
				if (cfg.app_secret_is_set) {
					$dHint.text(asenhaSbT('dropboxAppSecretHintSet')).show();
				} else {
					$dHint.hide().text('');
				}
			}

			self.updateDropboxStatusUi(cfg);

			self.initBackupLocationModalSaveStateOnOpen(isEdit, type, cfg);
			self.syncBackupLocationSaveNotice(type, cfg);
			$('#asenha-location-modal').show();
		},

		saveBackupLocationFromModal: function() {
			var self = this;
			var id = String($('#asenha-location-id').val() || '');
			var type = String($('#asenha-location-type').val() || 'sftp');
			var title = String($('#asenha-location-title').val() || '');

			if (!title) {
				self.showNotice('error', asenhaSbT('locationTitleRequired'));
				return;
			}

			var data = {
				nonce: asenhaSiteBackup.nonce,
				type: type,
				title: title
			};

			if (type === 'sftp') {
				data.host = String($('#asenha-location-sftp-host').val() || '');
				data.port = String($('#asenha-location-sftp-port').val() || '22');
				data.username = String($('#asenha-location-sftp-username').val() || '');
				data.password = String($('#asenha-location-sftp-password').val() || '');

				var modalBasePath = String($('#asenha-location-modal').data('sftpBasePath') || '');
				var basePath = self.getSftpBasePath(data.username, modalBasePath);
				$('#asenha-location-modal').data('sftpBasePath', basePath);
				data.path = self.sftpPathToFull(String($('#asenha-location-sftp-path').val() || ''), basePath);
			}
			if (type === 'webdav') {
				data.base_url = String($('#asenha-location-webdav-base-url').val() || '');
				data.username = String($('#asenha-location-webdav-username').val() || '');
				data.password = String($('#asenha-location-webdav-password').val() || '');
				data.path = String($('#asenha-location-webdav-path').val() || '/');
			}
			if (type === 'wp_site') {
				data.storage_site_url = String($('#asenha-location-wp-site-url').val() || '');
				data.secret_key = String($('#asenha-location-wp-site-secret').val() || '');
			}
			if (type === 's3') {
				data.bucket = String($('#asenha-location-s3-bucket').val() || '');
				data.region = String($('#asenha-location-s3-region').val() || '');
				data.prefix = String($('#asenha-location-s3-prefix').val() || '');
				data.access_key_id = String($('#asenha-location-s3-access-key-id').val() || '');
				data.secret_access_key = String($('#asenha-location-s3-secret-access-key').val() || '');
			}
			if (type === 's3_compatible') {
				data.endpoint_url = String($('#asenha-location-s3-compatible-endpoint-url').val() || '');
				data.bucket = String($('#asenha-location-s3-compatible-bucket').val() || '');
				data.region = String($('#asenha-location-s3-compatible-region').val() || '');
				data.prefix = String($('#asenha-location-s3-compatible-prefix').val() || '');
				data.access_key_id = String($('#asenha-location-s3-compatible-access-key-id').val() || '');
				data.secret_access_key = String($('#asenha-location-s3-compatible-secret-access-key').val() || '');
				data.force_path_style = $('#asenha-location-s3-compatible-force-path-style').is(':checked') ? '1' : '';
			}
			if (type === 'google_drive') {
				data.client_id = String($('#asenha-location-gdrive-client-id').val() || '');
				data.client_secret = String($('#asenha-location-gdrive-client-secret').val() || '');
			}
			if (type === 'dropbox') {
				data.app_key = String($('#asenha-location-dropbox-app-key').val() || '');
				data.app_secret = String($('#asenha-location-dropbox-app-secret').val() || '');
			}

			var action = id ? 'asenha_update_backup_location' : 'asenha_create_backup_location';
			data.action = action;
			if (id) {
				data.location_id = id;
			}

			var $spinner = $('#asenha-location-save-spinner');
			if ($spinner.length) { $spinner.show(); }
			$('#asenha-location-save').prop('disabled', true);

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: data
			}).done(function(resp) {
				if ($spinner.length) { $spinner.hide(); }

				if (!resp || !resp.success) {
					$('#asenha-location-save').prop('disabled', false);
					self.showNotice('error', (resp && resp.data && resp.data.message) ? resp.data.message : asenhaSbT('failedToSaveLocation'));
					return;
				}

				var loc = (resp && resp.data && resp.data.location) ? resp.data.location : {};
				if (loc && loc.id) {
					// Keep modal open so the user can browse/select a path after first save.
					$('#asenha-location-id').val(String(loc.id || ''));
					$('#asenha-location-type').prop('disabled', true);

					var cfg = loc.config || {};
					$('#asenha-location-sftp-host').val(String(cfg.host || ''));
					$('#asenha-location-sftp-port').val(String(cfg.port || 22));
					$('#asenha-location-sftp-username').val(String(cfg.username || ''));

					var basePath = self.getSftpBasePath(String(cfg.username || ''), String(cfg.base_path || ''));
					$('#asenha-location-sftp-path').val(self.sftpPathToDisplay(String(cfg.path || ''), basePath));
					$('#asenha-location-sftp-password').val('');

					var $hint = $('#asenha-location-sftp-password-hint');
					if ($hint.length) {
						if (cfg.password_is_set) {
							$hint.text(asenhaSbT('sftpPasswordHintSet')).show();
						} else {
							$hint.hide().text('');
						}
					}

					$('#asenha-location-modal').data('sftpBasePath', basePath);
				}

				// Refresh SFTP status UI bits if this is an sftp location.
				if (loc && loc.type === 'sftp') {
					self.updateSftpStatusUi(loc.config || {});
				}

			// Refresh WebDAV UI bits if this is a webdav location.
			if (loc && loc.type === 'webdav') {
				var webdavCfg = loc.config || {};
				$('#asenha-location-webdav-base-url').val(String(webdavCfg.base_url || ''));
				$('#asenha-location-webdav-username').val(String(webdavCfg.username || ''));
				$('#asenha-location-webdav-password').val('');
				$('#asenha-location-webdav-path').val(String(webdavCfg.path || '/'));
				var $webdavHint = $('#asenha-location-webdav-password-hint');
				if ($webdavHint.length) {
					if (webdavCfg.password_is_set) {
						$webdavHint.text(asenhaSbT('webdavPasswordHintSet')).show();
					} else {
						$webdavHint.hide().text('');
					}
				}
				self.updateWebdavStatusUi(webdavCfg);
			}

				// Refresh WP-site UI bits if this is a wp_site location.
				if (loc && loc.type === 'wp_site') {
					var cfg = loc.config || {};
					$('#asenha-location-wp-site-url').val(String(cfg.storage_site_url || ''));
					$('#asenha-location-wp-site-secret').val('');
					var $wpHint = $('#asenha-location-wp-site-secret-hint');
					if ($wpHint.length) {
						if (cfg.secret_is_set) {
							$wpHint.text(asenhaSbT('originSecretHintSet')).show();
						} else {
							$wpHint.hide().text('');
						}
					}
					self.updateWpSiteStatusUi(cfg);
				}

				// Refresh Google Drive UI bits if this is a google_drive location.
				if (loc && loc.type === 'google_drive') {
					var cfg = loc.config || {};
					$('#asenha-location-gdrive-client-id').val(String(cfg.client_id || ''));
					$('#asenha-location-gdrive-client-secret').val('');
					$('#asenha-location-gdrive-js-origin').val(String((asenhaSiteBackup && asenhaSiteBackup.gdriveJavascriptOrigin) ? asenhaSiteBackup.gdriveJavascriptOrigin : ''));
					$('#asenha-location-gdrive-redirect-uri').val(String((asenhaSiteBackup && asenhaSiteBackup.gdriveRedirectUri) ? asenhaSiteBackup.gdriveRedirectUri : ''));
					var $gHint = $('#asenha-location-gdrive-client-secret-hint');
					if ($gHint.length) {
						if (cfg.client_secret_is_set) {
							$gHint.text(asenhaSbT('gdriveClientSecretHintSet')).show();
						} else {
							$gHint.hide().text('');
						}
					}
					self.updateGdriveStatusUi(cfg);
				}

				// Refresh Dropbox UI bits if this is a dropbox location.
				if (loc && loc.type === 'dropbox') {
					var cfg = loc.config || {};
					$('#asenha-location-dropbox-app-key').val(String(cfg.app_key || ''));
					$('#asenha-location-dropbox-app-secret').val('');
					$('#asenha-location-dropbox-redirect-uri').val(String((asenhaSiteBackup && asenhaSiteBackup.dropboxRedirectUri) ? asenhaSiteBackup.dropboxRedirectUri : ''));
					var $dHint = $('#asenha-location-dropbox-app-secret-hint');
					if ($dHint.length) {
						if (cfg.app_secret_is_set) {
							$dHint.text(asenhaSbT('dropboxAppSecretHintSet')).show();
						} else {
							$dHint.hide().text('');
						}
					}
					self.updateDropboxStatusUi(cfg);
				}

				// Refresh Amazon S3 UI bits if this is an s3 location.
				if (loc && loc.type === 's3') {
					var cfg = loc.config || {};
					$('#asenha-location-s3-bucket').val(String(cfg.bucket || ''));
					$('#asenha-location-s3-region').val(String(cfg.region || 'us-east-1'));
					$('#asenha-location-s3-prefix').val(String(cfg.prefix || ''));
					$('#asenha-location-s3-access-key-id').val(String(cfg.access_key_id || ''));
					$('#asenha-location-s3-secret-access-key').val('');
					var $s3Hint = $('#asenha-location-s3-secret-access-key-hint');
					if ($s3Hint.length) {
						if (cfg.secret_access_key_is_set) {
							$s3Hint.text(asenhaSbT('s3SecretHintSet')).show();
						} else {
							$s3Hint.hide().text('');
						}
					}
					self.refreshS3PolicyJson();
					self.updateS3StatusUi(cfg);
				}

				// Refresh S3-compatible storage UI bits if this is an s3_compatible location.
				if (loc && loc.type === 's3_compatible') {
					var cfg = loc.config || {};
					$('#asenha-location-s3-compatible-endpoint-url').val(String(cfg.endpoint_url || ''));
					$('#asenha-location-s3-compatible-bucket').val(String(cfg.bucket || ''));
					$('#asenha-location-s3-compatible-region').val(String(cfg.region || 'auto'));
					$('#asenha-location-s3-compatible-prefix').val(String(cfg.prefix || ''));
					$('#asenha-location-s3-compatible-access-key-id').val(String(cfg.access_key_id || ''));
					$('#asenha-location-s3-compatible-secret-access-key').val('');
					$('#asenha-location-s3-compatible-force-path-style').prop('checked', !!cfg.force_path_style);
					var $s3CompatibleHint = $('#asenha-location-s3-compatible-secret-access-key-hint');
					if ($s3CompatibleHint.length) {
						if (cfg.secret_access_key_is_set) {
							$s3CompatibleHint.text(asenhaSbT('s3CompatibleSecretHintSet')).show();
						} else {
							$s3CompatibleHint.hide().text('');
						}
					}
					self.updateS3CompatibleStatusUi(cfg);
				}

				self.showNotice('success', asenhaSbT('locationSaved'));
				self.refreshLocationsUi();
				self.applyBackupLocationModalPostSaveUi(loc);
			}).fail(function() {
				if ($spinner.length) { $spinner.hide(); }
				$('#asenha-location-save').prop('disabled', false);
				self.showNotice('error', asenhaSbT('failedToSaveLocation'));
			});
		},

		/**
		 * Test Amazon S3 location by writing/deleting a small object.
		 *
		 * @since 8.7.0
		 */
		s3TestConnection: function() {
			var self = this;
			var id = String($('#asenha-location-id').val() || '');
			var type = String($('#asenha-location-type').val() || '');
			if (!id || type !== 's3') {
				self.showNotice('error', asenhaSbT('s3TestSaveFirst'));
				return;
			}

			var $btn = $('#asenha-s3-test-connection');
			var $sp = $('#asenha-s3-test-spinner');
			if ($btn.length) {
				$btn.prop('disabled', true).text(asenhaSbT('s3TestingConnection'));
			}
			if ($sp.length) { $sp.show(); }

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_test_backup_location',
					nonce: asenhaSiteBackup.nonce,
					location_id: id
				}
			}).done(function(resp) {
				var msg = (resp && resp.data && resp.data.message) ? String(resp.data.message) : '';
				if (resp && resp.success) {
					self.showNotice('success', msg ? msg : asenhaSbT('testSucceeded'));
					var loc = (resp && resp.data && resp.data.location) ? resp.data.location : null;
					if (loc && loc.config) {
						self.updateS3StatusUi(loc.config || {});
					} else {
						self.updateS3StatusUi({connection_state: 'connected', connection_message: ''});
					}
					self.onBackupLocationTestSuccess(loc);
				} else {
					self.showNotice('error', msg ? msg : asenhaSbT('testFailed'));
					self.updateS3StatusUi({connection_state: 'not_connected', connection_message: msg});
				}
			}).fail(function() {
				self.showNotice('error', asenhaSbT('testFailed'));
				self.updateS3StatusUi({connection_state: 'not_connected', connection_message: asenhaSbT('testFailed')});
			}).always(function() {
				if ($sp.length) { $sp.hide(); }
				self.refreshLocationsUi();
			});
		},

		s3CompatibleTestConnection: function() {
			var self = this;
			var id = String($('#asenha-location-id').val() || '');
			var type = String($('#asenha-location-type').val() || '');
			if (!id || type !== 's3_compatible') {
				self.showNotice('error', asenhaSbT('s3CompatibleTestSaveFirst'));
				return;
			}

			var $btn = $('#asenha-s3-compatible-test-connection');
			var $sp = $('#asenha-s3-compatible-test-spinner');
			if ($btn.length) {
				$btn.prop('disabled', true).text(asenhaSbT('s3TestingConnection'));
			}
			if ($sp.length) { $sp.show(); }

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_test_backup_location',
					nonce: asenhaSiteBackup.nonce,
					location_id: id
				}
			}).done(function(resp) {
				var msg = (resp && resp.data && resp.data.message) ? String(resp.data.message) : '';
				if (resp && resp.success) {
					self.showNotice('success', msg ? msg : asenhaSbT('testSucceeded'));
					var loc = (resp && resp.data && resp.data.location) ? resp.data.location : null;
					if (loc && loc.config) {
						self.updateS3CompatibleStatusUi(loc.config || {});
					} else {
						self.updateS3CompatibleStatusUi({connection_state: 'connected', connection_message: ''});
					}
					self.onBackupLocationTestSuccess(loc);
				} else {
					self.showNotice('error', msg ? msg : asenhaSbT('testFailed'));
					self.updateS3CompatibleStatusUi({connection_state: 'not_connected', connection_message: msg});
				}
			}).fail(function() {
				self.showNotice('error', asenhaSbT('testFailed'));
				self.updateS3CompatibleStatusUi({connection_state: 'not_connected', connection_message: asenhaSbT('testFailed')});
			}).always(function() {
				if ($sp.length) { $sp.hide(); }
				self.refreshLocationsUi();
			});
		},

		sftpTestConnection: function() {
			var self = this;
			var id = String($('#asenha-location-id').val() || '');
			var type = String($('#asenha-location-type').val() || '');
			if (!id || type !== 'sftp') {
				self.showNotice('error', asenhaSbT('locationTestSaveFirst'));
				return;
			}

			var $btn = $('#asenha-sftp-test-connection');
			var $sp = $('#asenha-sftp-test-spinner');
			if ($btn.length) {
				$btn.prop('disabled', true).text(asenhaSbT('s3TestingConnection'));
			}
			if ($sp.length) { $sp.show(); }

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_test_backup_location',
					nonce: asenhaSiteBackup.nonce,
					location_id: id
				}
			}).done(function(resp) {
				var msg = (resp && resp.data && resp.data.message) ? String(resp.data.message) : '';
				if (resp && resp.success) {
					self.showNotice('success', msg ? msg : asenhaSbT('testSucceeded'));
					var loc = (resp && resp.data && resp.data.location) ? resp.data.location : null;
					if (loc && loc.config) {
						self.updateSftpStatusUi(loc.config || {});
					} else {
						self.updateSftpStatusUi({connection_state: 'connected', connection_message: ''});
					}
					self.onBackupLocationTestSuccess(loc);
				} else {
					self.showNotice('error', msg ? msg : asenhaSbT('testFailed'));
					self.updateSftpStatusUi({connection_state: 'not_connected', connection_message: msg});
				}
			}).fail(function() {
				self.showNotice('error', asenhaSbT('testFailed'));
				self.updateSftpStatusUi({connection_state: 'not_connected', connection_message: asenhaSbT('testFailed')});
			}).always(function() {
				if ($sp.length) { $sp.hide(); }
				self.refreshLocationsUi();
			});
		},

		webdavTestConnection: function() {
			var self = this;
			var id = String($('#asenha-location-id').val() || '');
			var type = String($('#asenha-location-type').val() || '');
			if (!id || type !== 'webdav') {
				self.showNotice('error', asenhaSbT('webdavTestSaveFirst'));
				return;
			}

			var $btn = $('#asenha-webdav-test-connection');
			var $sp = $('#asenha-webdav-test-spinner');
			if ($btn.length) {
				$btn.prop('disabled', true).text(asenhaSbT('s3TestingConnection'));
			}
			if ($sp.length) { $sp.show(); }

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_test_backup_location',
					nonce: asenhaSiteBackup.nonce,
					location_id: id
				}
			}).done(function(resp) {
				var msg = (resp && resp.data && resp.data.message) ? String(resp.data.message) : '';
				if (resp && resp.success) {
					self.showNotice('success', msg ? msg : asenhaSbT('testSucceeded'));
					var loc = (resp && resp.data && resp.data.location) ? resp.data.location : null;
					if (loc && loc.config) {
						self.updateWebdavStatusUi(loc.config || {});
					} else {
						self.updateWebdavStatusUi({connection_state: 'connected', connection_message: ''});
					}
					self.onBackupLocationTestSuccess(loc);
				} else {
					self.showNotice('error', msg ? msg : asenhaSbT('testFailed'));
					self.updateWebdavStatusUi({connection_state: 'not_connected', connection_message: msg});
				}
			}).fail(function() {
				self.showNotice('error', asenhaSbT('testFailed'));
				self.updateWebdavStatusUi({connection_state: 'not_connected', connection_message: asenhaSbT('testFailed')});
			}).always(function() {
				if ($sp.length) { $sp.hide(); }
				self.refreshLocationsUi();
			});
		},

		wpSiteTestConnection: function() {
			var self = this;
			var id = String($('#asenha-location-id').val() || '');
			var type = String($('#asenha-location-type').val() || '');
			if (!id || type !== 'wp_site') {
				self.showNotice('error', asenhaSbT('locationTestSaveFirst'));
				return;
			}

			var $btn = $('#asenha-wp-site-test-connection');
			var $sp = $('#asenha-wp-site-test-spinner');
			if ($btn.length) {
				$btn.prop('disabled', true).text(asenhaSbT('s3TestingConnection'));
			}
			if ($sp.length) { $sp.show(); }

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_test_backup_location',
					nonce: asenhaSiteBackup.nonce,
					location_id: id
				}
			}).done(function(resp) {
				var msg = (resp && resp.data && resp.data.message) ? String(resp.data.message) : '';
				if (resp && resp.success) {
					self.showNotice('success', msg ? msg : asenhaSbT('testSucceeded'));
					var loc = (resp && resp.data && resp.data.location) ? resp.data.location : null;
					if (loc && loc.config) {
						self.updateWpSiteStatusUi(loc.config || {});
					} else {
						self.updateWpSiteStatusUi({connection_state: 'connected', connection_message: ''});
					}
					self.onBackupLocationTestSuccess(loc);
				} else {
					self.showNotice('error', msg ? msg : asenhaSbT('testFailed'));
					self.updateWpSiteStatusUi({connection_state: 'not_connected', connection_message: msg});
				}
			}).fail(function() {
				self.showNotice('error', asenhaSbT('testFailed'));
				self.updateWpSiteStatusUi({connection_state: 'not_connected', connection_message: asenhaSbT('testFailed')});
			}).always(function() {
				if ($sp.length) { $sp.hide(); }
				self.refreshLocationsUi();
			});
		},

		/**
		 * Normalize S3 bucket input to a bucket name.
		 *
		 * @since 8.7.0
		 *
		 * @param {string} raw
		 * @return {string}
		 */
		normalizeS3BucketInput: function(raw) {
			var s = String(raw || '').trim().toLowerCase();
			var m = s.match(/^arn:aws:s3:::([a-z0-9][a-z0-9.-]{1,61}[a-z0-9])$/);
			if (m && m[1]) {
				return String(m[1]);
			}

			// s3://bucket
			if (s.indexOf('s3://') === 0) {
				var rest = s.substring(5);
				rest = rest.split('/')[0] || '';
				rest = String(rest).trim().toLowerCase();
				if (rest) {
					return rest;
				}
			}

			return s;
		},

		/**
		 * Normalize S3 prefix input.
		 *
		 * @since 8.7.0
		 *
		 * @param {string} raw
		 * @return {string}
		 */
		normalizeS3PrefixInput: function(raw) {
			var s = String(raw || '').trim();
			// Convert backslashes to slashes, collapse duplicates, and trim.
			s = s.replace(/\\+/g, '/');
			s = s.replace(/\0/g, '');
			s = s.replace(/\/+/g, '/');
			s = s.replace(/^\/+/, '');
			s = s.replace(/\/+$/, '');
			return s;
		},

		/**
		 * Build IAM policy JSON for S3 access.
		 *
		 * @since 8.7.0
		 *
		 * @param {string} bucket
		 * @param {string} prefix
		 * @return {string}
		 */
		buildS3PolicyJson: function(bucket, prefix) {
			bucket = this.normalizeS3BucketInput(bucket);
			prefix = this.normalizeS3PrefixInput(prefix);

			if (!bucket) {
				return '';
			}

			var objectArn = 'arn:aws:s3:::' + bucket + (prefix ? '/' + prefix : '') + '/*';
			var policy = {
				Version: '2012-10-17',
				Statement: [
					{
						Sid: 'ASESiteBackupObjectRW',
						Effect: 'Allow',
						Action: [
							's3:PutObject',
							's3:GetObject',
							's3:DeleteObject',
							's3:AbortMultipartUpload',
							's3:ListMultipartUploadParts'
						],
						Resource: objectArn
					}
				]
			};

			if (prefix) {
				policy.Statement.unshift({
					Sid: 'ASESiteBackupListPrefix',
					Effect: 'Allow',
					Action: 's3:ListBucket',
					Resource: 'arn:aws:s3:::' + bucket,
					Condition: {
						StringLike: {
							's3:prefix': [ prefix, prefix + '/*' ]
						}
					}
				});
			}

			try {
				return JSON.stringify(policy, null, 2);
			} catch (e) {
				return '';
			}
		},

		/**
		 * Refresh S3 policy JSON textarea based on current inputs.
		 *
		 * @since 8.7.0
		 */
		refreshS3PolicyJson: function() {
			var $ta = $('#asenha-location-s3-policy-json');
			if (!$ta.length) {
				return;
			}
			var bucket = String($('#asenha-location-s3-bucket').val() || '');
			var prefix = String($('#asenha-location-s3-prefix').val() || '');
			var json = this.buildS3PolicyJson(bucket, prefix);
			$ta.val(String(json || ''));
		},

		getConnectionStatusText: function(cfg) {
			cfg = cfg || {};
			var state = String(cfg.connection_state || '');
			var msg = String(cfg.connection_message || '').trim();

			if (state === 'connected') {
				return asenhaSbT('connectionStatusConnectedDot');
			}
			if (state === 'not_tested') {
				return asenhaSbT('connectionStatusNotTestedDot');
			}
			if (state === 'not_connected') {
				if (msg) {
					var tpl = asenhaSbT('connectionStatusNotConnectedWithReason');
					tpl = tpl.replace(/%(\d+\$)?s/, msg);
					return tpl;
				}
				return asenhaSbT('connectionStatusNotConnectedDot');
			}
			return '';
		},

		updateS3StatusUi: function(cfg) {
			cfg = cfg || {};
			var id = String($('#asenha-location-id').val() || '');

			var $status = $('#asenha-s3-connection-status');
			var $btn = $('#asenha-s3-test-connection');
			if (!$status.length || !$btn.length) {
				return;
			}

			var label = this.getConnectionStatusText(cfg);
			$status.text(label || '');

			if (!id) {
				$btn.prop('disabled', true).text(asenhaSbT('s3TestConnection'));
				return;
			}

			var state = String(cfg.connection_state || '');
			var disabled = (state === 'connected');
			$btn.prop('disabled', disabled).text(asenhaSbT('s3TestConnection'));
		},

		updateS3CompatibleStatusUi: function(cfg) {
			cfg = cfg || {};
			var id = String($('#asenha-location-id').val() || '');

			var $status = $('#asenha-s3-compatible-connection-status');
			var $btn = $('#asenha-s3-compatible-test-connection');
			if (!$status.length || !$btn.length) {
				return;
			}

			var label = this.getConnectionStatusText(cfg);
			$status.text(label || '');

			if (!id) {
				$btn.prop('disabled', true).text(asenhaSbT('testConnection'));
				return;
			}

			var state = String(cfg.connection_state || '');
			var disabled = (state === 'connected');
			$btn.prop('disabled', disabled).text(asenhaSbT('testConnection'));
		},

		updateSftpStatusUi: function(cfg) {
			cfg = cfg || {};
			var id = String($('#asenha-location-id').val() || '');

			var $status = $('#asenha-sftp-connection-status');
			var $btn = $('#asenha-sftp-test-connection');
			var $browse = $('#asenha-location-sftp-browse');
			if (!$status.length || !$btn.length) {
				return;
			}

			var label = this.getConnectionStatusText(cfg);
			$status.text(label || '');

			if (!id) {
				$btn.prop('disabled', true).text(asenhaSbT('testConnection'));
				if ($browse.length) {
					$browse.prop('disabled', true);
				}
				return;
			}

			var state = String(cfg.connection_state || '');
			var disabled = (state === 'connected');
			$btn.prop('disabled', disabled).text(asenhaSbT('testConnection'));

			if ($browse.length) {
				$browse.prop('disabled', state !== 'connected');
			}
		},

		updateWebdavStatusUi: function(cfg) {
			cfg = cfg || {};
			var id = String($('#asenha-location-id').val() || '');

			var $status = $('#asenha-webdav-connection-status');
			var $btn = $('#asenha-webdav-test-connection');
			if (!$status.length || !$btn.length) {
				return;
			}

			var label = this.getConnectionStatusText(cfg);
			$status.text(label || '');

			if (!id) {
				$btn.prop('disabled', true).text(asenhaSbT('testConnection'));
				return;
			}

			var state = String(cfg.connection_state || '');
			var disabled = (state === 'connected');
			$btn.prop('disabled', disabled).text(asenhaSbT('testConnection'));
		},

		updateWpSiteStatusUi: function(cfg) {
			cfg = cfg || {};
			var id = String($('#asenha-location-id').val() || '');

			var $status = $('#asenha-wp-site-connection-status');
			var $btn = $('#asenha-wp-site-test-connection');
			if (!$status.length || !$btn.length) {
				return;
			}

			var label = this.getConnectionStatusText(cfg);
			$status.text(label || '');

			if (!id) {
				$btn.prop('disabled', true).text(asenhaSbT('testConnection'));
				return;
			}

			var state = String(cfg.connection_state || '');
			var disabled = (state === 'connected');
			$btn.prop('disabled', disabled).text(asenhaSbT('testConnection'));
		},

		/**
		 * Update Google Drive connection/folder status UI in the modal.
		 *
		 * @param {Object} cfg Location config (safe).
		 */
		updateGdriveStatusUi: function(cfg) {
			cfg = cfg || {};

			var connected = !!cfg.refresh_token_is_set;
			var email = String(cfg.connected_email || '');
			var name = String(cfg.connected_name || '');
			var folderName = String(cfg.folder_name || '');
			var folderUrl = String(cfg.folder_url || '');

			var statusText = '';
			if (connected) {
				var who = (name || email || '');
				if (who) {
					statusText = this.escapeHtml(asenhaSbT('gdriveConnectedAsPrefix')) + ' <strong>' + this.escapeHtml(who) + '</strong>';
				} else {
					statusText = '<strong>' + this.escapeHtml(asenhaSbT('connectionStatusConnected')) + '</strong>';
				}
			} else {
				statusText = '<strong>' + this.escapeHtml(asenhaSbT('gdriveNotConnected')) + '</strong>';
			}
			$('#asenha-gdrive-connection-status').html(statusText);

			var folderHtml = '';
			if (connected && folderName) {
				folderHtml += this.escapeHtml(asenhaSbT('gdriveFolder')) + ': <strong>' + this.escapeHtml(folderName) + '</strong>';
				if (folderUrl) {
					folderHtml += ' <a href="' + this.escapeAttr(folderUrl) + '" target="_blank" rel="noopener noreferrer">' + this.escapeHtml(asenhaSbT('gdriveOpenFolder')) + '</a>';
				}
			} else if (connected) {
				folderHtml = this.escapeHtml(asenhaSbT('gdriveFolder')) + ': -';
			}
			$('#asenha-gdrive-folder-status').html(folderHtml);

			// Buttons.
			$('#asenha-gdrive-connect').text(asenhaSbT('gdriveConnect'));
			$('#asenha-gdrive-disconnect').text(asenhaSbT('gdriveDisconnect'));
			$('#asenha-gdrive-reset-folder').text(asenhaSbT('gdriveResetFolder'));

			$('#asenha-gdrive-connect').prop('disabled', connected ? true : false);
			$('#asenha-gdrive-disconnect').prop('disabled', connected ? false : true);
			$('#asenha-gdrive-reset-folder').prop('disabled', connected ? false : true);
		},

		/**
		 * Start a Google Drive admin-post action in a new navigation.
		 *
		 * @param {string} action One of: connect, disconnect, reset_folder
		 */
		gdriveStartAction: function(action) {
			action = String(action || '');
			var locationId = String($('#asenha-location-id').val() || '');
			if (!locationId) {
				this.showNotice('warning', asenhaSbT('gdriveSaveFirst'));
				return;
			}

			if (!asenhaSiteBackup || !asenhaSiteBackup.adminPostUrl) {
				this.showNotice('error', asenhaSbT('gdriveActionFailed'));
				return;
			}

			var map = {
				connect: 'asenha_site_backup_gdrive_connect',
				disconnect: 'asenha_site_backup_gdrive_disconnect',
				reset_folder: 'asenha_site_backup_gdrive_reset_folder'
			};
			var wpAction = map[action] ? map[action] : '';
			if (!wpAction) {
				this.showNotice('error', asenhaSbT('gdriveActionFailed'));
				return;
			}

			var returnUrl = window.location.href;
			var url = String(asenhaSiteBackup.adminPostUrl);
			url += (url.indexOf('?') >= 0 ? '&' : '?') + 'action=' + encodeURIComponent(wpAction);
			url += '&location_id=' + encodeURIComponent(locationId);
			url += '&nonce=' + encodeURIComponent(String(asenhaSiteBackup.nonce || ''));
			url += '&return_url=' + encodeURIComponent(returnUrl);
			window.location.href = url;
		},

		/**
		 * Update Dropbox connection/folder status UI in the modal.
		 *
		 * @param {Object} cfg Location config (safe).
		 */
		updateDropboxStatusUi: function(cfg) {
			cfg = cfg || {};

			var connected = !!cfg.refresh_token_is_set;
			var email = String(cfg.connected_email || '');
			var name = String(cfg.connected_name || '');
			var folderPath = String(cfg.folder_path || '');

			var statusText = '';
			if (connected) {
				var who = (name || email || '');
				if (who) {
					statusText = this.escapeHtml(asenhaSbT('dropboxConnectedAsPrefix')) + ' <strong>' + this.escapeHtml(who) + '</strong>';
				} else {
					statusText = '<strong>' + this.escapeHtml(asenhaSbT('connectionStatusConnected')) + '</strong>';
				}
			} else {
				statusText = '<strong>' + this.escapeHtml(asenhaSbT('dropboxNotConnected')) + '</strong>';
			}
			$('#asenha-dropbox-connection-status').html(statusText);

			var folderHtml = '';
			if (connected) {
				folderHtml = this.escapeHtml(asenhaSbT('dropboxFolder')) + ': <strong>' + this.escapeHtml(folderPath ? folderPath : '-') + '</strong>';
			}
			$('#asenha-dropbox-folder-status').html(folderHtml);

			// Buttons.
			$('#asenha-dropbox-connect').text(asenhaSbT('dropboxConnect'));
			$('#asenha-dropbox-disconnect').text(asenhaSbT('dropboxDisconnect'));
			$('#asenha-dropbox-reset-folder').text(asenhaSbT('dropboxResetFolder'));

			$('#asenha-dropbox-connect').prop('disabled', connected ? true : false);
			$('#asenha-dropbox-disconnect').prop('disabled', connected ? false : true);
			$('#asenha-dropbox-reset-folder').prop('disabled', connected ? false : true);
		},

		/**
		 * Start a Dropbox admin-post action in a new navigation.
		 *
		 * @param {string} action One of: connect, disconnect, reset_folder
		 */
		dropboxStartAction: function(action) {
			action = String(action || '');
			var locationId = String($('#asenha-location-id').val() || '');
			if (!locationId) {
				this.showNotice('warning', asenhaSbT('dropboxSaveFirst'));
				return;
			}

			if (!asenhaSiteBackup || !asenhaSiteBackup.adminPostUrl) {
				this.showNotice('error', asenhaSbT('dropboxActionFailed'));
				return;
			}

			var map = {
				connect: 'asenha_site_backup_dropbox_connect',
				disconnect: 'asenha_site_backup_dropbox_disconnect',
				reset_folder: 'asenha_site_backup_dropbox_reset_folder'
			};
			var wpAction = map[action] ? map[action] : '';
			if (!wpAction) {
				this.showNotice('error', asenhaSbT('dropboxActionFailed'));
				return;
			}

			var returnUrl = window.location.href;
			var url = String(asenhaSiteBackup.adminPostUrl);
			url += (url.indexOf('?') >= 0 ? '&' : '?') + 'action=' + encodeURIComponent(wpAction);
			url += '&location_id=' + encodeURIComponent(locationId);
			url += '&nonce=' + encodeURIComponent(String(asenhaSiteBackup.nonce || ''));
			url += '&return_url=' + encodeURIComponent(returnUrl);
			window.location.href = url;
		},

		/**
		 * Update pCloud connection/folder status UI in the modal.
		 *
		 * @param {Object} cfg Location config (safe).
		 */
		openSftpPathPickerFromLocationModal: function() {
			var self = this;
			var locationId = String($('#asenha-location-id').val() || '');
			var username = String($('#asenha-location-sftp-username').val() || '');
			var basePath = self.getSftpBasePath(username, String($('#asenha-location-modal').data('sftpBasePath') || ''));
			$('#asenha-location-modal').data('sftpBasePath', basePath);

			if (!locationId) {
				self.showNotice('warning', asenhaSbT('sftpBrowseRequiresSave'));
				return;
			}

			var $browse = $('#asenha-location-sftp-browse');
			if ($browse.length && $browse.is(':disabled')) {
				self.showNotice('warning', asenhaSbT('sftpBrowseRequiresTest'));
				return;
			}

			var startPath = basePath || (username ? ('/home/' + username) : '/home');
			self.openSftpPathPickerForLocation(locationId, startPath, function(chosen) {
				var basePath = self.getSftpBasePath(username, String($('#asenha-location-modal').data('sftpBasePath') || ''));
				$('#asenha-location-modal').data('sftpBasePath', basePath);
				$('#asenha-location-sftp-path').val(self.sftpPathToDisplay(String(chosen || ''), basePath));
			});
		},

		/**
		 * Ensure SFTP folder picker modal exists.
		 *
		 * @since 8.7.0
		 */
		ensureSftpPathPickerModalExists: function() {
			if ($('#asenha-sftp-path-modal').length) {
				return;
			}

			var html = '';
			html += '<div class="asenha-modal-overlay" id="asenha-sftp-path-modal" style="display:none;">';
			html += '  <div class="asenha-modal">';
			html += '    <div class="asenha-modal-header">';
			html += '      <h2 id="asenha-sftp-path-modal-title">' + String(asenhaSbT('sftpSelectFolderTitle')) + '</h2>';
			html += '      <button type="button" class="button-link asenha-modal-close" aria-label="' + this.escapeAttr(asenhaSbT('close')) + '">×</button>';
			html += '    </div>';
			html += '    <div class="asenha-modal-body">';
			html += '      <p class="description">' + String(asenhaSbT('sftpSelectFolderDesc')) + '</p>';
			html += '      <div id="asenha-sftp-tree"></div>';
			html += '      <p class="description">' + String(asenhaSbT('selectedLabel')) + ' <code id="asenha-sftp-selected-path">-</code></p>';
			html += '    </div>';
			html += '    <div class="asenha-modal-footer">';
			html += '      <button type="button" class="button button-primary" id="asenha-sftp-use-path" disabled>' + String(asenhaSbT('sftpUseThisPath')) + '</button> ';
			html += '      <button type="button" class="button asenha-modal-cancel">' + String(asenhaSbT('close')) + '</button>';
			html += '    </div>';
			html += '  </div>';
			html += '</div>';

			$('body').append(html);

			$(document).on('click', '#asenha-sftp-path-modal .asenha-modal-close, #asenha-sftp-path-modal .asenha-modal-cancel', function(ev) {
				ev.preventDefault();
				$('#asenha-sftp-path-modal').hide();
			});
		},

		/**
		 * Open SFTP folder picker modal.
		 *
		 * @since 8.7.0
		 */
		openSftpPathPickerForLocation: function(locationId, startPath, onSelect) {
			var self = this;
			this.ensureSftpPathPickerModalExists();

			locationId = String(locationId || '');
			if (!locationId) {
				this.showNotice('warning', asenhaSbT('sftpBrowseRequiresSave'));
				return;
			}

			this.sftpPickerContext = {
				locationId: locationId,
				onSelect: (typeof onSelect === 'function') ? onSelect : null
			};

			$('#asenha-sftp-selected-path').text('-');
			$('#asenha-sftp-use-path').prop('disabled', true);

			var $tree = $('#asenha-sftp-tree');
			$tree.html('<p class="description">' + asenhaSbT('loading') + '</p>');
			$('#asenha-sftp-path-modal').show();

			startPath = String(startPath || '/home');
			this.loadSftpChildren(startPath, 0, function(result) {
				if (!result || result.__error) {
					var msg = (result && result.__error) ? String(result.__error) : '';
					$tree.html('<p class="description">' + (msg ? $('<div/>').text(msg).html() : asenhaSbT('sftpBrowseLoadFailed')) + '</p>');
					return;
				}
				$tree.html(self.renderSftpTreeHtml(startPath, result.items || [], result.has_more, result.total, 0));
			});

			$('#asenha-sftp-use-path').off('click.asenhaSftpUsePath').on('click.asenhaSftpUsePath', function(ev) {
				ev.preventDefault();
				var chosen = String($('#asenha-sftp-path-modal').data('selectedPath') || '');
				if (!chosen) {
					return;
				}
				if (self.sftpPickerContext && typeof self.sftpPickerContext.onSelect === 'function') {
					self.sftpPickerContext.onSelect(chosen);
				}
				$('#asenha-sftp-path-modal').hide();
			});
		},

		/**
		 * Load remote SFTP children for a directory.
		 *
		 * @param {string} path
		 * @param {number} offset
		 * @param {Function} cb
		 * @since 8.7.0
		 */
		loadSftpChildren: function(path, offset, cb) {
			var locationId = (this.sftpPickerContext && this.sftpPickerContext.locationId) ? String(this.sftpPickerContext.locationId) : '';
			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_sftp_list_children',
					nonce: asenhaSiteBackup.nonce,
					location_id: locationId,
					path: path || '',
					offset: offset || 0,
					limit: 200
				}
			}).done(function(resp) {
				if (!resp || !resp.success) {
					var msg = (resp && resp.data && resp.data.message) ? String(resp.data.message) : '';
					cb({ __error: msg || asenhaSbT('failedToLoad') });
					return;
				}
				cb(resp.data);
			}).fail(function() {
				cb({ __error: asenhaSbT('failedToLoad') });
			});
		},

		/**
		 * Render SFTP tree HTML using the same UI pattern as Templates.
		 *
		 * @param {string} parentPath
		 * @param {Array} items
		 * @param {boolean} hasMore
		 * @param {number} total
		 * @param {number} offset
		 * @return {string}
		 * @since 8.7.0
		 */
		renderSftpTreeHtml: function(parentPath, items, hasMore, total, offset) {
			var esc = function(s) {
				return $('<div/>').text(String(s || '')).html();
			};
			var self = this;

			var getParentPath = function(p) {
				p = String(p || '');
				if (!p || p === '/') {
					return '/';
				}
				p = p.replace(/\/+$/, '');
				var idx = p.lastIndexOf('/');
				if (idx <= 0) {
					return '/';
				}
				return p.substring(0, idx);
			};

			var html = '<ul class="asenha-tree">';

			for (var i = 0; i < items.length; i++) {
				var it = items[i] || {};
				var rel = String(it.rel_path || '');
				var isDir = (String(it.type || '') === 'dir');
				var label = esc(it.name || rel);
				var canDelete = !!it.can_delete;

				html += '<li class="asenha-tree-item" data-rel="' + esc(rel) + '" data-type="' + (isDir ? 'dir' : 'file') + '">';
				html += '  <div class="asenha-tree-row">';
				html += isDir
					? '<button type="button" class="button-link asenha-tree-toggle" aria-label="' + esc(asenhaSbT('toggleFolderAriaLabel')) + '" aria-expanded="false"><span class="dashicons dashicons-arrow-right-alt2" aria-hidden="true"></span></button>'
					: '<span class="asenha-tree-spacer" aria-hidden="true"></span>';
				html += '    <label class="asenha-tree-label">';
				html += '      <input type="checkbox" class="asenha-tree-checkbox asenha-sftp-tree-checkbox" data-store-path="' + esc(rel) + '"' + (isDir ? '' : ' disabled') + ' /> ';
				html += label;
				html += '    </label>';
				if (isDir && canDelete) {
					html += '    <a href="#" class="asenha-sftp-delete-folder" data-path="' + esc(rel) + '">' + esc(asenhaSbT('delete')) + '</a>';
				}
				html += '  </div>';
				if (isDir) {
					html += '<div class="asenha-tree-children" style="display:none;"></div>';
				}
				html += '</li>';
			}

			if (hasMore) {
				html += '<li class="asenha-tree-more"><button type="button" class="button asenha-tree-load-more" data-parent="' + esc(parentPath) + '" data-offset="' + esc(offset + items.length) + '">' + esc(asenhaSbT('loadMore')) + '</button></li>';
			}

			// Action row for this folder level.
			html += '<li class="asenha-tree-actions">';
			html += '  <button type="button" class="button-link asenha-sftp-create-folder" data-parent="' + esc(parentPath) + '">' + esc(asenhaSbT('createFolder')) + '</button>';
			html += '</li>';

			html += '</ul>';

			// Bind events after render (scoped).
			setTimeout(function() {
				var $root = $('#asenha-sftp-tree');
				var locationId = (self.sftpPickerContext && self.sftpPickerContext.locationId) ? String(self.sftpPickerContext.locationId) : '';

				$root.off('click.asenhaSftpTreeToggle').on('click.asenhaSftpTreeToggle', '.asenha-tree-toggle', function(e) {
					e.preventDefault();
					var $btn = $(this);
					var $li = $btn.closest('.asenha-tree-item');
					var rel = String($li.data('rel') || '');
					var $children = $li.find('> .asenha-tree-children');
					if ($children.is(':visible')) {
						$children.hide();
						$btn.removeClass('is-expanded').attr('aria-expanded', 'false');
						return;
					}
					$btn.addClass('is-expanded').attr('aria-expanded', 'true');
					if ($children.data('loaded')) {
						$children.show();
						return;
					}
					$children.html('<p class="description">' + asenhaSbT('loading') + '</p>').show();
					self.loadSftpChildren(rel, 0, function(result) {
						if (!result || result.__error) {
							var msg = (result && result.__error) ? String(result.__error) : '';
							$children.html('<p class="description">' + (msg ? $('<div/>').text(msg).html() : asenhaSbT('failedToLoad')) + '</p>');
							return;
						}
						$children.data('loaded', true).html(self.renderSftpTreeHtml(rel, result.items || [], result.has_more, result.total, 0));
					});
				});

				$root.off('click.asenhaSftpTreeMore').on('click.asenhaSftpTreeMore', '.asenha-tree-load-more', function(e) {
					e.preventDefault();
					var $btn = $(this);
					var parent = String($btn.data('parent') || '');
					var nextOffset = parseInt($btn.data('offset') || 0, 10);
					$btn.prop('disabled', true).text(asenhaSbT('loading'));
					self.loadSftpChildren(parent, nextOffset, function(result) {
						if (!result || result.__error) {
							self.showNotice('error', (result && result.__error) ? String(result.__error) : asenhaSbT('failedToLoad'));
							$btn.prop('disabled', false).text(asenhaSbT('loadMore'));
							return;
						}
						var $moreLi = $btn.closest('.asenha-tree-more');
						var $ul = $moreLi.closest('ul.asenha-tree');
						$moreLi.remove();
						$ul.append($(self.renderSftpTreeHtml(parent, result.items || [], result.has_more, result.total, nextOffset)).children());
					});
				});

				$root.off('change.asenhaSftpTreeCheck').on('change.asenhaSftpTreeCheck', '.asenha-sftp-tree-checkbox', function() {
					var $cb = $(this);
					var checked = $cb.is(':checked');
					var p = String($cb.data('store-path') || '');

					// Single-selection behavior.
					if (checked) {
						$root.find('.asenha-sftp-tree-checkbox').not($cb).prop('checked', false);
						$('#asenha-sftp-path-modal').data('selectedPath', p);
						$('#asenha-sftp-selected-path').text(p || '-');
						$('#asenha-sftp-use-path').prop('disabled', !p);
					} else {
						var current = String($('#asenha-sftp-path-modal').data('selectedPath') || '');
						if (current === p) {
							$('#asenha-sftp-path-modal').data('selectedPath', '');
							$('#asenha-sftp-selected-path').text('-');
							$('#asenha-sftp-use-path').prop('disabled', true);
						}
					}
				});

				$root.off('click.asenhaSftpCreateFolder').on('click.asenhaSftpCreateFolder', '.asenha-sftp-create-folder', function(e) {
					e.preventDefault();
					var $btn = $(this);
					var parent = String($btn.data('parent') || '');

					var folderName = window.prompt(asenhaSbT('createFolderPrompt'));
					if (folderName === null) {
						return;
					}
					folderName = String(folderName || '').trim();
					if (!folderName) {
						self.showNotice('error', asenhaSbT('createFolderNameRequired'));
						return;
					}

					$btn.prop('disabled', true);
					$.ajax({
						url: asenhaSiteBackup.ajaxUrl,
						type: 'POST',
						data: {
							action: 'asenha_sftp_create_folder',
							nonce: asenhaSiteBackup.nonce,
							location_id: locationId,
							parent_path: parent,
							folder_name: folderName
						}
					}).done(function(resp) {
						$btn.prop('disabled', false);
						if (!resp || !resp.success) {
							self.showNotice('error', (resp && resp.data && resp.data.message) ? resp.data.message : asenhaSbT('createFolderFailed'));
							return;
						}

						self.showNotice('success', asenhaSbT('createFolderSuccess'));

						// Refresh this folder level.
						var $container = $btn.closest('.asenha-tree-children');
						if ($container.length) {
							$container.html('<p class="description">' + asenhaSbT('loading') + '</p>');
							self.loadSftpChildren(parent, 0, function(result) {
								if (!result || result.__error) {
									$container.html('<p class="description">' + (result && result.__error ? $('<div/>').text(String(result.__error)).html() : asenhaSbT('failedToLoad')) + '</p>');
									return;
								}
								$container.data('loaded', true).html(self.renderSftpTreeHtml(parent, result.items || [], result.has_more, result.total, 0));
							});
						} else {
							// Root level refresh.
							$('#asenha-sftp-tree').html('<p class="description">' + asenhaSbT('loading') + '</p>');
							self.loadSftpChildren(parent, 0, function(result) {
								if (!result || result.__error) {
									$('#asenha-sftp-tree').html('<p class="description">' + (result && result.__error ? $('<div/>').text(String(result.__error)).html() : asenhaSbT('failedToLoad')) + '</p>');
									return;
								}
								$('#asenha-sftp-tree').html(self.renderSftpTreeHtml(parent, result.items || [], result.has_more, result.total, 0));
							});
						}
					}).fail(function() {
						$btn.prop('disabled', false);
						self.showNotice('error', asenhaSbT('createFolderFailed'));
					});
				});

				$root.off('click.asenhaSftpDeleteFolder').on('click.asenhaSftpDeleteFolder', '.asenha-sftp-delete-folder', function(e) {
					e.preventDefault();
					var $link = $(this);
					var path = String($link.data('path') || '');
					if (!path) {
						return;
					}

					var confirmMsg = asenhaSbT('deleteFolderConfirm');
					if (!window.confirm(confirmMsg)) {
						return;
					}

					$link.addClass('is-busy');
					$.ajax({
						url: asenhaSiteBackup.ajaxUrl,
						type: 'POST',
						data: {
							action: 'asenha_sftp_delete_folder',
							nonce: asenhaSiteBackup.nonce,
							location_id: locationId,
							path: path
						}
					}).done(function(resp) {
						$link.removeClass('is-busy');
						if (!resp || !resp.success) {
							self.showNotice('error', (resp && resp.data && resp.data.message) ? resp.data.message : asenhaSbT('deleteFolderFailed'));
							return;
						}

						self.showNotice('success', asenhaSbT('deleteFolderSuccess'));

						// Clear selection if within deleted folder.
						var current = String($('#asenha-sftp-path-modal').data('selectedPath') || '');
						if (current === path || (current && path && current.indexOf(path + '/') === 0)) {
							$('#asenha-sftp-path-modal').data('selectedPath', '');
							$('#asenha-sftp-selected-path').text('-');
							$('#asenha-sftp-use-path').prop('disabled', true);
						}

						// Refresh parent level.
						var parent = getParentPath(path);
						var $container = $link.closest('.asenha-tree-children');
						if ($container.length) {
							$container.html('<p class="description">' + asenhaSbT('loading') + '</p>');
							self.loadSftpChildren(parent, 0, function(result) {
								if (!result || result.__error) {
									$container.html('<p class="description">' + (result && result.__error ? $('<div/>').text(String(result.__error)).html() : asenhaSbT('failedToLoad')) + '</p>');
									return;
								}
								$container.data('loaded', true).html(self.renderSftpTreeHtml(parent, result.items || [], result.has_more, result.total, 0));
							});
						} else {
							$('#asenha-sftp-tree').html('<p class="description">' + asenhaSbT('loading') + '</p>');
							self.loadSftpChildren(parent, 0, function(result) {
								if (!result || result.__error) {
									$('#asenha-sftp-tree').html('<p class="description">' + (result && result.__error ? $('<div/>').text(String(result.__error)).html() : asenhaSbT('failedToLoad')) + '</p>');
									return;
								}
								$('#asenha-sftp-tree').html(self.renderSftpTreeHtml(parent, result.items || [], result.has_more, result.total, 0));
							});
						}
					}).fail(function() {
						$link.removeClass('is-busy');
						self.showNotice('error', asenhaSbT('deleteFolderFailed'));
					});
				});
			}, 0);

			return html;
		},

		/**
		 * Fetch templates from server.
		 *
		 * @param {string} type Optional: full|database|files
		 * @return {jqXHR}
		 */
		fetchTemplates: function(type) {
			return $.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_get_backup_templates',
					nonce: asenhaSiteBackup.nonce,
					type: type || ''
				}
			});
		},

		/**
		 * Refresh templates list (Backup > Templates subtab).
		 */
		refreshTemplatesList: function() {
			var self = this;
			var $wrap = $('#asenha-backup-templates-list');
			if (!$wrap.length) {
				return;
			}

			$wrap.html('<p class="description">' + asenhaSbT('loading') + '</p>');

			this.fetchTemplates('').done(function(resp) {
				if (!resp || !resp.success) {
					$wrap.html('<p class="description">' + (resp && resp.data && resp.data.message ? resp.data.message : asenhaSbT('failedToLoadTemplates')) + '</p>');
					return;
				}
				self.templatesCache = resp.data && resp.data.templates ? resp.data.templates : [];
				$wrap.html(self.renderTemplatesTableHtml(self.templatesCache));
				self.refreshTemplatesIncludedCounts(self.templatesCache);
			}).fail(function() {
				$wrap.html('<p class="description">' + asenhaSbT('failedToLoadTemplates') + '</p>');
			});
		},

		/**
		 * Render templates table HTML.
		 *
		 * @param {Array} templates
		 * @return {string}
		 */
		renderTemplatesTableHtml: function(templates) {
			templates = templates || [];

			if (!templates.length) {
				return '<p class="description">' + asenhaSbT('noTemplates') + '</p>';
			}

			var esc = function(s) {
				return $('<div/>').text(String(s || '')).html();
			};
			var sb = this;

			var includedPlaceholder = function() {
				return esc(asenhaSbT('calculating'));
			};

			var typeLabel = function(t) {
				if (t === 'database') { return asenhaSbT('templateTabDatabase'); }
				if (t === 'files') { return asenhaSbT('templateTabFiles'); }
				return asenhaSbT('packageTypeFull');
			};

			var patternLabel = function(tpl) {
				tpl = tpl || {};
				var p = String(tpl.pattern || 'exclude');
				if (p === 'include') {
					return asenhaSbT('templatePatternInclusion');
				}
				return asenhaSbT('templatePatternExclusion');
			};

			var excludedSummary = function(tpl) {
				var tables = (tpl && tpl.excluded_tables) ? tpl.excluded_tables.length : 0;
				var parts = [];
				if (tpl.type !== 'files') {
					parts.push(sb.formatCountLabel(tables, asenhaSbT('templateTablesCountSingle'), asenhaSbT('templateTablesCountPlural')));
				}
				if (tpl.type !== 'database') {
					parts.push(asenhaSbT('calculating'));
				}
				return parts.join(' | ');
			};

			var html = '';
			html += '<table class="wp-list-table widefat fixed striped asenha-templates-list">';
			html += '<thead><tr>';
			html += '<th class="column-type">' + esc(asenhaSbT('templateType')) + '</th>';
			html += '<th class="column-pattern">' + esc(asenhaSbT('templatePatternColumn')) + '</th>';
			html += '<th class="column-title">' + esc(asenhaSbT('templateTitle')) + '</th>';
			html += '<th class="column-included">' + esc(asenhaSbT('templateIncluded')) + '</th>';
			html += '<th class="column-excluded">' + esc(asenhaSbT('templateExcluded')) + '</th>';
			html += '<th class="column-actions">' + esc(asenhaSbT('actions')) + '</th>';
			html += '</tr></thead><tbody>';

			for (var i = 0; i < templates.length; i++) {
				var tpl = templates[i] || {};
				var id = tpl.id || '';
				html += '<tr data-template-id="' + esc(id) + '">';
				html += '<td class="column-type">' + esc(typeLabel(tpl.type)) + '</td>';
				html += '<td class="column-pattern">' + esc(patternLabel(tpl)) + '</td>';
				html += '<td class="column-title">' + esc(tpl.title || '') + '</td>';
				html += '<td class="column-included"><span class="asenha-template-included" data-template-id="' + esc(id) + '">' + includedPlaceholder() + '</span></td>';
				html += '<td class="column-excluded"><span class="asenha-template-excluded" data-template-id="' + esc(id) + '">' + esc(excludedSummary(tpl)) + '</span></td>';
				html += '<td class="column-actions">';
				html += '<button type="button" class="button button-small asenha-backup-template-edit" data-template-id="' + esc(id) + '">' + esc(asenhaSbT('edit')) + '</button> ';
				html += '<button type="button" class="button button-small asenha-backup-template-delete" data-template-id="' + esc(id) + '">' + esc(asenhaSbT('cleanupDelete')) + '</button>';
				html += '</td>';
				html += '</tr>';
			}

			html += '</tbody></table>';
			return html;
		},

		/**
		 * Refresh the Included column counts for the Templates list.
		 *
		 * Runs a fresh wp-content scan (for file-capable templates) on each table render,
		 * and also fetches current DB tables count for accurate Included tables.
		 *
		 * @param {Array} templates
		 */
		refreshTemplatesIncludedCounts: function(templates) {
			templates = templates || [];
			if (!templates.length) {
				return;
			}

			var self = this;
			var state = this.templatesIncludedState || {};
			this.templatesIncludedState = state;

			// Bump token so stale async responses are ignored.
			state.scanToken = (state.scanToken || 0) + 1;
			var token = state.scanToken;

			// Abort any in-flight requests for a previous render.
			if (state.scanXhr && state.scanXhr.readyState !== 4) {
				try { state.scanXhr.abort(); } catch (e) {}
			}
			if (state.dbXhr && state.dbXhr.readyState !== 4) {
				try { state.dbXhr.abort(); } catch (e2) {}
			}

			state.scanByTemplate = {};
			state.wpContentTotals = null;

			// Always fetch the DB table list to get an up-to-date total for Included tables.
			state.dbXhr = $.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_get_db_tables_list',
					nonce: asenhaSiteBackup.nonce
				}
			}).done(function(resp) {
				if (token !== state.scanToken) {
					return;
				}
				if (resp && resp.success && resp.data && resp.data.tables) {
					state.dbTotalTables = resp.data.tables.length;
				} else {
					state.dbTotalTables = null;
				}
				self.updateTemplatesIncludedCells();
			}).fail(function() {
				if (token !== state.scanToken) {
					return;
				}
				state.dbTotalTables = null;
				self.updateTemplatesIncludedCells();
			});

			// Only scan wp-content for templates that include files.
			var scanTemplates = [];
			for (var i = 0; i < templates.length; i++) {
				var tpl = templates[i] || {};
				var t = String(tpl.type || 'full');
				if (t === 'database') {
					continue;
				}
				var id = String(tpl.id || '');
				if (!id) {
					continue;
				}
				scanTemplates.push({
					id: id,
					type: t,
					pattern: tpl.pattern || 'exclude',
					excluded_wp_content_paths: tpl.excluded_wp_content_paths || []
				});
			}

			if (!scanTemplates.length) {
				self.updateTemplatesIncludedCells();
				return;
			}

			state.scanXhr = $.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_scan_wp_content_for_templates',
					nonce: asenhaSiteBackup.nonce,
					templates: JSON.stringify(scanTemplates)
				}
			}).done(function(resp) {
				if (token !== state.scanToken) {
					return;
				}
				if (resp && resp.success && resp.data) {
					state.wpContentTotals = resp.data.totals || null;
					state.scanByTemplate = resp.data.by_template || {};
				}
				self.updateTemplatesIncludedCells();
			}).fail(function() {
				if (token !== state.scanToken) {
					return;
				}
				self.updateTemplatesIncludedCells();
			});
		},

		/**
		 * Update Included cells in the Templates list table using cached state.
		 */
		updateTemplatesIncludedCells: function() {
			var templates = this.templatesCache || [];
			if (!templates.length) {
				return;
			}

			var $cells = $('.asenha-template-included');
			if (!$cells.length) {
				return;
			}
			var cellMap = {};
			$cells.each(function() {
				var cellId = String($(this).data('template-id') || '');
				if (cellId) {
					cellMap[cellId] = $(this);
				}
			});

			var excludedMap = {};
			$('.asenha-template-excluded').each(function() {
				var cellId = String($(this).data('template-id') || '');
				if (cellId) {
					excludedMap[cellId] = $(this);
				}
			});

			var sb = this;
			var state = this.templatesIncludedState || {};
			var totalTables = (typeof state.dbTotalTables === 'number') ? state.dbTotalTables : null;
			var scanByTemplate = state.scanByTemplate || {};
			var calculating = asenhaSbT('calculating');

			for (var i = 0; i < templates.length; i++) {
				var tpl = templates[i] || {};
				var id = String(tpl.id || '');
				if (!id) {
					continue;
				}

				var type = String(tpl.type || 'full');
				var parts = [];

				if (type !== 'files') {
					if (totalTables !== null) {
						var pattern = String(tpl.pattern || 'exclude');
						var selectedTables = (tpl.excluded_tables && tpl.excluded_tables.length) ? tpl.excluded_tables.length : 0;
						var includedTables = (pattern === 'include')
							? selectedTables
							: Math.max(0, totalTables - selectedTables);
						parts.push(sb.formatCountLabel(includedTables, asenhaSbT('templateTablesCountSingle'), asenhaSbT('templateTablesCountPlural')));
					} else {
						parts.push(calculating);
					}
				}

				if (type !== 'database') {
					var scan = scanByTemplate[id] || null;
					if (scan && typeof scan.included_dirs !== 'undefined') {
						parts.push(sb.formatCountLabel(scan.included_files, asenhaSbT('templateFilesCountSingle'), asenhaSbT('templateFilesCountPlural')));
					} else {
						parts.push(calculating);
					}
				}

				var text = parts.join(' | ');
				if (cellMap[id]) {
					cellMap[id].text(text || calculating);
				}

				// Also update Excluded column (descendant-aware for folders).
				var excludedParts = [];
				var excludedTablesCount = (tpl.excluded_tables && tpl.excluded_tables.length) ? tpl.excluded_tables.length : 0;
				var tplPattern = String(tpl.pattern || 'exclude');
				var dbExcludedCount = (totalTables !== null && tplPattern === 'include')
					? Math.max(0, totalTables - excludedTablesCount)
					: excludedTablesCount;
				if (type !== 'files') {
					excludedParts.push(sb.formatCountLabel(dbExcludedCount, asenhaSbT('templateTablesCountSingle'), asenhaSbT('templateTablesCountPlural')));
				}
				if (type !== 'database') {
					var scanEx = scanByTemplate[id] || null;
					if (scanEx && typeof scanEx.excluded_dirs !== 'undefined') {
						excludedParts.push(sb.formatCountLabel(scanEx.excluded_files, asenhaSbT('templateFilesCountSingle'), asenhaSbT('templateFilesCountPlural')));
					} else {
						excludedParts.push(calculating);
					}
				}
				if (excludedMap[id]) {
					excludedMap[id].text(excludedParts.join(' | ') || calculating);
				}
			}
		},

		/**
		 * Show template picker under Create Backup.
		 *
		 * @param {string} backupType
		 */
		showTemplatePicker: function(backupType, opts) {
			var self = this;
			opts = opts || {};
			var selectedTemplateId = (typeof opts.selectedTemplateId !== 'undefined') ? String(opts.selectedTemplateId || '') : null;

			var $picker = $('#asenha-backup-template-picker');
			if (!$picker.length) {
				return;
			}

			var $dynamic = $picker.find('.asenha-template-picker-dynamic');
			var $actions = $picker.find('.asenha-template-picker-actions');

			$picker.show();

			// If the picker has structured containers (new markup), only update the dynamic area.
			if ($dynamic.length && $actions.length) {
				$dynamic.html('<p class="description">' + asenhaSbT('loading') + '</p>');
				$actions.empty();
			} else {
				// Backward-compatible fallback (older markup): replace entire picker.
				$picker.html('<p class="description">' + asenhaSbT('loading') + '</p>');
			}

			this.fetchTemplates(backupType).done(function(resp) {
				if (!resp || !resp.success) {
					var msg = '<p class="description">' + (resp && resp.data && resp.data.message ? resp.data.message : asenhaSbT('failedToLoadTemplates')) + '</p>';
					if ($dynamic.length && $actions.length) {
						$dynamic.html(msg);
						$actions.empty();
					} else {
						$picker.html(msg);
					}
					return;
				}
				var templates = resp.data && resp.data.templates ? resp.data.templates : [];
				self.templatesCache = templates;
				if ($dynamic.length && $actions.length) {
					$dynamic.html(self.renderTemplatePickerDynamicHtml(backupType, templates));
					$actions.html(self.renderTemplatePickerActionsHtml());

					var $select = $picker.find('#asenha-template-picker-select');
					if ($select.length && selectedTemplateId !== null) {
						$select.val(selectedTemplateId);
						if (selectedTemplateId && String($select.val() || '') !== selectedTemplateId) {
							$select.val('');
						}
					}
					self.updateTemplatePickerLinkState();
					self.initCreateBackupNoteEditor();
				} else {
					$picker.html(self.renderTemplatePickerHtml(backupType, templates));
					if (selectedTemplateId !== null) {
						var $selectFallback = $picker.find('#asenha-template-picker-select');
						if ($selectFallback.length) {
							$selectFallback.val(selectedTemplateId);
							if (selectedTemplateId && String($selectFallback.val() || '') !== selectedTemplateId) {
								$selectFallback.val('');
							}
						}
					}
					self.updateTemplatePickerLinkState();
					self.initCreateBackupNoteEditor();
				}
			}).fail(function() {
				if ($dynamic.length && $actions.length) {
					$dynamic.html('<p class="description">' + asenhaSbT('failedToLoadTemplates') + '</p>');
					$actions.empty();
				} else {
					$picker.html('<p class="description">' + asenhaSbT('failedToLoadTemplates') + '</p>');
				}
			});
		},

		/**
		 * When template selection changes in the picker, update the link label.
		 *
		 * @param {Event} e
		 */
		onTemplatePickerSelectChange: function(e) {
			e.preventDefault();
			this.updateTemplatePickerLinkState();

			// If user is in Incremental mode, re-load eligible baselines for the selected template.
			if (this.isIncrementalFromBaselineChecked()) {
				this.refreshBaselinePickerOptions();
			}
		},

		/**
		 * Determine whether the Backup method is "Incremental from a baseline".
		 *
		 * @return {boolean}
		 */
		isIncrementalFromBaselineChecked: function() {
			var $cb = $('#asenha-backup-method-incremental');
			return !!($cb.length && $cb.is(':checked'));
		},

		/**
		 * Fetch eligible baselines for the current picker state and populate the baseline dropdown.
		 *
		 * @since 8.7.0
		 */
		refreshBaselinePickerOptions: function() {
			var self = this;
			var $picker = $('#asenha-backup-template-picker');
			if (!$picker.length || !$picker.is(':visible')) {
				return;
			}

			var $selectTpl = $('#asenha-template-picker-select');
			var templateId = $selectTpl.length ? String($selectTpl.val() || '') : '';
			var backupType = self.pendingBackupType || ($selectTpl.data('backup-type') || '') || 'full';
			backupType = String(backupType || 'full');

			var $container = $('#asenha-baseline-picker');
			var $select = $('#asenha-baseline-picker-select');
			var $hint = $('#asenha-baseline-picker-hint');

			if (!$container.length || !$select.length) {
				return;
			}

			$select.prop('disabled', true);
			$select.empty().append($('<option/>').attr('value', '').text(asenhaSbT('loadingBaselines')));
			if ($hint.length) {
				$hint.text('');
			}

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_get_incremental_baselines',
					nonce: asenhaSiteBackup.nonce,
					backup_type: backupType,
					template_id: templateId || ''
				}
			}).done(function(resp) {
				// Reset cache each refresh (scope differs per template/type).
				self.incrementalBaselinesCache = {};

				$select.empty();
				if (!resp || !resp.success) {
					$select.append($('<option/>').attr('value', '').text(asenhaSbT('chooseBaseline')));
					if ($hint.length) {
						$hint.text((resp && resp.data && resp.data.message) ? resp.data.message : asenhaSbT('noEligibleBaselines'));
					}
					$select.prop('disabled', true);
					self.clearIncrementalDestinationLock();
					self.clearIncrementalMultipartLock();
					self.clearIncrementalEncryptionLock();
					return;
				}

				var baselines = (resp.data && $.isArray(resp.data.baselines)) ? resp.data.baselines : [];
				var autoSelected = (resp.data && resp.data.auto_selected) ? String(resp.data.auto_selected) : '';

				$select.append($('<option/>').attr('value', '').text(asenhaSbT('chooseBaseline')));
				baselines.forEach(function(b) {
					var fn = b && b.filename ? String(b.filename) : '';
					if (!fn) { return; }
					if (b && b.destinations) {
						var d = b.destinations || {};
						var localEnabled = !!d.local_enabled;
						var remoteIds = $.isArray(d.remote_location_ids) ? d.remote_location_ids.slice(0) : [];
						remoteIds = remoteIds.map(function(v) { return String(v || ''); }).filter(function(v) { return !!v; });
						self.incrementalBaselinesCache[fn] = {
							local_enabled: localEnabled,
							remote_location_ids: remoteIds
						};
					}
					if (b && b.multipart) {
						var mp = b.multipart || {};
						var mpEnabled = !!mp.enabled;
						var partBytes = parseInt(mp.part_bytes || '0', 10) || 0;
						if (!self.incrementalBaselinesCache[fn]) {
							self.incrementalBaselinesCache[fn] = {};
						}
						self.incrementalBaselinesCache[fn].multipart = {
							enabled: mpEnabled,
							part_bytes: partBytes
						};
					}
					if (b && b.encryption) {
						var enc = b.encryption || {};
						var encEnabled = !!enc.enabled || !!enc.passphrase_required;
						var encAlgo = String(enc.algo || '');
						var encPassphraseRequired = !!enc.passphrase_required || !!encEnabled;
						if (!self.incrementalBaselinesCache[fn]) {
							self.incrementalBaselinesCache[fn] = {};
						}
						self.incrementalBaselinesCache[fn].encryption = {
							enabled: encEnabled,
							algo: encAlgo,
							passphrase_required: encPassphraseRequired
						};
					}
					var label = fn;
					if (b.created_human) {
						label += ' — ' + String(b.created_human);
					}
					$select.append($('<option/>').attr('value', fn).text(label));
				});

				if (autoSelected) {
					$select.val(autoSelected);
				}

				if (!baselines.length) {
					if ($hint.length) {
						$hint.text(asenhaSbT('noEligibleBaselines'));
					}
					$select.prop('disabled', true);
				} else {
					$select.prop('disabled', false);
				}

				// Apply destinations lock to the selected baseline (auto-selected or current).
				var selected = String($select.val() || '') || autoSelected;
				if (selected) {
					self.applyIncrementalDestinationLock(selected);
					self.applyIncrementalMultipartLock(selected);
					self.applyIncrementalEncryptionLock(selected);
				} else {
					self.clearIncrementalDestinationLock();
					self.clearIncrementalMultipartLock();
					self.clearIncrementalEncryptionLock();
				}
			}).fail(function() {
				$select.empty().append($('<option/>').attr('value', '').text(asenhaSbT('chooseBaseline')));
				if ($hint.length) {
					$hint.text(asenhaSbT('noEligibleBaselines'));
				}
				$select.prop('disabled', true);
				self.clearIncrementalDestinationLock();
				self.clearIncrementalMultipartLock();
				self.clearIncrementalEncryptionLock();
			});
		},

		/**
		 * Update the template picker link label (Create vs Edit) based on selection.
		 */
		updateTemplatePickerLinkState: function() {
			var $picker = $('#asenha-backup-template-picker');
			if (!$picker.length || !$picker.is(':visible')) {
				return;
			}

			var $link = $picker.find('.asenha-template-picker-create-link');
			if (!$link.length) {
				return;
			}

			var $select = $picker.find('#asenha-template-picker-select');
			var templateId = $select.length ? String($select.val() || '') : '';

			var createLabel = asenhaSbT('createTemplateShort') || asenhaSbT('createTemplate');
			var editLabel = asenhaSbT('editTemplateShort') || asenhaSbT('editTemplate');

			$link.text(templateId ? editLabel : createLabel);
		},

		/**
		 * Handle changes to the backup method checkbox in the picker.
		 *
		 * @since 8.7.0
		 */
		onBackupMethodChange: function(e) {
			e.preventDefault();
			var isIncremental = this.isIncrementalFromBaselineChecked();
			var $baseline = $('#asenha-baseline-picker');
			var $hint = $('#asenha-baseline-picker-hint');
			if (!$baseline.length) {
				return;
			}
			if (isIncremental) {
				$baseline.show();
				if ($hint.length) {
					$hint.show();
				}
				this.refreshBaselinePickerOptions();
			} else {
				$baseline.hide();
				if ($hint.length) {
					$hint.hide();
				}
				this.clearIncrementalDestinationLock();
				this.clearIncrementalMultipartLock();
				this.clearIncrementalEncryptionLock();
			}
		},

		/**
		 * Render template picker dynamic HTML (heading + template selector).
		 *
		 * @param {string} backupType
		 * @param {Array} templates
		 * @return {string}
		 */
		renderTemplatePickerDynamicHtml: function(backupType, templates) {
			templates = templates || [];
			var esc = function(s) {
				return $('<div/>').text(String(s || '')).html();
			};

			var defaultTitle = asenhaSbT('defaultTemplateTitleFull');
			if (backupType === 'database') { defaultTitle = asenhaSbT('defaultTemplateTitleDatabase'); }
			if (backupType === 'files') { defaultTitle = asenhaSbT('defaultTemplateTitleFiles'); }

			var chooseTemplate = asenhaSbT('chooseTemplate');
			var createTemplateLabel = asenhaSbT('createTemplateShort') || asenhaSbT('createTemplate');

			var backupHeadingFull = asenhaSbT('backupHeadingFull');
			var backupHeadingDatabase = asenhaSbT('backupHeadingDatabase');
			var backupHeadingFiles = asenhaSbT('backupHeadingFiles');
			var backupHeading = backupHeadingFull;
			if (backupType === 'database') { backupHeading = backupHeadingDatabase; }
			if (backupType === 'files') { backupHeading = backupHeadingFiles; }

			var html = '';
			html += '<h3 class="asenha-template-picker-backup-heading">' + esc(backupHeading) + '</h3>';
			html += '<div class="asenha-template-picker-header">';
			html += '<p class="description"><strong>' + esc(chooseTemplate) + '</strong></p>';
			html += '</div>';

			html += '<div class="asenha-template-picker-row">';
			html += '<label class="screen-reader-text" for="asenha-template-picker-select">' + esc(chooseTemplate) + '</label>';
			html += '<select id="asenha-template-picker-select" class="asenha-template-picker-select" data-backup-type="' + esc(backupType) + '">';
			html += '<option value="">' + esc(defaultTitle) + '</option>';
			for (var i = 0; i < templates.length; i++) {
				var tpl = templates[i] || {};
				var id = String(tpl.id || '');
				var title = String(tpl.title || '');
				if (!id || !title) {
					continue;
				}
				html += '<option value="' + esc(id) + '">' + esc(title) + '</option>';
			}
			html += '</select>';

			html += '<a href="#" id="asenha-create-backup-template" class="button-link asenha-template-picker-create-link">' + esc(createTemplateLabel) + '</a>';
			html += '</div>';

			// Backup method (Incremental from a baseline).
			var methodLabel = asenhaSbT('backupMethodLabel');
			var methodIncremental = asenhaSbT('incrementalFromBaselineLabel');
			var baselineLabel = asenhaSbT('baselineLabel');
			var chooseBaseline = asenhaSbT('chooseBaseline');

			html += '<fieldset class="asenha-backup-method" id="asenha-backup-method">';
			html += '<legend>' + esc(methodLabel) + '</legend>';
			if (!methodIncremental) {
				methodIncremental = asenhaSbT('backupMethodIncremental');
			}

			var checkboxDisabled = (backupType === 'database');
			html += '<div class="asenha-backup-method-row">';
			html += '<label class="asenha-backup-method-incremental">';
			html += '<input type="checkbox" id="asenha-backup-method-incremental" value="1"' + (checkboxDisabled ? ' disabled' : '') + '> ';
			html += esc(methodIncremental);
			html += '</label>';

			// Baseline picker (shown only when checkbox is checked).
			html += '<div class="asenha-baseline-picker asenha-baseline-picker-inline" id="asenha-baseline-picker" style="display:none;">';
			html += '<label class="screen-reader-text" for="asenha-baseline-picker-select">' + esc(baselineLabel) + '</label>';
			html += '<select id="asenha-baseline-picker-select" class="asenha-baseline-picker-select">';
			html += '<option value="">' + esc(chooseBaseline) + '</option>';
			html += '</select>';
			html += '</div>';
			html += '</div>';
			html += '<p class="description" id="asenha-baseline-picker-hint" style="display:none;"></p>';
			html += '</fieldset>';

			return html;
		},

		/**
		 * Render template picker actions HTML (Backup Now + Cancel).
		 *
		 * @return {string}
		 */
		renderTemplatePickerActionsHtml: function() {
			var esc = function(s) {
				return $('<div/>').text(String(s || '')).html();
			};
			var startBackupLabel = asenhaSbT('startBackup');
			var cancelLabel = asenhaSbT('cancel');

			var html = '';
			html += '<button type="button" class="button button-primary asenha-template-picker-start">' + esc(startBackupLabel) + '</button> ';
			html += '<button type="button" class="button asenha-template-picker-cancel">' + esc(cancelLabel) + '</button>';
			return html;
		},

		/**
		 * Render template picker HTML.
		 */
		renderTemplatePickerHtml: function(backupType, templates) {
			var html = '';
			html += this.renderTemplatePickerDynamicHtml(backupType, templates);
			html += '<div class="asenha-template-picker-actions">';
			html += this.renderTemplatePickerActionsHtml();
			html += '</div>';

			return html;
		},

		onStartBackupFromPickerClick: function(e) {
			e.preventDefault();
			var $btn = $(e.currentTarget);
			if ($btn && $btn.length) {
				$btn.prop('disabled', true);
			}

			var $select = $('#asenha-template-picker-select');
			var templateId = $select.length ? ($select.val() || '') : '';
			var backupType = this.pendingBackupType || ($select.data('backup-type') || '') || 'full';
			var isIncremental = this.isIncrementalFromBaselineChecked();
			var backupMethod = isIncremental ? 'incremental' : 'baseline';
			var baseFilename = isIncremental ? String($('#asenha-baseline-picker-select').val() || '') : '';
			var multipartEnabled = $('#asenha-multipart-enabled').is(':checked');
			var multipartPartBytes = parseInt($('#asenha-multipart-part-bytes').val() || '0', 10);
			if (!multipartEnabled) {
				multipartPartBytes = 0;
			}
			var archiveEncryption = this.getBackupArchiveEncryptionSelection();
			if (!archiveEncryption) {
				if ($btn && $btn.length) {
					$btn.prop('disabled', false);
				}
				return;
			}

			var $picker = $('#asenha-backup-template-picker');
			$picker.hide();
			$picker.find('.asenha-template-picker-dynamic').empty();
			$picker.find('.asenha-template-picker-actions').empty();

			// Clear destination lock state; server-side will enforce for incremental anyway.
			this.clearIncrementalDestinationLock();
			this.clearIncrementalMultipartLock();
			this.clearIncrementalEncryptionLock();

			// Reset pending state.
			this.pendingBackupType = null;
			this.pendingBackupFocusButton = null;

			var zipDiagnosticMode = $('#asenha-backup-zip-diagnostic-mode').is(':checked');
			this.startBackupWithTemplate(
				backupType,
				templateId,
				multipartEnabled,
				multipartPartBytes,
				backupMethod,
				baseFilename,
				archiveEncryption.enabled,
				archiveEncryption.passphrase,
				archiveEncryption.passphraseConfirm,
				zipDiagnosticMode
			);
		},

		onCancelTemplatePickerClick: function(e) {
			e.preventDefault();
			// Reset pending state.
			this.pendingBackupType = null;
			this.pendingBackupFocusButton = null;
			var $picker = $('#asenha-backup-template-picker');
			$picker.hide();
			$picker.find('.asenha-template-picker-dynamic').empty();
			$picker.find('.asenha-template-picker-actions').empty();
			this.clearIncrementalDestinationLock();
			this.clearIncrementalMultipartLock();
			this.clearIncrementalEncryptionLock();
			$('.asenha-start-backup').prop('disabled', false);
		},

		/**
		 * Open Create Template modal.
		 */
		onCreateTemplateClick: function(e) {
			e.preventDefault();
			var $el = $(e.currentTarget);
			var inBackupPicker = ($el.closest('#asenha-backup-template-picker').length > 0);
			var inTransferPicker = ($el.closest('#asenha-transfer-template-picker').length > 0);
			var modalOpts = {};

			if (inTransferPicker) {
				// The transfer key flow always uses Full packages.
				modalOpts = { lockType: true, forcedType: 'full', compactTemplateLabels: true, stayOpenAfterEditSave: true };
			} else if (inBackupPicker) {
				// Force the template type to match the backup type for this picker session.
				var forcedBackupType = this.pendingBackupType || '';
				if (!forcedBackupType) {
					var $backupSelect = $('#asenha-template-picker-select');
					forcedBackupType = $backupSelect.length ? String($backupSelect.data('backup-type') || '') : '';
				}
				if (['full', 'database', 'files'].indexOf(forcedBackupType) === -1) {
					forcedBackupType = 'full';
				}
				modalOpts = { lockType: true, forcedType: forcedBackupType, compactTemplateLabels: true, stayOpenAfterEditSave: true };
			}

			if (inBackupPicker || inTransferPicker) {
				var selectSelector = inTransferPicker ? '#asenha-transfer-template-picker-select' : '#asenha-template-picker-select';
				var templateId = String($(selectSelector).val() || '');
				if (templateId) {
					var tpl = this.getCachedTemplateById(templateId);
					if (!tpl) {
						this.showNotice('error', asenhaSbT('templateNotFound'));
						return;
					}
					this.openTemplateModal(tpl, modalOpts);
					return;
				}
			}

			this.openTemplateModal(null, modalOpts);
		},

		/**
		 * Open Edit Template modal.
		 */
		onEditTemplateClick: function(e) {
			e.preventDefault();
			var id = $(e.currentTarget).data('template-id') || '';
			var tpl = this.getCachedTemplateById(id);
			this.openTemplateModal(tpl);
		},

		/**
		 * Delete template.
		 */
		onDeleteTemplateClick: function(e) {
			e.preventDefault();
			var self = this;
			var id = $(e.currentTarget).data('template-id') || '';
			if (!id) {
				return;
			}
			if (!window.confirm(asenhaSbT('confirmDelete'))) {
				return;
			}
			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_delete_backup_template',
					nonce: asenhaSiteBackup.nonce,
					template_id: id
				}
			}).done(function(resp) {
				if (resp && resp.success) {
					self.refreshTemplatesList();
				} else {
					self.showNotice('error', (resp && resp.data && resp.data.message) ? resp.data.message : asenhaSbT('failedToDeleteTemplate'));
				}
			}).fail(function() {
				self.showNotice('error', asenhaSbT('failedToDeleteTemplate'));
			});
		},

		getCachedTemplateById: function(id) {
			id = String(id || '');
			if (!id || !this.templatesCache || !this.templatesCache.length) {
				return null;
			}
			for (var i = 0; i < this.templatesCache.length; i++) {
				var t = this.templatesCache[i] || {};
				if (String(t.id || '') === id) {
					return t;
				}
			}
			return null;
		},

		upsertTemplateCaches: function(template) {
			template = template || {};
			var id = String(template.id || '');
			if (!id) {
				return;
			}

			if (!$.isArray(this.templatesCache)) {
				this.templatesCache = [];
			}
			var updatedMain = false;
			for (var i = 0; i < this.templatesCache.length; i++) {
				var cached = this.templatesCache[i] || {};
				if (String(cached.id || '') === id) {
					this.templatesCache[i] = template;
					updatedMain = true;
					break;
				}
			}
			if (!updatedMain) {
				this.templatesCache.push(template);
			}

			if (!this.policyTemplatesByType || typeof this.policyTemplatesByType !== 'object') {
				this.policyTemplatesByType = {};
			}

			var templateType = String(template.type || '');
			var validTypes = ['full', 'database', 'files'];
			for (var t = 0; t < validTypes.length; t++) {
				var key = validTypes[t];
				if (!$.isArray(this.policyTemplatesByType[key])) {
					continue;
				}
				this.policyTemplatesByType[key] = this.policyTemplatesByType[key].filter(function(entry) {
					return String((entry || {}).id || '') !== id;
				});
			}

			if (validTypes.indexOf(templateType) !== -1) {
				if (!$.isArray(this.policyTemplatesByType[templateType])) {
					this.policyTemplatesByType[templateType] = [];
				}
				this.policyTemplatesByType[templateType].push(template);
			}
		},

		clearTemplateModalSaveStatus: function() {
			var $status = $('#asenha-template-save-status');
			if (!$status.length) {
				return;
			}
			$status.removeClass('is-visible is-success is-error').text('');
		},

		setTemplateModalSaveStatus: function(message, type) {
			var $status = $('#asenha-template-save-status');
			if (!$status.length) {
				return;
			}
			var statusType = (type === 'error') ? 'error' : 'success';
			$status
				.removeClass('is-success is-error')
				.addClass('is-visible is-' + statusType)
				.text(String(message || ''));
		},

		/**
		 * Build + open modal for create/edit.
		 *
		 * @param {Object|null} template
		 */
		openTemplateModal: function(template, opts) {
			var self = this;
			opts = opts || {};
			this.ensureTemplateModalExists();

			var isEdit = !!(template && template.id);
			var compactTemplateLabels = !!opts.compactTemplateLabels;
			var modalTitle = isEdit
				? (compactTemplateLabels ? (asenhaSbT('editTemplateShort') || asenhaSbT('editTemplate')) : asenhaSbT('editTemplate'))
				: (compactTemplateLabels ? (asenhaSbT('createTemplateShort') || asenhaSbT('createTemplate')) : asenhaSbT('createTemplate'));
			$('#asenha-template-modal-title').text(modalTitle);

			var tpl = template || {};
			var forcedType = (typeof opts.forcedType !== 'undefined') ? String(opts.forcedType || '') : '';
			if (forcedType && ['full', 'database', 'files'].indexOf(forcedType) === -1) {
				forcedType = '';
			}

			var type = forcedType || tpl.type || (this.pendingBackupType || 'full');
			var title = tpl.title || '';
			var pattern = tpl.pattern || 'exclude';
			if (['exclude', 'include'].indexOf(String(pattern)) === -1) {
				pattern = 'exclude';
			}
			var excludedTables = tpl.excluded_tables || [];
			var excludedPaths = tpl.excluded_wp_content_paths || [];

			$('#asenha-template-id').val(isEdit ? (tpl.id || '') : '');
			$('#asenha-template-title').val(title);
			$('input[name="asenha-template-type"][value="' + type + '"]').prop('checked', true);
			$('input[name="asenha-template-type"]').prop('disabled', !!opts.lockType);
			$('input[name="asenha-template-pattern"][value="' + String(pattern) + '"]').prop('checked', true);

			// Store working state on the modal element.
			var $modal = $('#asenha-template-modal');
			$modal.data('templatePattern', String(pattern));
			$modal.data('excludedTables', excludedTables.slice ? excludedTables.slice() : []);
			$modal.data('excludedPaths', excludedPaths.slice ? excludedPaths.slice() : []);
			$modal.data('stayOpenAfterEditSave', !!opts.stayOpenAfterEditSave);

			this.updateTemplateModalSections(type);
			this.resetTemplateModalTabsState();
			this.activateTemplateTabForType(type);

			$modal.show();
			this.clearTemplateModalSaveStatus();
			$('#asenha-template-save').prop('disabled', false).removeClass('is-busy');

			$('#asenha-template-save').off('click.asenhaTemplateSave').on('click.asenhaTemplateSave', function(ev) {
				ev.preventDefault();
				self.saveTemplateFromModal();
			});
		},

		ensureTemplateModalExists: function() {
			if ($('#asenha-template-modal').length) {
				return;
			}

			var html = '';
			html += '<div class="asenha-modal-overlay" id="asenha-template-modal" style="display:none;">';
			html += '  <div class="asenha-modal">';
			html += '    <div class="asenha-modal-header">';
			html += '      <h2 id="asenha-template-modal-title">' + this.escapeHtml(asenhaSbT('templateLabel')) + '</h2>';
			html += '      <button type="button" class="button-link asenha-modal-close" aria-label="' + this.escapeAttr(asenhaSbT('close')) + '">×</button>';
			html += '    </div>';
			html += '    <div class="asenha-modal-body">';
			html += '      <input type="hidden" id="asenha-template-id" value="" />';
			html += '      <table class="form-table">';
			html += '        <tr><th scope="row"><label for="asenha-template-title">' + this.escapeHtml(asenhaSbT('templateTitle')) + '</label></th>';
			html += '        <td><input type="text" class="regular-text" id="asenha-template-title" value="" /></td></tr>';
			html += '        <tr><th scope="row">' + this.escapeHtml(asenhaSbT('templateType')) + '</th>';
			html += '        <td>';
			html += '          <label><input type="radio" name="asenha-template-type" value="full" /> ' + this.escapeHtml(asenhaSbT('packageTypeFull')) + '</label> ';
			html += '          <label><input type="radio" name="asenha-template-type" value="database" /> ' + this.escapeHtml(asenhaSbT('templateTabDatabase')) + '</label> ';
			html += '          <label><input type="radio" name="asenha-template-type" value="files" /> ' + this.escapeHtml(asenhaSbT('templateTabFiles')) + '</label>';
			html += '        </td></tr>';
			html += '        <tr><th scope="row">' + this.escapeHtml(asenhaSbT('templatePattern')) + '</th>';
			html += '        <td>';
			html += '          <label><input type="radio" name="asenha-template-pattern" value="exclude" /> ' + this.escapeHtml(asenhaSbT('templatePatternExcludeSelected')) + '</label> ';
			html += '          <label><input type="radio" name="asenha-template-pattern" value="include" /> ' + this.escapeHtml(asenhaSbT('templatePatternIncludeSelected')) + '</label>';
			html += '        </td></tr>';
			html += '      </table>';

			html += '      <div class="asenha-template-tabs-wrap">';
			html += '        <nav class="nav-tab-wrapper asenha-template-tabs-nav" role="tablist">';
			html += '          <a href="#" class="nav-tab asenha-template-tab-link" data-tab="db" role="tab" aria-selected="false">' + asenhaSbT('templateTabDatabase') + '</a>';
			html += '          <a href="#" class="nav-tab asenha-template-tab-link" data-tab="files" role="tab" aria-selected="false">' + asenhaSbT('templateTabFiles') + '</a>';
			html += '        </nav>';
			html += '        <div class="asenha-template-tabs-panels">';
			html += '          <div class="asenha-template-tab-panel asenha-template-tab-panel-db" data-tab-panel="db" role="tabpanel">';
			html += '            <div class="asenha-template-db-summary" id="asenha-template-db-summary"></div>';
			html += '            <input type="search" class="regular-text" id="asenha-template-db-search" placeholder="' + this.escapeAttr(asenhaSbT('searchTablesPlaceholder')) + '" />';
			html += '            <div class="asenha-template-db-bulk" id="asenha-template-db-bulk">';
			html += '              <span class="asenha-template-db-bulk-label">' + this.escapeHtml(asenhaSbT('dbBulkSelectLabel')) + '</span>';
			html += '              <label><input type="checkbox" class="asenha-template-db-bulk-checkbox" data-bulk="core" /> ' + this.escapeHtml(asenhaSbT('dbBulkCoreWpTables')) + '</label>';
			html += '              <label><input type="checkbox" class="asenha-template-db-bulk-checkbox" data-bulk="ase" /> ' + this.escapeHtml(asenhaSbT('dbBulkAseTables')) + '</label>';
			html += '              <label><input type="checkbox" class="asenha-template-db-bulk-checkbox" data-bulk="other" /> ' + this.escapeHtml(asenhaSbT('dbBulkOtherNonCoreNonAseTables')) + '</label>';
			html += '              <label><input type="checkbox" class="asenha-template-db-bulk-checkbox" data-bulk="none" /> ' + this.escapeHtml(asenhaSbT('dbBulkNone')) + '</label>';
			html += '            </div>';
			html += '            <div class="asenha-template-db-list" id="asenha-template-db-list"></div>';
			html += '          </div>';
			html += '          <div class="asenha-template-tab-panel asenha-template-tab-panel-files" data-tab-panel="files" role="tabpanel">';
			html += '            <div class="asenha-template-files-summary" id="asenha-template-files-summary"></div>';
			html += '            <div class="asenha-template-files-tree" id="asenha-template-files-tree"></div>';
			html += '          </div>';
			html += '        </div>';
			html += '      </div>';

			html += '    </div>';
			html += '    <div class="asenha-modal-footer">';
			html += '      <span id="asenha-template-save-status" class="asenha-template-save-status" aria-live="polite"></span>';
			html += '      <button type="button" class="button button-primary" id="asenha-template-save">' + this.escapeHtml(asenhaSbT('save')) + '</button> ';
			html += '      <button type="button" class="button asenha-modal-cancel">' + this.escapeHtml(asenhaSbT('close')) + '</button>';
			html += '    </div>';
			html += '  </div>';
			html += '</div>';

			$('body').append(html);

			var self = this;
			$(document).on('click', '.asenha-modal-close, .asenha-modal-cancel', function(ev) {
				ev.preventDefault();
				$('#asenha-template-modal').hide();
				self.clearTemplateModalSaveStatus();
				$('#asenha-template-save').prop('disabled', false).removeClass('is-busy');
			});
			$(document).on('change', 'input[name="asenha-template-type"]', function() {
				var type = $('input[name="asenha-template-type"]:checked').val() || 'full';
				self.updateTemplateModalSections(type);
				self.activateTemplateTabForType(type);
			});
			$(document).on('change', 'input[name="asenha-template-pattern"]', function() {
				var pattern = $('input[name="asenha-template-pattern"]:checked').val() || 'exclude';
				$('#asenha-template-modal').data('templatePattern', String(pattern));
				self.updateDbTablesSummary();
				self.refreshTemplateModalExcludedSummaryDebounced();
			});
			$(document).on('input', '#asenha-template-db-search', function() {
				var q = String($(this).val() || '').toLowerCase();
				$('#asenha-template-db-list .asenha-db-table-item').each(function() {
					var name = String($(this).data('table-key') || '').toLowerCase();
					$(this).toggle(!q || name.indexOf(q) !== -1);
				});
			});
			$(document).on('change', '.asenha-db-table-checkbox', function() {
				var $modal = $('#asenha-template-modal');
				var selected = $modal.data('excludedTables') || [];
				var key = String($(this).data('table-key') || '');
				var checked = $(this).is(':checked');
				selected = selected.filter(function(x) { return String(x) !== key; });
				if (checked && key) {
					selected.push(key);
				}
				$modal.data('excludedTables', selected);
				self.updateDbTablesSummary();
				self.updateDbTablesBulkState();
			});

			$(document).on('change', '.asenha-template-db-bulk-checkbox', function() {
				var $modal = $('#asenha-template-modal');
				if (!$modal.length) {
					return;
				}

				var bulk = String($(this).data('bulk') || '');
				var checked = $(this).is(':checked');

				var excluded = $modal.data('excludedTables') || [];

				// Bulk: none (clear all excluded tables; disable other bulk options).
				if (bulk === 'none') {
					if (checked) {
						$modal.data('excludedTables', []);
						$('#asenha-template-db-list .asenha-db-table-checkbox').prop('checked', false);
						self.updateDbTablesSummary();
						self.updateDbTablesBulkState();
					} else {
						// Keep "none" checked while there are no exclusions.
						self.updateDbTablesBulkState();
					}
					return;
				}

				// Any other bulk option implies "none" must be unchecked.
				$('#asenha-template-db-bulk .asenha-template-db-bulk-checkbox[data-bulk="none"]').prop('checked', false);

				var tables = $modal.data('dbTables') || [];
				if (!tables || !tables.length) {
					// No tables yet; nothing to toggle.
					self.updateDbTablesBulkState();
					return;
				}

				var groups = self.getDbTableBulkGroups(tables);
				var keys = groups && groups[bulk] ? groups[bulk] : [];
				if (!keys.length) {
					self.updateDbTablesBulkState();
					return;
				}

				var excludedSet = {};
				for (var i = 0; i < excluded.length; i++) {
					var ek = String(excluded[i] || '');
					if (ek) {
						excludedSet[ek] = true;
					}
				}

				for (var j = 0; j < keys.length; j++) {
					var k = String(keys[j] || '');
					if (!k) {
						continue;
					}
					if (checked) {
						excludedSet[k] = true;
					} else if (excludedSet[k]) {
						delete excludedSet[k];
					}
				}

				var nextExcluded = Object.keys(excludedSet);
				$modal.data('excludedTables', nextExcluded);

				$('#asenha-template-db-list .asenha-db-table-checkbox').each(function() {
					var tKey = String($(this).data('table-key') || '');
					$(this).prop('checked', !!excludedSet[tKey]);
				});

				self.updateDbTablesSummary();
				self.updateDbTablesBulkState();
			});

			$(document).on('click', '.asenha-template-tab-link', function(ev) {
				ev.preventDefault();
				var tab = String($(this).data('tab') || '');
				self.activateTemplateTab(tab, { load: true });
			});
		},

		updateTemplateModalSections: function(type) {
			type = type || 'full';
			var showDb = (type === 'full' || type === 'database');
			var showFiles = (type === 'full' || type === 'files');

			// Avoid jQuery .toggle() on panels because it sets inline display styles that can
			// override our `.is-active` tab-panel visibility rules.
			$('.asenha-template-tab-link[data-tab="db"]').toggle(!!showDb);
			$('.asenha-template-tab-link[data-tab="files"]').toggle(!!showFiles);
			$('.asenha-template-tab-panel-db').toggleClass('is-disabled', !showDb).removeAttr('style');
			$('.asenha-template-tab-panel-files').toggleClass('is-disabled', !showFiles).removeAttr('style');
			if (!showDb) {
				$('.asenha-template-tab-panel-db').removeClass('is-active');
			}
			if (!showFiles) {
				$('.asenha-template-tab-panel-files').removeClass('is-active');
			}

			if (!showDb) {
				$('#asenha-template-db-list').empty();
				$('#asenha-template-db-summary').empty();
				$('#asenha-template-modal').data('dbTablesTotal', null);
			}
			if (!showFiles) {
				$('#asenha-template-files-tree').empty();
				$('#asenha-template-files-summary').empty();
			}
		},

		resetTemplateModalTabsState: function() {
			var $modal = $('#asenha-template-modal');
			$modal.data('dbTabLoaded', false);
			$modal.data('filesTabLoaded', false);
		},

		activateTemplateTabForType: function(type) {
			type = type || 'full';
			if (type === 'database') {
				this.activateTemplateTab('db', { load: true, force: true });
				return;
			}
			if (type === 'files') {
				this.activateTemplateTab('files', { load: true, force: true });
				return;
			}
			// Full: show both tabs; default active = Database.
			this.activateTemplateTab('db', { load: true, force: true });
		},

		activateTemplateTab: function(tab, opts) {
			tab = String(tab || '');
			opts = opts || {};

			var $modal = $('#asenha-template-modal');
			var type = $('input[name="asenha-template-type"]:checked').val() || 'full';
			var showDb = (type === 'full' || type === 'database');
			var showFiles = (type === 'full' || type === 'files');

			if (tab === 'db' && !showDb) {
				tab = showFiles ? 'files' : '';
			}
			if (tab === 'files' && !showFiles) {
				tab = showDb ? 'db' : '';
			}
			if (!tab) {
				return;
			}

			$('.asenha-template-tab-link').removeClass('nav-tab-active').attr('aria-selected', 'false');
			$('.asenha-template-tab-panel').removeClass('is-active');

			var $link = $('.asenha-template-tab-link[data-tab="' + tab + '"]');
			var $panel = $('.asenha-template-tab-panel[data-tab-panel="' + tab + '"]');
			$link.addClass('nav-tab-active').attr('aria-selected', 'true');
			$panel.addClass('is-active');

			if (!opts.load) {
				return;
			}

			if (tab === 'db') {
				var dbLoaded = !!$modal.data('dbTabLoaded');
				if (!dbLoaded || opts.force) {
					this.loadTemplateDbTables(type);
					$modal.data('dbTabLoaded', true);
				}
				return;
			}

			if (tab === 'files') {
				var filesLoaded = !!$modal.data('filesTabLoaded');
				if (!filesLoaded || opts.force) {
					this.initWpContentTree(type);
					$modal.data('filesTabLoaded', true);
				}
			}
		},

		loadTemplateDbTables: function(type) {
			var self = this;
			if (!(type === 'full' || type === 'database')) {
				$('#asenha-template-db-list').empty();
				$('#asenha-template-db-summary').empty();
				return;
			}

			$('#asenha-template-db-list').html('<p class="description">' + asenhaSbT('loading') + '</p>');
			$('#asenha-template-db-summary').html('<p class="description">' + self.formatDbTablesExcludedSummary(null, null) + '</p>');

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_get_db_tables_list',
					nonce: asenhaSiteBackup.nonce
				}
			}).done(function(resp) {
				if (!resp || !resp.success) {
					$('#asenha-template-db-list').html('<p class="description">' + asenhaSbT('failedToLoadTables') + '</p>');
					$('#asenha-template-db-summary').empty();
					return;
				}
				var tables = resp.data && resp.data.tables ? resp.data.tables : [];
				var selected = $('#asenha-template-modal').data('excludedTables') || [];
				$('#asenha-template-modal').data('dbTablesTotal', tables.length);
				$('#asenha-template-modal').data('dbTables', tables);
				$('#asenha-template-db-list').html(self.renderDbTablesHtml(tables, selected));
				self.updateDbTablesSummary();
				self.updateDbTablesBulkState();
			}).fail(function() {
				$('#asenha-template-db-list').html('<p class="description">' + asenhaSbT('failedToLoadTables') + '</p>');
				$('#asenha-template-db-summary').empty();
			});
		},

		/**
		 * Format the DB tables excluded summary string.
		 *
		 * @param {number|null} excludedCount
		 * @param {number|null} totalCount
		 * @return {string}
		 */
		formatDbTablesExcludedSummary: function(excludedCount, totalCount) {
			var calculating = asenhaSbT('calculating');
			var pattern = String($('#asenha-template-modal').data('templatePattern') || 'exclude');
			var label = (pattern === 'include') ? asenhaSbT('templateIncluded') : asenhaSbT('templateExcluded');
			if (excludedCount === null || totalCount === null) {
				return label + ': ' + calculating;
			}
			var tpl;
			if (pattern === 'include') {
				tpl = String(asenhaSbT('dbTablesIncludedSummary'));
			} else {
				tpl = String(asenhaSbT('dbTablesExcludedSummary'));
			}
			return tpl.replace('%1$d', String(excludedCount)).replace('%2$d', String(totalCount));
		},

		/**
		 * Update the DB tables excluded summary under the checklist.
		 */
		updateDbTablesSummary: function() {
			var $summary = $('#asenha-template-db-summary');
			if (!$summary.length) {
				return;
			}
			var $modal = $('#asenha-template-modal');
			if (!$modal.length) {
				return;
			}
			var excluded = ($modal.data('excludedTables') || []);
			var pattern = String($modal.data('templatePattern') || 'exclude');
			var total = $modal.data('dbTablesTotal');
			if (typeof total !== 'number') {
				$summary.html('<p class="description">' + this.formatDbTablesExcludedSummary(null, null) + '</p>');
				return;
			}
			// excluded[] is the selected list; its meaning depends on pattern.
			var selectedCount = excluded.length;
			var excludedCount = (pattern === 'include') ? Math.max(0, total - selectedCount) : selectedCount;
			var includedCount = (pattern === 'include') ? selectedCount : excludedCount;
			$summary.html('<p class="description">' + this.formatDbTablesExcludedSummary(includedCount, total) + '</p>');
		},

		/**
		 * Get bulk groups for the DB table list (by manifest key).
		 *
		 * @param {Array} tables Array of { key, full } objects.
		 * @return {Object} { core: string[], ase: string[], other: string[] }
		 */
		getDbTableBulkGroups: function(tables) {
			tables = tables || [];
			var groups = { core: [], ase: [], other: [] };
			var dbPrefix = (asenhaSiteBackup && asenhaSiteBackup.dbPrefix) ? String(asenhaSiteBackup.dbPrefix) : '';
			var dbBasePrefix = (asenhaSiteBackup && asenhaSiteBackup.dbBasePrefix) ? String(asenhaSiteBackup.dbBasePrefix) : '';
			for (var i = 0; i < tables.length; i++) {
				var t = tables[i] || {};
				var key = String(t.key || '');
				if (!key) {
					continue;
				}
				if (asenhaIsDbTableAse(t)) {
					groups.ase.push(key);
					continue;
				}
				if (asenhaIsDbTableCore(t, dbPrefix, dbBasePrefix)) {
					groups.core.push(key);
					continue;
				}
				groups.other.push(key);
			}
			return groups;
		},

		/**
		 * Update the DB tables bulk checkboxes states (checked/indeterminate/disabled).
		 */
		updateDbTablesBulkState: function() {
			var $bulk = $('#asenha-template-db-bulk');
			if (!$bulk.length) {
				return;
			}

			var $modal = $('#asenha-template-modal');
			if (!$modal.length) {
				return;
			}

			var excluded = ($modal.data('excludedTables') || []);

			var $none = $bulk.find('.asenha-template-db-bulk-checkbox[data-bulk="none"]');
			var $others = $bulk.find('.asenha-template-db-bulk-checkbox').not('[data-bulk="none"]');
			var noneChecked = $none.length ? $none.is(':checked') : false;

			// Default: clear indeterminate.
			$bulk.find('.asenha-template-db-bulk-checkbox').each(function() {
				this.indeterminate = false;
			});

			// If "none" is checked, disable other bulk options.
			// Note: we do NOT auto-check "none" just because there are no excluded tables.
			if (noneChecked) {
				$others.prop('checked', false).prop('disabled', true);
				return;
			}

			$others.prop('disabled', false);

			var tables = $modal.data('dbTables') || [];
			if (!tables || !tables.length) {
				return;
			}

			var groups = this.getDbTableBulkGroups(tables);
			var excludedSet = {};
			for (var i = 0; i < excluded.length; i++) {
				var ek = String(excluded[i] || '');
				if (ek) {
					excludedSet[ek] = true;
				}
			}

			var updateOne = function(bulkKey, keys) {
				keys = keys || [];
				var total = keys.length;
				var selectedCount = 0;
				for (var j = 0; j < keys.length; j++) {
					if (excludedSet[String(keys[j] || '')]) {
						selectedCount++;
					}
				}

				var $cb = $bulk.find('.asenha-template-db-bulk-checkbox[data-bulk="' + bulkKey + '"]');
				if (!$cb.length) {
					return;
				}

				var isChecked = (total > 0 && selectedCount === total);
				var isIndeterminate = (selectedCount > 0 && selectedCount < total);
				$cb.prop('checked', isChecked);
				$cb[0].indeterminate = isIndeterminate;
			};

			updateOne('core', groups.core);
			updateOne('ase', groups.ase);
			updateOne('other', groups.other);
		},

		renderDbTablesHtml: function(tables, selected) {
			tables = tables || [];
			selected = selected || [];

			var esc = function(s) {
				return $('<div/>').text(String(s || '')).html();
			};

			if (!tables.length) {
				return '<p class="description">' + asenhaSbT('noTables') + '</p>';
			}

			var selectedSet = {};
			for (var i = 0; i < selected.length; i++) {
				selectedSet[String(selected[i])] = true;
			}

			var html = '<div class="asenha-db-table-list">';
			for (var j = 0; j < tables.length; j++) {
				var t = tables[j] || {};
				var key = t.key || '';
				var checked = !!selectedSet[String(key)];
				html += '<div class="asenha-db-table-item" data-table-key="' + esc(key) + '">';
				html += '<label><input type="checkbox" class="asenha-db-table-checkbox" data-table-key="' + esc(key) + '"' + (checked ? ' checked' : '') + ' /> ' + esc(key) + '</label>';
				html += '</div>';
			}
			html += '</div>';
			return html;
		},

		initWpContentTree: function(type) {
			var self = this;
			if (!(type === 'full' || type === 'files')) {
				$('#asenha-template-files-tree').empty();
				$('#asenha-template-files-summary').empty();
				return;
			}

			var $tree = $('#asenha-template-files-tree');
			if (!$tree.length) {
				return;
			}

			$tree.html('<p class="description">' + asenhaSbT('loading') + '</p>');

			this.loadWpContentChildren('', 0, function(result) {
				if (!result) {
					$tree.html('<p class="description">' + asenhaSbT('failedToLoadWpContent') + '</p>');
					return;
				}
				$tree.html(self.renderWpContentTreeHtml('', result.items || [], result.has_more, result.total, 0));
				self.updateWpContentSummary();
				self.syncTreeCheckboxes();
				self.autoExpandTreeForExcludedPaths();
			});
		},

		/**
		 * Auto-expand ancestor folders for any excluded wp-content paths in the modal.
		 *
		 * This makes excluded items visible on modal load while preserving lazy loading.
		 */
		autoExpandTreeForExcludedPaths: function() {
			var $modal = $('#asenha-template-modal');
			if (!$modal.length) {
				return;
			}

			var excludedPaths = $modal.data('excludedPaths') || [];
			excludedPaths = excludedPaths || [];
			if (!excludedPaths.length) {
				return;
			}

			var shouldExpand = {};
			var queue = [];

			var addExpandPath = function(relNoSlash) {
				relNoSlash = String(relNoSlash || '').replace(/\\/g, '/');
				relNoSlash = relNoSlash.replace(/^\/+/, '').replace(/\/+$/, '');
				if (!relNoSlash) {
					return;
				}
				if (shouldExpand[relNoSlash]) {
					return;
				}
				shouldExpand[relNoSlash] = true;
				queue.push(relNoSlash);
			};

			for (var i = 0; i < excludedPaths.length; i++) {
				var p = String(excludedPaths[i] || '').replace(/\\/g, '/');
				if (!p) {
					continue;
				}

				// If it's a file, expand its parent directory so the file is visible.
				if (p.slice(-1) !== '/') {
					var idx = p.lastIndexOf('/');
					if (idx > 0) {
						p = p.substring(0, idx + 1);
					} else {
						continue;
					}
				} else {
					// If it's an excluded folder, do NOT expand the folder itself. Expand only its ancestors.
					// Example: themes/hello-elementor/assets/ expands themes/ and themes/hello-elementor/, but not assets/.
					var folderNoSlash = p.replace(/\/+$/, '');
					var lastSlash = folderNoSlash.lastIndexOf('/');
					if (lastSlash > 0) {
						p = folderNoSlash.substring(0, lastSlash + 1);
					} else {
						// Top-level folder excluded: no ancestors to expand.
						continue;
					}
				}

				// Build ancestors: themes/hello/ -> themes, themes/hello
				p = p.replace(/^\/+/, '');
				var parts = p.split('/').filter(function(x) { return !!x; });
				var acc = [];
				for (var j = 0; j < parts.length; j++) {
					acc.push(parts[j]);
					addExpandPath(acc.join('/'));
				}
			}

			// Sort by depth so parents expand before children.
			queue.sort(function(a, b) {
				var da = a.split('/').length;
				var db = b.split('/').length;
				return da - db;
			});

			var self = this;
			var runNext = function(k) {
				if (k >= queue.length) {
					self.syncTreeCheckboxes();
					return;
				}
				self.ensureTreeDirExpanded(queue[k], function() {
					runNext(k + 1);
				});
			};

			runNext(0);
		},

		/**
		 * Ensure a directory node is expanded and its children are loaded.
		 *
		 * @param {string} relDir Path relative to wp-content, without trailing slash (e.g. 'themes/hello-elementor').
		 * @param {Function} done Callback.
		 */
		ensureTreeDirExpanded: function(relDir, done) {
			relDir = String(relDir || '').replace(/\\/g, '/').replace(/^\/+/, '').replace(/\/+$/, '');
			done = (typeof done === 'function') ? done : function() {};
			if (!relDir) {
				done();
				return;
			}

			var self = this;
			var $treeRoot = $('#asenha-template-files-tree');
			if (!$treeRoot.length) {
				done();
				return;
			}

			var findDirLi = function(dir) {
				var $found = $();
				$treeRoot.find('.asenha-tree-item').each(function() {
					var $li = $(this);
					if (String($li.data('type') || '') === 'dir' && String($li.data('rel') || '') === dir) {
						$found = $li;
						return false;
					}
				});
				return $found;
			};

			var $li = findDirLi(relDir);
			if (!$li.length) {
				// If not visible yet, expand its parent first.
				var idx = relDir.lastIndexOf('/');
				if (idx > 0) {
					var parent = relDir.substring(0, idx);
					self.ensureTreeDirExpanded(parent, function() {
						// Retry after parent expansion.
						self.ensureTreeDirExpanded(relDir, done);
					});
					return;
				}
				done();
				return;
			}

			var $children = $li.find('> .asenha-tree-children');
			var $btn = $li.find('> .asenha-tree-row .asenha-tree-toggle').first();
			if ($btn.length) {
				$btn.addClass('is-expanded').attr('aria-expanded', 'true');
			}

			if ($children.length && $children.data('loaded')) {
				$children.show();
				done();
				return;
			}

			if (!$children.length) {
				done();
				return;
			}

			$children.html('<p class="description">' + asenhaSbT('loading') + '</p>').show();
			this.loadWpContentChildren(relDir, 0, function(result) {
				if (!result) {
					$children.html('<p class="description">' + asenhaSbT('failedToLoad') + '</p>');
					done();
					return;
				}
				$children.data('loaded', true).html(self.renderWpContentTreeHtml(relDir, result.items || [], result.has_more, result.total, 0));
				self.syncTreeCheckboxes();
				done();
			});
		},

		loadWpContentChildren: function(path, offset, cb) {
			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_list_wp_content_children',
					nonce: asenhaSiteBackup.nonce,
					path: path || '',
					offset: offset || 0,
					limit: 200
				}
			}).done(function(resp) {
				if (!resp || !resp.success) {
					cb(null);
					return;
				}
				cb(resp.data);
			}).fail(function() {
				cb(null);
			});
		},

		renderWpContentTreeHtml: function(parentPath, items, hasMore, total, offset) {
			var esc = function(s) {
				return $('<div/>').text(String(s || '')).html();
			};
			var html = '<ul class="asenha-tree">';
			for (var i = 0; i < items.length; i++) {
				var it = items[i] || {};
				var rel = String(it.rel_path || '');
				var isDir = it.type === 'dir';
				var always = !!it.always_excluded;
				var reason = it.reason ? String(it.reason) : '';
				var label = esc(it.name || rel);
				var storedRel = rel;
				var storePath = isDir ? (storedRel + '/') : storedRel;

				html += '<li class="asenha-tree-item" data-rel="' + esc(rel) + '" data-type="' + (isDir ? 'dir' : 'file') + '">';
				html += '  <div class="asenha-tree-row">';
				html += isDir
					? '<button type="button" class="button-link asenha-tree-toggle" aria-label="' + esc(asenhaSbT('toggleFolderAriaLabel')) + '" aria-expanded="false"><span class="dashicons dashicons-arrow-right-alt2" aria-hidden="true"></span></button>'
					: '<span class="asenha-tree-spacer" aria-hidden="true"></span>';
				html += '    <label class="asenha-tree-label" title="' + esc(reason) + '">';
				html += '      <input type="checkbox" class="asenha-tree-checkbox" data-store-path="' + esc(storePath) + '"' + (always ? ' disabled' : '') + ' /> ';
				html += label;
				if (always) {
					html += ' <span class="description asenha-inline-description">(' + esc(reason || asenhaSbT('alwaysExcluded')) + ')</span>';
				}
				html += '    </label>';
				html += '  </div>';
				if (isDir) {
					html += '<div class="asenha-tree-children" style="display:none;"></div>';
				}
				html += '</li>';
			}
			if (hasMore) {
				html += '<li class="asenha-tree-more"><button type="button" class="button asenha-tree-load-more" data-parent="' + esc(parentPath) + '" data-offset="' + esc(offset + items.length) + '">' + esc(asenhaSbT('loadMore')) + '</button></li>';
			}
			html += '</ul>';

			// Bind events after render (scoped).
			setTimeout(function() {
				var $root = $('#asenha-template-files-tree');

				$root.off('click.asenhaTreeToggle').on('click.asenhaTreeToggle', '.asenha-tree-toggle', function(e) {
					e.preventDefault();
					var $btn = $(this);
					var $li = $btn.closest('.asenha-tree-item');
					var rel = $li.data('rel') || '';
					var $children = $li.find('> .asenha-tree-children');
					if ($children.is(':visible')) {
						$children.hide();
						$btn.removeClass('is-expanded').attr('aria-expanded', 'false');
						return;
					}
					$btn.addClass('is-expanded').attr('aria-expanded', 'true');
					if ($children.data('loaded')) {
						$children.show();
						return;
					}
					$children.html('<p class="description">' + asenhaSbT('loading') + '</p>').show();
					SiteBackup.loadWpContentChildren(rel, 0, function(result) {
						if (!result) {
							$children.html('<p class="description">' + asenhaSbT('failedToLoad') + '</p>');
							return;
						}
						$children.data('loaded', true).html(SiteBackup.renderWpContentTreeHtml(rel, result.items || [], result.has_more, result.total, 0));
						SiteBackup.syncTreeCheckboxes();
					});
				});

				$root.off('click.asenhaTreeMore').on('click.asenhaTreeMore', '.asenha-tree-load-more', function(e) {
					e.preventDefault();
					var $btn = $(this);
					var parent = String($btn.data('parent') || '');
					var nextOffset = parseInt($btn.data('offset') || 0, 10);
					$btn.prop('disabled', true).text(asenhaSbT('loading'));
					SiteBackup.loadWpContentChildren(parent, nextOffset, function(result) {
						if (!result) {
							$btn.prop('disabled', false).text(asenhaSbT('loadMore'));
							return;
						}
						var $moreLi = $btn.closest('.asenha-tree-more');
						var $ul = $moreLi.closest('ul.asenha-tree');
						$moreLi.remove();
						$ul.append($(SiteBackup.renderWpContentTreeHtml(parent, result.items || [], result.has_more, result.total, nextOffset)).children());
						SiteBackup.syncTreeCheckboxes();
					});
				});

				$root.off('change.asenhaTreeCheck').on('change.asenhaTreeCheck', '.asenha-tree-checkbox', function() {
					var $modal = $('#asenha-template-modal');
					var $treeRoot = $('#asenha-template-files-tree');
					var selected = $modal.data('excludedPaths') || [];
					var p = asenhaNormalizeTreePath(String($(this).data('store-path') || ''));
					var checked = $(this).is(':checked');
					selected = asenhaApplyTreeToggleSelection(selected, p, checked, $treeRoot, '.asenha-tree-checkbox');
					$modal.data('excludedPaths', selected);
					SiteBackup.updateWpContentSummary();
					SiteBackup.syncTreeCheckboxes();
				});
			}, 0);

			return html;
		},

		syncTreeCheckboxes: function() {
			var $modal = $('#asenha-template-modal');
			var selected = asenhaNormalizeTreeSelection($modal.data('excludedPaths') || []);
			$modal.data('excludedPaths', selected);
			var set = asenhaTreeSelectionToSet(selected);
			$('#asenha-template-files-tree .asenha-tree-checkbox').each(function() {
				var p = asenhaNormalizeTreePath(String($(this).data('store-path') || ''));
				if (p) {
					$(this).prop('checked', asenhaIsTreePathSelected(p, set));
				}
			});
		},

		updateWpContentSummary: function() {
			this.refreshTemplateModalExcludedSummaryDebounced();
		},

		/**
		 * Debounced scan to compute excluded descendant totals for the modal summary.
		 */
		refreshTemplateModalExcludedSummaryDebounced: function() {
			var self = this;
			var state = this.templateModalExcludedState || {};
			this.templateModalExcludedState = state;

			if (state.timer) {
				clearTimeout(state.timer);
			}

			state.timer = setTimeout(function() {
				self.refreshTemplateModalExcludedSummaryNow();
			}, 400);
		},

		refreshTemplateModalExcludedSummaryNow: function() {
			var $summary = $('#asenha-template-files-summary');
			if (!$summary.length) {
				return;
			}

			var type = $('input[name="asenha-template-type"]:checked').val() || 'full';
			if (!(type === 'full' || type === 'files')) {
				$summary.empty();
				return;
			}

			var state = this.templateModalExcludedState || {};
			this.templateModalExcludedState = state;

			state.token = (state.token || 0) + 1;
			var token = state.token;

			if (state.xhr && state.xhr.readyState !== 4) {
				try { state.xhr.abort(); } catch (e) {}
			}

			var calculating = asenhaSbT('calculating');
			var $modal = $('#asenha-template-modal');
			var pattern = String($modal.data('templatePattern') || 'exclude');
			var label = (pattern === 'include') ? asenhaSbT('templateIncluded') : asenhaSbT('templateExcluded');
			$summary.html('<p class="description">' + label + ': ' + calculating + '</p>');

			var excludedPaths = ($modal.data('excludedPaths') || []);

			state.xhr = $.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_scan_wp_content_for_templates',
					nonce: asenhaSiteBackup.nonce,
					templates: JSON.stringify([{
						id: '__modal__',
						type: type,
						pattern: pattern,
						excluded_wp_content_paths: excludedPaths
					}])
				}
			}).done(function(resp) {
				if (token !== state.token) {
					return;
				}
				if (!resp || !resp.success || !resp.data || !resp.data.by_template || !resp.data.by_template.__modal__) {
					$summary.html('<p class="description">' + label + ': ' + calculating + '</p>');
					return;
				}
				var scan = resp.data.by_template.__modal__;
				var dirs, files;
				if (pattern === 'include') {
					dirs = (typeof scan.included_dirs !== 'undefined') ? scan.included_dirs : 0;
					files = (typeof scan.included_files !== 'undefined') ? scan.included_files : 0;
				} else {
					dirs = (typeof scan.excluded_dirs !== 'undefined') ? scan.excluded_dirs : 0;
					files = (typeof scan.excluded_files !== 'undefined') ? scan.excluded_files : 0;
				}
				$summary.html('<p class="description">' + label + ': ' + SiteBackup.formatCountLabel(files, asenhaSbT('templateFilesCountSingle'), asenhaSbT('templateFilesCountPlural')) + '</p>');
			}).fail(function() {
				if (token !== state.token) {
					return;
				}
				$summary.html('<p class="description">' + label + ': ' + calculating + '</p>');
			});
		},

		saveTemplateFromModal: function() {
			var self = this;
			var id = String($('#asenha-template-id').val() || '');
			var title = String($('#asenha-template-title').val() || '').trim();
			var type = $('input[name="asenha-template-type"]:checked').val() || 'full';
			var pattern = $('input[name="asenha-template-pattern"]:checked').val() || 'exclude';

			if (!title) {
				this.showNotice('error', asenhaSbT('templateTitleRequired'));
				return;
			}

			var $modal = $('#asenha-template-modal');
			var $saveButton = $('#asenha-template-save');
			var keepOpenAfterEditSave = !!$modal.data('stayOpenAfterEditSave');
			$modal.data('templatePattern', String(pattern));
			var excludedTables = $modal.data('excludedTables') || [];
			var excludedPaths = $modal.data('excludedPaths') || [];
			this.clearTemplateModalSaveStatus();
			$saveButton.prop('disabled', true).addClass('is-busy');

			var action = id ? 'asenha_update_backup_template' : 'asenha_create_backup_template';
			var data = {
				action: action,
				nonce: asenhaSiteBackup.nonce,
				title: title,
				type: type,
				pattern: String(pattern),
				excluded_tables: excludedTables,
				excluded_wp_content_paths: excludedPaths
			};
			if (id) {
				data.template_id = id;
			}

			$.ajax({
				url: asenhaSiteBackup.ajaxUrl,
				type: 'POST',
				data: data
			}).done(function(resp) {
				if (resp && resp.success) {
					var savedTpl = (resp && resp.data && resp.data.template) ? resp.data.template : null;
					self.upsertTemplateCaches(savedTpl);

					if (!id || !keepOpenAfterEditSave) {
						$('#asenha-template-modal').hide();
						self.clearTemplateModalSaveStatus();
					} else {
						self.setTemplateModalSaveStatus(
							asenhaSbT('templateSaved') || asenhaSbT('saved') || 'Saved.',
							'success'
						);
					}

					self.refreshTemplatesList();

					var savedTemplateId = (savedTpl && savedTpl.id) ? String(savedTpl.id) : '';
					var wasCreate = !id;

					// If picker is open, refresh it for the pending backup type.
					if ($('#asenha-backup-template-picker').is(':visible') && self.pendingBackupType) {
						var selectedId = '';
						var $select = $('#asenha-template-picker-select');
						if ($select.length) {
							selectedId = String($select.val() || '');
						}
						self.showTemplatePicker(self.pendingBackupType, { selectedTemplateId: (wasCreate && savedTemplateId) ? savedTemplateId : selectedId });
					}
					// If transfer template picker is open, refresh it while preserving selection.
					if ($('#asenha-transfer-template-picker').is(':visible')) {
						var selectedTransferId = '';
						var $transferSelect = $('#asenha-transfer-template-picker-select');
						if ($transferSelect.length) {
							selectedTransferId = String($transferSelect.val() || '');
						}
						self.showTransferTemplatePicker({ selectedTemplateId: (wasCreate && savedTemplateId) ? savedTemplateId : selectedTransferId });
					}

					// If policy modal is open, refresh its template picker/link state.
					if ($('#asenha-policy-modal').is(':visible')) {
						var policyType = String($('#asenha-policy-type').val() || 'full');
						if (['full', 'database', 'files'].indexOf(policyType) === -1) {
							policyType = 'full';
						}
						var selectedPolicyId = String($('#asenha-policy-template').val() || '');
						delete self.policyTemplatesByType[policyType];
						self.populatePolicyTemplateSelect(
							policyType,
							(wasCreate && savedTemplateId) ? savedTemplateId : selectedPolicyId
						);
					}
				} else {
					var saveError = (resp && resp.data && resp.data.message) ? resp.data.message : asenhaSbT('failedToSaveTemplate');
					self.setTemplateModalSaveStatus(saveError, 'error');
					self.showNotice('error', saveError);
				}
				$saveButton.prop('disabled', false).removeClass('is-busy');
			}).fail(function() {
				self.setTemplateModalSaveStatus(asenhaSbT('failedToSaveTemplate'), 'error');
				self.showNotice('error', asenhaSbT('failedToSaveTemplate'));
				$saveButton.prop('disabled', false).removeClass('is-busy');
			});
		},

		/**
		 * Show toast notification
		 *
		 * Displays a non-intrusive toast notification in the bottom-right corner
		 * that slides in and auto-dismisses without scrolling the page.
		 *
		 * @param {string} type     Notice type (success, error, info, warning).
		 * @param {string} message  Notice message.
		 * @param {number} duration Optional. Auto-dismiss duration in milliseconds. Default 5000.
		 */
		showNotice: function(type, message, duration) {
			// Create toast container if it doesn't exist
			var $container = $('#asenha-toast-container');
			if (!$container.length) {
				$container = $('<div id="asenha-toast-container"></div>');
				$('body').append($container);
			}

			// Create toast element with icon
			var iconMap = {
				success: '✓',
				error: '✕',
				warning: '⚠',
				info: 'ℹ'
			};

			var $toast = $('<div class="asenha-toast asenha-toast-' + type + '">' +
				'<span class="asenha-toast-icon">' + (iconMap[type] || 'ℹ') + '</span>' +
				'<span class="asenha-toast-message">' + message + '</span>' +
				'<button class="asenha-toast-close" type="button" aria-label="' + this.escapeAttr(asenhaSbT('dismiss')) + '">×</button>' +
				'</div>');

			$container.append($toast);

			// Trigger slide-in animation after a brief delay for CSS transition
			setTimeout(function() {
				$toast.addClass('asenha-toast-visible');
			}, 10);

			// Auto dismiss after specified duration (default 5 seconds)
			var dismissDuration = duration || 5000;
			var dismissTimeout = setTimeout(function() {
				dismissToast($toast);
			}, dismissDuration);

			// Manual dismiss on close button click
			$toast.find('.asenha-toast-close').on('click', function() {
				clearTimeout(dismissTimeout);
				dismissToast($toast);
			});

			/**
			 * Dismiss toast with slide-out animation
			 *
			 * @param {jQuery} $el Toast element to dismiss.
			 */
			function dismissToast($el) {
				$el.removeClass('asenha-toast-visible');
				setTimeout(function() {
					$el.remove();
				}, 300);
			}
		}
	};

	// =========================================================================
	// Sync Tab Module
	// =========================================================================

	var SiteSync = {
		syncId: null,
		progressInterval: null,
		remoteSession: null,
		autoConnectPasteTimer: null,
		sourceInventory: null,
		sourceInventoryState: 'idle',
		inventoryRequest: null,
		startTime: null,
		lastProgressPct: 0,
		heartbeatSuspended: false,
		preserveDefaultsMode: null,
		registerMediaDefaultApplied: false,
		// Scoped-media soft defaults: tracks whether auto-check of the Media Library
		// component and auto-select of the "used_by_posts" media mode have already
		// been applied (and whether the user has since manually overridden them).
		mediaComponentAutoApplied: false,
		mediaComponentUserTouched: false,
		mediaModeAutoApplied: false,
		mediaModeUserTouched: false,
		// Scoped-term soft defaults: tracks whether auto-check of the four term
		// tables (terms, termmeta, term_taxonomy, term_relationships) has already
		// been applied for this session and whether the user has since manually
		// toggled any of them. Auto-application only runs once; user edits stick.
		termTablesAutoApplied: false,
		termTablesUserTouched: false,
		// Scoped-cfgroup soft defaults: tracks whether auto-check of the two
		// Custom Field Groups tables (asenha_cfgroup_values and
		// asenha_cfgroup_values_for_terms) has already been applied for this
		// session and whether the user has since manually toggled any of them.
		// Auto-application only runs once; user edits stick.
		cfgroupTablesAutoApplied: false,
		cfgroupTablesUserTouched: false,
		// Taxonomies-mode soft default: tracks whether the taxonomies dropdown
		// has been auto-switched from 'all' to 'selected' for this session and
		// whether the user has since manually changed it. Auto-application
		// only runs once per qualifying re-entry; user edits stick.
		taxonomiesModeAutoApplied: false,
		taxonomiesModeUserTouched: false,
		otherWpContentSelectedPaths: [],
		otherWpContentTreeDirection: '',
		otherWpContentTreeLoading: false,
		otherWpContentTreeRequest: null,

		init: function() {
			this.bindEvents();
			this.applyDirectionAvailability();
			this.syncOptionVisibility();
			this.renderRemoteSummary(null);
			this.setLocalConnectionInfoVisibility(true);
			this.setConnectHelperDescriptionVisibility(true);
		},

		bindEvents: function() {
			var self = this;

			// Copy connection info.
			$('#asenha-sync-copy-connection-info').on('click', function() {
				var textarea = document.getElementById('asenha-sync-local-connection-info');
				if (textarea) {
					textarea.select();
					document.execCommand('copy');
					var $btn = $(this);
					var orig = $btn.text();
					$btn.text(asenhaSiteBackup.strings.syncCopied || 'Copied!');
					setTimeout(function() { $btn.text(orig); }, 2000);
				}
			});

			// Regenerate key.
			$('#asenha-sync-regenerate-key').on('click', function() {
				if (!confirm(asenhaSiteBackup.strings.syncRegenerateConfirm || 'Regenerate the secret key? Existing connections will stop working.')) {
					return;
				}
				var $btn = $(this);
				$btn.prop('disabled', true);

				$.post(ajaxurl, {
					action: 'asenha_sync_regenerate_key',
					_nonce: asenhaSiteBackup.nonce
				}, function(response) {
					$btn.prop('disabled', false);
					if (response.success && response.data.connection_info) {
						$('#asenha-sync-local-connection-info').val(response.data.connection_info);
					}
				}).fail(function() {
					$btn.prop('disabled', false);
				});
			});

			// Save permissions.
			$('#asenha-sync-save-permissions').on('click', function() {
				var $btn = $(this);
				$btn.prop('disabled', true);

				$.post(ajaxurl, {
					action: 'asenha_sync_save_permissions',
					_nonce: asenhaSiteBackup.nonce,
					allow_pull: $('#asenha-sync-allow-pull').is(':checked') ? '1' : '0',
					allow_push: $('#asenha-sync-allow-push').is(':checked') ? '1' : '0'
				}, function(response) {
					$btn.prop('disabled', false);
					if (response.success) {
						var orig = $btn.text();
						$btn.text(asenhaSiteBackup.strings.syncSaved || 'Saved!');
						setTimeout(function() { $btn.text(orig); }, 2000);
					}
				}).fail(function() {
					$btn.prop('disabled', false);
				});
			});

			// Connect to remote.
			$('#asenha-sync-connect').on('click', function() {
				self.connectToRemote();
			});
			$('#asenha-sync-remote-connection-info').on('paste', function() {
				if (self.autoConnectPasteTimer) {
					clearTimeout(self.autoConnectPasteTimer);
				}
				self.autoConnectPasteTimer = setTimeout(function() {
					self.autoConnectPasteTimer = null;
					self.connectToRemote({ showEmptyAlert: false });
				}, 50);
			});

			// Disconnect.
			$('#asenha-sync-disconnect').on('click', function() {
				self.disconnect();
			});

			// Toggle sub-options for sync components.
			$('#asenha-sync-database').on('change', function() {
				self.syncOptionVisibility();
			});
			$('#asenha-sync-media').on('change', function() {
				if (!$(this).is(':disabled')) {
					self.mediaComponentUserTouched = true;
				}
				self.syncOptionVisibility();
			});
			$('#asenha-sync-media-mode').on('change', function() {
				if (!$(this).is(':disabled')) {
					self.mediaModeUserTouched = true;
				}
				self.syncOptionVisibility();
			});
			$('#asenha-sync-register-media-attachments').on('change', function() {
				if (!$(this).is(':disabled')) {
					self.registerMediaDefaultApplied = true;
				}
				self.syncOptionVisibility();
			});
			$('#asenha-sync-themes').on('change', function() {
				self.syncOptionVisibility();
			});
			$('#asenha-sync-plugins').on('change', function() {
				self.syncOptionVisibility();
			});
			$('#asenha-sync-other-wp-content').on('change', function() {
				self.syncOptionVisibility();
			});

			// Toggle source-specific selector panes.
			$('select[name="asenha_sync_db_tables"]').on('change', function() {
				self.syncOptionVisibility();
			});
			$('select[name="asenha_sync_themes_filter"]').on('change', function() {
				self.syncOptionVisibility();
			});
			$('select[name="asenha_sync_plugins_filter"]').on('change', function() {
				self.syncOptionVisibility();
			});
			$('select[name="asenha_sync_post_types_filter"]').on('change', function() {
				self.syncOptionVisibility();
			});
			$('select[name="asenha_sync_asenha_cpt_definitions_filter"]').on('change', function() {
				self.syncOptionVisibility();
			});
			$('select[name="asenha_sync_asenha_ctax_definitions_filter"]').on('change', function() {
				self.syncOptionVisibility();
			});
			$('select[name="asenha_sync_asenha_cfgroup_definitions_filter"]').on('change', function() {
				self.syncOptionVisibility();
			});
			$(document).on('change', '#asenha-sync-asenha-cfgroup-definitions-selector .asenha-sync-asenha-cfgroup-def-checkbox', function() {
				self.syncOptionVisibility();
			});
			$('select[name="asenha_sync_taxonomies_filter"]').on('change', function(e) {
				if (e && e.originalEvent) {
					self.taxonomiesModeUserTouched = true;
				}
				self.syncOptionVisibility();
			});
			$('select[name="asenha_sync_other_wp_content_filter"]').on('change', function() {
				self.syncOptionVisibility();
			});
			$(document).on('change', '#asenha-sync-post-type-selector .asenha-sync-post-type-checkbox', function() {
				self.updateSyncPostTypeColumnToggleLabels();
				self.mirrorAseCptDefinitionSelections('post-type-selector');
				self.syncOptionVisibility();
			});
			$(document).on('change', '#asenha-sync-asenha-cpt-definitions-selector .asenha-sync-asenha-cpt-def-checkbox', function() {
				self.mirrorAseCptDefinitionSelections('asenha-cpt-def-selector');
				self.syncOptionVisibility();
			});
			$(document).on('change', '#asenha-sync-table-selector .asenha-sync-table-checkbox', function(e) {
				if (e && e.originalEvent) {
					self.markTermTablesUserTouched($(this));
					self.markCfgroupTablesUserTouched($(this));
				}
				self.updateSyncTableColumnToggleLabels();
				self.syncOptionVisibility();
			});
			$(document).on('change', '#asenha-sync-taxonomy-selector .asenha-sync-taxonomy-checkbox', function() {
				self.mirrorAseCtaxDefinitionSelections('taxonomy-selector');
				self.syncOptionVisibility();
			});
			$(document).on('change', '#asenha-sync-asenha-ctax-definitions-selector .asenha-sync-asenha-ctax-def-checkbox', function() {
				self.mirrorAseCtaxDefinitionSelections('asenha-ctax-def-selector');
				self.syncOptionVisibility();
			});
			$(document).on('click', '#asenha-sync-table-selector .asenha-sync-table-column-toggle', function(e) {
				e.preventDefault();
				var $toggle = $(this);
				if ($toggle.is(':disabled')) {
					return;
				}

				var $column = $toggle.closest('.asenha-sync-selection-column');
				var $checkboxes = $column.find('.asenha-sync-table-checkbox');
				if (!$checkboxes.length) {
					return;
				}

				var allSelected = $checkboxes.filter(':checked').length === $checkboxes.length;
				$checkboxes.prop('checked', !allSelected);
				self.updateSyncTableColumnToggleLabels();
				self.syncOptionVisibility();
			});
			$(document).on('click', '#asenha-sync-post-type-selector .asenha-sync-post-type-column-toggle', function(e) {
				e.preventDefault();
				var $toggle = $(this);
				if ($toggle.is(':disabled')) {
					return;
				}

				// Prefer the nearest subcolumn wrapper (e.g. supplemental vs ASE custom content types)
				// so each subgroup's toggle only affects its own checkboxes. Fall back to the full
				// column when no subcolumn wrapper is present (content, core columns).
				var $scope = $toggle.closest('.asenha-sync-selection-subcolumn');
				if (!$scope.length) {
					$scope = $toggle.closest('.asenha-sync-selection-column');
				}
				var $checkboxes = $scope.find('.asenha-sync-post-type-checkbox');
				if (!$checkboxes.length) {
					return;
				}

				var allSelected = $checkboxes.filter(':checked').length === $checkboxes.length;
				$checkboxes.prop('checked', !allSelected);
				self.updateSyncPostTypeColumnToggleLabels();
				self.mirrorAseCptDefinitionSelections('post-type-selector');
				self.syncOptionVisibility();
			});
			$('input[name="asenha_sync_direction"]').on('change', function() {
				self.resetOtherWpContentTree();
				self.loadSourceInventory();
			});

			// Toggle sync collapsible sections.
			var bindSyncSectionToggle = function(toggleSelector, sectionSelector) {
				$(toggleSelector).on('click', function(e) {
					e.preventDefault();
					$(sectionSelector).slideToggle(200);
				});
			};
			bindSyncSectionToggle('#asenha-sync-toggle-find-replace', '#asenha-sync-find-replace-options');
			bindSyncSectionToggle('#asenha-sync-toggle-preserve-options', '#asenha-sync-preserve-options-content');
			bindSyncSectionToggle('#asenha-sync-toggle-exclusions', '#asenha-sync-exclusions-options');
			bindSyncSectionToggle('#asenha-sync-toggle-advanced', '#asenha-sync-advanced-options');
			bindSyncSectionToggle('#asenha-backup-toggle-advanced', '#asenha-backup-advanced-options');

			// Start sync.
			$('#asenha-sync-start').on('click', function() {
				self.startSync();
			});

			// Cancel sync.
			$('#asenha-sync-cancel').on('click', function() {
				self.cancelSync();
			});

			self.syncOptionVisibility();
		},

		connectToRemote: function(options) {
			var self = this;
			var args = options || {};
			var showEmptyAlert = ('showEmptyAlert' in args) ? !!args.showEmptyAlert : true;
			var connectionInfo = $('#asenha-sync-remote-connection-info').val().trim();
			var $btn = $('#asenha-sync-connect');
			var $spinner = $('#asenha-sync-connect-spinner');

			if (self.remoteSession) {
				return;
			}

			if ($btn.prop('disabled') || $spinner.hasClass('is-active')) {
				return;
			}

			if (!connectionInfo) {
				if (showEmptyAlert) {
					alert(asenhaSiteBackup.strings.syncEnterConnectionInfo || 'Please paste the connection info from the remote site.');
				}
				return;
			}

			$btn.prop('disabled', true);
			$spinner.addClass('is-active');

			$.post(ajaxurl, {
				action: 'asenha_sync_connect',
				_nonce: asenhaSiteBackup.nonce,
				connection_info: connectionInfo
			}, function(response) {
				$btn.prop('disabled', false);
				$spinner.removeClass('is-active');

				if (response.success && response.data.site_info) {
					var info = response.data.site_info;
					self.remoteSession = response.data;
					self.sourceInventory = null;
					self.sourceInventoryState = 'idle';
					self.resetOtherWpContentTree();

					self.renderRemoteSummary(info);
					self.applyDirectionAvailability();

					$('#asenha-sync-remote-connect-actions').hide();
					$('#asenha-sync-remote-info').slideDown(200);
					$('#asenha-sync-operation-section').slideDown(200);
					self.setLocalConnectionInfoVisibility(false);
					self.setConnectHelperDescriptionVisibility(false);
					self.syncOptionVisibility();
					self.loadSourceInventory();
					setTimeout(function() {
						self.scrollToConnectSection();
					}, 220);

					// Build auto find/replace pairs display.
					self.buildAutoReplacePairs(info);
				} else {
					var msg = (response.data && response.data.message) ? response.data.message : (asenhaSiteBackup.strings.syncConnectionFailed || 'Connection failed.');
					alert(msg);
				}
			}).fail(function(xhr) {
				$btn.prop('disabled', false);
				$spinner.removeClass('is-active');
				alert(asenhaSiteBackup.strings.syncConnectionFailed || 'Connection failed. Please check the connection info and try again.');
			});
		},

		disconnect: function() {
			var self = this;

			$.post(ajaxurl, {
				action: 'asenha_sync_disconnect',
				_nonce: asenhaSiteBackup.nonce
			});

			self.remoteSession = null;
			self.sourceInventory = null;
			self.sourceInventoryState = 'idle';
			self.resetOtherWpContentTree();
			if (self.inventoryRequest && typeof self.inventoryRequest.abort === 'function') {
				self.inventoryRequest.abort();
			}
			self.inventoryRequest = null;
			self.applyDirectionAvailability();
			$('#asenha-sync-remote-info').slideUp(200);
			$('#asenha-sync-remote-connect-actions').show();
			self.setLocalConnectionInfoVisibility(true);
			self.setConnectHelperDescriptionVisibility(true);
			$('#asenha-sync-connect').prop('disabled', false);
			$('#asenha-sync-connect-spinner').removeClass('is-active');
			$('#asenha-sync-operation-section').slideUp(200);
			$('#asenha-sync-remote-connection-info').val('');
			self.renderRemoteSummary(null);
			$('#asenha-sync-replace-pairs').empty();
		},

		setLocalConnectionInfoVisibility: function(visible) {
			var shouldShow = !!visible;
			$('.asenha-sync-connection-section').toggle(shouldShow);
		},

		setConnectHelperDescriptionVisibility: function(visible) {
			var shouldShow = !!visible;
			$('#asenha-sync-connect-helper-description').toggle(shouldShow);
		},

		scrollToConnectSection: function() {
			var $connectSection = $('.asenha-sync-remote-section').first();
			if (!$connectSection.length) {
				return;
			}
			$('html, body').stop(true).animate({
				scrollTop: Math.max(0, $connectSection.offset().top - 50)
			}, 400);
		},

		buildAutoReplacePairs: function(remoteInfo) {
			var $container = $('#asenha-sync-replace-pairs');
			$container.empty();

			var localUrl = asenhaSiteBackup.siteUrl || '';
			var remoteUrl = remoteInfo.site_url || '';

			if (localUrl && remoteUrl && localUrl !== remoteUrl) {
				$container.append(this.createReplacePairRow(remoteUrl, localUrl, true));
			}

			var localPath = asenhaSiteBackup.abspath || '';
			var remotePath = remoteInfo.abspath || '';
			if (localPath && remotePath && localPath !== remotePath) {
				$container.append(this.createReplacePairRow(remotePath, localPath, true));
			}
		},

		createReplacePairRow: function(search, replace, isAuto) {
			var autoClass = isAuto ? ' asenha-sync-auto-pair' : '';
			var readonlyAttr = isAuto ? ' readonly' : '';
			var removeBtn = isAuto ? '' : '<button type="button" class="button asenha-sync-remove-pair">&times;</button>';

			var $row = $('<div class="asenha-sync-replace-pair' + autoClass + '">' +
				'<input type="text" class="asenha-sync-search" value="' + this.escHtml(search) + '" placeholder="' + (asenhaSiteBackup.strings.syncSearch || 'Search') + '"' + readonlyAttr + ' />' +
				'<span class="asenha-sync-replace-arrow">&rarr;</span>' +
				'<input type="text" class="asenha-sync-replace" value="' + this.escHtml(replace) + '" placeholder="' + (asenhaSiteBackup.strings.syncReplace || 'Replace') + '"' + readonlyAttr + ' />' +
				removeBtn +
			'</div>');

			$row.find('.asenha-sync-remove-pair').on('click', function() {
				$row.remove();
			});

			return $row;
		},

		escHtml: function(str) {
			var div = document.createElement('div');
			div.appendChild(document.createTextNode(str));
			return div.innerHTML;
		},

		escAttr: function(str) {
			return this.escHtml(str).replace(/"/g, '&quot;');
		},

		getSelectedValues: function(selector) {
			var values = [];
			$(selector + ':checked').each(function() {
				var value = String($(this).val() || '');
				if (value) {
					values.push(value);
				}
			});

			return values;
		},

		tableMatchesPosts: function(tableKey) {
			tableKey = String(tableKey || '');
			return tableKey === 'posts' || /_posts$/.test(tableKey);
		},

		tableMatchesOptions: function(tableKey) {
			tableKey = String(tableKey || '').toLowerCase();
			return tableKey === 'options' || /_options$/.test(tableKey);
		},

		tableMatchesPostmeta: function(tableKey) {
			tableKey = String(tableKey || '');
			return tableKey === 'postmeta' || /_postmeta$/.test(tableKey);
		},

		/**
		 * Whether a selected-table key refers to the asenha_cfgroup_values table.
		 *
		 * Accepts either the short key ('asenha_cfgroup_values') or a prefixed
		 * full name ('<dbPrefix>asenha_cfgroup_values' /
		 * '<dbBasePrefix>asenha_cfgroup_values').
		 *
		 * @param {string} tableKey Raw checkbox value.
		 * @return {boolean}
		 */
		tableMatchesCfgroupValues: function(tableKey) {
			return this.tableMatchesShortName(tableKey, 'asenha_cfgroup_values');
		},

		/**
		 * Whether a selected-table key refers to the asenha_cfgroup_values_for_terms
		 * table.
		 *
		 * @param {string} tableKey Raw checkbox value.
		 * @return {boolean}
		 */
		tableMatchesCfgroupValuesForTerms: function(tableKey) {
			return this.tableMatchesShortName(tableKey, 'asenha_cfgroup_values_for_terms');
		},

		/**
		 * Whether a selected-table key refers to one of the four term-related tables.
		 *
		 * Accepts either the short key (e.g. 'terms', 'termmeta', 'term_taxonomy',
		 * 'term_relationships') or a prefix-qualified variant (e.g. 'wp_terms').
		 *
		 * @param {string} tableKey Raw checkbox value.
		 * @param {string} shortName One of 'terms', 'termmeta', 'term_taxonomy', 'term_relationships'.
		 * @return {boolean}
		 */
		tableMatchesShortName: function(tableKey, shortName) {
			tableKey = String(tableKey || '');
			shortName = String(shortName || '');
			if (!tableKey || !shortName) {
				return false;
			}
			if (tableKey === shortName) {
				return true;
			}
			// Prefix-aware exact matching. The checkbox "value" for a WP core
			// table is already the prefix-stripped short name (see
			// normalize_sync_db_inventory() in class-site-backup-admin.php), so
			// we only need to accept "<dbPrefix><shortName>" or
			// "<dbBasePrefix><shortName>" as fallbacks for callers that pass in
			// a full table name. Avoids matching unrelated tables such as
			// asenha_cfgroup_values_for_terms when looking for the core "terms".
			var prefix = (asenhaSiteBackup && asenhaSiteBackup.dbPrefix) ? String(asenhaSiteBackup.dbPrefix) : '';
			var basePrefix = (asenhaSiteBackup && asenhaSiteBackup.dbBasePrefix) ? String(asenhaSiteBackup.dbBasePrefix) : '';
			if (prefix && tableKey === prefix + shortName) {
				return true;
			}
			if (basePrefix && basePrefix !== prefix && tableKey === basePrefix + shortName) {
				return true;
			}
			return false;
		},

		/**
		 * Mark term-table checkboxes as user-touched if a user event modified one.
		 *
		 * Called from the #asenha-sync-table-selector change handler. Once any of
		 * the four term tables is manually toggled, the soft auto-application is
		 * locked out for the remainder of the session.
		 *
		 * @param {jQuery} $checkbox The checkbox element whose change fired.
		 */
		markTermTablesUserTouched: function($checkbox) {
			if (!$checkbox || !$checkbox.length) {
				return;
			}
			var value = String($checkbox.val() || '');
			var names = ['terms', 'termmeta', 'term_taxonomy', 'term_relationships'];
			for (var i = 0; i < names.length; i++) {
				if (this.tableMatchesShortName(value, names[i])) {
					this.termTablesUserTouched = true;
					return;
				}
			}
		},

		/**
		 * Soft auto-check the four term tables (terms, termmeta, term_taxonomy,
		 * term_relationships) when the post-types filter narrows the sync.
		 *
		 * Mirrors the scoped-media component soft default: only runs once per
		 * session, respects the user-touched flag, and never overrides an
		 * explicit user selection. Releases the auto-applied state when the
		 * prerequisites no longer hold so a subsequent re-entry can re-apply.
		 *
		 * @param {Object} ctx Context from syncOptionVisibility().
		 */
		applyScopedTermTableAutoLinks: function(ctx) {
			ctx = ctx || {};
			var syncDb = !!ctx.syncDb;
			var dbMode = ctx.dbMode || 'all';
			var postTypesMode = ctx.postTypesMode || 'all';
			var postsInScope = !!ctx.postsInScope;

			var wantsAutoCheck = syncDb && dbMode === 'selected' && postsInScope && (postTypesMode === 'selected' || postTypesMode === 'except');

			if (!wantsAutoCheck) {
				// Release the auto-applied state so the soft default can re-apply
				// later when the prerequisites hold again (mirrors the scoped-media
				// component/mode auto-apply release pattern).
				if (this.termTablesAutoApplied) {
					this.termTablesAutoApplied = false;
				}
				return;
			}

			if (this.termTablesAutoApplied || this.termTablesUserTouched) {
				return;
			}

			var self = this;
			var shortNames = ['terms', 'termmeta', 'term_taxonomy', 'term_relationships'];
			var applied = false;

			$.each(shortNames, function(idx, shortName) {
				var $matches = $('#asenha-sync-table-selector .asenha-sync-table-checkbox').filter(function() {
					return self.tableMatchesShortName(this.value, shortName);
				});
				if ($matches.length && !$matches.filter(':checked').length) {
					$matches.prop('checked', true);
					applied = true;
				}
			});

			if (applied) {
				this.termTablesAutoApplied = true;
				this.updateSyncTableColumnToggleLabels();
			}
		},

		/**
		 * Whether the Custom Field Groups post type (asenha_cfgroup) is in
		 * scope under the current post-types filter.
		 *
		 * Mirrors isAttachmentPostTypeInScope() logic.
		 *
		 * @param {string} postTypesMode One of 'all', 'selected', 'except'.
		 * @return {boolean}
		 */
		isCfgroupPostTypeInScope: function(postTypesMode) {
			if (postTypesMode === 'all') {
				return true;
			}

			var selectedPostTypes = this.getSelectedValues('#asenha-sync-post-type-selector .asenha-sync-post-type-checkbox');
			if (postTypesMode === 'selected') {
				return selectedPostTypes.indexOf('asenha_cfgroup') !== -1;
			}

			if (postTypesMode === 'except') {
				return selectedPostTypes.indexOf('asenha_cfgroup') === -1;
			}

			return true;
		},

		/**
		 * Mark cfgroup-table checkboxes as user-touched if a user event
		 * modified one. Once any of the two cfgroup tables is manually toggled,
		 * the soft auto-application is locked out for the remainder of the
		 * session.
		 *
		 * @param {jQuery} $checkbox The checkbox element whose change fired.
		 */
		markCfgroupTablesUserTouched: function($checkbox) {
			if (!$checkbox || !$checkbox.length) {
				return;
			}
			var value = String($checkbox.val() || '');
			if (this.tableMatchesCfgroupValues(value) || this.tableMatchesCfgroupValuesForTerms(value)) {
				this.cfgroupTablesUserTouched = true;
			}
		},

		/**
		 * Soft auto-check the two Custom Field Groups tables
		 * (asenha_cfgroup_values, asenha_cfgroup_values_for_terms) when the
		 * asenha_cfgroup post type is in scope under the current post-types
		 * filter.
		 *
		 * Mirrors the scoped-term soft default: runs once per qualifying
		 * session re-entry, respects the user-touched flag, and releases the
		 * auto-applied state when the prerequisites no longer hold so a
		 * subsequent re-entry can re-apply.
		 *
		 * @param {Object} ctx Context from syncOptionVisibility().
		 */
		applyScopedCfgroupTableAutoLinks: function(ctx) {
			ctx = ctx || {};
			var syncDb = !!ctx.syncDb;
			var dbMode = ctx.dbMode || 'all';
			var postTypesMode = ctx.postTypesMode || 'all';
			var postsInScope = !!ctx.postsInScope;

			var wantsAutoCheck = syncDb
				&& dbMode === 'selected'
				&& postsInScope
				&& (postTypesMode === 'selected' || postTypesMode === 'except')
				&& this.isCfgroupPostTypeInScope(postTypesMode);

			if (!wantsAutoCheck) {
				// Release the auto-applied state so the soft default can
				// re-apply later when the prerequisites hold again (mirrors
				// the scoped-term soft-default release pattern).
				if (this.cfgroupTablesAutoApplied) {
					this.cfgroupTablesAutoApplied = false;
				}
				return;
			}

			if (this.cfgroupTablesAutoApplied || this.cfgroupTablesUserTouched) {
				return;
			}

			var self = this;
			var matchers = [
				function(tableKey) { return self.tableMatchesCfgroupValues(tableKey); },
				function(tableKey) { return self.tableMatchesCfgroupValuesForTerms(tableKey); }
			];
			var applied = false;

			$.each(matchers, function(idx, matcher) {
				var $matches = $('#asenha-sync-table-selector .asenha-sync-table-checkbox').filter(function() {
					return matcher(this.value);
				});
				if ($matches.length && !$matches.filter(':checked').length) {
					$matches.prop('checked', true);
					applied = true;
				}
			});

			if (applied) {
				this.cfgroupTablesAutoApplied = true;
				this.updateSyncTableColumnToggleLabels();
			}
		},

		/**
		 * Soft-default the Taxonomies mode dropdown to 'selected' whenever the
		 * taxonomies section becomes visible (i.e. scoped-post-type DB sync is
		 * active). Mirrors the termTables soft-default: respects any prior
		 * user override, and releases the auto-applied flag once prerequisites
		 * stop holding so a later re-entry can reapply the default.
		 *
		 * @param {Object} ctx Context from syncOptionVisibility().
		 */
		applyTaxonomiesModeDefault: function(ctx) {
			ctx = ctx || {};
			var showTaxonomiesOptions = !!ctx.showTaxonomiesOptions;

			if (!showTaxonomiesOptions) {
				if (this.taxonomiesModeAutoApplied) {
					this.taxonomiesModeAutoApplied = false;
				}
				return;
			}

			if (this.taxonomiesModeAutoApplied || this.taxonomiesModeUserTouched) {
				return;
			}

			var $mode = $('select[name="asenha_sync_taxonomies_filter"]');
			if ($mode.length && $mode.val() === 'all') {
				$mode.val('selected');
				this.taxonomiesModeAutoApplied = true;
			}
		},

		isPostsTableInScope: function(syncDb, dbMode) {
			if (!syncDb) {
				return false;
			}

			if (dbMode === 'all') {
				return true;
			}

			var selectedTables = this.getSelectedValues('#asenha-sync-table-selector .asenha-sync-table-checkbox');
			for (var i = 0; i < selectedTables.length; i++) {
				if (this.tableMatchesPosts(selectedTables[i])) {
					return true;
				}
			}

			return false;
		},

		isOptionsTableInScope: function(syncDb, dbMode) {
			if (!syncDb) {
				return false;
			}

			if (dbMode === 'all') {
				return true;
			}

			var selectedTables = this.getSelectedValues('#asenha-sync-table-selector .asenha-sync-table-checkbox');
			for (var i = 0; i < selectedTables.length; i++) {
				if (this.tableMatchesOptions(selectedTables[i])) {
					return true;
				}
			}

			return false;
		},

		isPostmetaTableInScope: function(syncDb, dbMode) {
			if (!syncDb) {
				return false;
			}

			if (dbMode === 'all') {
				return true;
			}

			var selectedTables = this.getSelectedValues('#asenha-sync-table-selector .asenha-sync-table-checkbox');
			for (var i = 0; i < selectedTables.length; i++) {
				if (this.tableMatchesPostmeta(selectedTables[i])) {
					return true;
				}
			}

			return false;
		},

		isAttachmentPostTypeInScope: function(syncDb, dbMode, postTypesMode) {
			if (!syncDb || !this.isPostsTableInScope(syncDb, dbMode)) {
				return false;
			}

			if (postTypesMode === 'all') {
				return true;
			}

			var selectedPostTypes = this.getSelectedValues('#asenha-sync-post-type-selector .asenha-sync-post-type-checkbox');
			if (postTypesMode === 'selected') {
				return selectedPostTypes.indexOf('attachment') !== -1;
			}

			if (postTypesMode === 'except') {
				return selectedPostTypes.indexOf('attachment') === -1;
			}

			return true;
		},

		shouldForceMediaAttachmentRegistration: function(syncMedia, syncDb, dbMode, postTypesMode) {
			if (!syncMedia || !syncDb) {
				return false;
			}

			// When the "used_by_posts" media mode is active we always register attachments
			// on the destination, because the DB scope relies on those attachment post rows.
			var mediaMode = $('#asenha-sync-media-mode').val() || 'all';
			if (mediaMode === 'used_by_posts') {
				return true;
			}

			var postsInScope = this.isPostsTableInScope(syncDb, dbMode);
			var postmetaInScope = this.isPostmetaTableInScope(syncDb, dbMode);
			var attachmentInScope = this.isAttachmentPostTypeInScope(syncDb, dbMode, postTypesMode);

			return postsInScope && postmetaInScope && attachmentInScope;
		},

		/**
		 * Whether at least one content-column post type checkbox is currently checked.
		 *
		 * Content column = "Pages, posts and custom post types" (rendered with class
		 * `asenha-sync-selection-column-content`).
		 */
		hasContentPostTypeChecked: function() {
			return $('.asenha-sync-selection-column-content .asenha-sync-post-type-checkbox:checked').length > 0;
		},

		/**
		 * Apply the scoped-media UI auto-links:
		 * 1. Auto-check + lock postmeta when posts is checked (hard lock).
		 * 2. Auto-check + lock "attachment" post type when filter='selected'
		 *    AND at least one content-column post type is checked (hard lock).
		 * 3. When filter='selected' and posts are in scope, soft-default
		 *    the Media Library component to checked and the media mode to
		 *    "used_by_posts". These soft defaults are only applied once and
		 *    never override a later manual user choice.
		 */
		applyScopedSyncAutoLinks: function(ctx) {
			ctx = ctx || {};
			var syncDb = !!ctx.syncDb;
			var dbMode = ctx.dbMode || 'all';
			var postTypesMode = ctx.postTypesMode || 'all';
			var postsInScope = !!ctx.postsInScope;

			var lockPostmetaMsg = asenhaSiteBackup.strings.syncLockPostmetaRequiresPosts || 'The postmeta table is required when the posts table is in scope.';
			var lockAttachmentMsg = asenhaSiteBackup.strings.syncLockAttachmentRequiresContent || 'The attachment post type is required when at least one content post type is selected.';

			var self = this;

			// --- Rule 1: posts -> postmeta hard lock -------------------------------
			var $postsCheckboxes = $('#asenha-sync-table-selector .asenha-sync-table-checkbox').filter(function() {
				return self.tableMatchesPosts(this.value);
			});
			var $postmetaCheckboxes = $('#asenha-sync-table-selector .asenha-sync-table-checkbox').filter(function() {
				return self.tableMatchesPostmeta(this.value);
			});
			var anyPostsChecked = $postsCheckboxes.filter(':checked').length > 0;

			if (syncDb && dbMode === 'selected' && anyPostsChecked && $postmetaCheckboxes.length) {
				$postmetaCheckboxes.prop('checked', true).prop('disabled', true).attr('title', lockPostmetaMsg).attr('data-lock-reason', 'posts');
			} else if ($postmetaCheckboxes.length) {
				// Release the lock. Preserve the checkbox value as-is so the user's
				// choice (prior to the lock) is retained when posts is unchecked.
				$postmetaCheckboxes.each(function() {
					var $cb = $(this);
					if ($cb.attr('data-lock-reason') === 'posts') {
						$cb.prop('disabled', false).removeAttr('title').removeAttr('data-lock-reason');
					}
				});
			}

			// --- Rule 2: content post type -> attachment hard lock -----------------
			var $attachmentCheckbox = $('#asenha-sync-post-type-selector .asenha-sync-selection-column-media-revisions .asenha-sync-post-type-checkbox').filter(function() {
				return this.value === 'attachment';
			});
			var contentChecked = this.hasContentPostTypeChecked();

			if (syncDb && postsInScope && postTypesMode === 'selected' && contentChecked && $attachmentCheckbox.length) {
				$attachmentCheckbox.prop('checked', true).prop('disabled', true).attr('title', lockAttachmentMsg).attr('data-lock-reason', 'content-post-type');
			} else if ($attachmentCheckbox.length) {
				$attachmentCheckbox.each(function() {
					var $cb = $(this);
					if ($cb.attr('data-lock-reason') === 'content-post-type') {
						$cb.prop('disabled', false).removeAttr('title').removeAttr('data-lock-reason');
					}
				});
			}

			// --- Rule 3: soft defaults for Media Library + used_by_posts -----------
			var wantsSoftDefaults = syncDb && postsInScope && postTypesMode === 'selected';
			var $media = $('#asenha-sync-media');
			var $mediaMode = $('#asenha-sync-media-mode');

			if (wantsSoftDefaults) {
				if (!this.mediaComponentAutoApplied && !this.mediaComponentUserTouched && !$media.is(':checked')) {
					$media.prop('checked', true);
					this.mediaComponentAutoApplied = true;
				}
				if (!this.mediaModeAutoApplied && !this.mediaModeUserTouched) {
					// Only apply if the option is enabled (gating happens below in syncOptionVisibility).
					var $usedOpt = $mediaMode.find('option[value="used_by_posts"]');
					if ($usedOpt.length && !$usedOpt.prop('disabled')) {
						$mediaMode.val('used_by_posts');
						this.mediaModeAutoApplied = true;
					}
				}
			}
		},

		/**
		 * Gate the "used_by_posts" option: enable it only when Database sync is on,
		 * tables mode is "selected", posts is in scope, and the post-types filter is
		 * "selected" or "except". Otherwise disable the option and, if currently
		 * selected, fall back to "all".
		 */
		updateMediaModeOptionGating: function(ctx) {
			ctx = ctx || {};
			var syncDb = !!ctx.syncDb;
			var dbMode = ctx.dbMode || 'all';
			var postTypesMode = ctx.postTypesMode || 'all';
			var postsInScope = !!ctx.postsInScope;

			var eligible = syncDb && dbMode === 'selected' && postsInScope && (postTypesMode === 'selected' || postTypesMode === 'except');
			var $mediaMode = $('#asenha-sync-media-mode');
			var $usedOpt = $mediaMode.find('option[value="used_by_posts"]');
			if (!$usedOpt.length) {
				return;
			}

			$usedOpt.prop('disabled', !eligible);
			if (!eligible && $mediaMode.val() === 'used_by_posts') {
				$mediaMode.val('all');
				// Allow the soft-default to re-apply if the user re-enables the prerequisites.
				this.mediaModeAutoApplied = false;
			}
		},

		applyPreserveDefaults: function(optionsInScope) {
			var preserveMode = optionsInScope ? 'in_scope' : 'out_of_scope';
			if (this.preserveDefaultsMode === preserveMode) {
				return;
			}

			// Preserve option values are context-sensitive defaults.
			$('input[name="asenha_sync_preserve[]"]').prop('checked', !optionsInScope);
			this.preserveDefaultsMode = preserveMode;
		},

		setSelectorMessage: function(selector, message) {
			$(selector).html('<p class="description">' + this.escHtml(message || '') + '</p>');
		},

		renderRemoteSummary: function(siteInfo) {
			var $summary = $('#asenha-sync-remote-summary');
			var connectedToPrefix = asenhaSiteBackup.strings.syncConnectedToPrefix || 'Connected to';
			var wpLabel = asenhaSiteBackup.strings.syncWordPressVersionShort || 'WP v';
			var phpLabel = asenhaSiteBackup.strings.syncPhpVersionShort || 'PHP v';
			var siteUrl = siteInfo && siteInfo.site_url ? String(siteInfo.site_url) : '';
			var wpVersion = siteInfo && siteInfo.wp_version ? String(siteInfo.wp_version) : '-';
			var phpVersion = siteInfo && siteInfo.php_version ? String(siteInfo.php_version) : '-';

			if (!siteUrl) {
				$summary.text('-');
				return;
			}

			$summary.text(connectedToPrefix + ' ' + siteUrl + ' - ' + wpLabel + wpVersion + ' - ' + phpLabel + phpVersion);
		},

		applyDirectionAvailability: function() {
			var $pullDirection = $('input[name="asenha_sync_direction"][value="pull"]');
			var $pushDirection = $('input[name="asenha_sync_direction"][value="push"]');
			var $pullOption = $pullDirection.closest('.asenha-sync-direction-option');
			var $pushOption = $pushDirection.closest('.asenha-sync-direction-option');
			var $pullDisallowed = $('#asenha-sync-direction-pull-disallowed');
			var $pushDisallowed = $('#asenha-sync-direction-push-disallowed');
			var disallowedText = asenhaSiteBackup.strings.syncDirectionDisallowedByRemote || 'Currently disallowed by the remote site';
			var allowPull = true;
			var allowPush = true;
			var siteInfo = this.remoteSession && this.remoteSession.site_info ? this.remoteSession.site_info : null;

			if (siteInfo) {
				allowPull = !!siteInfo.allow_pull;
				allowPush = !!siteInfo.allow_push;
			}

			$pullDirection.prop('disabled', !allowPull);
			$pushDirection.prop('disabled', !allowPush);
			$pullOption.toggleClass('is-disabled', !allowPull);
			$pushOption.toggleClass('is-disabled', !allowPush);
			$pullDisallowed.text((siteInfo && !allowPull) ? (' => ' + disallowedText) : '').toggle(!!siteInfo && !allowPull);
			$pushDisallowed.text((siteInfo && !allowPush) ? (' => ' + disallowedText) : '').toggle(!!siteInfo && !allowPush);

			if (allowPull) {
				$pullDirection.prop('checked', true);
				return;
			}

			if (allowPush) {
				$pushDirection.prop('checked', true);
				return;
			}

			$pullDirection.prop('checked', false);
			$pushDirection.prop('checked', false);
		},

		getSelectedDirection: function() {
			var $pullDirection = $('input[name="asenha_sync_direction"][value="pull"]');
			var $pushDirection = $('input[name="asenha_sync_direction"][value="push"]');
			var selectedDirection = $('input[name="asenha_sync_direction"]:checked').val() || '';

			if ('pull' === selectedDirection && !$pullDirection.is(':disabled')) {
				return 'pull';
			}

			if ('push' === selectedDirection && !$pushDirection.is(':disabled')) {
				return 'push';
			}

			if (!$pullDirection.is(':disabled')) {
				$pullDirection.prop('checked', true);
				return 'pull';
			}

			if (!$pushDirection.is(':disabled')) {
				$pushDirection.prop('checked', true);
				return 'push';
			}

			$pullDirection.prop('checked', true);
			return 'pull';
		},

		syncOptionVisibility: function() {
			var syncDb = $('#asenha-sync-database').is(':checked');
			var syncThemes = $('#asenha-sync-themes').is(':checked');
			var syncPlugins = $('#asenha-sync-plugins').is(':checked');
			var syncOtherWpContent = $('#asenha-sync-other-wp-content').is(':checked');
			var $registerMediaAttachments = $('#asenha-sync-register-media-attachments');

			$('#asenha-sync-db-options').toggle(syncDb);
			$('#asenha-sync-themes-options').toggle(syncThemes);
			$('#asenha-sync-plugins-options').toggle(syncPlugins);
			$('#asenha-sync-other-wp-content-options').toggle(syncOtherWpContent);

			var dbMode = $('select[name="asenha_sync_db_tables"]').val() || 'all';
			var themesMode = $('select[name="asenha_sync_themes_filter"]').val() || 'all';
			var pluginsMode = $('select[name="asenha_sync_plugins_filter"]').val() || 'all';
			var postTypesMode = $('select[name="asenha_sync_post_types_filter"]').val() || 'all';
			var otherWpContentMode = $('select[name="asenha_sync_other_wp_content_filter"]').val() || 'all';
			var postsInScope = this.isPostsTableInScope(syncDb, dbMode);
			var optionsInScope = this.isOptionsTableInScope(syncDb, dbMode);

			// Apply scoped-media auto-links (postmeta lock, attachment lock, and soft
			// defaults for Media Library + "used_by_posts" mode) before reading the
			// resulting media component / mode state.
			var autoLinkCtx = {
				syncDb: syncDb,
				dbMode: dbMode,
				postTypesMode: postTypesMode,
				postsInScope: postsInScope
			};
			this.updateMediaModeOptionGating(autoLinkCtx);
			this.applyScopedSyncAutoLinks(autoLinkCtx);
			this.applyScopedTermTableAutoLinks(autoLinkCtx);
			this.applyScopedCfgroupTableAutoLinks(autoLinkCtx);

			var syncMedia = $('#asenha-sync-media').is(':checked');
			$('#asenha-sync-media-options').toggle(syncMedia);
			var forceRegisterMedia = this.shouldForceMediaAttachmentRegistration(syncMedia, syncDb, dbMode, postTypesMode);

			if (!syncMedia) {
				this.registerMediaDefaultApplied = false;
				// Allow the Media Library soft-default to re-apply if the user later
				// re-enables the scoped prerequisites by resetting our touch flag
				// only when the component is currently off AND the auto default was
				// never yet applied. We intentionally do NOT clear mediaComponentUserTouched
				// because an explicit user uncheck should stay "sticky" until reload.
			}

			if (syncMedia && !this.registerMediaDefaultApplied) {
				$registerMediaAttachments.prop('checked', true);
				this.registerMediaDefaultApplied = true;
			}

			if (forceRegisterMedia) {
				$registerMediaAttachments.prop('checked', true);
				$registerMediaAttachments.prop('disabled', true);
			} else {
				$registerMediaAttachments.prop('disabled', !syncMedia);
			}

			var showTableSelector = syncDb && dbMode === 'selected';
			var showThemeSelector = syncThemes && themesMode === 'selected';
			var showPluginSelector = syncPlugins && (pluginsMode === 'selected' || pluginsMode === 'except');
			var showOtherWpContentSelector = syncOtherWpContent && otherWpContentMode === 'manual';
			var showPostTypesOptions = syncDb && postsInScope;
			var showPostTypeSelector = showPostTypesOptions && (postTypesMode === 'selected' || postTypesMode === 'except');
			var asenhaCptInScope = this.isAsenhaCptInScope(postTypesMode);
			var showAseCptDefinitionsOptions = showPostTypesOptions && asenhaCptInScope;
			var asenhaCptDefsMode = $('select[name="asenha_sync_asenha_cpt_definitions_filter"]').val() || 'selected';
			var showAseCptDefinitionsSelector = showAseCptDefinitionsOptions && asenhaCptDefsMode !== 'all';
			// Taxonomies scoped sub-section: visible only when the post-types filter
			// is actively narrowing (selected/except) and posts are in scope, mirroring
			// the ASE CPT definitions visibility logic.
			var showTaxonomiesOptions = showPostTypesOptions && (postTypesMode === 'selected' || postTypesMode === 'except');
			this.applyTaxonomiesModeDefault({ showTaxonomiesOptions: showTaxonomiesOptions });
			var taxonomiesMode = $('select[name="asenha_sync_taxonomies_filter"]').val() || 'all';
			var showTaxonomySelector = showTaxonomiesOptions && taxonomiesMode !== 'all';
			// ASE Custom Taxonomy Definitions sub-section: mirrors CPT defs gating,
			// but keyed on the asenha_ctax post-type being effectively in scope.
			var asenhaCtaxInScope = this.isAsenhaCtaxInScope(postTypesMode);
			var showAseCtaxDefinitionsOptions = showPostTypesOptions && asenhaCtaxInScope;
			var asenhaCtaxDefsMode = $('select[name="asenha_sync_asenha_ctax_definitions_filter"]').val() || 'selected';
			var showAseCtaxDefinitionsSelector = showAseCtaxDefinitionsOptions && asenhaCtaxDefsMode !== 'all';
			// ASE Custom Field Group Definitions sub-section: mirrors CPT defs gating,
			// but keyed on the asenha_cfgroup post-type being effectively in scope.
			var asenhaCfgroupInScope = this.isAsenhaCfgroupInScope(postTypesMode);
			var showAseCfgroupDefinitionsOptions = showPostTypesOptions && asenhaCfgroupInScope;
			var asenhaCfgroupDefsMode = $('select[name="asenha_sync_asenha_cfgroup_definitions_filter"]').val() || 'selected';
			var showAseCfgroupDefinitionsSelector = showAseCfgroupDefinitionsOptions && asenhaCfgroupDefsMode !== 'all';
			var showFindReplace = syncDb;
			var showPreserveOptions = syncDb && optionsInScope;
			var showExclusions = syncMedia || syncThemes || syncPlugins || syncOtherWpContent;

			$('#asenha-sync-table-selector').toggle(showTableSelector);
			$('#asenha-sync-theme-selector').toggle(showThemeSelector);
			$('#asenha-sync-plugin-selector').toggle(showPluginSelector);
			$('#asenha-sync-other-wp-content-selector').toggle(showOtherWpContentSelector);
			$('#asenha-sync-post-types-options').toggle(showPostTypesOptions);
			$('#asenha-sync-post-type-selector').toggle(showPostTypeSelector);
			$('#asenha-sync-asenha-cpt-definitions-options').toggle(showAseCptDefinitionsOptions);
			$('#asenha-sync-asenha-cpt-definitions-selector').toggle(showAseCptDefinitionsSelector);
			$('#asenha-sync-taxonomies-options').toggle(showTaxonomiesOptions);
			$('#asenha-sync-taxonomy-selector').toggle(showTaxonomySelector);
			$('#asenha-sync-asenha-ctax-definitions-options').toggle(showAseCtaxDefinitionsOptions);
			$('#asenha-sync-asenha-ctax-definitions-selector').toggle(showAseCtaxDefinitionsSelector);
			$('#asenha-sync-asenha-cfgroup-definitions-options').toggle(showAseCfgroupDefinitionsOptions);
			$('#asenha-sync-asenha-cfgroup-definitions-selector').toggle(showAseCfgroupDefinitionsSelector);
			$('#asenha-sync-find-replace').toggle(showFindReplace);
			$('#asenha-sync-preserve-options').toggle(showPreserveOptions);
			$('#asenha-sync-exclusions').toggle(showExclusions);
			if (!showFindReplace) {
				$('#asenha-sync-find-replace-options').hide();
			}
			if (!showPreserveOptions) {
				$('#asenha-sync-preserve-options-content').hide();
			}
			if (!showExclusions) {
				$('#asenha-sync-exclusions-options').hide();
			}
			this.applyPreserveDefaults(showPreserveOptions);

			if (this.remoteSession && (showTableSelector || showThemeSelector || showPluginSelector || showPostTypeSelector) && this.sourceInventoryState === 'idle' && !this.inventoryRequest) {
				this.loadSourceInventory();
			}

			if (showOtherWpContentSelector) {
				this.ensureOtherWpContentTreeLoaded();
			}
		},

		setSourceInventoryLoading: function() {
			var loadingText = asenhaSiteBackup.strings.syncLoadingList || 'Loading list...';
			this.setSelectorMessage('#asenha-sync-table-selector', loadingText);
			this.setSelectorMessage('#asenha-sync-theme-selector', loadingText);
			this.setSelectorMessage('#asenha-sync-plugin-selector', loadingText);
			this.setSelectorMessage('#asenha-sync-post-type-selector', loadingText);
			this.setSelectorMessage('#asenha-sync-asenha-cpt-definitions-selector', loadingText);
			this.setSelectorMessage('#asenha-sync-taxonomy-selector', asenhaSiteBackup.strings.syncLoadingTaxonomies || loadingText);
			this.setSelectorMessage('#asenha-sync-asenha-ctax-definitions-selector', loadingText);
			this.setSelectorMessage('#asenha-sync-asenha-cfgroup-definitions-selector', loadingText);
		},

		loadSourceInventory: function() {
			var self = this;
			if (!self.remoteSession) {
				return;
			}

			var direction = self.getSelectedDirection();

			if (self.inventoryRequest && typeof self.inventoryRequest.abort === 'function') {
				self.inventoryRequest.abort();
			}

			self.sourceInventoryState = 'loading';
			self.setSourceInventoryLoading();

			self.inventoryRequest = $.post(ajaxurl, {
				action: 'asenha_sync_get_source_inventory',
				_nonce: asenhaSiteBackup.nonce,
				direction: direction
			}).done(function(response) {
				if (response && response.success && response.data) {
					self.sourceInventory = response.data;
					self.sourceInventoryState = 'ready';
					self.renderSourceInventory();
					return;
				}

				self.sourceInventory = null;
				self.sourceInventoryState = 'failed';
				var failed = (response && response.data && response.data.message) ? response.data.message : (asenhaSiteBackup.strings.syncInventoryLoadFailed || 'Failed to load the source list. Please try again.');
				self.setSelectorMessage('#asenha-sync-table-selector', failed);
				self.setSelectorMessage('#asenha-sync-theme-selector', failed);
				self.setSelectorMessage('#asenha-sync-plugin-selector', failed);
				self.setSelectorMessage('#asenha-sync-post-type-selector', failed);
				self.setSelectorMessage('#asenha-sync-asenha-cpt-definitions-selector', failed);
				self.setSelectorMessage('#asenha-sync-taxonomy-selector', failed);
				self.setSelectorMessage('#asenha-sync-asenha-ctax-definitions-selector', failed);
			}).fail(function(xhr, textStatus) {
				if (textStatus === 'abort') {
					return;
				}
				self.sourceInventory = null;
				self.sourceInventoryState = 'failed';
				var failed = asenhaSiteBackup.strings.syncInventoryLoadFailed || 'Failed to load the source list. Please try again.';
				self.setSelectorMessage('#asenha-sync-table-selector', failed);
				self.setSelectorMessage('#asenha-sync-theme-selector', failed);
				self.setSelectorMessage('#asenha-sync-plugin-selector', failed);
				self.setSelectorMessage('#asenha-sync-post-type-selector', failed);
				self.setSelectorMessage('#asenha-sync-asenha-cpt-definitions-selector', failed);
				self.setSelectorMessage('#asenha-sync-taxonomy-selector', failed);
				self.setSelectorMessage('#asenha-sync-asenha-ctax-definitions-selector', failed);
				self.setSelectorMessage('#asenha-sync-asenha-cfgroup-definitions-selector', failed);
			}).always(function() {
				self.inventoryRequest = null;
				self.syncOptionVisibility();
			});
		},

		renderSourceInventory: function() {
			var tables = (this.sourceInventory && this.sourceInventory.tables) ? this.sourceInventory.tables : [];
			var themes = (this.sourceInventory && this.sourceInventory.themes) ? this.sourceInventory.themes : [];
			var plugins = (this.sourceInventory && this.sourceInventory.plugins) ? this.sourceInventory.plugins : [];
			var postTypes = (this.sourceInventory && this.sourceInventory.post_types) ? this.sourceInventory.post_types : [];
			var asenhaCpts = (this.sourceInventory && this.sourceInventory.asenha_cpts) ? this.sourceInventory.asenha_cpts : [];
			var taxonomies = (this.sourceInventory && this.sourceInventory.taxonomies) ? this.sourceInventory.taxonomies : [];
			var asenhaCtaxes = (this.sourceInventory && this.sourceInventory.asenha_ctaxes) ? this.sourceInventory.asenha_ctaxes : [];
			var asenhaCfgroups = (this.sourceInventory && this.sourceInventory.asenha_cfgroups) ? this.sourceInventory.asenha_cfgroups : [];

			var selectedTables = this.getSelectedValues('#asenha-sync-table-selector .asenha-sync-table-checkbox');
			var selectedThemes = this.getSelectedValues('#asenha-sync-theme-selector .asenha-sync-theme-checkbox');
			var selectedPlugins = this.getSelectedValues('#asenha-sync-plugin-selector .asenha-sync-plugin-checkbox');
			var selectedPostTypes = this.getSelectedValues('#asenha-sync-post-type-selector .asenha-sync-post-type-checkbox');
			var selectedAsenhaCpts = this.getSelectedValues('#asenha-sync-asenha-cpt-definitions-selector .asenha-sync-asenha-cpt-def-checkbox');
			var selectedTaxonomies = this.getSelectedValues('#asenha-sync-taxonomy-selector .asenha-sync-taxonomy-checkbox');
			var selectedAsenhaCtaxes = this.getSelectedValues('#asenha-sync-asenha-ctax-definitions-selector .asenha-sync-asenha-ctax-def-checkbox');
			var selectedAsenhaCfgroups = this.getSelectedValues('#asenha-sync-asenha-cfgroup-definitions-selector .asenha-sync-asenha-cfgroup-def-checkbox');

			$('#asenha-sync-table-selector').html(this.renderTableSelectorHtml(tables, selectedTables));
			$('#asenha-sync-theme-selector').html(this.renderItemsSelectorHtml(themes, 'theme', selectedThemes));
			$('#asenha-sync-plugin-selector').html(this.renderItemsSelectorHtml(plugins, 'plugin', selectedPlugins));
			$('#asenha-sync-post-type-selector').html(this.renderPostTypeSelectorHtml(postTypes, selectedPostTypes));
			$('#asenha-sync-asenha-cpt-definitions-selector').html(this.renderAseCptDefinitionsSelectorHtml(asenhaCpts, selectedAsenhaCpts));
			$('#asenha-sync-taxonomy-selector').html(this.renderTaxonomySelectorHtml(taxonomies, selectedTaxonomies));
			$('#asenha-sync-asenha-ctax-definitions-selector').html(this.renderAseCtaxDefinitionsSelectorHtml(asenhaCtaxes, selectedAsenhaCtaxes));
			$('#asenha-sync-asenha-cfgroup-definitions-selector').html(this.renderAseCfgroupDefinitionsSelectorHtml(asenhaCfgroups, selectedAsenhaCfgroups));
			this.updateSyncTableColumnToggleLabels();
			this.updateSyncPostTypeColumnToggleLabels();

			// After (re)rendering, mirror the top post-type selector state into
			// the new CPT definitions list so the initial checked state matches.
			this.mirrorAseCptDefinitionSelections('post-type-selector');
			// Seed the ASE Custom Taxonomy definitions selector from the top
			// taxonomy selector state so the initial checked state matches.
			this.mirrorAseCtaxDefinitionSelections('taxonomy-selector');
		},

		resetOtherWpContentTree: function() {
			this.otherWpContentSelectedPaths = [];
			this.otherWpContentTreeDirection = '';
			this.otherWpContentTreeLoading = false;
			if (this.otherWpContentTreeRequest && typeof this.otherWpContentTreeRequest.abort === 'function') {
				this.otherWpContentTreeRequest.abort();
			}
			this.otherWpContentTreeRequest = null;
			var $tree = $('#asenha-sync-other-wp-content-tree');
			$tree.removeData('loaded');
			$tree.empty();
		},

		setOtherWpContentTreeMessage: function(message) {
			$('#asenha-sync-other-wp-content-tree').html('<p class="description">' + this.escHtml(message || '') + '</p>');
		},

		ensureOtherWpContentTreeLoaded: function() {
			var self = this;
			if (!self.remoteSession) {
				return;
			}

			var $tree = $('#asenha-sync-other-wp-content-tree');
			if (!$tree.length) {
				return;
			}

			var direction = self.getSelectedDirection();
			var isLoaded = !!$tree.data('loaded');
			if (isLoaded && self.otherWpContentTreeDirection === direction) {
				self.syncOtherWpContentTreeCheckboxes();
				return;
			}

			if (self.otherWpContentTreeLoading) {
				return;
			}

			self.otherWpContentTreeLoading = true;
			self.otherWpContentTreeDirection = direction;
			$tree.data('loaded', false);
			self.setOtherWpContentTreeMessage(asenhaSiteBackup.strings.syncLoadingList || 'Loading list...');

			self.loadOtherWpContentChildren('', 0, function(result) {
				self.otherWpContentTreeLoading = false;
				if (!result) {
					self.setOtherWpContentTreeMessage(asenhaSiteBackup.strings.syncInventoryLoadFailed || 'Failed to load the source list. Please try again.');
					return;
				}

				$tree.data('loaded', true).html(self.renderOtherWpContentTreeHtml('', result.items || [], result.has_more, result.total, 0));
				self.syncOtherWpContentTreeCheckboxes();
			});
		},

		loadOtherWpContentChildren: function(path, offset, cb) {
			var self = this;
			if (self.otherWpContentTreeRequest && typeof self.otherWpContentTreeRequest.abort === 'function') {
				self.otherWpContentTreeRequest.abort();
			}

			self.otherWpContentTreeRequest = $.post(ajaxurl, {
				action: 'asenha_sync_list_source_wp_content_children',
				_nonce: asenhaSiteBackup.nonce,
				direction: self.getSelectedDirection(),
				path: path || '',
				offset: offset || 0,
				limit: 200
			}).done(function(resp) {
				if (!resp || !resp.success) {
					cb(null);
					return;
				}
				cb(resp.data || null);
			}).fail(function(xhr, textStatus) {
				if (textStatus === 'abort') {
					return;
				}
				cb(null);
			}).always(function() {
				self.otherWpContentTreeRequest = null;
			});
		},

		renderOtherWpContentTreeHtml: function(parentPath, items, hasMore, total, offset) {
			var esc = function(s) {
				return $('<div/>').text(String(s || '')).html();
			};
			var html = '<ul class="asenha-tree">';
			for (var i = 0; i < items.length; i++) {
				var it = items[i] || {};
				var rel = String(it.rel_path || '');
				var isDir = it.type === 'dir';
				var always = !!it.always_excluded;
				var reason = it.reason ? String(it.reason) : '';
				var label = esc(it.name || rel);
				var storePath = isDir ? (rel + '/') : rel;
				var toggleAttrs = always ? ' disabled aria-disabled="true"' : '';

				html += '<li class="asenha-tree-item" data-rel="' + esc(rel) + '" data-type="' + (isDir ? 'dir' : 'file') + '" data-always-excluded="' + (always ? '1' : '0') + '">';
				html += '  <div class="asenha-tree-row">';
				html += isDir
					? '<button type="button" class="button-link asenha-tree-toggle" aria-label="' + esc(asenhaSbT('toggleFolderAriaLabel')) + '" aria-expanded="false"' + toggleAttrs + '><span class="dashicons dashicons-arrow-right-alt2" aria-hidden="true"></span></button>'
					: '<span class="asenha-tree-spacer" aria-hidden="true"></span>';
				html += '    <label class="asenha-tree-label" title="' + esc(reason) + '">';
				html += '      <input type="checkbox" class="asenha-tree-checkbox asenha-sync-other-wp-content-checkbox" data-store-path="' + esc(storePath) + '"' + (always ? ' disabled' : '') + ' /> ';
				html += label;
				if (always) {
					html += ' <span class="description asenha-inline-description">(' + esc(reason || asenhaSbT('alwaysExcluded')) + ')</span>';
				}
				html += '    </label>';
				html += '  </div>';
				if (isDir) {
					html += '<div class="asenha-tree-children" style="display:none;"></div>';
				}
				html += '</li>';
			}
			if (hasMore) {
				html += '<li class="asenha-tree-more"><button type="button" class="button asenha-tree-load-more" data-parent="' + esc(parentPath) + '" data-offset="' + esc(offset + items.length) + '">' + esc(asenhaSbT('loadMore')) + '</button></li>';
			}
			html += '</ul>';

			setTimeout(function() {
				var $root = $('#asenha-sync-other-wp-content-tree');

				$root.off('click.asenhaSyncOtherTreeToggle').on('click.asenhaSyncOtherTreeToggle', '.asenha-tree-toggle', function(e) {
					e.preventDefault();
					var $btn = $(this);
					if ($btn.is(':disabled')) {
						return;
					}
					var $li = $btn.closest('.asenha-tree-item');
					var rel = String($li.data('rel') || '');
					var $children = $li.find('> .asenha-tree-children');
					if ($children.is(':visible')) {
						$children.hide();
						$btn.removeClass('is-expanded').attr('aria-expanded', 'false');
						return;
					}
					$btn.addClass('is-expanded').attr('aria-expanded', 'true');
					if ($children.data('loaded')) {
						$children.show();
						return;
					}
					$children.html('<p class="description">' + asenhaSbT('loading') + '</p>').show();
					SiteSync.loadOtherWpContentChildren(rel, 0, function(result) {
						if (!result) {
							$children.html('<p class="description">' + asenhaSbT('failedToLoad') + '</p>');
							return;
						}
						$children.data('loaded', true).html(SiteSync.renderOtherWpContentTreeHtml(rel, result.items || [], result.has_more, result.total, 0));
						SiteSync.syncOtherWpContentTreeCheckboxes();
					});
				});

				$root.off('click.asenhaSyncOtherTreeMore').on('click.asenhaSyncOtherTreeMore', '.asenha-tree-load-more', function(e) {
					e.preventDefault();
					var $btn = $(this);
					var parent = String($btn.data('parent') || '');
					var nextOffset = parseInt($btn.data('offset') || 0, 10);
					$btn.prop('disabled', true).text(asenhaSbT('loading'));
					SiteSync.loadOtherWpContentChildren(parent, nextOffset, function(result) {
						if (!result) {
							$btn.prop('disabled', false).text(asenhaSbT('loadMore'));
							return;
						}
						var $moreLi = $btn.closest('.asenha-tree-more');
						var $ul = $moreLi.closest('ul.asenha-tree');
						$moreLi.remove();
						$ul.append($(SiteSync.renderOtherWpContentTreeHtml(parent, result.items || [], result.has_more, result.total, nextOffset)).children());
						SiteSync.syncOtherWpContentTreeCheckboxes();
					});
				});

				$root.off('change.asenhaSyncOtherTreeCheck').on('change.asenhaSyncOtherTreeCheck', '.asenha-sync-other-wp-content-checkbox', function() {
					var selected = SiteSync.otherWpContentSelectedPaths || [];
					var p = asenhaNormalizeTreePath(String($(this).data('store-path') || ''));
					var checked = $(this).is(':checked');
					selected = asenhaApplyTreeToggleSelection(
						selected,
						p,
						checked,
						$root,
						'.asenha-sync-other-wp-content-checkbox',
						{ preserveDisabledCheckedDescendantsOnDirectDirUncheck: true }
					);
					SiteSync.otherWpContentSelectedPaths = selected;
					SiteSync.syncOtherWpContentTreeCheckboxes();
				});
			}, 0);

			return html;
		},

		syncOtherWpContentTreeCheckboxes: function() {
			var selected = asenhaNormalizeTreeSelection(this.otherWpContentSelectedPaths || []);
			this.otherWpContentSelectedPaths = selected;
			var set = asenhaTreeSelectionToSet(selected);
			$('#asenha-sync-other-wp-content-tree .asenha-sync-other-wp-content-checkbox').each(function() {
				var $cb = $(this);
				var p = asenhaNormalizeTreePath(String($cb.data('store-path') || ''));
				if (p) {
					var isDisabled = $cb.is(':disabled');
					var isChecked = isDisabled ? !!set[p] : asenhaIsTreePathSelected(p, set);
					$cb.prop('checked', isChecked);
				}
			});
		},

		getSelectedOtherWpContentPaths: function() {
			var selected = this.otherWpContentSelectedPaths || [];
			var normalized = [];
			var seen = {};
			for (var i = 0; i < selected.length; i++) {
				var p = String(selected[i] || '').replace(/\\/g, '/');
				p = p.replace(/^\/+/, '');
				if (!p) {
					continue;
				}
				if (!seen[p]) {
					seen[p] = true;
					normalized.push(p);
				}
			}
			return normalized;
		},

		renderTableSelectorHtml: function(tables, selected) {
			tables = tables || [];
			selected = selected || [];
			var selectedSet = {};
			var i = 0;
			var dbPrefix = (asenhaSiteBackup && asenhaSiteBackup.dbPrefix) ? String(asenhaSiteBackup.dbPrefix) : '';
			var dbBasePrefix = (asenhaSiteBackup && asenhaSiteBackup.dbBasePrefix) ? String(asenhaSiteBackup.dbBasePrefix) : '';
			var columns = {
				core: [],
				ase: [],
				other: []
			};

			for (i = 0; i < selected.length; i++) {
				selectedSet[String(selected[i] || '')] = true;
			}

			if (!tables.length) {
				return '<p class="description">' + this.escHtml(asenhaSiteBackup.strings.syncNoTablesAvailable || 'No tables found.') + '</p>';
			}

			var rendered = 0;
			for (i = 0; i < tables.length; i++) {
				var table = tables[i] || {};
				var key = String(table.key || table.short_name || table.name || '');
				if (!key) {
					continue;
				}

				var normalized = {
					key: key,
					full: String(table.full || table.name || '')
				};

				if (asenhaIsDbTableAse(normalized)) {
					columns.ase.push(normalized);
					continue;
				}
				if (asenhaIsDbTableCore(normalized, dbPrefix, dbBasePrefix)) {
					columns.core.push(normalized);
					continue;
				}
				columns.other.push(normalized);
			}

			var sortByKey = function(a, b) {
				return String(a.key || '').localeCompare(String(b.key || ''), undefined, { sensitivity: 'base' });
			};
			columns.core.sort(sortByKey);
			columns.ase.sort(sortByKey);
			columns.other.sort(sortByKey);

			rendered = columns.core.length + columns.ase.length + columns.other.length;

			if (!rendered) {
				return '<p class="description">' + this.escHtml(asenhaSiteBackup.strings.syncNoTablesAvailable || 'No tables found.') + '</p>';
			}

			var coreLabel = asenhaSiteBackup.strings.syncCoreTablesHeading || 'WordPress core tables';
			var aseLabel = asenhaSiteBackup.strings.syncAseTablesHeading || 'ASE tables';
			var otherLabel = asenhaSiteBackup.strings.syncOtherTablesHeading || 'Other tables';
			var selectAllLabel = asenhaSiteBackup.strings.syncSelectAll || 'Select all';
			var selectNoneLabel = asenhaSiteBackup.strings.syncSelectNone || 'Select none';
			var html = '<div class="asenha-sync-selection-list asenha-sync-selection-list-tables asenha-sync-selection-list-table-columns">';
			html += '<div class="asenha-sync-selection-column asenha-sync-selection-column-core">';
			html += this.renderTableColumnHeadingHtml(coreLabel, 'core', this.areAllTableItemsSelected(columns.core, selectedSet), columns.core.length > 0, selectAllLabel, selectNoneLabel);
			html += this.renderTableColumnItemsHtml(columns.core, selectedSet);
			html += '</div>';
			html += '<div class="asenha-sync-selection-column asenha-sync-selection-column-ase">';
			html += this.renderTableColumnHeadingHtml(aseLabel, 'ase', this.areAllTableItemsSelected(columns.ase, selectedSet), columns.ase.length > 0, selectAllLabel, selectNoneLabel);
			html += this.renderTableColumnItemsHtml(columns.ase, selectedSet);
			html += '</div>';
			html += '<div class="asenha-sync-selection-column asenha-sync-selection-column-other">';
			html += this.renderTableColumnHeadingHtml(otherLabel, 'other', this.areAllTableItemsSelected(columns.other, selectedSet), columns.other.length > 0, selectAllLabel, selectNoneLabel);
			html += this.renderTableColumnItemsHtml(columns.other, selectedSet);
			html += '</div>';
			html += '</div>';

			return html;
		},

		renderTableColumnItemsHtml: function(items, selectedSet) {
			var html = '';
			var i = 0;

			for (i = 0; i < items.length; i++) {
				var table = items[i] || {};
				var key = String(table.key || '');
				if (!key) {
					continue;
				}

				html += '<div class="asenha-sync-selection-item" data-table-key="' + this.escAttr(key) + '">';
				html += '<label><input type="checkbox" class="asenha-sync-table-checkbox" value="' + this.escAttr(key) + '"' + (selectedSet[key] ? ' checked' : '') + ' /> ' + this.escHtml(key) + '</label>';
				html += '</div>';
			}

			return html;
		},

		areAllTableItemsSelected: function(items, selectedSet) {
			var i = 0;
			if (!items || !items.length) {
				return false;
			}

			for (i = 0; i < items.length; i++) {
				var key = String((items[i] && items[i].key) ? items[i].key : '');
				if (!key || !selectedSet[key]) {
					return false;
				}
			}

			return true;
		},

		renderTableColumnHeadingHtml: function(headingLabel, columnKey, allSelected, hasItems, selectAllLabel, selectNoneLabel) {
			var actionLabel = allSelected ? selectNoneLabel : selectAllLabel;
			var disabledAttr = hasItems ? '' : ' disabled';
			var disabledClass = hasItems ? '' : ' is-disabled';
			var html = '<p class="asenha-sync-selection-column-heading">';
			html += '<span class="asenha-sync-selection-column-heading-label">' + this.escHtml(headingLabel) + '</span>';
			html += '<button type="button" class="button button-small asenha-sync-table-column-toggle' + disabledClass + '" data-column="' + this.escAttr(columnKey) + '"' + disabledAttr + '>' + this.escHtml(actionLabel) + '</button>';
			html += '</p>';

			return html;
		},

		updateSyncTableColumnToggleLabels: function() {
			var selectAllLabel = asenhaSiteBackup.strings.syncSelectAll || 'Select all';
			var selectNoneLabel = asenhaSiteBackup.strings.syncSelectNone || 'Select none';

			$('#asenha-sync-table-selector .asenha-sync-selection-column').each(function() {
				var $column = $(this);
				var $toggle = $column.find('.asenha-sync-table-column-toggle');
				var $checkboxes = $column.find('.asenha-sync-table-checkbox');
				var allSelected = $checkboxes.length > 0 && $checkboxes.filter(':checked').length === $checkboxes.length;
				var nextLabel = allSelected ? selectNoneLabel : selectAllLabel;

				$toggle.text(nextLabel);
				$toggle.prop('disabled', !$checkboxes.length);
				$toggle.toggleClass('is-disabled', !$checkboxes.length);
			});
		},

		updateSyncPostTypeColumnToggleLabels: function() {
			var selectAllLabel = asenhaSiteBackup.strings.syncSelectAll || 'Select all';
			var selectNoneLabel = asenhaSiteBackup.strings.syncSelectNone || 'Select none';

			// Iterate each toggle rather than each column so that subcolumn toggles
			// (e.g. supplemental and ASE custom content types inside the middle column)
			// are each refreshed against their own subgroup's checkboxes.
			$('#asenha-sync-post-type-selector .asenha-sync-post-type-column-toggle').each(function() {
				var $toggle = $(this);
				var $scope = $toggle.closest('.asenha-sync-selection-subcolumn');
				if (!$scope.length) {
					$scope = $toggle.closest('.asenha-sync-selection-column');
				}
				var $checkboxes = $scope.find('.asenha-sync-post-type-checkbox');
				var allSelected = $checkboxes.length > 0 && $checkboxes.filter(':checked').length === $checkboxes.length;
				var nextLabel = allSelected ? selectNoneLabel : selectAllLabel;

				$toggle.text(nextLabel);
				$toggle.prop('disabled', !$checkboxes.length);
				$toggle.toggleClass('is-disabled', !$checkboxes.length);
			});
		},

		renderItemsSelectorHtml: function(items, type, selected) {
			items = items || [];
			selected = selected || [];
			var selectedSet = {};
			var i = 0;

			for (i = 0; i < selected.length; i++) {
				selectedSet[String(selected[i] || '')] = true;
			}

			var emptyText = type === 'theme'
				? (asenhaSiteBackup.strings.syncNoThemesAvailable || 'No themes found.')
				: (type === 'plugin'
					? (asenhaSiteBackup.strings.syncNoPluginsAvailable || 'No plugins found.')
					: (asenhaSiteBackup.strings.syncNoPostTypesAvailable || 'No post types found.'));

			if (!items.length) {
				return '<p class="description">' + this.escHtml(emptyText) + '</p>';
			}

			var checkboxClass = type === 'theme'
				? 'asenha-sync-theme-checkbox'
				: (type === 'plugin' ? 'asenha-sync-plugin-checkbox' : 'asenha-sync-post-type-checkbox');
			var activeLabel = asenhaSiteBackup.strings.syncActive || 'active';
			var html = '<div class="asenha-sync-selection-list asenha-sync-selection-list-' + this.escAttr(type) + '">';
			var rendered = 0;

			for (i = 0; i < items.length; i++) {
				var item = items[i] || {};
				var slug = String(item.slug || '');
				if (!slug) {
					continue;
				}

				var name = String(item.name || slug);
				var isActive = type !== 'post-type' && !!item.active;
				rendered++;
				html += '<div class="asenha-sync-selection-item" data-item-slug="' + this.escAttr(slug) + '">';
				html += '<label><input type="checkbox" class="' + checkboxClass + '" value="' + this.escAttr(slug) + '"' + (selectedSet[slug] ? ' checked' : '') + ' /> ' + this.escHtml(name);
				if (isActive) {
					html += ' <span class="asenha-backup-badge asenha-backup-badge-multipart">' + this.escHtml(activeLabel) + '</span>';
				}
				html += '</label>';
				html += '</div>';
			}
			html += '</div>';

			if (!rendered) {
				return '<p class="description">' + this.escHtml(emptyText) + '</p>';
			}

			return html;
		},

		renderPostTypeSelectorHtml: function(items, selected) {
			items = items || [];
			selected = selected || [];
			var selectedSet = {};
			var i = 0;
			var mediaRevisionsColumnSlugs = {
				'attachment': true,
				'revision': true
			};
			var aseContentTypeColumnSlugs = {
				'asenha_cpt': true,
				'asenha_ctax': true,
				'asenha_cfgroup': true,
				'asenha_options_page': true,
				'options_page_config': true
			};
			var coreColumnTwoSlugs = {
				'customize_changeset': true,
				'custom_css': true,
				'wp_font_face': true,
				'wp_font_family': true,
				'wp_global_styles': true,
				'nav_menu_item': true,
				'wp_navigation': true,
				'oembed_cache': true,
				'wp_block': true,
				'wp_template_part': true,
				'wp_template': true,
				'user_request': true
			};
			var columnOne = [];
			var columnTwo = [];
			var columnTwoAse = [];
			var columnThree = [];
			var emptyText = asenhaSiteBackup.strings.syncNoPostTypesAvailable || 'No post types found.';

			for (i = 0; i < selected.length; i++) {
				selectedSet[String(selected[i] || '')] = true;
			}

			for (i = 0; i < items.length; i++) {
				var item = items[i] || {};
				var slug = String(item.slug || '');
				if (!slug) {
					continue;
				}

				var name = String(item.name || slug);
				var normalized = {
					slug: slug,
					name: name
				};

				if (mediaRevisionsColumnSlugs[slug]) {
					columnTwo.push(normalized);
				} else if (aseContentTypeColumnSlugs[slug]) {
					columnTwoAse.push(normalized);
				} else if (coreColumnTwoSlugs[slug]) {
					columnThree.push(normalized);
				} else {
					columnOne.push(normalized);
				}
			}

			if (!columnOne.length && !columnTwo.length && !columnTwoAse.length && !columnThree.length) {
				return '<p class="description">' + this.escHtml(emptyText) + '</p>';
			}

			var sortByName = function(a, b) {
				return String(a.name || '').localeCompare(String(b.name || ''), undefined, { sensitivity: 'base' });
			};
			columnOne.sort(sortByName);
			columnTwo.sort(sortByName);
			columnTwoAse.sort(sortByName);
			columnThree.sort(sortByName);

			var contentLabel = asenhaSiteBackup.strings.syncPostTypesContentHeading || 'Pages, posts and custom post types';
			var supplementalLabel = asenhaSiteBackup.strings.syncPostTypesSupplementalHeading || 'Supplemental post types';
			var aseContentTypesLabel = asenhaSiteBackup.strings.syncPostTypesAseContentTypesHeading || 'ASE';
			var coreLabel = asenhaSiteBackup.strings.syncPostTypesCoreHeading || 'WordPress core post types';
			var selectAllLabel = asenhaSiteBackup.strings.syncSelectAll || 'Select all';
			var selectNoneLabel = asenhaSiteBackup.strings.syncSelectNone || 'Select none';
			var html = '<div class="asenha-sync-selection-list asenha-sync-selection-list-post-type-columns">';
			html += '<div class="asenha-sync-selection-column asenha-sync-selection-column-content">';
			html += this.renderPostTypeColumnHeadingHtml(contentLabel, 'content', this.areAllPostTypeItemsSelected(columnOne, selectedSet), columnOne.length > 0, selectAllLabel, selectNoneLabel);
			html += this.renderPostTypeColumnItemsHtml(columnOne, selectedSet);
			html += '</div>';
			html += '<div class="asenha-sync-selection-column asenha-sync-selection-column-media-revisions">';
			// Supplemental post types subgroup (attachment, revision).
			html += '<div class="asenha-sync-selection-subcolumn asenha-sync-selection-subcolumn-supplemental">';
			html += this.renderPostTypeColumnHeadingHtml(supplementalLabel, 'supplemental', this.areAllPostTypeItemsSelected(columnTwo, selectedSet), columnTwo.length > 0, selectAllLabel, selectNoneLabel);
			html += this.renderPostTypeColumnItemsHtml(columnTwo, selectedSet);
			html += '</div>';
			// ASE custom content types subgroup (asenha_cpt, asenha_ctax, asenha_cfgroup, asenha_options_page, options_page_config).
			html += '<div class="asenha-sync-selection-subcolumn asenha-sync-selection-subcolumn-ase-content-types">';
			html += this.renderPostTypeColumnHeadingHtml(aseContentTypesLabel, 'ase-content-types', this.areAllPostTypeItemsSelected(columnTwoAse, selectedSet), columnTwoAse.length > 0, selectAllLabel, selectNoneLabel);
			html += this.renderPostTypeColumnItemsHtml(columnTwoAse, selectedSet);
			html += '</div>';
			html += '</div>';
			html += '<div class="asenha-sync-selection-column asenha-sync-selection-column-core">';
			html += this.renderPostTypeColumnHeadingHtml(coreLabel, 'core', this.areAllPostTypeItemsSelected(columnThree, selectedSet), columnThree.length > 0, selectAllLabel, selectNoneLabel);
			html += this.renderPostTypeColumnItemsHtml(columnThree, selectedSet);
			html += '</div>';
			html += '</div>';

			return html;
		},

		areAllPostTypeItemsSelected: function(items, selectedSet) {
			var i = 0;
			if (!items || !items.length) {
				return false;
			}

			for (i = 0; i < items.length; i++) {
				var slug = String((items[i] && items[i].slug) ? items[i].slug : '');
				if (!slug || !selectedSet[slug]) {
					return false;
				}
			}

			return true;
		},

		renderPostTypeColumnHeadingHtml: function(headingLabel, columnKey, allSelected, hasItems, selectAllLabel, selectNoneLabel) {
			var actionLabel = allSelected ? selectNoneLabel : selectAllLabel;
			var disabledAttr = hasItems ? '' : ' disabled';
			var disabledClass = hasItems ? '' : ' is-disabled';
			var html = '<p class="asenha-sync-selection-column-heading">';
			html += '<span class="asenha-sync-selection-column-heading-label">' + this.escHtml(headingLabel) + '</span>';
			html += '<button type="button" class="button button-small asenha-sync-table-column-toggle asenha-sync-post-type-column-toggle' + disabledClass + '" data-column="' + this.escAttr(columnKey) + '"' + disabledAttr + '>' + this.escHtml(actionLabel) + '</button>';
			html += '</p>';

			return html;
		},

		renderPostTypeColumnItemsHtml: function(items, selectedSet) {
			var html = '';
			var i = 0;

			for (i = 0; i < items.length; i++) {
				var item = items[i] || {};
				var slug = String(item.slug || '');
				if (!slug) {
					continue;
				}

				var name = String(item.name || slug);
				html += '<div class="asenha-sync-selection-item" data-item-slug="' + this.escAttr(slug) + '">';
				html += '<label><input type="checkbox" class="asenha-sync-post-type-checkbox" value="' + this.escAttr(slug) + '"' + (selectedSet[slug] ? ' checked' : '') + ' /> ' + this.escHtml(name) + '</label>';
				html += '</div>';
			}

			return html;
		},

		renderAseCptDefinitionsSelectorHtml: function(items, selected) {
			items = items || [];
			selected = selected || [];

			var emptyText = asenhaSiteBackup.strings.syncAseCptDefinitionsEmpty || 'No ASE custom post type configurations found on the source.';
			if (!items.length) {
				return '<p class="description">' + this.escHtml(emptyText) + '</p>';
			}

			var selectedSet = {};
			var i = 0;
			for (i = 0; i < selected.length; i++) {
				selectedSet[String(selected[i] || '')] = true;
			}

			var normalized = [];
			for (i = 0; i < items.length; i++) {
				var item = items[i] || {};
				var slug = String(item.slug || '');
				if (!slug) {
					continue;
				}
				var name = String(item.name || slug);
				normalized.push({ slug: slug, name: name });
			}

			normalized.sort(function(a, b) {
				return String(a.name || '').localeCompare(String(b.name || ''), undefined, { sensitivity: 'base' });
			});

			var html = '<div class="asenha-sync-selection-list asenha-sync-selection-list-asenha-cpt-defs">';
			for (i = 0; i < normalized.length; i++) {
				var entry = normalized[i];
				html += '<div class="asenha-sync-selection-item" data-item-slug="' + this.escAttr(entry.slug) + '">';
				html += '<label><input type="checkbox" class="asenha-sync-asenha-cpt-def-checkbox" value="' + this.escAttr(entry.slug) + '"' + (selectedSet[entry.slug] ? ' checked' : '') + ' /> ' + this.escHtml(entry.name) + ' <span class="asenha-sync-selection-item-slug">(' + this.escHtml(entry.slug) + ')</span></label>';
				html += '</div>';
			}
			html += '</div>';

			return html;
		},

		/**
		 * Render checkbox list for the scoped Taxonomies selector.
		 *
		 * Mirrors renderAseCptDefinitionsSelectorHtml() but uses taxonomy-specific
		 * classes and messages. Each item carries the taxonomy slug as value and
		 * shows its plural label plus the slug in muted text for disambiguation.
		 *
		 * @param {Array} items    Inventory entries with { slug, plural_label | name }.
		 * @param {Array} selected Currently checked slugs.
		 * @return {string} HTML markup ready to inject into #asenha-sync-taxonomy-selector.
		 */
		renderTaxonomySelectorHtml: function(items, selected) {
			items = items || [];
			selected = selected || [];

			var emptyText = asenhaSiteBackup.strings.syncTaxonomyEmpty || 'No taxonomies found on the source.';
			if (!items.length) {
				return '<p class="description">' + this.escHtml(emptyText) + '</p>';
			}

			var selectedSet = {};
			var i = 0;
			for (i = 0; i < selected.length; i++) {
				selectedSet[String(selected[i] || '')] = true;
			}

			var normalized = [];
			for (i = 0; i < items.length; i++) {
				var item = items[i] || {};
				var slug = String(item.slug || '');
				if (!slug) {
					continue;
				}
				var name = String(item.name || item.plural_label || slug);
				normalized.push({ slug: slug, name: name });
			}

			normalized.sort(function(a, b) {
				return String(a.name || '').localeCompare(String(b.name || ''), undefined, { sensitivity: 'base' });
			});

			var html = '<div class="asenha-sync-selection-list asenha-sync-selection-list-taxonomies">';
			for (i = 0; i < normalized.length; i++) {
				var entry = normalized[i];
				html += '<div class="asenha-sync-selection-item" data-item-slug="' + this.escAttr(entry.slug) + '">';
				html += '<label><input type="checkbox" class="asenha-sync-taxonomy-checkbox" value="' + this.escAttr(entry.slug) + '"' + (selectedSet[entry.slug] ? ' checked' : '') + ' /> ' + this.escHtml(entry.name) + '</label>';
				html += '</div>';
			}
			html += '</div>';

			return html;
		},

		getAsenhaCptInventorySlugs: function() {
			var slugs = [];
			var list = (this.sourceInventory && this.sourceInventory.asenha_cpts) ? this.sourceInventory.asenha_cpts : [];
			var i = 0;

			for (i = 0; i < list.length; i++) {
				var slug = String((list[i] && list[i].slug) ? list[i].slug : '');
				if (slug) {
					slugs.push(slug);
				}
			}

			return slugs;
		},

		isAsenhaCptInScope: function(postTypesMode) {
			if (postTypesMode === 'all') {
				// In 'all' top mode, the new section is always hidden.
				return false;
			}

			var $topCheckbox = $('#asenha-sync-post-type-selector .asenha-sync-post-type-checkbox[value="asenha_cpt"]');

			if (postTypesMode === 'selected') {
				return $topCheckbox.length > 0 && $topCheckbox.is(':checked');
			}

			if (postTypesMode === 'except') {
				// Needs asenha_cpt to exist in the top selector and NOT be checked.
				return $topCheckbox.length > 0 && !$topCheckbox.is(':checked');
			}

			return false;
		},

		mirrorAseCptDefinitionSelections: function(source) {
			if (this.isMirroringAseCptSelections) {
				return;
			}

			var canonicalSlugs = this.getAsenhaCptInventorySlugs();
			if (!canonicalSlugs.length) {
				return;
			}

			this.isMirroringAseCptSelections = true;

			try {
				var i = 0;
				var slug = '';
				var $topCheckbox = null;
				var $defCheckbox = null;

				if (source === 'asenha-cpt-def-selector') {
					for (i = 0; i < canonicalSlugs.length; i++) {
						slug = canonicalSlugs[i];
						$defCheckbox = $('#asenha-sync-asenha-cpt-definitions-selector .asenha-sync-asenha-cpt-def-checkbox[value="' + slug.replace(/"/g, '\\"') + '"]');
						if (!$defCheckbox.length) {
							continue;
						}
						$topCheckbox = $('#asenha-sync-post-type-selector .asenha-sync-post-type-checkbox[value="' + slug.replace(/"/g, '\\"') + '"]');
						if (!$topCheckbox.length) {
							continue;
						}

						var isDefChecked = $defCheckbox.is(':checked');
						if ($topCheckbox.is(':checked') !== isDefChecked) {
							$topCheckbox.prop('checked', isDefChecked);
						}
					}

					this.updateSyncPostTypeColumnToggleLabels();
				} else {
					for (i = 0; i < canonicalSlugs.length; i++) {
						slug = canonicalSlugs[i];
						$topCheckbox = $('#asenha-sync-post-type-selector .asenha-sync-post-type-checkbox[value="' + slug.replace(/"/g, '\\"') + '"]');
						$defCheckbox = $('#asenha-sync-asenha-cpt-definitions-selector .asenha-sync-asenha-cpt-def-checkbox[value="' + slug.replace(/"/g, '\\"') + '"]');
						if (!$defCheckbox.length) {
							continue;
						}
						// If the slug is not present in the top selector (e.g. top
						// selector list is currently empty or not yet rendered), leave
						// the new section state untouched.
						if (!$topCheckbox.length) {
							continue;
						}

						var isTopChecked = $topCheckbox.is(':checked');
						if ($defCheckbox.is(':checked') !== isTopChecked) {
							$defCheckbox.prop('checked', isTopChecked);
						}
					}
				}
			} finally {
				this.isMirroringAseCptSelections = false;
			}
		},

		/**
		 * Render the ASE Custom Taxonomy Definitions checkbox list.
		 *
		 * Mirrors renderAseCptDefinitionsSelectorHtml() but uses ctax-specific
		 * classes and empty-state messaging. Each item carries the ctax_key slug
		 * (which is also the registered taxonomy slug) as the checkbox value.
		 *
		 * @param {Array} items    Inventory entries with { slug, name }.
		 * @param {Array} selected Currently checked slugs (persisted across renders).
		 * @return {string} HTML markup ready to inject into #asenha-sync-asenha-ctax-definitions-selector.
		 */
		renderAseCtaxDefinitionsSelectorHtml: function(items, selected) {
			items = items || [];
			selected = selected || [];

			var emptyText = asenhaSiteBackup.strings.syncAseCtaxDefinitionsEmpty || 'No ASE custom taxonomy configurations found on the source.';
			if (!items.length) {
				return '<p class="description">' + this.escHtml(emptyText) + '</p>';
			}

			var selectedSet = {};
			var i = 0;
			for (i = 0; i < selected.length; i++) {
				selectedSet[String(selected[i] || '')] = true;
			}

			var normalized = [];
			for (i = 0; i < items.length; i++) {
				var item = items[i] || {};
				var slug = String(item.slug || '');
				if (!slug) {
					continue;
				}
				var name = String(item.name || slug);
				normalized.push({ slug: slug, name: name });
			}

			normalized.sort(function(a, b) {
				return String(a.name || '').localeCompare(String(b.name || ''), undefined, { sensitivity: 'base' });
			});

			var html = '<div class="asenha-sync-selection-list asenha-sync-selection-list-asenha-ctax-defs">';
			for (i = 0; i < normalized.length; i++) {
				var entry = normalized[i];
				html += '<div class="asenha-sync-selection-item" data-item-slug="' + this.escAttr(entry.slug) + '">';
				html += '<label><input type="checkbox" class="asenha-sync-asenha-ctax-def-checkbox" value="' + this.escAttr(entry.slug) + '"' + (selectedSet[entry.slug] ? ' checked' : '') + ' /> ' + this.escHtml(entry.name) + ' <span class="asenha-sync-selection-item-slug">(' + this.escHtml(entry.slug) + ')</span></label>';
				html += '</div>';
			}
			html += '</div>';

			return html;
		},

		/**
		 * Collect all canonical ctax_key slugs advertised by the source inventory.
		 *
		 * These slugs define the intersection used by mirrorAseCtaxDefinitionSelections()
		 * between the top taxonomy selector and the new ASE Custom Taxonomy
		 * Definitions selector. Slugs not present in this list are never mirrored
		 * (which protects built-in / non-ASE taxonomies like category, post_tag).
		 *
		 * @return {Array<string>} Array of ctax_key slugs.
		 */
		getAsenhaCtaxInventorySlugs: function() {
			var slugs = [];
			var list = (this.sourceInventory && this.sourceInventory.asenha_ctaxes) ? this.sourceInventory.asenha_ctaxes : [];
			var i = 0;

			for (i = 0; i < list.length; i++) {
				var slug = String((list[i] && list[i].slug) ? list[i].slug : '');
				if (slug) {
					slugs.push(slug);
				}
			}

			return slugs;
		},

		/**
		 * Determine whether the asenha_ctax post type is effectively in scope for sync.
		 *
		 * Mirrors isAsenhaCptInScope() but keyed on the asenha_ctax row in the top
		 * post-type selector. Returns false in "all" top mode (the new section is
		 * always hidden there since the effective behavior is "no filtering").
		 *
		 * @param {string} postTypesMode Current value of the post-types filter select.
		 * @return {boolean}
		 */
		isAsenhaCtaxInScope: function(postTypesMode) {
			if (postTypesMode === 'all') {
				return false;
			}

			var $topCheckbox = $('#asenha-sync-post-type-selector .asenha-sync-post-type-checkbox[value="asenha_ctax"]');

			if (postTypesMode === 'selected') {
				return $topCheckbox.length > 0 && $topCheckbox.is(':checked');
			}

			if (postTypesMode === 'except') {
				return $topCheckbox.length > 0 && !$topCheckbox.is(':checked');
			}

			return false;
		},

		/**
		 * Render the ASE Custom Field Group Definitions checkbox list.
		 *
		 * Mirrors renderAseCtaxDefinitionsSelectorHtml() but uses cfgroup-specific
		 * classes and empty-state messaging. Each item carries the asenha_cfgroup
		 * post_name slug as the checkbox value. Unlike CPT / CTAX definitions, the
		 * cfgroup list has no sibling selector to mirror, so no mirror-seed call
		 * is performed after rendering.
		 *
		 * @param {Array} items    Inventory entries with { slug, name }.
		 * @param {Array} selected Currently checked slugs (persisted across renders).
		 * @return {string} HTML markup ready to inject into #asenha-sync-asenha-cfgroup-definitions-selector.
		 */
		renderAseCfgroupDefinitionsSelectorHtml: function(items, selected) {
			items = items || [];
			selected = selected || [];

			var emptyText = asenhaSiteBackup.strings.syncAseCfgroupDefinitionsEmpty || 'No ASE custom field group configurations found on the source.';
			if (!items.length) {
				return '<p class="description">' + this.escHtml(emptyText) + '</p>';
			}

			var selectedSet = {};
			var i = 0;
			for (i = 0; i < selected.length; i++) {
				selectedSet[String(selected[i] || '')] = true;
			}

			var normalized = [];
			for (i = 0; i < items.length; i++) {
				var item = items[i] || {};
				var slug = String(item.slug || '');
				if (!slug) {
					continue;
				}
				var name = String(item.name || slug);
				normalized.push({ slug: slug, name: name });
			}

			normalized.sort(function(a, b) {
				return String(a.name || '').localeCompare(String(b.name || ''), undefined, { sensitivity: 'base' });
			});

			var html = '<div class="asenha-sync-selection-list asenha-sync-selection-list-asenha-cfgroup-defs">';
			for (i = 0; i < normalized.length; i++) {
				var entry = normalized[i];
				html += '<div class="asenha-sync-selection-item" data-item-slug="' + this.escAttr(entry.slug) + '">';
				html += '<label><input type="checkbox" class="asenha-sync-asenha-cfgroup-def-checkbox" value="' + this.escAttr(entry.slug) + '"' + (selectedSet[entry.slug] ? ' checked' : '') + ' /> ' + this.escHtml(entry.name) + ' <span class="asenha-sync-selection-item-slug">(' + this.escHtml(entry.slug) + ')</span></label>';
				html += '</div>';
			}
			html += '</div>';

			return html;
		},

		/**
		 * Determine whether the asenha_cfgroup post type is effectively in scope for sync.
		 *
		 * Mirrors isAsenhaCtaxInScope() but keyed on the asenha_cfgroup row in the
		 * top post-type selector. Returns false in "all" top mode (the new section
		 * is always hidden there since the effective behavior is "no filtering").
		 *
		 * @param {string} postTypesMode Current value of the post-types filter select.
		 * @return {boolean}
		 */
		isAsenhaCfgroupInScope: function(postTypesMode) {
			if (postTypesMode === 'all') {
				return false;
			}

			var $topCheckbox = $('#asenha-sync-post-type-selector .asenha-sync-post-type-checkbox[value="asenha_cfgroup"]');

			if (postTypesMode === 'selected') {
				return $topCheckbox.length > 0 && $topCheckbox.is(':checked');
			}

			if (postTypesMode === 'except') {
				return $topCheckbox.length > 0 && !$topCheckbox.is(':checked');
			}

			return false;
		},

		/**
		 * Bidirectionally mirror checkbox state between the top Taxonomies selector
		 * (#asenha-sync-taxonomy-selector) and the new ASE Custom Taxonomy Definitions
		 * selector (#asenha-sync-asenha-ctax-definitions-selector), limited to slugs
		 * that appear in the asenha_ctaxes source inventory (i.e. ASE-registered
		 * taxonomies only). Built-in taxonomies are never toggled by this helper.
		 *
		 * Uses isMirroringAseCtaxSelections as a recursion guard to prevent the
		 * change-event handlers on each side from re-triggering the other side in
		 * an infinite loop.
		 *
		 * @param {string} source Origin of the change: 'taxonomy-selector' or 'asenha-ctax-def-selector'.
		 */
		mirrorAseCtaxDefinitionSelections: function(source) {
			if (this.isMirroringAseCtaxSelections) {
				return;
			}

			var canonicalSlugs = this.getAsenhaCtaxInventorySlugs();
			if (!canonicalSlugs.length) {
				return;
			}

			this.isMirroringAseCtaxSelections = true;

			try {
				var i = 0;
				var slug = '';
				var $taxCheckbox = null;
				var $defCheckbox = null;

				if (source === 'asenha-ctax-def-selector') {
					for (i = 0; i < canonicalSlugs.length; i++) {
						slug = canonicalSlugs[i];
						$defCheckbox = $('#asenha-sync-asenha-ctax-definitions-selector .asenha-sync-asenha-ctax-def-checkbox[value="' + slug.replace(/"/g, '\\"') + '"]');
						if (!$defCheckbox.length) {
							continue;
						}
						$taxCheckbox = $('#asenha-sync-taxonomy-selector .asenha-sync-taxonomy-checkbox[value="' + slug.replace(/"/g, '\\"') + '"]');
						if (!$taxCheckbox.length) {
							continue;
						}

						var isDefChecked = $defCheckbox.is(':checked');
						if ($taxCheckbox.is(':checked') !== isDefChecked) {
							$taxCheckbox.prop('checked', isDefChecked);
						}
					}
				} else {
					for (i = 0; i < canonicalSlugs.length; i++) {
						slug = canonicalSlugs[i];
						$taxCheckbox = $('#asenha-sync-taxonomy-selector .asenha-sync-taxonomy-checkbox[value="' + slug.replace(/"/g, '\\"') + '"]');
						$defCheckbox = $('#asenha-sync-asenha-ctax-definitions-selector .asenha-sync-asenha-ctax-def-checkbox[value="' + slug.replace(/"/g, '\\"') + '"]');
						if (!$defCheckbox.length) {
							continue;
						}
						// If the slug is not present in the top taxonomy selector
						// (list empty / not yet rendered), leave ctax state as-is.
						if (!$taxCheckbox.length) {
							continue;
						}

						var isTaxChecked = $taxCheckbox.is(':checked');
						if ($defCheckbox.is(':checked') !== isTaxChecked) {
							$defCheckbox.prop('checked', isTaxChecked);
						}
					}
				}
			} finally {
				this.isMirroringAseCtaxSelections = false;
			}
		},

		startSync: function() {
			var self = this;

			if (!self.remoteSession) {
				alert(asenhaSiteBackup.strings.syncNotConnected || 'Please connect to a remote site first.');
				return;
			}

			var direction = self.getSelectedDirection();
			var syncDb = $('#asenha-sync-database').is(':checked');
			var syncMedia = $('#asenha-sync-media').is(':checked');
			var syncThemes = $('#asenha-sync-themes').is(':checked');
			var syncPlugins = $('#asenha-sync-plugins').is(':checked');
			var syncOtherWpContent = $('#asenha-sync-other-wp-content').is(':checked');
			var registerMediaAttachments = $('#asenha-sync-register-media-attachments').is(':checked');
			var dbTablesMode = $('select[name="asenha_sync_db_tables"]').val() || 'all';
			var themesFilter = $('select[name="asenha_sync_themes_filter"]').val() || 'all';
			var pluginsFilter = $('select[name="asenha_sync_plugins_filter"]').val() || 'all';
			var postTypesFilter = $('select[name="asenha_sync_post_types_filter"]').val() || 'all';
			var otherWpContentMode = $('select[name="asenha_sync_other_wp_content_filter"]').val() || 'all';
			var syncMediaMode = $('#asenha-sync-media-mode').val() || 'all';
			var selectedTables = [];
			var selectedThemes = [];
			var selectedPlugins = [];
			var selectedPostTypes = [];
			var selectedOtherWpContentPaths = [];
			var postsInScope = self.isPostsTableInScope(syncDb, dbTablesMode);

			if (!syncDb && !syncMedia && !syncThemes && !syncPlugins && !syncOtherWpContent) {
				alert(asenhaSiteBackup.strings.syncSelectComponent || 'Please select at least one component to sync.');
				return;
			}

			if (syncDb && dbTablesMode === 'selected') {
				selectedTables = self.getSelectedValues('#asenha-sync-table-selector .asenha-sync-table-checkbox');
				if (!selectedTables.length) {
					alert(asenhaSiteBackup.strings.syncSelectAtLeastOneTable || 'Please select at least one table.');
					return;
				}
			}

			if (syncThemes && themesFilter === 'selected') {
				selectedThemes = self.getSelectedValues('#asenha-sync-theme-selector .asenha-sync-theme-checkbox');
				if (!selectedThemes.length) {
					alert(asenhaSiteBackup.strings.syncSelectAtLeastOneTheme || 'Please select at least one theme.');
					return;
				}
			}

			if (syncPlugins && (pluginsFilter === 'selected' || pluginsFilter === 'except')) {
				selectedPlugins = self.getSelectedValues('#asenha-sync-plugin-selector .asenha-sync-plugin-checkbox');
				if (pluginsFilter === 'selected' && !selectedPlugins.length) {
					alert(asenhaSiteBackup.strings.syncSelectAtLeastOnePlugin || 'Please select at least one plugin.');
					return;
				}
			}

			if (syncDb && postsInScope && (postTypesFilter === 'selected' || postTypesFilter === 'except')) {
				selectedPostTypes = self.getSelectedValues('#asenha-sync-post-type-selector .asenha-sync-post-type-checkbox');
				if (postTypesFilter === 'selected' && !selectedPostTypes.length) {
					alert(asenhaSiteBackup.strings.syncSelectAtLeastOnePostType || 'Please select at least one post type.');
					return;
				}
			} else {
				postTypesFilter = 'all';
			}

			// Resolve the ASE Custom Post Type Configurations filter payload.
			var asenhaCptDefsFilter = 'all';
			var selectedAsenhaCptDefs = [];
			var asenhaCptInScope = syncDb && postsInScope && self.isAsenhaCptInScope(postTypesFilter);
			if (asenhaCptInScope) {
				asenhaCptDefsFilter = $('select[name="asenha_sync_asenha_cpt_definitions_filter"]').val() || 'selected';
				if (asenhaCptDefsFilter !== 'all') {
					selectedAsenhaCptDefs = self.getSelectedValues('#asenha-sync-asenha-cpt-definitions-selector .asenha-sync-asenha-cpt-def-checkbox');
					if (asenhaCptDefsFilter === 'selected' && !selectedAsenhaCptDefs.length) {
						alert(asenhaSiteBackup.strings.syncSelectAtLeastOneAseCptDefinition || 'Please select at least one ASE post type definition.');
						return;
					}
				}
			}

			// Resolve the scoped Taxonomies filter payload. This mirrors the ASE
			// CPT Definitions gating: the filter is only honored when the post-types
			// filter actively narrows sync (selected/except) AND posts are in scope.
			// Otherwise collapse to "all" so the server doesn't have to re-validate.
			var taxonomiesFilter = 'all';
			var selectedTaxonomies = [];
			var taxonomiesInScope = syncDb && postsInScope && (postTypesFilter === 'selected' || postTypesFilter === 'except');
			if (taxonomiesInScope) {
				taxonomiesFilter = $('select[name="asenha_sync_taxonomies_filter"]').val() || 'all';
				if (taxonomiesFilter !== 'all') {
					selectedTaxonomies = self.getSelectedValues('#asenha-sync-taxonomy-selector .asenha-sync-taxonomy-checkbox');
					if (taxonomiesFilter === 'selected' && !selectedTaxonomies.length) {
						alert(asenhaSiteBackup.strings.syncSelectAtLeastOneTaxonomy || 'Please select at least one taxonomy.');
						return;
					}
				}
			}

			// Resolve the ASE Custom Taxonomy Definitions filter payload. Follows
			// the exact same gating pattern as the CPT Definitions block above.
			// When asenha_ctax isn't in scope, coerce to "all" + empty so the
			// server doesn't attempt to apply a restrictive subquery.
			var asenhaCtaxDefsFilter = 'all';
			var selectedAsenhaCtaxDefs = [];
			var asenhaCtaxInScope = syncDb && postsInScope && self.isAsenhaCtaxInScope(postTypesFilter);
			if (asenhaCtaxInScope) {
				asenhaCtaxDefsFilter = $('select[name="asenha_sync_asenha_ctax_definitions_filter"]').val() || 'selected';
				if (asenhaCtaxDefsFilter !== 'all') {
					selectedAsenhaCtaxDefs = self.getSelectedValues('#asenha-sync-asenha-ctax-definitions-selector .asenha-sync-asenha-ctax-def-checkbox');
					if (asenhaCtaxDefsFilter === 'selected' && !selectedAsenhaCtaxDefs.length) {
						alert(asenhaSiteBackup.strings.syncSelectAtLeastOneAseCtaxDefinition || 'Please select at least one ASE taxonomy definition.');
						return;
					}
				}
			}

			// Resolve the ASE Custom Field Group Definitions filter payload.
			// Follows the same gating pattern as CPT / CTAX Definitions blocks
			// above. Unlike those, cfgroup slugs live in posts.post_name (not
			// postmeta), and there's no sibling selector to mirror against.
			var asenhaCfgroupDefsFilter = 'all';
			var selectedAsenhaCfgroupDefs = [];
			var asenhaCfgroupInScope = syncDb && postsInScope && self.isAsenhaCfgroupInScope(postTypesFilter);
			if (asenhaCfgroupInScope) {
				asenhaCfgroupDefsFilter = $('select[name="asenha_sync_asenha_cfgroup_definitions_filter"]').val() || 'selected';
				if (asenhaCfgroupDefsFilter !== 'all') {
					selectedAsenhaCfgroupDefs = self.getSelectedValues('#asenha-sync-asenha-cfgroup-definitions-selector .asenha-sync-asenha-cfgroup-def-checkbox');
					if (asenhaCfgroupDefsFilter === 'selected' && !selectedAsenhaCfgroupDefs.length) {
						alert(asenhaSiteBackup.strings.syncSelectAtLeastOneAseCfgroupDefinition || 'Please select at least one ASE field group definition.');
						return;
					}
				}
			}

			if (syncOtherWpContent) {
				if (otherWpContentMode !== 'manual') {
					otherWpContentMode = 'all';
				} else {
					selectedOtherWpContentPaths = self.getSelectedOtherWpContentPaths();
					if (!selectedOtherWpContentPaths.length) {
						alert(asenhaSiteBackup.strings.syncSelectAtLeastOneOtherWpContent || 'Please select at least one wp-content item.');
						return;
					}
				}
			} else {
				otherWpContentMode = 'all';
			}

			var forceRegisterMedia = self.shouldForceMediaAttachmentRegistration(syncMedia, syncDb, dbTablesMode, postTypesFilter);
			var effectiveRegisterMediaAttachments = syncMedia && (forceRegisterMedia || registerMediaAttachments);

			// Confirm destructive operation.
			var confirmMsg = direction === 'push'
				? (asenhaSiteBackup.strings.syncPushConfirm || 'This will overwrite data on the remote site. Continue?')
				: (asenhaSiteBackup.strings.syncPullConfirm || 'This will overwrite data on this site. Continue?');
			if (!confirm(confirmMsg)) {
				return;
			}

			// Collect custom replace pairs.
			var customPairs = [];
			$('#asenha-sync-replace-pairs .asenha-sync-replace-pair:not(.asenha-sync-auto-pair)').each(function() {
				var search = $(this).find('.asenha-sync-search').val();
				var replace = $(this).find('.asenha-sync-replace').val();
				if (search && replace) {
					customPairs.push({ search: search, replace: replace });
				}
			});

			// Collect preserve options.
			var preserveOptions = [];
			$('input[name="asenha_sync_preserve[]"]:checked').each(function() {
				preserveOptions.push($(this).val());
			});

			// Guard against submitting used_by_posts mode without its prerequisites.
			if (syncMedia && syncMediaMode === 'used_by_posts') {
				var eligibleForUsedByPosts = syncDb && dbTablesMode === 'selected' && postsInScope && (postTypesFilter === 'selected' || postTypesFilter === 'except');
				if (!eligibleForUsedByPosts) {
					alert(asenhaSiteBackup.strings.syncMediaModeUsedByPostsUnavailable || '"Only files used by selected posts" requires Database sync with selected tables including posts, and "Selected post types only" / "Except selected post types".');
					return;
				}
			}

			var postData = {
				action: 'asenha_sync_start',
				_nonce: asenhaSiteBackup.nonce,
				direction: direction,
				sync_database: syncDb ? '1' : '',
				sync_media: syncMedia ? '1' : '',
				sync_media_mode: syncMediaMode,
				register_media_attachments: effectiveRegisterMediaAttachments ? '1' : '',
				sync_themes: syncThemes ? '1' : '',
				sync_plugins: syncPlugins ? '1' : '',
				sync_other_wp_content: syncOtherWpContent ? '1' : '',
				sync_db_tables_mode: dbTablesMode,
				selected_tables: selectedTables,
				sync_themes_filter: themesFilter,
				selected_themes: selectedThemes,
				sync_plugins_filter: pluginsFilter,
				selected_plugins: selectedPlugins,
				sync_other_wp_content_mode: otherWpContentMode,
				selected_other_wp_content_paths: selectedOtherWpContentPaths,
				sync_post_types_filter: postTypesFilter,
				selected_post_types: selectedPostTypes,
				sync_asenha_cpt_definitions_filter: asenhaCptDefsFilter,
				selected_asenha_cpt_definitions: selectedAsenhaCptDefs,
				sync_taxonomies_filter: taxonomiesFilter,
				selected_taxonomies: selectedTaxonomies,
				sync_asenha_ctax_definitions_filter: asenhaCtaxDefsFilter,
				selected_asenha_ctax_definitions: selectedAsenhaCtaxDefs,
				sync_asenha_cfgroup_definitions_filter: asenhaCfgroupDefsFilter,
				selected_asenha_cfgroup_definitions: selectedAsenhaCfgroupDefs,
				preserve_options_present: '1',
				preserve_options: preserveOptions,
				custom_pairs: customPairs,
				delete_orphaned: $('#asenha-sync-delete-orphaned').is(':checked') ? '1' : '',
				exclusion_patterns: $('#asenha-sync-exclusion-patterns').val() || ''
			};

			// Show progress UI.
			self.startTime = Date.now();
			self.lastProgressPct = 0;
			if (direction === 'pull' && syncDb && SiteBackup && typeof SiteBackup.suspendHeartbeat === 'function') {
				// Pull + DB swap can invalidate the current session; suppress interim login until sync UI completes.
				SiteBackup.suspendHeartbeat();
				self.heartbeatSuspended = true;
			}
			$('#asenha-sync-start').prop('disabled', true).hide();
			$('#asenha-sync-cancel').show();
			$('#asenha-sync-progress').slideDown(200);
			$('#asenha-sync-progress-time').text('');
			$('#asenha-sync-progress-details').empty();
			self.setGranularPanelState('');
			self.setProgressBarCompleteState(false);
			self.updateProgress(0, asenhaSiteBackup.strings.syncInitializing || 'Initializing...', 'running');

			$.post(ajaxurl, postData, function(response) {
				if (response.success && response.data.sync_id) {
					self.syncId = response.data.sync_id;
					self.startProgressPolling();
				} else {
					var msg = (response.data && response.data.message) ? response.data.message : (asenhaSiteBackup.strings.syncStartFailed || 'Failed to start sync.');
					self.showResult('error', msg);
					self.resetUI();
				}
			}).fail(function() {
				self.showResult('error', asenhaSiteBackup.strings.syncStartFailed || 'Failed to start sync.');
				self.resetUI();
			});
		},

		cancelSync: function() {
			var self = this;

			if (!self.syncId) {
				return;
			}

			$.post(ajaxurl, {
				action: 'asenha_sync_cancel',
				_nonce: asenhaSiteBackup.nonce,
				sync_id: self.syncId
			});

			self.stopProgressPolling();
			self.showResult('warning', asenhaSiteBackup.strings.syncCancelled || 'Sync cancelled.');
			self.resetUI();
		},

		startProgressPolling: function() {
			var self = this;
			var useNoAuth = false;
			var consecutiveErrors = 0;
			self.stopProgressPolling();

			var handleProgressResponse = function(response) {
				if (!response || !response.success) {
					return false;
				}

				consecutiveErrors = 0;
				var data = response.data || {};
				var progress = data.progress || 0;
				var message = data.message || '';
				var status = data.status || 'running';
				self.updateProgress(progress, message, status);
				self.renderGranularProgress(data);

				if (status === 'completed' || status === 'completed_with_errors') {
					self.stopProgressPolling();
					var resultType = status === 'completed' ? 'success' : 'warning';
					var resultMsg = message;
					if (data.result) {
						resultMsg = self.buildResultSummary(data.result);
					}
					self.renderGranularProgress(data, resultMsg, resultType);
					self.resetUI('completed');
				} else if (status === 'failed') {
					self.stopProgressPolling();
					// Render an actionable remediation block when the
					// failure was caused by a remote WordPress bootstrap
					// fatal - otherwise fall back to the plain error
					// summary. `error_code` / `error_data` come from
					// finalize_sync_result() in class-site-backup-sync.php.
					var errorCode = data.error_code || '';
					if (errorCode === 'remote_bootstrap_fatal') {
						self.showBootstrapFatalRemediation(data);
					} else {
						self.showResult('error', message || (asenhaSiteBackup.strings.syncFailed || 'Sync failed.'));
					}
					self.resetUI();
				} else if (status === 'cancelled') {
					self.stopProgressPolling();
					self.showResult('warning', asenhaSiteBackup.strings.syncCancelled || 'Sync cancelled.');
					self.resetUI();
				}

				return true;
			};

			var doPollNoAuth = function() {
				$.post(ajaxurl, {
					action: 'asenha_sync_get_progress_noauth',
					sync_id: self.syncId
				}, function(response) {
					if (!handleProgressResponse(response)) {
						consecutiveErrors++;
					}
				}).fail(function() {
					consecutiveErrors++;
				});
			};

			var doPollAuth = function() {
				$.post(ajaxurl, {
					action: 'asenha_sync_get_progress',
					_nonce: asenhaSiteBackup.nonce,
					sync_id: self.syncId
				}, function(response) {
					if (handleProgressResponse(response)) {
						return;
					}

					consecutiveErrors++;
					if (consecutiveErrors >= 2) {
						useNoAuth = true;
						doPollNoAuth();
					}
				}).fail(function() {
					consecutiveErrors++;
					if (consecutiveErrors >= 2) {
						useNoAuth = true;
						doPollNoAuth();
					}
				});
			};

			var doPoll = function() {
				if (!self.syncId) {
					self.stopProgressPolling();
					return;
				}

				if (useNoAuth) {
					doPollNoAuth();
					return;
				}

				doPollAuth();
			};

			// Poll immediately, then every 2 seconds.
			doPoll();
			self.progressInterval = setInterval(doPoll, 2000);
		},

		stopProgressPolling: function() {
			if (this.progressInterval) {
				clearInterval(this.progressInterval);
				this.progressInterval = null;
			}
		},

		updateProgress: function(percent, message, status) {
			percent = Math.min(100, Math.max(0, percent));
			if (status === 'completed' || status === 'completed_with_errors') {
				percent = 100;
			} else if (typeof this.lastProgressPct === 'number') {
				percent = Math.max(percent, this.lastProgressPct);
			}
			this.lastProgressPct = percent;
			$('#asenha-sync-progress-bar').css('width', percent + '%');
			$('#asenha-sync-progress-pct').text(Math.round(percent) + '%');

			if (status === 'completed' || status === 'completed_with_errors') {
				this.setProgressBarCompleteState(percent >= 100);
			} else {
				this.setProgressBarCompleteState(false);
			}

			if (message) {
				$('#asenha-sync-progress-message').text(message);
			}

			// Elapsed time and ETA.
			if (this.startTime) {
				var elapsed = (Date.now() - this.startTime) / 1000;
				var elapsedStr = this.formatDuration(elapsed);
				var etaStr = '';

				if (percent > 2 && percent < 100) {
					var remaining = (elapsed / percent) * (100 - percent);
					etaStr = ' | ' + (asenhaSiteBackup.strings.remaining || 'Remaining:') + ' ~' + this.formatDuration(remaining);
				}

				var timeInfo = (asenhaSiteBackup.strings.elapsed || 'Elapsed:') + ' ' + elapsedStr + etaStr;
				$('#asenha-sync-progress-time').text(timeInfo);
			}
		},

		setProgressBarCompleteState: function(isComplete) {
			$('#asenha-sync-progress-bar').toggleClass('asenha-sync-progress-bar-complete', !!isComplete);
		},

		setGranularPanelState: function(type) {
			var $panel = $('#asenha-sync-progress-details');
			$panel.removeClass('asenha-sync-result-success asenha-sync-result-error asenha-sync-result-warning');
			if (type) {
				$panel.addClass('asenha-sync-result-' + type);
			}
		},

		formatTemplate: function(template, values) {
			var output = String(template || '');
			if (!values || !values.length) {
				return output;
			}

			for (var i = 0; i < values.length; i++) {
				// Support WP-style positional placeholders (e.g. %1$s, %2$d).
				var token = new RegExp('%' + (i + 1) + '\\$[a-zA-Z]', 'g');
				output = output.replace(token, String(values[i]));
			}

			return output;
		},

		formatCount: function(num) {
			var value = parseInt(num, 10);
			if (!isFinite(value)) {
				value = 0;
			}
			return value.toLocaleString();
		},

		formatMegabytes: function(bytes) {
			var value = Number(bytes);
			if (!isFinite(value) || value < 0) {
				value = 0;
			}
			return (value / 1048576).toFixed(1) + ' MB';
		},

		renderGranularProgress: function(data, summaryMessage, panelType) {
			var components = (data && data.components) ? data.components : {};
			var status = (data && data.status) ? String(data.status) : 'running';
			var direction = (data && data.direction) ? String(data.direction) : this.getSelectedDirection();
			var presentVerb = direction === 'push' ? (asenhaSiteBackup.strings.syncPushing || 'Pushing') : (asenhaSiteBackup.strings.syncPulling || 'Pulling');
			var pastVerb = direction === 'push' ? (asenhaSiteBackup.strings.syncPushed || 'Pushed') : (asenhaSiteBackup.strings.syncPulled || 'Pulled');
			var lines = [];
			var lineStates = [];
			var db = components.database || null;
			var media = components.media || null;
			var themes = components.themes || null;
			var plugins = components.plugins || null;
			var otherWpContent = components.other_wp_content || null;

			var dbRunningTpl = asenhaSiteBackup.strings.syncDbRunningTpl || '%1$s %2$d of %3$d tables (%4$s rows)';
			var dbCompletedTpl = asenhaSiteBackup.strings.syncDbCompletedTpl || '%1$s %2$d tables (%3$d rows)';
			var mediaProgressTpl = asenhaSiteBackup.strings.syncMediaProgressTpl || '%1$s media library: %2$d of %3$d files';
			var mediaCompletedTpl = asenhaSiteBackup.strings.syncMediaCompletedTpl || '%1$s media library: %2$d files (%3$s)';
			var themesProgressTpl = asenhaSiteBackup.strings.syncThemesProgressTpl || '%1$s themes: %2$d of %3$d themes';
			var themesCompletedTpl = asenhaSiteBackup.strings.syncThemesCompletedTpl || '%1$s %2$d themes (%3$d files, %4$s)';
			var pluginsProgressTpl = asenhaSiteBackup.strings.syncPluginsProgressTpl || '%1$s plugins: %2$d of %3$d plugins';
			var pluginsCompletedTpl = asenhaSiteBackup.strings.syncPluginsCompletedTpl || '%1$s %2$d plugins (%3$d files, %4$s)';
			var otherWpContentProgressTpl = asenhaSiteBackup.strings.syncOtherWpContentProgressTpl || '%1$s other wp-content files: %2$d of %3$d files';
			var otherWpContentCompletedTpl = asenhaSiteBackup.strings.syncOtherWpContentCompletedTpl || '%1$s other wp-content files (%2$d files, %3$s)';
			var isComponentDone = function(component) {
				var componentStatus = String((component && component.status) || '');
				var componentProgress = parseFloat((component && component.progress) || 0);
				if (!isFinite(componentProgress)) {
					componentProgress = 0;
				}

				return (
					status === 'completed' ||
					status === 'completed_with_errors' ||
					(
						(componentStatus === 'completed' || componentStatus === 'completed_with_errors') &&
						componentProgress >= 100
					)
				);
			};

			if (db && db.active) {
				var dbDone = isComponentDone(db);
				if (dbDone) {
					var dbTables = parseInt(db.tables_count || db.total_tables || (data && data.result ? data.result.tables_count : 0), 10) || 0;
					var dbRows = parseInt(db.rows_count || (data && data.result ? data.result.rows_count : 0), 10) || 0;
					lines.push(this.formatTemplate(dbCompletedTpl, [pastVerb, this.formatCount(dbTables), this.formatCount(dbRows)]));
					lineStates.push('is-completed');
				} else {
					var tableIndex = parseInt(db.table_index || 0, 10) || 0;
					var totalTables = parseInt(db.total_tables || 0, 10) || 0;
					var tablesSynced = parseInt(db.tables_synced || 0, 10) || 0;
					var rowsSynced = parseInt(db.rows_count || 0, 10) || 0;
					if (tablesSynced <= 0 && tableIndex > 0) {
						tablesSynced = Math.max(0, tableIndex - 1);
					}
					if (totalTables > 0 && tablesSynced > totalTables) {
						tablesSynced = totalTables;
					}
					lines.push(this.formatTemplate(dbRunningTpl, [pastVerb, this.formatCount(tablesSynced), this.formatCount(totalTables), this.formatCount(rowsSynced)]));
					lineStates.push('is-running');
				}
			}

			if (media && media.active) {
				var mediaDone = isComponentDone(media);
				var mediaFiles = parseInt(media.files_transferred || media.current_files || 0, 10) || 0;
				var mediaTotalFiles = parseInt(media.total_files || 0, 10) || 0;
				var mediaBytes = parseInt(media.bytes_transferred || 0, 10) || 0;
				if (mediaDone) {
					lines.push(this.formatTemplate(mediaCompletedTpl, [pastVerb, this.formatCount(mediaFiles), this.formatMegabytes(mediaBytes)]));
					lineStates.push('is-completed');
				} else {
					lines.push(this.formatTemplate(mediaProgressTpl, [presentVerb, this.formatCount(mediaFiles), this.formatCount(mediaTotalFiles)]));
					lineStates.push('is-running');
				}
			}

			if (themes && themes.active) {
				var themesDone = isComponentDone(themes);
				var themesDoneCount = parseInt(themes.entities_completed || 0, 10) || 0;
				var themesTotalCount = parseInt(themes.entities_total || 0, 10) || 0;
				var themesFiles = parseInt(themes.files_transferred || themes.current_files || 0, 10) || 0;
				var themesBytes = parseInt(themes.bytes_transferred || 0, 10) || 0;
				if (themesDone) {
					var completedThemes = themesTotalCount > 0 ? themesTotalCount : themesDoneCount;
					lines.push(this.formatTemplate(themesCompletedTpl, [pastVerb, this.formatCount(completedThemes), this.formatCount(themesFiles), this.formatMegabytes(themesBytes)]));
					lineStates.push('is-completed');
				} else {
					lines.push(this.formatTemplate(themesProgressTpl, [presentVerb, this.formatCount(themesDoneCount), this.formatCount(themesTotalCount)]));
					lineStates.push('is-running');
				}
			}

			if (plugins && plugins.active) {
				var pluginsDone = isComponentDone(plugins);
				var pluginsDoneCount = parseInt(plugins.entities_completed || 0, 10) || 0;
				var pluginsTotalCount = parseInt(plugins.entities_total || 0, 10) || 0;
				var pluginsFiles = parseInt(plugins.files_transferred || plugins.current_files || 0, 10) || 0;
				var pluginsBytes = parseInt(plugins.bytes_transferred || 0, 10) || 0;
				if (pluginsDone) {
					var completedPlugins = pluginsTotalCount > 0 ? pluginsTotalCount : pluginsDoneCount;
					lines.push(this.formatTemplate(pluginsCompletedTpl, [pastVerb, this.formatCount(completedPlugins), this.formatCount(pluginsFiles), this.formatMegabytes(pluginsBytes)]));
					lineStates.push('is-completed');
				} else {
					lines.push(this.formatTemplate(pluginsProgressTpl, [presentVerb, this.formatCount(pluginsDoneCount), this.formatCount(pluginsTotalCount)]));
					lineStates.push('is-running');
				}
			}

			if (otherWpContent && otherWpContent.active) {
				var otherDone = isComponentDone(otherWpContent);
				var otherFiles = parseInt(otherWpContent.files_transferred || otherWpContent.current_files || 0, 10) || 0;
				var otherTotalFiles = parseInt(otherWpContent.total_files || 0, 10) || 0;
				var otherBytes = parseInt(otherWpContent.bytes_transferred || 0, 10) || 0;
				if (otherDone) {
					lines.push(this.formatTemplate(otherWpContentCompletedTpl, [pastVerb, this.formatCount(otherFiles), this.formatMegabytes(otherBytes)]));
					lineStates.push('is-completed');
				} else {
					lines.push(this.formatTemplate(otherWpContentProgressTpl, [presentVerb, this.formatCount(otherFiles), this.formatCount(otherTotalFiles)]));
					lineStates.push('is-running');
				}
			}

			var html = '';
			for (var i = 0; i < lines.length; i++) {
				html += '<div class="asenha-sync-progress-line ' + this.escAttr(lineStates[i]) + '">' + this.escHtml(lines[i]) + '</div>';
			}

			if (summaryMessage) {
				html += '<div class="asenha-sync-progress-summary">' + this.escHtml(summaryMessage).replace(/\n/g, '<br>') + '</div>';
			}

			this.setGranularPanelState(panelType || '');
			$('#asenha-sync-progress-details').html(html);
		},

		formatDuration: function(seconds) {
			seconds = Math.round(seconds);
			if (seconds < 60) {
				return seconds + 's';
			}
			var mins = Math.floor(seconds / 60);
			var secs = seconds % 60;
			if (mins < 60) {
				return mins + 'm ' + secs + 's';
			}
			var hrs = Math.floor(mins / 60);
			mins = mins % 60;
			return hrs + 'h ' + mins + 'm';
		},

		buildResultSummary: function(result) {
			var parts = [];
			if (result.db_synced) {
				parts.push((asenhaSiteBackup.strings.syncDbSynced || 'Database synced') + ': ' + (result.tables_count || 0) + ' ' + (asenhaSiteBackup.strings.syncTables || 'tables') + ', ' + (result.rows_count || 0) + ' ' + (asenhaSiteBackup.strings.syncRows || 'rows'));
			}
			if (result.files_synced) {
				var sizeStr = this.formatMegabytes(result.bytes_transferred || 0);
				parts.push((asenhaSiteBackup.strings.syncFilesSynced || 'Files synced') + ': ' + (result.files_count || 0) + ' ' + (asenhaSiteBackup.strings.syncFiles || 'files') + ' (' + sizeStr + ')');
			}
			if (result.errors && result.errors.length > 0) {
				parts.push((asenhaSiteBackup.strings.syncErrors || 'Errors') + ': ' + result.errors.join(', '));
			}
			if (result.plugin_quarantine && result.plugin_quarantine.released === false) {
				parts.push(asenhaSiteBackup.strings.syncPluginQuarantineKept || 'Plugins remain quarantined so the destination can stay recoverable. Review the plugin error, then retry releasing plugins from the destination.');
			} else if (result.plugin_quarantine && result.plugin_quarantine.released === true) {
				parts.push(asenhaSiteBackup.strings.syncPluginQuarantineReleased || 'Destination plugins released after sync.');
			}
			return parts.join('\n') || (asenhaSiteBackup.strings.syncCompleted || 'Sync completed.');
		},

		showResult: function(type, message) {
			this.setGranularPanelState(type);
			$('#asenha-sync-progress-details').html(
				'<div class="asenha-sync-progress-summary">' + this.escHtml(message || '').replace(/\n/g, '<br>') + '</div>'
			);
		},

		/**
		 * Render the actionable remediation block for the
		 * `remote_bootstrap_fatal` error code.
		 *
		 * Uses `error_data.last_fatal` (file/line from the remote
		 * `/sync/health` probe) to pinpoint which plugin file crashed,
		 * and offers a deep-link to the destination's plugins.php so
		 * the user can deactivate the faulting plugin manually.
		 *
		 * @param {Object} data Progress payload from the AJAX response.
		 */
		showBootstrapFatalRemediation: function(data) {
			var strings = (asenhaSiteBackup && asenhaSiteBackup.strings) ? asenhaSiteBackup.strings : {};
			var errorData = data && data.error_data ? data.error_data : {};
			var lastFatal = (errorData && errorData.last_fatal) ? errorData.last_fatal : {};
			var file = String(lastFatal.file || '');
			var line = parseInt(lastFatal.line, 10);
			if (!(line > 0)) {
				line = 0;
			}
			var lastErrorLocation = '';
			if (file && line) {
				lastErrorLocation = file + ':' + line;
			} else if (file) {
				lastErrorLocation = file;
			}

			var title = String(strings.syncRemoteBootstrapFatalTitle || 'Remote WordPress is crashing during bootstrap.');
			var rawMessage = String(data && data.message ? data.message : '');

			// Build destination plugins.php deep-link from the current
			// remote session (if still connected). Falls back to just
			// rendering the hint without a link.
			var pluginsHref = '';
			if (this.remoteSession && this.remoteSession.site_info && this.remoteSession.site_info.site_url) {
				var base = String(this.remoteSession.site_info.site_url || '').replace(/\/+$/, '');
				if (base) {
					pluginsHref = base + '/wp-admin/plugins.php';
				}
			}

			var parts = [];
			parts.push('<div class="asenha-sync-remediation">');
			parts.push('<p class="asenha-sync-remediation-title">' + this.escHtml(title) + '</p>');
			if (lastErrorLocation) {
				var lastErrorLine = String(strings.syncRemoteBootstrapFatalLastError || 'Last error: %s').replace('%s', lastErrorLocation);
				parts.push('<p class="asenha-sync-remediation-error"><code>' + this.escHtml(lastErrorLine) + '</code></p>');
			} else if (rawMessage) {
				var messageLine = String(strings.syncRemoteBootstrapFatalMessageFmt || 'Remote error: %s').replace('%s', rawMessage);
				parts.push('<p class="asenha-sync-remediation-error">' + this.escHtml(messageLine) + '</p>');
			}

			parts.push('<ol class="asenha-sync-remediation-steps">');
			var step1 = String(strings.syncRemoteBootstrapFatalStep1 || 'Open the destination\'s Plugins screen, deactivate the plugin causing the fatal, then resume the sync.');
			if (pluginsHref) {
				var openLabel = String(strings.syncRemoteBootstrapFatalOpenPlugins || 'Open destination plugins screen');
				parts.push('<li>' + this.escHtml(step1) + ' <a href="' + this.escHtml(pluginsHref) + '" target="_blank" rel="noopener noreferrer" class="asenha-sync-remediation-link">' + this.escHtml(openLabel) + '</a></li>');
			} else {
				parts.push('<li>' + this.escHtml(step1) + '</li>');
			}
			parts.push('</ol>');
			parts.push('</div>');

			this.setGranularPanelState('error');
			$('#asenha-sync-progress-details').html(parts.join(''));
		},

		resetUI: function(mode) {
			mode = String(mode || 'default');

			if (this.heartbeatSuspended && SiteBackup && typeof SiteBackup.resumeHeartbeat === 'function') {
				SiteBackup.resumeHeartbeat();
				this.heartbeatSuspended = false;
			}

			if (mode === 'completed') {
				$('#asenha-sync-start').prop('disabled', true).hide();
			} else {
				$('#asenha-sync-start').prop('disabled', false).show();
			}
			$('#asenha-sync-cancel').hide();
			this.syncId = null;
			this.startTime = null;
			this.lastProgressPct = 0;
		}
	};

	// Add custom pair button handler (delegated).
	$(document).on('click', '#asenha-sync-add-replace-pair', function() {
		$('#asenha-sync-replace-pairs').append(SiteSync.createReplacePairRow('', '', false));
	});

	// Initialize on document ready
	$(document).ready(function() {
		SiteBackup.init();
		SiteSync.init();
	});

})(jQuery);
