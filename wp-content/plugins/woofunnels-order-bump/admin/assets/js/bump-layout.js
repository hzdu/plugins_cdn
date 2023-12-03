let register_layouts={};

class wfob_bump {
    constructor() {
        this.id='layout_1';
    }
    set_data(model){
        this.model=model;
    }

    get_title_tab_field() {
        return [];
    }

    get_fields() {
        return [];
    }

    get_css() {
        return [];
    }
}
class wfob_bump_layout_1 extends wfob_bump {
    constructor(data) {
        super(data);
        this.id='layout_1';
    }

    get_content_fields() {
        let products = wfob_data.products;
        let output = [];
        if (wfob.tools.ol(products) == 0) {
            return output;
        }
        for (let i in products) {
            let product = products[i];
            output.push({"type": "label", "label": product.title});
            let title = {
                "type": "input",
                "inputType": "text",
                "label": wfob_localization.design.title,
                "model": "product_" + i + "_title",
                "styleClasses": "hint_custom_cls_wrap",
                "hint": wfob_localization.design.title_hint
            };
            output.push(title);
            let description = {
                "type": "textArea",
                "label": wfob_localization.design.description,
                "rows": 3,
                "model": "product_" + i + "_description",
                "styleClasses": "hint_custom_cls_wrap wfob_multi_hint_cls",
                'attributes': {
                    'id': "product_" + i + "_description",
                    'class': 'form-control wfob_editor_field'
                },
                "hint": wfob_localization.design.description_hint
            };
            output.push(description);
            let image = {
                'type': 'switch',
                'label': wfob_localization.design.feature_image,
                'model': 'product_' + i + '_featured_image',
                'textOn': wfob_localization.design.textOn,
                'textOff': wfob_localization.design.textOff,
            };
            output.push(image);
        }
        return output;
    }

