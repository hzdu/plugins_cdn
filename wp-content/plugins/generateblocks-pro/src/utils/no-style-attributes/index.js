import {
	applyFilters,
} from '@wordpress/hooks';

const noStyleAttributes = applyFilters(
	'generateblocks.utils.noStyleAttributes',
	[
		'uniqueId',
		'anchor',
		'className',
		'url',
		'hasUrl',
		'target',
		'relNoFollow',
		'relSponsored',
		'text',
		'content',
		'icon',
		'hasIcon',
		'customIcon',
		'ariaLabel',
		'isGrid',
		'gridId',
		'showAdvancedTypography',
		'isDynamic',
		'marginSyncUnits',
		'paddingSyncUnits',
		'elementId',
		'cssClasses',
		'linkType',
		'hiddenLinkAriaLabel',
		'htmlAttributes',
		'isGlobalStyle',
	],
);

export default noStyleAttributes;
