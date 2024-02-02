abstract class AbstractComposableModal {
    protected id: string;

    protected constructor( content: string, args: any = {}, showConfirmButton = true, showCancelButton = true ) {
        // Randomly generate an ID string
        this.id = `cfw-modal-${( Math.random() + 1 ).toString( 36 ).substring( 2, 7 )}`;

        // Add an invisible trigger link and content div to body
        jQuery( document.body ).append( `<a id="${this.id}-trigger" href="#${this.id}-content" style="display: none;"></a>` );

        content = `<div id="${this.id}-content-wrapper">${content}</div>`;

        const theArgs = {
            type: 'confirm',
            confirm_content: content,
            before_open: this.beforeOpen.bind( this ),
            after_open: this.afterOpen.bind( this ),
            before_close: this.beforeClose.bind( this ),
            after_close: this.afterClose.bind( this ),
            overlay_opacity: 0.4,
            custom_class: 'cfw-modaal cfw-grid checkoutwc',
            ...args,
        };

        if ( theArgs.type !== 'confirm' ) {
            jQuery( document.body ).append( `<div id="${this.id}-content" style="display: none;"></div>` );
            jQuery( `#${this.id}-content` ).html( content );

            delete theArgs.confirm_content;
        }

        jQuery( `#${this.id}-trigger`  ).modaal( theArgs );

        if ( !showConfirmButton ) {
            jQuery( '.modaal-confirm-btn.modaal-ok' ).hide();
        }

        if ( !showCancelButton ) {
            jQuery( '.modaal-confirm-btn.modaal-cancel' ).hide();
        }
    }

    beforeOpen(): void {}

    beforeClose(): void {}

    afterOpen(): void {}

    afterClose(): void {}

    public open(): void {
        jQuery( `#${this.id}-trigger` ).modaal( 'open' );
    }

    public close(): void {
        jQuery( `#${this.id}-trigger` ).modaal( 'close' );
    }
}

export default AbstractComposableModal;
