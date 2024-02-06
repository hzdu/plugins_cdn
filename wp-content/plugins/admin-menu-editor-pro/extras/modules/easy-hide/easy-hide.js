/// <reference path="../../../js/common.d.ts" />
/// <reference path="../../../js/knockout.d.ts" />
/// <reference path="../../../modules/actor-selector/actor-selector.ts" />
/// <reference types="@types/lodash" />
/// <reference path="../../../js/lazyload.d.ts" />
/// <reference path="../../../vendor/yahnis-elsts/ajax-wrapper/ajax-action-wrapper.d.ts" />
/// <reference path="./eh-preferences.d.ts" />
'use strict';
let ameEasyHideModel = null;
var AmeEasyHide;
(function (AmeEasyHide) {
    const _ = wsAmeLodash;
    let SortOrder;
    (function (SortOrder) {
        SortOrder[SortOrder["SORT_ALPHA"] = 0] = "SORT_ALPHA";
        SortOrder[SortOrder["SORT_INSERTION"] = 1] = "SORT_INSERTION";
    })(SortOrder || (SortOrder = {}));
    class Category {
        constructor(id, label, parent = null, invertItemState = false, filterState = null, initialSortOrder = SortOrder.SORT_ALPHA, itemSortOrder = SortOrder.SORT_INSERTION, priority = Category.DEFAULT_PRIORITY, subtitle = null, tooltip = null) {
            this.id = id;
            this.label = label;
            this.parent = parent;
            this.invertItemState = invertItemState;
            this.initialSortOrder = initialSortOrder;
            this.itemSortOrder = itemSortOrder;
            this.priority = priority;
            this.subtitle = subtitle;
            this.tooltip = tooltip;
            this.containsSelectedCategory = ko.observable(false);
            this.isStandardRenderingEnabled = ko.observable(true);
            this.tableViewEnabled = false;
            this.tableView = null;
            this.cachedParentList = null;
            Category.counter++;
            this.safeElementId = 'ame-eh-category-n-' + Category.counter;
            this.isSelected = ko.observable(false);
            /**
             * Is this category selected or inside a selected category?
             */
            this.isInSelectedCategory = ko.pureComputed(() => {
                let current = this;
                while (current !== null) {
                    if (current.isSelected()) {
                        return true;
                    }
                    current = current.parent;
                }
                return false;
            });
            this.isShowingItems = ko.pureComputed(() => {
                //The items are visible if this category or one of its parents is selected.
                return this.isInSelectedCategory();
            });
            this.isExpanded = ko.observable(this.parent === null);
            this.isVisible = ko.pureComputed(() => {
                const inSelectedTree = this.isInSelectedCategory() || this.containsSelectedCategory();
                if (!inSelectedTree) {
                    return false;
                }
                //Show the category if it has any visible children: items or subcategories.
                const items = this.directItems();
                if (_.some(items, item => item.isVisible())) {
                    return true;
                }
                const subcategories = this.subcategories();
                return _.some(subcategories, category => category.isVisible());
            });
            this.subcategories = ko.observableArray([]);
            this.sortedSubcategories = ko.pureComputed(() => {
                let cats = this.subcategories();
                //Remove categories that won't be rendered.
                cats = cats.filter(c => c.isStandardRenderingEnabled());
                if (this.initialSortOrder === SortOrder.SORT_ALPHA) {
                    cats.sort(function (a, b) {
                        if (a.priority !== b.priority) {
                            return a.priority - b.priority;
                        }
                        return a.label.localeCompare(b.label);
                    });
                }
                else if (this.initialSortOrder === SortOrder.SORT_INSERTION) {
                    //We want a stable sort that preserves insertion order for
                    //categories that have the same priority. As of this writing,
                    //Array.sort() is not stable in IE, so let's use Lodash.
                    cats = _.sortBy(cats, 'priority');
                }
                return cats;
            });
            this.items = ko.observableArray([]);
            this.directItems = ko.pureComputed(() => {
                let results = _(this.items())
                    .filter((item) => {
                    //An item is a direct/root level item in this category
                    //only if it has no parent or if its parent is not
                    //in the same category.
                    if (item.parent === null) {
                        return true;
                    }
                    else {
                        return !_.includes(item.parent.categories, this);
                    }
                })
                    .value();
                //Sort items alphabetically if requested.
                if (this.itemSortOrder === SortOrder.SORT_ALPHA) {
                    results.sort(function (a, b) {
                        return a.label.localeCompare(b.label);
                    });
                }
                return results;
            });
            this.isIndeterminate = ko.observable(false);
            //The whole category is checked if at least one of its
            //items or subcategories is checked.
            this.isChecked = ko.computed({
                read: () => {
                    let hasIndeterminateChildren = false;
                    let hasCheckedItems = false, hasUncheckedItems = false;
                    _.forEach(this.items(), function (item) {
                        if (item.isChecked()) {
                            hasCheckedItems = true;
                        }
                        else {
                            hasUncheckedItems = true;
                        }
                        if (item.isIndeterminate()) {
                            hasIndeterminateChildren = true;
                        }
                        if (hasCheckedItems && hasUncheckedItems) {
                            //We know the category has a mix of checked and
                            //unchecked items, so there's no need to continue.
                            return false;
                        }
                    });
                    let hasCheckedCats = false, hasUncheckedCats = false;
                    _.forEach(this.subcategories(), function (category) {
                        if (category.isChecked()) {
                            hasCheckedCats = true;
                        }
                        else {
                            hasUncheckedCats = true;
                        }
                        if (category.isIndeterminate()) {
                            hasIndeterminateChildren = true;
                        }
                        if (hasCheckedCats && hasUncheckedCats) {
                            return false;
                        }
                    });
                    const areAnyChecked = hasCheckedItems || hasCheckedCats;
                    const areAnyUnchecked = hasUncheckedItems || hasUncheckedCats;
                    this.isIndeterminate(hasIndeterminateChildren || (areAnyChecked && areAnyUnchecked));
                    return areAnyChecked;
                },
                write: (checked) => {
                    //Update items.
                    _.forEach(this.items(), function (item) {
                        if (item.isEditableForSelectedActor) {
                            item.isChecked(checked);
                        }
                    });
                    //Update subcategories.
                    _.forEach(this.subcategories(), function (category) {
                        category.isChecked(checked);
                    });
                },
                deferEvaluation: true
            }).extend({ rateLimit: { timeout: 20, method: 'notifyWhenChangesStop' } });
            this.nestingDepth = ko.pureComputed({
                read: () => {
                    if (this.parent !== null) {
                        return this.parent.nestingDepth() + 1;
                    }
                    return 1;
                },
                deferEvaluation: true
            });
            this.navCssClasses = ko.pureComputed({
                read: () => {
                    let classes = [];
                    if (this.isSelected()) {
                        //classes.push('ame-selected-cat-nav-item');
                    }
                    if (this.sortedSubcategories().length > 0) {
                        classes.push('ame-cat-nav-has-children');
                    }
                    if (this.isExpanded()) {
                        classes.push('ame-cat-nav-is-expanded');
                    }
                    if (this.isSelected()) {
                        classes.push('ame-selected-cat-nav-item');
                    }
                    classes.push('ame-cat-nav-level-' + this.nestingDepth());
                    return classes.join(' ');
                },
                deferEvaluation: true
            });
            this.isNavVisible = ko.pureComputed({
                read: () => {
                    if (this.parent === null) {
                        return true;
                    }
                    if (!this.isStandardRenderingEnabled()) {
                        return false;
                    }
                    return this.parent.isNavVisible() && this.parent.isExpanded();
                },
                deferEvaluation: true
            });
            //Category labels are not searched, but the table view has categories that
            //represent the same item being used on multiple screens. In that case,
            //category labels typically match item labels, so let's highlight them.
            this.highlightedLabel = ko.pureComputed(() => {
                let text = _.escape(this.label);
                if (filterState !== null) {
                    text = filterState.highlightSearchKeywords(text);
                }
                return text;
            });
            const wasRendered = ko.observable(false);
            this.shouldRenderContent = ko.computed({
                read: () => {
                    return wasRendered();
                },
                write: (state) => {
                    //This is a write-once flag. Once it's turned on,
                    //it can't be turned off again.
                    if (wasRendered()) {
                        return;
                    }
                    wasRendered(state);
                    //Notify that a category is being rendered. The DOM might not be
                    //updated yet when this event happens, so subscribers should wait
                    //at least until the next frame.
                    if (wasRendered()) {
                        jQuery(document).trigger('adminmenueditor:ehCategoryRendering', [this]);
                    }
                }
            });
        }
        toggle() {
            this.isExpanded(!this.isExpanded());
        }
        enableTableView(rowCat, columnCat) {
            this.tableViewEnabled = true;
            this.tableView = new CategoryTableView(rowCat, columnCat);
            //Disable normal rendering for the two row/column categories.
            //They will only appear in the table.
            rowCat.isStandardRenderingEnabled(false);
            columnCat.isStandardRenderingEnabled(false);
        }
        get allParents() {
            //The parent property is readonly, so the result should not change after
            //the category is initialized. We can cache it indefinitely.
            if (this.cachedParentList === null) {
                const parents = [];
                let current = this.parent;
                while (current !== null) {
                    parents.push(current);
                    current = current.parent;
                }
                //Reverse the list so that it starts at the root.
                parents.reverse();
                this.cachedParentList = parents;
            }
            return this.cachedParentList;
        }
        static fromProps(props, parent = null, filterState = null) {
            var _a, _b, _c, _d, _e, _f;
            return new Category(props.id, props.label, parent, (_a = props.invertItemState) !== null && _a !== void 0 ? _a : false, filterState, (_b = props.sort) !== null && _b !== void 0 ? _b : SortOrder.SORT_ALPHA, (_c = props.itemSort) !== null && _c !== void 0 ? _c : SortOrder.SORT_INSERTION, (_d = props.priority) !== null && _d !== void 0 ? _d : Category.DEFAULT_PRIORITY, (_e = props.subtitle) !== null && _e !== void 0 ? _e : null, (_f = props.tooltip) !== null && _f !== void 0 ? _f : null);
        }
    }
    Category.DEFAULT_PRIORITY = 10;
    Category.counter = 0;
    function isBinaryProps(props) {
        return ('binary' in props) ? props.binary : false;
    }
    class HideableItem {
        constructor(id, label, categories = [], parent = null, initialEnabled = {}, isInverted = false, component = null, tooltip = null, subtitle = null, selectedActorRef, allActorsRef, filterState) {
            this.id = id;
            this.label = label;
            this.categories = categories;
            this.parent = parent;
            this.initialEnabled = initialEnabled;
            this.isInverted = isInverted;
            this.component = component;
            this.tooltip = tooltip;
            this.subtitle = subtitle;
            this.selectedActorRef = selectedActorRef;
            this.children = [];
            this.actorSettings = new AmeObservableActorFeatureMap(initialEnabled);
            let _isIndeterminate = ko.observable(false);
            this.isIndeterminate = ko.pureComputed(() => {
                if (selectedActorRef() === null) {
                    return _isIndeterminate();
                }
                return false;
            });
            this.isChecked = this.createCheckedObservable(selectedActorRef, allActorsRef, _isIndeterminate);
            let wasRendered = false;
            this.shouldRender = ko.observable(false);
            this.isVisible = ko.computed(() => {
                let visible = filterState.itemMatchesFilter(this);
                if (visible && !wasRendered) {
                    wasRendered = true;
                    this.shouldRender(true);
                }
                return visible;
            });
            this.htmlLabel = ko.pureComputed(() => {
                let html = _.escape(this.label);
                if (this.isVisible()) {
                    html = filterState.highlightSearchKeywords(html);
                }
                return html;
            });
        }
        createCheckedObservable(selectedActorRef, allActorsRef, outIndeterminate) {
            return ko.computed({
                read: () => {
                    let enabled = this.actorSettings.isEnabledFor(selectedActorRef(), allActorsRef(), this.isInverted, this.isInverted, this.isInverted, outIndeterminate);
                    return this.isInverted ? (!enabled) : enabled;
                },
                write: (checked) => {
                    this.actorSettings.setEnabledFor(selectedActorRef(), this.isInverted ? !checked : checked, allActorsRef(), this.isInverted);
                    for (let i = 0; i < this.children.length; i++) {
                        this.children[i].isChecked(checked);
                    }
                },
                deferEvaluation: true
            });
        }
        static fromJs(props, selectedActor, allActors, filterState, categories = [], parent = null) {
            var _a, _b, _c, _d, _e;
            if (isBinaryProps(props)) {
                return BinaryHideableItem.fromJs(props, selectedActor, allActors, filterState, categories, parent);
            }
            return new HideableItem(props.id, props.label, categories, parent, (_a = props.enabled) !== null && _a !== void 0 ? _a : {}, (_b = props.inverted) !== null && _b !== void 0 ? _b : false, (_c = props.component) !== null && _c !== void 0 ? _c : null, (_d = props.tooltip) !== null && _d !== void 0 ? _d : null, (_e = props.subtitle) !== null && _e !== void 0 ? _e : null, selectedActor, allActors, filterState);
        }
        toJs() {
            let result = {};
            if (this.isInverted) {
                result.inverted = true;
            }
            if ((this.component !== null) && (this.component !== '')) {
                result.component = this.component;
            }
            let enabled = this.actorSettings.getAll();
            if (!_.isEmpty(enabled)) {
                result.enabled = enabled;
            }
            return result;
        }
        get isEditableForSelectedActor() {
            return true;
        }
    }
    class BinaryHideableItem extends HideableItem {
        constructor() {
            super(...arguments);
            this.isEnabledForAll = ko.observable(false);
        }
        createCheckedObservable(selectedActorRef, allActorsRef, outIndeterminate) {
            const observable = ko.computed({
                read: () => {
                    if (this.isInverted) {
                        return !this.isEnabledForAll();
                    }
                    else {
                        return this.isEnabledForAll();
                    }
                },
                write: (value) => {
                    if (this.isEditableForSelectedActor) {
                        if (this.isInverted) {
                            value = !value;
                        }
                        this.isEnabledForAll(value);
                    }
                    else {
                        //Reset the checkbox to the original value.
                        observable.notifySubscribers();
                    }
                },
                deferEvaluation: true,
            });
            return observable;
        }
        static fromJs(props, selectedActor, allActors, filterState, categories = [], parent = null) {
            var _a, _b, _c, _d;
            const instance = new BinaryHideableItem(props.id, props.label, categories, parent, {}, (_a = props.inverted) !== null && _a !== void 0 ? _a : false, (_b = props.component) !== null && _b !== void 0 ? _b : null, (_c = props.tooltip) !== null && _c !== void 0 ? _c : null, (_d = props.subtitle) !== null && _d !== void 0 ? _d : null, selectedActor, allActors, filterState);
            if (typeof props.enabledForAll !== 'undefined') {
                instance.isEnabledForAll(props.enabledForAll);
            }
            return instance;
        }
        toJs() {
            let result = super.toJs();
            delete result.enabled;
            result.enabledForAll = this.isEnabledForAll();
            return result;
        }
        get isEditableForSelectedActor() {
            return (this.selectedActorRef() === null);
        }
    }
    class CategoryTableView {
        constructor(rowCategory, columnCategory) {
            this.rowCategory = rowCategory;
            this.columnCategory = columnCategory;
            this.itemLookup = {};
            this.columnHeaders = null;
        }
        get rows() {
            return CategoryTableView.sortCategoriesByLabel(this.rowCategory.subcategories);
        }
        get columns() {
            return CategoryTableView.sortCategoriesByLabel(this.columnCategory.subcategories);
        }
        static sortCategoriesByLabel(categories) {
            let list = categories();
            list.sort(function (a, b) {
                return a.label.localeCompare(b.label);
            });
            return list;
        }
        getCellItems(row, column) {
            const path = [row.id, column.id];
            let items = _.get(this.itemLookup, path, null);
            if (items !== null) {
                return items;
            }
            //Find items that are present in both categories.
            items = _.intersection(row.directItems(), column.directItems());
            _.set(this.itemLookup, path, items);
            return items;
        }
        /**
         * Highlight the column heading when the user hovers over a table cell.
         *
         * @param unused Knockout provides the current model value to the callback, but we don't need it.
         * @param event JavaScript event object
         */
        onTableHover(unused, event) {
            if (!event || !event.target) {
                return;
            }
            const $cell = jQuery(event.target).closest('td, th');
            if ($cell.length < 1) {
                return;
            }
            if (
            //Has the header list been initialized?
            (this.columnHeaders === null)
                //The table might have been re-rendered or removed from the DOM.
                //In that case, we'll need to find the new header elements.
                || (this.columnHeaders.closest('body').length < 1)) {
                this.columnHeaders = $cell.closest('table').find('thead tr').first().find('th');
            }
            const index = $cell.index();
            //The first column doesn't have a header, so it doesn't need to be highlighted.
            if (index === 0) {
                return;
            }
            const $heading = this.columnHeaders.eq(index);
            if (!$heading || ($heading.length === 0)) {
                return;
            }
            const highlightClass = 'ame-eh-hovered-column';
            if ($heading.hasClass(highlightClass)) {
                return; //This column is already highlighted.
            }
            this.columnHeaders.removeClass(highlightClass);
            $heading.addClass(highlightClass);
        }
    }
    class FilterOptions {
        constructor() {
            /**
             * Bind this observable to the search box, then use searchQuery to actually
             * read the query. This is only public because it's used in a KO template.
             */
            this.internalSearchQuery = ko.observable('');
            this.searchQuery = ko.pureComputed(() => this.internalSearchQuery());
            this.searchQuery.extend({ rateLimit: { timeout: 100, method: "notifyWhenChangesStop" } });
            this.searchKeywords = ko.pureComputed(() => {
                let query = this.searchQuery().trim();
                if (query === '') {
                    return [];
                }
                return _(query.split(' '))
                    .map(keyword => keyword.trim())
                    .filter(keyword => (keyword !== ''))
                    .value();
            });
            this.highlightRegex = ko.pureComputed(() => {
                const keywordList = this.searchKeywords();
                if (keywordList.length < 1) {
                    return null;
                }
                let keywordGroup = _.map(keywordList, _.escapeRegExp).join('|');
                return new RegExp('(?:' + keywordGroup + ')', 'gi');
            });
        }
        itemMatchesFilter(item) {
            const keywords = this.searchKeywords();
            if (keywords.length > 0) {
                const haystack = item.label.toLowerCase();
                const matchesKeywords = _.every(keywords, keyword => (haystack.indexOf(keyword) >= 0));
                if (!matchesKeywords) {
                    return false;
                }
            }
            return true;
        }
        highlightSearchKeywords(input) {
            const regex = this.highlightRegex();
            if (regex === null) {
                return input;
            }
            return input.replace(regex, function (foundKeyword) {
                return '<mark class="ame-eh-search-highlight">' + foundKeyword + '</mark>';
            });
        }
        clearSearchBox() {
            this.internalSearchQuery('');
        }
        processEscKey(unusedKoModel, event) {
            //Ignore events triggered during IME composition.
            //See https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event#ignoring_keydown_during_ime_composition
            if (event.isComposing) {
                return true;
            }
            //noinspection JSDeprecatedSymbols
            const isEscape = (((typeof event['code'] !== 'undefined') && (event.code === 'Escape'))
                //IE doesn't support KeyboardEvent.code, so use keyCode instead.
                || ((typeof event['keyCode'] !== 'undefined') && (event.keyCode === 27)));
            if (isEscape) {
                this.clearSearchBox();
            }
            return true;
        }
    }
    class Model {
        constructor(settings, prefs) {
            var _a, _b;
            this.categoryLookup = {};
            this.settingsData = ko.observable('');
            this.isSaveButtonEnabled = ko.observable(true);
            this.preferences = prefs.observableObject(ko);
            prefs.enableAutoSave(3000);
            this.actorSelector = new AmeActorSelector(AmeActors, true);
            this.selectedActor = this.actorSelector.createActorObservable(ko);
            this.selectedActorId = ko.pureComputed(() => {
                const actor = this.selectedActor();
                if (actor === null) {
                    return '';
                }
                return actor.getId();
            });
            const allActors = ko.pureComputed(() => {
                return this.actorSelector.getVisibleActors();
            });
            //Reselect the previously selected actor.
            if (settings.selectedActor && AmeActors.actorExists(settings.selectedActor)) {
                this.selectedActor(AmeActors.getActor(settings.selectedActor));
            }
            this.filterState = new FilterOptions();
            const _ = wsAmeLodash;
            //Initialize categories.
            this.rootCategory = new Category('_root', 'All', null, false, this.filterState, SortOrder.SORT_ALPHA);
            this.rootCategory.shouldRenderContent(true);
            let catsWithTableView = [];
            _.forEach(settings.categories, (props) => {
                let parent = this.rootCategory;
                if (props.parent) {
                    parent = this.categoryLookup[props.parent];
                }
                const cat = Category.fromProps(props, parent, this.filterState);
                this.categoryLookup[cat.id] = cat;
                parent.subcategories.push(cat);
                if (props.tableView) {
                    catsWithTableView.push(props);
                }
            });
            //Initialize table views. This is a separate step because tables need
            //their row and column categories to be already created.
            _.forEach(catsWithTableView, (props) => {
                const cat = this.categoryLookup[props.id];
                cat.enableTableView(this.categoryLookup[props.tableView.rowCategory], this.categoryLookup[props.tableView.columnCategory]);
            });
            //Initialize items.
            const itemsById = {};
            _.forEach(settings.items, (props) => {
                let parent = null;
                if (props.parent && itemsById.hasOwnProperty(props.parent)) {
                    parent = itemsById[props.parent];
                }
                let categories = [];
                if (props.categories) {
                    _.forEach(props.categories, (id) => {
                        if (this.categoryLookup.hasOwnProperty(id)) {
                            categories.push(this.categoryLookup[id]);
                        }
                    });
                }
                if (categories.length < 1) {
                    categories.push(this.rootCategory);
                }
                if (_.some(categories, 'invertItemState') && (typeof props['inverted'] === 'undefined')) {
                    props.inverted = true;
                }
                const item = HideableItem.fromJs(props, this.selectedActor, allActors, this.filterState, categories, parent);
                itemsById[item.id] = item;
                if (parent) {
                    parent.children.push(item);
                }
                _.forEach(categories, function (category) {
                    category.items.push(item);
                });
            });
            this.itemContainerClasses = ko.pureComputed(() => {
                let classes = [];
                const columns = this.preferences.numberOfColumns();
                if (columns > 1) {
                    classes.push('ame-eh-item-columns-' + columns);
                }
                return classes.join(' ');
            });
            this.selectedCategory = ko.observable(this.rootCategory);
            //Update the "isSelected" and "containsSelectedCategory" flags
            //on the category object when the user selects a category.
            let previousSelectedCategory = this.selectedCategory.peek();
            if (previousSelectedCategory) {
                previousSelectedCategory.isSelected(true);
            }
            this.selectedCategory.subscribe((newSelection) => {
                if (newSelection !== previousSelectedCategory) {
                    //Save the old selection in case changing isSelected also triggers this callback somehow.
                    const oldSelection = previousSelectedCategory;
                    previousSelectedCategory = newSelection;
                    //The previous category is no longer selected.
                    oldSelection.isSelected(false);
                    const previousTree = oldSelection.allParents;
                    const newTree = newSelection.allParents;
                    //Find the point of divergence.
                    const minLength = Math.min(previousTree.length, newTree.length);
                    let divergenceIndex = -1;
                    for (let i = 0; i < minLength; i++) {
                        if (newTree[i] !== previousTree[i]) {
                            divergenceIndex = i;
                            break;
                        }
                    }
                    //Update categories that are no longer in the selected tree.
                    if (divergenceIndex >= 0) {
                        for (let i = divergenceIndex; i < previousTree.length; i++) {
                            previousTree[i].containsSelectedCategory(false);
                        }
                    }
                    //Update categories that contain the new selection.
                    for (let i = Math.max(divergenceIndex, 0); i < newTree.length; i++) {
                        newTree[i].containsSelectedCategory(true);
                    }
                }
                newSelection.isSelected(true);
                newSelection.shouldRenderContent(true);
            });
            //Restore previously expanded categories.
            _.forEach((_a = this.preferences.csExpandedCategories()) === null || _a === void 0 ? void 0 : _a.split("\n"), (id) => {
                if ((typeof id === 'string') && this.categoryLookup.hasOwnProperty(id)) {
                    this.categoryLookup[id].isExpanded(true);
                }
            });
            //Save expanded categories in user preferences.
            const expandedCategories = ko.computed(() => {
                //Make a list of category IDs.
                const result = _(this.categoryLookup).filter((category) => {
                    //Skip the root category. It's always expanded.
                    if (category === this.rootCategory) {
                        return false;
                    }
                    //Skip categories that don't have any children.
                    if (category.subcategories().length === 0) {
                        return false;
                    }
                    return category.isExpanded();
                }).map('id').value();
                return result; //TypeScript can't infer that the item type is string.
            }).extend({ rateLimit: { timeout: 100, method: 'notifyWhenChangesStop' } });
            expandedCategories.subscribe((newValue) => {
                this.preferences.csExpandedCategories(newValue.join("\n"));
            });
            //Reselect the previously selected category.
            if (settings.selectedCategory
                && this.categoryLookup.hasOwnProperty(settings.selectedCategory)) {
                this.selectedCategory(this.categoryLookup[settings.selectedCategory]);
            }
            //Render the first couple of categories to push the other category
            //placeholders below the bottom of the viewport.
            _(this.rootCategory.sortedSubcategories()).take(2).forEach(function (c) {
                c.shouldRenderContent(true);
            });
            //Always render the selected category.
            (_b = this.selectedCategory()) === null || _b === void 0 ? void 0 : _b.shouldRenderContent(true);
            this.selectedCategoryId = ko.pureComputed(() => {
                const category = this.selectedCategory();
                if (category === null) {
                    return '';
                }
                return category.id;
            });
        }
        onCategoryEntersViewport(element) {
            const category = ko.dataFor(element);
            if (category instanceof Category) {
                if (console && console.log) {
                    console.log('Rendering category', category.id);
                }
                category.shouldRenderContent(true);
            }
        }
        renderAllCategories() {
            function renderChildren(category) {
                _.forEach(category.sortedSubcategories(), function (c) {
                    c.shouldRenderContent(true);
                    renderChildren(c);
                });
            }
            renderChildren(this.rootCategory);
        }
        saveChanges() {
            this.isSaveButtonEnabled(false);
            this.settingsData(JSON.stringify(this.getCurrentSettings()));
            return true;
        }
        getCurrentSettings() {
            function collectItemsRecursively(category, output = {}) {
                _.forEach(category.items(), function (item) {
                    if (!output.hasOwnProperty(item.id)) {
                        output[item.id] = item.toJs();
                    }
                });
                _.forEach(category.subcategories(), subcategory => collectItemsRecursively(subcategory, output));
                return output;
            }
            return {
                items: collectItemsRecursively(this.rootCategory)
            };
        }
    }
    AmeEasyHide.Model = Model;
})(AmeEasyHide || (AmeEasyHide = {}));
document.addEventListener('DOMContentLoaded', function () {
    if (wsEasyHideData === null) {
        throw new Error('wsEasyHideData is null'); //This should never happen.
    }
    ameEasyHideModel = new AmeEasyHide.Model(wsEasyHideData, ameEhUserPreferences);
    ko.applyBindings(ameEasyHideModel, document.getElementById('ame-easy-hide-container'));
    //Render categories lazily.
    try {
        let lazyUpdateTimer = null;
        const ameEhLazyLoad = new LazyLoad({
            elements_selector: '.ame-eh-lazy-category',
            unobserve_entered: true,
            callback_enter: function (element) {
                //Type note: The instance is assigned above and should never be null here.
                ameEasyHideModel.onCategoryEntersViewport(element);
            }
        });
        jQuery(document).on('adminmenueditor:ehCategoryRendering', function () {
            //New placeholders might be created after rendering a category,
            //so let's update LazyLoad.
            //Debounce updates by ensuring that there's only one pending timer.
            if (lazyUpdateTimer !== null) {
                clearTimeout(lazyUpdateTimer);
            }
            lazyUpdateTimer = setTimeout(function () {
                lazyUpdateTimer = null;
                ameEhLazyLoad.update();
            }, 40);
        });
    }
    catch (ex) {
        //I'm not sure if LazyLoad will actually throw an exception if the user has
        //an old browser that doesn't support IntersectionObserver, but let's fall back
        //to showing all categories if anything goes wrong.
        ameEasyHideModel.renderAllCategories();
    }
    //Handle clicks on the "dismiss" button in the explanatory notice. It wouldn't be safe
    //to use Knockout for this because WordPress automatically moves notices below the first
    //h1/h2 element, and any external DOM manipulation can mess up KO bindings.
    jQuery('#ame-easy-hide-explanation').on('click', '.notice-dismiss', function () {
        if (typeof ameEhIsExplanationHidden !== 'undefined') {
            ameEhIsExplanationHidden(true);
            ameEhIsExplanationHidden.save();
        }
    });
    //We no longer need the input data, so we can potentially free up
    //some memory by clearing it.
    wsEasyHideData = null;
});
//# sourceMappingURL=easy-hide.js.map