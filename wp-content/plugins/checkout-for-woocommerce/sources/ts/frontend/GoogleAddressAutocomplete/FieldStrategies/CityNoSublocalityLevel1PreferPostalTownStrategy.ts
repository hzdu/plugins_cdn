import Utilities from '../Utilities';

export default class CityNoSublocalityLevel1PreferPostalTownStrategy {
    public constructor( protected components: google.maps.GeocoderAddressComponent[] ) {}

    public getValue(): string {
        const order = [
            'postal_town',
            'locality',
            'administrative_area_level_2',
            'administrative_area_level_3',
        ];

        return Utilities.getFirstComponentValueByType( order, this.components );
    }
}
