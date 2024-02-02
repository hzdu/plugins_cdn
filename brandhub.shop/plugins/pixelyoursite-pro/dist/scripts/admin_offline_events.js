jQuery( document ).ready(function($) {
    var dateFormat = "yy-mm-dd"
    var from = $( "#pys_purchase_export_datepickers .pys_datepickers_from" ).datepicker({ dateFormat: dateFormat });
    var to = $( "#pys_purchase_export_datepickers .pys_datepickers_to" ).datepicker({ dateFormat: dateFormat })
    from.on( "change", function() {
        to.datepicker( "option", "minDate", getDatePickerDate( dateFormat,this ) );
    })
    to.on( "change", function() {
        from.datepicker( "option", "maxDate", getDatePickerDate(dateFormat, this ) );
    });

    $("#woo_export_purchase").on('change',function(e){
        if($("#woo_export_purchase").val() == "export_by_date") {
            $( "#pys_purchase_export_datepickers" ).show()
        } else {
            $( "#pys_purchase_export_datepickers" ).hide()
        }
    })
    $("#woo_generate_export").on('click',function(e){
        e.stopPropagation();
        e.preventDefault();


        var type = $("#woo_export_purchase").val()
        var start = ""
        var end = ""
        if(type === "export_by_date"){
            start = $( "#pys_purchase_export_datepickers .pys_datepickers_from" ).val()
            end = $( "#pys_purchase_export_datepickers .pys_datepickers_to" ).val()
        } else if(type === "export_last_time") {
            start = $( "#pys_core_woo_last_export_date" ).val()
            if(start == "") {
                var result = new Date();
                result.setDate(result.getDate() - 1);
                start = result.toISOString().slice(0,10)
            }
            end = (new Date()).toISOString().slice(0,10)
        }
        var orderStatus = $(".order_status:checked").map(function(){
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
            start = $( "#pys_purchase_export_datepickers .pys_datepickers_from" ).val()
            end = $( "#pys_purchase_export_datepickers .pys_datepickers_to" ).val()
        } else if(type === "export_last_time") {
            start = $( "#pys_core_woo_last_export_date" ).val()
            if(start == "") {
                var result = new Date();
                result.setDate(result.getDate() - 1);
                start = result.toISOString().slice(0,10)
            }
            end = (new Date()).toISOString().slice(0,10)
        }
        var orderStatus = $(".order_status:checked").map(function(){
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

    function showNewFile(fileUrl,fileName) {
        $(".export_links li").slice(3).remove();

        var parts = fileName.split("-")
        var created = parts[0].replaceAll("_","/");
        $type = parts[1];
        var item = "<li><b>NEW:</b> Created on "+created+"<b> Export ";

        if($type === "export_all") {
            item += "All orders";
        } else {
            var start = parts[2].replaceAll("_","/")
            var end = parts[3].replaceAll("_","/")
            item += "from "+start+" to "+end;
        }

        item += "</b> - <a href='"+fileUrl+"' download>download CSV</a></li>"
        $(".export_links_title").after(item)
        alert("Success create new file")
    }

    function wooGenerateOfflineEventsReport(count,type,start,end,page,key) {
        showLoader(true)
        var orderStatus = $(".order_status:checked").map(function(){
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