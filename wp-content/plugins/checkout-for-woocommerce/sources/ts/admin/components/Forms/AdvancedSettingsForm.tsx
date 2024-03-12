import { Slot, SlotFillProvider, withFilters }              from '@wordpress/components';
import { Formik, Form }                                     from 'formik';
import React                                                from 'react';
import SettingsFormContainerPropsInterface                  from '../../../interfaces/SettingsFormContainerPropsInterface';
import SettingsFormPropsPlanInterface                       from '../../../interfaces/SettingsFormPropsPlanInterface';
import AdminPageSection                                     from '../AdminPageSection';
import CheckboxField                                        from '../Fields/CheckboxField';
import RadioGroupField                                      from '../Fields/RadioGroupField';
import MediumAlert                                          from '../MediumAlert';

interface AdvancedSettingsInterface {
    template_loader: string;
    enable_beta_version_updates: boolean;
    hide_admin_bar_button: boolean;
    enable_debug_log: boolean;
    allow_tracking: string;
    allow_uninstall: boolean;
}

interface AdvancedFormParamsInterface {
    allow_tracking_hash: string;
}
interface AdvancedSettingsFormPropsInterface extends SettingsFormContainerPropsInterface {
    settings: AdvancedSettingsInterface;
    params: AdvancedFormParamsInterface;
    plan: SettingsFormPropsPlanInterface;

}

const AdvancedSettingsForm: React.FC<AdvancedSettingsFormPropsInterface> = ( props ) => {
    const { saveSettings, isLoading, searchTerm } = props;

    const AdditionalSettings = withFilters(
        'CheckoutWC.Admin.Settings.Pages.Advanced',
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
                            title='Experimental Options'
                            description='These options are not fully supported and may require a developer to implement successfully.'
                            content={
                                <>
                                    <RadioGroupField
                                        name='template_loader'
                                        label='Template Loader'
                                        description='Choose how to load the templates. (Checkout, Order Pay, Thank You)'
                                        options={[
                                            {
                                                value: 'redirect',
                                                label: 'Distraction Free Portal (Recommended)',
                                                description: 'Display CheckoutWC templates in a distraction free portal which does not load the active WordPress theme or styles. (Recommended)',
                                            },
                                            {
                                                value: 'content',
                                                label: 'WordPress Theme',
                                                description: 'Load CheckoutWC templates within active WordPress theme content area. (<span style="color:red">Unsupported Configuration</span>)',
                                            },
                                        ]}
                                        searchTerm={searchTerm}
                                    />

                                    { values.template_loader === 'content'
                                        && (
                                            <MediumAlert
                                                description={"Using this option renders our templates inside of your theme content area. This may cause conflicts with your theme's stylesheets and scripts. Please note, resolving any issues that arise from this loader will be your responsibility."}
                                            />
                                        )
                                    }

                                    <CheckboxField
                                        name="enable_beta_version_updates"
                                        label="Enable Beta Version Updates"
                                        description='Allows automatic updates to the latest beta version.'
                                        searchTerm={searchTerm}
                                    />

                                    <CheckboxField
                                        name="allow_uninstall"
                                        label="Delete Plugin Data on Uninstall"
                                        description='If you want a fresh start.'
                                        searchTerm={searchTerm}
                                    />

                                    <Slot name="CheckoutWC.Admin.Pages.Advanced.Options" />
                                </>
                            }
                        />

                        <AdminPageSection
                            title='Other'
                            description='We are great at categorizing things!'
                            content={
                                <>
                                    <CheckboxField
                                        name="hide_admin_bar_button"
                                        label="Hide Admin Menu Bar Button"
                                        description='Hide the CheckoutWC admin menu bar button unless you are on the checkout page, or one of the checkout endpoints such as thank you and order pay.'
                                        searchTerm={searchTerm}
                                    />

                                    <CheckboxField
                                        name="enable_debug_log"
                                        label="Enable Debug Log"
                                        description='Logs debug information to WP Admin > WooCommerce > Status > Logs > checkout-wc-*.log'
                                        searchTerm={searchTerm}
                                    />

                                    <CheckboxField
                                        name="allow_tracking"
                                        label="Enable Usage Tracking"
                                        description='Allow CheckoutWC to track plugin usage.'
                                        value={props.params.allow_tracking_hash}
                                        searchTerm={searchTerm}
                                    />

                                    <Slot name="CheckoutWC.Admin.Pages.Advanced.Options" />
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

export default AdvancedSettingsForm;
