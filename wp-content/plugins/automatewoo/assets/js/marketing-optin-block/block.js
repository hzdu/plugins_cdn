/**
 * External dependencies
 */
import { CheckboxControl } from '@woocommerce/blocks-checkout';
import { useState, useEffect } from '@wordpress/element';
import { getSetting } from '@woocommerce/settings';

const { optinEnabled, alreadyOptedIn } = getSetting( 'automatewoo_data' );

/**
 * The component that gets rendred on frontend.
 *
 * @param {Object} props Incoming props.
 * @param {string} [props.text] The checkbox text.
 * @param {Object} [props.checkoutExtensionData] Passed from Checkout block, used to append data.
 */
const Block = ( { text, checkoutExtensionData } ) => {
	const [ checked, setChecked ] = useState( false );
	const { setExtensionData } = checkoutExtensionData;
	useEffect( () => {
		if ( optinEnabled || alreadyOptedIn ) {
			setExtensionData( 'automatewoo', 'optin', checked );
		}
	}, [ checked, setExtensionData ] );

	if ( ! optinEnabled || alreadyOptedIn ) {
		return null;
	}

	return (
		<CheckboxControl checked={ checked } onChange={ setChecked }>
			<span
				dangerouslySetInnerHTML={ {
					__html: text,
				} }
			/>
		</CheckboxControl>
	);
};

export default Block;
