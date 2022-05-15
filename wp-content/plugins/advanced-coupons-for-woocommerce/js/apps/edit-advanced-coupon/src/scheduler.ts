declare var jQuery: any;
declare var acfw_edit_coupon: any;
declare var vex: any;

const $ = jQuery;
let isValidating = false;

/**
 * Edit link scheduler fields script.
 *
 * @since 2.0
 *
 * @param object $ jQuery object.
 */
export default function edit_link_scheduler_fields() {

    const scheduler_tab: HTMLElement              = document.querySelector( "#acfw_scheduler" ),
        schedule_start_field: HTMLInputElement    = scheduler_tab.querySelector( "#_acfw_schedule_start" ),
        schedule_expire_field: HTMLInputElement   = scheduler_tab.querySelector( "#_acfw_schedule_expire" ),
        wc_default_expiry_field: HTMLInputElement = document.querySelector( "#general_coupon_data p.expiry_date_field" );

    // validate scheduler date range.
    $( scheduler_tab ).on( "change" , ".date-field" , addDefaultTimeValues );
    $( scheduler_tab ).on( "change" , ".date-hour" , validateHourField );
    $( scheduler_tab ).on( "change" , ".date-minute" , validateMinuteField );
    $( scheduler_tab ).on( "change" , ".date-field,.date-hour,.date-minute" , validate_schedule_date_range );
    $( scheduler_tab ).on( "change" , ".date-field,.date-hour,.date-minute" , toggle_fields_required_prop );
    $( scheduler_tab ).on( "click" , ".clear-scheduler-fields" , clear_scheduler_fields_values );

    // hide the default WC coupon expiry date field from the DOM.
    $( wc_default_expiry_field ).css( 'display' , 'none' );

    // set start date
    $( schedule_start_field ).datepicker({
        dateFormat      : "yy-mm-dd",
        numberOfMonths  : 1,
        showButtonPanel : true,
        maxDate         : get_date( schedule_expire_field ),
    }).on( "change" , () => {
        $( schedule_expire_field ).datepicker( "option" , "minDate" , get_date( schedule_start_field ) );
    }  );

    // set expire date
    $( schedule_expire_field ).datepicker({
        dateFormat      : "yy-mm-dd",
        numberOfMonths  : 1,
        showButtonPanel : true,
        minDate         : get_date( schedule_start_field )
    }).on( "change" , () => $( schedule_start_field ).datepicker( "option" , "maxDate" , get_date( schedule_expire_field ) ) );

    $( schedule_start_field ).trigger( "change" );
    $( schedule_expire_field ).trigger( "change" );
}

/**
 * Add default time values (00) to hour and minute fields when the date value is changed.
 * 
 * @since 2.5
 */
function addDefaultTimeValues() {

    const $this   = $(this);
    const $field  = $this.closest('.date-time-field');
    const $hour   = $field.find('input.date-hour');
    const $minute = $field.find('input.date-minute');

    if  ( $this.val() ) {
        if ( ! $hour.val() ) $hour.val( '00' );
        if ( ! $minute.val() ) $minute.val( '00' );
    }
}

/**
 * Validate hour field value.
 * 
 * @since 2.5
 */
function validateHourField() {

    const $this = $(this);
    const value = $this.val().toString();
    const valueInt = parseInt(value);

    if ( ! value || valueInt > 23 || valueInt < 0 ) {
        const prevValue = $this.closest('.date-time-field').data('hour');
        $this.val(prevValue ? prevValue : '');
    } else {
        $this.val( ('0' + value).slice(-2) );
    }
}

/**
 * Validate minute field value.
 * 
 * @since 2.5
 */
function validateMinuteField() {

    const $this = $(this);
    const value = $this.val().toString();
    const valueInt = parseInt(value);

    if ( ! value || valueInt > 59 || valueInt < 0 ) {
        const prevValue = $this.closest('.date-time-field').data('hour');
        $this.val(prevValue ? prevValue : '');
    } else {
        $this.val( ('0' + value).slice(-2) );
    }
}

/**
 * Get date field valid date value.
 *
 * @since 2.0
 *
 * @param object element Date field DOM element.
 * @param object $       jQuery object.
 * @return string Valid date value.
 */
function get_date( element: HTMLInputElement ): string {

    let date: string;
    try {
        date = $.datepicker.parseDate( "yy-mm-dd" , element.value );
    } catch( error ) {
        date = null;
        console.log( error );
    }

    return date;
}

/**
 * Validate schedule date range.
 * 
 * @since 2.1
 */
