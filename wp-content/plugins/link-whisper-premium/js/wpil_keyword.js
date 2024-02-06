"use strict";

(function ($) {
    $(document).on('click', '#wpil_keywords_table .delete', wpil_keyword_delete);
    $(document).on('click', '#wpil_keywords_settings i', wpil_keyword_settings_show);
    $(document).on('click', '.link-whisper_page_link_whisper_keywords .column-keyword .dashicons', wpil_keyword_local_settings_show);
    $(document).on('click', '#wpil_keywords_settings input[type="submit"]', wpil_keyword_clear_fields);
    $(document).on('click', '#add_keyword_form a.single-autolink-create', wpil_keyword_add);
    $(document).on('click', '.wpil_keyword_local_settings_save', wpil_keyword_local_settings_save);
    $(document).on('click', '#wpil_keywords_reset_button', wpil_keyword_reset);
    $(document).on('click', '.wpil-insert-selected-keywords', wpil_insert_selected_keywords);
    $(document).on('click', '.wpil-bulk-keywords-import', bulkImportAutolinks);
    $(document).on('click', '#wpil-bulk-keywords-create', bulkCreateAutolinks);
    $(document).on('click', '#wpil-bulk-keywords-global-set', bulkSetAutolinkSettings);
    $(document).on('click', '.wpil-bulk-autolink-setting-icon', toggleBulkAutolinkSettings);
    $(document).on('click', '.wpil-autolink-import-method', toggleBulkAutolinkCreateMethod);
//    $(document).on('click', '.wpil-open-bulk-autolink-create-form', showBulkAutolinkInterface);
    $(document).on('click', '#wpil-bulk-keywords-close, .wpil-autolink-bulk-create-background', hideBulkAutolinkInterface);
    $(document).on('change', '#wpil-autolink-csv-import-file', toggleFileImportButton);
    $(document).on('change keyup', '#wpil-autolink-keyword-field, #wpil-autolink-url-field', toggleFieldImportButton);
    $(document).on('click', '.wpil-autolink-do-bulk-action', doSelectedBulkAction);
    $(document).on('click', '#wpil_check_all_keywords', checkAllAutolinks);
    $(document).on('click', 'td .wpil-collapsible-wrapper', maybeAjaxDownloadData);

    var autolinkBulkData = [],
        stepped = 0,
        rowCount = 0,
        errorCount = 0,
        firstError = undefined;

    function bulkImportAutolinks(){
        var method = $('input[name="wpil-autolink-import-method"]:checked').val();
        autolinkBulkData = [];

        // clear any existing rows and separators
        $('.wpil-bulk-autolink-rows .wpil-bulk-autolink-row').empty();

        if(method === 'csv'){
            getCSVImportData();
        }else if(method === 'field'){
            autolinkBulkData = getFieldImportData();
            assembleKeywordRows();
        }
    }

    function getCSVImportData(){
        if($('.wpil-autolink-csv-import .wpil-bulk-keywords-import').hasClass('disabled')){
            return;
        }

        var files = $('#wpil-autolink-csv-import-file').get()[0].files;
        var file = files[0];
        if(file){
            var rows = 0;
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function(event){
                if('undefined' !== typeof reader.result && reader.result !== null){
                    rows = (reader.result.match(/,/g)||[]).length
                }
            };

            if(rows > 500){
                $('.wpil-autolink-csv-many-rows').removeClass('hidden');
            }
        }

		var config = buildConfig();

        $('#wpil-autolink-csv-import-file').parse({
            config: config,
            error: function(err, file)
            {
                console.log("ERROR:", err, file);
                firstError = firstError || err;
                errorCount++;
            },
            complete: function()
            {
                assembleKeywordRows();
            }
        });
    }

    function getFieldImportData(){
        if($('.wpil-autolink-field-import-container .wpil-bulk-keywords-import').hasClass('disabled')){
            return;
        }

        var keywords = $('#wpil-autolink-keyword-field').val();
        var urls = $('#wpil-autolink-url-field').val();
        var data = [];

        if(!keywords || keywords.trim() === ''){
            wpil_swal({"title": "No Keywords", "text": "Please enter one URL on each line for each Autolink URL", "icon": "error"});
            return;
        }else if(!urls || urls.trim() === ''){
            wpil_swal({"title": "No URLs", "text": "Please enter one URL on each line for each Autolink Keyword", "icon": "error"});
            return;
        }

        keywords = keywords.split("\n");
        urls = urls.split("\n");

        for(var i in keywords){
            if(undefined === urls[i] || keywords[i].length < 1 || urls[i].length < 1){
                continue;
            }

            data.push([keywords[i], urls[i]]);
        }

        return data;
    }

    /**
     * Assembles the rows of keywords to import
     **/
    var evenOdd = 'even';
    function assembleKeywordRows(){
        if(autolinkBulkData.length < 1){
            wpil_swal({"title": "Data Error", "text": "The entered data couldn't be processed, please check the data source and try again.", "icon": "error"});
            return;
        }

        for(var i in autolinkBulkData){
            var template = $('.wpil-autolink-bulk-keyword-container .wpil-row-template').clone().removeClass('wpil-row-template');
            var dat = autolinkBulkData[i];
            var keyword = (undefined !== dat['keyword']) ? 'keyword': 0;
            var link = (undefined !== dat['link']) ? 'link': 1;
            evenOdd = (i % 2 === 0) ? 'even': 'odd';
            template.find('input[name="keyword"]').val(dat[keyword]);
            template.find('input[name="link"]').val(dat[link]);
            if(keyword !== 0 && link !== 1){
                addImportedKeywordSettings(template, dat);
            }
            $('.wpil-bulk-autolink-rows').append(template);
            $('.wpil-bulk-autolink-rows').append('<div class="wpil-bulk-autolink-row-separator ' + evenOdd + '"></div>');
//            console.log(dat);
        }

        // hide the data import interface components
        $('.wpil-autolink-bulk-create-container').addClass('bulk-create-temp-hidden');
        // show the autolink create interface components
        $('.wpil-autolink-bulk-keyword-heading-container, .wpil-autolink-bulk-keyword-container, #wpil-bulk-keywords-create, .wpil-autolink-bulk-keyword-global-setting-container').addClass('bulk-create-temp-display');
    }

    function addImportedKeywordSettings(template, data = []){
        var settingKey = {
            'add_same_link': 'wpil_keywords_add_same_link',             // 0    // checkbox
            'link_once': 'wpil_keywords_link_once',                     // 1    // checkbox
            'force_insert': 'wpil_keywords_force_insert',               // 2    // checkbox
            'limit_inserts': 'wpil_keywords_limit_inserts',             // 3    // checkbox
            'insert_limit': 'wpil_keywords_insert_limit',               // 4    // num
            'select_links': 'wpil_keywords_select_links',               // 6    // checkbox
            'set_priority': 'wpil_keywords_set_priority',               // 7    // checkbox
            'priority_setting': 'wpil_keywords_priority_setting',       // 8    // num
            'prioritize_longtail': 'wpil_keywords_prioritize_longtail', // 9    // checkbox
            'restrict_date': 'wpil_keywords_restrict_date',             // 10   // checkbox
            'restricted_date': 'wpil_keywords_restricted_date',         // 11   // date
            'case_sensitive': 'wpil_keywords_case_sensitive',           // 12   // checkbox
            'restrict_to_cats': 'wpil_keywords_restrict_to_cats',       // 13   // checkbox
            'restrict_term_': 'wpil_keywords_restrict_term_',           // 14   // checkbox
            'same_lang': 'wpil_keywords_same_lang',                     // 15   // checkbox
        };

        for(var i in data){
            if(data[i] === ''){
                continue;
            }

            if(( (i == 'priority_setting' && undefined !== data['set_priority'] && !isEmpty(data['set_priority'])) || i == 'insert_limit')){
                if(!isEmpty(data[i])){
                    template.find('input[id="' + settingKey[i] + '"]').val(data[i]).parent('.' + settingKey[i] + '_container').css({'display': 'block'});
                }else{
                    template.find('input[id="' + settingKey[i] + '"]').val('').parent('.' + settingKey[i] + '_container').css({'display': 'none'});
                }
            }else if(i == 'restricted_date' && !isEmpty(data[i])){
                var date = new Date(data[i]);
                date = date.toISOString().substring(0,10);
                template.find('input[id="' + settingKey[i] + '"]').val(date).parent('.' + settingKey[i] + '_container').css({'display': 'block'});
            }else if(i == 'restrict_term_' && !isEmpty(data[i])){
                var cats = data[i].split(',');
                for(var j in cats){
                    template.find('input[name="' + settingKey[i] + cats[j] + '"]').prop('checked', true);
                }
            }else{
                var checked = (!isEmpty(data[i])) ? true: false; // bool FTW!
                template.find('input[id="' + settingKey[i] + '"]').prop('checked', checked);
            }
        }
    }

    var start, end;
    function printStats(msg)
    {
        if (msg)
            console.log(msg);
        console.log("       Time:", (end-start || "(Unknown; your browser does not support the Performance API)"), "ms");
        console.log("  Row count:", rowCount);
        if (stepped)
            console.log("    Stepped:", stepped);
        console.log("     Errors:", errorCount);
        if (errorCount)
            console.log("First error:", firstError);
    }
    
    
    
    function buildConfig()
    {
        // consult: papaparse.com/docs#config
        return {
            //header: $('#header').prop('checked'),
            header: true,
            dynamicTyping: $('#dynamicTyping').prop('checked'),
            skipEmptyLines: $('#skipEmptyLines').prop('checked'),
            preview: parseInt($('#preview').val() || 0),
            step: false, //stepProcessCSV,
            skipEmptyLines: true,
            encoding: $('#encoding').val(),
            worker: $('#worker').prop('checked'),
            comments: $('#comments').val(),
            complete: completeFn,
            error: errorFn,
            download: false
        };
    }
    
    function stepFn(results, parser)
    {
        stepped++;
        if (results)
        {
            if (results.data)
                rowCount += results.data.length;
            if (results.errors)
            {
                errorCount += results.errors.length;
                firstError = firstError || results.errors[0];
            }
        }
    }
    
    function completeFn(results)
    {
        end = now();

//        console.log(results);

        if (results && results.errors)
        {
            if (results.errors)
            {
                errorCount = results.errors.length;
                firstError = results.errors[0];
            }
            if (results.data && results.data.length > 0)
                rowCount = results.data.length;
        }

        if(results && results.data && results.data.length){
            for(var i in results.data){
                var dat = results.data[i];

                if(dat.length < 1){
                    continue;
                }

                var keyword = (undefined !== dat['Keyword']) ? 'Keyword': (undefined !== dat['keyword']) ? 'keyword': false;
                var link = (undefined !== dat['Link']) ? 'Link': (undefined !== dat['link']) ? 'link': false;

                // if there's no keyword or link, or this is the second header
                if( !keyword ||
                    !link ||
                    dat[keyword].length < 1 ||
                    dat[link].length < 1 ||
                    typeof dat[keyword] !== 'string' ||
                    typeof dat[link] !== 'string' || 
                    dat[keyword].toLowerCase() === 'keyword' && dat[link].toLowerCase() === 'link')
                {
                    // skip to the next item
                    continue;
                }

                // lowercase the strings so that we're using consistent keys
                var newData = {};
                for(var j in results.data[i]){
                    newData[j.toLowerCase()] = results.data[i][j];
                }
                autolinkBulkData.push(newData);
            }
        }

        printStats("Parse complete");
        console.log("    Results:", results);
    }

    function errorFn(err, file)
    {
        end = now();
        console.log("ERROR:", err, file);
        enableButton();
    }
    
    function enableButton()
    {
        $('#submit').prop('disabled', false);
    }
    
    function now()
    {
        return typeof window.performance !== 'undefined'
                ? window.performance.now()
                : 0;
    }

    function bulkCreateAutolinks(){
        var keywordData = [];
        var checked = $('input[name="wpil-create-autolink"]:checked');

        // notify the user if no links are checked
        if(checked.length < 1){
            wpil_swal({"title": "No Rules Selected", "text": "Please select some autolinking rules to create", "icon": "info"});
            return;
        }

        checked.each(function(index, element){
            var parent = $(element).parent().parent();

            if(parent.hasClass('wpil-row-template')){
                return;
            }

            var setPriority = parent.find('.wpil-bulk-autolinks-set-priority-checkbox').prop('checked') ? 1 : 0;
            var restrictedToDate = parent.find('.wpil-bulk-autolinks-date-checkbox').prop('checked') ? 1 : 0;
            var restrictedToCat = parent.find('.wpil-bulk-autolinks-restrict-to-cats').prop('checked') ? 1 : 0;
            var limitInserts = parent.find('.wpil-bulk-autolinks-limit-inserts-checkbox').prop('checked') ? 1 : 0;

            var params = {
                keyword: parent.find('input[name="keyword"]').val(),
                link: parent.find('input[name="link"]').val(),
                wpil_keywords_add_same_link: parent.find('.wpil-bulk-autolinks-add-same-link').is(':checked') ? 1 : 0,
                wpil_keywords_link_once: parent.find('.wpil-bulk-autolinks-link-once').is(':checked') ? 1 : 0,
                wpil_keywords_limit_inserts: limitInserts,
                wpil_keywords_select_links: parent.find('.wpil-bulk-autolinks-select-links').is(':checked') ? 1 : 0,
                wpil_keywords_set_priority: setPriority,
                wpil_keywords_prioritize_longtail: parent.find('.wpil-bulk-autolinks-prioritize-longtail').is(':checked') ? 1 : 0,
                wpil_keywords_restrict_date: restrictedToDate,
                wpil_keywords_case_sensitive: parent.find('.wpil-bulk-autolinks-case-sensitive').is(':checked') ? 1 : 0,
                wpil_keywords_force_insert: parent.find('.wpil-bulk-autolinks-force-insert').is(':checked') ? 1 : 0,
                wpil_keywords_same_lang: parent.find('.wpil-bulk-autolinks-same-lang').is(':checked') ? 1 : 0,
                wpil_keywords_restrict_to_cats: restrictedToCat,
            };

            if(setPriority){
                var priority = parent.find('.wpil-bulk-autolinks-priority-setting').val();
                if(!priority){
                    priority = null;
                }
                params['wpil_keywords_priority_setting'] = priority;
            }

            if(restrictedToDate){
                var date = parent.find('.wpil-bulk-autolinks-restricted-date').val();
                if(!date){
                    date = null;
                }
                params['wpil_keywords_restricted_date'] = date;
            }

            if(restrictedToCat){
                var selectedCats = [];
                parent.find('.wpil-bulk-autolinks-restrict-keywords-input:checked').each(function(index, element){
                    selectedCats.push($(element).data('term-id'));
                });

                params['restricted_cats'] = selectedCats;
            }

            if(limitInserts){
                var limit = parent.find('.wpil-bulk-autolinks-insert-limit').val();
                if(!limit){
                    limit = null;
                }
                params['wpil_keywords_insert_limit'] = limit;
            }

            keywordData.push(params);
        });

        if(keywordData.length < 1){
            return;
        }

        var data = {
            action: 'wpil_bulk_keyword_add',
            nonce: wpil_keyword_nonce,
            keyword_data: keywordData
        }

        // hide the autolink create panels
        $('.bulk-create-temp-display').removeClass('bulk-create-temp-display');
        // unhide the progress loader
        $('.wpil-autolink-bulk-create-wrapper .progress-panel-container').addClass('bulk-create-temp-display');

        ajaxBulkCreateAutolinks(data);
    }

    var retryBulkCreate = 0;
    function ajaxBulkCreateAutolinks(data){
        // get the max input limit
        var maxVars = $('#wpil-autolink-bulk-max-input').val();

        var partial = false;
        // if we're saving keyowrds and there's so many keywords & settings that the server will choke
        if( 'wpil_bulk_keyword_add' === data.action && 
            maxVars < countProperties(data.keyword_data) || undefined !== data.partial)
        {
            // slice the data into smaller bites so we can run through it

            // create a list of the keywords to insert that should stay inside the var limit
            var partialKeywordData = [];
            var newData = []; // keep track of the data that won't be processed this run so we can get to it later
            var limitReached = false;
            for(var i in data.keyword_data){
                if(!limitReached && (countProperties(partialKeywordData) + 100) < maxVars){
                    partialKeywordData.push(data.keyword_data[i]);
                }else{
                    limitReached = true;
                    newData.push(data.keyword_data[i]);
                }
            }

            // create the partial data object
            var partialData = {
                action: 'wpil_bulk_keyword_add',
                nonce: wpil_keyword_nonce,
                keyword_data: partialKeywordData,
                partial_insert: true
            };

            // update the main data with the remaining data
            data.keyword_data = newData;
            // set a persistent "partial" flag
            data.partial = true;

            // set the partial flag if there's keyword data available
            if(partialKeywordData.length > 0){
                partial = true;
            }
        }

        $.ajax({
            type: "POST",
            url: ajaxurl,
            data: (!partial) ? data: partialData,
            error: function (jqXHR, textStatus, errorThrown) {
                if(retryBulkCreate < 5 && undefined === data.action && data.action === 'wpil_bulk_keyword_process'){
                    retryBulkCreate++;
                    ajaxBulkCreateAutolinks(data);
                    return;
                }

                var wrapper = document.createElement('div');
                $(wrapper).append('<strong>' + textStatus + '</strong><br>');
                $(wrapper).append(jqXHR.responseText);
                wpil_swal({"title": "Error", "content": wrapper, "icon": "error"});
            },
            success: function(response){
                console.log(response);
                if (response.error) {
                    wpil_swal(response.error.title, response.error.text, 'error');
                    return;
                }

                $('.wpil-autolink-bulk-create-wrapper').find('.progress_count').text(response.displayMessage);
                if(response.finish){
                    setTimeout(function(){
                        location.reload();
                    }, 300);
                }else if(response.partial){
                    // if we have keyword ids
                    if(response.keyword_ids){
                        // add them to the list of inserted ids
                        if(undefined === data.keyword_ids){
                            data.keyword_ids = [];
                        }
                        
                        for(var i in response.keyword_ids){
                            data.keyword_ids.push(response.keyword_ids[i]);
                        }
                    }
                    
                    // if no links were inserted or there's no more to insert, we must be at the end of the partial processing
                    if(!response.keyword_ids || data.keyword_data.length < 1){
                        // in that case, change the data object so we can begin processing the ids
                        data = {
                            'action': 'wpil_bulk_keyword_process',
                            'nonce': wpil_keyword_nonce,
                            'keyword_ids': data.keyword_ids,
                        }
                    }

                    // and go around for another pass
                    ajaxBulkCreateAutolinks(data);
                }else{
                    // if we have data and the bulk create panel is open
                    if(response.keyword_id && response.loop !== undefined && $('.wpil-autolink-bulk-create-wrapper').is(':visible')){
                        data = {
                            'action': 'wpil_bulk_keyword_process',
                            'keyword_ids': response.keyword_id,
                            'keyword_total': response.keyword_total,
                            'nonce': wpil_keyword_nonce,
                            'total': response.total,
                            'loop': response.loop
                        };

                        ajaxBulkCreateAutolinks(data);
                    }
                }
            }
        });
    }

    /**
     * Sets the setting values for all the imported bulk autolinks.
     **/
    function bulkSetAutolinkSettings(){

        var globalSettings = $('.wpil-bulk-autolink-global-settings');

        var importedAutolinks = $('.wpil-bulk-autolink-row').not('.wpil-row-template');

        // exit if there's no imported autolinks or settings
        if(importedAutolinks.length < 1 || globalSettings.length < 1){
            return;
        }

        // compile the settings so they're easier to read
        var settings = {
            'add_same': globalSettings.find('.wpil-bulk-autolinks-add-same-link').prop('checked'),
            'link_once': globalSettings.find('.wpil-bulk-autolinks-link-once').prop('checked'),
            'force_insert': globalSettings.find('.wpil-bulk-autolinks-force-insert').prop('checked'),
            'limit_inserts': globalSettings.find('.wpil-bulk-autolinks-limit-inserts-checkbox').prop('checked'),
            'insert_limit': globalSettings.find('.wpil-bulk-autolinks-insert-limit').val(),
            'select_links': globalSettings.find('.wpil-bulk-autolinks-select-links').prop('checked'),
            'set_priority': globalSettings.find('.wpil-bulk-autolinks-set-priority-checkbox').prop('checked'),
            'priority': globalSettings.find('.wpil-bulk-autolinks-priority-setting').val(),
            'prioritize_longtail': globalSettings.find('.wpil-bulk-autolinks-prioritize-longtail').prop('checked'),
            'after_date': globalSettings.find('.wpil-bulk-autolinks-date-checkbox').prop('checked'),
            'after_dated': globalSettings.find('.wpil-bulk-autolinks-restricted-date').val(),
            'case_sensitive': globalSettings.find('.wpil-bulk-autolinks-case-sensitive').prop('checked'),
            'same_lang': globalSettings.find('.wpil-bulk-autolinks-same-lang').prop('checked'),
            'restrict_cats': globalSettings.find('.wpil-bulk-autolinks-restrict-to-cats').prop('checked'),
            'restricted_cats': []
        };

        //jQuery('.wpil-bulk-autolink-global-settings').find('.wpil-bulk-autolinks-date-checkbox').is('checked')

        if(settings.restrict_cats){
            globalSettings.find('.wpil-bulk-autolinks-restrict-keywords-input:checked').each(function(index, element){
                settings.restricted_cats.push($(element).data('term-id'));
            });
        }
        console.log(settings);

        // update all the setting values for the imported settings
        importedAutolinks.find('.wpil-bulk-autolinks-add-same-link[type="checkbox"]').prop('checked', settings.add_same);
        importedAutolinks.find('.wpil-bulk-autolinks-link-once[type="checkbox"]').prop('checked', settings.link_once);
        importedAutolinks.find('.wpil-bulk-autolinks-force-insert[type="checkbox"]').prop('checked', settings.force_insert);
        importedAutolinks.find('.wpil-bulk-autolinks-limit-inserts-checkbox[type="checkbox"]').prop('checked', settings.limit_inserts);
        importedAutolinks.find('.wpil-bulk-autolinks-insert-limit[type="number"]').val(settings.insert_limit);
        importedAutolinks.find('.wpil-bulk-autolinks-select-links[type="checkbox"]').prop('checked', settings.select_links);
        importedAutolinks.find('.wpil-bulk-autolinks-set-priority-checkbox[type="checkbox"]').prop('checked', settings.set_priority);
        importedAutolinks.find('.wpil-bulk-autolinks-priority-setting[type="number"]').val(settings.priority);
        importedAutolinks.find('.wpil-bulk-autolinks-prioritize-longtail[type="checkbox"]').prop('checked', settings.prioritize_longtail);
        importedAutolinks.find('.wpil-bulk-autolinks-date-checkbox[type="checkbox"]').prop('checked', settings.after_date);
        importedAutolinks.find('.wpil-bulk-autolinks-restricted-date[type="date"]').val(settings.after_dated);
        importedAutolinks.find('.wpil-bulk-autolinks-case-sensitive[type="checkbox"]').prop('checked', settings.case_sensitive);
        importedAutolinks.find('.wpil-bulk-autolinks-same-lang[type="checkbox"]').prop('checked', settings.same_lang);
        importedAutolinks.find('.wpil-bulk-autolinks-restrict-to-cats[type="checkbox"]').prop('checked', settings.restrict_cats);

        importedAutolinks.find('.wpil-bulk-autolinks-restrict-keywords-input').each(function(index, element){
            var id = $(element).data('term-id');
            if(settings.restricted_cats.indexOf(id) !== -1){
                $(element).prop('checked', true);
            }else{
                $(element).prop('checked', false);
            }
        });

        // toggle the hide/showing of compound settings
        var priorityDisplay = (settings.set_priority) ? 'block': 'none';
        var dateDisplay = (settings.after_date) ? 'block': 'none';
        var insertLimitDisplay = (settings.limit_inserts) ? 'block': 'none';

        importedAutolinks.find('.wpil_keywords_priority_setting_container, .wpil-bulk-autolinks-priority-setting[type="number"]').css('display', priorityDisplay);
        importedAutolinks.find('.wpil_keywords_restricted_date_container').css('display', dateDisplay);
        importedAutolinks.find('.wpil_keywords_insert_limit_container, .wpil-bulk-autolinks-insert-limit').css('display', insertLimitDisplay);

        applyUpdateGlow(importedAutolinks, '.wpil-bulk-autolink-input');
    }

    function toggleBulkAutolinkSettings(){
        if($(this).hasClass('wpil-global-setting-icon')){
            var settings = $(this).parent().parent().find('.wpil-bulk-autolink-settings');
        }else{
            var settings = $(this).parent().find('.wpil-bulk-autolink-settings');
        }

        if(!settings.hasClass('open')){
            settings.addClass('open');
        }else{
            settings.removeClass('open');
        }
    }

    function toggleBulkAutolinkCreateMethod(){
        var method = $(this).val();

        if(method === 'field'){
            var hide = $('.wpil-autolink-csv-import-container');
            $('.wpil-autolink-field-import-container').removeClass('hidden');

            if(!hide.hasClass('hidden')){
                hide.addClass('hidden');
            }
        }else{
            var hide = $('.wpil-autolink-field-import-container');
            $('.wpil-autolink-csv-import-container').removeClass('hidden');

            if(!hide.hasClass('hidden')){
                hide.addClass('hidden');
            }
        }
    }

    function showBulkAutolinkInterface(/*e*/){
        //e.preventDefault();
        // unset any CSV files
        $('#wpil-autolink-csv-import-file').val(null);
        // clear the textareas
        $('.wpil-autolink-field-import textarea').val(null);
        // show the background
        $('.wpil-autolink-bulk-create-background').removeClass('hidden');
        // show the interface
        $('.wpil-autolink-bulk-create-wrapper').removeClass('hidden');
    }

    function hideBulkAutolinkInterface(){
        // unset any CSV files
        $('#wpil-autolink-csv-import-file').val(null);
        // clear the textareas
        $('.wpil-autolink-field-import textarea').val(null);
        // hide the background
        $('.wpil-autolink-bulk-create-background').addClass('hidden');
        // hide the interface
        $('.wpil-autolink-bulk-create-wrapper').addClass('hidden');
        // now that we're out of view, remove the temp display statuses
        $('.bulk-create-temp-hidden').removeClass('bulk-create-temp-hidden');
        $('.bulk-create-temp-display').removeClass('bulk-create-temp-display');
        // clear any created rows
        $('.wpil-bulk-autolink-rows').empty();
        // disable the import buttons
        $('.wpil-bulk-keywords-import').removeClass('disabled').addClass('disabled');
        // hide the "big file" message
        $('.wpil-autolink-csv-many-rows').removeClass('hidden').addClass('hidden');
    }

    /**
     * Enables the file import button if there's a file to import.
     * Disables the button if there's no file
     **/
    function toggleFileImportButton(){
        var button = $('.wpil-autolink-csv-import .wpil-bulk-keywords-import');

        if(!$(this).val()){
            button.removeClass('disabled').addClass('disabled');
        }else{
            button.removeClass('disabled');
        }
    }

    /**
     * Enables and disables the field import button depending on if there's field data
     **/
    function toggleFieldImportButton(){
        var keywords = $('#wpil-autolink-keyword-field').val();
        var urls = $('#wpil-autolink-url-field').val();
        var button = $('.wpil-autolink-field-import-container .wpil-bulk-keywords-import');

        if(keywords.length > 0 && urls.length > 0){
            button.removeClass('disabled');
        }else{
            button.removeClass('disabled').addClass('disabled');
        }
    }

    function checkAllAutolinks(){
        var checked = false;

        if ($(this).prop('checked')) {
            checked = true;
        }

        $('#wpil_keywords_table table .wpil-autolink-rule-select-checkbox').each(function(){
            $(this).prop('checked', checked);
        });
    }


    if (is_wpil_keyword_reset) {
        wpil_keyword_reset_process(2, 1);
    }

    /**
     * Activates the user's selected bulk action
     **/
    function doSelectedBulkAction(e){
        e.preventDefault();
        var selected = $('.wpil-autolink-bulk-action-selector').val();

        if('0' === selected){
            return;
        }

        if(selected === 'delete-selected'){
            deleteSelectedRules();
        }else if(selected === 'bulk-create'){
            showBulkAutolinkInterface();
        }else if(selected === 'refresh-selected'){
            refreshSelectedRules();
        }else if(selected === 'export-rules'){
            exportSelectedRules();
        }
    }

    function wpil_keyword_delete() {
        if (confirm("Are you sure you want to delete this keyword?")) {
            $(this).parents('tr').find('.wpil-autolink-rule-select-checkbox').prop('checked', true);

            if(!doingDelete){
                deleteSelectedRules();
            }
        }
    }

    var refireWaiter;
    var doingDelete = false;
    function deleteSelectedRules(){
        var deleteRules = $('.column-checkbox .wpil-autolink-rule-select-checkbox:checked');

        // if there are rules to delete
        if(deleteRules.length > 0){
            // disable the selected checkboxes & the bulk selector
            disableKeywordSelects(deleteRules);
            doingDelete = true;


            // put together a manageable list of them
            var ids = [];
            var totalLinks = 0;
            deleteRules.each(function(index, element){
                if(totalLinks < 60 && ids.length < 10){
                    ids.push($(element).data('id'));
                    totalLinks += parseInt($(element).data('link-count'));
                }
            });

            $.post(ajaxurl, {
                action: 'wpil_keyword_delete',
                id: ids
            }, function(response){
                if(response && response.deleted.length > 0){
                    for(var i in response.deleted){
                        var row = $('.wpil-autolink-rule-select-checkbox[data-id="'+ response.deleted[i] +'"]').parents('tr');
                        if(row.length){
                            row.fadeOut(300, function(){
                                clearTimeout(refireWaiter);
                                jQuery(this).remove(); 
                                refireWaiter = setTimeout(deleteSelectedRules, 100);
                            });
                        }
                    }
                }else if(response && response.deleted_links > 0){
                    // if we've deleted links, but not whole rules, go around again
                    deleteSelectedRules();
                }else if(response && response.deleted.length < 1){
                    // if no links were deleted, re-enable the table
                    enableAutolinkTable();
                    doingDelete = false;
                }
            });
        }else{
            enableAutolinkTable();
            doingDelete = false;
        }
    }

    function disableKeywordSelects(selected, addLoading = false){
        if(selected.length < 1){
            var selected = $('.column-checkbox .wpil-autolink-rule-select-checkbox:checked');
        }

        selected.each(function(ind, element){
            var parent = $(element).parents('tr');
            if(!parent.hasClass('disabled')){
                parent.addClass('disabled');
            }

            // if we're supposed to add a loading effect to the keyword
            if(addLoading){
                parent.find('.column-keyword .progress_panel.loader').css({'display': 'block'});
                parent.find('.wpil-autolink-rule-keyword').css({'display': 'none'});
            }
        });

        // disable the bulk select too
        $('#wpil_check_all_keywords, .wpil-sticky-header .column-checkbox input').prop('disabled', true);
    }

    function refreshSelectedRules(keywordData = []){
        var refreshRules = $('.column-checkbox .wpil-autolink-rule-select-checkbox:checked');

        // if there are rules to refresh
        if(refreshRules.length > 0){
            // disable the selected checkboxes & the bulk selector
            disableKeywordSelects(refreshRules, true);

            // 
            var ids = [];
            refreshRules.each(function(index, element){
                ids.push(parseInt($(element).data('id')));
            });

            if(Object.keys(keywordData).length < 1){
                keywordData = {
                    'action': 'wpil_bulk_keyword_process',
                    'keyword_ids': ids,
                    'keyword_total': ids.length,
                    'refresh': 1,
                    'nonce': wpil_keyword_nonce
                };
            }                       

            $.ajax({
                type: "POST",
                url: ajaxurl,
                data: keywordData,
                error: function (jqXHR, textStatus, errorThrown) {
                    var wrapper = document.createElement('div');
                    $(wrapper).append('<strong>' + textStatus + '</strong><br>');
                    $(wrapper).append(jqXHR.responseText);
                    wpil_swal({"title": "Error", "content": wrapper, "icon": "error"});
                },
                success: function(response){
                    console.log(response);
                    // if we have data
                    if(response.keyword_id && typeof response.keyword_id === 'object' && Object.keys(response.keyword_id).length > 0){
                        // get a list of the current ids
                        var processingIds = Object.values(response.keyword_id).map(function(int){ return parseInt(int); });

                        // reenable the refreshed selectors
                        for(var i in ids){
                            if(-1 === processingIds.indexOf(ids[i])){
                                var check = $('.wpil-autolink-rule-select-checkbox[data-id="'+ ids[i] +'"]');
                                var row = check.parents('tr');
                                if(row.length && row.hasClass('disabled')){
                                    check.prop('checked', false).prop('disabled', true);
                                    row.removeClass('disabled');
                                    row.find('.progress_panel.loader').css({'display': 'none'});
                                    row.find('.progress_count').text('');
                                    row.find('.wpil-autolink-rule-keyword').css({'display': 'block'});
                                }
                            }
                        }
    
                        // find the last process keyword and update its status message
                        if(response.last_keyword && response.last_keyword !== undefined && response.last_keyword !== null && parseInt(response.last_keyword) > 0 && response.displayMessage){
                            $('.wpil-autolink-rule-select-checkbox[data-id="'+ response.last_keyword +'"]').parents('tr').find('.progress_count').text(response.displayMessage);
                        }
    
                        var data = {
                            'action': 'wpil_bulk_keyword_process',
                            'keyword_ids': response.keyword_id,
                            'keyword_total': response.keyword_total,
                            'last_keyword': response.last_keyword,
                            'refresh': 1,
                            'nonce': wpil_keyword_nonce,
                            'total': response.total,
                            'loop': response.loop
                        };
    
                        refreshSelectedRules(data);
                    }else{
                        enableAutolinkTable();
                        setTimeout(function(){
                            location.reload();
                        }, 300);
                    }
                }
            });

        }else{
            enableAutolinkTable();
        }
    }

    function enableAutolinkTable(){
        var selected = $('.column-checkbox .wpil-autolink-rule-select-checkbox:checked');

        selected.each(function(ind, element){
            var parent = $(element).parents('tr');
            if(parent.hasClass('disabled')){
                parent.removeClass('disabled');
            }
        });

        // enable the bulk selector
        $('#wpil_check_all_keywords, .wpil-sticky-header .column-checkbox input').prop('disabled', false);
    }

    /**
     * Creates an export of the selected Autolink Rules.
     * Exporting the rules should be pretty quick, so currently it just does them all in one go. (No looping)
     **/
    function exportSelectedRules(){
        var exportRules = $('.column-checkbox .wpil-autolink-rule-select-checkbox:checked');

        // if there are rules to refresh
        if(exportRules.length > 0){
            // disable the selected checkboxes & the bulk selector
            disableKeywordSelects(exportRules);

            // 
            var ids = [];
            exportRules.each(function(index, element){
                ids.push($(element).data('id'));
            });

            var keywordData = {
                'action': 'wpil_bulk_keyword_export',
                'keyword_ids': ids,
                'keyword_total': ids.length,
                'nonce': wpil_keyword_nonce
            };

            $.ajax({
                type: "POST",
                url: ajaxurl,
                data: keywordData,
                error: function (jqXHR, textStatus, errorThrown) {
                    var wrapper = document.createElement('div');
                    $(wrapper).append('<strong>' + textStatus + '</strong><br>');
                    $(wrapper).append(jqXHR.responseText);
                    wpil_swal({"title": "Error", "content": wrapper, "icon": "error"});
                },
                success: function(response){
                    console.log(response);

                    if (response.error) {
                        wpil_swal(response.error.title, response.error.text, 'error');
                        return;
                    }

					// create our download link and try downloading the file
					var link = document.createElement('a');
					link.href = response.filename;
					link.download = response.nicename;
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);

					// Todo: consider creating a backup download button...
                    
                    enableAutolinkTable();
                }
            });

        }else{
            enableAutolinkTable();
        }
    }

    function wpil_keyword_settings_show() {
        $('#wpil_keywords_settings .block').toggle();
    }

    function wpil_keyword_local_settings_show() {
        $(this).closest('td').find('.block').toggle();
    }

    $(document).on('change', '.wpil_keywords_set_priority_checkbox, .wpil-bulk-autolinks-set-priority-checkbox', wpilShowSetPriorityInput);
    function wpilShowSetPriorityInput(){
        var button = $(this);
        button.parent().find('.wpil_keywords_priority_setting_container').toggle();
    }

    $(document).on('change', '.wpil_keywords_restrict_date_checkbox, .wpil-bulk-autolinks-date-checkbox', wpilShowRestrictDateInput);
    function wpilShowRestrictDateInput(){
        var button = $(this);
        button.parent().find('.wpil_keywords_restricted_date_container').toggle();
    }

    $(document).on('change', '.wpil_keywords_limit_inserts_checkbox, .wpil-bulk-autolinks-limit-inserts-checkbox', wpilShowLimitInsertInput);
    function wpilShowLimitInsertInput(){
        var button = $(this);
        button.parent().find('.wpil_keywords_insert_limit_container, .wpil_keywords_bulk_global_insert_limit_container').toggle();
    }

    $(document).on('click', '.wpil-keywords-restrict-cats-show', wpilShowRestrictCategoryList);
    function wpilShowRestrictCategoryList(){
        console.log(this);
        var button = $(this);
        button.parents('.block').find('.wpil-keywords-restrict-cats').toggle();
        button.toggleClass('open');
    }

    function wpil_keyword_clear_fields() {
        $('input[name="keyword"]').val('');
        $('input[name="link"]').val('');
    }

    function wpil_keyword_add() {
        var form = $('#add_keyword_form');
        var keyword = form.find('input[name="keyword"]').val();
        var link = form.find('input[name="link"]').val();

        if(keyword.length === 0 || link.length === 0){
            wpil_swal({"title": "Auto-Link Field Empty", "text": "Please make sure there's a Keyword and a Link in the Auto-Link creation fields before attempting to creating an Auto-Link.", "icon": "info"});
            return;
        }

        var restrictedToDate = $('#wpil_keywords_restrict_date').prop('checked') ? 1 : 0;
        var restrictedToCat = $('#wpil_keywords_restrict_to_cats').prop('checked') ? 1 : 0;
        var setPriority = $('#wpil_keywords_set_priority').prop('checked') ? 1 : 0;
        var limitInserts = $('#wpil_keywords_limit_inserts').prop('checked') ? 1 : 0;

        form.find('input[type="text"]').hide();
        form.find('.progress_panel').show();
        var params = {
            keyword: keyword,
            link: link,
            wpil_keywords_add_same_link: $('#wpil_keywords_add_same_link').prop('checked') ? 1 : 0,
            wpil_keywords_link_once: $('#wpil_keywords_link_once').prop('checked') ? 1 : 0,
            wpil_keywords_limit_inserts: limitInserts,
            wpil_keywords_select_links: $('#wpil_keywords_select_links').prop('checked') ? 1 : 0,
            wpil_keywords_set_priority: setPriority,
            wpil_keywords_restrict_date: restrictedToDate,
            wpil_keywords_case_sensitive: $('#wpil_keywords_case_sensitive').prop('checked') ? 1 : 0,
            wpil_keywords_force_insert: $('#wpil_keywords_force_insert').prop('checked') ? 1 : 0,
            wpil_keywords_same_lang: $('#wpil_keywords_same_lang').prop('checked') ? 1 : 0,
            wpil_keywords_prioritize_longtail: $('#wpil_keywords_prioritize_longtail').prop('checked') ? 1 : 0,
            wpil_keywords_restrict_to_cats: restrictedToCat,
        };

        if(limitInserts){
            var insertLimit = $('#wpil_keywords_insert_limit').val();
            if(!insertLimit){
                insertLimit = null;
            }
            params['wpil_keywords_insert_limit'] = insertLimit; 
        }else{
            params['wpil_keywords_insert_limit'] = null; 
        }

        if(setPriority){
            var priority = $('#wpil_keywords_priority_setting').val();
            if(!priority){
                priority = null;
            }
            params['wpil_keywords_priority_setting'] = priority; 
        }

        if(restrictedToDate){
            var date = $('#wpil_keywords_restricted_date').val();
            if(!date){
                date = null;
            }
            params['wpil_keywords_restricted_date'] = date; 
        }

        if(restrictedToCat){
            var selectedCats = [];
            $('#wpil_keywords_settings .wpil-restrict-keywords-input:checked').each(function(index, element){
                selectedCats.push($(element).data('term-id'));
            });

            params['restricted_cats'] = selectedCats; 
        }

        wpil_keyword_process(null, 0, form, params);
    }

    function wpil_keyword_local_settings_save() {
        var keyword_id = $(this).data('id');
        var form = $(this).closest('.local_settings');
        form.find('.block').hide();
        form.find('.progress_panel').show();
        var setPriority = form.find('input[type="checkbox"][name="wpil_keywords_set_priority"]').prop('checked') ? 1 : 0;
        var restrictedToDate = form.find('input[type="checkbox"][name="wpil_keywords_restrict_date"]').prop('checked') ? 1 : 0;
        var restrictedToCats = form.find('input[type="checkbox"][name="wpil_keywords_restrict_to_cats"]').prop('checked') ? 1 : 0;
        var limitInserts = form.find('input[type="checkbox"][name="wpil_keywords_limit_inserts"]').prop('checked') ? 1 : 0;
        var params = {
            wpil_keywords_add_same_link: form.find('input[type="checkbox"][name="wpil_keywords_add_same_link"]').prop('checked') ? 1 : 0,
            wpil_keywords_link_once: form.find('input[type="checkbox"][name="wpil_keywords_link_once"]').prop('checked') ? 1 : 0,
            wpil_keywords_limit_inserts: limitInserts,
            wpil_keywords_select_links: form.find('input[type="checkbox"][name="wpil_keywords_select_links"]').prop('checked') ? 1 : 0,
            wpil_keywords_restrict_date: restrictedToDate,
            wpil_keywords_case_sensitive: form.find('input[type="checkbox"][name="wpil_keywords_case_sensitive"]').prop('checked') ? 1 : 0,
            wpil_keywords_force_insert: form.find('input[type="checkbox"][name="wpil_keywords_force_insert"]').prop('checked') ? 1 : 0,
            wpil_keywords_prioritize_longtail: form.find('input[type="checkbox"][name="wpil_keywords_prioritize_longtail"]').prop('checked') ? 1 : 0,
            wpil_keywords_same_lang: form.find('input[type="checkbox"][name="wpil_keywords_same_lang"]').prop('checked') ? 1 : 0,
            wpil_keywords_restrict_to_cats: restrictedToCats,
            wpil_keywords_set_priority: setPriority
        };

        if(limitInserts){
            var insertLimit = form.find('input[name="wpil_keywords_insert_limit"]').val();
            if(!insertLimit){
                insertLimit = 0;
            }
            params['wpil_keywords_insert_limit'] = parseInt(insertLimit); 
        }else{
            params['wpil_keywords_insert_limit'] = 0; 
        }

        if(setPriority){
            var priority = form.find('input[name="wpil_keywords_priority_setting"]').val();
            if(!priority){
                priority = 0;
            }
            params['wpil_keywords_priority_setting'] = parseInt(priority); 
        }

        if(restrictedToDate){
            var date = form.find('input[name="wpil_keywords_restricted_date"]').val();
            if(!date){
                date = null;
            }
            params['wpil_keywords_restricted_date'] = date; 
        }

        if(restrictedToCats){
            var selectedCats = [];
            form.find('input.wpil-restrict-keywords-input[type="checkbox"]:checked').each(function(index, element){
                selectedCats.push($(element).data('term-id'));
            });

            params['restricted_cats'] = selectedCats; 
        }

        wpil_keyword_process(keyword_id, 0, form, params);
    }

    function wpil_keyword_process(keyword_id, total, form, params = {}) {
        var data = {
            action: 'wpil_keyword_add',
            nonce: wpil_keyword_nonce,
            keyword_id: keyword_id,
            total: total
        }

        for (var key in params) {
            data[key] = params[key];
        }

        $.ajax({
            type: "POST",
            url: ajaxurl,
            data: data,
            error: function (jqXHR, textStatus, errorThrown) {
                var wrapper = document.createElement('div');
                $(wrapper).append('<strong>' + textStatus + '</strong><br>');
                $(wrapper).append(jqXHR.responseText);
                wpil_swal({"title": "Error", "content": wrapper, "icon": "error"}).then(wpil_keyword_process(keyword_id, keyword, link));
            },
            success: function(response){
                if (response.error) {
                    wpil_swal(response.error.title, response.error.text, 'error');
                    return;
                }

                form.find('.progress_count').text(parseInt(response.progress) + '%');
                if (response.finish) {
                    location.reload();
                } else {
                    if (response.keyword_id && response.total) {
                        wpil_keyword_process(response.keyword_id, response.total, form);
                    }
                }
            }
        });
    }

    function wpil_keyword_reset() {
        $('#wpil_keywords_table .table').hide();
        $('#wpil_keywords_table .progress').show();
        wpil_keyword_reset_process(1, 1);
    }

    function wpil_keyword_reset_process(count, total) {
        $.ajax({
            type: "POST",
            url: ajaxurl,
            data: {
                action: 'wpil_keyword_reset',
                nonce: wpil_keyword_nonce,
                count: count,
                total: total,
            },
            error: function (jqXHR, textStatus, errorThrown) {
                var wrapper = document.createElement('div');
                $(wrapper).append('<strong>' + textStatus + '</strong><br>');
                $(wrapper).append(jqXHR.responseText);
                wpil_swal({"title": "Error", "content": wrapper, "icon": "error"}).then(wpil_keyword_reset_process(1, 1));
            },
            success: function(response){
                if (response.error) {
                    wpil_swal(response.error.title, response.error.text, 'error');
                    return;
                }

                var progress = Math.floor((response.ready / response.total) * 100);
                $('#wpil_keywords_table .progress .progress_count').text(progress + '%' + ' ' + response.ready + '/' + response.total);
                if (response.finish) {
                    location.reload();
                } else {
                    wpil_keyword_reset_process(response.count, response.total)
                }
            }
        });
    }

    function wpil_insert_selected_keywords(e){
        e.preventDefault();

        var parentCell = $(this).closest('.wpil-dropdown-column');
        var checkedLinks = $(this).closest('td.column-select_links').find('[name=wpil_keyword_select_link]:checked');
        var linkIds = [];

        $(checkedLinks).each(function(index, element){
            var id = $(element).data('select-keyword-id');
            if(id){
                linkIds.push(id);
            }
        });

        if(linkIds.length < 1){
            return;
        }

        // hide the dropdown and show the loading bar
        parentCell.find('.wpil-collapsible-wrapper').css({'display': 'none'});
        parentCell.find('.progress_panel.loader').css({'display': 'block'});

        $.ajax({
            type: "POST",
            url: ajaxurl,
            data: {
                action: 'wpil_insert_selected_keyword_links',
                link_ids: linkIds,
                nonce: wpil_keyword_nonce,
            },
            error: function (jqXHR, textStatus, errorThrown) {
                var wrapper = document.createElement('div');
                $(wrapper).append('<strong>' + textStatus + '</strong><br>');
                $(wrapper).append(jqXHR.responseText);
                wpil_swal({"title": "Error", "content": wrapper, "icon": "error"});
                // hide the loading bar and show the dropdown
                parentCell.find('.progress_panel.loader').css({'display': 'none'});
                parentCell.find('.wpil-collapsible-wrapper').css({'display': 'block'});
            },
            success: function(response){
                if (response.error) {
                    wpil_swal(response.error.title, response.error.text, 'error');

                    // hide the loading bar and show the dropdown
                    parentCell.find('.progress_panel.loader').css({'display': 'none'});
                    parentCell.find('.wpil-collapsible-wrapper').css({'display': 'block'});
                    return;
                }

                if (response.success) {
                    wpil_swal({"title": response.success.title, "text": response.success.text, "icon": "success"}).then(function(){
                        location.reload();
                    });
                } else {
                    location.reload();
                }
            }
        });
    }

    $('.wpil-select-all-possible-keywords').on('change', function(e){
        var id = $(this).data('keyword-id');
        if($(this).is(':checked')){
            $('.column-select_links .wpil-content .keyword-' + id + ' li input[name="wpil_keyword_select_link"]').prop('checked', true);
        }else{
            $('.column-select_links .wpil-content .keyword-' + id + ' li input[name="wpil_keyword_select_link"]').prop('checked', false);
        }
    });

    function applyUpdateGlow(elements, searchString = ''){
        if(typeof elements !== 'object' || elements.length < 1){
            return;
        }

        if(searchString.length > 0){
            elements.find(searchString).addClass('wpil-update-glow-anim wpil-update-glow');
            setTimeout(function(){
                elements.find(searchString).removeClass('wpil-update-glow');
                setTimeout(function(){
                    elements.find(searchString).removeClass('wpil-update-glow-anim');
                }, 250);
            }, 250);
        }else{
            elements.addClass('wpil-update-glow-anim wpil-update-glow');    // apply our animate class and start the glow
            setTimeout(function(){                                          // after 250ms wait to allow the glow to peak
                elements.removeClass('wpil-update-glow');                   // remove the glow
                setTimeout(function(){                                      // after a 250ms wait for the glow to decline to 0
                    elements.removeClass('wpil-update-glow-anim');          // remove the animate class to clean things up
                }, 250);
            }, 250);
        }
    }

    /**
     * Checks to see if a value is "empty"
     **/
    function isEmpty(val){
        return (val === null || val === '' || val === 0 || val === '0');
    }

    /**
     * Counts the number of properties in a basic object of objects
     **/
    function countProperties(data){
        var county = 0;
        if(data.length){
            for(var i in data){
                // count this index
                county++;
                // if there's data in the object
                if(data.length > 0){
                    // count it too
                    for(var j in data[i]){
                        county++;
                    }
                }
            }

        }

        return county;
    }

    /**
     * Checks to see if the clicked dropdown has all of its data.
     * If the dropdown doesn't, this downloads the remaining data and adds it to the dropdown
     **/
    var globalDownloadTracker = [];
    function maybeAjaxDownloadData(e){
        var wrap = $(e.target).parents('td').find('.wpil-collapsible-wrapper'),
            count = parseInt(wrap.find('.wpil-collapsible').text()),
            current = wrap.find('.report_links li').length,
            type = (wrap.data('dropdown-type') === 'links') ? 'links': 'possible-links',
            keywordId = wrap.data('keyword-id'),
            keyword = wrap.data('keyword'),
            nonce = wrap.data('wpil-collapsible-nonce'),
            processId = type + '_' + keywordId;

        // first check if there's all the data
        if(count <= current){
            // if there is, exit
            return;
        }

        // also make sure there isn't a download for the data already running
        if(undefined !== this && -1 !== globalDownloadTracker.indexOf(processId)){
            // if there is, exit
            return;
        }

        if(-1 === globalDownloadTracker.indexOf(processId)){
            globalDownloadTracker.push(processId);
        }

        // start calling for the remaining links
        $.ajax({
			type: 'POST',
			url: ajaxurl,
			data: {
				action: 'get_keyword_dropdown_data',
                dropdown_type: type,
                keyword_id: keywordId,
                keyword: keyword,
                nonce: nonce,
                item_count: current,
			},
			success: function(response){
                // if there was an error
                if(response.error){
                    // output the error message
                    wpil_swal(response.error.title, response.error.text, 'error');
                    // and exit
                    return;
                }

                // if there was a notice
                if(response.info){
                    // output the notice message
                    wpil_swal(response.info.title, response.info.text, 'info');
                    // and exit
                    return;
                }

                // 
                if(response.success){
                    // 
                    if(undefined !== response.success.item_data && '' !== response.success.item_data){
                        wrap.find('.report_links').append(response.success.item_data);
                    }

                    if(undefined !== response.success.item_count && response.success.item_count > 0){
                        // go for another trip!
                        maybeAjaxDownloadData(e);
                    }
                    // and exit
                    return;
                }
			},
            error: function(jqXHR, textStatus, errorThrown){
                console.log({jqXHR, textStatus, errorThrown});
            }
		});
    }


})(jQuery);