import { addFilter } from '@wordpress/hooks';

function showCurrentColors( show, props ) {
	if ( 'tab-button' === props.attributes.variantRole ) {
		show = true;
	}

	return show;
}

addFilter(
	'generateblocks.editor.addButtonCurrentColors',
	'generateblocks-pro/tabs/addCurrentColors',
	showCurrentColors
);

addFilter(
	'generateblocks.editor.addContainerCurrentColors',
	'generateblocks-pro/tabs/addCurrentColors',
	showCurrentColors
);
