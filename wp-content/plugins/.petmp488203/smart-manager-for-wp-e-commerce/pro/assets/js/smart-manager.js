
function Smart_Manager_Pro() {
    Smart_Manager.apply();
}

Smart_Manager_Pro.prototype = Object.create(Smart_Manager.prototype);
Smart_Manager_Pro.prototype.constructor = Smart_Manager_Pro;
    
Smart_Manager_Pro.prototype.getDataDefaultParams = function(params) {
    Smart_Manager.prototype.getDataDefaultParams.apply(this, [params]);

    if ( typeof window.smart_manager.date_params.date_filter_params != 'undefined' ) {
        window.smart_manager.currentGetDataParams.data['date_filter_params'] = window.smart_manager.date_params.date_filter_params;
    }
    if ( typeof window.smart_manager.date_params.date_filter_query != 'undefined' ) {
        window.smart_manager.currentGetDataParams.data['date_filter_query'] = window.smart_manager.date_params.date_filter_query;
    }
}

if(typeof window.smart_manager_pro === 'undefined'){
    window.smart_manager = new Smart_Manager_Pro();
}
jQuery(document).on('smart_manager_init','#sm_editor_grid', function() {
    window.smart_manager.batchUpdateSelectActionOption = '<option value="" disabled selected>'+_x('Select Action', 'bulk edit default action', 'smart-manager-for-wp-e-commerce')+'</option>';
    window.smart_manager.batchUpdateCopyFromOption = '<option value="copy_from">'+_x('copy from', 'bulk edit action', 'smart-manager-for-wp-e-commerce')+'</option>';
    window.smart_manager.date_params = {}; //params for date filter

    let additionalDateOperators = {increase_date_by:_x('increase by', "bulk edit action - 'date' fields", 'smart-manager-for-wp-e-commerce'), decrease_date_by:_x('decrease by', "bulk edit action - 'date' fields", 'smart-manager-for-wp-e-commerce')};
   
    window.smart_manager.batch_update_actions = {
		'numeric': {increase_by_per:_x('increase by %', "bulk edit action - 'number' fields", 'smart-manager-for-wp-e-commerce'), decrease_by_per:_x('decrease by %', "bulk edit action - 'number' fields", 'smart-manager-for-wp-e-commerce'), increase_by_num:_x('increase by number', "bulk edit action - 'number' fields", 'smart-manager-for-wp-e-commerce'), decrease_by_num:_x('decrease by number', "bulk edit action - 'number' fields", 'smart-manager-for-wp-e-commerce')},
		'image': {},
        	'multipleImage': {},
		'datetime': Object.assign({set_datetime_to:_x('set datetime to', "bulk edit action - 'datetime' fields", 'smart-manager-for-wp-e-commerce'), set_date_to:_x('set date to', "bulk edit action - 'datetime' fields", 'smart-manager-for-wp-e-commerce'), set_time_to:_x('set time to', "bulk edit action - 'datetime' fields", 'smart-manager-for-wp-e-commerce')}, additionalDateOperators),
        	'date': Object.assign({set_date_to:_x('set date to', "bulk edit action - 'date' fields", 'smart-manager-for-wp-e-commerce')},additionalDateOperators),
        	'time': Object.assign({set_time_to:_x('set time to', "bulk edit action - 'time' fields", 'smart-manager-for-wp-e-commerce')},additionalDateOperators),
		'dropdown': {},
		'multilist': {add_to:_x('add to', "bulk edit action - 'multiselect list' fields", 'smart-manager-for-wp-e-commerce'), remove_from:_x('remove from', "bulk edit action - 'multiselect list' fields", 'smart-manager-for-wp-e-commerce')},
        'serialized': {},
		'text': {prepend:_x('prepend', "bulk edit action - 'text' fields", 'smart-manager-for-wp-e-commerce'), append:_x('append', "bulk edit action - 'text' fields", 'smart-manager-for-wp-e-commerce'), search_and_replace:_x('search & replace', "bulk edit action - 'text' fields", 'smart-manager-for-wp-e-commerce')}
	}

    	let types_exclude_set_to = ['datetime', 'date', 'time']

	Object.keys(window.smart_manager.batch_update_actions).forEach(key => {
        let setToObj = (types_exclude_set_to.includes(key)) ? {} : {set_to: _x('set to', 'bulk edit action', 'smart-manager-for-wp-e-commerce')}
		window.smart_manager.batch_update_actions[key] = Object.assign(setToObj, window.smart_manager.batch_update_actions[key],{copy_from: _x('copy from', 'bulk edit action', 'smart-manager-for-wp-e-commerce')}, {copy_from_field: _x('copy from field', 'bulk edit action', 'smart-manager-for-wp-e-commerce')});
	});
})
.on('sm_top_bar_loaded', '#sm_top_bar', function() {

        jQuery(document).off('click', '.sm_date_range_container .smart-date-icon').on('click', '.sm_date_range_container .smart-date-icon', function() {

            if( jQuery('.sm_date_range_container .dropdown-menu').is(':visible') === false ){
                jQuery('.sm_date_range_container .dropdown-menu').show();
            } else {
                jQuery('.sm_date_range_container .dropdown-menu').hide();
            }

            // jQuery('.sm_date_range_container .dropdown-menu').toggle();
        });

        jQuery(document).off('click', ':not(.sm_date_range_container .dropdown-menu)').on('click', ':not(.sm_date_range_container .dropdown-menu)', function( e ){
            if ( jQuery(e.target).hasClass('smart-date-icon') === false && jQuery('.sm_date_range_container .dropdown-menu').is(':visible') === true ) {
                jQuery('.sm_date_range_container .dropdown-menu').hide();
            }
        });

        jQuery(document).off('click', '.sm_date_range_container .dropdown-menu li a').on('click', '.sm_date_range_container .dropdown-menu li a', function(e) {
            e.preventDefault();

            jQuery('.sm_date_range_container .dropdown-menu').hide();
            window.smart_manager.proSelectDate(jQuery(this).attr('data-key'));
        });

        //Code for initializing the date picker
        jQuery('.sm_date_range_container input.sm_date_selector').Zebra_DatePicker({
                                                                                                    format: 'd M Y H:i:s',
                                                                                                    // format: 'dd-mm-yy H:i:s',
                                                                                                    show_icon: false,
                                                                                                    show_select_today: false,
                                                                                                    readonly_element: false,
                                                                                                    default_position: 'below',
                                                                                                    lang_clear_date: 'Clear dates',
                                                                                                    onClear: window.smart_manager.clearDateFilter,
                                                                                                    start_date: new Date( new Date().setHours(0, 0, 0) ),
                                                                                                    onSelect: function(fdate, jsdate) {
                                                                                                        jQuery(this).change();
                                                                                                        let id = jQuery(this).attr('id'),
                                                                                                            selected_date_obj = new Date(fdate),
                                                                                                            params = {'start_date_formatted':'',
                                                                                                                        'start_date_default_format':'',
                                                                                                                        'end_date_formatted':'',
                                                                                                                        'end_date_default_format':''};

                                                                                                        if( id == 'sm_date_selector_start_date' ) { //if end_date is not set

                                                                                                            params.start_date_formatted = fdate;
                                                                                                            params.start_date_default_format = jsdate;

                                                                                                            var end_date = jQuery('#sm_date_selector_end_date').val(),
                                                                                                                end_time = '';

                                                                                                            if( end_date == '' ) {
                                                                                                                end_date_obj = new Date( selected_date_obj.getFullYear(), selected_date_obj.getMonth(), ( selected_date_obj.getDate() + 29 ) );
                                                                                                                end_time =  '23:59:59';
                                                                                                            } else {
                                                                                                                end_date_obj = new Date(end_date);
                                                                                                                end_time =  window.smart_manager.strPad(end_date_obj.getHours(), 2) + ':' + window.smart_manager.strPad(end_date_obj.getMinutes(), 2) + ':' + window.smart_manager.strPad(end_date_obj.getSeconds(), 2);
                                                                                                            }
                                                                                                            var y = end_date_obj.getFullYear() + '',
                                                                                                                m = end_date_obj.getMonth(),
                                                                                                                d = window.smart_manager.strPad(end_date_obj.getDate(), 2);
                                                                                                            
                                                                                                            params.end_date_formatted = d + ' ' + window.smart_manager.month_names_short[m] + ' ' + y + ' ' + end_time;
                                                                                                            params.end_date_default_format = y + '-' + window.smart_manager.strPad((m+1), 2) + '-' + d + ' ' + end_time;

                                                                                                            if( end_date == '' ) {
                                                                                                                end_date_datepicker = jQuery('.sm_date_range_container input.end-date').data('Zebra_DatePicker');
                                                                                                                end_date_datepicker.set_date(params.end_date_formatted);
                                                                                                                end_date_datepicker.update({'current_date': new Date(params.end_date_default_format)});
                                                                                                            }
                                                                                                            

                                                                                                        } else if( id == 'sm_date_selector_end_date' ) { //if start_date is not set

                                                                                                            params.end_date_formatted = fdate;
                                                                                                            params.end_date_default_format = jsdate;

                                                                                                            var start_date = jQuery('#sm_date_selector_start_date').val(),
                                                                                                                start_time = '';

                                                                                                            if( start_date == '' ) {
                                                                                                                start_date_obj = new Date( selected_date_obj.getFullYear(), selected_date_obj.getMonth(), ( selected_date_obj.getDate() - 29 ) );
                                                                                                                start_time = '23:59:59';
                                                                                                            } else {
                                                                                                                start_date_obj = new Date(start_date);
                                                                                                                start_time = window.smart_manager.strPad(start_date_obj.getHours(), 2) + ':' + window.smart_manager.strPad(start_date_obj.getMinutes(), 2) + ':' + window.smart_manager.strPad(start_date_obj.getSeconds(), 2);
                                                                                                            }
                                                                                                            var y = start_date_obj.getFullYear() + '',
                                                                                                                m = start_date_obj.getMonth(),
                                                                                                                d = window.smart_manager.strPad(start_date_obj.getDate(), 2);


                                                                                                            params.start_date_formatted = d + ' ' + window.smart_manager.month_names_short[m] + ' ' + y + ' ' + start_time;
                                                                                                            params.start_date_default_format = y + '-' + window.smart_manager.strPad((m+1), 2) + '-' + d + ' ' + start_time;

                                                                                                            if( start_date == '' ) {
                                                                                                                start_date_datepicker = jQuery('.sm_date_range_container input.start-date').data('Zebra_DatePicker');
                                                                                                                start_date_datepicker.set_date(params.start_date_formatted);
                                                                                                                start_date_datepicker.update({'current_date': new Date(params.start_date_default_format)});
                                                                                                            }
                                                                                                        }

                                                                                                        window.smart_manager.sm_handle_date_filter(params);
                                                                                                    }
                                                                                                });

        if( typeof( window.smart_manager.date_params.date_filter_params ) != 'undefined' && window.smart_manager.isJSON( window.smart_manager.date_params.date_filter_params ) ) {

            selected_dates = JSON.parse(window.smart_manager.date_params.date_filter_params);

            start_date_datepicker = jQuery('.sm_date_range_container input.start-date').data('Zebra_DatePicker');
            start_date_datepicker.set_date(selected_dates.start_date_formatted);
            start_date_datepicker.update({'current_date': new Date(selected_dates.start_date_default_format)});

            end_date_datepicker = jQuery('.sm_date_range_container input.end-date').data('Zebra_DatePicker');
            end_date_datepicker.set_date(selected_dates.end_date_formatted);
            end_date_datepicker.update({'current_date': new Date(selected_dates.end_date_default_format)});

        }

    })

