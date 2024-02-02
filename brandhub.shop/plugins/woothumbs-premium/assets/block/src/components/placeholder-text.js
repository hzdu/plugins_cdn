import { __ } from '@wordpress/i18n';

const PlaceholderText = () => {
	return (
		<p className="iconic-woothumbs-block-editor-placeholder__text">
			{ __( 'This block will appear as a WooThumbs gallery when viewed on the front-end of your site, and uses the ', 'iconic-woothumbs' ) }
			<a
				className="iconic-woothumbs-block-editor-placeholder__link"
				href="/wp-admin/admin.php?page=iconic-woothumbs-settings"
				target="_blank">
					{ __( 'WooThumbs settings', 'iconic-woothumbs' ) }.
			</a>
		</p>
	)
}

export default PlaceholderText;
