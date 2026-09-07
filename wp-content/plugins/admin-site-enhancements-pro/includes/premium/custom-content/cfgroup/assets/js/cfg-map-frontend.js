/**
 * CFG Map — frontend OpenStreetMap (Leaflet) embeds.
 *
 * Supports late-injected nodes (e.g. Elementor builder preview) via MutationObserver
 * and Elementor frontend hooks.
 */
( function() {
	'use strict';

	var observerStarted = false;
	var elementorHooksBound = false;
	var debounceTimer = null;

	function parseFloatOr( value, fallback ) {
		var n = parseFloat( value );
		return isNaN( n ) ? fallback : n;
	}

	function parseIntOr( value, fallback ) {
		var n = parseInt( value, 10 );
		return isNaN( n ) ? fallback : n;
	}

	function fixLeafletIconPath() {
		if ( typeof L === 'undefined' || ! L.Icon || ! L.Icon.Default ) {
			return;
		}
		L.Icon.Default.imagePath = ( function() {
			var link = document.querySelector( 'link[href*="leaflet.css"]' );
			if ( link && link.href ) {
				return link.href.replace( /leaflet\.css.*$/, 'images/' );
			}
			return '';
		} )();
	}

	/**
	 * Trackpad pinch arrives as wheel + ctrlKey/metaKey (not touchZoom).
	 * Forward to Leaflet's ScrollWheelZoom accumulator so tiny deltas accumulate
	 * past zoomSnap; keep scrollWheelZoom disabled for normal page scroll.
	 *
	 * @param {L.Map} map Leaflet map instance.
	 */
	function enableTrackpadPinchZoom( map ) {
		if ( ! map.scrollWheelZoom || typeof map.scrollWheelZoom._onWheelScroll !== 'function' ) {
			return;
		}

		map.scrollWheelZoom.disable();

		map.getContainer().addEventListener( 'wheel', function( e ) {
			if ( ! e.ctrlKey && ! e.metaKey ) {
				return;
			}
			// Reuses Leaflet 1.9.4 debounce + discrete zoom curve; calls preventDefault.
			map.scrollWheelZoom._onWheelScroll( e );
		}, { passive: false } );
	}

	/**
	 * Invalidate size for a map after layout settles (Elementor editor / flex grids).
	 *
	 * @param {L.Map} map Leaflet map instance.
	 */
	function scheduleInvalidateSize( map ) {
		if ( ! map || typeof map.invalidateSize !== 'function' ) {
			return;
		}
		[ 0, 100, 300 ].forEach( function( delay ) {
			setTimeout( function() {
				try {
					map.invalidateSize();
				} catch ( e ) {
					// Map may have been removed from the DOM.
				}
			}, delay );
		} );
	}

	/**
	 * Invalidate all ready OSM maps inside an optional root element.
	 *
	 * @param {Element|Document} [root] Scope; defaults to document.
	 */
	function invalidateMapsIn( root ) {
		var scope = root && root.querySelectorAll ? root : document;
		var nodes = scope.querySelectorAll( '.asenha-cfgroup-map-osm[data-map-ready="1"]' );
		for ( var i = 0; i < nodes.length; i++ ) {
			if ( nodes[ i ]._asenhaLeafletMap ) {
				scheduleInvalidateSize( nodes[ i ]._asenhaLeafletMap );
			}
		}
	}

	function initMap( el ) {
		if ( typeof L === 'undefined' || ! el || el.getAttribute( 'data-map-ready' ) === '1' ) {
			return;
		}

		var lat = parseFloatOr( el.getAttribute( 'data-latitude' ), NaN );
		var lng = parseFloatOr( el.getAttribute( 'data-longitude' ), NaN );
		var zoom = parseIntOr( el.getAttribute( 'data-zoom' ), 14 );

		if ( isNaN( lat ) || isNaN( lng ) ) {
			return;
		}

		zoom = Math.max( 1, Math.min( 21, zoom ) );

		var map = L.map( el, {
			scrollWheelZoom: false,
			touchZoom: true,
			dragging: true,
			doubleClickZoom: true
		} ).setView( [ lat, lng ], zoom );

		var container = map.getContainer();
		container.style.touchAction = 'none';
		container.style.msTouchAction = 'none';

		if ( map.touchZoom ) {
			map.touchZoom.enable();
		}
		if ( map.dragging ) {
			map.dragging.enable();
		}

		enableTrackpadPinchZoom( map );

		L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			maxZoom: 19
		} ).addTo( map );

		L.marker( [ lat, lng ] ).addTo( map );

		el._asenhaLeafletMap = map;
		el.setAttribute( 'data-map-ready', '1' );

		scheduleInvalidateSize( map );
	}

	function initAll() {
		if ( typeof L === 'undefined' ) {
			return;
		}
		fixLeafletIconPath();
		var nodes = document.querySelectorAll( '.asenha-cfgroup-map-osm:not([data-map-ready="1"])' );
		for ( var i = 0; i < nodes.length; i++ ) {
			initMap( nodes[ i ] );
		}
	}

	function scheduleInitAll() {
		if ( debounceTimer ) {
			clearTimeout( debounceTimer );
		}
		debounceTimer = setTimeout( function() {
			debounceTimer = null;
			initAll();
		}, 75 );
	}

	function mutationHasOsmNode( mutations ) {
		for ( var i = 0; i < mutations.length; i++ ) {
			var added = mutations[ i ].addedNodes;
			if ( ! added || ! added.length ) {
				continue;
			}
			for ( var j = 0; j < added.length; j++ ) {
				var node = added[ j ];
				if ( node.nodeType !== 1 ) {
					continue;
				}
				if ( node.classList && node.classList.contains( 'asenha-cfgroup-map-osm' ) ) {
					return true;
				}
				if ( node.querySelector && node.querySelector( '.asenha-cfgroup-map-osm' ) ) {
					return true;
				}
			}
		}
		return false;
	}

	function startMutationObserver() {
		if ( observerStarted || typeof MutationObserver === 'undefined' || ! document.body ) {
			return;
		}
		observerStarted = true;

		var observer = new MutationObserver( function( mutations ) {
			if ( mutationHasOsmNode( mutations ) ) {
				scheduleInitAll();
			}
		} );

		observer.observe( document.body, {
			childList: true,
			subtree: true
		} );
	}

	function onElementorElementReady( $element ) {
		initAll();
		var el = ( $element && $element.length ) ? $element[ 0 ] : null;
		if ( el ) {
			invalidateMapsIn( el );
		} else {
			invalidateMapsIn( document );
		}
	}

	function bindElementorHooks() {
		if ( elementorHooksBound ) {
			return;
		}
		if ( typeof window.elementorFrontend === 'undefined' || ! window.elementorFrontend.hooks ) {
			return;
		}
		elementorHooksBound = true;

		window.elementorFrontend.hooks.addAction( 'frontend/element_ready/global', onElementorElementReady );
		window.elementorFrontend.hooks.addAction( 'frontend/element_ready/ase-map.default', onElementorElementReady );

		if ( window.elementorFrontend.on ) {
			window.elementorFrontend.on( 'components:init', function() {
				initAll();
				invalidateMapsIn( document );
			} );
		}
	}

	function tryBindElementorHooks() {
		bindElementorHooks();
		if ( ! elementorHooksBound ) {
			// Preview iframe may load elementorFrontend after this script.
			var attempts = 0;
			var timer = setInterval( function() {
				attempts += 1;
				bindElementorHooks();
				if ( elementorHooksBound || attempts > 40 ) {
					clearInterval( timer );
				}
			}, 250 );
		}
	}

	function boot() {
		initAll();
		startMutationObserver();
		tryBindElementorHooks();
	}

	window.asenhaCfgMapOsm = {
		initAll: initAll,
		initMap: initMap,
		invalidateMapsIn: invalidateMapsIn
	};

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', boot );
	} else {
		boot();
	}
} )();
