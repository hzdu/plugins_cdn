import { Slot, SlotFillProvider, withFilters }              from '@wordpress/components';
import { Formik, Form }                                     from 'formik';
import React                                                from 'react';
import cfwConvertOptionsObjectToArray                       from '../../../functions/cfwConvertOptionsObjectToArray';
import SettingsFormContainerPropsInterface                  from '../../../interfaces/SettingsFormContainerPropsInterface';
import SettingsFormPropsPlanInterface                       from '../../../interfaces/SettingsFormPropsPlanInterface';
import AdminPageSection                                     from '../AdminPageSection';
import CheckboxField                                        from '../Fields/CheckboxField';
import CheckboxGroupField                                   from '../Fields/CheckboxGroupField';
import ToggleCheckboxField                                  from '../Fields/ToggleCheckboxField';
import LockedFieldWrapper                                   from '../LockedFieldWrapper';

interface ThankYouSettingsInterface {
    enable_thank_you_page: boolean;
    thank_you_order_statuses: any[];
    enable_map_embed: boolean;
    override_view_order_template: boolean;
}

interface ThankYouFormWooCommerceSettingsInterface {
    thank_you_order_statuses: any;
}
interface ThankYouSettingsFormPropsInterface extends SettingsFormContainerPropsInterface {
    settings: ThankYouSettingsInterface;
    woocommerce_settings: ThankYouFormWooCommerceSettingsInterface;
    plan: SettingsFormPropsPlanInterface;

}

const ThankYouSettingsForm: React.FC<ThankYouSettingsFormPropsInterface> = ( props ) => {
    const { saveSettings, isLoading, searchTerm } = props;

    const AdditionalSettings = withFilters(
        'CheckoutWC.Admin.Settings.Pages.ThankYou',
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
                            title='Thank You'
                            description='Control the Order Received / Thank You endpoint.'
                            content={
                                <>
                                    <LockedFieldWrapper plan={props.plan} slug={'thank-you-page'} locked={props.plan.plan_level < 2} requiredPlans={props.plan.labels.required_list[ 2 ]}>
                                        <ToggleCheckboxField
                                            name="enable_thank_you_page"
                                            label="Enable Thank You Page Template"
                                            description='Enable thank you page / order received template.'
                                            disabled={props.plan.plan_level < 2}
                                            searchTerm={searchTerm}
                                        />

                                        {props.plan.plan_level >= 2 && values.enable_thank_you_page
                                        && (
                                            <>
                                                <CheckboxField
                                                    name="enable_map_embed"
                                                    label="Enable Map Embed"
                                                    description='Enable or disable Google Maps embed on Thank You page. Requires Google API key.'
                                                    searchTerm={searchTerm}
                                                />
                                                <CheckboxField
                                                    name="override_view_order_template"
                                                    label="Enable Thank You Page Template For Viewing Orders in My Account"
                                                    description='When checked, viewing orders in My Account will use the Thank You page template.'
                                                    searchTerm={searchTerm}
                                                />
                                                <CheckboxGroupField
                                                    name='thank_you_order_statuses'
                                                    label='Order Statuses'
                                                    description='Choose which Order Statuses are shown as a progress bar on the Thank You page.'
                                                    options={cfwConvertOptionsObjectToArray( props.woocommerce_settings.thank_you_order_statuses )}
                                                    searchTerm={searchTerm}
                                                />
                                            </>
                                        )
                                        }

                                    </LockedFieldWrapper>

                                    <Slot name="CheckoutWC.Admin.Pages.ThankYou.Options" />
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

export default ThankYouSettingsForm;
