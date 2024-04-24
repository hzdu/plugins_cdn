import { Icon } from '@wordpress/components';
import metadata from '../block.json';
import iconCube from './icon-cube';

const PlaceholderHeading = ( { selectedProductValue } ) => {
	const title = ( selectedProductValue ) ? `${metadata.title}: ${selectedProductValue.label}` : metadata.title;
	return (
		<p className="iconic-woothumbs-block-editor-placeholder__heading">
			<Icon icon={iconCube}/>
			{ title }
		</p>
	)
}

export default PlaceholderHeading;
