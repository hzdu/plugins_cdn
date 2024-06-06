import ReviewPaneDataItemInterface from './ReviewPaneDataItemInterface';
import Actions                     from '../../Types/Actions';

interface ReviewPaneDataInterface {
    contact: ReviewPaneDataItemInterface;
    shipping_address: ReviewPaneDataItemInterface;
    shipping_method: ReviewPaneDataItemInterface;
    payment_method: ReviewPaneDataItemInterface;
    actions: Actions;
}

export default ReviewPaneDataInterface;
