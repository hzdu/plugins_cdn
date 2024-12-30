"mousemove touchmove touchstart touchend wheel".split(" ").forEach(function (e) {
    window.addEventListener(e, function () {
        if (window.jQuery) {
            jQuery('body').addClass('penci-ready-js');
        }
    }, false);
});

var menuhbh_mobile = document.querySelector(".button-menu-mobile");
if (menuhbh_mobile !== null) {
    menuhbh_mobile.addEventListener('click', function () {
        if (window.jQuery) {
            return false;
        }
        if (menuhbh_mobile.classList.contains('header-builder')) {
            document.body.classList.toggle("open-mobile-builder-sidebar-nav");
        } else {
            document.body.classList.toggle("open-sidebar-nav");
        }
    });
}
var menuhbh_toggle = document.querySelector(".penci-menuhbg-toggle");
if (menuhbh_toggle !== null) {
    menuhbh_toggle.addEventListener('click', function () {
        if (window.jQuery) {
            return false;
        }
        this.classList.toggle('active');
        document.body.classList.toggle("penci-menuhbg-open");

    });
}
var menuhbh_search = document.querySelector(".pcheader-icon a.search-click");
if (menuhbh_search !== null) {
    menuhbh_search.addEventListener('click', function (e) {
        if (window.jQuery) {
            return false;
        }
        var closet = this.closest('.wrapper-boxed'),
            pbcloset = this.closest('.penci_nav_col'),
            sform = document.querySelector('.show-search');

        if (closet.classList.contains('header-search-style-showup')) {
            this.classList.toggle('active');
            sform.classList.toggle('active');
        } else {
            this.classList.toggle('fade');
            sform.classList.toggle('fade');
        }

        var opentimeout = setTimeout(function () {
            closet.querySelector('.search-input').focus();
            if (pbcloset !== null && !!pbcloset.querySelector('.search-input')) {
                pbcloset.querySelector('.search-input').focus();
            }
        }, 200, function () {
            clearTimeout(opentimeout);
        });

        e.stopPropagation();
        return false;
    });
}

function penci_check_isValidHttpUrl(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}


var links = document.querySelectorAll("a");
if (links !== null) {
    links.forEach((link) => {
        link.addEventListener('click', function (e) {
            if (window.jQuery) {
                return false;
            }
            var linkurl = this.getAttribute('href');
            if (linkurl !== null && penci_check_isValidHttpUrl(linkurl)) {
                window.location.href = linkurl;
            }
        });
        link.addEventListener('ontouchstart', function (e) {
            if (window.jQuery) {
                return false;
            }
            var linkurl = this.getAttribute('href');
            if (linkurl !== null && penci_check_isValidHttpUrl(linkurl)) {
                window.location.href = linkurl;
            }
        });
    });
}


