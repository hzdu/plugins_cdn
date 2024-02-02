
/**
 * This file adds some LIVE to the Theme Customizer live preview. To leverage
 * this, set your custom settings to 'postMessage' and then add your handling
 * here. Your javascript should grab settings from customizer controls, and 
 * then make any necessary changes to the page using jQuery.
 */
( function( $ ) {

	// Update the site title in real time...
	wp.customize( 'wsmt_nav_background', function( value ) {
		value.bind( function( newval ) {
			
			$( 'nav.woocommerce-MyAccount-navigation.wsmt_extra_navclass' ).css( 'backgroundColor', newval );;
		} );
	} );

	wp.customize( 'wsmt_nav_color', function( value ) {
		value.bind( function( newval ) {
			
			$( 'a.woocommerce-MyAccount-navigation-link_a' ).css( 'color', newval );;
		} );
	} );


	wp.customize( 'wsmt_li_fontsize', function( value ) {
		value.bind( function( newval ) {
			
			$( 'a.woocommerce-MyAccount-navigation-link_a' ).css( 'font-size', newval );;
		} );
	} );


	wp.customize( 'wsmt_li_padding', function( value ) {
		value.bind( function( newval ) {
			
			$( 'a.woocommerce-MyAccount-navigation-link_a' ).css( 'padding-left', newval );;
		} );
	} );


	wp.customize( 'wsmt_li_background', function( value ) {
		value.bind( function( newval ) {
			
			$( 'li.woocommerce-MyAccount-navigation-link' ).css( 'backgroundColor', newval );;
		} );
	} );

	

	//Update site background color...
	wp.customize( 'wsmt_nav_background', function( value ) {
		value.bind( function( newval ) {
			$('p.wsmt_theme_options').text(newval);
		} );
	} );




	
} )( jQuery );

