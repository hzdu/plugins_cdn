/*
 * jQuery Swipe Features
 *
 * Based on tschallacka/npm_jquery_event_swipe
 * https://github.com/tschallacka/npm_jquery_event_swipe
 *
 * Original is ES6+, this is modified to ES5
 *
 * Licensed under MIT license.
 *
 */
jQuery(function ($) {
    var UP = 'up',
        DOWN = 'down',
        LEFT = 'left',
        RIGHT = 'right',
        NONE = 'none';

    var $document = $(document),
        markerClass = 'asp_touchswipe',
        swipedir = null,
        startX = null,
        startY = null,
        distX = null,
        distY = null,
        threshold = 50,
        restraint = 200,
        allowedTime = 300,
        elapsedTime = null,
        startTime = null;

    var handleswipe = function (direction, distance, elapsedTime, deviation, event) {
        var data = {
                direction: direction,
                distance: distance,
                duration: elapsedTime,
                deviation: deviation,
            },
            $source = $(event.srcElement),
            e = $.Event('asp_swipe.' + direction, data);

        // Find the closest marker class instance to trigger the event on
        if( !$source.hasClass(markerClass) ) {
            $source = $source.closest('.' + markerClass);
        }
        if ( $source.length > 0 ) {
            $source.trigger(e);
            e = $.Event('asp_swipe.all', data);
            $source.trigger(e);
        }
    }

    var touchstart = function (event) {
        var e = event.originalEvent;
        var touchobj = e.changedTouches[0];
        swipedir = NONE;
        startX = touchobj.pageX;
        startY = touchobj.pageY;
        startTime = new Date().getTime(); // record time when finger first makes contact with surface
    }


    var touchend = function (event) {
        var e = event.originalEvent;
        var touchobj = e.changedTouches[0];
        distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime; // get time elapsed
        var absX = Math.abs(distX);
        var absY = Math.abs(distY);

        if ( distX > 0 || distY > 0 ) {
            event.stopImmediatePropagation(); // Stop propagating to prevent event fires on "touchstart" and "touchend"
            event.preventDefault();
        }

        if (elapsedTime <= allowedTime) { // first condition for awipe met
            if (absX >= threshold && absY <= restraint) { // 2nd condition for horizontal swipe met
                swipedir = (distX < 0) ? LEFT : RIGHT; // if dist traveled is negative, it indicates left swipe
            } else if (absY >= threshold && absX <= restraint) { // 2nd condition for vertical swipe met
                swipedir = (distY < 0) ? UP : DOWN; // if dist traveled is negative, it indicates up swipe
            }
            var axis = swipedir === UP || swipedir === DOWN,
                distance = axis ? absY : absX,
                deviation = axis ? distX : distY;
            if (distance > threshold) {
                handleswipe(swipedir, distance, elapsedTime, deviation, e);
            }
        }
    }

    $document.on('touchstart', '.' + markerClass,  touchstart);
    $document.on('touchend', '.' + markerClass, touchend);
});
