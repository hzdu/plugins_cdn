export default class StreetNameStrategy {
    protected components: google.maps.GeocoderAddressComponent[];
    protected formattedAddress: string;
    constructor(components: google.maps.GeocoderAddressComponent[], formattedAddress: string);
    getValue(): string;
}
