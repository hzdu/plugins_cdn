/**
 * Copy and Paste Block Styles Component
 *
 */
import getIcon from '../../../utils/get-icon';
import noStyleAttributes from '../../../utils/no-style-attributes';

import {
	__,
} from '@wordpress/i18n';

import {
	Component,
} from '@wordpress/element';

import {
	ToolbarGroup,
} from '@wordpress/components';

const {
	localStorage,
} = window;

const POPOVER_PROPS = {
	className: 'block-editor-block-settings-menu__popover',
	position: 'bottom right',
};

/**
 * Build the copy and paste controls
 *
 * @return {Object} copy and paste settings.
 */
class StyleCopyPaste extends Component {
	render() {
		const {
			onPaste,
			blockAttributes,
			blockName,
		} = this.props;

		const copiedStyles = JSON.parse( localStorage.getItem( 'generateblocks' + blockName + 'Style' ) );

		const copyAction = () => {
			const copyStyles = {};

			const noCopy = noStyleAttributes;

			Object.keys( blockAttributes ).forEach( ( attribute ) => {
				if ( ! noCopy.includes( attribute ) ) {
					copyStyles[ attribute ] = blockAttributes[ attribute ];
				}
			} );

			localStorage.setItem( 'generateblocks' + blockName + 'Style', JSON.stringify( copyStyles ) );
		};

		const pasteAction = () => {
			const pasteItem = JSON.parse( localStorage.getItem( 'generateblocks' + blockName + 'Style' ) );

			if ( pasteItem ) {
				onPaste( pasteItem );
			}
		};

		return (
			<ToolbarGroup
				isCollapsed={ true }
				icon={ getIcon( 'copy' ) }
				label={ __( 'Copy/Paste Styles', 'generateblocks-pro' ) }
				popoverProps={ POPOVER_PROPS }
				controls={
					[
						{
							title: __( 'Copy Styles', 'generateblocks-pro' ),
							onClick: copyAction,
						},
						{
							title: __( 'Paste Styles', 'generateblocks-pro' ),
							onClick: pasteAction,
							isDisabled: ! copiedStyles,
						},
					]
				}
			/>
		);
	}
}
export default ( StyleCopyPaste );
