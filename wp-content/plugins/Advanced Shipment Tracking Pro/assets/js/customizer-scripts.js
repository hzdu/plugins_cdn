/*
 * Customizer Scripts
 * Need to rewrite and clean up this file.
 */

jQuery(document).ready(function() {

    /**
     * Change description
     */	 	
	jQuery('#customize-theme-controls #accordion-section-themes').hide();					
	
	jQuery( '.accordion-section .panel-title' ).html(wcast_customizer.customizer_title);
	
	jQuery( '#sub-accordion-section-ast_tracking_general_section .customize-section-title > h3 .customize-action' ).append( '<span class="dashicons dashicons-arrow-right" style="padding-top:4px;"></span> AST' );
	
	jQuery( '#sub-accordion-panel-ast_pro_order_emails .preview-notice' ).html( 'Customizing <span class="dashicons dashicons-arrow-right" style="padding-top:4px;"></span> AST <strong class="panel-title">Email Notifications</strong>' );		
	
	// Handle mobile button click
    function custom_size_mobile() {
    	// get email width.
    	var email_width = parseInt( jQuery('#customize-control-kt_woomail_content_width .range-slider__range').val() );
		
    	var ratio = 380/email_width;
    	var framescale = 100/ratio;
    	var framescale = framescale/100;
    	jQuery('#customize-preview iframe').width(email_width+'px');
    	jQuery('#customize-preview iframe').css({
				'-webkit-transform' : 'scale(' + ratio + ')',
				'-moz-transform'    : 'scale(' + ratio + ')',
				'-ms-transform'     : 'scale(' + ratio + ')',
				'-o-transform'      : 'scale(' + ratio + ')',
				'transform'         : 'scale(' + ratio + ')'
		});
    }
	jQuery('#customize-footer-actions .preview-mobile').click(function(e) {				
		
		if ( wcast_customizer.responsive_mode ) {
			jQuery('#customize-preview iframe').width('100%');
			jQuery('#customize-preview iframe').css({
					'-webkit-transform' : 'scale(1)',
					'-moz-transform'    : 'scale(1)',
					'-ms-transform'     : 'scale(1)',
					'-o-transform'      : 'scale(1)',
					'transform'         : 'scale(1)'
			});
			
			jQuery('#customize-preview iframe').addClass('ast_mobile_preview');
		} else {
			custom_size_mobile();
		}
	});

	jQuery('#customize-footer-actions .preview-desktop').click(function(e) {
		jQuery('#customize-preview iframe').width('100%');
		jQuery('#customize-preview iframe').css({
				'-webkit-transform' : 'scale(1)',
				'-moz-transform'    : 'scale(1)',
				'-ms-transform'     : 'scale(1)',
				'-o-transform'      : 'scale(1)',
				'transform'         : 'scale(1)'
		});
	});
	jQuery('#customize-footer-actions .preview-tablet').click(function(e) {
		jQuery('#customize-preview iframe').width('100%');
		jQuery('#customize-preview iframe').css({
				'-webkit-transform' : 'scale(1)',
				'-moz-transform'    : 'scale(1)',
				'-ms-transform'     : 'scale(1)',
				'-o-transform'      : 'scale(1)',
				'transform'         : 'scale(1)'
		});
	});
});	

(function ( api ) {
    api.section( 'custom_partially_shipped_email', function( section ) {		
        section.expanded.bind( function( isExpanded ) {				
            var url;
            if ( isExpanded ) {
				jQuery('#save').trigger('click');
                url = wcast_customizer.partial_shipped_email_preview_url;
                api.previewer.previewUrl.set( url );
            }
        } );
    } );
} ( wp.customize ) );

(function ( api ) {
    api.section( 'custom_shipped_email', function( section ) {		
        section.expanded.bind( function( isExpanded ) {				
            var url;
            if ( isExpanded ) {
				jQuery('#save').trigger('click');
                url = wcast_customizer.shipped_email_preview_url;
                api.previewer.previewUrl.set( url );
            }
        } );
    } );
} ( wp.customize ) );

(function ( api ) {
    api.section( 'customer_completed_email', function( section ) {		
        section.expanded.bind( function( isExpanded ) {				
            var url;
            if ( isExpanded ) {
				jQuery('#save').trigger('click');
                url = wcast_customizer.completed_email_preview_url;
                api.previewer.previewUrl.set( url );
            }
        } );
    } );
} ( wp.customize ) );

(function ( api ) {
    api.section( 'ast_tracking_general_section', function( section ) {		
        section.expanded.bind( function( isExpanded ) {				
            var url;
            if ( isExpanded ) {
				jQuery('#save').trigger('click');
                url = wcast_customizer.tracking_preview_url;
                api.previewer.previewUrl.set( url );
            }
        } );
    } );
} ( wp.customize ) );


jQuery(document).on("change", ".preview_order_select", function(){
	var wcast_preview_order_id = jQuery(this).val();	
	var data = {
		security: wcast_customizer.customizer_nonce,
		action: 'update_email_preview_order',
		wcast_preview_order_id: wcast_preview_order_id,	
	};
	jQuery.ajax({
		url: ajaxurl,		
		data: data,
		type: 'POST',
		success: function(response) {			
			jQuery(".preview_order_select option[value="+wcast_preview_order_id+"]").attr('selected', 'selected');			
		},
		error: function(response) {
			console.log(response);			
		}
	});	
});