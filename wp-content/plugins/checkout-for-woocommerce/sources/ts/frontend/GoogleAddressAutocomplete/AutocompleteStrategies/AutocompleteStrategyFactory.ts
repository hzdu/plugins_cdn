import Utilities                       from '../Utilities';
import AutocompleteStrategy            from './AutocompleteStrategy';
import CanadaAutocompleteStrategy      from './CanadaAutocompleteStrategy';
import GermanyAutocompleteStrategy     from './GermanyAutocompleteStrategy';
import ItalyAutocompleteStrategy       from './ItalyAutocompleteStrategy';
import MalaysiaAutocompleteStrategy    from './MalaysiaAutocompleteStrategy';
import NetherlandsAutocompleteStrategy from './NetherlandsAutocompleteStrategy';
import NewZealandAutocompleteStrategy  from './NewZealandAutocompleteStrategy';
import SpainAutocompleteStrategy       from './SpainAutocompleteStrategy';
import SwedenAutocompleteStrategy      from './SwedenAutocompleteStrategy';
import UKAutocompleteStrategy          from './UKAutocompleteStrategy';
import TaiwanAutocompleteStrategy      from './TaiwanAutocompleteStrategy';

export default class AutocompleteStrategyFactory {
    public static get(
        components: google.maps.GeocoderAddressComponent[],
        formattedAddress: string,
        userInputValue?: string,
    ): AutocompleteStrategy {
        const country = Utilities.getComponentValueByType( 'country', components );

        if ( country === 'NZ' ) {
            return new NewZealandAutocompleteStrategy( components, formattedAddress, userInputValue );
        }

        if ( country === 'NL' ) {
            return new NetherlandsAutocompleteStrategy( components, formattedAddress, userInputValue );
        }

        if ( country === 'CA' ) {
            return new CanadaAutocompleteStrategy( components, formattedAddress, userInputValue );
        }

        if ( country === 'ES' ) {
            return new SpainAutocompleteStrategy( components, formattedAddress, userInputValue );
        }

        if ( country === 'DE' ) {
            return new GermanyAutocompleteStrategy( components, formattedAddress, userInputValue );
        }

        if ( country === 'SE' ) {
            return new SwedenAutocompleteStrategy( components, formattedAddress, userInputValue );
        }

        if ( country === 'MY' ) {
            return new MalaysiaAutocompleteStrategy( components, formattedAddress, userInputValue );
        }

        if ( country === 'IT' ) {
            return new ItalyAutocompleteStrategy( components, formattedAddress, userInputValue );
        }

        if ( country === 'GB' ) {
            return new UKAutocompleteStrategy( components, formattedAddress, userInputValue );
        }

        if ( country === 'TW' ) {
            return new TaiwanAutocompleteStrategy( components, formattedAddress, userInputValue );
        }

        return new AutocompleteStrategy( components, formattedAddress, userInputValue );
    }
}
