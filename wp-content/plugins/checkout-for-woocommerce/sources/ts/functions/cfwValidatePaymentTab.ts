import Alert          from '../frontend/Components/Alert';
import AlertService   from '../frontend/Services/AlertService';
import DataService    from '../frontend/Services/DataService';
import cfwValidateTab from './cfwValidateTab';

export default function cfwValidatePaymentTab(): Promise<any> {
    return cfwValidateTab( '#cfw-payment-method' );
}
