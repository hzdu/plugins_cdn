"use strict";
/// <reference path="../../../js/knockout.d.ts" />
/// <reference types="@types/lodash" />
/// <reference path="dashboard-widget-editor.ts" />
/// <reference path="../../../js/common.d.ts" />
class AmeDashboardWidget {
    constructor(settings, widgetEditor) {
        this.isPresent = true;
        this.missingWidgetTooltip = "N/A";
        this.canBeDeleted = false;
        this.canChangePriority = false;
        this.canChangeTitle = true;
        this.canBeMoved = true;
        this.propertyTemplate = '';
        this.widgetType = null;
        //"grantAccess" must always be an object. In PHP, it's an associative array, which
        //is converted to a plain array if it's empty.
        if (AmeDashboardWidget._.isArray(settings['grantAccess'])) {
            settings['grantAccess'] = {};
        }
        this.rawProperties = settings;
        this.widgetEditor = widgetEditor;
        this.id = settings['id'];
        this.isPresent = !!(settings['isPresent']);
        this.canBeDeleted = !this.isPresent;
        const self = this;
        this.safeTitle = ko.computed({
            read: function () {
                return AmeDashboardWidget.stripAllTags(self.title());
            },
            deferEvaluation: true //this.title might not be initialised at this point, so skip it until later.
        });
        this.isOpen = ko.observable(false);
        this.areAdvancedPropertiesVisible = ko.observable(true);
        this.grantAccess = new AmeActorAccessDictionary(settings.hasOwnProperty('grantAccess') ? settings['grantAccess'] : {});
        //Indeterminate checkbox state: when the widget is enabled for some roles and disabled for others.
        let _isIndeterminate = ko.observable(false);
        this.isIndeterminate = ko.computed(() => {
            if (widgetEditor.selectedActor() !== null) {
                return false;
            }
            return _isIndeterminate();
        });
        //Is the widget enabled for the selected actor?
        this.isEnabled = ko.computed({
            read: () => {
                let actor = widgetEditor.selectedActor();
                if (actor !== null) {
                    return !!this.actorHasAccess(actor);
                }
                else {
                    //Check if any actors have this widget enabled.
                    //We only care about visible actors. There might be some users that are loaded but not visible.
                    const actors = widgetEditor.actorSelector.getVisibleActors();
                    let areAnyActorsEnabled = false, areAnyActorsDisabled = false;
                    for (let index = 0; index < actors.length; index++) {
                        let hasAccess = this.actorHasAccess(actors[index].getId(), actors[index]);
                        if (hasAccess) {
                            areAnyActorsEnabled = true;
                        }
                        else if (hasAccess === false) {
                            areAnyActorsDisabled = true;
                        }
                    }
                    _isIndeterminate(areAnyActorsEnabled && areAnyActorsDisabled);
                    return areAnyActorsEnabled;
                }
            },
            write: (enabled) => {
                let actor = widgetEditor.selectedActor();
                if (actor !== null) {
                    this.grantAccess.set(actor, enabled);
                }
                else {
                    //Enable/disable all.
                    const actors = widgetEditor.actorSelector.getVisibleActors();
                    for (let index = 0; index < actors.length; index++) {
                        this.grantAccess.set(actors[index].getId(), enabled);
                    }
                }
            }
        });
    }
    static stripAllTags(input) {
        //Based on: http://phpjs.org/functions/strip_tags/
        const tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
        return input.replace(commentsAndPhpTags, '').replace(tags, '');
    }
    createObservableWithDefault(customValue, defaultValue, writeCallback) {
        //Sentinel value: '' (the empty string). Null is also accepted and automatically converted to ''.
        const sentinel = '';
        customValue = writeCallback(customValue, sentinel);
        if ((customValue === defaultValue) || (customValue === null)) {
            customValue = sentinel;
        }
        let _customValue = ko.observable(customValue);
        let observable = ko.computed({
            read: function () {
                let customValue = _customValue();
                if (customValue === sentinel) {
                    return defaultValue;
                }
                else {
                    return customValue;
                }
            },
            write: function (newValue) {
                const oldValue = _customValue();
                let valueToWrite = writeCallback(newValue, oldValue);
                if ((valueToWrite === defaultValue) || (valueToWrite === null)) {
                    valueToWrite = sentinel;
                }
                if (valueToWrite !== oldValue) {
                    _customValue(valueToWrite);
                }
                else if ((valueToWrite !== newValue) || (valueToWrite === sentinel)) {
                    observable.notifySubscribers();
                }
            }
        });
        observable.resetToDefault = function () {
            _customValue(sentinel);
        };
        observable.getCustomValue = function () {
            return _customValue();
        };
        return observable;
    }
    toggle() {
        this.isOpen(!this.isOpen());
    }
    toPropertyMap() {
        let properties = {
            'id': this.id,
            'title': this.title(),
            'location': this.location(),
            'priority': this.priority(),
            'grantAccess': this.grantAccess.getAll()
        };
        properties = AmeDashboardWidget._.merge({}, this.rawProperties, properties);
        if (this.widgetType !== null) {
            properties['widgetType'] = this.widgetType;
        }
        return properties;
    }
    actorHasAccess(actorId, actor, defaultAccess = true) {
        //Is there a setting for this actor specifically?
        let hasAccess = this.grantAccess.get(actorId, null);
        if (hasAccess !== null) {
            return hasAccess;
        }
        if (!actor) {
            actor = AmeActors.getActor(actorId);
        }
        if (actor instanceof AmeUser) {
            //The Super Admin has access to everything by default, and it takes priority over roles.
            if (actor.isSuperAdmin) {
                return this.grantAccess.get('special:super_admin', true);
            }
            //Allow access if at least one role has access.
            let result = false;
            for (let index = 0; index < actor.roles.length; index++) {
                let roleActor = 'role:' + actor.roles[index], roleHasAccess = this.grantAccess.get(roleActor, true);
                result = result || (!!roleHasAccess);
            }
            return result;
        }
        //By default, all widgets are visible to everyone.
        return defaultAccess;
    }
}
AmeDashboardWidget._ = wsAmeLodash;
AmeDashboardWidget.locationToColumnMap = {
    'normal': 0,
    'side': 1,
    'column3': 2,
    'column4': 3
};
AmeDashboardWidget.columnToLocationMap = Object.keys(AmeDashboardWidget.locationToColumnMap);
class AmeStandardWidgetWrapper extends AmeDashboardWidget {
    constructor(settings, widgetEditor) {
        super(settings, widgetEditor);
        this.wrappedWidget = settings['wrappedWidget'];
        this.title = this.createObservableWithDefault(settings['title'], this.wrappedWidget.title, function (value) {
            //Trim leading and trailing whitespace.
            value = value.replace(/^\s+|\s+$/g, "");
            if (value === '') {
                return null;
            }
            return value;
        });
        this.location = this.createObservableWithDefault(settings['location'], this.wrappedWidget.location, function (value) {
            if (value === null) {
                return null;
            }
            if (AmeDashboardWidget.locationToColumnMap.hasOwnProperty(value)) {
                return value;
            }
            return null;
        });
        this.priority = this.createObservableWithDefault(settings['priority'], this.wrappedWidget.priority, function () {
            return null;
        });
        if (!this.isPresent) {
            //Note: This is not intended to be perfectly accurate.
            const wasCreatedByTheme = this.rawProperties.hasOwnProperty('callbackFileName')
                && this.rawProperties['callbackFileName'].match(/[/\\]wp-content[/\\]themes[/\\]/);
            this.missingWidgetTooltip = (wasCreatedByTheme ? 'The theme' : 'The plugin')
                + ' that created this widget is not active.'
                + '\nTo remove the widget, open it and click "Delete".';
        }
    }
    toPropertyMap() {
        let properties = super.toPropertyMap();
        properties['wrappedWidget'] = this.wrappedWidget;
        properties['title'] = this.title.getCustomValue();
        properties['location'] = this.location.getCustomValue();
        properties['priority'] = this.priority.getCustomValue();
        return properties;
    }
}
class AmeCustomHtmlWidget extends AmeDashboardWidget {
    constructor(settings, widgetEditor) {
        const _ = AmeDashboardWidget._;
        settings = _.merge({
            id: 'new-untitled-widget',
            isPresent: true,
            grantAccess: {}
        }, settings);
        super(settings, widgetEditor);
        this.widgetType = 'custom-html';
        this.canChangePriority = true;
        this.title = ko.observable(_.get(settings, 'title', 'New Widget'));
        this.location = ko.observable(_.get(settings, 'location', 'normal'));
        this.priority = ko.observable(_.get(settings, 'priority', 'high'));
        this.content = ko.observable(_.get(settings, 'content', ''));
        this.filtersEnabled = ko.observable(_.get(settings, 'filtersEnabled', true));
        //Custom widgets are always present and can always be deleted.
        this.isPresent = true;
        this.canBeDeleted = true;
        this.propertyTemplate = 'ame-custom-html-widget-template';
    }
    toPropertyMap() {
        let properties = super.toPropertyMap();
        properties['content'] = this.content();
        properties['filtersEnabled'] = this.filtersEnabled();
        return properties;
    }
}
class AmeCustomRssWidget extends AmeDashboardWidget {
    constructor(settings, widgetEditor) {
        const _ = AmeDashboardWidget._;
        settings = _.merge({
            id: 'new-untitled-rss-widget',
            isPresent: true,
            grantAccess: {}
        }, settings);
        super(settings, widgetEditor);
        this.widgetType = 'custom-rss';
        this.canChangePriority = true;
        this.title = ko.observable(_.get(settings, 'title', 'New RSS Widget'));
        this.location = ko.observable(_.get(settings, 'location', 'normal'));
        this.priority = ko.observable(_.get(settings, 'priority', 'high'));
        this.feedUrl = ko.observable(_.get(settings, 'feedUrl', ''));
        this.maxItems = ko.observable(_.get(settings, 'maxItems', 5));
        this.showAuthor = ko.observable(_.get(settings, 'showAuthor', true));
        this.showDate = ko.observable(_.get(settings, 'showDate', true));
        this.showSummary = ko.observable(_.get(settings, 'showSummary', true));
        this.openInNewTab = ko.observable(_.get(settings, 'openInNewTab', false));
        this.isPresent = true;
        this.canBeDeleted = true;
        this.propertyTemplate = 'ame-custom-rss-widget-template';
    }
    toPropertyMap() {
        let properties = super.toPropertyMap();
        let storedProps = ['feedUrl', 'showAuthor', 'showDate', 'showSummary', 'openInNewTab', 'maxItems'];
        const self = this;
        for (let i = 0; i < storedProps.length; i++) {
            let name = storedProps[i];
            const property = self[name];
            if (property && ko.isObservable(property)) {
                properties[name] = property();
            }
        }
        return properties;
    }
}
class AmeWelcomeWidget extends AmeDashboardWidget {
    constructor(settings, widgetEditor) {
        const _ = AmeDashboardWidget._;
        if (_.isArray(settings)) {
            settings = {};
        }
        settings = _.merge({
            id: AmeWelcomeWidget.permanentId,
            isPresent: true,
            grantAccess: {}
        }, settings);
        super(settings, widgetEditor);
        this.title = ko.observable('Welcome');
        this.location = ko.observable('normal');
        this.priority = ko.observable('high');
        this.canChangeTitle = false;
        this.canChangePriority = false;
        this.canBeMoved = false;
        this.areAdvancedPropertiesVisible(false);
        //The "Welcome" widget is part of WordPress core. It's always present and can't be deleted.
        this.isPresent = true;
        this.canBeDeleted = false;
        this.propertyTemplate = 'ame-welcome-widget-template';
    }
    actorHasAccess(actorId, actor, defaultAccess) {
        //Only people who have the "edit_theme_options" capability can see the "Welcome" panel.
        //See /wp-admin/index.php, line #108 or thereabouts.
        defaultAccess = !!AmeActors.hasCapByDefault(actorId, 'edit_theme_options');
        return super.actorHasAccess(actorId, actor, defaultAccess);
    }
}
AmeWelcomeWidget.permanentId = 'special:welcome-panel';
class AmeWidgetPropertyComponent {
    constructor(params) {
        if (typeof params['widget'] === 'undefined') {
            throw new Error('Missing required parameter "widget"');
        }
        if (!(params['widget'] instanceof AmeDashboardWidget)) {
            throw new Error('Parameter "widget" must be an instance of AmeDashboardWidget');
        }
        this.widget = params['widget'];
        this.label = params['label'] ? (String(params['label'])) : '';
    }
}
//Custom element: <ame-widget-property>
ko.components.register('ame-widget-property', {
    viewModel: AmeWidgetPropertyComponent,
    template: {
        element: 'ame-widget-property-template'
    }
});
//# sourceMappingURL=dashboard-widget.js.map