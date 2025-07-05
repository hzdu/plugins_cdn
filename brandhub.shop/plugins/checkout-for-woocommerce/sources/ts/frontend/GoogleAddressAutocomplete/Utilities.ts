class Utilities {
    public static getComponentValueByType( type: string, components: google.maps.GeocoderAddressComponent[], long = false ): string {
        const component = Utilities.getComponentByType( type, components );

        if ( long ) {
            return component?.long_name ?? '';
        }

        return Utilities.getComponentByType( type, components )?.short_name ?? '';
    }

    public static getFirstComponentValueByType( types: Array<string>, components: google.maps.GeocoderAddressComponent[] ): string {
        const values = types.map( ( type ) => Utilities.getComponentValueByType( type, components, true ) );

        return values.find( ( value ) => value !== '' ) ?? '';
    }

    public static getComponentByType( type: string, components: google.maps.GeocoderAddressComponent[] ): google.maps.GeocoderAddressComponent | undefined {
        return components.find( ( { types } ) => types[ 0 ] === type );
    }
}

export default Utilities;
