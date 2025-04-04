/* global wal_enhanced_params */

jQuery( function ( $ ) {
	'use strict' ;

	function wal_get_enhanced_select_format_string( ) {
		return {
			'language' : {
				errorLoading : function () {
					return wal_enhanced_params.i18n_searching ;
				} ,
				inputTooLong : function ( args ) {
					var overChars = args.input.length - args.maximum ;

					if ( 1 === overChars ) {
						return wal_enhanced_params.i18n_input_too_long_1 ;
					}

					return wal_enhanced_params.i18n_input_too_long_n.replace( '%qty%' , overChars ) ;
				} ,
				inputTooShort : function ( args ) {
					var remainingChars = args.minimum - args.input.length ;

					if ( 1 === remainingChars ) {
						return wal_enhanced_params.i18n_input_too_short_1 ;
					}

					return wal_enhanced_params.i18n_input_too_short_n.replace( '%qty%' , remainingChars ) ;
				} ,
				loadingMore : function () {
					return wal_enhanced_params.i18n_load_more ;
				} ,
				maximumSelected : function ( args ) {
					if ( args.maximum === 1 ) {
						return wal_enhanced_params.i18n_selection_too_long_1 ;
					}

					return wal_enhanced_params.i18n_selection_too_long_n.replace( '%qty%' , args.maximum ) ;
				} ,
				noResults : function () {
					return wal_enhanced_params.i18n_no_matches ;
				} ,
				searching : function () {
					return wal_enhanced_params.i18n_searching ;
				}
			}
		} ;
	}

	try {
		$( document.body ).on( 'wal-enhanced-init' , function () {
			if ( $( 'select.wal_select2' ).length ) {
				//Select2 with customization
				$( 'select.wal_select2' ).each( function () {
					var select2_args = {
						allowClear : $( this ).data( 'allow_clear' ) ? true : false ,
						placeholder : $( this ).data( 'placeholder' ) ,
						minimumResultsForSearch : 10 ,
					} ;

					select2_args = $.extend( select2_args , wal_get_enhanced_select_format_string() ) ;

					$( this ).select2( select2_args ) ;
				} ) ;
			}
			if ( $( 'select.wal_select2_search' ).length ) {
				//Multiple select with ajax search
				$( 'select.wal_select2_search' ).each( function () {
					var select2_args = {
						allowClear : $( this ).data( 'allow_clear' ) ? true : false ,
						placeholder : $( this ).data( 'placeholder' ) ,
						minimumInputLength : $( this ).data( 'minimum_input_length' ) ? $( this ).data( 'minimum_input_length' ) : 3 ,
						escapeMarkup : function ( m ) {
							return m ;
						} ,
						ajax : {
							url : wal_enhanced_params.ajaxurl ,
							dataType : 'json' ,
							delay : 250 ,
							data : function ( params ) {
								return {
									term : params.term ,
									action : $( this ).data( 'action' ) ? $( this ).data( 'action' ) : 'wal_json_search_customers' ,
									include : $( this ).data( 'include' ) ,
									exclude : $( this ).data( 'exclude' ) ,
									include_roles : $( this ).data( 'include_roles' ) ,
									exclude_roles : $( this ).data( 'exclude_roles' ) ,
									show_user_name_only : $( this ).data( 'show_user_name_only' ) ,
									wal_security : $( this ).data( 'nonce' ) ? $( this ).data( 'nonce' ) : wal_enhanced_params.search_nonce ,
								} ;
							} ,
							processResults : function ( data ) {
								var terms = [ ] ;
								if ( data ) {
									$.each( data , function ( id , term ) {
										terms.push( {
											id : id ,
											text : term
										} ) ;
									} ) ;
								}
								return {
									results : terms
								} ;
							} ,
							cache : true
						}
					} ;

					select2_args = $.extend( select2_args , wal_get_enhanced_select_format_string() ) ;

					$( this ).select2( select2_args ) ;
				} ) ;
			}

			if ( $( '.wal_datepicker' ).length ) {
				$( '.wal_datepicker' ).on( 'change' , function ( ) {

					if ( $( this ).val( ) === '' ) {
						$( this ).next().next( ".wal_alter_datepicker_value" ).val( '' ) ;
					}
				} ) ;
				$( '.wal_datepicker' ).each( function ( ) {
					$( this ).datepicker( {
						altField : $( this ).next( ".wal_alter_datepicker_value" ) ,
						altFormat : 'yy-mm-dd' ,
						changeMonth : true ,
						changeYear : true ,
						showButtonPanel : true ,
						showOn : "button" ,
						buttonImage : wal_enhanced_params.calendar_image ,
						buttonImageOnly : true
					} ) ;
				} ) ;
			}

			if ( $( '.wal_datetimepicker' ).length ) {
				$( '.wal_datetimepicker' ).on( 'change' , function ( ) {
					if ( $( this ).val( ) === '' ) {
						$( this ).next().next( ".wal_alter_datepicker_value" ).val( '' ) ;
					}
				} ) ;
				$( '.wal_datetimepicker' ).each( function ( ) {
					$( this ).datetimepicker( {
						altField : $( this ).next( ".wal_alter_datepicker_value" ) ,
						altFieldTimeOnly : false ,
						altFormat : 'yy-mm-dd' ,
						altTimeFormat : 'HH:mm' ,
						dateFormat : 'yy-mm-dd' ,
						timeFormat : 'HH:mm' ,
						changeMonth : true ,
						changeYear : true ,
						showButtonPanel : true ,
						showOn : "button" ,
						buttonImage : wal_enhanced_params.calendar_image ,
						buttonImageOnly : true
					} ) ;
				} ) ;
			}

		} ) ;

		$( document.body ).trigger( 'wal-enhanced-init' ) ;
	} catch ( err ) {
		window.console.log( err ) ;
	}

} ) ;
