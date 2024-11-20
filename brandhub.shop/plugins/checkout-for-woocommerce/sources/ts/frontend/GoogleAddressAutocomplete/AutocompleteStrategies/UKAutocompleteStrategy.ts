import AutocompleteStrategy                            from './AutocompleteStrategy';
import CityNoSublocalityLevel1PreferPostalTownStrategy from '../FieldStrategies/CityNoSublocalityLevel1PreferPostalTownStrategy';
import Utilities                                       from '../Utilities';
import HouseNumberStrategy                             from '../FieldStrategies/HouseNumberStrategy';
import cfwBuildAddress1                                from '../../../functions/cfwBuildAddress1';

export default class UKAutocompleteStrategy extends AutocompleteStrategy {
    public getCity():string {
        return new CityNoSublocalityLevel1PreferPostalTownStrategy( this.components ).getValue();
    }

    public getAddress1(): string {
        const country     = Utilities.getComponentValueByType( 'country', this.components );
        const houseNumber = new HouseNumberStrategy( this.components, this.formattedAddress, this.userInputValue ).getValue();
        const streetName  = Utilities.getComponentValueByType( 'route', this.components, true );

        return cfwBuildAddress1( country, houseNumber, streetName );
    }

    public getAddress2(): string {
        return Utilities.getComponentValueByType( 'locality', this.components );
    }

    public getState(): string {
        return ''; // set to blank
    }
}
