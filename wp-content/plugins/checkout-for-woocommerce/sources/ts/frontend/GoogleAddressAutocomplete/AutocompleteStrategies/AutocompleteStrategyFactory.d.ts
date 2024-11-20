import AutocompleteStrategy from './AutocompleteStrategy';
export default class AutocompleteStrategyFactory {
    static get(components: google.maps.GeocoderAddressComponent[], formattedAddress: string, userInputValue?: string): AutocompleteStrategy;
}
