import { addFilter } from '@wordpress/hooks';

/**
 * Add custom attribute for accordions.
 *
 * @param {Object} settings Settings for the block.
 * @return {Object} settings Modified settings.
 */
const attributes = ( settings ) => {
	if ( 'undefined' === typeof settings.attributes ) {
		return settings;
	}

	if ( 'generateblocks/container' === settings.name ) {
		settings.attributes = Object.assign(
			settings.attributes, {
				accordionItemOpen: {
					type: 'boolean',
					default: false,
				},
				accordionMultipleOpen: {
					type: 'boolean',
					default: false,
				},
				syncAccordionItemStyles: {
					type: 'boolean',
					default: true,
				},
				accordionTransition: {
					type: 'string',
					default: '',
				},
				accordionToggleType: {
					type: 'string',
					default: 'button',
				},
				faqSchema: {
					type: 'boolean',
					default: false,
				},
			}
		);

		settings.providesContext = Object.assign(
			settings.providesContext, {
				'generateblocks-pro/accordionItemOpen': 'accordionItemOpen',
				'generateblocks-pro/accordionTransition': 'accordionTransition',
				'generateblocks-pro/faqSchema': 'faqSchema',
			},
		);

		settings.usesContext = [
			...settings.usesContext,
			'generateblocks-pro/accordionItemOpen',
			'generateblocks-pro/accordionTransition',
			'generateblocks-pro/faqSchema',
		];
	}

	if ( 'generateblocks/button' === settings.name ) {
		settings.attributes = Object.assign(
			settings.attributes, {
				accordionItemOpen: {
					type: 'boolean',
					default: false,
				},
			}
		);

		settings.providesContext = Object.assign(
			settings.providesContext, {
				'generateblocks-pro/faqSchema': 'faqSchema',
			},
		);

		settings.usesContext = [
			...settings.usesContext,
			'generateblocks-pro/accordionItemOpen',
			'generateblocks-pro/faqSchema',
		];
	}

	return settings;
};

addFilter(
	'blocks.registerBlockType',
	'generateblocks/accordion/attributes',
	attributes
);
