jQuery(document).ready(function ($) {
    'use strict';
    const i18n = viWecParams.i18n;
    ViWec.Components.registerCategory('woocommerce_orders_tracking_email', 'WooCommerce Orders Tracking');
    let woocommerce_orders_tracking_email = viwec_woocommerce_orders_tracking;
    woocommerce_orders_tracking_email.properties = [
        {
            key: "column_content",
            inputType: SectionInput,
            name: false,
            section: contentSection,
            data: {header: 'Column content'}
        },
        {
            name: 'Tracking number',
            key: "tracking_number_col",
            target: '.viwec-text-tracking-number-col',
            htmlAttr: "innerHTML",
            section: contentSection,
            col: 32,
            inputType: TextInput,
            renderShortcode: true,
            data: {shortcodeTool: true},
            onChange(element, value) {
                if (value) {
                    $('.viwec-text-tracking-number').show();
                } else {
                    $('.viwec-text-tracking-number').hide();
                }
                return element;
            }
        },
        {
            name: 'Carrier name',
            key: "carrier_name_col",
            target: '.viwec-text-carrier-name-col',
            htmlAttr: "innerHTML",
            section: contentSection,
            col: 32,
            inputType: TextInput,
            renderShortcode: true,
            data: {shortcodeTool: true},
            onChange(element, value) {
                if (value) {
                    $('.viwec-text-carrier-name').show();
                } else {
                    $('.viwec-text-carrier-name').hide();
                }
                return element;
            }
        },
        {
            name: 'Tracking url',
            key: "tracking_url_col",
            target: '.viwec-text-tracking-url-col',
            htmlAttr: "innerHTML",
            section: contentSection,
            col: 32,
            inputType: TextInput,
            renderShortcode: true,
            data: {shortcodeTool: true},
            onChange(element, value) {
                if (value) {
                    $('.viwec-text-tracking-url').show();
                } else {
                    $('.viwec-text-tracking-url').hide();
                }
                return element;
            }
        },
        {
            key: "product_name_1",
            inputType: SectionInput,
            name: false,
            target: '.viwec-tracking-table',
            section: styleSection,
            data: {header: i18n['text']}
        },
        {
            name: "Font size (px)",
            key: "font-size",
            target: '.viwec-tracking-table',
            htmlAttr: "childStyle",
            section: styleSection,
            col: 8,
            unit: 'px',
            inputType: NumberInput
        },
        {
            name: "Color",
            key: "color",
            target: '.viwec-tracking-table',
            htmlAttr: "childStyle",
            section: styleSection,
            col: 8,
            inputType: ColorInput
        },
        {
            name: "Line height (px)",
            key: "line-height",
            target: '.viwec-tracking-table',
            htmlAttr: "childStyle",
            section: styleSection,
            col: 8,
            unit: 'px',
            inputType: NumberInput
        },
    ];
    ViWec.Components.add(woocommerce_orders_tracking_email);
});
