import cfwBuildAddress1    from '../../../functions/cfwBuildAddress1';
import Utilities           from '../Utilities';
import HouseNumberStrategy from './HouseNumberStrategy';
import StreetNameStrategy  from './StreetNameStrategy';

export default class Address1WithSubpremiseStrategy {
    public constructor(
        protected components: google.maps.GeocoderAddressComponent[],
        protected formattedAddress: string,
        protected userInputValue: string,
    ) {}

    public getValue(): string {
        const capitalize = ( str: string, lower = false ): string => ( lower ? str.toLowerCase() : str ).replace( /(?:^|\s|["'([{])+\S/g, ( match ) => match.toUpperCase() );

        const country = Utilities.getComponentValueByType( 'country', this.components );
        const houseNumber = new HouseNumberStrategy( this.components, this.formattedAddress, this.userInputValue ).getValue();
        const streetName = new StreetNameStrategy( this.components, this.formattedAddress ).getValue();
        const subpremise = Utilities.getComponentValueByType( 'subpremise', this.components );

        if ( subpremise ) {
            return cfwBuildAddress1( country, houseNumber, `${streetName} ${capitalize( subpremise )}` );
        }

        return cfwBuildAddress1( country, houseNumber, streetName );
    }
}
