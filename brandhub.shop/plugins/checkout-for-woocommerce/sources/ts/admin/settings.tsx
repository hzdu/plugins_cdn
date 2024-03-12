import React                                                                      from 'react';
import ACRSettingsForm                                                            from './Components/Forms/ACRSettingsForm';
import AdvancedScriptsSettingsForm                                                from './Components/Forms/AdvancedScriptsSettingsForm';
import AdvancedSettingsForm                                                       from './Components/Forms/AdvancedSettingsForm';
import WooCommercePagesGlobalOptionsSettingsForm                                  from './Components/Forms/WooCommercePagesGlobalOptionsSettingsForm';
import CheckoutSettingsForm                                                       from './Components/Forms/CheckoutSettingsForm';
import IntegrationsSettingsForm                                                   from './Components/Forms/IntegrationSettingsForm';
import LocalPickupSettingsForm                                                    from './Components/Forms/LocalPickupSettingsForm';
import OrderBumpsSettingsForm                                                     from './Components/Forms/OrderBumpSettingsForm';
import SideCartSettingsForm                                                       from './Components/Forms/SideCartSettingsForm';
import ThankYouSettingsForm                                                       from './Components/Forms/ThankYouSettingsForm';
import TrustBadgeSettingsForm                                                     from './Components/Forms/TrustBadgeSettingsForm';
import SettingsFormContainer                                                      from './Components/SettingsFormContainer';
import AppearanceDesignSettingsForm                                               from './Components/Forms/AppearanceDesignSettingsForm';
import cfwRenderComponentIfElementExists                                          from '../functions/cfwRenderComponentIfElementExists';
import ExpressCheckoutSettingsForm                                                from './Components/Forms/ExpressCheckoutSettingsForm';
import DeferredNotices                                                            from './Components/DeferredNotices';
import ACRReport                                                                  from './Components/acr/dashboard';
import ACRCartsTable                                                              from './Components/acr/carts';

// // Somewhere in your app, under SlotFillProvider
// addFilter(
//     'CheckoutWC.Admin.Settings.Pages.Checkout',
//     'checkoutwc/settings',
//     OrderReviewStep,
// );

declare let cfwAdminPagesData: any;
// eslint-disable-next-line camelcase
declare let objectiv_cfw_admin: any;

const componentMappings = [
    {
        id: 'cfw-new-trust-badge-settings-page',
        component: (
            <SettingsFormContainer>
                <TrustBadgeSettingsForm {...cfwAdminPagesData} />
            </SettingsFormContainer>
        ),
    },
    {
        id: 'cfw-admin-pages-checkout',
        component: (
            <SettingsFormContainer>
                <CheckoutSettingsForm {...cfwAdminPagesData}/>
            </SettingsFormContainer>
        ),
    },
    {
        id: 'cfw-admin-pages-thank-you',
        component: (
            <SettingsFormContainer>
                <ThankYouSettingsForm {...cfwAdminPagesData}/>
            </SettingsFormContainer>
        ),
    },
    {
        id: 'cfw-admin-pages-global-options',
        component: (
            <SettingsFormContainer>
                <WooCommercePagesGlobalOptionsSettingsForm {...cfwAdminPagesData}/>
            </SettingsFormContainer>
        ),
    },
    {
        id: 'cfw-admin-pages-local-pickup',
        component: (
            <SettingsFormContainer>
                <LocalPickupSettingsForm {...cfwAdminPagesData}/>
            </SettingsFormContainer>
        ),
    },
    {
        id: 'cfw-admin-pages-side-cart',
        component: (
            <SettingsFormContainer>
                <SideCartSettingsForm {...cfwAdminPagesData}/>
            </SettingsFormContainer>
        ),
    },
    {
        id: 'cfw-admin-pages-order-bumps',
        component: (
            <SettingsFormContainer>
                <OrderBumpsSettingsForm {...cfwAdminPagesData}/>
            </SettingsFormContainer>
        ),
    },
    {
        id: 'cfw-admin-pages-acr-settings',
        component: (
            <SettingsFormContainer>
                <ACRSettingsForm {...cfwAdminPagesData}/>
            </SettingsFormContainer>
        ),
    },
    {
        id: 'cfw-admin-pages-integrations',
        component: (
            <SettingsFormContainer>
                <IntegrationsSettingsForm {...cfwAdminPagesData}/>
            </SettingsFormContainer>
        ),
    },
    {
        id: 'cfw-admin-pages-advanced-options',
        component: (
            <SettingsFormContainer>
                <AdvancedSettingsForm {...cfwAdminPagesData}/>
            </SettingsFormContainer>
        ),
    },
    {
        id: 'cfw-admin-pages-advanced-scripts',
        component: (
            <SettingsFormContainer>
                <AdvancedScriptsSettingsForm {...cfwAdminPagesData}/>
            </SettingsFormContainer>
        ),
    },
    {
        id: 'cfw-admin-pages-appearance-design',
        component: (
            <SettingsFormContainer>
                <AppearanceDesignSettingsForm {...cfwAdminPagesData}/>
            </SettingsFormContainer>
        ),
    },
    {
        id: 'cfw-admin-pages-express-checkout',
        component: (
            <SettingsFormContainer>
                <ExpressCheckoutSettingsForm {...cfwAdminPagesData}/>
            </SettingsFormContainer>
        ),
    },
    {
        id: 'cfw-custom-admin-notices',
        component: (
            <DeferredNotices notices={objectiv_cfw_admin.deferred_notices} />
        ),
    },
    {
        id: 'cfw-acr-reports',
        component: (
            <ACRReport />
        ),
    },
    {
        id: 'cfw-acr-carts',
        component: (
            <ACRCartsTable />
        ),
    },
];

componentMappings.forEach( ( { id, component } ) => {
    cfwRenderComponentIfElementExists( id, component );
} );
