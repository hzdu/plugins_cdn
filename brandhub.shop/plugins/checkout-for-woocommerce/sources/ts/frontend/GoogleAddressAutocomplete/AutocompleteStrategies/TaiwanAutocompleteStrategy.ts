import AutocompleteStrategy from './AutocompleteStrategy';
import Utilities            from '../Utilities';
import HouseNumberStrategy  from '../FieldStrategies/HouseNumberStrategy';
import cfwBuildAddress1     from '../../../functions/cfwBuildAddress1';

export default class TaiwanAutocompleteStrategy extends AutocompleteStrategy {
    public getAddress1(): string {
        const country = Utilities.getComponentValueByType( 'street_number', this.components );
        const houseNumber = new HouseNumberStrategy(
            this.components,
            this.formattedAddress,
            this.userInputValue,
        ).getValue();
        const streetName = Utilities.getComponentValueByType( 'route', this.components, true );

        return cfwBuildAddress1( country, streetName, houseNumber );
    }

    public getAddress2(): string {
        return Utilities.getComponentValueByType( 'locality', this.components );
    }
}