    get_fields() {
        return [
            //Product title section started
            {
                type: "label",
                label: wfob_localization.design.title_box,
                styleClasses: 'wfob_design_box_heading',

            },
            {
                type: "input",
                inputType: "text",
                label: wfob_localization.design.background,
                model: "heading_background",
                id: "heading_background",
                styleClasses: 'wfob_color_picker',
            },
            {
                type: "input",
                inputType: "text",
                label: wfob_localization.design.hover_background,
                model: "heading_hover_background",
                id: "heading_hover_background",
                styleClasses: 'wfob_color_picker',

            },
            {
                type: "input",
                inputType: "number",
                label: wfob_localization.design.padding,
                model: "heading_box_padding",
                'attributes': {
                    'min': "0",
                },
                validator: VueFormGenerator.validators.string
            },
            {
                type: "input",
                inputType: "text",
                label: wfob_localization.design.text_color,
                model: "heading_color",
                id: 'heading_color',
                styleClasses: 'wfob_color_picker form-group-clear',
            },
            {
                type: "input",
                inputType: "text",
                label: wfob_localization.design.text_hover_color,
                model: "heading_hover_color",
                id: 'heading_hover_color',
                styleClasses: 'wfob_color_picker',
            },
            {
                type: "input",
                inputType: "text",
                label: wfob_localization.design.error_color,
                model: "error_color",
                id: "error_color",

                styleClasses: ['wfob_color_picker', 'wfob_color_picker_error'],
            },
            {
                type: "switch",
                label: wfob_localization.design.header_enable_pointing_arrow,
                model: "header_enable_pointing_arrow",
                validator: VueFormGenerator.validators.string,
                styleClasses: 'wfob_pointer_arrow',
            },
            {
                type: "select",
                label: wfob_localization.design.point_animation,
                model: "point_animation",
                values: () => {
                    return Object.create(wfob_localization.design.yes_no_drop_down);
                },
                visible: (model) => {
                    return (model.header_enable_pointing_arrow);
                },
                selectOptions: {hideNoneSelectedText: true},
                validator: VueFormGenerator.validators.string,
                styleClasses: 'wfob_pointer_animation',
            },


            // Price product section
            {
                type: "label",
                label: wfob_localization.design.price_box,
                styleClasses: 'wfob_design_box_heading',
            },
            {
                type: "select",
                label: wfob_localization.design.enable_price,
                model: "enable_price",
                values: () => {
                    return Object.create(wfob_localization.design.yes_no_drop_down);
                },
                id: "enable_price",
                selectOptions: {hideNoneSelectedText: true},
            },
            {
                type: "input",
                inputType: "number",
                label: wfob_localization.design.font_size,
                styleClasses: 'wfob_number_field',
                model: "price_font_size",
                'attributes': {
                    'min': "10",
                },
                visible: (model) => {
                    return model.enable_price === '1';
                },
                validator: VueFormGenerator.validators.number,
            },
            {
                type: "input",
                inputType: "text",
                label: wfob_localization.design.price_color,
                model: "price_color",
                id: "price_color",
                styleClasses: 'wfob_color_picker form-group-clear',
                visible: (model) => {
                    return model.enable_price === '1';
                },
            },
            {
                type: "input",
                inputType: "text",
                label: wfob_localization.design.price_sale_color,
                model: "price_sale_color",
                id: "price_sale_color",
                styleClasses: 'wfob_color_picker',
                visible: (model) => {
                    return model.enable_price === '1';
                },
            },


            // description box color
            {
                type: "label",
                label: wfob_localization.design.description_box,
                styleClasses: 'wfob_design_box_heading',
            },
            {
                type: "input",
                inputType: "number",
                label: wfob_localization.design.padding,
                model: "content_box_padding",
                'attributes': {
                    'min': "0",
                },
                validator: VueFormGenerator.validators.number,
            },
            {
                type: "input",
                inputType: "text",
                label: wfob_localization.design.text_color,
                model: "content_color",
                id: "content_color",
                styleClasses: 'wfob_color_picker',
            },
            {
                type: "input",
                inputType: "text",
                label: wfob_localization.design.content_variation_link_color,
                model: "content_variation_link_color",
                id: "content_variation_link_color",
                styleClasses: 'wfob_color_picker form-group-clear',
            },
            {
                type: "input",
                inputType: "text",
                label: wfob_localization.design.content_variation_link_hover_color,
                model: "content_variation_link_hover_color",
                id: "content_variation_link_hover_color",
                styleClasses: 'wfob_color_picker',
            },

            // Featured Image section start
            {
                type: "label",
                label: wfob_localization.design.featured_image_border_label,
                styleClasses: 'wfob_design_box_heading',
            },
            {
                type: "switch",
                label: wfob_localization.design.border,
                model: "enable_featured_image_border",
                styleClasses: 'wfob_field_switch_border',
            },

            {
                type: "input",
                inputType: "number",
                model: "featured_image_border_width",
                visible: (model) => {
                    return model.enable_featured_image_border;
                },
                validator: VueFormGenerator.validators.number,
                styleClasses: 'wfob_field_border_width',
            },
            {
                type: "select",
                model: "featured_image_border_style",
                styleClasses: 'wfob_field_border_style',
                values: () => {
                    return Object.create(wfob_localization.design.border_type);
                },
                visible: (model) => {
                    return model.enable_featured_image_border;
                },
                selectOptions: {hideNoneSelectedText: true},

            },

            {
                type: "input",
                inputType: "text",
                model: "featured_image_border_color",
                id: "featured_image_border_color",
                visible: (model) => {
                    return model.enable_featured_image_border;
                },
                styleClasses: ['wfob_color_picker', 'wfob_color_picker_border'],
            },


            // box border started
            {
                type: "label",
                label: wfob_localization.design.additional_settings,
                styleClasses: 'wfob_design_box_heading',

            },
            {
                type: "input",
                inputType: "number",
                label: wfob_localization.design.padding,
                model: "box_padding",
                'attributes': {
                    'min': "0",
                },
                validator: VueFormGenerator.validators.number
            },
            {
                type: "input",
                inputType: "number",
                label: wfob_localization.design.bump_max_width,
                model: "bump_max_width",
                id: "bump_max_width",
                'attributes': {
                    'min': "200",
                },
                'hint': wfob_localization.design.bump_max_width_hint,
                styleClasses: 'wfob_bump_maxwidth',

            },
            {
                type: "input",
                inputType: "text",
                label: wfob_localization.design.background,
                id: "box_background",
                model: "box_background",
                styleClasses: 'wfob_color_picker form-group-clear',
            },
            {
                type: "input",
                inputType: "text",
                label: wfob_localization.design.hover_background,
                id: "box_background_hover",
                model: "box_background_hover",
                styleClasses: 'wfob_color_picker',
            },
            {
                type: "switch",
                label: wfob_localization.design.border,
                model: "enable_box_border",
                styleClasses: 'wfob_field_switch_border form-group-clear',
            },
            {
                type: "input",
                inputType: "number",
                model: "border_width",
                label: wfob_localization.design.border_width,
                visible: (model) => {
                    return model.enable_box_border;
                },
                validator: VueFormGenerator.validators.number,
                styleClasses: 'wfob_field_border_width form-group-clear',
            },
            {
                type: "select",
                model: "border_style",
                label: wfob_localization.design.border_style,
                styleClasses: 'wfob_field_border_style',
                visible: (model) => {
                    return model.enable_box_border;
                },
                values: () => {
                    return Object.create(wfob_localization.design.border_type);
                },
                selectOptions: {hideNoneSelectedText: true},
            },
            {
                type: "input",
                inputType: "text",
                label: wfob_localization.design.border_color,
                model: "border_color",
                id: "border_color",
                styleClasses: ['wfob_color_picker', 'wfob_color_picker_border'],
                visible: (model) => {
                    return model.enable_box_border;
                }
            },
        ];
    }