.off('click','.sm_beta_batch_update_background_link').on('click','.sm_beta_batch_update_background_link',function() { //Code for enabline background updating
    window.location.reload();

    // window.smart_manager.hideNotification();
    // window.smart_manager.refresh();

    // if( jQuery('#sm_top_bar_action_btns_update #batch_update_sm_editor_grid, #sm_top_bar_action_btns_update .sm_beta_dropdown_content').hasClass('sm-ui-state-disabled') === false ) {
    //     jQuery('#sm_top_bar_action_btns_update #batch_update_sm_editor_grid, #sm_top_bar_action_btns_update .sm_beta_dropdown_content').addClass('sm-ui-state-disabled');
    // }

    // if( jQuery("#wpbody .sm_beta_pro_background_update_notice").length == 0 ) {
    //     jQuery('<div id="sm_beta_pro_background_update_notice" class="notice notice-info sm_beta_pro_background_update_notice"><p><strong>Success!</strong> '+ params.title +' initiated – Your records are being updated in the background. You will be notified on your email address <strong><code>'+window.smart_manager.sm_admin_email+'</code></strong> once the process is completed.</p></div>').insertBefore('#wpbody .wrap');
    //     // To go to start of the SM page so users can see above notice.
    //     window.scrollTo(0,0);
    // }
})
// Code for handling the undo & delete tasks functionality
.on('sm_show_tasks_change', '#sm_editor_grid', function(){
    if("undefined" !== typeof(window.smart_manager.showTasks) && "function" === typeof(window.smart_manager.showTasks)){
        window.smart_manager.showTasks();
    }
   jQuery(document).off( 'click', ".sm_top_bar_action_btns #sm_beta_undo_selected,.sm_top_bar_action_btns #sm_beta_undo_all_tasks,.sm_top_bar_action_btns #sm_beta_delete_selected_tasks, .sm_top_bar_action_btns #sm_beta_delete_all_tasks").on( 'click', ".sm_top_bar_action_btns #sm_beta_undo_selected,.sm_top_bar_action_btns #sm_beta_undo_all_tasks,.sm_top_bar_action_btns #sm_beta_delete_selected_tasks, .sm_top_bar_action_btns #sm_beta_delete_all_tasks", function(){
        if("undefined" !== typeof(window.smart_manager.taskActionsModal) && "function" === typeof(window.smart_manager.taskActionsModal)){
            window.smart_manager.taskActionsModal({id: jQuery(this).attr('id'),btnText: jQuery(this).text()});
        }
    })
})

// Code for handling renaming of column titles
.off('focusout','.sm-column-title-input').on('focusout','.sm-column-title-input', function(e){
    e.target.readOnly = true;
    e.target.classList.remove('sm-column-title-input-edit')
    let parent = e.target.closest('li');
    if(!parent) return;
    let keyInput = parent.querySelector(".js-column-key");
    if(!keyInput) return;
    
    if(!e.target.value){ //handling for empty values
        (window.smart_manager.editedColumnTitles.hasOwnProperty(keyInput.value)) ? delete window.smart_manager.editedColumnTitles[keyInput.value] : ''
        return;
    }

    let titleInput = parent.querySelector(".js-column-title");
    if(!titleInput) return;
    if(titleInput.value == e.target.value) return;
    window.smart_manager.editedColumnTitles[keyInput.value] = e.target.value;
});
//Function to determine if background process is running or not
Smart_Manager.prototype.isBackgroundProcessRunning = function() {

    if( jQuery('#sa_sm_background_process_progress').length > 0 && jQuery('#sa_sm_background_process_progress').is(":visible") ) {
        return true;
    }

    return false;
}

//function to clear the datepicker filter
Smart_Manager.prototype.clearDateFilter = function() {
    let startDate = jQuery('#sm_date_selector_start_date').val(),
        endDate = jQuery('#sm_date_selector_end_date').val(),
        refresh = 0;

    if( startDate != '' ) {
        let startDateDatepicker = jQuery('.sm_date_range_container input.start-date').data('Zebra_DatePicker');
        jQuery('#sm_date_selector_start_date').val('');
        refresh = 1;
    } 
    if( endDate != '' ) {
        let endDateDatepicker = jQuery('.sm_date_range_container input.end-date').data('Zebra_DatePicker');
        jQuery('#sm_date_selector_end_date').val('');
        refresh = 1;
    }

    if( typeof(window.smart_manager.currentGetDataParams.date_filter_params) != 'undefined' && typeof(window.smart_manager.currentGetDataParams.date_filter_query) != 'undefined'  ) {
        delete window.smart_manager.currentGetDataParams.date_filter_params;
        delete window.smart_manager.currentGetDataParams.date_filter_query;
    }

    if( window.smart_manager.date_params.hasOwnProperty('date_filter_params') ) {
        delete window.smart_manager.date_params['date_filter_params'];
    }

    if( window.smart_manager.date_params.hasOwnProperty('date_filter_query') ) {
        delete window.smart_manager.date_params['date_filter_query'];
    }

    if( refresh == 1 ) {
        window.smart_manager.refresh();
    }
}

//function to process the datepicker filter
Smart_Manager.prototype.sm_handle_date_filter = function(params) {

    let date_search_array = new Array(),
        dataParams = {};

    if( window.smart_manager.dashboard_key == 'user' ) {
        date_search_array = new Array({"key":"User Registered","value":params.start_date_default_format,"type":"date","operator":">=","table_name":window.smart_manager.wpDbPrefix+"users","col_name":"user_registered","date_filter":1},
                                    {"key":"User Registered","value":params.end_date_default_format,"type":"date","operator":"<=","table_name":window.smart_manager.wpDbPrefix+"users","col_name":"user_registered","date_filter":1});
    } else {
        date_search_array = new Array({"key":"Post Date","value":params.start_date_default_format,"type":"date","operator":">=","table_name":window.smart_manager.wpDbPrefix+"posts","col_name":"post_date","date_filter":1},
                                    {"key":"Post Date","value":params.end_date_default_format,"type":"date","operator":"<=","table_name":window.smart_manager.wpDbPrefix+"posts","col_name":"post_date","date_filter":1});
    }

    window.smart_manager.date_params['date_filter_params'] = JSON.stringify(params);
    window.smart_manager.date_params['date_filter_query'] = JSON.stringify(date_search_array);


    if( Object.getOwnPropertyNames(window.smart_manager.date_params).length > 0 ) {
        dataParams.data = window.smart_manager.date_params;
    }
    
    window.smart_manager.refresh(dataParams);
}

//function to append 0's to str
Smart_Manager.prototype.strPad = function(str, len) {

    str += '';
    while (str.length < len) str = '0' + str;
    return str;

},

