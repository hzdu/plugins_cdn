jQuery( function ( $ ) {
	'use strict' ;

	$( document.body )
			.on( 'fp_common_error_tip' , function ( e , element , error_type ) {
				var offset = element.position() ;
				if ( element.parent().find( '.wc_error_tip' ).length === 0 ) {
					element.after( '<div class="wc_error_tip ' + error_type + '">' + error_type + '</div>' ) ;
					element.parent().find( '.wc_error_tip' )
							.css( 'left' , offset.left + element.width() - ( element.width() / 2 ) - ( $( '.wc_error_tip' ).width() / 2 ) )
							.css( 'top' , offset.top + element.height() )
							.fadeIn( '100' ) ;
				}
			} )
			.on( 'fp_common_remove_error_tip' , function ( e , element , error_type ) {
				element.parent().find( '.wc_error_tip.' + error_type ).fadeOut( '100' , function () {
					$( this ).remove() ;
				} ) ;
			} )

			.on( 'click' , function () {
				$( '.wc_error_tip' ).fadeOut( '100' , function () {
					$( this ).remove() ;
				} ) ;
			} )

			.on( 'blur' , '.fp_text_min_max[type=text]' , function () {
				$( '.wc_error_tip' ).fadeOut( '100' , function () {
					$( this ).remove() ;
				} ) ;
			} )

	$( '.fp_text_min_max' ).on( 'keyup keypress change focusout keydown' , function ( e ) {
		var res = this.value.charAt( 0 ) ;
		var oldvalue = this.value ;
		var minvalue = $( this ).data( 'min' ) ;
		var error = fp_validate_text_params.rac_warning_message + minvalue ;
		console.log( e.keyCode ) ;
		//restrict only enter Numbers and Astrisk(*) 
		if ( res !== '*' ) {
			this.value = this.value.replace( /[^0-9\.]/g , '' ) ;
		} else {
			this.value = this.value.replace( /[^*]/g , '' ) ;
		}
		//display error message
		if ( this.value !== oldvalue ) {
			$( document.body ).triggerHandler( 'fp_common_error_tip' , [ $( this ) , error ] ) ;
		} else {
			$( document.body ).triggerHandler( 'fp_common_remove_error_tip' , [ $( this ) , error ] ) ;
		}

		//restrict for dobule dot in a value
		if ( e.which == 46 && $( this ).val().indexOf( '.' ) != -1 ) {
			e.preventDefault() ;
		}
		//restrict for double star(*) in a value
		if ( e.which == 56 && $( this ).val().indexOf( '*' ) != -1 ) {
			e.preventDefault() ;
		}
	} ) ;
	$( '.fp_text_min_max' ).on( 'focusout' , function ( e ) {
		var minvalue = $( this ).data( 'min' ) ;
		var val = $( this ).val() ;
		var error = fp_validate_text_params.rac_warning_message + minvalue ;
		//restrict not enter first value zero in field.
		if ( val < minvalue ) {
			this.value = this.value.replace( this.value , '' ) ;
			$( document.body ).triggerHandler( 'fp_common_error_tip' , [ $( this ) , error ] ) ;
		}
	} ) ;
} ) ;
