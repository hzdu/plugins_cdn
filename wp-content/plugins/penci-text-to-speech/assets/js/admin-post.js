(function ($) {

    "use strict";

    $(document).ready(function () {


        /***********************
         *     Variables.      *
         ***********************/

        /** Show warning if we try to generate audio with unsaved changes. */
        let unsaved = false;

        // noinspection JSUnresolvedVariable
        /** Data from WP. */
        let PenciTextToSpeech = window.PenciTextToSpeech;

        /** Show warning if we try to close Speech Template editor with unsaved changes. */
        let STEditorUnsaved = false;

        /** Flag to detect pressing control in iFrame. */
        let ctrlIsPressed = false;

        /** Iframe preloader. */
        let $iFramePreloader = $('#penci-texttospeech-speech-template-editor-box .mdp-iframe-preloader');

        /** Get Url to open in iFrame. */
        let postURL = $('#penci-texttospeech-add-speech-template-btn').data('post-url');

        /** Page preview in iframe. */
        let $iFrame = $('#penci-texttospeech-speech-template-editor-iframe');

        /** Select with ST. */
        let $stSelect = $('#penci-texttospeech-speech-templates-template');

        /** Get reference index in global array. */
        let STIndex = $stSelect.parent().data('mdc-index');
        let STSelect;

        if ('undefined' !== typeof STIndex) {

            /** Get ST select. */
            STSelect = window.MerkulovMaterial[STIndex];

            /** Enable/Disable buttons on ST change. */
            STSelect.listen('MDCSelect:change', STChange);
            STChange(); // Run on load.

        }

        /** xPath input on element edit form. */
        let $xPathInput = $('#penci-texttospeech-element-form-xpath');

        /** Timer identifier. */
        let xPathTypingTimer;

        /** time in ms. */
        let doneXPathTypingInterval = 1500;


        /***********************
         *      Events.
         ***********************/

        /** If post use Gutenberg editor. */
        if (document.body.classList.contains('block-editor-page') &&
            !document.body.classList.contains('vc_editor')
        ) {
            wp.data.subscribe(gutenbergCaster);
        }

        /** Triggers change in all input fields including text type. */
        $(':input').on('change', function () {
            unsaved = true;
        });

        /** Click on Create Audio Button. */
        $(document).on('click', '#penci_texttospeech_generate', createAudio);

        /** Click Remove Audio Button. */
        $(document).on('click', '#penci_texttospeech_remove', removeAudio);

        /** Close button click: Hide Speech Template Editor. */
        $(document).on('click', '#penci-texttospeech-speech-template-editor-box header > .mdp-close-btn', closeSTEditor);

        /** Save Template click: Hide Speech Template Editor. */
        $(document).on('click', '#penci-texttospeech-speech-template-editor-box .mdp-st-save-btn', saveSpeechTemplate);

        /** Add new Speech Template Button. */
        $(document).on('click', '#penci-texttospeech-add-speech-template-btn', addNewSpeechTemplate);

        /** Edit click: Edit Speech Template with Editor. */
        $(document).on('click', '.penci-texttospeech-st-controls .penci-texttospeech-edit', editSpeechTemplate);

        /** Make selected Speech Template as default. */
        $(document).on('click', '.penci-texttospeech-st-controls .penci-texttospeech-make-default', makeSpeechTemplateDefault);

        /** Remove Speech Template Button. */
        $(document).on('click', '.penci-texttospeech-st-controls .penci-texttospeech-delete', removeSpeechTemplate);

        /** Click on cross ( Remove element from list) . */
        $(document).on('click', '#penci-texttospeech-st-list .mdp-remove-item', removeElFromList);

        /** Click on Edit element in the list. */
        $(document).on('click', '#penci-texttospeech-st-list .mdp-edit-item', editElement);

        /** On xPath change. */
        $(document).on('change', '#penci-texttospeech-element-form-xpath', doneXPathTyping);

        /** On keyup, start the countdown. */
        $(document).on('keyup', '#penci-texttospeech-element-form-xpath', xPathKeyUp);

        /** On keydown, clear the countdown. */
        $(document).on('keydown', '#penci-texttospeech-element-form-xpath', xPathKeyDown);

        /** Click on element in list: Scroll iframe to element selected. */
        $(document).on('click', '#penci-texttospeech-st-list li', liClick);

        /** Click on Add Element menu items. */
        $(document).on('click', '.mdp-side-panel footer .mdc-menu .mdp-add-element', addElement);
        $(document).on('click', '.mdp-side-panel footer .mdc-menu .mdp-add-text', addText);
        $(document).on('click', '.mdp-side-panel footer .mdc-menu .mdp-add-pause', addPause);

        /** Close button click: Hide Edit Element Form. */
        $(document).on('click', '#penci-texttospeech-element-form .mdp-close-btn', closeElementForm);
        $(document).on('click', '#penci-texttospeech-element-form', closeElementFormOverlay);

        /** Cancel button click: Hide Edit Element Form. */
        $(document).on('click', '#penci-texttospeech-element-form footer .mdp-cancel-btn', closeElementForm);

        /** Add/Save button click: Save and Close Edit Element Form. */
        $(document).on('click', '#penci-texttospeech-element-form footer .mdp-save-btn', saveElementForm);

        /** Enable/Disable save button on name field change. Name field is required. */
        $(document).on('keyup keypress blur change', '#penci-texttospeech-element-form-name', onNameChange);

        /** Enable/Disable save ST button on Template Name field change. Name field is required. */
        $(document).on('keyup keypress blur change', '#penci-texttospeech-template-name', enableSTSaveBtn);

        /** Remove all highlights when leaving iFrame. */
        $iFrame.on('mouseleave', iFrameLeave);

        /** After iFrame loaded. */
        $iFrame.on('load', iFrameLoaded);


        /***********************
         *      Functions.
         ***********************/

        /**
         * On keydown, clear the countdown.
         **/
        function xPathKeyDown() {

            clearTimeout(xPathTypingTimer);

        }

        /**
         * On keyup, start the countdown.
         **/
        function xPathKeyUp() {

            clearTimeout(xPathTypingTimer);
            xPathTypingTimer = setTimeout(doneXPathTyping, doneXPathTypingInterval);

        }

        /**
         * User is "finished typing" do something
         **/
        function doneXPathTyping(e) {

            /** Stop timer if filed lost focus. */
            if ('undefined' !== typeof e) {
                clearTimeout(xPathTypingTimer);
            }

            /** Get new xPath. */
            let xPath = $xPathInput.val();

            /** Try to get content by new xPath. */
            let content = getContentByXPath(xPath);

            let index = $('#penci-texttospeech-element-form-content').parent().data('mdc-index');

            /** Get content textarea obj. */
            let MDCTextArea;
            MDCTextArea = window.MerkulovMaterial[index];

            /** Set new value to textarea. */
            MDCTextArea.value = content;

        }

        /**
         * Enable/Disable buttons on ST change.
         **/
        function STChange() {

            /** Get selected template. */
            let st = $stSelect.val();

            let $edit = $('.penci-texttospeech-st-controls .penci-texttospeech-edit');
            let $makeDefault = $('.penci-texttospeech-st-controls .penci-texttospeech-make-default');
            let $delete = $('.penci-texttospeech-st-controls .penci-texttospeech-delete');

            let defaultST = $makeDefault.data('default-for-post-type');

            if ('content' === st) {

                $makeDefault.html('outlined_flag');

                /** Disable Edit/Default/Delete buttons */
                $edit.prop('disabled', true);
                $makeDefault.prop('disabled', true);
                $delete.prop('disabled', true);

            } else if (defaultST !== st) {

                $makeDefault.html('outlined_flag');

                /** Enable Edit/Default/Delete buttons */
                $edit.prop('disabled', false);
                $makeDefault.prop('disabled', false);
                $delete.prop('disabled', false);

            } else if (defaultST === st) {

                $makeDefault.html('flag');

                /** Enable Edit/Default/Delete buttons */
                $edit.prop('disabled', false);
                $makeDefault.prop('disabled', false);
                $delete.prop('disabled', false);

            } else {

                /** Enable Edit/Default/Delete buttons */
                $edit.prop('disabled', false);
                $makeDefault.prop('disabled', false);
                $delete.prop('disabled', false);

            }

        }

        /**
         * Logic for Gutenberg editor.
         **/
        function gutenbergCaster() {

            if (!wp.data.select('core/editor')) {
                return;
            }

            let isSavingPost = wp.data.select('core/editor').isSavingPost();
            let isAutosavingPost = wp.data.select('core/editor').isAutosavingPost();
            let postStatus = wp.data.select('core/editor').getCurrentPost().status;

            if (isSavingPost && !isAutosavingPost) {

                if ('publish' === postStatus) {

                    /** Post Saved First Time. */
                    let $warning = $('.mdp-warning');
                    if ($warning.length) {
                        $warning.html('Refresh this page to see Penci Text To Speech controls');

                        setTimeout(function () {
                            location.reload();
                        }, 800);
                    }

                }

                unsaved = false;

            }

        }

        /**
         * Send AJAX with post id and run creating Audio.
         * Since version 3+, we send speech template additionally.
         **/
        function createAudio(e) {
            e.preventDefault();

            if ($(this).hasClass('is-busy')) {
                return;
            }

            /** For Gutenberg. */
            let gutenbergUnsaved = false; // If there are unsaved changes.
            if (document.body.classList.contains('block-editor-page')) {
                if (wp.data.select('core/editor')) {
                    if (wp.data.select('core/editor').isEditedPostDirty()) {
                        gutenbergUnsaved = true;
                    }
                }
            }

            if (unsaved || gutenbergUnsaved) {
                if (!confirm('It looks like you made changes and did not save it. Continue anyway?')) {
                    return;
                }
            }

            /** Disable Button. */
            $(this).addClass('is-busy').attr('disabled', true);

            let data = {
                action: 'gspeak',
                nonce: PenciTextToSpeech.nonce,
                post_id: PenciTextToSpeech.post_id,
                stid: $stSelect.val()
            };

            $.post(ajaxurl, data, function (response) {

                /** Add audio player if audio file is ready. */
                if (response.success) {

                    location.reload();

                } else {

                    /** Show Error message to user. */
                    showErrorMsg(response);

                }

            })
                .fail(function (response) {

                    /** Show Error message to user. */
                    showErrorMsg(response);

                })
                .always(function () {

                    /** Enable Button. */
                    $('#penci_texttospeech_generate').removeClass('is-busy').attr('disabled', false);

                });

        }

        /**
         * Show Alert with Error.
         **/
        function showErrorMsg(err) {

            console.error(err);

            if (err.message) {
                window.alert('ERROR:\n ' + err.message);
            } else if (err.responseText) {
                window.alert('ERROR:\n ' + err.responseText);
            } else {
                window.alert('ERROR:\n ' + err);
            }

        }

        /**
         * Click on Remove Audio Button.
         **/
        function removeAudio(e) {
            e.preventDefault();

            if ($(this).hasClass('is-busy')) {
                return;
            }

            /** Confirm deleting. */
            if (!confirm('Are you sure you want to delete the audio version of this post?')) {
                return;
            }

            /** Disable Button. */
            $(this).addClass('is-busy').attr('disabled', true);

            let data = {
                action: 'remove_audio',
                nonce: PenciTextToSpeech.nonce,
                post_id: PenciTextToSpeech.post_id
            };

            $.post(ajaxurl, data, function (response) {

                /** Add audio player if audio file is ready. */
                if (response === 'ok') {
                    location.reload();
                }

            })
                .fail(function () {
                    window.alert("error");
                })
                .always(function () {

                    /** Enable Button. */
                    $('#penci_texttospeech_generate').removeClass('is-busy').attr('disabled', false);
                });

        }

        /**
         * Remove Selected Speech Template.
         **/
        function removeSpeechTemplate(e) {
            e.preventDefault();

            /** Confirm deletion. */
            if (!confirm('Are you sure you want to delete this template?')) {
                return;
            }

            /** Get ID of st to remove. */
            let STID = $stSelect.val();

            /** Prepare Speech Template object. */
            let ST = {};
            ST.id = STID;
            ST.name = '';
            ST.elements = [];

            /** Convert object to JSON string. */
            ST = JSON.stringify(ST);

            /** Send by AJAX to add/update new ST. */
            let data = {
                action: 'process_st',
                nonce: PenciTextToSpeech.nonce,
                st: ST,
                delete: true // Delete
            };

            $.post(ajaxurl, data, function (response) {

                /** Remove select item on success. */
                if (response.success) {

                    /** Get reference index in global array. */
                    let index = $stSelect.parent().data('mdc-index');
                    let STSelectField = window.MerkulovMaterial[index];

                    /** Select first template. */
                    STSelectField.selectedIndex = 0

                    let $li = $stSelect.parent().find('.mdc-list li[data-value="' + STID + '"]');
                    $li.remove();

                } else {

                    /** Show Error message to user. */
                    showErrorMsg(response);

                }

            })
                .fail(function (response) {

                    /** Show Error message to user. */
                    showErrorMsg(response);

                });

        }

        /**
         * Make selected Speech Template as default.
         **/
        function makeSpeechTemplateDefault(e) {

            /** Stop reloading. */
            e.preventDefault();

            /** Speech Template ID. */
            let STID = $stSelect.val();

            /** Current Post Type. */
            let postType = getPostType();

            /** Set as default by AJAX. */
            let data = {
                action: 'set_default_st',
                nonce: PenciTextToSpeech.nonce,
                stid: STID,
                postType: postType,
            };

            $.post(ajaxurl, data, function (response) {

                /** ST was set as default. */
                if (response.success) {

                    $('.penci-texttospeech-st-controls .penci-texttospeech-make-default').html('flag').prop('disabled', true);

                } else {

                    /** Show Error message to user. */
                    showErrorMsg(response);

                }

            })
                .fail(function (response) {

                    /** Show Error message to user. */
                    showErrorMsg(response);

                });

        }

        /**
         * Return current post type, based on body classes.
         **/
        function getPostType() {
            let attrs;
            let postType;

            postType = null;

            /** Look to see what type of post type we're working with. */
            attrs = $('body').attr('class').split(' ');

            $(attrs).each(function () {

                if ('post-type-' === this.substr(0, 10)) {

                    postType = this.split('post-type-');
                    postType = postType[postType.length - 1];

                    // noinspection UnnecessaryReturnStatementJS
                    return;

                }

            });

            return postType;

        }

        /**
         * Edit Speech Template.
         **/
        function editSpeechTemplate(e) {

            /** Stop reloading. */
            e.preventDefault();

            /** Get Save Button. */
            let $saveBtn = $('.mdp-side-panel > footer .mdp-st-save-btn');

            /** Set 'Save' label for Save Button. */
            $saveBtn.find('.mdc-button__label').html('Save Speech Template');

            /** Mark this speech template as existing. */
            $saveBtn.data('is-new', false);

            /** Show Speech Template Editor. */
            showSpeechTemplateEditor();

        }

        /** Get Speech Template data by ID via AJAX. */
        function getSpeechTemplateByID(STID) {

            if ('content' === STID) {
                return;
            }

            /** Send by AJAX to get ST data. */
            let data = {
                action: 'get_st',
                nonce: PenciTextToSpeech.nonce,
                stid: STID,
            };


            $.post(ajaxurl, data, function (response) {

                /** Get Speech Template. */
                if (response.success) {

                    /** Speech Template Data. */
                    let st = response.message;

                    /** Set template name. */
                    $('#penci-texttospeech-template-name').val(st.name);

                    /** Remove old elements from list. */
                    let $ul = $('#penci-texttospeech-st-list');
                    $ul.empty();

                    /** Add elements to list. */
                    $.each(st.elements, function (index, item) {

                        /** Add element to list. */
                        addLi(item.type, item.name, encodeURI(item.xpath), item.voice, item.sayAs, item.emphasis, item.content, item.time, item.strength);

                    });

                    /** Select in iFrame all items from list. */
                    refreshIFrameSelections();

                } else {

                    /** Show Error message to user. */
                    showErrorMsg(response);

                }

            })
                .fail(function (response) {

                    /** Show Error message to user. */
                    showErrorMsg(response);

                });

        }

        /**
         * Add New Speech Template.
         **/
        function addNewSpeechTemplate(e) {

            /** Stop reloading. */
            e.preventDefault();

            /** Get Save Button. */
            let $saveBtn = $('.mdp-side-panel > footer .mdp-st-save-btn');

            /** Set 'Add' label for Save Button. */
            $saveBtn.find('.mdc-button__label').html('Add Speech Template');

            /** Mark this speech template as new one. */
            $saveBtn.data('is-new', true);

            /** Clear elements list. */
            $('#penci-texttospeech-st-list').empty();

            /** Show Speech Template Editor. */
            showSpeechTemplateEditor(true);

        }

        /**
         * Detect if a string is encoded with encodeURIComponent()
         **/
        function isEncoded(str) {

            return typeof str == "string" && decodeURIComponent(str) !== str;

        }

        /**
         * Evaluates an XPath expression string and returns a result of the specified type if possible.
         **/
        function getElementByXpath(xPath) {

            /** Decode xPath if needed. */
            if (isEncoded(xPath)) {
                xPath = decodeURI(xPath);
            }

            /** Get iFrame document. */
            let iFrameDoc = $iFrame[0].contentDocument;
            let el;

            try {

                el = iFrameDoc.evaluate(xPath, iFrameDoc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

                return el;

            } catch (error) {

                console.warn(error);

            }

            return undefined;

        }

        /**
         * Something was changed. Enable save button.
         **/
        function wasChanged() {

            /** Mark to show unsaved changes warning. */
            STEditorUnsaved = true;

            /** Enable/Disable save ST button. */
            enableSTSaveBtn();

        }

        /**
         * Make Speech Template list sortable.
         **/
        function makeListSortable() {

            let elementsList = document.getElementById('penci-texttospeech-st-list');
            Sortable.create(elementsList, {
                animation: 150,
                ghostClass: 'mdp-blue-background',

                /** Element dragging ended. */
                onEnd: function () {

                    /** Something was changed. Enable save button. */
                    wasChanged();

                }

            });

        }

        /**
         * Remove element from list.
         **/
        function removeElFromList(e) {

            e.preventDefault();

            /** Get List Item. */
            let $li = $(this).closest('.mdc-list-item');

            /** If this is DOM element then remove selection from page. */
            if ('element' === $li.data('type')) {

                /** Get xPath of element. */
                let xPath = $li.data('xpath');
                xPath = decodeURI(xPath);

                /** Unselect element in iframe. */
                $(getElementByXpath(xPath)).removeClass('mdp-selected');

            }

            /** Get Parent UL. */
            let $ul = $li.parent();

            /** Remove li. */
            $li.remove();

            /** Clear empty ul, to hide it. */
            if (!($ul.find('li').length >= 1)) {
                $ul.empty();
            }

            /** Show/Hide help messages. */
            showHideHelpMessages();

            /** Something was changed. Enable save button. */
            wasChanged();

        }

        /**
         * Remove all highlights when leaving iFrame.
         **/
        function iFrameLeave() {

            $iFrame.contents().find('body .mdp-highlight').removeClass('mdp-highlight');

        }


        /**
         * Return cleared content of element.
         *
         * @param {Object} el           - DOM The element from which we want to get content.
         * @param {boolean} stripTags   - Strip HTML Tags.
         * @param {boolean} stripBreaks - Remove all kinds of line breaks and tabs.
         * @param {boolean} stripSpaces - Remove multiple spaces.
         * @param {number} length       - Get only first 'length' chars.
         *
         * @return {string}
         **/
        function getInnerContent(el, stripTags = true, stripBreaks = true, stripSpaces = true, length = 99) {

            /** Get Inner HTML of Element. */
            let content = el.innerHTML;

            /** Strip HTML Tags. */
            if (stripTags) {

                /** Strip <style> Tags. */
                let regex = /((<style>)|(<style type=.+))((\s+)|(\S+)|(\r+)|(\n+))(.+)((\s+)|(\S+)|(\r+)|(\n+))(<\/style>)/g;
                content = content.replace(regex, '');

                /** Strip HTML Tags. */
                content = content.replace(/(<([^>]+)>)/ig, '');

            }

            /** Remove all kinds of line breaks and tabs. */
            if (stripBreaks) {

                content = content.replace(/[\n\r\t]/g, ' ');

            }

            /** Remove multiple spaces. */
            if (stripSpaces) {

                content = content.replace(/ +(?= )/g, '');

            }

            /** Get only first 'length' chars. */
            if (length) {

                content = content.substring(0, length)

            }

            /** We don't need leading and trailing white spaces and line terminator characters. */
            return content.trim();

        }

        /**
         * Return element name without garbage like 'HTML'.
         **/
        function getElementName(el) {

            let instance = el.constructor.name;
            let elName = instance.replace('HTML', '');

            /** Remove 'Element' if we have something else in name. */
            if ('Element' !== elName) {
                elName = elName.replace('Element', '');
            }

            return elName;

        }

        function getElementXPath(element) {

            if (element && element.id) {

                return '//*[@id="' + element.id + '"]';

            } else {

                return getElementTreeXPath(element);

            }

        }

        function getElementTreeXPath(element) {

            let paths = [];

            /** Use nodeName (instead of localName) so namespace prefix is included (if any). */
            for (; element && element.nodeType == Node.ELEMENT_NODE; element = element.parentNode) {

                let index = 0;
                let hasFollowingSiblings = false;

                for (let sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {

                    /** Ignore document type declaration. */
                    if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE) {
                        continue;
                    }

                    if (sibling.nodeName == element.nodeName) {
                        ++index;
                    }

                }

                for (let sibling = element.nextSibling; sibling && !hasFollowingSiblings; sibling = sibling.nextSibling) {

                    if (sibling.nodeName == element.nodeName) {

                        hasFollowingSiblings = true;

                    }

                }

                let tagName = (element.prefix ? element.prefix + ":" : "") + element.localName;
                let pathIndex = (index || hasFollowingSiblings ? "[" + (index + 1) + "]" : "");
                paths.splice(0, 0, tagName + pathIndex);

            }

            return paths.length ? "/" + paths.join("/") : null;

        }

        /**
         * Save selected element to Speech Template list.
         **/
        function saveElementToList(el) {

            /** Get full xPath for selected element. */
            let xPath = getElementXPath(el);

            xPath = encodeURI(xPath);

            /** We use it, to remove element from list on unselect. */
            $(el).data('xpath', xPath);

            /** Prepare element name. */
            let elName = getElementName(el);

            /** Add data to list. */
            addLi('element', elName, xPath);

        }

        /**
         * Add data to list.
         **/
        function addLi(
            type = 'element',
            elName = 'New Element',
            xPath = '',
            voice = undefined,
            sayAs = undefined,
            emphasis = undefined,
            content = undefined,
            time = undefined,
            strength = undefined,
        ) {

            /** Content of element. */
            let elContent;

            /** Dom Element. */
            if ('element' === type) {

                /** Decode xPath if needed. */
                if (isEncoded(xPath)) {
                    xPath = decodeURI(xPath);
                }

                elContent = getContentByXPath(xPath);

                /** Get content of selected element. */
                if (getContentByXPath(xPath).length > 0) {
                    elContent = getContentByXPath(xPath);
                } else {
                    elContent = '<i>Content not found for this element</i>';
                }

                /** Text Element. */
            } else if ('text' === type) {

                /** Use entered content, for text elements. */
                elContent = content;

                /** Pause Element. */
            } else if ('pause' === type) {

                /** Set content for pause. */
                elContent = 'Time: ' + time + 'ms, ';
                elContent += 'Strength: ' + strength;

            }

            xPath = encodeURI(xPath);

            /** Add data to list. */
            $('#penci-texttospeech-st-list').append(`
                <li class="mdc-list-item"
                    data-type="${type}"
                    data-name="${elName}" 
                    data-xpath="${xPath}"                      
                    data-voice="${voice}"
                    data-say-as="${sayAs}"
                    data-emphasis="${emphasis}"
                    data-time="${time}"
                    data-strength="${strength}">
                    <span title="Edit" class="mdp-edit-item material-icons" aria-hidden="true">edit</span>                    
                    <span class="mdc-list-item__text">                        
                        <span class="mdc-list-item__primary-text">${elName}</span>
                        <span class="mdc-list-item__secondary-text">${elContent}</span>
                    </span>                    
                    <span title="Remove" class="mdp-remove-item mdc-list-item__meta material-icons" aria-hidden="true">close</span>
                </li>
            `);

            /** Show/Hide help messages. */
            showHideHelpMessages();

        }

        /**
         * Show/Hide help messages.
         **/
        function showHideHelpMessages() {

            let listLength = $('#penci-texttospeech-st-list li').length;

            if (listLength > 0) {

                $('.mdp-list-box .mdp-stb-subtitle').removeClass('mdc-hidden');
                $('.mdp-list-box .mdp-stb-info').addClass('mdc-hidden');

            } else {

                $('.mdp-list-box .mdp-stb-subtitle').addClass('mdc-hidden');
                $('.mdp-list-box .mdp-stb-info').removeClass('mdc-hidden');

            }

            if (listLength > 1) {

                let randId = Math.floor(Math.random() * Math.floor(3));
                randId++;
                $('.mdp-list-box .mdp-stb-info.mdp-help-' + randId).removeClass('mdc-hidden');

            } else {

                $('.mdp-list-box .mdp-stb-info.mdp-help-1').addClass('mdc-hidden');
                $('.mdp-list-box .mdp-stb-info.mdp-help-2').addClass('mdc-hidden');
                $('.mdp-list-box .mdp-stb-info.mdp-help-3').addClass('mdc-hidden');

            }

        }

        /**
         * Add custom CSS to iFrame preview for hover/click effects.
         **/
        function addCSStoIFrame() {

            /** Add CSS for hover/click effect. */
            $iFrame.contents().find('head').append($(`
                <style type='text/css'>
                    .mdp-highlight {
                        user-select: none !important;
                        box-shadow: inset 0 0 0 1000px rgba(34, 134, 233, 0.3) !important;
                        outline: 2px dotted #2286e9 !important;
                        cursor: crosshair !important;
                        transition: .05s;
                    }
                    
                    .mdp-selected {
                        user-select: none !important;
                        outline: 2px dashed rgba(34, 134, 233, 0.5) !important;
                        transition: .1s;
                    }
                    
                    .mdp-selected:hover {
                        outline: 2px dashed #2286e9 !important;
                    }
                    
                    .mdp-selected.mdp-active {
                        outline: 4px solid #2286e9 !important;
                        transition: .1s;
                    }
                    
                    .mdp-selected.mdp-highlight {
                        box-shadow: inset 0 0 0 1000px rgba(34, 134, 233, 0.1) !important;
                        transition: .1s;
                    }
                    
                </style>
            `));

        }

        /**
         * Close Edit Element Form without saving by clicking form overlay.
         **/
        function closeElementFormOverlay(e) {

            if ($(e.target).is("#penci-texttospeech-element-form")) {

                closeElementForm();

            }

        }

        /**
         * Close Edit Element Form without saving.
         **/
        function closeElementForm(e) {

            if ('undefined' !== typeof e) {
                e.preventDefault();
            }

            /** Get Edit Element Form. */
            let $eForm = $('#penci-texttospeech-element-form');

            /** Hide edit form. */
            $eForm.addClass('mdc-hidden');

        }

        /**
         * Add/Save element to list after editing.
         **/
        function saveElementForm() {

            /** Get Edit Element Form. */
            let $eForm = $('#penci-texttospeech-element-form');

            /** Is this new element or editing of existing. */
            let isNew = false;
            if ('undefined' !== typeof $eForm.data('is-new')) {
                isNew = $eForm.data('is-new');
            }

            /** If this is edit, we need li id, to update. */
            let liIndex = -1;
            if (!isNew) {
                liIndex = $eForm.data('liIndex');
            }

            /** Get Element type. */
            let type = 'element';
            if ('undefined' !== typeof $eForm.data('type')) {
                type = $eForm.data('type');
            }

            /** We save different fields depending on the type. */
            if ('element' === type) {

                /** Save fields for DOM element. */
                storeElement(isNew, liIndex);

            } else if ('text' === type) {

                /** Save fields for Text element. */
                storeText(isNew, liIndex);

            } else if ('pause' === type) {

                /** Save fields for pause element. */
                storePause(isNew, liIndex);

            }

            /** Close Edit Element Form without saving. */
            closeElementForm();

            /** Something was changed. Enable save button. */
            wasChanged();

        }

        /**
         * Save fields for DOM element.
         **/
        function storeElement(isNew, liIndex) {

            /** Get Element name. */
            let Name = $('#penci-texttospeech-element-form-name').val();

            /** Get Element xPath. */
            let xPath = $xPathInput.val();

            /** Get Language. */
            let voice = $('#penci-texttospeech-settings-language').val();

            /** Get say As. */
            let sayAs = $('#penci-texttospeech-element-form-say-as').val();

            /** Get Emphasis. */
            let emphasis = $('#penci-texttospeech-element-form-emphasis').val();

            /** Create New or update existing element. */
            let $li;
            if (isNew) {

                /** Add data to list. */
                addLi('element', Name, xPath, voice, sayAs, emphasis);

            } else {

                /** Get li to update. */
                $li = $('#penci-texttospeech-st-list li').eq(liIndex);

                /** Set Name */
                $li.data('name', Name);
                $li.find('.mdc-list-item__primary-text').contents().first()[0].textContent = Name;

                /** Set xPath */
                $li.data('xpath', encodeURI(xPath));

                /** Set Voice */
                $li.data('voice', voice);

                /** Set say As */
                $li.data('say-as', sayAs);

                /** Set Emphasis */
                $li.data('emphasis', emphasis);

            }

            /** Select in iFrame all items from list. */
            refreshIFrameSelections();

        }

        /**
         * Save fields for Text element.
         **/
        function storeText(isNew, liIndex) {

            /** Get Element name. */
            let Name = $('#penci-texttospeech-element-form-name').val();

            /** Get Element content. */
            let content = $('#penci-texttospeech-element-form-content').val();

            /** Get say As. */
            let sayAs = $('#penci-texttospeech-element-form-say-as').val();

            /** Get Language. */
            let voice = $('#penci-texttospeech-settings-language').val();

            /** Get Emphasis. */
            let emphasis = $('#penci-texttospeech-element-form-emphasis').val();

            /** Create New or update existing element. */
            let $li;
            if (isNew) {

                /** Add data to list. */
                addLi('text', Name, '', voice, sayAs, emphasis, content);

            } else {

                /** Get li to update. */
                $li = $('#penci-texttospeech-st-list li').eq(liIndex);

                /** Set Name */
                $li.data('name', Name);
                $li.find('.mdc-list-item__primary-text').contents().first()[0].textContent = Name;

                /** Set Content */
                $li.find('.mdc-list-item__secondary-text').html(content);

                /** Set Voice */
                $li.data('voice', voice);

                /** Set say As */
                $li.data('say-as', sayAs);

                /** Set Emphasis */
                $li.data('emphasis', emphasis);

            }

            /** Select in iFrame all items from list. */
            refreshIFrameSelections();

        }

        /**
         * Save fields for pause element.
         **/
        function storePause(isNew, liIndex) {

            /** Get Element name. */
            let Name = $('#penci-texttospeech-element-form-name').val();

            /** Get Pause time. */
            let time = $('#penci-texttospeech-element-form-time-input').val();

            /** Get Strength. */
            let strength = $('#penci-texttospeech-element-form-strength').val();

            /** Create New or update existing element. */
            let $li;
            if (isNew) {

                /** Add data to list. */
                addLi('pause', Name, '', undefined, undefined, undefined, undefined, time, strength);

            } else {

                /** Get li to update. */
                $li = $('#penci-texttospeech-st-list li').eq(liIndex);

                /** Set Name */
                $li.data('name', Name);
                $li.find('.mdc-list-item__primary-text').contents().first()[0].textContent = Name;

                /** Set pause time */
                $li.data('time', time);

                /** Set Strength time */
                $li.data('strength', strength);

                $li.find('.mdc-list-item__secondary-text').html(`Time: ${time}ms, Strength: ${strength}`);


            }

            /** Select in iFrame all items from list. */
            refreshIFrameSelections();

        }

        /**
         * Select in iFrame all items from list.
         **/
        function refreshIFrameSelections() {

            /** Clear all selections on iFrame. */
            $iFrame.contents().find('body .mdp-selected').removeClass('mdp-active mdp-selected');

            /** Select each element in list. */
            $('#penci-texttospeech-st-list li').each(function () {

                /** Get type of current item. */
                let type = $(this).data('type');

                /** Precess only DOM Element items. */
                if ('element' !== type) {
                    return true;
                }

                /** Get xpath of current item. */
                let xpath = $(this).data('xpath');
                xpath = decodeURI(xpath);

                /** Get corresponding element in iFrame. */
                let el = getElementByXpath(xpath);

                /** Select element in iFrame. */
                $(el).addClass('mdp-selected');

                /** Is this is active item -> activate element. */
                if ($(this).hasClass('mdp-active')) {

                    $(el).addClass('mdp-active');

                }

            });

        }

        /**
         * Enable/Disable save button on Name change.
         **/
        function onNameChange() {

            /** Get Save Button. */
            let $saveBtn = $('#penci-texttospeech-element-form footer .mdp-save-btn');

            /** Do we have content. */
            if ($(this).val().length >= 1) {
                $saveBtn.prop('disabled', false);
            } else {
                $saveBtn.prop('disabled', true);
            }

        }

        /**
         * Enable/Disable save ST button on Template Name field change. Name field is required.
         **/
        function enableSTSaveBtn() {

            /** Get Save Button. */
            let $saveBtn = $('.mdp-side-panel > footer .mdp-st-save-btn');

            /** Do we have Name and some list items. */
            if (($('#penci-texttospeech-template-name').val().length >= 1) && ($('#penci-texttospeech-st-list li').length >= 1)) {
                $saveBtn.prop('disabled', false); // Enable save button.
            } else {
                $saveBtn.prop('disabled', true); // Disable button.
            }

        }

        /**
         * Show element layout for form.
         **/
        function showElementForm(
            $li = undefined,
            title = 'Edit Element',
            contentEditable = false,
            layout = 'element'
        ) {

            /** This is new item or existing. */
            let isNew = false;

            if ('undefined' === typeof $li) {
                isNew = true;
            }

            /** Get Edit Element Form. */
            let $eForm = $('#penci-texttospeech-element-form');

            /** Save type of current form. */
            $eForm.attr('data-type', layout);
            $eForm.data('type', layout);

            /** Save is-new of current form. */
            $eForm.attr('data-is-new', isNew);
            $eForm.data('is-new', isNew);

            /** Show edit form. */
            $eForm.removeClass('mdc-hidden');

            /** Set Title for edit form. */
            $eForm.find('.mdp-title').html(title);

            /** Set Element Name field. */
            SetNameField($li);

            /** Special layout forPause Element. */
            if ('element' === layout || 'text' === layout) {

                if ('element' === layout) {

                    /** Show fields for Element. */
                    applyElementLayout();

                    /** Set Content field for DOM Element. */
                    SetContentFieldForElement($li);

                } else {

                    /** Show fields for Text. */
                    applyTextLayout();

                    /** Set Content field. */
                    SetContentFieldForText($li);

                }

                /** Set xPath field. */
                setXPathField($li);

                /** Set Language field. */
                setLanguageField($li);

                /** Prepare sayAs and emphasis vars. */
                let sayAs = 'none';
                let emphasis = 'none';
                if ('undefined' !== typeof $li) {
                    sayAs = $li.data('say-as');
                    emphasis = $li.data('emphasis');
                }

                /** Set Say As field. */
                SetSelectField('#penci-texttospeech-element-form-say-as', sayAs, 'none');

                /** Set Emphasis field. */
                SetSelectField('#penci-texttospeech-element-form-emphasis', emphasis, 'none');

                /** Special layout forPause Element. */
            } else if ('pause' === layout) {

                /** Show fields for pause. */
                applyPauseLayout();

                /** Set Time field. */
                SetTimeField($li);

                /** Set Strength field. */
                let strength = 'none';
                if ('undefined' !== typeof $li) {
                    strength = $li.data('strength');
                }

                SetSelectField('#penci-texttospeech-element-form-strength', strength, 'none');

            }

            /** Detect adding new or editing existing element. */
            setActionButtons(isNew);

            /** Scroll to top Element Edit Form. */
            $eForm.find('.mdp-element-form').scrollTop(0);

        }

        /**
         * Detect adding new or editing existing element.
         **/
        function setActionButtons(isNew) {

            /** Get Edit Element Form. */
            let $eForm = $('#penci-texttospeech-element-form');

            /** Save button. */
            let $saveBtn = $eForm.find('footer .mdp-save-btn');
            $saveBtn.prop('disabled', false); // Enable save button

            /** Detect adding new or editing existing element. */
            if (isNew) {

                $saveBtn.find('.mdc-button__label').html('Add');

            } else {

                $saveBtn.find('.mdc-button__label').html('Save');

            }

        }

        /**
         * Show fields for Element in element editor dialog.
         **/
        function applyElementLayout() {

            /** Get Edit Element Form. */
            let $eForm = $('#penci-texttospeech-element-form');

            /** Show xPath field. */
            $eForm.find('.penci-texttospeech-xpath-box').show();

            /** Show Content field. */
            $eForm.find('.penci-texttospeech-content-box').show();

            /** Show Voice field. */
            $eForm.find('.penci-texttospeech-voice-box').show();

            /** Show Say As field. */
            $eForm.find('.penci-texttospeech-say-as-box').show();

            /** Show Emphasis field. */
            $eForm.find('.penci-texttospeech-emphasis-box').show();

            /** Hide Time field. */
            $eForm.find('.penci-texttospeech-time-box').hide();

            /** Hide Strength field. */
            $eForm.find('.penci-texttospeech-strength-box').hide();

        }

        /**
         * Show fields for Text in element editor dialog.
         **/
        function applyTextLayout() {

            /** Get Edit Element Form. */
            let $eForm = $('#penci-texttospeech-element-form');

            /** Show Content field. */
            $eForm.find('.penci-texttospeech-content-box').show();

            /** Show Voice field. */
            $eForm.find('.penci-texttospeech-voice-box').show();

            /** Show Say As field. */
            $eForm.find('.penci-texttospeech-say-as-box').show();

            /** Show Emphasis field. */
            $eForm.find('.penci-texttospeech-emphasis-box').show();

            /** Hide xPath field. */
            $eForm.find('.penci-texttospeech-xpath-box').hide();

            /** Hide Time field. */
            $eForm.find('.penci-texttospeech-time-box').hide();

            /** Hide Strength field. */
            $eForm.find('.penci-texttospeech-strength-box').hide();

        }

        /**
         * Show fields for pause in element editor dialog.
         **/
        function applyPauseLayout() {

            /** Get Edit Element Form. */
            let $eForm = $('#penci-texttospeech-element-form');

            /** Hide xPath field. */
            $eForm.find('.penci-texttospeech-xpath-box').hide();

            /** Hide Content field. */
            $eForm.find('.penci-texttospeech-content-box').hide();

            /** Hide Voice field. */
            $eForm.find('.penci-texttospeech-voice-box').hide();

            /** Hide Say As field. */
            $eForm.find('.penci-texttospeech-say-as-box').hide();

            /** Hide Emphasis field. */
            $eForm.find('.penci-texttospeech-emphasis-box').hide();

            /** Show Time field. */
            $eForm.find('.penci-texttospeech-time-box').show();

            /** Show Strength field. */
            $eForm.find('.penci-texttospeech-strength-box').show();

        }

        /**
         * Show Text layout for form.
         **/
        function showTextForm($li = undefined) {

            /** Set default Title. */
            let title = 'Edit Text';

            if ('undefined' !== $li) {

                /** Adding new text element. */
                title = 'Add Text';

            }

            /** Show text form. */
            showElementForm($li, title, true, 'text');

        }

        /**
         * Show Pause layout for form.
         **/
        function showPauseForm($li = undefined) {

            /** Set default Title. */
            let title = 'Edit Pause';

            if ('undefined' !== $li) {

                /** Adding new Pause element. */
                title = 'Add Pause';

                /** Set default value to time. */
                $('#penci-texttospeech-element-form-time-input').val('300');

            }

            /** Show pause form. */
            showElementForm($li, title, true, 'pause');

        }

        /**
         * Make table great again!
         **/
        function initLanguageTable() {

            // Hide all lines on first load.
            setTimeout(function () {
                $('#penci-texttospeech-settings-language-tbl tbody').hide();
                $('#penci-texttospeech-settings-language-tbl_info').hide();
                $('#penci-texttospeech-settings-language-tbl_paginate').hide();
                $('#penci-texttospeech-settings-language-tbl_length').hide();
                $('#penci-texttospeech-settings-language-tbl thead').hide();
            }, 100);

            let $langTable = $('#penci-texttospeech-settings-language-tbl');
            $langTable.removeClass('hidden');
            $langTable.DataTable({

                retrieve: true,

                /** Show entries. */
                lengthMenu: [[-1], ["All"]],

                /** Add filters to table footer. */
                initComplete: function () {
                    this.api().columns().every(function () {
                        let column = this;
                        let select = $('#penci-texttospeech-language-filter');

                        /** Create filter only for first column. */
                        if (column[0][0] !== 0) {
                            return;
                        }

                        select.on('change', function () {

                            $('#penci-texttospeech-settings-language-tbl tbody').show();
                            $('#penci-texttospeech-settings-language-tbl_info').show();
                            $('#penci-texttospeech-settings-language-tbl_paginate').hide();
                            $('#penci-texttospeech-settings-language-tbl_length').hide();
                            $('#penci-texttospeech-settings-language-tbl thead').show();

                            let val = $.fn.dataTable.util.escapeRegex($(this).val());
                            if ('0' === val) {
                                val = '';
                            }
                            column.search(val ? '^' + val + '$' : '', true, false).draw();
                        });

                    });

                }
            });

            /** Select language. */
            $('#penci-texttospeech-settings-language-tbl tbody').on('click', 'tr', function () {

                $('#penci-texttospeech-settings-language-tbl tr.selected').removeClass('selected');
                $(this).addClass('selected');

                let voice_name = $('#penci-texttospeech-settings-language-tbl tr.selected .mdp-voice-name').attr("title");
                let lang_code = $('#penci-texttospeech-settings-language-tbl tr.selected .mdp-lang-code').text();
                $('.mdp-now-used strong').html(voice_name);
                $('#penci-texttospeech-settings-language').val(voice_name);
                $('#penci-texttospeech-settings-language-code').val(lang_code);

                /** Update Audio Sample. */
                let audio = $('.mdp-now-used audio');
                audio.attr('src', 'https://cloud.google.com/text-to-speech/docs/audio/' + voice_name + '.wav');
                audio[0].pause();
                audio[0].load();

            });
        }

        /**
         * Scroll iframe to element on click in list.
         **/
        function liClick() {

            /** Deselect item, if it is already selected. */
            if ($(this).hasClass('mdp-active')) {

                $iFrame.contents().find('body .mdp-active').removeClass('mdp-active');
                $(this).removeClass('mdp-active');

                /** Select new item and scroll iFrame. */
            } else {

                /** Select new element in iFrame. */
                $('#penci-texttospeech-st-list li').removeClass('mdp-active');
                $(this).addClass('mdp-active');

                $iFrame.contents().find('body .mdp-active').removeClass('mdp-active');

                /** Scroll iFrame to element only for Elements items. */
                if ('element' === $(this).data('type')) {

                    /** Get element xpath */
                    let xPath = decodeURI($(this).data('xpath'));

                    /** Get Element */
                    let el = getElementByXpath(xPath);

                    if (null === el) {

                        /** De activate all elements in iframe. */
                        $iFrame.contents().find('body .mdp-active').removeClass('mdp-active');

                        return;

                    }

                    /** Mark selected element in iframe. */
                    $(el).addClass('mdp-selected mdp-active');

                    /** Scroll iframe. */
                    $iFrame[0].contentWindow.scrollTo({top: $(el).offset().top - 30, behavior: 'smooth'});

                }

            }

        }

        /**
         * Add new Pause to list.
         **/
        function addPause(e) {
            e.preventDefault();

            /** Show text layout for form. */
            showPauseForm();

        }

        /**
         * Add new Text Element to list.
         **/
        function addText(e) {
            e.preventDefault();

            /** Show text layout for form. */
            showTextForm();

        }

        /**
         * Add new DOM Element to list.
         **/
        function addElement(e) {
            e.preventDefault();

            /** Show element layout for form. */
            showElementForm(undefined, 'Add Element', false, 'element');

        }

        /**
         * Edit element in modal window.
         **/
        function editElement(e) {
            e.preventDefault();
            e.stopPropagation(); // We don't want unselect current li.

            /** Get List Item. */
            let $li = $(this).closest('.mdc-list-item');

            /** Get Element Type: Element, Text, Pause. */
            let eType = $li.data('type');

            /** Get Edit Element Form. */
            let $eForm = $('#penci-texttospeech-element-form');

            /** Save li index, to refresh data after editing. */
            $eForm.data('liIndex', $li.index());

            /** Prepare different layouts for different element types. */
            if ('element' === eType) {

                /** Show Edit DOM Element form. */
                showElementForm($li, 'Edit Element', false, 'element');

            } else if ('text' === eType) {

                /** Edit Text Element. */
                showTextForm($li);

            } else if ('pause' === eType) {

                /** Edit Pause Element. */
                showPauseForm($li);

            }

            /** Something was changed. Enable save button. */
            wasChanged();

        }

        /**
         * Set value to Name Field for Element Editor.
         **/
        function SetNameField($li) {

            /** Set Default Name of the field. */
            let name = 'New Element';

            /** Get Form type. */
            let $eForm = $('#penci-texttospeech-element-form');
            let type = $eForm.data('type');

            /** Set name depending by type. */
            if ('text' === type) {
                name = 'New Text';
            } else if ('pause' === type) {
                name = 'New Pause';
            }

            if ('undefined' !== typeof $li) {
                name = $li.data('name');
            }

            /** Get Name input field. */
            let $input = $('#penci-texttospeech-element-form-name');

            /** Get reference index in global array. */
            let index = $input.parent().data('mdc-index');

            /** Set new value. */
            window.MerkulovMaterial[index].value = name;

        }

        /**
         * Set value to Select Field in Element Editor dialog.
         **/
        function SetSelectField(selector, value, defaultValue = 'none') {

            /** Set default value if don't have one. */
            if ('undefined' === typeof value || 'undefined' === value) {
                value = defaultValue;
            }

            /** Get MDCSelect hidden input field. */
            let $input = $(selector);

            /** Get reference index in global array. */
            let index = $input.parent().data('mdc-index');

            /** Set value to Select. */
            let MDCSelect = window.MerkulovMaterial[index];
            MDCSelect.value = value;

        }

        /**
         * Set value to Pause Time Field in Element Editor dialog.
         **/
        function SetTimeField($li) {

            /** Set Default value. */
            let time = '300';

            if ('undefined' !== typeof $li) {
                time = $li.data('time');
            }

            /** Get time slider field. */
            let $slider = $('#penci-texttospeech-element-form-time');

            /** Get reference index in global array. */
            let index = $slider.data('mdc-index');

            /** Set new value. */
            window.MerkulovMaterial[index].value = time;
            $('.penci-texttospeech-time-box .mdc-text-field-helper-text strong').html(time);

            /** Trigger resize, we need this for slider work. */
            setTimeout(function () {
                window.dispatchEvent(new Event('resize'));
            }, 500);

        }

        /**
         * Set value to Language Field for Element Editor.
         **/
        function setLanguageField($li) {

            SetSelectField('#penci-texttospeech-language-filter', '0', '0');
            initLanguageTable(); // Make table great again!

            /** Default voice value. */
            let voice = PenciTextToSpeech.voice;

            /** Get voice from li. */
            if ('undefined' !== typeof $li && 'undefined' !== $li.data('voice')) {
                voice = $li.data('voice');
            }

            /** Set Voice to hidden input. */
            $('#penci-texttospeech-settings-language').val(voice);

            /** Set Voice to label. */
            $('.penci-texttospeech-voice-box .mdp-now-used strong').html(voice);

            /** Set correct audio preview. */
            $('.penci-texttospeech-voice-box .mdp-now-used audio').attr('src', 'https://cloud.google.com/text-to-speech/docs/audio/' + voice + '.wav');

        }

        /**
         * Set value to xPath Field for Element Editor.
         **/
        function setXPathField($li) {

            /** Set Default xpath . */
            let xpath = '/html[1]/body[1]/div[1]';

            if ('undefined' !== typeof $li) {
                xpath = $li.data('xpath');
            }

            /** Decode xPath to normal string. */
            xpath = decodeURI(xpath);

            /** Get reference index in global array. */
            let index = $xPathInput.parent().data('mdc-index');

            /** Set new value. */
            window.MerkulovMaterial[index].value = xpath;

        }

        /**
         * Set value to Content Field for Text element in Element Editor.
         **/
        function SetContentFieldForText($li) {

            /** Set empty content by default. */
            let content = '';

            /** If we here from existing element. */
            if ('undefined' !== typeof $li) {

                /** Get content of element. */
                content = $li.find('.mdc-list-item__secondary-text').html();

            }

            /** Set content. */
            setElementFormContent(content, false);

        }

        /**
         * Set value to Content Field for Element Editor.
         **/
        function SetContentFieldForElement($li) {

            /** Set empty content by default. */
            let xpath = '';
            let content = '';

            /** If we here from existing element. */
            if ('undefined' !== typeof $li) {

                xpath = $li.data('xpath');

                /** Decode xPath to normal string. */
                xpath = decodeURI(xpath);

                /** Get content of element. */
                content = getContentByXPath(xpath);

            }

            /** Set content. */
            setElementFormContent(content, true);

        }

        /**
         * Set content to #penci-texttospeech-element-form-content textarea.
         **/
        function setElementFormContent(content = '', disabled = false) {

            /** Get textarea field. */
            let $textarea = $('#penci-texttospeech-element-form-content');

            /** Get reference index in global array. */
            let index = $textarea.parent().data('mdc-index');
            let MDCTextField = window.MerkulovMaterial[index];

            /** Set new value. */
            MDCTextField.value = content;

            /** Disable textarea. Only preview for element type. */
            MDCTextField.disabled = disabled;

        }

        /**
         * Get content of element form iFrame by xPath.
         **/
        function getContentByXPath(xPath) {

            /** Get Element in iFrame. */
            let el = getElementByXpath(xPath);

            /** If we haven't element then we haven't content. */
            if ('undefined' === typeof el || null === el) {
                return '';
            }

            return getInnerContent(el, true, true, true, 0);

        }

        /**
         * Generate unique speech template id, based on name and timestamp.
         **/
        function generateSTID(stid) {

            /** Add timestamp. */
            stid = stid + Date.now();

            /** Remove non latin chars. */
            stid = stid.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            stid = stid.replace(/[\u0250-\ue007]/g, '');

            /** Base64 encode. */
            stid = btoa(stid);

            return stid;

        }

        /**
         * Save Speech Template.
         **/
        function saveSpeechTemplate(e) {
            e.preventDefault();

            /** Show iFrame Preloader. */
            $iFramePreloader.addClass('mdp-active');

            /** Speech Template Name. */
            let STName = $('#penci-texttospeech-template-name').val();

            /** Flag to detect creating or update speech template. */
            let isNew = $('.mdp-side-panel footer > .mdp-st-save-btn').data('is-new');

            /** Generate unique ST id. */
            let STID;

            /** Generate new ST id for new templates. */
            if (isNew) {

                STID = generateSTID(STName);

                /** Use selected id from list. */
            } else {

                STID = $stSelect.val();

            }

            /** Data of all elements. */
            let elements = [];
            $('#penci-texttospeech-st-list li').each(function () {

                /** Get current element type. */
                let type = $(this).data('type');
                let name = '';
                let xpath = '';
                let voice = '';
                let sayAs = '';
                let emphasis = '';
                let content = '';
                let time = '';
                let strength = '';

                if ('element' === type) {

                    /** Get variables from li. */
                    name = $(this).data('name');
                    xpath = $(this).data('xpath');
                    xpath = decodeURI(xpath);
                    voice = $(this).data('voice');
                    sayAs = $(this).data('say-as');
                    emphasis = $(this).data('emphasis');

                } else if ('text' === type) {

                    /** Get variables from li. */
                    name = $(this).data('name');
                    content = $(this).find('.mdc-list-item__secondary-text').html();
                    voice = $(this).data('voice');
                    sayAs = $(this).data('say-as');
                    emphasis = $(this).data('emphasis');

                } else if ('pause' === type) {

                    /** Get variables from li. */
                    name = $(this).data('name');
                    time = $(this).data('time');
                    strength = $(this).data('strength');

                }

                /** Add Data to array. */
                elements.push({
                    'type': type,
                    'name': name,
                    'xpath': xpath,
                    'voice': voice,
                    'sayAs': sayAs,
                    'emphasis': emphasis,
                    'content': content,
                    'time': time.toString(),
                    'strength': strength,
                });

            });

            /** Prepare Speech Template object. */
            let ST = {};
            ST.id = STID;
            ST.name = STName;
            ST.elements = elements;

            /** Convert object to JSON string. */
            ST = JSON.stringify(ST);

            /** Send by AJAX to add/update new ST. */
            let data = {
                action: 'process_st',
                nonce: PenciTextToSpeech.nonce,
                st: ST,
                delete: false // Do not Delete
            };

            $.post(ajaxurl, data, function (response) {

                /** Update select list. */
                if (response.success) {

                    /** Add new template. */
                    if (isNew) {

                        /** Add Template to select list if this is new ST. */
                        let $stSelectMenu = $stSelect.parent().find('ul.mdc-list');
                        $stSelectMenu.append(`
                            <li class="mdc-list-item" data-value="${STID}" role="option" tabindex="-1">${STName}</li>
                        `);

                        /** Select new template. */
                        /** Get reference index in global array. */
                        let index = $stSelect.parent().data('mdc-index');

                        let STSelectField = window.MerkulovMaterial[index];

                        /** Set new value. */
                        STSelectField.selectedIndex = $stSelectMenu.find('li').length - 1;

                        /** Update existing template in list. */
                    } else {

                        /** Update Template name in select list. */
                        let $li = $stSelect.parent().find('ul.mdc-list li[data-value="' + STID + '"]')

                        $li.html(STName);
                        $('#penci-texttospeech-speech-templates-template-text').html(STName);

                    }

                    /** Hide Speech Template Editor. */
                    hideSpeechTemplateEditor();

                    /** All changes are Saved. */
                    STEditorUnsaved = false;

                    /** Disable Save button. */
                    $('.mdp-side-panel footer .mdp-st-save-btn').prop('disabled', true);

                } else {

                    /** Show Error message to user. */
                    showErrorMsg(response);

                }

            })
                .fail(function (response) {

                    /** Show Error message to user. */
                    showErrorMsg(response);

                });

        }

        /**
         * Close Speech Template Editor.
         **/
        function closeSTEditor(e) {
            e.preventDefault();

            /** Confirm close without savings. */
            if (STEditorUnsaved) {
                if (!confirm('It looks like you made changes and did not save it. Continue anyway?')) {
                    return;
                }
            }

            /** Hide Speech Template Editor. */
            hideSpeechTemplateEditor();

        }

        /**
         * Hide Speech Template Editor.
         **/
        function hideSpeechTemplateEditor() {

            /** Show scrollbars. */
            $('html, body').css('overflow', '');

            /** Hide Speech Template Editor. */
            $('#penci-texttospeech-template-speech-template-editor').addClass('mdc-hidden');

        }

        /**
         * Enable ctrl flag on keydown.
         **/
        function pressCtrl(e) {

            if (e.which === 17) {

                ctrlIsPressed = true;

                /** De highlight all elements. */
                $iFrame.contents().find('body .mdp-highlight').removeClass('mdp-highlight');

            }

        }

        /**
         * Disable ctrl flag on keyup.
         **/
        function unPressCtrl() {

            ctrlIsPressed = false;

        }

        /**
         * Click on element in iFrame.
         **/
        function iFrameElClick() {

            /** Disable if pressed control key. */
            if (ctrlIsPressed) {
                return;
            }

            /** If current element is selected - de select it. */
            if ($(this).hasClass('mdp-selected')) {

                /** Unselect element in iframe. */
                let xpath = decodeURI($(this).data('xpath'));

                let $ul = $('#penci-texttospeech-st-list');

                $('#penci-texttospeech-st-list li').each(function () {
                    if (decodeURI($(this).data('xpath')) === xpath) {
                        $(this).remove();

                        /** Clear empty ul, to hide it. */
                        if (!$ul.find('li').length >= 1) {
                            $ul.empty();
                        }

                        /** Show/Hide help messages. */
                        showHideHelpMessages();

                    }
                });

                $(this).removeClass('mdp-selected');

                /** If current element is highlighted then select it. */
            } else if ($(this).hasClass('mdp-highlight')) {

                $(this).removeClass('mdp-highlight').addClass('mdp-selected');

                /** Save selected element to Speech Template list. */
                saveElementToList($(this)[0]);

            } else {

                $(this).addClass('mdp-selected');

                /** Save selected element to Speech Template list. */
                saveElementToList($(this)[0]);

            }

            /** Something was changed. Enable save button. */
            wasChanged();

            return false;

        }

        /**
         * Add/Remove class on hover in iFrame.
         **/
        function highlightElement(e) {

            /** Disable if pressed control key. */
            if (ctrlIsPressed) {
                return;
            }

            /** We do not select the entire page. */
            if ($(e.target).is('body')) {

                /** De highlight previous. */
                $iFrame.contents().find('body .mdp-highlight').removeClass('mdp-highlight');

                return;
            }

            /** De highlight previous. */
            $iFrame.contents().find('body .mdp-highlight').removeClass('mdp-highlight');

            /** Highlight current. */
            /** Process only HTML elements. Skip svg, iFrames and others. */
            let instance = e.target.constructor.name;

            if (
                instance.startsWith('HTML') &&
                instance !== 'HTMLIFrameElement'
            ) {

                $(e.target).addClass('mdp-highlight');

            }

        }

        /**
         * After iFrame loaded.
         **/
        function iFrameLoaded() {

            /** Add custom CSS to iFrame preview for hover/click effects. */
            addCSStoIFrame();

            /** Hover in iFrame. */
            let iFrameDoc = $iFrame[0].contentDocument;
            iFrameDoc.body.onmouseover = highlightElement;

            /** Enable ctrl flag on keydown. */
            iFrameDoc.body.onkeydown = pressCtrl;
            $(document).on('keydown', pressCtrl);

            /** Disable ctrl flag on keyup. */
            iFrameDoc.body.onkeyup = unPressCtrl;
            $(document).on('keyup', unPressCtrl);

            /** Click on element in iFrame. */
            $iFrame.contents().find('body *').click(iFrameElClick);

            /** Is new or edit template? */
            let isNew = $('.mdp-side-panel > footer .mdp-st-save-btn').data('is-new');

            /** Load template if this is 'edit' operation. */
            if (!isNew) {

                /** Get ID of st to edit. */
                let STID = $stSelect.val();

                /** Get Speech Template data by ID via AJAX. */
                getSpeechTemplateByID(STID);

            }

            /** Hide Preloader after iframe loaded. */
            $iFramePreloader.removeClass('mdp-active');

        }

        /**
         * Show Speech Template Editor.
         **/
        function showSpeechTemplateEditor(isNew = false) {

            /** Hide scrollbars. */
            $('html, body').css('overflow', 'hidden');

            /** Show Template Editor. */
            $('#penci-texttospeech-template-speech-template-editor').removeClass('mdc-hidden');

            /** Make Speech Template list sortable. */
            makeListSortable();

            /** Show Iframe preloader. */
            $iFramePreloader.addClass('mdp-active');

            /** Show page preview in iframe. */
            $iFrame.attr('src', postURL);

            /** Fix for Template Name label. */
            let $input = $('#penci-texttospeech-template-name');

            /** Get reference index in global array. */
            let index = $input.parent().data('mdc-index');

            if (isNew) {

                // noinspection SillyAssignmentJS
                /** Refresh value to update field. */
                window.MerkulovMaterial[index].value = randomEl(adjectives) + ' ' + randomEl(nouns);

            } else {

                // noinspection SillyAssignmentJS
                /** Refresh value to update field. */
                window.MerkulovMaterial[index].value = window.MerkulovMaterial[index].value;

            }

        }

        // noinspection SpellCheckingInspection
        let adjectives = ["adamant", "adroit", "amatory", "animistic", "antic", "arcadian", "baleful", "bellicose", "bilious", "boorish", "calamitous", "caustic", "cerulean", "comely", "concomitant", "contumacious", "corpulent", "crapulous", "defamatory", "didactic", "dilatory", "dowdy", "efficacious", "effulgent", "egregious", "endemic", "equanimous", "execrable", "fastidious", "feckless", "fecund", "friable", "fulsome", "garrulous", "guileless", "gustatory", "heuristic", "histrionic", "hubristic", "incendiary", "insidious", "insolent", "intransigent", "inveterate", "invidious", "irksome", "jejune", "jocular", "judicious", "lachrymose", "limpid", "loquacious", "luminous", "mannered", "mendacious", "meretricious", "minatory", "mordant", "munificent", "nefarious", "noxious", "obtuse", "parsimonious", "pendulous", "pernicious", "pervasive", "petulant", "platitudinous", "precipitate", "propitious", "puckish", "querulous", "quiescent", "rebarbative", "recalcitant", "redolent", "rhadamanthine", "risible", "ruminative", "sagacious", "salubrious", "sartorial", "sclerotic", "serpentine", "spasmodic", "strident", "taciturn", "tenacious", "tremulous", "trenchant", "turbulent", "turgid", "ubiquitous", "uxorious", "verdant", "voluble", "voracious", "wheedling", "withering", "zealous"];

        // noinspection SpellCheckingInspection
        let nouns = ["ninja", "chair", "pancake", "statue", "unicorn", "rainbows", "laser", "senor", "bunny", "captain", "nibblets", "cupcake", "carrot", "gnomes", "glitter", "potato", "salad", "toejam", "curtains", "beets", "toilet", "exorcism", "stick figures", "mermaid eggs", "sea barnacles", "dragons", "jellybeans", "snakes", "dolls", "bushes", "cookies", "apples", "ice cream", "ukulele", "kazoo", "banjo", "opera singer", "circus", "trampoline", "carousel", "carnival", "locomotive", "hot air balloon", "praying mantis", "animator", "artisan", "artist", "colorist", "inker", "coppersmith", "director", "designer", "flatter", "stylist", "leadman", "limner", "make-up artist", "model", "musician", "penciller", "producer", "scenographer", "set decorator", "silversmith", "teacher", "auto mechanic", "beader", "bobbin boy", "clerk of the chapel", "filling station attendant", "foreman", "maintenance engineering", "mechanic", "miller", "moldmaker", "panel beater", "patternmaker", "plant operator", "plumber", "sawfiler", "shop foreman", "soaper", "stationary engineer", "wheelwright", "woodworkers"];


        /**
         * Return random element form array.
         **/
        function randomEl(list) {

            let i = Math.floor(Math.random() * list.length);
            let name = list[i];

            return titleCase(name);

        }

        /**
         * Convert string to 'Title Case Format'.
         **/
        function titleCase(str) {

            return str.toLowerCase().split(' ').map(function (word) {

                return word.replace(word[0], word[0].toUpperCase());

            }).join(' ');

        }

    });

}(jQuery));
