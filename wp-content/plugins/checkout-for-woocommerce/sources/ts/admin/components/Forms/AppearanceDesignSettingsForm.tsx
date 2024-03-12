import { Slot, SlotFillProvider, withFilters }                    from '@wordpress/components';
import { Formik, Field }                                          from 'formik';
import React, { useState }                                        from 'react';
import cfwConvertOptionsObjectToArray                             from '../../../functions/cfwConvertOptionsObjectToArray';
import SettingsFormContainerPropsInterface                        from '../../../interfaces/SettingsFormContainerPropsInterface';
import SettingsFormPropsPlanInterface                             from '../../../interfaces/SettingsFormPropsPlanInterface';
import AdminPageSection                                           from '../AdminPageSection';
import WPMediaUploadButton                                        from '../Fields/WPMediaUploadButton';
import RadioGroupField                                            from '../Fields/RadioGroupField';
import WYSIWYGField                                               from '../Fields/WYSIWYGField';
import SelectField                                                from '../Fields/SelectField';
import CodeEditorField                                            from '../Fields/CodeEditorField';
import ColorPickerField                                           from '../Fields/ColorPickerField';

interface AppearanceDesignFormSettingsInterface {
    footer_text_editor_mode: string;
}

interface AppearanceDesignFormParamsInterface {
    font_options: any[]
    template_path: string;
    color_settings: any[];
    color_settings_defaults: any[];
    logo_preview_url: string;
}

interface AppearanceDesignSettingsFormPropsInterface extends SettingsFormContainerPropsInterface {
    settings: AppearanceDesignFormSettingsInterface;
    params: AppearanceDesignFormParamsInterface;
    plan: SettingsFormPropsPlanInterface;
}

const AppearanceDesignSettingsForm: React.FC<AppearanceDesignSettingsFormPropsInterface> = ( containerProps ) => {
    const { saveSettings, isLoading, searchTerm } = containerProps;
    const [ footerTextEditorMode  ] = useState( containerProps.settings.footer_text_editor_mode );

    const AdditionalSettings = withFilters(
        'CheckoutWC.Admin.Settings.Pages.AppearanceDesign',
    )( () => <></> );

    return (
        <SlotFillProvider>
            <AdditionalSettings />
            <Formik
                initialValues={{
                    ...containerProps.settings,
                    ...containerProps.params.color_settings_defaults,
                }}
                enableReinitialize={true}
                onSubmit={async ( values ) => {
                    await saveSettings( values );
                }}
            >
                { ( props ) => (
                    <form className={'space-y-6 transition-all'} style={{ filter: isLoading ? 'blur(2px)' : 'none' }} onSubmit={props.handleSubmit}>
                        <Field type={'hidden'} name={'footer_text_editor_mode'} value={footerTextEditorMode} />

                        <AdminPageSection
                            title='General Template Settings'
                            description='Configure your template.'
                            content={
                                <>
                                    <WPMediaUploadButton
                                        name={`logo_attachment_id_${containerProps.params.template_path}`}
                                        label='Logo'
                                        description='Choose the logo you wish to display in the header. If you do not choose a logo we will use your site name.'
                                        defaultUrl={containerProps.params.logo_preview_url}
                                        searchTerm={searchTerm}
                                    />

                                    <RadioGroupField
                                        name={`label_style_${containerProps.params.template_path}`}
                                        label='Field Label Style'
                                        description='Choose how you want form labels styled.'
                                        options={[
                                            {
                                                value: 'floating',
                                                label: 'Floating (Recommended)',
                                                description: 'Automatically show and hide labels based on whether the field has a value. (Recommended)',
                                            },
                                            {
                                                value: 'normal',
                                                label: 'Normal',
                                                description: 'Labels appear above each field at all times.',
                                            },
                                        ]}
                                        searchTerm={searchTerm}
                                    />

                                    <WYSIWYGField
                                        name={`footer_text_${containerProps.params.template_path}`}
                                        label='Footer Text'
                                        description='If left blank, a standard copyright notice will be displayed. Set to a single space to override this behavior.'
                                        initialMode={containerProps.settings.footer_text_editor_mode}
                                        onModeChange={( mode ) => props.setFieldValue( 'footer_text_editor_mode', mode ) }
                                        searchTerm={searchTerm}
                                    />

                                    <Slot name="CheckoutWC.Admin.Pages.AppearanceDesign.General" />
                                </>
                            }
                        />
                        <AdminPageSection
                            title='Typography'
                            description='Configure fonts.'
                            content={
                                <>
                                    <SelectField
                                        name={`body_font_${containerProps.params.template_path}`}
                                        label={'Body Font'}
                                        description={'Choose the font for the body text.'}
                                        options={cfwConvertOptionsObjectToArray( containerProps.params.font_options )}
                                        searchTerm={searchTerm}
                                    />

                                    <SelectField
                                        name={`heading_font_${containerProps.params.template_path}`}
                                        label={'Heading Font'}
                                        description={'Choose the font for the headings.'}
                                        options={cfwConvertOptionsObjectToArray( containerProps.params.font_options )}
                                        searchTerm={searchTerm}
                                    />

                                    <Slot name="CheckoutWC.Admin.Pages.AppearanceDesign.Typography" />
                                </>
                            }
                        />

                        <AdminPageSection
                            title='Colors'
                            description='Configure template colors.'
                            content={
                                <>
                                    <div className={'flex flex-col space-y-4'}>
                                        {Object.entries( containerProps.params.color_settings ).map( ( [ sectionName, sectionDetails ] ) => {
                                            // Check if the section has settings
                                            if ( Object.keys( sectionDetails.settings ).length > 0 ) {
                                                return (
                                                    <div key={sectionName}>
                                                        <h2 className={'mb-2'}>{sectionDetails.title}</h2>
                                                        <div className="flex flex-wrap flex-row gap-4 cfw-admin-section-component-content">
                                                            {Object.entries( sectionDetails.settings ).map( ( [ settingName, settingLabel ] ) => (
                                                                <>
                                                                    <ColorPickerField
                                                                        key={settingName}
                                                                        name={`${settingName}_${containerProps.params.template_path}`}
                                                                        label={settingLabel}
                                                                        value={props.values[ settingName ]}
                                                                        defaultValue={props.initialValues[ settingName ]}
                                                                        searchTerm={searchTerm}
                                                                    />
                                                                </>
                                                            ) )}
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null; // Return null if the section has no settings
                                        } )}
                                    </div>

                                    <Slot name="CheckoutWC.Admin.Pages.AppearanceDesign.Colors" />
                                </>
                            }
                        />

                        <AdminPageSection
                            title='CSS'
                            description='Customize template CSS.'
                            content={
                                <>
                                    <Field
                                        name={`custom_css_${containerProps.params.template_path}`}
                                        label='Custom CSS'
                                        language='css'
                                        component={CodeEditorField}
                                        description={'Add Custom CSS rules to fully control the appearance of the checkout template.'}
                                        searchTerm={searchTerm}
                                    />

                                    <Slot name="CheckoutWC.Admin.Pages.AppearanceDesign.CSS" />
                                </>
                            }
                        />

                        <button className={'cfw_admin_page_submit hidden'} type="submit">Submit</button>
                    </form>
                )}
            </Formik>
        </SlotFillProvider>
    );
};

export default AppearanceDesignSettingsForm;
