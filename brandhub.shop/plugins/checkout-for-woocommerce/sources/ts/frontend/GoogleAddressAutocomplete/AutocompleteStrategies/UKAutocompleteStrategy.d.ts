import AutocompleteStrategy from './AutocompleteStrategy';
export default class UKAutocompleteStrategy extends AutocompleteStrategy {
    getCity(): string;
    getAddress1(): string;
    getAddress2(): string;
    getState(): string;
}
