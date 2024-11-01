import { Iti } from 'intl-tel-input';
declare class InternationalPhoneFieldService {
    constructor();
    /**
     * @param prefix string
     * @return intlTelInput.Plugin|null
     */
    setupPhoneField(prefix: string): Iti | null;
    static getLocale(language: string): any;
}
export default InternationalPhoneFieldService;
