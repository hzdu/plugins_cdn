jQuery( document ).ready(function($) {
    let dateFormat = "yy-mm-dd",
        dayNames = [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ],
        datepickerConfig = {
            dateFormat: dateFormat,
            dayNamesMin: dayNames,
        },
        from = $( "#pys_purchase_export_datepickers .pys_datepickers_from" ).datepicker( datepickerConfig ),
        to = $( "#pys_purchase_export_datepickers .pys_datepickers_to" ).datepicker( datepickerConfig );

    from.on( "change", function() {
        to.datepicker( "option", "minDate", getDatePickerDate( dateFormat,this ) );
    })
    to.on( "change", function() {
        from.datepicker( "option", "maxDate", getDatePickerDate(dateFormat, this ) );
    });

    $("#woo_export_purchase").on('change',function(){
        if($("#woo_export_purchase").val() == "export_by_date") {
            $( "#pys_purchase_export_datepickers" ).slideDown( 400 );
        } else {
            $( "#pys_purchase_export_datepickers" ).slideUp( 400 );
        }
    })
    $("#woo_generate_export").on('click',function(e){
        e.stopPropagation();
        e.preventDefault();


        var type = $("#woo_export_purchase").val()
        var start = ""
        var end = ""
        if(type === "export_by_date"){
            start = $( "#pys_purchase_export_datepickers .pys_datepickers_from" ).val() + " 00:00:00"
            end = $( "#pys_purchase_export_datepickers .pys_datepickers_to" ).val() + " 23:59:59"
        } else if(type === "export_last_time") {
            if($( "#pys_core_woo_last_export_date" ).val() == "") {
                var result = new Date();
                result.setDate(result.getDate() - 1);
                start = result.toISOString().slice(0,10) + " 00:00:00"
            }
            else {
                start = $( "#pys_core_woo_last_export_date" ).val();
            }

            end = (new Date()).toISOString().slice(0,10) + " 23:59:59"
        }
        var orderStatus = $(".woo-export-statuses .order_status:checked").map(function(){
            return $(this).val();
        }).get();


        showLoader(true)
        $("#woo_generate_export_loading .current").text(0)
        $("#woo_generate_export_loading .max").text(0)
        $.ajax({
            url: ajaxurl,
            data: {
                "action": "pys_woo_get_order_count",
                "type":type,
                "start":start,
                "end":end,
                "_wpnonce":$("#woo_generate_export_wpnonce").val(),
                "order_status":orderStatus
            },
            type: 'POST',
            success: function (data) {
                showLoader(false)
                if(data.success) {
                    if(data.data.count > 0) {
                        $("#woo_generate_export_loading .max").text(data.data.count)
                        var key = new Date().getTime();
                        wooGenerateOfflineEventsReport(data.data.count,type,start,end,1,key);
                    } else {
                        alert("Orders not found")
                    }

                } else {
                    alert(data.data)
                }

            },error:function (data) {
                showLoader(false)
                console.log(data);
            }
        });
    });

    $("#woo_generate_all_data_offline_events_report").on('click',function(e){
        e.stopPropagation();
        e.preventDefault();


        var type = $("#woo_export_purchase").val()
        var start = ""
        var end = ""
        if(type === "export_by_date"){
            start = $( "#pys_purchase_export_datepickers .pys_datepickers_from" ).val() + " 00:00:00"
            end = $( "#pys_purchase_export_datepickers .pys_datepickers_to" ).val() + " 23:59:59"
        } else if(type === "export_last_time") {
            start = $( "#pys_core_woo_last_export_date" ).val() + " 00:00:00"
            if(start == "") {
                var result = new Date();
                result.setDate(result.getDate() - 1);
                start = result.toISOString().slice(0,10) + " 00:00:00"
            }
            end = (new Date()).toISOString().slice(0,10) + " 23:59:59"
        }
        var orderStatus = $(".woo-export-statuses .order_status:checked").map(function(){
            return $(this).val();
        }).get();


        showLoader(true)
        $("#woo_generate_export_loading .current").text(0)
        $("#woo_generate_export_loading .max").text(0)
        $.ajax({
            url: ajaxurl,
            data: {
                "action": "pys_woo_get_order_count",
                "type":type,
                "start":start,
                "end":end,
                "_wpnonce":$("#woo_generate_export_wpnonce").val(),
                "order_status":orderStatus
            },
            type: 'POST',
            success: function (data) {
                showLoader(false)
                if(data.success) {
                    if(data.data.count > 0) {
                        $("#woo_generate_export_loading .max").text(data.data.count)
                        var key = new Date().getTime();
                        wooGenerateAllOfflineEventsReport(data.data.count,type,start,end,1,key);
                    } else {
                        alert("Orders not found")
                    }

                } else {
                    alert(data.data)
                }

            },error:function (data) {
                showLoader(false)
                console.log(data);
            }
        });
    });

    function showLoader(flag) {
        if(flag) {
            $("#woo_generate_export").addClass("disabled")
            $("#woo_generate_export_loading").show()
        } else {
            $("#woo_generate_export").removeClass("disabled")
            $("#woo_generate_export_loading").hide()
        }
    }

    function getDatePickerDate( format, element ) {

        var date;
        try {
            date = $.datepicker.parseDate( format, element.value );
        } catch( error ) {
            console.log("error",error)
            date = null;
        }

        return date;
    }

    function showNewFile( fileUrl, fileName ) {
        $( ".export_links li" ).slice( 3 ).remove();

        let parts = fileName.split( "-" ),
            created = parts[ 0 ].replaceAll( "_", "/" ),
            $type = parts[ 1 ],
            item = "<li><span class='primary-text-color primary_heading'>NEW:</span> Created on " + created + "<span class='primary-text-color primary_heading'> Export ";

        if ( $type === "export_all" ) {
            item += "All orders";
        } else {
            let start = parts[ 2 ].replaceAll( "_", "/" ),
                end = parts[ 3 ].replaceAll( "_", "/" )
            item += "from " + start + " to " + end;
        }

        item += "</span> - <a href='" + fileUrl + "' download class='link'>download CSV</a></li>";
        $( ".export_links_title" ).after( item );
        $( ".export_links_wrap" ).slideDown( 400 );
    }

    function wooGenerateOfflineEventsReport(count,type,start,end,page,key) {
        showLoader(true)
        var orderStatus = $(".woo-export-statuses .order_status:checked").map(function(){
            return $(this).val();
        }).get();

        $.ajax({
            url: ajaxurl,
            data: {
                "action": "pys_woo_generate_offline_events_report",
                "page":page,
                "type":type,
                "start":start,
                "end":end,
                "order_status":orderStatus,
                "key":key,
                "_wpnonce":$("#woo_generate_export_wpnonce").val()
            },
            type: 'POST',
            success: function (data) {
                showLoader(false)
                if(data.success) {
                    $("#woo_generate_export_loading .current").text((page - 1)* 100 + data.data.count)
                    if(page * 100 > count) {
                        showNewFile(data.data.file_url,data.data.file_name);
                    } else {
                        wooGenerateOfflineEventsReport(count,type,start,end,page + 1,key);
                    }
                } else {
                    alert(data.data)
                }

            },error:function (data) {
                showLoader(false)
                console.log(data);
            }
        });
    }
    function wooGenerateAllOfflineEventsReport(count,type,start,end,page,key) {
        showLoader(true)
        var orderStatus = $(".order_status:checked").map(function(){
            return $(this).val();
        }).get();

        $.ajax({
            url: ajaxurl,
            data: {
                "action": "pys_woo_generate_all_offline_events_report",
                "page":page,
                "type":type,
                "start":start,
                "end":end,
                "order_status":orderStatus,
                "key":key,
                "_wpnonce":$("#woo_generate_export_wpnonce").val()
            },
            type: 'POST',
            success: function (data) {
                showLoader(false)
                if(data.success) {
                    $("#woo_generate_export_loading .current").text((page - 1)* 100 + data.data.count)
                    if(page * 100 > count) {
                        showNewFile(data.data.file_url,data.data.file_name);
                    } else {
                        wooGenerateAllOfflineEventsReport(count,type,start,end,page + 1,key);
                    }
                } else {
                    alert(data.data)
                }

            },error:function (data) {
                showLoader(false)
                console.log(data);
            }
        });
    }
})