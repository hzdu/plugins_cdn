class PreventEnterSubmit {
    constructor() {
        PreventEnterSubmit.disableEnterSubmit();
    }

    static disableEnterSubmit(): void {
        jQuery( document ).on( 'keydown', ':input:not(textarea):not(:submit)', ( event ) => event.key != 'Enter' );
    }
}

export default PreventEnterSubmit;
