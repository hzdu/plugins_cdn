/**
 * frontend.js
 *
 * @author Your Inspiration Themes
 * @package YITH WooCommerce Quick View
 * @version 1.0.0
 */

jQuery(document).ready(function($){
    "use strict";

    if( typeof yith_qv === 'undefined' ) {
        return;
    }

    var qv_modal    = $(document).find( '#yith-quick-view-modal' ),
        qv_overlay  = qv_modal.find( '.yith-quick-view-overlay'),
        qv_content  = qv_modal.find( '#yith-quick-view-content' ),
        qv_close    = qv_modal.find( '#yith-quick-view-close' ),
        qv_wrapper  = qv_modal.find( '.yith-wcqv-wrapper'),
        qv_wrapper_w = qv_wrapper.width(),
        qv_wrapper_h = qv_wrapper.height(),
        center_modal = function() {

            var window_w = $(window).width(),
                window_h = $(window).height(),
                width    = ( ( window_w - 60 ) > qv_wrapper_w ) ? qv_wrapper_w : ( window_w - 60 ),
                height   = ( ( window_h - 120 ) > qv_wrapper_h ) ? qv_wrapper_h : ( window_h - 120 );

            qv_wrapper.css({
                'left' : (( window_w/2 ) - ( width/2 )),
                'top' : (( window_h/2 ) - ( height/2 )),
                'width'     : width + 'px',
                'height'    : height + 'px'
            });
        };


    /*==================
     *MAIN BUTTON OPEN
     ==================*/

    $.fn.yith_quick_view = function() {

        $(document).off( 'click', '.yith-wcqv-button' ).on( 'click', '.yith-wcqv-button', function(e){
            e.preventDefault();

            var t           = $(this),
                product_id  = t.data( 'product_id' ),
                is_blocked  = false;

            if ( typeof yith_qv.loader !== 'undefined' ) {
                is_blocked = true;
                t.block({
                    message: null,
                    overlayCSS  : {
                        background: '#fff url(' + yith_qv.loader + ') no-repeat center',
                        opacity   : 0.5,
                        cursor    : 'none'
                    }
                });

                if( ! qv_modal.hasClass( 'loading' ) ) {
                    qv_modal.addClass('loading');
                }

                // stop loader
                $(document).trigger( 'qv_loading' );
            }
            ajax_call( t, product_id, is_blocked );
        });
    };

    /*================
     * MAIN AJAX CALL
     ================*/

    var ajax_call = function( t, product_id, is_blocked ) {

        $.ajax({
            url: yith_qv.ajaxurl,
            data: {
                action: 'yith_load_product_quick_view',
                product_id: product_id,
                lang: yith_qv.lang,
				context: 'frontend',
            },
            dataType: 'json',
            type: 'POST',
            success: function (data) {

                qv_content.html(data.html);

                // Variation Form
				var form_variation = qv_content.find('.variations_form');
                form_variation.each( function() {
                    $( this ).wc_variation_form();
                    // add Color and Label Integration
                    if( typeof $.fn.yith_wccl !== 'undefined' ) {
                        $(this).yith_wccl();
                    }
                    else if( typeof $.yith_wccl != 'undefined' && data.prod_attr ) {
						
                        $.yith_wccl( data.prod_attr );
                    }
                });

                form_variation.trigger( 'check_variations' );
                form_variation.trigger( 'reset_image' );

                if( typeof $.fn.wc_product_gallery !== 'undefined' ) {
                    qv_content.find('.woocommerce-product-gallery').each(function () {
                        $(this).wc_product_gallery();
                    });
                }

                if (!qv_modal.hasClass('open')) {
                    qv_modal.removeClass('loading').addClass('open');
                    if (is_blocked)
                        t.unblock();
                }

                // stop loader
                $(document).trigger('qv_loader_stop');

                var $laz = jQuery.noConflict();
(function( $laz ) {
    'use strict';
        
        var wcva_attribute_number = $laz('.attribute-swatch').length;
        var chosenarray           = {};
        var chosenlength          = 0;
        var chosenthreshold       = wcva_attribute_number - 1;
        var wc_version            = wcva.wc_version;

        

        if (wcva.tooltip == "yes") {

            if (wcva.hoverimage_tooltip == "yes") {

                $laz(".swatchinput label").each(function() {

                    $laz(this).powerTip();
                    var img = $laz(this).attr("data-o-src");

                    if (img) {

                        var tooltip_content = '<img width="'+wcva.woocommerce_hover_tooltip_width+'px" height="'+wcva.woocommerce_hover_tooltip_width+'px" src="'+ img +'">';
                        $laz(this).data('powertip', tooltip_content);

                    } else {

                        $laz(this).powerTip();

                    }
                    

                });


            } else if (wcva.desc_tooltip == "yes") {

                $laz(".swatchinput label").each(function() {

                    $laz(this).powerTip();
                    var tooltip_content = $laz(this).attr("description");
                    $laz(this).data('powertip', tooltip_content);

                }); 

            } else {

                $laz(".swatchinput label").each(function() {

                    $laz(this).powerTip();
                    

                });

                
                
            }

        }
      
        $laz('form.variations_form').on( 'change', '.wcva-standard-select', function() {
            var selectedtext         = $laz(this).val();

            var attribute_name          = $laz(this).attr("name");

            var wcva_description  = $laz(''+attribute_name+'_'+selectedtext+'').attr("description");

            
            
            if (wcva.show_attribute == "yes") {




               if (wcva.wcva_selected_text_option == "02") {

                   

                   $laz( this ).closest('tr').prev().find('.wcva_selected_attribute').text(wcva_description);

               } else if ((wcva.wcva_selected_text_option == "03" && (wcva_description !== undefined))) {

                   var mixedtext = ''+attribute_name+' '+wcva_description+'';

                   $laz( this ).closest('tr').prev().find('.wcva_selected_attribute').text(mixedtext);

               } else {

                  $laz( this ).closest('tr').prev().find('.wcva_selected_attribute').text(selectedtext);

               }

               
            }
        });
        
     
        $laz('form.variations_form').on( 'click', '.swatchinput label', function() {
            var selectid           = $laz(this).attr("selectid");
            var dataoption         = $laz(this).attr("data-option");
            var selectedtext       = $laz(this).attr("selectedtext");
            var attributeindex     = $laz(this).closest('.attribute-swatch').attr('attribute-index');
            

            


            if  ((wcva.cross_outofstock != "yes") && (wcva.disable_unselect != 1)) {
                if ($laz(this).hasClass('selectedswatch')) {
                
                $laz(this).removeClass('selectedswatch').addClass('wcvaswatchlabel');
                
                var currentoptionToSelect = parent.jQuery("form.variations_form #" + selectid + "").children("[value='']");

               //mark the option as selected
                currentoptionToSelect.prop("selected", "selected").change();
                
                $laz( this ).closest('tr').prev().find('.wcva_selected_attribute').text("");
                
                return;
               }
            }

            
           if (wcva.show_attribute == "yes") {

             

              var attribute_name          = $laz(this).attr("data-option");

               var wcva_description  = $laz(this).attr("description");


               $laz( this ).closest('tr').prev().find('.wcva_selected_attribute').text(selectedtext);

               if (wcva.wcva_selected_text_option == "02") {

                   

                   $laz( this ).closest('tr').prev().find('.wcva_selected_attribute').text(wcva_description);

               } else if ((wcva.wcva_selected_text_option == "03") && (wcva_description !== undefined)) {

                   var mixedtext = ''+attribute_name+' '+wcva_description+'';

                   $laz( this ).closest('tr').prev().find('.wcva_selected_attribute').text(mixedtext);

               } else {

                  $laz( this ).closest('tr').prev().find('.wcva_selected_attribute').text(selectedtext);

               }
           }
          
           
           $laz( this ).closest('.attribute-swatch').find('.selectedswatch').removeClass('selectedswatch').addClass('wcvaswatchlabel');
           $laz( this ).removeClass('wcvaswatchlabel').addClass( 'selectedswatch' );
           
          
          
           //find the option to select
           var optionToSelect = parent.jQuery("form.variations_form #" + selectid + "").children('[value="' + dataoption + '"]');

           //mark the option as selected
           optionToSelect.prop("selected", "selected").change();
         
                        
        });    
        
        
        if (wcva.disable_options == "yes") {
                    
            $laz('form.variations_form').on( 'click', '.swatchinput label', function( event ) {

                 var selectid           = $laz(this).attr("selectid");
                 var dataoption         = $laz(this).attr("data-option");

                 wcva_disable_swatches_as_dropdown();
                 

            });
            
            $laz('form.variations_form').on( 'click', '.wcva-standard-select', function(event) {

                 
            
                 wcva_disable_swatches_as_dropdown();
                 
            });

        
        }


        

        if (wcva.cross_outofstock == "yes") {

            $laz('form.variations_form').on( 'click', '.swatchinput label', function( event ) {

                 var selectid           = $laz(this).attr("selectid");
                 var dataoption         = $laz(this).attr("data-option");
                 

                 
                 wcva_disable_outofstock_options(selectid,dataoption,chosenarray);

            });


            $laz('form.variations_form').on( 'change', '.wcva-standard-select', function(event) {

                var selectid           = $laz(this).attr("id");
                var dataoption         = $laz(this).val();
                
               
                //intiate adding of outofstock class

                wcva_disable_outofstock_options(selectid,dataoption,chosenarray);


            });

        }
        
       
       
        
        $laz( window ).load(function() {


            
               

            $laz('.attribute-swatch').each(function(){

                var show_number       = $laz(this).find('.wcva_show_more_link').attr("show-number");
                var swatch_count      = $laz(this).find('.swatchinput').length;
                 
                var show_more_link    = $laz(this).find('.wcva_show_more_link');

                var swatch_hide_count = swatch_count - show_number;
                var swatch_hide_count = Math.abs(swatch_hide_count) * -1;

                

                if (swatch_count > show_number) {
                    
                    $laz(this).find('.swatchinput').slice(swatch_hide_count).addClass("hidden_swatchinput");
                    $laz(this).find('.swatchinput').slice(swatch_hide_count).hide();

                    show_more_link.show();


                    $laz(show_more_link).on( 'click', function(event) {
                    
                        event.preventDefault();
                        
                        $laz(this).parents('.attribute-swatch').find('.swatchinput').slice(swatch_hide_count).show();
                        $laz(this).parents('.attribute-swatch').find('.swatchinput').slice(swatch_hide_count).removeClass("hidden_swatchinput");
                        
                        $laz(this).hide();
                        
                        return false;

                    });

                }
            });
               
        });
      
       
        $laz('form.variations_form').on( 'click', '.reset_variations', function() {
            
            $laz('form.variations_form').find('.selectedswatch').removeClass('selectedswatch').addClass('wcvaswatchlabel');
            $laz('form.variations_form').find('.wcva_selected_attribute').text("");
            
            //remove wcvaoutofstock class upon reset variation
            
            if (wcva_attribute_number != 1) {
                $laz('form.variations_form' ).find('.wcvaoutofstock').removeClass('wcvaoutofstock');
            }
            
            
        
        if (wcva.disable_options == "yes") {
            
            $laz('form.variations_form' ).find('.wcvadisabled').removeClass('wcvadisabled');
            
            jQuery('.swatchinput').removeClass('wcvadisabled');

            if (wcva.enable_click == "02") {
                jQuery('.swatchinput').removeClass('clickenabled');
                $laz('form.variations_form' ).find('.clickenabled').removeClass('clickenabled');
            }
            
            if (wcva.hide_options == "yes") {
                if (!jQuery(this).parent().hasClass("hidden_swatchinput")) {
                        jQuery(this).parent().show();
                }
            }

            if (wcva_attribute_number == 1) {

               
                  wcva_disable_swatches_as_dropdown();
               

            } 

        }


        if (wcva.cross_outofstock == "yes") {
            
            chosenarray           = {};

            chosenlength          = 0;
            
            
            
            
            
        }



            
        });



        function wcva_disable_swatches_as_dropdown_new() {
            
            var options_to_disable = [];

            //console.log(outofstock_array);

            $laz.each(outofstock_array, function( dkey, dvalue ) {
                jQuery('form.variations_form').find('.'+ dvalue + '').addClass('wcvaoutofstock');
            });
        }



        function wcva_disable_swatches_as_dropdown() {

            var availableoptions = [];
            
            jQuery('form.variations_form').find( '.variations select' ).each( function( i, e ) {
                
                var eachselect = jQuery( e );
                
                
                
                jQuery(e).trigger('focusin');
                
                jQuery(eachselect).find('option').each(function(index,element){
                    
                        
                        availableoptions.push(element.value);
                
                });


                
                var wcvalabel = jQuery(this).closest('td').find('.swatchinput label');
                
                jQuery(wcvalabel).each(function(){

                    var dataoption = jQuery(this).attr("data-option");
                    
                    if(jQuery.inArray( dataoption, availableoptions ) < 0){
                        
                        if ($laz(this).hasClass('selectedswatch')) {
                           jQuery(this).removeClass('selectedswatch').addClass('wcvaswatchlabel');
                           
                           jQuery(this).addClass('wcvadisabled');

                           if (wcva.enable_click == "02") {
                                jQuery(this).addClass('clickenabled');
                           }
                           
                           if (wcva.hide_options == "yes") {
                             jQuery(this).parent().hide();
                           }
                         
                        } else {
                           jQuery(this).addClass('wcvadisabled');
                           
                           if (wcva.hide_options == "yes") {
                            jQuery(this).parent().hide();
                           }

                           if (wcva.enable_click == "02") {
                                jQuery(this).addClass('clickenabled');
                           }


                         
                        }
                        
                    }else{
                        
                        jQuery(this).removeClass('wcvadisabled');
                        
                        if (wcva.hide_options == "yes") {
                            if (!jQuery(this).parent().hasClass("hidden_swatchinput")) {
                                jQuery(this).parent().show();
                            }
                        }

                        if (wcva.enable_click == "02") {
                                jQuery(this).removeClass('clickenabled');
                        }
                    }
                });
            });
        }
        
        function wcva_get_common_match(tempoutofstock_array,chosenarray) {
            var filterdarray = [];

            var chosenstring = '';
                     

            $laz.each(chosenarray, function( stkey, stvalue ) {

                chosenstring += ''+stkey+'_'+stvalue+',';

                        
            });

            chosenstring  = chosenstring.slice(0, -1);



            
            var matchindex = 0;

            $laz.each(tempoutofstock_array, function( ltkey, ltvalue ) {

                var originalstring = '';
                  

                $laz.each(ltvalue, function( ntkey, ntvalue ) {
                    
                    originalstring += ''+ntkey+'_'+ntvalue+',';

                });

                if (originalstring.includes(chosenstring)) {
                    filterdarray[matchindex] = ltvalue;
                    matchindex++;
                }

            });

            
            
            return filterdarray;
        }
        
        function wcva_disable_outofstock_options(selectid,dataoption,chosenarray) {

            var outofarray = [];

            var outattribute     = 'attribute_'+selectid+'';
            var outvalue         = dataoption;
            chosenarray[""+outattribute+""]        = outvalue;

            chosenlength = Object.keys(chosenarray).length;
            
            if (chosenlength < chosenthreshold) {
                return;
            }
            
            
            
            var tempoutofstock_array = outofstock_array;

            if ((wcva_attribute_number > 2) && (chosenlength >= 2 )) {
                var common_match = wcva_get_common_match(tempoutofstock_array,chosenarray);
            } else {
                var common_match = tempoutofstock_array;
            }

            

            
            
            
            $laz.each(common_match, function( fkey, fvalue ) {
                 
                 
                 var outselectval = fvalue[outattribute];


                 
                 if ((outselectval == outvalue)) {

                    fvalue == null;
                    
                    outofarray.push(fvalue);

                    
                 }
            });

            
            
            
            
            if (wcva_attribute_number != 1) {
                $laz('form.variations_form' ).find('.wcvaoutofstock').removeClass('wcvaoutofstock');
            }


            
            

            

            //Main function for crossing out outofstock options

           

            if (wcva_attribute_number != 1) {

                jQuery('form.variations_form').find( '.variations select' ).each( function( index, event ) {
                
                    var eachselect = jQuery( event );


                    var wcvalabel = jQuery(this).closest('td').find('.swatchinput label');
                
                    jQuery(wcvalabel).each(function(){

                        var selectid2           = $laz(this).attr("selectid");
                        var dataoption2         = $laz(this).attr("data-option");
                        var crossedarray        = [];

                    
                    
                    
                        $laz.each(outofarray, function( fkey2, fvalue2 ) {
                         
                            

                            $laz.each(fvalue2, function( fkey3, fvalue3 ) {



                                
                                crossedarray.push('.'+fkey3+'_'+dataoption2+'');




                                    if  (fvalue3 == dataoption2) {

                              
                                        if ((outattribute != fkey3)) {

                                            $laz.each(crossedarray, function( fkey4, fvalue4 ) {

                                                var option_to_disable = $laz('.'+fkey3+'_'+dataoption2+'');
                                                

                                                
                                                if (!$laz(option_to_disable).hasClass("selectedswatch")) {
                                                    if (wcva_attribute_number != 1) {
                                                        option_to_disable.addClass('wcvaoutofstock');
                                                    }
                                                } else {

                                                    option_to_disable.removeClass('wcvaoutofstock');

                                                } 

                                            });

                                        }
                              

                                    } 
                           
                            });

                         
                        });

                    });
                });
            
            }
            
        }

})( jQuery );

            }
        });
    };

    /*===================
     * CLOSE QUICK VIEW
     ===================*/

    var close_modal_qv = function() {

        // Close box by click overlay
        qv_overlay.on( 'click', function(e){
            close_qv();
        });
        // Close box with esc key
        $(document).keyup(function(e){
            if( e.keyCode === 27 )
                close_qv();
        });
        // Close box by click close button
        qv_close.on( 'click', function(e) {
            e.preventDefault();
            close_qv();
        });

        var close_qv = function() {
            qv_modal.removeClass('open').removeClass('loading');

            setTimeout(function () {
                qv_content.html('');
            }, 1000);
        }
    };

    close_modal_qv();


    center_modal();
    $( window ).on( 'resize', center_modal );

    // START
    $.fn.yith_quick_view();

    $( document ).on( 'yith_infs_adding_elem yith-wcan-ajax-filtered', function(){
        // RESTART
        $.fn.yith_quick_view();
    });

});