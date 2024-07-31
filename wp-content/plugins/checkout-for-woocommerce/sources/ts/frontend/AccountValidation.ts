import Alert        from './Components/Alert';
import AlertService from './Services/AlertService';
import DataService  from './Services/DataService';

class AccountValidation {
    static load(): void {
        jQuery( document.body ).on( 'cfw_account_exists updated_checkout', ( { type } ) => {
            if ( AccountValidation.accountDoesNotExistOrLoginIsNotRequired() || !DataService.getSetting( 'login_allowed_at_checkout' ) ) {
                return;
            }

            AccountValidation.addAlert();

            if ( type === 'cfw_account_exists' ) {
                AlertService.showAlerts();
            }
        } );
    }

    static getValidatorFactory(): () => Promise<any> {
        return () => new Promise( ( resolve, reject ) => {
            if ( AccountValidation.accountDoesNotExistOrLoginIsNotRequired() || !DataService.getSetting( 'login_allowed_at_checkout' ) ) {
                resolve( true );
                return;
            }

            AccountValidation.addAlert();
            AlertService.showAlerts();

            reject( new Error( 'CheckoutWC: Account already exists and login required.' ) );
        } );
    }

    static addAlert(): void {
        const message = DataService.getMessage( 'account_already_registered_notice' );
        const classes = 'cfw-alert-error cfw-login-required-error';

        AlertService.queueAlert( new Alert( 'error', message, classes ) );
    }

    static accountDoesNotExistOrLoginIsNotRequired(): boolean {
        const userIsNotLoggedIn = !DataService.getSetting( 'user_logged_in' );
        const registrationIsRequired = DataService.getSetting( 'is_registration_required' );
        const runtimeEmailMatchedUser = DataService.getRuntimeParameter( 'runtime_email_matched_user' );
        const shouldValidateRequiredRegistration = DataService.getSetting( 'validate_required_registration' );

        return !( userIsNotLoggedIn && registrationIsRequired && runtimeEmailMatchedUser && shouldValidateRequiredRegistration );
    }
}

export default AccountValidation;
