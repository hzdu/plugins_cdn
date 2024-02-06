import { addFilter } from '@wordpress/hooks';

const BlockAppender = ( appender, { isSelected, attributes } ) => {
	const {
		variantRole,
	} = attributes;

	if ( ( 'accordion' === variantRole || 'accordion-item' === variantRole ) && isSelected ) {
		return false;
	}

	return appender;
};

addFilter(
	'generateblocks.editor.containerAppender',
	'generateblocks/accordion/BlockAppender',
	BlockAppender,
);
