import { Slot, SlotFillProvider, withFilters }              from '@wordpress/components';
import { Formik, Form }                                     from 'formik';
import React                                                from 'react';
import cfwConvertOptionsObjectToArray                       from '../../../functions/cfwConvertOptionsObjectToArray';
import SettingsFormContainerPropsInterface                  from '../../../interfaces/SettingsFormContainerPropsInterface';
import SettingsFormPropsPlanInterface                       from '../../../interfaces/SettingsFormPropsPlanInterface';
import AdminPageSection                                     from '../AdminPageSection';
import CheckboxField                                        from '../Fields/CheckboxField';
import CheckboxGroupField                                   from '../Fields/CheckboxGroupField';
import TextField                                            from '../Fields/TextField';
import SecondaryButton                                      from '../SecondaryButton';
import ToggleCheckboxField                                  from '../Fields/ToggleCheckboxField';
import MediumAlert                                          from '../MediumAlert';
import LockedFieldWrapper                                   from '../LockedFieldWrapper';

interface LocalPickupSettingsInterface {
    enable_pickup: boolean;
    enable_pickup_ship_option: boolean;
    pickup_ship_option_label: string;
    pickup_option_label: string;
    pickup_methods: any[];
    pickup_shipping_method_other_label: string;
    enable_pickup_shipping_method_other_regex: boolean;
    enable_pickup_method_step: boolean;
    hide_pickup_methods: boolean;
}

interface LocalPickupFormWooCommerceSettingsInterface {
    shipping_methods: any;
}
interface LocalPickupSettingsFormPropsInterface extends SettingsFormContainerPropsInterface {
    settings: LocalPickupSettingsInterface;
    woocommerce_settings: LocalPickupFormWooCommerceSettingsInterface;
    plan: SettingsFormPropsPlanInterface;
    params: any;

}

const LocalPickupSettingsForm: React.FC<LocalPickupSettingsFormPropsInterface> = ( props ) => {
    const { saveSettings, isLoading, searchTerm } = props;

    const AdditionalSettings = withFilters(
        'CheckoutWC.Admin.Settings.Pages.LocalPickup',
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
                            title='Local Pickup'
                            description='Control local pickup options.'
                            content={
                                <>
                                    <LockedFieldWrapper plan={props.plan} slug={'order-review-step-one-page-checkout'} locked={props.plan.plan_level < 2} requiredPlans={props.plan.labels.required_list[ 2 ]}>
                                        <ToggleCheckboxField
                                            name="enable_pickup"
                                            label="Enable Local Pickup"
                                            description='Provide customer with the option to choose their delivery method. Choosing pickup bypasses the shipping address.'
                                            disabled={props.plan.plan_level < 2}
                                            searchTerm={searchTerm}
                                        />
                                    </LockedFieldWrapper>

                                    {props.plan.plan_level >= 2 && values.enable_pickup
                                        && (
                                            <>
                                                <CheckboxField
                                                    name='enable_pickup_ship_option'
                                                    label='Enable Shipping Option'
                                                    description='If you only offer pickup, uncheck this to hide the shipping option.'
                                                    searchTerm={searchTerm}
                                                />

                                                <TextField
                                                    name="pickup_ship_option_label"
                                                    label="Shipping Option Label"
                                                    description='If left blank, this default will be used: Ship'
                                                    searchTerm={searchTerm}
                                                />

                                                <TextField
                                                    name="pickup_option_label"
                                                    label="Local Pickup Option Label"
                                                    description='If left blank, this default will be used: Pick up'
                                                    searchTerm={searchTerm}
                                                />

                                                <CheckboxField
                                                    name='enable_pickup_method_step'
                                                    label='Enable Pickup Step'
                                                    description='When Pickup is selected, show the shipping method step. Can be useful when integrating with plugins that allow customers to choose a pickup time slot, etc.'
                                                    searchTerm={searchTerm}
                                                />

                                                <CheckboxField
                                                    name='hide_pickup_methods'
                                                    label='Hide Pickup Methods'
                                                    description='On the pickup step, hide the actual pickup methods. If you need the pickup step and only have one pickup method, you should use this option.'
                                                    searchTerm={searchTerm}
                                                />

                                                <CheckboxGroupField
                                                    name="pickup_methods"
                                                    label="Local Pickup Shipping Methods"
                                                    description='Choose which shipping methods are local pickup options. Only these options will be shown when Pickup is selected. These options will be hidden if Delivery is selected.'
                                                    options={cfwConvertOptionsObjectToArray( props.woocommerce_settings.shipping_methods )}
                                                    searchTerm={searchTerm}
                                                />

                                                {values.pickup_methods.length > 0 && (
                                                    <MediumAlert
                                                        description={
                                                            'You probably do not want to select any pickup methods here. If you do not select any '
                                                            + 'Local Pickup Shipping Methods, we will add an ad-hoc local pickup shipping method in each zone for you. '
                                                            + 'If you would prefer to manage this yourself, you can select the methods you want to use here. '
                                                            + '<h3 class="mt-3 mb-2 font-bold">Reasons You Might Want To Specify Your Own Pickup Methods:</h3> '
                                                            + '<ul class="list-disc list-outside">'
                                                            + '<li>You are charging for local pickup.</li> '
                                                            + '<li>You want to use a custom local pickup method name.</li> '
                                                            + '<li>You have multiple local pickup options. (Not to be confused with locations. You should not use multiple local pickup methods for locations.)</li> '
                                                            + '</ul>'
                                                        }
                                                    />
                                                )}

                                                {values.pickup_methods.includes( 'other' )
                                                && (
                                                    <>
                                                        <TextField
                                                            name="pickup_shipping_method_other_label"
                                                            label="Other Shipping Method"
                                                            description='Enter the name of your local pickup shipping method. If you have multiple options, or the name varies, check the box below to use regular expressions.'
                                                            searchTerm={searchTerm}
                                                            nested={true}
                                                        />
                                                        <CheckboxField
                                                            name="enable_pickup_shipping_method_other_regex"
                                                            label="Enable Regex"
                                                            description='Match local shipping method name with regex.'
                                                            searchTerm={searchTerm}
                                                            nested={true}
                                                        />
                                                    </>
                                                )
                                                }

                                                <SecondaryButton buttonText={'Edit Pickup Locations'} url={props.params.pickup_locations_edit_screen_url} />

                                                <Slot name="CheckoutWC.Admin.Pages.LocalPickup.Options" />
                                            </>
                                        )
                                    }
                                </>
                            }
                        />
                        <button className={'cfw_admin_page_submit hidden'} type="submit">Submit</button>
                    </Form>
                )}
            </Formik>
        </SlotFillProvider>
    );
};

export default LocalPickupSettingsForm;
