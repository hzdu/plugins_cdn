jQuery(function($) {
    'use strict';
    $(document).ready(function() {

        var config_json = $('#wpt_table').data('config_json');
        if ( typeof config_json === 'undefined' ){
            return false;
        }
                
        $('body').on('click','.wpt_click_to_view', function(){
            $(this).closest('.toggle_on').toggleClass('toggle-show');
            $(this).closest('.toggle_on').find('.item_inside_cell,.col_inside_tag').fadeToggle('medium');
        });
        
        
        //Select2
        if(typeof $('.wpt_product_table_wrapper .search_select').select2 === 'function' && $('.wpt_product_table_wrapper .search_select').length > 0 && WPT_DATA.select2 !== 'disable' ){
            $('.wpt_product_table_wrapper .search_select.cf_query.cf_query_multiple').select2({//.query
                placeholder: WPT_DATA.search_select_placeholder,
                tags: true,
            });
            $('.wpt_product_table_wrapper .search_select.cf_query.cf_query_').select2();

        }
        
        
        /****************** NEW CODE *********************/
        setZeroAndCartCount();
        function setZeroAndCartCount(){
            if($('.quantity_cart_plus_minus').length < 1){
                return;
            }
            setZeroInput();
            setCartCount();
        }
        function setZeroInput(){
            $('.quantity_cart_plus_minus').val(0);
        }
        function setCartCount(){
            if($('.quantity_cart_plus_minus').length < 1){
                return;
            }

            $.ajax({
                type: 'POST',
                url: WPT_DATA.ajax_url,
                data: {
                    action: 'wpt_quckcart_count_info',
                },
                complete: function(){

                },
                success: function(response) {

                    var fragments = response.fragments;
                    try{
                        var wpt_quckcart = fragments.wpt_quckcart;//Object.values(fragments.wpt_quckcart);
                        if ( wpt_quckcart ) {
                            $.each( wpt_quckcart, function( key, value ) {
                                if('string' === typeof key){
                                    $( '#product_id_' + key + ' input.input-text.qty.text' ).val( value );

                                }
                            });
                        }
                    }catch(e){
                        //e:getMessage();
                    }
                },
                error: function() {

                },
            });
        }
        
        $(document).on('wc_fragments_refreshed',function(){
            setCartCount();
        });
        $(document).on('wc_fragments_refresh',function(){
            setCartCount();
        });
        $(document).on('removed_from_cart',function(){
            setCartCount();
        });
        

        $('body').on('change','.quantity_cart_plus_minus',function(){
            var qty_val = $(this).val();
            var product_id = $(this).closest('tr').data('product_id');
            var loader_html = "<span class='wpt-loader-quick-cart wpt-loader-" + product_id + "' ></span>"
            $(this).closest('.quick_qty,.wpt_quick_qty').append(loader_html);
            $.ajax({
                type: 'POST',
                url: WPT_DATA.ajax_url,
                data: {
                    action:         'wpt_quckcart_ajax_update',
                    qty_val:    qty_val,
                    product_id:product_id,
                },
                complete: function(){
                        $( document.body ).trigger( 'updated_cart_totals' );
                        $( document.body ).trigger( 'wc_fragments_refreshed' );
                        $( document.body ).trigger( 'wc_fragments_refresh' );
                        $( document.body ).trigger( 'wc_fragment_refresh' );

                        $('.wpt-loader-' + product_id ).remove();

                },
                success: function(response) {
                    $('.saiful_click_wrapper').html(response);
                    console.log(response);
                    var fragments = response.fragments;
                    try{
                        /******IF NOT WORK CART UPDATE, JUST ADD A RIGHT SLASH AT THE BEGINING OF THIS LINE AND ACTIVATE BELLOW CODE***********/
                        if ( fragments ) {
                            $.each( fragments, function( key, value ) {
                                if('string' === typeof key && typeof $( key ) === 'object'){
                                    $( key ).replaceWith( value );

                                }
                            });
                        }
                    }catch(e){
                        //e:getMessage();
                    }
                },
                error: function() {

                },
            });
        });
        //Advance search cascade filter on ajax
        $(document.body).on('change', '.search_box_wrapper select.search_select.query', function () {

            let selector = $(this).attr('id');
            $(this).closest('.wpt_product_table_wrapper').attr('current_selector', selector);
        });


        $('div.wpt_product_table_wrapper table#wpt_table').each(function(){
            //On first load, I have checked it first time to reduce loading speed
            if(config_json.advance_cascade_filter !== 'on'){
                return;
            }



            var targetTableArgs = $(this).attr('data-data_json');
            try{
                targetTableArgs = JSON.parse(targetTableArgs);
                cascadeFilteringSelect( targetTableArgs );
            }catch(e){
                console.log(e);
            }
        });

        
        $(document.body).on('wpt_query_progress', function (e, args) { //wpt_query_done it's an another trigger
            
            //On first load, I have checked it first time to reduce loading speed
            if(config_json.advance_cascade_filter !== 'on'){
                return;
            }
            
            let temp_number = args.temp_number;
            let searchWrapper = $('div#search_box_' + temp_number + ' div.search_box_wrapper');
            let cascadeFilterBtn = searchWrapper.find('.cascade-filter-reset-btn');
            if( cascadeFilterBtn.length < 1 ){
                let resetTxt = config_json.filter_reset_button;
                searchWrapper.append('<button data-temp_number="' + temp_number + '" class="cascade-filter-reset-btn">' + resetTxt + '</button>'); //Reset will come from default reset text under label on configure page/ tab
            }
            
            cascadeFilteringSelect( args );
        });
        
        $(document.body).on('click','.cascade-filter-reset-btn',function(e){
            e.preventDefault();
            let temp_number = $(this).data('temp_number');
            let thisResetButton = $(this);
            
            $('#table_id_' + temp_number + ' div.search_box_wrapper select.search_select').each(function(){
                $(this).val($(this).find('option:first').val());
                $(this).find('option:first').attr('selected','selected')
            });
            setTimeout(function(){
                $('#table_id_' + temp_number + ' div.search_box_wrapper select.search_select').trigger('change');
                thisResetButton.remove();
            },100);

            // var targetTableArgs = $('div#table_id_' + temp_number + ' table#wpt_table').attr('data-data_json');
            // try{
            //     targetTableArgs = JSON.parse(targetTableArgs);
            //     cascadeFilteringSelect( targetTableArgs );
            //     //$(this).remove();
            // }catch(e){
            //     console.log(e);
            // }


        });

        function cascadeFilteringSelect( args ){
            if(config_json.advance_cascade_filter !== 'on'){
                return;
            }

            let temp_number = args.temp_number;
            let queriedTax = args.args.tax_query;
            let currntTax = $('#table_id_' + temp_number + ' .search_box_wrapper select.search_select.query');
            let taxs = new Array();
            let values = new Array();
            currntTax.each(function (i, a) {
                let key = $(this).data('key');
                let id = $(this).attr('id');
                let value = $(this).val();

                taxs[i] = key;
                values[id] = value;
            });
            
            let query = args.args;
            let class_name = 'cascade-filtering';
            currntTax.addClass(class_name);
            let ajax_url = WPT_DATA.ajax_url;
            $.ajax({
                url: ajax_url,
                method: 'POST',
                data: {
                    action: 'wpt_pro_cascade_filter',
                    query: query,
                    taxs: taxs,
                },
                success: function (result) {

                    if (result !== '') {
                        try {
                            let select = JSON.parse(result);

                            $.each(select, function (index, value) {
                                let selector = 'select#' + index + '_' + temp_number;
                                let prevValue = values[index + '_' + temp_number];

                                let myTargetSelector = $('#table_id_' + temp_number).attr('current_selector');
                                myTargetSelector = 'select#' + myTargetSelector;
                                let firstOptionValue = $(selector).find('option').first().html();
                                let html = '<option value="">' + firstOptionValue + '</option>';
                                $.each(value, function (i_index, i_value) {
                                    let option_selected = '';
                                    if (prevValue === i_index) {
                                        option_selected = 'selected';
                                    }
                                    html += "<option value='" + i_index + "' " + option_selected + ">" + i_value + "</option>";
                                });
                                if (selector !== myTargetSelector) {
                                    //$(selector).html(html);
                                }
                                $(selector).html(html);
                            });
                        } catch (error) {

                        }
                    }

                    currntTax.removeClass(class_name);
                },
                failed: function () {

                }


            });

        }
        //Toggle Descriptions item
        $(document.body).on("wpt_ajax_paginate_links_load", function (e, args) {
            ToggleDescriptionItem(args);
        });
        ToggleDescriptionItem();
        function ToggleDescriptionItem(){
            $("td.td_or_cell.wpt_toggle_description").each(function(){
                let button = $(this).find('.col_inside_tag.toggle_description button.show-more-button.button');
                let colspan = button.data("col_count");
                let product_id = button.data("product_id");
                let thisRow = $(this).closest("tr.wpt_row");

                let thisTd = $(this).closest("td.wpt_toggle_description");

                let htmlData = "",eachLintHtml;
                thisTd.find("div.item_inside_cell").each(function(){
                    eachLintHtml = $(this).html();
                    if( typeof eachLintHtml !== 'undefined' ){
                        htmlData += eachLintHtml;
                    }
                     
                });

                let adiClass = "visible_row wpt_row no_filter";
                let finalHtml = "<tr id='show-row-id-" + product_id + "' style='display:none;' class='show-additional-row " + adiClass + "'><td colspan='" + colspan + "'>" + htmlData + "</td></tr>";
                thisRow.after(finalHtml);
            });

            $(document.body).on('click','.show-more-button',function(){
                let product_id = $(this).data("product_id");
                let open_text = $(this).data("open_text");
                let close_text = $(this).data("close_text");
                let targetEl = $("#show-row-id-" + product_id);
                let showAttr = $(this).attr("show");
                if(showAttr == "yes"){
                    $(this).text(open_text);
                    $(this).attr("show", "now");
                    targetEl.hide();
                }else{
                    $(this).text(close_text);
                    $(this).attr("show", "yes");
                    targetEl.show();
                }
            });
            
        }
        $(window).load(function() {
            $('.wpt_gallery_thumbnails').each(function (){
                var findrow = $(this).closest('tr.wpt_row');
                var product_id = findrow.attr('data-product_id');
                var thumb_id = $(this).find('#wpt_thumb_'+product_id);
                var gallery_id = $(this).find('#wpt_gallery_'+product_id);
                thumb_id.flexslider({
                    animation: "slide",
                    controlNav: false,
                    animationLoop: false,
                    slideshow: false,
                    itemWidth: 40,
                    itemMargin: 5,
                    asNavFor: gallery_id,
                });
                gallery_id.flexslider({
                    animation: "slide",
                    controlNav: false,
                    animationLoop: false,
                    slideshow: false,
                    sync: thumb_id
                });
            });
        });
    });
});