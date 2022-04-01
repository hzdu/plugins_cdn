/**
 * External dependencies
 */
import { registerCheckoutBlock } from '@woocommerce/blocks-checkout';
import { withFilteredAttributes } from '@woocommerce/shared-hocs';
/**
 * Internal dependencies
 */
import metadata from './block.json';
import attributes from './attributes';
import FrontendBlock from './block';

registerCheckoutBlock( {
	metadata,
	component: withFilteredAttributes( attributes )( FrontendBlock ),
} );
