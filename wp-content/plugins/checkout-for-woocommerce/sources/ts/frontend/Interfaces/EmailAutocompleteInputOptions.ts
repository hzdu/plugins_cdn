interface EmailAutocompleteInputOptions {
    inputElement: HTMLInputElement;
    domains?: string[];
    onEmailChange?: ( email: string ) => void;
    defaultEmail?: string;
}
