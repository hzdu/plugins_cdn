( $ => {
	module.exports = class TCBSeoPlugin {
		/**
		 * Fetch Post Content from TCB
		 */
		fetchContent() {
			$.ajax( {
				url: ajaxurl,
				type: 'post',
				dataType: 'json',
				data: {
					post_id: TCB_Post_Edit_Data.post_id,
					action: 'tve_get_seo_content'
				}
			} ).done( response => {
				const $content = $( response.content );
				/* Remove TTB headers and footers from SEO analysis */
				$content.find( 'header#thrive-header, footer#thrive-footer, aside#theme-sidebar-section' ).remove();

				this.afterFetch( $content.html() );
			} );
		}

		afterFetch() {
			throw Error( 'Class should implement the afterFetch function' );
		}
	}
} )( jQuery );

