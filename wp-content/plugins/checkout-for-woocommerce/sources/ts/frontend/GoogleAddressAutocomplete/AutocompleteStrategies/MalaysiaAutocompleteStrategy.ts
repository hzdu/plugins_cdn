import Utilities                       from '../Utilities';
import AutocompleteStrategy            from './AutocompleteStrategy';

export default class MalaysiaAutocompleteStrategy extends AutocompleteStrategy {
    public getAddress1(): string {
        const houseNumber = this.getHouseNumber();

        if ( !houseNumber ) {
            return this.formattedAddress;
        }

        return super.getAddress1();
    }

    public getState(): string {
        return Utilities.getComponentValueByType( 'locality', this.components );
    }
}
