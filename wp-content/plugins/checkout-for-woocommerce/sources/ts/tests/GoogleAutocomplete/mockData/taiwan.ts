function taiwanAddress(): string {
    return 'Zhongbu 2nd Street 81號, Taoyuan City, Taoyuan District, 330, 中寧里, Taiwan';
}

function taiwanComponents(): google.maps.GeocoderAddressComponent[] {
    return <google.maps.GeocoderAddressComponent[]>[
        {
            long_name: '81號',
            short_name: '81號',
            types: [
                'street_number',
            ],
        },
        {
            long_name: 'Zhongbu 2nd Street',
            short_name: 'Zhongbu 2nd St',
            types: [
                'route',
            ],
        },
        {
            long_name: '中寧里',
            short_name: '中寧里',
            types: [
                'administrative_area_level_3',
                'political',
            ],
        },
        {
            long_name: 'Taoyuan District',
            short_name: 'Taoyuan District',
            types: [
                'administrative_area_level_2',
                'political',
            ],
        },
        {
            long_name: 'Taoyuan City',
            short_name: 'Taoyuan City',
            types: [
                'administrative_area_level_1',
                'political',
            ],
        },
        {
            long_name: 'Taiwan',
            short_name: 'TW',
            types: [
                'country',
                'political',
            ],
        },
        {
            long_name: '330',
            short_name: '330',
            types: [
                'postal_code',
            ],
        },
    ];
}

export { taiwanAddress, taiwanComponents };
