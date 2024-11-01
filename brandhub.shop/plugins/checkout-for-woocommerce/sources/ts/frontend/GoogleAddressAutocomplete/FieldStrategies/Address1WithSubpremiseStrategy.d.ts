export default class Address1WithSubpremiseStrategy {
    protected components: google.maps.GeocoderAddressComponent[];
    protected formattedAddress: string;
    protected userInputValue: string;
    constructor(components: google.maps.GeocoderAddressComponent[], formattedAddress: string, userInputValue: string);
    getValue(): string;
}
