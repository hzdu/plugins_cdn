"use strict";
var AmeNavMenuVisibilityUi;
(function (AmeNavMenuVisibilityUi) {
    const loggedInUserActor = new class extends AmeBaseActor {
        constructor() {
            super('special:logged_in_user', 'Logged In Users', {});
        }
        hasOwnCap(capability) {
            //The only capability that *all* roles and users have is the special "exist" capability.
            return (capability === 'exist');
        }
    };
    const anonymousUserActor = new class extends AmeBaseActor {
        constructor() {
            super('special:anonymous_user', 'Logged Out Users', {});
        }
        hasOwnCap(capability) {
            //The only capability that *all* roles and users have is the special "exist" capability.
            return (capability === 'exist');
        }
    };
    class NavigationItem {
        constructor(data, selectedActor) {
            var _a, _b;
            this.label = data.label;
            this.type = data.type;
            this.enabledForActor = new AmeObservableActorFeatureMap(data.settings.grantAccess);
            this.loggedInUsersEnabled = ko.observable((_a = data.settings.loggedInUsers) !== null && _a !== void 0 ? _a : true);
            this.anonymousUsersEnabled = ko.observable((_b = data.settings.anonymousUsers) !== null && _b !== void 0 ? _b : true);
            this.children = data.children.map(childData => new NavigationItem(childData, selectedActor));
            this.passThroughProps = data.passThroughProps;
            this.isChecked = ko.computed({
                read: () => {
                    const currentActor = selectedActor();
                    if (currentActor === null) {
                        return false;
                    }
                    if (currentActor === loggedInUserActor) {
                        return this.loggedInUsersEnabled();
                    }
                    else if (currentActor === anonymousUserActor) {
                        return this.anonymousUsersEnabled();
                    }
                    return this.enabledForActor.isEnabledFor(currentActor, null, true, null, true);
                },
                write: (value) => {
                    const currentActor = selectedActor();
                    if (currentActor === null) {
                        return;
                    }
                    if (currentActor === loggedInUserActor) {
                        this.loggedInUsersEnabled(value);
                    }
                    else if (currentActor === anonymousUserActor) {
                        this.anonymousUsersEnabled(value);
                    }
                    else {
                        this.enabledForActor.setEnabledFor(currentActor, value, null, true);
                    }
                    //Check/uncheck all children when the parent is checked/unchecked.
                    this.children.forEach(child => child.isChecked(value));
                },
                owner: this
            });
            this.isLocked = ko.pureComputed(() => {
                //If the item is disabled for "logged-in users", lock the checkbox when a role
                //or user (or Super Admin) is selected. Those settings have no effect if logged-in
                //users can't see the item at all.
                const currentActor = selectedActor();
                if ((currentActor === null)
                    || (currentActor === loggedInUserActor)
                    || (currentActor === anonymousUserActor)) {
                    return false;
                }
                return !this.loggedInUsersEnabled();
            });
            this.isHidden = ko.pureComputed(() => {
                return !this.isChecked() || this.isLocked();
            });
        }
        toJs() {
            const results = [{
                    settings: {
                        grantAccess: this.enabledForActor.getAll(),
                        loggedInUsers: this.loggedInUsersEnabled(),
                        anonymousUsers: this.anonymousUsersEnabled()
                    },
                    passThroughProps: this.passThroughProps
                }];
            const children = this.children.map(child => child.toJs());
            return results.concat(...children);
        }
    }
    class NavigationMenu {
        constructor(data, selectedActor) {
            this.id = data.id;
            this.label = data.label;
            this.type = data.type;
            this.items = data.items.map(itemData => new NavigationItem(itemData, selectedActor));
        }
        toJs() {
            return {
                id: this.id,
                type: this.type,
                items: this.items.map(item => item.toJs()).flat()
            };
        }
    }
    class VisibilityEditor {
        constructor(data) {
            this.isSaving = ko.observable(false);
            this.settingsToSave = ko.observable('');
            AmeActors.addSpecialActor(loggedInUserActor);
            AmeActors.addSpecialActor(anonymousUserActor);
            const actorSelector = new AmeActorSelector(AmeActors, true, false);
            actorSelector.addSpecialActor(loggedInUserActor);
            actorSelector.addSpecialActor(anonymousUserActor);
            const selectedActor = actorSelector.createActorObservable(ko);
            //Reselect the previously selected actor, or the first one if none was selected.
            if (data.selectedActor && AmeActors.actorExists(data.selectedActor)) {
                selectedActor(AmeActors.getActor(data.selectedActor));
            }
            else {
                selectedActor(loggedInUserActor);
            }
            this.selectedActorId = ko.pureComputed(() => {
                const actor = selectedActor();
                return actor ? actor.getId() : '';
            });
            this.navigationMenus = data.navigationMenus.map(menuData => {
                return new NavigationMenu(menuData, selectedActor);
            });
        }
        saveChanges() {
            this.isSaving(true);
            this.settingsToSave(JSON.stringify({
                menus: this.navigationMenus.map(menu => menu.toJs())
            }));
            return true;
        }
    }
    AmeNavMenuVisibilityUi.VisibilityEditor = VisibilityEditor;
})(AmeNavMenuVisibilityUi || (AmeNavMenuVisibilityUi = {}));
jQuery(function (_) {
    const ui = new AmeNavMenuVisibilityUi.VisibilityEditor(wsAmeNavMenuVisibilityData);
    ko.applyBindings(ui, document.getElementById('ame-nav-menu-visibility-editor'));
});
//# sourceMappingURL=nav-settings.js.map