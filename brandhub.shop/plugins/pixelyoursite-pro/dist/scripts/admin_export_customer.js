jQuery( document ).ready(function($) {
    var dateFormat = "yy-mm-dd"
    var from = $( "#pys_customer_export_datepickers .pys_datepickers_from" ).datepicker({ dateFormat: dateFormat });
    var to = $( "#pys_customer_export_datepickers .pys_datepickers_to" ).datepicker({ dateFormat: dateFormat })
    from.on( "change", function() {
        to.datepicker( "option", "minDate", getDatePickerDate( dateFormat,this ) );
    })
    to.on( "change", function() {
        from.datepicker( "option", "maxDate", getDatePickerDate(dateFormat, this ) );
    });

    $("#woo_export_customer").on('change',function(e){
        if($(this).val() == "export_by_date") {
            $( "#pys_customer_export_datepickers" ).show()
        } else {
            $( "#pys_customer_export_datepickers" ).hide()
        }
    })

    $("#customer_generate_all_data").on('click',function(e){
        e.stopPropagation();
        e.preventDefault();

        var type = $("#woo_export_customer").val()
        var use_crypto = $("#use_crypto").is(":checked") ? 1 : 0;
        var start = ""
        var end = ""
        if(type === "export_by_date"){
            start = $( "#pys_customer_export_datepickers .pys_datepickers_from" ).val() + " 00:00:00"
            end = $( "#pys_customer_export_datepickers .pys_datepickers_to" ).val() + " 23:59:59"
        } else if(type === "export_last_time") {
            if($( "#pys_core_woo_last_export_customer_date" ).val() == "") {
                var result = new Date();
                result.setDate(result.getDate() - 30);
                start = result.toISOString().slice(0,10) + " 00:00:00"
            }
            else {
                start = $( "#pys_core_woo_last_export_customer_date" ).val();
            }
            end = (new Date()).toISOString().slice(0,10) + " 23:59:59"
        }
        var orderStatus = $(".customer_export_card .order_status:checked").map(function(){
            return $(this).val();
        }).get();

        showLoader(true)
        $("#customer_generate_export_loading .current").text(0)
        $("#customer_generate_export_loading .max").text(0)

        $.ajax({
            url: ajaxurl,
            data: {
                "action": "pys_woo_get_order_count",
                "type":type,
                "start":start,
                "end":end,
                "_wpnonce":$("#customer_generate_export_wpnonce").val(),
                "order_status":orderStatus
            },
            type: 'POST',
            success: function (data) {
                showLoader(false)
                if(data.success) {
                    if(data.data.count > 0) {
                        $("#customer_generate_export_loading .max").text(data.data.count)
                        var key = new Date().getTime();
                        wooGenerateCustomerReport(data.data.count,use_crypto,type,start,end,1,key);
                    } else {
                        alert("Customers not found")
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
            $("#customer_generate_export").addClass("disabled")
            $("#customer_generate_export_loading").show()
        } else {
            $("#customer_generate_export").removeClass("disabled")
            $("#customer_generate_export_loading").hide()
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
        $(".customer_export_card .export_links li").slice(3).remove();

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
        $(".customer_export_card .export_links_title").after(item)
        alert("Success create new file")
    }
    function wooGenerateCustomerReport(count,use_crypto,type,start,end,page,key) {
        showLoader(true)
        var orderStatus = $(".customer_export_card .order_status:checked").map(function(){
            return $(this).val();
        }).get();

        $.ajax({
            url: ajaxurl,
            data: {
                "action": "pys_woo_generate_all_customers_report",
                "page":page,
                "type":type,
                "use_crypto":use_crypto,
                "start":start,
                "end":end,
                "order_status":orderStatus,
                "key":key,
                "_wpnonce":$("#customer_generate_export_wpnonce").val()
            },
            type: 'POST',
            success: function (data) {
                showLoader(false)
                if(data.success) {
                    $("#customer_generate_export_loading .current").text((page - 1)* 100 + data.data.count)
                    if(page * 100 > count) {
                        showNewFile(data.data.file_url,data.data.file_name);
                    } else {
                        wooGenerateCustomerReport(count,use_crypto,type,start,end,page + 1,key);
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