Smart_Manager.prototype.proSelectDate = function (dateValue){
        
    if( dateValue == 'all' ) {
        if ( typeof (window.smart_manager.clearDateFilter) !== "undefined" && typeof (window.smart_manager.clearDateFilter) === "function" ) {
            window.smart_manager.clearDateFilter();
        }
        return;
    }

    let fromDate,
        toDate,
        from_time,
        to_time,
        from_date_formatted,
        from_date_default_format,
        to_date_formatted,
        to_date_default_format,
        now = new Date(),
        params = {'start_date_formatted':'',
                'start_date_default_format':'',
                'end_date_formatted':'',
                'end_date_default_format':''};

    switch (dateValue){

        case 'today':
        fromDate = now;
        toDate   = now;
        break;

        case 'yesterday':
        fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        toDate   = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        break;

        case 'this_week':
        fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (now.getDay() - 1));
        toDate   = now;
        break;

        case 'last_week':
        fromDate = new Date(now.getFullYear(), now.getMonth(), (now.getDate() - (now.getDay() - 1) - 7));
        toDate   = new Date(now.getFullYear(), now.getMonth(), (now.getDate() - (now.getDay() - 1) - 1));
        break;

        case 'last_4_week':
        fromDate = new Date( now.getFullYear(), now.getMonth(), ( now.getDate() - 29 ) ); //for exactly 30 days limit
        toDate   = now;
        break;

        case 'this_month':
        fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
        toDate   = now;
        break;

        case 'last_month':
        fromDate = new Date(now.getFullYear(), now.getMonth()-1, 1);
        toDate   = new Date(now.getFullYear(), now.getMonth(), 0);
        break;

        case '3_months':
        fromDate = new Date(now.getFullYear(), now.getMonth()-2, 1);
        toDate   = now;
        break;

        case '6_months':
        fromDate = new Date(now.getFullYear(), now.getMonth()-5, 1);
        toDate   = now;
        break;

        case 'this_year':
        fromDate = new Date(now.getFullYear(), 0, 1);
        toDate   = now;
        break;

        case 'last_year':
        fromDate = new Date(now.getFullYear() - 1, 0, 1);
        toDate   = new Date(now.getFullYear(), 0, 0);
        break;

        default:
        fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
        toDate   = now;
        break;
    }

    //Code for format
    if( typeof fromDate === 'object' && fromDate instanceof Date ) {
        var y = fromDate.getFullYear() + '',
            m = fromDate.getMonth(),
            d = window.smart_manager.strPad(fromDate.getDate(), 2);

        from_time =  '00:00:00';
        params.start_date_formatted = d + ' ' + window.smart_manager.month_names_short[m] + ' ' + y + ' ' + from_time;
        params.start_date_default_format = y + '-' + window.smart_manager.strPad((m+1), 2) + '-' + d + ' ' + from_time;
    }

    if( typeof toDate === 'object' && toDate instanceof Date ) {
        var y = toDate.getFullYear() + '',
            m = toDate.getMonth(),
            d = window.smart_manager.strPad(toDate.getDate(), 2);

        to_time =  '23:59:59';
        params.end_date_formatted = d + ' ' + window.smart_manager.month_names_short[m] + ' ' + y + ' ' + to_time;
        params.end_date_default_format = y + '-' + window.smart_manager.strPad((m+1), 2) + '-' + d + ' ' + to_time;
    }

    var start_date = jQuery('.sm_date_range_container input.start-date').data('Zebra_DatePicker'),
        end_date = jQuery('.sm_date_range_container input.end-date').data('Zebra_DatePicker');

    if( typeof(start_date) != 'undefined') {
        start_date.set_date(params.start_date_formatted);
        start_date.update({'current_date': new Date(params.start_date_default_format), 'start_date': new Date(params.start_date_formatted)});    
    }

    if( typeof(end_date) != 'undefined') {
        end_date.set_date(params.end_date_formatted);
        end_date.update({'current_date': new Date(params.end_date_default_format), 'start_date': new Date(params.end_date_formatted)});
    }

    window.smart_manager.sm_handle_date_filter( params );

};

var sm_beta_hide_dialog = function(IDs, gID) {
    jQuery.jgrid.hideModal("#"+IDs.themodal,{gb:"#gbox_"+gID,jqm:true, onClose: null});
    index = 0;
}

// ========================================================================
// EXPORT CSV
// ========================================================================

Smart_Manager.prototype.generateCsvExport = function() {

    let params = {
                            cmd: 'get_export_csv',
                            active_module: window.smart_manager.dashboard_key,
                            security: window.smart_manager.sm_nonce,
                            pro: true,
                            SM_IS_WOO30: window.smart_manager.sm_is_woo30,
                            sort_params: (window.smart_manager.currentDashboardModel.hasOwnProperty('sort_params') ) ? window.smart_manager.currentDashboardModel.sort_params : '',
                            table_model: (window.smart_manager.currentDashboardModel.hasOwnProperty('tables') ) ? window.smart_manager.currentDashboardModel.tables : '',
                            search_text: (window.smart_manager.searchType == 'simple') ? window.smart_manager.simpleSearchText : '',
						    advanced_search_query: JSON.stringify((window.smart_manager.searchType != 'simple') ? window.smart_manager.advancedSearchQuery : []),
                            is_taxonomy: window.smart_manager.isTaxonomyDashboard() || 0,
                            storewide_option: (true === window.smart_manager.exportStore) ? 'entire_store' : '',
                            selected_ids: (window.smart_manager.getSelectedKeyIds()) ? JSON.stringify(window.smart_manager.getSelectedKeyIds()) : '',
                          };
    //Code for handling views
    let viewSlug = window.smart_manager.getViewSlug(window.smart_manager.dashboardName);
    
    if(viewSlug){
        params['is_view'] = 1;
        params['active_view'] = viewSlug;
        params['active_module'] = (window.smart_manager.viewPostTypes.hasOwnProperty(viewSlug)) ? window.smart_manager.viewPostTypes[viewSlug] : window.smart_manager.dashboard_key;
    }

    let export_url = window.smart_manager.sm_ajax_url + '&cmd='+ params['cmd'] +'&active_module='+ params['active_module'] +'&security='+ params['security'] +'&pro='+ params['pro'] +'&SM_IS_WOO30='+ params['SM_IS_WOO30'] +'&is_taxonomy='+ params['is_taxonomy'] +'&sort_params='+ encodeURIComponent(JSON.stringify(params['sort_params'])) +'&table_model='+ encodeURIComponent(JSON.stringify(params['table_model'])) +'&advanced_search_query='+params['advanced_search_query']+'&search_text='+ params['search_text'] + '&storewide_option=' + params['storewide_option'] + '&selected_ids=' + params['selected_ids'];
    export_url += ( window.smart_manager.date_params.hasOwnProperty('date_filter_params') ) ? '&date_filter_params='+ window.smart_manager.date_params['date_filter_params'] : '';
    export_url += ( window.smart_manager.date_params.hasOwnProperty('date_filter_query') ) ? '&date_filter_query='+ window.smart_manager.date_params['date_filter_query'] : '';
    
    if(viewSlug){
        export_url += '&is_view='+params['is_view']+'&active_view='+params['active_view'];
    }

    setTimeout(()=>{window.location = export_url},500);
}

// ========================================================================
// PRINT INVOICE
// ========================================================================

Smart_Manager.prototype.printInvoice = function() {

    if( window.smart_manager.duplicateStore === false && window.smart_manager.selectedRows.length == 0 && !window.smart_manager.selectAll ) {
        return;
    }

    let params = {};
        params.data = {
                        cmd: 'get_print_invoice',
                        active_module: window.smart_manager.dashboard_key,
                        security: window.smart_manager.sm_nonce,
                        pro: true,
                        sort_params: (window.smart_manager.currentDashboardModel.hasOwnProperty('sort_params') ) ? window.smart_manager.currentDashboardModel.sort_params : '',
                        table_model: (window.smart_manager.currentDashboardModel.hasOwnProperty('tables') ) ? window.smart_manager.currentDashboardModel.tables : '',
                        SM_IS_WOO30: window.smart_manager.sm_is_woo30,
                        SM_IS_WOO22: window.smart_manager.sm_id_woo22,
                        SM_IS_WOO21: window.smart_manager.sm_is_woo21,
                        search_text: (window.smart_manager.searchType == 'simple') ? window.smart_manager.simpleSearchText : '',
						advanced_search_query: JSON.stringify((window.smart_manager.searchType != 'simple') ? window.smart_manager.advancedSearchQuery : []),
                        storewide_option: (true === window.smart_manager.selectAll) ? 'entire_store' : '',
                        selected_ids: (window.smart_manager.getSelectedKeyIds()) ? JSON.stringify(window.smart_manager.getSelectedKeyIds()) : ''
                    };

    let url = window.smart_manager.sm_ajax_url + '&cmd='+ params.data['cmd'] +'&active_module='+ params.data['active_module'] +'&security='+ params.data['security'] +'&pro='+ params.data['pro'] +'&SM_IS_WOO30='+ params.data['SM_IS_WOO30'] +'&SM_IS_WOO30='+ params.data['SM_IS_WOO30'] +'&sort_params='+ encodeURIComponent(JSON.stringify(params.data['sort_params'])) +'&table_model='+ encodeURIComponent(JSON.stringify(params.data['table_model'])) +'&advanced_search_query='+ params.data['advanced_search_query'] +'&search_text='+ params.data['search_text'] + '&storewide_option=' + params.data['storewide_option'] + '&selected_ids=' + params.data['selected_ids'];

    url += (window.smart_manager.isFilteredData()) ? '&filteredResults=1' : '';
    params.call_url = url;
    params.data_type = 'html';

    url += ( window.smart_manager.date_params.hasOwnProperty('date_filter_params') ) ? '&date_filter_params='+ window.smart_manager.date_params['date_filter_params'] : '';
    url += ( window.smart_manager.date_params.hasOwnProperty('date_filter_query') ) ? '&date_filter_query='+ window.smart_manager.date_params['date_filter_query'] : '';

    window.smart_manager.send_request(params, function(response) {
        let win = window.open('', 'Invoice');
        win.document.write(response);
        win.document.close();
        win.print();
    });
}

// ========================================================================
// DUPLICATE RECORDS
// ========================================================================

Smart_Manager.prototype.duplicateRecords = function() {

    if( window.smart_manager.duplicateStore === false && window.smart_manager.selectedRows.length == 0 && !window.smart_manager.selectAll ) {
        return;
    }

    setTimeout( function() { 

        window.smart_manager.showProgressDialog(_x('Duplicate Records', 'progressbar modal title', 'smart-manager-for-wp-e-commerce')); 

        if( typeof (sa_sm_background_process_heartbeat) !== "undefined" && typeof (sa_sm_background_process_heartbeat) === "function" ) {
            sa_sm_background_process_heartbeat(1000, 'duplicate');
        }

    } ,1);
    
    let params = {};
        params.data = {
                        cmd: 'duplicate_records',
                        active_module: window.smart_manager.dashboard_key,
                        security: window.smart_manager.sm_nonce,
                        pro: true,
                        storewide_option: ( window.smart_manager.duplicateStore === true ) ? 'entire_store' : '',
                        selected_ids: JSON.stringify(window.smart_manager.getSelectedKeyIds()),
                        table_model: (window.smart_manager.currentDashboardModel.hasOwnProperty('tables') ) ? window.smart_manager.currentDashboardModel.tables : '',
                        active_module_title: window.smart_manager.dashboardName,
                        backgroundProcessRunningMessage: window.smart_manager.backgroundProcessRunningMessage,
                        SM_IS_WOO30: window.smart_manager.sm_is_woo30,
                        SM_IS_WOO22: window.smart_manager.sm_id_woo22,
                        SM_IS_WOO21: window.smart_manager.sm_is_woo21
                    };

        params.showLoader = false;

        if(window.smart_manager.isFilteredData()) {
            params.data.filteredResults = 1;
        }

    window.smart_manager.send_request(params, function(response) {

    });

    // setTimeout(function() {
    //     params = { 'func_nm' : 'duplicate_records', 'title' : 'Duplicate Records' }
    //     window.smart_manager.background_process_hearbeat( params );
    // }, 1000);
    
};

