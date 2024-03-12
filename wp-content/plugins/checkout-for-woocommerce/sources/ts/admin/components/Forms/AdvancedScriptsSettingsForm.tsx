import { Slot, SlotFillProvider, withFilters }                         from '@wordpress/components';
import { Formik, Form, Field }                                         from 'formik';
import React                                                           from 'react';
import SettingsFormContainerPropsInterface                             from '../../../interfaces/SettingsFormContainerPropsInterface';
import SettingsFormPropsPlanInterface                                  from '../../../interfaces/SettingsFormPropsPlanInterface';
import AdminPageSection                                                from '../AdminPageSection';
import CodeEditorField                                                 from '../Fields/CodeEditorField';
import MediumAlert                                                     from '../MediumAlert';
import SevereAlert                                                     from '../SevereAlert';

interface AdvancedScriptsSettingsInterface {
    header_scripts: string;
    footer_scripts: string;
    php_snippets: string;
    header_scripts_checkout: string;
    footer_scripts_checkout: string;
    header_scripts_thank_you: string;
    footer_scripts_thank_you: string;
    header_scripts_order_pay: string;
    footer_scripts_order_pay: string;
}

interface AdvancedScriptsSettingsFormPropsInterface extends SettingsFormContainerPropsInterface {
    settings: AdvancedScriptsSettingsInterface;
    plan: SettingsFormPropsPlanInterface;

}

const AdvancedScriptsSettingsForm: React.FC<AdvancedScriptsSettingsFormPropsInterface> = ( props ) => {
    const { saveSettings, isLoading, searchTerm } = props;

    const AdditionalSettings = withFilters(
        'CheckoutWC.Admin.Settings.Pages.AdvancedScripts',
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
                            title='Global'
                            description='Add custom scripts that run on all enabled CheckoutWC templates. (Checkout, Thank You, Order Pay)'
                            content={
                                <>
                                    <Field
                                        name="header_scripts"
                                        label='Header Scripts'
                                        language='html'
                                        component={CodeEditorField}
                                        description={'This code will output immediately before the closing <code>&lt;/head&gt;</code> tag in the document source.'}
                                        searchTerm={searchTerm}
                                    />

                                    <Field
                                        name="footer_scripts"
                                        label='Footer Scripts'
                                        language='html'
                                        component={CodeEditorField}
                                        description={'This code will output immediately before the closing <code>&lt;/body&gt;</code> tag in the document source.'}
                                        searchTerm={searchTerm}
                                    />

                                    { ( values.header_scripts.includes( '<?' ) || values.footer_scripts.includes( '<?' ) )
                                        && (
                                            <MediumAlert
                                                description={'Header and Footer Scripts are HTML only. For PHP, use PHP Snippets option.'}
                                            />
                                        )
                                    }

                                    <Field
                                        name="php_snippets"
                                        label='PHP Snippets'
                                        language='php'
                                        component={CodeEditorField}
                                        description={'Add PHP snippets to modify your checkout page here. If you have lots of snippets, you may want to consider using <a class="text-blue-600 underline" target="_blank" href="%s">Code Snippets</a>.'}
                                        searchTerm={searchTerm}
                                    />

                                    { values.php_snippets.startsWith( '<?' )
                                        && (
                                            <SevereAlert
                                                description={'Please omit the opening PHP tag.'}
                                            />
                                        )
                                    }

                                    <Slot name="CheckoutWC.Admin.Pages.AdvancedScripts.Global" />
                                </>
                            }
                        />

                        <AdminPageSection
                            title='Checkout'
                            description='Add custom JavaScript and PHP that runs on the checkout page.'
                            content={
                                <>
                                    <Field
                                        name="header_scripts_checkout"
                                        label='Header Scripts'
                                        language='html'
                                        component={CodeEditorField}
                                        description={'This code will output immediately before the closing <code>&lt;/head&gt;</code> tag in the document source.'}
                                        searchTerm={searchTerm}
                                    />

                                    <Field
                                        name="footer_scripts_checkout"
                                        label='Footer Scripts'
                                        language='html'
                                        component={CodeEditorField}
                                        description={'This code will output immediately before the closing <code>&lt;/body&gt;</code> tag in the document source.'}
                                        searchTerm={searchTerm}
                                    />

                                    { ( values.header_scripts_checkout.includes( '<?' ) || values.footer_scripts_checkout.includes( '<?' ) )
                                        && (
                                            <MediumAlert
                                                description={'Header and Footer Scripts are HTML only. For PHP, use PHP Snippets option.'}
                                            />
                                        )
                                    }

                                    <Slot name="CheckoutWC.Admin.Pages.AdvancedScripts.Global" />
                                </>
                            }
                        />

                        <AdminPageSection
                            title='Thank You'
                            description='Add custom JavaScript and PHP that runs on the Order Received / Thank You page.'
                            content={
                                <>
                                    <Field
                                        name="header_scripts_thank_you"
                                        label='Header Scripts'
                                        language='html'
                                        component={CodeEditorField}
                                        description={'This code will output immediately before the closing <code>&lt;/head&gt;</code> tag in the document source.'}
                                        searchTerm={searchTerm}
                                    />

                                    <Field
                                        name="footer_scripts_thank_you"
                                        label='Footer Scripts'
                                        language='html'
                                        component={CodeEditorField}
                                        description={'This code will output immediately before the closing <code>&lt;/body&gt;</code> tag in the document source.'}
                                        searchTerm={searchTerm}
                                    />

                                    { ( values.header_scripts_thank_you.includes( '<?' ) || values.footer_scripts_thank_you.includes( '<?' ) )
                                        && (
                                            <MediumAlert
                                                description={'Header and Footer Scripts are HTML only. For PHP, use PHP Snippets option.'}
                                            />
                                        )
                                    }

                                    <Slot name="CheckoutWC.Admin.Pages.AdvancedScripts.Global" />
                                </>
                            }
                        />

                        <AdminPageSection
                            title='Order Pay'
                            description='Add custom JavaScript and PHP that runs on the Order Pay page.'
                            content={
                                <>
                                    <Field
                                        name="header_scripts_order_pay"
                                        label='Header Scripts'
                                        language='html'
                                        component={CodeEditorField}
                                        description={'This code will output immediately before the closing <code>&lt;/head&gt;</code> tag in the document source.'}
                                        searchTerm={searchTerm}
                                    />

                                    <Field
                                        name="footer_scripts_order_pay"
                                        label='Footer Scripts'
                                        language='html'
                                        component={CodeEditorField}
                                        description={'This code will output immediately before the closing <code>&lt;/body&gt;</code> tag in the document source.'}
                                        searchTerm={searchTerm}
                                    />

                                    { ( values.header_scripts_order_pay.includes( '<?' ) || values.footer_scripts_order_pay.includes( '<?' ) )
                                        && (
                                            <MediumAlert
                                                description={'Header and Footer Scripts are HTML only. For PHP, use PHP Snippets option.'}
                                            />
                                        )
                                    }

                                    <Slot name="CheckoutWC.Admin.Pages.AdvancedScripts.Global" />
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

export default AdvancedScriptsSettingsForm;
