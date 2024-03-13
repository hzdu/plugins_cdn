import { SlotFillProvider, withFilters }                  from '@wordpress/components';
import { Formik, Form }                                   from 'formik';
import React                                              from 'react';
import { Markup }                                         from 'interweave';
import CheckCircleIcon                                    from '@heroicons/react/24/solid/CheckCircleIcon';
import MinusCircleIcon                                    from '@heroicons/react/24/solid/MinusCircleIcon';
import XCircleIcon                                        from '@heroicons/react/24/solid/XCircleIcon';
import SettingsFormContainerPropsInterface                from '../../../interfaces/SettingsFormContainerPropsInterface';
import SettingsFormPropsPlanInterface                     from '../../../interfaces/SettingsFormPropsPlanInterface';
import AdminPageSection                                   from '../AdminPageSection';
import CheckboxField                                      from '../Fields/CheckboxField';
import MediumAlert                                        from '../MediumAlert';

interface ExpressCheckoutSettingsInterface {
    disable_express_checkout: boolean;
}

interface ExpressCheckoutSettingsFormPropsInterface extends SettingsFormContainerPropsInterface {
    settings: ExpressCheckoutSettingsInterface;
    plan: SettingsFormPropsPlanInterface;
    params: any;

}

enum GatewaySupport {
    FULLY_SUPPORTED = 'fully_supported',
    PARTIALLY_SUPPORTED = 'partially_supported',
    NOT_SUPPORTED = 'not_supported'
}

const ExpressCheckoutSettingsForm: React.FC<ExpressCheckoutSettingsFormPropsInterface> = ( props ) => {
    const { saveSettings, isLoading, searchTerm } = props;

    const AdditionalSettings = withFilters(
        'CheckoutWC.Admin.Settings.Pages.ExpressCheckout',
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
                            title='Express Checkout'
                            description='Control express checkout options.'
                            content={
                                <>
                                    <CheckboxField
                                        name="disable_express_checkout"
                                        label="Disable Express Checkout"
                                        description='Prevent Express Checkout options from loading, such as Apple Pay and PayPal. <a href="https://www.checkoutwc.com/documentation/supported-express-payment-gateways/" target="_blank" class="ml-1 text-blue-600 hover:text-blue-800">Learn More</a>'
                                        searchTerm={searchTerm}
                                    />

                                    <div>
                                        <h3 className="text-base mt-1 font-medium text-gray-900 mb-2">Detected Gateways</h3>

                                        {props.params.gateways.length > 0
                                            ? (
                                                <div className="flow-root">
                                                    <table className="min-w-full divide-y divide-gray-300 border-spacing-0">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col" className="py-3.5 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                                                    Gateway
                                                                </th>
                                                                <th scope="col" className="whitespace-nowrap py-3.5 pr-4 text-left text-sm font-semibold text-gray-900">
                                                                    Express Checkout Support
                                                                </th>
                                                                <th scope="col" className="py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                    Recommendation
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-200">
                                                            {props.params.gateways.map( ( gateway: any ) => (
                                                                <tr key={gateway.id}>
                                                                    <td className="whitespace-nowrap py-4 pr-4 text-sm text-gray-500">{gateway.title}</td>
                                                                    <td className="whitespace-nowrap py-4 pr-4 text-sm text-gray-500">
                                                                        {gateway.supported === GatewaySupport.FULLY_SUPPORTED ? (
                                                                            <CheckCircleIcon className="w-6 h-6 inline-block fill-green-500" />
                                                                        ) : null }
                                                                        {gateway.supported === GatewaySupport.PARTIALLY_SUPPORTED ? (
                                                                            <MinusCircleIcon className="w-6 h-6 inline-block fill-gray-300" />
                                                                        ) : null}
                                                                        {gateway.supported === GatewaySupport.NOT_SUPPORTED ? (
                                                                            <XCircleIcon className="w-6 h-6 inline-block fill-red-500" />
                                                                        ) : null }
                                                                    </td>
                                                                    <td className="py-4 text-sm text-gray-500">
                                                                        <Markup content={gateway.recommendation}/>
                                                                    </td>
                                                                </tr>
                                                            ) )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <MediumAlert
                                                    description={'No supported gateways detected. <a class="text-blue-600 hover:text-blue-800" target="_blank" href="https://www.checkoutwc.com/documentation/supported-express-payment-gateways/">See our recommended Express Checkout gateways here.</a>'}
                                                />
                                            )
                                        }
                                    </div>
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

export default ExpressCheckoutSettingsForm;
