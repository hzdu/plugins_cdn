import FieldValidationRefresher from '../Interfaces/FieldValidationRefresher';
declare class ZipAutocompleteService {
    protected static fieldValidationRefresher: FieldValidationRefresher;
    static load(fieldValidationRefresher: FieldValidationRefresher): void;
    /**
     * Attach change events to postcode fields
     */
    static setZipAutocompleteHandlers(): void;
    static autoCompleteCityState(e: any): void;
    protected static getZipData(country: string, zip: string, type: string): void;
}
export default ZipAutocompleteService;
