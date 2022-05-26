/* global fp_rac_admin_params */

jQuery( function ( $ ) {
	'use strict' ;

	if ( typeof fp_rac_admin_params === 'undefined' ) {
		return false ;
	}

	var FP_RAC_Admin_Tab = {
		init : function () {
			$( document ).on( 'plothover' , '#rac_each_container_details' , this.plot_hover ) ;
			$( document ).on( 'click' , '.fp-rac-tab' , this.handle_welcome_tabs ) ;
			$( document ).on( 'click' , '#rac_display_notice' , this.handle_background_process ) ;

			this.trigger_on_page_load() ;
		} ,
		trigger_on_page_load : function () {
			FP_RAC_Admin_Tab.initialize_tooltip() ;
			FP_RAC_Admin_Tab.initialize_graph() ;
			FP_RAC_Admin_Tab.initialize_select_field() ;
			FP_RAC_Admin_Tab.initialize_progress_bar() ;
		} , handle_welcome_tabs : function ( event ) {
			event.preventDefault( ) ;
			var $this = $( event.currentTarget ) ;

			$( '.fp-rac-tab' ).removeClass( 'fp-rac-active-welcome' ) ;
			$( '.fp-rac-content' ).hide() ;
			$( this ).addClass( 'fp-rac-active-welcome' ) ;

			$( $( this ).attr( 'href' ) ).show() ;

			return true ;

		} , initialize_select_field : function () {

			if ( $( '.fp-rac-select-field' ).length ) {
				//Multiple select with ajax search
				$( '.fp-rac-select-field' ).each( function () {
					if ( fp_rac_admin_params.rac_wc_version <= parseFloat( '2.2.0' ) ) {
						$( this ).chosen() ;
					} else {
						$( this ).select2() ;
					}
				} ) ;
			}


		} , initialize_tooltip : function () {
			if ( $( '.rac_tool_info:not(.rac_content_get)' ).length ) {
				$( '.rac_tool_info:not(.rac_content_get)' ).tipTip( { 'content' : fp_rac_admin_params.double_click_msg } ) ;
			}
		} , initialize_graph : function () {
			if ( $( '#rac_each_container_details' ).length ) {

				var plot = $.plot( "#rac_each_container_details" , [
					{ data : fp_rac_graph_params.mail_log , label : fp_rac_graph_params.email_log_label , color : "#29774a" } ,
					{ data : fp_rac_graph_params.abandon_cart , label : fp_rac_graph_params.abandon_cart_label , color : "#f00" } ,
					{ data : fp_rac_graph_params.recovered_orders , label : fp_rac_graph_params.recovered_order_label , color : "#00f" }
				] , {
					series : {
						lines : {
							show : true
						} ,
						points : {
							radius : 3 ,
							fill : true ,
							show : true
						}
					} ,
					xaxis : {
						mode : "time" ,
						tickSize : [ 1 , fp_rac_graph_params.tick_size ] ,
						minTickSize : [ 1 , fp_rac_graph_params.tick_size ] ,
					} ,
					yaxis : {
						min : 0 ,
						minTickSize : 1 ,
						tickDecimals : 0 ,
					} ,
					grid : {
						hoverable : true ,
						clickable : true ,
						borderWidth : 2 ,
						backgroundColor : { colors : [ "#ffffff" , "#EDF5FF" ] }
					}

				} ) ;

				$( "<div id='tooltip_commissions'></div>" ).css( {
					position : "absolute" ,
					display : "none" ,
					border : "1px solid #fdd" ,
					padding : "2px" ,
					"background-color" : "#fee" ,
					opacity : 0.80
				} ).appendTo( "body" ) ;
			}
		} , plot_hover : function ( event , pos , item ) {
			var str = "(" + pos.x.toFixed( 2 ) + ", " + pos.y.toFixed( 2 ) + ")" ;
			$( "#hoverdata" ).text( str ) ;
			if ( item ) {
				var x = new Date( item.datapoint[0] ) ,
						y = item.datapoint[1].toFixed( 2 ) ;
				var getdate = x.getDate() ;
				var getmonth = x.getMonth() ;
				getmonth += 1 ;
				var getyear = x.getFullYear() ;
				var formatted_date = getdate + "-" + getmonth + "-" + getyear ;
				$( "#tooltip_commissions" ).html( item.series.label + "<br />" + formatted_date + " : " + parseInt( y ) )
						.css( { top : item.pageY + 5 , left : item.pageX + 5 , color : item.series.color } )
						.fadeIn( 200 ) ;
			} else {
				$( "#tooltip_commissions" ).hide() ;
			}
		} , handle_background_process : function ( event ) {
			event.preventDefault( ) ;

			var $this = $( event.currentTarget ) ;

			if ( !confirm( fp_rac_admin_params.upgrade_alert_msg ) ) {
				return false ;
			}

			var data = ( {
				action : $( $this ).data( 'action' ) ,
				fp_rac_security : fp_rac_admin_params.upgrade_nonce ,
			} ) ;

			$.post( ajaxurl , data , function ( res ) {
				if ( true === res.success ) {
					window.location.href = res.data.url ;
				} else {
					alert( res.data.error ) ;
				}
			} ) ;
		} , initialize_progress_bar : function (  ) {

			if ( !$( '.fp_prograssbar_wrapper' ).length ) {
				return false ;
			}

			var data = ( {
				action : 'fp_progress_bar_status' ,
				fp_rac_security : fp_rac_admin_params.upgrade_nonce ,
			} ) ;

			$.post( ajaxurl , data , function ( res ) {
				if ( true === res.success ) {
					if ( res.data.percentage < 100 ) {
						$( '#fp_currrent_status' ).html( res.data.percentage ) ;
						$( '.fp-progress-bar' ).css( "width" , res.data.percentage + "%" ) ;
						FP_RAC_Admin_Tab.initialize_progress_bar() ;
					} else {
						$( '#fp_uprade_label' ).css( "display" , "none" ) ;
						$( '.fp-progress-bar' ).css( "width" , "100%" ) ;
						$( '#fp_progress_status' ).html( fp_rac_admin_params.upgrade_success_msg ) ;
						window.location.href = fp_rac_admin_params.upgrade_success_url ;
					}
				} else {
					alert( res.data.error ) ;
				}
			} ) ;
		}
	} ;
	FP_RAC_Admin_Tab.init() ;
} ) ;
