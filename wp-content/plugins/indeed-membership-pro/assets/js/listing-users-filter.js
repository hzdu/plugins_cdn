/*
* Ultimate Membership Pro - Members Directory
*/
"use strict";
jQuery( window ).on( 'load', function(){

    jQuery('#iump_reset_bttn').on("click", function(event){
        event.preventDefault();
        window.location.href = jQuery( '.ihc-js-listing-user-filter-form' ).attr( 'data-base_url' );
        return false;
    });

    jQuery("[name=filter]").on('click', function(event){
      event.preventDefault();
      jQuery.each(this.form, function(index, field){
        if (field.value==''){
          field.name = '';
        }
      });
      jQuery('[name=iump_filter]').val(1);
      this.form.submit();
    });

    if ( jQuery( '.ihc-js-listing-users-filter-data' ).length ){
        jQuery( '.ihc-js-listing-users-filter-data' ).each( function( e, html ){
            var currentYear = new Date().getFullYear() + 20;
            jQuery( jQuery( this ).attr( 'data-start_selector' ) ).datepicker({
              dateFormat : "dd-mm-yy",
              changeMonth: true,
              changeYear: true,
              yearRange: "1900:"+currentYear,
              onClose: function(r){}
            });
            jQuery( jQuery( this ).attr( 'data-end_selector' ) ).datepicker({
              dateFormat : "dd-mm-yy",
              changeMonth: true,
              changeYear: true,
              yearRange: "1900:"+currentYear,
              onClose: function(r){}
            });
        });
    }

    if ( jQuery( '.ihc-js-listin-users-filter-number-data' ).length ){
        jQuery( '.ihc-js-listin-users-filter-number-data' ).each( function( e, html ){
            var selector = jQuery( this ).attr('data-selector');
            var min = jQuery( this ).attr('data-min');
            var max = jQuery( this ).attr('data-max');
            var current_min = jQuery( this ).attr('data-current_min');
            var current_max = jQuery( this ).attr('data-current_max');
            var min_selector = jQuery( this ).attr('data-min_selector');
            var max_selector = jQuery( this ).attr('data-max_selector');
            var view_selector = jQuery( this ).attr('data-view_selector');

            min = Number( min );
            max = Number( max );
            current_min = Number( current_min );
            current_max = Number( current_max );

            jQuery( selector ).slider({
                range: true,
                min: min,
                max: max,
                values: [ current_min, current_max ],
                slide: function( event, ui ){
                    jQuery( min_selector ).val(ui.values[0]);
                    jQuery( max_selector ).val(ui.values[1]);
                    jQuery( view_selector ).html(ui.values[0] + ' - ' + ui.values[1]);
                }
            });
        });
    }

} );
