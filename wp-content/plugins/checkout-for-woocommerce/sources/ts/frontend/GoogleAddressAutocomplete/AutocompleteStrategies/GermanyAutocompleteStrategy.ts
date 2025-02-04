import Utilities                      from '../Utilities';
import AutocompleteStrategy           from './AutocompleteStrategy';
import Address1WithSubpremiseStrategy from '../FieldStrategies/Address1WithSubpremiseStrategy';
import Address1Strategy               from '../FieldStrategies/Address1Strategy';

export default class GermanyAutocompleteStrategy extends AutocompleteStrategy {
    public getCity():string {
        // Let's try out using the long_name ¯\_(ツ)_/¯ HelpScout ticket #11086
        return [ 'locality', 'postal_town', 'administrative_area_level_2', 'administrative_area_level_3' ]
            .map( ( type ) => Utilities.getComponentByType( type, this.components )?.long_name )
            .find( Boolean );
    }

    public getAddress1(): string {
        if ( this.userInputValue?.includes( 'Deutsche Post Filiale' ) ) {
            return this.userInputValue;
        }

        if ( this.formattedAddress?.includes( 'Packstation' ) ) {
            // We need to extract the packstation number from the formatted address
            const match = this.formattedAddress.match( /packstation.[0-9]+/i );
            if (match !== null) {
                return match[0]
            }
        }

        return new Address1Strategy( this.components, this.formattedAddress, this.userInputValue ).getValue();
    }
}
