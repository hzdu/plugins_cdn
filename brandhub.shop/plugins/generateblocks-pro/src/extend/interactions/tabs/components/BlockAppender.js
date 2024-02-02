import { addFilter } from '@wordpress/hooks';

const BlockAppender = ( appender, { isSelected, attributes } ) => {
	const { variantRole } = attributes;

	if ( ( 'tab-items' === variantRole || 'tab-buttons' === variantRole ) && isSelected ) {
		return '';
	}

	return appender;
};

addFilter(
	'generateblocks.editor.containerAppender',
	'generateblocks/accordion/BlockAppender',
	BlockAppender,
);
