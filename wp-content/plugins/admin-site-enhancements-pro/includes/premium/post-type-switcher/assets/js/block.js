/* global asenhaPtsBlockEditor */
( function( wp, window ) {
	'use strict';

	if ( ! wp || ! wp.plugins || ! wp.element || ! wp.components || ! wp.i18n ) {
		return;
	}

	var data = window.asenhaPtsBlockEditor;
	if ( ! data || ! data.availablePostTypes || ! data.changeUrl ) {
		return;
	}

	var registerPlugin = wp.plugins.registerPlugin;
	var createElement  = wp.element.createElement;
	var useState       = wp.element.useState;
	var __             = wp.i18n.__;
	var sprintf        = wp.i18n.sprintf;

	var Button   = wp.components.Button;
	var Dropdown = wp.components.Dropdown;

	// WP has moved this over time; support both (and bail if neither exists).
	var PluginPostStatusInfo =
		( wp.editPost && wp.editPost.PluginPostStatusInfo )
		|| ( wp.editor && wp.editor.PluginPostStatusInfo );

	if ( ! PluginPostStatusInfo ) {
		return;
	}

	function PostTypeChooser() {
		var _useState = useState( data.currentPostType );
		var currentPostType = _useState[ 0 ];
		var setCurrentPostType = _useState[ 1 ];

		function onChange( nextType ) {
			var prevType = currentPostType;
			setCurrentPostType( nextType );

			var message = sprintf(
				/* translators: %1$s is the current post type and %2$s is the post type to switch to */
				__( "Are you sure you want to change this from a '%1$s' to a '%2$s'?", 'admin-site-enhancements' ),
				prevType,
				nextType
			);

			if ( window.confirm( message ) ) {
				window.location.href = data.changeUrl + '&asenha_pts_post_type=' + encodeURIComponent( nextType );
				return;
			}

			// Revert selection when cancelled.
			setCurrentPostType( prevType );
		}

		return createElement(
			'fieldset',
			{ className: 'editor-post-type__dialog-fieldset' },
			createElement(
				'legend',
				{ className: 'editor-post-type__dialog-legend' },
				__( 'Post Type', 'admin-site-enhancements' )
			),
			data.availablePostTypes.map( function( item ) {
				return createElement(
					'div',
					{ className: 'editor-post-type__choice', key: item.value },
					createElement( 'input', {
						type: 'radio',
						className: 'editor-post-type__dialog-radio',
						name: 'editor-post-type__setting',
						value: item.value,
						onChange: function() {
							onChange( item.value );
						},
						checked: item.value === currentPostType,
						id: 'editor-post-type-switcher-' + item.value
					} ),
					createElement(
						'label',
						{
							htmlFor: 'editor-post-type-switcher-' + item.value,
							className: 'editor-post-type__dialog-label'
						},
						item.label
					)
				);
			} )
		);
	}

	registerPlugin( 'asenha-post-type-switcher', {
		render: function() {
			return createElement(
				PluginPostStatusInfo,
				null,
				createElement(
					'div',
					{ className: 'edit-post-post-type' },
					createElement(
						'div',
						{ className: 'editor-post-panel__row-label' },
						__( 'Post Type', 'admin-site-enhancements' )
					),
					createElement(
						'div',
						{ className: 'editor-post-panel__row-control' },
						createElement( Dropdown, {
							popoverProps: { placement: 'left-start', offset: 138, shift: true },
							contentClassName: 'edit-post-post-type__dialog',
							renderToggle: function( props ) {
								return createElement(
									Button,
									{
										type: 'button',
										'aria-expanded': props.isOpen,
										'aria-label': sprintf(
											/* translators: %s is the current post type */
											__( 'Change post type: %s', 'admin-site-enhancements' ),
											data.currentPostType
										),
										className: 'edit-post-post-type__toggle is-compact is-tertiary',
										onClick: props.onToggle
									},
									data.currentPostTypeLabel
								);
							},
							renderContent: function() {
								return createElement( PostTypeChooser );
							}
						} )
					)
				)
			);
		}
	} );
} )( window.wp, window );

