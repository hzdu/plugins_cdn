declare class EmailAutocompleteInput {
    private inputElement;
    private options;
    private email;
    private domain;
    constructor(options: EmailAutocompleteInputOptions);
    private handleInputChange;
    private handleBeforeInput;
    private triggerOnEmailChange;
}
export default EmailAutocompleteInput;
