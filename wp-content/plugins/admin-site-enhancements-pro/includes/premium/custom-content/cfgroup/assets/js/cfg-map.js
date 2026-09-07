/**
 * CFG Map field — OpenStreetMap (Leaflet) and Google Maps.
 *
 * Expects window.asenhaCfgMap from wp_localize_script.
 */
( function( $ ) {
	'use strict';

	var cfg = window.asenhaCfgMap || {};
	var instances = [];

	function getConfig() {
		return window.asenhaCfgMap || cfg;
	}

	function whenGoogleReady( callback ) {
		if ( typeof google !== 'undefined' && google.maps && google.maps.Map ) {
			callback();
			return;
		}

		var attempts = 0;
		var timer = setInterval( function() {
			attempts += 1;
			if ( typeof google !== 'undefined' && google.maps && google.maps.Map ) {
				clearInterval( timer );
				callback();
			} else if ( attempts > 50 ) {
				clearInterval( timer );
			}
		}, 100 );
	}

	function parseFloatOr( value, fallback ) {
		var n = parseFloat( value );
		return isNaN( n ) ? fallback : n;
	}

	function parseIntOr( value, fallback ) {
		var n = parseInt( value, 10 );
		return isNaN( n ) ? fallback : n;
	}

	function readInputs( $wrap ) {
		return {
			address: $wrap.find( '.cfgroup-map-address' ).val() || '',
			latitude: $wrap.find( '.cfgroup-map-latitude' ).val() || '',
			longitude: $wrap.find( '.cfgroup-map-longitude' ).val() || '',
			zoom: $wrap.find( '.cfgroup-map-zoom' ).val() || ''
		};
	}

	function writeInputs( $wrap, data ) {
		if ( typeof data.address !== 'undefined' ) {
			$wrap.find( '.cfgroup-map-address' ).val( data.address );
			// Places API (New): visible search is PlaceAutocompleteElement; keep it in sync.
			var pac = $wrap.find( '.cfgroup-map-place-autocomplete, gmp-place-autocomplete' ).get( 0 );
			if ( pac ) {
				pac.value = data.address;
			}
		}
		if ( typeof data.latitude !== 'undefined' ) {
			$wrap.find( '.cfgroup-map-latitude' ).val( data.latitude );
		}
		if ( typeof data.longitude !== 'undefined' ) {
			$wrap.find( '.cfgroup-map-longitude' ).val( data.longitude );
		}
		if ( typeof data.zoom !== 'undefined' ) {
			$wrap.find( '.cfgroup-map-zoom' ).val( data.zoom );
		}

		var metaKeys = [ 'place_name', 'street_number', 'street_name', 'city_block', 'sublocality', 'city', 'state', 'post_code', 'country' ];
		metaKeys.forEach( function( key ) {
			if ( typeof data[ key ] === 'undefined' ) {
				return;
			}
			var $meta = $wrap.find( '.cfgroup-map-meta[data-meta-key="' + key + '"]' );
			if ( $meta.length ) {
				$meta.val( data[ key ] || '' );
			}
		} );

		if ( typeof data.place_name !== 'undefined' ) {
			syncPlaceNameCue( $wrap );
		}
	}

	/**
	 * Show or hide "Place name: …" beside the field label (Google Maps only).
	 *
	 * Reads the hidden place_name meta (live writes and saved raw value on load).
	 *
	 * @param {jQuery} $wrap Map wrap.
	 */
	function syncPlaceNameCue( $wrap ) {
		if ( ! $wrap || ! $wrap.length ) {
			return;
		}
		if ( ( $wrap.data( 'map-provider' ) || '' ) !== 'google_maps' ) {
			return;
		}

		var placeName = ( $wrap.find( '.cfgroup-map-meta[data-meta-key="place_name"]' ).val() || '' ).toString().trim();
		var $label = $wrap.closest( '.field' ).children( 'label.field-label' ).first();
		if ( ! $label.length ) {
			return;
		}

		var $cue = $label.children( '.cfgroup-map-place-name-cue' );
		if ( ! $cue.length ) {
			$cue = $( '<span class="cfgroup-map-place-name-cue" hidden></span>' );
			$label.append( $cue );
		}

		if ( placeName ) {
			var prefix = ( getConfig().i18n && getConfig().i18n.placeNamePrefix ) || 'Place name:';
			$cue.text( prefix + ' ' + placeName ).prop( 'hidden', false );
		} else {
			$cue.text( '' ).prop( 'hidden', true );
		}
	}

	/**
	 * Join unique non-empty address part labels.
	 *
	 * @param {Array} parts Candidate labels.
	 * @return {string}
	 */
	function joinUniqueAddressParts( parts ) {
		var seen = {};
		var out = [];
		( parts || [] ).forEach( function( part ) {
			var label = ( part || '' ).toString().trim();
			if ( ! label ) {
				return;
			}
			var key = label.toLowerCase();
			if ( seen[ key ] ) {
				return;
			}
			seen[ key ] = true;
			out.push( label );
		} );
		return out.join( ', ' );
	}

	/**
	 * Recover a missing state label from a formatted address string.
	 *
	 * Walks comma-separated segments from the end, skipping country/post_code
	 * and any label already present in knownParts.
	 *
	 * @param {string} formattedAddress Full address string.
	 * @param {Object} knownParts       Already-mapped address parts.
	 * @return {string}
	 */
	function extractStateFromFormattedAddress( formattedAddress, knownParts ) {
		var address = ( formattedAddress || '' ).toString().trim();
		if ( ! address ) {
			return '';
		}

		knownParts = knownParts || {};
		var accounted = {};

		function account( value ) {
			var label = ( value || '' ).toString().trim();
			if ( ! label ) {
				return;
			}
			accounted[ label.toLowerCase() ] = true;
			// Sublocality may be a joined list ("A, B").
			label.split( ',' ).forEach( function( part ) {
				var piece = part.trim();
				if ( piece ) {
					accounted[ piece.toLowerCase() ] = true;
				}
			} );
		}

		[ 'place_name', 'street_number', 'street_name', 'city_block', 'sublocality', 'city', 'post_code', 'country' ].forEach( function( key ) {
			account( knownParts[ key ] );
		} );

		var country = ( knownParts.country || '' ).toString().trim();
		var postCode = ( knownParts.post_code || '' ).toString().trim();
		var segments = address.split( ',' ).map( function( s ) {
			return s.trim();
		} );

		for ( var i = segments.length - 1; i >= 0; i-- ) {
			var segment = segments[ i ];
			if ( ! segment ) {
				continue;
			}
			if ( country && segment.toLowerCase() === country.toLowerCase() ) {
				continue;
			}
			if ( postCode && segment.toLowerCase() === postCode.toLowerCase() ) {
				continue;
			}
			if ( accounted[ segment.toLowerCase() ] ) {
				continue;
			}
			return segment;
		}

		return '';
	}

	/**
	 * Map Google address components into CFG map value keys.
	 *
	 * @param {Array} components Normalized components.
	 * @return {Object}
	 */
	function extractGoogleAddressParts( components ) {
		var data = {
			street_number: '',
			street_name: '',
			sublocality: '',
			city: '',
			state: '',
			post_code: '',
			country: ''
		};
		var neighbourhoodParts = [];
		var cityFallbacks = [];
		var usedAsCity = '';
		var streetNumber = '';
		var subpremise = '';
		var floor = '';
		var room = '';

		normalizeGoogleAddressComponents( components ).forEach( function( c ) {
			var types = c.types || [];
			var longName = c.long_name || '';

			if ( types.indexOf( 'street_number' ) !== -1 ) {
				streetNumber = longName;
			}
			if ( types.indexOf( 'subpremise' ) !== -1 ) {
				subpremise = longName;
			}
			if ( types.indexOf( 'floor' ) !== -1 ) {
				floor = longName;
			}
			if ( types.indexOf( 'room' ) !== -1 ) {
				room = longName;
			}
			if ( types.indexOf( 'route' ) !== -1 ) {
				data.street_name = longName;
			}
			if ( types.indexOf( 'locality' ) !== -1 ) {
				data.city = longName;
			}
			if ( types.indexOf( 'postal_town' ) !== -1 ) {
				cityFallbacks.push( longName );
			}
			if ( types.indexOf( 'administrative_area_level_2' ) !== -1 ) {
				cityFallbacks.push( longName );
			}
			if ( types.indexOf( 'administrative_area_level_1' ) !== -1 ) {
				data.state = longName;
			}
			if ( types.indexOf( 'postal_code' ) !== -1 ) {
				data.post_code = longName;
			}
			if ( types.indexOf( 'country' ) !== -1 ) {
				data.country = longName;
			}
			if ( types.indexOf( 'neighborhood' ) !== -1 ) {
				neighbourhoodParts.push( longName );
			}
			if ( types.indexOf( 'sublocality_level_1' ) !== -1 ||
				types.indexOf( 'sublocality_level_2' ) !== -1 ||
				types.indexOf( 'sublocality_level_3' ) !== -1 ) {
				neighbourhoodParts.push( longName );
			}
			if ( types.indexOf( 'sublocality' ) !== -1 ) {
				cityFallbacks.push( longName );
				neighbourhoodParts.push( longName );
			}
			// Indonesian kelurahan / kecamatan often use admin levels 4 and 3.
			if ( types.indexOf( 'administrative_area_level_4' ) !== -1 ||
				types.indexOf( 'administrative_area_level_3' ) !== -1 ) {
				neighbourhoodParts.push( longName );
			}
		} );

		data.street_number = [ streetNumber, subpremise, floor, room ].filter( function( part ) {
			return !!( part || '' ).toString().trim();
		} ).join( ' ' );

		if ( ! data.city ) {
			for ( var i = 0; i < cityFallbacks.length; i++ ) {
				if ( cityFallbacks[ i ] ) {
					data.city = cityFallbacks[ i ];
					usedAsCity = cityFallbacks[ i ];
					break;
				}
			}
		}

		neighbourhoodParts = neighbourhoodParts.filter( function( part ) {
			if ( ! part ) {
				return false;
			}
			var lower = part.toLowerCase();
			if ( usedAsCity && lower === usedAsCity.toLowerCase() ) {
				return false;
			}
			if ( data.city && lower === data.city.toLowerCase() ) {
				return false;
			}
			if ( data.state && lower === data.state.toLowerCase() ) {
				return false;
			}
			return true;
		} );

		data.sublocality = joinUniqueAddressParts( neighbourhoodParts );
		return data;
	}

	function nominatimRequest( params ) {
		var conf = getConfig();
		params = params || {};
		params.action = conf.geocodeAction || 'asenha_cfgroup_map_geocode';
		params.nonce = conf.geocodeNonce || '';

		return $.ajax( {
			url: conf.ajaxUrl || ( window.ajaxurl || '' ),
			method: 'GET',
			dataType: 'json',
			data: params
		} );
	}

	/**
	 * Primary label for an OSM suggestion row.
	 *
	 * @param {Object} result Normalized Nominatim result.
	 * @return {string}
	 */
	function suggestionPrimaryLabel( result ) {
		if ( result && result.place_name ) {
			return String( result.place_name );
		}
		if ( result && result.address ) {
			var parts = String( result.address ).split( ',' );
			return parts[0] ? parts[0].trim() : String( result.address );
		}
		return '';
	}

	function initLeaflet( $wrap ) {
		if ( typeof L === 'undefined' ) {
			return null;
		}

		var $canvas = $wrap.find( '.cfgroup-map-canvas' );
		if ( ! $canvas.length || $wrap.data( 'map-instance' ) ) {
			return $wrap.data( 'map-instance' ) || null;
		}

		if ( L.Icon && L.Icon.Default ) {
			L.Icon.Default.imagePath = ( function() {
				var link = document.querySelector( 'link[href*="leaflet.css"]' );
				if ( link && link.href ) {
					return link.href.replace( /leaflet\.css.*$/, 'images/' );
				}
				return '';
			} )();
		}

		var vals = readInputs( $wrap );
		var centerLat = parseFloatOr( vals.latitude, parseFloatOr( $wrap.data( 'center-lat' ), -37.81411 ) );
		var centerLng = parseFloatOr( vals.longitude, parseFloatOr( $wrap.data( 'center-lng' ), 144.96328 ) );
		var zoom = parseIntOr( vals.zoom, parseIntOr( $wrap.data( 'zoom' ), 14 ) );
		var hasMarker = '' !== vals.latitude && '' !== vals.longitude;

		var canvasEl = $canvas.get( 0 );
		// Allow remount after incomplete teardown (e.g. QE destroy without canvas reset).
		if ( canvasEl && canvasEl._leaflet_id ) {
			delete canvasEl._leaflet_id;
			$canvas.empty().removeClass( function( i, cls ) {
				return ( cls.match( /(^|\s)leaflet-\S+/g ) || [] ).join( ' ' );
			} );
		}

		var map = L.map( canvasEl, {
			scrollWheelZoom: false
		} ).setView( [ centerLat, centerLng ], zoom );

		L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			maxZoom: 19
		} ).addTo( map );

		var marker = null;
		if ( hasMarker ) {
			marker = L.marker( [ centerLat, centerLng ], { draggable: true } ).addTo( map );
		}

		/**
		 * Whether a Leaflet map still has panes (false after map.remove()).
		 *
		 * @param {Object} leafletMap Map instance.
		 * @return {boolean}
		 */
		function isLiveLeafletMap( leafletMap ) {
			return !!(
				leafletMap
				&& typeof leafletMap.getPane === 'function'
				&& leafletMap.getPane( 'markerPane' )
			);
		}

		/**
		 * Resolve the live map/marker for this wrap (avoids stale destroy closures).
		 *
		 * @return {{map:Object,marker:*}|null}
		 */
		function getLiveLeafletState() {
			var live = $wrap.data( 'map-instance' );
			if ( live && live.map && isLiveLeafletMap( live.map ) ) {
				if ( live.map !== map ) {
					map = live.map;
				}
				if ( typeof live.marker !== 'undefined' ) {
					marker = live.marker;
				}
				return { map: live.map, marker: live.marker };
			}
			if ( isLiveLeafletMap( map ) ) {
				return { map: map, marker: marker };
			}
			return null;
		}

		function setMarker( lat, lng, syncZoom ) {
			var state = getLiveLeafletState();
			if ( ! state ) {
				return;
			}
			map = state.map;
			marker = state.marker || null;

			var latLng = L.latLng( lat, lng );
			if ( ! marker ) {
				marker = L.marker( latLng, { draggable: true } ).addTo( map );
				marker.on( 'dragend', onMarkerDrag );
			} else if ( ! map.hasLayer( marker ) ) {
				marker.addTo( map );
				marker.setLatLng( latLng );
			} else {
				marker.setLatLng( latLng );
			}

			var liveInst = $wrap.data( 'map-instance' );
			if ( liveInst ) {
				liveInst.marker = marker;
				liveInst.map = map;
			}

			map.setView( latLng, syncZoom ? map.getZoom() : map.getZoom() );
			writeInputs( $wrap, {
				latitude: String( lat ),
				longitude: String( lng ),
				zoom: String( map.getZoom() )
			} );
		}

		function onMarkerDrag( e ) {
			var state = getLiveLeafletState();
			var activeMap = state ? state.map : map;
			var pos = e.target.getLatLng();
			writeInputs( $wrap, {
				latitude: String( pos.lat ),
				longitude: String( pos.lng ),
				zoom: String( activeMap && activeMap.getZoom ? activeMap.getZoom() : '' )
			} );
			nominatimRequest( {
				mode: 'reverse',
				lat: pos.lat,
				lng: pos.lng
			} ).done( function( resp ) {
				if ( resp && resp.success && resp.data && resp.data.results && resp.data.results[0] ) {
					var r = resp.data.results[0];
					writeInputs( $wrap, r );
				}
			} );
		}

		if ( marker ) {
			marker.on( 'dragend', onMarkerDrag );
		}

		map.on( 'click', function( e ) {
			hideSuggestions();
			setMarker( e.latlng.lat, e.latlng.lng, true );
			nominatimRequest( {
				mode: 'reverse',
				lat: e.latlng.lat,
				lng: e.latlng.lng
			} ).done( function( resp ) {
				if ( resp && resp.success && resp.data && resp.data.results && resp.data.results[0] ) {
					writeInputs( $wrap, resp.data.results[0] );
				}
			} );
		} );

		map.on( 'zoomend', function() {
			var state = getLiveLeafletState();
			if ( ! state ) {
				return;
			}
			writeInputs( $wrap, { zoom: String( state.map.getZoom() ) } );
		} );

		// --- OSM address typeahead ---
		var SEARCH_MIN_CHARS = 3;
		var SEARCH_DEBOUNCE_MS = 350;
		var i18n = ( getConfig().i18n ) || {};
		var searchTimer = null;
		var searchXhr = null;
		var suggestions = [];
		var activeIndex = -1;
		var $search = $wrap.find( '.cfgroup-map-search' );
		var $address = $wrap.find( '.cfgroup-map-address' );

		if ( ! $search.find( '.cfgroup-map-suggestions' ).length ) {
			$search.append(
				'<div class="cfgroup-map-search-status" hidden></div>' +
				'<ul class="cfgroup-map-suggestions" role="listbox" hidden></ul>'
			);
		}

		var $status = $search.find( '.cfgroup-map-search-status' );
		var $list = $search.find( '.cfgroup-map-suggestions' );

		function setLoading( isLoading ) {
			$wrap.toggleClass( 'is-searching', !! isLoading );
			if ( isLoading ) {
				$status.text( i18n.searching || 'Searching…' ).prop( 'hidden', false );
			} else {
				$status.text( '' ).prop( 'hidden', true );
			}
		}

		function hideSuggestions() {
			suggestions = [];
			activeIndex = -1;
			$list.empty().prop( 'hidden', true );
			setLoading( false );
		}

		function highlightSuggestion( index ) {
			var $items = $list.find( '.cfgroup-map-suggestion' );
			if ( ! $items.length ) {
				activeIndex = -1;
				return;
			}
			if ( index < 0 ) {
				index = $items.length - 1;
			} else if ( index >= $items.length ) {
				index = 0;
			}
			activeIndex = index;
			$items.removeClass( 'is-active' ).attr( 'aria-selected', 'false' );
			$items.eq( activeIndex ).addClass( 'is-active' ).attr( 'aria-selected', 'true' );
		}

		function selectSuggestion( result ) {
			if ( ! result ) {
				return;
			}
			var lat = parseFloat( result.latitude );
			var lng = parseFloat( result.longitude );
			if ( isNaN( lat ) || isNaN( lng ) ) {
				return;
			}
			setMarker( lat, lng, true );
			writeInputs( $wrap, result );
			hideSuggestions();
		}

		function renderSuggestions( results ) {
			suggestions = Array.isArray( results ) ? results : [];
			activeIndex = -1;
			$list.empty();

			if ( ! suggestions.length ) {
				$list.append(
					$( '<li class="cfgroup-map-suggestion cfgroup-map-suggestion--empty" />' )
						.text( i18n.noResults || 'No places found' )
				);
				$list.prop( 'hidden', false );
				return;
			}

			suggestions.forEach( function( result, index ) {
				var title = suggestionPrimaryLabel( result );
				var address = result.address ? String( result.address ) : '';
				var $item = $( '<li class="cfgroup-map-suggestion" role="option" />' )
					.attr( 'data-index', String( index ) )
					.attr( 'aria-selected', 'false' );

				$item.append(
					$( '<span class="cfgroup-map-suggestion-title" />' ).text( title || address )
				);
				if ( address && address !== title ) {
					$item.append(
						$( '<span class="cfgroup-map-suggestion-address" />' ).text( address )
					);
				}

				$list.append( $item );
			} );

			$list.prop( 'hidden', false );
			highlightSuggestion( 0 );
		}

		function runSearch( query ) {
			query = ( query || '' ).trim();
			writeInputs( $wrap, { address: query } );

			if ( query.length < SEARCH_MIN_CHARS ) {
				if ( searchXhr && searchXhr.abort ) {
					searchXhr.abort();
					searchXhr = null;
				}
				hideSuggestions();
				return;
			}

			if ( searchXhr && searchXhr.abort ) {
				searchXhr.abort();
			}

			setLoading( true );
			$list.prop( 'hidden', true ).empty();

			var request = nominatimRequest( { mode: 'search', q: query } );
			searchXhr = request;
			request.done( function( resp ) {
				if ( searchXhr !== request ) {
					return;
				}
				setLoading( false );
				if ( resp && resp.success && resp.data && Array.isArray( resp.data.results ) ) {
					renderSuggestions( resp.data.results );
				} else {
					renderSuggestions( [] );
				}
			} ).fail( function( xhr, status ) {
				if ( searchXhr !== request ) {
					return;
				}
				setLoading( false );
				if ( 'abort' !== status ) {
					renderSuggestions( [] );
				}
			} ).always( function() {
				if ( searchXhr === request ) {
					searchXhr = null;
				}
			} );
		}

		$list.off( 'mousedown' ).off( '.cfgroupMapOsm' ).on( 'mousedown.cfgroupMapOsm', '.cfgroup-map-suggestion:not(.cfgroup-map-suggestion--empty)', function( e ) {
			e.preventDefault();
			var index = parseInt( $( this ).attr( 'data-index' ), 10 );
			if ( ! isNaN( index ) && suggestions[ index ] ) {
				selectSuggestion( suggestions[ index ] );
			}
		} );

		$address.off( 'input keydown blur' ).off( '.cfgroupMapOsm' ).on( 'input.cfgroupMapOsm', function() {
			var q = $( this ).val();
			clearTimeout( searchTimer );
			searchTimer = setTimeout( function() {
				runSearch( q );
			}, SEARCH_DEBOUNCE_MS );
		} );

		$address.on( 'keydown.cfgroupMapOsm', function( e ) {
			var key = e.key;
			var listOpen = ! $list.prop( 'hidden' ) && suggestions.length > 0;

			if ( 'ArrowDown' === key ) {
				if ( listOpen ) {
					e.preventDefault();
					highlightSuggestion( activeIndex + 1 );
				}
				return;
			}

			if ( 'ArrowUp' === key ) {
				if ( listOpen ) {
					e.preventDefault();
					highlightSuggestion( activeIndex - 1 );
				}
				return;
			}

			if ( 'Escape' === key ) {
				if ( ! $list.prop( 'hidden' ) || $wrap.hasClass( 'is-searching' ) ) {
					e.preventDefault();
					if ( searchXhr && searchXhr.abort ) {
						searchXhr.abort();
						searchXhr = null;
					}
					hideSuggestions();
				}
				return;
			}

			if ( 'Enter' === key ) {
				e.preventDefault();
				clearTimeout( searchTimer );

				if ( listOpen && activeIndex >= 0 && suggestions[ activeIndex ] ) {
					selectSuggestion( suggestions[ activeIndex ] );
					return;
				}

				runSearch( $( this ).val() );
			}
		} );

		$address.on( 'blur.cfgroupMapOsm', function() {
			setTimeout( function() {
				hideSuggestions();
			}, 150 );
		} );

		function onDocMouseDown( e ) {
			if ( ! $wrap.has( e.target ).length && ! $wrap.is( e.target ) ) {
				hideSuggestions();
			}
		}
		var docNs = 'mousedown.cfgroupMapOsmSearch.' + ( $wrap.attr( 'id' ) || String( Date.now() ) );
		$( document ).off( docNs ).on( docNs, onDocMouseDown );

		// Ensure correct size when shown in tabs / QE / BE.
		setTimeout( function() {
			if ( isLiveLeafletMap( map ) ) {
				map.invalidateSize();
			}
		}, 100 );

		var instance = {
			provider: 'openstreetmap',
			$wrap: $wrap,
			map: map,
			marker: marker,
			setMarker: setMarker,
			invalidate: function() {
				if ( isLiveLeafletMap( map ) ) {
					map.invalidateSize();
				}
			},
			destroy: function() {
				clearTimeout( searchTimer );
				if ( searchXhr && searchXhr.abort ) {
					searchXhr.abort();
					searchXhr = null;
				}
				$address.off( 'input keydown blur' ).off( '.cfgroupMapOsm' );
				$list.off( 'mousedown' ).off( '.cfgroupMapOsm' );
				$( document ).off( docNs );
				hideSuggestions();
				if ( map && typeof map.remove === 'function' ) {
					try {
						map.remove();
					} catch ( err ) {
						// Map may already be torn down.
					}
				}
				// Strip leftover Leaflet state so QE re-init can mount cleanly.
				var canvasEl = $canvas.get( 0 );
				if ( canvasEl ) {
					if ( canvasEl._leaflet_id ) {
						delete canvasEl._leaflet_id;
					}
					$canvas.empty().removeClass( function( i, cls ) {
						return ( cls.match( /(^|\s)leaflet-\S+/g ) || [] ).join( ' ' );
					} );
				}
				var idx = instances.indexOf( instance );
				if ( idx > -1 ) {
					instances.splice( idx, 1 );
				}
				$wrap.removeData( 'map-instance' );
				map = null;
				marker = null;
			}
		};

		$wrap.data( 'map-instance', instance );
		instances.push( instance );
		return instance;
	}

	/**
	 * Normalize Places address components from legacy or New API shapes.
	 *
	 * @param {Array} components Raw components.
	 * @return {Array} Components with long_name / types.
	 */
	function normalizeGoogleAddressComponents( components ) {
		return ( components || [] ).map( function( c ) {
			return {
				long_name: c.long_name || c.longText || '',
				short_name: c.short_name || c.shortText || '',
				types: c.types || []
			};
		} );
	}

	/**
	 * Read lat/lng from a Google LatLng or LatLngLiteral.
	 *
	 * @param {Object} loc Location object.
	 * @return {{lat:number,lng:number}|null}
	 */
	function readLatLng( loc ) {
		if ( ! loc ) {
			return null;
		}
		var lat = typeof loc.lat === 'function' ? loc.lat() : loc.lat;
		var lng = typeof loc.lng === 'function' ? loc.lng() : loc.lng;
		if ( typeof lat !== 'number' || typeof lng !== 'number' || isNaN( lat ) || isNaN( lng ) ) {
			return null;
		}
		return { lat: lat, lng: lng };
	}

	/**
	 * Legacy Places Autocomplete on the existing text input.
	 *
	 * @param {jQuery}   $wrap Wrap.
	 * @param {Object}   map   Google Map.
	 * @param {Function} onPlaceSelected Place selection handler.
	 * @return {{widget:*,onSelect:*,autocomplete:*}}
	 */
	function initGoogleLegacyAutocomplete( $wrap, map, onPlaceSelected ) {
		var cleanup = { widget: null, onSelect: null, autocomplete: null };
		var $address = $wrap.find( '.cfgroup-map-address' );

		if ( ! google.maps.places || typeof google.maps.places.Autocomplete !== 'function' || ! $address.length ) {
			return cleanup;
		}

		try {
			var autocomplete = new google.maps.places.Autocomplete( $address.get( 0 ), {
				fields: [ 'formatted_address', 'geometry', 'address_components', 'name' ]
			} );
			autocomplete.bindTo( 'bounds', map );
			autocomplete.addListener( 'place_changed', function() {
				var place = autocomplete.getPlace();
				if ( ! place || ! place.geometry || ! place.geometry.location ) {
					return;
				}
				var loc = place.geometry.location;
				onPlaceSelected(
					place,
					loc.lat(),
					loc.lng(),
					place.geometry.viewport || null
				);
			} );
			cleanup.autocomplete = autocomplete;
		} catch ( err ) {
			// Leave plain text input when legacy Places is unavailable.
		}

		return cleanup;
	}

	/**
	 * Remove Places autocomplete widgets and restore the native address input.
	 *
	 * @param {jQuery} $wrap Map wrap.
	 */
	function resetGoogleAddressSearchUi( $wrap ) {
		if ( ! $wrap || ! $wrap.length ) {
			return;
		}
		$wrap.find( '.cfgroup-map-search .cfgroup-map-place-autocomplete, .cfgroup-map-search gmp-place-autocomplete' ).remove();
		$wrap.find( '.cfgroup-map-address' ).removeClass( 'cfgroup-map-address--hidden' ).removeAttr( 'aria-hidden' );
	}

	/**
	 * Address search: Places API (New) first, legacy Autocomplete fallback.
	 *
	 * @param {jQuery}   $wrap Wrap.
	 * @param {Object}   map   Google Map.
	 * @param {Function} onPlaceSelected Place selection handler.
	 * @return {Promise<{widget:*,onSelect:*,autocomplete:*}>}
	 */
	function initGoogleAddressSearch( $wrap, map, onPlaceSelected ) {
		var $search = $wrap.find( '.cfgroup-map-search' );
		var $address = $wrap.find( '.cfgroup-map-address' );
		var conf = getConfig();
		var placeholder = ( conf.i18n && conf.i18n.searchPlaceholder ) || 'Search for address…';
		var existingAddress = $address.val() || '';

		function useLegacy() {
			resetGoogleAddressSearchUi( $wrap );
			return initGoogleLegacyAutocomplete( $wrap, map, onPlaceSelected );
		}

		function applyNewPlace( place ) {
			var coords = readLatLng( place.location );
			if ( ! coords ) {
				return;
			}
			var displayName = '';
			if ( place.displayName ) {
				displayName = ( typeof place.displayName === 'string' )
					? place.displayName
					: ( place.displayName.text || '' );
			}
			onPlaceSelected(
				{
					formatted_address: place.formattedAddress || '',
					address_components: normalizeGoogleAddressComponents( place.addressComponents ),
					name: displayName
				},
				coords.lat,
				coords.lng,
				place.viewport || null
			);
		}

		if ( typeof google.maps.importLibrary !== 'function' ) {
			return Promise.resolve( useLegacy() );
		}

		return google.maps.importLibrary( 'places' ).then( function( placesLib ) {
			var PlaceAutocompleteElement = ( placesLib && placesLib.PlaceAutocompleteElement ) ||
				( google.maps.places && google.maps.places.PlaceAutocompleteElement );

			if ( typeof PlaceAutocompleteElement !== 'function' || ! $search.length ) {
				return useLegacy();
			}

			var cleanup = { widget: null, onSelect: null, autocomplete: null };

			try {
				// Avoid stacking widgets when QE/BE re-inits before destroy finished.
				$search.find( '.cfgroup-map-place-autocomplete, gmp-place-autocomplete' ).remove();

				var placeAutocomplete = new PlaceAutocompleteElement();
				placeAutocomplete.placeholder = placeholder;
				placeAutocomplete.classList.add( 'cfgroup-map-place-autocomplete' );

				if ( existingAddress ) {
					placeAutocomplete.value = existingAddress;
				}

				$address.addClass( 'cfgroup-map-address--hidden' ).attr( 'aria-hidden', 'true' );
				$search.get( 0 ).insertBefore( placeAutocomplete, $address.get( 0 ) );

				var onSelect = function( event ) {
					var placePrediction = event.placePrediction;
					if ( ! placePrediction || typeof placePrediction.toPlace !== 'function' ) {
						return;
					}
					var place = placePrediction.toPlace();
					place.fetchFields( {
						fields: [ 'formattedAddress', 'location', 'addressComponents', 'viewport', 'displayName' ]
					} ).then( function() {
						applyNewPlace( place );
					} ).catch( function() {
						// Selection without details — leave map as-is.
					} );
				};

				placeAutocomplete.addEventListener( 'gmp-select', onSelect );
				cleanup.widget = placeAutocomplete;
				cleanup.onSelect = onSelect;

				// Bias predictions toward the current map viewport when practical.
				try {
					var bounds = map.getBounds();
					if ( bounds ) {
						placeAutocomplete.locationBias = bounds;
					}
					map.addListener( 'bounds_changed', function() {
						var b = map.getBounds();
						if ( b && cleanup.widget ) {
							cleanup.widget.locationBias = b;
						}
					} );
				} catch ( biasErr ) {
					// Optional bias — ignore if unsupported.
				}

				return cleanup;
			} catch ( err ) {
				return useLegacy();
			}
		} ).catch( function() {
			return useLegacy();
		} );
	}

	/**
	 * Tear down Places autocomplete UI for a map wrap.
	 *
	 * @param {Object} cleanup Cleanup refs from initGoogleAddressSearch.
	 * @param {jQuery} $wrap   Map wrap (strips leftovers + restores address input).
	 */
	function destroyGoogleAddressSearch( cleanup, $wrap ) {
		if ( cleanup ) {
			if ( cleanup.widget && cleanup.onSelect ) {
				cleanup.widget.removeEventListener( 'gmp-select', cleanup.onSelect );
			}
			if ( cleanup.widget && cleanup.widget.parentNode ) {
				cleanup.widget.parentNode.removeChild( cleanup.widget );
			}
		}
		resetGoogleAddressSearchUi( $wrap );
	}

	function initGoogle( $wrap ) {
		if ( typeof google === 'undefined' || ! google.maps ) {
			return null;
		}

		var conf = getConfig();
		if ( ! conf.googleApiKey ) {
			return null;
		}

		var $canvas = $wrap.find( '.cfgroup-map-canvas' );
		if ( ! $canvas.length || $wrap.data( 'map-instance' ) ) {
			return $wrap.data( 'map-instance' ) || null;
		}

		var vals = readInputs( $wrap );
		var centerLat = parseFloatOr( vals.latitude, parseFloatOr( $wrap.data( 'center-lat' ), -37.81411 ) );
		var centerLng = parseFloatOr( vals.longitude, parseFloatOr( $wrap.data( 'center-lng' ), 144.96328 ) );
		var zoom = parseIntOr( vals.zoom, parseIntOr( $wrap.data( 'zoom' ), 14 ) );
		var hasMarker = '' !== vals.latitude && '' !== vals.longitude;

		var map = new google.maps.Map( $canvas.get( 0 ), {
			center: { lat: centerLat, lng: centerLng },
			zoom: zoom,
			mapTypeControl: true,
			streetViewControl: false,
			fullscreenControl: true
		} );

		var marker = null;
		var geocoder = new google.maps.Geocoder();
		var addressSearchCleanup = { widget: null, onSelect: null, autocomplete: null };

		function setMarker( lat, lng ) {
			var pos = { lat: lat, lng: lng };
			if ( ! marker ) {
				marker = new google.maps.Marker( {
					position: pos,
					map: map,
					draggable: true
				} );
				marker.addListener( 'dragend', onMarkerDrag );
			} else {
				marker.setPosition( pos );
			}
			map.panTo( pos );
			writeInputs( $wrap, {
				latitude: String( lat ),
				longitude: String( lng ),
				zoom: String( map.getZoom() )
			} );
		}

		function fillFromGoogleResult( result, options ) {
			options = options || {};
			if ( ! result ) {
				return {
					address: '',
					place_name: '',
					street_number: '',
					street_name: '',
					city_block: '',
					sublocality: '',
					city: '',
					state: '',
					post_code: '',
					country: ''
				};
			}

			var parts = extractGoogleAddressParts( result.address_components || result.addressComponents );
			var placeName = '';
			if ( result.name ) {
				placeName = ( typeof result.name === 'string' ) ? result.name : '';
			} else if ( result.displayName ) {
				placeName = ( typeof result.displayName === 'string' )
					? result.displayName
					: ( result.displayName.text || '' );
			}

			var data = {
				address: result.formatted_address || result.formattedAddress || '',
				place_name: placeName,
				street_number: parts.street_number,
				street_name: parts.street_name,
				city_block: '',
				sublocality: parts.sublocality,
				city: parts.city,
				state: parts.state,
				post_code: parts.post_code,
				country: parts.country
			};

			if ( options.preserveAddress ) {
				data.address = options.preserveAddress;
			}
			if ( options.preservePlaceName ) {
				data.place_name = options.preservePlaceName;
			}

			if ( ! data.state ) {
				data.state = extractStateFromFormattedAddress( data.address, data );
			}

			writeInputs( $wrap, data );
			return data;
		}

		function reverseGeocode( lat, lng, options ) {
			options = options || {};
			geocoder.geocode( { location: { lat: lat, lng: lng } }, function( results, status ) {
				if ( status === 'OK' && results && results[0] ) {
					fillFromGoogleResult( results[0], options );
				}
			} );
		}

		function onPlaceSelected( result, lat, lng, viewport ) {
			setMarker( lat, lng );
			var filled = fillFromGoogleResult( result );
			if ( viewport ) {
				map.fitBounds( viewport );
			}
			if ( ! filled.city || ! filled.country || ! filled.sublocality ) {
				reverseGeocode( lat, lng, {
					preserveAddress: filled.address,
					preservePlaceName: filled.place_name
				} );
			}
		}

		function onMarkerDrag() {
			var pos = marker.getPosition();
			writeInputs( $wrap, {
				latitude: String( pos.lat() ),
				longitude: String( pos.lng() ),
				zoom: String( map.getZoom() )
			} );
			reverseGeocode( pos.lat(), pos.lng() );
		}

		/**
		 * Apply a New Places API Place object to the map field.
		 *
		 * @param {Object} place Place instance after fetchFields.
		 * @return {boolean} True when applied.
		 */
		function applyNewPlaceDetails( place ) {
			var coords = readLatLng( place && place.location );
			if ( ! coords ) {
				return false;
			}
			var displayName = '';
			if ( place.displayName ) {
				displayName = ( typeof place.displayName === 'string' )
					? place.displayName
					: ( place.displayName.text || '' );
			}
			onPlaceSelected(
				{
					formatted_address: place.formattedAddress || '',
					address_components: normalizeGoogleAddressComponents( place.addressComponents ),
					name: displayName
				},
				coords.lat,
				coords.lng,
				place.viewport || null
			);
			return true;
		}

		/**
		 * Apply a legacy PlacesService place result to the map field.
		 *
		 * @param {Object} place Legacy place result.
		 * @return {boolean} True when applied.
		 */
		function applyLegacyPlaceDetails( place ) {
			if ( ! place || ! place.geometry || ! place.geometry.location ) {
				return false;
			}
			var loc = place.geometry.location;
			onPlaceSelected(
				place,
				loc.lat(),
				loc.lng(),
				place.geometry.viewport || null
			);
			return true;
		}

		/**
		 * Fallback: place marker and reverse-geocode at latLng.
		 *
		 * @param {google.maps.LatLng} latLng Click coordinates.
		 */
		function fallbackReverseAt( latLng ) {
			if ( ! latLng ) {
				return;
			}
			setMarker( latLng.lat(), latLng.lng() );
			reverseGeocode( latLng.lat(), latLng.lng() );
		}

		/**
		 * Fetch POI details by placeId (New Places first, legacy getDetails fallback).
		 *
		 * @param {string}              placeId Place ID from map click.
		 * @param {google.maps.LatLng}  latLng  Click coordinates for fallback.
		 */
		function fetchPoiPlaceDetails( placeId, latLng ) {
			function useLegacyDetails() {
				if ( ! google.maps.places || typeof google.maps.places.PlacesService !== 'function' ) {
					fallbackReverseAt( latLng );
					return;
				}
				var service = new google.maps.places.PlacesService( map );
				service.getDetails(
					{
						placeId: placeId,
						fields: [ 'name', 'formatted_address', 'geometry', 'address_components' ]
					},
					function( place, status ) {
						if ( status === google.maps.places.PlacesServiceStatus.OK && applyLegacyPlaceDetails( place ) ) {
							return;
						}
						fallbackReverseAt( latLng );
					}
				);
			}

			if ( typeof google.maps.importLibrary !== 'function' ) {
				useLegacyDetails();
				return;
			}

			google.maps.importLibrary( 'places' ).then( function( placesLib ) {
				var Place = ( placesLib && placesLib.Place ) ||
					( google.maps.places && google.maps.places.Place );

				if ( typeof Place !== 'function' ) {
					useLegacyDetails();
					return;
				}

				var place = new Place( { id: placeId } );
				return place.fetchFields( {
					fields: [ 'displayName', 'formattedAddress', 'location', 'addressComponents', 'viewport' ]
				} ).then( function() {
					if ( ! applyNewPlaceDetails( place ) ) {
						useLegacyDetails();
					}
				} );
			} ).catch( function() {
				useLegacyDetails();
			} );
		}

		if ( hasMarker ) {
			setMarker( centerLat, centerLng );
		}

		map.addListener( 'click', function( e ) {
			if ( e.placeId ) {
				if ( typeof e.stop === 'function' ) {
					e.stop();
				}
				fetchPoiPlaceDetails( e.placeId, e.latLng );
				return;
			}
			setMarker( e.latLng.lat(), e.latLng.lng() );
			reverseGeocode( e.latLng.lat(), e.latLng.lng() );
		} );

		map.addListener( 'zoom_changed', function() {
			writeInputs( $wrap, { zoom: String( map.getZoom() ) } );
		} );

		var instance = {
			provider: 'google_maps',
			$wrap: $wrap,
			map: map,
			marker: marker,
			setMarker: setMarker,
			invalidate: function() {
				google.maps.event.trigger( map, 'resize' );
			},
			destroy: function() {
				destroyGoogleAddressSearch( addressSearchCleanup, $wrap );
				$wrap.removeData( 'map-instance' );
			}
		};

		$wrap.data( 'map-instance', instance );
		instances.push( instance );

		initGoogleAddressSearch( $wrap, map, onPlaceSelected ).then( function( cleanup ) {
			if ( cleanup ) {
				addressSearchCleanup.widget = cleanup.widget;
				addressSearchCleanup.onSelect = cleanup.onSelect;
				addressSearchCleanup.autocomplete = cleanup.autocomplete;
			}
		} );

		syncPlaceNameCue( $wrap );

		return instance;
	}

	function initMap( $wrap ) {
		if ( ! $wrap || ! $wrap.length || $wrap.data( 'map-instance' ) ) {
			return $wrap.data( 'map-instance' ) || null;
		}

		var provider = $wrap.data( 'map-provider' ) || 'openstreetmap';

		if ( 'google_maps' === provider ) {
			// Cue from saved raw place_name — do not wait for Maps API.
			syncPlaceNameCue( $wrap );
			whenGoogleReady( function() {
				if ( ! $wrap.data( 'map-instance' ) ) {
					initGoogle( $wrap );
				}
			} );
			return null;
		}

		return initLeaflet( $wrap );
	}

	function initAll( context ) {
		var $root = context ? $( context ) : $( document );
		var $maps = $root.find( '.cfgroup-map' ).addBack( '.cfgroup-map' );

		// On full-page init, skip list-table Quick/Bulk Edit templates until opened.
		if ( ! context ) {
			$maps = $maps.filter( function() {
				return 0 === $( this ).closest( '.inline-edit-row, #bulk-edit' ).length;
			} );
		}

		$maps.each( function() {
			initMap( $( this ) );
		} );
	}

	function invalidateAll() {
		instances.forEach( function( inst ) {
			if ( inst && typeof inst.invalidate === 'function' ) {
				inst.invalidate();
			}
		} );
	}

	/**
	 * Invalidate map instances inside a DOM root (e.g. opened repeater body / tab).
	 *
	 * @param {Element|jQuery} context Root element.
	 */
	function invalidateIn( context ) {
		$( context ).find( '.cfgroup-map' ).each( function() {
			var inst = $( this ).data( 'map-instance' );
			if ( inst && typeof inst.invalidate === 'function' ) {
				inst.invalidate();
			}
		} );
	}

	$( function() {
		initAll( document );

		// Repeater row cloned — init new map instances in the repeater.
		$( document ).on( 'cfgroup/ready', '.cfgroup_add_field', function() {
			var $container = $( this ).closest( '.cfgroup_repeater' );
			setTimeout( function() {
				var $root = $container.length ? $container : $( document );
				initAll( $root );
				setTimeout( function() {
					invalidateIn( $root );
				}, 50 );
			}, 50 );
		} );

		// Leaflet/Google maps init at 0×0 inside collapsed bodies — fix on expand.
		$( document ).on( 'click', '.cfgroup_repeater_head', function() {
			var $body = $( this ).siblings( '.cfgroup_repeater_body' );
			setTimeout( function() {
				if ( $body.hasClass( 'open' ) ) {
					invalidateIn( $body );
				}
			}, 50 );
		} );

		$( document ).on( 'click', '.cfgroup_repeater_toggle', function() {
			var $field = $( this ).closest( '.field' );
			setTimeout( function() {
				$field.find( '.cfgroup_repeater_body.open' ).each( function() {
					invalidateIn( this );
				} );
			}, 50 );
		} );

		// Tabs / visibility changes (scoped to shown tab content).
		$( document ).on( 'cfgroup/tab_shown', function( event, $tabContent ) {
			setTimeout( function() {
				if ( $tabContent && $tabContent.length ) {
					invalidateIn( $tabContent );
				} else {
					invalidateAll();
				}
			}, 50 );
		} );
	} );

	window.asenhaCfgMapInit = initAll;
	window.asenhaCfgMapInitOne = initMap;
	window.asenhaCfgMapInvalidate = invalidateAll;
	window.asenhaCfgMapInvalidateIn = invalidateIn;

} )( jQuery );
