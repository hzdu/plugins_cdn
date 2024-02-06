import { __ } from '@wordpress/i18n';

function getCompatibilityWarning( props ) {
	const {
		name,
		globalStyleId,
		hasButtonContainer,
		useInnerContainer,
	} = props;

	if ( ! globalStyleId ) {
		return '';
	}

	let message = '';

	const blockName = name.replace( 'generateblocks/', '' );
	const globalAttributes = generateBlocksPro?.globalStyleAttrs[ blockName ] && generateBlocksPro?.globalStyleAttrs[ blockName ][ globalStyleId ]
		? generateBlocksPro?.globalStyleAttrs[ blockName ][ globalStyleId ]
		: {};

	const globalBlockVersion = globalAttributes?.blockVersion || 1;

	if ( 'button' === blockName ) {
		const globalHasButtonContainer = globalAttributes?.hasButtonContainer || globalBlockVersion < 3;

		if ( ! hasButtonContainer && globalHasButtonContainer ) {
			message = __( 'This Global Style is a Button block inside the "Buttons" block and may not work with this standalone Button.', 'generateblocks-pro' );
		}

		if ( hasButtonContainer && ! globalHasButtonContainer ) {
			message = __( 'This Global Style is a standalone Button and may not work with this Button block inside the "Buttons" block.', 'generateblocks-pro' );
		}
	}

	if ( 'container' === blockName ) {
		const globalUseInnerContainer = globalAttributes?.useInnerContainer || globalBlockVersion < 3;

		if ( ! useInnerContainer && globalUseInnerContainer ) {
			message = __( 'This Global Style is using the legacy layout system and may not work with this Container block.', 'generateblocks-pro' );
		}

		if ( useInnerContainer && ! globalUseInnerContainer ) {
			message = __( 'This Global Style is using the new layout system and may not work with this Container block.', 'generateblocks-pro' );
		}
	}

	return message;
}

export {
	getCompatibilityWarning,
};
