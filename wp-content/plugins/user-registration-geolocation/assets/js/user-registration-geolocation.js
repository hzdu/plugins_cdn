jQuery(function ($) {
	var URGeolocation = {
		init: function () {
			$("input[data-autocomplete-address='1']").each(function (e) {
				var $this = $(this);

				var address_style = $this.data("address-style");
				var current_location = $this.data("current-location");

				// Enable Current location for Address Field
				if (current_location) {
					navigator.geolocation.getCurrentPosition(
						URGeolocation.currentPosition
					);
				}

				// Enable Autopopulate Address field.
				if ("address" === address_style) {
					URGeolocation.autoAddressfield($this);
				} else if ("map" === address_style) {
					URGeolocation.gmapAddressfield($this);
				}
			});
		},
		/**
		 * This function auto complete the search box with address.
		 * @param {object} $this Pointer.
		 */
		autoAddressfield: function ($this) {
			var address_style = $this.data("address-style");

			var searchBox = new google.maps.places.SearchBox(
				document.getElementById($this.attr("id"))
			);
		},
		/**
		 * This function load the map and auto fill the address pointed in the Map.
		 * @param {object} $this Pointer
		 */
		gmapAddressfield: function ($this) {
			if ("" != $this.val()) {
				var geocoder = new google.maps.Geocoder();
				geocoder.geocode(
					{
						address: $this.val(),
					},
					function (results) {
						var latitude = results[0].geometry.location.lat();
						var longitude = results[0].geometry.location.lng();

						var myLatLng = { lat: latitude, lng: longitude };
						URGeolocation.setDefaultMapPosition(myLatLng, $this);
					}
				);
			} else {
				var myLatLng = new google.maps.LatLng(38.897696, -77.036519);
				URGeolocation.setDefaultMapPosition(myLatLng, $this);
			}
		},
		/**
		 * This function will ask for the permission for current location and autofill the address field.
		 * @param {object} position Position.
		 */
		currentPosition: function (position) {
			$("input[data-autocomplete-address='1']").each(function (e) {
				var $this = $(this);
				var address_style = $this.data("address-style");
				var latlng = new google.maps.LatLng(
					position.coords.latitude,
					position.coords.longitude
				);
				if ("map" == address_style) {
					var mapOptions = {
						zoom: 8,
						center: latlng,
						disableDefaultUI: false,
						scrollWheel: true,
						draggable: true,
					};

					map = new google.maps.Map(
						document.getElementById("ur-geolocation-map"),
						mapOptions
					);

					var marker = new google.maps.Marker({
						position: mapOptions.center,
						map: map,
						draggable: true,
					});

					var searchBox = new google.maps.places.SearchBox(
						document.getElementById($this.attr("id"))
					);
					google.maps.event.addListener(
						marker,
						"dragend",
						function (event) {
							var lat, long, address, resultArray, citi;
							lat = marker.getPosition().lat();
							long = marker.getPosition().lng();
							var geocoder = new google.maps.Geocoder();
							geocoder.geocode(
								{ latLng: marker.getPosition() },
								function (result, status) {
									if ("OK" === status) {
										address = result[0].formatted_address;
										component =
											result[0].address_components;
										$this.val(address).trigger("change");
									}
								}
							);
						}
					);
					google.maps.event.addListener(
						searchBox,
						"places_changed",
						function () {
							var places = searchBox.getPlaces(),
								bounds = new google.maps.LatLngBounds(),
								i,
								place,
								lat,
								long,
								resultArray,
								addresss = places[0].formatted_address;

							for (i = 0; (place = places[i]); i++) {
								bounds.extend(place.geometry.location);
								marker.setPosition(place.geometry.location); // Set marker position new.
							}
							map.fitBounds(bounds); // Fit to the bound
							map.setZoom(15); // This function sets the zoom to 15, meaning zooms to level 15.
							lat = marker.getPosition().lat();
							long = marker.getPosition().lng();
						}
					);
				}

				var geocoder = new google.maps.Geocoder();
				geocoder.geocode({ latLng: latlng }, function (result, status) {
					if ("OK" === status) {
						address = result[0].formatted_address;
						$this.val(address).trigger("change");
					}
				});
			});
		},
		/**
		 * Set Default Map Position.
		 * @param {object} position
		 * @param {object} $this
		 */
		setDefaultMapPosition: function (position, $this) {
			var mapOptions = {
				zoom: 8,
				center: position,
				disableDefaultUI: false,
				scrollWheel: true,
				draggable: true,
			};
			map = new google.maps.Map(
				document.getElementById("ur-geolocation-map"),
				mapOptions
			);

			/**
			 * Creates the marker on the map
			 *
			 */
			var marker = new google.maps.Marker({
				position: mapOptions.center,
				map: map,
				draggable: true,
			});

			var searchBox = new google.maps.places.SearchBox(
				document.getElementById($this.attr("id"))
			);

			google.maps.event.addListener(marker, "dragend", function (event) {
				var lat, long, address, resultArray, citi;
				lat = marker.getPosition().lat();
				long = marker.getPosition().lng();
				var geocoder = new google.maps.Geocoder();
				geocoder.geocode(
					{ latLng: marker.getPosition() },
					function (result, status) {
						if ("OK" === status) {
							address = result[0].formatted_address;
							component = result[0].address_components;
							$this.val(address).trigger("change");
						}
					}
				);
			});
			google.maps.event.addListener(
				searchBox,
				"places_changed",
				function () {
					var places = searchBox.getPlaces(),
						bounds = new google.maps.LatLngBounds(),
						i,
						place,
						lat,
						long,
						resultArray,
						addresss = places[0].formatted_address;

					for (i = 0; (place = places[i]); i++) {
						bounds.extend(place.geometry.location);
						marker.setPosition(place.geometry.location); // Set marker position new.
					}
					map.fitBounds(bounds); // Fit to the bound
					map.setZoom(15); // This function sets the zoom to 15, meaning zooms to level 15.
					lat = marker.getPosition().lat();
					long = marker.getPosition().lng();
				}
			);
		},
	};
	URGeolocation.init(jQuery);
});
