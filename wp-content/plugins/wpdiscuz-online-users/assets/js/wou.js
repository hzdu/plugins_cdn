jQuery(document).ready(function ($) {
    var wouAjaxUrl = wouVars.wouAjaxUrl;
    var checkFrequency = wouVars.wouCheckFrequency;
    var notificationPopupTimeout = wouVars.wouNotificationPopupTimeout;
    var currentUserEmail = wouVars.wouCurrentUserEmail;
    var currentUserName = wouVars.wouCurrentUserName;
    var onlineUsers = wouVars.wouCurrentOnlineUsers;
    var wouIsShowNotificationPopup = parseInt(wouVars.wouIsShowNotificationPopup);
    var usersForNotification = {users: []};
    var pushItems = [];

    if (!isNaN(checkFrequency) && checkFrequency > 0) {
        setTimeout(runAndSetInterval, 5000);
    }

    function runAndSetInterval() {
        wouCheckOnlineUsers();
        setInterval(wouCheckOnlineUsers, checkFrequency);
        if (wouIsShowNotificationPopup) {
            setInterval(wouCheckNotificationItem, 1000);
        }
    }

    function wouCheckOnlineUsers() {
        var data = {email: currentUserEmail, name: currentUserName, onlineUsers: onlineUsers};
        var ajax = wouGetAjax(data, 'wouCheckOnlineUsers');
        ajax.done(function (r) {
            try {
                var obj = JSON.parse(r);
                var userStatuses = $('.wou-status');
                onlineUsers = obj.onlineUsers;
                pushItems = obj.pushItems;
                $.each(userStatuses, function (i) {
                    var userStatus = $(userStatuses[i]);
                    var userUID = $('.wou-uuid', userStatus).val();
                    if (wouVars.wouCurrentUser != userUID) {
                        // online
                        if ($.inArray(userUID, onlineUsers) >= 0) {
                            if ($(userStatus).hasClass('wou-status-offline')) {
                                $(userStatus).removeClass('wou-status-offline');
                                $(userStatus).addClass('wou-status-online');
                                $('.wou-status-phrase', userStatus).text(wouVars.wouPhraseStatusOnline);
                                $(userStatus).attr('wpd-tooltip', wouVars.wouPhraseStatusOnline);
                            }
                        } else { // offline
                            if ($(userStatus).hasClass('wou-status-online')) {
                                $(userStatus).removeClass('wou-status-online');
                                $(userStatus).addClass('wou-status-offline');
                                $('.wou-status-phrase', userStatus).text(wouVars.wouPhraseStatusOffline);
                                $(userStatus).attr('wpd-tooltip', wouVars.wouPhraseStatusOffline);
                                var itemUuid = $('.wou-notification-item input[value="' + userUID + '"]');
                                if (itemUuid.length) {
                                    var itemParent = itemUuid.parent();
                                    $('.wou-close-modal', itemParent).trigger('click');
                                }
                            }
                        }
                    }
                });

                usersForNotification.users = pushItems;

                if (wouIsShowNotificationPopup && usersForNotification.users.length) {
                    var ajaxPushNotification = wouGetAjax(usersForNotification, 'wouPushNotification');
                    ajaxPushNotification.done(function (pushR) {
                        try {
                            var pushObj = JSON.parse(pushR);
                            var items = pushObj.data;
                            if (items) {
                                $('#wou-notification-popup').show();
                                $.each(usersForNotification.users, function (i) {
                                    var item = $(items[i]);
                                    var itemUuid = usersForNotification.users[i].email;
                                    var existItem = $('#wou-notification-popup .wou-notification-item :input[value="' + itemUuid + '"]');
                                    if (existItem.length) {
                                        var parent = existItem.parents('.wou-notification-item');
                                        $('.wou-notification-item-time', parent).val(notificationPopupTimeout);
                                    } else {
                                        $('#wou-notification-popup-flex').append(item);
                                        item.fadeIn(500);
                                    }
                                });
                                usersForNotification.users = [];
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    });
                }
            } catch (e) {
                console.log(e);
            }
        });
    }

    function wouEmptyNotificationContainer() {
        if ($('#wou-notification-popup .wou-notification-item').length == 0) {
            $('#wou-notification-popup').hide();
        }
    }

    function wouCheckNotificationItem() {
        $('#wou-notification-popup .wou-notification-item').each(function () {
            var time = $('.wou-notification-item-time', this).val();
            $('.wou-notification-item-time', this).val(--time);
            if ($('.wou-notification-item-time', this).val() <= 0) {
                $(this).remove();
                wouEmptyNotificationContainer();
            }
        });
    }

    $(document).on('click', '.wou-close-modal', function () {
        var btn = $(this);
        var parent = btn.parents('.wou-notification-item');
        parent.fadeOut(250, function () {
            parent.remove();
            wouEmptyNotificationContainer();
        });
    });

    /**
     * create and return ajax object for given action
     */
    function wouGetAjax(data, action) {
        return $.ajax({
            type: 'POST',
            url: wouAjaxUrl,
            data: {
                wouAjaxData: JSON.stringify(data),
                action: action
            }
        });
    }
});