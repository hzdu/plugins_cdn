/* global jQuery , acfw_loyalprog_args */

/**
 * My account loyalty program tab events.
 * 
 * @since 1.9
 * 
 * @param {object} $ jQuery object.
 */
export function my_account_events($ = jQuery) {

    const loyalProg = document.querySelector( "#acfw-loyalty-programs-myaccount" );

    $( loyalProg ).on( "change keyup" , "#redeem_points" , calculate_amount_preview_from_points );
    $( loyalProg ).on( "change keyup" , "#redeem_points_worth" , calculate_points_from_amount_preview );
    $( loyalProg ).on( "submit" , "#redeem-points-form" , user_redeem_points );
    $( loyalProg ).on( "keyup mouseup mousewheel validate" , "#redeem_points" , validate_points_amount );
    $( window ).on( "resize" , fix_overlay_position );

    ajax_refresh_user_points();
    $( window ).trigger( "resize" );
}

/**
 * Calculate amount preview when redeem points input value is changed.
 * 
 * @since 1.9
 */
function calculate_amount_preview_from_points() {

    const $this   = jQuery( this ),
        $field    = $this.closest( "#redeem_points_field" ),
        $display  = $field.find( "#redeem_points_worth" ),
        amount    = ( $this.val() / acfw_loyalprog_args.redeem_ratio ) * acfw_loyalprog_args.currency_ratio,
        formatted = amount.toFixed(2);

    $display.val( `${ formatted }` );
}

/**
 * Calculate points based on amount preview value change.
 * 
 * @since 1.9
 * 
 * @param {object} e Event object.
 */
function calculate_points_from_amount_preview(e) {

    const $this = jQuery( this ),
        $field  = $this.closest( "#redeem_points_field" ),
        $points = $field.find( "#redeem_points" );

    let amount = parseFloat( $this.val() );
    amount = amount ? amount : 0;

    let points = parseInt( ( amount / acfw_loyalprog_args.currency_ratio ) * acfw_loyalprog_args.redeem_ratio );

    if ( e.type == "change" ) $this.val( amount.toFixed(2) );
    $points.val( points );
    $points.trigger( "validate" );
}

/**
 * Function to update user points display.
 * 
 * @since 1.9
 * @since 1.11 Add points expiration message support.
 * 
 * @param {int}    user_points User points new value.
 * @param {string} worth       Points worth on price format.
 * @param {string} expire_msg  Points expiration message.
 */
function refresh_user_points( user_points , worth , expire_msg = "" ) {

    const loyalProg = document.querySelector( "#acfw-loyalty-programs-myaccount" ),
        userPoints  = loyalProg.querySelector( ".user-points strong" ),
        pointsWorth = loyalProg.querySelector( ".user-points em span.amount" ),
        expireMsg   = loyalProg.querySelector( ".user-points .expiry-note" ),
        pointsField = loyalProg.querySelector( "#redeem_points" );

    jQuery( userPoints ).text( user_points );
    jQuery( pointsField ).prop( "max" , user_points );
    jQuery( pointsWorth ).replaceWith( worth );
    jQuery( expireMsg ).html( expire_msg );
}

/**
 * Function to append user coupon to table.
 * 
 * @since 1.9
 * 
 * @param {object} object Destructurized object of coupon data. 
 */
function append_user_coupon( { code , amount , date , action } ) {

    const loyalProg  = document.querySelector( "#acfw-loyalty-programs-myaccount" ),
        couponTable  = loyalProg.querySelector( ".user-redeemed-coupons table" ),
        tableTbody   = couponTable.querySelector( "tbody" );

    let applyMarkup = "";

    if ( acfw_loyalprog_args.is_uc_module && action ) {
        applyMarkup = `
            <a class="button" href="${ action }">
                ${ acfw_loyalprog_args.coupon_apply_text }
            </a>
        `;
    }

    jQuery( tableTbody ).find( "tr.no-coupon-tr" ).remove();

    jQuery( tableTbody ).prepend(`
        <tr class="new">
            <td class="coupon_code">${ code }</td>
            <td class="coupon_amount">${ amount }</td>
            <td class="coupon_created">${ date }</td>
            <td class="actions">${ applyMarkup }</td>
        </tr>
    `);

}

/**
 * AJAX refresh user points.
 * 
 * @since 1.9
 */
function ajax_refresh_user_points() {

    jQuery.post( acfw_loyalprog_args.ajaxurl , {
        action : "acfw_lp_refresh_user_points",
        nonce  : acfw_loyalprog_args.refresh_nonce,
    } , ( response ) => {

        if ( response.status == "success" )
            refresh_user_points( response.user_points , response.worth , response.expire_msg );

    } , "json" );
}

/**
 * When input field has invalid points value, set button as disabled.
 * 
 * @since 1.9
 */
function validate_points_amount() {

    const $this = jQuery(this),
        $form   = $this.closest( "#redeem-points-form" ),
        $button = $form.find( "#redeem_submit_field button" ),
        val     = parseInt( $this.val() ),
        min     = parseInt( $this.prop( "min" ) ),
        max     = parseInt( $this.prop( "max" ) );

    if ( val !== 0 && val >= min && val <= max )
        $button.prop( "disabled" , false )
    else
        $button.prop( "disabled" , true );
}

/**
 * Function to redeem user points.
 * 
 * @since 1.9
 */
function user_redeem_points(e) {

    e.preventDefault();
    const $form  = jQuery(this),
        formData = $form.serializeArray();

    $form.find( ".input-text,button" ).prop( "disabled" , true );
    toggle_overlay();
    
    jQuery.post( acfw_loyalprog_args.ajaxurl , formData , ( response ) => {

        if ( response.status == "success" ) {

            refresh_user_points( response.points , response.worth , response.expire_msg );
            append_user_coupon( response );

        } else {
            // TODO: change to vex.
            alert( response.error_msg );
        }

        $form.find( ".input-text" ).val( 0 );
        $form.find( ".input-text,.button" ).prop( "disabled" , false );
        toggle_overlay( "hide" );

    } , "json" );
}

/**
 * Fix overlay position on window resize and first load.
 * 
 * @since 1.9
 */
function fix_overlay_position() {

    const loyalProg = document.querySelector( "#acfw-loyalty-programs-myaccount" ),
        overlay     = loyalProg.querySelector( ".acfw-overlay" ),
        leftPadding = jQuery( loyalProg ).offset().left + ( ( jQuery( loyalProg ).width() / 2 ) - 20 );
    
    jQuery( overlay ).css( 'backgroundPosition' , `${ leftPadding }px 50%` );
}

/**
 * Toggle overlay display.
 * 
 * @param {string} toggle Hide or show. 
 */
function toggle_overlay( toggle = "show" ) {

    const loyalProg = document.querySelector( "#acfw-loyalty-programs-myaccount" ),
        overlay     = loyalProg.querySelector( ".acfw-overlay" ),
        display     = toggle == "show" ? "block" : "none";

    jQuery( overlay ).css( "display" , display );
}

/***
 * Format money based on parameters.
 * source: https://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-dollars-currency-string-in-javascript#149099
 * 
 * @since 1.9
 * 
 * @param {float}     amount       Amount to format.
 * @param {int}       decimalCount Decimal space count.
 * @param {string}    decimal      Decimal symbol.
 * @param {thousands} thousands    Thousands symbol.
 */
function format_money( amount , decimalCount = 2 , decimal = "." , thousands = "," ) {

    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
    let j = (i.length > 3) ? i.length % 3 : 0;

    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
};