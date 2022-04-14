/**
 * Block: Template Library
 */

import edit from './edit';
import getIcon from '../../utils/get-icon';

import {
	__,
} from '@wordpress/i18n';

import {
	registerBlockType,
	unregisterBlockType,
} from '@wordpress/blocks';

import domReady from '@wordpress/dom-ready';

/**
 * Register our Grid block.
 *
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'generateblocks/template-library', {
	title: __( 'Template Library', 'generateblocks-pro' ),
	icon: getIcon( 'generateblocks' ),
	category: 'generateblocks',
	keywords: [
		__( 'template' ),
		__( 'library' ),
		__( 'generate' ),
	],
	edit,
	save: () => {
		return null;
	},
} );

domReady( () => {
	if ( ! generateBlocksPro.enableRemoteTemplates && ! generateBlocksPro.enableLocalTemplates ) {
		unregisterBlockType( 'generateblocks/template-library' );
	}
} );
