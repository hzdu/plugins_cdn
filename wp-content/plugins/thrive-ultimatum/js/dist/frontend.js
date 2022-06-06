var TVE_Ult = TVE_Ult || {};
var TVE_Ult_Data = TVE_Ult_Data || {};
var ThriveGlobal = ThriveGlobal || {$j: jQuery.noConflict()};

( function ( $ ) {
	/**
	 * array of callback functions to be applied when the designs are shown
	 * @type {Array}
	 */
	var on_show_callbacks = [],
		$body;
	/**
	 * load css files in the current page
	 * @param {Array} stylesheets
	 */
	TVE_Ult.add_page_css = function ( stylesheets ) {
		$.each( stylesheets, function ( _id, href ) {
			_id += '-css';
			if ( ! $( '#' + _id ).length ) {
				$( '<link rel="stylesheet" id="' + _id + '" type="text/css" href="' + href + '"/>' ).prependTo( 'head' );
			}
		} );
	};

	/**
	 * we need to add the scripts using this method, to make sure the onload callback is fired properly
	 * @param src
	 * @param onload
	 */
	TVE_Ult.add_head_script = function ( src, id, onload ) {
		var script = document.createElement( 'script' ),
			head = $( 'head' )[ 0 ];

		script.async = true;
		if ( typeof onload === 'function' ) {
			script.onload = script.onreadystatechange = onload;
		}
		if ( typeof id !== 'undefined' ) {
			script.id = id;
		}

		script.src = src;

		head.insertBefore( script, head.firstChild );
	};

	TVE_Ult.add_page_js = function ( links, onLoad ) {
		if ( typeof onLoad !== 'function' ) {
			onLoad = function () {
			};
		}
		var to_load = 0,
			check_loaded_counter = 0;

		function loadFonts() {
			$.each( links, function ( _id, href ) {
				if ( _id === 'tve_frontend' && typeof TCB_Front !== 'undefined' ) {
					return true;
				}
				if ( _id === 'tve_leads_frontend' && typeof TL_Front !== 'undefined' && TL_Front.add_page_css ) {
					return true;
				}
				_id += '-js';
				if ( href && $( '#' + _id ).length === 0 ) {
					to_load ++;
					/* facebook needs to be inserted with a custom fragment appended - jQuery.getScript does not allow that */
					if ( href.indexOf( 'connect.facebook.net' ) !== - 1 ) {
						TVE_Ult.add_head_script( href, _id, function () {
							to_load --;
						} );
						return true;
					}
					$.getScript( href, function () {
						to_load --;
					} ).fail( function () {
						console.log( 'Failed to load: ' + href );
						console.log( arguments );
					} );
				}
			} );

			check_loaded();
		}

		if ( typeof TCB_Front === 'undefined' ) {
			$.getScript( links[ 'tve_frontend' ] ).done( loadFonts );
		} else {
			loadFonts();
		}

		function check_loaded() {
			check_loaded_counter ++;
			if ( to_load === 0 ) {
				onLoad();
				return;
			}
			if ( check_loaded_counter === 100 ) {
				// failsafe - might be that an error occurred at script loading
				return;
			}
			setTimeout( check_loaded, 50 );
		}
	};

	$( function () {

		var resourcesLoaded = false,
			modulesFinishedLoading = false;
		$body = $( 'body' );

		function insert_response( response, allData ) {
			/* if we have conditional displays on the request, we append them to the localized variable */
			if ( typeof allData !== 'undefined' && allData.lazy_load_conditional_preview && tcb_condition_sets ) {
				allData.lazy_load_conditional_preview.forEach( function ( display ) {
					var index = tcb_condition_sets.findIndex( function ( item ) {
						return item.key === display.key
					} );
					if ( index === - 1 ) {
						tcb_condition_sets.push( display );
					}
				} )
			}
			setTimeout( function () {
				do_insert_response( response );

				if ( response.lightspeed ) {
					//if TCB isnt loaded yet we have to wait
					if ( response.lightspeed.js && typeof TCB_Front === 'undefined' ) {
						var tcbInterval = setInterval( function () {
							if ( typeof TCB_Front !== 'undefined' ) {
								clearInterval( tcbInterval );
								insertLightspeedAssets( response.lightspeed );
							}
						}, 100 );
					} else {
						insertLightspeedAssets( response.lightspeed )
					}
				}
			}, 200 );
		}

		/**
		 * ajax-load the campaign designs
		 */
		function do_insert_response( r ) {
			if ( ! r ) {
				return;
			}
			/**
			 * append the html to the page
			 */
			$.each( r, function ( campaign_id, response ) {
				campaign_id = parseInt( campaign_id );

				/**
				 * return if not number
				 */
				if ( isNaN( campaign_id ) ) {
					return;
				}
				/**
				 * loop through each campaign object
				 */
				$.each( response.html, function ( _id, _html ) {

					var $html = $( _html ),
						$timers = $html.find( '.thrv_countdown_timer,.tve-countdown' );

					$.each( response.timer_components, function ( key, v ) {
						$timers.attr( 'data-' + key, v );
					} );
					$html.data( 'campaign_id', campaign_id );
					if ( _id === 'widget' ) {
						// append the widget to the placeholder
						var $container = $( '#tve-ult-widget-container' ),
							widget_id = $container.data( 'widget-id' );
						if ( ! $container.length ) { // simply do not show the widget

							return true;
						}
						/**
						 * set the widget id because of the replaceWith
						 * and to be used later
						 * @see TVE_Ult.hide_design
						 */
						$html.attr( 'data-widget-id', widget_id );

						$container.find( '#tve-ult-widget-placeholder' ).replaceWith( $html );

						if ( $container.hasClass( 'tve-ult-preload-form' ) ) {
							$container.find( '.widget_tve_ult_widget' ).addClass( 'tve-ult-preload-form' ).attr( 'style', $container.attr( 'style' ) );
						}

						$container.children().unwrap();

						return true;

					} else if ( _id === 'header-bar' ) {
						on_show_callbacks.push( TVE_Ult.top_ribbon_show );
					} else if ( _id.indexOf( 'shortcode' ) !== - 1 ) {
						var $placeholder = $( '.tu-' + _id );

						if ( $placeholder.length ) {
							$placeholder.removeClass( 'tu-' + _id );

							if ( $placeholder.hasClass( 'tve-ult-preload-form' ) ) {
								$placeholder.html( $html );
							} else {
								$placeholder.replaceWith( $html )
							}
						}

						return true;
					}

					var $target = $( '#tve-ult-' + _id );

					if ( $target.length ) {
						$target.html( $html );
					} else {
						$body.append( $html );
					}

				} );

				/**
				 * append resources
				 */
				if ( ! response.resources ) {
					return;
				}

				if ( response.resources.css ) {
					TVE_Ult.add_page_css( response.resources.css );
				}

				if ( response.resources.fonts ) {
					TVE_Ult.add_page_css( response.resources.fonts );
				}

				/**
				 * localize javascript
				 */
				if ( response.resources.localize ) {
					$.each( response.resources.localize, function ( o, d ) {
						if ( typeof window[ o ] === 'undefined' ) {
							window[ o ] = d;
						}
					} );
				}
			} );

			/**
			 * body end
			 */
			if ( r.body_end ) {
				/**
				 * filter the end-of-body contents to remove any (possible) existing wistia embed divs
				 */
				var $body_end = $( r.body_end );
				$body_end.find( '.tve_wistia_popover' ).each( function () {
					if ( $( '#' + this.id ).length ) {
						this.parentNode.removeChild( this );
					}
				} );
				$body.append( $body_end );
			}

			if ( r.resources && r.resources.js ) {
				TVE_Ult.add_page_js( r.resources.js, function () {
					resourcesLoaded = true;
				} );
			}

			if ( r.resources && r.resources.css ) {
				TVE_Ult.add_page_css( r.resources.css );
			}

			/**
			 * rebind the TCB event listeners
			 */
			function dom_ready() {
				if ( ! resourcesLoaded || ! modulesFinishedLoading ) {
					setTimeout( dom_ready, 50 );
					return;
				}
				TCB_Front.onDOMReady();
				TCB_Front.event_triggers( ThriveGlobal.$j( 'body' ) );
				var $all = $( '.tve-ult-design' ).css( 'display', '' );
				setTimeout( function () {
					$all.addClass( 'tvu-triggered' ).closest( '.tve-ult-preload-form' ).removeClass( 'tve-ult-preload-form' );
					setTimeout( function () {
						$.each( on_show_callbacks, function ( i, fn ) {
							fn.call( null, $all );

							/**
							 * For slow connection call the show once again just in case the margin wasnt calculated correctly on render
							 */
							setTimeout( function () {
								fn.call( null, $all );
							}, 5000 );
						} );
					}, 200 );
				}, 200 );

				/* remove empty placeholders */
				$( '[class*="tu-shortcode"]' ).closest( '.thrive_ultimatum_shortcode,.tve-ult-preload-form' ).remove();

				if ( $all.find( '.thrv_responsive_video' ).length ) {
					TCB_Front.changeAutoplayVideo( $all );
				}

				$body.on( 'click', '.tve-ult-bar-close,.tve-ult-bar-close-editable', TVE_Ult.hide_design );

				/** event thrown by TCB */
				$( ".tve-ult-design" ).on( 'tve.countdown-finished', function ( e ) {
					var $design;
					if ( e && e.target ) {
						$design = $( e.target ).parents( '.tve-ult-design' );
					}
					/**
					 * Redirect to expired page
					 */
					if ( $design && $design.length && $design.data( 'campaign_id' ) && TVE_Ult_Data.evergreen_redirects[ $design.data( 'campaign_id' ) ] ) {
						window.location = TVE_Ult_Data.evergreen_redirects[ $design.data( 'campaign_id' ) ];
					}
					TVE_Ult.hide_design( e )

				} );
			}

			setTimeout( dom_ready, 50 );
		}

		var ajax_data = {
			action: TVE_Ult_Data.ajax_load_action,
			campaign_ids: TVE_Ult_Data.campaign_ids,
			matched_display_settings: TVE_Ult_Data.matched_display_settings,
			post_id: TVE_Ult_Data.post_id,
			is_singular: TVE_Ult_Data.is_singular,
			tu_em: TVE_Ult_Data.tu_em,
			shortcode_campaign_ids: TVE_Ult_Data.shortcode_campaign_ids
		};

		//if global unique ajax is ready
		if ( window.TVE_Dash && ! TVE_Dash.ajax_sent ) {
			$( document ).on( 'tve-dash.load', function ( event ) {
				TVE_Dash.add_load_item( 'tu_lazy_load', ajax_data, insert_response );
			} );
		} else {
			//if not just handle it here
			$.ajax( {
				url: TVE_Ult_Data.ajaxurl,
				type: 'post',
				data: $.extend( ajax_data, {hard_ajax: true} )
			} ).done( insert_response );
		}

		/**
		 * Insert optimized assets
		 * @param assets
		 */
		function insertLightspeedAssets( assets ) {
			var hasFlat = function () {
				return $( 'link[href*="thrive_flat.css"]' ).length > 0
			}, modulesToLoad = [];

			if ( assets.css ) {
				if ( assets.css.files ) {
					for ( var file in assets.css.files ) {
						var isFlat = file === 'flat';
						if ( ( ! hasFlat() && isFlat ) || ! isFlat ) {
							$( '<link rel="stylesheet" href="' + assets.css.files[ file ] + '"/>' ).prependTo( 'head' );
						}
					}
				}

				if ( assets.css.inline && assets.css.inline.length ) {
					assets.css.inline.forEach( function ( style ) {
						if ( ! hasFlat() ) {
							$( style ).prependTo( 'head' );
						}
					} )
				}
			}

			if ( assets.js ) {
				for ( var module in assets.js ) {
					if ( TCB_Front && ! TCB_Front.isModuleLoaded( module ) ) {
						modulesToLoad.push( module )
					}
				}
			}

			function loadModule() {
				if ( modulesToLoad.length ) {
					var currentModule = modulesToLoad.shift()
					/* load next module only after the current one is loaded */
					TVE_Ult.add_head_script( assets.js[ currentModule ], 'tu-lightspeed-' + currentModule, loadModule );
				} else {
					modulesFinishedLoading = true
				}
			}

			loadModule()
		}
	} );

	/**
	 * pushes the body contents down with an amount equal to the height of the ribbon
	 */
	TVE_Ult.top_ribbon_show = function ( $all_designs ) {
		var $top_ribbon = $all_designs.filter( '.tvu-header' );
		if ( ! $top_ribbon.length || $top_ribbon.css( '--tve-ult-design-hidden' ) ) {
			return;
		}
		var _height = $top_ribbon.outerHeight( true );
		$body.data( 'tvu-original-margin', $body.css( 'margin-top' ) ).animate( {
			marginTop: '+' + _height + 'px'
		}, 300 );

		var $header = $body.find( '.thrv_header.tve-scroll-sticky' );

		/* Add the height of the ribbon to the header extra offset */
		if ( $header.length ) {
			$header.css( '--tcb-header-extra-offset', _height + 'px' );
		}

		setTimeout( function () {
			/* trigger only after animation finishes */
			$( window ).trigger( 'ultimatum.form.display', {show: true, type: 'ribbon'} )
		}, 301 )

	};

	/**
	 * called when the user clicks the "close" icon on a ribbon
	 *
	 * @param {jQuery.Event} e
	 */
	TVE_Ult.hide_design = function ( e ) {
		var $design, type = 'ribbon';
		if ( e && e.target ) {
			$design = $( e.target ).parents( '.tve-ult-design' );
		} else {
			$design = $( '.tve-ult-design' );
		}
		$design.removeClass( 'tvu-triggered' ).css( '--tve-ult-design-hidden', 1 );
		if ( $design.hasClass( 'tvu-header' ) ) {
			$body.animate( {
				// it fixes a conflict with leads scroll mat
				// marginTop: $body.data( 'tvu-original-margin' )
				marginTop: 0
			}, 300 );
		}
		if ( $design.is( '.tve-ult-widget' ) ) {
			$design.parents( "#" + $design.data( 'widget-id' ) ).slideUp();
			type = 'widget'
		}

		var $header = $body.find( '.thrv_header.tve-scroll-sticky' );
		/* Decrease the header extra offset with the height of the ribbon when the ribbon is closed */
		if ( $header.length ) {
			var extraOffset = ( parseFloat( $header.css( '--tcb-header-extra-offset' ) ) - $design.outerHeight( true ) ) + 'px';

			$header.css( '--tcb-header-extra-offset', extraOffset );
		}

		setTimeout( function () {
			/* trigger only after animation finishes */
			$( window ).trigger( 'ultimatum.form.display', {show: false, type: type} )
		}, 301 )
	};

} )( ThriveGlobal.$j );
