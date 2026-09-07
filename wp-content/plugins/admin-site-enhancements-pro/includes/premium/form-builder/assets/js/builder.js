var formBuilder = formBuilder || {};

(function ($) {
    'use strict';
    let $editorFieldsWrap = $('#fb-editor-fields'),
        $editorWrap = $('#fb-editor-wrap'),
        $buildForm = $('#fb-fields-form'),
        $optionsPanel = $('#fb-options-panel'),
        $formLabelPosition = $('select[name="form_label_position"]'),
        $formLabelAlignment = $('select[name="form_label_alignment"]'),
        $requiredFieldIndicator = $('input[name="required_field_indicator"]'),
        buildForm = document.getElementById('fb-fields-form'),
        $formMeta = $('#fb-meta-form'),
        $formSettings = $('#fb-settings-form'),
        currentFormId = $('#fb-form-id').val(),
        copyHelper = false,
        // fieldsUpdated = 0,
        autoId = 0;

    $.fn.simpleAccordion = function() {
        this.on("click", ".accordion__control", function() {
            // Toggle the panel next to the item that was clicked
            $(this).toggleClass("accordion__control--active").next().slideToggle(100);
        });
    
        // Return jQuery object for method chaining
        return this;
    }

    const wysiwyg = {
        init(editor, {setupCallback, height, addFocusEvents} = {}) {
            if (isTinyMceActive()) {
                setTimeout(resetTinyMce, 0);
            } else {
                initQuickTagsButtons();
            }

            setUpTinyMceVisualButtonListener();
            setUpTinyMceHtmlButtonListener();

            function initQuickTagsButtons() {
                if ('function' !== typeof window.quicktags || typeof window.QTags.instances[editor.id] !== 'undefined') {
                    return;
                }

                const id = editor.id;
                window.quicktags({
                    name: 'qt_' + id,
                    id: id,
                    canvas: editor,
                    settings: {id},
                    toolbar: document.getElementById('qt_' + id + '_toolbar'),
                    theButtons: {}
                });
            }

            function initRichText() {
                const key = Object.keys(tinyMCEPreInit.mceInit)[0];
                const orgSettings = tinyMCEPreInit.mceInit[key];

                const settings = Object.assign(
                    {},
                    orgSettings,
                    {
                        selector: '#' + editor.id,
                        body_class: orgSettings.body_class.replace(key, editor.id)
                    }
                );

                settings.setup = editor => {
                    if (addFocusEvents) {
                        function focusInCallback() {
                            $(editor.targetElm).trigger('focusin');
                            editor.off('focusin', '**');
                        }

                        editor.on('focusin', focusInCallback);

                        editor.on('focusout', function () {
                            editor.on('focusin', focusInCallback);
                        });
                    }
                    if (setupCallback) {
                        setupCallback(editor);
                    }
                };

                if (height) {
                    settings.height = height;
                }

                tinymce.init(settings);
            }

            function removeRichText() {
                tinymce.EditorManager.execCommand('mceRemoveEditor', true, editor.id);
            }

            function resetTinyMce() {
                removeRichText();
                initRichText();
            }

            function isTinyMceActive() {
                const id = editor.id;
                const wrapper = document.getElementById('wp-' + id + '-wrap');
                return null !== wrapper && wrapper.classList.contains('tmce-active');
            }

            function setUpTinyMceVisualButtonListener() {
                $(document).on(
                    'click', '#' + editor.id + '-html',
                    function () {
                        editor.style.visibility = 'visible';
                        initQuickTagsButtons(editor);
                    }
                );
            }

            function setUpTinyMceHtmlButtonListener() {
                $('#' + editor.id + '-tmce').on('click', handleTinyMceHtmlButtonClick);
            }

            function handleTinyMceHtmlButtonClick() {
                if (isTinyMceActive()) {
                    resetTinyMce();
                } else {
                    initRichText();
                }

                const wrap = document.getElementById('wp-' + editor.id + '-wrap');
                wrap.classList.add('tmce-active');
                wrap.classList.remove('html-active');
            }
        }
    };

    formBuilder = {
        init: function () {
            formBuilder.initBuild();

        },

        initBuild: function () {
            $('ul.fb-fields-list, .fb-fields-list li').disableSelection();
            $('.fields-list-accordion').simpleAccordion();
            $('.advanced-field-options-accordion').simpleAccordion().addClass('accordion-initialized');
            $('.form-options-accordion').simpleAccordion();

            formBuilder.normalizeEditorFieldRows();
            formBuilder.ensureAllSectionMarkerLayouts();
            formBuilder.setupSortable('ul.fb-editor-sorting');
            document.querySelectorAll('.fb-fields-list > li').forEach(formBuilder.makeDraggable);

            $editorFieldsWrap.on('click', 'li.fb-editor-field-box.ui-state-default', formBuilder.clickField);
            $editorFieldsWrap.on('click', '.fb-editor-delete-action', formBuilder.clickDeleteField);
            $editorFieldsWrap.on('mousedown', 'input, textarea, select', formBuilder.stopFieldFocus);
            $editorFieldsWrap.on('click', 'input[type=radio], input[type=checkbox]', formBuilder.stopFieldFocus);
            $formLabelPosition.on('change', formBuilder.setFormLabelPosition);
            $formLabelAlignment.on('change', formBuilder.setFormLabelAlignment);
            $requiredFieldIndicator.on('keyup', formBuilder.setRequiredFieldIndicator)

            // $(document).ready( function() {
                // Do something here...
            // });

            $('#fb-add-fields-panel').on('click', '.fb-add-field', formBuilder.addFieldClick);
            $('.fb-form-title-span, .fb-edit-form-title').on('click', function() {
                $('#fb-design-tab').trigger('click');
            });

            $('input[name="title"]').bind('keypress keyup blur', function() {
                var newTitle = $(this).val();
                $('#fb-form-title span.fb-form-title-span').text(newTitle);
            });

            formBuilder.ensureAllSectionMarkerLayouts();
            formBuilder.syncEditorHasFieldsState();
            formBuilder.bindStepTitleLiveSync();
            formBuilder.syncStepTitleInputs();
            formBuilder.bindMultiStepOptionToggles();
        },

        isSectionMarkerField: function (el) {
            if (!el || !el.classList) {
                return false;
            }

            return el.classList.contains('fb-editor-field-type-section_start')
                || el.classList.contains('fb-editor-field-type-section_end')
                || el.classList.contains('fb-editor-field-type-page_break');
        },

        isSectionMarkerFieldType: function (type) {
            return 'section_start' === type || 'section_end' === type || 'page_break' === type;
        },

        isPageBreakField: function (el) {
            return !!(el && el.classList && el.classList.contains('fb-editor-field-type-page_break'));
        },

        defaultStepTitle: function (index) {
            return 'Step ' + (parseInt(index, 10) + 1);
        },

        getPageBreakFieldsInOrder: function () {
            return formBuilder.getEditorFormFields().filter(function (fieldEl) {
                return formBuilder.isPageBreakField(fieldEl);
            });
        },

        getStepCountFromCanvas: function () {
            const breaks = formBuilder.getPageBreakFieldsInOrder().length;
            return breaks > 0 ? breaks + 1 : 0;
        },

        ensureStep1Marker: function () {
            const root = formBuilder.getEditorFieldsRoot();
            const editorWrap = formBuilder.getEditorWrap();
            if (!root || !editorWrap) {
                return;
            }

            let marker = document.getElementById('fb-step-1-marker');
            const stepCount = formBuilder.getStepCountFromCanvas();

            if (stepCount < 2) {
                if (marker) {
                    marker.remove();
                }
                return;
            }

            if (!marker) {
                marker = document.createElement('div');
                marker.id = 'fb-step-1-marker';
                marker.className = 'fb-step-canvas-marker fb-step-canvas-marker--first';
                marker.innerHTML = '<span class="fb-step-canvas-marker__label" data-step-marker-title data-step-index="0"></span>';
            }

            if (marker.parentNode !== editorWrap || marker.nextSibling !== root) {
                editorWrap.insertBefore(marker, root);
            }
        },

        syncStepTitleInputs: function () {
            const list = document.getElementById('fb-step-titles-list');
            if (!list) {
                return;
            }

            const stepCount = formBuilder.getStepCountFromCanvas();
            const needed = stepCount > 0 ? stepCount : 1;
            const existing = list.querySelectorAll('.fb-step-title-row');

            while (existing.length > needed) {
                const last = list.querySelector('.fb-step-title-row:last-child');
                if (!last) {
                    break;
                }
                last.remove();
            }

            for (let i = 0; i < needed; i++) {
                let row = list.querySelector('.fb-step-title-row[data-step-index="' + i + '"]');
                if (!row) {
                    row = document.createElement('div');
                    row.className = 'fb-step-title-row';
                    row.setAttribute('data-step-index', String(i));
                    row.innerHTML = '<label class="fb-step-title-row__label"></label>'
                        + '<input type="text" class="fb-step-title-input" />';
                    list.appendChild(row);
                }

                const label = row.querySelector('.fb-step-title-row__label');
                const input = row.querySelector('.fb-step-title-input');
                if (label) {
                    label.textContent = formBuilder.defaultStepTitle(i);
                }
                if (input) {
                    input.name = 'step_titles[' + i + ']';
                    input.setAttribute('data-step-index', String(i));
                    if (!input.value) {
                        input.value = formBuilder.defaultStepTitle(i);
                    }
                }
            }

            formBuilder.ensureStep1Marker();
            formBuilder.refreshStepTitleMarkers();
        },

        getStepTitleValue: function (index) {
            const input = document.querySelector('#fb-step-titles-list .fb-step-title-input[data-step-index="' + index + '"]');
            if (input && input.value) {
                return input.value;
            }
            return formBuilder.defaultStepTitle(index);
        },

        refreshStepTitleMarkers: function () {
            formBuilder.ensureStep1Marker();

            const step1 = document.querySelector('#fb-step-1-marker [data-step-marker-title]');
            if (step1) {
                step1.textContent = formBuilder.getStepTitleValue(0);
            }

            const breaks = formBuilder.getPageBreakFieldsInOrder();
            breaks.forEach(function (breakEl, breakIndex) {
                const titleEl = breakEl.querySelector('[data-step-marker-title]');
                if (titleEl) {
                    const stepIndex = breakIndex + 1;
                    titleEl.setAttribute('data-step-index', String(stepIndex));
                    titleEl.textContent = formBuilder.getStepTitleValue(stepIndex);
                }
            });
        },

        bindStepTitleLiveSync: function () {
            $(document).on('input keyup change', '#fb-step-titles-list .fb-step-title-input', function () {
                formBuilder.refreshStepTitleMarkers();
            });
        },

        /**
         * Show/hide Multi-Step Form option fields based on parent checkboxes.
         */
        bindMultiStepOptionToggles: function () {
            const $wrap = $('#fb-multi-step-options');
            if (!$wrap.length) {
                return;
            }

            const syncToggle = function ($checkbox) {
                const target = $checkbox.data('fb-ms-target');
                if (!target) {
                    return;
                }
                $wrap.find('.' + target).toggleClass('fb-hidden', !$checkbox.is(':checked'));
            };

            const syncStepsStyleVisibility = function () {
                const $progress = $wrap.find('#fb-progress-indicator');
                const $stepsStyleWrap = $wrap.find('#fb-steps-style-wrap');

                if (!$progress.length || !$stepsStyleWrap.length) {
                    return;
                }

                $stepsStyleWrap.toggleClass('fb-hidden', 'steps' !== $progress.val());
            };

            $wrap.on('change', '.fb-ms-toggle', function () {
                syncToggle($(this));
            });

            $wrap.on('change', '#fb-progress-indicator', function () {
                syncStepsStyleVisibility();
            });

            $wrap.find('.fb-ms-toggle').each(function () {
                syncToggle($(this));
            });

            syncStepsStyleVisibility();
        },

        isFieldListContainer: function (el) {
            if (!el || !el.classList) {
                return false;
            }

            return 'fb-editor-fields' === el.id;
        },

        isFieldRowWrapper: function (el) {
            return !!(el && el.classList && el.classList.contains('fb-editor-field-box') && !el.classList.contains('fb-editor-form-field'));
        },

        isFormFieldElement: function (el) {
            return !!(el && el.classList && el.classList.contains('fb-editor-form-field'));
        },

        getEditorFieldsRoot: function () {
            return document.getElementById('fb-editor-fields');
        },

        getEditorWrap: function () {
            return document.getElementById('fb-editor-wrap');
        },

        restoreEditorWrapChildren: function () {
            const editorWrap = formBuilder.getEditorWrap();

            if (!editorWrap) {
                return;
            }

            ['.fb-editor-submit-button-wrap', '.fb-no-fields'].forEach(
                function (selector) {
                    const childEl = document.querySelector(selector);

                    if (childEl && childEl.parentElement !== editorWrap) {
                        editorWrap.appendChild(childEl);
                    }
                }
            );
        },

        getEditorFormFields: function () {
            const root = formBuilder.getEditorFieldsRoot();

            if (!root) {
                return [];
            }

            return Array.from(root.querySelectorAll('li.fb-editor-form-field[data-fid]')).filter(
                function (fieldEl) {
                    return !fieldEl.classList.contains('fb-sortable-helper');
                }
            );
        },

        syncEditorHasFieldsState: function () {
            const editorWrap = formBuilder.getEditorWrap();

            if (!editorWrap) {
                return;
            }

            formBuilder.restoreEditorWrapChildren();
            editorWrap.classList.toggle('fb-editor-has-fields', 0 < formBuilder.getEditorFormFields().length);
        },

        getRowWrapperFromList: function (listEl) {
            const parent = listEl ? listEl.parentElement : null;
            return formBuilder.isFieldRowWrapper(parent) ? parent : null;
        },

        getDirectRowList: function (rowEl) {
            if (!formBuilder.isFieldRowWrapper(rowEl)) {
                return null;
            }

            return rowEl.querySelector(':scope > ul.fb-editor-sorting');
        },

        normalizeEditorFieldRows: function () {
            formBuilder.fixUnwrappedListItems();
            formBuilder.hoistStrayFieldRows();
            formBuilder.flattenNestedFieldRows();
            formBuilder.hoistStrayFieldRows();
            formBuilder.maybeDeleteEmptyFieldGroups();
        },

        hoistStrayFieldRows: function () {
            const root = formBuilder.getEditorFieldsRoot();

            if (!root) {
                return;
            }

            document.querySelectorAll('li.fb-editor-field-box').forEach(
                function (rowEl) {
                    const parent = rowEl.parentElement;
                    const rowList = formBuilder.getDirectRowList(rowEl);

                    if (!formBuilder.isFieldRowWrapper(rowEl) || !rowList || formBuilder.isFieldListContainer(parent) || (parent && parent.classList && parent.classList.contains('fb-editor-grid-container'))) {
                        return;
                    }

                    root.appendChild(rowEl);
                }
            );
        },

        flattenNestedFieldRows: function () {
            document.querySelectorAll('ul.fb-editor-grid-container > li.fb-editor-field-box:not(.fb-editor-form-field)').forEach(
                function (nestedRow) {
                    formBuilder.hoistNestedFieldRow(nestedRow);
                }
            );
        },

        hoistNestedFieldRow: function (nestedRow) {
            const sourceList = nestedRow ? nestedRow.parentElement : null;
            const hostRow = formBuilder.getRowWrapperFromList(sourceList);
            const targetList = hostRow ? hostRow.parentElement : null;
            const rowNodes = sourceList ? Array.from(sourceList.children).filter(node => 1 === node.nodeType) : [];
            const nestedIndex = rowNodes.indexOf(nestedRow);
            let afterRow = null;

            if (!sourceList || !hostRow || !targetList || nestedIndex === -1) {
                return;
            }

            const afterNodes = rowNodes.slice(nestedIndex + 1);

            afterNodes.forEach(
                function (node) {
                    sourceList.removeChild(node);
                }
            );

            sourceList.removeChild(nestedRow);
            targetList.insertBefore(nestedRow, hostRow.nextSibling);

            if (afterNodes.length) {
                afterRow = formBuilder.createFieldRowWrapper(afterNodes);
                targetList.insertBefore(afterRow, nestedRow.nextSibling);
            }

            if (!sourceList.children.length) {
                hostRow.remove();
            } else if (formBuilder.getFieldsInRow($(sourceList)).length) {
                formBuilder.syncLayoutClasses(formBuilder.getFieldsInRow($(sourceList)).first());
            }

            if (afterRow) {
                const afterList = formBuilder.getDirectRowList(afterRow);
                if (afterList && formBuilder.getFieldsInRow($(afterList)).length) {
                    formBuilder.syncLayoutClasses(formBuilder.getFieldsInRow($(afterList)).first());
                }
            }
        },

        createFieldRowWrapper: function (fields) {
            const ul = formBuilder.tag('ul', {
                className: 'fb-editor-grid-container fb-editor-sorting'
            });
            const wrapper = formBuilder.tag('li', {
                className: 'fb-editor-field-box',
                child: ul
            });

            fields.forEach(
                function (fieldEl) {
                    ul.appendChild(fieldEl);
                }
            );

            formBuilder.makeDroppable(ul);
            formBuilder.makeDraggable(wrapper, '.fb-editor-move-action');

            return wrapper;
        },

        syncFieldRowLayout: function (rowEl) {
            const $fields = formBuilder.getFieldsInRow($(rowEl));

            if ($fields.length) {
                formBuilder.syncLayoutClasses($fields.first());
            } else if (!rowEl.children.length) {
                formBuilder.maybeDeleteAnEmptyFieldGroup(rowEl);
            }
        },

        extractSectionMarkerToSoloRow: function (fieldEl) {
            const parentUl = fieldEl.parentElement;
            const rowWrapper = formBuilder.getRowWrapperFromList(parentUl);
            const rowParent = rowWrapper ? rowWrapper.parentElement : null;
            const fieldsInRow = Array.from(formBuilder.getFieldsInRow($(parentUl)));
            const fieldIndex = fieldsInRow.indexOf(fieldEl);

            if (!parentUl || !rowWrapper || !rowParent || fieldIndex === -1 || fieldsInRow.length <= 1) {
                return parentUl;
            }

            const beforeFields = fieldsInRow.slice(0, fieldIndex);
            const afterFields = fieldsInRow.slice(fieldIndex + 1);
            let markerRow = rowWrapper;

            if (beforeFields.length) {
                fieldsInRow.slice(fieldIndex).forEach(
                    function (rowField) {
                        if (rowField.parentElement === parentUl) {
                            parentUl.removeChild(rowField);
                        }
                    }
                );

                markerRow = formBuilder.createFieldRowWrapper([fieldEl]);
                rowParent.insertBefore(markerRow, rowWrapper.nextSibling);
                formBuilder.syncFieldRowLayout(parentUl);
            } else {
                afterFields.forEach(
                    function (rowField) {
                        if (rowField.parentElement === parentUl) {
                            parentUl.removeChild(rowField);
                        }
                    }
                );
            }

            if (afterFields.length) {
                const afterRow = formBuilder.createFieldRowWrapper(afterFields);
                rowParent.insertBefore(afterRow, markerRow.nextSibling);
                formBuilder.syncFieldRowLayout(afterRow.querySelector('ul.fb-editor-sorting'));
            }

            return markerRow.querySelector('ul.fb-editor-sorting');
        },

        ensureSectionMarkerLayout: function (fieldEl) {
            if (!formBuilder.isSectionMarkerField(fieldEl)) {
                return;
            }

            let parentUl = fieldEl.parentElement;

            if (parentUl && formBuilder.isFieldListContainer(parentUl)) {
                formBuilder.wrapFieldLiInPlace(fieldEl);
                formBuilder.ensureSectionMarkerLayout(fieldEl);
                return;
            }

            if (parentUl && formBuilder.getFieldsInRow($(parentUl)).length > 1) {
                parentUl = formBuilder.extractSectionMarkerToSoloRow(fieldEl);
            }

            formBuilder.changeFieldClass(fieldEl, 'fb-grid-12');

            const fieldId = fieldEl.dataset.fid;

            if (fieldId) {
                const gridClassInput = document.getElementById('fb-grid-class-' + fieldId);

                if (gridClassInput) {
                    gridClassInput.value = 'fb-grid-12';
                }
            }
        },

        ensureAllSectionMarkerLayouts: function () {
            document.querySelectorAll('.fb-editor-field-type-section_start, .fb-editor-field-type-section_end, .fb-editor-field-type-page_break').forEach(
                function (fieldEl) {
                    formBuilder.ensureSectionMarkerLayout(fieldEl);
                }
            );
        },

        setupSortable: function (sortableSelector) {
            document.querySelectorAll(sortableSelector).forEach(
                list => {
                    formBuilder.makeDroppable(list);
                    Array.from(list.children).forEach(
                        child => formBuilder.makeDraggable(child, '.fb-editor-move-action')
                    );
                }
            );
        },

        makeDroppable: function (list) {
            $(list).droppable({
                accept: '.fb-field-box, .fb-editor-field-box',
                deactivate: formBuilder.handleFieldDrop,
                over: formBuilder.onDragOverDroppable,
                out: formBuilder.onDraggableLeavesDroppable,
                tolerance: 'pointer'
            });
        },

        makeDraggable: function (draggable, handle) {
            const settings = {
                helper: function (event) {
                    const draggable = event.delegateTarget;

                    if (draggable.classList.contains('fb-editor-field-box') && !draggable.classList.contains('fb-editor-form-field')) {
                        const newTextFieldClone = '';
                        newTextFieldClone.querySelector('span').textContent = 'Field Group';
                        newTextFieldClone.classList.add('fb-editor-field-box');
                        newTextFieldClone.classList.add('ui-sortable-helper');
                        return newTextFieldClone;
                    }

                    let copyTarget;
                    const isNewField = draggable.classList.contains('fb-field-box');
                    if (isNewField) {
                        copyTarget = draggable.cloneNode(true);
                        copyTarget.classList.add('ui-sortable-helper');
                        draggable.classList.add('fb-added-field');
                        return copyTarget;
                    }

                    if (draggable.hasAttribute('data-type')) {
                        const fieldType = draggable.getAttribute('data-type');
                        copyTarget = document.getElementById('fb-add-fields-panel').querySelector('.formbuilder_' + fieldType);
                        copyTarget = copyTarget.cloneNode(true);
                        copyTarget.classList.add('fb-editor-form-field');

                        copyTarget.classList.add('ui-sortable-helper');

                        if (copyTarget) {
                            return copyTarget.cloneNode(true);
                        }
                    }

                    return formBuilder.div({className: 'fb-field-box'});
                },
                revert: 'invalid',
                delay: 10,
                start: function (event, ui) {
                    document.body.classList.add('fb-dragging');
                    ui.helper.addClass('fb-sortable-helper');

                    event.target.classList.add('fb-drag-fade');

                    formBuilder.unselectFieldGroups();
                    formBuilder.maybeRemoveGroupHoverTarget();
                },
                stop: function () {
                    document.body.classList.remove('fb-dragging');

                    const fade = document.querySelector('.fb-drag-fade');
                    if (fade) {
                        fade.classList.remove('fb-drag-fade');
                    }
                },
                drag: function (event, ui) {
                    // maybeScrollBuilder( event );
                    const draggable = event.target;
                    const droppable = formBuilder.getDroppableTarget();

                    let placeholder = document.getElementById('fb-placeholder');

                    if (!formBuilder.allowDrop(draggable, droppable)) {
                        if (placeholder) {
                            placeholder.remove();
                        }
                        return;
                    }

                    if (!placeholder) {
                        placeholder = formBuilder.tag('li', {
                            id: 'fb-placeholder',
                            className: 'sortable-placeholder'
                        });
                    }
                    const hfSortableHelper = ui.helper.get(0);

                    if ('fb-editor-fields' === droppable.id) {
                        placeholder.style.left = 0;
                        formBuilder.handleDragOverYAxis({droppable, y: event.clientY, placeholder});
                        return;
                    }

                    placeholder.style.top = '';
                    formBuilder.handleDragOverFieldGroup({droppable, x: event.clientX, placeholder});
                },
                cursor: 'grabbing',
                refreshPositions: true,
                cursorAt: {
                    top: 0,
                    left: 90 // The width of draggable button is 180. 90 should center the draggable on the cursor.
                }
            };
            if ('string' === typeof handle) {
                settings.handle = handle;
            }
            $(draggable).draggable(settings);
        },

        div: function (args) {
            return formBuilder.tag('div', args);
        },

        tag: function (type, args = {}) {
            const output = document.createElement(type);
            if ('string' === typeof args) {
                output.textContent = args;
                return output;
            }

            const {id, className, children, child, text, data} = args;

            if (id) {
                output.id = id;
            }
            if (className) {
                output.className = className;
            }
            if (children) {
                children.forEach(child => output.appendChild(child));
            } else if (child) {
                output.appendChild(child);
            } else if (text) {
                output.textContent = text;
            }
            if (data) {
                Object.keys(data).forEach(function (dataKey) {
                    output.setAttribute('data-' + dataKey, data[dataKey]);
                });
            }
            return output;
        },

        maybeRemoveGroupHoverTarget: function () {
            var controls, previousHoverTarget;

            controls = document.getElementById('formbuilder_field_group_controls');
            if (null !== controls) {
                controls.style.display = 'none';
            }

            previousHoverTarget = document.querySelector('.fb-field-group-hover-target');
            if (null === previousHoverTarget) {
                return false;
            }

            $('#wpbody-content').off('mousemove', formBuilder.maybeRemoveHoverTargetOnMouseMove);
            previousHoverTarget.classList.remove('fb-field-group-hover-target');
            return previousHoverTarget;
        },

        getDroppableTarget: function () {
            let droppable = document.getElementById('fb-editor-fields');
            while (droppable.querySelector('.fb-dropabble')) {
                droppable = droppable.querySelector('.fb-dropabble');
            }
            if ('fb-editor-fields' === droppable.id && !droppable.classList.contains('fb-dropabble')) {
                droppable = false;
            }
            return droppable;
        },

        handleDragOverYAxis: function ({droppable, y, placeholder}) {
            const $list = $(droppable);
            let top;

            const $children = $list.children();
            if (0 === $children.length) {
                $list.prepend(placeholder);
                top = 0;
            } else {
                const insertAtIndex = formBuilder.determineIndexBasedOffOfMousePositionInList($list, y);
                if (insertAtIndex === $children.length) {
                    const $lastChild = $($children.get(insertAtIndex - 1));
                    top = $lastChild.offset().top + $lastChild.outerHeight();
                    $list.append(placeholder);
                } else {
                    top = $($children.get(insertAtIndex)).offset().top;
                    $($children.get(insertAtIndex)).before(placeholder);
                }
            }
            top -= $list.offset().top;
            placeholder.style.top = top + 'px';
        },

        handleDragOverFieldGroup: function ({droppable, x, placeholder}) {
            const $row = $(droppable);
            const $children = formBuilder.getFieldsInRow($row);
            if (!$children.length) {
                return;
            }
            let left;
            const insertAtIndex = formBuilder.determineIndexBasedOffOfMousePositionInRow($row, x);

            if (insertAtIndex === $children.length) {
                const $lastChild = $($children.get(insertAtIndex - 1));
                left = $lastChild.offset().left + $lastChild.outerWidth();
                $row.append(placeholder);
            } else {
                left = $($children.get(insertAtIndex)).offset().left;
                $($children.get(insertAtIndex)).before(placeholder);

                const amountToOffsetLeftBy = 0 === insertAtIndex ? 4 : 8; // Offset by 8 in between rows, but only 4 for the first item in a group.
                left -= amountToOffsetLeftBy; // Offset the placeholder slightly so it appears between two fields.
            }
            left -= $row.offset().left;
            placeholder.style.left = left + 'px';
        },

        determineIndexBasedOffOfMousePositionInRow: function ($row, x) {
            var $inputs = formBuilder.getFieldsInRow($row),
                length = $inputs.length,
                index, input, inputLeft, returnIndex;
            returnIndex = 0;
            for (index = length - 1; index >= 0; --index) {
                input = $inputs.get(index);
                inputLeft = $(input).offset().left;
                if (x > inputLeft) {
                    returnIndex = index;
                    if (x > inputLeft + ($(input).outerWidth() / 2)) {
                        returnIndex = index + 1;
                    }
                    break;
                }
            }
            return returnIndex;
        },

        getFieldsInRow: function ($row) {
            let $fields = $();
            const row = $row.get(0);
            if (!row.children) {
                return $fields;
            }

            Array.from(row.children).forEach(
                child => {
                    if ('none' === child.style.display) {
                        return;
                    }
                    const classes = child.classList;
                    if (!classes.contains('fb-editor-form-field') || classes.contains('fb-sortable-helper')) {
                        return;
                    }
                    $fields = $fields.add(child);
                }
            );
            return $fields;
        },

        allowDrop: function (draggable, droppable) {
            if (false === droppable) {
                return false;
            }

            if (droppable.closest('.fb-sortable-helper')) {
                return false;
            }

            if ('fb-editor-fields' === droppable.id) {
                return true;
            }

            const $fieldsInRow = formBuilder.getFieldsInRow($(droppable));
            if (!formBuilder.groupCanFitAnotherField($fieldsInRow, $(draggable))) {
                // Field group is full and cannot accept another field.
                return false;
            }

            const isNewField = draggable.classList.contains('fb-added-field');
            if (isNewField) {
                return formBuilder.allowNewFieldDrop(draggable, droppable);
            }
            return formBuilder.allowMoveField(draggable, droppable);
        },

        groupCanFitAnotherField: function (fieldsInRow, $field) {
            var fieldId, index;

            for (index = 0; index < fieldsInRow.length; index++) {
                if (formBuilder.isSectionMarkerField(fieldsInRow.get(index))) {
                    return false;
                }
            }

            if ($field.length && formBuilder.isSectionMarkerField($field.get(0))) {
                return false;
            }

            if (fieldsInRow.length < 6) {
                return true;
            }
            if (fieldsInRow.length > 6) {
                return false;
            }
            fieldId = $field.attr('data-fid');
            // allow 6 if we're not changing field groups.
            return 1 === $(fieldsInRow).filter('[data-fid="' + fieldId + '"]').length;
        },

        allowNewFieldDrop: function (draggable, droppable) {
            const classes = draggable.classList;
            const newHiddenField = classes.contains('formbuilder_hidden');
            const newSectionMarkerField = classes.contains('formbuilder_section_start') || classes.contains('formbuilder_section_end') || classes.contains('formbuilder_page_break');

            const newFieldWillBeAddedToAGroup = 'fb-editor-fields' !== droppable.id;
            if (newFieldWillBeAddedToAGroup) {
                if (formBuilder.groupIncludesBreakOrHidden(droppable)) {
                    return false;
                }
                return !newHiddenField && !newSectionMarkerField;
            }

            return true;
        },

        allowMoveField: function (draggable, droppable) {
            if (draggable.classList.contains('fb-editor-field-box') && !draggable.classList.contains('fb-editor-form-field')) {
                return formBuilder.allowMoveFieldGroup(draggable, droppable);
            }

            const isHiddenField = draggable.classList.contains('fb-editor-field-type-hidden');
            if (isHiddenField) {
                return false;
            }

            if (formBuilder.isSectionMarkerField(draggable)) {
                return false;
            }
            return formBuilder.allowMoveFieldToGroup(draggable, droppable);
        },

        allowMoveFieldGroup: function () {
            // Field groups can only be dropped onto the top-level list (handled in allowDrop).
            return false;
        },

        allowMoveFieldToGroup: function (draggable, group) {
            if (formBuilder.isSectionMarkerField(draggable)) {
                return false;
            }

            if (formBuilder.groupIncludesBreakOrHidden(group)) {
                // Never allow any field beside a hidden field.
                return false;
            }

            const isFieldGroup = $(draggable).children('ul.fb-editor-sorting').length > 0;
            if (isFieldGroup) {
                // Do not allow a field group directly inside of a field group.
                return false;
            }

            return true;
        },

        groupIncludesBreakOrHidden: function (group) {
            return null !== group.querySelector('.fb-editor-field-type-hidden');
        },

        unselectFieldGroups: function (event) {
            if ('undefined' !== typeof event) {
                if (null !== event.originalEvent.target.closest('#fb-editor-fields')) {
                    return;
                }
                if (event.originalEvent.target.classList.contains('fb-merge-fields-into-row')) {
                    return;
                }
                if (null !== event.originalEvent.target.closest('.fb-merge-fields-into-row')) {
                    return;
                }
                if (event.originalEvent.target.classList.contains('fb-custom-field-group-layout')) {
                    return;
                }
                if (event.originalEvent.target.classList.contains('fb-cancel-custom-field-group-layout')) {
                    return;
                }
            }
            $('.fb-selected-field-group').removeClass('fb-selected-field-group');
            $(document).off('click', formBuilder.unselectFieldGroups);
        },

        clickField: function (e) {
            /*jshint validthis:true */
            var currentClass;

            currentClass = e.target.classList;

            if (currentClass.contains('fb-collapse-page') || currentClass.contains('fb-sub-label') || e.target.closest('.dropdown') !== null) {
                return;
            }

            formBuilder.clickAction(this);
            
            // Close current "Advanced Options" panel on clicking another field in the builder preview
            // $('.accordion__control.accordion__control--active').toggleClass('accordion__control--active').next().slideToggle(200);
        },

        clickAction: function (obj) {
            var $thisobj = $(obj);
            if (obj.className.indexOf('selected') !== -1)
                return;
            formBuilder.deselectFields();
            $thisobj.addClass('selected');
            formBuilder.showFieldOptions(obj);
        },

        showFieldOptions: function (obj) {
            var i, singleField,
                fieldId = obj.getAttribute('data-fid'),
                fieldType = obj.getAttribute('data-type'),
                allFieldSettings = document.querySelectorAll('.fb-fields-settings:not(.fb-hidden)');

            for (i = 0; i < allFieldSettings.length; i++) {
                allFieldSettings[i].classList.add('fb-hidden');
            }

            singleField = document.getElementById('fb-fields-settings-' + fieldId);
            formBuilder.moveFieldSettings(singleField);

            singleField.classList.remove('fb-hidden');
            document.getElementById('fb-options-tab').click();
            
            $('#fb-fields-settings-' + fieldId + ' .advanced-field-options-accordion:not(.accordion-initialized)').simpleAccordion().addClass('accordion-initialized');

            if (typeof formAdmin !== 'undefined' && typeof formAdmin.refreshConditionalLogicBuilder === 'function') {
                var $clRoot = $('#fb-fields-settings-' + fieldId).find('.fb-cl-root').first();
                if ($clRoot.length) {
                    formAdmin.refreshConditionalLogicBuilder($clRoot);
                }
            }

            const editor = singleField.querySelector('.wp-editor-area');
            if (editor) {
                wysiwyg.init(editor, {setupCallback: formBuilder.setupTinyMceEventHandlers});
            }
        },

        setFormLabelPosition: function(e) {
            var labelPosition = $(this).val();

            // Click each field container in the builder preview
            // This triggers the relevant options in the Edit panel to be available in the DOM
            $editorFieldsWrap.find('li.fb-editor-field-box.ui-state-default').each( function() {
                $(this).trigger('click');
            });
            
            // Return to the Design tab
            $('#fb-design-tab').trigger('click');
            
            // Change the selected option for Label Position in Edit tab
            $('select[name^="field_options[label_position"]').each( function() {
                $(this).val(labelPosition).trigger('change');
            });
        },

        setFormLabelAlignment: function(e) {
            var labelAlignment = $(this).val();

            // Click each field container in the builder preview
            // This triggers the relevant options in the Edit panel to be available in the DOM
            $editorFieldsWrap.find('li.fb-editor-field-box.ui-state-default').each( function() {
                $(this).trigger('click');
            });
            
            // Return to the Design tab
            $('#fb-design-tab').trigger('click');
            
            // Change the selected option for Label Alignment in Edit tab
            $('select[name^="field_options[label_alignment"]').each( function() {
                $(this).val(labelAlignment).trigger('change');
            });
        },
        
        setRequiredFieldIndicator: function(e) {
            var requiredFieldIndicator = $(this).val();

            // Click each field container in the builder preview
            // This triggers the relevant options in the Edit panel to be available in the DOM
            $editorFieldsWrap.find('li.fb-editor-field-box.ui-state-default').each( function() {
                $(this).trigger('click');
            });
            
            // Return to the Design tab
            $('#fb-design-tab').trigger('click');
            
            // Change the value for Required Field Indicator in Edit tab
            $('input[name^="field_options[required_indicator_"').each( function() {
                $(this).val(requiredFieldIndicator).trigger('keyup');
            });

        },

        clickDeleteField: function () {
            if (confirm("Are you sure?")) {
                formBuilder.deleteFields($(this).attr('data-deletefield'));
            }
            return false;
        },

        deleteFields: function (fieldId) {
            formBuilder.deleteField(fieldId);
        },

        deleteField: function (fieldId) {
            jQuery.ajax({
                type: 'POST',
                url: ajaxurl,
                data: {
                    action: 'formbuilder_delete_field',
                    field_id: fieldId,
                    nonce: formbuilder_backend_js.nonce
                },
                success: function () {
                    var $thisField = $('#fb-editor-field-id-' + fieldId),
                        settings = $('#fb-fields-settings-' + fieldId);

                    // Remove settings from sidebar.
                    if (settings.is(':visible')) {
                        document.getElementById('fb-add-fields-tab').click();
                    }
                    settings.remove();

                    $thisField.fadeOut('fast', function () {
                        var $adjacentFields = $thisField.siblings('li.fb-editor-form-field'),
                            $liWrapper;

                        if (!$adjacentFields.length) {
                            $liWrapper = $thisField.closest('ul.fb-editor-sorting').parent();
                        }

                        $thisField.remove();
                        if ($adjacentFields.length) {
                            formBuilder.syncLayoutClasses($adjacentFields.first());
                        } else {
                            $liWrapper.remove();
                        }

                        formBuilder.syncEditorHasFieldsState();
                        formBuilder.syncStepTitleInputs();
                    });
                }
            });
        },

        addFieldClick: function () {
            /*jshint validthis:true */
            const $thisObj = $(this);
            // there is no real way to disable a <a> (with a valid href attribute) in HTML - https://css-tricks.com/how-to-disable-links/
            if ($thisObj.hasClass('disabled')) {
                return false;
            }

            $thisObj.parent('.fb-field-box').addClass('fb-added-field');

            const $button = $thisObj.closest('.fb-field-box');
            const fieldType = $button.attr('id');

            var formId = document.getElementById('fb-form-id').value;
            jQuery.ajax({
                type: 'POST',
                url: ajaxurl,
                data: {
                    action: 'formbuilder_insert_field',
                    form_id: formId,
                    field_type: fieldType,
                    nonce: formbuilder_backend_js.nonce,
                },
                success: function (msg) {
                    const replaceWith = formBuilder.wrapFieldLi(msg);
                    var fieldID = replaceWith[0].childNodes[0].childNodes[0].dataset.fid; // e.g. 121
                    var fieldType = replaceWith[0].childNodes[0].childNodes[0].dataset.type; // e.g. checkbox
                    $editorFieldsWrap.append(replaceWith);
                    formBuilder.syncEditorHasFieldsState();
                    $formLabelPosition.trigger('change');
                    $formLabelAlignment.trigger('change');
                    $('#fb-add-fields-tab').trigger('click');
                    $('.formbuilder-ajax-udpate-button').trigger('click');
                    formBuilder.afterAddField(msg, true);

                    if (fieldType == 'select'
                        || fieldType == 'radio'
                        || fieldType == 'checkbox'
                        || fieldType == 'image_select'
                    ) {
                       formBuilder .setupFieldOptionSorting($('#fb-field-options-' + fieldID));
                    }

                    if (fieldType == 'likert_matrix_scale'
                        || fieldType == 'matrix_of_dropdowns'                    
                    ) {
                       formBuilder .setupFieldOptionSorting($('#fb-field-options-' + fieldID + '-rows'));
                       formBuilder .setupFieldOptionSorting($('#fb-field-options-' + fieldID + '-columns'));
                    }

                    if (fieldType == 'matrix_of_dropdowns') {
                       formBuilder .setupFieldOptionSorting($('#fb-field-options-' + fieldID + '-dropdowns'));
                    }

                    if (fieldType == 'matrix_of_variable_dropdowns_two'
                        || fieldType == 'matrix_of_variable_dropdowns_three'
                        || fieldType == 'matrix_of_variable_dropdowns_four'
                        || fieldType == 'matrix_of_variable_dropdowns_five'                    ) {
                       formBuilder .setupFieldOptionSorting($('#fb-field-options-' + fieldID + '-rows'));
                    }

                    if (fieldType == 'matrix_of_variable_dropdowns_two'
                        || fieldType == 'matrix_of_variable_dropdowns_three'
                        || fieldType == 'matrix_of_variable_dropdowns_four'
                        || fieldType == 'matrix_of_variable_dropdowns_five'
                    ) {
                       formBuilder .setupFieldOptionSorting($('#fb-field-options-' + fieldID + '-first_dropdown'));
                       formBuilder .setupFieldOptionSorting($('#fb-field-options-' + fieldID + '-second_dropdown'));
                    }

                    if (fieldType == 'matrix_of_variable_dropdowns_three'
                        || fieldType == 'matrix_of_variable_dropdowns_four'
                        || fieldType == 'matrix_of_variable_dropdowns_five'
                    ) {
                       formBuilder .setupFieldOptionSorting($('#fb-field-options-' + fieldID + '-third_dropdown'));
                    }

                    if (fieldType == 'matrix_of_variable_dropdowns_four'
                        || fieldType == 'matrix_of_variable_dropdowns_five'
                    ) {
                       formBuilder .setupFieldOptionSorting($('#fb-field-options-' + fieldID + '-fourth_dropdown'));
                    }

                    if (fieldType == 'matrix_of_variable_dropdowns_five') {
                       formBuilder .setupFieldOptionSorting($('#fb-field-options-' + fieldID + '-fifth_dropdown'));
                    }
                                        
                    replaceWith.each(
                        function () {
                            formBuilder.makeDroppable(this.querySelector('ul.fb-editor-sorting'));
                            formBuilder.makeDraggable(this.querySelector('.fb-editor-form-field'), '.fb-editor-move-action');
                        }
                    );
                    formBuilder.maybeFixRangeSlider();
                    setTimeout(function () {
                        $(document).find('.fb-color-picker').not('.fb-progress-base-color').wpColorPicker();
                    }, 1000);
                },
                error: formBuilder.handleInsertFieldError
            });
            return false;
        },

        setupFieldOptionSorting: function (sort) {
            var opts = {
                items: 'li',
                axis: 'y',
                opacity: 0.65,
                forcePlaceholderSize: false,
                handle: '.fb-drag',
                helper: function (e, li) {
                    if (li.find('input[type="radio"]:checked, input[type="checkbox"]:checked').length > 0) {
                        isCheckedField = true;
                    }
                    return li.clone();
                },
                stop: function (e, ui) {
                    var fieldId = ui.item.attr('id').replace('fb-option-list-', '').replace('-' + ui.item.data('optkey'), '');
                    var optionsId = ui.item.closest('.fb-option-list').attr('data-options-id');
                    var fieldType = ui.item.closest('.fb-option-list').attr('data-field-type');
                    var fieldKey = ui.item.closest('.fb-option-list').attr('data-key');
                    formAdmin.resetDisplayedOpts(fieldId,optionsId,fieldType,fieldKey);
                }
            };
            $(sort).sortable(opts);
        },

        stopFieldFocus: function (e) {
            e.preventDefault();
        },

        deselectFields: function (preventFieldGroups) {
            $('li.ui-state-default.selected').removeClass('selected');
            if (!preventFieldGroups) {
                formBuilder.unselectFieldGroups();
            }
        },

        moveFieldSettings: function (singleField) {
            if (singleField === null)
                return;
            var classes = singleField.parentElement.classList;
            if (classes.contains('fb-editor-field-box') || classes.contains('divider_section_only')) {
                var endMarker = document.getElementById('fb-end-form-marker');
                buildForm.insertBefore(singleField, endMarker);
            }
        },

        debounce: function (func, wait = 100) {
            let timeout;
            return function (...args) {
                clearTimeout(timeout);
                timeout = setTimeout(
                    () => func.apply(this, args),
                    wait
                );
            };
        },

        infoModal: function (msg) {
            var $info = formBuilder.initModal('#formbuilder_info_modal', '400px');
            if ($info === false) {
                return false;
            }
            $('.fb-info-msg').html(msg);
            $info.dialog('open');
            return false;
        },

        handleFieldDrop: function (_, ui) {
            const draggable = ui.draggable[0];
            const placeholder = document.getElementById('fb-placeholder');

            if (!placeholder) {
                ui.helper.remove();
                formBuilder.syncAfterDragAndDrop();
                return;
            }
            const $previousFieldContainer = ui.helper.parent();

            if (draggable.classList.contains('fb-added-field')) {
                formBuilder.insertNewFieldByDragging(draggable.id);
            } else {
                formBuilder.moveFieldThatAlreadyExists(draggable, placeholder);
            }

            placeholder.remove();
            ui.helper.remove();

            const $previousContainerFields = $previousFieldContainer.length ? formBuilder.getFieldsInRow($previousFieldContainer) : [];
            formBuilder.maybeUpdatePreviousFieldContainerAfterDrop($previousFieldContainer, $previousContainerFields);
            formBuilder.maybeUpdateDraggableClassAfterDrop(draggable, $previousContainerFields);

            formBuilder.syncAfterDragAndDrop();
        },

        syncAfterDragAndDrop: function () {
            formBuilder.normalizeEditorFieldRows();
            formBuilder.maybeDeleteEmptyFieldGroups();
            formBuilder.updateFieldOrder();

            const event = new Event('formbuilder_sync_after_drag_and_drop', {bubbles: false});
            document.dispatchEvent(event);
            formBuilder.maybeFixRangeSlider();
            formBuilder.ensureAllSectionMarkerLayouts();
            formBuilder.syncEditorHasFieldsState();
            setTimeout(function () {
                $(document).find('.fb-color-picker').not('.fb-progress-base-color').wpColorPicker();
            }, 1000)
        },

        fixUnwrappedListItems: function () {
            const lists = document.querySelectorAll('ul#fb-editor-fields');
            lists.forEach(
                list => {
                    list.childNodes.forEach(
                        child => {
                            if ('undefined' === typeof child.classList) {
                                return;
                            }

                            if ('undefined' !== typeof child.classList && child.classList.contains('fb-editor-form-field')) {
                                formBuilder.wrapFieldLiInPlace(child);
                            }
                        }
                    );
                }
            );
        },

        maybeDeleteEmptyFieldGroups: function () {
            document.querySelectorAll('li.fb-editor-field-box:not(.fb-editor-form-field)').forEach(
                function (fieldGroup) {
                    const rowList = formBuilder.getDirectRowList(fieldGroup);

                    if (rowList && !rowList.children.length) {
                        fieldGroup.remove();
                    }
                }
            );
        },

        updateFieldOrder: function () {
            var fields, fieldId, field, currentOrder, newOrder, i, singleField;
            const root = formBuilder.getEditorFieldsRoot();

            if (!root) {
                return;
            }

            fields = root.querySelectorAll('li.fb-editor-form-field[data-fid]');

            for (i = 0; i < fields.length; i++) {
                fieldId = fields[i].getAttribute('data-fid');
                field = $('input[name="field_options[field_order_' + fieldId + ']"]');
                currentOrder = field.val();
                newOrder = i + 1;

                if (currentOrder != newOrder) {
                    field.val(newOrder);
                    singleField = document.getElementById('fb-fields-settings-' + fieldId);
                    formBuilder.moveFieldSettings(singleField);
                    // formBuilder.fieldUpdated();
                }
            }

            formBuilder.syncStepTitleInputs();
        },

        setupTinyMceEventHandlers: function (editor) {
            editor.on('Change', function () {
                formBuilder.handleTinyMceChange(editor);
            });
        },

        handleTinyMceChange: function (editor) {
            if (!formBuilder.isTinyMceActive() || tinyMCE.activeEditor.isHidden()) {
                return;
            }

            editor.targetElm.value = editor.getContent();
            $(editor.targetElm).trigger('change');
        },

        isTinyMceActive: function () {
            var activeSettings, wrapper;

            activeSettings = document.querySelector('.fb-fields-settings:not(.fb-hidden)');
            if (!activeSettings) {
                return false;
            }

            wrapper = activeSettings.querySelector('.wp-editor-wrap');
            return null !== wrapper && wrapper.classList.contains('tmce-active');
        },

        // fieldUpdated: function () {
        //     if (!fieldsUpdated) {
        //         fieldsUpdated = 1;
        //         window.addEventListener('beforeunload', formBuilder.confirmExit);
        //     }
        // },

        // confirmExit: function (event) {
        //     if (fieldsUpdated) {
        //         event.preventDefault();
        //         event.returnValue = '';
        //     }
        // },

        maybeFixRangeSlider: function () {
            setTimeout(() => {
                $(document).find('.formbuilder-range-input-selector').each(function () {
                    var newSlider = $(this);
                    var sliderValue = newSlider.val();
                    var sliderMinValue = parseFloat(newSlider.attr('min'));
                    var sliderMaxValue = parseFloat(newSlider.attr('max'));
                    var sliderStepValue = parseFloat(newSlider.attr('step'));
                    newSlider.prev('.formbuilder-range-slider').slider({
                        value: sliderValue,
                        min: sliderMinValue,
                        max: sliderMaxValue,
                        step: sliderStepValue,
                        range: 'min',
                        slide: function (e, ui) {
                            $(this).next().val(ui.value);
                        }
                    });
                })
            }, 1000);
        },

        wrapFieldLiInPlace: function (li) {
            const ul = formBuilder.tag('ul', {
                className: 'fb-editor-grid-container fb-editor-sorting'
            });
            const wrapper = formBuilder.tag('li', {
                className: 'fb-editor-field-box',
                child: ul
            });

            li.replaceWith(wrapper);
            ul.appendChild(li);

            formBuilder.makeDroppable(ul);
            formBuilder.makeDraggable(wrapper, '.fb-editor-move-action');
        },

        maybeUpdatePreviousFieldContainerAfterDrop: function ($previousFieldContainer, $previousContainerFields) {
            if (!$previousFieldContainer.length) {
                return;
            }

            if ($previousContainerFields.length) {
                formBuilder.syncLayoutClasses($previousContainerFields.first());
            } else {
                formBuilder.maybeDeleteAnEmptyFieldGroup($previousFieldContainer.get(0));
            }
        },

        maybeUpdateDraggableClassAfterDrop: function (draggable, $previousContainerFields) {
            if (0 !== $previousContainerFields.length || 1 !== formBuilder.getFieldsInRow($(draggable.parentNode)).length) {
                formBuilder.syncLayoutClasses($(draggable));
            }
        },

        maybeDeleteAnEmptyFieldGroup: function (previousFieldContainer) {
            const closestFieldBox = formBuilder.getRowWrapperFromList(previousFieldContainer);
            const rowList = closestFieldBox ? formBuilder.getDirectRowList(closestFieldBox) : null;

            if (closestFieldBox && rowList && !rowList.children.length) {
                closestFieldBox.remove();
            }
        },

        determineIndexBasedOffOfMousePositionInList: function ($list, y) {
            const $items = $list.children();
            const length = $items.length;
            let index, item, itemTop, returnIndex;
            returnIndex = 0;
            for (index = length - 1; index >= 0; --index) {
                item = $items.get(index);
                itemTop = $(item).offset().top;
                if (y > itemTop) {
                    returnIndex = index;
                    if (y > itemTop + ($(item).outerHeight() / 2)) {
                        returnIndex = index + 1;
                    }
                    break;
                }
            }
            return returnIndex;
        },

        onDragOverDroppable: function (event, ui) {
            const droppable = event.target;
            const draggable = ui.draggable[0];
            if (!formBuilder.allowDrop(draggable, droppable)) {
                droppable.classList.remove('fb-dropabble');
                $(droppable).parents('ul.fb-editor-sorting').addClass('fb-dropabble');
                return;
            }
            document.querySelectorAll('.fb-dropabble').forEach(droppable => droppable.classList.remove('fb-dropabble'));
            droppable.classList.add('fb-dropabble');
            $(droppable).parents('ul.fb-editor-sorting').addClass('fb-dropabble');
        },

        onDraggableLeavesDroppable: function (event) {
            const droppable = event.target;
            droppable.classList.remove('fb-dropabble');
        },

        syncLayoutClasses: function ($item, type) {
            var $fields, size, layoutClasses, classToAddFunction;
            if ('undefined' === typeof type) {
                type = 'even';
            }
            $fields = $item.parent().children('li.fb-editor-form-field, li.fb-field-loading')
                .not('.fb-editor-field-type-section_start')
                .not('.fb-editor-field-type-section_end')
                .not('.fb-editor-field-type-page_break');
            size = $fields.length;
            layoutClasses = formBuilder.getLayoutClasses();

            if ('even' === type && 5 !== size) {
                $fields.each(formBuilder.getSyncLayoutClass(layoutClasses, formBuilder.getEvenClassForSize(size)));
            } else if ('clear' === type) {
                $fields.each(formBuilder.getSyncLayoutClass(layoutClasses, ''));
            } else {
                if (-1 !== ['left', 'right', 'middle', 'even'].indexOf(type)) {
                    classToAddFunction = function (index) {
                        return formBuilder.getClassForBlock(size, type, index);
                    };
                } else {
                    classToAddFunction = function (index) {
                        var size = type[index];
                        return formBuilder.getLayoutClassForSize(size);
                    };
                }
                $fields.each(formBuilder.getSyncLayoutClass(layoutClasses, classToAddFunction));
            }

            $item.parent().children('.fb-editor-field-type-section_start, .fb-editor-field-type-section_end, .fb-editor-field-type-page_break').each(
                function () {
                    formBuilder.ensureSectionMarkerLayout(this);
                }
            );
        },

        getSyncLayoutClass: function (layoutClasses, classToAdd) {
            return function (itemIndex) {
                var currentClassToAdd, length, layoutClassIndex, currentClass, activeLayoutClass, fieldId, layoutClassesInput;
                currentClassToAdd = 'function' === typeof classToAdd ? classToAdd(itemIndex) : classToAdd;
                length = layoutClasses.length;
                activeLayoutClass = false;
                for (layoutClassIndex = 0; layoutClassIndex < length; ++layoutClassIndex) {
                    currentClass = layoutClasses[layoutClassIndex];
                    if (this.classList.contains(currentClass)) {
                        activeLayoutClass = currentClass;
                        break;
                    }
                }

                fieldId = this.dataset.fid;
                if ('undefined' === typeof fieldId) {
                    // we are syncing the drag/drop placeholder before the actual field has loaded.
                    // this will get called again afterward and the input will exist then.
                    this.classList.add(currentClassToAdd);
                    return;
                }

                formBuilder.moveFieldSettings(document.getElementById('fb-fields-settings-' + fieldId));
                var gridClassInput = document.getElementById('fb-grid-class-' + fieldId);

                if (null === gridClassInput) {
                    // not every field type has a layout class input.
                    return;
                }

                gridClassInput.value = currentClassToAdd;
                formBuilder.changeFieldClass(document.getElementById('fb-editor-field-id-' + fieldId), currentClassToAdd);
            };
        },

        getLayoutClasses: function () {
            return ['fb-grid-1', 'fb-grid-2', 'fb-grid-3', 'fb-grid-4', 'fb-grid-5', 'fb-grid-6', 'fb-grid-7', 'fb-grid-8', 'fb-grid-9', 'fb-grid-10', 'fb-grid-11', 'fb-grid-12'];
        },

        getFormIdForFieldPlacement: function () {
            return currentFormId;
        },

        insertNewFieldByDragging: function (fieldType) {
            const placeholder = document.getElementById('fb-placeholder');
            const loadingID = fieldType.replace('|', '-') + '_' + formBuilder.getAutoId();
            const loading = formBuilder.tag('li', {
                id: loadingID,
                className: 'fb-wait fb-field-loading'
            });
            const $placeholder = $(loading);
            const formId = formBuilder.getFormIdForFieldPlacement();
            placeholder.parentNode.insertBefore(loading, placeholder);
            placeholder.remove();
            formBuilder.syncLayoutClasses($placeholder);
            jQuery.ajax({
                type: 'POST', url: ajaxurl,
                data: {
                    action: 'formbuilder_insert_field',
                    form_id: formId,
                    field_type: fieldType,
                    nonce: formbuilder_backend_js.nonce,
                },
                success: function (msg) {
                    let replaceWith;
                    const $siblings = $placeholder.siblings('li.fb-editor-form-field');
                    if (!$siblings.length) {
                        replaceWith = formBuilder.wrapFieldLi(msg);
                    } else {
                        replaceWith = formBuilder.msgAsObject(msg);
                        if (!$placeholder.get(0).parentNode.parentNode.classList.contains('ui-draggable')) {
                            formBuilder.makeDraggable($placeholder.get(0).parentNode.parentNode, '.fb-editor-move-action');
                        }
                    }
                    $placeholder.replaceWith(replaceWith);
                    formBuilder.updateFieldOrder();
                    formBuilder.afterAddField(msg, false);
                    if ($siblings.length) {
                        formBuilder.syncLayoutClasses($siblings.first());
                    }
                    if (!$siblings.length) {
                        formBuilder.makeDroppable(replaceWith.get(0).querySelector('ul.fb-editor-sorting'));
                        formBuilder.makeDraggable(replaceWith.get(0).querySelector('li.fb-editor-form-field'), '.fb-editor-move-action');
                    } else {
                        formBuilder.makeDraggable(replaceWith.get(0), '.fb-editor-move-action');
                    }

                    formBuilder.syncEditorHasFieldsState();
                },
                error: formBuilder.handleInsertFieldError
            });
        },

        moveFieldThatAlreadyExists: function (draggable, placeholder) {
            placeholder.parentNode.insertBefore(draggable, placeholder);
        },

        msgAsObject: function (msg) {
            const element = formBuilder.div();
            element.innerHTML = msg;
            return $(element.innerHTML);
        },

        handleInsertFieldError: function (jqXHR, _, errorThrown) {
            formBuilder.maybeShowInsertFieldError(errorThrown, jqXHR);
        },

        maybeShowInsertFieldError: function (errorThrown, jqXHR) {
            if (!jqXHRAborted(jqXHR)) {
                formBuilder.infoModal(errorThrown + '. Please try again.');
            }
        },

        jqXHRAborted: function (jqXHR) {
            return jqXHR.status === 0 || jqXHR.readyState === 0;
        },

        getAutoId: function () {
            return ++autoId;
        },

        maybeRemoveHoverTargetOnMouseMove: function (event) {
            var elementFromPoint = document.elementFromPoint(event.clientX, event.clientY);
            if (null !== elementFromPoint && null !== elementFromPoint.closest('#fb-editor-fields')) {
                return;
            }
            formBuilder.maybeRemoveGroupHoverTarget();
        },

        wrapFieldLi: function (field) {
            const wrapper = formBuilder.div();
            if ('string' === typeof field) {
                wrapper.innerHTML = field;
            } else {
                wrapper.appendChild(field);
            }

            let result = $();
            Array.from(wrapper.children).forEach(
                li => {
                    result = result.add(
                        $('<li>')
                            .addClass('fb-editor-field-box')
                            .html($('<ul>').addClass('fb-editor-grid-container fb-editor-sorting').append(li))
                    );
                }
            );
            return result;
        },

        afterAddField: function (msg, addFocus) {
            var regex = /id="(\S+)"/,
                match = regex.exec(msg),
                field = document.getElementById(match[1]); // match[1] e.g. fb-editor-field-id-123
            var type = field.getAttribute('data-type');

            $(field).addClass('fb-newly-added');
            setTimeout(function () {
                field.classList.remove('fb-newly-added');
            }, 1000);

            if (addFocus) {
                var bounding = field.getBoundingClientRect(),
                    container = document.getElementById('fb-form-panel'),
                    inView = (bounding.top >= 0 &&
                        bounding.left >= 0 &&
                        bounding.right <= (window.innerWidth || document.documentElement.clientWidth) &&
                        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)
                    );

                if (!inView) {
                    container.scroll({
                        top: container.scrollHeight,
                        left: 0,
                        behavior: 'smooth'
                    });
                }
            }

            formBuilder.deselectFields();

            if (formBuilder.isSectionMarkerField(field)) {
                formBuilder.ensureSectionMarkerLayout(field);
            }

            formBuilder.syncStepTitleInputs();

            const addedEvent = new Event('formbuilder_added_field', {bubbles: false});
            addedEvent.hfField = field;
            addedEvent.hfSection = '';
            addedEvent.hfType = type;
            addedEvent.hfToggles = false;
            document.dispatchEvent(addedEvent);
        },

        getClassForBlock: function (size, type, index) {
            if ('even' === type) {
                return formBuilder.getEvenClassForSize(size, index);
            } else if ('middle' === type) {
                if (3 === size) {
                    return 1 === index ? 'fb-grid-6' : 'fb-grid-3';
                }
                if (5 === size) {
                    return 2 === index ? 'fb-grid-4' : 'fb-grid-2';
                }
            } else if ('left' === type) {
                return 0 === index ? formBuilder.getLargeClassForSize(size) : formBuilder.getSmallClassForSize(size);
            } else if ('right' === type) {
                return index === size - 1 ? formBuilder.getLargeClassForSize(size) : formBuilder.getSmallClassForSize(size);
            }
            return 'fb-grid-12';
        },

        getEvenClassForSize: function (size, index) {
            if (-1 !== [2, 3, 4, 6].indexOf(size)) {
                return formBuilder.getLayoutClassForSize(12 / size);
            }
            if (5 === size && 'undefined' !== typeof index) {
                return 0 === index ? 'fb-grid-4' : 'fb-grid-2';
            }
            return 'fb-grid-12';
        },

        getSmallClassForSize: function (size) {
            switch (size) {
                case 2:
                case 3:
                    return 'fb-grid-3';
                case 4:
                    return 'fb-grid-2';
                case 5:
                    return 'fb-grid-2';
                case 6:
                    return 'fb-grid-1';
            }
            return 'fb-grid-12';
        },

        getLargeClassForSize: function (size) {
            switch (size) {
                case 2:
                    return 'fb-grid-9';
                case 3:
                case 4:
                    return 'fb-grid-6';
                case 5:
                    return 'fb-grid-4';
                case 6:
                    return 'fb-grid-7';
            }
            return 'fb-grid-12';
        },

        getLayoutClassForSize: function (size) {
            return 'fb-grid-' + size;
        },

        resetOptionTextDetails: function () {
            $('.fb-fields-settings ul input[type="text"][name^="field_options[options_"]').filter('[data-value-on-load]').removeAttr('data-value-on-load');
            $('input[type="hidden"][name^=optionmap]').remove();
        },

        addBlankSelectOption: function (field, placeholder) {
            var opt = document.createElement('option'),
                firstChild = field.firstChild;

            opt.value = '';
            opt.innerHTML = placeholder;
            if (firstChild !== null) {
                field.insertBefore(opt, firstChild);
                field.selectedIndex = 0;
            } else {
                field.appendChild(opt);
            }
        },

        getImageLabel: function (label, showLabelWithImage, imageUrl, fieldType) {
            var imageLabelClass, fullLabel,
                originalLabel = label;

            fullLabel = '<div class="fb-field-is-image">';
            fullLabel += '<span class="fb-field-is-checked"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8z"/></svg></span>';
            if (imageUrl) {
                fullLabel += '<img src="' + imageUrl + '" alt="' + originalLabel + '" />';
            }
            fullLabel += '</div>';
            fullLabel += '<div class="fb-field-is-label">' + originalLabel + '</div>';

            imageLabelClass = showLabelWithImage ? ' fb-field-is-has-label' : '';

            return ('<div class="fb-field-is-container' + imageLabelClass + '">' + fullLabel + '</div>');
        },

        getImageUrlFromInput: function (optVal) {
            var img, wrapper = $(optVal).closest('li').find('.fb-is-image-preview');

            if (!wrapper.length) {
                return '';
            }

            img = wrapper.find('img');
            if (!img.length) {
                return '';
            }

            return img.attr('src');
        },

        getChecked: function (id) {
            var field = $('.' + id);

            if (field.length === 0) {
                return false;
            }

            var checkbox = field.siblings('.fb-choice-input');
            return checkbox.length && checkbox.prop('checked');
        },

        changeFieldClass: function (field, setting) {
            var classes = field.className.split(' ');
            var filteredClasses = classes.filter(function (value, index, arr) {
                return value.indexOf('fb-grid-');
            });
            filteredClasses.push(setting);
            field.className = filteredClasses.join(' ');
        },

        removeWPUnload: function () {
            window.onbeforeunload = null;
            var w = $(window);
            w.off('beforeunload.widgets');
            w.off('beforeunload.edit-post');
        },

        maybeAddSaveAndDragIcons: function (fieldId) {
            var fieldOptions = document.querySelectorAll(`[id^=fb-option-list-${fieldId}-]`);

            if (fieldOptions.length < 2) {
                return;
            }

            let options = [...fieldOptions].slice(1);
            options.forEach((li, _key) => {
                if (li.classList.contains('formbuilder_other_option')) {
                    return;
                }
            });
        }
    }

    $(function () {
        formBuilder.init();
    });

    $(document).ready( function() {
        // $('.fields-list-accordion .accordion__control').trigger('click');
        // $('.fields-list-accordion.identity-fields .accordion__control').trigger('click');
    });

})(jQuery);
