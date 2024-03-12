import ReviewPaneDataItemInterface from './ReviewPaneDataItemInterface';

interface ReviewPaneDataInterface {
    contact: ReviewPaneDataItemInterface;
    shipping_address: ReviewPaneDataItemInterface;
    shipping_method: ReviewPaneDataItemInterface;
    payment_method: ReviewPaneDataItemInterface;
}

export default ReviewPaneDataInterface;
