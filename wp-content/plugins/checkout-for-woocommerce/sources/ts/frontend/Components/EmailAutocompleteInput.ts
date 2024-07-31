import DataService                       from '../Services/DataService';

class EmailAutocompleteInput {
    private inputElement: HTMLInputElement;

    private options: EmailAutocompleteInputOptions;

    private email: string;

    private domain: string;

    constructor( options: EmailAutocompleteInputOptions ) {
        if ( DataService.getSetting( 'disable_domain_autocomplete' ) ) {
            return;
        }

        if ( window.matchMedia( '(pointer:coarse)' ).matches ) {
            return;
        }

        this.options = {
            domains: [
                'yahoo.com', 'hotmail.com', 'gmail.com', 'me.com', 'aol.com', 'mac.com', 'live.com', 'googlemail.com', 'msn.com', 'facebook.com', 'verizon.net', 'outlook.com', 'icloud.com',
            ],
            ...options,
        };

        this.email = this.options.defaultEmail || '';
        this.domain = '';
        this.inputElement = options.inputElement;
        this.inputElement.addEventListener( 'input', this.handleInputChange );
        this.inputElement.addEventListener( 'beforeinput', this.handleBeforeInput );
    }

    private handleInputChange = ( event: Event ): void => {
        const input = event.target as HTMLInputElement;
        const { value } = input;
        const atIndex = value.indexOf( '@' );

        if ( atIndex === -1 ) {
            // Ignore changes if there's no @ symbol.
            return;
        }

        const emailPart = value.substring( 0, atIndex );
        const domainPart = value.substring( atIndex + 1 );
        this.email = emailPart;

        // Use a slightly modified logic to immediately autocomplete the domain
        // even if only one character is deleted.
        if ( domainPart !== this.domain ) {
            // Find the first domain that starts with the current input.
            const autoCompleteDomain = this.options.domains.find( ( d ) => d.startsWith( domainPart ) );

            if ( autoCompleteDomain ) {
                this.domain = autoCompleteDomain;
                const completedValue = `${emailPart}@${this.domain}`;
                input.value = completedValue;
                // Set the selection range to highlight the autocompleted part of the domain.
                input.setSelectionRange( emailPart.length + domainPart.length + 1, completedValue.length );
            } else {
                this.domain = domainPart;
            }
        }

        this.triggerOnEmailChange();
    };

    private handleBeforeInput = ( event: InputEvent ): void => {
        const input = event.target as HTMLInputElement;

        if ( event.inputType !== 'deleteContentBackward' || input.selectionStart === input.selectionEnd ) {
            return;
        }

        event.preventDefault();

        const newValueStart = input.value.slice( 0, input.selectionStart - 1 );
        const newValueEnd = input.value.slice( input.selectionEnd );
        const updatedValue = newValueStart + newValueEnd;
        const [ email, domain ] = updatedValue.split( '@' );
        const autoCompleteDomain =  domain === '' ? '' : this.options.domains.find( ( d ) => d.startsWith( domain ) );

        if ( input.selectionStart === 0 && input.selectionEnd === input.value.length ) {
            input.value = '';
            input.setSelectionRange( 0, 0 );

            return;
        }

        if ( autoCompleteDomain ) {
            this.domain = autoCompleteDomain;
            const completedValue = `${email}@${this.domain}`;
            input.value = completedValue;
            input.setSelectionRange( updatedValue.length, completedValue.length );
        } else {
            input.value = updatedValue;
            input.setSelectionRange( input.value.length, input.value.length );
        }

        this.email = email;
        this.triggerOnEmailChange();
    };

    private triggerOnEmailChange(): void {
        if ( this.options.onEmailChange ) {
            this.options.onEmailChange( `${this.email}@${this.domain}` );
        }
    }
}

export default EmailAutocompleteInput;
