(function($) {
    'use strict';

    const tagChangeDetector = {
        pendingTagChanges: [],
        isInitialized: false,
        changeQueue: [],
        isProcessing: false,
        currentElementContext: null,
        lastTagChangeTimestamp: 0,
        tagChangeTimeout: null,
        lastProcessedTag: null,
        cooldownTimer: null,
        isCoolingDown: false,

        init() {
            if (this.isInitialized) return;
            this.isInitialized = true;
            this.setupTagChangeDetection();
            this.detectTagRemoval();
        },

        setupTagChangeDetection() {
            const originalParseTagsText = elementor.dynamicTags.parseTagsText;
            elementor.dynamicTags.parseTagsText = this.modifiedParseTagsText.bind(this, originalParseTagsText);
        },

        modifiedParseTagsText(originalParseTagsText, text, settings, callback) {
            return originalParseTagsText.call(elementor.dynamicTags, text, settings, (id, name, tagSettings) => {
                if (this.isACFRepeaterTag(name) && Object.keys(tagSettings).length > 0) {
                    this.debouncedQueueTagChange(id, name, tagSettings);
                }
                return callback(id, name, tagSettings);
            });
        },

        isACFRepeaterTag(tagName) {
            return tagName && (tagName.startsWith('ase-repeater-') || tagName === 'ase-repeater');
        },
        
        detectTagRemoval() {
            document.addEventListener('click', (event) => {
                const removeButton = event.target.closest('.elementor-dynamic-cover__remove');
                if (removeButton) {
                    const dynamicCover = removeButton.closest('.elementor-dynamic-cover');
                    const tagTitle = dynamicCover?.querySelector('.elementor-dynamic-cover__title');
                    const displayedTagName = tagTitle?.textContent.trim();
                    if (displayedTagName?.startsWith('ASE Repeater')) {
                        this.sendTagRemovalToServer();
                    } 
                } 
            }, true);        
        },

        sendTagRemovalToServer() {
            const currentElement = this.currentElementContext;
            const data = {
                post_id: elementor.config.document.id,
                element_id: currentElement?.id || null,
                is_removed: true
            };
            this.sendAjaxRequest(data, 'Tag removal sent to server');
        },

        debouncedQueueTagChange(id, name, tagSettings) {
            if (this.isCoolingDown) return;

            const now = Date.now();
            this.lastTagChangeTimestamp = now;

            clearTimeout(this.tagChangeTimeout);

            this.tagChangeTimeout = setTimeout(() => {
                if (now === this.lastTagChangeTimestamp) {
                    this.queueTagChange(id, name, tagSettings);
                }
            }, 1000); // Debounce delay
        },

        queueTagChange(id, name, tagSettings) {
            const cacheKey = `${id}-${name}-${JSON.stringify(tagSettings)}`;
            if (this.lastProcessedTag === cacheKey) return;
            
            this.lastProcessedTag = cacheKey;
            this.changeQueue.push({ id, name, tagSettings });
            this.processQueue();
            this.startCooldown();
        },

        processQueue() {
            if (this.isProcessing) return;

            this.isProcessing = true;
            const processNext = () => {
                if (this.changeQueue.length > 0) {
                    const change = this.changeQueue.shift();
                    this.processTagChange(change.id, change.name, change.tagSettings);
                    setTimeout(processNext, 0);
                } else {
                    this.isProcessing = false;
                }
            };
            processNext();
        },

        processTagChange(id, name, tagSettings) {
            const tagLabel = name.replace('ase-repeater-', '');
            const fieldKey = tagSettings.repeater_field;
            let fieldLabel = 'Unknown';

            const aseRepeaterTag = elementor.dynamicTags.getConfig('tags')[`ase-repeater-${tagLabel}`];
            if (aseRepeaterTag?.controls?.repeater_field?.groups) {
                for (const group of aseRepeaterTag.controls.repeater_field.groups) {
                    if (group.options?.[fieldKey]) {
                        fieldLabel = group.options[fieldKey];
                        break;
                    }
                }
            }
            this.sendTagChangeToServer(id, name, tagSettings);
        },

        sendTagChangeToServer(id, name, tagSettings) {
            const currentElement = this.currentElementContext;
            const data = {
                tag_id: id,
                tag_name: name,
                settings: tagSettings ? JSON.stringify(tagSettings) : null,
                post_id: elementor.config.document.id,
                element_id: currentElement?.id || '',
                is_removed: false
            };
            this.sendAjaxRequest(data, 'Tag change sent to server');
        },

        sendAjaxRequest(data, successMessage) {
            $.ajax({
                url: `${wpApiSettings.root}elementor-ase-repeater-relationship/v1/handle-ase-repeater-change`,
                method: 'POST',
                beforeSend: (xhr) => xhr.setRequestHeader('X-WP-Nonce', wpApiSettings.nonce),
                data,
                success: (response) => {
                    // Maybe do something here
                },
                error: (xhr, status, error) => {
                    console.error('Error sending data to server:', error);
                    console.error('XHR response:', xhr.responseText);
                    // Maybe do something here
                }
            });
        },

        setCurrentElementContext(element) {
            this.currentElementContext = element;
        },

        startCooldown() {
            this.isCoolingDown = true;
            clearTimeout(this.cooldownTimer);
            this.cooldownTimer = setTimeout(() => {
                this.isCoolingDown = false;
            }, 2000); // 2 second cooldown
        }
    };

    $(document).ready(() => {
        tagChangeDetector.init();
    });

    elementor.channels.editor.on('section:activated', (sectionName, editor) => {
        tagChangeDetector.setCurrentElementContext(editor.getOption('editedElementView').getContainer());
    });
})(jQuery);