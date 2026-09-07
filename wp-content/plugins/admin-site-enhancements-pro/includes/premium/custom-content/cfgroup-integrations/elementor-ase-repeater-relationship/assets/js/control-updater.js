(function($) {
    'use strict';

    var EARControlUpdater = {
        init: function() {
            this.bindEvents();
            this.initializeRepeaterField();
        },

        bindEvents: function() {
            $(document).on('change', '#elementor-panel-page-settings-controls [data-setting="asenha_loop_repeater_field"]', this.onRepeaterFieldChange.bind(this));
            elementor.channels.editor.on('change:asenha_loop_repeater_field', this.onRepeaterFieldChange.bind(this));
        },

        onRepeaterFieldChange: function(e) {
            var selectedRepeater = e.target ? $(e.target).val() : e;
            this.updateDynamicTagControls(selectedRepeater);
            this.updateAseMapWidgetFieldGroups(selectedRepeater);
        },

        initializeRepeaterField: function() {
            var self = this;
            elementor.on('preview:loaded', function() {
                var postId = elementor.config.document.id;
                self.fetchSavedRepeaterField(postId);
            });
        },

        fetchSavedRepeaterField: function(postId) {            
            var restUrl = wpApiSettings.root;
            
            if (!restUrl) {
                console.error('REST URL not found');
                return;
            }
        
            var fullUrl = restUrl + 'elementor-ase-repeater-relationship/v1/get-saved-repeater-field';
        
            $.ajax({
                url: fullUrl,
                method: 'GET',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('X-WP-Nonce', wpApiSettings.nonce);
                },
                data: {
                    post_id: postId
                },
                success: function(response) {
                    if (response && response.repeater_field) {
                        EARControlUpdater.updateDynamicTagControls({
                            key: response.repeater_field,
                            name: response.repeater_field_name || ''
                        });
                        EARControlUpdater.updateAseMapWidgetFieldGroups(response.repeater_field);
                    } 
                },
                error: function(xhr, status, error) {
                    console.error('Failed to retrieve saved repeater field', status, error);
                }
            });
        },

        /**
         * Refresh ASE Map widget Field Name groups for the current Loop Item repeater.
         *
         * @param {string|Object} selectedRepeater Repeater field name or { key: name }.
         */
        updateAseMapWidgetFieldGroups: function(selectedRepeater) {
            try {
                if (!wpApiSettings || !wpApiSettings.root) {
                    return;
                }

                var postId = elementor.config.document.id;
                var repeaterKey = '';

                if (typeof selectedRepeater === 'string') {
                    repeaterKey = selectedRepeater;
                } else if (selectedRepeater && selectedRepeater.key) {
                    repeaterKey = selectedRepeater.key;
                }

                $.ajax({
                    url: wpApiSettings.root + 'elementor-ase-repeater-relationship/v1/get-ase-map-widget-field-groups',
                    method: 'GET',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('X-WP-Nonce', wpApiSettings.nonce);
                    },
                    data: {
                        post_id: postId,
                        selected_repeater: repeaterKey
                    },
                    success: function(response) {
                        if (response && response.groups) {
                            EARControlUpdater.applyAseMapWidgetGroups(response.groups);
                        } else {
                            console.error('Failed to update ASE Map widget field groups:', response);
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('ASE Map widget field groups AJAX error:', status, error);
                    }
                });
            } catch (error) {
                console.error('Error in updateAseMapWidgetFieldGroups:', error);
            }
        },

        /**
         * Write Field Name groups into Elementor widget config and refresh open ASE Map panel.
         *
         * @param {Array} groups Elementor SELECT control groups.
         */
        applyAseMapWidgetGroups: function(groups) {
            var widgetName = 'ase-map';

            if (elementor.config.widgets && elementor.config.widgets[widgetName] && elementor.config.widgets[widgetName].controls && elementor.config.widgets[widgetName].controls.key) {
                elementor.config.widgets[widgetName].controls.key.groups = groups;
            }

            if (elementor.widgetsCache && elementor.widgetsCache[widgetName] && elementor.widgetsCache[widgetName].controls && elementor.widgetsCache[widgetName].controls.key) {
                elementor.widgetsCache[widgetName].controls.key.groups = groups;
            }

            try {
                var panelView = elementor.getPanelView && elementor.getPanelView();
                if (!panelView || typeof panelView.getCurrentPageView !== 'function') {
                    return;
                }

                var pageView = panelView.getCurrentPageView();
                if (!pageView || !pageView.model || pageView.model.get('widgetType') !== widgetName) {
                    return;
                }

                if (pageView.collection && typeof pageView.collection.findWhere === 'function') {
                    var keyControl = pageView.collection.findWhere({ name: 'key' });
                    if (keyControl) {
                        keyControl.set('groups', groups);
                    }
                }

                if (typeof pageView.render === 'function') {
                    pageView.render();
                }
            } catch (e) {
                console.warn('ASE Map widget control refresh skipped:', e);
            }
        },

        updateDynamicTagControls: function(selectedRepeater) {
            try {
                var postId = elementor.config.document.id;
                        
                if (!selectedRepeater) {
                    return;
                }   
        
                var repeaterKey = typeof selectedRepeater === 'string' ? selectedRepeater : selectedRepeater.key;
        
                if (this.lastSelectedRepeater === repeaterKey) {
                    return;
                }
                this.lastSelectedRepeater = repeaterKey;
        
                var dynamicTags = elementor.dynamicTags.getConfig('tags');
                var tagsToUpdate = {};
                
                Object.keys(dynamicTags).forEach(function(tagName) {
                    if (tagName.startsWith('ase-repeater-')) {
                        tagsToUpdate[tagName] = dynamicTags[tagName];
                    }
                });
                
                $.ajax({
                    url: wpApiSettings.root + 'elementor-ase-repeater-relationship/v1/update-dynamic-tag-controls',
                    method: 'POST',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('X-WP-Nonce', wpApiSettings.nonce);
                    },
                    data: {
                        post_id: postId,
                        selected_repeater: repeaterKey,
                        tags: JSON.stringify(tagsToUpdate)
                    },
                    success: function(response) {
                        if (response && response.tags) {
                            EARControlUpdater.updateTagControls(response.tags, response.selected_repeater);
                        } else {
                            console.error('Failed to update dynamic tag controls:', response);
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('AJAX error:', status, error);
                    }
                });
            } catch (error) {
                console.error('Error in updateDynamicTagControls:', error);
            }
        },
        
        updateTagControls: function(updatedTags, selectedRepeater) {
        
            if (!selectedRepeater) {
                console.warn('No repeater selected, skipping tag control update');
                return;
            }

            var currentTags = elementor.dynamicTags.getConfig('tags');

            if (!currentTags) {
                console.error('Unable to get current tags configuration');
                return;
            }

            Object.keys(currentTags).forEach(function(tagName) {
                if (tagName.startsWith('ase-repeater-')) {
                    if (currentTags[tagName].controls && currentTags[tagName].controls.repeater_field) {
                        currentTags[tagName].controls.repeater_field.default = selectedRepeater;
                    }
                }
            });

            Object.keys(updatedTags).forEach(function(tagName) {
                if (currentTags[tagName] && updatedTags[tagName].controls) {
                    Object.keys(updatedTags[tagName].controls).forEach(function(controlName) {
                        if (!currentTags[tagName].controls[controlName]) {
                            currentTags[tagName].controls[controlName] = {};
                        }
                        Object.assign(currentTags[tagName].controls[controlName], updatedTags[tagName].controls[controlName]);
                    });
                }
            });

            if (elementor.dynamicTags.config) {
                elementor.dynamicTags.config.tags = currentTags;
            } else if (elementor.config && elementor.config.dynamicTags) {
                elementor.config.dynamicTags.tags = currentTags;
            } else {
                console.warn('Unable to update dynamic tags configuration');
            }


            elementor.channels.editor.trigger('change:dynamic');

            if (elementor.getPreviewView && typeof elementor.getPreviewView().renderOnChange === 'function') {
                elementor.getPreviewView().renderOnChange();
            } else {
                console.warn('Unable to force update of controls, Elementor structure not as expected');
            }
        },
    };

    // Initialize only when we're sure we're in the Elementor editor for a loop item
    elementor.on('panel:init', function() {
        if (elementor.config.document.type === 'loop-item') {
            EARControlUpdater.init();
        }
    });

})(jQuery);
