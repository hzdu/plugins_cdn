/* eslint-disable prefer-regex-literals */
import Utilities from '../Utilities';

export default class HouseNumberStrategy {
    public constructor(  protected components: google.maps.GeocoderAddressComponent[], protected formattedAddress: string, protected userInputValue: string ) {}

    public getValue(): string {
        let results = HouseNumberStrategy.tryToParseHouseNumberFromUserInput( this.formattedAddress );

        if ( results ) {
            return results;
        }

        results = HouseNumberStrategy.tryToParseHouseNumberFromUserInput( this.userInputValue );

        if ( results ) {
            return results;
        }

        const streetNumber   = Utilities.getComponentValueByType( 'street_number', this.components );
        const premise        = Utilities.getComponentValueByType( 'premise', this.components );
        const subpremise     = Utilities.getComponentValueByType( 'subpremise', this.components );
        const simpleResult   = streetNumber || premise || subpremise;

        if ( simpleResult ) {
            return simpleResult;
        }

        const houseNumberResults = RegExp( '^(\\d+)\\s' ).exec( this.formattedAddress );

        return Array.isArray( houseNumberResults ) ? `${houseNumberResults[ 1 ]}` : '';
    }

    protected static tryToParseHouseNumberFromUserInput( address1: string ): string {
        // Process <subpremise>/<street number> <route> formats
        // get all the user entered values before a match with the street name;
        // group #1 = unit number, group #2 = street number
        // eslint-disable-next-line no-useless-escape
        const slashedResults = RegExp( '^(.*?)\/(.*?) ' ).exec( address1 );

        // If this is an array, format was unit/house number format
        if ( Array.isArray( slashedResults ) ) {
            return `${slashedResults[ 1 ]}/${slashedResults[ 2 ]}`;
        }

        // Process <subpremise>-<street number> <route> formats
        // get all the user entered values before a match with the street name;
        // group #1 = unit number, group #2 = street number
        // eslint-disable-next-line no-useless-escape
        const dashedResults = RegExp( '^(.*?)-(.*?) ' ).exec( address1 );

        // If this is an array, format was unit/house number format
        if ( Array.isArray( dashedResults ) ) {
            return `${dashedResults[ 1 ]}-${dashedResults[ 2 ]}`;
        }

        return '';
    }
}
