import fastDeepEqual                        from 'fast-deep-equal';
import Main                                 from '../Main';
import DataService                          from './DataService';
import TabService                           from './TabService';

class SmartyStreetsAddressValidationService {
    protected userAddress;

    protected suggestedAddress = {};

    protected userHasAcceptedAddress = false;

    protected modaalTrigger;

    protected tabChangeDestinationID = null;

    protected addressFieldNamePrefix: string;

    constructor( addressFieldNamePrefix: string ) {
        this.addressFieldNamePrefix = addressFieldNamePrefix;
        this.setupModaal();
        this.run();
    }

    public isWrongTabContext( target ): boolean {
        const currentTab = Main.instance.tabService.getCurrentTab();
        const destinationTab = jQuery( target );
        const destinationTabIsAfterCurrentTab = currentTab.nextAll( '.cfw-panel' ).filter( `#${destinationTab.attr( 'id' )}` ).length;
        const currentTabIsInformationTab = currentTab.attr( 'id' ) === TabService.customerInformationTabId;

        return !destinationTabIsAfterCurrentTab || !currentTabIsInformationTab;
    }

    public setupModaal(): void {
        this.modaalTrigger = jQuery( '.cfw-smartystreets-modal-trigger' );

        this.modaalTrigger.modaal( { width: 600, custom_class: 'checkoutwc' } );
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
        if ( Main.instance.tabsLoaded && this.isWrongTabContext( target ) ) {
            return true;
        }

        if ( Main.instance.tabsLoaded ) {
            this.tabChangeDestinationID = target[ 0 ].id;
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
            // eslint-disable-next-line no-console
            console.log( `SmartyStreets Address Validation Error: ${errorThrown} (${textStatus})` );
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

        if ( response.code === 2 ) {
            jQuery( '.cfw-smarty-matched' ).show();
            jQuery( '.cfw-smarty-unmatched' ).hide();
        } else {
            jQuery( '.cfw-smarty-matched' ).hide();
            jQuery( '.cfw-smarty-unmatched' ).show();
        }

        jQuery( '.cfw-smartystreets-suggested-address-button' ).text( response.suggested_button_label );
        jQuery( '.cfw-smartystreets-user-address-button' ).text( response.user_button_label );

        jQuery( '.cfw-smartystreets-user-address' ).html( response.original );
        jQuery( '.cfw-smartystreets-suggested-address' ).html( response.address );

        this.modaalTrigger.modaal( 'open' );

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
        if ( Main.instance.tabsLoaded ) {
            Main.instance.tabService.tabContainer.bind( 'easytabs:before', this.maybeValidateAddress.bind( this ) );
        } else {
            DataService.checkoutForm.on( 'checkout_place_order', this.maybeValidateAddress.bind( this ) );
        }

        const closeItUp = () => {
            this.userHasAcceptedAddress = true;

            this.modaalTrigger.modaal( 'close' );

            if ( Main.instance.tabsLoaded ) {
                Main.instance.tabService.tabContainer.easytabs( 'select', `#${this.tabChangeDestinationID}` );
            } else {
                DataService.checkoutForm.submit();
            }
            this.tabChangeDestinationID = null;
        };

        const handleSuggestedAddressButtonClick = ( event ) => {
            if ( !this.suggestedAddress ) {
                this.modaalTrigger.modaal( 'close' );
            }

            // Replace address with suggested address
            // TODO: Don't iterate over every field smarty streets sends back, instead look for the ones we want (address_1, address_2, city, state, postcode, country, etc)
            Object.keys( this.suggestedAddress ).forEach( ( key: any ) => {
                jQuery( `[name="${this.addressFieldNamePrefix}${key}"]` ).val(  this.suggestedAddress[ key ] ).trigger( 'change' );
            } );

            // Set the comparison data to the actual field values to prevent false positives
            this.userAddress = this.getAddress();

            closeItUp();
        };

        jQuery( document.body ).on( 'click', '.cfw-smartystreets-suggested-address-button', handleSuggestedAddressButtonClick );
        jQuery( document.body ).on( 'click', '.cfw-smartystreets-user-address-button', closeItUp );
    }
}

export default SmartyStreetsAddressValidationService;
