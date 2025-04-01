import { Slot, SlotFillProvider, withFilters }              from '@wordpress/components';
import { Formik, Form }                                     from 'formik';
import React                                                from 'react';
import cfwConvertOptionsObjectToArray                       from '../../../functions/cfwConvertOptionsObjectToArray';
import SettingsFormContainerPropsInterface                  from '../../../interfaces/SettingsFormContainerPropsInterface';
import SettingsFormPropsPlanInterface                       from '../../../interfaces/SettingsFormPropsPlanInterface';
import AdminPageSection                                     from '../AdminPageSection';
import CheckboxGroupField                                   from '../Fields/CheckboxGroupField';
import NumberField                                          from '../Fields/NumberField';
import TextField                                            from '../Fields/TextField';
import SecondaryButton                                      from '../SecondaryButton';
import ToggleCheckboxField                                  from '../Fields/ToggleCheckboxField';
import LockedFieldWrapper                                   from '../LockedFieldWrapper';

interface ACRSettingsInterface {
    enable_acr: boolean;
    acr_abandoned_time: number;
    acr_from_name: string;
    acr_from_address: string;
    acr_reply_to_address: string;
    acr_recovered_order_statuses: any[];
    acr_excluded_roles: any[];
    acr_simulate_only: boolean;
}

interface ACRFormWooCommerceSettingsInterface {
    order_statuses: any;
    roles: any;
}

interface ACRFormParamsInterface {
    pre_content: string;
    post_content: string;
    clear_cart_data_url: string;
}

interface ACRSettingsFormPropsInterface extends SettingsFormContainerPropsInterface {
    settings: ACRSettingsInterface;
    woocommerce_settings: ACRFormWooCommerceSettingsInterface;
    plan: SettingsFormPropsPlanInterface;
    params: ACRFormParamsInterface;
}

const ACRSettingsForm: React.FC<ACRSettingsFormPropsInterface> = ( props ) => {
    const { saveSettings, isLoading, searchTerm } = props;

    const AdditionalSettings = withFilters(
        'CheckoutWC.Admin.Settings.Pages.ACR',
    )( () => <></> );

    return (
        <SlotFillProvider>
            <AdditionalSettings />
            <Formik
                initialValues={{
                    ...props.settings,
                }}
                enableReinitialize={true}
                onSubmit={async ( values ) => {
                    await saveSettings( values );
                }}
            >
                {( { values } ) => (
                    <Form className={'space-y-6 transition-all'} style={{ filter: isLoading ? 'blur(2px)' : 'none' }}>
                        <AdminPageSection
                            title='Abandoned Cart Recovery'
                            description='Configure Abandoned Cart Recovery settings.'
                            content={
                                <>
                                    <LockedFieldWrapper plan={props.plan} slug={'order-review-step-one-page-checkout'} locked={props.plan.plan_level < 2} requiredPlans={props.plan.labels.required_list[ 2 ]}>
                                        <ToggleCheckboxField
                                            name="enable_acr"
                                            label="Enable Abandoned Cart Tracking"
                                            description='Enable Abandoned Cart Recovery feature.'
                                            disabled={props.plan.plan_level < 2}
                                            searchTerm={searchTerm}
                                        />

                                        {props.plan.plan_level >= 2 && values.enable_acr
                                            && (
                                                <NumberField
                                                    name='acr_abandoned_time'
                                                    label='Cart Is Abandoned After X Minutes'
                                                    description='The number of minutes after which a cart is considered abandoned.'
                                                    searchTerm={searchTerm}
                                                />
                                            )
                                        }
                                    </LockedFieldWrapper>

                                    <Slot name="CheckoutWC.Admin.Pages.ACR.Options" />
                                </>
                            }
                            post_content={props.params.post_content}
                        />

                        {props.plan.plan_level >= 2 && values.enable_acr
                            && (
                                <>
                                    <AdminPageSection
                                        title='Email Sending'
                                        description='Configure email sending options.'
                                        content={
                                            <>
                                                <ToggleCheckboxField
                                                    name="acr_simulate_only"
                                                    label="Disable Email Sending"
                                                    description='Do not actually send any emails but allow carts to be tracked even if there are no emails configured.'
                                                    searchTerm={searchTerm}
                                                />

                                                <TextField
                                                    name='acr_from_name'
                                                    label='From Name'
                                                    description='The name you wish Abandoned Cart Recovery emails to be sent from.'
                                                    searchTerm={searchTerm}
                                                />
                                                <TextField
                                                    name='acr_from_address'
                                                    label='From Address'
                                                    description='The email address you wish Abandoned Cart Recovery emails to be sent from.'
                                                    searchTerm={searchTerm}
                                                />
                                                <TextField
                                                    name='acr_reply_to_address'
                                                    label='Reply-To Address'
                                                    description='The email address you wish Abandoned Cart Recovery emails replies to be sent to.'
                                                    searchTerm={searchTerm}
                                                />

                                                <Slot name="CheckoutWC.Admin.Pages.ACR.EmailSending" />
                                            </>
                                        }
                                    />

                                    <AdminPageSection
                                        title='Advanced Options'
                                        description='Configure advanced options.'
                                        content={
                                            <>
                                                <CheckboxGroupField
                                                    name="acr_recovered_order_statuses"
                                                    label="Cart Recovered Order Statuses"
                                                    description='Choose which Order Statuses indicate a successful order.'
                                                    options={cfwConvertOptionsObjectToArray( props.woocommerce_settings.order_statuses )}
                                                    searchTerm={searchTerm}
                                                />
                                                <CheckboxGroupField
                                                    name="acr_excluded_roles"
                                                    label="Exclude From Abandoned Cart Recovery By Role"
                                                    description='Check any user role that should be excluded from abandoned cart emails.'
                                                    options={cfwConvertOptionsObjectToArray( props.woocommerce_settings.roles )}
                                                    searchTerm={searchTerm}
                                                />

                                                <Slot name="CheckoutWC.Admin.Pages.ACR.AdvancedOptions" />
                                            </>
                                        }
                                    />

                                    <AdminPageSection
                                        title='Danger Zone'
                                        description='Clear your cart data.'
                                        content={
                                            <>
                                                <SecondaryButton
                                                    url={props.params.clear_cart_data_url}
                                                    buttonText='Delete All Tracked Carts'
                                                    onClick={( e ) => {
                                                    // eslint-disable-next-line no-alert
                                                        if ( !window.confirm( 'Are you sure you want to delete all tracked carts?' ) ) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                />

                                                <p>Note: This resets ALL abandoned cart recovery statistics!</p>

                                                <Slot name="CheckoutWC.Admin.Pages.ACR.DangerZone" />
                                            </>
                                        }
                                    />
                                </>
                            )
                        }

                        <button className={'cfw_admin_page_submit hidden'} type="submit">Submit</button>
                    </Form>
                )}
            </Formik>
        </SlotFillProvider>
    );
};

export default ACRSettingsForm;
