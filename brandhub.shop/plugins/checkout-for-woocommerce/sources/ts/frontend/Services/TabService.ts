import AlertService   from './AlertService';
import DataService    from './DataService';
import LoggingService from './LoggingService';

/**
 *
 */
class TabService {
    /**
     * @type {any}
     * @private
     */
    public static tabContainer: JQuery<any>;

    public static tabsLoaded = false;

    /**
     * @type {any}
     * @private
     */
    private static tabBreadcrumbContainer: JQuery<any>;

    /**
     * @type string
     * @private
     */
    private static _customerInformationTabId = 'cfw-customer-info';

    /**
     * @type string
     * @private
     */
    private static _shippingMethodTabId = 'cfw-shipping-method';

    /**
     * @type string
     * @private
     */
    private static _paymentMethodTabId = 'cfw-payment-method';

    /**
     * @type string
     * @private
     */
    private static _orderReviewTabId = 'cfw-order-review';

    static load(): void {
        TabService.tabContainer = jQuery( '#cfw' );
        TabService.tabBreadcrumbContainer = jQuery( '#cfw-breadcrumb' );

        if ( !DataService.getSetting( 'load_tabs' ) ) {
            return;
        }

        TabService.tabsLoaded = TabService.maybeLoadTabs();
    }

    /**
     * Maybe load the tabs. Returns true if tabs loaded, otherwise returns false
     *
     * @return boolean
     */
    static maybeLoadTabs(): boolean {
        // Don't try to load tabs if tabs don't exist
        if ( !TabService.tabBreadcrumbContainer.length ) {
            // if tabs can't load, make all the tabs visible
            if ( !DataService.getSetting( 'enable_one_page_checkout' ) ) {
                jQuery( '.cfw-panel' ).css( 'opacity', '1' ).css( 'display', 'block' );
            }

            return false;
        }

        try {
            // Initialize tabs
            TabService.tabContainer.easytabs( {
                animate: false,
                defaultTab: 'li.tab.cfw-default-tab',
                tabs: 'ul > li.tab',
            } );

            TabService.tabContainer.on( 'easytabs:after', () => {
                // Remove temporary alerts on successful tab switch
                // TODO: Move to Alert service
                AlertService.removeTemporaryAlerts();
            } );

            // Add tab active class on window load
            jQuery( window ).on( 'load updated_checkout', () => {
                TabService.setActiveTabClass();
            } );

            TabService.setTabChangeListeners();
            TabService.setTabButtonListeners();
        } catch ( e ) {
            LoggingService.logError( e );

            return false;
        }

        return true;
    }

    /**
     * Returns the current and target tab indexes
     *
     * @returns JQuery<HTMLElement>
     */
    static getCurrentTab(): JQuery<HTMLElement> {
        return TabService.tabContainer.find( '.cfw-panel.active' ).first();
    }

    static setTabButtonListeners(): void {
        jQuery( document.body ).on( 'click', '.cfw-tab-link, .cfw-next-tab, .cfw-prev-tab', ( event ) => {
            const tab = jQuery( event.currentTarget ).data( 'tab' );

            if ( tab ) {
                TabService.tabContainer.easytabs( 'select', tab );
            }
        } );
    }

    static setTabChangeListeners(): void {
        /**
         * Some gateways really really want to fire their stuff when visible.
         *
         * This provides a special event for our compat classes to listen to
         */
        jQuery( document.body ).on( 'cfw-after-tab-change', ( event, clicked, target ) => {
            // Only run on the payment tab
            if ( jQuery( target ).attr( 'href' ) === `#${TabService.paymentMethodTabId}` ) {
                // Global event for gateways that need special handling
                jQuery( document.body ).trigger( 'cfw-payment-tab-loaded' );
                LoggingService.logEvent( 'Fired cfw-payment-tab-loaded event.' );
            }
        } );

        TabService.tabContainer.on( 'easytabs:before', ( event, clicked, target ) => {
        // Fire event that we can listen to around the world
            jQuery( document.body ).trigger( 'cfw-before-tab-change', [ event, clicked, target ] );
            LoggingService.logEvent( 'Fired cfw-before-tab-change event.' );
        } );

        TabService.tabContainer.on( 'easytabs:after', ( event, clicked, target ) => {
            // Scroll to top of tab container
            TabService.maybeScrollToTop();

            // Set current tab active class on form
            TabService.setActiveTabClass();

            // Fire event that we can listen to around the world
            jQuery( document.body ).trigger( 'cfw-after-tab-change', [ event, clicked, target ] );
            LoggingService.logEvent( 'Fired cfw-after-tab-change event.' );
        } );
    }

    static maybeScrollToTop(): void {
        const currentScrollTop = document.documentElement.scrollTop;
        const tabContainerTop = TabService.tabContainer.offset().top - 40;

        if ( currentScrollTop > tabContainerTop ) {
            jQuery( 'html, body' ).animate( {
                scrollTop: tabContainerTop,
            }, 300 );
        }
    }

    /**
     * Set active tab class on form
     */
    static setActiveTabClass(): void {
        const { checkoutForm } = DataService;

        // Add a class to checkout form to indicate payment tab is active tab
        // Doesn't work when tab is initialized by hash in URL
        const currentTabId = TabService.getCurrentTab().attr( 'id' );
        const activeClass = `${currentTabId}-active`;

        checkoutForm.removeClass( 'cfw-customer-info-active' ).removeClass( 'cfw-shipping-method-active' ).removeClass( 'cfw-payment-method-active' ).addClass( activeClass );
    }

    /**
     * @param {string} tabId
     */
    static go( tabId ): void {
        if ( !TabService.tabBreadcrumbContainer.length ) {
            return;
        }

        try {
            const movingBack    = !TabService.getCurrentTab().nextAll( `#${tabId}.cfw-panel` ).length; // technically a misnomer

            if ( !movingBack ) {
                const destination = tabId.replace( 'cfw-', '' );
                jQuery( document.body ).trigger( 'cfw_step_changed', destination );
                LoggingService.logEvent( `cfw_step_changed fired. Destination: ${destination}` );
            }

            TabService.tabContainer.easytabs( 'select', tabId );
        } catch ( e ) {
            LoggingService.logError( `Could not select tab: ${e.message}` );
        }
    }

    static get customerInformationTabId(): string {
        return TabService._customerInformationTabId;
    }

    static get shippingMethodTabId(): string {
        return TabService._shippingMethodTabId;
    }

    static get paymentMethodTabId(): string {
        return TabService._paymentMethodTabId;
    }

    static get orderReviewTabId(): string {
        return TabService._orderReviewTabId;
    }
}

export default TabService;
