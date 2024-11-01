import fastDeepEqual                           from 'fast-deep-equal';
import cfwGetWPHooks                           from '../../functions/cfwGetWPHooks';
import DataService                             from './DataService';
import TabService                              from './TabService';
import LoggingService                          from './LoggingService';

class SmartyStreetsAddressValidationService {
    protected userAddress;

    protected suggestedAddress = {};

    protected userHasAcceptedAddress = false;

    protected modaalTrigger;

    protected tabChangeDestinationID = null;

    protected addressFieldNamePrefix: string;

    constructor( addressFieldNamePrefix: string ) {
        this.addressFieldNamePrefix = addressFieldNamePrefix;
        this.run();
    }

    public static isWrongTabContext( target ): boolean {
        const currentTab = TabService.getCurrentTab();
        const destinationTab = jQuery( target );
        const destinationTabIsAfterCurrentTab = currentTab.nextAll( '.cfw-panel' ).filter( `#${destinationTab.attr( 'id' )}` ).length;
        const currentTabIsInformationTab = currentTab.attr( 'id' ) === TabService.customerInformationTabId;

        return !destinationTabIsAfterCurrentTab || !currentTabIsInformationTab;
    }

    public getAddress(): Record<string, unknown> {
        return {
            address_1: jQuery( `[name="${this.addressFieldNamePrefix}address_1"]` ).val(),
            address_2: jQuery( `[name="${this.addressFieldNamePrefix}address_2"]` ).val(),
            city: jQuery( `[name="${this.addressFieldNamePrefix}city"]` ).val(),
            state: jQuery( `[name="${this.addressFieldNamePrefix}state"]` ).val(),
            postcode: jQuery( `[name="${this.addressFieldNamePrefix}postcode"]` ).val(),
            country: jQuery( `[name="${this.addressFieldNamePrefix}country"]` ).val(),
            company: jQuery( `[name="${this.addressFieldNamePrefix}company"]` ).val(),
        };
    }

    public maybeValidateAddress( event, clicked, target ): boolean {
        if ( TabService.tabsLoaded && SmartyStreetsAddressValidationService.isWrongTabContext( target ) ) {
            return true;
        }

        if ( TabService.tabsLoaded ) {
            this.tabChangeDestinationID = target[ 0 ].id;
        }

        if ( cfwGetWPHooks().applyFilters( 'cfw_js_suppress_smarty_address_validation', false ) ) {
            return true;
        }

        const address = this.getAddress();

        const addressHasNotChanged = fastDeepEqual( this.userAddress, address );

        if ( this.userHasAcceptedAddress && addressHasNotChanged ) { // user confirmed address selected
            return true;
        }

        this.userHasAcceptedAddress = false;

        let data = null;

        const setData = ( val ) => { data = val; };

        const handleError = ( xhr: any, textStatus: string, errorThrown: string ) => {
            LoggingService.logError( `SmartyStreets Address Validation Error: ${errorThrown} (${textStatus})` );
        };

        jQuery.ajax( {
            type: 'POST',
            url: DataService.getCheckoutParam( 'wc_ajax_url' ).toString().replace( '%%endpoint%%', 'cfw_smartystreets_address_validation' ),
            data: { address },
            success: setData,
            error: handleError,
            dataType: 'json',
            async: false,
        } );

        const response = data;

        if ( response.code === 1 ) {
            return true;
        }

        jQuery( document.body ).trigger( 'cfw_smarty_streets_modal_open', [ response.form ] );

        this.suggestedAddress = response.components;
        this.userAddress = address;

        event.stopImmediatePropagation();
        return false;
    }

    run(): void {
        /**
         * Tab Change Intercept
         *
         * Only fires when the current tab is the information tab
         * and the destination tab is to the right
         */
        if ( TabService.tabsLoaded ) {
            TabService.tabContainer.on( 'easytabs:before', this.maybeValidateAddress.bind( this ) );
        } else {
            DataService.checkoutForm.on( 'checkout_place_order', this.maybeValidateAddress.bind( this ) );
        }

        const closeItUp = ( e: { preventDefault: () => void; } ) => {
            e.preventDefault();

            this.userHasAcceptedAddress = true;

            jQuery( document.body ).trigger( 'cfw_smarty_streets_modal_close' );

            if ( TabService.tabsLoaded ) {
                TabService.tabContainer.easytabs( 'select', `#${this.tabChangeDestinationID}` );
            } else {
                DataService.checkoutForm.submit();
            }
            this.tabChangeDestinationID = null;
        };

        const handleSuggestedAddressButtonClick = ( e: { preventDefault: () => void; } ) => {
            e.preventDefault();

            if ( !this.suggestedAddress ) {
                jQuery( document.body ).trigger( 'cfw_smarty_streets_modal_close' );
            }

            // Replace address with suggested address
            // TODO: Don't iterate over every field smarty streets sends back, instead look for the ones we want (address_1, address_2, city, state, postcode, country, etc)
            Object.keys( this.suggestedAddress ).forEach( ( key: any ) => {
                jQuery( `[name="${this.addressFieldNamePrefix}${key}"]` ).val(  this.suggestedAddress[ key ] ).trigger( 'change' );
            } );

            // Set the comparison data to the actual field values to prevent false positives
            this.userAddress = this.getAddress();

            closeItUp( e );
        };

        jQuery( document.body ).on( 'click', '.cfw-smartystreets-suggested-address-button', handleSuggestedAddressButtonClick );
        jQuery( document.body ).on( 'click', '.cfw-smartystreets-user-address-button', closeItUp );
    }
}

export default SmartyStreetsAddressValidationService;
