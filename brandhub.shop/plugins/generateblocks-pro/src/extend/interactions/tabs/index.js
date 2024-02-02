import { __ } from '@wordpress/i18n';
import { registerBlockVariation } from '@wordpress/blocks';

// Internal dependencies.
import './attributes';
import './edit';
import './components/ContainerInspectorControls';
import './components/ButtonInspectorControls';
import './components/BlockAppender';
import './editor.scss';
import getIcon from '../../../utils/get-icon';
import domReady from '@wordpress/dom-ready';
import getGBVersion from '../../../utils/get-gb-version';
import { gte } from 'semver';
import './templates';

domReady( () => {
	if ( gte( getGBVersion(), '1.7.0' ) ) {
		registerBlockVariation(
			'generateblocks/container',
			{
				title: __( 'Tabs', 'generateblocks' ),
				name: 'tabs',
				icon: getIcon( 'tabs' ),
				description: __( 'Build a series of tabs using our Container and Button blocks.', 'generateblocks-pro' ),
				attributes: {
					variantRole: 'tabs',
					defaultOpenedTab: '1',
				},
				innerBlocks: [],
				isActive: ( attrs ) => 'tabs' === attrs.variantRole,
			}
		);

		registerBlockVariation(
			'generateblocks/container',
			{
				title: __( 'Tab Buttons', 'generateblocks' ),
				name: 'tab-buttons',
				scope: [ 'block' ],
				attributes: {
					variantRole: 'tab-buttons',
				},
				isActive: ( attrs ) => 'tab-buttons' === attrs.variantRole,
			}
		);

		registerBlockVariation(
			'generateblocks/container',
			{
				title: __( 'Tab Items', 'generateblocks' ),
				name: 'tab-items',
				scope: [ 'block' ],
				attributes: {
					variantRole: 'tab-items',
				},
				isActive: ( attrs ) => 'tab-items' === attrs.variantRole,
			}
		);

		registerBlockVariation(
			'generateblocks/container',
			{
				title: __( 'Tab Item', 'generateblocks' ),
				name: 'tab-item',
				scope: [ 'block' ],
				attributes: {
					variantRole: 'tab-item',
				},
				isActive: ( attrs ) => 'tab-item' === attrs.variantRole,
			}
		);

		registerBlockVariation(
			'generateblocks/container',
			{
				title: __( 'Tab Button', 'generateblocks' ),
				name: 'tab-button',
				scope: [ 'block' ],
				attributes: {
					variantRole: 'tab-button',
				},
				isActive: ( attrs ) => 'tab-button' === attrs.variantRole,
			}
		);

		registerBlockVariation(
			'generateblocks/button',
			{
				title: __( 'Tab Button', 'generateblocks' ),
				name: 'tab-button',
				scope: [ 'block' ],
				attributes: {
					variantRole: 'tab-button',
				},
				isActive: ( attrs ) => 'tab-button' === attrs.variantRole,
			}
		);
	}
} );