// ========================================================================
// Function to handle request for both creating & updating view
// ========================================================================
Smart_Manager.prototype.saveView = function(action = 'create', name = '') {
    let viewSlug = window.smart_manager.getViewSlug(window.smart_manager.dashboardName);
    let activeDashboard =  (viewSlug) ? viewSlug : window.smart_manager.dashboard_key;
    // let name = jQuery('#sm_view_name').val();
    let currentDashboardState = '';

    if ( typeof (window.smart_manager.getCurrentDashboardState) !== "undefined" && typeof (window.smart_manager.getCurrentDashboardState) === "function" ) {
        currentDashboardState = window.smart_manager.getCurrentDashboardState();
    }
    if(currentDashboardState){
        currentDashboardState = JSON.parse(currentDashboardState);
        currentDashboardState['search_params'] = {
                                            'isAdvanceSearch': ((window.smart_manager.advancedSearchQuery.length > 0) ? 'true' : 'false'),
                                            'params': ((window.smart_manager.advancedSearchQuery.length > 0) ? window.smart_manager.advancedSearchQuery : window.smart_manager.simpleSearchText),
        }

        //AJAX to create & save view
        let params = {};
            params.data_type = 'json';
            params.data = {
                            module: 'custom_views',
                            cmd: action,
                            active_module: activeDashboard,
                            security: window.smart_manager.sm_nonce,
                            name: name,
                            isPublic: (jQuery('#sm_view_access_public').is(":checked")) ? true : false,
                            is_view: (viewSlug) ? 1 : 0,
                            currentView: JSON.stringify(currentDashboardState)
                        };
        window.smart_manager.send_request(params, function(response){
            let ack = (response.hasOwnProperty('ACK')) ? response.ACK : ''
            let viewSlug = (response.hasOwnProperty('slug')) ? response.slug : ''

            if(ack == 'Success'){
                window.smart_manager.notification = {status:'success', message: sprintf(_x('View %sd successfully!', 'notification', 'smart-manager-for-wp-e-commerce'), String(action).capitalize())}
		        if(viewSlug != ''){
                    setTimeout(function () {
                        window.location.href = (window.smart_manager.smAppAdminURL || window.location.href) + ((window.location.href.indexOf("?")===-1)?"?":"&") + "dashboard="+viewSlug+"&is_view=1";
                    }, 500);    
                }
                window.smart_manager.showNotification()
            } else {
                location.reload();
            }
        });
    }
}

// ========================================================================
// function to display confirmdialog for create & update view
// ========================================================================

Smart_Manager.prototype.createUpdateViewDialog = function(action = 'create') {
    let params = {},
        viewSlug = window.smart_manager.getViewSlug(window.smart_manager.dashboardName);

    let isView = (viewSlug) ? 1 : 0,
        isPublicView = (window.smart_manager.publicViews.includes(viewSlug)) ? 1 : 0;


    params.btnParams = {}
    params.title = _x('Custom Views', 'modal title', 'smart-manager-for-wp-e-commerce');
    params.width = 500;
    params.height = 350;
    params.content = '<p id="sm_view_descrip">'+_x('Create a custom view to save selected columns from a dashboard. Use it for saved searches, giving specific columns access to other users, etc.', 'modal content', 'smart-manager-for-wp-e-commerce')+'</p>'+ 
                    '<input id="sm_view_name" type="text" placeholder="'+_x("Give a name to this view", "placeholder", "smart-manager-for-wp-e-commerce")+'" value="'+((isView == 1 && action != 'create') ? window.smart_manager.dashboardName : '' )+'" />'+
                    '<div id="sm_view_error_msg" style="display:none;"></div>'+
                    '<div id="sm_view_access">'+
                        '<label id="sm_view_access_public_lbl">'+
                            '<input type="checkbox" id="sm_view_access_public" style="height: 1.5em;width: 1.5em;" '+((isPublicView == 1) ? 'checked' : '')+' >'+
                                _x('Public', 'checkbox for custom view access', 'smart-manager-for-wp-e-commerce')+
                        '</label>'+
                        '<p class="description">'+_x('Marking this view public will make it available to all users having access to the Smart Manager.', 'description', 'smart-manager-for-wp-e-commerce')+'</p>'+
                    '</div>';

    if ( typeof (window.smart_manager.createUpdateView) !== "undefined" && typeof (window.smart_manager.createUpdateView) === "function" ) {
        params.btnParams.yesText = String(action).capitalize();
        params.btnParams.yesCallback = window.smart_manager.createUpdateView;
        params.btnParams.yesCallbackParams = action;
        params.btnParams.hideOnYes = false
    }
    
    window.smart_manager.showConfirmDialog(params);
}



// ========================================================================
// function to handle functionality for checking iof view exists & if not then creating or updating the same
// ========================================================================

Smart_Manager.prototype.createUpdateView = function(action = 'create') {
    let name = jQuery('#sm_view_name').val()
    // Code to validate name field
    if(!name){
        jQuery('#sm_view_error_msg').html('Please add view name').show();
        jQuery('#sm_view_name').addClass('sm_border_red')
    } else {
        jQuery('#sm_view_name').removeClass('sm_border_red');
        jQuery('#sm_view_error_msg').html('').hide();
        
        let viewSlug = window.smart_manager.getViewSlug(window.smart_manager.dashboardName);
        let activeDashboard = (viewSlug) ? viewSlug : window.smart_manager.dashboard_key;

        if(action != 'create' && name == window.smart_manager.dashboardName){
            if ( typeof (window.smart_manager.saveView) !== "undefined" && typeof (window.smart_manager.saveView) === "function" ) {
                window.smart_manager.saveView(action, name);
            }
        } else {
            //Code to check if the view with same name exists
            let params = {};
            params.data_type = 'json';
            params.data = {
                            module: 'custom_views',
                            cmd: 'is_view_available',
                            active_module: activeDashboard,
                            security: window.smart_manager.sm_nonce,
                            name: name
                        };
            window.smart_manager.send_request(params, function(response){
                if(response.hasOwnProperty('is_available')){
                    let isAvailable = response.is_available;
                    if(isAvailable){
                        if ( typeof (window.smart_manager.saveView) !== "undefined" && typeof (window.smart_manager.saveView) === "function" ) {
                            window.smart_manager.saveView(action, name);
                            window.smart_manager.modal = {}
							if(typeof (window.smart_manager.showPannelDialog) !== "undefined" && typeof (window.smart_manager.showPannelDialog) === "function" && typeof (window.smart_manager.getDefaultRoute) !== "undefined" && typeof (window.smart_manager.getDefaultRoute) === "function"){
                                window.smart_manager.showPannelDialog('',window.smart_manager.getDefaultRoute(true))
                            }
                        }
                    } else {
                        jQuery('#sm_view_error_msg').html(_x('View already exists. Please try another name', 'notification', 'smart-manager-for-wp-e-commerce')).show();
                        jQuery('#sm_view_name').addClass('sm_border_red')
                    }
                }
            });
        }
    }
    
    //If eists show error
    // If not exists send ajax call for saving the view
};

// ========================================================================
// DELETE VIEW
// ========================================================================

Smart_Manager.prototype.deleteView = function() {

    let viewSlug = window.smart_manager.getViewSlug(window.smart_manager.dashboardName);

    //AJAX to create & save view
    let params = {};
        params.data_type = 'json';
        params.data = {
                        module: 'custom_views',
                        cmd: 'delete',
                        security: window.smart_manager.sm_nonce,
                        active_module: viewSlug
                    };
    window.smart_manager.send_request(params, function(response){
        let ack = (response.hasOwnProperty('ACK')) ? response.ACK : ''
        if(ack == 'Success'){
            window.smart_manager.notification = {status:'success', message: _x('View deleted successfully!', 'notification', 'smart-manager-for-wp-e-commerce')}
		    window.smart_manager.showNotification()
        }
        location.reload();
    });
}

// ========================================================================
// BATCH UPDATE
// ========================================================================


Smart_Manager.prototype.processBatchUpdate = function() {

    if(window.smart_manager.savedBulkEditConditions.length <= 0 || (window.smart_manager.selectedRows.length == 0 && !window.smart_manager.selectAll)){
        return;
    }

    let ruleGroups = (window.smart_manager.savedBulkEditConditions[0].hasOwnProperty('rules')) ? window.smart_manager.savedBulkEditConditions[0].rules : []
    let ruleMeta = (window.smart_manager.savedBulkEditConditions[0].hasOwnProperty('meta')) ? window.smart_manager.savedBulkEditConditions[0].meta : []

    if(ruleGroups.length <= 0){
        return;
    }

    let actions = (ruleGroups[0].hasOwnProperty('rules')) ? ruleGroups[0].rules : [];
    let updateAll = (ruleMeta.hasOwnProperty('updateAll')) ? ruleMeta.updateAll : false;

    setTimeout( function() { 
            window.smart_manager.showProgressDialog(_x('Bulk Edit', 'progressbar modal title', 'smart-manager-for-wp-e-commerce')); 

            if( typeof (sa_sm_background_process_heartbeat) !== "undefined" && typeof (sa_sm_background_process_heartbeat) === "function" ) {
                sa_sm_background_process_heartbeat(1000, 'bulk_edit');
            }
        }
    ,1);

    jQuery(document).trigger("sm_batch_update_on_submit"); //trigger to make changes in batch_update_actions

    //Ajax request to batch update the selected records
    let params = {};
    params.data = {
        cmd: 'batch_update',
        active_module: window.smart_manager.dashboard_key,
        security: window.smart_manager.sm_nonce,
        pro: true,
        storewide_option: ( updateAll == true ) ? 'entire_store' : '',
        selected_ids: JSON.stringify(window.smart_manager.getSelectedKeyIds()),
        batch_update_actions: JSON.stringify(actions),
        active_module_title: window.smart_manager.dashboardName,
        backgroundProcessRunningMessage: window.smart_manager.backgroundProcessRunningMessage,
        table_model: (window.smart_manager.currentDashboardModel.hasOwnProperty('tables') ) ? window.smart_manager.currentDashboardModel.tables : '',
        SM_IS_WOO30: window.smart_manager.sm_is_woo30,
        SM_IS_WOO22: window.smart_manager.sm_id_woo22,
        SM_IS_WOO21: window.smart_manager.sm_is_woo21
    };
    // Code for passing tasks params 
    params.data = ("undefined" !== typeof(window.smart_manager.addTasksParams) && "function" === typeof(window.smart_manager.addTasksParams) && 1 == window.smart_manager.sm_beta_pro) ? window.smart_manager.addTasksParams(params.data) : params.data;
    params.showLoader = false;
    if(window.smart_manager.isFilteredData()) {
        params.data.filteredResults = 1;
    }
    window.smart_manager.send_request(params, function(response) {});
}

