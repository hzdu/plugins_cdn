/**
 * Script for PO file editor pages
 */
!function( window, $ ){
   
    var loco = window.locoScope,
        conf = window.conf,
        fileRefs = loco.po.ref.init(loco,conf),
        
        syncParams = null,
        saveParams = null,
        ajaxUpload = conf.multipart,
        
        // UI translation
        translator = loco.l10n,
        sprintf = loco.string.sprintf,

        // PO file data
        locale = conf.locale,
        messages = loco.po.init( locale ).wrap( conf.powrap ),
        template = ! locale,
        
        // form containing action buttons
        elForm = document.getElementById('loco-actions'),
        filePath = conf.popath,
        syncPath = conf.potpath,
        
        // file system connect when file is locked
        elFilesys = document.getElementById('loco-fs'),
        fsConnect = elFilesys && loco.fs.init( elFilesys ),
        
        // prevent all write operations if readonly mode
        readonly = conf.readonly,
        editable = ! readonly,
        
        // Editor components
        editor,
        saveButton,
        innerDiv = document.getElementById('loco-editor-inner'),
        
        // validation and suggestions
        translationClients,
        translationApiKeys = conf.apis || [],
        suggestionCache = {},
    
        // modal windows
        $suggestModal,
        $translateModal;

    // warn if ajax uploads are enabled but not supported
    if( ajaxUpload && ! ( window.FormData && window.Blob ) ){
        ajaxUpload = false;
        loco.notices.warn("Your browser doesn't support Ajax file uploads. Falling back to standard postdata");
    }
    

    /**
     * 
     */
    function doSyncAction( callback ){
        function onSuccess( result ){
             var info = [],
                 doc = messages,
                 exp = result.po,
                 src = result.pot,
                 pot = loco.po.init().load( exp ),
                 done = doc.merge( pot ),
                 nadd = done.add.length,
                 ndel = done.del.length,
                 t = translator;
             // reload even if unchanged, cos indexes could be off
             editor.load( doc );
             // Show summary 
             if( nadd || ndel ){
                 if( src ){
                    // Translators: Where %s is the name of the POT template file. Message appears after sync
                    info.push( sprintf( t._('Merged from %s'), src ) );
                 }   
                 else {        
                    // Translators: Message appears after sync operation     
                    info.push( t._('Merged from source code') );
                 }
                 // Translators: Summary of new strings after running in-editor Sync
                 nadd && info.push( sprintf( t._n('1 new string added','%s new strings added', nadd ), nadd ) );
                 // Translators: Summary of existing strings that no longer exist after running in-editor Sync
                 ndel && info.push( sprintf( t._n('1 obsolete string removed','%s obsolete strings removed', ndel ), ndel ) );
                 // editor thinks it's saved, but we want the UI to appear otherwise
                 $(innerDiv).trigger('poUnsaved',[]);
                 updateStatus();
                 // debug info in lieu of proper merge confirmation:
                 window.console && debugMerge( console, done );
             }
             else if( src ){
                 // Translators: Message appears after sync operation when nothing has changed. %s refers to a POT file.
                 info.push( sprintf( t._('Already up to date with %s'), src ) );
             }
             else {
                 // Translators: Message appears after sync operation when nothing has changed
                 info.push( t._('Already up to date with source code') );
             }
             loco.notices.success( info.join('. ') );
             $(innerDiv).trigger('poMerge',[result]);
             // done sync
             callback && callback();
        }
        loco.ajax.post( 'sync', syncParams, onSuccess, callback );
    }



    function debugMerge( console, result ){
         var i = -1, t = result.add.length;
         while( ++i < t ){
             console.log(' + '+result.add[i].source() );
         }
         i = -1, t = result.del.length;
         while( ++i < t ){
             console.log(' - '+result.del[i].source() );
         }
    }



    // API client getters
    function createTranslationClients() {
        var i = -1, info, clients = [], keys = translationApiKeys, num = keys.length;
        while( ++i < num ){
            try {
                info = keys[i];
                clients.push( loco.apis.create(info) );
            }
            catch( Er ){
                loco.notices.error( String(Er) );
            }
        }
        return clients;
    }
    
    function getTranslationClients(){
        return translationClients || ( translationClients = createTranslationClients() );
    }
    
    function getTranslationClient(id){
        // not indexed as object, annoyingly.
        var client, clients = getTranslationClients(), num = clients.length, i = -1;
        while( ++i < num ){
            client = clients[i];
            if( client.getId() === id ){
                return client;
            }
        }
        loco.notices.error('No '+id+' client');
    }
    
    
    // Calling external translation providers
    
    function onHintEvent( /*event*/ ){
        translationApiKeys.length ? loadSuggestions() : loadUnconfiguredApis();
    }
    
    
    function getTranslationModal(){
        if( ! $translateModal ){
            $translateModal = $('#loco-auto');
            // http://api.jqueryui.com/dialog/
            $translateModal.dialog({
                dialogClass: 'loco-modal',
                appendTo: '#loco.wrap',
                title: $translateModal.attr('title'),
                modal: true,
                closeOnEscape: true,
                resizable: false,
                position: { my: "top", at: "top", of: '#loco-content' }
            } );
        }
        return $translateModal;
    }
    
    

    function loadUnconfiguredApis(){
        getTranslationModal().dialog('open');
    }
    
    
    function initAutoTranslate(){
        var job,
            credit,
            translated = 0,
            t = translator,
            flagFuzzy = false,
            $modal = getTranslationModal().dialog('open'),
            $form = $modal.find('form'),
            $butt = $form.find('button.button-primary'),
            $stat = $('#loco-job-progress')
        ;
        function enable(){
            $butt[0].disabled = false;
        }
        function disable(){
            $butt[0].disabled = true;
        }
        function think(){
            $butt.addClass('loco-loading');
        }
        function unthink(){
            $butt.removeClass('loco-loading');
        }
        function showStatus( message ){
            $stat.text(message);
        }
        // calculate job with current spec. not async. should be fast
        function refreshJob( elForm ){
            var apiId = $(elForm['api']).val(),
                client = getTranslationClient(apiId),
                overwrite = elForm['existing'].checked
            ;
            showStatus('Calculating....'); // <- won't render sync!
            job = client.createJob();
            job.init( messages, overwrite );
            credit = client.toString();
            showStatus(
                sprintf( t._('%s unique source strings.'), job.length.format(0) )+' '+
                // translators: characters meaning individual unicode characters of source text
                sprintf( t._('%s characters will be sent for translation.'), job.chars.format(0) ) 
            );
            // job ready for dispatch. 
            job.length ? enable() : disable();
        }
        // refresh job if specification changes
        function onJobChange( event ){
            var elField = event.target, f = elField.name;
            if( 'api' === f || 'existing' === f ){
                refreshJob(elField.form);
            }
            return true;
        }
        // dispatch job if form submitted
        function onJobDispatch( event ){
            event.preventDefault();
            think();
            disable();
            onProgress(0);
            flagFuzzy = event.target['fuzzy'].checked;
            job.dispatch().done(onJobComplete).each(onEachTranslatedMessage).prog(onProgress);
        }
        function onEachTranslatedMessage(message){
            if( job ){
                flagFuzzy && message.fuzzy(0,true);
                editor.pasteMessage(message);
                if( message === editor.active ){
                    editor.setStatus(message);
                }
                editor.unsave(message,0);
                translated++;
            }
        }
        // can't redraw translated count between messages, but can between batches!
        function onProgress(didBatches,numBatches){
            var percent = numBatches ? 100*didBatches/numBatches : 0;
            // translators: %s%% is a percentage, e.g. 50%
            showStatus( sprintf( t._('Translation progress %s%%'),percent.format(0)) );
        }
        function onJobComplete(){
            unthink();
            if( job ){
                var remaining = job.length - translated;
                if( remaining > 0 ) {
                    translated && loco.notices.warn( sprintf( t._('Translation job aborted with %s strings remaining'),remaining.format(0) ) );
                }
                if( translated > 0 ){
                    loco.notices.success( sprintf(t._('%s strings translated via '+credit), translated.format(0) ) ).stick();
                    // update stats and reindex 
                    updateStatus();
                    editor.rebuildSearch();
                }
                job = null;
                editor.fire('poAbort'); // <- hack allows re-enable of Auto buttons.
            }
            // close and destroy modal without recursion
            if( $modal ){
                $modal.off('dialogclose').dialog('close');
                $modal = null;
             }
        }
        // destructor
        function onCloseModal(){
            job.abort();
            $modal = null;
            onJobComplete();
        }
        // clean UI for new run
        unthink();
        disable();
        // initialize default job and listen for changes to spec
        $form.off('submit change')
        refreshJob( $form[0] );
        $form.on('change',onJobChange).on('submit',onJobDispatch);
        $modal.off('dialogclose').on('dialogclose',onCloseModal)
    }



    function loadSuggestions(){
        var t = translator,
            message = editor.current(),
            index = editor.getTargetOffset(),
            source = message && message.source(null,index),
            langAtts = 'lang="'+String(locale)+'" dir="'+(locale.isRTL()?'RTL':'LTR')+'"'
        ;
        if( source ){
            function createSuggestionClosure( source, target ){
                return function(event){
                    event.preventDefault();
                    event.stopPropagation();
                    destroyScope();
                 
                    // use this translation.
                    var message = editor.current(), index = editor.getTargetOffset();
                    if( message && message.source(null,index) === source ){
                        message.translate(target,index);
                        editor.focus().reloadMessage(message)
                        // editor.fuzzy(true,message,index); // TODO make optional
                    }
                    else {
                        loco.notices.warn('Source changed since suggestion');
                    }
                }
            }
            function completeSuggestion( source, target, locale, client ){
                var id = client.getId(), href = client.getUrl(), name = String(client), $div = placeholders && placeholders[id];
                $div && $div.replaceWith( $('<div class="loco-api loco-api-'+id+'"></div>')
                    .append( $('<a class="loco-api-credit" target="_blank"></a>').attr('href',href).text(name) )
                    .append( $('<blockquote '+langAtts+'></blockquote>').text(target||'[FAILED]') )
                    .append( $('<button class="button button-primary"></button>').text(t._('Use this translation')).on('click',createSuggestionClosure(source,target)) )
                );
                // adjust position after each write
                $modal.dialog('option','position', { my: "center", at: "center", of: window });
                // are we done?
                if( ++loaded === length ){
                    $modal && $modal.dialog('option','title', t._('Suggested translations')+' — '+locale.label );
                }
            }
            function initSuggestion( client ){
                var $div = $('<div class="loco-api loco-api-loading"></div>').text('Calling '+client+' ...');
                placeholders[ client.getId() ] = $div;
                return $div;
            }
            function destroyScope( closeEvent ){
                if( $modal && null == closeEvent ) {
                    $modal.dialog('close');
                }
                $modal = null;
                placeholders = null;
                // TODO abort existing requests not yet returned
            }
            // closure ensures client that made call is available
            function createCallbackClosure( client ){
                return function( source, target, locale ){
                    cached[ client.getId() ] = target;
                    completeSuggestion(source, target, locale, client );
                }
            }
            // http://api.jqueryui.com/dialog/
            function getModal(){
                return $suggestModal || ( $suggestModal = $('<div id="loco-hint"></div>').dialog( {
                    dialogClass   : 'loco-modal',
                    modal         : true,
                    autoOpen      : false,
                    closeOnEscape : true,
                    resizable     : false,
                    minHeight     : 400
                } ) );
            }
            // open modal for loading suggestions, starting with source
            var $modal = getModal().html('').append( $('<div class="loco-api"><p>Source text:</p></div>').append( $('<blockquote lang="en"></blockquote>').text(source) ) )
                .dialog('option','title', t._('Loading suggestions')+'...' )
                .off('dialogclose').on('dialogclose',destroyScope)
                .dialog('open')
            ;
            // show existing translation if there is one
            var target = message.translation(index);
            if( target ){
                $('<div class="loco-api"><p>Current translation:</p></div>')
                    .append( $('<blockquote '+langAtts+'></blockquote>').text(target) )
                    .append( $('<button class="button"></button>').text(t._('Keep this translation')).on('click',function(event){
                        event.preventDefault();
                        destroyScope();
                    }) )
                    .appendTo($modal)
                ;
            }
            // request translation from each api in *parallel* browser should handle queueing if required
            var client, clientId, clients = getTranslationClients(), length = clients.length, i = -1,
                cached = suggestionCache[source] || ( suggestionCache[source] = {} ),
                placeholders = {},
                loaded = 0
            ;
            while( ++i < length ){
                client = clients[i];
                $modal.append( initSuggestion(client) );
                // setTimeout( completeSuggestion, fakeDelay*(i+1), source,source,locale,client);
                clientId = client.getId();
                if( cached[clientId] ){
                    completeSuggestion(source,cached[clientId],locale,client);
                }
                else {
                    client.translate( source, locale, createCallbackClosure(client) );
                }
            }
        }
    }


    /**
     * Capture clicks on file references
     */
    function onMetaClick( event, target ){
        function tryTag( node, name ){
            if( node.tagName === name ){
                return node;
            }
            return node.getElementsByTagName(name)[0];
        }
        var codeEl = tryTag(target,'CODE');
        if( codeEl ){
            fileRefs.load( codeEl.textContent );
        } 
    }


    /**
     * @param params {Object}
     * @return FormData
     */
    function initMultiPart( params ){
        var p, data = new FormData;
        for( p in params ){
            if( params.hasOwnProperty(p) ) {
                data.append(p, params[p]);
            }
        }
        return data;
    }


    /**
     * Post full editor contents to "posave" endpoint
     */    
    function doSaveAction( callback ){
       
        function onSuccess( result ){
            callback && callback();
            editor.save( true );
            // Update saved time update
            $('#loco-po-modified').text( result.datetime||'[datetime error]' );
        }
        var postData = $.extend( {locale:String(messages.locale()||'')}, saveParams||{} );
        if( fsConnect ){
            fsConnect.applyCreds(postData);
        }
        // submit PO as concrete file if configured
        if( ajaxUpload ){
            postData = initMultiPart(postData);
            postData.append('po', new Blob([String(messages)],{type:'application/x-gettext'}), String(postData.path).split('/').pop()||'untitled.po' );
        }
        else {
            postData.data = String(messages);
        }
        loco.ajax.post( 'save', postData, onSuccess, callback );
    }
    

    function saveIfDirty(){
        editor.dirty && doSaveAction();
    }
    
    

    function onUnloadWarning(){
        // Translators: Warning appears when user tries to refresh or navigate away when editor work is unsaved
        return translator._("Your changes will be lost if you continue without saving");
    }
    


    function registerSaveButton( button ){
        saveButton = button;
        // enables and disable according to save/unsave events
        editor
            .on('poUnsaved', function(){
                enable();
                $(button).addClass( 'button-primary loco-flagged' );
            } )
            .on('poSave', function(){
                disable();
                $(button).removeClass( 'button-primary loco-flagged' );
            } )
        ;
        function disable(){
            button.disabled = true;
        }
        function enable(){
            button.disabled = false;
        }        
        function think(){
            disable();
            $(button).addClass('loco-loading');
        }
        function unthink(){
            enable();
            $(button).removeClass('loco-loading');
        }
        saveParams = $.extend( { path: filePath }, conf.project||{} );

        $(button).click( function(event){
            event.preventDefault();
            think();
            doSaveAction( unthink );
            return false;
        } );
        return true;
    };
    
    
    
    function registerSyncButton( button ){
        var project = conf.project;
        if( project ){
            function disable(){
                button.disabled = true;
            }
            function enable(){
                button.disabled = false;
            }
            function think(){
                disable();
                $(button).addClass('loco-loading');
            }
            function unthink(){
                enable();
                $(button).removeClass('loco-loading');
            }
            // Only permit sync when document is saved
            editor
                .on('poUnsaved', function(){
                    disable();
                } )
                .on('poSave', function(){
                    enable();
                } )
            ;
            // params for sync end point
            syncParams = {
                bundle: project.bundle,
                domain: project.domain,
                type: template ? 'pot' : 'po',
                sync: syncPath||''
            };
            // enable syncing on button click
            $(button)
                .click( function(event){
                    event.preventDefault();
                    think();
                    doSyncAction( unthink );
                    return false;
                } )
                //.attr('title', syncPath ? sprintf( translator._('Update from %s'), syncPath ) : translator._('Update from source code') )
            ;
            enable();
        }
        return true;
    }
    
    
    function registerAutoTranslateButton( button ){
        function disable(){
            button.disabled = true;
        }
        function enable(){
            button.disabled = false;
        }
        // like Sync, only allow processing when file is saved
        editor
            .on('poUnsaved', function(){
                disable();
            } )
            .on('poSave poAbort', function(){
                enable();
            } )
        ;
        // click opens modal unless open already
        $(button).click( function( event ){
            event.preventDefault();
            initAutoTranslate();
            return false;
        } );
        enable();
        return true;
    }
    


    /*function registerFuzzyButton( button ){
        var toggled = false, 
            enabled = false
        ;
        function redraw( message, state ){
            // fuzziness only makes sense when top-level string is translated
            var allowed = message && message.translated(0) || false;
            if( enabled !== allowed ){
                button.disabled = ! allowed;
                enabled = allowed;
            }
            // toggle on/off according to new fuzziness
            if( state !== toggled ){
                $(button)[ state ? 'addClass' : 'removeClass' ]('inverted');
                toggled = state;
            }
        }
        // state changes depending on whether an asset is selected and is fuzzy
        editor
            .on('poSelected', function( event, message ){
                redraw( message, message && message.fuzzy() || false );
            } )
            .on( 'poEmpty', function( event, blank, message, pluralIndex ){
                if( 0 === pluralIndex && blank === enabled ){
                    redraw( message, toggled );
                }
            } )
            .on( 'poFuzzy', function( event, message, newState ){
                redraw( message, newState );
            } )
        ;
        // click toggles current state
        $(button).click( function( event ){
            event.preventDefault();
            editor.fuzzy( ! editor.fuzzy() );
            return false;
        } );
        return true;
    };*/



    function registerRevertButton( button ){
        // No need for revert when document is saved
        editor
            .on('poUnsaved', function(){
                button.disabled = false;
            } )
            .on('poSave', function(){
                button.disabled = true;
            } )
        ;
        // handling unsaved state prompt with onbeforeunload, see below
        $(button).click( function( event ){
            event.preventDefault();
            location.reload();
            return false;
        } );
        return true;
    };



    function registerInvisiblesButton( button ){
        var $button = $(button);
        button.disabled = false;
        editor.on('poInvs', function( event, state ){
            $button[ state ? 'addClass' : 'removeClass' ]('inverted');
        });
        $button.click( function( event ){
            event.preventDefault();
            editor.setInvs( ! editor.getInvs() );
            return false;
        } );
        locoScope.tooltip.init($button);
        return true;
    }



    function registerCodeviewButton( button ){
         var $button = $(button);
         button.disabled = false;
         $button.click( function(event){
            event.preventDefault();
            var state = ! editor.getMono();
            $button[ state ? 'addClass' : 'removeClass' ]('inverted');
            editor.setMono(state);
            return false;
        } );
        locoScope.tooltip.init($button);
        return true;
    };



    function registerAddButton( button ){
        button.disabled = false;
        $(button).click( function( event ){
            event.preventDefault();
            // Need a placeholder guaranteed to be unique for new items
            var i = 1, baseid, msgid, regex = /(\d+)$/;
            msgid = baseid = 'New message';
            while( messages.get( msgid ) ){
                i = regex.exec(msgid) ? Math.max(i,RegExp.$1) : i;
                msgid = baseid+' '+( ++i );
            }
            editor.add( msgid );
            return false;
        } );
        return true;
    };



    function registerDelButton( button ){
        button.disabled = false;
        $(button).click( function(event){
            event.preventDefault();
            editor.del();
            return false;
        } );
        return true;
    };



    function registerDownloadButton( button, id ){
        button.disabled = false;
        $(button).click( function( event ){
            var form = button.form,
                path = filePath;
            // swap out path
            if( 'binary' === id ){
                path = path.replace(/\.po$/,'.mo');
            }
            form.path.value = path;
            form.source.value = messages.toString();
            // allow form to submit
            return true;
        } );
        return true;
    }

    
    // event handler that stops dead
    function noop( event ){
        event.preventDefault();
        return false;
    }


    /*/ dummy function for enabling buttons that do nothing (or do something inherently)
    function registerNoopButton( button ){
        return true;
    }*/
    

    
    /**
     * Update status message above editor.
     * This is dynamic version of PHP Loco_gettext_Metadata::getProgressSummary
     * TODO implement progress bar, not just text.
     */
    function updateStatus(){
        var t = translator,
            stats = editor.stats(),
            total = stats.t,
            fuzzy = stats.f,
            empty = stats.u,
            // Translators: Shows total string count at top of editor
            stext = sprintf( t._n('1 string','%s strings',total ), total.format(0) ),
            extra = [];
        if( locale ){
            // Translators: Shows percentage translated at top of editor
            stext = sprintf( t._('%s%% translated'), stats.p.replace('%','') ) +', '+ stext;
            // Translators: Shows number of fuzzy strings at top of editor
            fuzzy && extra.push( sprintf( t._('%s fuzzy'), fuzzy.format(0) ) );
            // Translators: Shows number of untranslated strings at top of editor
            empty && extra.push( sprintf( t._('%s untranslated'), empty.format(0) ) );
            if( extra.length ){
                stext += ' ('+extra.join(', ')+')';
            }
        }
        $('#loco-po-status').text( stext );
    }
    
    
    
    /**
     * Enable text filtering
     */
    function initSearchFilter( elSearch ){
        editor.searchable( loco.fulltext.init() );
        // prep search text field
        elSearch.disabled = false;
        elSearch.value = '';
        function showValidFilter( numFound ){
            $(elSearch.parentNode)[ numFound || null == numFound ? 'removeClass' : 'addClass' ]('invalid');
        }
        var listener = loco.watchtext( elSearch, function( value ){
            var numFound = editor.filter( value, true  );
            showValidFilter( numFound );
        } );
        editor
            .on( 'poFilter', function( event, value, numFound ){
                listener.val( value||'' );
                showValidFilter( numFound );
            } )
            .on( 'poMerge', function( event, result ){
                var value = listener.val();
                value && editor.filter( value );
            } )
        ;
    }    
    
    
    
    // resize function fits editor to screen, accounting for headroom and touching bottom of screen.
    var resize = function(){
        function top( el, ancestor ){
            var y = el.offsetTop||0;
            while( ( el = el.offsetParent ) && el !== ancestor ){
                y += el.offsetTop||0;
            } 
            return y;    
        }
        var fixHeight,
            minHeight = parseInt($(innerDiv).css('min-height')||0)
        ;
        return function(){
            var padBottom = 20,
                topBanner = top( innerDiv, document.body ),
                winHeight = window.innerHeight,
                setHeight = Math.max( minHeight, winHeight - topBanner - padBottom )
            ;
            if( fixHeight !== setHeight ){
                innerDiv.style.height = String(setHeight)+'px';
                fixHeight = setHeight;
            }
        };
    }();    

    // ensure outer resize is handled before editor's internal resize
    resize();
    $(window).resize( resize );

    // initialize editor    
    innerDiv.innerHTML = '';
    editor = loco.po.ed
        .init( innerDiv )
        .localise( translator )
    ;

    loco.po.kbd
        .init( editor )
        .add('save', saveIfDirty )
        .add('hint', locale && editable && onHintEvent || noop )
        .enable('copy','clear','enter','next','prev','fuzzy','save','invis','hint')
    ;

    // initialize toolbar button actions
    var buttons = {
        // help: registerNoopButton,
        save: editable && registerSaveButton,
        sync: editable && registerSyncButton,
        revert: registerRevertButton,
        // editor mode togglers
        invs: registerInvisiblesButton,
        code: registerCodeviewButton,
        // download buttons
        source: registerDownloadButton,
        binary: template ? null : registerDownloadButton
    };
    // POT only
    if( template ){
        buttons.add = editable && registerAddButton;
        buttons.del = editable && registerDelButton;
    }
    // PO only
    else {
        buttons.auto = registerAutoTranslateButton;
    }
    $('#loco-toolbar').find('button').each( function(i,el){
        var id = el.getAttribute('data-loco'), register = buttons[id];
        register && register(el,id) || $(el).hide();
    } );
    
    // disable submit on dummy form
    $(elForm).submit( noop );

    // enable text filtering
    initSearchFilter( document.getElementById('loco-search') );    

    // editor event behaviours
    editor
        .on('poUnsaved', function(){
            window.onbeforeunload = onUnloadWarning;
        } )
        .on('poSave', function(){
            updateStatus();
            window.onbeforeunload = null;
        } )
        .on('poHint', onHintEvent )
        .on('poUpdate', updateStatus )
        .on('poMeta', onMetaClick )
    ;
    
    // load raw message data
    messages.load( conf.podata );
    
    // ready to render editor
    editor.load( messages );
    
    // locale should be cast to full object once set in editor
    locale = editor.targetLocale;
    if( locale ){
        locale.isRTL() && $(innerDiv).addClass('trg-rtl');
    }
    // enable template mode when no target locale 
    else {
        editor.unlock();
    }

    // ok, editor ready
    updateStatus();

/*---------------------custom Code---------------*/

/*
    since version 1.1
    Google Translate Popup handlers
*/

newaddAutoTranslationBtn();


 // integrates auto traslator button in editor
 function newaddAutoTranslationBtn(){
    if($("#loco-toolbar").find("#cool-auto-translate-btn").length>0){
        $("#loco-toolbar").find("#cool-auto-translate-btn").remove();
    }
    const locoActions= $("#loco-toolbar").find("#loco-actions");
    const otherBtn='<button class="button has-icon icon-warn" id="atlt_reset_all">Reset Translations</button></fieldset>';
    const proActiveBtn='<fieldset><button id="cool-auto-translate-btn" class="button has-icon icon-translate">Auto Translate</button></fieldset>';
    locoActions.append(proActiveBtn);
    var translated=getTranslatedStrings(conf.podata);
    if(translated.length>0){
         locoActions.append(otherBtn);
    }
 
  }

  // open popup on autotranslate button click
$("#cool-auto-translate-btn").on("click",function(){
    createPopup();
    });
    // create auto translate popup
    function createPopup(){
        $( "#atlt-dialog" ).dialog({
            resizable: false,
            height: "auto",
            width: 400,
            modal: true,
            buttons: {
            Cancel: function() {
              $( this ).dialog( "close" );
            }
        }
        });
        }
    

 // Get the button that opens the modal
// var gTranslateBtn = document.getElementById("atlt_gtranslate_btn");

  // When the user clicks the button, open the modal 
$("#atlt_gtranslate_btn").on("click",function() {
    var container=$("#atlt_gtranslate_model");
    var defaultcode = window.conf.locale.lang?window.conf.locale.lang:null;
    switch(defaultcode){
        case 'bel':
        defaultlang='be';
        break;
        case 'he':
            defaultlang='iw';
            break;
        case'snd':
            defaultlang='sd';
        break;
        case 'jv':
            defaultlang='jw';
            break;
        default:
        defaultlang=defaultcode;
    break;
    }
    var arr = ['en','sq','am','ar','hy','az','eu','be','bn','bs','bg','ca','ceb','ny','zh-CN','zh-TW','co','hr','cs','da','nl','eo','et','tl','fi','fr','fy','gl','ka','de','el','gu','ht','ha','haw','iw','hi','hmn','hu','is','ig','id','ga','it','ja','jw','kn','kk','km','rw','ko','ku','ky','lo','la','lv','lt','lb','mk','mg','ms','ml','mt','mi','mr','mn','my','ne','no','or','ps','fa','pl','pt','pa','ro','ru','sm','gd','sr','st','sn','sd','si','sk','sl','so','es','su','sw','sv','tg','ta','tt','te','th','tr','tk','uk','ur','ug','uz','vi','cy','xh','yi','yo','zu'];
   if(arr.includes(defaultlang)){
        googleTranslateElementInit();
    }
   else{
    container.find(".string_container").after("<strong>Google Automatic Translator Does not support this language.</strong>");
    container.find(".string_container").hide();
    container.find(".save_it").hide();
   }
   // get only plain strings 
    var  plainStrArr= filterRawObject(conf.podata,"plain");
   
     if (plainStrArr.length>0) {
           printStringsInPopup(plainStrArr, type="google");
     }else{
        container.find(".string_container").after("<strong>There is no plain string available for translations.</strong>");
        container.find(".string_container").hide();
        container.find(".save_it").hide();
     }
        $("#atlt-dialog").dialog("close");
         $("#atlt_gtranslate_model").fadeIn("slow");

    });
    
    //scroll down model on language changes
    $("#google_translate_element").change(function(){
        var container=$("#atlt_gtranslate_model");
        container.find(".string_container").scrollTop(0);
        var scrollHeight= container.find('.string_container').get(0).scrollHeight;
        var scrollSpeed= 10000;
        if(scrollHeight > scrollSpeed){
            scrollSpeed = scrollHeight;
        }
        if(scrollHeight!==undefined && scrollHeight>100) 
        {
            container.find(".my_translate_progress").fadeIn("slow"); 
            setTimeout(() => {
                container.find(".string_container").animate({ 
                    scrollTop:scrollHeight+2000
                },scrollSpeed*2,'linear');
            }, 2000);
          
            container.find('.string_container').on('scroll', function() {
                if($(this).scrollTop() + $(this).innerHeight() + 50 >= $(this)[0].scrollHeight) {
                    setTimeout(() => {
                        container.find(".save_it").prop("disabled",false);
                        container.find(".gtstats").fadeIn("slow");
                        container.find(".my_translate_progress").fadeOut("slow");
                        container.find(".string_container").stop();
                        $('body').css('top', '0');
                    }, 1500);
                }
            });

            if( container.find('.string_container').innerHeight() + 10 >= scrollHeight) {
                setTimeout(() => {
                    container.find(".save_it").prop("disabled",false);
                    container.find(".gtstats").fadeIn("slow");
                    container.find(".my_translate_progress").fadeOut("slow");
                    container.find(".string_container").stop();
                    $('body').css('top', '0');
                }, 1500);
            }
        }
        else{
            setTimeout(() => {
                container.find(".save_it").prop("disabled",false);
                container.find(".gtstats").fadeIn("slow");
            }, 2000);
        }
    });
   
  
 // Get the button that opens the modal
// var gTranslateBtn = document.getElementById("atlt_gtranslate_btn");

  // When the user clicks the button, open the modal 
  $("#atlt_yandex_transate_btn").on("click",function() {
      var container=$("#atlt_strings_model");
    var defaultcode = window.conf.locale.lang?window.conf.locale.lang:null;
    switch(defaultcode){
        case 'bel':
        defaultlang='be';
        break;
        case 'he':
            defaultlang='iw';
            break;
        case'snd':
            defaultlang='sd';
        break;
        case 'jv':
            defaultlang='jw';
            break;
        default:
        defaultlang=defaultcode;
     break;

    }
    container.find(".save_it").prop("disabled",true);
    container.find(".ytstats").each(function(){
        $(this).hide();
    });
    localStorage.setItem("lang",defaultlang);
    var arr = ['af','am', 'ar','az','ba','be','bg','bn', 'bs','ca','ceb','cs','cy','da','de','el','en','eo','es','et','eu', 'fa', 'fi','fr','ga','gd','gl','gu', 'he','hi','hr','ht','hu','hy','id','is','it','ja','jv','ka','kk','km','kn','ko','ky','la','lb','lo','lt','lv','mg','mhr','mi','mk', 'ml','mn', 'mr','mrj','ms','mt','my','ne','nl','no','pa','pap','pl','pt','ro','ru','si','sk','sl','sq', 'sr', 'su', 'sv','sw','ta','te','tg','th','tl','tr','tt','udm','uk','ur','uz','vi','xh','yi', 'zhCN'];
   if(arr.includes(defaultlang)){
     //   googleTranslateElementInit();
    }
   else{
    container.find(".string_container").after("<strong>Yandex Automatic Translator Does not support this language.</strong>");
    container.find(".string_container").hide();
    container.find(".save_it").hide();
    $("#ytWidget").hide();
   }
   // get only plain strings 
    var  plainStrArr= filterRawObject(conf.podata,"plain");
     if (plainStrArr.length>0) {
           printStringsInPopup(plainStrArr, type="yandex");
     }else{
        $("#ytWidget").hide();
        container.find(".string_container").after("<strong>There is no plain string available for translations.</strong>");
        container.find(".string_container").hide();
        container.find(".save_it").hide();
     }
        $("#atlt-dialog").dialog("close");
        container.addClass("yandex-translator").fadeIn("slow");

    });


    /*
    load strings in popup table 
    */
   function  printStringsInPopup(jsonObj,type){
    var replaceit={};
    var html='';
    var totalTChars=0;
    var index=1;
    if(jsonObj){
    for (const key in jsonObj) {
     
        if (jsonObj.hasOwnProperty(key)) {
            const element = jsonObj[key];
            if(element.source!=''){
    
                if(type=="google" || type=="yandex"){
               html +='<tr id="'+key+'" ><td>'+index+'</td><td  class="notranslate source">'+element.source+'</td>';
                }
                else{
                    if(key>2500){
                        break;
                    }
                    html +='<tr id="'+key+'" ><td>'+index+'</td><td  class="notranslate source">'+element.source+'</td>';
                }
               if(type=="google"){
                     html +='<td class="target translate">'+element.source+'</td></tr>';
               }
               else if(type=="yandex"){
                html +='<td translate="yes" class="target translate">'+element.source+'</td></tr>';
                 }
               else{
                     html +='<td class="target translate"></td></tr>';
               }
               index++;
               totalTChars +=element.source.length;
             }
           }
       }
   if(type=="google"){
        $(".gtstats").each(function(){
            $(this).find(".totalChars").html(totalTChars);
           });

    }else if(type=="yandex"){
        $(".ytstats").each(function(){
            $(this).find(".totalChars").html(totalTChars);
           });
    }else{
        $(".dtstats").each(function(){
            $(this).find(".totalChars").html(totalTChars);
           });
    }
      
   }    
    if(type=="google"){
        $("#string_tbl").append(html);
    }else if(type=="yandex"){
        $("#yandex_string_tbl").append(html);
    }else{
        $("#deepl_string_tbl").append(html);
    }
}

    /*
    Save Translated Strings
    */
    var rpl = {
        '"% s"': '"%s"',
        '"% d"': '"%d"',
        '"% S"': '"%s"',
        '"% D"': '"%d"',
        '% s': ' %s ',
        '% S': ' %s ',
        '% d': ' %d ',
        '% D': ' %d ',
        '٪ s': ' %s ',
        '٪ S': ' %s ',
        '٪ d': ' %d ',
        '٪ D': ' %d ',
        '٪ س': ' %s '
    };
 var translatedObj=[];
 $(".save_it").on("click",function(){
     $("#stringTemplate tbody tr").each(function(index){
         var string=$(this).find("td.target").text();
         translatedObj.push(string);
     });
        saveTranslatedStrings(translatedObj);
    
      $(".atlt_custom_model").fadeOut("slow");
      
 });
 $(".deepl_save_it").on("click",function(){
   
    $("#deepl-transtmplt tbody tr").each(function(index){
        var string=$(this).find("td.target").text();
     
        translatedObj.push(string);
    });
       saveTranslatedStrings(translatedObj);
     $("#atlt_deepl_model").fadeOut("slow");
});

// mark unsaved  after ajax translation process 
function markUnsavedString(){
    const unSavedString = JSON.parse(localStorage.getItem('unSavedString'));
   
    for(var x=0;x<=unSavedString.length;x++){
     var source = unSavedString[x];
     jQuery("#po-list-tbody div[for='po-list-col-source'] div").filter(function(index){
          return jQuery(this).text() == source 
       }).addClass('po-unsaved');
     }
   }

   // save translated string in popup
 function saveTranslatedStrings(translatedObj){
    var  plainStrArr= filterRawObject(conf.podata,"plain");
    const saveBtn=$('[data-loco="save"]');
    if(translatedObj!==undefined && translatedObj.length){
       for(i=0;i< translatedObj.length;i++){
               var text = translatedObj[i];
               if(  plainStrArr[i] === undefined ){
                   break;
               }
               plainStrArr[i].target = strtr(text,rpl) ;
       }
   }

    messages = loco.po.init( locale ).wrap( conf.powrap );
     // ready to render editor
     messages.load(conf.podata);

    markUnsaved(plainStrArr);
     // editor event behaviours
     editor
     .on('poUnsaved', function(){
         window.onbeforeunload = onUnloadWarning;
     } )
     .on('poSave', function(){
         updateStatus();
         window.onbeforeunload = null;
     } )
     .on( 'poUpdate', updateStatus );

     // ready to render editor
     editor.load(messages);
      saveBtn.addClass( 'button-primary loco-flagged' ).removeAttr("disabled");
     updateStatus();
}

// replace placeholders in strings
 function strtr(s, p, r) {
    return !!s && {
        2: function () {
            for (var i in p) {
                s = strtr(s, i, p[i]);
            }
            return s;
        },
        3: function () {
            return s.replace(RegExp(p, 'g'), r);
        },
        0: function () {
            return;
        }
    }[arguments.length]();
}


// filter string based upon type
function getTranslatedStrings(rawArray){
    filterdArr=[];
   return filterdArr=rawArray.filter((item,index)=>{
    if((item.target!=="" && item.source!='')&&  item.target!==undefined)
    {
        return true;
    }else{
        return false;
    }
    });
}
 
// filter string based upon type
function filterRawObject(rawArray,filterType){
    filterdArr=[];
   return filterdArr=rawArray.filter((item,index)=>{
        if((item.source!=="" && item.source!==undefined) && (item.target===undefined || item.target=="")){
            if( ValidURL(item.source)){
                return false;
            }
        if(filterType=="html"){
                if(isHTML(item.source)){
                    return true;
                }else if(isAllowedChars(item.source) && isPlacehodersChars(item.source)===false){
                    return true;
                }else{
                return false;
                } 
        }else{
            if(isHTML(item.source)){
                return false;
             } 
             else if(isPlacehodersChars(item.source)){
                return true;
             }
             else if(isSpecialChars(item.source)){
                   return false;
             }else if( item.source.includes('#') ) {
                return false;
             }else{
                return true;
             }      
        }    
        }        
      });
}


// detect String contain URL
function ValidURL(str) {
      var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    if(!pattern.test(str)) {
      return false;
    } else {
      return true;
    }
  }
  // detect Valid HTML in string
function isHTML(str){
    var rgex=/<(?=.*? .*?\/ ?>|br|hr|input|!--|wbr)[a-z]+.*?>|<([a-z]+).*?<\/\1>/i;
    if(str!==undefined){
        return  rgex.test(str); 
    }else {
        return false;
    }
}
//  check special chars in string
function isSpecialChars(str){
    var rgex=/[@#^$%&*{}|<>]/g;
    if(str!==undefined){
        return  rgex.test(str); 
    }else {
        return false;
    }
}
// allowed special chars in HTML string
function isAllowedChars(str){
    var rgex=/[!@#$%^&*(),?":|<>]/g;
    if(str!==undefined){
        return  rgex.test(str); 
    }else {
        return false;
    }
}

// allowed special chars in plain text
function isPlacehodersChars(str){
    var rgex=/%s|%d/g;
    if(str!==undefined){
        return  rgex.test(str); 
    }else {
        return false;
    }
}
// check string contain curly brackets
function isContainChars(str){
    var rgex=/[{}[]/g;
    if(str!==undefined){
        return  rgex.test(str); 
    }else {
        return false;
    }
}

// mark unsaved strings
function markUnsaved(data){
  
    for (const key in data) {
           
        if (data.hasOwnProperty(key)) {
             let element = data[key]['message'];
                    if(data[key]['source']==""){
                      continue;
                    }
                  //   flagFuzzy && message.fuzzy(0,true);
                    editor.pasteMessage(element);
                    if( element === editor.active ){
                        editor.setStatus(element);
                    }
                    editor.unsave(element,0);
                      
        }
     }

}

// format numbers
function atltFormatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
/*
    since version 1.2
    Deepl Translate Popup handlers
*/
 // Get the button that opens the modal
 // Get the <span> element that closes the modal
var closeDeeplBtn = document.getElementsByClassName("close_deepl")[0];
// When the user clicks on <span> (x), close the modal
closeDeeplBtn.onclick = function() {
  $("#atlt_deepl_model").fadeOut("slow");
}
 var deeplTranslateBtn = document.getElementById("atlt_deepl_btn");
 jQuery("#deepl-transtmplt").hide();
  // When the user clicks the button, open the modal 
  deeplTranslateBtn.onclick = function() {
    var defaultcode = window.locoConf.locale.lang?window.locoConf.locale.lang:null;
    defaultlang=defaultcode;
    var container=$("#atlt_deepl_model");
    var domainName=window.locoConf.project.domain;
    var arr = ['en','es','fr','it','nl','pl','pt','pt-br','ru','ja','zh','de'];
    // var arr = ['en','es','sq','am','ar','hy','az','eu','be','bn','bs','bg','ca','ceb','ny','zh-CN','zh-TW','co','hr','cs','da','nl','eo','et','tl','fi','fr','fy','gl','ka','de','el','gu','ht','ha','haw','iw','hi','hmn','hu','is','ig','id','ga','it','ja','jw','kn','kk','km','rw','ko','ku','ky','lo','la','lv','lt','lb','mk','mg','ms','ml','mt','mi','mr','mn','my','ne','no','or','ps','fa','pl','pt','pa','ro','ru','sm','gd','sr','st','sn','sd','si','sk','sl','so','es','su','sw','sv','tg','ta','tt','te','th','tr','tk','uk','ur','ug','uz','vi','cy','xh','yi','yo','zu'];
    // console.log(filterRawObject(conf.podata,"plain")); 
    if(arr.includes(defaultlang)){
            var  plainStrArr= filterRawObject(conf.podata,"plain");
    
                if (plainStrArr.length>0) {
                    $("#download_deepl_doc").data("domain-name",domainName);
                    printStringsInPopup(plainStrArr, type="deepl");
                }else{
                    container.find(".string_container").hide();
                    $(".deepl_save_it").hide();
                    $("#download_deepl_doc").hide();
                    $("#deepl-open-file").hide();
                    $("#deepl-btn-tpload").hide();
                    $("table.deepl_steps").hide();
                    container.find(".string_container").before("<strong>There is no plain string available for translations.</strong>");
                    
                }
                $("#atlt-dialog").dialog("close");
                    $("#atlt_deepl_model").fadeIn("slow");
        }else{
            container.find(".string_container").after("<strong>Deepl Translator Does not support this language.</strong>");
            container.find(".string_container").hide();
            $(".deepl_save_it").hide();
            $("#atlt-dialog").dialog("close");
            $("#atlt_deepl_model").fadeIn("slow");
            $("#download_deepl_doc").hide();
            $("#deepl-open-file").hide();
            $("#deepl-btn-tpload").hide();
            $("table.deepl_steps").hide();
        }
        jQuery("body").on("click", "#deepl-btn-tpload", function (event) {
            upload_deepl_file(domainName,defaultcode,plainStrArr);
           
        });

    }
    $("#download_deepl_doc").on("click",function(){
        generate_doc_file(this);
     });
     function generate_doc_file(thisBtn){
        var stringsTxt="";
        $("#deepl_stringTemplate tbody tr").each(function(index){
            var string=$(this).find("td.source").text();
              stringsTxt+='™'+string;
        });
        var columnTitles=stringsTxt.split(/\™/g);
        var domainName=$(thisBtn).data("domain-name");
        const doc = new docx.Document();
        const tableRow = new docx.Table({
        rows:columnTitles.map((title) => { 
            return new docx.TableRow({
                children:[
                  new docx.TableCell({
                  children: [new docx.Paragraph(title+' '+'\n\n')],
                  })
                ]
            })//child close
        })
        });
        doc.addSection({
          children: [
            tableRow
          ],  
        }),
        docx.Packer.toBlob(doc).then(blob => {
          saveAs(blob, domainName+"-strings.docx");
         // console.log("Document created successfully");
          $(thisBtn).prop("disabled",true);
        });  
    }
      /**
   * This function is used for file validation
   */
  function matchRuleShort(str, rule) {
    var escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return new RegExp("^" + rule.split("*").map(escapeRegex).join(".*") + "$").test(str);
  } // close validation function
  /**
   * This function is used for upload deepl translation file.
   */
  function upload_deepl_file(domainName,defaultcode,plainStrArr){
    var filename = domainName + '-strings';
    var fullPath = document.getElementById("deepl-open-file").value;
    var res = defaultcode.toUpperCase();
    var valid_exte = filename +" "+res+".docx";
    var valid_ext = valid_exte.toUpperCase();
    jsonObj = plainStrArr;
    var arrInputs = $("#deepl-open-file");
    var allowedFiles = [valid_ext];
    var wild_char = domainName + "-strings"+" "+"*"+" "+res+".docx";
    var wild_chars = domainName + "-strings"+" "+res+" "+"*"+".docx".toUpperCase();
    var wild_char_ext = wild_char.toUpperCase();
    var wild_chars_ext = wild_chars.toUpperCase();
    if (fullPath) {
        var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
        var filename = fullPath.substring(startIndex);
        if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
            file = filename.substring(1);
            filename = file.toUpperCase();
        }
        if(matchRuleShort(filename,wild_char_ext) || matchRuleShort(filename,valid_ext) || matchRuleShort(filename,wild_chars_ext)){
           lblError.innerHTML = "";
           var input = document.getElementById('deepl-open-file');
            var reader = new FileReader();
            function nullGetter(part, scopeManager) {
        // part.module can be "loop", "rawxml", or empty, (or any other module name that you use)
        if (!part.module) {
          // part.value contains the content of the tag, eg "name" in our example
          return '{' + part.value + '}';
        }
        if (part.module === "rawxml") {
          return "";
        }
        return "";
        }
        reader.onload = function() {
          jQuery("#deepl_stringTemplate").hide();
          jQuery("#deepl-transtmplt").show();
        var zip = new JSZip(reader.result);
        var br = document.createElement("br");
        var doc = new window.docxtemplater().loadZip(zip);
        var text = doc.getFullText();
        // var arr=text.split(/\©/g);
        // var arr=text.split(/\ \n/g);
        var arr=text.split(/\n\n/g);
    
         var filtered = arr.filter(function (el) {
          return el != " ";
        });
         //node.innerText = filtered;
         var demo="";
         var index=1;
        for (const key in jsonObj) {
            if (jsonObj.hasOwnProperty(key)) {
            const element = jsonObj[key];
            if(element.source!='' && filtered[key]!= undefined){
                if(key>2500){
                    break;
                }
                demo +='<tr id="'+key+'" ><td>'+index+'</td><td  class="notranslate source">'+element.source+'</td>';
                demo += '<td class="target"  id="output"> '+filtered.slice(1)[key]+'</td></tr>';
            }
            index++;
            }
        }
        jQuery("#deepbody").append(demo);
        };
        reader.readAsBinaryString(input.files[0]);
         $(".deepl_save_it").prop("disabled",false);
         $("#deepl-btn-tpload").prop('disabled', true);
        }
         else{
                lblError.innerHTML = "Please upload files having extensions: <b>" + allowedFiles.join(', ') + "</b> only.";
                return false;
        }
    }
  } // Close upload translation file function
/*---------------------end------------------*/


   // integrate reset string traslation button
   $("#atlt_reset_all").on("click",function(){
    swal("What type of strings do you want to reset?",
        {
        dangerMode: true,
        icon: "warning",
        confirmButtonColor: '#8CD4F5',
      
        buttons: {
          plain: {
            text: "Plain Text Strings",
            value: "plain",
            class:"danger"
          },
      /*    html: {
            text: "HTML Strings",
            value: "html",
          }, */
          all: {
            text: "All Strings",
            value: "all",
          },
          cancel: {
            text: "Cancel",
            value: null,
            visible: true,
            className: "",
            closeModal: false,
          },
        },
      })
      .then((value) => {
        switch (value) {
          case "all":
            resetTranslations(value);
            swal("Done!", "You have successfully reset all strings translations. Just close this popup & SAVE!","success");;
            break;
          case "plain":
            resetTranslations(value);
            swal("Done!", "You have successfully reset all plain text strings translations. Just close this popup & SAVE!", "success");
            break;
          case "html":
            resetTranslations(value);
            swal("Done!", "You have successfully reset all strings with HTML translations. Just close this popup & SAVE!", "success");
            break;
          default:
            swal("Cancelled, Just close this popup!");
        }
      });
      
});

// reset string array 
function resetTransArr(tranArr,type){
  var  resetStrs=[];
 return  resetStrs=tranArr.map(function(item){
        if(item.source!==undefined && item.target!==undefined ){
           if(type=="html"){
               if((isHTML(item.source))){
               item.target="";
            }else if(isAllowedChars(item.source) && isPlacehodersChars(item.source)===false){
                item.target="";
            }
            }
           if(type=="plain"){
            if( isPlacehodersChars(item.source)){
                item.target="";
            }
            else if(isHTML(item.source) || isAllowedChars(item.source)){
              }else{
                item.target="";
              }
            }
            if(type=="all"){
            item.target="";
            }     
        return item;
    }
    });
}

// integrate reset translation button
function resetTranslations(type){
    var resetArr=[];
    const saveBtn=$('[data-loco="save"]');
    if(conf.podata!==undefined){
        if(type=="plain"){
          resetArr=resetTransArr(conf.podata,"plain");
        }else if(type=="html"){
            resetArr=resetTransArr(conf.podata,"html");
        }else{
            resetArr=resetTransArr(conf.podata,"all");
        }
         messages = loco.po.init( locale ).wrap( conf.powrap );
         messages.load(resetArr);
         // editor event behaviours
        editor
        .on('poUnsaved', function(){
            window.onbeforeunload = onUnloadWarning;
        } )
        .on('poSave', function(){
            updateStatus();
            window.onbeforeunload = null;
        } )
        .on( 'poUpdate', updateStatus );
    
        // ready to render editor
        editor.load(messages);
        saveBtn.addClass( 'button-primary loco-flagged' ).removeAttr("disabled");
        updateStatus();
}
}

    // clean up
   // delete window.locoConf;
    //conf = buttons = null;


}( window, jQuery );