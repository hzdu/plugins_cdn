(function( $ ) {
	'use strict';

	var triangleSvg =
		'<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 16 16"><path fill="currentColor" d="M14.222 6.687a1.5 1.5 0 0 1 0 2.629l-10 5.499A1.5 1.5 0 0 1 2 13.5V2.502a1.5 1.5 0 0 1 2.223-1.314z"/></svg>';
	var removeSvg =
		'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="#bbbbbb" d="M24 2.4L21.6 0L12 9.6L2.4 0L0 2.4L9.6 12L0 21.6L2.4 24l9.6-9.6l9.6 9.6l2.4-2.4l-9.6-9.6z"/></svg>';
	var STORAGE_KEY_SUBMENU = 'asenha_abce_submenu_state';

	function getSubmenuStateMap() {
		try {
			var raw = window.localStorage.getItem( STORAGE_KEY_SUBMENU );
			if ( ! raw ) {
				return {};
			}
			var o = JSON.parse( raw );
			return typeof o === 'object' && o !== null ? o : {};
		} catch ( err ) {
			return {};
		}
	}

	function setSubmenuOpen( parentId, open ) {
		if ( ! parentId ) {
			return;
		}
		var map = getSubmenuStateMap();
		map[ parentId ] = open;
		try {
			window.localStorage.setItem( STORAGE_KEY_SUBMENU, JSON.stringify( map ) );
		} catch ( err ) {
			// Ignore quota / private mode.
		}
	}

	function applyStoredSubmenuStates() {
		var map = getSubmenuStateMap();
		$( '.asenha-abce-parent' ).each( function() {
			var $p = $( this );
			var pid = $p.attr( 'data-item-id' ) || $p.attr( 'id' );
			if ( ! pid ) {
				return;
			}
			var $wrap = $p.find( '.asenha-abce-submenu-wrapper' ).first();
			var $toggle = $p.find( '.asenha-abce-submenu-toggle' ).first();
			var $arrow = $toggle.find( '.arrow-right' ).first();
			if ( map[ pid ] === true ) {
				$wrap.show();
				$arrow.addClass( 'rotate-down' );
				$toggle.attr( 'aria-expanded', 'true' );
			} else {
				$wrap.hide();
				$arrow.removeClass( 'rotate-down' );
				$toggle.attr( 'aria-expanded', 'false' );
			}
		} );
	}

	function escAttr( s ) {
		return String( s ).replace( /&/g, '&amp;' ).replace( /"/g, '&quot;' ).replace( /</g, '&lt;' );
	}

	/**
	 * Keep each child row's data-parent-id in sync with the submenu list it sits under (after drag between parents).
	 *
	 * @param {JQuery} $ul Child sortable ul.asenha-abce-children.
	 */
	function syncChildrenParentAttrsInList( $ul ) {
		if ( ! $ul || ! $ul.length ) {
			return;
		}
		var pid = $ul.attr( 'data-parent-id' ) || '';
		$ul.children( 'li.asenha-abce-child' ).attr( 'data-parent-id', pid );
	}

	function getAbceChildrenSortableOptions() {
		return {
			items: '> li',
			handle: '.menu-item-handle',
			connectWith: '.asenha-abce-children',
			opacity: 0.6,
			placeholder: 'submenu-sortable-placeholder',
			tolerance: 'pointer',
			revert: 250,
			update: function() {
				syncChildrenParentAttrsInList( $( this ) );
			}
		};
	}

	function bindAbceChildrenSortable( $ul ) {
		if ( $ul.data( 'ui-sortable' ) ) {
			$ul.sortable( 'destroy' );
		}
		$ul.sortable( getAbceChildrenSortableOptions() );
	}

	function refreshAbceChildrenSortables() {
		$( '.asenha-abce-children' ).each( function() {
			var $u = $( this );
			if ( ! $u.data( 'ui-sortable' ) ) {
				bindAbceChildrenSortable( $u );
				return;
			}
			try {
				$u.sortable( 'refresh' );
			} catch ( err ) {
				bindAbceChildrenSortable( $u );
			}
		} );
	}

	/**
	 * Keep each parent row's data-placement in sync with the left/right column list it sits under (after drag between columns).
	 *
	 * @param {JQuery} $ul Parent sortable ul.asenha-abce-parent-sortable.
	 */
	function syncParentPlacementAttrsInList( $ul ) {
		if ( ! $ul || ! $ul.length ) {
			return;
		}
		var pl = $ul.attr( 'data-placement' ) || '';
		$ul.children( 'li.asenha-abce-parent' ).attr( 'data-placement', pl );
	}

	function syncAllParentPlacementAttrs() {
		$( '.asenha-abce-parent-sortable' ).each( function() {
			syncParentPlacementAttrsInList( $( this ) );
		} );
	}

	function getAbceParentSortableOptions() {
		return {
			items: '> li',
			handle: '.menu-item-handle',
			connectWith: '.asenha-abce-parent-sortable',
			opacity: 0.6,
			placeholder: 'sortable-placeholder',
			tolerance: 'pointer',
			revert: 250,
			update: function() {
				syncAllParentPlacementAttrs();
				refreshAbceChildrenSortables();
			}
		};
	}

	function bindAbceParentSortables() {
		$( '#asenha-abce-parents-left, #asenha-abce-parents-right' ).each( function() {
			var $ul = $( this );
			if ( $ul.data( 'ui-sortable' ) ) {
				$ul.sortable( 'destroy' );
			}
			$ul.sortable( getAbceParentSortableOptions() );
		} );
	}

	function updateHandleTitles( $ctx ) {
		$ctx.find( '.abce-title' ).each( function() {
			var t = $( this ).val() || '';
			var id = $( this ).closest( '.sortable-item' ).find( '.abce-id' ).first().val() || '';
			$( this ).closest( '.sortable-item' ).find( '.asenha-abce-handle-title' ).first().text( t || id );
		} );
	}

	function syncIdAttributes( $row, newId ) {
		if ( ! newId ) {
			return;
		}
		$row.attr( 'id', newId );
		$row.attr( 'data-item-id', newId );
		$row.find( '[data-menu-item-id]' ).attr( 'data-menu-item-id', newId );
		$row.find( '.abce-add-child' ).attr( 'data-parent-id', newId );
		$row.find( '.asenha-abce-remove' ).attr( 'data-item-id', newId );
		var $ch = $row.find( '.asenha-abce-children' );
		$ch.attr( 'id', 'abce-children-' + newId );
		$ch.attr( 'data-parent-id', newId );
		var metaId = 'abce-meta-advanced-' + newId;
		$row.find( '.asenha-abce-meta-advanced' ).attr( 'id', metaId );
		$row.find( '.asenha-abce-advanced-toggle' ).attr( 'aria-controls', metaId );
		var rfName = 'abce-role-filter-' + newId;
		$row.find( '.abce-role-filter-mode' ).attr( 'name', rfName );
		$row.find( '.abce-role-slug' ).each( function() {
			var slug = $( this ).val();
			if ( ! slug ) {
				return;
			}
			var cbId = 'abce-role-' + newId + '-' + slug;
			$( this ).attr( 'id', cbId );
			$( this ).closest( 'label' ).attr( 'for', cbId );
		} );
		var scopeId = 'abce-role-scope-' + newId;
		$row.find( '.abce-role-filter-scope' ).attr( 'id', scopeId );
	}

	function updateAbceRoleFilterGridVisibility( $row ) {
		if ( ! $row || ! $row.length ) {
			return;
		}
		var mode = $row.find( '.abce-role-filter-mode:checked' ).first().val() || 'all';
		var show = mode === 'only' || mode === 'except';
		var $wrap = $row.find( '.asenha-abce-role-grid-wrap' ).first();
		if ( ! $wrap.length ) {
			return;
		}
		if ( show ) {
			$wrap.prop( 'hidden', false );
			$wrap.attr( 'aria-hidden', 'false' );
			$wrap.addClass( 'is-visible' );
		} else {
			$wrap.prop( 'hidden', true );
			$wrap.attr( 'aria-hidden', 'true' );
			$wrap.removeClass( 'is-visible' );
		}
	}

	function updateAbceShowForUi( $row ) {
		if ( ! $row || ! $row.length ) {
			return;
		}
		var $custom = $row.find( '.asenha-abce-role-filter-custom-block' ).first();
		if ( ! $custom.length ) {
			return;
		}
		if ( $row.hasClass( 'asenha-abce-child' ) ) {
			var scope = $row.find( '.abce-role-filter-scope' ).first().val() || 'inherit';
			if ( scope === 'custom' ) {
				$custom.prop( 'hidden', false );
				$custom.attr( 'aria-hidden', 'false' );
				updateAbceRoleFilterGridVisibility( $row );
			} else {
				$custom.prop( 'hidden', true );
				$custom.attr( 'aria-hidden', 'true' );
			}
		} else {
			$custom.prop( 'hidden', false );
			$custom.attr( 'aria-hidden', 'false' );
			updateAbceRoleFilterGridVisibility( $row );
		}
	}

	function showForFieldRowHtml( itemId, role ) {
		var s = abcePageVars.strings || {};
		var choices = abcePageVars.roleChoices || [];
		var defSlug = abcePageVars.defaultNewItemRoleSlug || 'administrator';
		var rfName = 'abce-role-filter-' + itemId;
		var ariaRoles = s.rolesGroupAriaLabel || 'Roles';
		var scopeSelectId = 'abce-role-scope-' + itemId;
		var gridItems = '';
		choices.forEach( function( c ) {
			if ( ! c || ! c.slug ) {
				return;
			}
			var slug = String( c.slug );
			var label = c.label != null ? String( c.label ) : slug;
			var cbId = 'abce-role-' + itemId + '-' + slug;
			var checked = slug === defSlug ? ' checked' : '';
			gridItems +=
				'<label class="asenha-abce-role-grid-item" for="' + escAttr( cbId ) + '">' +
				'<input type="checkbox" class="abce-role-slug" id="' + escAttr( cbId ) + '" value="' + escAttr( slug ) + '"' + checked + ' />' +
				escAttr( label ) +
				'</label>';
		} );
		var radiosAndGrid =
			'<div class="asenha-abce-role-filter-radios">' +
			'<label class="asenha-abce-role-filter-label"><input type="radio" class="abce-role-filter-mode" name="' +
			escAttr( rfName ) +
			'" value="all" />' +
			escAttr( s.roleFilterAll || '' ) +
			'</label>' +
			'<label class="asenha-abce-role-filter-label"><input type="radio" class="abce-role-filter-mode" name="' +
			escAttr( rfName ) +
			'" value="only" checked />' +
			escAttr( s.roleFilterOnly || '' ) +
			'</label>' +
			'<label class="asenha-abce-role-filter-label"><input type="radio" class="abce-role-filter-mode" name="' +
			escAttr( rfName ) +
			'" value="except" />' +
			escAttr( s.roleFilterExcept || '' ) +
			'</label>' +
			'</div>' +
			'<div class="asenha-abce-role-grid-wrap is-visible" aria-hidden="false">' +
			'<div class="asenha-abce-role-grid" role="group" aria-label="' +
			escAttr( ariaRoles ) +
			'">' +
			gridItems +
			'</div></div>';
		var scopeRow = '';
		var customOpen = '<div class="asenha-abce-role-filter-custom-block" aria-hidden="false">';
		var customClose = '</div>';
		if ( role === 'child' ) {
			scopeRow =
				'<div class="asenha-abce-role-filter-scope-wrap">' +
				'<label for="' + escAttr( scopeSelectId ) + '" class="screen-reader-text">' +
				escAttr( s.roleFilterScopeLabel || '' ) +
				'</label>' +
				'<select class="abce-field abce-role-filter-scope large-text" id="' +
				escAttr( scopeSelectId ) +
				'" data-field="role_filter_scope" autocomplete="off">' +
				'<option value="inherit" selected>' +
				escAttr( s.roleFilterScopeInherit || '' ) +
				'</option>' +
				'<option value="custom">' +
				escAttr( s.roleFilterScopeCustom || '' ) +
				'</option>' +
				'</select></div>';
			customOpen =
				'<div class="asenha-abce-role-filter-custom-block" hidden="hidden" aria-hidden="true">';
		}
		return (
			'<tr class="asenha-abce-show-for-row"><th scope="row">' + escAttr( s.showForLabel || 'Show For' ) + '</th><td>' +
			'<fieldset class="asenha-abce-role-filter-fieldset">' +
			'<legend class="screen-reader-text">' + escAttr( s.showForLabel || 'Show For' ) + '</legend>' +
			scopeRow +
			customOpen +
			radiosAndGrid +
			customClose +
			'</fieldset></td></tr>'
		);
	}

	function toggleAbceOptionsPanel( $toggle ) {
		var $row = $toggle.closest( 'li.menu-item' );
		var $opts = $row.children( '.asenha-abce-options' );
		var $arrow = $toggle.find( '.arrow-right' ).first();
		var open = $opts.is( ':visible' );
		if ( open ) {
			$opts.hide();
			$arrow.removeClass( 'rotate-down' );
			$toggle.attr( 'aria-expanded', 'false' );
		} else {
			$opts.show();
			$arrow.addClass( 'rotate-down' );
			$toggle.attr( 'aria-expanded', 'true' );
		}
	}

	function collectPayload() {
		var items = {};
		var parentsLeft = [];
		var parentsRight = [];
		try {
			parentsLeft = $( '#asenha-abce-parents-left' ).sortable( 'toArray' );
			parentsRight = $( '#asenha-abce-parents-right' ).sortable( 'toArray' );
		} catch ( err ) {
			parentsLeft = [];
			parentsRight = [];
		}

		function readFields( $row ) {
			var id = $row.find( '.abce-id' ).first().val();
			if ( ! id ) {
				return null;
			}
			var isChild = $row.hasClass( 'asenha-abce-child' );
			var roleMode = $row.find( '.abce-role-filter-mode:checked' ).first().val() || 'all';
			var roleSlugs = [];
			$row.find( '.abce-role-slug:checked' ).each( function() {
				var v = $( this ).val();
				if ( v ) {
					roleSlugs.push( v );
				}
			} );
			var roleScope = 'inherit';
			if ( isChild ) {
				roleScope = $row.find( '.abce-role-filter-scope' ).first().val() || 'inherit';
				if ( roleScope !== 'custom' && roleScope !== 'inherit' ) {
					roleScope = 'inherit';
				}
			}
			var parentVal = '';
			if ( isChild ) {
				var $chUl = $row.closest( '.asenha-abce-children' );
				parentVal = $chUl.length ? ( $chUl.attr( 'data-parent-id' ) || '' ) : '';
			}
			var o = {
				title: $row.find( '.abce-title' ).first().val() || '',
				href: $row.find( '.abce-href' ).first().val() || '',
				visibility: $row.find( '.abce-visibility' ).first().val() || 'both',
				role_filter_mode: roleMode,
				role_slugs: roleSlugs,
				parent: parentVal,
				icon: isChild ? '' : ( $row.find( '.abce-icon-input' ).first().val() || '' ),
				meta_html: $row.find( '.abce-meta-html' ).first().val() || '',
				meta_class: $row.find( '.abce-meta-class' ).first().val() || '',
				meta_target: $row.find( '.abce-meta-target' ).first().val() || '',
				meta_title: $row.find( '.abce-meta-title' ).first().val() || '',
				meta_menu_title: $row.find( '.abce-meta-menu-title' ).first().val() || '',
				children_order: []
			};
			if ( isChild ) {
				o.role_filter_scope = roleScope;
			}
			return { id: id, data: o };
		}

		$( '.asenha-abce-parent' ).each( function() {
			var $p = $( this );
			var rd = readFields( $p );
			if ( ! rd ) {
				return;
			}
			var chOrder = [];
			try {
				chOrder = $p.find( '.asenha-abce-children' ).first().sortable( 'toArray' );
			} catch ( err ) {
				chOrder = [];
			}
			rd.data.children_order = chOrder;
			items[ rd.id ] = rd.data;
		} );

		$( '.asenha-abce-child' ).each( function() {
			var $c = $( this );
			var rd = readFields( $c );
			if ( ! rd ) {
				return;
			}
			items[ rd.id ] = rd.data;
		} );

		var placementLeft = 'end';
		var placementRight = 'before_account';
		var $pl = $( '#asenha-abce-placement-left' );
		var $pr = $( '#asenha-abce-placement-right' );
		if ( $pl.length ) {
			placementLeft = $pl.val() || 'end';
		}
		if ( $pr.length ) {
			placementRight = $pr.val() || 'before_account';
		}

		return {
			parents_left: parentsLeft,
			parents_right: parentsRight,
			placement_left: placementLeft,
			placement_right: placementRight,
			items: items
		};
	}

	function newId() {
		return 'asenha-ab-' + Date.now().toString( 36 ) + Math.random().toString( 36 ).substring( 2, 6 );
	}

	function iconFieldHtml( itemId ) {
		var u = abcePageVars.asenhUrl || '';
		var chg = abcePageVars.strings.changeIcon || 'Change Icon';
		var ph = abcePageVars.strings.placeholderIcon || '';
		var srch = abcePageVars.strings.searchIcon || 'Search…';
		return (
			'<div class="custom-menu-field custom-menu-icon-field">' +
			'<div class="icon-picker-wrapper">' +
			'<div class="icon-picker">' +
			'<span class="selected-menu-icon"></span>' +
			'<input type="text" class="custom-menu-icon custom-menu-input-full abce-icon-input" data-menu-item-id="' + escAttr( itemId ) + '" value="" placeholder="' + escAttr( ph ) + '" />' +
			'</div>' +
			'<div class="icon-picker-controls">' +
			'<button type="button" class="button icon-picker-button" data-menu-item-id="' + escAttr( itemId ) + '">' + escAttr( chg ) + '</button>' +
			'<img src="' + escAttr( u + 'assets/img/oval.svg' ) + '" class="icon-picker-spinner" style="display: none;" alt="" />' +
			'<input type="search" class="icon-picker-search" placeholder="' + escAttr( srch ) + '" style="display:none;" data-menu-item-id="' + escAttr( itemId ) + '" />' +
			'</div>' +
			'</div>' +
			'<div class="icon-library-container" data-menu-item-id="' + escAttr( itemId ) + '" style="display:none;"></div>' +
			'</div>'
		);
	}

	function fieldsTableHtml( itemId, role, placement ) {
		var s = abcePageVars.strings;
		var iconRow = '';
		if ( role !== 'child' ) {
			iconRow =
				'<tr><th scope="row">' + escAttr( s.iconLabel || 'Icon' ) + '</th><td>' + iconFieldHtml( itemId ) + '</td></tr>';
		}
		var metaSectionId = 'abce-meta-advanced-' + itemId;
		var showAdvStr = s.showAdvancedOptions || 'Show advanced options';
		return (
			'<input type="hidden" class="abce-field abce-id" data-field="id" value="' + escAttr( itemId ) + '" />' +
			'<table class="form-table asenha-abce-field-table" role="presentation"><tbody>' +
			'<tr><th scope="row">' + escAttr( s.titleLabel || 'Title' ) + '</th><td>' +
			'<input type="text" class="large-text abce-field abce-title" data-field="title" value="" />' +
			'</td></tr>' +
			'<tr><th scope="row">' + escAttr( s.linkLabel || 'Link' ) + '</th><td>' +
			'<input type="text" class="large-text abce-field abce-href" data-field="href" value="" placeholder="" />' +
			'</td></tr>' +
			'<tr><th scope="row">' + escAttr( s.showOnLabel || 'Show on' ) + '</th><td>' +
			'<select class="abce-field abce-visibility" data-field="visibility">' +
			'<option value="admin">' + escAttr( s.visAdmin || '' ) + '</option>' +
			'<option value="frontend">' + escAttr( s.visFe || '' ) + '</option>' +
			'<option value="both" selected>' + escAttr( s.visBoth || '' ) + '</option>' +
			'</select></td></tr>' +
			showForFieldRowHtml( itemId, role ) +
			iconRow +
			'</tbody><tbody>' +
			'<tr class="asenha-abce-advanced-toggle-row"><td colspan="2" class="asenha-abce-advanced-toggle-cell">' +
			'<button type="button" class="asenha-abce-advanced-toggle" aria-expanded="false" aria-controls="' + escAttr( metaSectionId ) + '">' +
			'<span class="arrow-right">' + triangleSvg + '</span>' +
			'<span class="asenha-abce-advanced-toggle-text">' + escAttr( showAdvStr ) + '</span>' +
			'</button></td></tr></tbody>' +
			'<tbody id="' + escAttr( metaSectionId ) + '" class="asenha-abce-meta-advanced" style="display:none;">' +
			'<tr><th scope="row">' + escAttr( s.metaHtml || 'Meta: HTML' ) + '</th><td>' +
			'<textarea class="large-text abce-field abce-meta-html" rows="2" data-field="meta_html"></textarea></td></tr>' +
			'<tr><th scope="row">' + escAttr( s.metaClass || 'Meta: class' ) + '</th><td>' +
			'<input type="text" class="large-text abce-field abce-meta-class" data-field="meta_class" value="" /></td></tr>' +
			'<tr><th scope="row">' + escAttr( s.metaTarget || 'Meta: target' ) + '</th><td>' +
			'<input type="text" class="regular-text abce-field abce-meta-target" data-field="meta_target" value="" placeholder="_blank" /></td></tr>' +
			'<tr><th scope="row">' + escAttr( s.metaTitle || 'Meta: title' ) + '</th><td>' +
			'<input type="text" class="large-text abce-field abce-meta-title" data-field="meta_title" value="" /></td></tr>' +
			'<tr><th scope="row">' + escAttr( s.metaMenuTitle || 'Meta: menu_title' ) + '</th><td>' +
			'<input type="text" class="large-text abce-field abce-meta-menu-title" data-field="meta_menu_title" value="" /></td></tr>' +
			'</tbody></table>'
		);
	}

	function parentRowHtml( placement ) {
		var nid = newId();
		var addChild = abcePageVars.strings.addChild || 'Add child item';
		var rm = abcePageVars.strings.remove || 'Remove';
		var optLabel = abcePageVars.strings.optionsLabel || 'Options';
		var subLabel = abcePageVars.strings.submenuLabel || 'Submenu';
		return (
			'<li id="' + escAttr( nid ) + '" class="menu-item parent-menu-item menu-item-depth-0 sortable-item asenha-abce-parent" data-item-id="' + escAttr( nid ) + '" data-placement="' + escAttr( placement ) + '">' +
			'<div class="asenha-abce-item-top">' +
			'<div class="menu-item-bar">' +
			'<div class="menu-item-handle">' +
			'<span class="dashicons dashicons-menu"></span>' +
			'<div class="item-title asenha-abce-item-title-row">' +
			'<span class="asenha-abce-handle-title">' + escAttr( nid ) + '</span>' +
			'</div>' +
			'<div class="submenu-toggle asenha-abce-submenu-toggle" role="button" tabindex="0" aria-expanded="false">' +
			'<span class="arrow-right">' + triangleSvg + '</span>' +
			'<span class="submenu-text">' + escAttr( subLabel ) + '</span>' +
			'</div>' +
			'<div class="options-toggle asenha-abce-options-toggle" role="button" tabindex="0" aria-expanded="true">' +
			'<span class="arrow-right rotate-down">' + triangleSvg + '</span>' +
			'<span class="options-text">' + escAttr( optLabel ) + '</span>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'<div class="remove-custom-menu-item-saved asenha-abce-remove" data-item-id="' + escAttr( nid ) + '" role="button" tabindex="0" aria-label="' + escAttr( rm ) + '">' + removeSvg + '</div>' +
			'</div>' +
			'<div class="asenha-abce-options">' + fieldsTableHtml( nid, 'parent', placement ) +
			'</div>' +
			'<div class="submenu-wrapper asenha-abce-submenu-wrapper" style="display:none;">' +
			'<p class="asenha-abce-add-child-row"><button type="button" class="button asenha-abce-add-child" data-parent-id="' + escAttr( nid ) + '">' + escAttr( addChild ) + '</button></p>' +
			'<ul id="abce-children-' + escAttr( nid ) + '" class="submenu-sortable submenu asenha-abce-children" data-parent-id="' + escAttr( nid ) + '"></ul>' +
			'</div>' +
			'</li>'
		);
	}

	function childRowHtml( parentId ) {
		var nid = newId();
		var rm = abcePageVars.strings.remove || 'Remove';
		var optLabel = abcePageVars.strings.optionsLabel || 'Options';
		return (
			'<li id="' + escAttr( nid ) + '" class="menu-item menu-item-depth-1 sortable-item asenha-abce-child" data-item-id="' + escAttr( nid ) + '" data-parent-id="' + escAttr( parentId ) + '">' +
			'<div class="asenha-abce-item-top">' +
			'<div class="menu-item-bar">' +
			'<div class="menu-item-handle">' +
			'<span class="dashicons dashicons-menu"></span>' +
			'<div class="item-title asenha-abce-item-title-row">' +
			'<span class="asenha-abce-handle-title">' + escAttr( nid ) + '</span>' +
			'</div>' +
			'<div class="options-toggle asenha-abce-options-toggle" role="button" tabindex="0" aria-expanded="true">' +
			'<span class="arrow-right rotate-down">' + triangleSvg + '</span>' +
			'<span class="options-text">' + escAttr( optLabel ) + '</span>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'<div class="remove-custom-menu-item-saved asenha-abce-remove" data-item-id="' + escAttr( nid ) + '" role="button" tabindex="0" aria-label="' + escAttr( rm ) + '">' + removeSvg + '</div>' +
			'</div>' +
			'<div class="asenha-abce-options">' + fieldsTableHtml( nid, 'child', '' ) + '</div>' +
			'</li>'
		);
	}

	$( document ).ready( function() {
		if ( typeof abcePageVars === 'undefined' ) {
			return;
		}

		bindAbceParentSortables();
		syncAllParentPlacementAttrs();

		$( '.asenha-abce-children' ).each( function() {
			var $u = $( this );
			bindAbceChildrenSortable( $u );
			syncChildrenParentAttrsInList( $u );
		} );

		applyStoredSubmenuStates();

		$( '.asenha-abce-wrap .sortable-item' ).each( function() {
			updateAbceShowForUi( $( this ) );
		} );

		$( document ).on( 'change', '.asenha-abce-wrap .abce-role-filter-mode', function() {
			updateAbceShowForUi( $( this ).closest( '.sortable-item' ) );
		} );

		$( document ).on( 'change', '.asenha-abce-wrap .abce-role-filter-scope', function() {
			updateAbceShowForUi( $( this ).closest( '.sortable-item' ) );
		} );

		$( document ).on( 'input', '.asenha-abce-wrap .abce-title', function() {
			var $row = $( this ).closest( '.sortable-item' );
			updateHandleTitles( $row );
		} );

		$( document ).on( 'change blur', '.asenha-abce-wrap .abce-id', function() {
			var $row = $( this ).closest( '.sortable-item' );
			var v = $( this ).val();
			if ( $row.hasClass( 'asenha-abce-parent' ) ) {
				return;
			}
			syncIdAttributes( $row, v );
			updateHandleTitles( $row );
		} );

		$( document ).on( 'click', '.asenha-abce-add-parent', function( e ) {
			e.preventDefault();
			var placement = $( this ).data( 'placement' ) || 'left';
			var $ul = placement === 'right' ? $( '#asenha-abce-parents-right' ) : $( '#asenha-abce-parents-left' );
			var $li = $( parentRowHtml( placement ) );
			$ul.append( $li );
			bindAbceChildrenSortable( $li.find( '.asenha-abce-children' ).first() );
			refreshAbceChildrenSortables();
			updateAbceShowForUi( $li );
		} );

		$( document ).on( 'click', '.asenha-abce-add-child', function( e ) {
			e.preventDefault();
			var pid = $( this ).data( 'parent-id' );
			var $ul = $( '#abce-children-' + pid );
			var $child = $( childRowHtml( pid ) );
			$ul.append( $child );
			syncChildrenParentAttrsInList( $ul );
			updateAbceShowForUi( $child );
		} );

		$( document ).on( 'click', '.asenha-abce-wrap .asenha-abce-remove', function( e ) {
			e.preventDefault();
			if ( ! window.confirm( abcePageVars.strings.confirmRemove || 'Remove this item?' ) ) {
				return;
			}
			$( this ).closest( 'li.menu-item' ).remove();
		} );

		$( document ).on( 'click', '.asenha-abce-wrap .asenha-abce-options-toggle', function( e ) {
			e.preventDefault();
			toggleAbceOptionsPanel( $( this ) );
		} );

		$( document ).on( 'keydown', '.asenha-abce-wrap .asenha-abce-options-toggle', function( e ) {
			if ( e.key !== 'Enter' && e.key !== ' ' ) {
				return;
			}
			e.preventDefault();
			toggleAbceOptionsPanel( $( this ) );
		} );

		function toggleAbceAdvancedMeta( $btn ) {
			var s = abcePageVars.strings || {};
			var showStr = s.showAdvancedOptions || 'Show advanced options';
			var hideStr = s.hideAdvancedOptions || 'Hide advanced options';
			var cid = $btn.attr( 'aria-controls' );
			if ( ! cid ) {
				return;
			}
			var $tbody = $( document.getElementById( cid ) );
			if ( ! $tbody.length ) {
				return;
			}
			var $arrow = $btn.find( '.arrow-right' ).first();
			var $label = $btn.find( '.asenha-abce-advanced-toggle-text' ).first();
			var open = $tbody.is( ':visible' );
			if ( open ) {
				$tbody.hide();
				$arrow.removeClass( 'rotate-down' );
				$btn.attr( 'aria-expanded', 'false' );
				$label.text( showStr );
			} else {
				$tbody.show();
				$arrow.addClass( 'rotate-down' );
				$btn.attr( 'aria-expanded', 'true' );
				$label.text( hideStr );
			}
		}

		$( document ).on( 'click', '.asenha-abce-wrap .asenha-abce-advanced-toggle', function( e ) {
			e.preventDefault();
			e.stopPropagation();
			toggleAbceAdvancedMeta( $( this ) );
		} );

		$( document ).on( 'keydown', '.asenha-abce-wrap .asenha-abce-advanced-toggle', function( e ) {
			if ( e.key !== 'Enter' && e.key !== ' ' ) {
				return;
			}
			e.preventDefault();
			toggleAbceAdvancedMeta( $( this ) );
		} );

		$( document ).on( 'click', '.asenha-abce-wrap .asenha-abce-submenu-toggle', function( e ) {
			e.preventDefault();
			e.stopPropagation();
			var $toggle = $( this );
			var $parent = $toggle.closest( '.asenha-abce-parent' );
			var pid = $parent.attr( 'data-item-id' ) || $parent.attr( 'id' );
			var $wrap = $parent.find( '.asenha-abce-submenu-wrapper' ).first();
			var $arrow = $toggle.find( '.arrow-right' ).first();
			if ( $wrap.is( ':visible' ) ) {
				$wrap.slideUp( 150 );
				$arrow.removeClass( 'rotate-down' );
				$toggle.attr( 'aria-expanded', 'false' );
				setSubmenuOpen( pid, false );
			} else {
				$wrap.slideDown( 150 );
				$arrow.addClass( 'rotate-down' );
				$toggle.attr( 'aria-expanded', 'true' );
				setSubmenuOpen( pid, true );
			}
		} );

		$( document ).on( 'keydown', '.asenha-abce-wrap .asenha-abce-submenu-toggle', function( e ) {
			if ( e.key !== 'Enter' && e.key !== ' ' ) {
				return;
			}
			e.preventDefault();
			e.stopPropagation();
			$( this ).trigger( 'click' );
		} );

		$( '#asenha-abce-save' ).on( 'click', function( e ) {
			e.preventDefault();
			var payload = collectPayload();
			$( '.asenha-abce-saving' ).show();
			$( '.asenha-abce-saved' ).hide();
			$.ajax( {
				type: 'POST',
				url: ajaxurl,
				dataType: 'json',
				data: {
					action: 'asenha_save_admin_bar_custom_elements',
					nonce: abcePageVars.saveNonce,
					payload: JSON.stringify( payload )
				}
			} ).done( function( res ) {
				$( '.asenha-abce-saving' ).hide();
				if ( res && res.success ) {
					window.location.reload();
				} else {
					var msg = ( res && res.data && res.data.message ) ? res.data.message : 'Error';
					window.alert( msg );
				}
			} ).fail( function() {
				$( '.asenha-abce-saving' ).hide();
				window.alert( 'Request failed.' );
			} );
		} );
	} );

})( jQuery );
