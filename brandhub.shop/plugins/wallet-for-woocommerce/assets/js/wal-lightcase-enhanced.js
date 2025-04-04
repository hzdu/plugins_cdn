
jQuery( function ( $ ) {
	'use strict' ;
	try {          
		$(document.body).on('wal-enhanced-lightcase', function ( ) {

			var light_cases = $('.wal-popup');

			if (!light_cases.length) {
				return;
			}
						 
			light_cases.each( function ( ) {
				$( this ).lightcase( {
					href : $( this ).data( 'popup' ) ,                                        
					onFinish : {
						foo : function ( ) {
							lightcase.resize( ) ;                                                       
						}
					} ,
				} ) ;
			} ) ;                       
		} ) ;

		$( document.body ).trigger( 'wal-enhanced-lightcase' ) ;               
	} catch ( err ) {
		window.console.log( err ) ;
	}

} ) ;
