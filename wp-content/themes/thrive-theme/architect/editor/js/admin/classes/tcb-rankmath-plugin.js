( $ => {
	const TCBSeoPlugin = require( './tcb-seo-plugin' );

	module.exports = class TCBRankMathPlugin extends TCBSeoPlugin {
		/**
		 * Class constructor
		 */
		constructor() {
			super();
			this.hooks();
		}

		/**
		 * Init the custom fields
		 */
		init() {
			this.content = '';
			this.fetchContent();
		}

		/**
		 * Hook into Rank Math App eco-system
		 */
		hooks() {
			wp.hooks.addFilter( 'rank_math_content', 'rank-math', content => {
				content += this.content;

				return content;
			}, 11 );
		}

		/**
		 * Fetch Post Content from TCB
		 */
		sendContent( fetchedContent ) {
			this.content = fetchedContent;
			if ( typeof window.rankMathEditor !== 'undefined' ) {
				rankMathEditor.refresh( 'content' );
			}
		}

		afterFetch( response ) {
			this.sendContent( response );
		}
	}
} )( jQuery );

