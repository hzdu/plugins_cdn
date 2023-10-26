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

// Remove property with empty value
cleanObj = function (obj) {
    for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
            if (!obj[k]) delete obj[k];
        }
    }
    return obj;
};

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

    // wpfd_list
    var wpfd_category_content = $('.wpfd-all-file-category');
    if (wpfd_category_content.length) {
        var hash_category_id = '';
        var default_hash = window.location.hash;
        default_hash = default_hash.replace('#', '');
        if (default_hash !== '' && default_hash.indexOf('-wpfd-') !== -1) {
            var hasha = default_hash.split('-');
            var re = new RegExp("^(p[0-9]+)$");
            var page = null;
            var stringpage = hasha.pop();

            if (re.test(stringpage)) {
                page = stringpage.replace('p', '');
            }

            hash_category_id = hasha[0];
        }

        if (hash_category_id != 'all_0') {
            wpfd_category_content.each(function() {
                var curCatContentTheme = $(this).attr('data-theme');
                var atts_shortcode = window["wpfdfrontend_" + curCatContentTheme];
                var curCatContent = $(this);
                $.ajax({
                    method: "POST",
                    url: wpfdparams.wpfdajaxurl + "task=categories.contentAllCat",
                    data: {
                        atts_shortcode: atts_shortcode.shortcode_param,
                        wpfdajaxnone: atts_shortcode.wpfdajaxnone
                    },
                    beforeSend: function () {
                        var htmlToAppend = $('#wpfd-loading-wrap').html();
                        curCatContent.html(htmlToAppend);
                    },
                    success: function (result) {
                        if (result.success) {
                            curCatContent.html(result.content);

                            var script = document.createElement('script');
                            script.src = atts_shortcode.wpfdscripturl;
                            document.body.appendChild(script);
                        }
                    }
                })
            })
        }
    }

    function wpfdDownloadFiles() {
        $('.wpfd-single-file.png .wpfd_downloadlink, .wpfd-single-file.jpg .wpfd_downloadlink, .wpfd-single-file.jpeg .wpfd_downloadlink, .wpfd-single-file.gif .wpfd_downloadlink').on('click', function (event) {
            event.preventDefault();
            var fileId = $(this).parents('.wpfd-single-file').data('id');
            var categoryId = $(this).parents('.wpfd-single-file').data('catid');
            var cloudType = $(this).parents('.wpfd-single-file').find('.wpfd_root_category_type').val();

            if (!fileId || !categoryId) {
                return false;
            }

            window.location.href = wpfdparams.site_url + "?wpfd_action=wpfd_download_file&wpfd_file_id=" + fileId + "&wpfd_category_id=" + categoryId + "&cloudType=" + cloudType;
        });
    }
    wpfdDownloadFiles();
});

