import { Fill }                   from '@wordpress/components';
import React                      from 'react';
import TextareaField              from '../Components/Fields/TextareaField';

export default function OrderReviewStep() {
    return ( props ) => (
        <Fill name="CheckoutWC.Admin.Pages.Checkout.Steps">
            <TextareaField name="textareaField" label="Textarea Field" description="This is workign?" />
        </Fill>
    );
}
