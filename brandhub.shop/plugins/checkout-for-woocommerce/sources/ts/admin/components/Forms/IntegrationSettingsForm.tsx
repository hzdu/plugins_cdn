import { Slot, SlotFillProvider, withFilters }              from '@wordpress/components';
import { Formik, Form }                                     from 'formik';
import React                                                from 'react';
import SettingsFormContainerPropsInterface                  from '../../../interfaces/SettingsFormContainerPropsInterface';
import SettingsFormPropsPlanInterface                       from '../../../interfaces/SettingsFormPropsPlanInterface';
import AdminPageSection                                     from '../AdminPageSection';
import CheckboxField                                        from '../Fields/CheckboxField';
import TextField                                            from '../Fields/TextField';

interface IntegrationsSettingsInterface {
    google_places_api_key: string;
}

interface IntegrationsSettingsFormPropsInterface extends SettingsFormContainerPropsInterface {
    settings: IntegrationsSettingsInterface;
    integrations: any[];
    plan: SettingsFormPropsPlanInterface;

}

const IntegrationsSettingsForm: React.FC<IntegrationsSettingsFormPropsInterface> = ( containerProps ) => {
    const { saveSettings, isLoading, searchTerm } = containerProps;

    const AdditionalSettings = withFilters(
        'CheckoutWC.Admin.Settings.Pages.Integrations',
    )( () => <></> );

    return (
        <SlotFillProvider>
            <AdditionalSettings />
            <Formik
                initialValues={{
                    ...containerProps.settings,
                    ...containerProps.integrations.reduce( ( acc, integration ) => {
                        acc[ integration.name ] = integration.initial_value;
                        return acc;
                    }, {} ),
                }}
                enableReinitialize={true}
                onSubmit={async ( values ) => {
                    await saveSettings( values );
                }}
            >
                { ( props ) => (
                    <form className={'space-y-6 transition-all'} style={{ filter: isLoading ? 'blur(2px)' : 'none' }} onSubmit={props.handleSubmit}>
                        {containerProps.plan.plan_level > 0 && ( <AdminPageSection
                            title='Google API'
                            description='Used for the maps embed on the thank you page as well as Google Address Autocomplete.'
                            content={
                                <>
                                    <TextField
                                        name="google_places_api_key"
                                        label="Google API Key"
                                        description='Used by Address Autocomplete and Thank You Page Maps Embed.'
                                        searchTerm={searchTerm}
                                    />

                                    <Slot name="CheckoutWC.Admin.Pages.Integrations.Google" />
                                </>
                            }
                        /> )}

                        { containerProps.integrations.length > 0
                            && (
                                <AdminPageSection
                                    title='Themes and Plugins'
                                    description='Integrations with 3rd party themes and plugins.'
                                    content={
                                        <>
                                            {containerProps.integrations.map( ( integration: any ) => (
                                                <CheckboxField
                                                    key={integration.name}
                                                    name={integration.name}
                                                    label={integration.label}
                                                    description={integration.description}
                                                    onBlur={props.handleBlur}
                                                    checked={props.values[ integration.name ]}
                                                    onChange={props.handleChange}
                                                    searchTerm={searchTerm}
                                                />
                                            ) )}

                                            <Slot name="CheckoutWC.Admin.Pages.Integrations.ThirdParty" />
                                        </>
                                    }
                                />
                            )
                        }

                        <button className={'cfw_admin_page_submit hidden'} type="submit">Submit</button>
                    </form>
                )}
            </Formik>
        </SlotFillProvider>
    );
};

export default IntegrationsSettingsForm;