    get_css() {
        let model = this.model;

        function get_box_css() {
            if (model.border_width < 1 || model.border_style === 'none') {
                return '';
            }
            let style = [];
            if (model.enable_box_border) {
                style.push('border:' + model.border_width + "px " + model.border_style + " " + model.border_color);
            }
            style.push('padding:' + model.box_padding + "px");
            style.push('background:' + model.box_background);
            return style.join(';');
        }

        function get_heading_box_style() {
            let style = [];
            style.push('background:' + model.heading_background);
            style.push('padding:' + model.heading_box_padding + "px");
            style.push('font-size:' + model.heading_font_size + "px");
            style.push('border-bottom-width:0');
            return style.join(';');
        }

        function get_heading_box_hover_style() {
            let style = [];
            style.push('background:' + model.heading_hover_background);
            return style.join(';');
        }

        function get_heading_style() {
            let style = [];
            style.push('color:' + model.heading_color);

            return style.join(';');
        }

        function get_heading_hover_style() {
            let style = [];
            style.push('color:' + model.heading_hover_color);

            return style.join(';');
        }

        function get_price_box_style() {
            let style = [];
            style.push('color:' + model.price_color);
            style.push('font-size:' + model.price_font_size + "px");
            style.push('border-bottom-width:0');
            return style.join(';');
        }

        function get_sale_price_box_style() {
            let style = [];
            style.push('color:' + model.price_sale_color);
            return style.join(';');
        }

        function get_content_box_style() {
            let style = [];

            style.push('color:' + model.content_color);
            style.push('padding:' + model.content_box_padding + "px");
            style.push('font-size:' + model.content_font_size + "px");
            return style.join(';');
        }

        function get_content_featured_image_style() {
            let style = [];
            if (model.enable_featured_image_border) {
                style.push('border:' + model.featured_image_border_width + "px " + model.featured_image_border_style + " " + model.featured_image_border_color);
            }
            return style.join(';');
        }


        let css = {};
        css['.wfob_bump_r_outer_wrap .wfob_wrapper.wfob_bump .wfob_bgBox_table'] = get_heading_box_style();
        css['.wfob_bump_r_outer_wrap .wfob_wrapper.wfob_bump .wfob_bgBox_table:hover'] = get_heading_box_hover_style();
        css['.wfob_bump_r_outer_wrap .wfob_wrapper.wfob_bump .wfob_bgBox_table .wfob_title'] = get_heading_style();
        css['.wfob_bump_r_outer_wrap .wfob_wrapper.wfob_bump .wfob_bgBox_table .wfob_title:hover'] = get_heading_hover_style();
        css['.wfob_bump_r_outer_wrap .wfob_wrapper.wfob_bump .wfob_price_container'] = get_price_box_style();
        css['.wfob_bump_r_outer_wrap .wfob_wrapper.wfob_bump .wfob_price_container span.woocommerce-Price-amount.amount'] = 'font-size:' + model.price_font_size + "px;";
        css['.wfob_bump_r_outer_wrap .wfob_wrapper.wfob_bump .wfob_price_container .wfob_price ins'] = get_sale_price_box_style();
        css['.wfob_bump_r_outer_wrap .wfob_wrapper.wfob_bump .wfob_contentBox'] = get_content_box_style();
        css['.wfob_bump_r_outer_wrap .wfob_wrapper.wfob_bump .wfob_qv-button'] = 'color:' + model.content_variation_link_color + ";";
        css['.wfob_bump_r_outer_wrap .wfob_wrapper.wfob_bump .wfob_qv-button:hover'] = 'color:' + model.content_variation_link_hover_color + ";";
        css['.wfob_bump_r_outer_wrap'] = 'max-width:' + model.bump_max_width + "px;";
        css['.wfob_bump_r_outer_wrap .wfob_wrapper.wfob_bump .wfob_contentBox .wfob_pro_img_wrap'] = get_content_featured_image_style();
        css['.wfob_bump_r_outer_wrap .wfob_wrapper.wfob_bump'] = get_box_css();

        return css;
    }

}
class wfob_bump_layout_2 extends wfob_bump_layout_1 {
    constructor(data) {
        super(data);
        this.id='layout_2';
    }
}

