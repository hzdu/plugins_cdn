import CityNoSublocalityLevel1Strategy from '../FieldStrategies/CityNoSublocalityLevel1Strategy';
import AutocompleteStrategy            from './AutocompleteStrategy';
import Address1WithSubpremiseStrategy  from '../FieldStrategies/Address1WithSubpremiseStrategy';

export default class CanadaAutocompleteStrategy extends AutocompleteStrategy {
    public getCity():string {
        return new CityNoSublocalityLevel1Strategy( this.components ).getValue();
    }

    public getAddress1(): string {
        return new Address1WithSubpremiseStrategy( this.components, this.formattedAddress, this.userInputValue ).getValue();
    }
}
