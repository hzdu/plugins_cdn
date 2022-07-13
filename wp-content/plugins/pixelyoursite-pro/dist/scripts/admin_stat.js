
! function ($, orderType) {

    let chart = {
        chartGlobal: "",
        chartSingle: "",
        colors:["#1B2B9A","#FAFAC6","#E6AF2E","#BEB2C8","#B6244F","#35524A","#162521","#408c35","#bb9b31","#ff00ff"],
        init : function () {
            this.chartGlobal = new Chart(jQuery("#pys_stat_graphics"),{
                type: 'line',
                data: {},
                options: {
                    scales: {
                        xAxis: {
                            // The axis for this scale is determined from the first letter of the id as `'x'`
                            // It is recommended to specify `position` and / or `axis` explicitly.
                            type: 'time',
                            time: {
                                unit: 'day',
                                unitStepSize: 1,
                                displayFormats: {
                                    'day': 'dd/MM'
                                },
                                tooltipFormat:'dd/MM'
                            }
                        }
                    },
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                usePointStyle: true,
                            },
                        },
                    },

                }}
            );
            this.chartSingle = new Chart(jQuery("#pys_stat_single_graphics"),{
                type: 'line',
                data: {},
                options: {
                    scales: {
                        xAxis: {
                            //    min: '2021-11-07 00:00:00',
                            type: 'time',
                            time: {
                                unit: 'day',
                                unitStepSize: 1,
                                displayFormats: {
                                    'day': 'dd/MM'
                                },
                                tooltipFormat:'dd/MM'
                            }
                        },
                    },
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                usePointStyle: true,
                            },
                        },
                    },

                }}
            );
        },
        showGrossChart: function (items,start,end) {
            let datasets = [];
            items.forEach(function (el,index) {
                let color = chart.colors[index%10]
                let dateItems = el.data.sort(function(a,b){
                    // Turn your strings into dates, and then subtract them
                    // to get a value that is either negative, positive, or zero.
                    return new Date(b.x) - new Date(a.x);
                });
                const newDataset = {
                    label: el.item.name,
                    data: dateItems,
                    parsing: {
                        yAxisKey: 'gross'
                    },
                    borderColor: color,
                    backgroundColor:color
                };
                datasets.push(newDataset)
            })
            chart.chartGlobal.options.scales.xAxis.min = start
            chart.chartGlobal.options.scales.xAxis.max = end

            chart.chartGlobal.data.datasets = datasets;

            chart.chartGlobal.update();
        },
        showSingleChart: function (data,start,end) {
            let datasets = [];

            let dateItems = data.data.sort(function(a,b){
                return new Date(b.x) - new Date(a.x);
            });

            datasets.push({
                label: "Gross Sale",
                data: dateItems,
                parsing: {
                    yAxisKey: 'gross'
                },
                borderColor: chart.colors[0],
                backgroundColor:chart.colors[0],
            })

            datasets.push({
                label: "Net Sale",
                data: dateItems,
                parsing: {
                    yAxisKey: 'net'
                },
                borderColor: chart.colors[1],
                backgroundColor:chart.colors[1],
            })

            datasets.push({
                label: "Total Sale",
                data: dateItems,
                parsing: {
                    yAxisKey: 'total'
                },
                borderColor: chart.colors[2],
                backgroundColor:chart.colors[2],
            })

            chart.chartSingle.options.scales.xAxis.min = start
            chart.chartSingle.options.scales.xAxis.max = end
            chart.chartSingle.data.datasets = datasets;

            chart.chartSingle.update();
        },

    }
    let util = { //date-fns
        dateFormat : "yyyy-MM-dd",

        toFormat : function (date,format) {
            return Chart._adapters._date.prototype.format(date,format)
        },
        add:function (date, duration,unit) {
            return Chart._adapters._date.prototype.add(date, duration,unit)
        },
        startOf:function (date, unit) {
            return Chart._adapters._date.prototype.startOf(date, unit)
        },
        endOf:function (date, unit) {
            return Chart._adapters._date.prototype.endOf(date, unit)
        },
        getDatepickerDate( element ) {
            var date;
            try {
                date = jQuery.datepicker.parseDate( "mm/dd/yy", element.value );
            } catch( error ) {
                date = null;
            }
    
            return date;
        },
        getEndDate:function (type) {
            switch(type) {

                case "last_month": {
                    return util. endOf(util.add(new Date(),-1,"month"), "month")
                }
                case "yesterday": return util.add(new Date(),-1,"day")

                default: return new Date()
            }
        },
        getStartDate: function (current,type) {
            switch(type) {

                case "7": {
                    return util.add(current,-7,"day")
                }
                case "30": {
                    return util.add(current,-30,"day")
                }
                case "current_month": {
                    return util.startOf(current,"month")
                }
                case "last_month": {
                    return util.startOf(current,"month")
                }
                case "year_to_date": {
                    return util.startOf(current,"year")
                }
                case "last_year": {
                    return util.add(current,-1,"year")
                }

                default:  return current
            }

        },
    }

    let navigation = {
        loading : function () {
            jQuery(".pys_stat .stat_data").addClass("loading")
            jQuery(".pys_stat .stat_data").removeClass("loaded")
        },
        loaded : function () {
            jQuery(".pys_stat .stat_data").removeClass("loading")
            jQuery(".pys_stat .stat_data").addClass("loaded")
        },
        loadingError : function (message) {
            jQuery(".pys_stat .stat_data").removeClass("loading")
            alert(message)
        },
        toMainTab : function () {
            $(".stat_data").addClass("step_1")
            $(".stat_data").removeClass("step_2")
        },
        toSingleTab : function (data,filterType,dateType,dateStart,dateEnd) {
            jQuery(".stat_data").addClass("step_2")
            jQuery(".stat_data").removeClass("step_1")
            pysStatSingle.open(data,filterType,dateType,dateStart,dateEnd)
        }
    }

    var pysStatGlobal = {
        data:[],
        page : 1,
        perPage:5,
        max:0,
        startDate : null,
        endDate : null,
        filterType : "",


        init: function (type) {
            chart.init()
            let startDatepicker =  jQuery( ".global_data .pys_stat_time_custom .datepicker_start" )
                .datepicker({
                    dateFormat:"mm/dd/yy"
                })
                .on( "change", function() {
                    pysStatGlobal.startDate = util.getDatepickerDate( this )
                    endDatepicker.datepicker( "option", "minDate", pysStatGlobal.startDate );
                })

            let endDatepicker =  jQuery( ".global_data .pys_stat_time_custom .datepicker_end" )
                .datepicker({
                    dateFormat:"mm/dd/yy"
                })
                .on( "change", function() {
                    pysStatGlobal.endDate = util.getDatepickerDate( this )
                    startDatepicker.datepicker( "option", "maxDate", pysStatGlobal.endDate );
                });


            jQuery(".pys_stats_filters .filter").on("click",function () {
                jQuery(".pys_stats_filters .filter").removeClass("active")
                jQuery(this).addClass("active")
                jQuery(".stat_data").addClass("step_1")
                jQuery(".stat_data").removeClass("step_2")
                jQuery(".pys_stat_info th.title").text(jQuery(this).text().trim())

                pysStatGlobal.filterType = jQuery(this).data("type")

                pysStatGlobal.updateStartEndDate()

                pysStatGlobal.loadGlobalData(
                    type,
                    util.toFormat(pysStatGlobal.startDate,util.dateFormat),
                    util.toFormat(pysStatGlobal.endDate,util.dateFormat),
                    pysStatGlobal.filterType,
                    1,
                )
            });
            jQuery(".pys_stat_info").on("click",".data a",function (e) {
                e.preventDefault();
                pysStatGlobal.toSinglePage(jQuery(this).data("id"))
            })

            jQuery(".global_data .pagination").on("click",".page-item",function () {
                if($(this).hasClass("active")) return;

                let page = $(this).data("page")
                pysStatGlobal.loadGlobalData(
                    type,
                    util.toFormat(pysStatGlobal.startDate,util.dateFormat),
                    util.toFormat(pysStatGlobal.endDate,util.dateFormat),
                    pysStatGlobal.filterType,
                    page,
                )
            })
            jQuery(".global_data .pys_stat_time_custom .load").on("click",function () {

                if(pysStatGlobal.startDate != null && pysStatGlobal.endDate != null) {
                    pysStatGlobal.loadGlobalData(
                        type,
                        util.toFormat(pysStatGlobal.startDate,util.dateFormat),
                        util.toFormat(pysStatGlobal.endDate,util.dateFormat),
                        pysStatGlobal.filterType,
                        1,
                    )
                }

            })
            $(".pys_visit_model").on("change",function () {
                pysStatGlobal.loadGlobalData(
                    type,
                    util.toFormat(pysStatGlobal.startDate,util.dateFormat),
                    util.toFormat(pysStatGlobal.endDate,util.dateFormat),
                    pysStatGlobal.filterType,
                    1,
                )
            })
            jQuery(".global_data .pys_stat_time").on("change",function () {
                let typeDate = jQuery(this).val()
                if(typeDate == "custom") {
                    jQuery(".global_data .pys_stat_time_custom").css("display","flex")
                    pysStatGlobal.startDate = null
                    pysStatGlobal.endDate = null
                    jQuery(".global_data .pys_stat_time_custom .datepicker").text("")
                } else {
                    $(".global_data .pys_stat_time_custom").css("display","none")
                    pysStatGlobal.updateStartEndDate()
                    pysStatGlobal.loadGlobalData(
                        type,
                        util.toFormat(pysStatGlobal.startDate,util.dateFormat),
                        util.toFormat(pysStatGlobal.endDate,util.dateFormat),
                        pysStatGlobal.filterType,
                        1,
                    )
                }

            })

            $(".global_data .report").on("click",function () {
                $(".global_data .report_form input[name='label']").val(jQuery(".pys_stat_info th.title").text())
                $(".global_data .report_form input[name='type']").val(type)
                $(".global_data .report_form input[name='start_date']").val(util.toFormat(pysStatGlobal.startDate,util.dateFormat))
                $(".global_data .report_form input[name='end_date']").val(util.toFormat(pysStatGlobal.endDate,util.dateFormat))
                $(".global_data .report_form input[name='filter_type']").val(pysStatGlobal.filterType)
                $(".global_data .report_form input[name='model']").val($(".pys_visit_model").val())
                $(".global_data .report_form").submit()
            })
        },
        updateStartEndDate: function () {
            let typeDate = jQuery(".global_data .pys_stat_time").val()
            if(typeDate != "custom") {
                pysStatGlobal.endDate = util.getEndDate(typeDate)
                pysStatGlobal.startDate = util.getStartDate(pysStatGlobal.endDate,typeDate)
                jQuery( ".global_data .pys_stat_time_custom .datepicker_start" ).text("")
                jQuery( ".global_data .pys_stat_time_custom .datepicker_end" ).text("")
            }
        },
        updatePagination : function () {
            let pages = Math.ceil(pysStatGlobal.max/pysStatGlobal.perPage);
            $(".global_data .pagination").html("")
            let html = ""
            for(let i = 1;i <= pages;i++) {
                html += "<li class='page-item"+(i == pysStatGlobal.page ? " active" : "")+"' data-page='"+i+"'>"+i+"</li>"
            }
            $(".global_data .pagination").html(html)
        },

        loadGlobalData: function (type,startDate,endDate,filter,page) {

            let model = $(".pys_visit_model").val()
            let data = {
                action:"pys_stat_data",
                type:type,
                filter_type:filter,
                start_date:startDate,
                end_date:endDate,
                page:page,
                model:model
            }
            navigation.loading()
            jQuery.ajax({
                method: "POST",
                url:ajaxurl,
                data:data,
                success: function(msg){
                    //console.log(msg);
                    if(msg.success) {
                        navigation.loaded()
                        pysStatGlobal.data = msg.data.items
                        pysStatGlobal.max = msg.data.max
                        pysStatGlobal.page = page
                        chart.showGrossChart(msg.data.items,startDate,endDate)
                        pysStatGlobal.updateGlobalList(msg.data.items_sum.filters)
                        pysStatGlobal.updatePagination()
                    } else {
                        navigation.loadingError("Error load data")
                    }
                },
                error: function (e) {
                    console.log("Error load ",e)
                    navigation.loadingError("Error load data");
                }
            })
        },

        updateGlobalList:function (items) {
            jQuery(".pys_stat_info tbody").html("")

            items.forEach(function (el,index){
                let net = parseFloat(el.net).toFixed(2)
                let gross = parseFloat(el.gross).toFixed(2)
                let total = parseFloat(el.total).toFixed(2)
                let row = "<tr class='data'><td><a href='#' data-id='"+el.id+"' >"+ el.name+"</a></td><td>"+el.count+"</td><td>"+gross+"</td><td>"+net+"</td><td>"+total+"</td>";
                jQuery(".pys_stat_info tbody").append(row)
            })

        },

        toSinglePage:function (id) {
            for(let i=0;i < pysStatGlobal.data.length;i++) {
                if(pysStatGlobal.data[i].item.id == id) {
                    let item = pysStatGlobal.data[i]
                    navigation.toSingleTab(item,
                        this.filterType,
                        jQuery(".global_data .pys_stat_time").val(),
                        this.startDate,
                        this.endDate
                    )
                    break;
                }
            }
            //pysStatGlobal.updateSingleList(index)

        }
    }

    var pysStatSingle = {
        startDate: null,
        endDate:null,
        filterType:"",
        filterId:"",
        isDate:true,
        data : [],
        perPage:50,
        init : function (type) {
            $(".single_data .report").on("click",function () {
                $(".single_data .report_form input[name='type']").val(type)
                $(".single_data .report_form input[name='start_date']").val(util.toFormat(pysStatSingle.startDate,util.dateFormat))
                $(".single_data .report_form input[name='end_date']").val(util.toFormat(pysStatSingle.endDate,util.dateFormat))
                $(".single_data .report_form input[name='filter_type']").val(pysStatSingle.filterType)
                $(".single_data .report_form input[name='filter_id']").val(pysStatSingle.filterId)
                $(".single_data .report_form input[name='group_by_date']").val(pysStatSingle.isDate)
                $(".single_data .report_form input[name='model']").val($(".pys_visit_model").val())

                $(".single_data .report_form").submit()
            })
            
            let startDatepickerSingle =  jQuery( ".single_data .pys_stat_time_custom .datepicker_start" )
                .datepicker({
                    dateFormat:"mm/dd/yy"
                })
                .on( "change", function() {
                    pysStatSingle.startDate = util.getDatepickerDate( this )
                    endDatepickerSingle.datepicker( "option", "minDate", pysStatSingle.startDate );
                })

            let endDatepickerSingle =  jQuery( ".single_data .pys_stat_time_custom .datepicker_end" )
                .datepicker({
                    dateFormat:"mm/dd/yy"
                })
                .on( "change", function() {
                    pysStatSingle.endDate = util.getDatepickerDate( this )
                    startDatepickerSingle.datepicker( "option", "maxDate", pysStatSingle.endDate );
                });

            jQuery(".single_data .pys_stat_time_custom .load").on("click",function () {

                if(pysStatSingle.startDate != null && pysStatSingle.endDate != null) {
                    pysStatSingle.loadData(
                        type,
                        util.toFormat(pysStatSingle.startDate,util.dateFormat),
                        util.toFormat(pysStatSingle.endDate,util.dateFormat),
                        pysStatSingle.filterType,
                        pysStatSingle.filterId,
                    )
                }

            })
            jQuery(".single_data .pys_stat_time").on("change",function () {
                let typeDate = jQuery(this).val()
                if(typeDate == "custom") {
                    jQuery(".single_data .pys_stat_time_custom").css("display","flex")
                    pysStatSingle.startDate = null
                    pysStatSingle.endDate = null
                    jQuery(".single_data .pys_stat_time_custom .datepicker").text("")
                } else {
                    $(".single_data .pys_stat_time_custom").css("display","none")
                    pysStatSingle.updateStartEndDate()
                    pysStatSingle.loadData(
                        type,
                        util.toFormat(pysStatSingle.startDate,util.dateFormat),
                        util.toFormat(pysStatSingle.endDate,util.dateFormat),
                        pysStatSingle.filterType,
                        pysStatSingle.filterId
                    )
                }
            })

            jQuery(".single_back").on("click",function () {
                navigation.toMainTab()
            })

            $(".btn-group.order_buttons .date").on("click",function () {
                $(".btn-group.order_buttons .order").removeClass("btn-primary")
                $(".btn-group.order_buttons .order").addClass("btn-secondary")
                $(this).removeClass("btn-secondary")
                $(this).addClass("btn-primary")
                pysStatSingle.isDate = true
                $(".num_sale").css("display","table-cell")
                $(".row_title").text("Date")
                pysStatSingle.loadData(
                    type,
                    util.toFormat(pysStatSingle.startDate,util.dateFormat),
                    util.toFormat(pysStatSingle.endDate,util.dateFormat),
                    pysStatSingle.filterType,
                    pysStatSingle.filterId
                )
            })

            $(".btn-group.order_buttons .order").on("click",function () {
                $(".btn-group.order_buttons .date").removeClass("btn-primary")
                $(".btn-group.order_buttons .date").addClass("btn-secondary")
                $(this).removeClass("btn-secondary")
                $(this).addClass("btn-primary")
                pysStatSingle.isDate = false
                $(".num_sale").css("display","none")
                $(".row_title").text("Order ID")
                pysStatSingle.loadData(
                    type,
                    util.toFormat(pysStatSingle.startDate,util.dateFormat),
                    util.toFormat(pysStatSingle.endDate,util.dateFormat),
                    pysStatSingle.filterType,
                    pysStatSingle.filterId
                )
            })

            jQuery(".pys_stat_single_info_pagination").on("click","li",function () {
                pysStatSingle.showPage($(this).data("page"))
            })
        },


        open: function (data,filterType,dateType,dateStart,dateEnd,) {

            this.startDate = dateStart
            this.endDate = dateEnd
            this.filterType = filterType
            this.filterId = data.item.id

            $(".btn-group .order_buttons .date").removeClass("btn-secondary")
            $(".btn-group .order_buttons .date").addClass("btn-primary")
            $(".btn-group.order_buttons .order").removeClass("btn-primary")
            $(".btn-group.order_buttons .order").addClass("btn-secondary")
            pysStatSingle.isDate = true
            $(".num_sale").css("display","table-cell")
            $(".row_title").text("Date")
            jQuery(".single_data .pys_stat_time option").removeAttr("selected");
            jQuery(".single_data .pys_stat_time option[value='"+dateType+"']").attr("selected", "selected");
            if(dateType == "custom") {
                jQuery(".single_data .pys_stat_time_custom .datepicker_start").datepicker("setDate", dateStart);
                jQuery(".single_data .pys_stat_time_custom .datepicker_end").datepicker("setDate", dateEnd);
            }


            jQuery(".single_filter").text(data.item.name)
            pysStatSingle.loadData(
                "woo",
                util.toFormat(pysStatSingle.startDate,util.dateFormat),
                util.toFormat(pysStatSingle.endDate,util.dateFormat),
                pysStatSingle.filterType,
                pysStatSingle.filterId
            )

        },
        updateDataList: function (data) {

            let html = ""
            if(data.data.length > pysStatSingle.perPage) {
                let pages = Math.ceil(data.data.length/pysStatSingle.perPage)
                for(let i=1;i<=pages;i++) {
                    html += "<li class='page-item' data-page='"+i+"'>"+i+"</li>"
                }
            }
            jQuery(".pys_stat_single_info_pagination").html(html)

            pysStatSingle.showPage(1)
        },
        
        showPage: function (page) {

            jQuery(".pys_stat_single_info_pagination li").removeClass("active")
            jQuery(".pys_stat_single_info_pagination li[data-page='"+page+"']").addClass("active")
            let max = pysStatSingle.data.data.length > pysStatSingle.perPage*page ? pysStatSingle.perPage*page : pysStatSingle.data.data.length
            let dataItems = pysStatSingle.data.data.slice((page-1)*pysStatSingle.perPage,max)
            let html = ""
            if(this.isDate) {
                dataItems.forEach((item) => {
                    let data = (new Date(item.x)).toLocaleDateString()
                    html += "<tr class='data'>" +
                        "<td>"+ data+"</td>" +
                        "<td >"+item.count+"</td>" +
                        "<td>"+parseFloat(item.gross).toFixed(2)+"</td>" +
                        "<td>"+parseFloat(item.net).toFixed(2)+"</td>" +
                        "<td>"+parseFloat(item.total).toFixed(2)+"</td>" +
                        "</tr>";

                })
            } else {
                dataItems.forEach((item) => {
                    html += "<tr class='data'>" +
                        "<td><a href='post.php?post="+item.order_id+"&action=edit' target='_blank'>"+ item.order_id+"</a></td>" +
                        "<td>"+parseFloat(item.gross).toFixed(2)+"</td>" +
                        "<td>"+parseFloat(item.net).toFixed(2)+"</td>" +
                        "<td>"+parseFloat(item.total).toFixed(2)+"</td>" +
                        "</tr>";
                })
            }
            jQuery(".pys_stat_single_info tbody").html(html)
        },


        loadData: function (type,dateStart,dateEnd,filter,filterId) {
            navigation.loading()
            let model = $(".pys_visit_model").val()
            let data = {action:"pys_stat_single_data",
                type:type,
                filter_type:filter,
                filter_id:filterId,
                start_date:dateStart,
                end_date:dateEnd,
                group_by_date:pysStatSingle.isDate,
                model:model
            }
            jQuery.ajax({
                method: "POST",
                url:ajaxurl,
                data:data,
                success: function(msg){
                   // console.log(msg);
                    if(msg.success) {
                        navigation.loaded()
                        pysStatSingle.data = msg.data
                        pysStatSingle.updateDataList(msg.data)
                        chart.showSingleChart(msg.data,dateStart,dateEnd)

                    } else {
                        navigation.loadingError("Error load data")
                    }
                },
                error: function (e) {
                    console.log("Error load ",e)
                    navigation.loadingError("Error load data")
                }
            })
        },

        updateStartEndDate: function () {
            let typeDate = jQuery(".single_data .pys_stat_time").val()
            if(typeDate != "custom") {
                this.endDate = util.getEndDate(typeDate)
                this.startDate = util.getStartDate(this.endDate,typeDate)
                jQuery( ".single_data .pys_stat_time_custom .datepicker_start" ).text("")
                jQuery( ".single_data .pys_stat_time_custom .datepicker_end" ).text("")
            }
        },

    }

    let statImport = {

        maxPage: 1,

        start:  function () {
            statImport.maxPage = $(".stat_progress").data("max_page")
            let page = $(".stat_progress").data("page")
            statImport.importNewPage(page)
        },

        importNewPage: function (page) {
            jQuery.ajax({
                method: "POST",
                url:ajaxurl,
                data:{action:"pys_stat_sync",page:page},
                success: function(msg){
                    if(msg.success) {
                        statImport.updateProgress(page)
                        if(!msg.data.isLastPage) {
                            statImport.importNewPage(page + 1)
                        } else {
                            window.location.reload();
                        }
                    } else {
                        alert("Error import order")
                    }
                },
            });
        },
        updateProgress:function (page) {
            let persent = (page/statImport.maxPage * 100).toFixed(0) + "%"
            $(".stat_progress .progress-bar").css("width",persent)
            $(".stat_progress .progress-bar").text(persent)
        }
    }

    jQuery( document ).ready(function() {
        pysStatGlobal.init("woo")
        pysStatSingle.init("woo")

        $(".btn-save-woo-stat").on("click",function () {

            jQuery.ajax({
                method: "POST",
                url:ajaxurl,
                data:{action:"pys_stat_change_orders_status",orders:$("#woo_stat_order_statuses").val()},
                success: function(msg){
                    if(msg.success) {
                        window.location.reload();
                    }
                },
            })
        })

        if($(".stat_progress").length > 0) {
            statImport.start()
        } else {
            jQuery(".pys_stats_filters .filter[data-type='traffic_source']").click()
        }
    })






}(jQuery);