Smart_Manager.prototype.resetBatchUpdate = function() {
    
}


Smart_Manager.prototype.displayDefaultBatchUpdateValueHandler = function( row_id ) {

    if( row_id == '' ) {
        return;
    }

    let selected_field = jQuery( "#"+row_id+" .batch_update_field option:selected" ).val(),
        type = window.smart_manager.column_names_batch_update[selected_field].type,
        editor = window.smart_manager.column_names_batch_update[selected_field].editor,
        multiSelectSeparator = window.smart_manager.column_names_batch_update[selected_field].multiSelectSeparator,
        col_val = window.smart_manager.column_names_batch_update[selected_field].values,
        allowMultiSelect = window.smart_manager.column_names_batch_update[selected_field].allowMultiSelect,
        skip_default_action = false;

    if( type == 'checkbox') {

        let checkedVal = '',
            uncheckedVal = '',
            checkedDisplayVal = '',
            uncheckedDisplayVal = '';

        if( type == 'checkbox' ) {
            checkedVal = window.smart_manager.column_names_batch_update[selected_field].checkedTemplate;
            uncheckedVal = window.smart_manager.column_names_batch_update[selected_field].uncheckedTemplate;
            
            checkedDisplayVal = checkedVal.substr(0,1).toUpperCase() + checkedVal.substr(1,checkedVal.length);
            uncheckedDisplayVal = uncheckedVal.substr(0,1).toUpperCase() + uncheckedVal.substr(1,uncheckedVal.length);
        }

        jQuery("#"+row_id+" #batch_update_value_td").empty().append('<select class="batch_update_value" style="min-width:130px !important;">'+
                                                    '<option value="'+checkedVal+'"> '+ checkedDisplayVal +' </option>'+
                                                    '<option value="'+uncheckedVal+'"> '+ uncheckedDisplayVal +' </option>'+
                                                '</select>')
        jQuery("#"+row_id+" #batch_update_value_td").find(".batch_update_value").select2({ width: '15em', dropdownCssClass: 'sm_beta_batch_update_field', dropdownParent: jQuery('[aria-describedby="sm_inline_dialog"]') });
        
    } else if (col_val != '' && type == 'dropdown') {
        
        var batch_update_value_options = '<select class="batch_update_value" style="min-width:130px !important;">',
            value_options_empty = true;

        for (var key in col_val) {
            if( typeof (col_val[key]) != 'object' && typeof (col_val[key]) != 'Array' ) {
                value_options_empty = false;
                batch_update_value_options += '<option value="'+key+'">'+ col_val[key] + '</option>';
            }
        }

        batch_update_value_options += '</select>';

        if( value_options_empty === false ) {
            jQuery("#"+row_id+" #batch_update_value_td").empty().append(batch_update_value_options);

            let args = { width: '15em', dropdownCssClass: 'sm_beta_batch_update_field', dropdownParent: jQuery('[aria-describedby="sm_inline_dialog"]') };

            if( editor == 'select2' && allowMultiSelect ) {
                args['multiple'] = true;
            }

            jQuery("#"+row_id+" #batch_update_value_td").find('.batch_update_value').select2(args);
        }

    } else if (col_val != '' && type == 'sm.multilist') {

        let options = {},
            index = 0;

        Object.entries( col_val ).forEach(([key, value]) => {
            index = key;

            if( value.hasOwnProperty('parent') ) {
                if( value.parent > 0 ) {
                    index = value.parent + '_childs';
                    value.term = ' – '+value.term;
                } 
            }

            if( options.hasOwnProperty(index) ) {
                options[ index ] += '<option value="'+ key +'"> '+ value.term +' </option>';    
            } else {
                options[ index ] = '<option value="'+ key +'"> '+ value.term +' </option>';
            }

            
        });

        let batch_update_value_options = '<select class="batch_update_value" style="min-width:130px !important;">'+ Object.values(options).join() +'</select>';

        jQuery("#"+row_id+" #batch_update_value_td").empty().append(batch_update_value_options)
        jQuery("#"+row_id+" #batch_update_value_td").find('.batch_update_value').select2({ width: '15em', dropdownCssClass: 'sm_beta_batch_update_field', dropdownParent: jQuery('[aria-describedby="sm_inline_dialog"]') });
     
    } else if ( type == 'sm.longstring') {
        jQuery("#"+row_id+" #batch_update_value_td").empty().append('<textarea class="batch_update_value" placeholder="'+_x('Enter a value...', 'placeholder', 'smart-manager-for-wp-e-commerce')+'" class="FormElement ui-widget-content"></textarea>');
    } else if ( type == 'sm.image') {
        jQuery("#"+row_id+" #batch_update_value_td").empty().append('<div class="batch_update_image" style="width:15em;"><span style="color:#0073aa;cursor:pointer;font-size: 2.25em;line-height: 1;" class="dashicons dashicons-camera"></span></div>');
    } else if ( type == 'numeric') {
        jQuery("#"+row_id+" #batch_update_value_td").empty().append('<input type="number" class="batch_update_value" placeholder="'+_x('Enter a value...', 'placeholder', 'smart-manager-for-wp-e-commerce')+'" class="FormElement ui-widget-content" />');
    }
}


