/**
 * RankMath custom fields integration class
 */

class RankMathCustomFields {

	/**
	 * Class constructor
	 */
	constructor() {
		this.init()
		this.hooks()
		this.events()

		const that = this;

		jQuery(document).on('mfn:builder:item:add mfn:builder:item:clone mfn:builder:element:delete', function( $this, item ){
			that.init()
			that.events()
			rankMathEditor.refresh( 'content' )
		});
	}

	/**
	 * Init the custom fields
	 */
	init() {
		this.fields = this.getFields()
		this.getContent = this.getContent.bind( this )
	}

	/**
	 * Hook into Rank Math App eco-system
	 */
	hooks() {
		wp.hooks.addFilter( 'rank_math_content', 'rank-math', this.getContent, 11 )
	}

	/**
	 * Capture events from custom fields to refresh Rank Math analysis
	 */
	events() {
		jQuery( this.fields ).each( function( key, value ) {
			jQuery( value ).on(
				'keyup change',
				_.debounce( function() {
					rankMathEditor.refresh( 'content' )
				}, 500 )
			)
		} )
	}

	/**
	 * Get custom fields ids.
	 *
	 * @return {Array} Array of fields.
	 */
	getFields() {

		const fields = []
    const $builder = jQuery('#mfn-builder');

		if( $builder.length ){

			jQuery( '.mfn-form-control.preview-title, .mfn-form-control.preview-subtitle, .mfn-form-control.preview-content, .mfn-form-control.preview-image', $builder ).each( function() {
				fields.push( jQuery(this) )
			} );

		} else {

			if( jQuery( '#mfn-rankmath-content' ).val() ){
				fields.push( jQuery( '#mfn-rankmath-content' ) );
			}

		}

		return fields
	}

	/**
	 * Gather custom fields data for analysis
	 *
	 * @param {string} content Content to replce fields in.
	 *
	 * @return {string} Replaced content.
	 */
	getContent = function( content ) {

		// this.fields = this.getFields()

		jQuery( this.fields ).each( function( key, el ) {

			if( ! el ){
				return true;
			}

			var $el = jQuery(el);

			if( ! $el.val() ){
				return;
			}

			if( $el.is('.preview-image') ){

				// image

				content += ' <img src="'+ $el.val() + '" alt="" />' ;

			} else if( $el.is('.rm-heading') ){

				// heading

				var tag = $el.closest('.modalbox-card').find('input[name$="header_tag]"]:checked').val();

				if( tag ){
					content += ' <'+tag+'>'+ $el.val() + '</'+tag+'>' ;
				}

			} else {

				// default

				content += ' '+ $el.val();

			}

		});

		// console.log(content);

		return content;
	}

}

jQuery( function() {
	setTimeout( function() {
		new RankMathCustomFields()
	}, 500 )
} )
