(function($) {
	'use strict';
	
	var googleMap = {};
	qode.modules.googleMap = googleMap;
	
	googleMap.showGoogleMap = showGoogleMap;
	googleMap.qodeInitElementorGoogleMap = qodeInitElementorGoogleMap;
	
	googleMap.qodeOnDocumentReady = qodeOnDocumentReady;
	googleMap.qodeOnWindowLoad = qodeOnWindowLoad;
	
	$(document).ready(qodeOnDocumentReady);
	$(window).on('load', qodeOnWindowLoad);
	
	/*
	 All functions to be called on $(window).load() should be in this function
	 */
	function qodeOnDocumentReady() {
		showGoogleMap();
	}
	
	function qodeOnWindowLoad() {
		qodeInitElementorGoogleMap();
	}
	
	function showGoogleMap(){
		"use strict";
		
		if($('.qode_google_map').length){
			$('.qode_google_map').each(function(){
				
				var snazzyMapStyle = false;
				var snazzyMapCode  = '';
				if(typeof $(this).data('snazzy-map-style') !== 'undefined' && $(this).data('snazzy-map-style') === 'yes') {
					snazzyMapStyle = true;
					var snazzyMapHolder = $(this).parent().find('.qode-snazzy-map'),
						snazzyMapCodes  = snazzyMapHolder.val();
					
					if( snazzyMapHolder.length && snazzyMapCodes.length ) {
						snazzyMapCode = JSON.parse( snazzyMapCodes.replace(/`{`/g, '[').replace(/`}`/g, ']').replace(/``/g, '"').replace(/`/g, '') );
					}
				}
				
				var custom_map_style;
				if(typeof $(this).data('custom-map-style') !== 'undefined') {
					custom_map_style = $(this).data('custom-map-style');
				}
				
				var color_overlay;
				if(typeof $(this).data('color-overlay') !== 'undefined' && $(this).data('color-overlay') !== false) {
					color_overlay = $(this).data('color-overlay');
				}
				
				var saturation;
				if(typeof $(this).data('saturation') !== 'undefined' && $(this).data('saturation') !== false) {
					saturation = $(this).data('saturation');
				}
				
				var lightness;
				if(typeof $(this).data('lightness') !== 'undefined' && $(this).data('lightness') !== false) {
					lightness = $(this).data('lightness');
				}
				
				var zoom;
				if(typeof $(this).data('zoom') !== 'undefined' && $(this).data('zoom') !== false) {
					zoom = $(this).data('zoom');
				}
				
				var pin;
				if(typeof $(this).data('pin') !== 'undefined' && $(this).data('pin') !== false) {
					pin = $(this).data('pin');
				}
				
				var map_height;
				if(typeof $(this).data('map-height') !== 'undefined' && $(this).data('map-height') !== false) {
					map_height = $(this).data('map-height');
				}
				
				var unique_id;
				if(typeof $(this).data('unique-id') !== 'undefined' && $(this).data('unique-id') !== false) {
					unique_id = $(this).data('unique-id');
				}
				
				var google_maps_scroll_wheel;
				if(typeof $(this).data('google-maps-scroll-wheel') !== 'undefined') {
					google_maps_scroll_wheel = $(this).data('google-maps-scroll-wheel');
				}
				var addresses;
				if(typeof $(this).data('addresses') !== 'undefined' && $(this).data('addresses') !== false) {
					addresses = $(this).data('addresses');
				}
				
				
				var map = "map_"+ unique_id;
				var geocoder = "geocoder_"+ unique_id;
				var holderId = "map_canvas_"+ unique_id;
				
				initializeGoogleMap(snazzyMapStyle, snazzyMapCode, custom_map_style, color_overlay, saturation, lightness, google_maps_scroll_wheel, zoom, holderId, map_height, pin,  map, geocoder, addresses)
			});
		}
		
	}
	
	function initializeGoogleMap(snazzyMapStyle, snazzyMapCode, custom_map_style, color, saturation, lightness, wheel, zoom, holderId, height, pin,  map, geocoder, data){
		"use strict";
		
		if (typeof google != "undefined") {
			
			var mapStyles = [];
			if (snazzyMapStyle && snazzyMapCode.length) {
				mapStyles = snazzyMapCode;
			} else {
				mapStyles = [
					{
						stylers: [
							{hue: color},
							{saturation: saturation},
							{lightness: lightness},
							{gamma: 1}
						]
					}
				];
			}
			
			var google_map_type_id;
			
			if (snazzyMapStyle || custom_map_style) {
				google_map_type_id = 'qode_style'
			} else {
				google_map_type_id = google.maps.MapTypeId.ROADMAP
			}
			
			var qodeMapType = new google.maps.StyledMapType(mapStyles,
				{name: "Qode Google Map"});
			
			geocoder = new google.maps.Geocoder();
			var latlng = new google.maps.LatLng(-34.397, 150.644);
			
			var myOptions = {
				
				zoom: zoom,
				scrollwheel: wheel,
				center: latlng,
				zoomControl: true,
				zoomControlOptions: {
					style: google.maps.ZoomControlStyle.SMALL,
					position: google.maps.ControlPosition.RIGHT_CENTER
				},
				scaleControl: false,
				scaleControlOptions: {
					position: google.maps.ControlPosition.LEFT_CENTER
				},
				streetViewControl: false,
				streetViewControlOptions: {
					position: google.maps.ControlPosition.LEFT_CENTER
				},
				panControl: false,
				panControlOptions: {
					position: google.maps.ControlPosition.LEFT_CENTER
				},
				mapTypeControl: false,
				mapTypeControlOptions: {
					mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'qode_style'],
					style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
					position: google.maps.ControlPosition.LEFT_CENTER
				},
				mapTypeId: google_map_type_id
			};
			map = new google.maps.Map(document.getElementById(holderId), myOptions);
			map.mapTypes.set('qode_style', qodeMapType);
			
			var index;
			
			for (index = 0; index < data.length; ++index) {
				initializeGoogleAddress(data[index], pin, map, geocoder);
			}
			
			var holder_element = document.getElementById(holderId);
			holder_element.style.height = height;
			if (!isNaN(height)) {
				height = height + 'px';
			}
			
		}
		
	}
	
	function initializeGoogleAddress(data, pin,  map, geocoder){
		"use strict";
		if (data === '')
			return;
		var contentString = '<div class="content_map">'+
			'<div class="site_notice_map">'+
			'</div>'+
			'<div class="body_content_map">'+
			'<p>'+data+'</p>'+
			'</div>'+
			'</div>';
		var infowindow = new google.maps.InfoWindow({
			content: contentString
		});
		
		geocoder.geocode( { 'address': data}, function(results, status) {
			if (status === google.maps.GeocoderStatus.OK) {
				map.setCenter(results[0].geometry.location);
				var marker = new google.maps.Marker({
					map: map,
					position: results[0].geometry.location,
					icon:  pin,
					title: data['store_title']
				});
				
				google.maps.event.addListener(marker, 'click', function() {
					infowindow.open(map,marker);
				});
				
				google.maps.event.addDomListener(window, 'resize', function() {
					map.setCenter(results[0].geometry.location);
				});
			}
		});
	};
	
	function qodeInitElementorGoogleMap(){
		$(window).on('elementor/frontend/init', function () {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_google_map.default', function() {
				showGoogleMap();
			} );
		});
	}
	
})(jQuery);