Smart_Manager.prototype.createBatchUpdateDialog = function() {

    if( window.smart_manager.selectedRows.length <= 0 && window.smart_manager.selectAll === false ) {
        return;
    }

    let allItemsOptionText = ( window.smart_manager.simpleSearchText != '' || window.smart_manager.advancedSearchQuery.length > 0 ) ? _x('All Items In Search Results', 'bulk edit option', 'smart-manager-for-wp-e-commerce') : _x('All Items In Store', 'bulk edit option', 'smart-manager-for-wp-e-commerce');

    let entire_store_batch_update_html = "<tr>"+
                                            ( ( window.smart_manager.selectAll === false ) ? "<td style='white-space: pre;'><input type='radio' name='batch_update_storewide' value='selected_ids' checked/>"+_x('Selected Items', 'bulk edit option', 'smart-manager-for-wp-e-commerce')+"</td>" : '' ) +
                                            "<td style='white-space: pre;'><input type='radio' name='batch_update_storewide' value='entire_store' "+ (( window.smart_manager.selectAll === true ) ? 'checked' : '') +" />"+ allItemsOptionText +"</td>"+
                                        "</tr>",
        batch_update_field_options = '<option value="" disabled selected>'+_x('Select Field', 'bulk edit field', 'smart-manager-for-wp-e-commerce')+'</option>',
        batch_update_action_options_string = '',
        batch_update_action_options_number = '',
        batch_update_action_options_datetime = '',
        batch_update_action_options_multilist = '',
        batch_update_actions_row = '',
        batch_update_dlg_content = '',
        dlgParams = {};

        if( Object.getOwnPropertyNames(window.smart_manager.column_names_batch_update).length > 0 ) {
            for (let key in window.smart_manager.column_names_batch_update) {
                batch_update_field_options += '<option value="'+key+'" data-type="'+window.smart_manager.column_names_batch_update[key].type+'" data-editor="'+window.smart_manager.column_names_batch_update[key].editor+'" data-multiSelectSeparator="'+window.smart_manager.column_names_batch_update[key].multiSelectSeparator+'">'+ window.smart_manager.column_names_batch_update[key].name +'</option>';
            };
        }
        
        //Formating options for default actions
        window.smart_manager.batch_update_action_options_default = '<option value="" disabled selected>'+_x('Select Action', 'bulk edit default action', 'smart-manager-for-wp-e-commerce')+'</option>';
        window.smart_manager.batch_update_action_options_default += '<option value="set_to">'+_x('set to', 'bulk edit action', 'smart-manager-for-wp-e-commerce')+'</option>';
        window.smart_manager.batch_update_action_options_default += window.smart_manager.batchUpdateCopyFromOption;

        //Formating options for number actions
        batch_update_action_options_string = window.smart_manager.batchUpdateSelectActionOption;
        let selected = '';
        for (let key in window.smart_manager.batch_update_action_string) {
            selected = '';
            if( key == 'set_to' ) {
                selected = 'selected';
            }

            batch_update_action_options_string += '<option value="'+key+'" '+ selected +'>'+ window.smart_manager.batch_update_action_string[key] +'</option>';
        }
        batch_update_action_options_string += window.smart_manager.batchUpdateCopyFromOption;

        //Formating options for datetime actions
        batch_update_action_options_datetime = window.smart_manager.batchUpdateSelectActionOption;
        for (let key in window.smart_manager.batch_update_action_datetime) {
            selected = '';
            if( key == 'set_datetime_to' ) {
                selected = 'selected';
            }
            batch_update_action_options_datetime += '<option value="'+key+'" '+selected+'>'+ window.smart_manager.batch_update_action_datetime[key] +'</option>';
        }
        batch_update_action_options_datetime += window.smart_manager.batchUpdateCopyFromOption;

        //Formating options for multilist actions
        batch_update_action_options_multilist = window.smart_manager.batchUpdateSelectActionOption;
        for (let key in window.smart_manager.batch_update_action_multilist) {
            selected = '';
            if( key == 'set_to' ) {
                selected = 'selected';
            }
            batch_update_action_options_multilist += '<option value="'+key+'" '+selected+'>'+ window.smart_manager.batch_update_action_multilist[key] +'</option>';
        }
        batch_update_action_options_multilist += window.smart_manager.batchUpdateCopyFromOption;

        //Formating options for string actions
        batch_update_action_options_number = window.smart_manager.batchUpdateSelectActionOption;
        for (let key in window.smart_manager.batch_update_action_number) {
            selected = '';
            if( key == 'set_to' ) {
                selected = 'selected';
            }
            batch_update_action_options_number += '<option value="'+key+'" '+selected+'>'+ window.smart_manager.batch_update_action_number[key] +'</option>';
        }
        batch_update_action_options_number += window.smart_manager.batchUpdateCopyFromOption;


        batch_update_actions_row = "<td style='white-space: pre;'><select required class='batch_update_field' style='min-width:130px;width:auto !important;'>"+batch_update_field_options+"</select></td>"+
                                        "<td style='white-space: pre;'><select required class='batch_update_action' style='min-width:130px !important;'>"+window.smart_manager.batch_update_action_options_default+"</select></td>"+
                                        "<td id='batch_update_value_td' style='white-space: pre;'><input type='text' class='batch_update_value' placeholder='"+_x('Enter a value...', 'placeholder', 'smart-manager-for-wp-e-commerce')+"' class='FormElement ui-widget-content'></td>"+
                                        "<td id='batch_update_add_delete_row' style='float:right;'><div class='dashicons dashicons-plus' style='color:#0073aa;cursor:pointer;line-height:1.7em;'></div><div class='dashicons dashicons-trash' style='color:#FF5B5E;cursor:pointer;line-height:1.5em;'></div></td>";



        batch_update_dlg_content = "<div id='batchUpdateform' class='formdata' style='width: 100%; overflow: auto; position: relative; height: auto;'>"+
                                        "<table class='batch_update_table' width='100%'>"+
                                            "<tbody>"+
                                                entire_store_batch_update_html +
                                                "<tr id='batch_update_action_row_0'>"+
                                                    batch_update_actions_row+
                                                "</tr>"+
                                                "<tr>"+
                                                    "<td>&#160;</td>"+
                                                "</tr>"+
                                            "</tbody>"+
                                        "</table>"+
                                    "</div>";

        dlgParams.btnParams = {};
        dlgParams.btnParams.yesText = _x('Update', 'button', 'smart-manager-for-wp-e-commerce');
        if ( typeof (window.smart_manager.processBatchUpdate) !== "undefined" && typeof (window.smart_manager.processBatchUpdate) === "function" ) {
            dlgParams.btnParams.yesCallback = window.smart_manager.processBatchUpdate;
        }

        dlgParams.btnParams.noText = _x('Reset', 'button', 'smart-manager-for-wp-e-commerce');
        if ( typeof (window.smart_manager.resetBatchUpdate) !== "undefined" && typeof (window.smart_manager.resetBatchUpdate) === "function" ) {
            dlgParams.btnParams.noCallback = window.smart_manager.resetBatchUpdate;
        }

        dlgParams.title = _x('Bulk Edit', 'modal title', 'smart-manager-for-wp-e-commerce');
        dlgParams.content = batch_update_dlg_content;
        dlgParams.height = 300;
        dlgParams.width = 850;

        window.smart_manager.showConfirmDialog(dlgParams);

        jQuery('.batch_update_field, .batch_update_action').each(function() {
            jQuery(this).select2({ width: '15em', dropdownCssClass: 'sm_beta_batch_update_field', dropdownParent: jQuery('[aria-describedby="sm_inline_dialog"]') });
        })

        jQuery(".batch_update_action_row_0").find('#batch_update_add_delete_row .dashicons-trash').hide(); //for hiding the delete icon for the first row

        //function for handling add row in batch update dialog
        jQuery(document).off('click','#batch_update_add_delete_row .dashicons-plus').on('click','#batch_update_add_delete_row .dashicons-plus', function() {
            let count = jQuery('tr[id^=batch_update_action_row_]').length,
                current_id = 'batch_update_action_row_'+count;
            jQuery('.batch_update_table tr:last').before("<tr id="+current_id+">"+ batch_update_actions_row +"</tr>");

            jQuery("#"+current_id).find('.batch_update_field, .batch_update_action').select2({ width: '15em', dropdownCssClass: 'sm_beta_batch_update_field', dropdownParent: jQuery('[aria-describedby="sm_inline_dialog"]') });

            jQuery(this).hide();

        });

        //function for handling delete row in batch update dialog
        jQuery(document).off('click','#batch_update_add_delete_row .dashicons-trash').on('click','#batch_update_add_delete_row .dashicons-trash', function() {

            let add_row_visible = jQuery(this).closest('td').find('.dashicons-plus').is(":visible");
            jQuery(this).closest('tr').remove();

            if( add_row_visible === true ) { //condition for removing plus icon only if visible
                jQuery('tr[id^=batch_update_action_row_]:last()').find('.dashicons-plus').show();
            }

        });

        // For the time now
        Date.prototype.timeNow = function () {
             return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
        }

        jQuery(document).on('change','.batch_update_field',function(){

            let row_id = jQuery(this).closest('tr').attr('id');

            let selected_field = jQuery( "#"+row_id+" .batch_update_field option:selected" ).val(),
                type = window.smart_manager.column_names_batch_update[selected_field].type,
                editor = window.smart_manager.column_names_batch_update[selected_field].editor,
                col_val = window.smart_manager.column_names_batch_update[selected_field].values,
                skip_default_action = false;

            // Formating options for default actions
            window.smart_manager.batch_update_action_options_default = window.smart_manager.batchUpdateSelectActionOption +
                                                                        '<option value="set_to">'+_x('set to', 'bulk edit action', 'smart-manager-for-wp-e-commerce')+'</option>'+
                                                                        window.smart_manager.batchUpdateCopyFromOption;

            jQuery(document).trigger("sm_batch_update_field_on_change",[row_id, selected_field, type, col_val]);

            if( type == 'numeric' ) {
                jQuery("#"+row_id+" .batch_update_action").empty().append(batch_update_action_options_number);
            } else if (type == 'text' || type == 'sm.longstring') {
                jQuery("#"+row_id+" .batch_update_action").empty().append(batch_update_action_options_string);
            } else if ( type == 'sm.datetime' ) {
                jQuery("#"+row_id+" .batch_update_action").empty().append(batch_update_action_options_datetime);
            } else if ( type == 'sm.multilist' || ( type == 'dropdown' && editor == 'select2' ) ) {
                jQuery("#"+row_id+" .batch_update_action").empty().append(batch_update_action_options_multilist);
            } else {
                jQuery("#"+row_id+" .batch_update_action").empty().append(window.smart_manager.batch_update_action_options_default);
                jQuery("#"+row_id+" .batch_update_action").find('[value="set_to"]').attr('selected','selected');
            }

            let actionOptions = { 'batch_update_action_options_number': batch_update_action_options_number,
                                'batch_update_action_options_string': batch_update_action_options_string,
                                'batch_update_action_options_datetime': batch_update_action_options_datetime,
                                'batch_update_action_options_multilist': batch_update_action_options_multilist};

            jQuery(document).trigger("sm_batch_update_field_post_on_change",[row_id, selected_field, type, col_val, actionOptions]);

            jQuery("#"+row_id+" .batch_update_value").val('');

            jQuery("#"+row_id+" #batch_update_value_td").empty().append('<input type="text" class="batch_update_value" placeholder="'+_x("Enter a value...", "placeholder", "smart-manager-for-wp-e-commerce")+'" class="FormElement ui-widget-content" >');

            if( skip_default_action === true ) {
                return;
            }

            if (type == 'sm.date' || type == 'sm.time' || type == 'sm.datetime' ) {
                let placeholder = 'YYYY-MM-DD' + ((type == 'sm.datetime') ? ' HH:MM:SS' : '');
                placeholder = ( type == 'sm.time' ) ? 'H:i' : placeholder;

                jQuery("#"+row_id+" .batch_update_value").attr('placeholder',placeholder);

                let format = 'Y-m-d'+ ((type == 'sm.datetime') ? ' H:i:s' : '');
                format = ( type == 'sm.time' ) ? 'H:i' : format;

                jQuery("#"+row_id+" .batch_update_value").Zebra_DatePicker({ format: format,
                                                                            show_icon: false,
                                                                            show_select_today: false,
                                                                            default_position: 'below',
                                                                        });
            } else {
                 jQuery("#"+row_id+" .batch_update_value").attr('placeholder',_x('Enter a value...', 'placeholder', 'smart-manager-for-wp-e-commerce'));
                let datepicker = jQuery("#"+row_id+" .batch_update_value").data('Zebra_DatePicker');
            }

            if ( typeof (window.smart_manager.displayDefaultBatchUpdateValueHandler) !== "undefined" && typeof (window.smart_manager.displayDefaultBatchUpdateValueHandler) === "function" ) {
                dlgParams.btnParams.noCallback = window.smart_manager.displayDefaultBatchUpdateValueHandler( row_id );
            }
        });

        //Handling action change event only for 'datetime' type fields
        jQuery(document).on('change','.batch_update_action',function(){

            let row_id = jQuery(this).closest('tr').attr('id');

            let selected_field = jQuery( "#"+row_id+" .batch_update_field option:selected" ).val(),
                selected_action = jQuery( "#"+row_id+" .batch_update_action option:selected" ).val(),
                type = window.smart_manager.column_names_batch_update[selected_field].type;

            if( jQuery("#"+row_id+" #batch_update_value_td").find(".sm_batch_update_copy_from_ids").length > 0 || jQuery("#"+row_id+" #batch_update_value_td").find(".sm_batch_update_search_value").length > 0 ) {
                jQuery("#"+row_id+" #batch_update_value_td").empty().append('<input type="text" class="batch_update_value" placeholder="'+_x('Enter a value...', 'placeholder', 'smart-manager-for-wp-e-commerce')+'" class="FormElement ui-widget-content" >');
            }

            if( type == 'sm.datetime' ) {
                let placeholder = ( selected_action == 'set_datetime_to' ) ? 'YYYY-MM-DD HH:MM:SS' : ( ( selected_action == 'set_date_to' ) ? 'YYYY-MM-DD' : 'HH:MM:SS' );

                jQuery("#"+row_id+" .batch_update_value").attr('placeholder',placeholder);

                let format = ( selected_action == 'set_datetime_to' ) ? 'Y-m-d H:i:s' : ( ( selected_action == 'set_date_to' ) ? 'Y-m-d' : 'H:i:s' );
                jQuery("#"+row_id+" .batch_update_value").Zebra_DatePicker({ format: format,
                                                                                show_icon: false,
                                                                                show_select_today: false,
                                                                                default_position: 'below',
                                                                            });
            }

            //Code for handling 'copy from' functionality
            if( selected_action == 'copy_from' ) {

                let select_str = '<select class="batch_update_value sm_batch_update_copy_from_ids" style="min-width:130px !important;">'+
                                    '<option></option></select>';

                let select2Params = {
                    width: '15em',
                    dropdownCssClass: 'sm_beta_batch_update_field',
                    placeholder: sprintf(_x('Select %s', 'placeholder', 'smart-manager-for-wp-e-commerce'), window.smart_manager.dashboardDisplayName),
                    dropdownParent: jQuery('[aria-describedby="sm_inline_dialog"]'),
                    ajax: {
                        url:         window.smart_manager.sm_ajax_url,
                        dataType:    'json',
                        delay:       250,
                        data:        function( params ) {
                            return {
                                search_term     : params.term,
                                cmd             :'get_batch_update_copy_from_record_ids',
                                active_module   : window.smart_manager.dashboard_key,
                                security        : window.smart_manager.sm_nonce,
                                is_taxonomy     : window.smart_manager.isTaxonomyDashboard()
                            };
                        },
                        processResults: function( data ) {
                            var terms = [];
                            if ( data ) {
                                jQuery.each( data, function( id, title ) {
                                    terms.push({
                                        id:   id,
                                        text: title
                                    });
                                });
                            }
                            return {
                                results: terms
                            };
                        },
                        cache: true
                    }
                }

                jQuery("#"+row_id+" #batch_update_value_td").empty().append(select_str);
                jQuery("#"+row_id+" #batch_update_value_td").find(".batch_update_value").select2(select2Params);
            } else if( selected_action == 'search_and_replace' ) {
                jQuery("#"+row_id+" #batch_update_value_td").empty().append('<input type="text" class="batch_update_value sm_batch_update_search_value" placeholder="'+_x('Search for...', 'placeholder', 'smart-manager-for-wp-e-commerce')+'" class="FormElement ui-widget-content" >');
                jQuery("#"+row_id+" #batch_update_value_td").append('<input type="text" style="margin-left: 1em;" class="batch_update_value sm_batch_update_replace_value" placeholder="'+_x('Replace with...', 'placeholder', 'smart-manager-for-wp-e-commerce')+'" class="FormElement ui-widget-content" >');
            } else {
                if ( typeof (window.smart_manager.displayDefaultBatchUpdateValueHandler) !== "undefined" && typeof (window.smart_manager.displayDefaultBatchUpdateValueHandler) === "function" ) {
                    dlgParams.btnParams.noCallback = window.smart_manager.displayDefaultBatchUpdateValueHandler( row_id );
                }
            }
        });

        jQuery(document).off('click', ".batch_update_image").on('click', ".batch_update_image", function(event){

            let row_id = jQuery(this).closest('tr').attr('id');

            let file_frame;
                                        
            // If the media frame already exists, reopen it.
            if ( file_frame ) {
              file_frame.open();
              return;
            }
            
            // Create the media frame.
            file_frame = wp.media.frames.file_frame = wp.media({
              title: jQuery( this ).data( 'uploader_title' ),
              button: {
                text: jQuery( this ).data( 'uploader_button_text' )
              },
              multiple: false  // Set to true to allow multiple files to be selected
            });

            file_frame.on( 'open', function() {
                jQuery('[aria-describedby="sm_inline_dialog"]').hide();
            });

            file_frame.on( 'close', function() {
                jQuery('[aria-describedby="sm_inline_dialog"]').show();
            });

            // When an image is selected, run a callback.
            file_frame.on( 'select', function() {
              // We set multiple to false so only get one image from the uploader
                attachment = file_frame.state().get('selection').first().toJSON();

                jQuery('#'+row_id+' .batch_update_image').attr('data-imageId',attachment['id']);
                jQuery('#'+row_id+' .batch_update_image').html('<img style="cursor:pointer;" src="'+attachment['url']+'" width="32" height="32">');
            });
            
            file_frame.open();
        });
    };

