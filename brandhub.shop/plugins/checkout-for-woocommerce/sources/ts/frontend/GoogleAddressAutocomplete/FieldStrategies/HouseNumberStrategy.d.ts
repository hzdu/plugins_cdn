export default class HouseNumberStrategy {
    protected components: google.maps.GeocoderAddressComponent[];
    protected formattedAddress: string;
    protected userInputValue: string;
    constructor(components: google.maps.GeocoderAddressComponent[], formattedAddress: string, userInputValue: string);
    getValue(): string;
    /**
     * Try to get the house number out of the address1 field
     *
     * Note: The subpremise must start with a digit to be detected, but it can contain other characters
     *
     * @param address1
     * @protected
     */
    protected static tryToParseHouseNumberFromAddress1(address1: string): string;
}
