import { Slot, SlotFillProvider, withFilters }                from '@wordpress/components';
import { Formik, Form }                                       from 'formik';
import React                                                  from 'react';
import RadioGroupFieldOptionInterface                         from '../../../interfaces/RadioGroupFieldOptionInterface';
import SettingsFormContainerPropsInterface                    from '../../../interfaces/SettingsFormContainerPropsInterface';
import SettingsFormPropsPlanInterface                         from '../../../interfaces/SettingsFormPropsPlanInterface';
import AdminPageSection                                       from '../AdminPageSection';
import RadioGroupField                                        from '../Fields/RadioGroupField';
import TextField                                              from '../Fields/TextField';
import TrustBadgeRepeater                                     from '../TrustBadgeRepeater';
import ToggleCheckboxField                                    from '../Fields/ToggleCheckboxField';

const radioOptions: RadioGroupFieldOptionInterface[] = [
    {
        value: 'below_cart_summary',
        label: 'Below the checkout cart summary',
        description: 'Output in a single column below the checkout cart summary totals',
    },
    {
        value: 'below_checkout_form',
        label: 'After the checkout form',
        description: 'Output in a single row below the checkout form above the footer',
    },
    {
        value: 'in_footer',
        label: 'Top of the footer',
        description: 'Output in a single row inside the footer',
    },
];

interface TrustBadgeSettingsInterface {
    enable_trust_badges: boolean;
    trust_badge_position: string;
    trust_badges_title: string;
    trust_badges: any[];
}

interface TrustBadgeFormWooCommerceSettingsInterface {
    shipping_methods: any;
}
interface TrustBadgeSettingsFormPropsInterface extends SettingsFormContainerPropsInterface {
    settings: TrustBadgeSettingsInterface;
    woocommerce_settings: TrustBadgeFormWooCommerceSettingsInterface;
    plan: SettingsFormPropsPlanInterface;
    params: any;

}

const TrustBadgeSettingsForm: React.FC<TrustBadgeSettingsFormPropsInterface> = ( props ) => {
    const { saveSettings, isLoading, searchTerm } = props;

    const AdditionalSettings = withFilters(
        'CheckoutWC.Admin.Settings.Pages.TrustBadge',
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
                            title='Trust Badge Options'
                            description='Configure general Trust Badge options.'
                            content={
                                <>
                                    <ToggleCheckboxField
                                        name='enable_trust_badges'
                                        label="Enable Trust Badges"
                                        description="Enable trust badges on CheckoutWC templates. Uncheck to hide badges."
                                        searchTerm={searchTerm}
                                        disabled={props.plan.plan_level < 1}
                                    />

                                    { props.plan.plan_level >= 1 && values.enable_trust_badges
                                        && (
                                            <>
                                                <RadioGroupField
                                                    name='trust_badge_position'
                                                    options={radioOptions}
                                                    label="Trust Badge Output Location"
                                                    description="Where to display the trust badges on the checkout page."
                                                    searchTerm={searchTerm}
                                                />
                                                <TextField
                                                    name="trust_badges_title"
                                                    label="Heading"
                                                    description='Example: Why choose us?'
                                                    placeholder={'Example: Why choose us?'}
                                                    searchTerm={searchTerm}
                                                />

                                                <Slot name="CheckoutWC.Admin.Pages.TrustBageOptions" />
                                            </>
                                        )
                                    }
                                </>
                            }
                        />

                        { props.plan.plan_level >= 1 && values.enable_trust_badges
                            && (
                                <AdminPageSection
                                    title='Trust Badges'
                                    description='Create trust badges to display on your checkout page.'
                                    content={<TrustBadgeRepeater name={'trust_badges'}/>}
                                />
                            )
                        }

                        <button className={'cfw_admin_page_submit hidden'} type="submit">Submit</button>
                    </Form>
                )}
            </Formik>
        </SlotFillProvider>
    );
};

export default TrustBadgeSettingsForm;
