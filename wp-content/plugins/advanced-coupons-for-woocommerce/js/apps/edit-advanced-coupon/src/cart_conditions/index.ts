import register_product_quantity from "./fields/product_quantity";
import register_customer_registration_date from "./fields/customer_registration_date";
import register_customer_last_ordered from "./fields/customer_last_ordered";
import register_total_customer_spend from "./fields/total_customer_spend";
import register_has_ordered_before from "./fields/has_ordered_before";
import register_shipping_zone_region from "./fields/shipping_zone_region";
import register_custom_taxonomy from "./fields/custom_taxonomy";
import register_custom_meta from "./fields/custom_meta";

declare var jQuery: any;

const $: any = jQuery;

/**
 * Initialize cart conditions and register premium cart condition fields.
 * 
 * @since 2.0
 */
export default function initialize_cart_conditions() {

    const module_block: HTMLElement = document.querySelector( "#acfw_cart_conditions" );

    register_product_quantity();
    register_customer_registration_date();
    register_customer_last_ordered();
    register_total_customer_spend();
    register_has_ordered_before();
    register_shipping_zone_region();
    register_custom_taxonomy();
    register_custom_meta();

    // restrictions
    $( module_block ).on( "change" , "input.condition-value" , validate_condition_value_based_on_type );
}

/**
 * Validate condition value based on type.
 * 
 * @since 2.2.3
 */
function validate_condition_value_based_on_type() {

    const $value: JQuery       = $(this),
        $field: JQuery         = $value.closest( ".condition-field" ),
        $type: JQuery<Element> = $field.find( "select.value-type" );

    // custom meta number type. make sure we round the value on change.
    if ( $type.val() === "number" ) {
        const number = parseInt( $value.val() + "" );
        $value.val( ! isNaN(number) ? Math.round( number ) : '' );
    }
}