function germanyAddress(): string {
    return 'Balatonstraße 46, Berlin, Germany';
}

function germanyComponents(): google.maps.GeocoderAddressComponent[] {
    return <google.maps.GeocoderAddressComponent[]>[
        {
            long_name: '46',
            short_name: '46',
            types: [ 'street_number' ],
        },
        {
            long_name: 'Balatonstraße',
            short_name: 'Balatonstraße',
            types: [ 'route' ],
        },
        {
            long_name: 'Bezirk Lichtenberg',
            short_name: 'Bezirk Lichtenberg',
            types: [ 'sublocality_level_1', 'sublocality', 'political' ],
        },
        {
            long_name: 'Berlin',
            short_name: 'Berlin',
            types: [ 'locality', 'political' ],
        },
        {
            long_name: 'Kreisfreie Stadt Berlin',
            short_name: 'Kreisfreie Stadt Berlin',
            types: [ 'administrative_area_level_3', 'political' ],
        },
        {
            long_name: 'Berlin',
            short_name: 'BE',
            types: [ 'administrative_area_level_1', 'political' ],
        },
        {
            long_name: 'Germany',
            short_name: 'DE',
            types: [ 'country', 'political' ],
        },
        {
            long_name: '10319',
            short_name: '10319',
            types: [ 'postal_code' ],
        },
    ];
}

function packstationAddress(): string {
    return 'Packstation 158, Under dem Birkenkopf, Stuttgart-West, Germany';
}

function packStationComponents(): google.maps.GeocoderAddressComponent[] {
    return <google.maps.GeocoderAddressComponent[]>[
        {
            "long_name": "19",
            "short_name": "19",
            "types": [
                "street_number"
            ]
        },
        {
            "long_name": "Unter dem Birkenkopf",
            "short_name": "Unter dem Birkenkopf",
            "types": [
                "route"
            ]
        },
        {
            "long_name": "Stuttgart-West",
            "short_name": "Stuttgart-West",
            "types": [
                "sublocality_level_1",
                "sublocality",
                "political"
            ]
        },
        {
            "long_name": "Stuttgart",
            "short_name": "Stuttgart",
            "types": [
                "locality",
                "political"
            ]
        },
        {
            "long_name": "Stuttgart",
            "short_name": "Stuttgart",
            "types": [
                "administrative_area_level_3",
                "political"
            ]
        },
        {
            "long_name": "Stuttgart",
            "short_name": "Süd",
            "types": [
                "administrative_area_level_2",
                "political"
            ]
        },
        {
            "long_name": "Baden-Württemberg",
            "short_name": "BW",
            "types": [
                "administrative_area_level_1",
                "political"
            ]
        },
        {
            "long_name": "Germany",
            "short_name": "DE",
            "types": [
                "country",
                "political"
            ]
        },
        {
            "long_name": "70197",
            "short_name": "70197",
            "types": [
                "postal_code"
            ]
        }
    ]
}

export { germanyAddress, germanyComponents, packstationAddress, packStationComponents };
