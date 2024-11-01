export default class CityStrategy {
    protected components: google.maps.GeocoderAddressComponent[];
    constructor(components: google.maps.GeocoderAddressComponent[]);
    getValue(): string;
}