class wfob_bump_layout_3 extends wfob_bump {
    constructor(data) {
        super(data);
        this.id='layout_1';
    }

    get_content_fields() {
        let products = wfob_data.products;
        let output = [];
        if (wfob.tools.ol(products) == 0) {
            return output;
        }
        for (let i in products) {
            let product = products[i];
            output.push({"type": "label", "label": product.title});
            let title = {
                "type": "input",
                "inputType": "text",
                "label": wfob_localization.design.title,
                "model": "product_" + i + "_title",
                "styleClasses": "hint_custom_cls_wrap",
                "hint": wfob_localization.design.title_hint
            };
            output.push(title);
            let description = {
                "type": "textArea",
                "label": wfob_localization.design.description,
                "rows": 3,
                "model": "product_" + i + "_description",
                "styleClasses": "hint_custom_cls_wrap wfob_multi_hint_cls",
                'attributes': {
                    'id': "product_" + i + "_description",
                    'class': 'form-control wfob_editor_field'
                },
                "hint": wfob_localization.design.description_hint
            };
            output.push(description);
            let image = {
                'type': 'switch',
                'label': wfob_localization.design.feature_image,
                'model': 'product_' + i + '_featured_image',
                'textOn': wfob_localization.design.textOn,
                'textOff': wfob_localization.design.textOff,
            };
            output.push(image);
        }
        return output;
    }