function validate_schedule_date_range() {

    // prevent validating running more than once.
    if ( isValidating ) return;

    isValidating = true;

    const scheduler_tab: HTMLElement        = document.querySelector( "#acfw_scheduler" ),
        start_date_field: HTMLInputElement  = scheduler_tab.querySelector( "._acfw_schedule_start_field .date-time-field" ),
        expire_date_field: HTMLInputElement = scheduler_tab.querySelector( "._acfw_schedule_expire_field .date-time-field" ),
        start_date_val: string              = $( start_date_field ).find( ".date-field" ).val(),
        end_date_val: string                = $( expire_date_field ).find( ".date-field" ).val();

    if ( start_date_val && end_date_val && start_date_val === end_date_val ) {

        const startTime = get_time_in_seconds( $( start_date_field ) ),
            endTime     = get_time_in_seconds( $( expire_date_field ) );

        if ( startTime >= 0 && endTime >= 0 && startTime >= endTime ) {

            // reset schedule start to previous values.
            $( start_date_field ).find( ".date-field" ).val( $( start_date_field ).data( "date" ) );
            $( start_date_field ).find( ".date-hour" ).val( $( start_date_field ).data( "hour" ) );
            $( start_date_field ).find( ".date-minute" ).val( $( start_date_field ).data( "minute" ) );

            // reset schedule expire to previous values.
            $( expire_date_field ).find( ".date-field" ).val( $( expire_date_field ).data( "date" ) );
            $( expire_date_field ).find( ".date-hour" ).val( $( expire_date_field ).data( "hour" ) );
            $( expire_date_field ).find( ".date-minute" ).val( $( expire_date_field ).data( "minute" ) );

            vex.dialog.alert({
                unsafeMessage : acfw_edit_coupon.invalid_scheduler_time,
                afterClose: () => isValidating = false
            });
            return;
        }
    }

    // save schedule start valid value into data props.
    $( start_date_field )
        .data( "date" , $( start_date_field ).find( ".date-field" ).val() )
        .data( "hour" , $( start_date_field ).find( ".date-hour" ).val() )
        .data( "minute" , $( start_date_field ).find( ".date-minute" ).val() );

    // save schedule expire valid value into data props.
    $( expire_date_field )
        .data( "date" , $( expire_date_field ).find( ".date-field" ).val() )
        .data( "hour" , $( expire_date_field ).find( ".date-hour" ).val() )
        .data( "minute" , $( expire_date_field ).find( ".date-minute" ).val() );

    isValidating = false;
}

/**
 * Get sum of hour and time values in seconds.
 * 
 * @since 2.1
 * 
 * @param $parent .date-time-field field wrapper.
 */
function get_time_in_seconds( $parent: any ) {

    if ( ! $parent.find( ".date-hour" ).val() || ! $parent.find( ".date-minute" ).val() )
        return -1;
    
    const hour = parseInt( $parent.find( ".date-hour" ).val() ) * 60 * 60 || 0,
        minute = parseInt( $parent.find( ".date-minute" ).val() ) * 60 || 0;

    return hour + minute;
}

/**
 * Toggle scheduler fields required prop. 
 * Set to true when at least one of the date/time fields have value, false when all fields are blank.
 * 
 * @since 2.1
 */
function toggle_fields_required_prop() {

    const $parent = $(this).closest( ".date-time-field" ),
        $date     = $parent.find( ".date-field" ),
        $hour     = $parent.find( ".date-hour" ),
        $minute   = $parent.find( ".date-minute" );

    if ( $date.val() || $hour.val() || $minute.val() ) {

        $date.prop( 'required' , true );
        $hour.prop( 'required' , true );
        $minute.prop( 'required' , true );

    } else {

        $date.prop( 'required' , false );
        $hour.prop( 'required' , false );
        $minute.prop( 'required' , false );
    }
}

/**
 * Clear scheduler field values and set to not required.
 * 
 * @since 2.1
 */
function clear_scheduler_fields_values() {

    const scheduler_tab: HTMLElement              = document.querySelector( "#acfw_scheduler" ),
        schedule_start_field: HTMLInputElement    = scheduler_tab.querySelector( "#_acfw_schedule_start" ),
        schedule_expire_field: HTMLInputElement   = scheduler_tab.querySelector( "#_acfw_schedule_expire" );

    const $datefield = $(this).siblings( ".date-time-field" );
    $datefield.find( "input" ).prop( 'required' , false ).val( '' );

    $( schedule_start_field ).trigger( "change" );
    $( schedule_expire_field ).trigger( "change" );
}