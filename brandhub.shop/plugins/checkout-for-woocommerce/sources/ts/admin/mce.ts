( function () {
    const cfw_acr = function ( editor ) {
        editor.addButton( 'cfw_acr', {
            type: 'menubutton',
            text: 'Insert Replacement',
            icon: false,
            menu: [
                {
                    text: ( <any>window ).cfw_acr_replacement_codes.site_name,
                    value: '{{site_name}}',
                    onclick() {
                        editor.insertContent( this.value() );
                    },
                },
                {
                    text: ( <any>window ).cfw_acr_replacement_codes.cart_products_table,
                    value: '{{cart_products_table}}',
                    onclick() {
                        editor.insertContent( this.value() );
                    },
                },
                {
                    text: ( <any>window ).cfw_acr_replacement_codes.checkout_url,
                    value: '{{checkout_url}}',
                    onclick() {
                        editor.insertContent( this.value() );
                    },
                },
                {
                    text: ( <any>window ).cfw_acr_replacement_codes.checkout_button,
                    value: '{{checkout_button}}',
                    onclick() {
                        editor.insertContent( this.value() );
                    },
                },
                {
                    text: ( <any>window ).cfw_acr_replacement_codes.customer_email,
                    value: '{{customer_email}}',
                    onclick() {
                        editor.insertContent( this.value() );
                    },
                },
                {
                    text: ( <any>window ).cfw_acr_replacement_codes.customer_firstname,
                    value: '{{customer_firstname}}',
                    onclick() {
                        editor.insertContent( this.value() );
                    },
                },
                {
                    text: ( <any>window ).cfw_acr_replacement_codes.customer_lastname,
                    value: '{{customer_lastname}}',
                    onclick() {
                        editor.insertContent( this.value() );
                    },
                },
                {
                    text: ( <any>window ).cfw_acr_replacement_codes.customer_full_name,
                    value: '{{customer_full_name}}',
                    onclick() {
                        editor.insertContent( this.value() );
                    },
                },
                {
                    text: ( <any>window ).cfw_acr_replacement_codes.cart_abandoned_date,
                    value: '{{cart_abandoned_date}}',
                    onclick() {
                        editor.insertContent( this.value() );
                    },
                },
                {
                    text: ( <any>window ).cfw_acr_replacement_codes.site_url,
                    value: '{{site_url}}',
                    onclick() {
                        editor.insertContent( this.value() );
                    },
                },
                {
                    text: ( <any>window ).cfw_acr_replacement_codes.unsubscribe_url,
                    value: '{{unsubscribe_url}}',
                    onclick() {
                        editor.insertContent( this.value() );
                    },
                },
            ].sort( ( a, b ) => a.text.localeCompare( b.text ) ),
        } );
    };

    ( <any>window ).tinymce.PluginManager.add( 'cfw_acr', cfw_acr );
}() );
