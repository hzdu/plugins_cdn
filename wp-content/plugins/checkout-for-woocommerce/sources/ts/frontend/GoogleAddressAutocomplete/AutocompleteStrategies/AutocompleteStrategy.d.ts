declare class AutocompleteStrategy {
    protected components: google.maps.GeocoderAddressComponent[];
    protected formattedAddress: string;
    protected userInputValue?: string;
    constructor(components: google.maps.GeocoderAddressComponent[], formattedAddress: string, userInputValue?: string);
    getHouseNumber(): string;
    getStreetName(): string;
    getAddress1(): string;
    /**
     * We've taken the stance that if someone is accepting
     * a new suggested place from Google then the likelihood
     * they want to keep the address 2 data is very slim.
     */
    getAddress2(): string;
    getCity(): string;
    getState(): string;
    getPostcode(): string;
    getCountry(): string;
}
export default AutocompleteStrategy;