// ========================================================================

Smart_Manager.prototype.smToggleFullScreen = function (elem) {
    // ## The below if statement seems to work better ## if ((document.fullScreenElement && document.fullScreenElement !== null) || (document.msfullscreenElement && document.msfullscreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
        if (elem.requestFullScreen) {
            elem.requestFullScreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullScreen) {
            elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

Smart_Manager.prototype.smScreenHandler = function () {
    if( window.smart_manager.wpToolsPanelWidth === 0) {
        window.smart_manager.wpToolsPanelWidth = jQuery('#adminmenuwrap').width();
        jQuery('#adminmenuback').hide();
        jQuery('#adminmenuwrap').hide();
        jQuery('#wpadminbar').hide();
        jQuery('#wpcontent').css('margin-left', '0px');
        window.smart_manager.grid_width = window.smart_manager.grid_width + window.smart_manager.wpToolsPanelWidth;
        window.smart_manager.grid_height = document.documentElement.offsetHeight - 260;
    } else {
        jQuery('#adminmenuback').show();
        jQuery('#adminmenuwrap').show();
        jQuery('#wpadminbar').show();
        jQuery('#wpcontent').removeAttr("style");
        window.smart_manager.grid_width = window.smart_manager.grid_width - window.smart_manager.wpToolsPanelWidth;
        window.smart_manager.grid_height = document.documentElement.offsetHeight - 360;
        window.smart_manager.wpToolsPanelWidth = 0;
    }
    
    window.smart_manager.hot.updateSettings({'width':window.smart_manager.grid_width, 'height': window.smart_manager.grid_height});
    window.smart_manager.hot.render();

    jQuery('#sm_top_bar, #sm_bottom_bar').css('width',window.smart_manager.grid_width+'px');
}

if ( document.addEventListener ) {
    document.addEventListener('webkitfullscreenchange', window.smart_manager.smScreenHandler, false);
    document.addEventListener('mozfullscreenchange', window.smart_manager.smScreenHandler, false);
    document.addEventListener('fullscreenchange', window.smart_manager.smScreenHandler, false);
    document.addEventListener('MSFullscreenChange', window.smart_manager.smScreenHandler, false);
}

// Function to handle deletion of records
Smart_Manager.prototype.deleteAllRecords = function(actionArgs){
    if("undefined" !== typeof(window.smart_manager.deleteAndUndoRecords) && "function" === typeof(window.smart_manager.deleteAndUndoRecords)){
        window.smart_manager.deleteAndUndoRecords({cmd:'delete_all',args:('undefined' !== typeof('actionArgs')) ? actionArgs:{}});
    }
}
// Function to handle undo tasks
Smart_Manager.prototype.undoTasks = function(){
    if("undefined" !== typeof(window.smart_manager.deleteAndUndoRecords) && "function" === typeof(window.smart_manager.deleteAndUndoRecords)){
        window.smart_manager.deleteAndUndoRecords({cmd:'undo'});
    }
}
// Function to handle tasks deletion
Smart_Manager.prototype.deleteTasks = function(){
    if("undefined" !== typeof(window.smart_manager.deleteAndUndoRecords) && "function" === typeof(window.smart_manager.deleteAndUndoRecords)){
        window.smart_manager.deleteAndUndoRecords({cmd:'delete'});
    }
}
// Function to handle displaying tasks
Smart_Manager.prototype.showTasks = function(){
    let props = [window.smart_manager.displayTasks,window.smart_manager.resetSearch,window.smart_manager.setDashboardDisplayName,window.smart_manager.load_dashboard,window.smart_manager.isTasksEnabled,window.smart_manager.reset];
    if(!props && !(props.every(prop => ("undefined" === typeof(prop) && "function" !== typeof(prop))))){
        return;
    }
    if(0 === jQuery(".sm_top_bar_action_btns:nth-last-child(5)").find('#undo_sm_editor_grid').length){
        jQuery("#sm_top_bar_left .sm_top_bar_action_btns:nth-last-child(5)").append('<div id="undo_sm_editor_grid" class="sm_beta_dropdown">'+
                                    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">'+
                                        '<path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />'+
                                    '</svg>'+
                                    '<span title="'+_x('Undo', 'tooltip', 'smart-manager-for-wp-e-commerce')+'">'+_x('Undo', 'button', 'smart-manager-for-wp-e-commerce')+'</span>'+
                                    '<div class="sm_beta_dropdown_content">'+
                                        '<a id="sm_beta_undo_selected" href="#">'+_x('Selected Tasks', 'undo button', 'smart-manager-for-wp-e-commerce')+'</a>'+
                                        '<a id="sm_beta_undo_all_tasks" class="sm_entire_store" href="#">'+_x('All Tasks', 'undo button', 'smart-manager-for-wp-e-commerce')+'</a>'+
                                    '</div>'+
                                '</div>' +
                                '<div id="delete_tasks_sm_editor_grid" class="sm_beta_dropdown">' +
                                    '<svg class="sm-error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">'+
                                        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>'+
                                    '</svg>'+
                                    '<span title="'+_x('Delete', 'tooltip', 'smart-manager-for-wp-e-commerce')+'">'+_x('Delete', 'button', 'smart-manager-for-wp-e-commerce')+'</span>'+
                                    '<div class="sm_beta_dropdown_content">'+
                                        '<a id="sm_beta_delete_selected_tasks" href="#">'+_x('Selected Tasks', 'delete tasks button', 'smart-manager-for-wp-e-commerce')+'</a>'+
                                        '<a id="sm_beta_delete_all_tasks" class="sm_entire_store" href="#">'+_x('All Tasks', 'delete tasks button', 'smart-manager-for-wp-e-commerce')+'</a>'+
                                    '</div>'+
                                '</div>');
    }
    window.smart_manager.displayTasks({showHideTasks: window.smart_manager.isTasksEnabled()});
    window.smart_manager.reset(true);
    jQuery('#sm_nav_bar_search #search_content').html( ( window.smart_manager.searchType == 'simple' ) ? window.smart_manager.simpleSearchContent : window.smart_manager.advancedSearchContent);
    window.smart_manager.resetSearch();
    window.smart_manager.setDashboardDisplayName();
    window.smart_manager.load_dashboard();        
}
// Display title modal 
Smart_Manager.prototype.showTitleModal = function(params = {}) {
    if(!window.smart_manager.processName || !window.smart_manager.processContent){
        return;
    }

    let title = sprintf(_x('Edited %s','process title','smart-manager-for-wp-e-commerce'),window.smart_manager.processContent)

    if(0 === window.smart_manager.showTasksTitleModal){
        window.smart_manager.updatedTitle = title
        if("function" === typeof(window.smart_manager.processCallback)){
            ("undefined" !== typeof(window.smart_manager.processCallbackParams) && Object.keys(window.smart_manager.processCallbackParams).length > 0) ? window.smart_manager.processCallback(window.smart_manager.processCallbackParams) : window.smart_manager.processCallback()
        }
        return;
    }

    let description = sprintf(_x('Name the task for easier reference and future actions, especially for %s option. A pre-filled title has been suggested based on your changes.','modal description','smart-manager-for-wp-e-commerce'), '<strong>'+_x('Undo','modal description','smart-manager-for-wp-e-commerce')+'</strong>' )
    window.smart_manager.modal = {
        title: _x('Task Title','modal title','smart-manager-for-wp-e-commerce'),
        content: '<div style="padding-bottom: 1em; color: #6b7280!important;">'+description+'</div>'+
                '<div id="show_modal_content"><input type="text" id="sm_add_title" placeholder="'+_x('Enter desired title here...','title placeholder','smart-manager-for-wp-e-commerce')+'" value="'+title+'"></div>',
        autoHide: false,
        cta: {
            title: _x('Ok','button','smart-manager-for-wp-e-commerce'),
            closeModalOnClick: params.hasOwnProperty('btnParams') ? ((params.btnParams.hasOwnProperty('hideOnYes')) ? params.btnParams.hideOnYes : true) : true,
            callback: function(){ 
                let updatedTitle = jQuery('#sm_add_title').val();
                if(updatedTitle){
                    window.smart_manager.updatedTitle = updatedTitle;
                    if("function" === typeof(window.smart_manager.processCallback)){
                        ("undefined" !== typeof(window.smart_manager.processCallbackParams) && Object.keys(window.smart_manager.processCallbackParams).length > 0) ? window.smart_manager.processCallback(window.smart_manager.processCallbackParams) : window.smart_manager.processCallback()
                    }
                }
            }
        },
        closeCTA: {title: _x('Cancel','button','smart-manager-for-wp-e-commerce')}
    }
    window.smart_manager.showModal()
}
// Function to handle records deletion, tasks undo and deletion of tasks records
Smart_Manager.prototype.deleteAndUndoRecords = function(params = {}){
    if(!params || (0 === Object.keys(params).length) || (false === params.hasOwnProperty('cmd')) || !params['cmd'] || ((0 === window.smart_manager.selectedRows.length && !window.smart_manager.selectAll) && (false === window.smart_manager.selectedAllTasks))){
        return;
    }
    params.data = {
        cmd:params['cmd'],
        active_module: window.smart_manager.dashboard_key,
        security: window.smart_manager.sm_nonce,
        selected_ids: JSON.stringify(window.smart_manager.getSelectedKeyIds().sort(function(a, b){return b-a})),
        storewide_option: (true === window.smart_manager.selectAll || true === window.smart_manager.selectedAllTasks) ? 'entire_store' : '',
        active_module_title: window.smart_manager.dashboardName,
        backgroundProcessRunningMessage: window.smart_manager.backgroundProcessRunningMessage,
        pro: true,
        SM_IS_WOO30: (window.smart_manager.sm_is_woo30) ? window.smart_manager.sm_is_woo30 : '',
        SM_IS_WOO22: (window.smart_manager.sm_id_woo22) ? window.smart_manager.sm_id_woo22 : '',
        SM_IS_WOO21: (window.smart_manager.sm_is_woo21) ? window.smart_manager.sm_is_woo21 : ''
    };
    let processName = '', tasksParams = ['undo','delete'];
    let currentProcessName = '';
    if(tasksParams.includes(params['cmd'])){
        params.data.isTasks = 1;
    }
    switch(params['cmd']){
        case 'delete_all':
            processName = _x('Delete Records','progressbar modal title','smart-manager-for-wp-e-commerce');
            params.data.deletePermanently = (params.hasOwnProperty('args') && (params.args.hasOwnProperty('deletePermanently'))) ? params.args.deletePermanently : 0;
            currentProcessName = (params.data.deletePermanently) ? 'delete_permanently' : 'move_to_trash';
            break;
        case 'undo':
            processName = _x('Undo Tasks','progressbar modal title','smart-manager-for-wp-e-commerce');
            currentProcessName = 'undo';
            break;
        case 'delete':
            processName = _x('Delete Tasks','progressbar modal title','smart-manager-for-wp-e-commerce');
            currentProcessName = 'delete';
            break;
    }
    setTimeout(function(){ 
        window.smart_manager.showProgressDialog(processName); 
        if("undefined" !== typeof(sa_sm_background_process_heartbeat) && "function" === typeof(sa_sm_background_process_heartbeat)){
            sa_sm_background_process_heartbeat(1000, currentProcessName);
        }
    },1);
    params.showLoader = false;
    if(window.smart_manager.isFilteredData()){
        params.data.filteredResults = 1;
    }
    window.smart_manager.send_request(params,function(response){});
}
// Function for displaying warning modal before doing undo/delete tasks records
Smart_Manager.prototype.taskActionsModal = function(args = {}){
    if(!args || !((Object.keys(args)).every(arg => args.hasOwnProperty(arg)))){
        return;
    }
    window.smart_manager.selectedAllTasks = (['sm_beta_undo_all_tasks','sm_beta_delete_all_tasks'].includes(args.id)) ? true : false;
    if(0 === window.smart_manager.selectedRows.length && !window.smart_manager.selectAll && !window.smart_manager.selectedAllTasks){
        window.smart_manager.notification = {message: _x('Please select a task','notification','smart-manager-for-wp-e-commerce')}
        window.smart_manager.showNotification()
        return false;
    }
    
    let undoTaskIds = (['sm_beta_undo_selected','sm_beta_undo_all_tasks'].includes(args.id)) ? 1 : 0,
        deleteTasks = (['sm_beta_delete_selected_tasks','sm_beta_delete_all_tasks'].includes(args.id)) ? 1 : 0,
        params = {},
        paramsContent = '';
        params.btnParams = {}
        params.title = '<span class="sm-error-icon"><span class="dashicons dashicons-warning" style="vertical-align: text-bottom;"></span>&nbsp;'+_x('Attention!', 'modal title', 'smart-manager-for-wp-e-commerce')+'</span>';
        switch(true){
            case (undoTaskIds && "undefined" !== typeof(window.smart_manager.undoTasks) && "function" === typeof(window.smart_manager.undoTasks)):
                paramsContent = _x('undo', 'modal content', 'smart-manager-for-wp-e-commerce');
                params.btnParams.yesCallback = window.smart_manager.undoTasks;
                break;
            case (deleteTasks && "undefined" !== typeof(window.smart_manager.deleteTasks) && "function" === typeof(window.smart_manager.deleteTasks)):
                paramsContent = '<span class="sm-error-icon">' + _x('delete', 'modal content', 'smart-manager-for-wp-e-commerce') + '</span>';
                params.btnParams.yesCallback = window.smart_manager.deleteTasks;
                break;
        }
        params.content = _x('Are you sure you want to '+paramsContent+' ', 'modal content', 'smart-manager-for-wp-e-commerce') + '<strong>'+ args.btnText.toLowerCase() + '</strong>?';
        if(window.smart_manager.selectedRows.length > 0 || window.smart_manager.loadedTotalRecords){
            params.btnParams.hideOnYes = false;
            window.smart_manager.showConfirmDialog(params);
        } else{
            window.smart_manager.notification = {message: _x('No task to '+paramsContent, 'warning', 'smart-manager-for-wp-e-commerce')}
            window.smart_manager.showNotification()
        }   
}

// Function for displaying warning modal before doing export csv
Smart_Manager.prototype.getExportCsv = function(args){
    if(!args || !((Object.keys(args)).every(arg => args.hasOwnProperty(arg)))){
        return;
    }
    args.params.content = _x('Are you sure you want to export the ','modal content','smart-manager-for-wp-e-commerce') + args.btnText + '?';
    if("undefined" !== typeof(window.smart_manager.generateCsvExport) && "function" === typeof(window.smart_manager.generateCsvExport)){
        args.params.btnParams.yesCallback = window.smart_manager.generateCsvExport;
    }
    window.smart_manager.exportStore = ('sm_export_entire_store' === args.id) ? true : false;
    if("undefined" !== typeof(window.smart_manager.showConfirmDialog) && "function" === typeof(window.smart_manager.showConfirmDialog)){
        window.smart_manager.showConfirmDialog(args.params);
    }   
}

// Function for handling display of editor for column titles
Smart_Manager.prototype.displayColumnTitleEditor = function(e){
    let parent = e.target.closest('li');
    if(!parent) return;
    let input = parent.querySelector("input[type='text']");
    if(!input) return;
    let cssClass = 'sm-column-title-input-edit';
    input.readOnly = !input.readOnly;
    if(input.readOnly){
        input.classList.remove(cssClass)
    }else{
        input.classList.add(cssClass);
        input.focus();
        //Code for setting the cursor at end of input
        let val = input.value;
        input.value = '';
        input.value = val; 
    }
}
