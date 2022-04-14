import CopyPasteStyles from './copy-paste';
/**
 * WordPress Dependencies
 */

import {
	addFilter,
} from '@wordpress/hooks';

import {
	Fragment,
} from '@wordpress/element';

import {
	BlockControls,
} from '@wordpress/block-editor';

import {
	createHigherOrderComponent,
} from '@wordpress/compose';

const allowedBlocks = [ 'generateblocks/container', 'generateblocks/button', 'generateblocks/headline', 'generateblocks/button-container' ];

/**
 * Add controls to the Container block toolbar.
 *
 * @param {Function} BlockEdit Block edit component.
 *
 * @return {Function} BlockEdit Modified block edit component.
 */
const withAdvancedControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const {
			name,
			attributes,
			isSelected,
			setAttributes,
		} = props;

		let blockName = '';

		if ( 'generateblocks/container' === name ) {
			blockName = 'Container';
		} else if ( 'generateblocks/button' === name ) {
			blockName = 'Button';
		} else if ( 'generateblocks/headline' === name ) {
			blockName = 'Headline';
		} else if ( 'generateblocks/container' === name ) {
			blockName = 'ButtonContainer';
		}

		return (
			<Fragment>
				<BlockEdit { ...props } />

				{ isSelected && allowedBlocks.includes( name ) &&
					<Fragment>
						<BlockControls>
							<CopyPasteStyles
								onPaste={ ( value ) => setAttributes( value ) }
								blockAttributes={ attributes }
								blockName={ blockName }
							/>
						</BlockControls>
					</Fragment>
				}
			</Fragment>
		);
	};
}, 'withAdvancedControls' );

addFilter(
	'editor.BlockEdit',
	'generateblocks-pro/copy-paste-styles/toolbar',
	withAdvancedControls
);
