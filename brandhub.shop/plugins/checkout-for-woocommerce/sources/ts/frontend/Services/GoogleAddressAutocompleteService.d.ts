import FieldValidationRefresher from '../Interfaces/FieldValidationRefresher';
declare class GoogleAddressAutocompleteService {
    private _fieldValidator;
    constructor(fieldValidator: FieldValidationRefresher);
    initAutocomplete(prefix: string, mountId: string, countryRestrictions?: string | string[]): void;
    fillAddress(prefix: string, autocomplete: google.maps.places.Autocomplete, { value: formattedAddress }: HTMLInputElement, userInputValue: string): void;
    updateField(id: string, value: string): void;
    queueStateUpdate(prefix: string, state: string): void;
}
export default GoogleAddressAutocompleteService;
