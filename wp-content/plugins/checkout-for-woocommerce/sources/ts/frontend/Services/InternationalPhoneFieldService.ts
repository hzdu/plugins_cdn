import intlTelInput, { Iti }                                                                                                                  from 'intl-tel-input';
import { ar, bg, bn, bs, ca, cs, de, el, en, es, fa, fi, fr, hi, hr, hu, id, it, ja, ko, mr, nl, pl, pt, ro, ru, sk, sv, te, th, tr, ur, zh } from 'intl-tel-input/i18n';
import DataService                                                                                                                            from './DataService';
import LoggingService                                                                                                                         from './LoggingService';
import ParsleyService                                                                                                                         from './ParsleyService';

class InternationalPhoneFieldService {
    constructor() {
        if ( DataService.getSetting( 'enable_international_phone_field' ) ) {
            // Setup phone fields and store reference to the instance
            DataService.setRuntimeParameter( 'shippingIntlTelInput', this.setupPhoneField( 'shipping' ) );
            DataService.setRuntimeParameter( 'billingIntlTelInput', this.setupPhoneField( 'billing' ) );

            // Custom Parsley validator
            ( <any>window ).Parsley.addValidator( 'validInternationalPhone', {
                validateString( value, type ) {
                    if ( type === 'shipping' ) {
                        return DataService.getRuntimeParameter( 'shippingIntlTelInput' ).isValidNumber();
                    }
                    return DataService.getRuntimeParameter( 'billingIntlTelInput' ).isValidNumber();
                },
                messages: {
                    en: DataService.getMessage( 'invalid_phone_message' ),
                },
            } );
        }
    }

    /**
     * @param prefix string
     * @return intlTelInput.Plugin|null
     */
    setupPhoneField( prefix: string ): Iti | null {
        const phone = jQuery( `#${prefix}_phone` );

        if ( phone.length === 0 ) {
            return null;
        }

        const phoneInput = phone.get( 0 ) as HTMLInputElement;

        const format = DataService.getSetting( 'international_phone_field_standard' );
        const formatMap = {
            E164: 0,
            INTERNATIONAL: 1,
            NATIONAL: 2,
            RFC3966: 3,
        };

        const countryData = intlTelInput.getCountryData();
        const allowedCountries = DataService.getSetting( 'allowed_countries' );
        const shippingCountries = DataService.getSetting( 'shipping_countries' );

        for ( let i = 0; i < countryData.length; i++ ) {
            const country = countryData[ i ];
            const key = country.iso2.toUpperCase();

            if ( key in allowedCountries ) {
                country.name = allowedCountries[ key ];
            }
        }

        const countryInput = jQuery( `#${prefix}_country` );
        const countryVal = countryInput.val();

        const iti = intlTelInput( phoneInput, {
            utilsScript: `${DataService.getCheckoutParam( 'dist_path' )}/js/utils.js`,
            onlyCountries: Object.keys( prefix === 'shipping' ? shippingCountries : allowedCountries ),
            allowDropdown: DataService.getSetting( 'allow_international_phone_field_country_dropdown' ),
            autoPlaceholder: DataService.getSetting( 'international_phone_field_placeholder_mode' ),
            countryOrder: DataService.getSetting( 'phone_field_highlighted_countries' ) ?? [],
            nationalMode: true,
            formatOnDisplay: true,
            initialCountry: countryInput.length && countryVal !== null && countryVal.toString().length !== 0 ? countryVal : DataService.getSetting( 'base_country' ),
            i18n: InternationalPhoneFieldService.getLocale( DataService.getSetting( 'locale_prefix' ) ),
        } );

        phoneInput.addEventListener( 'countrychange', () => {
            ParsleyService.instance.refreshField( phoneInput );
        } );

        phone.parents( '.woocommerce-input-wrapper' ).siblings( 'label' ).addClass( 'intl-tel-input-label' );

        jQuery( document.body ).on( 'change', `#${prefix}_country`, ( e ) => {
            const element = jQuery( e.currentTarget );
            const val =  element.val();

            if ( element.length && val !== null && val.toString().length !== 0 ) {
                try {
                    iti.setCountry( val.toString() );
                } catch {
                    LoggingService.logError( `Failed to set country for international phone field: ${countryInput.attr( 'id' )}` );
                }
            }
        } );

        jQuery( document.body ).on( 'change', `#${prefix}_phone`, ( e ) => {
            const formattedElement = jQuery( `#${prefix}_phone_formatted` );
            const element = jQuery( e.currentTarget );

            if ( format === 'raw' )  {
                formattedElement.val( element.val() );
                return;
            }

            formattedElement.val( iti.getNumber( formatMap[ format ] ) );
        } );

        iti.promise.then( () => {
            if ( !phone.val().toString().length ) {
                return;
            }

            phone.trigger( 'change' );
        } );

        return iti;
    }

    static getLocale( language: string ): any {
        const locales = {
            ar, bg, bn, bs, ca, cs, de, el, en, es, fa, fi, fr, hi, hr, hu, id, it, ja, ko, mr, nl, pl, pt, ro, ru, sk, sv, te, th, tr, ur, zh,
        };

        return locales[ language ] || en; // Return the selected language or fall back to English if not found
    }
}

export default InternationalPhoneFieldService;
