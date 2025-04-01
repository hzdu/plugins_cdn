import { Slot, SlotFillProvider, withFilters }              from '@wordpress/components';
import { Formik, Form }                                     from 'formik';
import React                                                from 'react';
import SettingsFormContainerPropsInterface                  from '../../../interfaces/SettingsFormContainerPropsInterface';
import SettingsFormPropsPlanInterface                       from '../../../interfaces/SettingsFormPropsPlanInterface';
import AdminPageSection                                     from '../AdminPageSection';
import CheckboxField                                        from '../Fields/CheckboxField';
import RadioGroupField                                      from '../Fields/RadioGroupField';
import StorePolicyRepeater                                  from '../StorePolicyRepeater';
import LockedFieldWrapper                                   from '../LockedFieldWrapper';

interface GlobalOptionsFormSettingsInterface {
    show_cart_item_discount: boolean;
    cart_item_link: string;
    cart_item_link_target_new_window: boolean;
    cart_item_data_display: string;
    store_policies: any[];
}

interface GlobalOptionsSettingsFormPropsInterface extends SettingsFormContainerPropsInterface {
    settings: GlobalOptionsFormSettingsInterface;
    plan: SettingsFormPropsPlanInterface;
}

const WooCommercePagesGlobalOptionsSettingsForm: React.FC<GlobalOptionsSettingsFormPropsInterface> = ( props ) => {
    const { saveSettings, isLoading, searchTerm } = props;

    const AdditionalSettings = withFilters(
        'CheckoutWC.Admin.Settings.Pages.GlobalOptions',
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
                            title='Cart Summary'
                            description='Configure the Cart Summary on the checkout page.'
                            content={
                                <>
                                    <CheckboxField
                                        name="show_cart_item_discount"
                                        label="Enable Sale Prices"
                                        description='Enable sale price under on cart item labels at checkout. Example: <s>$10.00</s> $5.00'
                                        searchTerm={searchTerm}
                                    />

                                    <RadioGroupField
                                        name={'cart_item_link'}
                                        label={'Cart Item Links'}
                                        description={'Choose whether or not cart items link to the single product page.'}
                                        options={[
                                            {
                                                value: 'disabled',
                                                label: 'Disabled (Recommended)',
                                                description: 'Do not link cart items to single product page. (Recommended)',
                                            },
                                            {
                                                value: 'enabled',
                                                label: 'Enabled',
                                                description: 'Link each cart item to product page.',
                                            },
                                        ]}
                                        searchTerm={searchTerm}
                                    />

                                    {values.cart_item_link === 'enabled' && (
                                        <CheckboxField
                                            name="cart_item_link_target_new_window"
                                            label="Open in New Window"
                                            description='Open cart item links in a new window.'
                                            searchTerm={searchTerm}
                                        />
                                    )}

                                    <RadioGroupField
                                        name={'cart_item_data_display'}
                                        label={'Cart Item Data Display'}
                                        description={'Choose how to display cart item data.'}
                                        options={[
                                            {
                                                value: 'short',
                                                label: 'Short (Recommended)',
                                                description: 'Display only variation values. For example, Size: XL, Color: Red is displayed as XL / Red. (Recommended)',
                                            },
                                            {
                                                value: 'woocommerce',
                                                label: 'WooCommerce Default',
                                                description: 'Each variation is displayed on a separate line using this format: Label: Value',
                                            },
                                        ]}
                                        searchTerm={searchTerm}
                                    />

                                    <Slot name="CheckoutWC.Admin.Pages.GlobalOptions.Options" />
                                </>
                            }
                        />
                        <AdminPageSection
                            title='Store Policies'
                            description='Store Policies are displayed as links in the footer of the checkout, order pay, and thank you pages. Clicking them displays the policy in a modal window.'
                            content={
                                <>
                                    <LockedFieldWrapper plan={props.plan} slug={'store-policies'} locked={props.plan.plan_level < 1} requiredPlans={props.plan.labels.required_list[ 1 ]}>
                                        <StorePolicyRepeater
                                            name={'store_policies'}
                                            locked={props.plan.plan_level < 1}
                                        />
                                    </LockedFieldWrapper>

                                    <Slot name="CheckoutWC.Admin.Pages.GlobalOptions.StorePolicies" />
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

export default WooCommercePagesGlobalOptionsSettingsForm;