    get_fields() {
        return [
            //Product title section started
            {
                type: "label",
                label: wfob_localization.design.title_box,
                styleClasses: 'wfob_design_box_heading',

            },
            {
                type: "input",
                inputType: "text",
                label: wfob_localization.design.background,
                model: "heading_background",
                id: "heading_background",
                styleClasses: 'wfob_color_picker',
            },
            {
                type: "input",
                inputType: "text",
                label: wfob_localization.design.hover_background,
                model: "heading_hover_background",
                id: "heading_hover_background",
                styleClasses: 'wfob_color_picker',

            },
            {
                type: "input",
                inputType: "number",
                label: wfob_localization.design.padding,
                model: "heading_box_padding",
                'attributes': {
                    'min': "0",
                },
                validator: VueFormGenerator.validators.string
            },
            {
                type: "input",
                inputType: "text",
                label: wfob_localization.design.text_color,
                model: "heading_color",
                id: 'heading_color',
                styleClasses: 'wfob_color_picker form-group-clear',
            },
            {
                type: "input",
                inputType: "text",
                label: wfob_localization.design.text_hover_color,
                model: "heading_hover_color",
                id: 'heading_hover_color',
                styleClasses: 'wfob_color_picker',
            },
            {
                type: "input",
                inputType: "text",
                label: wfob_localization.design.error_color,
                model: "error_color",
                id: "error_color",

                styleClasses: ['wfob_color_picker', 'wfob_color_picker_error'],
            },
            {
                type: "switch",
                label: wfob_localization.design.header_enable_pointing_arrow,
                model: "header_enable_pointing_arrow",
                validator: VueFormGenerator.validators.string,
                styleClasses: 'wfob_pointer_arrow',
            },
            {
                type: "select",
                label: wfob_localization.design.point_animation,
                model: "point_animation",
                values: () => {
                    return Object.create(wfob_localization.design.yes_no_drop_down);
                },
                visible: (model) => {
                    return (model.header_enable_pointing_arrow);
                },
                selectOptions: {hideNoneSelectedText: true},
                validator: VueFormGenerator.validators.string,
                styleClasses: 'wfob_pointer_animation',
            },


            // Price product section
            {
                type: "label",
                label: wfob_localization.design.price_box,
                styleClasses: 'wfob_design_box_heading',
            },
            {
                type: "select",
                label: wfob_localization.design.enable_price,
                model: "enable_price",
                values: () => {
                    return Object.create(wfob_localization.design.yes_no_drop_down);
                },
                id: "enable_price",
                selectOptions: {hideNoneSelectedText: true},
            },
            {
                type: "input",
                inputType: "number",
                label: wfob_localization.design.font_size,
                styleClasses: 'wfob_number_field',
                model: "price_font_size",
                'attributes': {
                    'min': "10",
                },
                visible: (model) => {
                    return model.enable_price === '1';
                },
                validator: VueFormGenerator.validators.number,
            },
            {
                type: "input",
                inputType: "text",
                label: wfob_localization.design.price_color,
                model: "price_color",
                id: "price_color",
                styleClasses: 'wfob_color_picker form-group-clear',
                visible: (model) => {
                    return model.enable_price === '1';
                },
            },
            {
                type: "input",
                inputType: "text",
                label: wfob_localization.design.price_sale_color,
                model: "price_sale_color",
                id: "price_sale_color",
                styleClasses: 'wfob_color_picker',
                visible: (model) => {
                    return model.enable_price === '1';
                },
            },


            // description box color
            {
                type: "label",
                label: wfob_localization.design.description_box,
                styleClasses: 'wfob_design_box_heading',
            },
            {
                type: "input",
                inputType: "number",
                label: wfob_localization.design.padding,
                model: "content_box_padding",
                'attributes': {
                    'min': "0",
                },
                validator: VueFormGenerator.validators.number,
            },
            {
                type: "input",
                inputType: "text",
                label: wfob_localization.design.text_color,
                model: "content_color",
                id: "content_color",
                styleClasses: 'wfob_color_picker',
            },
            {
                type: "input",
                inputType: "text",
                label: wfob_localization.design.content_variation_link_color,
                model: "content_variation_link_color",
                id: "content_variation_link_color",
                styleClasses: 'wfob_color_picker form-group-clear',
            },
            {
                type: "input",
                inputType: "text",
                label: wfob_localization.design.content_variation_link_hover_color,
                model: "content_variation_link_hover_color",
                id: "content_variation_link_hover_color",
                styleClasses: 'wfob_color_picker',
            },

            // Featured Image section start
            {
                type: "label",
                label: wfob_localization.design.featured_image_border_label,
                styleClasses: 'wfob_design_box_heading',
            },
            {
                type: "switch",
                label: wfob_localization.design.border,
                model: "enable_featured_image_border",
                styleClasses: 'wfob_field_switch_border',
            },

            {
                type: "input",
                inputType: "number",
                model: "featured_image_border_width",
                visible: (model) => {
                    return model.enable_featured_image_border;
                },
                validator: VueFormGenerator.validators.number,
                styleClasses: 'wfob_field_border_width',
            },
            {
                type: "select",
                model: "featured_image_border_style",
                styleClasses: 'wfob_field_border_style',
                values: () => {
                    return Object.create(wfob_localization.design.border_type);
                },
                visible: (model) => {
                    return model.enable_featured_image_border;
                },
                selectOptions: {hideNoneSelectedText: true},

            },

            {
                type: "input",
                inputType: "text",
                model: "featured_image_border_color",
                id: "featured_image_border_color",
                visible: (model) => {
                    return model.enable_featured_image_border;
                },
                styleClasses: ['wfob_color_picker', 'wfob_color_picker_border'],
            },


            // box border started
            {
                type: "label",
                label: wfob_localization.design.additional_settings,
                styleClasses: 'wfob_design_box_heading',

            },
            {
                type: "input",
                inputType: "number",
                label: wfob_localization.design.padding,
                model: "box_padding",
                'attributes': {
                    'min': "0",
                },
                validator: VueFormGenerator.validators.number
            },
            {
                type: "input",
                inputType: "number",
                label: wfob_localization.design.bump_max_width,
                model: "bump_max_width",
                id: "bump_max_width",
                'attributes': {
                    'min': "200",
                },
                'hint': wfob_localization.design.bump_max_width_hint,
                styleClasses: 'wfob_bump_maxwidth',

            },
            {
                type: "input",
                inputType: "text",
                label: wfob_localization.design.background,
                id: "box_background",
                model: "box_background",
                styleClasses: 'wfob_color_picker form-group-clear',
            },
            {
                type: "input",
                inputType: "text",
                label: wfob_localization.design.hover_background,
                id: "box_background_hover",
                model: "box_background_hover",
                styleClasses: 'wfob_color_picker',
            },
            {
                type: "switch",
                label: wfob_localization.design.border,
                model: "enable_box_border",
                styleClasses: 'wfob_field_switch_border form-group-clear',
            },
            {
                type: "input",
                inputType: "number",
                model: "border_width",
                label: wfob_localization.design.border_width,
                visible: (model) => {
                    return model.enable_box_border;
                },
                validator: VueFormGenerator.validators.number,
                styleClasses: 'wfob_field_border_width form-group-clear',
            },
            {
                type: "select",
                model: "border_style",
                label: wfob_localization.design.border_style,
                styleClasses: 'wfob_field_border_style',
                visible: (model) => {
                    return model.enable_box_border;
                },
                values: () => {
                    return Object.create(wfob_localization.design.border_type);
                },
                selectOptions: {hideNoneSelectedText: true},
            },
            {
                type: "input",
                inputType: "text",
                label: wfob_localization.design.border_color,
                model: "border_color",
                id: "border_color",
                styleClasses: ['wfob_color_picker', 'wfob_color_picker_border'],
                visible: (model) => {
                    return model.enable_box_border;
                }
            },
        ];
    }

