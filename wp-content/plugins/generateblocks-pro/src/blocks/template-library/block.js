/**
 * Block: Template Library
 */

import edit from './edit';
import getIcon from '../../utils/get-icon';
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import domReady from '@wordpress/dom-ready';

/**
 * Register our Pattern Library block.
 *
 * @param {string} name     Block name.
 * @param {Object} settings Block settings.
 */
domReady( () => {
	if ( generateBlocksPro.enableRemoteTemplates || generateBlocksPro.enableLocalTemplates ) {
		registerBlockType( 'generateblocks/template-library', {
			title: __( 'Pattern Library', 'generateblocks-pro' ),
			description: __( 'Insert pre-built patterns directly into your content.', 'generateblocks-pro' ),
			icon: getIcon( 'template-library' ),
			category: 'generateblocks',
			keywords: [
				__( 'template' ),
				__( 'library' ),
				__( 'generate' ),
			],
			supports: {
				customClassName: false,
			},
			edit,
			save: () => {
				return null;
			},
		} );
	}
} );
