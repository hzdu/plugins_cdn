
! function ($, orderType) {
    let chart = {
        chartGlobal: "",
        chartSingle: "",
        colors:["#1B2B9A","#78c5b0","#E6AF2E","#BEB2C8","#B6244F","#35524A","#162521","#408c35","#bb9b31","#ff00ff"],
        init : function () {
            if(jQuery("#pys_stat_graphics").length > 0) {
                this.chartGlobal = new PYS_Chart(jQuery("#pys_stat_graphics"), {
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
                                            'day': 'dd/MM',
                                            'month': 'MMM'
                                        },
                                        tooltipFormat: 'dd/MM'
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

                        }
                    }
                );
            }
            if(jQuery("#pys_stat_single_graphics").length > 0) {
                this.chartSingle = new PYS_Chart(jQuery("#pys_stat_single_graphics"), {
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
                                            'day': 'dd/MM',
                                            'month': 'MMM'
                                        },
                                        tooltipFormat: 'dd/MM'
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

                        }
                    }
                );
            }
        },
        showGrossChart: function (items,start,end,orderBy) {
            let order = ""
            switch (orderBy) {
                case "order": order = "count"; break;
                case "gross_sale": order = "gross"; break;
                case "net_sale": order = "net"; break;
                case "total_sale": order = "total"; break;
            }
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
                        yAxisKey: order
                    },
                    borderColor: color,
                    backgroundColor:color
                };
                datasets.push(newDataset)
            })

            chart.chartGlobal.options.scales.xAxis.min = start
            chart.chartGlobal.options.scales.xAxis.max = end

            chart.chartGlobal.data.datasets = datasets;

            let startDate = new Date(start)
            let endDate = new Date(end)
            const diffTime = Math.abs(endDate - startDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if(diffDays > 180) {
                chart.chartGlobal.options.scales.xAxis.time.unit = "month"
            } else {
                chart.chartGlobal.options.scales.xAxis.time.unit = "day"
            }

            chart.chartGlobal.update();
        },
        showSingleChart: function (data,start,end,type,label) {
            console.log(label)
            let datasets = [];
            if(type == "products") {
                let dateItems = data.chart.sort(function(a,b){
                    return new Date(b.x) - new Date(a.x);
                });

                datasets.push({
                    label: label,
                    data: dateItems,
                    parsing: {
                        yAxisKey: 'y'
                    },
                    borderColor: chart.colors[0],
                    backgroundColor:chart.colors[0],
                })

            } else {
                let dateItems = data.data.sort(function(a,b){
                    return new Date(b.x) - new Date(a.x);
                });

                datasets.push({
                    label: (pysStatSingle.cog === 'cog' || pysStatGlobal.cog === 'cog') ? 'Cost Sale' : 'Gross Sale',
                    data: dateItems,
                    parsing: {
                        yAxisKey: 'gross'
                    },
                    borderColor: chart.colors[0],
                    backgroundColor:chart.colors[0],
                })

                datasets.push({
                    label: (pysStatSingle.cog === 'cog' || pysStatGlobal.cog === 'cog') ? 'Profit' : 'Net Sale',
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
            }




            chart.chartSingle.options.scales.xAxis.min = start
            chart.chartSingle.options.scales.xAxis.max = end
            chart.chartSingle.data.datasets = datasets;


            let startDate = new Date(start)
            let endDate = new Date(end)
            const diffTime = Math.abs(endDate - startDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if(diffDays > 180) {
                chart.chartSingle.options.scales.xAxis.time.unit = "month"
            } else {
                chart.chartSingle.options.scales.xAxis.time.unit = "day"
            }

            chart.chartSingle.update();
        },

    }
    let util = { //date-fns
        dateFormat : "yyyy-MM-dd",

        toFormat : function (date,format) {
            return PYS_Chart._adapters._date.prototype.format(date,format)
        },
        add:function (date, duration,unit) {
            return PYS_Chart._adapters._date.prototype.add(date, duration,unit)
        },
        startOf:function (date, unit) {
            return PYS_Chart._adapters._date.prototype.startOf(date, unit)
        },
        endOf:function (date, unit) {
            return PYS_Chart._adapters._date.prototype.endOf(date, unit)
        },
        getDatepickerDate( value ) {
            var date;
            try {
                date = jQuery.datepicker.parseDate( "mm/dd/yy", value );
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
    }

    var pysStatGlobal = {
        data:[],
        page : 1,
        perPage:10,
        max:0,
        startDate : null,
        endDate : null,
        type : "",
        cog: Cookies.get('stat_cog') ? Cookies.get('stat_cog') : 'default',
        init: function (type) {
            chart.init()
            pysStatGlobal.type = type
            pysStatGlobal.perPage = parseInt($(".pys_stat .per_page_selector").val())
            pysStatGlobal.updateStartEndDate()
            singleTable.initGlobalTable(pysStatGlobal.type,function () {
                pysStatGlobal.loadGlobalData(1)
            })
            tableNavigation.init($("#pys .global_data .pagination"),function (page) {
                pysStatGlobal.loadGlobalData(page)
            })
            let startDatepicker =  jQuery( ".global_data .pys_stat_time_custom .datepicker_start" )
                .datepicker({
                    dateFormat:"mm/dd/yy"
                })
                .on( "change", function() {
                    pysStatGlobal.startDate = util.getDatepickerDate( this.value )
                    endDatepicker.datepicker( "option", "minDate", pysStatGlobal.startDate );
                })

            let endDatepicker =  jQuery( ".global_data .pys_stat_time_custom .datepicker_end" )
                .datepicker({
                    dateFormat:"mm/dd/yy"
                })
                .on( "change", function() {
                    pysStatGlobal.endDate = util.getDatepickerDate( this.value )
                    startDatepicker.datepicker( "option", "maxDate", pysStatGlobal.endDate );
                });

            $(".pys_stat .per_page_selector").on("change",function () {
                pysStatGlobal.perPage = parseInt($(this).val());
                pysStatGlobal.loadGlobalData(1)
            })

            $(".reload_table").on("click",function () {
                pysStatGlobal.loadGlobalData(tableNavigation.page)
            })

            jQuery(".pys_stats_filters .filter a").on("click",function (e) {
                e.preventDefault();
                let time = jQuery(".global_data .pys_stat_time").val()
                let url = $(this).attr("href")
                url +="&time="+time
                url +="&per_page="+pysStatGlobal.perPage
                url +="&data_model="+$("#select_visit_model").val()
                if( time == "custom") {
                    url +="&time_start="+util.toFormat(pysStatGlobal.startDate,util.dateFormat)
                    url +="&time_end="+ util.toFormat(pysStatGlobal.endDate,util.dateFormat)
                }
                window.location = encodeURI(url)
            });
            jQuery(".pys_stat_info").on("click",".data a",function (e) {
                e.preventDefault();

                let url = $(this).attr("href")
                let time = jQuery(".global_data .pys_stat_time").val()
                url +="&active_filter="+$(".pys_stats_filters .active").data("type")
                url +="&title="+$(this).text().trim()
                url +="&time="+time
                url +="&per_page="+pysStatGlobal.perPage
                url +="&data_model="+$("#select_visit_model").val()
                if( time == "custom") {
                    url +="&time_start="+util.toFormat(pysStatGlobal.startDate,util.dateFormat)
                    url +="&time_end="+ util.toFormat(pysStatGlobal.endDate,util.dateFormat)
                }


                window.location = encodeURI(url)

            })


            jQuery(".global_data .pys_stat_time_custom .load").on("click",function () {

                if(pysStatGlobal.startDate != null && pysStatGlobal.endDate != null) {
                    pysStatGlobal.loadGlobalData(1)
                }

            })
            $("#select_visit_model").on("change",function () {
                pysStatGlobal.loadGlobalData(1)
            })
            $(".pys_stat .COG_custom_report_button_block button.button").on("click",function (e) {
                e.preventDefault();
                $(".pys_stat .COG_custom_report_button_block button.button").removeClass('btn-primary btn-secondary');
                $(this).addClass('btn-primary');
                pysStatGlobal.cog = $(this).data('value');
                Cookies.set('stat_cog', $(this).data('value'), { expires: 7 });
                location.reload();
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
                    pysStatGlobal.loadGlobalData(1)
                }

            })

            $(".global_data .all_report").on("click",function () {

                $(".global_data .report_form input[name='cog']").val(pysStatGlobal.cog);
                $(".global_data .report_form input[name='label']").val(jQuery(".pys_stat_info th.title").text())
                $(".global_data .report_form input[name='type']").val(type)
                $(".global_data .report_form input[name='start_date']").val(util.toFormat(pysStatGlobal.startDate,util.dateFormat))
                $(".global_data .report_form input[name='end_date']").val(util.toFormat(pysStatGlobal.endDate,util.dateFormat))
                $(".global_data .report_form input[name='filter_type']").val($(".pys_stats_filters .active").data("type"))
                $(".global_data .report_form input[name='model']").val($("#select_visit_model").val())
                $(".global_data .report_form input[name='export_type']").val('all')
                $(".global_data .report_form").submit()
            })

            $(".global_data .report").on("click",function () {

                $(".global_data .report_form input[name='cog']").val(pysStatGlobal.cog);
                $(".global_data .report_form input[name='label']").val(jQuery(".pys_stat_info th.title").text())
                $(".global_data .report_form input[name='type']").val(type)
                $(".global_data .report_form input[name='start_date']").val(util.toFormat(pysStatGlobal.startDate,util.dateFormat))
                $(".global_data .report_form input[name='end_date']").val(util.toFormat(pysStatGlobal.endDate,util.dateFormat))
                $(".global_data .report_form input[name='filter_type']").val($(".pys_stats_filters .active").data("type"))
                $(".global_data .report_form input[name='model']").val($("#select_visit_model").val())
                $(".global_data .report_form input[name='export_type']").val('current')
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
            } else {
                let startTime = jQuery( ".global_data .pys_stat_time_custom .datepicker_start").val()
                let endTime = jQuery( ".global_data .pys_stat_time_custom .datepicker_end").val()

                pysStatGlobal.endDate = util.getDatepickerDate( endTime )
                pysStatGlobal.startDate = util.getDatepickerDate(startTime)
            }
        },


        loadGlobalData: function (page) {

            let model = $("#select_visit_model").val()
            let order_by = $(".global_data .pys_stat_info .active").data("order")
            let startDate = util.toFormat(pysStatGlobal.startDate,util.dateFormat)
            let endDate = util.toFormat(pysStatGlobal.endDate,util.dateFormat)
            let data = {
                action: "pys_"+pysStatGlobal.type+"_stat_data",
                filter_type:$(".pys_stats_filters .active").data("type"),
                start_date:startDate,
                end_date:endDate,
                page:page,
                perPage:pysStatGlobal.perPage,
                model:model,
                order_by:order_by,
                cog: pysStatGlobal.cog,
                sort:$(".global_data .pys_stat_info .active").data("sort"),
                _wpnonce:$("#html_report_wpnonce").val()
            }
            navigation.loading()
            jQuery.ajax({
                method: "POST",
                url:ajaxurl,
                data:data,
                success: function(msg){
                    //console.log(msg);
                    if(msg.success) {
                        if (msg.data.cog == 'cog' && !msg.data.cogActive) {
                            $(".pys_stat").addClass('showInfoBlock');
                            navigation.loaded()
                        } else {
                            $(".pys_stat").removeClass('showInfoBlock');
                            navigation.loaded()
                            console.log(msg)
                            pysStatGlobal.data = msg.data.items
                            pysStatGlobal.max = msg.data.max
                            pysStatGlobal.page = page
                            chart.showGrossChart(msg.data.items, startDate, endDate, order_by)
                            singleTable.head = [
                                {
                                    title: msg.data.colName,
                                    isSortable: false,
                                    slug: "title",
                                    isDefault: false,
                                },
                                {
                                    title: "Orders",
                                    isSortable: true,
                                    slug: "order",
                                    isDefault: false,
                                },
                                {
                                    title: (pysStatSingle.cog === 'cog' || pysStatGlobal.cog === 'cog') ? 'Cost' : 'Gross Sale',
                                    isSortable: true,
                                    slug: "gross_sale",
                                    isDefault: true,
                                },
                                {
                                    title: (pysStatSingle.cog === 'cog' || pysStatGlobal.cog === 'cog') ? 'Profit' : 'Net Sale',
                                    isSortable: true,
                                    slug: "net_sale",
                                    isDefault: false,
                                },
                                {
                                    title: "Total sale",
                                    isSortable: true,
                                    slug: "total_sale",
                                    isDefault: false,
                                }
                            ]
                            singleTable.fillHead();
                            singleTable.fillData(msg.data.items_sum.filters)

                            if (page == 1) {
                                tableNavigation.initPages(msg.data.max, pysStatGlobal.perPage)
                            }
                            let total = "<li><span class=\"title\">" + $(".pys_stats_filters .active").text().trim() + ": </span> <span class=\"count\">" + msg.data.max + "</span></li>"
                            msg.data.total.forEach(function (el) {
                                total += "<li>" + el.name + el.value + "</li>";
                            })

                            $(".global_data .total").html(total)

                        }
                    }
                    else {
                        navigation.loadingError("Error load data")
                    }

                },
                error: function (e) {
                    console.log("Error load ",e)
                    navigation.loadingError("Error load data");
                }
            })
        },
    }

    var pysStatSingle = {
        startDate: null,
        endDate:null,
        filterType:"",
        filterId:"",
        data : [],
        model : "",
        type:"",
        cog: Cookies.get('stat_cog') ? Cookies.get('stat_cog') : 'default',
        perPage:50,

        init : function (type,model,filter,filterId) {
            chart.init()
            pysStatSingle.type = type
            pysStatSingle.model = model
            pysStatSingle.filterType = filter
            pysStatSingle.filterId = filterId
            pysStatSingle.perPage = parseInt($(".pys_stat .per_page_selector").val())
            pysStatSingle.updateStartEndDate()
            singleTable.initDatesTable(pysStatSingle.type,function (){
                pysStatSingle.loadData()
            })
            tableNavigation.init($(".pys_stat_single_info_pagination"),function (page) {
                if(pysStatSingle.max == pysStatSingle.data.data.length) {
                    pysStatSingle.showPage(page)
                } else {
                    pysStatSingle.loadData(page)
                }

            })
            $(".reload_table").on("click",function () {
                pysStatSingle.loadData(tableNavigation.page)
            })
            $(".single_data .report").on("click",function () {
                $(".single_data .report_form input[name='cog']").val(pysStatSingle.cog);
                $(".single_data .report_form input[name='type']").val(type)
                $(".single_data .report_form input[name='start_date']").val(util.toFormat(pysStatSingle.startDate,util.dateFormat))
                $(".single_data .report_form input[name='end_date']").val(util.toFormat(pysStatSingle.endDate,util.dateFormat))
                $(".single_data .report_form input[name='filter_type']").val(pysStatSingle.filterType)
                $(".single_data .report_form input[name='filter_id']").val(pysStatSingle.filterId)
                $(".single_data .report_form input[name='single_table_type']").val(singleTable.tableType)
                $(".single_data .report_form input[name='model']").val(pysStatSingle.model)

                $(".single_data .report_form").submit()
            })

            let startDatepickerSingle =  jQuery( ".single_data .pys_stat_time_custom .datepicker_start" )
                .datepicker({
                    dateFormat:"mm/dd/yy"
                })
                .on( "change", function() {
                    pysStatSingle.startDate = util.getDatepickerDate( this.value )
                    endDatepickerSingle.datepicker( "option", "minDate", pysStatSingle.startDate );
                })

            let endDatepickerSingle =  jQuery( ".single_data .pys_stat_time_custom .datepicker_end" )
                .datepicker({
                    dateFormat:"mm/dd/yy"
                })
                .on( "change", function() {
                    pysStatSingle.endDate = util.getDatepickerDate( this.value )
                    startDatepickerSingle.datepicker( "option", "maxDate", pysStatSingle.endDate );
                });

            jQuery(".single_data .pys_stat_time_custom .load").on("click",function () {

                if(pysStatSingle.startDate != null && pysStatSingle.endDate != null) {
                    pysStatSingle.loadData()
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
                    pysStatSingle.loadData()
                }
            })
            $(".pys_stat .per_page_selector").on("change",function () {
                pysStatSingle.perPage = parseInt($(this).val());
                pysStatSingle.loadData()
            })

            $(".pys_stat .COG_custom_report_button_block button.button").on("click",function (e) {
                e.preventDefault();
                $(".pys_stat .COG_custom_report_button_block button.button").removeClass('btn-primary btn-secondary');
                $(this).addClass('btn-primary');
                pysStatSingle.cog = $(this).data('value');
                Cookies.set('stat_cog', $(this).data('value'), { expires: 7 });
                location.reload();
            })


            jQuery(".single_back").on("click",function () {
                history.back()
            })

            $(".btn-group.order_buttons .btn").on("click",function () {
                let active = $(".btn-group.order_buttons .btn.btn-primary")
                active.removeClass("btn-primary")
                active.addClass("btn-secondary")
                $(this).removeClass("btn-secondary")
                $(this).addClass("btn-primary")
                singleTable.initTable($(this).data("slug"),pysStatSingle.type)
                pysStatSingle.loadData()
            })

        },

        showPage: function (page) {

            if(pysStatSingle.max == pysStatSingle.data.data.length) {
                let max = pysStatSingle.data.data.length > pysStatSingle.perPage*page ? pysStatSingle.perPage*page : pysStatSingle.data.data.length
                let dataItems = pysStatSingle.data.data.slice((page-1)*pysStatSingle.perPage,max)
                singleTable.fillData(dataItems)
            } else {
                singleTable.fillData(pysStatSingle.data.data)
            }


        },


        loadData: function (page = 1) {
            navigation.loading()
            let type = pysStatSingle.type
            let dateStart = util.toFormat(pysStatSingle.startDate,util.dateFormat)
            let dateEnd = util.toFormat(pysStatSingle.endDate,util.dateFormat)
            let filter = pysStatSingle.filterType
            let filterId = pysStatSingle.filterId

            let model = pysStatSingle.model
            let data = {action:"pys_"+type+"_stat_single_data",
                filter_type:filter,
                filter_id:filterId,
                start_date:dateStart,
                end_date:dateEnd,
                single_table_type:singleTable.tableType,
                model:model,
                order_by:singleTable.orderBy,
                sort:singleTable.sort,
                page:page,
                cog: pysStatSingle.cog,
                perPage:pysStatSingle.perPage,
                _wpnonce:$("#html_report_wpnonce").val()
            };
            jQuery.ajax({
                method: "POST",
                url:ajaxurl,
                data:data,
                success: function(msg){
                    // console.log(msg);
                    if(msg.success) {
                        if (msg.data.cog == 'cog' && !msg.data.cogActive) {
                            $(".pys_stat").addClass('showInfoBlock');
                            navigation.loaded()
                        } else {
                            $(".pys_stat").removeClass('showInfoBlock');
                            navigation.loaded()
                            pysStatSingle.data = msg.data
                            pysStatSingle.max = msg.data.max
                            pysStatSingle.showPage(page)
                            if (page == 1) {
                                tableNavigation.initPages(msg.data.max, pysStatSingle.perPage)
                            }
                            chart.showSingleChart(msg.data, dateStart, dateEnd, singleTable.tableType, singleTable.selectedColl)
                            let total = ""
                            msg.data.total.forEach(function (el) {
                                total += "<li>" + el.name + el.value + "</li>";
                            })


                            $(".single_data .total").html(total)

                        }

                    }
                    else
                    {
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
            } else {
                let startTime = jQuery( ".single_data .pys_stat_time_custom .datepicker_start").val()
                let endTime = jQuery( ".single_data .pys_stat_time_custom .datepicker_end").val()
                pysStatSingle.endDate = util.getDatepickerDate( endTime )
                pysStatSingle.startDate = util.getDatepickerDate(startTime)
            }
        },

    }




    let statImport = {
        type:"",
        maxPage: 1,

        start:  function () {
            statImport.type  = $(".stat_progress").data("type")
            statImport.maxPage = $(".stat_progress").data("max_page")
            let page = $(".stat_progress").data("page")
            statImport.importNewPage(page)
        },

        importNewPage: function (page) {
            jQuery.ajax({
                method: "POST",
                url:ajaxurl,
                data:{
                    action:"pys_"+statImport.type+"_stat_sync",
                    page:page,
                    _wpnonce:$("#html_report_wpnonce").val()
                },
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

    let singleTable = {
        tableType : "dates",
        head:[],
        parent : null,
        onSort : null,
        orderBy : "",
        sort : "desc",
        selectedColl : "",
        type:"",
        initTable: function (typeTable,typeData) {
            switch (typeTable) {
                case "global": singleTable.initGlobalTable(typeData); break;
                case "dates": singleTable.initDatesTable(typeData); break;
                case "orders": singleTable.initOrdersTable(typeData); break;
                case "products": singleTable.initProductsTable(typeData); break;
            }
        },

        initGlobalTable:function (typeData,onSort) {
            singleTable.type = typeData
            singleTable.parent = $(".pys_stat_info")
            singleTable.tableType = "global"
            singleTable.onSort = onSort
            singleTable.head = [
                {
                    title:"",
                    isSortable:false,
                    slug:"title",
                    isDefault:false,
                },
                {
                    title:"Orders",
                    isSortable:true,
                    slug:"order",
                    isDefault:false,
                },
                {
                    title: (pysStatSingle.cog === 'cog' || pysStatGlobal.cog === 'cog') ? 'Cost' : 'Gross Sale',
                    isSortable:true,
                    slug:"gross_sale",
                    isDefault:true,
                },
                {
                    title:(pysStatSingle.cog === 'cog' || pysStatGlobal.cog === 'cog') ? 'Profit' : 'Net Sale',
                    isSortable:true,
                    slug:"net_sale",
                    isDefault:false,
                },
                {
                    title:"Total sale",
                    isSortable:true,
                    slug:"total_sale",
                    isDefault:false,
                }
            ]
            this.fillHead()
        },
        initDatesTable:function (dataType,onSort) {
            singleTable.type = dataType
            singleTable.parent = $(".pys_stat_single_info")
            singleTable.tableType = "dates"
            singleTable.onSort = onSort
            singleTable.head = [
                {
                    title:"Date",
                    isSortable:false,
                    slug:"date"
                },
                {
                    title:"Orders",
                    isSortable:false,
                    slug:"orders"
                },
                {
                    title:(pysStatSingle.cog === 'cog' || pysStatGlobal.cog === 'cog') ? 'Cost' : 'Gross Sale',
                    isSortable:false,
                    slug:"gross"
                },
                {
                    title:(pysStatSingle.cog === 'cog' || pysStatGlobal.cog === 'cog') ? 'Profit' : 'Net Sale',
                    isSortable:false,
                    slug:"net"
                },
                {
                    title:"Total sale",
                    isSortable:false,
                    slug:"total"
                }
            ]
            this.fillHead()
        },

        initOrdersTable:function (dataType) {
            singleTable.type = dataType
            singleTable.parent = $(".pys_stat_single_info")
            singleTable.tableType = "orders"
            singleTable.head = [
                {
                    title:"Order Id",
                    isSortable:false,
                    slug:"order_id"
                },
                {
                    title:(pysStatSingle.cog === 'cog' || pysStatGlobal.cog === 'cog') ? 'Cost' : 'Gross Sale',
                    isSortable:false,
                    slug:"gross"
                },
                {
                    title: (pysStatSingle.cog === 'cog' || pysStatGlobal.cog === 'cog') ? 'Profit' : 'Net Sale',
                    isSortable:false,
                    slug:"net"
                },
                {
                    title:"Total sale",
                    isSortable:false,
                    slug:"total"
                }
            ]
            this.fillHead()
        },

        initProductsTable:function (dataType) {
            singleTable.type = dataType
            singleTable.parent = $(".pys_stat_single_info")
            singleTable.tableType = "products";
            singleTable.head = [
                {
                    title:"Product Name",
                    isSortable:false,
                    isDefault:false,
                    slug:"product"
                },
                {
                    title:"Qty",
                    isSortable:true,
                    isDefault:false,
                    slug:"qty"
                },
                {
                    title:"Orders",
                    isSortable:true,
                    isDefault:false,
                    slug:"count_order"
                },
                {
                    title:(pysStatSingle.cog === 'cog' || pysStatGlobal.cog === 'cog') ? 'Cost' : 'Gross Sale',
                    isSortable:true,
                    isDefault: (pysStatSingle.cog === 'cog' || pysStatGlobal.cog === 'cog') ? false : true,
                    slug:"gross"
                },
                {
                    title: (pysStatSingle.cog === 'cog' || pysStatGlobal.cog === 'cog') ? 'Profit' : 'Net Sale',
                    isSortable:true,
                    isDefault: (pysStatSingle.cog === 'cog' || pysStatGlobal.cog === 'cog') ? true : false,
                    isHidden: (pysStatSingle.cog === 'cog' || pysStatGlobal.cog === 'cog') ? false : true,
                    slug:"net"
                },
                {
                    title:"Total sale",
                    isSortable:true,
                    isDefault:false,
                    slug:"total"
                }];
            this.fillHead()
        },

        fillHead: function () {
            let head = "<thead><tr>"
            singleTable.head.forEach(function (item) {
                let cl = item.slug == 'title' ? 'title' :'';
                let html = ""

                if(item.isSortable) {
                    cl += " sortable"
                    if(item.isDefault) {
                        cl += " active"
                        html = ' <i class="fa fa-sort-desc"></i>'
                        singleTable.orderBy = item.slug
                        singleTable.selectedColl = item.title
                    } else {
                        html = ' <i class="fa fa-sort"></i>'
                    }

                }

                if(typeof item.isHidden === "undefined" || (typeof item.isHidden !== "undefined" && item.isHidden == false))
                {
                    head += "<th class='"+cl+"' data-order='"+item.slug+"' data-sort='desc'>"+item.title+html+"</th>"
                }

            })
            head += "</tr></tbody><tbody></tbody>"
            singleTable.parent.html(head)

            singleTable.parent.find("th.sortable").on("click",function () {
                if($(this).hasClass("active")) {
                    if($(this).data("sort") == "desc") {
                        $(this).data("sort","asc")
                        $(this).find("i").attr("class","fa fa-sort-asc")
                    } else {
                        $(this).data("sort","desc")
                        $(this).find("i").attr("class","fa fa-sort-desc")
                    }
                    singleTable.sort = $(this).data("sort")
                } else {
                    let $active = singleTable.parent.find("th.active")
                    $active.removeClass("active")
                    $active.find("i").attr("class","fa fa-sort")
                    $(this).addClass("active")
                    $(this).data("sort","desc")
                    $(this).find("i").attr("class","fa fa-sort-desc")

                    singleTable.sort = $(this).data("sort")
                    singleTable.orderBy = $(this).data("order")
                }
                singleTable.selectedColl = $(this).text()
                singleTable.onSort()

            })
        },

        fillData:function (items) {
            let rows = ""
            let activeIndex = singleTable.parent.find("th.active").index()
            switch (singleTable.tableType) {
                case "global": {
                    items.forEach(function (el) {
                        let net = parseFloat(el.net).toFixed(2)
                        let gross = parseFloat(el.gross).toFixed(2)
                        let total = parseFloat(el.total).toFixed(2)
                        rows += "<tr class='data'>" +
                            "<td><a href='?page=pixelyoursite_"+singleTable.type+"_reports&filter_id="+el.id+"' data-id='"+el.id+"' >"+ el.name+"</a></td>" +
                            "<td "+(activeIndex == 1 ? "class='active'" : "")+">"+el.count+"</td>" +
                            "<td "+(activeIndex == 2 ? "class='active'" : "")+">"+gross+"</td>" +
                            "<td "+(activeIndex == 3 ? "class='active'" : "")+">"+net+"</td>" +
                            "<td "+(activeIndex == 4 ? "class='active'" : "")+">"+total+"</td>" +
                            "</tr>";
                    })
                } break;
                case "dates": {

                    items.forEach(function (item) {
                        let data = (new Date(item.x)).toLocaleDateString()
                        rows += "<tr class='data'>" +
                            "<td>"+ data+"</td>" +
                            "<td "+(activeIndex == 1 ? "class='active'" : "")+">"+item.count+"</td>" +
                            "<td "+(activeIndex == 2 ? "class='active'" : "")+">"+parseFloat(item.gross).toFixed(2)+"</td>" +
                            "<td "+(activeIndex == 3 ? "class='active'" : "")+">"+parseFloat(item.net).toFixed(2)+"</td>" +
                            "<td "+(activeIndex == 4 ? "class='active'" : "")+">"+parseFloat(item.total).toFixed(2)+"</td>" +
                            "</tr>";
                    })
                } break;
                case "orders": {

                    items.forEach(function (item) {
                        let url = "";
                        if(singleTable.type == "woo") {
                            url = "post.php?post="+item.order_id+"&action=edit"
                        } else {
                            url = "edit.php?post_type=download&page=edd-payment-history&view=view-order-details&id="+item.order_id
                        }

                        rows += "<tr class='data'>" +
                            "<td><a href='"+url+"' target='_blank'>"+ item.order_id+"</a></td>" +
                            "<td "+(activeIndex == 2 ? "class='active'" : "")+">"+parseFloat(item.gross).toFixed(2)+"</td>" +
                            "<td "+(activeIndex == 3 ? "class='active'" : "")+">"+parseFloat(item.net).toFixed(2)+"</td>" +
                            "<td "+(activeIndex == 4 ? "class='active'" : "")+">"+parseFloat(item.total).toFixed(2)+"</td>" +
                            "</tr>";
                    })
                } break;
                case "products": {

                    items.forEach(function (item) {
                        if(pysStatSingle.cog === 'cog' || pysStatGlobal.cog === 'cog') {
                            rows += "<tr class='data'>" +
                                "<td><a href='post.php?post="+item.id+"&action=edit' target='_blank'>"+ item.name+"</a></td>" +
                                "<td "+(activeIndex == 1 ? "class='active'" : "")+">"+item.qty+"</td>" +
                                "<td "+(activeIndex == 2 ? "class='active'" : "")+">"+item.orders+"</td>" +
                                "<td "+(activeIndex == 3 ? "class='active'" : "")+">"+parseFloat(item.gross).toFixed(2)+"</td>" +
                                "<td "+(activeIndex == 4 ? "class='active'" : "")+">"+parseFloat(item.net).toFixed(2)+"</td>" +
                                "<td "+(activeIndex == 5 ? "class='active'" : "")+">"+parseFloat(item.total).toFixed(2)+"</td>" +
                                "</tr>";
                        }
                        else
                        {
                            rows += "<tr class='data'>" +
                                "<td><a href='post.php?post="+item.id+"&action=edit' target='_blank'>"+ item.name+"</a></td>" +
                                "<td "+(activeIndex == 1 ? "class='active'" : "")+">"+item.qty+"</td>" +
                                "<td "+(activeIndex == 2 ? "class='active'" : "")+">"+item.orders+"</td>" +
                                "<td "+(activeIndex == 3 ? "class='active'" : "")+">"+parseFloat(item.gross).toFixed(2)+"</td>" +
                                "<td "+(activeIndex == 4 ? "class='active'" : "")+">"+parseFloat(item.total).toFixed(2)+"</td>" +
                                "</tr>";
                        }

                    })
                } break;
            }

            singleTable.parent.find("tbody").html(rows)
        }
    }

    let tableNavigation = {
        parent : null,
        onClick : null,
        page: 1,
        init:function (parent,onClick) {
            tableNavigation.onClick = onClick
            tableNavigation.parent = parent;
            parent.on("click","li",function () {
                tableNavigation.selectPage($(this).data("page"))
            })
        },
        initPages: function (max,perPage) {
            let html = ""

            if(max > perPage) {
                let pages = Math.ceil(max/perPage)
                for(let i=1;i<=pages;i++) {
                    html += "<li class='page-item"+(i === 1 ? " active" : "")+"' data-page='"+i+"'>"+i+"</li>"
                }
            }

            tableNavigation.parent.html(html)
        },

        selectPage: function (page) {
            tableNavigation.page = page
            tableNavigation.parent.find("li.active").removeClass("active")
            tableNavigation.parent.find("li[data-page='"+page+"']").addClass("active")
            tableNavigation.onClick(page)
        }

    }

    jQuery( document ).ready(function() {

        if($(".stat_progress").length > 0) {
            statImport.start()
        } else {
            if($("#pys .single_data").length>0) {
                pysStatSingle.init($("#pys .single_data").data("type"),$("#pys .single_data").data("model"),$("#pys .single_data").data("filter"),$("#pys .single_data").data("filter_id"))
                pysStatSingle.loadData()
            }

            if($("#pys .global_data").length>0) {
                pysStatGlobal.init(($("#pys .global_data").data("type")) )
                pysStatGlobal.loadGlobalData(1)
            }

        }



        $(".btn-save-woo-stat").on("click",function () {

            jQuery.ajax({
                method: "POST",
                url:ajaxurl,
                data:{
                    action:"pys_woo_stat_change_orders_status",
                    orders:$("#woo_stat_order_statuses").val(),
                    _wpnonce:$("#html_report_wpnonce").val()
                },
                success: function(msg){
                    if(msg.success) {
                        window.location.reload();
                    }
                },
            })
        })

        $(".btn-save-edd-stat").on("click",function () {

            jQuery.ajax({
                method: "POST",
                url:ajaxurl,
                data:{
                    action:"pys_edd_stat_change_orders_status",
                    orders:$("#edd_stat_order_statuses").val(),
                    _wpnonce:$("#html_report_wpnonce").val()
                },
                success: function(msg){
                    if(msg.success) {
                        window.location.reload();
                    }
                },
            })
        })


    })






}(jQuery);












