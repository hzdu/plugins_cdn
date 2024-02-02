import intlTelInput   from 'intl-tel-input';
import Main           from '../Main';
import DataService    from './DataService';
import LoggingService from './LoggingService';

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
    setupPhoneField( prefix: string ): intlTelInput.Plugin | null {
        const phoneInput = jQuery( `#${prefix}_phone` );

        if ( phoneInput.length === 0 ) {
            return null;
        }

        const format = DataService.getSetting( 'international_phone_field_standard' );
        const formatMap = {
            E164: 0,
            INTERNATIONAL: 1,
            NATIONAL: 2,
            RFC3966: 3,
        };

        const countryData = window.intlTelInputGlobals.getCountryData();
        const allowedCountries = DataService.getSetting( 'allowed_countries' );
        const shippingCountries = DataService.getSetting( 'shipping_countries' );

        for ( let i = 0; i < countryData.length; i++ ) {
            const country = countryData[ i ];
            const key = country.iso2.toUpperCase();

            if ( key in allowedCountries ) {
                country.name = allowedCountries[ key ];
            }
        }

        const iti = intlTelInput( phoneInput.get( 0 ), {
            utilsScript: `${DataService.getCheckoutParam( 'dist_path' )}/js/utils.js`,
            onlyCountries: Object.keys( prefix === 'shipping' ? shippingCountries : allowedCountries ),
            allowDropdown: DataService.getSetting( 'allow_international_phone_field_country_dropdown' ),
            autoPlaceholder: DataService.getSetting( 'international_phone_field_placeholder_mode' ),
            preferredCountries: DataService.getSetting( 'phone_field_highlighted_countries' ) ?? [],
            formatOnDisplay: false,
        } );

        phoneInput.on( 'countrychange', () => {
            Main.instance.parsleyService.refreshField( phoneInput.get( 0 ) );
        } );

        phoneInput.parents( '.woocommerce-input-wrapper' ).siblings( 'label' ).addClass( 'intl-tel-input-label' );

        const countryInput = jQuery( `#${prefix}_country` );

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

        const val =  countryInput.val();

        try {
            if ( countryInput.length && val !== null && val.toString().length !== 0 ) {
                iti.setCountry( val.toString() );
            } else {
                iti.setCountry( DataService.getSetting( 'base_country' ) );
            }
        } catch {
            LoggingService.logError( `Failed to set country for international phone field: ${countryInput.attr( 'id' )}` );
        }

        jQuery( document.body ).on( 'change', `#${prefix}_phone`, ( e ) => {
            const formattedElement = jQuery( `#${prefix}_phone_formatted` );
            const element = jQuery( e.currentTarget );

            if ( format === 'raw' )  {
                formattedElement.val( element.val() );
                return;
            }

            formattedElement.val( iti.getNumber( formatMap[ format ] ) );
        } );

        phoneInput.trigger( 'change' );

        return iti;
    }
}

export default InternationalPhoneFieldService;
