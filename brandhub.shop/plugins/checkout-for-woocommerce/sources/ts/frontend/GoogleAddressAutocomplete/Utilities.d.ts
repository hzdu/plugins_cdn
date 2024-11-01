declare class Utilities {
    static getComponentValueByType(type: string, components: google.maps.GeocoderAddressComponent[], long?: boolean): string;
    static getFirstComponentValueByType(types: Array<string>, components: google.maps.GeocoderAddressComponent[]): string;
    static getComponentByType(type: string, components: google.maps.GeocoderAddressComponent[]): google.maps.GeocoderAddressComponent | undefined;
}
export default Utilities;
