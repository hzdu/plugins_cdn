"use strict";
/// <reference path="../../../js/knockout.d.ts" />
/// <reference path="../../../js/jquery.d.ts" />
/// <reference path="../../../js/jquery.biscuit.d.ts" />
/// <reference types="@types/lodash" />
/// <reference path="../../../modules/actor-selector/actor-selector.ts" />
class AmeSuperUsers {
    constructor(settings) {
        this.addButtonText = 'Add User';
        this.userEditUrl = settings.userEditUrl;
        this.currentUserLogin = settings.currentUserLogin;
        this.superUsers = ko.observableArray([]);
        AmeSuperUsers._.forEach(settings.superUsers, (userDetails) => {
            var user = AmeUser.createFromProperties(userDetails);
            if (!AmeActors.getUser(user.userLogin)) {
                AmeActors.addUsers([user]);
            }
            this.superUsers.push(user);
        });
        this.superUsers.sort(AmeSuperUsers.compareLogins);
        this.settingsData = ko.computed(() => {
            return AmeSuperUsers._.map(this.superUsers(), 'userId').join(',');
        });
        //Store the state of the info box in a cookie.
        let initialState = jQuery.cookie('ame_su_info_box_open');
        let _isBoxOpen = ko.observable((typeof initialState === 'undefined') ? true : (initialState === '1'));
        this.isInfoBoxOpen = ko.computed({
            read: () => {
                return _isBoxOpen();
            },
            write: (value) => {
                jQuery.cookie('ame_su_info_box_open', value ? '1' : '0', { expires: 90 });
                _isBoxOpen(value);
            }
        });
    }
    removeUser(user) {
        this.superUsers.remove(user);
    }
    getEditLink(user) {
        return this.userEditUrl + '?user_id=' + user.userId;
    }
    selectHiddenUsers() {
        AmeSelectUsersDialog.open({
            selectedUsers: AmeSuperUsers._.map(this.superUsers(), 'userLogin'),
            users: AmeSuperUsers._.keyBy(this.superUsers(), 'userLogin'),
            actorManager: AmeActors,
            currentUserLogin: this.currentUserLogin,
            alwaysIncludeCurrentUser: false,
            save: (selectedUsers) => {
                selectedUsers.sort(AmeSuperUsers.compareLogins);
                this.superUsers(selectedUsers);
            }
        });
    }
    static compareLogins(a, b) {
        if (a.userLogin > b.userLogin) {
            return 1;
        }
        else if (a.userLogin < b.userLogin) {
            return -1;
        }
        return 0;
    }
    formatUserRoles(user) {
        let displayNames = AmeSuperUsers._.map(user.roles, (roleId) => {
            var actor = AmeActors.getActor('role:' + roleId);
            if (actor) {
                return actor.displayName;
            }
            else {
                return '[Unknown role]';
            }
        });
        return displayNames.join(', ');
    }
    toggleInfoBox() {
        this.isInfoBoxOpen(!this.isInfoBoxOpen());
    }
}
AmeSuperUsers._ = wsAmeLodash;
jQuery(function () {
    var superUserVM = new AmeSuperUsers(wsAmeSuperUserSettings);
    ko.applyBindings(superUserVM, document.getElementById('ame-super-user-settings'));
});
//# sourceMappingURL=super-users.js.map