import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import getIcon from '../../../../utils/get-icon';
import Horizontal from './Horizontal';
import Vertical from './Vertical';
import Buttons from './Buttons';

function addTemplateSelectors( context, props ) {
	const tabTemplates = {
		label: __( 'Tabs', 'generateblocks-pro' ),
		instructions: __( 'Choose a tab layout to start with.', 'generateblocks-pro' ),
		templates: [
			{
				id: 'horizontal-tabs',
				label: __( 'Horizontal Tabs', 'generateblocks-pro' ),
				icon: getIcon( 'horizontal-tabs' ),
				innerBlocks: Horizontal,
			},
			{
				id: 'vertical-tabs',
				label: __( 'Vertical Tabs', 'generateblocks-pro' ),
				icon: getIcon( 'vertical-tabs' ),
				innerBlocks: Vertical,
				attributes: {
					display: 'flex',
					flexDirection: 'row',
					flexDirectionMobile: 'column',
				},
			},
			{
				id: 'button-tabs',
				label: __( 'Button Tabs', 'generateblocks-pro' ),
				icon: getIcon( 'button-tabs' ),
				innerBlocks: Buttons,
				attributes: {
					display: 'flex',
					flexDirection: 'column',
					columnGap: '20px',
					rowGap: '20px',
				},
			},
		],
	};

	if ( 'tabs' === props.attributes.variantRole ) {
		return tabTemplates;
	}

	return context;
}

addFilter(
	'generateblocks.editor.templateContext',
	'generateblocks-pro/tabs/add-template-selector',
	addTemplateSelectors
);
