import React                              from 'react';
import { __ }                             from '@wordpress/i18n';
import { useSelect }                      from '@wordpress/data';
import { Markup }                         from 'interweave';
import ReviewPaneItem                     from './ReviewPaneItem';
import ReviewPaneDataInterface            from '../../Interfaces/ReviewPaneDataInterface';
import DataStores                         from '../../DataStores';

const PaymentMethodReviewPane = () => {
    const reviewData: ReviewPaneDataInterface = useSelect( ( select: any ) => select( DataStores.cart_store_key ).getReviewData( null ), [] );

    return (
        <ul className="cfw-review-pane cfw-module">
            <ReviewPaneItem
                label={__( 'Contact', 'checkout-wc' )}
                content={reviewData.contact.content}
                showChangeLink={reviewData.contact.show_change_link}
                tabLink="#cfw-customer-info"
            />

            {reviewData.shipping_address.show
                && (
                    <ReviewPaneItem
                        label={reviewData.shipping_address.label} // Replace with dynamic label if needed
                        content={reviewData.shipping_address.content}
                        showChangeLink={reviewData.shipping_address.show_change_link}
                        tabLink="#cfw-customer-info"
                    />
                )
            }

            {reviewData.shipping_method.show
                && (
                    <ReviewPaneItem
                        label={__( 'Method', 'checkout-wc' )}
                        content={reviewData.shipping_method.content}
                        showChangeLink={reviewData.shipping_method.show_change_link}
                        tabLink="#cfw-shipping-method"
                    />
                )
            }

            <Markup content={reviewData.actions?.cfw_after_payment_step_review_pane} noWrap={true} />
        </ul>
    );
};

export default PaymentMethodReviewPane;
