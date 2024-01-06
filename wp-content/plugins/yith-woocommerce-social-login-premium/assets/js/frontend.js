jQuery(function ($) {
    "use strict";

    $( document ).on( 'click', '.show-ywsl-box', function (e) {
        e.preventDefault();
        $('.ywsl-box').slideToggle();
    });

    $( document ).on( 'click', '.ywsl-social', function (e) {
        e.preventDefault();
        window.location.href = ywsl[$(this).data('social')];
    });
});

var href = window.location.href,
    path = window.location.origin + window.location.pathname,
    hash = href.replace(path, '');

if ((hash === '#') || (hash === '#_=_')) {
    history.replaceState(null, null, path);
}