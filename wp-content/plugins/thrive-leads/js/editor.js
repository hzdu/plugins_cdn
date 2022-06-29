/**
 * this file is loaded pn Inner Frame
 */

var TVE_Content_Builder = TVE_Content_Builder || {},
	TVE = window.parent.TVE || {};
TVE_Content_Builder.ext = TVE_Content_Builder.ext || {};

var TL_Editor = window.parent.TL_Editor || {};
var TL_Editor_Page = {};

/** @var tve_leads_page_data Object */
/**
 * Extensions added to the TCB editor
 */
( function ( $ ) {
	window.parent.TL_Editor_Page = TL_Editor_Page;

	TL_Editor_Page.handle_state_response = function ( response ) {
		var tve_leads_page_data = window.parent.tve_leads_page_data;

		/** custom CSS */
		$( '.tve_custom_style,.tve_user_custom_style,.tve_global_style' ).remove();
		TVE.CSS_Rule_Cache.clear();

		$( 'head' ).append( response.custom_css )
		           .append( response.global_css );

		/** template-related CSS and fonts */
		if ( ! response.css.thrive_events ) {
			$( '#thrive_events-css,#tve_lightbox_post-css' ).remove();
		}
		jQuery.each( response.css, function ( _id, href ) {
			if ( ! $( '#' + _id + '-css' ).length ) {
				$( 'head' ).append( '<link href="' + href + '" type="text/css" rel="stylesheet" id="' + _id + '-css"/>' );
			}
		} );

		/**
		 * custom body classes needed for lightboxes
		 */
		$( 'body' ).removeClass( 'tve-l-open tve-o-hidden tve-lightbox-page' ).addClass( response.body_class );

		/**
		 * javascript params that need updating
		 */
		TVE.CONST = jQuery.extend( TVE.CONST, response.tve_path_params, true );

		/**
		 * if the template has changed, remove the old css (the new one will be added automatically)
		 */
		if ( tve_leads_page_data.current_css != response.tve_leads_page_data.current_css ) {
			$( '#' + tve_leads_page_data.current_css + '-css' ).remove();
		}

		/**
		 * tve_leads javascript page data
		 */
		tve_leads_page_data = jQuery.extend( tve_leads_page_data, response.tve_leads_page_data, true );

		TL_Editor.tcbEditorSetSelector();

		/**
		 * Check if the current template needs a Thrive Themes wrapper
		 */
		/* if the current template has Thrive Themes wrappers */
		var $replace = $( '#tve-leads-editor-replace' ),
			hasTTWrapper = $replace.closest( '.cnt.bSe' ).length;

		if ( response.needs_tt_wrapper && ! hasTTWrapper ) {
			$replace.wrap( '<div class="cnt bSe"></div>' ).wrap( '<article>' );
		} else if ( ! response.needs_tt_wrapper && hasTTWrapper ) {
			$replace.unwrap().unwrap();
		}
		var $new_content = $(response.main_page_content);

		$replace.empty().unwrap().replaceWith( $new_content );

		TVE.Editor_Page.initEditorActions( true ); // make sure old rules are added to the end of the desktop media query
		$new_content.find( '[data-css]:not(.thrv_symbol  *)' ).each( function () {
			$(this).head_css_clone();
		} );
	};

	/**
	 * pre-process the HTML node to be inserted
	 *
	 * @param {object} $html jQuery wrapper over the HTML to be inserted
	 */
	TL_Editor.pre_process_content_template = function ( $html ) {
		var tl_classes = [
			'thrv-leads-slide-in',
			'thrv-greedy-ribbon',
			'thrv-leads-form-box',
			'thrv-ribbon',
			'thrv-leads-screen-filler',
			'thrv-leads-widget'
		];

		$.each( tl_classes, function ( i, cls ) {
			if ( $html.hasClass( cls ) ) {
				$html = $html.children();
				$html.find( '.tve-leads-close' ).remove();
				return false;
			}
		} );

		return $html;
	};

} )( jQuery );
