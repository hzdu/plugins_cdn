/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//Header fixed Js
$(window).scroll(function () {
    var scroll = $(window).scrollTop();

    if (scroll >= 150) {
        $("header").addClass("fixed-header").addClass("animated fadeIn");

    } else {
        $("header").removeClass("fixed-header").removeClass("animated fadeIn");

    }
});


function onScroll(event) {
    var scrollPos = $(document).scrollTop();
    $('.nav-wrapper a').each(function () {
        var currLink = $(this);
        var refElement = $(currLink.attr("href"));
        /*if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
            $('.nav-wrapper ul li a').removeClass("active");
            currLink.addClass("active");
        } else {
            currLink.removeClass("active");
        }*/
    });
}

$(document).ready(function () {
    $('.mob_list').click(function (e) {
        $('.header-list').toggleClass('active');
        e.preventDefault();
    });
});