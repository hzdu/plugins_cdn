import cfwAjax from './cfwAjax';

export default function cfwUpdatePaymentMethod( paymentMethod: string ): JQueryXHR {
    const params = {
        type: 'POST',
        data: {
            paymentMethod,
        },
    };

    return cfwAjax( 'update_payment_method', params );
}
