/* global fusionAppConfig FusionApp */

var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	FusionPageBuilder.postLock = window.wp.Backbone.View.extend( {

		template: FusionPageBuilder.template( jQuery( '#fusion-builder-front-end-post-lock' ).html() ),
		className: 'fusion-post-lock-dialog',
		tagName: 'div',

			/**
			 * Init.
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
			initialize: function() {
				const context = this;

				// When post edit is taken.
				jQuery( document ).on( 'heartbeat-tick', function ( event, data ) {
					if ( data[ 'post-edit-taken' ] && !fusionAppConfig.post_lock_data ) {
						jQuery.ajax( {
							type: 'POST',
							url: fusionAppConfig.ajaxurl,
							dataType: 'json',
							data: {
								post_id: FusionApp.initialData.postDetails.post_id,
								takeover: true,
								fusion_load_nonce: fusionAppConfig.fusion_load_nonce,
								action: 'fusion_get_post_lock_data'
							}
						} )
						.done( function( res ) {
							fusionAppConfig.post_lock_data = res;
							context.render( true );
						} );
					}
				} );
			},

			/**
			 * Renders the view.
			 *
			 * @since 2.0.0
			 * @return {Object} this
			 */
			render: function( force ) {
				if ( !fusionAppConfig.post_lock_data && !force ) {
					return this;
				}

				this.$el.html( this.template() );

				this.$el = this.$el.dialog( {
					draggable: false,
					resizable: false,
					modal: true,
					width: 480,
					minHeight: 100,
					dialogClass: 'fusion-builder-dialog fusion-builder-post-lock-dialog',
					closeOnEscape: false,
					create: function () {
						jQuery( '.ui-widget-header' ).hide();
					}
				} ).closest( '.ui-dialog' );

				return this;
			}
	} );
}( jQuery ) );
