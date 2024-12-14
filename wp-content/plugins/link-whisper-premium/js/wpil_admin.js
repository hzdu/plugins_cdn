"use strict";

(function ($)
{

    var reloadGutenberg = false;

    /////////// preloading
    function getSuggestions(manualActivate = false){
        $('[data-wpil-ajax-container]').each(function(k, el){
            var $el = $(el);
            var url = $el.attr('data-wpil-ajax-container-url');
            var count = 0;
            var urlParams = parseURLParams(url);

            // don't load the suggestions automatically if the user has selected manual activation
            if($el.data('wpil-manual-suggestions') == 1 && !manualActivate){
                return
            }

            $el.css({'display': 'block'});
            $('.wpil-get-manual-suggestions-container').css({'display': 'none'});

            if(urlParams.type && 'outbound_suggestions_ajax' === urlParams.type[0]){
                ajaxGetSuggestionsOutbound($el, url, count);
            }else if(urlParams.type && 'inbound_suggestions_page_container' === urlParams.type[0]){
                ajaxGetSuggestionsInbound($el, url, count);
            }

            setupProcessingError();
        });
    }

    getSuggestions();

    $(document).on('click', '#wpil-get-manual-suggestions', function(e){e.preventDefault(); getSuggestions(true)});

	function ajaxGetSuggestionsInbound($el, url, count, lastPost = 0, processedPostCount = 0, key = null)
	{
        var urlParams = parseURLParams(url);
        var post_id = (urlParams.post_id) ? urlParams.post_id[0] : null;
        var term_id = (urlParams.term_id) ? urlParams.term_id[0] : null;
        var source = (urlParams.source) ? urlParams.source[0] : null;
        var keywords = (urlParams.keywords) ? urlParams.keywords[0] : '';
        var sameParent = (urlParams.same_parent) ? urlParams.same_parent[0] : null;
        var sameCategory = (urlParams.same_category) ? urlParams.same_category[0] : '';
        var selectedCategory = (urlParams.selected_category) ? urlParams.selected_category[0].split(',') : '';
        var sameTag = (urlParams.same_tag) ? urlParams.same_tag[0] : '';
        var selectedTag = (urlParams.selected_tag) ? urlParams.selected_tag[0].split(',') : '';
        var selectPostTypes = (urlParams.select_post_types) ? urlParams.select_post_types[0] : '';
        var selectedPostTypes = (urlParams.selected_post_types) ? urlParams.selected_post_types[0].split(',') : '';
        var aiRelatednessThreshold = (urlParams.ai_relatedness_threshold) ? urlParams.ai_relatedness_threshold[0]: '';
        var nonce = (urlParams.nonce) ? urlParams.nonce[0]: '';

        if(!nonce){
            return;
        }

        // start the clock on the error notice
        setupProcessingError();

        // if there isn't a key set, make one
        if(!key){
            while(true){
                key = Math.round(Math.random() * 1000000000);
                if(key > 999999){break;}
            }
        }

        jQuery.ajax({
            type: 'POST',
            url: ajaxurl,
            data: {
                action: 'get_post_suggestions',
                nonce: nonce,
                count: count,
                post_id: post_id,
                term_id: term_id,
                source: source,
                type: 'inbound_suggestions',
                keywords: keywords,
                same_parent: sameParent,
                same_category: sameCategory,
                selected_category: selectedCategory,
                same_tag: sameTag,
                selected_tag: selectedTag,
                last_post: lastPost,
                completed_processing_count: processedPostCount,
                select_post_types: selectPostTypes,
                selected_post_types: selectedPostTypes,
                ai_relatedness_threshold: aiRelatednessThreshold,
                key: key,
            },
            success: function(response){
                console.log(response);

                if(!isJSON(response)){
                    response = extractAndValidateJSON(response, ['error', 'completed', 'status', 'post_count', 'completed_processing_count']);
                }

                // stop the error clock and hide any visible message
                setupProcessingError(true);
                hideProcessingError();

                // if there was an error
                if(response.error){
                    // output the error message
                    wpil_swal(response.error.title, response.error.text, 'error');
                    // and exit
                    return;
                }

                count = parseInt(count) + 1;
                var progress = Math.floor(response.completed_processing_count / (response.post_count + 0.1) * 100);
                if (progress > 100) {
                    progress = 100;
                }
                $('.progress_count').html(progress + '%');
                if(!response.completed){
                    ajaxGetSuggestionsInbound($el, url, count, response.last_post, response.completed_processing_count, key);
                }else if(undefined !== response.ai_score && response.ai_score){
                    return ajaxPerformAiSuggestionScoring($el, url, 'inbound_suggestions', key);
                }else{
                    return updateSuggestionDisplay(post_id, term_id, source, nonce, $el, 'inbound_suggestions', false, sameParent, sameCategory, key, selectedCategory, sameTag, selectedTag, selectPostTypes, selectedPostTypes, aiRelatednessThreshold);
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log({jqXHR, textStatus, errorThrown});
//				setupProcessingError(true);
            }
        });
    }

    function ajaxGetSuggestionsOutbound($el, url, count, post_count = 0, key = null)
    {
        // if there isn't a key set, make one
        if(!key){
            while(true){
                key = Math.round(Math.random() * 1000000000);
                if(key > 999999){break;}
            }
        }

        var urlParams = parseURLParams(url);
        var post_id = (urlParams.post_id) ? urlParams.post_id[0] : null;
        var term_id = (urlParams.term_id) ? urlParams.term_id[0] : null;
        var linkOrphaned = (urlParams.link_orphaned) ? urlParams.link_orphaned[0] : null;
        var sameParent = (urlParams.same_parent) ? urlParams.same_parent[0] : null;
        var sameCategory = (urlParams.same_category) ? urlParams.same_category[0] : '';
        var selectedCategory = (urlParams.selected_category) ? urlParams.selected_category[0].split(',') : '';
        var sameTag = (urlParams.same_tag) ? urlParams.same_tag[0] : '';
        var selectedTag = (urlParams.selected_tag) ? urlParams.selected_tag[0].split(',') : '';
        var selectPostTypes = (urlParams.select_post_types) ? urlParams.select_post_types[0] : '';
        var selectedPostTypes = (urlParams.selected_post_types) ? urlParams.selected_post_types[0].split(',') : '';
        var aiRelatednessThreshold = (urlParams.ai_relatedness_threshold) ? urlParams.ai_relatedness_threshold[0]: '';
        var nonce = (urlParams.nonce) ? urlParams.nonce[0]: '';

        if(!nonce){
            return;
        }

        // start the clock on the error notice
        setupProcessingError();

        jQuery.ajax({
            type: 'POST',
            url: ajaxurl,
            data: {
                action: 'get_post_suggestions',
                nonce: nonce,
                count: count,
                post_count: (post_count) ? parseInt(post_count): 0,
                post_id: post_id,
                term_id: term_id,
                link_orphaned: linkOrphaned,
                same_parent: sameParent,
                same_category: sameCategory,
                selected_category: selectedCategory,
                same_tag: sameTag,
                selected_tag: selectedTag,
                select_post_types: selectPostTypes,
                selected_post_types: selectedPostTypes,
                ai_relatedness_threshold: aiRelatednessThreshold,
                type: 'outbound_suggestions',
                key: key,
            },
            success: function(response){
                console.log({response, count});

                if(!isJSON(response)){
                    response = extractAndValidateJSON(response, ['error', 'info', 'message', 'batch_size', 'post_count']);
                }

                // stop the error clock and hide any visible message
                setupProcessingError(true);
                hideProcessingError();

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

                $el.find('.progress_count').html(response.message);

				if((count * response.batch_size) < response.post_count){
					ajaxGetSuggestionsOutbound($el, url, response.count, response.post_count, key);
				}else if( (sameCategory || sameTag) || (0 == wpil_ajax.site_linking_enabled) ){
					if(undefined !== response.ai_score && response.ai_score){
						return ajaxPerformAiSuggestionScoring($el, url, 'outbound_suggestions', key);
					}else{
						// if we're doing same tag or cat matching, skip the external sites.
						return updateSuggestionDisplay(post_id, term_id, null, nonce, $el, 'outbound_suggestions', linkOrphaned, sameParent, sameCategory, key, selectedCategory, sameTag, selectedTag, selectPostTypes, selectedPostTypes, aiRelatednessThreshold);
					}
				}else{
					ajaxGetExternalSiteSuggestions($el, url, 0, 0, key);
				}
			},
            error: function(jqXHR, textStatus, errorThrown){
                console.log({jqXHR, textStatus, errorThrown});
//				setupProcessingError(true);
            }
        });
    }


    function ajaxGetExternalSiteSuggestions($el, url, count, post_count = 0, key = null)
    {
        // if there isn't a key set, make one
        if(!key){
            while(true){
                key = Math.round(Math.random() * 1000000000);
                if(key > 999999){break;}
            }
        }

        var urlParams = parseURLParams(url);
        var post_id = (urlParams.post_id) ? urlParams.post_id[0] : null;
        var term_id = (urlParams.term_id) ? urlParams.term_id[0] : null;
        var linkOrphaned = (urlParams.link_orphaned) ? urlParams.link_orphaned[0] : null;
        var sameParent = (urlParams.same_parent) ? urlParams.same_parent[0] : null;
        var sameCategory = (urlParams.same_category) ? urlParams.same_category[0] : '';
        var selectedCategory = (urlParams.selected_category) ? urlParams.selected_category[0].split(',') : '';
        var sameTag = (urlParams.same_tag) ? urlParams.same_tag[0] : '';
        var selectedTag = (urlParams.selected_tag) ? urlParams.selected_tag[0].split(',') : '';
        var selectPostTypes = (urlParams.select_post_types) ? urlParams.select_post_types[0] : '';
        var selectedPostTypes = (urlParams.selected_post_types) ? urlParams.selected_post_types[0].split(',') : '';
        var aiRelatednessThreshold = (urlParams.ai_relatedness_threshold) ? urlParams.ai_relatedness_threshold[0]: '';
        var nonce = (urlParams.nonce) ? urlParams.nonce[0]: '';

        if(!nonce){
            return;
        }

        // start the clock on the error notice
        setupProcessingError();

        jQuery.ajax({
            type: 'POST',
            url: ajaxurl,
            data: {
                action: 'wpil_get_external_site_suggestions',
                nonce: nonce,
                count: count,
                post_count: (post_count) ? parseInt(post_count): 0,
                post_id: post_id,
                term_id: term_id,
                link_orphaned: linkOrphaned,
                same_parent: sameParent,
                same_category: sameCategory,
                selected_category: selectedCategory,
                same_tag: sameTag,
                selected_tag: selectedTag,
                select_post_types: selectPostTypes,
                selected_post_types: selectedPostTypes,
                ai_relatedness_threshold: aiRelatednessThreshold,
                type: 'outbound_suggestions',
                key: key,
            },
            success: function(response){
                console.log(response);
                console.log([url, count, post_count, key]);

                if(!isJSON(response)){
                    response = extractAndValidateJSON(response, ['error', 'message', 'batch_size']);
                }

                // stop the error clock and hide any visible message
                setupProcessingError(true);
                hideProcessingError();

                // if there was an error
                if(response.error){
                    // output the error message
                    wpil_swal(response.error.title, response.error.text, 'error');
                    // and exit
                    return;
                }

                $el.find('.progress_count').html(response.message);

                if((count * response.batch_size) < response.post_count){
                    ajaxGetExternalSiteSuggestions($el, url, response.count, response.post_count, key);
                }else if(undefined !== response.ai_score && response.ai_score){
                    return ajaxPerformAiSuggestionScoring($el, url, 'outbound_suggestions', key);
                }else{
                    return updateSuggestionDisplay(post_id, term_id, null, nonce, $el, 'outbound_suggestions', linkOrphaned, sameParent, sameCategory, key, selectedCategory, sameTag, selectedTag, selectPostTypes, selectedPostTypes, aiRelatednessThreshold);
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log({jqXHR, textStatus, errorThrown});
//				setupProcessingError(true);
            }
        });
    }

    function ajaxPerformAiSuggestionScoring($el, url, type = '', key = null, noResponseCount = 0){
        // if there isn't a key set, make one
        if(!key){
            while(true){
                key = Math.round(Math.random() * 1000000000);
                if(key > 999999){break;}
            }
        }

        var urlParams = parseURLParams(url);
        var post_id = (urlParams.post_id) ? urlParams.post_id[0] : null;
        var term_id = (urlParams.term_id) ? urlParams.term_id[0] : null;
        var linkOrphaned = (urlParams.link_orphaned) ? urlParams.link_orphaned[0] : null;
        var sameParent = (urlParams.same_parent) ? urlParams.same_parent[0] : null;
        var sameCategory = (urlParams.same_category) ? urlParams.same_category[0] : '';
        var selectedCategory = (urlParams.selected_category) ? urlParams.selected_category[0].split(',') : '';
        var sameTag = (urlParams.same_tag) ? urlParams.same_tag[0] : '';
        var selectedTag = (urlParams.selected_tag) ? urlParams.selected_tag[0].split(',') : '';
        var selectPostTypes = (urlParams.select_post_types) ? urlParams.select_post_types[0] : '';
        var selectedPostTypes = (urlParams.selected_post_types) ? urlParams.selected_post_types[0].split(',') : '';
        var aiRelatednessThreshold = (urlParams.ai_relatedness_threshold) ? urlParams.ai_relatedness_threshold[0]: '';
        var nonce = (urlParams.nonce) ? urlParams.nonce[0]: '';

        if(!nonce){
            return;
        }

        // start the clock on the error notice
        setupProcessingError();

        jQuery.ajax({
            type: 'POST',
            url: ajaxurl,
            data: {
                action: 'wpil_perform_ai_suggestion_scoring',
                nonce: nonce,
                post_id: post_id,
                term_id: term_id,
                no_response: noResponseCount,
                type: type,
                key: key,
            },
            success: function(response){
                console.log(response);

                // stop the error clock and hide any visible message
                setupProcessingError(true);
                hideProcessingError();

                // if there was an error
                if(response.error){
                    // output the error message
                    wpil_swal(response.error.title, response.error.text, 'error');
                    // and exit
                    return;
                }

                $el.find('.progress_count').html(response.message);

                if(!response.ai_score_complete){
                    var noResponse = (typeof response.no_response !== 'undefined') ? parseInt(response.no_response): 0;
                    ajaxPerformAiSuggestionScoring($el, url, type, key, noResponse);
                }else{
                    return updateSuggestionDisplay(post_id, term_id, null, nonce, $el, type, linkOrphaned, sameParent, sameCategory, key, selectedCategory, sameTag, selectedTag, selectPostTypes, selectedPostTypes, aiRelatednessThreshold);
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log({jqXHR, textStatus, errorThrown});
    //				setupProcessingError(true);
            }
        });
    }

    var batch = {};
    function ajaxGetSuggestionsInboundBatched($el = '', url = '', count = 0, lastPost = 0, processedPostCount = 0, key = null)
    {
        // list the ids
        // store the process key for each run

        // run the db search one at a time


        // when the db search is complete
        // kick off an inbound search process

        // run no more than 5 processes

        // get all of the usual items
        var urlParams = parseURLParams(url);
        var post_id = (urlParams.post_id) ? urlParams.post_id[0] : null;
        var term_id = (urlParams.term_id) ? urlParams.term_id[0] : null;
        var nonce = (urlParams.nonce) ? urlParams.nonce[0]: '';
post_id = [1,2,3,4,5,6,7,8,9,10];
        if(!nonce && false){
            return;
        }

        // start the clock on the error notice
        setupProcessingError();

        // if there isn't a key set, make one
        if(Object.keys(batch).length < 1){
            if(post_id){
                for(var i in post_id){
                    while(true){
                        key = Math.round(Math.random() * 1000000000);
                        if(key > 999999){
                            batch['post' + post_id[i]] = {'key': key, 'status': 'unprocessed'};
                            break;
                        }
                    }
                }
            }

            if(term_id){
                for(var i in term_id){
                    while(true){
                        key = Math.round(Math.random() * 1000000000);
                        if(key > 999999){
                            batch['term' + term_id[i]] = {'key': key, 'status': 'unprocessed'};
                            break;
                        }
                    }
                }
            }
        }

        doInboundSuggestionContentBatchScan(url);
    }

    function doInboundSuggestionContentBatchScan(url){

        // list the ids
        // store the process key for each run

        // run the db search one at a time


        // when the db search is complete
        // kick off an inbound search process

        // run no more than 5 processes

        // get all of the usual items
        var urlParams = parseURLParams(url);
        var keywords = (urlParams.keywords) ? urlParams.keywords[0] : '';
        var sameParent = (urlParams.same_parent) ? urlParams.same_parent[0] : null;
        var sameCategory = (urlParams.same_category) ? urlParams.same_category[0] : '';
        var selectedCategory = (urlParams.selected_category) ? urlParams.selected_category[0].split(',') : '';
        var sameTag = (urlParams.same_tag) ? urlParams.same_tag[0] : '';
        var selectedTag = (urlParams.selected_tag) ? urlParams.selected_tag[0].split(',') : '';
        var selectPostTypes = (urlParams.select_post_types) ? urlParams.select_post_types[0] : '';
        var selectedPostTypes = (urlParams.selected_post_types) ? urlParams.selected_post_types[0].split(',') : '';
        var nonce = (urlParams.nonce) ? urlParams.nonce[0]: '';

        if(!nonce && false){
            return;
        }

        // start the clock on the error notice
        setupProcessingError();

        var key = null;

        // get the id to process and the process key
        for(var j in batch){
            if(!batch[j].status || batch[j].status !== 'unprocessed'){
                continue;
            }

            var dat = batch[j].split('_');

            var search_post_id, 
                search_term_id;

            if(dat[0] === 'post'){
                search_post_id = dat[1], 
                search_term_id = null;
            }else{
                search_post_id = null, 
                search_term_id = dat[1];
            }

            key = batch[j].key;
            batch[j].status = 'processing';
            break;
        }

        if(key){
            jQuery.ajax({
                type: 'POST',
                url: ajaxurl,
                data: {
                    action: 'search_for_inbound_targets',
                    nonce: nonce,
                    post_id: search_post_id,
                    term_id: search_term_id,
                    keywords: keywords,
                    same_parent: sameParent,
                    same_category: sameCategory,
                    selected_category: selectedCategory,
                    same_tag: sameTag,
                    selected_tag: selectedTag,
                    select_post_types: selectPostTypes,
                    selected_post_types: selectedPostTypes,
                    key: key,
                },
                success: function(response){
                    console.log(response);

                    if(!isJSON(response)){
                        response = extractAndValidateJSON(response, ['error']);
                    }

                    // stop the error clock and hide any visible message
                    setupProcessingError(true);
                    hideProcessingError();

                    // if there was an error
                    if(response.error){
                        // output the error message
                        wpil_swal(response.error.title, response.error.text, 'error');
                        // and exit
                        return;
                    }

                    // say that the current item is processed
                    batch[j].status = 'processed';
                    // start proccessing the next batch
                    doInboundSuggestionContentBatchScan($el, url);
                    // see about starting a post content search
                    tryStartInboundSuggestionBatchContent();
                },
                error: function(jqXHR, textStatus, errorThrown){
                    console.log({jqXHR, textStatus, errorThrown});
    //				setupProcessingError(true);
                }
            }); 
        }
    }

    function tryStartInboundSuggestionBatchContent(){
        var processCount = 0;
        // get the id to process and the process key
        for(var j in batch){
            if(!batch[j].status || batch[j].status !== 'processed'){
                continue;
            }

            // count the current number of running search processes
            if(batch[j].status === 'searching'){
                processCount++;
                continue;
            }

            // if we're already running 5 search processed
            if(processCount >= 5){
                // break out now
                break;
            }
            
            var dat = batch[j].split('_');

            var search_post_id, 
                search_term_id;

            if(dat[0] === 'post'){
                search_post_id = dat[1], 
                search_term_id = null;
            }else{
                search_post_id = null, 
                search_term_id = dat[1];
            }

            key = batch[j].key;
            batch[j].status = 'processing';
            break;
        }


    }

    function updateSuggestionDisplay(postId, termId, source, nonce, $el, type = 'outbound_suggestions', linkOrphaned, sameParent, sameCategory = '', key = null, selectedCategory, sameTag, selectedTag, selectPostTypes, selectedPostTypes, aiRelatednessThreshold){
        jQuery.ajax({
            type: 'POST',
            url: ajaxurl,
            data: {
                action: 'update_suggestion_display',
                nonce: nonce,
                post_id: postId,
                term_id: termId,
                source: source,
                key: key,
                type: type,
                link_orphaned: linkOrphaned,
                same_parent: sameParent,
                same_category: sameCategory,
                selected_category: selectedCategory,
                same_tag: sameTag,
                selected_tag: selectedTag,
                select_post_types: selectPostTypes,
                selected_post_types: selectedPostTypes,
                ai_relatedness_threshold: aiRelatednessThreshold,
            },
            success: function(response){
                // if there was an error
                if(response.error){
                    // output the error message
                    wpil_swal(response.error.title, response.error.text, 'error');
                    // and exit
                    return;
                }

                // update the suggestion report
                $el.html(response);
                // style the sentences
                styleSentences();
                // initialize the sentence editor
                wpilEditorInitialize();
                // make sure the error notice is cleared
                setupProcessingError(true);
                hideProcessingError();
            }
        });
    }

    /**
     * Helper function that parses urls to get their query vars.
     **/
    function parseURLParams(url) {
        var queryStart = url.indexOf("?") + 1,
            queryEnd   = url.indexOf("#") + 1 || url.length + 1,
            query = url.slice(queryStart, queryEnd - 1),
            pairs = query.replace(/\+/g, " ").split("&"),
            parms = {}, i, n, v, nv;
    
        if (query === url || query === "") return;
    
        for (i = 0; i < pairs.length; i++) {
            nv = pairs[i].split("=", 2);
            n = decodeURIComponent(nv[0]);
            v = decodeURIComponent(nv[1]);
    
            if (!parms.hasOwnProperty(n)) parms[n] = [];
            parms[n].push(nv.length === 2 ? v : null);
        }
        return parms;
    }

    function wpilImplodeEls(sep, els)
    {
        var res = [];
        $(els).each(function(k, el) {
            res.push(el.outerHTML);
        });

        return res.join(sep);
    }

    function wpilImplodeText(sep, els)
    {
        var res = [];
        $(els).each(function(k, el) {
            var $el = $(el);
            res.push($el.text());
        });

        return res.join(sep);
    }

    function wpilPushFix($ex)
    {
        var $div = $("<div/>");
        $div.append($ex);
        return $div.html();
    }

    $(document).on('click', '.wpil_sentence a', function (e) {
        e.preventDefault();
    });

    var wordClicked = false;
    var wordClickedWait;
    var doubleClickWait;
    var clickedWordId = false;
    var clickedSentenceId = false;
    var notDirectlyStyled = true;
    $(document).on('click', '[class*=wpil_word]', function (e) {
        e.preventDefault();

        var clickedWord = $(this);
        var sentence = clickedWord.closest('.wpil_sentence');
        var inboundSelectedId = sentence.closest('.wpil-inbound-sentence-data-container').data('container-id');
        var collapsible = (sentence.closest('.wpil-collapsible').length > 0) ? true: false;

        if(wordClicked && false === clickedWordId || sentence.hasClass('wpil-disable-word-click')){
            return;
        }else if(	clickedWordId === clickedWord.data('wpil-word-id') &&
                    clickedSentenceId === clickedWord.closest('tr').data('wpil-sentence-id') &&
                    notDirectlyStyled
        ){
            processDoubleClick(clickedSentenceId, clickedWordId, inboundSelectedId);
            return;
        }else if(wordClicked){
            return;
        }

        wordClicked = true;
        notDirectlyStyled = true;

        // set up a timeout on the word clicked check so if processing fails the user doesn't have to reload the page to use the suggestion panel.
        clearTimeout(wordClickedWait);
        wordClickedWait = setTimeout(function(){
            wordClicked = false;
            notDirectlyStyled = true;
        }, 250);

        // set up a double click timeout to clear the double click watcher
        clearTimeout(doubleClickWait);
        doubleClickWait = setTimeout(function(){
            clickedWordId = false;
            clickedSentenceId = false;
        }, 200);


        // find the words in the current sentence
        var $words = sentence.find('.wpil_word');

        // tag all the words in the sentence with ids
        var word_id = 0;
        var word_id_attr = 'wpil-word-id';
        $words.each(function(i, el) {
            word_id++;
            var $el = $(el);
            $el.data(word_id_attr, word_id);
            $el.attr('data-' + word_id_attr, word_id);
        });

        // get the id of the clicked word and the current sentece
        clickedWordId = clickedWord.data('wpil-word-id');
        clickedSentenceId = clickedWord.closest('tr').data('wpil-sentence-id');

        if(clickedWordId > 1){
            var previousTag = sentence.find('[data-wpil-word-id="' + (clickedWordId - 1) + '"]');
            var nextTag = sentence.find('[data-wpil-word-id="' + (clickedWordId + 1) + '"]');
            if(nextTag.length && previousTag.hasClass('open-tag') && nextTag.hasClass('close-tag')){
                notDirectlyStyled = false;
            }
        }

        // find all the words in the anchor and get the start and end words of the anchor
        var anchorWords = sentence.find('a span');
        var start = anchorWords.first().data('wpil-word-id');
        var end = anchorWords.last().data('wpil-word-id');
        var middleWord = findMiddleWord(start, end, anchorWords);
        var clickedPos = clickedWord.data('wpil-word-id');

        // get the link minus contents
        var anchorClone = sentence.clone().find('a').html('');

        // if the link start and end is undefinded, insert a link at the click location
        if(undefined === end && undefined === start){
            console.log('no link');

            // set the clicked word as the link's only word
            var linkWords = sentence.find('[data-wpil-word-id="' + clickedPos + '"]');

            // clone the word
            var clonedWords = linkWords.clone();

            // create a new link if we didn't find one
            if(anchorClone.length < 1){
                anchorClone = $('<a href="%view_link%" target="_blank"></a>');
            }

            // insert the cloned words into the cloned anchor
            anchorClone = anchorClone.html(clonedWords);

            // replace the anchor with just the words
            sentence.find('a').replaceWith(sentence.find('a').html());

            // now remove all the new anchor words from the sentence
            sentence.find('[data-wpil-word-id="' + clickedPos + '"]').remove();

            if((clickedPos - 1) > 0){
                // insert the anchor before the clicked word in the sentence
                anchorClone.insertAfter(sentence.find('[data-wpil-word-id="' + (clickedPos - 1) + '"]'));
            }else{
                // insert the anchor at the start of the sentence
                sentence.prepend(anchorClone);
            }

            customSentenceRefresh(sentence);

            if (sentence.closest('.wp-list-table').hasClass('inbound')) {
                var li = sentence.closest('li');
                if(li.length){
                    sentence.closest('li').find('input[type="radio"]').click();
                }else if(li.length < 1 && collapsible){ // if the sentence is the top-level sentence in a dropdown
                    updateDropdownSentence(sentence);
                }
            }
            toggleSentenceReset(sentence);

            wordClicked = false;
            return;
        }

        // find out where the clicked word lands relative to the anchor
        if((clickedPos > end || clickedPos >= middleWord)){
            // if it's past the end of the anchor or middle of the sentence
            console.log('link end');

            // if the user clicked on the last word in the link,
            // reduce the clicked pos by 1 to remove the word from the link
            if(end == clickedPos && start < end){
                clickedPos -= 1;
            }

            var wordIds = numberRange(start, clickedPos);

            // find all the words that will be in the link
            var wordString = '[data-wpil-word-id="' + wordIds.join('"], [data-wpil-word-id="') + '"]';
            var linkWords = sentence.find(wordString);

            // clone the words
            var clonedWords = linkWords.clone();
            
            // insert the cloned words into the cloned anchor
            anchorClone = anchorClone.html(clonedWords);

            // replace the anchor with just the words
            sentence.find('a').replaceWith(sentence.find('a').html());

            // now remove all the new anchor words from the sentence
            sentence.find(wordString).remove();

            if((start - 1) > 0){
                // insert the anchor before the clicked word in the sentence
                anchorClone.insertAfter(sentence.find('[data-wpil-word-id="' + (start - 1) + '"]'));
            }else{
                // insert the anchor at the start of the sentence
                sentence.prepend(anchorClone);
            }
        }else if(clickedPos < start || clickedPos < middleWord){
            console.log('link start');
            // if it's past the end of the anchor or middle of the sentence

            // if the user clicked on the last word in the link,
            // increase the clicked pos by 1 to remove the word from the link
            if(start == clickedPos && start < end){
                clickedPos += 1;
            }

            var wordIds = numberRange(clickedPos, end);

            // find all the words that will be in the link
            var wordString = '[data-wpil-word-id="' + wordIds.join('"], [data-wpil-word-id="') + '"]';
            var linkWords = sentence.find(wordString);

            // clone the words
            var clonedWords = linkWords.clone();

            // insert the cloned words into the cloned anchor
            anchorClone = anchorClone.html(clonedWords);

            // replace the anchor with just the words
            sentence.find('a').replaceWith(sentence.find('a').html());

            // now remove all the new anchor words from the sentence
            sentence.find(wordString).remove();

            if((clickedPos - 1) > 0){
                // insert the anchor before the clicked word in the sentence
                anchorClone.insertAfter(sentence.find('[data-wpil-word-id="' + (clickedPos - 1) + '"]'));
            }else{
                // insert the anchor at the start of the sentence
                sentence.prepend(anchorClone);
            }
        }

        spaceSentenceWords(sentence);

        // check for html style tags inside the link
        var tags = $(anchorClone).find('.wpil_suggestion_tag');

        // if there are some
        if(tags.length){
            // process the tags
            processSentenceTags(sentence, anchorClone);
        }

        styleSentenceWords(sentence);

        customSentenceRefresh(sentence);

        if (sentence.closest('.wp-list-table').hasClass('inbound')) {
            var li = sentence.closest('li');
            if(li.length){
                sentence.closest('li').find('input[type="radio"]').click();
            }else if(li.length < 1 && collapsible){ // if the sentence is the top-level sentence in a dropdown
                updateDropdownSentence(sentence);
            }
        }
        toggleSentenceReset(sentence);
        wordClicked = false;
    });

    function processDoubleClick(sentenceId, wordId, dataId = false){
        // if this is
        if(false !== dataId){
            // get the current sentence
            var sentence = $('tr[data-wpil-sentence-id="' + sentenceId + '"] .wpil-inbound-sentence-data-container[data-container-id="' + dataId + '"] [data-wpil-word-id="' + wordId + '"]').closest('.wpil_sentence');
        }else{
            // get the current sentence
            var sentence = $('tr[data-wpil-sentence-id="' + sentenceId + '"] .top-level-sentence [data-wpil-word-id="' + wordId + '"]').closest('.wpil_sentence');
        }

        // get the link minus contents
        var anchorClone = sentence.clone().find('a').html('');

        // set the clicked word as the link's only word
        var linkWords = sentence.find('[data-wpil-word-id="' + wordId + '"]');

        // clone the word
        var clonedWords = linkWords.clone();
        
        // create a new link if we didn't find one
        if(anchorClone.length < 1){
            anchorClone = $('<a href="%view_link%" target="_blank"></a>');
        }

        // insert the cloned words into the cloned anchor
        anchorClone = anchorClone.html(clonedWords);

        // replace the anchor with just the words
        sentence.find('a').replaceWith(sentence.find('a').html());

        // now remove all the new anchor words from the sentence
        sentence.find('[data-wpil-word-id="' + wordId + '"]').remove();

        if((wordId - 1) > 0){
            // insert the anchor before the clicked word in the sentence
            anchorClone.insertAfter(sentence.find('[data-wpil-word-id="' + (wordId - 1) + '"]'));
        }else{
            // insert the anchor at the start of the sentence
            sentence.prepend(anchorClone);
        }

        spaceSentenceWords(sentence);

        // check for html style tags inside the link
        var tags = $(anchorClone).find('.wpil_suggestion_tag');

        // if there are some
        if(tags.length){
            // process the tags
            processSentenceTags(sentence, anchorClone);
        }

        styleSentenceWords(sentence);
        customSentenceRefresh(sentence);

        if (sentence.closest('.wp-list-table').hasClass('inbound')) {
            var li = sentence.closest('li');
            if(li.length){
                sentence.closest('li').find('input[type="radio"]').click();
            }else if(li.length < 1 && sentence.closest('.wpil-collapsible').length > 0){ // if the sentence is the top-level sentence in a dropdown
                updateDropdownSentence(sentence);
            }
        }
        toggleSentenceReset(sentence);

        wordClicked = false;
        clickedWordId = false;
        clickedSentenceId = false;

        // clear any selections so the user doesn't wind up selecting the full sentence
        clearSelection();
    }

    /**
     * Helper function to clear any text selection
     **/
    function clearSelection(){
        if(window.getSelection){
            window.getSelection().removeAllRanges();
        }else if(document.selection){
            document.selection.empty();
        }
    }

    function findMiddleWord(start = 0, end = 0, words = []){
        start = parseInt(start);
        end = parseInt(end);

        if(start === end){
            return start;
        }

        var letterRange = [];
        var totalLetters = 0;
        words.each(function(index, word){
            word = $(word);
            if(!word.hasClass('wpil_suggestion_tag')){
                var length = word.text().length;
                totalLetters += length;
                letterRange[word.data('wpil-word-id')] = length;
            }
        });

        var middleLetter = Math.round(totalLetters/2);
        var currentCount = 0;
        var middle = 0;
        for(var i in letterRange){
            currentCount += letterRange[i];

            if(currentCount >= middleLetter){
                middle = i;
                break;
            }
        }

        return middle;
    }

    function numberRange(start = 0, end = 0){
        var result = [];
        for(var i = start; i <= end; i++){
            result.push(i);
        }

        return result;
    }

    /**
     * Sets the correct word spacing on words in the clicked sentence.
     * @param {object} sentence 
     */
    function spaceSentenceWords(sentence){
        var words = sentence.find('.wpil_word');

        // find all the existing spaces in the sentence
        var spaces = [];
        sentence.contents().filter(function(){
            if(this.nodeType === Node.TEXT_NODE){
                spaces.push(this);
            }
        });

        // and remove them
        $(spaces).remove();

        // now add new spaces to the sentence
        sentence.find('span').map(function(index, element) {
            var $el = $(this);
            var data = [];

            if(0 === index){
                if(undefined !== words[index + 1] && $(words[index + 1]).hasClass('no-space-left')){
                    data = [this];
                }else if($el.hasClass('no-space-right')){
                    data = [document.createTextNode(' '), this];
                }else{
                    data = [this, document.createTextNode(' ')];
                }
            }else{
                if(undefined !== words[index + 1] && $(words[index + 1]).hasClass('no-space-left')){
                    data = [this];
                }else if(undefined !== words[index + 1] && $(words[index + 1]).hasClass('no-space-right')){
                    data = [document.createTextNode(' '), this];
                }else if($el.hasClass('no-space-right')){
                    data = [this];
                }else{
                    data = [this, document.createTextNode(' ')];
                }
            }

            $(data).insertAfter(element);
        });
    }

    /**
     * Moves the html style tags based on the user's link selection so we don't get half a style tag in the link with the other half outside it.
     * @param sentence 
     * @param anchor 
     */
    function processSentenceTags(sentence, anchor){
        var tagTypes = ['wpil-bold', 'wpil-ital', 'wpil-under', 'wpil-strong', 'wpil-em', 'wpil-code'];

        // find all the tags in the anchor and add them to a list
        var anchorTagData = {};
        anchor.find('.wpil_suggestion_tag').map(function(){
            var $el = $(this);
            for(var i in tagTypes){
                if($el.hasClass(tagTypes[i])){
                    if(undefined === anchorTagData[tagTypes[i]]){
                        anchorTagData[tagTypes[i]] = [];
                    }

                    anchorTagData[tagTypes[i]].push($el);
                }
            }
        });

        // look over all the found tags
        var keys = Object.keys(anchorTagData);
        $(keys).each(function(index, key){
            // if the anchor doesn't contain the opening and closing tags, 
            // move the tag to the correct location
            if(anchorTagData[key].length === 1){
                // if the tag is an opening one
                if(anchorTagData[key][0].hasClass('open-tag')){
                    // move it right until it's outside the anchor
                    var tag = sentence.find(anchorTagData[key][0]).detach();
                    tag.insertAfter(sentence.find('a'));
                }else{
                    // if the tag is an opening one, move it left until it's outside the anchor
                    var tag = sentence.find(anchorTagData[key][0]).detach();
                    tag.insertBefore(sentence.find('a'));
                }

            }else if(anchorTagData[key].length > 2){
                // todo handle cases where there's 3 of the same type of tag in the link...
            }
        });

        // now remove any tags that are right next to each other
        var words = sentence.find('span');
        words.map(function(index, element){
            var current = $(element);
            // if this is a style tag and the word after this one is a style tag
            if(current.hasClass('wpil_suggestion_tag') && undefined !== words[index + 1] && $(words[index + 1]).hasClass('wpil_suggestion_tag')){
                var next = $(words[index + 1]);

                // see if they're both the same kind of tag
                var tagType = '';
                for(var i in tagTypes){
                    if(current.hasClass(tagTypes[i])){
                        tagType = tagTypes[i];
                        break;
                    }
                }

                // if it does
                if(next.hasClass(tagType)){
                    // remove both tags
                    sentence.find(current).remove();
                    sentence.find(next).remove();
                }
            }
        });
    }

    /**
     * Styles the words in the sentence based on the HTML style tags found in the text.
     * Mostly this is to give the user some idea of what we're doing with his style tags.
     * @param sentence 
     */
    function styleSentenceWords(sentence){
        var tagTypes = ['wpil-bold', 'wpil-ital', 'wpil-under', 'wpil-strong', 'wpil-em', 'wpil-code'];
        var styleSettings = {'wpil-bold': {'font-weight': 600}, 'wpil-ital': {'font-style': 'italic'},  'wpil-under': {'text-decoration': 'underline'}, 'wpil-strong': {'font-weight': 600}, 'wpil-em': {'font-style': 'italic'}, 'wpil-code': {'font-family': 'monospace'}};
        var styles = {};

        var words = sentence.find('span');
        words.map(function(index, element){
            var current = $(element);
            // if this is a style tag
            if(current.hasClass('wpil_suggestion_tag')){
                // find out what kind it is
                var tagType = '';
                for(var i in tagTypes){
                    if(current.hasClass(tagTypes[i])){
                        tagType = tagTypes[i];
                        break;
                    }
                }

                // if it's an opening tag
                if(current.hasClass('open-tag')){
                    // add the correct styles to the styling array to mimic the html tag effect
                    for(var key in styleSettings[tagType]){
                        styles[key] = styleSettings[tagType][key];
                    }
                }else{
                    // if it's a closing tag, remove the style
                    for(var key in styleSettings[tagType]){
                        delete styles[key];
                    }
                }
            }else{
                current.removeAttr("style").css(styles);
            }
        });
    }

    /**
     * Styles all of the page's sentences.
     */
    function styleSentences(){
        $('#the-list .sentence .wpil_sentence, #the-list .wpil-content .wpil_sentence').each(function(index, sentence){
            styleSentenceWords($(sentence));
        });
    }

    var same_category_loading = false;

    $(document).on('click', '#wpil-regenerate-suggestions', function(){
        if (!same_category_loading) {
            same_category_loading = true;
            var container = $(this).closest('[data-wpil-ajax-container]');
            var url = container.attr('data-wpil-ajax-container-url');
            var urlParams = parseURLParams(url);
            var linkOrphaned = container.find('#field_link_orphaned').prop('checked');
            var sameParent = container.find('#field_same_parent').prop('checked');
            var sameCategory = container.find('#field_same_category').prop('checked');
            var selectedCategories = container.find('select[name="wpil_selected_category"').val();
            var sameTag = container.find('#field_same_tag').prop('checked');
            var selectedTags = container.find('select[name="wpil_selected_tag"').val();
            var category_checked = '';
            var tag_checked = '';
            var post_id = (urlParams.post_id) ? urlParams.post_id[0] : 0;
            var postTypeSelect = container.find('#field_select_post_types').prop('checked');
            var postTypes = container.find('select[name="selected_post_types"').val();

            // remove any active filtering settings
            url = url.replace(new RegExp("(&link_orphaned[^&]*)|(&same_parent[^&]*)|(&same_category[^&]*)|(&same_tag[^&]*)|(&select_post_types[^&]*)|(&selected_category[^&]*)|(&selected_tag[^&]*)|(&selected_post_types[^&]*)", 'ig'), '');

            //link to orphaned
            if (linkOrphaned) {
                url += "&link_orphaned=true";
            }

            //same parent
            if (sameParent) {
                url += "&same_parent=true";
            }

            //category
            if (sameCategory) {
                url += "&same_category=true";
                url += "&selected_category=" + selectedCategories.join(',');
                category_checked = 'checked="checked"';
            }

            //tag
            if (sameTag) {
                url += "&same_tag=true";
                url += "&selected_tag=" + selectedTags.join(',');
                tag_checked = 'checked="checked"';
            }

            // selected post types
            if(postTypeSelect && postTypes){
                url += "&select_post_types=true";
                url += "&selected_post_types=" + postTypes.join(',');
            }

            if(urlParams.wpil_no_preload && '1' === urlParams.wpil_no_preload[0]){
                var checkAndButton = '<div style="margin-bottom: 30px;">' +
                        '<input style="margin-bottom: -5px;" type="checkbox" name="same_category" id="field_same_category_page" ' + category_checked + '>' +
                        '<label for="field_same_category_page">Only Show Link Suggestions in the Same Category as This Post</label> <br>' +
                        '<input style="margin-bottom: -5px;" type="checkbox" name="same_tag" id="field_same_tag_page" ' + tag_checked + '>' +
                        '<label for="field_same_category_page">Only Show Link Suggestions with the Same Tag as This Post</label> <br>' +
                    '</div>' +
                    '<button id="inbound_suggestions_button" class="sync_linking_keywords_list button-primary" data-id="' + post_id + '" data-type="inbound_suggestions_page_container" data-page="inbound">Custom links</button>';
                container.html(checkAndButton);
            }else{
                container.html('<div class="progress_panel loader"><div class="progress_count" style="width: 100%"></div></div>');
            }

            if(urlParams.type && 'outbound_suggestions_ajax' === urlParams.type[0]){
                ajaxGetSuggestionsOutbound(container, url, 0);
            }else if(urlParams.type && 'inbound_suggestions_page_container' === urlParams.type[0]){
                ajaxGetSuggestionsInbound(container, url, 0);
            }

            same_category_loading = false;
        }
    });

    $(document).on('change', '#field_link_orphaned, #field_same_parent, #field_same_category, #field_same_tag, #field_select_post_types, select[name="wpil_selected_category"], select[name="wpil_selected_tag"], select[name="selected_post_types"], .wpil-suggestions-can-be-regenerated', function(){
        var inputs = $('.wpil-suggestion-input');
        var changed = false;
        inputs.each(function(index, element){
            var el = $(element);
            var initial = el.data('suggestion-input-initial-value');
            if(el.is("input") && el.attr('type') === 'checkbox' && el.is(":checked") != initial){
                changed = true;
            }else if(el.is("input") && el.attr('type') === 'hidden' && el.val() !== initial){
                changed = true;
            }else if(el.is("select") && initial.toString() !== el.val().join(',')){
                changed = true;
            }
        });

        if(changed){
            $('#wpil-regenerate-suggestions').removeClass('disabled').prop('disabled', false);
        }else{
            $('#wpil-regenerate-suggestions').addClass('disabled').prop('disabled', true);
        }
    });

    $(document).on('change', '#field_select_post_types,#field_same_tag,#field_same_category', function(){
        var name = $(this).attr('name');
        if($(this).is(":checked")){
            $('.best_keywords .select2, #wpil-inbound-suggestions-head-controls .' + name + '-aux .select2, .' + name + '-aux').css({'display': 'inline-block'});
        }else{
            $('.best_keywords .select2, #wpil-inbound-suggestions-head-controls .' + name + '-aux .select2, .' + name + '-aux').css({'display': 'none'});
        }
    });

    $(document).on('change', 'input[name="wpil_sitemap_embedding_relatedness_threshold"],input[name="ai_relatedness_threshold"]', function(){
        var level = $(this).val();
        $('.wpil-embedding-relatedness-threshold').text((parseFloat((level) * 100).toPrecision(3)) + '%');
    });

    /*
    $(document).on('change', '#field_same_category_page', function(){
        var url = document.URL;
        if ($(this).prop('checked')) {
            url += "&same_category=true";
        } else {
            url = url.replace('/&same_category=true/g', '');
        }

        location.href = url;
    });
*/

    $(document).on('click', '.sync_linking_keywords_list', function (e) {
        e.preventDefault();

        var page = $(this).data('page');
        var links = [];
        var data = [];
        var button = $(this);

        if(page == 'inbound'){
            $(this).parents('.tbl-link-reports').find('.wpil-inbound-links').find('[wpil-link-new][type=checkbox]:checked').each(function() {
                var item = {};
                item.id = $(this).closest('tr').find('.sentence').data('id');
                item.type = $(this).closest('tr').find('.sentence').data('type');
                item.links = [{
                    'sentence': $(this).closest('tr').find('.sentence').find('[name="sentence"]').val(),
                    'sentence_with_anchor': $(this).closest('tr').find('.wpil_sentence_with_anchor').html(),
                    'custom_sentence': $(this).closest('tr').find('input[name="custom_sentence"]').val()
                }];
                data.push(item);
            });

        }else{
            $(this).closest('div:not(#wpil-inbound-suggestions-head-controls)').find('[wpil-link-new][type=checkbox]:checked').each(function() {
                if ($(this).closest('tr').find('input[type="radio"]:checked').length) {
                    var id =  $(this).closest('tr').find('input[type="radio"]:checked').data('id');
                    var type = $(this).closest('tr').find('input[type="radio"]:checked').data('type');
                    var custom_link = $(this).closest('tr').find('input[type="radio"]:checked').data('custom');
                    var post_origin = $(this).closest('tr').find('input[type="radio"]:checked').data('post-origin');
                    var site_url = $(this).closest('tr').find('input[type="radio"]:checked').data('site-url');
                } else {
                    var id =  $(this).closest('tr').find('.suggestion').data('id');
                    var type =  $(this).closest('tr').find('.suggestion').data('type');
                    var custom_link =  $(this).closest('tr').find('.suggestion').data('custom');
                    var post_origin = $(this).closest('tr').find('.suggestion').data('post-origin');
                    var site_url = $(this).closest('tr').find('.suggestion').data('site-url');
                }

                links.push({
                    id: id,
                    type: type,
                    custom_link: custom_link,
                    post_origin: post_origin,
                    site_url: site_url,
                    sentence: $(this).closest('div').find('[name="sentence"]').val(),
                    sentence_with_anchor: $(this).closest('div').find('.wpil_sentence_with_anchor').html(),
                    custom_sentence: $(this).closest('.sentence').find('input[name="custom_sentence"]').val()
                });
            });
        }

        if (page == 'outbound') {
            data.push({'links': links});
        }else{
            button.addClass('wpil_button_is_active');
        }

        $('.wpil_keywords_list, .tbl-link-reports .wp-list-table').addClass('ajax_loader');

        var data_post = {
            "id": $(this).data('id'),
            "type": $(this).data('type'),
            "page": $(this).data('page'),
            "action": 'wpil_save_linking_references',
            'data': data,
            'gutenberg' : $('.block-editor-page').length ? true : false
        };

        $.ajax({
            url: ajaxurl,
            dataType: 'json',
            data: data_post,
            method: 'post',
            error: function (jqXHR, textStatus, errorThrown) {
                var wrapper = document.createElement('div');
                $(wrapper).append('<strong>' + textStatus + '</strong><br>');
                $(wrapper).append(jqXHR.responseText);
                wpil_swal({"title": "Error", "content": wrapper, "icon": "error"});

                $('.wpil_keywords_list, .tbl-link-reports .wp-list-table').removeClass('ajax_loader');
            },
            success: function (data) {

                if(!isJSON(data)){
                    data = extractAndValidateJSON(data, ['err_msg', 'further_processing', 'data']);
                }

                if (data.err_msg) {
                    wpil_swal('Error', data.err_msg, 'error');
                    button.removeClass('wpil_button_is_active');
                    $('.wpil_keywords_list, .tbl-link-reports .wp-list-table').removeClass('ajax_loader');
                } else if(undefined != data.further_processing && data.further_processing){
                    continueInsertingInboundLinks(button, data.data);
                }else {
                    if (page == 'outbound') {
                        if ($('.editor-post-save-draft').length) {
                            $('.editor-post-save-draft').click();
                        } else if ($('#save-post').length) {
                            $('#save-post').click();
                        } else if ($('.editor-post-publish-button').length) {
                            $('.editor-post-publish-button').click();
                        } else if ($('#publish').length) {
                            $('#publish').click();
                        } else if ($('.edit-tag-actions').length) {
                            $('.edit-tag-actions input[type="submit"]').click();
                        }

                        // set the flag so we know that the editor needs to be reloaded
                        reloadGutenberg = true;
                    } else {
                        location.reload();
                    }

                    button.removeClass('wpil_button_is_active');
                    $('.wpil_keywords_list, .tbl-link-reports .wp-list-table').removeClass('ajax_loader');
                }
            }
        })
    });

    function continueInsertingInboundLinks(button, data){
        if(!button || !data){
            return;
        }

        // go over all the datas that have been given to us and remove any Inbound Internal Suggestion Rows that are checked and not on the list
        $('.chk-keywords:checked').each(function(index, element){
            var row = $(element).parents('tr.wpil-inbound-sentence');
            var postData = row.find('div.suggestion');

            if(postData.length > 0){
                var type = postData.data('type'); // saving sanity
                var id = postData.data('id');

                if(undefined != data[type] && undefined == data[type][id]){
                    row.fadeOut(300, function(){ $(this).remove(); });
                }
            }
        });

        var ajaxData = {
            "action": 'wpil_continue_inbound_saving_process',
            "target_id": button.data('id'),
            "target_type": button.data('type'),
            'data': data
        };

        $.ajax({
            url: ajaxurl,
            dataType: 'json',
            data: ajaxData,
            method: 'post',
            error: function (jqXHR, textStatus, errorThrown) {
                var wrapper = document.createElement('div');
                $(wrapper).append('<strong>' + textStatus + '</strong><br>');
                $(wrapper).append(jqXHR.responseText);
                wpil_swal({"title": "Error", "content": wrapper, "icon": "error"});

                $('.wpil_keywords_list, .tbl-link-reports .wp-list-table').removeClass('ajax_loader');
            },
            success: function (response) {
                if(!isJSON(response)){
                    response = extractAndValidateJSON(response, ['err_msg', 'further_processing', 'data']);
                }

                if (response.err_msg) {
                    wpil_swal('Error', response.err_msg, 'error');
                    button.removeClass('wpil_button_is_active');
                    $('.wpil_keywords_list, .tbl-link-reports .wp-list-table').removeClass('ajax_loader');
                } else if(undefined != response.further_processing && response.further_processing){
                    continueInsertingInboundLinks(button, response.data);
                } else{
                    button.removeClass('wpil_button_is_active');
                    $('.wpil_keywords_list, .tbl-link-reports .wp-list-table').removeClass('ajax_loader');
                    location.reload();
                }
            }
        })
    }

    $(document).on('change', '#suggestion_filter_field', filterSuggestionsWaiter);
    $(document).on('keyup', '#suggestion_filter_field', filterSuggestionsWaiter);

    var filterSuggestionsWait = false;
    function filterSuggestionsWaiter(){
        clearTimeout(filterSuggestionsWait);
        filterSuggestionsWait = setTimeout(filterSuggestions, 500);
    }

    var filteringSuggestions = false;
    function filterSuggestions(){
        var keywords = $('#suggestion_filter_field').val();
        var inbound = ($('.wpil-inbound-links').length > 0) ? true: false;

        // exit if the suggestion table isn't currently being filtered for keywords and there are no keywords
        if(!filteringSuggestions && '' === keywords){
            return;
        }

        filteringSuggestions = true;

        // close any open editors
        var editors = $('[id^="wp-wpil_editor"][id$="-wrap"]');
        editors.each(function(index, element){
            var block = $(element).closest('.sentence');
            if(block.length > 0){
                wpil_editor_remove(block);
            }
        });

        // if there are no keywords, show all suggestions and close the dropdowns
        if(keywords === '' || keywords.trim() === ''){
            $('.wpil-active').removeClass('wpil-active');
            $('.hidden-suggestion').removeClass('hidden-suggestion');
            $('.wpil-content').css({'display':'none'});
            filteringSuggestions = false;
            return;
        }else if(keywords.length > 0){
            keywords = keywords.trim().toLowerCase().split("\n");
        }

        // go over each suggestion
        $('.wpil-inbound-links tr:not(.wpil-suggestion-table-heading), .wpil-outbound-links tr:not(.wpil-suggestion-table-heading)').each(function(index, element){
            var wrapper = $(element).find('.wpil-collapsible-wrapper');
            var visibleCount = 0;

            // if the suggested post has a dropdown selector
            if(wrapper.length > 0){
                // go over each suggestion and hide the ones without the filter words
                $(element).find('.wpil-content li').each(function(index, element2){
                    if(inbound){
                        var text = $(element2).find('.wpil_sentence_with_anchor').text().trim().toLowerCase();
                    }else{
                        var text = $(element2).find('.suggested-post-title').text().trim().toLowerCase();
                    }
                    var hasKeyword = false;
                    var hasNegativeKeyword = false;
                    var doingKeywordSearch = false;
                    var doingNegativeMatch = false;
    
                    for(var i in keywords){
                        // check if the a negative char is used
                        var negativeMatch = keywords[i].length > 1 && keywords[i].charAt(0) === '-';
    
                        if(!hasKeyword && false === negativeMatch && -1 !== text.indexOf(keywords[i])){ // if the suggestion has the keyword somewhere
                            hasKeyword = true;
                        }else if(!hasNegativeKeyword && true === negativeMatch && -1 !== text.indexOf(keywords[i].slice(1))){ // if the suggestion has a keyword the user doesn't want
                            hasNegativeKeyword = true;
                        }
    
                        if(negativeMatch){
                            doingNegativeMatch = true;
                        }else{
                            doingKeywordSearch = true;
                        }
                    }
    
                    if(	(!hasKeyword && !doingNegativeMatch) || 
                        (hasNegativeKeyword) || 
                        (doingKeywordSearch && doingNegativeMatch && !hasNegativeKeyword && !hasKeyword))
                    {
                        $(element2).addClass('hidden-suggestion');
                    }else{
                        $(element2).removeClass('hidden-suggestion');
                        visibleCount++;
                    }
                });

                var containers = $(element).find('.wpil-collapsible-wrapper, .wpil-collapsible');
                if(visibleCount === 0){
                    if($(containers[0]).hasClass('wpil-active')){ $(containers[0]).removeClass('wpil-active'); }
                    if($(containers[1]).hasClass('wpil-active')){ $(containers[1]).removeClass('wpil-active'); }
                    $(element).find('.wpil-content').css({'display':'none'});
                    $(element).addClass('hidden-suggestion');
                }else{
                    if(!$(containers[0]).hasClass('wpil-active')){ $(containers[0]).addClass('wpil-active'); }
                    if(!$(containers[1]).hasClass('wpil-active')){ $(containers[1]).addClass('wpil-active'); }
                    $(element).removeClass('hidden-suggestion');
                    $(element).find('.wpil-content').css({'display':'block'});

                    // select the top sentence and set it to be the top_level_sentence
                    if(!$(element).find('.chk-keywords').is(':checked')){
                        var firstVisible = $(element).find('.wpil-content li:not(.hidden-suggestion) input').first();
                        var id = $(firstVisible).data('id');
                        var data = $(firstVisible).closest('li').find('.data').html();

                        if(inbound){
                            $(firstVisible).closest('ul').find('input').prop('checked', false);
                            $(firstVisible).prop('checked', true);
                            $(firstVisible).closest('.wpil-collapsible-wrapper').find('.sentence').html(data + '<span class="wpil_edit_sentence">| <a href="javascript:void(0)">Edit Sentence</a></span>');
                            $(firstVisible).closest('tr').find('input[type="checkbox"]').prop('checked', false);
                            $(firstVisible).closest('tr').find('.raw_html').hide();
                            $(firstVisible).closest('tr').find('.raw_html[data-id="' + id + '"]').show();
                        }else{
                            var type = $(firstVisible).data('type');
                            var suggestion = $(firstVisible).data('suggestion');
                            var origin = $(firstVisible).data('post-origin');
                            var siteUrl = $(firstVisible).data('site-url');

                            $(firstVisible).closest('ul').find('input').prop('checked', false);

                            $(firstVisible).prop('checked', true);
                            $(firstVisible).closest('.wpil-collapsible-wrapper').find('.wpil-collapsible-static').html('<div data-id="' + id + '" data-type="' + type + '" data-post-origin="' + origin + '" data-site-url="' + siteUrl + '">' + data + '<span class="add_custom_link_button link-form-button"> | <a href="javascript:void(0)">Custom Link</a></span><span class="wpil_add_link_to_ignore link-form-button"> | <a href="javascript:void(0)">Ignore Link</a></span></div>');
                            $(firstVisible).closest('tr').find('input[type="checkbox"]').prop('checked', false);
                            $(firstVisible).closest('tr').find('input[type="checkbox"]').val(suggestion + ',' + id);

                            if (!$(firstVisible).closest('tr').find('input[data-wpil-custom-anchor]').length && $(firstVisible).closest('tr').find('.sentence[data-id="'+id+'"][data-type="'+type+'"]').length) {
                                $(firstVisible).closest('tr').find('.sentences > div').hide();
                                $(firstVisible).closest('tr').find('.sentence[data-id="'+id+'"][data-type="'+type+'"]').show();
                            }
                        };
                    }
                }
            }else{
                if(inbound){
                    var text = $(element).find('.wpil_sentence_with_anchor').text().trim().toLowerCase();
                }else{
                    var text = $(element).find('.suggested-post-title').text().trim().toLowerCase();
                }
                var hasKeyword = false;
                var hasNegativeKeyword = false;
                var doingKeywordSearch = false;
                var doingNegativeMatch = false;

                for(var i in keywords){
                    // check if the a negative char is used
                    var negativeMatch = keywords[i].length > 1 && keywords[i].charAt(0) === '-';

                    if(!hasKeyword && false === negativeMatch && -1 !== text.indexOf(keywords[i])){ // if the suggestion has the keyword somewhere
                        hasKeyword = true;
                    }else if(!hasNegativeKeyword && true === negativeMatch && -1 !== text.indexOf(keywords[i].slice(1))){ // if the suggestion has a keyword the user doesn't want
                        hasNegativeKeyword = true;
                    }

                    if(negativeMatch){
                        doingNegativeMatch = true;
                    }else{
                        doingKeywordSearch = true;
                    }
                }

                if(	(!hasKeyword && !doingNegativeMatch) || 
                    (hasNegativeKeyword) || 
                    (doingKeywordSearch && doingNegativeMatch && !hasNegativeKeyword && !hasKeyword))
                {
                    $(element).addClass('hidden-suggestion');
                }else{
                    $(element).removeClass('hidden-suggestion');
                }
            }
        });
    }

    $(document).on('change', '#field_ai_relatedness_threshold', filterSuggestionsAiRelatedWaiter);
    $(document).on('keyup', '#field_ai_relatedness_threshold', filterSuggestionsAiRelatedWaiter);

    var filterSuggestionsAiRelatedWait = false;
    function filterSuggestionsAiRelatedWaiter(){
        clearTimeout(filterSuggestionsAiRelatedWait);
        filterSuggestionsAiRelatedWait = setTimeout(filterSuggestionsAiRelated, 500);
    }

    var filteringSuggestions = false;
    function filterSuggestionsAiRelated(){
        var relatedness = $('#field_ai_relatedness_threshold').val();
        var inbound = ($('.wpil-inbound-links').length > 0) ? true: false;

        // exit if the suggestion table isn't currently being filtered for keywords and there are no keywords
        if(!filteringSuggestions && '0' === relatedness){
            return;
        }

        filteringSuggestions = true;

        // close any open editors
        var editors = $('[id^="wp-wpil_editor"][id$="-wrap"]');
        editors.each(function(index, element){
            var block = $(element).closest('.sentence');
            if(block.length > 0){
                wpil_editor_remove(block);
            }
        });

        // if there are no keywords, show all suggestions and close the dropdowns
        if(relatedness === '0'){
            $('.wpil-active').removeClass('wpil-active');
            $('.hidden-suggestion').removeClass('hidden-suggestion');
            $('.wpil-content').css({'display':'none'});
            filteringSuggestions = false;
            return;
        }

        // go over each suggestion
        $('.wpil-inbound-links tr:not(.wpil-suggestion-table-heading), .wpil-outbound-links tr:not(.wpil-suggestion-table-heading)').each(function(index, element){
            var wrapper = $(element).find('.wpil-collapsible-wrapper');
            var visibleCount = 0;

            // if the suggested post has a dropdown selector
            if(wrapper.length > 0){
                // go over each suggestion and hide the ones that aren't related enough
                $(element).find('.wpil-content li').each(function(index, element2){
                    if(inbound){
                        var elementRelatedness = $(element2).find('[name="ai_relatedness_score"]').val();
                    }else{
                        var elementRelatedness = $(element2).data('wpil-ai-relatedness-score');
                    }
    
                    if(elementRelatedness < relatedness)
                    {
                        $(element2).addClass('hidden-suggestion');
                    }else{
                        $(element2).removeClass('hidden-suggestion');
                        visibleCount++;
                    }
                });

                var containers = $(element).find('.wpil-collapsible-wrapper, .wpil-collapsible');
                if(visibleCount === 0){
                    if($(containers[0]).hasClass('wpil-active')){ $(containers[0]).removeClass('wpil-active'); }
                    if($(containers[1]).hasClass('wpil-active')){ $(containers[1]).removeClass('wpil-active'); }
                    $(element).find('.wpil-content').css({'display':'none'});
                    $(element).addClass('hidden-suggestion');
                }else{
                    if(!$(containers[0]).hasClass('wpil-active')){ $(containers[0]).addClass('wpil-active'); }
                    if(!$(containers[1]).hasClass('wpil-active')){ $(containers[1]).addClass('wpil-active'); }
                    $(element).removeClass('hidden-suggestion');
                    $(element).find('.wpil-content').css({'display':'block'});

                    // select the top sentence and set it to be the top_level_sentence
                    if(!$(element).find('.chk-keywords').is(':checked')){
                        var firstVisible = $(element).find('.wpil-content li:not(.hidden-suggestion) input').first();
                        var id = $(firstVisible).data('id');
                        var data = $(firstVisible).closest('li').find('.data').html();

                        if(inbound){
                            $(firstVisible).closest('ul').find('input').prop('checked', false);
                            $(firstVisible).prop('checked', true);
                            $(firstVisible).closest('.wpil-collapsible-wrapper').find('.sentence').html(data + '<span class="wpil_edit_sentence">| <a href="javascript:void(0)">Edit Sentence</a></span>');
                            $(firstVisible).closest('tr').find('input[type="checkbox"]').prop('checked', false);
                            $(firstVisible).closest('tr').find('.raw_html').hide();
                            $(firstVisible).closest('tr').find('.raw_html[data-id="' + id + '"]').show();
                        }else{
                            var type = $(firstVisible).data('type');
                            var suggestion = $(firstVisible).data('suggestion');
                            var origin = $(firstVisible).data('post-origin');
                            var siteUrl = $(firstVisible).data('site-url');

                            $(firstVisible).closest('ul').find('input').prop('checked', false);

                            $(firstVisible).prop('checked', true);
                            $(firstVisible).closest('.wpil-collapsible-wrapper').find('.wpil-collapsible-static').html('<div data-id="' + id + '" data-type="' + type + '" data-post-origin="' + origin + '" data-site-url="' + siteUrl + '">' + data + '<span class="add_custom_link_button link-form-button"> | <a href="javascript:void(0)">Custom Link</a></span><span class="wpil_add_link_to_ignore link-form-button"> | <a href="javascript:void(0)">Ignore Link</a></span></div>');
                            $(firstVisible).closest('tr').find('input[type="checkbox"]').prop('checked', false);
                            $(firstVisible).closest('tr').find('input[type="checkbox"]').val(suggestion + ',' + id);

                            if (!$(firstVisible).closest('tr').find('input[data-wpil-custom-anchor]').length && $(firstVisible).closest('tr').find('.sentence[data-id="'+id+'"][data-type="'+type+'"]').length) {
                                $(firstVisible).closest('tr').find('.sentences > div').hide();
                                $(firstVisible).closest('tr').find('.sentence[data-id="'+id+'"][data-type="'+type+'"]').show();
                            }
                        };
                    }
                }
            }else{
                if(inbound){
                    var elementRelatedness = $(element).find('[name="ai_relatedness_score"]').val();
                }else{
                    var elementRelatedness = $(element).find('.dated-outbound-suggestion').data('wpil-ai-relatedness-score');
                }

                if(elementRelatedness < relatedness)
                {
                    $(element).addClass('hidden-suggestion');
                }else{
                    $(element).removeClass('hidden-suggestion');
                }
            }
        });
    }

    /** Related Posts Widget Controls */
    $(document).on('keyup', '#link-whisper-related-posts-search', searchForRelatedPosts);
    var relatedPostSearchWait;
    function searchForRelatedPosts(e){
        clearTimeout(relatedPostSearchWait);
        var search = $(e.target).val();
        if(search.length > 3){
            relatedPostSearchWait = setTimeout(function(){
                ajaxSearchRelatedPosts();
            }, 750);
        }else{
            $('#link-whisper-related-posts-search-results').empty();
            $('#link-whisper-related-posts-add-posts, #link-whisper-related-posts-search-results-title').css({'display': 'none'});
            $('#link-whisper-related-posts-search-container').removeClass('searching');
        }
    }

    /**
     * Makes the request for posts and updates the related post metabox with the results
     **/
    function ajaxSearchRelatedPosts(){
        var search = $('#link-whisper-related-posts-search').val(),
            selected = $('#link-whisper-related-posts-link-list .link-whisper-related-posts-item input:checked'),
            selectedIds = [],
            nonce = $('#link-whisper-related-posts-nonce').val();

        // hide the "add posts" button when we start searching
        $('#link-whisper-related-posts-add-posts, #link-whisper-related-posts-search-results-title').css({'display': 'none'});
        // show the loader
        $('#link-whisper-related-posts-search-container').addClass('searching');

        selected.each(function(index, element){
            selectedIds.push($(element).data('post-id'));
        });

        jQuery.ajax({
            type: 'POST',
            url: ajaxurl,
            data: {
                action: 'wpil_search_related_posts',
                search: search,
                selected_ids: selectedIds,
                nonce: nonce,
            },
            error: function (jqXHR, textStatus) {
                var wrapper = document.createElement('div');
                $(wrapper).append('<strong>' + textStatus + '</strong><br>');
                $(wrapper).append(jqXHR.responseText);
                wpil_swal({"title": "Error", "content": wrapper, "icon": "error"}).then(wpil_report_next_step());
            },
            success: function(response){

                if(!isJSON(response)){
                    response = extractAndValidateJSON(response, ['success', 'error']);
                }

                // if there was an error
                if(response.error){
                    wpil_swal(response.error.title, response.error.text, 'error');
                    return;
                }
                
                if(response.success){
                    $('#link-whisper-related-posts-search-results').empty().html(response.success.content);
                    if(response.success.found > 0){
                        $('#link-whisper-related-posts-add-posts, #link-whisper-related-posts-search-results-title').css({'display': 'block'});
                    }else{
                        $('#link-whisper-related-posts-add-posts, #link-whisper-related-posts-search-results-title').css({'display': 'none'});
                    }
                }
            },
            complete: function(){
                // hide the loading animation when the search is ended
                $('#link-whisper-related-posts-search-container').removeClass('searching');
            }
        });
    }

    $(document).on('click', '#link-whisper-related-posts-add-posts', addSelectedRelatedPosts);
    function addSelectedRelatedPosts(){
        var related = $('#link-whisper-related-posts-search-results-container .link-whisper-related-posts-item input:checked').parents('li');
        if(related.length < 1){
            return;
        }

        $('#link-whisper-related-posts-link-list').append(related.detach());
        $('#link-whisper-related-posts-add-posts').addClass('disabled');
        activateSaveRelatedPostsButton();
    }

    $(document).on('change', '#link-whisper-related-posts-enable', toggleRelatedPostsActive);
    function toggleRelatedPostsActive(e){
        if($(e.target).is(':checked')){
            $('#link-whisper-related-posts-content-container').removeClass('wpil-section-disabled').removeClass('hidden');
            $('.wpil-related-posts-enable-helptext.unchecked').addClass('hidden');
            $('.wpil-related-posts-enable-helptext.checked').removeClass('hidden');
        }else{
            $('#link-whisper-related-posts-content-container').addClass('wpil-section-disabled');
            $('.wpil-related-posts-enable-helptext.checked').addClass('hidden');
            $('.wpil-related-posts-enable-helptext.unchecked').removeClass('hidden');
        }

        activateSaveRelatedPostsButton();
    }

    $(document).on('change', '#link-whisper-related-posts-search-results input:checked', toggleAddItemButton);
    function toggleAddItemButton(){
        var items = $('#link-whisper-related-posts-search-results input:checked');
        if(items.length > 0){
            $('#link-whisper-related-posts-add-posts').removeClass('disabled');
        }else{
            $('#link-whisper-related-posts-add-posts').addClass('disabled');
        }
    }

    $(document).on('change', '#link-whisper-related-posts-link-list input', activateSaveRelatedPostsButton);
    function activateSaveRelatedPostsButton(){
        $('#link-whisper-related-posts-save').removeClass('disabled');
    }

    function disableSaveRelatedPostsButton(){
        $('#link-whisper-related-posts-save').addClass('disabled');
    }

    $(document).on('click', '#link-whisper-related-posts-save', saveSelectedRelatedPosts);
    function saveSelectedRelatedPosts(){
        var	active = $('#link-whisper-related-posts-enable').is(':checked'),
            selected = $('#link-whisper-related-posts-link-list .link-whisper-related-posts-item input:checked'),
            selectedIds = [],
            postId = $('#link-whisper-related-posts-current-post').val(),
            nonce = $('#link-whisper-related-posts-nonce').val();

        selected.each(function(index, element){
            selectedIds.push($(element).data('post-id'));
        });

        jQuery.ajax({
            type: 'POST',
            url: ajaxurl,
            data: {
                action: 'wpil_save_related_posts',
                active: active,
                post_id: postId,
                selected_ids: selectedIds,
                nonce: nonce,
            },
            error: function (jqXHR, textStatus) {
                var wrapper = document.createElement('div');
                $(wrapper).append('<strong>' + textStatus + '</strong><br>');
                $(wrapper).append(jqXHR.responseText);
                wpil_swal({"title": "Error", "content": wrapper, "icon": "error"}).then(wpil_report_next_step());
            },
            success: function(response){
                if(!isJSON(response)){
                    response = extractAndValidateJSON(response, ['error']);
                }

                // if there was an error
                if(response.error){
                    wpil_swal(response.error.title, response.error.text, 'error');
                    return;
                }

                // remove any unchecked posts from the Related Posts box
                $('#link-whisper-related-posts-link-list .link-whisper-related-posts-item input').not(':checked').parents('li.link-whisper-related-posts-item').remove();
                // deactivate the save button
                disableSaveRelatedPostsButton();
            }
        });
    }



    /** /Related Posts Widget Controls */


    function stristr(haystack, needle, bool)
    {
        // http://jsphp.co/jsphp/fn/view/stristr
        // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   bugfxied by: Onno Marsman
        // *     example 1: stristr('Kevin van Zonneveld', 'Van');
        // *     returns 1: 'van Zonneveld'
        // *     example 2: stristr('Kevin van Zonneveld', 'VAN', true);
        // *     returns 2: 'Kevin '
        var pos = 0;

        haystack += '';
        pos = haystack.toLowerCase().indexOf((needle + '').toLowerCase());

        if (pos == -1) {
            return false;
        } else {
            if (bool) {
                return haystack.substr(0, pos);
            } else {
                return haystack.slice(pos);
            }
        }
    }

    function wpil_handle_errors(resp)
    {
        if (stristr(resp, "520") && stristr(resp, "unknown error") && stristr(resp, "Cloudflare")) {
            wpil_swal('Error', "It seems you are using CloudFlare and CloudFlare is hiding some error message. Please temporary disable CloudFlare, open reporting page again, look if it has any new errors and send it to us", 'error')
                .then(wpil_report_next_step);
            return true;
        }

        if (stristr(resp, "504") && stristr(resp, "gateway")) {
            wpil_swal('Error', "504 error: Gateway timeout - please ask your hosting support about this error", 'error')
                .then(wpil_report_next_step);
            return true;
        }

        return false;
    }

    function wpil_report_next_step()
    {
        location.reload();
    }

    /**
     * Makes the call to reset the report data when the user clicks on the "Reset Data" button.
     **/
    function resetReportData(e){
        e.preventDefault();
        var form = $(this);
        var nonce = form.find('[name="reset_data_nonce"]').val();
    
        if(!nonce || form.attr('disabled')){
            return;
        }
        
        // disable the reset button
        form.attr('disabled', true);
        // add a color change to the button indicate it's disabled
        form.find('button.button-primary').addClass('wpil_button_is_active');
        processReportReset(nonce, 0, true);
    }

    /**
     * Makes the call to reset the report data when the user clicks on the "Reset Data" button.
     **/
    function resumeReportData(e){
        e.preventDefault();

        var form = $(this).parents('form');
        var nonce = form.find('[name="reset_data_nonce"]').val();

        if(!nonce || form.attr('disabled')){
            return;
        }

        // disable the reset button
        form.attr('disabled', true);
        // add a color change to the button indicate it's disabled
        $(this).addClass('wpil_button_is_active');
        // and hide the "New Link Scan" button
        form.find('button.button-primary').css({'opacity': '0.3'});
        processReportData(nonce, 0, 0, 0, 0, false, false, 0, true);
    }

    var timeList = [];    
    function processReportReset(nonce = null, loopCount = 0, clearData = false){
        if(!nonce){
            return;
        }

        jQuery.ajax({
            type: 'POST',
            url: ajaxurl,
            data: {
                action: 'reset_report_data',
                nonce: nonce,
                loop_count: loopCount,
                clear_data: clearData,
            },
            error: function (jqXHR, textStatus) {
                var resp = jqXHR.responseText;

                if (wpil_handle_errors(resp)) {
                    wpil_report_next_step();
                    return;
                }

                var wrapper = document.createElement('div');
                $(wrapper).append('<strong>' + textStatus + '</strong><br>');
                $(wrapper).append(jqXHR.responseText);
                wpil_swal({"title": "Error", "content": wrapper, "icon": "error"}).then(wpil_report_next_step());
            },
            success: function(response){
                if(!isJSON(response)){
                    response = extractAndValidateJSON(response, ['error', 'links_to_process_count', 'data_setup_complete', 'loop_count', 'loading_screen', 'nonce', 'time']);
                }

                // if there was an error
                if(response.error){
                    wpil_swal(response.error.title, response.error.text, 'error');
                    return;
                }
                
                // if we've been around a couple times without processing links, there must have been an error
                if(!response.links_to_process_count && response.loop_count > 5){
                    wpil_swal('Data Reset Error', 'Link Whisper has tried a number of times to reset the report data, and it hasn\'t been able to complete the action.', 'error');
                    return;
                }

                // if the data has been successfully reset
                if(response.data_setup_complete){
                    // set the loading screen now that the data setup is complete
                    if(response.loading_screen){
                        $('#wpbody-content').html(response.loading_screen);
                    }
                    // set the time
                    timeList.push(response.time);
                    // and call the data processing function to handle the data
                    processReportData(response.nonce, 0, 0, 0);
                }else{
                    // if we're not done processing links, go around again
                    processReportReset(response.nonce, (response.loop_count + 1), true);
                }
            }
        });
    }

    // listen for clicks on the "Reset Data" button
    $('#wpil_report_reset_data_form').on('submit', resetReportData);

    // also listen for when the user wants to resume an existing scan
    $('#wpil_report_reset_data_form .wpil-resume-link-scan').on('click', resumeReportData);

    /**
     * Keeps track of the loop's progress in a global context so the scan is less susceptible to minor errors like timeouts
     **/
    var globalScan = {
        'nonce': '', 						// nonce
        'loop': 0, 							// loop count
        'link_posts_to_process_count': 0, 	// posts/cats to process count
        'processed': 0, 					// how many have been processed so far
        'link_posts_to_process_diff': 0,	// the difference between the number of posts to process and the ones that have been processed
        'meta_filled': false, 				// if the meta processing is complete
        'links_filled': false,				// if the link processing is complete
        'error_count': 0,					// the number of times the scan has errored
        'loops_unchanged': 0				// the number of loops we've gone over without a change in the total number of processed posts
    };

    /**
     * Process runner that handles the report data generation process.
     * Loops around until all the site's links are inserted into the LW link table
     **/
    function processReportData(	nonce = null, 
                                loopCount = 0, 
                                linkPostsToProcessCount = 0, 
                                linkPostsProcessed = 0, 
                                linkPostProcessDiff = 0,
                                metaFilled = false, 
                                linksFilled = false,
                                loopsUnchanged = 0,
                                resumeScan = false)
    {
        if(!nonce){
            return;
        }

        // initialize the stage clock. // The clock is useful for debugging
        if(loopCount < 1){
            if(timeList.length > 0){
                var lastTime = timeList.pop();
                timeList = [lastTime];
            }else{
                timeList = [];
            }
        }

        jQuery.ajax({
            type: 'POST',
            url: ajaxurl,
            data: {
                action: 'process_report_data',
                nonce: nonce,
                loop_count: loopCount,
                link_posts_to_process_count: linkPostsToProcessCount,
                link_posts_processed: linkPostsProcessed,
                link_posts_to_process_diff: linkPostProcessDiff,
                meta_filled: metaFilled,
                links_filled: linksFilled,
                loops_unchanged: loopsUnchanged,
                resume_scan: (resumeScan) ? 1: 0 
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('There has been an error during the scan!');
                console.log(globalScan);
                globalScan.error_count += 1;

                // if the scan has errored less than 5 times, try it again
                if(globalScan.error_count < 5){
                    processReportData(
                        globalScan.nonce,
                        globalScan.loop,
                        globalScan.link_posts_to_process_count,
                        globalScan.processed,
                        globalScan.link_posts_to_process_diff,
                        globalScan.meta_filled,
                        globalScan.links_filled,
                        globalScan.loops_unchanged
                    );
                }else{
                    var resp = jqXHR.responseText;
                    if (wpil_handle_errors(resp)) {
                        wpil_report_next_step();
                        return;
                    }

                    var wrapper = document.createElement('div');
                    $(wrapper).append('<strong>' + textStatus + '</strong><br>');
                    $(wrapper).append(jqXHR.responseText);
                    wpil_swal({"title": "Error", "content": wrapper, "icon": "error"}).then(wpil_report_next_step());
                }
            },
            success: function(response){
                console.log(response);

                if(!isJSON(response)){
                    response = extractAndValidateJSON(response, [
                        'error', 
                        'links_to_process_count', 
                        'data_setup_complete', 
                        'loop_count', 
                        'loading_screen',
                        'processed',
                        'meta_filled',
                        'links_filled',
                        'error_count',
                        'loops_unchanged',
                        'processing_complete',
                        'nonce', 
                        'time']);
                }

                // if there was an error
                if(response.error){
                    // output the error message
                    wpil_swal(response.error.title, response.error.text, 'error');
                    // and exit
                    return;
                }

                // log the time
                timeList.push(response.time);

                // update the global stats
                globalScan.nonce = response.nonce;
                globalScan.loop = 0;
                globalScan.link_posts_to_process_count = response.link_posts_to_process_count;
                globalScan.processed = response.link_posts_processed;
                globalScan.link_posts_to_process_diff = response.link_posts_to_process_diff;
                globalScan.meta_filled = response.meta_filled;
                globalScan.links_filled = response.links_filled;
                globalScan.error_count = 0;
                globalScan.loops_unchanged = response.loops_unchanged;

                // if the meta has been successfully processed
                if(response.processing_complete){
                    // if the processing is complete
                    // console.log the time if available
                    if(timeList > 1){
                        console.log('The post processing took: ' + (timeList[(timeList.length - 1)] - timeList[0]) + ' seconds.');
                    }

                    // update the loading bar one more time
                    animateTheReportLoadingBar(response);

                    // if there are linked sites, show the external site processing loading page
                    if(response.loading_screen){
                        $('#wpbody-content').html(response.loading_screen);
                    }

                    // find out if there's external sites we need to get data from
                    var externalSites = $('.wpil_report_need_prepare.processing');

                    // if there are no linked sites or the site linking is disabled
                    if(externalSites.length < 1 || (0 == wpil_ajax.site_linking_enabled)){
                        // show the user the success message!
                        wpil_swal('Success!', 'The Link Scan is complete!', 'success').then(wpil_report_next_step);
                    }else{
                        // call the site updator if there are sites to update
                        processExternalSites();
                    }

                    // and exit since in either case we're done here
                    return;
                } else if(response.link_processing_complete){
                    // if we've finished loading links into the link table
                    // show the post processing loading page
                    if(response.loading_screen){
                        $('#wpbody-content').html(response.loading_screen);
                    }

                    // console.log the time if available
                    if(timeList > 1){
                        console.log('The link processing took: ' + (timeList[(timeList.length - 1)] - timeList[0]) + ' seconds.');
                    }

                    // re-call the function for the final round of processing
                    processReportData(  response.nonce,
                        0,
                        response.link_posts_to_process_count,
                        0,
                        response.link_posts_to_process_diff,
                        response.meta_filled,
                        response.links_filled,
                        response.loops_unchanged);

                } else if(response.meta_filled){
                    // show the link processing loading screen
                    if(response.loading_screen){
                        $('#wpbody-content').html(response.loading_screen);
                    }
                    // console.log the time if available
                    if(timeList > 1){
                        console.log('The meta processing took: ' + (timeList[(timeList.length - 1)] - timeList[0]) + ' seconds.');
                    }

                    // update the loading bar
                    animateTheReportLoadingBar(response);

                    // and recall the function to begin the link processing (loading the site's links into the link table)
                    processReportData(  response.nonce,                         // nonce
                        0,                                      // loop count
                        response.link_posts_to_process_count,   // posts/cats to process count
                        0,                                      // how many have been processed so far
                        response.link_posts_to_process_diff,	// what's the difference between the posts processed and the ones coming up
                        response.meta_filled,                   // if the meta processing is complete
                        response.links_filled,					// if the link processing is complete
                        response.loops_unchanged);				// how many loops have we gone through without processing posts
                } else{
                    // update the loop count
                    globalScan.loop = (response.loop_count + 1);
                    // if we're not done processing, go around again
                    processReportData(  response.nonce, 
                                        (response.loop_count + 1), 
                                        response.link_posts_to_process_count, 
                                        response.link_posts_processed,
                                        response.link_posts_to_process_diff,
                                        response.meta_filled,
                                        response.links_filled,
                                        response.loops_unchanged);
                    
                    // if the meta has been processed
                    if(response.meta_filled){
                        // update the loading bar
                        animateTheReportLoadingBar(response);
                    }
                }
            }
        });
    }

    /**
     * Processes the external sites by ajax calls
     **/
    function processExternalSites(){
        var externalSites = $('.wpil_report_need_prepare.processing').first();

        if(externalSites.length < 1){
            // show the user the success message!
            wpil_swal('Success!', 'The Link Scan is complete!', 'success').then(wpil_report_next_step);
            return;
        }

        var site = $(externalSites),
            url = site.data('linked-url'), 
            page = site.data('page'), 
            saved = site.data('saved'), 
            total = site.data('total'), 
            nonce = site.data('nonce');


        jQuery.ajax({
            type: 'POST',
            url: ajaxurl,
            data: {
                action: 'wpil_refresh_site_data',
                process_url: url,
                encoded_process_url: btoa(url),
                nonce: nonce,
                page: page,
                saved: saved,
                total: total
            },
            success: function(response){
                console.log(response);

                if(!isJSON(response)){
                    response = extractAndValidateJSON(response, ['error', 'success', 'page', 'saved', 'total']);
                }

                // if there was an error
                if(response.error){
                    // remove the processing class
                    site.removeClass('processing');
                    // make the background of the loading bar red to indicate an error
                    site.find('.progress_panel').css({'background': '#c7584d'});
                    site.find('.progress_count').css({'background': '#fd2d2d'});
                    // and add an error text
                    site.find('.wpil-loading-status').text('Processing Error');

                    // and go on to the next site
                    processExternalSites();

                    return;
                }else if(response.success){
                    // if the site is processed, update the display

                    // remove the processing class
                    site.removeClass('processing');
                    // and go on to the next site
                    processExternalSites();
                    return;
                }else if(response){
                    // if there's still posts to process in the current site

                    // update the page relavent data
                    site.data('page', response.page), 
                    site.data('saved', response.saved), 
                    site.data('total', response.total), 

                    // update the display
                    animateLinkedSiteLoadingBar(site, response);

                    // and go around again
                    processExternalSites();
                    return;
                }
            }
        });
    }


    /**
     * Updates the loading bar length and the displayed completion status.
     * 
     * A possible improvement might be to progressively update the loading bar so its more interesting.
     * As it is now, the bar jumps every 60s, so it might be a bit dull and the user might wonder if it's working.
     **/
    function animateTheReportLoadingBar(response){
        // get the loading display
        var loadingDisplay = $('#wpbody-content .wpil-loading-screen');
        // create some variable to update the display with
        var percentCompleted = Math.floor((response.link_posts_processed/response.link_posts_to_process_count) * 100);
        var displayedStatus = percentCompleted + '%' + ((response.links_filled) ? (', ' + response.link_posts_processed + '/' + response.link_posts_to_process_count) : '') + ' ' + wpil_ajax.completed;
//        var oldPercent = parseInt(loadingDisplay.find('.progress_count').css('width'));

        // update the display with the new info
        loadingDisplay.find('.wpil-loading-status').text(displayedStatus);
        loadingDisplay.find('.progress_count').css({'width': percentCompleted + '%'});
    }

    /**
     * Runs Tippy and generates the standard tooltips for a page
     **/
    function runStandardTippy(){
        var toTip = $('.wpil-tippy-tooltipped');
        if(toTip.length < 1){
            return;
        }

        toTip.each(function(index, element){
            var el = $(element);
            if(el.data('wpilTooltipContent')){
                var args = {
                    content: el.data('wpilTooltipContent'),
                    onShow(instance){
                        var target = $(instance.reference);
                        if(target.attr('data-wpil-tooltip-theme') === 'delete-post'){
                            target.parents('span.delete').css({'display': 'inline-block', 'margin-right': '4px'});
                        }
                    }
                };

                if(el.data('wpilTooltipInteractive')){
                    args['interactive'] = true;
                }

                if(el.data('wpilTooltipAllowhtml')){
                    args['allowHTML'] = true;
                }

                if(el.data('wpilTooltipMaxwidth')){
                    args['maxWidth'] = parseInt(el.data('wpilTooltipMaxwidth'));
                }

                if(el.data('wpilTooltipTheme')){
                    args['theme'] = el.data('wpilTooltipTheme');
                }

                tippy(element, args);
            }
        });
    }

    /**
     * Updates the loading bars for linked sites during the link scan.
     * Increases the length of the loading bars and the text content contained in the bar as the data is downloaded.
     * 
     **/
    function animateLinkedSiteLoadingBar(site, response){
        // create some variables to update the display with
        var percentCompleted = Math.floor((response.saved/response.total) * 100);
        var displayedStatus = percentCompleted + '%' + ((response.saved) ? (', ' + response.saved + '/' + response.total) : '');

        // update the display with the new info
        site.find('.wpil-loading-status').text(displayedStatus);
        site.find('.progress_count').css({'width': percentCompleted + '%'});
    }

    $(document).on('click', '.wpil-collapsible', function (e) {
        if ($(this).hasClass('wpil-no-action') ||
            $(e.target).hasClass('wpil_word') || 
            $(e.target).hasClass('add-internal-links') ||
            $(e.target).hasClass('add-outbound-internal-links') ||
            $(e.target).hasClass('add_custom_link_button') ||
            $(e.target).hasClass('add_custom_link') || 
            $(e.target).parents('.add_custom_link').length || 
            $(this).find('.custom-link-wrapper').length > 0 || 
            $(this).find('.wp-editor-wrap').length > 0 ||
            $(e.target).hasClass('wpil-reload-sentence-with-anchor') ||
            $(e.target).hasClass('button-primary') ||
            $(e.target).hasClass('button-secondary') ||
            $(e.target).parent().hasClass('wpil_edit_sentence')
        ) 
        {
            return;
        }

        // exit if the user clicked the "Add" button in the link report
        if($(e.srcElement).hasClass('add-internal-links') || $(e.srcElement).hasClass('add-outbound-internal-links')){
            return;
        }
        e.preventDefault();

        var $el = $(this);
        var $content = $el.closest('.wpil-collapsible-wrapper').find('.wpil-content');
        var cl_active = 'wpil-active';
        var wrapper = $el.parents('.wpil-collapsible-wrapper');

        if ($el.hasClass(cl_active)) {
            $el.removeClass(cl_active);
            wrapper.removeClass(cl_active);
            $content.hide();
        } else {
            // if this is the link report or target keyword report or autolink table or the domains table
            if($('.tbl-link-reports').length || $('#wpil_target_keyword_table').length || $('#wpil_keywords_table').length || $('#report_domains').length){
                // hide any open dropdowns in the same row
                $(this).closest('tr').find('td .wpil-collapsible').removeClass('wpil-active');
                $(this).closest('tr').find('td .wpil-collapsible-wrapper').removeClass('wpil-active');
                $(this).closest('tr').find('td .wpil-collapsible-wrapper').find('.wpil-content').hide();
            }
            $el.addClass(cl_active);
            wrapper.addClass(cl_active);
            $content.show();
        }
    });

    $(document).on('click', '#select_all', function () {
        if ($(this).prop('checked')) {
            if ($('.best_keywords').hasClass('outbound')) {
                $(this).closest('table').find('.sentence:visible input[type="checkbox"].chk-keywords:visible').prop('checked', true);
            } else {
                $(this).closest('table').find('input[type="checkbox"].chk-keywords:visible').prop('checked', true);
            }

            $('.suggestion-select-all').prop('checked', true);
        } else {
            $(this).closest('table').find('input[type="checkbox"].chk-keywords').prop('checked', false);
            $('.suggestion-select-all').prop('checked', false);
        }
    });

    $(document).on('click', '.best_keywords.outbound .wpil-collapsible-wrapper input[type="radio"]', function () {
        var id = $(this).data('id');
        var data = $(this).closest('li').find('.data').html();
        var type = $(this).data('type');
        var suggestion = $(this).data('suggestion');
        var origin = $(this).data('post-origin');
        var siteUrl = $(this).data('site-url');

        var additionalData = [
            'data-wpil-post-published-date="' + $(this).data('wpil-post-published-date') + '"',
            'data-wpil-suggestion-score="' + $(this).data('wpil-suggestion-score') + '"',
            'data-wpil-inbound-internal-links="' + $(this).data('wpil-inbound-internal-links') + '"',
            'data-wpil-outbound-internal-links="' + $(this).data('wpil-outbound-internal-links') + '"',
            'data-wpil-outbound-external-links="' + $(this).data('wpil-outbound-external-links') + '"',
            'data-wpil-ai-relatedness-score="' + $(this).data('wpil-ai-relatedness-score') + '"',
        ];

        $(this).closest('ul').find('input').prop('checked', false);

        $(this).prop('checked', true);
        $(this).closest('.wpil-collapsible-wrapper').find('.wpil-collapsible-static').html('<div data-id="' + id + '" data-type="' + type + '" data-post-origin="' + origin + '" data-site-url="' + siteUrl + '" ' + additionalData.join(' ') + '>' + data + '<span class="add_custom_link_button link-form-button"> | <a href="javascript:void(0)">Custom Link</a></span><span class="wpil_add_link_to_ignore link-form-button"> | <a href="javascript:void(0)">Ignore Link</a></span></div>');
        $(this).closest('tr').find('input[type="checkbox"]').prop('checked', false);
        $(this).closest('tr').find('input[type="checkbox"]').val(suggestion + ',' + id);

        if (!$(this).closest('tr').find('input[data-wpil-custom-anchor]').length && $(this).closest('tr').find('.sentence[data-id="'+id+'"][data-type="'+type+'"]').length) {
            $(this).closest('tr').find('.sentences > div').hide();
            $(this).closest('tr').find('.sentence[data-id="'+id+'"][data-type="'+type+'"]').show();
        }
    });

    $(document).on('click', '.best_keywords.inbound .wpil-collapsible-wrapper input[type="radio"]', function () {
        var id = $(this).data('id');
        var data = $(this).closest('li').find('.data').html();
        $(this).closest('ul').find('input').prop('checked', false);
        $(this).prop('checked', true);
        $(this).closest('.wpil-collapsible-wrapper').find('.sentence').html(data + '<span class="wpil_edit_sentence">| <a href="javascript:void(0)">Edit Sentence</a></span>');
        $(this).closest('tr').find('input[type="checkbox"]').prop('checked', false);
        $(this).closest('tr').find('.raw_html').hide();
        $(this).closest('tr').find('.raw_html[data-id="' + id + '"]').show();
    });

    $(document).on('click', '.best_keywords input[type="checkbox"]', function () {
        return;
        if ($(this).prop('checked')) {
            if ($('.best_keywords').hasClass('outbound')) {
                var checked = $('.best_keywords .sentence:visible input[type="checkbox"].chk-keywords:checked');
            } else {
                var checked = $('.best_keywords input[type="checkbox"].chk-keywords:checked');
            }
            if (checked.length > 50) {
                checked = checked.slice(50);
                console.log(checked);
                checked.each(function(){
                    $(this).prop('checked', false);
                });
                wpil_swal('Warning', 'You can choose only 50 links', 'warning');
            }
        }

    });

    /**
     * Asks the user if they want to consign a post to the trash when they click the "Trash Post" button
     **/
    $(document).on('click', '.wpil-trash-post-link', function (e) {
        e.preventDefault();

        var rowItem = $(this),
            trashLink = rowItem.attr('href');

        if(trashLink.length < 1){
            return;
        }

        if ((wpil_ajax.dismissed_popups && wpil_ajax.dismissed_popups['link_report_trash_post'] !== 1)) {
            var popupWrapper = document.createElement('div');
            $(popupWrapper).append('Please confirm that you want to put this page in the trash. This will remove the page from your site and put it in the trash, not just remove it from the report. <br><br> <input type="checkbox" id="wpil-perma-dismiss-popup" data-wpil-popup-name="link_report_trash_post"><span style="font-size: 12px;">(Don\'t show this again)</span>');
            wpil_swal({
                'title': 'Notice:', 
                content: popupWrapper, 
                'icon': 'info',
                buttons: {
                    cancel: true,
                    confirm: true,
                }
            }).then((trash) => {
                if (trash) {
                    rowItem.closest('tr').css({'opacity': 0.4});
                    $.post(trashLink, function(){
                        rowItem.closest('tr').fadeOut(300);
                    });
                }

                var checkbox = $('#wpil-perma-dismiss-popup');
                if(checkbox.is(':checked') && wpil_ajax.dismiss_popup_nonce){
                    $.ajax({
                        type: 'POST',
                        url: ajaxurl,
                        data: {
                            action: 'wpil_dismiss_popup_notice',
                            popup_name: checkbox.data('wpil-popup-name'),
                            nonce: wpil_ajax.dismiss_popup_nonce,
                        },
                        complete: function (data) {
                            console.log('ignoring complete!');
                            wpil_ajax.dismissed_popups['link_report_trash_post'] = 1;
                        }
                    })
                }
            });
        }else{
            rowItem.closest('tr').css({'opacity': 0.4});
            $.post(trashLink, function(){
                rowItem.closest('tr').fadeOut(300);
            });
        }
    });

    //ignore link in error reports
    $(document).on('click', '.column-url .row-actions .wpil_ignore_link', function () {
        var el = $(this);
        var parent = el.parents('.column-url');
        var data = {
            url: el.data('url'),
            anchor: el.data('anchor'),
            post_id: el.data('post_id'),
            post_type: el.data('post_type'),
            link_id: typeof el.data('link_id') !== 'undefined' ? el.data('link_id') : ''
        };

        if (el.hasClass('wpil_ignore_link')) {
            var rowParent = el.closest('tr');
        } else {
            var rowParent = el.closest('li');
        }

        parent.html('<div style="margin-left: calc(50% - 16px);" class="la-ball-clip-rotate la-md"><div></div></div>');

        $.post('admin.php?page=link_whisper&type=ignore_link', data, function(){
            rowParent.fadeOut(300);
        });
    });

    //stop ignoring link in error reports
    $(document).on('click', '.column-url .row-actions .wpil_stop_ignore_link', function () {
        var el = $(this);
        var parent = el.parents('.column-url');
        var data = {
            url: el.data('url'),
            anchor: el.data('anchor'),
            post_id: el.data('post_id'),
            post_type: el.data('post_type'),
            link_id: typeof el.data('link_id') !== 'undefined' ? el.data('link_id') : ''
        };

        if (el.hasClass('wpil_stop_ignore_link')) {
            var rowParent = el.closest('tr');
        } else {
            var rowParent = el.closest('li');
        }

        parent.html('<div style="margin-left: calc(50% - 16px);" class="la-ball-clip-rotate la-md"><div></div></div>');

        $.post('admin.php?page=link_whisper&type=stop_ignore_link', data, function(){
            rowParent.fadeOut(300);
        });
    });

    //delete link from post content
    $(document).on('click', '.wpil_link_delete', function () {
        if (confirm("Are you sure you want to delete this link? This will delete the link from the page that it\'s on.")) {
            var el = $(this);
            var data = {
                url: el.data('url'),
                anchor: el.data('anchor'),
                post_id: el.data('post_id'),
                post_type: el.data('post_type'),
                link_id: typeof el.data('link_id') !== 'undefined' ? el.data('link_id') : ''
            };

            $.post('admin.php?page=link_whisper&type=delete_link', data, function(){
                if (el.hasClass('broken_link')) {
                    el.closest('tr').fadeOut(300);
                } else {
                    el.closest('li').fadeOut(300);
                }
            });
        }
    });

    $(document).on('click', '.wpil_link_select', toggleSelectedDeleteButton);
    function toggleSelectedDeleteButton(){
        var checkedBoxes = $(this).parents('.wpil-collapsible-wrapper').find('.wpil-content .wpil_link_select:checked');
        var deleteButton = $(this).parents('.wpil-collapsible-wrapper').find('.update-post-links .wpil-delete-selected-links');
        var selectAll = $(this).parents('.wpil-collapsible-wrapper').find('.update-post-links .wpil-select-all-dropdown-links');
        if(checkedBoxes.length > 0){
            deleteButton.removeClass('disabled');
        }else{
            deleteButton.removeClass('disabled').addClass('disabled');
            selectAll.prop('checked', false);
        }
    }

    $(document).on('click', '.wpil-select-all-dropdown-links', toggleLinkSelection);
    function toggleLinkSelection(){
        var checkBoxes = $(this).parents('.wpil-collapsible-wrapper').find('.wpil-content .wpil_link_select');
        var deleteButton = $(this).parents('.update-post-links').find('.wpil-delete-selected-links');
        if($(this).is(':checked')){
            checkBoxes.prop('checked', true);
            deleteButton.removeClass('disabled');
        }else{
            checkBoxes.prop('checked', false);
            deleteButton.addClass('disabled');
        }
    }

    //delete link from post content
    $(document).on('click', '.wpil-delete-selected-links', triggerDeleteSelectedLinks);
    function triggerDeleteSelectedLinks(e){
        e.preventDefault();

        var wrapper = $(this).parents('.wpil-collapsible-wrapper');
        var checkedBoxes = wrapper.find('.wpil-content .wpil_link_select:checked');
        var button = $(this);

        if(checkedBoxes.length < 1){
            return;
        }

        if (confirm("Are you sure you want to delete the selected links? This will delete the links from the page(s) that they\'re on.")) {
            deleteSelectedLinks(checkedBoxes, wrapper, button);
        }
    }


    function deleteSelectedLinks(checkedBoxes, wrapper, button){
        if(checkedBoxes.length < 1 || wrapper.length < 1){
            return;
        }

        var links = [];
        checkedBoxes.each(function(index, element){
            var el = $(element);
            if(!el.parent().hasClass('deleting-link')){
                el.parent().addClass('deleting-link');
            }
            links.push({'post_id': el.data('post_id'), 'post_type': el.data('post_type'), 'anchor': el.data('anchor'), 'url': el.data('url')});
        });

        var data = {
            action: 'wpil_delete_selected_links',
            links: links.slice(0, 80),
            nonce: button.data('nonce')
        };

        $.ajax({
            type: 'POST',
            url: ajaxurl,
            dataType: 'json',
            data: data,
            error: function (jqXHR, textStatus, errorThrown) {
                var wrapper = document.createElement('div');
                $(wrapper).append('<strong>' + textStatus + '</strong><br>');
                $(wrapper).append(jqXHR.responseText);
                wpil_swal({"title": "Error", "content": wrapper, "icon": "error"});
            },
            success: function(response){
                console.log(response);

                if(!isJSON(response)){
                    response = extractAndValidateJSON(response, ['error', 'success', 'progress']);
                }

                if(response.error){
                    wpil_swal(response.error.title, response.error.text, 'error');
                    wrapper.find('.deleting-link').removeClass('deleting-link');
                    return;
                }

                if(response.success){
                    if ((wpil_ajax.dismissed_popups && wpil_ajax.dismissed_popups['delete_link'] !== 1)) {
                        var popupWrapper = document.createElement('div');
                        $(popupWrapper).append(response.success.text + '<br><br> <input type="checkbox" id="wpil-perma-dismiss-popup" data-wpil-popup-name="delete_link"><span style="font-size: 12px;">(Don\'t show this again)</span>');
                        wpil_swal({'title': response.success.title, content: popupWrapper, 'icon': 'success'}).then(() => {
                            var checkbox = $('#wpil-perma-dismiss-popup');
                            if(checkbox.is(':checked') && wpil_ajax.dismiss_popup_nonce){
                                $.ajax({
                                    type: 'POST',
                                    url: ajaxurl,
                                    data: {
                                        action: 'wpil_dismiss_popup_notice',
                                        popup_name: checkbox.data('wpil-popup-name'),
                                        nonce: wpil_ajax.dismiss_popup_nonce,
                                    },
                                    complete: function (data) {
                                        console.log('ignoring complete!');
                                        wpil_ajax.dismissed_popups['delete_link'] = 1;
                                    }
                                })
                            }
                        });
                    }

                    wrapper.find('.deleting-link').removeClass('deleting-link');
                    flushObjectCache();
                    return;
                }

                if(response.progress){
                    console.log(response.progress);
                    for(var i in response.progress){
                        var dat = response.progress[i];
                        for(var j in dat){
                            var search = '[data-url="' + dat[j].url + '"]';
                            search += '[data-post_id="' + dat[j].post_id + '"]';
                            search += '[data-post_type="' + dat[j].post_type + '"]';
                            search += (dat[j].anchor > 0) ? '[data-anchor="' + dat[j].anchor + '"]': '';
                            
                            var box = checkedBoxes.filter(search);
                            if(box){
                                box.parent().fadeOut(300, function(){ $(this).remove(); });
                            }
                        }
                    }

                    // recount the number of links in the dropdown!
                    setTimeout(function(){
                        var items = wrapper.find('.wpil-content .wpil_link_select'); // Todo: update the "posts" dropdown in the Domains report so that it will reflect the link deletions
                        wrapper.find('.wpil_ul').text(items.length);
                        // if there are no items left, hide the delete bar
                        if(items.length == 0){
                            wrapper.find('.update-post-links').fadeOut(300, function(){ $(this).remove(); });

                            // if this is the Domains page, hide the parent row too
                            if($('#report_domains').length > 0){
                                wrapper.parents('tr').fadeOut(300, function(){ $(this).remove(); });
                            }
                        }

                        // also, check if there's visible checked boxes
                        checkedBoxes = wrapper.find('.wpil-content .wpil_link_select:checked');

                        // if there are
                        if(checkedBoxes.length > 0){
                            // go around again
                            deleteSelectedLinks(checkedBoxes, wrapper, button);
                        }else{
                            // if there are no links, flush the cache!
                            flushObjectCache();
                        }
                    }, 500);

                }
                
            }
        });

    }

    // ignore an orphaned post from the link report
    $(document).on('click', '.wpil-ignore-orphaned-post', function (e) {
        e.preventDefault();
        var el = $(this);

        if (confirm("Are you sure you want to ignore this post on the Orphaned Posts view? It will still be visible on the Internal Links Report and you can re-add the post to the Orphaned Posts from the settings.")) {
            var el = $(this);
            var data = {
                action: 'wpil_ignore_orphaned_post',
                post_id: el.data('post-id'),
                type: el.data('type'),
                nonce: el.data('nonce')
            };
            jQuery.ajax({
                type: 'POST',
                url: ajaxurl,
                dataType: 'json',
                data: data,
                error: function (jqXHR, textStatus, errorThrown) {
                    var wrapper = document.createElement('div');
                    $(wrapper).append('<strong>' + textStatus + '</strong><br>');
                    $(wrapper).append(jqXHR.responseText);
                    wpil_swal({"title": "Error", "content": wrapper, "icon": "error"});
                },
                success: function(response){

                    if(!isJSON(response)){
                        response = extractAndValidateJSON(response, ['error', 'success']);
                    }

                    if(response.success){
                        if (el.hasClass('wpil-ignore-orphaned-post')) {
                            el.closest('tr').fadeOut(300);
                        } else {
                            el.closest('li').fadeOut(300);
                        }
                    }else if(response.error){
                        wpil_swal(response.error.title, response.error.text, 'error');
                    }
                }
            });
        }
    });

    $(document).ready(function(){
        runStandardTippy();
        var saving = false;

        if (typeof wp.data != 'undefined' && typeof wp.data.select('core/editor') != 'undefined') {
            wp.data.subscribe(function () {
                if (document.body.classList.contains( 'block-editor-page' ) && !saving && reloadGutenberg) {
                    saving = true;
                    setTimeout(function(){
                        $.post( ajaxurl, {action: 'wpil_editor_reload', post_id: $('#post_ID').val()}, function(data) {
                            if (data == 'reload') {
                                location.reload();
                            }

                            saving = false;
                            reloadGutenberg = false;
                        });
                    }, 3000);
                }
            });
        }

        if ($('#post_ID').length) {
            $.post( ajaxurl, {action: 'wpil_is_outbound_links_added', id: $('#post_ID').val(), type: 'post'}, function(data) {
                if (data == 'success' && (wpil_ajax.dismissed_popups && wpil_ajax.dismissed_popups['suggestions'] !== 1)) {
                    var wrapper = document.createElement('div');
                    $(wrapper).append('Links have been added successfully! <br><br> <input type="checkbox" id="wpil-perma-dismiss-popup" data-wpil-popup-name="suggestions"><span style="font-size: 12px;">(Don\'t show this again)</span>');
                    wpil_swal({'title': 'Success', content: wrapper, 'icon': 'success'}).then(() => {
                        var checkbox = $('#wpil-perma-dismiss-popup');
                        var nonce = (checkbox.data('wpil-popup-name') === 'suggestion') ? $('div[data-wpil-ajax-container=""]').data('wpil-suggestion-nonce'): '';
                        if(checkbox.is(':checked') && nonce){
                            $.ajax({
                                type: 'POST',
                                url: ajaxurl,
                                data: {
                                    action: 'wpil_dismiss_popup_notice',
                                    popup_name: checkbox.data('wpil-popup-name'),
                                    nonce: nonce,
                                },
                                complete: function (data) {
                                    console.log('ignoring complete!');
                                }
                            })
                        }
                    });
                }
            });
        }

        if ($('#inbound_suggestions_page').length) {
            var id  = $('#inbound_suggestions_page').data('id');
            var type  = $('#inbound_suggestions_page').data('type');

            $.post( ajaxurl, {action: 'wpil_is_inbound_links_added', id: id, type: type}, function(data) {
                if (data == 'success' && (!wpil_ajax.dismissed_popups || (wpil_ajax.dismissed_popups && wpil_ajax.dismissed_popups['suggestions'] === undefined || wpil_ajax.dismissed_popups['suggestions'] !== 1))) {
                    var popupWrapper = document.createElement('div');
                    $(popupWrapper).append('Links have been added successfully! <br><br> <input type="checkbox" id="wpil-perma-dismiss-popup" data-wpil-popup-name="suggestions"><span style="font-size: 12px;">(Don\'t show this again)</span>');
                    wpil_swal({'title': 'Success', content: popupWrapper, 'icon': 'success'}).then(() => {
                        var checkbox = $('#wpil-perma-dismiss-popup');
                        var nonce = wpil_ajax.dismiss_popup_nonce;
                        if(checkbox.is(':checked') && nonce){
                            $.ajax({
                                type: 'POST',
                                url: ajaxurl,
                                data: {
                                    action: 'wpil_dismiss_popup_notice',
                                    popup_name: checkbox.data('wpil-popup-name'),
                                    nonce: nonce,
                                },
                                complete: function (data) {
                                    console.log('ignoring complete!');
                                }
                            })
                        }
                    });
                }
            });
        }

        //show links chart in dashboard
        if ($('#wpil_links_chart').length) {
            var internal = $('input[name="internal_links_count"]').val();
            var external = $('input[name="total_links_count"]').val() - $('input[name="internal_links_count"]').val();

            $('#wpil_links_chart').jqChart({
                title: { text: '' },
                legend: {
                    title: '',
                    font: '15px sans-serif',
                    location: 'top',
                    border: {visible: false}
                },
                border: { visible: false },
                animation: { duration: 1 },
                shadows: {
                    enabled: true
                },
                series: [
                    {
                        type: 'pie',
                        fillStyles: ['#33c7fd', '#7646b0'],
                        labels: {
                            stringFormat: '%d',
                            valueType: 'dataValue',
                            font: 'bold 15px sans-serif',
                            fillStyle: 'white',
                            fontWeight: 'bold'
                        },
                        explodedRadius: 8,
                        explodedSlices: [1],
                        data: [['Internal', internal], ['External', external]],
                        labelsPosition: 'inside', // inside, outside
                        labelsAlign: 'circle', // circle, column
                        labelsExtend: 20,
                        leaderLineWidth: 1,
                        leaderLineStrokeStyle: 'black'
                    }
                ]
            });
        }

        //show links click chart in detailed click report
        if ($('#link-click-detail-chart').length) {
            
            var clickData	= JSON.parse($('input#link-click-detail-data').val());
            var range		= JSON.parse($('input#link-click-detail-data-range').val());
            var clickCount = 0;
            var dateRange = getAllDays(range.start, range.end);
            var displayData = [];

            if(clickData !== ''){
                for(var i in dateRange){
                    var date = dateRange[i];
                    if(clickData[date] !== undefined){
                        displayData.push([date, clickData[date]]);
                        clickCount += clickData[date];
                    }else{
                        displayData.push([date, 0]);
                    }
                }
            }

            $('#link-click-detail-chart').jqChart({
                title: { text: 'Clicks per day' },
                legend: {
                    title: '',
                    font: '15px sans-serif',
                    location: 'top',
                    border: {visible: false},
                    visible: false
                },
                border: { visible: false },
                animation: { duration: 1 },
                shadows: {
                    enabled: true
                },
                axes: [
                    {
                        type: 'linear',
                        location: 'left',
                        minimum: 0,
                    },
                    {
                        location: 'bottom',
                        labels: {
                            resolveOverlappingMode: 'hide'
                        },
                        majorTickMarks: {
                        },
                        minorTickMarks: {
                        }
                    },
                    {
                        location: 'bottom',
                        title: {
                            text: 'Total Clicks for Selected Range: ' + clickCount,
                            font: '16px sans-serif',
                            fillStyle: '#282828',
                        },
                        strokeStyle: '#ffffff	',
                        labels: {
                            resolveOverlappingMode: 'hide'
                        },
                        majorTickMarks: {
                        },
                        minorTickMarks: {
                        }
                    },
                ],
                series: [
                    {
                        type: 'area',
                        title: '',
                        shadows: {
                            enabled: true
                        },
//						fillStyles: ['#33c7fd', '#7646b0'],
                        lineWidth : 2,
                        fillStyle: '#2dc0fd',
                        strokeStyle:'#6b3da7',
                        markers: { 
                            size: 8, 
                            type: 'circle',
                            strokeStyle: 'black', 
                            fillStyle : '#6b3da7', 
                            lineWidth: 1 
                        },
                        labels: {
                            visible: false,
                            stringFormat: '%d',
                            valueType: 'dataValue',
                            font: 'bold 15px sans-serif',
                            fillStyle: 'transparent',
                            fontWeight: 'bold'
                        },
                        data: displayData,
                        leaderLineWidth: 1,
                        leaderLineStrokeStyle: 'black'
                    }
                ]
            });
        }

        function getAllDays(start, end) {
            var s = new Date(start);
            var e = new Date(end);
            var a = [];
        
            while(s < e) {
                a.push(moment(s).format(wpil_ajax.wpil_timepicker_format));
                s = new Date(s.setDate(
                    s.getDate() + 1
                ))
            }
        
            // add an extra day because the date range counter cuts the last day off.
            a.push(moment(s).format(wpil_ajax.wpil_timepicker_format));

            return a;
        };

    });

    $(document).on('click', '.add_custom_link_button', function(e){
        $(this).closest('div').append('<div class="custom-link-wrapper">' + 
                '<div class="add_custom_link">' +
                    '<input type="text" placeholder="Paste URL or type to search">' +
                    '<div class="links_list"></div>' +
                    '<span class="button-primary">' +
                        '<i class="mce-ico mce-i-dashicon dashicons-editor-break"></i>' +
                    '</span>' +
                '</div>' +
                '<div class="cancel_custom_link">' +
                    '<span class="button-primary">' +
                        '<i class="mce-ico mce-i-dashicon dashicons-no"></i>' +
                    '</span>' +
                '</div>' +
            '</div>');
        $(this).closest('.suggestion').find('.link-form-button').hide();
        $(this).closest('.wpil-collapsible-wrapper').find('.link-form-button').hide();
    });

    $(document).on('keyup', '.add_custom_link input[type="text"]', wpil_link_autocomplete);
    $(document).on('click', '.add_custom_link .links_list .item', wpil_link_choose);

    var wpil_link_autocomplete_timeout = null;
    var wpil_link_number = 0;
    function wpil_link_autocomplete(e) {
        var list = $(this).closest('div').find('.links_list');

        //choose variant with keyboard
        if ((e.which == 38 || e.which == 40 || e.which == 13) && list.css('display') !== 'none') {
            switch (e.which) {
                case 38:
                    wpil_link_number--;
                    if (wpil_link_number > 0) {
                        list.find('.item').removeClass('active');
                        list.find('.item:nth-child(' + wpil_link_number + ')').addClass('active')
                    }
                    break;
                case 40:
                    wpil_link_number++;
                    if (wpil_link_number <= list.find('.item').length) {
                        list.find('.item').removeClass('active');
                        list.find('.item:nth-child(' + wpil_link_number + ')').addClass('active')
                    }
                    break;
                case 13:
                    if (list.find('.item.active').length) {
                        var url = list.find('.item.active').data('url');
                        list.closest('.add_custom_link').find('input[type="text"]').val(url);
                        list.html('').hide();
                        wpil_link_number = 0;
                    }
                    break;
            }
        } else {
            //search posts
            var search = $(this).val();
            if ($('#_ajax_linking_nonce').length && search.length) {
                var nonce = $('#_ajax_linking_nonce').val();
                clearTimeout(wpil_link_autocomplete_timeout);
                wpil_link_autocomplete_timeout = setTimeout(function(){
                    $.post(ajaxurl, {
                        page: 1,
                        search: search,
                        action: 'wp-link-ajax',
                        _ajax_linking_nonce: nonce,
                        'wpil_custom_link_search': 1
                    }, function (response) {
                        list.html('');
                        response = jQuery.parseJSON(response);
                        for (var item of response) {
                            list.append('<div class="item" data-url="' + item.permalink + '"><div class="title">' + item.title + '</div><div class="date">' + item.info + '</div></div>');
                        }
                        list.show();
                        wpil_link_number = 0;
                    });
                }, 500);
            }
        }
    }

    function wpil_link_choose() {
        var url = $(this).data('url');
        $(this).closest('.add_custom_link').find('input[type="text"]').val(url);
        $(this).closest('.links_list').html('').hide();
    }

    $(document).on('click', '.add_custom_link span', function(){
        var el = $(this),
            link = el.parents('.add_custom_link').find('input').val(),
            nonce = $('[data-wpil-ajax-container]').data('wpil-suggestion-nonce');

        if (link) {
            $.post(
                ajaxurl, 
                {
                    action: 'wpil_get_link_title',
                    link: link,
                    nonce: nonce
                }, function (response) {
                    if(!isJSON(response)){
                        response = extractAndValidateJSON(response, ['error', 'title', 'id', 'type', 'link']);
                    }

                    if(response && undefined !== response.error){
                        wpil_swal(response.error.title, response.error.text, 'error');
                        return;
                    }

                    if (!el.parents('.wpil-collapsible-wrapper').length) {
                        var suggestion = el.closest('.suggestion');
                        suggestion.html(response.title + '<br><a class="post-slug" target="_blank" href="'+link+'">'+response.link+'</a>' +
                            '<span class="add_custom_link_button link-form-button"> | <a href="javascript:void(0)">Custom Link</a></span>');
                        suggestion.data('id', response.id);
                        suggestion.data('type', response.type);
                        suggestion.data('custom', response.link);
                    } else {
                        var wrapper = el.closest('.wpil-collapsible-wrapper');
                        wrapper.find('input[type="radio"]').prop('checked', false);
                        wrapper.find('.wpil-content ul').prepend('<li>' +
                            '<div>' +
                            '<input type="radio" checked="" data-id="'+response.id+'" data-type="'+response.type+'" data-suggestion="-1" data-custom="'+link+'" data-post-origin="internal" data-site-url="">' +
                            '<span class="data">' +
                            '<div class="suggested-post-data-container"><strong>Title:</strong> <span class="suggested-post-title">'+response.title+'</span></div>' +
                            '<div class="suggested-post-data-container"><strong>Published:</strong> '+response.date+'</div>' +
                            '<strong>URL:</strong> <a class="post-slug" target="_blank" href="'+link+'">'+response.link+'</a>\n' +
                            '</span>' +
                            '</div>' +
                            '</li>');
                        wrapper.find('input[type="radio"]')[0].click();
                        wrapper.find('.wpil-collapsible').addClass('wpil-active');
                        wrapper.find('.wpil-content').show();
                    }
            });
        } else {
            alert("The link is empty!");
        }
    });

    // if the user cancels the custom link
    $(document).on('click', '.cancel_custom_link span', function(){
        $(this).closest('.suggestion').find('.link-form-button').show();
        $(this).closest('.wpil-collapsible-wrapper').find('.link-form-button').show();
        $(this).closest('.custom-link-wrapper').remove();
    });

    //show edit sentence form
    $(document).on('click', '.wpil_edit_sentence', function(){
        var block = $(this).closest('.sentence');
        setTimeout(function(){openSentenceEditor(block);}, 300); // delay the opening so things can finish their processing
    });

    // listen for clicks to the "Allow multiple links" checkbox
    var multiLinkSet;
    $(document).on('click', '.wpil-sentence-allow-multiple-links', function(){
        var checkbox = $(this);
        clearTimeout(multiLinkSet);
        multiLinkSet = setTimeout(function(){
            ajaxSetMultiLinksInEditor(checkbox);
        }, 200);
    });

    function ajaxSetMultiLinksInEditor(checkbox){
        if(!checkbox){
            return;
        }

        var checked = checkbox.is(':checked') ? 1: 0;

        var data = {
            action: 'wpil_set_multi_link_in_sentence_editor',
            checked: checked,
            nonce: checkbox.data('nonce')
        };
        jQuery.ajax({
            type: 'POST',
            url: ajaxurl,
            dataType: 'json',
            data: data,
            error: function (jqXHR, textStatus, errorThrown) {
                var wrapper = document.createElement('div');
                $(wrapper).append('<strong>' + textStatus + '</strong><br>');
                $(wrapper).append(jqXHR.responseText);
                wpil_swal({"title": "Error", "content": wrapper, "icon": "error"});
            },
            success: function(response){
                if(response.success){
                    console.log(response.success.text);
                }
            },
            complete: function(){
                // regardless of the outcome, set all the other checkboxes to the same setting as this one
                if(checkbox.is(':checked')){
                    $('.wpil-sentence-allow-multiple-links').prop('checked', true);
                }else{
                    $('.wpil-sentence-allow-multiple-links').prop('checked', false);
                }
            }
        });

    }

    function openSentenceEditor(block){
        var form = block.find('.wpil_edit_sentence_form');
        var id = 'wpil_editor' + block.data('id');
        var sentence = form.find('.wpil_content').html();

        if (typeof inbound_internal_link !== 'undefined') {
            var link = inbound_internal_link;
        } else {
            var link = $(block).closest('tr').find('.post-slug:first').attr('href');
        }

        sentence = sentence.replace('%view_link%', link);
        form.find('.wpil_content').attr('id', id).html(sentence).show();
        form.show();
        var textarea_height = form.find('.wpil_content').height() + 100;
        form.find('.wpil_content').height(textarea_height);
        if(undefined === wp.blockEditor){
            wp.editor.initialize(id, {
                tinymce: true,
                quicktags: true,
            });
        }else{
            wp.oldEditor.initialize(id, {
                tinymce: true,
                quicktags: true,
            });
        }

        tinyMCE.activeEditor.setContent(form.find('.wpil_content').text());
        block.find('input[type="checkbox"]:not(.wpil-sentence-allow-multiple-links), .wpil_sentence_with_anchor, .wpil_edit_sentence').hide();
        setTimeout(function(){ 
            block.find('.mce-tinymce').show(); 
            block.find('.wp-editor-tabs .switch-tmce').trigger('click');
            block.find('.mce-tinymce.mce-container.mce-panel').css({'display': 'block'});
            console.log('editor open!');
        }, 500);
        form.find('.wpil_content').hide();
        form.show();
    }

    // make sure the text area shows when the user clicks the "text" button
    $(document).on('click', '.wpil_edit_sentence_form .wp-editor-tabs .switch-html', function(){
        var textEditor = $(this).parents('.wp-editor-tools').find('textarea.wpil_content');
        if(!$(textEditor).is(':visible')){
            setTimeout(function(){
                $(textEditor).css({'display': 'inline-block'});
            }, 50);
        }
    });

    //Cancel button pressed
    $(document).on('click', '.wpil_edit_sentence_form .button-secondary', function(){
        var block = $(this).closest('.sentence');
        wpil_editor_remove(block);
    });

    //Save edited sentence
    $(document).on('click', '.wpil_edit_sentence_form .button-primary', function(){
        var block = $(this).closest('.sentence');
        var id = 'wpil_editor' + block.data('id');

        //get content from the editor
        var sentence;
        if ($('#' + id).css('display') == 'none') {
            var editor = tinyMCE.get(id);
            sentence = editor.getContent();
        } else {
            sentence = $('#' + id).val();
        }

        //remove multiple whitespaces and outer P tag
        if (sentence.substr(0,3) == '<p>') {
            sentence = sentence.substr(3);
        }
        if (sentence.substr(-4) == '</p>') {
            sentence = sentence.substr(0, sentence.length - 4);
        }
        var sentence_clear = sentence;

        // clear any click-disabling classes
        block.find('.wpil_sentence').removeClass('wpil-disable-word-click').prop('title', 'Double clicking a word will select it.');

        // update the text in the plain text version of the link content
        block.find('.wpil_edit_sentence_form').find('.wpil_content').text(sentence_clear);

        // if the user wants to allow multiple links in the suggestion text
        if(block.find('.wpil-sentence-allow-multiple-links').is(':checked')){
            // grab all the links and replace their text representations with placeholders
            var links = sentence.match(/<a[^>]+>/g);

            if (links[0] != null) {
                sentence = sentence.replace(/<a[^>]+\s*>/g, ' %link_start% ');
                sentence = sentence.replace(/\s*<\/a>/g, ' %link_end% ');

                // if there's more than one link
                if(links[1] != null){
                    // disable the sentence word clicking
                    block.find('.wpil_sentence').addClass('wpil-disable-word-click').prop('title', 'Word click-selecting disabled when multiple links present.');;
                }
            }
        }else{
            //put each word to span
            var link = sentence.match(/<a[^>]+>/);
            if (link[0] != null) {
                sentence = sentence.replace(/<a[^>]+\s*>/, ' %link_start% ');
                sentence = sentence.replace(/\s*<\/a>/, ' %link_end% ');
            }

            // check for a second link
            var secondLink = sentence.match(/<a[^>]+>/);
            if (secondLink != null && secondLink[0] != null) {
                // if there are more links, remove them
                sentence = sentence.replace(/<a[^>]+\s*>/g, '');
                sentence = sentence.replace(/\s*<\/a>/g, '');
                // and update the clear sentence so the additional links aren't present
                sentence_clear = sentence.replace(/%link_start%/g, link[0]);
                sentence_clear = sentence_clear.replace(/%link_end%/g, '</a>');
                block.find('.wpil_edit_sentence_form').find('.wpil_content').text(sentence_clear);
            }
        }

        sentence = sentence.replace(/\s+/g, ' ');
        sentence = sentence.replace(/ /g, '</span> <span class="wpil_word">');
        sentence = '<span class="wpil_word">' + sentence + '</span>';
        if (link && link[0] != null) {
            sentence = sentence.replace(/<span class="wpil_word">%link_start%<\/span>/g, link[0]);
            sentence = sentence.replace(/<span class="wpil_word">%link_end%<\/span>/g, '</a>');
        }else if(links && links[0] != null){
            for(var i in links){
                sentence = sentence.replace(/<span class="wpil_word">%link_start%<\/span>/, links[i]);
            }
            sentence = sentence.replace(/<span class="wpil_word">%link_end%<\/span>/g, '</a>');
        }

        block.find('.wpil_sentence').html(sentence);
        block.find('input[name="custom_sentence"]').val(btoa(unescape(encodeURIComponent(sentence_clear))));

        spaceSentenceWords(block.find('.wpil_sentence'));

        if(block.closest('.wp-list-table').hasClass('inbound')){
            if(block.closest('.wpil-collapsible').length > 0){ // if the sentence is the top-level sentence in a dropdown
                updateDropdownSentence(block.find('.wpil_sentence'));
            }
        }
        toggleSentenceReset(block.find('.wpil_sentence'));

        if (block.closest('tr').find('.raw_html').length) {
            sentence_clear = sentence_clear.replace(/</g, '&lt;');
            sentence_clear = sentence_clear.replace(/>/g, '&gt;');
            block.closest('tr').find('.raw_html').hide();
            block.closest('tr').find('.raw_html.custom-text').html(sentence_clear).show();
        }

        block.closest('tr').find('.chk-keywords').prop('checked', true);
        wpil_editor_remove(block)
    });

    /**
     * Fires the WP editor at a target element to run through the initialization process
     **/
    function wpilEditorInitialize(){
        if(undefined === wp.blockEditor){
            wp.editor.initialize('wpil-editor-target', {
                tinymce: true,
                quicktags: true,
            });
            setTimeout(function(){
                wp.editor.remove('wpil-editor-target');
            }, 250);
        }else{
            wp.oldEditor.initialize('wpil-editor-target', {
                tinymce: true,
                quicktags: true,
            });
            setTimeout(function(){
                wp.oldEditor.remove('wpil-editor-target');
            }, 250);
        }
    }

    //Remove WP Editor after sentence editing
    function wpil_editor_remove(block) {
        var form = block.find('.wpil_edit_sentence_form');
        var textarea_height = form.find('.wpil_content').height() - 100;
        form.find('.wpil_content').height(textarea_height);
        form.hide();
        form.find('.wpil_content').attr('id', '').prependTo(form);
        if(undefined === wp.blockEditor){
            wp.editor.remove('wpil_editor' + block.data('id'));
        }else{
            wp.oldEditor.remove('wpil_editor' + block.data('id')); 
        }
        form.find('.wp-editor-wrap').remove();
        block.find('input[type="checkbox"], .wpil_sentence_with_anchor, .wpil_edit_sentence').show();
    }

    function customSentenceRefresh(el) {
        if(el.parents('.wpil-content').length){
            var input = el.closest('.data').find('input[name="custom_sentence"]');
            var sentence = el.html();
            var editorContent = el.closest('.data').find('.wpil_content');
        }else{
            var input = el.closest('.sentence').find('input[name="custom_sentence"]');
            var sentence = el.closest('.wpil_sentence').html();
            var editorContent = el.closest('.sentence').find('.wpil_content');
        }

        sentence = sentence.replace(/<span[^>]+wpil_suggestion_tag[^>]+>([a-zA-Z0-9=+]+)<\/span>/g, function (x) {
            x = x.replace(/<span[^>]+>/g, '');
            x = x.replace(/<\/span>/g, '');
            return atob(x);
        });
        sentence = sentence.replace(/<\/span> <\/a>/g, '<\/span><\/a> ');
        sentence = sentence.replace(/<span[^>]+>/g, '');
        sentence = sentence.replace(/<\/span>/g, '');
        editorContent.html(sentence);

        if (input.val() !== '') {
            input.val(btoa(unescape(encodeURIComponent(sentence))));
        }
    }

    /**
     * Updates the sentence and "custom_sentence" text of suggested sentences in dropdowns
     **/
    function updateDropdownSentence(sentence){
        var sentenceWithAnchor = sentence.closest('.wpil_sentence_with_anchor');
        var listItemId = sentenceWithAnchor.data('li-id');

        if(undefined !== listItemId){
            var itemData = $(sentence).closest('.wpil-collapsible-wrapper').find('.wpil-inbound-sentence-data-container[data-container-id="' + listItemId + '"] .data');

            itemData.find('.wpil_sentence').html(sentence.html());
            itemData.find('.wpil_content').html(sentenceWithAnchor.siblings('.wpil_edit_sentence_form').find('.wpil_content').html());
            itemData.find('[name="custom_sentence"]').val(sentenceWithAnchor.siblings('[name="custom_sentence"]').val());

            if(sentence.hasClass('wpil-disable-word-click')){
                itemData.find('.wpil_sentence').addClass('wpil-disable-word-click').prop('title', 'Word click-selecting disabled when multiple links present.');
            }else{
                itemData.find('.wpil_sentence').removeClass('wpil-disable-word-click').prop('title', 'Double clicking a word will select it.');
            }

            customSentenceRefresh(itemData.find('.wpil_sentence'));
        }
    }

    /**
     * Toggles the display of the "reset sentence" button.
     **/
    function toggleSentenceReset(sentence){
        var parent = sentence.closest('div');
        var listItemId = sentence.closest('.wpil_sentence_with_anchor').data('li-id');
        var currentSentence = sentence.html().toString().replace(new RegExp(' data-wpil-word-id="[0-9]*"', 'ig'), '').replace(new RegExp('[\\s]*</a>[\\s]*', 'ig'), '</a> ').trim();

        // get the current target link
        if (typeof inbound_internal_link !== 'undefined') {
            var link = inbound_internal_link;
        } else {
            var link = $(sentence).closest('tr').find('.post-slug:first').attr('href');
        }

        // if the target link is in the sentence
        if(currentSentence.indexOf(link) !== -1){
            // normalize the changed sentence so we can tell if it's basically the same as the original
            currentSentence = currentSentence.replace(link, '%view_link%')
                                                .replace(new RegExp('[\\s]*<a href="%view_link%">[\\s]*', 'ig'), ' <a href="%view_link%">')
                                                .replace(new RegExp('[\\s]*</a>[\\s]*', 'ig'), '</a> ')
                                                .replace(new RegExp('[\\s][\\s]*', 'ig'), ' ').trim();

            if(currentSentence.indexOf('<span class="wpil_word"></span> <a href="%view_link%">') === 0){
                currentSentence = currentSentence.replace('<span class="wpil_word"></span> <a href="%view_link%">', '<a href="%view_link%">');
            }

            if(currentSentence.indexOf('</span></a> <span class="wpil_word"></span>') + 43 === currentSentence.length){
                currentSentence = currentSentence.replace('</span></a> <span class="wpil_word"></span>', '</span></a>');
            }
        }

        // base64 the sentence
        currentSentence = Base64.encode(currentSentence);

        if(parent.find('[name="original_sentence_with_anchor"]').val() === currentSentence){
            parent.find('.wpil-reload-sentence-with-anchor').removeClass('wpil-reset-active');
        }else{
            parent.find('.wpil-reload-sentence-with-anchor').addClass('wpil-reset-active');
        }

        if(undefined !== listItemId){
            var itemData = $(sentence).closest('.wpil-collapsible-wrapper').find('.wpil-inbound-sentence-data-container[data-container-id="' + listItemId + '"] .data');

            if(itemData.find('[name="original_sentence_with_anchor"]').val() === currentSentence){
                itemData.find('.wpil-reload-sentence-with-anchor').removeClass('wpil-reset-active');
            }else{
                itemData.find('.wpil-reload-sentence-with-anchor').addClass('wpil-reset-active');
            }
        }

        if(parent.hasClass('data')){ // if this is a sentence in a dropdown
            // do the check on the active sentence
            var tLS = parent.closest('.wpil-collapsible-wrapper').find('.top-level-sentence');
            if(tLS.find('[name="original_sentence_with_anchor"]').val() === currentSentence){
                tLS.find('.wpil-reload-sentence-with-anchor').removeClass('wpil-reset-active');
            }else{
                tLS.find('.wpil-reload-sentence-with-anchor').addClass('wpil-reset-active');
            }
        }
    }

    /**
     * Resets modified suggestion texts back to their initial values when the user clicks the reset button.
     **/
    $(document).on('click', '.wpil-reload-sentence-with-anchor', function(){
        var parent = $(this).closest('div');
        var sentence = parent.find('.wpil_sentence');
        var originalSentence = Base64.decode(parent.find('[name="original_sentence_with_anchor"]').val());
        var dropdownWrapper = parent.closest('.wpil-collapsible-wrapper');

        sentence.html(originalSentence);
        sentence.removeClass('wpil-disable-word-click').prop('title', 'Double clicking a word will select it.');
        $(this).removeClass('wpil-reset-active');

        styleSentenceWords(sentence);
        customSentenceRefresh(parent.find('.wpil_sentence'));

        // if the user clicked the reset button in the top level sentence in a dropdown,
        // trigger the sentence refresh in the element in the dropdown
        if(dropdownWrapper.length > 0){
            if(parent.hasClass('top-level-sentence')){
                var listItemId = parent.find('.wpil_sentence_with_anchor').data('li-id');
                if(undefined !== listItemId){
                    var reset = dropdownWrapper.find('.wpil-inbound-sentence-data-container .wpil_sentence_with_anchor[data-li-id="' + listItemId + '"] .wpil-reload-sentence-with-anchor');
                    if(reset.hasClass('wpil-reset-active')){
                        reset.trigger('click');
                    }
                }
            }else{
                var listItemId = parent.closest('.wpil-inbound-sentence-data-container').data('container-id');
                if(undefined !== listItemId){
                    var activeSentence = dropdownWrapper.find('.sentence.top-level-sentence .wpil_sentence_with_anchor');
                    if(listItemId === activeSentence.data('li-id')){
                        var reset = activeSentence.find('.wpil-reload-sentence-with-anchor');
                        if(reset.hasClass('wpil-reset-active')){
                            reset.trigger('click');
                        }
                    }
                }
            }
        }
    });

    $(document).on('click', '.wpil_add_link_to_ignore', function(){
        if (confirm('You are about to add this link to your ignore list and it will not be suggested as a link in the future. However, you can reverse this decision on the settings page.')) {
            var block = $(this).closest('div');
            var id = block.data('id');
            var type = block.data('type');
            var postOrigin = block.data('post-origin');
            var siteUrl = block.data('site-url');

            $.post(ajaxurl, {
                id: id,
                type: type,
                post_origin: postOrigin,
                site_url: siteUrl,
                action: 'wpil_add_link_to_ignore'
            }, function (response) {
                response = $.parseJSON(response);
                if (response.error) {
                    wpil_swal('Error', response.error, 'error');
                } else {
                    if (block.closest('.suggestion').length) {
                        block.closest('tr').fadeOut(300, function(){
                            $(this).remove();
                        });
                    } else {
                        var id = block.data('id');
                        var type = block.data('type');
                        var wrapper = block.closest('.wpil-collapsible-wrapper');

                        wrapper.find('input[data-id="' +  id + '"][data-type="' +  type + '"]').closest('li').remove();
                        wrapper.find('li:first input').prop('checked', true).click();
                    }
                    wpil_swal('Success', 'Link was added to the ignored list successfully!', 'success');
                }
            });
        }
    });

    var mouseExit;
    $(document).on('mouseover', '.wpil_help i, .wpil_help div', function(){
        clearTimeout(mouseExit);
        $('.wpil_help div').hide();
        $(this).parent().children('div').show();
    });

    $(document).on('mouseout', '.wpil_help i, .wpil_help div', function(){
        var element = this;
        mouseExit = setTimeout(function(){
            $(element).parent().children('div').hide();
        }, 250);
        
    });

    $(document).on('click', '.csv_button', function(){
        if($(this).hasClass('file-downloadable')){
            return;
        }

        $(this).addClass('wpil_button_is_active');
        var type = $(this).data('type');
        var data = null;
        if(type === 'error'){ data = $(this).data('codes'); }
        wpil_csv_request(type, 1, data);
    });

    function wpil_csv_request(type, count, data = null, id = 0) {
        $.post(ajaxurl, {
            count: count,
            type: type,
            action: 'wpil_csv_export',
            export_data: data,
            id: id
        }, function (response) {
            if(!isJSON(response)){
                response = extractAndValidateJSON(response, ['error', 'filename', 'fileExists', 'type', 'count', 'id']);
            }

            if (response.error) {
                wpil_swal(response.error.title, response.error.text, 'error');
            } else {
                console.log(response);
                if (response.filename) {
                    if(undefined !== response.fileExists && !response.fileExists){
                        wpil_swal('File Not Creatable', 'Unfortunately, it wasn\'t possible to create the export file. It is most likely caused by server settings preventing Link Whisper from writing in it\'s current directory', 'error');
                        $('#wpil_report_reset_data_form .csv_button').removeClass('wpil_button_is_active');
                        return;
                    }

                    // get the current button and remove the loading from it
                    var currentButton = $('.csv_button[data-type="'+type+'"]');
                    currentButton.removeClass('wpil_button_is_active');

                    // create our download link and try downloading the file
                    var link = document.createElement('a');
                    link.href = response.filename;
                    link.download = currentButton.data('file-name');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    // as a backup, convert the csv button the user clicked into a download button
                    currentButton.addClass('file-downloadable');
                    var text = 'Download ' + currentButton.first().text();
                    currentButton.text(text);
                    currentButton.attr('download', currentButton.data('file-name'));
                    currentButton.attr('href', response.filename);

//					location.href = response.filename;
                } else {
                    wpil_csv_request(response.type, ++response.count, data, response.id);
                }
            }
        });
    }

    $(document).on('click', '.return_to_report', function(e){
        e.preventDefault();

        // if a link is specified
        if(undefined !== this.href){
            // parse the url
            var params = parseURLParams(this.href);
            // if the url is back to an edit page
            if(	undefined !== typeof params &&
                ( (undefined !== params.action && undefined !== params.post && 'edit' === params.action[0]) || params.direct_return || true) // NOTE: if we make it to 2.2.8 without issues, make the checks a little neater. I'm seeing about doing away with the JS report redirect thing to save some system resources for customers.
            ){
                if(params.ret_url && params.ret_url[0]){
                    var link = atob(decodeURI(params.ret_url[0]));
                }else{
                    var link = this.href;
                }

                // redirect back to the page
                location.href = link;
                return;
            }
        }
    });

    $(document).on('click', '.wpil-export-suggestions', function(e){
        e.preventDefault();

        var links = [];
        var data = [];
        var suggestions = $('#tbl_keywords').find('[wpil-link-new][type=checkbox]:checked');
        var suggestionType = $(this).data('suggestion-type');
        if(suggestions.length === 0){
            suggestions = $('#tbl_keywords').find('[wpil-link-new][type=checkbox]');
        }

        suggestions.each(function() {
            if (suggestionType == 'inbound') {
                var dropdownData = $(this).closest('tr').find('.sentences .wpil-content');
                var item = {};
                var id = $(this).closest('tr').find('.sentence').data('id');
                var type = $(this).closest('tr').find('.sentence').data('type');
                if(dropdownData.length > 0){
                    item.links = [];
                    $(dropdownData).find('.data').each(function(index, element){
                        item.links.push({
                            'id': id,
                            'type': type,
                            'sentence': $(element).find('[name="sentence"]').val(),
                            'sentence_with_anchor': $(element).find('.wpil_sentence_with_anchor').html(),
                            'custom_sentence': $(element).find('input[name="custom_sentence"]').val()
                        });
                    });
                }else{
                    item.links = [{
                        'id': id,
                        'type': type,
                        'sentence': $(this).closest('tr').find('.sentence').find('[name="sentence"]').val(),
                        'sentence_with_anchor': $(this).closest('tr').find('.wpil_sentence_with_anchor').html(),
                        'custom_sentence': $(this).closest('tr').find('input[name="custom_sentence"]').val()
                    }];
                }

                data.push(item);
            } else {
                if ($(this).closest('tr').find('input[type="radio"]:checked').length) {
                    var id =  $(this).closest('tr').find('input[type="radio"]:checked').data('id');
                    var type = $(this).closest('tr').find('input[type="radio"]:checked').data('type');
                    var custom_link = $(this).closest('tr').find('input[type="radio"]:checked').data('custom');
                    var post_origin = $(this).closest('tr').find('input[type="radio"]:checked').data('post-origin');
                    var site_url = $(this).closest('tr').find('input[type="radio"]:checked').data('site-url');
                } else {
                    var id =  $(this).closest('tr').find('.suggestion').data('id');
                    var type =  $(this).closest('tr').find('.suggestion').data('type');
                    var custom_link =  $(this).closest('tr').find('.suggestion').data('custom');
                    var post_origin = $(this).closest('tr').find('.suggestion').data('post-origin');
                    var site_url = $(this).closest('tr').find('.suggestion').data('site-url');
                }

                links.push({
                    id: id,
                    type: type,
                    custom_link: custom_link,
                    post_origin: post_origin,
                    site_url: site_url,
                    sentence: $(this).closest('div').find('[name="sentence"]').val(),
                    sentence_with_anchor: $(this).closest('div').find('.wpil_sentence_with_anchor').html(),
                    custom_sentence: $(this).closest('.sentence').find('input[name="custom_sentence"]').val()
                });
            }
        });

        if (suggestionType == 'outbound') {
            data.push({'links': links});
        }

        var exportData = {
            "id": $(this).data('id'),
            "type": $(this).data('type'),
            "suggestion_type": suggestionType,
            'export_type': $(this).data('export-type'),
            'data': JSON.stringify(data)
        };

        $.post(ajaxurl, {
            action: 'wpil_export_suggestion_data',
            export_data: exportData,
            nonce: $(this).data('nonce'),
        }, function (response) {
            if(!isJSON(response)){
                response = extractAndValidateJSON(response, ['error', 'filename', 'nicename']);
            }

            if (response.error) {
                wpil_swal(response.error.title, response.error.text, 'error');
            } else {
                if (response.filename) {
                    var link = document.createElement('a');
                    link.href = response.filename;
                    link.download = response.nicename;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
//					location.href = response.filename;
                }
            }
        });
    });

    /**
     * Makes a call to the object cache flusher.
     * Only works on pages that have the nonce defined
     */
    function flushObjectCache(){
        var nonce = $('#wpil-object-cache-flush-nonce').val();
        if(!nonce || nonce.length < 1){
            return;
        }

        $.post(ajaxurl, {
            action: 'wpil_flush_object_cache',
            nonce: nonce,
        }, function (response) {
            console.log('flush!');
        });
    }

    $(document).on('click', '.wpil_gsc_switch_app', function(){
        if($(this).hasClass('enter-custom')){
            $('.wpil_gsc_app_inputs').hide();
            $('.wpil_gsc_custom_app_inputs').show();
        }else{
            $('.wpil_gsc_app_inputs').show();
            $('.wpil_gsc_custom_app_inputs').hide();
        }
    });

    /*$(document).on('click', '.wpil-get-gsc-access-token', function(){
        $('.wpil_gsc_get_authorize').show();
        $(this).hide();
    });*/

    $(document).on('click', '.wpil_gsc_enter_app_creds', function(){
        $('#frmSaveSettings').trigger('submit');
    });

    $(document).on('click', '.wpil_gsc_clear_app_creds', function(){
        $.post(ajaxurl, {
            action: 'wpil_clear_gsc_app_credentials',
            nonce: $(this).data('nonce')
        }, function (response) {
            location.reload();
        });
    });

    $(document).on('click', '.wpil-gsc-deactivate-app', function(){
        $.post(ajaxurl, {
            action: 'wpil_gsc_deactivate_app',
            nonce: $(this).data('nonce')
        }, function (response) {
            location.reload();
        });
    });

    /** Showing processing errors **/
    var processingError;
    // sets up a notice that will display if it's not cleared
    function setupProcessingError(clear = false){
        clearTimeout(processingError);
        if(!clear){
            processingError = setTimeout(function(){
                $('.wpil-process-loading-error-message').css({'display': 'inline-block'});
            }, 180 * 1000); // the max processing time for a LW process _should_ be 90 seconds, but this allows more breathing room
        }
    }

    // hides the error message in case it's showing
    function hideProcessingError(){
        $('.wpil-process-loading-error-message').css({'display': 'none'});
    }
    /** /Showing processing errors **/

    /** Sticky Header **/
    // Makes the thead sticky to the top of the screen when scrolled down far enough
    if($('.wpil_styles .wp-list-table:not(.sticky-ignore)').length){
        var theadTop = $('.wpil_styles .wp-list-table:not(.sticky-ignore)').offset().top;
        var adminBarHeight = parseInt(document.getElementById('wpadminbar').offsetHeight);
        var scrollLine = (theadTop - adminBarHeight);
        var sticky = false;

        // duplicate the footer and insert in the table head
        $('.wpil_styles .wp-list-table:not(.sticky-ignore) tfoot tr').clone().addClass('wpil-sticky-header').css({'display': 'none', 'top': adminBarHeight + 'px'}).appendTo('.wp-list-table thead');

        // resizes the header elements
        function sizeHeaderElements(){
            // get the width of the normal header
            var headerWidth = $('.wpil_styles .wp-list-table:not(.sticky-ignore) thead tr').width();

            // adjust for any change in the admin bar
            adminBarHeight = parseInt(document.getElementById('wpadminbar').offsetHeight);
            $('.wpil-sticky-header').css({'top': adminBarHeight + 'px', 'width': headerWidth});

            // adjust the size of the header columns
            var elements = $('.wpil-sticky-header').find('th');
            $('.wpil_styles .wp-list-table:not(.sticky-ignore) thead tr').not('.wpil-sticky-header').find('th').each(function(index, element){
                //var width = getComputedStyle(element).width;
                var width = $(element).get(0).scrollWidth - (parseInt(getComputedStyle(element).paddingLeft) + parseInt(getComputedStyle(element).paddingRight));
                $(elements[index]).attr('style', 'width:' + width + "px !important;");
            });
        }
        sizeHeaderElements();

        function resetScrollLinePositions(){
            if($('.wpil_styles .wp-list-table:not(.sticky-ignore)').length < 1){
                return;
            }
            theadTop = $('.wpil_styles .wp-list-table:not(.sticky-ignore)').offset().top;
            adminBarHeight = parseInt(document.getElementById('wpadminbar').offsetHeight);
            scrollLine = (theadTop - adminBarHeight);
        }

        $(window).on('scroll', function(e){
            var scroll = parseInt(document.documentElement.scrollTop);

            // if we've passed the scroll line and the head is not sticky
            if(scroll > scrollLine && !sticky){
                // sticky the header
                $('.wpil-sticky-header').css({'display': 'table-row'});
                sticky = true;
            }else if(scroll < scrollLine && sticky){
                // if we're above the scroll line and the header is sticky, unsticky it
                $('.wpil-sticky-header').css({'display': 'none'});
                sticky = false;
            }
        });

        var wait;
        $(window).on('resize', function(){
            clearTimeout(wait);
            setTimeout(function(){ 
                sizeHeaderElements(); 
                resetScrollLinePositions();
            }, 150);
        });

        setTimeout(function(){ 
            resetScrollLinePositions();
        }, 1500);
    }
    /** /Sticky Header **/

    /** Making the "Load without animation" setting sticky **/
    $(document).on('click', '.wpil-animation-load-setting', toggleLoadWithoutAnimation);
    function toggleLoadWithoutAnimation(e){
        e.preventDefault();
        saveLoadWithoutAnimation(this);
    }

    function saveLoadWithoutAnimation(button){
        var status = $(button).data('disable-load-with-animation');
        var nonce = $(button).data('nonce');

        $.ajax({
            type: "POST",
            url: ajaxurl,
            data: {
                action: 'wpil_save_animation_load_status',
                nonce: nonce,
                status: (status) ? 1: 0,
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            },
            success: function(response){
                console.log(response);

            },
            complete: function(){
                window.location = button.href;
            }
        });
    }
    /** /Making the "Load without animation" setting sticky **/

    /** Showing link stats in inbound suggestions **/
    $(document).on('click', '.wpil-inbound-show-link-stats-button .button-primary', togglePostLinkingStats);
    function togglePostLinkingStats(){
        $('.wpil-inbound-show-link-stats-form').toggle();
        saveInboundPostLinkingStatsVisibility(this);
    }

    function saveInboundPostLinkingStatsVisibility(button){
        var visible = $('.wpil-inbound-show-link-stats-form').is(':visible');
        var nonce = $(button).data('nonce');

        $.ajax({
            type: "POST",
            url: ajaxurl,
            data: {
                action: 'wpil_save_inbound_link_stats_visibility',
                nonce: nonce,
                visible: (visible) ? 1: 0,
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            },
            success: function(response){
                console.log(response);
            },
        });
    }
    /** /Showing link stats in inbound suggestions **/

    /** General Items **/
    $(document).on('keyup', '.wpil_styles #current-page-selector', maybeChangePage);
    function maybeChangePage(e){
        if(!e || !e.target || e.keyCode !== 13){
            return;
        }

        // if the selector isn't in a form
        if($(e.target).parents('form').length < 1){
            // manually perform the page updating
            var page = parseInt($(e.target).val());

            if(page > 1){
                if(-1 !== window.location.href.indexOf('paged')){
                    window.location.href = window.location.href.replace(/paged=([0-9]*)/, 'paged=' + page);
                }else{
                    window.location.href += '&paged=' + page;
                }
            }else if(-1 !== window.location.href.indexOf('paged')){
                window.location.href = window.location.href.replace(/paged=([0-9]*)/, '');
            }
        }
    }
    /** /General Items */

    /** Ajax saving for Screen Options **/
    var savingScreenOptions = false;
    $(document).on('submit', '#adv-settings', ajaxSaveScreenOptions);
    function ajaxSaveScreenOptions(e){
        // exit if this is not a Link Whisper page
        if($('body').find('.wpil_styles').length < 1 || savingScreenOptions){
            return;
        }
        // stop the form submit
        e.preventDefault();

        // get the form
        var form = $(this);

        // get the values from the screen options
        var saveOptions = {};

        $(this).find('input').each(function(index, element){
            if(!element.id){
                return;
            }

            var el = $(element);
            if(el.attr('type') === 'checkbox'){
                saveOptions[element.id] = el.is(':checked') ? 'on': 'off';
            }else{
                saveOptions[element.id] = $(element).val();
            }
        });

        if(Object.keys(saveOptions).length > 0){
            $.ajax({
                type: "POST",
                url: ajaxurl,
                data: {
                    action: 'wpil_save_screen_options',
                    nonce: $(this).find('#screenoptionnonce').val(),
                    options: saveOptions,
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus);
                },
                success: function(response){
                    if(!isJSON(response)){
                        response = extractAndValidateJSON(response, ['success']);
                    }

                    if(response.success){
                        window.location.reload();
                    }else{
                        savingScreenOptions = true;
                        form.submit();
                    }
                    console.log(response);
                }
            });
        }
    }

    /** /Ajax saving for Screen Options **/

})(jQuery);
