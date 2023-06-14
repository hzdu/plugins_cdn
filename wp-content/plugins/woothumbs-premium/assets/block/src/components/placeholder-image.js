import { useSelect } from '@wordpress/data';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import dataImage from './data-image';

const PlaceholderImage = ( { selectedProductValue } ) => {
	const selectedProductFeaturedImgSrc = useSelect( select => {
		if ( ! selectedProductValue ) {
			return dataImage;
		}

		const productObject = select('core').getEntityRecord('postType', 'product', selectedProductValue.value );

		if ( ! productObject ) {
			return dataImage;
		}

		if ( ! productObject.featured_media && ! productObject.gallery_images.length ) {
			return dataImage;
		}

		// Always default to the featured image, falling back to the first gallery image.
		const mediaToFetch = ( productObject.featured_media ) ? productObject.featured_media : productObject.gallery_images[0];
		const mediaObject  = select('core').getEntityRecord('postType', 'attachment', mediaToFetch );

		return ( mediaObject && mediaObject.media_details.sizes.woocommerce_single ) ? mediaObject.media_details.sizes.woocommerce_single.source_url : dataImage;
	} );

	return(
		<Fragment>
			<div className="iconic-woothumbs-block-editor-placeholder__image-wrap">
				<img
				className="iconic-woothumbs-block-editor-placeholder__image"
				src={ selectedProductFeaturedImgSrc }
				/>
			</div>

			{ ( selectedProductFeaturedImgSrc === null ) && (
				<Fragment>
					<p className="iconic-woothumbs-block-editor-placeholder__text">
						{ __( 'The selected product has no featured or gallery image(s) set, or there has been a technical issue.', 'iconic-woothumbs' ) }
					</p>
				</Fragment>
			) }
		</Fragment>
	)
}

export default PlaceholderImage;