    get_css() {
        let model = this.model;

        function get_box_css() {
            if (model.border_width < 1 || model.border_style === 'none') {
                return '';
            }
            let style = [];
            if (model.enable_box_border) {
                style.push('border:' + model.border_width + "px " + model.border_style + " " + model.border_color);
            }
            style.push('padding:' + model.box_padding + "px");
            style.push('background:' + model.box_background);
            return style.join(';');
        }

        function get_heading_box_style() {
            let style = [];
            style.push('background:' + model.heading_background);
            style.push('padding:' + model.heading_box_padding + "px");
            style.push('font-size:' + model.heading_font_size + "px");
            style.push('border-bottom-width:0');
            return style.join(';');
        }

        function get_heading_box_hover_style() {
            let style = [];
            style.push('background:' + model.heading_hover_background);
            return style.join(';');
        }

        function get_heading_style() {
            let style = [];
            style.push('color:' + model.heading_color);

            return style.join(';');
        }

        function get_heading_hover_style() {
            let style = [];
            style.push('color:' + model.heading_hover_color);

            return style.join(';');
        }

        function get_price_box_style() {
            let style = [];
            style.push('color:' + model.price_color);
            style.push('font-size:' + model.price_font_size + "px");
            style.push('border-bottom-width:0');
            return style.join(';');
        }

        function get_sale_price_box_style() {
            let style = [];
            style.push('color:' + model.price_sale_color);
            return style.join(';');
        }

        function get_content_box_style() {
            let style = [];

            style.push('color:' + model.content_color);
            style.push('padding:' + model.content_box_padding + "px");
            style.push('font-size:' + model.content_font_size + "px");
            return style.join(';');
        }

        function get_content_featured_image_style() {
            let style = [];
            if (model.enable_featured_image_border) {
                style.push('border:' + model.featured_image_border_width + "px " + model.featured_image_border_style + " " + model.featured_image_border_color);
            }
            return style.join(';');
        }


        let css = {};
        css['.wfob_bump_r_outer_wrap .wfob_wrapper.wfob_bump .wfob_bgBox_table'] = get_heading_box_style();
        css['.wfob_bump_r_outer_wrap .wfob_wrapper.wfob_bump .wfob_bgBox_table:hover'] = get_heading_box_hover_style();
        css['.wfob_bump_r_outer_wrap .wfob_wrapper.wfob_bump .wfob_bgBox_table .wfob_title'] = get_heading_style();
        css['.wfob_bump_r_outer_wrap .wfob_wrapper.wfob_bump .wfob_bgBox_table .wfob_title:hover'] = get_heading_hover_style();
        css['.wfob_bump_r_outer_wrap .wfob_wrapper.wfob_bump .wfob_price_container'] = get_price_box_style();
        css['.wfob_bump_r_outer_wrap .wfob_wrapper.wfob_bump .wfob_price_container span.woocommerce-Price-amount.amount'] = 'font-size:' + model.price_font_size + "px;";
        css['.wfob_bump_r_outer_wrap .wfob_wrapper.wfob_bump .wfob_price_container .wfob_price ins'] = get_sale_price_box_style();
        css['.wfob_bump_r_outer_wrap .wfob_wrapper.wfob_bump .wfob_contentBox'] = get_content_box_style();
        css['.wfob_bump_r_outer_wrap .wfob_wrapper.wfob_bump .wfob_qv-button'] = 'color:' + model.content_variation_link_color + ";";
        css['.wfob_bump_r_outer_wrap .wfob_wrapper.wfob_bump .wfob_qv-button:hover'] = 'color:' + model.content_variation_link_hover_color + ";";
        css['.wfob_bump_r_outer_wrap'] = 'max-width:' + model.bump_max_width + "px;";
        css['.wfob_bump_r_outer_wrap .wfob_wrapper.wfob_bump .wfob_contentBox .wfob_pro_img_wrap'] = get_content_featured_image_style();
        css['.wfob_bump_r_outer_wrap .wfob_wrapper.wfob_bump'] = get_box_css();

        return css;
    }

}

register_layouts.layout_1= wfob_bump_layout_1;
register_layouts.layout_2= wfob_bump_layout_2;