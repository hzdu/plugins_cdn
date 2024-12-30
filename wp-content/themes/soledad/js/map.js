jQuery(function (r) {
    "use strict";
    r(".penci-google-map").each(function () {
        var e = (n = r(this)).data("map_options"), o = n.attr("id"), a = google.maps.MapTypeId.ROADMAP;
        switch (e.map_type) {
            case"satellite":
                a = google.maps.MapTypeId.SATELLITE;
                break;
            case"hybrid":
                a = google.maps.MapTypeId.HYBRID;
                break;
            case"terrain":
                a = google.maps.MapTypeId.TERRAIN
        }
        var t = new google.maps.LatLng(-34.397, 150.644), n = new google.maps.Map(document.getElementById(o), {
            zoom: e.map_zoom,
            center: t,
            mapTypeId: a,
            panControl: e.map_pan,
            zoomControl: e.map_is_zoom,
            mapTypeControl: !0,
            scaleControl: e.map_scale,
            streetViewControl: e.map_street_view,
            rotateControl: e.map_rotate,
            overviewMapControl: e.map_overview,
            scrollwheel: e.map_scrollwheel
        }), p = new google.maps.Marker({position: t, map: n, title: e.marker_title, icon: e.marker_img});
        if (e.info_window) {
            var i = new google.maps.InfoWindow({content: e.info_window});
            google.maps.event.addListener(p, "click", function () {
                i.open(n, p)
            })
        }
        "coordinates" == e.map_using && e.latitude && e.longtitude ? (t = new google.maps.LatLng(e.latitude, e.longtitude), n.setCenter(t), p.setPosition(t)) : (new google.maps.Geocoder).geocode({address: e.address}, function (e) {
            var o = e[0].geometry.location;
            t = new google.maps.LatLng(o.lat(), o.lng()), n.setCenter(t), p.setPosition(t)
        })
    })
});
