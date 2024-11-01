import FieldValidationRefresher from '../Interfaces/FieldValidationRefresher';
declare class FetchifyAddressAutocompleteService {
    protected fieldValidationRefresher: FieldValidationRefresher;
    constructor(fieldValidationRefresher: FieldValidationRefresher);
    showAddressFields(prefix: string): void;
    attachFetchify(prefix: string, fetchify: any): void;
    safeFillCountryState(prefix: any, result: any): void;
    fillCountryState(prefix: any, result: any): void;
    getAllowedCountries(): Array<string>;
}
export default FetchifyAddressAutocompleteService;
