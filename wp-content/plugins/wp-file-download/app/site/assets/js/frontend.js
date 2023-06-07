/**
 * WP File Download
 *
 * @package WP File Download
 * @author Joomunited
 * @version 1.0
 */
function preloader() {
    jQuery('.wpfd-loading').css('background',"transparent url("+wpfdfrontend.pluginurl + "/app/site/assets/images/theme/loadingfile.svg) no-repeat center center");
}
function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            if (oldonload) {
                oldonload();
            }
            func();
        }
    }
}
function wpfdSendTrackingEventThenDownload(Action, Label, Url) {
    "use strict";
    var rtn = false;
    if (typeof (_gaq) !== "undefined") {
        _gaq.push(['_trackEvent', 'WPFD', Action, Label]);
        rtn = true;
    }

    if (typeof (ga) !== "undefined") {
        try {
            var trackers = window.ga.getAll();
            // Send event to all trackers
            trackers.forEach(function(tracker) {
                var trackerName = tracker.get('name');
                if (trackerName) {
                    ga(trackerName + '.send', 'event', 'WPFD', Action, Label);
                }
            });
        } catch (error) {
            console.log(error);
        }
        rtn = true;
    }

    if (typeof (gtag) !== "undefined") {
        gtag('event', Action, {
            'event_category' : 'WPFD',
            'event_label' : Label
        });
        rtn = true;
    }

    return rtn;
}
function wpfdTrackDownload() {
    if(typeof (wpfdparams) !== "undefined" && wpfdparams.ga_download_tracking === "1") {
        jQuery(document).on('click', 'a.wpfd_downloadlink', function(e) {
            var href = jQuery(this).attr('href');
            var extLink = href.replace(/^https?\:\/\//i, '');

            wpfdSendTrackingEventThenDownload('Download', extLink, href);
        })

        //run below code when open preview on new tab
        .on('click', 'a.wpfd_previewlink', function(e) {
            var href = jQuery(this).attr('href');
            var extLink = href.replace(/^https?\:\/\//i, '');

            wpfdSendTrackingEventThenDownload('Preview', extLink, href);
        });
    }
}

function wpfd_remove_loading(el) {
    jQuery('.wpfd-loading', el).remove();
}
window.wpfdAjax = {};
jQuery(document).ready(function($) {
    addLoadEvent(preloader);
    wpfdTrackDownload();
    $(document).on('click', '.wpfd-open-tree', function (e) {
        var $this = $(this);
        var tree = $this.parent().find('.wpfd-foldertree');

        // tree.toggleClass('tree-open');
        if (tree.hasClass('tree-open')) {
            tree.slideUp(500).removeClass('tree-open');
        } else {
            tree.slideDown(500).addClass('tree-open');
        }
    });
    $(document).on('wpfd:category-loaded', function (e) {
        var tree2 = $('.wpfd-foldertree');
        // Hide all opened left tree
        if (tree2.hasClass('tree-open')) {
            tree2.slideUp(500).removeClass('tree-open');
        }
    });
});

