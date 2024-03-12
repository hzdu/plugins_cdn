import { Slot, SlotFillProvider, withFilters }              from '@wordpress/components';
import { Formik, Form }                                     from 'formik';
import React                                                from 'react';
import SettingsFormContainerPropsInterface                  from '../../../interfaces/SettingsFormContainerPropsInterface';
import SettingsFormPropsPlanInterface                       from '../../../interfaces/SettingsFormPropsPlanInterface';
import AdminPageSection                                     from '../AdminPageSection';
import NumberField                                          from '../Fields/NumberField';
import UpgradeRequiredNotice                                from '../UpgradeRequiredNotice';
import ToggleCheckboxField                                  from '../Fields/ToggleCheckboxField';

interface OrderBumpsSettingsInterface {
    enable_order_bumps: boolean;
    max_bumps: number;
    max_after_checkout_bumps: number;
}

interface OrderBumpsSettingsFormPropsInterface extends SettingsFormContainerPropsInterface {
    settings: OrderBumpsSettingsInterface;
    plan: SettingsFormPropsPlanInterface;
}

const OrderBumpsSettingsForm: React.FC<OrderBumpsSettingsFormPropsInterface> = ( props ) => {
    const { saveSettings, isLoading, searchTerm } = props;

    const AdditionalSettings = withFilters(
        'CheckoutWC.Admin.Settings.Pages.OrderBumps',
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
                            title='Order Bumps'
                            description='Configure Order Bump settings.'
                            content={
                                <>
                                    <ToggleCheckboxField
                                        name="enable_order_bumps"
                                        label="Enable Order Bumps"
                                        description='Allow Order Bumps to be displayed.'
                                        disabled={!props.plan.has_premium_plan}
                                        searchTerm={searchTerm}
                                    />
                                    {values.enable_order_bumps && props.plan.has_premium_plan
                                        && (
                                            <>
                                                <NumberField
                                                    name='max_bumps'
                                                    label='Maximum Order Bumps'
                                                    description='The maximum number of bumps that can be displayed per output location. Use -1 for unlimited.'
                                                    searchTerm={searchTerm}
                                                />
                                                <NumberField
                                                    name='max_after_checkout_bumps'
                                                    label='Maximum After Checkout Submit Modal Bumps'
                                                    description='The maximum number of modal bumps that can be displayed after submitting checkout. Use -1 for unlimited.'
                                                    searchTerm={searchTerm}
                                                />
                                            </>
                                        )
                                    }

                                    {!props.plan.has_premium_plan && ( <UpgradeRequiredNotice requiredPlans={props.plan.premium_plans} /> ) }

                                    <Slot name="CheckoutWC.Admin.Pages.OrderBumps.Options" />
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

export default OrderBumpsSettingsForm;
