import AccountExistsAction   from '../Actions/AccountExistsAction';
import DataService           from '../Services/DataService';

const debounce = require( 'debounce' );

class LoginForm {
    private readonly _debounceAccountExists;

    protected accountExistsAction: AccountExistsAction;

    protected lastEmailValue: string;

    constructor() {
        this.accountExistsAction = new AccountExistsAction();
        this._debounceAccountExists = debounce( this.triggerAccountExistsCheck.bind( this ), 200 );
        this.setListeners();
    }

    setListeners(): void {
        if ( DataService.getSetting( 'enable_account_exists_check' ) ) {
            this.setAccountCheckListener();
        }

        this.setLoginModalListener();
        this.setCreateAccountCheckboxListener();
    }

    setLoginModalListener(): void {
        // When billing email changes, sync to login form
        jQuery( document.body ).on( 'change', '#billing_email', () => {
            jQuery( '#cfw_login_username' ).val( jQuery( '#billing_email' ).val() ).trigger( 'change' );
        } );

        jQuery( document.body ).on( 'cfw_account_exists', () => {
            LoginForm.hideCreatePasswordField();
        } );

        jQuery( document.body ).on( 'cfw_account_not_exists', () => {
            if ( DataService.getSetting( 'check_create_account_by_default' ) ) {
                LoginForm.showCreatePasswordField();
            }
        } );
    }

    setAccountCheckListener(): void {
        const emailInput: JQuery<HTMLInputElement> = jQuery( '#billing_email' );

        if ( emailInput.length ) {
            // Add check to keyup event
            emailInput.on( 'keyup change input', this._debounceAccountExists );

            // Handles page onload use case
            this.triggerAccountExistsCheck();
        }
    }

    triggerAccountExistsCheck(): void {
        const emailInput: JQuery<HTMLInputElement> = jQuery( '#billing_email' );
        const emailValue: string = emailInput.length ? emailInput.val().toString() : '';

        if ( emailValue.length && emailValue !== this.lastEmailValue && !emailInput.hasClass( 'input-hidden' ) ) {
            this.accountExistsAction.load( {
                email: emailValue,
            } );
            this.lastEmailValue = emailValue;
        }
    }

    setCreateAccountCheckboxListener(): void {
        if ( !DataService.getSetting( 'registration_generate_password' ) ) {
            const createAccountCheckbox = jQuery( '#createaccount' );

            createAccountCheckbox.on( 'change', function () {
                if ( jQuery( this ).is( ':checked' ) ) {
                    LoginForm.showCreatePasswordField();
                } else {
                    LoginForm.hideCreatePasswordField();
                }
            } ).trigger( 'change' );
        }
    }

    public static hideCreatePasswordField(): void {
        const accountPassword = jQuery( '#account_password' );
        const accountPasswordSlide = jQuery( '#cfw-account-password-slide' );

        accountPasswordSlide.slideUp( 300 );
        accountPassword.attr( 'data-parsley-required', 'false' );
        accountPassword.prop( 'disabled', true );
    }

    public static showCreatePasswordField(): void {
        const accountPassword = jQuery( '#account_password' );
        const accountPasswordSlide = jQuery( '#cfw-account-password-slide' );

        accountPasswordSlide.slideDown( 300 );
        accountPassword.attr( 'data-parsley-required', 'true' );
        accountPassword.prop( 'disabled', false );
    }
}

export default LoginForm;
